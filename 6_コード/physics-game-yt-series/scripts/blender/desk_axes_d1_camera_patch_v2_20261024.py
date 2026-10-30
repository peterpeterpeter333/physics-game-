"""Root-queued camera-only derivative AFTER the unchanged r15 production.

No model rebuild, frozen file edit, runtime rebind, source-state rescheduling,
or original-gate waiver. Cut to the next site's frozen target, approach by
10 percent in the SAME existing move interval, then resume its exact camera.
The meaningful can close/reveal, balloon tracking and unit/weight/palm camera
paths outside the selected entry intervals remain unchanged.

runpy.run_path(...)["run"](nsD1, authorized=True, mode="trial")
mode="audit": all replacement evaluated-surface checks, no render.
mode="trial": same checks, then 3 representative real JPEGs per entry.
mode="render": same checks, then every unique replacement state. Final eyes
and MP4 gates are still required; this does not approve its own output.
"""
import ast,copy,hashlib,json,math,os,time,types
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
OLD=Path('/private/tmp/ys/ys-chain-d1v1-render')
BASE=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
PATCH=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024')
FROZEN={
 'scripts/blender/desk_d1v1.py':'004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2',
 'scripts/blender/desk_lib_d1.py':'742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923',
 'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f',
 'scripts/blender/desk_axes_d1_r15_production.py':'349ec5da1abf35ec19f43b411617ae122ec7c95bad94ff48aa4319677f0c0ce0',
 'scripts/blender/desk_d1v1_semantic_audit_r9.py':'730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d'}
KEYS=('mine:rule','mine:mio','nc:install','myth:side','shrink:spoon',
      'can:heat','straw:drink','air:inside','eng:apply','eng:steam',
      'eng:down','size:wide','size:53','size:guericke','size:pull',
      'next:spread','next:mio','next:waste','ch:fuji','last:air')
# The actual stopped cylinder is only 43.09% wide; a 10% retreat would make
# it <40%. Keep this honest small primary >=40%, without adding background.
APPROACH={'eng:steam':.05,'next:mio':.05,'mine:mio':.01}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=1))
def jsha(v):return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def entry_duration(c):
    # Match the ACTUAL frozen function, not only its nominal cue.move field.
    if c['key']=='nc:install':return .8
    if c['key'] in ('mine:mio','can:heat'):return 1.
    if c['key'] in ('eng:apply','next:spread','last:air'):return 1.2
    if c['key']=='eng:steam':return .8
    return c['move']

def derive(g):
    """Pure schedule/camera derivation; no bpy calls or file writes."""
    original_pose=g['pose_at'];original_plan=g['plan_d1'];nf=g['NF']
    selected=[c for c in g['CUES'] if c['key'] in KEYS]
    assert len(selected)==len(KEYS) and all(entry_duration(c)>0 for c in selected)
    ranges={c['key']:{'cue':c['key'],'start':c['start'],
              'end':c['start']+entry_duration(c),
              'firstFrame':math.ceil(c['start']*30-1e-8),
              'lastFrame':math.ceil((c['start']+entry_duration(c))*30-1e-8)-1,
              'approachFraction':APPROACH.get(c['key'],.1),
              'targetPose':list(original_pose(c['start']+entry_duration(c)+1e-7))}
              for c in selected}
    def corrected_pose(t):
        c=g['cue_at'](t);r=ranges.get(c['key'])
        if r and r['start']<=t<r['end']:
            p=list(r['targetPose']);p[3]*=1+r['approachFraction']*(1-g['U'](t,r['start'],r['end']-r['start']))
            return p
        return original_pose(t)
    replacements={};source_frames={};unique={};all_plans=[]
    for j in range(nf):
        p=original_plan(j);all_plans.append(p)
        assert p[0] in ('render','dup')
        ref=j if p[0]=='render' else p[1]
        assert 0<=ref<=j and original_plan(ref)[0]=='render'
        c=g['cue_at'](j/30);r=ranges.get(c['key'])
        if r and (r['firstFrame']<=j<=r['lastFrame'] or r['firstFrame']<=ref<=r['lastFrame']):
            state=(ref,tuple(round(x,12) for x in corrected_pose(j/30)))
            actual=unique.setdefault(state,j);replacements[j]=actual;source_frames[actual]=ref
    frames=sorted(set(replacements.values()))
    assert frames and set(source_frames)==set(frames)
    # No changed object-state source: each new render takes exactly the source
    # used by the original canonical render/dup plan, including intentional holds.
    for j,k in replacements.items():
        p=all_plans[j];ref=j if p[0]=='render' else p[1]
        assert source_frames[k]==ref
    return ranges,corrected_pose,replacements,source_frames,frames,all_plans

