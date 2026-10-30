"""Inert, root-only recovery of job153's derived matrix caches.

Never call episode apply/pose/reset, render, encode, or assign any transform,
matrix, parent, constraint, material or mesh.  The failed transaction already
restored all authoritative channels; its only 80 offenders are matrix_world.
Use the prior proven normal evaluator, then require every saved pre-job world
matrix at the original 1e-9.  No historical failure is overwritten or waived.
"""
import hashlib
import json
import os
from pathlib import Path
import runpy
import time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FROZEN = W/'scripts/blender/desk_axes_b1_remaining_ng_six_probe_runner_20261025.py'
RECOVERY = W/'scripts/blender/desk_axes_b1_b7_cache_recovery_20261025.py'
FAILED = Path('/private/tmp/ys/ys-chain-b1v1-original-ng-camera-six-probe-20261025/audit/report.json')
DONE = Path('/private/tmp/ys/axes-active-queue/job-153-b1-original-ng-six-camera-probe-20261025.done.json')
OUT = Path('/private/tmp/ys/ys-chain-b1v1-job153-exact-normal-restore-20261025')
PINS = {
    FROZEN: '1cd857d05f49ee21fb8092bbdfd2d61cd6a88175c95fbbe4cdfb95aeec008df3',
    RECOVERY: '37e6db84e45e544a68175eb8979734a2c63a7ef6928de5bc0ee5e1498e257efc',
    FAILED: '0c37095406ca5c7349b847667567b1087a1845b39c3087cc0f7756b02e6d84cd',
    DONE: 'ff575b3da63f2228e99de6dfc58d9b72c0bd2a79f4d6d42fc5dbe4f4ce9f7043',
}
TOL = 1e-9


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write_new(path, value):
    assert path.is_relative_to(OUT) and not os.path.lexists(path)
    assert not any(p.is_symlink() for p in path.parents if p.exists())
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('x') as stream:
        json.dump(value, stream, ensure_ascii=False, indent=1, allow_nan=False)
        stream.write('\n')


def select_namespace(session):
    assert sha(FROZEN) == PINS[FROZEN]
    return runpy.run_path(str(FROZEN))['select_namespace'](session)


