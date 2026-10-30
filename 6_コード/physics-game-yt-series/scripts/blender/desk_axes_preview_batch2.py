"""Continue from the already constructed scenes; create only episode-owned artifacts."""
import os,sys,json,time,runpy,traceback,contextlib,hashlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
def b1_preview(ns):
    c='/private/tmp/ys/ys-chain-b1v1';log=open(c+'/b1-preview-resume.log','a',buffering=1)
    with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',flush=True)
            helper=runpy.run_path(W+'/scripts/blender/desk_b1v1_state_reload.py');helper['reload_state'](ns)
            for image in ns['bpy'].data.images:
                if os.path.realpath(image.filepath)==c+'/blender/tex/map.png':image.reload()
            ns['A'].force=True;ns['catalog']()
            times=sorted(set(round(t*30)/30 for t in ns['DATA']['preview']+[cue['end']-.2 for cue in ns['CUES']]))
            json.dump({'times':times,'frames':[round(t*30) for t in times]},open(c+'/blender/preview-times-b1v1.json','w'),indent=1)
            ns['A'].times=','.join(map(str,times));ns['A'].out=c+'/blender/preview';ns['main']();ns['write_problem']()
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True)
        except BaseException:traceback.print_exc(file=log)
def e1_preview():
    c='/private/tmp/ys/ys-chain-e1v1';log=open(c+'/e1v1-r2-gui-job.log','a',buffering=1)
    with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            frozen=json.load(open(c+'/e1v1-r2-source-freeze.json'))
            sys.argv=['desk_e1v1.py','--']+frozen['preview']['args']
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',sys.argv,flush=True)
            ns=runpy.run_path(W+'/scripts/blender/desk_e1v1.py',run_name='__main__')
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True);return ns
        except BaseException:traceback.print_exc(file=log)
def d1_preview():
    c='/private/tmp/ys/ys-chain-d1v1-render';log=open(c+'/d1-r4-gui.log','a',buffering=1)
    with contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',flush=True)
            sys.argv=['desk_d1v1.py','--','--cache',c,'--times','4,24.5,54.8,84.3,104.5,126.17,140.5,157,165,175,180,194,210.7,263.9,296,302.7,318,341.6,352,369,389,403.3','--out',c+'/blender/landmarks-d1v1-r4']
            ns=runpy.run_path(W+'/scripts/blender/desk_d1v1.py',run_name='d1_preview_r4');ns['main']()
            ns['A'].out=c+'/blender/catalog-d1v1-r4';ns['catalog']();ns['A'].out=c+'/problem-r4';ns['problem']()
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True);return ns
        except BaseException:traceback.print_exc(file=log)
b1_preview(nsB1catalog)
nsE1r2=e1_preview()
nsD1r4=d1_preview()
