"""Root-only B3 trial: grounded score board and three remaining safe entries.

Import is inert. No frozen/source functions are rebound. The B2 mapping and
all B2/original JPEGs are preserved. The rough stone is fitted/measured from
evaluated shape-key geometry, never its undeformed base mesh.
"""
import copy,hashlib,json,math,time,types
from pathlib import Path
import numpy as np

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-b1v1')
B2=Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
OUT=Path('/private/tmp/ys/ys-chain-b1v1-score-entries-d1-20261024')
STAGE_SHA='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
B2_SHA='867a061169759c92840a0efdc4e33571f0843b4f51673bd3879afc6ae8bdabde'
PROBE_TIMES=[13.,25.,99.5,122.,127.]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write_new(p,v):
    with Path(p).open('x') as f:json.dump(v,f,ensure_ascii=False,indent=1)
def inventory(p):return {str(f):[f.stat().st_size,str(f.stat().st_mtime_ns)] for f in sorted(Path(p).glob('*.jpg')) if f.is_file()}

def run(ns,authorized=False,mode='probe',visually_approved=False,probe_report_sha256=None):
    assert authorized is True and mode in ('probe','render'),'Root authorization required'
    assert not OUT.is_symlink();dest=OUT/mode
    assert not dest.exists() and not dest.is_symlink(),'Keep earlier trial/delivery'
    if mode=='render':
        prev=OUT/'probe/report.json';assert visually_approved is True and sha(prev)==probe_report_sha256
        pr=json.loads(prev.read_text());assert pr['helperSha256']==sha(__file__) and pr['allGuardedStatesPass']
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert sha(g['__file__'])==STAGE_SHA and sha(B2/'camera-patch.json')==B2_SHA
    assert scene.render.engine=='BLENDER_EEVEE' and g['VIS_QUEUE'] is None
    cp=json.loads((B2/'camera-patch.json').read_text());assert cp['allPatchFramesActuallyRendered']
    b2_outputs={int(j):int(k) for j,k in cp['replacementFrameToActualPatchFrame'].items()}
    nf=math.ceil(g['DATA']['duration']*30);original_apply=g['apply'];original_pose=g['pose_at']
    cues={c['key']:c for c in g['CUES']};score=cues['open:who'];island=cues['lore:island'];needle=cues['rule:needle'];rock=cues['terella:idea']
    stone_keys={c['key'] for c in g['CUES'] if c['camera']=='terrella'}
    assert stone_keys=={'terella:idea','terella:make','terella:place','terella:top','terella:mio'}
    old_scene=bpy.context.window.scene;old_board=d.board_h.location.copy()
    settings={k:getattr(scene.render,k) for k in ('filepath','resolution_x','resolution_y','resolution_percentage')};old_format=scene.render.image_settings.file_format;old_samples=scene.eevee.taa_render_samples
    paths={s.name:s.render.filepath for s in bpy.data.scenes};bindings={k:g[k] for k in ('main','apply','apply_state','plan','pose_at','SPANS','EVENTS','BASE','GROUPS','CHILDREN')}
    protected_paths=[Path(g['__file__']),W/'scripts/blender/desk_lib_b1.py',B2/'camera-patch.json',B2/'blender/patch/anchors.json',C/'blender/desk/anchors.json',C/'ys-chain-b1v1.wav',C/'phrase-times.json',C/'blender/data.json']
    protected={str(p):sha(p) for p in protected_paths};raw_before={str(p):inventory(p) for p in (C/'blender/desk',B2/'blender/patch')}
    fields_before=json.dumps(g['DATA'],sort_keys=True);board_shift=g['Vector']((.20,0.,0.));projection_error=0.;started=time.time()
    report={'id':'ys-chain-b1v1','kind':'New explicit score-placement and camera-only remaining-entry derivative; B2 preserved','mode':mode,'helperSha256':sha(__file__),'sourceSha256':STAGE_SHA,'b2ReportSha256':B2_SHA,'originalInspectorModified':False,'finalAcceptance':False,'actualImages':[]}
    try:
        bpy.context.window.scene=scene
        def tree(o):return [o]+[v for child in g['CHILDREN'].get(o,()) for v in tree(child)]
        def objects(kind):
            if kind=='score':return tree(d.board_h)+g['GROUPS']['compass']
            if kind=='map':return g['GROUPS']['map']
            if kind=='compass':return g['GROUPS']['compass']
            return [g['PARTS']['terrella']['rock']]
        local_cache={}
        def world_points(obs):
            deps=bpy.context.evaluated_depsgraph_get();points=[]
            for ob in dict.fromkeys(obs):
                if ob.hide_render or ob.type not in ('MESH','FONT','CURVE'):continue
                cacheable=ob.type=='MESH' and not ob.data.shape_keys
                if cacheable and ob in local_cache:vv=local_cache[ob]
                else:
                    eo=ob.evaluated_get(deps);me=eo.to_mesh()
                    if me is None:continue
                    try:
                        values=np.empty(len(me.vertices)*3,dtype=np.float64);me.vertices.foreach_get('co',values)
                        vv=np.column_stack((values.reshape(-1,3),np.ones(len(me.vertices))))
                    finally:eo.to_mesh_clear()
                    if cacheable:local_cache[ob]=vv
                if len(vv):points.append(vv@np.asarray(ob.matrix_world,dtype=np.float64).T)
            assert points,'No actual evaluated principal geometry'
            return np.concatenate(points)
        def project(vv):
            nonlocal projection_error
            deps=bpy.context.evaluated_depsgraph_get();m=d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            clip=vv@np.asarray(m,dtype=np.float64).T;assert (clip[:,3]>0).all()
            xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960))
            for i in {0,len(vv)//2,len(vv)-1}:
                p=d.project(g['Vector'](vv[i,:3]));err=max(abs(p[0]-xy[i,0]),abs(p[1]-xy[i,1]));projection_error=max(projection_error,float(err));assert err<=.11
            return [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        def place(t):
            aa=original_apply(t)
            if g['cue_at'](t)['key']=='open:who':d.board_h.location+=board_shift
            bpy.context.view_layer.update();return aa
        def fit(kind,c,samples):
            vv=[]
            for t in samples:place(t);vv.append(world_points(objects(kind)))
            vv=np.concatenate(vv);p=list(c['pose']);p[:3]=((vv[:,:3].min(axis=0)+vv[:,:3].max(axis=0))/2).tolist()
            for _ in range(28):
                g['pose_b1'](p);bpy.context.view_layer.update();bb=project(vv);p[3]*=((bb[2]-bb[0])/1080)/.66
                if bb[3]>1090:p[2]-=.01
                elif bb[1]<115:p[2]+=.01
                elif abs((bb[2]-bb[0])/1080-.66)<.0001:break
            return p
        score_pose=fit('score',score,[11.24,12.72,12.82,12.92,13.02,13.12,13.22,13.32,18.7])
        # Both extreme shape keys plus a live intermediate; each actual state
        # below is separately measured, so this is not a base-mesh substitute.
        stone_pose=fit('stone',rock,[121.56,126.4,126.8,127.2])
        poses={'score':score_pose,'stone':stone_pose,'map':list(island['pose']),'compass':list(needle['pose'])}
        def selected(t):
            c=g['cue_at'](t)
            return c['key']=='open:who' or c['key'] in stone_keys or c['key'] in ('lore:island','rule:needle') and t<c['start']+c['move']
        def corrected_pose(t):
            c=g['cue_at'](t);key=c['key']
            if key=='open:who':p=list(score_pose)
            elif key in stone_keys:p=list(stone_pose)
            elif key=='lore:island':p=list(poses['map'])
            elif key=='rule:needle':p=list(poses['compass'])
            else:return original_pose(t)
            if c['move'] and t<c['start']+c['move']:p[3]*=1.05-.05*g['u'](t,c['start'],c['move'])
            return p
        replacements={};refs={};unique={}
        for j in range(nf):
            t=j/30
            if not selected(t):continue
            assert j not in b2_outputs,'Do not replace an already corrected B2 output'
            plan=g['plan'](j);ref=j if plan[0]=='render' else plan[1]
            state=(ref,tuple(round(v,12) for v in corrected_pose(t)));k=unique.setdefault(state,j);replacements[j]=k;refs[k]=ref
        def state(j):
            ref=refs.get(j)
            if ref is None:
                planned=g['plan'](j);ref=j if planned[0]=='render' else planned[1]
            aa=place(ref/30);g['pose_b1'](corrected_pose(j/30));bpy.context.view_layer.update();return aa
        physical=[]
        for j in sorted(refs):
            state(j);c=g['cue_at'](j/30);kind='score' if c['key']=='open:who' else 'stone' if c['key'] in stone_keys else c['camera']
            bb=project(world_points(objects(kind)));width=(bb[2]-bb[0])/1080
            assert .4<=width<=.7 and bb[0]>=40 and bb[2]<=1040 and bb[1]>=110 and bb[3]<=1600,('Actual evaluated principal fails',j,j/30,kind,width,bb)
            digit_check=None
            if kind=='score' and refs[j]/30>=13.32:
                digit=project(world_points([d.dg['make']]))
                lid=project(world_points(tree(g['PARTS']['compass']['hinge'])))
                disjoint=digit[0]>lid[2]+8 or digit[2]<lid[0]-8 or digit[1]>lid[3]+8 or digit[3]<lid[1]-8
                assert disjoint,('Physical left zero still overlaps lid',j,digit,lid)
                digit_check={'leftZeroBox':digit,'lidBox':lid,'disjoint':True}
            physical.append({'frame':j,'time':j/30,'unchangedObjectSourceFrame':refs[j],'cue':c['key'],'pose':corrected_pose(j/30),'widthRatio':width,'box':bb,'evaluatedGeometry':True,'scoreDigitClearance':digit_check})
        report.update({'allGuardedStatesPass':True,'physical':physical,'projectionMaxDifferencePixels':projection_error,'newPoses':poses,'boardTranslationMeters':list(board_shift),'boardWorldZUnchanged':True,'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':refs,'replacementOutputs':len(replacements),'actualSources':len(refs),'allB2PreviouslyCorrectedOutputsUntouched':True})
        dest.mkdir(parents=True);(dest/'blender').mkdir();out=dest/'blender/patch'
        frames=sorted(refs) if mode=='render' else [round(t*30) for t in PROBE_TIMES]
        assert all(selected(j/30) for j in frames)
        a=copy.copy(g['A']);a.cache=str(dest);a.out=str(out);a.times=','.join(str(j/30) for j in frames);a.force=False;a.samples=16;a.scale=1;a.every=1;a.start=0;a.stop=1e9
        scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.eevee.taa_render_samples=16
        scope={**g,'__file__':str(Path(__file__).resolve()),'A':a,'apply':lambda t:state(round(t*30)),'pose_at':corrected_pose}
        types.FunctionType(g['main'].__code__,scope)()
        for j in frames:
            p=out/('%05d.jpg'%j);assert p.is_file() and not p.is_symlink() and p.stat().st_size>1000
            report['actualImages'].append({'frame':j,'time':j/30,'path':str(p),'sha256':sha(p),'actuallyViewed':False})
        report['status']='Actual trial/delivery rendered; actual composite and final MP4 review still required'
        return report
    except BaseException as e:
        report['status']='FAIL, no final acceptance';report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        d.board_h.location=old_board
        for k,v in settings.items():setattr(scene.render,k,v)
        scene.render.image_settings.file_format=old_format;scene.eevee.taa_render_samples=old_samples
        for s in bpy.data.scenes:
            if s.name in paths:assert s.render.filepath==paths[s.name]
        bpy.context.window.scene=old_scene
        report['runtimeBindingsUnchanged']=all(g[k] is v for k,v in bindings.items());report['sourceAndProtectedInputsUnchanged']=all(sha(p)==h for p,h in protected.items());report['originalAndB2RawInventoryUnchanged']=all(inventory(p)==v for p,v in raw_before.items());report['dataUnchanged']=json.dumps(g['DATA'],sort_keys=True)==fields_before
        report['seconds']=round(time.time()-started,3)
        if not dest.exists():dest.mkdir(parents=True)
        write_new(dest/'report.json',report)
        assert report['runtimeBindingsUnchanged'] and report['sourceAndProtectedInputsUnchanged'] and report['originalAndB2RawInventoryUnchanged'] and report['dataUnchanged']
