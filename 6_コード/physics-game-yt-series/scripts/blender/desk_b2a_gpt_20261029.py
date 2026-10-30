"""B-2前編 S1/S2 — one authoritative new scene, immutable speech/subtitles.

Background: Blender -b --factory-startup -P THIS -- --catalog --storyboard
GUI: runpy.run_path(THIS) then NS['run'](catalog=True, storyboard=True).
No shared source, old scene, existing movie or original script is saved over.
"""
import os, sys, json, math, time, types, hashlib
from pathlib import Path
import bpy
from mathutils import Vector

W = Path(__file__).resolve().parents[2]
C = Path('/private/tmp/ys/ys-chain-b2a_gpt_20261029')
R = W / 'outputs/ys-chain-b2a-backup'
sys.path.insert(0, str(W/'scripts/blender'))
_argv = sys.argv[:]
sys.argv = [str(Path(__file__))]
if not bpy.app.background:
    # Preserve any previous D-1 scene and do not reset/re-save the user's file.
    fresh = bpy.data.scenes.new('B2A_S2_20261029')
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
import desk_lib_b2a_gpt_20261029 as p

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
d.SC.render.image_settings.file_format = 'JPEG'; d.SC.render.image_settings.quality = 93

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
    return {'hinge':hinge,'cover':cover}
prop('book',book_builder,{'center':(0,0,.025)},((-.064,-.081,0),(.064,.081,.04)))
def map_builder(n):
    d.box(n+'_paper',(.31,.27,.003),(0,0,.002),M['ivory'],.003)
    # Simplified, unlabeled Europe silhouette and physical city pins.
    pts=[(-.12,.10,.005),(-.09,.025,.005),(-.04,.05,.005),(-.015,.12,.005),(.03,.09,.005),(.12,.03,.005),(.09,-.06,.005),(.03,-.08,.005),(.008,-.035,.005),(-.023,-.072,.005),(-.055,-.026,.005),(-.11,-.03,.005)]
    mesh=bpy.data.meshes.new(n+'_europe');mesh.from_pydata(pts,[],[tuple(range(len(pts)))])
    ob=bpy.data.objects.new(n+'_europe',mesh);d.link(ob);d.put(ob,d.mat('b2a_map_land','#b8bd9b',.8))
    italy=(.016,-.054,.009);london=(-.085,.047,.009)
    for nm,loc in [('italy',italy),('london',london)]:d.sphere(n+'_'+nm,.005,loc,M['brass'])
    letter=d.empty(n+'_letter',italy)
    for ob in [d.box(n+'_envelope',(.058,.039,.003),italy,M['ivory'],.002),p.curve(n+'_flap',[(italy[0]-.028,italy[1]+.019,italy[2]+.003),italy,(italy[0]+.028,italy[1]+.019,italy[2]+.003)],M['brass'],.0008)]:d.parent(ob,letter)
    return {'letter':letter,'italy':Vector(italy),'london':Vector(london)}
prop('map',map_builder,{'center':(0,0,.008),'italy':(.016,-.054,.009),'london':(-.085,.047,.009)},((-.157,-.137,0),(.157,.137,.016)))

# Physical scalpel, thin connection wire and positive-current glow. These are
# separate actual meshes/curves, not label-only substitutes for an apparatus.
scalpel=p.rod('b2a_scalpel',(-.09,0,0),(.015,0,0),.003,M['iron'])
blade=d.box('b2a_scalpel_blade',(.035,.011,.0018),(.022,0,0),M['iron'],.002)
wire=p.curve('b2a_detector_wire',[(0,0,0)]*4,M['iron'],.0017)
loop=p.curve('b2a_current_loop',[(0,0,0)]*7,M['yellow'],.0019)
current_dot=d.sphere('b2a_positive_current',.005,(0,0,0),M['yellow'],seg_=16,ring=8)
explain=[scalpel,blade,wire,loop,current_dot]

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
        d.set_hand(name,Vector(point)+Vector((.08*(1-u+v),-.10*(1-u+v),.03+.07*(1-u+v))),yaw=yaw,pitch=-16)
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

