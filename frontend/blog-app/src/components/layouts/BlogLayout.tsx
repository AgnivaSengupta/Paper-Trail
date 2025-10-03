import type { ReactNode } from "react"
import BlogNavbar from "./BlogNavbar"
//import PageTransition from "../PageTransition";

type Props = {
    children: ReactNode;
}

const BlogLayout = ({children} : Props) => {
  return (
    
    <div className="bg-background flex flex-col min-h-screen text-white">
        <BlogNavbar/> 
        <div className="flex flex-col">{children}</div>
    </div>
    
  )
}

export default BlogLayout