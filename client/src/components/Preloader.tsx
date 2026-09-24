import { useEffect, useState } from "react";
import { sound } from "@/lib/audio";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 10;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        sound.playOpen();
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 350);
      } else {
        setProgress(current);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [onComplete]);

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#08080a] text-[#f8fafc] transition-all duration-400 pointer-events-auto select-none ${
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Decorative golden backdrop glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#f5c563]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Circular HUD meter */}
        <div className="relative flex items-center justify-center w-36 h-36">
          {/* Dashed outer ring */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30 animate-[spin_14s_linear_infinite]">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2 6"
              className="text-[#9ca3af]"
            />
          </svg>

          {/* Progress SVG */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white/10"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#goldRedGrad)"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75"
            />
            <defs>
              <linearGradient id="goldRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5c563" />
                <stop offset="100%" stopColor="#ff4d5a" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Monogram SHA */}
          <div className="absolute inset-3 rounded-full border border-white/15 bg-black/85 backdrop-blur-md flex items-center justify-center shadow-2xl">
            <span className="font-mono text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5c563] to-[#ff4d5a] filter drop-shadow-[0_0_15px_rgba(245,197,99,0.6)] animate-pulse">
              SHA
            </span>
          </div>
        </div>

        {/* Counter and status */}
        <div className="flex flex-col items-center gap-1.5 font-mono">
          <div className="text-3xl font-bold tracking-tighter text-[#f8fafc] flex items-center gap-1">
            <span>{progress.toString().padStart(3, "0")}</span>
            <span className="text-sm font-normal text-[#f5c563]">%</span>
          </div>
          <span className="text-xs tracking-[0.25em] text-[#9ca3af] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c563] animate-ping" />
            INITIALIZING GOLDEN CORE
          </span>
        </div>
      </div>
    </div>
  );
}