def geometry_tools(ns):
    """Reuse the exact semantic/evaluated-mesh code, without changing its file.

    Extract only its prefix before the sampling loop. The returned functions
    retain the ORIGINAL semantic selection and 40–70/caption/frame criteria.
    No replacing a principal with a larger set or unrelated background.
    """
    import numpy as np
    p=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py'
    tree=ast.parse(p.read_text());fn=copy.deepcopy(next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='check'))
    stop=next(i for i,n in enumerate(fn.body) if isinstance(n,ast.For))
    fn.body=fn.body[:stop]+[ast.Return(value=ast.Dict(keys=[ast.Constant(x) for x in ['principal','project','checks']],values=[ast.Name(id=x,ctx=ast.Load()) for x in ['principal','project','checks']]))]
    fn.name='_d1_camera_geometry_tools';ast.fix_missing_locations(fn)
    scope={'hashlib':hashlib,'json':json,'os':os,'time':time,'np':np,'EXPECTED':FROZEN['scripts/blender/desk_d1v1.py']}
    exec(compile(ast.Module(body=[fn],type_ignores=[]),str(p),'exec'),scope)
    return scope[fn.name](ns,str(PATCH/'never-written-original-audit.json'),revision='camera derivative',expected_source=FROZEN['scripts/blender/desk_d1v1.py'])

def raw_snapshot(folder):
    """Every original JPEG stat; SHA subset explicitly labelled, never 'all SHA'."""
    files=sorted(folder.glob('*.jpg'))
    assert len(files)==12163 and all(not p.is_symlink() and p.stat().st_size>1000 for p in files)
    return {p.name:[p.stat().st_size,p.stat().st_mtime_ns] for p in files}

def other_raw_samples():
    paths=[]
    for folder in sorted(Path('/private/tmp/ys').glob('ys-chain-*')):
        if folder in (PATCH,BASE):continue
        for child in sorted((folder/'blender').glob('*')):
            if child.is_dir():
                images=sorted(child.glob('*.jpg'))
                if images:paths.extend([images[0],images[-1]])
    return {str(p):sha(p) for p in sorted(set(paths))}

def verify_canonical(g):
    runner=W/'scripts/blender/desk_axes_d1_r15_production.py'
    rn=ast.parse(runner.read_text());scope={"types":types}
    exec(compile(ast.Module(body=[n for n in rn.body if isinstance(n,ast.FunctionDef) and n.name=='code_equivalent'],type_ignores=[]),str(runner),'exec'),scope)
    eq=scope['code_equivalent'];stage=W/'scripts/blender/desk_d1v1.py';compiled={}
    names=['main','pose_at','set_camera','apply','plan_d1']
    exec(compile(ast.Module(body=[n for n in ast.parse(stage.read_text()).body if isinstance(n,ast.FunctionDef) and n.name in names],type_ignores=[]),str(stage),'exec'),compiled)
    assert all(eq(g[n].__code__,compiled[n].__code__) for n in names),'Runtime is not exact frozen r15'
    shared=W/'scripts/blender/desk_lib.py';compiled={}
    exec(compile(ast.Module(body=[n for n in ast.parse(shared.read_text()).body if isinstance(n,ast.FunctionDef) and n.name=='main'],type_ignores=[]),str(shared),'exec'),compiled)
    assert eq(g['d'].main.__code__,compiled['main'].__code__),'Canonical shared main changed'

