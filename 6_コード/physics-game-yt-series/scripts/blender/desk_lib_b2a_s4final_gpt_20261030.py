"""B-2 前編 S4 最終直し専用。元の S4 は不変、新規一体型の部品集。

Import this module after the caller has initialized ``desk_lib``.  Factories do
not create a room, camera, lights, text or animation.  All measurements are m.
Every model has root / objects / parts / anchors / bounds.  Anchors and bounds
are root-local; world_anchor() resolves an anchor after the root is positioned.
State functions are absolute, deterministic and preserve the external root pose.
"""
import math
import bpy
from mathutils import Vector, Matrix, Euler
from mathutils.bvhtree import BVHTree
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


# Resting joint coordinates form a recognisable folded Z in the X-Z plane.
# They are public so the caller and independent checker can inspect the pose.
FROG_S4_LAYOUT = {
    'hip': (-.140, .025, .190),
    'knee': (-.015, .012, .165),
    'ankle': (-.100, -.014, .082),
    'nerve_radius': .0180,
    'rod_radius': .0123,
    'leg_offset': (0, 0, .017),
    'recommended_camera': {'elevation_degrees': 25, 'azimuth_degrees': 0,
                           'body_width_fraction': .86},
}


def frog_leg(name='b2a_frog'):
    """One volumetric toy hind leg, folded thigh/knee/shin/foot; no torso.

    The green silhouette is a thick Z, not an inflated straight line. The entire
    lower leg and the three spreading toes rotate about the real knee. Camera
    size/area criteria must still be measured on actual render projections.
    """
    before, root = _begin(name)
    m = materials()
    hip = Vector(FROG_S4_LAYOUT['hip'])
    knee_point = Vector(FROG_S4_LAYOUT['knee'])
    ankle_point = Vector(FROG_S4_LAYOUT['ankle'])

    thigh = d.sphere(name+'_thigh', 1, (hip+knee_point)*.5, m['green'],
                     scale=(.105, .060, .092), seg_=40, ring=24)
    thigh.rotation_euler = (knee_point-hip).to_track_quat('X', 'Z').to_euler()
    knee = d.sphere(name+'_knee', .0473, knee_point, m['greenlight'],
                    scale=(1.05, .96, 1.0), seg_=32, ring=20)
    pivot = d.empty(name+'_knee_hinge', knee_point)

    shin_vector = ankle_point-knee_point
    shin = d.sphere(name+'_shin', 1, (ankle_point+knee_point)*.5, m['green'],
                    scale=(.052, .0559, shin_vector.length*.5+.016),
                    seg_=36, ring=24)
    shin.rotation_euler = shin_vector.to_track_quat('Z', 'Y').to_euler()
    ankle = d.empty(name+'_ankle_hinge', ankle_point)
    ankle_joint = d.sphere(name+'_ankle_joint', .034, ankle_point,
                           m['greenlight'], scale=(1.0, 1.08, 1.0),
                           seg_=32, ring=20)

    foot_end = Vector((.125, -.034, .072))
    foot = d.sphere(name+'_foot', 1, (ankle_point+foot_end)*.5,
                    m['greenlight'], scale=(.130, .052, .058),
                    seg_=40, ring=24)
    foot.rotation_euler = (foot_end-ankle_point).to_track_quat('X', 'Z').to_euler()
    toes, pads = [], []
    toe_centers = [(.151, -.067, .072), (.169, -.034, .068),
                   (.150, .003, .071)]
    pad_centers = [(.190, -.067, .072), (.207, -.034, .068),
                   (.189, .003, .071)]
    for i, (center, pad_center) in enumerate(zip(toe_centers, pad_centers)):
        toe = d.sphere(name+'_toe_'+str(i), 1, center, m['greenlight'],
                       scale=(.045, .0155, .016), seg_=28, ring=16)
        pad = d.sphere(name+'_toe_pad_'+str(i), .012, pad_center,
                       m['greenlight'], scale=(1, .90, .90), seg_=24, ring=16)
        d.parent(toe, ankle); d.parent(pad, ankle)
        toes.append(toe); pads.append(pad)
    d.parent(shin, pivot)
    d.parent(ankle, pivot)
    d.parent(ankle_joint, ankle)
    d.parent(foot, ankle)

    # A broad ivory nerve descends from the exposed end into the muscular thigh.
    # Its position and both metal contacts stay fixed while the knee moves.
    nerve_points = [(-.185, -.070, .241), (-.160, -.064, .235),
                    (-.138, -.055, .217), (-.119, -.052, .197),
                    (-.100, -.057, .190)]
    nerve = curve(name+'_white_nerve', nerve_points, m['nerve'],
                  FROG_S4_LAYOUT['nerve_radius'])
    nerve_tip = d.sphere(name+'_nerve_tip', .0185, nerve_points[0],
                         m['nerve'], seg_=28, ring=16)
    signal_material = _mat('frog_signal_white', '#fff9e9', .40,
                           emit='#fff9e9', strength=1.0)
    pulse = d.sphere(name+'_nerve_signal', .0075, nerve_points[0],
                     signal_material, seg_=16, ring=12)
    d.show(pulse, False)

    # Track a point on the actual final toe-pad mesh, not a guessed bbox corner.
    # The sphere scale has already been applied by desk_lib.sphere().
    tracking_object = pads[1]
    tracking_vertex = max(range(len(tracking_object.data.vertices)),
                          key=lambda i: tracking_object.data.vertices[i].co.x)
    bpy.context.view_layer.update()
    toe_rest = tracking_object.matrix_world @ tracking_object.data.vertices[tracking_vertex].co
    body = [thigh, knee, shin, ankle_joint, foot, *toes, *pads]
    model = _finish(name, before, root,
                    {'thigh': thigh, 'knee': knee, 'knee_hinge': pivot,
                     'ankle_hinge': ankle, 'ankle_joint': ankle_joint,
                     'shin': shin, 'foot': foot, 'toes': toes, 'toe_pads': pads,
                     'nerve': nerve, 'nerve_tip': nerve_tip, 'pulse': pulse,
                     'nerve_points': nerve_points, 'body_objects': body,
                     'knee_rest': knee_point.copy(), 'toe_rest': toe_rest.copy(),
                     'tracking_object': tracking_object,
                     'tracking_vertex_index': tracking_vertex},
                    {'nerve': nerve_points[1], 'nerve_end': nerve_points[0],
                     'muscle': (-.075, -.047, .175), 'hip': hip,
                     'knee': knee_point, 'ankle': ankle_point, 'toe': toe_rest,
                     'center': (-.005, -.015, .137)},
                    ((-.205, -.091, .015), (.252, .081, .290)))
    model['geometry_note'] = {
        'shape': 'volumetric folded Z: thigh right, shin down-left, foot right',
        'knee_axis': 'local Y, negative rotation raises the distal toe',
        'knee_degrees_at_full_strength': 30,
        'nerve_radius_m': FROG_S4_LAYOUT['nerve_radius'],
        'toe_rest_actual_mesh_point': list(toe_rest),
        'recommended_camera': dict(FROG_S4_LAYOUT['recommended_camera']),
        'projection_acceptance': 'Not pre-certified; measure body height/area, '
                                 'tube widths and actual distal movement in scene.',
    }
    return model


