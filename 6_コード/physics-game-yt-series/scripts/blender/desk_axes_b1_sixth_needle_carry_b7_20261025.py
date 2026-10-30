"""NEW B-only sixth-needle carry; inert import, root GUI queue only.

Exactly sixteen output frames4125..4140 are replaced. Other objects use their
actual final4 held reference; the sixth needle's remaining drop and blue hand
withdrawal alone use output time. Two unchanged contextual probes4124/4141
are rendered into this fresh output, never into an earlier cache. No camera,
script, voice, subtitle, field geometry or shared function is changed.

Probe renders all16 potential delivery sources plus2 contextual images. A
separate root eye receipt is still required before root copies/assembles these
sources. This module never encodes or starts Blender by itself.
"""
import ast
import hashlib
import json
import math
import os
from pathlib import Path
import time
import types

import numpy as np

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025')
OUT=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-20261025')
STAGE=W/'scripts/blender/desk_b1v1.py'
STAGE_SHA='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
PINS={
 C/'prepared.json':'5154535d572e6ab4b100fc7fcd730723b965c9569e7e47370a9251f64e878b3a',
 C/'composite-provenance.json':'685711993fb83cc22f55e22ae3d81a359ce9c58aea4a8efd38c82caf9629460d',
 C/'blender/delivered-camera-poses.json':'aa4106563b81e8afc8d33c4eb1d19d58ace2e0b706330409bb48ed1a070d883f',
 C/'blender/desk/anchors.json':'352637a5e790ac026d7d4a0f1d54c8c84833d45ee1832566b4ebc453715f5355',
 C/'final-held-dimensions.json':'a9e88016d9b07e94321db9a256a43e2d0d1140ff9654f87819b3278af70f25a5',
 STAGE:STAGE_SHA,
 W/'scripts/blender/desk_lib_b1.py':'6fb09a2b07c4e6c1f6ae1b66c5f690f5a5aef1ccc9a1ef68d18bcd55eef729ac',
 W/'scripts/blender/desk_axes_b1_score_entries_d1_v2_20261024.py':'ec6d7cebb1b285518df2eadda60740ab2d39a9e031c50c98e9a82a0bb9b79a8f',
}
PATCH_FRAMES=tuple(range(4125,4141))
CONTEXT_FRAMES=(4124,4141)
TOLERANCE=1e-9

def sha(p):
    h=hashlib.sha256()
    with Path(p).open('rb')as f:
        for b in iter(lambda:f.read(1<<20),b''):h.update(b)
    return h.hexdigest()

def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    p=Path(p);assert not os.path.lexists(p),'Never overwrite an earlier result'
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def verify(pins):
    for p,h in pins.items():assert sha(p)==h,('Protected file changed',str(p))
def flat(m):return tuple(float(x)for row in m for x in row)
def maxdelta(a,b):
    assert len(a)==len(b)
    return max((abs(float(x)-float(y))for x,y in zip(a,b)),default=0.)
def inventory(p):
    return {f.name:(f.stat().st_size,f.stat().st_mtime_ns,f.stat().st_ino,f.stat().st_dev,str(f.resolve()))
            for f in sorted(Path(p).glob('*.jpg'))}

def transform(ob):
    return {'location':tuple(ob.location),'rotation_mode':ob.rotation_mode,
        'rotation_euler':tuple(ob.rotation_euler),'rotation_quaternion':tuple(ob.rotation_quaternion),
        'rotation_axis_angle':tuple(ob.rotation_axis_angle),'scale':tuple(ob.scale),
        'delta_location':tuple(ob.delta_location),'delta_rotation_euler':tuple(ob.delta_rotation_euler),
        'delta_rotation_quaternion':tuple(ob.delta_rotation_quaternion),'delta_scale':tuple(ob.delta_scale),
        'matrix_parent_inverse':flat(ob.matrix_parent_inverse),'matrix_basis':flat(ob.matrix_basis),
        'matrix_world':flat(ob.matrix_world),'parent':ob.parent.as_pointer()if ob.parent else None,
        'parent_type':ob.parent_type,'parent_bone':ob.parent_bone,'parent_vertices':tuple(ob.parent_vertices),
        'hide_render':ob.hide_render,'hide_viewport':ob.hide_viewport}

