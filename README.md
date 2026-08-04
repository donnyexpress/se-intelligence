# Tech Scan

A scanning log for systems engineers — INCOSE-aligned topics, conference
proceedings, and curated reading on the discipline of SE.

**Live:** https://tech-scan.pages.dev

## What this is

A personal/team knowledge base for tracking what's worth reading in systems
engineering. Each entry is a markdown file in `entries/`. The site is built on
a small static-site engine that prioritizes:

- **Speed** — no build step, just files
- **Mobile-first** — works on a phone, scales up
- **Open data** — everything is in this repo
- **Search & SEO** — per-entry meta tags, sitemap, structured data

## Architecture

- Static site, no build step. All customization lives in `assets/config.js`.
- Markdown entries with frontmatter parsed by `assets/parser.js`.
- Single-page app: `assets/app.js` handles routing via the history API.
- Optional comments + admin via Cloudflare Pages Functions (`functions/api/`).
- Comments persist in Cloudflare KV.

## Stack

- HTML, CSS, vanilla JS (no framework, no bundler)
- Cloudflare Pages (static + Functions + KV)
- Markdown entries with frontmatter

## Project layout

```
.
├── index.html                    # SPA shell
├── _redirects                    # SPA fallback for history routing
├── _headers                      # cache + security headers
├── wrangler.toml                 # Cloudflare Pages config (KV binding)
├── assets/
│   ├── config.js                 # site identity, theme, INCOSE taxonomy, event registry
│   ├── parser.js                 # markdown → entry object
│   ├── app.js                    # routing, rendering, comments, search
│   ├── entries-index.js          # list of entry keys (generated)
│   └── styles.css                # Option 4 glass gradient theme
├── entries/                      # markdown entries, one per file
│   ├── sys-fund-*.md             # SEBoK Part 1
│   ├── lifecycle-*.md            # SEBoK Part 2
│   ├── conf-*.md                 # conference proceedings
│   └── ...
├── functions/api/
│   └── comments.js               # Pages Function: GET/POST/PATCH/DELETE
├── docs/
│   ├── analysis/                 # design docs
│   └── preview/                  # rendered PNGs of the live site
└── scripts/
    ├── spa-server.py             # local dev server (Python, no install)
    ├── test.js                   # end-to-end smoke (puppeteer)
    ├── smoke.js                  # parser smoke test (node, no deps)
    └── preview.js                # screenshot script
```

## Local development

No build, no install required for the static site:

```sh
# Option 1: built-in SPA server
python3 scripts/spa-server.py . 8000
# open http://localhost:8000

# Option 2: any static file server
python3 -m http.server 8000
```

The SPA server has fallback routing (any unknown path serves `index.html`,
which is what the history-API router needs).

## Tests

```sh
# Parser + schema (no browser, no deps)
node scripts/smoke.js

# End-to-end (needs puppeteer + Chrome)
npm install --no-save puppeteer
node_modules/.bin/puppeteer browsers install chrome
# in another terminal:
python3 scripts/spa-server.py . 8765
node scripts/test.js http://localhost:8765
```

## Adding an entry

1. Create `entries/your-key.md` (kebab-case, no spaces):

```markdown
---
last_updated: 2026-08-04
topic: system-def                # one of the 9 SEBoK areas
triage: read                     # watch | read | try | ignore
source_type: blog                # paper | blog | talk | release-note | rfc | news | postmortem
signal: 0.75                     # 0.0–1.0, curator's quality/importance
maturity: production             # research | production | preview | deprecated
domains: reliab, platform        # optional, comma-separated
---

# Your entry title

## TL;DR
One or two sentences. The actual claim, not a teaser.

## Why it matters
So what. Who should care and why.

## Key ideas
- Bullet
- Bullet

## Sources & links
- [Title](https://example.com)

## My take
Your honest reaction. What to do with this, who to ignore, what to skip.
```

2. Add `'your-key'` to the array in `assets/entries-index.js`.
3. Refresh the page. Live.

## Conference entries

Same schema, plus:

```markdown
---
topic: system-def
event: is2024                    # must exist in config.js `events` registry
track: modelling                 # must exist in config.js `tracks` registry
authors: "Smith, J.; Lee, K."
year: 2024
paper_id: https://doi.org/...
---
```

Filename: `conf-<event-key>-<slug>.md` (e.g. `conf-is2024-mbse-patterns.md`).

## Taxonomy

Aligned to INCOSE / SEBoK sources:

- **Primary topics** (9): SEBoK general knowledge areas — `sys-fund`, `lifecycle`,
  `concept-def`, `system-def`, `realization`, `deploy-use`, `eng-domains`,
  `management`, `sos`.
- **Application domains** (12): cross-cutting, INCOSE-flavored — `dist-sys`,
  `observ`, `reliab`, `platform`, `incid`, `ml-sys`, `sec`, `perf`, `mission`,
  `energy`, `health`, `auto`.
- **Conference tracks** (9): IS2026 paper categories — `innovation`, `management`,
  `uncertainty`, `modelling`, `org-skills`, `service`, `society`, `conception`,
  `se-disciplines`.

To add a new topic/domain/track, edit `assets/config.js` and (for parser
fallback) `assets/parser.js` `TOPIC_PREFIXES`.

## Deploy

The site is configured for Cloudflare Pages. The `wrangler.toml` is checked in.

**Connecting to Cloudflare Pages via the dashboard (recommended):**

1. **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the `tech-scan` repo
3. **Project name**: `tech-scan` (gives you `tech-scan.pages.dev`)
4. **Build settings**:
   - **Build command**: **leave empty** (the static site needs no build step)
   - **Build output directory**: leave default (`/` / repo root)
5. **Save and Deploy**

> ⚠️  **Common gotcha**: if the dashboard auto-fills the build command with
> `npx wrangler deploy` (the Workers default), the build will fail with
> `CLOUDFLARE_API_TOKEN required`. **Delete the build command field** — Pages
> will serve the repo root directly and pick up `functions/api/*.js` automatically.

**KV namespace for comments:** bound in `wrangler.toml` as `COMMENTS_KV`.
Production ID: `576aa003d33b49c1affb3bbbeda491d8`. If that ID doesn't exist
in your account, create a new namespace in the dashboard and either bind it
via Settings → Functions → KV namespace bindings, or update the ID in
`wrangler.toml` and push.

**One-time CLI deploy (alternative):**

```sh
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name=tech-scan
```

## Standards alignment

- **SEBoK v2.11** (Nov 2024) — primary topic taxonomy
- **INCOSE SE Handbook v5.0** (2023) — life cycle framing
- **ISO/IEC/IEEE 15288:2023** — process reference
- **IS2026 paper categories** — conference track taxonomy

## Out of scope for v1

- RSS / Atom feed
- Email newsletter
- User accounts, OAuth, per-user bookmarks
- Full-text search ranking (current `includes` is fine for v1)
- i18n
- Dark/light toggle (Option 4 is dark-only)
- Auth on `/admin`

## License

MIT.