def frog_kick(model, u=0.0, strength=1.0, signal=None, degrees=None):
    q = model['parts']
    angle = math.radians(30 if degrees is None else float(degrees))*_clamp(u)*_clamp(strength)
    q['knee_hinge'].rotation_euler.y = -angle
    q['ankle_hinge'].rotation_euler.y = 0.0
    # Same knee pivot as the mesh hierarchy; this analytic local anchor is also
    # independently checkable against foot_tip_world() on the real toe-pad mesh.
    pivot = q['knee_rest']
    turn = Matrix.Rotation(-angle, 4, 'Y')
    model['anchors']['toe'] = pivot + turn @ (q['toe_rest']-pivot)
    if signal is not None:
        value = _clamp(signal)
        points = q['nerve_points']
        index = min(len(points)-2, int(value*(len(points)-1)))
        q['pulse'].location = Vector(points[index]).lerp(
            Vector(points[index+1]), value*(len(points)-1)-index)
        d.show(q['pulse'], 0 < value < 1)
    else:
        d.show(q['pulse'], False)


def frog_experiment(name='b2a_frog_experiment', same_metal=False):
    before, root = _begin(name)
    m = materials()
    board = d.box(name+'_board', (.48, .36, .016), (0, 0, .008),
                   _mat('frog_board', '#706553', .78), .008)
    leg = frog_leg(name+'_leg')
    d.parent(leg['root'], root)
    leg['root'].location = Vector(FROG_S4_LAYOUT['leg_offset'])
    offset = Vector(FROG_S4_LAYOUT['leg_offset'])
    nerve = leg['anchors']['nerve'] + offset
    muscle = leg['anchors']['muscle'] + offset
    center = Vector((.015, -.145, .125))
    tips = [center.copy(), center.copy()]
    elbows = [Vector((-.205, -.112, .185)), Vector((.050, -.105, .150))]
    radius = FROG_S4_LAYOUT['rod_radius']
    bars = [
        curve(name+'_brass_rod', [nerve, elbows[0], tips[0]],
              m['iron'] if same_metal else m['brass'], radius),
        curve(name+'_iron_rod', [muscle, elbows[1], tips[1]], m['iron'], radius),
    ]
    tips_objects = [
        d.sphere(name+'_tip_'+str(i), .0140, tips[i],
                 m['iron'] if same_metal or i else m['brass'],
                 seg_=24, ring=16) for i in range(2)
    ]
    contacts = [
        d.sphere(name+'_contact_nerve', .0140, nerve,
                 m['iron'] if same_metal else m['brass'], seg_=24, ring=16),
        d.sphere(name+'_contact_muscle', .0140, muscle, m['iron'], seg_=24, ring=16),
    ]
    # Short, real metal handles attach to the outer segments of the V, never
    # to the nerve or muscle. A hand grips their free ends, clear of the leg.
    # Their coordinates are updated by frog_contacts(), not guessed in scene.
    handle_fractions = (.72, .35)
    handle_offsets = [Vector((.125, -.105, -.026)),
                      Vector((.145, -.113, -.031))]
    handles, grips = [], []
    for i in range(2):
        start = elbows[i].lerp(tips[i], handle_fractions[i])
        bend = start + Vector((.006, -.026, -.010))
        end = start + handle_offsets[i]
        handles.append(curve(name+('_handle_brass' if i == 0 else '_handle_iron'),
                             [start, bend, end],
                             m['iron'] if same_metal or i else m['brass'],
                             radius*.84))
        grips.append(end.copy())
    model = _finish(name, before, root,
                    {'leg': leg, 'board': board, 'rods': bars, 'tips': tips_objects,
                     'contact_bases': [nerve, muscle], 'contact_objects': contacts,
                     'contact_elbows': elbows, 'contact_center': center.copy(),
                     'handles': handles, 'handle_grips': grips,
                     'handle_fractions': handle_fractions,
                     'handle_offsets': handle_offsets,
                     'same_metal': bool(same_metal)},
                    {'nerve': nerve, 'muscle': muscle, 'tip_brass': tips[0],
                     'tip_iron': tips[1], 'contact': center,
                     'grip_brass': grips[0], 'grip_iron': grips[1],
                     'center': (-.005, -.030, .152)},
                    ((-.245, -.270, 0), (.265, .185, .310)))
    frog_contacts(model, 0)
    return model


