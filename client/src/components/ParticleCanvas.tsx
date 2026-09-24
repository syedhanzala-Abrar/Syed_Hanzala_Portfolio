import { useEffect, useRef, useState } from "react";

interface CelestialNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  colorDark: string;
  colorLight: string;
  depth: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface CelestialWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener("resize", onResize);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 200,
      isActive: false,
    };

    const waves: CelestialWave[] = [];

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.isActive = true;
    };

    const onMouseLeave = () => {
      mouse.isActive = false;
    };

    const onClick = (e: MouseEvent) => {
      const isLightMode = document.documentElement.classList.contains("light");
      waves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 6,
        maxRadius: 300,
        opacity: isLightMode ? 0.75 : 0.9,
        color: isLightMode ? "#00875a" : "#f5c563",
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick, { passive: true });

    let nodes: CelestialNode[] = [];

    const initNodes = () => {
      nodes = [];
      // High density dots quantity across desktop, tablet, and mobile
      const count = Math.min(160, Math.max(50, Math.floor((width * height) / 8500)));
      // Dark Mode: Light Gold, Crimson Red, Platinum Grey, Champagne
      const darkPalette = ["#f5c563", "#ff4d5a", "#9ca3af", "#fce7a2", "#e5e7eb", "#f5c563", "#9ca3af"];
      // Light Mode: Bright Forest Emerald, Vivid Jade, Oceanic Cyan, Deep Teal, Vibrant Cobalt
      const lightPalette = ["#00875a", "#059669", "#0284c7", "#0d9488", "#10b981", "#00875a", "#2563eb", "#047857"];

      for (let i = 0; i < count; i++) {
        const depth = Math.random() * 0.75 + 0.25;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.38 * depth,
          vy: (Math.random() - 0.5) * 0.38 * depth,
          size: (Math.random() * 2.5 + 1.1) * depth,
          alpha: Math.random() * 0.45 + 0.45,
          colorDark: darkPalette[Math.floor(Math.random() * darkPalette.length)],
          colorLight: lightPalette[Math.floor(Math.random() * lightPalette.length)],
          depth,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initNodes();

    let time = 0;

    const render = () => {
      time += 0.012;
      const isLightMode = document.documentElement.classList.contains("light");

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.isActive) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      // 1. Expanding click waves
      for (let w = waves.length - 1; w >= 0; w--) {
        const wv = waves[w];
        wv.radius += 6.5;
        wv.opacity *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isLightMode
          ? `rgba(0, 135, 90, ${wv.opacity})`
          : `rgba(245, 197, 99, ${wv.opacity})`;
        ctx.lineWidth = 1.6;
        if (!isLightMode) {
          ctx.shadowColor = "#f5c563";
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowColor = "#00875a";
          ctx.shadowBlur = 10;
        }
        ctx.stroke();
        ctx.restore();

        if (wv.opacity < 0.01 || wv.radius > wv.maxRadius) {
          waves.splice(w, 1);
        }
      }

      // 2. Celestial Nodes & Energy Laser Links
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const activeColor = isLightMode ? node.colorLight : node.colorDark;

        node.x += node.vx + Math.sin(time + node.pulsePhase) * 0.2 * node.depth;
        node.y += node.vy + Math.cos(time + node.pulsePhase) * 0.2 * node.depth;

        // Wrap boundaries
        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        // Mouse interaction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.isActive) {
          const force = (1 - dist / mouse.radius) * 2.4 * node.depth;
          node.x -= (dx / dist) * force;
          node.y -= (dy / dist) * force;
        }

        // Draw node with bright contrast in light mode
        const dynamicAlpha = isLightMode
          ? Math.min(0.95, node.alpha + 0.2 + Math.sin(time * 2 + node.pulsePhase) * 0.1)
          : Math.min(0.9, node.alpha + Math.sin(time * 2 + node.pulsePhase) * 0.15);

        ctx.save();
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * (isLightMode ? 1.15 : 1.0), 0, Math.PI * 2);
        ctx.fillStyle = activeColor;
        ctx.globalAlpha = Math.max(0.3, Math.min(1.0, dynamicAlpha));

        if (isLightMode) {
          ctx.shadowColor = node.colorLight;
          ctx.shadowBlur = 6 * node.depth;
        } else if (node.depth > 0.5) {
          ctx.shadowColor = node.colorDark;
          ctx.shadowBlur = 8 * node.depth;
        }
        ctx.fill();
        ctx.restore();

        // Connect adjacent nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const node2 = nodes[j];
          const cdx = node.x - node2.x;
          const cdy = node.y - node2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          const maxDist = 110 * ((node.depth + node2.depth) / 2);

          if (cdist < maxDist) {
            const lineAlpha = (1 - cdist / maxDist) * (isLightMode ? 0.32 : 0.22) * node.depth;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = isLightMode ? node.colorLight : node.colorDark;
            ctx.globalAlpha = Math.max(0.08, Math.min(0.85, lineAlpha));
            ctx.lineWidth = (isLightMode ? 1.0 : 0.8) * node.depth;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Connect to active cursor
        if (mouse.isActive && dist < mouse.radius) {
          const mouseAlpha = (1 - dist / mouse.radius) * (isLightMode ? 0.75 : 0.6) * node.depth;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isLightMode ? "#00875a" : "#f5c563";
          ctx.globalAlpha = mouseAlpha;
          ctx.lineWidth = isLightMode ? 1.3 : 1.1;
          if (isLightMode) {
            ctx.shadowColor = "#00875a";
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowColor = "#f5c563";
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Ambient Celestial Nebulas */}
      {isLight ? (
        <>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00875a]/[0.055] blur-[150px] animate-[floatSmooth_14s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[#0284c7]/[0.045] blur-[160px] animate-[floatSmooth_18s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-10 left-1/4 w-[650px] h-[650px] rounded-full bg-[#00875a]/[0.035] blur-[170px] animate-[floatSmooth_22s_ease-in-out_infinite]" />
        </>
      ) : (
        <>
          <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-[#f5c563]/[0.055] blur-[160px] animate-[floatSmooth_14s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#ff4d5a]/[0.045] blur-[170px] animate-[floatSmooth_18s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-10 left-1/4 w-[700px] h-[700px] rounded-full bg-[#9ca3af]/[0.03] blur-[180px] animate-[floatSmooth_22s_ease-in-out_infinite]" />
        </>
      )}

      {/* Interactive Celestial Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
