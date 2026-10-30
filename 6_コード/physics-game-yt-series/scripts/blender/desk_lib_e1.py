"""E-1 model factories. Reuses the immutable reference room, materials and hands."""
import math,os
import bpy
from mathutils import Vector,Matrix
import desk_lib as d
PI=math.pi
GOLD='#ffd23f'; LAT='#6fb3e0'; LON='#f0a040'
_ATTACHED={};_SCENE_CHILDREN=None
def root(name):return d.empty('e1_'+name)
def attach(o,r):
    old=o.parent
    if old in _ATTACHED and o in _ATTACHED[old]:_ATTACHED[old].remove(o)
    o.parent=r;o.matrix_parent_inverse=Matrix.Identity(4);_ATTACHED.setdefault(r,[]).append(o);return o
def configure_children(objects):
    global _SCENE_CHILDREN
    _SCENE_CHILDREN={o:[] for o in objects}
    for o in objects:
        if o.parent in _SCENE_CHILDREN:_SCENE_CHILDREN[o.parent].append(o)
def children_of(o):return (_SCENE_CHILDREN if _SCENE_CHILDREN is not None else _ATTACHED).get(o,())
def descendants(r):
    out=[];stack=[r]
    while stack:
        o=stack.pop();out.append(o);stack.extend(children_of(o))
    return out
def box(name,size,loc,m,r,bevel=.002,rot=(0,0,0)):return attach(d.box('e1_'+name,size,loc,m,bevel,rot),r)
def cyl(name,rad,depth,loc,m,r,rot=(0,0,0),verts=48):return attach(d.cyl('e1_'+name,rad,depth,loc,m,rot,verts),r)
def ball(name,rad,loc,m,r,scale=(1,1,1)):return attach(d.sphere('e1_'+name,rad,loc,m,scale),r)
def line(name,points,radius,material,r,closed=False):
    cu=bpy.data.curves.new('e1_'+name,'CURVE');cu.dimensions='3D';cu.resolution_u=1;cu.bevel_depth=radius;cu.bevel_resolution=2
    sp=cu.splines.new('POLY');sp.points.add(len(points)-1)
    for p,v in zip(sp.points,points):p.co=(*v,1)
    sp.use_cyclic_u=closed;o=d.link(bpy.data.objects.new('e1_'+name,cu));cu.materials.append(material);return attach(o,r)
def mesh(name,vs,fs,material,r):
    me=bpy.data.meshes.new('e1_'+name);me.from_pydata(vs,[],fs);me.update();o=d.link(bpy.data.objects.new('e1_'+name,me));d.put(o,material);return attach(o,r)
def ring(name,radius,loc,material,r,dashed=False):
    parts=[]
    for j in range(18 if dashed else 1):
        aa=2*PI*j/18 if dashed else 0;bb=aa+2*PI/18*.58 if dashed else 2*PI
        pts=[(loc[0]+radius*math.cos(aa+(bb-aa)*i/64),loc[1]+radius*math.sin(aa+(bb-aa)*i/64),loc[2]) for i in range(65)]
        parts.append(line(name+str(j),pts,.0015,material,r))
    return parts
def arrow(name,a,b,material,r,width=.002):
    a=Vector(a);b=Vector(b);dv=(b-a).normalized();side=Vector((-dv.y,dv.x,0))*.008
    o=line(name,[a,b],width,material,r);tip=mesh(name+'tip',[b,b-dv*.016+side,b-dv*.016-side],[(0,1,2)],material,r)
    return [o,tip]
def opacity_material(m):
    """Per-object fade, without changing another model using the same material."""
    nt=m.node_tree
    if nt.nodes.get('e1_object_opacity'):return
    p=d.principled(m);info=nt.nodes.new('ShaderNodeObjectInfo');info.name='e1_object_opacity'
    mul=nt.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY'
    if p.inputs['Alpha'].is_linked:nt.links.new(p.inputs['Alpha'].links[0].from_socket,mul.inputs[0])
    else:mul.inputs[0].default_value=p.inputs['Alpha'].default_value
    nt.links.new(info.outputs['Alpha'],mul.inputs[1]);nt.links.new(mul.outputs[0],p.inputs['Alpha'])
    try:m.surface_render_method='BLENDED'
    except Exception:pass
