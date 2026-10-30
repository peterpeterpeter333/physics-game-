"""E-1 independent deterministic stage. Original reference and narration are read-only."""
import os,sys,math,json,argparse,types,hashlib,time
_E1_STARTED=time.time()
def phase(message):print('[E1 %.2fs] %s'%(time.time()-_E1_STARTED,message),flush=True)
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
original_argv=sys.argv[:];sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
from desk_render_axes import explicit_scene_bpy
phase('loading private reference scene')
if bpy.app.background:
    import desk_lib as d
else:
    # Same GUI adapter as 1-2v2: retain recoverable prior scenes, never edit desk_lib.
    path=os.path.join(os.path.dirname(__file__),'desk_lib.py');source=open(path).read()
    assert source.count('bpy.ops.wm.read_factory_settings(use_empty=True)')==1
    source=source.replace('bpy.ops.wm.read_factory_settings(use_empty=True)','pass # GUI scene already empty')
    source=source.replace('bpy.context.active_object','bpy.context.view_layer.objects.active')
    # bpy.data.objects is name-sorted: renaming its live iterator may revisit
    # the same object indefinitely. Snapshot once, preserve old snapshots.
    for o in list(bpy.data.objects):
        if not o.name.startswith('previous_'):o.name='previous_e1v1_'+o.name
    bpy.context.window.scene=bpy.data.scenes.new('Technical chain E-1')
    d=types.ModuleType('desk_lib');d.__file__=path;sys.modules['desk_lib']=d
    exec(compile(source,path,'exec'),d.__dict__)
phase('reference scene loaded')
sys.argv=original_argv
import desk_lib_e1 as ext
if not bpy.app.background:
    import importlib
    ext=importlib.reload(ext)
from mathutils import Vector,Matrix
PI=math.pi;FPS=30
def args():
    p=argparse.ArgumentParser();p.add_argument('--cache',default='/private/tmp/ys/ys-chain-e1v1');p.add_argument('--times');p.add_argument('--catalog',action='store_true');p.add_argument('--gates',action='store_true');p.add_argument('--problem',action='store_true');p.add_argument('--from',dest='start',type=float,default=0);p.add_argument('--to',dest='stop',type=float,default=1e9);p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16);p.add_argument('--every',type=int,default=1);p.add_argument('--out');p.add_argument('--force',action='store_true');p.add_argument('--no-anchors',action='store_true');return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();DATA=json.load(open(A.cache+'/blender/data.json'));CUES=DATA['cues'];CUE={c['key']:c for c in CUES};DUR=DATA['duration'];NF=math.ceil(DUR*FPS)
def catalog_stage_private():
    # Same keep set as the reference, but never touch recoverable old scenes or
    # write a visibility property whose value already matches the target.
    exact={'floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3'};prefixes=('winF','picF','leg','stack')
    for o in list(d.SC.objects):
        hidden=not (o.type in ('LIGHT','CAMERA') or o.name in exact or o.name.startswith(prefixes))
        if o.hide_render!=hidden:o.hide_render=hidden
        if o.hide_viewport!=hidden:o.hide_viewport=hidden
    for ld,p in d.LIGHTS:ld.energy=p
    d.BGN.inputs[1].default_value=.35
d.catalog_stage=catalog_stage_private
phase('building E1 models')
PARTS,GROUPS=ext.build(DATA,A.cache)
phase('E1 models built')
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale);d.SC.eevee.taa_render_samples=A.samples
S=lambda k:CUE[k]['start'];E=lambda k:CUE[k]['end']
def T(key,word,occ=0):
    ww=[w for w in CUE[key]['wordEvents'] if word in w['word']]
    if len(ww)<=occ:raise ValueError('E-1 supplied cue timing missing: '+key+'/'+word)
    return ww[occ]['time']
def current(t):
    return next((c for c in reversed(CUES) if c['start']<=t),CUES[0])
def mkgroup(name,fn):
    before=set(bpy.data.objects);p=fn();PARTS[name]=p;GROUPS[name]=list(set(bpy.data.objects)-before);return p
yellow=d.mat('e1rayGold','#ffd23f',.4,emit='#ffd23f',strength=.4)
globe=PARTS['globe'];gc=Vector((0,.2,.19));chart=PARTS['chart']
def fog_factory():
    r=ext.root('fog');mats=[]
    for i in range(2):
        m=d.mat('e1fog%d'%i,'#dde5e8',.9,alpha=.24,unique=True);nt=m.node_tree;p=d.principled(m);tex=nt.nodes.new('ShaderNodeTexNoise');tex.inputs['Scale'].default_value=6;tex.inputs['Detail'].default_value=2
        tc=nt.nodes.new('ShaderNodeTexCoord');mapping=nt.nodes.new('ShaderNodeMapping');nt.links.new(tc.outputs['Generated'],mapping.inputs['Vector']);nt.links.new(mapping.outputs['Vector'],tex.inputs['Vector'])
        mul=nt.nodes.new('ShaderNodeMath');mul.operation='MULTIPLY';mul.inputs[1].default_value=.28;nt.links.new(tex.outputs['Fac'],mul.inputs[0]);nt.links.new(mul.outputs[0],p.inputs['Alpha'])
        # Fade every boundary to zero; no rectangular veil floats over the chart.
        uv=nt.nodes.new('ShaderNodeSeparateXYZ');nt.links.new(tc.outputs['UV'],uv.inputs[0]);edge=[]
        for axis in ['X','Y']:
            inv=nt.nodes.new('ShaderNodeMath');inv.operation='SUBTRACT';inv.inputs[0].default_value=1;nt.links.new(uv.outputs[axis],inv.inputs[1])
            mn=nt.nodes.new('ShaderNodeMath');mn.operation='MINIMUM';nt.links.new(uv.outputs[axis],mn.inputs[0]);nt.links.new(inv.outputs[0],mn.inputs[1]);edge.append(mn.outputs[0])
        mn=nt.nodes.new('ShaderNodeMath');mn.operation='MINIMUM';nt.links.new(edge[0],mn.inputs[0]);nt.links.new(edge[1],mn.inputs[1])
        feather=nt.nodes.new('ShaderNodeMapRange');feather.clamp=True;feather.inputs['From Min'].default_value=0;feather.inputs['From Max'].default_value=.13;nt.links.new(mn.outputs[0],feather.inputs['Value'])
        alpha=nt.nodes.new('ShaderNodeMath');alpha.operation='MULTIPLY';nt.links.new(mul.outputs[0],alpha.inputs[0]);nt.links.new(feather.outputs['Result'],alpha.inputs[1]);nt.links.new(alpha.outputs[0],p.inputs['Alpha'])
        o=d.plane('e1_fog%d'%i,.41,.29,(0,-.08,.016+i*.018),m);ext.attach(o,r);mats.append((mapping,mul))
    return {'root':r,'mats':mats}
