import type { IComment } from "@/utils/treeBuilder";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User2 } from "lucide-react";
import { Input } from "../ui/input";

interface props {
  comment: IComment;
  onReply: (parentComment: string, content: string) => void;
}

const Comment: React.FC<props> = ({comment, onReply}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleReply = () => {
    if (!replyContent.trim()) return;
        onReply(comment._id, replyContent);
        setIsReplying(false);
        setReplyContent("");
        setIsExpanded(true);
  }


  return (
  <div className="flex flex-col mb-4">
        {/* 1. Comment Card */}
        <div className="border border p-3 rounded-md bg-white">
          <div className="flex gap-5">
            <div>
              <Avatar>
                <AvatarImage src={comment.author.profilePic}  className="object-cover"/>
                <AvatarFallback>
                  <User2/>
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-bold">
                {comment.isDeleted ? "[deleted]" : comment.author.name}
              </div>
    
              <div className="text-gray-800 text-sm mb-2 font-content">
                {comment.isDeleted ? <span className="italic text-gray-400">This comment was deleted.</span> : comment.content}
              </div>
    
              {/* Action Buttons */}
              {!comment.isDeleted && (
                <div className="flex gap-3 text-xs text-gray-500">
                   <button onClick={() => setIsReplying(!isReplying)} className="hover:underline">
                     Reply
                   </button>
                   {comment.replies && comment.replies.length > 0 && (
                     <button onClick={() => setIsExpanded(!isExpanded)} className="hover:underline">
                       {isExpanded ? 'Hide replies [-]' : `Show [+] ${comment.replies.length} replies`}
                     </button>
                   )}
                </div>
              )}
            </div>
            
          </div>

        </div>

        {/* 2. Reply Input Form */}
              {isReplying && (
                <div className="ml-8 mt-2">
                  <Input
                    type="text"
                    className="border-input bg-background p-2 min-h-14 w-full text-sm rounded"
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2">
                    <Button size='sm' onClick={handleReply} className="bg-black hover:bg-black/80 text-white text-xs px-3 py-1 rounded cursor-pointer">Post</Button>
                    <Button variant='outline' size='sm' onClick={() => setIsReplying(false)} className="text-gray-500 text-xs px-3 py-1 rounded cursor-pointer bg-white">Cancel</Button>
                  </div>
                </div>
              )}

              {/* 3. RECURSIVE RENDERING OF CHILDREN */}
              {isExpanded && comment.replies && comment.replies.length > 0 && (
                <div className="ml-5 border-l-2 border-gray-300 pl-3 mt-2">
                  {comment.replies.map((reply) => (
                    <Comment key={reply._id} comment={reply} onReply={onReply} />
                  ))}
                </div>
              )}
            </div>
  )
}

export default Comment;
