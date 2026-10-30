"""No-render decomposition of the failed frozen-r15 restoration comparison.

Always rolls back the temporary AST installation; never starts production.
Separates pose/focus/anchors/projection boxes from actual local/evaluated
geometry and object/camera transforms, and measures same-function repeats.
"""
import ast,dis,hashlib,json,runpy,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
SOURCE=W/'scripts/blender/desk_d1v1.py'
OLD=W/'scripts/blender/desk_axes_d1_r15_restore.py'
SHA='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(v):return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def differences(a,b,path=''):
    result=[]
    if isinstance(a,dict) and isinstance(b,dict):
        for k in a.keys()|b.keys():
            if k not in a or k not in b:result.append({'field':path+'.'+str(k),'before':a.get(k),'after':b.get(k),'kind':'missing'})
            else:result.extend(differences(a[k],b[k],path+'.'+str(k)))
    elif isinstance(a,(list,tuple)) and isinstance(b,(list,tuple)):
        if len(a)!=len(b):result.append({'field':path,'beforeLength':len(a),'afterLength':len(b),'kind':'length'})
        else:
            for i,(x,y) in enumerate(zip(a,b)):result.extend(differences(x,y,path+'['+str(i)+']'))
    elif isinstance(a,(int,float)) and isinstance(b,(int,float)):
        if a!=b:result.append({'field':path,'before':a,'after':b,'absoluteDifference':abs(a-b),'kind':'number'})
    elif a!=b:result.append({'field':path,'before':a,'after':b,'kind':'value'})
    return sorted(result,key=lambda r:r.get('absoluteDifference',0),reverse=True)
def function_info(f,depth=0):
    result={'name':f.__name__,'filename':f.__code__.co_filename,'firstLine':f.__code__.co_firstlineno,'globalsIsOwnEpisode':None,'codeSha256':hashlib.sha256(f.__code__.co_code).hexdigest(),'disassembly':dis.Bytecode(f).dis(),'closure':[]}
    if f.__closure__:
        for name,cell in zip(f.__code__.co_freevars,f.__closure__):
            value=cell.cell_contents;v={'name':name,'type':type(value).__name__}
            if isinstance(value,types.FunctionType) and depth<2:v['function']=function_info(value,depth+1)
            elif isinstance(value,(str,int,float,bool,type(None))):v['value']=value
            elif isinstance(value,dict):v['keys']=[str(x) for x in list(value)[:50]]
            result['closure'].append(v)
    return result
def details(g,t):
    import numpy as np
    anchors=g['apply'](t);bpy=g['bpy'];d=g['d'];bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
    objects={}
    for o in g['MANAGED']:
        if o.hide_render or o.type not in ('MESH','FONT','CURVE'):continue
        eo=o.evaluated_get(dg);mesh=eo.to_mesh()
        if mesh is None:continue
        try:
            vv=np.empty(len(mesh.vertices)*3,dtype=np.float64);mesh.vertices.foreach_get('co',vv);vv=vv.reshape(-1,3)
            item={'location':list(o.location),'rotation':list(o.rotation_euler),'scale':list(o.scale),'dimensions':list(o.dimensions),'matrixWorld':[list(row) for row in o.matrix_world],'evaluatedVertices':len(vv),'evaluatedLocalSha256':hashlib.sha256(vv.tobytes()).hexdigest(),'evaluatedLocalBox':np.vstack([vv.min(axis=0),vv.max(axis=0)]).tolist() if len(vv) else [],'shapeKeys':{k.name:k.value for k in o.data.shape_keys.key_blocks} if o.type=='MESH' and o.data.shape_keys else {}}
            if o.type=='MESH':
                raw=np.empty(len(o.data.vertices)*3,dtype=np.float64);o.data.vertices.foreach_get('co',raw);item['rawMeshSha256']=hashlib.sha256(raw.tobytes()).hexdigest()
            objects[g['CREATED_NAME'][o]]=item
        finally:eo.to_mesh_clear()
    return {'time':t,'pose':g['pose_at'](t),'focusDistance':float(d.CAM_D.dof.focus_distance),'fstop':float(d.CAM_D.dof.aperture_fstop),'cameraLocation':list(d.CAM.location),'cameraRotation':list(d.CAM.rotation_euler),'cameraMatrixWorld':[list(row) for row in d.CAM.matrix_world],'cameraLens':d.CAM_D.lens,'anchors':{k:list(d.project(v)) for k,v in anchors.items()},'objects':objects}
