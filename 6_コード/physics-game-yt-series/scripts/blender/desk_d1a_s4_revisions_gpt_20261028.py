"""D-1a S4, non-pump visual revisions only. Import performs no work.

Parent order: base S3 apply -> adopted camera patch -> apply(ns,t) -> pump.
build(ns) creates private objects and does not modify P/G/shared meshes. Parent
registers returned new objects in its separate MANAGED/BASE. Existing objects
receive absolute, active-cue poses only, after the original S3 reset/apply.
No rendering, saving, GUI operations, text, audio or cache writes occur here.
"""
import math
import bpy
from mathutils import Matrix, Vector
from bpy_extras.object_utils import world_to_camera_view

PREFIX='d1a_s4_revision_'

def _tree(root):
    return [root]+[o for child in root.children for o in _tree(child)]

def _show(ns,objects,visible):
    fn=ns.get('show_now',ns['d'].show)
    for obj in objects: fn(obj,visible)

def _mat(ns,name,color,alpha=1):
    d=ns['d'];m=d.mat(PREFIX+name,color,.45,alpha=alpha,unique=True)
    if alpha<1:
        try:m.surface_render_method='BLENDED'
        except (AttributeError,TypeError):pass
        if hasattr(m,'blend_method'):m.blend_method='BLEND'
    return m

def _arrow(ns,name,material):
    # A solid concept arrow in local XZ, facing the camera-side -Y. The
    # seven-vertex outline is geometry, not a text/card-sized proxy primary.
    d=ns['d'];w=.006
    verts=[(-w/2,0,0),(w/2,0,0),(w/2,0,.75),
           (w,0,.75),(0,0,1),(-w,0,.75),(-w/2,0,.75)]
    mesh=bpy.data.meshes.new(PREFIX+name+'_mesh');mesh.from_pydata(verts,[],[tuple(range(7))]);mesh.update()
    obj=d.link(bpy.data.objects.new(PREFIX+name,mesh));d.put(obj,material)
    solid=obj.modifiers.new('thin_arrow_edge','SOLIDIFY');solid.thickness=.001
    return obj

def _pose_arrow(ns,obj,a,b,visible=True):
    a,b=Vector(a),Vector(b);axis=b-a
    obj.location=a;obj.rotation_euler=axis.to_track_quat('Z','Y').to_euler();obj.scale=(1,1,axis.length)
    _show(ns,[obj],visible)

def _clone_tree(ns,source,parent,name):
    # Copy objects/parenting only; original mesh/text data are read-only shared.
    # Do not use an old helper that rebuilds a complete legacy scene.
    d=ns['d'];created=[]
    def clone(old,new_parent,parent_world):
        world=old.matrix_world.copy()
        obj=old.copy();obj.name=PREFIX+name+'_'+old.name;d.link(obj)
        # Local coordinates are explicitly relative to the teaching pair's
        # origin. Never read an un-evaluated new parent's matrix_world and
        # combine it with an old world-space matrix_basis (the P1 offset bug).
        obj.parent=new_parent;obj.matrix_parent_inverse=Matrix.Identity(4)
        obj.matrix_basis=parent_world.inverted()@world
        created.append(obj)
        for child in tuple(old.children):clone(child,obj,world)
        return obj
    assert parent.parent is None
    return clone(source,parent,parent.matrix_basis.copy()),created

