"""Pure AST-only source/ref/pose map, not a model build or mutable tester."""
import ast,bisect,hashlib,json,math,re,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render');P=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
OUT=C/'d1-frozen-original-delivery-map-20261024.json'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not OUT.exists();source=W/'scripts/blender/desk_d1v1.py';shared=W/'scripts/blender/desk_lib.py'
assert sha(source)=='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
x=ast.parse(shared.read_text());z={'re':re};nodes=[n for n in x.body if isinstance(n,ast.FunctionDef)and n.name in ['norm','vowel_of']or isinstance(n,ast.Assign)and any(isinstance(t,ast.Name)and t.id=='VOW'for t in n.targets)];exec(compile(ast.Module(body=nodes,type_ignores=[]),str(shared),'exec'),z)
data=json.loads((C/'blender/data.json').read_text());g={'math':math,'bisect':bisect,'DATA':data,'CUES':data['cues'],'CUE':{c['key']:c for c in data['cues']},'STARTS':[c['start']for c in data['cues']],'PT':json.loads((C/'phrase-times.json').read_text()),'FPS':30,'d':types.SimpleNamespace(norm=z['norm'],sm=lambda x:max(0,min(1,x))**2*(3-2*max(0,min(1,x))))}
tree=ast.parse(source.read_text());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name in ['S','E','T','U','cue_at','camera_pose_d1','pose_at','plan_d1']];assign=[n for n in tree.body if isinstance(n,ast.Assign)and any(isinstance(t,ast.Name)and t.id in ['D1_POSES','SPANS','EVENTS']for t in n.targets)or isinstance(n,ast.AugAssign)and isinstance(n.target,ast.Name)and n.target.id=='SPANS'];exec(compile(ast.Module(body=nodes+assign,type_ignores=[]),str(source),'exec'),g)
nf=math.ceil(data['duration']*30);plans=[g['plan_d1'](j)for j in range(nf)];refs=[j if p[0]=='render'else p[1]for j,p in enumerate(plans)];poses=[g['pose_at'](ref/30)for ref in refs]
plan_sha=hashlib.sha256(json.dumps(plans,separators=(',',':')).encode()).hexdigest();prod=json.loads((P/'d1-production-finished.json').read_text());assert prod['planSha256']==plan_sha and prod['all12163JpegsPresent'];assert nf==12163 and sum(p[0]=='render'for p in plans)==5070
record={'episode':'D-1','helperSha256':sha(__file__),'sourceSha256':sha(source),'dataSha256':sha(C/'blender/data.json'),'phraseTimesSha256':sha(C/'phrase-times.json'),'sourceProductionCompleteSha256':sha(P/'d1-production-finished.json'),'planSha256':plan_sha,'frames':nf,'plans':plans,'unchangedOtherObjectSourceFrames':refs,'poses':poses,'poseMethod':'Frozen source AST evaluated at actual render/dup ref, not output nominal time','modelsBuilt':False,'renders':0,'originalSourcesModified':False,'finalAcceptance':False}
with OUT.open('x')as f:json.dump(record,f,ensure_ascii=False,indent=1)
print(json.dumps({'out':str(OUT),'sha256':sha(OUT),'frames':nf,'planSha256':plan_sha}))
