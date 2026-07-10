# CompanyKhoja

> Open-source search engine for registered companies in Nepal

Search, filter, and explore data from the Office of the Company Registrar (OCR), Nepal — all client-side, zero runtime API dependencies.

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
https://camis.ocr.gov.np/gateway/external/api/company-registration/search-company-details
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
┌─ Browser ─────────────────────────────┐
│  Nuxt 3 (static SPA)                  │
│  ├─ Components (Vue 3)               │
│  ├─ Pinia stores                     │
│  ├─ Chart.js + vue-chartjs           │
│  └─ Tailwind CSS                     │
├───────────────────────────────────────┤
│  Static JSON (public/data/)           │
│  All data loaded client-side          │
└───────────────────────────────────────┘
```

No backend server is required at runtime. The Nuxt build generates a fully static site. Search indexing (MiniSearch + Fuse.js), filtering, and sorting all happen in the browser.

## API (Internal)

The app provides internal API endpoints used during build and for autocomplete:

| Endpoint | Purpose |
|---|---|
| `GET /api/companies` | Search with filters, sort, pagination |
| `GET /api/autocomplete` | Type-ahead suggestions |
| `GET /api/companies/:id` | Single company lookup |
| `GET /api/stats` | Aggregate statistics |
| `GET /api/search-web` | Web results proxy (DuckDuckGo) |

These are Nuxt server routes that read from the local JSON file. In the static build, they are pre-rendered where possible.

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
npm run generate
```

Outputs to `.output/public/`. Serve with any static file server.

### Deployment

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
1. Builds the static site on push to `main`
2. Deploys to GitHub Pages

For manual deployment:

```bash
npm run deploy
```

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NUXT_PUBLIC_SITE_URL` | No | `https://nischalpandey.github.io/companykhoja` | Public site URL |
| `OCR_API_URL` | For data sync | `https://camis.ocr.gov.np/gateway/external/api/company-registration/search-company-details` | OCR API endpoint |

## License

MIT
