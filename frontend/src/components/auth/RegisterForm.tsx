import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { useAuthStore } from "@/store/useAuthStore";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({
  open,
  onOpenChange,
  onSwitchToLogin,
}: RegisterDialogProps) => {
  const { refreshUser } = useAuthStore();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setloading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error.message ?? "Failed to signup");
        return;
      }

      await refreshUser();
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong.");
      setloading(false);
      return;
    } finally {
      setloading(false);
    }

    // Registration logic placeholder
    // console.log("Register:", { name, email, password });
    // onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] px-6 py-2 overflow-hidden bg-stone-100  dark:bg-[#131314]">
        <DialogHeader className="p-6 py-2 ">
          <DialogTitle className="text-center text-foreground text-2xl font-playfair">
            Papertrails
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-white dark:bg-zinc-900 border-none p-4 rounded-md flex flex-col">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-primary font-medium tracking-wider">
              Welcome to Papertrail
            </h2>
            <p className="text-sm">
              Start tracking your job applications today.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            {error && (
              <div className="rounded-md bg-destructive/30 text-sm p-2 text-destructive flex items-center justify-center border border-red-300">
                {error}
              </div>
            )}

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onSwitchToLogin();
                }}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
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

export default RegisterForm;
