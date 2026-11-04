<div align="center">

# Changelog

Every Iron Arc release, newest first.

[Latest release](https://github.com/pushpanathDev/Iron_Arc-app/releases/latest) &nbsp;·&nbsp; [Download](https://pushpanathdev.github.io/Iron_Arc-app/) &nbsp;·&nbsp; [Privacy](https://pushpanathdev.github.io/Iron_Arc-app/privacy.html)

</div>

---

## 2.1.0

<sub>NOVEMBER 2026 &nbsp;·&nbsp; PRO, SAFER COACHING, 95 EXERCISES</sub>

Iron Arc's first paid tier, a coach that checks on your health before it plans, and an exercise library three times the size.

#### Highlights

- **Iron Arc Pro.** Unlimited AI plans and the plan coach chat, for ₹149 a month or ₹1,199 a year, with a 7-day free trial (once per person). Free keeps one AI plan every 30 days, with all its weeks and swaps. Payments are in test mode for now: no real money is charged.
- **Go easy on your joints.** Pick knees, lower back, shoulders or wrists (or describe your own), and plans and swaps leave out the exercises that load them. When no safe swap exists, the app says so instead of guessing.
- **95 exercises for AI plans**, up from 32: flies, crossovers, machine work and more, each tagged with the joints it loads.
- **A health check before the coach.** The coach is for adults and asks a few health questions first. A "yes" turns on Safe mode, with gentler plans until a doctor clears you. "Make this plan safer" reworks the current plan the gentle way.
- **Rate and report coach replies.** Thumbs up or down, or report a reply that's wrong or unsafe.
- **Reminders that name the day's session.** "Push day · 6 exercises. About 60 min." when you follow an AI plan.
- **Your settings follow your account.** Theme, kg or lb, default reps and bar weights return when you sign in on another phone.
- **Updates in the app.** When a new version is out, the app shows what's new and links to the download. Profile → App updates checks any time.

#### Also new

- **AI plans on Home:** the active plan's next sessions, with the coach and every plan a tap away.
- **Emails:** a welcome when you join, and Pro's welcome, trial-ending, renewal and cancellation notes.
- **The privacy policy** in Profile.
- **Deleting a Google account** now confirms with that Google account first.

#### Under the hood

- **AI hardening:** separate roles in every prompt, strict checks on everything the AI sends back, hard limits on plan size, and daily AI budgets.
- Suggestion cards in the coach chat show plain "what changes" lines.

---

## 2.0.1

<sub>18 OCTOBER 2026 &nbsp;·&nbsp; MOVE A SESSION, THEMED DATE PICKER</sub>

A small release for logging on the wrong day.

#### Highlights

- **Move a whole session to another day.** History → open a session → Change date. Everything moves together, in one database transaction.
- **A date picker that follows your theme.** The app's own calendar replaces Android's date dialog when logging a workout, editing one, moving a session and logging body weight. Dots mark the days you trained (or weighed in).
- **Change date and Repeat** sit side by side in an opened session.

---

## 2.0.0

<sub>17 OCTOBER 2026 &nbsp;·&nbsp; IRON ARC, REBUILT</sub>

A new server, AI plans, a redesign of every screen, and five themes.

#### Coming from 1.1.0

- **Your training lives in your account.** A new server (Node.js and PostgreSQL) replaces the phone-only database and its Firebase sync. Sign in with Google or email, and a new phone picks up where the old one left off.
- **AI plans:** a week of sessions built from your training days, equipment and experience, a new week each Monday tuned to what you logged, exercise swaps, and a plan coach you can chat with.
- **28 achievement badges** for consistency, volume, records and variety.
- **Every screen redesigned**, with a short onboarding that sets up your training profile.
- **Smarter reminders:** training days, your weekly goal, a comeback nudge, a weekly summary and weigh-ins, planned so they never nag about a workout you've already done.
- **Analytics** with a muscle body map shaded by weekly sets, records and trends.

#### New

- **Five themes:** Emerald, Copper, Violet, Gold and Sapphire, each with its own glossy gradient. Profile → Appearance → Theme.
- **Monthly report:** a 3-page PDF (dark cover, training, body and badges) and a 4-sheet Excel workbook (summary with chart, every set, body weight, achievements), for any month you trained.
- **Plan weeks follow the calendar:** each week starts on a Monday, a day counts as done only when it's logged on that date, and next week unlocks the Monday after.
- **The coach knows this week and last week**, and which day it is.
- **Encouraging Home headlines** that change with the time of day and your week.
- **A glossy tick** on the week ring once your weekly goal is met.

#### Improved

- Analytics splits arm work into biceps, triceps and forearms.
- Plans use one fixed name per exercise, so past sets line up with "last time".
- A longer splash screen.
- Filter chips, settings rows and buttons share one size and style.

#### Under the hood

- Release builds carry no log output and no developer tools.
- Shared building blocks replace repeated code across screens.

---

## 1.1.0

<sub>FEBRUARY 2026 &nbsp;·&nbsp; THE FIRST RELEASE</sub>

Where it started: a phone-only logbook.

#### Highlights

- **Log workouts in seconds:** exercises and sets saved on the phone straight away, with or without a connection.
- **History** of every session.
- **Analytics** worked out on the phone: no waiting for a server.
- **Body weight** tracking.
- **Cloud backup** through Firebase, synced when you choose (pull to refresh).
