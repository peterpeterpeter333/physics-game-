"""Isolated post-restart recovery and narrowly scoped render-job reader.

Activated once from Blender's console. Jobs contain data, never Python code.
Only the existing D1a runner's approved actions are available; no UI input is
simulated and no old asset/cache/log is written. Import itself is inert.
"""
import contextlib, hashlib, importlib.util, json, os, sys, time, traceback
from pathlib import Path
import bpy

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
CACHE=Path('/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028')
LOG=CACHE/'restart-recovery_20261028.log'
QUEUE=CACHE/'jobs'
RUNNER=None
BUSY=False

def _module(name):
    file=W/'scripts/blender'/name
    spec=importlib.util.spec_from_file_location(file.stem,file)
    mod=importlib.util.module_from_spec(spec)
    prior=sys.dont_write_bytecode;sys.dont_write_bytecode=True
    try:spec.loader.exec_module(mod)
    finally:sys.dont_write_bytecode=prior
    return mod

def _record(file,value):
    file=Path(file);assert CACHE in file.parents and not file.is_symlink()
    file.parent.mkdir(parents=True,exist_ok=True)
    with file.open('x')as f:json.dump(value,f,ensure_ascii=False,indent=1)

def recover():
    """Rebuild executable scene references; retain the separate .blend backup."""
    global RUNNER
    assert not bpy.app.background and RUNNER is None
    QUEUE.mkdir(exist_ok=True)
    with LOG.open('a',buffering=1)as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            started=time.time();print('RECOVERY_START',os.getpid(),time.strftime('%Y-%m-%dT%H:%M:%S%z'),flush=True)
            base=_module('desk_d1a_s3_gui_gpt_20261028.py')
            # This is an in-memory module override, not an edit to that file.
            # The frozen S3 cache is used for reading inputs only.
            base.LOG=LOG
            base.build()
            runner=_module('desk_d1a_s4_gpt_20261028.py')
            runner.bind(base.NS);RUNNER=runner
            ns=runner.NS;d=ns['d'];sc=d.SC
            settings=(sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage,
                      sc.render.image_settings.file_format,sc.render.filepath,sc.eevee.taa_render_samples)
            t=ns['W']('guericke:pull','押し開けて')+.4
            with bpy.context.temp_override(window=bpy.context.window,scene=sc,view_layer=sc.view_layers[0]):
                try:
                    runner.apply(ns,t)
                    image=CACHE/'restart-native-probe_20261028.png';assert not image.exists()
                    sc.render.resolution_x=1080;sc.render.resolution_y=1920;sc.render.resolution_percentage=100
                    sc.eevee.taa_render_samples=16;sc.render.image_settings.file_format='PNG';sc.render.filepath=str(image)
                    probe=time.time();bpy.ops.render.render(write_still=True,scene=sc.name);probe=time.time()-probe
                finally:
                    (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage,
                     sc.render.image_settings.file_format,sc.render.filepath,sc.eevee.taa_render_samples)=settings
            _record(CACHE/'restart-recovery_20261028.json',dict(pid=os.getpid(),version=bpy.app.version_string,
                scene=sc.name,objects=len(sc.objects),nativeProbe=str(image),probeResolution=[1080,1920],
                probeSamples=16,probeRenderSeconds=probe,elapsedSeconds=time.time()-started,
                restartSucceeded=True,sceneRecovered=True,loweredQuality=False,
                baseLogsRedirectedTo=str(LOG),oldAssetsEdited=False,ready=True))
            if not bpy.app.timers.is_registered(poll):bpy.app.timers.register(poll,first_interval=1)
            print('RECOVERY_READY',len(sc.objects),time.time()-started,flush=True)
        except BaseException:traceback.print_exc();raise
    return None

def poll():
    """No UI events. Only pre-existing D1a scene/render operations are allowed."""
    global BUSY
    if RUNNER is None or BUSY or (QUEUE/'PAUSE').exists():return 1.
    jobs=[p for p in sorted(QUEUE.glob('*.json'))if not p.name.endswith(('.done.json','.error.json'))
          and not p.with_name(p.stem+'.done.json').exists()and not p.with_name(p.stem+'.error.json').exists()]
    if not jobs:return 1.
    p=jobs[0];BUSY=True
    with LOG.open('a',buffering=1)as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            assert p.parent==QUEUE and not p.is_symlink()
            job=json.loads(p.read_text());action=job['action'];started=time.time()
            print('JOB_START',p.name,action,flush=True)
            if action=='preview':RUNNER.preview(job['label'],job.get('times'))
            elif action=='refresh':RUNNER.refresh(rebuild=bool(job.get('rebuild',False)))
            elif action=='production':RUNNER.production()
            elif action=='resume':RUNNER.resume()
            elif action=='problem':RUNNER.problem()
            elif action=='source-definition':_record(CACHE/job['output'],RUNNER.source_definition())
            else:raise ValueError('Unapproved job action: '+str(action))
            _record(p.with_name(p.stem+'.done.json'),dict(action=action,job=str(p),elapsedSeconds=time.time()-started,
                    pid=os.getpid(),completed=True))
            print('JOB_DONE',p.name,flush=True)
        except BaseException as e:
            traceback.print_exc()
            _record(p.with_name(p.stem+'.error.json'),dict(job=str(p),error=repr(e),completed=False))
        finally:BUSY=False
    return 1.
