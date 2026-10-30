"""Read-only evaluation of all literal S3 scene word() calls and knee clocks."""
from pathlib import Path
import ast,hashlib,json,math,re,types
W=Path(__file__).resolve().parents[3];C=Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029')
scene=W/'scripts/blender/desk_b2a_s3_gpt_20261029.py';raw=scene.read_text();tree=ast.parse(raw)
shared=W/'scripts/blender/desk_lib.py';base=ast.parse(shared.read_text())
bn=[n for n in base.body if (isinstance(n,ast.FunctionDef) and n.name in ('vowel_of','norm')) or (isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='VOW' for t in n.targets))]
bs={'re':re};exec(compile(ast.Module(body=bn,type_ignores=[]),str(shared),'exec'),bs)
data=json.loads((C/'blender/b2a-scene-data.json').read_text());pt=json.loads((C/'phrase-times.json').read_text())
ns={'d':types.SimpleNamespace(norm=bs['norm']),'norm':bs['norm'],'DATA':data,'ROWS':{r['row']:r for r in data['rows']},'CUES':{q['key']:q for q in data['cues']},'PT':pt,'EVENT_WARNINGS':[]}
functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ('word','kick_events')]
exec(compile(ast.Module(body=functions,type_ignores=[]),str(scene),'exec'),ns)
calls=[]
for node in ast.walk(tree):
 if isinstance(node,ast.Call) and isinstance(node.func,ast.Name) and node.func.id=='word' and len(node.args)>=2 and all(isinstance(a,ast.Constant) for a in node.args[:2]):
  row,kana=[a.value for a in node.args[:2]];kwargs={k.arg:ast.literal_eval(k.value) for k in node.keywords};v=ns['word'](row,kana,**kwargs)
  calls.append({'line':node.lineno,'call':ast.get_source_segment(raw,node),'row':row,'kana':kana,'kwargs':kwargs,'seconds':v})
kicks=ns['kick_events']()
prior=json.loads(Path(__file__).with_name('motion-events-readonly-evaluation.json').read_text())
spark=[]
for row,kana,half in [(13,'ヒバナ',.12),(16,'パチッ',.18),(19,'ヒバナオトバシタ',.14),(39,'パチッ',.14)]:
 t=ns['word'](row,kana);j=math.floor((t-half)*30)+1
 spark.append({'row':row,'kind':'spark-candidate','spokenAnchor':kana,'anchorSeconds':t,'firstPossibleFrame':j,'firstPossibleSeconds':j/30,'sourceCondition':'abs(t-anchor)<'+str(half),'note':'Read the live stage condition before using this sound; candidates are not added to the frozen voice or current mix.'})
result={'scene':str(scene),'sceneSha256':hashlib.sha256(raw.encode()).hexdigest(),'allLiteralCalls':len(calls),'calls':sorted(calls,key=lambda x:x['line']),'fallbackWarnings':ns['EVENT_WARNINGS'],'kickEvents':kicks,'kickEventsUnchangedSinceMixInput':kicks==prior['events'],'sparkCandidates':spark,'scope':'No bpy import, rendering or scene edit; exact root functions evaluated against frozen PT. This is not an ear check.'}
out=Path(__file__).with_name('s3-word-call-audit.json')
with out.open('x') as f:json.dump(result,f,ensure_ascii=False,indent=2)
print(json.dumps({'allLiteralCalls':len(calls),'fallbackWarnings':ns['EVENT_WARNINGS'],'kickEventsUnchanged':result['kickEventsUnchangedSinceMixInput'],'output':str(out)},ensure_ascii=False))
