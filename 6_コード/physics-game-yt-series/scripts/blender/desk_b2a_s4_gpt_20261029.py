"""B-2前編 corrected S2 / S3 — one authoritative new scene, immutable speech/subtitles.

Background: Blender -b --factory-startup -P THIS -- --catalog --storyboard
GUI: runpy.run_path(THIS) then NS['run'](catalog=True, storyboard=True).
No shared source, old scene, existing movie or original script is saved over.
"""
import os, sys, json, math, time, types, hashlib
from pathlib import Path
import bpy
from mathutils import Vector

W = Path(__file__).resolve().parents[2]
C = Path('/private/tmp/ys/ys-chain-b2a_s4_gpt_20261030')
R = W / 'outputs/ys-chain-b2a-backup'
sys.path.insert(0, str(W/'scripts/blender'))
_argv = sys.argv[:]
sys.argv = [str(Path(__file__))]
if not bpy.app.background:
    # Preserve any previous D-1 scene and do not reset/re-save the user's file.
    fresh = bpy.data.scenes.new('B2A_S4_PREFLIGHT_20261030')
    bpy.context.window.scene = fresh
    code = (W/'scripts/blender/desk_lib.py').read_text()
    assert code.count('bpy.ops.wm.read_factory_settings(use_empty=True)') == 1
    code = code.replace('bpy.ops.wm.read_factory_settings(use_empty=True)',
                        'pass # fresh isolated B2A scene already selected')
    code = code.replace('bpy.context.active_object', 'bpy.context.view_layer.objects.active')
    d = types.ModuleType('desk_lib'); d.__file__ = str(W/'scripts/blender/desk_lib.py')
    sys.modules['desk_lib'] = d
    exec(compile(code, d.__file__, 'exec'), d.__dict__)
else:
    import desk_lib as d
sys.argv = _argv
import desk_lib_b2a_s4_gpt_20261029 as p

DATA = json.loads((C/'blender/b2a-scene-data.json').read_text())
PT = json.loads((C/'phrase-times.json').read_text())
ROWS = {r['row']: r for r in DATA['rows']}
CUES = {q['key']: q for q in DATA['cues']}
FPS = 30; NF = DATA['frames']
EVENT_WARNINGS = []

# Only hide assets in this newly initialized scene, never the previous project.
room = {'floor','wall','base','window','picture','desk','pot',*[f'leaf{i}' for i in range(4)]}
for ob in d.SC.objects:
    keep = ob.type in ('LIGHT','CAMERA') or ob.name.split('.')[0] in room or ob.name.startswith(('winF','picF','leg','stack'))
    d.show(ob, keep)
for light, energy in d.LIGHTS: light.energy = energy
d.BGN.inputs[1].default_value = .35
d.SC.render.resolution_x = 540; d.SC.render.resolution_y = 960
d.SC.render.resolution_percentage = 100; d.SC.eevee.taa_render_samples = 4
d.SC.render.image_settings.file_format = 'JPEG'; d.SC.render.image_settings.quality = 92

def norm(s): return d.norm(s)
def word(row, kana, occ=0, fraction=.5, end=False):
    """Actual speech-aligned word lookup; an explicit recorded fallback only."""
    import re
    target = norm(kana); hits = []
    pat = re.compile(re.sub('[ウオ]', '[ウオ]', re.escape(target)))
    for key in ROWS[row]['cues']:
        cue = CUES[key]; marks = PT.get(cue['subtitle'])
        if not marks: continue
        for match in pat.finditer(marks['s']):
            i = match.end() if end else match.start()
            hits.append(cue['start'] + (marks['t'][i] if i < len(marks['t']) else marks['end']))
    if len(hits) > occ: return hits[occ]
    r = ROWS[row]; value = r['start'] + (r['end']-r['start'])*fraction
    warning = {'row':row,'kana':kana,'occ':occ,'fallbackFraction':fraction,'seconds':value}
    if warning not in EVENT_WARNINGS: EVENT_WARNINGS.append(warning)
    return value
def smooth(t,a,b):
    v=max(0,min(1,(t-a)/max(.001,b-a))); return v*v*(3-2*v)
def kick_amount(t,at):
    # No early anticipation: 150 ms rise and 400 ms recovery.
    return smooth(t,at,at+.15)*(1-smooth(t,at+.15,at+.55)) if at<=t<=at+.55 else 0
def kick_events():
    events=[{'row':1,'start':.45,'degrees':30}]
    for row,kana,deg in [(10,'ピクット',30),(11,'マタウゴキマス',30),(19,'ピクットケッタ',30),(20,'アシワウゴク',30),(20,'ピクットシタ',30),(25,'ヨワクナリマス',5),(25,'ツヨクウゴイタ',30),(43,'ピクットサセタ',30)]:
        events.append({'row':row,'start':word(row,kana),'degrees':deg})
    events.append({'row':43,'start':DATA['duration']-1.15,'degrees':30})
    return [{'kind':'frog-kick',**e,'peak':e['start']+.15,'end':e['start']+.55} for e in events]
def bump(t,at,duration=.7): return math.sin(math.pi*max(0,min(1,(t-at)/duration))) if at <= t <= at+duration else 0
def row_at(t): return next((r for r in reversed(DATA['rows']) if t>=r['start']),DATA['rows'][0])
def cue_at(t): return next((q for q in reversed(DATA['cues']) if t>=q['start']),None)

MODELS = {}
def add(key, model): MODELS[key]=model; return model
add('frog',p.frog_experiment('b2a_frog'))
add('frog_same',p.frog_experiment('b2a_frog_same',same_metal=True))
add('cover',p.covered_table('b2a_cover'))
add('glass',p.rubbed_glass('b2a_glass'))
add('generator',p.static_generator('b2a_generator'))
add('water',p.water_analogy('b2a_water'))
add('pile',p.volta_pile('b2a_pile',units=30))
add('unit',p.volta_pile('b2a_unit',units=1))
add('electroscope',p.electroscope('b2a_electroscope'))
add('cell',p.dry_cell('b2a_cell'))
add('ray',p.torpedo_ray('b2a_ray'))
add('alarm',p.smoke_alarm('b2a_alarm'))
add('galvani',p.scientist('b2a_galvani',role='galvani'))
add('volta',p.scientist('b2a_volta',role='volta'))
add('assistant',p.scientist('b2a_assistant',role='assistant'))
add('door',p.door_knob('b2a_door'))
add('terrella',p.terrella('b2a_terrella'))
add('comparison',p.terrella_comparison('b2a_comparison'))
add('cutaway',p.frog_cutaway('b2a_cutaway'))

def prop(key,builder,anchors,bounds):
    before,root=p._begin('b2a_'+key); parts=builder('b2a_'+key)
    return add(key,p._finish('b2a_'+key,before,root,parts,anchors,bounds))
M=p.materials()
def book_builder(n):
    covers=[]
    covers.append(d.box(n+'_back',(.125,.16,.008),(0,0,.006),M['iron'],.003))
    d.box(n+'_pages',(.117,.151,.018),(0,0,.019),M['ivory'],.002)
    hinge=d.empty(n+'_hinge',(-.062,0,.031))
    cover=d.box(n+'_cover',(.125,.16,.006),(0,0,.033),M['wood'],.003);d.parent(cover,hinge)
    pagehinge=d.empty(n+'_page_hinge',(-.057,0,.032))
    page=d.box(n+'_turning_page',(.110,.143,.001),(0,-.002,.033),M['ivory'],.0003);d.parent(page,pagehinge)
    ink=d.mat(n+'_frog_drawing','#4a8546',.9)
    for key,pts in [('thigh',[(-.042,-.035,.035),(.008,-.010,.035),(-.022,.022,.035)]),('shin',[(-.022,.022,.035),(.035,.042,.035)]),('toe',[(.035,.042,.035),(.045,.025,.035)])]:
        line=p.curve(n+'_drawing_'+key,pts,ink,.0023);d.parent(line,pagehinge)
    return {'hinge':hinge,'cover':cover,'page_hinge':pagehinge}
