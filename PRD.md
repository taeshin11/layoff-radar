# LayoffRadar — PRD

## Overview

LayoffRadar is a real-time tech layoff tracking dashboard that aggregates publicly reported layoff events, presents monthly trend charts, and surfaces company-level pages with hiring signals. It is designed to rank for queries like "tech layoffs 2025", "Amazon layoffs", "layoffs this week", and "tech hiring freeze tracker". Data is sourced from a manually curated Google Sheet (seeded from layoffs.fyi and TechCrunch), refreshed automatically via GitHub Actions.

## Target Users & Pain Points

- **Tech workers** monitoring the job market for risk signals
- **Job seekers** identifying which companies are still hiring vs cutting
- **Investors** watching headcount as a leading indicator
- **Journalists/researchers** needing a quick layoff trend dashboard

Pain points:
- layoffs.fyi has no API and limited filtering
- TechCrunch layoff articles are scattered and hard to aggregate
- No free tool shows company-level layoff history alongside current hiring signals
- Workers want to know: "Is my company next?"

## Core Features

### F01 — Live Layoff Feed (Homepage)
- Sorted list of most recent layoff events (company, date, count, sector, source link)
- Filter by sector, month, headcount range
- "Last updated" timestamp
- Pagination (25 per page)

### F02 — Company Page `/companies/[slug]`
- Full layoff history for that company (timeline chart)
- Current headcount estimate vs peak
- Hiring signals section: links to active job boards (LinkedIn search URL, Indeed URL)
- Related companies in same sector
- Schema.org `Organization` + `Event` markup

### F03 — Monthly Trend Page `/months/[year-month]`
- Total layoffs for the month, broken down by sector (pie chart)
- Daily event timeline (bar chart)
- Top 10 companies by headcount cut
- Month-over-month comparison sparkline

### F04 — Industry Page `/industries/[sector]`
- All layoff events in that sector, chronological
- Sector-level trend line (Chart.js)
- Top companies by layoff count in sector
- "Still hiring" companies in sector (from hiring signal data)

### F05 — Search & Filter
- Full-text search across company names and notes
- Filter chips: sector, month, size (< 100, 100–1000, 1000+)
- URL-driven filter state (shareable links)

### F06 — Data Refresh Pipeline
- Google Sheet as source of truth (columns: date, company, count, sector, source, notes, hiring_signal)
- GitHub Actions runs daily at 06:00 UTC
- Action fetches sheet via Google Sheets API (service account, free tier)
- Outputs updated `public/data/layoffs.json`
- Triggers Vercel redeploy webhook

### F07 — Hiring Signals
- Boolean flag in sheet: `hiring_signal` (yes/no)
- Companies with `yes` shown in "Still Hiring" section on homepage and sector pages
- Auto-generates LinkedIn search URL: `https://www.linkedin.com/jobs/search/?keywords={company}`

### F08 — Visitor Counter
- Upstash Redis free tier
- `/api/visits` increments `visits:total` and `visits:YYYY-MM-DD`
- Footer: "Today: X | Total: Y" — muted, small

### F09 — Google Sheets Webhook
- Track: page views, search queries, filter usage, company page visits
- Payload: `{ event, company?, sector?, month?, timestamp, lang }`
- Fire-and-forget from client

### F10 — i18n (8 Languages)
- next-intl with locale prefix routing
- All UI labels translated
- Languages: en, ko, ja, zh, es, fr, de, pt
- hreflang on all pages

### F11 — Adsterra Ad Slots
- Social Bar in `<head>` (TODO placeholder)
- Native Banner below hero feed
- Display Banner between page 1 and page 2 of feed

### F12 — Research History Logging
- `research_history/` folder
- Milestone logs with timestamp, files changed, data counts

## Tech Stack

- **Framework**: Next.js 14 (App Router, SSG + ISR)
- **Styling**: Tailwind CSS v3
- **Charts**: Chart.js v4 via `react-chartjs-2`
- **i18n**: next-intl
- **Data source**: Google Sheets (via GitHub Actions → JSON)
- **Visitor counter**: Upstash Redis free tier
- **Hosting**: Vercel (free tier)
- **Repo**: GitHub via `gh` CLI → `taeshin11/layoff-radar`
- **CI**: GitHub Actions (daily data refresh + redeploy)

## Data Sources (Free Only)

