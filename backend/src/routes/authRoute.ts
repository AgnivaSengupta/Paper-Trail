import express, { Router} from 'express'
import { getUserProfile, loginUser, registerUser, logOut } from '../controllers/authController'
import protect from '../middleware/authMiddleware';

const router: Router = express.Router();

// Auth route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post('/logout', protect, logOut);

const authRouter = router;
export default authRouter;