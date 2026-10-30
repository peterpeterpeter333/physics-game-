"""ROOT GUI QUEUE ONLY: zero-render audit, then 6 controls + 6 camera variants.

Creating this file does not dispatch it.  Do not run in a second Blender.
It never invokes a full-film renderer, encoder, or old completion/waiver flow.
"""


def _b1ng_dispatch_camera_six(session):
    import hashlib
    from pathlib import Path
    import runpy

    runner = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_remaining_ng_six_probe_runner_20261025.py')
    expected = '1cd857d05f49ee21fb8092bbdfd2d61cd6a88175c95fbbe4cdfb95aeec008df3'
    assert hashlib.sha256(runner.read_bytes()).hexdigest() == expected
    assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
    scope = runpy.run_path(str(runner))
    name, ns = scope['select_namespace'](session)
    print('B1 camera six: pinned runtime namespace', name, 'audit first; no production', flush=True)
    audit = scope['run'](ns, authorized=True, mode='audit',
                         expected_helper_sha256=expected, namespace_name=name)
    assert audit['allGuardedStatesPass'] and audit['actualRenderCount'] == 0
    assert not audit.get('error') and not audit['cleanupError']
    assert not audit['restorationOffenders']
    assert all(value is True for value in audit['protectionChecks'].values())
    audit_path = scope['OUT']/'audit/report.json'
    audit_sha = hashlib.sha256(audit_path.read_bytes()).hexdigest()
    actual = scope['run'](ns, authorized=True, mode='probe',
                          expected_helper_sha256=expected,
                          approved_audit_sha256=audit_sha, namespace_name=name)
    assert actual['allGuardedStatesPass'] and actual['actualRenderCount'] == 12
    assert actual['allSixVariantImagesRendered']
    assert not actual.get('error') and not actual['cleanupError']
    assert not actual['restorationOffenders']
    assert all(value is True for value in actual['protectionChecks'].values())
    print('B1 camera six controls+variants complete; actual composites/original features/eyes pending', flush=True)


_b1ng_dispatch_camera_six(globals())
