"""D-1a S3-only visible mechanisms; immutable original files are imported.

No script, narration, subtitle, shared material or original geometry is edited.
The can root is already correctly inverted. A sealed convex bottom makes that
fact readable; the actual open rim remains below the water surface.
"""
import math
import bpy
from mathutils import Matrix, Vector
import desk_lib as d
import desk_lib_d1 as ext
import desk_lib_d1b_s4_gpt_20261027 as mx


def _material(name, color, rough=.34, metal=0.0, alpha=1.0, emit=0.0):
    material = d.mat('d1a_s3_' + name, color, rough, metal=metal,
                     alpha=alpha, emit=color if emit else None,
                     strength=emit, unique=True)
    node = d.principled(material)
    if 'Specular IOR Level' in node.inputs:
        node.inputs['Specular IOR Level'].default_value = .22
    return material


def _mesh(name, vertices, faces, material, loc=(0, 0, 0)):
    mesh = bpy.data.meshes.new(name + '_mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = d.link(bpy.data.objects.new(name, mesh))
    obj.location = loc
    d.put(obj, material)
    return obj


def _tree(root):
    result = [root]
    for child in root.children:
        result.extend(_tree(child))
    return result


def _show_tree(root, visible):
    for obj in _tree(root):
        d.show(obj, visible)


def _rod_pose(obj, start, end):
    start, end = Vector(start), Vector(end)
    vector = end - start
    obj.location = (start + end) / 2
    obj.rotation_euler = vector.to_track_quat('Z', 'Y').to_euler()
    original = obj.get('d1a_s3_mesh_length')
    if original is None:
        zs = [v.co.z for v in obj.data.vertices]
        original = max(zs) - min(zs)
        obj['d1a_s3_mesh_length'] = original
    obj.scale = (1, 1, vector.length / max(1e-8, original))


def _tube(name, start, end, outer, inner, material, n=32, end_radii=None):
    """An open bore, including end annuli and an actual inner wall."""
    start, end = Vector(start), Vector(end)
    length = (end - start).length
    vertices = []
    for side, z in enumerate((-length / 2, length / 2)):
        radii = (outer, inner) if side == 0 or end_radii is None else end_radii
        for radius in radii:
            vertices.extend((radius * math.cos(2 * math.pi * i / n),
                             radius * math.sin(2 * math.pi * i / n), z)
                            for i in range(n))
    faces = []
    for i in range(n):
        j = (i + 1) % n
        faces.extend(((i, j, 2 * n + j, 2 * n + i),
                      (n + i, 3 * n + i, 3 * n + j, n + j),
                      (i, n + i, n + j, j),
                      (2 * n + i, 2 * n + j, 3 * n + j, 3 * n + i)))
    obj = _mesh(name, vertices, faces, material, (start + end) / 2)
    obj.rotation_euler = (end - start).to_track_quat('Z', 'Y').to_euler()
    for face in obj.data.polygons:
        face.use_smooth = face.index % 4 < 2
    return obj


def _convex_can_bottom(can):
    """One sealed mesh, bulging outward; concentric pressing is not a hole."""
    p = Vector(can['p'])
    material = _material('sealed_can_bottom', '#a6b2b6', .39, metal=.58)
    n, rings = 64, 9
    vertices = [(0, 0, -.0434)]
    for j in range(1, rings + 1):
        radius = .0302 * j / rings
        z = -.04 - .0034 * (1 - (radius / .0302) ** 2)
        vertices.extend((radius * math.cos(2 * math.pi * i / n),
                         radius * math.sin(2 * math.pi * i / n), z)
                        for i in range(n))
    faces = [(0, 1 + (i + 1) % n, 1 + i) for i in range(n)]
    for j in range(rings - 1):
        a, b = 1 + j * n, 1 + (j + 1) * n
        faces.extend((a + i, a + (i + 1) % n, b + (i + 1) % n, b + i)
                     for i in range(n))
    cap = _mesh('d1a_s3_sealed_convex_bottom', vertices, faces, material, p)
    for face in cap.data.polygons:
        face.use_smooth = True
    d.parent(cap, can['root'])
    cap_objects = [cap]
    # Shallow stamped ridges lie on the same convex sealed plate.
    for i, radius in enumerate((.008, .0185, .0275)):
        z = -.04 - .0034 * (1 - (radius / .0302) ** 2)
        ring = d.torus('d1a_s3_bottom_pressed_ring%d' % i, radius, .00038,
                       p + Vector((0, 0, z)), material)
        d.parent(ring, can['root'])
        cap_objects.append(ring)
    return cap_objects


def _build_can(P, G):
    before = set(bpy.data.objects)
    can = P['can']['can']
    caps = _convex_can_bottom(can)
    obsolete_caps = [o for o in can['rim'] if '_base' in o.name]
    old_arrows = list(P['can']['arrows'])
    arrows = [ext.arrow('d1a_s3_can_air_arrow%d' % i, (0, 0, 0),
                        (0, 0, .06), .0028) for i in range(3)]
    P['can']['arrows'] = arrows
    water = _material('smooth_pale_water', '#8ed3ec', .20, alpha=.16)
    waters = [o for o in G['can'] if o.name.startswith('d1_dishwater')]
    for obj in waters:
        obj.active_material = water
    ripplemat = _material('water_seal_ripple', '#78bedc', .28, alpha=.88)
    ripples = [d.torus('d1a_s3_mouth_water_ring%d' % i,
                        .031 + .0035 * i, .00038,
                        (.265, -.12, .01165), ripplemat)
               for i in range(2)]
    tongs = P['can']['tongs']
    tong_bars = sorted((o for o in tongs.children if o.type == 'MESH'),
                       key=lambda o: o.location.y)
    rest = {o: o.location.copy() for o in caps}
    rest_scale = {o: o.scale.copy() for o in tong_bars}
    added = sorted(set(bpy.data.objects) - before, key=lambda o: o.name)
    G['can'].extend(added)
    return dict(capobjs=caps, cap=rest, ripples=ripples,
                old_caps=obsolete_caps, old_arrows=old_arrows,
                arrows=arrows, water=water, water_objects=waters,
                mouth_local=Vector((0, 0, .04)), water_z=.0115,
                tong_bars=tong_bars, tong_scale=rest_scale,
                handtip=Vector((0, 0, 0)), all=added,
                pressure_start=152.8)


def _make_valve(name, center, into):
    """Same real-hole/hinge family as the B pump; front-facing in side view.

    Plane-normal +Y means the inlet opens into the chamber; -Y means the
    outlet opens away from it. Both free hinge roots use local-Y rotation.
    """
    mats = dict(metal=_material(name + '_metal', '#a6b8bc', .32, metal=.52),
                cutmetal=_material(name + '_cutmetal', '#b8c6c9', .35, alpha=.14),
                inner=_material(name + '_bore', '#39484c', .52),
                seat=_material(name + '_seat', '#d6bd77', .32, metal=.4),
                yellow=_material(name + '_yellow', '#ffd246', .34, emit=.12),
                pin=_material(name + '_pin', '#dae3e3', .28, metal=.6))
    frame = d.empty(name + '_frame')
    valve = mx._hinged_valve(name, (0, 0, 0), .024, 0, .0115,
                              -.015, .030, .026, .0022, .0015, mats)
    for obj in valve['fixed'] + [valve['root']]:
        d.parent(obj, frame)
    frame.location = center
    frame.rotation_euler.x = -math.pi / 2 if into else math.pi / 2
    valve.update(frame=frame, mats=mats, into=into,
                 world_center=Vector(center), maximum_angle=1.18)
    return valve


def _barrel_with_real_front_ports(name, p, radius, length, material, ports):
    shell = _tube(name, p, Vector(p) + Vector((length, 0, 0)),
                   radius, radius - .001, material, n=72)
    # The two valve housings meet actual bores, not an unbroken glass wall.
    for i, x in enumerate(ports):
        cutter = d.cyl(name + '_own_bore_cutter%d' % i, .0215, .055,
                       (x, p[1] - radius, p[2]), None,
                       rot=(math.pi / 2, 0, 0), verts=40)
        modifier = shell.modifiers.new('real_front_port%d' % i, 'BOOLEAN')
        modifier.operation = 'DIFFERENCE'
        modifier.solver = 'EXACT'
        modifier.object = cutter
        bpy.context.view_layer.objects.active = shell
        shell.select_set(True)
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.data.objects.remove(cutter, do_unlink=True)
    return shell


def _build_pump(P, G, EX):
    before = set(bpy.data.objects)
    old = EX['airpump']
    old_objects = list(old['objects'])
    for obj in old_objects:
        d.show(obj, False)
    p = Vector((.22, -.05, .077))
    radius, length = .033, .22
    glass = _material('airpump_clear_shell', '#b7d9e6', .18, alpha=.12)
    pipe_glass = _material('airpump_clear_pipe', '#b2d7e6', .20, alpha=.19)
    metal = _material('airpump_metal', '#9bafb5', .34, metal=.5)
    dark = _material('airpump_piston', '#6f8288', .38, metal=.25)
    leather = _material('airpump_leather', '#91634a', .52)
    wood = d.wood('d1a_s3_airpump_handle_wood', '#9a6234', '#7b4a24')
    white = _material('airpump_air_particles', '#edf4f6', .54, emit=.16)
    ports = [p.x + .025, p.x + .073]
    shell = _barrel_with_real_front_ports('d1a_s3_airpump_glass', p,
                                          radius, length, glass, ports)
    inlet_end = d.cyl('d1a_s3_airpump_closed_left_end', radius, .0025,
                       p + Vector((-.00125, 0, 0)), metal,
                       rot=(0, math.pi / 2, 0))
    rod_end = mx.previous._plate_with_hole('d1a_s3_airpump_rod_end',
                    radius, .003, metal, p + Vector((length, 0, 0)),
                    hole_radius=.0041, n=48)
    rod_end.rotation_euler.y = math.pi / 2
    barrel_rims = [d.torus('d1a_s3_airpump_barrel_rim%d' % i,
                           radius, .0014, p + Vector((x, 0, 0)),
                           metal, rot=(0, math.pi / 2, 0))
                   for i, x in enumerate((0, length))]
    piston_x = p.x + .115
    piston = d.cyl('d1a_s3_airpump_piston', .0308, .006,
                    (piston_x, p.y, p.z), dark, rot=(0, math.pi / 2, 0))
    seal = d.torus('d1a_s3_airpump_piston_leather', .0305, .00085,
                   (piston_x, p.y, p.z), leather, rot=(0, math.pi / 2, 0))
    rod = ext.rod('d1a_s3_airpump_rod', (piston_x, p.y, p.z),
                   (piston_x + .17, p.y, p.z), .0035, metal)
    handle = d.box('d1a_s3_airpump_handle', (.012, .068, .014),
                    (piston_x + .17, p.y, p.z), wood, bevel=.004)
    front_y = p.y - .048
    inlet_valve = _make_valve('d1a_s3_airpump_inlet',
                               (ports[0], front_y, p.z), True)
    outlet_valve = _make_valve('d1a_s3_airpump_outlet',
                                (ports[1], front_y, p.z), False)
    valve_tubes = []
    for i, x in enumerate(ports):
        valve_tubes.append(_tube('d1a_s3_airpump_valve_housing%d' % i,
                        (x, front_y, p.z), (x, p.y - .025, p.z),
                        .023, .0215, pipe_glass))
    inlet_mouth = Vector((ports[0], front_y - .043, p.z))
    # Separate open tube upstream of the inlet: no solid rod in its bore.
    sphere = Vector(P['hemi']['center'])
    inlet_path = [sphere + Vector((0, 0, .045)),
                   sphere + Vector((0, -.055, .045)),
                   Vector((ports[0], front_y - .043, sphere.z + .045)),
                   inlet_mouth,
                   Vector((ports[0], front_y - .003, p.z)),
                   Vector((ports[0], p.y - .020, p.z)),
                   Vector((p.x + .095, p.y, p.z))]
    pipe_objects = []
    for i, (a, b) in enumerate(zip(inlet_path[:4], inlet_path[1:4])):
        pipe_objects.append(_tube('d1a_s3_airpump_sphere_pipe%d' % i,
                            a, b, .0068, .0056, pipe_glass))
    # Wide, transparent vestibules give a rotating leaf physical clearance.
    # The inlet's narrow upstream pipe joins the front of its real seat.
    inlet_vest = _tube('d1a_s3_airpump_inlet_vestibule',
                         inlet_mouth, (ports[0], front_y - .0011, p.z),
                         .0068, .0056, pipe_glass, end_radii=(.023, .0215))
    out_pos = Vector((ports[1], front_y, p.z))
    out_end = out_pos + Vector((0, -.049, 0))
    outlet_vest = _tube('d1a_s3_airpump_outlet_vestibule',
                          out_pos + Vector((0, -.0011, 0)), out_end,
                          .023, .0215, pipe_glass)
    particles = [d.sphere('d1a_s3_airpump_air%d' % i, .0033,
                           (0, 0, -5), white, seg_=12, ring=6)
                 for i in range(20)]
    sphere_air = [d.sphere('d1a_s3_sphere_air%d' % i, .0025,
                            (0, 0, -5), white, seg_=10, ring=5)
                  for i in range(18)]
    glow_mat = _material('airpump_empty_space', '#81c7e2', .38,
                          alpha=.06, emit=.12)
    glow = d.cyl('d1a_s3_airpump_empty_space', .028, 1,
                  p, glow_mat, rot=(0, math.pi / 2, 0))
    flowarrows = [ext.arrow('d1a_s3_airpump_flow_arrow%d' % i,
                             (0, 0, 0), (0, 0, .06), .0019)
                   for i in range(2)]
    objects = sorted(set(bpy.data.objects) - before, key=lambda o: o.name)
    q = dict(p=p, radius=radius, length=length, shell=shell,
             piston=piston, piston_seal=seal, rod=rod, handle=handle,
             inlet=inlet_valve['root'], outlet=outlet_valve['root'],
             inlet_panel=inlet_valve['panel'], outlet_panel=outlet_valve['panel'],
             inlet_valve=inlet_valve, outlet_valve=outlet_valve,
             inlet_end=inlet_end, inlet_seat=inlet_valve['seat'],
             rod_end=rod_end, outlet_pos=out_pos, inlet_path=inlet_path,
             outlet_path=[Vector((ports[1], p.y, p.z)), out_pos, out_end],
             inlet_port=Vector((ports[0], front_y, p.z)),
             outlet_port=Vector((ports[1], front_y, p.z)),
             particles=particles, sphere_air=sphere_air, objects=objects,
             old_objects=old_objects, glow=glow, flowarrows=flowarrows,
             flow_nodes=dict(inlet=inlet_path, outlet=[out_pos, out_end]),
             sphere_center=sphere,
             sphere_old_port=[P['hemi']['valve'], P['hemi']['valvepipe']],
             piston_rest=p.x + .115,
             stroke=.070, rod_span=.17, handtip=Vector((0, 0, 0)),
             primary=[shell, inlet_end, rod_end, piston, seal, rod, handle]
                    + inlet_valve['detail_primary'] + outlet_valve['detail_primary'],
             body_primary=[shell, inlet_end, rod_end],
             inlet_primary=inlet_valve['detail_primary'],
             outlet_primary=outlet_valve['detail_primary'],
             context=pipe_objects + valve_tubes + [inlet_vest, outlet_vest],
             bore_radius=.0215, piston_halfdepth=.003)
    EX['airpump'] = q
    G['airpump'] = objects
    return q


def _build_airhead(P):
    before = set(bpy.data.objects)
    ground = P['air']['ground']
    center = Vector((.40, .15, .009))
    root = d.empty('d1a_s3_air_column_person', center)
    cloth = _material('air_person_cloth', '#507486', .6)
    skin = _material('air_person_skin', '#d9aa8c', .55)
    dark = _material('air_person_shoes', '#594a3b', .6)
    parts = [d.cyl('d1a_s3_air_person_body', .0055, .014,
                     center + Vector((0, 0, .018)), cloth, verts=16),
             d.sphere('d1a_s3_air_person_head', .006,
                       center + Vector((0, 0, .032)), skin, seg_=16, ring=8)]
    for sign in (-1, 1):
        parts.append(d.box('d1a_s3_air_person_leg', (.0038, .0048, .011),
                            center + Vector((sign * .003, 0, .006)), dark,
                            bevel=.001))
        parts.append(ext.rod('d1a_s3_air_person_arm',
                             center + Vector((sign * .005, 0, .023)),
                             center + Vector((sign * .008, 0, .014)),
                             .0017, cloth))
    for obj in parts:
        d.parent(obj, root)
    objs = sorted(set(bpy.data.objects) - before, key=lambda o: o.name)
    layer_objects = (P['air']['layers'] + sum(P['air']['particles'], [])
                     + sum(P['air']['edges'], []))
    return dict(root=root, objs=objs, primary=parts,
                headtip=center + Vector((0, 0, .038)), ground=ground,
                layer_rest={obj: obj.location.copy() for obj in layer_objects},
                layer_offset=.036)


def build(P, G, M, EX):
    if EX.get('d1a_s3_corrections') is not None:
        return EX['d1a_s3_corrections']
    before = set(bpy.data.objects)
    result = dict(can=_build_can(P, G), ap=_build_pump(P, G, EX),
                  airhead=_build_airhead(P))
    result['all'] = sorted(set(bpy.data.objects) - before, key=lambda o: o.name)
    result['obsolete'] = (result['can']['old_caps'] + result['can']['old_arrows']
                           + result['ap']['old_objects'])
    EX.setdefault('all', []).extend(o for o in result['all'] if o not in EX['all'])
    EX['d1a_s3_corrections'] = result
    for obj in result['all'] + result['obsolete']:
        d.show(obj, False)
    return result


def apply_can(COR, P, t, flip, crush, last=False):
    q = COR['can']
    can = P['can']['can']
    for obj in q['old_caps']:
        d.show(obj, False)
    for root in q['old_arrows']:
        _show_tree(root, False)
    for obj in q['capobjs']:
        obj.location = q['cap'][obj] + Vector((0, 0, .020 * crush))
        d.show(obj, True)
    # No inherited noise/normal textures and no shared water material changes.
    for obj in q['water_objects']:
        obj.active_material = q['water']
    for i, obj in enumerate(q['ripples']):
        scale = 1 + .025 * math.sin(t * 3.2 + i * 2)
        obj.scale = (scale, scale, 1)
        obj.location = (.265, -.12, .01165 + i * .00005)
        d.show(obj, flip > .98 and not last)
    # Match the actual can root, not a stale matrix_world during this apply.
    transform = (Matrix.Translation(can['root'].location)
                  @ can['root'].rotation_euler.to_matrix().to_4x4())
    for sign, obj in zip((-1, 1), q['tong_bars']):
        tip = transform @ Vector((sign * .0325, 0, 0))
        grip = transform @ Vector((sign * .006, -.105, .012))
        axis = grip - tip
        obj.location = (tip + grip) / 2
        obj.rotation_euler = axis.to_track_quat('X', 'Z').to_euler()
        obj.scale = q['tong_scale'][obj].copy()
        obj.scale.x *= axis.length / .11
    q['handtip'] = transform @ Vector((0, -.108, .012))
    # The existing scene supplies timing; this default is the exact DATA word.
    pressure = d.sm((t - q['pressure_start']) / .5)
    top_z = can['root'].location.z + .04 - .020 * crush
    center = Vector(can['root'].location)
    starts = [center + Vector((-.095, -.006, 0)),
              center + Vector((.095, -.006, 0)),
              Vector((center.x, center.y - .002, top_z + .065))]
    ends = [center + Vector((-.031, -.006, 0)),
            center + Vector((.031, -.006, 0)),
            Vector((center.x, center.y - .002, top_z + .005))]
    for root, a, b in zip(q['arrows'], starts, ends):
        vector = b - a
        root.location = a
        root.rotation_euler = vector.to_track_quat('Z', 'Y').to_euler()
        root.scale = (pressure, pressure, pressure * vector.length / .06)
        _show_tree(root, pressure > .01 and not last)
    return q['handtip']


def apply_pump(q, t, v, iopen, oopen):
    """Run after legacy airpump_state; retain its normalized motion timing.

    Return the real handle contact so the scene can place its existing hand
    after this function instead of following the legacy piston location.
    """
    p = q['p']
    for obj in q['old_objects']:
        d.show(obj, False)
    for obj in q['sphere_old_port']:
        d.show(obj, False)
    px = q['piston_rest'] + q['stroke'] * d.clamp(v)
    q['piston'].location = (px, p.y, p.z)
    q['piston_seal'].location = (px, p.y, p.z)
    _rod_pose(q['rod'], (px, p.y, p.z), (px + q['rod_span'], p.y, p.z))
    q['handle'].location = (px + q['rod_span'], p.y, p.z)
    q['handtip'] = q['handle'].location + Vector((.003, -.02, .01))
    for valve, value in ((q['inlet_valve'], iopen), (q['outlet_valve'], oopen)):
        valve['root'].rotation_euler = (0, -valve['maximum_angle'] * d.clamp(value), 0)
        d.set_emit(valve['mats']['yellow'], .12 + .35 * max(0, math.sin(t * 2)) * value,
                   '#ffd246')
    empty_left = p.x + .010
    empty_right = px - q['piston_halfdepth'] - .002
    length = max(.0001, empty_right - empty_left)
    q['glow'].location = ((empty_left + empty_right) / 2, p.y, p.z)
    q['glow'].scale = (1, 1, length)
    d.show(q['glow'], v > .025 and iopen < .7)
    # Both particles and arrows follow real holes. No particles cross a shut leaf.
    inlet_on, outlet_on = iopen > .08, oopen > .08
    # The center-line sphere has radius 3.3 mm. A leaf at a small angle still
    # covers that path: -.015 + .030*cos(1.18*u) must be below -.0033.
    # Full opening clears it; do not draw particles through a moving solid.
    inlet_flow, outlet_flow = iopen > .999, oopen > .999
    for i, obj in enumerate(q['particles']):
        lane = i % 10
        phase = (t * .43 + lane * .101) % 1
        if i < 10:
            obj.location = _path(q['inlet_path'], phase)
            d.show(obj, inlet_flow)
        else:
            start = Vector(((empty_left + empty_right) / 2, p.y, p.z))
            path = [start] + q['outlet_path']
            obj.location = _path(path, phase)
            d.show(obj, outlet_flow)
    # The sphere loses particles while a pull admits air. It does not empty at once.
    sphere_volume = 4 * math.pi * .05 ** 3 / 3
    stroke_volume = math.pi * (q['radius'] - .001) ** 2 * q['stroke']
    keep = round(len(q['sphere_air']) * sphere_volume / (sphere_volume + stroke_volume))
    # 'depletion' is the scene's cumulative pull, not the instantaneous v that
    # returns to zero on the push. Gas cannot leave before the inlet opens.
    # The scene may replace the exact supplied-word default with W(...).
    transfer = (d.clamp(q.get('depletion', 1.0))
                * d.sm((t - q.get('depletion_start', 331.06)) / 1.8))
    keep_now = len(q['sphere_air']) - round((len(q['sphere_air']) - keep) * transfer)
    q['sphere_keep'] = keep_now
    for i, obj in enumerate(q['sphere_air']):
        theta = i * 2.399963
        radius = .014 + (i % 4) * .006
        obj.location = q['sphere_center'] + Vector((radius * math.cos(theta),
                        radius * math.sin(theta), .010 * math.sin(i)))
        d.show(obj, i < keep_now)
    for root, start, end, visible in (
        (q['flowarrows'][0], q['inlet_path'][-3] + Vector((-.006, 0, .032)),
         q['inlet_path'][-1] + Vector((-.006, 0, .032)), inlet_on),
        (q['flowarrows'][1], q['outlet_path'][0] + Vector((.008, 0, -.032)),
         q['outlet_path'][-1] + Vector((.008, 0, -.032)), outlet_on)):
        vector = end - start
        root.location = start
        root.rotation_euler = vector.to_track_quat('Z', 'Y').to_euler()
        root.scale = (1, 1, vector.length / .06)
        _show_tree(root, visible)
    return q['handtip']


def _path(points, u):
    points = [Vector(p) for p in points]
    lengths = [(b - a).length for a, b in zip(points, points[1:])]
    distance = d.clamp(u) * sum(lengths)
    for a, b, length in zip(points, points[1:], lengths):
        if distance <= length:
            return a.lerp(b, distance / max(1e-8, length))
        distance -= length
    return points[-1].copy()


def apply_airhead(COR, P, t):
    q = COR['airhead']
    _show_tree(q['root'], True)
    # Keep the ground fixed and lift the whole depicted air stack together.
    # Its original first bottom .012 becomes .048, 1 mm above the .047 head.
    # Absolute rest positions avoid accumulation on repeated/seeked applies.
    for obj, position in q['layer_rest'].items():
        obj.location = position + Vector((0, 0, q['layer_offset']))
    return q['headtip'].copy()


def hide_airhead(COR):
    _show_tree(COR['airhead']['root'], False)


def hide_pump(COR):
    for obj in COR['ap']['objects'] + COR['ap']['old_objects']:
        d.show(obj, False)


def static_dimensions():
    """CPU-only constants for independent checks; not a visual acceptance."""
    return dict(pump=dict(p=(.22, -.05, .077), length=.22, radius=.033,
                          piston_rest_x=.335, stroke=.070,
                          inlet_x=.245, outlet_x=.293,
                          body_bore_radius=.0215, valve_hole_radius=.0115,
                          panel_length=.030, panel_width=.026,
                          hinge_x=-.015, max_angle=1.18),
                can=dict(mouth_local_z=.04, bottom_local_z=-.04,
                         mouth_world_after_flip=.01, water_z=.0115,
                         crush_mouth_compensation=.010,
                         convex_bottom_bulge=.0034))