prop('book',book_builder,{'center':(0,0,.025)},((-.064,-.081,0),(.064,.081,.04)))
def map_builder(n):
    d.box(n+'_paper',(.34,.29,.003),(0,0,.002),M['ivory'],.003)
    land=d.mat('b2a_s3_map_land','#a9b99b',.8)
    def polygon(key,xy):
        me=bpy.data.meshes.new(n+key);me.from_pydata([(x,y,.006) for x,y in xy],[],[tuple(range(len(xy)))])
        ob=bpy.data.objects.new(n+key,me);d.link(ob);d.put(ob,land)
    # Distinct British island and Italian boot; city pins are on their land.
    polygon('_mainland',[(-.12,-.08),(-.12,-.01),(-.075,.015),(-.065,.05),(-.02,.055),(.01,.105),(.045,.125),(.075,.1),(.06,.06),(.13,.045),(.145,-.025),(.07,-.04),(.045,-.025),(.015,-.01),(-.015,-.035),(-.055,-.055),(-.06,-.095)])
    polygon('_britain',[(-.112,.035),(-.122,.057),(-.112,.077),(-.118,.104),(-.098,.129),(-.084,.117),(-.09,.092),(-.078,.075),(-.081,.055),(-.065,.043),(-.075,.032)])
    polygon('_ireland',[(-.142,.05),(-.149,.077),(-.134,.093),(-.124,.082),(-.125,.057)])
    polygon('_italian_boot',[(.006,-.018),(.028,-.022),(.033,-.039),(.045,-.058),(.065,-.075),(.069,-.091),(.058,-.093),(.046,-.081),(.034,-.083),(.034,-.064),(.019,-.049),(.008,-.033)])
    polygon('_sicily',[(.027,-.101),(.056,-.101),(.047,-.113)])
    italy=(.020,-.030,.009);london=(-.082,.044,.009)
    for nm,loc in [('italy',italy),('london',london)]:d.sphere(n+'_'+nm,.005,loc,M['brass'])
    p.curve(n+'_delivery_arrow',[italy,(.014,.006,.009),(-.041,.029,.009),london],M['brass'],.0012)
    direction=Vector(london)-Vector((-.041,.029,.009));direction.normalize()
    side=Vector((-direction.y,direction.x,0))
    for sign in (-1,1):p.rod(n+'_arrowhead',london,Vector(london)-direction*.013+side*.006*sign,.0012,M['brass'])
    letter=d.empty(n+'_letter',italy)
    for ob in [d.box(n+'_envelope',(.045,.031,.003),italy,M['ivory'],.002),p.curve(n+'_flap',[(italy[0]-.021,italy[1]+.014,italy[2]+.003),italy,(italy[0]+.021,italy[1]+.014,italy[2]+.003)],M['brass'],.0008)]:d.parent(ob,letter)
    return {'letter':letter,'italy':Vector(italy),'london':Vector(london)}
prop('map',map_builder,{'center':(0,0,.008),'italy':(.020,-.030,.009),'london':(-.082,.044,.009)},((-.172,-.147,0),(.172,.147,.016)))

# Physical scalpel, thin connection wire and positive-current glow. These are
# separate actual meshes/curves, not label-only substitutes for an apparatus.
scalpel=p.rod('b2a_scalpel',(-.09,0,0),(.015,0,0),.003,M['iron'])
blade=d.box('b2a_scalpel_blade',(.035,.011,.0018),(.022,0,0),M['iron'],.002)
wire=p.curve('b2a_detector_wire',[(0,0,0)]*4,M['iron'],.0017)
loop=p.curve('b2a_current_loop',[(0,0,0)]*7,M['yellow'],.0019)
current_dot=d.sphere('b2a_positive_current',.005,(0,0,0),M['yellow'],seg_=16,ring=8)
signal_dots=[d.sphere('b2a_s4_nerve_signal_'+str(i),.012,(0,0,0),M['ivory'],seg_=16,ring=8) for i in range(4)]
local_field=p.curve('b2a_s4_local_field',[(0,0,0)]*3,M['yellow'],.0045)
local_heads=[p.rod('b2a_s4_local_arrow'+str(i),(0,0,0),(.01,0,.01),.003,M['yellow']) for i in range(2)]
cyan=d.mat('b2a_s4_cyan_fingertip','#ddfaff',.35,emit='#c8f8ff',strength=3.0)
contact_glow=d.sphere('b2a_s4_finger_glow',.012,(0,0,0),cyan,seg_=16,ring=8)
rimdata=bpy.data.lights.new('b2a_s4_globe_rim','AREA');rimdata.energy=5;rimdata.shape='DISK';rimdata.size=.35;rimdata.color=(1.0,.89,.74)
globe_rim=bpy.data.objects.new('b2a_s4_globe_rim',rimdata);d.link(globe_rim);globe_rim.location=(-.26,.13,.46);globe_rim.rotation_euler=(Vector((0,-.10,.16))-globe_rim.location).to_track_quat('-Z','Y').to_euler()
explain=[scalpel,blade,wire,loop,current_dot,local_field,contact_glow,globe_rim]+signal_dots+local_heads

def use(key,loc=(0,-.10,0),scale=1,rot=(0,0,0)):
    model=MODELS[key];p.reset(model);p.visible(model,True)
    model['root'].location=loc;model['root'].rotation_euler=rot;model['root'].scale=(scale,)*3
    return model
def hide_all():
    for model in MODELS.values():p.visible(model,False)
    for ob in explain:d.show(ob,False)
    for name in d.HANDS:d.set_hand(name,(0,0,0),vis=False)
def meshes(models):
    return [ob for model in models for ob in model['objects'] if ob.type in ('MESH','CURVE') and not ob.hide_render]
def selected(model,names): return [o for o in model['objects'] if any(s in o.name for s in names) and not o.hide_render and o.type in ('MESH','CURVE')]
def touch(name,point,t,at,duration=1.7,yaw=110):
    if at-.8<=t<=at+duration:
        u=smooth(t,at-.8,at);v=smooth(t,at+duration-.5,at+duration)
        d.set_hand(name,Vector(point)+Vector((.08*(1-u+v),-.10*(1-u+v),.0015+.07*(1-u+v))),yaw=yaw,pitch=-16)
def fp(key,anchor):return p.world_anchor(MODELS[key],anchor)

def ensure_stage_props():
    g=MODELS['generator']
    if 'return_bridge' not in g['parts']:
        from mathutils import Matrix
        ob=p.rod('b2a_generator_return_bridge',(.186,-.02,.235),(.210,-.02,.230),.0037,M['brass'])
        ob.parent=g['root'];ob.matrix_parent_inverse=Matrix.Identity(4)
        g['parts']['return_bridge']=ob;g['objects'].append(ob)
        g['baseline'][ob.name]=(ob.location.copy(),ob.rotation_euler.copy(),ob.scale.copy(),False,False)
    if 'globe_support' not in MODELS:
        prop('globe_support',lambda n:{'base':d.cyl(n+'_base',.061,.060,(0,0,.030),M['wood'])},
             {'center':(0,0,.03)},((-.061,-.061,0),(.061,.061,.06)))
    if 'cup' not in MODELS:
        def cup(n):
            d.cyl(n+'_bottom',.028,.003,(0,0,.002),M['rim'])
            # Transparent sides with a visibly open top, not a solid glass lump.
            for i in range(36):
                a=i*math.tau/36;b=(i+1)*math.tau/36
                p.curve(n+'_wall_'+str(i),[(.027*math.cos(a),.027*math.sin(a),.005),(.027*math.cos(a),.027*math.sin(a),.056),(.027*math.cos(b),.027*math.sin(b),.056)],M['glass'],.0012)
            d.torus(n+'_lip',.027,.0017,(0,0,.056),M['rim'])
            return {'water':d.cyl(n+'_water',.024,.042,(0,0,.024),M['water'])}
        prop('cup',cup,{'center':(0,0,.028)},((-.029,-.029,0),(.029,.029,.06)))
    if 'seam' not in MODELS:
        prop('seam',lambda n:{'ring':d.torus(n+'_join',.0448,.0014,(0,0,.024+14*.0066+.0033),M['yellow'])},
             {'center':(0,0,.024+14*.0066+.0033)},((-.047,-.047,.114),(.047,.047,.124)))

def foot_geometry(model):
    leg=model['parts']['leg']
    return [o for o in leg['objects'] if o.type in ('MESH','CURVE') and not o.hide_render]
def fit_cover(model):
    # One actual board is shared by the covered opening and revealed ending.
    # The enlarged drape reaches above the thick Z-leg and down to that board.
    for ob in model['objects']:
        if ob.type=='MESH' and not any(s in ob.name for s in ('_cloth','_peek_green','_peek_toe')):d.show(ob,False)
    model['parts']['cloth'].scale=(1.55,1.65,2.8)
    model['parts']['cloth'].location.z+=.010
    model['parts']['peeking_foot'].location.z+=.100
