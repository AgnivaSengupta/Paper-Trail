export const BASE_URL = "http://localhost:8000"

export const API_PATHS = {
    AUTH: {
        REGISTER: "api/auth/register",
        LOGIN: "api/auth/login",
        GET_PROFILE: "api/auth/profile",
        LOGOUT: "api/auth/logout",

    },
    POST: {
        CREATE_POST: "api/post", // post req
        GET_ALL_POSTS: "api/post", //get req
        GET_POST_BY_SLUG: "api/post/slugs/:slug",
        UPDATE_POST: (id) =>  `api/post/${id}`,
        DELETE_POST: (id) =>  `api/post/${id}`,
        GET_POST_BY_TAG: (tag) => `api/post/tag/${tag}`,
        SEARCH_POST: "api/post/search",
        INCREMENT_VIEW: (id) => `api/post/${id}/view`,
        LIKE_POST: (id) => `api/post/${id}/like`,
        GET_TRENDING_POSTS: "api/post/trending"
    },
    DASHBOARD_SUMMARY: {
        GET_DASHBOARD_SUMMARY: "api/dashboard-summary"
    },
    COMMENTS: {
       ADD_COMMENT: (postId) => `api/comments/${postId}`,
       GET_COMMENT_BY_POST: (postId) => `api/comments/${postId}`,
       GET_ALL_POSTS: "api/comments",
       DELETE_COMMENT: (commentId) => `api/comments/${commentId}` 
    }
}