"""D-1前編の新規3D。支給台本・声・字幕・時刻と既存ファイルを変更しない。

後編と同じ desk_lib_d1_machine_gpt_20261026 を閉じた外装で使う。
一致する24 cueは保存済み3Dだけをcue内時刻で写せる。合成済み字幕の画は使わない。
--dry / --shot-plan / --times / --problem は準備用。本番は親の後編完了後に実行する。
"""
import os,sys,json,math,time,hashlib,argparse,bisect,ctypes,shutil,re
HERE=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(os.path.join(HERE,'../..'))
sys.path.insert(0,HERE)
saved=sys.argv[:];sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
import desk_lib as d
sys.argv=saved
import desk_lib_d1 as ext
import desk_lib_d1_machine_gpt_20261026 as mx
import desk_lib_d1a_extras_gpt_20261026 as ax
from mathutils import Vector

def args():
    p=argparse.ArgumentParser();p.add_argument('--cache',default='/private/tmp/ys/ys-chain-d1a_gpt_20261026');p.add_argument('--times')
    p.add_argument('--from',dest='start',type=float,default=0);p.add_argument('--to',dest='stop',type=float,default=1e9)
    p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16);p.add_argument('--out');p.add_argument('--force',action='store_true')
    p.add_argument('--dry',action='store_true');p.add_argument('--shot-plan',action='store_true');p.add_argument('--plan-only',action='store_true');p.add_argument('--problem',action='store_true');p.add_argument('--catalog',action='store_true');p.add_argument('--finish',action='store_true')
    p.add_argument('--no-reuse',action='store_true');p.add_argument('--redraw-keys',default='')
    p.add_argument('--reuse-source',default=ROOT+'/outputs/axes-20261023/d1v1-3d-frames-backup-20261026/desk')
    return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();assert os.path.realpath(A.cache)=='/private/tmp/ys/ys-chain-d1a_gpt_20261026','前編専用の孤立cacheだけへ書く'
DATA=json.load(open(A.cache+'/blender/data.json'));CUES=DATA['cues'];STARTS=[c['start'] for c in CUES];CUE={c['key']:c for c in CUES}
assert len(CUES)==54 and len(set(c['row'] for c in CUES))==40
FPS=30;NF=math.ceil(DATA['duration']*FPS);PT=json.load(open(A.cache+'/phrase-times.json'))
def S(k):return CUE[k]['start']
def E(k):return CUE[k]['end']
def W(k,word):
    hits=[w['time'] for w in CUE[k]['wordEvents'] if w['word']==word];assert len(hits)==1,(k,word);return hits[0]
def U(t,a,dur=.3):return d.sm((t-a)/max(1e-5,dur))
def cue_at(t):return CUES[max(0,bisect.bisect_right(STARTS,t+1e-9)-1)]
def mix(p,q,u):u=d.sm(u);return [a+(b-a)*u for a,b in zip(p,q)]
def pulse(t,a,dur=1.2):return math.sin(math.pi*d.clamp((t-a)/dur)) if a<=t<=a+dur else 0.0

# ---------------- immutable-input 3D reuse map ----------------
OLD_DIR=os.path.join(HERE,'desk_assets/d1v1')
OLD=json.load(open(OLD_DIR+'/ys-chain-d1v1.json'));OLD_PT=json.load(open(OLD_DIR+'/phrase-times.json'))
OLD_CUES={q['subtitle']:{'key':q['diagram'].replace('cd1v1-',''),'start':s['captions'][i]['start'],'end':s['captions'][i]['end']} for s in OLD['scenes'] for i,q in enumerate(s['cues'])}
OLD_BY_KEY={q['key']:q for q in OLD_CUES.values()}
REUSE_ALLOWED={'mine:open','mine:water','shrink:mio','shrink:spoon','shrink:1700','shrink:back','can:crush','can:mio','straw:drink','straw:push','air:weight','air:1kg','air:mio','air:inside','why:mio','why:air','why:steam','size:wide','size:53','size:area','size:2t','size:mio','size:guericke','size:pull'}
REUSE={}
for c in CUES:
    old=OLD_CUES.get(c['subtitle'])
    if c['key'] in REUSE_ALLOWED and old and PT[c['subtitle']]==OLD_PT[c['subtitle']]:REUSE[c['key']]=old
assert len(REUSE)==24
# 文言/時刻が一致する24 cue の照合は保つが、缶の接合と凝縮を修正する5 cueは
# 旧3Dをコピーしない。CLIの追加指定で、この必須集合を外すことはできない。
REQUIRED_REDRAW={'can:crush','can:mio','air:inside','why:air','why:steam'}
REDRAW=REQUIRED_REDRAW | set(filter(None,A.redraw_keys.split(',')))
OLD_ANCHORS=json.load(open(A.cache+'/blender/reuse-anchors_gpt_20261026.json'))['anchors']
OLD_POSES=json.load(open(A.cache+'/blender/reuse-camera-poses_gpt_20261026.json'))
OLD_NF=math.ceil(OLD['duration']*FPS)
def reuse_frame(t):
    c=cue_at(t);old=REUSE.get(c['key'])
    if A.no_reuse or c['key'] in REDRAW or old is None:return None
    # A gap belongs to the previous cue; freeze its last frame, never spill into the next old cue.
    mapped=old['start']+max(0,t-c['start']);j=round(mapped*FPS)
    j=max(math.ceil(old['start']*FPS),min(j,math.floor((old['end']-1e-7)*FPS),OLD_NF-1))
    if not os.path.isfile(os.path.join(A.reuse_source,'%05d.jpg'%j)):raise FileNotFoundError('再利用3Dが無い: %d'%j)
    return j
def reuse_pose(t,j):
    c=cue_at(t);old=REUSE[c['key']];ot=j/FPS
    if c['key'] in ['air:1kg','air:mio']:
        base=[.36,-.02,.02,.37,-6,45,50];start=list(base);start[3]*=1.08
        return mix(start,base,(ot-OLD_CUES[CUE['air:1kg']['subtitle']]['start'])/.8)
    if c['key']=='size:pull':
        start=OLD_POSES[max(0,round(old['start']*FPS)-1)]
        return mix(start,[.10,-.05,.05,.95,-8,22,40],(ot-old['start'])/1.0)
    return list(OLD_POSES[min(j,len(OLD_POSES)-1)])

# ---------------- common room and episode-owned models ----------------
_VIS=None
def show_now(o,v):
    h=not bool(v)
    if o.hide_render!=h:o.hide_render=h
    if o.hide_viewport!=h:o.hide_viewport=h
def show_q(o,v):
    if _VIS is None:show_now(o,v)
    else:_VIS[o]=bool(v)
