"""One bundled real-framing/state/scene-safety correction; no model rebuild."""
import ast,hashlib,json,os
EXPECTED_SOURCE='b5a2aa7fd8f5292ea592d139438e9f108b1c85df9f315e0de2b138094d836293'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
NAMES={'camera_pose_d1','pose_at','set_camera','cam_keys','weights_state','catalog','problem','main'}
def install(ns):
    g=ns['main'].__globals__;folder=os.path.dirname(os.path.abspath(__file__));source=folder+'/desk_d1v1.py';sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE and sha(folder+'/desk_lib_d1.py')==EXPECTED_LIB,'D1 r10 frozen source changed'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA and g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'D1 supplied data changed'
    assert g['_VIS_QUEUE'] is None,'D1 visibility transaction still active'
    g['bpy'].context.window.scene=g['d'].SC
    from desk_render_axes import explicit_scene_bpy
    g['explicit_scene_bpy']=explicit_scene_bpy
    tree=ast.parse(open(source).read());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['D1_POSES','SPANS','EVENTS'] for t in n.targets) or isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS']
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source,'exec'),g)
    for name in NAMES|{'D1_POSES','SPANS','EVENTS'}:ns[name]=g[name]
    return {'episode':'D-1','revision':'r10','sourceSha256':EXPECTED_SOURCE,'geometryChanged':False,'modelsRebuilt':False,'explicitSceneRender':g['d'].SC.name,'physicalFramingChanges':['scoreboard','horse itself','engine assembly','can pressure arrows','weight arrival preparation and within-frame descent','palm/100kg','inside comparison','two cans','full cylinder pressure arrows','2t close then four-horse reveal','eight-horse pullback','balloon expansion/condensation camera follows real scale'],'testsAndThresholdsUnchanged':True}
