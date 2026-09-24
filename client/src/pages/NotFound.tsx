import { Button } from "@/components/ui/button";
import { ArrowLeft, Terminal, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#08080a] text-[#f8fafc] p-4 relative overflow-hidden font-sans select-none">
      {/* Background glow & grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#c8ff38 1px, transparent 1px), radial-gradient(#00f59b 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--lime)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#111111]/90 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-[var(--lime)]/30 bg-[var(--lime)]/10 text-[var(--lime)]">
          <Terminal size={32} />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-xs font-semibold">
            STATUS 404 · ROUTE NOT FOUND
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono">
            NULL_POINTER
          </h1>
          <p className="text-sm text-[#8f8e89] leading-relaxed">
            The requested trajectory does not exist in the current architecture memory map.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleGoHome}
            className="w-full h-11 rounded-full bg-[var(--lime)] hover:bg-[var(--lime)]/90 text-black font-semibold font-mono text-xs tracking-wider transition-all"
          >
            <Home className="w-4 h-4 mr-2" /> RETURN TO ORBIT (HOME)
          </Button>
        </div>
      </div>
    </div>
  );
}
