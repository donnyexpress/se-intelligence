// assets/config.js — Single source of truth for SE Intelligence.
// Change anything here and the whole site reflects it. No code changes needed.
//
// To customize, edit this file. To add features, edit the corresponding
// `*.js` file. The rest of the engine reads from this.

const CONFIG = {
  // ---- Site identity ----
  site: {
    name: 'SE Intelligence',                // shown in tab, sidebar, hero
    tagline: 'A body of knowledge for systems engineers — basics, applications, best practices, and research frontiers, with every claim cited to a real source.',  // home page lede
    description: 'SE Intelligence: a synthesized knowledge base for systems engineering. INCOSE-aligned topics, each built from cited sources covering basics through research frontiers.',  // <meta description>
    url: 'https://se-intelligence-9y2.pages.dev',  // canonical site URL (CF reserved the bare se-intelligence.pages.dev)
    organization: 'SE Intelligence',
  },

  // ---- v1.4: Three Doors (audience entry points on home page) ----
  // Each door is a first-person headline + audience label + lede + 3
  // sub-routes. Clicking goes to /for-<role> which renders an audience-
  // specific page. The doors block is the front door of the home page
  // (after the news ticker, before the trending dashboard).
  doors: {
    practitioner: {
      role: 'practitioner',
      title: 'I have a problem.',
      audience: 'For the working SE',
      icon: '🛠',
      lede: 'Find the specialty, domain, or pattern that solves it. Built for the engineer in the middle of a program who needs an answer, not a textbook.',
      routes: ['By specialty', 'By domain', 'By pattern'],
      href: '/for-practitioners',
    },
    learner: {
      role: 'learner',
      title: 'I want to understand SE.',
      audience: 'For the newcomer',
      icon: '📘',
      lede: 'Walk the SEBoK structure top-down, parts 1 through 9. Each article builds on the last, with cited sources at every step.',
      routes: ['Start: Part 1', '…', 'Finish: Part 9'],
      href: '/for-learners',
    },
    researcher: {
      role: 'researcher',
      title: "Show me what's new.",
      audience: 'For the trend-watcher',
      icon: '📈',
      lede: "The freshest sources, the hottest topics, and the disruptive papers that changed the conversation this season.",
      routes: ['This week', 'INCOSE 2025', 'Disruptive papers'],
      href: '/for-researchers',
    },
  },

  // ---- v1.4: News ticker (the sliding hero strip) ----
  // Auto-populated from state.entries sorted by lastUpdated desc.
  // Duration: seconds for one full cycle of the marquee.
  ticker: {
    maxItems: 6,
    durationSec: 50,
    labelText: 'live',
    featureWindowDays: 7,  // an entry within this window gets the "new" badge
  },

  // ---- v1.4: Disruptive papers (manually curated callout on home) ----
  // Each entry is { title, href, why } — shown in the trending dashboard's
  // sidebar. These are the "this changed the conversation" picks.
  disruptivePapers: [
    {
      title: 'STPA — Systems-Theoretic Process Analysis (Leveson)',
      href: '/source/specialty-safety-stpa-leveson-2011',
      why: 'Why: reframes accidents as control failures, not component failures. Adopted in defense, automotive, medical.',
    },
    {
      title: 'Accelerate — DORA metrics (Forsgren, Humble, Kim)',
      href: '/source/specialty-software-dora-accelerate-2018',
      why: 'Why: gives software engineering the empirical measurement framework that other SE disciplines have had for decades.',
    },
    {
      title: 'Team Topologies — Skelton & Pais',
      href: '/source/platform-team-topologies-skelton-pais',
      why: 'Why: operationalized Conway\'s Law. The four team types (stream-aligned, platform, enabling, complicated-subsystem) are now the foundation of platform engineering.',
    },
  ],

  // ---- Theme: Option 4 — Glass Gradient ----
  theme: {
    bg:         'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    paper:      'rgba(255,255,255,0.04)',
    paperBold:  'rgba(255,255,255,0.08)',
    ink:        '#f5f5fa',
    inkSoft:    '#c5c5d8',
    inkFaint:   '#8888a8',
    rule:       'rgba(255,255,255,0.10)',
    accent:     '#a78bfa',      // primary gradient stop (purple)
    accent2:    '#22d3ee',      // secondary gradient stop (cyan)
    accentBg:   'rgba(167,139,250,0.12)',
    glass:      'rgba(255,255,255,0.04)',
    glassBold:  'rgba(255,255,255,0.08)',
    glassBorder:'rgba(255,255,255,0.10)',
    link:       '#c4b5fd',
    linkHover:  '#e9d5ff',
    // Triage colors
    watch:      '#4ade80',
    read:       '#60a5fa',
    try:        '#c4b5fd',
    ignore:     '#f87171',
  },

  // ---- Features ----
  features: {
    search:        true,
    comments:      true,
    books:         false,   // off; tech-scan uses [[link:id]] instead of [[book:id]]
    quotes:        false,
    topics:        true,    // primary SEBoK rail
    applicationDomains: true,  // secondary app-domain rail (vertical industries)
    practiceAreas: true,       // cross-cutting engineering practice rail
    conferences:   true,    // /conferences route + conf- entries
    latest:        true,    // /latest route + 30d filter
    admin:         true,
  },

  // ---- Primary topic rail: SEBoK general knowledge areas (9) ----
  // Authoritative reference: SEBoK v2.11 (Nov 2024) and INCOSE SE Handbook v5.0.
  //
  // Four-level taxonomy:
  //   1. specialtyTopics   — engineering disciplines (the "what" of SE practice)
  //   2. primaryTopics     — SEBoK Parts 1–9 (the structural backbone)
  //   3. applicationDomains — vertical industries (where SE is applied)
  //   4. practiceAreas     — cross-cutting engineering practice (how SEs work)
  //
  // specialtyTopics comes first because practitioners consulting the
  // knowledge base usually have a specialty concern (safety, security,
  // reliability) before they have a structural one (which SEBoK Part).

  // ---- Top-level rail: Engineering Specialty (the "what" disciplines) ----
  specialtyTopics: {
    'specialty-safety':         { name: 'System Safety',          short: 'safety',     order: 1, desc: 'Hazard analysis, functional safety, SIL/ASIL, safety case, safety lifecycle (IEC 61508, ISO 26262, IEC 62304).' },
    'specialty-reliability':    { name: 'Reliability Engineering', short: 'reliability', order: 2, desc: 'MTBF/MTTR prediction, FMECA, reliability block diagrams, availability, Weibull analysis (MIL-HDBK-217, Telcordia SR-332).' },
    'specialty-security':       { name: 'Security Engineering',   short: 'security',   order: 3, desc: 'Threat modeling (STRIDE/PASTA), secure design, supply chain, AppSec, zero trust (NIST 800-53, ISO 27001).' },
    'specialty-hfe':            { name: 'Human Factors',          short: 'hfe',        order: 4, desc: 'Physical and cognitive ergonomics, accessibility, training, documentation for human operators and users (MIL-STD-1472, ISO 9241).' },
    'specialty-maintainability':{ name: 'Maintainability',         short: 'maintain',   order: 5, desc: 'Designing for corrective, adaptive, perfective, preventive maintenance; service life, modernization, observability (MIL-HDBK-470, IEEE 1219).' },
    'specialty-software':       { name: 'Software Engineering',   short: 'software',   order: 6, desc: 'Modern software-intensive systems engineering: DevOps, SRE, MLOps, DORA metrics, code-as-system (IEEE/ACM, ISO/IEC 25010).' },
  },

  primaryTopics: {
    'sys-fund':    { name: 'Systems Fundamentals',   short: 'sys-fund',    order: 1, desc: 'Systems thinking, systems science, foundations, representing systems with models.', ref: 'SEBoK Part 1' },
    'lifecycle':   { name: 'Life Cycle Models',       short: 'lifecycle',   order: 2, desc: 'Concept, development, production, utilization, support, retirement; ISO/IEC/IEEE 15288.', ref: 'SEBoK Part 2' },
    'concept-def': { name: 'Concept Definition',      short: 'concept-def', order: 3, desc: 'Stakeholder needs, mission analysis, business case, concept of operations.',           ref: 'SEBoK Part 3' },
    'system-def':  { name: 'System Definition',       short: 'system-def',  order: 4, desc: 'Requirements, architecture (logical/physical), design, interfaces, integration.',      ref: 'SEBoK Part 4' },
    'realization': { name: 'System Realization',      short: 'realization', order: 5, desc: 'Implementation, integration, verification, validation, transition, production.',     ref: 'SEBoK Part 5' },
    'deploy-use':  { name: 'Deployment & Support',    short: 'deploy-use',  order: 6, desc: 'Deployment, operation, maintenance, service life, modernization, disposal.',         ref: 'SEBoK Part 6' },
    'eng-domains': { name: 'Engineering Specialty',   short: 'eng-domains', order: 7, desc: 'Software, safety, reliability, maintainability, security, human factors.',           ref: 'SEBoK Part 7' },
    'management':  { name: 'SE Management',           short: 'management',  order: 8, desc: 'Planning, assessment & control, risk, configuration, decision, quality.',            ref: 'SEBoK Part 8' },
    'sos':         { name: 'Systems of Systems',      short: 'sos',         order: 9, desc: 'SoS, enterprise SE, product/service SE, capability management.',                      ref: 'SEBoK Part 9' },
    // Sub-pages of eng-domains (Part 7). Each has its own synthesized article
    // and citations. They are still part of Part 7, so a sub-page rather than
    // a separate primary area.
    'sec':         { name: 'Security Engineering',    short: 'sec',         order: 10, desc: 'Threat modeling, secure design, supply chain, AppSec, zero trust. Sub-area of SEBoK Part 7 (Engineering Specialty).', ref: 'SEBoK Part 7' },
  },

  // ---- Secondary rail: Application domains (vertical industries) ----
  // These are the INDUSTRIES where SE is applied. Mapped to INCOSE
  // Application Domain Working Groups + the IS 2026 emphasis areas.
  // Filter on top of the primary SEBoK topic.
  // (Practice concerns like observability, performance, and platform
  // engineering are NOT here — they live in practiceAreas below.)
  applicationDomains: {
    'defense':      { name: 'Defense & Aerospace',  short: 'defense',      order: 1,  desc: 'Mission engineering, capability-driven, defense acquisition, aerospace. (WG: Defense Systems, IS2026 emphasis.)' },
    'auto':         { name: 'Automotive',           short: 'auto',         order: 2,  desc: 'OEM, autonomy, software-defined vehicles, ISO 26262. (WG: Automotive.)' },
    'health':       { name: 'Healthcare SE',        short: 'health',       order: 3,  desc: 'Medical devices, healthcare delivery, FDA / IEC 62304. (WG: Healthcare.)' },
    'energy':       { name: 'Energy & Sustainability', short: 'energy',    order: 4,  desc: 'Power generation, grid, sustainability, critical infrastructure. (WG: Power & Energy, Sustainability WG, IS2026 emphasis.)' },
    'infra':        { name: 'Critical Infrastructure', short: 'infra',    order: 5,  desc: 'Transport, water, telecom, public services. (WG: Critical Infrastructure.)' },
    'space':        { name: 'Space Systems',        short: 'space',        order: 6,  desc: 'Satellites, launch, ground systems, mission ops. (WG: Space Systems.)' },
    'manufacturing':{ name: 'Manufacturing & I4.0', short: 'manufacturing',order: 7,  desc: 'Smart factories, digital twin, IIoT, model-based production.' },
    'finance':      { name: 'Financial Services',   short: 'finance',      order: 8,  desc: 'Payments, clearing, risk, regtech. Smaller SE community but growing.' },
  },

  // ---- Cross-cutting rail: Practice areas (how SEs work) ----
  // These are engineering practice concerns that cut across industries
  // and lifecycle stages. They are NOT industries and NOT specialties.
  // Use these when a source is about a technique/pattern rather than
  // a vertical or a lifecycle phase. (Specialty engineering — safety,
  // security, reliability, etc. — lives in the specialtyTopics rail.)
  practiceAreas: {
    'observ':   { name: 'Observability',     short: 'observ',   order: 1, desc: 'Metrics, logs, traces, profiling, OpenTelemetry, eBPF, SLIs/SLOs.' },
    'perf':     { name: 'Performance',       short: 'perf',     order: 2, desc: 'Latency, throughput, tail behavior, caching, USE / RED methods.' },
    'platform': { name: 'Platform & DevEx',  short: 'platform', order: 3, desc: 'IDPs, golden paths, paved roads, CI/CD, team topologies.' },
    'reliab':   { name: 'Reliability & SRE', short: 'reliab',   order: 4, desc: 'SRE practice, chaos engineering, capacity, load shedding, DR.' },
    'incid':    { name: 'Incidents',         short: 'incid',    order: 5, desc: 'Real outages, blameless postmortems, RCAs, drills, near-misses.' },
    'ml-sys':   { name: 'ML / AI Systems',   short: 'ml-sys',   order: 6, desc: 'Inference at scale, training infra, model serving, evals.' },
    'dist-sys': { name: 'Distributed Systems', short: 'dist-sys', order: 7, desc: 'Consensus, replication, partitioning, ordering, time, CRDTs.' },
  },

  // ---- Conference tracks: IS2026 paper categories ----
  // Each track maps to a primary SEBoK area so the home view can group
  // "recent papers in your topic area" across both regular and conf entries.
  tracks: {
    'innovation':      { name: 'Innovation, Science, Foundations', order: 1, area: 'sys-fund' },
    'management':      { name: 'Management & Enabling Disciplines', order: 2, area: 'management' },
    'uncertainty':     { name: 'Managing Uncertainty',             order: 3, area: 'lifecycle' },
    'modelling':       { name: 'Modelling & MBSE',                 order: 4, area: 'system-def' },
    'org-skills':      { name: 'Organization & Skills',           order: 5, area: 'management' },
    'service':         { name: 'Service Disciplines',              order: 6, area: 'deploy-use' },
    'society':         { name: 'Society & Environment',            order: 7, area: 'eng-domains' },
    'conception':      { name: 'System Conception',                order: 8, area: 'concept-def' },
    'se-disciplines':  { name: 'SE Disciplines (IV&V, PLE, Reqs)', order: 9, area: 'system-def' },
  },

  // ---- Triage ----
  triage: {
    'watch':  { name: 'Watch',  color: '#4ade80' },
    'read':   { name: 'Read',   color: '#60a5fa' },
    'try':    { name: 'Try',    color: '#c4b5fd' },
    'ignore': { name: 'Ignore', color: '#f87171' },
  },

  // ---- Conference events registry ----
  // Add new events here. The proceedings URL is what /conferences links to.
  events: {
    'is2026': { name: 'IS 2026 (Yokohama)',  year: 2026, location: 'Yokohama, JP',  url: 'https://www.incose.org/symp2026' },
    'iw2025': { name: 'IW 2025 (Seville)',   year: 2025, location: 'Seville, ES',   url: 'https://www.incose.org/events-education/previous-international-events/' },
    'is2025': { name: 'IS 2025 (Ottawa)',    year: 2025, location: 'Ottawa, CA',    url: 'https://www.incose.org/symp2025' },
    'iw2024': { name: 'IW 2024',             year: 2024, location: 'Torrance, CA',  url: 'https://www.incose.org/events-education/previous-international-events/' },
    'is2024': { name: 'IS 2024 (Dublin)',    year: 2024, location: 'Dublin, IE',    url: 'https://www.incose.org/events-education/previous-international-events/' },
    'is2023': { name: 'IS 2023 (Honolulu)',  year: 2023, location: 'Honolulu, US',  url: 'https://www.incose.org/events-education/previous-international-events/' },
  },

  // ---- "Latest developments" filter ----
  latest: {
    windowDays: 30,
    defaultTriage: ['watch', 'read', 'try'],   // exclude 'ignore' from default view
  },

  // ---- Home dashboard: "Hottest topics" ----
  // Ranks topics by Σ decay(months_since_published). All entry kinds
  // weigh equally; recency is the only signal. This avoids the
  // impression that "conference = 3x more important than a blog post" —
  // a blog post about a hot topic in March is just as relevant as a
  // paper about the same topic in March.
  hotTopics: {
    windowMonths: 18,        // hard cut-off for what's counted
    topN: 6,                 // how many topics to show in the dashboard
    // Decay: score = 1 / (1 + decayRate * monthsSince)
    // decayRate=0.05 → a 12-month-old entry scores ~0.625 of fresh;
    // a 24-month-old entry scores ~0.45; a 60-month-old entry ~0.25.
    decayRate: 0.05,
  },

  // ---- SEO ----
  seo: {
    ogImage: '',
    twitterHandle: '',
  },
};

// Make available globally (in browser) and via module exports (for tests)
if (typeof window !== 'undefined') window.CONFIG = CONFIG;
if (typeof module !== 'undefined') module.exports = CONFIG;
