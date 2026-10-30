"""D-1 absolute-time animation; shared room, hands and resume renderer are unchanged."""
import os,sys,json,math,time,hashlib,argparse,bisect,types
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
saved=sys.argv[:];sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
if bpy.app.background:
    import desk_lib as d
else:
    # GUI import adapter, copied from the existing 1-2v2 workflow. The source
    # library on disk stays unchanged and all previous scenes stay recoverable.
    libpath=os.path.join(os.path.dirname(__file__),'desk_lib.py');libsource=open(libpath).read()
    assert libsource.count('bpy.ops.wm.read_factory_settings(use_empty=True)')==1
    libsource=libsource.replace('bpy.ops.wm.read_factory_settings(use_empty=True)','pass # GUI scene already empty').replace('bpy.context.active_object','bpy.context.view_layer.objects.active')
    assert libsource.count('o.hide_render=not keep;o.hide_viewport=not keep')==1
    libsource=libsource.replace('o.hide_render=not keep;o.hide_viewport=not keep','show(o,keep) # D1 equivalent differential visibility')
    assert libsource.count('for o in bpy.data.objects:')==1
    libsource=libsource.replace('for o in bpy.data.objects:','for o in list(SC.objects): # D1 stage must not touch preserved scenes')
    # Earlier preserved scenes are already prefixed. Rename each unprefixed
    # object once, preserving all old scenes while freeing exact library names.
    for o in list(bpy.data.objects):
        if not o.name.startswith('previous_'):o.name='previous_d1v1_'+o.name
    bpy.context.window.scene=bpy.data.scenes.new('Technical chain D-1v1')
    d=types.ModuleType('desk_lib');d.__file__=libpath;sys.modules['desk_lib']=d;exec(compile(libsource,libpath,'exec'),d.__dict__)
sys.argv=saved
import desk_lib_d1 as ext
from desk_render_axes import explicit_scene_bpy
if not bpy.app.background:
    import importlib
    ext=importlib.reload(ext)
from mathutils import Vector
def args():
    p=argparse.ArgumentParser();p.add_argument('--cache',default='/private/tmp/ys/ys-chain-d1v1');p.add_argument('--times');p.add_argument('--from',dest='start',type=float,default=0);p.add_argument('--to',dest='stop',type=float,default=1e9)
    p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16);p.add_argument('--every',type=int,default=1);p.add_argument('--out');p.add_argument('--force',action='store_true');p.add_argument('--catalog',action='store_true');p.add_argument('--problem',action='store_true');p.add_argument('--anchors-only',action='store_true');return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();DATA=json.load(open(A.cache+'/blender/data.json'));CUES=DATA['cues'];STARTS=[c['start'] for c in CUES];CUE={c['key']:c for c in CUES};FPS=30;NF=math.ceil(DATA['duration']*FPS)
PT=json.load(open(A.cache+'/phrase-times.json'))
# Same final hide flags as desk_lib.show, but avoid Blender's global collection
# remap for no-op writes and for hide_all's transient state inside one apply.
# No geometry or animation code reads these flags before the final update.
_VIS_QUEUE=None
def show_now_d1(o,v):
    hidden=not bool(v)
    if o.hide_render!=hidden:o.hide_render=hidden
    if o.hide_viewport!=hidden:o.hide_viewport=hidden
def show_d1(o,v):
    if _VIS_QUEUE is None:show_now_d1(o,v)
    else:_VIS_QUEUE[o]=bool(v)
d.show=show_d1
P,G=ext.build(DATA,A.cache);MANAGED=list(set(o for objs in G.values() for o in objs));BASE={o:(o.location.copy(),o.rotation_euler.copy(),o.scale.copy()) for o in MANAGED}
# A later episode may prefix Blender's globally unique object names to free its
# own base-library names. Our identity tests must continue using creation names.
CREATED_NAME={o:o.name for o in MANAGED}
# Blender's Object.children scans all objects, including preserved old scenes.
# This scene is now fully built and never adds geometry while animating. Cache
# exactly its parent edges once; traversal and the underlying show stay identical.
SCENE_OBJECTS=list(d.SC.objects);CHILDREN={o:[] for o in SCENE_OBJECTS}
DESK_D1=next(o for o in SCENE_OBJECTS if o.name=='desk');DESK_BASE_D1=DESK_D1.location.copy()
for child in SCENE_OBJECTS:
    if child.parent in CHILDREN:CHILDREN[child.parent].append(child)
def show_tree_d1(o,v):
    d.show(o,v)
    for child in CHILDREN.get(o,()):show_tree_d1(child,v)
d.show_tree=show_tree_d1
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale);d.SC.eevee.taa_render_samples=A.samples
def S(k):return CUE[k]['start']
def E(k):return CUE[k]['end']
def T(k,needle=None,occ=0):
    if needle is None:return S(k)
    pt=PT[CUE[k]['subtitle']];n=d.norm(needle);import re
    pat=re.compile(re.sub('[ウオ]','[ウオ]',n));pos=0
    for _ in range(occ+1):
        m=pat.search(pt['s'],pos)
        if not m:raise ValueError('D1 voice word missing '+k+' '+needle+' '+pt['s'])
        pos=m.start()+1
    return S(k)+pt['t'][m.start()]
def U(t,a,duration=.3):return d.sm((t-a)/max(.00001,duration))
def cue_at(t):return CUES[max(0,bisect.bisect_right(STARTS,t)-1)]
def visible(*names):
    for n in names:
        for o in G[n]:
            # Preserved GUI scenes retain the obsolete torus recoverably. N4's
            # red band now belongs to the metal body's own material faces.
            if not CREATED_NAME[o].startswith('d1_can_redband'):d.show(o,True)