def frog_contacts(model, contact=0.0):
    """0: tips apart; 1: V branches meet, while both tissue bases stay fixed."""
    amount = _clamp(contact)
    q = model['parts']
    bases, center, elbows = q['contact_bases'], q['contact_center'], q['contact_elbows']
    tips = [center+Vector((-.020*(1-amount), 0, 0)),
            center+Vector((.020*(1-amount), 0, 0))]
    for i in range(2):
        _curve_points(q['rods'][i], [bases[i], elbows[i], tips[i]])
        q['tips'][i].location = tips[i]
        if 'handles' in q:
            start = elbows[i].lerp(tips[i], q['handle_fractions'][i])
            end = start + q['handle_offsets'][i]
            _curve_points(q['handles'][i],
                          [start, start+Vector((.006, -.026, -.010)), end])
            q['handle_grips'][i] = end.copy()
            model['anchors']['grip_brass' if i == 0 else 'grip_iron'] = end.copy()
    model['anchors']['tip_brass'] = tips[0]
    model['anchors']['tip_iron'] = tips[1]
    model['anchors']['contact'] = (tips[0]+tips[1])*.5
    return {'local': [tips[0].copy(), tips[1].copy()],
            'world': [world_anchor(model, 'tip_brass'), world_anchor(model, 'tip_iron')],
            'distance': (tips[1]-tips[0]).length}


