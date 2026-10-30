"""Add-only correction to the task's first optics preflight.

The existing camera intentionally has shift_y=-.06. Preserve that shift rather
than incorrectly requiring zero. No camera shift or quality limit is changed.
The failed first preflight and its helper stay untouched in their old paths.
"""
import hashlib
from pathlib import Path

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
OLD = W/'scripts/blender/desk_axes_b1_semantic_width_optics_20261025.py'
OLD_SHA = 'edd3c74e55500db7a364a776ed7506db48f409b0f7646163f65e912e6af4fb85'


def build():
    text = OLD.read_text()
    assert hashlib.sha256(text.encode()).hexdigest() == OLD_SHA
    changes = [
        ("ROOT = Path('/private/tmp/ys/ys-chain-b1v1-semantic-width-optics-20261025')",
         "ROOT = Path('/private/tmp/ys/ys-chain-b1v1-semantic-width-optics-v2-20261025')"),
        ("        assert cam.type == 'PERSP' and cam.shift_x == cam.shift_y == 0\n"
         "        before = (cam.dof.focus_distance, cam.dof.aperture_fstop)\n"
         "        cam.lens *= lens_scale(j)\n"
         "        assert before == (cam.dof.focus_distance, cam.dof.aperture_fstop)",
         "        assert cam.type == 'PERSP' and cam.shift_x == 0 and abs(cam.shift_y+.06) < 1e-8\n"
         "        before = (cam.dof.focus_distance, cam.dof.aperture_fstop, cam.shift_x, cam.shift_y)\n"
         "        cam.lens *= lens_scale(j)\n"
         "        assert before == (cam.dof.focus_distance, cam.dof.aperture_fstop, cam.shift_x, cam.shift_y)")]
    updated = text
    for before, after in changes:
        assert updated.count(before) == 1
        updated = updated.replace(before, after, 1)
    inverse = updated
    for before, after in reversed(changes):
        assert inverse.count(after) == 1
        inverse = inverse.replace(after, before, 1)
    assert inverse == text
    scope = {'__name__': '_b1_optics_v2', '__file__': str(Path(__file__).resolve())}
    exec(compile(updated, str(OLD)+' [preserve actual existing shift_y and NEW output root]', 'exec'), scope)
    return scope


def dispatch(session, request):
    scope = build()
    name, ns = scope['select_namespace'](session)
    result = scope['run'](ns, authorized=True, mode=request.get('mode', 'audit'),
                          expected_helper_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                          namespace_name=name, approved_audit_sha256=request.get('auditSha256'),
                          approved_probe_sha256=request.get('probeSha256'),
                          visually_approved=request.get('visuallyApproved', False))
    assert hashlib.sha256(OLD.read_bytes()).hexdigest() == OLD_SHA
    assert scope['strict_report'](result) and result['allGuardedStatesPass'] and result['all10700SemanticPhysicalChecked']
    print('B1 optics v2 completed', result['mode'], result['actualRenderCount'], 'renders; existing camera shift retained', flush=True)
    return result