def hide_all():
    for o in MANAGED:d.show(o,False)
    for n in d.HANDS:
        d.HANDS[n].scale=(1,1,1);d.set_hand(n,(0,0,0),vis=False)
def small_hand_d1(name,tip,yaw=75,pitch=-25,scale=.32):
    # Same reference mitten, scaled to this small teaching model. Correct the
    # wrist origin so the original fingertip remains exactly on the target.
    d.set_hand(name,tip,yaw=yaw,pitch=pitch);h=d.HANDS[name];h.scale=(scale,)*3
    h.location=Vector(tip)-h.rotation_euler.to_matrix()@(d.TIP*scale)
def reset():
    hide_all()
    for o,(pos,rot,sc) in BASE.items():o.location=pos;o.rotation_euler=rot;o.scale=sc
    for can in [P['can']['can']]+P['twocans']['cans']:can['crush'].value=0
def camera_pose_d1(name):
    return list(D1_POSES[name] if name in D1_POSES else DATA['cameras'][name])
def pose_at(t):
    c=cue_at(t);i=CUES.index(c);p=[-.20,.10,.17,1.08,-8,27,40] if c['key']=='last:air' else camera_pose_d1(c['camera'])
    if c['key']=='mine:mio' and t<c['start']+1:
        # Move between desk sites at a safe working distance, then approach the
        # horse. Interpolating the tiny close-up distance across the desk drove
        # the old camera through the model during the middle of this move.
        wide=camera_pose_d1('horse');wide[3]=.85
        if t<c['start']+.5:
            u=U(t,c['start'],.5);return [a+(b-a)*u for a,b in zip(camera_pose_d1('board'),wide)]
        u=U(t,c['start']+.5,.5);return [a+(b-a)*u for a,b in zip(wide,p)]
    if c['key']=='can:heat':
        base=camera_pose_d1('can');close=camera_pose_d1('canclose')
        if t<c['start']+1:
            u=U(t,c['start'],1);return [a+(b-a)*u for a,b in zip(pose_at(c['start']-.001),base)]
        # Once the tongs have left and the mouth is in water, prepare a close
        # view in the pause. The camera is already stopped throughout row 17.
        u=U(t,T('can:heat','サカサ')+2.2,.8);return [a+(b-a)*u for a,b in zip(base,close)]
    if c['key']=='can:crush':return camera_pose_d1('canclose')
    if c['key']=='can:mio':return camera_pose_d1('canclose')
    if c['key']=='air:who':
        # Keep the still-unexplained can close until the existing spoken word.
        # The pressure arrows grow at that word while the camera reveals them.
        u=U(t,T('air:who','マワリノ'),.5);return [a+(b-a)*u for a,b in zip(camera_pose_d1('canclose'),camera_pose_d1('can'))]
    if c['key']=='air:1kg':
        unit=[.24,-.04,.001,.12,0,40,196];one=[.24,-.04,.008,.12,0,40,100];palm=camera_pose_d1('weights');hand=T('air:1kg','テノヒラ');weight=T('air:1kg','イチキログラム')
        if t<weight-.4:
            u=U(t,c['start'],.8);return [a+(b-a)*u for a,b in zip(camera_pose_d1('air'),unit)]
        if t<hand:
            # Frame the arriving weight before it becomes visible, rather than
            # showing a briefly oversized weight during the lens change.
            u=U(t,weight-.4,.4);return [a+(b-a)*u for a,b in zip(unit,one)]
        u=U(t,hand,.8);return [a+(b-a)*u for a,b in zip(one,palm)]
    if c['group']=='balloon':
        v=U(t,T('shrink:spoon','ジョオキニ'),1.5)*(1-U(t,T('shrink:back','センナナヒャクブンノ'),1));p=camera_pose_d1('balloon');p[2]=.04+.10*v;p[3]=.28+.35*v
        if c['key']=='shrink:spoon' and t<c['start']+c['move']:
            u=U(t,c['start'],c['move']);p=[a+(b-a)*u for a,b in zip(camera_pose_d1('logic'),p)]
        return p
    if c['key']=='nc:install':
        at=T('nc:install','スエツケ')
        if t<at-1.2:
            u=U(t,c['start'],.8);return [a+(b-a)*u for a,b in zip(camera_pose_d1('horse'),camera_pose_d1('mine'))]
        u=U(t,at-1.2,1.2);return [a+(b-a)*u for a,b in zip(camera_pose_d1('mine'),camera_pose_d1('engine'))]
    if c['key']=='size:2t':
        # Keep the 22 hands readable while explaining 100 kg x 22; reveal the
        # larger comparison only as the spoken two-tonne weight arrives.
        u=U(t,T('size:2t','ニトン')-1,1)
        return [a+(b-a)*u for a,b in zip(camera_pose_d1('area'),camera_pose_d1('heavyclose'))]
    if c['key']=='size:mio':return camera_pose_d1('heavyclose')
    if c['key']=='size:horse':
        u=U(t,T('size:horse','ウマ')-.4,1);return [a+(b-a)*u for a,b in zip(camera_pose_d1('heavyclose'),camera_pose_d1('heavy'))]
    move=1.2 if c['key'] in ['nc:install','eng:apply','next:spread','last:air'] else .8 if c['key']=='eng:steam' else c['move']
    if i and c['move'] and t<c['start']+move:
        u=U(t,c['start'],move);p=[a+(b-a)*u for a,b in zip(camera_pose_d1(CUES[i-1]['camera']),p)]
    if c['key']=='mine:open':p=list(p);p[3]+=.08*(1-U(t,0,1.5))
    return p
