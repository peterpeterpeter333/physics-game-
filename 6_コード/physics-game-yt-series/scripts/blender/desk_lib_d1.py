"""D-1 desk models. All surfaces, bevels, room and light use immutable desk_lib."""
import math, random, os
import bpy
from mathutils import Vector
import desk_lib as d

def rod(name,a,b,r,m):
    a,b=Vector(a),Vector(b);o=d.cyl(name,r,(b-a).length,(a+b)/2,m,verts=16)
    o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler();return o

def arrow(name,a,b,width=.004):
    a,b=Vector(a),Vector(b);v=b-a;root=d.empty(name)
    edge=d.mat('d1_arrow_edge','#4a90c2',.4);white=d.mat('d1_arrow_white','#e8f4fb',.4,emit='#e8f4fb',strength=.3)
    for radius,material in [(width*1.2,edge),(width*.8,white)]:
        o=rod(name+'_stem',a,b-v.normalized()*width*3,radius,material);d.parent(o,root)
        bpy.ops.mesh.primitive_cone_add(vertices=24,radius1=radius*2.8,radius2=0,depth=width*6,location=b-v.normalized()*width*3)
        o=bpy.context.view_layer.objects.active;o.name=name+'_tip';o.rotation_euler=v.to_track_quat('Z','Y').to_euler();d.put(o,material);d.parent(o,root)
    return root

def horse(name,p,scale=1):
    p=Vector(p);root=d.empty(name,p);brown=d.mat('d1_horse_brown','#94603d',.55);black=d.mat('d1_horse_black','#27211c',.6)
    def sph(n,r,off,m,sc):
        o=d.sphere(name+n,r,p+Vector(off),m,scale=sc,seg_=20,ring=10);d.parent(o,root);return o
    sph('_body',.022,(0,0,.034),brown,(1.45,.57,.82));sph('_neck',.011,(.022,0,.049),brown,(.75,.8,1.45));sph('_head',.013,(.028,0,.062),brown,(1.2,.7,.65))
    sph('_mane',.004,(.015,0,.055),black,(.7,1,3));sph('_tail',.005,(-.030,0,.035),black,(.5,.7,2))
    legs=[]
    for x in [-.018,.018]:
        for y in [-.009,.009]:
            o=d.box(name+'_leg',(.006,.006,.026),p+Vector((x,y,.014)),brown,bevel=.002);d.parent(o,root);legs.append(o)
            o=d.box(name+'_hoof',(.008,.008,.005),p+Vector((x+.001,y,.003)),black,bevel=.001);d.parent(o,root)
    for y in [-.006,.006]:sph('_ear',.004,(.026,y,.072),brown,(.5,.5,1.5))
    root.scale=(scale,)*3
    return {'root':root,'legs':legs,'p':p}

def palm(name,p,size=.018):
    p=Vector(p);root=d.empty(name,p);m=d.mat('d1_palm','#f0c8a0',.6);edge=d.mat('d1_palm_edge','#6c503b',.65)
    def plate(n,dims,loc,bevel,rot=(0,0,0)):
        backing=d.box(name+n+'_edge',(dims[0]+size*.045,dims[1]+size*.045,.0007),loc+Vector((0,0,-.0005)),edge,bevel=bevel,rot=rot);d.parent(backing,root)
        o=d.box(name+n,dims,loc,m,bevel=bevel,rot=rot);d.parent(o,root)
    plate('_palm',(size*.65,size*.61,.001),p,size*.12)
    for i in range(4):
        h=size*(.40 if i in [1,2] else .31);plate('_finger',(size*.12,h,.001),p+Vector(((i-1.5)*size*.16,size*.36+h*.15,0)),size*.055)
    plate('_thumb',(size*.17,size*.42,.001),p+Vector((size*.42,-size*.04,0)),size*.07,(0,0,-.55))
    return root

def weight_bands(name,weight,width,depth,height,material):
    """Cast teaching weights: two reinforcing bands, rivets and a lifting eye."""
    p=weight.location.copy()
    for z in [-height*.30,height*.30]:
        for sign in [-1,1]:
            o=d.box(name+'_band_front',(width*.90,.0016,.003),p+Vector((0,sign*(depth/2+.0005),z)),material,bevel=.0007);d.parent(o,weight)
            o=d.box(name+'_band_side',(.0016,depth*.90,.003),p+Vector((sign*(width/2+.0005),0,z)),material,bevel=.0007);d.parent(o,weight)
        for x in [-width*.35,width*.35]:
            o=d.sphere(name+'_rivet',.0018,p+Vector((x,-depth/2-.0012,z)),material,scale=(1,.4,1),seg_=12,ring=6);d.parent(o,weight)
    o=d.torus(name+'_lifting_eye',width*.12,.002,p+Vector((0,0,height/2+.006)),material,rot=(math.pi/2,0,0));d.parent(o,weight)

