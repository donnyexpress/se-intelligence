#!/usr/bin/env bash
# scripts/test-brand.sh — T-06: brand/strings check.
#
# Asserts:
#   - "SE Intelligence" appears in user-visible places (index.html, config.js, app.js, wrangler.toml)
#   - "Tech Scan" does NOT appear in user-visible places
#   - "Tech Scan" is allowed only in docs/ (analysis, history) and the proposed-changes log
#   - wrangler.toml project name is "se-intelligence"
#
# Usage: bash scripts/test-brand.sh

set -u

cd "$(dirname "$0")/.."

pass=0
fail=0
check() {
  if [ "$1" = "pass" ]; then
    pass=$((pass + 1))
    echo "  ✓ $2"
  else
    fail=$((fail + 1))
    echo "  ✗ $2${3:+ — $3}"
  fi
}

echo "--- Brand: SE Intelligence present in user-visible places ---"
echo

# index.html should have SE Intelligence
if grep -q "SE Intelligence" index.html; then
  check pass "index.html contains 'SE Intelligence'"
else
  check fail "index.html contains 'SE Intelligence'"
fi

# config.js
if grep -q "'SE Intelligence'" assets/config.js; then
  check pass "assets/config.js site.name = 'SE Intelligence'"
else
  check fail "assets/config.js site.name = 'SE Intelligence'"
fi

# app.js
if grep -q "'SE Intelligence'" assets/app.js; then
  check pass "assets/app.js has 'SE Intelligence' as default site name"
else
  check fail "assets/app.js has 'SE Intelligence' as default site name"
fi

# wrangler.toml
if grep -q 'name = "se-intelligence"' wrangler.toml; then
  check pass "wrangler.toml project name = 'se-intelligence'"
else
  check fail "wrangler.toml project name = 'se-intelligence'"
fi

echo
echo "--- Brand: 'Tech Scan' should NOT appear in user-visible places ---"
echo

# Check user-visible source files
TS_HITS=$(grep -rln "Tech Scan" \
  --include="*.js" --include="*.html" --include="*.css" --include="*.toml" --include="*.md" \
  assets/ index.html wrangler.toml 2>/dev/null | grep -v node_modules | grep -v "docs/" || true)

if [ -z "$TS_HITS" ]; then
  check pass "no 'Tech Scan' references in assets/, index.html, wrangler.toml"
else
  # Allow some specific historic / fallback references in the docs/ directory
  # (e.g. analysis docs, proposed-changes log) and the SPA server file
  UNEXPECTED=""
  for f in $TS_HITS; do
    case "$f" in
      docs/*) ;;  # OK — historical documents
      scripts/spa-server.py) ;;  # OK — unrelated
      *) UNEXPECTED="$UNEXPECTED $f" ;;
    esac
  done
  if [ -z "$UNEXPECTED" ]; then
    check pass "'Tech Scan' only appears in historical docs/ (allowed)"
  else
    check fail "'Tech Scan' found in unexpected places:$UNEXPECTED"
  fi
fi

# Specific check: no "Tech Scan" in any user-facing JS file
TS_IN_APP=$(grep -c "Tech Scan" assets/app.js 2>/dev/null | head -1)
TS_IN_APP=${TS_IN_APP:-0}
if [ "$TS_IN_APP" = "0" ]; then
  check pass "no 'Tech Scan' in assets/app.js"
else
  check fail "assets/app.js has '$TS_IN_APP' 'Tech Scan' references"
fi

# Specific check: no "Tech Scan" in config.js
TS_IN_CONFIG=$(grep -c "Tech Scan" assets/config.js 2>/dev/null | head -1)
TS_IN_CONFIG=${TS_IN_CONFIG:-0}
if [ "$TS_IN_CONFIG" = "0" ]; then
  check pass "no 'Tech Scan' in assets/config.js"
else
  check fail "assets/config.js has '$TS_IN_CONFIG' 'Tech Scan' references"
fi

echo
echo "=================================================="
echo "  $pass passed, $fail failed"
echo "=================================================="
exit $fail
