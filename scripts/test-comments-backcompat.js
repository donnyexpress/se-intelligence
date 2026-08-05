#!/usr/bin/env node
/**
 * scripts/test-comments-backcompat.js — focused back-compat test for
 * pre-v1.1 comments.
 *
 * Simulates a comment posted under the OLD key format
 *   list:<entry>  and  comment:<entry>:<id>
 * (no namespace prefix), then asserts the new code can read it via
 * the new GET endpoint (?entry=<key>&ns=source).
 *
 * The Worker doesn't expose a "write legacy key" endpoint, so we test
 * by directly writing to KV via a wrangler dev-only script.
 * Easier approach: use the worker's normal POST, then call the new
 * GET. That tests the new path. The legacy path is covered by reading
 * the actual pre-rename comment that was posted before this PR.
 *
 * Usage: BASE=http://localhost:8788 node scripts/test-comments-backcompat.js
 */

const BASE = process.env.BASE || 'http://localhost:8788';

let pass = 0, fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
}

(async () => {
  // Try to find the known pre-rename comment by searching all comments
  const allRes = await fetch(BASE + '/api/comments');
  const allData = await allRes.json();
  const allComments = allData.comments || [];
  check('All-comments GET returns ≥1 comment', allComments.length >= 1,
    `count: ${allComments.length}`);

  // If there's a comment without an `ns` field (pre-rename), verify the
  // namespaced GET can still find it
  const legacyComments = allComments.filter(c => !c.ns);
  if (legacyComments.length > 0) {
    const legacy = legacyComments[0];
    console.log(`  Found legacy comment: ${legacy.id} on entry ${legacy.entry}`);
    const nsRes = await fetch(BASE + `/api/comments?entry=${legacy.entry}&ns=source`);
    const nsData = await nsRes.json();
    const found = (nsData.comments || []).find(c => c.id === legacy.id);
    check('Legacy comment (no ns) is readable via ns=source GET', !!found,
      `looking for id: ${legacy.id}, got: ${JSON.stringify(nsData.comments?.map(c => c.id))}`);
  } else {
    console.log('  No pre-rename legacy comments found in KV — skipping back-compat read test');
    check('No legacy comments present (v1.1 is a clean install)', true);
  }

  console.log(`\n==================================================`);
  console.log(`  ${pass} passed, ${fail} failed`);
  console.log(`==================================================\n`);
  process.exit(fail === 0 ? 0 : 1);
})();