def comparison_view(model,dip=72,split=False):
    p.terrella_comparison_state(model,dip=dip)
    for i,(side,x) in enumerate([('North',-.075),('South',.075)]):
        comp=model['parts']['compass'+side]
        if split:
            comp['root'].location=(x,0,.098)
            base=model['baseline'][comp['root'].name][2]
            comp['root'].scale=base*1.6
            line=model['parts']['horizons'][i]
            line.scale.x=.9;line.location.x=x-.9*comp['center'].x
            d.show(model['parts']['earth_curves'][i],False)
    bpy.context.view_layer.update()
    inv=model['root'].matrix_world.inverted()
    for side in ('North','South'):
        comp=model['parts']['compass'+side]
        model['anchors']['compass'+side]=inv@comp['root'].matrix_world.translation
        model['anchors']['horizon'+side]=model['anchors']['compass'+side].copy()
        red=comp['halves'][0]
        model['anchors']['compass'+side+'NeedleTip']=inv@(red.matrix_world@red.data.vertices[2].co)
def voltage_diagram(key,loc,high):
    if key not in MODELS:
        def build(n):
            for x,z in [(-.036,.015+high),(.036,.015)]:
                d.box(n+'_pedestal',(.052,.034,z),(x,0,z*.5),M['dark'],.002)
                d.box(n+'_tank',(.056,.036,.025),(x,0,z+.0125),M['ivory'],.002)
                d.box(n+'_water',(.048,.006,.017),(x,-.019,z+.014),M['water'],.001)
                p.curve(n+'_surface',[(x-.024,-.023,z+.0225),(x+.024,-.023,z+.0225)],M['yellow'],.0018)
            p.curve(n+'_pipe',[(-.008,-.015,.030+high),(.008,-.015,.030)],M['rim'],.0018)
            return {}
        prop(key,build,{'center':(0,0,.03+high*.5)},((-.066,-.025,0),(.066,.022,.042+high)))
    return use(key,loc)
def spoken_field_packets(model, t):
    """Row 5 only: two N→S packets at frozen word clocks.

    Keep all six field curves. Reuse one existing dot and one existing
    arrow per curve. Never change the master, voice, captions or camera.
    """
    plan = getattr(spoken_field_packets, '_plan', None)
    if plan is None:
        # word(..., end=True) uses the exact end boundary in phrase-times,
        # the same source from which S0/word-events.json was derived.
        plan = [
            {
                'name': 'N極からS極',
                'knots': [
                    (word(5, 'エヌキョクカラデテ'), 0.0),
                    (word(5, 'エヌキョクカラデテ', end=True), 0.20),
                    (word(5, 'エスキョクエハイリマス'), 0.75),
                    (word(5, 'エスキョクエハイリマス', end=True), 1.0),
                ],
            },
            {
                'name': '地理南から地理北',
                'knots': [
                    (word(5, 'ミナミカラデテ'), 0.0),
                    (word(5, 'キタエハイリマス'), 0.75),
                    (word(5, 'キタエハイリマス', end=True), 1.0),
                ],
            },
        ]
        for packet in plan:
            assert all(a[0] < b[0] for a, b in
                       zip(packet['knots'], packet['knots'][1:]))
            assert all(a[1] < b[1] for a, b in
                       zip(packet['knots'], packet['knots'][1:]))
        assert plan[0]['knots'][-1][0] < plan[1]['knots'][0][0]
        spoken_field_packets._plan = plan

    active_packet = next(
        (packet for packet in plan
         if packet['knots'][0][0] <= t <= packet['knots'][-1][0]),
        None,
    )
    u = None
    if active_packet is not None:
        knots = active_packet['knots']
        # Linear progress has no reversal and no jump at a spoken boundary.
        for (ta, ua), (tb, ub) in zip(knots, knots[1:]):
            if t <= tb:
                f = max(0.0, min(1.0, (t - ta) / (tb - ta)))
                u = ua + (ub - ua) * f
                break
        if u is None:
            u = 1.0

    parts = model['parts']
    paths = parts['field_paths']
    assert len(paths) == len(parts['field_arrows']) == 6
    assert len(parts['field_particles']) == 6
    # Existing paths start in the red/southern magnetic-N hemisphere and
    # end in the blue/northern magnetic-S hemisphere. Do not reverse them.
    assert all(path[0].z < 0 < path[-1].z for path in paths)

    for points, arrow, dots in zip(
            paths, parts['field_arrows'], parts['field_particles']):
        visible = active_packet is not None
        for k, dot in enumerate(dots):
            d.show(dot, visible and k == 0)
        d.show_tree(arrow, visible)
        if not visible:
            continue
        # Same path-parameter convention as the current terrella_state().
        z = max(0.0, min(1.0, u)) * (len(points) - 1)
        i = min(len(points) - 2, int(z))
        f = z - i
        position = points[i].lerp(points[i + 1], f)
        direction = points[i + 1] - points[i]
        assert direction.length > 0
        dots[0].location = position
        arrow.location = position
        arrow.rotation_euler = direction.to_track_quat('Y', 'Z').to_euler()

    # Read-only scene checks can collect this metadata after apply(t).
    # It is Python metadata only, not a geometry/caption/audio modification.
    metadata = {
        'row': 5,
        'time': float(t),
        'packet': active_packet['name'] if active_packet else None,
        'progress': u,
        'visibleParticleCount': 6 if active_packet else 0,
        'localDirection': 'red magnetic N / geographic south (-Z) '
                          'to blue magnetic S / geographic north (+Z)',
        'localStartEnd': [
            {'start': list(path[0]), 'end': list(path[-1])}
            for path in paths
        ],
        'plan': plan,
    }
    model['spoken_field_packet_state'] = metadata
    return metadata

