import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
}

const LoginForm = ({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginDialogProps) => {
  const { refreshUser } = useAuthStore();

  const [loading, setloading] = useState(false);
  // const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Registration logic placeholder
  //   console.log("Register:", { name, email, password });
  //   onOpenChange(false);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setloading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result?.error) {
        setError(result.error.message || "Invalid email or password");
        setloading(false);
        return;
      }

      await refreshUser();
      // If no error thrown:
      onOpenChange(false);
    } catch {
      setError("Invalid email or password");
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-none">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-primary font-medium tracking-wider">
            Welcome to Papertrail
          </DialogTitle>
          <DialogDescription className="text-base">
            Start tracking your job applications today.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 border-1 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
          >
            {loading ? "Signing In..." : "Log In"}
          </Button>

          {error && (
            <div className="rounded-md bg-destructive text-sm p-2 text-destructive">
              {error}
            </div>
          )}

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account? Create one{" "}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToSignup();
              }}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </button>
          </div>
        </form>
        <DialogFooter>
          <DialogDescription className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
            .
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;
