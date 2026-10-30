"""New, row-27-only alarm analogy for B-2a S4 correction 03.

No import-time Blender reset, file write, render, audio, subtitle or old-source
change.  The caller owns the queue and composition.  Integration:

    alarm27 = build(NS)
    # Prefer a wrapper around the scene's old apply(), not its old stage():
    def corrected_apply(t):
        if NS['row_at'](t)['row'] == 27:
            NS['hide_all']()
            return apply(NS, alarm27, t)
        restore_camera(NS, alarm27)  # before the normal scene calibrates/poses
        return old_apply(t)

    # In the new label_anchors wrapper, row27 only:
    return anchors(NS, alarm27)

The single new p-style model is registered as MODELS['r27_alarm_analogy'].
It includes the exact current frog_leg mesh hierarchy (no green blob, no old
thin foot), a front/underside-view detector and source-only rising smoke.
All time functions are absolute; repeated/out-of-order samples are identical.
"""

import math
import bpy
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view


PREFIX = 'b2a_r27_alarm_c03_20261030'
MODEL_KEY = 'r27_alarm_analogy'
LOGICAL_SIZE = (1080, 1920)
CAMERA_CENTER = (0.0, 0.0, 1.0)
ALARM_CENTER = Vector((0.0, 0.0, 1.400))
ALARM_RADIUS = .235
FOOT_WIDTH = .44
FOOT_SCREEN_CENTER_Y = .625
SOURCE_OFFSET_Z = -.040


def _smooth(t, a, b):
    u = max(0.0, min(1.0, (t-a)/max(.0001, b-a)))
    return u*u*(3-2*u)


def _kick(t, at):
    """A single 8-degree picture twitch, never repeated with lamp pulses."""
    if not at <= t <= at+.42:
        return 0.0
    return _smooth(t, at, at+.11)*(1-_smooth(t, at+.11, at+.42))


def _events(ns):
    word = ns['word']
    row = ns['ROWS'][27]
    smoke = float(word(27, 'ケムリ'))
    ring = float(word(27, 'ナル'))
    inspect = float(word(27, 'ナリワシテモ'))
    no_smoke = float(word(27, 'ケムリオダシテイル'))
    if not row['start'] <= smoke < ring < inspect < no_smoke < row['end']:
        raise ValueError('Row27 spoken event order must be smoke < ring < '
                         'inspect < no-smoke; do not silently use invented times')
    return {
        'rowStart': float(row['start']), 'rowEnd': float(row['end']),
        'smokeLaunch': smoke, 'smokeArrivalAndFirstLamp': ring,
        'singleFootPictureKick': ring,
        'undersideOnePushInStart': inspect,
        'undersideOnePushInEnd': min(inspect+.65, no_smoke),
        'noSmokeStatement': no_smoke,
        'spokenWords': {
            'smokeLaunch': 'ケムリ',
            'smokeArrivalAndFirstLamp': 'ナル',
            'undersideOnePushInStart': 'ナリワシテモ',
            'noSmokeStatement': 'ケムリオダシテイル',
        },
        'sourceEmission': 'Only the separate wick below the detector',
        'alarmEmissionCount': 0,
        'lampPeriodSeconds': .8,
        'firstLampOnSeconds': .38,
        'footPictureKickDegrees': 8.0,
    }


def _body_points(leg):
    return [ob.matrix_world @ v.co
            for ob in leg['parts']['body_objects']
            if ob.type == 'MESH' for v in ob.data.vertices]


def _case_mat(d, suffix, color, rough=.6, metal=0.0,
              emit=None, strength=0.0, alpha=1.0):
    return d.mat(PREFIX+'_'+suffix, color, rough, metal=metal,
                 emit=emit, strength=strength, alpha=alpha)


