"""Materialize immutable B-2a S4 speech/timing/mix inputs, with no overwrite.

Existing S0/S3 assets and all existing common source files are read-only.
This program never contacts the speech engine or invokes a mixer/renderer.
"""
import argparse
import hashlib
import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

W = Path(__file__).resolve().parents[2]
ID = 'ys-chain-b2a_gpt_20261029'
S0 = Path('/private/tmp/ys') / ID
S3 = Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029')
S4 = Path('/private/tmp/ys/ys-chain-b2a_s4_gpt_20261030')
R = W / 'outputs/ys-chain-b2a-backup/S4_20261030'
FREEZE = W / 'outputs/ys-chain-b2a-backup/S0_20261029/AUDIO_AND_TIMING_FROZEN.json'
FROZEN_NAMES = ['plan.json', ID + '.json', 'timed-selection.json', 'phrase-times.json', ID + '.voice.wav', ID + '.wav', 'silent-intro-record.json']
USED_SOURCE_NAMES = [
    'scripts/blender/desk_lib.py', 'scripts/blender/desk_lib_b2a_gpt_20261029.py',
    'scripts/blender/desk_lib_b2a_s3_gpt_20261029.py', 'scripts/blender/desk_b2a_s3_gpt_20261029.py',
    'scripts/umech/desk-b2a-s3-stage_gpt_20261029.mjs', 'scripts/umech/desk-b2a-s3-overlay_gpt_20261029.mjs',
    'scripts/umech/anim.mjs', 'scripts/umech/desk-frame.mjs', 'scripts/umech/desk-faces.mjs',
    'scripts/umech/desk-overlay-lib.mjs', 'scripts/umech/frame-vert.mjs',
    'scripts/umech/yt1-chain-00bx-common.mjs', 'scripts/umech/chain-score.mjs',
    'scripts/umech/desk-quality-gate.mjs', 'scripts/umech/desk-quality-gate-frames.py',
    'scripts/umech/chain-desk-lint.mjs', 'scripts/umech/check-readings.py',
    'scripts/umech/prosody.py', 'scripts/umech/prosody-speaker.py', 'scripts/umech/qx-verify.mjs',
    'scripts/umech/chain-00bx-phrase-times.py', 'scripts/umech/desk_audio_lib.py',
    'scripts/umech/mix-audio.py', 'scripts/umech/mix-chain-desk-audio-b2a_s3_gpt_20261029.py',
]


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(4 * 1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def read(path):
    return json.loads(path.read_text())


def now():
    return datetime.now(timezone.utc).isoformat()


def real(path):
    assert path.resolve() == path.absolute() and not path.is_symlink(), f'Not a real immutable file: {path}'
    return path


def record(path):
    stat = path.stat()
    return {'path': str(path), 'bytes': stat.st_size, 'sha256': sha(real(path))}


def create_json(path, data):
    with path.open('x') as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2)
        stream.write('\n')


