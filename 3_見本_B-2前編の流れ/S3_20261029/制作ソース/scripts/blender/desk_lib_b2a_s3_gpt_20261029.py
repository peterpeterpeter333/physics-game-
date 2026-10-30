"""B-2 前編 S3専用・一体型改訂版。S2原本・共有部品・台本は変更しない。

Import this module after the caller has initialized ``desk_lib``.  Factories do
not create a room, camera, lights, text or animation.  All measurements are m.
Every model has root / objects / parts / anchors / bounds.  Anchors and bounds
are root-local; world_anchor() resolves an anchor after the root is positioned.
State functions are absolute, deterministic and preserve the external root pose.
"""
import math
import bpy
from mathutils import Vector, Matrix
import desk_lib as d


def _clamp(x, lo=0.0, hi=1.0):
    return max(lo, min(hi, float(x)))


def _mat(key, color, rough=.5, metal=0.0, alpha=1.0, emit=None, strength=0.0):
    return d.mat('b2a_s3_' + key, color, rough, metal=metal, alpha=alpha,
                 emit=emit, strength=strength)


def materials():
    return {
        'wood': d.wood('b2a_s3_oak', '#9a6234', '#7b4a24'),
        'green': _mat('frog_green', '#73ad64', .48),
        'greenlight': _mat('frog_toes', '#99c879', .54),
        'nerve': _mat('nerve_ivory', '#fff8db', .52),
        'brass': _mat('brass', '#c9a44e', .29, .75),
        'iron': _mat('iron', '#6e7780', .36, .7),
        'copper': _mat('copper', '#bc513b', .32, .62),
        'zinc': _mat('zinc', '#8caacb', .30, .62),
        'wetpaper': _mat('wetpaper', '#eee5cc', .88),
        'drypaper': _mat('drypaper', '#f3e8ce', .92),
        'glass': _mat('glass', '#cce8ed', .18, .0, .13),
        'rim': _mat('glass_rim', '#b8dbe0', .25, .05, .67),
        'water': _mat('water', '#4fadd7', .23, .0, .76),
        'flow': _mat('flow', '#67d4ff', .35, emit='#57c7fa', strength=.6),
        'gold': _mat('goldleaf', '#e7bd53', .27, .65),
        'ivory': _mat('ivory', '#f6efde', .64),
        'dark': _mat('dark', '#3c3636', .66),
        'cloth': _mat('cloth', '#d8c3a4', .86),
        'spark': _mat('spark', '#a2e9ff', .4, emit='#70ceff', strength=5),
        'yellow': _mat('yellow', '#ffd23f', .48, emit='#ffd23f', strength=.25),
        'skin': _mat('skin', '#e9b48f', .58),
    }


def _begin(name):
    before = set(bpy.data.objects)
    root = d.empty(name)
    return before, root


def _finish(name, before, root, parts, anchors, bounds):
    objects = sorted(set(bpy.data.objects) - before, key=lambda ob: ob.name)
    for ob in objects:
        if ob is not root and ob.parent is None:
            d.parent(ob, root)
    baseline = {ob.name: (ob.location.copy(), ob.rotation_euler.copy(),
                           ob.scale.copy(), bool(ob.hide_render),
                           bool(ob.hide_viewport)) for ob in objects if ob is not root}
    return {'name': name, 'root': root, 'objects': objects, 'parts': parts,
            'anchors': {k: Vector(v) for k, v in anchors.items()},
            'bounds': (Vector(bounds[0]), Vector(bounds[1])), 'baseline': baseline}


def world_anchor(model, key):
    bpy.context.view_layer.update()
    return model['root'].matrix_world @ Vector(model['anchors'][key])


def visible(model, yes=True):
    """Toggle the complete object list; state() may then restore part visibility."""
    for ob in model['objects']:
        d.show(ob, bool(yes))


def reset(model):
    """Reset internal transforms only; do not alter root location/rotation/scale."""
    for ob in model['objects']:
        b = model['baseline'].get(ob.name)
        if b:
            ob.location, ob.rotation_euler, ob.scale = b[0].copy(), b[1].copy(), b[2].copy()
            ob.hide_render, ob.hide_viewport = b[3], b[4]


def curve(name, points, material, radius=.0016):
    cu = bpy.data.curves.new(name + '_curve', 'CURVE')
    cu.dimensions = '3D'
    cu.bevel_depth = radius
    cu.bevel_resolution = 2
    cu.resolution_u = 1
    sp = cu.splines.new('POLY')
    sp.points.add(len(points) - 1)
    for point, xyz in zip(sp.points, points):
        point.co = (*xyz, 1)
    ob = bpy.data.objects.new(name, cu)
    d.link(ob)
    d.put(ob, material)
    return ob


def _curve_points(ob, points):
    sp = ob.data.splines[0]
    if len(sp.points) != len(points):
        raise ValueError('A fixed-size curve must retain its point count')
    for point, xyz in zip(sp.points, points):
        point.co = (*xyz, 1)


def rod(name, a, b, radius, material):
    a, b = Vector(a), Vector(b)
    ob = d.cyl(name, radius, (b-a).length, (a+b)*.5, material, verts=24)
    ob.rotation_euler = (b-a).to_track_quat('Z', 'Y').to_euler()
    return ob


def _spark(name, center, size=.026):
    m = materials()['spark']
    x, y, z = center
    pts = [(x-size*.5, y, z), (x-size*.15, y, z+size*.22),
           (x-size*.05, y, z-size*.22), (x+size*.18, y, z+size*.20),
           (x+size*.5, y, z)]
    return curve(name, pts, m, .0025)


def frog_leg(name='b2a_frog'):
    """A rounded green hind leg, NOT anatomical gore. Knee rotation lifts toes."""
    before, root = _begin(name)
    m = materials()
    # Short muscular thigh, definite knee and slender lower leg: one hind leg,
    # not an elongated torso that can be mistaken for a whole frog.
    thigh = d.sphere(name+'_thigh', .036, (-.054, 0, .039), m['green'], scale=(1.13,.76,.78))
    knee = d.sphere(name+'_knee', .020, (-.003,-.003,.032), m['green'])
    pivot = d.empty(name+'_knee_hinge', (-.003,-.003,.032))
    shin = d.sphere(name+'_shin', .024, (.044,-.003,.024), m['green'], scale=(1.90,.44,.48))
    ankle = d.empty(name+'_ankle_hinge', (.096,-.003,.021))
    foot = d.sphere(name+'_foot', .020, (.117,-.009,.019), m['greenlight'], scale=(1.55,.90,.49))
    toes = []
    for i in range(3):
        toe = d.sphere(name+'_toe_'+str(i), .009,
                       (.139+(.004 if i == 1 else 0), -.026+i*.016, .015),
                       m['greenlight'], scale=(1.55,.65,.52), seg_=20, ring=12)
        d.parent(toe, ankle)
        toes.append(toe)
    d.parent(shin, pivot)
    d.parent(ankle, pivot)
    d.parent(foot, ankle)
    nerve_points = [(-.142,-.012,.047),(-.124,-.012,.050),(-.111,-.010,.051),
                    (-.099,-.006,.047),(-.087,-.003,.045)]
    nerve = curve(name+'_white_nerve', nerve_points, m['nerve'], .0060)
    nerve_tip = d.sphere(name+'_nerve_tip', .0063, nerve_points[0], m['nerve'])
    pulse = d.sphere(name+'_nerve_signal', .005, nerve_points[0], m['yellow'], seg_=16, ring=8)
    d.show(pulse, False)
    p = _finish(name,before,root,
                {'thigh':thigh,'knee':knee,'knee_hinge':pivot,'ankle_hinge':ankle,
                 'shin':shin,'foot':foot,'toes':toes,'nerve':nerve,'nerve_tip':nerve_tip,
                 'pulse':pulse,'nerve_points':nerve_points},
                {'nerve':(-.124,-.012,.050),'nerve_end':nerve_points[0],
                 'muscle':(-.037,-.020,.050),'knee':(-.003,-.003,.032),
                 'toe':(.151,-.009,.019),'center':(.005,0,.041)},
                ((-.15,-.043,0),(.158,.045,.082)))
    return p