| Source | Method | Notes |
|--------|--------|-------|
| Google Sheet (manual curation) | GitHub Actions + Sheets API | Seeded from layoffs.fyi, TechCrunch |
| layoffs.fyi | Manual reference (no API) | Cross-reference for seed data |
| TechCrunch layoff tag | Manual reference | Article links as `source` field |
| LinkedIn Jobs (link only) | URL template | Hiring signal links, no scrape |
| Google Sheets API | Service account | Free, 300 req/min |

### Google Sheet Schema
| Column | Type | Example |
|--------|------|---------|
| date | YYYY-MM-DD | 2025-03-15 |
| company | string | Amazon |
| slug | string | amazon |
| count | integer | 1500 |
| sector | string | e-commerce |
| source_url | URL | https://techcrunch.com/... |
| notes | string | AWS division |
| hiring_signal | boolean | FALSE |
| verified | boolean | TRUE |

## Page Structure & SEO

```
/                                → Homepage feed (ISR, revalidate 3600)
/companies/[slug]                → Company detail (ISR)
/months/[year-month]             → Monthly report (SSG)
/industries/[sector]             → Sector detail (SSG)
/sitemap.xml                     → Auto-generated
/robots.txt                      → Static
```

### Meta Tag Templates

**Homepage:**
```
title: "Tech Layoffs Tracker 2025 — Real-Time Dashboard | LayoffRadar"
description: "Track tech layoffs in real time. Updated daily. Filter by company, sector, and month. {N} events tracked."
```

**Company page:**
```
title: "{Company} Layoffs 2025 — History & Hiring Signals | LayoffRadar"
description: "{Company} has cut {total} employees across {N} rounds since {year}. See timeline, sector context, and hiring signals."
```

**Monthly page:**
```
title: "Tech Layoffs {Month} {Year} — {N} Companies, {Total} Jobs Cut | LayoffRadar"
description: "In {Month} {Year}, {N} tech companies cut {total} jobs. See the breakdown by sector and top companies."
```

### Schema.org

**Company page:**
```json
{
  "@type": "Organization",
  "name": "Amazon",
  "event": [{
    "@type": "Event",
    "name": "Amazon Layoffs March 2025",
    "startDate": "2025-03-15",
    "description": "Amazon cut 1,500 employees in AWS division"
  }]
}
```

**Monthly page:**
```json
{
  "@type": "Dataset",
  "name": "Tech Layoffs March 2025",
  "description": "Layoff events in tech sector for March 2025",
  "temporalCoverage": "2025-03"
}
```

## UI/UX Guidelines

- **Color palette**: Soft rose/peach background `#FFF5F5`, white cards, rose accents `#F43F5E` for layoff counts, teal `#14B8A6` for hiring signals
- **Font**: Inter (Google Fonts, self-hosted)
- **Severity coloring**: counts > 1000 → rose, 100–999 → amber, < 100 → neutral
- **Cards**: Rounded-xl, left border accent by sector color, subtle shadow
- **Timeline chart**: Bar chart, X-axis months, Y-axis jobs cut, pastel bars
- **Mobile-first**: Single-column feed on mobile, 2-col on md+, 3-col on xl+
- **Sticky header** with search and sector filter chips
- **"Still Hiring" badge**: teal pill badge on company cards
- **Loading**: Skeleton shimmer on feed cards
- **Animations**: Fade-in on scroll for cards (`@keyframes fadeInUp`)

## i18n Requirements

### Translation Keys (minimum required)
- `nav.home`, `nav.companies`, `nav.months`, `nav.industries`, `nav.search`
- `hero.title`, `hero.subtitle`, `hero.lastUpdated`
- `feed.jobsCut`, `feed.sector`, `feed.source`, `feed.viewCompany`
- `company.layoffHistory`, `company.hiringSignals`, `company.relatedCompanies`
- `month.totalCut`, `month.topCompanies`, `month.sectorBreakdown`
- `industry.trendLine`, `industry.stillHiring`, `industry.allEvents`
- `filter.sector`, `filter.month`, `filter.size`, `filter.clear`
- `footer.todayVisits`, `footer.totalVisits`, `footer.copyright`
- `common.loading`, `common.noData`, `common.updated`

### hreflang
```html
<link rel="alternate" hreflang="en" href="https://layoffradar.com/" />
<link rel="alternate" hreflang="ko" href="https://layoffradar.com/ko/" />
<!-- ... 8 languages + x-default -->
```

## Ad Integration (Adsterra)

