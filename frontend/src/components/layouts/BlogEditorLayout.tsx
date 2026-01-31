import { type ReactNode } from 'react'


type Props = {
    children : ReactNode;
}

const BlogEditorLayout = ({children} : Props) => {
  return (
    <div className="bg-[#212121] flex flex-col h-screen text-white">
        {/* <BlogNavbar/> */}
        <main className="flex-grow">
            {children}
        </main>
    </div>
  )
}

export default BlogEditorLayout