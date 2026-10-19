---
name: Dev Activity Visualizer
description: A light neutral product dashboard that turns a GitHub account into a legible, sourced visual report.
colors:
  ground: "#ffffff"
  surface: "#f9fafb"
  surface-sunken: "#f3f4f6"
  line: "#e5e7eb"
  line-strong: "#d1d5db"
  ink: "#111827"
  ink-muted: "#4b5563"
  ink-subtle: "#6b7280"
  accent: "#2563eb"
  accent-strong: "#1d4ed8"
  accent-wash: "#eff6ff"
  contribution-empty: "#ebedf0"
  contribution-low: "#9be9a8"
  contribution-mid: "#40c463"
  contribution-high: "#30a14e"
  contribution-peak: "#216e39"
  duel-second-weak: "#93c5fd"
  language-fallback: "#9ca3af"
  status-ok: "#10b981"
  status-low: "#f59e0b"
  status-critical: "#ef4444"
  status-error: "#dc2626"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.025em"
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "-0.025em"
  peak:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: "44px"
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  control:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.08em"
rounded:
  cell: "2px"
  control: "6px"
  card: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "40px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.ground}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
    textColor: "{colors.ground}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-ghost:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "36px"
  input:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
  input-focus:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
  card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  chart-card:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  stat-tile:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  dialog:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
    width: "448px"
  language-segment-active:
    backgroundColor: "{colors.accent-wash}"
    textColor: "{colors.accent}"
    typography: "{typography.control}"
    rounded: "4px"
---

# Design System: Dev Activity Visualizer

## Overview

**Creative North Star: "The Plain Instrument"**

An instrument that reports plainly. Not a showcase that flatters. This is the north star I have named for the built world; it is my reading of the direction contract and of the shipped code, not a phrase the user chose. What the user *did* choose is recorded in PRODUCT.md as a durable brand commitment: on 2026-10-19 they were offered seven directed visual worlds and declined them all, taking instead the conventional product dashboard — the arrangement a visitor already expects — played straight, without irony and without a smuggled quirk. The craft bar is named and fixed: GitHub Skyline for data fidelity, Carbon for typographic finish, Spotify Wrapped for single-screen data narrative. "Plain" here means finished, not plain: the category standard executed at full fidelity.

**Confirmed by the direction contract** (`.impeccable/surfaces/*.md`): a light neutral ground; exactly one accent hue, blue; hairline-bordered cards; one sans at three weights; sentence-case headings; no gradients, no glow, no shadow heavier than a hairline on resting surfaces; a 12-column grid; the contribution grid as the centerpiece of the report; data colour exempt from the one-accent rule; the source note at the foot of every chart; the second account in the duel carried by the accent.

**Read from the built world** (my inference, not confirmed by the user): that the system should feel like an instrument panel rather than a magazine — dense, quiet, unhurried; that the only motion in the product is a single entrance, so the eye lands on the data and stays there; that the type is set tight (negative tracking on display and headline sizes) to read as instrumentation rather than marketing; and that the two duel accounts are separated by *hue alone* — ink for the first, accent for the second — so the comparison never depends on position or on the reader's memory of a legend order.

The density is deliberate: a report is read by scanning, not by browsing. Rows are hairline-separated, figures are tabular so columns align, and the one place the system relaxes its grid is the home page, which is a reading surface rather than an instrument. Everything else — the report, the duel — is a board of readings with a proof at the foot of each one.

**Key Characteristics:**
- One accent hue, spent only on the primary action, focus, and the second account of a duel.
- Hairline structure: 1px borders and tonal fills carry all separation; resting surfaces have no shadow.
- A single typeface at three weights, tracked tight at display sizes.
- Sentence-case headings; uppercase reserved for an 11px tracked label.
- Every figure carries its endpoint, its measure, and — when it is partial — what is missing.
- Data colour is exempt from the interface's neutral discipline; chrome never is.
- One authored entrance on the report; nothing else moves.
- Radii are small and known: 8px card, 6px control, 2px cell.

## Colors

A cool neutral scale, one blue accent, and a single island of saturated colour reserved for data.

