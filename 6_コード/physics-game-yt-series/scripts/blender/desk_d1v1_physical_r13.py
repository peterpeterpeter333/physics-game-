"""Minimal real focus/can close-up bundle; read-only surface audit first."""
import json,runpy,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
SHA='b5872ce928ad4ae982a69aa04fa93c366be13f5234f060215909ab09035957e2'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r13 focus2/can actual surface audit START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');p['install'].__globals__['EXPECTED_SOURCE']=SHA
r=p['install'](nsD1);r['revision']='r13';r['updates']=['horse body focus and f/11.2','one-centimetre top-face focus and f/64','after-tongs can-only close-up; stopped throughout collapse; return during the next inter-row pause'];print(json.dumps(r),flush=True)
report=runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r13.json',revision='r13',expected_source=SHA)
held=[r for r in report['rows'] if not r['cameraTransition']]
print(json.dumps({'heldStates':len(held),'heldFailures':sum(not r['pass'] for r in held),'cameraMovingFailures':sum(not r['pass'] and r['cameraTransition'] for r in report['rows']),'allFailuresRemainRecorded':True}),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r13 actual audit DONE; trial is a separate guarded operation',flush=True)