def build(ns):
    """Build only NEW objects and return their owner bundle, initially hidden."""
    d, p = ns['d'], ns['p']
    if MODEL_KEY in ns['MODELS']:
        raise ValueError('Row27 module was already built; do not duplicate assets')
    before, root = p._begin(PREFIX)
    ivory = _case_mat(d, 'case_white', '#fbf7e9', .48,
                     emit='#fbf7e9', strength=.07)
    rim = _case_mat(d, 'case_rim', '#d4d3cd', .35, metal=.18)
    dark = _case_mat(d, 'vent', '#464b50', .7)
    backing = _case_mat(d, 'backdrop', '#b59678', .85,
                       emit='#b59678', strength=.12)
    gray = _case_mat(d, 'source', '#737270', .8)
    wickmat = _case_mat(d, 'wick', '#3f3c38', .9)
    smoke_mat = _case_mat(d, 'smoke', '#7c8185', .9,
                         emit='#7c8185', strength=.04, alpha=.58)
    ledmat = _case_mat(d, 'led', '#ec3e30', .35,
                      emit='#ff2815', strength=0)
    wave_mat = _case_mat(d, 'sound_wave', '#ffad52', .5,
                        emit='#ff9f3c', strength=.85)
    silver = _case_mat(d, 'up_arrow', '#b5bcc0', .4, metal=.45,
                       emit='#c1c8cc', strength=.10)

    # A quiet vertical backdrop removes irrelevant acres of desk wood without
    # changing any shared room object. The thin ceiling remains at the top.
    backdrop = d.box(PREFIX+'_backdrop', (1.20, .035, 2.05),
                     (0, .24, 1.0), backing, .006)
    ceiling = d.box(PREFIX+'_thin_ceiling', (1.08, .14, .027),
                    (0, .08, 1.740), p.materials()['wood'], .004)

    detector_root = d.empty(PREFIX+'_detector_root', ALARM_CENTER)
    case = d.cyl(PREFIX+'_white_round_body', ALARM_RADIUS, .055,
                 ALARM_CENTER, ivory, rot=(math.pi/2, 0, 0), verts=96)
    inner = d.cyl(PREFIX+'_underside_face', ALARM_RADIUS*.89, .008,
                  ALARM_CENTER+Vector((0, -.032, 0)), ivory,
                  rot=(math.pi/2, 0, 0), verts=96)
    edge = d.torus(PREFIX+'_rim', ALARM_RADIUS*.985, .0045,
                   ALARM_CENTER+Vector((0, -.029, 0)), rim,
                   rot=(math.pi/2, 0, 0))
    detector_objects = [case, inner, edge]
    # Distinct concentric vent slots make this a detector, not an unlabeled
    # featureless disk. All slots are on the visible underside.
    for i in range(18):
        theta = math.tau*i/18
        point = ALARM_CENTER+Vector((.171*math.sin(theta), -.039,
                                    .171*math.cos(theta)))
        slot = d.box(PREFIX+'_underside_vent_%02d'%i,
                     (.008, .004, .041), point, dark, .003,
                     rot=(0, theta, 0))
        detector_objects.append(slot)
    for sx in (-1, 1):
        screw = d.sphere(PREFIX+'_screw_'+str(sx), .007,
                         ALARM_CENTER+Vector((sx*.116, -.042, .043)),
                         rim, scale=(1, .30, 1), seg_=16, ring=8)
        detector_objects.append(screw)
    led = d.sphere(PREFIX+'_red_lamp', .028,
                   ALARM_CENTER+Vector((0, -.047, -.093)),
                   ledmat, scale=(1, .35, 1), seg_=32, ring=16)
    detector_objects.append(led)
    for ob in detector_objects:
        d.parent(ob, detector_root)

    source = d.cyl(PREFIX+'_gray_smoke_source', .026, .021,
                   (-.250, -.015, 1.040+SOURCE_OFFSET_Z), gray, verts=40)
    wick = p.rod(PREFIX+'_smoking_wick',
                 (-.250, -.015, 1.049+SOURCE_OFFSET_Z),
                 (-.250, -.015, 1.072+SOURCE_OFFSET_Z), .0035, wickmat)
    smoke = [d.sphere(PREFIX+'_source_only_smoke_%02d'%i, 1,
                      (0, 0, 0), smoke_mat,
                      seg_=20, ring=12) for i in range(20)]

    # Three visible arcs expand from the DETECTOR, never from the wick.
    waves = []
    for i in range(3):
        points = [(0, 0, 0)]*25
        waves.append(p.curve(PREFIX+'_sound_arc_'+str(i), points,
                             wave_mat, .0032))

    arrow = p.curve(PREFIX+'_silver_arrow_up',
                    [(-.20, -.09, 1.085+SOURCE_OFFSET_Z),
                     (0, -.09, ALARM_CENTER.z-ALARM_RADIUS-.006)],
                    silver, .0018)
    arrowheads = [p.curve(PREFIX+'_silver_arrow_head_'+str(s),
                         [(0, -.09, ALARM_CENTER.z-ALARM_RADIUS-.006),
                          (-.02, -.09, ALARM_CENTER.z-ALARM_RADIUS-.030)],
                         silver, .0018) for s in (-1, 1)]

    # Reuse the current exact volumetric Z-foot, not a new approximation.
    leg = p.frog_leg(PREFIX+'_same_Z_foot_picture')
    bpy.context.view_layer.update()
    points = _body_points(leg)
    lo = Vector(tuple(min(v[k] for v in points) for k in range(3)))
    hi = Vector(tuple(max(v[k] for v in points) for k in range(3)))
    scale = FOOT_WIDTH/(hi.x-lo.x)
    leg['root'].scale = (scale,)*3
    # World horizontal span is calibrated to exactly 1.0 in configure_camera.
    world_z = 1.0+(0.5-FOOT_SCREEN_CENTER_Y)*(16/9)
    center = (lo+hi)*.5
    leg['root'].location = Vector((-center.x*scale, -.025,
                                  world_z-center.z*scale))
    for key in ('nerve', 'nerve_tip', 'pulse'):
        d.show(leg['parts'][key], False)

    lightdata = bpy.data.lights.new(PREFIX+'_panel_key', 'AREA')
    lightdata.energy = 8.0
    lightdata.shape = 'DISK'
    lightdata.size = 2.0
    lightdata.color = (1.0, .91, .81)
    light = bpy.data.objects.new(PREFIX+'_panel_key', lightdata)
    d.link(light)
    light.location = (-.35, -1.6, 2.25)
    light.rotation_euler = (Vector((0, 0, 1.20))-light.location).to_track_quat('-Z', 'Y').to_euler()

    model = p._finish(PREFIX, before, root,
                      {'case': case, 'detector_root': detector_root,
                       'detector_objects': detector_objects, 'led': led,
                       'led_material': ledmat, 'source': source, 'wick': wick,
                       'smoke': smoke, 'waves': waves,
                       'arrow': arrow, 'arrowheads': arrowheads,
                       'leg': leg, 'backdrop': backdrop, 'ceiling': ceiling,
                       'light': light},
                      {'alarm': ALARM_CENTER,
                       'alarm_no_smoke_label': (0, -.08, 1.115),
                       'source': (-.250, -.015, 1.072+SOURCE_OFFSET_Z),
                       'foot': (0, -.025, world_z),
                       'foot_label': (0, -.025, .945),
                       'separator': (0, -.025, .973)},
                      ((-.60, -.18, -.025), (.60, .30, 2.025)))
    ns['MODELS'][MODEL_KEY] = model
    p.visible(model, False)
    return {'model': model, 'events': _events(ns), 'prefix': PREFIX,
            'sourceOffsetZ': SOURCE_OFFSET_Z,
            'cameraBefore': {
                'type': d.CAM_D.type, 'ortho_scale': d.CAM_D.ortho_scale,
                'shift_x': d.CAM_D.shift_x, 'shift_y': d.CAM_D.shift_y,
                'use_dof': d.CAM_D.dof.use_dof,
            }, 'lastMetadata': None}


