"""Root-only precise-time v2 audit / six probes / 149-frame production.

Retains v1 bytes and failed audit. A bounded reversible in-memory derivative
removes only its three erroneous rounded-time assertions, points to the exact
phrase-time plan, captures seven fresh projections, and enables the already
audited fixed plan to render all affected outputs after the same six probes.
Import is inert; only root may call run(nsD1, authorized=True, ...).
"""
import hashlib
import json
from pathlib import Path

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
RETAINED_RUNNER = W/'scripts/blender/desk_axes_d1_five_width_probe_job_20261025.py'
RETAINED_SHA = 'fe77ce7fcd58a96b87a93e7b9e4a827c02d86a29ad8c5fd2e7460ffe7a9bb2df'
PRECISE_PLAN = W/'scripts/blender/desk_axes_d1_five_width_camera_plan_v2_20261025.py'
FINAL = Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
OUT = Path('/private/tmp/ys/ys-chain-d1v1-five-width-camera-v2-20261025')


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def motion_spans(poses):
    moving = [False]+[poses[j] != poses[j-1] for j in range(1, len(poses))]
    spans, start = [], None
    for j, active in enumerate(moving+[False]):
        if active and start is None:
            start = j/30
        if not active and start is not None:
            spans.append([start, j/30])
            start = None
    return spans


