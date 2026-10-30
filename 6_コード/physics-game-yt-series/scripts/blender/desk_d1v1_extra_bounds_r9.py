"""Supplemental actual-hero projection, not another render or heuristic fix."""
import hashlib,json,os,time
EXPECTED='8a7051f25dceea765ff369a50195fd1974ff731a414d7efa8c92b4d9fbbb8f6c'
def check(ns,out):
    if os.path.exists(out):raise RuntimeError('Existing D1 extra physical bounds preserved')
    g=ns['main'].__globals__;assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==EXPECTED;assert g['D1_POSES']['mine'][3]==1.02
    g['bpy'].context.window.scene=g['d'].SC
    def descendants(o):return [o]+[v for c in g['CHILDREN'].get(o,()) for v in descendants(c)]
    rows=[]
    for t,role,root in [(34,'horse itself, excluding the surrounding mine',g['P']['horse']['horse']['root']),(175.5,'palm-shaped plate itself, excluding the pointing hand',g['P']['weights']['palm']),(179,'100kg weight and its cast bands/engraving',g['P']['weights']['hundred'])]:
        g['apply'](t);g['bpy'].context.view_layer.update();points=[g['d'].project(o.matrix_world@g['Vector'](v)) for o in descendants(root) if o.type in ['MESH','FONT','CURVE'] and not o.hide_render for v in o.bound_box]
        assert points;b={'x0':min(p[0] for p in points),'x1':max(p[0] for p in points),'y0':min(p[1] for p in points),'y1':max(p[1] for p in points)};width=(b['x1']-b['x0'])/1080
        rows.append({'time':t,'actualHero':role,'actualPose':g['pose_at'](t),'bbox':b,'widthRatio':width,'physical40to70':.4<=width<=.7,'allCornersInFrame':all(p[2] for p in points)})
    record={'episode':'D-1','revision':'r9','sourceSha256':EXPECTED,'status':'supplemental actual model widths; no waiver and no render','createdAt':time.strftime('%Y-%m-%d %H:%M:%S'),'rows':rows};json.dump(record,open(out,'w'),indent=1);print(json.dumps(record),flush=True);return record
