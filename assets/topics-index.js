// assets/topics-index.js — index of topic-page markdown files.
//
// Each entry is the basename of a file in topics/<key>.md.
// The app loads these at startup and renders them at /topic/<key>.
// Citations in topic bodies use the form [entry-key], where entry-key
// is a key from assets/entries-index.js.
//
// Order: specialty topics first (the disciplines a practitioner cares
// about), then SEBoK primary (the structural backbone), then application
// domains (vertical industries), then practice areas (cross-cutting
// engineering practice). The order here doesn't affect rendering
// order — that's driven by the `order` field in assets/config.js.

window.TOPIC_KEYS = [
  // Engineering specialty — the disciplines
  'specialty-safety',
  'specialty-reliability',
  'specialty-security',
  'specialty-hfe',
  'specialty-maintainability',
  'specialty-software',
  // SEBoK primary topics
  'sys-fund',
  'lifecycle',
  'concept-def',
  'system-def',
  'realization',
  'deploy-use',
  'eng-domains',
  'management',
  'sos',
  'sec',  // sub-area of eng-domains, has its own synthesized page
  // Application domains — vertical industries (only those with synthesized pages)
  'defense',
  'auto',
  'health',
  'energy',
  'infra',
  'space',
  'manufacturing',
  'finance',
  // Practice areas — cross-cutting engineering practice
  'reliab',
  'observ',
  'perf',
  'platform',
  'incid',
  'ml-sys',
  'dist-sys',
];
