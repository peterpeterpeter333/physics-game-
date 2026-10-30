#!/usr/bin/env python3
"""Prepare a fresh C7 without touching C6, frozen speech, or old QA.

Use --plan first. Preparation requires explicit native rows and a later root GO.
No Blender, synthesis, mixing, or rendering is performed by this helper.
"""
import argparse
import hashlib
import json
import math
import shutil
from datetime import datetime, timezone
from pathlib import Path

W = Path(__file__).resolve().parents[2]
SOURCE = Path('/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030')
TARGET = Path('/private/tmp/ys/ys-chain-b2a_s4r03_gpt_20261030')
REPORT = W / 'outputs/ys-chain-b2a-backup/S4修正03_20261030'
PRIOR = W / 'outputs/ys-chain-b2a-backup/S4修正02_20261030/S4earth-frozen-input-and-audio-reuse_20261030.json'
RECEIPT = REPORT / 'S4r03-frozen-input-and-audio-reuse_20261030.json'
INSTRUCTION = REPORT / 'B-2前編_S4最終報告へのClaudeの判断と直しの指示_20261030.md'
ID = 'ys-chain-b2a_gpt_20261029'
NF, FPS = 14846, 30
ALLOWED_ROWS = {9, 13, 19, 21, 22, 23, 27, 36}
OLD_USED_SOURCES = [
    'scripts/umech/desk-b2a-s4earth-stage-cacheexact_gpt_20261030.mjs',
    'scripts/umech/desk-b2a-s4earth-overlay_gpt_20261030.mjs',
    'scripts/umech/prepare-b2a-s4earth-cache_gpt_20261030.py',
    'scripts/blender/desk_b2a_s4final_gpt_20261030.py',
    'scripts/blender/desk_lib_b2a_s4final_gpt_20261030.py',
    'scripts/blender/patch_b2a_s4_earth_slice_width_gpt_20261030.py',
    'scripts/blender/render_b2a_s4_earth_only_gpt_20261030.py',
]


def read(file):
    return json.loads(file.read_text())