def set_camera(t):
    p=pose_at(t);d.pose_cam(p);c=cue_at(t)
    if p[3]<.5:d.CAM_D.dof.aperture_fstop=5.6
    if c['group']=='horse':
        point=P['horse']['horse']['root'].location+Vector((0,0,.034*.7))
        d.CAM_D.dof.focus_distance=(point-d.CAM.location).length;d.CAM_D.dof.aperture_fstop=11.2
    if c['group']=='can':
        point=P['can']['can']['root'].location
        d.CAM_D.dof.focus_distance=(point-d.CAM.location).length
        if p[3]<.5:d.CAM_D.dof.aperture_fstop=11.2
    if c['group']=='weights':
        if c['key']=='air:1kg' and t<T('air:1kg','テノヒラ'):
            point=(.24,-.049,.013) if t>=T('air:1kg','イチキログラム') else (.24,-.04,.003)
            d.CAM_D.dof.aperture_fstop=8 if t>=T('air:1kg','イチキログラム') else 64
        else:point=(.34,-.068,.037) if t>=T('air:1kg','ヒャッキログラム') else (.34,-.04,.008)
        d.CAM_D.dof.focus_distance=(Vector(point)-d.CAM.location).length
    if c['group']=='heavy' and t>=T('size:2t','ニトン'):
        d.CAM_D.dof.focus_distance=(Vector((.30,-.131,.058))-d.CAM.location).length;d.CAM_D.dof.aperture_fstop=5.6
    return p
def cam_keys():return [(c['start'],c['move'],[-.20,.10,.17,1.08,-8,27,40] if c['key']=='last:air' else camera_pose_d1(c['camera'])) for c in CUES]
def revision_assets_d1():
    global D1_HL
    if 'D1_HL' in globals():return
    q=P['engine'];beam=next(o for o in CHILDREN[q['beam']] if CREATED_NAME[o].startswith('d1_engine_beam'))
    D1_HL={}
    for role,o in [('boiler',q['boiler']),('piston',q['piston']),('pump',q['pump']),('beam',beam)]:
        m=o.active_material.copy();m.name='d1_r6_highlight_'+role;o.active_material=m;D1_HL[role]=m
def highlight_d1(role,t,at,duration=1):
    value=.8*math.sin(math.pi*U(t,at,duration));d.set_emit(D1_HL[role],value,'#ffd23f')
def water(t):
    return .05+.14*U(t,0,S('mine:rule'))-.17*U(t,S('eng:down'),E('last:air')-S('eng:down'))
def mine_state(t):
    q=P['mine'];w=water(t);q['pool'].dimensions.z=max(.006,w*.15);q['pool'].location.z=.023+q['pool'].dimensions.z/2
    q['shaft'].dimensions.z=max(.008,w);q['shaft'].location.z=.02+q['shaft'].dimensions.z/2;q['marker'].location.z=.02+w
    d.set_emit(q['gallery'].active_material,.8*math.sin(math.pi*U(t,T('mine:water','コオドオ'),1.6)),'#ffd23f')
    for i,o in enumerate(q['drops']):
        v=((t*.32+i*.063)%1);o.location=(-.40+.26*((i*7)%17)/17,.033,.27-.23*v);d.show(o,t<35.3 and (i<8 or t>=T('mine:water','シミダスミズ')))
def stroke(t):
    if t>=S('last:air'):return .5-.5*math.cos(2*math.pi*U(t,S('last:air'),E('last:air')-S('last:air')))
    if t<S('eng:up'):return .3
    if t<S('eng:down'):return U(t,T('eng:up','サガリ'),1.2)
    if t<S('eng:repeat'):return 1-U(t,T('eng:down','オシサゲ'),1)
    return .5-.5*math.cos((t-S('eng:repeat'))*2*math.pi/4)