def build(ns):
    """Create only new private objects; return them for parent's new BASE."""
    if ns.get('S4_REVISIONS') is not None:return ns['S4_REVISIONS']
    d=ns['d'];ext=ns['ext'];P,G=ns['P'],ns['G'];before=set(bpy.data.objects)
    blue=_mat(ns,'outside_blue','#459cd0');orange=_mat(ns,'inside_orange','#ed9540')
    water=_mat(ns,'clear_bucket_water','#2e98c2')
    steam=_mat(ns,'steam_path','#c6e7f0',.65)
    palm=ext.palm(PREFIX+'balanced_palm',(.30,-.08,.14),.105)
    arrows=[_arrow(ns,'balance_%d'%i,blue if i==0 else orange) for i in range(2)]
    can_arrows=[_arrow(ns,'can_pressure_%d'%i,blue if i<3 else orange) for i in range(6)]
    air_arrow=_arrow(ns,'column_down',blue)
    # 22 identical row22 palm/100kg teaching models; two columns, eleven rows.
    pairs=[]
    for i in range(22):
        root=d.empty(PREFIX+'palm100_pair%02d'%i,(.34,-.04,0))
        pc,po=_clone_tree(ns,P['weights']['palm'],root,'pair%02d_palm'%i)
        wc,wo=_clone_tree(ns,P['weights']['hundred'],root,'pair%02d_weight'%i)
        pc.scale=(1.3,)*3
        pairs.append(dict(root=root,palm=pc,weight=wc,palmObjects=po,weightObjects=wo,all=[root]+po+wo))
    # The shaft close view receives actual soil/stone strata behind both ropes.
    wall=[]
    layers=[(.052,.050,'#8f724f'),(.102,.058,'#53545a'),(.160,.040,'#282c30'),
            (.200,.063,'#737270'),(.263,.027,'#303033'),(.290,.070,'#976b48')]
    for i,(z,h,color) in enumerate(layers):
        wall.append(d.box(PREFIX+'pit_back_layer%d'%i,(.006,.155,h),(-.389,.10,z+h/2),_mat(ns,'pit_stratum%d'%i,color),bevel=.001))
        for k in range(3):
            wall.append(d.sphere(PREFIX+'pit_stone%d_%d'%(i,k),.005,
               (-.384,.048+k*.045,z+h*(.25+.15*(k%2))),_mat(ns,'pit_stone_mat%d'%i,'#353636'),scale=(.35,1.5,.7),seg_=10,ring=5))
    # A continuous steam connection and moving dots, not isolated disappearing fog.
    path=[Vector((-.01,-.245,.026)),Vector((-.015,-.205,.078)),
          Vector((.025,-.14,.100)),Vector((.09,-.08,.035))]
    line=[ext.rod(PREFIX+'steam_link%d'%i,a,b,.0012,steam) for i,(a,b) in enumerate(zip(path,path[1:]))]
    dots=[d.sphere(PREFIX+'steam_link_dot%d'%i,.0024,(0,0,-5),steam,seg_=12,ring=6) for i in range(10)]
    seep=[d.sphere(PREFIX+'final_seep%d'%i,.0025,(0,0,-5),water,seg_=12,ring=6) for i in range(12)]
    body=P['can']['can']['body'];can_material=body.active_material
    transparent=can_material.copy();transparent.name=PREFIX+'can_inner_pressure_view'
    node=d.principled(transparent);node.inputs['Alpha'].default_value=.30
    try:transparent.surface_render_method='BLENDED'
    except (AttributeError,TypeError):pass
    if hasattr(transparent,'blend_method'):transparent.blend_method='BLEND'
    spoon=[o for o in G['balloon'] if o.name.startswith(('d1_spoon_bowl','d1_spoon_handle','d1_spoonwater'))]
    original={o:(ns['BASE'][o][0].copy(),ns['BASE'][o][1].copy(),ns['BASE'][o][2].copy()) for o in spoon}
    objects=sorted(set(bpy.data.objects)-before,key=lambda o:o.name)
    q=dict(objects=objects,palm=palm,balanceArrows=arrows,canArrows=can_arrows,
           airArrow=air_arrow,pairs=pairs,pitWall=wall,steamPath=path,
           steamLine=line,steamDots=dots,seep=seep,waterMaterial=water,
           canMaterial=can_material,canXrayMaterial=transparent,
           spoon=spoon,spoonOriginal=original,
           source='Claude S3 correction chapter2; non-pump only',
           parent2D=[7,24,39],last=None)
    ns['S4_REVISIONS']=q
    _show(ns,objects,False)
    return q