### Primary
- **Instrument Blue** (#2563eb): the one accent. It marks the primary action (the "Ver informe" / "Guardar" / "Comparar" buttons), the focused border of a text field, the active segment of the language toggle, a hovered link, the `::selection` wash's partner, and — in the duel only — the second account. It is never used as a fill for a chart series, a card, a border, or a heading.
- **Instrument Blue, pressed** (#1d4ed8): the hover state of a filled primary button. One step darker, no glow.
- **Instrument Wash** (#eff6ff): the fill of the active language-toggle segment, and the selection highlight. It is the accent's only tinted surface — a pale blue on white, never a saturated field.

### Neutral
- **Ground White** (#ffffff): the page. Every card, control and chart sits on it or is cut out of it.
- **Surface Mist** (#f9fafb): the ghost button's hover fill and the app background behind the header.
- **Sunken Grey** (#f3f4f6): the unfilled track of every proportional bar (Top Days, Verdict List, Duel Summary), the empty day in the duel grid, and every loading placeholder in the skeleton.
- **Hairline** (#e5e7eb): the card border, the divider under a card header, the row separator in a list, the input border, and the header's bottom rule. One pixel, always.
- **Hairline Strong** (#d1d5db): the tie colour in the duel grid, the resting bar of the hour dial and the weekday strip, and the idle rate-limit dot.
- **Ink** (#111827): the first account in a duel, the peak mark in the hour dial and the weekday strip, and every non-busiest bar. The system's true black.
- **Ink Muted** (#4b5563): body copy, hints under a stat tile, the chart meta on a card header, and the value of a source endpoint. 7.5:1 on white.
- **Ink Subtle** (#6b7280): axis and month labels, placeholders, the `FUENTE` label, the footer, and the second-tier reading on a card. 4.8:1 on white — the lowest tone in the system, and it is used only at 11–12px.

### Data colours (exempt)
- **Contribution Empty** (#ebedf0), **Low** (#9be9a8), **Mid** (#40c463), **High** (#30a14e), **Peak** (#216e39): GitHub's own five-step green scale, used verbatim for the contribution grid and the short-window day columns. The level is relative to the account's own maximum, exactly as GitHub reads it.
- **Linguist colours**: the published per-language colours, shown as legend swatches and ring slices only. A language absent from the table falls back to **Neutral Grey** (#9ca3af).
- **Duel Second, weak** (#93c5fd): the second account on a day it led narrowly; **Ink Subtle** plays the same role for the first account.
- **Status hues**: emerald (#10b981), amber (#f59e0b) and red (#ef4444) on the rate-limit dot, red (#dc2626) on a token error. These are semantic, not decorative, and are the only place a warm hue appears in the chrome.

### Named Rules
**The One Accent Rule.** The accent appears on the primary action, on focus, on the active toggle segment, on a hovered link, and on the second account of a duel. Nowhere else. Its rarity is the point: a screen where the blue spreads is a screen that has stopped reporting and started selling.

**The Data Colour Exemption.** Data may carry colour that the interface never does. The grid is green because the visitor already knows that green grid; the ring is Linguist-coloured because the colour *is* the label. Chrome — cards, controls, borders, headings, backgrounds — stays on the neutral scale in every case. The exemption runs one way only: colour in the data never justifies colour in the chrome.

**The Partial Means Partial Rule.** When the API gave less than a year, the screen says so in the same voice as everything else — the card title, the source note, the token prompt. Colour never signals insufficiency; a sentence does.

## Typography

**Display Font:** Archivo (with `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`)
**Body Font:** Archivo (same stack)
**Label/Mono Font:** none — there is no second family and no monospace.

**Character:** One grotesque, tightly tracked at display sizes and open at text sizes. Archivo is a variable font self-hosted from `public/fonts` in two files (latin, latin-ext) carrying weights 100–900; the system uses three of them — 400, 500 and 600. It reads as instrumentation rather than advertising because the display sizes are tracked tight (-0.025em) and the label sizes are tracked wide (0.08em), with nothing in between. Numerals are set tabular wherever a figure sits in a column, so digits align and a changing value does not jitter the layout.

### Hierarchy
- **Display** (600, 36px/40px, -0.025em): the product name on the home page. It appears once in the product.
- **Headline** (600, 20px/28px, -0.025em): the person's name in the identity band, and 24px in the duel chooser. The one place a large type meets a real human.
- **Figure** (600, 28px/32px, -0.025em): the value in a supporting stat tile, and the percentage in the middle of the language ring. A number is set like a number, not like a heading.
- **Peak** (600, 40px/44px, -0.025em): the one number the report is about — the year's total, in the first tile of the identity band. It is the largest type in the product, and it appears exactly once per screen.
- **Lead** (400, 18px/28px): the sentence under the product name on the home page.
- **Section** (600, 16px/24px): the two section headings on the home page.
- **Title** (600, 14px/20px): every card title and every card-header title. No card title is ever a display size.- **Body** (400, 14px/20px): sentences, findings, repository descriptions. Prose blocks that wrap run at 26px (1.625) for legibility; single-line body text stays at 20px.
- **Control** (500, 14px/20px): buttons, inputs, the language toggle, navigation links, and the value of a stat tile's label row.
- **Label** (500, 11px/16px, 0.08em, uppercase): the metric name above a stat value, the `FUENTE` prefix on a source note, and section labels such as "Los días más cargados". It is the only uppercase style in the product, and it is always small and always tracked.

### Named Rules
**The Three-Weight Rule.** 400 for what is written, 500 for what is interactive or labelled, 600 for what is named. No fourth weight, no light weight, no italic anywhere in the product. If a sentence needs to be louder, it needs a heading, not a heavier font.

**The Sentence-Case Rule.** Headings, card titles, buttons, navigation and body copy are sentence case: "Contributions · last 12 months", "Connect token", "Compare". The only uppercase is the 11px tracked label and the two-letter language codes ES / EN. Nothing is shouted, and no title is set in all caps to look designed.

**The Tabular Number Rule.** Any figure that shares a column, a row of comparisons, or a bar gets `font-variant-numeric: tabular-nums` (the `nums` utility). A number that changes must not change the width of the thing beside it.

## Layout

The report is a board of readings laid on a 12-column grid with 24px gutters (`grid-cols-12 gap-6`). Blocks are stacked 24px apart (`mt-6`), with 64px above the page footer and its rule. Page gutters are 24px on every side (`px-6`); the home page pads to 64px vertically (`py-16`) because it is a reading surface, not an instrument.

The header is a 56px bar (`h-14`) whose content is capped at `max-w-6xl` and centred, with a 16px/24px gutter. The report and duel pages below it are full-bleed at a 24px gutter — the header is a frame, the content is the work surface, and they are allowed to disagree about width. The header is sticky and carries a 1px bottom rule.

The identity band is a 64px round avatar, the name at 20/600, the handle at 14/400 in muted ink, the bio at 14px in muted ink, and — pushed right — three KPI tiles divided by hairline rules (`divide-x divide-line`). On a phone the tiles fall into a three-column grid of their own, still divided, and the identity band wraps.

The contribution grid is the fixed point of the whole system: one column per week, one row per weekday, exactly as GitHub draws it, so a year is up to 53 columns of 10px cells with a 3px gap and a 2px radius. The cell *size* adapts to the window — 22px for six columns or fewer, 18px, 14px, then 10px for a full year — so a short window fills the card instead of floating in a corner, but the *geometry* never changes: always seven rows, always week columns. Month labels sit 16px above the grid and only when two labels have room between them; weekday labels sit to the left and only Monday, Wednesday and Friday are named, again as GitHub does it.

Breakpoints follow Tailwind's defaults: `sm` 640px (the header search collapses into its own row, the nav link appears, the stat tiles go horizontal), `md` 768px (the rate-limit meter appears), `lg` 1024px (the report's card rows break into 5/7, 4/4/4 and 4/8 columns; below that every card is full width). The duel grid and the duel dial sit side by side at `lg` and stack below it.

## Elevation & Depth

Depth is carried by hairline borders and tonal fills, not by shadow. A card is white on white, separated from the page by a 1px `#e5e7eb` rule; a sunken surface is one step down in tone; a disabled control is one step down again. There is no drop shadow on any resting surface — no card, no button, no input, no bar.

Shadow appears only on surfaces that genuinely float above the page: the token dialog (`shadow-lg`, so the modal reads as detached from the content beneath it) and the chart hover tooltip (`shadow-sm`, so it survives on top of a chart). The scrim behind the dialog is `ink` at 25% opacity.

**Named Rule — The Hairline Depth Rule.** Separation is drawn, never dropped. If two things need a boundary, put a 1px rule between them. Shadow is a last resort for an overlay that has left the page, and it is never used to make a card feel more important than its neighbours.

*Scope of the rule:* the shadow prohibition covers resting surfaces. The contract was written before the token dialog existed and was narrowed accordingly — the modal and the chart tooltip are the product's only lifted surfaces, and neither of them is a resting surface.

## Shapes

The form language is small-radius and rectilinear. Cards are 8px (`rounded-card`), controls and fields are 6px (`rounded-control`), and the contribution grid cells are 2px (`rounded-cell`) — a step up from square so a 53×7 field of them reads as a texture rather than as a wall of pixels. The language toggle's active segment is 4px. The weekday bars are 3px at the top; the day columns are 2px at the top; proportional bars (Top Days, Verdict List, Duel Summary) are fully round, because they are fills in a track, not containers. Avatars are round, because they are photographs.

Nothing in the product exceeds 8px of corner radius. There are no pills, no lozenges, no stadium shapes and no clipping tricks.

## Components

### Buttons
- **Shape:** 6px radius, 36px tall (`h-9`), 14px horizontal padding, 14/500 text, 8px gap between icon and label.
- **Primary:** the accent fill with white text. One per screen at most. Hover steps to `#1d4ed8`; disabled drops to a sunken grey fill with subtle ink and 50% opacity.
- **Ghost:** a 1px hairline border on the white ground with ink text. Hover fills with `#f9fafb`. This is the default variant.
- **Focus:** a 2px accent outline at 2px offset, on every focusable element in the product, from one global `:focus-visible` rule.

### Text fields
- **Style:** 36px tall (44px in the home hero), 6px radius, 1px hairline border, white ground, 12px horizontal padding, 14/400 ink text with a subtle placeholder.
- **Focus:** the border turns accent (`focus-within:border-accent` on the search field, `focus:border-accent` on standalone inputs). No glow, no ring, no colour change on the text.
- **Icon:** the search field carries a hand-drawn 16px magnifier — a 4.5px-radius circle and a 3.5px stroke line — in subtle ink, at 1.5 stroke width.

### Cards / containers
- **Corner style:** 8px.
- **Background:** white on a white page. `surface` only as a hover fill.
- **Shadow strategy:** none. Hairline border.
- **Border:** 1px hairline on all four sides.
- **Internal padding:** 24px. The card header is 16px vertical / 24px horizontal with a hairline rule under it; the body is 20px vertical, or 8px at the bottom when the chart needs the room (`tight`).

### Chart card
- **Header row:** a 14/600 title on the left, a 12px muted reading on the right (`meta`), baseline-aligned, separated by a 16px gap. Both sit in the card's top padding.
- **Body:** the chart, 24px side padding.
- **Footer:** the source note and the legend, 24px side padding, 12px above and 20px below.

### Stat tile
- **Shape:** no box of its own. It is a column inside a hairline-divided group.
- **Label:** the 11px tracked uppercase metric name in subtle ink.
- **Value:** 24px/600 ink (20px on a phone), tabular numerals, 4px above the label.
- **Hint:** a 12px muted reading under the value — the second number that gives the first one its scale.

### Source note
The proof at the foot of every chart: an 11px tracked `FUENTE` label, the endpoint in 12/500 muted ink, then a `·` separator and what the number counts, then another separator and any detail — the timezone, the truncation notice. 12px, subtle ink, wrapping freely. A figure without its source is a claim; the source note makes it a reading.

### Contribution grid (Heatmap)
The centrepiece. Seven rows, one column per week, 10px cells at 2px radius with a 3px gap, filled from GitHub's five-step green. Month labels above in 10px subtle ink, only where two labels have room; weekday labels to the left at 10px, only Mon/Wed/Fri. The SVG carries a full text alternative ("name: N contributions across M active days"). Hovering a cell raises a 12px tooltip — 6px radius, hairline border, `shadow-sm`, the date at 12/500 ink and the count in tabular numerals.

### Short-window columns (DayColumns)
When the window is too short for a week grid, the same reading is drawn as one column per day filling the card's width: a 2px gap between columns, a 132px tall field, each column's height proportional to its count against the maximum, coloured from the same green scale. Month labels sit 8px beneath.

### Hour dial
The day as a clock face: 24 spokes from an inner radius of 20% to an outer 43% of the dial's size, each spoke's length proportional to that hour's count, 5.5% stroke width, round caps. A hairline inner circle marks the baseline. The peak hour is drawn in ink at 1.15× the stroke weight; every other hour is `#d1d5db`. Eight hour labels (00, 03, 06 … 21) sit at 47% of the radius in 10px subtle ink. The SVG carries the peak hour and its share as its text alternative.

### Weekday strip
Seven columns, Monday first: 28px wide, 12px apart, in a 132px field, bars up to 98px tall. The busiest day is ink; the rest are `#d1d5db`; the day name sits 8px below at 11px.

### Language ring
A 168px donut, 18px thick, on a sunken-grey track, drawn from 12 o'clock clockwise. Each slice is the language's own Linguist colour; the centre carries the leading language's share at 15/600 ink with its name at 11px subtle ink. Beside it, a list of the top six languages: a 10px square swatch in the language's colour, the name, and the value right-aligned in tabular numerals.

### Duel grid
Two accounts on one grid: each day belongs to whoever pushed more. Account A is ink, account B is the accent, a tie is `#d1d5db`, an empty day is `#f3f4f6`; a day led by two-or-more is drawn in the strong tone, a day led narrowly in the weak one (`#6b7280` for A, `#93c5fd` for B). Cells match the contribution grid's geometry. Below it, a three-item legend — 10px squares in ink, accent and hairline-strong — and, on hover, a single line of tabular figures for both accounts on that date.

### Duel dial
One clock, two rhythms. The inner band (17%–31% of the size) is the first account in ink; the outer band (34%–41%) is the second account in the accent; both are read against the same maximum, so the two rhythms are directly comparable. The hours where both worked are marked on the rim between the bands — a white disc with a thin ink ring, neither account's colour, exactly where the two of them meet. The legend names the two accounts and the shared hours with a matching ring marker.

### Verdict list
The head-to-head, one metric at a time. A header row names both accounts with their colour squares, hairline-ruled beneath. Each verdict is a label at 14/500 ink, then two figures in fixed 64px columns flanking two 6px-tall round bars on a sunken track — the first account's bar in ink, the second's in accent — each scaled to the larger of the two. Rows are separated by hairline rules.

### Duel summary
The same bars, read at once: "days led" per account, a label at 12px muted in a fixed 80px column, the round bar, and the count in a 48px right-aligned column of tabular numerals.

### Navigation
The header bar: wordmark on the left at 14/600, tracking-tight; a 320px search field centred (hidden on the home page, which carries a larger hero search); on the right the compare link at 14/500, the rate-limit meter, the ES/EN toggle, and the ghost "Connect token" button. The nav link is muted ink at rest and ink when active. Below 640px the search field takes its own full-width row under a hairline rule; the wordmark shortens; the rate-limit meter is hidden until 768px.

### Language toggle
A 36px group of 28px segments inside a 1px hairline border with a 2px inner pad. The active segment is filled with the accent wash and set in accent ink; the inactive is muted and turns to ink on hover. The two-letter codes are the only uppercase in the interface.

### Dialog
The token prompt. A full-bleed scrim in ink at 25%, a 448px panel on white with an 8px radius and a hairline border, padded 24px, anchored 96px from the top. Focus moves to the first field on open, Escape closes, body scroll is locked while it is open, and focus returns to the trigger on close.

## Do's and Don'ts

### Do:
- **Do** spend the accent on the primary action, on focus, on the active language-toggle segment, on a hovered link, and on the second account of a duel — and nowhere else.
- **Do** separate surfaces with a 1px hairline border (`#e5e7eb`) and a tonal fill, never with a shadow on a resting surface.
- **Do** put the source note at the foot of every chart, naming the endpoint, the measure, and what is missing when something is partial.
- **Do** colour the contribution grid with GitHub's five-step green and the language ring with Linguist's own colours, and leave every piece of chrome neutral.
- **Do** set the first account in a duel in ink and the second in the accent, so the two are separable by hue alone.
- **Do** set figures that share a column in tabular numerals (`nums`), so a changing value never shifts its neighbour.
- **Do** keep to Archivo at 400, 500 and 600, tracked tight at display sizes and wide at label sizes.
- **Do** write headings in sentence case, and reserve uppercase for the 11px tracked label and the two-letter language codes.
- **Do** keep the contribution grid's geometry fixed — seven rows, week columns — and let the cell size adapt to the window instead.
- **Do** state on screen when the data is partial: the window actually covered, a truncated event feed, a missing token.
- **Do** animate once: the report's `rise` entrance (320ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`), disabled under `prefers-reduced-motion`.

### Don't:
- **Don't** add a second accent hue, or spread the accent across a screen as decoration.
- **Don't** use gradients, glow, glass panels or coloured shadows anywhere in the chrome.
- **Don't** drop a shadow on a card, a button, an input or a bar; if it needs separation, draw a hairline.
- **Don't** raise a radius above 8px, and don't pill a control or a card.
- **Don't** introduce a display face, a second typeface, a monospace, or a fourth font weight.
- **Don't** uppercase a heading, a button, a navigation item or a card title.
- **Don't** print a number without its source and its measure — "pushes" for the event feed, "contributions" for the GraphQL calendar, never both and never a vague one.
- **Don't** gamify a person's work: no streak-shaming, no confetti, no badges, no invented superlatives about a developer, no claim the product cannot support.
- **Don't** use the GitHub logo as the app's own mark, or the language colours as branding — they are data, shown the way their source shows them.
- **Don't** build a chart that carries no reading; every chart on screen must answer a question the visitor arrived with.
- **Don't** let anything else move. One entrance on the report, nothing on the duel, nothing on hover.
