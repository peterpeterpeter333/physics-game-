"""Actual-object dimensions on the original gate's complete 0.5 s grid.

Kept separate from the original image heuristic. Actual visual review is still
required before the user-approved scene-specific supplement can be accepted.
"""
import hashlib,json,math,time
from pathlib import Path
C=Path('/private/tmp/ys/ys-chain-b1v1');P=Path('/private/tmp/ys/ys-chain-b1v1-timing-final-20261024')
g=nsB1r6['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC
patch=json.loads((P/'timing-patch.json').read_text());nf=patch['frames'];dur=g['DATA']['duration']
times=[i*.5 for i in range(math.floor(dur/.5)+1)]
times+= [(math.ceil(c['end']*30-1e-7)-1)/30 for c in g['CUES']]
times+=[135.6,329.5,329.8,330.5,331]
rows=[];start=time.time()
for t in sorted(set(times)):
    j=min(nf-1,round(t*30));p=g['plan'](j)
    actual=j if patch['firstFrame']<=j<=patch['lastFrame'] or p[0]=='render' else p[1]
    rt=actual/30;g['apply'](rt);g['bpy'].context.view_layer.update()
    q=g['cue_at'](rt);points=g['hero_points'](q['camera']);assert points,(t,q)
    uv=[g['d'].project(v) for v in points];bbox=[min(p[0] for p in uv),min(p[1] for p in uv),max(p[0] for p in uv),max(p[1] for p in uv)]
    moving=bool(q['move'] and rt<q['start']+q['move'])
    rows.append({'gateTime':t,'frame':j,'actualRawFrame':actual,'actualPoseTime':rt,'cue':q['key'],'row':q['row'],'principalSubject':q['camera'],'cameraTransition':moving,'widthRatio':(bbox[2]-bbox[0])/1080,'bbox':bbox,'vertices':len(points),'afterCameraSettles':not moving,'raw':str((P/'blender/patch' if patch['firstFrame']<=j<=patch['lastFrame'] else C/'blender/desk')/('%05d.jpg'%actual))})
result={'id':'ys-chain-b1v1','scope':'Actual principal-object projection on every original 0.5 s sample and cue end; no original inspector result changed. Separate actual MP4 visual review is still required.','sourceSha256':hashlib.sha256(Path(g['__file__']).read_bytes()).hexdigest(),'patchSourceSha256':patch['patchSourceSha256'],'rows':rows,'sampleCount':len(rows),'steadyOutside40to70':[r for r in rows if not r['cameraTransition'] and not .4<=r['widthRatio']<=.7],'originalGateKeptUnchanged':True,'visualReviewAccepted':False,'seconds':time.time()-start}
(C/'b1-final-dimensions-20261024.json').write_text(json.dumps(result,ensure_ascii=False,indent=1))
print('B1 actual dimensions recorded',len(rows),'stable outside 40–70%',len(result['steadyOutside40to70']),flush=True)
