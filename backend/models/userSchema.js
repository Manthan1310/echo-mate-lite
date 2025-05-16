// models/userSchema.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        default: "",
        maxlength: 160
    },
    profilePicture: {
        type: String,
        default: "default-avatar.png",
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
