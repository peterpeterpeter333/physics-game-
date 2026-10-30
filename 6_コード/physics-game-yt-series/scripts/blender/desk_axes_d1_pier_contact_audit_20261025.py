"""Root GUI, audit only: exact delivered replay and three pier contact repairs.

No render/operator, source edit, model reload, runtime rebind or media overwrite.
The existing local-v4 replay is reused unchanged. Pier height is derived from
evaluated world geometry, not an assumed parent/global scale. All reported
visibility/occlusion samples are diagnostic, not actual encoded-image approval.
"""
import hashlib
import json
import math
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-20261025')
PINS={
 'scripts/blender/desk_d1v1.py':'004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2',
 'scripts/blender/desk_lib_d1.py':'742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923',
 'scripts/blender/desk_axes_d1_final_local_bundle_v4_20261024.py':'1edcafa6e7d52033554834398ce49daf2f2022133c13ec6b87d7d77655d33ca2',
 'scripts/blender/desk_axes_d1_camera_patch_v2_20261024.py':'6ef21b9a7c5207855bb9c3ec52e3a1f36a98cd80210d78f1278507303e05857f',
 'scripts/blender/desk_axes_d1_complete_v4_delivered_supplement_20261025.py':'d18ae16ac335ab12c2bd209b3a0eb526f92dba5cbd5f933b7087eff0107f6b60',
 'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f'}
MERGE_PIN='2184a78457c7444799b857524f860c5c71c58c7c25d14365593d5ad00891a9e8'
PROVENANCE_PIN='c7813f40a8fc9fefb5d0cdea49022e9633be510f69589c852a8b337a15b87d94'
LOCAL_PIN=PINS['scripts/blender/desk_axes_d1_final_local_bundle_v4_20261024.py']

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def flat(m):return tuple(float(x)for row in m for x in row)
def signature(r):
    return (r['layer'],int(r['actualFrame']),int(r['unchangedOtherObjectSourceFrame']),
        None if r['semanticOperationTime']is None else float(r['semanticOperationTime']),
        float(r['cameraOperationTime']),tuple(float(v)for v in r['pose']))
def raw_state(p):
    s=Path(p).stat();return [s.st_size,s.st_mtime_ns,sha(p)]
def box(points):
    return [min(p[i]for p in points)for i in range(3)]+[max(p[i]for p in points)for i in range(3)]

def world_mesh(ob,bpy):
    dg=bpy.context.evaluated_depsgraph_get();ev=ob.evaluated_get(dg);me=ev.to_mesh()
    try:
        me.calc_loop_triangles()
        return [ob.matrix_world@v.co for v in me.vertices],[tuple(t.vertices)for t in me.loop_triangles]
    finally:ev.to_mesh_clear()

def surface_z_at_xy(points,triangles,x,y):
    values=[]
    for ia,ib,ic in triangles:
        a,b,c=points[ia],points[ib],points[ic]
        bx,by,cx,cy=b.x-a.x,b.y-a.y,c.x-a.x,c.y-a.y
        det=bx*cy-by*cx
        if abs(det)<1e-15:continue
        u=((x-a.x)*cy-(y-a.y)*cx)/det;v=(bx*(y-a.y)-by*(x-a.x))/det
        if u>=-1e-8 and v>=-1e-8 and u+v<=1+1e-8:values.append(float(a.z+u*(b.z-a.z)+v*(c.z-a.z)))
    assert values,'Actual evaluated pier has no surface below the axle center'
    return max(values)

def object_state(ob):
    keys=tuple(k.value for k in ob.data.shape_keys.key_blocks)if ob.type=='MESH'and ob.data.shape_keys else ()
    return (flat(ob.matrix_world),ob.hide_render,ob.hide_viewport,
        ob.data.as_pointer()if ob.data else None,tuple(s.material.as_pointer()if s.material else None for s in ob.material_slots),keys)

def socket_value(socket):
    if not hasattr(socket,'default_value'):return None
    value=socket.default_value
    if isinstance(value,(float,int,bool,str)):return value
    try:return tuple(float(x)for x in value)
    except (TypeError,ValueError):return None

