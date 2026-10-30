#!/usr/bin/env python3
"""Join B-1 candidate 2's ORIGINAL 7/7b evidence to exact actual MP4 frames.

This is a read-only, CPU-light evidence helper, NOT a replacement checker.
It loads only desk_t/desk_feat/feat_names from the original NPZ, never images
or gray arrays; it does not render, encode, recompute features, or waive NGs.
All 714 half-second samples remain pending ACTUAL visual review, including
40--70% physical measurements. A full-screen face does not establish that
the underlying 3D world is visible. The complete physical field-line pattern,
not its backing board or central sphere alone, is the powder shot's primary.

Usage (after candidate 2's original checker and MP4 extraction finish):
  python3 THIS.py --npz B2/validation-final-v1/quality-frames-original.npz \
    --dimensions CAMERA/final-held-dimensions.json \
    --manifest B2/actual-mp4-review/manifest.json --out NEW.json
The sibling quality-gate.json and B2/blender/data.json are read-only derived
inputs; --quality-json / --cue-data may select their exact paths explicitly.
No existing output is ever overwritten. --self-test uses synthetic data only.
"""
import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import sys

import numpy as np

W = Path(__file__).resolve().parents[2]
GATE = W / 'scripts/umech/desk-quality-gate.mjs'
FRAME_GATE = W / 'scripts/umech/desk-quality-gate-frames.py'
FRAME_SOURCE = W / 'scripts/umech/desk-frame.mjs'
ID = 'ys-chain-b1v1'
FEATURES = ['wall_band', 'window', 'wood', 'wood_top', 'busy', 'subject']
THRESHOLD_NAMES = ['step', 'sparseWood', 'sparseBusy', 'sparseMax',
                   'subjectMedian', 'subjectSmall', 'subjectSmallMax']
EPS = 1e-8


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def read_json(path):
    return json.loads(Path(path).read_text())


def source_thresholds():
    # Read literal values from the protected original; do not import/execute it.
    text = re.sub(r'//[^\n]*', '', GATE.read_text())
    result = {}
    for name in THRESHOLD_NAMES:
        matches = re.findall(r'\b' + re.escape(name) + r'\s*:\s*([\d.]+)', text)
        require(len(matches) == 1, 'Original threshold must be unique: ' + name)
        result[name] = float(matches[0])
    require(result['step'] == .5, 'This join is specifically the 0.5-second grid')
    return result


def mask_runs(mask, step=.5):
    # Same run convention as the unchanged frame checker: sample count * step.
    result, start = [], None
    for i, flag in enumerate(list(mask) + [False]):
        if flag and start is None:
            start = i
        if not flag and start is not None:
            result.append([round(start * step, 2), round((i - start) * step, 2)])
            start = None
    return sorted(result, key=lambda row: -row[1])


def original_summary(feat, th):
    sub = feat[:, FEATURES.index('subject')]
    sparse = ((feat[:, FEATURES.index('wood')] > th['sparseWood']) &
              (feat[:, FEATURES.index('busy')] < th['sparseBusy']))
    runs = mask_runs(sparse, th['step'])
    small = sub < th['subjectSmall']
    # The original rounds metrics to four places BEFORE its JS gate comparison.
    median = round(float(np.median(sub)), 4)
    small_ratio = round(float(small.mean()), 4)
    longest = runs[0][1] if runs else 0.0
    return {
        'samples': len(feat), 'world_source': 'desk',
        'subject_median': median, 'subject_small_ratio': small_ratio,
        'subject_small_runs': mask_runs(small, th['step'])[:6],
        'sparse_longest': longest, 'sparse_ratio': round(float(sparse.mean()), 4),
        'sparse_runs': runs[:5],
        'gate7OriginalStatus': 'OK' if longest < th['sparseMax'] else 'NG',
        'gate7bOriginalStatus': 'OK' if median >= th['subjectMedian'] and
            small_ratio <= th['subjectSmallMax'] else 'NG',
        'note': 'Original numeric statuses only; no visual exception has been applied.',
    }


def exact_frame(t, fps=30):
    value = float(t) * fps
    j = round(value)
    require(math.isfinite(value) and abs(value - j) < EPS,
            'Time is not an exact actual frame: ' + str(t))
    return j


