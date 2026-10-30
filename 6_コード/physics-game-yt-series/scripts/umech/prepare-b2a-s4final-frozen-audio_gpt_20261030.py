"""Isolated B-2a S4-final immutable inputs. No audio generation or mixing.

Old files are read-only. Targets are real copies created exclusively; differing
existing targets stop the operation. Hash tables for video frames are not saved.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

W = Path(__file__).resolve().parents[2]
ID = 'ys-chain-b2a_gpt_20261029'
S0 = Path('/private/tmp/ys') / ID
C4 = Path('/private/tmp/ys/ys-chain-b2a_s4_gpt_20261030')
C5 = Path('/private/tmp/ys/ys-chain-b2a_s4final_gpt_20261030')
R4 = W / 'outputs/ys-chain-b2a-backup/S4_20261030'
R5 = W / 'outputs/ys-chain-b2a-backup/S4修正02_20261030'
PRIOR = R4 / 'S4-frozen-input-and-audio-reuse_20261030.json'
FROZEN_NAMES = ['plan.json', ID + '.json', 'timed-selection.json', 'phrase-times.json', ID + '.voice.wav', ID + '.wav', 'silent-intro-record.json']
MIX_SHA = '389c690dee1fe8949ab447792d886318d65a135acb18456f48e1868039cdbf54'
MANIFEST = R5 / 'S4final-frozen-input-and-audio-reuse_20261030.json'


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(4 * 1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def read(path):
    return json.loads(path.read_text())


def unchanged(records):
    return [item['path'] for item in records if not Path(item['path']).is_file() or sha(Path(item['path'])) != item['sha256']]


def tree_summary(root):
    digest = hashlib.sha256()
    count, total = 0, 0
    for path in sorted(root.rglob('*'), key=lambda x: str(x.relative_to(root))):
        if not path.is_file():
            continue
        assert not path.is_symlink(), 'Real files only: ' + str(path)
        size = path.stat().st_size
        value = {'relativePath': str(path.relative_to(root)), 'bytes': size, 'sha256': sha(path)}
        digest.update((json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n').encode())
        count += 1
        total += size
    return {'root': str(root), 'count': count, 'bytes': total, 'sha256': digest.hexdigest(),
            'method': 'SHA256 of sorted relative-path/size/content-SHA records calculated in memory; individual file/frame hashes are not saved.'}


def verify_manifest():
    manifest = read(MANIFEST)
    bad = unchanged(manifest['protectedSources'])
    prior = manifest['priorReceipt']
    if sha(Path(prior['path'])) != prior['sha256']:
        bad.append('prior compact receipt changed')
    bad += unchanged([{'path': item['target'], 'sha256': item['sha256']} for item in manifest['criticalCopies']])
    for label, expected in manifest['speechCopySummary'].items():
        if tree_summary(Path(expected['root'])) != expected:
            bad.append('speech aggregate changed: ' + label)
    result = {'mode': 'read-only current manifest verification', 'criticalFileCount': len(manifest['criticalCopies']),
              'protectedSourceCount': len(manifest['protectedSources']), 'mismatches': bad, 'pass': not bad}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if bad:
        raise SystemExit(1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    if args.verify:
        verify_manifest()
        return
    assert not MANIFEST.exists(), 'Manifest exists; use --verify, never overwrite.'
    assert C5 != C4 and C5 != S0
    prior_hash = sha(PRIOR)
    prior = read(PRIOR)
    verify_old = subprocess.run([sys.executable, str(W / 'scripts/umech/prepare-b2a-s4-frozen-audio_gpt_20261030.py'), '--verify', str(PRIOR)], capture_output=True, text=True)
    assert verify_old.returncode == 0, verify_old.stdout + verify_old.stderr
    verification = json.loads(verify_old.stdout)
    assert verification['pass'] is True
    protected = prior['sourceProtection']['existingSharedSource'] + prior['sourceProtection']['frozenOriginals']
    assert len(prior['sourceProtection']['existingSharedSource']) == 24
    assert not unchanged(protected)
    copied = []

    def copy_once(source, target, role):
        assert source.is_file() and not source.is_symlink() and source.resolve() == source.absolute()
        expected_sha = sha(source)
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() or target.is_symlink():
            assert target.is_file() and not target.is_symlink()
            status = 'existing-identical-no-write'
        else:
            try:
                with target.open('xb') as dst, source.open('rb') as src:
                    shutil.copyfileobj(src, dst, 4 * 1024 * 1024)
                status = 'real-file-exclusive-copy'
            except FileExistsError:
                status = 'concurrent-identical-no-write'
        assert sha(target) == expected_sha and sha(source) == expected_sha, str(target)
        copied.append({'source': str(source), 'target': str(target), 'sha256': expected_sha, 'bytes': source.stat().st_size, 'role': role, 'status': status})

    for name in FROZEN_NAMES:
        assert sha(C4 / name) == sha(S0 / name), 'Prior cache differs from S0: ' + name
        copy_once(C4 / name, C5 / name, 'immutable speech/subtitle timing')
    for source in sorted((C4 / 'speech').rglob('*')):
        if source.is_file():
            copy_once(source, C5 / 'speech' / source.relative_to(C4 / 'speech'), 'speech part')
    for source in sorted((C4 / 'audio-v4').iterdir()):
        if source.is_file():
            copy_once(source, C5 / 'audio-v4' / source.name, 'unchanged accepted audio-v4')
    # These contain the previous renderKey or old visual thresholds. Preserve
    # byte-identically as inactive references, never as active production data.
    # Root's new stage builds the current C5/blender data and shot plan.
    reference_names = ['row-to-time.json', 'shot-plan.json', 'blender/b2a-scene-data.json', 'blender/storyboard-plan.json']
    for name in reference_names:
        copy_once(C4 / name, C5 / 'source-reference-s4' / name, 'inactive prior visual-planning reference')
    cues = [cue for scene in read(C5 / 'plan.json')[0]['scenes'] for cue in scene['cues']]
    assert len(cues) == 70
    assert sum(len(cue['cap']) for cue in cues) == 317
    timed = read(C5 / (ID + '.json'))
    assert sum(len(scene['captions']) for scene in timed['scenes']) == 70
    mix_record = read(C5 / 'audio-v4' / (ID + '.s3.mix.json'))
    levels = read(C5 / 'audio-v4' / (ID + '.s3.levels.json'))
    assert sha(C5 / 'audio-v4' / (ID + '.s3.mixed.wav')) == mix_record['mixSha256'] == MIX_SHA
    assert sha(C5 / (ID + '.voice.wav')) == mix_record['sourceVoiceSha256']
    speech_summary = {'source': tree_summary(C4 / 'speech'), 'target': tree_summary(C5 / 'speech')}
    assert speech_summary['source']['sha256'] == speech_summary['target']['sha256']
    assert speech_summary['source']['count'] == speech_summary['target']['count'] == 142
    assert sha(PRIOR) == prior_hash and not unchanged(protected)
    assert levels['voiceBgmDifferenceMedianDb'] == prior['mix']['medianDb']
    assert levels['voiceBgmDifferenceP10Db'] == prior['mix']['p10Db']
    R5.mkdir(parents=True, exist_ok=True)
    manifest = {
        'completedUtc': datetime.now(timezone.utc).isoformat(), 'id': ID, 'cache': str(C5),
        'instruction': str(R4 / 'B-2前編_S4前_Claudeの直しの指示_20261030.md'),
        'priorReceipt': {'path': str(PRIOR), 'sha256': prior_hash, 'readOnlyVerification': verification},
        'protectedSources': protected,
        'criticalCopies': [item for item in copied if item['role'] != 'speech part'],
        'speechCopySummary': speech_summary,
        'counts': {'allRealCopies': len(copied), 'voicedCues': 70, 'captionChunks': 317, 'speechFiles': 142, 'protectedCoreSources': 24},
        'mix': {'file': str(C5 / 'audio-v4' / (ID + '.s3.mixed.wav')), 'record': str(C5 / 'audio-v4' / (ID + '.s3.mix.json')),
                'sha256': MIX_SHA, 'voiceSha256': mix_record['sourceVoiceSha256'],
                'voiceBgmDifferenceMedianDb': levels['voiceBgmDifferenceMedianDb'], 'voiceBgmDifferenceP10Db': levels['voiceBgmDifferenceP10Db'],
                'recordByteIdentical': True, 'recordOriginalPathsStillPointToS3': True},
        'priorVisualPlanningReferences': 'source-reference-s4/ only; not active Blender or production metadata',
        'notCopied': ['old image frames', 'primary boxes', 'camera poses', 'anchors', 'GUI logs/state', 'render meta', 'old videos', 'gate outputs'],
        'audioRegenerated': False, 'remixed': False, 'earsPerformed': False, 'sourcesUnchanged': True,
        'scope': 'Immutable byte-copy and mechanical source protection only. No final S4 quality or ear-listening claim.',
        'laterAudioQa': {'auditor': str(W / 'outputs/ys-chain-b2a-backup/S3_20261029/audit-final-mp4-audio_20261029.py'),
                         'argv': [sys.executable, str(W / 'outputs/ys-chain-b2a-backup/S3_20261029/audit-final-mp4-audio_20261029.py'), '--mp4', '<completed-S4-MP4>', '--out', str(R5 / 'audio/完成MP4検査')],
                         'checks': ['strict AAC decode', 'sample-count duration', 'LUFS', 'true peak', 'silence', 'waveform lag', 'frozen mix SHA'],
                         'referenceNote': 'Auditor references the same SHA-identical original audio-v4; current C5 copy is bound above.'},
    }
    with MANIFEST.open('x') as stream:
        json.dump(manifest, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    print(json.dumps({'manifest': str(MANIFEST), 'cache': str(C5), 'counts': manifest['counts'], 'mix': manifest['mix'], 'pass': True}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