def stage(t):
    ensure_stage_props()
    hide_all();r=row_at(t);n=r['row'];a=r['start'];b=r['end'];q=(t-a)/max(.01,b-a)
    chosen=[]; primary=[];name='';az=12;el=38;target=.65;maxheight=.46
    if n==1:
        # Same physical origin/camera as the final revealed foot.
        z=use('frog',(.16,-.10,0));p.visible(z,False)
        d.show(z['parts']['board'],True)
        co=use('cover',(.16,-.10,-.10));p.cover_state(co,kick=kick_amount(t,.45))
        fit_cover(co)
        co['parts']['cloth'].location.z+=.045*kick_amount(t,.45)
        chosen=[co];primary=meshes([co]);target=.82;el=25;az=0
    elif 2<=n<=8:
        if n<=4:d.show(globe_rim,True)
        z=use('terrella',(0,-.10,.16),rot=(0,0,0));chosen=[z]
        dip=72
        if n in (2,3):dip=12+20*smooth(t,a,a+1)
        if n==6:dip=72*smooth(t,word(6,'ウエオムキマス')-.7,word(6,'ウエオムキマス')+.4)
        p.terrella_state(z,field=1 if n==5 else 0,cutaway=n==4,dip=dip,phase=t,surface=n in (2,3,6,7))
        if n==5:spoken_field_packets(z,t)
        if n<8:d.show_tree(z['parts']['compassNorth']['root'],False)
        el=25;az=0;target=.60
        if n in (2,3):
            # B-1's red mark was above. Keep that actual sphere orientation,
            # then rotate it visibly into geographic north-up in row 4.
            z['root'].rotation_euler.x=math.pi
            comp=z['parts']['compassSouth'];comp['root'].scale*=1.60
            for ob in (z['parts']['base'],z['parts']['saddle']):d.show_tree(ob,False)
            use('globe_support',(0,-.10,0))
            primary=selected(z,['stone','geographic_','south_compass']);target=.84;el=20;az=0;maxheight=.44
            bpy.context.view_layer.update()
            if n==2:touch('kai',fp('terrella','compassSouth'),t,word(2,'オキマス'))
        elif n in (6,7):
            p.visible(z,False);z=use('comparison',(0,-.10,.025));comparison_view(z,dip=dip);chosen=[z]
            d.show_tree(z['parts']['compassNorth']['root'],False)
            d.show(z['parts']['horizons'][0],False);d.show(z['parts']['earth_curves'][0],False)
            primary=selected(z,['_south']);target=.72;el=12;az=0
            # Fill the old arch with a curved Earth-surface slice; the
            # compass remains on its unchanged white local horizontal.
            if 'earth_slice' not in MODELS:
                def earth_slice(k):
                    sea=d.mat(k+'_sea','#667c86',.8);land=d.mat(k+'_land','#7c8d75',.8)
                    verts=[(-.115,.013,0)]+[(-.115+.074*math.sin(math.radians(v)),.013,.017+.052*math.cos(math.radians(v))) for v in range(-74,75,4)]
                    me=bpy.data.meshes.new(k+'_mesh');me.from_pydata(verts,[],[tuple(range(len(verts)))]);ob=bpy.data.objects.new(k,me);d.link(ob);d.put(ob,sea)
                    for x,zz in [(-.148,.035),(-.113,.055),(-.085,.040)]:d.sphere(k+'_land',.016,(x,.009,zz),land,scale=(1,.14,.55))
                    return {'surface':ob}
                prop('earth_slice',earth_slice,{'center':(-.115,.013,.04)},((-.19,.005,0),(-.04,.02,.07)))
            earth=use('earth_slice',(0,-.10,.025));chosen.append(earth)
            at=word(6,'ジメンノシタ')
            if t>=at:
                cc=fp('comparison','compassSouth');v=Vector((.035,0,.048));p._curve_points(local_field,[cc-v,cc,cc+v]);d.show(local_field,True)
                for i,ob in enumerate(local_heads):
                    head=cc+v;tail=head-Vector((.016 if i==0 else .004,0,.014 if i==0 else .024));vec=head-tail;ob.location=(head+tail)*.5;ob.rotation_euler=vec.to_track_quat('Z','Y').to_euler();ob.scale.z=vec.length/.0141421356;d.show(ob,True)
        elif n==8:
            p.visible(z,False);z=use('comparison',(0,-.10,.025));comparison_view(z,split=True);chosen=[z]
            primary=meshes([z]);target=.92;el=20;az=0
        else:
            primary=selected(z,['stone','geographic_','inside_magnetic'])
            target=.58 if n==4 else .47
            if n==5:target=.56
            if n==4:
                at=word(4,'チキュウノキタ')-.30
                z['root'].rotation_euler.x=math.pi*(1-smooth(t,at,at+1.5))
                for ob in (z['parts']['base'],z['parts']['saddle']):d.show_tree(ob,False)
                use('globe_support',(0,-.10,0));primary=selected(z,['stone','geographic_','inside_magnetic']);target=.75;maxheight=.44
                pole=1 if word(4,'エスキョク')<=t<word(4,'エヌキョク') else 0
                for i,mark in enumerate(z['parts']['pole_marks']):mark.scale*=1+.55*bump(t,word(4,'エスキョク') if i==1 else word(4,'エヌキョク'),.8)
    elif n in (9,10,11,12,20,21,23,26,28,36,43):
        z=use('frog',(.16 if n==43 else 0,-.10,0));chosen=[z]
        p.frog_contacts(z,1);kick=0;el=25;az=0;target=.82;maxheight=.49
        primary=foot_geometry(z)
        if n==9:
            g=use('galvani',(-.22,.10,0),.90);chosen+=[g]
        if n==10:
            approach=word(10,'フレアワセル');ct=word(10,'ピクット')
            p.frog_contacts(z,smooth(t,approach,approach+.65));kick=kick_amount(t,ct)
            bpy.context.view_layer.update()
            touch('kai',z['root'].matrix_world@z['parts']['contact_elbows'][0],t,word(10,'シンチュウ'),1.3,yaw=145)
            touch('mio',fp('frog','tip_iron'),t,word(10,'テツノボー'),1.3,yaw=-145)
        if n==11:
            release=word(11,'ハナスト');approach=word(11,'フレアワセル');ct=word(11,'マタウゴキマス')
            contact=(1-smooth(t,release,release+.20))+smooth(t,approach,approach+.35)
            p.frog_contacts(z,min(1,contact));kick=kick_amount(t,ct)
        if n==12:
            z['root'].location=(-.12,-.10,0);z['root'].scale=(.62,)*3
            ce=use('cell',(.13,-.10,0),2.0);chosen+=[ce]
            primary=meshes([z,ce]);target=.91;maxheight=.49
            touch('kai',fp('cell','center'),t,word(12,'デンチデス'))
        if n==20:kick=max(kick_amount(t,word(20,'アシワウゴク')),kick_amount(t,word(20,'ピクットシタ')))
        if n==21:p.frog_kick(z['parts']['leg'],0,signal=(t-a)*.2%1)
        if n==28:
            z['root'].location.x-=.55*smooth(t,word(28,'カエルオトリノゾケバ'),b-.4)
        if n==36:
            at=word(36,'チイサナデンキ');p.frog_kick(z['parts']['leg'],0,signal=None)
            for ob in z['parts']['rods']+z['parts']['tips']:d.show(ob,False)
            primary=foot_geometry(z);target=.82
            leg=z['parts']['leg'];nerve=p.world_anchor(leg,'nerve');muscle=p.world_anchor(z,'muscle')
            for i,dot in enumerate(signal_dots):
                u=(t-at-1.5*i)/1.10
                if 0<=u<=1:dot.location=nerve.lerp(muscle,u);d.show(dot,True)
        if n==43:
            if t<a+.9:
                co=use('cover',(.16,-.10,-.10));p.cover_state(co,reveal=smooth(t,a,a+.8));chosen+=[co]
                # The cloth must start above the larger single-leg model, not
                # intersect it before rising. Keep the camera/table fixed.
                fit_cover(co)
            ending=DATA['duration']-1.15
            kick=max(kick_amount(t,word(43,'ピクットサセタ')),kick_amount(t,ending))
            p.frog_contacts(z,1 if t<ending-.5 else smooth(t,ending-.35,ending))
            touch('kai',fp('frog','contact'),t,ending,1.1,yaw=-110)
            ce=use('pile',(-.09,.20,0),.50);p.pile_state(ce)
            te=use('terrella',(.38,.18,.08),.34);p.terrella_state(te);chosen += [ce,te]
        if n not in (21,36):p.frog_kick(z['parts']['leg'],min(1,kick),signal=None)
    elif n in (13,):
        z=use('glass');chosen=[z];sp=word(13,'ヒバナ',fraction=.73)
        charge=smooth(t,a,a+2.5) if t<sp else 0;p.glass_state(z,charge,sp<=t<sp+.2,(t-a)*.5)
        touch('mio',fp('glass','tip')+Vector((-.016,0,0)),t,sp,1.0,yaw=-80)
        primary=meshes([z]);target=.65;el=25
        touch('kai',fp('glass','cloth'),t,a+1,3)
    elif n in (14,15,18):
        z=use('water');chosen=[z];phase=(t-a)*.16
        if 'b2a_base_main_path' not in z:z['b2a_base_main_path']=[Vector(v) for v in z['parts']['main_path']]
        z['parts']['main_path']=[v.copy() for v in z['b2a_base_main_path']]
        p._curve_points(z['parts']['main_pipe'],z['parts']['main_path'])
        pump=n==18 and t>=word(18,'ポンプ')
        levels=(.90,.10)
        if n==18 and not pump:
            empty=word(18,'スグニカラニナリマス')
            drain=smooth(t,empty-.5,word(18,'カラニナリマス',end=True))
            levels=(.90-.73*drain,.10+.73*drain)
            cup=use('cup',(-.135,-.10,.245));chosen+=[cup]
            water=cup['parts']['water'];water.scale.z=max(.015,1-drain);water.location.z=.003+.021*(1-drain)
            d.show(water,drain<.999)
            for ob in z['objects']:
                if '_left_' in ob.name and 'plinth' not in ob.name:d.show(ob,False)
                if 'left_plinth' in ob.name:ob.scale.z=.245/.135;ob.location.z=.1225
            path=[Vector((-.135,0,.255)),Vector((-.075,-.054,.255)),Vector((.045,-.054,.064)),Vector((.090,-.015,.064))]
            z['parts']['main_path']=path;p._curve_points(z['parts']['main_pipe'],path)
        if pump:
            began=word(18,'ポンプ');refill=smooth(t,began,began+1.3);levels=(.17+.60*refill,.83-.60*refill)
        if n==14:
            at=word(14,'クダデツナグ');drain=smooth(t,at,b)
            levels=(.90-.32*drain,.10+.32*drain)
        flowing=1 if pump or levels[0]>.171 else 0
        if n==14 and t<word(14,'クダデツナグ'):flowing=0
        if n==18 and not pump and t<word(18,'スグニカラニナリマス')-.5:flowing=0
        p.water_state(z,levels,flow=flowing,pump=pump,turn=phase)
        if n==18 and not pump:
            # water_state restores both surfaces, so hide only the replaced
            # left rectangular water block once more; cup holds the small amount.
            d.show(z['parts']['water'][0],False)
        if pump:touch('kai',fp('water','pump'),t,word(18,'ポンプ'),4)
    elif n in (16,17):
        z=use('cell',(-.14,-.10,0),1.7);dr=use('door',(.14,-.08,0),1);chosen=[z,dr]
        if n==16:
            left=voltage_diagram('voltage_low',(-.14,-.10,.24),.012)
            right=voltage_diagram('voltage_high',(.14,-.08,.24),.095);chosen+=[left,right]
        primary=meshes(chosen);target=.90;el=25;az=0;maxheight=.52
        spark=word(16,'パチッ',fraction=.5) if n==16 else a+.2
        d.show(dr['parts']['spark'],abs(t-spark)<.18);touch('kai',fp('door','knob'),t,spark)
    elif n==19:
        g=use('generator',(-.19,-.01,0),.75);z=use('frog',(.10,-.12,0),.9)
        h=use('assistant',(.21,.04,0),1.2);chosen=[g,z,h]
        spark=word(19,'ヒバナオトバシタ',fraction=.43);p.generator_state(g,(t-a)*.3,abs(t-spark)<.14)
        p.frog_contacts(z,0);p.frog_kick(z['parts']['leg'],kick_amount(t,word(19,'ピクットケッタ')))
        for ob in z['parts']['rods']+z['parts']['tips']:d.show(ob,False)
        end=fp('frog','nerve');d.show(scalpel,True);d.show(blade,True)
        scalpel.location=end+Vector((-.07,0,.005));blade.location=end+Vector((.005,0,.005))
        touch('mio',end+Vector((-.09,-.015,.012)),t,word(19,'メスガフレテイル'),2,yaw=-110)
        primary=foot_geometry(z);target=.82;maxheight=.49;el=25;az=0
    elif n==22:
        z=use('ray');g=use('galvani',(.18,-.035,0),1.2);chosen=[z,g]
        moment=word(22,'シビレサセル',fraction=.47)
        d.show(z['parts']['spark'],bump(t,moment)>0)
        touch('kai',fp('ray','touch'),t,moment)
        p.scientist_state(g,jump=bump(t,moment))
        g['root'].location+=g['suggested_root_offset']
        if t>=word(22,'ニホンノキンゾク'):
            p.visible(z,False);p.visible(g,False)
            z=use('frog');p.frog_contacts(z,1);p.frog_kick(z['parts']['leg'],0);chosen=[z]
    elif n==24:
        z=use('book',(0,-.10,0),1.2);g=use('volta',(-.16,-.01,0),1.5);chosen=[z,g]
        g['root'].location.x-=.15*(1-smooth(t,a,a+2))
        z['parts']['hinge'].rotation_euler.y=-math.radians(110)*smooth(t,word(24,'ソレオヨンダ',fraction=.32),word(24,'ソレオヨンダ',fraction=.32)+1.2)
        turn=word(24,'ソレオヨンダ')+1.5
        z['parts']['page_hinge'].rotation_euler.y=-math.pi*smooth(t,turn,turn+1.6)
        g['root'].rotation_euler.x=math.radians(18)*smooth(t,turn-.5,turn+1)
    elif n==25:
        z=use('frog_same',(0,.025,.24),1);g=use('frog',(0,-.10,0),1);chosen=[z,g]
        primary=foot_geometry(z)+foot_geometry(g);target=.94;el=25;az=0;maxheight=.58
        p.frog_contacts(z,1);p.frog_contacts(g,1)
        # These are two comparison specimens, not two trays passing through
        # one another. Their boards are omitted from this stacked view.
        d.show(z['parts']['board'],False);d.show(g['parts']['board'],False)
        weak=word(25,'ヨワクナリマス',fraction=.58);strong=word(25,'ツヨクウゴイタ',fraction=.9)
        p.frog_kick(z['parts']['leg'],kick_amount(t,weak),1/6);p.frog_kick(g['parts']['leg'],kick_amount(t,strong),1)
    elif n==27:
        z=use('alarm');chosen=[z];at=word(27,'ケムリ');p.alarm_state(z,max(0,t-at)*.16%1,t>word(27,'ナル'))
        for ob in z['objects']:
            if '_ceiling' in ob.name:ob.scale.y=.33;ob.location.y=.05
        el=20;maxheight=.46
    elif n in (29,30):
        z=use('unit',(0,-.08,0),1.9);chosen=[z]
        ex=(1-smooth(t,a+1,b-1.0)) if n==29 else 0
        p.pile_state(z,explode=ex)
        primary=selected(z,['_zinc','_paper','_copper']);el=12 if n==29 else 28;target=.63
        if n==29:
            touch('kai',fp('unit','paper'),t,word(29,'アツガミ',fraction=.67),1.2)
            if t>=word(29,'カエルノカラダノナカ'):
                z['root'].location.x=-.08
                cross=use('cutaway',(.12,-.08,.060),.90);chosen+=[cross]
                blue=d.mat('b2a_s3_salty_water_visible','#2b96d2',.40,emit='#2b96d2',strength=.12)
                skin=d.mat('b2a_s3_cutaway_skin_visible','#6aa951',.70,alpha=.55)
                for part in ('thigh','knee','shin'):d.put(cross['parts'][part],skin)
                for drop in cross['parts']['waterdrops']:
                    drop.scale*=2.0;d.put(drop,blue)
                primary=meshes([z,cross]);target=.88
        else:
            touch('kai',fp('unit','bottom_terminal'),t,word(30,'ユビ',fraction=.4),3)
            touch('mio',fp('unit','top_terminal'),t,word(30,'ユビ',fraction=.4),3,yaw=-110)
    elif n in (31,32,33,34,35,37,39,40,41,42):
        z=use('pile',(0,-.08,0));chosen=[z];p.pile_state(z,dry=n==42)
        if n==31:
            primary=selected(z,['_zinc','_paper','_copper']);target=.53;maxheight=.70;el=12;az=0
            count=1+min(29,max(0,(t-word(31,'ナンジュックミモカサネマシタ'))/.1))
            num=min(30,max(1,math.ceil(count)));p.pile_state(z,visible_units=num)
            # A complete Zn/paper/Cu unit descends, then touches the previous
            # copper plate. The three materials never reorder or grow gaps.
            falling=1-(count-math.floor(count)) if count<29.999 else 0
            z['parts']['units'][num-1].location.z+=.035*falling
            touch('kai',fp('pile','top_terminal')+Vector((0,0,.035*falling)),t,a+1.4,1.6)
        if n==32:
            g=use('volta',(.16,-.08,0),1.8);chosen+=[g];ct=word(32,'ビリット',fraction=.48)
            lo=fp('pile','bottom_terminal');hi=fp('pile','top_terminal')
            touch('kai',lo,t,ct,4.0);touch('mio',hi,t,ct,4.0,yaw=-110)
            if t>=ct:
                # The gold explanation path crosses every Zn/wet-paper/Cu
                # layer, then the external body path returns to the bottom.
                centerlo=z['root'].matrix_world@Vector((0,0,.025))
                centerhi=z['root'].matrix_world@Vector((0,0,hi.z))
                points=[lo,centerlo,centerhi,hi,hi+Vector((.10,-.03,.015)),Vector((.20,-.14,.10)),lo]
                p._curve_points(loop,points);d.show(loop,True);current_dot.location=p._along(points,((t-ct)*.35)%1);d.show(current_dot,True)
            p.scientist_state(g,jump=.35*bump(t,ct));g['root'].location+=g['suggested_root_offset']
        if n==33:
            z['root'].location.x=-.15
            e=use('electroscope',(.13,-.08,0),1.8);chosen+=[e]
            opened=word(33,'ハガヒライタ');demo=word(33,'ハナレテヒラク');connect=word(33,'デンタイノハシニツナグ')
            amount=smooth(t,opened,opened+.6)
            p.electroscope_state(e,amount)
            v0=fp('pile','top_terminal');v1=fp('electroscope','knob');p._curve_points(wire,[v0,v0+Vector((0,0,.04)),v1+Vector((0,0,.02)),v1]);d.show(wire,connect<=t)
            if t<word(33,'ウスイキンノハ'):
                e['root'].scale=(1.8,)*3;z['root'].location.x=-.18;e['root'].location.x=.12
                primary=meshes([e,z]);target=.95;maxheight=.50;el=22;az=0
            lift=.06*smooth(t,opened-.6,opened+.1)
            for part in ('condenser_upper','condenser_handle'):
                ob=e['parts'][part];ob.location.z=e['baseline'][ob.name][0].z+lift
            for ob in e['objects']:
                if 'handle_end' in ob.name:ob.location.z=e['baseline'][ob.name][0].z+lift
            touch('kai',v1+Vector((-.01,0,.009)),t,opened-1.8,.9)
            # A real separate macro view is planned here; main camera can also
            # resolve the leaf pair, rather than substituting an opening label.
            if t>=word(33,'ウスイキンノハ',fraction=.52):
                primary=selected(e,['_gold_leaf','_leaf_hinge']);target=.36;el=6;az=0;maxheight=.48
        if n==34:
            z['root'].location=(-.13,-.12,0);z['root'].scale=(.75,)*3
            e=use('electroscope',(.13,-.12,0),1.2);p.electroscope_state(e,1);chosen+=[e]
            primary=meshes(chosen);target=.88;maxheight=.32;el=25;az=0
        if n==37:
            ce=use('cell',(.14,-.08,0),1.1);chosen+=[ce]
        if n==39:
            z['root'].location=(.17,-.08,0);z['root'].scale=(1.4,)*3
            gl=use('glass',(-.18,-.08,0),.95,rot=(0,math.radians(-55),0));chosen+=[gl]
            primary=meshes([z,gl]);target=.93;el=25;az=0;maxheight=.48
            spark=word(39,'パチッ');again=word(39,'ナンドデモビリットキマス');hold=word(39,'サワッテイルアイダ')
            p.glass_state(gl,1 if t<spark else 0,spark<=t<spark+.2)
            touch('mio',fp('glass','cloth'),t,spark-1.0,2.0,yaw=-100)
            if t>=spark-.4 and t<spark+.9:touch('kai',fp('glass','tip'),t,spark,.7)
            if t>=again:
                touch('kai',fp('pile','bottom_terminal'),t,again,1.3)
                touch('mio',fp('pile','top_terminal'),t,again,1.3,yaw=-110)
            if t>=hold:
                touch('kai',fp('pile','bottom_terminal'),t,hold,b-hold+.5)
                touch('mio',fp('pile','top_terminal'),t,hold,b-hold+.5,yaw=-110)
                lo=fp('pile','bottom_terminal');hi=fp('pile','top_terminal')
                path=[lo,lo+Vector((-.005,0,.004)),lo.lerp(hi,.25),lo.lerp(hi,.65),hi,hi+Vector((.005,0,0)),hi+Vector((.003,0,.003))]
                p._curve_points(loop,path);d.show(loop,True)
                current_dot.location=hi+Vector((.003,-.003,.003));d.show(current_dot,True)
                contact_glow.location=hi+Vector((.003,-.008,.007));d.show(contact_glow,True)
        if n in (40,41):
            primary=selected(z,['_14_zinc','_14_paper','_14_copper','_15_zinc','_15_paper','_15_copper']);target=.63;el=28
            if n==41:
                seam=use('seam',z['root'].location);chosen+=[seam]
        if n==42:
            p.pile_state(z,dry=False)
            primary=selected(z,['_zinc','_paper','_copper']);target=.53;el=12;az=0;maxheight=.70
            began=word(42,'カワイタアツガミ');dry_count=max(0,min(30,(t-began)/.1))
            for i,unit in enumerate(z['parts']['units']):
                isdry=i>=30-int(dry_count)
                for ob in unit.children_recursive:
                    if '_paper' in ob.name and ob.type=='MESH':d.put(ob,M['drypaper'] if isdry else M['wetpaper'])
                    if 'wet_drop' in ob.name or 'waterdrop' in ob.name:d.show(ob,not isdry)
    elif n==38:
        z=use('map',(0,-.10,0),1.25);chosen=[z];el=54
        begin=word(38,'テガミデ',fraction=.3);u=smooth(t,begin,begin+2.2)
        pts=z['parts'];dest=pts['italy'].lerp(pts['london'],u)
        pts['letter'].location=dest+Vector((0,0,.055*math.sin(math.pi*u)))
        touch('kai',p.world_anchor(z,'italy'),t,begin,.9)
    if not primary:primary=meshes(chosen)
    name=','.join(m['name'] for m in chosen)
    # Keep the entire bent leg and complete contact loop readable.  The new
    # S3 correction supersedes the old contact-only 1-second crop.
    if n in (2,3,6,7):name='b2a_terrella_south_compass'
    if n==8:name='b2a_compass_comparison'
    if n==33 and primary!=meshes(chosen):name='b2a_electroscope_gold_leaf_pair'
    if n in (9,10,11,20,21,23,26,28,43) and name!='b2a_frog_rod_contact':name='b2a_frog_leg'
    if n==19:name='b2a_scalpel_nerve_contact' if word(19,'メスガフレテイル')<=t<word(19,'ピクットケッタ') else name
    if n in (40,41):name='b2a_pile_one_unit_join'
    bpy.context.view_layer.update()
    return {'row':n,'models':chosen,'primary':primary,'name':name,'az':az,'el':el,'target':target,'maxheight':maxheight,'lens':140 if name=='b2a_frog_rod_contact' else 42,'fullFace':n in (35,40)}