def _path(points,u):
    u=max(0,min(1,u));lengths=[(b-a).length for a,b in zip(points,points[1:])];distance=u*sum(lengths)
    for a,b,length in zip(points,points[1:],lengths):
        if distance<=length:return a.lerp(b,distance/max(1e-9,length))
        distance-=length
    return points[-1].copy()

def _inside(ns,q,t,roles,anchors):
    P,G=ns['P'],ns['G'];W=ns['W'];c=P['can']['can']
    _show(ns,G['weights']+G['can'],False)
    _show(ns,G.get('can_extra',[]),False)
    _show(ns,ns['COR']['can']['ripples'],False)
    if ns['EX'].get('seal_ring') is not None:_show(ns,_tree(ns['EX']['seal_ring']),False)
    at=W('air:inside','缶がつぶれた');gone=W('air:inside','なくなった')
    if t<at:
        _show(ns,_tree(q['palm']),True)
        a=Vector((.30,-.08,.14));v=t>=W('air:inside','体の内側')
        _pose_arrow(ns,q['balanceArrows'][0],a+Vector((0,-.035,.045)),a+Vector((0,-.035,.010)),v)
        _pose_arrow(ns,q['balanceArrows'][1],a+Vector((0,-.035,-.045)),a+Vector((0,-.035,-.010)),v)
        cam=[.30,-.08,.145,.30,-8,30,50]
        roles['primary']=dict(name='内外から押される手のひら',objects=[q['palm']],minWidth=.50)
        roles['pressureArrows']=dict(name='手の両面の同長の圧力矢印',objects=q['balanceArrows'])
        anchors['balancedPalm']=a;anchors['innerArrow']=a+Vector((0,-.035,-.08))
    else:
        _show(ns,_tree(c['root'])+ns['COR']['can']['capobjs'],True)
        crush=ns['U'](t,gone,.45)
        c['root'].location=(.265,-.12,.05);c['root'].rotation_euler=(0,math.pi,0)
        c['crush'].value=crush;c['body'].active_material=q['canXrayMaterial']
        c['body'].location=ns['BASE'][c['body']][0]+Vector((0,0,.010*crush))
        for obj in c['rim']:
            obj.location=ns['BASE'][obj][0].copy()
            if ns['BASE'][obj][0].z<c['p'].z:obj.location.z+=.020*crush
        ns['cr'].apply_can(ns['COR'],P,t,1,crush)
        # This conceptual pressure replay has no water dish in its selected
        # view; do not leave the earlier sealing scene's two floating ripples.
        _show(ns,ns['COR']['can']['ripples'],False)
        # Replace prior-pressure arrows only in this replay. Orange arrows are
        # inside the temporarily translucent can and vanish at the spoken word.
        for old in P['can']['arrows']:_show(ns,_tree(old),False)
        center=Vector((.265,-.12,.048));dirs=[Vector((-1,0,0)),Vector((1,0,0)),Vector((0,0,1))]
        for i,v in enumerate(dirs):
            _pose_arrow(ns,q['canArrows'][i],center+v*.044,center+v*.033,True)
            _pose_arrow(ns,q['canArrows'][i+3],center+v*.002,center+v*.026,t<gone)
        cam=[.265,-.12,.030,.184,-8,25,45]
        roles['primary']=dict(name='内外の圧力を比べる逆さの缶',objects=[c['root']],minWidth=.60)
        roles['pressureArrows']=dict(name='缶の内外の圧力矢印',objects=q['canArrows'])
        anchors['insideCan']=center;anchors['innerArrow']=center+Vector((0,0,.018))
    ns['set_camera'](cam)
    return cam