def engine_state(t):
    q=P['engine'];v=stroke(t);z=q['bottom']+.014+.052*v;q['piston'].location.z=z
    angle=math.radians(-12+24*v);q['beam'].rotation_euler.y=-angle
    right=q['pivot']+Vector((.145*math.cos(angle),0,.145*math.sin(angle)));left=q['pivot']+Vector((-.145*math.cos(angle),0,-.145*math.sin(angle)))
    q['rod'].location=(Vector((q['cylx'],q['cy'],z))+right)/2;q['rod'].rotation_euler=(right-Vector((q['cylx'],q['cy'],z))).to_track_quat('Z','Y').to_euler();q['rod'].dimensions.z=(right-Vector((q['cylx'],q['cy'],z))).length
    q['mineRod'].location.z=left.z-.22
    cool=(T('myth:fact','ツメタイ')<=t<E('myth:judge')) or (T('eng:cool','ツメタイ')<=t<S('eng:down')) or (S('next:mio')<=t<E('next:waste') and int(t)%2==0)
    shrink=U(t,T('eng:cool','ミズニモドッテ'),.8) if S('eng:cool')<=t<S('eng:repeat') else U(t,T('myth:fact','ツメタイ'),.8) if S('myth:fact')<=t<E('myth:judge') else 0
    steam=not (S('eng:down')<=t<S('eng:repeat')) and shrink<.98
    q['steam'].scale=(max(.08,1-shrink),max(.08,1-shrink),max(.05,(z-q['bottom'])/.05)*(1-shrink));q['steam'].location.z=(z+q['bottom'])/2;d.show(q['steam'],steam)
    d.show(q['condensate'],shrink>.8)
    for i,o in enumerate(q['spray']):
        p=(t*1.7+i/12)%1;o.location=(q['cylx']+.045*(1-p),q['cy']-.01+.012*math.sin(i*2),q['bottom']+.025+.027*p)
        jet=(T('myth:fact','ツメタイ')<=t<T('myth:fact','ツメタイ')+.8) or (T('eng:cool','ツメタイ')<=t<T('eng:cool','ツメタイ')+.8) or (S('next:mio')<=t<E('next:waste') and int(t)%2==0);d.show(o,jet)
    fuel=S('next:mio')<=t<E('next:waste')
    q['shell'].active_material=d.mat('d1_temperature_cold' if cool else 'd1_fuel_hot' if fuel else 'd1_temperature_hot','#6fb3e0' if cool else '#c85042' if fuel else '#c9a44e',.35,metal=.65)
    d.set_emit(q['shell'].active_material,.8*math.sin(math.pi*U(t,T('nc:boiler','ツツ'),1)),'#ffd23f')
    if cue_at(t)['key']=='eng:steam':
        entered=U(t,T('eng:steam','ツツニ'),.9);q['steam'].location.z-=.04*(1-entered);q['steam'].scale*=.35+.65*entered;d.show(q['steam'],t>=T('eng:steam','ツツニ'))
    highlight_d1('boiler',t,T('nc:boiler','ボイラア'));highlight_d1('piston',t,T('nc:piston','ピストン'));highlight_d1('beam',t,T('nc:piston','シイソオ'))
    if cue_at(t)['key']=='eng:arm':
        highlight_d1('pump',t,T('eng:arm','ポンプ'))
        highlight_d1('piston',t,T('eng:arm','ピストン'));highlight_d1('beam',t,T('eng:arm','ツナガッテ'))
    balanced=T('eng:steam','オシカエス')<=t<E('eng:up')
    d.show_tree(q['push'],balanced or T('eng:down','オシサゲ')<=t<E('eng:repeat'));d.show_tree(q['balance'],balanced)
    trace=U(t,T('eng:arm','タンコオノソコ'),1);q['trace'].dimensions.z=.001+.47*trace;q['trace'].location.z=.54-q['trace'].dimensions.z/2;d.show(q['trace'],S('eng:arm')<=t<E('eng:arm') and trace>0)
    for i,o in enumerate(q['water']):
        vv=(t*1.8+i/10)%1;o.location=(-.33+.07*vv,.08,.36-.01*vv);d.show(o,T('eng:down','チジョオエ')<=t<E('eng:mio2') or t>S('last:air'))
    if t<S('nc:boiler'):
        for o in q['objects']:
            name=CREATED_NAME[o];index=0 if any(s in name for s in ['boiler','fire','mortar']) else 1 if any(s in name for s in ['cylinder','floor','piston','steam','inlet']) else 2 if any(s in name for s in ['beam','pier','axle']) else 3
            at=T('nc:install','スエツケ')+.3*index;v=t>=at and not any(s in name for s in ['cold_','condensate','outwater','push','inside','trace'])
            d.show(o,v)
            if v and not o.parent:o.location.z+=.04*(1-U(t,at,.3))
def horse_state(t):
    q=P['horse'];a=t*.8;center=Vector((-.2909,.082,.32));radius=.019
    # The old .08m circle crossed the open shaft and the hut. This circle keeps
    # every hoof on grass and clear of the hut; lever tip follows the same path.
    q['arm'].location=center+Vector((0,0,.04));q['arm'].scale=(radius/.09,radius/.09,1);q['arm'].rotation_euler.z=a
    for child in CHILDREN[q['arm']]:child.scale.y/=radius/.09
    for o in G['horse']:
        if CREATED_NAME[o]=='d1_winch':
            o.location=BASE[o][0]+Vector((center.x+.30,center.y-.10,0));o.scale.x*=.55;o.scale.y*=.55
    h=q['horse']['root'];h.location=center+Vector((radius*math.cos(a),radius*math.sin(a),0));h.rotation_euler.z=a+math.pi/2
    q['bucket'].location.z=.17+.11*math.sin(t*1.2);q['rope'].location.z=(.39+q['bucket'].location.z)/2;q['rope'].dimensions.z=.39-q['bucket'].location.z
    for i,o in enumerate(q['sweat']):
        v=(t*1.2+i*.25)%1;o.location=h.location+Vector((.025+.016*v,0,.045+.015*math.sin(v*math.pi)));d.show(o,S('mine:mio')<=t<E('mine:mio'))
def can_state(t):
    q=P['can'];c=q['can'];inv=U(t,T('can:heat','サカサ'),1);c['root'].location=(.145+.12*inv,-.12,.062+.017*math.sin(math.pi*inv)-.012*inv);c['root'].rotation_euler.y=math.pi*inv
    crush=U(t,T('can:crush','グシャット'),.15);c['crush'].value=crush
    for o in c['rim']:o.scale.x=1-.20*crush;o.scale.y=1-.15*crush
    for i,o in enumerate(q['mist']):o.location=(.145+.005*math.sin(t*3+i),-.12,.11+((t*.04+i*.017)%.06));d.show(o,T('can:heat','アタタメ')<=t<T('can:heat','サカサ'))
    reveal=U(t,T('air:who','マワリノ'),.5);center=Vector((.265,-.12,.048))
    for o in q['arrows']:
        o.scale=(reveal,)*3;o.location=center*(1-reveal)
        d.show_tree(o,t>=T('air:who','マワリノ') and reveal>0)
    d.show_tree(q['tongs'],T('can:heat','サカサ')-.5<=t<=T('can:heat','サカサ')+1.6)
    q['tongs'].location.x=.12*inv
    if T('can:heat','サカサ')-.5<=t<=T('can:heat','サカサ')+1.6:d.set_hand('kai',(.12+.12*inv,-.12,.083),yaw=75,pitch=-20)
