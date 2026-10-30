"""B-1 original tabletop production; supplied narration and existing models remain read-only."""
import os,sys,math,json,time,hashlib,types,argparse
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
argv=sys.argv[:];sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
if bpy.app.background:import desk_lib as d
else:
    path=os.path.join(os.path.dirname(__file__),'desk_lib.py');source=open(path).read()
    source=source.replace('bpy.ops.wm.read_factory_settings(use_empty=True)','pass # preserve GUI scenes')
    source=source.replace('bpy.context.active_object','bpy.context.view_layer.objects.active')
    for o in list(bpy.data.objects):
        if not o.name.startswith('previous_'):o.name='previous_b1_'+o.name
    bpy.context.window.scene=bpy.data.scenes.new('Technical chain B-1')
    d=types.ModuleType('desk_lib');d.__file__=path;sys.modules['desk_lib']=d;exec(compile(source,path,'exec'),d.__dict__)
sys.argv=argv
import desk_lib_b1 as ext
if not bpy.app.background:
    import importlib
    ext=importlib.reload(ext)
from mathutils import Vector
def args():
    p=argparse.ArgumentParser();p.add_argument('--cache',default='/private/tmp/ys/ys-chain-b1v1');p.add_argument('--catalog',action='store_true');p.add_argument('--gates',action='store_true');p.add_argument('--times');p.add_argument('--from',dest='start',type=float,default=0);p.add_argument('--to',dest='stop',type=float,default=1e9);p.add_argument('--out');p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16);p.add_argument('--every',type=int,default=1);p.add_argument('--force',action='store_true');return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();DATA=json.load(open(A.cache+'/blender/data.json'))['b1'];CUES=DATA['cues'];FPS=30
def catalog_stage_private():
    exact={'floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3'};prefixes=('winF','picF','leg','stack')
    for ob in list(d.SC.objects):
        hidden=not (ob.type in ('LIGHT','CAMERA') or ob.name in exact or ob.name.startswith(prefixes))
        if ob.hide_render!=hidden:ob.hide_render=hidden
        if ob.hide_viewport!=hidden:ob.hide_viewport=hidden
    for ld,power in d.LIGHTS:ld.energy=power
    d.BGN.inputs[1].default_value=.35
d.catalog_stage=catalog_stage_private
PARTS,GROUPS=ext.build(DATA,A.cache+'/blender/tex');ALL=list({o for g in GROUPS.values() for o in g});BASE={o:(o.location.copy(),o.rotation_euler.copy(),o.scale.copy()) for o in ALL}
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale);d.SC.eevee.taa_render_samples=A.samples
# Reuse the reference score-board shape in the new scene, not the reference file.
d.board_h.location.x+=.12-d.BD.x;d.board_h.location.y+=.12-d.BD.y
for o in d.board_h.children:
    if o.type=='FONT' and o.data.body in ['作る側','破る側']:o.data.body='言い伝え' if o.data.body=='作る側' else '実験'
BOARD_BASE=d.board_h.location.copy()
yellow=d.mat('b1yellow','#ffd23f',.4,emit='#ffd23f',strength=.5)
star_dots=[]
for i in range(24):
    v=Vector((0,-.13,.045)).lerp(PARTS['star'],i/23);star_dots.append(d.sphere('b1_starlink',.002,v,yellow,seg_=8,ring=4))
attract=ext.curve('b1_attract',[Vector((0,-.13,.045)),Vector((.16,.02,.12)),Vector((.32,.09,.24))],yellow,.0015)
def hero_points(camera):
    names={'compass':['b1_boxbase','b1_boxside','b1_boxedge'],'score':['board','b1_boxbase'],'star':['b1_polarstar','b1_boxbase'],'map':['b1_mapboard'],'sailor':['b1_sailorbody','b1_sailorhead'],'gilbert':['b1_gilbertbody','b1_gilberthead'],'magnet':['b1_magAhalf'],'pair':['b1_magAhalf','b1_magBhalf'],'vane':['b1_roosterbody','b1_boxbase'],'terrella':['b1_terrella'],'dip':['b1_terrella'],'powder':['b1_glassboard'],'globe':['b1_globe'],'globeCompass':['b1_globe','b1_boxbase'],'predict':['b1_cutaway'],'meter':['b1_meter_semicircle','b1_normanbody','b1_normanhead'],'book':['b1_book_pages','board']}.get(camera,[])
    # Frame the garlic experiment itself: the magnet AND the three iron nails.
    # The earlier single-bar cloud left the nail heads beyond the right edge.
    if camera=='magnet':names+=['b1_nailshaft','b1_nailhead']
    if camera=='globeCompass':names+=['b1_boxside','b1_boxedge','b1_lid']
    points=[]
    if camera=='powder':
        rock=PARTS['terrella']['rock'];points.extend(rock.matrix_world@v.co for v in rock.data.vertices)
        return points
    if camera=='challenge':
        rock=PARTS['terrella']['rock'];return [rock.matrix_world@v.co for v in rock.data.vertices]
    for o in bpy.context.scene.objects:
        if any(o.name==nm or o.name.startswith(nm+'.') for nm in names):
            if o.type=='MESH':points.extend(o.matrix_world@v.co for v in o.data.vertices)
            elif o.type=='CURVE':
                for spl in o.data.splines:points.extend(o.matrix_world@Vector(p.co[:3]) for p in spl.points)
    return points
