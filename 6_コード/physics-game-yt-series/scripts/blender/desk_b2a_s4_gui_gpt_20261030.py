"""Narrow B2a corrected S2/S3 job queue, avoiding further UI while drawing.
Only reads B2a's new scene source. No arbitrary job-code execution.
"""
from pathlib import Path
import bpy, json, contextlib, runpy, traceback, time, os
W=Path(__file__).resolve().parents[2]
C=Path('/private/tmp/ys/ys-chain-b2a_s4_gpt_20261030')
Q=C/'jobs';Q.mkdir(parents=True,exist_ok=True)
LOG=C/'blender/gui-stage.log'
NS=None;BUSY=False
def write(name,data):
    f=C/name;f.parent.mkdir(parents=True,exist_ok=True)
    f.write_text(json.dumps(data,ensure_ascii=False,indent=2))
def init():
    global NS
    with LOG.open('a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            NS=runpy.run_path(str(W/'scripts/blender/desk_b2a_s4_gpt_20261029.py'))
            write('blender/gui-ready.json',{'pid':os.getpid(),'scene':bpy.context.scene.name,'objects':len(bpy.context.scene.objects),'ready':True})
            if not bpy.app.timers.is_registered(poll):bpy.app.timers.register(poll,first_interval=1)
        except BaseException as e:
            traceback.print_exc();write('blender/gui-init-error.json',{'error':repr(e)})
    return None
def poll():
    global BUSY,NS
    if BUSY or NS is None or (Q/'PAUSE').exists():return 1.
    jobs=[p for p in sorted(Q.glob('*.json')) if not p.name.endswith(('.done.json','.error.json')) and not p.with_name(p.stem+'.done.json').exists() and not p.with_name(p.stem+'.error.json').exists()]
    if not jobs:return 1.
    jobfile=jobs[0];BUSY=True;started=time.time()
    with LOG.open('a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            job=json.loads(jobfile.read_text());action=job['action'];print('JOB_START',jobfile.name,flush=True)
            if action=='probe':NS['storyboard'](job['times'])
            elif action=='catalog':NS['catalog']()
            elif action=='storyboard':NS['storyboard']()
            elif action=='production':NS['production'](job.get('from',0),job.get('to'))
            elif action=='motion-events':NS['write_motion_events']()
            elif action=='projection':
                import importlib.util
                f=W/'scripts/blender/check_b2a_s4_projection_gpt_20261030.py'
                sp=importlib.util.spec_from_file_location('b2a_s4_projection',str(f));mod=importlib.util.module_from_spec(sp);sp.loader.exec_module(mod)
                mod.run(NS,output_dir=Path(job['out']),**({k:job[k] for k in ('sample_times','counterfactual') if k in job}))
            elif action=='refresh':
                # Refresh the new authoritative scene definitions in-place. The
                # model hierarchy and immutable timings remain initialized once.
                import ast
                source=W/'scripts/blender/desk_b2a_s4_gpt_20261029.py'
                tree=ast.parse(source.read_text());defs=[node for node in tree.body if isinstance(node,(ast.FunctionDef,ast.AsyncFunctionDef))]
                exec(compile(ast.Module(body=defs,type_ignores=[]),str(source),'exec'),NS)
                NS['CAMERAS'].clear()
            elif action=='save-new-project':
                dest=W/'outputs/ys-chain-b2a-backup/S4_20261030/B-2前編_S4作業_20261030.blend'
                assert not dest.exists();dest.parent.mkdir(parents=True,exist_ok=True)
                bpy.ops.wm.save_as_mainfile(filepath=str(dest))
            else:raise ValueError('Unsupported B2a corrected S2/S3 action '+action)
            jobfile.with_name(jobfile.stem+'.done.json').write_text(json.dumps({'action':action,'elapsedSeconds':time.time()-started,'completed':True}))
            print('JOB_DONE',jobfile.name,flush=True)
        except BaseException as e:
            traceback.print_exc();jobfile.with_name(jobfile.stem+'.error.json').write_text(json.dumps({'error':repr(e),'completed':False}))
        finally:BUSY=False
    return 1.

