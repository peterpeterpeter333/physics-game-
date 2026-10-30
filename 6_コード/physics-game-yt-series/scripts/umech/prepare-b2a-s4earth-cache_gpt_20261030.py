#!/usr/bin/env python3
"""Exclusive C6 real copies; keep C5 and every old source unchanged."""
import argparse
import hashlib
import json
import math
import shutil
from datetime import datetime, timezone
from pathlib import Path

W = Path(__file__).resolve().parents[2]
C5 = Path('/private/tmp/ys/ys-chain-b2a_s4final_gpt_20261030')
C6 = Path('/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030')
R = W / 'outputs/ys-chain-b2a-backup/S4修正02_20261030'
OLD = R / 'S4final-frozen-input-and-audio-reuse_20261030.json'
RECEIPT = R / 'S4earth-frozen-input-and-audio-reuse_20261030.json'
ID = 'ys-chain-b2a_gpt_20261029'
NF = 14846
FPS = 30


def read(p):
    return json.loads(p.read_text())


def sha(p):
    assert p.is_file() and not p.is_symlink(), str(p)
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''):
            h.update(b)
    return h.hexdigest()


def realcopy(source, target):
    assert not source.is_symlink() and source.is_file(), str(source)
    assert not target.exists() and not target.is_symlink(), str(target)
    before = sha(source)
    target.parent.mkdir(parents=True, exist_ok=True)
    with source.open('rb') as f, target.open('xb') as g:
        shutil.copyfileobj(f, g)
    assert sha(source) == before == sha(target), str(target)
    return {'source': str(source), 'target': str(target), 'sha256': before,
            'bytes': source.stat().st_size, 'status': 'real-file-exclusive-copy'}


def aggregate(root, relative_paths):
    h = hashlib.sha256()
    count, size = 0, 0
    for rel in sorted(relative_paths):
        p = root / rel
        digest = sha(p)
        n = p.stat().st_size
        h.update((str(rel) + '\0' + str(n) + '\0' + digest + '\n').encode())
        count += 1
        size += n
    return {'root': str(root), 'count': count, 'bytes': size, 'sha256': h.hexdigest(),
            'method': 'Sorted relative path/bytes/content-SHA aggregate; no individual frame hash table saved'}


def bounds():
    rows = read(C5 / 'blender/b2a-scene-data.json')['rows']
    ranges = []
    for row in rows:
        if row['row'] in (6, 7):
            first = math.ceil(row['start'] * FPS)
            end = math.ceil(row['end'] * FPS)
            ranges.append({'row': row['row'], 'fromFrame': first,
                           'toFrameExclusive': end, 'count': end - first,
                           'startSeconds': row['start'], 'endSeconds': row['end']})
    assert len(ranges) == 2
    start = min(r['fromFrame'] for r in ranges)
    end = max(r['toFrameExclusive'] for r in ranges)
    exact = {j for r in ranges for j in range(r['fromFrame'], r['toFrameExclusive'])}
    return {'rows': ranges, 'fromFrame': start, 'toFrameExclusive': end,
            'framesToRender': end - start, 'exactRowFrameCount': len(exact),
            'cueGapFramesAlsoRedrawn': sorted(set(range(start, end)) - exact),
            'gapReason': 'Cue gap retains preceding row6 visual; redraw avoids one stale ground-board frame'}


def metadata_outside(root, span):
    outside = lambda j: not (span['fromFrame'] <= int(j) < span['toFrameExclusive'])
    primary = read(root / 'blender/primary.json')
    camera = read(root / 'blender/camera-records.json')
    anchors = read(root / 'blender/desk/anchors.json')
    assert len(camera) == NF and all(len(a) == NF for a in anchors['anchors'].values())
    payloads = {
        'primary': {k: v for k, v in primary.items() if outside(k)},
        'camera-records': [r for r in camera if outside(r['j'])],
        'anchors': {k: [v for j, v in enumerate(values) if outside(j)]
                    for k, values in anchors['anchors'].items()},
    }
    return {k: hashlib.sha256(json.dumps(v, ensure_ascii=False, sort_keys=True,
                                        separators=(',', ':')).encode()).hexdigest()
            for k, v in payloads.items()}