def opacity(r,alpha):
    r.color=(1,1,1,alpha)
    for o in children_of(r):opacity(o,alpha)
def fadeable(r):
    for o in descendants(r):
        if getattr(o,'data',None) and hasattr(o.data,'materials'):
            for m in o.data.materials:
                if m:opacity_material(m)
def open_purse(bag):
    """An open leather pouch; its former closed sphere buried the gold coins."""
    profile=[(.002,.012),(.006,.023),(.012,.029),(.022,.033),(.034,.032),(.045,.027),(.054,.020),(.062,.017)]
    n=48;vs=[]
    for z,rad in profile:
        for i in range(n):
            a=2*PI*i/n
            # Small gathered folds at the mouth are the pouch's construction,
            # not a graphic or a texture added to influence a frame metric.
            rr=rad*(1+.07*max(0,(z-.034)/.028)*math.cos(10*a))
            vs.append((rr*math.cos(a),.8*rr*math.sin(a),z-.032))
    fs=[tuple(reversed(range(n)))]
    for j in range(len(profile)-1):
        for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
    bag.data.clear_geometry();bag.data.from_pydata(vs,[],fs);bag.data.update()
    for p in bag.data.polygons:p.use_smooth=True
def ship(name,length=.16,flag=False):
    wanted=length;length=.16
    r=root(name);mwood=d.wood('e1shipW','#8a5a32','#5b3a22',(1,9,1));black=d.mat('e1shipBlack','#252a31',.52);ochre=d.mat('e1ochre','#d0aa56',.6);sail=d.mat('e1sail','#f4ecd6',.82)
    # Rounded, pointed hull with an open flat deck, three mast/sail groups.
    n=28;vs=[]
    for z,scale in [(0,.66),(.018,1),(.026,.94)]:
        for i in range(n):
            a=2*PI*i/n;vs.append((.5*length*math.cos(a),.19*length*math.sin(a)*scale,z))
    fs=[]
    for j in range(2):
        for i in range(n):fs.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
    fs.append(tuple(reversed(range(n))));hull=mesh(name+'_hull',vs,fs,black,r);bv=hull.modifiers.new('rounded_hull','BEVEL');bv.width=.002;bv.segments=3
    deck=ball(name+'_deck',.5*length,(0,0,.025),ochre,r,(1,.36,.045))
    for z in [.010,.020]:line(name+'_stripe'+str(z),[(.49*length*math.cos(2*PI*i/80),.19*length*math.sin(2*PI*i/80),z) for i in range(81)],.0014,ochre,r)
    for j,x in enumerate([-.30*length,0,.28*length]):
        top=.08 if j==1 else .068;cyl(name+'_mast'+str(j),.0015,top,(x,0,.025+top/2),mwood,r,verts=16)
        co=math.cos(math.radians(55));si=math.sin(math.radians(55))
        for k,z in enumerate([.047,.074]):
            sw=length*(.24 if k==0 else .19);sh=.025 if k==0 else .020
            # Brace each square sail and its yard together about the mast.
            line(name+'_yard',[(x+si*sw/2,-co*sw/2,z),(x-si*sw/2,co*sw/2,z)],.0012,mwood,r)
            # Canvas bowed into a shallow billow; curved 5x5 surface, softened edges.
            vv=[]
            for iy in range(6):
                for iz in range(6):
                    u=iy/5;v=iz/5;dx=.005*math.sin(PI*u)*math.sin(PI*v);dy=sw*(u-.5);vv.append((x+co*dx-si*dy,si*dx+co*dy,z-sh*v))
            ff=[]
            for iy in range(5):
                for iz in range(5):a=iy*6+iz;ff.append((a,a+6,a+7,a+1))
            so=mesh(name+'_sail',vv,ff,sail,r);sol=so.modifiers.new('cloth_thickness','SOLIDIFY');sol.thickness=.0006
        for sy in [-1,1]:line(name+'_rigging',[(x,0,.025+top),(x+length*.12,sy*length*.16,.027)],.00045,mwood,r)
    if flag:mesh(name+'_flag',[(0,0,.111),(.024,0,.105),(0,0,.099)],[(0,1,2)],d.mat('e1flag','#ac3730',.6),r)
    r.scale=(wanted/.16,)*3
    fadeable(r);return {'root':r,'hull':hull,'length':wanted,'sails_braced':True}
