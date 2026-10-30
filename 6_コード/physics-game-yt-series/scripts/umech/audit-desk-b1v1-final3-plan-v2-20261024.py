"""B3 exact actual raw-hold mapping, not a canonical-AST schedule claim.

Read-only CPU. The original completed3696 renders/7004 held copies are the
actual sources. Each held raw must match one unique meta.done source in exact
size+mtime and full SHA256. Current source-AST3755/6945 discrepancy is retained,
not imposed on already rendered pixels and not hidden by a weakened guard.
Calibrated r8 poses then independently reproduce B2 delivered motion609.
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
OUT = Path('/private/tmp/ys/ys-chain-b1v1-final3-plan-v2-20261024.json')
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
    source_ast_plans = [scope['plan'](j) for j in range(count)]
    source_ast_counts = dict(Counter(p[0] for p in source_ast_plans))
    assert count == 10700
    raw = C / 'blender/desk'
    meta = read(raw / 'meta.json')
    completed = read(C / 'b1-production-20261024.json')
    done = set(meta['done'])
    assert completed['status'] == 'done' and len(done) == completed['actualFrames'] == 3696
    files = [raw / ('%05d.jpg' % j) for j in range(count)]
    assert all(p.is_file() and not p.is_symlink() for p in files)
    inventory = [(p.stat().st_size, str(p.stat().st_mtime_ns)) for p in files]
    source_by_stat = {}
    for j in sorted(done):
        sig = inventory[j]
        assert sig not in source_by_stat, 'Actual rendered sources must have distinct exact size+mtime'
        source_by_stat[sig] = j
    refs = [source_by_stat[sig] for sig in inventory]
    assert all(0 <= k <= j and k in done and (j not in done or k == j) for j, k in enumerate(refs))
    # Read all actual bytes: stat coincidence alone is not a hold-source proof.
    hashes = [sha(p) for p in files]
    assert all(hashes[j] == hashes[k] for j, k in enumerate(refs)), 'Held raw byte mismatch'
    assert inventory == [(p.stat().st_size, str(p.stat().st_mtime_ns)) for p in files]
    plans = [('render', None) if j in done else ('dup', refs[j]) for j in range(count)]
    counts = dict(Counter(p[0] for p in plans))
    assert counts == {'render': 3696, 'dup': 7004}
    source_ast_differences = [j for j in range(count) if tuple(plans[j]) != tuple(source_ast_plans[j])]
    cp = read(B2 / 'camera-patch.json')
    physical = {r['frame']: r for r in cp['physical']}
    original = [scope['pose_at'](k / 30) for k in refs]
    delivered = [list(p) for p in original]
    for js, ks in cp['replacementFrameToActualPatchFrame'].items():
        j, k = int(js), int(ks)
        delivered[j] = list(physical[k]['pose'])
    moving = [False] + [delivered[j] != delivered[j - 1] for j in range(1, count)]
    assert sum(moving) == cp['cameraMotion']['moving_frames'] == 609
    report = {'id': 'ys-chain-b1v1', 'kind': 'Byte-proven actual production hold mapping plus original pose math; no render',
              'frames': count, 'fps': 30, 'duration': data['duration'],
              'sourceSha256': SOURCE_SHA, 'source': str(SOURCE),
              'sharedSegSourceSha256': sha(library),
              'actualCalibratedCuesSource': str(C / 'blender/b1-r8-probe-complete.json'),
              'actualCalibratedCuesSourceSha256': sha(C / 'blender/b1-r8-probe-complete.json'),
              'b2CameraReportSha256': sha(B2 / 'camera-patch.json'),
              'counts': counts, 'plans': plans, 'originalObjectSourceFrames': refs,
              'rawFrameSha256': hashes, 'rawFrameSizeMtimeNs': inventory,
              'actualMetaSha256': sha(raw / 'meta.json'),
              'actualProductionReportSha256': sha(C / 'b1-production-20261024.json'),
              'all10700RawBytesAndHeldSourceHashesVerified': True,
              'currentSourceASTCountsNotForcedOnActualPixels': source_ast_counts,
              'sourceASTDifferentFramesRetained': len(source_ast_differences),
              'firstSourceASTDifferences': [{'frame': j, 'sourceAST': source_ast_plans[j], 'actualProduction': plans[j]} for j in source_ast_differences[:30]],
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
