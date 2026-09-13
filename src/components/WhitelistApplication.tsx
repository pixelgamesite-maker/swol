import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { colors, display, mono, sans } from "../lib/theme";
import {
  X_URL, PINNED_TWEET_URL, isValidEvm, isValidXUrl,
  extractXHandle, followIntentUrl, quoteIntentUrl, replyIntentUrl,
} from "../lib/content";

/* ── localStorage keys (namespaced so this component can be dropped anywhere) ── */
const DRAFT_KEY = "swol_wl_draft";
const SUBMITTED_KEY = "swol_wl_submitted";

const inp: React.CSSProperties = {
  width:"100%", background:"rgba(0,0,0,0.5)",
  border:`1px solid ${colors.border}`, borderRadius:"3px",
  padding:"11px 12px", fontSize:"0.85rem", color:"#fff",
  fontFamily:mono, outline:"none", transition:"border 0.2s", boxSizing:"border-box",
};

const STEPS = [
  { key: "handle",  label: "Identify" },
  { key: "follow",  label: "Follow" },
  { key: "quote",   label: "Quote" },
  { key: "comment", label: "Comment" },
  { key: "wallet",  label: "Wallet" },
] as const;

/** Opens an x.com/twitter.com intent link in a small centered popup, the way
 *  "like"/"follow" buttons behave on other sites, rather than a full new tab. */
function openIntentPopup(url: string) {
  const width = 550, height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(url, "x-intent", `width=${width},height=${height},left=${left},top=${top}`);
  if (popup) popup.opener = null;
}

export interface WhitelistApplicationProps {
  open: boolean;
  onClose: () => void;
  /** Optional label for a partner community running this allowlist collab */
  communityName?: string;
}

/**
 * Self-contained guaranteed-spot / allowlist application flow, presented as a
 * one-step-at-a-time briefing rather than a card grid.
 * Owns its own state and Supabase submission — drop it anywhere and
 * control visibility with `open` / `onClose`.
 */
