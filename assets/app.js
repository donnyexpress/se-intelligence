// assets/app.js — Tech Scan engine
//
// Single-page static site. All customization comes from CONFIG (see config.js).
// Routes: /, /latest, /entry/<key>, /about, /conferences, /admin, /quotes.

(function() {
  'use strict';

  // ===== Engine state =====
  const state = {
    entries: {},
    keys: [],
    loaded: false,
    activePrimaryTopic: null,
    activeDomain: null,
    activeTriage: null,   // null = no filter
  };

  // ===== Feature detectors =====
  const F = () => (window.CONFIG && window.CONFIG.features) || {};
  const SITE = () => (window.CONFIG && window.CONFIG.site) || { name: 'Tech Scan', url: '', description: '' };
  const T = () => (window.CONFIG && window.CONFIG.theme) || {};
  const PRIMARY = () => (window.CONFIG && window.CONFIG.primaryTopics) || {};
  const DOMAINS = () => (window.CONFIG && window.CONFIG.applicationDomains) || {};
  const TRACKS = () => (window.CONFIG && window.CONFIG.tracks) || {};
  const EVENTS = () => (window.CONFIG && window.CONFIG.events) || {};
  const TRIAGE = () => (window.CONFIG && window.CONFIG.triage) || {};
  const LATEST = () => (window.CONFIG && window.CONFIG.latest) || { windowDays: 30, defaultTriage: ['watch','read','try'] };

  // ===== Utilities =====
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formatDate(iso) {
    if (!iso) return '';
    const m = String(iso).match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (!m) return String(iso);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const day = m[3] ? parseInt(m[3], 10) : null;
    return day ? `${months[parseInt(m[2], 10) - 1]} ${day}, ${m[1]}` : `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
  }
  function daysAgo(iso) {
    if (!iso) return Infinity;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return Infinity;
    return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
  }
  function signalBars(score) {
    const filled = Math.round(Math.max(0, Math.min(1, score)) * 4);
    let html = '<span class="signal-meter" aria-label="signal ' + score.toFixed(2) + '">';
    for (let i = 0; i < 4; i++) html += `<i class="${i < filled ? 'on' : ''}"></i>`;
    html += `<span class="signal-num">${score.toFixed(2)}</span></span>`;
    return html;
  }

  // Score a single entry's contribution to its topic's "hotness".
  // All kinds weigh equally — the only signal is recency (months since
  // the original publication date, with linear-ish decay). Entries
  // without a publication date are excluded (otherwise last_updated
  // would skew toward recently-edited entries, not recently-published).
  function entryHotScore(e, cfg) {
    if (!e.published) return 0;
    const months = (Date.now() - e.published.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    if (months < 0 || months > cfg.windowMonths) return 0;
    return 1 / (1 + cfg.decayRate * months);
  }

  // Compute the dashboard: top topics by Σ entryHotScore.
  // Returns an array of { topic, score, totalCount, confCount, confWindowCount }
  // sorted by score desc, length <= cfg.topN.
  function computeHotTopics() {
    const cfg = (window.CONFIG && window.CONFIG.hotTopics) || { windowMonths: 12, topN: 6, decayRate: 0.05 };
    const entries = Object.values(state.entries);
    const byTopic = {};
    for (const e of entries) {
      const s = entryHotScore(e, cfg);
      if (s <= 0) continue;
      const t = e.topic;
      if (!byTopic[t]) byTopic[t] = { topic: t, score: 0, totalCount: 0, confCount: 0, confWindowCount: 0 };
      byTopic[t].score += s;
      byTopic[t].totalCount += 1;
      if (e.isConference) byTopic[t].confCount += 1;
      if (e.isConference && e.published) byTopic[t].confWindowCount += 1;
    }
    const ranked = Object.values(byTopic).sort((a, b) => b.score - a.score).slice(0, cfg.topN);
    const max = ranked[0] ? ranked[0].score : 1;
    return { ranked, max, cfg };
  }

  // ===== Loaders =====
  async function loadAll() {
    try {
      const indexRes = await fetch('assets/entries-index.js');
      const indexText = await indexRes.text();
      const start = indexText.indexOf('ENTRY_KEYS');
      const arrStart = indexText.indexOf('[', start);
      const arrEnd = indexText.indexOf(']', arrStart);
      const arrText = (arrStart >= 0 && arrEnd > arrStart) ? indexText.slice(arrStart + 1, arrEnd) : '';
      // Strip // line comments and /* */ block comments.
      // The file is JS-authored but we keep the array clean: only quoted strings + commas.
      const cleaned = arrText
        .replace(/\/\/[^\n]*/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/,\s*([\]])/g, '$1');  // strip trailing commas
      let keys = [];
      try {
        const parsed = JSON.parse('[' + cleaned + ']');
        keys = parsed.filter(k => typeof k === 'string' && k.length > 0);
      } catch (e) {
        // Last-resort fallback: split on commas, strip quotes/whitespace.
        // Also filter to plausible keys (kebab-case, no spaces, no leading junk).
        keys = cleaned.split(',')
          .map(s => s.trim().replace(/['"]/g, ''))
          .filter(k => k && /^[a-z0-9][a-z0-9-]*$/.test(k));
      }
      const entries = {};
      await Promise.all(keys.map(async (k) => {
        try {
          const res = await fetch('entries/' + k + '.md');
          if (res.ok) {
            const raw = await res.text();
            entries[k] = window.parseMarkdown(k + '.md', raw);
          }
        } catch (_) {}
      }));
      state.entries = entries;
      state.keys = keys;
      state.loaded = true;
      window.__getState = () => state;
    } catch (e) {
      console.error('loadAll failed:', e);
      state.loaded = true;
    }
  }

  // ===== Search index =====
  function getSearchIndex() {
    return Object.values(state.entries).map(e => ({
      key: e.key, title: e.title, kind: e.kind, triage: e.triage,
      topic: e.topic, signal: e.signal, isConference: e.isConference,
      event: e.event, summary: (e.summary || '').slice(0, 200),
      haystack: (e.title + ' ' + (e.summary || '') + ' ' + (e.raw || '')).toLowerCase(),
    }));
  }

  // ===== Mobile search modal =====
  function wireMobileSearch() {
    if (!F().search) return;
    const searchToggle = document.getElementById('search-toggle');
    const searchModal = document.getElementById('mobile-search-modal');
    const searchInput = document.getElementById('mobile-search-input');
    const searchResults = document.getElementById('mobile-search-results');
    const searchClose = document.getElementById('search-close');
    if (!searchToggle || !searchModal) return;

    searchToggle.addEventListener('click', () => {
      searchModal.classList.add('open');
      setTimeout(() => searchInput.focus(), 100);
    });
    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchModal.classList.remove('open');
        searchInput.value = '';
        searchResults.innerHTML = '';
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const q = searchInput.value.trim().toLowerCase();
        if (q.length < 2) { searchResults.innerHTML = ''; return; }
        const idx = getSearchIndex();
        const hits = idx.filter(s => s.haystack.includes(q)).slice(0, 30);
        if (hits.length === 0) {
          searchResults.innerHTML = '<div style="color:var(--ink-faint);padding:20px;text-align:center;">No matches</div>';
        } else {
          searchResults.innerHTML = hits.map(h => {
            const confTag = h.isConference ? `<span class="tag tag-conf">${escapeHtml((EVENTS()[h.event] || {name:h.event}).name)}</span>` : '';
            return `<a class="result" href="/entry/${h.key}" data-key="${h.key}">
              ${confTag}
              <span class="tag tag-triage-${h.triage}">${h.triage}</span>
              <div class="title">${escapeHtml(h.title)}</div>
            </a>`;
          }).join('');
        }
      });
      searchResults.addEventListener('click', (e) => {
        const a = e.target.closest('a.result');
        if (!a) return;
        e.preventDefault();
        const key = a.dataset.key;
        history.pushState(null, '', '/entry/' + key);
        searchModal.classList.remove('open');
        searchInput.value = '';
        searchResults.innerHTML = '';
        if (window.__appRender) window.__appRender();
        document.querySelector('.shell')?.classList.remove('panel-open');
      });
    }
  }

  // ===== Sidebar =====
  function renderSidebar(activeKey) {
    const sidebar = document.getElementById('sidebar');
    const primary = PRIMARY();
    const domains = DOMAINS();
    const events = EVENTS();
    const counts = countByField('topic');
    const domainCounts = countByFieldDomains();
    const confCount = Object.values(state.entries).filter(e => e.isConference).length;
    const latestCount = countLatest().length;

    // Compute conference count by event for the conferences list preview
    const confByEvent = {};
    for (const e of Object.values(state.entries)) {
      if (!e.isConference) continue;
      confByEvent[e.event] = (confByEvent[e.event] || 0) + 1;
    }

    const primaryList = Object.entries(primary)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const n = counts[k] || 0;
        const active = state.activePrimaryTopic === k ? ' class="active"' : '';
        return `<li><a href="/?topic=${k}"${active} data-nav="topic" data-topic="${k}">${escapeHtml(v.name)} <span class="count-badge">${n}</span></a></li>`;
      }).join('');
    const domainList = Object.entries(domains)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const n = domainCounts[k] || 0;
        const active = state.activeDomain === k ? ' class="active"' : '';
        return `<li><a href="/?domain=${k}"${active} data-nav="domain" data-domain="${k}">${escapeHtml(v.name)} <span class="count-badge">${n}</span></a></li>`;
      }).join('');

    const confEventPreview = Object.entries(events)
      .sort((a, b) => (b[1].year || 0) - (a[1].year || 0))
      .slice(0, 4)
      .map(([k, v]) => {
        const n = confByEvent[k] || 0;
        return `<li><a href="/conferences#${k}">${escapeHtml(v.name)} <span class="count-badge">${n}</span></a></li>`;
      }).join('');

    sidebar.innerHTML = `
      <div class="brand"><a href="/" data-nav="home">${escapeHtml(SITE().name)}</a></div>
      <div class="brand-sub">${escapeHtml(SITE().tagline || 'A scanning log for systems engineers')}</div>

      <h3>Browse</h3>
      <ul class="flat-entries">
        <li><a href="/latest" data-nav="latest">Latest (30d) <span class="count-badge">${latestCount}</span></a></li>
        <li><a href="/" data-nav="home">All entries <span class="count-badge">${state.keys.length}</span></a></li>
        <li><a href="/conferences" data-nav="conferences">Conferences <span class="count-badge">${confCount}</span></a></li>
        <li><a href="/about" data-nav="about">About</a></li>
      </ul>

      <h3>SEBoK Topics</h3>
      <ul class="flat-entries">${primaryList}</ul>

      <h3>Application Domains</h3>
      <ul class="domain-entries">${domainList}</ul>

      ${F().conferences && confEventPreview ? `<h3>Recent Conferences</h3><ul class="domain-entries">${confEventPreview}</ul>` : ''}

      ${F().admin ? '<div class="sidebar-footer"><a href="/admin" data-nav="admin">Admin</a></div>' : ''}
    `;
  }

  function countByField(field) {
    const out = {};
    for (const e of Object.values(state.entries)) {
      out[e[field]] = (out[e[field]] || 0) + 1;
    }
    return out;
  }
  function countByFieldDomains() {
    const out = {};
    for (const e of Object.values(state.entries)) {
      for (const d of (e.domains || [])) {
        out[d] = (out[d] || 0) + 1;
      }
      // also count primary topic if it's an app domain
      if (DOMAINS()[e.topic]) out[e.topic] = (out[e.topic] || 0) + 1;
    }
    return out;
  }
  function countLatest() {
    const cfg = LATEST();
    const cutoffDays = cfg.windowDays || 30;
    return Object.values(state.entries).filter(e => {
      if (!(cfg.defaultTriage || ['watch','read','try']).includes(e.triage)) return false;
      return daysAgo(e.lastUpdated) <= cutoffDays;
    });
  }

  // ===== Comments =====
  async function loadComments(key) {
    if (!F().comments) return;
    const thread = document.getElementById('comments-thread-' + key);
    if (!thread) return;
    try {
      const res = await fetch('/api/comments?entry=' + encodeURIComponent(key), { cache: 'no-store' });
      if (!res.ok) { thread.innerHTML = '<div class="comments-empty">Could not load comments.</div>'; return; }
      const data = await res.json();
      const comments = data.comments || [];
      if (comments.length === 0) { thread.innerHTML = '<div class="comments-empty">No comments yet. Be the first to share a thought.</div>'; return; }
      thread.innerHTML = comments.map(renderComment).join('');
    } catch (err) {
      thread.innerHTML = '<div class="comments-empty">Could not load comments (network error).</div>';
    }
  }
  function renderComment(c) {
    const when = new Date(c.timestamp).toISOString().slice(0, 10);
    const who = c.name ? escapeHtml(c.name) : 'Anonymous';
    const type = escapeHtml(c.type || 'other');
    const status = c.status || 'new';
    const replies = (c.system_replies || []).map(r =>
      `<div class="system-reply"><span class="system-reply-kind">${escapeHtml(r.kind)}</span>${escapeHtml(r.message)}</div>`
    ).join('');
    return `<div class="comment" data-id="${c.id}">
      <div class="comment-meta">
        <span class="comment-type">${type}</span>
        <span class="comment-status">${status}</span>
        <span class="comment-who">${who}</span>
        <span class="comment-when">${when}</span>
      </div>
      <div class="comment-body">${escapeHtml(c.message).replace(/\n/g, '<br>')}</div>
      ${replies ? `<div>${replies}</div>` : ''}
    </div>`;
  }
  function renderCommentsSection(key) {
    if (!F().comments) return '';
    return `<div class="comments-section" id="comments-${key}">
      <div class="label">Comments</div>
      <p class="comments-blurb">Have a thought, a fix, or a related link? Leave a note.</p>
      <div class="comments-thread" id="comments-thread-${key}">
        <div class="comments-loading">Loading comments&hellip;</div>
      </div>
      <form class="comment-form" data-entry="${key}">
        <div class="comment-row">
          <label><span>Your name (optional)</span><input type="text" name="name" placeholder="Anonymous" maxlength="60" /></label>
          <label><span>Type</span>
            <select name="type">
              <option value="note">General note</option>
              <option value="link">Missing link</option>
              <option value="typo">Typo fix</option>
              <option value="related">Related reading</option>
              <option value="praise">Praise / this helped</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        <label><span>Your note</span><textarea name="message" rows="4" required maxlength="2000" placeholder="Share a thought, fix, or related link…"></textarea></label>
        <button type="submit" class="btn btn-primary">Submit comment</button>
        <div data-status></div>
      </form>
    </div>`;
  }
  function wireCommentForm(key) {
    if (!F().comments) return;
    const form = document.querySelector('.comment-form[data-entry="' + key + '"]');
    if (!form || form.dataset.wired) return;
    form.dataset.wired = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-status]');
      const submitBtn = form.querySelector('button[type=submit]');
      const fd = new FormData(form);
      const body = { entry: key, type: fd.get('type') || 'note', name: fd.get('name') || '', message: fd.get('message') || '' };
      if (!body.message.trim()) { status.textContent = 'Please enter a note.'; return; }
      submitBtn.disabled = true;
      status.textContent = 'Submitting...';
      try {
        const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) { const err = await res.json().catch(() => ({})); status.textContent = 'Error: ' + (err.error || res.statusText); submitBtn.disabled = false; return; }
        form.reset();
        status.textContent = 'Posted. Thanks!';
        setTimeout(() => { status.textContent = ''; }, 3000);
        loadComments(key);
      } catch (err) {
        status.textContent = 'Network error. Try again.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // ===== Entry view =====
  function renderEntry(key) {
    const e = state.entries[key];
    if (!e) {
      return `<div class="entry-header">
        <div class="entry-kind">Not Found</div>
        <h1 class="entry-title">Entry not found</h1>
        <p class="entry-summary">No entry with key "${key}". <a href="/">Go home</a>.</p>
      </div>`;
    }
    const primary = PRIMARY();
    const tracks = TRACKS();
    const events = EVENTS();
    const triage = TRIAGE();
    const topicMeta = primary[e.topic] || DOMAINS()[e.topic] || { name: e.topic, short: e.topic };
    const trackMeta = e.track ? tracks[e.track] : null;
    const eventMeta = e.event ? events[e.event] : null;

    // Reserved headings to strip from the body view
    const reservedRe = /^(TL;DR|Tldr|tl;dr|Why it matters|Why this matters|So what|Sources?(\s*(&|and)?\s*links?)?|^Links?$|My take|^Take$|My notes|^Related( reading| work)?$|^Source$|Monday morning|Your notes)/i;
    const sectionHtml = (e.sections || [])
      .filter(s => s.heading && !reservedRe.test(s.heading))
      .map(s => `<h2>${escapeHtml(s.heading)}</h2>${window.mdToHtml(s.content)}`).join('');

    const relatedHtml = (e.related && e.related.length)
      ? `<div class="related-section">
          <div class="section-title">Related entries</div>
          ${e.related.map(r => {
            const re = state.entries[r];
            const title = re ? re.title : r;
            return `<div><a href="/entry/${escapeHtml(r)}">${escapeHtml(title)}</a></div>`;
          }).join('')}
        </div>` : '';

    const linksHtml = (e.linksList && e.linksList.length)
      ? `<h2>Sources &amp; links</h2><ul>${e.linksList.map(l => {
          const url = l.trim();
          const isUrl = /^https?:\/\//.test(url);
          const label = isUrl ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : url;
          return `<li>${isUrl
            ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
            : escapeHtml(url)}</li>`;
        }).join('')}</ul>` : '';

    const confCard = e.isConference ? `
      <div class="conf-meta-card">
        <div class="conf-row"><span class="label">Event</span><span>${eventMeta ? `<a href="${escapeHtml(eventMeta.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(eventMeta.name)}</a>` : escapeHtml(e.event)}</span></div>
        <div class="conf-row"><span class="label">Year</span><span>${e.year || (eventMeta ? eventMeta.year : '')}</span></div>
        <div class="conf-row"><span class="label">Track</span><span>${trackMeta ? escapeHtml(trackMeta.name) : escapeHtml(e.track || '—')}</span></div>
        ${e.authors ? `<div class="conf-row"><span class="label">Authors</span><span>${escapeHtml(e.authors)}</span></div>` : ''}
        ${e.paperId ? `<div class="conf-row"><span class="label">Paper</span><span><a href="${escapeHtml(e.paperId)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.paperId.replace(/^https?:\/\//, '').slice(0, 60))}</a></span></div>` : ''}
      </div>` : '';

    // Top-of-entry CTA: "Read the full thing" — points at the canonical
    // source URL. Uses sourceLabel if set, else a context-aware default.
    let ctaHtml = '';
    if (e.sourceUrl) {
      const label = e.sourceLabel
        || (e.isConference ? 'Read the paper →'
           : e.sourceType === 'paper' ? 'Read the paper →'
           : e.sourceType === 'postmortem' ? 'Read the postmortem →'
           : e.sourceType === 'talk' ? 'Watch the talk →'
           : e.sourceType === 'release-note' ? 'Read the release notes →'
           : e.sourceType === 'rfc' ? 'Read the RFC →'
           : 'Read the full article →');
      ctaHtml = `<a class="entry-cta" href="${escapeHtml(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    }

    const summaryHtml = e.summary ? window.mdToHtml(e.summary.split('\n\n')[0] || e.summary) : '';
    const sourceMeta = e.sourceType ? escapeHtml(e.sourceType) : '';
    const maturityMeta = e.maturity ? escapeHtml(e.maturity) : '';

    return `<div class="entry-header">
        <div class="entry-kind">${e.kind} · <span class="tag tag-topic">${escapeHtml(topicMeta.name)}</span></div>
        <h1 class="entry-title">${escapeHtml(e.title)}</h1>
        ${e.summary ? `<p class="entry-summary">${escapeHtml((e.summary || '').split('\n')[0] || '')}</p>` : ''}
        ${ctaHtml}
        <div class="entry-meta">
          <span class="tag tag-triage-${e.triage}">${e.triage}</span>
          <span>${signalBars(e.signal)}</span>
          ${sourceMeta ? `<span>· ${sourceMeta}</span>` : ''}
          ${maturityMeta ? `<span>· ${maturityMeta}</span>` : ''}
          ${e.lastUpdated ? `<span>·</span><span><span class="label">Updated</span> <time datetime="${e.lastUpdated}">${formatDate(e.lastUpdated)}</time></span>` : ''}
        </div>
      </div>
      ${confCard}
      <div class="entry-body">${summaryHtml}${sectionHtml}${linksHtml}</div>
      ${relatedHtml}
      ${renderCommentsSection(e.key)}
      <div class="entry-actions">
        ${e.sourceUrl ? `<a class="btn btn-primary" href="${escapeHtml(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.sourceLabel || 'Read the full article →')}</a>` : ''}
        <button class="btn" onclick="window.print()">Print this entry</button>
        <a class="btn" href="entries/${e.key}.md" download>Download .md</a>
        <a class="btn" href="/">Back to home</a>
      </div>`;
  }

  // ===== Home =====
  function renderHome() {
    const site = SITE();
    const entries = Object.values(state.entries);
    if (entries.length === 0) {
      return `<div class="hero">
        <h1>${escapeHtml(site.name)}</h1>
        <p class="lede">${escapeHtml(site.tagline)}</p>
        <p class="lede">No entries yet. Drop a markdown file in <code>entries/</code> and add its key to <code>assets/entries-index.js</code>.</p>
      </div>`;
    }

    // Default to "Latest developments" view: triage ∈ {watch,read,try}, last 30 days,
    // sorted by signal desc, then last_updated desc.
    const cfg = LATEST();
    const cutoffDays = cfg.windowDays || 30;
    let view = entries.filter(e => {
      if (!(cfg.defaultTriage || ['watch','read','try']).includes(e.triage)) return false;
      return daysAgo(e.lastUpdated) <= cutoffDays;
    });
    view.sort((a, b) => {
      if (b.signal !== a.signal) return b.signal - a.signal;
      return (b.lastUpdated || '').localeCompare(a.lastUpdated || '');
    });

    // "Hottest topics" dashboard, computed independently of the feed below.
    // Placed between the hero and the feed so the visitor sees "what's hot"
    // before "what's recent".
    const dashboard = renderHotTopics();
    const feed = renderFeed('Latest developments', view, { isLatest: true });
    return dashboard + feed;
  }

  // Build the "Hottest topics" dashboard panel.
  // Returns HTML for a horizontal bar chart of the top N topics
  // ranked by recent publication activity, with a score and a
  // breakdown of what drove the score.
  function renderHotTopics() {
    const { ranked, max, cfg } = computeHotTopics();
    if (ranked.length === 0) {
      // No entries with publication dates in the window — skip the panel.
      return '';
    }
    const windowMonths = cfg.windowMonths;
    const primary = PRIMARY();
    const domains = DOMAINS();
    const rows = ranked.map((row, i) => {
      const meta = primary[row.topic] || domains[row.topic] || { name: row.topic, short: row.topic };
      const widthPct = max > 0 ? Math.max(6, Math.round((row.score / max) * 100)) : 6;
      const breakdown = [];
      if (row.confCount) breakdown.push(`${row.confCount} conf`);
      const others = row.totalCount - row.confCount;
      if (others) breakdown.push(`${others} other`);
      return `<a class="hot-row" href="/?topic=${row.topic}" data-nav="topic" data-topic="${row.topic}">
        <span class="hot-rank">${i + 1}</span>
        <span class="hot-name">${escapeHtml(meta.name)} <span class="hot-short">${escapeHtml(meta.short)}</span></span>
        <span class="hot-bar"><span class="hot-bar-fill" style="width: ${widthPct}%"></span></span>
        <span class="hot-score">${row.score.toFixed(2)}</span>
        <span class="hot-meta">${breakdown.join(' · ')}</span>
      </a>`;
    }).join('');

    return `<section class="hot-topics" aria-label="Hottest topics in the last ${windowMonths} months">
      <div class="hot-header">
        <h2 class="hot-title">Hottest topics <span class="hot-window">last ${windowMonths} months</span></h2>
        <p class="hot-subtitle">Ranked by recent publication activity. All sources weigh equally; recency is the only signal.</p>
      </div>
      <div class="hot-list">${rows}</div>
    </section>`;
  }

  function renderLatest() {
    return renderHome();
  }

  function renderFeed(title, entries, opts) {
    opts = opts || {};
    const site = SITE();
    const triage = TRIAGE();
    const allEntries = Object.values(state.entries);
    const allCount = allEntries.length;
    const filterChips = ['all', 'watch', 'read', 'try', 'ignore'].map(t => {
      const active = (t === 'all' && !state.activeTriage) || state.activeTriage === t;
      const dot = t === 'all' ? '' : `<span class="dot"></span>`;
      const label = t === 'all' ? 'all' : t;
      return `<button class="triage-chip${active ? ' active' : ''}" data-triage="${t}" type="button">${dot}${label}</button>`;
    }).join('');

    // Apply triage filter for non-Latest views
    let filtered = entries;
    if (state.activeTriage) {
      filtered = filtered.filter(e => e.triage === state.activeTriage);
    }
    // Apply primary-topic (SEBoK) filter — narrows to entries whose
    // primary topic matches the active filter.
    if (state.activePrimaryTopic) {
      filtered = filtered.filter(e => e.topic === state.activePrimaryTopic);
    }
    // Apply domain filter
    if (state.activeDomain) {
      filtered = filtered.filter(e => (e.domains || []).includes(state.activeDomain) || e.topic === state.activeDomain);
    }

    const headerNote = (state.activePrimaryTopic || state.activeDomain)
      ? `<div class="hero-meta">Filtered: ${state.activePrimaryTopic ? PRIMARY()[state.activePrimaryTopic]?.name : ''}${state.activeDomain ? (state.activePrimaryTopic ? ' + ' : '') + DOMAINS()[state.activeDomain]?.name : ''} · <a href="/" data-nav="home">clear filters</a></div>`
      : '';

    return `<span class="kicker"><span class="pulse"></span>Live · Scanning</span>
      <h1>${escapeHtml(site.name)}</h1>
      <p class="lede">${escapeHtml(site.tagline)}</p>
      ${headerNote}
      <div class="section-title">${escapeHtml(title)}</div>
      <div class="filter-bar" role="toolbar" aria-label="Filter by triage">
        <span class="filter-label">Triage</span>
        ${filterChips}
      </div>
      <div class="feed-list">
        ${filtered.length === 0
          ? '<p style="color:var(--ink-faint);padding:24px 0;">No entries match the current filters.</p>'
          : filtered.map(e => renderFeedRow(e)).join('')}
      </div>
      <div class="hero-meta" style="margin-top:32px;">
        <span>${allCount} ${allCount === 1 ? 'entry' : 'entries'} total</span>
        <span>·</span>
        <span>Curated, no tracking, no newsletter</span>
      </div>`;
  }

  function renderFeedRow(e) {
    const primary = PRIMARY();
    const domains = DOMAINS();
    const events = EVENTS();
    const topicMeta = primary[e.topic] || domains[e.topic] || { name: e.topic, short: e.topic };
    const summary = (e.summary || '').split('\n')[0] || '';
    const confTag = e.isConference
      ? `<span class="tag tag-conf">${escapeHtml((events[e.event] || {name: e.event}).name)}</span>`
      : '';
    const domainTags = (e.domains || []).slice(0, 2).map(d =>
      `<span class="tag tag-domain">${escapeHtml((domains[d] || {name:d}).name)}</span>`
    ).join('');
    return `<a class="feed-card" href="/entry/${e.key}">
      <div>
        <div class="feed-title">${escapeHtml(e.title)}</div>
        <div class="feed-summary">${escapeHtml(summary.slice(0, 240))}</div>
      </div>
      <div class="feed-meta">
        ${confTag}
        <span class="tag tag-triage-${e.triage}">${e.triage}</span>
        <span class="tag tag-topic">${escapeHtml(topicMeta.short)}</span>
        ${domainTags}
        <span>${signalBars(e.signal)}</span>
        ${e.lastUpdated ? `<span>${formatDate(e.lastUpdated)}</span>` : ''}
      </div>
    </a>`;
  }

  // ===== Conferences =====
  function renderConferences() {
    const events = EVENTS();
    const confEntries = Object.values(state.entries).filter(e => e.isConference);
    const byEvent = {};
    for (const e of confEntries) {
      (byEvent[e.event] = byEvent[e.event] || []).push(e);
    }
    const eventKeys = Object.keys(events).filter(k => byEvent[k]);
    if (eventKeys.length === 0) {
      return `<span class="kicker"><span class="pulse"></span>Conferences</span>
        <h1>Conference Proceedings</h1>
        <p class="lede">Tracking papers from INCOSE International Symposium (IS), International Workshop (IW), and regional events.</p>
        <p style="color:var(--ink-faint);">No conference entries yet. Add one with the <code>conf-&lt;event&gt;-&lt;slug&gt;</code> filename pattern.</p>`;
    }

    eventKeys.sort((a, b) => (events[b].year || 0) - (events[a].year || 0));
    return `<span class="kicker"><span class="pulse"></span>Conferences</span>
      <h1>Conference Proceedings</h1>
      <p class="lede">Papers from INCOSE International Symposium (IS), International Workshop (IW), and regional events. Sorted by event, descending year.</p>
      <div class="section-title">${eventKeys.length} event${eventKeys.length === 1 ? '' : 's'} · ${confEntries.length} paper${confEntries.length === 1 ? '' : 's'}</div>
      ${eventKeys.map(k => {
        const ev = events[k];
        const papers = byEvent[k].sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title));
        return `<div class="conf-event" id="${k}">
          <h2>${escapeHtml(ev.name)}</h2>
          <div class="conf-event-meta">
            <span>${escapeHtml(ev.location || '')}</span>
            <span>·</span>
            <span>${ev.year}</span>
            <span>·</span>
            <span>${papers.length} paper${papers.length === 1 ? '' : 's'} indexed</span>
            <span>·</span>
            <a href="${escapeHtml(ev.url)}" target="_blank" rel="noopener noreferrer">View in INCOSE proceedings →</a>
          </div>
          <ul class="conf-event-list">
            ${papers.map(p => {
              const track = TRACKS()[p.track] || { name: p.track };
              return `<li>
                <a href="/entry/${p.key}">${escapeHtml(p.title)}</a>
                <span class="conf-paper-meta">
                  ${p.authors ? `· ${escapeHtml(p.authors)}` : ''}
                  · <span class="tag tag-topic">${escapeHtml(track.name)}</span>
                </span>
              </li>`;
            }).join('')}
          </ul>
        </div>`;
      }).join('')}`;
  }

  // ===== About =====
  function renderAbout() {
    const site = SITE();
    return `<span class="kicker">About</span>
      <h1>About ${escapeHtml(site.name)}</h1>
      <p class="lede">${escapeHtml(site.tagline)}</p>
      <div class="entry-body about-page">
        <h2>What this is</h2>
        <p>A personal scanning log for systems engineers. Each entry is a markdown file in <code>entries/</code>, tagged against the SEBoK general knowledge areas, INCOSE application domains, and IS2026 paper categories.</p>
        <h2>How entries are organized</h2>
        <p>The sidebar has two topic rails: <strong>SEBoK Topics</strong> (the 9 general knowledge areas from SEBoK v2.11) and <strong>Application Domains</strong> (12 cross-cutting application areas, aligned to INCOSE Working Groups where applicable). Conference papers live in their own <a href="/conferences">/conferences</a> section.</p>
        <h2>Triage</h2>
        <p>Each entry is tagged <span class="tag tag-triage-watch">watch</span> <span class="tag tag-triage-read">read</span> <span class="tag tag-triage-try">try</span> <span class="tag tag-triage-ignore">ignore</span>. The home view defaults to "Latest developments" — entries updated in the last 30 days, excluding <code>ignore</code>.</p>
        <h2>About the engine</h2>
        <p>Static, mobile-first, no build step, no tracking. Hosted on Cloudflare Pages. Comments use Cloudflare KV.</p>
        <h2>Standards alignment</h2>
        <ul>
          <li>SEBoK v2.11 (Nov 2024) — primary topic taxonomy</li>
          <li>INCOSE SE Handbook v5.0 (2023) — life cycle framing</li>
          <li>ISO/IEC/IEEE 15288:2023 — process reference</li>
          <li>IS2026 paper categories — conference track taxonomy</li>
        </ul>
      </div>`;
  }

  // ===== Admin (unchanged surface area) =====
  function renderAdmin() {
    if (!F().admin) return '';
    return `<div class="hero">
      <h1>Admin</h1>
      <p class="lede">All visitor comments, newest first.</p>
    </div>
    <div class="entry-body admin-page">
      <h2>Live comment thread</h2>
      <div id="admin-comments-thread" class="comments-thread"><div class="comments-loading">Loading all comments&hellip;</div></div>
    </div>`;
  }
  async function loadAllComments() {
    if (!F().admin) return;
    const thread = document.getElementById('admin-comments-thread');
    if (!thread) return;
    try {
      const res = await fetch('/api/comments', { cache: 'no-store' });
      if (!res.ok) { thread.innerHTML = '<div class="comments-empty">Could not load comments.</div>'; return; }
      const data = await res.json();
      const comments = data.comments || [];
      if (comments.length === 0) { thread.innerHTML = '<div class="comments-empty">No comments yet.</div>'; return; }
      thread.innerHTML = comments.map(c => `${renderComment(c)}
        <div class="admin-actions" data-id="${c.id}" data-entry="${escapeHtml(c.entry || '')}">
          <button class="admin-btn" data-action="ack">👀 Ack</button>
          <button class="admin-btn" data-action="acted">✅ Acted</button>
          <button class="admin-btn" data-action="reply">💬 Reply</button>
          <button class="admin-btn" data-action="new">○ New</button>
          <button class="admin-btn danger" data-action="delete">🗑</button>
        </div>`).join('');
      wireAdminActions();
    } catch (err) {
      thread.innerHTML = '<div class="comments-empty">Could not load comments (network error).</div>';
    }
  }
  function wireAdminActions() {
    document.querySelectorAll('.admin-actions').forEach(bar => {
      const id = bar.dataset.id, entry = bar.dataset.entry;
      bar.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        btn.disabled = true;
        try {
          if (action === 'delete') {
            if (!confirm('Delete this comment?')) { btn.disabled = false; return; }
            const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}`, { method: 'DELETE' });
            if (!res.ok) { alert('Delete failed: ' + res.status); btn.disabled = false; return; }
            loadAllComments(); return;
          }
          if (action === 'reply') {
            const msg = prompt('System reply (visitors will see this):', '👀');
            if (!msg) { btn.disabled = false; return; }
            const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_reply: { kind: 'reply', message: msg } }) });
            if (!res.ok) { alert('Reply failed: ' + res.status); btn.disabled = false; return; }
            loadAllComments(); return;
          }
          const replyMsg = action === 'ack' ? '👀 Looking into it' : (action === 'acted' ? '✅ Done' : null);
          const body = { status: action };
          if (replyMsg) body.system_reply = { kind: action, message: replyMsg };
          const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          if (!res.ok) { alert('Update failed: ' + res.status); btn.disabled = false; return; }
          loadAllComments();
        } catch (err) { alert('Network error: ' + err.message); btn.disabled = false; }
      });
    });
  }

  // ===== Router =====
  function getRoute() {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '') return { route: 'home' };
    if (path === '/latest') return { route: 'latest' };
    if (path === '/about') return { route: 'about' };
    if (path === '/conferences') return { route: 'conferences' };
    if (path === '/admin') return { route: 'admin' };
    if (path === '/quotes') return { route: 'quotes' };
    const m = path.match(/^\/entry\/([\w-]+)$/);
    if (m) return { route: 'entry', key: m[1] };
    return { route: 'home' };
  }
  function getQuery() {
    const out = {};
    const sp = new URLSearchParams(location.search);
    for (const [k, v] of sp.entries()) out[k] = v;
    return out;
  }
  function setMeta({ title, description, url, type, lastUpdated }) {
    const site = SITE();
    if (!title) title = site.name;
    if (!description) description = site.description;
    const fullUrl = site.url + (url || '/');
    document.title = `${title} — ${site.name}`;
    setOrCreateMeta('name', 'description', description);
    setOrCreateMeta('property', 'og:title', `${title} — ${site.name}`);
    setOrCreateMeta('property', 'og:description', description);
    setOrCreateMeta('property', 'og:url', fullUrl);
    setOrCreateMeta('property', 'og:type', type || 'website');
    setOrCreateMeta('property', 'og:site_name', site.name);
    if (lastUpdated) setOrCreateMeta('property', 'article:modified_time', lastUpdated);
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', `${title} — ${site.name}`);
    setOrCreateMeta('name', 'twitter:description', description);
    setOrCreateLink('canonical', fullUrl);
    setOrCreateJsonLd({ title, description, url: fullUrl, type: type || 'website', lastUpdated, siteName: site.name, siteUrl: site.url });
  }
  function setOrCreateMeta(attr, key, value) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }
  function setOrCreateLink(rel, href) {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
    el.setAttribute('href', href);
  }
  let jsonLdEl = null;
  function setOrCreateJsonLd({ title, description, url, type, lastUpdated, siteName, siteUrl }) {
    const data = { '@context': 'https://schema.org', '@type': type === 'article' ? 'Article' : 'WebSite', name: title, headline: title, description, url, publisher: { '@type': 'Organization', name: siteName, url: siteUrl } };
    if (type === 'article') {
      data.datePublished = lastUpdated || '2024-01-01';
      data.dateModified = lastUpdated || new Date().toISOString().slice(0, 10);
      data.author = { '@type': 'Organization', name: siteName };
      data.mainEntityOfPage = { '@type': 'WebPage', '@id': url };
    }
    if (!jsonLdEl) { jsonLdEl = document.createElement('script'); jsonLdEl.type = 'application/ld+json'; document.head.appendChild(jsonLdEl); }
    jsonLdEl.textContent = JSON.stringify(data);
  }

  function render() {
    if (!state.loaded) {
      document.getElementById('main').innerHTML = '<p style="color:var(--ink-faint);">Loading…</p>';
      return;
    }
    const { route, key } = getRoute();
    const q = getQuery();
    state.activePrimaryTopic = q.topic || null;
    state.activeDomain = q.domain || null;
    const main = document.getElementById('main');
    const site = SITE();

    if (route === 'entry' && key) {
      const entry = state.entries[key];
      main.innerHTML = renderEntry(key);
      renderSidebar(key);
      if (F().comments) { loadComments(key); wireCommentForm(key); }
      setMeta(entry ? { title: entry.title, description: (entry.summary || '').split('\n')[0] || entry.title, url: '/entry/' + key, type: 'article', lastUpdated: entry.lastUpdated } : { title: 'Not Found', description: '', url: '/entry/' + key });
    } else if (route === 'latest') {
      main.innerHTML = renderLatest();
      renderSidebar(null);
      setMeta({ title: 'Latest developments', description: 'Entries updated in the last 30 days, sorted by signal.', url: '/latest' });
      wireFilterChips();
    } else if (route === 'conferences') {
      main.innerHTML = renderConferences();
      renderSidebar(null);
      setMeta({ title: 'Conference proceedings', description: 'Papers from INCOSE IS, IW, and regional events.', url: '/conferences' });
    } else if (route === 'about') {
      main.innerHTML = renderAbout();
      renderSidebar(null);
      setMeta({ title: 'About', description: 'About Tech Scan.', url: '/about' });
    } else if (route === 'admin') {
      main.innerHTML = F().admin ? renderAdmin() : '<p>Admin disabled.</p>';
      renderSidebar(null);
      setMeta({ title: 'Admin', description: 'Maintainer view.', url: '/admin' });
      if (F().admin) loadAllComments();
    } else if (route === 'quotes') {
      main.innerHTML = '<h1>Quotes</h1><p>Quotes are disabled in Tech Scan.</p>';
      renderSidebar(null);
    } else {
      // home
      main.innerHTML = renderHome();
      renderSidebar(null);
      setMeta({ title: site.name, description: site.description, url: '/' });
      wireFilterChips();
    }
    window.scrollTo(0, 0);
  }
  window.__appRender = render;

  function wireFilterChips() {
    const bar = document.querySelector('.filter-bar');
    if (!bar) return;
    bar.querySelectorAll('.triage-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const t = chip.dataset.triage;
        state.activeTriage = t === 'all' ? null : t;
        render();
      });
    });
  }

  // ===== Init =====
  async function init() {
    await loadAll();
    render();
    wireMobileSearch();
  }
  window.addEventListener('popstate', render);
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || a.target) return;
    if (!/^(\/|about|latest|conferences|admin|quotes|entry\/|index\.html|\?)/.test(href)) return;
    e.preventDefault();
    let path = href;
    // Separate query string if any
    let search = '';
    const qi = path.indexOf('?');
    if (qi >= 0) { search = path.slice(qi); path = path.slice(0, qi); }
    if (path === '') path = '/';
    if (path.startsWith('index.html')) path = '/';
    history.pushState(null, '', path + (search || ''));
    // Close mobile panel on nav
    document.querySelector('.shell')?.classList.remove('panel-open');
    render();
  });
  init();
})();
