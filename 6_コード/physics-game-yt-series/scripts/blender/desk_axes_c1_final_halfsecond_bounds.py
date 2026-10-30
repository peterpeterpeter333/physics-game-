"""C-only final held-source geometry evidence. No render, source edit or gate waiver.

Root calls audit(nsC1) after the frozen production finishes. The original gate
samples desk JPEG round(t*30) at t=k*.5; this helper reconstructs the exact
production scene_key first-occurrence map, verifies each sampled JPEG against
its held source, and projects the named subject at that source's actual time.
"""
import os,json,time,hashlib,math
import numpy as np

def sha(p):
    with open(p,'rb') as f:return hashlib.sha256(f.read()).hexdigest()

def audit(ns):
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];parts=g['PARTS'];cache=g['A'].cache
    output=os.path.join(cache,'c1-final-held-halfsecond-bounds.json')
    assert not os.path.exists(output),'Preserve prior final projection evidence'
    production=json.load(open(os.path.join(cache,'c1-production-r13.json')))
    assert production['status']=='done' and production['missing']==0
    frozen={**production['sourceSha256'],**production['immutableInputSha256']}
    assert all(sha(p)==h for p,h in frozen.items()),'Frozen production inputs changed'
    desk=production['out'];meta=json.load(open(os.path.join(desk,'meta.json')))
    assert meta['frames']==g['NF']==10814 and meta['missing']==0
    previous_scene=bpy.context.window.scene;previous_path=d.SC.render.filepath
    protected=[]
    for sc in bpy.data.scenes:
        p=bpy.path.abspath(sc.render.filepath)
        if sc is not d.SC and os.path.isfile(p):
            s=os.stat(p);protected.append((p,s.st_mtime_ns,s.st_size,sha(p)))
    assert len(protected)>=3
    bpy.context.window.scene=d.SC;started=time.time();local_cache={};sha_cache={}
    def hash_cached(p):
        if p not in sha_cache:sha_cache[p]=sha(p)
        return sha_cache[p]
    def descendants(roots):
        objects=set()
        for root in roots:objects.update(g['tree_nodes'](root))
        return sorted((o for o in objects if o.type in {'MESH','FONT','CURVE','SURFACE'} and not o.hide_render),key=lambda o:o.name)
    def subject(c,t):
        cam=c['camera']
        if cam=='desk':
            top=5 if c['row']==43 else min(23,6+int(t/1.5))-1
            return [parts['papers']['papers'][top][0]],'帳簿の最上面の紙1枚','手・羽根ペン・ろうそく・M1・紙束の広がりを除外'
        if cam=='crowd':return [r for r,p in parts['crowd']['roots']],'半透明の人形10体','机・手前の紙と手を除外'
        if cam=='pascal':return [parts['pascal']['root']],'パスカル人形と着想の小歯車','机を除外'
        if cam=='paper':return [parts['paper']['paper']],'筆算の紙1枚','2D数字・机を除外'
        if cam=='dial':return [parts['m1']['dials'][4]],'一の位の盤1枚','手・M1の他の盤と箱を除外'
        if cam=='m1close':return parts['m1']['dials'][3:5],'十と一の盤2枚','手・M1の他の盤と箱を除外'
        if cam=='pair':return [p['root'] for p in parts['m2']['wheels'][3:5]],'十と一の隣接する歯車2枚','手・木枠・他の歯車を除外'
        if cam=='arm':return [p['root'] for p in parts['m2']['wheels'][3:5]]+[parts['m2']['arms'][-1]['root']],'腕1本と隣接する歯車2枚','手・木枠・他の歯車を除外'
        if cam=='score':return [d.board_h],'得点板と板に付く文字','机と他模型を除外'
        if cam=='proto':return [p[0] for p in parts['proto']['boxes']],'試作品36箱','棚を除外'
        if cam in {'m1','order','price'}:return [parts['m1']['root']],'計算機M1','手・得点板・筆算紙を除外'
        return [parts[cam]['root']],{'m2':'5歯車と必要な支持枠','eight':'8歯車と必要な支持枠','meter':'走行距離計','shishi':'竹・支え・給水樋・受け石と実際の水滴','domino':'ドミノ8枚'}[cam],'机・手・他模型を除外'
    # Identical to frozen main()'s first occurrence / clone plan.
    keys={};plans=[]
    for j in range(g['NF']):
        k=g['scene_key'](j/30)
        if k not in keys:keys[k]=j
        plans.append(keys[k])
    assert len(keys)==production['uniqueStates']==meta['unique']
    rows=[];maximum_check_error=0.
    try:
        for i in range(math.floor(g['DUR']/.5)+1):
            t=i*.5;j=round(t*30);held=plans[j];held_time=held/30
            file=os.path.join(desk,'%05d.jpg'%j);source=os.path.join(desk,'%05d.jpg'%held)
            assert os.path.isfile(file) and os.path.isfile(source)
            assert hash_cached(file)==hash_cached(source),'Held raw JPEG differs from actual source'
            g['apply'](held_time);bpy.context.view_layer.update();c=g['cue_at'](held_time);requested_cue=g['cue_at'](t)
            roots,meaning,excluded=subject(c,held_time);objects=descendants(roots)
            deps=bpy.context.evaluated_depsgraph_get()
            camera=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted())
            projected=[];world_z=[];checks=0;vertex_count=0;behind=0
            for o in objects:
                # Geometry is rigidly transformed by apply(). Font/curve body
                # is part of the cache key; dynamically written quill is not
                # a subject. Evaluated bevels/fonts are included, not bbox-only.
                body=o.data.body if o.type=='FONT' else ''
                ck=(o.name,body)
                if ck not in local_cache:
                    evaluated=o.evaluated_get(deps);mesh=evaluated.to_mesh()
                    try:
                        vertices=np.array([tuple(v.co)+(1.,) for v in mesh.vertices],dtype=np.float64)
                    finally:evaluated.to_mesh_clear()
                    assert len(vertices),'Empty subject mesh '+o.name
                    local_cache[ck]=vertices
                vertices=local_cache[ck];matrix=np.array(o.matrix_world)
                world=vertices@matrix.T;clip=world@camera.T;positive=clip[:,3]>1e-9
                behind+=int((~positive).sum());vertex_count+=len(vertices);world_z.extend((float(world[:,2].min()),float(world[:,2].max())))
                if positive.any():
                    ndc=clip[positive,:2]/clip[positive,3,None]
                    xy=np.column_stack(((ndc[:,0]+1)*540,(1-ndc[:,1])*960));projected.append(xy)
                # Certify our vectorized camera projection against the original
                # rounded desk_lib.project, rather than assuming equivalence.
                for k in set((0,len(vertices)//2,len(vertices)-1)):
                    if not positive[k]:continue
                    original=d.project(tuple(world[k,:3]));xy=((clip[k,0]/clip[k,3]+1)*540,(1-clip[k,1]/clip[k,3])*960)
                    error=max(abs(original[0]-xy[0]),abs(original[1]-xy[1]));maximum_check_error=max(maximum_check_error,error);checks+=1
                    assert error<=.11,'Projection disagrees with original desk_lib.project'
            pose,moving=g['raw_pose'](held_time)
            item={'time':t,'requestedFrame':j,'heldSourceFrame':held,'heldSourceTime':held_time,'heldJpegSha256':hash_cached(source),'sampleJpegSha256':hash_cached(file),'sameHeldJpegBytes':True,'requestedCue':requested_cue['key'],'heldCue':c['key'],'row':c['row'],'camera':c['camera'],'poseAtHeldSource':list(pose),'cameraMovingAtHeldSource':moving,'focusDistanceAtHeldSource':d.CAM_D.dof.focus_distance,'fstopAtHeldSource':d.CAM_D.dof.aperture_fstop,'namedSubject':meaning,'excludedObjects':excluded,'objects':len(objects),'evaluatedVertices':vertex_count,'verticesBehindCamera':behind,'originalProjectionChecks':checks,'allNamedGeometryBelowDesk':bool(world_z and max(world_z)<=0)}
            if projected:
                p=np.concatenate(projected);lo=p.min(axis=0);hi=p.max(axis=0);width=float((hi[0]-lo[0])/1080)
                item.update(bbox=[float(lo[0]),float(lo[1]),float(hi[0]),float(hi[1])],widthRatio=width,within40to70=.4<=width<=.7,clipped=bool(lo[0]<0 or hi[0]>1080 or lo[1]<0 or hi[1]>1920))
            else:item.update(bbox=None,widthRatio=None,within40to70=False,clipped=True)
            rows.append(item)
            if (i+1)%60==0:print('[c1 held bounds] %d/721 %.1fs'%(i+1,time.time()-started),flush=True)
        assert len(rows)==721
        assert all(sha(p)==h for p,h in frozen.items()),'Production source changed during audit'
        for p,mtime,size,h in protected:
            st=os.stat(p);assert st.st_mtime_ns==mtime and st.st_size==size and sha(p)==h,'Other scene output changed'
        result={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'episode':'ys-chain-c1v1','notOriginalQualityGate7b':True,'noNumericalGateWaiver':True,'method':'Original gate desk times t=k*.5 and round(t*30); exact frozen scene_key first-occurrence held JPEG verified by SHA; evaluated subject vertices at heldSourceTime, original camera projection independently checked. Geometry bounds do not establish occlusion, opacity or legibility by themselves.','sampleCount':len(rows),'step':.5,'seconds':time.time()-started,'originalProjectionMaxDifferencePx':maximum_check_error,'productionUniqueStates':len(keys),'projectionHelperSha256':sha(os.path.abspath(__file__)),'productionSourceSha256':production['sourceSha256'],'immutableInputSha256':production['immutableInputSha256'],'otherSceneOutputsUnchanged':True,'rows':rows}
        with open(output,'w') as f:json.dump(result,f,ensure_ascii=False,indent=1)
        print('[c1 held bounds] DONE '+output,flush=True)
        return result
    finally:
        g['apply']((g['NF']-1)/30);d.SC.render.filepath=previous_path;bpy.context.window.scene=previous_scene
