"""Read-only pose projection audit; no rendering or geometry/source changes."""
import hashlib,json,os,time
EXPECTED_SOURCE='8b6f87b246a902dacfb69aa8197e8e7d193bc2c7df1ad26f92b7a7a8799cf100'
def check(ns,out):
    if os.path.exists(out):raise RuntimeError('Existing D1 mine bounds audit preserved')
    g=ns['main'].__globals__;g['bpy'].context.window.scene=g['d'].SC
    assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==EXPECTED_SOURCE
    rows=[]
    for t in [0,2,20,403.3]:
        g['apply'](t);g['bpy'].context.view_layer.update()
        groups=['mine'] if t<35 else ['mine','engine']
        objects=[o for name in groups for o in g['G'][name] if o.type in ['MESH','FONT','CURVE'] and not o.hide_render]
        p=[g['d'].project(o.matrix_world@g['Vector'](corner)) for o in objects for corner in o.bound_box]
        b={'x0':min(a[0] for a in p),'x1':max(a[0] for a in p),'y0':min(a[1] for a in p),'y1':max(a[1] for a in p)}
        rows.append({'time':t,'actualObjects':groups,'actualPose':g['pose_at'](t),'bbox':b,'widthRatio':(b['x1']-b['x0'])/1080,'allCornersInFrame':all(a[2] for a in p)})
    record={'episode':'D-1','revision':'r8','status':'actual mesh projection only; not image proxy or final gate','sourceSha256':EXPECTED_SOURCE,'createdAt':time.strftime('%Y-%m-%d %H:%M:%S'),'rows':rows}
    json.dump(record,open(out,'w'),indent=1);print(json.dumps(record),flush=True);return record
