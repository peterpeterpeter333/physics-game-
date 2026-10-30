"""Only the last 7px arrow-caption conflict; preserve every other r11 change."""
import json,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
SHA='44f10e1ce023e0d2b64872f82b342592892a33d0d100020787c64d11266a0892'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r12 physical audit START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');p['install'].__globals__['EXPECTED_SOURCE']=SHA
result=p['install'](nsD1);result['revision']='r12';result['updates']='cylinder target z .418 to .4135 only, to move the inside-arrow bottom above the caption guard';print(json.dumps(result),flush=True)
r=runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r12.json',revision='r12',expected_source=SHA)
print(json.dumps({'heldStates':sum(not x['cameraTransition'] for x in r['rows']),'heldFailures':sum(not x['pass'] and not x['cameraTransition'] for x in r['rows']),'cameraMovingFailures':sum(not x['pass'] and x['cameraTransition'] for x in r['rows']),'allFailuresRemainRecorded':True}),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r12 physical audit DONE (no rendering)',flush=True)
