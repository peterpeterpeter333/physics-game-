"""Independent geometry projection evidence, not a substitute for the unchanged visual gate."""
import runpy,json,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
auditC=runpy.run_path(W+'/scripts/blender/desk_c1v1_bounds_audit.py')
auditC['audit'](nsC1)
ns=nsB1r4;ns['bpy'].context.window.scene=ns['d'].SC
rows=[]
for cue in ns['CUES']:
    t=cue['end']-.2;ns['apply'](t);ns['bpy'].context.view_layer.update()
    vertices=ns['hero_points'](cue['camera'])
    if not vertices:raise RuntimeError('No physical B1 hero points for '+cue['camera'])
    pts=[ns['d'].project(p) for p in vertices]
    xs=[p[0] for p in pts];ys=[p[1] for p in pts]
    rows.append({'cue':cue['key'],'row':cue['row'],'time':t,'camera':cue['camera'],
      'projectedWidth':(max(xs)-min(xs))/1080,'left':min(xs),'right':max(xs),'top':min(ys),'bottom':max(ys)})
out='/private/tmp/ys/ys-chain-b1v1/blender/physical-hero-projection-b1v1.json'
json.dump({'scope':'physical actual hero geometry at each cue end; separate from original raw-feature 7b gate','rows':rows},open(out,'w'),indent=1)
print('B1 physical projection evidence:',out,flush=True)