d.show=show_q
P,G=ext.build(DATA,A.cache);M=mx.build_machine();EX=ax.build_extras(P,G,M)
FUJI_MINI=[mx.mini_engine('d1a_fujimini0',(0,0,0)),mx.mini_engine('d1a_fujimini1',(0,0,0))]
FUJI_ARROWS=[ext.arrow('d1a_fujiarrow0',(0,0,.05),(0,0,0),.0022),ext.arrow('d1a_fujiarrow1',(0,0,.05*DATA['numbers']['fujiRatio']),(0,0,0),.0022)]
MANAGED=list(dict.fromkeys([o for objs in G.values() for o in objs]+M['all']+EX['all']+[o for root,objs,_ in FUJI_MINI for o in [root]+objs]+[o for root in FUJI_ARROWS for o in [root]+list(root.children)]))
BASE={o:(o.location.copy(),o.rotation_euler.copy(),o.scale.copy()) for o in MANAGED}
SCENE_OBJECTS=list(d.SC.objects);CHILDREN={o:[] for o in SCENE_OBJECTS}
for obj in SCENE_OBJECTS:
    if obj.parent in CHILDREN:CHILDREN[obj.parent].append(obj)
def show_tree(o,v):
    d.show(o,v)
    for child in CHILDREN.get(o,()):show_tree(child,v)
d.show_tree=show_tree
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale);d.SC.eevee.taa_render_samples=A.samples
for o in MANAGED:d.show(o,False)
CAN_BASE_MAT=P['can']['can']['body'].active_material
HEMI_COPPER=P['hemi']['parts'][0].active_material
HEMI_GLASS=d.mat('d1a_hemi_explained','#b87333',.36,metal=.4,alpha=.24)
if hasattr(HEMI_GLASS,'blend_method'):HEMI_GLASS.blend_method='HASHED'
# 前編専用の透視材質。共通Mの材質や形を変えず、手前の壁だけへ一時的に差す。
CYL_FRONT=M['cover_cyl'];CYL_FRONT_SOLID=CYL_FRONT.active_material
CYL_FRONT_XRAY=CYL_FRONT_SOLID.copy();CYL_FRONT_XRAY.name='d1a_cylinder_front_xray_gpt_20261026'
try:CYL_FRONT_XRAY.surface_render_method='BLENDED'
except Exception:pass
if hasattr(CYL_FRONT_XRAY,'blend_method'):CYL_FRONT_XRAY.blend_method='HASHED'
CAM={
 'mine':[-.20,.10,.17,.85,-12,30,40], 'gin':[-.43,.10,.22,.56,-12,35,40],
 'ginclosed':[-.40,.10,.27,.72,-12,35,40], 'ginwinding':[-.48,.10,.405,.20,-12,45,55], 'resthorse':[-.399,.085,.345,.17,-12,45,40],
 'board':[.58,.30,.08,.70,0,30,40], 'machine':[-.185,.087,.39,1.42,-10,28,40],
 'boiler':[-.10,.10,.383,.29,-8,30,40], 'cyl':[-.10,.10,.543,.215,-8,40,40],
 'pistonintro':[-.10,.10,.545,.24,-8,70,52],
 'beam':[-.25,.10,.642,.82,-8,28,40], 'balloon':[.05,-.16,.13,.46,-12,35,40],
 'can': [.205,-.12,.065,.52,-15,42,40], 'canclose':[.265,-.12,.026,.21,-15,34,40],
 'canmouth':[.265,-.12,.045,.30,-10,45,40], 'canheat':[.145,-.12,.075,.17,-12,48,50],
 'straw':[.40,-.10,.075,.22,-12,32,40], 'air':[.40,.15,.14,.40,-15,30,40],
 'weights':[.36,-.02,.02,.37,-6,45,50], 'inside':[.23,-.12,.055,.50,-12,35,40],
 'twocans':[.22,-.12,.07,.42,-8,35,40], 'twins':[.20,-.08,.07,.40,-8,30,40],
 'area':[.19,-.08,.09,.16,0,65,40], 'heavy':[.26,-.08,.07,.49,-12,35,40],
 'hemi':[.10,-.05,.06,.35,-12,35,40], 'airpump':[.29,-.05,.082,.85,-8,35,40],
 'airpumpclose':[.29,-.05,.080,.85,-8,35,40], 'pull':[.10,-.05,.05,.95,-8,22,40],
 'last':[-.18,.08,.15,1.20,-12,30,40],
 'fuji':[.30,.02,.13,.93,-6,14,40],
}

def base_state():
    st=mx.idle_state();st.update(covers=1.0,pump_cutaway=False,v=.3,kettle_steam=.8,boil=.5,spout=0,sump=.85,pdrops=False,air_dots=0,show_lever=False,show_plug=False)
    return st
def gin_motion(t):
    # 馬→胴の寄りで先に動き始め、同じ連続運動を巻き取りの語で全景へ切る。
    # 桶も実際には動いているが、観客へ初めて見せるのは指定の語から。
    start=W('gin:horse','回して');end=W('gin:drum','下りて')+.75
    v=U(t,start,end-start)
    return ax.gin_geometry(v),start,end
def cooling_explanation(t,a,steam_amount,mist_at=None):
    # 水を言う前は噴霧しない。流れが入り、その後に蒸気が凝縮する。
    if mist_at is None:mist_at=a
    flow=U(t,a,.15);mist=U(t,mist_at,.15);cool=U(t,mist_at+.15,.85)
    return dict(cold_valve=flow,cold_flow=flow,spray=mist*(1-cool),steam_fill=steam_amount*(1-cool),condensate=cool*.5,cyl_color='cold' if t>=mist_at else None)
def cylinder_xray_alpha(t,k=None):
    if k is None:k=cue_at(t)['key']
    if k in ['myth:fact','myth:judge']:a=W('myth:fact','筒の中に')
    elif k=='cyl:likecan':a=W(k,'機械の筒も')
    else:return 1.0
    return 1.0-.86*U(t,a,.45)
def apply_cylinder_xray(t):
    alpha=cylinder_xray_alpha(t)
    if alpha>=1.0:return
    # 外装は閉じたまま内部だけ透視。壁やふたの変換・mesh・接合部には触れない。
    before=CYL_FRONT.matrix_local.copy();mesh=CYL_FRONT.data
    source=d.principled(CYL_FRONT_SOLID);target=d.principled(CYL_FRONT_XRAY)
    target.inputs['Base Color'].default_value=source.inputs['Base Color'].default_value
    target.inputs['Roughness'].default_value=source.inputs['Roughness'].default_value
    target.inputs['Metallic'].default_value=.18
    target.inputs['Alpha'].default_value=alpha
    CYL_FRONT.active_material=CYL_FRONT_XRAY
    assert CYL_FRONT.data is mesh and CYL_FRONT.matrix_local==before
