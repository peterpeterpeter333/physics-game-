"""Read-only physical audit: all 57 cues, actual evaluated surfaces, no renders.

The semantic principal is selected from the supplied objects/actions, not from
the largest visible object. Hands, score overlays and unrelated background do
not make the principal wider. AABB corners are separately retained to reveal
their conservative over-estimate on round/rotated objects. No test is waived.
"""
import hashlib,json,os,time
import numpy as np

EXPECTED='8a7051f25dceea765ff369a50195fd1974ff731a414d7efa8c92b4d9fbbb8f6c'

def check(ns,out,revision='r9',expected_source=EXPECTED):
    if os.path.exists(out):raise RuntimeError('Existing D1 semantic physical audit preserved')
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];P=g['P'];G=g['G'];T=g['T'];created=g['CREATED_NAME']
    assert hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest()==expected_source,'D1 frozen source changed'
    assert g['D1_POSES']['mine'][3]==1.02,'D1 r9 not installed'
    bpy.context.window.scene=d.SC
    local_cache={};rows=[];metadata=[];started=time.time()
    def tree(root):return [root]+[v for c in g['CHILDREN'].get(root,()) for v in tree(c)]
    def trees(roots):return [o for root in roots for o in tree(root)]
    def named(group,*prefixes):return [o for o in G[group] if created[o].startswith(prefixes)]
    def unique(items):return list(dict.fromkeys(items))
    square=named('weights','d1_squarecm')
    cylinder=named('engine','d1_engine_cylinder','d1_engine_floor')+[P['engine']['piston'],P['engine']['steam'],P['engine']['condensate']]+P['engine']['spray']
    engine_arrows=tree(P['engine']['push'])+tree(P['engine']['balance'])
    hemi=P['hemi']['parts']+[P['hemi']['seam'],P['hemi']['valve'],P['hemi']['valvepipe']]
    weight_one=tree(P['weights']['one']);weight_hundred=tree(P['weights']['hundred']);palm=tree(P['weights']['palm'])
    inside_arrows=tree(P['weights']['up'])+tree(P['weights']['down'])
    def principal(c,t):
        key=c['key'];group=c['group'];critical=[]
        if group=='mine':role='complete coal-mine diorama and its visible horse-driven pump';objects=G['mine']+G['horse']
        elif group=='score':role='physical score board, including its own printed labels';objects=G['score']
        elif group=='horse':role='horse itself, not the surrounding mine';objects=tree(P['horse']['horse']['root'])
        elif group=='engine':
            if key=='nc:install' and t<T(key,'スエツケ'):
                role='mine installation site before the spoken installation; engine not yet revealed';objects=G['mine']
            else:role='visible Newcomen engine assembly, including arm and pump linkage';objects=G['engine']
        elif group=='logic':role='opened cylinder and piston, steam/cold-water contents';objects=cylinder
        elif group=='balloon':role='tablespoon, balloon and neck as one volume-change experiment';objects=G['balloon']
        elif group=='can':
            if key in ['can:crush','can:mio'] or key=='can:heat' and t>=T('can:heat','サカサ')+2.2:
                role='the can itself, before/during/after collapse; no stove or dish counted';objects=tree(P['can']['can']['root']);critical=objects
            elif key in ['air:who','air:empty']:
                role='collapsed can and its surrounding pressure arrows, not stove/dish';objects=tree(P['can']['can']['root'])+trees(P['can']['arrows']);critical=objects
            else:role='can, water dish and stove during heating/inversion';objects=[o for o in G['can'] if o not in tree(P['can']['tongs'])]
        elif group=='straw':role='cup and bent straw, liquid and active pressure arrows';objects=G['straw']
        elif group=='air':role='physical air-column layers and ground plate, not the pointing hand';objects=G['air']
        elif group=='weights':
            if key=='air:1kg' and t<T(key,'イチキログラム'):
                role='1 cm square face itself, not a hand or distant second weight';objects=square;critical=square
            elif key=='air:1kg' and t<T(key,'テノヒラ'):
                role='1 kg weight and its engraving';objects=weight_one;critical=[o for o in weight_one if o.type=='FONT']
            elif t<T('air:1kg','ヒャッキログラム'):
                role='palm-shaped 100 square-centimetre plate itself';objects=palm;critical=palm
            else:
                role='100 kg weight on its palm-shaped plate';objects=weight_hundred+palm;critical=[o for o in weight_hundred if o.type=='FONT']
        elif group=='inside':role='palm plate, crushed can and active equal/opposing force arrows';objects=palm+inside_arrows+tree(P['can']['can']['root'])+trees(P['can']['arrows']);critical=inside_arrows
        elif group=='twocans':role='two transparent cans, their gas and cooling drops';objects=G['twocans']
        elif group=='pump' or group=='last':role='complete mine and working steam pump';objects=G['mine']+G['engine'];critical=[P['mine']['marker']]
        elif group=='cylinder':role='opened cylinder/piston and active pressure arrows';objects=cylinder+engine_arrows;critical=engine_arrows
        elif group=='twins':role='thin and wide cylinders with their own active force arrows';objects=G['twins']
        elif group=='area' or group=='heavy':
            if group=='area' or key=='size:2t' and t<T('size:2t','ニトン'):
                role='piston area face and its diameter/radius or 22 palm plates';objects=G['area'];critical=[P['area']['diameter'],P['area']['radius']]
            elif key=='size:horse':role='2 tonne weight and four comparison horses';objects=G['heavy'];critical=[o for o in tree(P['heavy']['weight']) if o.type=='FONT']
            else:role='2 tonne weight itself with its cast bands and engraving';objects=tree(P['heavy']['weight']);critical=[o for o in objects if o.type=='FONT']
        elif group=='hemisphere':role='two copper hemispheres and their valve, no horse train';objects=hemi;critical=[P['hemi']['valve'],P['hemi']['valvepipe']]
        elif group=='pull':role='hemisphere experiment with eight horses and two pulling ropes';objects=G['hemi'];critical=hemi
        elif group=='map':role='European map board and installed-machine marks';objects=G['map']
        elif group=='coal':role='coal pile together with the reheated boiler and cylinder';objects=G['coal']+[P['engine']['boiler']]+cylinder
        elif group=='fuji':role='Fuji mountain, both air columns and the two small model engines';objects=G['fuji']
        else:raise RuntimeError('Missing D1 semantic principal '+key)
        return role,unique(objects),unique(critical)
    def local_vertices(o,dg):
        # Static evaluated surfaces may be reused. Shape-key cans and the live
        # score/font strings are always freshly evaluated at their actual state.
        cacheable=o.type=='MESH' and not o.data.shape_keys
        if cacheable and o in local_cache:return local_cache[o]
        eo=o.evaluated_get(dg);mesh=eo.to_mesh()
        if mesh is None:return np.empty((0,4))
        try:
            vv=np.empty(len(mesh.vertices)*3,dtype=np.float64);mesh.vertices.foreach_get('co',vv);vv=vv.reshape(-1,3)
            result=np.column_stack((vv,np.ones(len(vv))))
        finally:eo.to_mesh_clear()
        if cacheable:local_cache[o]=result
        return result
    def project(objects,projection,dg,corners=False):
        points=[];names=[];count=0
        for o in objects:
            if o.type not in ['MESH','FONT','CURVE'] or o.hide_render:continue
            v=np.column_stack((np.array(o.bound_box),np.ones(8))) if corners else local_vertices(o,dg)
            if not len(v):continue
            clip=v@np.asarray(projection@o.matrix_world,dtype=np.float64).T
            ndc=clip[:,:3]/clip[:,3:4];xy=np.column_stack(((ndc[:,0]*.5+.5)*1080,(.5-ndc[:,1]*.5)*1920,clip[:,3]));points.append(xy);names.append(created.get(o,o.name));count+=len(v)
        if not points:return None
        a=np.concatenate(points);x0=float(a[:,0].min());x1=float(a[:,0].max());y0=float(a[:,1].min());y1=float(a[:,1].max())
        return {'x0':x0,'x1':x1,'y0':y0,'y1':y1,'widthRatio':(x1-x0)/1080,'allVerticesInFrame':bool((a[:,2]>0).all() and x0>=0 and x1<=1080 and y0>=0 and y1<=1920),'vertexCount':count,'visibleObjectCount':len(names),'objectNames':names}
    def checks(b,critical=False):
        if b is None:return {'visible':False,'size40to70':False,'frameSafe':False}
        return {'visible':True,'size40to70':.40<=b['widthRatio']<=.70,'frameSafe':b['allVerticesInFrame'] and b['x0']>=40 and b['x1']<=1040 and b['y0']>=110 and b['y1']<=(1100 if critical else 1600)}
    for c in g['CUES']:
        a=c['start'];span=c['end']-a
        samples=[a+.033,a+min(max(c['move'],.25)+.05,span*.2),a+span*.25,a+span*.5,a+span*.75,c['end']-.06]
        if c['key']=='air:1kg':samples=[169.8,171.632667,172.3,175.5,178.382667,c['end']-.06]
        if c['key']=='can:heat':samples=[a+.033,T('can:heat','アタタメ')+.2,T('can:heat','サカサ')+.5,T('can:heat','サカサ')+1.6,T('can:heat','サカサ')+3.03,c['end']-.06]
        if c['key']=='can:crush':
            impact=T('can:crush','グシャット');samples=[a+.033,impact-1/30,impact+1/30,impact+.075,impact+.15,c['end']-.06]
        if c['key']=='air:who':
            reveal=T('air:who','マワリノ');samples=[a+.033,reveal-1/30,reveal+1/30,reveal+.25,reveal+.55,c['end']-.06]
        if c['key']=='shrink:spoon':samples=[a+.033,98.1,99.3,100.7,104.5,c['end']-.06]
        if c['key']=='size:guericke':samples=[a+.033,325.9,327,332.3,333.2,334.7]
        if c['key']=='size:pull':samples=[a+.033,336.8,338.5,339.7,341.3,c['end']-.06]
        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))
        metadata.append({'cue':c['key'],'sourceObjects':c['objects'],'sourceAction':c['action'],'samples':samples,'principalSelection':'explicit semantic role per actual spoken state; unrelated background and hands excluded'})
        for t in samples:
            g['apply'](t);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
            projection=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            role,objects,critical=principal(c,t);b=project(objects,projection,dg);cb=project(critical,projection,dg);box=project(objects,projection,dg,True)
            bc=checks(b);cc=checks(cb,True) if cb else None
            row={'cue':c['key'],'time':t,'semanticPrincipal':role,'actualPose':g['pose_at'](t),'cameraTransition':g['pose_at'](max(0,t-1/30))!=g['pose_at'](t),'actualSurface':b,'conservativeBoundingCorners':box,'criticalSurface':cb,'physicalChecks':bc,'criticalChecks':cc,'pass':bc['visible'] and bc['size40to70'] and bc['frameSafe'] and (cc is None or cc['frameSafe'])}
            rows.append(row)
        print('D1 semantic projection',c['key'],len(samples),'states',flush=True)
    result={'episode':'D-1','revision':revision,'sourceSha256':expected_source,'createdAt':time.strftime('%Y-%m-%d %H:%M:%S'),'elapsedSeconds':round(time.time()-started,3),'status':'read-only evaluated-surface physical audit, no rendering and no waiver of any original image gate','originalTestsModified':False,'strictInspectorWaiver':False,'cueCount':len(metadata),'states':len(rows),'metadata':metadata,'allPass':all(r['pass'] for r in rows),'failures':[{k:r[k] for k in ['cue','time','semanticPrincipal','cameraTransition','physicalChecks','criticalChecks']} for r in rows if not r['pass']],'rows':rows}
    json.dump(result,open(out,'w'),ensure_ascii=False,indent=1)
    print(json.dumps({k:v for k,v in result.items() if k not in ['metadata','rows','failures']}),flush=True)
    return result
