// const mongoose = require("mongoose")
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePic: {type:String, default: null},
    bio: {type: String, default: ""},
    // role: {type: String, enum: ['admin', 'member'], default: 'member'}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema);
export default User;