def shell(name,p,r,h,m,transparent=False):
    p=Vector(p);verts=[];faces=[];n=48
    # Front 100 degrees are open, so the piston and condensation remain visible.
    for z in [0,h]:
        for i in range(n+1):
            a=math.radians(-40+260*i/n);verts.append(tuple(p+Vector((r*math.cos(a),r*math.sin(a),z))))
    for i in range(n):faces.append((i,i+1,n+2+i,n+1+i))
    me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);o=d.link(bpy.data.objects.new(name,me));d.put(o,m)
    solid=o.modifiers.new('rounded_shell','SOLIDIFY');solid.thickness=.0012
    for z in [0,h]:d.torus(name+'_rim',r,.0015,p+Vector((0,0,z)),d.mat('d1_rim','#d5b763',.32,metal=.8))
    return o

def engine(name='d1_engine',ground=.32,cylx=-.065,cy=.10,pivotx=-.21):
    before=set(bpy.data.objects);r=.03
    brass=d.mat(name+'_brass','#c9a44e',.35,metal=.65);brick=d.mat('d1_brick','#a0522d',.65);grey=d.mat('d1_iron','#6a6b69',.36,metal=.65)
    wood=d.wood('d1_enginewood','#8a5a32','#6f4526');boilerp=Vector((cylx,cy,ground+.025))
    boiler=d.cyl(name+'_boiler',.045,.05,boilerp,brick)
    for z in [ground+.008,ground+.025,ground+.043]:d.torus(name+'_mortar',.045,.001,(cylx,cy,z),d.mat('d1_mortar','#d9b28d',.7))
    flame=d.sphere(name+'_fire',.013,(cylx,cy-.035,ground+.012),d.mat('d1_fire','#ffb34d',.5,emit='#ff872b',strength=3),scale=(1,.7,1.1))
    bottom=ground+.056;top=bottom+.08
    cylshell=shell(name+'_cylinder',(cylx,cy,bottom),r,.08,brass)
    d.cyl(name+'_floor',r,.004,(cylx,cy,bottom),grey)
    piston=d.cyl(name+'_piston',r*.88,.005,(cylx,cy,bottom+.02),grey)
    pistonrod=rod(name+'_pistonrod',(cylx,cy,top),(cylx,cy,ground+.25),.0025,grey)
    pivot=Vector((pivotx,cy,ground+.22));d.box(name+'_pier',(.034,.045,.18),(pivotx,cy,ground+.09),brick,bevel=.002)
    d.cyl(name+'_axle',.012,.06,pivot,grey,rot=(math.pi/2,0,0))
    beamroot=d.empty(name+'_beamroot',pivot);beam=d.box(name+'_beam',(.30,.018,.018),pivot,wood,bevel=.003);d.parent(beam,beamroot)
    rodob=d.box(name+'_mine_rod',(.006,.006,.44),(pivotx-.145,cy,ground+.005),wood,bevel=.001)
    pump=d.cyl(name+'_bottompump',.014,.05,(pivotx-.145,cy,.045),grey)
    pipe=rod(name+'_outlet',(pivotx-.12,cy-.02,.04),(pivotx-.12,cy-.02,ground+.04),.004,grey)
    rod(name+'_spout',(pivotx-.12,cy-.02,ground+.04),(pivotx-.07,cy-.02,ground+.04),.004,grey)
    steam=d.sphere(name+'_steam',.025,(cylx,cy,bottom+.025),d.mat('d1_steam','#f4f4f2',.9,alpha=.32),scale=(1,1,1.1),seg_=20,ring=10)
    blue=d.mat('d1_cold','#6fb3e0',.5,alpha=.6)
    condensate=d.cyl(name+'_condensate',.027,.0015,(cylx,cy,bottom+.003),blue)
    spray=[d.sphere(name+'_cold_%d'%i,.002,(cylx,cy,bottom+.01),blue,seg_=12,ring=6) for i in range(12)]
    rod(name+'_inlet',(cylx+.065,cy,bottom+.03),(cylx+r,cy,bottom+.03),.003,grey)
    water=[d.sphere(name+'_outwater%d'%i,.004,(0,0,-5),d.mat('d1_water','#3f7fb0',.4,alpha=.6),seg_=12,ring=6) for i in range(10)]
    push=arrow(name+'_push',(cylx,cy-.01,top+.073),(cylx,cy-.01,top+.025),.003)
    balance=arrow(name+'_inside',(cylx,cy-.025,bottom+.014),(cylx,cy-.025,bottom+.060),.003)
    trace=rod(name+'_trace',(pivotx-.145,cy-.006,.06),(pivotx-.145,cy-.006,ground+.22),.002,d.mat('d1_trace_yellow','#ffd23f',.45,emit='#ffd23f',strength=.4))
    return {'objects':list(set(bpy.data.objects)-before),'boiler':boiler,'shell':cylshell,'piston':piston,'rod':pistonrod,'beam':beamroot,'mineRod':rodob,'pump':pump,'steam':steam,'spray':spray,'water':water,'push':push,'balance':balance,'condensate':condensate,'trace':trace,'bottom':bottom,'top':top,'cylx':cylx,'cy':cy,'pivot':pivot,'flame':flame}

