//import BlogNavbar from "@/components/layouts/BlogNavbar"
import LoginComponent from "@/components/auth/LoginComponent"
import RegisterComponent from "@/components/auth/RegisterComponent";
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { useState } from "react";

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  return (
    <DashboardLayout>

        {/* if the user want to access any admin route but does not have the authorization header, then tell him to log in. */}
        {/* After logging in, the token is set as the authorization header and the user can access admin routes */}
        {/* If user not found in DB, then make him register and autologin */}
        <div className="flex w-full h-full justify-center items-center">
          {currentPage === "login"? (
            <LoginComponent setCurrentPage={setCurrentPage}/>)
            : (
              <RegisterComponent setCurrentPage={setCurrentPage}/>
            )
          }
        </div>
    </DashboardLayout>
  )
}

export default AdminLogin