fog=mkgroup('fog',fog_factory)
def configure_fog_wisps():
    # The same two noise layers, with visible natural wisps rather than a flat
    # grey sheet. Opacity limits remain the instructed .20/.40/.60.
    for mapping,mul in fog['mats']:
        nt=mapping.id_data;tex=next(n for n in nt.nodes if n.type=='TEX_NOISE')
        tex.inputs['Scale'].default_value=8
        ramp=nt.nodes.get('e1_fog_wisps')
        if ramp is None:ramp=nt.nodes.new('ShaderNodeValToRGB');ramp.name='e1_fog_wisps'
        ramp.color_ramp.elements[0].position=.40;ramp.color_ramp.elements[1].position=.60
        nt.links.new(tex.outputs['Fac'],ramp.inputs[0]);nt.links.new(ramp.outputs['Color'],mul.inputs[0])
configure_fog_wisps()
def sight_factory():
    r=ext.root('sight');dots=[ext.ball('sightdot',.0014,(0,0,0),yellow,r) for i in range(18)]
    horizon=ext.line('horizon',[(0,-.065,0),(0,.065,0)],.0009,d.mat('e1horizon','#f0d9a1',.6),r)
    sector=ext.mesh('altitude_sector',[(0,0,0)]*18,[(0,i,i+1) for i in range(1,17)],d.mat('e1sector','#ffd23f',.6,alpha=.32),r)
    return {'root':r,'dots':dots,'horizon':horizon,'sector':sector}
sight=mkgroup('sight',sight_factory)
def dial_factory():
    r=ext.root('dial');cyl=ext.cyl('dialglass',.14,.001,(0,0,.33),d.mat('e1dialGlass','#e3d9bc',.5,alpha=.17),r)
    for j in range(24):
        a=2*PI*j/24;ext.line('dialtick',[(.128*math.sin(a),.128*math.cos(a),.332),(.138*math.sin(a),.138*math.cos(a),.332)],.001,yellow if j==0 else d.M_INK,r)
    hand=ext.line('dialhand',[(0,0,.334),(0,.125,.334)],.0018,yellow,r)
    wedge=ext.mesh('dial15',[(0,0,.333)]+[(.139*math.sin(PI/12*i/16),.139*math.cos(PI/12*i/16),.333) for i in range(17)],[(0,i,i+1) for i in range(1,17)],d.mat('e1wedge','#ffd23f',.5,alpha=.45),r)
    return {'root':r,'hand':hand,'wedge':wedge}
dial=mkgroup('dial',dial_factory);dial['root'].location=(0,.20,0)
def arc_factory():
    r=ext.root('arcs');r.location=gc;arc=ext.line('135arc',[ext.surface(0,135*i/90,.126) for i in range(91)],.0028,yellow,r)
    pins=[]
    for lon,col in [(0,'#fffdf1'),(135,'#c7443b')]:pins.append(ext.ball('pin',.005,ext.surface(0,lon,.129),d.mat('e1pin'+col,col,.4),r))
    west=ext.line('west15',[ext.surface(0,-15*i/32,.129) for i in range(33)],.003,yellow,r)
    east=ext.line('east30',[ext.surface(0,30*i/32,.129) for i in range(33)],.003,yellow,r)
    westpin=ext.ball('west15pin',.005,ext.surface(0,-15,.129),yellow,r);eastpin=ext.ball('east30pin',.005,ext.surface(0,30,.129),yellow,r)
    return {'root':r,'arc':arc,'pins':pins,'west':west,'east':east,'westpin':westpin,'eastpin':eastpin}
arcs=mkgroup('arcs',arc_factory)
def noon_factory():
    r=ext.root('noon');r.location=gc;line=ext.line('noonmeridian',[( -.123*math.cos(-PI/2+PI*i/90),0,.123*math.sin(-PI/2+PI*i/90)) for i in range(91)],.0022,yellow,r);return r
noon=mkgroup('noon',noon_factory)
ship_noon=mkgroup('shipNoon',lambda:ext.line('shipNoon',[(.25,-.05,.0985),(.25,-.05,.1765)],.0012,yellow,ext.root('shipNoon')))
def drift_factory():
    r=ext.root('drift');white=d.mat('e1driftWhite','#fffdf1',.5);red=d.mat('e1driftRed','#c7443b',.5);blue=d.mat('e1currentBlue','#6fb3e0',.5)
    pairs=[]
    for i in range(5):
        a=Vector((-.16+i*.055,-.16+i*.018,.006));b=Vector((-.16+(i+1)*.055,-.16+(i+1)*.018,.006));u=Vector((0,i*.014,0));v=Vector((0,(i+1)*.014,0))
        left=[]
        for j in range(4):left.append(ext.line('guess',[a.lerp(b,j/4),a.lerp(b,(j+.55)/4)],.001,white,r))
        right=ext.line('truth',[a+u,b+v],.0018,red,r);dot=ext.ball('day',.003,b+v,red,r);pairs.append((left,right,dot))
    currents=[]
    for j in range(3):currents+=ext.arrow('current',(-.1+j*.08,-.18,.008),(-.08+j*.08,-.12,.008),blue,r,.0014)
    return {'root':r,'pairs':pairs,'currents':currents}
drift=mkgroup('drift',drift_factory)
def convergence_factory():
    r=ext.root('convergence');r.location=gc
    eq=ext.line('equatorWhite',[ext.surface(0,360*i/128,.122) for i in range(129)],.0014,d.M_INKW,r)
    band=ext.line('oneDegree',[ext.surface(0,-.5+i/16,.124) for i in range(17)],.0022,yellow,r)
    return {'root':r,'equator':eq,'band':band}
convergence=mkgroup('convergence',convergence_factory)
def shift_factory():
    r=ext.root('shift70');ext.ring('shipmark',.015,(-.10,-.12,.01),d.M_INKW,r,True)
    ar=d.empty('e1_shift70arrow');ext.attach(ar,r);ext.arrow('km70',(-.10,-.12,.012),(-.10+DATA['map']['km70World'],-.12,.012),yellow,ar)
    return {'root':r,'arrow':ar}
shift=mkgroup('shift',shift_factory)
def equatorial_star_position():
    return gc+ext.surface(50,0,.147)+Vector((0,-.12,0))
def southern_factory():
    # A fixed white equatorial star, deliberately not the polar ornament.
    r=ext.root('southernStar');starpos=equatorial_star_position()
    white=d.mat('e1southernWhite','#fffdf1',.45,emit='#fffdf1',strength=1.5)
    vv=[tuple(starpos)]+[tuple(starpos+Vector((.0143*(1 if j%2==0 else .43)*math.sin(j*PI/5),0,.0143*(1 if j%2==0 else .43)*math.cos(j*PI/5)))) for j in range(10)]
    ext.mesh('southernStar',vv,[(0,j+1,(j+1)%10+1) for j in range(10)],white,r)
    rays=[ext.line('sameAltitudeRay'+str(i),[(0,0,0),(0,0,0)],.0014,yellow,r) for i in range(2)]
    return {'root':r,'position':starpos,'rays':rays}