def verify():
    receipt = read(RECEIPT)
    bad = []
    for item in receipt['protectedSources']:
        if sha(Path(item['path'])) != item['sha256']:
            bad.append(item['path'])
    for item in receipt['criticalCopies']:
        if sha(Path(item['source'])) != item['sha256'] or sha(Path(item['target'])) != item['sha256']:
            bad.append(item['target'])
    speech = [p.relative_to(C5 / 'speech') for p in (C5 / 'speech').rglob('*') if p.is_file()]
    if aggregate(C5 / 'speech', speech)['sha256'] != aggregate(C6 / 'speech', speech)['sha256']:
        bad.append('speech aggregate')
    span = receipt['groundBoardPatch']
    frames = [Path('%05d.jpg' % j) for j in range(NF)
              if not span['fromFrame'] <= j < span['toFrameExclusive']]
    source = aggregate(C5 / 'blender/desk', frames)
    target = aggregate(C6 / 'blender/desk', frames)
    if source['sha256'] != receipt['unchangedNativeCopies']['source']['sha256'] or source['sha256'] != target['sha256']:
        bad.append('outside-patch native aggregate')
    if metadata_outside(C5, span) != metadata_outside(C6, span):
        bad.append('outside-patch primary/camera/anchors')
    result = {'cache': str(C6), 'mode': 'read-only verification', 'pass': not bad,
              'mismatches': bad, 'criticalCopies': len(receipt['criticalCopies']),
              'protectedSources': len(receipt['protectedSources']),
              'unchangedOutsideNativeFrames': target['count'],
              'speechFiles': len(speech), 'earsPerformed': False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    assert not bad


def prepare():
    assert not C6.exists() and not RECEIPT.exists(), 'C6 and receipt must both be fresh'
    old = read(OLD)
    assert old['cache'] == str(C5)
    for item in old['protectedSources']:
        assert sha(Path(item['path'])) == item['sha256'], item['path']
    meta = read(C5 / 'blender/desk/meta.json')
    assert meta['resolution'] == [1080, 1920] and meta['samples'] == 16
    assert meta['frames'] == NF and meta['fps'] == FPS and not meta['previewOnly'] and meta['finished']
    span = bounds()
    C6.mkdir()
    critical = []
    for item in old['criticalCopies']:
        source = Path(item['target'])
        relative = source.relative_to(C5)
        copied = realcopy(source, C6 / relative)
        assert copied['sha256'] == item['sha256']
        copied['role'] = item['role']
        critical.append(copied)
    speech = [p.relative_to(C5 / 'speech') for p in (C5 / 'speech').rglob('*') if p.is_file()]
    for rel in speech:
        realcopy(C5 / 'speech' / rel, C6 / 'speech' / rel)
    speech_source, speech_target = aggregate(C5 / 'speech', speech), aggregate(C6 / 'speech', speech)
    assert speech_source['sha256'] == speech_target['sha256']
    metadata = ['row-to-time.json', 'shot-plan.json',
                'blender/b2a-scene-data.json', 'blender/storyboard-plan.json',
                'blender/camera-poses.json', 'blender/camera-motion.json',
                'blender/camera-records.json', 'blender/primary.json',
                'blender/desk/anchors.json', 'blender/motion-events.json',
                'blender/word-fallbacks.json']
    basis = [realcopy(C5 / name, C6 / name) for name in metadata]
    for source in sorted((C5 / 'problem').rglob('*')):
        if source.is_file():
            realcopy(source, C6 / source.relative_to(C5))
    relative_frames = []
    for j in range(NF):
        if span['fromFrame'] <= j < span['toFrameExclusive']:
            continue
        rel = Path('%05d.jpg' % j)
        realcopy(C5 / 'blender/desk' / rel, C6 / 'blender/desk' / rel)
        relative_frames.append(rel)
    source, target = aggregate(C5 / 'blender/desk', relative_frames), aggregate(C6 / 'blender/desk', relative_frames)
    assert source['sha256'] == target['sha256'] and target['count'] == NF - span['framesToRender']
    assert not (C6 / 'blender/desk/meta.json').exists()
    assert not any((C6 / 'blender/desk' / ('%05d.jpg' % j)).exists()
                   for j in range(span['fromFrame'], span['toFrameExclusive']))
    for item in old['protectedSources']:
        assert sha(Path(item['path'])) == item['sha256']
    receipt = dict(old)
    receipt.update({'completedUtc': datetime.now(timezone.utc).isoformat(), 'cache': str(C6),
                    'priorReceipt': {'path': str(OLD), 'sha256': sha(OLD)},
                    'criticalCopies': critical, 'speechCopySummary': {'source': speech_source, 'target': speech_target},
                    'groundBoardPatch': span, 'nativeMetadataBasisCopies': basis,
                    'unchangedNativeCopies': {'source': source, 'target': target},
                    'outsidePatchMetadataInitialSha256': metadata_outside(C6, span),
                    'nativeMetaCopied': False, 'nativePatchComplete': False,
                    'notCopied': ['rows6/7 exact native frames and one inter-cue hold frame', 'native meta',
                                  'old videos', 'gate outputs', 'render progress', 'old render jobs'],
                    'scope': 'Frozen real copies plus unchanged exact-j native subset; targeted native patch and final QA pending'})
    receipt['mix'] = dict(old['mix'], file=str(C6 / Path(old['mix']['file']).relative_to(C5)),
                          record=str(C6 / Path(old['mix']['record']).relative_to(C5)))
    receipt['counts'] = dict(old['counts'], unchangedNativeFrames=target['count'],
                             groundBoardNativeFramesPending=span['framesToRender'])
    with RECEIPT.open('x') as f:
        json.dump(receipt, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(json.dumps({'receipt': str(RECEIPT), 'cache': str(C6), 'patch': span,
                      'copiedNativeFrames': target['count'], 'allRealFiles': True,
                      'audioRegenerated': False, 'remixed': False}, ensure_ascii=False, indent=2))
    verify()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    verify() if args.verify else prepare()
