// controllers/userController.js
import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
export const upload = multer({ storage });

// User Registration
export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "User already exists.",
                success: false,
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 16);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// User Login
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required.",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        return res.status(201)
            .cookie("token", token, { httpOnly: true })
            .json({
                message: `Welcome back ${user.name}`,
                user,
                success: true,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Logout
export const logout = (req, res) => {
    return res.cookie("token", "", { expires: new Date(0) }).json({
        message: "User logged out successfully.",
        success: true,
    });
};

// Follow a User
export const follow = async (req, res) => {
    try {
        const { id: loggedInUserId } = req.body;
        const { id: userId } = req.params;

        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (!user.followers.includes(loggedInUserId)) {
            await user.updateOne({ $push: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $push: { following: userId } });
        } else {
            return res.status(400).json({
                message: `User already followed ${user.name}`,
            });
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just followed ${user.name}`,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Unfollow a User
export const unfollow = async (req, res) => {
    try {
        const { id: loggedInUserId } = req.body;
        const { id: userId } = req.params;

        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);

        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } });
            await loggedInUser.updateOne({ $pull: { following: userId } });
        } else {
            return res.status(400).json({ message: "User is not followed yet." });
        }

        return res.status(200).json({
            message: `${loggedInUser.name} unfollowed ${user.name}`,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// Update Profile Picture
export const updateProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
                success: false,
            });
        }

        const filePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(
            id,
            { profilePicture: filePath },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Profile picture updated successfully",
            success: true,
            profilePicture: filePath,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
// Get My Profile
export const getMyProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find user by ID
        const user = await User.findById(id).select("-password"); // Exclude password for security

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
// Get Other Users (excluding the logged-in user)
export const getOtherUsers = async (req,res) =>{ 
    try {
         const {id} = req.params;
         const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
         if(!otherUsers){
            return res.status(401).json({
                message:"Currently do not have any users."
            })
         };
         return res.status(200).json({
            otherUsers
        })
    } catch (error) {
        console.log(error);
    }
}
// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, username, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, username, bio },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
