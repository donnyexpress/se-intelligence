#!/usr/bin/env bash
# Install git hooks for the SE Intelligence project.
# This makes the pre-commit auto-update work automatically.

set -e
HOOKS_SRC="$(git rev-parse --show-toplevel)/.githooks"
HOOKS_DST="$(git rev-parse --show-toplevel)/.git/hooks"

if [ ! -d "$HOOKS_SRC" ]; then
    echo "ERROR: .githooks/ not found"
    exit 1
fi

for hook in "$HOOKS_SRC"/*; do
    name=$(basename "$hook")
    dst="$HOOKS_DST/$name"
    if [ -e "$dst" ] && [ ! -L "$dst" ]; then
        echo "WARN: $dst already exists (not a symlink); skipping"
        continue
    fi
    ln -sf "../../.githooks/$name" "$dst"
    chmod +x "$dst"
    echo "Installed: $dst"
done

echo ""
echo "Done. To bypass hooks: git commit --no-verify"