def migrate_probe01_adjustments(ns, bundle, source_offset_z=SOURCE_OFFSET_Z):
    """Update the already-built NEW row27 bundle without rebuilding a scene.

    Idempotent: an old bundle migrates from alarmZ=1.455/sourceOffset=0; a
    freshly-built bundle is already at the new origins. Baselines and anchors
    move with their objects, so the next p.reset()/apply() cannot undo it.
    Only this module's own objects/materials are touched.
    """
    d, model = ns['d'], bundle['model']
    q = model['parts']

    def shift_with_baseline(ob, delta):
        ob.location += delta
        old = model['baseline'].get(ob.name)
        if old:
            model['baseline'][ob.name] = (old[0]+delta, old[1].copy(),
                                           old[2].copy(), old[3], old[4])

    old_alarm = Vector(model['anchors']['alarm'])
    detector_delta = ALARM_CENTER-old_alarm
    shift_with_baseline(q['detector_root'], detector_delta)
    model['anchors']['alarm'] = ALARM_CENTER.copy()

    previous_offset = float(bundle.get('sourceOffsetZ', 0.0))
    source_delta = Vector((0, 0, float(source_offset_z)-previous_offset))
    for key in ('source', 'wick'):
        shift_with_baseline(q[key], source_delta)
    model['anchors']['source'] += source_delta
    bundle['sourceOffsetZ'] = float(source_offset_z)

    def recolor(material, color):
        bsdf = d.principled(material)
        bsdf.inputs['Base Color'].default_value = d.rgb(color)
        bsdf.inputs['Emission Color'].default_value = d.rgb(color)

    recolor(q['backdrop'].data.materials[0], '#b59678')
    recolor(q['smoke'][0].data.materials[0], '#7c8185')
    q['light'].data.energy = 8.0
    bpy.context.view_layer.update()
    result = {
        'detectorDelta': list(detector_delta),
        'newDetectorOrigin': list(ALARM_CENTER),
        'sourceDelta': list(source_delta),
        'newSourceOffsetZ': bundle['sourceOffsetZ'],
        'panelLightEnergy': q['light'].data.energy,
        'backdropColor': '#b59678', 'smokeColor': '#7c8185',
        'baselinesAndAnchorsUpdated': True,
        'eventsWordingAndTimingChanged': False,
        'rebuildNeeded': False,
    }
    bundle['probe01Adjustment'] = result
    return result