def sha(file):
    assert file.is_file() and not file.is_symlink(), str(file)
    h = hashlib.sha256()
    with file.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def realcopy(source, target):
    assert source.is_file() and not source.is_symlink(), str(source)
    assert not target.exists() and not target.is_symlink(), str(target)
    digest = sha(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    with source.open('rb') as first, target.open('xb') as second:
        shutil.copyfileobj(first, second)
    assert sha(source) == digest == sha(target), str(target)
    return {'source': str(source), 'target': str(target), 'sha256': digest,
            'bytes': source.stat().st_size, 'status': 'real-file-exclusive-copy'}


def aggregate(root, relative_paths):
    h, count, size = hashlib.sha256(), 0, 0
    for rel in sorted(relative_paths):
        file = root / rel
        digest, n = sha(file), file.stat().st_size
        h.update((str(rel) + '\0' + str(n) + '\0' + digest + '\n').encode())
        count += 1
        size += n
    return {'root': str(root), 'count': count, 'bytes': size, 'sha256': h.hexdigest(),
            'method': 'SHA256 of sorted relative path/bytes/content-SHA records; individual frame hashes are not saved'}


def make_plan(native_rows):
    rows = read(SOURCE / 'blender/b2a-scene-data.json')['rows']
    assert [r['row'] for r in rows] == list(range(1, 44))
    row_ranges = []
    for index, row in enumerate(rows):
        if row['row'] not in native_rows:
            continue
        following = rows[index + 1]['start'] if index + 1 < len(rows) else NF / FPS
        first, end = math.ceil(row['start'] * FPS), min(NF, math.ceil(following * FPS))
        assert 0 <= first < end <= NF
        # Verify the same start-based row_at semantics at both ends.
        for j in (first, end - 1):
            actual = max(r['row'] for r in rows if r['start'] <= j / FPS)
            assert actual == row['row'], (j, actual, row['row'])
        row_ranges.append({'row': row['row'], 'fromFrame': first,
                           'toFrameExclusive': end, 'count': end - first,
                           'rowStartSeconds': row['start'], 'spokenRowEndSeconds': row['end'],
                           'nextRowStartSeconds': following,
                           'containsTrailingCueGap': following > row['end']})
    merged = []
    for item in row_ranges:
        if merged and merged[-1]['toFrameExclusive'] == item['fromFrame']:
            merged[-1]['toFrameExclusive'] = item['toFrameExclusive']
            merged[-1]['rows'].append(item['row'])
        else:
            merged.append({'fromFrame': item['fromFrame'],
                           'toFrameExclusive': item['toFrameExclusive'], 'rows': [item['row']]})
    for interval in merged:
        interval['count'] = interval['toFrameExclusive'] - interval['fromFrame']
    return {'nativeRows': sorted(native_rows), 'rowRanges': row_ranges,
            'ranges': merged, 'framesToRender': sum(x['count'] for x in merged),
            'totalFrames': NF, 'fps': FPS,
            'membership': 'Largest row.start <= j/30, including every cue gap in the preceding row',
            'nativeRowsMustBeConfirmedByRoot': True}


def excluded_frames(plan):
    return {j for item in plan['ranges']
            for j in range(item['fromFrame'], item['toFrameExclusive'])}


def outside_anchor_payload(current, baseline, excluded):
    """Compare old anchor keys exactly; permit new keys only inside the patch."""
    baseline_keys, current_keys = set(baseline), set(current)
    assert baseline_keys <= current_keys, 'Baseline anchor keys were deleted: ' + str(sorted(baseline_keys - current_keys))
    assert all(isinstance(values, list) and len(values) == NF for values in current.values())
    new_keys = sorted(current_keys - baseline_keys)
    for name in new_keys:
        assert all(value is None for j, value in enumerate(current[name]) if j not in excluded), 'New anchor has a non-null value outside the native revision: ' + name
    return {name: [value for j, value in enumerate(current[name]) if j not in excluded]
            for name in sorted(baseline_keys)}, new_keys


def outside_metadata(root, excluded):
    primary = read(root / 'blender/primary.json')
    cameras = read(root / 'blender/camera-records.json')
    anchors = read(root / 'blender/desk/anchors.json')
    indices = [r['j'] for r in cameras]
    assert len(indices) == len(set(indices)) and all(0 <= j < NF for j in indices)
    assert set(range(NF)) - excluded <= set(indices), 'All unchanged camera rows must remain present'
    assert len(primary) == NF
    assert all(str(j) in primary for j in range(NF))
    baseline_anchors = read(SOURCE / 'blender/desk/anchors.json')['anchors']
    outside_anchors, _ = outside_anchor_payload(anchors['anchors'], baseline_anchors, excluded)
    payloads = {
        'primary': {k: v for k, v in primary.items() if int(k) not in excluded},
        'camera-records': [r for r in cameras if r['j'] not in excluded],
        'anchors': outside_anchors,
    }
    return {key: hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                           separators=(',', ':')).encode()).hexdigest()
            for key, value in payloads.items()}


