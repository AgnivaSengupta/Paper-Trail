import { Search } from "lucide-react"
import Breadcrum from "./Breadcrum"
import { Input } from "../ui/input"

const DashboardNavbar = ({page}: {page: string}) => {
  return (
    <div className="border-b-1 border-gray-500 h-[73px] px-10 mb-5 flex justify-between items-center sticky">
        <Breadcrum Page={page}/>
    </div> 
  )
}

export default DashboardNavbar