def clock(name,red=False,scale=.65):
    r=root(name);w=d.wood('e1clockWood','#9a6234','#7b4a24',(1,10,1));br=d.mat('e1clockBrass','#c9a44e',.3,metal=.8);ink=d.mat('e1clockInk','#1b1410',.4)
    box(name+'_base',(.12,.05,.024),(0,.004,.012),w,r,.004)
    cyl(name+'_body',.082,.045,(0,0,.104),w,r,(PI/2,0,0),72)
    attach(d.torus('e1_'+name+'_rim',.075,.0045,(0,-.023,.104),d.mat('e1clockRed','#c8463d',.4) if red else br,(PI/2,0,0)),r)
    face=d.plane('e1_'+name+'_face',.144,.144,(0,-.024,.104),d.imgmat('e1_'+name+'_tex',os.path.join(d.TEX,'clock.png'),back='#fbf6ea',alpha=True));face.rotation_euler=(PI/2,0,0);attach(face,r)
    hands=[]
    for label,length,width in [('hour',.047,.006),('minute',.060,.0035)]:
        pivot=d.empty('e1_'+name+'_'+label,(0,-.028,.104));attach(pivot,r)
        bar=d.box('e1_'+name+'_'+label+'bar',(width,.002,length),(0,0,length*.42),ink,.001);attach(bar,pivot);hands.append(pivot)
    cyl(name+'_cap',.006,.005,(0,-.031,.104),br,r,(PI/2,0,0));r.scale=(scale,)*3
    fadeable(r);return {'root':r,'hour':hands[0],'minute':hands[1]}
def set_clock(c,hour=12,minute=0):
    c['hour'].rotation_euler.y=2*PI*(hour+minute/60)/12;c['minute'].rotation_euler.y=2*PI*minute/60
def sailor(name='sailor',height=.08):
    r=root(name);shirt=d.mat('e1shirt','#f6f2e8',.6);navy=d.mat('e1navy','#243951',.6);red=d.mat('e1sailorRed','#b44b43',.6)
    cyl(name+'_body',.021,.056,(0,0,.028),shirt,r)
    for z in [.011,.024,.037,.050]:cyl(name+'_stripe',.0215,.005,(0,0,z),navy,r)
    ball(name+'_head',.02,(0,0,.075),d.M_SKIN,r)
    ball(name+'_scarf',.021,(0,0,.089),red,r,(1,1,.40));box(name+'_scarftail',(.010,.005,.022),(.016,.008,.079),red,r,.002,(0,.45,0));r.scale=(height/.095,)*3
    return r
