import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";

export function GoogleAuthForm() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAuthFormOpen = useAuthStore((state) => state.setAuthFormOpen);

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN,
          {
            code: codeResponse.code,
          },
          {
            withCredentials: true
          }
        );
        
        setUser(response.data);
        setAuthFormOpen(false);
      } catch (error) {
        console.error("Google Login Backend Error:", error);
      }
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-white dark:bg-zinc-900 border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-primary font-medium tracking-wider">Welcome to Papertrail</CardTitle>
          <CardDescription className="text-base">
            Sign in to access your account and start writing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              onClick={() => handleGoogleLogin()}
              className="w-full bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 border-1 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            
            <FieldDescription className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              By signing in, you agree to our{" "}
              <a href="#" className="underline hover:text-primary">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-primary">Privacy Policy</a>.
            </FieldDescription>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}