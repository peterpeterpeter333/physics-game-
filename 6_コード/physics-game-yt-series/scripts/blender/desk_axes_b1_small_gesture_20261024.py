"""B-only small reference hand, preserving B2's exact semantic pointing targets.

Original files, B2 JPEGs, camera, model, voice and captions are not modified.
Probe first; full rendering requires a hash-bound actual-eye approval.
"""
import hashlib,json,math,time
from pathlib import Path
C=Path('/private/tmp/ys/ys-chain-b1v1')
B2=Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
P=Path('/private/tmp/ys/ys-chain-b1v1-small-gesture-20261024')
STAGE='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def run(ns,authorized=False,mode='probe',approval_sha=None):
    assert authorized is True and mode in ('probe','render')
    out=P/mode;assert not out.exists(),'Preserve prior actual images/evidence'
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];h=d.HANDS['kai']
    assert sha(g['__file__'])==STAGE and g['VIS_QUEUE'] is None
    cp=json.loads((B2/'camera-patch.json').read_text())
    mapping={int(j):int(k) for j,k in cp['replacementFrameToActualPatchFrame'].items()}
    refs={int(j):int(k) for j,k in cp['patchFrameToUnchangedObjectSourceFrame'].items()}
    physical={r['frame']:r for r in cp['physical']}
    immutable={str(p):sha(p) for p in [Path(g['__file__']),C/'plan.json',C/'ys-chain-b1v1.json',C/'phrase-times.json',C/'ys-chain-b1v1.wav',B2/'camera-patch.json',B2/'blender/patch/anchors.json']}
    if mode=='render':
        p=P/'probe/actual-eye-approval.json';assert p.exists() and sha(p)==approval_sha
        assert json.loads(p.read_text())['approved'] is True
    replacements={};sources={}
    for j in range(cp['frames']):
        t=j/30
        if not (201.32<=t<=206.8 or 208.18<=t<=209.8):continue
        k=mapping.get(j)
        if k is None:
            plan=g['plan'](j);k=j if plan[0]=='render' else plan[1]
            ref=k;pose=g['pose_at'](ref/30)
        else:ref=refs[k];pose=physical[k]['pose']
        replacements[j]=k;sources[k]=(ref,list(pose))
    frames=sorted(sources)
    probes=[math.ceil(t*30) for t in [201.72,202.55,203.38,205.37,208.6,209.4]]
    chosen=sorted(set(replacements[j] for j in probes)) if mode=='probe' else frames
    old_scene=bpy.context.window.scene;old_path=d.SC.render.filepath
    old_scale=h.scale.copy();old_format=d.SC.render.image_settings.file_format
    old_resolution=(d.SC.render.resolution_x,d.SC.render.resolution_y,d.SC.render.resolution_percentage)
    old_samples=d.SC.eevee.taa_render_samples;before_files={}
    for root in (C/'blender/desk',B2/'blender/patch'):
        for p in root.glob('*.jpg'):before_files[str(p)]=(p.stat().st_size,p.stat().st_mtime_ns)
    out.mkdir(parents=True);raw=out/'raw';raw.mkdir();rows=[];anchors={}
    nodes=[(201.72,51.5),(202.55,0),(203.38,90),(204.15,45),(205.37,51.5)]
    started=time.time()
    try:
        bpy.context.window.scene=d.SC
        d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100
        d.SC.render.image_settings.file_format='JPEG';d.SC.eevee.taa_render_samples=16
        for k in chosen:
            ref,pose=sources[k];t=k/30
            h.scale=(1,1,1);aa=g['apply'](ref/30);g['pose_b1'](pose)
            if 201.32<=t<=206.8:
                latitude=nodes[0][1]
                for (a,angle),(b,next_angle) in zip(nodes,nodes[1:]):
                    if t>=a:latitude=angle+(next_angle-angle)*g['u'](t,a,b-a)
                r=math.radians(latitude)
                target=g['PARTS']['terrella']['center']+.099*g['Vector']((math.cos(r),0,math.sin(r)))+g['Vector']((0,-.03,0))
                g['touch']('kai',target,t,201.72,206.3)
            # Keep the EXACT fingertip position of the large hand; shrink the
            # wrist/sleeve about that tip, not around an unrelated world origin.
            tip=h.location+h.rotation_euler.to_matrix()@d.TIP
            h.scale=(.24,)*3
            h.location=tip-h.rotation_euler.to_matrix()@(d.TIP*.24)
            bpy.context.view_layer.update()
            assert (h.location+h.rotation_euler.to_matrix()@(d.TIP*.24)-tip).length<1e-7
            pp=[d.project(v) for v in g['hero_points']('terrella')]
            box=[min(p[0] for p in pp),min(p[1] for p in pp),max(p[0] for p in pp),max(p[1] for p in pp)]
            width=(box[2]-box[0])/1080
            assert .4<=width<=.7 and 0<=box[0]<box[2]<=1080 and 0<=box[1]<box[3]<=1920
            anchors[k]={n:d.project(v) for n,v in aa.items()}
            file=raw/('%05d.jpg'%k);d.SC.render.filepath=str(file)
            bpy.ops.render.render(write_still=True,scene=d.SC.name)
            assert file.is_file() and file.stat().st_size>1000
            rows.append({'frame':k,'time':t,'unchangedObjectSourceFrame':ref,'cameraPose':pose,'handScale':.24,'unchangedTip':list(tip),'principalBox':box,'principalWidthRatio':width,'file':str(file),'sha256':sha(file)})
            print('B1 SMALL HAND',k,flush=True)
        result={'mode':mode,'helperSha256':sha(__file__),'sourceSha256':STAGE,'raw':str(raw),'frames':cp['frames'],'actual':rows,'allPatchFramesActuallyRendered':mode=='render','replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':{k:sources[k][0] for k in chosen},'anchorProjectionsByActualFrame':anchors,'unchangedCameraAndSemanticFingertips':True,'noScriptVoiceCaptionChange':True,'actualFinalMp4EyeReviewPending':True,'seconds':time.time()-started,'approvalSha256':approval_sha}
        (out/'report.json').write_text(json.dumps(result,ensure_ascii=False,indent=1))
        return result
    finally:
        h.scale=old_scale;d.set_hand('kai',(0,0,0),vis=False)
        d.SC.render.filepath=old_path;d.SC.render.image_settings.file_format=old_format
        d.SC.render.resolution_x,d.SC.render.resolution_y,d.SC.render.resolution_percentage=old_resolution
        d.SC.eevee.taa_render_samples=old_samples;bpy.context.window.scene=old_scene
        assert all(sha(p)==v for p,v in immutable.items())
        assert all((Path(p).stat().st_size,Path(p).stat().st_mtime_ns)==s for p,s in before_files.items())
