"""C-1。新しいファイルだけで、見本の机・光・素材・手・撮影処理を再利用。"""
import os,sys,json,math,time,hashlib,argparse,shutil
SCRIPT_STARTED=time.time();print('[c1] START source snapshot',flush=True)
SOURCE_SHA={p:hashlib.sha256(open(p,'rb').read()).hexdigest() for p in [os.path.abspath(__file__),os.path.join(os.path.dirname(os.path.abspath(__file__)),'desk_lib_c1.py')]}
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
saved_argv=sys.argv[:];sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
if bpy.app.background:
    import desk_lib as d
else:
    # 1-2のGUI用アダプタと同じ。共通ファイルは編集しない。
    import types,importlib
    libpath=os.path.join(os.path.dirname(os.path.abspath(__file__)),'desk_lib.py')
    libsource=open(libpath).read();assert libsource.count('bpy.ops.wm.read_factory_settings(use_empty=True)')==1
    libsource=libsource.replace('bpy.ops.wm.read_factory_settings(use_empty=True)','pass # GUI scene already empty')
    libsource=libsource.replace('bpy.context.active_object','bpy.context.view_layer.objects.active')
    # ID名を変えるとコレクションの順が変わるため、必ず固定のsnapshotを回す。
    old_objects=list(bpy.data.objects);renamed=0
    for o in old_objects:
        if not o.name.startswith('previous_'):o.name='previous_c1_'+o.name;renamed+=1
    print('[c1] GUI previous names: %d renamed / %d objects'%(renamed,len(old_objects)),flush=True)
    bpy.context.window.scene=bpy.data.scenes.new('技術の疑問の鎖 C-1')
    d=types.ModuleType('desk_lib');d.__file__=libpath;sys.modules['desk_lib']=d
    exec(compile(libsource,libpath,'exec'),d.__dict__)
    print('[c1] shared room initialized',flush=True)
sys.argv=saved_argv
from mathutils import Vector
import desk_lib_c1 as ext
if not bpy.app.background:ext=importlib.reload(ext)

def args():
    p=argparse.ArgumentParser();p.add_argument('--cache',default='/private/tmp/ys/ys-chain-c1v1');p.add_argument('--catalog',action='store_true');p.add_argument('--gates',action='store_true');p.add_argument('--problem',action='store_true');p.add_argument('--times');p.add_argument('--from',dest='start',type=float,default=0);p.add_argument('--to',dest='stop',type=float,default=1e9);p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16);p.add_argument('--every',type=int,default=1);p.add_argument('--out');p.add_argument('--force',action='store_true');p.add_argument('--no-anchors',action='store_true');p.add_argument('--anchors-only',action='store_true');return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();DATA=json.load(open(os.path.join(A.cache,'blender','data.json')));CUES=DATA['cues'];CUE={c['key']:c for c in CUES};DUR=DATA['duration'];FPS=30;NF=math.ceil(DUR*FPS);FX=DATA['effects'];EVENTS=DATA['events']
SOURCE_SHA[os.path.join(A.cache,'blender','data.json')]=hashlib.sha256(open(os.path.join(A.cache,'blender','data.json'),'rb').read()).hexdigest()
def private_catalog_stage():
    # 共通と同じ選択規則を、この新しいsceneにだけ適用。過去の部屋は触らない。
    exact={'floor','wall','base','window','picture','desk','pot','leaf0','leaf1','leaf2','leaf3'};prefixes=('winF','picF','leg','stack')
    for o in list(d.SC.objects):
        # 他の新規回がGUIに新sceneを作る際に付けた名前接頭辞を除いて識別。
        # 対象はあくまでこのC1 sceneのobject参照だけ。過去sceneは変更しない。
        name=o.name.split('_',2)[2] if o.name.startswith('previous_') else o.name
        target=not (o.type in ('LIGHT','CAMERA') or name in exact or name.startswith(prefixes))
        if o.hide_render!=target:o.hide_render=target
        if o.hide_viewport!=target:o.hide_viewport=target
    for ld,p in d.LIGHTS:ld.energy=p
    d.BGN.inputs[1].default_value=.35