def can_model(name,p,glass=False):
    p=Vector(p);root=d.empty(name,p)
    silver=d.mat(name+'_glass' if glass else name+'_silver','#b5d3e0' if glass else '#c7cdd0',.25 if glass else .28,metal=.05 if glass else .8,alpha=.15 if glass else 1)
    rim_material=d.mat('d1_can_rims','#c7cdd0',.28,metal=.8)
    n=64;rings=13;verts=[];faces=[]
    for j in range(rings):
        for i in range(n):
            a=2*math.pi*i/n;verts.append((.03*math.cos(a),.03*math.sin(a),.08*j/(rings-1)-.04))
    for j in range(rings-1):
        for i in range(n):
            k=j*n+i;faces.append((k,j*n+(i+1)%n,(j+1)*n+(i+1)%n,k+n))
    me=bpy.data.meshes.new(name+'_mesh');me.from_pydata(verts,[],faces);body=d.link(bpy.data.objects.new(name+'_body',me));body.location=p;d.put(body,silver);d.parent(body,root)
    body.shape_key_add(name='Basis');crush=body.shape_key_add(name='Crushed')
    for v in crush.data:
        x,y,z=v.co;a=math.atan2(y,x);u=(z+.04)/.08
        f=1-.68*math.sin(math.pi*u)**.7*(.65+.35*math.cos(4*a)**2);wr=.002*math.sin(13*a+u*4)*math.sin(math.pi*u)
        v.co=(x*f+wr,y*f+wr,z*.75+.004*math.sin(a*4)*math.sin(math.pi*u))
    for face in me.polygons:face.use_smooth=True
    parts=[]
    for z in [-.04,.04]:parts.append(d.torus(name+'_rim',.0295,.0016,p+Vector((0,0,z)),rim_material))
    parts.append(d.cyl(name+'_base',.029,.001,p+Vector((0,0,-.04)),rim_material))
    for o in parts:d.parent(o,root)
    can={'root':root,'body':body,'crush':crush,'p':p,'rim':parts}
    return attach_can_printed_label(can) if not glass else can

def attach_can_printed_label(can):
    """N4's red band is paint on the can, never a separate constricting hoop.

    Assign the middle two rings of the existing metal body to the existing red
    material. They are the same surface and existing shape key as the metal,
    with zero independent thickness, objects, or deformation approximations.
    On a preserved GUI scene the old torus is retained but never shown again.
    """
    if can.get('printed_label'):return can
    red=d.mat('d1_can_red','#c85042',.45);mesh=can['body'].data
    assert len(mesh.polygons)==64*12
    index=next((i for i,m in enumerate(mesh.materials) if m is red),None)
    if index is None:index=len(mesh.materials);mesh.materials.append(red)
    for face in mesh.polygons:face.material_index=index if face.index//64 in [5,6] else 0
    old=[o for o in can['rim'] if '_redband' in o.name]
    can['obsolete_label_meshes']=old;can['rim']=[o for o in can['rim'] if o not in old];can['printed_label']=True
    for o in old:d.show(o,False)
    mesh.update()
    return can

