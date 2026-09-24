import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Network,
  Search,
  Send,
  Sparkles,
  Sun,
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { sound } from "@/lib/audio";
import {
  assetUrls,
  projectsData,
  skillCategories,
  roadmapMilestones,
  testimonials,
  type Project,
} from "@/lib/portfolioData";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { ProjectModal } from "@/components/ProjectModal";
import { CommandPalette } from "@/components/CommandPalette";
import { InteractiveTerminal } from "@/components/InteractiveTerminal";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";

const navItems = [
  ["About", "#about"],
  ["Capabilities", "#capabilities"],
  ["Work", "#work"],
  ["Roadmap", "#roadmap"],
  ["Ethos", "#ethos"],
  ["Contact", "#contact"],
] as const;

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="section-label flex items-center gap-3 mb-8 sm:mb-12 font-mono text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
      <span className="text-[var(--lime)] font-bold">{number}</span>
      <span className="w-8 h-px bg-[var(--line)]" />
      <span className="text-[var(--foreground)] font-medium">{label}</span>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Projects filter
  const [projectFilter, setProjectFilter] = useState("all");

  // Skills filter
  const [activeSkillCategory, setActiveSkillCategory] = useState("all");

  // About tab
  const [aboutTab, setAboutTab] = useState<"bio" | "philosophy" | "metrics">("bio");

  // Contact form
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  // Time in Hyderabad
  const [istTime, setIstTime] = useState("");

  const shellRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Ensure page always starts at top on initial open/refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  // Update IST clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setIstTime(new Intl.DateTimeFormat([], options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const toggleSoundState = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
    toast(next ? "Sound effects enabled" : "Sound effects muted", {
      duration: 1500,
    });
  };

  // Copy email
  const copyEmail = () => {
    sound.playSuccess();
    navigator.clipboard.writeText("syedhanzal@17gmail.com");
    setEmailCopied(true);
    toast.success("Email copied to clipboard!", {
      description: "syedhanzal@17gmail.com",
      duration: 2500,
    });
    setTimeout(() => setEmailCopied(false), 3000);
  };

  // Scroll reveal & magnetic logic
  useEffect(() => {
    if (loading) return;
    const shell = shellRef.current;
    if (!shell) return;

    const updateScrollState = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      shell.style.setProperty("--scroll-progress", progress.toString());
      shell.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    shell.classList.add("motion-ready");
    const revealItems = Array.from(shell.querySelectorAll<HTMLElement>("[data-reveal]"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const magneticItems = Array.from(shell.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = magneticItems.map((item) => {
      const onPointerMove = (event: PointerEvent) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const bounds = item.getBoundingClientRect();
        const x = event.clientX - (bounds.left + bounds.width / 2);
        const y = event.clientY - (bounds.top + bounds.height / 2);
        item.style.setProperty("--magnetic-x", `${x * 0.18}px`);
        item.style.setProperty("--magnetic-y", `${y * 0.18}px`);
        item.classList.add("is-magnetized");
      };
      const onPointerLeave = () => {
        item.style.setProperty("--magnetic-x", "0px");
        item.style.setProperty("--magnetic-y", "0px");
        item.classList.remove("is-magnetized");
      };
      item.addEventListener("pointermove", onPointerMove);
      item.addEventListener("pointerleave", onPointerLeave);
      return () => {
        item.removeEventListener("pointermove", onPointerMove);
        item.removeEventListener("pointerleave", onPointerLeave);
      };
    });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      revealObserver.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [loading]);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    sound.playSuccess();

    setTimeout(() => {
      setIsSubmitting(false);
      setContactForm({ name: "", email: "", message: "" });
      toast.success("Message dispatched successfully!", {
        description: "Thank you for reaching out, Syed will reply shortly.",
        duration: 4000,
      });
    }, 1000);
  };

  // Filtered projects
  const filteredProjects = projectsData.filter((p) => {
    if (projectFilter === "all") return true;
    if (projectFilter === "ai") return p.tags.includes("Machine Learning") || p.tags.includes("AI") || p.tags.includes("Python");
    if (projectFilter === "frontend") return p.tags.includes("React") || p.tags.includes("React 19") || p.tags.includes("Education");
    if (projectFilter === "systems") return p.tags.includes("PostgreSQL") || p.tags.includes("SQL") || p.tags.includes("Database Design");
    return true;
  });

  return (
    <>
      {loading && (
        <Preloader
          onComplete={() => {
            setLoading(false);
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }}
        />
      )}
      <CustomCursor />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectProject={(p) => setSelectedProject(p)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSoundState}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <div className="site-shell min-h-screen relative selection:bg-[var(--lime)] selection:text-[var(--lime-dark)] font-sans" ref={shellRef}>
        {/* Subtle Film Grain Noise Overlay */}
        <div className="grain pointer-events-none fixed inset-0 z-30 opacity-[0.035]" aria-hidden="true" />

        {/* Geometric Background Grid Lines */}
        <div className="page-grid pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

        {/* Global Interactive Kinetic Particle & Aurora Canvas */}
        <ParticleCanvas />

        {/* Scroll Meter Progress Line */}
        <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[var(--lime)] origin-left z-[9999] transition-transform duration-75" style={{ transform: "scaleX(var(--scroll-progress, 0))" }} />

        {/* Floating Glassmorphic Navigation Header */}
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--card-border)] px-4 sm:px-8 md:px-12 py-4 flex items-center justify-between">
          {/* Brand Monogram */}
          <a
            className="brand flex items-center gap-3 group"
            href="#top"
            aria-label="Syed Hanzala Abrar home"
            onClick={() => {
              closeMenu();
              sound.playClick();
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <div className="relative w-9 h-9 rounded-full border border-[var(--line-strong)] bg-white/5 flex items-center justify-center group-hover:border-[var(--lime)] group-hover:shadow-[0_0_15px_rgba(245,197,99,0.4)] transition-all">
              <span className="font-mono text-xs font-black tracking-wider text-[var(--lime)]">SHA</span>
            </div>
            <div className="flex flex-col font-mono text-[11px] leading-tight font-bold tracking-wider text-[var(--foreground)] group-hover:text-[var(--lime)] transition-colors">
              <span>SYED HANZALA ABRAR</span>
              <span className="text-[9px] text-[var(--muted)] font-normal">PORTFOLIO '26</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)]" aria-label="Main navigation">
            {navItems.map(([label, href]) => (
              <a
                href={href}
                key={label}
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="relative py-1 text-[var(--foreground)] opacity-75 hover:opacity-100 hover:text-[var(--lime)] transition-colors group"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--lime)] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Utility Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Command Palette Trigger (Ctrl+K) */}
            <button
              onClick={() => {
                sound.playOpen();
                setCommandPaletteOpen(true);
              }}
              onMouseEnter={() => sound.playHover()}
              title="Open Command Palette (Ctrl+K)"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--card-border)] bg-white/5 hover:border-[var(--lime)] hover:bg-white/10 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-all shadow-sm"
            >
              <Search size={13} className="text-[var(--lime)]" />
              <span className="text-[11px]">Search</span>
              <kbd className="text-[9px] px-1.5 py-0.5 rounded border border-[var(--card-border)] bg-white/5 text-[var(--muted)]">
                Ctrl K
              </kbd>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSoundState}
              onMouseEnter={() => sound.playHover()}
              aria-label={soundEnabled ? "Mute audio" : "Enable audio"}
              title={soundEnabled ? "Sound Enabled" : "Sound Muted"}
              className={`p-2 rounded-full border transition-all duration-300 ${
                soundEnabled
                  ? "border-[var(--lime)] bg-[var(--lime)]/10 text-[var(--lime)] shadow-[0_0_12px_rgba(200,255,56,0.2)]"
                  : "border-[var(--card-border)] bg-white/5 text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => {
                toggleTheme();
                sound.playSwitch();
              }}
              onMouseEnter={() => sound.playHover()}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="p-2 rounded-full border border-[var(--card-border)] bg-white/5 hover:border-[var(--lime)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {theme === "dark" ? <Sun size={16} className="text-[#c8ff38]" /> : <Moon size={16} className="text-[#00875a]" />}
            </button>

            {/* Direct Discuss Project CTA */}
            <a
              href="#contact"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--lime)] text-[var(--lime-dark)] font-mono text-xs font-semibold tracking-wider uppercase hover:opacity-90 transition-all"
            >
              Let's Talk <ArrowDownRight size={14} />
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              className="lg:hidden p-2 text-[var(--foreground)] hover:text-[var(--lime)] transition-colors"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              onClick={() => {
                sound.playClick();
                setMenuOpen((open) => !open);
              }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-in Menu Drawer */}
        <div
          className={`fixed inset-0 z-40 lg:hidden bg-[var(--background)]/98 backdrop-blur-2xl flex flex-col justify-between p-8 pt-28 transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
            menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
            {navItems.map(([label, href], index) => (
              <a
                href={href}
                key={label}
                onClick={() => {
                  sound.playClick();
                  closeMenu();
                }}
                className="flex items-center justify-between text-2xl font-bold tracking-tight text-[var(--foreground)] hover:text-[var(--lime)] pb-3 border-b border-[var(--card-border)] transition-colors"
              >
                <span className="font-mono text-sm text-[var(--lime)] font-normal">0{index + 1}</span>
                <span>{label}</span>
                <ArrowUpRight size={20} className="text-[var(--muted)]" />
              </a>
            ))}
          </nav>

          <div className="space-y-4 pt-6 border-t border-[var(--card-border)]">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
              <span>HYDERABAD, INDIA</span>
              <span className="text-[var(--lime)] font-bold">{istTime}</span>
            </div>
            <a
              href="mailto:syedhanzal@17gmail.com"
              onClick={copyEmail}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--lime)] text-[var(--lime-dark)] font-mono text-xs font-bold uppercase tracking-wider"
            >
              <Mail size={16} /> syedhanzal@17gmail.com
            </a>
          </div>
        </div>

        {/* Main Content Sections */}
        <main id="top" className="relative z-10 pt-20">

          {/* HERO SECTION: Grand Full-Width Editorial Layout (No Floating Project) */}
          <section className="relative min-h-[75vh] sm:min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 overflow-hidden" id="home">
            <div className="relative z-10 w-full max-w-5xl space-y-6 sm:space-y-8">
              
              {/* Top Status & Region Badge */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] sm:text-xs tracking-wider uppercase text-[var(--muted)]" data-reveal>
                <div className="flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[var(--card-border)] bg-white/[0.03] backdrop-blur-md">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] dark:bg-[var(--lime)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b91c1c] dark:bg-[var(--lime)]" />
                  </span>
                  <span className="text-[var(--foreground)] font-medium">AVAILABLE FOR WORK</span>
                  <span className="text-[var(--muted)] opacity-30">/</span>
                  <span className="text-[var(--muted)]">FULL-STACK & AI</span>
                </div>
                <span className="hidden sm:inline opacity-30">|</span>
                <span className="text-[var(--lime)] font-bold hidden sm:inline">{istTime} IST · HYDERABAD</span>
              </div>

              {/* Headline & Statement */}
              <div className="space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs md:text-sm font-mono text-[var(--lime)] uppercase tracking-[0.2em] sm:tracking-[0.25em]" data-reveal>
                  <Sparkles size={14} className="shrink-0" /> CREATIVE DEVELOPER & AI ENGINEER
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.8rem] font-black tracking-tight sm:tracking-tighter leading-[0.9] sm:leading-[0.88] uppercase text-[var(--foreground)] break-words" data-reveal>
                  <span>MAKE IT </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] via-[var(--lime)] to-[var(--gradient-end)]">
                    MATTER.
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed font-sans" data-reveal>
                  I engineer considered digital products where interface craft, high-throughput systems, and applied artificial intelligence meet.
                </p>
              </div>

              {/* Action Buttons & Quick Copy */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2" data-reveal>
                <a
                  href="#work"
                  data-magnetic
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[var(--lime)] text-[var(--lime-dark)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,197,99,0.35)] dark:shadow-[0_0_30px_rgba(245,197,99,0.35)] text-center"
                >
                  Explore Selected Work <ArrowDownRight size={16} />
                </a>

                <button
                  onClick={copyEmail}
                  data-magnetic
                  onMouseEnter={() => sound.playHover()}
                  className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-full border border-[var(--card-border)] bg-white/[0.03] hover:border-[var(--line-strong)] hover:bg-white/[0.08] text-[var(--foreground)] font-mono text-xs font-medium uppercase tracking-wider transition-all"
                >
                  {emailCopied ? <Check size={14} className="text-[var(--lime)]" /> : <Copy size={14} />}
                  <span>{emailCopied ? "Email Copied" : "Copy Email"}</span>
                </button>
              </div>

              {/* Highlight Metrics Ribbon */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-[var(--card-border)] font-mono" data-reveal>
                <div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--foreground)] block tracking-tight">04</span>
                  <span className="text-[10px] sm:text-[11px] text-[var(--muted)] uppercase tracking-wider">Architectures</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--lime)] block tracking-tight">&lt;4.2ms</span>
                  <span className="text-[10px] sm:text-[11px] text-[var(--muted)] uppercase tracking-wider">Latency</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--accent-red)] block tracking-tight">99.1%</span>
                  <span className="text-[10px] sm:text-[11px] text-[var(--muted)] uppercase tracking-wider">Precision</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--muted)] block tracking-tight">100%</span>
                  <span className="text-[10px] sm:text-[11px] text-[var(--muted)] uppercase tracking-wider">Polish</span>
                </div>
              </div>
            </div>
          </section>

          {/* KINETIC MARQUEE BANNER #1 */}
          <div className="relative w-full py-5 border-y border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden select-none" aria-hidden="true">
            <div className="flex gap-8 whitespace-nowrap animate-[marquee_26s_linear_infinite] font-mono text-sm sm:text-base tracking-[0.25em] text-[var(--muted)] uppercase">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span>FULL STACK DEVELOPER</span>
                  <span className="text-[var(--lime)]">✦</span>
                  <span className="text-[var(--foreground)]">APPLIED AI & MACHINE LEARNING</span>
                  <span className="text-[var(--lime)]">✦</span>
                  <span>SYSTEM ARCHITECTURE</span>
                  <span className="text-[var(--lime)]">✦</span>
                  <span className="text-[var(--lime)]">KINETIC WEB EXPERIENCES</span>
                  <span className="text-[var(--lime)]">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* ABOUT SECTION with Interactive Philosophy Tabs */}
          <section className="section-rail py-14 sm:py-20 md:py-28" id="about">
            <SectionLabel number="01" label="About & Philosophy" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start" data-reveal>
              {/* Left Headline Display */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:tracking-tighter leading-[0.95] text-[var(--foreground)]">
                  I BUILD WITH A <br />
                  <span className="text-[var(--muted)]">POINT OF VIEW.</span>
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  I’m <strong className="text-[var(--foreground)]">Syed Hanzala Abrar</strong> — a creative developer based in India, passionate about the intersection of high-performance frontend engineering, AI-driven automation, and resilient data backends.
                </p>

                {/* Tab Switcher */}
                <div className="grid grid-cols-3 rounded-xl border border-[var(--card-border)] bg-white/5 p-1 font-mono text-[11px] sm:text-xs">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAboutTab("bio");
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`py-2 rounded-lg transition-all text-center ${
                      aboutTab === "bio" ? "bg-[var(--lime)] text-[var(--lime-dark)] font-bold shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Bio
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAboutTab("philosophy");
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`py-2 rounded-lg transition-all text-center ${
                      aboutTab === "philosophy" ? "bg-[var(--lime)] text-[var(--lime-dark)] font-bold shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Ethos
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAboutTab("metrics");
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`py-2 rounded-lg transition-all text-center ${
                      aboutTab === "metrics" ? "bg-[var(--lime)] text-[var(--lime-dark)] font-bold shadow-md" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    Pillars
                  </button>
                </div>
              </div>

              {/* Right Tab Content Card */}
              <div className="lg:col-span-7 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl space-y-6">
                {aboutTab === "bio" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Sparkles size={18} className="text-[var(--lime)]" /> Crafting End-to-End Excellence
                    </h3>
                    <p className="text-[var(--muted)] text-sm sm:text-base leading-relaxed">
                      My journey began with deep curiosity about how large-scale digital platforms manage complexity without sacrificing user delight. Over the past few years, I’ve engineered full-stack web applications, architected database models, and trained machine learning anomaly detection pipelines.
                    </p>
                    <p className="text-[var(--muted)] text-sm sm:text-base leading-relaxed">
                      Whether designing an education roadmap for thousands of students or optimizing PostgreSQL query indexes down to 4ms, I obsess over every detail beneath and above the surface.
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {["React 19", "FastAPI", "PyTorch", "PostgreSQL", "Next.js", "Docker"].map((tech) => (
                        <span key={tech} className="px-3 py-1 rounded-full border border-[var(--card-border)] bg-white/5 text-xs font-mono text-[var(--lime)]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {aboutTab === "philosophy" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Code2 size={18} className="text-[var(--lime)]" /> Engineering Philosophy
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-white/[0.02]">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">1. Form Follows Substance</h4>
                        <p className="text-xs text-[var(--muted)] mt-1">Animations and micro-interactions must clarify context, reduce cognitive load, and never be merely decorative.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-white/[0.02]">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">2. Deterministic Under the Hood</h4>
                        <p className="text-xs text-[var(--muted)] mt-1">Systems should fail gracefully, log intelligently, and uphold strict data integrity invariants at all times.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-white/[0.02]">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">3. Continuous Curiosity</h4>
                        <p className="text-xs text-[var(--muted)] mt-1">Every project is an opportunity to push browser capabilities, explore neural architectures, and refine the developer experience.</p>
                      </div>
                    </div>
                  </div>
                )}

                {aboutTab === "metrics" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Layers size={18} className="text-[var(--lime)]" /> Core Principles & Focus
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-4 rounded-xl border border-[var(--card-border)] bg-white/[0.03]">
                        <span className="text-xs font-mono text-[var(--lime)] font-bold">ACCESSIBILITY FIRST</span>
                        <p className="text-xs text-[var(--muted)] mt-1">Semantic HTML5, full keyboard navigability, high-contrast typography, and reduced-motion fallbacks.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--card-border)] bg-white/[0.03]">
                        <span className="text-xs font-mono text-[var(--lime)] font-bold">PERFORMANCE OBSESSED</span>
                        <p className="text-xs text-[var(--muted)] mt-1">Zero bundle bloat, hardware-accelerated 60fps animations, lazy loading, and edge caching.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--card-border)] bg-white/[0.03]">
                        <span className="text-xs font-mono text-[var(--lime)] font-bold">ROBUST DATA PIPELINES</span>
                        <p className="text-xs text-[var(--muted)] mt-1">ACID transactions, relational constraint modeling, and reproducible machine learning datasets.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-[var(--card-border)] bg-white/[0.03]">
                        <span className="text-xs font-mono text-[var(--lime)] font-bold">INTENTIONAL DESIGN</span>
                        <p className="text-xs text-[var(--muted)] mt-1">Editorial pacing, bespoke color palettes, and modern typography hierarchy.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CAPABILITIES & TECH STACK MATRIX (Clean tag matrix without statistics) */}
          <section className="section-rail py-14 sm:py-20 md:py-28 border-t border-[var(--card-border)]" id="capabilities">
            <SectionLabel number="02" label="Technical Capabilities" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12" data-reveal>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:tracking-tighter leading-[0.9] text-[var(--foreground)]">
                  TECH STACK & <br />
                  <span className="text-[var(--muted)]">SYSTEM MASTERY.</span>
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 sm:mt-3 max-w-md">
                  Technical range is most useful when it serves the shape of the problem—not the other way around.
                </p>
              </div>

              {/* Interactive Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 font-mono text-xs">
                {["all", "frontend", "systems", "ai", "tools"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick();
                      setActiveSkillCategory(cat);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full border uppercase tracking-wider transition-all text-[11px] sm:text-xs ${
                      activeSkillCategory === cat
                        ? "border-[var(--lime)] bg-[var(--lime)] text-[var(--lime-dark)] font-bold shadow-[0_0_15px_rgba(245,197,99,0.3)] dark:shadow-[0_0_15px_rgba(245,197,99,0.3)]"
                        : "border-[var(--card-border)] bg-white/5 text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Capability Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6" data-reveal>
              {skillCategories
                .filter((cat) => {
                  if (activeSkillCategory === "all") return true;
                  if (activeSkillCategory === "frontend") return cat.title.toLowerCase().includes("frontend");
                  if (activeSkillCategory === "systems") return cat.title.toLowerCase().includes("backend");
                  if (activeSkillCategory === "ai") return cat.title.toLowerCase().includes("ai");
                  if (activeSkillCategory === "tools") return cat.title.toLowerCase().includes("devops");
                  return true;
                })
                .map((category) => (
                  <div
                    key={category.number}
                    className="group relative p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--card-border-hover)] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-5 pb-3 sm:mb-6 sm:pb-4 border-b border-[var(--card-border)]">
                      <div>
                        <span className="text-[11px] sm:text-xs font-mono text-[var(--lime)] uppercase tracking-widest">
                          {category.number} / {category.tag}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-[var(--foreground)] mt-0.5 sm:mt-1 group-hover:text-[var(--lime)] transition-colors">
                          {category.title}
                        </h3>
                      </div>
                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--card-border)] bg-white/5 flex items-center justify-center text-xs font-mono text-[var(--muted)] group-hover:border-[var(--lime)] group-hover:text-[var(--lime)] transition-colors shrink-0">
                        {category.items.length}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--muted)] mb-5 sm:mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    {/* Clean Skill Items Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {category.items.map((skill) => (
                        <div
                          key={skill.name}
                          className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02] hover:border-[var(--lime)] hover:bg-white/[0.04] transition-all duration-200 group/item flex flex-col justify-between space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold font-mono text-[var(--foreground)] group-hover/item:text-[var(--lime)] transition-colors flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] shrink-0" />
                              {skill.name}
                            </span>
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full border border-[var(--card-border)] bg-white/5 text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider shrink-0">
                              {skill.tag}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-[var(--muted)] leading-snug">{skill.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* SELECTED PROJECTS SHOWCASE */}
          <section className="section-rail py-14 sm:py-20 md:py-28 border-t border-[var(--card-border)]" id="work">
            <SectionLabel number="03" label="Selected System Case Studies" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12" data-reveal>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:tracking-tighter leading-[0.9] text-[var(--foreground)]">
                  SELECTED <br />
                  <span className="text-[var(--muted)]">SYSTEM ARCHITECTURES.</span>
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] mt-2 sm:mt-3 max-w-lg">
                  Full-stack distributed platforms, real-time threat intelligence models, and high-throughput databases documented with concrete engineering matter.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-xs">
                {[
                  { id: "all", label: "All Systems" },
                  { id: "ai", label: "AI & ML" },
                  { id: "frontend", label: "Frontend" },
                  { id: "systems", label: "Databases & APIs" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => {
                      sound.playClick();
                      setProjectFilter(filter.id);
                    }}
                    onMouseEnter={() => sound.playHover()}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all text-[11px] sm:text-xs ${
                      projectFilter === filter.id
                        ? "border border-[var(--lime)] bg-[var(--lime)] text-[var(--lime-dark)] font-bold shadow-[0_0_15px_rgba(245,197,99,0.3)] dark:shadow-[0_0_15px_rgba(245,197,99,0.3)]"
                        : "border border-[var(--card-border)] bg-white/5 text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editorial Case Study List */}
            <div className="space-y-5 sm:space-y-6" data-reveal>
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedProject(project);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className="group relative p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--card-border-hover)] hover:bg-[var(--card-hover)] transition-all duration-300 cursor-pointer shadow-xl space-y-5 sm:space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs pb-3 border-b border-[var(--card-border)]">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="px-2.5 py-0.5 rounded-full border border-[var(--lime)]/40 bg-[var(--lime)]/10 text-[var(--lime)] font-bold text-[11px] sm:text-xs">
                        SYSTEM {project.number}
                      </span>
                      <span className="text-[var(--muted)] uppercase tracking-widest text-[11px] sm:text-xs">{project.category}</span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[var(--muted)]">Role: {project.role}</span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--foreground)] group-hover:text-[var(--lime)] transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[var(--lime)]">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm md:text-base text-[var(--muted)] leading-relaxed max-w-4xl">
                    {project.description}
                  </p>

                  {/* Technical Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--foreground)] opacity-85 font-mono p-2.5 sm:p-3 rounded-xl border border-[var(--card-border)] bg-white/[0.02]">
                        <span className="text-[var(--lime)] font-bold mt-0.5 shrink-0">✦</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack chips & Action CTA bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 sm:pt-4 border-t border-[var(--card-border)]">
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-[var(--card-border)] bg-white/[0.03] text-[10px] sm:text-[11px] font-mono text-[var(--foreground)] opacity-75"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playClick();
                          setSelectedProject(project);
                        }}
                        className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-[var(--lime)] text-[var(--lime-dark)] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-all shadow-md text-center"
                      >
                        <span>Explore Deep-Dive Specs</span>
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CAREER ROADMAP & TIMELINE SECTION */}
          <section className="section-rail py-14 sm:py-20 md:py-28 border-t border-[var(--card-border)]" id="roadmap">
            <SectionLabel number="04" label="Career Roadmap & Journey" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12" data-reveal>
              <div className="lg:col-span-4 space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight sm:tracking-tighter leading-[0.9] text-[var(--foreground)]">
                  MILESTONES & <br />
                  <span className="text-[var(--muted)]">TRAJECTORY.</span>
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                  A chronological track of engineering growth, academic foundations, and high-impact project releases.
                </p>
              </div>

              <div className="lg:col-span-8 space-y-6 sm:space-y-8 relative before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-px before:bg-[var(--card-border)]">
                {roadmapMilestones.map((milestone, idx) => (
                  <div key={idx} className="relative pl-8 sm:pl-12 group">
                    {/* Glowing Node Dot */}
                    <div className="absolute left-1.5 sm:left-2.5 top-2 sm:top-1.5 -ml-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[var(--background)] bg-[var(--lime)] shadow-[0_0_12px_rgba(245,197,99,0.8)] group-hover:scale-125 transition-transform" />

                    <div className="p-5 sm:p-7 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--card-border-hover)] transition-all duration-300 space-y-3">
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-[var(--card-border)]">
                        <span className="text-[11px] sm:text-xs font-mono text-[var(--lime)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] shrink-0" />
                          {milestone.badge}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--lime)] transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-mono text-[var(--muted)]">{milestone.role} — {milestone.organization}</p>

                      <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                        {milestone.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {milestone.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded border border-[var(--card-border)] bg-white/5 text-[10px] font-mono text-[var(--muted)]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 05: ENGINEERING DNA & DEVELOPER ETHOS */}
          <section className="section-rail py-14 sm:py-20 md:py-28 border-t border-[var(--card-border)]" id="ethos">
            <SectionLabel number="05" label="Engineering DNA & Ethos" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start" data-reveal>
              {/* Left Column: Vision & Principles */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--lime)] uppercase tracking-widest">
                  <Sparkles size={15} /> Beyond The Code
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight sm:tracking-tighter leading-[0.9] text-[var(--foreground)]">
                  WHAT DRIVES <br />
                  <span className="text-[var(--muted)]">MY CRAFT.</span>
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                  I believe software engineering is at its best when rigorous system architecture meets intuitive, kinetic design. Every line of code should reduce friction, uphold data correctness, and feel effortless to use.
                </p>

                {/* 4 Core DNA Pillars */}
                <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 font-mono text-xs">
                  {[
                    {
                      num: "01",
                      title: "Architecture & Data Integrity",
                      desc: "Strict schema constraints, clean modular boundaries, and ACID reliability.",
                    },
                    {
                      num: "02",
                      title: "60fps Tactile Interfaces",
                      desc: "Hardware-accelerated animations, micro-interactions, and accessible typography.",
                    },
                    {
                      num: "03",
                      title: "Applied Machine Intelligence",
                      desc: "Practical ML inference and automated anomaly clustering built for high-throughput reality.",
                    },
                    {
                      num: "04",
                      title: "Continuous Curiosity",
                      desc: "Constantly testing new browser capabilities, WebGL, systems theory, and open source.",
                    },
                  ].map((pillar) => (
                    <div
                      key={pillar.num}
                      className="p-3.5 sm:p-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--lime)]/50 transition-all duration-300 group flex items-start gap-3"
                    >
                      <span className="text-xs font-mono text-[var(--lime)] font-bold mt-0.5 shrink-0">
                        {pillar.num}
                      </span>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--lime)] transition-colors">
                          {pillar.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[var(--muted)] font-sans leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Developer Profile & Workstation Card */}
              <div className="lg:col-span-7 space-y-6">
                {/* Profile Snapshot Card */}
                <div className="p-5 sm:p-8 lg:p-9 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl backdrop-blur-xl space-y-5 sm:space-y-6 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[var(--card-border)] font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--lime)] animate-ping shrink-0" />
                      <span className="font-bold text-[var(--foreground)]">SYED HANZALA ABRAR</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full border border-[var(--lime)]/30 bg-[var(--lime)]/10 text-[10px] text-[var(--lime)] font-semibold">
                      FULL-STACK & AI
                    </span>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
                      Crafting resilient systems and considered digital products.
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                      Based in Hyderabad, India (IST UTC+5:30), collaborating globally. I blend modern frontend frameworks with scalable backend services and applied machine learning models.
                    </p>
                  </div>

                  {/* Core Technical Highlights Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2 font-mono text-xs">
                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02]">
                      <span className="text-[10px] text-[var(--lime)] uppercase tracking-wider block font-bold">CORE EXPERTISE</span>
                      <p className="text-xs text-[var(--foreground)] font-semibold mt-1">React 19, TypeScript, Next.js</p>
                      <p className="text-[10px] sm:text-[11px] text-[var(--muted)] mt-0.5">Component architecture & state flow</p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02]">
                      <span className="text-[10px] text-[#00f59b] uppercase tracking-wider block font-bold">BACKEND & STORAGE</span>
                      <p className="text-xs text-[var(--foreground)] font-semibold mt-1">Node.js, PostgreSQL, FastAPI</p>
                      <p className="text-[10px] sm:text-[11px] text-[var(--muted)] mt-0.5">Sub-5ms queries & relational design</p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02]">
                      <span className="text-[10px] text-[#00e5ff] uppercase tracking-wider block font-bold">INTELLIGENCE</span>
                      <p className="text-xs text-[var(--foreground)] font-semibold mt-1">Python, PyTorch, Scikit-Learn</p>
                      <p className="text-[10px] sm:text-[11px] text-[var(--muted)] mt-0.5">Anomaly detection & data pipelines</p>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02]">
                      <span className="text-[10px] text-[#ffb300] uppercase tracking-wider block font-bold">DEVOPS & TOOLS</span>
                      <p className="text-xs text-[var(--foreground)] font-semibold mt-1">Docker, Git Workflows, Linux</p>
                      <p className="text-[10px] sm:text-[11px] text-[var(--muted)] mt-0.5">Automated environments & CI/CD</p>
                    </div>
                  </div>

                  {/* Personal Work Ethos Quote */}
                  <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-[var(--lime)]/30 bg-[var(--lime)]/5 font-mono text-xs space-y-1.5">
                    <span className="text-[10px] text-[var(--lime)] font-bold uppercase tracking-widest block">PERSONAL MANIFESTO</span>
                    <p className="text-xs text-[var(--foreground)] italic font-sans leading-relaxed">
                      "Simplicity is prerequisite for reliability. Build software that solves the root problem and leaves no cognitive debt behind."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CLIENT TESTIMONIALS & PRAISE */}
          <section className="section-rail py-14 sm:py-20 md:py-28 border-t border-[var(--card-border)]">
            <SectionLabel number="06" label="Endorsements & Impact" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6" data-reveal>
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] flex flex-col justify-between space-y-5 sm:space-y-6 hover:border-[var(--card-border-hover)] transition-all"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-1 text-[var(--lime)]">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--foreground)] opacity-85 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-[var(--card-border)] font-mono">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">{t.author}</h4>
                    <p className="text-[11px] sm:text-xs text-[var(--muted)]">{t.role} · {t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* KINETIC MARQUEE BANNER #2 */}
          <div className="relative w-full py-5 sm:py-6 border-y border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden select-none" aria-hidden="true">
            <div className="flex gap-8 whitespace-nowrap animate-[marquee_20s_linear_infinite_reverse] font-mono text-xs sm:text-base tracking-[0.25em] text-[var(--muted)] uppercase">
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span className="text-[var(--foreground)] font-bold">LET'S BUILD SOMETHING EXTRAORDINARY</span>
                  <span className="text-[var(--lime)]">✦</span>
                  <span>OPEN FOR COLLABORATION</span>
                  <span className="text-[var(--lime)]">✦</span>
                  <span className="text-[var(--lime)]">HYDERABAD / REMOTE</span>
                  <span className="text-[var(--lime)]">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* CONTACT & FOOTER SECTION */}
          <section className="section-rail py-14 sm:py-20 md:py-28" id="contact">
            <SectionLabel number="07" label="Initiate Contact" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start" data-reveal>
              {/* Contact Information & Copy Actions */}
              <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight sm:tracking-tighter leading-[0.88] uppercase text-[var(--foreground)]">
                    LET’S <br />
                    <span className="text-[var(--lime)]">CONNECT.</span>
                  </h2>
                  <p className="text-xs sm:text-base text-[var(--muted)] mt-3 sm:mt-4 leading-relaxed">
                    Have an ambitious product idea, a systems engineering challenge, or a full-time role? Let's turn it into reality.
                  </p>
                </div>

                {/* Interactive Email Badge */}
                <div className="space-y-2.5 sm:space-y-3 font-mono">
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[var(--muted)]">Direct Email</span>
                  <button
                    onClick={copyEmail}
                    data-magnetic
                    onMouseEnter={() => sound.playHover()}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--lime)] hover:bg-[var(--lime)]/10 text-[var(--foreground)] hover:text-[var(--lime)] transition-all group min-w-0"
                  >
                    <span className="text-xs sm:text-base font-bold truncate">syedhanzal@17gmail.com</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[var(--muted)] group-hover:text-[var(--lime)] shrink-0">
                      {emailCopied ? <Check size={15} /> : <Copy size={15} />}
                      <span>{emailCopied ? "Copied" : "Copy"}</span>
                    </div>
                  </button>
                </div>

                {/* Social Channels */}
                <div className="space-y-2.5 sm:space-y-3 font-mono">
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[var(--muted)]">Direct Channels</span>
                  <div className="flex flex-wrap gap-2.5 sm:gap-3">
                    <a
                      href="https://github.com/syedhanzala-Abrar"
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => sound.playClick()}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--lime)] text-xs text-[var(--foreground)] transition-all group"
                    >
                      <Github size={14} className="group-hover:text-[var(--lime)]" /> GitHub <ExternalLink size={11} className="text-[var(--muted)]" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/syed-hanzala-abrar-68b29b395/"
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic
                      onMouseEnter={() => sound.playHover()}
                      onClick={() => sound.playClick()}
                      className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--lime)] text-xs text-[var(--foreground)] transition-all group"
                    >
                      <Linkedin size={14} className="group-hover:text-[var(--lime)]" /> LinkedIn <ExternalLink size={11} className="text-[var(--muted)]" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Animated Interactive Signal Transmission Hub */}
              <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl backdrop-blur-xl relative overflow-hidden space-y-6 sm:space-y-7">
                {/* Ambient Radar Grid Background */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(var(--lime) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Animated Status Header */}
                <div className="relative z-10 flex items-center justify-between pb-3 sm:pb-4 border-b border-[var(--card-border)] font-mono text-xs">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] dark:bg-[var(--lime)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#b91c1c] dark:bg-[var(--lime)]" />
                    </span>
                    <span className="text-[var(--foreground)] font-bold tracking-wider text-[11px] sm:text-xs">LIVE SIGNAL HUB</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[var(--muted)]">HYDERABAD · READY TO BUILD</span>
                </div>

                {/* Animated Interactive Topic Triggers */}
                <div className="relative z-10 space-y-2.5 sm:space-y-3">
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[var(--muted)] block">
                    Select a collaboration path:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {[
                      {
                        title: "Full-Time Engineering Role",
                        desc: "Frontend, AI Integration, or Systems",
                        subject: "Full-Time Opportunity Discussion",
                      },
                      {
                        title: "High-Impact Project",
                        desc: "End-to-end web & software development",
                        subject: "Project Collaboration Inquiry",
                      },
                      {
                        title: "Applied AI Consultation",
                        desc: "Anomaly detection & ML pipelines",
                        subject: "Applied AI Discussion",
                      },
                      {
                        title: "Technical Sync & Coffee",
                        desc: "Networking, mentoring & ideas",
                        subject: "Quick Technical Sync",
                      },
                    ].map((item) => (
                      <a
                        key={item.title}
                        href={`mailto:syedhanzal@17gmail.com?subject=${encodeURIComponent(item.subject)}`}
                        onClick={() => sound.playOpen()}
                        onMouseEnter={() => sound.playHover()}
                        className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[var(--card-border)] bg-white/[0.02] hover:border-[var(--lime)] hover:bg-[var(--lime)]/5 transition-all duration-300 group flex flex-col justify-between space-y-2 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--lime)] transition-colors">
                            {item.title}
                          </h4>
                          <ArrowUpRight size={14} className="text-[var(--muted)] group-hover:text-[var(--lime)] transition-colors shrink-0" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[var(--muted)] leading-snug">{item.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick 1-Click Action Bar */}
                <div className="relative z-10 pt-1 sm:pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3 font-mono">
                  <a
                    href="mailto:syedhanzal@17gmail.com?subject=Project%20Inquiry%20from%20Portfolio"
                    onClick={() => sound.playSuccess()}
                    onMouseEnter={() => sound.playHover()}
                    className="flex-1 py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl bg-[var(--lime)] text-[var(--lime-dark)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-[0_0_25px_rgba(245,197,99,0.35)] transition-all text-center"
                  >
                    <Send size={14} /> Launch Direct Email
                  </a>
                  <button
                    onClick={copyEmail}
                    onMouseEnter={() => sound.playHover()}
                    className="py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl border border-[var(--card-border)] bg-white/5 hover:border-[var(--lime)] text-[var(--foreground)] text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-center"
                  >
                    {emailCopied ? <Check size={14} className="text-[var(--lime)]" /> : <Copy size={14} />}
                    <span>{emailCopied ? "Email Copied" : "Copy Address"}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* SITE FOOTER */}
        <footer className="section-rail py-8 sm:py-10 border-t border-[var(--card-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--muted)] text-center sm:text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="font-mono text-xs font-black tracking-wider px-2 py-0.5 rounded border border-[var(--lime)]/30 bg-[var(--lime)]/10 text-[var(--lime)]">SHA</span>
            <span className="text-[var(--foreground)] font-bold">Syed Hanzala Abrar</span>
            <span className="hidden sm:inline">— Crafted with Precision</span>
          </div>

          <p className="text-center opacity-70 text-[11px] sm:text-xs">
            High-contrast editorial aesthetics & creative code.
          </p>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()}</span>
            <a
              href="#top"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-[var(--lime)] hover:underline"
            >
              Back to Top ↑
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
