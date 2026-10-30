"""No bpy/render: exact retained-plan discrepancy and source-level time-state proof.

This does not turn the original schedule into a PASS or claim evaluated mesh QA.
The two actual encoded screenshots listed below were viewed separately.
"""
import ast
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
from types import SimpleNamespace

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ROOT = Path('/private/tmp/ys')
BASE = ROOT / 'ys-chain-b1v1-final2-20261024'
OUT = ROOT / 'ys-chain-b1v1-final3-live-plan-diagnosis-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def smooth(v):
    x = max(0, min(1, v))
    return x*x*(3-2*x)


def main():
    assert not OUT.exists()
    live_path = ROOT / 'ys-chain-b1v1-retained-plan-20261024.json'
    proven_path = ROOT / 'ys-chain-b1v1-final3-plan-v2-20261024.json'
    live, proven = read(live_path), read(proven_path)
    source = W / 'scripts/blender/desk_b1v1.py'
    tree = ast.parse(source.read_text())
    assert sha(source) == live['sourceSha256'] == proven['sourceSha256']
    assert live['plans'] == proven['plans']
    assert live['CUES'] == proven['cues']
    assert live['exactRenderFramesMatchOriginalMeta']
    assert live['renders'] == live['applyCalls'] == 0 and not live['namespaceBindingsChanged']
    lib = W / 'scripts/blender/desk_lib.py'
    shared = {}
    exec(compile(ast.Module(body=[n for n in ast.parse(lib.read_text()).body if isinstance(n, ast.FunctionDef) and n.name in ('clamp', 'sm', 'seg')], type_ignores=[]), str(lib), 'exec'), shared)
    scope = {'math': math, 'FPS': 30, 'CUES': live['CUES'], 'DATA': {}, 'd': SimpleNamespace(seg=shared['seg'])}
    selected = []
    for n in tree.body:
        if isinstance(n, ast.FunctionDef) and n.name in ('u', 'cue_at', 'plan'):
            selected.append(n)
        elif isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id in ('SPANS', 'EVENTS') for t in n.targets):
            selected.append(n)
        elif isinstance(n, ast.AugAssign) and isinstance(n.target, ast.Name) and n.target.id == 'SPANS':
            selected.append(n)
        elif isinstance(n, ast.For) and any(isinstance(v, ast.Call) and isinstance(v.func, ast.Attribute) and isinstance(v.func.value, ast.Name) and v.func.value.id == 'SPANS' and v.func.attr == 'append' for v in ast.walk(n)):
            selected.append(n)
    exec(compile(ast.Module(body=selected, type_ignores=[]), str(source), 'exec'), scope)
    canonical = [list(scope['plan'](j)) for j in range(10700)]
    omitted = [list(s) for s in scope['SPANS'] if list(s) not in live['SPANS']]
    assert omitted == [[288.8606666666667, 289.8606666666667], [298.4246666666667, 299.4246666666667]]
    canonical = [list(p) for p in canonical]
    diff = [j for j in range(10700) if canonical[j] != live['plans'][j]]
    render_loss = [j for j in diff if canonical[j][0] == 'render' and live['plans'][j][0] == 'dup']
    assert len(diff) == 73 and len(render_loss) == 59
    cp = read(ROOT / 'ys-chain-b1v1-camera-final-20261024/camera-patch.json')
    cpmap = cp['replacementFrameToActualPatchFrame']
    # Exact time-dependent expressions on the only reachable apply_state branches
    # for these two intervals. Geometry/base transforms are reset identically.
    def physical_time_state(t):
        c = scope['cue_at'](t)
        assert c['group'] == 'inside' and c['row'] in (31, 32, 33)
        return {'group': c['group'], 'row': c['row'], 'transparentAlpha': 1-.6*scope['u'](t,271.58,.8),
                'cutawayDisc': False, 'globeSurface': True, 'innerVisible': t >= 271.58,
                'SLetterAndBlueHalf': t >= 293.74, 'NLetterAndRedHalf': t >= 296.49,
                'predictionLinesNeedleHorizonVisible': False,
                'compassVisible': c['row'] == 32,
                'compassHingeRadians': -math.radians(110) if c['row'] == 32 else None,
                'compassNeedleRadians': math.radians(8+8*math.exp(-8)*math.cos(36)) if c['row'] == 32 else None,
                'attractVisible': c['row'] == 32 and t >= 293.74,
                'pointingHandVisible': c['end']-c['start'] > 8,
                'dipVectorConstantDegrees': 51.5,
                'otherTimedRowEffectsReachable': False}
    rows = []
    for j in diff:
        k = live['plans'][j][1]
        a, b = physical_time_state(j/30), physical_time_state(k/30)
        assert a == b and not a['pointingHandVisible']
        c = scope['cue_at'](j/30)
        rows.append({'frame':j,'time':j/30,'cue':c['key'],'actualHoldSource':k,
                     'canonical':canonical[j],'retained':live['plans'][j],
                     'allReachablePhysicalTimeExpressionsEqualHeldSource':True,
                     'physicalTimeState':a,'coveredByB2CameraPatch':str(j) in cpmap,
                     'faceOpacity':smooth((j/30-c['start'])/.18) if c['key']=='odd:mio' else 0})
    odd_s = [j for j in range(10700) if scope['cue_at'](j/30)['key']=='odd:s']
    assert all(str(j) in cpmap for j in odd_s)
    spans_line = next(n.lineno for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id=='SPANS' for t in n.targets))
    calibrate_line = next(n.lineno for n in tree.body if isinstance(n, ast.Expr) and isinstance(n.value, ast.Call) and isinstance(n.value.func, ast.Name) and n.value.func.id=='calibrate_cameras')
    assert spans_line < calibrate_line
    manifest = read(BASE / 'actual-mp4-review/manifest.json')
    eyes = []
    for t in (298.5, 299):
        r = next(r for r in manifest['halfSeconds']['frames'] if r['time']==t)
        eyes.append({**r,'sha256':sha(r['file']),'actuallyViewedOriginal1080x1920':True,
                     'observation':'Fading face and complete central globe/inner S/N visible; no empty desk/giant clip' if t==298.5 else 'Opaque full-screen Mio; 3D background not visible',
                     'faceOpacityFromOriginalFormula':smooth((t-298.4246666666667)/.18)})
    fn_names = ('apply_state','reset','globe_state','compass_state','hands')
    report = {'kind':'Exact live-plan diagnosis, source-expression proof, separately viewed actual screenshots',
              'liveDump':str(live_path),'liveDumpSha256':sha(live_path),'actualHoldProof':str(proven_path),'actualHoldProofSha256':sha(proven_path),
              'exactLivePlanMatchesAll10700ByteProvenRawReferences':True,
              'liveCounts':dict(Counter(p[0] for p in live['plans'])),
              'sourceASTPostCalibrationCounts':dict(Counter(p[0] for p in canonical)),
              'originalPlannerPassClaimed':False,'normalizationApplied':False,
              'sourceOrder':{'SPANSLine':spans_line,'calibrateCamerasCallLine':calibrate_line,'explanation':'SPANS snapshots moves before calibrate_cameras adds move=1 for the two changed-camera cues; post-calibration AST reconstruction includes them.'},
              'omittedCameraOnlyIntervals':omitted,'differentPlanEntries':len(diff),'canonicalRenderRetainedDupFrames':len(render_loss),
              'all73PhysicalTimeExpressionsEqualHeldObjectSource':True,
              'proofScope':'Reachable source expressions, fixed BASE transforms and visibility branches; not a new evaluated-mesh or GPU render audit.',
              'reviewedFunctionAstSha256':{n.name:hashlib.sha256(ast.dump(n,include_attributes=False).encode()).hexdigest() for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in fn_names},
              'oddSCueOutputs':len(odd_s),'allOddSCueOutputsReplacedByActualB2CameraPatch':True,
              'b2CoverageOf59RenderDifferences':sum(str(j) in cpmap for j in render_loss),
              'b2CoverageOf73PlanDifferences':sum(str(j) in cpmap for j in diff),
              'rows':rows,'actualEyes':eyes,
              'originalGatesAndOriginalNGPreserved':True,'finalB3Mp4ReviewPending':True,
              'bpyImported':False,'renderCalls':0,'sourceOrExistingCacheEdited':False}
    with OUT.open('x') as f:
        json.dump(report,f,ensure_ascii=False,indent=1);f.write('\n')
    print(json.dumps({'out':str(OUT),'different':len(diff),'renderDifference':len(render_loss),'B2Coverage':report['b2CoverageOf59RenderDifferences'],'physicalExpressionDifferences':0}))


if __name__=='__main__':
    main()