def frog_kick(model, u=0.0, strength=1.0, signal=None, degrees=None):
    q = model['parts']
    # u denotes the extent of the kick, not time: 0 is resting, 1 is lifted.
    a=math.radians(30 if degrees is None else float(degrees))*_clamp(u)*_clamp(strength)
    q['knee_hinge'].rotation_euler.y = -a
    q['ankle_hinge'].rotation_euler.y = 0.0
    # A single 30-degree knee lift; the foot does not independently deform.
    model['anchors']['toe']=Vector((-.003+.154*math.cos(a)+.013*math.sin(a),
                                    -.009,.032+.154*math.sin(a)-.013*math.cos(a)))
    if signal is not None:
        v = _clamp(signal)
        pts = q['nerve_points']
        k = min(len(pts)-2,int(v*(len(pts)-1)))
        q['pulse'].location = Vector(pts[k]).lerp(Vector(pts[k+1]),v*(len(pts)-1)-k)
        d.show(q['pulse'],0 < v < 1)
    else:
        d.show(q['pulse'],False)


def frog_experiment(name='b2a_frog_experiment', same_metal=False):
    before, root = _begin(name)
    m=materials()
    board=d.box(name+'_board',(.34,.22,.016),(0,0,.008),_mat('frog_board','#706553',.78),.008)
    leg=frog_leg(name+'_leg')
    d.parent(leg['root'],root)
    leg['root'].location.z=.017
    nerve=Vector((-.124,-.012,.067)); muscle=Vector((-.037,-.020,.067))
    tips=[Vector((-.044,-.092,.075)),Vector((-.044,-.092,.075))]
    elbows=[Vector((-.135,-.051,.073)),Vector((.007,-.054,.073))]
    path0=[nerve,elbows[0],tips[0]]
    path1=[muscle,elbows[1],tips[1]]
    bars=[curve(name+'_brass_rod',path0,m['iron'] if same_metal else m['brass'],.0041),
          curve(name+'_iron_rod',path1,m['iron'],.0041)]
    tipsob=[d.sphere(name+'_tip_'+str(i),.0048,tips[i],m['iron'] if same_metal or i else m['brass']) for i in range(2)]
    contacts=[d.sphere(name+'_contact_nerve',.0048,nerve,m['brass'] if not same_metal else m['iron']),
              d.sphere(name+'_contact_muscle',.0048,muscle,m['iron'])]
    p=_finish(name,before,root,{'leg':leg,'board':board,'rods':bars,'tips':tipsob,
                  'contact_bases':[nerve,muscle],'contact_objects':contacts,
                  'contact_elbows':elbows,'contact_center':tips[0].copy()},
              {'nerve':nerve,'muscle':muscle,'tip_brass':tips[0], 'tip_iron':tips[1],
               'contact':tips[0],'center':(0,-.015,.061)},
              ((-.17,-.118,0),(.17,.115,.14)))
    frog_contacts(p,0)
    return p


def frog_contacts(model, contact=0.0):
    """0: tips apart; 1: identical tip coordinates. Tissue bases remain fixed."""
    c=_clamp(contact); q=model['parts']
    bases=q['contact_bases']
    cc=q['contact_center']
    tips=[cc+Vector((-.020*(1-c),0,0)),cc+Vector((.020*(1-c),0,0))]
    elbows=q['contact_elbows']
    for i in range(2):
        _curve_points(q['rods'][i],[bases[i],elbows[i],tips[i]])
        q['tips'][i].location=tips[i]
    model['anchors']['tip_brass']=tips[0]
    model['anchors']['tip_iron']=tips[1]
    model['anchors']['contact']=(tips[0]+tips[1])*.5
    return {'local':[tips[0].copy(),tips[1].copy()],
            'world':[world_anchor(model,'tip_brass'),world_anchor(model,'tip_iron')],
            'distance':(tips[1]-tips[0]).length}


def covered_table(name='b2a_covered_table'):
    before,root=_begin(name);m=materials()
    d.box(name+'_top',(.29,.20,.018),(0,0,.11),m['wood'],.008)
    for x in (-.12,.12):
        for y in (-.075,.075):
            d.cyl(name+'_leg',.009,.103,(x,y,.053),m['wood'],verts=24)
    # Two nested rounded-rectangle rings form a drape, with no cloth simulation.
    verts=[];faces=[];n=48
    for layer in range(4):
        for i in range(n):
            a=2*math.pi*i/n
            x=.159*math.copysign(abs(math.cos(a))**.33,math.cos(a))
            y=.113*math.copysign(abs(math.sin(a))**.33,math.sin(a))
            if layer==0:x*=.82;y*=.82;z=.148
            elif layer==1:z=.144+.004*math.sin(4*a)
            elif layer==2:x*=1.03;y*=1.03;z=.077+.006*math.sin(12*a)
            else:x*=1.04;y*=1.04;z=.043+.006*math.sin(12*a)
            verts.append((x,y,z))
    for layer in range(3):
        for i in range(n):
            j=layer*n+i;k=layer*n+(i+1)%n
            faces.append((j,k,k+n,j+n))
    faces.append(tuple(range(n-1,-1,-1)))
    me=bpy.data.meshes.new(name+'_cloth_mesh');me.from_pydata(verts,[],faces)
    cloth=bpy.data.objects.new(name+'_cloth',me);d.link(cloth);d.put(cloth,m['cloth'])
    solid=cloth.modifiers.new('cloth_thickness','SOLIDIFY');solid.thickness=.0015
    for poly in me.polygons:poly.use_smooth=True
    footroot=d.empty(name+'_peeking_foot',(0,-.113,.048))
    for o in [d.sphere(name+'_peek_green',.025,(.035,-.119,.048),m['greenlight'],scale=(1.6,.7,.45)),
              d.sphere(name+'_peek_toe',.011,(.066,-.132,.046),m['greenlight'],scale=(1.5,.8,.5))]:d.parent(o,footroot)
    return _finish(name,before,root,{'cloth':cloth,'peeking_foot':footroot},
                   {'center':(0,0,.105),'foot':(.066,-.132,.046),'cloth':(0,0,.147)},
                   ((-.17,-.15,0),(.17,.13,.16)))


def cover_state(model,reveal=0.0,kick=0.0):
    q=model['parts'];r=_clamp(reveal)
    q['cloth'].location.z=.30*r+.003*math.sin(math.pi*_clamp(kick))
    q['cloth'].rotation_euler.y=-.35*r
    d.show(q['cloth'],r<.999)
    q['peeking_foot'].rotation_euler.x=-.85*_clamp(kick)