def sockets(tree):
    if tree is None:return []
    result=[]
    for node in tree.nodes:
        for i,socket in enumerate(node.inputs):
            if not hasattr(socket,'default_value'):continue
            value=socket.default_value
            if isinstance(value,(str,bool,int,float)):saved=value
            elif value is None:continue
            else:
                try:saved=tuple(float(x)for x in value)
                except TypeError:continue
            result.append((socket,saved,node.name,i))
    return result

class SceneTransaction:
    """Save actual channels; never force a world/basis matrix to mask a bug."""
    def __init__(self,g,original_window_scene,original_view_layer):
        self.g=g;self.bpy=g['bpy'];self.d=g['d'];self.scene=self.d.SC
        assert self.bpy.context.window.scene is self.scene
        self.window_scene=original_window_scene;self.window_view_layer=original_view_layer
        self.owned_objects=list(self.scene.objects)
        self.objects=list(self.bpy.data.objects);self.transforms={o:transform(o)for o in self.objects}
        self.identities={name:tuple(x.as_pointer()for x in getattr(self.bpy.data,name))
            for name in ('objects','meshes','curves','materials','cameras','lights','shape_keys','scenes')}
        self.paths={s:s.render.filepath for s in self.bpy.data.scenes}
        self.existing_files={p:sha(p)for p in self.paths.values()if p and Path(p).is_file()}
        self.material_slots={}
        for ob in self.objects:
            if ob.data is not None and hasattr(ob.data,'materials')and ob.data not in self.material_slots:
                self.material_slots[ob.data]=tuple(ob.data.materials)
        self.text={ob.data:ob.data.body for ob in self.objects if ob.type=='FONT'}
        self.shapes={key:key.value for shape in self.bpy.data.shape_keys for key in shape.key_blocks}
        self.node_values=[]
        for mat in self.bpy.data.materials:self.node_values+=sockets(mat.node_tree)
        for world in self.bpy.data.worlds:self.node_values+=sockets(world.node_tree)
        self.lights={ld:ld.energy for ld in self.bpy.data.lights}
        self.cam=self.d.CAM_D
        self.camera={'lens':self.cam.lens,'ortho_scale':self.cam.ortho_scale,
            'focus_distance':self.cam.dof.focus_distance,'aperture_fstop':self.cam.dof.aperture_fstop,
            'type':self.cam.type,'sensor_width':self.cam.sensor_width,'sensor_height':self.cam.sensor_height}
        r=self.scene.render
        self.render={k:getattr(r,k)for k in ('filepath','resolution_x','resolution_y','resolution_percentage')}
        self.extra=(r.image_settings.file_format,r.image_settings.quality,self.scene.eevee.taa_render_samples)
        self.scene_camera=self.scene.camera;self.frame=self.scene.frame_current;self.subframe=self.scene.frame_subframe
        self.bindings={k:g[k]for k in ('main','apply','apply_state','plan','pose_at','set_camera','SPANS','EVENTS','BASE','GROUPS','CHILDREN','ALL','DATA','CUES')}
        self.bound_helpers={name:getattr(self.d,name)for name in ('show','show_tree','set_hand','pose_cam','project')}
        self.data_json=json.dumps(g['DATA'],sort_keys=True)
        self.d_mats=dict(self.d.MATS)
        self.visibility_stats=dict(g['VISIBILITY_STATS'])
        self.mesh_sha=self.mesh_digest()
        self.closed=False

    def mesh_digest(self):
        result={}
        for me in self.bpy.data.meshes:
            vv=np.empty(len(me.vertices)*3,dtype=np.float64);me.vertices.foreach_get('co',vv)
            result[me.as_pointer()]=hashlib.sha256(vv.tobytes()).hexdigest()
        return result

    def close(self):
        assert not self.closed;self.closed=True;self.bpy.context.window.scene=self.scene
        errors=[]
        # Parent relationships and data identities must never change.
        # Foreign-scene objects are observation-only: do not reassign even an
        # unchanged Euler/quaternion representation in another episode.
        for ob in self.owned_objects:
            s=self.transforms[ob]
            assert (ob.parent.as_pointer()if ob.parent else None)==s['parent']
            assert ob.parent_type==s['parent_type']and ob.parent_bone==s['parent_bone']and tuple(ob.parent_vertices)==s['parent_vertices']
            ob.rotation_mode=s['rotation_mode']
            for k in ('location','rotation_quaternion','rotation_axis_angle','rotation_euler','scale',
                      'delta_location','delta_rotation_quaternion','delta_rotation_euler','delta_scale'):
                setattr(ob,k,s[k])
            from mathutils import Matrix
            ob.matrix_parent_inverse=Matrix([s['matrix_parent_inverse'][i:i+4]for i in range(0,16,4)])
            ob.hide_render=s['hide_render'];ob.hide_viewport=s['hide_viewport']
        for data,materials in self.material_slots.items():
            if tuple(data.materials)!=materials:
                data.materials.clear()
                for mat in materials:data.materials.append(mat)
        for data,body in self.text.items():
            if data.body!=body:data.body=body
        for key,value in self.shapes.items():
            if key.value!=value:key.value=value
        for socket,value,_,__ in self.node_values:
            current=tuple(socket.default_value)if isinstance(value,tuple)else socket.default_value
            if current!=value:socket.default_value=value
        for light,energy in self.lights.items():
            if light.energy!=energy:light.energy=energy
        for k,v in self.camera.items():
            if k in ('focus_distance','aperture_fstop'):setattr(self.cam.dof,k,v)
            else:setattr(self.cam,k,v)
        for k,v in self.render.items():setattr(self.scene.render,k,v)
        self.scene.render.image_settings.file_format,self.scene.render.image_settings.quality,self.scene.eevee.taa_render_samples=self.extra
        self.scene.camera=self.scene_camera
        assert self.scene.frame_current==self.frame and self.scene.frame_subframe==self.subframe,'No animation frame changes allowed'
        for scene,p in self.paths.items():assert scene.render.filepath==p
        self.bpy.context.view_layer.update()
        self.bpy.context.window.scene=self.window_scene
        self.bpy.context.window.view_layer=self.window_view_layer
        self.bpy.context.view_layer.update()
        for ob,s in self.transforms.items():
            actual=transform(ob)
            for k,before in s.items():
                after=actual[k]
                ok=maxdelta(before,after)<=TOLERANCE if isinstance(before,tuple)else before==after
                if not ok:errors.append({'object':ob.name,'channel':k,'before':before,'after':after})
        checks={
            'allFullTransformsVisibilityParentsRestored':not errors,
            'foreignSceneObjectChannelsNeverReassigned':True,
            'foreignSceneObjectFullStatesUnchanged':not any(e['object']in {o.name for o in self.objects if o not in self.owned_objects}for e in errors),
            'allBlenderDatablockIdentitiesUnchanged':all(tuple(x.as_pointer()for x in getattr(self.bpy.data,name))==ids for name,ids in self.identities.items()),
            'allMaterialAssignmentsRestored':all(tuple(data.materials)==materials for data,materials in self.material_slots.items()),
            'allTextRestored':all(data.body==body for data,body in self.text.items()),
            'allShapeKeysRestored':all(key.value==value for key,value in self.shapes.items()),
            'allNodeValuesRestored':all((tuple(socket.default_value)if isinstance(value,tuple)else socket.default_value)==value for socket,value,_,__ in self.node_values),
            'allMeshVertexBytesUnchanged':self.mesh_digest()==self.mesh_sha,
            'runtimeBindingsUnchanged':all(self.g[k]is v for k,v in self.bindings.items())and all(getattr(self.d,k)is v for k,v in self.bound_helpers.items()),
            'runtimeDataUnchanged':json.dumps(self.g['DATA'],sort_keys=True)==self.data_json,
            'materialCacheUnchanged':self.d.MATS==self.d_mats,
            'visibilityQueueClosed':self.g['VIS_QUEUE']is None,
            'visibilityStatsUnchanged':self.g['VISIBILITY_STATS']==self.visibility_stats,
            'allSceneExistingFileBytesUnchanged':all(sha(p)==h for p,h in self.existing_files.items()),
        }
        checks['contextWindowSceneRestored']=self.bpy.context.window.scene is self.window_scene
        checks['contextViewLayerRestored']=self.bpy.context.window.view_layer is self.window_view_layer
        return checks,errors

