import express, { Router } from "express";
import type { Request, Response, NextFunction } from "express";
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
  getTopPosts,
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

router.post("/", protect, createPost);
// router.post('/', createPost);
router.get("/", getAllPosts);
router.get("/slugs/:slug", getPostBySlug);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);
router.get("/tag/:tag", getPostByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", likePost);
router.get("/trending", getTopPosts);

const blogPostRouter = router;
export default blogPostRouter;
