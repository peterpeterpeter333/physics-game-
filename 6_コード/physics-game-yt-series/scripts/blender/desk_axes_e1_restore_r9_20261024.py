"""Root-only restoration of frozen E1 control functions, never model reload.

The unchanged production runner remains the final guard.  First compile and
test in an isolated dictionary; install only pose_at/plan and their frozen
KEYS/SPANS/EVENTS into the original episode globals after all-frame checks.
This keeps d.show and the visibility transaction bound to the SAME globals.
Importing this module neither modifies a scene nor renders.
"""
import ast,collections,dis,hashlib,io,json,math,os,runpy,time

WORK='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
CACHE='/private/tmp/ys/ys-chain-e1v1'
RUNNER=WORK+'/scripts/blender/desk_axes_e1_r9_production.py'
RUNNER_SHA='5ace957318aedf51261034af2b9bf2949d8c6cd6d2e476afb5e1b6c27103c8ad'
TIMES=[0,1.5,31.5,38.5,55.2,71.85,73.55,74.15,81.8,87.45,87.85,88.25,89.23,103.46666666666667,106.86666666666666,114.5,131,156.8,199.5,233.8,249.8,255.75,260.5,284,292,295.6,297.95,300,309.4,317.53333333333336,318.8,320.76,326.43,336.25,336.85,350,354.3,359,366.3,378.4,385,386.5]
PRINCIPALS={'map':['chart'],'grid':['chart'],'globe':['globe'],'latitude':['globe'],'star':['globe'],'dial':['globe','dial'],'torch':['globe','torch'],'clocks':['tokyo','london'],'arc':['globe','arcs'],'ship':['ship'],'clock':['shipclock'],'log':['ship'],'pendulum':['pendulum'],'sway':['ship','pendulum'],'prize':['prize']}

def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for b in iter(lambda:f.read(1<<20),b''):h.update(b)
    return h.hexdigest()

def write_new(path,value):
    with open(path,'x') as f:json.dump(value,f,ensure_ascii=False,indent=2)

def disassembly(fn):
    output=io.StringIO();dis.dis(fn,file=output);return output.getvalue()

def delta(a,b):
    if isinstance(a,(tuple,list)) and isinstance(b,(tuple,list)):
        assert len(a)==len(b),(len(a),len(b))
        return max([delta(x,y) for x,y in zip(a,b)]+[0])
    return abs(float(a)-float(b))

def isolated_frozen(g,path):
    # Select declarations ONLY. No imports, top-level calls, factories,
    # calibration, material edits, or global Blender initialization execute.
    data=json.load(open(CACHE+'/blender/data.json'))
    assert data==g['DATA'] and data['cues']==g['CUES']
    scope={**g,'DATA':data,'CUES':data['cues'],'CUE':{c['key']:c for c in data['cues']},'CAMERAS':dict(g['CAMERAS'])}
    functions={'T','camera_keys','pose_at','plan'};assignments={'S','E','KEYS','SPANS','EVENTS'};nodes=[]
    for n in ast.parse(open(path).read(),path).body:
        if isinstance(n,ast.FunctionDef) and n.name in functions:nodes.append(n)
        elif isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in assignments:nodes.append(n)
        elif isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':nodes.append(n)
    assert {n.name for n in nodes if isinstance(n,ast.FunctionDef)}==functions
    exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),scope)
    return scope,nodes

def capture(g,t):
    g['bpy'].context.window.scene=g['d'].SC
    anchors=g['apply'](t);c=g['current'](t);d=g['d'];points=[]
    for name in PRINCIPALS[c['camera']]:
        for ob in g['GROUPS'][name]:
            if ob.hide_render:continue
            if c['camera']=='prize' and not(ob.type=='MESH' and d.MATS['e1leather'] in list(ob.data.materials)):continue
            if ob.type=='MESH':points.extend(ob.matrix_world@v.co for v in ob.data.vertices)
            elif ob.type=='CURVE':
                for spline in ob.data.splines:points.extend(ob.matrix_world@g['Vector'](p.co[:3]) for p in spline.points)
    q=[d.project(v) for v in points];assert q
    return {'time':t,'cue':c['key'],'camera':c['camera'],'pose':list(g['pose_at'](t)),'box':[min(v[0] for v in q),min(v[1] for v in q),max(v[0] for v in q),max(v[1] for v in q)],'anchorsWorld':{k:list(v) for k,v in anchors.items()},'anchorsProjected':{k:list(d.project(v)) for k,v in anchors.items()}}

