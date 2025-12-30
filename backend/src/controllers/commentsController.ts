import Comment from "../models/Comment";
import BlogPost from "../models/BlogPost";
import type { Request, Response } from "express";
import mongoose, { Document, Types } from "mongoose";

export interface IComment extends Document {
  post: Types.ObjectId | { title: string; coverImageUrl?: string }; // populated post
  author: Types.ObjectId | { name: string; profilePic?: string }; // populated author
  content: string;
  parentComment?: Types.ObjectId | null;
  ancestors: Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  // replies?: IComment[]; // for nested comments
}

// =================================================================================================================================================
const createComment = async (req:Request, res:Response) => {
  try{
    const { _id: authorId } = req.user;
    // const author = { name, profilePic };
    
    const { content, post, parentComment } = req.body;
    let ancestors: mongoose.Types.ObjectId[] = [];
    
    // If parent exists -> meaning its a reply to some comment
    if (parentComment){
      const parent = await Comment.findById(parentComment); // find the parent Comment
      if (!parent) return res.status(400).json({ msg: "Parent not found" });
      
      // now we construct the new ancestor array -> parentId + parent's ancestor array
      ancestors = [...parent.ancestors, parent._id as mongoose.Types.ObjectId];
    }
    // Else its a new root level comment
    const newComment = await Comment.create({
      post,
      content,
      author: authorId,
      parentComment: parentComment || null,
      ancestors,
      postAuthor: post.author._id,
    });
    
    res.status(201).json(newComment);
  } catch (error){
    console.log("Add comment controller error: ", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
}


// Add a comment to a blog post
// @route POST/api/comments/:postId
// private
const addComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, parentComment } = req.body;

    // checking if the post exists or not
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not exist" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentComment || null,
    });

    await comment.populate("author", "name profilePic");
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ msg: "Failed to add comment", error });
  }
};

// Todo --> need to make it type safe
const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate("author", "name profilePic")
      .populate("post", "title coverImageUrl")
      .sort({ createdAt: -1 });

    // const commentMap: Record<string, any> = {};

    // comments.forEach((comment) => {
    //   const c: any = comment.toObject(); // ignore TS
    //   c.replies = [];
    //   commentMap[c._id.toString()] = c;
    // });

    // const nestedComments: any[] = [];
    // comments.forEach((comment) => {
    //   const c: any = commentMap[comment._id.toString()];
    //   if (c.parentComment) {
    //     const parent: any = commentMap[c.parentComment];
    //     if (parent) parent.replies.push(c);
    //     else nestedComments.push(c);
    //   } else {
    //     nestedComments.push(c);
    //   }
    // });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ msg: "Failed to get comment for the post", error });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    await Comment.deleteOne({ _id: commentId });

    await Comment.deleteMany({ parentComment: commentId });

    res.json({ msg: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete comment", error: err });
  }
};

// get all direct comments for a user --> to be shown in the user inbox
const getAllComments = async (req: Request, res: Response) => {
  try {
    // fetch all comments with author populated
    // const comments = await Comment.find()
    //     .populate("author", "name profilePic")
    //     .populate("post", "title coverImageUrl")
    //     .sort({ createdAt: 1 }) // replies come in order

    //     const commentMap: Record<string, any> = {}; // cast to any
    //     comments.forEach(comment => {
    //         const c: any = comment.toObject(); // ignore TS
    //         c.replies = [];
    //         commentMap[c._id] = c;
    //     });

    //     const nestedComments: any[] = [];
    //     comments.forEach(comment => {
    //         const c: any = commentMap[comment._id.toString()];
    //         if (c.parentComment) {
    //             const parent: any = commentMap[c.parentComment.toString()];
    //             if (parent) parent.replies.push(c);
    //             else nestedComments.push(c);
    //         } else {
    //             nestedComments.push(c);
    //         }
    //     })

    // res.json(nestedComments);

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5;
    const skip = (page - 1) * limit;
    
    const filter : {
      postAuthor: string,
      hasReplied: boolean,
      parentComment: null,
    } = {
      postAuthor: req.user._id,
      hasReplied: false,
      parentComment: null,
    }
    
    const inbox = await Comment.find(filter)
      .populate("author", "name profilePic")
      .populate("post", "title")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Comment.countDocuments(filter)
    
    res.json({
      inbox,
      page,
      totalCount,
      totalPages: Math.ceil(totalCount / limit)
    })
    
  } catch (error) {
    res.status(500).json({ msg: "Failed to get all comments", error });
  }
};

export { addComment, deleteComment, getAllComments, getCommentsByPost, createComment };
