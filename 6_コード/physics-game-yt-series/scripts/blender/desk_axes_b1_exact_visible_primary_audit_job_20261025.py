"""ROOT GUI QUEUE ONLY: all exact B-1 states, zero renders or media writes.

Creating this file does not dispatch it.  Root must read both this file and
its pinned helper before using the existing single GUI queue.  No second
Blender, production renderer, encoder or original-checker mutation is used.
"""


def _b1_exact_visible_primary_audit_dispatch(session):
    import hashlib
    from pathlib import Path
    import runpy

    helper = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_exact_visible_primary_audit_20261025.py')
    expected = 'f45e7840d5f7d4ddd12331e38b4fdec88a2c9f8ec8d079c29987055737ff11cd'
    assert hashlib.sha256(helper.read_bytes()).hexdigest() == expected
    assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
    scope = runpy.run_path(str(helper))
    name, ns = scope['select_namespace'](session)
    print('B1 exact visible primary audit:', name, 'all 10700 outputs / 4047 recipes; ZERO RENDERS', flush=True)
    result = scope['run'](ns, authorized=True, expected_helper_sha256=expected, namespace_name=name)
    assert result['completedMeasurements'] and result['all10700OutputsMapped']
    assert result['exactRecipeCount'] == 4047 and len(result['frameMap']) == 10700
    assert len(result['samples759']) == 759 and len(result['halfSecondFrames']) == 714
    assert result['renders'] == result['encodes'] == 0
    assert not result.get('error') and not result['cleanupError'] and not result['restorationOffenders']
    assert all(value is True for value in result['protectionChecks'].values())
    assert result['automaticSupplementalPassClaimed'] is False and result['finalAcceptance'] is False
    print('B1 all-state evaluated-primary measurement complete; native faces classified; original NG unchanged; root supplemental assessment pending', flush=True)


_b1_exact_visible_primary_audit_dispatch(globals())
