"""Read-only addendum for the paper actually held on screen before crowd words.

Original721 and final-held-dimensions are preserved. Their cue-based subject
is the still-underground crowd during these frames, not the visible paper.
This records a second, explicit named subject; no result is auto-accepted.
Root calls audit(nsC1, final_cache), after the correction is complete.
"""
import hashlib,json,os,time
from pathlib import Path
import numpy as np
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def audit(ns,final_cache):
    root=Path(final_cache);proof=json.loads((root/'camera-patch.json').read_text());dims=json.loads((root/'final-held-dimensions.json').read_text())
    output=root/'visible-paper-hold-dimensions.json';assert not output.exists()
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];oldscene=bpy.context.window.scene;oldpath=d.SC.render.filepath
    inputs={**proof['originalSourceSha256'],**proof['immutableInputSha256'],**proof.get('patchDependencySha256',{})};assert all(sha(p)==h for p,h in inputs.items())
    word=g['T']('desk:revolt','大きな反乱');samples=[r for r in dims['samples'] if r['cue']=='desk:revolt' and r['time']<word]
    assert 7<=len(samples)<=10
    rows=[]
    try:
        bpy.context.window.scene=d.SC
        for original in samples:
            j=original['frame'];ref=original['objectSourceFrame'];t=ref/30;g['apply'](t);d.pose_cam(original['cameraPose']);bpy.context.view_layer.update()
            top=min(23,6+int(t/1.5))-1;paper=g['PARTS']['papers']['papers'][top][0]
            objects=[o for o in g['tree_nodes'](paper) if o.type in {'MESH','FONT','CURVE','SURFACE'} and not o.hide_render];assert objects
            deps=bpy.context.evaluated_depsgraph_get();camera=np.array(d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1.,scale_y=1.))@np.array(d.CAM.matrix_world.inverted());points=[];maxerror=0
            for o in objects:
                ev=o.evaluated_get(deps);me=ev.to_mesh()
                try:v=np.array([tuple(v.co)+(1.,) for v in me.vertices]);world=v@np.array(o.matrix_world).T;clip=world@camera.T
                finally:ev.to_mesh_clear()
                assert np.all(clip[:,3]>0);xy=np.column_stack(((clip[:,0]/clip[:,3]+1)*540,(1-clip[:,1]/clip[:,3])*960));points.append(xy)
                for k in set((0,len(world)//2,len(world)-1)):
                    old=d.project(tuple(world[k,:3]));maxerror=max(maxerror,max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1])))
            assert maxerror<=.11;p=np.concatenate(points);lo=p.min(axis=0);hi=p.max(axis=0);w=float((hi[0]-lo[0])/1080)
            file=root/'blender/desk'/('%05d.jpg'%j)
            rows.append({'time':original['time'],'frame':j,'objectSourceFrame':ref,'namedSubject':'反乱の語の前まで実際に保持する帳簿の最上面1枚','excluded':'まだ地下にある群衆、手、羽根ペン、机、ろうそく','subjectDefinitionReason':'r12 approved paper hold; do not falsely substitute the future cue subject before it is visible','cameraPose':original['cameraPose'],'box':[float(lo[0]),float(lo[1]),float(hi[0]),float(hi[1])],'widthRatio':w,'within40to70':.4<=w<=.7,'clipped':bool(lo[0]<0 or hi[0]>1080 or lo[1]<0 or hi[1]>1920),'movingTowardCrowd':word-g['CUE']['desk:revolt']['move']<=t<word,'actualRawFile':str(file),'actualRawSha256':sha(file),'originalCueSubjectEvidenceUnmodified':original,'accepted':False,'humanReviewPending':True})
        assert all(sha(p)==h for p,h in inputs.items())
        result={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'notAReplacementGateOrOriginal721':True,'original7bAndSparseNumericalResultsUnchanged':True,'noRenderAndNoSourceFileEdit':True,'paperBeforeCrowdWord':word,'rows':rows,'cameraPatchProofSha256':sha(root/'camera-patch.json'),'projectionHelperSha256':sha(__file__)}
        output.write_text(json.dumps(result,ensure_ascii=False,indent=1));return result
    finally:
        g['apply']((g['NF']-1)/30);d.SC.render.filepath=oldpath;bpy.context.window.scene=oldscene