def calibrate_cameras():
    """Measure the actual explanatory pose, not the unused factory arrangement."""
    DATA['poses']['globeCompass']=[.17,-.01,.13,.95,-35,30,40]
    DATA['poses']['terrella'][2]=.105
    DATA['poses']['terrella'][4:6]=[65,25]
    # Keep the already-explained red pole above the fixed caption area.
    for name in ['powder','challenge']:DATA['poses'][name][2]-=.020
    DATA['poses']['pair'][:]=[-.035,.04,.03,.60,65,40,40]
    DATA['poses']['vane'][:3]=[.10,-.18,.11]
    DATA['poses']['sailor'][:3]=[.035,-.02,.06]
    # Fit the widest real arrangement, not only the later touching/turned pose.
    representatives={'score':18,'star':24,'pair':83.1,'vane':107.5,'meter':249.4,'globeCompass':294.4}
    previous=None
    for c in CUES:
        if c['row']==32:c['camera']='globeCompass'
        if c['row']==38:c['camera']='challenge'
        if previous is not None and previous!=c['camera'] and not c['move']:c['move']=1.0
        c['pose']=DATA['poses'][c['camera']]
        previous=c['camera']
    measures={}
    for nm,p in DATA['poses'].items():
        if nm=='magnet':p[4]=65
        cue=next((c for c in CUES if c['camera']==nm),CUES[0]);t=representatives.get(nm,cue['end']-.25)
        apply(t);bpy.context.view_layer.update();pts=hero_points(nm)
        if not pts:continue
        if nm in ['score','star','vane','globeCompass','meter','book','magnet']:
            p[:3]=[(min(v[a] for v in pts)+max(v[a] for v in pts))/2 for a in range(3)]
        if nm=='star':p[2]-=.060  # Keep the whole needle clear of the speaker badge.
        target=.40 if nm in ['sailor','gilbert'] else .58 if nm=='powder' else .66
        for _ in range(8):
            d.pose_cam(p);bpy.context.view_layer.update();screen=[d.project(v) for v in pts];xs=[v[0]/1080 for v in screen];span=max(xs)-min(xs)
            p[3]*=span/target
        measures[nm]={'pose':list(p),'width':span,'height':(max(v[1] for v in screen)-min(v[1] for v in screen))/1920,'representative':t}
    json.dump(measures,open(A.cache+'/blender/subject-width-calibration.json','w'),indent=1)
    json.dump({'cues':CUES,'measured':measures},open(A.cache+'/blender/production-camera-poses-b1v1.json','w'),indent=1)
def u(t,a,duration=1):return d.seg(t,a,a+duration)
def cue_at(t):return next((c for c in reversed(CUES) if t>=c['start']),CUES[0])
def visible(*names):
    for name in names:
        for o in GROUPS[name]:d.show(o,True)
def hide_all():
    for o in ALL:d.show(o,False)
def touch(who,point,t,a,b,yaw=-35):
    if t<a-.4 or t>b+.5:return
    f=u(t,a-.4,.4)*(1-u(t,b,.5));p=Vector(point)+Vector((.1*(1-f),-.01,.12*(1-f)))
    d.set_hand(who,p,yaw,-25,vis=True)
def pose_at(t):
    c=cue_at(t);i=CUES.index(c);p=list(c['pose'])
    if i and c['move']:
        old=CUES[i-1]['pose'];v=u(t,c['start'],c['move']);p=[x+(y-x)*v for x,y in zip(old,p)]
    return p