def run(ns, authorized=False, *, expected_helper_sha256, namespace_name=None):
    assert authorized is True and sha(__file__) == expected_helper_sha256
    assert not os.path.lexists(OUT) and not OUT.is_symlink()
    for path, expected in PINS.items():
        assert sha(path) == expected
    failed = json.loads(FAILED.read_text())
    offenders = failed['restorationOffenders']
    assert len(offenders) == 80 and all(r['channel'] == 'matrix_world' for r in offenders)
    assert not failed['cleanupError'] and failed['actualImages'] == []
    original_failures = {key for key, value in failed['protectionChecks'].items() if not value}
    assert original_failures == {'allFullTransformsVisibilityParentsRestored',
                                 'contextViewLayerRestored', 'contextRestoredEvenOnFailure'}
    prior = runpy.run_path(str(FROZEN))
    recovery_api = runpy.run_path(str(RECOVERY))
    g, tools = prior['runtime_api'](ns)
    bpy, d = g['bpy'], g['d']
    recovery = recovery_api['Recovery'](g)
    diag = recovery.tools
    original = recovery.original
    scene = d.SC
    protected = dict(failed['protectedInputSha256'])
    protected.update({str(path): h for path, h in PINS.items()})
    protected[str(Path(__file__).resolve())] = expected_helper_sha256
    prior['verify'](protected)
    paths = {s: s.render.filepath for s in bpy.data.scenes}
    media = {p: sha(p) for p in paths.values() if p and Path(p).is_file()}
    inventory = original['inventory'](prior['C']/'blender/desk')
    bindings, snapshot_bindings = tools['bindings'](g), tools['bindings'](ns)
    entry_context = diag['context'](bpy)
    entry_scene, entry_layer = bpy.context.window.scene, bpy.context.window.view_layer
    # ViewLayer Python wrappers may differ; RNA pointer + owner is identity.
    assert entry_context['viewLayerIdDataPointer'] == entry_context['scenePointer']
    before = foreign_before = None
    started = time.time()
    report = dict(episode='B-1', namespace=namespace_name,
                  helperSha256=expected_helper_sha256, failed153=str(FAILED),
                  failed153Sha256=PINS[FAILED], oldFailureRetainedVerbatim=True,
                  expectedOriginalWorldCount=80, originalToleranceUnchanged=TOL,
                  episodeApplyPoseResetCalls=0, renders=0, encodes=0,
                  transformMatrixParentConstraintMaterialMeshAssignments=0,
                  entryContext=entry_context, allOriginal80WorldsRestored=False,
                  actualImageOrPhysicalPassClaimed=False, finalAcceptance=False)
    error = None
    try:
        bpy.context.window.scene = scene
        bpy.context.view_layer.update()
        layer = bpy.context.window.view_layer
        assert diag['pointer'](layer.id_data) == diag['pointer'](scene)
        objects, owned = list(bpy.data.objects), list(scene.objects)
        owned_set = set(owned)
        before = {o: diag['object_channels'](o, original['transform'], layer) for o in objects}
        foreign_before = {o: original['transform'](o) for o in objects if o not in owned_set}
        expected_world = {o.name: diag['flat'](o.matrix_world) for o in objects}
        for row in offenders:
            assert row['object'] in scene.objects
            expected_world[row['object']] = row['before']
        # Includes owned parent evaluation and exact render/viewport/local-hide
        # restoration.  This does not assign world/basis matrices to fake pass.
        recovery.normalize(g, 'job153-recover-original-saved-worlds-by-normal-evaluation')
        after = {o: diag['object_channels'](o, original['transform'], layer) for o in objects}
        channel_offenders = [o.name for o in objects if before[o] != after[o]]
        assert not channel_offenders, ('Authoritative input channel changed', channel_offenders)
        world_checks = []
        failed_names = {r['object'] for r in offenders}
        for o in objects:
            actual = diag['flat'](o.matrix_world)
            delta = diag['delta'](actual, expected_world[o.name])
            world_checks.append(dict(object=o.name, original153Offender=o.name in failed_names,
                                     maximumAbsoluteDifference=delta, pass_=delta <= TOL))
        original80 = [r for r in world_checks if r['original153Offender']]
        report.update(worldChecks=world_checks,
                      allOriginal80WorldsRestored=all(r['pass_'] for r in original80),
                      allOtherEntryWorldsUnchanged=all(r['pass_'] for r in world_checks if not r['original153Offender']),
                      allAuthoritativeChannelsConstraintsVisibilityAndPointersUnchanged=True,
                      normalEvaluation=recovery.metadata())
        assert len(original80) == 80 and report['allOriginal80WorldsRestored'], ('Normal evaluation did not restore saved80; no waiver', [r for r in original80 if not r['pass_']])
        assert report['allOtherEntryWorldsUnchanged'], ('Other saved world changed', [r for r in world_checks if not r['pass_']])
        return report
    except BaseException as exc:
        error = exc
        report['error'] = dict(type=type(exc).__name__, message=str(exc)[:2000])
        raise
    finally:
        context_error = None
        try:
            bpy.context.window.scene = entry_scene
            target_layer = next(l for l in entry_scene.view_layers
                                if l.name == entry_context['viewLayerName']
                                and diag['pointer'](l) == entry_context['viewLayerPointer'])
            bpy.context.window.view_layer = target_layer
            bpy.context.view_layer.update()
        except BaseException as exc:
            context_error = dict(type=type(exc).__name__, message=str(exc))
        restored = diag['context'](bpy)
        checks = dict(
            allPinnedInputAndFailedEvidenceSHAUnchanged=all(sha(p) == h for p, h in protected.items()),
            all10700RawStatsAndResolvedPathsUnchanged=original['inventory'](prior['C']/'blender/desk') == inventory,
            allRuntimeAndSnapshotBindingsUnchanged=tools['bindings'](g) == bindings and tools['bindings'](ns) == snapshot_bindings,
            allSceneFilepathsUnchanged=all(s.render.filepath == p for s, p in paths.items()),
            allExistingSceneOutputBytesUnchanged=all(sha(p) == h for p, h in media.items()),
            sceneLayerRNAPointerNameOwnerFrameRestored=not context_error and diag['context_equal'](entry_context, restored),
            foreignObjectFullChannelsAndWorldUnchanged=foreign_before is not None and all(original['transform'](o) == state for o, state in foreign_before.items()),
            visibilityQueueClosed=g['VIS_QUEUE'] is None)
        report.update(protectionChecks=checks, restoredContext=restored,
                      contextRestoreError=context_error, protectedInputSha256=protected,
                      normalEvaluation=recovery.metadata(), seconds=round(time.time()-started, 3),
                      success=error is None and report['allOriginal80WorldsRestored'] and all(checks.values()))
        write_new(OUT/'report.json', report)
        assert all(checks.values()), ('Recovery protection failed; no waiver', checks, context_error)
