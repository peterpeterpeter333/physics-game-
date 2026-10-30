"""No bpy import: independently smoke-test the new AST restoration helper."""
import ast,json,math,os,runpy,types,hashlib
W=os.getcwd();C='/private/tmp/ys/ys-chain-e1v1'
helper=runpy.run_path(W+'/scripts/blender/desk_axes_e1_restore_r9_20261024.py')
runner=runpy.run_path(W+'/scripts/blender/desk_axes_e1_r9_production.py')
d={};path=W+'/scripts/blender/desk_lib.py'
nodes=[n for n in ast.parse(open(path).read(),path).body if isinstance(n,ast.FunctionDef) and n.name in ['clamp','sm','lerp','pose_mix']]
exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),d)
data=json.load(open(C+'/blender/data.json'));cameras=json.load(open(C+'/blender/gate-e1v1-r9/r9-probe-actual.json'))['cameras']
g={'DATA':data,'CUES':data['cues'],'CUE':{c['key']:c for c in data['cues']},'CAMERAS':cameras,'DUR':data['duration'],'FPS':30,'math':math,'d':types.SimpleNamespace(pose_mix=d['pose_mix'])}
scope,nodes=helper['isolated_frozen'](g,W+'/scripts/blender/desk_e1v1.py');pg,expected=runner['frozen_plan']()
assert [scope['plan'](j) for j in range(11606)]==expected
physical=json.load(open(C+'/blender/gate-e1v1-r9/e1v1-r9-physical-bounds.json'))
differences=[helper['delta'](scope['pose_at'](r['time']),r['pose']) for r in physical['rows']]
assert max(differences)<=1e-9,max(differences)
for j in range(11606):assert len(scope['pose_at'](j/30))==7
freeze=json.load(open(C+'/e1v1-r9-source-freeze.json'))
assert all(helper['sha'](W+'/'+p)==h for p,h in freeze['files'].items())
report={'scope':'static no-bpy smoke only, actual GUI runtime comparison still required','status':'PASS','frames':11606,'independentFrozenPlanExactMatch':True,'render':sum(p[0]=='render' for p in expected),'dup':sum(p[0]=='dup' for p in expected),'poseProofSamples':len(differences),'poseProofMaximumDelta':max(differences),'allFramePoseLengths':7,'selectedASTTypes':sorted(set(type(n).__name__ for n in nodes)),'selectedFunctions':[n.name for n in nodes if isinstance(n,ast.FunctionDef)],'helperSha256':helper['sha'](W+'/scripts/blender/desk_axes_e1_restore_r9_20261024.py'),'unchangedV2RunnerSha256':helper['sha'](W+'/scripts/blender/desk_axes_e1_r9_production.py'),'source16Unchanged':True,'modelReload':False,'gpuRender':False}
out=C+'/e1v1-r9-restore-static-v2.json'
with open(out,'x') as f:json.dump(report,f,ensure_ascii=False,indent=2)
print(json.dumps(report,ensure_ascii=False,indent=2));print(out)