d.catalog_stage=private_catalog_stage
print('[c1] build parts START %.1fs'%(time.time()-SCRIPT_STARTED),flush=True)
PARTS,GROUPS=ext.build(DATA,A.cache);MANAGED=list({o for g in GROUPS.values() for o in g})
# Object.children は全data.objectsを走査する。現在sceneの親子を一度だけ読み、
# 共通show_treeと同じ子孫へ、同じshowを同じ親→子の順で適用する。
SCENE_OBJECTS=list(d.SC.objects);CHILDREN={};TREE_CACHE={};TREE_CALLS=0
SHOW_QUEUE=None;VISIBILITY_STATS={'calls':0,'writes':0,'skipped':0,'flushes':0,'objectsVerified':0}
def immediate_show(o,v):
    target=not v
    for prop in ['hide_render','hide_viewport']:
        if getattr(o,prop)!=target:setattr(o,prop,target);VISIBILITY_STATS['writes']+=1
        else:VISIBILITY_STATS['skipped']+=1
def queued_show(o,v):
    VISIBILITY_STATS['calls']+=1
    if SHOW_QUEUE is None:immediate_show(o,v)
    else:SHOW_QUEUE[o]=bool(v)
d.show=queued_show
for o in SCENE_OBJECTS:
    if o.parent is not None:CHILDREN.setdefault(o.parent,[]).append(o)
def tree_nodes(o):
    if o not in TREE_CACHE:
        out=[];seen=set();stack=[o]
        while stack:
            a=stack.pop();assert a not in seen,'Parent cycle';seen.add(a);out.append(a);stack.extend(reversed(CHILDREN.get(a,[])))
        TREE_CACHE[o]=out
    return TREE_CACHE[o]
def cached_show_tree(o,v):
    global TREE_CALLS
    TREE_CALLS+=1
    for a in tree_nodes(o):
        d.show(a,v)
        if SHOW_QUEUE is None:assert a.hide_render is (not v) and a.hide_viewport is (not v)
        else:assert SHOW_QUEUE[a] is bool(v)
TREE_ROOTS=list(d.HANDS.values())+[PARTS['m1']['tag']]+[a['root'] for k in ['m2','eight'] for a in PARTS[k]['arms']]+[a for a,p in PARTS['papers']['papers']]
for o in TREE_ROOTS:
    # 元APIから一度だけ得た子孫と完全一致。以後のどのcueでも同値。
    assert set(tree_nodes(o))=={o,*o.children_recursive},'show_tree descendants differ: '+o.name
d.show_tree=cached_show_tree
print('[c1] parts initialized %.1fs; cached trees equivalent: %d roots / %d scene objects'%(time.time()-SCRIPT_STARTED,len(TREE_ROOTS),len(SCENE_OBJECTS)),flush=True)
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale);d.SC.eevee.taa_render_samples=A.samples
S=lambda k:CUE[k]['start'];E=lambda k:CUE[k]['end'];VE=lambda k:CUE[k]['voiceEnd']
def T(k,word):
    ws=CUE[k]['words'];found=next((w['time'] for w in ws if word in w['word']),None)
    if found is None:raise ValueError((k,word))
    return found
def cue_at(t):
    c=CUES[0]
    for x in CUES:
        if x['start']<=t:c=x
    return c
def hide_all():
    for o in MANAGED:d.show(o,False)
    for name in d.HANDS:d.set_hand(name,(0,0,0),vis=False)
def visible(*names):
    for name in names:
        for o in GROUPS[name]:d.show(o,True)
def digits(t):
    v=0
    for e in EVENTS:
        if t>=e['time']:v=e['value']
    return [int(c) for c in str(v).zfill(5)]
def wheel_steps(t):
    prev=[0]*5;steps=[0.]*5
    for e in EVENTS:
        new=[int(c) for c in str(e['value']).zfill(5)]
        if t<e['time']:break
        u=d.seg(t,e['time'],e['time']+e['duration']) if e['duration'] else 1
        for i in range(5):
            delta=(new[i]-prev[i])%10
            if e['tag']=='reset':steps[i]=d.lerp(prev[i],new[i],u)
            else:steps[i]+=delta*u
        prev=new
        if u<1:break
    return steps
def cam_keys():
    keys=[]
    for c in CUES:
        if not keys:keys.append({'t':0.,'pose':tuple(c['pose']),'cut':False})
        elif tuple(c['pose'])!=keys[-1]['pose']:
            # 群衆がまだ机の下にいる間は、書き続ける帳簿を見せる。
            # 出現の語・0.8秒の浮上・cue/face自体は変えない。
            move=.8 if c['key']=='arm:domino' else c['move']
            start=T('desk:revolt','大きな反乱')-move if c['key']=='desk:revolt' else c['start']
            keys.append({'t':start,'pose':keys[-1]['pose'],'cut':False});keys.append({'t':start+move,'pose':tuple(c['pose']),'cut':False})
        keys.append({'t':c['end'],'pose':tuple(c['pose']),'cut':False})
    keys.append({'t':DUR+.5,'pose':tuple(CUES[-1]['pose']),'cut':False});return keys
