import BlogPost from "../models/BlogPost";
import Comment from "../models/Comment";
import type { Request, Response } from 'express'
import { analyticsClient } from "../grpc/analyticsClieint";
import { AuthorStatsResponse } from "../proto/generated/analytics/AuthorStatsResponse";

// helper func to promisify:
const fetchAnalytics = (authorId: string, timeRange: string): Promise<AuthorStatsResponse> => {
    return new Promise((resolve, reject) => {
        console.log('🚀 Making gRPC request with payload:', { authorId, timeRange });

        const payload = {
          authorId: authorId,
          author_id: authorId,
          time_range: timeRange,
          timeRange: timeRange,
        }
analyticsClient.GetAuthorStats(payload, (err, response) => {
            if (err) {
                console.error("❌ gRPC Error:", err);
                resolve({
                    total_views: 0,
                    total_visitors: 0,
                    overall_avg_read_time: 0,
                    top_posts: []
                });
            } else {
                console.log("✅ gRPC Response received:", response);
                resolve(response || {});
            }
        })
    })
}

// @route POST/api/dashboard-summary
const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        console.log('🔍 Dashboard request - User ID:', req.user?._id, 'Range:', req.query.range);
        const userId = req.user._id;
        const range = (req.query.range as string) || '24h';
        console.log('📊 Fetching analytics for user:', userId, 'range:', range);
        const [
            mongoStats,
            analyticsStats,
        ] = await Promise.all([
            Promise.all([
                BlogPost.countDocuments({ author: userId }),                  // total documents
                BlogPost.countDocuments({ author: userId, isDraft: true }),   // total draft documents
                BlogPost.countDocuments({ author: userId, isDraft: false }),  // total published documents
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
        // console.log(analyticsStats)
        // hydrating gRPC top posts -> merge grpc post ids with title and images from mongo
        // 
        console.log("🔍 gRPC Stats:", JSON.stringify(analyticsStats, null, 2));
        let hydratedTopPosts: any[] = [];
        // if (analyticsStats.topPosts && analyticsStats.topPosts.length > 0) {
        //     const topPostsIds = analyticsStats.topPosts.map(p => p.postId);
        //     // console.log(topPostsIds)
        //     const postDetails = await BlogPost.find({ _id: { $in: topPostsIds } }).select('title coverImageUrl');

        //     hydratedTopPosts = analyticsStats.topPosts.map(gPost => {
        //         const details = postDetails.find(d => d._id.toString() === gPost.postId);
        //         return {
        //             _id: gPost.postId,
        //             title: details?.title || gPost.title,
        //             coverImageUrl: details?.coverImageUrl || "",
        //             views: gPost.views
        //         }
        //     });
        // }
        // 
        if (analyticsStats.top_posts && analyticsStats.top_posts.length > 0) {
                    
                    // FIX 2: Use camelCase 'postId'
                    const topPostsIds = analyticsStats.top_posts.map((p: any) => p.post_id);
        
                    const postDetails = await BlogPost.find({ _id: { $in: topPostsIds } })
                        .select('title coverImageUrl');
        
                    hydratedTopPosts = analyticsStats.top_posts.map((gPost: any) => {
                        // FIX 3: Use camelCase 'postId'
                        const details = postDetails.find(d => d._id.toString() === gPost.post_id);
                        return {
                            _id: gPost.post_id,
                            title: details?.title || "Deleted Post",
                            coverImageUrl: details?.coverImageUrl || "",
                            views: gPost.views
                        }
                    });
                }
        console.log(hydratedTopPosts)
        res.json({
            stats: {
                totalPosts,
                drafts,
                published,
                // totalComments,
                // New Stats from Go Service
                totalViews: analyticsStats.total_views || 0,
                totalVisitors: analyticsStats.total_visitors || 0,
                avgReadTime: analyticsStats.overall_avg_read_time || 0
            },
            topPosts: hydratedTopPosts,
        });
      
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data" });
    }

};
export default getDashboardSummary;