def pose_b1(p):
    d.pose_cam(p)
    if p[5]<0:
        az,el=math.radians(p[4]),math.radians(p[5]);tgt=Vector(p[:3]);pos=tgt+p[3]*Vector((math.sin(az)*math.cos(el),-math.cos(az)*math.cos(el),math.sin(el)))
        d.CAM.location=pos;d.CAM.rotation_euler=(tgt-pos).to_track_quat('-Z','Y').to_euler();d.CAM_D.dof.focus_distance=(tgt-pos).length
    # Keep both ends of the explanatory model readable; the distant room stays soft.
    d.CAM_D.dof.aperture_fstop=6.0
def set_camera(t):
    p=pose_at(t);pose_b1(p)
    return p
def reset():
    hide_all()
    d.board_h.location=BOARD_BASE
    for o,(p,r,s) in BASE.items():o.location=p;o.rotation_euler=r;o.scale=s
    for who in ['kai','mio','wal','cour','phel']:d.set_hand(who,(0,0,0),vis=False)
    PARTS['terrella']['rough'].value=0;PARTS['powder']['aligned'].value=0
    for o in star_dots:d.show(o,False)
    d.show(attract,False);d.show_tree(d.board_h,False)
    d.put(PARTS['globe']['globe'],PARTS['globe']['surfaceMaterial'])
    d.put(PARTS['globe']['halves'][0],d.mat('b1neutral','#777573',.6));d.put(PARTS['globe']['halves'][1],d.mat('b1neutral','#777573',.6))
    for letter in PARTS['globe']['letters']:letter.data.body=''
    for name,m in d.MATS.items():
        if name in ['b1N','b1S','b1_compassneedle1'] or name.startswith('b1_surfaceneedle'):d.set_emit(m,0)
def compass_state(t,c,opening=False):
    p=PARTS['compass'];visible('compass');p['hinge'].rotation_euler.x=-math.radians(110)*u(t,0,.9) if opening else -math.radians(110)
    tt=t if opening else t-c['start'] if c['row']==39 else 4
    a=(40 if opening else 8)*math.exp(-2*max(0,tt))*math.cos(9*tt);p['needle'].rotation_euler.z=math.radians(8+a)
    if opening:touch('kai',(0,-.16,.06),t,0,1,yaw=60)
def terrella_state(t,c):
    visible('terrella');p=PARTS['terrella'];p['rough'].value=1-u(t,126.40,.8) if c['row']==17 else 0
    for i,o in enumerate(p['chips']):
        d.show(o,c['row']==17 and t>=126.40+i*.025);o.location.z+=.025*math.sin(math.pi*u(t,126.40+i*.025,.6))
    for i,(a,s,r,B) in enumerate(p['needles']):
        show=c['row']>=19 or c['row']==18 and i<6 and t>=135.35+i*.4
        d.show_tree(a,show);d.show(s,show)
        if c['row']==18 and i<6:a.location.z+=.025*(1-u(t,135.35+i*.4,.25))
        tangent=Vector((0,0,1))-r.z*r;tangent.normalize()
        target=B if c['row']>=21 else tangent if c['row']>=19 else Vector((math.sin(i*1.3),math.cos(i*1.3),0))
        v=u(t,140.47+i*.03,.5) if c['row']==19 else 1
        initial=Vector((math.sin(i*1.3),math.cos(i*1.3),0));vec=initial.lerp(target,v).normalized()
        if c['row']==21:vec=tangent.lerp(B,u(t,157.18+i*.15,.45)).normalized()
        a.rotation_mode='QUATERNION';a.rotation_quaternion=vec.to_track_quat('Y','Z')
    for o in p['meridians']:d.show(o,c['row']>=19)
    if c['row']==18:
        # One continuous hand, not six overlapping approaches that overwrite
        # the hand actually touching the current needle.
        if 134.95<=t<=138.0:
            i=max(0,min(5,int((t-135.35)/.4)))
            at=135.35+i*.4;tip=p['needles'][i][0].location.copy()
            if t<135.35:tip+=Vector((.08,0,.08))*(1-u(t,134.95,.4))
            elif t>=137.60:tip+=Vector((.06,0,.08))*u(t,137.60,.4)
            elif t>at+.25 and i<5:
                nxt=p['needles'][i+1][0].location.copy()+Vector((0,0,.025))
                tip=tip.lerp(nxt,u(t,at+.25,.15))
            d.set_hand('kai',tip,yaw=150,pitch=-25,vis=True)
