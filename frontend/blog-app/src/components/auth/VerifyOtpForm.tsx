import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { API_PATHS } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";

interface VerifyOtpFormProps {
  userId: string | null;
  onVerified?: () => void;
}

const VerifyOtpForm = ({ userId, onVerified }: VerifyOtpFormProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuthFormOpen = useAuthStore((state) => state.setAuthFormOpen);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.VERIFY,
        { userId, otp },
        { withCredentials: true },
      );

      const data = response.data;

      // user is verified + authenticated here
      useAuthStore.getState().setUser(data.user);

      // close dialog only now
      setAuthFormOpen(false);
      onVerified?.();
    } catch (err: any) {
      setError(
        err.response?.data?.msg || "Invalid or expired verification code",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">Verify your email</h2>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
          }}
          autoFocus
        />

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
}


export default VerifyOtpForm;