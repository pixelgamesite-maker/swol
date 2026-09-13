/* ── Swoldiers design tokens ──
   Tactical / military-pixel identity: dark olive base, stencil display type,
   monospace HUD labels, signal-orange used sparingly as the single alert accent. */

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap";

export const display = "'Press Start 2P', 'JetBrains Mono', monospace"; // pixel headlines
export const mono = "'JetBrains Mono', 'Courier New', monospace";      // HUD labels, stats, data
export const sans = "'Inter', 'Segoe UI', Arial, sans-serif";          // body copy

export const colors = {
  bg: "#0a0b07",
  panel: "#12140d",
  panelAlt: "#181a10",
  olive: "#4a5d32",
  oliveDark: "#2b3420",
  khaki: "#b9ad86",
  orange: "#ff5a1f",   // signal / alert accent — CTAs and confirmations only
  orangeLight: "#ff8c4d",
  danger: "#e0503f",
  border: "rgba(185,173,134,0.18)",
  textDim: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.28)",
};