def scene(t):
    c=cue_at(t);k=c['key'];st=base_state();X={'machine':False,'groups':[],'hands':[]};cam=CAM['mine']
    if k in ['mine:open','mine:water']:
        X['groups']=['mine'];cam=list(CAM['mine']);cam[3]+=.08*(1-U(t,0,1.5))
    elif k.startswith('gin:') or k=='mine:mio':
        X['groups']=['mine','horse'];cam=CAM['gin']
        if t<W('gin:drum','太い胴'):
            g,_,_=gin_motion(t);angle=g['angle'];center=EX['gin']['center']
            cam=[center.x+.081*math.cos(angle),center.y+.081*math.sin(angle),.352,.17,
                 math.degrees(angle)+90,30,50]
            X['horseclose']=True
        elif t<W('gin:drum','巻き取られて'):
            # 声が胴/綱へ移った瞬間は、その実物を見せる。桶の初見はまだ作らない。
            cam=CAM['ginwinding'];X['horseclose']=True
        if k=='gin:closed' and t>=W(k,'閉じて（得点板 水 1−0 人）'):
            X['groups'].append('score');X['ginboard']=True;cam=CAM['ginclosed']
    elif k=='mine:rule':X['groups']=['score'];cam=CAM['board']
    elif k in ['nc:install','nc:boiler','nc:piston']:
        X['machine']=True;cam=CAM['machine']
        if k=='nc:install':X['assembly']=U(t,W(k,'据えつけました'),1.2)
        if k=='nc:boiler':
            cam=mix(CAM['machine'],CAM['boiler'],(t-S(k))/.8);st['hl']={'boiler':pulse(t,W(k,'ボイラー'))}
            if t>=W(k,'太い筒'):cam=mix(CAM['boiler'],CAM['cyl'],(t-W(k,'太い筒'))/.8)
        if k=='nc:piston':
            cam=CAM['pistonintro'] if t<W(k,'シーソー') else mix(CAM['pistonintro'],CAM['beam'],(t-W(k,'シーソー'))/.8)
            st['hl']={'piston':pulse(t,W(k,'ピストン')),'beam':pulse(t,W(k,'シーソー'))}
        if k=='nc:install' and W(k,'据えつけました')-.3<=t<W(k,'据えつけました')+1.3:X['hands']=[('kai',(-.15,.06,.48),75,-25,.55)]
    elif k.startswith('myth:'):
        X['machine']=True;cam=CAM['cyl'];st['steam_fill']=.8
        if k in ['myth:fact','myth:judge']:
            st.update(cooling_explanation(t,W('myth:fact','冷たい水'),.8,W('myth:fact','吹きこんで')))
    elif k.startswith('shrink:'):X['groups']=['balloon'];cam=CAM['balloon']
    elif k in ['can:fill','can:flip','can:crush','can:mio','air:pusher','can:seal','air:emptied']:
        X['groups']=['can','can_extra'];cam=CAM['canheat'] if k=='can:fill' else CAM['can'] if k=='can:flip' else CAM['canmouth'] if k=='can:seal' else CAM['canclose'] if k in ['can:crush','can:mio'] else CAM['can']
    elif k.startswith('straw:'):X['groups']=['straw'];cam=CAM['straw']
    elif k=='air:weight':X['groups']=['air'];cam=CAM['air']
    elif k in ['air:1kg','air:mio']:X['groups']=['weights'];cam=CAM['weights']
    elif k=='air:inside':X['groups']=['weights','can'];cam=CAM['inside']
    elif k.startswith('why:'):X['groups']=['twocans'];cam=CAM['twocans']
    elif k=='cyl:likecan':
        X['machine']=True;cam=CAM['cyl'];a=W(k,'冷やす')
        st.update(cooling_explanation(t,a,1.0));st.update(v=.9-.7*U(t,W(k,'ピストンを押します'),.9),air_arrow=U(t,W(k,'外の空気'),.4))
    elif k=='size:wide':X['groups']=['twins'];cam=CAM['twins']
    elif k in ['size:53','size:area']:X['groups']=['area'];cam=CAM['area']
    elif k in ['size:2t','size:mio','size:horse4']:
        X['groups']=['area','heavy'];cam=CAM['heavy']
    elif k=='size:rest':X['restinghorse']=True;cam=CAM['resthorse']
    elif k=='size:guericke':X['groups']=['hemi'];cam=CAM['hemi']
    elif k.startswith('guericke:'):
        X['groups']=['hemi','airpump'];cam=CAM['airpump'] if k=='guericke:build' else CAM['airpumpclose']
    elif k=='size:pull':X['groups']=['hemi'];cam=mix(CAM['hemi'],CAM['pull'],(t-S(k))/1.0)
    elif k in ['next:mio','next:open']:
        X['machine']=True;cam=CAM['machine']
        if k=='next:open':X['seams']=t>=W(k,'一つずつ開けて見る')
    elif k in ['ch:fuji','ch:later']:X['groups']=['fuji'];cam=CAM['fuji']
    elif k=='last:can':X['groups']=['mine','can','hemi','score'];X['last']=True;cam=CAM['last']
    j=reuse_frame(t)
    if j is not None:cam=reuse_pose(t,j)
    return list(cam),st,X

def reset():
    CYL_FRONT.active_material=CYL_FRONT_SOLID
    for o in MANAGED:d.show(o,False)
    for o,(p,r,s) in BASE.items():o.location=p;o.rotation_euler=r;o.scale=s
    for who in d.HANDS:d.HANDS[who].scale=(1,1,1);d.set_hand(who,(0,0,0),vis=False)
    P['can']['can']['crush'].value=0
    for q in P['twocans']['cans']:q['crush'].value=0
    for q in P['hemi']['parts']:q.active_material=HEMI_COPPER
def visible(*names):
    for name in names:
        for obj in G[name]:
            if not obj.name.startswith('d1_can_redband'):d.show(obj,True)
def small_hand(who,tip,yaw=75,pitch=-25,scale=.5):
    d.set_hand(who,tip,yaw=yaw,pitch=pitch);h=d.HANDS[who];h.scale=(scale,)*3;h.location=Vector(tip)-h.rotation_euler.to_matrix()@(d.TIP*scale)
def set_camera(cam):
    d.pose_cam(cam);d.CAM_D.dof.aperture_fstop=11.2 if cam[3]<.7 else 5.6
    # 読みやすい絞りを継承。富士山は後編と同じ斜め方向で柱の前後を分ける。
    if cam==CAM['fuji']:
        d.CAM_D.dof.aperture_fstop=11.2
    if cam==CAM['weights']:
        d.CAM_D.dof.focus_distance=(Vector((.30,-.045,.01))-d.CAM.location).length;d.CAM_D.dof.aperture_fstop=16
