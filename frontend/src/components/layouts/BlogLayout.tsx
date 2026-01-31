import { type ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Header from "../blogPage/Header";
import Footer from "../blogPage/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthForm from "../auth/AuthForm";

type Props = {
  children: ReactNode;
};

const BlogLayout = ({ children }: Props) => {
  const { authFormOpen, setAuthFormOpen } = useAuthStore();

  return (

    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />

      <Dialog open={authFormOpen} onOpenChange={setAuthFormOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-stone-100  dark:bg-[#131314]">
          <DialogHeader className="p-6 pb-0 ">
            <DialogTitle className="text-center text-foreground text-2xl font-playfair">
              Papertrails
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {/* <SignupForm /> */}
            <AuthForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogLayout;