def adapted_source():
    assert sha(RETAINED_RUNNER) == RETAINED_SHA
    original = RETAINED_RUNNER.read_text()
    source, changes = original, []
    def replace(a, b):
        nonlocal source
        assert source.count(a) == 1, ('Nonunique precise-v2 source boundary', a[:120])
        source = source.replace(a, b, 1)
        changes.append((a, b))
    replace("OUT = Path('/private/tmp/ys/ys-chain-d1v1-five-width-camera-v1-20261025')",
            "OUT = Path('/private/tmp/ys/ys-chain-d1v1-five-width-camera-v2-20261025')")
    replace("PLAN = W/'scripts/blender/desk_axes_d1_five_width_camera_plan_20261025.py'",
            "PLAN = W/'scripts/blender/desk_axes_d1_five_width_camera_plan_v2_20261025.py'")
    replace("def run(ns, authorized=False, mode='audit', audit_sha256=None, probe_frames=None):",
            "def run(ns, authorized=False, mode='audit', audit_sha256=None, probe_frames=None, probe_sha256=None):")
    replace("assert authorized is True and mode in ('audit', 'probe')",
            "assert authorized is True and mode in ('audit', 'probe', 'render')")
    replace("pins = {**old['PINS'], V1: V1_SHA, VARIANT: VARIANT_SHA, PLAN: sha(PLAN)}",
            "pins = {**old['PINS'], V1: V1_SHA, VARIANT: VARIANT_SHA, PLAN: sha(PLAN), **V2_EXACT_SOURCE_PINS}")
    replace("    if mode == 'probe':\n        assert isinstance(audit_sha256, str)",
            "    if mode in ('probe', 'render'):\n        assert isinstance(audit_sha256, str)")
    replace("        assert prior['renders'] == 0\n    rows =",
            "        assert prior['renders'] == 0\n"
            "    if mode == 'render':\n"
            "        assert isinstance(probe_sha256, str) and sha(OUT/'probe/report.json') == probe_sha256\n"
            "        probe = read(OUT/'probe/report.json')\n"
            "        assert probe['mode'] == 'probe' and probe['renders'] == 6 and not probe.get('error') and not probe.get('cleanupError')\n"
            "        assert probe['plan'] == prior['plan'] and probe['allAffectedAndBoundaryPhysicalPass']\n"
            "        assert all(v is True for v in probe['protectionChecks'].values())\n"
            "        assert set(probe['auditedFrames']) == set(DEFAULT_PROBES)\n"
            "        for r in probe['rows']: assert r['pass'] and sha(r['image']) == r['imageSha256']\n"
            "    rows =")
    replace("        def replay(j):",
            "        world_anchors = {}\n        def replay(j):")
    replace("            if row['layer'] == 'pier-contact':\n                fresh, _ = images['apply_checked'](ctx, audit, states[row['actualFrame']])\n                assert fresh['pass']\n            else:\n                ctx.replay(row)",
            "            if row['layer'] == 'pier-contact':\n"
            "                points = ctx.replay(states[row['actualFrame']]['delivered'])\n"
            "                fresh, _ = images['apply_checked'](ctx, audit, states[row['actualFrame']])\n"
            "                assert fresh['pass']\n"
            "            else:\n"
            "                points = ctx.replay(row)\n"
            "            world_anchors[j] = {name:list(point) for name,point in points.items()}\n"
            "            assert set(world_anchors[j]) == {'boiler','cyl','piston','beam','can','coal','fuji'}")
    replace("            assert abs(b['installationWordTime']-41.95) < 1e-6\n            assert abs(b['canPrincipalCut']-123.18) < 1e-6\n            assert abs(b['airWordTime']-133.32) < 1e-6",
            "            report['preciseVoiceTimingEvidence'] = policy['timing_evidence'](g)")
    replace("        else:\n            plan = prior['plan']\n            assert plan['boundaries'] == policy['definitions'](g)",
            "        else:\n            plan = prior['plan']\n            assert plan['boundaries'] == policy['definitions'](g)\n            report['preciseVoiceTimingEvidence'] = policy['timing_evidence'](g)")
    replace("            assert set(all_frames) <= set(prior['auditedFrames'])\n        report.update(plan=plan",
            "            assert set(all_frames) <= set(prior['auditedFrames'])\n"
            "        elif mode == 'render':\n"
            "            all_frames = affected\n"
            "            assert set(all_frames) <= set(prior['auditedFrames'])\n"
            "        report.update(plan=plan")
    replace("            item['pass'] = all(checks.values())",
            "            item['pass'] = all(checks.values())\n"
            "            item['newProjectedAnchors'] = {name:list(d.project(g['Vector'](point))) for name,point in world_anchors[j].items()}\n"
            "            item['newAnchorWorldPoints'] = world_anchors[j]\n"
            "            item['anchorScope'] = 'fresh current-camera projection for this new derivative; historical identity NG unchanged'")
    replace("            if mode == 'probe':\n                assert item['pass'], item",
            "            if mode in ('probe', 'render'):\n                assert item['pass'], item")
    replace("        assert report['candidateCameraMotion']['topRatio'] <= .2",
            "        assert report['candidateCameraMotion']['topRatio'] <= .2\n"
            "        report['candidateDeliveredCameraPoses'] = new_poses\n"
            "        report['candidateCameraMotion']['moving_spans'] = V2_MOTION_SPANS(rounded)\n"
            "        report['newDerivativeProjectedAnchorsComplete'] = all(len(r['newProjectedAnchors']) == 7 for r in report['rows'])\n"
            "        report['v2Adapter'] = V2_ADAPTER_METADATA")
    inverse = source
    for a, b in reversed(changes):
        assert inverse.count(b) == 1
        inverse = inverse.replace(b, a, 1)
    assert inverse == original
    return source, dict(retainedRunner=str(RETAINED_RUNNER), retainedRunnerSha256=RETAINED_SHA,
                        reversibleSourceBoundaries=len(changes), inverseByteIdenticalToRetainedV1=True,
                        roundedTimeAssertionsRemoved=3, sourceStateAndCameraEasingRulesUnchanged=True,
                        exactPhraseTimingVerified=True, maximumProbeRenders=6,
                        productionOnlyAfterPassingAuditAndSameSixProbeHashes=True)


def run(ns, authorized=False, **kwargs):
    assert authorized is True
    source, metadata = adapted_source()
    pins = {RETAINED_RUNNER: RETAINED_SHA, PRECISE_PLAN: sha(PRECISE_PLAN),
            Path(__file__).resolve(): sha(__file__),
            FINAL/'blender/data.json': sha(FINAL/'blender/data.json'),
            FINAL/'phrase-times.json': sha(FINAL/'phrase-times.json')}
    scope = dict(__name__='d1_five_width_precise_v2_private', __file__=str(Path(__file__).resolve()),
                 V2_EXACT_SOURCE_PINS=pins, V2_MOTION_SPANS=motion_spans, V2_ADAPTER_METADATA=metadata)
    exec(compile(source, str(RETAINED_RUNNER)+' [precise-time v2 derivative]', 'exec'), scope)
    try:
        return scope['run'](ns, authorized=True, **kwargs)
    finally:
        assert all(sha(p) == h for p, h in pins.items())