def powder_state(t,c,answer=False):
    visible('powder');p=PARTS['powder'];p['aligned'].value=1 if answer else 1-(1-d.lin(t,163.73,164.73))**3
    for a,i,j in p['arrows']:
        line=DATA['fieldLines'][i];f=(1-(t*.25+j/3)%1)*(len(line)-2);ii=int(f);x,z=line[ii+1];nx,nz=line[ii];zz=PARTS['terrella']['center'].z+z
        d.show_tree(a,(answer or t>166.91) and abs(x)<.215 and .021<zz<.359);a.location=(x,.10+.015,zz);vec=Vector((nx-x,0,nz-z));a.rotation_mode='QUATERNION';a.rotation_quaternion=vec.to_track_quat('Y','Z')
    d.show(p['bottle'],not answer and 160.81<=t<=163.4)
    if not answer and 160.94<=t<=162.6:p['bottle'].rotation_euler.y=.16*math.sin((t-160.94)*22)
    if not answer:touch('kai',(.15,.08,.23),t,160.94,162.6)
def globe_state(t,c):
    visible('globe');p=PARTS['globe'];cut=c['group'] in ['predict','mystery'];d.show(p['disc'],cut);d.show(p['globe'],not cut)
    if c['group']=='inside':d.put(p['globe'],p['transparentMaterial'])
    d.principled(p['transparentMaterial']).inputs['Alpha'].default_value=1-.6*u(t,271.58,.8)
    inner=c['group']=='inside' and t>=271.58;d.show_tree(p['inner'],inner)
    # Northern end is S blue; southern end is N red, revealed only at the supplied spoken words.
    if t>=293.74:d.put(p['halves'][1],d.mat('b1innerS','#3a6fd8',.4,emit='#3a6fd8',strength=.7));p['letters'][1].data.body='S'
    if t>=296.49:d.put(p['halves'][0],d.mat('b1innerN','#d6453d',.4,emit='#d6453d',strength=.7));p['letters'][0].data.body='N'
    for i,line in enumerate(p['lines']):
        # Supplied test:island voice ends234.339s; repeat the known prediction
        # inside its existing1.3s pause, leaving time to finish the dotted curve.
        at=[219.55,227.95,234.40][i]
        for j,o in enumerate(line):d.show(o,c['group']=='predict' and t>=at+j*.025)
    d.show_tree(p['needle'],c['group']=='predict')
    d.show(p['horizon'],c['group']=='predict')
    lat=math.radians(51.5);rr=Vector((math.cos(lat),0,math.sin(lat)));north=Vector((0,0,1))-rr.z*rr;north.normalize();vec=north*math.cos(math.radians(DATA['dipLondon']))-rr*math.sin(math.radians(DATA['dipLondon']));p['needle'].rotation_mode='QUATERNION';p['needle'].rotation_quaternion=vec.to_track_quat('Y','Z')
def hands(t,c):
    # Deliberate pointing gestures at the explanatory object, not camera drift.
    a=c['start']+min(3.5,(c['end']-c['start'])*.45)
    if c['end']-c['start']>8 and c['group'] not in ['powder','garlic','pair','terrella','dip']:
        target={'map':(-.32,.19,.03),'globe':(.35,.10,.26),'predict':(.40,.11,.25),'inside':(.32,.1,.20),'book':(-.20,.30,.04)}.get(c['group'])
        if target:touch('kai',target,t,a,a+.8)
