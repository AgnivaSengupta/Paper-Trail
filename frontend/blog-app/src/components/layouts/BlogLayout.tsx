import type { ReactNode } from "react"
import BlogNavbar from "./BlogNavbar"
//import PageTransition from "../PageTransition";

type Props = {
    children: ReactNode;
}

const BlogLayout = ({children} : Props) => {
  return (
    
      <div className="bg-[#212121] flex flex-col min-h-screen text-white">
          <div className="fixed w-full bg-[#212121]">
            <BlogNavbar/> 
          </div>
          <div className="flex flex-col">{children}</div>
      </div>
    
  )
}

export default BlogLayout