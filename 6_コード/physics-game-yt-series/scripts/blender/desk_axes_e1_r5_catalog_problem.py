"""E-1's own part catalogue and independent problem-state pictures."""
import runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
run=runpy.run_path(W+'/scripts/blender/desk_e1v1_hotfix_r5.py')['run']
run(nsE1,'catalog');run(nsE1,'problem')
print(time.strftime('%Y-%m-%d %H:%M:%S'),'E1 r5 catalogue/problem DONE; no full film',flush=True)
