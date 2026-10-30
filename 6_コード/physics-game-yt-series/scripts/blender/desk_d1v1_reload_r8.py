"""D1 r8 pose/focus-only patch and real geometry pre-render projection checks."""
import ast,hashlib,json,os
EXPECTED_SOURCE='8b6f87b246a902dacfb69aa8197e8e7d193bc2c7df1ad26f92b7a7a8799cf100'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
NAMES={'pose_at','set_camera','cam_keys'}
def install(ns):
    g=ns['main'].__globals__;source=os.path.join(os.path.dirname(os.path.abspath(__file__)),'desk_d1v1.py');sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE and sha(os.path.join(os.path.dirname(source),'desk_lib_d1.py'))==EXPECTED_LIB,'D1 r8 source/geometry changed'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA and g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'D1 data changed'
    assert g['_VIS_QUEUE'] is None and 'D1_HL' in g,'D1 apply active / install r6,r7 first'
    g['bpy'].context.window.scene=g['d'].SC
    tree=ast.parse(open(source).read());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES];assert {n.name for n in nodes}==NAMES
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source,'exec'),g)
    for name in NAMES:ns[name]=g[name]
    return {'revision':'r8','sourceSha256':EXPECTED_SOURCE,'modelsRebuilt':False,'updatedFunctions':sorted(NAMES),'requiresPreviouslyInstalled':'r7-finalfreeze'}

def check_bounds(ns,out):
    g=ns['main'].__globals__;d=g['d'];V=g['Vector'];created=g['CREATED_NAME'];reports=[]
    def descendants(o):return [o]+[v for c in g['CHILDREN'].get(o,()) for v in descendants(c)]
    def bbox(objects):
        pts=[d.project(o.matrix_world@V(v)) for o in objects if o.type in ['MESH','FONT','CURVE'] and not o.hide_render for v in o.bound_box]
        assert pts,'No actual D1 hero geometry'
        return {'x0':min(p[0] for p in pts),'y0':min(p[1] for p in pts),'x1':max(p[0] for p in pts),'y1':max(p[1] for p in pts),'allCornersInFrame':all(p[2] for p in pts)}
    def assess(t,role,objects,critical):
        g['apply'](t);b=bbox(objects);cb=bbox(critical);b['widthRatio']=(b['x1']-b['x0'])/1080
        record={'time':t,'role':role,'actualPose':g['pose_at'](t),'hero':b,'critical':cb,'criticalClearOfCaption':cb['y1']<=1100,'criticalCaptionClearance':1100-cb['y1']}
        reports.append(record)
        return b['allCornersInFrame'] and b['x0']>=40 and b['x1']<=1040 and b['y0']>=100 and b['y1']<=1600 and .40<=b['widthRatio']<=.70 and record['criticalClearOfCaption']
    square=next(o for o in g['G']['weights'] if created[o]=='d1_squarecm');one=g['P']['weights']['one'];one_tree=descendants(one);labels=[o for o in one_tree if o.type=='FONT'];assert labels
    ok1=assess(169.8,'actual 1cm square only',[square],[square])
    ok2=assess(172.3,'actual 1kg weight and engraving',one_tree,labels)
    ok3=assess(403.3,'actual complete mine and engine',g['G']['mine']+g['G']['engine'],[g['P']['mine']['marker']])
    result={'episode':'D-1','revision':'r8','sourceSha256':EXPECTED_SOURCE,'status':'pre-render actual-geometry projections, not a final image gate','objectsAreActualHeroOnly':True,'captionGuardY':1100,'pass':all([ok1,ok2,ok3]),'rows':reports}
    if os.path.exists(out):raise RuntimeError('Existing D1 bounds report preserved')
    json.dump(result,open(out,'w'),indent=1);print(json.dumps(result),flush=True)
    assert result['pass'],'D1 actual hero bounds/caption clearance failed; inspect JSON before rendering'
    return result
