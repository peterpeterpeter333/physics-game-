"""D-1a S4, row 35 only: a readable vertical Guericke air pump.

Import is inert.  ``build(ns)`` adds only new objects/materials; ``apply(ns,t)``
is called AFTER the frozen base scene.  It hides the obsolete horizontal pump
and old copper sphere only in the three Guericke cues.  No narration, audio,
caption, old source, shared checker, or active camera is edited here.

The five transported particles are five of the eighteen original sphere
particles, not an extra stream.  Both valve doors have real bores, seats,
stationary hinge pins, fixed lugs, and rotating knuckles.  The front-cutaway
copper sphere is a smooth surface with a continuous copper rim, not a wire net.
"""

import math


PREFIX = 'd1a_s4_vertical_pump_20261028'
KEYS = ('guericke:build', 'guericke:pull', 'guericke:push')
LAYOUT = dict(cx=.080, cy=.120, bottom=.230, top=.680, radius=.060,
              inner_radius=.0585, sphere=(-.118, .120, .655), sphere_radius=.0725,
              port_z=.642, port_y=.035, ports=(.048, .112),
              leaf_radius=.0220, bore_radius=.0205, housing_radius=.0308,
              hinge_offset=.0224, max_angle=math.radians(75),
              piston_high=.575, rod_length=.365)


def _smooth(u):
    u = max(0., min(1., u))
    return u * u * (3. - 2. * u)


def _progress(t, start, duration):
    return _smooth((t - start) / max(1e-9, duration))


def _tree(root):
    out = [root]
    for child in root.children:
        out.extend(_tree(child))
    return out


def _material(d, name, color, rough=.35, metal=0., alpha=1., emit=0.):
    mat = d.mat(PREFIX + '_' + name, color, rough, metal=metal, alpha=alpha,
                emit=color if emit else None, strength=emit, unique=True)
    node = d.principled(mat)
    if 'Specular IOR Level' in node.inputs:
        node.inputs['Specular IOR Level'].default_value = .18
    return mat