def stage(t):
    ensure_stage_props()
    hide_all();r=row_at(t);n=r['row'];a=r['start'];b=r['end'];q=(t-a)/max(.01,b-a)
    chosen=[]; primary=[];name='';az=12;el=38;target=.65;maxheight=.46
    if n==1:
        z=use('cover',(.27,-.10,0));p.cover_state(z,kick=bump(t,.45,.9));chosen=[z];target=.27
    elif 2<=n<=8:
        z=use('terrella',(0,-.10,.16),rot=(math.radians(145),0,0));chosen=[z]
        support=use('globe_support',(0,-.10,0));chosen+=[support]
        # A stable, upright small support remains when the magnetic globe flips.
        for ob in z['objects']:
            if any(s in ob.name for s in ('stand_base','saddle','stand_arm')):d.show(ob,False)
        dip=72
        if n in (2,3):dip=12*math.sin((t-a)*4)*math.exp(-.05*(t-a))
        if n==6:dip=72*smooth(t,word(6,'ウエオムキマス',fraction=.75)-.7,word(6,'ウエオムキマス',fraction=.75)+.4)
        p.terrella_state(z,field=1 if n>=5 else 0,cutaway=n==4,dip=dip,phase=t,surface=n in (6,7,8))
        # North compass is introduced only with the London comparison.
        if n<8:d.show_tree(z['parts']['compassNorth']['root'],False)
        if n==2:touch('kai',fp('terrella','compassSouth'),t,word(2,'オキマス',fraction=.6))
        if n in (6,7):
            primary=selected(z,['south_compass','south_surface_plane']);target=.63;el=32;az=30
        elif n==8:
            primary=selected(z,['north_compass','north_surface_plane']);target=.63;el=32;az=30
        else:primary=selected(z,['stone','geographic_','inside_magnetic']+(['fieldloop','field_arrow'] if n==5 else []));target=.63
    elif n in (9,10,11,12,20,21,23,26,28,36,43):
        z=use('frog',(.16 if n==43 else 0,-.10,0));chosen=[z]
        p.frog_contacts(z,1)
        kick=0
        if n==9:
            g=use('galvani',(-.23,-.015,0),1.5);chosen+=[g]
        if n==10:
            approach=word(10,'フレアワセル',fraction=.83);ct=word(10,'ピクット',fraction=.9)
            p.frog_contacts(z,smooth(t,approach,ct));kick=bump(t,ct)
            touch('kai',fp('frog','nerve'),t,word(10,'シンチュウ',fraction=.35),2)
            touch('mio',fp('frog','muscle'),t,word(10,'テツノボー',fraction=.55),2,yaw=-110)
            # Keep the entire foot in the main shot; a hand must not force
            # either the knee or toes outside the explanatory frame.
            primary=meshes([z]);target=.67
        if n==11:
            release=word(11,'ハナスト');approach=word(11,'フレアワセル');ct=word(11,'マタウゴキマス')
            contact=1-smooth(t,release,release+.25)
            contact+=smooth(t,approach,ct)
            contact*=1-smooth(t,ct+.65,ct+.85)
            contact+=smooth(t,ct+.9,ct+1.15)
            p.frog_contacts(z,min(1,contact));kick=max(bump(t,ct+.1),bump(t,ct+1.15))
        if n==12:
            ce=use('cell',(.22,-.03,0),1.2);chosen+=[ce];touch('kai',fp('cell','center'),t,word(12,'デンチデス',fraction=.85))
        if n==20:kick=max(bump(t,word(20,'アシワウゴク')),bump(t,word(20,'ピクットシタ')))
        if n==21: p.frog_kick(z['parts']['leg'],0,signal=(t-a)*.2%1)
        if n==28:
            z['root'].location.x-=.5*smooth(t,word(28,'カエルオトリノゾケバ',fraction=.5),b-.4)
            un=use('unit',(.15,-.06,0),1.2);chosen+=[un];p.pile_state(un,explode=.4)
        if n==36:
            at=word(36,'チイサナデンキ');p.frog_kick(z['parts']['leg'],0,signal=((t-at)*.28)%1 if t>=at else None)
            for ob in z['parts']['rods']+z['parts']['tips']:d.show(ob,False)
            primary=selected(z,['white_nerve','nerve_tip','nerve_signal']);target=.63
        if n==43:
            ending=DATA['duration']-1.5
            kick=max(bump(t,word(43,'ピクットサセタ')),bump(t,ending,.9))
            contact=1 if t<ending-.5 else smooth(t,ending-.35,ending)
            p.frog_contacts(z,contact);touch('kai',fp('frog','contact'),t,ending,1.1)
            ce=use('pile',(-.06,.13,0),.60);p.pile_state(ce)
            te=use('terrella',(-.06,-.07,.08),.38);p.terrella_state(te);chosen += [ce,te]
            primary=meshes([z]);target=.65
        if n not in (21,36):p.frog_kick(z['parts']['leg'],min(1,kick),signal=None)
    elif n in (13,):
        z=use('glass');chosen=[z];sp=word(13,'ヒバナ',fraction=.73)
        charge=smooth(t,a,a+2.5)*(1-smooth(t,sp,sp+.18));p.glass_state(z,charge,abs(t-sp)<.12,(t-a)*.5)
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
        flowing=1 if pump or levels[0]>.171 else 0
        if n==18 and not pump and t<word(18,'スグニカラニナリマス')-.5:flowing=0
        p.water_state(z,levels,flow=flowing,pump=pump,turn=phase)
        if n==18 and not pump:
            # water_state restores both surfaces, so hide only the replaced
            # left rectangular water block once more; cup holds the small amount.
            d.show(z['parts']['water'][0],False)
        if pump:touch('kai',fp('water','pump'),t,word(18,'ポンプ'),4)
    elif n in (16,17):
        z=use('cell',(-.10,-.10,0),1.4);dr=use('door',(.14,-.08,0),1);chosen=[z,dr]
        spark=word(16,'パチッ',fraction=.5) if n==16 else a+.2
        d.show(dr['parts']['spark'],abs(t-spark)<.18);touch('kai',fp('door','knob'),t,spark)
    elif n==19:
        g=use('generator',(-.19,-.01,0),.75);z=use('frog',(.10,-.12,0),.9)
        h=use('assistant',(.21,.04,0),1.2);chosen=[g,z,h]
        spark=word(19,'ヒバナオトバシタ',fraction=.43);p.generator_state(g,(t-a)*.3,abs(t-spark)<.14)
        p.frog_contacts(z,0);p.frog_kick(z['parts']['leg'],bump(t,spark+.03))
        for ob in z['parts']['rods']+z['parts']['tips']:d.show(ob,False)
        end=fp('frog','nerve');d.show(scalpel,True);d.show(blade,True)
        scalpel.location=end+Vector((-.07,0,.005));blade.location=end+Vector((.005,0,.005))
        touch('mio',end,t,spark,2)
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
    elif n==25:
        z=use('frog_same',(-.19,-.10,0),.9);g=use('frog',(.19,-.10,0),.9);chosen=[z,g]
        p.frog_contacts(z,1);p.frog_contacts(g,1)
        weak=word(25,'ヨワクナリマス',fraction=.58);strong=word(25,'ツヨクウゴイタ',fraction=.9)
        p.frog_kick(z['parts']['leg'],bump(t,weak),.12);p.frog_kick(g['parts']['leg'],bump(t,strong),1)
    elif n==27:
        z=use('alarm');chosen=[z];at=word(27,'ケムリ');p.alarm_state(z,max(0,t-at)*.16%1,t>word(27,'ナル'))
        for ob in z['objects']:
            if '_ceiling' in ob.name:ob.scale.y=.33;ob.location.y=.05
        el=20;maxheight=.46
    elif n in (29,30):
        z=use('unit',(0,-.08,0),1.9);chosen=[z]
        ex=(1-smooth(t,a+1,b-1.0)) if n==29 else 0
        p.pile_state(z,explode=ex)
        primary=selected(z,['_zinc','_paper','_copper']);el=42;target=.63
        if n==29:
            touch('kai',fp('unit','paper'),t,word(29,'アツガミ',fraction=.67),1.2)
        else:
            touch('kai',fp('unit','bottom_terminal'),t,word(30,'ユビ',fraction=.4),3)
            touch('mio',fp('unit','top_terminal'),t,word(30,'ユビ',fraction=.4),3,yaw=-110)
    elif n in (31,32,33,34,35,37,39,40,41,42):
        z=use('pile',(0,-.08,0));chosen=[z];p.pile_state(z,dry=n==42)
        if n==31:
            count=1+29*smooth(t,a+.5,word(31,'カサネマシタ',fraction=.5)+.6)
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
            e=use('electroscope',(.13,-.08,0));chosen+=[e]
            opened=word(33,'ハガヒライタ');demo=word(33,'ハナレテヒラク');connect=word(33,'デンタイノハシニツナグ')
            amount=smooth(t,demo,demo+.6) if t<connect-.3 else smooth(t,opened-.4,opened+.6)
            p.electroscope_state(e,amount)
            v0=fp('pile','top_terminal');v1=fp('electroscope','knob');p._curve_points(wire,[v0,v0+Vector((0,0,.04)),v1+Vector((0,0,.02)),v1]);d.show(wire,connect<=t<opened-.55)
            lift=.06*smooth(t,opened-.6,opened+.1)
            for part in ('condenser_upper','condenser_handle'):
                ob=e['parts'][part];ob.location.z=e['baseline'][ob.name][0].z+lift
            for ob in e['objects']:
                if 'handle_end' in ob.name:ob.location.z=e['baseline'][ob.name][0].z+lift
            touch('kai',v1+Vector((-.01,0,.009)),t,opened-1.8,.9)
            # A real separate macro view is planned here; main camera can also
            # resolve the leaf pair, rather than substituting an opening label.
            if t>=word(33,'ウスイキンノハ',fraction=.52):
                primary=selected(e,['_gold_leaf','_leaf_hinge','_head_wire']);target=.57;el=12;az=0;maxheight=.43
        if n==37:
            ce=use('cell',(.14,-.08,0),1.1);chosen+=[ce]
        if n==39:
            gl=use('glass',(-.23,-.07,0),.55);g=use('volta',(.14,-.05,0),1.3);chosen+=[gl,g]
            spark=word(39,'パチッ');again=word(39,'ナンドデモビリットキマス');hold=word(39,'サワッテイルアイダ');tingle=word(39,'ビリビリガツズキマス')
            p.glass_state(gl,1 if t<spark else 0,abs(t-spark)<.13)
            p.scientist_state(g,shake=(t-tingle)*3 if t>tingle else 0,jump=.18*max(bump(t,again,.4),bump(t,again+.6,.4)))
            g['root'].location+=g['suggested_root_offset']
            if t>=hold:
                touch('kai',fp('pile','bottom_terminal'),t,hold,b-hold)
                touch('mio',fp('pile','top_terminal'),t,hold,b-hold,yaw=-110)
        if n in (40,41):
            primary=selected(z,['_14_zinc','_14_paper','_14_copper','_15_zinc','_15_paper','_15_copper']);target=.63;el=28
            if n==41:
                seam=use('seam',z['root'].location);chosen+=[seam]
        if n==42:
            dry=smooth(t,word(42,'カワイタアツガミ'),word(42,'カワイタアツガミオハサム',end=True));p.pile_state(z,dry=dry>.5)
    elif n==38:
        z=use('map',(0,-.10,0),1.25);chosen=[z];el=54
        begin=word(38,'テガミデ',fraction=.3);u=smooth(t,begin,begin+2.2)
        pts=z['parts'];dest=pts['italy'].lerp(pts['london'],u)
        pts['letter'].location=dest+Vector((0,0,.055*math.sin(math.pi*u)))
        touch('kai',p.world_anchor(z,'italy'),t,begin,.9)
    if not primary:primary=meshes(chosen)
    name=','.join(m['name'] for m in chosen)
    if n in (10,11):
        approach=word(10,'フレアワセル') if n==10 else word(11,'フレアワセル')
        contact=word(10,'ピクット') if n==10 else word(11,'マタウゴキマス')
        if approach<=t<contact+.08:
            primary=MODELS['frog']['parts']['tips'];name='b2a_frog_rod_contact';az=0;el=35;target=.60;maxheight=.40
    if n in (6,7):name='b2a_terrella_south_compass'
    if n==8:name='b2a_terrella_north_compass'
    if n==33 and primary!=meshes(chosen):name='b2a_electroscope_gold_leaf_pair'
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
    if n==33:t=word(33,'ハガヒライタ',fraction=.86)+1 if variant=='leaf' else r['start']+.25
    if n==22:t=r['end']-.25 if variant=='frog' else r['start']+1.8
    if n in (10,11) and variant=='contact':t=(word(10,'フレアワセル') if n==10 else word(11,'フレアワセル'))+.01
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
        if abs(derivative)>1:shift+=(760-cy)/derivative
    key=str(n)+(':'+variant if variant!='main' else '')
    CAMERAS[key]={'pose':[*center,distance,state['az'],state['el'],state['lens']],'shift':shift,'baselineTime':t}
    return CAMERAS[key]