def bbox(objects):
    points=[]
    for ob in objects:
        if ob.hide_render:continue
        if ob.type=='MESH' and len(ob.data.vertices)<600:
            points.extend(ob.matrix_world@v.co for v in ob.data.vertices)
        else:points.extend(ob.matrix_world@Vector(v) for v in ob.bound_box)
    if not points:raise RuntimeError('No visible explanatory geometry')
    return points
def measurement(objects):
    a=[d.project(v) for v in bbox(objects)];xs=[x[0] for x in a];ys=[x[1] for x in a]
    return {'x0':min(xs),'y0':min(ys),'x1':max(xs),'y1':max(ys),'width':(max(xs)-min(xs))/1080,'height':(max(ys)-min(ys))/1920,'allInCamera':all(x[2] for x in a)}

CAMERAS={}
def calibrate(n,variant='main'):
    r=ROWS[n];t=(r['start']+r['end'])/2
    if n==31:t=r['end']-.25
    if n==43:t=ROWS[43]['start']+2
    if n==1:
        # Reveal and cover use exactly the same static camera pose.
        cam=CAMERAS.get('43') or calibrate(43)
        CAMERAS['1']={**cam,'baselineTime':.8};return CAMERAS['1']
    if n==33:t=word(33,'ハガヒライタ',fraction=.86)+1 if variant=='leaf' else r['start']+.25
    if n==22:t=r['end']-.25 if variant=='frog' else r['start']+1.8
    if n in (10,11) and variant=='contact':t=(word(10,'フレアワセル') if n==10 else word(11,'フレアワセル'))+.01
    if n==19 and variant=='scalpel':t=word(19,'メスガフレテイル')+.2
    if n==29 and variant=='body':t=word(29,'カエルノカラダノナカ')+.3
    if n in (9,10,11,20,21,23,26,28,43) and variant=='main':
        t=ROWS[n]['start']+.25
    state=stage(t);points=bbox(state['primary']);lo=Vector(tuple(min(v[k] for v in points) for k in range(3)));hi=Vector(tuple(max(v[k] for v in points) for k in range(3)))
    center=(lo+hi)*.5;distance=max(.25,(hi-lo).length*2.4);shift=-.06
    for _ in range(10):
        d.pose_cam((*center,distance,state['az'],state['el'],state['lens']));d.CAM_D.shift_y=shift
        bpy.context.view_layer.update();m=measurement(state['primary'])
        factor=max(m['width']/state['target'],m['height']/state['maxheight'])
        distance=max(.13,distance*factor)
        # Numerical derivative is robust to Blender's sensor-fit convention.
        cy=(m['y0']+m['y1'])/2;d.CAM_D.shift_y=shift+.01;bpy.context.view_layer.update();m2=measurement(state['primary'])
        derivative=((m2['y0']+m2['y1'])/2-cy)/.01
        if abs(derivative)>1:shift+=((650 if n in (25,31,42) else 760)-cy)/derivative
    key=str(n)+(':'+variant if variant!='main' else '')
    CAMERAS[key]={'pose':[*center,distance,state['az'],state['el'],state['lens']],'shift':shift,'baselineTime':t}
    return CAMERAS[key]
