import Arrow from "@/assets/arrow"
import Card from "@/components/dashboard/StatCard"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Sidebar from "@/components/dashboard/Sidebar"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ChartPie, CircleUserRound, FileText, MessageCircle, UserCircle } from "lucide-react"
import { Grid } from "@/components/dashboard/Grid"
import Test from "./Test"

const Dashboard = () => {
  return (
    // <DashboardLayout>
    //   <div id='container' className="w-full h-full flex">
    //     {/* Sidebar */}
    //     {/* <Sidebar/> */}

    //     <div className="flex-grow h-full flex flex-col"> 
    //       <DashboardNavbar page='Overview'/>
    //       <div className="flex flex-col">
    //         <h1 className="text-base px-6 pb-5">Overview</h1>
    //         <Grid/>
    //       </div>
    //     </div>

    //   </div>
    // </DashboardLayout>

    <Test>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </Test>
  )
}

export default Dashboard