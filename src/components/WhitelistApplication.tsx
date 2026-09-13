import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { colors, display, mono, sans } from "../lib/theme";
import { X_URL, PINNED_TWEET_URL, isValidEvm, isValidUrl } from "../lib/content";

/* ── localStorage keys (namespaced so this component can be dropped anywhere) ── */
const DRAFT_KEY = "swol_wl_draft";
const SUBMITTED_KEY = "swol_wl_submitted";

const inp: React.CSSProperties = {
  width:"100%", background:"rgba(0,0,0,0.5)",
  border:`1px solid ${colors.border}`, borderRadius:"3px",
  padding:"9px 11px", fontSize:"0.8rem", color:"#fff",
  fontFamily:mono, outline:"none", transition:"border 0.2s", boxSizing:"border-box",
};

/* ── Flip card used for each mission ── */
function FlipCard({ index, icon, title, subtitle, done, locked, children, onFlip }: {
  index:number; icon:string; title:string; subtitle:string;
  done:boolean; locked:boolean; children?:React.ReactNode; onFlip?:()=>void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (done) setFlipped(true); }, [done]);

  function handleClick() {
    if (locked || flipped) return;
    setFlipped(true); onFlip?.();
  }

  const bg = colors.panel;
  const borderCol = done ? `${colors.orange}55` : locked ? "rgba(255,255,255,0.04)" : colors.border;

  return (
    <div onClick={handleClick} style={{ perspective:"1000px", cursor: locked?"not-allowed": flipped?"default":"pointer", animation:`cardIn 0.5s ease ${0.08*index}s both` }}>
      <div style={{ position:"relative", transformStyle:"preserve-3d", transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)", transform: flipped?"rotateY(180deg)":"rotateY(0)" }}>

        {/* FRONT */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          position: flipped?"absolute":"relative", inset:0,
          background:bg, border:`1px solid ${borderCol}`, borderRadius:"6px",
          padding:"18px 14px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:"8px", minHeight:"120px", opacity: locked?0.4:1,
          boxShadow: locked?"none":`0 0 20px ${colors.orange}0f`,
        }}>
          <span style={{ fontSize:"1.4rem" }}>{locked ? "—" : icon}</span>
          <p style={{ margin:0, fontFamily:display, fontSize:"0.82rem", color: locked?"rgba(255,255,255,0.2)":"#fff", textAlign:"center", letterSpacing:"0.02em" }}>{title}</p>
          {!locked && <p style={{ margin:0, fontFamily:mono, fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Tap to open</p>}
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          position: flipped?"relative":"absolute", inset:0,
          background: done ? colors.oliveDark : bg,
          border:`1px solid ${done?`${colors.orange}55`:colors.border}`, borderRadius:"6px",
          padding:"14px 12px", minHeight:"120px",
          boxShadow: done?`0 0 20px ${colors.orange}18`:"none",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
            <div>
              <p style={{ margin:0, fontFamily:display, fontSize:"0.78rem", color:"#fff" }}>{title}</p>
              <p style={{ margin:"1px 0 0", fontFamily:mono, fontSize:"0.58rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em", textTransform:"uppercase" }}>{subtitle}</p>
            </div>
            {done && (
              <div style={{ width:"18px", height:"18px", borderRadius:"3px", background:colors.orange, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.8L8 1" stroke="#0a0c08" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export interface WhitelistApplicationProps {
  open: boolean;
  onClose: () => void;
  /** Optional label for a partner community running this allowlist collab */
  communityName?: string;
}

/**
 * Self-contained guaranteed-spot / allowlist application flow.
 * Owns its own state and Supabase submission — drop it anywhere and
 * control visibility with `open` / `onClose`.
 */
export default function WhitelistApplication({ open, onClose, communityName }: WhitelistApplicationProps) {
  const [twitter,   setTwitter]   = useState("");
  const [wallet,    setWallet]    = useState("");
  const [quoteUrl,  setQuoteUrl]  = useState("");
  const [tasks,     setTasks]     = useState<Record<string,boolean>>({});
  const [sending,   setSending]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [err,       setErr]       = useState("");
  const [ready,     setReady]     = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const [twitterConfirmed, setTwitterConfirmed] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [walletConfirmed, setWalletConfirmed] = useState(false);

  /* ── Load draft from localStorage on mount ── */
  useEffect(() => {
    try {
      const s = localStorage.getItem(DRAFT_KEY);
      if (s) {
        const p = JSON.parse(s);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
      if (localStorage.getItem(SUBMITTED_KEY) === "true") setAlreadySubmitted(true);
    } catch {}
    setReady(true);
  }, []);

  /* ── Persist draft ── */
  useEffect(() => {
    if (ready) localStorage.setItem(DRAFT_KEY, JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = quoteConfirmed && isValidUrl(quoteUrl);
  const c4 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;

  async function submit() {
    if (!allDone) { setErr("Complete all missions first."); return; }
    if (alreadySubmitted) { setErr("You have already submitted an application."); return; }

    setErr("");
    setSending(true);

    const { error: e } = await supabase
      .from("whitelist")
      .insert([{
        wallet: wallet.trim(),
        twitter: twitter.trim(),
        quote_url: quoteUrl.trim(),
        community: communityName ?? null,
      }]);

    setSending(false);

    if (e) {
      setErr("Something went wrong. Try again.");
    } else {
      setSuccess(true);
      localStorage.setItem(SUBMITTED_KEY, "true");
      setAlreadySubmitted(true);
    }
  }

  function handleClose() {
    onClose();
    if (!alreadySubmitted) { setSuccess(false); setErr(""); }
  }

  function focusInp(e: React.FocusEvent<HTMLInputElement>){ e.target.style.borderColor = `${colors.orange}66`; }
  function blurInp(e: React.FocusEvent<HTMLInputElement>){ e.target.style.borderColor = colors.border; }

  if (!open) return null;

  return (
    <div onClick={e=>{ if (e.target===e.currentTarget) handleClose(); }} style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(0,0,0,0.88)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"16px",
    }}>
      <style>{`
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
      `}</style>
      <div style={{
        width:"100%", maxWidth:"460px", maxHeight:"94vh", overflowY:"auto",
        background:colors.panel, border:`1px solid ${colors.border}`, borderRadius:"10px",
        padding:"28px 22px 24px", animation:"modalIn 0.3s ease both", position:"relative",
        boxShadow:`0 40px 80px rgba(0,0,0,0.9), 0 0 60px ${colors.orange}08`,
        fontFamily: sans,
      }}>
        <button onClick={handleClose} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.22)", fontSize:"1.1rem", lineHeight:1 }}>✕</button>

        {alreadySubmitted ? (
          <div style={{ textAlign:"center", padding:"36px 0" }}>
            <div style={{ width:"54px", height:"54px", borderRadius:"6px", background:`${colors.orange}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke={colors.orange} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:colors.orange, margin:"0 0 6px" }}>Already Applied</p>
            <h2 style={{ fontFamily:display, fontSize:"1.35rem", color:"#fff", margin:"0 0 10px" }}>Application Received.</h2>
            <p style={{ fontFamily:sans, fontSize:"0.9rem", color:colors.textDim, margin:0, lineHeight:1.6 }}>
              Your spot has been logged. Selected accounts will be added to the allowlist before mint.
            </p>
            <button onClick={handleClose} style={{ marginTop:"24px", fontFamily:mono, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#050504", background:colors.orange, border:"none", borderRadius:"4px", padding:"12px 28px", cursor:"pointer" }}>
              BACK TO BASE
            </button>
          </div>
        ) : success ? (
          <div style={{ textAlign:"center", padding:"36px 0" }}>
            <div style={{ width:"54px", height:"54px", borderRadius:"6px", background:colors.orange, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", animation:"stamp 0.5s cubic-bezier(0.23,1,0.32,1) both", boxShadow:`0 8px 24px ${colors.orange}44` }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke="#0a0800" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.2em", textTransform:"uppercase", color:colors.orange, margin:"0 0 6px" }}>Application Sent</p>
            <h2 style={{ fontFamily:display, fontSize:"1.35rem", color:"#fff", margin:"0 0 10px" }}>You Are Under Review.</h2>
            <p style={{ fontFamily:sans, fontSize:"0.9rem", color:colors.textDim, margin:0, lineHeight:1.6 }}>
              Selected accounts will be added to the allowlist before mint.
            </p>
            <button onClick={handleClose} style={{ marginTop:"24px", fontFamily:mono, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#050504", background:colors.orange, border:"none", borderRadius:"4px", padding:"12px 28px", cursor:"pointer" }}>
              BACK TO BASE
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:"22px" }}>
              <p style={{ fontFamily:mono, fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:colors.orange, margin:"0 0 4px" }}>
                {communityName ? `${communityName} × Swoldiers` : "Guaranteed Spot Application"}
              </p>
              <h2 style={{ fontFamily:display, fontSize:"1.4rem", color:"#fff", margin:"0 0 4px", letterSpacing:"0.01em" }}>Claim Your Spot</h2>
              <p style={{ fontFamily:sans, fontSize:"0.84rem", color:colors.textDim, margin:"0 0 14px", lineHeight:1.5 }}>
                Complete the missions below and submit your wallet for allowlist review.
              </p>
              <div style={{ height:"2px", background:`${colors.orange}18`, borderRadius:"2px", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:"2px", background:`linear-gradient(90deg,${colors.orange},${colors.orangeLight})`, width:`${([c1,c2,c3,c4].filter(Boolean).length/4)*100}%`, transition:"width 0.4s ease" }} />
              </div>
              <p style={{ fontFamily:mono, fontSize:"0.62rem", color:`${colors.orange}aa`, margin:"6px 0 0", letterSpacing:"0.06em" }}>
                {[c1,c2,c3,c4].filter(Boolean).length} / 4 MISSIONS COMPLETE
              </p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>

              {/* Mission 1 — X Handle */}
              <FlipCard index={0} icon="𝕏" title="Who Are You?" subtitle="Mission 01 / 04" done={c1} locked={false}>
                <p style={{ margin:"0 0 7px", fontFamily:mono, fontSize:"0.6rem", color:`${colors.orange}aa`, letterSpacing:"0.08em", textTransform:"uppercase" }}>Your X handle</p>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={twitter}
                  onChange={e=>setTwitter(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") setTwitterConfirmed(true); }}
                  onClick={e=>e.stopPropagation()}
                  style={inp}
                  onFocus={focusInp}
                  onBlur={blurInp}
                />
                {!c1 && twitter.trim().length > 1 && (
                  <button
                    onClick={e=>{ e.stopPropagation(); setTwitterConfirmed(true); }}
                    style={{
                      marginTop:"8px", width:"100%", background:`${colors.orange}22`, color:colors.orange,
                      border:`1px solid ${colors.orange}44`, borderRadius:"3px", padding:"6px",
                      fontFamily:mono, fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.08em",
                      textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                    }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=colors.orange; (e.currentTarget as HTMLButtonElement).style.color="#050504"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${colors.orange}22`; (e.currentTarget as HTMLButtonElement).style.color=colors.orange; }}
                  >
                    Confirm
                  </button>
                )}
                {c1 && <p style={{ fontFamily:mono, fontSize:"0.6rem", color:colors.orange, margin:"5px 0 0" }}>Identity confirmed</p>}
              </FlipCard>

              {/* Mission 2 — Follow + like/tag 2 */}
              <FlipCard index={1} icon="↺" title="Follow & Tag 2 Frens" subtitle="Mission 02 / 04" done={c2} locked={!c1}
                onFlip={()=>{ window.open(PINNED_TWEET_URL,"_blank"); setTimeout(()=>setTasks(p=>({...p,like:true})),800); }}>
                <p style={{ fontFamily:sans, fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.5 }}>
                  {c2 ? "Follow & tag confirmed." : `Follow @swoldiers_, like the pinned post, and tag 2 friends in the comments.`}
                </p>
                {c2 && <p style={{ fontFamily:mono, fontSize:"0.6rem", color:colors.orange, margin:"8px 0 0" }}>Mission complete</p>}
              </FlipCard>

              {/* Mission 3 — Quote the pinned post */}
              <FlipCard index={2} icon="↗" title="Quote Pinned Post" subtitle="Mission 03 / 04" done={c3} locked={!c2}
                onFlip={()=>{ window.open(PINNED_TWEET_URL,"_blank"); }}>
                {!c3 ? (
                  <>
                    <p style={{ fontFamily:sans, fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.5 }}>
                      Quote the pinned post with "SWOLDIERS" and tag 2 friends. Then paste your quote link below.
                    </p>
                    <p style={{ margin:"8px 0 0", fontFamily:mono, fontSize:"0.6rem", color:`${colors.orange}aa`, letterSpacing:"0.08em", textTransform:"uppercase" }}>Quote link</p>
                    <input
                      type="url"
                      placeholder="https://x.com/yourhandle/status/..."
                      value={quoteUrl}
                      onChange={e=>setQuoteUrl(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter" && isValidUrl(quoteUrl)) setQuoteConfirmed(true); }}
                      onClick={e=>e.stopPropagation()}
                      style={inp}
                      onFocus={focusInp}
                      onBlur={blurInp}
                    />
                    {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:colors.danger, margin:"4px 0 0" }}>Needs a valid http:// or https:// link</p>}
                    {isValidUrl(quoteUrl) && (
                      <button
                        onClick={e=>{ e.stopPropagation(); setQuoteConfirmed(true); }}
                        style={{
                          marginTop:"8px", width:"100%", background:`${colors.orange}22`, color:colors.orange,
                          border:`1px solid ${colors.orange}44`, borderRadius:"3px", padding:"6px",
                          fontFamily:mono, fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.08em",
                          textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                        }}
                        onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=colors.orange; (e.currentTarget as HTMLButtonElement).style.color="#050504"; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${colors.orange}22`; (e.currentTarget as HTMLButtonElement).style.color=colors.orange; }}
                      >
                        Verify Link
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", color:colors.orange, margin:0 }}>Quote verified</p>
                )}
              </FlipCard>

              {/* Mission 4 — Wallet */}
              <FlipCard index={3} icon="◈" title="Claim Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                <p style={{ margin:"0 0 7px", fontFamily:mono, fontSize:"0.6rem", color:`${colors.orange}aa`, letterSpacing:"0.08em", textTransform:"uppercase" }}>EVM address</p>
                <input
                  type="text"
                  placeholder="0x..."
                  value={wallet}
                  onChange={e=>setWallet(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter" && isValidEvm(wallet)) setWalletConfirmed(true); }}
                  onClick={e=>e.stopPropagation()}
                  style={inp}
                  onFocus={focusInp}
                  onBlur={blurInp}
                />
                {wallet && !isValidEvm(wallet) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:colors.danger, margin:"4px 0 0" }}>Invalid address</p>}
                {!c4 && isValidEvm(wallet) && (
                  <button
                    onClick={e=>{ e.stopPropagation(); setWalletConfirmed(true); }}
                    style={{
                      marginTop:"8px", width:"100%", background:`${colors.orange}22`, color:colors.orange,
                      border:`1px solid ${colors.orange}44`, borderRadius:"3px", padding:"6px",
                      fontFamily:mono, fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.08em",
                      textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                    }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=colors.orange; (e.currentTarget as HTMLButtonElement).style.color="#050504"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${colors.orange}22`; (e.currentTarget as HTMLButtonElement).style.color=colors.orange; }}
                  >
                    Confirm Wallet
                  </button>
                )}
                {c4 && <p style={{ fontFamily:mono, fontSize:"0.6rem", color:colors.orange, margin:"4px 0 0" }}>Wallet confirmed</p>}
                <p style={{ fontFamily:sans, fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", margin:"6px 0 0", lineHeight:1.4 }}>Never share private keys or seed phrases.</p>
              </FlipCard>

            </div>

            {err && <p style={{ fontFamily:sans, fontSize:"0.78rem", color:colors.danger, margin:"0 0 10px", fontWeight:500 }}>{err}</p>}

            <button onClick={submit} disabled={sending || !allDone} style={{
              width:"100%",
              background: allDone ? colors.orange : "rgba(255,255,255,0.04)",
              color: allDone ? "#050504" : "rgba(255,255,255,0.18)",
              border: `1px solid ${allDone ? colors.orange : "rgba(255,255,255,0.06)"}`,
              borderRadius:"4px", padding:"15px",
              fontFamily:mono, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase",
              cursor: allDone && !sending ? "pointer" : "not-allowed",
              transition:"all 0.3s ease",
              boxShadow: allDone ? `0 8px 24px ${colors.orange}33` : "none",
            }}
              onMouseEnter={e=>{ if(allDone)(e.currentTarget as HTMLButtonElement).style.background=colors.orangeLight; }}
              onMouseLeave={e=>{ if(allDone)(e.currentTarget as HTMLButtonElement).style.background=colors.orange; }}
              onMouseDown={e=>allDone && ((e.currentTarget as HTMLButtonElement).style.transform="scale(0.98)")}
              onMouseUp={e=>((e.currentTarget as HTMLButtonElement).style.transform="")}
            >
              {sending ? "Saving..." : allDone ? "SUBMIT APPLICATION" : "Complete all missions to unlock"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