def apply(t):
    n=row_at(t)['row'];variant='leaf' if n==33 and t>=word(33,'ウスイキンノハ',fraction=.52) else 'main'
    if n==33 and word(33,'デンタイノハシニツナグ')-.15<=t<word(33,'ハガヒライタ')+.2:variant='main'
    if n==22 and t>=word(22,'ニホンノキンゾク'):variant='frog'
    # A stable full-foot camera is required across each frog explanation.
    if n==29 and t>=word(29,'カエルノカラダノナカ'):variant='body'
    key=str(n)+(':'+variant if variant!='main' else '');camera=CAMERAS.get(key) or calibrate(n,variant)
    s=stage(t);d.pose_cam(camera['pose']);d.CAM_D.shift_y=camera['shift']
    d.CAM_D.dof.aperture_fstop=5.6
    bpy.context.view_layer.update();return s

def label_anchors(state):
    n=state['row'];anchors={}
    if 2<=n<=8:
        z=MODELS['comparison'] if n in (6,7,8) else MODELS['terrella']
        pairs=[('australia','compassSouth'),('london','compassNorth')]
        if n not in (6,7,8):pairs=[('north','geographicNorth'),('south','geographicSouth'),('n','magneticN'),('s','magneticS')]+pairs
        for label,key in pairs:anchors['label.'+label]=d.project(p.world_anchor(z,key))
        if n in (2,3,4):anchors['label.redMark']=d.project(p.world_anchor(z,'geographicSouth'))
    if n in (9,10,11,19,20,21,22,23,26,28,36,43):
        for label,key in [('nerve','nerve'),('brass','tip_brass'),('iron','muscle')]:
            anchors['label.'+label]=d.project(fp('frog',key))
    if n==9:anchors['label.galvani']=d.project(fp('galvani','head'))
    if n==25:
        for label,key in [('same','frog_same'),('different','frog')]:
            m=measurement(foot_geometry(MODELS[key]));anchors['label.'+label]=[(m['x0']+m['x1'])/2,m['y0'],True]
    if n==33:anchors['label.capacitor']=d.project(fp('electroscope','knob'))
    if n in (29,30):
        for label,key in [('zinc','zinc'),('cardboard','paper'),('copper','copper')]:anchors['label.'+label]=d.project(fp('unit',key))
    if n==38:
        for key in ('italy','london'):anchors['label.'+key]=d.project(fp('map',key))
    return anchors
