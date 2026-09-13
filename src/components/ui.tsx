import { useState, useEffect, useRef } from "react";
import { colors, mono, display } from "../lib/theme";

/* ── Scroll-reveal hook ── */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Section label (HUD-style tag) ── */
export function Label({ text }: { text: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
      <div style={{ height:"1px", flex:1, background:`linear-gradient(90deg,transparent,${colors.orange}44)` }} />
      <span style={{ fontFamily:mono, fontSize:"0.62rem", letterSpacing:"0.22em", textTransform:"uppercase", color:colors.orange, whiteSpace:"nowrap" }}>
        // {text}
      </span>
      <div style={{ height:"1px", flex:1, background:`linear-gradient(90deg,${colors.orange}44,transparent)` }} />
    </div>
  );
}

/* ── Divider ── */
export function Divider() {
  return <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${colors.border},transparent)` }} />;
}

/* ── Scroll-reveal section wrapper ── */
export function RevealSection({ children, bg = colors.bg, extra, delay = 0 }: {
  children: React.ReactNode; bg?: string; extra?: React.CSSProperties; delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} style={{
      background: bg, padding:"80px 0", position:"relative", ...extra,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 24px" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Faint drifting dust/spark particles ── */
export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x:number; y:number; size:number; speedX:number; speedY:number; opacity:number }[] = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(185,173,134,${p.opacity})`; // khaki dust
        ctx!.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0
    }} />
  );
}

/* ── FAQ item ── */
export function FaqItem({ q, a }: { q:string; a:string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${colors.border}` }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"16px 0", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
        <span style={{ fontFamily:display, fontSize:"0.92rem", color:open?"#fff":"rgba(255,255,255,0.75)", textAlign:"left", letterSpacing:"0.01em" }}>{q}</span>
        <span style={{ color:colors.orange, fontSize:"1.1rem", flexShrink:0, transition:"transform 0.25s", transform: open?"rotate(45deg)":"rotate(0)" }}>+</span>
      </button>
      {open && (
        <p style={{ fontFamily:"var(--sans)", fontSize:"0.88rem", color:colors.textDim, padding:"0 0 16px", margin:0, lineHeight:1.65 }}>{a}</p>
      )}
    </div>
  );
}

/* ── Swoldier gallery — auto-cycling showcase ── */
export function SwoldierGallery({ images }: { images: string[] }) {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { timer.current = setTimeout(next, 3200); return () => clearTimeout(timer.current); }, [cur]);

  function next() { fade((cur+1) % images.length); }
  function fade(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 280);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
      <div style={{ width:"100%", maxWidth:"340px", aspectRatio:"1/1", borderRadius:"4px", overflow:"hidden", border:`1px solid ${colors.border}`, background:colors.panel, imageRendering:"pixelated" }}>
        <img src={images[cur]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity: fading?0:1, transition:"opacity 0.28s ease" }} />
      </div>
      <div style={{ display:"flex", gap:"6px" }}>
        {images.map((_,i) => (
          <button key={i} onClick={()=>fade(i)} style={{ width: i===cur?"20px":"5px", height:"5px", borderRadius:"1px", background: i===cur?colors.orange:"rgba(255,255,255,0.15)", border:"none", padding:0, cursor:"pointer", transition:"all 0.3s ease" }} />
        ))}
      </div>
    </div>
  );
}