def rubbed_glass(name='b2a_rubbed_glass'):
    before,root=_begin(name);m=materials()
    glass=rod(name+'_glass_rod',(-.13,0,.035),(.13,0,.035),.012,m['glass'])
    for x in (-.13,.13):d.sphere(name+'_rounded_end',.012,(x,0,.035),m['rim'])
    cloth=d.box(name+'_rub_cloth',(.065,.075,.010),(.065,-.012,.049),m['cloth'],.012,rot=(0,0,.22))
    marks=[]
    for i in range(8):
        x=-.105+.030*i;rr=d.empty(name+'_plus_'+str(i),(x,-.014,.045))
        for o in [d.box(name+'_plus_h',(.011,.0015,.002),(x,-.014,.045),m['yellow'],.0005),
                  d.box(name+'_plus_v',(.002,.0015,.011),(x,-.014,.045),m['yellow'],.0005)]:d.parent(o,rr)
        marks.append(rr)
    spark=_spark(name+'_spark',(-.14,-.006,.04),.035);d.show(spark,False)
    p=_finish(name,before,root,{'rod':glass,'cloth':cloth,'charges':marks,'spark':spark},
              {'center':(0,0,.04),'tip':(-.14,0,.035),'cloth':(.065,0,.052)},
              ((-.165,-.055,.017),(.145,.055,.076)))
    glass_state(p,0,False)
    return p


def glass_state(model,charge=0.0,spark=False,rub=0.0):
    q=model['parts'];n=round(8*_clamp(charge))
    for i,ob in enumerate(q['charges']):d.show_tree(ob,i<n)
    d.show(q['spark'],bool(spark))
    q['cloth'].location.x=.065+.08*math.sin(2*math.pi*float(rub))


def static_generator(name='b2a_static_generator'):
    before,root=_begin(name);m=materials()
    d.box(name+'_wood_base',(.25,.14,.018),(0,0,.009),m['wood'],.007)
    for x in (-.095,.095):
        d.box(name+'_support',(.017,.030,.19),(x,0,.113),m['wood'],.004)
    rotor=d.empty(name+'_rotor',(0,0,.18))
    disc=d.cyl(name+'_glass_disc',.105,.008,(0,0,.18),m['glass'],rot=(math.pi/2,0,0),verts=64)
    rim=d.torus(name+'_glass_edge',.105,.0028,(0,0,.18),m['rim'],rot=(math.pi/2,0,0))
    for ob in (disc,rim):d.parent(ob,rotor)
    for a in range(0,360,45):
        ang=math.radians(a)
        ob=rod(name+'_radial_etch',(0,-.005,.18),(.095*math.cos(ang),-.005,.18+.095*math.sin(ang)),.0007,m['rim']);d.parent(ob,rotor)
    axle=rod(name+'_axle',(0,-.07,.18),(0,.055,.18),.006,m['brass'])
    crank=d.empty(name+'_crank',(0,-.07,.18))
    o=rod(name+'_crank_arm',(0,-.07,.18),(.036,-.07,.18),.004,m['iron']);d.parent(o,crank)
    o=rod(name+'_crank_handle',(.036,-.07,.18),(.036,-.103,.18),.007,m['wood']);d.parent(o,crank)
    d.box(name+'_cloth_cushion',(.035,.018,.045),(-.070,-.012,.18),m['cloth'],.006)
    rod(name+'_collector_support',(.115,.025,.025),(.115,.025,.24),.005,m['glass'])
    rod(name+'_collector',(.052,-.02,.235),(.128,-.02,.235),.007,m['brass'])
    for i in range(5):rod(name+'_comb',(.052+i*.009,-.015,.23),(.052+i*.009,-.003,.23),.0009,m['brass'])
    d.sphere(name+'_terminal',.014,(.14,-.02,.235),m['brass'])
    rod(name+'_return',(.21,-.02,.02),(.21,-.02,.23),.004,m['brass'])
    rod(name+'_return_link',(.21,-.02,.23),(.186,-.02,.235),.004,m['brass'])
    d.sphere(name+'_return_ball',.009,(.186,-.02,.235),m['brass'])
    spark=_spark(name+'_discharge',(.165,-.02,.235),.033);d.show(spark,False)
    return _finish(name,before,root,{'rotor':rotor,'crank':crank,'spark':spark,'axle':axle},
                   {'center':(0,0,.17),'disc':(0,0,.18),'handle':(.036,-.10,.18),
                    'terminal':(.14,-.02,.235),'spark':(.165,-.02,.235)},
                   ((-.13,-.112,0),(.22,.08,.291)))


def generator_state(model,turn=0.0,spark=False):
    q=model['parts'];angle=2*math.pi*float(turn)
    q['rotor'].rotation_euler.y=angle
    q['crank'].rotation_euler.y=angle
    d.show(q['spark'],bool(spark))


def dry_cell(name='b2a_dry_cell'):
    before,root=_begin(name);m=materials()
    body=d.cyl(name+'_body',.023,.105,(0,0,.061),_mat('cell_blue','#456ba4',.48))
    d.cyl(name+'_bottom',.0235,.006,(0,0,.010),m['iron'])
    d.cyl(name+'_top',.0235,.007,(0,0,.117),m['iron'])
    d.cyl(name+'_positive_nub',.008,.008,(0,0,.124),m['brass'])
    for z in (.034,.091):d.torus(name+'_cream_band',.0234,.002,(0,0,z),m['ivory'])
    return _finish(name,before,root,{'body':body},
                   {'center':(0,0,.063),'top_terminal':(0,0,.128),'bottom_terminal':(0,0,.007)},
                   ((-.024,-.024,.007),(.024,.024,.128)))


def volta_pile(name='b2a_volta_pile',units=30):
    if not isinstance(units,int) or not 1<=units<=40:raise ValueError('units must be 1..40')
    before,root=_begin(name);m=materials();r=.044;height=.0066
    d.cyl(name+'_base',.075,.016,(0,0,.008),_mat('pile_base_dark','#343d46',.72))
    groups=[];layers=[];droplets=[];anchors={'center':(0,0,.024+units*height*.5),
                                'bottom_terminal':(.056,-.007,.023)}
    bottom=d.box(name+'_bottom_lug',(.035,.014,.003),(.044,-.007,.023),m['zinc'],.001)
    for i in range(units):
        unit=d.empty(name+'_unit_%02d'%i,(0,0,.024+i*height))
        ll={}
        for j,(kind,material,dz,thick) in enumerate([
                ('zinc',m['zinc'],.001,.002),('paper',m['wetpaper'],.0033,.0026),
                ('copper',m['copper'],.0056,.002)]):
            ob=d.cyl(name+'_%02d_'%i+kind,r+(.0008 if kind=='paper' else 0),thick,
                     (0,0,.024+i*height+dz),material,verts=48)
            d.parent(ob,unit);ll[kind]=ob
            anchors['%s_%02d'%(kind,i)]=Vector((0,-r-.001,.024+i*height+dz))
        groups.append(unit);layers.append(ll)
        wet=[]
        for k in range(3):
            a=-math.pi/2+(k-1)*.30
            ob=d.sphere(name+'_%02d_waterdrop_%d'%(i,k),.0019,
                        (.045*math.cos(a),.045*math.sin(a),.024+i*height+.0033),
                        m['water'],scale=(.9,.85,.70),seg_=12,ring=8)
            d.parent(ob,unit);wet.append(ob)
        droplets.append(wet)
    topz=.024+units*height+.0014
    top=d.box(name+'_top_lug',(.035,.014,.003),(.044,-.007,topz),m['copper'],.001)
    for i in range(3):
        a=i*2*math.pi/3+math.pi/2;x=.061*math.cos(a);y=.061*math.sin(a)
        d.cyl(name+'_glass_support',.0043,topz+.013,(x,y,(topz+.013)*.5+.010),m['glass'],verts=24)
        for z in (.022,topz+.014):d.sphere(name+'_support_glint',.0045,(x,y,z),m['rim'])
    glow=[]
    for i in range(units):
        ob=d.sphere(name+'_signal_%02d'%i,.0034,(.047,-.004,.027+i*height),m['yellow'],seg_=12,ring=8)
        d.show(ob,False);glow.append(ob)
    anchors['top_terminal']=Vector((.0615,-.007,topz))
    for kind in ('zinc','paper','copper'):anchors[kind]=anchors[kind+'_00'].copy()
    p=_finish(name,before,root,{'units':groups,'layers':layers,'top_lug':top,'bottom_lug':bottom,
                    'signals':glow,'waterdrops':droplets,'count':units,'unit_height':height,'wet_material':m['wetpaper'],
                    'dry_material':m['drypaper']},anchors,
              ((-.077,-.077,0),(.077,.077,topz+.03)))
    p['layer_centers']=[{kind:Vector((0,0,.024+i*height+dz))
                         for kind,dz in [('zinc',.001),('paper',.0033),('copper',.0056)]}
                        for i in range(units)]
    return p


