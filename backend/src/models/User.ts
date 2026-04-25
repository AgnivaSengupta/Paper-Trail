// const mongoose = require("mongoose")
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // These fields are managed by Better Auth natively (image, emailVerified, etc.)
    // but Mongoose can still manage these custom profile fields!
    profilePic: { type: String, default: null }, // Note: Better Auth uses 'image' natively, but you can keep profilePic
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    title: { type: String, default: "" },
    socials: { type: String, default: "" },
    skills: { type: [String], default: [], validate: { validator: function (v: string[]) { return v.length <= 10 }, message: 'Cannot have more than 10 skills.' } },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
