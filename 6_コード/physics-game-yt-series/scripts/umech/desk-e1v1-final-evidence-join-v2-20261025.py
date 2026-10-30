"""CPU-only exact E final evidence join v2; NEVER a replacement quality gate.

Requires the actual final encode, ORIGINAL seven inspections, actual-MP4 review,
and completed original/camera15/local2/actions provenance. Missing --eyes means
EVERY row remains pending. No image decoding, render, encode, source edits,
threshold changes, inferred human viewing, or automatic NG waiver is performed.
An optional root JSON must pin this MP4, review manifest and each viewed JPEG.
Output is a NEW exclusive evidence file, never an existing report replacement.
"""
import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import shutil
import subprocess
import sys

import numpy as np

W = Path(__file__).resolve().parents[2]
ID = 'ys-chain-e1v1'
NF, FPS, HALF = 11606, 30, 774
BASE = Path('/private/tmp/ys/ys-chain-e1v1')
FINAL = Path('/private/tmp/ys/ys-chain-e1v1-final-20261024')
COMMON = Path('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/07_軸の1本目_共通の制作指示.md')
GATE = W/'scripts/umech/desk-quality-gate.mjs'
FRAME_GATE = W/'scripts/umech/desk-quality-gate-frames.py'
FACE_HELPER = W/'scripts/umech/desk-e1v1-final-face-evidence-20261025.mjs'
FEATURES = ['wall_band', 'window', 'wood', 'wood_top', 'busy', 'subject']
THRESHOLDS = ('step', 'sparseWood', 'sparseBusy', 'sparseMax',
              'subjectMedian', 'subjectSmall', 'subjectSmallMax')
EYE_FLAGS = ('correctPrincipal', 'visibleReadable', 'unoccluded',
             'captionClear', 'geometryDefinitionAccepted')