KEYS=cam_keys()
def raw_pose(t):
    for a,b in zip(KEYS,KEYS[1:]):
        if a['t']<=t<b['t']:
            if a['pose']==b['pose']:return a['pose'],False
            return d.pose_mix(a['pose'],b['pose'],(t-a['t'])/max(1e-9,b['t']-a['t'])),True
    return KEYS[-1]['pose'],False
def set_camera(t):
    p,_=raw_pose(t);d.pose_cam(p)
    c=cue_at(t)
    if c['group']=='pascal':
        # 胴への従来の焦点では頭と着想の歯車がぼける。構図を変えず人物全体へ。
        target=PARTS['pascal']['root'].location+Vector((0,0,.120))
        d.CAM_D.dof.focus_distance=(d.CAM.location-target).length
        d.CAM_D.dof.aperture_fstop=11.0
    elif c['camera']=='desk' or c['key']=='desk:revolt' and t<T('desk:revolt','大きな反乱'):
        top=5 if c['row']==43 else min(23,6+int(t/1.5))-1
        target=PARTS['papers']['papers'][top][1]+Vector((0,0,.0007))
        u=d.seg(t,T('desk:revolt','大きな反乱')-c['move'],T('desk:revolt','大きな反乱')) if c['key']=='desk:revolt' else 0
        target=target.lerp(Vector((.10,.425,.065)),u)
        d.CAM_D.dof.focus_distance=(d.CAM.location-target).length
        d.CAM_D.dof.aperture_fstop=d.lerp(2.8,8.0,u)
    elif c['camera'] in ['crowd','meter','shishi','score']:
        target,fstop={'crowd':((.10,.425,.065),8.0),'meter':((.40,-.111,.026),5.6),'shishi':((-.42,-.02,.075),5.6),'score':((.58,.299,.07),8.0)}[c['camera']]
        d.CAM_D.dof.focus_distance=(d.CAM.location-Vector(target)).length
        d.CAM_D.dof.aperture_fstop=fstop
def camera_motion():
    moving=sum(raw_pose(j/FPS)[1] for j in range(NF));return {'frames':NF,'moving_frames':moving,'moving_ratio':moving/NF,'moving_spans':[(a['t'],b['t']) for a,b in zip(KEYS,KEYS[1:]) if a['pose']!=b['pose']]}
def calculator_state(t,vis):
    p=PARTS['m1'];p['root'].location=p['center'];p['root'].rotation_euler=(0,0,0)
    u=d.lin(t,FX['box'],FX['box']+.8)
    if t<FX['box']+.8:p['root'].location.z=.22*(1-d.back(u))
    p['hinge'].rotation_euler.x=-math.radians(110)*d.seg(t,FX['box']+.3,FX['box']+1.1)
    ds=digits(t);st=wheel_steps(t)
    for i,(o,tx) in enumerate(zip(p['dials'],p['windows'])):o.rotation_euler.z=2*math.pi*st[i]/10;tx.data.body=str(ds[i])
    for i,gi in enumerate(p['insides']):
        d.show(gi['bump'],False);gi['root'].rotation_euler.y=(-1 if i%2 else 1)*(2*math.pi*st[i]/10+max(0,t-S('dad:shown'))*1.2*(S('dad:shown')<=t<S('next:mio')))
    d.show_tree(p['tag'],vis and t>=S('dad:price'));d.show(p['string'],vis and t>=S('dad:price'))
    p['tag'].rotation_euler.z=.25*math.sin((t-FX['price'])*9)*math.exp(-max(0,t-FX['price'])/3) if t>=FX['price'] else 0