def mine_state(t):
    q=P['mine'];elapsed=min(t,E('mine:water'));w=.05+.14*U(elapsed,0,OLD_BY_KEY['mine:rule']['start'])
    if t>=S('gin:horse'):w=min(.255,w+.09*U(t,S('gin:horse'),E('gin:closed')-S('gin:horse')))
    q['pool'].dimensions.z=max(.006,w*.15);q['pool'].location.z=.023+q['pool'].dimensions.z/2;q['shaft'].dimensions.z=max(.008,w);q['shaft'].location.z=.02+q['shaft'].dimensions.z/2;q['marker'].location.z=.02+w
    for i,o in enumerate(q['drops']):u=(t*.32+i*.063)%1;o.location=(-.40+.26*((i*7)%17)/17,.033,.27-.23*u);d.show(o,i<8 or t>=W('mine:water','しみ出す水'))
def gin_state(t,rest=False):
    q=EX['gin'];g,start,end=gin_motion(t);angle=g['angle']
    q['drum'].rotation_euler.z=angle;q['arm'].rotation_euler.z=angle
    ax.update_gin_coils(q,angle)
    h=q['horse']['root'];h.location=q['center']+Vector((.081*math.cos(angle),.081*math.sin(angle),0));h.rotation_euler.z=angle+math.pi/2
    for i,leg in enumerate(q['horse']['legs']):leg.rotation_euler.y=.12*math.sin(angle*4+i*math.pi/2) if start<=t<end else 0
    dumping=U(t,end+.1,.4)*(1-U(t,end+1.0,.4))
    for i,(bucket,water) in enumerate(q['buckets']):
        z=.065+g['lift'] if i==0 else .325-g['drop']
        bucket.rotation_euler.x=.65*dumping if i==0 else 0
        # 水をあける時も吊り点を中心に傾け、綱の長さを勝手に変えない。
        tie=Vector((-.355,.072 if i==0 else .128,z+.026))
        bucket.location=tie-bucket.rotation_euler.to_matrix()@Vector((0,0,.026))
        ax.set_rod(q['hanging'][i],tie,(tie.x,tie.y,.403))
        q['pulleys'][i].rotation_euler.y=(-g['lift'] if i==0 else g['drop'])/.011
        d.show(water,i==0 and t<end+1.0)
    lip=q['buckets'][0][0].location+q['buckets'][0][0].rotation_euler.to_matrix()@Vector((0,-.0125,.012))
    for i,o in enumerate(q['dumped']):u=(t*1.5+i/12)%1;o.location=lip+Vector((.03*u,-.025*u,-.045*u));d.show(o,dumping>.01)
    for i,o in enumerate(q['sweat']):u=(t+i*.2)%1;o.location=h.location+Vector((.025+.018*u,0,.05+.014*math.sin(math.pi*u)));d.show(o,t>=S('mine:mio'))
    if rest:h.rotation_euler.y=.8;h.location.z-=.015
def can_state(t,last=False):
    q=P['can'];c=q['can'];flip=U(t,W('can:flip','逆さに'),1)
    c['root'].location=(.145+.12*flip,-.12,.062+.017*math.sin(math.pi*flip)-.012*flip);c['root'].rotation_euler.y=math.pi*flip
    crush=U(t,W('can:crush','ぐしゃっと'),.15);c['crush'].value=crush
    # 口は水中へ固定したまま、反対の底を口へ寄せて短くする。
    # 元の形状キーの口+.04→+.03という移動を+.01で打ち消す。
    c['body'].location=BASE[c['body']][0]+Vector((0,0,.010*crush))
    for obj in c['rim']:
        obj.location=BASE[obj][0]
        if BASE[obj][0].z<c['p'].z:obj.location.z+=.020*crush
    for i,o in enumerate(q['mist']):o.location=(.145+.005*math.sin(t*3+i),-.12,.11+((t*.04+i*.017)%.06));d.show(o,W('can:fill','温めます')<=t<S('can:flip'))
    a=W('can:fill','追い出して');out=U(t,a,1.5)
    for i,o in enumerate(EX['can_air']):
        u=d.clamp(out*1.7-i*.018);theta=i*2.39996
        o.location=(.145+.010*math.cos(theta)*(1+u),-.12+.010*math.sin(theta)*(1+u),.077+.025*u+.080*u*u)
        d.show(o,S('can:fill')<=t<S('can:flip') and u<.98)
    reveal=U(t,W('air:pusher','まわりの空気'),.5);center=Vector((.265,-.12,.048))
    for o in q['arrows']:o.scale=(max(.001,reveal),)*3;o.location=center*(1-reveal);show_tree(o,reveal>.01)
    d.show(EX['seal_ring'],t>=W('can:flip','つけると'))
    show_tree(q['tongs'],W('can:flip','逆さに')-.5<=t<W('can:flip','逆さに')+1.6)
    if W('can:flip','逆さに')-.5<=t<W('can:flip','逆さに')+1.6:small_hand('kai',(.12+.12*flip,-.12,.083),scale=.55)
    if cue_at(t)['key'] not in ['can:fill','can:flip']:
        for o in G['can']:
            if o.name.startswith(('d1_stove','d1_flame_ring','d1_tong')):d.show(o,False)
    if last:
        c['root'].location=(-.08,-.10,.045);c['root'].rotation_euler.y=math.pi
        for o in G['can']:
            if o is not c['root'] and o.parent is None:d.show(o,False)
        for o in q['arrows']:show_tree(o,False)
        d.show(EX['seal_ring'],False)
def balloon_state(t):
    q=P['balloon'];v=U(t,W('shrink:spoon','蒸気にすると'),1.5)*(1-U(t,W('shrink:back','1700分の1'),1));r=.02+.10*v
    q['balloon'].scale=(r,r,r*(1+.04*math.sin(t*7)*(1-v)));q['balloon'].location.z=r+.028;d.show(q['liquid'],v<.95)
    for i,o in enumerate(q['mist']):o.location=(.03+.004*math.sin(t*2+i),-.16,.025+((t*.04+i*.012)%max(.03,r)));d.show(o,t>=W('shrink:spoon','蒸気にすると'))
def straw_state(t):
    q=P['straw'];v=U(t,W('straw:drink','減らして'),1)
    for i,o in enumerate(q['bubbles']):o.location.z+=v*.08;d.show(o,v<(i+1)/10)
    up=U(t,W('straw:push','押し上げて'),1);q['juice'].dimensions.z=.01+.10*up;q['juice'].location.z=.02+q['juice'].dimensions.z/2
    for o in q['arrows']:show_tree(o,up>0)
def layers_state(t):
    q=P['air'];a=W('air:weight','積もった')
    for i,(o,pp) in enumerate(zip(q['layers'],q['particles'])):
        visible_=t>=a+.1*i;d.show(o,visible_)
        for p in pp:d.show(p,visible_)
        for edge in q['edges'][i]:d.show(edge,visible_)
