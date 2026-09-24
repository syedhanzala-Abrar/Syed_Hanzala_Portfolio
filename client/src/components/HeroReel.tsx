import { useEffect, useRef, useState } from "react";
import { Cpu, Database, Network, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { sound } from "@/lib/audio";
import { projectsData, type Project } from "@/lib/portfolioData";

interface HeroVisualProps {
  onSelectProject?: (project: Project) => void;
}

export function HeroReel({ onSelectProject }: HeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // 3D Mouse Parallax Tilt
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rotateX = 0;
    let rotateY = 0;
    let targetX = 0;
    let targetY = 0;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetX = -y * 10; // Max 10 deg tilt
      targetY = x * 10;
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("mouseleave", onMouseLeave);

    const render = () => {
      rotateX += (targetX - rotateX) * 0.1;
      rotateY += (targetY - rotateY) * 0.1;

      if (container) {
        container.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const featured = projectsData[activeTab] || projectsData[0];

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 select-none">
      <div
        ref={containerRef}
        className="w-full max-w-lg rounded-3xl border border-white/15 bg-gradient-to-b from-[#111111]/90 to-[#070707]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-300 hover:border-[#c8ff38]/40 hover:shadow-[0_0_60px_rgba(200,255,56,0.12)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Decorative Grid Mesh Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#c8ff38 1px, transparent 1px), radial-gradient(#00f59b 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 10px 10px",
          }}
        />

        {/* HUD Top Bar */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 font-mono text-xs text-[#8f8e89]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8ff38] animate-ping" />
            <span className="text-white font-bold tracking-wider">SYSTEM TELEMETRY</span>
          </div>
          <span className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-[#c8ff38]">
            CORE v2.6
          </span>
        </div>

        {/* Interactive Architecture Selector Tabs */}
        <div className="relative z-10 grid grid-cols-4 gap-1.5 my-5 p-1 rounded-2xl border border-white/10 bg-white/5 font-mono text-[11px]">
          {projectsData.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(idx);
              }}
              onMouseEnter={() => sound.playHover()}
              className={`py-2 rounded-xl transition-all font-semibold ${
                activeTab === idx
                  ? "bg-[#c8ff38] text-black shadow-lg"
                  : "text-[#8f8e89] hover:text-white hover:bg-white/5"
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>

        {/* Main Telemetry & System Blueprint HUD */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#c8ff38]">
                {featured.category}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                {featured.title}
              </h3>
              <p className="text-xs text-[#8f8e89] font-mono mt-0.5">{featured.subtitle}</p>
            </div>
          </div>

          {/* Interactive Topology Graph Flow */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/50 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#8f8e89] pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-[#00f59b]">
                <Network size={13} /> TOPOLOGY PIPELINE
              </span>
              <span className="text-[#c8ff38]">LIVE INFERENCE</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#e0dfd7] gap-1">
              <div className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-center flex-1">
                <span className="block text-[9px] text-[#8f8e89]">CLIENT</span>
                <span className="font-bold text-[#c8ff38]">React 19</span>
              </div>
              <span className="text-white/40">➔</span>
              <div className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-center flex-1">
                <span className="block text-[9px] text-[#8f8e89]">BACKEND</span>
                <span className="font-bold text-[#00f59b]">FastAPI</span>
              </div>
              <span className="text-white/40">➔</span>
              <div className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-center flex-1">
                <span className="block text-[9px] text-[#8f8e89]">DATABASE</span>
                <span className="font-bold text-[#00e5ff]">PostgreSQL</span>
              </div>
            </div>
          </div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {featured.metrics.slice(0, 2).map((m, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-white/10 bg-white/[0.03] flex flex-col justify-center"
              >
                <span className="text-lg font-bold font-mono text-[#c8ff38] tracking-tight">
                  {m.value}
                </span>
                <span className="text-[10px] font-mono text-[#8f8e89]">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {featured.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-[10px] font-mono text-[#d1d0c8]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Direct Inspect CTA */}
          <button
            onClick={() => {
              sound.playClick();
              if (onSelectProject) onSelectProject(featured);
            }}
            onMouseEnter={() => sound.playHover()}
            data-cursor-text="INSPECT"
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#c8ff38] text-white hover:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-white/15 hover:border-[#c8ff38] transition-all"
          >
            <Terminal size={14} /> Open System Case Study
          </button>
        </div>
      </div>
    </div>
  );
}