def mechanism_state(t,kind='m2',problem=None):
    p=PARTS[kind];ds=digits(t) if problem is None else problem;st=wheel_steps(t) if problem is None else ds
    p['root'].location=p['center'];p['root'].scale=(1,1,1)
    if kind=='m2':
        starts=[S('carry:simple'),S('hard:9999'),S('arm:lift'),S('arm:wait'),S('ch:intro')]
        start=max([a for a in starts if a<=t] or [starts[0]])
        u=d.seg(t,start,start+1);sc=d.lerp(1/1.7,1,u);p['root'].scale=(sc,sc,sc);p['root'].location.z=-.10*(1-u)
    for i,g in enumerate(p['wheels']):
        val=st[i] if kind=='m2' else (9 if i>0 else 0);g['root'].rotation_euler.y=-2*math.pi*val/10
        peg_visible=i>0 and problem is None and (S('carry:simple')<=t<S('carry:ten') or S('hard:9999')<=t<S('arm:lift'))
        d.show(g['bump'],peg_visible);d.show(g['carrier'],peg_visible)
        d.set_emit(g['bump'].data.materials[0],1.5 if t>=T('carry:bump','出っぱり') and t<S('carry:ten') else 0,'#ffd23f')
    arms_visible=problem is not None or S('arm:lift')<=t<S('dad:proto') or S('ch:intro')<=t<S('last:desk')
    for a in p['arms']:
        d.show_tree(a['root'],arms_visible)
        if kind=='eight':d.show_tree(a['root'],False);continue
        i=a['index'];angle=60*(st[i]%10)/9 if problem is None else 60*ds[i]/9
        # 9→0の0.15秒落下。下端に小さな跳ね返りを一度入れる。
        if problem is None:
            prev=[0]*5
            for e in EVENTS:
                nd=[int(c) for c in str(e['value']).zfill(5)]
                if e['tag']=='drop' and t>=e['time'] and t<e['time']+.21 and nd[i]==0 and prev[i]==9:
                    u=d.lin(t,e['time'],e['time']+.15);angle=60*(1-u*u)+5*math.sin(math.pi*d.lin(t,e['time']+.15,e['time']+.21))*(t>=e['time']+.15)
                prev=nd
        a['root'].rotation_euler.y=math.radians(angle)
        glow=1.5 if T('arm:wait','4つの腕')<=t<FX['chain'] and ds[i]==9 else 0;d.set_emit(a['material'],glow,'#ffd23f')
    for o in p['contacts']:d.show(o,problem is None and FX['contacts']<=t<S('arm:lift'))
def papers_state(t,last=False):
    collapsed=FX['collapse'];u=d.lin(t,collapsed,collapsed+1)
    stroke=PARTS['papers']['stroke'];d.show(stroke,not last and t<collapsed)
    if not last and t<collapsed:
        phase=(t*.35)%1;cycle=math.floor(t*.35)/.35;top=min(23,6+int(t/1.5))-1;z=PARTS['papers']['papers'][top][1].z+.0010
        for i,pt in enumerate(stroke.data.splines[0].points):
            s=phase*i/31;pt.co=(-.43+.12*s,-.02+.04*math.sin((cycle+s/.35)*4),z,1)
    for i,(r,p) in enumerate(PARTS['papers']['papers']):
        stack_count=6 if last else min(23,6+int(t/1.5));d.show_tree(r,i<stack_count)
        if last or t<collapsed:
            r.location=p;r.rotation_euler=(0,0,.015*math.sin(i))
        else:
            # 机の上へ落ち、回転しながら広がる。先頭の数枚は山を残す。
            target=Vector((-.38+.33*math.sin(i*2.1),-.02+.24*math.cos(i*1.7),.002+(i%3)*.0015))
            r.location=p.lerp(target,d.sm(u))+Vector((0,0,d.hop(u,.13+.03*(i%3))))
            r.rotation_euler=(.24*math.sin(math.pi*u+i)*math.sin(math.pi*u),.18*math.sin(i+u*8)*math.sin(math.pi*u),u*(i%5-2)*.45)
def flame_state(t):
    d.flame.scale=(1+.06*math.sin(t*13.1),1,1+.06*math.sin(t*29.7));d.fl.energy=2.5*(1+.05*math.sin(t*13.1))
def quill_state(t,last=False):
    if last:d.quill.location=(-.28,-.16,.006);d.quill.rotation_euler=(math.pi/2,0,-.6);return
    if t<FX['collapse']:
        x=-.43+.12*((t*.35)%1);y=-.02+.04*math.sin(t*4);top=min(23,6+int(t/1.5))-1
        nib=Vector((x,y,PARTS['papers']['papers'][top][1].z+.0007));d.quill.location=nib;d.quill.rotation_euler=(math.radians(-35),math.radians(35),.15*math.sin(t*5))
        grip=nib+d.quill.rotation_euler.to_matrix()@Vector((0,0,.060))
        c=cue_at(t);hold_paper=c['key']=='desk:revolt' and t<T('desk:revolt','大きな反乱')-c['move']
        d.set_hand('kai',grip,150,-30,vis=c['group']!='crowd' or hold_paper)
    else:
        u=d.seg(t,FX['collapse'],FX['collapse']+.6);d.quill.location=Vector((-.35,-.02,.08)).lerp(Vector((-.28,-.16,.006)),u);d.quill.rotation_euler=(math.pi/2*u,0,-.6*u)
