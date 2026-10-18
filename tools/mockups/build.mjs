/*
 * Builds the README images from the raw screenshots in docs/screenshots:
 *   docs/mockups/<name>.png        each screen in a phone frame (transparent background)
 *   docs/images/hero.png           banner for the top of the README
 *   docs/images/social-preview.png 1280×640, for GitHub's Settings → Social preview
 *   docs/images/themes.png         Home in each of the five themes
 *   docs/images/qr-download.png    QR code to the latest APK
 * Pages are laid out in HTML and captured with Microsoft Edge or Chrome, headless.
 * Usage: npm run mockups   (set BROWSER=<path> if the browser isn't found)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SHOTS = process.env.SHOTS_DIR ?? join(ROOT, "docs/screenshots");
const OUT = process.env.OUT_DIR ?? join(ROOT, "docs");
const VERSION = "2.0.1";
const DOWNLOAD = "https://github.com/pushpanathDev/Iron_Arc-app/releases/latest/download/Iron-Arc.apk";

/** Every screen in the README gallery: file name in docs/screenshots, and its caption. */
export const SCREENS = [
  ["home", "Home"],
  ["log", "Logging a set"],
  ["analytics", "Analytics"],
  ["plan", "AI plan"],
  ["coach", "Plan coach"],
  ["history", "History"],
  ["report", "Monthly report"],
  ["weight", "Body weight"],
  ["achievements", "Achievements"],
  ["themes", "Themes"],
];

const THEMES = [
  ["emerald", "Emerald", "#22D47F"],
  ["copper", "Copper", "#E0784A"],
  ["violet", "Violet", "#A78BFA"],
  ["gold", "Gold", "#E9C85C"],
  ["sapphire", "Sapphire", "#5A92FF"],
];

const BROWSERS = [
  process.env.BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);

// ── Helpers ──────────────────────────────────────────────────────────────────

