"""Root-only, add-only B4 v4 repair of three actual B3 principal-size defects and a separately visible garlic.

Use exact B3 delivered cameras and raw source references, never the nominal
original pose as baseline. Meshes, held object times, voice and overlays stay.
The sole explicit model-transform derivative is the lore garlic waiting site;
the original nose approach and sniff jitter are retained exactly.
All unique states are guarded before four probes; render requires their exact
approved report SHA. Original B3 and earlier outputs are never overwritten.
"""
import copy, hashlib, json, math, os, time, types
from pathlib import Path
import numpy as np

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-b1v1')
B2=Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
B3=Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
OUT=Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-v4-20261024')
STAGE_SHA='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
B3_PREPARED_SHA='3956feb23129e64514852978fba184e9e3f416f627e5c1139b5f94a12ed19841'
KEYS=('lore:garlic','rule:first','rule:north')
TARGETS={'lore:garlic':.43,'rule:first':.66,'rule:north':.55}
PROBES=(39.3,46.5,81.5,115.)
APPROACH={'lore:garlic':.01,'rule:first':.05,'rule:north':.05}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,v):
    with Path(p).open('x') as f:json.dump(v,f,ensure_ascii=False,indent=1,allow_nan=False)
def inventory(p):
    return {f.name:[f.stat().st_size,str(f.stat().st_mtime_ns),str(f.resolve())]
            for f in sorted(Path(p).glob('*.jpg'))}

def apply_lore_garlic_initial(g,ref):
    """One root-approved staging exception, reused verbatim by integrated B6.

    Keep the original43.5..45.5 nose approach and46.56 sniff jitter: replacing
    only the old waiting endpoint by adding delta*(1-original approach).
    """
    t=ref/30
    if g['cue_at'](t)['key']!='lore:garlic':return None
    root=g['PARTS']['garlic']['root'];old=g['BASE'][root][0].copy()
    expected=g['Vector']((0.,-.12,.018));new=g['Vector']((.035,-.047,.018))
    assert (old-expected).length<1e-7,'The approved old waiting site changed'
    scale=root.scale.copy();rotation=root.rotation_euler.copy()
    weight=1-g['u'](t,43.5,2.)
    delta=(new-old)*weight;root.location+=delta
    assert root.scale==scale and root.rotation_euler==rotation
    return {'oldInitial':list(old),'newInitial':list(new),'sourceFrame':ref,
        'sourceTime':t,'unchangedNoseApproach':[43.5,45.5],
        'unchangedSniffJitter':[46.56,46.86],'waitingShiftMeters':(new-old).length,
        'remainingInitialWeight':weight,'appliedDelta':list(delta),
        'actualRootLocation':list(root.location),'onlyThisRootTransformChanged':True}