def score_state(t):
    p=d.board_h;p.rotation_euler=(0,0,0);p.location=(.58,.30,0)
    a=0;b=0
    for k,x,y in [('carry:point',0,1),('arm:judge',0,2),('dad:price',1,2)]:
        at=T(k,'消えました' if k=='carry:point' else '正しく' if k=='arm:judge' else '高くて')
        if t>=at:a=x;b=y
    d.dg['make'].data.body=str(a);d.dg['brk'].data.body=str(b)
    for o in d.dg.values():o.scale=(1,1,1)
    for k,name,word in [('carry:point','brk','消えました'),('arm:judge','brk','正しく'),('dad:price','make','高くて')]:
        tt=t-T(k,word)
        if 0<=tt<.45:sc=1+.45*math.sin(math.pi*tt/.45);d.dg[name].scale=(sc,sc,sc)
def hands(t):
    c=cue_at(t);r=c['row'];st=wheel_steps(t)
    if r in [12,13,14,15,16,20]:
        idx=3 if r==13 and t<T('gear:27','一の位の歯車') or r==20 else 4
        p=PARTS['m1']['centers'][idx];a=math.pi/2+2*math.pi*st[idx]/10;tip=p+Vector((.0224*math.cos(a),.0224*math.sin(a),.006));d.set_hand('kai',tip,160 if r==12 else 60,-30 if r==12 else -32)
    elif r in [24,25,26,27,29,30,33,42]:
        kind='eight' if r==27 else 'm2';p=PARTS[kind];g=p['wheels'][-1];value=st[-1] if kind=='m2' else 9;ang=math.pi/2+2*math.pi*value/10
        tip=g['center']+Vector((.04*math.cos(ang),-.019,.04*math.sin(ang)))
        if r==27 and t>=FX['shake']:tip.x+=.002*math.sin(t*2*math.pi*10)
        # 指先は指定どおり±2mm/10Hz。声「強く押せば」に合わせて手首を
        # 接点の周りへ押し込む。細かい震えと、力を入れる動作を分ける。
        yaw=75+22*d.seg(t,T('hard:crack','強く押せば'),T('hard:crack','強く押せば')+.85) if r==27 else 75
        d.set_hand('kai',tip,yaw,-12)
def apply_state(t):
    c=cue_at(t);r=c['row'];hide_all();g=c['group']
    if g in ['desk','crowd']:
        visible('papers','candle','quill');papers_state(t,r==43);flame_state(t);quill_state(t,r==43)
        if r>=2 and r<6:visible('hat');p=PARTS['hat']['root'];p.location=(-.55,.12,d.hop(d.lin(t,T('desk:rouen','役人'),T('desk:rouen','役人')+.5),.04))
        if r in [3,4]:
            visible('crowd');u=d.seg(t,T('desk:revolt','大きな反乱'),T('desk:revolt','大きな反乱')+.8)
            for i,(o,p) in enumerate(PARTS['crowd']['roots']):o.location=p+Vector((0,0,-.10*(1-u)));o.rotation_euler.y=.05*math.sin(t*4+i)
        if r==43:visible('m1');calculator_state(t,True)
    elif g=='pascal':
        visible('pascal');u=d.seg(t,FX['idea'],FX['idea']+.3);PARTS['pascal']['idea']['root'].scale=(u,u,u);PARTS['pascal']['idea']['root'].rotation_euler.y=t*2
    elif g=='paper':visible('paper')
    elif g in ['m1','order']:
        visible('m1');calculator_state(t,True)
        if r==20 and t<S('carry:ten')+1:
            visible('m2');mechanism_state(t);u=d.seg(t,S('carry:ten'),S('carry:ten')+1);sc=d.lerp(1,1/1.7,u);p=PARTS['m2'];p['root'].scale=(sc,sc,sc);p['root'].location=p['center']+Vector((0,0,-.10*u))
        if g=='order':visible('paper')
        if r==38:visible('score');score_state(t)
    elif g in ['m2','arm','eight']:
        visible('m1');calculator_state(t,True)
        kind='eight' if g=='eight' else 'm2';visible(kind);mechanism_state(t,kind)
    elif g=='meter':
        visible('meter');u=d.lin(t,FX['meter'],FX['meter']+.3)
        for i,(p,tx) in enumerate(PARTS['meter']['windows']):
            tx.data.body=('0020' if u>=.5 else '0019')[i];p.rotation_euler.x=math.pi*math.sin(math.pi*u) if i>=2 else 0
    elif g=='shishi':
        visible('shishi');p=PARTS['shishi'];fill=d.lin(t,FX['water'],FX['shishi']);dump=d.seg(t,FX['shishi'],FX['shishi']+.07);back=d.seg(t,FX['shishi']+.07,FX['shishi']+.16)
        # 口はゆっくり下がる→水をこぼす→すぐ戻って閉じた尻が石を打つ。
        ang=math.radians(d.lerp(55,15,fill)-50*dump+90*back);p['arm'].rotation_euler.y=ang
        for i,o in enumerate(p['drops']):
            u=((t-FX['water'])*2+i/14)%1
            if dump>.2:o.location=p['center']+Vector((-.06*math.cos(ang)-.04*u,0,.078+.06*math.sin(ang)-.06*u))
            else:o.location=p['center']+Vector((-.046,0,.14-(.14-(.078+.06*math.sin(ang)))*u))
            d.show(o,FX['water']<=t<FX['shishi']+.70)
    elif g=='domino':
        visible('domino')
        for i,o in enumerate(PARTS['domino']['tiles']):
            # 承認済み：cameraが0.8秒で止まった後、8枚の因果を見せる。
            at=S('arm:domino')+.8+(7-i)*.08;u=d.seg(t,at,at+.25);bounce=3*math.sin(math.pi*d.lin(t,at+.25,at+.40)) if i==0 and t>=at+.25 else 0;o.rotation_euler.y=math.radians(-80*u+bounce)
    elif g=='score':visible('score');score_state(t)
    elif g=='proto':
        visible('proto')
        for o,p,row,i in PARTS['proto']['boxes']:
            u=d.seg(t,T('dad:proto','何十台もの試作')+i*.10,T('dad:proto','何十台もの試作')+i*.10+.22);o.location=p+Vector((0,0,.12*(1-u)))
    hands(t);set_camera(t);return c
