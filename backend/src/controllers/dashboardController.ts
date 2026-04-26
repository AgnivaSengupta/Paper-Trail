import BlogPost from "../models/BlogPost";
import Comment from "../models/Comment";
import type { Request, Response } from 'express'

// @route GET /api/dashboard-summary
const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const [totalPosts, drafts, published, recentPosts] = await Promise.all([
            BlogPost.countDocuments({ author: userId }),
            BlogPost.countDocuments({ author: userId, isDraft: true }),
            BlogPost.countDocuments({ author: userId, isDraft: false }),
            BlogPost.find({ author: userId })
                .sort({ updatedAt: -1 })
                .limit(5)
                .select('title coverImageUrl views likes isDraft slug updatedAt'),
        ]);

        // Aggregate total views and likes across all posts by this author
        const aggregated = await BlogPost.aggregate([
            { $match: { author: userId } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likes" },
                }
            }
        ]);

        const { totalViews = 0, totalLikes = 0 } = aggregated[0] ?? {};

        res.json({
            stats: {
                totalPosts,
                drafts,
                published,
                totalViews,
                totalLikes,
            },
            recentPosts,
        });

    } catch (error) {
        console.error("[getDashboardSummary] Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
};

export default getDashboardSummary;