def apply_state(t):
    reset();c=cue_at(t);g=c['group'];r=c['row']
    if g in ['compass','score','star','vane']:
        compass_state(t,c,opening=c['key']=='open:box')
        if r<=3 or r==39:visible('ship')
        if g=='star':
            visible('star')
            for i,o in enumerate(star_dots):d.show(o,t>=20.10+i*.025)
        if g=='vane':
            visible('vane','magnets','wind');PARTS['vane']['root'].rotation_euler.z=math.radians(70)*u(t,107.97,.7);PARTS['compass']['needle'].rotation_euler.z=-math.radians(60)*u(t,111.35,.7);PARTS['wind']['root'].location.x-=.08*u(t,107.97,.6)
            if t>108.8:d.show_tree(PARTS['wind']['root'],False)
            d.show_tree(PARTS['magnets']['b'],False);PARTS['magnets']['a'].location=Vector((.12,-.08,.043))+Vector((.10,0,0))*(1-u(t,111.35,.6))
        if g=='score':
            d.show_tree(d.board_h,True);d.dg['make'].data.body='0';d.dg['brk'].data.body='0'
    elif g=='map':visible('map');PARTS['map']['rock'].location.z+=.01*u(t,33.12,.4)
    elif g=='sailor':
        visible('sailor','garlic');garlic=PARTS['garlic'];p=garlic['root'];p.location=BASE[p][0].lerp(Vector((.035,-.047,.085)),u(t,43.5,2))
        p.scale=BASE[p][2]*.55
        for ob in garlic['nails']+garlic['streaks']:d.show_tree(ob,False)
        if 46.56<=t<=46.86:p.location.x+=.0015*math.sin((t-46.56)*70)
    elif g=='gilbert':visible('gilbert');PARTS['gilbert'].location.z=.02*math.sin(math.pi*u(t,52.18,.4))
    elif g in ['garlic','pair']:
        visible('magnets')
        if g=='garlic':
            visible('garlic');p=PARTS['garlic'];v=u(t,68.49,1.8)
            if 68.49<=t<70.35:p['root'].location=(-.035+.025*math.sin(v*math.pi*6),-.02,.036)
            elif 70.35<=t<71.15:p['root'].location=Vector((-.035+.025*math.sin(u(70.35,68.49,1.8)*math.pi*6),-.02,.036)).lerp(BASE[p['root']][0],u(t,70.35,.8))
            touch('kai',p['root'].location+Vector((0,0,.012)),t,68.49,70.35)
            for i,o in enumerate(p['streaks']):d.show(o,t>=68.49+i*.6)
            for i,o in enumerate(p['nails']):
                v=u(t,74.61+i*.07,.4);o.location.y=.10-.04*v
            d.show_tree(PARTS['magnets']['b'],False)
        else:
            a=PARTS['magnets']['a'];b=PARTS['magnets']['b'];b.location.x=-.035;b.location.y=.16-.06*u(t,94.15,.4)
            if t>=95.7:b.location.y=.10+.06*u(t,95.7,.35)
            if t>=96.10:b.rotation_euler.z=math.pi*u(t,96.10,.25)
            if t>=96.58:b.location.y=.16-.04*u(t,96.58,.15)
            if t>=97.08:a.rotation_euler.z=math.pi*d.back(d.lin(t,97.08,97.43))
            if t>=97.75:b.location.y=.12-.02*u(t,97.75,.4)
            touch('mio',b.location+Vector((0,0,.015)),t,95.7,98.15)
    elif g in ['terrella','dip','powder','london','challenge']:
        terrella_state(t,c)
        if g=='powder':powder_state(t,c)
        if g=='london':
            visible('protractor');d.show(PARTS['protractor']['mark72'],False)
            p=PARTS['terrella'];a,s,rr,B=p['needles'][4];touch('kai',a.location,t,208.58,209.3)
            north=Vector((0,0,1))-rr.z*rr;north.normalize();a.rotation_quaternion=north.lerp(B,u(t,210.23,.6)).normalized().to_track_quat('Y','Z')
            if c['key']=='test:if':d.show_tree(a,False)
            else:a.location.z+=.025*(1-u(t,208.58,.3))
            place_angle_frame(a.location,51.5)
            for i,(aa,ss,_,__) in enumerate(p['needles']):d.show_tree(aa,i==4 and c['key']!='test:if');d.show(ss,i==4)
        if g=='challenge':challenge_setup()
    elif g in ['globe','predict','inside','mystery']:globe_state(t,c)
    elif g=='meter':
        visible('meter','norman');p=PARTS['meter']
        ang=0 if t<244.87 else 20*math.exp(-2*(t-244.87))*math.sin((t-244.87)*10) if t<248.63 else DATA['measurement']*u(t,248.63,.65)
        p['needle'].rotation_mode='QUATERNION';p['needle'].rotation_quaternion=Vector((math.cos(math.radians(ang)),0,-math.sin(math.radians(ang)))).to_track_quat('Y','Z');d.show(p['mark72'],t>=249.28)
    elif g=='book':
        visible('book');d.bellaso_open(PARTS['book'],u(t,315.63,.8));d.show_tree(d.board_h,True);d.dg['make'].data.body='0';d.dg['brk'].data.body='3'
    if c['row']==32:compass_state(t,c);d.show(attract,t>=293.74)
    if c['row']==37:
        visible('mysterybox');d.show(PARTS['mysterybox']['lightning'],329.80<=t<330.5)
    if r==3:d.board_h.rotation_euler.x=-math.pi/2*(1-d.back(d.lin(t,12.72,13.32)))
    if r==12:
        for name,at in [('b1N',88.39),('b1S',88.96)]:d.set_emit(d.MATS[name],1.5*math.sin(math.pi*d.lin(t,at,at+.4)))
    if r==14:d.set_emit(d.MATS['b1_compassneedle1'],1.2*math.sin(math.pi*d.lin(t,101.83,102.43)))
    if r==21:
        for i,at in [(2,153.97),(3,157.18),(4,157.33),(5,157.48)]:
            a=PARTS['terrella']['needles'][i][0]
            for ob in a.children:
                if ob.type=='MESH' and ob.active_material:d.set_emit(ob.active_material,1.3*math.sin(math.pi*d.lin(t,at,at+.55)))
    if r==23:
        for name,at in [('b1S',181.87),('b1N',185.82)]:d.set_emit(d.MATS[name],1.3*math.sin(math.pi*d.lin(t,at,at+.65)))
    hands(t,c);set_camera(t);return anchors(t)