def apply(t):
    # hide_all→visible の途中の状態は描かない。元と同じ最後の代入だけを適用。
    # hide_viewport の同値・一過性変更による全scene同期を避ける。
    global SHOW_QUEUE
    assert SHOW_QUEUE is None,'Nested apply';SHOW_QUEUE={}
    try:c=apply_state(t)
    except BaseException:SHOW_QUEUE=None;raise
    final=SHOW_QUEUE;SHOW_QUEUE=None
    for o,v in final.items():immediate_show(o,v)
    for o,v in final.items():assert o.hide_render is (not v) and o.hide_viewport is (not v)
    VISIBILITY_STATS['flushes']+=1;VISIBILITY_STATS['objectsVerified']+=len(final)
    bpy.context.view_layer.update()
    return c
def anchors(t):
    c=cue_at(t);r=c['row'];p=PARTS['m1'];a={'price':p['tag'].matrix_world.translation.copy(),'paper':Vector((.05,-.22,.004)),'score':Vector((.58,.30,.16)),'crack':PARTS['eight']['wheels'][5]['center']+Vector((0,-.015,.043))}
    for i in range(5):
        a['m1.digit.%d'%i]=p['windows'][i].matrix_world.translation.copy() if r in [11,12,13,14,15,16,20,21,22,38,39,40,41,43] else Vector((0,0,-5))
        m2=PARTS['m2'];g=m2['wheels'][i];a['m2.digit.%d'%i]=m2['root'].matrix_world@(g['center']-m2['center']+Vector((0,-.018,.066))) if c['group'] in ['m2','arm'] else Vector((0,0,-5))
    return a
def problem_state(ds):
    # 問題編用は音声・cue時刻・tから独立して同じ模型を配置する。
    p=PARTS['m2'];p['root'].scale=(1,1,1);p['root'].location=p['center']
    for i,g in enumerate(p['wheels']):g['root'].rotation_euler.y=-2*math.pi*ds[i]/10;d.show(g['bump'],False);d.show(g['carrier'],False)
    for a in p['arms']:d.show_tree(a['root'],True);a['root'].rotation_euler.y=math.radians(60*ds[a['index']]/9);d.set_emit(a['material'],0,'#ffd23f')
    for o in p['contacts']:d.show(o,False)
def challenge_setup():
    if bpy.context.window is not None:bpy.context.window.scene=d.SC
    assert bpy.context.scene is d.SC,'C1 challenge requires its own scene'
    hide_all();visible('m2');problem_state([0,0,9,9,9]);d.set_hand('kai',(.24,.025,.155),75,-12);d.pose_cam(DATA['cameras']['m2'])
def answer_state():
    challenge_setup();problem_state([0,1,0,0,0])
    for i in range(3):
        arm=PARTS['m2']['arms'][-1-i];p=arm['pivot']+Vector((-.066,-.01,.04));a=d.text('c1_answerfall'+str(i),str(i+1),.025,d.M_INK,p,rot=(math.pi/2,0,0));MANAGED.append(a);d.show(a,True)