def _mesh(d, name, vertices, faces, mat):
    import bpy
    mesh = bpy.data.meshes.new(PREFIX + '_' + name + '_mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = d.link(bpy.data.objects.new(PREFIX + '_' + name, mesh))
    d.put(obj, mat)
    return obj


def _tube(d, name, start, end, outer, inner, mat, sides=48):
    from mathutils import Vector
    start, end = Vector(start), Vector(end)
    length = (end - start).length
    vs = []
    for z in (-length / 2, length / 2):
        for r in (outer, inner):
            vs.extend((r * math.cos(2 * math.pi * i / sides),
                       r * math.sin(2 * math.pi * i / sides), z)
                      for i in range(sides))
    fs = []
    for i in range(sides):
        j = (i + 1) % sides
        fs.extend(((i, j, 2*sides+j, 2*sides+i),
                   (sides+i, 3*sides+i, 3*sides+j, sides+j),
                   (i, sides+i, sides+j, j),
                   (2*sides+i, 2*sides+j, 3*sides+j, 3*sides+i)))
    obj = _mesh(d, name, vs, fs, mat)
    obj.location = (start + end) / 2
    obj.rotation_euler = (end-start).to_track_quat('Z', 'Y').to_euler()
    for poly in obj.data.polygons:
        poly.use_smooth = poly.index % 4 < 2
    return obj


def _hemisphere(d, name, center, radius, mat, front=False):
    """A smooth hemispherical skin; the cut boundary is the XZ great circle."""
    n, m = 48, 24
    vs = []
    sign = -1 if front else 1
    for j in range(m + 1):
        lat = -math.pi/2 + math.pi*j/m
        for i in range(n + 1):
            phi = math.pi*i/n
            vs.append((center[0] + radius*math.cos(lat)*math.cos(phi),
                       center[1] + sign*radius*math.cos(lat)*math.sin(phi),
                       center[2] + radius*math.sin(lat)))
    fs = [(j*(n+1)+i, j*(n+1)+i+1, (j+1)*(n+1)+i+1,
           (j+1)*(n+1)+i) for j in range(m) for i in range(n)]
    obj = _mesh(d, name, vs, fs, mat)
    for face in obj.data.polygons:
        face.use_smooth = True
    return obj


def _valve(d, ext, name, x, inward, mats):
    """Front-facing XZ leaf: inlet swings +Y; outlet swings -Y.

    The inlet leaf is downstream of its seat, the outlet leaf upstream, so
    neither has to rotate *through* a smaller seat bore to open.
    """
    from mathutils import Vector
    g = LAYOUT
    y, z = g['port_y'], g['port_z']
    sense = 1 if inward else -1
    leaf_y = y + sense*.0024
    seat = _tube(d, name+'_seat', (x, y-.0015, z), (x, y+.0015, z),
                 .029, g['bore_radius'], mats['seat'])
    rim = d.torus(PREFIX+'_'+name+'_rim', .026, .0015, (x,y-.002,z),
                  mats['metal'], rot=(math.pi/2,0,0))
    # The large transparent vestibule leaves physical room for the hinge and
    # finite-thickness door.  The actual valve seat is the smaller annulus.
    housing = _tube(d, name+'_clear_housing', (x,y-.056,z), (x,.125,z),
                    .0325, g['housing_radius'], mats['glass'])
    pivot = d.empty(PREFIX+'_'+name+'_hinge',
                    (x,leaf_y,z+g['hinge_offset']))
    panel = d.cyl(PREFIX+'_'+name+'_yellow_door', g['leaf_radius'], .0016,
                   (0,0,-g['hinge_offset']), mats[name],
                   rot=(math.pi/2,0,0), verts=48)
    panel.parent = pivot
    # Make parent local coordinates explicit, rather than retaining a stale
    # matrix_parent_inverse from an already animated namespace.
    panel.location = (0,0,-g['hinge_offset'])
    panel.matrix_parent_inverse.identity()
    pin = ext.rod(PREFIX+'_'+name+'_fixed_hinge_pin',
                  (x-.028,leaf_y,z+g['hinge_offset']),
                  (x+.028,leaf_y,z+g['hinge_offset']), .0022, mats['metal'])
    fixed = [seat, rim, housing, pin]
    for side in (-1,1):
        lug = d.box(PREFIX+'_'+name+'_fixed_lug', (.007,.010,.007),
                     (x+side*.024,y,z+g['hinge_offset']),mats['metal'],bevel=.001)
        fixed.append(lug)
    knuckle = d.cyl(PREFIX+'_'+name+'_moving_knuckle', .0035, .025,
                    (0,0,0), mats['metal'],rot=(0,math.pi/2,0),verts=24)
    knuckle.parent=pivot
    knuckle.location=(0,0,0)
    knuckle.matrix_parent_inverse.identity()
    straps=[]
    for side in (-1,1):
        strap=d.box(PREFIX+'_'+name+'_leaf_strap',(.003,.0019,.018),
                     (side*.009,0,-.0075),mats[name],bevel=.0004)
        strap.parent=pivot
        strap.location=(side*.009,0,-.0075)
        strap.matrix_parent_inverse.identity()
        straps.append(strap)
    return dict(root=pivot,panel=panel,seat=seat,pin=pin,housing=housing,
                sense=sense,center=Vector((x,leaf_y,z)),
                pivot=Vector((x,leaf_y,z+g['hinge_offset'])),
                fixed=fixed,moving=[panel,knuckle]+straps,
                detail_primary=[seat,rim,pin,knuckle,panel]+straps,
                width_primary=[panel])


def _sphere_points():
    g=LAYOUT
    return [(g['sphere'][0]+(i%3-1)*.031,
             g['sphere'][1]-.023+(i%2)*.005,
             g['sphere'][2]+(i//3-2.5)*.018) for i in range(18)]


def design_summary():
    """CPU-only design figures, NOT actual projected-mesh PASS evidence."""
    g=LAYOUT
    width=.44
    height=width*1920/1080
    sphere_volume=4*math.pi*g['sphere_radius']**3/3
    stroke=sphere_volume*(5/13)/(math.pi*g['inner_radius']**2)
    return dict(frame_world_width=width,frame_world_height=height,
                body_height=(g['top']-g['bottom'])/height,
                body_width=2*g['radius']/width,
                sphere_width=2*g['sphere_radius']/width,
                each_door_width=2*g['leaf_radius']/width,
                stroke=stroke,sphere_volume=sphere_volume,
                displaced_volume=math.pi*g['inner_radius']**2*stroke,
                ideal_remaining_particles=13,
                warning='Design only; confirm real evaluated vertices and occlusion in Blender.')


def build(ns):
    """Build new geometry; register no global model, render, or camera changes.

    Return/store ns['S4_PUMP'].  Parent must add ``all`` to its own MANAGED/
    BASE/CHILDREN after build, and call apply after frozen baseapply.
    """
    import bpy
    from mathutils import Vector
    if ns.get('S4_PUMP'):
        return ns['S4_PUMP']
    d,ext=ns['d'],ns['ext']
    before=set(bpy.data.objects)
    g=LAYOUT
    mats={
        'glass':_material(d,'glass','#bfdde6',.19,alpha=.10),
        'sphere_front':_material(d,'sphere_clear_front','#c98956',.25,alpha=.025),
        'copper':_material(d,'sphere_copper','#b87544',.32,metal=.55),
        'metal':_material(d,'metal','#a8b7bd',.31,metal=.55),
        'seat':_material(d,'seat','#d7bd7c',.32,metal=.35),
        'piston':_material(d,'piston','#71828a',.38,metal=.35),
        'leather':_material(d,'leather','#8d5b3d',.50),
        'wood':_material(d,'wood','#98623c',.55),
        'white':_material(d,'white_air','#f4f7f6',.48,emit=.20),
        'empty':_material(d,'empty_space','#9ed3e0',.4,alpha=.075,emit=.16),
        'inlet':_material(d,'inlet_yellow','#ffd247',.31,emit=.12),
        'outlet':_material(d,'outlet_yellow','#ffd247',.31,emit=.12),
    }
    body=_tube(d,'barrel',(g['cx'],g['cy'],g['bottom']),
               (g['cx'],g['cy'],g['top']),g['radius'],g['inner_radius'],mats['glass'],72)
    # Actual side bores into the upper chamber.  Cutter rear ends stop inside
    # the chamber, so they do not puncture its rear wall.
    for index,x in enumerate(g['ports']):
        cutter=d.cyl(PREFIX+'_bore_cutter%d'%index,.0325,.095,
                      (x,.0775,g['port_z']),None,rot=(math.pi/2,0,0),verts=48)
        modifier=body.modifiers.new('real_front_bore_%d'%index,'BOOLEAN')
        modifier.operation='DIFFERENCE'
        modifier.solver='EXACT'
        modifier.object=cutter
        bpy.context.view_layer.objects.active=body
        body.select_set(True)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.data.objects.remove(cutter,do_unlink=True)
    rings=[d.torus(PREFIX+'_barrel_rim%d'%i,g['radius'],.002,
                    (g['cx'],g['cy'],z),mats['metal'])
           for i,z in enumerate((g['bottom'],g['top']))]
    top=d.cyl(PREFIX+'_closed_top',g['radius'],.003,
               (g['cx'],g['cy'],g['top']+.0015),mats['metal'])
    bottom=_tube(d,'bottom_rod_bore',(g['cx'],g['cy'],g['bottom']-.003),
                 (g['cx'],g['cy'],g['bottom']),g['radius'],.0048,mats['metal'])
    piston=d.cyl(PREFIX+'_piston',g['inner_radius']-.0003,.008,
                  (g['cx'],g['cy'],g['piston_high']),mats['piston'])
    seal=d.torus(PREFIX+'_piston_leather',g['inner_radius']-.001,.0013,
                  (g['cx'],g['cy'],g['piston_high']),mats['leather'])
    rod=d.cyl(PREFIX+'_piston_rod',.0035,g['rod_length'],
               (g['cx'],g['cy'],g['piston_high']-g['rod_length']/2),mats['metal'])
    handle=d.box(PREFIX+'_lower_handle',(.094,.018,.016),
                  (g['cx'],g['cy'],g['piston_high']-g['rod_length']),
                  mats['wood'],bevel=.004)
    valves={name:_valve(d,ext,name,x,name=='inlet',mats)
            for name,x in zip(('inlet','outlet'),g['ports'])}
    sphere_back=_hemisphere(d,'copper_sphere_back',g['sphere'],g['sphere_radius'],mats['copper'])
    sphere_front=_hemisphere(d,'clear_sphere_front',g['sphere'],g['sphere_radius'],mats['sphere_front'],True)
    sphere_rim=d.torus(PREFIX+'_copper_sphere_cut_rim',g['sphere_radius'],.0023,
                       g['sphere'],mats['copper'],rot=(math.pi/2,0,0))
    plinth=d.box(PREFIX+'_sphere_platform',(.17,.15,.012),
                 (g['sphere'][0],g['sphere'][1]+.025,g['sphere'][2]-g['sphere_radius']-.006),
                 mats['wood'],bevel=.003)
    legs=[]
    for x in (-.065,.065):
        legs.append(d.box(PREFIX+'_platform_leg',(.009,.012,.572),
                           (g['sphere'][0]+x,g['sphere'][1]+.060,.286),mats['wood'],bevel=.001))
    sphere_port=Vector(g['sphere'])+Vector((.051,-.051,0))
    inlet_path=[sphere_port,Vector((-.025,.002,.655)),
                Vector((g['ports'][0],.002,g['port_z'])),
                Vector((g['ports'][0],g['port_y']-.005,g['port_z'])),
                Vector((g['ports'][0],.115,g['port_z']))]
    pipes=[]
    for i,(a,b) in enumerate(zip(inlet_path[:4],inlet_path[1:4])):
        pipes.append(_tube(d,'short_sphere_pipe%d'%i,a,b,.010,.0085,mats['glass']))
    # Only the wide vestibule reaches each door.  No narrow pipe intrudes into
    # the door's swept volume.
    outlet_path=[Vector((g['ports'][1],.115,g['port_z'])),
                 Vector((g['ports'][1],g['port_y'],g['port_z'])),
                 Vector((g['ports'][1],g['port_y']-.056,g['port_z'])),
                 Vector((.180,g['port_y']-.056,.700))]
    pipes.append(_tube(d,'outlet_spout',outlet_path[-2],outlet_path[-1],.010,.0085,mats['glass']))
    particles=[d.sphere(PREFIX+'_original_air_%02d'%i,.0055,p,mats['white'],seg_=16,ring=8)
               for i,p in enumerate(_sphere_points())]
    glow=d.cyl(PREFIX+'_new_empty_volume',g['inner_radius']-.004,1,
                (g['cx'],g['cy'],.6),mats['empty'])
    arrows=[ext.arrow(PREFIX+'_flow_arrow%d'%i,(0,0,0),(0,0,.065),.0045)
            for i in range(2)]
    objects=sorted(set(bpy.data.objects)-before,key=lambda o:o.name)
    old=list(dict.fromkeys(list(ns['G'].get('airpump',[]))+list(ns['G'].get('hemi',[]))))
    if ns.get('EX',{}).get('airpump'):
        old+=list(ns['EX']['airpump'].get('old_objects',[]))
    role=dict(body=[body,top,bottom]+rings,
              sphere=[sphere_back,sphere_front,sphere_rim],
              inlet_door=valves['inlet']['width_primary'],
              outlet_door=valves['outlet']['width_primary'],
              inlet_detail=valves['inlet']['detail_primary'],
              outlet_detail=valves['outlet']['detail_primary'],
              piston=[piston,seal],handle=[handle],pipes=pipes,
              air_particles=particles,
              whole=[body,top,bottom,piston,seal,rod,handle,sphere_back,sphere_front,sphere_rim]
                    +rings+pipes+sum((v['fixed']+v['moving'] for v in valves.values()),[]))
    camera=dict(type='ORTHO',position=[0,-1.4,.410],target=[0,.12,.410],
                ortho_scale=.44*1920/1080,sensor_fit='VERTICAL',
                shift_x=0.,shift_y=0.,use_dof=False)
    q=dict(all=objects,old=list(dict.fromkeys(old)),mats=mats,body=body,
           piston=piston,seal=seal,rod=rod,handle=handle,valves=valves,
           particles=particles,initial_points=_sphere_points(),glow=glow,
           arrows=arrows,inlet_path=inlet_path,outlet_path=outlet_path,
           roles=role,camera=camera,design=design_summary(),sphere_count=18,
           plinth=plinth,legs=legs)
    q['macro_cameras']={name:_macro_definition(valve) for name,valve in valves.items()}
    ns['S4_PUMP']=q
    for obj in objects:
        d.show(obj,False)
    return q


def _macro_definition(valve):
    center=list(valve['center'])
    # The oblique camera is a new real 3D viewpoint; the overview stays fixed.
    return dict(type='ORTHO',position=[center[0]+.105,center[1]-.170,center[2]+.045],
                target=[center[0],center[1]+.012,center[2]+.009],
                ortho_scale=.100,sensor_fit='VERTICAL',shift_x=0.,shift_y=0.,
                use_dof=False,resolution=[480,480],source='real_3d_camera')


def timing(ns):
    W=ns['W']
    inlet_open=W('guericke:pull','押し開けて')
    inlet_close=W('guericke:push','入口の弁は閉じ')
    outlet_open=W('guericke:push','出口の弁')
    return dict(flash=W('guericke:build','弁という'),
                pull=W('guericke:pull','取っ手を引く'),
                empty=W('guericke:pull','空いた所ができ'),
                inlet_open=inlet_open,inlet_open_end=inlet_open+.35,
                inlet_macro=[inlet_open,inlet_open+1.5],
                push=W('guericke:push','取っ手を押す'),
                inlet_close=inlet_close,inlet_close_end=inlet_close+.35,
                inlet_close_first_closed_frame=math.ceil((inlet_close+.35)*30-1e-8),
                inlet_close_first_closed_time=math.ceil((inlet_close+.35)*30-1e-8)/30,
                outlet_open=outlet_open,outlet_open_end=outlet_open+.35,
                outlet_macro=[outlet_open,outlet_open+1.5])


def _path(points,u):
    from mathutils import Vector
    points=[Vector(p) for p in points]
    lengths=[(b-a).length for a,b in zip(points,points[1:])]
    distance=max(0.,min(1.,u))*sum(lengths)
    for a,b,length in zip(points,points[1:],lengths):
        if distance<=length:
            return a.lerp(b,distance/max(1e-9,length))
        distance-=length
    return points[-1].copy()


def _arrow(root,start,end):
    from mathutils import Vector
    start,end=Vector(start),Vector(end)
    root.location=start
    root.rotation_euler=(end-start).to_track_quat('Z','Y').to_euler()
    root.scale=(1,1,(end-start).length/.065)


def anchors(ns):
    """Analytical actual leaf centers; no stale dependency-graph transforms."""
    from mathutils import Vector
    q=ns['S4_PUMP']
    result=dict(airpump=Vector((LAYOUT['cx'],LAYOUT['cy'],.455)),
                pumpbody=Vector((LAYOUT['cx'],LAYOUT['cy'],.455)),
                pumpsphere=Vector(LAYOUT['sphere']),pumphandle=q['handle'].location.copy())
    for name,valve in q['valves'].items():
        angle=valve['root'].rotation_euler.x
        delta=Vector((0,LAYOUT['hinge_offset']*math.sin(angle),
                      -LAYOUT['hinge_offset']*math.cos(angle)))
        result[name]=valve['pivot']+delta
        result[name+'_seat']=valve['center'].copy()
    return result


def measurement_definitions(ns):
    q=ns['S4_PUMP']
    return {
        'body':dict(name='縦ポンプの筒そのもの',objects=q['roles']['body'],
                    minWidth=.25,minHeight=.55,exclude='管・球・棒・取っ手・手を足さない'),
        'sphere':dict(name='銅の球そのもの',objects=q['roles']['sphere'],
                      minWidth=.30,inFrame=True,exclude='台・管・白粒を足さない'),
        'inlet_door':dict(name='入口の黄色い扉1枚',objects=q['roles']['inlet_door'],
                          minWidth=.08,exclude='弁座・蝶番・札を足さない'),
        'outlet_door':dict(name='出口の黄色い扉1枚',objects=q['roles']['outlet_door'],
                           minWidth=.08,exclude='弁座・蝶番・札を足さない'),
        'whole':dict(name='球・管・筒・弁・取っ手の実物全体',objects=q['roles']['whole'],
                     inFrame=True,exclude='台・手・矢印・白粒を足さない'),
    }


def apply(ns,t):
    """Seek-safe, deterministic row-35 override; does not set any camera."""
    from mathutils import Vector
    q=ns['S4_PUMP']
    d=ns['d']
    key=ns['cue_at'](t)['key']
    active=key in KEYS
    for obj in q['all']:
        d.show(obj,active)
    if not active:
        return dict(active=False,roles=q['roles'],anchors={},camera=None)
    for obj in q['old']:
        d.show(obj,False)
    g=LAYOUT
    tm=timing(ns)
    pulled=_progress(t,tm['pull'],1.8)
    # A tiny initial pressure stroke starts at the spoken push.  The large
    # displacement waits for the outlet to open, never drives through a shut
    # outlet, and finishes before the final retained-13-particle shot.
    pushed=.02*_progress(t,tm['push'],.35)+.98*_progress(t,tm['outlet_open_end'],1.65)
    z=g['piston_high']-q['design']['stroke']*pulled*(1-pushed)
    q['piston'].location=(g['cx'],g['cy'],z)
    q['seal'].location=(g['cx'],g['cy'],z)
    q['rod'].location=(g['cx'],g['cy'],z-g['rod_length']/2)
    q['handle'].location=(g['cx'],g['cy'],z-g['rod_length'])
    inlet=_progress(t,tm['inlet_open'],.35)*(1-_progress(t,tm['inlet_close'],.35))
    outlet=_progress(t,tm['outlet_open'],.35)
    for name,amount in (('inlet',inlet),('outlet',outlet)):
        valve=q['valves'][name]
        valve['root'].rotation_euler.x=valve['sense']*g['max_angle']*amount
        start=tm['flash']+(.5 if name=='outlet' else 0)
        pulse=math.sin(math.pi*(t-start)/.5) if start<=t<=start+.5 else 0
        node=d.principled(q['mats'][name])
        node.inputs['Emission Strength'].default_value=.12+2.3*pulse
    empty=_progress(t,tm['empty'],.3)
    bottom=z+.006
    depth=max(.001,g['top']-.012-bottom)
    q['glow'].location=(g['cx'],g['cy'],bottom+depth/2)
    q['glow'].scale=(1,1,depth)
    d.show(q['glow'],empty>0)
    # Exactly 13 particles never leave the sphere.  The other five travel from
    # the sphere through the actual inlet and later through the actual outlet.
    for i,obj in enumerate(q['particles']):
        if i<13:
            obj.location=q['initial_points'][i]
            obj.scale=(1,1,1)
            continue
        lane=i-13
        chamber=Vector((g['cx']+(lane-2)*.012,g['cy']-.005,
                        max(z+.018,g['top']-.073+lane*.009)))
        a=tm['inlet_open_end']+.025+lane*.135
        u=max(0.,min(1.,(t-a)/.80))
        start=Vector(q['initial_points'][i])
        if t<a:
            point=start
        elif u<1:
            point=_path([start]+q['inlet_path']+[chamber],_smooth(u))
        else:
            point=chamber
        out_at=tm['outlet_open_end']+.025+lane*.125
        out=max(0.,min(1.,(t-out_at)/.95))
        if t>=out_at:
            point=_path([chamber]+q['outlet_path'],_smooth(out))
        obj.location=point
        # It disperses only once outside the final spout, not in a solid wall.
        fade=1-_progress(t,out_at+.95,.25)
        obj.scale=(fade,)*3
        d.show(obj,fade>.001)
    # Report the actual current particle-center count inside the sphere, not
    # the number whose transfer clocks have started while still in the sphere.
    sphere_center=Vector(g['sphere'])
    q['sphere_count']=sum((obj.location-sphere_center).length<g['sphere_radius']
                           for obj in q['particles'])
    _arrow(q['arrows'][0],(.027,-.006,.608),(.027,-.006,.535))
    _arrow(q['arrows'][1],(.158,-.046,.650),(.203,-.046,.714))
    for root,visible in ((q['arrows'][0],inlet>.08 and t<tm['inlet_close']),
                         (q['arrows'][1],outlet>.08)):
        for obj in _tree(root):
            d.show(obj,visible)
    tip=Vector((g['cx']+.036,g['cy']-.013,z-g['rod_length']+.003))
    if ns.get('small_hand'):
        ns['small_hand']('kai',tip,yaw=-65,pitch=-5,scale=.30)
    macros=[]
    for name in ('inlet','outlet'):
        span=tm[name+'_macro']
        if span[0]<=t<span[1]:
            macros.append(dict(name=name,start=span[0],end=span[1],
                               camera=q['macro_cameras'][name],
                               objects=q['roles'][name+'_detail'],
                               anchor=anchors(ns)[name]))
    return dict(active=True,roles=q['roles'],anchors=anchors(ns),
                camera=q['camera'],macro=macros,timing=tm,
                doorangles=dict(inlet=inlet*g['max_angle'],outlet=-outlet*g['max_angle']),
                piston_z=z,sphere_count=q['sphere_count'],transported_particle_count=5,
                measurements=measurement_definitions(ns))


def set_camera(ns,definition,camera=None):
    """Optional explicit parent call.  Never called by import/build/apply.

    Restore the base camera type/sensor_fit/shift/DOF after the row-35 interval;
    merely calling an old perspective pose function will not restore ORTHO.
    """
    from mathutils import Vector
    camera=camera or ns['d'].CAM
    camera.location=definition['position']
    camera.rotation_euler=(Vector(definition['target'])-camera.location).to_track_quat('-Z','Y').to_euler()
    camera.data.type=definition.get('type','ORTHO')
    camera.data.ortho_scale=definition['ortho_scale']
    camera.data.sensor_fit=definition.get('sensor_fit','VERTICAL')
    camera.data.shift_x=definition.get('shift_x',0.)
    camera.data.shift_y=definition.get('shift_y',0.)
    camera.data.dof.use_dof=definition.get('use_dof',False)
    return camera
