"""Exercise actual E1 main reuse/scene guards with a non-rendering bpy stub.

No Blender process or image writes. This does not replace actual GUI checks.
"""
import ast
import hashlib
import json
import os
from pathlib import Path
import tempfile
import types
from types import SimpleNamespace as N

W=Path(__file__).resolve().parents[2]
C=Path('/private/tmp/ys/ys-chain-e1v1')
stage=W/'scripts/blender/desk_e1v1.py'
proxy_source=W/'scripts/blender/desk_render_axes.py'
calls=[]
owned=N(name='E1_owned_scene_test')
other=N(name='C1_other_scene_test')
fake=N(context=N(window=N(scene=other)),ops=N(render=N(render=lambda *args,**kwargs:calls.append(kwargs))))
proxy_globals={'bpy':fake}
nodes=[n for n in ast.parse(proxy_source.read_text()).body if isinstance(n,(ast.ClassDef,ast.FunctionDef))]
exec(compile(ast.Module(body=nodes,type_ignores=[]),str(proxy_source),'exec'),proxy_globals)
proxy=proxy_globals['explicit_scene_bpy']
base={'bpy':fake,'records':[]}
exec('def main():\n records.append(A["times"])\n for t in (A["times"] if A["times"] is not None else ["production"]):\n  bpy.ops.render.render(write_still=True)\n',base)
d=N(**base)
d.SC=owned
d.project=lambda value:list(value)
nodes=[n for n in ast.parse(stage.read_text()).body if isinstance(n,ast.FunctionDef) and n.name=='main']
assert len(nodes)==1
with tempfile.TemporaryDirectory(prefix='e1v1-main-guards-',dir='/private/tmp') as tmp:
    out=Path(tmp)/'frames'
    out.mkdir()
    reference=C/'blender/gate-e1v1-r5/frames/00000.jpg'
    assert reference.is_file()
    original_sha=hashlib.sha256(reference.read_bytes()).hexdigest()
    os.symlink(reference,out/'00000.jpg')
    os.symlink(reference,out/'00030.jpg')
    A=N(cache=tmp,out=str(out),times='0,1,2',every=1,scale=1,start=0,stop=10,force=False,no_anchors=False)
    g={'__file__':str(stage),'bpy':fake,'os':os,'json':json,'hashlib':hashlib,'types':types,'A':A,'d':d,'NF':100,'FPS':30,'DUR':3,'CUES':[],'DATA':{},'ext':N(__file__=str(stage)),'anchors':lambda t:{'map':(1,2,3)},'apply':lambda t:{'map':(1,2,3)},'pose_at':lambda t:(0,0,0,1,0,40,40),'CAMERAS':{'map':(0,0,0,1,0,40,40)},'POINTS':{'map':[]},'measured':lambda p,q:.5,'plan':lambda j:('render',None),'explicit_scene_bpy':proxy,'SWAY_MOTION_PROOF':{'status':'stub'}}
    exec(compile(ast.Module(body=nodes,type_ignores=[]),str(stage),'exec'),g)
    g['main']()
    assert base['records']==[[2.0]],base['records']
    assert len(calls)==1 and calls[0]['scene']==owned.name,calls
    assert fake.context.window.scene is owned
    anchors=json.loads((out/'anchors.json').read_text())['anchors']['map']
    assert all(anchors[j]==[1,2,3] for j in [0,30,60])
    # An all-existing list must not become an empty-times production call.
    A.times='0,1'
    g['main']()
    assert base['records']==[[2.0]] and len(calls)==1
    assert hashlib.sha256(reference.read_bytes()).hexdigest()==original_sha
    # Explicit attempts to target a different episode are rejected.
    try:proxy(owned).ops.render.render(write_still=True,scene=other.name)
    except RuntimeError:pass
    else:raise AssertionError('Foreign scene accepted')
    assert len(calls)==1
    result={'scope':'actual source AST with non-rendering scene stub; not GUI or film gate','stageSha256':hashlib.sha256(stage.read_bytes()).hexdigest(),'missingOnly':[2.0],'existingLinksSkipped':True,'allRequestedAnchorsComputed':True,'allExistingSkipsOriginalMain':True,'explicitOwnedSceneForwarded':True,'foreignSceneRejected':True,'referenceShaUnchanged':True,'status':'PASS'}
    target=C/('e1v1-'+os.environ.get('E1_FREEZE_TAG','r8')+'-main-guards.json')
    target.write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print(json.dumps(result,ensure_ascii=False,indent=2))
