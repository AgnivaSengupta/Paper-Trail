interface IPost {
  title: string;
  coverImageUrl: string | null;
}

interface IAuthor {
  name: string;
  profilePic: string | null;
}

export interface IComment {
  _id: string;
  content: string;
  post: IPost;
  author: IAuthor;
  parentComment: string | null;
  ancestors: string[];
  createdAt: string;
  
  replies?: IComment[];
}

// export interface IComment extends Document {
//   post: Types.ObjectId | { title: string; coverImageUrl?: string }; // populated post
//   author: Types.ObjectId | { name: string; profilePic?: string }; // populated author
//   content: string;
//   parentComment?: Types.ObjectId | null;
//   ancestors: Types.ObjectId[];
//   isDeleted: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   // replies?: IComment[]; // for nested comments
// }


export const buildTrees = (comments: IComment[])=> {
  const map = new Map<string, IComment>();
  const roots: IComment[] = [];
  
  // Initialization
  comments.forEach((comment) => {
    map.set(comment._id, { ...comment, replies: [] });
  });
  
  // linking children to parent
  comments.forEach((comment) => {
    const node = map.get(comment._id);
    if (!node) return;
    
    if (node.parentComment) {
      const parent = map.get(node.parentComment);
      
      if (parent) {
        parent.replies!.push(node);
      } else {
        // orphaned node
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  
  return roots;
}