### Social Bar (`<head>`)
```html
<!-- TODO: Adsterra Social Bar — replace with actual script tag when key is ready -->
<!-- <script async src="//ADSTERRA_SOCIAL_BAR_SCRIPT_URL"></script> -->
```

### Native Banner (below feed hero / above first result)
```html
<!-- TODO: Adsterra Native Banner -->
<div id="adsterra-native-banner" aria-hidden="true" class="w-full my-6 min-h-[90px] bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-300">
  <!-- Native Banner Ad -->
</div>
```

### Display Banner (between page 1 and 2 of feed, or mid-page)
```html
<!-- TODO: Adsterra Display Banner (728x90 desktop / 320x50 mobile) -->
<div id="adsterra-display-banner" class="flex justify-center my-8">
  <!-- Display Banner Ad -->
</div>
```

## Google Sheets Webhook

### Sheet: "LayoffRadar Analytics"
Columns: `timestamp | event | company | sector | month | lang | userAgent`

### Events Tracked
| Event | Trigger | Extra Fields |
|-------|---------|--------------|
| `page_view` | Any page load | `path` |
| `company_view` | Company page load | `company`, `slug` |
| `month_view` | Month page load | `month` |
| `search` | Search input submitted | `query` |
| `filter_apply` | Filter chip clicked | `filter`, `value` |

### Implementation
```typescript
// lib/webhook.ts
export async function trackEvent(event: string, data?: Record<string, string>) {
  if (!process.env.NEXT_PUBLIC_WEBHOOK_URL) return;
  fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, timestamp: new Date().toISOString(), ...data }),
  }).catch(() => {});
}
```

## Visitor Counter

- **Keys**: `layoffradar:visits:total`, `layoffradar:visits:YYYY-MM-DD`
- **Route**: `GET /api/visits` → `{ today: number, total: number }`
- **Placement**: Footer, right side, "Today: 412 | Total: 28,109"
- **Style**: `text-xs text-gray-400`
- **Caching**: No SSR cache — always fresh count

## Milestones

### M1 — Scaffold & Data Pipeline
**Tasks:**
1. Run `init.sh`: scaffold Next.js 14 app, install deps
2. Set up Google Sheet with seed data (30+ layoff events from 2024–2025)
3. Write GitHub Actions workflow to fetch sheet → `public/data/layoffs.json`
4. Create `feature_list.json`, `claude-progress.txt`
5. `gh repo create taeshin11/layoff-radar --public`
6. Initial commit + push
7. Log `research_history/milestone-M1.md`

**Commit:** `M1: scaffold, Google Sheets pipeline, seed data`

### M2 — Homepage Feed & UI Theme
**Tasks:**
1. Tailwind pastel theme tokens (rose/peach palette)
2. Homepage feed: event cards with company, date, count, sector, source
3. Filter chips: sector, month, size
4. Sticky header with search bar
5. Footer with visitor counter placeholder
6. Adsterra placeholder divs
7. Commit + push

**Commit:** `M2: homepage feed, filters, Tailwind theme, nav`

### M3 — Company & Monthly Pages
**Tasks:**
1. `/companies/[slug]`: timeline chart, hiring signals, related companies
2. `/months/[year-month]`: bar chart, sector pie, top 10 table
3. `generateStaticParams` for all companies and months
4. Schema.org Organization + Event, Dataset markup
5. Open Graph meta per page
6. Commit + push

**Commit:** `M3: company pages, monthly pages, schema.org, OG`

### M4 — Industry Pages, Search, hreflang
**Tasks:**
1. `/industries/[sector]` with trend line, still-hiring list
2. Full-text search (client-side, over loaded JSON)
3. URL-driven filter state
4. hreflang alternate links, canonical tags
5. i18n scaffold: next-intl + 8 locale JSON stubs
6. Commit + push

**Commit:** `M4: industry pages, search, hreflang, i18n scaffold`

### M5 — Visitor Counter, Webhook, Sitemap
**Tasks:**
1. Upstash Redis `/api/visits` route
2. Google Sheets analytics webhook integration
3. `app/sitemap.ts` auto-generation
4. `/robots.txt`
5. Commit + push

**Commit:** `M5: visitor counter, analytics webhook, sitemap`

### M6 — Full i18n & SEO Polish
**Tasks:**
1. Complete translation JSON for all 8 languages
2. Language switcher in header
3. Lighthouse audit ≥ 90 on all page types
4. Meta description audit for all dynamic pages
5. Commit + push