def balloon_state(t):
    q=P['balloon'];v=U(t,T('shrink:spoon','ジョオキニ'),1.5)*(1-U(t,T('shrink:back','センナナヒャクブンノ'),1));r=.02+.10*v
    q['balloon'].scale=(r,r,r*(1+.04*math.sin(t*7)*(1-v)));q['balloon'].location.z=r+.028
    d.show(q['liquid'],v<.95)
    for i,o in enumerate(q['mist']):o.location=(.03+.004*math.sin(t*2+i),-.16,.025+((t*.04+i*.012)%max(.03,r)));d.show(o,T('shrink:spoon','ジョオキニ')<=t<E('shrink:back'))
def weights_state(t):
    q=P['weights'];one=T('air:1kg','イチキログラム');hundred=T('air:1kg','ヒャッキログラム')
    q['one'].location.z+=.0025*(1-U(t,one,.4));q['hundred'].location.z+=.012*(1-U(t,hundred,.4));d.show_tree(q['one'],t>=one);d.show_tree(q['hundred'],t>=hundred)
    d.show_tree(q['up'],T('air:inside','ウチガワ')<=t<T('air:inside','ナクナッタ'));d.show_tree(q['down'],t>=T('air:inside','ウチガワ'))
def layers_state(t):
    q=P['air'];a=T('air:weight','ツモッタ')
    for i,(o,pp) in enumerate(zip(q['layers'],q['particles'])):
        v=t>=a+.1*i;d.show(o,v)
        for p in pp:d.show(p,v)
        for edge in q['edges'][i]:d.show(edge,v)
    if t<a:d.set_hand('kai',(.40,.09,.012),yaw=75,pitch=-20)
def twocans_state(t):
    q=P['twocans'];a=T('why:air','クウキワ');s=T('why:air','ジョオキナラ');v=U(t,s,1.4)
    for j,pp in enumerate(q['particles']):
        for i,o in enumerate(pp):
            pos=BASE[o][0]
            if j==0:o.location=Vector((.17,-.12,.05))+(pos-Vector((.17,-.12,.05)))*(1-.12*U(t,a,1))
            else:o.location.z=pos.z*(1-v)+.015*v;d.show(o,v<.96);o.active_material=d.mat('d1_cold','#6fb3e0',.5,alpha=.6) if v>.5 else d.M_WHITE
    q['cans'][1]['crush'].value=.17*v
    for i,o in enumerate(q['rain']):o.location.z=.15-((t*.08+i*.011)%.09);d.show(o,t>=a)
def hemispheres_state(t):
    q=P['hemi'];join_at=T('size:guericke','フタツアワセ');joined=U(t,join_at,.8);release=U(t,T('size:pull','クウキオ'),.6)
    apart=.025*(1-joined)
    for i,o in enumerate(q['parts']):sign=-1 if i==0 else 1;o.location.x+=sign*(apart+.08*release);o.rotation_euler.y=sign*release*.6
    d.show(q['seam'],joined>.98 and release<.1);q['valve'].rotation_euler.z=release*math.pi/2
    q['valve'].location.x+=apart;q['valvepipe'].location.x+=apart
    for i,h in enumerate(q['horses']):
        d.show_tree(h['root'],t>=S('size:pull'));h['root'].location.x+=(-1 if i<4 else 1)*.012*math.sin(math.pi*release);h['root'].rotation_euler.y=.4*math.sin(math.pi*release)
        for j,leg in enumerate(h['legs']):leg.location.z+=.003*math.sin(t*25+j*math.pi)
    for o in q['ropes']:d.show(o,t>=S('size:pull'))
    pump_at=T('size:guericke','ヌキマシタ');in_at=T('size:pull','クウキオ')
    for i,o in enumerate(q['gas']):
        v=(t*.8+i/10)%1;entering=in_at<=t<in_at+.6
        o.location=q['center']+Vector((0,0,.07+.03*(1-v if entering else v)))
        d.show(o,pump_at<=t<E('size:guericke') or entering)
    point_at=T('size:guericke','クウキノチカラ')
    if point_at<=t<point_at+1.3:small_hand_d1('kai',q['center']+Vector((-.018+.01*math.sin(math.pi*U(t,point_at,.7)),-.045,.018)),pitch=-20,scale=.55)
    if join_at-.35<=t<join_at+1:small_hand_d1('kai',q['center']+Vector((apart+.028,-.025,.025)),pitch=-20,scale=.55)
    a=T('size:pull','クウキオ')
    if a-.6<=t<a+1:d.set_hand('kai',q['center']+Vector((0,-.005,.068)),yaw=65,pitch=-15)
def hands(t):
    c=cue_at(t)
    if c['key']=='nc:install' and T('nc:install','スエツケ')-.3<=t<T('nc:install','スエツケ')+1.3:d.set_hand('kai',(-.065-.10*U(t,T('nc:install','スエツケ'),1.2),.08,.55),yaw=75,pitch=-25)
    if c['group'] in ['engine','pump','cylinder','logic'] and (c['key'] in ['nc:boiler','nc:piston','eng:arm']):
        loc=Vector((-.06,.08,.46))
        if c['key']=='eng:arm':
            u=U(t,T('eng:arm','モオカタガワ'),.8);loc=Vector((-.355,.035,.09)).lerp(Vector((-.065,.06,.44)),u)
        d.set_hand('kai',loc,yaw=75,pitch=-25)
    if c['key']=='air:1kg':
        a=T('air:1kg','イチエイホオ');b=T('air:1kg','イチキログラム');h=T('air:1kg','テノヒラ')
        if a<=t<b:small_hand_d1('kai',(.235+.010*U(t,a,.7),-.045,.003),scale=.065)
        if h+.8<=t<h+2.1:small_hand_d1('kai',(.355,-.023,.011),scale=.28)
    if c['group']=='area' and t<T('size:area','テノヒラ'):
        # Point to the diameter, then the centre/radius in step with the words.
        a=T('size:53','チョッケイ');b=T('size:53','ハンケイ');r=T('size:area','ハンケイ')
        if a<=t<b:loc=(.161+.058*U(t,a,1.2),-.08,.093)
        elif b<=t<r:loc=(.19+.029*U(t,b,1),-.08,.093)
        else:
            phase=U(t,r,1);loc=(.19+.029*phase,-.08,.093)
        if t>=a:small_hand_d1('kai',loc)
