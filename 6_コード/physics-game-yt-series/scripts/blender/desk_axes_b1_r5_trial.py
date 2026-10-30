"""B-1: rebuild its own changed geometry, then inspect before any full-film render."""
import runpy,sys,json,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
c='/private/tmp/ys/ys-chain-b1v1'
sys.argv=['desk_b1v1.py','--','--cache',c,'--force']
nsB1r5=runpy.run_path(W+'/scripts/blender/desk_b1v1.py',run_name='b1_r5_trial')
print('B1 r5 own parts built and calibrated',flush=True)
nsB1r5['bpy'].context.window.scene=nsB1r5['d'].SC
nsB1r5['main'].__globals__['CHECK_VISIBILITY']=True
for cue in nsB1r5['CUES']:
    for f in [.03,.2,.4,.6,.8,.97]:nsB1r5['apply'](cue['start']+(cue['end']-cue['start'])*f)
nsB1r5['main'].__globals__['CHECK_VISIBILITY']=False
json.dump(nsB1r5['VISIBILITY_STATS'],open(c+'/blender/b1-r5-visibility-proof.json','w'),indent=1)
nsB1r5['catalog']()
base=nsB1r5['DATA']['preview']+[18,39,46.6,52.4,59.7,68.6,70,76.7,94.5,96.4,97.7,137.23,160.8,161.5,162.5,172.9,196.6,206.9,208.8,211,217.07,224.2,235.4,239.4,249.4,271.6,272.4,276,288.6,298.2,320.2,340.8,348.07,355.87]
times=sorted(set(round(t*30)/30 for t in base))
json.dump({'times':times},open(c+'/blender/preview-times-b1v1-r5.json','w'),indent=1)
a=nsB1r5['A'];a.times=','.join(map(str,times));a.out=c+'/blender/preview-r5';a.force=True
nsB1r5['main']();nsB1r5['write_problem']()
print('B1 r5 trial DONE; full probe still not authorized by visual gate',flush=True)
