import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { Types } from "mongoose";

const secret = process.env.JWT_SECRET;
console.log("JWT_SECRET:", secret);

if (!secret) {
  console.log("JWT_SECRET:", secret);
  throw new Error("JWT secrert not read from env file");
}

const generateToken = (userId: Types.ObjectId) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profileImageUrl, bio, adminAccessToken } =
      req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //let role = 'member';

    // if (adminAccessToken && adminAccessToken == process.env.ADMIN_ACCESS_TOKEN){
    //     role = 'admin';
    // }

    // creating the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profileImageUrl,
      bio,
      // role,
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profilePic: newUser.profilePic,
      bio: newUser.bio,
      // role,
      msg: "User successfully registered!",
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
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
export { registerUser, loginUser, getUserProfile, logOut };
