import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogMetaProps {
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
}

const BlogMeta = ({ author, date }: BlogMetaProps) => {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <Avatar className="h-8 w-8">
        <AvatarImage src={author.avatar} alt={author.name} />
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
          {author.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-foreground">{author.name}</span>
      <span className="text-muted-foreground">·</span>
      <time className="text-accent">{date}</time>
    </div>
  );
};

export default BlogMeta;