southern=mkgroup('southern',southern_factory)
def minutes_factory():
    r=ext.root('fourMinutes');ext.attach(r,PARTS['shipclock']['root'])
    vs=[(0,-.027,.104)]+[(.068*math.sin(PI/30*i/4),-.027,.104+.068*math.cos(PI/30*i/4)) for i in range(17)]
    ext.mesh('fourMinuteSector',vs,[(0,i,i+1) for i in range(1,17)],d.mat('e1fourMinuteGlass','#ffd23f',.5,alpha=.36),r)
    for j in range(5):
        a=j*PI/30;ext.line('fourMinuteTick',[(.062*math.sin(a),-.029,.104+.062*math.cos(a)),(.071*math.sin(a),-.029,.104+.071*math.cos(a))],.001,yellow,r)
    return r
minutes=mkgroup('minutes',minutes_factory)
def town_suns_factory():
    marks=[]
    for i in range(2):
        r=ext.root('townSun'+str(i));ext.attach(r,PARTS['dolls'][i+1]);r.location=(0,0,.041)
        ext.ball('townSun',.006,(0,0,0),yellow,r)
        for j in range(8):
            a=2*PI*j/8;ext.line('townSunRay',[(.008*math.cos(a),.008*math.sin(a),0),(.011*math.cos(a),.011*math.sin(a),0)],.0007,yellow,r)
        marks.append(r)
    return marks
town_suns=mkgroup('townSuns',town_suns_factory)
ext.configure_children(list(d.SC.objects))
_SHOW_QUEUE=None
def show_immediate(o,v):
    hidden=not bool(v)
    if o.hide_render!=hidden:o.hide_render=hidden
    if o.hide_viewport!=hidden:o.hide_viewport=hidden
def show_queued(o,v):
    if _SHOW_QUEUE is None:show_immediate(o,v)
    else:_SHOW_QUEUE[o]=bool(v)
def flush_visibility():
    global _SHOW_QUEUE
    pending=_SHOW_QUEUE;_SHOW_QUEUE=None
    for o,v in pending.items():show_immediate(o,v)
d.show=show_queued
def show_tree_cached(o,v):
    d.show(o,v)
    for child in ext.children_of(o):show_tree_cached(child,v)
# Only this in-memory private desk_lib instance changes. Its hand functions
# now use the same visibility traversal without O(all saved objects) children.
d.show_tree=show_tree_cached
MANAGED=list(set(o for group in GROUPS.values() for o in group))
def hide_all():
    for o in MANAGED:d.show(o,False)
    for name in d.HANDS:d.set_hand(name,(0,0,0),vis=False)
def visible(*groups):
    for g in groups:
        for o in GROUPS[g]:d.show(o,True)
def light(t):
    calm=t<S('two:need');torch=S('lon:torch')<=t<E('lon:east')
    # Keep reference colour temperature. Only light level changes on accident and day/night analogy.
    lv=.68 if calm else .48 if torch else 1
    for ld,p in d.LIGHTS:ld.energy=p*lv
    d.BGN.inputs[1].default_value=.35*lv
    d.set_emit(d.MATS['winGlow'],3.5*(.7+.3*lv))
def map_state(t,returning=False):
    visible('chart')
    first=t<S('two:need')
    if first or returning:visible('fleet','fog')
    if first and t>=T('fog:admiral','クラウズリー'):visible('hat');PARTS['hat'].location.z=.045*(1-d.seg(t,T('fog:admiral','クラウズリー'),T('fog:admiral','クラウズリー')+.8))
    thought=returning or t>=T('fog:thought','話し合い')
    real=returning or t>=T('fog:real','本当の位置')
    if thought:visible('marks')
    for o in GROUPS['marks']:
        # Other retained episode scenes may rename old objects. Identity of
        # the actual material, not an incidental object name, defines this mark.
        if getattr(o,'data',None) and hasattr(o.data,'materials') and d.MATS['e1real'] in list(o.data.materials) and not real:d.show(o,False)
    d.show_tree(PARTS['offset'],real)
    if real:
        PARTS['offset'].scale=(d.seg(t,T('fog:real','本当の位置'),T('fog:real','本当の位置')+.8),)*3 if first else (1,1,1)
    for i,s in enumerate(PARTS['fleet']):
        r=s['root'];p=Vector(DATA['map']['fleetLead'])-i*Vector(DATA['map']['fleetPitch'])
        if first or returning:p+=Vector(DATA['map']['fleetMove'])*(d.seg(t,0,1.5) if first else 1)
        r.location=p;r.rotation_euler=(0,0,0);ext.opacity(r,1)
        if first and i<4:
            u=d.seg(t,T('fog:wreck','ぶつかって'),T('fog:wreck','ぶつかって')+1.2);r.rotation_euler.x=math.radians(20)*u
            ext.opacity(r,1-.5*d.seg(t,T('fog:wreck','ぶつかって')+1.2,T('fog:wreck','ぶつかって')+1.7))
        if returning and i<4:d.show_tree(r,False)
    for i,(mapping,mul) in enumerate(fog['mats']):
        # Generated X spans .41 m: divide by that span to travel .01 m/s.
        mapping.inputs['Location'].default_value=(t*.01/.41+i*.37,0,0);mul.inputs[1].default_value=(.4 if first and t>T('fog:wreck','沈み') else .30) if first else (.30 if returning else .12)
    if returning:
        visible('shipclock');PARTS['shipclock']['root'].location=(.245,-.03,0);PARTS['shipclock']['root'].scale=(.22,)*3
        z=.05*(1-d.seg(t,T('last:clock','正確な時計'),T('last:clock','正確な時計')+.9));PARTS['shipclock']['root'].location.z=z;ext.set_clock(PARTS['shipclock'],10)
def latitude_state(t):
    visible('globe','star','dolls','sight');d.show_tree(PARTS['dolls'][1],False);d.show_tree(PARTS['dolls'][2],False)
    lat=0
    # The first substring match is 北極星; the second is the actual 北極 event.
    if t>=T('lat:equator','北極',1):lat=90*d.seg(t,T('lat:equator','北極',1),T('lat:equator','北極',1)+.6)
    if t>=S('lat:step'):
        a=T('lat:step','1度ずつ');lat=30*sum(d.seg(t,a+.4*k,a+.4*k+.25) for k in range(3))/3
    if t>=S('lat:50'):lat=30+20*d.seg(t,T('lat:50','イギリスの南'),T('lat:50','イギリスの南')+.8)
    ext.place_globe_doll(PARTS['dolls'][0],lat,0);eye=gc+ext.surface(lat,0,.145)
    show=t>=T('lat:ex','北極星')
    for i,o in enumerate(sight['dots']):d.show(o,show);o.location=eye+Vector((0,0,.15*i/17))
    h=sight['horizon'];h.location=eye;h.rotation_euler=(PI/2-math.radians(lat),0,0)
    # Tangent horizon to the north and the polar direction enclose exactly latitude.
    a=math.radians(lat)
    sector=sight['sector'];sector.location=eye
    coords=[Vector((0,0,0))]
    # Horizon vector perpendicular to the local vertical, chosen toward north.
    hv=Vector((0,math.sin(a),math.cos(a)));sv=Vector((0,0,1))
    for i in range(17):
        u=i/16;v=hv.lerp(sv,u).normalized() if (hv.lerp(sv,u)).length else hv;coords.append(v*.045)
    for vert,p in zip(sector.data.vertices,coords):vert.co=p
    d.show(sector,show and lat>0)
    globe['rot'].rotation_euler.z=0
    return lat