class DeliveredReplay:
    """Reusable private replay; every entry object is restored on close()."""
    def __init__(self,ns,cache=FINAL):
        self.ns,self.cache=ns,Path(cache);self.g=ns['main'].__globals__
        self.bpy,self.d=self.g['bpy'],self.g['d'];self.scene=self.d.SC;self.local=None
        self.previous=self.bpy.context.window.scene
        self.paths={s.name:s.render.filepath for s in self.bpy.data.scenes}
        self.existing_outputs={p:sha(p)for p in self.paths.values()if p and Path(p).is_file()}
        self.bindings={k:self.g[k]for k in ['main','apply','apply_state_d1','engine_state','mine_state','reset','pose_at','set_camera','plan_d1','BASE','SPANS','EVENTS','DATA']}
        self.data_before=json.dumps(self.g['DATA'],sort_keys=True)
        self.protected={str(W/p):h for p,h in PINS.items()}
        self.protected[str(self.cache/'d1-complete-merge.json')]=MERGE_PIN
        self.protected[str(self.cache/'blender/delivered-provenance.json')]=PROVENANCE_PIN
        self.raw_before={};self.closed=False
        try:
            self.bpy.context.window.scene=self.scene;self.bpy.context.view_layer.update()
            self.snapshot_entry()
        finally:self.bpy.context.window.scene=self.previous

    def snapshot_entry(self):
        self.objects=list(self.scene.objects)
        self.entry={o:(o.location.copy(),o.rotation_euler.copy(),o.scale.copy(),o.hide_render,o.hide_viewport,o.active_material,
            [(k,k.value)for k in o.data.shape_keys.key_blocks]if o.type=='MESH'and o.data.shape_keys else [],
            o.data.body if o.type=='FONT'else None)for o in self.objects}
        self.entry_world={o:flat(o.matrix_world)for o in self.objects}
        self.camera={k:getattr(self.d.CAM_D,k)for k in ['lens','type','ortho_scale','clip_start','clip_end']}
        self.dof={k:getattr(self.d.CAM_D.dof,k)for k in ['use_dof','focus_distance','aperture_fstop']}
        self.material_defaults=[]
        materials=set(self.d.MATS.values())|set(self.g.get('D1_HL',{}).values())|{s.material for o in self.objects for s in o.material_slots if s.material}
        for mat in materials:
            if not mat.node_tree:continue
            for node in mat.node_tree.nodes:
                for socket in node.inputs:
                    value=socket_value(socket)
                    if value is None:continue
                    self.material_defaults.append((socket,value))

    def open(self):
        assert self.g['_VIS_QUEUE']is None and self.scene.render.engine=='BLENDER_EEVEE'
        for p,h in self.protected.items():assert sha(p)==h,p
        self.merge=read(self.cache/'d1-complete-merge.json');m=self.merge
        assert m['frames']==12163 and m['localHelperSha256']==LOCAL_PIN
        self.lp=read(Path(m['localBundle'])/'render/report.json')
        assert sha(Path(m['localBundle'])/'render/report.json')==m['localRenderReportSha256']
        assert self.lp['allPatchFramesActuallyRendered']and self.lp['allReplacementPhysicalPass']and self.lp['actualFrameCount']==1991
        for p,h in self.lp['frozen'].items():assert sha(p)==h;self.protected[p]=h
        for p in [self.cache/'plan.json',self.cache/'ys-chain-d1v1.json',self.cache/'phrase-times.json',
            self.cache/'ys-chain-d1v1.voice.wav',self.cache/'ys-chain-d1v1.wav',self.cache/'blender/data.json',
            self.cache/'blender/desk/anchors.json',self.cache/'blender/desk/meta.json',self.cache/'blender/delivered-camera-poses.json',
            Path(m['localBundle'])/'render/report.json',Path(m['camera'])/'camera-patch-complete.json']:
            self.protected[str(p)]=sha(p)
        self.rows=read(self.cache/'blender/delivered-provenance.json')['frames'];assert len(self.rows)==12163
        self.states={};self.outputs={}
        for j,r in enumerate(self.rows):
            assert r['frame']==j and (self.cache/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(r['raw']).resolve()
            sig=signature(r);self.states.setdefault(sig,r);self.outputs.setdefault(sig,[]).append(j)
            if r['raw']not in self.raw_before:self.raw_before[r['raw']]=raw_state(r['raw'])
        assert len(self.states)==5074
        # An exact held delivery signature must really point to identical pixels.
        for sig,r in self.states.items():
            h=self.raw_before[r['raw']][2]
            assert all(self.raw_before[self.rows[j]['raw']][2]==h for j in self.outputs[sig])
        self.bpy.context.window.scene=self.scene
        self.module=runpy.run_path(str(m['localHelper']))
        diagnostic=next(Path(p)for p in self.lp['frozen']if Path(p).name=='d1-straw-trace-height-diagnostic-v2-20261024.json')
        self.local=self.module['prepare'](self.ns,self.lp['frozen'][str(diagnostic)])
        plan=self.local['plan']
        assert {str(j):k for j,k in plan['replacements'].items()}==self.lp['replacementFrameToActualPatchFrame']
        assert {str(j):k for j,k in plan['sources'].items()}==self.lp['patchFrameToUnchangedOtherObjectSourceFrame']
        self.tools=self.local['camera']['geometry_tools'](self.ns)
        families=[('main','d1_engine',self.g['P']['engine'])]+[(name,name,engine)for root,engine in self.g['P']['fuji']['engines']for name in [self.g['CREATED_NAME'][root]]]
        self.families=[]
        for role,prefix,q in families:
            def named(suffix):
                obs=[o for o in q['objects']if self.g['CREATED_NAME'][o]==prefix+suffix]
                assert len(obs)==1,(prefix,suffix);return obs[0]
            pier,axle=named('_pier'),named('_axle')
            assert not self.g['CHILDREN'].get(pier) and pier.type=='MESH'and axle.type=='MESH'
            self.families.append({'role':role,'pier':pier,'axle':axle,'engine':q})
        assert len(self.families)==3
        return self

    def replay(self,r):
        g=self.g;j=r['frame'];plan=self.local['plan']
        if r['layer']=='local':
            assert plan['replacements'][j]==r['actualFrame']and plan['sources'][r['actualFrame']]==r['unchangedOtherObjectSourceFrame']
            assert plan['pose'](r['actualFrame']/30)==r['pose']
            aa=self.local['apply'](r['actualFrame'])
        else:
            baseline=plan['baseDelivery'](j)
            assert all(baseline[k]==r[k]for k in ['layer','actualFrame','unchangedOtherObjectSourceFrame','cameraOperationTime','pose'])
            self.d.show(self.local['coalSupport'],False)
            aa=g['apply'](r['unchangedOtherObjectSourceFrame']/30)
            types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:r['pose']})(r['cameraOperationTime'])
        self.bpy.context.view_layer.update()
        return aa

    def repair(self,family):
        from mathutils import Matrix,Vector
        pier,axle=family['pier'],family['axle'];bpy=self.bpy
        assert not pier.hide_render and not axle.hide_render
        before,triangles=world_mesh(pier,bpy);av,_=world_mesh(axle,bpy);old,ab=box(before),box(av)
        bottom,top,axle_bottom=old[2],old[5],ab[2];height=top-bottom;gap=axle_bottom-top
        assert height>0 and gap>0
        effective= pier.parent.matrix_world@pier.matrix_parent_inverse if pier.parent else Matrix.Identity(4)
        dz=effective.to_3x3()@Vector((0,0,1))
        assert abs(dz.x)<1e-9 and abs(dz.y)<1e-9 and dz.z>0,'Pier local Z must be world vertical'
        ratio=(axle_bottom-bottom)/height;local_shift=(axle_bottom-top)/(2*dz.z)
        location=tuple(pier.location);scale=tuple(pier.scale);rotation=tuple(pier.rotation_euler)
        mesh= pier.data.as_pointer();materials=tuple(s.material.as_pointer()if s.material else None for s in pier.material_slots)
        pier.scale.z*=ratio;pier.location.z+=local_shift;bpy.context.view_layer.update()
        after,after_triangles=world_mesh(pier,bpy);new=box(after)
        axis=axle.matrix_world.translation;surface=surface_z_at_xy(after,after_triangles,axis.x,axis.y)
        contact=abs(surface-axle_bottom);bottom_error=abs(new[2]-bottom)
        xy_error=max(abs(new[i]-old[i])for i in [0,1,3,4])
        expected_gap=height*(.028/.18);expected_error=abs(gap-expected_gap)
        passed=contact<=1e-6 and abs(new[5]-axle_bottom)<=1e-6 and bottom_error<=1e-6 and xy_error<=1e-7 and expected_error<=1e-6
        assert tuple(pier.rotation_euler)==rotation and pier.data.as_pointer()==mesh
        assert tuple(s.material.as_pointer()if s.material else None for s in pier.material_slots)==materials
        return {'copy':family['role'],'creationName':self.g['CREATED_NAME'][pier],
            'parent':self.g['CREATED_NAME'].get(pier.parent,pier.parent.name)if pier.parent else None,
            'oldEvaluatedBounds':old,'newEvaluatedBounds':new,'axleEvaluatedBounds':ab,
            'oldWorldGapMeters':gap,'expectedWorldGapFromActualHeightMeters':expected_gap,'expectedGapErrorMeters':expected_error,
            'parentEffectiveLocalZInWorld':list(dz),'oldLocalLocation':location,'newLocalLocation':list(pier.location),
            'oldLocalScale':scale,'newLocalScale':list(pier.scale),'scaleZRatio':ratio,'localCenterOffsetZ':local_shift,
            'worldCenterShiftMeters':gap/2,'oldBottomPreservedErrorMeters':bottom_error,'xyBoundsUnchangedErrorMeters':xy_error,
            'newSurfaceAtAxleCenterXY':surface,'axleBottomMeters':axle_bottom,'surfaceContactErrorMeters':contact,
            'axleNotRaisedOrReshaped':True,'pierOriginalMeshRotationAndMaterialUnchanged':True,
            'sameOriginalAssemblyOffsetPreserved':True,'pass':passed}

    def occlusion_samples(self,family):
        from mathutils import Vector
        pier=family['pier'];vv,_=world_mesh(pier,self.bpy);b=box(vv);cx=(b[0]+b[3])/2;cy=(b[1]+b[4])/2;cz=(b[2]+b[5])/2
        targets=[Vector((cx,cy,b[5])),Vector((cx,b[1],cz)),Vector((cx,b[4],cz)),Vector((b[0],cy,cz)),Vector((b[3],cy,cz))]
        samples=[];origin=self.d.CAM.matrix_world.translation;dg=self.bpy.context.evaluated_depsgraph_get()
        for p in targets:
            xy=self.d.project(p);in_front=(self.d.CAM.matrix_world.inverted()@p).z<0
            inside=in_front and 0<=xy[0]<=1080 and 0<=xy[1]<=1920;hit=None
            if inside:
                direction=p-origin;length=direction.length
                ok,_,_,_,obj,_=self.scene.ray_cast(dg,origin,direction.normalized(),distance=length+1e-5)
                if ok:hit=self.g['CREATED_NAME'].get(getattr(obj,'original',obj),obj.name)
            samples.append({'world':list(p),'projected':list(xy),'inFrustum':inside,'firstRayHitCreationName':hit,'hitIsPier':hit==self.g['CREATED_NAME'][pier]})
        return {'samples':samples,'hasUnobscuredSurfaceSample':any(r['hitIsPier']for r in samples),
            'notCompletePixelVisibilityProof':True,'notUsedToSkipAnyVisiblePierRepair':True}

    def close(self):
        if self.closed:return
        self.bpy.context.window.scene=self.scene
        if self.local is not None:self.local['cleanup']()
        else:
            for ob in list(self.scene.objects):
                if ob not in self.objects and ob.get('D1_V4_SUPPORT_HELPER_SHA')==LOCAL_PIN:
                    mesh=ob.data;self.bpy.data.objects.remove(ob,do_unlink=True)
                    if mesh.users==0:self.bpy.data.meshes.remove(mesh)
        for ob,(location,rotation,scale,render,viewport,material,shapes,text)in self.entry.items():
            ob.location=location;ob.rotation_euler=rotation;ob.scale=scale
            if ob.hide_render!=render:ob.hide_render=render
            if ob.hide_viewport!=viewport:ob.hide_viewport=viewport
            if ob.active_material is not material:ob.active_material=material
            for key,value in shapes:key.value=value
            if text is not None:ob.data.body=text
        for socket,value in self.material_defaults:
            current=socket_value(socket)
            if current!=value:socket.default_value=value
        for key,value in self.camera.items():setattr(self.d.CAM_D,key,value)
        for key,value in self.dof.items():setattr(self.d.CAM_D.dof,key,value)
        for name,value in self.paths.items():self.bpy.data.scenes[name].render.filepath=value
        self.bpy.context.view_layer.update()
        checks={'allEntryObjectTransformsRestored':all(max(abs(a-b)for a,b in zip(flat(o.matrix_world),m))<=1e-9 for o,m in self.entry_world.items()),
            'noNewGeometryRemains':set(self.scene.objects)==set(self.objects),
            'runtimeBindingsUnchanged':all(self.g[k]is v for k,v in self.bindings.items()),
            'runtimeDataUnchanged':json.dumps(self.g['DATA'],sort_keys=True)==self.data_before,
            'allEntryMaterialAndHighlightInputsRestored':all(socket_value(s)==v for s,v in self.material_defaults),
            'sourcesAndProtectedInputsUnchanged':all(sha(p)==h for p,h in self.protected.items()),
            'allDeliveredRawShaAndStatsUnchanged':all(raw_state(p)==s for p,s in self.raw_before.items()),
            'allOtherExistingSceneOutputsUnchanged':all(sha(p)==h for p,h in self.existing_outputs.items()),
            'allSceneFilepathsRestored':all(self.bpy.data.scenes[n].render.filepath==p for n,p in self.paths.items()),
            'visibilityQueueClosed':self.g['_VIS_QUEUE']is None}
        self.bpy.context.window.scene=self.previous;self.closed=True
        assert all(checks.values()),checks
        return checks

