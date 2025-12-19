import React, { useMemo, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import styles from  "./GridStyles.module.css";

const GridComponent = () => {
  // 1. We only need a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  const config = { cols: 24, rows: 13 };

  const gridCells = useMemo(() => {
    return Array.from({ length: config.cols * config.rows }).map((_, i) => ({
      id: i,
      grade: Math.floor(Math.random() * 12 - 6),
      opacity: Math.min(Math.random()+0.2, 0.4),
      hue: Math.floor(Math.random() * 40),
    }));
  }, [config.cols, config.rows]);

  useLayoutEffect(() => {
    // 2. Select ALL cells within the container
    // gsap.utils.toArray is a handy utility for this
    const cells = gsap.utils.toArray(
      ".grid-cell",
      containerRef.current,
    ) as HTMLElement[];

    // 3. Loop through each cell to attach listeners individually
    cells.forEach((el) => {
      const grade = Number(el.style.getPropertyValue("--grade"));
      // const baseOpacity = el.style.getPropertyValue("--opacity"); // Read from inline style directly

      const onEnter = () => {
        // Changed to .to() for smoothness (was .set)
        gsap.set(el, {
          rotate: grade * 90,
          filter: "grayscale(0) brightness(1.5)",
          opacity: 1,
          duration: 0.3, // Added duration for smoothness
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          rotate: 0,
          filter: "grayscale(1)",
          opacity: Number(Math.min(Math.random()+0.2, 0.4)), // Calc opacity in JS
          duration: 0.4,
          ease: "ease-out",
          overwrite: "auto",
        });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      // Store the cleanup functions on the element itself to access them later
      // (Or you can push them to an array of cleanup functions)
      (el as any)._cleanup = () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    });

    // 4. Cleanup all listeners when component unmounts
    return () => {
      cells.forEach((el) => {
        if ((el as any)._cleanup) (el as any)._cleanup();
      });
    };
  }, []);

  return (
    <main ref={containerRef}>
      <div
        className={styles.grid}
        style={
          {
            "--cols": config.cols,
            "--rows": config.rows,
          } as React.CSSProperties
        }
      >
        {gridCells.map((cell) => (
          <div
            key={cell.id}
            className="grid-cell"
            // REMOVED: ref={elRef} (Not needed on children)
            style={
              {
                "--grade": cell.grade,
                "--opacity": cell.opacity,
                "--hue": cell.hue,
              } as React.CSSProperties
            }
          >
            +
          </div>
        ))}
      </div>
    </main>
  );
};

export default GridComponent;
