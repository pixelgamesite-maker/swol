/* ── Swoldiers content & config ── */

export const GALLERY = [
  "/Swoldier-1.jpg","/Swoldier-2.jpg","/Swoldier-3.jpg","/Swoldier-4.jpg",
  "/Swoldier-5.jpg","/Swoldier-6.jpg","/Swoldier-7.jpg","/Swoldier-8.jpg",
  "/Swoldier-9.jpg","/Swoldier-10.jpg","/Swoldier-11.jpg","/Swoldier-12.jpg",
  "/Swoldier-13.jpg","/Swoldier-14.jpg","/Swoldier-15.jpg","/Swoldier-16.jpg",
]; // replace with real pixel-art export paths

export const CLASSES = [
  { name: "Recruits",           desc: "Fresh to the battlefield. Simple gear, ready to prove themselves.", img: "/Swoldier-Recruit.jpg" },
  { name: "Commanders",         desc: "Higher rank, sharper gear, real authority in the field.",            img: "/Swoldier-Commander.jpg" },
  { name: "Cyber Units",        desc: "Augmented soldiers wired straight into the grid.",                   img: "/Swoldier-Cyber.jpg" },
  { name: "Infected",           desc: "Something went wrong in the lab. Rare, and dangerous.",              img: "/Swoldier-Infected.jpg" },
  { name: "Tactical Operatives",desc: "Elite specialists built for the hardest missions.",                  img: "/Swoldier-Operative.jpg" },
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
  { q: "When will $SWOL launch?",            a: "After mint." },
  { q: "Is this financial advice?",          a: "No. Swoldiers is a digital collectible and game. DYOR." },
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