def measure_groups(model):
    """Actual objects only: no board, hand, leader label or proxy geometry.

    In a same_metal experiment, 'brass' names the first branch's ROLE; its real
    material is iron. The centerline is kept as a curve for width measurement.
    """
    leg = model['parts'].get('leg', model)
    result = {
        'leg_body': list(leg['parts']['body_objects']),
        'nerve': [leg['parts']['nerve'], leg['parts']['nerve_tip']],
        'brass': [], 'iron': [],
    }
    if 'rods' in model['parts']:
        q = model['parts']
        result['brass'] = [q['rods'][0], q['tips'][0], q['contact_objects'][0]]
        result['iron'] = [q['rods'][1], q['tips'][1], q['contact_objects'][1]]
    return result


def foot_tip_world(model):
    """Actual distal pad vertex in world space, after current knee/parent pose."""
    leg = model['parts'].get('leg', model)
    q = leg['parts']
    bpy.context.view_layer.update()
    ob = q['tracking_object']
    return ob.matrix_world @ ob.data.vertices[q['tracking_vertex_index']].co


def centerline_world(model, group):
    """World curve centers for real local-perpendicular thickness measurement."""
    objects = measure_groups(model).get(group, [])
    ob = next((item for item in objects if item.type == 'CURVE'), None)
    if ob is None:
        return []
    bpy.context.view_layer.update()
    return [ob.matrix_world @ Vector(point.co[:3])
            for point in ob.data.splines[0].points]


def handle_endpoint_world(model, which=0):
    """The actual free metal-handle endpoint, in world coordinates."""
    index = 0 if which in (0, 'brass') else 1
    bpy.context.view_layer.update()
    ob = model['parts']['handles'][index]
    return ob.matrix_world @ Vector(ob.data.splines[0].points[-1].co[:3])


def hand_occlusion_allowed_objects(model):
    """Only the two V contact tips and the real external handles may be covered."""
    q = model['parts']
    return list(q.get('tips', [])) + list(q.get('handles', []))


def body_centerline_world(model):
    """Actual hip/knee/ankle/toe points; no bbox corners or proxy objects."""
    leg = model['parts'].get('leg', model)
    q = leg['parts']
    bpy.context.view_layer.update()
    return [world_anchor(leg, 'hip'),
            q['knee_hinge'].matrix_world.translation.copy(),
            q['ankle_hinge'].matrix_world.translation.copy(),
            foot_tip_world(model)]


def pose_connected_hand(name, tip, scale=.65, yaw=42, pitch=10, roll=0, vis=True):
    """Pose the complete shared hand + sleeve as one connected, scaled arm.

    In the normal frontal camera (azimuth 0), yaw +42 points the finger up-left
    and the wrist/sleeve run down-right. 'tip' is an actual world-space finger
    contact. Unlike desk_lib.set_hand(), the TIP offset includes the hand scale.
    Do not independently reposition a palm, cuff or sleeve.
    """
    hand = d.HANDS[name]
    d.show_tree(hand, bool(vis))
    if not vis:
        hand.location = (0, 0, -5)
        return {'visible': False, 'root': hand}
    k = float(scale)
    rot = Euler(tuple(math.radians(v) for v in (pitch, roll, yaw)), 'XYZ')
    hand.matrix_world = (Matrix.Translation(Vector(tip)) @ rot.to_matrix().to_4x4()
                         @ Matrix.Diagonal((k, k, k, 1.0))
                         @ Matrix.Translation(-d.TIP))
    bpy.context.view_layer.update()
    return {'visible': True, 'root': hand,
            'tip': hand.matrix_world @ d.TIP,
            'wrist': hand.matrix_world @ Vector((0, 0, 0)),
            'sleeve_end': hand.matrix_world @ Vector((0, -.26, 0))}


def _cloth_source_meshes(frog, reference_root):
    """Snapshot actual evaluated leg surfaces in the covering root's frame."""
    leg = frog['parts'].get('leg', frog)
    q = leg['parts']
    objects = list(q['body_objects']) + [q['nerve'], q['nerve_tip']]
    bpy.context.view_layer.update()
    inv = reference_root.matrix_world.inverted()
    dg = bpy.context.evaluated_depsgraph_get()
    verts, faces = [], []
    for ob in objects:
        evaluated = ob.evaluated_get(dg)
        mesh = evaluated.to_mesh()
        if mesh is None:
            continue
        try:
            mesh.calc_loop_triangles()
            matrix = inv @ evaluated.matrix_world
            offset = len(verts)
            verts.extend(matrix @ vertex.co for vertex in mesh.vertices)
            faces.extend(tuple(offset+i for i in triangle.vertices)
                         for triangle in mesh.loop_triangles)
        finally:
            evaluated.to_mesh_clear()
    return verts, faces


