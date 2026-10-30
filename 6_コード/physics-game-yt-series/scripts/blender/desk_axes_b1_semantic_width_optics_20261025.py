"""Inert, ROOT-only B-1 three-phase lens repair; original media immutable.

Exact B160 reconstruction and normal-evaluation/RNA recovery are retained by
three declared, reversible source boundaries. Only focal length changes.
Audit renders nothing; probe/render require the pinned successful audit.
No object, voice, subtitle, common component, source checker or source raw edit.
"""
import hashlib
import json
import math
import os
from pathlib import Path
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE_HELPER = W/'scripts/blender/desk_axes_b1_exact_visible_primary_audit_20261025.py'
BASE_HELPER_SHA = 'f45e7840d5f7d4ddd12331e38b4fdec88a2c9f8ec8d079c29987055737ff11cd'
BASE_REPORT = Path('/private/tmp/ys/ys-chain-b1v1-exact-visible-primary-audit-20261025/report.json')
BASE_REPORT_SHA = '2f6c4df22e67c13af81ae37701b18305d67f09c62544c875908fa235929ddbaa'
ROLE_SOURCE = W/'scripts/blender/desk_axes_b1_camera_patch_v2_20261024.py'
ROLE_SOURCE_SHA = '459667d5c7d53a515ac9b37f2df60ac1a892dd9e77e7e42808d25ad4b30dc94d'
ROOT = Path('/private/tmp/ys/ys-chain-b1v1-semantic-width-optics-20261025')
PROBES = (3251, 4825, 4932, 8953)
NEIGHBORS = (3168, 3441, 4824, 4940, 4941, 8952, 8976)


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def read(path):
    return json.loads(Path(path).read_text())


def lens_scale(j):
    if 3169 <= j <= 3440:
        return 39/40
    if 4825 <= j <= 4916:
        return 36.8/40
    if 4917 <= j <= 4940:
        u = max(0., min(1., (j-4917)/23))
        return (36.8+3.2*u*u*(3-2*u))/40
    if 8953 <= j <= 8975:
        return 44/40
    return 1.


def compact(p):
    names = [o['name'] for o in p.get('objects', [])]
    return {**{k: v for k, v in p.items() if k != 'objects'}, 'evaluatedObjectNames': names}


def semantic_existing(state):
    return state['secondary']['ironParticlesAndFieldArrows'] if state['row'] in (22, 23) else state['primary']


def strict_report(report):
    return (not report.get('error') and not report['cleanupError'] and not report['restorationOffenders']
            and bool(report['protectionChecks']) and all(v is True for v in report['protectionChecks'].values()))


def select_namespace(session):
    assert sha(BASE_HELPER) == BASE_HELPER_SHA
    return runpy.run_path(str(BASE_HELPER))['select_namespace'](session)


