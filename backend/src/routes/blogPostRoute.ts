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

router.post("/", protect, createPost);
// router.post('/', createPost);
router.get("/", getAllPosts);
router.get("/byuser", protect, getAllPostsByUser);
router.get("/slugs/:slug", getPostBySlug);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/tag/:tag", getPostByTag);
router.get("/search", searchPosts);
router.post("/:id/view", incrementView);
router.post("/:id/like", likePost);
router.get("/latest", getLatestPosts);

const blogPostRouter = router;
export default blogPostRouter;
