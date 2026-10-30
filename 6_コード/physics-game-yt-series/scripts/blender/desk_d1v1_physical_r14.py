"""Final minimal can transition/focus bundle, all-cue non-render guard first."""
import json,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
SHA='671596522217d9369f84b29061c3b8431eb89cfc6c558207295211f508a90687'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r14 focus/can actual surface audit START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');p['install'].__globals__['EXPECTED_SOURCE']=SHA;p['install'].__globals__['NAMES']=p['NAMES']|{'can_state'}
r=p['install'](nsD1);r['revision']='r14';r['updates']=['r13 horse/1cm actual focus unchanged','canclose target Z .052 to .020 keeps whole can above captions; focus actual can','hold close until existing air-pressure word then reveal existing arrows and camera over .5 seconds'];print(json.dumps(r),flush=True)
report=runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r14.json',revision='r14',expected_source=SHA)
held=[r for r in report['rows'] if not r['cameraTransition']]
print(json.dumps({'heldStates':len(held),'heldFailures':sum(not r['pass'] for r in held),'cameraMovingFailures':sum(not r['pass'] and r['cameraTransition'] for r in report['rows']),'allFailuresRemainRecorded':True}),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r14 actual audit DONE; only separate guarded small trial allowed',flush=True)
