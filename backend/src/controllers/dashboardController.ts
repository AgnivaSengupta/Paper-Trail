import BlogPost from "../models/BlogPost";
import Comment from "../models/Comment";
import type {Request, Response} from 'express'

// @route POST/api/dashboard-summary
const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const [totalPosts, drafts, published] = 
            await Promise.all([
                BlogPost.countDocuments({author: req.user._id}),
                BlogPost.countDocuments({author: req.user._id, isDraft: true}),
                BlogPost.countDocuments({ author: req.user._id, isDraft: false}),
                // Comment.countDocuments(),
            ]);


            const totalCommentAgg = await Comment.aggregate([
                {
                    $lookup: {
                        from: "BlogPost",
                        localField: "post",
                        foreignField: "_id",
                        as: "postDoc"
                    }
                },
                { $unwind: "$postDoc" },
                { $match: {"$postDoc.author": req.user._id}},
                { $count: "total"}
            ]);

            const totalComments = totalCommentAgg[0]?.total || 0;

            const totalViewsAgg = await BlogPost.aggregate([
                { $group: { _id: null, total: { $sum: "$views" } } }
            ]);

            const totalLikesAgg = await BlogPost.aggregate([
                { $group: { _id: null, total: { $sum: "$likes" } } }
            ])

            const totalViews = totalViewsAgg[0]?.total || 0;
            const totalLikes = totalLikesAgg[0]?.total || 0;

            // top performing posts
            const topPosts = await BlogPost.find({isDraft: false})
                .select("title coverImageUrl views likes")
                .sort({views: -1, likes: -1})
                .limit(5)

            // recent comments
            const recentComments = await Comment.find()
                .sort({createdAt: -1})
                .limit(5)
                .populate("author", "name profilePic")
                .populate("post", "title coverImageUrl")

            // tag usage aggregate
            const tagUsage = await BlogPost.aggregate([
                { $unwind: "$tags" },
                { $group: {_id: "$tags", count: {$sum: 1} } },
                { $project: { tag: "$_id", count: 1, _id: 0 } },
                { $sort: { count: -1 } },
            ]);

            res.json({
                stats: {
                    totalPosts,
                    drafts,
                    published,
                    totalViews,
                    totalLikes,
                    totalComments
                },
                topPosts,
                recentComments,
                tagUsage
            });

    } catch (error) {
        res.status(500).json({msg: "Failed to fetch dashboard summary", error});
    }
}

export default getDashboardSummary