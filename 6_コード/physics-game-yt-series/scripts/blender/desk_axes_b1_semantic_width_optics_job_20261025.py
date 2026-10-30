"""ROOT single-GUI queue only. Default audit; creating file does not dispatch.

For a later probe/render set B1_SEMANTIC_WIDTH_REQUEST in the GUI session to
{'mode':'probe'|'render', 'auditSha256':..., 'probeSha256':...,
 'visuallyApproved':True}. Render requires both exact prior reports.
No standalone Blender or full-video encode is started here.
"""


def _b1_semantic_width_dispatch(session):
    import hashlib
    from pathlib import Path
    import runpy

    helper = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_b1_semantic_width_optics_20261025.py')
    expected = 'edd3c74e55500db7a364a776ed7506db48f409b0f7646163f65e912e6af4fb85'
    assert hashlib.sha256(helper.read_bytes()).hexdigest() == expected
    request = session.get('B1_SEMANTIC_WIDTH_REQUEST', {'mode': 'audit'})
    assert isinstance(request, dict)
    assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists()
    scope = runpy.run_path(str(helper))
    name, ns = scope['select_namespace'](session)
    result = scope['run'](ns, authorized=True, mode=request.get('mode', 'audit'),
                          expected_helper_sha256=expected, namespace_name=name,
                          approved_audit_sha256=request.get('auditSha256'),
                          approved_probe_sha256=request.get('probeSha256'),
                          visually_approved=request.get('visuallyApproved', False))
    assert scope['strict_report'](result) and result['allGuardedStatesPass']
    assert result['all10700SemanticPhysicalChecked']
    print('B1 fixed optics', result['mode'], 'complete;', result['actualRenderCount'], 'renders; all strict recovery/input guards passed; final video/composite review remains root-owned', flush=True)


_b1_semantic_width_dispatch(globals())
