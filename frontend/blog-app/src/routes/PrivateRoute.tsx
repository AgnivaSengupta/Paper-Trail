import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
  const { user, loading, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [fetchProfile, user]);

  if (loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    )
  }

  // If you want to enforce auth, you can uncomment this
  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <Outlet/>
  )
}

export default PrivateRoute
