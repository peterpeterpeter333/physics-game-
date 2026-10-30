"""Existing GUI r9 install -> actual bounds assertions -> 15 real trial frames."""
import json,os,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/landmarks-d1v1-r9'
if os.path.exists(OUT):raise RuntimeError('Existing D1 r9 trial preserved')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r9 genuine framing START',flush=True)
patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r9.py');print(json.dumps(patch['install'](nsD1)),flush=True);patch['check_bounds'](nsD1,C+'/d1-r9-actual-bounds.json')
g=nsD1['main'].__globals__;A=g['A'];A.times='0,2,20,104,169.8,172.3,175.5,229,234,243,247,327,334,390,403.3';A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['main']()
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r9 genuine framing DONE',flush=True)