def dimension_index(samples):
    by_frame = {}
    for sample in samples:
        j = sample['frame']
        require(isinstance(j, int), 'Physical frame must be an integer')
        require(exact_frame(sample['sampleTime']) == j,
                'Physical sampleTime/frame disagreement')
        if j in by_frame:
            # A half second and an exact cue-end can coincide; only identical
            # delivered physical evidence may share an actual frame.
            old = {k: v for k, v in by_frame[j].items() if k != 'sampleTime'}
            new = {k: v for k, v in sample.items() if k != 'sampleTime'}
            require(old == new, 'Conflicting physical evidence for frame ' + str(j))
        else:
            by_frame[j] = sample
    return by_frame


def smooth(v):
    v = max(0., min(1., v))
    return v * v * (3 - 2 * v)


def face_hint(cue, t):
    face = cue.get('face')
    if not face:
        return {'kind': 'no_face_scheduled', 'underlyingWorldVisibleNotCertified': True}
    require(not face.get('at'), 'face.at needs exact voiceMap timing, not inference')
    start, end = cue['start'], cue['end']
    a = start + face.get('a', 0) * (end - start)
    b = start + face.get('b', 1) * (end - start)
    intervals = [(a, b)]
    if face.get('then'):
        intervals.append((b, end))
    opacity = max((smooth((t - x) / .18) * (1 - smooth((t - y) / .12))
                   if x <= t <= y + .12 else 0.) for x, y in intervals)
    # desk-frame's n() serializes the enclosing opacity to one decimal place.
    serialized = math.floor(opacity * 10 + .5) / 10
    if face.get('small'):
        kind = 'small_face_scheduled' if serialized else 'face_not_yet_visible'
    elif serialized == 1:
        kind = 'full_screen_face_opaque_scheduled'
    elif serialized:
        kind = 'full_screen_face_fade_scheduled'
    else:
        kind = 'face_not_yet_visible'
    return {'kind': kind, 'scheduledOpacity': serialized,
            'source': 'canonical cue face metadata and unchanged faceLayer timing',
            'actualCompositeMustBeSeen': True,
            'underlying3DWidthIsNotFaceSizeEvidence': not face.get('small', False)}


def principal_identity(cue, measured):
    if cue['group'] == 'powder':
        require(measured['principal'] == 'complete magnetic-field pattern',
                'Powder physical measurement must describe complete field paths')
        return {'kind': 'complete_magnetic_field_line_pattern',
                'measuredPrincipal': measured['principal'],
                'notBackingBoardOrCentralSphereAlone': True,
                'caution': 'Pattern extent is physical geometry, not proof of contrast/legibility.'}
    if cue['group'] == 'book':
        require(measured['principal'] == 'open book plus score board',
                'Book shot must identify the instructed two-subject group')
        return {'kind': 'instructed_open_book_plus_score_board',
                'measuredPrincipal': measured['principal'],
                'bookAloneWidthNotInferred': True}
    return {'kind': 'physical_cue_primary', 'group': cue['group'],
            'measuredPrincipal': measured['principal'],
            'sphereAloneOrMultiObjectGroupMustBeCheckedVisually': True}