def _cloth_grid_heights(bvh, vertices, columns, ny, top):
    """Smooth a supported fabric surface, bridging missing rays rather than
    dropping each missing sample to the table (which makes curtain spikes).

    Every sampled real upper surface is a hard lower bound with 6 mm clearance.
    Unsupported inner gaps interpolate between supported samples. Outer hems
    follow each real section's underside instead of a global board-height floor.
    A positive envelope plus constrained relaxation rounds sharp transitions.
    """
    nx = len(columns)
    raw, hems = [], []
    for x, lo, hi in columns:
        nearby = [v for v in vertices if abs(v.x-x) < .011]
        if not nearby:
            nearest = min(vertices, key=lambda v: abs(v.x-x))
            nearby = [v for v in vertices if abs(v.x-nearest.x) < .011]
        hems.append(min(v.z for v in nearby)-.004)
        values = []
        for j in range(ny):
            y = lo+(hi-lo)*j/(ny-1)
            hits = []
            for dx, dy in ((0, 0), (.003, 0), (-.003, 0),
                           (0, .003), (0, -.003)):
                loc, _normal, _index, _distance = bvh.ray_cast(
                    Vector((x+dx, y+dy, top+.20)), Vector((0, 0, -1)), 2.0)
                if loc is not None:
                    hits.append(loc.z)
            values.append(max(hits)+.006 if hits else None)
        raw.append(values)
    # Vertex tessellation should never turn a smooth lower silhouette into a
    # serrated edge. Smooth only this hem profile; it is outside the body.
    for _ in range(4):
        hems = [sum(hems[max(0, min(nx-1, i+k))]*w
                    for k, w in ((-1, .25), (0, .5), (1, .25)))
                for i in range(nx)]
    filled = []
    for i in range(nx):
        known = [j for j in range(ny) if raw[i][j] is not None]
        if not known:
            filled.append(None)
            continue
        first, last = known[0], known[-1]
        values = []
        for j in range(ny):
            if raw[i][j] is not None:
                z = raw[i][j]
            elif j < first:
                u = j/max(1, first)
                u = u*u*(3-2*u)
                z = hems[i]+(raw[i][first]-hems[i])*u
            elif j > last:
                u = (ny-1-j)/max(1, ny-1-last)
                u = u*u*(3-2*u)
                z = hems[i]+(raw[i][last]-hems[i])*u
            else:
                left = max(k for k in known if k < j)
                right = min(k for k in known if k > j)
                z = raw[i][left]+(raw[i][right]-raw[i][left])*(j-left)/(right-left)
            values.append(z)
        filled.append(values)
    valid = [i for i in range(nx) if filled[i] is not None]
    if not valid:
        raise ValueError('The covering has no actual source surface')
    for i in range(nx):
        if filled[i] is None:
            nearest = min(valid, key=lambda k: abs(columns[k][0]-columns[i][0]))
            distance = abs(columns[nearest][0]-columns[i][0])
            blend = max(0, 1-distance/.018)
            filled[i] = [hems[i]+(z-hems[i])*blend for z in filled[nearest]]

    # A small maximum envelope protects the skin between grid vertices. Rounded
    # relaxation may move fabric up, never below an actual sampled upper skin.
    current = []
    for i in range(nx):
        values = []
        for j in range(ny):
            if j in (0, ny-1) and raw[i][j] is None:
                values.append(hems[i])
            else:
                values.append(max(filled[max(0, min(nx-1, i+di))]
                                        [max(0, min(ny-1, j+dj))]
                                  for di in (-1, 0, 1) for dj in (-1, 0, 1)))
        current.append(values)
    for _ in range(18):
        nxt = []
        for i in range(nx):
            values = []
            for j in range(ny):
                if j in (0, ny-1) and raw[i][j] is None:
                    # The complete outside hem is a smooth single curve.
                    z = hems[i]
                else:
                    z = .50*current[i][j]+.125*(
                        current[max(0, i-1)][j]+current[min(nx-1, i+1)][j]
                        +current[i][max(0, j-1)]+current[i][min(ny-1, j+1)])
                    if raw[i][j] is not None:
                        z = max(z, raw[i][j])
                values.append(z)
            nxt.append(values)
        current = nxt
    return current



