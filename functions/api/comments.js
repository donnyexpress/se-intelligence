// functions/api/comments.js — Cloudflare Pages Function for comment storage
//
// Endpoints:
//   GET    /api/comments?entry=<key>&ns=<source|topic>  → list comments for one item
//   GET    /api/comments                                 → list all comments (admin)
//   POST   /api/comments                                 → add a new comment
//   PATCH  /api/comments?id=<id>&key=<key>&ns=<ns>       → update status / add reply
//   DELETE /api/comments?id=<id>&key=<key>&ns=<ns>       → delete a comment
//
// Storage: Cloudflare KV.
//   comment key: `comment:<ns>:<key>:<id>`
//   list key:    `list:<ns>:<key>`
//
// `ns` is one of 'source' (formerly "entry") or 'topic'. Old comments (created
// pre-namespace) live under 'source' since that's what the old URLs pointed to.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...CORS_HEADERS,
    },
  });
}

function bad(msg, status = 400) {
  return json({ error: msg }, status);
}

function makeId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// Validate the comment shape — keep it lightweight
function validate(body) {
  if (!body || typeof body !== 'object') return 'body must be a JSON object';
  const { entry, type, message, ns } = body;
  if (!entry || typeof entry !== 'string') return 'entry (string) required';
  if (!type || typeof type !== 'string') return 'type (string) required';
  if (!message || typeof message !== 'string') return 'message (string) required';
  if (message.length > 4000) return 'message too long (max 4000 chars)';
  if (ns != null && !['source', 'topic'].includes(ns)) return 'ns must be "source" or "topic"';
  return null;
}

// Resolve a namespace, defaulting to 'source' for backward compat.
function resolveNs(raw) {
  if (raw === 'topic' || raw === 'source') return raw;
  return 'source';
}