def configure_camera(ns):
    """Dedicated row27 camera; caller restores before every other old apply."""
    d = ns['d']
    d.CAM_D.type = 'ORTHO'
    d.CAM_D.ortho_scale = 16/9
    d.CAM_D.shift_x = d.CAM_D.shift_y = 0
    d.CAM_D.dof.use_dof = False
    d.CAM.location = (0, -4, 1)
    d.CAM.rotation_euler = (Vector(CAMERA_CENTER)-d.CAM.location).to_track_quat('-Z', 'Y').to_euler()
    bpy.context.view_layer.update()
    # Resolve Blender's portrait sensor-fit convention using the actual camera,
    # not an assumed ortho_scale interpretation.
    left = world_to_camera_view(d.SC, d.CAM, Vector((-.5, 0, 1)))
    right = world_to_camera_view(d.SC, d.CAM, Vector((.5, 0, 1)))
    d.CAM_D.ortho_scale *= right.x-left.x
    bpy.context.view_layer.update()
    return {'type': d.CAM_D.type, 'location': list(d.CAM.location),
            'rotation': list(d.CAM.rotation_euler),
            'ortho_scale': d.CAM_D.ortho_scale, 'shift_x': 0, 'shift_y': 0,
            'use_dof': False}


def restore_camera(ns, bundle):
    d, previous = ns['d'], bundle['cameraBefore']
    d.CAM_D.type = previous['type']
    d.CAM_D.ortho_scale = previous['ortho_scale']
    d.CAM_D.shift_x = previous['shift_x']
    d.CAM_D.shift_y = previous['shift_y']
    d.CAM_D.dof.use_dof = previous['use_dof']


