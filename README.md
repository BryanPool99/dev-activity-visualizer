# Dev Activity Visualizer

Turns a GitHub account into an interactive visual report: contribution heatmap, languages, streaks, and the hours of the day where the commits land. Two accounts can be set against each other in one shared view.

- **Product truth:** [`PRODUCT.md`](./PRODUCT.md)
- **Design contract:** [`.impeccable/surfaces/`](./.impeccable/surfaces/)

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router · TanStack Query · Vitest

No backend. The GitHub API is called directly from the browser.

## Getting started

```bash
pnpm install
pnpm dev
```

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server on <http://localhost:5173> |
| `pnpm build` | Typecheck (`tsc -b`) then production build to `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm test` | Vitest, single run |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm lint` | ESLint across the project |
| `pnpm typecheck` | Types only, no emit |

## The optional GitHub token

The app works without any token, but the report is then partial:

| | No token | With token |
|---|---|---|
| Contribution history | The public push feed — 30 to 90 days, depending on how active the account is | The full year, from the GraphQL contribution calendar |
| Languages | Primary language per repository | Byte-accurate, across every repository |
| Request limit | 60 / hour | 5 000 / hour |

A token needs **no permissions at all** — everything the app reads is public. It is stored in `sessionStorage`, sent only to `api.github.com`, and never reaches a server of ours.

## What the report says, and what it does not

- The contribution grid counts GitHub **contributions** (commits, issues and pull requests) when a token is present, and **public pushes** without one. The interface says which one it is showing, and the window it actually covers.
- The public event feed no longer carries the commit list, so the time-of-day reading is built from push events — one mark per push.
- GitHub serves only the most recent 300 events per account, so the window varies and the report states it.
- Every chart prints the endpoint its numbers came from. A figure without its source is a claim; this is a reading.

## Deployment

`vercel.json` and `public/_redirects` ship the SPA fallback, so deep links like `/u/torvalds` resolve on refresh.

`.github/workflows/deploy.yml` deploys `main` to Vercel. It needs three repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

## Licence

Code: MIT. The bundled typeface is [Archivo](https://fonts.google.com/specimen/Archivo) under the SIL Open Font License — see `public/fonts/OFL.txt`.
