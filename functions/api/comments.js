// functions/api/comments.js — Cloudflare Pages Function for comment storage
//
// Endpoints:
//   GET  /api/comments                 → list all comments (admin view)
//   GET  /api/comments?entry=<key>     → list comments for one entry
//   POST /api/comments                 → add a new comment
//   DELETE /api/comments?id=<id>&key=<entry> → delete a comment
//
// Storage: Cloudflare KV, one key per comment (id: <entry>:<timestamp>:<random>)
//   We also keep a per-entry list key (list:<entry>) holding comment IDs
//   so we can fetch all comments for an entry efficiently.
//
// To install on Cloudflare Pages:
//   1. Create the KV namespace (already done)
//   2. Bind it to the Pages project as COMMENTS_KV
//   3. Deploy — Pages Functions run on the same domain, no extra routing

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
  const { entry, type, message } = body;
  if (!entry || typeof entry !== 'string') return 'entry (string) required';
  if (!type || typeof type !== 'string') return 'type (string) required';
  if (!message || typeof message !== 'string') return 'message (string) required';
  if (message.length > 4000) return 'message too long (max 4000 chars)';
  return null;
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

    const id = makeId();
    const comment = {
      id,
      entry: body.entry,
      type: body.type,
      message: body.message,
      name: (body.name || '').toString().slice(0, 80),
      title: (body.title || '').toString().slice(0, 200),
      timestamp: Date.now(),
    };
    const commentKey = `comment:${comment.entry}:${id}`;
    const listKey = `list:${comment.entry}`;

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

    if (entry) {
      // Get comments for one entry
      const listRaw = await env.COMMENTS_KV.get(`list:${entry}`);
      if (!listRaw) return json({ entry, comments: [] });
      const ids = JSON.parse(listRaw);
      const results = await Promise.all(
        ids.map(id => env.COMMENTS_KV.get(`comment:${entry}:${id}`))
      );
      const comments = results.filter(Boolean).map(r => JSON.parse(r));
      return json({ entry, comments });
    }

    // No entry: list all (admin view)
    const all = await env.COMMENTS_KV.list({ prefix: 'comment:' });
    const comments = [];
    for (const key of all.keys) {
      const raw = await env.COMMENTS_KV.get(key.name);
      if (raw) comments.push(JSON.parse(raw));
    }
    comments.sort((a, b) => b.timestamp - a.timestamp);
    return json({ comments, count: comments.length });
  }

  // PATCH /api/comments?id=...&key=... — update status (ack/acted/new) or add system reply
  // Body: { status?: 'new'|'acked'|'acted', system_reply?: { kind: string, message: string } }
  // Currently open (no auth) — fine for a low-traffic wiki
  if (request.method === 'PATCH') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const entry = url.searchParams.get('key');
    if (!id || !entry) return bad('id and key required');
    const commentKey = `comment:${entry}:${id}`;
    const raw = await env.COMMENTS_KV.get(commentKey);
    if (!raw) return bad('comment not found', 404);
    const comment = JSON.parse(raw);
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

  // DELETE /api/comments?id=...&key=... — delete a comment
  // (currently open; in production you'd want an admin token check)
  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const entry = url.searchParams.get('key');
    if (!id || !entry) return bad('id and key required');
    await env.COMMENTS_KV.delete(`comment:${entry}:${id}`);
    // Remove from list
    const listRaw = await env.COMMENTS_KV.get(`list:${entry}`);
    if (listRaw) {
      const list = JSON.parse(listRaw).filter(x => x !== id);
      await env.COMMENTS_KV.put(`list:${entry}`, JSON.stringify(list));
    }
    return json({ ok: true, deleted: id });
  }

  return bad('method not allowed', 405);
}
