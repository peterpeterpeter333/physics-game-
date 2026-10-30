"""Additional B-2a S3 measurements, run(NS) in the already built Blender scene.

No rendering, .blend save, original-source edit, raw-frame write or anchor write.
Only a uniquely named new QA JSON is written; apply(0) restores the opening.
Compass assemblies and the red/white blades are measured separately. All widths
come from evaluated mesh vertices, including actual curve bevels, not bbox cubes.
"""
import hashlib
import json
import math
import time
from pathlib import Path

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector


def run(NS):
    d, p = NS['d'], NS['p']
    models, rows, apply, word = (NS[k] for k in ('MODELS', 'ROWS', 'apply', 'word'))
    fps = NS['FPS']
    checks, measurements, packet_samples = [], [], []
    started = time.time()
    warnings_before = list(NS.get('EVENT_WARNINGS', []))
    helper_present = callable(NS.get('spoken_field_packets'))

    def record(test, ok, actual=None, expected=None):
        checks.append({'test': test, 'pass': bool(ok), 'actual': actual,
                       'expected': expected})

    def sha(file):
        file = Path(file)
        return hashlib.sha256(file.read_bytes()).hexdigest() if file.is_file() else None

    def descendants(root):
        result, todo = [], [root]
        while todo:
            ob = todo.pop()
            result.append(ob)
            todo.extend(ob.children)
        return result

    def projection(point):
        v = world_to_camera_view(d.SC, d.CAM, Vector(point))
        return [float(v.x), float(1-v.y), float(v.z)]

    def measure(objects, scope):
        bpy.context.view_layer.update()
        graph = bpy.context.evaluated_depsgraph_get()
        screen, names, errors, vertex_count = [], [], [], 0
        for ob in dict.fromkeys(objects):
            if ob.hide_render or ob.type not in ('MESH', 'CURVE', 'SURFACE', 'FONT'):
                continue
            evaluated = ob.evaluated_get(graph)
            mesh = None
            try:
                mesh = evaluated.to_mesh()
                if mesh is None or not len(mesh.vertices):
                    errors.append({'object': ob.name, 'error': 'no evaluated vertices'})
                    continue
                matrix = evaluated.matrix_world
                screen.extend(projection(matrix @ vertex.co) for vertex in mesh.vertices)
                vertex_count += len(mesh.vertices)
                names.append(ob.name)
            except Exception as exc:
                errors.append({'object': ob.name, 'error': repr(exc)})
            finally:
                if mesh is not None:
                    evaluated.to_mesh_clear()
        finite = bool(screen) and all(math.isfinite(x) for v in screen for x in v)
        result = {'scope': scope, 'objects': names, 'vertexCount': vertex_count,
                  'errors': errors, 'finite': finite}
        if finite:
            result.update(x0=min(v[0] for v in screen), x1=max(v[0] for v in screen),
                          y0=min(v[1] for v in screen), y1=max(v[1] for v in screen))
            result['width'] = result['x1'] - result['x0']
            result['height'] = result['y1'] - result['y0']
            result['allInCamera'] = all(0 <= v[0] <= 1 and 0 <= v[1] <= 1 and v[2] > 0
                                        for v in screen)
        return result

    def add_measure(row, seconds, label, objects, scope, minimum=None):
        m = measure(objects, scope)
        measurements.append({'row': row, 'seconds': seconds, 'label': label, **m,
                             'minimumWidth': minimum})
        valid = m['finite'] and not m['errors']
        record('%s_at_%.6f_evaluated_vertices' % (label, seconds), valid, m,
               'nonempty finite evaluated geometry; no bbox fallback')
        if minimum is not None:
            record('%s_at_%.6f_minimum_width' % (label, seconds),
                   valid and m.get('width', 0) >= minimum-1e-6,
                   m.get('width'), minimum)
            record('%s_at_%.6f_required_geometry_in_camera' % (label, seconds),
                   valid and m.get('allInCamera', False),
                   m.get('allInCamera'), 'measured subject wholly in camera')
        return m

    def at_row(row, fraction):
        r = rows[row]
        t = r['start'] + fraction*(r['end']-r['start'])
        state = apply(t)
        assert state['row'] == row
        return t

    def safe_group(name, callback):
        try:
            callback()
        except Exception as exc:
            record(name+'_executes', False, repr(exc), 'check completes')

    def compass_widths():
        for row in (2, 3, 8):
            for fraction in (.08, .5, .92):
                t = at_row(row, fraction)
                model = models['comparison' if row == 8 else 'terrella']
                for side in (('North', 'South') if row == 8 else ('South',)):
                    comp = model['parts']['compass'+side]
                    label = 'row%d_%s_compass_without_ground' % (row, side)
                    # No horizontal line, ground tile, Earth or continent is
                    # a descendant of the compass's independent gimbal root.
                    add_measure(row, t, label, descendants(comp['root']),
                                'compass mechanism: gimbals, needle, pin and stand; '
                                'excludes ground, horizon and globe',
                                None if row == 8 else .25)
                    add_measure(row, t, 'row%d_%s_blades_only' % (row, side),
                                comp['halves'], 'red and white needle halves only; '
                                'separate diagnostic, no invented threshold')

    def row39_widths():
        for fraction in (.08, .5, .92):
            t = at_row(39, fraction)
            glass, pile = models['glass'], models['pile']
            gparts, q = glass['parts'], pile['parts']
            rounded = [ob for ob in glass['objects'] if '_rounded_end' in ob.name]
            add_measure(39, t, 'row39_glass_rod_cloth',
                        [gparts['rod'], gparts['cloth'], *rounded],
                        'glass rod, two rounded ends, rubbing cloth only; '
                        'excludes charges, sparks, hands, all tables', .30)
            core = [ob for group in q['layers'] for ob in group.values()]
            core += [q['top_lug'], q['bottom_lug']]
            # Record the narrower useful body separately so the supports cannot
            # silently make an undersized stack look large enough.
            add_measure(39, t, 'row39_pile_core', core,
                        'actual Zn/paper/Cu stack plus two terminals; '
                        'no support frame, base, hands, charge/signal dots', .30)
            assembly = core + [ob for ob in pile['objects']
                               if '_glass_support' in ob.name or '_support_glint' in ob.name]
            add_measure(39, t, 'row39_pile_with_supports_without_base', assembly,
                        'stack, terminals and glass supports; excludes base, hands, '
                        'charge/signal dots', .30)

    def row1_table_width():
        t = at_row(1, .5)
        cover = models['cover']
        table = [ob for ob in cover['objects']
                 if ob.name.startswith(cover['name']+'_top')
                 or ob.name.startswith(cover['name']+'_leg')]
        add_measure(1, t, 'row1_table_only', table,
                    'tabletop plus its four legs only; excludes cloth, peeking '
                    'frog foot, room desk and all hands', .45)
        add_measure(1, t, 'row1_tabletop_only',
                    [ob for ob in table if ob.name.startswith(cover['name']+'_top')],
                    'tabletop only, diagnostic; excludes cloth and legs')

    def packet_checks():
        events_file = Path(NS['R'])/'S0_20261029/word-events.json'
        source = json.loads(events_file.read_text())
        expected = next(r for r in source['rows'] if r['row'] == 5)['events']
        requests = [
            ('N極から出て', 'エヌキョクカラデテ'),
            ('まわりを回り', 'マワリオマワリ'),
            ('S極へ入ります。', 'エスキョクエハイリマス'),
            ('南から出て', 'ミナミカラデテ'),
            ('北へ入ります。', 'キタエハイリマス'),
        ]
        spans = []
        for label, kana in requests:
            event = next(ev for ev in expected if ev['kind'] == 'A' and ev['label'] == label)
            start, end = word(5, kana), word(5, kana, end=True)
            record('packet_frozen_word_clock_'+label,
                   abs(start-event['start']) < 1e-6 and abs(end-event['end']) < 1e-6,
                   {'start': start, 'end': end},
                   {'start': event['start'], 'end': event['end']})
            spans.append((start, end))
        windows = [(spans[0][0], spans[2][1]), (spans[3][0], spans[4][1])]
        sample_times = sorted(set([x for span in spans for x in span] + [
            windows[0][0]-1/fps,
            (windows[0][1]+windows[1][0])/2,
            windows[1][1]+1/fps,
        ]))
        for t in sample_times:
            state = apply(t)
            assert state['row'] == 5
            bpy.context.view_layer.update()
            model = models['terrella'];q = model['parts']
            active = any(start <= t <= end for start, end in windows)
            visible = [dot for group in q['field_particles'] for dot in group
                       if not dot.hide_render]
            record('packet_visible_count_at_%.6f' % t,
                   len(visible) == (6 if active else 0), len(visible), 6 if active else 0)
            record('packet_fixed_curves_at_%.6f' % t,
                   len(q['fieldloops']) == 6 and all(not ob.hide_render for ob in q['fieldloops']),
                   [not ob.hide_render for ob in q['fieldloops']], 'six curves retained')
            metadata = model.get('spoken_field_packet_state')
            fresh = metadata is not None and abs(metadata.get('time', -1)-t) < 1e-8
            record('packet_integrated_fresh_state_at_%.6f' % t, fresh,
                   metadata, 'helper ran inside actual apply(t), not called manually')
            north = projection(p.world_anchor(model, 'geographicNorth'))
            south = projection(p.world_anchor(model, 'geographicSouth'))
            record('packet_geographic_north_up_at_%.6f' % t,
                   north[2] > 0 and south[2] > 0 and north[1] < south[1],
                   {'north': north, 'south': south}, 'north screen Y < south screen Y')
            endpoints = []
            for i, (path, dots, arrow) in enumerate(zip(
                    q['field_paths'], q['field_particles'], q['field_arrows'])):
                start = model['root'].matrix_world @ Vector(path[0])
                end = model['root'].matrix_world @ Vector(path[-1])
                ps, pe = projection(start), projection(end)
                record('packet_path_%d_south_to_north_at_%.6f' % (i, t),
                       path[0].z < 0 < path[-1].z and start.z < end.z and ps[1] > pe[1],
                       {'localStart': list(path[0]), 'localEnd': list(path[-1]),
                        'screenStart': ps, 'screenEnd': pe},
                       'red south/N (-Z, screen below) → blue north/S (+Z, screen above)')
                if active and fresh:
                    u = metadata.get('progress')
                    valid_u = isinstance(u, (int, float)) and 0 <= u <= 1
                    record('packet_valid_u_%d_at_%.6f' % (i, t), valid_u, u, '0..1')
                    if valid_u:
                        z = u*(len(path)-1);index = min(len(path)-2, int(z))
                        local = path[index].lerp(path[index+1], z-index)
                        target = model['root'].matrix_world @ local
                        actual = dots[0].matrix_world.translation
                        error = (actual-target).length
                        tangent = model['root'].matrix_world.to_3x3() @ (path[index+1]-path[index])
                        forward = arrow.matrix_world.to_3x3() @ Vector((0, 1, 0))
                        alignment = forward.normalized().dot(tangent.normalized())
                        record('packet_mesh_position_%d_at_%.6f' % (i, t),
                               error < 2e-6, error, '<2e-6 m from narrated packet progress')
                        record('packet_arrow_direction_%d_at_%.6f' % (i, t),
                               alignment > .999, alignment, '>0.999 toward magnetic S')
                endpoints.append({'screenStart': ps, 'screenEnd': pe})
            packet_samples.append({'time': t, 'activeExpected': active,
                                   'visibleCount': len(visible), 'metadata': metadata,
                                   'north': north, 'south': south, 'endpoints': endpoints})
        # pole_marks are constructed south first/red, north second/blue.
        colors = [list(d.principled(ob.data.materials[0]).inputs['Base Color'].default_value)
                  for ob in models['terrella']['parts']['pole_marks']]
        record('packet_poles_south_red_north_blue',
               len(colors) == 2 and colors[0][0] > colors[0][2] and colors[1][2] > colors[1][0],
               colors, 'south red dominant; north blue dominant')

    try:
        safe_group('compass_widths', compass_widths)
        safe_group('row39_widths', row39_widths)
        safe_group('row1_table_width', row1_table_width)
        if helper_present:
            safe_group('spoken_field_packets', packet_checks)
    finally:
        try:
            restored = apply(0)
            bpy.context.view_layer.update()
            record('restore_apply_zero', restored['row'] == 1, restored['row'], 1)
        except Exception as exc:
            record('restore_apply_zero', False, repr(exc), 'opening restored')

    warnings_after = list(NS.get('EVENT_WARNINGS', []))
    record('no_new_word_fallback', warnings_after == warnings_before,
           {'before': warnings_before, 'after': warnings_after}, 'no new fallback')
    if helper_present:
        record('all_word_fallbacks_empty', not warnings_after, warnings_after, [])
    files = {'scene': NS.get('__file__'), 'parts': getattr(p, '__file__', None),
             'checker': __file__}
    failed = [c for c in checks if not c['pass']]
    result = {
        'scope': 'Additional real-Blender evaluated-vertex measurements and, when '
                 'installed, frozen-word field-packet checks. No rendering, movie '
                 'playback, audio listening or whole-frame image recognition.',
        'createdUnix': time.time(), 'elapsedSeconds': time.time()-started,
        'inputs': {key: {'path': file, 'sha256': sha(file)}
                   for key, file in files.items() if file},
        'thresholdDefinitions': {
            'rows2and3': '>=25% for complete compass mechanism, ground excluded. '
                          'Blade-only width is also separately recorded without a made-up threshold.',
            'row8': 'Both compass-mechanism and blade-only widths recorded; '
                    'no numerical minimum invented.',
            'row39': '>=30% for rod+cloth and for pile body+terminals; pile with '
                     'supports is separately measured. No hands/base/charge dots counted.',
            'row1': '>=45% for table alone, no cloth or peeking foot.',
        },
        'sampling': 'Fractions .08/.50/.92 of rows2/3/8/39; row1 midpoint; '
                    'word starts/ends and inactive gaps for optional field packets. '
                    'This is not a per-frame minimum-width proof.',
        'packetHelperPresent': helper_present,
        'packetCheckStatus': 'checked' if helper_present else 'not checked: helper not installed',
        'measurements': measurements, 'packetSamples': packet_samples,
        'checks': checks, 'total': len(checks), 'failed': failed,
        'pass': not failed, 'restoredByApplyZero': any(
            c['test'] == 'restore_apply_zero' and c['pass'] for c in checks),
        'noFrameOrAnchorWrites': True, 'sourceEdited': False,
    }
    destination = Path(NS['C'])/'qa'/('s3-specific-widths-20261029-%d.json' % time.time_ns())
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open('x') as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
    print('B2A_S3_SPECIFIC_WIDTHS', json.dumps(
        {'file': str(destination), 'total': len(checks), 'failed': len(failed),
         'helperPresent': helper_present, 'restored': result['restoredByApplyZero']},
        ensure_ascii=False), flush=True)
    return {'file': str(destination), **result}
