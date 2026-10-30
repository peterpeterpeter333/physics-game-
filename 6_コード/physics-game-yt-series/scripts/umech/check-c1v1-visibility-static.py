"""C-1の実際の関数をASTから取り出し、Blenderなしで可視性の同値性を検査。"""
import ast,os,json,hashlib,random,types
from pathlib import Path
W=Path(__file__).resolve().parents[2]
source=W/'scripts/blender/desk_c1v1.py';raw=source.read_bytes();tree=ast.parse(raw)
names={'immediate_show','queued_show','tree_nodes','cached_show_tree','private_catalog_stage'}
functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names]
assert len(functions)==len(names)
class Obj:
    def __init__(self,name,kind='MESH'):
        self.name=name;self.type=kind;self.hide_render=False;self.hide_viewport=True;self.parent=None
stats={'calls':0,'writes':0,'skipped':0,'flushes':0,'objectsVerified':0}
ns={'SHOW_QUEUE':None,'VISIBILITY_STATS':stats,'CHILDREN':{},'TREE_CACHE':{},'TREE_CALLS':0}
d=types.SimpleNamespace();ns['d']=d
exec(compile(ast.Module(body=functions,type_ignores=[]),str(source),'exec'),ns)
d.show=ns['queued_show']
rng=random.Random(20261023);objects=[Obj('n'+str(i)) for i in range(500)]
for i,o in enumerate(objects):
    o.hide_render=bool(rng.randrange(2));o.hide_viewport=bool(rng.randrange(2))
    if i and rng.random()<.92:o.parent=objects[rng.randrange(i)]
    if o.parent is not None:ns['CHILDREN'].setdefault(o.parent,[]).append(o)
def legacy_nodes(o):
    out=[o]
    for c in [c for c in objects if c.parent is o]:out.extend(legacy_nodes(c))
    return out
for o in objects:assert ns['tree_nodes'](o)==legacy_nodes(o)
initial={o:(o.hide_render,o.hide_viewport) for o in objects};expected=dict(initial)
ns['SHOW_QUEUE']={}
operations=100000
for i in range(operations):
    o=objects[rng.randrange(len(objects))];v=bool(rng.randrange(2))
    if i%7:
        ns['queued_show'](o,v);expected[o]=(not v,not v)
    else:
        ns['cached_show_tree'](o,v)
        for a in legacy_nodes(o):expected[a]=(not v,not v)
assert {o:(o.hide_render,o.hide_viewport) for o in objects}==initial,'Queue changed intermediate flags'
final=ns['SHOW_QUEUE'];ns['SHOW_QUEUE']=None
for o,v in final.items():ns['immediate_show'](o,v)
assert {o:(o.hide_render,o.hide_viewport) for o in objects}==expected
old=[Obj('previous_room_'+str(i)) for i in range(25)];old_state=[(o.hide_render,o.hide_viewport) for o in old]
fixture=[Obj(n) for n in ['floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3','winF0','picF3','leg0','stack2','tree','pin','c1_case']]+[Obj('camera','CAMERA'),Obj('light','LIGHT')]
d.SC=types.SimpleNamespace(objects=fixture);d.LIGHTS=[(types.SimpleNamespace(energy=0),8)];d.BGN=types.SimpleNamespace(inputs=[None,types.SimpleNamespace(default_value=0)])
ns['private_catalog_stage']()
exact={'floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3'};prefixes=('winF','picF','leg','stack')
for o in fixture:
    keep=o.type in ('LIGHT','CAMERA') or o.name in exact or o.name.startswith(prefixes)
    assert o.hide_render is (not keep) and o.hide_viewport is (not keep)
assert [(o.hide_render,o.hide_viewport) for o in old]==old_state
assert d.LIGHTS[0][0].energy==8 and d.BGN.inputs[1].default_value==.35
report={'pass':True,'source':str(source),'sourceSha256':hashlib.sha256(raw).hexdigest(),'fixtureObjects':500,'allTreeOrdersEqual':True,'interleavedOperations':operations,'intermediateChanges':0,'finalFlagsEqualToLegacy':True,'currentSceneCatalogRuleEqual':True,'unrelatedObjectsUnchanged':len(old),'stats':stats,'note':'実sceneの40root子孫一致・全53cue×6時刻の最終flags一致はGUI gatesでも検査する。'}
out=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'))/'c1-visibility-static-audit.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=1))
print('C-1 static visibility: PASS / 500 trees / 100000 interleaved operations / current scene only')
