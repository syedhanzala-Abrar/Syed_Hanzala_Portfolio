import { useState, useRef, useEffect, type FormEvent } from "react";
import { Terminal as TerminalIcon, Sparkles, CornerDownLeft } from "lucide-react";
import { sound } from "@/lib/audio";
import { projectsData, skillCategories } from "@/lib/portfolioData";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error";
  text: string;
}

export function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "1",
      type: "system",
      text: "Syed Hanzala Developer Core OS [Version 2.4.0-release]",
    },
    {
      id: "2",
      type: "system",
      text: "Type 'help' to inspect available system commands or explore interactive modules.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    sound.playClick();
    const newLines: TerminalLine[] = [
      ...lines,
      { id: Math.random().toString(), type: "input", text: `$ ${cmd}` },
    ];

    const lower = cmd.toLowerCase();

    if (lower === "help") {
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: `Available Commands:
  • whoami     - Developer summary & engineering philosophy
  • skills     - Full tech stack proficiency matrix
  • projects   - Interactive list of featured case studies
  • contact    - Direct communication channels & coordinates
  • stats      - Engineering metrics & benchmark numbers
  • clear      - Clear terminal history
  • easter-egg - Secret developer surprise`,
      });
    } else if (lower === "whoami" || lower === "about") {
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: `SYED HANZALA ABRAR — Creative Developer & AI Engineer
Location: Hyderabad, India (IST UTC+5:30)
Specialization: React 19, TypeScript, Applied Machine Learning, High-Throughput Databases
Philosophy: "Clear thinking shows. Build interfaces that feel alive and resilient."`,
      });
    } else if (lower === "skills") {
      const formatted = skillCategories
        .map(
          (c) =>
            `[${c.title}]\n  ${c.items.map((i) => `${i.name} [${i.tag}]`).join(", ")}`
        )
        .join("\n\n");
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: formatted,
      });
    } else if (lower === "projects") {
      const formatted = projectsData
        .map((p) => `${p.number}. ${p.title} (${p.category}) - ${p.tagline}`)
        .join("\n");
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: `FEATURED CASE STUDIES:\n${formatted}\n\n(Tip: Click any project card above to view the full architectural breakdown)`,
      });
    } else if (lower === "contact") {
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: `Email: syedhanzal@17gmail.com
GitHub: https://github.com/syedhanzala-Abrar
LinkedIn: https://www.linkedin.com/in/syed-hanzala-abrar-68b29b395/
Status: Open for Full-Time, Contract & High-Impact Projects`,
      });
    } else if (lower === "stats") {
      newLines.push({
        id: Math.random().toString(),
        type: "output",
        text: `ENGINEERING METRICS:
  • Projects Delivered: 12+
  • Active Pathway Matches (ValuEd): 15,000+
  • Anomaly Detection Precision (IRIS): 99.1%
  • Average API Latency: <4.2ms
  • Test Coverage: 94%+`,
      });
    } else if (lower === "easter-egg" || lower === "matrix") {
      sound.playSuccess();
      newLines.push({
        id: Math.random().toString(),
        type: "system",
        text: `✨ EASTER EGG UNLOCKED!
01010011 01011001 01000101 01000100 -> "SYED"
"The only way to do great work is to love what you build."
Thanks for checking out the terminal lab!`,
      });
    } else if (lower === "clear") {
      setLines([
        {
          id: Math.random().toString(),
          type: "system",
          text: "Terminal cleared. Type 'help' for commands.",
        },
      ]);
      setInput("");
      return;
    } else if (lower.startsWith("sudo")) {
      newLines.push({
        id: Math.random().toString(),
        type: "error",
        text: "Nice try! Administrator permissions are locked in guest sandbox mode. 😉",
      });
    } else {
      newLines.push({
        id: Math.random().toString(),
        type: "error",
        text: `Command not found: '${cmd}'. Type 'help' for a list of valid commands.`,
      });
    }

    setLines(newLines);
    setInput("");
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-white/15 bg-[#090909] shadow-2xl overflow-hidden font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/10 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 text-xs text-[#8f8e89] flex items-center gap-1.5">
            <TerminalIcon size={13} className="text-[#c8ff38]" /> bash — syed@portfolio: ~/lab
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-[#c8ff38] bg-[#c8ff38]/10 px-2 py-0.5 rounded border border-[#c8ff38]/30">
            <Sparkles size={11} /> LIVE SESSION
          </span>
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="p-4 sm:p-6 max-h-[340px] overflow-y-auto space-y-2 text-xs sm:text-sm custom-scrollbar leading-relaxed">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${
              line.type === "input"
                ? "text-[#c8ff38] font-bold"
                : line.type === "system"
                ? "text-[#00f59b]"
                : line.type === "error"
                ? "text-[#ff6b6b]"
                : "text-[#c9c8c0] whitespace-pre-wrap"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Command Input Form */}
      <form
        onSubmit={handleCommand}
        className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0d] border-t border-white/10"
      >
        <span className="text-[#c8ff38] font-bold select-none">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help', 'skills', 'projects'..."
          className="flex-1 bg-transparent text-[#f1f0ea] placeholder-[#555] text-xs sm:text-sm focus:outline-none"
        />
        <button
          type="submit"
          onMouseEnter={() => sound.playHover()}
          className="p-1.5 rounded-lg border border-white/10 hover:border-[#c8ff38] bg-white/5 hover:bg-[#c8ff38] hover:text-black text-[#8f8e89] transition-colors"
          title="Run command"
        >
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  );
}
