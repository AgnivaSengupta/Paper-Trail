import { useEffect, useState } from "react";
import slugify from "slugify";

// interface TOCItem {
//   id: string;
//   title: string;
//   level: number;
// }

interface TableOfContentsProps {
  content: { type: string; content: TipTapNode[] } | null;
}

type TipTapNode = {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  marks?: { type: string, attrs?: Record<string, any> }[];
  text?: string;
}


const TableOfContents = ({ content}: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>("");
  const headings = content?.content?.filter((node) => node.type === "heading").map((node) => ({
    id: slugify(node.content?.[0]?.text || ""),
    text: node.content?.[0].text || "",
    level: node.attrs?.level || 2,
  })) || [];

  if (headings.length === 0) return null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting){
            setActiveId(entry.target.id);
          }
        })
      }, 
      { rootMargin: "-40% 0px -60% 0px"}
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    })
  }, [headings]);


  const handelClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setActiveId(id);
  }
  return (
    <nav className="sticky top-24">
      <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
        Contents
      </h4>
      <ul className="space-y-2 border-l border-border">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handelClick(e, item.id)}
              className={`block pl-4 py-1 text-sm transition-colors hover:text-red-400 ${
                activeId === item.id
                  ? "text-red-700 border-l-2 border-accent -ml-px font-medium"
                  : "text-muted-foreground"
              } ${item.level === 2 ? "" : "pl-6 text-xs"}`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
