import { PenLine } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12 bg-secondary/30">
      <div className="container max-w-6xl px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4" />
            <span className="font-sketch text-2xl">PaperTrails</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 font-mono text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              RSS
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </nav>

          {/* Copyright annotation */}
          <div className="font-mono text-xs text-muted-foreground">
            <span className="font-sketch text-base">© 2025</span>
            <span className="ml-2">all rights reserved</span>
          </div>
        </div>

        {/* Bottom annotation */}
        <div className="mt-8 text-center">
          <span className="font-sketch text-base text-muted-foreground italic">
            { "{ made with care & coffee }" }
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
