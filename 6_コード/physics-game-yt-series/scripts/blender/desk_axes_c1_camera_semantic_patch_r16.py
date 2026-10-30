"""Conditional C r16 candidate: extra framing margin for the actual pair rise.

Only run if the preserved r15 physical preflight actually rejects that entrance.
Root owns GPU submission. This does not alter or overwrite r14/r15 evidence.
"""
import hashlib,runpy
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
P=W/'scripts/blender/desk_axes_c1_camera_semantic_patch_r15.py'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def patch(ns):
    assert sha(P)=='5a7a23470f29fe234b5061130e97a215128c87b3cfe0e9504083ed4a56a1777c'
    root=Path('/private/tmp/ys/ys-chain-c1v1');import json
    failed=json.loads((root/'c1-camera-semantic-r15-preflight.json').read_text())
    allowed={'carry:simple','hard:9999','arm:wait','ch:intro'}
    assert failed['violations'] and all(r['cue'] in allowed and r['widthRatio']<.35 and not r['clipped'] for r in failed['violations']),'Inspect new real defects before using this narrowly scoped candidate'
    source=runpy.run_path(str(P))['patch'](ns,dry_run=True)['source']
    def replace(a,b):
        nonlocal source
        assert source.count(a)==1,(a,source.count(a));source=source.replace(a,b)
    replace("initial=.85 if r['cue']=='carry:simple' else 1.04 if r['cue'] in {'hard:9999','arm:wait','ch:intro','gear:box'} else 1.1", "initial=.80 if r['cue']=='carry:simple' else 1.02 if r['cue'] in {'hard:9999','arm:wait','ch:intro'} else 1.04 if r['cue']=='gear:box' else 1.1")
    replace('ys-chain-c1v1-camera-semantic-final-r15','ys-chain-c1v1-camera-semantic-final-r16')
    replace('c1-camera-semantic-r15-preflight.json','c1-camera-semantic-r16-preflight.json')
    replace("'revision':'r15-camera-and-confirmed-semantic-holds'","'revision':'r16-camera-and-confirmed-semantic-holds'")
    dependencies={str(p):sha(p) for p in [P,W/'scripts/blender/desk_axes_c1_camera_patch_20261024.py',W/'scripts/umech/desk-c1v1-semantic-hold-audit.py',Path(__file__)]}
    semantic=runpy.run_path(str(W/'scripts/umech/desk-c1v1-semantic-hold-audit.py'))['audit'](ns['main'].__globals__)
    private={'__file__':str(Path(__file__).resolve()),'__name__':'c1_r16_private','SEMANTIC_RESULT':semantic,'PATCH_DEPENDENCIES':dependencies}
    exec(compile(source,str(Path(__file__).resolve()),'exec'),private);return private['patch'](ns)
