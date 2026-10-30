"""Independent CPU-light receipt of actual GUI059 strict E restoration.

No Blender import, rendering, code installation, guard or source edit.
"""
import hashlib
import json
from pathlib import Path
import time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
Q = Path('/private/tmp/ys/axes-active-queue')
OUT = C / 'e1v1-job059-independent-review-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def main():
    assert not OUT.exists()
    renderer_path = C / 'e1v1-production-r9-renderer-restore-v2/renderer-1792843275027864000.json'
    controls_path = C / 'e1v1-production-r9-restore/restore-20261024T210124-1792843284928227000.json'
    preflight_path = C / 'e1v1-production-r9/preflight-20261024T210130.json'
    done_path = Q / 'job-059-e1-strict-restore-only.done.json'
    compile_path = C / 'e1v1-live-renderer-compile-match-20261024.json'
    freeze_path = C / 'e1v1-r9-source-freeze.json'
    r, c, p, job, cause, freeze = map(read, (renderer_path, controls_path, preflight_path,
                                          done_path, compile_path, freeze_path))
    assert job['status'] == 'done' and p['renderRequested'] is False and p['renderCalls'] == 0
    assert r['restoreRequested'] and not r['renderRequested']
    assert r['representativeStates'] == 42
    deltas = r['representativeProjectionComparisons']
    assert len(deltas) == 42
    assert all(row[k] == 0 for row in deltas for k in
               ('poseDelta', 'boxDeltaPixels', 'worldAnchorDelta', 'projectedAnchorDeltaPixels'))
    assert r['noModelEntityChanges'] and r['otherModuleBindingsUnchanged']
    assert r['episodeBindingsUnchanged'] and r['source16AndPreviewPixelsUnchanged']
    assert not r['sharedFileOrOriginalGuardChanged'] and not r['modelReload']
    assert c['allFramePlan']['independentFrozenPlanExactMatch']
    assert c['allFramePlan']['frames'] == 11606
    assert c['allFramePlan']['render'] == 8100 and c['allFramePlan']['dup'] == 3506
    assert c['allFramePoseComparison']['maximumDifference'] == 0
    assert c['frozenPoseVsApprovedR9PhysicalProof']['samples'] == 411
    assert c['frozenPoseVsApprovedR9PhysicalProof']['maximumDifference'] == 0
    assert c['source16Unchanged'] and c['visibilityGlobalsPreserved']
    assert not c['guardChanged'] and not c['modelReload']
    assert p['canonicalRendererCodeVerified'] and p['frozenPlanVsRetainedDifferentFrames'] == 0
    assert p['explicitScene'] == 'Technical chain E-1' and p['renderer'] == 'BLENDER_EEVEE'
    assert all(sha(W / f) == h for f, h in freeze['files'].items())
    protected = {str(W / f): h for f, h in freeze['files'].items()}
    paths = (renderer_path, controls_path, preflight_path, done_path,
             Q / 'job-059-e1-strict-restore-only.log', compile_path, freeze_path)
    report = {'episode': 'E-1', 'recordedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
              'kind': 'Independent read-only review of actual GUI job059, not a production render or final approval',
              'inputs': {str(f): sha(f) for f in paths},
              'rendererRestoreHelperSha256': r['helperSha256'],
              'originalRunnerSha256': p['runnerSha256'],
              'actualJobStatus': job['status'], 'actualJobSeconds': job['seconds'],
              'representativeStatesCompared': 42,
              'allPoseBoxWorldAndProjectedAnchorDeltasExactlyZero': True,
              'all11606PlansMatchIndependentFrozenAST': True,
              'render8100Duplicate3506': True,
              'all11606PosesAnd411ApprovedPhysicalPosesExactlyUnchanged': True,
              'originalStrictRendererGuardActuallyPassed': True,
              'sameOriginalModuleGlobalsAndVisibilityBindingsPreserved': True,
              'canonicalSourcesAndOriginalGuardUnchanged': True,
              'modelsReloaded': False,
              'job059RenderRequested': False, 'job059RenderCalls': 0,
              'productionRawJpegsPresentAtReview': len(list((C / 'blender/desk').glob('*.jpg'))),
              'source16Sha256Reverified': protected,
              'diagnosticCompileCauseRecord': str(compile_path),
              'compileDiagnosisDidNotRelaxProductionGuard': True,
              'reviewerRenderedOrInstalledAnything': False,
              'readyForRootAuthorizedProductionOnly': True,
              'finalPassed': False,
              'unconfirmed': ['Full production8100 actual renders plus3506 copies have not been delivered by job059.',
                              'The separately frozen468-source camera correction has not been rendered by job059.',
                              'Final encoded MP4, actual half-second/cue-end/move images and final gates remain pending.']}
    with OUT.open('x') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(str(OUT))


if __name__ == '__main__':
    main()
