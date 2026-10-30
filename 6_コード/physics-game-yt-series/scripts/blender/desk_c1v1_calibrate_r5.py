"""C1 r5 physical-camera/ending calibration only. Restore the frozen r4 state.

No changes to supplied inputs, shared files, source geometry, or final caches.
All candidates render 1080x1920 / 16 samples through the existing C1 scene.
"""
import os,json,time,hashlib

def run(ns):
    g=ns['main'].__globals__;d=g['d'];parts=g['PARTS'];g['bpy'].context.window.scene=d.SC
    out=os.path.join(g['A'].cache,'blender','calibration-c1v1-r5');os.makedirs(out,exist_ok=True)
    saved_papers=[p.copy() for r,p in parts['papers']['papers']];records=[]
    def shot(tag,t,pose=None,focus=None,fstop=None,count=None,compact=False):
        # Candidate stack has the same 23 sheets at physical, touching spacing;
        # its top is close to the initial 6-sheet pile, not floating 3.8mm apart.
        for i,((root,p),saved) in enumerate(zip(parts['papers']['papers'],saved_papers)):
            p.z=.002+i*.0011 if compact else saved.z
        g['apply'](t)
        if pose is not None:d.pose_cam(pose)
        if focus is not None:d.CAM_D.dof.focus_distance=(d.CAM.location-g['Vector'](focus)).length
        if fstop is not None:d.CAM_D.dof.aperture_fstop=fstop
        if count is not None:
            for i,(r,p) in enumerate(parts['papers']['papers']):d.show_tree(r,i<count)
        g['bpy'].context.view_layer.update();f=os.path.join(out,tag+'.jpg')
        a={k:d.project(v) for k,v in g['anchors'](t).items()}
        d.SC.render.filepath=f;g['bpy'].ops.render.render(write_still=True)
        records.append({'tag':tag,'time':t,'file':f,'pose':pose,'focus':focus,'fstop':fstop,'paperCount':count,'compactPaperSpacing':compact,'anchors':a})
        print('[c1 calibrate] '+tag,flush=True)
    try:
        for dist in [.90,.95,1.0]:shot('crowd-'+str(dist),17.8,[.10,.425,.045,dist,-10,32,40],fstop=4.2)
        for dist in [.24,.23]:shot('pascal-'+str(dist),37.63133333333333,[.22,-.05,.09,dist,-12,38,40],[.22,-.05,.120],8)
        for dist in [.34,.32]:shot('meter-focus-'+str(dist),114.16133333333332,[.40,-.08,.03,dist,0,30,40],[.40,-.111,.026],5.6)
        for count in [6,10]:
            for t in [358,359,360]:shot('end-count%d-t%d'%(count,t),t,count=count)
        for t in [358,359,360]:shot('end-compact23-t%d'%t,t,compact=True)
    finally:
        for (root,p),saved in zip(parts['papers']['papers'],saved_papers):p.z=saved.z
        g['apply'](0)
    result={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'frozenR4Unchanged':True,'sources':{f:hashlib.sha256(open(f,'rb').read()).hexdigest() for f in g['SOURCE_SHA']},'records':records}
    json.dump(result,open(os.path.join(out,'manifest.json'),'w'),ensure_ascii=False,indent=1)
    print('[c1 calibrate] DONE %d candidates; r4 paper positions restored'%len(records),flush=True)
    return result
