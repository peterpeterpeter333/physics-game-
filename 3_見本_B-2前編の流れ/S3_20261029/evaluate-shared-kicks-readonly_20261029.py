"""Evaluate the scene's actual kick_events/word functions without Blender.
No duplicated movement constants. The later Blender JSON must match exactly.
"""
from pathlib import Path
import ast,hashlib,json,re,types
W=Path(__file__).resolve().parents[3]
C=Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029')
scene=W/'scripts/blender/desk_b2a_s3_gpt_20261029.py'
shared=W/'scripts/blender/desk_lib.py'
raw=scene.read_text();tree=ast.parse(raw);base=ast.parse(shared.read_text())
base_nodes=[n for n in base.body if (isinstance(n,ast.FunctionDef) and n.name in ('vowel_of','norm')) or (isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='VOW' for t in n.targets))]
base_ns={'re':re};exec(compile(ast.Module(body=base_nodes,type_ignores=[]),str(shared),'exec'),base_ns)
chosen=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ('word','kick_events')]
assert len(chosen)==2
data=json.loads((C/'blender/b2a-scene-data.json').read_text())
ns={'d':types.SimpleNamespace(norm=base_ns['norm']),'norm':base_ns['norm'],'DATA':data,'ROWS':{r['row']:r for r in data['rows']},'CUES':{q['key']:q for q in data['cues']},'PT':json.loads((C/'phrase-times.json').read_text()),'EVENT_WARNINGS':[]}
exec(compile(ast.Module(body=chosen,type_ignores=[]),str(scene),'exec'),ns)
events=ns['kick_events']();assert ns['EVENT_WARNINGS']==[],ns['EVENT_WARNINGS']
function_source='\n'.join(ast.get_source_segment(raw,n) for n in chosen)
out={'fps':30,'events':events,'shape':'150ms rise, 400ms recovery; no anticipation','provenance':{'method':'read-only AST extraction of the actual root scene word()/kick_events() plus unchanged desk_lib norm; no bpy import','scene':str(scene),'sceneSha256':hashlib.sha256(raw.encode()).hexdigest(),'motionFunctionsSha256':hashlib.sha256(function_source.encode()).hexdigest(),'mustCompareLaterTo':str(C/'blender/motion-events.json'),'fallbackWarnings':ns['EVENT_WARNINGS']}}
dest=Path(__file__).with_name('motion-events-readonly-evaluation.json')
with dest.open('x') as f:json.dump(out,f,ensure_ascii=False,indent=2)
print(json.dumps({'output':str(dest),'count':len(events),'fallbackWarnings':0},ensure_ascii=False))