def weights_state(t):
    q=P['weights'];one=W('air:1kg','1キログラム');hundred=W('air:1kg','100キログラム分');sq=next(o for o in G['weights'] if o.name.startswith('d1_squarecm'))
    sq.location=(.418,-.045,.002);q['palm'].scale=(1.3,)*3;q['one'].scale=(.56,)*3;q['one'].location=Vector((.418,-.045,.002))+Vector((0,0,.0066+.004*(1-U(t,one,.4))))
    q['hundred'].location.z+=.012*(1-U(t,hundred,.4));show_tree(q['one'],t>=one);show_tree(q['hundred'],t>=hundred)
    for x in ['up','down']:show_tree(q[x],False)
    if W('air:1kg','1平方センチメートル')<=t<one:small_hand('kai',(.424,-.047,.003),scale=.12)
    if W('air:1kg','手のひら')<=t<W('air:1kg','手のひら')+2.1:small_hand('kai',(.318,-.035,.011),scale=.28)
def twins_state(t):
    q=P['twocans'];e=EX['condensation'];a=W('why:air','空気は')
    focus=W('why:air','蒸気なら');water_at=W('why:air','水に戻って')
    for o in q['particles'][0]:
        pos=BASE[o][0]
        o.location=Vector((.17,-.12,.05))+(pos-Vector((.17,-.12,.05)))*(1-.12*U(t,a,1))
        d.show(o,True)
    arrivals=[U(t,water_at+i*.018+.32+(.65+.22*(BASE[o][0].z-.025)/.055),.12)
              for i,o in enumerate(q['particles'][1])]
    amount=sum(arrivals)/len(arrivals)
    pool=e['pool'];pool.dimensions.z=.00015+.00105*amount;pool.location.z=.0106+pool.dimensions.z/2
    water_surface=.0106+pool.dimensions.z
    for i,(o,material,shape) in enumerate(zip(q['particles'][1],e['materials'],e['shapes'])):
        pos=BASE[o][0];born=water_at+i*.018
        liquid=U(t,born,.32)
        # 色と形を先に変え、それから重力で落ちる。到着した粒は水膜へ合流。
        fall=d.clamp((t-(born+.32))/(.65+.22*(pos.z-.025)/.055))
        merged=arrivals[i]
        # 縮む水滴の底を実際の水面へ合わせ、空中で消える隙間を作らない。
        landing=water_surface+.00255*(1-merged)
        o.location=pos.copy();o.location.z=pos.z+(landing-pos.z)*fall*fall
        shape.value=liquid
        d.principled(material).inputs['Base Color'].default_value=tuple(
            x+(y-x)*liquid for x,y in zip(e['white'],e['blue']))
        o.scale=(1-merged,)*3;d.show(o,merged<.999)
    d.show(pool,amount>0)
    focus_blue=.55*U(t,focus,.25)
    d.principled(e['focus_material']).inputs['Base Color'].default_value=tuple(
        x+(y-x)*focus_blue for x,y in zip(e['silver'],e['blue']))
    q['cans'][1]['crush'].value=0
    # 水は右の蒸気から生まれる。両容器の上から来る旧い雨粒は出さない。
    for o in q['rain']:d.show(o,False)
def heavy_state(t,rest=False):
    q=P['heavy'];at=W('size:2t','2トン分');q['weight'].location.z+=.10*(1-U(t,at,.4));show_tree(q['weight'],t>=at)
    for i,h in enumerate(q['horses']):
        a=W('size:horse4','馬およそ')+.2*i;show_tree(h['root'],t>=a);h['root'].location.x+=.07-.01*i;h['root'].location.z+=d.hop(d.lin(t,a,a+.3),.015)
        if rest:h['root'].rotation_euler.y=.8;h['root'].location.z-=.012
def resting_horse_state(t):
    q=EX['gin'];h=q['horse']['root'];lay=U(t,W('size:rest','馬が休めます'),.6)
    # 冒頭で回していた同じ馬だけへ切り返す。比較用の4頭は倒さない。
    show_tree(h,True);d.show(q['platform'],True)
    h.location=q['center']+Vector((.081,0,.015*lay));h.rotation_euler=(math.pi/2*lay,0,0)
def hemi_state(t,with_pump=False,last=False):
    q=P['hemi'];joined=U(t,W('size:guericke','2つ合わせ'),.8);air=W('size:pull','空気を入れる');release=U(t,air,.6) if not last else 0
    apart=.025*(1-joined)
    for i,o in enumerate(q['parts']):sign=-1 if i==0 else 1;o.location.x+=sign*(apart+.08*release);o.rotation_euler.y=sign*release*.6;o.active_material=HEMI_GLASS if with_pump else HEMI_COPPER
    d.show(q['seam'],joined>.98 and release<.1)
    for h in q['horses']:show_tree(h['root'],cue_at(t)['key']=='size:pull')
    for o in q['ropes']:d.show(o,cue_at(t)['key']=='size:pull')
    for o in q['gas']:d.show(o,False)
    if cue_at(t)['key']=='size:pull':
        tug=U(t,S('size:pull')+.3,.5);hard=1-U(t,air-.1,.25)
        for i,h in enumerate(q['horses']):
            sign=-1 if i<4 else 1;row,lane=(i%4)//2,(i%4)%2;h['root'].scale=(1.02,)*3;h['root'].location=q['center']+Vector((sign*(.13+row*.068+.006*tug*hard+.025*U(t,air,.9)),(-.017 if lane else .017),-.056));h['root'].rotation_euler=(0,-.12*tug*hard+.60*math.sin(math.pi*U(t,air+.05,1.4)),0 if sign>0 else math.pi)
            for j,leg in enumerate(h['legs']):leg.location.z+=(.005*tug*hard+.007*release*(1-U(t,air+.6,.8)))*max(0,math.sin(t*26+j*math.pi*.5+i))
        for i,o in enumerate(q['ropes']):sign=-1 if i==0 else 1;ax.set_rod(o,q['center']+Vector((sign*(.045+.08*release),0,0)),q['center']+Vector((sign*(.10+.025*U(t,air,.9)+.006*tug*hard),0,-.016)))
        for i,o in enumerate(q['gas']):a=2*math.pi*i/len(q['gas']);v=U(t,air,.25)*(1-U(t,air+.35,.4));o.location=q['center']+Vector((0,.03*math.cos(a)*(.3+v),.03*math.sin(a)*(.3+v)));o.scale=(2,)*3;d.show(o,v>0)
        ang=.6*release
        for obj,h in [(q['valve'],.063),(q['valvepipe'],.052)]:
            obj.location=q['center']+Vector((.08*release+h*math.sin(ang),0,h*math.cos(ang)));obj.rotation_euler.y=ang
    if last:
        shift=Vector((-.06,-.05,0))
        for o in q['parts']+[q['seam'],q['valve'],q['valvepipe']]:
            o.location=q['center']+shift+(o.location-q['center'])*.7;o.scale*=.7
