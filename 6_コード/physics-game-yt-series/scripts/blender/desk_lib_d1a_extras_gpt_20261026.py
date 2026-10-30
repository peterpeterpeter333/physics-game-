"""前編だけの追加部品。既存ライブラリを編集せず、実際の綱・口・片方向弁を足す。"""
import math
import bpy
from mathutils import Vector
import desk_lib as d
import desk_lib_d1 as ext
import desk_lib_d1_machine_gpt_20261026 as mx


GIN_R = .0255
GIN_WIRE = .0013
GIN_SEGMENTS = 192
GIN_RING = 8
GIN_SPAN = .013


def gin_coil_length(angle_span):
    """実メッシュの中心線の長さ。円弧近似でなく192本の弦を足す。"""
    return GIN_SEGMENTS * math.hypot(2 * GIN_R * math.sin(abs(angle_span) / (2 * GIN_SEGMENTS)),
                                     GIN_SPAN / GIN_SEGMENTS)


def gin_geometry(v):
    """胴/巻綱/桶の共通状態。左右それぞれの綱の全長を保存する。"""
    base = 6 * math.pi
    initial = gin_coil_length(base)
    lo, hi = 0.0, .260 / GIN_R * 1.1
    for _ in range(48):
        mid = (lo + hi) / 2
        if gin_coil_length(base + mid) - initial > .260:
            hi = mid
        else:
            lo = mid
    angle = -(lo + hi) / 2 * max(0.0, min(1.0, v))
    return dict(angle=angle, lift=gin_coil_length(base-angle)-initial,
                drop=initial-gin_coil_length(base+angle), initial_length=initial,
                coil_lengths=(gin_coil_length(base-angle), gin_coil_length(base+angle)))


def gin_helix_vertices(center, side, angle):
    """胴に留まった端だけ回し、自由端は固定接線に必ず残す連続した巻綱。"""
    phase = -math.pi/2 if side == 0 else math.pi/2
    sign = 1 if side == 0 else -1
    start = phase - sign * 6 * math.pi + angle
    delta = phase - start
    norm = math.hypot(GIN_R * delta, GIN_SPAN)
    result = []
    for i in range(GIN_SEGMENTS + 1):
        u = i / GIN_SEGMENTS
        a = start + delta * u
        ca, sa = math.cos(a), math.sin(a)
        radial = (ca, sa, 0)
        binormal = (-GIN_SPAN/norm*sa, GIN_SPAN/norm*ca, -GIN_R*delta/norm)
        c = (center[0]+GIN_R*ca, center[1]+GIN_R*sa, center[2]+.064+side*.020+GIN_SPAN*u)
        for j in range(GIN_RING):
            b = 2*math.pi*j/GIN_RING
            result.append(tuple(c[k]+GIN_WIRE*(radial[k]*math.cos(b)+binormal[k]*math.sin(b)) for k in range(3)))
    return result


