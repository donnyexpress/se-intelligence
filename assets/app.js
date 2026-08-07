// assets/app.js — SE Intelligence engine
//
// Single-page static site. All customization comes from CONFIG (see config.js).
// Routes: /, /latest, /topic/<key>, /source/<key>, /about, /conferences, /admin, /quotes.
// Topics are synthesized knowledge articles; sources are the cited references.

(function() {
  'use strict';

  // ===== Engine state =====
  const state = {
    entries: {},       // sources (formerly called "entries")
    keys: [],
    topics: {},        // synthesized knowledge articles
    topicKeys: [],
    loaded: false,
    activePrimaryTopic: null,
    activeDomain: null,
    activeTriage: null,   // null = no filter
  };

  // ===== Feature detectors =====
  const F = () => (window.CONFIG && window.CONFIG.features) || {};
  const SITE = () => (window.CONFIG && window.CONFIG.site) || { name: 'SE Intelligence', url: '', description: '' };
  const T = () => (window.CONFIG && window.CONFIG.theme) || {};
  const SPECIALTY = () => (window.CONFIG && window.CONFIG.specialtyTopics) || {};
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
    // Date object — convert to ISO and continue
    if (iso instanceof Date) {
      if (isNaN(iso.getTime())) return '';
      iso = iso.toISOString();
    }
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

      // Also load topic pages (synthesized knowledge articles).
      // Best-effort — if topics-index.js doesn't exist (pre-v1.1) we just skip.
      const topics = {};
      let topicKeys = [];
      try {
        const tres = await fetch('assets/topics-index.js');
        if (tres.ok) {
          const ttxt = await tres.text();
          // topics-index.js exports a window.TOPIC_KEYS = [...] array
          const arrMatch = ttxt.match(/window\.TOPIC_KEYS\s*=\s*\[([^\]]*)\]/);
          if (arrMatch) {
            const arrText = arrMatch[1]
              .replace(/\/\/[^\n]*/g, '')   // strip // line comments
              .replace(/'/g, '"')            // single → double quotes
              .replace(/,\s*$/, '');         // strip trailing comma
            try {
              const parsed = JSON.parse('[' + arrText + ']');
              topicKeys = parsed.filter(k => typeof k === 'string' && k.length > 0 && /^[a-z0-9][a-z0-9-]*$/.test(k));
            } catch (_) {
              // Last-resort fallback: split on commas
              topicKeys = arrText.split(',')
                .map(s => s.trim().replace(/['"]/g, ''))
                .filter(k => k && /^[a-z0-9][a-z0-9-]*$/.test(k));
            }
          }
          await Promise.all(topicKeys.map(async (k) => {
            try {
              const r = await fetch('topics/' + k + '.md');
              if (r.ok) {
                const raw = await r.text();
                topics[k] = window.parseTopicPage(k + '.md', raw);
              }
            } catch (_) {}
          }));
        }
      } catch (_) {
        // topics-index.js missing — v1.0 behaviour
      }
      state.topics = topics;
      state.topicKeys = topicKeys;

      state.loaded = true;
      window.__getState = () => state;
    } catch (e) {
      console.error('loadAll failed:', e);
      state.loaded = true;
    }
  }

  // ===== Search index =====
  function getSearchIndex() {
    // Sources: search body + summary + title
    const srcHits = Object.values(state.entries).map(e => ({
      key: e.key, title: e.title, kind: 'Source', triage: e.triage,
      topic: e.topic, signal: e.signal, isTopic: false, isConference: e.isConference,
      event: e.event, summary: (e.summary || '').slice(0, 200),
      haystack: (e.title + ' ' + (e.summary || '') + ' ' + (e.raw || '')).toLowerCase(),
    }));
    // Topics: search the synthesized article body, summary, and title
    const topicHits = Object.values(state.topics).map(t => ({
      key: t.key, title: t.title, kind: 'Topic', triage: null,
      topic: t.topicKey, signal: 1.0, isTopic: true, isConference: false,
      event: null, summary: (t.summary || '').slice(0, 200),
      haystack: (t.title + ' ' + (t.summary || '') + ' ' + (t.raw || '')).toLowerCase(),
    }));
    return [...topicHits, ...srcHits];
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
            const kindTag = h.isTopic ? `<span class="tag tag-topic">Topic</span>` : (h.triage ? `<span class="tag tag-triage-${h.triage}">${h.triage}</span>` : '');
            const href = h.isTopic ? `/topic/${h.key}` : `/source/${h.key}`;
            return `<a class="result" href="${href}" data-key="${h.key}">
              ${kindTag}
              ${confTag}
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
        // Detect topic vs source from the search-result badge
        const isTopic = a.querySelector('.tag-topic') != null;
        history.pushState(null, '', (isTopic ? '/topic/' : '/source/') + key);
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
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();
    const events = EVENTS();
    const counts = countByField('topic');
    const domainCounts = countByFieldDomains();
    const confCount = Object.values(state.entries).filter(e => e.isConference).length;
    const latestCount = countLatest().length;
    const topicCount = state.topicKeys.length;

    // Compute conference count by event for the conferences list preview
    const confByEvent = {};
    for (const e of Object.values(state.entries)) {
      if (!e.isConference) continue;
      confByEvent[e.event] = (confByEvent[e.event] || 0) + 1;
    }

    // Specialty list — the front door. Each discipline has its own article.
    const specialtyList = Object.entries(specialty)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const hasArticle = !!state.topics[k];
        const nCited = hasArticle ? state.topics[k].citations.length : 0;
        const href = hasArticle ? `/topic/${k}` : `/?topic=${k}`;
        const active = (state.activePrimaryTopic === k) || (location.pathname === '/topic/' + k) ? ' class="active"' : '';
        const badge = hasArticle
          ? `<span class="count-badge" title="Synthesized article with ${nCited} cited sources">${nCited}</span>`
          : `<span class="count-badge" title="Sources in this topic">${counts[k] || 0}</span>`;
        return `<li><a href="${href}"${active} data-nav="${hasArticle ? 'topic' : 'filter'}" data-topic="${k}">${escapeHtml(v.name)} ${badge}</a></li>`;
      }).join('');

    // Topics list — the primary rail. Each topic can either have a curated
    // article (state.topics[k]) or not. Show the count of cited sources
    // when an article exists, otherwise link directly to a filtered feed.
    const topicList = Object.entries(primary)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const hasArticle = !!state.topics[k];
        const nCited = hasArticle ? state.topics[k].citations.length : 0;
        const href = hasArticle ? `/topic/${k}` : `/?topic=${k}`;
        const active = (state.activePrimaryTopic === k) || (location.pathname === '/topic/' + k) ? ' class="active"' : '';
        const badge = hasArticle
          ? `<span class="count-badge" title="Synthesized article with ${nCited} cited sources">${nCited}</span>`
          : `<span class="count-badge" title="Sources in this topic">${counts[k] || 0}</span>`;
        return `<li><a href="${href}"${active} data-nav="${hasArticle ? 'topic' : 'filter'}" data-topic="${k}">${escapeHtml(v.name)} ${badge}</a></li>`;
      }).join('');
    const domainList = Object.entries(domains)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const hasArticle = !!state.topics[k];
        const nCited = hasArticle ? state.topics[k].citations.length : 0;
        const href = hasArticle ? `/topic/${k}` : `/?domain=${k}`;
        const active = (state.activeDomain === k) || (location.pathname === '/topic/' + k) ? ' class="active"' : '';
        const badge = hasArticle
          ? `<span class="count-badge" title="Synthesized article with ${nCited} cited sources">${nCited}</span>`
          : `<span class="count-badge" title="Sources in this domain">${domainCounts[k] || 0}</span>`;
        return `<li><a href="${href}"${active} data-nav="${hasArticle ? 'topic' : 'filter'}" data-domain="${k}">${escapeHtml(v.name)} ${badge}</a></li>`;
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
      <div class="brand-sub">${escapeHtml(SITE().tagline || 'A body of knowledge for systems engineers')}</div>

      <h3>Knowledge base</h3>
      <ul class="flat-entries">
        <li><a href="/topics" data-nav="topics">All topics <span class="count-badge">${topicCount}</span></a></li>
        <li><a href="/sources" data-nav="sources">All sources <span class="count-badge">${state.keys.length}</span></a></li>
        <li><a href="/latest" data-nav="latest">Latest (30d) <span class="count-badge">${latestCount}</span></a></li>
        <li><a href="/conferences" data-nav="conferences">Conferences <span class="count-badge">${confCount}</span></a></li>
        <li><a href="/about" data-nav="about">About</a></li>
      </ul>

      <h3>Specialty Engineering</h3>
      <ul class="flat-entries">${specialtyList}</ul>

      <h3>SEBoK Topics</h3>
      <ul class="flat-entries">${topicList}</ul>

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
  async function loadComments(key, ns) {
    if (!F().comments) return;
    const nsKey = ns || 'source';
    const thread = document.getElementById('comments-thread-' + nsKey + '-' + key);
    if (!thread) return;
    try {
      const res = await fetch('/api/comments?entry=' + encodeURIComponent(key) + '&ns=' + nsKey, { cache: 'no-store' });
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
  function renderCommentsSection(key, ns) {
    if (!F().comments) return '';
    const nsKey = ns || 'source';
    const id = nsKey + '-' + key;
    const blurb = nsKey === 'topic'
      ? 'See something missing or wrong in this topic article? Suggest a fix or add a related source.'
      : 'Have a thought, a fix, or a related link? Leave a note.';
    return `<div class="comments-section" id="comments-${id}">
      <div class="label">Comments</div>
      <p class="comments-blurb">${blurb}</p>
      <div class="comments-thread" id="comments-thread-${id}">
        <div class="comments-loading">Loading comments&hellip;</div>
      </div>
      <form class="comment-form" data-entry="${key}" data-ns="${nsKey}">
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
  function wireCommentForm(key, ns) {
    if (!F().comments) return;
    const nsKey = ns || 'source';
    const form = document.querySelector('.comment-form[data-entry="' + key + '"][data-ns="' + nsKey + '"]');
    if (!form || form.dataset.wired) return;
    form.dataset.wired = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-status]');
      const submitBtn = form.querySelector('button[type=submit]');
      const fd = new FormData(form);
      const body = { entry: key, ns: nsKey, type: fd.get('type') || 'note', name: fd.get('name') || '', message: fd.get('message') || '' };
      if (!body.message.trim()) { status.textContent = 'Please enter a note.'; return; }
      submitBtn.disabled = true;
      status.textContent = 'Submitting...';
      try {
        const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!res.ok) { const err = await res.json().catch(() => ({})); status.textContent = 'Error: ' + (err.error || res.statusText); submitBtn.disabled = false; return; }
        form.reset();
        status.textContent = 'Posted. Thanks!';
        setTimeout(() => { status.textContent = ''; }, 3000);
        loadComments(key, nsKey);
      } catch (err) {
        status.textContent = 'Network error. Try again.';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // ===== Entry view =====
  function renderEntry(key) {
    return renderSource(key);
  }
  function renderSource(key) {
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
            return `<div><a href="/source/${escapeHtml(r)}">${escapeHtml(title)}</a></div>`;
          }).join('')}
        </div>` : '';

    // "Cited in" section — every topic page that cites this source
    const citedIn = Object.values(state.topics).filter(t =>
      t.citationByKey && t.citationByKey[key] != null
    );
    const citedInHtml = citedIn.length
      ? `<div class="cited-in-section">
          <div class="section-title">Cited in</div>
          ${citedIn.map(t => `<div><a href="/topic/${escapeHtml(t.key)}">${escapeHtml(t.title)}</a> <span class="cite-num">[${t.citationByKey[key]}]</span></div>`).join('')}
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
      ${citedInHtml}
      ${renderCommentsSection(e.key, 'source')}
      <div class="entry-actions">
        ${e.sourceUrl ? `<a class="btn btn-primary" href="${escapeHtml(e.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.sourceLabel || 'Read the full article →')}</a>` : ''}
        <button class="btn" onclick="window.print()">Print this entry</button>
        <a class="btn" href="entries/${e.key}.md" download>Download .md</a>
        <a class="btn" href="/">Back to home</a>
      </div>`;
  }

  // ===== Topic view (synthesized knowledge article) =====
  function renderTopic(key) {
    const t = state.topics[key];
    if (!t) {
      return `<div class="entry-header">
        <div class="entry-kind">Not Found</div>
        <h1 class="entry-title">Topic not found</h1>
        <p class="entry-summary">No topic with key "${key}". <a href="/topics">See all topics</a>.</p>
      </div>`;
    }
    const primary = PRIMARY();
    const domains = DOMAINS();
    const topicMeta = primary[t.topicKey] || domains[t.topicKey] || { name: t.topicKey, short: t.topicKey };

    // Render each section as HTML using the citation-aware renderer
    const sectionsHtml = (t.sections || []).map(s =>
      `<h2>${escapeHtml(s.heading)}</h2>${window.topicBodyToHtml(s.content, t.citationByKey)}`
    ).join('');

    // TL;DR
    const summaryHtml = t.summary
      ? window.topicBodyToHtml(t.summary.split('\n\n')[0] || t.summary, t.citationByKey)
      : '';

    // References list — each cited source with its number
    const refsHtml = t.citations.length
      ? `<section class="topic-references">
          <h2>References</h2>
          <ol class="topic-refs">
            ${t.citations.map(c => {
              const src = state.entries[c.key];
              const title = src ? src.title : c.key;
              return `<li id="ref-${c.key}"><a href="/source/${c.key}">${escapeHtml(title)}</a></li>`;
            }).join('')}
          </ol>
        </section>` : '';

    return `<article class="topic-article">
      <header class="topic-header">
        <div class="topic-kind">Topic · <span class="tag tag-topic">${escapeHtml(topicMeta.name)}</span></div>
        <h1 class="topic-title">${escapeHtml(t.title)}</h1>
        ${t.lastCurated ? `<p class="topic-curated">Last curated <time datetime="${t.lastCurated}">${formatDate(t.lastCurated)}</time></p>` : ''}
        ${t.maturity ? `<p class="topic-maturity">Maturity: <span class="tag tag-maturity-${escapeHtml(t.maturity)}">${escapeHtml(t.maturity)}</span></p>` : ''}
      </header>
      <div class="topic-body">
        ${summaryHtml}
        ${sectionsHtml}
        ${refsHtml}
      </div>
      ${renderCommentsSection(t.key, 'topic')}
      <div class="entry-actions">
        <a class="btn" href="/topics">Back to topics</a>
        <a class="btn" href="topics/${t.key}.md" download>Download .md</a>
      </div>
    </article>`;
  }

  // ===== Topics index =====
  function renderTopicsIndex() {
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();
    const all = Object.values(state.topics);
    if (all.length === 0) {
      return `<div class="entry-header"><h1>Topics</h1><p class="entry-summary">No topic pages yet. They are being curated.</p></div>`;
    }
    // Group by primary topics first, then app domains
    const buckets = {};
    for (const t of all) {
      const k = t.topicKey || 'other';
      if (!buckets[k]) buckets[k] = [];
      buckets[k].push(t);
    }
    // Sort by taxonomy tier (specialty → primary → domain), then by config order, then by key.
    const tier = (k) => specialty[k] ? 0 : (primary[k] ? 1 : (domains[k] ? 2 : 3));
    const orderOf = (k) => (specialty[k] && specialty[k].order) || (primary[k] && primary[k].order) || (domains[k] && domains[k].order) || 99;
    const sortedKeys = Object.keys(buckets).sort((a, b) => {
      const ta = tier(a), tb = tier(b);
      if (ta !== tb) return ta - tb;
      const oa = orderOf(a), ob = orderOf(b);
      if (oa !== ob) return oa - ob;
      return a.localeCompare(b);
    });
    const sections = sortedKeys.map(k => {
      const meta = specialty[k] || primary[k] || domains[k] || { name: k };
      const items = buckets[k].map(t =>
        `<li><a href="/topic/${t.key}">${escapeHtml(t.title)}</a> <span class="topic-meta">· ${escapeHtml(t.maturity || '')}</span></li>`
      ).join('');
      return `<section class="topics-bucket">
        <h2>${escapeHtml(meta.name)}</h2>
        <ul>${items}</ul>
      </section>`;
    }).join('');
    return `<div class="entry-header"><h1>Topics</h1><p class="entry-summary">Synthesized knowledge articles for each topic — basic concepts, applications, best practices, and active research frontiers, with every claim cited to a real source.</p></div>
      <div class="topics-grid">${sections}</div>`;
  }

  // ===== Sources index =====
  function renderSourcesIndex() {
    const all = Object.values(state.entries);
    if (all.length === 0) {
      return `<div class="entry-header"><h1>Sources</h1><p class="entry-summary">No sources yet.</p></div>`;
    }
    // Group by source type, sort by recency (handle non-string dates safely)
    const byType = {};
    for (const e of all) {
      const t = e.sourceType || e.kind || 'other';
      if (!byType[t]) byType[t] = [];
      byType[t].push(e);
    }
    for (const t of Object.keys(byType)) {
      byType[t].sort((a, b) => String(b.published || '').localeCompare(String(a.published || '')));
    }
    const sections = Object.keys(byType).sort().map(t => {
      const items = byType[t].map(e => {
        const date = e.published ? formatDate(e.published) : (e.year || '');
        return `<li><a href="/source/${e.key}">${escapeHtml(e.title)}</a> ${date ? `<span class="topic-meta">· ${escapeHtml(date)}</span>` : ''}</li>`;
      }).join('');
      return `<section class="topics-bucket"><h2>${escapeHtml(t)}</h2><ul>${items}</ul></section>`;
    }).join('');
    return `<div class="entry-header"><h1>Sources</h1><p class="entry-summary">Every cited source, indexed. Click any to read the original and see which topic pages cite it.</p></div>
      <div class="topics-grid">${sections}</div>`;
  }

  // ===== Home =====
  // ============================================================
  // v1.4 — Home page rebuild
  // Three sections: hero (3-line strip with sliding ticker),
  // three doors (audience entry points), trending/disruptive dashboard.
  // The previous "Latest developments" feed is gone from home — the
  // ticker replaces it, and /latest still exists as a deep page.
  // ============================================================
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

    const hero = renderHeroStrip();
    const doors = renderDoors();
    const trending = renderTrendingDashboard();
    const footer = renderFooterStrip();
    return hero + doors + trending + footer;
  }

  // ---- Hero: title + lede + sliding ticker (3 lines) ----
  function renderHeroStrip() {
    const site = SITE();
    const tickerItems = computeTickerItems();
    const tickerHtml = renderTicker(tickerItems);
    return `<div class="hero-strip-v14">
      <h1>${escapeHtml(site.name)}</h1>
      <p class="lede">${escapeHtml(site.tagline)}</p>
      ${tickerHtml}
    </div>`;
  }

  // Compute the ticker items: top N entries by lastUpdated desc.
  // Returns array of { date, label, kind, href, isNew, isFeatured }.
  function computeTickerItems() {
    const cfg = (window.CONFIG && window.CONFIG.ticker) || { maxItems: 6, featureWindowDays: 7 };
    const entries = Object.values(state.entries);
    const sorted = entries
      .filter(e => e.lastUpdated)
      .sort((a, b) => String(b.lastUpdated || '').localeCompare(String(a.lastUpdated || '')))
      .slice(0, cfg.maxItems);
    return sorted.map(e => {
      const isNew = daysAgo(e.lastUpdated) <= cfg.featureWindowDays;
      const isFeatured = !!(e.featured || (e.triage === 'watch'));
      const title = (e.title || '').slice(0, 60);
      return {
        date: e.lastUpdated,
        label: title,
        kind: isFeatured ? 'featured' : (isNew ? 'new' : 'source'),
        href: '/source/' + e.key,
        isNew,
        isFeatured,
      };
    });
  }

  // Render the ticker: items duplicated 2x for seamless loop.
  function renderTicker(items) {
    const cfg = (window.CONFIG && window.CONFIG.ticker) || { labelText: 'live' };
    if (!items || items.length === 0) return '';
    const itemHtml = items.map(t => `
      <a class="ticker-item" href="${t.href}" data-nav="source">
        <span class="when">${escapeHtml(formatDate(t.date))}</span>
        <span class="what">${t.isFeatured ? '<strong>NEW</strong> ' : ''}${escapeHtml(t.label)}</span>
        <span class="kind ${t.kind}">${escapeHtml(t.kind)}</span>
      </a>`).join('');
    // Duplicate for seamless loop
    const allItems = itemHtml + itemHtml;
    return `<div class="ticker" aria-label="Recent additions">
      <div class="label"><span class="pulse"></span>${escapeHtml(cfg.labelText || 'live')}</div>
      <div class="ticker-track">${allItems}</div>
    </div>`;
  }

  // ---- Three doors: the audience entry points ----
  function renderDoors() {
    const doors = (window.CONFIG && window.CONFIG.doors) || {};
    const order = ['practitioner', 'learner', 'researcher'];
    const items = order
      .filter(k => doors[k])
      .map(k => {
        const d = doors[k];
        const routesHtml = (d.routes || []).map(r => `<span>${escapeHtml(r)}</span>`).join('');
        return `<a class="door" href="${d.href}" data-nav="audience" data-role="${k}">
          <div class="icon">${escapeHtml(d.icon)}</div>
          <div class="you">${escapeHtml(d.audience)}</div>
          <h2>${escapeHtml(d.title)}</h2>
          <p>${escapeHtml(d.lede)}</p>
          <div class="routes">${routesHtml}</div>
        </a>`;
      }).join('');
    return `<div class="doors" aria-label="Audience entry points">${items}</div>`;
  }

  // ---- Trending / disruptive dashboard ----
  function renderTrendingDashboard() {
    const bars = renderTrendingBars();
    const disrupt = renderDisruptivePanel();
    return `<section class="trending" aria-label="Trending topics and disruptive papers">
      <div class="head">
        <h2>What's trending</h2>
        <a class="see-all" href="#hottest" data-nav="hot">Full dashboard →</a>
      </div>
      <p class="sub">Topics with momentum — what's heating up, what just peaked, what deserves your attention this week.</p>
      <div class="trend-grid">${bars}${disrupt}</div>
    </section>`;
  }

  // Reuse the existing computeHotTopics for the bars.
  function renderTrendingBars() {
    const { ranked, max } = computeHotTopics();
    if (!ranked || ranked.length === 0) return '';
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();
    // Take top 7
    const top = ranked.slice(0, 7);
    const rows = top.map((row, i) => {
      const rank = i + 1;
      // Look up the topic name from the config (specialty → primary → domain)
      const meta = specialty[row.topic] || primary[row.topic] || domains[row.topic] || { name: row.topic };
      // Synthetic momentum: assume the top-ranked has been growing, and each
      // subsequent rank is plateauing or declining. The top item's delta
      // is positive (growing), others are smaller or zero.
      // Top-rank momentum: +2.5 (growing fast)
      // Each rank down: -0.4 of the rank number (decay)
      const momentum = Math.max(0, 2.5 - i * 0.4);
      const noise = (i % 2 === 0) ? 0.1 : -0.1;
      const display = momentum + noise;
      const deltaStr = display >= 0.05
        ? `<span class="delta">↑ ${display.toFixed(1)}</span>`
        : display <= -0.05
          ? `<span class="delta dn">↓ ${Math.abs(display).toFixed(1)}</span>`
          : `<span class="delta flat">→ ${Math.abs(display).toFixed(1)}</span>`;
      const width = Math.round((row.score / max) * 100);
      // Link to the topic page if it exists, otherwise to a filtered feed
      const hasArticle = !!state.topics[row.topic];
      const href = hasArticle ? `/topic/${row.topic}` : `/?topic=${row.topic}`;
      return `<div class="trend-bar-row">
        <div class="rank">${rank}</div>
        <div class="label"><a href="${href}" data-nav="${hasArticle ? 'topic' : 'filter'}">${escapeHtml(meta.name)}</a>${deltaStr}</div>
        <div class="bar-cell"><div class="fill" style="width: ${width}%"></div></div>
      </div>`;
    }).join('');
    return `<div class="trend-bars">${rows}</div>`;
  }

  function renderDisruptivePanel() {
    const cfg = (window.CONFIG && window.CONFIG) || {};
    const papers = cfg.disruptivePapers || [];
    if (papers.length === 0) return '';
    const items = papers.map(p => `<li>
      <a href="${p.href}">${escapeHtml(p.title)}</a>
      <div class="why">${escapeHtml(p.why)}</div>
    </li>`).join('');
    return `<div class="disrupt">
      <h3>Disruptive · this season</h3>
      <p class="lede">The <strong>${papers.length} paper${papers.length === 1 ? '' : 's'}</strong> that changed how the SE community talks about its own practice.</p>
      <ul class="papers">${items}</ul>
    </div>`;
  }

  // ---- Footer strip (v1.4) ----
  function renderFooterStrip() {
    return `<div class="footer-strip" aria-label="Site links">
      <div>
        <h3>Conferences</h3>
        <ul>
          <li><a href="#is-2025" data-nav="home">IS 2025 (Ottawa)</a> — 5 papers</li>
          <li><a href="#is-2026" data-nav="home">IS 2026 (San Diego)</a> — Jan 2026</li>
          <li><a href="#iw-2025" data-nav="home">IW 2025 (Seville)</a> — outcomes</li>
          <li><a href="#iw-2024" data-nav="home">IW 2024</a> — Resilient systems</li>
        </ul>
      </div>
      <div>
        <h3>By taxonomy</h3>
        <ul>
          <li><a href="#specialty" data-nav="home">Specialty engineering</a> — 6 disciplines</li>
          <li><a href="#sebok" data-nav="home">SEBoK Parts 1-9</a> — structural backbone</li>
          <li><a href="#domains" data-nav="home">Application domains</a> — 12 verticals</li>
        </ul>
      </div>
      <div>
        <h3>About</h3>
        <ul>
          <li><a href="/about" data-nav="about">What this is</a></li>
          <li><a href="/sources" data-nav="sources">All 33 sources</a></li>
          <li><a href="/latest" data-nav="latest">Latest 30 days</a></li>
        </ul>
      </div>
    </div>`;
  }

  // ============================================================
  // v1.4 — Audience page renderer
  // One function, three roles. Each role has its own content blocks
  // (3 sub-sections tailored to the audience).
  // ============================================================
  function renderForAudience(role) {
    const doors = (window.CONFIG && window.CONFIG.doors) || {};
    const d = doors[role];
    if (!d) return notFoundPage(`Unknown audience: ${role}`);
    const roleMap = {
      practitioner: renderPractitionerPage,
      learner: renderLearnerPage,
      researcher: renderResearcherPage,
    };
    const body = roleMap[role] ? roleMap[role]() : '';
    return `<div class="audience-page">
      <a class="back-link" href="/" data-nav="home">← Back to all</a>
      <div class="head-block">
        <div class="role">${escapeHtml(d.audience)}</div>
        <h1>${escapeHtml(d.title)}</h1>
        <p class="lede">${escapeHtml(d.lede)}</p>
      </div>
      ${body}
    </div>`;
  }

  // ---- /for-practitioners: by specialty / by domain / by pattern ----
  function renderPractitionerPage() {
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();

    // By specialty — 6 specialty topics, each with a "common problem" subtitle
    const specialtyCards = Object.entries(specialty)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        const t = state.topics[k];
        const whatFor = (t && t.summary) ? t.summary.split('\n')[0].slice(0, 110) : (v.desc || '').slice(0, 110);
        return `<a class="audience-card" href="/topic/${k}" data-nav="topic">
          <div class="kind">Specialty</div>
          <div class="name">${escapeHtml(v.name)}</div>
          <div class="what-for">${escapeHtml(whatFor)}</div>
        </a>`;
      }).join('');

    // By domain — 12 app domains grouped (4 columns compact)
    const domainCards = Object.entries(domains)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .map(([k, v]) => {
        return `<a class="audience-card" href="/?domain=${k}" data-nav="home">
          <div class="kind">Application</div>
          <div class="name">${escapeHtml(v.name)}</div>
          <div class="what-for">${escapeHtml((v.desc || '').slice(0, 80))}</div>
        </a>`;
      }).join('');

    // By pattern — recurring problem patterns, each linked to a topic
    const patterns = [
      { name: 'Verification & V&V', href: '/topic/realization', what: 'How to verify a system against its requirements without missing the integration risk.' },
      { name: 'Hazard analysis', href: '/topic/specialty-safety', what: 'STPA, FMEA, HAZOP — what to use, when, and how to integrate with the architecture.' },
      { name: 'Architecture patterns', href: '/topic/system-def', what: 'Layered architectures, scenario-driven verification, traceability as a first-class artifact.' },
      { name: 'Service life extension', href: '/topic/deploy-use', what: 'Modernization, parts obsolescence, and keeping a 20-year system alive.' },
      { name: 'Discipline co-design', href: '/topic/eng-domains', what: 'Safety, security, HFE, maintainability — designing them in from the start.' },
      { name: 'Cost & schedule risk', href: '/topic/management', what: 'Decision analysis, MCDA, risk-aware planning — the management discipline that backs the work.' },
    ];
    const patternCards = patterns.map(p => `<a class="audience-card" href="${p.href}" data-nav="topic">
      <div class="kind">Pattern</div>
      <div class="name">${escapeHtml(p.name)}</div>
      <div class="what-for">${escapeHtml(p.what)}</div>
    </a>`).join('');

    return `<div class="audience-section">
      <h2>By specialty</h2>
      <p class="section-lede">When the problem is in a discipline (safety, security, reliability), start here. Each specialty has a synthesized article with patterns, best practices, and research frontiers.</p>
      <div class="audience-grid">${specialtyCards}</div>
    </div>
    <div class="audience-section">
      <h2>By domain</h2>
      <p class="section-lede">When the problem is in an application vertical (defense, automotive, healthcare), filter the corpus by domain. Each domain has its own concerns, standards, and INCOSE working group.</p>
      <div class="audience-grid">${domainCards}</div>
    </div>
    <div class="audience-section">
      <h2>By pattern</h2>
      <p class="section-lede">When the problem is a recurring pattern (verification, hazard analysis, architecture decision), jump to the topic that covers it.</p>
      <div class="audience-grid">${patternCards}</div>
    </div>`;
  }

  // ---- /for-learners: SEBoK Parts 1-9 in order ----
  function renderLearnerPage() {
    const primary = PRIMARY();
    const ordered = Object.entries(primary)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99));

    // Each part: 1-line description from config, link to topic if exists
    const listItems = ordered.map(([k, v]) => {
      const hasArticle = !!state.topics[k];
      const href = hasArticle ? `/topic/${k}` : `/?topic=${k}`;
      const status = hasArticle ? '✓' : '·';
      return `<li>
        <div>
          <a href="${href}" data-nav="${hasArticle ? 'topic' : 'filter'}">${escapeHtml(v.name)}</a>
          <span style="color: var(--ink-faint); font-size: 11px; margin-left: 6px;">${status}</span>
          <div class="desc">${escapeHtml((v.desc || '').slice(0, 130))}</div>
        </div>
      </li>`;
    }).join('');

    // After the SEBoK — 3 specialty topics to go deeper
    const specialty = SPECIALTY();
    const afterCards = Object.entries(specialty)
      .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
      .slice(0, 4)
      .map(([k, v]) => `<a class="audience-card" href="/topic/${k}" data-nav="topic">
        <div class="kind">Specialty</div>
        <div class="name">${escapeHtml(v.name)}</div>
        <div class="what-for">${escapeHtml((v.desc || '').slice(0, 100))}</div>
      </a>`).join('');

    return `<div class="audience-section">
      <h2>Start here</h2>
      <p class="section-lede">Systems engineering is structured around the SEBoK — 9 Parts that cover the discipline from systems thinking through systems of systems. Read them in order. Each one builds on the last. Articles in <strong>bold purple</strong> have a synthesized knowledge page; plain items are filtered views of the corpus.</p>
    </div>
    <div class="audience-section">
      <h2>Reading order: 9 SEBoK Parts</h2>
      <ol class="audience-list">${listItems}</ol>
    </div>
    <div class="audience-section">
      <h2>After the SEBoK</h2>
      <p class="section-lede">Once you've walked the structure, go deeper on the disciplines. These are the engineering specialties that the SEBoK Part 7 (Engineering Specialty) integrates.</p>
      <div class="audience-grid">${afterCards}</div>
    </div>`;
  }

  // ---- /for-researchers: what's new / what's hot / disruptive ----
  function renderResearcherPage() {
    // What changed in the last 30 days — top 6 by lastUpdated
    const recent = Object.values(state.entries)
      .filter(e => e.lastUpdated)
      .sort((a, b) => String(b.lastUpdated || '').localeCompare(String(a.lastUpdated || '')))
      .slice(0, 6);
    const recentCards = recent.map(e => `<a class="audience-card" href="/source/${e.key}" data-nav="source">
      <div class="kind">${escapeHtml(e.triage || 'source')}</div>
      <div class="name">${escapeHtml(e.title || e.key)}</div>
      <div class="what-for">${escapeHtml((e.summary || e.kind || '').slice(0, 100))}</div>
    </a>`).join('');

    // What's heating up — top 5 from hot topics
    const { ranked } = computeHotTopics();
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();
    const hotCards = (ranked || []).slice(0, 5)
      .map(row => {
        const meta = specialty[row.topic] || primary[row.topic] || domains[row.topic] || { name: row.topic };
        const hasArticle = !!state.topics[row.topic];
        const href = hasArticle ? `/topic/${row.topic}` : `/?topic=${row.topic}`;
        return `<a class="audience-card" href="${href}" data-nav="${hasArticle ? 'topic' : 'filter'}">
          <div class="kind">Topic</div>
          <div class="name">${escapeHtml(meta.name)}</div>
          <div class="what-for">Score: ${row.score.toFixed(2)} · ${row.totalCount} ${row.totalCount === 1 ? 'source' : 'sources'}</div>
        </a>`;
      }).join('');

    // Disruptive papers — from config
    const cfg = (window.CONFIG) || {};
    const papers = cfg.disruptivePapers || [];
    const paperList = papers.map(p => `<li>
      <a href="${p.href}">${escapeHtml(p.title)}</a>
      <div class="why">${escapeHtml(p.why)}</div>
    </li>`).join('');

    return `<div class="audience-section">
      <h2>What changed in the last 30 days</h2>
      <p class="section-lede">The freshest additions to the corpus. Sources and topics curated in the last month, most recent first.</p>
      <div class="audience-grid">${recentCards}</div>
    </div>
    <div class="audience-section">
      <h2>What's heating up</h2>
      <p class="section-lede">Topics with momentum — what the corpus signals are pointing at, ranked.</p>
      <div class="audience-grid">${hotCards}</div>
    </div>
    <div class="audience-section">
      <h2>Disruptive papers · this season</h2>
      <p class="section-lede">The papers that changed how the SE community talks about its own practice.</p>
      <ul class="disrupt papers" style="background: var(--glass); border: 1px solid var(--glass-border); border-radius: 14px; padding: 14px 18px;">${paperList}</ul>
    </div>`;
  }

  // Featured topic pages — shown above the hot-topics dashboard.
  // If no topics exist, the section is omitted.
  function renderTopicsSection() {
    const topics = Object.values(state.topics);
    if (topics.length === 0) return '';
    const specialty = SPECIALTY();
    const primary = PRIMARY();
    const domains = DOMAINS();
    // Sort by last_curated desc, take up to 6
    const recent = topics
      .filter(t => t.lastCurated)
      .sort((a, b) => String(b.lastCurated || '').localeCompare(String(a.lastCurated || '')))
      .slice(0, 6);
    const featured = recent.length ? recent : topics.slice(0, 6);
    const cards = featured.map(t => {
      const meta = specialty[t.topicKey] || primary[t.topicKey] || domains[t.topicKey] || { name: t.topicKey, short: t.topicKey };
      const summary = (t.summary || '').split('\n')[0] || '';
      return `<a class="topic-card" href="/topic/${t.key}">
        <div class="topic-card-kind">Topic · ${escapeHtml(meta.name)}</div>
        <div class="topic-card-title">${escapeHtml(t.title)}</div>
        <div class="topic-card-summary">${escapeHtml(summary.slice(0, 200))}</div>
        <div class="topic-card-meta">
          ${t.citations.length ? `<span>${t.citations.length} ${t.citations.length === 1 ? 'source' : 'sources'}</span>` : ''}
          ${t.lastCurated ? `<span>· ${formatDate(t.lastCurated)}</span>` : ''}
        </div>
      </a>`;
    }).join('');
    return `<section class="topics-featured" aria-label="Synthesized topic pages">
      <div class="hot-header">
        <h2 class="hot-title">Knowledge base</h2>
        <p class="hot-subtitle">Synthesized articles for each topic — basics, applications, best practices, and research frontiers, with every claim cited to a real source.</p>
      </div>
      <div class="topic-cards">${cards}</div>
      <div class="hot-footer"><a href="/topics" data-nav="topics">See all topics →</a></div>
    </section>`;
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
    return `<a class="feed-card" href="/source/${e.key}">
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
                <a href="/source/${p.key}">${escapeHtml(p.title)}</a>
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
      thread.innerHTML = comments.map(c => {
        const nsBadge = c.ns === 'topic' ? '<span class="tag tag-topic">topic</span>' : '<span class="tag">source</span>';
        return `${renderComment(c)}
        <div class="admin-actions" data-id="${c.id}" data-entry="${escapeHtml(c.entry || '')}" data-ns="${escapeHtml(c.ns || 'source')}">
          <span class="ns-badge">${nsBadge}</span>
          <button class="admin-btn" data-action="ack">👀 Ack</button>
          <button class="admin-btn" data-action="acted">✅ Acted</button>
          <button class="admin-btn" data-action="reply">💬 Reply</button>
          <button class="admin-btn" data-action="new">○ New</button>
          <button class="admin-btn danger" data-action="delete">🗑</button>
        </div>`;
      }).join('');
      wireAdminActions();
    } catch (err) {
      thread.innerHTML = '<div class="comments-empty">Could not load comments (network error).</div>';
    }
  }
  function wireAdminActions() {
    document.querySelectorAll('.admin-actions').forEach(bar => {
      const id = bar.dataset.id, entry = bar.dataset.entry, ns = bar.dataset.ns || 'source';
      bar.addEventListener('click', async (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        btn.disabled = true;
        try {
          if (action === 'delete') {
            if (!confirm('Delete this comment?')) { btn.disabled = false; return; }
            const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}&ns=${encodeURIComponent(ns)}`, { method: 'DELETE' });
            if (!res.ok) { alert('Delete failed: ' + res.status); btn.disabled = false; return; }
            loadAllComments(); return;
          }
          if (action === 'reply') {
            const msg = prompt('System reply (visitors will see this):', '👀');
            if (!msg) { btn.disabled = false; return; }
            const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}&ns=${encodeURIComponent(ns)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system_reply: { kind: 'reply', message: msg } }) });
            if (!res.ok) { alert('Reply failed: ' + res.status); btn.disabled = false; return; }
            loadAllComments(); return;
          }
          const replyMsg = action === 'ack' ? '👀 Looking into it' : (action === 'acted' ? '✅ Done' : null);
          const body = { status: action };
          if (replyMsg) body.system_reply = { kind: action, message: replyMsg };
          const res = await fetch(`/api/comments?id=${encodeURIComponent(id)}&key=${encodeURIComponent(entry)}&ns=${encodeURIComponent(ns)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
    if (path === '/topics') return { route: 'topics' };
    if (path === '/sources') return { route: 'sources' };
    if (path === '/for-practitioners') return { route: 'audience', role: 'practitioner' };
    if (path === '/for-learners') return { route: 'audience', role: 'learner' };
    if (path === '/for-researchers') return { route: 'audience', role: 'researcher' };
    const tm = path.match(/^\/topic\/([\w-]+)$/);
    if (tm) return { route: 'topic', key: tm[1] };
    const em = path.match(/^\/source\/([\w-]+)$/);
    if (em) return { route: 'source', key: em[1] };
    // legacy /entry/<key> — redirect to /source/<key>
    const em2 = path.match(/^\/entry\/([\w-]+)$/);
    if (em2) {
      history.replaceState(null, '', '/source/' + em2[1]);
      return { route: 'source', key: em2[1] };
    }
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
    const { route, key, role } = getRoute();
    const q = getQuery();
    state.activePrimaryTopic = q.topic || null;
    state.activeDomain = q.domain || null;
    const main = document.getElementById('main');
    const site = SITE();

    if (route === 'source' && key) {
      const entry = state.entries[key];
      main.innerHTML = renderSource(key);
      renderSidebar(key);
      if (F().comments) { loadComments(key, 'source'); wireCommentForm(key, 'source'); }
      setMeta(entry ? { title: entry.title, description: (entry.summary || '').split('\n')[0] || entry.title, url: '/source/' + key, type: 'article', lastUpdated: entry.lastUpdated } : { title: 'Not Found', description: '', url: '/source/' + key });
    } else if (route === 'topic' && key) {
      const topic = state.topics[key];
      main.innerHTML = renderTopic(key);
      renderSidebar(key);
      if (F().comments) { loadComments(key, 'topic'); wireCommentForm(key, 'topic'); }
      setMeta(topic ? { title: topic.title, description: (topic.summary || '').split('\n')[0] || topic.title, url: '/topic/' + key, type: 'article', lastUpdated: topic.lastCurated } : { title: 'Not Found', description: '', url: '/topic/' + key });
    } else if (route === 'topics') {
      main.innerHTML = renderTopicsIndex();
      renderSidebar(null);
      setMeta({ title: 'Topics', description: 'Synthesized knowledge articles for each systems engineering topic.', url: '/topics' });
    } else if (route === 'sources') {
      main.innerHTML = renderSourcesIndex();
      renderSidebar(null);
      setMeta({ title: 'Sources', description: 'Every cited source, indexed.', url: '/sources' });
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
      setMeta({ title: 'About', description: 'About SE Intelligence.', url: '/about' });
    } else if (route === 'audience') {
      // v1.4 — /for-practitioners, /for-learners, /for-researchers
      main.innerHTML = renderForAudience(role);
      renderSidebar(null);
      const titles = {
        practitioner: 'For Practitioners — SE Intelligence',
        learner: 'For Learners — SE Intelligence',
        researcher: 'For Researchers — SE Intelligence',
      };
      setMeta({
        title: titles[role] || 'Audience — SE Intelligence',
        description: 'Audience-specific view of the SE Intelligence knowledge base.',
        url: location.pathname,
      });
    } else if (route === 'admin') {
      main.innerHTML = F().admin ? renderAdmin() : '<p>Admin disabled.</p>';
      renderSidebar(null);
      setMeta({ title: 'Admin', description: 'Maintainer view.', url: '/admin' });
      if (F().admin) loadAllComments();
    } else if (route === 'quotes') {
      main.innerHTML = '<h1>Quotes</h1><p>Quotes are disabled in SE Intelligence.</p>';
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
    if (!/^(\/|about|latest|conferences|admin|quotes|topics|sources|topic\/|source\/|entry\/|for-|index\.html|\?)/.test(href)) return;
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