def pile_state(model,visible_units=None,explode=0.0,dry=False,glow=0.0):
    q=model['parts'];n=q['count'] if visible_units is None else max(0,min(q['count'],int(visible_units)))
    ex=_clamp(explode);gh=q['unit_height'];topz=.024+n*gh+.0014+.060*ex
    for i,unit in enumerate(q['units']):
        d.show_tree(unit,i<n)
        for j,kind in enumerate(('zinc','paper','copper')):
            ob=q['layers'][i][kind]
            base=model['baseline'][ob.name][0]
            # Explode upwards, never put the lowest plate through the tabletop.
            ob.location=base+Vector((0,0,j*.030*ex))
            dz={'zinc':.001,'paper':.0033,'copper':.0056}[kind]
            model['anchors']['%s_%02d'%(kind,i)]=Vector((0,-.045,.024+i*gh+dz+j*.030*ex))
            model['layer_centers'][i][kind]=Vector((0,0,.024+i*gh+dz+j*.030*ex))
            if kind=='paper':d.put(ob,q['dry_material'] if dry else q['wet_material'])
        for drop in q['waterdrops'][i]:
            drop.location=model['baseline'][drop.name][0]+Vector((0,0,.030*ex))
            d.show(drop,i<n and not dry)
        d.show(q['signals'][i],i<n and float(glow)>i/max(1,n))
    q['top_lug'].location.z=topz
    d.show(q['top_lug'],n>0)
    model['anchors']['top_terminal']=Vector((.0615,-.007,topz))
    model['anchors']['center']=Vector((0,0,.024+n*gh*.5))
    for kind in ('zinc','paper','copper'):model['anchors'][kind]=model['anchors'][kind+'_00'].copy()


def electroscope(name='b2a_electroscope'):
    before,root=_begin(name);m=materials()
    d.cyl(name+'_wood_base',.072,.014,(0,0,.007),m['wood'])
    background=d.box(name+'_dark_leaf_background',(.15,.006,.185),(0,.069,.117),
                     _mat('leaf_background','#263d49',.90),.004)
    # Open-shell glass profile: no opaque solid fills the viewing volume.
    profile=[(.058,.015),(.060,.030),(.060,.164),(.055,.182),(.027,.202),(.026,.226)]
    vertices=[];faces=[];N=64
    for r,z in profile:
        vertices.extend((r*math.cos(i*2*math.pi/N),r*math.sin(i*2*math.pi/N),z) for i in range(N))
    for j in range(len(profile)-1):
        for i in range(N):faces.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
    me=bpy.data.meshes.new(name+'_glass_mesh');me.from_pydata(vertices,[],faces)
    jar=bpy.data.objects.new(name+'_glass_jar',me);d.link(jar);d.put(jar,m['glass'])
    for z,r in [( .024,.060),(.225,.026)]:d.torus(name+'_glass_rim',r,.002,(0,0,z),m['rim'])
    d.cyl(name+'_insulating_cork',.025,.017,(0,0,.222),m['cloth'])
    wire=rod(name+'_head_wire',(0,0,.153),(0,0,.264),.0032,m['brass'])
    # Volta's instrument used a condenser. Keep the upper head as a visible pair
    # of metal plates, not a bare modern single-ball electroscope.
    knob=d.cyl(name+'_lower_condenser_plate',.028,.003,(0,0,.268),m['brass'])
    upper=d.cyl(name+'_upper_condenser_plate',.028,.003,(0,0,.276),m['brass'])
    handle=d.cyl(name+'_insulated_plate_handle',.006,.026,(0,0,.291),m['glass'],verts=24)
    d.sphere(name+'_handle_end',.007,(0,0,.307),m['rim'])
    leaves=[]
    for i in range(2):
        hinge=d.empty(name+'_leaf_hinge_'+str(i),(0,(-.001 if i==0 else .001),.154))
        verts=[(-.0018,-.001 if i==0 else .001,.154),(.0018,-.001 if i==0 else .001,.154),
               (.013,-.001 if i==0 else .001,.072),(-.013,-.001 if i==0 else .001,.072)]
        lm=bpy.data.meshes.new(name+'_leaf_mesh_'+str(i));lm.from_pydata(verts,[],[(0,1,2,3)])
        ob=bpy.data.objects.new(name+'_gold_leaf_'+str(i),lm);d.link(ob);d.put(ob,m['gold']);d.parent(ob,hinge)
        so=ob.modifiers.new('very_thin_gold','SOLIDIFY');so.thickness=.0005
        leaves.append(hinge)
    p=_finish(name,before,root,{'jar':jar,'wire':wire,'knob':knob,
                              'condenser_upper':upper,'condenser_handle':handle,
                              'leaf_hinges':leaves,'dark_background':background},
                   {'center':(0,0,.145),'knob':(.028,0,.268),'leaf_left':(-.002,0,.072),
                    'leaf_right':(.002,0,.072),'leaf_pivot':(0,0,.154)},
                   ((-.078,-.073,0),(.078,.075,.315)))
    electroscope_state(p,0)
    return p


def electroscope_state(model,open=0.0):
    q=model['parts'];a=math.radians(12)*_clamp(open);L=.082
    for i,hinge in enumerate(q['leaf_hinges']):hinge.rotation_euler.y=a if i==0 else -a
    model['anchors']['leaf_left']=Vector((-L*math.sin(a),-.001,.154-L*math.cos(a)))
    model['anchors']['leaf_right']=Vector((L*math.sin(a),.001,.154-L*math.cos(a)))
    model['leafTips']=[model['anchors']['leaf_left'].copy(),model['anchors']['leaf_right'].copy()]


def _along(points,u):
    ls=[(Vector(b)-Vector(a)).length for a,b in zip(points,points[1:])]
    distance=_clamp(u)*sum(ls)
    for i,length in enumerate(ls):
        if distance<=length or i==len(ls)-1:return Vector(points[i]).lerp(Vector(points[i+1]),distance/max(length,1e-9))
        distance-=length


