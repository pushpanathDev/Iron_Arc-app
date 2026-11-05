<div align="center">

<a href="https://pushpanathdev.github.io/Iron_Arc-app/"><img src="docs/images/hero.png" alt="Iron Arc: log lifts in seconds, see real progress, train to an AI plan that fits your week" width="100%" /></a>

### A strength-training app that remembers every set, knows when you got stronger,<br/>and builds your training week with AI.

<br/>

<a href="https://pushpanathdev.github.io/Iron_Arc-app/"><img src="docs/images/download.png" width="100%" alt="Download Iron Arc for Android: tap here to download the APK, or scan the QR code with your phone" /></a>

<sub>Tap the card to download, or scan its code with your phone · Android 7.0 or newer · free · <b>no ads, no analytics, no trackers</b></sub>

<br/><br/>

![Latest release](https://img.shields.io/github/v/release/pushpanathDev/Iron_Arc-app?label=latest&color=1E6B47)
![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![React Native 0.81](https://img.shields.io/badge/React%20Native-0.81%20·%20New%20Arch-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql&logoColor=white)
![Tests](https://img.shields.io/badge/tests-500%20passing-0F7A3B?logo=jest&logoColor=white)

</div>

<p align="center">Sign in with Google or email. Your training lives in your account, so a new phone picks up where the old one left off.</p>

---

<div align="center"><img src="docs/images/stats.png" width="100%" alt="By the numbers: 500 automated tests (221 app, 279 server), 30,000+ lines of TypeScript in 276 files, 19 screens, 95 exercises for AI plans, 5 themes, 0 log lines in a release build" /></div>

---

## 📱 A quick tour

<div align="center">

| <img src="docs/mockups/home.png" width="230" alt="Home screen: today's session, weekly goal ring and streak" /> | <img src="docs/mockups/log.png" width="230" alt="Logging a set with last time's weight and reps" /> | <img src="docs/mockups/analytics.png" width="230" alt="Analytics with the muscle body map" /> |
|:---:|:---:|:---:|
| **Home**<br/><sub>today's session, weekly goal ring, streak and a headline that cheers you on</sub> | **Logging a set**<br/><sub>last time's weight and reps prefilled; one tap per set</sub> | **Analytics**<br/><sub>a body map shaded by weekly sets per muscle, records and trends</sub> |
| <img src="docs/mockups/plan.png" width="230" alt="AI plan day view with exercises and swaps" /> | <img src="docs/mockups/coach.png" width="230" alt="Plan coach chat updating the week" /> | <img src="docs/mockups/history.png" width="230" alt="History calendar with a session opened" /> |
| **AI plan**<br/><sub>a week built from your days, equipment and experience</sub> | **Plan coach**<br/><sub>"make it 3 days", "my shoulder hurts": the plan adjusts</sub> | **History**<br/><sub>a calendar of every session; move one to another day in a tap</sub> |
| <img src="docs/mockups/report.png" width="230" alt="Monthly report export" /> | <img src="docs/mockups/weight.png" width="230" alt="Body weight trend and goal" /> | <img src="docs/mockups/achievements.png" width="230" alt="Achievements and badges" /> |
| **Monthly report**<br/><sub>a 3-page PDF and a 4-sheet Excel file, made on the phone</sub> | **Body weight**<br/><sub>trend, goal and a weekly weigh-in reminder</sub> | **Achievements**<br/><sub>28 badges for consistency, volume, records and variety</sub> |

</div>

---

## 🎨 One app, five looks

<div align="center"><img src="docs/images/themes.png" width="100%" alt="Iron Arc's Home screen in the Emerald, Copper, Violet, Gold and Sapphire themes" /></div>

Themes aren't a colour swap. Each one changes the **accent family** (buttons, progress, the tab bar, the date picker) and its own **glossy gradient**, while colours that *mean* something never move: records stay amber, better/worse stays green/red. Every theme had to pass a rule before it shipped: its accent can't pass for a meaning colour. The first gold was rejected for sitting **2–4° of hue** away from the records amber; the shipped Gold is a paler, metallic yellow-gold.

---

## 🆕 What's new in 2.2.0

- **Speak your sets.** Tap the mic and say every set at once, like "first set 60 kilos 10 reps, second set 70 for 8", and they're logged in order. Part of Iron Arc Pro.
- **Speak your notes.** The mic in the note field writes what you say. Recordings are turned into text, then deleted.
- **What's new, in the app.** After each update, a quick look at what changed; Profile → App updates also shows what's coming next.
- **A deeper Emerald**, side-by-side choices in pop-ups, and one calm red for every delete.

See the [changelog](CHANGELOG.md) for everything, and for 2.1.0, 2.0.1 and 2.0.0.

---

## 🧠 Engineering stories

The parts that were hard, and how they were solved. Each opens up.

<details>
<summary><b>🏆 Every screen agrees on what a "record" is</b></summary>
<br/>

**Problem.** Records show up in five places: the banner while you lift, History, Analytics, the exercise page and the server's badges. Five implementations would eventually disagree.

**Idea.** One rule, written once per side and tested on both: a set is a record if it beats the heaviest earlier weight at the same or more reps, *or* beats every earlier estimated one-rep max (Epley).

**Result.** The app and the server can't contradict each other, and backdated sessions are judged against your history *as it stood on that day*.
</details>

<details>
<summary><b>💾 A workout is saved completely, or not at all</b></summary>
<br/>

**Problem.** A gym's signal is bad. A session of 9 exercises sent as 9 requests can half-save, and a retry can save it twice.

**Idea.** The session lives in a local draft saved as you go (closing the app loses nothing). Finishing sends it as **one batch** that the server writes in **one transaction**, with a duplicate guard. Moving a session to another day works the same way.

**Result.** No half sessions and no duplicates, even on a flaky connection. Deletes get a real undo: the server call is held for a short window and cancelled if you tap Undo.

```mermaid
sequenceDiagram
    participant P as Phone
    participant A as Iron Arc API
    participant D as PostgreSQL
    P->>P: Draft saved on every set
    P->>A: POST /workouts/batch (whole session)
    A->>D: BEGIN
    A->>D: insert every exercise and its sets
    A->>D: COMMIT (or roll everything back)
    A-->>P: saved session + any badges unlocked
```
</details>

<details>
<summary><b>🤖 Making an AI coach fit a free-tier budget</b></summary>
<br/>

**Problem.** The model provider allows a few thousand tokens a minute. A multi-week plan in every coach message blew straight through it.

**Idea.** Send the coach one compact week, plus a short summary of *this* week and *last* week computed on the server. The AI returns **only the days it changed**; the server validates every exercise against a catalogue, keeps your training days fixed, and applies the patch.

**Result.** The prompt went from about **20,600 to 1,300 tokens (94% smaller)**, and a malformed AI reply can never corrupt a plan.
</details>

<details>
<summary><b>📊 A spreadsheet writer, written from scratch</b></summary>
<br/>

**Problem.** The monthly report needed a real Excel file: styled cards, a frozen header, filters, data bars, totals that follow the filter, and a native bar chart. Spreadsheet libraries either can't do charts or are too heavy for a phone.

**Idea.** An `.xlsx` is a zip of XML files, so the app writes that XML itself: styles, merged cells, `SUBTOTAL` formulas with cached values, conditional data bars and a DrawingML bar-and-line chart. A 30 KB zip library packs it.

**Result.** A 4-sheet workbook and a 3-page PDF (with inline SVG charts) are built **entirely on the phone, offline**. Tests unzip the workbook and check its parts, and it was opened in a spreadsheet reader to confirm the chart, filters and dates.
</details>

<details>
<summary><b>📅 Plans that follow the real calendar</b></summary>
<br/>

**Problem.** "Week 2" of a plan drifted away from real weeks, and "done" ticks counted sessions from the wrong week.

**Idea.** Every plan week knows its Monday. A day is done only when one of its exercises was logged **on that day's date**, and the next week unlocks the Monday after, written by the coach from everything you actually did.

**Result.** Plan weeks line up with the calendar, ticks are always true, and the coach knows which day it is.
</details>

<details>
<summary><b>🔒 Release builds that give nothing away</b></summary>
<br/>

**Problem.** An APK can be unpacked, and console logs end up in Android's system log.

**Idea.** A small custom Babel plugin deletes every `console` call, message text included, at compile time for release builds. Developer tools sit behind `__DEV__` branches that the bundler removes entirely. Release builds are minified and resource-shrunk.

**Result.** Zero log lines, no developer screens and no debug strings in the shipped app.
</details>

---

## 🏗 Architecture

```mermaid
flowchart LR
    subgraph Phone["📱 Iron Arc (Expo · React Native)"]
        UI["Screens<br/>Expo Router"]
        Cache["Query cache<br/>persisted on device"]
        Logic["Training logic<br/>records · streaks · analytics · reports"]
        Notif["Reminder planner<br/>local notifications"]
        UI --> Cache --> Logic --> Notif
    end

    Auth["🔐 Firebase Authentication"]

    subgraph Server["☁️ Iron Arc API (Node.js · Express)"]
        API["REST API<br/>workouts · weights · profile · plans · badges"]
        DB[("PostgreSQL<br/>Prisma")]
        LLM["🤖 LLM<br/>plans · swaps · coach"]
        API --> DB
        API --> LLM
    end

    UI -- "sign in" --> Auth
    Cache -- "HTTPS + ID token" --> API
```

- **The server is the source of truth**; the phone keeps a persisted cache, so screens open instantly and stay readable offline.
- **Training logic runs on the device** from that cache, so every screen shows the same numbers. Badges are checked on the server with the same rules.
- **Reminders are planned, not fired blindly:** a pure planner schedules the next 14 days (at most one nudge a day) and re-plans whenever you log or change a setting, so it never nags about a workout you already did.

---

## 🧰 Built with

| | |
|---|---|
| **App** | Expo SDK 54 · React Native 0.81 (New Architecture) · React 19 · TypeScript (strict) · Expo Router |
| **Data** | TanStack Query v5 with a device-persisted cache |
| **Motion and graphics** | Reanimated 4 · react-native-svg · linear gradients |
| **Server** | Node.js · Express 5 · Prisma · PostgreSQL · Zod validation |
| **AI** | A hosted LLM for plan generation, weekly recalibration, swaps and the coach |
| **Auth** | Firebase Authentication (Google and email) |
| **Quality** | Jest and Node's test runner: 500 tests across app and server |

---

## 🗺 Roadmap

| Status | Feature |
|:--|:--|
| <img src="https://img.shields.io/badge/up%20next-C98A2B?style=flat-square" alt="Up next" /> | **A super-powered coach:** a big upgrade to today's coach, with memory of your training and trends |
| <img src="https://img.shields.io/badge/up%20next-C98A2B?style=flat-square" alt="Up next" /> | **Sharper voice logging:** better with fast speech and more gym words |
| <img src="https://img.shields.io/badge/shipped-2.2.0-1E6B47?style=flat-square" alt="Shipped in 2.2.0" /> | Speak your sets and notes (Pro): say every set at once and they're logged |
| <img src="https://img.shields.io/badge/shipped-2.2.0-1E6B47?style=flat-square" alt="Shipped in 2.2.0" /> | What's new and Coming next, inside the app |
| <img src="https://img.shields.io/badge/shipped-2.1.0-1E6B47?style=flat-square" alt="Shipped in 2.1.0" /> | Iron Arc Pro (payments in test mode) |
| <img src="https://img.shields.io/badge/shipped-2.1.0-1E6B47?style=flat-square" alt="Shipped in 2.1.0" /> | Health check, Safe mode and "go easy on" joints |
| <img src="https://img.shields.io/badge/shipped-2.1.0-1E6B47?style=flat-square" alt="Shipped in 2.1.0" /> | A much larger AI exercise catalogue: flies, crossovers, machine work |
| <img src="https://img.shields.io/badge/shipped-2.1.0-1E6B47?style=flat-square" alt="Shipped in 2.1.0" /> | Reminders that name the day's planned session |
| <img src="https://img.shields.io/badge/shipped-2.1.0-1E6B47?style=flat-square" alt="Shipped in 2.1.0" /> | Updates announced inside the app |
| <img src="https://img.shields.io/badge/shipped-2.0.1-1E6B47?style=flat-square" alt="Shipped in 2.0.1" /> | Move a session to another day |
| <img src="https://img.shields.io/badge/shipped-2.0.1-1E6B47?style=flat-square" alt="Shipped in 2.0.1" /> | A theme-aware date picker |
| <img src="https://img.shields.io/badge/shipped-2.0.0-1E6B47?style=flat-square" alt="Shipped in 2.0.0" /> | AI plans with weekly recalibration and a plan coach |
| <img src="https://img.shields.io/badge/shipped-2.0.0-1E6B47?style=flat-square" alt="Shipped in 2.0.0" /> | Analytics with a muscle body map |
| <img src="https://img.shields.io/badge/shipped-2.0.0-1E6B47?style=flat-square" alt="Shipped in 2.0.0" /> | Five themes |
| <img src="https://img.shields.io/badge/shipped-2.0.0-1E6B47?style=flat-square" alt="Shipped in 2.0.0" /> | Monthly PDF and Excel reports |
| <img src="https://img.shields.io/badge/shipped-1.1.0-1E6B47?style=flat-square" alt="Shipped in 1.1.0" /> | Fast logging with records, rest timer and plate calculator |

---

## 📦 Installing the APK

1. On your Android phone, tap **Download APK** in the card at the top (on a computer, scan its QR code), then **Download** on the page that opens. Every APK carries its version in its name (`Iron-Arc-2.1.0.apk`), so older downloads are easy to tell apart.
2. Open the downloaded file. If Android asks, allow your browser to install apps.
3. Sign in with Google or email, answer a few questions about your training, and log your first set.

Updates: from 2.1.0 the app tells you when a new version is out and links to it; install it over the old one. Your data stays in your account.

What Iron Arc keeps and why: the [privacy policy](https://pushpanathdev.github.io/Iron_Arc-app/privacy.html).

---

 <div align="center">

**Designed, built, debugged, broke, fixed, and shipped by [Pushpanath](https://github.com/pushpanathDev) — the one and only.** 🫡

<sub>Product? Me. Design? Me. Mobile app? Me. Backend? Also me. AI? Me again. QA? Unfortunately, also me.</sub>

<sub>This repository contains releases, screenshots, and engineering notes. The source code stays private — some secrets are best kept secret. 😉</sub>

<sub>© 2026 Pushpanath. All rights reserved. No co-founders were harmed in the making of this project.</sub>

</div>