def globe_state(t,c):
    visible('globe');globe['root'].location=(0,.2,0);globe['root'].scale=(1,1,1);globe['rot'].rotation_euler.z=0
    d.set_emit(globe['latmat'],.15);d.set_emit(globe['lonmat'],.15)
    if c['group']=='globe' and c['row']==7:
        d.set_emit(globe['latmat'],1.3*d.seg(t,T('two:latlong','緯度'),T('two:latlong','緯度')+.3));d.set_emit(globe['lonmat'],1.3*d.seg(t,T('two:latlong','経度'),T('two:latlong','経度')+.3))
    if c['group']=='latitude':latitude_state(t)
    if c['group']=='star':
        visible('southern','dolls');d.show_tree(PARTS['dolls'][0],False)
        u=d.seg(t,T('lon:time','回って'),E('lon:time'));globe['rot'].rotation_euler.z=math.radians(-60+120*u)
        for i,(ray,lon) in enumerate(zip(southern['rays'],[28,-28])):
            # A star is effectively at infinity: both sightlines are parallel,
            # never aimed at the nearby white glyph. At transit their altitude
            # is asin((0,-1,0) dot local vertical) = 40 degrees at either 50 N site.
            eye=gc+ext.surface(50,lon+math.degrees(globe['rot'].rotation_euler.z),.147)
            for p,v in zip(ray.data.splines[0].points,[eye,eye+Vector((0,-.12,0))]):p.co=(*v,1)
            d.show(ray,abs(-60+120*u+lon)<7)
    if c['group']=='dial':
        visible('dial');a=T('lon:spin','24時間');ang=2*PI*d.seg(t,a,a+2);globe['rot'].rotation_euler.z=ang;dial['hand'].rotation_euler.z=-ang;d.show(dial['wedge'],t>=T('lon:15','15'))
    if c['group']=='torch':
        visible('torch','dolls','noon');d.show_tree(PARTS['dolls'][0],False);a=T('lon:torch','懐中電灯');PARTS['torch']['light'].energy=2.8*d.seg(t,a,a+.3)
        globe['sphere'].data.materials[0]=globe['nightmat']
        u=d.seg(t,T('lon:torch','回すと'),T('lon:torch','西の町')+1)
        # The illuminated meridian is fixed at -90 degrees. Positive rotation
        # brings the east town through it first, then the west town.
        globe['rot'].rotation_euler.z=math.radians(-140+90*u)
        for i,lon in enumerate([28,-28]):d.show_tree(town_suns[i],u>=(50-lon)/90)
        for o in GROUPS['noon']:
            if o.type=='CURVE':d.set_emit(yellow,.4+.7*d.seg(t,T('lon:noon','昼の12時'),T('lon:noon','昼の12時')+.25))
    else:PARTS['torch']['light'].energy=0
    if c['group']=='arc':
        visible('arcs');d.show(arcs['west'],False);d.show(arcs['east'],False);d.show(arcs['westpin'],False);d.show(arcs['eastpin'],False);arcs['arc'].data.bevel_factor_end=max(.001,d.seg(t,T('tz:135','135度'),T('tz:135','135度')+.8))
    if c['row']==25:
        # Every point has mathematically calculated cos(latitude) convergence.
        d.set_emit(globe['lonmat'],.8);visible('convergence');d.show(convergence['equator'],t>=T('clk:111','4万キロメートル'))
        lat=50*d.seg(t,T('clk:70','間がせまく'),T('clk:70','イギリスの近く')) if t>=S('clk:70') else 0
        for i,p in enumerate(convergence['band'].data.splines[0].points):p.co=(*ext.surface(lat,-.5+i/16,.124),1)
        d.show(convergence['band'],t>=T('clk:111','111キロメートル'))
def ship_state(t,c):
    visible('ship','wave');s=PARTS['ship']['root'];s.location=(.25,-.05,.012);s.rotation_euler=(0,0,0)
    sc=PARTS['shipclock'];sc['root'].location=(.25,-.07,.04);sc['root'].scale=(.455,)*3
    if c['group']=='clock':
        d.show_tree(s,False)
        for o in GROUPS['wave']:d.show(o,False)
        sc['root'].location=(.25,-.05,0);sc['root'].scale=(.65,)*3;visible('shipclock');ext.set_clock(sc,13)
        if t>=T('clk:4min','4分'):visible('minutes')
    if c['row'] in [21,22,23,40]:
        visible('sun');a=T('ship:sun','太陽');b=T('ship:sun','なった時');u=d.seg(t,a,b);theta=PI-PI/2*u
        # Homothety about the deck observation point preserves altitude and apparent angular size.
        observer=Vector((.25,-.05,.04));old_sun=Vector((.25+.11*math.cos(theta),-.05,.14+.11*math.sin(theta)))
        PARTS['sun'].location=observer+.65*(old_sun-observer);PARTS['sun'].scale=(.65,)*3
        peak=T('ch:noon','一番高く') if c['row']==40 else b
        if peak<=t<peak+.7:visible('shipNoon')
    if c['row'] in [22,23,24,40]:
        visible('shipclock');h=10 if c['row']==40 else 12+d.seg(t,T('ship:clock','午後1時'),T('ship:clock','午後1時')+.45);ext.set_clock(sc,h)
        if c['row']==22 and t<T('ship:clock','船に'):d.show_tree(sc['root'],False)
        if c['row']==22:ext.opacity(sc['root'],.15+.85*d.seg(t,T('ship:clock','船に'),T('ship:clock','船に')+.65))
        if c['row']==22 and t>=T('ship:clock','15度西'):
            visible('globe','arcs');globe['root'].location=(.365,.005,.06);globe['root'].scale=(.32,)*3;arcs['root'].location=(.365,.005,.06+.19*.32);arcs['root'].scale=(.32,)*3
            d.show(arcs['arc'],False);d.show(arcs['east'],False);d.show(arcs['eastpin'],False);d.show(arcs['pins'][1],False);d.show(arcs['west'],True)
    if c['row'] in [28,29]:
        visible('sailor','compass');strength=1.2*d.seg(t,T('dr:none','向き'),T('dr:none','向き')+.3)
        d.set_emit(d.MATS['e1compRed'],strength);d.set_emit(d.MATS['e1compWhite'],strength)
    if c['row']==29:
        visible('log','hourglass');a=T('dr:log','綱');b=T('dr:log','いくつ')+2;u=d.seg(t,a,b)
        PARTS['rope'].data.bevel_factor_start=.6*(1-u)
        # Knots pass a fixed stern marker at .5 s intervals, not the whole spool.
        start=T('dr:log','いくつ');travel=.08*max(0,t-start)
        for i,knot in enumerate(PARTS['knots']):
            knot.location.x=.04+i*.04-travel;d.show(knot,t>=a and -.18<=knot.location.x<=.05)
        upper,lower=PARTS['sand'];sand=d.seg(t,T('dr:log','砂時計'),b);upper.scale.z=max(.01,.6*(1-sand));lower.scale.z=max(.01,.6*sand)
    if c['row'] in [35,36]:
        visible('pendulum');p=PARTS['pendulum'];p['root'].location=(.25,-.05,.041)
        a=T('pen:sway','波');phase=max(0,t-a);sway=math.radians(10)*math.sin(2*PI*phase/1.3)*d.seg(t,a,a+.3)
        s.rotation_euler.x=sway;p['root'].rotation_euler.x=sway
        amp=(.18+.16*math.sin(phase*1.2))*(1-d.seg(t,T('pen:judge','負けた'),T('pen:judge','負けた')+1))
        p['pendulum'].rotation_euler=(.12*math.sin(phase*4),amp*math.sin(phase*6.2+.7*math.sin(phase*1.8)),.12*math.sin(phase*3))
        ext.set_clock(p['clock'],12+.07*phase+.12*math.sin(phase*2))
    if c['row']==39:
        visible('ghost');s.rotation_euler.x=math.radians(10)*math.sin(2*PI*t/1.3);PARTS['ghost'].location=(.25,-.05,.13);PARTS['ghost'].rotation_euler=(0,0,0)