def render_file(file):
    d.SC.render.filepath=str(file)
    if bpy.app.background:bpy.ops.render.render(write_still=True)
    else:
        area=next((a for a in bpy.context.window.screen.areas if a.type in ('CONSOLE','VIEW_3D','TEXT_EDITOR')),bpy.context.area)
        with bpy.context.temp_override(window=bpy.context.window,area=area):bpy.ops.render.render(write_still=True)

def catalog():
    """Rebuild this new scene's frog assets after a new-parts edit.

    Kept under the queue's existing 'catalog' action; never executes or edits
    the prior S3's geometry-specific test programs or old output files.
    """
    import importlib
    hide_all();importlib.reload(p)
    for key in ('frog','frog_same','cutaway'):
        old=MODELS[key];p.visible(old,False)
        MODELS[key]=(p.frog_cutaway('b2a_cutaway') if key=='cutaway' else p.frog_experiment('b2a_frog_same' if key=='frog_same' else 'b2a_frog',same_metal=key=='frog_same'))
        p.visible(MODELS[key],False)
    CAMERAS.clear()
    return {'rebuilt':['frog','frog_same','cutaway'],'oldAssetsRetainedHidden':True}

def storyboard(times=None):
    out=C/'blender/desk';out.mkdir(parents=True,exist_ok=True)
    plan=json.loads((C/'blender/storyboard-plan.json').read_text());specs=list(plan['stills'])
    # Every actual cue, not merely every master row, receives a still.
    specs += [{'row':q['row'],'seconds':(q['start']+q['end'])/2,'cue':q['key'],'where':'cue-middle'} for q in DATA['cues']]
    # Capture actual contact/opening/movement states as well as regular row
    # samples: a short kick must not disappear between two storyboard stills.
    events=json.loads((R/'S0_20261029/word-events.json').read_text())
    for row in events['rows']:
        for event in row['events']:
            if event['kind']=='A':
                specs.append({'row':row['row'],'seconds':min(row['end']-.02,event['start']+.25),'where':'spoken-action','word':event['label'],'event':event['id']})
    specs.append({'row':43,'seconds':DATA['duration']-1.05,'where':'silent-ending-recovery'})
    for ev in kick_events():
        for offset in (0,.15,.55):specs.append({'row':ev['row'],'seconds':ev['start']+offset,'where':'knee-'+str(offset)})
    if times is not None:specs=[{'row':row_at(t)['row'],'seconds':t,'where':'probe'} for t in times]
    specs={min(NF-1,round(x['seconds']*FPS)):x for x in specs}
    records=[];anc={};primary={};start=time.time()
    prior=None
    if times is not None and (C/'storyboard/render-manifest.json').exists():
        prior=json.loads((C/'storyboard/render-manifest.json').read_text())
        anc=json.loads((out/'anchors.json').read_text())['anchors']
        primary=json.loads((C/'blender/primary.json').read_text())
    for j,spec in sorted(specs.items()):
        t=j/FPS;s=apply(t);m=measurement(s['primary']);f=out/(str(j).zfill(5)+'.jpg')
        render_file(f)
        a=label_anchors(s)
        for k,v in a.items():
            if k not in anc:anc[k]=[None]*NF
            anc[k][j]=v
        primary[str(j)]=[m['x0'],m['y0'],m['x1'],m['y1'],s['name']]
        records.append({**spec,'row':s['row'],'cue':cue_at(t)['key'] if cue_at(t) else None,'key':cue_at(t)['diagram'] if cue_at(t) else 'silent-intro','time':t,'frame':j,'j':j,'seconds':t,'image':str(f),'actualPrimary':s['name'],'measurement':m,'fullFace':s['fullFace'],'camera':{'location':list(d.CAM.location),'rotation':list(d.CAM.rotation_euler),'shift':d.CAM_D.shift_y},'personallyViewed':False})
        print('B2A_S2_FRAME',j,s['row'],round(m['width'],3),flush=True)
    result={'stage':'S2','episode':'b2a','resolution':[540,960],'samples':4,'fps':30,'frames':records,'elapsedSeconds':time.time()-start,'s3Started':False}
    name='probe' if times is not None else 'render-manifest'
    (C/'storyboard').mkdir(exist_ok=True)
    (C/'storyboard'/(name+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2))
    if prior is not None:
        changed={r['frame']:r for r in records};old={r['frame']:r for r in prior['frames']};old.update(changed)
        prior['frames']=[old[j] for j in sorted(old)];prior['lastPatchSeconds']=time.time()-start
        prior['patchedRows']=sorted(set([r['row'] for r in records]))
        (C/'storyboard/render-manifest.json').write_text(json.dumps(prior,ensure_ascii=False,indent=2))
    (out/'anchors.json').write_text(json.dumps({'anchors':anc,'fps':30,'frames':NF},ensure_ascii=False))
    (C/'blender/primary.json').write_text(json.dumps(primary,ensure_ascii=False))
    (C/'blender/word-fallbacks.json').write_text(json.dumps(EVENT_WARNINGS,ensure_ascii=False,indent=2))
    (C/'blender/camera-poses.json').write_text(json.dumps(CAMERAS,ensure_ascii=False,indent=2))
    return result

def write_motion_events():
    dest=C/'blender/motion-events.json';dest.parent.mkdir(parents=True,exist_ok=True)
    value={'fps':FPS,'events':kick_events(),'shape':'150ms rise, 400ms recovery; no anticipation'}
    dest.write_text(json.dumps(value,ensure_ascii=False,indent=2));return value