def join_rows(times, feat, dimensions, manifest, cue_data, th):
    require(manifest['id'] == ID and manifest['fps'] == 30, 'Wrong review ID/fps')
    require(len(times) == len(feat) == 714, 'Require all original 714 half-second points')
    require(manifest['expectedFrames'] == 10700, 'Unexpected B1 actual frame count')
    require(math.ceil(cue_data['duration'] * 30) == 10700, 'Cue duration mismatch')
    expected = np.arange(714, dtype=np.float64) * .5
    require(np.array_equal(np.asarray(times, np.float64), expected),
            'desk_t must be the complete exact 0..356.5 half-second grid')
    actual = manifest['halfSeconds']['frames']
    require(len(actual) == 714, 'Manifest must contain all 714 half-second images')
    image_index = {}
    for image in actual:
        j = image['frame']
        require(isinstance(j, int) and exact_frame(image['time']) == j,
                'Manifest time/frame mismatch')
        require(j not in image_index, 'Duplicate half-second MP4 frame')
        image_index[j] = image
    physical = dimension_index(dimensions['samples'])
    cues = cue_data['cues']
    require(len({c['key'] for c in cues}) == len(cues), 'Duplicate cue keys')
    output = []
    for i, t in enumerate(times):
        t = float(t)
        j = exact_frame(t)
        require(j in image_index and j in physical, 'Missing exact frame ' + str(j))
        image, measured = image_index[j], physical[j]
        # Same exact frame selects the canonical cue; never nearest-neighbour.
        cue = next(c for c in reversed(cues) if c['start'] <= t)
        require(cue['key'] == image['cue'] == measured['cue'] and
                cue['row'] == image['row'] == measured['row'],
                'Cue/row disagreement at actual frame ' + str(j))
        box = measured['box']
        require(len(box) == 4 and all(math.isfinite(v) for v in box), 'Invalid box')
        require(box[2] >= box[0] and box[3] >= box[1], 'Inverted box')
        width = (box[2] - box[0]) / 1080
        require(abs(width - measured['widthRatio']) < 1e-10, 'Width/box mismatch')
        in_range, under35 = .4 <= width <= .7, width < .35
        clipped = box[0] < 0 or box[1] < 0 or box[2] > 1080 or box[3] > 1920
        require(in_range == measured['within40to70'] and
                under35 == measured['smallBelow35'] and clipped == measured['clipped'],
                'Physical flags disagree with geometry at ' + str(j))
        f = {name: float(feat[i, k]) for k, name in enumerate(FEATURES)}
        small = f['subject'] < th['subjectSmall']
        sparse = f['wood'] > th['sparseWood'] and f['busy'] < th['sparseBusy']
        face = face_hint(cue, t)
        full_face = face['kind'].startswith('full_screen_face')
        if full_face:
            disposition = 'face_composite_requires_separate_visual_disposition'
        elif clipped or not in_range:
            disposition = 'physical_framing_exception_or_real_flaw_requires_eye_review'
        elif small or sparse:
            disposition = 'numeric_physical_disagreement_candidate_not_approved'
        else:
            disposition = 'no_7_or_7b_point_candidate_still_requires_eye_review'
        output.append({
            'sampleIndex': i, 'time': t, 'actualMp4Frame': j,
            'originalDeskFrame': j, 'physicalMeasuredOutputFrame': measured['frame'],
            'cue': cue['key'], 'row': cue['row'],
            'actualJpeg': image['file'], 'halfSecondPageIndex': i // 10,
            'originalFeatures': f,
            'originalHeuristicFlags': {
                'subjectBelow35': small, 'sparseCandidate': sparse,
                'subjectBelow60': f['subject'] < th['subjectMedian'],
                'pointFlagsAreNotAggregateGateStatuses': True},
            'physical': {'principalIdentity': principal_identity(cue, measured),
                         'widthRatio': width, 'box': box,
                         'within40to70': in_range, 'under35': under35,
                         'clipped': clipped, 'cameraMovingAtThisFrame': measured['moving'],
                         'actualCameraPatchSourceFrame': measured.get('actualPatchedFrame'),
                         'notAnEvaluatedModifierOrOcclusionAudit': True},
            'compositeFaceHint': face, 'reviewDisposition': disposition,
            'actualEyeReviewRequired': True,
            'actualEyeReview': {'status': 'pending', 'approvedException': False},
        })
    return output