def apply(ns, bundle, t):
    """Use INSTEAD OF old apply for row27, after the caller's hide_all()."""
    d, p = ns['d'], ns['p']
    row = ns['row_at'](t)['row']
    if row != 27:
        raise ValueError('Row27-only module cannot change another row')
    model = bundle['model']
    p.reset(model)
    p.visible(model, True)
    q, ev = model['parts'], bundle['events']
    camera = configure_camera(ns)
    macro = _smooth(t, ev['undersideOnePushInStart'],
                     ev['undersideOnePushInEnd'])
    q['detector_root'].scale = (1+.13*macro,)*3

    # No particle is ever born at the alarm. Each is born at the wick below,
    # travels up, then disappears when it touches the lower detector edge.
    travel = max(.25, ev['smokeArrivalAndFirstLamp']-ev['smokeLaunch'])
    # The largest puff's top just touches the detector underside. Its centre
    # stays below the body, so no puff can look like an alarm-born emission.
    current_radius = ALARM_RADIUS*(1+.13*macro)
    smoke_hit_x = -.110
    curved_underside_z = ALARM_CENTER.z-math.sqrt(
        current_radius*current_radius-smoke_hit_x*smoke_hit_x)
    arrival_z = curved_underside_z-.0125
    source_offset = bundle.get('sourceOffsetZ', SOURCE_OFFSET_Z)
    source_z = 1.072+source_offset
    life = travel+.16
    visible_smoke = 0
    max_smoke_z = None
    for i, ob in enumerate(q['smoke']):
        launched = t-ev['smokeLaunch']-.095*i
        age = launched % life if launched >= 0 else -1
        # Keep the arriving puff in contact for 60ms. Without this short dwell,
        # a non-integer speech time could fall between 30fps frames and the
        # first lamp-on frame would miss the touching puff altogether.
        visible = 0 <= age <= travel+.06
        d.show(ob, visible)
        if not visible:
            continue
        u = min(1.0, age/travel)
        ob.location = (-.250+.140*u+.005*math.sin(u*math.pi)*math.sin(u*math.tau+i),
                       -.080-.008*math.sin(u*math.pi+i),
                       source_z+(arrival_z-source_z)*u)
        radius = .004+.006*u
        ob.scale = (radius*1.35, radius, radius*1.25)
        visible_smoke += 1
        max_smoke_z = max(max_smoke_z or -1e9, ob.location.z)

    ringing = t >= ev['smokeArrivalAndFirstLamp']
    cycle = (t-ev['smokeArrivalAndFirstLamp']) % ev['lampPeriodSeconds'] if ringing else 0
    lamp_on = ringing and cycle < ev['firstLampOnSeconds']
    d.set_emit(q['led_material'], 5.0 if lamp_on else .05)
    for i, ob in enumerate(q['waves']):
        d.show(ob, lamp_on)
        radius = (ALARM_RADIUS+.035+.026*i)*(1+.13*macro)+.012*cycle/.38
        pts = [(ALARM_CENTER.x+radius*math.cos(theta), -.061,
                ALARM_CENTER.z+radius*math.sin(theta))
               for theta in [-.70+j*1.40/24 for j in range(25)]]
        p._curve_points(ob, pts)
    d.show(q['arrow'], t >= ev['smokeLaunch'])
    arrow_tail = Vector((-.20, -.09, 1.085+source_offset))
    arrow_tip = Vector((0, -.09, ALARM_CENTER.z-current_radius-.006))
    p._curve_points(q['arrow'], [arrow_tail, arrow_tip])
    arrow_direction = (arrow_tip-arrow_tail).normalized()
    arrow_side = Vector((arrow_direction.z, 0, -arrow_direction.x))
    for sign, ob in zip((-1, 1), q['arrowheads']):
        d.show(ob, t >= ev['smokeLaunch'])
        p._curve_points(ob, [arrow_tip,
                            arrow_tip-arrow_direction*.025+arrow_side*.012*sign])
    p.frog_kick(q['leg'], _kick(t, ev['singleFootPictureKick']),
                degrees=ev['footPictureKickDegrees'])
    for key in ('nerve', 'nerve_tip', 'pulse'):
        d.show(q['leg']['parts'][key], False)
    bpy.context.view_layer.update()

    metadata = {
        'row': 27, 'time': float(t), 'lampOn': lamp_on,
        'soundWaveArcsVisible': 3 if lamp_on else 0,
        'footPictureKickAmount': _kick(t, ev['singleFootPictureKick']),
        'smokeEmissionObject': q['wick'].name,
        'alarmEmitsSmoke': False,
        'visibleSmokeParticles': visible_smoke,
        'maximumSmokeCenterZ': max_smoke_z,
        'currentAlarmLowerEdgeZ': ALARM_CENTER.z-current_radius,
        'smokeActualContactWorld': [smoke_hit_x, -.080, curved_underside_z],
        'undersidePushInProgress': macro, 'camera': camera,
        'primaryMeasurementTargets': {
            'alarmRoundBody': [q['case'].name],
            'sameZFootBody': [ob.name for ob in q['leg']['parts']['body_objects']],
            'alarmMinimumWidth': .40, 'footPictureTargetWidth': FOOT_WIDTH,
        },
    }
    bundle['lastMetadata'] = metadata
    return {'row': 27, 'models': [model], 'primary': [q['case']],
            'name': PREFIX+'_round_detector',
            'az': 0, 'el': 0, 'target': .47, 'maxheight': .40,
            'lens': 42, 'fullFace': False,
            'cameraOverride': camera, 'row27Metadata': metadata}