def run(ns,authorized=False,mode='probe',*,expected_helper_sha256):
    assert authorized is True and mode in ('audit','probe'),'Only root may queue this episode-private operation'
    assert isinstance(expected_helper_sha256,str)and len(expected_helper_sha256)==64 and sha(__file__)==expected_helper_sha256
    target=OUT/mode;assert not os.path.lexists(target)and not OUT.is_symlink(),'Fresh owned destination required'
    verify(PINS);prepared=read(C/'prepared.json');provenance=read(C/'composite-provenance.json')
    poses=read(C/'blender/delivered-camera-poses.json')['poses'];assert len(poses)==len(provenance['records'])==10700
    protected={str(p):h for p,h in PINS.items()}
    protected.update(prepared['protectedInputSha256'])
    protected.update({str(C/p):h for p,h in prepared['outputHashes'].items()})
    protected[str(Path(__file__).resolve())]=expected_helper_sha256
    verify(protected)
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert Path(g['__file__'])==STAGE and g['VIS_QUEUE']is None and sha(g['__file__'])==STAGE_SHA
    assert scene.render.engine=='BLENDER_EEVEE'and scene.camera is d.CAM
    assert g['apply'].__globals__ is g and g['pose_b1'].__globals__ is g
    assert d.pose_cam.__globals__['SC']is scene and d.pose_cam.__globals__['CAM']is d.CAM and d.pose_cam.__globals__['CAM_D']is d.CAM_D
    tree=ast.parse(STAGE.read_text());defs=[n for n in tree.body if isinstance(n,ast.FunctionDef)];fresh={}
    exec(compile(ast.Module(body=defs,type_ignores=[]),str(STAGE),'exec'),fresh)
    assert all(g[n.name].__code__==fresh[n.name].__code__ for n in defs),'Original function AST must be exact; no inherited visual-wrapper rebinding'
    retained=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')['plans']
    assert len(retained)==10700 and all(list(g['plan'](j))==p for j,p in enumerate(retained))
    cue=next(c for c in g['CUES']if c['key']=='terella:top')
    assert 137.4666666666<cue['start']<137.5
    # Exact actual final4 other-object references, never recomputed from current plan.
    refs={};source_rows={};all_frames=sorted((*PATCH_FRAMES,*CONTEXT_FRAMES))
    source_hashes={};raw_inventory=inventory(C/'blender/desk');assert len(raw_inventory)==10700
    for j in all_frames:
        r=provenance['records'][j];assert r['frame']==j and r['previousB3Record']['kind']=='actual-B3-score-placement-and-entry-camera'
        ref=r['originalObjectSourceFrame'];assert isinstance(ref,int)and ref==r['previousB3Record']['originalObjectSourceFrame']
        assert g['cue_at'](j/30)['key']==g['cue_at'](ref/30)['key']
        source=Path(r['source']).resolve();assert (C/'blender/desk'/('%05d.jpg'%j)).resolve()==source
        source_hashes[str(source)]=r['sha256'];assert sha(source)==r['sha256']
        refs[j]=ref;source_rows[j]=r
    assert g['CHECK_VISIBILITY'] is False,'Do not alter live diagnostic counters'
    old_window_scene=bpy.context.window.scene;old_view_layer=bpy.context.window.view_layer
    bpy.context.view_layer.update();bpy.context.window.scene=scene;bpy.context.view_layer.update()
    try:tx=SceneTransaction(g,old_window_scene,old_view_layer)
    except BaseException:
        bpy.context.window.scene=old_window_scene;bpy.context.window.view_layer=old_view_layer;bpy.context.view_layer.update();raise
    started=time.time();raw=target/'raw';rows=[];actual=[];projected={};projection_error=0.;local_cache={}
    report={'id':'ys-chain-b1v1','kind':'B7 sixth-needle drop and hand withdrawal carried across row18→19 only',
        'helperSha256':expected_helper_sha256,'mode':mode,'baseCache':str(C),'basePreparedSha256':PINS[C/'prepared.json'],
        'baseProvenanceSha256':PINS[C/'composite-provenance.json'],'baseCameraPosesSha256':PINS[C/'blender/delivered-camera-poses.json'],
        'replacementFrameToActualPatchFrame':{j:j for j in PATCH_FRAMES},
        'patchFrameToUnchangedOtherObjectSourceFrame':{j:refs[j]for j in PATCH_FRAMES},
        'patchFrameToUnchangedObjectSourceFrame':{j:refs[j]for j in PATCH_FRAMES},
        'legacySourceMapMeaning':'Only other-object held references; sixth needle drop and kai-hand operation explicitly use output time.',
        'replacementOutputs':16,'actualSources':16,'contextOnlyFrames':list(CONTEXT_FRAMES),'fullFilmFrames':10700,'fps':30,
        'newActionsEvaluateOutputTime':True,'changedChannelsOnly':['sixthNeedle.location.z','kaiHand transform and visibility during approved withdrawal'],
        'cueTimesAndStartsUnchanged':True,'vaneTouched':False,'allOriginalGateNGPreserved':True,'automaticGateExemption':False,
        'actualImages':actual,'physical':rows,'actualFinalImageReviewPending':True,'audioActuallyHeard':False,'finalAcceptance':False}
    try:
        bpy.context.window.scene=scene
        for k,v in {'resolution_x':1080,'resolution_y':1920,'resolution_percentage':100}.items():setattr(scene.render,k,v)
        scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95;scene.eevee.taa_render_samples=16
        a6=g['PARTS']['terrella']['needles'][5][0];hand=d.HANDS['kai'];assert tuple(hand.scale)==(1.,1.,1.)
        def tree_objects(o):return [o]+[v for child in g['CHILDREN'].get(o,())for v in tree_objects(child)]
        # Hand CHILDREN may belong to the shared library; use actual parent links.
        def descendants(o):return [o]+[v for child in o.children for v in descendants(child)]
        needle_family=set(descendants(a6));hand_family=set(descendants(hand))
        def world_points(objects):
            deps=bpy.context.evaluated_depsgraph_get();clouds=[]
            for ob in dict.fromkeys(objects):
                if ob.hide_render or ob.type not in ('MESH','FONT','CURVE'):continue
                cacheable=ob.type=='MESH'and not ob.data.shape_keys
                if cacheable and ob in local_cache:vv=local_cache[ob]
                else:
                    ev=ob.evaluated_get(deps);mesh=ev.to_mesh()
                    if mesh is None:continue
                    try:
                        vv=np.empty(len(mesh.vertices)*3,dtype=np.float64);mesh.vertices.foreach_get('co',vv)
                        vv=np.column_stack((vv.reshape(-1,3),np.ones(len(mesh.vertices))))
                    finally:ev.to_mesh_clear()
                    if cacheable:local_cache[ob]=vv
                if len(vv):clouds.append(vv@np.asarray(ob.matrix_world,dtype=np.float64).T)
            assert clouds,'Named required geometry missing';return np.concatenate(clouds)
        def project(vv):
            nonlocal projection_error
            dep=bpy.context.evaluated_depsgraph_get();m=d.CAM.calc_matrix_camera(dep,x=1080,y=1920,scale_x=1.,scale_y=1.)@d.CAM.matrix_world.inverted()
            pp=vv@np.asarray(m,dtype=np.float64).T;assert np.isfinite(pp).all()and(pp[:,3]>0).all()
            xy=np.column_stack(((pp[:,0]/pp[:,3]+1)*540,(1-pp[:,1]/pp[:,3])*960))
            for i in {0,len(vv)//2,len(vv)-1}:
                old=d.project(g['Vector'](vv[i,:3]));err=max(abs(old[0]-xy[i,0]),abs(old[1]-xy[i,1]));projection_error=max(projection_error,float(err));assert err<=.11
            return [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        def state(j):
            ref=refs[j];aa=g['apply'](ref/30);g['pose_b1'](poses[j]);bpy.context.view_layer.update()
            before={ob:transform(ob)for ob in scene.objects}
            old_rock_sha=hashlib.sha256(world_points([g['PARTS']['terrella']['rock']]).tobytes()).hexdigest()
            drop_offset=0.
            if j in PATCH_FRAMES:
                t=j/30;assert g['cue_at'](t)['key']=='terella:top'and t<=138.
                drop_offset=.025*(1-g['u'](t,137.35,.25));a6.location.z+=drop_offset
                tip=a6.location.copy()
                if t>=137.60:tip+=g['Vector']((.06,0,.08))*g['u'](t,137.60,.4)
                d.set_hand('kai',tip,yaw=150,pitch=-25,vis=True)
                bpy.context.view_layer.update()
                fingertip=hand.location+hand.rotation_euler.to_matrix()@d.TIP
                assert (fingertip-tip).length<1e-7
            else:tip=None
            # No other object channel may move. Derived matrices of the two
            # explicitly moved families change naturally; never assign them.
            offenders=[]
            for ob,old in before.items():
                now=transform(ob)
                for key,value in old.items():
                    if ob in hand_family and key in ('matrix_world','matrix_basis','location','rotation_euler','rotation_quaternion','rotation_axis_angle','rotation_mode','hide_render','hide_viewport'):continue
                    if ob in needle_family and key=='matrix_world':continue
                    if ob is a6 and key in ('location','matrix_basis'):continue
                    after=now[key];ok=maxdelta(value,after)<=TOLERANCE if isinstance(value,tuple)else value==after
                    if not ok:offenders.append((ob.name,key,value,after))
            assert not offenders,('Non-authorized object state changed',j,offenders)
            assert poses[j]==poses[4124],'Carry interval must not change delivered camera'
            if j in PATCH_FRAMES:
                assert abs(a6.location.x-before[a6]['location'][0])<=TOLERANCE and abs(a6.location.y-before[a6]['location'][1])<=TOLERANCE
            new_rock_sha=hashlib.sha256(world_points([g['PARTS']['terrella']['rock']]).tobytes()).hexdigest()
            assert new_rock_sha==old_rock_sha,'Principal rock world vertices must be unchanged'
            change={'baselineSixthNeedleLocation':list(before[a6]['location']),
                'actualSixthNeedleLocation':list(a6.location),'explicitDropOffsetMeters':drop_offset,
                'principalRockBaselineWorldVerticesSha256':old_rock_sha,'principalRockActualWorldVerticesSha256':new_rock_sha,
                'principalRockWorldGeometryUnchanged':True,
                'baselineKaiHand':before[hand],'actualKaiHand':transform(hand)}
            return aa,tip,change
        target.mkdir(parents=True);raw.mkdir()
        for j in all_frames:
            aa,tip,change=state(j)
            primary=project(world_points([g['PARTS']['terrella']['rock']]))
            secondary=project(world_points(g['GROUPS']['terrella']))
            handbox=project(world_points(descendants(hand)))if not hand.hide_render else None
            width=(primary[2]-primary[0])/1080
            assert .4<=width<=.7 and primary[0]>=40 and primary[2]<=1040 and primary[1]>=110 and primary[3]<=1600,('Exact B3 principal guard',j,width,primary)
            for role,box in [('terrella and all visible needles',secondary)]:
                if box is not None:assert box[0]>=0 and box[2]<=1080 and box[1]>=110 and box[3]<=1600,('Secondary geometry outside unchanged full caption-safe frame',j,role,box)
            sixth_box=project(world_points(descendants(a6)))
            assert sixth_box[0]>=0 and sixth_box[2]<=1080 and sixth_box[1]>=110 and sixth_box[3]<=1600,('Sixth needle must remain caption-safe',j,sixth_box)
            # The wrist/forearm intentionally enters from outside the picture.
            # Its whole bbox is diagnostic, not a new all-hand-inside rule.
            # Require the explanatory fingertip at contact, then leave natural
            # withdrawal/cropping to the mandatory18-image actual-eye review.
            fingertip=hand.location+hand.rotation_euler.to_matrix()@d.TIP
            fingertip_projected=d.project(fingertip)if not hand.hide_render else None
            if not hand.hide_render and j/30<=137.60:
                assert fingertip_projected[2]and 0<=fingertip_projected[0]<=1080 and 110<=fingertip_projected[1]<=1600,('Contact fingertip must remain caption-safe',j,fingertip_projected)
            anchors={n:d.project(v)for n,v in aa.items()};projected[j]=anchors
            row={'frame':j,'time':j/30,'cue':g['cue_at'](j/30)['key'],'contextOnly':j in CONTEXT_FRAMES,
                'unchangedOtherObjectSourceFrame':refs[j],'operationTime':j/30 if j in PATCH_FRAMES else None,
                'pose':poses[j],'box':primary,'widthRatio':width,'secondaryBox':secondary,'handBox':handbox,
                'sixthNeedleBox':sixth_box,'actualFingerTipProjection':fingertip_projected,
                'wholeWristForearmBoxIsDiagnosticOnly':True,'withdrawalActualEyeApprovalPending':True,
                'sixthNeedleLocation':list(a6.location),'targetFingerTip':list(tip)if tip is not None else None,
                'sixthDropEnd':137.60,'handWithdrawEnd':138.,'allVerticesEvaluated':True,'explicitChanges':change,
                'allNonAuthorizedObjectChannelsUnchanged':True,'pass':True}
            rows.append(row)
            if mode=='probe':
                out=raw/('%05d.jpg'%j);scene.render.filepath=str(out)
                bpy.ops.render.render(write_still=True,scene=scene.name)
                assert out.is_file()and not out.is_symlink()and out.stat().st_size>1000
                actual.append({'frame':j,'time':j/30,'path':str(out),'sha256':sha(out),'contextOnly':j in CONTEXT_FRAMES,'actuallyViewed':False})
                print('B1 B7 sixth-needle actual',j,flush=True)
        report.update(allGuardedStatesPass=True,projectionMaxDifferencePixels=projection_error,
            allPatchFramesActuallyRendered=mode=='probe',actualPatchRenders=sum(not r['contextOnly']for r in actual),
            actualContextRenders=sum(r['contextOnly']for r in actual),actualGuardedStates=len(rows),
            cameraPosesUnchanged=True,raw=str(raw),anchorProjectionsByActualFrame=projected,
            status='All16 actual patch sources plus2 unchanged contexts, PENDING root eyes/copies/assembly'if mode=='probe'else'Numerical18-state audit only; zero rendered images')
        assert len(rows)==18 and (mode=='audit'or(len(actual)==18 and report['actualPatchRenders']==16))
        return report
    except BaseException as e:
        report.update(status='FAIL; no approval',error={'type':type(e).__name__,'message':str(e)});raise
    finally:
        cleanup_error=None
        try:checks,offenders=tx.close()
        except BaseException as error:
            cleanup_error={'type':type(error).__name__,'message':str(error)};checks={'fullContextRestoration':False};offenders=[]
        finally:
            # Preserve window context even if a strict restoration invariant
            # fails. A failed model/context check is still reported as FAIL.
            bpy.context.window.scene=old_window_scene
            bpy.context.window.view_layer=old_view_layer
            bpy.context.view_layer.update()
        checks['contextRestoredEvenOnStrictFailure']=bpy.context.window.scene is old_window_scene and bpy.context.window.view_layer is old_view_layer
        checks.update(protectedInputSHAUnchanged=all(sha(p)==h for p,h in protected.items()),
            all10700BaseRawStatAndResolvedPathsUnchanged=inventory(C/'blender/desk')==raw_inventory,
            all18ActualSourceBytesUnchanged=all(sha(p)==h for p,h in source_hashes.items()))
        report.update(protectionChecks=checks,restorationOffenders=offenders,cleanupError=cleanup_error,
            protectedInputSha256=protected,seconds=round(time.time()-started,3),noWorldOrBasisMatrixForced=True)
        write(target/'report.json',report)
        assert not cleanup_error and all(checks.values()),('B7 strict protection/restoration failed',checks,cleanup_error,offenders)