def write_problem():
    if bpy.context.window is not None:bpy.context.window.scene=d.SC
    assert bpy.context.scene is d.SC,'C1 problem requires its own scene'
    out=os.path.join(A.cache,'problem');os.makedirs(out,exist_ok=True)
    projections={}
    for name,fn in [('挑戦',challenge_setup),('答え',answer_state)]:
        f=os.path.join(out,name+'.png')
        fn();bpy.context.view_layer.update();p=PARTS['m2'];points={}
        for i,g in enumerate(p['wheels']):points['m2.digit.'+str(i)]=d.project(p['root'].matrix_world@(g['center']-p['center']+Vector((0,-.018,.066))))
        for a in p['arms']:points['m2.arm.'+str(a['index'])]=d.project(a['weight'].matrix_world.translation)
        projections[name]=points
        if not os.path.exists(f) or A.force:d.SC.render.image_settings.file_format='PNG';d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
    json.dump({'independentOfVoice':True,'states':projections},open(os.path.join(out,'anchors-c1v1.json'),'w'),indent=1)
    d.SC.render.image_settings.file_format='JPEG'
def catalog():
    if bpy.context.window is not None:bpy.context.window.scene=d.SC
    assert bpy.context.scene is d.SC,'C1 catalog requires its own scene'
    out=A.out or os.path.join(A.cache,'blender','catalog');os.makedirs(out,exist_ok=True)
    specs=[('m1','m1',(.05,.06,.05),.36),('m2','m2',(0,.05,.12),.60),('bump','m2',(.18,.05,.13),.24),('arm','m2',(.18,.05,.18),.24),('meter','meter',(.4,-.08,.03),.14),('shishi','shishi',(-.42,-.02,.07),.15),('domino','domino',(.42,-.12,.014),.15),('proto','proto',(.10,.36,.07),.96),('paper','paper',(.05,-.22,0),.21),('pascal','pascal',(.22,-.05,.06),.12)]
    for name,group,c,span in specs:
        print('[c1] catalog '+name,flush=True)
        hide_all();visible(group)
        if group=='m1':calculator_state(155,True)
        if group=='m2':mechanism_state(269 if name=='arm' else 130)
        if group=='shishi':apply(S('arm:shishi')+1)
        if group=='domino':
            for o in PARTS['domino']['tiles']:o.rotation_euler.y=0
        for top in [False,True]:
            f=os.path.join(out,'c1v1_'+name+('_top.jpg' if top else '_oblique.jpg'))
            if os.path.exists(f) and not A.force:continue
            d.catalog_camera(c,top=top,span=span);d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
def scene_key(t):
    c=cue_at(t);r=c['row'];pose,moving=raw_pose(t)
    if moving:return ('moving',round(t*FPS))
    # 動きの無い説明は同じ画像を複製。物の運動中は全30fpsを描く。
    if r<=5 or r==43:return ('live',round(t*FPS))
    if r==6 and t>=FX['idea']:return ('live',round(t*FPS))
    if r in [3,4,17,23,27,32,34,35,36,38]:return ('live',round(t*FPS))
    if FX['box']-.03<=t<FX['box']+1.35:return ('box-drop',round(t*FPS))
    if T('arm:wait','4つの腕')-.03<=t<T('arm:wait','4つの腕')+.04:return ('arms-glow',round(t*FPS))
    if r==39:return ('shown',int(t*FPS))
    if any(e['time']-.03<=t<=e['time']+e['duration']+.22 for e in EVENTS):return ('event',round(t*FPS))
    st=tuple(round(v,5) for v in wheel_steps(t));ds=tuple(digits(t));return (c['camera'],c['group'],st,ds,r in [24,25,26,27,28],r in [29,30,31,33,42],t>=T('carry:bump','出っぱり'),t>=FX['contacts'],t>=T('arm:wait','4つの腕'))