def water_analogy(name='b2a_water_analogy'):
    before,root=_begin(name);m=materials();waters=[];rims=[]
    leftbase=.135;rightbase=.035
    for side,x,base in [('left',-.135,leftbase),('right',.135,rightbase)]:
        d.box(name+'_'+side+'_plinth',(.11,.10,base),(x,0,base*.5),m['wood'],.006)
        d.box(name+'_'+side+'_tank_bottom',(.090,.074,.006),(x,0,base+.003),m['rim'],.003)
        for xx in (-.045,.045):d.box(name+'_'+side+'_tank_side',(.003,.074,.118),(x+xx,0,base+.062),m['glass'],.001)
        for yy in (-.037,.037):d.box(name+'_'+side+'_tank_face',(.090,.003,.118),(x,yy,base+.062),m['glass'],.001)
        for yy in (-.039,.039):rims.append(rod(name+'_'+side+'_rim',(x-.047,yy,base+.122),(x+.047,yy,base+.122),.0015,m['rim']))
        waters.append(d.box(name+'_'+side+'_water',(.083,.067,.086),(x,0,base+.049),m['water'],.002))
    main=[(-.090,-.015,leftbase+.023),(-.055,-.054,leftbase+.023),
          (.045,-.054,rightbase+.029),(.090,-.015,rightbase+.029)]
    back=[(.110,.035,rightbase+.018),(.085,.073,rightbase+.018),
          (0,.073,.057),(-.073,.073,leftbase+.079),(-.108,.035,leftbase+.079)]
    mainpipe=curve(name+'_down_pipe',main,m['rim'],.008)
    returnpipe=curve(name+'_return_pipe',back,m['rim'],.0065)
    pump=d.empty(name+'_pump',(0,.073,.061))
    case=d.cyl(name+'_pump_case',.028,.020,(0,.073,.061),m['brass'],rot=(math.pi/2,0,0))
    wheel=d.empty(name+'_pump_wheel',(0,.058,.061))
    for a in range(0,360,90):
        ang=math.radians(a);ob=rod(name+'_pump_spoke',(0,.058,.061),(.024*math.cos(ang),.058,.061+.024*math.sin(ang)),.002,m['wood']);d.parent(ob,wheel)
    handle=d.sphere(name+'_pump_handle',.006,(.024,.052,.061),m['wood']);d.parent(handle,wheel)
    d.parent(case,pump);d.parent(wheel,pump)
    droplets=[];return_drops=[]
    for i in range(12):droplets.append(d.sphere(name+'_flow_%02d'%i,.004,main[0],m['flow'],seg_=12,ring=8))
    for i in range(10):return_drops.append(d.sphere(name+'_return_%02d'%i,.0035,back[0],m['flow'],seg_=12,ring=8))
    p=_finish(name,before,root,{'water':waters,'bases':[leftbase,rightbase],
                'main_pipe':mainpipe,'return_pipe':returnpipe,'main_path':main,'return_path':back,
                'drops':droplets,'return_drops':return_drops,'pump':pump,'wheel':wheel},
              {'center':(0,0,.14),'left_surface':(-.135,0,.227),'right_surface':(.135,0,.100),
               'pipe':(0,-.054,.12),'pump':(0,.073,.061)},
              ((-.192,-.064,0),(.192,.105,.264)))
    water_state(p,pump=False)
    return p


def water_state(model,levels=(.75,.45),flow=0.0,pump=False,turn=0.0):
    q=model['parts'];n=_clamp(flow)
    for i,ob in enumerate(q['water']):
        h=max(.001,.106*_clamp(levels[i]));ob.scale.z=h/.086
        ob.location.z=q['bases'][i]+.006+h*.5
        model['anchors']['left_surface' if i==0 else 'right_surface']=Vector(((-.135 if i==0 else .135),0,q['bases'][i]+.006+h))
    for i,ob in enumerate(q['drops']):
        ob.location=_along(q['main_path'],(float(turn)+i/12)%1)
        d.show(ob,n>0 and levels[0]>.01)
    for i,ob in enumerate(q['return_drops']):
        ob.location=_along(q['return_path'],(float(turn)+i/10)%1)
        d.show(ob,bool(pump) and n>0)
    d.show(q['return_pipe'],bool(pump));d.show_tree(q['pump'],bool(pump))
    q['wheel'].rotation_euler.y=2*math.pi*float(turn)


def torpedo_ray(name='b2a_torpedo_ray'):
    before,root=_begin(name);m=materials();gray=_mat('ray_bluegray','#7399a3',.57)
    body=d.sphere(name+'_flat_body',.071,(0,0,.025),gray,scale=(1.35,1,.20))
    d.sphere(name+'_belly',.059,(0,-.010,.018),m['ivory'],scale=(1.35,.95,.12))
    tail=curve(name+'_tail',[(0,.060,.024),(.010,.108,.023),(.027,.149,.022)],gray,.008)
    for x in (-.018,.018):
        d.sphere(name+'_eye',.005,(x,-.026,.041),m['dark'],scale=(1,1,.55),seg_=16,ring=8)
    for x in (-.040,.040):
        d.sphere(name+'_electric_patch',.015,(x,0,.039),_mat('ray_patch','#aac7bb',.62),scale=(1,.9,.17))
    spark=_spark(name+'_comic_spark',(.095,-.020,.05),.035);d.show(spark,False)
    return _finish(name,before,root,{'body':body,'tail':tail,'spark':spark},
                   {'center':(0,0,.025),'touch':(.079,-.020,.031)},
                   ((-.10,-.074,.009),(.116,.158,.071)))


def smoke_alarm(name='b2a_smoke_alarm'):
    before,root=_begin(name);m=materials()
    d.box(name+'_ceiling',(.20,.15,.012),(0,0,.245),m['wood'],.006)
    d.cyl(name+'_alarm_case',.049,.022,(0,0,.226),m['ivory'])
    for i in range(14):
        a=i*2*math.pi/14
        d.box(name+'_vent',(.005,.012,.0018),(.037*math.cos(a),.037*math.sin(a),.214),m['dark'],.001,rot=(0,0,a))
    led=d.sphere(name+'_alarm_led',.004,(.022,-.012,.212),_mat('alarm_red','#e95042',.4,emit='#e95042',strength=.0),scale=(1,1,.45))
    # Smoke originates in a separate source BELOW the alarm, never in the alarm.
    source=d.cyl(name+'_smoke_source',.020,.026,(0,0,.014),_mat('smoke_source','#b96e48',.68))
    smoke=[]
    for i in range(10):
        smoke.append(d.sphere(name+'_smoke_%02d'%i,.014,(0,0,.05+i*.014),
                              _mat('smoke','#bab7b0',.9,alpha=.40),scale=(1.25,.9,1.1),seg_=16,ring=8))
    p=_finish(name,before,root,{'source':source,'smoke':smoke,'led':led},
              {'center':(0,0,.135),'alarm':(0,0,.219),'smoke_source':(0,0,.028)},
              ((-.102,-.077,0),(.102,.077,.252)))
    alarm_state(p,0,False)
    return p


def alarm_state(model,progress=0.0,ring=False):
    q=model['parts'];p=_clamp(progress)
    for i,ob in enumerate(q['smoke']):
        v=(p+i/10)%1
        ob.location=(.012*math.sin(v*8+i),.009*math.cos(v*5+i),.04+.155*v)
        ob.scale=(.6+.9*v,.65+.65*v,.7+.5*v)
        d.show(ob,p>0)
    d.set_emit(q['led'].data.materials[0],2.0 if ring else 0.0)