def apply(t):
    n=row_at(t)['row'];variant='leaf' if n==33 and t>=word(33,'ウスイキンノハ',fraction=.52) else 'main'
    if n==22 and t>=word(22,'ニホンノキンゾク'):variant='frog'
    if n in (10,11):
        approach=word(10,'フレアワセル') if n==10 else word(11,'フレアワセル')
        contact=word(10,'ピクット') if n==10 else word(11,'マタウゴキマス')
        if approach<=t<contact+.08:variant='contact'
    key=str(n)+(':'+variant if variant!='main' else '');camera=CAMERAS.get(key) or calibrate(n,variant)
    s=stage(t);d.pose_cam(camera['pose']);d.CAM_D.shift_y=camera['shift']
    d.CAM_D.dof.aperture_fstop=5.6
    bpy.context.view_layer.update();return s

def label_anchors(state):
    n=state['row'];anchors={}
    if 2<=n<=8:
        z=MODELS['terrella']
        for label,key in [('north','geographicNorth'),('south','geographicSouth'),('n','magneticN'),('s','magneticS'),('australia','compassSouth'),('london','compassNorth')]:anchors['label.'+label]=d.project(p.world_anchor(z,key))
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
    ensure_stage_props()
    probe=R/'S1_20261029/probe_parts_parenting_gpt_20261029.py'
    if not probe.with_suffix('.json').exists():
        import runpy
        runpy.run_path(str(probe))
    out=R/'S1_20261029/部品カタログ画像';out.mkdir(parents=True,exist_ok=True);records=[]
    for key,model in MODELS.items():
        hide_all();use(key,(0,-.1,.15 if key=='terrella' else 0))
        if key=='terrella':p.terrella_state(model,field=1,surface=True)
        if key=='unit':p.pile_state(model,explode=1)
        if key=='electroscope':p.electroscope_state(model,1)
        if key=='water':p.water_state(model,flow=1,pump=True,turn=.3)
        if key=='alarm':
            p.alarm_state(model,.45,True)
            for ob in model['objects']:
                if '_ceiling' in ob.name:ob.scale.y=.33;ob.location.y=.05
        for top in (False,True):
            bpy.context.view_layer.update()
            points=bbox(meshes([model]));center=Vector(tuple((min(v[k] for v in points)+max(v[k] for v in points))/2 for k in range(3)))
            span=max((v-center).length for v in points)*2
            d.pose_cam((*center,max(.3,span*2.4),18,82 if top else 40,42));d.CAM_D.shift_y=-.06;d.CAM_D.dof.aperture_fstop=5.6
            file=out/(key+('_top' if top else '_oblique')+'.jpg');render_file(file)
            records.append({'part':key,'top':top,'image':str(file),'objects':len(model['objects'])})
    (out.parent/'catalog.json').write_text(json.dumps({'parts':records,'nativeResolution':[540,960],'stage':'S1'},indent=2,ensure_ascii=False))
    return records

def storyboard(times=None):
    out=C/'blender/desk';out.mkdir(parents=True,exist_ok=True)
    plan=json.loads((C/'shot-plan.json').read_text());specs=list(plan['stills'])
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
def run(catalog=False,storyboard=False,times=None):
    start=time.time()
    if catalog:globals()['catalog']()
    if storyboard or times is not None:globals()['storyboard'](times)
    print('B2A_STAGE_DONE',time.time()-start,flush=True)
if __name__=='__main__':
    run(catalog='--catalog' in sys.argv,storyboard='--storyboard' in sys.argv,
        times=[float(x) for x in sys.argv[sys.argv.index('--times')+1].split(',')] if '--times' in sys.argv else None)
