/* ── Swoldiers content & config ── */

export const GALLERY = [
  "/1.mp4","/2.mp4","/3.mp4","/4.mp4","/5.mp4","/6.mp4",
];

export const TRAITS = [
  "Helmets","Armor","Weapons","Face Gear",
  "Camo Patterns","Rank Insignias","Backgrounds","Special Ops Gear",
];

export const SYSTEMS = [
  { name: "The Battlefield", desc: "Sign in with X, drop into the game, and start earning points." },
  { name: "The Leaderboard", desc: "Climb the ranks. Top performers earn guaranteed and allowlist spots." },
  { name: "Missions",        desc: "Daily and community missions push your score higher." },
  { name: "$SWOL Drops",     desc: "Token drops appear mid-game. Earn $SWOL just by playing." },
];

export const ROADMAP = [
  { phase: "Phase I",   title: "Game Goes Live",       desc: "Sign in with X and enter the battlefield." },
  { phase: "Phase II",  title: "Leaderboard Opens",    desc: "Points, ranks, and missions go live." },
  { phase: "Phase III", title: "Allowlist Selection",  desc: "Top players and partner communities earn guaranteed spots." },
  { phase: "Phase IV",  title: "Mint",                 desc: "4,444 Swoldiers mint on Robinhood." },
  { phase: "Phase V",   title: "$SWOL Launches",       desc: "The token earned through gameplay goes live." },
];

export const FAQS = [
  { q: "What is Swoldiers?",                a: "A game-first NFT collection of 4,444 pixel-art Swoldiers launching on Robinhood." },
  { q: "How do I get on the allowlist?",     a: "Play the game, earn points, and climb the leaderboard. Top performers and partner communities get guaranteed spots." },
  { q: "What is the mint price?",            a: "TBA." },
  { q: "Where does Swoldiers mint?",         a: "Robinhood." },
  { q: "Do I need to play to mint?",         a: "No, but playing is the main way to earn a guaranteed spot." },
  { q: "What is $SWOL?",                     a: "A post-mint token earned through gameplay, including surprise drops that appear during play." },
];

export const X_URL = "https://x.com/swoldiers_";
export const GAME_URL = "https://swoldiers.xyz";
// TODO: replace with the live pinned post for this collab's missions
export const PINNED_TWEET_URL = "https://x.com/swoldiers_";

export function isValidEvm(a: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(a.trim());
}
export function isValidUrl(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidXUrl(u: string) {
  try {
    const url = new URL(u.trim());
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    return (host === "x.com" || host === "twitter.com") && url.pathname.length > 1;
  } catch {
    return false;
  }
}
