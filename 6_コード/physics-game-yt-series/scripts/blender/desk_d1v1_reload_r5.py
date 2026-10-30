"""Apply only r5 pose functions to the already-built r4 D1 scene, no model rebuild."""
import ast,hashlib,os,json
NAMES={'hide_all','small_hand_d1','pose_at','hemispheres_state','hands','apply_state_d1'}
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
EXPECTED_SOURCE='db40bb24ed333caf1046a047fed0afc72ded0a3b9785ed766ce38d753cfc5509'
def install(ns):
    g=ns['main'].__globals__;folder=os.path.dirname(os.path.abspath(__file__));source=os.path.join(folder,'desk_d1v1.py')
    sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE,'D1 source changed after r5 freeze'
    assert sha(os.path.join(folder,'desk_lib_d1.py'))==EXPECTED_LIB,'D1 geometry changed: fresh build required'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA,'D1 data changed: fresh build required'
    assert g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'Loaded D1 data differs'
    assert g['_VIS_QUEUE'] is None,'D1 apply is still running'
    scene_objects=list(g['d'].SC.objects)
    desks=[o for o in scene_objects if o.name=='desk' or o.name.endswith('_desk')]
    assert len(desks)==1,'Ambiguous preserved D1 desk'
    g['DESK_D1']=desks[0];g['DESK_BASE_D1']=desks[0].location.copy()
    tree=ast.parse(open(source).read());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES]
    assert {n.name for n in functions}==NAMES
    exec(compile(ast.Module(body=functions,type_ignores=[]),source,'exec'),g)
    plans=[]
    for n in tree.body:
        if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id in ['SPANS','EVENTS'] for x in n.targets):plans.append(n)
        if isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':plans.append(n)
    exec(compile(ast.Module(body=plans,type_ignores=[]),source,'exec'),g)
    for name in NAMES|{'SPANS','EVENTS','DESK_D1','DESK_BASE_D1'}:ns[name]=g[name]
    g['bpy'].context.window.scene=g['d'].SC
    return {'updatedFunctions':sorted(NAMES),'sourceSha256':sha(source),'geometrySha256':EXPECTED_LIB,'dataSha256':EXPECTED_DATA,'modelsRebuilt':False}