def apply_state_d1(t):
    reset();revision_assets_d1();c=cue_at(t);g=c['group'];r=c['row']
    DESK_D1.location=DESK_BASE_D1;d.set_emit(d.MATS['d1_palm'],0)
    for material in D1_HL.values():d.set_emit(material,0)
    for name in ['d1_temperature_cold','d1_fuel_hot','d1_temperature_hot']:
        if name in d.MATS:d.set_emit(d.MATS[name],0)
    if g in ['mine','horse','engine','logic','pump','cylinder','coal','last']:
        visible('mine');mine_state(t)
        if 3<=r<=6:visible('horse');horse_state(t)
        if r>=6:visible('engine');engine_state(t)
        if r>=3 and t>=T('mine:horse','トジテ'):visible('score')
        if g=='coal':
            visible('coal');n=int(max(0,t-T('next:waste','アタタメナオス')))
            for i,o in enumerate(P['coal']['pieces']):d.show(o,i>=n)
    elif g=='score':visible('score')
    elif g=='balloon':visible('balloon');balloon_state(t)
    elif g=='can':visible('can');can_state(t)
    elif g=='straw':
        visible('straw');q=P['straw'];v=U(t,T('straw:drink','ヘラシテ'),1)
        for i,o in enumerate(q['bubbles']):o.location.z+=v*.08;d.show(o,v<(i+1)/10)
        vv=U(t,T('straw:push','オシアゲテ'),1);q['juice'].dimensions.z=.01+.10*vv;q['juice'].location.z=.02+q['juice'].dimensions.z/2
        for o in q['arrows']:d.show_tree(o,vv>0)
    elif g=='air':visible('air');layers_state(t)
    elif g=='weights':visible('weights');weights_state(t)
    elif g=='inside':
        visible('can','weights');can_state(t);weights_state(t)
        for o in G['can']:
            if CREATED_NAME[o].startswith(('d1_stove','d1_flame_ring')):d.show(o,False)
        for o in G['weights']:
            if not o.parent:o.location+=Vector((-.20,-.08,0))
        for n in ['one','hundred']:d.show_tree(P['weights'][n],False)
    elif g=='twocans':visible('twocans');twocans_state(t)
    elif g=='twins':
        visible('twins')
        for arr in P['twins']['arrows']:
            for o in arr:d.show_tree(o,t>=T('size:wide','フエテ'))
    elif g in ['area','heavy']:
        visible('area');q=P['area'];a=T('size:area','テノヒラ')
        for i,o in enumerate(q['palms']):d.show_tree(o,t>=a+i*.06)
        d.show(q['diameter'],T('size:53','チョッケイ')<=t<a);d.show(q['radius'],T('size:53','ハンケイ')<=t<a)
        if g=='heavy':
            visible('heavy');q=P['heavy'];q['weight'].location.z+=.10*(1-U(t,T('size:2t','ニトン'),.4));d.show_tree(q['weight'],t>=T('size:2t','ニトン'))
            for i,h in enumerate(q['horses']):
                d.show_tree(h['root'],t>=T('size:horse','ウマ')+.2*i);h['root'].location.x+=.07-.01*i
                h['root'].location.z+=d.hop(d.lin(t,T('size:horse','ウマ')+.2*i,T('size:horse','ウマ')+.2*i+.3),.015)
            a=T('size:2t','ニジュウニマイ');d.set_emit(d.MATS['d1_palm'],.6*math.sin(math.pi*U(t,a,.7)),'#ffd23f')
            elapsed=t-T('size:2t','ニトン')
            if 0<=elapsed<.4:
                shake=.002*math.sin(6*math.pi*elapsed/.4)*(1-elapsed/.4)
                DESK_D1.location.z+=shake
                for o in G['area']+G['heavy']:
                    if not o.parent:o.location.z+=shake
    elif g in ['hemisphere','pull']:visible('hemi');hemispheres_state(t)
    elif g=='map':
        visible('map');a=T('next:spread','スウジュウネン')
        for i,o in enumerate(P['map']['stamps']):d.show_tree(o,t>=a+.05*i)
    elif g=='fuji':challenge_setup()
    d.dg['make'].data.body='1' if t>=T('mine:horse','トジテ') else '0';d.dg['brk'].data.body=str(2 if t>=T('next:spread','クミダセル') else 1 if t>=T('eng:repeat','クリカエ') else 0)
    # Reinforce the visibility at the scene boundary as these auxiliary meshes
    # must never survive reset into another cue or into the small Fuji engines.
    for o in MANAGED:
        name=CREATED_NAME[o]
        if '_trace' in name:d.show(o,c['key']=='eng:arm' and name.startswith('d1_engine_') and t>=T('eng:arm','タンコオノソコ'))
        if '_condensate' in name:d.show(o,c['key'] in ['myth:fact','myth:judge','eng:cool','eng:mio'] and name.startswith('d1_engine_'))
    set_camera(t);hands(t);return anchors(t)
