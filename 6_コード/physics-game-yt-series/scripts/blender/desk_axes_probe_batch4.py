"""Full-resolution one-second probes, followed only after visual gate trials."""
import os,sys,json,time,runpy,traceback,contextlib,hashlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
def logged(cache,name,fn):
    with open(cache+'/'+name+'.log','a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'START',flush=True);result=fn()
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'DONE',flush=True);return result
        except BaseException:traceback.print_exc(file=log)
def d1_probe():
    patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r5.py');print(patch['install'](nsD1),flush=True)
    a=nsD1['A'];a.force=True;a.times='296,306.4,311.25,325.9,332.7';a.out='/private/tmp/ys/ys-chain-d1v1-render/blender/landmarks-d1v1-r5-hands';nsD1['main']()
    a.force=False;a.times=','.join(str(i) for i in range(406));a.out='/private/tmp/ys/ys-chain-d1v1-render/blender/probe1s-d1v1-r5';nsD1['main']()
    finish=runpy.run_path(W+'/scripts/blender/desk_d1v1_catalog_finish.py');print(finish['finish'](nsD1,'/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-final'),flush=True)
def c1_probe():
    patch=runpy.run_path(W+'/scripts/blender/desk_c1v1_refine.py');patch['trial'](nsC1)
    nsC1['bpy'].context.window.scene=nsC1['d'].SC
    a=nsC1['A'];a.force=False;a.times=','.join(str(i) for i in range(361));a.out='/private/tmp/ys/ys-chain-c1v1/blender/probe1s';nsC1['main']()
def b1_probe():
    c='/private/tmp/ys/ys-chain-b1v1';sys.argv=['desk_b1v1.py','--','--cache',c,'--force']
    ns=runpy.run_path(W+'/scripts/blender/desk_b1v1.py',run_name='b1_probe_r4')
    ns['main'].__globals__['CHECK_VISIBILITY']=True
    for cue in ns['CUES']:
        for f in [.03,.2,.4,.6,.8,.97]:ns['apply'](cue['start']+(cue['end']-cue['start'])*f)
    print('B1 all 50 x 6 states PASS',flush=True)
    ns['main'].__globals__['CHECK_VISIBILITY']=False
    json.dump(ns['VISIBILITY_STATS'],open(c+'/blender/b1-visibility-proof.json','w'),indent=1)
    ns['catalog']()
    base=ns['DATA']['preview']+[c['end']-.2 for c in ns['CUES']]+[18,24,39,46.6,52.4,68.6,69.2,70,71.1,94.5,96.4,96.7,97,97.7,206.9,211,248.8,249.4,294.4,298.2,320.2,340.8,343.4]
    times=sorted(set(round(t*30)/30 for t in base));json.dump({'times':times},open(c+'/blender/preview-times-b1v1.json','w'),indent=1)
    ns['A'].times=','.join(map(str,times));ns['A'].out=c+'/blender/preview';ns['main']();ns['write_problem']()
    return ns
logged('/private/tmp/ys/ys-chain-d1v1-render','d1-probe-batch4',d1_probe)
logged('/private/tmp/ys/ys-chain-c1v1','c1-probe-batch4',c1_probe)
nsB1r4=logged('/private/tmp/ys/ys-chain-b1v1','b1-probe-batch4',b1_probe)