/** A screenshot's file URL (PNG or JPG), or null when it hasn't been added yet. */
function shot(name) {
  for (const ext of ["png", "jpg", "jpeg"]) {
    const file = join(SHOTS, `${name}.${ext}`);
    if (existsSync(file)) return pathToFileURL(file).href;
  }
  return null;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">`;

/** The phone: a dark rounded body with a thin rim and a soft shadow. */
const PHONE_CSS = `
.phone { position: relative; background: #0A0C0E; border-radius: 13% / 6%; padding: 2.6%; box-shadow: 0 0 0 1.5px #2C3136, 0 28px 60px rgba(0,0,0,0.55); }
.phone img { display: block; width: 100%; border-radius: 10.5% / 4.8%; }
.phone::before { content: ""; position: absolute; right: -3px; top: 22%; width: 3px; height: 9%; border-radius: 0 3px 3px 0; background: #2C3136; }
`;
const phone = (src, width, style = "") => `<div class="phone" style="width:${width}px;${style}"><img src="${src}"></div>`;

function page(body, css, bg = "transparent") {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: ${bg}; overflow: hidden; }
body { font-family: Inter, "Segoe UI", Roboto, sans-serif; color: #E1E2E7; }
.cond { font-family: "Barlow Condensed", "Arial Narrow", sans-serif; font-weight: 700; letter-spacing: 0.02em; }
${PHONE_CSS}${css}</style></head><body>${body}</body></html>`;
}

function render(html, out, width, height, scale = 2) {
  const browser = BROWSERS.find((b) => existsSync(b));
  if (!browser) throw new Error("No Edge or Chrome found. Set BROWSER to its path.");
  const file = join(tmpdir(), `iron-arc-${Date.now()}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(file, html);
  mkdirSync(dirname(out), { recursive: true });
  execFileSync(
    browser,
    ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--run-all-compositor-stages-before-draw", "--virtual-time-budget=4000", `--force-device-scale-factor=${scale}`, `--window-size=${width},${height}`, "--default-background-color=00000000", `--screenshot=${out}`, pathToFileURL(file).href],
    { stdio: "ignore" },
  );
  rmSync(file);
  console.log("  ✓", out.replace(ROOT, "").replace(/\\/g, "/"));
}

// ── Images ───────────────────────────────────────────────────────────────────

function mockups() {
  for (const [name] of SCREENS) {
    const src = shot(name);
    if (!src) {
      console.log(`  · skipped ${name} (add docs/screenshots/${name}.png)`);
      continue;
    }
    render(page(`<div style="padding:40px 50px 70px">${phone(src, 400)}</div>`, ""), join(OUT, "mockups", `${name}.png`), 500, 1000);
  }
}

function hero(out, scale) {
  const [left, center, right] = ["analytics", "home", "plan"].map(shot);
  if (!center) return console.log("  · skipped hero (needs home.png)");
  const body = `
  <div class="wrap">
    <div class="copy">
      <img class="icon" src="${pathToFileURL(join(ROOT, "docs/images/icon.png")).href}">
      <h1 class="cond">IRON ARC</h1>
      <p class="tag">Log lifts in seconds. See real progress.<br>Train to an AI plan that fits your week.</p>
      <div class="chips"><span>Android</span><span>v${VERSION}</span><span>AI plans</span><span>5 themes</span></div>
      <div class="cta">Download the APK<span>→</span></div>
    </div>
    <div class="phones">
      ${left ? phone(left, 236, "position:absolute;left:0;top:96px;transform:rotate(-9deg);opacity:0.92") : ""}
      ${right ? phone(right, 236, "position:absolute;right:0;top:96px;transform:rotate(9deg);opacity:0.92") : ""}
      ${phone(center, 262, "position:absolute;left:50%;top:40px;transform:translateX(-50%);z-index:2")}
    </div>
  </div>`;
  const css = `
  body { width: 1280px; height: 640px; background:
      radial-gradient(900px 520px at 78% 30%, rgba(34,212,127,0.16), transparent 60%),
      radial-gradient(700px 420px at 10% 110%, rgba(90,146,255,0.10), transparent 60%),
      linear-gradient(160deg, #15191D 0%, #0B0E11 100%); }
  .wrap { display: flex; height: 640px; padding: 0 64px; align-items: center; }
  .copy { width: 520px; }
  .icon { width: 84px; height: 84px; border-radius: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  h1 { font-size: 96px; line-height: 1; margin-top: 22px; letter-spacing: 0.06em; }
  .tag { font-size: 21px; line-height: 1.5; color: #BCCAC0; margin-top: 14px; }
  .chips { display: flex; gap: 10px; margin-top: 24px; }
  .chips span { font-size: 14px; font-weight: 600; padding: 7px 14px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); color: #E1E2E7; }
  .cta { display: inline-flex; gap: 12px; align-items: center; margin-top: 28px; padding: 14px 22px; border-radius: 14px; font-weight: 600; font-size: 17px; color: #00240F; background: linear-gradient(#34D987, #18B96C 55%, #0B9455); box-shadow: inset 0 1px 0 rgba(255,255,255,0.25); }
  .phones { position: relative; flex: 1; height: 640px; }`;
  render(page(body, css, "#0B0E11"), out, 1280, 640, scale);
}

function themes() {
  const shots = THEMES.map(([key, label, color]) => [shot(`home-${key}`), label, color]);
  if (shots.some(([src]) => !src)) return console.log("  · skipped themes (needs home-emerald, home-copper, home-violet, home-gold, home-sapphire)");
  const body = `
  <div class="head"><h2 class="cond">ONE APP, FIVE LOOKS</h2><p>Pick a theme in Profile. Buttons, progress and the date picker follow it; records stay amber and progress stays green.</p></div>
  <div class="row">${shots.map(([src, label, color]) => `<figure>${phone(src, 200)}<figcaption><i style="background:${color}"></i>${label}</figcaption></figure>`).join("")}</div>`;
  const css = `
  body { width: 1280px; height: 650px; background: linear-gradient(160deg, #15191D 0%, #0B0E11 100%); padding: 44px 0 0; }
  .head { text-align: center; }
  h2 { font-size: 46px; letter-spacing: 0.06em; }
  .head p { color: #8A939C; font-size: 16px; margin-top: 8px; }
  .row { display: flex; justify-content: center; gap: 34px; margin-top: 34px; }
  figure { display: flex; flex-direction: column; align-items: center; gap: 16px; }
  figcaption { font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px; }
  figcaption i { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }`;
  render(page(body, css, "#0B0E11"), join(OUT, "images", "themes.png"), 1280, 650);
}

async function qr() {
  const out = join(OUT, "images", "qr-download.png");
  await QRCode.toFile(out, DOWNLOAD, { width: 360, margin: 2, errorCorrectionLevel: "M", color: { dark: "#111417", light: "#FFFFFF" } });
  console.log("  ✓", out.replace(ROOT, "").replace(/\\/g, "/"));
}

console.log("Iron Arc mockups");
mockups();
hero(join(OUT, "images", "hero.png"), 2);
hero(join(OUT, "images", "social-preview.png"), 1);
themes();
await qr();
