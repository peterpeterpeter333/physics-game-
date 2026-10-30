"""r9 genuine framing fixes only; keep the supplied models and all thresholds."""
import ast,hashlib,json,os,time
EXPECTED_SOURCE='8a7051f25dceea765ff369a50195fd1974ff731a414d7efa8c92b4d9fbbb8f6c'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
NAMES={'camera_pose_d1','pose_at','set_camera','cam_keys'}
def install(ns):
    g=ns['main'].__globals__;folder=os.path.dirname(os.path.abspath(__file__));source=os.path.join(folder,'desk_d1v1.py');sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
    assert sha(source)==EXPECTED_SOURCE and sha(folder+'/desk_lib_d1.py')==EXPECTED_LIB,'Frozen D1 r9 source/geometry changed'
    assert sha(g['A'].cache+'/blender/data.json')==EXPECTED_DATA and g['DATA']==json.load(open(g['A'].cache+'/blender/data.json')),'D1 data changed'
    assert g['_VIS_QUEUE'] is None and 'D1_HL' in g,'D1 namespace is not idle r8'
    g['bpy'].context.window.scene=g['d'].SC;tree=ast.parse(open(source).read())
    nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in NAMES or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='D1_POSES' for t in n.targets)]
    exec(compile(ast.Module(body=nodes,type_ignores=[]),source,'exec'),g)
    for name in NAMES|{'D1_POSES'}:ns[name]=g[name]
    return {'revision':'r9','sourceSha256':EXPECTED_SOURCE,'modelsRebuilt':False,'geometryChanged':False,'updates':'mine distance 1.02, square lens196, full balanced-arrow framing, open-hemisphere framing'}

def check_bounds(ns,out):
    if os.path.exists(out):raise RuntimeError('Existing D1 r9 actual-bounds evidence preserved')
    g=ns['main'].__globals__;d=g['d'];V=g['Vector'];P=g['P'];created=g['CREATED_NAME'];rows=[]
    def descendants(o):return [o]+[v for c in g['CHILDREN'].get(o,()) for v in descendants(c)]
    def bbox(objects):
        p=[d.project(o.matrix_world@V(c)) for o in objects if o.type in ['MESH','FONT','CURVE'] and not o.hide_render for c in o.bound_box];assert p
        return {'x0':min(a[0] for a in p),'x1':max(a[0] for a in p),'y0':min(a[1] for a in p),'y1':max(a[1] for a in p),'widthRatio':(max(a[0] for a in p)-min(a[0] for a in p))/1080,'allCornersInFrame':all(a[2] for a in p)}
    def measure(t,role,objects,critical=None,require_size=True):
        g['apply'](t);g['bpy'].context.view_layer.update();b=bbox(objects);cb=bbox(critical) if critical else None
        size_ok=.40<=b['widthRatio']<=.70 if require_size else True;frame_ok=b['allCornersInFrame'] and b['x0']>=40 and b['x1']<=1040 and b['y0']>=110 and b['y1']<=1600
        critical_ok=cb is None or cb['allCornersInFrame'] and cb['x0']>=40 and cb['x1']<=1040 and cb['y0']>=110 and cb['y1']<=1100
        row={'time':t,'actualHero':role,'actualPose':g['pose_at'](t),'hero':b,'critical':cb,'physicalSize40to70':size_ok,'frameSafe':frame_ok,'criticalClearOfCaption':critical_ok,'pass':size_ok and frame_ok and critical_ok};rows.append(row)
    square=next(o for o in g['G']['weights'] if created[o]=='d1_squarecm')
    for t in [0,2,20]:measure(t,'mine without hands/score/background',g['G']['mine'])
    measure(104,'transparent balloon only, alpha .25 unchanged',[P['balloon']['balloon']])
    measure(169.8,'actual plain 1cm square only',[square],[square])
    one=descendants(P['weights']['one']);measure(172.3,'actual 1kg and engraving',one,[o for o in one if o.type=='FONT'])
    q=P['engine'];arrows=descendants(q['push'])+descendants(q['balance'])
    for t in [234,243]:measure(t,'cylinder/boiler/piston and both equal-force arrows',[q['boiler'],q['shell'],q['piston']]+arrows,arrows)
    q=P['hemi'];hero=q['parts']+[q['seam'],q['valve'],q['valvepipe']]
    for t in [327,334]:measure(t,'actual copper hemispheres and valve only',hero)
    measure(403.3,'complete mine and engine',g['G']['mine']+g['G']['engine'],[P['mine']['marker']])
    record={'episode':'D-1','revision':'r9','createdAt':time.strftime('%Y-%m-%d %H:%M:%S'),'sourceSha256':EXPECTED_SOURCE,'status':'actual mesh projection only; no waiver of the original image heuristic','allObjectsAreActualHero':True,'pass':all(r['pass'] for r in rows),'rows':rows}
    json.dump(record,open(out,'w'),indent=1);print(json.dumps(record),flush=True)
    assert record['pass'],'D1 r9 real geometry bounds/caption safety failed before rendering'
    return record