def tree_summary_from_records(root, records):
    digest = hashlib.sha256()
    count, total_bytes = 0, 0
    for item in sorted(records, key=lambda v: str(Path(v['path']).relative_to(root))):
        value = {'relativePath': str(Path(item['path']).relative_to(root))}
        for key in ['sha256', 'bytes', 'symlinkTarget']:
            if key in item:
                value[key] = item[key]
        digest.update((json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n').encode())
        count += 1
        total_bytes += item.get('bytes', 0)
    return {'root': str(root), 'count': count, 'bytes': total_bytes, 'sha256': digest.hexdigest(),
            'method': 'SHA256 of sorted relative-path/size/content-SHA records calculated in memory; individual file/frame hashes are not saved.'}


def snapshot_tree(root):
    # Per-file SHA values are kept only in memory for this streaming aggregate.
    # No image/frame hash table is written to a report.
    records = []
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            records.append({'path': str(path), 'symlinkTarget': os.readlink(path)})
        elif path.is_file():
            records.append(record(path))
    return tree_summary_from_records(root, records)


def compare_snapshot(records):
    mismatches = []
    for item in records:
        path = Path(item['path'])
        if 'symlinkTarget' in item:
            if not path.is_symlink() or os.readlink(path) != item['symlinkTarget']:
                mismatches.append(item['path'])
        elif not path.is_file() or path.is_symlink() or sha(path) != item['sha256']:
            mismatches.append(item['path'])
    return mismatches


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify', help='Read-only revalidation of the saved start/copy receipt; does not overwrite it.')
    parser.add_argument('--compact-own-receipt', action='store_true', help='One-time authorized format repair of this task\'s own new receipt only.')
    args = parser.parse_args()
    if args.compact_own_receipt:
        own_file = R / 'S4-frozen-input-and-audio-reuse_20261030.json'
        receipt = read(own_file)
        protection = receipt['sourceProtection']
        assert isinstance(protection.get('oldS3Tree'), list), 'No legacy full hash table to compact.'
        used = {str(W / name) for name in USED_SOURCE_NAMES}
        protection['existingSharedSource'] = [item for item in protection['existingSharedSource'] if item['path'] in used]
        assert len(protection['existingSharedSource']) == len(USED_SOURCE_NAMES)
        assert not compare_snapshot(protection['existingSharedSource'] + protection['frozenOriginals'])
        old_summary = tree_summary_from_records(S3, protection.pop('oldS3Tree'))
        assert snapshot_tree(S3) == old_summary, 'Old S3 changed before own-receipt compaction.'
        protection['oldS3TreeSummary'] = old_summary
        speech = [item for item in receipt['copies'] if '/speech/' in item['source']]
        original_speech = tree_summary_from_records(S0 / 'speech', [{'path': item['source'], 'bytes': item['bytes'], 'sha256': item['sha256']} for item in speech])
        copied_speech = tree_summary_from_records(S4 / 'speech', [{'path': item['target'], 'bytes': item['bytes'], 'sha256': item['sha256']} for item in speech])
        assert snapshot_tree(S0 / 'speech') == original_speech and snapshot_tree(S4 / 'speech') == copied_speech
        receipt['copies'] = [item for item in receipt['copies'] if '/speech/' not in item['source']]
        receipt['speechCopySummary'] = {'source': original_speech, 'target': copied_speech}
        receipt['sharedSourceCount'] = len(protection['existingSharedSource'])
        receipt['oldS3FileCount'] = old_summary['count']
        receipt['formatCompactedUtc'] = now()
        receipt['formatCompactionScope'] = 'Authorized correction of this task\'s own new report only; no media or user file changed. No per-frame hash table retained.'
        # This file was freshly generated by this helper in the current task.
        # Its compact-format rewrite was specifically authorized by root.
        own_file.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
        print(json.dumps({'compactedOwnReceipt': str(own_file), 'usedSources': receipt['sharedSourceCount'], 'oldS3AggregateOnly': old_summary['count'], 'bytes': own_file.stat().st_size, 'pass': True}, ensure_ascii=False, indent=2))
        return
    if args.verify:
        receipt = read(Path(args.verify))
        protected = receipt['sourceProtection']['existingSharedSource'] + receipt['sourceProtection']['frozenOriginals']
        copies = [{'path': item['target'], 'sha256': item['sha256']} for item in receipt['copies']]
        bad = compare_snapshot(protected + copies)
        old_summary = receipt['sourceProtection']['oldS3TreeSummary']
        if snapshot_tree(Path(old_summary['root'])) != old_summary:
            bad.append('old S3 aggregate mismatch')
        for label, saved in receipt['speechCopySummary'].items():
            if snapshot_tree(Path(saved['root'])) != saved:
                bad.append('speech ' + label + ' aggregate mismatch')
        print(json.dumps({'mode': 'read-only verify', 'individualSourceAndCriticalCopyChecks': len(protected) + len(copies), 'aggregateTreesChecked': 3, 'mismatches': bad, 'pass': not bad}, ensure_ascii=False, indent=2))
        if bad:
            raise SystemExit(1)
        return

    R.mkdir(parents=True, exist_ok=True)
    receipt_file = R / 'S4-frozen-input-and-audio-reuse_20261030.json'
    assert not receipt_file.exists(), 'Start/copy receipt already exists; use --verify, never overwrite.'
    frozen = read(FREEZE)
    assert frozen['frozen'] and frozen['completed'] and frozen['id'] == ID
    for item in frozen['immutableMediaFiles']:
        assert sha(real(Path(item['path']))) == item['sha256'], f'Original frozen input changed: {item["path"]}'
    assert sha(Path(frozen['master'])) == frozen['masterSha256']
    assert sha(Path(frozen['script'])) == frozen['scriptSha256']
    shared = [record(W / name) for name in USED_SOURCE_NAMES]
    source_protection = {
        'startedUtc': now(),
        'existingSharedSource': shared,
        'oldS3TreeSummary': snapshot_tree(S3),
        'frozenOriginals': [record(Path(frozen['master'])), record(Path(frozen['script'])), record(FREEZE)] + [record(Path(item['path'])) for item in frozen['immutableMediaFiles']],
    }
    copies = []

    def copy_once(source, target):
        source = real(source)
        source_hash = sha(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() or target.is_symlink():
            assert target.is_file() and not target.is_symlink(), f'Existing target is not a real file: {target}'
            status = 'existing-hash-identical-no-write'
        else:
            # "xb" is race safe against the concurrent S4 prepare process.
            try:
                with target.open('xb') as output, source.open('rb') as input_file:
                    shutil.copyfileobj(input_file, output, 4 * 1024 * 1024)
                status = 'copied-real-file-exclusive'
            except FileExistsError:
                status = 'concurrently-created-hash-identical-no-write'
        assert sha(real(target)) == source_hash, f'S4 copy differs: {target}'
        assert sha(source) == source_hash, f'Original changed while copying: {source}'
        copies.append({'source': str(source), 'target': str(target), 'sha256': source_hash, 'bytes': source.stat().st_size, 'status': status})

    S4.mkdir(parents=True, exist_ok=True)
    assert S4 != S0 and S4 != S3
    for name in FROZEN_NAMES:
        copy_once(S0 / name, S4 / name)
    speech_files = [path for path in sorted((S0 / 'speech').rglob('*')) if path.is_file()]
    assert len(speech_files) > 0
    for path in speech_files:
        copy_once(path, S4 / 'speech' / path.relative_to(S0 / 'speech'))
    mix_paths = [path for path in sorted((S3 / 'audio-v4').iterdir()) if path.is_file()]
    assert len(mix_paths) == 7
    for path in mix_paths:
        copy_once(path, S4 / 'audio-v4' / path.name)
    mix_record = read(S4 / 'audio-v4' / (ID + '.s3.mix.json'))
    levels = read(S4 / 'audio-v4' / (ID + '.s3.levels.json'))
    mix_target = S4 / 'audio-v4' / (ID + '.s3.mixed.wav')
    assert sha(mix_target) == mix_record['mixSha256'] == '389c690dee1fe8949ab447792d886318d65a135acb18456f48e1868039cdbf54'
    assert sha(S4 / (ID + '.voice.wav')) == mix_record['sourceVoiceSha256']
    assert levels['voiceBgmDifferenceMedianDb'] >= 15 and levels['voiceBgmDifferenceP10Db'] >= 10
    protected = source_protection['existingSharedSource'] + source_protection['frozenOriginals']
    changed = compare_snapshot(protected)
    assert not changed, f'Existing protected file changed: {changed}'
    assert snapshot_tree(S3) == source_protection['oldS3TreeSummary'], 'Old S3 aggregate changed.'
    speech_summary = {'source': snapshot_tree(S0 / 'speech'), 'target': snapshot_tree(S4 / 'speech')}
    assert speech_summary['source']['sha256'] == speech_summary['target']['sha256']
    critical_copies = [item for item in copies if '/speech/' not in item['source']]
    receipt = {
        'completedUtc': now(), 'id': ID, 'cache': str(S4),
        'instruction': str(W / 'outputs/ys-chain-b2a-backup/S3_20261029/B-2前編_S3_Claudeの直しの指示_20261029.md'),
        'sourceProtection': source_protection, 'copies': critical_copies, 'speechCopySummary': speech_summary,
        'sharedSourceCount': len(shared), 'oldS3FileCount': source_protection['oldS3TreeSummary']['count'],
        'copiedInputCount': len(copies), 'speechFileCount': len(speech_files),
        'mix': {'file': str(mix_target), 'record': str(S4 / 'audio-v4' / (ID + '.s3.mix.json')), 'sha256': mix_record['mixSha256'],
                'recordKeptByteIdentical': True, 'originalRecordPathsIntentionallyStillPointToS3': True,
                'voiceSha256': mix_record['sourceVoiceSha256'], 'medianDb': levels['voiceBgmDifferenceMedianDb'], 'p10Db': levels['voiceBgmDifferenceP10Db']},
        'sourceUnchangedAfterCopy': True, 'speechRegenerated': False, 'remixed': False,
        'earsPerformed': False, 'scope': 'Input materialization, byte-for-byte source protection and exact existing audio-v4 reuse only. Not S4 rendering/video acceptance or an ear check.',
        'notCopied': ['scene data', 'shot plan', 'primary/anchors/camera metadata', 'native image frames', 'any old video/render/gate output'],
    }
    create_json(receipt_file, receipt)
    print(json.dumps({'receipt': str(receipt_file), 'files': len(copies), 'speechFiles': len(speech_files), 'sharedSourcesProtected': len(shared), 'oldS3FilesProtected': source_protection['oldS3TreeSummary']['count'], 'mix': receipt['mix'], 'allProtectedSourcesUnchanged': not changed}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