def _tube_mesh(name, vertices, rings, material):
    faces = []
    for i in range(rings - 1):
        for j in range(GIN_RING):
            k, n = i*GIN_RING+j, i*GIN_RING+(j+1)%GIN_RING
            faces.append((k, n, n+GIN_RING, k+GIN_RING))
    faces += [tuple(reversed(range(GIN_RING))), tuple((rings-1)*GIN_RING+j for j in range(GIN_RING))]
    mesh = bpy.data.meshes.new(name+'_mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = d.link(bpy.data.objects.new(name, mesh))
    d.put(obj, material)
    for face in mesh.polygons:
        face.use_smooth = face.index < (rings-1)*GIN_RING
    return obj


def update_gin_coils(q, angle):
    for side, obj in enumerate(q['coils']):
        vertices = gin_helix_vertices(q['center'], side, angle)
        obj.data.vertices.foreach_set('co', [value for p in vertices for value in p])
        obj.data.update()


def build_extras(P, G, M):
    mats = M['mats']
    before_all = set(bpy.data.objects)
    E = {}
    # 馬が回す巻き胴。元の小さな綱一本の模型は隠し、新しい組だけを G['horse'] にする。
    before = set(bpy.data.objects)
    center = Vector((-.48, .10, .32))
    platform = d.box('d1a_gin_platform', (.232, .19, .020), (-.485, .10, .31),
                     d.mat('d1a_gin_grass', '#73934b', .65), bevel=.004)
    pole = d.cyl('d1a_gin_pole', .010, .100, center + Vector((0, 0, .050)), mats['wood'])
    drum = d.empty('d1a_gin_drum', center + Vector((0, 0, .080)))
    barrel = d.cyl('d1a_gin_barrel', .024, .042, center + Vector((0, 0, .080)), mats['wood'])
    d.parent(barrel, drum)
    for z in [.060, .1015]:
        rim = d.cyl('d1a_gin_flange', .028, .004, center + Vector((0, 0, z)), mats['iron'])
        d.parent(rim, drum)
    lever = d.box('d1a_gin_lever', (.13, .007, .007), center + Vector((.053, 0, .055)), mats['wood'], bevel=.002)
    arm = d.empty('d1a_gin_arm', center + Vector((0, 0, .055)))
    d.parent(lever, arm)
    horse = ext.horse('d1a_gin_horse', center + Vector((.081, 0, 0)), .85)
    # 回る棒が馬の背中より上で浮かないよう、同じ腕に留めた革の引き具。
    for r in (.073, .089):
        strap=d.box('d1a_gin_harness',(.002,.004,.023),center+Vector((r,0,.0445)),
                     mats['leather'],bevel=.0004)
        d.parent(strap,arm)
    rope_mat = d.mat('d1a_rope', '#8c7046', .7)
    coils = [_tube_mesh('d1a_gin_woundrope%d'%side, gin_helix_vertices(center, side, 0),
                        GIN_SEGMENTS+1, rope_mat) for side in (0, 1)]
    buckets = []; hanging = []; pulley = []; rope_paths=[];free_ropes=[];wrapped_ropes=[]
    # 転向する滑車は空中に置かず、坑口の2本の支柱と軸へ取り付ける。
    for y in [.046, .154]:
        d.box('d1a_gin_pulley_post', (.008,.008,.112), (-.388,y,.365), mats['wood'], bevel=.001)
        d.box('d1a_gin_pulley_support', (.032,.008,.008), (-.377,y,.403), mats['wood'], bevel=.001)
    ext.rod('d1a_gin_pulley_axle', (-.366,.043,.403), (-.366,.157,.403), .003, mats['iron'])
    for i, y in enumerate([.072, .128]):
        x, wheel_x, pulley_r = -.355, -.366, .011
        wheel = d.empty('d1a_gin_pulley%d'%i, (wheel_x,y,.403))
        hub = mx._plate_with_hole('d1a_gin_pulleyhub%d'%i,.0094,.0038,mats['iron'],
                                  center=(wheel_x,y,.403),hole_radius=.0032,n=48)
        hub.rotation_euler.x=math.pi/2;d.parent(hub,wheel)
        for offset in (-.0025,.0025):
            rim=mx._plate_with_hole('d1a_gin_pulleyflange%d'%i,.013,.0012,mats['iron'],
                                    center=(wheel_x,y+offset,.403),hole_radius=.0032,n=48)
            rim.rotation_euler.x=math.pi/2;d.parent(rim,wheel)
        pulley.append(wheel)
        # 胴の前後の反対接線から同じ+x方向へ出す。片方を巻くと他方はほどける。
        rope_z=.077 if i==0 else .097
        path=[center+Vector((0,(-1 if i==0 else 1)*GIN_R,rope_z)),
              center+Vector((.035,(-1 if i==0 else 1)*GIN_R,rope_z)),
              Vector((wheel_x-.022,y,.414)),Vector((wheel_x,y,.414))]
        for j,(a,b) in enumerate(zip(path,path[1:])):free_ropes.append(ext.rod('d1a_gin_rope_to_pulley%d_%d'%(i,j),a,b,.0015,rope_mat))
        # 綱が折れ曲がる二点は、実際の支柱に留めた案内環を通す。
        for j,point in enumerate(path[1:-1]):
            d.torus('d1a_gin_guide%d_%d'%(i,j),.0028,.0007,point,mats['brass'],rot=(0,math.pi/2,0))
            top=point.z-.003
            d.box('d1a_gin_guidepost%d_%d'%(i,j),(.004,.004,top-.32),
                  (point.x,point.y,(top+.32)/2),mats['wood'],bevel=.0005)
        # 上の接点から右の接点まで、実際の1/4周の綱でつなぐ。
        arc=[]
        for j in range(17):
            a=math.pi/2*(1-j/16)
            c=Vector((wheel_x+pulley_r*math.cos(a),y,.403+pulley_r*math.sin(a)))
            radial=Vector((math.cos(a),0,math.sin(a)))
            for k in range(GIN_RING):
                b=2*math.pi*k/GIN_RING
                arc.append(tuple(c+.0015*(radial*math.cos(b)+Vector((0,-1,0))*math.sin(b))))
        wrapped_ropes.append(_tube_mesh('d1a_gin_pulley_wrappedrope%d'%i,arc,17,rope_mat))
        rope_paths.append(path)
        bucket = d.empty('d1a_gin_bucket%d' % i, (x, y, .065 if i == 0 else .325))
        wall = ext.shell('d1a_gin_bucketwall%d' % i, (x, y, .053 if i == 0 else .313), .0125, .024, mats['wood'])
        # shell() bakes coordinates; parenting preserves the world transform.
        for obj in [wall] + [q for q in bpy.data.objects if q.name.startswith('d1a_gin_bucketwall%d_rim' % i)]: d.parent(obj, bucket)
        bottom = d.cyl('d1a_gin_bucketfloor%d' % i, .012, .002, (x, y, .054 if i == 0 else .314), mats['wood']); d.parent(bottom, bucket)
        water = d.cyl('d1a_gin_bucketwater%d' % i, .011, .014, (x, y, .062 if i == 0 else .322), mats['water']); d.parent(water, bucket)
        bail = d.torus('d1a_gin_bucketbail%d' % i, .010, .0014, (x, y, .081 if i == 0 else .341), mats['iron'], rot=(math.pi / 2, 0, 0)); d.parent(bail, bucket)
        rope = ext.rod('d1a_gin_hangingrope%d' % i, (x, y, .091 if i == 0 else .351), (x, y, .403), .0015, rope_mat)
        buckets.append((bucket, water)); hanging.append(rope)
    sweat = [d.sphere('d1a_gin_sweat%d' % i, .002, (0, 0, -5), mats['blue'], seg_=10, ring=5) for i in range(5)]
    dumped = [d.sphere('d1a_gin_dumpwater%d' % i, .0025, (0, 0, -5), mats['water'], seg_=10, ring=5) for i in range(12)]
    objs = list(set(bpy.data.objects) - before)
    E['gin'] = dict(center=center, platform=platform, drum=drum, arm=arm, horse=horse, buckets=buckets, hanging=hanging, pulleys=pulley, rope_paths=rope_paths, coils=coils, free_ropes=free_ropes, wrapped_ropes=wrapped_ropes, sweat=sweat, dumped=dumped, objects=objs,
                    primary=[pole, barrel, arm, horse['root']] + [q[0] for q in buckets] + hanging + pulley + coils + free_ropes + wrapped_ropes)
    G['horse'] = objs
    # 空気のポンプ：透明な横向き筒、実際に回る黄色い扉2枚、押し引きするふたと取っ手。
    before = set(bpy.data.objects)
    p = Vector((.22, -.05, .077)); length = .14; radius = .022
    verts=[];faces=[];n=48
    for x in [p.x, p.x + length]:
        for i in range(n+1):
            a=math.radians(-130+260*i/n);verts.append((x,p.y+radius*math.cos(a),p.z+radius*math.sin(a)))
    for i in range(n):faces.append((i,i+1,n+2+i,n+1+i))
    mesh=bpy.data.meshes.new('d1a_airpump_shell_mesh');mesh.from_pydata(verts,[],faces)
    shell=d.link(bpy.data.objects.new('d1a_airpump_shell',mesh));d.put(shell,mats['glass'])
    for x in [p.x,p.x+length]:d.torus('d1a_airpump_rim',radius,.002,(x,p.y,p.z),mats['brass'],rot=(0,math.pi/2,0))
    # 筒の左右端を密閉する。本当に穴のある端板で、空気は入口弁の穴だけを通る。
    inlet_end=mx._plate_with_hole('d1a_airpump_inlet_end',radius,.003,mats['brass'],center=(p.x+.005,p.y,p.z),hole_radius=.006)
    inlet_end.rotation_euler.y=math.pi/2
    inlet_seat=d.torus('d1a_airpump_inlet_seat',.0067,.0007,(p.x+.0062,p.y,p.z),mats['iron'],rot=(0,math.pi/2,0))
    rod_end=mx._plate_with_hole('d1a_airpump_rod_end',radius,.003,mats['brass'],center=(p.x+length,p.y,p.z),hole_radius=.0033)
    rod_end.rotation_euler.y=math.pi/2
    piston=d.cyl('d1a_airpump_piston',radius*.92,.005,(p.x+.025,p.y,p.z),mats['iron'],rot=(0,math.pi/2,0))
    rod=ext.rod('d1a_airpump_rod',(p.x+.025,p.y,p.z),(p.x+length+.05,p.y,p.z),.003,mats['iron'])
    handle=d.box('d1a_airpump_handle',(.010,.062,.012),(p.x+length+.05,p.y,p.z),mats['wood'],bevel=.004)
    # 空気を吸い込む口から弁まで、管が実際につながる。
    inlet_path=[Vector((.10,-.05,.118)),Vector((.145,-.05,.118)),Vector((.19,-.05,.077)),p+Vector((.007,0,0))]
    for i,(a,b) in enumerate(zip(inlet_path,inlet_path[1:])):ext.rod('d1a_airpump_inletpipe%d'%i,a,b,.004,mats['glass'])
    # 幅24mm・高さ22mm。閉じた板の隅も、開く間の厚みも半径22mmの筒内。
    # 入口の実穴半径6mmを余裕をもって覆い、板は端板と弁座の手前だけを動く。
    inlet=d.empty('d1a_airpump_inlet',p+Vector((.008,0,.0145)))
    plate=d.box('d1a_airpump_inlet_yellow',(.002,.024,.022),p+Vector((.008,0,.0035)),mats['yellow'],bevel=.0005);d.parent(plate,inlet)
    # 口の中心だけでなく半径4mmの全開口が、押し切ったピストンより左へ。
    # 管の実物は筒壁から外へ出し、空いた作動室の真ん中を固い管でふさがない。
    outlet_pos=p+Vector((.018,-.042,0))
    ext.rod('d1a_airpump_outletpipe',p+Vector((.018,-radius+.001,0)),outlet_pos,.004,mats['glass'])
    outlet=d.empty('d1a_airpump_outlet',outlet_pos+Vector((0,0,.014)))
    plate=d.box('d1a_airpump_outlet_yellow',(.030,.002,.026),outlet_pos+Vector((0,0,.001)),mats['yellow'],bevel=.0007);d.parent(plate,outlet)
    air=d.mat('d1a_airpump_air','#eef3f7',.6)
    particles=[d.sphere('d1a_airpump_air%d'%i,.0022,(0,0,-5),air,seg_=10,ring=5) for i in range(24)]
    shell_air=[d.sphere('d1a_sphere_air%d'%i,.0021,(0,0,-5),air,seg_=10,ring=5) for i in range(18)]
    objs=list(set(bpy.data.objects)-before)
    E['airpump']=dict(p=p,length=length,radius=radius,shell=shell,piston=piston,rod=rod,handle=handle,inlet=inlet,outlet=outlet,inlet_end=inlet_end,inlet_seat=inlet_seat,rod_end=rod_end,outlet_pos=outlet_pos,inlet_path=inlet_path,particles=particles,sphere_air=shell_air,objects=objs,primary=[shell,inlet_end,inlet_seat,rod_end,piston,rod,handle,inlet,outlet])
    G['airpump']=objs
    # 缶の口を通って出る白い空気と、水の口止めを指す薄い輪。
    before=set(bpy.data.objects)
    E['can_air']=[d.sphere('d1a_can_air%d'%i,.0025,(0,0,-5),air,seg_=10,ring=5) for i in range(32)]
    E['seal_ring']=d.torus('d1a_can_water_seal',.0285,.0011,(.265,-.12,.0117),d.mat('d1a_seal_blue','#6fb3e0',.35,emit='#6fb3e0',strength=.25))
    G['can_extra']=list(set(bpy.data.objects)-before)
    # 前編の最後の予告だけで光る、実際の手前のふたの継ぎ目。
    # 外装を透けさせたり開いたりせず、同じ部品の縁に線を置く。
    before=set(bpy.data.objects)
    seam_mat=d.mat('d1a_seam_preview_gold','#ffd23f',.35,emit='#ffd23f',strength=2.5)
    seams=[];L=M['L']
    for name,r,z0,z1 in [('cylinder',L['CR']+.0008,L['CB'],L['CT']),('kettle',L['KR']+.0008,L['K0'],L['K1'])]:
        for angle in [220,320]:
            a=math.radians(angle);x=L['BX']+r*math.cos(a);y=L['CY']+r*math.sin(a)
            seams.append(ext.rod('d1a_seam_%s_side'%name,(x,y,z0),(x,y,z1),.00065,seam_mat))
        for z in [z0,z1]:
            for j in range(16):
                a=math.radians(220+100*j/16);b=math.radians(220+100*(j+1)/16)
                seams.append(ext.rod('d1a_seam_%s_edge'%name,(L['BX']+r*math.cos(a),L['CY']+r*math.sin(a),z),(L['BX']+r*math.cos(b),L['CY']+r*math.sin(b),z),.00065,seam_mat))
    E['seams']=seams;E['seam_material']=seam_mat
    # 右の白い蒸気を、同じ粒のまま小さな青い水滴へ変えてから落とす。
    # 共通の白い材質を変更せず、前編専用の材質/形状キーだけを持たせる。
    white=tuple(d.rgb('#f4e8cc'));blue=tuple(d.rgb('#237cb5'));silver=tuple(d.rgb('#c7cdd0'))
    materials=[];shapes=[]
    for i,obj in enumerate(P['twocans']['particles'][1]):
        material=d.mat('d1a_condensation_drop%d'%i,'#f4e8cc',.32)
        obj.data.materials.clear();obj.data.materials.append(material);materials.append(material)
        obj.shape_key_add(name='Basis');key=obj.shape_key_add(name='CondensedWater')
        for vertex in key.data:
            x,y,z=vertex.co;u=max(-1.0,min(1.0,z/.003))
            narrow=.48*(1-.4*max(0.0,u))
            vertex.co=(x*narrow,y*narrow,z*.85+.0015*max(0.0,u)**3)
        shapes.append(key)
    pool=d.cyl('d1a_condensation_water_film',.0285,.0012,(.27,-.12,.0112),
                d.mat('d1a_condensation_water_blue','#237cb5',.28,alpha=.88),verts=64)
    G['twocans'].append(pool)
    focus_material=d.mat('d1a_steam_can_focus','#c7cdd0',.32,metal=.40)
    P['twocans']['cans'][1]['rim'][1].active_material=focus_material
    E['condensation']=dict(materials=materials,shapes=shapes,pool=pool,
                           white=white,blue=blue,silver=silver,focus_material=focus_material)
    E['all']=list(set(bpy.data.objects)-before_all)
    return E


def set_rod(obj,a,b):
    a,b=Vector(a),Vector(b);v=b-a
    obj.location=(a+b)/2;obj.rotation_euler=v.to_track_quat('Z','Y').to_euler();obj.dimensions.z=max(.0001,v.length)


def path_point(points,u):
    points=[Vector(p) for p in points];lengths=[(b-a).length for a,b in zip(points,points[1:])];distance=max(0,min(1,u))*sum(lengths)
    for a,b,L in zip(points,points[1:],lengths):
        if distance<=L:return a.lerp(b,distance/max(1e-8,L))
        distance-=L
    return points[-1]
