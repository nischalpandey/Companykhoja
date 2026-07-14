# CompanyKhoja

> Open-source (Apache-2.0) search engine for registered companies in Nepal

Search, filter, and explore data from the Office of the Company Registrar (OCR), Nepal — all client-side, zero runtime API dependencies.

[https://nischalpandey.github.io/Companykhoja](Live Preview)

## Features

- **Full-text search** — fuzzy, prefix-matched search across company name, registration number, and address
- **Advanced filters** — province, district, company type, ownership, category, registration year, alphabet
- **Autocomplete** — type-ahead suggestions in the command palette (⌘K)
- **Statistics dashboard** — charts by province, type, ownership, category, yearly growth, and timeline
- **Dark mode** — system-aware with manual toggle
- **Command palette** — keyboard-first navigation (⌘K / Ctrl+K)
- **Export** — download results as CSV or JSON
- **Static-generated** — 100% client-side, deployable to any static host

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Fetch company data from OCR Nepal API (takes ~60s)
npm run data:fetch

# 3. Start dev server
npm run dev
```

The app runs at `http://localhost:3000`. Data is stored locally in `public/data/companies.json` — no runtime API calls.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run generate` | Generate static site |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run tests |
| `npm run data:fetch` | Fetch missing company data from OCR |
| `node scripts/fetch-beyond.mjs` | Discover registration numbers beyond current max |
| `npm run deploy` | Generate site + deploy to GitHub Pages |

## Data Source

Data is fetched from the **Office of the Company Registrar (OCR), Nepal** public API at:

```
https://camis.ocr.gov.np/company-details
```


### Data Fields

| Field | Type | Description |
|---|---|---|
| `registrationNumber` | string | Company registration number |
| `nameEnglish` | string | Company name in English |
| `nameNepali` | string | Company name in Nepali |
| `registrationDate` | string | Registration date (BS format, e.g. `2081-05-16`) |
| `companyType` | string | Private Limited, Public Limited, etc. |
| `ownership` | string | Nepali, Foreign, Joint Venture, etc. |
| `address` | string | Full address |
| `province` | string | Province name |
| `district` | string | District name |
| `municipality` | string | Municipality name |
| `rokkaStatus` | string | Active, Under Rokka, Dissolved |
| `category` | string | Auto-categorized industry (30+ categories) |
| `keywords` | string[] | Auto-extracted keywords |

## Architecture

```
┌─ Browser ───────────────────────────────────┐
│  Nuxt 3 (fully static SPA)                  │
│  ├─ Components (Vue 3)                     │
│  ├─ Pinia stores                           │
│  ├─ MiniSearch + Fuse.js (client-side)     │
│  ├─ Chart.js + vue-chartjs                 │
│  └─ Tailwind CSS                           │
├─────────────────────────────────────────────┤
│  Static JSON (public/data/companies.json)   │
│  Loaded once, searched entirely in browser  │
└─────────────────────────────────────────────┘
```

**No backend server required at runtime.** The Nuxt build generates a fully static site deployable to GitHub Pages, Netlify, Vercel, or any static host.

All search indexing (MiniSearch + Fuse.js), filtering, sorting, and statistics computation happen in the browser after loading the data file once. This means zero API calls at runtime — the entire app works offline after the initial page load.

## Tech Stack

| | |
|---|---|
| **Framework** | Nuxt 3 (Vue 3) |
| **Styling** | Tailwind CSS |
| **Search** | MiniSearch (primary), Fuse.js (fallback) |
| **Charts** | Chart.js via vue-chartjs |
| **State** | Pinia |
| **Icons** | Heroicons |
| **Deployment** | GitHub Pages (static) |
| **CI/CD** | GitHub Actions |

## Production

### Build

```bash
# Generic static build (any host)
npm run generate

# GitHub Pages-specific build
npm run build:gh
```

Outputs to `.output/public/`. Serve with any static file server.

### Deployment to GitHub Pages

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
1. Builds the static site using `npx nuxt build --preset github_pages` on push to `main`
2. Deploys to GitHub Pages automatically

The `github_pages` preset automatically sets the correct `baseURL` based on your repository name, so no additional configuration is needed.

For manual deployment:

```bash
npm run build:gh
# Then upload .output/public to GitHub Pages via the UI or gh-pages CLI
```

> **Note:** The site is fully static. All search, filtering, and statistics are computed client-side. No server or API is required at runtime.

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | No | `https://nischalpandey.github.io/companykhoja` | Public site URL |
| `OCR_API_URL` | For data sync | `https://camis.ocr.gov.np/` | OCR API endpoint |

## License

Apache-2.0