def covered_table(name='b2a_covered_table', frog=None):
    """Thin drape fitted to the actual approved Z leg; no table-sized tent.

    Pass the actual frog_experiment model used in the scene. This model's root
    must receive exactly the same external pose as that experiment. The 3 real
    green toes are not duplicated: show the original frog beneath this cloth.
    The empty legacy peeking_foot key is kept only for caller compatibility.
    """
    before, root = _begin(name)
    m = materials()
    temporary = None
    if frog is None:
        # Standalone catalogue support only; it leaves no extra hidden frog.
        temporary = frog_experiment(name+'_temporary_fit_source')
        frog = temporary
    leg = frog['parts'].get('leg', frog)
    q = leg['parts']
    # The source may already have an external pose. Build the cloth in that
    # experiment's local coordinates, then return our root at identity.
    root.matrix_world = frog['root'].matrix_world.copy()
    saved_knee = q['knee_hinge'].rotation_euler.copy()
    saved_ankle = q['ankle_hinge'].rotation_euler.copy()
    saved_toe = leg['anchors']['toe'].copy()
    saved_pulse = (q['pulse'].location.copy(), q['pulse'].hide_render,
                   q['pulse'].hide_viewport)
    frog_kick(leg, 0)
    rest_vertices, rest_faces = _cloth_source_meshes(frog, root)
    rest_bvh = BVHTree.FromPolygons(rest_vertices, rest_faces, all_triangles=True)
    frog_kick(leg, 1)
    kick_vertices, kick_faces = _cloth_source_meshes(frog, root)
    kick_bvh = BVHTree.FromPolygons(kick_vertices, kick_faces, all_triangles=True)
    q['knee_hinge'].rotation_euler = saved_knee
    q['ankle_hinge'].rotation_euler = saved_ankle
    leg['anchors']['toe'] = saved_toe
    q['pulse'].location = saved_pulse[0]
    q['pulse'].hide_render, q['pulse'].hide_viewport = saved_pulse[1:]
    bpy.context.view_layer.update()

    # Body-only footprint, excluding toes: the toe opening at x=.151 intentionally
    # leaves all three actual rounded toe pads (x=.189/.207/.190) exposed.
    body_without_toes = [q[k] for k in
                        ('thigh', 'knee', 'shin', 'ankle_joint', 'foot')]
    inv = root.matrix_world.inverted()
    footprint = []
    for ob in body_without_toes:
        footprint += [inv @ ob.matrix_world @ vertex.co for vertex in ob.data.vertices]
    # Include the protruding ivory nerve so it is really under the fabric.
    footprint += rest_vertices
    minx = min(v.x for v in footprint)
    maxx = min(.151, max(v.x for v in footprint))
    ymin = min(v.y for v in footprint)
    ymax = max(v.y for v in footprint)
    margin_x = min(.010, (maxx-minx)*.10)
    margin_y = min(.009, (ymax-ymin)*.10)
    xmin = minx-margin_x
    xhem = .151
    nx, ny = 101, 41
    top = max(v.z for v in rest_vertices+kick_vertices)
    vertices, lifted_vertices, faces = [], [], []
    columns = []
    for i in range(nx):
        x = xmin+(xhem-xmin)*i/(nx-1)
        near = [v for v in footprint if abs(v.x-x) < .012]
        if not near:
            nearest = min(footprint, key=lambda v: abs(v.x-x))
            near = [v for v in footprint if abs(v.x-nearest.x) < .012]
        lo = min(v.y for v in near)-margin_y
        hi = max(v.y for v in near)+margin_y
        tip_round = math.sqrt(max(0.0, 1-((max(0, minx-x)/max(.001, margin_x)))**2))
        mid = (lo+hi)*.5
        half = (hi-lo)*.5*max(.12, tip_round)
        columns.append((x, mid-half, mid+half))
    # Smooth the boundary outline before sampling. This removes tessellation
    # steps around the nerve/thigh union without making the cloth a rectangle.
    for _ in range(3):
        old_columns = columns
        columns = []
        for i, (x, lo, hi) in enumerate(old_columns):
            if i in (0, nx-1):
                columns.append((x, lo, hi))
                continue
            lows = [old_columns[k][1] for k in (i-1, i, i+1)]
            highs = [old_columns[k][2] for k in (i-1, i, i+1)]
            columns.append((x, (lows[0]+2*lows[1]+lows[2])*.25,
                             (highs[0]+2*highs[1]+highs[2])*.25))
    rest_grid = _cloth_grid_heights(rest_bvh, rest_vertices, columns, ny, top)
    kick_grid = _cloth_grid_heights(kick_bvh, kick_vertices, columns, ny, top)
    for i, (x, lo, hi) in enumerate(columns):
        for j in range(ny):
            y = lo+(hi-lo)*j/(ny-1)
            # Submillimetre weave, not vertical folds or unsupported spikes.
            ripple = .00035*math.sin(37*x+3)*math.sin(math.pi*j/(ny-1))
            z, zk = rest_grid[i][j], kick_grid[i][j]
            vertices.append((x, y, z+ripple))
            lifted_vertices.append((x, y, max(zk, z)+ripple))
    for i in range(nx-1):
        for j in range(ny-1):
            k = i*ny+j
            faces.append((k, k+ny, k+ny+1, k+1))
    mesh = bpy.data.meshes.new(name+'_conforming_thin_cloth_mesh')
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    cloth = bpy.data.objects.new(name+'_cloth', mesh)
    d.link(cloth); d.put(cloth, m['cloth'])
    for polygon in mesh.polygons:
        polygon.use_smooth = True
    solid = cloth.modifiers.new('thin_fabric_0_8mm', 'SOLIDIFY')
    solid.thickness = .0008
    solid.offset = 0
    cloth.shape_key_add(name='Basis')
    kicked = cloth.shape_key_add(name='gentle_leg_follow')
    for item, xyz in zip(kicked.data, lifted_vertices):
        item.co = xyz
    kicked.value = 0
    footroot = d.empty(name+'_peeking_foot_no_fake_geometry')
    # All geometry is authored in experiment-local coordinates. Parent-inverse
    # identity keeps the same board/leg/cloth origin, even if caller built moved.
    cloth.parent = root
    cloth.matrix_parent_inverse = Matrix.Identity(4)
    footroot.parent = root
    footroot.matrix_parent_inverse = Matrix.Identity(4)
    if temporary is not None:
        for ob in list(temporary['objects']):
            bpy.data.objects.remove(ob, do_unlink=True)
    root.matrix_world = Matrix.Identity(4)
    low = Vector((min(v[0] for v in vertices), min(v[1] for v in vertices),
                  min(v[2] for v in vertices)))
    high = Vector((max(v[0] for v in vertices), max(v[1] for v in vertices),
                   max(v[2] for v in vertices)))
    model = _finish(name, before, root,
                    {'cloth': cloth, 'peeking_foot': footroot,
                     'actual_toes': list(q['toes'])+list(q['toe_pads'])
                         if temporary is None else [],
                     'kick_shape': kicked, 'source_frog': None if temporary else frog,
                     'cloth_columns': columns},
                    {'center': (low+high)*.5,
                     'foot': (.207, -.034, .068+.017),
                     'cloth': (low+high)*.5, 'toe_opening': (xhem, -.034, .095)},
                    (low, high))
    model['geometry_note'] = {
        'fabric_thickness_m': .0008,
        'maximum_margin_fraction': .10,
        'missing_rays': 'Supported bridging, local lower hem, constrained smooth envelope',
        'toe_opening_x_m': xhem,
        'actual_toe_meshes_reused': temporary is None,
        'source_leg_meshes_unchanged': True,
        'camera_offset': [0, 0, 0],
        'do_not_apply_old_fit_cover_scaling': True,
        'visual_clearance': 'Needs actual preview of rest, peak and reveal.',
    }
    return model


