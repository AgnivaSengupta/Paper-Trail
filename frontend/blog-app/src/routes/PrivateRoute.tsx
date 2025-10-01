import { useUserStore } from "@/store/userStore"
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom"

type PrivateRouteProps = {
  allowedRole: string;
};

const PrivateRoute = ({allowedRole}: PrivateRouteProps) => {
  const user = useUserStore((state) => state.user);
  const loading = useUserStore((state) => state.loading);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(); // triggers loading -> sets user
  }, [fetchUser]);

  if (loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    )
  }

  if (!user){
    return <Navigate to='/' replace/>
  }

  if (user.role != allowedRole){
    return <Navigate to='/' replace/>
  }
  return (
    <Outlet/>
  )
}

export default PrivateRoute