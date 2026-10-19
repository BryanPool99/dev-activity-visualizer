# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + TypeScript + Vite + Tailwind CSS, package manager pnpm. The user was offered Angular, React and Next.js and chose React explicitly. Deployment target: Vercel or Netlify, with SPA fallback routing.

Client-only: there is no backend of our own. The GitHub API is called directly from the browser, and the optional personal access token never leaves the browser.

## Users

Developers who want to see their own GitHub activity — and that of other developers — rendered as a visual portrait they understand at a glance and want to share. The visitor arrives with a username (their own or someone else's), reads the report in a few minutes, and leaves with either a sharper sense of their own working rhythm or a comparison that settles an argument. A secondary audience is the visitor who opens the app to look at a stranger's activity, with no obligation to authenticate.

## Product Purpose

Turn a GitHub account into an interactive, legible visual report: languages used, the hours and days of the week where commits land, streaks and constancy, and the repositories that carry the work. Success means a visitor can read someone else's development rhythm in under a minute without reading a sentence of prose, and wants to look at a second account afterwards.

## Positioning

The report is not a stats page with charts dropped on it. The distinctive mechanism is comparative: two accounts loaded into one shared instrument — overlaid contribution calendars that colour each day by who led it, and a single radial clock carrying both commit rhythms so the overlap hours between two developers become visible. GitHub's own profile graph shows one account at a time and no temporal comparison; a generic activity chart stops at totals. The claim is the overlay and the duel, not the metric list.

## Operating Context

The visitor opens the app from a link, a post, or a direct visit, and types or pastes a GitHub username. The report is read on desktop and on a phone, in sessions of a few minutes, often while the GitHub tab is still open in another tab. The visitor may or may not have a GitHub account. The app is public and unauthenticated by default; a personal access token is optional.

## Capabilities and Constraints

Confirmed functionality:

- Search by GitHub username; the report lives at a shareable URL.
- Metrics: contribution heatmap (GitHub style), languages used, streaks and constancy, hours of the day, days of the week.
- Compare two developers side by side.
- Bilingual interface (Spanish / English) with a language selector.
- Optional personal access token, held only in the browser (sessionStorage), never sent to a server of ours. A token with no scopes is sufficient, because all data read is public.
- Free public GitHub API, REST and GraphQL. GraphQL requires a token; without one the app falls back to REST.

Hard constraints and known limits:

- Unauthenticated REST: 60 requests/hour, and `/users/{u}/events/public` exposes roughly the last 90 days of activity, capped at 300 events. Without a token the report is explicitly partial and says so on screen.
- **The public event feed no longer carries the commit list.** A `PushEvent` payload holds only the ref, the head sha and the push id, so the time-of-day reading is built from push events — one mark per push — and the number of commits inside a push is unknown. The interface says "pushes", not "commits", wherever that source is used.
- **GitHub serves only the most recent 300 events per account** (three pages of 100). The window therefore varies: a few days for a very active developer, up to about 90 days for a quiet one. The report states the window it actually covers, and says when the sample hit the ceiling.
- Authenticated REST/GraphQL: 5000 requests/hour, and GraphQL exposes the full contribution calendar for the year.
- The GraphQL contribution calendar counts contributions (commits, issues, pull requests), not commits alone. The interface must say "contributions", not "commits", for that data.
- Language breakdown is per repository, not per commit; the GitHub API does not expose the language of an individual commit.
- The calendar grid follows GitHub's own weeks, so a full year is up to 53 columns.
- Rate-limit state is surfaced to the visitor (remaining quota and reset time); a report computed before the quota ran out is served from cache instead of failing.
- Deliberately out of scope: user accounts, server-side persistence, and image/card export. The share action is a URL, not a downloadable picture.

## Brand Commitments

- Product name shown in the interface: **Dev Activity Visualizer**. The repository slug is `dev-activity-visualizer`.
- The app is about the developer, not about GitHub. It must not present itself as an official GitHub product and must not use the GitHub logo as its own mark. GitHub language colours are used as data, the way their source uses them.
- Voice: direct and factual, in both languages. No gamification of the developer's work, no streak-shaming, no invented superlatives about a person.
- **Standing visual preference: the category standard, executed at full fidelity.** On 2026-10-19 the user was offered seven directed visual worlds and declined them, choosing instead the conventional product dashboard — the arrangement a visitor already expects — played straight, without irony and without a smuggled quirk. This is now the default for every surface of this product, and the craft bar is set by three references the user named: **GitHub Skyline** (data fidelity), **Carbon** (typographic finish) and **Spotify Wrapped** (single-screen data narrative). Future work must reach that bar, not the bar of a neighbouring product.

## Evidence on Hand

- The GitHub public API is the only data source. There is no sample dataset, no screenshot, no brand asset and no typeface licence in the repository; the repository contains only the default GitHub README.
- Nothing to fabricate: no testimonials, no benchmark claims, no "used by N developers" claims, no demo account pretending to be a real customer.
- When a surface needs illustrative content, the data comes from a live GitHub account and is labelled as such.

## Product Principles

1. **Read before impress.** A visitor who does not understand the report within one minute has failed, however good the charts look.
2. **Real data only.** Every number on screen comes from the GitHub API. Nothing is estimated, smoothed or invented to look better.
3. **Say what is missing.** When the app runs without a token and shows 90 days instead of a year, it states that on the screen instead of quietly truncating.
4. **Comparison is the reason to return.** The duel surface earns the second visit; the single report earns the first.
5. **Respect the quota.** The GitHub API is a shared, free resource; caching and throttling are part of the product, not an optimisation detail.

## Accessibility & Inclusion

No product-specific accessibility requirement was stated by the user. Baseline to hold at the polish stage — inferred, not yet confirmed: WCAG 2.1 AA for contrast and keyboard operation; charts must be readable without colour alone; the report must be usable on a 390px-wide phone. Screen-reader alternatives for the chart data remain unresolved.