def install_visibility():
    """Episode-private last-write buffering; do not touch the shared renderer."""
    global VIS_QUEUE, CHILDREN, CHECK_VISIBILITY, VISIBILITY_STATS
    VIS_QUEUE=None;CHILDREN={};CHECK_VISIBILITY=False;VISIBILITY_STATS={'statesChecked':0,'objectsChecked':0}
    for ob in list(d.SC.objects):
        if ob.parent:CHILDREN.setdefault(ob.parent,[]).append(ob)
    d.show=show_fast;d.show_tree=show_tree_fast
def show_fast(ob,visible):
    hidden=not visible
    if VIS_QUEUE is not None:VIS_QUEUE[ob]=hidden;return
    if ob.hide_render!=hidden:ob.hide_render=hidden
    if ob.hide_viewport!=hidden:ob.hide_viewport=hidden
def show_tree_fast(ob,visible):
    show_fast(ob,visible)
    for child in CHILDREN.get(ob,[]):show_tree_fast(child,visible)
def apply(t):
    global VIS_QUEUE
    pending={};VIS_QUEUE=pending
    try:result=apply_state(t)
    finally:
        VIS_QUEUE=None
        for ob,hidden in pending.items():show_fast(ob,not hidden)
        if CHECK_VISIBILITY:
            assert all(ob.hide_render==hidden and ob.hide_viewport==hidden for ob,hidden in pending.items())
            VISIBILITY_STATS['statesChecked']+=1;VISIBILITY_STATS['objectsChecked']+=len(pending)
    return result
def anchors(t):
    return {'compass':Vector((0,-.18,.045)),'north':Vector((0,-.13,.045)),'northEnd':Vector((0,.01,.045)),'star':PARTS['star'],'island':Vector((-.32,.195,.03)),
        'magN':Vector((-.035,.01,.028)),'magS':Vector((-.035,-.05,.028)),'terrella':PARTS['terrella']['center'],'poleS':PARTS['terrella']['center']+Vector((0,0,.095)),'poleN':PARTS['terrella']['center']+Vector((0,0,-.093)),
        'globe':PARTS['globe']['center'],'globeS':PARTS['globe']['center']+Vector((0,-.03,.08)),'globeN':PARTS['globe']['center']+Vector((0,-.03,-.08)),
        'meter':PARTS['meter']['center'],'pin':PARTS['globe']['pin'],'challengeNeedle':PARTS['terrella']['center']+Vector((.102*math.cos(math.pi/6),0,-.102*.5))}
def place_angle_frame(pivot,latitude):
    root=PARTS['protractor']['root'];root.location=Vector(pivot)+Vector((0,-.006,0));root.rotation_euler=(0,-math.radians(90+latitude),0);root.scale=(.4,.4,.4)
