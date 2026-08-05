# SE Intelligence

A body of knowledge for systems engineers — basics, applications, best
practices, and active research frontiers, with every claim cited to a real
source.

**Live:** https://se-intelligence.pages.dev

## What this is

A synthesized knowledge base covering systems engineering. Every topic
(System Definition, Reliability, Distributed Systems, etc.) is a real
article — written in the same style as a Wikipedia entry — and every claim
is cited inline to a real source (paper, blog post, conference paper,
standard) that the visitor can click through to.

- **Two artifact types**: `/topic/<key>` for synthesized articles, `/source/<key>` for the cited references
- **Inline citations** as `[1]`, `[2]`, etc., with auto-generated numbered references at the bottom
- **Reverse direction** — every source shows which topic pages cite it ("Cited in")
- **INCOSE-aligned** — taxonomy matches SEBoK primary topics and application domains
- **Speed** — no build step, just files
- **Mobile-first** — works on a phone, scales up
- **Open data** — everything is in this repo
- **Search & SEO** — per-topic and per-source meta tags, sitemap, structured data

## Architecture

- Static site, no build step. All customization lives in `assets/config.js`.
- Markdown sources with frontmatter, parsed by `assets/parser.js`.
- Markdown topic pages (a different schema), also parsed by `parser.js`.
- Single-page app: `assets/app.js` handles routing via the history API.
- Optional comments + admin via Cloudflare Pages Functions (`functions/api/`).
- Comments persist in Cloudflare KV, with separate namespaces for topics and sources.

## Stack

- HTML, CSS, vanilla JS (no framework, no bundler)
- Cloudflare Pages (static + Functions + KV)
- Markdown sources and topic pages with frontmatter
- Puppeteer for end-to-end and screenshot tests

## Project layout

```
.
├── index.html                    # SPA shell
├── _redirects                    # SPA fallback for history routing
├── _headers                      # cache + security headers
├── wrangler.toml                 # Cloudflare Pages config (KV binding)
├── sitemap.xml                   # SEO
├── assets/
│   ├── config.js                 # site identity, theme, INCOSE taxonomy, event registry
│   ├── parser.js                 # markdown → entry / topic object
│   ├── app.js                    # routing, rendering, comments, search
│   ├── entries-index.js          # list of source keys
│   ├── topics-index.js           # list of topic keys
│   └── styles.css                # Option 4 glass gradient theme
├── entries/                      # cited sources, one per file
│   ├── sys-fund-*.md             # SEBoK Part 1
│   ├── lifecycle-*.md            # SEBoK Part 2
│   ├── conf-*.md                 # conference proceedings
│   └── ...
├── topics/                       # synthesized knowledge articles
│   ├── system-def.md             # one per SEBoK topic / application domain
│   ├── reliab.md
│   └── dist-sys.md
├── functions/api/
│   └── comments.js               # Pages Function: GET/POST/PATCH/DELETE
├── docs/
│   ├── analysis/                 # design docs
│   └── preview/                  # rendered PNGs of the live site
└── scripts/
    ├── spa-server.py             # local dev server (Python, no install)
    ├── wrangler (via npx)        # local dev with Functions + KV
    ├── smoke.js                  # parser + schema smoke test
    ├── test-parser.js            # T-01: parser unit tests
    ├── test-routes.js            # T-03: Puppeteer routing/view tests
    ├── test-search.js            # T-04: search tests
    ├── test-comments.js          # T-05: comments API + UI tests
    ├── test-brand.sh             # T-06: brand/strings check
    ├── test-perf.js              # T-07: perf + bundle size
    ├── test.js                   # T-08: end-to-end smoke
    └── preview.js                # screenshot script
```

## Local development

Two options. **The first (Python server) is for static-only work**; the
**second (wrangler pages dev) is the full environment with Functions
and KV**.

```sh
# Option 1: static-only dev server (no comments API)
python3 scripts/spa-server.py . 8000
# open http://localhost:8000

# Option 2: full Cloudflare Pages emulator (with Functions + KV)
npx wrangler pages dev . --port 8788
# open http://localhost:8788
```

The Python server has SPA fallback routing (any unknown path serves
`index.html`, which is what the history-API router needs). It does NOT
run Pages Functions — use wrangler for that.

## Tests

Eight test phases. Run them in order against `npx wrangler pages dev`:

```sh
# 1. Start the dev server
npx wrangler pages dev . --port 8788 &

# 2. Parser + schema (no browser, no network)
node scripts/smoke.js              # 285+ assertions
node scripts/test-parser.js        # T-01: 36 assertions

# 3. Browser tests (Puppeteer)
node scripts/test-routes.js        # T-03: 26 assertions
node scripts/test-search.js        # T-04: 8 assertions
node scripts/test-comments.js      # T-05: 14 assertions

# 4. Brand/strings + perf
bash scripts/test-brand.sh         # T-06: 7 assertions
node scripts/test-perf.js          # T-07: 5 assertions

# 5. End-to-end
node scripts/test.js http://localhost:8788  # T-08: 31 assertions
```

**Total**: ~410 assertions across 7 test scripts + 1 e2e suite. All
should pass before commit.

## Adding a source

1. Create `entries/your-key.md` (kebab-case, no spaces):

```markdown
---
last_updated: 2026-08-04
topic: system-def                # one of the 9 SEBoK areas
triage: read                     # watch | read | try
source_type: blog                # paper | blog | talk | release-note | rfc | news | postmortem
signal: 0.75                     # 0.0–1.0, curator's quality/importance
maturity: production             # research | production | preview | deprecated
domains: reliab, platform        # optional, comma-separated
source_url: https://example.com/full-article
source_label: Read the full article →
published: 2024-09-12
---

# Your source title

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

## Adding a topic page

Topic pages are synthesized knowledge articles — they live in `topics/<key>.md` and
cite sources inline.

1. Create `topics/<key>.md` (kebab-case, no spaces):

```markdown
---
topic_key: system-def
level: 4
last_curated: 2026-08-05
maturity: established             # emerging | established | maturing
---

# Topic Title

A synthesized article covering basics, applications, best practices, and
research frontiers, with every claim cited inline.

## Why it matters
A short framing. Why should a reader care about this topic?

## Basics
The foundational concepts. Cite foundational sources inline:
[system-def-mbse-patterns-2025] [lifecycle-iso-iec-15288-2023].

## Patterns that work
What works in practice. Cite industry case studies.

## Research frontiers
What is being actively worked on. Cite IS 2025 papers, etc.

## What to read first
Three sources the reader should start with. One per bullet, with citations.

## References
(Auto-generated. Don't write this — the engine generates it.)
```

2. Add `'your-key'` to the array in `assets/topics-index.js`.
3. Cite sources using `[<source-key>]` inline. Multiple citations of the
   same source are deduped; numbers are assigned in document order.

## "Read the full article" button

Every source with a `source_url` shows a prominent CTA at the top of the page
(plus a matching button in the bottom action row). Behavior:

- If `source_label` is set, that's used verbatim (e.g. `Read on Jepsen →`,
  `View on iso.org →`).
- Otherwise, the label is inferred from `source_type`:
  - `paper`        → "Read the paper →"
  - `postmortem`   → "Read the postmortem →"
  - `talk`         → "Watch the talk →"
  - `release-note` → "Read the release notes →"
  - `rfc`          → "Read the RFC →"
  - anything else  → "Read the full article →"
- For conference entries, `source_url` falls back to `paper_id` automatically.
- For regular entries with no `source_url`, the parser uses the first `http(s)://`
  link in the `links:` list. If there are no URLs, no button is shown.

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

## Comments

Two namespaces: `source` and `topic`. Comments on `/source/<key>` are
keyed by the source key; comments on `/topic/<key>` are keyed by the
topic key. They never collide.

The Comments API (in `functions/api/comments.js`):
- `GET /api/comments?entry=<key>&ns=source|topic` — list comments for one item
- `GET /api/comments` — list all (admin view, no auth)
- `POST /api/comments` — submit a new comment
- `PATCH /api/comments?id=<id>&key=<key>&ns=<ns>` — update status / add system reply
- `DELETE /api/comments?id=<id>&key=<key>&ns=<ns>` — delete (admin)

Legacy `entry` param without `ns` defaults to `source` for backward compat.

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
2. Pick the `se-intelligence` repo
3. **Project name**: `se-intelligence` (gives you `se-intelligence.pages.dev`)
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
wrangler pages deploy . --project-name=se-intelligence
```

## Standards alignment

- **SEBoK v2.11** (Nov 2024) — primary topic taxonomy
- **INCOSE SE Handbook v5.0** (2023) — life cycle framing
- **ISO/IEC/IEEE 15288:2023** — process reference
- **IS2026 paper categories** — conference track taxonomy

## Out of scope for v1.1

- Auth on comments (currently open)
- RSS / Atom feed
- Email newsletter
- User accounts, OAuth, per-user bookmarks
- Full-text search ranking (current `includes` is fine for v1.1)
- i18n
- Dark/light toggle (Option 4 is dark-only)
- The other 18 topic pages (currently 3 of 21: system-def, reliab, dist-sys)
- The 7 proposed 2025 source entries (separate commit)

## License

MIT.
