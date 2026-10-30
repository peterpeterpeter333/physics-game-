"""Root-scheduled, no-render E1 dimensions at actual final-gate sample frames.

Never replaces an image-gate result. Only produces geometric evidence for the
user-approved, individually reviewed proxy/physical-image disagreements.
Run AFTER production, never concurrently with the retained E1 scene renderer.
"""
import hashlib,json,math,os,runpy,time

WORK='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
CACHE='/private/tmp/ys/ys-chain-e1v1'
GROUPS={'map':['chart'],'grid':['chart'],'globe':['globe'],'latitude':['globe'],'star':['globe'],'dial':['globe','dial'],'torch':['globe','torch'],'clocks':['tokyo','london'],'arc':['globe','arcs'],'ship':['ship'],'clock':['shipclock'],'log':['ship'],'pendulum':['pendulum'],'sway':['ship','pendulum'],'prize':['prize']}

def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for b in iter(lambda:f.read(1<<20),b''):h.update(b)
    return h.hexdigest()

def run(ns,out=CACHE+'/e1v1-final-dimensions-r9.json'):
    assert not os.path.lexists(out),'Preserve previous physical evidence'
    runner=runpy.run_path(WORK+'/scripts/blender/desk_axes_e1_r9_production.py')
    preflight=runner['run'](ns)
    g=ns['apply'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert os.path.exists(CACHE+'/e1v1-production-r9/completed.json'),'Measure after production only'
    pg,plans=runner['frozen_plan']();nf=len(plans)
    indices=sorted(set(list(range(0,nf,15))+[min(nf-1,math.ceil(c['end']*30-1e-7)-1) for c in g['CUES']]+[nf-1]))
    old_scene=bpy.context.window.scene;other={s.name:s.render.filepath for s in bpy.data.scenes}
    saved={p:runner['stamp'](p) for p in other.values() if p and os.path.isfile(p)}
    rows=[];started=time.time()
    def vertices(name,leather_only=False):
        points=[]
        for ob in g['GROUPS'][name]:
            if ob.hide_render:continue
            if leather_only and not(ob.type=='MESH' and d.MATS['e1leather'] in list(ob.data.materials)):continue
            if ob.type=='MESH':points.extend(ob.matrix_world@v.co for v in ob.data.vertices)
            elif ob.type=='CURVE':
                for spline in ob.data.splines:points.extend(ob.matrix_world@g['Vector'](p.co[:3]) for p in spline.points)
        return points
    def bounds(points):
        q=[d.project(v) for v in points]
        if not q:return None
        box=[min(v[0] for v in q),min(v[1] for v in q),max(v[0] for v in q),max(v[1] for v in q)]
        return {'box':box,'width':(box[2]-box[0])/1080,'safeArea':box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550}
    try:
        bpy.context.window.scene=scene
        for j in indices:
            # Duplicated raw frames depict the last rendered pose, not a new
            # continuously advancing pose at the target timestamp.
            k=j if plans[j][0]=='render' else plans[j][1];t=k/30
            g['apply'](t);c=g['current'](t);names=GROUPS[c['camera']]
            points=[];separate={}
            for name in names:
                cloud=vertices(name,c['camera']=='prize');points.extend(cloud);separate[name]=bounds(cloud)
            result=bounds(points);assert result is not None,(j,c['key'])
            stable=not c['move'] or t>=c['start']+c['move']-1e-7
            rows.append({'frame':j,'time':j/30,'depictedFrame':k,'depictedTime':t,'plan':plans[j][0],'cue':c['key'],'row':c['row'],'camera':c['camera'],'groups':names,'perGroup':separate,'stable':stable,'pose':g['pose_at'](t),**result,'physicalWidth40to70':.4<=result['width']<=.7,'visualReview':'pending actual corresponding encoded image; geometry is not visibility/readability approval'})
    finally:
        bpy.context.window.scene=old_scene
        assert all(bpy.data.scenes[name].render.filepath==value for name,value in other.items()),'No render paths may change'
        assert not runner['verify_saved'](saved),'Existing scene saved images changed'
    result={'id':'ys-chain-e1v1','stage':'r9','scope':'physical mesh/curve projections at every original half-second raw-gate frame plus all actual cue-end frame indices; NO render and NO replacement of original image gate','sourceFreeze':CACHE+'/e1v1-r9-source-freeze.json','sourceFreezeSha256':sha(CACHE+'/e1v1-r9-source-freeze.json'),'helperSha256':sha(__file__),'samples':len(rows),'halfSecondSamples':len(range(0,nf,15)),'allCueEnds':len(g['CUES']),'productionFrames':nf,'renderer':preflight['renderer'],'scene':scene.name,'seconds':round(time.time()-started,2),'originalGatePreserved':True,'approvalDecision':'pending exact proxy/actual image/physical width row-by-row review','rows':rows}
    with open(out,'w') as f:json.dump(result,f,ensure_ascii=False,indent=2)
    print('E1 final dimensions',len(rows),'samples, no rendering, original gate untouched:',out,flush=True)
    return result
