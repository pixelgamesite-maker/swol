import { useState, useEffect } from "react";
import { FONT_LINK, display, mono, sans, colors } from "../lib/theme";
import { GALLERY, TRAITS, SYSTEMS, ROADMAP, FAQS, X_URL } from "../lib/content";
import { Label, Divider, RevealSection, Particles, FaqItem, SwoldierReel } from "../components/ui";
import WhitelistApplication from "../components/WhitelistApplication";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    setTimeout(() => setReady(true), 80);
  }, []);

  return (
    <div style={{ background:colors.bg, minHeight:"100vh", fontFamily:sans, color:"#fff", overflowX:"hidden" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%{box-shadow:0 0 0 0 ${colors.orange}44, 0 10px 36px ${colors.orange}36} 50%{box-shadow:0 0 20px 4px ${colors.orange}33, 0 10px 36px ${colors.orange}36} 100%{box-shadow:0 0 0 0 ${colors.orange}44, 0 10px 36px ${colors.orange}36} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.2);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${colors.orange}33;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"0 28px", height:"62px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(10,11,7,0.86)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderBottom:`1px solid ${colors.border}`,
      }}>
        <a href="#home" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none" }}>
          <img src="/mini-logo.jpg" style={{ width:"30px", height:"30px", borderRadius:"4px", objectFit:"cover", imageRendering:"pixelated" }} alt="" />
          <span style={{ fontFamily:display, fontSize:"1rem", color:"#fff", letterSpacing:"0.06em" }}>SWOLDIERS</span>
        </a>

        <nav style={{ display:"flex", alignItems:"center", gap:"4px" }}>
          {([["Mint","#mint"]] as [string,string][]).map(([l,h])=>(
            <a key={l} href={h} style={{
              fontFamily:mono, fontSize:"0.64rem", fontWeight:500, letterSpacing:"0.14em",
              textTransform:"uppercase", color:"rgba(255,255,255,0.48)",
              padding:"8px 14px", borderRadius:"4px", transition:"all 0.2s",
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#fff";(e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.06)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.48)";(e.currentTarget as HTMLAnchorElement).style.background="transparent";}}
            >{l}</a>
          ))}
          <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,0.1)", margin:"0 8px" }} />
          <a href={X_URL} target="_blank" rel="noopener noreferrer" title="Follow on X"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"34px", height:"34px", borderRadius:"4px", color:"rgba(255,255,255,0.48)", border:"1px solid rgba(255,255,255,0.1)", transition:"all 0.2s", flexShrink:0 }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color="#fff";el.style.borderColor=`${colors.orange}55`;el.style.background="rgba(255,255,255,0.04)";}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color="rgba(255,255,255,0.48)";el.style.borderColor="rgba(255,255,255,0.1)";el.style.background="transparent";}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"110px 24px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
          <div style={{ position:"absolute", top:"38%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", borderRadius:"50%", background:`radial-gradient(circle,${colors.orange}08 0%,transparent 68%)`, pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"65%", left:"25%", width:"280px", height:"280px", borderRadius:"50%", background:`radial-gradient(circle,${colors.olive}22 0%,transparent 70%)`, pointerEvents:"none" }} />

          <div style={{ animation: ready?"fadeUp 0.7s ease 0.05s both":"none", opacity: ready?undefined:0, marginBottom:"22px" }}>
            <span style={{ fontFamily:mono, fontSize:"0.62rem", letterSpacing:"0.2em", textTransform:"uppercase", color:colors.orange, border:`1px solid ${colors.orange}44`, borderRadius:"3px", padding:"5px 16px", display:"inline-block" }}>
              4,444 ON ROBINHOOD
            </span>
          </div>

          <h1 style={{
            fontFamily:display, fontSize:"clamp(1.7rem,9vw,3.4rem)",
            color:"#fff", margin:"0 0 4px", letterSpacing:"0.02em", lineHeight:1.3,
            animation: ready?"fadeUp 0.7s ease 0.12s both":"none", opacity: ready?undefined:0,
          }}>
            SWOLDIERS
          </h1>
          <div style={{ width:"60px", height:"2px", background:colors.orange, margin:"20px auto" }} />

          <p style={{
            fontFamily:mono, fontSize:"clamp(0.85rem,2.6vw,1rem)", color:"rgba(255,255,255,0.5)",
            margin:"0 0 40px", maxWidth:"440px", lineHeight:1.7, letterSpacing:"0.02em",
            animation: ready?"fadeUp 0.7s ease 0.2s both":"none", opacity: ready?undefined:0,
          }}>
            Play. Climb the ranks. Earn your place.<br/>
            4,444 pixel-art Swoldiers battling for allowlist spots on Robinhood.
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"300px",
            animation: ready?"fadeUp 0.7s ease 0.28s both":"none", opacity: ready?undefined:0 }}>
            <button onClick={()=>setModalOpen(true)} style={{
              fontFamily:mono, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase",
              color:"#050504", background:colors.orange, border:"none", borderRadius:"4px",
              padding:"17px 36px", cursor:"pointer", transition:"all 0.2s ease",
              boxShadow:`0 10px 36px ${colors.orange}36`, animation:"pulseGlow 2.5s ease-in-out infinite",
              position:"relative", overflow:"hidden", display:"block", textAlign:"center", width:"100%",
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=colors.orangeLight;(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=colors.orange;(e.currentTarget as HTMLButtonElement).style.transform="";}}
            >
              <span style={{ position:"relative", zIndex:2 }}>CLAIM GUARANTEED SPOT</span>
              <span style={{ position:"absolute", inset:0, background:`linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`, backgroundSize:"200% 100%", animation:"shimmer 3s ease-in-out infinite", zIndex:1 }} />
            </button>
          </div>

          <div style={{
            marginTop:"52px", display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden",
            background:"rgba(255,255,255,0.015)", backdropFilter:"blur(8px)",
            animation: ready?"fadeUp 0.7s ease 0.36s both":"none", opacity: ready?undefined:0,
          }}>
            {[["4,444","Supply"],["TBA","Mint Price"],["Robinhood","Chain"],["Sign In / X","Access"]].map(([val,lbl],i)=>(
              <div key={i} style={{ padding:"18px 16px", borderLeft: i>0?`1px solid ${colors.border}`:"none", textAlign:"center" }}>
                <p style={{ margin:0, fontFamily:display, fontSize:"0.95rem", color:"#fff", letterSpacing:"0.01em" }}>{val}</p>
                <p style={{ margin:"3px 0 0", fontFamily:mono, fontSize:"0.5rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)" }}>{lbl}</p>
              </div>
            ))}
          </div>

          <div style={{ position:"absolute", bottom:"36px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity:0.35 }}>
            <span style={{ fontFamily:mono, fontSize:"0.5rem", letterSpacing:"0.24em", textTransform:"uppercase", color:colors.orange }}>Scroll</span>
            <div style={{ width:"1px", height:"28px", background:`linear-gradient(180deg,${colors.orange},transparent)` }} />
          </div>
        </div>
      </div>

      <Divider />

      <RevealSection>
        <Label text="the collection" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 16px", letterSpacing:"0.01em" }}>Meet The Swoldiers</h2>
        <p style={{ fontFamily:sans, fontSize:"0.95rem", color:colors.textDim, margin:"0 0 40px", lineHeight:1.7 }}>
          A 4,444 supply pixel-art collection built around a military universe — recruits, commanders,
          cyber units, infected soldiers, tactical operatives, and other battle-ready characters.
        </p>
        <SwoldierReel videos={GALLERY} />
      </RevealSection>

      <Divider />

      <RevealSection bg={colors.panelAlt}>
        <Label text="the loadout" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 16px" }}>Built Different</h2>
        <p style={{ fontFamily:sans, fontSize:"0.95rem", color:colors.textDim, margin:"0 0 32px", lineHeight:1.7 }}>
          Every Swoldier is assembled from a mix of gear, camo, and rank — some common, some rare enough to spot from across the map.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {TRAITS.map(t=>(
            <div key={t} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", border:`1px solid ${colors.border}`, borderRadius:"4px", background:"rgba(255,255,255,0.02)" }}>
              <div style={{ width:"6px", height:"6px", background:colors.orange, flexShrink:0 }} />
              <span style={{ fontFamily:sans, fontSize:"0.82rem", color:"rgba(255,255,255,0.6)" }}>{t}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <RevealSection>
        <div id="mint" />
        <Label text="the mint" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 16px" }}>4,444 Swoldiers. One Mint.</h2>
        <p style={{ fontFamily:sans, fontSize:"0.95rem", color:colors.textDim, margin:"0 0 32px", lineHeight:1.7 }}>
          Allowlist spots are earned through gameplay, missions, and partner collabs like this one.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", border:`1px solid ${colors.border}`, borderRadius:"6px", overflow:"hidden", marginBottom:"28px" }}>
          {[["4,444","Supply"],["TBA","Price"],["Robinhood","Chain"],["Game + AL","Access"]].map(([v,l],i)=>(
            <div key={i} style={{ padding:"20px 18px", background:"rgba(255,255,255,0.02)", borderBottom: i<2?`1px solid ${colors.border}`:"none", borderRight: i%2===0?`1px solid ${colors.border}`:"none" }}>
              <p style={{ margin:0, fontFamily:display, fontSize:"1.1rem", color:"#fff" }}>{v}</p>
              <p style={{ margin:"3px 0 0", fontFamily:mono, fontSize:"0.56rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{l}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setModalOpen(true)} style={{
          width:"100%", fontFamily:mono, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase",
          color:"#050504", background:colors.orange, border:`1px solid ${colors.orange}`,
          borderRadius:"4px", padding:"16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          transition:"all 0.2s ease", boxShadow:`0 8px 32px ${colors.orange}33`,
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=colors.orangeLight;}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=colors.orange;}}
        >
          Claim Guaranteed Spot
        </button>
      </RevealSection>

      <Divider />

      <RevealSection bg={colors.panelAlt}>
        <Label text="token" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.4rem,6vw,2.3rem)", color:"#fff", margin:"0 0 16px", letterSpacing:"0.02em" }}>$SWOL</h2>
        <p style={{ fontFamily:sans, fontSize:"0.95rem", color:colors.textDim, lineHeight:1.8 }}>
          $SWOL is the post-mint token connected to the game. Players will be able to earn $SWOL
          through gameplay, including token drops that occasionally appear during play — tracked in
          a separate token balance on your profile. Full details land after mint.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="systems" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 32px" }}>The Systems</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
          {SYSTEMS.map((s,i)=>(
            <div key={s.name} style={{ padding:"22px 0", borderBottom:`1px solid ${colors.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px" }}>
              <div>
                <p style={{ margin:0, fontFamily:display, fontSize:"1rem", color:"#fff" }}>{s.name}</p>
                <p style={{ margin:"4px 0 0", fontFamily:sans, fontSize:"0.88rem", color:colors.textDim, lineHeight:1.5 }}>{s.desc}</p>
              </div>
              <span style={{ fontFamily:mono, fontSize:"0.56rem", letterSpacing:"0.12em", color:`${colors.orange}77`, flexShrink:0, paddingTop:"4px" }}>
                {String(i+1).padStart(2,"0")}
              </span>
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <RevealSection bg={colors.panelAlt}>
        <Label text="the plan" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 36px" }}>What Comes Next</h2>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:"16px", top:0, bottom:0, width:"1px", background:`linear-gradient(180deg,${colors.orange}44,${colors.orange}11)` }} />
          <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
            {ROADMAP.map((r,i)=>(
              <div key={r.phase} style={{ display:"flex", gap:"24px", paddingBottom: i<ROADMAP.length-1?"28px":"0", paddingLeft:"40px", position:"relative" }}>
                <div style={{ position:"absolute", left:"10px", top:"4px", width:"13px", height:"13px", borderRadius:"3px", border:`1px solid ${colors.orange}`, background:colors.bg, flexShrink:0 }} />
                <div>
                  <p style={{ margin:0, fontFamily:mono, fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:colors.orange, marginBottom:"4px" }}>{r.phase}</p>
                  <p style={{ margin:0, fontFamily:display, fontSize:"0.95rem", color:"#fff" }}>{r.title}</p>
                  <p style={{ margin:"4px 0 0", fontFamily:sans, fontSize:"0.86rem", color:colors.textFaint, lineHeight:1.55 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="faq" />
        <h2 style={{ fontFamily:display, fontSize:"clamp(1.05rem,4.2vw,1.7rem)", color:"#fff", margin:"0 0 32px" }}>Questions</h2>
        <div>
          {FAQS.map(f=><FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </RevealSection>

      <Divider />

      <footer style={{ padding:"60px 24px 40px", textAlign:"center" }}>
        <img src="/mini-logo.jpg" style={{ width:"44px", height:"44px", borderRadius:"6px", objectFit:"cover", marginBottom:"16px", imageRendering:"pixelated" }} alt="" />
        <h3 style={{ fontFamily:display, fontSize:"1.2rem", color:"#fff", margin:"0 0 6px", letterSpacing:"0.04em" }}>SWOLDIERS</h3>
        <p style={{ fontFamily:sans, fontSize:"0.86rem", color:colors.textFaint, margin:"0 0 24px", lineHeight:1.7 }}>
          Play. Climb the ranks. Earn your place.<br/>
          4,444 Swoldiers on Robinhood. Powered by $SWOL.
        </p>
        <div style={{ display:"flex", gap:"24px", justifyContent:"center", marginBottom:"36px" }}>
          {[["X",X_URL],["Mint","#mint"]].map(([l,h])=>(
            <a key={l} href={h} target={h.startsWith("http")?"_blank":undefined} rel="noopener noreferrer" style={{ fontFamily:mono, fontSize:"0.66rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}bb`, transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color=`${colors.orange}bb`)}>
              {l}
            </a>
          ))}
        </div>
        <p style={{ fontFamily:mono, fontSize:"0.55rem", letterSpacing:"0.24em", textTransform:"uppercase", color:`${colors.orange}55` }}>
          FALL IN. THE BATTLEFIELD OPENS SOON.
        </p>
      </footer>

      <WhitelistApplication open={modalOpen} onClose={()=>setModalOpen(false)} />
    </div>
  );
}