def anchors(ns, bundle):
    d, model = ns['d'], bundle['model']
    out = {}
    for source, target in [('alarm', 'alarm27'),
                           ('alarm_no_smoke_label', 'alarm27NoSmoke'),
                           ('source', 'alarm27SmokeSource'),
                           ('foot', 'alarm27Foot'),
                           ('foot_label', 'alarm27FootLabel'),
                           ('separator', 'alarm27Separator')]:
        out['label.'+target] = d.project(ns['p'].world_anchor(model, source))
    return out


def events(bundle):
    """Inspectable, frozen-speech-aligned clock, without writing any file."""
    return dict(bundle['events'])


def measurement_groups(bundle):
    """Actual geometry targets; no bbox-proxy PASS is pre-declared."""
    q = bundle['model']['parts']
    return {'alarm_round_body': [q['case']],
            'frog_picture_body': list(q['leg']['parts']['body_objects']),
            'smoke_source': [q['source'], q['wick']],
            'smoke': list(q['smoke']), 'sound_arcs': list(q['waves']),
            'red_lamp': [q['led']]}


def measure_projected_groups(ns, bundle):
    """True mesh-vertex extents, not an image-area or original-QA waiver.

    Use after apply() for actual width >=40% and frame containment checks.
    The footprint is a vertex bbox only; no claim about its filled pixel area.
    """
    d = ns['d']
    result = {}
    for key in ('alarm_round_body', 'frog_picture_body'):
        objects = measurement_groups(bundle)[key]
        points = [world_to_camera_view(d.SC, d.CAM,
                                      ob.matrix_world @ v.co)
                  for ob in objects if not ob.hide_render
                  and ob.type == 'MESH' for v in ob.data.vertices]
        if not points:
            result[key] = {'present': False, 'passesWidth40Percent': False}
            continue
        x0, x1 = min(v.x for v in points), max(v.x for v in points)
        y0, y1 = 1-max(v.y for v in points), 1-min(v.y for v in points)
        result[key] = {
            'present': True, 'actualMeshVertexWidth': x1-x0,
            'actualMeshVertexHeight': y1-y0,
            'normalizedBounds': [x0, y0, x1, y1],
            'allInFrame': all(0 <= v.x <= 1 and 0 <= v.y <= 1 and v.z > 0
                              for v in points),
            'passesWidth40Percent': x1-x0 >= .40,
            'filledPixelAreaMeasured': False,
        }
    return result
