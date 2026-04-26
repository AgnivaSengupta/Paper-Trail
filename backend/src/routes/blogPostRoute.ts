import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostBySlug,
  getPostByTag,
  searchPosts,
  incrementView,
  likePost,
  getLatestPosts,
  getAllPostsByUser,
} from "../controllers/blogPostController";

import protect from "../middleware/authMiddleware";

const router: Router = express.Router();

// admin-only checking middleware
const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Admin access only" });
  }
};

// 1 view per IP per hour per post
const viewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1,
  keyGenerator: (req) => `view:${req.params.id}:${ipKeyGenerator(req.ip ?? "")}`,
  message: { msg: "You already viewed this post recently" },
  standardHeaders: true,
  legacyHeaders: false,
});

// 1 like per IP per day per post
const likeLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1,
  keyGenerator: (req) => `like:${req.params.id}:${ipKeyGenerator(req.ip ?? "")}`,
  message: { msg: "You already liked this post recently" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", protect, createPost);
// router.post('/', createPost);
router.get("/", getAllPosts);
router.get("/byuser", protect, getAllPostsByUser);
router.get("/slugs/:slug", getPostBySlug);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/tag/:tag", getPostByTag);
router.get("/search", searchPosts);
router.post("/:id/view", viewLimiter, incrementView);
router.post("/:id/like", likeLimiter, likePost);
router.get("/latest", getLatestPosts);

const blogPostRouter = router;
export default blogPostRouter;