def scientist(name='b2a_scientist',role='galvani'):
    if role not in ('galvani','volta','assistant'):raise ValueError(role)
    before,root=_begin(name);m=materials()
    color={'galvani':'#29262b','volta':'#777b7f','assistant':'#4b695f'}[role]
    coat=_mat(role+'_coat',color,.63)
    d.cyl(name+'_body',.025,.066,(0,0,.043),coat)
    d.sphere(name+'_head',.023,(0,0,.101),m['skin'])
    for x in (-.013,.013):
        d.box(name+'_shoe',(.019,.035,.012),(x,-.005,.006),m['dark'],.004)
    arms=[]
    for side in (-1,1):
        hinge=d.empty(name+'_arm_hinge_'+str(side),(.025*side,0,.068))
        arm=rod(name+'_arm_'+str(side),(.025*side,0,.068),(.039*side,-.011,.032),.009,coat)
        hand=d.sphere(name+'_hand_'+str(side),.0095,(.039*side,-.011,.032),m['skin'])
        d.parent(arm,hinge);d.parent(hand,hinge);arms.append(hinge)
    if role=='galvani':
        hair=_mat('wig','#eee7da',.8)
        for x in (-.022,.022):
            for i in range(3):d.sphere(name+'_wig_curl',.009,(x,.004,.101-i*.010),hair,seg_=16,ring=8)
        d.sphere(name+'_wig_top',.024,(0,.003,.113),hair,scale=(1,1,.52))
    elif role=='volta':
        hair=_mat('volta_hair','#584436',.68)
        d.sphere(name+'_hair_top',.024,(0,.004,.115),hair,scale=(1,1,.43))
        d.sphere(name+'_tied_hair',.008,(0,.025,.094),hair,scale=(.75,1.25,1.3))
        d.torus(name+'_hair_tie',.006,.0015,(0,.027,.095),m['ivory'],rot=(math.pi/2,0,0))
    else:
        d.box(name+'_apron',(.037,.004,.052),(0,-.024,.044),m['ivory'],.003)
        d.sphere(name+'_hair',.024,(0,.003,.116),m['dark'],scale=(1,1,.35))
    return _finish(name,before,root,{'arms':arms,'role':role},
                   {'center':(0,0,.061),'left_hand':(-.039,-.011,.032),
                    'right_hand':(.039,-.011,.032),'head':(0,0,.101)},
                   ((-.051,-.033,0),(.051,.041,.134)))


def scientist_state(model,left=0.0,right=0.0,jump=0.0,shake=0.0):
    # The caller controls any walking/jump root motion. Internal arms remain local.
    q=model['parts']
    q['arms'][0].rotation_euler.x=-1.45*_clamp(left)
    q['arms'][1].rotation_euler.x=-1.45*_clamp(right)
    q['arms'][0].rotation_euler.y=-.4*_clamp(left)
    q['arms'][1].rotation_euler.y=.4*_clamp(right)
    # Expose motion offsets rather than silently relocating the external root.
    model['suggested_root_offset']=Vector((.003*math.sin(float(shake)*math.tau),0,.025*_clamp(jump)))


def door_knob(name='b2a_door_knob'):
    before,root=_begin(name);m=materials()
    door=d.box(name+'_door',(.14,.014,.22),(0,.008,.11),m['wood'],.007)
    d.box(name+'_inset',(.105,.003,.157),(0,-.001,.119),_mat('door_inset','#b07c4e',.65),.005)
    d.cyl(name+'_knob_plate',.020,.004,(.042,-.004,.103),m['brass'],rot=(math.pi/2,0,0))
    rod(name+'_knob_stem',(.042,-.006,.103),(.042,-.024,.103),.006,m['brass'])
    knob=d.sphere(name+'_knob',.014,(.042,-.027,.103),m['brass'])
    spark=_spark(name+'_spark',(.063,-.033,.104),.025);d.show(spark,False)
    return _finish(name,before,root,{'door':door,'knob':knob,'spark':spark},
                   {'center':(0,0,.11),'knob':(.042,-.040,.103),'spark':(.063,-.033,.104)},
                   ((-.071,-.050,0),(.083,.018,.221)))


def _terrella_compass(name,normal,tangent,radius,m):
    """Two-axis gimbal. Needle +Y/red is always its magnetic north end."""
    normal=Vector(normal).normalized();tangent=Vector(tangent).normalized()
    # Clearance exceeds the 33 mm half-needle's 72-degree vertical excursion,
    # so the downward red end never passes through the solid globe surface.
    center=normal*(radius+.037)
    root=d.empty(name,center)
    # A tiny three-legged stand touches the actual stone, not a floating needle.
    for k in range(3):
        a=k*math.tau/3
        right=tangent.cross(normal).normalized()
        side=right*math.cos(a)+tangent*math.sin(a)
        ob=rod(name+'_stand_'+str(k),normal*(radius+.002)+side*.012,
               center+side*.010,.0013,m['brass']);d.parent(ob,root)
    outer=d.torus(name+'_outer_gimbal',.022,.0015,center,m['brass'])
    d.parent(outer,root)
    pitch=d.empty(name+'_pitch_hinge',center);d.parent(pitch,root)
    inner=d.torus(name+'_inner_gimbal',.019,.0011,center,m['iron'],rot=(0,math.pi/2,0))
    d.parent(inner,pitch)
    needle=d.empty(name+'_needle',center);d.parent(needle,pitch)
    halves=[]
    for sign,color in [(1,_mat('needle_north_red','#d6453d',.43)),
                       (-1,m['ivory'])]:
        vs=[center+Vector((0,0,.001)),center+Vector((-.005,0,.001)),
            center+Vector((0,sign*.033,.001)),center+Vector((.005,0,.001))]
        me=bpy.data.meshes.new(name+'_needle_mesh_'+str(sign));me.from_pydata(vs,[],[(0,1,2,3)])
        ob=bpy.data.objects.new(name+'_red_north_half' if sign==1 else name+'_white_south_half',me)
        d.link(ob);d.put(ob,color);d.parent(ob,needle)
        so=ob.modifiers.new('needle_thickness','SOLIDIFY');so.thickness=.0010
        halves.append(ob)
    pin=d.sphere(name+'_pin',.0035,center,m['brass']);d.parent(pin,pitch)
    # Basis columns are right / geographic-north tangent / surface normal.
    right=tangent.cross(normal).normalized()
    basis=Matrix((right,tangent,normal)).transposed()
    root.rotation_euler=basis.to_euler()
    return {'root':root,'pitch':pitch,'needle':needle,'halves':halves,
            'normal':normal,'tangent':tangent,'center':center,'length':.033}


def _field_arrow(name,m):
    root=d.empty(name)
    # Local +Y is the one and only direction of this arrow.
    shaft=rod(name+'_shaft',(0,-.006,0),(0,.003,0),.0014,m)
    d.parent(shaft,root)
    for sign in (-1,1):
        ob=rod(name+'_head_'+str(sign),(0,.006,0),(sign*.003,.001,0),.0014,m)
        d.parent(ob,root)
    return root


