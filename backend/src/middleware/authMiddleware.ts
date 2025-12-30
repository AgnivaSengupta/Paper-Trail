import jwt from "jsonwebtoken";
import User from "../models/User";
import type { Request, Response, NextFunction } from "express";
import { Document, Types } from "mongoose";

interface JwtPayload {
  id: string;
//  iat?: number; // issued at timestamp
  // exp?: number; // expiration timestamp
}

interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profilePic?: string | null;
  bio?: string;
  location?: string;
  title?: string;
  socials?: string;
  skills: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // req.user = ...: The entire result of the database query—the user document (without the password)—is assigned to a new property on the request object called user.
    // This makes the user's information accessible in all subsequent middleware and route handlers in the request-response cycle.
    const user = (await User.findById(decoded.id).select("-password")) as IUser;
    //console.log(req.user)

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    // console.log("token", token);
    // console.log("Cookie- ", req.cookies.token);
    next();
  } catch (error) {
    console.error("Auth Middleware Error:",);
    return res.status(401).json({ msg: "Not authorized, invalid token" });
  }
};

export default protect;
