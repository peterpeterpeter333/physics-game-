"""Root-only, no-render restoration of frozen D1 functions in their own globals.

restore(nsD1) returns the retained namespace only after independent full-plan,
representative evaluated-projection, and unchanged original runner preflight.
It never imports/rebuilds a scene, changes source, or relaxes a guard.
"""
import ast,hashlib,json,math,os,runpy,time,types
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
SOURCE=W/'scripts/blender/desk_d1v1.py'
FROZEN={SOURCE:'004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2',W/'scripts/blender/desk_lib_d1.py':'742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923',W/'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f',W/'scripts/blender/desk_axes_d1_r15_production.py':'349ec5da1abf35ec19f43b411617ae122ec7c95bad94ff48aa4319677f0c0ce0'}
TIMES=[0,20,34.216667,54.8,104.5,125.975667,126.084,126.17,133.570667,169.8,172.3,296,327,333.2,339.7,403.3]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def jsha(v):return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def code_differences(a,b,prefix=''):
    if isinstance(a,types.CodeType) or isinstance(b,types.CodeType):
        if not isinstance(a,types.CodeType) or not isinstance(b,types.CodeType):return [prefix+'code-type']
        return [p for n in dir(a) if n.startswith('co_') and not callable(getattr(a,n)) for p in code_differences(getattr(a,n),getattr(b,n),prefix+n+'.')]
    if isinstance(a,tuple) or isinstance(b,tuple):
        if not isinstance(a,tuple) or not isinstance(b,tuple) or len(a)!=len(b):return [prefix+'tuple-size']
        return [p for i,(x,y) in enumerate(zip(a,b)) for p in code_differences(x,y,prefix+str(i)+'.')]
    return [] if a==b else [prefix.rstrip('.')]
def assignment_nodes(tree):
    return [n for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['D1_POSES','SPANS','EVENTS'] for t in n.targets) or isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS']
def frozen_schedule(norm):
    """Fresh JSON + AST-only timing resolver/plan, independent of GUI globals."""
    data=json.loads((C/'blender/data.json').read_text());pt=json.loads((C/'phrase-times.json').read_text())
    scope={'math':math,'DATA':data,'CUES':data['cues'],'CUE':{c['key']:c for c in data['cues']},'PT':pt,'FPS':30,'d':types.SimpleNamespace(norm=norm)}
    tree=ast.parse(SOURCE.read_text());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['S','E','T','plan_d1']]
    exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),scope)
    exec(compile(ast.Module(body=assignment_nodes(tree),type_ignores=[]),str(SOURCE),'exec'),scope)
    return scope,[scope['plan_d1'](j) for j in range(math.ceil(data['duration']*30))]
def projection_states(g,times):
    """Actual evaluated vertices, not only an AABB; no render/file operations."""
    import numpy as np
    bpy=g['bpy'];d=g['d'];bpy.context.window.scene=d.SC;rows=[];vertex_cache={}
    for t in times:
        anchors=g['apply'](t);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
        projection=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted();objects={}
        for o in g['MANAGED']:
            if o.hide_render or o.type not in ['MESH','FONT','CURVE']:continue
            cacheable=o.type=='MESH' and not o.data.shape_keys
            if cacheable and o in vertex_cache:vv=vertex_cache[o]
            else:
                eo=o.evaluated_get(dg);mesh=eo.to_mesh()
                if mesh is None:continue
                try:
                    values=np.empty(len(mesh.vertices)*3,dtype=np.float64);mesh.vertices.foreach_get('co',values)
                    vv=np.column_stack((values.reshape(-1,3),np.ones(len(mesh.vertices))))
                finally:eo.to_mesh_clear()
                if cacheable:vertex_cache[o]=vv
            if not len(vv):continue
            clip=vv@np.asarray(projection@o.matrix_world,dtype=np.float64).T;ndc=clip[:,:3]/clip[:,3:4]
            xy=np.column_stack(((ndc[:,0]*.5+.5)*1080,(.5-ndc[:,1]*.5)*1920))
            objects[g['CREATED_NAME'][o]]={'vertices':len(vv),'box':[float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]}
        rows.append({'time':t,'pose':g['pose_at'](t),'focusDistance':float(d.CAM_D.dof.focus_distance),'fstop':float(d.CAM_D.dof.aperture_fstop),'anchors':{k:list(d.project(v)) for k,v in anchors.items()},'objects':objects})
    return rows
def compare_projections(before,after):
    import numpy as np
    assert len(before)==len(after);checks=[]
    for a,b in zip(before,after):
        assert a['time']==b['time'] and a['objects'].keys()==b['objects'].keys(),('Visible objects changed',a['time'])
        assert a['anchors'].keys()==b['anchors'].keys()
        av=a['pose']+[a['focusDistance'],a['fstop']]+[v for p in a['anchors'].values() for v in p]+[v for o in a['objects'].values() for v in o['box']]
        bv=b['pose']+[b['focusDistance'],b['fstop']]+[v for p in b['anchors'].values() for v in p]+[v for name in a['objects'] for v in b['objects'][name]['box']]
        delta=float(np.max(np.abs(np.asarray(av)-np.asarray(bv))))
        assert delta<=1e-5,('Frozen restoration changed representative projection/focus',a['time'],delta)
        assert all(o['vertices']==b['objects'][name]['vertices'] for name,o in a['objects'].items())
        checks.append({'time':a['time'],'visibleObjects':len(a['objects']),'maxAbsolutePixelOrPoseDifference':delta,'beforeSha256':jsha(a),'afterSha256':jsha(b),'pass':True})
    return checks
