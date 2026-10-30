"""Front S0/S1/S2 only. No movie, no audio regeneration, no old-file writes."""
import ast, contextlib, hashlib, json, os, pathlib, runpy, shutil, sys, time, traceback, types
import bpy
W=pathlib.Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
CACHE=pathlib.Path('/private/tmp/ys/ys-chain-d1a_s2_gpt_20261028')
REPORT=W/'outputs/ys-chain-d1a-backup/S2_20261028'
SCRIPT=W/'scripts/blender/desk_d1a_s2_gpt_20261028.py'
LOG=CACHE/'d1a-s2-gui_20261028.log'
NS=None
PASS='pass3'

def build():
    global NS
    assert not bpy.app.background
    assert CACHE.is_dir() and not CACHE.is_symlink()
    sys.path.insert(0,str(W/'scripts/blender'))
    oldargv=sys.argv[:];oldbc=sys.dont_write_bytecode;sys.dont_write_bytecode=True
    for name in ['desk_lib','desk_lib_d1','desk_lib_d1_machine_claude_20261026','desk_lib_d1_machine_gpt_20261026','desk_lib_d1b_s4_gpt_20261027','desk_lib_d1a_extras_gpt_20261026']:
        sys.modules.pop(name,None)
    win=bpy.context.window or next(iter(bpy.context.window_manager.windows));prior=win.scene
    with open(LOG,'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        start=time.time()
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'BUILD_FRONT_S2',flush=True)
            for obj in bpy.data.objects:
                if not obj.name.startswith('d1a_s2_prior_'):obj.name='d1a_s2_prior_'+obj.name
            fresh=bpy.data.scenes.new('D1A_S2_20261028');win.scene=fresh
            sys.argv=[str(SCRIPT),'--','--cache',str(CACHE),'--scale','.5','--samples','4']
            with bpy.context.temp_override(window=win,scene=fresh,view_layer=fresh.view_layers[0]):
                source=(W/'scripts/blender/desk_lib.py').read_bytes();txt=source.decode()
                marker='bpy.ops.wm.read_factory_settings(use_empty=True)';assert txt.count(marker)==1
                txt=txt.replace(marker,'# new GUI scene already provided',1)
                lib=types.ModuleType('desk_lib');lib.__file__=str(W/'scripts/blender/desk_lib.py');sys.modules['desk_lib']=lib
                argv=sys.argv[:];sys.argv=[str(SCRIPT)]
                try:exec(compile(txt,lib.__file__,'exec'),lib.__dict__)
                finally:sys.argv=argv
                print('SHARED_FILE_UNCHANGED',hashlib.sha256(source).hexdigest(),flush=True)
                NS=runpy.run_path(str(SCRIPT),run_name='d1a_s2_scene')
                NS=NS['main'].__globals__
            assert NS['DATA']['episode']=='d1a' and len(NS['CUES'])==54
            print('READY_FRONT_S2',len(NS['d'].SC.objects),'seconds',time.time()-start,flush=True)
        except BaseException:
            traceback.print_exc();win.scene=prior;raise
        finally:sys.argv=oldargv;sys.dont_write_bytecode=oldbc
    return None

def _subject(ns,c,t):
    import desk_d1ab_shotqa_gpt_20261026 as qa
    name,objects,reason=qa.semantic_primary(ns,c,t)
    return name,qa._visible_meshes(objects,set(ns['M'].get('_gpt_obsolete',[]))),reason

def refresh_behavior():
    """Reload only functions and camera descriptions from this new scene source."""
    assert NS is not None
    tree=ast.parse(SCRIPT.read_text(),str(SCRIPT));items=[]
    for node in tree.body:
        if isinstance(node,ast.FunctionDef):items.append(node)
        elif isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ('CAM','SHOTQA_PRIMARY','REQUIRED_REDRAW','REDRAW') for t in node.targets):items.append(node)
        elif isinstance(node,ast.Expr) and isinstance(node.value,ast.Call):
            fn=node.value.func
            if isinstance(fn,ast.Attribute) and isinstance(fn.value,ast.Name) and fn.value.id=='SHOTQA_PRIMARY':items.append(node)
        elif isinstance(node,ast.Assign) and any(isinstance(t,ast.Subscript) and isinstance(t.value,ast.Name) and t.value.id=='SHOTQA_PRIMARY' for t in node.targets):items.append(node)
    exec(compile(ast.Module(body=items,type_ignores=[]),str(SCRIPT),'exec'),NS)
    with open(LOG,'a',buffering=1) as log:print('REFRESH_FRONT_S2',hashlib.sha256(SCRIPT.read_bytes()).hexdigest(),file=log)
    return None

