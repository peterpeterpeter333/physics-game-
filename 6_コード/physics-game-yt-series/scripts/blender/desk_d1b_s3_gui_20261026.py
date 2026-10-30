"""S3 GUI adapter only. Import does not load a scene, render, or write files.

Parent calls build() once the new scene source is ready. preview()/production()
return None for bpy.app.timers callbacks. Never starts composite/export/S4.
"""
import contextlib
import ast
import hashlib
import os
import pathlib
import runpy
import sys
import time
import traceback
import types

W = pathlib.Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SCRIPT = W / 'scripts/blender/desk_d1b_s3_20261026.py'
CACHE = pathlib.Path('/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026')
LOG = CACHE / 'd1b-s3-gui_20261026.log'
EPISODES = {}


def build():
    """Build the new S3 namespace in a fresh GUI scene, without a factory reset."""
    import bpy
    assert SCRIPT.is_file(), 'The parent must finish the new S3 scene before build()'
    assert not bpy.app.background, 'Use the normal Blender GUI'
    CACHE.mkdir(parents=True, exist_ok=True)
    assert CACHE.resolve() == CACHE and not CACHE.is_symlink()
    script_dir = str(W / 'scripts/blender')
    if script_dir not in sys.path:
        sys.path.insert(0, script_dir)
    for name in ('desk_lib', 'desk_lib_d1', 'desk_lib_d1_machine_claude_20261026',
                 'desk_lib_d1_machine_gpt_20261026', 'desk_lib_d1b_s3_20261026',
                 'desk_d1b_s3_qa_20261026'):
        sys.modules.pop(name, None)
    old_argv, old_bytecode = sys.argv[:], sys.dont_write_bytecode
    win = bpy.context.window or next(iter(bpy.context.window_manager.windows))
    old_scene = win.scene
    sys.dont_write_bytecode = True
    sys.argv = [str(SCRIPT), '--', '--cache', str(CACHE), '--scale', '.5', '--samples', '4']
    with open(LOG, 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        started = time.time()
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'), 'BUILD_S3', flush=True)
            # Existing scenes remain in RAM; only their names are disambiguated.
            # This prevents exact-name lookups from binding old objects.
            for obj in bpy.data.objects:
                if not obj.name.startswith('d1b_s3_prior_'):
                    obj.name = 'd1b_s3_prior_' + obj.name
            fresh = bpy.data.scenes.new('D1B_S3_20261026')
            win.scene = fresh
            with bpy.context.temp_override(window=win, scene=fresh, view_layer=fresh.view_layers[0]):
                libpath = W / 'scripts/blender/desk_lib.py'
                raw = libpath.read_bytes()
                source = raw.decode('utf8')
                marker = 'bpy.ops.wm.read_factory_settings(use_empty=True)'
                assert source.count(marker) == 1
                source = source.replace(marker, '# S3 GUI adapter already created an empty scene', 1)
                lib = types.ModuleType('desk_lib')
                lib.__file__ = str(libpath)
                sys.modules['desk_lib'] = lib
                arguments = sys.argv[:]
                sys.argv = [str(SCRIPT)]
                try:
                    exec(compile(source, str(libpath), 'exec'), lib.__dict__)
                finally:
                    sys.argv = arguments
                print('SHARED_RESET_ONLY_RAM_ADAPTER', hashlib.sha256(raw).hexdigest(), flush=True)
                ns = runpy.run_path(str(SCRIPT), run_name='d1b_s3_scene')
            assert ns['DATA']['episode'] == 'd1b'
            assert pathlib.Path(ns['A'].cache).resolve() == CACHE
            assert (ns['d'].W, ns['d'].H) == (1080, 1920), 'Anchors must retain logical1080px'
            EPISODES['d1b_s3'] = ns
            print('READY_S3', len(ns['d'].SC.objects), 'seconds', time.time() - started, flush=True)
            return ns
        except BaseException:
            traceback.print_exc()
            win.scene = old_scene
            raise
        finally:
            sys.argv, sys.dont_write_bytecode = old_argv, old_bytecode


def _call(task, times=None, out=None, samples=4):
    import bpy
    ns = EPISODES['d1b_s3']['main'].__globals__
    a, d = ns['A'], ns['d']
    assert pathlib.Path(a.cache).resolve() == CACHE
    output = pathlib.Path(out or CACHE / 'blender/desk').resolve()
    assert str(output).startswith(str(CACHE) + os.sep), 'Write only inside the isolated S3 cache'
    options = {k: getattr(a, k) for k in ('times', 'out', 'force', 'dry', 'shot_plan', 'plan_only', 'finish', 'scale', 'samples', 'start', 'stop') if hasattr(a, k)}
    render = d.SC.render
    settings = (render.resolution_x, render.resolution_y, render.resolution_percentage,
                d.SC.eevee.taa_render_samples, render.filepath, render.image_settings.file_format)
    with open(LOG, 'a', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        started = time.time()
        try:
            if (CACHE / 'STOP_S3').exists():
                print('STOP_S3 preserved; no render started', flush=True)
                return None
            a.times = times
            a.out = str(output)
            a.force = task == 'PREVIEW_S3'
            a.dry = a.shot_plan = a.plan_only = False
            a.finish = task == 'PRODUCTION_S3'
            a.scale = .5
            a.samples = samples
            a.start, a.stop = 0, 1e9
            render.resolution_x, render.resolution_y, render.resolution_percentage = 540, 960, 100
            d.SC.eevee.taa_render_samples = samples
            render.image_settings.file_format = 'JPEG'
            win = bpy.context.window or next(iter(bpy.context.window_manager.windows))
            win.scene = d.SC
            print(time.strftime('%Y-%m-%d %H:%M:%S'), task, times, str(output), 'samples', samples, flush=True)
            with bpy.context.temp_override(window=win, scene=d.SC, view_layer=d.SC.view_layers[0]):
                # The new scene owns exact raw frames, source-key-aware resume,
                # full-index anchors/primary and STOP_S3. No old main is called.
                ns['main']()
            print('DONE', task, 'seconds', time.time() - started, flush=True)
        except BaseException:
            traceback.print_exc()
            raise
        finally:
            for key, value in options.items():
                setattr(a, key, value)
            (render.resolution_x, render.resolution_y, render.resolution_percentage,
             d.SC.eevee.taa_render_samples, render.filepath, render.image_settings.file_format) = settings
    return None


def preview(times, out, samples=4):
    """Use the new main's --times path; its anchors stay full-index at30fps."""
    values = [float(t) for t in times.split(',')] if isinstance(times, str) else list(map(float, times))
    ns = EPISODES['d1b_s3']
    assert values and all(0 <= t < ns['DATA']['duration'] for t in values)
    exact = ','.join('%.9f' % (round(t * 30) / 30) for t in values)
    return _call('PREVIEW_S3', exact, out, samples)


def refresh_behavior():
    """Reload this new scene's functions/cameras only; never rebuild geometry.

    Use only after confirming the loaded machine/extras already match the
    current component file. Geometry changes require build(), not this method.
    """
    import importlib
    ns=EPISODES['d1b_s3']['main'].__globals__
    assert 'door_positioning' in ns['S3_EXTRAS'], 'New component geometry is not yet loaded'
    assert ns['M']['s3']['pump']['foot'].get('detail_primary'), 'New detail roles are not loaded'
    ns['mx']=importlib.reload(ns['mx'])
    ns['s3qa']=importlib.reload(ns['s3qa'])
    tree=ast.parse(SCRIPT.read_text(),str(SCRIPT))
    keep=[]
    for item in tree.body:
        if isinstance(item,(ast.FunctionDef,ast.ClassDef)):
            keep.append(item)
        elif isinstance(item,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='CAM' for t in item.targets):
            keep.append(item)
        elif isinstance(item,ast.Expr) and isinstance(item.value,ast.Call):
            f=item.value.func
            if isinstance(f,ast.Attribute) and isinstance(f.value,ast.Name) and f.value.id=='CAM' and f.attr=='update':
                keep.append(item)
    exec(compile(ast.Module(body=keep,type_ignores=[]),str(SCRIPT),'exec'),ns)
    ns['S3_BUILT_SOURCE_KEY']=ns['render_key']()
    EPISODES['d1b_s3']=ns
    with open(LOG,'a',buffering=1) as log:
        print('REFRESHED_S3_BEHAVIOR',ns['S3_BUILT_SOURCE_KEY'],file=log)
    return None


def production():
    """Resume only the new S3 raw render. STOP_S3 is never deleted."""
    return _call('PRODUCTION_S3', samples=4)
