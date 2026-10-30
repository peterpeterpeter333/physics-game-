"""r7: preserve built models; fix the actual subtitle clearance and final framing."""
import ast,hashlib,json,os
EXPECTED_SOURCE='98025d830f9405f6a4f2ff1a82f97b76b8d07c050bb0ca6a488b658b1803bbd1'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
NAMES={'pose_at','cam_keys','horse_state'}
def install(ns):
    g=ns['main'].__globals__;folder=os.path.dirname(os.path.abspath(__file__));source=os.path.join(folder,'desk_d1v1.py');sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE,'D1 r7 source changed'
    assert sha(os.path.join(folder,'desk_lib_d1.py'))==EXPECTED_LIB,'D1 geometry changed'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA and g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'D1 data changed'
    assert '_VIS_QUEUE' in g and g['_VIS_QUEUE'] is None and 'D1_HL' in g,'Install r6 first / apply still active'
    g['bpy'].context.window.scene=g['d'].SC
    tree=ast.parse(open(source).read());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES]
    assert {n.name for n in nodes}==NAMES
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source,'exec'),g)
    plans=[]
    for n in tree.body:
        if isinstance(n,ast.Assign) and any(isinstance(x,ast.Name) and x.id in ['SPANS','EVENTS'] for x in n.targets):plans.append(n)
        if isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':plans.append(n)
    exec(compile(ast.Module(body=plans,type_ignores=[]),source,'exec'),g)
    for name in NAMES|{'SPANS','EVENTS'}:ns[name]=g[name]
    return {'revision':'r7','sourceSha256':EXPECTED_SOURCE,'geometrySha256':EXPECTED_LIB,'dataSha256':EXPECTED_DATA,'updatedFunctions':sorted(NAMES),'modelsRebuilt':False,'requiresPreviouslyInstalled':'r6'}