def globe(name,texture):
    r=root(name);base=d.wood('e1globeWood','#8a5a32','#6f4526');br=d.mat('e1globeBrass','#c9a44e',.3,metal=.8)
    cyl(name+'_base',.077,.015,(0,0,.009),base,r);cyl(name+'_stem',.008,.07,(0,0,.05),br,r)
    rot=d.empty('e1_'+name+'_rotation',(0,0,.19));attach(rot,r)
    ocean=d.imgmat('e1globeTexture',texture);s=ball(name+'_earth',.12,(0,0,0),ocean,rot)
    # The torch-side shader is fixed in world space, so the towns rotate into
    # daylight rather than carrying their lighting around with the globe.
    night=ocean.copy();night.name='e1globeDayNight';nt=night.node_tree;p=d.principled(night)
    old=p.inputs['Base Color'].links[0].from_socket;geo=nt.nodes.new('ShaderNodeNewGeometry');xyz=nt.nodes.new('ShaderNodeSeparateXYZ');nt.links.new(geo.outputs['Position'],xyz.inputs[0])
    ramp=nt.nodes.new('ShaderNodeMapRange');ramp.inputs['From Min'].default_value=-.018;ramp.inputs['From Max'].default_value=.018;ramp.clamp=True;nt.links.new(xyz.outputs['X'],ramp.inputs['Value'])
    mix=nt.nodes.new('ShaderNodeMixRGB');mix.inputs['Color2'].default_value=d.rgb('#152846');nt.links.new(ramp.outputs['Result'],mix.inputs['Fac']);nt.links.new(old,mix.inputs['Color1']);nt.links.new(mix.outputs[0],p.inputs['Base Color'])
    lines=d.empty('e1_'+name+'_grid');attach(lines,rot);lats=[];lons=[]
    lm=d.mat('e1latM',LAT,.45,emit=LAT,strength=.15);om=d.mat('e1lonM',LON,.45,emit=LON,strength=.15)
    for lat in [-60,-30,0,30,50,60]:
        a=math.radians(lat);rr=.1208*math.cos(a);lats.append(line(name+'_lat',[(rr*math.cos(2*PI*i/128),rr*math.sin(2*PI*i/128),.1208*math.sin(a)) for i in range(129)],.0007,lm,lines))
    for lon in range(0,360,30):
        a=math.radians(lon);lons.append(line(name+'_lon',[(.121*math.cos(-PI/2+PI*i/128)*math.sin(a),-.121*math.cos(-PI/2+PI*i/128)*math.cos(a),.121*math.sin(-PI/2+PI*i/128)) for i in range(129)],.0007,om,lines))
    cyl(name+'_axis',.002,.275,(0,0,.19),br,r)
    return {'root':r,'rot':rot,'sphere':s,'daymat':ocean,'nightmat':night,'lats':lats,'lons':lons,'latmat':lm,'lonmat':om}
def surface(lat,lon=0,r=.123):
    a=math.radians(lat);b=math.radians(lon);return Vector((r*math.cos(a)*math.sin(b),-r*math.cos(a)*math.cos(b),r*math.sin(a)))
def globe_doll(g,name,lat,lon=0):
    r=sailor(name,.03);attach(r,g['rot']);place_globe_doll(r,lat,lon);return r
def place_globe_doll(r,lat,lon):
    p=surface(lat,lon);r.location=p;r.rotation_mode='QUATERNION';r.rotation_quaternion=Vector((0,0,1)).rotation_difference(p.normalized())
def star(name):
    r=root(name);br=d.mat('e1starBrass','#c9a44e',.3,metal=.8);gold=d.mat('e1starGold',GOLD,.45,emit=GOLD,strength=1.5)
    cyl(name+'_base',.035,.008,(0,0,.004),d.wood('e1starWood','#8a5a32','#6f4526'),r);cyl(name+'_stem',.0015,.33,(0,0,.173),br,r)
    vv=[(0,-.002,.35)]+[(.025*(1 if j%2==0 else .43)*math.sin(j*PI/5),-.003,.35+.025*(1 if j%2==0 else .43)*math.cos(j*PI/5)) for j in range(10)]
    mesh(name+'_star',vv,[(0,j+1,(j+1)%10+1) for j in range(10)],gold,r);fadeable(r);return r
def pendulum(name):
    r=root(name);wood=d.wood('e1penWood','#895a35','#654025',(1,12,1));br=d.mat('e1penBrass','#c9a44e',.3,metal=.8)
    box(name+'_case',(.078,.045,.18),(0,.004,.091),wood,r,.005);box(name+'_window',(.055,.004,.09),(0,-.020,.065),d.mat('e1penDark','#30291f',.6),r,.003)
    c=clock(name+'_dial',False,.44);attach(c['root'],r);c['root'].location=(0,-.014,.096)
    # A separate exposed brass pendulum swings behind a glass window.
    p=d.empty('e1_'+name+'_pivot',(0,-.024,.112));attach(p,r)
    cyl(name+'_rod',.0017,.070,(0,0,-.035),br,p,verts=20);ball(name+'_bob',.014,(0,0,-.071),br,p,(1,.35,1))
    glass=d.mat('e1penGlass','#c6d4d0',.2,alpha=.13);box(name+'_glass',(.059,.001,.098),(0,-.029,.064),glass,r,.001)
    return {'root':r,'pendulum':p,'clock':c}