def storyboard():
    assert NS is not None
    import desk_d1ab_shotqa_gpt_20261026 as qa
    ns=NS;d=ns['d'];A=ns['A'];specs=json.loads((REPORT/'s2-specs-pass2.json').read_text())['specs']
    out=CACHE/('storyboard/raw-'+PASS);out.mkdir(parents=True,exist_ok=True)
    records=[];anchors={};measurements={};mesh_cache={}
    with open(LOG,'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        start=time.time()
        try:
            win=bpy.context.window or next(iter(bpy.context.window_manager.windows));win.scene=d.SC
            d.SC.render.resolution_x=540;d.SC.render.resolution_y=960;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=4
            with bpy.context.temp_override(window=win,scene=d.SC,view_layer=d.SC.view_layers[0]):
                for spec in specs:
                    j=spec['frame'];t=j/30;c=ns['cue_at'](t);assert c['key']==spec['cue']
                    cam,st,X=ns['apply'](t);name,meshes,reason=_subject(ns,c,t)
                    m=qa._project(ns,meshes,mesh_cache) if meshes else None
                    f=out/('%05d.jpg'%j);oldj=ns['reuse_frame'](t)
                    if not f.exists():
                        if oldj is not None:
                            # Exact old raw only, no old subtitles/labels. Half-size S2 copy.
                            src=str(pathlib.Path(A.reuse_source)/('%05d.jpg'%oldj))
                            im=bpy.data.images.load(src,check_existing=False)
                            try:
                                im.scale(540,960);im.filepath_raw=str(f);im.file_format='JPEG';im.save()
                            finally:bpy.data.images.remove(im)
                        else:
                            d.SC.render.filepath=str(f);bpy.ops.render.render(write_still=True,scene=d.SC.name)
                    anchors[str(j)]=ns['anchors_now'](t,st)
                    records.append({**spec,'image':str(f),'copiedOldRawFrame':oldj,'actualPrimary':name,'selectionReason':reason,'measurement':m,'fullFace':ns['full_face'](t),'sceneCovers':st['covers'],'cameraPose':cam,'cameraLens':d.CAM_D.lens,'resolution':[540,960],'samples':4,'personallyViewed':False})
                    print('S2_FRAME',j,c['key'],name,'copy',oldj,flush=True)
            (CACHE/('storyboard/anchors-'+PASS+'.json')).write_text(json.dumps(anchors))
            result={'episode':'d1a','stage':'S2','frames':records,'elapsedSeconds':time.time()-start,'samples':4,'resolution':[540,960],'allCueCount':len(set(r['cue'] for r in records)),'notMovie':True,'s3Started':False}
            (CACHE/('storyboard/render-manifest-'+PASS+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=1))
            print('S2_STORYBOARD_DONE',len(records),result['elapsedSeconds'],flush=True)
        except BaseException:traceback.print_exc();raise
    return None

def catalog():
    """New front-specific working mechanisms only, isolated oblique/top pairs."""
    assert NS is not None
    import desk_d1ab_shotqa_gpt_20261026 as qa
    ns=NS;d=ns['d'];out=CACHE/('catalog-'+PASS);out.mkdir(exist_ok=True)
    airpump=ns['EX']['airpump']
    specs=[('gin_two_ropes',28.2,lambda:ns['EX']['gin']['primary']),('can_air_expulsion',136.5,lambda:ns['P']['can']['can']),('can_water_seal',157.5,lambda:ns['G']['can']),('airpump_two_doors',331.7,lambda:[o for o in airpump['objects'] if o not in airpump['particles']+airpump['sphere_air']]),('closed_machine',57.3,lambda:qa._machine_groups(ns,*qa.MECHANISM)),('closed_seam',360.5,lambda:[ns['M']['cover_cyl'],ns['M']['cover_kettle']])]
    records=[]
    with open(LOG,'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            win=bpy.context.window or next(iter(bpy.context.window_manager.windows));win.scene=d.SC
            with bpy.context.temp_override(window=win,scene=d.SC,view_layer=d.SC.view_layers[0]):
                d.SC.render.resolution_x=540;d.SC.render.resolution_y=960;d.SC.eevee.taa_render_samples=4
                for name,t,sel in specs:
                    ns['apply'](t);chosen=qa._visible_meshes(qa._objects(sel()),set(ns['M'].get('_gpt_obsolete',[])))
                    assert chosen,(name,'missing physical model')
                    # Hide all actor limbs before isolating chosen physical parts.
                    for h in d.HANDS.values():
                        for o in qa._objects(h):ns['show_now'](o,False)
                    keep=set(chosen)
                    if name=='can_air_expulsion':keep.update(o for o in ns['EX']['can_air'] if not o.hide_render)
                    if name=='closed_seam':keep.update(o for o in ns['EX']['seams'] if not o.hide_render)
                    for o in ns['MANAGED']:ns['show_now'](o,o in keep)
                    bpy.context.view_layer.update();center=qa._project(ns,chosen,{})['world_center']
                    for top in [False,True]:
                        d.catalog_camera(center,top);d.CAM_D.dof.aperture_fstop=16
                        for _ in range(6):
                            bpy.context.view_layer.update();m=qa._project(ns,chosen,{})
                            factor=max(m['width_ratio']/.65,m['height_ratio']/.7);d.CAM_D.lens/=max(.1,factor)
                            if abs(factor-1)<.01:break
                        f=out/(name+('_top.jpg' if top else '_oblique.jpg'))
                        if not f.exists():d.SC.render.filepath=str(f);bpy.ops.render.render(write_still=True,scene=d.SC.name)
                        records.append({'part':name,'view':'top' if top else 'oblique','image':str(f),'measurement':qa._project(ns,chosen,{}),'personallyViewed':False})
            (out/'index.json').write_text(json.dumps({'stage':'S1','frames':records,'notMovie':True},ensure_ascii=False,indent=1))
            print('S1_CATALOG_DONE',len(records),flush=True)
        except BaseException:traceback.print_exc();raise
    return None

def run_s1_s2():
    catalog();storyboard();return None