def projection_crosscheck(g,objects,projection,dg):
    # Three REAL evaluated vertices per frame, independently compared with
    # the original shared d.project. No millions of point-wise API calls.
    import numpy as np
    for o in objects:
        if o.hide_render or o.type not in ('MESH','FONT','CURVE'):continue
        eo=o.evaluated_get(dg);mesh=eo.to_mesh()
        if mesh is None:continue
        try:
            if not len(mesh.vertices):continue
            vv=[mesh.vertices[k].co.copy() for k in [0,len(mesh.vertices)//2,len(mesh.vertices)-1]]
            world=[o.matrix_world@v for v in vv]
            v=np.array([list(p)+[1.] for p in world]);clip=v@np.asarray(projection,dtype=np.float64).T
            ndc=clip[:,:3]/clip[:,3:4];xy=np.column_stack(((ndc[:,0]*.5+.5)*1080,(.5-ndc[:,1]*.5)*1920))
            original=np.array([g['d'].project(p)[:2] for p in world]);delta=float(np.abs(xy-original).max())
            assert delta<=.11,('Vector projection disagrees with original d.project',delta)
            return {'vertices':3,'maximumAbsolutePixelDifference':delta,'pass':True}
        finally:eo.to_mesh_clear()
    raise AssertionError('No evaluated principal vertices available for independent projection comparison')

def run(ns,authorized=False,mode='trial'):
    assert authorized is True,'Only root may queue this D1 derivative'
    assert mode in ('audit','trial','render')
    assert not PATCH.is_symlink() and not BASE.is_symlink()
    for p,h in FROZEN.items():
        if h!='RECORD_AT_PREFLIGHT':assert sha(W/p)==h,('Frozen source changed',p)
    finished=json.loads((BASE/'d1-production-finished.json').read_text())
    assert finished['all12163JpegsPresent'] and finished['all5070RenderSourcesDone']
    assert finished['sourceSha256']['scripts/blender/desk_d1v1.py']==FROZEN['scripts/blender/desk_d1v1.py']
    review=json.loads((OLD/'d1-moving27-existing-images-20261024.json').read_text())
    assert review['knownMovingFailures']==27 and review['actuallyViewedImages']==43 and not review['finalAcceptance']
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];old_scene=bpy.context.window.scene
    assert g['NF']==12163 and g['_VIS_QUEUE'] is None and g['P']['can']['can'].get('printed_label') is True
    assert d.SC.render.engine=='BLENDER_EEVEE'
    verify_canonical(g)
    assert g['DATA']==json.loads((OLD/'blender/data.json').read_text())
    assert g['DATA']==json.loads((BASE/'blender/data.json').read_text())
    scene_paths={s.name:s.render.filepath for s in bpy.data.scenes if s is not d.SC}
    render_settings={'filepath':d.SC.render.filepath,'resolution_x':d.SC.render.resolution_x,'resolution_y':d.SC.render.resolution_y,'resolution_percentage':d.SC.render.resolution_percentage,'file_format':d.SC.render.image_settings.file_format,'samples':d.SC.eevee.taa_render_samples}
    other_before=other_raw_samples()
    bindings={k:g[k] for k in ['pose_at','set_camera','apply','main','plan_d1','SPANS','EVENTS']}
    ranges,corrected_pose,replacements,sources,frames,plans=derive(g)
    assert sum(p[0]=='render' for p in plans)==5070 and sum(p[0]=='dup' for p in plans)==7093
    fingerprint={'frozenSourceSha256':FROZEN,'patchSourceSha256':sha(__file__),'originalPlanSha256':jsha(plans),'replacementPlanSha256':jsha([replacements,sources,ranges]),'semanticAuditorSha256':sha(W/'scripts/blender/desk_d1v1_semantic_audit_r9.py')}
    if PATCH.exists():
        assert json.loads((PATCH/'patch-fingerprint.json').read_text())==fingerprint,'A different derived patch already exists'
        assert not (PATCH/'camera-patch-complete.json').exists(),'Completed patch preserved; do not re-render'
    else:
        (PATCH/'blender').mkdir(parents=True);dump(PATCH/'patch-fingerprint.json',fingerprint)
        for f in ['plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json']:
            assert (BASE/f).is_file();(PATCH/f).symlink_to(BASE/f)
        (PATCH/'blender/data.json').symlink_to(BASE/'blender/data.json')
    record_path=PATCH/('camera-patch-%s-%d.json'%(mode,time.time_ns()))
    original=g['apply'];camera_scope={**g,'pose_at':corrected_pose}
    corrected_camera=types.FunctionType(g['set_camera'].__code__,camera_scope)
    def corrected_apply(t):
        j=round(t*30);ref=sources.get(j,j)
        result=original(ref/30)
        if j in sources:corrected_camera(t)
        return result
    started=time.time();report={**fingerprint,'episode':'D-1','mode':mode,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'ranges':list(ranges.values()),'actualReplacementFrames':frames,'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':sources,'patchFrameCount':len(frames),'replacementOutputFrameCount':len(replacements),'stageLibOverlayRunnerModified':False,'episodeRuntimeBindingsReplaced':False,'newModelsBuilt':False,'originalNGPreserved':True,'automaticApproval':False,'actualCompositeAndFinalMp4EyeReviewPending':True}
    failure=None;before_raw=None
    try:
        bpy.context.window.scene=d.SC;assert bpy.context.scene is d.SC
        d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100
        d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
        tools=geometry_tools(ns);physical=[]
        for j in frames:
            corrected_apply(j/30);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
            projection=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            ref=sources[j];c=g['cue_at'](j/30);state_c=g['cue_at'](ref/30)
            assert c['key']==state_c['key'],('Patch would replace a different cue object state',j,ref)
            role,objects,critical=tools['principal'](state_c,ref/30)
            b=tools['project'](objects,projection,dg);cb=tools['project'](critical,projection,dg)
            bc=tools['checks'](b);cc=tools['checks'](cb,True) if cb else None
            crosscheck=projection_crosscheck(g,objects,projection,dg)
            passed=all(bc.values()) and (cc is None or cc['frameSafe'])
            physical.append({'frame':j,'time':j/30,'sourceFrame':ref,'cue':c['key'],'semanticPrincipal':role,'pose':corrected_pose(j/30),'actualSurface':b,'criticalSurface':cb,'physicalChecks':bc,'criticalChecks':cc,'originalProjectCrosscheck':crosscheck,'pass':passed})
        report['physical']=physical;report['allReplacementFramesPhysicalPass']=all(r['pass'] for r in physical)
        report['physicalFailFrames']=[r['frame'] for r in physical if not r['pass']]
        dump(record_path,report)
        assert report['allReplacementFramesPhysicalPass'],'D1 camera derivative has real evaluated-surface/frame/40–70 failure; no rendering'
        if mode=='audit':
            report['status']='ALL replacement physical checks pass; no JPEG rendered, actual eyes pending';return report
        # Only this cache/output is writable. A stage main clone uses the same
        # canonical shared d.main code and explicit-scene proxy as frozen r15.
        # No main/apply/set_camera binding is installed into episode globals.
        wanted=frames
        if mode=='trial':
            wanted=set()
            for r in ranges.values():
                seq=[j for j in frames if g['cue_at'](j/30)['key']==r['cue'] and j/30<r['end']]
                assert seq;wanted.update([seq[0],seq[len(seq)//2],seq[-1]])
            wanted=sorted(wanted)
        folder=PATCH/'blender'/('trial' if mode=='trial' else 'patch')
        assert not folder.is_symlink()
        if folder.exists():assert all(not p.is_symlink() for p in folder.rglob('*'))
        before_raw=raw_snapshot(BASE/'blender/desk')
        protected={str(p):sha(p) for p in [BASE/'blender/desk/anchors.json',BASE/'blender/desk/meta.json',BASE/'blender/camera-motion.json',OLD/'blender/data.json',OLD/'ys-chain-d1v1.voice.wav']}
        sampled=[BASE/'blender/desk'/'00000.jpg',BASE/'blender/desk'/'12162.jpg']
        sample_sha={str(p):sha(p) for p in sampled}
        a=copy.copy(g['A']);a.cache=str(PATCH);a.out=str(folder);a.times=','.join(str(j/30) for j in wanted)
        a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16;a.anchors_only=False
        scope={**g,'A':a,'apply':corrected_apply,'pose_at':corrected_pose,'set_camera':corrected_camera}
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 CAMERA PATCH',mode,len(wanted),'actual JPEGs, canonical main',flush=True)
        types.FunctionType(g['main'].__code__,scope)()
        assert all((folder/('%05d.jpg'%j)).is_file() and not (folder/('%05d.jpg'%j)).is_symlink() and (folder/('%05d.jpg'%j)).stat().st_size>1000 for j in wanted)
        anchors=json.loads((folder/'anchors.json').read_text())
        assert anchors['fps']==30 and all(len(v)==g['NF'] for v in anchors['anchors'].values())
        assert all(sha(p)==h for p,h in protected.items()) and all(sha(p)==h for p,h in sample_sha.items())
        assert raw_snapshot(BASE/'blender/desk')==before_raw,'Original raw JPEG stat changed'
        report.update({'renderedFrames':wanted,'raw':str(folder),'anchors':str(folder/'anchors.json'),'allRequestedJpegsPresent':True,'original12163JpegSizeAndMtimeUnchanged':True,'originalRawSampleSha256':sample_sha,'protectedInputSha256':protected,'status':'Actual camera patch JPEGs complete; eyes/composites/encoded gates pending'})
        if mode=='render':
            poses=[]
            for j,p in enumerate(plans):
                k=replacements.get(j)
                poses.append(corrected_pose(k/30) if k is not None else g['pose_at']((j if p[0]=='render' else p[1])/30))
            rounded=[tuple(round(x,10) for x in p) for p in poses]
            moving=[False]+[rounded[j]!=rounded[j-1] for j in range(1,g['NF'])]
            spans=[];start=None
            for j,flag in enumerate(moving+[False]):
                if flag and start is None:start=j/30
                if not flag and start is not None:spans.append([start,j/30]);start=None
            motion={'frames':g['NF'],'moving_frames':sum(moving),'moving_ratio':sum(moving)/g['NF'],'top_ratio':sum(p[5]>=65 for p in poses)/g['NF'],'moving_spans':spans,'method':'Actually delivered original hold-source pose or new camera-only patch pose; scene cuts count as movement'}
            dump(PATCH/'blender/camera-motion.json',motion);report['cameraMotion']=motion
            report['allPatchFramesActuallyRendered']=True
        return report
    except BaseException as exc:
        failure={'type':type(exc).__name__,'message':str(exc)};report['status']='FAIL; original output and original NG preserved';report['error']=failure;raise
    finally:
        report['seconds']=round(time.time()-started,3)
        report['episodeRuntimeBindingsUnchanged']=all(g[k] is v for k,v in bindings.items())
        assert report['episodeRuntimeBindingsUnchanged'] and g['_VIS_QUEUE'] is None
        if before_raw is not None:report['original12163JpegSizeAndMtimeUnchanged']=raw_snapshot(BASE/'blender/desk')==before_raw
        for p,h in FROZEN.items():
            if h!='RECORD_AT_PREFLIGHT':assert sha(W/p)==h
        report['otherSceneFilepathsUnchanged']=all(bpy.data.scenes.get(n) is not None and bpy.data.scenes[n].render.filepath==p for n,p in scene_paths.items())
        other_after=other_raw_samples();report['oldOtherEpisodeSampledRawSha256']=other_before
        report['oldOtherEpisodeSampledRawUnchanged']=all(other_after.get(p)==h for p,h in other_before.items())
        report['changedOtherRawSamples']=[p for p,h in other_before.items() if other_after.get(p)!=h]
        for key in ['filepath','resolution_x','resolution_y','resolution_percentage']:setattr(d.SC.render,key,render_settings[key])
        d.SC.render.image_settings.file_format=render_settings['file_format'];d.SC.eevee.taa_render_samples=render_settings['samples']
        bpy.context.window.scene=old_scene;dump(record_path,report)
        if mode=='render' and failure is None and report.get('allPatchFramesActuallyRendered'):
            assert report['original12163JpegSizeAndMtimeUnchanged']
            assert report['otherSceneFilepathsUnchanged'] and report['oldOtherEpisodeSampledRawUnchanged']
            dump(PATCH/'camera-patch-complete.json',report)
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 CAMERA PATCH',mode,report.get('status'),str(record_path),flush=True)
