import BlogPost from "../models/BlogPost";
import type { Request, Response } from "express";
import extractImages from "../utils/extractImages";
import MediaAsset from "../models/MediaAsset";

// create a new blog post
// @route POST/api/post
// admin only
const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImageUrl, tags, isDraft } = req.body;
    const user = req.user;
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // remove non-word except spaces & hyphens
      .trim() // remove leading/trailing spaces
      .replace(/\s+/g, "-"); // replace spaces with hyphens

    const newPost = new BlogPost({
      title,
      slug,
      content,
      coverImageUrl,
      tags,
      author: user._id,
      isDraft,
    });
    
    await newPost.save();

    const usedImageUrls = extractImages(content.json);
    
    if (usedImageUrls.length > 0){
      await MediaAsset.updateMany(
        { url: { $in: usedImageUrls } },
        { $set: { status: 'active' } },
      );
    };
    
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to create post", error });
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
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role != "admin"
    ) {
      return res.status(403).json({ msg: "Not authorized to update the post" });
    }

    const updatedData = req.body;

    if (updatedData.title) {
      updatedData.slug = updatedData.title
        .tolowercase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.json(updatedData);
  } catch (error) {
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

    await post.deleteOne();
    res.status(200).json({ msg: "Post deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to delete post. Server error: ", error });
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
      .limit(limit)
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
    res.status(500).json({ msg: "server error", error });
  }
};

// get posts written by user
// @route GET/api/post
// private
const getAllPostsByUser = async (req:Request, res:Response) => {
  try{
    const user = req.user;
    
    const status = req.query.status || 'published';
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const skip = (page - 1) * limit;
    
    let filter: {author: string, isDraft?: boolean} = {
      author: user._id
    }
    
    if (status === 'published'){
      filter.isDraft = false;
    } else if (status === 'draft'){
      filter.isDraft = true;
    }
    
    const posts = await BlogPost.find(filter)
      .populate("author", "name profilePic")
      .sort({updatedAt: -1})
      .skip(skip)
      .limit(limit)
    
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
    
  } catch (error){
    res.status(500).json({ msg: "Server error while fetching the posts.", error });
  }
}

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
    const post = await BlogPost.find({
      isDraft: false,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).populate("author", "name profilePic");

    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
  }
};

// @route PUT/api/post/:id/view

const incrementView = async (req: Request, res: Response) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ msg: "View incremented" });
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
  }
};

// @route PUT/api/post/:id/like

const likePost = async (req: Request, res: Response) => {
  try {
    await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    res.json({ msg: "Likes incremented" });
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
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

    res.json({posts});
  } catch (error) {
    res.status(500).json({ msg: "server error", error });
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
