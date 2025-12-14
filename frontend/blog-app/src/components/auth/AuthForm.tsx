import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignUpForm";
import VerifyOtpForm from "./VerifyOtpForm";

type SignUpFormType = "form" | "otp";

const AuthForm = () => {
  const [authState, setAuthState] = useState<"signup" | "login">("login");
  const [signUpStep, setSignUpStep] = useState<SignUpFormType>("form");
  const [signupUserId, setSignupUserId] = useState<string | null>(null);
  return (
    <div>
      {authState === "login" && (
        <LoginForm authState={authState} setAuthState={setAuthState} />
      )}
      
      {authState === "signup" && signUpStep === "form" && (
        <SignupForm
          authState={authState}
          setAuthState={setAuthState}
          onSignUpSuccess={(userId: string) => {
            setSignupUserId(userId);
            setSignUpStep("otp");
          }}
        />
      )}
      
      
      {authState === "signup" && signUpStep === "otp" && (
        <VerifyOtpForm userId={signupUserId}/>
      )}
    </div>
  );
};

export default AuthForm;