def hands(t):
    if t<8:
        p=Vector(DATA['map']['fleetLead'])+Vector((0,0,.043))+Vector(DATA['map']['fleetMove'])*d.seg(t,0,1.5);out=d.seg(t,2.2,3.6);d.set_hand('kai',p+Vector((.22*out,-.28*out,.1*out)),130,-28,vis=t<3.6)
    if S('lon:torch')<=t<T('lon:torch','回すと')+.5:
        a=T('lon:torch','懐中電灯');p=Vector((-.302,.197,.208));u=d.seg(t,a-.7,a);v=d.seg(t,a+.5,a+1.4);d.set_hand('kai',p+Vector((-.20*(1-u+v),-.18*(1-u+v),.10*(1-u+v))),-40,-35)
    if S('last:clock')<=t:
        # Place the clock at the paper's right edge, then let the hand rest
        # quietly on the same upper-right paper position as the opening.
        a=T('last:clock','正確な時計');u=d.seg(t,a-.6,a);z=PARTS['shipclock']['root'].location.z;rest=d.seg(t,a+.95,a+1.85)
        contact=Vector((.245+.25*(1-u),-.03-.1*(1-u),.05+z+.15*(1-u)))
        d.set_hand('kai',contact.lerp(Vector((.13,.01,.05)),rest),165-35*rest,-28)
    if S('prize:act')<=t<E('prize:act'):
        a=T('prize:act','大きな賞金');u=d.seg(t,S('prize:act'),S('prize:act')+.8);v=d.seg(t,a+.7,a+1.5);off=1-u+v
        contact=PARTS['prize'].location+Vector((-.026,-.008,.043))
        d.set_hand('kai',contact+Vector((-.18*off,-.1*off,.05*off)),-65,-25,vis=t<a+1.6)
def apply_state(t):
    hide_all();c=current(t);g=c['group'];light(t);d.set_emit(yellow,.4)
    # Reset mutable transforms on each call (preview order never affects a frame).
    globe['root'].location=(0,.2,0);globe['root'].scale=(1,1,1);globe['sphere'].data.materials[0]=globe['daymat'];arcs['root'].location=gc;arcs['root'].scale=(1,1,1);PARTS['pendulum']['root'].rotation_euler=(0,0,0);PARTS['torch']['light'].energy=0;ext.opacity(PARTS['shipclock']['root'],1)
    for mat in ['e1compRed','e1compWhite']:d.set_emit(d.MATS[mat],0)
    ext.opacity(PARTS['star'],1)
    for name,energy,color in [('e1thought',.2,'#fffdf1'),('e1real',0,'#c7443b'),('e1yellow',.3,'#ffd23f')]:d.set_emit(d.MATS[name],energy,color)
    if g in ['map','grid']:
        map_state(t,c['row']==41)
        if g=='grid':visible('grid')
        if c['row'] in [26,27]:
            for o in GROUPS['marks']:d.show(o,False)
            visible('shift');shift['arrow'].scale=(d.seg(t,T('clk:shift','4分'),T('clk:shift','4分')+.8),)*3
        if c['row'] in [30,31,32]:
            visible('drift')
            for o in drift['currents']:d.show(o,t>=T('dr:drift','流されます'))
            for i,(guess,truth,dot) in enumerate(drift['pairs']):
                v=t>=T('dr:drift','積み重なる')+.4*i
                for o in guess+[truth,dot]:d.show(o,v)
            fog_time=T('dr:fog','空が見えない');fade=d.seg(t,fog_time,fog_time+.6)
            if t<fog_time+.6:visible('star');ext.opacity(PARTS['star'],1-fade)
            if c['row']>=31:visible('marks','fog');[setattr(mul.inputs[1],'default_value',.12+.48*fade) for _,mul in fog['mats']]
            a=T('dr:cause','大きな理由');pulse=math.sin(PI*d.seg(t,a,a+1.6)) if a<=t<a+1.6 else 0
            for name,base,color in [('e1thought',.2,'#fffdf1'),('e1real',0,'#c7443b'),('e1yellow',.3,'#ffd23f')]:d.set_emit(d.MATS[name],base+1.8*pulse,color)
    elif g in ['globe','latitude','star','dial','torch','arc']:globe_state(t,c)
    elif g=='clocks':
        visible('tokyo','london');ext.set_clock(PARTS['tokyo'],11+d.seg(t,T('tz:3am','昼の12時'),T('tz:3am','昼の12時')+.45));ext.set_clock(PARTS['london'],2+d.seg(t,T('tz:3am','朝の3時'),T('tz:3am','朝の3時')+.45))
        if t>=T('tz:3am','朝の3時'):visible('bed')
    elif g=='pendulum':
        visible('pendulum');p=PARTS['pendulum'];p['root'].location=(-.3,.1,.10*(1-d.seg(t,T('pen:hyp','振り子時計'),T('pen:hyp','振り子時計')+.6)));p['pendulum'].rotation_euler=(0,.18*math.sin(t*2*PI),0);ext.set_clock(p['clock'],12+t*.01)
    elif g=='prize':
        visible('prize');a=T('prize:act','大きな賞金');PARTS['prize'].location.z=.012*(1-d.seg(t,a,a+.6))
        for i,o in enumerate(PARTS['coins'][:2]):u=d.seg(t,a+.5+i*.12,a+1.4+i*.12);o.location=(.04*u,(-1 if i else 1)*.033*u,.059*(1-u)+.002*u);o.rotation_euler.y=PI*u
    else:ship_state(t,c)
    if t>=DATA['scores'][0]['time']:
        visible('board');val=next((v for v in reversed(DATA['scores']) if t>=v['time']),{'make':0,'brk':0});d.dg['make'].data.body=str(val['make']);d.dg['brk'].data.body=str(val['brk']);d.board_h.rotation_euler=(-PI/2*(1-d.seg(t,DATA['scores'][0]['time'],DATA['scores'][0]['time']+.7)),0,0)
    hands(t);set_camera(t)