def cover_state(model, reveal=0.0, kick=0.0):
    q = model['parts']
    r = _clamp(reveal)
    # Fixed original placement until lifted off: the same board/leg/camera below.
    q['cloth'].location = Vector((.045*r, -.040*r, .34*r))
    q['cloth'].rotation_euler = (0, -.30*r, .12*r)
    q['kick_shape'].value = _clamp(kick)
    d.show(q['cloth'], r < .999)
    # Legacy EMPTY only; it never animates or substitutes an extra fake foot.



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
    """The same folded volumetric leg with visible interior water, never gore."""
    model = frog_leg(name)
    m = materials()
    before = set(bpy.data.objects)
    pale = _mat('frog_cutaway_skin', '#91ba7b', .70, alpha=.24)
    for ob in model['parts']['body_objects']:
        d.put(ob, pale)
    water = []
    centers = [(-.125, -.020, .185), (-.090, -.019, .180),
               (-.055, -.018, .172), (-.052, -.012, .125),
               (-.035, -.030, .080), (.030, -.035, .077),
               (.100, -.035, .073)]
    for i, point in enumerate(centers):
        ob = d.sphere(name+'_salty_water_%d' % i, .0072, point, m['water'],
                       scale=(.90, .82, 1.15), seg_=20, ring=12)
        d.parent(ob, model['root'])
        water.append(ob)
    added = sorted(set(bpy.data.objects)-before, key=lambda ob: ob.name)
    model['objects'] += added
    model['parts']['waterdrops'] = water
    for ob in added:
        model['baseline'][ob.name] = (ob.location.copy(), ob.rotation_euler.copy(),
                                     ob.scale.copy(), False, False)
    model['anchors']['water'] = Vector(centers[1])
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


