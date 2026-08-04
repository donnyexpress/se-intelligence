#!/usr/bin/env python3
"""One-shot comment management: read all, post a system reply."""
import json, sys, urllib.request, urllib.parse

BASE = 'https://tech-scan.pages.dev'

def _request(url, data=None, method=None, extra_headers=None):
    headers = {
        'User-Agent': 'tech-scan-admin/1.0 (Cloudflare Pages admin via Python)',
        'Accept': 'application/json',
    }
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req) as r:
        return json.load(r)

def get_comments():
    return _request(BASE + '/api/comments')

def patch_comment(comment_id, entry_key, body):
    url = f"{BASE}/api/comments?id={urllib.parse.quote(comment_id)}&key={urllib.parse.quote(entry_key)}"
    data = json.dumps(body).encode('utf-8')
    return _request(url, data=data, method='PATCH',
                    extra_headers={'Content-Type': 'application/json'})

# List current state
data = get_comments()
print(f"=== Current state: {data['count']} comments ===")
for c in sorted(data['comments'], key=lambda x: x['timestamp'], reverse=True):
    print(f"  [{c.get('status','new'):6}]  {c['entry']}")
    print(f"           {c['message'].strip()[:80]}")
    for r in c.get('system_replies', []):
        print(f"           [{r['kind']}] {r['message'][:80]}")
    print()

# Find the visitor comment about MBSE patterns
target = next((c for c in data['comments'] if 'patterns from' in c.get('message', '')), None)
if not target:
    print("No matching comment found.")
    sys.exit(0)

print(f"=== Acting on comment {target['id']} (entry={target['entry']}) ===")
reply_text = ("Good catch. The entry was written from a synthesis of INCOSE MBSE Initiative reports "
              "and the MBSE patterns wiki — I linked the patterns page but didn't list the specific "
              "sources. I'll expand the entry with explicit references to the source patterns "
              "(Friedenthal/Steiner, MBSE Patterns WG, INCOSE practitioner case studies). "
              "Thanks for the heads-up.")

result = patch_comment(target['id'], target['entry'], {
    'status': 'acted',
    'system_reply': {'kind': 'reply', 'message': reply_text},
})
print(f"  status: {result['comment']['status']}")
print(f"  replies: {len(result['comment']['system_replies'])}")
print(f"  last reply: {result['comment']['system_replies'][-1]['message'][:100]}...")

# Final state
print()
print("=== Final state ===")
data2 = get_comments()
for c in sorted(data2['comments'], key=lambda x: x['timestamp'], reverse=True):
    print(f"  [{c.get('status','new'):6}]  {c['entry']}  by {c.get('name','')}")
    print(f"           {c['message'].strip()[:80]}")
    for r in c.get('system_replies', []):
        print(f"           [{r['kind']}] {r['message'][:80]}")