PINS = {
    FACE_HELPER: '98b20270f189d9e6154859c250d14f889ddf823696c6b5d2cff1836e21b11ca6',
    W/'scripts/umech/desk-e1v1-final-evidence-join-20261025.py': 'ce5a88ba7a5151e07859fa5cc388d42d3b093f9945fb39dd79768dce52e4631a',
    GATE: '34bf299c1f3b53be622b79d01e19284023cc6f64b14c9d5ec88ead5829748308',
    FRAME_GATE: '545c7f442c9b7feb1bbfed86543def04d6e6f1cf2638d31bc640a39bd1a4e1bb',
    W/'scripts/umech/desk-e1v1-final-assemble-20261024.mjs': 'b4d6ee93ef8edf51a1013c4cda4d8c01b086720335d48a77fa3b5251e5259ad6',
    W/'scripts/umech/desk-frame.mjs': '1174d49f123e2dcf614143f617c2483d3086be4b38ff51bfe8d0be721447022f',
    W/'scripts/umech/yt1-chain-00bx-common.mjs': '0bb9b91aeb294edb19f3ef4ffc686186a4df2768be0090e1dd4713c630aaeb4d',
    W/'scripts/umech/desk-axes-frame.mjs': '83ecc4aea70b71b21b42af52a7020c5a7cb448c32b7eab3becb06380d7f29edb',
    W/'scripts/umech/desk-axes-final-checks.mjs': '4eb235cdc0dea4f1691a87090522807acd903a74ce0c5b6736c21cf3807d783a',
    W/'scripts/umech/desk-e1v1-exact-final-quality-loader-20261025.mjs': 'c17bd206977d5bd3d6c7edd54b4965f1b346b7238a0cc6a887b8924f774b434e',
    W/'scripts/umech/desk-e1v1-exact-final-checks-20261025.mjs': '60ab758bc60bcec8f3a8ab33a245175e21ca0893fc1b8951e51a198b9dd97065',
}
HELPERS = {
    'camera15': ('scripts/blender/desk_axes_e1_camera_patch_20261024.py', 'eb13699fd997113f3fa3a3ab4b2f4856367d4f160f05726b196228a260eb9f2c'),
    'local2': ('scripts/blender/desk_axes_e1_local_fit_20261024.py', '1b6bbbe9e3614df7f84a2543eab649aa4dd7d383d04badbba22a666de29c4395'),
    'actions': ('scripts/blender/desk_axes_e1_actions_final_20261024.py', 'e74ac58891ff2768dab426974b71a5207a07f0a207ef25575e6fee658bd5cd83'),
}
KINDS = {
    'camera15': 'actual-inter-site-camera-only-correction',
    'local2': 'actual-same-site-distance-only-correction',
    'actions': 'actual-approved-action-and-accident-light-derivatives',
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read(path):
    return json.loads(Path(path).read_text())


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            h.update(block)
    return h.hexdigest()


def resolved(path):
    return Path(path) if Path(path).is_absolute() else W/path


def close_vector(a, b, size, tol=1e-9):
    return (len(a) == len(b) == size and all(math.isfinite(float(x)) and
            math.isfinite(float(y)) and abs(x-y) <= tol for x, y in zip(a, b)))


def indexed(rows, field='frame'):
    answer = {r[field]: r for r in rows}
    require(len(answer) == len(rows), 'Duplicate evidence '+field)
    return answer


def runs(mask, step=.5):
    answer, start = [], None
    for i, flag in enumerate(list(mask)+[False]):
        if flag and start is None:
            start = i
        if not flag and start is not None:
            answer.append([round(start*step, 2), round((i-start)*step, 2)])
            start = None
    return sorted(answer, key=lambda item: -item[1])


def original_thresholds():
    text = re.sub(r'//[^\n]*', '', GATE.read_text())
    answer = {}
    for key in THRESHOLDS:
        values = re.findall(r'\b'+key+r'\s*:\s*([\d.]+)', text)
        require(len(values) == 1, 'Original threshold is not unique: '+key)
        answer[key] = float(values[0])
    require(answer['step'] == .5, 'Only exact original half-second grid supported')
    return answer


def original_summary(features, th):
    subject = features[:, FEATURES.index('subject')]
    sparse = ((features[:, FEATURES.index('wood')] > th['sparseWood']) &
              (features[:, FEATURES.index('busy')] < th['sparseBusy']))
    sparse_runs, small_runs = runs(sparse), runs(subject < th['subjectSmall'])
    median = round(float(np.median(subject)), 4)
    small_ratio = round(float((subject < th['subjectSmall']).mean()), 4)
    longest = sparse_runs[0][1] if sparse_runs else 0
    return {'samples': len(features), 'subject_median': median,
            'subject_small_ratio': small_ratio, 'subject_small_runs': small_runs[:6],
            'sparse_longest': longest, 'sparse_ratio': round(float(sparse.mean()), 4),
            'sparse_runs': sparse_runs[:5],
            'gate7OriginalStatus': 'OK' if longest < th['sparseMax'] else 'NG',
            'gate7bOriginalStatus': 'OK' if median >= th['subjectMedian'] and
             small_ratio <= th['subjectSmallMax'] else 'NG',
            'allSparseRunsForWrittenRule': sparse_runs}


def eye_disposition(row, decision):
    result = {'status': 'pending', 'actuallyViewed': False,
              'approvedSupplement': False, 'originalNGChanged': False}
    if decision is None:
        return result
    require(decision.get('frame') == row['frame'] and
            decision.get('actualJpegSha256') == row['actualJpegSha256'],
            'Eye decision must pin this exact encoded JPEG/frame')
    require(decision.get('reviewer') == 'root', 'Only a separately supplied root decision is accepted')
    viewed = decision.get('actuallyViewed') is True
    result.update(status='viewed' if viewed else 'pending', actuallyViewed=viewed,
                  suppliedRootDecision=decision)
    if decision.get('approvedSupplement'):
        require(viewed and all(decision.get(k) is True for k in EYE_FLAGS),
                'No complete actual-eye findings; cannot approve a supplement')
        require(row['originalPointCandidate'], 'Do not label non-candidates as original NG exceptions')
        if row['faceEvidence']['anyVisibleFullScreenFace']:
            require(decision.get('faceCompositeAcceptedAsIntendedPrincipal') is True and
                    decision.get('underlying3DVisibilityNotClaimed') is True,
                    'A full-screen face requires its OWN actual-composite rationale, not hidden 3D width')
        else:
            require(row['physical']['within40to70'] and not row['physical']['clipped'] and
                    not row['physical']['outsidePrincipalSafeArea'],
                    'A real unsafe/size/clip defect cannot be approved as a proxy discrepancy')
        result['approvedSupplement'] = True
    return result


def self_test():
    require(runs([False, True, True, False]) == [[.5, 1.]], 'Exact run convention')
    require(runs([True]*4) == [[0., 2.]], 'Written two-second boundary included')
    row = {'frame': 15, 'actualJpegSha256': 'synthetic', 'originalPointCandidate': True,
           'faceEvidence': {'anyVisibleFullScreenFace': False},
           'physical': {'within40to70': True, 'clipped': False, 'outsidePrincipalSafeArea': False}}
    require(eye_disposition(row, None)['status'] == 'pending', 'Missing eyes cannot become viewed')
    decision = {'frame': 15, 'actualJpegSha256': 'synthetic', 'reviewer': 'root',
                'actuallyViewed': True, 'approvedSupplement': True, **{k: True for k in EYE_FLAGS}}
    require(eye_disposition(row, decision)['approvedSupplement'], 'Explicit complete decision')
    for changed_row, changed in [
            (row, {**decision, 'actualJpegSha256': 'wrong'}),
            (row, {**decision, 'actuallyViewed': False}),
            (row, {**decision, 'reviewer': 'hash-only'}),
            ({**row, 'physical': {**row['physical'], 'clipped': True}}, decision),
            ({**row, 'faceEvidence': {'anyVisibleFullScreenFace': True}}, decision)]:
        try:
            eye_disposition(changed_row, changed)
        except ValueError:
            pass
        else:
            raise AssertionError('Invalid root decision accepted')
    face_row = {**row, 'faceEvidence': {'anyVisibleFullScreenFace': True}}
    require(eye_disposition(face_row, {**decision,
        'faceCompositeAcceptedAsIntendedPrincipal': True,
        'underlying3DVisibilityNotClaimed': True})['approvedSupplement'], 'Explicit face-only rationale')
    th = {'sparseWood': .85, 'sparseBusy': .02, 'sparseMax': 4.,
          'subjectSmall': .35, 'subjectMedian': .6, 'subjectSmallMax': .2}
    features = np.zeros((8, 6));features[:, 5] = .65;features[:4, 2] = .9
    summary = original_summary(features, th)
    require(summary['gate7OriginalStatus'] == 'OK' and
            summary['allSparseRunsForWrittenRule'] == [[0., 2.]],
            'Written two seconds must remain a candidate even when original four-second gate passes')
    print(json.dumps({'selfTest': 'PASS', 'syntheticOnly': True,
                      'productionEvidenceRead': False, 'imagesViewed': 0,
                      'renders': 0, 'encodes': 0, 'finalAcceptance': False}))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--self-test', action='store_true')
    ap.add_argument('--final', type=Path, default=FINAL)
    for key in ('manifest', 'npz', 'quality', 'eyes', 'out'):
        ap.add_argument('--'+key, type=Path)
    ap.add_argument('--node', default=shutil.which('node'))
    args = ap.parse_args()
    if args.self_test:
        self_test();return
    C = args.final
    require(C == FINAL, 'This derivative is for the one approved E final cache only')
    out = args.out or C/'e1-final-original7-7b-written2s-evidence-v2-20261025.json'
    require(not out.exists() and not out.is_symlink() and out.parent.is_dir(), 'NEW exclusive output required')
    manifest = args.manifest or C/'actual-mp4-review/manifest.json'
    npz = args.npz or C/'validation-final-v1/quality-frames-original.npz'
    quality = args.quality or npz.parent/'quality-gate.json'
    paths = [manifest, npz, quality, C/'prepared.json', C/'export.json',
             C/'e1-exact-compositor-validation-loader-20261025.json',
             C/'validation-final-v1/caption165-authorization.json',
             C/'composite-provenance.json', C/'final-held-dimensions.json',
             C/'blender/delivered-camera-poses.json', C/'blender/data.json',
             C/'plan.json', C/'phrase-times.json', C/(ID+'.json'),
             BASE/'e1v1-final-plan-receipt-20261024.json', FACE_HELPER, COMMON, Path(__file__), *PINS]
    if args.eyes:
        paths.append(args.eyes)
    require(all(p.is_file() for p in paths), 'Wait for completed final encode/checks/review; no nominal fallback')
    frozen = {str(p.resolve()): sha(p) for p in paths}
    def protect(p, h=None):
        p = resolved(p)
        actual = sha(p)
        require(h is None or actual == h, 'Protected source changed: '+str(p))
        require(str(p.resolve()) not in frozen or frozen[str(p.resolve())] == actual, 'Conflicting protected hash')
        frozen[str(p.resolve())] = actual
    for p, h in PINS.items():
        protect(p, h)
    require('- 物の少ない画面（机の木目ばかり）を、2秒以上続けない。' in COMMON.read_text(),
            'Written two-second source rule changed; manual reconsideration required')
    prepared, exp, prov, dims, m, q = [read(p) for p in (
        C/'prepared.json', C/'export.json', C/'composite-provenance.json',
        C/'final-held-dimensions.json', manifest, quality)]
    require(prepared['id'] == exp['id'] == prov['id'] == m['id'] == q['id'] == ID, 'Wrong episode')
    require(prepared['cache'] == str(C) and prepared['frames'] == NF and prepared['fps'] == FPS,
            'Wrong prepared final cache')
    for relative, h in prepared['outputHashes'].items():
        protect(C/relative, h)
    for p, h in prepared['protectedInputSha256'].items():
        protect(p, h)
    require(exp['preparedSha256'] == sha(C/'prepared.json'), 'Export used another preparation')
    video = Path(m['video'])
    require(video.resolve() == Path(exp['video']).resolve() == Path(q['mp4']).resolve(),
            'Review, encoder and original inspector must describe the SAME actual MP4')
    protect(video, exp['sha256'])
    require(m['videoSha256'] == exp['sha256'] and m['provenanceSha256'] == sha(C/'composite-provenance.json'),
            'Review provenance/video pin disagreement')
    check_route = read(C/'e1-exact-compositor-validation-loader-20261025.json')
    require(check_route['episode'] == 'E-1' and
            Path(check_route['video']).resolve() == video.resolve() and
            check_route['videoSha256'] == exp['sha256'] and
            check_route['exportSha256'] == sha(C/'export.json'),
            'Original-check route must pin the actual final MP4/export')
    require(check_route['actualDrawingHook'] == 'desk-axes-frame.mjs' and
            check_route['actualDrawingHookSha256'] == PINS[W/'scripts/umech/desk-axes-frame.mjs'] and
            check_route['originalGateSha256'] == PINS[GATE] and
            check_route['originalLauncherSha256'] == PINS[W/'scripts/umech/desk-axes-final-checks.mjs'] and
            check_route['originalNumericThresholdsUnchanged'] is True and
            check_route['automaticApproval'] is False,
            'Original gate must inspect the exact final drawing hook, without numerical waivers')
    require(m['fps'] == FPS and m['expectedFrames'] == NF, 'Wrong actual review grid')
    require(prov['originalInputsAndOriginalNGPreserved'] is True and prov['allRawAndAnchorsUseExactActualFrame'] is True,
            'Retain original sources and NG evidence')
    receipt = read(BASE/'e1v1-final-plan-receipt-20261024.json')
    plans, refs = receipt['plans'], receipt['originalObjectSourceFrames']
    require(len(plans) == len(refs) == len(prov['records']) == NF, 'Complete exact frozen plan required')
    require(receipt['counts'] == {'render': 8100, 'dup': 3506}, 'Original source/hold count changed')
    require(receipt['sourceFreezeSha256'] == prepared['sourceFreezeSha256'], 'Frozen-plan source mismatch')
    reports, maps, physical, images = {}, {}, {}, {}
    for name, definition in HELPERS.items():
        helper, pin = definition
        protect(helper, pin)
        report_path = Path(prepared['inputReports'][name]['path'])
        protect(report_path, prepared['inputReports'][name]['sha256'])
        require(prov['inputReports'][name] == prepared['inputReports'][name], 'Assembler report disagreement')
        r = read(report_path);reports[name] = r
        require(r['helperSha256'] == pin and r['allPatchFramesActuallyRendered'] is True,
                'Actual approved patch render required: '+name)
        if name != 'camera15':
            require(r['mode'] == 'render' and all(v is True for v in r['protectionChecks'].values()),
                    'Patch source preservation failed: '+name)
        for p, h in r['protectedInputSha256'].items():
            protect(p, h)
        maps[name] = {int(j): int(k) for j, k in r['replacementFrameToActualPatchFrame'].items()}
        physical[name] = indexed(r['physical'])
        images[name] = indexed(r.get('actualImages', []))
    selected = {}
    for name, mapping in maps.items():
        for j, k in mapping.items():
            require(j not in selected and 0 <= k <= j < NF, 'Patch sets overlap or invalid actual frame')
            selected[j] = (name, k)
    local_report_path = Path(prepared['inputReports']['local2']['path'])
    local_dimensions = local_report_path.parent/'final-held-dimensions.json'
    local_poses = local_report_path.parent/'blender/delivered-camera-poses.json'
    protect(local_dimensions);protect(local_poses)
    previous_dims = indexed(read(local_dimensions)['samples'])
    baseline_poses = read(local_poses)['poses']
    poses = read(C/'blender/delivered-camera-poses.json')['poses']
    require(len(poses) == len(baseline_poses) == NF and all(close_vector(a, b, 7) for a, b in zip(poses, baseline_poses)),
            'Final action derivative must not change delivered camera15+local2 poses')
    dimensions = indexed(dims['samples'])
    half_rows = m['halfSeconds']['frames'];actual = indexed(half_rows)
    require(len(actual) == HALF and sorted(actual) == list(range(0, NF, 15)), 'All774 exact actual MP4 half-second JPEGs required')
    require(len(m['halfSeconds']['pages']) == math.ceil(HALF/10), 'All78 half-second sheets required')
    data = read(C/'blender/data.json');cues = data['cues']
    require(len(cues) == 54 and math.ceil(data['duration']*FPS) == NF, 'Wrong canonical duration/cues')
    require(all(j in dimensions for j in actual), 'Exact physical evidence missing; no nearest-frame fallback')
    with np.load(npz, allow_pickle=False) as z:
        require(z['feat_names'].tolist() == FEATURES, 'Original feature order changed')
        times, features = z['desk_t'].copy(), z['desk_feat'].copy()
    require(features.shape == (HALF, 6) and np.isfinite(features).all(), 'All original774 feature rows required')
    require(np.array_equal(times, np.arange(HALF)*.5), 'Original NPZ exact .5s grid required')
    th = original_thresholds()
    caption_authorization = read(C/'validation-final-v1/caption165-authorization.json')
    cap_before = 'capMedian:[1.0,1.5],capMin:.4,capWarn:.5,'
    cap_after = 'capMedian:[1.0,1.65],capMin:.4,capWarn:.5,'
    original_gate = GATE.read_text()
    require(original_gate.count(cap_before) == 1 and
            caption_authorization['id'] == ID and caption_authorization['userAuthorized'] is True and
            caption_authorization['originalFileUnchanged'] is True and
            caption_authorization['originalSha256'] == PINS[GATE] and
            caption_authorization['onlyReplacement'] == {'from': cap_before, 'to': cap_after} and
            caption_authorization['inMemorySha256'] == hashlib.sha256(original_gate.replace(cap_before, cap_after).encode()).hexdigest(),
            'Retain only the separately user-authorized 1.65-second caption exception')
    require(q['thresholds']['capMedian'] == [1., 1.65] and
            q['thresholds']['capMin'] == .4 and q['thresholds']['capWarn'] == .5,
            'Unexpected caption threshold derivative')
    for k, v in th.items():
        require(q['thresholds'][k] == v, 'Original numeric threshold changed: '+k)
    summary = original_summary(features, th)
    require(q['metrics']['world_source'] == 'desk', 'Original features must describe actually delivered raw desk frames')
    for key in ('samples', 'subject_median', 'subject_small_ratio', 'subject_small_runs',
                'sparse_longest', 'sparse_ratio', 'sparse_runs'):
        require(summary[key] == q['metrics'][key], 'Original NPZ/report metric differs: '+key)
    for number, metric in [('7', 'gate7OriginalStatus'), ('7b', 'gate7bOriginalStatus')]:
        entries = [r for r in q['results'] if str(r['no']) == number]
        require(len(entries) == 1 and entries[0]['status'] == summary[metric], 'Original gate status differs: '+number)
    written_runs = [r for r in summary['allSparseRunsForWrittenRule'] if r[1] >= 2.]
    require(args.node and Path(args.node).is_file(), 'Node runtime required for ORIGINAL exact word-timed faces')
    face_run = subprocess.run([args.node, str(FACE_HELPER), '--cache', str(C)],
                              input=json.dumps(sorted(actual)), text=True, capture_output=True)
    require(face_run.returncode == 0, 'Exact face-layer evidence failed: '+face_run.stderr[-2000:])
    face_report = json.loads(face_run.stdout)
    require(face_report['id'] == ID and face_report['helperSha256'] == sha(FACE_HELPER), 'Wrong face companion')
    faces = indexed(face_report['samples'])
    require(set(faces) == set(actual), 'Every actual grid row needs its exact face-composite timing')
    decisions = {}
    if args.eyes:
        eyes = read(args.eyes)
        require(eyes.get('reviewAuthority') == 'root' and eyes.get('mp4Sha256') == m['videoSha256'] and
                eyes.get('reviewManifestSha256') == sha(manifest), 'Root eyes must pin THIS final MP4/manifest')
        decisions = indexed(eyes['samples'])
        require(set(decisions).issubset(actual), 'This grid join accepts only exact half-second decisions')
    raw_hashes, encoded_hashes, rows = {}, {}, []
    def raw_sha(p):
        real = str(p.resolve())
        if real not in raw_hashes:
            raw_hashes[real] = sha(p)
        return raw_hashes[real]
    for i, t in enumerate(times):
        j = i*15;record, measured = prov['records'][j], dimensions[j]
        cue = next(c for c in reversed(cues) if c['start'] <= float(t))
        image = actual[j]
        require(record['frame'] == measured['frame'] == image['frame'] == j, 'Exact frame mismatch')
        require(measured['sampleTime'] == image['time'] == j/FPS, 'Use output sampleTime, never inherited source time')
        require(measured['cue'] == image['cue'] == faces[j]['cue'] == cue['key'] and measured['row'] == image['row'] == cue['row'],
                'Actual frame/cue/row disagreement')
        require(record['retainedOriginalPlan'] == plans[j] and record['originalObjectSourceFrame'] == refs[j], 'Wrong frozen original ref')
        ref = refs[j]
        require(isinstance(ref, int) and 0 <= ref <= j and plans[ref][0] == 'render', 'Held source is not a real original render')
        raw = Path(record['source']);chosen = C/'blender/desk'/('%05d.jpg'%j)
        require(chosen.resolve() == raw.resolve() and raw_sha(raw) == record['sha256'], 'Wrong or changed actual delivered raw')
        require(close_vector(measured['pose'], poses[j], 7), 'Dimensions do not describe final delivered camera')
        if j in selected:
            name, k = selected[j];r = reports[name]
            refs_key = 'patchFrameToUnchangedOtherObjectSourceFrame' if name == 'actions' else 'patchFrameToUnchangedObjectSourceFrame'
            source_ref = r[refs_key][str(k)]
            ph = physical[name][source_ref if name == 'local2' else k]
            expected = Path(r['raw'])/('%05d.jpg'%k)
            require(raw.resolve() == expected.resolve() and record['actualPatchFrame'] == k and source_ref == ref,
                    'Patch actualk/source-ref/raw disagreement')
            require(record['kind'] == KINDS[name] and record['physicalActionExplicitlyCorrected'] == (name == 'actions'), 'Derivative mislabeled')
            require(close_vector(ph['pose'], poses[j], 7) and close_vector(ph['box'], measured['box'], 4) and
                    abs(ph['widthRatio']-measured['widthRatio']) < 1e-10, 'Wrong actual physical patch state')
            if images[name]:
                require(images[name][k]['sha256'] == record['sha256'] and Path(images[name][k]['path']).resolve() == raw.resolve(), 'Actual patch image SHA differs')
            require(prov['actualPatchImageSha256'][str(raw.resolve())] == record['sha256'], 'Assembler actual patch SHA differs')
            if name == 'actions':
                require(ph['operationTime'] == k/FPS and ph['unchangedOtherObjectSourceFrame'] == ref and ph['allPrincipalAndCriticalGuardsPass'], 'Wrong action time/state')
            elif name == 'camera15':
                require(ph['depictedObjectFrame'] == ref, 'Camera patch advanced original held object time')
            else:
                require(ph['unchangedObjectSourceFrame'] == ref, 'Local distance fit advanced held object time')
            delivered = {'kind': name, 'actualPatchFrame': k, 'originalOtherObjectSourceFrame': ref,
                         'actualPhysicalRecord': ph, 'geometryProof': 'evaluated vertices' if name in ('local2', 'actions') else 'visible original base mesh/curve vertices; NOT an evaluated-modifier or pixel-occlusion claim'}
        else:
            expected = BASE/'blender/desk'/('%05d.jpg'%j)
            source = BASE/'blender/desk'/('%05d.jpg'%ref)
            require(record['actualPatchFrame'] is None and record['kind'] == 'unchanged-exact-frozen-r9-production' and
                    record['physicalActionExplicitlyCorrected'] is False and raw.resolve() == expected.resolve(), 'Unchanged original source mislabeled')
            require(raw_sha(source) == record['sha256'], 'Original held raw must be byte-identical to its real rendered source')
            previous = previous_dims[j]
            require(close_vector(previous['box'], measured['box'], 4) and close_vector(previous['pose'], measured['pose'], 7) and
                    previous['widthRatio'] == measured['widthRatio'] and measured['depictedObjectFrame'] == ref,
                    'Unchanged physical measurement differs from exact original held source')
            delivered = {'kind': 'exact-original-r9-held-source', 'actualOriginalFrame': ref,
                         'originalOtherObjectSourceFrame': ref,
                         'geometryProof': 'visible original base mesh/curve vertices; NOT an evaluated-modifier or pixel-occlusion claim'}
        box = measured['box'];width = (box[2]-box[0])/1080
        require(abs(width-measured['widthRatio']) < 1e-10 and measured['within40to70'] == (.4 <= width <= .7), 'Physical width flags inconsistent')
        rect_clip = box[0] < 0 or box[1] < 0 or box[2] > 1080 or box[3] > 1920
        require(not rect_clip or measured['clipped'], 'A rectangle clip must not be suppressed')
        outside = box[0] < 40 or box[1] < 110 or box[2] > 1040 or box[3] > 1550
        require(measured['outsidePrincipalSafeArea'] == outside, 'Safe-area flag differs from real projected bounds')
        jpeg = Path(image['file']);image_sha = sha(jpeg)
        require(image['sha256'] == image_sha, 'Final encoded JPEG changed since actual review extraction')
        encoded_hashes[str(jpeg.resolve())] = image_sha
        f = {key: float(features[i, k]) for k, key in enumerate(FEATURES)}
        flags = {'subjectBelow35': f['subject'] < th['subjectSmall'],
                 'subjectBelowOriginalMedian60': f['subject'] < th['subjectMedian'],
                 'sparseOriginalHeuristic': f['wood'] > th['sparseWood'] and f['busy'] < th['sparseBusy'],
                 'writtenSparseAtLeast2sMember': any(a <= float(t) < a+d for a, d in written_runs)}
        row = {'sampleIndex': i, 'frame': j, 'sampleTime': float(t), 'cue': cue['key'], 'row': cue['row'],
               'actualJpeg': str(jpeg), 'actualJpegSha256': image_sha,
               'deliveredRaw': str(raw), 'deliveredRawSha256': record['sha256'],
               'deliveredCameraPose': poses[j], 'deliveredSource': delivered,
               'physical': measured, 'faceEvidence': faces[j], 'originalFeatures': f,
               'originalPointCandidateFlags': flags, 'originalPointCandidate': any(flags.values()),
               'originalAggregateStatusesNotReplacedByPointFlags': True,
               'actualCompositeVisibilityAndReadabilityNotInferredFromGeometry': True}
        row['actualEyeReview'] = eye_disposition(row, decisions.get(j))
        rows.append(row)
    pages = []
    page_hashes = m['halfSeconds']['pageSha256']
    for i, p in enumerate(m['halfSeconds']['pages']):
        h = sha(p);require(page_hashes[p] == h, 'Actual review contact sheet changed')
        viewed = all(r['actualEyeReview']['actuallyViewed'] for r in rows[i*10:i*10+10])
        pages.append({'file': p, 'sha256': h, 'actuallyViewed': viewed,
                      'viewingEvidence': 'separately supplied root JSON' if viewed else 'PENDING; hashes/extraction do not establish viewing'})
    require(all(sha(p) == h for p, h in frozen.items()), 'Protected inputs changed during read-only join')
    require(all(sha(p) == h for p, h in raw_hashes.items()) and all(sha(p) == h for p, h in encoded_hashes.items()), 'Raw or final JPEG changed during join')
    candidates = [r for r in rows if r['originalPointCandidate']]
    result = {'id': ID, 'scope': 'Exact774 original-NPZ grid → actual encoded JPEG → delivered raw/source/ref → final physical camera evidence',
              'mp4': str(video), 'mp4Sha256': m['videoSha256'], 'reviewManifestSha256': sha(manifest),
              'inputsSha256': frozen, 'deliveredRawSha256': raw_hashes,
              'method': {'renders': 0, 'encodes': 0, 'imagesDecoded': 0, 'featuresRecomputed': False,
                         'originalThresholdsChanged': False, 'all774ExactFramesJoined': True,
                         'allPreparedOutputHashesVerified': True, 'allPreparedProtectedInputHashesVerified': True,
                         'originalInspectorUsesExactFinalDrawingHookVerified': True,
                         'onlyPreviouslyAuthorizedCaption165ExceptionRetained': True,
                         'originalHoldsNeverReevaluatedAtNominalOutputTime': True,
                         'faceAtUsesOriginalExactVoiceMapAndFaceLayer': True,
                         'humanViewingComesOnlyFromSeparateRootJson': True},
              'originalThresholds': th, 'originalGateThresholdsRetainedVerbatim': q['thresholds'],
              'separateUserAuthorizedCaption165Exception': caption_authorization,
              'originalGateResultsRetainedVerbatim': q['results'],
              'originalFeatureSummary': summary,
              'writtenSparseRule': {'source': str(COMMON), 'sha256': sha(COMMON),
                                    'noRunAtLeastSeconds': 2., 'allCandidateRuns': written_runs,
                                    'originalFourSecondNumericGateNotChanged': True,
                                    'pixelReadabilityNotCertifiedByThisRule': True},
              'faceSourceEvidence': {k: v for k, v in face_report.items() if k != 'samples'},
              'samples': rows, 'actualReviewPages': pages,
              'otherPhysicalSamplesRetainedVerbatim': [v for j, v in dimensions.items() if j not in actual],
              'summary': {'joined': HALF, 'sourceKinds': dict(Counter(r['deliveredSource']['kind'] for r in rows)),
                          'originalPointCandidates': len(candidates),
                          'writtenSparseAtLeast2sSamples': sum(r['originalPointCandidateFlags']['writtenSparseAtLeast2sMember'] for r in rows),
                          'viewedViaSeparateRootJson': sum(r['actualEyeReview']['actuallyViewed'] for r in rows),
                          'pendingViews': sum(not r['actualEyeReview']['actuallyViewed'] for r in rows),
                          'explicitRootSupplementDecisions': sum(r['actualEyeReview']['approvedSupplement'] for r in rows),
                          'candidateSupplementDecisionsPending': sum(not r['actualEyeReview']['approvedSupplement'] for r in candidates),
                          'physicalUnsafeRowsRetained': sum(not r['physical']['within40to70'] or r['physical']['clipped'] or r['physical']['outsidePrincipalSafeArea'] for r in rows)},
              'allOriginalNGAndNumericStatusesPreserved': True, 'automaticGate7or7bWaiverApplied': False,
              'allActuallyViewed': all(r['actualEyeReview']['actuallyViewed'] for r in rows),
              'earsVerified': False, 'rootFinalAcceptanceClaimedByThisHelper': False,
              'finalPassed': False, 'finalAcceptance': False,
              'notVerifiedHere': ['actual image readability/occlusion except separately supplied root decisions',
                                  'auditory listening', 'all30fps-frame human viewing',
                                  'cue-end/action/reference visual scope outside the774 grid; retain separate actual review receipts']}
    with out.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1, allow_nan=False);f.write('\n')
    print(json.dumps({'out': str(out), 'joined': HALF, 'pendingViews': result['summary']['pendingViews'],
                      'originalNGPreserved': True, 'finalAcceptance': False}))


if __name__ == '__main__':
    try:
        main()
    except (AssertionError, ValueError, KeyError, OSError, TypeError) as error:
        print('STOP: '+str(error), file=sys.stderr)
        sys.exit(2)
