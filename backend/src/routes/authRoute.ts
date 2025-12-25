import express, { Router} from 'express'
import { getUserProfile, loginUser, registerUser, logOut, verifyEmail, updateProfile, googleLogin } from '../controllers/authController'
import protect from '../middleware/authMiddleware';

const router: Router = express.Router();

// Auth route
router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.post('/logout', protect, logOut);

const authRouter = router;
export default authRouter;