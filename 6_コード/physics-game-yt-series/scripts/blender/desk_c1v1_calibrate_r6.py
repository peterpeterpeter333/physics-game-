"""C1 reversible main-subject/framing calibration, no frozen source edits."""
import os,json,time,hashlib,math

def run(ns):
    g=ns['main'].__globals__;d=g['d'];parts=g['PARTS'];g['bpy'].context.window.scene=d.SC
    out=os.path.join(g['A'].cache,'blender','calibration-c1v1-r6');os.makedirs(out,exist_ok=True)
    saved=[p.copy() for r,p in parts['papers']['papers']];records=[];pose_yaws={}
    def shot(tag,t,pose,focus=None,fstop=8,compact=False):
        for i,((root,p),old) in enumerate(zip(parts['papers']['papers'],saved)):p.z=.002+i*.0011 if compact else old.z
        g['apply'](t);d.pose_cam(pose)
        if focus is not None:d.CAM_D.dof.focus_distance=(d.CAM.location-g['Vector'](focus)).length
        d.CAM_D.dof.aperture_fstop=fstop
        if tag.startswith('crowd-'):d.set_hand('kai',(0,0,0),vis=False)
        hand_yaw=None
        if compact and t<3:
            top=min(23,6+int(t/1.5))-1;x=-.43+.12*((t*.35)%1);y=-.02+.04*math.sin(t*4)
            nib=g['Vector']((x,y,.002+top*.0011+.0007));d.quill.location=nib
            grip=nib+d.quill.rotation_euler.to_matrix()@g['Vector']((0,0,.060))
            # Choose the grip direction by physical overlap with the sheet,
            # never by the gate's title/caption exclusion bands.
            pk=tuple(pose)
            if pk not in pose_yaws:
                def box(root):
                    points=[d.project(o.matrix_world@g['Vector'](p)) for o in g['tree_nodes'](root) if o.type=='MESH' for p in o.bound_box]
                    return [min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)]
                def overlap(a,b):return max(0,min(a[2],b[2])-max(a[0],b[0]))*max(0,min(a[3],b[3])-max(a[1],b[1]))
                candidates=[]
                for yaw in [-150,-90,-30,30,90,150]:
                    d.set_hand('kai',grip,yaw,-30);g['bpy'].context.view_layer.update()
                    hb=box(d.HANDS['kai']);pb=box(parts['papers']['papers'][top][0]);candidates.append((overlap(hb,pb),yaw))
                pose_yaws[pk]=min(candidates)[1]
            hand_yaw=pose_yaws[pk];d.set_hand('kai',grip,hand_yaw,-30)
        g['bpy'].context.view_layer.update();f=os.path.join(out,tag+'.jpg');a={k:d.project(v) for k,v in g['anchors'](t).items()}
        d.SC.render.filepath=f;g['bpy'].ops.render.render(write_still=True)
        records.append({'tag':tag,'time':t,'file':f,'pose':pose,'focus':focus,'fstop':fstop,'paperCount':None,'compactPaperSpacing':compact,'handYaw':hand_yaw,'anchors':a})
        print('[c1 calibrate6] '+tag,flush=True)
    try:
        for dist in [.72,.78,.84]:shot('crowd-'+str(dist),17.8,[.10,.425,.05,dist,-10,32,40],[.10,.425,.065])
        for dist in [.32,.34]:shot('shishi-'+str(dist),258.675,[-.42,-.02,.07,dist,15,35,40],[-.42,-.02,.075],5.6)
        for dist in [.75,.78]:shot('score-'+str(dist),288.4333333333334,[.58,.30,.07,dist,0,30,40],[.58,.299,.07],8)
        poses=[[-.30,-.06,.02,.93,-65,45,40],[-.28,-.08,.02,1.0,-65,50,40],[-.32,-.10,.02,.95,-55,45,40],[-.30,-.12,.02,1.0,-65,45,40]]
        for i,p in enumerate(poses):
            for t in [0,1,2,358,359,360]:shot('desk-%d-t%d'%(i,t),t,p,[-.38,-.02,.02],4.2,True)
    finally:
        for (root,p),old in zip(parts['papers']['papers'],saved):p.z=old.z
        g['apply'](0)
    result={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'frozenR4Unchanged':True,'sources':{f:hashlib.sha256(open(f,'rb').read()).hexdigest() for f in g['SOURCE_SHA']},'records':records}
    json.dump(result,open(os.path.join(out,'manifest.json'),'w'),ensure_ascii=False,indent=1)
    print('[c1 calibrate6] DONE %d candidates; r4 restored'%len(records),flush=True)
    return result
