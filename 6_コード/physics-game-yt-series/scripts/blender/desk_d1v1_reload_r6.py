"""Install D1 r6 into an already-built D1 namespace, preserving all geometry."""
import ast,hashlib,os,json
EXPECTED_SOURCE='a4e8e9116791b75bd301bcf3575a1ceab33c5487b7b92e3eb0fc155584b1bfc4'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
NAMES={'hide_all','small_hand_d1','camera_pose_d1','pose_at','set_camera','cam_keys','revision_assets_d1','highlight_d1','stroke','engine_state','horse_state','can_state','balloon_state','weights_state','hands','apply_state_d1','hemispheres_state'}

def install(ns):
    g=ns['main'].__globals__;folder=os.path.dirname(os.path.abspath(__file__));source=os.path.join(folder,'desk_d1v1.py')
    sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE,'D1 source changed after r6 freeze'
    assert sha(os.path.join(folder,'desk_lib_d1.py'))==EXPECTED_LIB,'D1 geometry changed: fresh build required'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA,'D1 data changed: fresh build required'
    assert g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'Loaded D1 data differs'
    assert g['_VIS_QUEUE'] is None,'D1 apply is still running'
    g['bpy'].context.window.scene=g['d'].SC
    scene_objects=list(g['d'].SC.objects)
    desks=[o for o in scene_objects if o.name=='desk' or o.name.endswith('_desk')]
    assert len(desks)==1,'Ambiguous preserved D1 desk'
    g['DESK_D1']=desks[0];g['DESK_BASE_D1']=desks[0].location.copy()
    tree=ast.parse(open(source).read());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES]
    assert {n.name for n in functions}==NAMES
    exec(compile(ast.Module(body=functions,type_ignores=[]),source,'exec'),g)
    plans=[]
    for n in tree.body:
        if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id in ['D1_POSES','SPANS','EVENTS'] for x in n.targets):plans.append(n)
        if isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':plans.append(n)
    exec(compile(ast.Module(body=plans,type_ignores=[]),source,'exec'),g)
    for name in NAMES|{'D1_POSES','SPANS','EVENTS','DESK_D1','DESK_BASE_D1'}:ns[name]=g[name]
    # Build only four private material copies; no model objects are created.
    count=len(scene_objects);g['revision_assets_d1']();ns['D1_HL']=g['D1_HL']
    assert len(g['d'].SC.objects)==count,'r6 unexpectedly changed model objects'
    return {'revision':'r6','updatedFunctions':sorted(NAMES),'sourceSha256':sha(source),'geometrySha256':EXPECTED_LIB,'dataSha256':EXPECTED_DATA,'modelObjects':count,'modelsRebuilt':False,'actualPoseSource':'D1_POSES and camera_pose_d1(), including previous-pose interpolation','nominalDataUnchanged':True}
