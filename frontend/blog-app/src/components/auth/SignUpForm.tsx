import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { API_PATHS, BASE_URL } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

export function SignupForm({
  authState,
  setAuthState,
  onSignUpSuccess,
}: {
  authState: "signup" | "login";
  setAuthState: React.Dispatch<React.SetStateAction<"signup" | "login">>;
  onSignUpSuccess: (userId: string) => void;
}) {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const setAuthFormOpen = useAuthStore((state) => state.setAuthFormOpen);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    const user = {
      name: username,
      email,
      password,
      // bio: "",
      // profileImageUrl: "",
      // adminAccessToken: "",
    };

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, user, {
        withCredentials: true,
      });

      console.log("RESPONSE-->", response);
      const data = await response.data;
      onSignUpSuccess(data.userId);

      // alert("Registration successful!");

      // setAuthFormOpen(false);
      // console.log("Response:", response.data);
      // useAuthStore.getState().setUser(response.data);
    } catch (error: any) {
      console.log("ERROR:--->", error);
      console.error("Registration Failed:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card className="bg-white border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-foreground hover:bg-primary/80 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex gap-5 items-center">
                      <Spinner />
                      <p className="inline-block">Creating account...</p>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="cursor-pointer"
                    onClick={() => setAuthState("login")}
                  >
                    Sign in
                  </Button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