def terrella(name='b2a_terrella'):
    """B-1 stone sphere: geographic N is blue magnetic S at local +Z.

    The external dipole moment is -Z. Geographic south is red magnetic N at -Z.
    Keep the factory root upright for S3: blue north above red south.
    No camera-dependent sign tricks are used for the red north end of a needle.
    """
    before,root=_begin(name);m=materials();R=.100
    rockmat=_mat('magnetite','#555550',.62,metal=.12)
    rock=d.sphere(name+'_stone',R,(0,0,0),rockmat,seg_=64,ring=32)
    # The inherited rough, carved tabletop stone appearance, not a blue Earth.
    rock.shape_key_add(name='Basis');rough=rock.shape_key_add(name='slight_stone_roughness')
    for v in rough.data:
        q=v.co.normalized()
        v.co*=1+.025*math.sin(7*q.x+3*q.y)*math.cos(5*q.z+2*q.y)
    rough.value=1
    transparent=_mat('magnetite_cutaway','#918e87',.48,metal=.1,alpha=.17)
    # Low-contrast raised continent silhouettes identify a small Earth without
    # replacing the inherited dark carved-stone world with a glossy blue globe.
    landmat=_mat('terrella_land','#7c8d75',.80)
    continents=[]
    outlines={
        'africa':[(-17,36),(10,37),(34,30),(51,12),(41,-12),(32,-35),(18,-35),(9,-12),(-8,4),(-17,20)],
        'europe':[(-10,36),(-10,44),(-2,49),(7,56),(12,70),(28,71),(39,56),(30,43),(19,40),(10,37)],
        'britain':[(-6,50),(-8,54),(-5,58),(-2,59),(1,52)],
        'asia':[(28,70),(68,73),(112,68),(144,60),(159,50),(142,37),(122,24),(111,5),(97,7),(79,7),(70,24),(44,38)],
        'australia':[(113,-22),(114,-34),(130,-39),(142,-39),(153,-29),(145,-15),(132,-12),(122,-16)],
        'north_america':[(-166,63),(-135,71),(-105,72),(-60,52),(-83,28),(-104,20),(-118,35),(-145,50)],
        'south_america':[(-81,10),(-64,10),(-47,-5),(-35,-12),(-51,-36),(-68,-55),(-75,-30)],
    }
    for cname,outline in outlines.items():
        # A center fan is deliberately slightly raised so it never z-fights.
        lat0=sum(v[1] for v in outline)/len(outline)
        lon0=sum(v[0] for v in outline)/len(outline)
        def geo(lon,lat):
            a=math.radians(lon-70);b=math.radians(lat);r=R+.0011
            return (r*math.cos(b)*math.sin(a),-r*math.cos(b)*math.cos(a),r*math.sin(b))
        fan=[Vector(geo(lon0,lat0))]+[Vector(geo(lon,lat)) for lon,lat in outline]
        vertices=[];faces=[];steps=10
        # Re-project a subdivided fan onto the sphere; a single flat polygon
        # would cut through the stone and leave most of its land invisible.
        for i in range(len(outline)):
            va,vb,vc=fan[0],fan[i+1],fan[(i+1)%len(outline)+1]
            indices={}
            for ii in range(steps+1):
                for jj in range(steps+1-ii):
                    vv=va*(1-(ii+jj)/steps)+vb*(ii/steps)+vc*(jj/steps)
                    indices[ii,jj]=len(vertices);vertices.append(vv.normalized()*(R+.0012))
            for ii in range(steps):
                for jj in range(steps-ii):
                    faces.append((indices[ii,jj],indices[ii+1,jj],indices[ii,jj+1]))
                    if ii+jj<steps-1:
                        faces.append((indices[ii+1,jj],indices[ii+1,jj+1],indices[ii,jj+1]))
        me=bpy.data.meshes.new(name+'_'+cname+'_mesh');me.from_pydata(vertices,[],faces)
        for poly in me.polygons:poly.use_smooth=True
        ob=bpy.data.objects.new(name+'_'+cname,me);d.link(ob);d.put(ob,landmat)
        continents.append(ob)
    red=_mat('magnetic_N_red','#d6453d',.40)
    blue=_mat('magnetic_S_blue','#3a6fd8',.40)
    marks=[]
    for z,material in [(-R-.001,red),(R+.001,blue)]:
        marks.append(d.sphere(name+'_geographic_south_mark' if z<0 else name+'_geographic_north_mark',
                               .011,(0,0,z),material,scale=(1,1,.38)))
    magnetic=[]
    for z,material in [(-.034,red),(.034,blue)]:
        magnetic.append(d.box(name+'_inside_magnetic_N' if z<0 else name+'_inside_magnetic_S',
                              (.026,.026,.068),(0,0,z),material,.004))
        d.show(magnetic[-1],False)
    # Solid wood support sits below the initial sphere. Parent/root may move it.
    base=d.cyl(name+'_stand_base',.062,.012,(0,0,-.132),m['wood'])
    saddle=d.torus(name+'_saddle',.051,.004,(0,0,-.085),m['brass'])
    for x in (-.038,.038):rod(name+'_stand_arm',(x,0,-.128),(x,0,-.092),.0032,m['brass'])
    loops=[];arrows=[];paths=[];field_particles=[]
    fieldmat=_mat('field_cream','#e4d8b0',.5,emit='#dbc892',strength=.16)
    arrowmat=_mat('field_arrow_whitegold','#fff4ca',.42,emit='#fff2bb',strength=.65)
    # Six mirrored schematic field loops, not a quantitative field plot. Their
    # surface tangents agree with the 72-degree gimbal needle directions, while
    # the bounded symmetric bulge keeps the Earth itself large in the frame.
    default_dip=math.radians(72)
    lat=math.atan(math.tan(default_dip)/2)
    phis=[0,math.pi,math.pi/3,2*math.pi/3,4*math.pi/3,5*math.pi/3]
    start=Vector((R*math.cos(lat),0,-R*math.sin(lat)))
    end=Vector((R*math.cos(lat),0,R*math.sin(lat)))
    south_dir=Vector((math.sin(lat),0,math.cos(lat)))*math.cos(default_dip)+start.normalized()*math.sin(default_dip)
    north_dir=Vector((-math.sin(lat),0,math.cos(lat)))*math.cos(default_dip)-end.normalized()*math.sin(default_dip)
    c1=start+south_dir*.175;c2=end-north_dir*.175
    for i,phi in enumerate(phis):
        points=[]
        for j in range(121):
            u=j/120
            v=(1-u)**3*start+3*(1-u)**2*u*c1+3*(1-u)*u*u*c2+u**3*end
            points.append(Vector((v.x*math.cos(phi),v.x*math.sin(phi),v.z)))
        ob=curve(name+'_fieldloop_%d'%i,points,fieldmat,.0019)
        arrow=_field_arrow(name+'_field_arrow_%d'%i,arrowmat)
        loops.append(ob);arrows.append(arrow);paths.append(points)
        d.show(ob,False);d.show_tree(arrow,False)
        dots=[]
        for k in range(3):
            dot=d.sphere(name+'_field_particle_%d_%d'%(i,k),.0030,points[0],arrowmat,seg_=12,ring=8)
            d.show(dot,False);dots.append(dot)
        field_particles.append(dots)
    ns=Vector((math.cos(lat),0,-math.sin(lat)))
    nn=Vector((math.cos(lat),0,math.sin(lat)))
    ts=Vector((math.sin(lat),0,math.cos(lat)))
    tn=Vector((-math.sin(lat),0,math.cos(lat)))
    south=_terrella_compass(name+'_south_compass',ns,ts,R,m)
    north=_terrella_compass(name+'_north_compass',nn,tn,R,m)
    # Local tangent-plane tiles explicitly show what 'above the ground' means.
    surfaces=[];horizons=[]
    for side,comp in [('south',south),('north',north)]:
        tile=d.box(name+'_'+side+'_surface_plane',(.060,.060,.002),comp['normal']*(R+.001),
                   _mat('surface_ground','#c5b78c',.82),.004)
        tile.rotation_euler=comp['root'].rotation_euler.copy()
        d.show(tile,False);surfaces.append(tile)
        center=comp['center']
        line=curve(name+'_'+side+'_white_horizontal',[center-comp['tangent']*.043,
                                                    center+comp['tangent']*.043],
                   _mat('horizontal_white','#fff9e5',.55,emit='#fff9e5',strength=.25),.0018)
        d.show(line,False);horizons.append(line)
    p=_finish(name,before,root,{'stone':rock,'stone_material':rockmat,
                'cutaway_material':transparent,'pole_marks':marks,'inside_magnet':magnetic,
                'fieldloops':loops,'field_arrows':arrows,'field_paths':paths,'field_particles':field_particles,
                'compassSouth':south,'compassNorth':north,'surface_planes':surfaces,
                'horizons':horizons,'continents':continents,
                'base':base,'saddle':saddle,'radius':R,'nominal_latitude':lat},
              {'center':(0,0,0),'geographicSouth':(0,0,-R),
               'geographicNorth':(0,0,R),'magneticN':(0,0,-.068),'magneticS':(0,0,.068),
               'southSurface':ns*R,'northSurface':nn*R,
               'compassSouth':south['center'],'compassNorth':north['center'],
               'groundSouth':ns*(R+.001),'groundNorth':nn*(R+.001),
               'horizonSouth':south['center'],'horizonNorth':north['center'],
               'compassSouthNeedleTip':south['center'],'compassNorthNeedleTip':north['center']},
              ((-.175,-.175,-.175),(.175,.175,.175)))
    terrella_state(p)
    return p


