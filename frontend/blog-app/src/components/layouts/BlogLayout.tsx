import { useEffect, useRef, type ReactNode } from "react"
import BlogNavbar from "./BlogNavbar"
import { useGSAP } from "@gsap/react";
import gsap from 'gsap';
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";
//import PageTransition from "../PageTransition";

type Props = {
    children: ReactNode;
}

const BlogLayout = ({children} : Props) => {
  
  gsap.registerPlugin(useGSAP);
  const navRef = useRef(null);
  
  useGSAP(() => {
    if (!navRef.current) return;
    
    gsap.from(navRef.current, {
      scaleX: 0,
      opacity: 0,
      duration: 1,
      delay: 0.35,
      ease: "power3.out",
    })
  }, [])
  
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
          withCredentials: true,
        });

        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchProfile();
  }, [setUser]);

  console.log(user);
  const handleLogOut = async () => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGOUT,
        {},
        {
          withCredentials: true,
        },
      );
      alert("Logged out successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Logout failed!");
      console.log(error);
    }
  };
  return (
    
    <div className="min-h-screen bg-background flex flex-col items-center"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(204, 204, 204, 0.3) 1px,
        transparent 0)`,
        backgroundSize: "20px 20px",
        backgroundRepeat: "repeat"
      }}>
      {/* Header */}
      <div className="flex justify-center items-center w-full sticky top-0 z-50 h-28">
        <BlogNavbar ref={navRef} />
      </div>
      {/*<BlogNavbar/> */}
      {children}
    </div>
    
  )
}

export default BlogLayout