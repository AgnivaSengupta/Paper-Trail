import BlogPost from "../models/BlogPost";
import Comment from "../models/Comment";
import type { Request, Response } from "express";
import extractImages from "../utils/extractImages";
import MediaAsset from "../models/MediaAsset";
import { generateUniqueSlug } from "../utils/generateUniqueSlug";

// Whitelist of fields that a user is allowed to update on a post
const ALLOWED_UPDATE_FIELDS = ["title", "content", "coverImageUrl", "tags", "isDraft"] as const;
type AllowedUpdateField = typeof ALLOWED_UPDATE_FIELDS[number];

// create a new blog post
// @route POST/api/post
// admin only
const createPost = async (req: Request, res: Response) => {
  try {
    // console.log(req.body);
    const { title, content, coverImageUrl, tags, isDraft } = req.body;
    const user = req.user;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyPostCount = await BlogPost.countDocuments({
      author: user?.id,
      createdAt: { $gte: startOfMonth },
    });

    if (monthlyPostCount >= 10) {
      return res.status(403).json({
        msg: "You have reached your monthly limit of 10 blog posts",
      });
    }
    const slug = await generateUniqueSlug(title);

    const newPost = new BlogPost({
      title,
      slug,
      content,
      coverImageUrl,
      tags,
      author: user?.id,
      isDraft,
    });

    await newPost.save();

    const usedImageUrls = extractImages(content.json);
    usedImageUrls.push(coverImageUrl);

    if (usedImageUrls.length > 0) {
      await MediaAsset.updateMany(
        { url: { $in: usedImageUrls } },
        { $set: { status: "active" } },
      );
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error("[createPost] Error:", error);
    res.status(500).json({ msg: "Failed to create post" });
  }
};

// update existing post
// @route PUT/api/post/:id
// admin only
const updatePost = async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.author.toString() !== req.user?.id && req.user.role != "admin") {
      return res.status(403).json({ msg: "Not authorized to update the post" });
    }

    let oldUsedImageUrls: string[] = [];
    if (post.content?.json) {
      oldUsedImageUrls = extractImages(post.content.json);
      if (post.coverImageUrl) {
        oldUsedImageUrls.push(post.coverImageUrl);
      }
    }

    // Only pick explicitly allowed fields to prevent mass assignment
    const sanitizedData: Partial<Record<AllowedUpdateField, unknown>> = {};
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (field in req.body) {
        sanitizedData[field] = req.body[field];
      }
    }

    if (sanitizedData.title) {
      (sanitizedData as Record<string, unknown>).slug = await generateUniqueSlug(
        sanitizedData.title as string,
        req.params.id,
      );
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      { new: true },
    );

    let usedImageUrls: string[] = [];
    if ((sanitizedData.content as { json?: unknown })?.json) {
      usedImageUrls = extractImages((sanitizedData.content as { json: unknown }).json);
      if (sanitizedData.coverImageUrl) {
        usedImageUrls.push(sanitizedData.coverImageUrl as string);
      }

      if (usedImageUrls.length > 0) {
        await MediaAsset.updateMany(
          { url: { $in: usedImageUrls } },
          { $set: { status: "active" } },
        );
      }
    }

    const updatedSet = new Set(usedImageUrls);
    const removedImageUrls = oldUsedImageUrls.filter(item => !updatedSet.has(item));

    if (removedImageUrls.length > 0) {
      await MediaAsset.updateMany(
        { url: { $in: removedImageUrls } },
        { $set: { status: "pending" } },
      );
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("[updatePost] Error:", error);
    res.status(500).json({ msg: "Failed to update post" });
  }
};

// delete a post
// @route DELETE/api/post/:id
// admin only
const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    let oldUsedImageUrls: string[] = [];
    if (post.content?.json) {
      oldUsedImageUrls = extractImages(post.content.json);
      if (post.coverImageUrl) {
        oldUsedImageUrls.push(post.coverImageUrl);
      }
    }

    if (oldUsedImageUrls.length > 0) {
      await MediaAsset.updateMany(
        { url: { $in: oldUsedImageUrls } },
        { $set: { status: "pending" } },
      );
    }

    // Cascade-delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    console.error("[deletePost] Error:", error);
    res.status(500).json({ msg: "Failed to delete post" });
  }
};