def _count(ns,q,t,roles,anchors):
    P,G=ns['P'],ns['G'];W=ns['W'];u=ns['U']
    _show(ns,G['area']+G['heavy'],False)
    a=W('size:2t','22枚');b=W('size:2t','2200キログラム');done=b+.8
    single=[.30,-.08,.02,.28,-6,45,50]
    overview=[.30,-.08,.025,.65,0,68,50]
    if t<a:
        p=q['pairs'][0];p['root'].location=(.30,-.08,0);p['root'].scale=(1,)*3
        _show(ns,p['palmObjects'],True);_show(ns,p['weightObjects'],t>=W('size:2t','100キログラム'))
        cam=single;objects=p['palmObjects']+p['weightObjects'];name='手のひら1枚と100kgの重り'
    elif t<done:
        forming=u(t,a,.8);gather=u(t,b,.8)
        for i,p in enumerate(q['pairs']):
            col,row=i%2,i//2;grid=Vector((.30+(-.11 if col==0 else .11),-.08+(row-5)*.0355,0))
            appearing=t>=a+.8*i/22
            pos=Vector((.30,-.08,0)).lerp(grid,forming) if i==0 else grid
            p['root'].location=pos.lerp(Vector((.30,-.08,.035)),gather)
            scale=(1+(.32-1)*forming if i==0 else .32)*(1-.85*gather)
            p['root'].scale=(scale,)*3
            _show(ns,p['palmObjects'],appearing and gather<.55)
            _show(ns,p['weightObjects'],appearing and gather<.98)
        if gather>.75:
            weight=P['heavy']['weight'];_show(ns,_tree(weight),True)
            weight.location=(.30,-.08,.05);weight.scale=(max(.01,(gather-.75)/.25),)*3
        cam=ns['mix'](single,overview,u(t,a,.55))
        if t>=b:cam=ns['mix'](overview,ns['CAM']['heavy'],gather)
        objects=[p['root'] for p in q['pairs']]+[P['heavy']['weight']];name='2列11組の手のひらと100kgから2tへ'
    else:
        weight=P['heavy']['weight'];_show(ns,_tree(weight),True)
        weight.location=(.30,-.08,.05);weight.scale=(1,)*3
        # Rejoin the existing S3 2t half without a second falling animation.
        cam=list(ns['CAM']['heavy']);objects=[weight];name='集まった2トンの重り'
    ns['set_camera'](cam)
    # Keep the 22-pair grid above the restored caption/speaker band, then
    # continuously rejoin the original camera shift as the 2t gather ends.
    ns['d'].CAM_D.shift_y=-.06+(-.097+.06)*u(t,a,.8)*(1-u(t,b,.8))
    anchors['countCenter']=Vector((.30,-.08,.04))
    roles['primary']=dict(name=name,objects=objects,minWidth=.55)
    roles['primary'].update(phase='gathering' if b<=t<done else 'arranging' if a<=t<b else 'single' if t<a else '2t',
                            transitional=a<=t<done)
    return cam

def _column(ns,q,t,roles,anchors):
    d=ns['d'];air=ns['P']['air'];person=ns['COR']['airhead'];scale=2.1
    person['root'].scale=(scale,)*3
    head=person['root'].location+(person['headtip']-person['root'].location)*scale
    bottom=.012;stack_stretch=1.60;a=ns['W']('air:weight','頭の上')
    for i,(layer,particles) in enumerate(zip(air['layers'],air['particles'])):
        visible=t>=a+.1*i
        for obj in [layer]+particles+air['edges'][i]:
            rest=person['layer_rest'][obj]
            obj.location=Vector((rest.x,rest.y,head.z+.001+(rest.z-bottom)*stack_stretch))
            # Boxes grow vertically, while gas particles stay spherical and
            # horizontal edge rods keep their real in-plane length.
            if obj is layer:obj.scale.z=ns['BASE'][obj][2].z*stack_stretch
            _show(ns,[obj],visible)
    _pose_arrow(ns,q['airArrow'],head+Vector((0,-.065,.025)),head+Vector((0,-.065,.003)),t>=a)
    # Fit a 70%-high COLUMN plus a >=10%-high person, not a 70% union.
    # The smaller person leaves the lower band; the raised aim preserves the
    # upper margin of the physically longer stack with original shift_y=-.06.
    cam=[.40,.15,.305,.52,-15,12,40];ns['set_camera'](cam)
    roles['primary']=dict(name='人の頭上から積もる空気の層',objects=air['layers']+person['primary'],minHeight=.70)
    roles['column']=dict(name='人を含めない空気の柱',objects=air['layers'],minHeight=.70,
                         transitional=t<a+.1*(len(air['layers'])-1))
    roles['person']=dict(name='空気の柱の下の人',objects=[person['root']],minHeight=.10)
    anchors['airHead']=head;anchors['lowestLayer']=head+Vector((0,0,.013))
    return cam

