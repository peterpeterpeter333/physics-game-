"""Diagnose/restore only the retained E renderer function, never its scene.

Root queue APIs:
  run(nsE1)                            # diagnostic, NO changes / NO rendering
  run(nsE1, restore=True)              # restore AST main + original preflight
  run(nsE1, restore=True, render=True) # same proof, then UNCHANGED v2 production

The old d.main code/disassembly is preserved in a NEW JSON. Canonical main is
compiled from the unchanged shared source and installed into its ORIGINAL
module globals, preserving every existing SC/CAM/material/show binding.
The old strict production guard remains intact. Original control restoration
is also unchanged and independently verifies pose_at/plan/11606-frame schedule.
"""
import ast
import dis
import hashlib
import io
import json
import os
from pathlib import Path
import runpy
import time
import types

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
CONTROL = W / 'scripts/blender/desk_axes_e1_restore_r9_20261024.py'
CONTROL_SHA = '227ed079c77dbf78b3f2acea47b22cb5c8c3dee70c1199698666e36de0addee7'
RUNNER = W / 'scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA = '5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
SHARED = W / 'scripts/blender/desk_lib.py'


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def dump(path, value):
    with Path(path).open('x') as f:
        json.dump(value, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')


def code_description(code):
    output = io.StringIO()
    dis.dis(code, file=output)
    return {'filename': code.co_filename, 'firstLine': code.co_firstlineno,
            'name': code.co_name, 'bytecodeHex': code.co_code.hex(),
            'names': list(code.co_names), 'variables': list(code.co_varnames),
            'flags': code.co_flags, 'argcount': code.co_argcount,
            'posonlyargcount': code.co_posonlyargcount,
            'kwonlyargcount': code.co_kwonlyargcount,
            'freevars': list(code.co_freevars), 'cellvars': list(code.co_cellvars),
            'exceptionTableHex': getattr(code, 'co_exceptiontable', b'').hex(),
            'constants': [code_description(v) if isinstance(v, types.CodeType) else
                          {'type': type(v).__name__, 'repr': repr(v)} for v in code.co_consts],
            'disassembly': output.getvalue()}


def code_differences(old, canonical, path='main'):
    changes = []
    for name in ('co_code', 'co_names', 'co_varnames', 'co_argcount',
                 'co_posonlyargcount', 'co_kwonlyargcount', 'co_flags',
                 'co_freevars', 'co_cellvars', 'co_exceptiontable'):
        a, b = getattr(old, name, None), getattr(canonical, name, None)
        if a != b:
            changes.append({'path': path + '.' + name, 'old': repr(a), 'canonical': repr(b)})
    if len(old.co_consts) != len(canonical.co_consts):
        changes.append({'path': path + '.co_consts.length',
                        'old': len(old.co_consts), 'canonical': len(canonical.co_consts)})
    for i, (a, b) in enumerate(zip(old.co_consts, canonical.co_consts)):
        label = path + '.co_consts[' + str(i) + ']'
        if isinstance(a, types.CodeType) and isinstance(b, types.CodeType):
            changes.extend(code_differences(a, b, label + '(' + a.co_name + ')'))
        elif type(a) is not type(b) or repr(a) != repr(b):
            changes.append({'path': label, 'old': repr(a), 'canonical': repr(b)})
    return changes


def run(ns, restore=False, render=False):
    assert not render or restore, 'Diagnose mode must never render'
    assert sha(CONTROL) == CONTROL_SHA and sha(RUNNER) == RUNNER_SHA
    control, runner = runpy.run_path(str(CONTROL)), runpy.run_path(str(RUNNER))
    g = ns['apply'].__globals__
    d, bpy = g['d'], g['bpy']
    assert g['__file__'] == str(W / 'scripts/blender/desk_e1v1.py') and g['A'].cache == str(C)
    assert g['_SHOW_QUEUE'] is None and d.show.__globals__ is g and d.show_tree.__globals__ is g
    assert not (C / 'blender/desk').exists(), 'Never restore after production output exists'
    freeze_file = C / 'e1v1-r9-source-freeze.json'
    freeze = json.loads(freeze_file.read_text())
    protected = {str(W / p): h for p, h in freeze['files'].items()}
    protected.update({str(CONTROL): CONTROL_SHA, str(RUNNER): RUNNER_SHA,
                      str(SHARED): sha(SHARED), str(freeze_file): sha(freeze_file),
                      str(C / 'ys-chain-e1v1.wav'): freeze['canonicalVoiceSHA256'],
                      str(C / 'blender/data.json'): freeze['dataSHA256'],
                      str(C / 'blender/tex/e1-chart.png'): freeze['textureSHA256']})
    assert all(sha(p) == h for p, h in protected.items())
    old_main = d.main
    module_globals = d.__dict__
    assert module_globals['SC'] is d.SC and module_globals['CAM'] is d.CAM
    tree = ast.parse(SHARED.read_text(), str(SHARED))
    nodes = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == 'main']
    assert len(nodes) == 1
    # EXACT same AST compile convention as the unchanged runner's guard.
    compiled = compile(ast.Module(body=nodes, type_ignores=[]), str(SHARED), 'exec')
    canonical_scope = {}
    exec(compiled, canonical_scope)
    canonical = canonical_scope['main']
    differences = code_differences(old_main.__code__, canonical.__code__)
    folder = C / 'e1v1-production-r9-renderer-restore-v2'
    folder.mkdir(exist_ok=True)
    report_path = folder / ('renderer-' + str(time.time_ns()) + '.json')
    before_keys = set(module_globals)
    module_bindings = {k: v for k, v in module_globals.items() if k != 'main'}
    episode_bindings = {k: g[k] for k in ('apply', 'pose_at', 'plan', 'KEYS', 'SPANS', 'EVENTS')}
    record = {'id': 'ys-chain-e1v1', 'helperSha256': sha(__file__),
              'sharedSourceSha256': sha(SHARED), 'protectedInputSha256': protected,
              'originalRunnerSha256': RUNNER_SHA, 'controlHelperSha256': CONTROL_SHA,
              'origin': 'job053 stopped at unchanged canonical-renderer strict-code guard, zero production pixels',
              'restoreRequested': restore, 'renderRequested': render,
              'oldRendererGlobalsAreOriginalModule': old_main.__globals__ is module_globals,
              'oldRendererCode': code_description(old_main.__code__),
              'canonicalRendererCode': code_description(canonical.__code__),
              'codeDifferences': differences,
              'strictOriginalSignatureInitiallyEqual': runner['signature'](old_main.__code__) == runner['signature'](canonical.__code__),
              'sharedFileOrOriginalGuardChanged': False,
              'modelReload': False, 'status': 'diagnostic_only_no_runtime_write'}
    if not restore:
        dump(report_path, record)
        print('E1 renderer diagnostic:', report_path, flush=True)
        print('E1 renderer differences:', json.dumps(differences, ensure_ascii=False), flush=True)
        return record
    assert old_main.__globals__ is module_globals, 'Review foreign old renderer globals before any restoration'
    assert not old_main.__code__.co_freevars, 'Review captured old renderer closures before any restoration'
    old_scene = bpy.context.window.scene
    paths = {scene.name: scene.render.filepath for scene in bpy.data.scenes}
    images = {p: runner['stamp'](p) for p in paths.values() if p and os.path.isfile(p)}
    previews = runner['protected_raw']()
    entities = [len(bpy.data.objects), len(bpy.data.meshes), len(bpy.data.curves), len(bpy.data.materials)]
    installed = False
    try:
        before = [control['capture'](g, t) for t in control['TIMES']]
        installed = True
        # Only this ONE definition executes, into the retained module globals.
        # No imports, factories, top-level library statements or calibration.
        exec(compiled, module_globals)
        assert d.main is module_globals['main'] and d.main.__globals__ is module_globals
        assert runner['signature'](d.main.__code__) == runner['signature'](canonical.__code__)
        assert set(module_globals) == before_keys
        assert all(module_globals[k] is v for k, v in module_bindings.items())
        assert all(g[k] is v for k, v in episode_bindings.items())
        assert d.show.__globals__ is g and d.show_tree.__globals__ is g
        after = [control['capture'](g, t) for t in control['TIMES']]
        comparisons = []
        for a, b in zip(before, after):
            assert a['cue'] == b['cue'] and a['camera'] == b['camera']
            assert set(a['anchorsWorld']) == set(b['anchorsWorld'])
            delta = control['delta']
            row = {'time': a['time'], 'cue': a['cue'],
                   'poseDelta': delta(a['pose'], b['pose']),
                   'boxDeltaPixels': delta(a['box'], b['box']),
                   'worldAnchorDelta': max(delta(v, b['anchorsWorld'][k]) for k, v in a['anchorsWorld'].items()),
                   'projectedAnchorDeltaPixels': max(delta(v, b['anchorsProjected'][k]) for k, v in a['anchorsProjected'].items())}
            comparisons.append(row)
            assert row['poseDelta'] <= 1e-9 and row['worldAnchorDelta'] <= 1e-9
            assert row['boxDeltaPixels'] <= .100001 and row['projectedAnchorDeltaPixels'] <= .100001
        assert entities == [len(bpy.data.objects), len(bpy.data.meshes), len(bpy.data.curves), len(bpy.data.materials)]
        assert all(sha(p) == h for p, h in protected.items())
        assert not runner['verify_saved'](previews) and not runner['verify_saved'](images)
        assert all(bpy.data.scenes[name].render.filepath == p for name, p in paths.items())
        record.update({'status': 'canonical_renderer_restored_same_original_module_pending_unchanged_runner',
                       'representativeProjectionComparisons': comparisons,
                       'beforeRepresentativeProjections': before, 'afterRepresentativeProjections': after,
                       'representativeStates': len(comparisons), 'noModelEntityChanges': True,
                       'otherModuleBindingsUnchanged': True, 'episodeBindingsUnchanged': True,
                       'source16AndPreviewPixelsUnchanged': True})
        dump(report_path, record)
    except BaseException as error:
        if installed:
            module_globals['main'] = old_main
        record.update({'status': 'STOP_renderer_restoration_rolled_back',
                       'oldRendererBindingRestored': d.main is old_main,
                       'error': {'type': type(error).__name__, 'message': str(error)}})
        if not report_path.exists():
            dump(report_path, record)
        raise
    finally:
        bpy.context.window.scene = old_scene
    print('E1 canonical renderer restored and projection verified:', report_path, flush=True)
    # The original control helper and original production runner are unedited.
    # A remaining original guard failure stops here; nothing is bypassed.
    return control['run'](ns, render=render)
