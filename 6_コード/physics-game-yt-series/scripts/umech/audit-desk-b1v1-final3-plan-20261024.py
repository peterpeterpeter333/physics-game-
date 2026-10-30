"""Pure CPU B3 assembly schedule; no bpy or original script execution.

Extract only four original functions and their SPANS/EVENTS AST statements.
Authoritative calibrated cues come from the actual final r8 GUI record used
by the original production. Verify its3696/7004 schedule and B2 camera motion.
"""
import ast
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
from types import SimpleNamespace

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-b1v1')
B2 = Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
OUT = Path('/private/tmp/ys/ys-chain-b1v1-final3-plan-20261024.json')
SOURCE = W / 'scripts/blender/desk_b1v1.py'
SOURCE_SHA = '7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def main():
    assert not OUT.exists()
    assert sha(SOURCE) == SOURCE_SHA
    actual = read(C / 'blender/b1-r8-probe-complete.json')
    assert actual['sourceSha256'] == SOURCE_SHA
    cues = actual['actualCuesAndPoses']
    library = W / 'scripts/blender/desk_lib.py'
    shared = {}
    nodes = [n for n in ast.parse(library.read_text()).body
             if isinstance(n, ast.FunctionDef) and n.name in ('clamp', 'sm', 'seg')]
    assert len(nodes) == 3
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(library), 'exec'), shared)
    data = read(C / 'blender/data.json')['b1']
    scope = {'math': math, 'FPS': 30, 'CUES': cues, 'DATA': data,
             'd': SimpleNamespace(seg=shared['seg'])}
    selected = []
    functions = {'u', 'cue_at', 'pose_at', 'plan'}
    for n in ast.parse(SOURCE.read_text()).body:
        if isinstance(n, ast.FunctionDef) and n.name in functions:
            selected.append(n)
        elif isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ('SPANS', 'EVENTS') for t in n.targets):
            selected.append(n)
        elif isinstance(n, ast.AugAssign) and isinstance(n.target, ast.Name) and n.target.id == 'SPANS':
            selected.append(n)
        elif isinstance(n, ast.For) and any(isinstance(v, ast.Call) and isinstance(v.func, ast.Attribute) and isinstance(v.func.value, ast.Name) and v.func.value.id == 'SPANS' and v.func.attr == 'append' for v in ast.walk(n)):
            selected.append(n)
    assert {n.name for n in selected if isinstance(n, ast.FunctionDef)} == functions
    exec(compile(ast.Module(body=selected, type_ignores=[]), str(SOURCE), 'exec'), scope)
    count = math.ceil(data['duration'] * 30)
    plans = [scope['plan'](j) for j in range(count)]
    counts = dict(Counter(p[0] for p in plans))
    assert count == 10700 and counts == {'render': 3696, 'dup': 7004}, (count, counts)
    refs = [j if p[0] == 'render' else p[1] for j, p in enumerate(plans)]
    assert all(0 <= k <= j and plans[k][0] == 'render' for j, k in enumerate(refs))
    cp = read(B2 / 'camera-patch.json')
    physical = {r['frame']: r for r in cp['physical']}
    original = [scope['pose_at'](k / 30) for k in refs]
    delivered = [list(p) for p in original]
    for js, ks in cp['replacementFrameToActualPatchFrame'].items():
        j, k = int(js), int(ks)
        delivered[j] = list(physical[k]['pose'])
    moving = [False] + [delivered[j] != delivered[j - 1] for j in range(1, count)]
    assert sum(moving) == cp['cameraMotion']['moving_frames'] == 609
    report = {'id': 'ys-chain-b1v1', 'kind': 'Pure exact-source B3 assembly preparation, no render',
              'frames': count, 'fps': 30, 'duration': data['duration'],
              'sourceSha256': SOURCE_SHA, 'source': str(SOURCE),
              'sharedSegSourceSha256': sha(library),
              'actualCalibratedCuesSource': str(C / 'blender/b1-r8-probe-complete.json'),
              'actualCalibratedCuesSourceSha256': sha(C / 'blender/b1-r8-probe-complete.json'),
              'b2CameraReportSha256': sha(B2 / 'camera-patch.json'),
              'counts': counts, 'plans': plans, 'originalObjectSourceFrames': refs,
              'cues': cues, 'originalDeliveredPoses': original,
              'b2DeliveredPoses': delivered,
              'b2MotionOriginal609ActuallyReproduced': True,
              'b2CameraMotion': cp['cameraMotion'],
              'bpyImported': False, 'originalSourcesOrGatesEdited': False}
    with OUT.open('x') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(json.dumps({'out': str(OUT), 'counts': counts, 'b2MovingFrames': sum(moving)}))


if __name__ == '__main__':
    main()