def _gin(ns,q,t,roles,anchors):
    W=ns['W'];a=W('gin:drum','巻き取られて');b=W('gin:drum','一方の桶')
    if t<a:return None
    wide=[-.460,.10,.23,.51,-12,35,40]
    mouth=[-.425,.10,.24,.50,-8,35,40]
    # Raising elevation compresses the vertical span without making the two
    # buckets narrower (zooming out alone would violate their 40% width).
    close=[-.355,.10,.223,.64,90,55,80]
    cam=ns['mix'](wide,mouth,ns['U'](t,a,.6))
    if t>=b:cam=ns['mix'](mouth,close,ns['U'](t,b,.6))
    ns['set_camera'](cam)
    gin=ns['EX']['gin'];_show(ns,q['pitWall'],True)
    for i,(bucket,water) in enumerate(gin['buckets']):
        water.active_material=q['waterMaterial'];_show(ns,[water],i==0)
    # Original motion/rope lengths stay intact; only the two water interiors
    # and background/camera change. The descending bucket is genuinely empty.
    roles['primary']=dict(name='馬と坑内の2つの桶' if t<b else '水入りと空の2つの桶',
        objects=gin['primary'] if t<b else [p[0] for p in gin['buckets']],
        minWidth=.60 if t<b else .40,verticalMargin=.10 if t>=b else None)
    for i,(bucket,water) in enumerate(gin['buckets']):anchors['ginBucket%d'%i]=bucket.location.copy()
    return cam

def _spoon(ns,q,t,roles,anchors):
    # Rotate/enlarge around the same actual water center, so S3's later
    # shrinking balloon still returns to that same spoon rather than jumping.
    pivot=Vector((-.01,-.245,.018));rot=Matrix.Rotation(math.pi,3,'Z');scale=1.0
    for obj,(p,r,s) in q['spoonOriginal'].items():
        obj.location=pivot+rot@((p+Vector((-.035,-.085,0)))-pivot)*scale
        obj.rotation_euler=r.copy();obj.rotation_euler.z+=math.pi;obj.scale=s*scale
    start=ns['W']('shrink:spoon','蒸気にすると')
    visible=t>=start and t<ns['W']('shrink:back','1700分の1')+.25
    _show(ns,q['steamLine'],visible)
    for i,obj in enumerate(q['steamDots']):obj.location=_path(q['steamPath'],((t-start)*.48+i/10)%1);_show(ns,[obj],visible)
    cam=[.025,-.215,.045,.65,-8,32,42]
    if ns['cue_at'](t)['key']=='shrink:back':
        # Keep the same spoon/balloon wide view until actual shrink onset.
        # The former C4 camera was composed for the old spoon orientation and
        # cut its handle at125s. Track only with the physical shrink, then end
        # on the actual same water center with the whole handle in the frame.
        back=ns['U'](t,ns['W']('shrink:back','1700分の1'),1.0)
        close=[-.050,-.245,.030,.34,-8,48,52]
        cam=[a+(b-a)*back for a,b in zip(cam,close)]
    ns['set_camera'](cam)
    roles['primary']=dict(name='左手前の大さじと右奥の風船',objects=q['spoon']+[ns['P']['balloon']['balloon']],minWidth=.60)
    roles['spoon']=dict(name='水を入れた大さじ',objects=q['spoon'],minWidth=.25,maxLogicalY=1580)
    anchors['spoonWater']=Vector((-.01,-.245,.025));anchors['balloonNeck']=Vector((.09,-.08,.035))
    return cam

