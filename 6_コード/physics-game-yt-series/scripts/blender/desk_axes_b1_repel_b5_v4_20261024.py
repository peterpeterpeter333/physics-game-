"""Root-only B5v4: preserve N2 stages, fix v3 end-time/duration argument.

Prior v3 file/probe failure is preserved. The only motion-semantic correction is
u(t,98.20,98.60-98.20), retaining NN97.08..97.43, spin97.65..98.00,
and attachment98.20..98.60. No matrix workaround or guard loosening.

Use exact B3 delivered cameras and raw source references, never the nominal
original pose as baseline. Meshes, held source times, voice and overlays stay.
Explicit stages: N/N recoil while speaking, then the specified 180-degree escape
and S/N click in the existing silent pause. Other object times remain retained.
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
OUT=Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v4-20261024')
STAGE_SHA='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
B3_PREPARED_SHA='3956feb23129e64514852978fba184e9e3f416f627e5c1139b5f94a12ed19841'
KEYS=('rule:pull',)
TARGETS={'rule:pull':.66}
PROBES=(94.6,97.6,97.83333333333333,98.6)
SPIN_START=97.65
SPIN_END=98.00
ATTACH_START=98.20
ATTACH_END=98.60
RECOIL_METERS=.028

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,v):
    with Path(p).open('x') as f:json.dump(v,f,ensure_ascii=False,indent=1,allow_nan=False)
def inventory(p):
    return {f.name:[f.stat().st_size,str(f.stat().st_mtime_ns),str(f.resolve())]
            for f in sorted(Path(p).glob('*.jpg'))}

def run(ns,authorized=False,mode='probe',visually_approved=False,probe_report_sha256=None):
    assert authorized is True and mode in ('audit','probe','render'),'Only root may queue B5'
    dest=OUT/mode
    assert not OUT.is_symlink() and not os.path.lexists(dest),'Preserve prior B5 evidence'
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
        C/'plan.json',C/'ys-chain-b1v1.json',C/'phrase-times.json',C/'ys-chain-b1v1.wav',C/'blender/data.json',
        W/'scripts/blender/desk_axes_b1_repel_b5_v3_20261024.py',
        Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v3-20261024/probe/report.json')]
    protected={str(p):sha(p) for p in protected_paths};data_before=json.dumps(g['DATA'],sort_keys=True)
    started=time.time();report={'id':'ys-chain-b1v1','kind':'B5v4 staged clarity: N/N recoil, voice-pause180-degree escape, S/N attachment',
        'mode':mode,'helperSha256':sha(__file__),'sourceSha256':STAGE_SHA,'b3PreparedSha256':B3_PREPARED_SHA,
        'keys':list(KEYS),'targets':TARGETS,'originalGateNGPreserved':True,'originalInspectorModified':False,
        'modelMeshesVoiceSubtitlesAndSourceTimesUnchanged':True,'barAStateIsExplicitDerivative':True,'actualImages':[],'finalAcceptance':False}
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
        def principal(key):return g['GROUPS']['magnets']
        def poles(root):
            labels={ob.data.body:ob.matrix_world.translation.copy() for ob in tree(root) if ob.type=='FONT' and ob.data.body in ('N','S')}
            assert set(labels)=={'N','S'}
            return labels
        def nearest_poles():
            pa=poles(g['PARTS']['magnets']['a']);pb=poles(g['PARTS']['magnets']['b'])
            rows=sorted([{'a':a,'b':b,'distanceMeters':(av-bv).length,'aWorld':list(av),'bWorld':list(bv)} for a,av in pa.items() for b,bv in pb.items()],key=lambda x:x['distanceMeters'])
            assert rows[1]['distanceMeters']-rows[0]['distanceMeters']>1e-5
            return {'nearest':rows[0],'allPairs':rows}
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
        def stages(t):
            recoil=RECOIL_METERS*d.back(d.lin(t,97.08,97.43)) if t>=97.08 else 0.
            spin=math.pi*d.back(d.lin(t,SPIN_START,SPIN_END)) if t>=SPIN_START else 0.
            attach=g['u'](t,ATTACH_START,ATTACH_END-ATTACH_START)
            return recoil,spin,attach
        # The frozen episode u(t,a,duration) takes a duration, NOT an end time.
        # V3 passed98.60 as that duration; retain its failed report unmodified.
        duration=ATTACH_END-ATTACH_START
        assert abs(duration-.4)<1e-12
        assert stages(ATTACH_START)[2]==0. and stages(ATTACH_END)[2]==1.
        assert abs(stages((ATTACH_START+ATTACH_END)/2)[2]-.5)<1e-12
        assert stages(97.6)[1]==0. and abs(stages(97.6)[0]-RECOIL_METERS)<1e-12
        report['attachmentTimingContract']={'episodeUThirdArgument':'duration','start':ATTACH_START,'end':ATTACH_END,'durationSeconds':duration,
            'atStart':stages(ATTACH_START)[2],'atMidpoint':stages((ATTACH_START+ATTACH_END)/2)[2],'atEnd':stages(ATTACH_END)[2],
            'strictTimingAssertionsPassed':True,'matrixBehaviorOrGapToleranceChanged':False,
            'failedV3Source':'scripts/blender/desk_axes_b1_repel_b5_v3_20261024.py',
            'failedV3SourceSha256':'b5284ff4c264a57153d2f4bc31480e37f6b7e4bea019b579bdd967b4bba6dc6d',
            'failedV3Report':'/private/tmp/ys/ys-chain-b1v1-repel-b5-v3-20261024/probe/report.json'}
        def place(ref,operation_time=None):
            t=ref/30 if operation_time is None else operation_time
            points=original_apply(ref/30);bpy.context.view_layer.update()
            a=g['PARTS']['magnets']['a'];b=g['PARTS']['magnets']['b']
            b_before=tuple(v for row in b.matrix_world for v in row)
            hand_before={name:(tuple(v for row in ob.matrix_world for v in row),ob.hide_render,ob.hide_viewport) for name,ob in d.HANDS.items()}
            a.rotation_euler=g['BASE'][a][1].copy();a.location=g['BASE'][a][0].copy()
            bpy.context.view_layer.update()
            base_inverse=a.matrix_world.inverted().copy()
            local_anchors={key:base_inverse@points[key] for key in ('magN','magS') if key in points}
            recoil,spin,attach=stages(t);a.location.y-=recoil;a.rotation_euler.z+=spin
            bpy.context.view_layer.update()
            # Preserve the original B/hand until the hand has left at98.15.
            # Then an autonomous S/N attraction closes to a real1mm mesh gap.
            if attach:
                av=world_points(tree(a));bv=world_points(tree(b))
                delta=float(av[:,1].max()+.001-bv[:,1].min())
                b.location.y+=delta*attach;bpy.context.view_layer.update()
            for key,point in local_anchors.items():points[key]=a.matrix_world@point
            if t<ATTACH_START:assert tuple(v for row in b.matrix_world for v in row)==b_before
            assert all((tuple(v for row in d.HANDS[name].matrix_world for v in row),d.HANDS[name].hide_render,d.HANDS[name].hide_viewport)==old for name,old in hand_before.items())
            return points
        def measure(vv,p):g['pose_b1'](p);bpy.context.view_layer.update();return project(vv)
        poses={};fit_records={}
        for key in KEYS:
            cloud=[]
            for j in selected:
                if g['cue_at'](j/30)['key']==key:place(output_refs[j],j/30);cloud.append(world_points(principal(key)))
            # The model's repeated static vertices do not need hundreds of
            # identical projection rows. Preserve every distinct real point.
            vv=np.unique(np.concatenate(cloud),axis=0);cue=cues[key]
            settled=min(10699,math.ceil((cue['start']+cue['move']+.05)*30))
            p=list(b3poses[settled]);baseline=p[:]
            # The whole physical two-bar interaction is the primary, including
            # its real changed separation; neither hand nor background counts.
            desired_center=np.array([540.,855.])
            for _ in range(30):
                box=measure(vv,p);width=(box[2]-box[0])/1080
                p[3]*=width/TARGETS[key]
                box=measure(vv,p);center=np.array([(box[0]+box[2])/2,(box[1]+box[3])/2])
                if abs((box[2]-box[0])/1080-TARGETS[key])<2e-5 and np.max(np.abs(center-desired_center))<.05:break
                columns=[]
                for axis in (0,2):
                    test=p[:];test[axis]+=.001;bb=measure(vv,test)
                    columns.append((np.array([(bb[0]+bb[2])/2,(bb[1]+bb[3])/2])-center)/.001)
                delta=np.linalg.solve(np.column_stack(columns),desired_center-center)
                assert np.isfinite(delta).all() and float(np.abs(delta).max())<.15
                p[0]+=float(delta[0]);p[2]+=float(delta[1])
            final=measure(vv,p)
            assert abs((final[2]-final[0])/1080-TARGETS[key])<.0002
            assert p[4:]==baseline[4:],'Keep B3 target shot angles/FOV'
            poses[key]=p;fit_records[key]={'baselineB3SettledFrame':settled,'baselineB3Pose':baseline,'fittedPose':p,'actualUnionBox':final}
        def corrected_pose(t):
            j=max(0,min(10699,round(t*30)));key=g['cue_at'](j/30)['key']
            if key not in poses:return list(b3poses[j])
            p=list(poses[key]);cue=cues[key]
            if cue['move'] and t<cue['start']+cue['move']:
                p[3]*=1+.05*(1-g['u'](t,cue['start'],cue['move']))
            return p
        replacements={};sources={};unique={}
        for j in selected:
            ref=output_refs[j];signature=(ref,tuple(round(v,12) for v in corrected_pose(j/30)),tuple(round(v,12) for v in stages(j/30)))
            k=unique.setdefault(signature,j);replacements[j]=k;sources[k]=ref
        def state(j):
            aa=place(sources[j],j/30);g['pose_b1'](corrected_pose(j/30));bpy.context.view_layer.update();return aa
        # The original post-spin S/N is physically normal under N2, not an
        # intrinsic physics bug. The derivative separates the narrated N/N
        # stage from the specified post-voice escape/attachment for clarity.
        original_timeline=[]
        for at in (96.8,97.6,98.16666666666667):
            j=round(at*30);original_apply(output_refs[j]/30);bpy.context.view_layer.update()
            original_timeline.append({'outputTime':at,'sourceFrame':output_refs[j],**nearest_poles()})
        pole_math=[]
        for at,expected in ((94.6,('N','S')),(96.8,('N','N')),(97.6,('N','N')),(98.66666666666667,('S','N'))):
            j=round(at*30);place(output_refs[j],j/30);proof=nearest_poles()
            assert (proof['nearest']['a'],proof['nearest']['b'])==expected,('Wrong actual staged nearest poles',at,proof)
            pole_math.append({'outputTime':at,'outputFrame':j,'unchangedOtherObjectSourceFrame':output_refs[j],**proof})
        place(output_refs[round(97.06666666666666*30)],97.06666666666666);before_gap=nearest_poles()['nearest']['distanceMeters']
        place(output_refs[round(97.6*30)],97.6);after_gap=nearest_poles()['nearest']['distanceMeters']
        assert after_gap>before_gap+.02
        end_t=98.66666666666667;place(output_refs[round(end_t*30)],end_t)
        av=world_points(tree(g['PARTS']['magnets']['a']));bv=world_points(tree(g['PARTS']['magnets']['b']))
        actual_gap=float(bv[:,1].min()-av[:,1].max());assert abs(actual_gap-.001)<1e-6,('Strict real1mm gap failed',actual_gap,stages(end_t))
        report.update({'originalTimelinePhysicallyNormalAfterSpecifiedSpin':original_timeline,
            'correctionOfEarlierB5V1V2BugClaim':'Original97.6 S/N after the specified180-degree escape is not itself a magnetic-physics violation. V1/V2 were unadopted candidates. V4 retains N2 escape/click and distinguishes stages more clearly.',
            'nearestWorldPoleAssertions':pole_math,'actualFinalMeshGapMeters':actual_gap,
            'recoil':{'start':97.08,'end':97.43,'meters':RECOIL_METERS,'beforeGapMeters':before_gap,'afterGapMeters':after_gap},
            'spin':{'start':SPIN_START,'end':SPIN_END,'radians':math.pi,'ease':'same original d.back','voiceEndFromCanonicalCueTable':97.50},
            'SNAttraction':{'start':ATTACH_START,'end':ATTACH_END,'realFinalMeshGapMeters':actual_gap},
            'barBOriginalWorldMatricesRetainedBefore98p2':True,'allOriginalHandWorldMatricesAndVisibilityRetained':True,
            'barABExplicitRuntimeDerivative':'A original spin is delayed until the existing voice pause, preceded by28mm N/N recoil; B attaches autonomously after the original hand exits. Other objects retain exact old held source states.'})
        physical=[]
        for j in sorted(sources):
            state(j);key=g['cue_at'](j/30)['key'];box=project(world_points(principal(key)));width=(box[2]-box[0])/1080
            assert .4<=width<=.7 and box[0]>=40 and box[2]<=1040 and box[1]>=110 and box[3]<=1600,('Real B5 principal violation',j,key,width,box)
            physical.append({'frame':j,'time':j/30,'cue':key,'unchangedObjectSourceFrame':sources[j],
                'operationTime':j/30,'stageValues':stages(j/30),'pose':corrected_pose(j/30),'box':box,'widthRatio':width,'evaluatedGeometry':True,
                'principalDefinition':'the complete two N/S bar magnets, including actual recoil separation; hand/background excluded',
                'nearestActualPolePair':nearest_poles(),'pass':True})
        report.update({'allGuardedStatesPass':True,'physical':physical,'projectionMaxDifferencePixels':projection_error,
            'newPoses':poses,'fitRecords':fit_records,'replacementFrameToActualPatchFrame':replacements,
            'patchFrameToUnchangedObjectSourceFrame':sources,'replacementOutputs':len(replacements),'actualSources':len(sources),
            'allSelectedB3RawSourcesAndHeldObjectRefsVerified':True,'allHeldDependenciesMapped':True,
            'allOtherB3DeliveredPosesRetained':True,'finalAssemblyMustRetainB4AndUseCleanCanonicalProblemFolder':True,'cameraMotionFileIsNotAReplacementForB4FinalAssembly':True})
        if mode=='render':
            previous=OUT/'probe/report.json';assert visually_approved is True and probe_report_sha256 and sha(previous)==probe_report_sha256
            pr=read(previous);assert pr['helperSha256']==sha(__file__) and pr['allGuardedStatesPass'] and len(pr['actualImages'])==len(PROBES)
            assert pr['physical']==physical and pr['replacementFrameToActualPatchFrame']=={str(j):k for j,k in replacements.items()}
            wanted=sorted(sources);report['approvedProbeReportSha256']=probe_report_sha256
        else:wanted=[] if mode=='audit' else [round(t*30) for t in PROBES]
        assert all(j in sources and replacements[j]==j for j in wanted)
        dest.mkdir(parents=True);write(dest/'preflight.json',report)
        if mode=='audit':
            report.update({'status':'Numerical audit only; zero rendered images','allPatchFramesActuallyRendered':False})
            return report
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
            'status':'Actual four staged probes, approval pending' if mode=='probe' else 'Actual B5 source JPEGs complete; final MP4 eyes/gates pending'})
        if mode=='render':
            finalposes=[corrected_pose(replacements[j]/30) if j in replacements else b3poses[j] for j in range(10700)]
            moving=[False]+[finalposes[j]!=finalposes[j-1] for j in range(1,10700)]
            write(dest/'blender/delivered-camera-poses.json',{'fps':30,'frames':10700,'poses':finalposes})
            write(dest/'blender/camera-motion.json',{'frames':10700,'moving_frames':sum(moving),'moving_ratio':sum(moving)/10700,
                'top_ratio':sum(p[5]>=65 for p in finalposes)/10700,'method':'Exact B3 delivered pose base plus B5v4 N/N recoil / pause-spin / S/N attachment sources; cuts count as motion'})
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
        assert all(checks.values()),'B5 preservation failure'