def apply(t):
    global _SHOW_QUEUE
    if _SHOW_QUEUE is not None:raise RuntimeError('Nested E1 visibility transaction')
    _SHOW_QUEUE={}
    try:apply_state(t)
    finally:flush_visibility()
    bpy.context.view_layer.update();return anchors(t)

# Camera calibration uses the projected vertices, not a sphere's enclosing box.
BOUNDS={'map':((-.2,-.22,0),(.2,.06,.065)),'grid':((-.2,-.22,0),(.2,.06,.02)),'globe':((-.12,.08,.065),(.12,.32,.315)),'latitude':((-.12,.08,.065),(.12,.32,.36)),'star':((-.12,.08,.065),(.12,.32,.34)),'dial':((-.14,.06,.06),(.14,.34,.34)),'torch':((-.37,.08,.065),(.12,.32,.32)),'clocks':((.20,.0,0),(.52,.09,.18)),'arc':((-.13,.07,.06),(.13,.33,.32)),'ship':((.13,-.14,0),(.40,.08,.26)),'clock':((.20,-.10,0),(.30,0,.14)),'pendulum':((-.34,.075,0),(-.26,.125,.18)),'sway':((.16,-.12,0),(.34,.04,.24)),'prize':((.36,-.16,0),(.47,-.08,.08))}
def use_pose(p):
    d.pose_cam(p);d.CAM_D.dof.aperture_fstop=max(6,d.CAM_D.dof.aperture_fstop);bpy.context.view_layer.update()
def cloud(*groups):
    bpy.context.view_layer.update();points=[]
    for name in groups:
        for o in GROUPS[name]:
            if o.type=='MESH':points.extend(o.matrix_world@v.co for v in o.data.vertices)
            elif o.type=='CURVE':
                for spline in o.data.splines:
                    points.extend(o.matrix_world@Vector(p.co[:3]) for p in spline.points)
    return points
def prize_body_points():
    # R5: the protagonist is the leather pouch, not its two flying coins.
    # Measure its actual mesh at rest, independently of the last preview pose.
    bpy.context.view_layer.update();points=[];z=PARTS['prize'].location.z
    for o in GROUPS['prize']:
        if o.type=='MESH' and d.MATS['e1leather'] in list(o.data.materials):points.extend(o.matrix_world@v.co-Vector((0,0,z)) for v in o.data.vertices)
    assert points
    return points
POINTS={name:cloud(*groups) for name,groups in {'map':['chart'],'grid':['chart'],'globe':['globe'],'latitude':['globe'],'star':['globe'],'dial':['globe','dial'],'torch':['globe','torch'],'clocks':['tokyo','london'],'arc':['globe','arcs'],'ship':['ship'],'pendulum':['pendulum'],'prize':['prize']}.items()}
POINTS['prize']=prize_body_points()
# R6: a trailing rope is not a proxy for the ship's visible body. The existing
# ship is the principal here; its stern, hourglass and compass share the shot.
POINTS['log']=cloud('ship')
POINTS['log_fit']=cloud('ship','hourglass','compass','sailor')
PARTS['shipclock']['root'].location=(.25,-.05,0);PARTS['shipclock']['root'].scale=(.65,)*3;POINTS['clock']=cloud('shipclock')
PARTS['pendulum']['root'].location=(.25,-.05,.041);POINTS['sway']=cloud('ship','pendulum');PARTS['pendulum']['root'].location=(-.3,.1,0)
POINTS['pendulum_fit']=POINTS['pendulum']+[p+Vector((0,0,.1)) for p in POINTS['pendulum']]
def measured(p,points):
    use_pose(p);pts=[d.project(v) for v in points];return (max(q[0] for q in pts)-min(q[0] for q in pts))/1080
def fitted_camera(name,p,want):
    # R7: fit the ACTUAL lowered/raised mesh union, not a guessed height or a
    # single resting frame. Camera-only changes; no geometry/material changes.
    principal=POINTS[name];union=POINTS[name+'_fit'];p=list(p)
    az=math.radians(p[4]);el=math.radians(p[5])
    right=Vector((math.cos(az),math.sin(az),0));up=Vector((-math.sin(az)*math.sin(el),math.cos(az)*math.sin(el),math.cos(el)))
    for _ in range(9):
        lo=.15;hi=3
        for _ in range(16):
            p[3]=(lo+hi)/2;w=measured(p,principal)
            lo,hi=(p[3],hi) if w>want else (lo,p[3])
        use_pose(p);q=[d.project(v) for v in union]
        cx=(min(v[0] for v in q)+max(v[0] for v in q))/2;cy=(min(v[1] for v in q)+max(v[1] for v in q))/2
        if abs(cx-540)<.2 and abs(cy-830)<.2:break
        # Portrait AUTO sensor: 36 mm vertical, focal 40*.78, 1920px high.
        f=1920*p[6]*.78/36
        delta=right*((cx-540)*p[3]/f)+up*((830-cy)*p[3]/f)
        for i in range(3):p[i]+=delta[i]
    use_pose(p);q=[d.project(v) for v in union];box=[min(v[0] for v in q),min(v[1] for v in q),max(v[0] for v in q),max(v[1] for v in q)]
    assert box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550,(name,p,box)
    assert .4<=measured(p,principal)<=.7,(name,p)
    print('E1 R7 fitted actual union',name,json.dumps({'pose':p,'unionBox':box,'principalWidth':measured(p,principal)}),flush=True)
    return tuple(p)
def calibrated_camera(name):
    p0=DATA['cameras'][name]
    p=list(p0);want=.68 if name=='torch' else .66;lo=.15;hi=3
    if name=='clock':p[2]=.08
    if name in ['ship','sway']:p[4]=-25 # Three-quarter view reveals the bowed square sails.
    if name=='latitude':p[0]=-.065;want=.50 # Globe plus the fixed, left-background polar ornament.
    if name=='star':p[4]=-20;p[5]=15 # Fits the fixed white star without changing celestial geometry.
    if name=='map':p[4]=0 # Existing high polar ornament remains inside the drift composition.
    if name=='log':p[0]=.25;p[1]=-.07;return fitted_camera(name,p,.42)
    if name=='pendulum':p[2]=.16;return fitted_camera(name,p,.43)
    for _ in range(16):p[3]=(lo+hi)/2;w=measured(p,POINTS[name]);lo,hi=(p[3],hi) if w>want else (lo,p[3])
    return tuple(p)
CAMERAS={name:calibrated_camera(name) for name in DATA['cameras']}
phase('camera calibration complete')
def camera_keys():
    keys=[]
    for c in CUES:
        target=CAMERAS[c['camera']]
        if c['move']:
            previous=keys[-1]['pose'] if keys else tuple(list(target[:3])+[target[3]*1.06]+list(target[4:]))
            keys.extend([{'t':c['start'],'pose':previous,'cut':False},{'t':c['start']+c['move'],'pose':target,'cut':False}])
        else:keys.append({'t':c['start'],'pose':target,'cut':False})
        keys.append({'t':c['end'],'pose':target,'cut':False})
    return sorted(keys,key=lambda k:k['t'])
