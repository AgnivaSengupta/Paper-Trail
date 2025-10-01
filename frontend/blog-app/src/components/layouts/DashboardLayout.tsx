import type { ReactNode } from "react"
import BlogNavbar from "./BlogNavbar"
import Sidebar from "../dashboard/Sidebar";
//import { Sidebar } from "lucide-react";

type Props = {
    children : ReactNode;
}

const DashboardLayout = ({children} : Props) => {
  return (
    <div className="bg-[#212121] h-screen text-white font-display">
        {/* <BlogNavbar/> */}
        <div className="w-full h-full flex">

          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
          <main className="flex-grow">
              {children}
          </main>
        </div>
    </div>
  )
}

export default DashboardLayout