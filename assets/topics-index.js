// assets/topics-index.js — index of topic-page markdown files.
//
// Each entry is the basename of a file in topics/<key>.md.
// The app loads these at startup and renders them at /topic/<key>.
// Citations in topic bodies use the form [entry-key], where entry-key
// is a key from assets/entries-index.js.
//
// New topic pages: add the key here and write topics/<key>.md.

window.TOPIC_KEYS = [
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
  // Application domains
  'reliab',
  'dist-sys',
  'observ',
  'platform',
  'incid',
  'ml-sys',
  'sec',
  'perf',
  'mission',
  'energy',
  'health',
  'auto',
];