def run(ns,authorized=False,out=None):
    assert authorized is True,'Root alone queues this no-render GUI audit'
    dest=Path(out or OUT/'audit/report.json');assert not dest.exists()and not dest.parent.is_symlink()
    dest.parent.mkdir(parents=True,exist_ok=True)
    replay=DeliveredReplay(ns);started=time.time();report={'episode':'D-1','mode':'audit','helperSha256':sha(__file__),
        'cache':str(FINAL),'mergeSha256':MERGE_PIN,'provenanceSha256':PROVENANCE_PIN,'renders':0,
        'originalFilesOrRuntimeFunctionsModified':False,'explicitPierTransformDerivative':True,
        'originalNGPreserved':True,'automaticApproval':False,'actualImageEyeReviewPending':True,'finalAcceptance':False,
        'candidateStates':[],'excludedHiddenStates':[],'replacementOutputToPatchSource':{},'fullSourceReplayPending':True}
    try:
        replay.open();g=replay.g;tools=replay.tools;pier_set={f['pier']for f in replay.families}
        for sig,row in replay.states.items():
            replay.replay(row);visible=[f for f in replay.families if not f['pier'].hide_render]
            if not visible:
                report['excludedHiddenStates'].append({'representativeFrame':row['frame'],'delivered':row,'representedOutputs':replay.outputs[sig]});continue
            non_pier={o:object_state(o)for o in replay.scene.objects if o not in pier_set}
            hidden_piers={o:object_state(o)for o in pier_set if o.hide_render}
            source_time=row['unchangedOtherObjectSourceFrame']/30;c=g['cue_at'](source_time)
            role,objects,critical=tools['principal'](c,source_time)
            dg=replay.bpy.context.evaluated_depsgraph_get();projection=replay.d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@replay.d.CAM.matrix_world.inverted()
            before=tools['project'](objects,projection,dg)
            contacts=[replay.repair(f)for f in visible]
            assert all(object_state(o)==v for o,v in non_pier.items()),'Only the three piers may change'
            assert all(object_state(o)==v for o,v in hidden_piers.items()),'Hidden copies must remain untouched'
            dg=replay.bpy.context.evaluated_depsgraph_get();after=tools['project'](objects,projection,dg);cb=tools['project'](critical,projection,dg)
            physical=tools['checks'](after);critical_checks=tools['checks'](cb,True)if cb else None
            guarded=all(x['pass']for x in contacts)and physical['visible']and physical['size40to70']and physical['frameSafe']and(critical_checks is None or critical_checks['frameSafe'])
            record={'representativeFrame':row['frame'],'time':row['frame']/30,'delivered':row,'representedOutputs':replay.outputs[sig],
                'semanticPrincipal':role,'beforeActualSurface':before,'afterActualSurface':after,'originalNumericThresholdsUnchanged':True,
                'physicalChecks':physical,'criticalSurface':cb,'criticalChecks':critical_checks,'contacts':contacts,
                'occlusionSamples':{f['role']:replay.occlusion_samples(f)for f in visible},
                'allNonPierObjectsIncludingAxleBeamPistonWaterCameraUnchanged':True,'pass':bool(guarded)}
            report['candidateStates'].append(record)
            for j in replay.outputs[sig]:report['replacementOutputToPatchSource'][j]=row['frame']
            if len(report['candidateStates'])%100==0:print('D pier audit visible states',len(report['candidateStates']),flush=True)
        states=report['candidateStates'];report.update(fullSourceReplayPending=False,all12163OutputsJoinedExactly=True,
            uniqueDeliveredSourceSignaturesReplayed=len(replay.states),actualVisibleSourceSignatures=len(states),
            affectedOutputCount=len(report['replacementOutputToPatchSource']),
            visibleStatesPerCopy={f['role']:sum(any(c['copy']==f['role']for c in s['contacts'])for s in states)for f in replay.families},
            allGuardedStatesPass=all(r['pass']for r in states),failedRepresentatives=[r['representativeFrame']for r in states if not r['pass']],
            conservativeRepairScope='Every source with an unhidden pier; frustum/occlusion samples never exclude states or authorize pixel approval.',
            originalSourceSha256=replay.protected,status='Evaluated geometry only; zero actual renders; root numerical review and new probe images required')
        return report
    except BaseException as error:
        report.update(status='Audit stopped without rendering; prior files retained',error={'type':type(error).__name__,'message':str(error)})
        raise
    finally:
        report['protectionChecks']=replay.close();report['seconds']=round(time.time()-started,3)
        write(dest,report)