export async function onRequest(context) {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // POST /api/comments — add a comment
  if (request.method === 'POST') {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return bad('Invalid JSON body');
    }
    const err = validate(body);
    if (err) return bad(err);

    // Best-effort per-IP rate limit: 1 post per 5s. Not a security boundary.
    const ip = (request.headers.get('cf-connecting-ip')
             || request.headers.get('x-forwarded-for')
             || 'unknown').toString().split(',')[0].trim();
    if (ip && ip !== 'unknown') {
      const rlKey = `rl:post:${ip}`;
      const last = await env.COMMENTS_KV.get(rlKey);
      if (last) {
        const lastTs = parseInt(last, 10);
        if (!isNaN(lastTs) && Date.now() - lastTs < 5000) {
          return json({ error: 'Please wait a few seconds before posting again.' }, 429);
        }
      }
      await env.COMMENTS_KV.put(rlKey, String(Date.now()), { expirationTtl: 60 });
    }

    const ns = resolveNs(body.ns);
    const id = makeId();
    const comment = {
      id,
      entry: body.entry,
      ns,
      type: body.type,
      message: body.message,
      name: (body.name || '').toString().slice(0, 80),
      title: (body.title || '').toString().slice(0, 200),
      timestamp: Date.now(),
    };
    const commentKey = `comment:${ns}:${comment.entry}:${id}`;
    const listKey = `list:${ns}:${comment.entry}`;

    // Store the comment
    await env.COMMENTS_KV.put(commentKey, JSON.stringify(comment));

    // Append to the per-entry list
    const listRaw = await env.COMMENTS_KV.get(listKey);
    const list = listRaw ? JSON.parse(listRaw) : [];
    list.unshift(id);
    await env.COMMENTS_KV.put(listKey, JSON.stringify(list));

    return json({ ok: true, comment }, 201);
  }

  // GET /api/comments — list all comments (or by entry)
  if (request.method === 'GET') {
    const url = new URL(request.url);
    const entry = url.searchParams.get('entry');
    const ns = resolveNs(url.searchParams.get('ns'));

    if (entry) {
      // Get comments for one item in a namespace
      const listRaw = await env.COMMENTS_KV.get(`list:${ns}:${entry}`);
      let ids = listRaw ? JSON.parse(listRaw) : [];

      // Back-compat: pre-v1.1 comments were stored under
      // `list:<entry>` and `comment:<entry>:<id>` (no namespace prefix).
      // If we find any, treat them as 'source' namespace and migrate on read.
      if (ns === 'source') {
        const legacyList = await env.COMMENTS_KV.get(`list:${entry}`);
        if (legacyList) {
          const legacyIds = JSON.parse(legacyList);
          // Read each legacy comment; if it has no `ns` field, tag it as 'source'
          const legacyComments = await Promise.all(
            legacyIds.map(id => env.COMMENTS_KV.get(`comment:${entry}:${id}`))
          );
          for (const c of legacyComments) {
            if (!c) continue;
            const parsed = JSON.parse(c);
            if (!parsed.ns) parsed.ns = 'source';
            ids.push({ _legacy: true, comment: parsed });
          }
        }
      }

      if (ids.length === 0) return json({ entry, ns, comments: [] });

      // Materialize all comments (both new and legacy)
      const materialized = await Promise.all(ids.map(async (idInfo) => {
        if (typeof idInfo === 'object' && idInfo._legacy) return idInfo.comment;
        const raw = await env.COMMENTS_KV.get(`comment:${ns}:${entry}:${idInfo}`);
        return raw ? JSON.parse(raw) : null;
      }));
      const comments = materialized.filter(Boolean);
      return json({ entry, ns, comments });
    }

    // No entry: list all (admin view) — across both namespaces
    const all = await env.COMMENTS_KV.list({ prefix: 'comment:' });
    const comments = [];
    for (const key of all.keys) {
      const raw = await env.COMMENTS_KV.get(key.name);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      // Back-compat: legacy comment keys are `comment:<entry>:<id>` (no ns).
      // The `ns` field on the value is also missing. Default both to 'source'.
      if (!parsed.ns) parsed.ns = 'source';
      comments.push(parsed);
    }
    comments.sort((a, b) => b.timestamp - a.timestamp);
    return json({ comments, count: comments.length });
  }

  // PATCH /api/comments?id=...&key=...&ns=... — update status (ack/acted/new) or add system reply
  // Body: { status?: 'new'|'acked'|'acted', system_reply?: { kind: string, message: string } }
  // Currently open (no auth) — fine for a low-traffic wiki
  if (request.method === 'PATCH') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const entry = url.searchParams.get('key');
    const ns = resolveNs(url.searchParams.get('ns'));
    if (!id || !entry) return bad('id and key required');
    // Try the new (namespaced) key first, then fall back to the legacy key
    let commentKey = `comment:${ns}:${entry}:${id}`;
    let raw = await env.COMMENTS_KV.get(commentKey);
    if (!raw) {
      const legacyKey = `comment:${entry}:${id}`;
      raw = await env.COMMENTS_KV.get(legacyKey);
      if (raw) commentKey = legacyKey;
    }
    if (!raw) return bad('comment not found', 404);
    const comment = JSON.parse(raw);
    if (!comment.ns) comment.ns = 'source';
    let body = {};
    try { body = await request.json(); } catch (e) { body = {}; }

    if (body.status && ['new', 'acked', 'acted'].includes(body.status)) {
      comment.status = body.status;
      // Resetting to 'new' clears system replies — the comment is now "fresh again"
      if (body.status === 'new' && body.clear_replies !== false) {
        comment.system_replies = [];
      }
    }
    if (body.system_reply && typeof body.system_reply === 'object') {
      const reply = {
        kind: (body.system_reply.kind || 'note').toString().slice(0, 32),
        message: (body.system_reply.message || '').toString().slice(0, 280),
        timestamp: Date.now()
      };
      if (reply.message) {
        comment.system_replies = comment.system_replies || [];
        comment.system_replies.push(reply);
      }
    }
    await env.COMMENTS_KV.put(commentKey, JSON.stringify(comment));
    return json({ ok: true, comment });
  }

  // DELETE /api/comments?id=...&key=...&ns=... — delete a comment
  // (currently open; in production you'd want an admin token check)
  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const entry = url.searchParams.get('key');
    const ns = resolveNs(url.searchParams.get('ns'));
    if (!id || !entry) return bad('id and key required');
    // Try the new (namespaced) key first, then the legacy key
    let listKey = `list:${ns}:${entry}`;
    let commentKey = `comment:${ns}:${entry}:${id}`;
    let exists = await env.COMMENTS_KV.get(commentKey);
    if (!exists) {
      const legacyCommentKey = `comment:${entry}:${id}`;
      const legacyListKey = `list:${entry}`;
      exists = await env.COMMENTS_KV.get(legacyCommentKey);
      if (exists) {
        commentKey = legacyCommentKey;
        listKey = legacyListKey;
      }
    }
    if (!exists) return bad('comment not found', 404);
    await env.COMMENTS_KV.delete(commentKey);
    // Remove from list
    const listRaw = await env.COMMENTS_KV.get(listKey);
    if (listRaw) {
      const list = JSON.parse(listRaw).filter(x => x !== id);
      await env.COMMENTS_KV.put(listKey, JSON.stringify(list));
    }
    return json({ ok: true, deleted: id });
  }

  return bad('method not allowed', 405);
}
