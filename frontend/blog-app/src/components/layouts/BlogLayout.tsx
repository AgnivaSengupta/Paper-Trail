import { useEffect, useRef, type ReactNode } from "react"
import BlogNavbar from "./BlogNavbar"
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
import Header from "../blogPage/Header";
import Footer from "../blogPage/Footer";
//import PageTransition from "../PageTransition";

type Props = {
    children: ReactNode;
}

const BlogLayout = ({children} : Props) => {
  
  // const { user, setUser } = useAuthStore();

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
  //         withCredentials: true,
  //       });

  //       setUser(response.data);
  //     } catch (error) {
  //       setUser(null);
  //     }
  //   };

  //   fetchProfile();
  // }, [setUser]);

  // console.log(user);
  // const handleLogOut = async () => {
  //   try {
  //     const response = await axiosInstance.post(
  //       API_PATHS.AUTH.LOGOUT,
  //       {},
  //       {
  //         withCredentials: true,
  //       },
  //     );
  //     alert("Logged out successfully!");
  //     console.log(response.data);
  //   } catch (error) {
  //     alert("Logout failed!");
  //     console.log(error);
  //   }
  // };
  return (
    
    // <div className="min-h-screen bg-background "
    //   style={{
    //     backgroundImage: `radial-gradient(circle at 1px 1px, rgba(204, 204, 204, 0.3) 1px,
    //     transparent 0)`,
    //     backgroundSize: "20px 20px",
    //     backgroundRepeat: "repeat"
    //   }}>
    //   {/* Header */}
    //   <div className="flex justify-center items-center w-full sticky top-0 z-50 h-28">
    //     <BlogNavbar ref={navRef} />
    //   </div>
    //   {/*<BlogNavbar/> */}
    //   {children}
    // </div>
    
    <div className="min-h-screen bg-background">
      <Header/>
      {children}
      <Footer/>
    </div>
    
  )
}

export default BlogLayout