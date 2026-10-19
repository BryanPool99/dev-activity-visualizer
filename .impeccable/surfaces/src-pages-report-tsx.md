---
version: 1
slug: "src-pages-report-tsx"
primary_target: "src/pages/Report.tsx"
related_targets: ["src/pages/Compare.tsx","src/pages/Home.tsx"]
---

# Surface brief — Dev Activity Visualizer

## Scope and visitor mode

One visual world, three routes: `/` (search), `/u/:username` (the report) and `/compare` (the duel). Mode is **Operate** — the visitor is reading metrics, not being persuaded — with one Persuade beat reserved for the duel. The report is the first surface built and the one the contract below governs; the duel inherits this world and receives its own contract when it is built.

## Audience, job, action

A developer, or anyone curious, arrives with a username. Job: understand how a person works — the volume, the shape, the hours, the languages — in one screen, then test it against someone else. Action: type a username in the header field, press Enter, land on `/u/:username`. Secondary action: two usernames into `/compare`.

## Proof and content

Every figure comes from the GitHub API and is labelled with the endpoint it came from. Content is the real account: real username, real avatar, real repositories, real numbers. No invented demo data, no placeholder user, no claim the product does not make.

## Chosen direction

The category standard, executed at full fidelity: a light neutral product dashboard, one blue accent, the contribution grid as the centerpiece. The arrangement is the one a visitor already expects; the craft level is GitHub Skyline's data fidelity, Carbon's typographic finish and Spotify Wrapped's single-screen narrative. No irony, no smuggled quirk, no ironic "retro drafting sheet" styling.

## Memorable moment

The duel: two accounts on one contribution grid, each day coloured by who led it, and a single radial clock carrying both rhythms plus the marked hour where they overlap.

## Direction contract

**THESIS** — The report keeps the arrangement every visitor already expects: identity, a row of numbers, the contribution grid as the centerpiece, charts below. What it refuses is the shortcut the category usually takes — the stock gradient hero, the rounded card soup, the decorative chart that carries no reading, and the number printed without its source. Familiar arrangement, unfamiliar level of finish.

**OWN-WORLD** — A neutral scale: `#FFFFFF` ground, `#F9FAFB` card fill, `#E5E7EB` hairlines, `#111827` ink, `#6B7280` secondary ink, one accent `#2563EB`. One tight geometric sans at three weights (400/500/600), sentence-case headings, no display face. Cards are hairline-bordered, 8px radius, 24px padding, on a 12-column grid with 24px gutters. The report stacks its blocks 24px apart; the landing page pads to 64px, because it is a reading surface and not an instrument. Controls: ghost buttons with a 1px border; the primary action is filled solid in the accent. No gradients, no glass, no glow, and no shadow on any resting surface — depth is carried by hairlines and tonal fills. The only lift in the product is the token dialog and the chart tooltip, the two surfaces that genuinely float above the page. Data colour is exempt from the one-accent rule: the contribution grid uses GitHub's own five-step green scale, and language colours appear only as legend swatches. Chrome stays neutral.

**STORY** — A visitor types a username and in one screen recognises a year of someone's work: the volume, the shape of the effort, the hour of the day they favour, the languages they live in, the streak they hold. Every figure carries the endpoint it came from, so trust is part of the reading rather than a footnote. Then the visitor compares two accounts, and the duel is what brings them back.

**FIRST VIEWPORT** — 1440×900. A 56px header: wordmark left, a 320px search field with magnifier and placeholder, and on the right a language selector, a ghost "connect token" button and the rate-limit meter. 24px page gutter. The identity band sits 24px below: 64px avatar, name 20/600, handle 14/400 in `#6B7280`, one line of bio, and at the right three KPI tiles split by hairlines, each an 11/500 tracked uppercase label over a 28/600 value. 24px below, the centerpiece card runs full width: hairline border, radius 8, padding 24; its header row reads "Contributions · last 12 months" 14/600 on the left and the year plus source note on the right; under it the 53×7 contribution grid (10px cells, 3px gap, 2px radius) with month labels above, weekday labels at the left, and a five-step legend bottom-right. The card's lower edge lands near y=560, so the first row of charts is already in view. The primary action is the header search field: type, press Enter, the URL becomes `/u/:username`.

**FORM** — Canon: the standing exit of the catalog, not one of the seven grounded directions. Chosen by the user on 2026-10-19 through a re-roll with an explicit steer to the category standard. Seed key `6cf3b756`, catalog revision `c3b204a1eed6`. The canon is a credible interface language and is committed across navigation, content, controls and states.

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved decisions

- The exact type family. A tight geometric sans, self-hosted from the project's own files; the specific face is not yet chosen.
- The duel page composition. It inherits this world; its own contract is written when that route is built.
- Whether the report's contribution grid keeps GitHub's green scale or is redrawn in the accent. Default for now is GitHub's green, on the grounds that it is the reading the visitor already knows.