def main():
    if bpy.context.window is not None:bpy.context.window.scene=d.SC
    assert bpy.context.scene is d.SC,'C1 main requires its own scene'
    preview=bool(A.times) or A.scale<1 or A.every>1;out=A.out or os.path.join(A.cache,'blender','preview' if preview else 'desk');os.makedirs(out,exist_ok=True);started=time.time()
    if A.times:
        af=os.path.join(out,'anchors.json');anc=json.load(open(af))['anchors'] if os.path.exists(af) else {}
        for t in map(float,A.times.split(',')):
            print('[c1] preview %.4fs'%t,flush=True)
            j=round(t*FPS);f=os.path.join(out,'%05d.jpg'%j)
            apply(t)
            for k,v in anchors(t).items():
                if k not in anc:anc[k]=[[0,0,0] for _ in range(NF)]
                anc[k][j]=d.project(v)
            if os.path.exists(f) and not A.force:continue
            d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
        json.dump({'fps':FPS,'frames':NF,'anchors':anc},open(os.path.join(out,'anchors.json'),'w'))
        json.dump(camera_motion(),open(os.path.join(A.cache,'blender','camera-motion.json'),'w'),indent=1)
        return
    plans=[];keys={}
    for j in range(NF):
        k=scene_key(j/FPS)
        if k not in keys:keys[k]=j
        plans.append(keys[k])
    json.dump(camera_motion(),open(os.path.join(A.cache,'blender','camera-motion.json'),'w'),indent=1)
    # 参照ライブラリのproject/cloneと同じ全コマ・再開方式。
    if not A.no_anchors:
        anc={};prev=None;saved=None
        for j in range(NF):
            jj=plans[j]
            if jj!=prev:
                apply(jj/FPS);saved={k:d.project(v) for k,v in anchors(jj/FPS).items()};prev=jj
            for k,v in saved.items():anc.setdefault(k,[]).append(v)
            if j and j%600==0:print('[c1] anchor states %d/%d, %.1fs'%(j,NF,time.time()-started),flush=True)
        json.dump({'fps':FPS,'frames':NF,'anchors':anc},open(os.path.join(out,'anchors.json'),'w'))
        print('[c1] anchors %.1fs'%(time.time()-started),flush=True)
    if A.anchors_only:return
    indices=[j for j in range(NF) if plans[j]==j and A.start<=j/FPS<A.stop and j%A.every==0];n=0;renderstart=time.time()
    for j in indices:
        f=os.path.join(out,'%05d.jpg'%j)
        if os.path.exists(f) and not A.force:continue
        apply(j/FPS);d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name);n+=1
        if n%50==0:print('[c1] %d/%d unique, %.1fs per image'%(n,len(indices),(time.time()-renderstart)/n),flush=True)
    for j,jj in enumerate(plans):
        if not A.start<=j/FPS<A.stop:continue
        f=os.path.join(out,'%05d.jpg'%j);src=os.path.join(out,'%05d.jpg'%jj)
        if j!=jj and os.path.exists(src) and not os.path.exists(f):d.clone(src,f)
    missing=sum(not os.path.exists(os.path.join(out,'%05d.jpg'%j)) for j in range(NF))
    record={'frames':NF,'unique':len(keys),'done':NF-missing,'missing':missing,'rendered':n,'seconds':time.time()-started,'fps':FPS};json.dump(record,open(os.path.join(out,'meta.json'),'w'),indent=1)
    with open(os.path.join(A.cache,'blender','render-log.txt'),'a') as f:f.write(json.dumps(record)+'\n')
    print('[c1]',record,flush=True)
if __name__=='__main__':
    if A.gates:
        gate_started=time.time()
        for ci,c in enumerate(CUES):
            for f in [.03,.20,.40,.60,.80,.97]:apply(c['start']+(c['end']-c['start'])*f)
            if (ci+1)%10==0:print('[c1] state cues %d/%d %.1fs'%(ci+1,len(CUES),time.time()-gate_started),flush=True)
        print('[c1] all 53 cues x 6 states PASS; cached visibility calls %d; final-flag proof %s'%(TREE_CALLS,json.dumps(VISIBILITY_STATS)),flush=True)
        catalog();A.times=','.join(map(str,DATA['previews']+DATA.get('extraPreviews',[])));main();write_problem()
        assert all(hashlib.sha256(open(f,'rb').read()).hexdigest()==s for f,s in SOURCE_SHA.items()),'Source changed during trial'
        json.dump({'seconds':time.time()-gate_started,'stateChecks':53*6,'width':d.SC.render.resolution_x,'height':d.SC.render.resolution_y,'samples':A.samples,'times':DATA['previews']+DATA.get('extraPreviews',[]),'sourceSha256':SOURCE_SHA,'treeCache':{'roots':len(TREE_ROOTS),'descendantsEqual':True,'callsChecked':TREE_CALLS},'visibility':VISIBILITY_STATS,'armContact':PARTS['m2']['contactProof']},open(os.path.join(A.cache,'blender','gate-c1v1-run.json'),'w'),indent=1)
    elif A.catalog:catalog()
    elif A.problem:write_problem()
    else:main()