def torch(name):
    r=root(name);silver=d.mat('e1silver','#aeb6bc',.28,metal=.75);dark=d.mat('e1torchDark','#3b4851',.55)
    cyl(name+'_tube',.015,.12,(0,0,0),silver,r,(0,PI/2,0));cyl(name+'_grip',.0155,.055,(-.014,0,0),dark,r,(0,PI/2,0))
    cyl(name+'_head',.023,.025,(.065,0,0),silver,r,(0,PI/2,0));cyl(name+'_lens',.019,.001,(.079,0,0),d.mat('e1torchLens','#fff1bb',.3,emit='#fff0b0',strength=1.5),r,(0,PI/2,0))
    box(name+'_button',(.014,.008,.006),(-.012,-.003,.016),dark,r,.002)
    ld=bpy.data.lights.new('e1_torch_light','SPOT');ld.energy=0;ld.color=d.rgb('#ffe1a0')[:3];ld.spot_size=math.radians(70);ld.spot_blend=.65
    light=attach(d.link(bpy.data.objects.new('e1_torch_light',ld)),r);light.location=(.081,0,0);light.rotation_euler=(0,-PI/2,0)
    return {'root':r,'light':ld}
def build(data,cache):
    d.catalog_stage();parts={};groups={}
    def capture(name,fn):
        before=set(bpy.data.objects);part=fn();groups[name]=list(set(bpy.data.objects)-before);parts[name]=part;return part
    chart=capture('chart',lambda:root('chart'))
    before=set(bpy.data.objects)
    tex=d.imgmat('e1chartTex',os.path.join(cache,'blender','tex','e1-chart.png'));page=d.plane('e1_chart_paper',.4,.28,(0,0,.001),tex);attach(page,chart)
    # Subtle curled border points maintain a model-paper edge.
    rim=d.mat('e1chartEdge','#c9b28c',.8)
    for sy in [-1,1]:line('chart_curl',[(-.2+.4*i/40,sy*.14,.001+.002*(math.sin(i*1.1)**2)) for i in range(41)],.001,rim,chart)
    for i in range(8):ball('scilly_rock',.005+.002*(i%3),(.092+.014*(i%4),.05+.014*(i//4),.006),d.mat('e1rock','#555a59',.7),chart,(1.2,.8,1.3))
    groups['chart']+=list(set(bpy.data.objects)-before);chart.location=(0,-.08,0)
    capture('fleet',lambda:[ship('fleet%d'%i,.07,i==0) for i in range(7)])
    marks=capture('marks',lambda:root('marks'));before=set(bpy.data.objects)
    ring('thought',.015,tuple(data['map']['thought']),d.mat('e1thought','#fffdf1',.5,emit='#fffdf1',strength=.2),marks,True)
    ring('real',.015,tuple(data['map']['real']),d.mat('e1real','#c7443b',.5),marks)
    arr=root('offset');attach(arr,marks);arrow('offset',data['map']['thought'],data['map']['real'],d.mat('e1yellow',GOLD,.4,emit=GOLD,strength=.3),arr)
    groups['marks']+=list(set(bpy.data.objects)-before);parts['offset']=arr
    grid=capture('grid',lambda:root('grid'));before=set(bpy.data.objects)
    for j in range(7):line('row',[( -.2,-.22+j*.28/6,.004),(.2,-.22+j*.28/6,.004)],.0006,d.mat('e1gridLat',LAT,.5),grid)
    for j in range(9):line('col',[(-.2+j*.05,-.22,.004),(-.2+j*.05,.06,.004)],.0006,d.mat('e1gridLon',LON,.5),grid)
    groups['grid']+=list(set(bpy.data.objects)-before)
    g=capture('globe',lambda:globe('globe',os.path.join(cache,'blender','tex','e1-globe.png')));g['root'].location=(0,.2,0)
    pol=capture('star',lambda:star('polaris'));pol.location=(-.3,.38,0)
    capture('dolls',lambda:[globe_doll(g,'observer',0),globe_doll(g,'east',50,28),globe_doll(g,'west',50,-28)])
    tl=capture('torch',lambda:torch('torch'));tl['root'].location=(-.29,.2,.19)
    a=capture('tokyo',lambda:clock('tokyo',True,.65));a['root'].location=(.30,.05,0)
    a=capture('london',lambda:clock('london',False,.65));a['root'].location=(.42,.05,0)
    bed=capture('bed',lambda:root('bed'));before=set(bpy.data.objects);box('bedframe',(.065,.04,.012),(0,0,0),d.wood('e1bedW','#8a5a32','#6f4526'),bed,.003);box('pillow',(.02,.032,.008),(-.022,0,.01),d.M_WHITE,bed,.003);sl=sailor('sleeping',.035);attach(sl,bed);sl.rotation_euler=(0,PI/2,0);sl.location=(-.015,0,.015);groups['bed']+=list(set(bpy.data.objects)-before);bed.location=(.42,.05,.135)
    s=capture('ship',lambda:ship('ship',.16,True));s['root'].location=(.25,-.05,.012)
    sc=capture('shipclock',lambda:clock('shipclock',False,.455));sc['root'].location=(.25,-.055,.04)
    capture('sailor',lambda:sailor('captain',.05));parts['sailor'].location=(.20,-.06,.04)
    wave=capture('wave',lambda:root('wave'));before=set(bpy.data.objects);box('wave',(.23,.125,.008),(0,0,0),d.mat('e1wave','#6a9daa',.55),wave,.006)
    for j in range(6):line('wavecrest',[(-.11+.22*i/40,-.05+j*.02,.005+.002*math.sin(i*.5+j)) for i in range(41)],.001,d.mat('e1waveFoam','#aac9c9',.65),wave)
    groups['wave']+=list(set(bpy.data.objects)-before);wave.location=(.25,-.05,.005)
    sun=capture('sun',lambda:root('sun'));before=set(bpy.data.objects);ball('sun',.025,(0,0,0),d.mat('e1sun',GOLD,.5,emit=GOLD,strength=3),sun)
    for j in range(12):a=j*2*PI/12;line('sunray',[(.031*math.cos(a),0,.031*math.sin(a)),(.039*math.cos(a),0,.039*math.sin(a))],.0013,d.MATS['e1sun'],sun)
    groups['sun']+=list(set(bpy.data.objects)-before)
    pen=capture('pendulum',lambda:pendulum('pendulum'));pen['root'].location=(-.3,.1,0)
    log=capture('log',lambda:root('log'));before=set(bpy.data.objects)
    rope=line('rope',[(-.18+.24*i/70,.0+.005*math.sin(i*.5),.004) for i in range(71)],.002,d.mat('e1rope','#9d754c',.8),log)
    knots=[ball('knot',.004,(-.18+i*.04,0,.005),d.MATS['e1rope'],log) for i in range(6)]
    spool=cyl('spool',.012,.018,(.05,0,.011),d.wood('e1spoolW','#8a5a32','#6f4526'),log,(0,PI/2,0));groups['log']+=list(set(bpy.data.objects)-before);log.location=(.20,-.10,.025);parts['rope']=rope;parts['knots']=knots;parts['spool']=spool
    hg=capture('hourglass',lambda:root('hourglass'));before=set(bpy.data.objects);br=d.mat('e1sandBrass','#c9a44e',.3,metal=.8)
    for z in [0,.05]:cyl('sandBase',.018,.004,(0,0,z),br,hg)
    for x in [-.014,.014]:cyl('sandPost',.0016,.05,(x,0,.025),br,hg)
    for z in [.014,.036]:ball('sandGlass',.014,(0,0,z),d.mat('e1sandGlass','#e3e9d3',.25,alpha=.30),hg,(1,1,.8))
    upper=ball('sandUpper',.011,(0,0,.037),d.mat('e1sand','#d5bd7b',.8),hg,(1,1,.6));lower=ball('sandLower',.011,(0,0,.008),d.MATS['e1sand'],hg,(1,1,.6));groups['hourglass']+=list(set(bpy.data.objects)-before);hg.location=(.12,-.13,.005);parts['sand']=(upper,lower)
    hat=capture('hat',lambda:root('hat'));before=set(bpy.data.objects);m=d.mat('e1hat','#252a31',.7);ball('hatTop',.035,(0,0,.025),m,hat,(1,.65,.7));box('hatBrim',(.085,.047,.005),(0,0,.009),m,hat,.003);line('hatTrim',[(-.036,-.024,.012),(0,-.026,.037),(.036,-.024,.012)],.0015,br,hat);groups['hat']+=list(set(bpy.data.objects)-before);hat.location=(-.29,-.14,0)
    prize=capture('prize',lambda:root('prize'));before=set(bpy.data.objects);bag=ball('bag',.033,(0,0,.032),d.mat('e1leather','#9a6841',.8),prize,(1,.8,1.1));open_purse(bag);attach(d.torus('e1_bagMouth',.017,.004,(0,0,.062),d.mat('e1bagDark','#684225',.8)),prize)
    coins=[]
    for i in range(7):coins.append(cyl('coin',.008,.002,((i%3-1)*.009,(i//3-1)*.006,.059+i*.001),d.mat('e1gold','#d5aa4e',.3,metal=.75),prize))
    groups['prize']+=list(set(bpy.data.objects)-before);prize.location=(.4,-.12,0);parts['coins']=coins
    ghost=capture('ghost',lambda:root('ghost'));before=set(bpy.data.objects);cyl('ghost',.035,.004,(0,0,0),d.mat('e1ghost','#7f8a8d',.6,alpha=.4),ghost,(PI/2,0,0));attach(d.torus('e1ghostCrown',.009,.002,(0,0,.039),d.MATS['e1ghost'],(PI/2,0,0)),ghost);groups['ghost']+=list(set(bpy.data.objects)-before);ghost.location=(.25,-.05,.13)
    # Reuse the reference scoreboard, just replace labels in this private scene.
    for o,label in zip([c for c in d.board_h.children if c.name.startswith('bl')],['海','船乗り']):o.data.body=label
    d.board_h.location=(.58,.30,0);groups['board']=[d.board_h]+list(d.board_h.children);parts['board']=d.board_h
    # B-1 proportions/materials, rebuilt privately so no shared source is edited.
    comp=capture('compass',lambda:root('compass'));before=set(bpy.data.objects);cw=d.wood('e1compW','#9a6234','#7b4a24');ivory=d.mat('e1compIvory','#efe2c4',.7);ink=d.mat('e1compInk','#3b2412',.6)
    box('compassBase',(.14,.14,.009),(0,0,.0045),cw,comp,.004)
    for sx in [-1,1]:box('compassSide',(.008,.14,.04),(sx*.066,0,.028),cw,comp,.002)
    for sy in [-1,1]:box('compassEdge',(.14,.008,.04),(0,sy*.066,.028),cw,comp,.002)
    cyl('compassFace',.055,.008,(0,0,.032),ivory,comp);attach(d.torus('e1_compassRim',.056,.003,(0,0,.038),br),comp)
    for j in range(36):
        a=2*PI*j/36;box('compassTick',(.001,.004 if j%9 else .008,.0007),(.049*math.sin(a),.049*math.cos(a),.0365),ink,comp,.0002,(0,0,-a))
    red=d.mat('e1compRed','#d6453d',.4,emit='#d6453d',strength=0);wh=d.mat('e1compWhite','#fffaf0',.4,emit='#fffaf0',strength=0)
    for j,ch in enumerate('NESW'):
        a=j*PI/2;attach(d.text('e1_compass_'+ch,ch,.012,red if ch=='N' else ink,(.039*math.sin(a),.039*math.cos(a),.037)),comp)
    mesh('compassRed',[(0,.045,.043),(-.006,0,.043),(.006,0,.043)],[(0,1,2)],red,comp);mesh('compassWhite',[(0,-.045,.043),(-.006,0,.043),(.006,0,.043)],[(0,1,2)],wh,comp);ball('compassPin',.0028,(0,0,.045),br,comp)
    hinge=root('compassHinge');attach(hinge,comp);hinge.location=(0,.07,.05)
    box('compassLid',(.14,.14,.008),(0,-.07,.004),cw,hinge,.004)
    rose=[(.04*math.sin(j*PI/16)*(1 if j%2==0 else .275),-.07+.04*math.cos(j*PI/16)*(1 if j%2==0 else .275),-.001) for j in range(32)]
    line('compassRose',rose,.0007,ink,hinge,True);hinge.rotation_euler.x=math.radians(-110)
    groups['compass']+=list(set(bpy.data.objects)-before);comp.scale=(.55,)*3;comp.location=(.37,-.10,0)
    return parts,groups