def run(ns,authorized=False,mode='probe',visually_approved=False,probe_report_sha256=None):
    assert authorized is True and mode in ('probe','render'),'Only root may queue B4'
    dest=OUT/mode
    assert not OUT.is_symlink() and not os.path.lexists(dest),'Preserve prior B4 evidence'
    assert sha(B3/'prepared.json')==B3_PREPARED_SHA
    prepared=read(B3/'prepared.json');provenance=read(B3/'composite-provenance.json')
    assert prepared['frames']==provenance['frames']==10700
    for p,h in prepared['outputHashes'].items():assert sha(B3/p)==h
    b3poses=read(B3/'blender/delivered-camera-poses.json')['poses'];assert len(b3poses)==10700
    retained=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')
    plans=retained['plans'];assert len(plans)==10700 and retained['exactRenderFramesMatchOriginalMeta']
    cp=read(B2/'camera-patch.json');assert cp['allPatchFramesActuallyRendered']
    cpmap={int(j):int(k) for j,k in cp['replacementFrameToActualPatchFrame'].items()}
    cprefs={int(k):int(r) for k,r in cp['patchFrameToUnchangedObjectSourceFrame'].items()}
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert sha(g['__file__'])==STAGE_SHA and scene.render.engine=='BLENDER_EEVEE'
    assert g['VIS_QUEUE'] is None and all(tuple(g['plan'](j))==tuple(p) for j,p in enumerate(plans))
    original_apply=g['apply'];cues={c['key']:c for c in g['CUES']}
    bindings={k:g[k] for k in ('main','apply','apply_state','plan','pose_at','SPANS','EVENTS','BASE','GROUPS','CHILDREN')}
    old_scene=bpy.context.window.scene;paths={s.name:s.render.filepath for s in bpy.data.scenes}
    existing_scene_files={p:sha(p) for p in paths.values() if p and Path(p).is_file()}
    settings={k:getattr(scene.render,k) for k in ('filepath','resolution_x','resolution_y','resolution_percentage')}
    old_format=scene.render.image_settings.file_format;old_samples=scene.eevee.taa_render_samples
    old_quality=scene.render.image_settings.quality
    folders=(C/'blender/desk',Path(cp['raw']),B3/'blender/desk')
    before_raw={str(p):inventory(p) for p in folders};assert all(len(v)==10700 for p,v in before_raw.items() if p!=cp['raw'])
    protected_paths=[Path(g['__file__']),W/'scripts/blender/desk_lib_b1.py',B3/'prepared.json',
        B3/'composite-provenance.json',B3/'blender/delivered-camera-poses.json',B3/'final-held-dimensions.json',
        B3/'blender/desk/anchors.json',B3/'blender/desk/meta.json',B2/'camera-patch.json',
        C/'plan.json',C/'ys-chain-b1v1.json',C/'phrase-times.json',C/'ys-chain-b1v1.wav',C/'blender/data.json']
    protected={str(p):sha(p) for p in protected_paths};data_before=json.dumps(g['DATA'],sort_keys=True)
    started=time.time();report={'id':'ys-chain-b1v1','kind':'B4v4 front camera plus explicit lore-garlic waiting endpoint; sailor-only width and critical garlic are separate',
        'mode':mode,'helperSha256':sha(__file__),'sourceSha256':STAGE_SHA,'b3PreparedSha256':B3_PREPARED_SHA,
        'keys':list(KEYS),'targets':TARGETS,'approachFractions':APPROACH,'originalGateNGPreserved':True,'originalInspectorModified':False,
        'modelsVoiceSubtitlesAndTimesUnchanged':False,'modelMeshesVoiceSubtitlesAndSourceTimesUnchanged':True,
        'garlicInitialPlacementIsExplicitDerivative':True,'allOtherModelStateSourceRefsRetained':True,
        'garlicInitialPlacement':{'old':[0.,-.12,.018],'new':[.035,-.047,.018],'onlyCue':'lore:garlic','formula':'root += (newInitial-BASE)*(1-u(ref/30,43.5,2))','noseApproachAndSniffUnchanged':True},
        'placementFunction':'apply_lore_garlic_initial','placementFunctionHelperSha256':sha(__file__),
        'actualImages':[],'finalAcceptance':False}
    failure=None;projection_error=0.;source_hashes={}
    try:
        bpy.context.window.scene=scene
        selected=[j for j in range(10700) if g['cue_at'](j/30)['key'] in KEYS]
        assert selected
        output_refs={}
        # Verify every selected exact B3 raw source and its original object ref.
        for j in selected:
            p=plans[j];ref=j if p[0]=='render' else p[1]
            record=provenance['records'][j];assert record['frame']==j
            assert record['kind']=='byte-identical-B2-delivered-raw','Do not overwrite a B3 model/hand/needle patch'
            if j in cpmap:
                k=cpmap[j];assert cprefs[k]==ref;source=Path(cp['raw'])/('%05d.jpg'%k)
            else:source=C/'blender/desk'/('%05d.jpg'%j)
            assert (B3/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(record['source']).resolve()==source.resolve()
            real=str(source.resolve())
            if real not in source_hashes:source_hashes[real]=sha(source)
            assert source_hashes[real]==record['sha256']
            assert g['cue_at'](ref/30)['key']==g['cue_at'](j/30)['key']
            output_refs[j]=ref
        refs_by_key={key:sorted({ref for j,ref in output_refs.items() if g['cue_at'](j/30)['key']==key}) for key in KEYS}
        def tree(root):return [root]+[v for child in g['CHILDREN'].get(root,()) for v in tree(child)]
        def principal(key):
            if key=='lore:garlic':return g['GROUPS']['sailor']
            if key=='rule:first':return g['GROUPS']['magnets']
            return g['GROUPS']['compass']
        def critical(key):
            return tree(g['PARTS']['garlic']['root']) if key=='lore:garlic' else []
        local_cache={}
        def world_points(objects):
            deps=bpy.context.evaluated_depsgraph_get();parts=[]
            for ob in dict.fromkeys(objects):
                if ob.hide_render or ob.type not in ('MESH','FONT','CURVE'):continue
                cacheable=ob.type=='MESH' and not ob.data.shape_keys
                if cacheable and ob in local_cache:vv=local_cache[ob]
                else:
                    evaluated=ob.evaluated_get(deps);mesh=evaluated.to_mesh()
                    if mesh is None:continue
                    try:
                        v=np.empty(len(mesh.vertices)*3,dtype=np.float64);mesh.vertices.foreach_get('co',v)
                        vv=np.column_stack((v.reshape(-1,3),np.ones(len(mesh.vertices))))
                    finally:evaluated.to_mesh_clear()
                    if cacheable:local_cache[ob]=vv
                if len(vv):parts.append(vv@np.asarray(ob.matrix_world,dtype=np.float64).T)
            assert parts,'No actual principal evaluated geometry'
            return np.concatenate(parts)
        def project(vv):
            nonlocal projection_error
            deps=bpy.context.evaluated_depsgraph_get()
            matrix=d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            q=vv@np.asarray(matrix,dtype=np.float64).T;assert np.isfinite(q).all() and (q[:,3]>0).all()
            xy=np.column_stack(((q[:,0]/q[:,3]+1)*540,(1-q[:,1]/q[:,3])*960))
            for k in {0,len(vv)//2,len(vv)-1}:
                old=d.project(g['Vector'](vv[k,:3]));delta=max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1]))
                projection_error=max(projection_error,float(delta));assert delta<=.11
            return [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        def place(ref):
            points=original_apply(ref/30)
            apply_lore_garlic_initial(g,ref)
            bpy.context.view_layer.update();return points
        def measure(vv,p):g['pose_b1'](p);bpy.context.view_layer.update();return project(vv)
        poses={};fit_records={}
        for key in KEYS:
            cloud=[]
            for ref in refs_by_key[key]:place(ref);cloud.append(world_points(principal(key)))
            # The model's repeated static vertices do not need hundreds of
            # identical projection rows. Preserve every distinct real point.
            vv=np.unique(np.concatenate(cloud),axis=0);cue=cues[key]
            settled=min(10699,math.ceil((cue['start']+cue['move']+.05)*30))
            p=list(b3poses[settled]);baseline=p[:]
            # Keep the true sailor as primary. The moving garlic is a separate
            # critical subject, never counted to inflate principal width.
            # The approved waiting endpoint is the sole explicit transform
            # derivative. Use a front view rather than the occluding back view.
            auxiliary_cloud=[]
            if key=='lore:garlic':
                for ref in refs_by_key[key]:
                    place(ref);auxiliary_cloud.append(world_points(critical(key)))
            aux=np.unique(np.concatenate(auxiliary_cloud),axis=0) if auxiliary_cloud else None
            azimuths=[0.] if aux is not None else [p[4]]
            candidates=[];chosen=None
            for azimuth in azimuths:
                candidate=baseline[:];candidate[4]=azimuth
                framing=np.concatenate((vv,aux)) if aux is not None else vv
                desired_center=np.array([540.,855.])
                for _ in range(40):
                    primary_box=measure(vv,candidate);width=(primary_box[2]-primary_box[0])/1080
                    candidate[3]*=width/TARGETS[key]
                    principal_box=measure(vv,candidate);box=measure(framing,candidate)
                    center=np.array([(box[0]+box[2])/2,(box[1]+box[3])/2])
                    if abs((principal_box[2]-principal_box[0])/1080-TARGETS[key])<2e-5 and np.max(np.abs(center-desired_center))<.05:break
                    columns=[]
                    for axis in (0,2):
                        test=candidate[:];test[axis]+=.001;bb=measure(framing,test)
                        columns.append((np.array([(bb[0]+bb[2])/2,(bb[1]+bb[3])/2])-center)/.001)
                    delta=np.linalg.solve(np.column_stack(columns),desired_center-center)
                    assert np.isfinite(delta).all() and float(np.abs(delta).max())<.25
                    candidate[0]+=float(delta[0]);candidate[2]+=float(delta[1])
                principal_box=measure(vv,candidate)
                auxiliary_box=measure(aux,candidate) if aux is not None else None
                def safe_box(bb):return bb is not None and bb[0]>=40 and bb[2]<=1040 and bb[1]>=110 and bb[3]<=1600
                good=abs((principal_box[2]-principal_box[0])/1080-TARGETS[key])<.0002 and safe_box(principal_box) and (aux is None or safe_box(auxiliary_box))
                candidates.append({'azimuth':azimuth,'pose':candidate[:],'principalBox':principal_box,'criticalGarlicBox':auxiliary_box,'bothNamedSubjectsFrameSafe':bool(good)})
                if good:chosen=candidate;break
            fit_records[key]={'baselineB3SettledFrame':settled,'baselineB3Pose':baseline,'candidateViews':candidates,'onlyCameraChanged':key!='lore:garlic','explicitGarlicWaitingTransform':key=='lore:garlic'}
            assert chosen is not None,('No camera keeps the real primary and critical garlic frame-safe',key,candidates)
            p=chosen;final=measure(vv,p)
            assert p[5:]==baseline[5:],'Keep B3 oblique elevation/FOV'
            assert key=='lore:garlic' or p[4:]==baseline[4:]
            poses[key]=p;fit_records[key].update(fittedPose=p,actualUnionBox=final)
        def corrected_pose(t):
            j=max(0,min(10699,round(t*30)));key=g['cue_at'](j/30)['key']
            if key not in poses:return list(b3poses[j])
            p=list(poses[key]);cue=cues[key]
            if cue['move'] and t<cue['start']+cue['move']:
                p[3]*=1+APPROACH[key]*(1-g['u'](t,cue['start'],cue['move']))
            return p
        replacements={};sources={};unique={}
        for j in selected:
            ref=output_refs[j];signature=(ref,tuple(round(v,12) for v in corrected_pose(j/30)))
            k=unique.setdefault(signature,j);replacements[j]=k;sources[k]=ref
        def apply_lore_garlic_initial_record(g,ref):
            # Observational record only; do NOT apply the staging twice.
            root=g['PARTS']['garlic']['root'];old=g['BASE'][root][0];new=g['Vector']((.035,-.047,.018));weight=1-g['u'](ref/30,43.5,2.)
            return {'oldInitial':list(old),'newInitial':list(new),'sourceTime':ref/30,
                'remainingInitialWeight':weight,'appliedDelta':list((new-old)*weight),'actualRootLocation':list(root.location)}
        def state(j):
            aa=place(sources[j]);g['pose_b1'](corrected_pose(j/30));bpy.context.view_layer.update();return aa
        physical=[]
        for j in sorted(sources):
            state(j);key=g['cue_at'](j/30)['key'];box=project(world_points(principal(key)));width=(box[2]-box[0])/1080
            assert .4<=width<=.7 and box[0]>=40 and box[2]<=1040 and box[1]>=110 and box[3]<=1600,('Real B4 principal violation',j,key,width,box)
            auxiliary=None
            if critical(key):
                auxiliary=project(world_points(critical(key)))
                assert auxiliary[0]>=40 and auxiliary[2]<=1040 and auxiliary[1]>=110 and auxiliary[3]<=1600,('Active garlic clipped or underneath caption-safe bounds',j,auxiliary)
            physical.append({'frame':j,'time':j/30,'cue':key,'unchangedObjectSourceFrame':sources[j],
                'pose':corrected_pose(j/30),'box':box,'widthRatio':width,'evaluatedGeometry':True,
                'principalDefinition':'sailor body/head/clothing only; garlic not counted' if key=='lore:garlic' else 'two complete N/S bar magnets' if key=='rule:first' else 'whole compass box, needle and open lid',
                'auxiliaryGarlicBox':auxiliary,'auxiliaryNotCountedInPrincipalWidth':True,
                'explicitGarlicInitialPlacement':apply_lore_garlic_initial_record(g,sources[j]) if key=='lore:garlic' else None,'pass':True})
        report.update({'allGuardedStatesPass':True,'physical':physical,'projectionMaxDifferencePixels':projection_error,
            'newPoses':poses,'fitRecords':fit_records,'replacementFrameToActualPatchFrame':replacements,
            'patchFrameToUnchangedObjectSourceFrame':sources,'replacementOutputs':len(replacements),'actualSources':len(sources),
            'allSelectedB3RawSourcesAndHeldObjectRefsVerified':True,'allHeldDependenciesMapped':True,
            'allOtherB3DeliveredPosesRetained':True,'garlicCriticalCriterion':'Critical moving garlic inside x40..1040/y110..1600, separately from actual primary width; all unchanged held states checked. Actual occlusion/readability still needs probe and final MP4 eyes.'})
        if mode=='render':
            previous=OUT/'probe/report.json';assert visually_approved is True and probe_report_sha256 and sha(previous)==probe_report_sha256
            pr=read(previous);assert pr['helperSha256']==sha(__file__) and pr['allGuardedStatesPass'] and len(pr['actualImages'])==4
            assert pr['physical']==physical and pr['replacementFrameToActualPatchFrame']=={str(j):k for j,k in replacements.items()}
            wanted=sorted(sources);report['approvedProbeReportSha256']=probe_report_sha256
        else:wanted=[round(t*30) for t in PROBES]
        assert all(j in sources and replacements[j]==j for j in wanted)
        dest.mkdir(parents=True);write(dest/'preflight.json',report)
        a=copy.copy(g['A']);a.cache=str(dest);a.out=str(dest/'blender/patch');a.times=','.join(str(j/30) for j in wanted)
        a.force=False;a.samples=16;a.scale=1;a.every=1;a.start=0;a.stop=1e9
        scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
        scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95;scene.eevee.taa_render_samples=16
        scope={**g,'A':a,'apply':lambda t:state(round(t*30)),'pose_at':corrected_pose}
        types.FunctionType(g['main'].__code__,scope)()
        raw=Path(a.out)
        for j in wanted:
            f=raw/('%05d.jpg'%j);assert f.is_file() and not f.is_symlink() and f.stat().st_size>1000
            report['actualImages'].append({'frame':j,'time':j/30,'path':str(f),'sha256':sha(f),'actuallyViewed':False})
        report.update({'raw':str(raw),'anchors':str(raw/'anchors.json'),'allPatchFramesActuallyRendered':mode=='render',
            'status':'Actual four probes including early garlic floor state, approval pending' if mode=='probe' else 'Actual B4 source JPEGs complete; final MP4 eyes/gates pending'})
        if mode=='render':
            finalposes=[corrected_pose(replacements[j]/30) if j in replacements else b3poses[j] for j in range(10700)]
            moving=[False]+[finalposes[j]!=finalposes[j-1] for j in range(1,10700)]
            write(dest/'blender/delivered-camera-poses.json',{'fps':30,'frames':10700,'poses':finalposes})
            write(dest/'blender/camera-motion.json',{'frames':10700,'moving_frames':sum(moving),'moving_ratio':sum(moving)/10700,
                'top_ratio':sum(p[5]>=65 for p in finalposes)/10700,'method':'Exact B3 delivered pose base plus B4v4 camera and explicit lore-garlic waiting-endpoint derivative; cuts count as motion'})
        return report
    except BaseException as exc:
        failure={'type':type(exc).__name__,'message':str(exc)};report.update({'status':'FAIL; original/B3 preserved; no acceptance','error':failure});raise
    finally:
        for k,v in settings.items():setattr(scene.render,k,v)
        scene.render.image_settings.file_format=old_format;scene.render.image_settings.quality=old_quality;scene.eevee.taa_render_samples=old_samples
        bpy.context.window.scene=old_scene
        checks={'runtimeFunctionAndControlBindingsUnchanged':all(g[k] is v for k,v in bindings.items()),
            'protectedInputsUnchanged':all(sha(p)==h for p,h in protected.items()),
            'allOriginalB2B3RawInventoriesUnchanged':all(inventory(p)==v for p,v in before_raw.items()),
            'allSelectedB3SourceBytesUnchanged':all(sha(p)==h for p,h in source_hashes.items()),
            'allSceneFilepathsAndExistingFilesUnchanged':all(bpy.data.scenes[n].render.filepath==p for n,p in paths.items()) and all(sha(p)==h for p,h in existing_scene_files.items()),
            'dataUnchanged':json.dumps(g['DATA'],sort_keys=True)==data_before,'visibilityQueueClosed':g['VIS_QUEUE'] is None}
        report.update({'protectionChecks':checks,'protectedInputSha256':protected,'seconds':round(time.time()-started,3)})
        dest.mkdir(parents=True,exist_ok=True);write(dest/'report.json',report)
        assert all(checks.values()),'B4 preservation failure'

