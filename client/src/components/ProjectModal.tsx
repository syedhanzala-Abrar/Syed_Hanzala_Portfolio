import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, ExternalLink, Github, Network, Sparkles, X } from "lucide-react";
import { type Project } from "@/lib/portfolioData";
import { sound } from "@/lib/audio";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (project) {
      sound.playOpen();
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = "unset";
      };
    }
  }, [project, onClose]);

  if (!project) return null;

  const handleCopyLink = () => {
    sound.playSuccess();
    navigator.clipboard.writeText(window.location.origin + "#project-" + project.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0a0a0a] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden text-[#f1f0ea] animate-in zoom-in-95 duration-200 font-sans">
        {/* Top bar header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-[#0e0e0e]/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full border border-[var(--lime)]/40 bg-[var(--lime)]/10 text-[var(--lime)] font-mono text-[11px] sm:text-xs font-semibold tracking-wider shrink-0">
              {project.number}
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white truncate">{project.title}</h2>
              <p className="text-[11px] sm:text-xs text-[#8f8e89] font-mono truncate">{project.category} · {project.year}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              onMouseEnter={() => sound.playHover()}
              title="Copy share link"
              className="p-1.5 sm:p-2 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-[#8f8e89] hover:text-white transition-colors"
            >
              {copied ? <Check size={15} className="text-[var(--lime)]" /> : <Copy size={15} />}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              onMouseEnter={() => sound.playHover()}
              className="p-1.5 sm:p-2 rounded-full border border-white/10 hover:border-[var(--lime)] bg-white/5 hover:bg-[var(--lime)] hover:text-black text-[#8f8e89] transition-all"
              aria-label="Close project modal"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto px-4 py-5 sm:px-8 sm:py-8 space-y-6 sm:space-y-8 custom-scrollbar">
          
          {/* Architectural System Topology HUD */}
          <div className="p-4 sm:p-6 rounded-2xl border border-white/15 bg-[#0e0e0e] space-y-4 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <span className="text-xs text-[var(--lime)] flex items-center gap-2 font-bold uppercase tracking-wider">
                <Network size={14} /> System Architecture Topology
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8f8e89]">Status: Production Ready</span>
            </div>

            {/* Architecture Node Stream */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[9px] sm:text-[10px] text-[#8f8e89] block">LAYER 01</span>
                <span className="font-bold text-[var(--lime)] block mt-0.5 text-[11px] sm:text-xs">Interface Client</span>
                <span className="text-[10px] sm:text-[11px] text-[#aaa]">React 19 / TS</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[9px] sm:text-[10px] text-[#8f8e89] block">LAYER 02</span>
                <span className="font-bold text-[#00f59b] block mt-0.5 text-[11px] sm:text-xs">API Gateway</span>
                <span className="text-[10px] sm:text-[11px] text-[#aaa]">FastAPI / REST</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[9px] sm:text-[10px] text-[#8f8e89] block">LAYER 03</span>
                <span className="font-bold text-[#00e5ff] block mt-0.5 text-[11px] sm:text-xs">Inference & ML</span>
                <span className="text-[10px] sm:text-[11px] text-[#aaa]">PyTorch / Models</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[9px] sm:text-[10px] text-[#8f8e89] block">LAYER 04</span>
                <span className="font-bold text-[#ffb300] block mt-0.5 text-[11px] sm:text-xs">Persistence</span>
                <span className="text-[10px] sm:text-[11px] text-[#aaa]">Postgres / Redis</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#8f8e89]">Role: {project.role}</span>
              <div className="flex flex-wrap items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--lime)] text-[var(--lime-dark)] font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Launch Live Platform <ExternalLink size={12} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs transition-colors"
                  >
                    Source Code <Github size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Key Engineering Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex flex-col justify-center"
              >
                <span className="text-lg sm:text-2xl font-bold font-mono text-[var(--lime)] tracking-tight">
                  {m.value}
                </span>
                <span className="text-[11px] sm:text-xs text-[#8f8e89] mt-0.5 font-mono">{m.label}</span>
              </div>
            ))}
          </div>

          {/* Overview & Purpose */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--lime)] flex items-center gap-2 font-bold">
              <Sparkles size={14} /> Problem Statement & Architectural Solution
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#d1d0c8] leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Technical Highlights */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--lime)] font-bold">
              Engineering Highlights & Benchmarks
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {project.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <span className="text-xs font-mono text-[var(--lime)] mt-0.5 font-bold shrink-0">0{i + 1}.</span>
                  <span className="text-xs sm:text-sm text-[#bcbbb3] leading-relaxed">{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8f8e89]">
              Technologies & Infrastructure
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-[11px] sm:text-xs font-mono text-[#e0dfd8]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-white/10 bg-[#0e0e0e]/95 shrink-0">
          <span className="text-[11px] sm:text-xs font-mono text-[#8f8e89] text-center sm:text-left">Syed Hanzala · System Case Study</span>
          <a
            href="#contact"
            onClick={() => {
              onClose();
              sound.playClick();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--lime)] hover:text-white transition-colors"
          >
            Discuss Similar Architecture <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