def challenge_setup():
    reset();visible('terrella','protractor');d.show(PARTS['protractor']['mark72'],False);p=PARTS['terrella'];lat=math.radians(-30);rr=Vector((math.cos(lat),0,math.sin(lat)))
    for chip in p['chips']:d.show(chip,False)
    for i,(a,s,r,B) in enumerate(p['needles']):d.show_tree(a,i==0);d.show(s,i==0)
    a,s,_,_=p['needles'][0];a.location=p['center']+.099*rr;s.location=p['center']+.095*rr
    tangent=Vector((-math.sin(lat),0,math.cos(lat)));a.rotation_mode='QUATERNION';a.rotation_quaternion=tangent.to_track_quat('Y','Z');pose_b1(DATA['poses']['challenge'])
    place_angle_frame(a.location,-30)
def answer_state():
    challenge_setup();p=PARTS['terrella'];a,s,_,_=p['needles'][0];rr=(a.location-p['center']).normalized();B=3*(-rr.z)*rr+Vector((0,0,1));a.rotation_quaternion=B.to_track_quat('Y','Z');powder_state(185,cue_at(185),answer=True)
def catalog(names=None,out_dir=None):
    bpy.context.window.scene=d.SC
    out=out_dir or A.cache+'/blender/catalog';os.makedirs(out,exist_ok=True)
    specs=[('compass',['compass'],(0,-.18,.04),.14),('magnets',['magnets'],(0,-.02,.02),.19),('garlic',['garlic'],(0,-.02,.02),.29),('star',['star'],(-.20,.08,.20),.10),('map',['map'],(-.32,.12,.01),.30),('gilbert',['gilbert'],(-.48,-.10,.06),.08),('norman',['norman'],(-.405,-.04,.06),.08),('sailor',['sailor'],(.035,-.02,.06),.08),('vane',['vane'],(.20,-.18,.1),.1),('terrella',['terrella'],(0,.1,.1),.18),('powder',['terrella','powder'],(0,.1,.15),.32),('meter',['meter'],(-.3,-.04,.08),.14),('globe',['globe'],(.32,.12,.16),.24),('predictions',['globe'],(.32,.12,.17),.30),('book',['book'],(-.20,.30,.03),.28),('mysterybox',['mysterybox'],(.32,.108,.17),.05),('ship',['ship'],(.13,.30,.06),.22)]
    for nm,gs,c,span in specs:
        if names is not None and nm not in names:continue
        for top in [False,True]:
            f=out+'/'+nm+('_top.jpg' if top else '_oblique.jpg')
            if os.path.exists(f) and not A.force:continue
            reset();visible(*gs);PARTS['compass']['hinge'].rotation_euler.x=-math.radians(110);PARTS['powder']['aligned'].value=1
            if nm in ['terrella','powder']:terrella_state(185.9,cue_at(185.9))
            if nm=='powder':powder_state(185.9,cue_at(185.9),answer=True)
            if nm=='meter':
                a=PARTS['meter']['needle'];a.rotation_mode='QUATERNION';a.rotation_quaternion=Vector((1,0,0)).to_track_quat('Y','Z');d.show(PARTS['meter']['mark72'],False)
            if nm=='globe':
                d.show(PARTS['globe']['disc'],False);d.show_tree(PARTS['globe']['inner'],False);d.show_tree(PARTS['globe']['needle'],False)
                for ll in PARTS['globe']['lines']:
                    for ob in ll:d.show(ob,False)
            if nm=='predictions':globe_state(259,cue_at(259))
            if nm=='book':d.bellaso_open(PARTS['book'],1)
            d.catalog_camera(c,top,span);d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
def write_problem():
    bpy.context.window.scene=d.SC
    out=A.cache+'/problem';os.makedirs(out,exist_ok=True);old=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='PNG'
    for nm,fn in [('挑戦',challenge_setup),('答え',answer_state)]:fn();d.SC.render.filepath=out+'/'+nm+'.png';bpy.ops.render.render(write_still=True,scene=d.SC.name)
    d.SC.render.image_settings.file_format=old
# Render only real changes, clone exact holds. Overlay and audio remain 30fps.
SPANS=[(c['start'],c['start']+c['move']) for c in CUES if c['move']]+[(0,3),(20.1,20.8),(33.1,33.8),(43.5,46.6),(52.1,52.8),(68.4,70.9),(74.5,75.4),(94.1,95),(96.0,98),(107.9,108.8),(111.3,112.2),(126.4,127.8),(135.0,138),(140.4,141.5),(157.1,159.8),(160.8,188.3),(208.2,210),(219.5,220.5),(227.9,228.8),(234.4,235.5),(244.8,250),(271.5,272.4),(293.7,294.1),(296.4,296.9),(315.6,316.6),(348.8,351.8)]
for c in CUES:
    if c['end']-c['start']>8:SPANS.append((c['start']+3.1,c['start']+4.9))