def restore(ns,authorized=False,evidence=None):
    assert authorized is True,'Only root may queue the D1 runtime restoration'
    target=Path(evidence or C/'d1-runtime-restore-r15-20261024.json');assert not target.exists(),'Preserve existing restoration evidence; supply a fresh evidence path'
    started=time.time();g=ns['main'].__globals__;d=g['d'];bpy=g['bpy']
    for p,h in FROZEN.items():assert sha(p)==h,('Frozen source changed',str(p))
    assert g['_VIS_QUEUE'] is None and g['P']['can']['can'].get('printed_label') is True and 'D1_HL' in g
    assert g['DATA']==json.loads((C/'blender/data.json').read_text()) and g['CUES']==g['DATA']['cues']
    assert g['PT']==json.loads((C/'phrase-times.json').read_text())
    asset=W/'scripts/blender/desk_assets/d1v1/phrase-times.json';assert sha(asset)==sha(C/'phrase-times.json')
    assert not Path('/private/tmp/ys/ys-chain-d1v1-production-r15').exists(),'This restoration is for the blocked pre-production run, not an in-progress render'
    scene=d.SC;identity=[o.as_pointer() for o in scene.objects];old_scene=bpy.context.window.scene
    pure,expected=frozen_schedule(d.norm);assert len(expected)==12163 and sum(p[0]=='render' for p in expected)==5070
    old_plans=[g['plan_d1'](j) for j in range(12163)]
    tree=ast.parse(SOURCE.read_text());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef)]
    assert all(not n.decorator_list for n in functions)
    fresh={};exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),fresh)
    differences={n.name:code_differences(g[n.name].__code__,fresh[n.name].__code__) for n in functions}
    saved={n.name:g[n.name] for n in functions};saved.update({k:g[k] for k in ['D1_POSES','SPANS','EVENTS']});saved_show=(d.show,d.show_tree);installed=False
    report={'episode':'D-1','stage':'r15 runtime restoration','startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'frozenSources':{str(p):h for p,h in FROZEN.items()},'beforeFunctionCodeDifferences':{k:v for k,v in differences.items() if v},'beforePlanDifferentFrames':sum(a!=b for a,b in zip(old_plans,expected)),'beforePlanSha256':jsha(old_plans),'frozenIndependentPlanSha256':jsha(expected),'knownCause':'r15 label uses reload_r10.NAMES, which omits plan_d1; SPANS/EVENTS were updated while the retained plan function and its source positions could stay old','modelsRebuilt':False,'sourceFilesModified':False,'renders':0,'originalProductionGuardChanged':False}
    try:
        before=projection_states(g,TIMES)
        # Same episode globals deliberately retained: d.show and VIS_QUEUE must
        # share one namespace, not a shallow copied transaction variable.
        installed=True # Also roll back a partial function/assignment exec.
        exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),g)
        exec(compile(ast.Module(body=assignment_nodes(tree),type_ignores=[]),str(SOURCE),'exec'),g)
        d.show=g['show_d1'];d.show_tree=g['show_tree_d1']
        assert all(not code_differences(g[n.name].__code__,fresh[n.name].__code__) for n in functions)
        assert g['D1_POSES']==pure['D1_POSES'] and g['SPANS']==pure['SPANS'] and g['EVENTS']==pure['EVENTS']
        actual=[g['plan_d1'](j) for j in range(12163)];assert actual==expected,'All frozen-plan frames must match; no count-only substitute'
        after=projection_states(g,TIMES);checks=compare_projections(before,after)
        assert identity==[o.as_pointer() for o in scene.objects] and g['_VIS_QUEUE'] is None
        # The unchanged, SHA-pinned runner performs its full original preflight.
        prepared=runpy.run_path(str(W/'scripts/blender/desk_axes_d1_r15_production.py'),init_globals={'nsD1':ns,'D1_PRODUCTION_AUTHORIZED':True})['prepared']
        assert prepared['productionStarted'] is False and not Path(prepared['productionCache']).exists()
        for n in functions:ns[n.name]=g[n.name]
        for k in ['D1_POSES','SPANS','EVENTS']:ns[k]=g[k]
        report.update({'status':'PASS: restored frozen functions; no production started','afterAllFunctionsStrictCodeMatch':True,'afterIndependentPlanDifferentFrames':0,'afterPlanSha256':jsha(actual),'renderFrames':5070,'duplicateFrames':7093,'sameEpisodeGlobalsPreserved':True,'visibilityHooksShareEpisodeGlobals':d.show.__globals__ is g and d.show_tree.__globals__ is g,'representativeProjectionChecks':checks,'beforeRepresentativeStates':before,'afterRepresentativeStates':after,'originalRunnerPreflight':prepared,'elapsedSeconds':round(time.time()-started,3)})
    except BaseException as exc:
        if installed:
            g.update(saved);d.show,d.show_tree=saved_show
        report.update({'status':'FAIL: no rendering; original runtime bindings restored','error':{'type':type(exc).__name__,'message':str(exc)},'elapsedSeconds':round(time.time()-started,3)})
        raise
    finally:
        bpy.context.window.scene=old_scene
        for p,h in FROZEN.items():assert sha(p)==h
        target.write_text(json.dumps(report,ensure_ascii=False,indent=1))
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r15 restore',report['status'],str(target),flush=True)
    return ns
