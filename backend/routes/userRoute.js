// routes/userRoute.js
import express from "express";
import { 
    Login, 
    Register, 
    follow, 
    getMyProfile, 
    getOtherUsers, 
    logout, 
    unfollow, 
    updateProfilePicture, 
    updateProfile 
} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
import { upload } from "../controllers/userController.js";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").get(logout);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/profile/:id").put(isAuthenticated, updateProfile);
router.route("/profile/:id/picture").put(upload.single("profilePicture"), updateProfilePicture);

export default router;