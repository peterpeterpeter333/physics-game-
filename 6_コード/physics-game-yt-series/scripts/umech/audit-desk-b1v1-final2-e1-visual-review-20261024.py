"""Record the 36 B2 contact sheets actually viewed by episode_e1.

Read-only inputs; no image generation/decoding, encoder, Blender or gate edits.
The explicit viewing list/observations below are human-like visual observations
from this task, not inferred from hashes. This is not final B3 approval.
"""
import hashlib
import json
from pathlib import Path
import time

B = Path('/private/tmp/ys/ys-chain-b1v1-final2-20261024')
MANIFEST = B / 'actual-mp4-review/manifest.json'
JOIN = B / 'b2-original-proxy-physical-e1-peer.json'
OUT = B / 'b2-e1-peer-actual-half180-356_5-review.json'
EXPANDED = (185.5, 186.5, 202.5, 203.5, 205.5, 208.5,
            249.5, 274.5, 294.5, 316.5, 339.5, 349.5)


def sha(p):
    h = hashlib.sha256()
    with Path(p).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def main():
    assert not OUT.exists()
    manifest = json.loads(MANIFEST.read_text())
    joined = json.loads(JOIN.read_text())
    video = Path(manifest['video'])
    video_sha = sha(video)
    assert video_sha == manifest['videoSha256'] == '46a8c21bc4bcd11aee2291ddb412b651a9c9dd759a8a7d89804a97d9cc51bb39'
    half = manifest['halfSeconds']['frames']
    subset = [r for r in half if 180 <= r['time'] <= 356.5]
    assert len(subset) == 354
    assert [r['time'] for r in subset] == [180 + .5 * i for i in range(354)]
    joined_rows = {r['actualMp4Frame']: r for r in joined['samples']}
    pages = []
    for n in range(37, 73):
        p = Path(manifest['halfSeconds']['pages'][n - 1])
        rows = half[(n - 1) * 10:n * 10]
        assert rows and p.name == 'half-seconds-%02d.jpg' % n
        pages.append({'page': n, 'file': str(p), 'sha256': sha(p),
                      'firstTime': rows[0]['time'], 'lastTime': rows[-1]['time'],
                      'framesActuallyViewed': len(rows), 'actuallyViewed': True,
                      'method': 'Actual encoded MP4 extraction, whole contact sheet visually inspected'})
    samples = []
    for r in subset:
        j = joined_rows[r['frame']]
        assert r['frame'] == j['actualMp4Frame'] == j['originalDeskFrame'] == j['physicalMeasuredOutputFrame']
        assert r['time'] == j['time'] and r['cue'] == j['cue'] and r['row'] == j['row']
        assert sha(r['file']) == j['actualJpegSha256']
        samples.append({**r, 'sha256': j['actualJpegSha256'],
                        'actuallyViewedOnHalfSecondSheet': True,
                        'expandedOriginalResolution': r['time'] in EXPANDED,
                        'originalFeatures': j['originalFeatures'],
                        'originalHeuristicFlags': j['originalHeuristicFlags'],
                        'physical': j['physical'],
                        'compositeFaceHint': j['compositeFaceHint'],
                        'automaticGateWaiverApplied': False})
    expanded = [{**r, 'sha256': sha(r['file']), 'actuallyViewed': True,
                 'resolution': 'original1080x1920'} for r in subset if r['time'] in EXPANDED]
    assert len(expanded) == len(EXPANDED)
    findings = [
        {'id': 'B2-hand-occlusion', 'classification': 'real_defect_not_waived',
         'timesActuallyExpanded': [202.5, 203.5, 205.5, 208.5],
         'observation': 'The blue sleeve/hand is disproportionately large in the foreground. At202.5 it covers much of the upper half of the stone; at203.5 it covers the named top/pole; at205.5 and208.5 it hides the small needle/protractor area. The pointing gesture removes static time but impairs the explanation.',
         'request': 'Root should locally shrink/re-route the pointing hand without changing the voice, object explanation or timing. The B3 white-edge helper does not address these times.',
         'rootNotified': True, 'fixedInThisReviewedMp4': False},
        {'id': 'B2-white-half-contrast', 'classification': 'known_real_weakness_separate_B3_correction',
         'timesActuallyExpanded': [339.5],
         'observation': 'The white half at the southern challenge is a very faint, thin edge on the ivory protractor. It exists, but cannot be called clearly readable in B2.',
         'request': 'Use separately viewed B3v2 reading-edge/black-outline probes and separately authorized99 actual-source render; B2 itself remains unchanged.',
         'rootNotified': True, 'fixedInThisReviewedMp4': False},
        {'id': 'B2-red-N-cap-occlusion', 'classification': 'real_visibility_weakness_not_caption_clipping',
         'timesActuallyExpanded': [185.5, 186.5],
         'observation': 'The red N label/leader, upward-pointing small needles and complete field pattern are visible. The physical lower red pole cap itself is almost hidden by the dark stone silhouette/view angle. It is not hidden by captions. The blue upper cap is visibly identifiable.',
         'request': 'Preserve this distinction in root disposition; physical width/clear labels alone do not prove the red cap visible.',
         'rootNotified': True, 'fixedInThisReviewedMp4': False}
    ]
    report = {
        'episode': 'B-1', 'candidate': 'Second actual encoded MP4 B2, not final B3',
        'reviewer': 'episode_e1', 'recordedAt': time.strftime('%Y-%m-%d %H:%M:%S'),
        'video': str(video), 'videoSha256ActuallyRehashed': video_sha,
        'manifest': str(MANIFEST), 'manifestSha256': sha(MANIFEST),
        'exactProxyPhysicalJoin': str(JOIN), 'exactProxyPhysicalJoinSha256': sha(JOIN),
        'scope': {'firstTime': 180, 'lastTime': 356.5, 'stepSeconds': .5,
                  'actualHalfSecondFramesViewed': 354, 'contactPagesViewed': 36,
                  'expandedActualJpegsViewed': len(expanded),
                  'allAssigned354ActuallyViewed': True,
                  'entireVideoAll30fpsFramesViewed': False,
                  'firstHalf0to179_5ReviewedByThisPass': False},
        'pages': pages, 'expandedActualJpegs': expanded,
        'samples': samples, 'findings': findings,
        'observationsNotAdditionalDefects': [
            '180..188.5 complete physically bounded field-line pattern is visible without the prior cropped outer paths. The principal is that magnetic field pattern, not the background glass board or the smaller central sphere alone.',
            'At274.5 the internal north-south bar shape is visible through the translucent globe, though low contrast. Its later red/blue S/N labels are clearly visible in rows32/34.',
            'At294.5 the yellow connector begins at the compass red needle tip above the fixed captions and reaches the blue S region. The physical lid no longer obstructs the connector.',
            'At316.5 the open book and score board are entirely in frame. The required two-subject composition includes both; the book alone is smaller than40 percent and its page illustration is faint. Do not report the book alone as66 percent or use the board as unrelated decoration.',
            'At349.5 the complete compass box/lid and both needle halves fit the frame; no prior giant-lid/inter-site empty-wood failure was seen in this assigned half-second range.',
            'Full-screen face portions are visible face composites, not evidence that a3D physical principal remains visible. Their disposition is separate from original7/7b metrics.'
        ],
        'originalGate7And7bResultsRetained': joined['originalNumericResultsRetained'],
        'originalWhole714SummaryRetained': joined['originalFeatureSummary'],
        'automaticGate7or7bWaiverApplied': False, 'otherNGExcused': False,
        'finalPassed': False, 'earListeningPerformed': False,
        'unconfirmed': [
            'Final B3 encoded video and its new actual-frame review are pending; B3 probe approval is not final approval.',
            'This354-frame review does not inspect the first180 seconds, every30fps frame, all cue ends or every camera-transition intermediate.',
            'Audio was not listened to in this visual pass. No audio regeneration, source/gate/canonical text edit or GPU operation was performed by the reviewer.',
            'The original7/7b NG remains NG. Physical dimensions and actual visual evidence are joined for root scene-by-scene disposition, never automaticPASS.'
        ]
    }
    assert sum(r['framesActuallyViewed'] for r in pages) == 354
    with OUT.open('x') as f:
        json.dump(report, f, ensure_ascii=False, indent=1, allow_nan=False)
        f.write('\n')
    print(json.dumps({'out': str(OUT), 'pagesActuallyViewed': 36,
                      'actualFramesActuallyViewed': 354, 'expanded': len(expanded),
                      'findings': len(findings), 'finalPassed': False}, ensure_ascii=False))


if __name__ == '__main__':
    main()
