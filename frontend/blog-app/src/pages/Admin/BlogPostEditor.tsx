import Editor from "@/components/EditorPage/Editor"
import TagCard from "@/components/EditorPage/TagCard"
import UserCard from "@/components/EditorPage/UserCard"
import Breadcrum from "@/components/dashboard/Breadcrum"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Sidebar from "@/components/dashboard/Sidebar"
import BlogEditorLayout from "@/components/layouts/BlogEditorLayout"
import DashboardLayout from "@/components/layouts/DashboardLayout"
//import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { CircleCheckBig, Eye, Save } from "lucide-react"

const BlogPostEditor = ({ isEdit = false }) => {
  const randomDate = '23/4/2035';

  return (
    <DashboardLayout>
      <div id='container' className="flex h-screen">

        <div id='EditorContainer' className="flex-1 flex flex-col min-w-0">
          {/* 120px height */}
          <div id='Navbar' className="w-full h-[73px] border-b border-gray-600 px-10 flex justify-between items-center flex-shrink-0">
            <div className="flex flex-col justify-center items-start">
              <Breadcrum Page='Blog Posts' />

              {/* <div className="flex justify-center items-center gap-5 my-2">
                <h2 className="text-3xl font-semibold">
                  Article Name
                </h2>

                <div className="border-[0.5px] rounded-full w-[60px] h-[20px] text-xs flex justify-center items-center bg-red-600/20">
                  <h1>Draft</h1>
                </div>
              </div>

              <div className="flex gap-5">
                <p className="text-xs">Last updated {randomDate}</p>
                <p className="text-xs">By UserName</p>
              </div> */}
            </div>

            <div className="flex justify-evenly items-center gap-3">
              <Button variant='preview'>
                <Eye className="size-5" />
                Preview
              </Button>

              <Button variant='savePublish'>
                <CircleCheckBig className='size-5' />
                Save and Publish
              </Button>

              <Button className="text-sm bg-white/50">
                <Save className="size-5 h-7" />
                Save
              </Button>
            </div>
          </div>

          {/* Two Column Layout - Middle (Editor) + Right (Sidebar) */}
          <div className="flex flex-1 min-h-0 bg-amber-50">
            {/* Middle Section - Editor (Separately Scrollable) */}
            <div
              id='editorContainer'
              className='flex-1 h-full w-4/6 p-5 overflow-hidden bg-pink-200'
              style={{ height: 'calc(100vh - 120px)' }} // Subtract navbar height
            >

              <div className="flex flex-col gap-2 ml-4">
                <div className="flex justify-start items-center gap-5 ml">
                  <h2 className="text-2xl font-medium">
                    Article Name
                  </h2>

                  <div className="border-[0.5px] rounded-full w-[60px] h-[20px] text-xs flex justify-center items-center bg-red-600/20">
                    <h1>Draft</h1>
                  </div>
                </div>

                <div className="flex gap-5 text-stone-400">
                  <p className="text-xs">Last updated {randomDate}</p>
                  <p className="text-xs">By UserName</p>
                </div>
              </div>
              <div className="w-full min-h-[900px] border-1 rounded-md p-4 mt-5">
                {/* Your Editor Component */}
                <Editor />

              </div>
            </div>

            {/* Right Section - User/Tag Cards (Separately Scrollable) */}
            <div
              className="w-2/6 border-none overflow-y-auto py-10 custom-scrollbar bg-green-300"
              style={{ height: 'calc(100vh - 120px)' }} // Subtract navbar height
            >
              <div className="flex flex-col items-center gap-6">
                {/* User Card */}
                <UserCard />

                {/* Tags Section */}
                <div className="w-full">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="space-y-2">
                    <TagCard />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default BlogPostEditor