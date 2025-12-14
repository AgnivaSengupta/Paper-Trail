import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { generateOTP, hashOtp } from "../utils/otp_utils";
import { mailTrapClient, sender, sendTestEmail } from "../utils/resendClient";
import { otpEmail } from "../utils/email";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT secrert not read from env file");
}

const generateToken = (userId: Types.ObjectId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = generateOTP();
    newUser.verificationToken = hashOtp(otp);
    newUser.verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await newUser.save();

    // email verification
    try {
      // await mailTrapClient.send({
      //   from: sender,
      //   to: newUser.email,
      //   subject: "Verify your email",
      //   html: otpEmail.replace("{{OTP_CODE}}", otp),
      //   category: "Email verification",
      // });
      
      await sendTestEmail(otpEmail.replace("{{OTP_CODE}}", otp))
    } catch (emailError) {
      console.error("Email send failed:", emailError);

      return res.status(500).json({
        msg: "Account created, but failed to send verification email. Please try again.",
        userId: newUser._id,
      });
    }

    res.status(201).json({
      msg: "Registration Successfull. Please verify your email.",
      userId: newUser._id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "Invalid user" });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return res.status(400).json({ msg: "No verification in progress" });
    }

    if (Date.now() > user.verificationTokenExpiresAt.getTime()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (hashOtp(otp) != user.verificationToken) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(500).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(500).json({ msg: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      //secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      //role: user.role,
      msg: "Login successfull",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      //role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};

const logOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      msg: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error - Not logged out!" });
  }
};
export { registerUser, verifyEmail, loginUser, getUserProfile, logOut };