def airpump_motion(t):
    pull=U(t,W('guericke:pull','取っ手を引く'),2.0)
    # 押し始めは少し圧縮して止め、出口弁が開いてから残りを押し出す。
    press=W('guericke:push','取っ手を押す')
    push=.12*U(t,press+.12,1.2)+.88*U(t,W('guericke:push','出口の弁'),2.0)
    iopen=U(t,W('guericke:pull','押し開けて'),.25)*(1-U(t,press,.12))
    oopen=U(t,W('guericke:push','出口の弁'),.25)
    return pull,push,iopen,oopen
def airpump_state(t):
    q=EX['airpump'];k=cue_at(t)['key'];p=q['p'];pull,push,iopen,oopen=airpump_motion(t);v=pull*(1-push)
    px=p.x+.028+.090*v;q['piston'].location.x=px;ax.set_rod(q['rod'],(px,p.y,p.z),(px+.17,p.y,p.z));q['handle'].location.x=px+.17
    q['inlet'].rotation_euler.y=-1.1*iopen;q['outlet'].rotation_euler.x=-1.1*oopen
    sphere_volume=4*math.pi*.05**3/3;stroke_volume=math.pi*q['radius']**2*.090
    keep=round(len(q['sphere_air'])*sphere_volume/(sphere_volume+stroke_volume))
    for i,o in enumerate(q['sphere_air']):
        theta=i*2.39996;r=.015+(i%4)*.006;o.location=P['hemi']['center']+Vector((r*math.cos(theta),r*math.sin(theta),.012*math.sin(i)))
        d.show(o,i<keep or t<W('guericke:pull','入ってきます')+.035*(i-keep))
    for i,o in enumerate(q['particles']):
        if k=='guericke:push':
            u=d.clamp(U(t,W(k,'出口の弁'),2.0)*1.45-i*.025)
            # 流れの始点は移動中のピストン左側の実空間に追従する。
            source_x=(p.x+.012+px-.006)/2
            path=[Vector((source_x,p.y,p.z)),p+Vector((.018,0,0)),q['outlet_pos'],q['outlet_pos']+Vector((0,-.055,.015))];o.location=ax.path_point(path,u);d.show(o,oopen>.1 and u<.99)
        else:
            u=d.clamp(U(t,W('guericke:pull','押し開けて'),1.8)*1.7-i*.025);o.location=ax.path_point(q['inlet_path']+[p+Vector((.09,0,0))],u);d.show(o,k=='guericke:pull' and iopen>.1 and u<.99)
    small_hand('kai',(q['handle'].location.x+.003,p.y-.02,p.z+.01),yaw=-75,pitch=-15,scale=.36)
def place_fuji(answer=False):
    q=P['fuji']
    for root,_ in q['engines']:show_tree(root,False)
    for o in q['answers']:show_tree(o,False)
    for group_,base,newbase in [(q['low'],Vector((.14,.05,0)),Vector((.148,.02,0))),(q['high'],Vector((.33,.05,.15)),Vector((.33,.05,.15)))]:
        for obj in [group_['ground']]+group_['layers']+sum(group_['particles'],[])+sum(group_['edges'],[]):obj.location=newbase+(BASE[obj][0]-base)/.44*.80;obj.scale=BASE[obj][2]/.44*.80
        # 粒数・位置は変更しない。後編と同じ青と直径で密/疎を見分けやすくする。
        particle_mat=d.mat('d1a_fuji_readable_particles_gpt_20261026','#236d9c',.50)
        for obj in sum(group_['particles'],[]):
            obj.scale*=2.8
            if not obj.data.materials or obj.data.materials[0]!=particle_mat:
                obj.data.materials.clear();obj.data.materials.append(particle_mat)
    for (root,objs,top),pos,arrow in zip(FUJI_MINI,[(.148,-.07,.01),(.33,.015,.16)],FUJI_ARROWS):
        root.location=pos;show_tree(root,True);arrow.location=Vector(pos)+Vector((0,-.012,.214*.42+.006));show_tree(arrow,answer)

def apply_state(t):
    reset();cam,st,X=scene(t);k=cue_at(t)['key']
    for group in X['groups']:visible(group)
    if X['machine']:
        mx.apply_machine(M,st,t)
        if X.get('assembly') is not None:
            reveal=X['assembly']
            for obj in M['all']:
                group=next((name for name,objs in M['groups'].items() if obj in objs),'core')
                threshold={'mine':0,'core':.12,'rod':.38,'tank':.62,'jack':.72,'drain':.82}.get(group,.9)
                if reveal<threshold:d.show(obj,False)
        # 前編では機械の外装を開けない。
        assert st['covers']==1.0
        apply_cylinder_xray(t)
    if 'mine' in X['groups']:mine_state(t)
    if 'horse' in X['groups']:gin_state(t)
    if X.get('horseclose'):
        # 寄りの間も全物体の位置は計算済み。画面外の坑内の桶/吊綱だけは
        # 可視化せず、巻き取りの語で初めて同じ時刻の全景へ見せる。
        for bucket,water in EX['gin']['buckets']:show_tree(bucket,False)
        for obj in EX['gin']['hanging']:d.show(obj,False)
    if 'can' in X['groups']:can_state(t,last=X.get('last',False))
    if 'balloon' in X['groups']:balloon_state(t)
    if 'straw' in X['groups']:straw_state(t)
    if 'air' in X['groups']:layers_state(t)
    if 'weights' in X['groups']:
        weights_state(t)
        if k=='air:inside':
            for name in ['one','hundred']:show_tree(P['weights'][name],False)
            for name in ['up','down']:show_tree(P['weights'][name],t>=W(k,'体の内側'))
    if 'twocans' in X['groups']:twins_state(t)
    if 'twins' in X['groups']:
        for arrows in P['twins']['arrows']:
            for o in arrows:show_tree(o,t>=W('size:wide','増えて'))
    if 'area' in X['groups']:
        q=P['area'];a=W('size:area','手のひら')
        for i,o in enumerate(q['palms']):show_tree(o,t>=a+i*.06)
        d.show(q['diameter'],W('size:53','直径')<=t<a);d.show(q['radius'],W('size:53','半径')<=t<a)
    if 'heavy' in X['groups']:heavy_state(t,X.get('resting',False))
    if X.get('restinghorse'):resting_horse_state(t)
    if 'hemi' in X['groups']:hemi_state(t,with_pump='airpump' in X['groups'],last=X.get('last',False))
    if 'airpump' in X['groups']:airpump_state(t)
    if 'fuji' in X['groups']:place_fuji(False)
    if X.get('ginboard'):
        P['score'].location=(-.25,.14,.32);P['score'].scale=(.45,)*3
    if X.get('seams'):
        for obj in EX['seams']:d.show(obj,True)
    d.dg['make'].data.body='1' if t>=W('gin:closed','閉じて（得点板 水 1−0 人）') else '0';d.dg['brk'].data.body='0'
    for who,tip,yaw,pitch,sc in X['hands']:small_hand(who,tip,yaw,pitch,sc)
    set_camera(cam);return cam,st,X