class Driver:
    def __init__(self, mode, helper_sha, audit_sha, probe_sha, visually_approved):
        self.mode, self.helper_sha = mode, helper_sha
        self.out = ROOT/mode
        assert mode in ('audit', 'probe', 'render') and not os.path.lexists(self.out)
        assert not ROOT.is_symlink()
        assert sha(BASE_HELPER) == BASE_HELPER_SHA and sha(BASE_REPORT) == BASE_REPORT_SHA
        assert sha(ROLE_SOURCE) == ROLE_SOURCE_SHA
        self.base = read(BASE_REPORT)
        assert strict_report(self.base) and self.base['completedMeasurements']
        assert len(self.base['states']) == 4047 and len(self.base['frameMap']) == 10700
        self.audit = None
        if mode != 'audit':
            path = ROOT/'audit/report.json'
            assert audit_sha and sha(path) == audit_sha
            self.audit = read(path)
            assert strict_report(self.audit) and self.audit['allGuardedStatesPass']
            assert self.audit['helperSha256'] == helper_sha and self.audit['actualRenderCount'] == 0
        if mode == 'render':
            path = ROOT/'probe/report.json'
            assert visually_approved is True and probe_sha and sha(path) == probe_sha
            probe = read(path)
            assert strict_report(probe) and probe['allGuardedStatesPass']
            assert probe['helperSha256'] == helper_sha and probe['actualRenderCount'] == len(PROBES)
        self.changed = [j for j in range(10700) if lens_scale(j) != 1.]
        assert len(self.changed) == 410 and 4940 not in self.changed
        self.replacements, self.representatives = {}, {}
        for j in self.changed:
            key = self.key(j)
            self.replacements[j] = self.representatives.setdefault(key, j)
        assert len(self.representatives) == 262

    def key(self, j):
        return json.dumps([self.base['frameMap'][j]['stateIndex'], lens_scale(j)], separators=(',', ':'))

    def pose(self, g, old_pose, j):
        g['pose_b1'](old_pose)
        cam = g['d'].CAM_D
        assert cam.type == 'PERSP' and cam.shift_x == cam.shift_y == 0
        before = (cam.dof.focus_distance, cam.dof.aperture_fstop)
        cam.lens *= lens_scale(j)
        assert before == (cam.dof.focus_distance, cam.dof.aperture_fstop)

    def write(self, path, data):
        assert path.is_relative_to(self.out) and not os.path.lexists(path)
        assert not any(p.is_symlink() for p in path.parents if p.exists())
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open('x') as stream:
            json.dump(data, stream, ensure_ascii=False, indent=1, allow_nan=False)
            stream.write('\n')

    def execute(self, g, reconstruct, primary, measure, records, poses, historical, report):
        d, bpy = g['d'], g['bpy']
        report.update(kind='B-1 fixed phase optics, exact source replay', mode=self.mode,
                      baseFullEvaluation=str(BASE_REPORT), baseFullEvaluationSha256=BASE_REPORT_SHA,
                      all10700OriginalSourceRecipesMapped=True,
                      threeExplicitBoundariesInverseByteExact=True, sourceBoundaries=self.boundaries,
                      objectStateVoiceCaptionsAndFocusUnchanged=True,
                      onlyFocalLengthDerivative=True, geometryQualityThresholdsUnchanged=True,
                      originalInspectorNGPreserved=True, actualImages=[], physical=[],
                      powderPrincipal='Actual evaluated particles and visible arrows, not ideal lines, transparent board or smaller central stone',
                      powderRoleSource=str(ROLE_SOURCE), powderRoleSourceSha256=ROLE_SOURCE_SHA,
                      changedOutputFrames=self.changed, replacementFrameToActualPatchFrame=self.replacements,
                      plannedActualSources=262, allGuardedStatesPass=False,
                      actualCompositeCollisionReviewPending=True, finalAcceptance=False)
        if self.mode == 'audit':
            selected = sorted(set(self.changed+list(NEIGHBORS)+self.base['halfSecondFrames']+self.base['exactNonHalfBoundaryFrames']))
        elif self.mode == 'probe':
            selected = list(PROBES)
        else:
            selected = sorted(self.representatives.values())
        updated, anchors, evaluated = {}, {}, {}
        audit_cases = {p['recipeKey']: p for p in self.audit['physical']} if self.audit else {}
        for j in selected:
            assert not Path('/private/tmp/ys/axes-active-queue/cancel').exists(), 'Root requested cancellation'
            key = self.key(j)
            if key in evaluated:
                continue
            aa, family, source, ref, operation = reconstruct(j)
            cue = g['cue_at'](j/30)
            definition, objects, secondary = primary(cue)
            if cue['row'] in (22, 23):
                definition = report['powderPrincipal']
                objects = secondary['ironParticlesAndFieldArrows']
            p = compact(measure(objects))
            assert p['presentInRenderState'] and p.get('allVerticesInFrontCamera')
            assert p['within40to70'] and p['insideFullFrame'] and p['insideInstructionSafeFrame'], ('Actual semantic primary outside unchanged limits', j, p)
            pose = poses[j][:]
            pose[-1] *= lens_scale(j)
            anchor = {name: d.project(v) for name, v in aa.items()}
            case = dict(frame=j, recipeKey=key, sourceFamily=family, source=str(source),
                        sourceSha256=records[j]['sha256'], otherObjectReference=ref,
                        operationSourceFrame=operation, pose=pose, lensScale=lens_scale(j),
                        cue=cue['key'], row=cue['row'], principalDefinition=definition,
                        primary=p, anchorProjections=anchor,
                        face=self.base['frameMap'][j]['face'])
            if self.audit:
                expected = audit_cases[key]
                for field in ('sourceSha256', 'otherObjectReference', 'operationSourceFrame', 'pose', 'primary', 'anchorProjections'):
                    assert case[field] == expected[field], ('Fresh state differs from audit', j, field)
            report['physical'].append(case)
            evaluated[key] = case
            if j in self.changed:
                updated[key] = p
            if self.mode != 'audit':
                raw = self.out/'raw'/f'{j:05d}.jpg'
                assert raw.is_relative_to(self.out) and not os.path.lexists(raw)
                raw.parent.mkdir(parents=True, exist_ok=True)
                scene = d.SC
                scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1080, 1920, 100
                scene.render.image_settings.file_format = 'JPEG'
                scene.render.image_settings.quality = 95
                scene.eevee.taa_render_samples = 16
                scene.render.filepath = str(raw)
                result = bpy.ops.render.render(write_still=True)
                assert result == {'FINISHED'} and raw.is_file()
                report['actualImages'].append(dict(frame=j, path=str(raw), sha256=sha(raw), recipeKey=key))
                anchors[str(j)] = anchor
            if len(evaluated) % 25 == 0:
                print('B1 fixed-phase optics', self.mode, len(evaluated), '/', len(selected), 'selected frames', flush=True)
        final = []
        for j in range(10700):
            base_state = self.base['states'][self.base['frameMap'][j]['stateIndex']]
            if j in self.changed:
                key = self.key(j)
                p = updated.get(key)
                if p is None:
                    assert self.mode == 'probe'
                    p = audit_cases[key]['primary']
                origin = 'fresh-this-operation' if key in updated else 'exact-approved-zero-render-audit'
            else:
                p = compact(semantic_existing(base_state))
                origin = 'retained-unchanged-exact-B160-evaluation'
            face = self.base['frameMap'][j]['face']
            eligible = face['kind'] != 'full_face_opaque'
            if eligible:
                assert p['presentInRenderState'] and p.get('allVerticesInFrontCamera') and p['within40to70']
                assert p['insideFullFrame'] and p['insideInstructionSafeFrame'], ('Unrepaired actual semantic primary', j)
            final.append(dict(frame=j, primary={k: v for k, v in p.items() if k != 'evaluatedObjectNames'},
                              source=origin, sourceStateIndex=self.base['frameMap'][j]['stateIndex'],
                              faceKind=face['kind'], faceOpacity=face['svgOpacity'], eligible3D=eligible))
        report.update(all10700SemanticPhysical=final, all10700SemanticPhysicalChecked=True,
                      freshlyEvaluatedRecipeCount=len(evaluated), evaluatedFrames=selected,
                      original714And45BoundariesFreshlyReplayed=self.mode == 'audit',
                      allGuardedStatesPass=True, actualRenderCount=len(report['actualImages']),
                      renders=len(report['actualImages']), originalCompleteFramesUnchanged=True)
        if self.mode == 'render':
            assert report['actualRenderCount'] == 262
            assert set(int(j) for j in anchors) == set(self.representatives.values())
        elif self.mode == 'probe':
            assert report['actualRenderCount'] == 4
        if self.mode != 'audit':
            self.write(self.out/'anchor-projections.json', anchors)
        return report


