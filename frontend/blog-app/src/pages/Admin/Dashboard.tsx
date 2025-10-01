import Arrow from "@/assets/arrow"
import Card from "@/components/dashboard/StatCard"
import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import Sidebar from "@/components/dashboard/Sidebar"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { ChartPie, CircleUserRound, FileText, MessageCircle, UserCircle } from "lucide-react"
import { Grid } from "@/components/dashboard/Grid"

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div id='container' className="w-full h-full flex">
        {/* Sidebar */}
        {/* <Sidebar/> */}

        <div className="flex-grow h-full flex flex-col"> 
          <DashboardNavbar page='Overview'/>
          <div className="flex flex-col">
            <h1 className="text-base px-6 pb-5">Overview</h1>
            <Grid/>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default Dashboard