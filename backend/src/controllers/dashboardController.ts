import BlogPost from "../models/BlogPost";
import Comment from "../models/Comment";
import type { Request, Response } from 'express'
import { analyticsClient } from "../grpc/analyticsClieint";
import { AuthorStatsResponse } from "../proto/generated/analytics/AuthorStatsResponse";

// helper func to promisify:
const fetchAnalytics = (authorId: string, timeRange: string): Promise<AuthorStatsResponse> => {
    return new Promise((resolve, reject) => {

const payload = {
            authorId: authorId,
            timeRange: timeRange,
        }
        analyticsClient.GetAuthorStats(payload, (err, response) => {
            if (err) {
                console.error("grpc Error:", err);
                resolve({
                    totalViews: 0,
                    totalVisitors: 0,
                    overallAvgReadTime: 0,
                    topPosts: []
                });
            } else {
                resolve(response || {});
            }
        })
    })
}

// @route POST/api/dashboard-summary
const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const range = (req.query.range as string) || '24h';
        const [
            mongoStats,
            analyticsStats,
        ] = await Promise.all([
            Promise.all([
                BlogPost.countDocuments({ author: userId }),
                BlogPost.countDocuments({ author: userId, isDraft: true }),
                BlogPost.countDocuments({ author: userId, isDraft: false }),
            ]),
            // gRPC: performance stats
            fetchAnalytics(userId, range),
        ])
        // const [totalPosts, drafts, published] = 
        //     await Promise.all([
        //         BlogPost.countDocuments({author: req.user._id}),
        //         BlogPost.countDocuments({author: req.user._id, isDraft: true}),
        //         BlogPost.countDocuments({ author: req.user._id, isDraft: false}),
        //         // Comment.countDocuments(),
        //     ]);

        const [totalPosts, drafts, published] = mongoStats;

        // hydrating gRPC top posts -> merge grpc post ids with title and images from mongo
        let hydratedTopPosts = [];
        if (analyticsStats.topPosts && analyticsStats.topPosts.length > 0) {
            const topPostsIds = analyticsStats.topPosts.map(p => p.postId);

            const postDetails = await BlogPost.find({ _id: { $in: topPostsIds } }).select('title coverImageUrl');

            hydratedTopPosts = analyticsStats.topPosts.map(gPost => {
                const details = postDetails.find(d => d._id.toString() === gPost.postId);
                return {
                    _id: gPost.postId,
                    title: details?.title || gPost.title,
                    coverImageUrl: details?.coverImageUrl || "",
                    views: gPost.views
                }
            });

            res.json({
                stats: {
                    totalPosts,
                    drafts,
                    published,
                    // totalComments,
                    // New Stats from Go Service
                    totalViews: analyticsStats.totalViews || 0,
                    totalVisitors: analyticsStats.totalVisitors || 0,
                    avgReadTime: analyticsStats.overallAvgReadTime || 0
                },
                topPosts: hydratedTopPosts,
            });
        }
    } catch (error) {

    }

};
export default getDashboardSummary;