def apply(t):
    global _VIS_QUEUE
    if _VIS_QUEUE is not None:raise RuntimeError('Nested D1 visibility transaction')
    _VIS_QUEUE={}
    try:return apply_state_d1(t)
    finally:
        pending=_VIS_QUEUE;_VIS_QUEUE=None
        for o,v in pending.items():show_now_d1(o,v)
        bpy.context.view_layer.update()
def anchors(t):
    return {'boiler':Vector((-.065,.10,.36)),'cyl':Vector((-.065,.10,.42)),'piston':Vector((-.065,.10,P['engine']['bottom']+.014+.052*stroke(t))),'beam':Vector((-.21,.10,.54)),'can':Vector((.265,-.12,.05)),'coal':Vector((.025,.10,.38)),'fuji':Vector((.33,.05,.16))}
def challenge_setup():
    hide_all();visible('fuji')
    for o in P['fuji']['answers']:d.show_tree(o,False)
    for _,g in P['fuji']['engines']:
        for o in [g['push'],g['balance'],g['trace'],g['condensate']]:d.show_tree(o,False)
        for o in g['spray']+g['water']:d.show(o,False)
    d.pose_cam(DATA['cameras']['fuji'])
    if _VIS_QUEUE is None:bpy.context.view_layer.update()
def answer_state():
    challenge_setup()
    for o in P['fuji']['answers']:d.show_tree(o,True)
def problem():
    bpy.context.window.scene=d.SC
    out=A.out or A.cache+'/problem';os.makedirs(out,exist_ok=True);prior=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='PNG'
    try:
        for name,fn in [('挑戦',challenge_setup),('答え',answer_state)]:fn();d.SC.render.filepath=out+'/'+name+'.png';bpy.ops.render.render(write_still=True,scene=d.SC.name)
    finally:d.SC.render.image_settings.file_format=prior
def catalog():
    bpy.context.window.scene=d.SC
    out=A.out or A.cache+'/blender/catalog-d1v1';os.makedirs(out,exist_ok=True)
    specs=[('mine',['mine','horse'],(-.20,.10,.18),.40),('engine',['engine'],(-.20,.10,.38),.32),('balloon',['balloon'],(.05,-.16,.14),.25),('can',['can'],(.22,-.12,.05),.24),('straw',['straw'],(.40,-.10,.07),.10),('air',['air'],(.40,.15,.15),.22),('weights',['weights'],(.29,-.04,.05),.18),('twocans',['twocans'],(.22,-.12,.05),.18),('area',['area','heavy'],(.24,-.08,.07),.22),('hemispheres',['hemi'],(.10,-.05,.055),.60),('map',['map'],(.20,.38,.15),.40),('coal',['coal'],(.025,.10,.35),.13),('fuji',['fuji'],(.27,.05,.15),.42)]
    for name,groups,center,span in specs:
        reset();visible(*groups)
        if name=='balloon':balloon_state(104.5)
        if name=='fuji':challenge_setup()
        for top in [False,True]:
            f=out+'/d1v1_'+name+('_top.jpg' if top else '_oblique.jpg')
            if os.path.exists(f) and not A.force:continue
            d.catalog_camera(center,top,span);d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
D1_POSES={
    'mine':[-.20,.10,.14,1.02,-12,28,40],
    'board':[.58,.30,.08,.78,0,30,40],
    'horse':[-.2909,.082,.351,.145,-142,35,40],
    'engine':[-.19,.10,.43,.83,-10,32,40],
    'pump':[-.20,.10,.235,1.02,-8,27,40],
    'logic':[-.075,.10,.408,.23,-15,32,46],
    'cylinder':[-.065,.10,.4135,.29,-10,45,46],
    'can':[.23,-.12,.065,.54,-15,34,40],
    'canclose':[.265,-.12,.020,.21,-15,34,40],
    'air':[.40,.15,.13,.36,0,25,40],
    'weights':[.34,-.04,.015,.26,-8,45,50],
    'inside':[.23,-.12,.055,.53,-12,35,40],
    'twocans':[.22,-.12,.07,.47,-8,35,40],
    'twins':[.20,-.08,.07,.40,-8,24,40],
    'hemisphere':[.10,-.05,.06,.35,-12,35,40],
    'heavyclose':[.30,-.08,.062,.34,-12,35,40],
    'pull':[.10,-.05,.06,1.49,-8,30,40],
}
SPANS=[(c['start'],c['start']+c['move']) for c in CUES if c['move']]
SPANS += [(0,35.3),(41.9,43.3),(44.1,54.8),(83.42,85),(100.02,101.6),(113.41,114.7),(118.43,123.0),(126.01,126.2),(149.27,150.5),(151.89,153.0),(160.82,162),(171.6,172.1),(178.35,178.85),(185.66,186.0),(204.15,210.1),(239.82,241.1),(245.6,250.7),(257.54,258.6),(263,263.6),(265.8,270.72),(300.62,302.0),(311.15,311.7),(319.9,320.9),(333.9,334.6),(335.72,343.62),(346.14,347.7),(354.75,374.9),(396.79,405.4)]
SPANS += [(T('size:53','チョッケイ'),T('size:53','チョッケイ')+1.2),(T('size:53','ハンケイ'),T('size:53','ハンケイ')+1),(T('size:area','ハンケイ'),T('size:area','ハンケイ')+1)]
SPANS += [(T('size:guericke','クウキノチカラ'),T('size:guericke','クウキノチカラ')+1.3),(T('size:guericke','フタツアワセ'),T('size:guericke','フタツアワセ')+.8)]
SPANS += [(T('size:2t','ニトン')-1,T('size:2t','ニトン')+.4),(T('size:2t','ニジュウニマイ'),T('size:2t','ニジュウニマイ')+.7)]
SPANS += [(T('air:1kg','イチエイホオ'),T('air:1kg','イチキログラム')+.4),(T('air:1kg','テノヒラ'),T('air:1kg','テノヒラ')+2.1)]
SPANS += [(T('nc:boiler','ボイラア'),T('nc:boiler','ボイラア')+1),(T('nc:boiler','ツツ'),T('nc:boiler','ツツ')+1),(T('nc:piston','ピストン'),T('nc:piston','ピストン')+1),(T('nc:piston','シイソオ'),T('nc:piston','シイソオ')+1)]
SPANS += [(T('eng:arm','ポンプ'),T('eng:arm','ポンプ')+1),(T('eng:arm','モオカタガワ'),T('eng:arm','ツナガッテ')+1),(T('eng:steam','ツツニ'),T('eng:steam','ツツニ')+.9)]
SPANS += [(S(k),S(k)+1.2) for k in ['nc:install','eng:apply','next:spread','last:air']]
SPANS += [(S('nc:install'),S('nc:install')+.8),(T('nc:install','スエツケ')-1.2,T('nc:install','スエツケ')),(T('air:1kg','イチキログラム')-.4,T('air:1kg','イチキログラム')),(T('size:horse','ウマ')-.4,T('size:horse','ウマ')+.6)]
SPANS += [(T('can:heat','サカサ')+2.2,T('can:heat','サカサ')+3),(T('air:who','マワリノ'),T('air:who','マワリノ')+.5)]
EVENTS=sorted(set([c['start'] for c in CUES]+[w['time'] for c in CUES for w in c['wordEvents']]+[b for a,b in SPANS]+[T('air:inside','ウチガワ')]))
def plan_d1(j):
    t=j/FPS
    if any(a-.034<=t<=b+.034 for a,b in SPANS):return ('render',None)
    a=max([0]+[x for x in EVENTS if x<=t]);k=min(j,int(math.ceil(a*FPS+1e-7)));return ('render',None) if k==j else ('dup',k)
