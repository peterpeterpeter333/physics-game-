"""Read physical subject bounds through the actual C1 camera; never replace 7b.

This audit does not draw, change source, change geometry, or use an auxiliary prop
to inflate the subject. It records both unclipped bounds and clipping warnings.
"""
import json,os,hashlib,time

def audit(ns):
    g=ns['main'].__globals__;d=g['d'];parts=g['PARTS'];g['bpy'].context.window.scene=d.SC
    def descendants(roots):
        objects=set()
        for root in roots:
            objects.update(g['tree_nodes'](root))
        return [o for o in objects if o.type in {'MESH','FONT','CURVE','SURFACE'} and not o.hide_render]
    def subjects(c):
        cam=c['camera']
        if cam=='desk':return [parts['papers']['papers'][0][0]],'税計算の紙1枚（束の広がりではない）'
        if cam=='crowd':return [r for r,p in parts['crowd']['roots']],'奥の10人（手前の紙と手を除外）'
        if cam=='pascal':return [parts['pascal']['root']],'人物と着想の小歯車'
        if cam=='paper':return [parts['paper']['paper']],'筆算の紙（2Dの数字を除外）'
        if cam=='dial':return [parts['m1']['dials'][4]],'一の位の盤1枚（手を除外）'
        if cam=='m1close':return parts['m1']['dials'][3:5],'十と一の盤（箱の切れた左側を除外）'
        if cam=='pair':return [p['root'] for p in parts['m2']['wheels'][3:5]],'十と一の歯車'
        if cam=='arm':return [p['root'] for p in parts['m2']['wheels'][3:5]]+[parts['m2']['arms'][-1]['root']],'腕1本と隣り合う2歯車（木枠を除外）'
        if cam=='score':return [d.board_h],'得点板'
        if cam=='proto':return [p[0] for p in parts['proto']['boxes']],'試作36箱（棚を除外）'
        if cam in {'m1','order','price'}:return [parts['m1']['root']],'計算機M1（得点板と筆算紙を除外）'
        return [parts[cam]['root']],{'m2':'5歯車とその支持枠','eight':'8歯車とその支持枠','meter':'走行距離計','shishi':'竹・支え・給水樋・受け石','domino':'8枚のドミノ'}[cam]
    result=[]
    for c in g['CUES']:
        # カメラの移動後。指示どおりの静止構図を数える。
        t=max(c['start']+min(c['move']+.05,(c['end']-c['start'])*.75),c['end']-.20)
        t=min(c['end']-.01,t);g['apply'](t)
        roots,meaning=subjects(c);objects=descendants(roots)
        points=[d.project(o.matrix_world@g['Vector'](p)) for o in objects for p in o.bound_box]
        if not points:raise AssertionError('No physical subject: '+c['key'])
        x0=min(p[0] for p in points);x1=max(p[0] for p in points);y0=min(p[1] for p in points);y1=max(p[1] for p in points)
        width=(x1-x0)/1080
        result.append({'cue':c['key'],'row':c['row'],'camera':c['camera'],'time':t,'subject':meaning,'objects':len(objects),'box':[x0,y0,x1,y1],'widthRatio':width,'within40to70':.4<=width<=.7,'clipped':x0<0 or x1>1080 or y0<0 or y1>1920})
    out={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'notQualityGate7b':True,'method':'actual world-space mesh/font bounds projected by the unchanged desk_lib.project; no auxiliary items outside named subject','sources':{p:hashlib.sha256(open(p,'rb').read()).hexdigest() for p in g['SOURCE_SHA']},'frames':result}
    path=os.path.join(g['A'].cache,'c1-physical-subject-bounds-r4.json');json.dump(out,open(path,'w'),ensure_ascii=False,indent=1)
    print('[c1 bounds] %d actual camera poses; %d outside40–70; %d clipping warnings; %s'%(len(result),sum(not r['within40to70'] for r in result),sum(r['clipped'] for r in result),path),flush=True)
    return out