KEYS=camera_keys()
def pose_at(t):
    for a,b in zip(KEYS,KEYS[1:]):
        if a['t']<=t<b['t']:return a['pose'] if a['pose']==b['pose'] else d.pose_mix(a['pose'],b['pose'],(t-a['t'])/max(1e-6,b['t']-a['t']))
    return KEYS[-1]['pose'] if t>0 else KEYS[0]['pose']
def set_camera(t):p=pose_at(t);use_pose(p);return p
def anchors(t):
    c=current(t);out={'mapLeft':(-.2,-.08,.01),'mapRight':(.2,-.08,.01),'thought':DATA['map']['thought'],'real':DATA['map']['real'],'scilly':(.12,-.025,.02),'globe':gc,'tokyo':(.30,.02,.14),'london':(.42,.02,.14),'ship':(.25,-.05,.15),'clock':(.25,-.08,.11),'pendulum':PARTS['pendulum']['root'].location+Vector((0,0,.15)),'polaris':(-.3,.38,.35)}
    if c['group']=='latitude':out['observer']=PARTS['dolls'][0].matrix_world.translation+Vector((0,0,.03))
    for i in range(7):out['gridRow%d'%i]=(-.20,-.22+i*.28/6,.01)
    for i in range(9):out['gridCol%d'%i]=(-.20+i*.05,.06,.01)
    return out
def sway_motion_calibrated(p):
    # R9: the boat and clock are one requested two-object shot. The resting
    # union misses the wider silhouette at an actual rolled/irregular pose.
    # Inspect every encoded 30fps stable pose, solve once at its true maximum,
    # then inspect all of them again before any image rendering.
    global KEYS,SWAY_MOTION_PROOF
    a=S('pen:fact')+next(c['move'] for c in CUES if c['key']=='pen:fact');b=E('pen:judge')
    times=[j/FPS for j in range(math.ceil(a*FPS),math.floor(b*FPS)+1)]
    times=sorted(set(times+[T('pen:sway','波'),T('pen:sway','船が揺れる'),T('pen:sway','振り子の振れ方'),318.8,T('pen:sway','安定しません'),T('pen:judge','負けた')]))
    CAMERAS['sway']=tuple(p);KEYS=camera_keys();worst=None
    for t in times:
        apply(t);points=cloud('ship','pendulum');q=[d.project(v) for v in points]
        width=(max(v[0] for v in q)-min(v[0] for v in q))/1080
        if worst is None or width>worst['width']:worst={'time':t,'width':width,'points':points}
    p=list(p);lo=.15;hi=3
    for _ in range(16):
        p[3]=(lo+hi)/2;width=measured(p,worst['points'])
        lo,hi=(p[3],hi) if width>.69 else (lo,p[3])
    CAMERAS['sway']=tuple(p);KEYS=camera_keys();rows=[];bad=[]
    for t in times:
        apply(t);q=[d.project(v) for v in cloud('ship','pendulum')]
        box=[min(v[0] for v in q),min(v[1] for v in q),max(v[0] for v in q),max(v[1] for v in q)]
        width=(box[2]-box[0])/1080;row={'time':t,'width':width,'box':box};rows.append(row)
        if not(.4<=width<=.7 and box[0]>=40 and box[1]>=110 and box[2]<=1040 and box[3]<=1550):bad.append(row)
    SWAY_MOTION_PROOF={'scope':'actual principal mesh/curve projection of every stable encoded 30fps sway pose; NOT image gate','samples':len(rows),'beforeMaximumTime':worst['time'],'beforeMaximumWidth':worst['width'],'pose':p,'minWidth':min(r['width'] for r in rows),'maxWidth':max(r['width'] for r in rows),'violations':bad,'rows':rows,'status':'PASS' if not bad else 'NG'}
    print('E1 r9 full30fps sway audit',json.dumps({k:v for k,v in SWAY_MOTION_PROOF.items() if k!='rows'}),flush=True)
    assert not bad,'Actual sway union outside physical bounds; no images rendered'
    POINTS['sway']=worst['points']
    return tuple(p)
CAMERAS['sway']=sway_motion_calibrated(CAMERAS['sway']);KEYS=camera_keys()
def challenge_setup():
    hide_all();visible('ship','wave','sun','shipclock','globe','arcs');PARTS['ship']['root'].rotation_euler=(0,0,0);PARTS['sun'].location=(.25,-.05,.1765);PARTS['sun'].scale=(.65,)*3;PARTS['shipclock']['root'].location=(.25,-.07,.04);PARTS['shipclock']['root'].scale=(.455,)*3;ext.set_clock(PARTS['shipclock'],10);globe['root'].location=(.365,.005,.06);globe['root'].scale=(.32,)*3;globe['rot'].rotation_euler.z=0;arcs['root'].location=(.365,.005,.06+.19*.32);arcs['root'].scale=(.32,)*3
    globe['sphere'].data.materials[0]=globe['daymat'];ext.opacity(PARTS['shipclock']['root'],1)
    for o in [arcs['arc'],arcs['west'],arcs['east'],arcs['westpin'],arcs['eastpin'],arcs['pins'][1]]:d.show(o,False)
    for ld,p in d.LIGHTS:ld.energy=p
    d.BGN.inputs[1].default_value=.35;use_pose(CAMERAS['ship'])
def answer_state():
    challenge_setup();d.show(arcs['east'],True);d.show(arcs['eastpin'],True)
def render_problem():
    bpy.context.window.scene=d.SC
    out=A.out or A.cache+'/problem/raw-e1v1';os.makedirs(out,exist_ok=True);d.SC.render.image_settings.file_format='PNG'
    for name,fn in [('挑戦',challenge_setup),('答え',answer_state)]:
        fn();d.SC.render.filepath=out+'/'+name+'.png';bpy.ops.render.render(write_still=True,scene=d.SC.name)