def main():
    bpy.context.window.scene=d.SC
    assert bpy.context.scene is d.SC,'D1 render must enter its own scene'
    seed=A.cache+'/blender/seed-d1v1';os.makedirs(seed+'/blender/desk',exist_ok=True)
    json.dump({'anchors':{}},open(seed+'/blender/desk/anchors.json','w'));json.dump({'moving_spans':[]},open(seed+'/blender/camera-motion.json','w'))
    names=list(anchors(0));opts={'every':A.every,'scale':A.scale,'times':[float(x) for x in A.times.split(',')] if A.times else None,'out':A.out,'from':A.start,'to':A.stop,'force':A.force}
    plans=[plan_d1(j) for j in range(NF)];count=len({j if p[0]=='render' else p[1] for j,p in enumerate(plans)});calls=[0]
    def proj_apply(t):
        if not opts['times'] and calls[0]<count:calls[0]+=1;set_camera(t);bpy.context.view_layer.update();return anchors(t)
        return apply(t)
    if opts['times']:
        out=A.out or A.cache+'/blender/preview';os.makedirs(out,exist_ok=True);arr={n:[[0,0,0] for _ in range(NF)] for n in names}
        for t in opts['times']:
            pts=apply(t)
            for n in names:arr[n][round(t*FPS)]=d.project(pts[n])
        json.dump({'fps':FPS,'anchors':arr},open(out+'/anchors.json','w'))
    # The shared preview branch always renders its times. Reuse exact existing
    # previews only after writing all requested anchors. An empty missing list
    # must skip d.main, never select its full-production branch.
    requested=opts['times'];pending_times=requested
    if requested and not A.force:
        pending_times=[t for t in requested if not os.path.exists(os.path.join(A.out or A.cache+'/blender/preview','%05d.jpg'%round(t*FPS)))]
        opts={**opts,'times':pending_times}
    scope={**d.__dict__,'bpy':explicit_scene_bpy(d.SC),'__file__':__file__,'A':opts,'CACHE':seed,'CACHE6':A.cache,'NF6':NF,'FPS':FPS,'CLIP6':{'duration':DATA['duration']},'CUE6':{c['key']:{'s':c['start'],'e':c['end']} for c in CUES},'DATA':DATA,'PT6':{'stateSHA':hashlib.sha256(open(__file__,'rb').read()+open(ext.__file__,'rb').read()).hexdigest()},'plan6':(lambda j:('render',None)) if requested else plan_d1,'apply6':proj_apply,'anchors':lambda t:{},'anchors5':lambda t:{},'V6_ANC':names,'S6':lambda key:1e6,'T6':lambda *a,**k:0}
    if not A.anchors_only and (not requested or pending_times):
        try:types.FunctionType(d.main.__code__,scope)()
        except SystemExit as e:
            if e.code not in [None,0]:raise
    poses=[tuple(round(x,10) for x in pose_at(j/FPS)) for j in range(NF)];mv=[False]+[poses[j]!=poses[j-1] for j in range(1,NF)]
    spans=[];start=None
    for j,flag in enumerate(mv+[False]):
        if flag and start is None:start=j/FPS
        if not flag and start is not None:spans.append([start,j/FPS]);start=None
    json.dump({'frames':NF,'moving_frames':sum(mv),'moving_ratio':sum(mv)/NF,'moving_spans':spans,'top_ratio':sum(p[5]>=65 for p in poses)/NF},open(A.cache+'/blender/camera-motion.json','w'),indent=1)
if __name__=='__main__':
    if A.catalog:catalog()
    elif A.problem:problem()
    else:main()
