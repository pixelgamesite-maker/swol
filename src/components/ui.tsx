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

/* ── Swoldier reel — video viewfinder with a filmstrip, not a crossfade carousel ── */
export function SwoldierReel({ videos }: { videos: string[] }) {
  const [active, setActive] = useState(0);

  function prev() { setActive(a => (a - 1 + videos.length) % videos.length); }
  function next() { setActive(a => (a + 1) % videos.length); }

  const arrowBtn = (side: "left" | "right"): React.CSSProperties => ({
    position:"absolute", top:"50%", [side]:"8px", transform:"translateY(-50%)",
    width:"30px", height:"30px", borderRadius:"3px",
    background:"rgba(10,11,7,0.55)", border:`1px solid ${colors.border}`,
    color:"#fff", fontSize:"1.1rem", lineHeight:1, cursor:"pointer",
    display:"flex", alignItems:"center", justifyContent:"center", zIndex:2,
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      <div style={{
        position:"relative", width:"100%", maxWidth:"420px", margin:"0 auto",
        aspectRatio:"1/1", borderRadius:"4px", overflow:"hidden",
        border:`1px solid ${colors.border}`, background:colors.panel,
      }}>
        <video
          key={videos[active]}
          src={videos[active]}
          autoPlay muted loop playsInline
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
        />
        {/* scanline overlay for a HUD/CRT feel */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", mixBlendMode:"overlay",
          background:"repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)",
        }} />
        <div style={{
          position:"absolute", top:"8px", left:"10px", display:"flex", alignItems:"center", gap:"6px",
          fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.08em", color:colors.orange,
          textShadow:"0 1px 3px rgba(0,0,0,0.9)",
        }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:colors.orange, boxShadow:`0 0 6px ${colors.orange}` }} />
          FEED {String(active + 1).padStart(2,"0")}/{String(videos.length).padStart(2,"0")}
        </div>
        <button onClick={prev} aria-label="Previous" style={arrowBtn("left")}>‹</button>
        <button onClick={next} aria-label="Next" style={arrowBtn("right")}>›</button>
      </div>

      <div style={{ display:"flex", gap:"6px", justifyContent:"center", flexWrap:"wrap" }}>
        {videos.map((v, i) => (
          <button
            key={v}
            onClick={() => setActive(i)}
            aria-label={`Show clip ${i + 1}`}
            style={{
              width:"44px", height:"44px", flexShrink:0, padding:0, cursor:"pointer",
              borderRadius:"3px", overflow:"hidden",
              border: i === active ? `2px solid ${colors.orange}` : `1px solid ${colors.border}`,
              opacity: i === active ? 1 : 0.5, transition:"all 0.2s ease",
              background:colors.panel,
            }}
          >
            <video src={v} muted playsInline preload="metadata" style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
