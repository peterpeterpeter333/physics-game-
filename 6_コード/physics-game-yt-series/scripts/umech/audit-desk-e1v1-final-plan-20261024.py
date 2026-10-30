"""Frozen E-1 control-data receipt. No bpy, renderer, or model state."""
from collections import Counter
import hashlib
import json
from pathlib import Path
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = C/'e1v1-final-plan-receipt-20261024.json'
RUNNER = W/'scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA = '5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists(), 'Preserve an earlier plan receipt'
    assert sha(RUNNER) == RUNNER_SHA
    freeze_file = C/'e1v1-r9-source-freeze.json'
    freeze = json.loads(freeze_file.read_text())
    assert all(sha(W/p) == h for p, h in freeze['files'].items())
    assert sha(C/'blender/data.json') == freeze['dataSHA256']
    module = runpy.run_path(str(RUNNER))
    g, plans = module['frozen_plan']()
    assert len(plans) == 11606
    counts = dict(Counter(p[0] for p in plans))
    assert counts == {'render': 8100, 'dup': 3506}
    refs = [j if p[0] == 'render' else p[1] for j, p in enumerate(plans)]
    assert all(plans[k][0] == 'render' and k <= j for j, k in enumerate(refs))
    result = {'id': 'ys-chain-e1v1', 'kind': 'Exact frozen AST control-data receipt, not render or pixel evidence',
              'frames': len(plans), 'fps': 30, 'counts': counts, 'plans': plans,
              'originalObjectSourceFrames': refs, 'SPANS': g['SPANS'], 'EVENTS': g['EVENTS'],
              'runner': str(RUNNER), 'runnerSha256': RUNNER_SHA,
              'sourceFreezeSha256': sha(freeze_file), 'dataSha256': sha(C/'blender/data.json'),
              'allFrozenSourcesUnchanged': True, 'renderCalls': 0, 'bpyImported': False,
              'physicalOrVisualAcceptanceClaimed': False}
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(OUT)


if __name__ == '__main__':
    main()