def self_test():
    th = source_thresholds()
    times = np.arange(714) * .5
    feat = np.zeros((714, 6), np.float32)
    feat[:, 5] = .2
    feat[:, 2] = .9
    cue = {'key': 'synthetic', 'row': 1, 'start': 0, 'end': 357,
           'group': 'powder', 'face': None}
    dims = {'samples': [{'sampleTime': float(t), 'frame': i * 15,
                        'cue': cue['key'], 'row': 1, 'box': [200, 400, 848, 1100],
                        'widthRatio': .6, 'within40to70': True,
                        'smallBelow35': False, 'moving': False, 'clipped': False,
                        'principal': 'complete magnetic-field pattern',
                        'actualPatchedFrame': None} for i, t in enumerate(times)]}
    manifest = {'id': ID, 'fps': 30, 'expectedFrames': 10700,
                'halfSeconds': {'frames': [{'frame': i * 15, 'time': float(t),
                'cue': cue['key'], 'row': 1, 'file': 'synthetic.jpg'}
                for i, t in enumerate(times)]}}
    rows = join_rows(times, feat, dims, manifest,
                     {'duration': 356.6526666666668, 'cues': [cue]}, th)
    require(len(rows) == 714 and rows[-1]['actualMp4Frame'] == 10695, 'Grid test')
    require(all(r['actualEyeReviewRequired'] and not r['actualEyeReview']['approvedException']
                for r in rows), 'Must never autoapprove')
    require(rows[0]['reviewDisposition'] ==
            'numeric_physical_disagreement_candidate_not_approved', 'Disagreement test')
    require(original_summary(feat, th)['gate7bOriginalStatus'] == 'NG', 'Retain 7b NG')
    require(original_summary(feat, th)['gate7OriginalStatus'] == 'NG', 'Retain sparse NG')
    face_cue = dict(cue, face={'who': 'mio', 'a': 0, 'b': 1})
    require(face_hint(face_cue, 1)['kind'] == 'full_screen_face_opaque_scheduled', 'Face test')
    require(face_hint(face_cue, 0)['scheduledOpacity'] == 0, 'Face fade-start test')
    bad = dict(manifest, halfSeconds={'frames': list(manifest['halfSeconds']['frames'])})
    bad['halfSeconds']['frames'][2] = dict(bad['halfSeconds']['frames'][2], frame=31)
    try:
        join_rows(times, feat, dims, bad, {'duration': 356.6526666666668, 'cues': [cue]}, th)
    except ValueError:
        pass
    else:
        raise AssertionError('Mismatched actual frame must stop, not nearest-join')
    print(json.dumps({'selfTest': 'PASS', 'syntheticOnly': True,
                      'productionEvidenceRead': False, 'imagesViewed': False}))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    for name in ['npz', 'dimensions', 'manifest', 'out', 'quality-json', 'cue-data']:
        ap.add_argument('--' + name, type=Path)
    ap.add_argument('--self-test', action='store_true')
    args = ap.parse_args()
    if args.self_test:
        self_test()
        return
    require(all([args.npz, args.dimensions, args.manifest, args.out]), 'Four paths required')
    require(not args.out.exists() and not args.out.is_symlink(), 'Preserve existing report')
    quality_path = args.quality_json or args.npz.parent / 'quality-gate.json'
    data_path = args.cue_data or args.manifest.parent.parent / 'blender/data.json'
    inputs = [args.npz, args.dimensions, args.manifest, quality_path, data_path,
              GATE, FRAME_GATE, FRAME_SOURCE, Path(__file__).resolve()]
    require(all(p.is_file() for p in inputs), 'All completed input evidence must exist')
    evidence = {str(p.resolve()): {'sha256': sha(p), 'bytes': p.stat().st_size}
                for p in inputs}
    th = source_thresholds()
    quality, dimensions = read_json(quality_path), read_json(args.dimensions)
    manifest, data = read_json(args.manifest), read_json(data_path)['b1']
    require(quality['id'] == ID and quality['metrics']['world_source'] == 'desk',
            'Original quality report must use B1 actual desk frames')
    require(Path(quality['mp4']).resolve() == Path(manifest['video']).resolve(),
            'Original quality report and actual review refer to different MP4s')
    require(all(quality['thresholds'][name] == value for name, value in th.items()),
            'Original 7/7b thresholds must not have changed')
    with np.load(args.npz, allow_pickle=False) as archive:
        # NPZ arrays are lazy; deliberately NEVER access desk_gray/mp4_* arrays.
        require(archive['feat_names'].tolist() == FEATURES, 'Unknown feature ordering')
        times, feat = archive['desk_t'], archive['desk_feat']
    require(feat.shape == (714, 6) and np.isfinite(feat).all(), 'Incomplete original features')
    original = original_summary(feat, th)
    for name in ['samples', 'subject_median', 'subject_small_ratio', 'subject_small_runs',
                 'sparse_longest', 'sparse_ratio', 'sparse_runs']:
        require(original[name] == quality['metrics'][name], 'Original metric mismatch: ' + name)
    originals = [r for r in quality['results'] if str(r['no']) in ['7', '7b']]
    require(len(originals) == 2, 'Original gate7 and7b results must both be retained')
    for result in originals:
        key = 'gate7OriginalStatus' if str(result['no']) == '7' else 'gate7bOriginalStatus'
        require(result['status'] == original[key], 'Original aggregate status mismatch')
    rows = join_rows(times, feat, dimensions, manifest, data, th)
    pages = manifest['halfSeconds']['pages']
    require(len(pages) == math.ceil(714 / 10), 'Missing actual half-second review pages')
    page_evidence = [{'file': p, 'sha256': sha(p), 'actuallyViewed': False,
                      'sampleFirst': i * 10, 'sampleLast': min(713, i * 10 + 9)}
                     for i, p in enumerate(pages)]
    for row in rows:
        image = Path(row['actualJpeg'])
        require(image.is_file(), 'Actual MP4 JPEG is missing: ' + str(image))
        with image.open('rb') as f:
            require(f.read(2) == b'\xff\xd8', 'Actual review image is not a JPEG')
        row['actualJpegSha256'] = sha(image)
        row['halfSecondPage'] = pages[row['halfSecondPageIndex']]
    # No image decoding, feature extraction, ffmpeg, or GPU operation took place.
    report = {
        'id': ID, 'candidate': 'B1 second actual MP4 candidate, not episode B2',
        'scope': 'Exact original 714 half-second points joined to delivered physical geometry and actual MP4 JPEGs',
        'method': {'frameJoin': 'desk_t*30 == physical.frame == actualMp4.frame, exact integers only',
                   'npzArraysLoadedOnly': ['feat_names', 'desk_t', 'desk_feat'],
                   'featuresRecomputed': False, 'rendersOrEncodesPerformed': False,
                   'originalCheckerOrSourceChanged': False,
                   'actualVideoShaIsManifestClaimNotRehashed': manifest['videoSha256']},
        'inputs': evidence, 'originalThresholds': th,
        'originalNumericResultsRetained': originals, 'originalFeatureSummary': original,
        'summary': {'samples': 714,
                    'dispositions': dict(Counter(r['reviewDisposition'] for r in rows)),
                    'physicalWithin40to70': sum(r['physical']['within40to70'] for r in rows),
                    'physicalUnder35': sum(r['physical']['under35'] for r in rows),
                    'physicalClipped': sum(r['physical']['clipped'] for r in rows),
                    'originalSubjectBelow35': sum(r['originalHeuristicFlags']['subjectBelow35'] for r in rows),
                    'originalSparseCandidates': sum(r['originalHeuristicFlags']['sparseCandidate'] for r in rows)},
        'actualReviewPages': page_evidence, 'samples': rows,
        'actualEyeReviewRequired': True, 'allActuallyViewed': False,
        'automaticGate7or7bWaiverApplied': False, 'finalPassed': False,
        'unconfirmed': ['Every actual JPEG requires real visual review; file hashing is not viewing.',
                        'Physical width does not establish contrast, visibility, captions, comprehension or occlusion.',
                        'Full-screen face samples are not evidence of a visible 3D principal.',
                        'Other gates and audio are outside this helper; no NG is excused here.'],
    }
    # Fail if any input changed during this read-only evidence pass.
    require(all(sha(p) == evidence[str(p.resolve())]['sha256'] for p in inputs),
            'Input changed during report preparation; do not mix candidates')
    with args.out.open('x') as f:
        json.dump(report, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')
    print(json.dumps({'out': str(args.out), 'samples': 714,
                      'originalResultsRetained': originals, 'actualEyeReviewPending': True,
                      'finalPassed': False}, ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (AssertionError, ValueError, KeyError, OSError) as error:
        print('STOP: ' + str(error), file=sys.stderr)
        sys.exit(2)