def _hemi(ns,q,t,roles):
    p=ns['P']['hemi'];at=ns['W']('size:guericke','2つ合わせ')
    join=ns['U'](t,at,1.0);theta=math.radians(30)*max(0,t-ns['S']('size:guericke'))/10*(1-join)
    center=Vector(p['center']);axis=Matrix.Rotation(theta,3,'Z')
    for sign,obj in zip((-1,1),p['parts']):
        obj.location=center+axis@Vector((sign*.025*(1-join),0,0));obj.rotation_euler=(0,0,theta)
    _show(ns,[p['seam']],join>.995)
    roles['primary']=dict(name='ゆっくり回り合わさる2つの銅半球',objects=p['parts'],minWidth=.50)

def _horses(ns,q,t,roles):
    p=ns['P']['hemi'];center=Vector(p['center']);air=ns['W']('size:pull','空気を入れる')
    release=ns['U'](t,air,.6);hard=1-release
    # Eight horses are present from the first frame. Feet stay braced rather
    # than bobbing up and down while a straight rope claims a steady pull.
    for i,h in enumerate(p['horses']):
        sign=-1 if i<4 else 1;row,lane=(i%4)//2,(i%4)%2
        h['root'].scale=(1.02,)*3
        h['root'].location=center+Vector((sign*(.13+row*.068+.025*release),(-.017 if lane else .017),-.056))
        h['root'].rotation_euler=(0,-.15*hard,0 if sign>0 else math.pi)
        _show(ns,_tree(h['root']),True)
        for j,leg in enumerate(h['legs']):
            leg.rotation_euler.y=(-.11 if j<2 else .11)*hard
            leg.location.z=ns['BASE'][leg][0].z
    for i,obj in enumerate(p['ropes']):
        sign=-1 if i==0 else 1
        ns['ax'].set_rod(obj,center+Vector((sign*(.045+.08*release),0,0)),center+Vector((sign*(.10+.025*release),0,-.016)))
        _show(ns,[obj],True)
    cam=[.10,-.05,.06,.89,-8,35,40];ns['set_camera'](cam)
    roles['primary']=dict(name='8頭の馬と張った綱と銅の球',objects=[h['root'] for h in p['horses']]+p['parts']+p['ropes'],minWidth=.80,inFrame=True)
    return cam

def _last(ns,q,t,roles):
    p=ns['P']['mine'];u=ns['U'](t,ns['S']('last:can'),ns['NF']/ns['FPS']-ns['S']('last:can'))
    water=.255+.018*u
    p['shaft'].dimensions.z=water;p['shaft'].location.z=.02+water/2
    p['pool'].dimensions.z=water*.15;p['pool'].location.z=.023+p['pool'].dimensions.z/2
    p['marker'].location.z=.02+water
    for i,obj in enumerate(q['seep']):
        phase=(t*.37+i/12)%1;side=-1 if i%2 else 1
        obj.location=(-.355+side*.025*(1-phase),.033,.02+water+.014*(1-phase))
        _show(ns,[obj],True)
    # Preserve the opening/final camera pose exactly; no camera drift here.
    roles['primary']=dict(name='水が湧き続ける炭鉱の断面',objects=ns['G']['mine'],minWidth=.70)

