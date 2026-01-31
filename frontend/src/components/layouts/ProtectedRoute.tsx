import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
// import { useUserStore } from "@/store/userStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, isCheckingAuth } = useAuthStore();
  // console.log(user);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin size-10 text-primary" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
