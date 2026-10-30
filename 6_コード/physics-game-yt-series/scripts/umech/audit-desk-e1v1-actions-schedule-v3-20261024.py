"""New receipt for the row23 principal-strengthened, final peer-reviewed draft."""
from pathlib import Path
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
module = runpy.run_path(str(W/'scripts/umech/audit-desk-e1v1-actions-schedule-20261024.py'))
module['main'].__globals__['OUT'] = Path('/private/tmp/ys/ys-chain-e1v1/e1v1-actions-schedule-v3-20261024.json')
module['main']()