def build(data,cache):
    d.catalog_stage();P={};G={}
    def group(name,fn):
        before=set(bpy.data.objects);P[name]=fn();G[name]=list(set(bpy.data.objects)-before)
    water=d.mat('d1_water','#3f7fb0',.4,alpha=.60);dark=d.mat('d1_dark','#211f1b',.7);grey=d.mat('d1_rock','#727274',.8)
    wood=d.wood('d1_wood','#9a6234','#7b4a24');white=d.mat('d1_cream','#f4e8cc',.65);blue=d.mat('d1_cold','#6fb3e0',.5,alpha=.6)
    def mine():
        x,y=-.20,.10
        base=d.box('d1_mine_base',(.43,.16,.018),(x,y,.009),wood,bevel=.004)
        for z,h,col in [(.043,.065,'#8f724f'),(.105,.06,'#53545a'),(.155,.035,'#252629'),(.204,.063,'#727274'),(.250,.023,'#252629'),(.284,.047,'#9a6d45'),(.315,.01,'#73934b')]:
            m=d.mat('d1_soil'+col,col,.8)
            # .04 m vertical shaft centered x=-.355; opening connects to horizontal gallery.
            for a,b in [(-.40,-.377),(-.333,0)]:d.box('d1_stratum',(b-a,.12,h),((a+b)/2,y,z),m,bevel=.001)
        # The exposed rock is a physical cut surface, not a featureless diagram.
        # Small coal inclusions and irregular bedding cracks also make its depth
        # and scale readable when the whole mine is in the camera.
        rng=random.Random(71);crack=d.mat('d1_rock_crack','#34383b',.8)
        for row,z in enumerate([.181,.191,.202,.214,.226]):
            xs=[-.330+i*.041 for i in range(9)];zs=[z+rng.uniform(-.0025,.0025) for _ in xs]
            for i in range(8):rod('d1_bedding_%d_%d'%(row,i),(xs[i],.038,zs[i]),(xs[i+1],.038,zs[i+1]),.0011,crack)
        stone=d.mat('d1_mine_inclusions','#292c30',.8)
        for row,z in enumerate([.075,.110,.286]):
            for i in range(15):
                x=-.322+i*.022+rng.uniform(-.006,.006)
                d.sphere('d1_inclusion_%d_%d'%(row,i),rng.uniform(.003,.005),(x,.038,z+rng.uniform(-.009,.009)),stone,scale=(1.4,.23,.6),seg_=10,ring=5)
        gallery=d.box('d1_gallery',(.23,.121,.034),(-.22,y,.038),d.mat('d1_gallery_ink','#211f1b',.7),bevel=.002)
        d.box('d1_gallery_roof',(.23,.01,.006),(-.22,y-.065,.057),wood,bevel=.001)
        for a in [-.32,-.25,-.18,-.11]:d.box('d1_pitprop',(.004,.006,.035),(a,y-.065,.039),wood,bevel=.001)
        pool=d.box('d1_pool',(.23,.123,.015),(-.22,y-.002,.027),water,bevel=.002)
        shaftwater=d.box('d1_shaftwater',(.040,.12,.08),(-.355,y,.06),water,bevel=.001)
        d.box('d1_gauge',(.006,.004,.24),(-.315,y-.067,.15),white,bevel=.001)
        for i in range(13):d.box('d1_gauge_tick',(.015,.004,.0015),(-.31,y-.070,.03+i*.019),dark)
        hut=d.box('d1_hut',(.055,.045,.04),(-.22,y+.015,.34),wood,bevel=.003)
        for sign in [-1,1]:d.box('d1_hut_roof',(.035,.06,.004),(-.22+sign*.015,y+.015,.368),d.mat('d1_hutroof','#855641',.65),bevel=.001,rot=(0,sign*.45,0))
        drops=[d.sphere('d1_seep%d'%i,.003,(0,0,-5),water,seg_=12,ring=6) for i in range(16)]
        marker=d.box('d1_watermarker',(.021,.008,.005),(-.315,y-.074,.10),d.mat('d1_yellow','#ffd23f',.4,emit='#ffd23f',strength=.4),bevel=.001)
        return {'pool':pool,'shaft':shaftwater,'drops':drops,'marker':marker,'gallery':gallery}
    group('mine',mine)
    def horsewinch():
        p=Vector((-.30,.10,.32));c=d.cyl('d1_winch',.009,.06,p+Vector((0,0,.03)),wood)
        arm=d.empty('d1_winch_arm',p+Vector((0,0,.04)));a=d.box('d1_winch_lever',(.10,.005,.005),p+Vector((.04,0,.04)),wood,bevel=.001);d.parent(a,arm)
        h=horse('d1_winch_horse',p+Vector((.08,0,0)),.7)
        sweat=[d.sphere('d1_horse_sweat%d'%i,.0016,(0,0,-5),blue,seg_=10,ring=5) for i in range(4)]
        bucket=d.cyl('d1_bucket',.012,.023,(-.355,.10,.15),wood);rope=rod('d1_bucket_rope',(-.355,.10,.16),(-.355,.10,.39),.0015,dark)
        return {'arm':arm,'horse':h,'bucket':bucket,'rope':rope,'sweat':sweat}
    group('horse',horsewinch)
    group('engine',lambda:engine())
    # Existing score board shape and hands, with this episode's names only.
    G['score']=[d.board_h]+list(d.board_h.children);P['score']=d.board_h
    d.board_h.location=(.58,.30,0)
    labels=[o for o in d.board_h.children if o.type=='FONT' and o.name.startswith('bl')]
    for o,s in zip(sorted(labels,key=lambda o:o.location.x),['水','人']):o.data.body=s
    def spoonballoon():
        p=Vector((.05,-.16,0));silver=d.mat('d1_spoon_silver','#c5ced3',.22,metal=.8)
        d.sphere('d1_spoon_bowl',.023,p+Vector((-.025,0,.018)),silver,scale=(1,.66,.18));d.box('d1_spoon_handle',(.070,.008,.003),p+Vector((.023,0,.019)),silver,bevel=.003)
        liquid=d.sphere('d1_spoonwater',.019,p+Vector((-.025,0,.022)),water,scale=(1,.64,.08))
        balloon=d.sphere('d1_balloon',1,p+Vector((0,0,.15)),d.mat('d1_balloon_glass','#f4f4f2',.3,alpha=.25),seg_=48,ring=24)
        neck=d.cyl('d1_balloon_neck',.008,.025,p+Vector((0,0,.035)),white)
        mist=[d.sphere('d1_spoonmist%d'%i,.003,p+Vector((0,0,.04)),d.mat('d1_steam','#f4f4f2',.9,alpha=.32),scale=(1,1,2),seg_=12,ring=6) for i in range(8)]
        return {'balloon':balloon,'liquid':liquid,'mist':mist,'neck':neck}
    group('balloon',spoonballoon)
    def experiment():
        p=Vector((.19,-.12,0));d.box('d1_stove',(.075,.075,.017),p+Vector((-.045,0,.0085)),dark,bevel=.005)
        d.torus('d1_flame_ring',.024,.003,p+Vector((-.045,0,.020)),d.mat('d1_flame_blue','#5aa2d6',.5,emit='#6fb3e0',strength=2))
        dish=d.cyl('d1_waterdish',.07,.008,(.265,-.12,.005),white);d.cyl('d1_dishwater',.064,.003,(.265,-.12,.010),water)
        can=can_model('d1_can',(.145,-.12,.062));mist=[d.sphere('d1_canm_%d'%i,.003,(.145,-.12,.12),white,scale=(1,1,3),seg_=12,ring=6) for i in range(3)]
        arrows=[]
        for i in range(12):
            a=2*math.pi*i/12;v=Vector((math.cos(a),math.sin(a),0));c=Vector((.265,-.12,.048));arrows.append(arrow('d1_airpush%d'%i,c+v*.085,c+v*.037,.0027))
        tongs=d.empty('d1_tongs');
        for y in [-.013,.013]:o=d.box('d1_tong',(.11,.005,.005),(.19,-.12+y,.08),wood,bevel=.002);d.parent(o,tongs)
        return {'can':can,'mist':mist,'arrows':arrows,'tongs':tongs}
    group('can',experiment)
    def straw():
        p=Vector((.40,-.10,0));glass=d.mat('d1_cup_glass','#e4f3f5',.25,alpha=.25)
        shell('d1_cup',p,.032,.10,glass);juice=d.cyl('d1_juice',.029,.055,p+Vector((0,0,.030)),d.mat('d1_orange','#e9a14c',.5))
        rod('d1_straw',p+Vector((.009,0,.012)),p+Vector((.009,0,.13)),.003,white);rod('d1_straw_bend',p+Vector((.009,0,.13)),p+Vector((.034,0,.145)),.003,white)
        for i in range(9):d.torus('d1_strawstripe',.0031,.0008,p+Vector((.009,0,.015+i*.012)),d.mat('d1_strawred','#c85042',.5))
        bubbles=[d.sphere('d1_strawair%d'%i,.0022,p+Vector((.009,-.003,.02+i*.01)),white,seg_=12,ring=6) for i in range(10)]
        rising=d.cyl('d1_strawjuice',.0025,.06,p+Vector((.009,-.003,.04)),d.mat('d1_orange','#e9a14c',.5))
        arrows=[arrow('d1_cuppush%d'%i,p+Vector((-.02+i*.02,-.015,.125)),p+Vector((-.02+i*.02,-.015,.065)),.002) for i in range(3)]
        return {'bubbles':bubbles,'juice':rising,'arrows':arrows}
    group('straw',straw)
    def air_layers(name,p,counts):
        p=Vector(p);ground=d.box(name+'_ground',(.12,.12,.008),p+Vector((0,0,.004)),d.mat('d1_grass','#73934b',.65),bevel=.003)
        layers=[];particles=[];edges=[];rng=random.Random(19)
        for j,n in enumerate(counts):
            m=d.mat(name+'_layer%d'%j,'#6fb3e0',.8,alpha=.19*(1-j*.065));o=d.box(name+'_layer%d'%j,(.10,.10,.024),p+Vector((0,0,.024+j*.025)),m,bevel=.002);layers.append(o)
            # Each clear acrylic slice has a narrow blue physical edge. This
            # makes the layer boundary readable without inventing extra air.
            mm=d.mat('d1_acrylic_edge','#7da9bc',.5,alpha=.75);ee=[]
            for sign in [-1,1]:
                ee.append(rod(name+'_edge_x',p+Vector((-.05,sign*.05,.012+j*.025)),p+Vector((.05,sign*.05,.012+j*.025)),.0006,mm))
                ee.append(rod(name+'_edge_y',p+Vector((sign*.05,-.05,.012+j*.025)),p+Vector((sign*.05,.05,.012+j*.025)),.0006,mm))
            edges.append(ee)
            pp=[]
            for i in range(n):pp.append(d.sphere(name+'_particle%d_%d'%(j,i),.0015,p+Vector((rng.uniform(-.045,.045),rng.uniform(-.045,.045),.014+j*.025+rng.random()*.019)),white,seg_=8,ring=4))
            particles.append(pp)
        return {'ground':ground,'layers':layers,'particles':particles,'edges':edges}
    group('air',lambda:air_layers('d1_airlayers',(.40,.15,0),data['layerCounts']))
    def weights():
        palmroot=palm('d1_palm100',(.34,-.04,.008),.075)
        d.box('d1_squarecm',(.01,.01,.002),(.24,-.04,.002),white,bevel=.001)
        w1=d.box('d1_weight1',(.018,.018,.020),(.24,-.04,.013),dark,bevel=.003)
        w100=d.box('d1_weight100',(.070,.055,.055),(.34,-.04,.037),dark,bevel=.005)
        weight_bands('d1_100kg',w100,.070,.055,.055,d.mat('d1_weight_steel','#6a6b69',.36,metal=.65))
        for ob,txt,sz in [(w1,'1kg',.009),(w100,'100kg',.015)]:
            label=d.text('d1_weightlabel',txt,sz,white,ob.location+Vector((0,-ob.dimensions.y/2-.001,0)),rot=(math.pi/2,0,0));d.parent(label,ob)
        up=arrow('d1_palm_inside',(.34,-.075,.006),(.34,-.075,.066),.003)
        down=arrow('d1_palm_outside',(.34,-.075,.130),(.34,-.075,.070),.003)
        return {'palm':palmroot,'one':w1,'hundred':w100,'up':up,'down':down}
    group('weights',weights)
    def twins():
        cans=[can_model('d1_transparent%d'%j,(.17+j*.10,-.12,.05),True) for j in range(2)];particles=[]
        rng=random.Random(4)
        for j in range(2):particles.append([d.sphere('d1_gas%d_%d'%(j,i),.003,(.17+j*.1+rng.uniform(-.02,.02),-.12+rng.uniform(-.02,.02),.025+rng.random()*.055),white,seg_=12,ring=6) for i in range(20)])
        rain=[d.sphere('d1_rain%d'%i,.003,(.14+(i%10)*.02,-.13,.15),blue,seg_=12,ring=6) for i in range(20)]
        return {'cans':cans,'particles':particles,'rain':rain}
    group('twocans',twins)
    def cylinders():
        roots=[];arrows=[]
        for j,r in enumerate([.015,.045]):
            p=(.14+j*.10,-.08,.02);shell('d1_thickness%d'%j,p,r,.08,d.mat('d1_brass','#c9a44e',.35,metal=.65));d.cyl('d1_topdisc%d'%j,r,.004,(p[0],p[1],.102),white)
            ar=[];n=[data['numbers']['arrowsThin'],data['numbers']['arrowsWide']][j]
            for i in range(n):
                a=2*math.pi*i/n;rr=r*.65;ar.append(arrow('d1_thickpush%d_%d'%(j,i),(p[0]+rr*math.cos(a),p[1]+rr*math.sin(a),.16),(p[0]+rr*math.cos(a),p[1]+rr*math.sin(a),.11),.0015))
            arrows.append(ar)
        return {'arrows':arrows}
    group('twins',cylinders)
    def area():
        p=Vector((.19,-.08,.08));d.cyl('d1_area_disc',.03,.016,p,d.mat('d1_area_brass','#a88b54',.50,metal=.30),verts=96)
        rim=d.mat('d1_piston_rim','#6a6b69',.36,metal=.65)
        for z in [-.006,-.002,.002]:d.torus('d1_area_piston_ring',.0302,.00065,p+Vector((0,0,z)),rim)
        d.torus('d1_area_measured_edge',.0292,.0005,p+Vector((0,0,.0083)),rim)
        # A real circumference scale belongs to the 53 cm measurement model;
        # keep the hand-counting area entirely clear inside its outer annulus.
        for i in range(60):
            a=2*math.pi*i/60;rr=.027 if i%5==0 else .028
            rod('d1_area_angular_tick',p+Vector((rr*math.cos(a),rr*math.sin(a),.0085)),p+Vector((.0295*math.cos(a),.0295*math.sin(a),.0085)),.00025,rim)
        hands=[palm('d1_area_palm%d'%i,p+Vector((x,y,.010)),.0068) for i,(x,y) in enumerate(data['palmPositions'])]
        diameter=rod('d1_diameter',p+Vector((-.03,0,.012)),p+Vector((.03,0,.012)),.0008,white)
        radius=rod('d1_radius',p+Vector((0,0,.013)),p+Vector((.03,0,.013)),.001,d.mat('d1_yellow','#ffd23f',.4))
        return {'palms':hands,'diameter':diameter,'radius':radius}
    group('area',area)
    def heavy():
        weight=d.box('d1_weight2t',(.10,.10,.10),(.30,-.08,.05),dark,bevel=.009)
        weight_bands('d1_2t',weight,.10,.10,.10,d.mat('d1_weight_steel','#6a6b69',.36,metal=.65))
        label=d.text('d1_2t','2t',.044,white,(.30,-.131,.058),rot=(math.pi/2,0,0));d.parent(label,weight)
        horses=[horse('d1_weight_horse%d'%i,(.10+i*.065,-.18,0),.70) for i in range(4)]
        return {'weight':weight,'horses':horses}
    group('heavy',heavy)
    def hemispheres():
        copper=d.mat('d1_copper','#b87333',.32,metal=.8);parts=[];center=Vector((.10,-.05,.056))
        for sign in [-1,1]:
            verts=[];faces=[];n,m=48,16
            for j in range(m+1):
                th=(math.pi/2)*j/m
                for i in range(n):
                    a=2*math.pi*i/n;verts.append((sign*.05*math.cos(th),.05*math.sin(th)*math.cos(a),.05*math.sin(th)*math.sin(a)))
            for j in range(m):
                for i in range(n):k=j*n+i;faces.append((k,j*n+(i+1)%n,(j+1)*n+(i+1)%n,k+n))
            me=bpy.data.meshes.new('d1_hemimesh');me.from_pydata(verts,[],faces);o=d.link(bpy.data.objects.new('d1_hemisphere',me));o.location=center;d.put(o,copper)
            for f in me.polygons:f.use_smooth=True
            parts.append(o)
        seam=d.torus('d1_hemi_seam',.05,.002,center,copper,rot=(0,math.pi/2,0))
        valve=d.box('d1_valve',(.027,.005,.006),center+Vector((0,0,.063)),copper,bevel=.002)
        valvepipe=rod('d1_valvepipe',center+Vector((0,0,.04)),center+Vector((0,0,.064)),.003,copper)
        horses=[];ropes=[]
        for sign in [-1,1]:
            for i in range(4):
                h=horse('d1_pullhorse%d_%d'%(sign,i),center+Vector((sign*(.12+i*.057),0,-.056)),.60);h['root'].rotation_euler.z=0 if sign>0 else math.pi;horses.append(h)
            ropes.append(rod('d1_pullrope',center+Vector((sign*.045,0,0)),center+Vector((sign*.32,0,-.025)),.0018,wood))
        gas=[d.sphere('d1_valvegas%d'%i,.003,center+Vector((0,0,.07)),white,seg_=10,ring=6) for i in range(10)]
        return {'parts':parts,'seam':seam,'valve':valve,'valvepipe':valvepipe,'horses':horses,'ropes':ropes,'gas':gas,'center':center}
    group('hemi',hemispheres)
    def europe():
        p=Vector((.20,.38,.15));frame=d.box('d1_mapboard',(.42,.015,.30),p,wood,bevel=.004)
        tex=d.plane('d1_europetex',.40,.28,p+Vector((0,-.009,0)),d.imgmat('d1_map',os.path.join(cache,'blender','tex','d1-europe.png')));tex.rotation_euler.x=math.pi/2
        stamps=[]
        for i in range(30):
            x=-.15+(i%6)*.046;y=.082-(i//6)*.032
            if i<12:x=-.13+(i%3)*.012;y=.085-(i//3)*.018
            c=p+Vector((x,-.012,y));root=d.empty('d1_mapstamp%d'%i,c)
            for o in [d.box('d1_stampcyl',(.007,.002,.010),c,dark,bevel=.001),d.box('d1_stampbeam',(.018,.002,.003),c+Vector((0,0,.007)),dark,bevel=.0005)]:d.parent(o,root)
            stamps.append(root)
        return {'stamps':stamps}
    group('map',europe)
    def coal():
        rng=random.Random(52);pieces=[]
        for i in range(40):
            a=rng.random()*6.28;r=.05*math.sqrt(rng.random());z=.33+.05*(1-r/.055)*rng.random()
            pieces.append(d.sphere('d1_coal%d'%i,rng.uniform(.008,.014),(.025+r*math.cos(a),.10+r*math.sin(a),z),d.mat('d1_coalgloss','#292929',.25),scale=(1,.8,.7),seg_=10,ring=6))
        return {'pieces':pieces}
    group('coal',coal)
    def fuji():
        c=Vector((.33,.05,0));bpy.ops.mesh.primitive_cone_add(vertices=64,radius1=.14,radius2=.018,depth=.15,location=c+Vector((0,0,.075)))
        mount=bpy.context.view_layer.objects.active;mount.name='d1_fuji';d.put(mount,d.mat('d1_mountain','#718798',.7))
        bpy.ops.mesh.primitive_cone_add(vertices=64,radius1=.055,radius2=.019,depth=.043,location=c+Vector((0,0,.129)))
        d.put(bpy.context.view_layer.objects.active,white)
        low=air_layers('d1_fuji_low',(.14,.05,0),data['layerCounts']);high=air_layers('d1_fuji_high',(.33,.05,.15),data['fujiCounts'])
        # Scale the columns down to keep the mountain and both model engines legible.
        for group_,base in [(low,Vector((.14,.05,0))),(high,Vector((.33,.05,.15)))]:
            for o in [group_['ground']]+group_['layers']+sum(group_['particles'],[])+sum(group_['edges'],[]):o.location=base+(o.location-base)*.44;o.scale*=.44
        engines=[]
        for name,p in [('d1_fuji_base',(.14,-.025,.01)),('d1_fuji_top',(.33,.015,.16))]:
            r=d.empty(name);g=engine(name,0,0,0,-.12)
            for o in g['objects']:
                if not o.parent:d.parent(o,r)
            r.scale=(.4,)*3;r.location=p;engines.append((r,g))
        answers=[arrow('d1_fuji_answer0',(.14,-.025,.145),(.14,-.025,.095),.002),arrow('d1_fuji_answer1',(.33,.015,.295),(.33,.015,.295-.05*data['numbers']['fujiRatio']),.002)]
        return {'low':low,'high':high,'engines':engines,'answers':answers}
    group('fuji',fuji)
    # Blender 3.6 uses blend_method rather than the new surface_render_method.
    # Keep this compatibility setting limited to these episode-owned materials.
    for material in d.MATS.values():
        if material.name.startswith('d1_') and d.principled(material).inputs['Alpha'].default_value<1:
            if hasattr(material,'blend_method'):material.blend_method='HASHED';material.use_screen_refraction=True
    for objs in G.values():
        for o in objs:d.show(o,False)
    return P,G
