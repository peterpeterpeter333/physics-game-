"""B-1: one grouped correction from the complete 357-image independent review."""
import runpy,sys,time,json,hashlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';c='/private/tmp/ys/ys-chain-b1v1'
sys.argv=['desk_b1v1.py','--','--cache',c]
nsB1r6=runpy.run_path(W+'/scripts/blender/desk_b1v1.py',run_name='b1_r6_trial')
nsB1r6['bpy'].context.window.scene=nsB1r6['d'].SC
_axes_guard(nsB1r6)
a=nsB1r6['A'];a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16
times=[20.1,24,82,94.5,97.7,114,135.4,136.2,137.23,163.73,164,164.4,165,168,185.9,196.6,217.07,235.4,249.4,272.4,276,288.6,294.4,298.2,302,305,320.2,340.8,348.07,354]
times=sorted(set(round(t*30)/30 for t in times));json.dump({'times':times},open(c+'/blender/preview-times-b1v1-r6.json','w'),indent=1)
a.times=','.join(map(str,times));a.out=c+'/blender/preview-r6';nsB1r6['main']()
nsB1r6['catalog'](names={'globe'},out_dir=c+'/blender/catalog-globe-r6')
nsB1r6['write_problem']()
json.dump({'revision':'r6','sourceSha256':hashlib.sha256(open(W+'/scripts/blender/desk_b1v1.py','rb').read()).hexdigest(),'times':times,'fixes':['compass dial clear of captions during star scene','hand route leaves placed needles visible','one-second iron-powder alignment starts quickly at the specified word','same graticule ink made readable, no extra geographic pattern','sixty percent globe transparency','diagonal view gives the globe and compass sufficient room','red-pole/caption clearance']},open(c+'/blender/b1-r6-trial-record.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'B1 r6 grouped trial DONE',flush=True)