def apply(t):
    global _VIS
    _VIS={}
    try:result=apply_state(t)
    finally:
        pending=_VIS;_VIS=None
        for obj,v in pending.items():show_now(obj,v)
        bpy.context.view_layer.update()
    return result
def pose_at(t):return scene(t)[0]

# ---------------- honest semantic subject selection for the new parts ----------------
def gin_primary(ns,cue,t):
    if t<W('gin:drum','太い胴'):
        return {'name':'柱のまわりを歩く同じ馬','objects':[EX['gin']['horse']['root']],
                'reason':'桶をまだ見せない寄り。馬自体の幅を測り、胴や草地で水増ししない'}
    if t<W('gin:drum','巻き取られて'):
        return {'name':'太い胴と巻き取られる綱','objects':[EX['gin']['drum']]+EX['gin']['coils'],
                'reason':'声の胴/綱に合わせた中間寄り。画面外へ延びる経路や桶を主役の幅へ足さない'}
    return {'name':'馬が回す胴・2本の綱・2つの桶','objects':EX['gin']['primary'],
            'reason':'同じ連続動作の巻取り経路。草地や机は幅へ加えない'}
SHOTQA_PRIMARY={k:gin_primary for k in ['gin:horse','gin:drum','gin:closed','mine:mio']}
SHOTQA_PRIMARY['nc:piston']=lambda ns,cue,t: (
    {'name':'筒の上から見るピストンのふた','objects':[M['piston']],
     'reason':'閉じた筒の上からふた自体を見せる。筒壁で幅を水増ししない'}
    if t<W('nc:piston','シーソー') else
    {'name':'シーソーの木の腕','objects':[M['beam']],
     'reason':'声が腕へ移るため主役も腕へ切り替える'})
SHOTQA_PRIMARY.update({k:{'name':'空気ポンプのふた・入口弁・出口弁・取っ手','objects':EX['airpump']['primary'],'reason':'2枚の黄いろの扉が今回の主役。銅の球で幅を水増ししない'} for k in ['guericke:build','guericke:pull','guericke:push']})
SHOTQA_PRIMARY['size:rest']={'name':'冒頭で働いた馬の休息','objects':[EX['gin']['horse']['root']],'reason':'比較用の4頭や地面の大きさを加えず、同じ馬が寝ころぶ姿だけを見る'}

def full_face(t):
    c=cue_at(t);f=c.get('face')
    if not f or f.get('small'):return False
    if f.get('at'):
        pp=PT[c['subtitle']];needle=d.norm(f['at']);m=re.search(re.sub('[ウオ]','[ウオ]',needle),pp['s']);assert m,(c['key'],needle);a=c['start']+pp['t'][m.start()]
    else:a=c['start']+f.get('a',0)*(c['end']-c['start'])
    return a+.25<=t<=c['end']-.15
def rate(t):
    k=cue_at(t)['key']
    if full_face(t):return 0
    if k in ['gin:horse','gin:drum','gin:closed','can:fill','can:flip','guericke:pull','guericke:push','cyl:likecan','nc:install']:return 1
    return 2
def plan(j):
    t=j/FPS;oldj=reuse_frame(t)
    if oldj is not None:return ('copy',oldj)
    if rate(t)==1:return ('render',None)
    if full_face(t):
        c=cue_at(t);base=math.ceil((c['start']+.3)*FPS)
        while base<j and not full_face(base/FPS):base+=1
        return ('dup',base) if base<j else ('render',None)
    base=j-j%2
    return ('render',None) if base==j or cue_at(base/FPS)['key']!=cue_at(t)['key'] else ('dup',base)
ANC_NAMES=list(mx.anchors(M,base_state()).keys())+['can','fuji','gin','airpump','inlet','outlet']
def anchors_now(t,st):
    j=reuse_frame(t)
    if j is not None:return {nm:OLD_ANCHORS[nm][min(j,len(OLD_ANCHORS[nm])-1)] if nm in OLD_ANCHORS else [0,0,False] for nm in ANC_NAMES}
    points=mx.anchors(M,st);points.update(can=Vector((.265,-.12,.05)),fuji=Vector((.33,.05,.16)),gin=EX['gin']['center'],airpump=EX['airpump']['p'],inlet=EX['airpump']['inlet'].location,outlet=EX['airpump']['outlet'].location)
    return {nm:d.project(points[nm]) for nm in ANC_NAMES}

def challenge_setup():
    reset();visible('fuji');place_fuji(False);set_camera(CAM['fuji']);bpy.context.view_layer.update()
def answer_state():
    reset();visible('fuji');place_fuji(True);set_camera(CAM['fuji']);bpy.context.view_layer.update()
def problem():
    bpy.context.window.scene=d.SC;out=output_dir('/problem');fmt=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='PNG'
    try:
        for filename,fn in [('挑戦.png',challenge_setup),('答え.png',answer_state)]:
            if os.path.exists(out+'/'+filename) and not A.force:continue
            fn();d.SC.render.filepath=out+'/'+filename;bpy.ops.render.render(write_still=True,scene=d.SC.name)
    finally:d.SC.render.image_settings.file_format=fmt

# ---------------- 孤立cacheへの再開可能な書き出し ----------------
_LIBC=ctypes.CDLL('/usr/lib/libSystem.B.dylib')
def clone(src,dst):
    if os.path.realpath(src)==os.path.realpath(dst):raise ValueError('元の画へは書き込まない')
    if not os.path.realpath(dst).startswith(os.path.realpath(A.cache)+os.sep):raise ValueError('孤立cache外への書き出しは禁止')
    if os.path.lexists(dst):os.remove(dst)
    if _LIBC.clonefile(src.encode(),dst.encode(),0)!=0:shutil.copy2(src,dst)
def render_key():
    source=b''.join(open(f,'rb').read() for f in [os.path.abspath(__file__),mx.__file__,ax.__file__,ext.__file__])
    return hashlib.sha256(source+json.dumps(DATA,sort_keys=True).encode()).hexdigest()[:20]
def old_points(j):
    return {nm:OLD_ANCHORS[nm][min(j,len(OLD_ANCHORS[nm])-1)] if nm in OLD_ANCHORS else [0,0,False] for nm in ANC_NAMES}
def output_dir(suffix):
    out=os.path.abspath(A.out or A.cache+suffix)
    if not os.path.realpath(out).startswith(os.path.realpath(A.cache)+os.sep):raise ValueError('前編孤立cacheの子フォルダを --out に指定する')
    os.makedirs(out,exist_ok=True);return out
