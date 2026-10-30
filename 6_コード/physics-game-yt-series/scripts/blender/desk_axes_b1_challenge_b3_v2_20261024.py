"""B3 v2: challenge-only white half-needle contrast, never an answer change.

Root GUI queue only. Import is inert. The two probes must be actually viewed
before run(..., mode='render', visually_approved=True, probe_report_sha256=...).
The old B2 camera, support, exact held source times and all Japanese stay fixed.
Original white/red meshes, modifiers, materials, source and B2 raw stay intact.
"""
import hashlib
import json
import math
import os
from pathlib import Path
import time

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-b1v1')
B2 = Path('/private/tmp/ys/ys-chain-b1v1-camera-final-20261024')
P = Path('/private/tmp/ys/ys-chain-b1v1-challenge-b3-v2-20261024')
STAGE_SHA = '7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
LIB_SHA = '6fb09a2b07c4e6c1f6ae1b66c5f690f5a5aef1ccc9a1ef68d18bcd55eef729ac'
B2_REPORT_SHA = '867a061169759c92840a0efdc4e33571f0843b4f51673bd3879afc6ae8bdabde'
PREFIX = 'b1_b3_challenge_white_20261024_'


def sha(p):
    h = hashlib.sha256()
    with Path(p).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def write_new(p, data):
    with Path(p).open('x') as f:
        json.dump(data, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')


def inventory(p):
    return {str(f): [f.stat().st_size, str(f.stat().st_mtime_ns)]
            for f in sorted(Path(p).glob('*.jpg')) if f.is_file()}


def needle_geometry(ob):
    return {'vertices': [tuple(v.co) for v in ob.data.vertices],
            'polygons': [tuple(f.vertices) for f in ob.data.polygons],
            'materials': [m.as_pointer() if m else None for m in ob.data.materials],
            'modifiers': [(m.name, m.type, getattr(m, 'thickness', None),
                           getattr(m, 'offset', None)) for m in ob.modifiers],
            'parent': ob.parent.as_pointer() if ob.parent else None}


def run(ns, authorized=False, mode='probe', visually_approved=False,
        probe_report_sha256=None, out=str(P)):
    assert authorized is True, 'Only root may queue a Blender operation'
    assert mode in ('probe', 'render')
    out = Path(out)
    assert out.parent == P.parent and out.name.startswith(P.name)
    assert not out.is_symlink()
    target = out / mode
    assert not os.path.lexists(target), 'Preserve earlier B3 probes/delivery'
    g = ns['main'].__globals__
    d, bpy = g['d'], g['bpy']
    scene = d.SC
    assert Path(g['__file__']) == W / 'scripts/blender/desk_b1v1.py'
    assert sha(g['__file__']) == STAGE_SHA
    assert sha(W / 'scripts/blender/desk_lib_b1.py') == LIB_SHA
    assert sha(B2 / 'camera-patch.json') == B2_REPORT_SHA
    cp = json.loads((B2 / 'camera-patch.json').read_text())
    assert cp['allPatchFramesActuallyRendered'] and cp['frames'] == 10700
    assert scene.render.engine == 'BLENDER_EEVEE' and scene.camera is d.CAM
    assert g['VIS_QUEUE'] is None
    if mode == 'render':
        probe = out / 'probe/report.json'
        assert visually_approved is True, 'Actual two-probe eye approval is mandatory'
        assert probe.is_file() and sha(probe) == probe_report_sha256
        pr = json.loads(probe.read_text())
        assert pr['status'] == 'two_actual_probes_pending_eye_review'
        assert pr['helperSha256'] == sha(__file__)
        assert all(sha(r['file']) == r['sha256'] for r in pr['actualRenders'])
    replacements = {int(j): int(k) for j, k in cp['replacementFrameToActualPatchFrame'].items()}
    refs = {int(j): int(k) for j, k in cp['patchFrameToUnchangedObjectSourceFrame'].items()}
    physical = {int(r['frame']): r for r in cp['physical']}
    challenge_outputs = {j: k for j, k in replacements.items()
                         if g['cue_at'](j / 30)['group'] == 'challenge'}
    frames = sorted(set(challenge_outputs.values()))
    assert len(frames) == 99 and min(frames) == 9981 and max(frames) == 10465
    assert all(g['cue_at'](k / 30)['group'] == 'challenge' for k in frames)
    assert all(k in refs and k in physical for k in frames)
    actual_frame, actual_source = 10185, challenge_outputs[10185]
    assert actual_source == 10178 and refs[actual_source] == 10178
    protected_paths = [W / 'scripts/blender/desk_b1v1.py',
                       W / 'scripts/blender/desk_lib_b1.py',
                       W / 'docs/video-revision-20260924/ytseries/chain-b-1.mjs',
                       C / 'ys-chain-b1v1.wav', C / 'ys-chain-b1v1.json',
                       C / 'plan.json', C / 'phrase-times.json',
                       B2 / 'camera-patch.json', B2 / 'final-held-dimensions.json',
                       B2 / 'blender/patch/anchors.json',
                       B2 / 'problem/挑戦.png', B2 / 'problem/答え.png',
                       B2 / 'problem/problem.json']
    protected = {str(p): sha(p) for p in protected_paths}
    raw_before = {str(p): inventory(p) for p in (C / 'blender/desk', B2 / 'blender/patch')}
    bindings = {k: g[k] for k in ('main', 'apply', 'apply_state', 'plan', 'pose_at',
                                 'challenge_setup', 'answer_state', 'SPANS', 'EVENTS',
                                 'ALL', 'GROUPS', 'BASE', 'CHILDREN')}
    old_scene = bpy.context.window.scene
    other_scene_files = {}
    for s in bpy.data.scenes:
        if s is scene:
            continue
        p = Path(s.render.filepath)
        other_scene_files[s.name] = (s.render.filepath, sha(p) if p.is_file() else None)
    old_render = {'filepath': scene.render.filepath,
                  'format': scene.render.image_settings.file_format,
                  'quality': scene.render.image_settings.quality,
                  'x': scene.render.resolution_x, 'y': scene.render.resolution_y,
                  'percentage': scene.render.resolution_percentage,
                  'samples': scene.eevee.taa_render_samples}
    needle, support, _, _ = g['PARTS']['terrella']['needles'][0]
    halves = [o for o in needle.children if o.type == 'MESH' and len(o.data.vertices) == 4]
    assert len(halves) == 2
    white = next(o for o in halves if min(v.co.y for v in o.data.vertices) < -.011)
    red = next(o for o in halves if max(v.co.y for v in o.data.vertices) > .011)
    geometry_before = {o.name: needle_geometry(o) for o in (white, red)}
    assert white.active_material.name.startswith('b1_surfaceneedle0-1')
    assert any(m.type == 'SOLIDIFY' and abs(m.thickness - .0012) < 1e-9 for m in white.modifiers)
    created = []
    rows, renders = [], []
    started = time.time()
    report = {'episode': 'B-1', 'candidate': 'B3 challenge-only', 'mode': mode,
              'helperSha256': sha(__file__), 'sourceSha256': STAGE_SHA,
              'b2ReportSha256': B2_REPORT_SHA, 'protectedInputSha256': protected,
              'status': 'started_not_approved', 'actualRenders': renders,
              'physical': rows, 'originalGateNGUnchanged': True,
              'scriptVoiceSubtitlesUnchanged': True,
              'noAnswerAdded': True, 'actualEyeReviewStillRequired': True,
              'whiteCorrection': {'sameOriginalIvoryMaterial': True,
                                  'oldSolidifyThicknessMeters': .0012,
                                  'newReadingEdgeThicknessMeters': .0024,
                                  'oldThicknessCenterLocalZ': -.0006,
                                  'newThicknessCenterLocalZ': -.0006,
                                  'blackBorderRadiusMeters': .00014,
                                  'lengthWidthDirectionAndRedHalfUnchanged': True}}
    target.mkdir(parents=True)
    try:
        bpy.context.window.scene = scene
        assert bpy.context.scene is scene
        assert not any(o.name.startswith(PREFIX) for o in scene.objects), 'Previous B3 geometry must not accumulate'
        # Additions only: leave the original white mesh/material/modifier untouched.
        # A symmetric expansion about its old thickness centre makes its genuine
        # edge readable from the unchanged edge-on meridional challenge camera.
        corners = [(-.0025, 0.), (0., -.012), (.0025, 0.)]
        zfront, zback = .0006, -.0018
        verts = [(x, y, z) for z in (zfront, zback) for x, y in corners]
        mesh = bpy.data.meshes.new(PREFIX + 'edge_mesh')
        mesh.from_pydata(verts, [], [(0, 1, 2), (5, 4, 3),
                                    (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)])
        edge = bpy.data.objects.new(PREFIX + 'ivory_edge', mesh)
        d.link(edge)
        edge.data.materials.append(white.active_material)
        edge.parent = white
        edge.matrix_parent_inverse.identity()
        edge.matrix_basis.identity()
        created.append(edge)
        ink = d.mat(PREFIX + 'ink', '#201d19', .65)
        for i, z in enumerate((zfront + .00002, zback - .00002)):
            curve = bpy.data.curves.new(PREFIX + 'outline_curve_' + str(i), 'CURVE')
            curve.dimensions = '3D'
            curve.bevel_depth = .00014
            curve.bevel_resolution = 2
            spl = curve.splines.new('POLY')
            spl.points.add(3)
            for p, (x, y) in zip(spl.points, corners + [corners[0]]):
                p.co = (x, y, z, 1.)
            ob = bpy.data.objects.new(PREFIX + 'outline_' + str(i), curve)
            d.link(ob)
            ob.data.materials.append(ink)
            ob.parent = white
            ob.matrix_parent_inverse.identity()
            ob.matrix_basis.identity()
            created.append(ob)
        riser = bpy.data.objects.get('b1_challenge_riser_20261024')
        assert riser is not None and riser.name in scene.objects
        rr = g['Vector']((math.cos(math.pi / 6), 0., -.5))
        def state(k=None):
            if k is None:
                g['challenge_setup']()
                pose = list(g['DATA']['poses']['challenge'])
                anchors = g['anchors'](actual_frame / 30)
            else:
                anchors = g['apply'](refs[k] / 30)
                pose = physical[k]['pose']
            p = g['PARTS']['terrella']
            needle.location = p['center'] + .112 * rr
            support.location = p['center'] + .108 * rr
            g['place_angle_frame'](needle.location, -30)
            g['pose_b1'](pose)
            d.show(riser, True)
            # The episode's pre-existing children visibility cache cannot include
            # new geometry, so explicitly set only these private new objects.
            for ob in created:
                d.show(ob, True)
            bpy.context.view_layer.update()
            anchors['challengeNeedle'] = needle.location.copy()
            return anchors, pose
        anchor_arrays = json.loads((B2 / 'blender/patch/anchors.json').read_text())
        audit_frames = [actual_source] if mode == 'probe' else frames
        for k in audit_frames:
            aa, pose = state(k)
            points = g['hero_points']('challenge')
            pp = [d.project(v) for v in points]
            assert pp and all(p[2] for p in pp), ('Principal behind camera', k)
            box = [min(p[0] for p in pp), min(p[1] for p in pp), max(p[0] for p in pp), max(p[1] for p in pp)]
            width = (box[2] - box[0]) / 1080
            assert .4 <= width <= .7 and 0 <= box[0] < box[2] <= 1080 and 0 <= box[1] < box[3] <= 1920, (k, width, box)
            edge_pixels = [d.project(edge.matrix_world @ v.co) for v in edge.data.vertices]
            assert all(p[2] and 0 <= p[0] <= 1080 and 0 <= p[1] <= 1920 for p in edge_pixels), ('White reading edge clipped', k)
            differences = []
            projected = {}
            for name, value in aa.items():
                xy = d.project(value)
                old = anchor_arrays['anchors'][name][k]
                assert xy[2] == old[2], ('Anchor visibility changed', k, name)
                differences.extend(abs(xy[i] - old[i]) for i in (0, 1))
                projected[name] = xy
            assert max(differences) <= .11, ('B2 camera/state/anchors changed', k, max(differences))
            for name, xy in projected.items():
                anchor_arrays['anchors'][name][k] = xy
            rows.append({'frame': k, 'unchangedObjectSourceFrame': refs[k],
                         'time': k / 30, 'pose': pose, 'principalBox': box,
                         'principalWidthRatio': width,
                         'whiteReadingEdgeBox': [min(p[0] for p in edge_pixels), min(p[1] for p in edge_pixels), max(p[0] for p in edge_pixels), max(p[1] for p in edge_pixels)],
                         'maxB2AnchorDifferencePixels': max(differences),
                         'originalWhiteAndRedGeometryUnchanged': True})
        scene.render.resolution_x = 1080
        scene.render.resolution_y = 1920
        scene.render.resolution_percentage = 100
        scene.eevee.taa_render_samples = 16
        scene.render.image_settings.quality = 90
        def render_one(path, fmt, k=None):
            assert not os.path.lexists(path)
            aa, pose = state(k)
            scene.render.image_settings.file_format = fmt
            scene.render.filepath = str(path)
            assert bpy.context.scene is scene
            bpy.ops.render.render(write_still=True, scene=scene.name)
            assert path.is_file() and path.stat().st_size > 1000
            renders.append({'file': str(path), 'sha256': sha(path), 'format': fmt,
                            'sourceFrame': k, 'unchangedObjectSourceFrame': None if k is None else refs[k],
                            'pose': pose})
            return aa
        if mode == 'probe':
            render_one(target / 'challenge-problem.png', 'PNG')
            aa = render_one(target / 'actual-339500.jpg', 'JPEG', actual_source)
            for name, v in aa.items():
                anchor_arrays['anchors'][name][actual_frame] = d.project(v)
            write_new(target / 'anchors.json', anchor_arrays)
            report['actualOutputFrame'] = actual_frame
            report['actualHeldSourceFrame'] = actual_source
            report['status'] = 'two_actual_probes_pending_eye_review'
        else:
            raw = target / 'blender/patch'
            raw.mkdir(parents=True)
            for k in frames:
                render_one(raw / ('%05d.jpg' % k), 'JPEG', k)
                print('B3 CHALLENGE FRAME', k, flush=True)
            write_new(raw / 'anchors.json', anchor_arrays)
            render_one(target / 'challenge-problem.png', 'PNG')
            report.update({'status': 'render_complete_pending_actual_final_review',
                           'fps': 30, 'frames': cp['frames'], 'raw': str(raw),
                           'patchFrames': frames,
                           'replacementFrameToActualPatchFrame': challenge_outputs,
                           'patchFrameToUnchangedObjectSourceFrame': {k: refs[k] for k in frames},
                           'allPatchFramesActuallyRendered': True,
                           'probeReportSha256': probe_report_sha256,
                           'visualProbeApprovalProvidedByRoot': True,
                           'earlierB2AnswerPngUnchanged': str(B2 / 'problem/答え.png')})
        return report
    except BaseException as e:
        report['status'] = 'failed_not_waived'
        report['error'] = {'type': type(e).__name__, 'message': str(e)}
        raise
    finally:
        # Keep additions hidden when not explicitly evaluating this challenge.
        for ob in created:
            d.show(ob, False)
        if 'riser' in locals():
            d.show(riser, False)
        # These exact three additions were made by this call and have no entry
        # in the frozen visibility/BASE caches. Remove only these private new
        # objects/data, so an approved render can safely rebuild the same edge
        # after its probe without accumulating geometry in the live scene.
        for ob in created:
            data, kind = ob.data, ob.type
            assert ob.name.startswith(PREFIX)
            bpy.data.objects.remove(ob, do_unlink=True)
            if data.users == 0:
                if kind == 'MESH':
                    bpy.data.meshes.remove(data)
                elif kind == 'CURVE':
                    bpy.data.curves.remove(data)
        scene.render.filepath = old_render['filepath']
        scene.render.image_settings.file_format = old_render['format']
        scene.render.image_settings.quality = old_render['quality']
        scene.render.resolution_x = old_render['x']
        scene.render.resolution_y = old_render['y']
        scene.render.resolution_percentage = old_render['percentage']
        scene.eevee.taa_render_samples = old_render['samples']
        bpy.context.window.scene = old_scene
        checks = {'protectedInputShaUnchanged': all(sha(p) == h for p, h in protected.items()),
                  'originalAndB2RawInventoryUnchanged': all(inventory(p) == rows0 for p, rows0 in raw_before.items()),
                  'originalWhiteAndRedGeometryUnchanged': all(needle_geometry(o) == geometry_before[o.name] for o in (white, red)),
                  'originalFunctionAndControlBindingsUnchanged': all(g[k] is v for k, v in bindings.items()),
                  'visibilityQueueClosed': g['VIS_QUEUE'] is None,
                  'otherScenesUnchanged': all(bpy.data.scenes[n].render.filepath == p and (h is None or sha(p) == h) for n, (p, h) in other_scene_files.items())}
        report['protectionChecks'] = checks
        report['seconds'] = round(time.time() - started, 3)
        write_new(target / 'report.json', report)
        assert all(checks.values()), ('B3 protection failure', checks)
        print('B3', report['status'], str(target / 'report.json'), flush=True)