export default function WhitelistApplication({ open, onClose, communityName }: WhitelistApplicationProps) {
  const [step,      setStep]      = useState(0);
  const [twitter,   setTwitter]   = useState("");
  const [wallet,    setWallet]    = useState("");
  const [quoteUrl,  setQuoteUrl]  = useState("");
  const [followed,  setFollowed]  = useState(false);
  const [commented, setCommented] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [err,       setErr]       = useState("");
  const [ready,     setReady]     = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Track that the person actually opened the relevant X popup before letting
  // them self-confirm — fixes being able to skip straight to "I've done this".
  const [openedFollow,  setOpenedFollow]  = useState(false);
  const [openedQuote,   setOpenedQuote]   = useState(false);
  const [openedComment, setOpenedComment] = useState(false);

  /* ── Load draft from localStorage on mount ── */
  useEffect(() => {
    try {
      const s = localStorage.getItem(DRAFT_KEY);
      if (s) {
        const p = JSON.parse(s);
        setTwitter(p.twitter ?? "");
        setWallet(p.wallet ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
        setFollowed(!!p.followed);
        setCommented(!!p.commented);
        setStep(typeof p.step === "number" ? p.step : 0);
      }
      if (localStorage.getItem(SUBMITTED_KEY) === "true") setAlreadySubmitted(true);
    } catch {}
    setReady(true);
  }, []);

  /* ── Persist draft ── */
  useEffect(() => {
    if (ready) localStorage.setItem(DRAFT_KEY, JSON.stringify({ twitter, wallet, quoteUrl, followed, commented, step }));
  }, [twitter, wallet, quoteUrl, followed, commented, step, ready]);

  const valid = [
    twitter.trim().length > 1,
    followed,
    isValidXUrl(quoteUrl),
    commented,
    isValidEvm(wallet),
  ];
  const allDone = valid.every(Boolean);

  function goNext() { setStep(s => Math.min(s + 1, STEPS.length - 1)); }
  function goBack() { setStep(s => Math.max(s - 1, 0)); }

  async function submit() {
    if (!allDone) { setErr("Complete every step first."); return; }
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

  const stepValid = valid[step];
  const handle = extractXHandle(X_URL) || "swoldiers_";

  return (
    <div onClick={e=>{ if (e.target===e.currentTarget) handleClose(); }} style={{
      position:"fixed", inset:0, zIndex:200,
      background:"rgba(0,0,0,0.88)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
      display:"flex", alignItems:"center", justifyContent:"center", padding:"16px",
    }}>
      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stepIn { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
      `}</style>
      <div style={{
        width:"100%", maxWidth:"440px", maxHeight:"94vh", overflowY:"auto",
        background:colors.panel, border:`1px solid ${colors.border}`, borderRadius:"6px",
        padding:"24px 22px", animation:"modalIn 0.3s ease both", position:"relative",
        boxShadow:`0 40px 80px rgba(0,0,0,0.9), 0 0 60px ${colors.orange}08`,
        fontFamily: sans,
      }}>
        <button onClick={handleClose} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.22)", fontSize:"1.1rem", lineHeight:1 }}>✕</button>

        {alreadySubmitted ? (
          <StatusScreen
            tone="neutral"
            eyebrow="Already Applied"
            title="Application received."
            body="Your spot has been logged. Selected accounts will be added to the allowlist before mint."
            onClose={handleClose}
          />
        ) : success ? (
          <StatusScreen
            tone="success"
            eyebrow="Application Sent"
            title="You are under review."
            body="Selected accounts will be added to the allowlist before mint."
            onClose={handleClose}
          />
        ) : (
          <>
            {/* ── Header + step tracker ── */}
            <p style={{ fontFamily:mono, fontSize:"0.56rem", letterSpacing:"0.16em", textTransform:"uppercase", color:colors.orange, margin:"0 0 4px" }}>
              {communityName ? `${communityName} × Swoldiers` : "Guaranteed Spot Application"}
            </p>
            <h2 style={{ fontFamily:display, fontSize:"1rem", color:"#fff", margin:"0 0 16px", lineHeight:1.5 }}>Mission Briefing</h2>

            <div style={{ display:"flex", gap:"6px", marginBottom:"22px" }}>
              {STEPS.map((s, i) => (
                <div key={s.key} style={{ flex:1 }}>
                  <div style={{
                    height:"4px", borderRadius:"2px",
                    background: i < step || valid[i] ? colors.orange : i === step ? `${colors.orange}55` : "rgba(255,255,255,0.08)",
                    transition:"background 0.3s ease",
                  }} />
                  <p style={{
                    margin:"6px 0 0", fontFamily:mono, fontSize:"0.5rem", letterSpacing:"0.04em", textTransform:"uppercase",
                    color: i === step ? "#fff" : "rgba(255,255,255,0.3)", textAlign:"center",
                  }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* ── Step body ── */}
            <div key={step} style={{ animation:"stepIn 0.25s ease both", minHeight:"170px" }}>
              {step === 0 && (
                <div>
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}aa`, margin:"0 0 8px" }}>Step 01 — who are you?</p>
                  <p style={{ fontFamily:sans, fontSize:"0.85rem", color:colors.textDim, margin:"0 0 14px", lineHeight:1.55 }}>
                    Enter the X handle you'll use for this application.
                  </p>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    value={twitter}
                    onChange={e=>setTwitter(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter" && stepValid) goNext(); }}
                    style={inp}
                    onFocus={focusInp}
                    onBlur={blurInp}
                    autoFocus
                  />
                </div>
              )}

              {step === 1 && (
                <div>
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}aa`, margin:"0 0 8px" }}>Step 02 — fall in</p>
                  <p style={{ fontFamily:sans, fontSize:"0.85rem", color:colors.textDim, margin:"0 0 16px", lineHeight:1.6 }}>
                    Follow <b style={{ color:"#fff" }}>@{handle}</b> on X.
                  </p>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={()=>{ openIntentPopup(followIntentUrl(handle)); setOpenedFollow(true); }} style={{
                      flex:1, textAlign:"center", fontFamily:mono, fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                      color:"#fff", background:"rgba(255,255,255,0.06)", border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"11px", cursor:"pointer",
                    }}>Follow on X</button>
                    <button
                      onClick={()=>setFollowed(true)}
                      disabled={followed || !openedFollow}
                      title={!openedFollow ? "Follow on X first" : undefined}
                      style={{
                        flex:1, fontFamily:mono, fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                        color: followed ? colors.orange : !openedFollow ? "rgba(255,255,255,0.25)" : "#050504",
                        background: followed ? "transparent" : !openedFollow ? "rgba(255,255,255,0.04)" : colors.orange,
                        border:`1px solid ${followed ? colors.orange : !openedFollow ? "rgba(255,255,255,0.08)" : colors.orange}`,
                        borderRadius:"3px", padding:"11px", cursor: followed || !openedFollow ? "not-allowed" : "pointer", transition:"all 0.2s",
                      }}>{followed ? "Confirmed" : "I've Done This"}</button>
                  </div>
                  {!openedFollow && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"rgba(255,255,255,0.28)", margin:"8px 0 0" }}>Follow on X first to unlock confirmation.</p>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}aa`, margin:"0 0 8px" }}>Step 03 — quote the post</p>
                  <p style={{ fontFamily:sans, fontSize:"0.85rem", color:colors.textDim, margin:"0 0 14px", lineHeight:1.55 }}>
                    Quote the pinned post with "SWOLDIERS" and tag 2 friends. Paste your quote link below.
                  </p>
                  <button onClick={()=>{ openIntentPopup(quoteIntentUrl(PINNED_TWEET_URL, "SWOLDIERS")); setOpenedQuote(true); }} style={{
                    width:"100%", textAlign:"center", fontFamily:mono, fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase",
                    color:"#fff", background:"rgba(255,255,255,0.06)", border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"11px", cursor:"pointer", marginBottom:"12px",
                  }}>Open Post to Quote</button>
                  <input
                    type="url"
                    placeholder="https://x.com/yourhandle/status/..."
                    value={quoteUrl}
                    onChange={e=>setQuoteUrl(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter" && stepValid) goNext(); }}
                    style={inp}
                    onFocus={focusInp}
                    onBlur={blurInp}
                    autoFocus
                  />
                  {quoteUrl && !isValidXUrl(quoteUrl) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:colors.danger, margin:"6px 0 0" }}>Needs a valid https://x.com/.../status/... link</p>}
                  {!openedQuote && !quoteUrl && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"rgba(255,255,255,0.28)", margin:"8px 0 0" }}>Open the post above, quote it, then paste your link here.</p>}
                </div>
              )}

              {step === 3 && (
                <div>
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}aa`, margin:"0 0 8px" }}>Step 04 — comment & tag</p>
                  <p style={{ fontFamily:sans, fontSize:"0.85rem", color:colors.textDim, margin:"0 0 16px", lineHeight:1.6 }}>
                    Comment on the pinned post and tag 2 Swoldiers.
                  </p>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={()=>{ openIntentPopup(replyIntentUrl(PINNED_TWEET_URL)); setOpenedComment(true); }} style={{
                      flex:1, textAlign:"center", fontFamily:mono, fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                      color:"#fff", background:"rgba(255,255,255,0.06)", border:`1px solid ${colors.border}`, borderRadius:"3px", padding:"11px", cursor:"pointer",
                    }}>Comment & Tag 2</button>
                    <button
                      onClick={()=>setCommented(true)}
                      disabled={commented || !openedComment}
                      title={!openedComment ? "Open the comment popup first" : undefined}
                      style={{
                        flex:1, fontFamily:mono, fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase",
                        color: commented ? colors.orange : !openedComment ? "rgba(255,255,255,0.25)" : "#050504",
                        background: commented ? "transparent" : !openedComment ? "rgba(255,255,255,0.04)" : colors.orange,
                        border:`1px solid ${commented ? colors.orange : !openedComment ? "rgba(255,255,255,0.08)" : colors.orange}`,
                        borderRadius:"3px", padding:"11px", cursor: commented || !openedComment ? "not-allowed" : "pointer", transition:"all 0.2s",
                      }}>{commented ? "Confirmed" : "I've Done This"}</button>
                  </div>
                  {!openedComment && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"rgba(255,255,255,0.28)", margin:"8px 0 0" }}>Open the comment popup first to unlock confirmation.</p>}
                </div>
              )}

              {step === 4 && (
                <div>
                  <p style={{ fontFamily:mono, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase", color:`${colors.orange}aa`, margin:"0 0 8px" }}>Step 05 — claim your wallet</p>
                  <p style={{ fontFamily:sans, fontSize:"0.85rem", color:colors.textDim, margin:"0 0 14px", lineHeight:1.55 }}>
                    This is the wallet that will be added to the allowlist.
                  </p>
                  <input
                    type="text"
                    placeholder="0x..."
                    value={wallet}
                    onChange={e=>setWallet(e.target.value)}
                    onKeyDown={e=>{ if(e.key==="Enter" && stepValid) submit(); }}
                    style={inp}
                    onFocus={focusInp}
                    onBlur={blurInp}
                    autoFocus
                  />
                  {wallet && !isValidEvm(wallet) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:colors.danger, margin:"6px 0 0" }}>Invalid address</p>}
                  <p style={{ fontFamily:sans, fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", margin:"8px 0 0", lineHeight:1.4 }}>Never share private keys or seed phrases.</p>
                </div>
              )}
            </div>

            {err && <p style={{ fontFamily:sans, fontSize:"0.78rem", color:colors.danger, margin:"14px 0 0", fontWeight:500 }}>{err}</p>}

            {/* ── Footer nav ── */}
            <div style={{ display:"flex", gap:"8px", marginTop:"20px" }}>
              {step > 0 && (
                <button onClick={goBack} style={{
                  fontFamily:mono, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
                  color:"rgba(255,255,255,0.6)", background:"transparent", border:`1px solid ${colors.border}`,
                  borderRadius:"4px", padding:"13px 18px", cursor:"pointer",
                }}>Back</button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={goNext} disabled={!stepValid} style={{
                  flex:1, fontFamily:mono, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
                  color: stepValid ? "#050504" : "rgba(255,255,255,0.18)",
                  background: stepValid ? colors.orange : "rgba(255,255,255,0.04)",
                  border:`1px solid ${stepValid ? colors.orange : "rgba(255,255,255,0.06)"}`,
                  borderRadius:"4px", padding:"13px", cursor: stepValid ? "pointer" : "not-allowed", transition:"all 0.2s",
                }}>Continue</button>
              ) : (
                <button onClick={submit} disabled={sending || !allDone} style={{
                  flex:1, fontFamily:mono, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase",
                  color: allDone ? "#050504" : "rgba(255,255,255,0.18)",
                  background: allDone ? colors.orange : "rgba(255,255,255,0.04)",
                  border:`1px solid ${allDone ? colors.orange : "rgba(255,255,255,0.06)"}`,
                  borderRadius:"4px", padding:"13px", cursor: allDone && !sending ? "pointer" : "not-allowed",
                  boxShadow: allDone ? `0 8px 24px ${colors.orange}33` : "none", transition:"all 0.2s",
                }}>{sending ? "Saving..." : "Submit Application"}</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusScreen({ tone, eyebrow, title, body, onClose }: {
  tone: "success" | "neutral"; eyebrow: string; title: string; body: string; onClose: () => void;
}) {
  const badgeBg = tone === "success" ? colors.orange : `${colors.orange}33`;
  const iconStroke = tone === "success" ? "#0a0800" : colors.orange;
  return (
    <div style={{ textAlign:"center", padding:"32px 0" }}>
      <div style={{
        width:"52px", height:"52px", borderRadius:"6px", background:badgeBg,
        display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px",
        animation: tone === "success" ? "stamp 0.5s cubic-bezier(0.23,1,0.32,1) both" : "none",
        boxShadow: tone === "success" ? `0 8px 24px ${colors.orange}44` : "none",
      }}>
        <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke={iconStroke} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontFamily:mono, fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:colors.orange, margin:"0 0 8px" }}>{eyebrow}</p>
      <h2 style={{ fontFamily:display, fontSize:"1rem", color:"#fff", margin:"0 0 12px", lineHeight:1.6 }}>{title}</h2>
      <p style={{ fontFamily:sans, fontSize:"0.88rem", color:colors.textDim, margin:0, lineHeight:1.6 }}>{body}</p>
      <button onClick={onClose} style={{ marginTop:"22px", fontFamily:mono, fontSize:"0.64rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#050504", background:colors.orange, border:"none", borderRadius:"4px", padding:"12px 26px", cursor:"pointer" }}>
        Back to Base
      </button>
    </div>
  );
}
