import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let animFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check for interactive cursor hover elements
      const target = (e.target as HTMLElement)?.closest?.("a, button, input, textarea, [data-magnetic], [data-cursor-hover]");
      setIsHovered(!!target);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const render = () => {
      // Smooth follower interpolation
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animFrameId);
    };
  }, [isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99998] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Precision inner center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[var(--lime)] pointer-events-none transition-[width,height,transform] duration-150 ease-out z-20 ${
          isClicking ? "scale-75" : "scale-100"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Fluid follower ring (Clean, No Floating Text) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none flex items-center justify-center transition-[width,height,border-color,background-color,border-radius] duration-200 ease-out z-10 ${
          isHovered
            ? "-ml-5 -mt-5 w-10 h-10 rounded-full border border-[var(--lime)]/80 bg-[var(--lime)]/10 shadow-[0_0_15px_rgba(200,255,56,0.2)]"
            : isClicking
            ? "-ml-3 -mt-3 w-6 h-6 rounded-full border border-[var(--lime)] bg-[var(--lime)]/20"
            : "-ml-4 -mt-4 w-8 h-8 rounded-full border border-white/20 bg-transparent"
        }`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