def run(ns, authorized=False, *, mode='audit', expected_helper_sha256,
        approved_audit_sha256=None, approved_probe_sha256=None,
        visually_approved=False, namespace_name=None):
    assert authorized is True and sha(__file__) == expected_helper_sha256
    driver = Driver(mode, expected_helper_sha256, approved_audit_sha256, approved_probe_sha256, visually_approved)
    boundaries = [
        ("OUT = Path('/private/tmp/ys/ys-chain-b1v1-exact-visible-primary-audit-20261025')", 'OUT = _driver.out'),
        ("            g['pose_b1'](poses[j])", "            _driver.pose(g, poses[j], j)"),
        ('        face_by_frame = [None]*10700', '        return _driver.execute(g, reconstruct, primary, measure, records, poses, historical, report)\n\n        face_by_frame = [None]*10700'),
    ]
    source = BASE_HELPER.read_text()
    original = source
    for before, after in boundaries:
        assert source.count(before) == 1
        source = source.replace(before, after, 1)
    inverse = source
    for before, after in reversed(boundaries):
        assert inverse.count(after) == 1
        inverse = inverse.replace(after, before, 1)
    assert inverse == original
    driver.boundaries = [dict(before=a, after=b) for a, b in boundaries]
    private = {'__name__': '_b1_fixed_optics_private', '__file__': str(Path(__file__).resolve()), '_driver': driver}
    exec(compile(source, str(BASE_HELPER)+' [three explicit focal/dispatch/output boundaries]', 'exec'), private)
    private['PINS'].update({BASE_HELPER: BASE_HELPER_SHA, BASE_REPORT: BASE_REPORT_SHA,
                            ROLE_SOURCE: ROLE_SOURCE_SHA, Path(__file__).resolve(): expected_helper_sha256})
    return private['run'](ns, authorized=True, expected_helper_sha256=expected_helper_sha256, namespace_name=namespace_name)
