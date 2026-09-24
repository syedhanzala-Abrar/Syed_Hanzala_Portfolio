import { useEffect, useState } from "react";
import {
  Code2,
  Compass,
  FileText,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  Terminal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { projectsData, type Project } from "@/lib/portfolioData";
import { sound } from "@/lib/audio";
import { useTheme } from "@/contexts/ThemeContext";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectProject,
  soundEnabled,
  onToggleSound,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          sound.playOpen();
          // Open handled by parent or state
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (hash: string) => {
    sound.playClick();
    onClose();
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects = projectsData.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[99995] flex items-start justify-center pt-[12vh] p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200 font-sans">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#121212]">
          <Search size={18} className="text-[#c8ff38]" />
          <input
            type="text"
            placeholder="Type a command, search project, or jump to section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-[#f1f0ea] placeholder-[#6e6d68] text-sm focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded border border-white/15 bg-white/5 text-[10px] font-mono text-[#8f8e89]">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8f8e89] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results / Commands List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 custom-scrollbar text-sm">
          {/* Navigation Section */}
          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#8f8e89]">
              Navigation
            </span>
            <div className="mt-1 space-y-0.5">
              {[
                { label: "Home / Overview", hash: "#top", icon: Compass },
                { label: "About Philosophy & Bio", hash: "#about", icon: Sparkles },
                { label: "Capabilities & Tech Stack", hash: "#capabilities", icon: Layers },
                { label: "Selected Projects Showcase", hash: "#work", icon: Code2 },
                { label: "Interactive Roadmap", hash: "#roadmap", icon: FileText },
                { label: "Engineering DNA & Ethos", hash: "#ethos", icon: Terminal },
                { label: "Contact & Inquiries", hash: "#contact", icon: Mail },
              ].map((item) => (
                <button
                  key={item.hash}
                  onClick={() => navigateTo(item.hash)}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left group"
                >
                  <span className="flex items-center gap-2.5">
                    <item.icon size={15} className="text-[#8f8e89] group-hover:text-[#c8ff38]" />
                    {item.label}
                  </span>
                  <span className="text-[11px] font-mono text-[#666] group-hover:text-[#c8ff38]">
                    Jump
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Search */}
          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#8f8e89]">
              Case Studies ({filteredProjects.length})
            </span>
            <div className="mt-1 space-y-0.5">
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project);
                    onClose();
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left group"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-[#c8ff38]">{project.number}</span>
                    <span className="font-medium">{project.title}</span>
                    <span className="text-xs text-[#8f8e89] hidden sm:inline">
                      — {project.category}
                    </span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/5">
                    View
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div>
            <span className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#8f8e89]">
              Controls & Links
            </span>
            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  onToggleSound();
                  sound.playClick();
                }}
                onMouseEnter={() => sound.playHover()}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 size={15} className="text-[#c8ff38]" />
                  ) : (
                    <VolumeX size={15} className="text-[#8f8e89]" />
                  )}
                  Sound Effects Audio
                </span>
                <span className="text-xs font-mono text-[#8f8e89]">
                  {soundEnabled ? "Enabled" : "Muted"}
                </span>
              </button>

              {toggleTheme && (
                <button
                  onClick={() => {
                    toggleTheme();
                    sound.playClick();
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left"
                >
                  <span className="flex items-center gap-2.5">
                    {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
                    Toggle Color Scheme
                  </span>
                  <span className="text-xs font-mono text-[#8f8e89] capitalize">{theme}</span>
                </button>
              )}

              <a
                href="https://github.com/syedhanzala-Abrar"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sound.playHover()}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Github size={15} /> GitHub Profile
                </span>
                <Globe size={13} className="text-[#8f8e89]" />
              </a>

              <a
                href="https://www.linkedin.com/in/syed-hanzala-abrar-68b29b395/"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => sound.playHover()}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#d6d5ce] hover:text-[#c8ff38] transition-colors text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Linkedin size={15} /> LinkedIn Profile
                </span>
                <Globe size={13} className="text-[#8f8e89]" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-[#0a0a0a] text-[11px] font-mono text-[#666]">
          <span>Use ↑ ↓ to navigate, ESC to close</span>
          <span>Syed Hanzala · Quick Actions</span>
        </div>
      </div>
    </div>
  );
}
