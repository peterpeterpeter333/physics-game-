"""Root-dispatch-only six-still D-1 trial. Merely importing does not run it.

Invoke run(nsD1, authorized=True) from the sole GPU dispatcher after review.
Old source/cache/report/raw files remain immutable. This is a probe, not an
episode render or a replacement of any retained NG or sourcebox/anchor record.
"""
import hashlib
import json
from pathlib import Path
import runpy
import subprocess
import types

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL = Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
BASE = Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
PIER = Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025')
OUT = Path('/private/tmp/ys/ys-chain-d1v1-original-ng-probe-v1-20261025')
PINS = {
    W/'scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py': 'bc91b1089c3714378cbd98bd39229f288b0e6cf7f7011a492e85d3df7cccbcf7',
    W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py': '7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a',
    W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py': '4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479',
    FINAL/'final-composite-physical-v6-actual-anchor-evidence-20261025.json': '9bcc39fda77012cff9154c8cc21703ba2a92480f924416df105fb560cc97faf6',
    PIER/'render/report.json': 'c593cfd18032e5c7f1a88dc473a73ce8e422750f47955e1dec05203c06ef1c87',
}
FFMPEG = '/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def original_image_features(path, inspector):
    import numpy as np
    result = subprocess.run([FFMPEG, '-v', 'error', '-i', str(path), '-vf',
                             'scale=270:480:flags=area', '-f', 'rawvideo',
                             '-pix_fmt', 'rgb24', '-'], check=True, capture_output=True)
    assert len(result.stdout) == 270 * 480 * 3
    image = np.frombuffer(result.stdout, np.uint8).reshape(480, 270, 3)
    return dict(zip(inspector['FEATS'], inspector['features'](image)))


def run(ns, authorized=False):
    assert authorized is True, 'Only the root GPU dispatcher may execute this probe'
    assert not OUT.exists() and not OUT.is_symlink(), 'Preserve every existing probe'
    for p, expected in PINS.items():
        assert sha(p) == expected, str(p)
    helper = W/'scripts/blender/desk_axes_d1_original_ng_variants_20261025.py'
    variant = runpy.run_path(str(helper))
    inspector_path = W/'scripts/umech/desk-quality-gate-frames.py'
    inspector_sha256 = sha(inspector_path)
    inspector = runpy.run_path(str(inspector_path))
    retained = read(FINAL/'final-composite-physical-v6-actual-anchor-evidence-20261025.json')
    rows = read(FINAL/'blender/delivered-provenance.json')['frames']
    physical = {round(r['time'] * 30): r for r in retained['rows']}
    assert len(rows) == 12163
    images = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'))
    audit = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'))
    recovery = runpy.run_path(str(W/'scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py'))
    pier = read(PIER/'render/report.json')
    load = images['load_audit']
    owned_load = types.FunctionType(load.__code__, {**load.__globals__, 'OUT': PIER}, load.__name__, load.__defaults__, load.__closure__)
    _, states, _ = owned_load(Path(pier['auditReport']), pier['auditReportSha256'])
    OUT.mkdir(parents=True)
    ctx = None
    report = dict(episode='D-1', mode='six-camera-only-feasibility-stills', helperSha256=sha(helper),
                  runnerSha256=sha(__file__), renders=0, trials=[], originalNGPreserved=True,
                  originalImageInspector=str(inspector_path), originalImageInspectorSha256=inspector_sha256,
                  originalHistoricalAnchorAndSourceboxDiagnosticsPreserved=True,
                  materialGeometryTimingAndTextChanges=0, earsVerified=False,
                  unchangedOverlayCaptionAndFaceCompositeStillPending=True,
                  automaticApproval=False, finalAcceptance=False)
    raw_pins = {rows[t['frame']]['raw']: sha(rows[t['frame']]['raw']) for t in variant['TRIALS']}
    settings = None
    try:
        ctx = recovery['DeliveredReplay'](ns, cache=BASE)
        ctx.open()
        g, d, bpy = ctx.g, ctx.d, ctx.bpy
        scene = d.SC
        settings = dict(filepath=scene.render.filepath, resolution_x=scene.render.resolution_x,
                        resolution_y=scene.render.resolution_y, resolution_percentage=scene.render.resolution_percentage,
                        file_format=scene.render.image_settings.file_format, samples=scene.cycles.samples)
        for trial in variant['TRIALS']:
            j = trial['frame']
            row = rows[j]
            # The six selected stills include actual final pier sources but no
            # four-cue-camera source. Do not accidentally replay a newer layer
            # with the old layer's model state.
            assert row['layer'] != 'four-cue-camera'
            if row['layer'] == 'pier-contact':
                fresh, _ = images['apply_checked'](ctx, audit, states[row['actualFrame']])
                assert fresh['pass']
            else:
                ctx.replay(row)
            source_t = row['unchangedOtherObjectSourceFrame'] / 30
            cue = g['cue_at'](j / 30)
            role, objects, critical = ctx.tools['principal'](cue, source_t)
            before = {o: audit['object_state'](o) for o in scene.objects if o is not d.CAM}
            result = variant['apply_trial'](ctx, trial, row['pose'], objects, critical)
            assert all(audit['object_state'](o) == s for o, s in before.items()), 'A camera trial changed a model/hand/material'
            result.update(sourceDeliveredRow=row, semanticPrincipal=role,
                          previousExactPhysicalWidth=physical[j]['actualSurface']['widthRatio'],
                          oldRaw=row['raw'], oldRawSha256=raw_pins[row['raw']],
                          oldOriginalImageFeatures=original_image_features(row['raw'], inspector))
            if result['feasible']:
                output = OUT/('%s-%05d.jpg' % (trial['name'], j))
                assert not output.exists()
                scene.render.resolution_x = 1080
                scene.render.resolution_y = 1920
                scene.render.resolution_percentage = 100
                scene.render.image_settings.file_format = 'JPEG'
                scene.cycles.samples = 16
                scene.render.filepath = str(output)
                bpy.ops.render.render(write_still=True)
                assert output.is_file()
                result.update(rendered=True, image=str(output), imageSha256=sha(output))
                result['newOriginalImageFeatures'] = original_image_features(output, inspector)
                report['renders'] += 1
            report['trials'].append(result)
    except BaseException as error:
        report['error'] = dict(type=type(error).__name__, message=str(error))
        raise
    finally:
        cleanup_failure = None
        if ctx is not None:
            if settings is not None:
                scene = ctx.d.SC
                for key in ('filepath', 'resolution_x', 'resolution_y', 'resolution_percentage'):
                    setattr(scene.render, key, settings[key])
                scene.render.image_settings.file_format = settings['file_format']
                scene.cycles.samples = settings['samples']
            try:
                report['protectionChecks'] = ctx.close()
                report['strictRestorationEvidence'] = ctx.transformRestorationReport
                assert all(v is True for v in report['protectionChecks'].values())
            except BaseException as error:
                report['cleanupError'] = dict(type=type(error).__name__, message=str(error))
                cleanup_failure = error
        assert all(sha(p) == h for p, h in raw_pins.items())
        assert all(sha(p) == h for p, h in PINS.items())
        assert sha(inspector_path) == inspector_sha256
        report['oldRawAndPinnedSourcesUnchanged'] = True
        with (OUT/'report.json').open('x') as f:
            json.dump(report, f, ensure_ascii=False, indent=1, allow_nan=False)
        if cleanup_failure is not None:
            raise cleanup_failure
    return report
