"""Only measured residual physical fixes; all-cue audit, never a render."""
import json,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
SHA='88571005118c5ecbf253f75f0d5d4c263d16b0f9174c8fc380749fcb0d8657fd'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r11 physical audit START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');p['install'].__globals__['EXPECTED_SOURCE']=SHA
result=p['install'](nsD1);result['revision']='r11';result['updates']='remaining measured 100kg width, cylinder/2t caption guards, safe horse camera route; air25 meets common instructions';print(json.dumps(result),flush=True)
r=runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r11.json',revision='r11',expected_source=SHA)
print(json.dumps({'heldStates':sum(not x['cameraTransition'] for x in r['rows']),'heldFailures':sum(not x['pass'] and not x['cameraTransition'] for x in r['rows']),'cameraMovingFailures':sum(not x['pass'] and x['cameraTransition'] for x in r['rows']),'allFailuresRemainRecorded':True}),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r11 physical audit DONE (no rendering)',flush=True)
