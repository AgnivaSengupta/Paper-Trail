import express, { Router } from "express"
import protect from "../middleware/authMiddleware"
import upload from "../controllers/uploadController"

const router: Router = express.Router()

router.get("/get-upload-url", protect, upload);

const uploadRouter = router;
export default uploadRouter;