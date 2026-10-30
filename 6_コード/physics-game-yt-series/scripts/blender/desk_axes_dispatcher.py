"""Temporary active-task render queue; stops on an explicit stop item. No network."""
import bpy,os,json,time,traceback,contextlib
from pathlib import Path
_AXES_SESSION=globals()
_AXES_ROOT=Path('/private/tmp/ys/axes-active-queue')
_AXES_ROOT.mkdir(parents=True,exist_ok=True)
_AXES_SCRIPT_ROOT=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender')
def _axes_guard(ns):
    state=ns['main'].__globals__
    if getattr(state['apply'],'_axes_guarded',False):return
    original=state['apply']
    def guarded(t):
        if (_AXES_ROOT/'cancel').exists():raise InterruptedError('Render cancelled by user request')
        return original(t)
    guarded._axes_guarded=True;state['apply']=guarded
def _axes_poll():
    if (_AXES_ROOT/'cancel').exists():
        (_AXES_ROOT/'status.json').write_text(json.dumps({'status':'cancelled','time':time.time()}));return None
    jobs=sorted(p for p in _AXES_ROOT.glob('job-*.json') if not p.name.endswith('.done.json'))
    for path in jobs:
        done=path.with_suffix('.done.json')
        if done.exists():continue
        started=time.time();record={'job':str(path),'started':started,'status':'running'}
        try:
            job=json.loads(path.read_text())
            if job.get('action')=='stop':
                record.update(status='stopped',ended=time.time());done.write_text(json.dumps(record));return None
            source=Path(job['script']).resolve()
            if source.parent!=_AXES_SCRIPT_ROOT or not source.name.startswith('desk_axes_') or source.suffix!='.py':raise ValueError('Only this task\'s workspace render runners are allowed')
            record['script']=str(source);(_AXES_ROOT/'status.json').write_text(json.dumps(record))
            with open(path.with_suffix('.log'),'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
                print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',source,flush=True)
                exec(compile(source.read_text(),str(source),'exec'),_AXES_SESSION)
                print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True)
            record['status']='done'
        except BaseException:
            record['status']='failed';record['error']=traceback.format_exc()
            with open(path.with_suffix('.log'),'a') as log:log.write(record['error'])
        record.update(ended=time.time(),seconds=time.time()-started)
        done.write_text(json.dumps(record,ensure_ascii=False,indent=1));(_AXES_ROOT/'status.json').write_text(json.dumps(record))
    return 1.0
if not bpy.app.timers.is_registered(_axes_poll):bpy.app.timers.register(_axes_poll,first_interval=.5)
print('AXES active-task render dispatcher ready',flush=True)