**Commit:** `M6: full i18n, SEO polish, Lighthouse audit`

### M7 — Deploy & Automation
**Tasks:**
1. `npx vercel --prod`
2. Set env vars in Vercel dashboard (UPSTASH_*, NEXT_PUBLIC_WEBHOOK_URL, VERCEL_DEPLOY_HOOK)
3. GitHub Actions: daily data refresh at 06:00 UTC + Vercel redeploy webhook
4. Verify production render of all page types
5. Final commit + push
6. Log `research_history/milestone-M7.md`

**Commit:** `M7: production deploy, daily refresh automation`

## File Structure

```
layoff-radar/
├── init.sh
├── feature_list.json
├── claude-progress.txt
├── research_history/
│   └── milestone-M1.md
├── scripts/
│   ├── fetch-sheet.js             # GitHub Actions: fetch Google Sheet → JSON
│   └── validate-data.js           # Schema validation
├── public/
│   └── data/
│       ├── layoffs.json           # All layoff events (refreshed daily)
│       ├── companies.json         # Company index with slugs
│       ├── months.json            # Month index
│       └── sectors.json           # Sector list
├── messages/
│   ├── en.json
│   ├── ko.json
│   ├── ja.json
│   ├── zh.json
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   └── pt.json
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── companies/[slug]/page.tsx
│   │   ├── months/[year-month]/page.tsx
│   │   └── industries/[sector]/page.tsx
│   ├── api/
│   │   └── visits/route.ts
│   └── sitemap.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LayoffFeed.tsx
│   ├── LayoffCard.tsx
│   ├── FilterChips.tsx
│   ├── TimelineChart.tsx
│   ├── SectorPieChart.tsx
│   ├── HiringSignalBadge.tsx
│   ├── AdSlot.tsx
│   └── VisitorCounter.tsx
├── lib/
│   ├── data.ts
│   ├── redis.ts
│   ├── webhook.ts
│   └── i18n.ts
├── tailwind.config.ts
├── next.config.ts
└── .github/
    └── workflows/
        ├── refresh-data.yml       # Daily 06:00 UTC
        └── deploy.yml
```

## Harness Files Spec

### `feature_list.json`
```json
{
  "project": "layoff-radar",
  "version": "1.0.0",
  "features": [
    { "id": "F01", "name": "Live Layoff Feed", "status": "pending" },
    { "id": "F02", "name": "Company Page", "status": "pending" },
    { "id": "F03", "name": "Monthly Trend Page", "status": "pending" },
    { "id": "F04", "name": "Industry Page", "status": "pending" },
    { "id": "F05", "name": "Search & Filter", "status": "pending" },
    { "id": "F06", "name": "Data Refresh Pipeline", "status": "pending" },
    { "id": "F07", "name": "Hiring Signals", "status": "pending" },
    { "id": "F08", "name": "Visitor Counter", "status": "pending" },
    { "id": "F09", "name": "Google Sheets Webhook", "status": "pending" },
    { "id": "F10", "name": "i18n 8 Languages", "status": "pending" },
    { "id": "F11", "name": "Adsterra Ad Slots", "status": "pending" },
    { "id": "F12", "name": "Research History Logging", "status": "pending" }
  ]
}
```

### `claude-progress.txt`
```
PROJECT: layoff-radar
STARTED: [date]
CURRENT_MILESTONE: M1
STATUS: in_progress

COMPLETED:
- (none yet)

IN_PROGRESS:
- M1: Scaffold and data pipeline

BLOCKED:
- (none)
```

### `init.sh`
```bash
#!/usr/bin/env bash
set -e

PROJECT="layoff-radar"
GITHUB_USER="taeshin11"

echo "=== Initializing $PROJECT ==="

npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes

npm install next-intl chart.js react-chartjs-2 @upstash/redis next-sitemap googleapis

mkdir -p scripts public/data messages research_history components lib app/api/visits .github/workflows

echo "PROJECT: $PROJECT" > claude-progress.txt
echo "STARTED: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> claude-progress.txt
echo "CURRENT_MILESTONE: M1" >> claude-progress.txt
echo "STATUS: in_progress" >> claude-progress.txt

git init
gh repo create "$GITHUB_USER/$PROJECT" --public --source=. --remote=origin

echo "=== $PROJECT initialized ==="
```
