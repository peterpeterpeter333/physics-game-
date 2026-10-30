#!/bin/zsh
# Own E1 checkpoint only: no production render, no encoder, no canonical edits.
set -euo pipefail
cd /Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series
task_cache=/private/tmp/ys/ys-chain-e1v1
E1_PASS_TAG=e1v1-r9 E1_PREVIEW_DIR="$task_cache/blender/gate-e1v1-r9/frames" node scripts/umech/desk-e1v1-preview.mjs preview > "$task_cache/e1v1-r9-12-composite.log"
E1_PASS_TAG=e1v1-r9 node scripts/umech/desk-e1v1-review.mjs preview > "$task_cache/e1v1-r9-473-review.log"
/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/umech/audit-desk-e1v1-frames.py "$task_cache/blender/gate-e1v1-r9/frames" "$task_cache/e1v1-r9-full-probe-frame-features.json" "$task_cache/review-e1v1-r9-allcue/e1v1-review-manifest.json" > "$task_cache/e1v1-r9-full-probe-frame-features.log"