def run(ns,render=False):
    assert sha(RUNNER)==RUNNER_SHA,'Do not alter or bypass the frozen v2 runner'
    runner=runpy.run_path(RUNNER);signature=runner['signature']
    g=ns['apply'].__globals__;bpy=g['bpy'];d=g['d'];path=g['__file__']
    assert path==WORK+'/scripts/blender/desk_e1v1.py' and g['A'].cache==CACHE
    assert g['_SHOW_QUEUE'] is None,'Visibility transaction must be idle'
    assert d.show.__globals__ is g and d.show_tree.__globals__ is g,'Keep existing d.show transaction binding'
    freeze=json.load(open(CACHE+'/e1v1-r9-source-freeze.json'))
    assert all(sha(WORK+'/'+p)==h for p,h in freeze['files'].items())
    assert sha(CACHE+'/ys-chain-e1v1.wav')==freeze['canonicalVoiceSHA256']
    assert not os.path.exists(CACHE+'/blender/desk'),'No production pixels may exist before restoration'
    independent,nodes=isolated_frozen(g,path);pg,expected=runner['frozen_plan']();nf=len(expected)
    assert nf==g['NF']==11606
    plan=[independent['plan'](j) for j in range(nf)]
    assert plan==expected and dict(collections.Counter(p[0] for p in plan))=={'render':8100,'dup':3506}
    poses=[independent['pose_at'](j/30) for j in range(nf)]
    old_pose_delta=[delta(g['pose_at'](j/30),p) for j,p in enumerate(poses)]
    mismatches=[j for j,p in enumerate(plan) if tuple(g['plan'](j))!=tuple(p)]
    physical=json.load(open(CACHE+'/blender/gate-e1v1-r9/e1v1-r9-physical-bounds.json'))
    physical_delta=[delta(independent['pose_at'](r['time']),r['pose']) for r in physical['rows']]
    old={k:g[k] for k in ['pose_at','plan','SPANS','EVENTS','KEYS']}
    record={'id':'ys-chain-e1v1','helperSha256':sha(__file__),'runnerSha256':RUNNER_SHA,'sourceFreeze':CACHE+'/e1v1-r9-source-freeze.json','sourceFreezeSha256':sha(CACHE+'/e1v1-r9-source-freeze.json'),'origin':'job050 guarded before output; historical r3-r9 hotfix selection omitted pose_at and plan','runtimeCodeMismatches':[n for n in ['pose_at','plan'] if signature(g[n].__code__)!=signature(independent[n].__code__)],'beforeCode':{n:{'file':g[n].__code__.co_filename,'firstLine':g[n].__code__.co_firstlineno,'disassembly':disassembly(g[n]),'frozenDisassembly':disassembly(independent[n])} for n in ['pose_at','plan']},'allFramePlan':{'frames':nf,'render':8100,'dup':3506,'independentFrozenPlanExactMatch':True,'oldPlanDifferentFrames':len(mismatches),'firstOldPlanDifferentFrames':mismatches[:40],'frozenSpans':independent['SPANS'],'oldSpans':g['SPANS'],'oldEvents':g['EVENTS'],'frozenEvents':independent['EVENTS']},'allFramePoseComparison':{'frames':nf,'maximumDifference':max(old_pose_delta),'nonzeroAbove1e9':sum(v>1e-9 for v in old_pose_delta)},'frozenPoseVsApprovedR9PhysicalProof':{'samples':len(physical_delta),'maximumDifference':max(physical_delta)},'renderRequested':render,'modelReload':False,'guardChanged':False,'status':'diagnostic_only'}
    folder=CACHE+'/e1v1-production-r9-restore';os.makedirs(folder,exist_ok=True)
    report=folder+'/restore-'+time.strftime('%Y%m%dT%H%M%S')+'-'+str(time.time_ns())+'.json'
    # A code difference may be harmless spelling/branch structure, but a
    # changed physical pose is NOT silently permitted before production.
    if max(old_pose_delta)>1e-9 or max(physical_delta)>1e-9:
        record['status']='STOP_pose_difference_requires_review';write_new(report,record);raise AssertionError((record['status'],report))
    before_scene=bpy.context.window.scene;paths={s.name:s.render.filepath for s in bpy.data.scenes}
    images={p:runner['stamp'](p) for p in paths.values() if p and os.path.isfile(p)}
    entities=[len(bpy.data.objects),len(bpy.data.meshes),len(bpy.data.curves),len(bpy.data.materials)]
    installed=False
    try:
        before=[capture(g,t) for t in TIMES]
        # Install ONLY the two frozen function definitions and their explicit
        # immutable control data into the original episode globals. This is
        # why d.show sees the exact same _SHOW_QUEUE as apply afterwards.
        selected=[n for n in nodes if isinstance(n,ast.FunctionDef) and n.name in ['pose_at','plan']]
        installed=True
        exec(compile(ast.Module(body=selected,type_ignores=[]),path,'exec'),g)
        g['KEYS']=independent['KEYS'];g['SPANS']=independent['SPANS'];g['EVENTS']=independent['EVENTS']
        assert d.show.__globals__ is g and d.show_tree.__globals__ is g
        assert all(signature(g[n].__code__)==signature(independent[n].__code__) for n in ['pose_at','plan'])
        assert [g['plan'](j) for j in range(nf)]==expected
        assert max(delta(g['pose_at'](j/30),poses[j]) for j in range(nf))<=1e-9
        after=[capture(g,t) for t in TIMES];comparisons=[]
        for a,b in zip(before,after):
            assert a['cue']==b['cue'] and a['camera']==b['camera'] and set(a['anchorsWorld'])==set(b['anchorsWorld'])
            pd=delta(a['pose'],b['pose']);bd=delta(a['box'],b['box']);aw=max(delta(v,b['anchorsWorld'][k]) for k,v in a['anchorsWorld'].items());ap=max(delta(v,b['anchorsProjected'][k]) for k,v in a['anchorsProjected'].items())
            comparisons.append({'time':a['time'],'cue':a['cue'],'poseDelta':pd,'boxDeltaPixels':bd,'worldAnchorDelta':aw,'projectedAnchorDeltaPixels':ap})
            assert pd<=1e-9 and aw<=1e-9 and bd<=.100001 and ap<=.100001,comparisons[-1]
        assert entities==[len(bpy.data.objects),len(bpy.data.meshes),len(bpy.data.curves),len(bpy.data.materials)],'No geometry/material allocation allowed'
        assert all(bpy.data.scenes[name].render.filepath==value for name,value in paths.items())
        assert not runner['verify_saved'](images),'Saved raw files must not change'
        assert all(sha(WORK+'/'+p)==h for p,h in freeze['files'].items())
        record.update(status='restored_verified_pending_unchanged_runner',installed=['pose_at','plan','KEYS','SPANS','EVENTS'],representativeProjectionComparison={'samples':len(comparisons),'rows':comparisons,'maximumPixelTolerance':.100001,'worldTolerance':1e-9},beforeRepresentativeProjections=before,afterRepresentativeProjections=after,modelEntityCountsUnchanged=entities,source16Unchanged=True,visibilityGlobalsPreserved=True)
        write_new(report,record)
    except BaseException:
        if installed:g.update(old)
        record['status']='STOP_restoration_rolled_back';record['restoredOriginalBindings']=True
        if not os.path.exists(report):write_new(report,record)
        raise
    finally:bpy.context.window.scene=before_scene
    print('E1 frozen r9 control restoration verified:',report,flush=True)
    # No guard is removed or weakened: v2 independently checks code, cameras,
    # original source/voice, canonical renderer and explicit scene itself.
    return runner['run'](ns,render=render)