def terrella_state(model,field=0.0,cutaway=False,dip=72.0,phase=None,surface=False):
    """dip is degrees. South +dip is outward; north -dip is into the stone.

    field=0 hides loops; any positive field shows them.  phase supplies a
    continuously increasing value for one-direction travel along all six
    paths (not back-and-forth ping-pong). surface adds tangent ground tiles.
    """
    q=model['parts'];angle=math.radians(max(0,min(89.9,float(dip))))
    d.put(q['stone'],q['cutaway_material'] if cutaway else q['stone_material'])
    for ob in q['inside_magnet']:d.show(ob,bool(cutaway))
    for ob in q['continents']:d.show(ob,not cutaway)
    for ob in q['surface_planes']:d.show(ob,bool(surface))
    for ob in q['horizons']:d.show(ob,bool(surface))
    for key,sign in [('South',1),('North',-1)]:
        comp=q['compass'+key]
        comp['pitch'].rotation_euler.x=sign*angle
        direction=comp['tangent']*math.cos(angle)+comp['normal']*(sign*math.sin(angle))
        needle_normal=comp['normal']*math.cos(angle)-comp['tangent']*(sign*math.sin(angle))
        model['anchors']['compass'+key+'NeedleTip']=comp['center']+direction*comp['length']+needle_normal*.001
    ph=float(field if phase is None else phase)
    for i,(ob,arrow,points) in enumerate(zip(q['fieldloops'],q['field_arrows'],q['field_paths'])):
        yes=float(field)>0
        d.show(ob,yes);d.show_tree(arrow,yes)
        u=(ph*.19+i*.137)%1
        index=min(len(points)-2,int(u*(len(points)-1)))
        f=u*(len(points)-1)-index
        arrow.location=points[index].lerp(points[index+1],f)
        tangent=points[index+1]-points[index]
        arrow.rotation_euler=tangent.to_track_quat('Y','Z').to_euler()
        for k,dot in enumerate(q['field_particles'][i]):
            u2=(ph*.19+i*.137+k/3)%1
            j=min(len(points)-2,int(u2*(len(points)-1)));f2=u2*(len(points)-1)-j
            dot.location=points[j].lerp(points[j+1],f2);d.show(dot,yes)
    return {'southTip':model['anchors']['compassSouthNeedleTip'].copy(),
            'northTip':model['anchors']['compassNorthNeedleTip'].copy(),
            'southOutwardDot':math.sin(angle),'northOutwardDot':-math.sin(angle)}


def frog_cutaway(name='b2a_frog_cutaway'):
    """A small non-gory leg cutaway for the body's salty water explanation."""
    model=frog_leg(name)
    m=materials();before=set(bpy.data.objects)
    pale=_mat('frog_cutaway_skin','#91ba7b',.70,alpha=.24)
    for key in ('thigh','knee','shin'):d.put(model['parts'][key],pale)
    water=[]
    for i,(x,y,z) in enumerate([(-.074,-.011,.042),(-.053,-.013,.047),
                                (-.036,-.009,.037),(.002,-.006,.035),(.037,-.004,.026)]):
        ob=d.sphere(name+'_salty_water_%d'%i,.0052,(x,y,z),m['water'],
                    scale=(.85,.8,1.25),seg_=16,ring=8)
        d.parent(ob,model['root']);water.append(ob)
    added=sorted(set(bpy.data.objects)-before,key=lambda ob:ob.name)
    model['objects']+=added;model['parts']['waterdrops']=water
    for ob in added:
        model['baseline'][ob.name]=(ob.location.copy(),ob.rotation_euler.copy(),ob.scale.copy(),False,False)
    model['anchors']['water']=Vector((-.053,-.013,.047))
    return model


def terrella_comparison(name='b2a_terrella_comparison'):
    """Two real 3D close-up miniatures: London left/down, Australia right/up.

    This is a comparison view of local ground directions, not two Earths.  The
    white line passes through each pivot and denotes its local horizontal.
    """
    before,root=_begin(name);m=materials();comps={};horizons=[];patches=[]
    white=_mat('comparison_horizontal','#fff9e5',.55,emit='#fff9e5',strength=.22)
    for side,x in [('North',-.115),('South',.115)]:
        cc=Vector((x,0,.098))
        comp=_terrella_compass(name+'_'+side.lower(),(0,0,1),(1,0,0),0,m)
        comp['root'].location+=cc-comp['center'];comp['center']=cc
        comps['compass'+side]=comp
        line=curve(name+'_'+side.lower()+'_horizontal',[cc+Vector((-.050,0,0)),cc+Vector((.050,0,0))],white,.0023)
        horizons.append(line)
        # A shallow, curved stone/ground silhouette under each local compass.
        pts=[(x+.074*math.sin(math.radians(a)),.012,.017+.052*math.cos(math.radians(a)))
             for a in range(-74,75,4)]
        patches.append(curve(name+'_'+side.lower()+'_earth_curve',pts,
                              _mat('comparison_stone','#6d7567',.75),.006))
    q={**comps,'horizons':horizons,'earth_curves':patches}
    model=_finish(name,before,root,q,
                  {'center':(0,0,.083),'compassNorth':comps['compassNorth']['center'],
                   'compassSouth':comps['compassSouth']['center'],
                   'horizonNorth':comps['compassNorth']['center'],
                   'horizonSouth':comps['compassSouth']['center']},
                  ((-.195,-.032,.017),(.195,.032,.138)))
    terrella_comparison_state(model)
    return model


def terrella_comparison_state(model,dip=72.0):
    angle=math.radians(max(0,min(89.9,float(dip))))
    for side,sign in [('North',-1),('South',1)]:
        comp=model['parts']['compass'+side]
        comp['pitch'].rotation_euler.x=sign*angle
        direction=comp['tangent']*math.cos(angle)+comp['normal']*(sign*math.sin(angle))
        normal=comp['normal']*math.cos(angle)-comp['tangent']*(sign*math.sin(angle))
        model['anchors']['compass'+side+'NeedleTip']=comp['center']+direction*comp['length']+normal*.001


FACTORIES={
    'frog':frog_leg,'frog_experiment':frog_experiment,'covered_table':covered_table,
    'static_generator':static_generator,'rubbed_glass':rubbed_glass,
    'water_analogy':water_analogy,'volta_pile':volta_pile,'electroscope':electroscope,
    'dry_cell':dry_cell,'torpedo_ray':torpedo_ray,'smoke_alarm':smoke_alarm,
    'scientist':scientist,'door_knob':door_knob,'terrella':terrella,
    'terrella_comparison':terrella_comparison,'frog_cutaway':frog_cutaway,
}
