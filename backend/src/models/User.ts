// const mongoose = require("mongoose")
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    profilePic: { type: String, default: null },
    bio: { type: String, default: "" },
    location: {type: String, default: ""},
    title: { type: String, default: ""},
    socials: {type: String, default: ""},
    
    skills: {type: [String], default: [], validate: {validator: function(v){return v.length <= 10}, message: 'Cannot have more than 10 skills.'}},
    lastLogin: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },

    resetPasswordToken: String, // used during reset password phase
    resetPasswordExpiresAt: Date,

    verificationToken: String, // for sending verification code to the user
    verificationTokenExpiresAt: Date,

    verificationAttempts: {
      type: Number,
      default: 0,
    },

    verificationResendCount: {
      type: Number,
      default: 0,
    },

    verificationLastSentAt: Date,
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
export default User;