RENDER_REUSE={'last':None,'file':None,'verifiedRows':set(),'disabledRows':set(),'drawn':0,'reused':0,'proofs':[]}
def visual_fingerprint():
    """Exact visible state. Mesh vertices are immutable in this scene; curves
    and all transforms/material inputs are included. No rounding or time skip.
    The first identical pair in every shot is also actually rendered and SHA
    compared before reuse is enabled for that shot. 30fps is retained.
    """
    values=[];materials=set()
    for ob in d.SC.objects:
        if ob.hide_render or ob.type not in ('MESH','CURVE','LIGHT'):continue
        data=ob.data
        item=[ob.name,ob.type,tuple(x for row in ob.matrix_world for x in row),data.name]
        if ob.type=='CURVE':
            item.append(tuple(tuple(point.co) for spline in data.splines for point in spline.points))
        if ob.type=='MESH' and data.shape_keys:item.append(tuple(k.value for k in data.shape_keys.key_blocks))
        if ob.type=='LIGHT':item.extend([data.energy,tuple(data.color)])
        for mat in getattr(data,'materials',[]):
            if mat:materials.add(mat)
        item.append(tuple(mat.name if mat else None for mat in getattr(data,'materials',[])))
        values.append(item)
    for mat in sorted(materials,key=lambda x:x.name):
        inputs=[]
        if mat.use_nodes:
            for node in mat.node_tree.nodes:
                for socket in node.inputs:
                    if not hasattr(socket,'default_value') or socket.is_linked:continue
                    val=socket.default_value
                    if not isinstance(val,(str,int,float,bool,type(None))):
                        try:val=tuple(val)
                        except TypeError:val=str(val)
                    inputs.append((node.name,socket.name,val))
        values.append((mat.name,inputs))
    values.append(('camera',tuple(x for row in d.CAM.matrix_world for x in row),d.CAM_D.lens,d.CAM_D.shift_x,d.CAM_D.shift_y,d.CAM_D.dof.focus_distance,d.CAM_D.dof.aperture_fstop,d.SC.frame_current))
    return hashlib.sha256(repr(values).encode()).hexdigest()

def mesh_geometry_fingerprint():
    from array import array
    h=hashlib.sha256()
    for mesh in sorted(bpy.data.meshes,key=lambda x:x.name):
        data=array('f',[0])*(len(mesh.vertices)*3)
        mesh.vertices.foreach_get('co',data)
        h.update(mesh.name.encode());h.update(data.tobytes())
    return h.hexdigest()

def render_atomic(file):
    temporary=file.with_name(file.stem+'.writing.jpg')
    render_file(temporary);os.replace(temporary,file)

def export_frame(j,anc,primary,cameras):
    t=j/FPS;state=apply(t);m=measurement(state['primary'])
    f=C/'blender/desk'/(str(j).zfill(5)+'.jpg')
    import shutil
    signature=visual_fingerprint();cache=RENDER_REUSE;row=state['row']
    duplicate=signature==cache['last'] and cache['file'] and row not in cache['disabledRows']
    if duplicate and row not in cache['verifiedRows']:
        proof=C/'blender/reuse-proofs'/(str(j).zfill(5)+'.jpg');proof.parent.mkdir(parents=True,exist_ok=True)
        render_atomic(proof)
        equal=hashlib.sha256(proof.read_bytes()).digest()==hashlib.sha256(Path(cache['file']).read_bytes()).digest()
        cache['proofs'].append({'j':j,'row':row,'sameVisibleState':True,'actualRenderedJpegByteEqual':equal})
        cache['verifiedRows' if equal else 'disabledRows'].add(row)
        if f.exists():f.unlink()
        shutil.copy2(proof,f);cache['drawn']+=1
    elif duplicate:
        # Lossless reuse of an identical static state, never frame sampling.
        if f.exists():f.unlink()
        os.link(cache['file'],f);cache['reused']+=1
    else:render_atomic(f);cache['drawn']+=1
    cache['last']=signature;cache['file']=str(f)
    for key,val in label_anchors(state).items():
        if key not in anc:anc[key]=[None]*NF
        anc[key][j]=val
    primary[str(j)]=[m['x0'],m['y0'],m['x1'],m['y1'],state['name']]
    cameras.append({'j':j,'row':state['row'],'location':list(d.CAM.location),'rotation':list(d.CAM.rotation_euler),'shift':d.CAM_D.shift_y,'fullFace':state['fullFace']})
    return state,m

def production(from_frame=0,to_frame=None):
    """S3 native 30fps frames. Checkpoint each 90 frames; safe resumable queue."""
    global RENDER_REUSE
    if 'RENDER_REUSE' not in globals():
        RENDER_REUSE={'last':None,'file':None,'verifiedRows':set(),'disabledRows':set(),'drawn':0,'reused':0,'proofs':[]}
    geometry_before=mesh_geometry_fingerprint()
    out=C/'blender/desk';out.mkdir(parents=True,exist_ok=True);end=NF if to_frame is None else min(NF,int(to_frame))
    metadata=C/'blender/s3-export-state.json';af=out/'anchors.json';pf=C/'blender/primary.json';cf=C/'blender/camera-records.json'
    anc=json.loads(af.read_text())['anchors'] if af.exists() else {}
    primary=json.loads(pf.read_text()) if pf.exists() else {}
    cams=json.loads(cf.read_text()) if cf.exists() else []
    # An explicit bounded range is a targeted replacement, not a resumable
    # full export. Retain every other frame/camera and recompute this range.
    if to_frame is not None:cams=[r for r in cams if not (int(from_frame)<=r['j']<end)]
    already={x['j'] for x in cams};started=time.time()
    def checkpoint(j,complete=False):
        af.write_text(json.dumps({'key':'b2a_s3_gpt_20261029','anchors':anc,'fps':FPS,'frames':NF},ensure_ascii=False))
        pf.write_text(json.dumps(primary,ensure_ascii=False))
        cf.write_text(json.dumps(cams))
        metadata.write_text(json.dumps({'stage':'S3','lastFrame':j,'totalFrames':NF,'completed':complete,'elapsedThisRun':time.time()-started,'sourceVoiceUnchanged':True}))
        (C/'blender/lossless-still-reuse.json').write_text(json.dumps({k:(sorted(v) if isinstance(v,set) else v) for k,v in RENDER_REUSE.items()},indent=2))
        (C/'blender/word-fallbacks.json').write_text(json.dumps(EVENT_WARNINGS,ensure_ascii=False,indent=2))
    write_motion_events()
    for j in range(int(from_frame),end):
        if (C/'jobs/PAUSE').exists():checkpoint(j-1);return {'paused':True,'nextFrame':j}
        if j in already and str(j) in primary and (out/(str(j).zfill(5)+'.jpg')).exists():continue
        state,m=export_frame(j,anc,primary,cams)
        if j%90==0 or j==end-1:
            checkpoint(j);print('B2A_S3_PROGRESS',j,NF,round(time.time()-started,2),flush=True)
    cams.sort(key=lambda x:x['j'])
    assert geometry_before==mesh_geometry_fingerprint(),'Mesh vertices changed during export: static state reuse must not be used'
    cut_changes=sum(1 for a,b in zip(cams,cams[1:]) if a['location']!=b['location'] or a['rotation']!=b['rotation'] or a['shift']!=b['shift'])
    # Camera changes are hard cuts, never interpolated during explanation.
    (C/'blender/camera-motion.json').write_text(json.dumps({'moving_ratio':0,'method':'All explanatory shot cameras are static. Hard cuts are separately counted.','hardCuts':cut_changes,'frames':len(cams)}))
    (out/'meta.json').write_text(json.dumps({'key':'b2a_s3_gpt_20261029','frames':NF,'fps':FPS,'resolution':[540,960],'samples':4,'finished':time.strftime('%Y-%m-%dT%H:%M:%S'),'previewOnly':False,'sampleOnly':False,'stage':'S3 draft, not final S4'}))
    checkpoint(end-1,len(cams)==NF)
    return {'frames':len(cams),'elapsed':time.time()-started}

def run(catalog=False,storyboard=False,times=None,production=False):
    start=time.time()
    if catalog:globals()['catalog']()
    if storyboard or times is not None:globals()['storyboard'](times)
    write_motion_events()
    if production:globals()['production']()
    print('B2A_STAGE_DONE',time.time()-start,flush=True)
if __name__=='__main__':
    run(catalog='--catalog' in sys.argv,storyboard='--storyboard' in sys.argv,
        times=[float(x) for x in sys.argv[sys.argv.index('--times')+1].split(',')] if '--times' in sys.argv else None,
        production='--production' in sys.argv)