def earth_surface_slice(name='b2a_earth_surface_slice', width=.20,
                        depth=.075, thickness=.040, curvature=.009):
    """A thick gently curved land/soil slice, root at the top-centre origin.

    Standalone model for rows 6/7 only. The unchanged comparison's old arches
    must be hidden by the scene. Green top is z=0 at centre and slightly lower
    at its sides; brown soil extends down by thickness. No arch or hollow ring.
    Put the compass above the top (e.g. pivot z=.038), never through the slab.
    """
    before, root = _begin(name)
    width, depth = float(width), float(depth)
    thickness, curvature = float(thickness), float(curvature)
    green = _mat('surface_slice_land', '#729356', .87)
    brown = _mat('surface_slice_soil', '#8a5c37', .91)
    lighter = _mat('surface_slice_soil_band', '#a5754b', .92)
    n = 40
    top_vertices = []
    for i in range(n+1):
        x = width*(i/n-.5)
        z = -curvature*(2*x/width)**2
        top_vertices += [(x, -depth*.5, z), (x, depth*.5, z)]
    top_faces = [(2*i, 2*i+2, 2*i+3, 2*i+1) for i in range(n)]
    mesh = bpy.data.meshes.new(name+'_green_curved_top_mesh')
    mesh.from_pydata(top_vertices, [], top_faces)
    top = bpy.data.objects.new(name+'_green_land_surface', mesh)
    d.link(top); d.put(top, green)
    for poly in mesh.polygons: poly.use_smooth = True
    soil_vertices, soil_faces = [], []
    for i in range(n+1):
        x = width*(i/n-.5)
        z = -curvature*(2*x/width)**2
        soil_vertices += [(x, -depth*.5, z), (x, depth*.5, z),
                          (x, -depth*.5, z-thickness),
                          (x, depth*.5, z-thickness)]
    for i in range(n):
        k, j = i*4, (i+1)*4
        soil_faces += [(k, k+2, j+2, j), (k+1, j+1, j+3, k+3),
                       (k+2, k+3, j+3, j+2)]
    soil_faces += [(0, 1, 3, 2), (n*4, n*4+2, n*4+3, n*4+1)]
    sm = bpy.data.meshes.new(name+'_brown_soil_mesh')
    sm.from_pydata(soil_vertices, [], soil_faces)
    soil = bpy.data.objects.new(name+'_brown_soil_cross_section', sm)
    d.link(soil); d.put(soil, brown)
    # Subtle interrupted earth stratum on the front face, rather than a tube.
    band_points = []
    for i in range(n+1):
        x = width*(i/n-.5)
        z = -curvature*(2*x/width)**2-thickness*.58
        band_points.append((x, -depth*.5-.0003, z))
    stratum = curve(name+'_earth_stratum', band_points, lighter, .0013)
    model = _finish(name, before, root,
                    {'top': top, 'soil': soil, 'stratum': stratum,
                     'land': top, 'section': soil},
                    {'center': (0, 0, -thickness*.42), 'surface': (0, 0, 0),
                     'left': (-width*.5, 0, -curvature),
                     'right': (width*.5, 0, -curvature)},
                    ((-width*.5, -depth*.5-.002, -thickness-curvature),
                     (width*.5, depth*.5, 0)))
    model['geometry_note'] = {'solid_land_soil_slice': True,
                              'surface_width_m': width,
                              'same_unchanged_row8_comparison': True}
    return model



FACTORIES={
    'frog':frog_leg,'frog_experiment':frog_experiment,'covered_table':covered_table,
    'static_generator':static_generator,'rubbed_glass':rubbed_glass,
    'water_analogy':water_analogy,'volta_pile':volta_pile,'electroscope':electroscope,
    'dry_cell':dry_cell,'torpedo_ray':torpedo_ray,'smoke_alarm':smoke_alarm,
    'scientist':scientist,'door_knob':door_knob,'terrella':terrella,
    'terrella_comparison':terrella_comparison,'frog_cutaway':frog_cutaway,
    'earth_surface_slice':earth_surface_slice,
}


