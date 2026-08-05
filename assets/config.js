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
    url: 'https://se-intelligence.pages.dev',  // canonical site URL
    organization: 'SE Intelligence',
  },

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
    applicationDomains: true,  // secondary app-domain rail
    conferences:   true,    // /conferences route + conf- entries
    latest:        true,    // /latest route + 30d filter
    admin:         true,
  },

  // ---- Primary topic rail: SEBoK general knowledge areas (9) ----
  // Authoritative reference: SEBoK v2.11 (Nov 2024) and INCOSE SE Handbook v5.0.
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
  },

  // ---- Secondary rail: Application domains (cross-cutting) ----
  // These are how working SEs self-identify. Filter on top of primary topic.
  applicationDomains: {
    'dist-sys': { name: 'Distributed Systems', short: 'dist-sys', order: 1,  desc: 'Consensus, replication, partitioning, ordering, time, CRDTs. (WG: Complex Systems, SoS.)' },
    'observ':   { name: 'Observability',       short: 'observ',   order: 2,  desc: 'Metrics, logs, traces, profiling, OpenTelemetry, eBPF, SLIs/SLOs.' },
    'reliab':   { name: 'Reliability & SRE',   short: 'reliab',   order: 3,  desc: 'SRE practice, chaos engineering, capacity, load shedding, DR. (WG: Resilient Systems.)' },
    'platform': { name: 'Platform & DevEx',    short: 'platform', order: 4,  desc: 'IDPs, golden paths, paved roads, CI/CD. (WG: Lean SE.)' },
    'incid':    { name: 'Incidents',           short: 'incid',    order: 5,  desc: 'Real outages, blameless postmortems, RCAs, drills, near-misses.' },
    'ml-sys':   { name: 'ML / AI Systems',     short: 'ml-sys',   order: 6,  desc: 'Inference at scale, training infra, model serving, evals. (WG: AI Systems.)' },
    'sec':      { name: 'Security Engineering',short: 'sec',      order: 7,  desc: 'AppSec, supply chain, zero trust, threat modeling. (WG: SSE.)' },
    'perf':     { name: 'Performance',         short: 'perf',     order: 8,  desc: 'Latency, throughput, tail behavior, caching, profiling.' },
    'mission':  { name: 'Mission Engineering', short: 'mission',  order: 9,  desc: 'Capability-driven, defense, mission analysis. (WG: Defense Systems, IS2026 emphasis area.)' },
    'energy':   { name: 'Energy & Sustain.',   short: 'energy',   order: 10, desc: 'Energy transformation, sustainability, critical infrastructure. (IS2026 emphasis area.)' },
    'health':   { name: 'Healthcare SE',       short: 'health',   order: 11, desc: 'Medical devices, healthcare delivery. (WG: Healthcare.)' },
    'auto':     { name: 'Automotive',          short: 'auto',     order: 12, desc: 'OEM, autonomy, software-defined vehicles. (WG: Automotive.)' },
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
