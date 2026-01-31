import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { user, setUser } = useAuthStore();
  const { authFormOpen, setAuthFormOpen } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0, blur: 20 },
    visible: {
      opacity: 1,
      blur: 0,
      transition: {
        staggerChildren: 0.2, // Time between each child's animation
        delayChildren: 0, // Initial delay before the first child starts
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative dot-grid">
      {/* Technical annotation - top left */}
      <motion.div
        initial={{x: -150, y: -20, filter: "blur(20px)"}}
        animate={{x: 0, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className={`absolute top-24 left-8 hidden lg:block transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      >
        <span className="font-sketch text-lg text-muted-foreground rotate-[-5deg] inline-block italic">
          ← margin notes here
        </span>
      </motion.div>

      {/* Technical annotation - top right */}
      <motion.div
        initial={{x: 150, y: -20, filter: "blur(20px)"}}
        animate={{x: 0, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className={`absolute top-32 right-12 hidden lg:block transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        <span className="font-sketch text-lg text-muted-foreground rotate-[3deg] inline-block">
          [ draft v1.0 ]
        </span>
      </motion.div>

      <div className="container max-w-4xl text-center px-6">
        {/* Main heading with sketch styling */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-primary text-5xl sm:text-6xl md:text-7xl lg:text-9xl  leading-tight  mb-8"
        >
          <motion.span variants={itemVariants}
            className={`block `}
          >
            A Journal
          </motion.span>
          <motion.span variants={itemVariants}
            className={`block`}
          >
            of Ideas,
          </motion.span>
          <motion.span variants={itemVariants}
            className={`block text-muted-foreground italic`}
          >
            Open to all
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: -20, filter: "blur(10px)"}}
          animate={{ y: 0, filter: "blur(0px)"}}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className={`font-mono text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A minimal space where I share my thoughts, projects, and daily
          learnings — and where you can share yours too.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: -20, filter: "blur(10px)"}}
          animate={{ y: 0, filter: "blur(0px)"}}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-[600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button
            size="lg"
            className="font-mono text-sm px-8 sketch-border cursor-pointer"
            onClick={() =>
              document
                .getElementById("posts")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Reading
          </Button>

          {!user && (
            <Button
              variant="outline"
              size="lg"
              className="font-mono text-sm px-8 cursor-pointer"
              onClick={() => setAuthFormOpen(true)}
            >
              Create Account
            </Button>
          )}
        </motion.div>

        {/* Technical bracket annotation */}
        <div
          className={`mt-16 flex justify-center transition-all duration-700 delay-[800ms] ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-sketch text-muted-foreground text-lg italic">
            {"{ scroll to explore }"}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce transition-all duration-700 delay-[900ms] ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Corner annotations */}
      <motion.div
        initial={{x: -150, y: 20, filter: "blur(20px)"}}
        animate={{x: 0, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className={`absolute bottom-12 left-8 hidden lg:block transition-all duration-700 delay-[1000ms] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="font-mono text-xs text-muted-foreground">
          <div>fig. 1.0</div>
          <div className="font-sketch text-base mt-1 italic">hero section</div>
        </div>
      </motion.div>

      <motion.div
        initial={{x: 150, y: 20, filter: "blur(20px)"}}
        animate={{x: 0, y: 0, filter: "blur(0px)"}}
        transition={{
          duration: 0.5,
          delay: 0.2,
        }}
        className={`absolute bottom-12 right-8 hidden lg:block transition-all duration-700 delay-[1000ms] ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="font-mono text-xs text-muted-foreground text-right">
          <div>REV. 2025</div>
          <div className="font-sketch text-base mt-1 italic">
            blueprint theme
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