def catalog():
    bpy.context.window.scene=d.SC
    out=A.out or A.cache+'/blender/catalog-e1v1';os.makedirs(out,exist_ok=True)
    d.SC.render.image_settings.file_format='JPEG';d.SC.render.image_settings.quality=95
    specs=[('chart',['chart','fleet','marks'],(0,-.08,.02),.4),('fleet',['fleet'],(0,-.08,.03),.4),('ship',['ship','wave'],(.25,-.05,.07),.20),('observer',['globe','star','dolls','sight'],(-.10,.26,.19),.52),('southern',['globe','dolls','southern'],(0,.12,.22),.32),('dial',['globe','dial'],(0,.2,.19),.28),('torch',['globe','torch','dolls','noon'],(-.11,.2,.18),.49),('arc',['globe','arcs'],(0,.2,.19),.26),('log',['ship','log','hourglass'],(.2,-.08,.06),.34),('pendulum',['pendulum'],(-.3,.1,.09),.15),('prize',['prize','ghost'],(.35,-.1,.08),.16)]
    examples={'chart':31.5,'fleet':1.5,'ship':175,'observer':81.8,'southern':103,'dial':117,'torch':131,'arc':165,'log':260.5,'pendulum':300,'prize':341}
    for name,groups,center,span in specs:
        apply(examples[name]);hide_all();visible(*groups)
        if name=='observer':
            d.show_tree(PARTS['dolls'][1],False);d.show_tree(PARTS['dolls'][2],False)
        if name=='southern':d.show_tree(PARTS['dolls'][0],False)
        if name=='arc':
            for o in [arcs['west'],arcs['east'],arcs['westpin'],arcs['eastpin']]:d.show(o,False)
        if name=='pendulum':PARTS['pendulum']['root'].location=(-.3,.1,0)
        if name=='prize':PARTS['ghost'].location=(.31,-.1,.07)
        for ld,p in d.LIGHTS:ld.energy=p
        d.BGN.inputs[1].default_value=.35;d.set_emit(d.MATS['winGlow'],3.5)
        for top in [False,True]:
            d.catalog_camera(center,top,span);d.CAM_D.dof.aperture_fstop=6;d.SC.render.filepath=out+'/e1v1_'+name+('_top.jpg' if top else '_oblique.jpg');bpy.ops.render.render(write_still=True,scene=d.SC.name)

# All continuously changing physical states have real 30fps frames. Identical holds clone a still.
SPANS=[(c['start'],c['start']+c['move']) for c in CUES if c['move']]
SPANS += [(0,3.6),(8.8,11.2),(19.62,20.5),(25.67,27),(34.62,36.4),(61.8,91.4),(99.8,109),(113.38,115.5),(126,133.8),(149.9,154.3),(160.2,161.3),(181.2,182.8),(190.3,191.3),(198.3,199.5),(235.6,237.1),(254,264),(269,275),(296,331),(338,341),(348,378.4),(382,384.8)]
SPANS += [(0,S('two:need')),(S('last:clock'),DUR)]
SPANS += [(S('dr:fog'),E('pen:side'))]
SPANS += [(T('clk:111','4万キロメートル'),E('clk:70'))]
SPANS += [(S('lon:time'),E('lon:time')),(S('lon:torch'),E('lon:east')),(T('ship:sun','太陽'),T('ship:sun','なった時')+.72),(T('ship:clock','午後1時'),T('ship:clock','午後1時')+.5),(T('tz:3am','昼の12時'),T('tz:3am','昼の12時')+.5),(T('tz:3am','朝の3時'),T('tz:3am','朝の3時')+.5),(T('dr:none','向き'),T('dr:none','向き')+.35),(T('prize:act','大きな賞金'),T('prize:act','大きな賞金')+1.7)]
EVENTS=sorted(set([c['start'] for c in CUES]+[w['time'] for c in CUES for w in c['wordEvents']]+[b for a,b in SPANS]))
def plan(j):
    t=j/FPS
    if any(a-.034<=t<=b+.034 for a,b in SPANS):return ('render',None)
    last=max([0]+[v for v in EVENTS if v<=t]);k=min(j,math.ceil(last*FPS-1e-7));return ('render',None) if k==j else ('dup',k)
def main():
    bpy.context.window.scene=d.SC
    seed=A.cache+'/blender/seed-e1v1';os.makedirs(seed+'/blender/desk',exist_ok=True)
    json.dump({'anchors':{}},open(seed+'/blender/desk/anchors.json','w'));json.dump({'moving_spans':[]},open(seed+'/blender/camera-motion.json','w'))
    names=sorted(set(anchors(0))|{'observer'});options={'every':A.every,'scale':A.scale,'times':[float(x) for x in A.times.split(',')] if A.times else None,'out':A.out,'from':A.start,'to':A.stop,'force':A.force,'noanc':A.no_anchors}
    if options['times']:
        out=A.out or A.cache+'/blender/preview';os.makedirs(out,exist_ok=True);arrays={name:[[0,0,0] for _ in range(NF)] for name in names}
        for t in options['times']:
            pts=apply(t);j=round(t*FPS)
            for name in names:arrays[name][j]=d.project(pts[name]) if name in pts else [0,0,0]
        json.dump({'anchors':arrays,'fps':FPS},open(out+'/anchors.json','w'))
    scope={**d.__dict__,'__file__':__file__,'A':options,'CACHE':seed,'CACHE6':A.cache,'NF6':NF,'FPS':FPS,'CLIP6':{'duration':DUR},'CUE6':{c['key']:{'s':c['start'],'e':c['end']} for c in CUES},'DATA':DATA,'PT6':{'librarySHA':hashlib.sha256(open(ext.__file__,'rb').read()).hexdigest()},'plan6':(lambda j:('render',None)) if options['times'] else plan,'apply6':apply,'anchors':lambda t:{},'anchors5':lambda t:{},'V6_ANC':names,'S6':lambda k:1e6,'T6':lambda *a,**kw:0}
    # The original times branch always renders, irrespective of A.force.
    # Anchors above cover every requested time; render only genuinely missing
    # outputs so an r5 symlink can never be followed and overwritten.
    scope['bpy']=explicit_scene_bpy(d.SC)
    requested=options['times'];missing=None
    if requested is not None:
        missing=[t for t in requested if A.force or not os.path.exists(os.path.join(out,'%05d.jpg'%round(t*FPS)))]
        scope['A']={**options,'times':missing}
        print('E1 preview reuse: requested',len(requested),'missing',len(missing),flush=True)
    if requested is None or missing:
        try:types.FunctionType(d.main.__code__,scope)()
        except SystemExit as e:
            if e.code not in [None,0]:raise
    else:print('E1 all requested preview images already exist; skip reference main (empty times would mean full production)',flush=True)
    poses=[pose_at(j/FPS) for j in range(NF)];mv=[False]+[poses[j]!=poses[j-1] for j in range(1,NF)]
    motion={'frames':NF,'moving_frames':sum(mv),'moving_ratio':sum(mv)/NF,'top_ratio':sum(p[5]>=65 for p in poses)/NF,'cameras':CAMERAS,'subject_widths':{name:measured(p,POINTS[name]) for name,p in CAMERAS.items()},'sway_actual_30fps':{k:v for k,v in SWAY_MOTION_PROOF.items() if k!='rows'},'episode':'E-1'}
    json.dump(motion,open(A.cache+'/blender/camera-motion.json','w'),indent=1)
if __name__=='__main__':
    if A.gates:
        base=A.out or A.cache+'/blender/gate-e1v1-r2';requested=A.times
        A.out=base+'/catalog';phase('catalog rendering');catalog();A.times=requested or ','.join(map(str,DATA['gateTimes']));A.out=base+'/frames';phase('probe frames rendering');main();A.out=base+'/problem-raw';phase('problem raw rendering');render_problem();phase('all E1 gates renders complete')
    elif A.catalog:catalog()
    elif A.problem:render_problem()
    else:main()