SPANS += [(12.72,13.32),(46.56,46.9),(70.35,71.15),(88.39,89.36),(95.7,98.3),(101.83,102.43),(153.97,154.52),(208.2,210.9)]
install_visibility()
calibrate_cameras()
EVENTS=sorted(set([c['start'] for c in CUES]+[w['time'] for c in CUES for w in c['wordEvents']]+[b for a,b in SPANS]))
def plan(j):
    t=j/FPS
    if any(a-.034<=t<=b+.034 for a,b in SPANS):return ('render',None)
    last=max([cue_at(t)['start']]+[e for e in EVENTS if e<=t]);k=min(j,math.ceil(last*FPS+1e-7));return ('render',None) if k==j else ('dup',k)
def main():
    import shutil
    from desk_render_axes import explicit_scene_bpy
    bpy.context.window.scene=d.SC
    seed=A.cache+'/blender/seed-b1';os.makedirs(seed+'/blender/desk',exist_ok=True);json.dump({'anchors':{}},open(seed+'/blender/desk/anchors.json','w'));json.dump({'moving_spans':[]},open(seed+'/blender/camera-motion.json','w'))
    names=sorted(anchors(0));options={'every':A.every,'scale':A.scale,'times':[float(x) for x in A.times.split(',')] if A.times else None,'out':A.out,'from':A.start,'to':A.stop,'force':A.force}
    pp=[plan(j) for j in range(math.ceil(DATA['duration']*FPS))];projection_count=len({j if p[0]=='render' else p[1] for j,p in enumerate(pp)});calls=[0]
    def projected_apply(t):
        if not options['times'] and calls[0]<projection_count:calls[0]+=1;set_camera(t);bpy.context.view_layer.update();return anchors(t)
        return apply(t)
    scope={**d.__dict__,'__file__':__file__,'A':options,'CACHE':seed,'CACHE6':A.cache,'NF6':math.ceil(DATA['duration']*FPS),'FPS':FPS,'CLIP6':{'duration':DATA['duration']},'CUE6':{c['key']:{'s':c['start'],'e':c['end']} for c in CUES},'DATA':DATA,'PT6':{'source':hashlib.sha256(open(__file__,'rb').read()+open(ext.__file__,'rb').read()).hexdigest()},'plan6':(lambda j:('render',None)) if options['times'] else plan,'apply6':projected_apply,'anchors':lambda t:{},'anchors5':lambda t:{},'V6_ANC':names,'S6':lambda k:1e6,'T6':lambda *a,**kw:0}
    if options['times']:
        out=A.out or A.cache+'/blender/preview';os.makedirs(out,exist_ok=True);arrays={nm:[[0,0,0] for _ in range(scope['NF6'])] for nm in names}
        for t in options['times']:
            aa=apply(t);bpy.context.view_layer.update();j=round(t*FPS)
            for nm in names:arrays[nm][j]=d.project(aa[nm])
        json.dump({'anchors':arrays,'fps':FPS},open(out+'/anchors.json','w'))
    scope['bpy']=explicit_scene_bpy(d.SC)
    render_times=([t for t in options['times'] if A.force or not os.path.exists(out+'/%05d.jpg'%round(t*FPS))] if options['times'] else None)
    if render_times is None or render_times:
        if render_times is not None:scope['A']={**options,'times':render_times}
        try:types.FunctionType(d.main.__code__,scope)()
        except SystemExit as e:
            if e.code not in [0,None]:raise
    if options['times']:
        assert all(os.path.isfile(out+'/%05d.jpg'%round(t*FPS)) for t in options['times']),'Actual B1 output missing despite a render log'
    poses=[pose_at(j/FPS) for j in range(scope['NF6'])];mv=[False]+[poses[i]!=poses[i-1] for i in range(1,len(poses))]
    json.dump({'frames':scope['NF6'],'moving_frames':sum(mv),'moving_ratio':sum(mv)/len(mv),'top_ratio':sum(p[5]>65 for p in poses)/len(poses)},open(A.cache+'/blender/camera-motion.json','w'),indent=1)
if __name__=='__main__':
    if A.gates:catalog();A.times=','.join(map(str,DATA['preview']));main();write_problem()
    elif A.catalog:catalog()
    else:main()
