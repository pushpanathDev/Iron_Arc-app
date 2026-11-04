/*
 * Builds the README images from the raw screenshots in docs/screenshots:
 *   docs/mockups/<name>.png        each screen in a phone frame (transparent background)
 *   docs/images/hero.png           banner for the top of the README
 *   docs/images/social-preview.png 1280×640, for GitHub's Settings → Social preview
 *   docs/images/themes.png         Home in each of the five themes
 *   docs/images/qr-download.png    QR code to the download page (it always offers the latest APK)
 *   docs/images/stats.png          "By the numbers" (the figures are in STATS below)
 *   docs/images/download.png       the download card: a download button and the QR code (no version: never rebuilt)
 * Pages are laid out in HTML and captured with Microsoft Edge or Chrome, headless.
 * Usage: npm run mockups               every image
 *        npm run mockups -- stats hero  only those (mockups, hero, themes, qr, stats, download)
 * Set BROWSER=<path> if the browser isn't found.
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
const VERSION = "2.1.0";
// The download page (docs/index.html on GitHub Pages): APKs carry their version in their names, so
// there's no fixed "latest" file to link; the page finds the newest one.
const DOWNLOAD = "https://pushpanathdev.github.io/Iron_Arc-app/";

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

/** "By the numbers": figure, what it counts, and a quiet detail line. Update with each release. */
const STATS = [
  ["465", "automated tests", "202 app · 263 server"],
  ["30K+", "lines of TypeScript", "in 242 files"],
  ["19", "screens", "one design system"],
  ["95", "exercises for AI plans", "each tagged by joint load"],
  ["5", "themes", "switched live"],
  ["0", "log lines", "in a release build"],
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

function stats() {
  const body = `
  <div class="card">
    <div class="kicker">BY THE NUMBERS</div>
    <div class="row">${STATS.map(([figure, label, detail]) => `<div class="stat"><div class="figure cond">${figure}</div><div class="label">${label}</div><div class="detail">${detail}</div></div>`).join("")}</div>
  </div>`;
  const css = `
  body { width: 1280px; height: 262px; padding: 10px; }
  .card { position: relative; height: 242px; border-radius: 28px; padding: 34px 40px 0; overflow: hidden;
    background:
      radial-gradient(620px 260px at 50% -40%, rgba(34,212,127,0.22), transparent 70%),
      linear-gradient(160deg, #171B1F 0%, #0B0E11 100%);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.06); }
  .kicker { text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 0.32em; color: #22D47F; }
  .row { display: flex; margin-top: 30px; }
  .stat { flex: 1; text-align: center; padding: 0 10px; }
  .stat + .stat { border-left: 1px solid rgba(255,255,255,0.08); }
  .figure { font-size: 76px; line-height: 1; letter-spacing: 0.01em;
    background: linear-gradient(180deg, #FFFFFF 10%, #A9F2CC 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .label { margin-top: 14px; font-size: 16px; font-weight: 600; color: #E1E2E7; }
  .detail { margin-top: 5px; font-size: 13px; color: #7D8790; }`;
  render(page(body, css), join(OUT, "images", "stats.png"), 1280, 262);
}

async function qr() {
  const out = join(OUT, "images", "qr-download.png");
  await QRCode.toFile(out, DOWNLOAD, { width: 360, margin: 2, errorCorrectionLevel: "M", color: { dark: "#111417", light: "#FFFFFF" } });
  console.log("  ✓", out.replace(ROOT, "").replace(/\\/g, "/"));
}

/** The download card under the hero: what you get, one big button, and the QR code for a phone. No version in it, so it never goes stale (the README's "latest" badge shows the version). */
async function download() {
  const code = await QRCode.toDataURL(DOWNLOAD, { width: 360, margin: 1, errorCorrectionLevel: "M", color: { dark: "#111417", light: "#FFFFFF" } });
  const icon = pathToFileURL(join(ROOT, "docs/images/icon.png")).href;
  const arrow = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>`;
  const body = `
  <div class="card">
    <div class="about">
      <img class="icon" src="${icon}">
      <div>
        <div class="kicker">FREE FOR ANDROID</div>
        <h2 class="cond">GET IRON ARC</h2>
        <div class="meta"><span>Android 7.0+</span><span>No ads</span><span>No trackers</span></div>
      </div>
    </div>
    <div class="cta">${arrow}<div><b>Download APK</b><small>Always the latest version</small></div></div>
    <div class="qr"><img src="${code}"><span>On a computer?<br><b>Scan with<br>your phone</b></span></div>
  </div>`;
  const css = `
  body { width: 1280px; height: 250px; padding: 10px; }
  .card { height: 230px; border-radius: 28px; padding: 0 30px 0 40px; display: flex; align-items: center; gap: 40px;
    background:
      radial-gradient(520px 260px at 62% 50%, rgba(34,212,127,0.20), transparent 70%),
      linear-gradient(160deg, #171B1F 0%, #0B0E11 100%);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.06); }
  .about { flex: 1; display: flex; align-items: center; gap: 24px; }
  .icon { width: 96px; height: 96px; border-radius: 24px; box-shadow: 0 10px 28px rgba(0,0,0,0.5); }
  .kicker { font-size: 13px; font-weight: 600; letter-spacing: 0.32em; color: #22D47F; }
  h2 { font-size: 54px; line-height: 1; letter-spacing: 0.06em; margin-top: 8px; }
  .meta { display: flex; gap: 8px; margin-top: 14px; }
  .meta span { white-space: nowrap; font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.10); color: #C9CED3; }
  .cta { display: flex; align-items: center; gap: 16px; padding: 22px 34px 22px 28px; border-radius: 20px; color: #00240F;
    background: linear-gradient(#3BE08E, #18B96C 55%, #0B9455);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.30), 0 0 0 1px rgba(34,212,127,0.35), 0 14px 40px rgba(34,212,127,0.28); }
  .cta b { display: block; font-size: 26px; font-weight: 700; }
  .cta small { display: block; font-size: 13px; font-weight: 600; opacity: 0.7; margin-top: 2px; }
  .qr { display: flex; align-items: center; gap: 18px; padding-left: 34px; border-left: 1px solid rgba(255,255,255,0.08); height: 150px; }
  .qr img { width: 150px; height: 150px; border-radius: 14px; background: #fff; padding: 6px; }
  .qr span { font-size: 14px; line-height: 1.45; color: #7D8790; }
  .qr b { color: #E1E2E7; font-weight: 600; }`;
  render(page(body, css), join(OUT, "images", "download.png"), 1280, 250);
}

const only = process.argv.slice(2);
const want = (name) => only.length === 0 || only.includes(name);

console.log("Iron Arc mockups");
if (want("mockups")) mockups();
if (want("hero")) {
  hero(join(OUT, "images", "hero.png"), 2);
  hero(join(OUT, "images", "social-preview.png"), 1);
}
if (want("themes")) themes();
if (want("qr")) await qr();
if (want("stats")) stats();
if (want("download")) await download();