def diagnose(ns,authorized=False,out=None):
    assert authorized is True,'Only root may queue GUI diagnosis'
    target=Path(out or C/'d1-runtime-restore-v2-diagnostic-20261024.json')
    assert not target.exists() and not target.is_symlink(),'Preserve previous diagnosis'
    assert sha(SOURCE)==SHA and sha(OLD)=='712ee8d5abb644b445d6b962429f7415e7b346239b820575cc8288948396170f'
    assert not Path('/private/tmp/ys/ys-chain-d1v1-production-r15').exists(),'Do not diagnose in-progress production'
    helper=runpy.run_path(str(OLD));g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];old_scene=bpy.context.window.scene
    tree=ast.parse(SOURCE.read_text());functions=[n for n in tree.body if isinstance(n,ast.FunctionDef)]
    saved={n.name:g[n.name] for n in functions};saved.update({k:g[k] for k in ['D1_POSES','SPANS','EVENTS']});saved_show=(d.show,d.show_tree)
    identity=[o.as_pointer() for o in d.SC.objects];installed=False;started=time.time()
    report={'episode':'D-1','status':'diagnosis in progress','sourceSha256':SHA,'helperSha256':sha(__file__),'sourceModified':False,'modelsRebuilt':False,'renders':0,'guardThresholdChanged':False,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S')}
    try:
        bpy.context.window.scene=d.SC;assert g['_VIS_QUEUE'] is None
        report['beforeFunctionInfo']={n.name:function_info(g[n.name]) for n in functions}
        report['beforeApplyGlobalsOwn']=g['apply'].__globals__ is g
        report['oldDetails0a']=details(g,0);report['oldDetails0b']=details(g,0)
        report['oldRepeat0Differences']=differences(report['oldDetails0a'],report['oldDetails0b'])
        before=helper['projection_states'](g,helper['TIMES']);report['beforeRepresentativeStates']=before
        installed=True
        exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),g)
        exec(compile(ast.Module(body=helper['assignment_nodes'](tree),type_ignores=[]),str(SOURCE),'exec'),g)
        d.show=g['show_d1'];d.show_tree=g['show_tree_d1']
        after=helper['projection_states'](g,helper['TIMES']);report['afterRepresentativeStates']=after
        report['representativeComponentDifferences']=[{'time':a['time'],'differences':differences(a,b)} for a,b in zip(before,after)]
        report['newDetails0a']=details(g,0);report['newDetails0b']=details(g,0)
        report['newRepeat0Differences']=differences(report['newDetails0a'],report['newDetails0b'])
        report['oldVersusNewDetails0Differences']=differences(report['oldDetails0b'],report['newDetails0b'])
        # Same predecessor for an independently repeated old/new time zero.
        g.update(saved);d.show,d.show_tree=saved_show;installed=False
        g['apply'](403.3);bpy.context.view_layer.update();old0=details(g,0);old0repeat=details(g,0)
        installed=True
        exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),g)
        exec(compile(ast.Module(body=helper['assignment_nodes'](tree),type_ignores=[]),str(SOURCE),'exec'),g)
        d.show=g['show_d1'];d.show_tree=g['show_tree_d1']
        g['apply'](403.3);bpy.context.view_layer.update();new0=details(g,0);new0repeat=details(g,0)
        report['samePredecessorOld0']=old0;report['samePredecessorNew0']=new0
        report['samePredecessorDifferences']=differences(old0,new0)
        report['samePredecessorRepeatedDifferences']=differences(old0repeat,new0repeat)
        report['status']='DIAGNOSED ONLY; all original runtime bindings rolled back; no render'
        return report
    except BaseException as e:
        report['status']='DIAGNOSTIC FAIL; no render';report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        if installed:g.update(saved);d.show,d.show_tree=saved_show
        assert identity==[o.as_pointer() for o in d.SC.objects] and g['_VIS_QUEUE'] is None
        report['allOriginalBindingsRestored']=all(g[k] is v for k,v in saved.items()) and d.show is saved_show[0] and d.show_tree is saved_show[1]
        assert report['allOriginalBindingsRestored'] and sha(SOURCE)==SHA
        bpy.context.window.scene=old_scene;report['seconds']=round(time.time()-started,3)
        target.write_text(json.dumps(report,ensure_ascii=False,indent=1));print('D1 RESTORE V2 DIAGNOSTIC',report['status'],str(target),flush=True)
