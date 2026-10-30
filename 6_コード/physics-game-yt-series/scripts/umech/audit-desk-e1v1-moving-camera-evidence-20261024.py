"""Record the actual existing E r9 moving-camera re-review, never a new trial."""
import hashlib
import json
from pathlib import Path

C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = C / 'e1v1-r9-moving-camera-existing-review-20261024.json'
AUDIT = C / 'blender/gate-e1v1-r9/e1v1-r9-physical-bounds.json'
MANIFEST = C / 'review-e1v1-r9-allcue/e1v1-review-manifest.json'
OBSERVED = {
 'fog:night': ([1], 'Existing slow opening remains readable and quiet; no camera replacement.'),
 'two:need': ([46], 'Globe complete at 46; earlier audit points are below40%, not visually inspected at those exact intermediate times.'),
 'two:grid': ([56], 'CONFIRMED: chart is enlarged and cut off along the bottom; mostly empty wall/table at entry.'),
 'lat:sky': ([62], 'Globe complete but small/high; polar rod reaches beyond top. Exact globe width audit is below40% during first half.'),
 'lon:star': ([97], 'Globe, both observers and white star are visible; retain same-site angle change.'),
 'lon:spin': ([111], 'Globe+disk complete, but numeric physical width is over70% during entry. Same-site move retained; NOT approved as a size exception.'),
 'lon:torch': ([125], 'Torch+globe complete at125. Earlier124.5 clip candidate has NO exact existing sample; final half-second image required.'),
 'tz:real': ([146], 'CONFIRMED: London clock and its sign are cut off at right.'),
 'tz:135': ([159], 'CONFIRMED: most of globe lies outside left edge; central empty table.'),
 'ship:sun': ([180], 'CONFIRMED: ship extends outside right edge at entry; sun is visible.'),
 'clk:side': ([205], 'Clock fills intended closeup; no full-frame clipping seen. Same-site closeup retained.'),
 'clk:111': ([215], 'CONFIRMED: globe cut off at left and high in frame.'),
 'clk:shift': ([236], 'Chart visible but wide and low at236; earlier audit points include clipping. Target composition enters late.'),
 'dr:none': ([245], 'CONFIRMED: compass box cut off at right and ship/sailor small/off-center.'),
 'dr:drift': ([263], 'CONFIRMED: chart and explanatory vector cut off at left.'),
 'pen:hyp': ([296], 'CONFIRMED: pendulum clock remains very small at upper-left while most of frame is empty table.'),
 'pen:fact': ([309], 'CONFIRMED: pendulum clock/ship mostly outside right edge.'),
 'prize:act': ([330], 'Bag complete at330. Earlier329.14..329.84 numerical clip candidate lacks exact intermediate existing image.'),
 'next:order': ([350], 'CONFIRMED: ship cut off left and ghost clock oversized during inter-site entry.'),
 'last:clock': ([379, 380], 'CONFIRMED at379: chart cut off left/bottom; small clock and empty table dominate. At380 chart returns fully.'),
}


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists(), 'Preserve this actual review record'
    audit = json.loads(AUDIT.read_text())
    manifest = json.loads(MANIFEST.read_text())
    moving = [r for r in audit['rows'] if not r['stable']]
    full_clip = lambda r: r['box'][0] < 0 or r['box'][1] < 0 or r['box'][2] > 1080 or r['box'][3] > 1920
    bad = lambda r: full_clip(r) or not .4 <= r['width'] <= .7
    assert len(moving) == 201 and sum(full_clip(r) for r in moving) == 91
    assert sum(not .4 <= r['width'] <= .7 for r in moving) == 116
    assert sum(bad(r) for r in moving) == 137
    keys = list(dict.fromkeys(r['cue'] for r in moving))
    assert set(keys) == set(OBSERVED)
    review = []
    for key in keys:
        times, observation = OBSERVED[key]
        actual = []
        for t in times:
            matches = [f for f in manifest['frames'] if f['t'] == t and f['cue'] == key]
            assert len(matches) == 1
            image = matches[0]
            actual.append({**image, 'frame': round(t * 30), 'sha256': sha(image['file']),
                           'actuallyDisplayedAndViewed': True})
        points = [r for r in moving if r['cue'] == key]
        review.append({'cue': key, 'row': points[0]['row'],
                       'actualExistingPreviewImagesViewed': actual, 'observation': observation,
                       'numericMovingSamples': points,
                       'numericCandidates': {'fullFrameClip': sum(full_clip(r) for r in points),
                                             'widthOutside40to70': sum(not .4 <= r['width'] <= .7 for r in points)},
                       'notAutomaticallyApprovedBecauseMoving': True})
    assert sum(len(r['actualExistingPreviewImagesViewed']) for r in review) == 21
    result = {'id': 'ys-chain-e1v1', 'sourceStage': 'frozen r9',
              'scope': 'Re-review of 21 ACTUALLY DISPLAYED existing rendered 2D preview JPEGs, not final encoded MP4 and not a new camera-patch trial',
              'originalAudit': {'path': str(AUDIT), 'sha256': sha(AUDIT), 'stableViolations': 0,
                                'stableZeroDoesNotApproveMoving': True,
                                'movingSamples': 201, 'fullFrameClipCandidates': 91,
                                'widthOutside40to70Candidates': 116, 'eitherCandidates': 137},
              'existingManifest': {'path': str(MANIFEST), 'sha256': sha(MANIFEST)},
              'actuallyViewedImages': 21, 'movingCuesRepresented': 20, 'review': review,
              'newCameraPatchRenderedOrViewed': False,
              'sourceRawVoiceSubtitlesOrOriginalCheckerChanged': False,
              'originalNGPreserved': True, 'finalAcceptance': False,
              'unconfirmed': ['No exact existing124.5-second preview; final actual MP4 must show it.',
                              'Most of the 201 numerical transition points do not have exact existing preview JPEGs.',
                              'All actual camera-patch JPEGs and final MP4 half-seconds/whole seconds/cue ends/move midpoints remain to be reviewed.']}
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(OUT)


if __name__ == '__main__':
    main()