// get blog posts by status (all, published, draft) and include count
// @route GET/api/post?status=published|draft|all&page=1
// public
const getAllPosts = async (req: Request, res: Response) => {
  try {
    // console.log("1. Controller hit");
    // console.log("2. User is:", req.user);

    const status = req.query.status || "published";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const skip = (page - 1) * limit;

    // Determine filter for main posts response
    let filter: { isDraft?: boolean } = {};
    if (status === "published") {
      filter.isDraft = false;
    } else if (status === "draft") {
      filter.isDraft = true;
    }

    // Fetch paginated posts
    const posts = await BlogPost.find(filter)
      .populate("author", "name profilePic")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    // .lean();

    // Count totals for pagination and tab counts
    const [totalCount, allCount, publishedCount, draftCount] =
      await Promise.all([
        BlogPost.countDocuments(filter), // for pagination of current tab
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true }),
      ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      allCount,
      counts: {
        all: allCount,
        published: publishedCount,
        draft: draftCount,
      },
    });
  } catch (error) {
    console.error("[getAllPosts] Error:", error);
    res.status(500).json({ msg: "server error" });
  }
};

// get posts written by user
// @route GET/api/post
// private
const getAllPostsByUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const status = req.query.status || "published";
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const skip = (page - 1) * limit;

    let filter: { author: string; isDraft?: boolean } = {
      author: user.id,
    };

    if (status === "published") {
      filter.isDraft = false;
    } else if (status === "draft") {
      filter.isDraft = true;
    }

    const posts = await BlogPost.find(filter)
      .populate("author", "name profilePic")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count totals for pagination and tab counts
    const [totalCount, allCount, publishedCount, draftCount] =
      await Promise.all([
        BlogPost.countDocuments(filter), // for pagination of current tab
        BlogPost.countDocuments(),
        BlogPost.countDocuments({ isDraft: false }),
        BlogPost.countDocuments({ isDraft: true }),
      ]);

    res.json({
      posts,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      allCount,
      counts: {
        all: allCount,
        published: publishedCount,
        draft: draftCount,
      },
    });
  } catch (error) {
    console.error("[getAllPostsByUser] Error:", error);
    res.status(500).json({ msg: "Server error while fetching the posts." });
  }
};

// get posts by slug
// @route GET/api/posts/slugs/:slug
// public

const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug }).populate(
      "author",
      "_id name profilePic",
    );

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
  }
};

// @route GET/api/post/tag/:tag
const getPostByTag = async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.find({
      tags: req.params.tag,
      isDraft: false,
    }).populate("author", "name profilePic");
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
  }
};

// @route GET/api/post/search?q=keyword
const searchPosts = async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    if (!q || typeof q !== "string" || q.trim() === "") {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Escape special regex characters to prevent ReDoS attacks
    const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const post = await BlogPost.find({
      isDraft: false,
      $or: [
        { title: { $regex: escapedQ, $options: "i" } },
        { "content.html": { $regex: escapedQ, $options: "i" } },
      ],
    }).populate("author", "name profilePic");

    res.json(post);
  } catch (error) {
    console.error("[searchPosts] Error:", error);
    res.status(500).json({ msg: "server error" });
  }
};

// @route PUT/api/post/:id/view

const incrementView = async (req: Request, res: Response) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ msg: "View incremented" });
  } catch (error) {
    console.error("[controller] Error:", error);
    res.status(500).json({ msg: "server error" });
  }
};

// @route PUT/api/post/:id/like

const likePost = async (req: Request, res: Response) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.json({ msg: "Likes incremented" });
  } catch (error) {
    console.error("[controller] Error:", error);
    res.status(500).json({ msg: "server error" });
  }
};

// @route GET/api/post/trending
// get top trending posts --> private
const getLatestPosts = async (req: Request, res: Response) => {
  try {
    // top performing posts
    const posts = await BlogPost.find({ isDraft: false })
      .populate("author", "name profilePic")
      .sort({ updatedAt: -1 })
      .limit(8);

    res.json({ posts });
  } catch (error) {
    console.error("[controller] Error:", error);
    res.status(500).json({ msg: "server error" });
  }
};

export {
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
};