def apply(ns,t):
    """Apply AFTER unmodified S3 geometry; return real objects/anchors/camera."""
    q=ns['S4_REVISIONS'];_show(ns,q['objects'],False)
    ns['P']['can']['can']['body'].active_material=q['canMaterial']
    cue=ns['cue_at'](t);k=cue['key'];roles={};anchors={};cam=None
    if k=='air:inside':cam=_inside(ns,q,t,roles,anchors)
    elif k=='size:2t':cam=_count(ns,q,t,roles,anchors)
    elif k=='air:weight':cam=_column(ns,q,t,roles,anchors)
    elif k=='gin:drum':cam=_gin(ns,q,t,roles,anchors)
    elif k in ('shrink:spoon','shrink:1700','shrink:back'):cam=_spoon(ns,q,t,roles,anchors)
    elif k=='size:guericke':_hemi(ns,q,t,roles)
    elif k=='size:pull':cam=_horses(ns,q,t,roles)
    elif k=='last:can':_last(ns,q,t,roles)
    elif k=='air:1kg':
        # Full weight appears at the actual word onset, not after a drop-in.
        one=ns['P']['weights']['one'];one.location=(.418,-.045,.0086)
        _show(ns,_tree(one),t>=ns['W']('air:1kg','1キログラム'))
    result=dict(active=bool(roles) or k=='air:1kg',time=t,cue=k,row=cue['row'],
                objects=q['objects'],roles=roles,anchors=anchors,camera=cam,
                geometryTimingSource='ns.W derived immutable actual-word map',
                visualPassNotAssumed=True)
    q['last']=result
    return result

def measure(ns,t,result=None):
    """Optional PROBE measurement of actual evaluated mesh vertices.

    No clipping to [0,1], no camera auto-fit, no invisible future objects, no
    primary/checker buffers altered. Parent performs production metadata.
    """
    result=result or ns['S4_REVISIONS']['last'];assert result and abs(t-result.get('time',t))<1e-7
    d=ns['d'];bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();out={}
    for role,spec in result['roles'].items():
        objects=list(dict.fromkeys(o for root in spec['objects'] for o in _tree(root)))
        points=[];front=True;meshes=0
        for obj in objects:
            if obj.type!='MESH' or obj.hide_render:continue
            evaluated=obj.evaluated_get(deps);mesh=evaluated.to_mesh()
            try:
                meshes+=1
                for v in mesh.vertices:
                    p=world_to_camera_view(d.SC,d.CAM,evaluated.matrix_world@v.co)
                    points.append((p.x,1-p.y));front=front and p.z>0
            finally:evaluated.to_mesh_clear()
        if not points:
            out[role]=dict(name=spec['name'],measured=False,reason='No visible actual mesh at this time');continue
        bounds=[min(p[0]for p in points),min(p[1]for p in points),max(p[0]for p in points),max(p[1]for p in points)]
        width=bounds[2]-bounds[0];height=bounds[3]-bounds[1]
        inside=0<=bounds[0]<=bounds[2]<=1 and 0<=bounds[1]<=bounds[3]<=1
        margin=spec.get('verticalMargin');checks={}
        if spec.get('minWidth') is not None:checks['width']=width>=spec['minWidth']
        if spec.get('minHeight') is not None:checks['height']=height>=spec['minHeight']
        if margin is not None:checks['verticalMargin']=bounds[1]>=margin and bounds[3]<=1-margin
        if spec.get('maxLogicalY') is not None:checks['captionSeparation']=bounds[3]*1920<=spec['maxLogicalY']
        out[role]=dict(name=spec['name'],measured=True,width=width,height=height,
            rawBounds01=bounds,rawBoundsLogical=[bounds[0]*1080,bounds[1]*1920,bounds[2]*1080,bounds[3]*1920],
            allVerticesInFront=front,inFrame=inside,selectedVisibleMeshes=meshes,
            checks=checks,passAllDeclared=inside and front and all(checks.values()),
            phase=spec.get('phase'),transitional=spec.get('transitional',False),
            method='Actual evaluated mesh vertices projected, unclipped; probe only')
    return dict(time=t,frame=round(t*ns['FPS']),camera=result['camera'],roles=out,automaticCameraFit=False)