def verify():
    receipt = read(RECEIPT)
    assert receipt['cache'] == str(TARGET) and receipt['id'] == ID
    mismatches = []
    for item in receipt['protectedSources']:
        if sha(Path(item['path'])) != item['sha256']:
            mismatches.append(item['path'])
    for item in receipt['criticalCopies']:
        if sha(Path(item['source'])) != item['sha256'] or sha(Path(item['target'])) != item['sha256']:
            mismatches.append(item['target'])
    speech = [f.relative_to(SOURCE / 'speech') for f in (SOURCE / 'speech').rglob('*') if f.is_file()]
    speech_source = aggregate(SOURCE / 'speech', speech)
    speech_target = aggregate(TARGET / 'speech', speech)
    if speech_source['sha256'] != receipt['speechCopySummary']['source']['sha256'] or speech_source['sha256'] != speech_target['sha256']:
        mismatches.append('frozen speech aggregate')
    excluded = excluded_frames(receipt['partialRevision'])
    files = [Path('%05d.jpg' % j) for j in range(NF) if j not in excluded]
    first = aggregate(SOURCE / 'blender/desk', files)
    second = aggregate(TARGET / 'blender/desk', files)
    if first['sha256'] != receipt['unchangedNativeCopies']['source']['sha256'] or first['sha256'] != second['sha256']:
        mismatches.append('outside-revision exact-j native aggregate')
    expected_metadata = receipt['outsideRevisionMetadataInitialSha256']
    if outside_metadata(SOURCE, excluded) != expected_metadata or outside_metadata(TARGET, excluded) != expected_metadata:
        mismatches.append('outside-revision primary/camera/anchors')
    baseline_anchors = read(SOURCE / 'blender/desk/anchors.json')['anchors']
    trial_anchors = read(TARGET / 'blender/desk/anchors.json')['anchors']
    _, new_anchor_keys = outside_anchor_payload(trial_anchors, baseline_anchors, excluded)
    result = {'cache': str(TARGET), 'mode': 'read-only current C7 receipt verification',
              'pass': not mismatches, 'mismatches': mismatches,
              'criticalCopies': len(receipt['criticalCopies']),
              'protectedSources': len(receipt['protectedSources']),
              'speechFiles': speech_target['count'], 'unchangedOutsideNativeFrames': second['count'],
              'nativeRevisionFrames': len(excluded),
              'baselineAnchorKeysPreserved': len(baseline_anchors),
              'newAnchorKeys': new_anchor_keys,
              'newAnchorValuesOutsideRevisionAreAllNull': True,
              'earsPerformed': False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    assert not mismatches


def prepare(native_rows):
    assert not TARGET.exists() and not RECEIPT.exists(), 'Preserve all prior C7 attempts; use a new version rather than overwrite'
    old = read(PRIOR)
    assert old['cache'] == str(SOURCE) and old['id'] == ID
    for item in old['protectedSources']:
        assert sha(Path(item['path'])) == item['sha256'], item['path']
    metadata = read(SOURCE / 'blender/desk/meta.json')
    assert metadata['frames'] == NF and metadata['fps'] == FPS and metadata['samples'] == 16
    assert metadata['resolution'] == [1080, 1920] and metadata['finished']
    assert metadata['previewOnly'] is False and metadata['sampleOnly'] is False
    plan = make_plan(native_rows)
    excluded = excluded_frames(plan)
    assert len(excluded) == plan['framesToRender']
    protected = list(old['protectedSources'])
    known = {item['path'] for item in protected}
    for name in OLD_USED_SOURCES:
        file = W / name
        if str(file) not in known:
            protected.append({'path': str(file), 'bytes': file.stat().st_size, 'sha256': sha(file)})
            known.add(str(file))
    TARGET.mkdir()
    critical = []
    for item in old['criticalCopies']:
        source = Path(item['target'])
        copied = realcopy(source, TARGET / source.relative_to(SOURCE))
        assert copied['sha256'] == item['sha256']
        copied['role'] = item['role']
        critical.append(copied)
    speech = [f.relative_to(SOURCE / 'speech') for f in (SOURCE / 'speech').rglob('*') if f.is_file()]
    for rel in speech:
        realcopy(SOURCE / 'speech' / rel, TARGET / 'speech' / rel)
    speech_source = aggregate(SOURCE / 'speech', speech)
    speech_target = aggregate(TARGET / 'speech', speech)
    assert speech_source['sha256'] == speech_target['sha256']
    basis = ['row-to-time.json', 'shot-plan.json', 'blender/b2a-scene-data.json',
             'blender/storyboard-plan.json', 'blender/camera-poses.json',
             'blender/camera-motion.json',
             'blender/primary.json', 'blender/desk/anchors.json',
             'blender/motion-events.json', 'blender/word-fallbacks.json']
    basis_records = [realcopy(SOURCE / name, TARGET / name) for name in basis]
    camera_source = SOURCE / 'blender/camera-records.json'
    basis_records.append(realcopy(camera_source, TARGET / 'source-reference-c6/blender/camera-records.json'))
    source_cameras = read(camera_source)
    assert len(source_cameras) == NF
    active_cameras = [row for row in source_cameras if row['j'] not in excluded]
    assert len(active_cameras) == NF - len(excluded)
    with (TARGET / 'blender/camera-records.json').open('x') as stream:
        json.dump(active_cameras, stream, ensure_ascii=False)
        stream.write('\n')
    problem_files = 0
    for source in sorted((SOURCE / 'problem').rglob('*')):
        if source.is_file():
            realcopy(source, TARGET / source.relative_to(SOURCE))
            problem_files += 1
    files = []
    for j in range(NF):
        if j in excluded:
            continue
        rel = Path('%05d.jpg' % j)
        realcopy(SOURCE / 'blender/desk' / rel, TARGET / 'blender/desk' / rel)
        files.append(rel)
    native_source = aggregate(SOURCE / 'blender/desk', files)
    native_target = aggregate(TARGET / 'blender/desk', files)
    assert native_source['sha256'] == native_target['sha256']
    assert native_target['count'] == NF - len(excluded)
    assert not (TARGET / 'blender/desk/meta.json').exists()
    assert not any((TARGET / 'blender/desk' / ('%05d.jpg' % j)).exists() for j in excluded)
    outside = outside_metadata(TARGET, excluded)
    assert outside == outside_metadata(SOURCE, excluded)
    for item in protected:
        assert sha(Path(item['path'])) == item['sha256'], item['path']
    receipt = dict(old)
    receipt.update({'completedUtc': datetime.now(timezone.utc).isoformat(), 'cache': str(TARGET),
                    'instruction': str(INSTRUCTION), 'instructionSha256': sha(INSTRUCTION),
                    'priorReceipt': {'path': str(PRIOR), 'sha256': sha(PRIOR)},
                    'protectedSources': protected, 'criticalCopies': critical,
                    'speechCopySummary': {'source': speech_source, 'target': speech_target},
                    'partialRevision': plan, 'nativeMetadataBasisCopies': basis_records,
                    'unchangedNativeCopies': {'source': native_source, 'target': native_target},
                    'outsideRevisionMetadataInitialSha256': outside,
                    'initialActiveCameraRows': len(active_cameras),
                    'allPendingCameraIndicesRemovedBeforeFirstRender': True,
                    'nativeMetaCopied': False, 'preparationOnly': True,
                    'notCopied': ['selected native row frames including trailing cue gaps', 'native meta',
                                  'old videos', 'gate outputs', 'render progress', 'old render jobs'],
                    'scope': 'Fresh real copies with explicit root-selected native row holes; original words/audio/subtitles/clocks/BGM/QA unchanged; final revision and QA pending'})
    # Discard C6-only preparation labels, not C6 files. All legacy receipts stay unchanged.
    for key in ['groundBoardPatch', 'outsidePatchMetadataInitialSha256', 'nativePatchComplete']:
        receipt.pop(key, None)
    receipt['mix'] = dict(old['mix'], file=str(TARGET / Path(old['mix']['file']).relative_to(SOURCE)),
                          record=str(TARGET / Path(old['mix']['record']).relative_to(SOURCE)))
    receipt['counts'] = dict(old['counts'], allRealCopies=len(critical) + len(speech) + len(basis_records) + problem_files + len(files),
                             frozenRealCopies=len(critical) + len(speech), unchangedNativeFrames=len(files),
                             nativeRevisionFramesPending=len(excluded), protectedOldSources=len(protected))
    receipt['counts'].pop('groundBoardNativeFramesPending', None)
    receipt['acceptedOriginalGateExceptions'] = {
        '10': 'Preserve original NG; Claude explicitly accepts same camera/board/leg with cloth difference',
        '7d': 'Preserve original NG and old plan/thresholds; Claude accepts whole-leg contact instead of old two-tip macro',
        '5': 'Only rows9/37/42 holding intervals explicitly accepted; row21 must be remeasured after lightning animation',
        '7b': 'Rerun original gate and report residual intervals; after specified corrections residual NG does not require stopping'}
    with RECEIPT.open('x') as stream:
        json.dump(receipt, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(json.dumps({'receipt': str(RECEIPT), 'cache': str(TARGET), 'partialRevision': plan,
                      'copiedNativeFrames': len(files), 'nativeMetaCopied': False,
                      'activeCameraRows': len(active_cameras),
                      'allPendingCameraIndicesRemovedBeforeFirstRender': True,
                      'audioRegenerated': False, 'remixed': False}, ensure_ascii=False, indent=2))
    verify()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify', action='store_true')
    parser.add_argument('--plan', action='store_true', help='Read-only row/frame ranges; creates no cache or receipt')
    parser.add_argument('--native-rows', help='Explicit comma-separated native rows confirmed by root')
    args = parser.parse_args()
    if args.verify:
        assert not args.plan and args.native_rows is None
        verify()
    else:
        assert args.native_rows, 'Supply the root-confirmed native row list; preparation has no default'
        requested = {int(value) for value in args.native_rows.split(',')}
        assert requested and requested <= ALLOWED_ROWS, sorted(requested)
        if args.plan:
            print(json.dumps(make_plan(requested), ensure_ascii=False, indent=2))
        else:
            prepare(requested)