def write_meta(out,key,done,anc,**extra):
    meta={'key':key,'frames':NF,'fps':FPS,'done':sorted(done),'reuseSource':A.reuse_source,'reuseCueKeys':sorted(REUSE.keys()-REDRAW)};meta.update(extra)
    json.dump(meta,open(out+'/meta.json','w'));json.dump(anc,open(out+'/anchors-partial.json','w'))
def main():
    bpy.context.window.scene=d.SC
    if A.shot_plan:
        import desk_d1a_gate_catalog_gpt_20261026 as shotqa
        shotqa.shotqa(globals());return
    plans=[plan(j) for j in range(NF)]
    counts={x:sum(p[0]==x for p in plans) for x in ['render','copy','dup']}
    print('[d1a] コマ %d：%s'%(NF,json.dumps(counts,ensure_ascii=False)),flush=True)
    if A.dry:
        t=0.0;n=0
        while t<DATA['duration']:apply(t);t+=.2;n+=1
        challenge_setup();answer_state()
        print('[d1a] dry ok %d; 挑戦・答えは時刻に依存しない'%n,flush=True);return
    if A.plan_only:
        bycue={}
        for j,p in enumerate(plans):
            key=cue_at(j/FPS)['key'];bycue.setdefault(key,{'render':0,'copy':0,'dup':0});bycue[key][p[0]]+=1
        print(json.dumps(bycue,ensure_ascii=False,indent=1));return
    if A.times:
        out=output_dir('/blender/preview');af=out+'/anchors-partial.json';anc=json.load(open(af)) if os.path.exists(af) else {}
        for t in map(float,A.times.split(',')):
            j=round(t*FPS);assert 0<=j<NF,(t,NF);f=out+'/%05d.jpg'%j
            oldj=reuse_frame(t)
            if oldj is not None:
                if not os.path.exists(f) or A.force:clone(A.reuse_source+'/%05d.jpg'%oldj,f)
                anc[str(j)]=old_points(oldj)
            else:
                cam,st,X=apply(t);anc[str(j)]=anchors_now(t,st)
                if not os.path.exists(f) or A.force:d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name)
            print('[d1a] 試写 %.2f%s'%(t,'（一致した既存3D）' if oldj is not None else ''),flush=True)
        json.dump(anc,open(af,'w'));arr={nm:[[0,0,False] for _ in range(NF)] for nm in ANC_NAMES}
        for j,points in anc.items():
            for nm in ANC_NAMES:arr[nm][int(j)]=points[nm]
        json.dump({'fps':FPS,'frames':NF,'previewOnly':True,'anchors':arr},open(out+'/anchors.json','w'));return
    out=output_dir('/blender/desk');key=render_key();metaf=out+'/meta.json';af=out+'/anchors-partial.json'
    old=json.load(open(metaf)) if os.path.exists(metaf) else {};done=set(old.get('done',[]));anc=json.load(open(af)) if os.path.exists(af) else {}
    if old.get('key') and old['key']!=key:print('[d1a] sourceの指紋が変化。変更した区間は --force --from/--to で描き直す。',flush=True)
    if A.force:done-={j for j in done if A.start<=j/FPS<A.stop}
    indices=[j for j,p in enumerate(plans) if p[0] in ['render','copy'] and A.start<=j/FPS<A.stop]
    t0=time.time();n=0;copied=0
    for j in indices:
        if os.path.isfile(A.cache+'/STOP_RENDER_gpt_20261026'):
            write_meta(out,key,done,anc)
            print('[d1a] 中断指示を受け、描いたコマを保持して停止',flush=True)
            return
        f=out+'/%05d.jpg'%j
        if j in done and os.path.exists(f) and str(j) in anc:continue
        kind,oldj=plans[j]
        if kind=='copy':clone(A.reuse_source+'/%05d.jpg'%oldj,f);anc[str(j)]=old_points(oldj);copied+=1
        else:
            cam,st,X=apply(j/FPS);anc[str(j)]=anchors_now(j/FPS,st);d.SC.render.filepath=f;bpy.ops.render.render(write_still=True,scene=d.SC.name);n+=1
        done.add(j)
        if (n+copied)%40==0:
            write_meta(out,key,done,anc)
            print('[d1a] 描いた %d、写した %d、%.1f 秒'%(n,copied,time.time()-t0),flush=True)
    write_meta(out,key,done,anc)
    print('[d1a] 区間完了：描いた %d、写した %d、%.1f 秒'%(n,copied,time.time()-t0),flush=True)
    if A.finish:finish(plans,out,key,done,anc)
def finish(plans,out,key,done,anc):
    needed=[j for j,p in enumerate(plans) if p[0] in ['render','copy']]
    missing=[j for j in needed if j not in done or str(j) not in anc or not os.path.isfile(out+'/%05d.jpg'%j)]
    assert not missing,('まだ画が無い',len(missing),missing[:8])
    arr={nm:[] for nm in ANC_NAMES}
    for j,p in enumerate(plans):
        src=j if p[0]!='dup' else p[1]
        if p[0]=='dup':clone(out+'/%05d.jpg'%src,out+'/%05d.jpg'%j)
        for nm in ANC_NAMES:arr[nm].append(anc[str(src)][nm])
    json.dump({'fps':FPS,'frames':NF,'key':key,'anchors':arr},open(out+'/anchors.json','w'))
    write_meta(out,key,done,anc,finished=time.strftime('%Y-%m-%d %H:%M:%S'))
    poses=[tuple(round(x,9) for x in pose_at(j/FPS)) for j in range(NF)];moving=[False]+[poses[j]!=poses[j-1] for j in range(1,NF)]
    spans=[];start=None
    for j,v in enumerate(moving+[False]):
        if v and start is None:start=j/FPS
        if not v and start is not None:spans.append([start,j/FPS]);start=None
    json.dump({'frames':NF,'moving_frames':sum(moving),'moving_ratio':sum(moving)/NF,'moving_spans':spans,'top_ratio':sum(p[5]>=65 for p in poses)/NF,'copiedCueKeys':sorted(REUSE.keys()-REDRAW)},open(A.cache+'/blender/camera-motion.json','w'),indent=1)
    json.dump(poses,open(A.cache+'/blender/delivered-camera-poses_gpt_20261026.json','w'))
    print('[d1a] 仕上げ %d コマ、カメラが動く割合 %.3f'%(NF,sum(moving)/NF),flush=True)
def catalog():
    import desk_d1a_gate_catalog_gpt_20261026 as helper
    return helper.catalog(globals(),out=A.out,force=A.force)

if __name__=='__main__':
    if A.catalog:catalog()
    elif A.problem:problem()
    else:main()

