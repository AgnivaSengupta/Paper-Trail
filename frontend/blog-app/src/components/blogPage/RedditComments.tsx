import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

const Comment = ({ comment, onReply, level = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now - commentDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return commentDate.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Vertical line for nesting indicator */}
      {level > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-500" />
      )}

      <div className={`${level > 0 ? "ml-4 pl-4" : ""}`}>
        {/* Comment header */}
        <div className="flex items-start gap-2 mb-2">
          <Button
            variant="link"
            size='sm'
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-foreground hover:text-accent-foreground hover:bg-accent cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-muted-foreground text-sm">
                {comment?.author.name}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{formatTime(comment.createdAt)}</span>
            </div>

            {/* Comment content */}
            {!isCollapsed && (
              <>
                <p className="mt-1 text-foreground text-base">{comment.content}</p>

                {/* Action buttons */}
                <div className="mt-2 flex items-center gap-4">
                  <Button
                    variant='link'
                    onClick={() => setIsReplying(!isReplying)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-500 cursor-pointer "
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </Button>
                </div>

                {/* Reply form */}
                {isReplying && (
                  <div className="mt-3 mb-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="What are your thoughts?"
                      className="w-full p-2 border-2 border-input rounded-lg text-base focus:outline-none focus-2 focus-visible:ring-ring resize-none placeholder:text-muted-foreground"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        size='sm'
                        onClick={handleSubmitReply}
                        className="hover:bg-primary/80 cursor-pointer text-sm"
                      >
                        Comment
                      </Button>
                      <Button
                        size='sm'
                        onClick={() => {
                          setIsReplying(false);
                          setReplyText("");
                        }}
                        className="text-foreground bg-muted hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {isCollapsed && (
              <p className="text-sm text-muted-foreground mt-1">
                [{comment.replies?.length || 0} replies collapsed]
              </p>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {!isCollapsed && comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                onReply={onReply}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export function RedditComments({postId}: {postId: string}) {

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComment();
  }, [postId])

  const fetchComment = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(API_PATHS.COMMENTS.GET_COMMENT_BY_POST(postId));
      if (!response) throw new Error('Failed to fetch comments');
      const data = response.data
      console.log(data)
      setComments(data);
      setError(null);
    } catch (error) {
      console.log("Failed");
      return
    }
  }

  const addReply = async (parentCommentId, content) => {
    try {
      // const response = await fetch(`/api/comments/${postId}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     content,
      //     parentComment: parentCommentId,
      //   }),
      // });

      const response = await axiosInstance.post(API_PATHS.COMMENTS.ADD_COMMENT(postId), {
        content: content,
        parentComment: parentCommentId,
      })

      if (!response) throw new Error('Failed to add reply');
      
      // Refresh comments to get the nested structure
      await fetchComment();
    } catch (err) {
      alert('Failed to add reply: ');
    }
  };


  const handleAddTopLevelComment = async () => {
    if (!newComment.trim()) return;
    try {
      const payload = {
        content: newComment,
        parentComment: null,
      }

      const response = await axiosInstance.post(API_PATHS.COMMENTS.ADD_COMMENT(postId), payload);
      setNewComment('');
      await fetchComment();
    } catch (error) {
      console.log("Failed to add comment!")
    }
  };

  return (
    <div className="w-full mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-semibold text-foreground mb-6">
        Discussion Thread
      </h1>

      {/* New comment form */}
      <div className=" rounded-lg p-4 shadow-sm mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="w-full p-2 text-base border border-input rounded-md focus-visible:ring-accent resize-none"
          rows={4}
        />
        <Button onClick={handleAddTopLevelComment} className="">
          Comment
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg p-4 shadow-sm">
            <Comment comment={comment} onReply={addReply} />
          </div>
        ))}
      </div>
    </div>
  );
}
