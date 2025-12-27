import type { Post } from "../data/mockPosts";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  index?: number;
}

const PostCard = ({ post, index = 0 }: PostCardProps) => {
  return (
    // <article 
    //   className={cn(
    //     "notebook-page group cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition-all duration-300 overflow-hidden",
    //     "opacity-100 animate-fade-in"
    //   )}
    //   style={{ animationDelay: `${index * 100}ms` }}
    // >
    <article 
          className={cn(
            "notebook-page p-6 group cursor-pointer hover:translate-x-1 hover:-translate-y-1 transition-all duration-300",
            "opacity-0 animate-fade-in"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Category tag styled as handwritten label */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-sketch text-lg text-muted-foreground">
              [ {post.category} ]
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {post.readTime}
            </span>
          </div>
    
          {/* Title */}
          <h3 className="font-sketch text-2xl sm:text-3xl font-semibold mb-3 group-hover:underline decoration-2 underline-offset-4">
            {post.title}
          </h3>
    
          {/* Excerpt */}
          <p className="font-mono text-sm text-muted-foreground leading-relaxed mb-4">
            {post.excerpt}
          </p>
    
          {/* Footer with author and date */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="font-mono text-xs text-muted-foreground">
              <span className="font-sketch text-base text-foreground">{post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.date}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </div>
    
          {/* Corner fold effect */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-secondary" />
        </article>
  );
};

export default PostCard;
