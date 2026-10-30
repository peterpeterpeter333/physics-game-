"""Pure AST/JSON camera schedule proof; never imports bpy or runs a render."""
import ast
from collections import Counter
import hashlib
import json
from pathlib import Path
import runpy
from types import SimpleNamespace

W = Path(__file__).resolve().parents[2]
C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = C / 'e1v1-camera-patch-static-20261024.json'
HELPER = W / 'scripts/blender/desk_axes_e1_camera_patch_20261024.py'
FILES = [HELPER, W / 'scripts/umech/desk-e1v1-camera-final-export-20261024.mjs',
         W / 'scripts/umech/review-desk-e1v1-camera-final-20261024.mjs',
         W / 'scripts/umech/audit-desk-e1v1-moving-camera-evidence-20261024.py',
         Path(__file__).resolve()]


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists(), 'Preserve earlier static proof'
    freeze = json.loads((C / 'e1v1-r9-source-freeze.json').read_text())
    assert all(sha(W / p) == h for p, h in freeze['files'].items())
    helper = runpy.run_path(str(HELPER))
    runner = runpy.run_path(str(W / 'scripts/blender/desk_axes_e1_r9_production.py'))
    pg, plans = runner['frozen_plan']()
    data = json.loads((C / 'blender/data.json').read_text())
    cameras = json.loads((C / 'blender/gate-e1v1-r9/r9-probe-actual.json').read_text())['cameras']
    def mix(a, b, u):
        u = helper['smooth'](u)
        return tuple(x + (y - x) * u for x, y in zip(a, b))
    g = {'CUES': data['cues'], 'CAMERAS': cameras, 'd': SimpleNamespace(pose_mix=mix)}
    stage = W / 'scripts/blender/desk_e1v1.py'
    nodes = [n for n in ast.parse(stage.read_text()).body
             if isinstance(n, ast.FunctionDef) and n.name in ('camera_keys', 'pose_at')]
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(stage), 'exec'), g)
    g['KEYS'] = g['camera_keys']()
    audit = json.loads((C / 'blender/gate-e1v1-r9/e1v1-r9-physical-bounds.json').read_text())
    pose_delta = max(abs(a - b) for row in audit['rows']
                     for a, b in zip(g['pose_at'](row['time']), row['pose']))
    assert pose_delta < 1e-9
    replacements, sources = helper['schedule'](data['cues'], cameras, plans, g['pose_at'])
    assert len(sources) == len(replacements) == 468
    intervals = []
    for cue in data['cues']:
        if cue['key'] not in helper['KEYS']:
            continue
        frames = [j for j in sources if helper['cue_at'](data['cues'], j / 30)['key'] == cue['key']]
        assert frames
        end = cue['start'] + cue['move']
        assert helper['patch_pose'](cue, end, cameras, g['pose_at']) == list(cameras[cue['camera']])
        intervals.append({'cue': cue['key'], 'start': cue['start'], 'end': end,
                          'firstFrame': frames[0], 'lastFrame': frames[-1], 'actualFrames': len(frames),
                          'maximumApproachMultiplier': 1 + helper['APPROACH'].get(cue['camera'], .1)})
    for j, k in replacements.items():
        old_source = j if plans[j][0] == 'render' else plans[j][1]
        assert sources[k] == old_source
        c = helper['cue_at'](data['cues'], j / 30)
        assert c['key'] in helper['KEYS'] and c['start'] <= j / 30 < c['start'] + c['move']
    unpatched = [j for j in range(len(plans)) if j not in replacements]
    assert len(unpatched) == 11138
    actual_review = C / 'e1v1-r9-moving-camera-existing-review-20261024.json'
    report = {'id': 'ys-chain-e1v1', 'scope': 'Pure AST/JSON proof only; no new geometry projection or JPEG/render execution',
              'newFilesSha256': {str(p.relative_to(W)): sha(p) for p in FILES},
              'frozen16SourceFilesUnchanged': True, 'frames': len(plans),
              'originalPlanCounts': dict(Counter(p[0] for p in plans)),
              'actualPatchFrames': len(sources), 'deliveredReplacementFrames': len(replacements),
              'unchangedDeliveredFrames': len(unpatched), 'allObjectSourcesEqualOriginalPlan': True,
              'dependentHoldsInThisActualPlan': sum(j != k for j, k in sources.items()),
              'originalIndependentCameraPoseVsApproved411MaxDifference': pose_delta,
              'ranges': intervals, 'unchangedSameSiteAndOpeningMoves': list(helper['UNCHANGED_MOVES']),
              'existing21ImageEyeEvidence': {'path': str(actual_review), 'sha256': sha(actual_review)},
              'newActualProjectionPreflightExecuted': False, 'newPatchJpegsRendered': False,
              'newPatchImagesViewed': False, 'finalPassed': False,
              'runtimeAPI': "runpy.run_path(PATH)['run'](nsE1, authorized=True)",
              'runtimePreconditions': ['Only root queue after unchanged r9 completed.json',
                                       'Every468 physical principal40–70/safe/clip plus role geometry full-frame guards before first render',
                                       'No source/global/model reload; original NG retained; final actual eyes required']}
    assert all(sha(W / p) == h for p, h in freeze['files'].items())
    with OUT.open('x') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(OUT)
    print(json.dumps({'frames': len(plans), 'actualPatchFrames': len(sources),
                      'originalPlanCounts': report['originalPlanCounts'],
                      'helperSHA256': sha(HELPER), 'noGpuOrRender': True}))


if __name__ == '__main__':
    main()
