# Changelog

## 2.0.1 · 18 October 2026

- **Move a whole session to another day.** History → open a session → Change date. Everything moves together, in one database transaction.
- **A date picker that follows your theme.** The app's own calendar replaces Android's date dialog when logging a workout, editing one, moving a session and logging body weight. Dots mark the days you trained (or weighed in).
- **Change date and Repeat** sit side by side in an opened session.

## 2.0.0 · 17 October 2026

The big one: Iron Arc rebuilt.

### Coming from 1.1.0
- **Your training lives in your account.** A new server (Node.js and PostgreSQL) replaces the phone-only database and its Firebase sync. Sign in with Google or email, and a new phone picks up where the old one left off.
- **AI plans:** a week of sessions built from your training days, equipment and experience, a new week each Monday tuned to what you logged, exercise swaps, and a plan coach you can chat with.
- **28 achievement badges** for consistency, volume, records and variety.
- **Every screen redesigned**, with a short onboarding that sets up your training profile.
- **Smarter reminders:** training days, your weekly goal, a comeback nudge, a weekly summary and weigh-ins, planned so they never nag about a workout you've already done.
- **Analytics** with a muscle body map shaded by weekly sets, records and trends.

### New
- **Five themes:** Emerald, Copper, Violet, Gold and Sapphire, each with its own glossy gradient. Profile → Appearance → Theme.
- **Monthly report:** a 3-page PDF (dark cover, training, body and badges) and a 4-sheet Excel workbook (summary with chart, every set, body weight, achievements), for any month you trained.
- **Plan weeks follow the calendar:** each week starts on a Monday, a day counts as done only when it's logged on that date, and next week unlocks the Monday after.
- **The coach knows this week and last week**, and which day it is.
- **Encouraging Home headlines** that change with the time of day and your week.
- **A glossy tick** on the week ring once your weekly goal is met.

### Improved
- Analytics splits arm work into biceps, triceps and forearms.
- Plans use one fixed name per exercise, so past sets line up with "last time".
- A longer splash screen.
- Filter chips, settings rows and buttons share one size and style.

### Under the hood
- Release builds carry no log output and no developer tools.
- Shared building blocks replace repeated code across screens.

## 1.1.0 · February 2026

The first release.

- **Log workouts in seconds:** exercises and sets saved on the phone straight away, with or without a connection.
- **History** of every session.
- **Analytics** worked out on the phone: no waiting for a server.
- **Body weight** tracking.
- **Cloud backup** through Firebase, synced when you choose (pull to refresh).
