"""Add-only correction of an isolated-frame interpretation; no old evidence edit."""
import hashlib
import json
from pathlib import Path

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
OUT = C/'b3-e1-peer-n2-temporal-interpretation-erratum-20261024.json'
SPEC = Path('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/B-1/B-1_制作指示書.md')


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists()
    old = C/'b3-e1-peer-actual-half180-356_5-review.json'
    report = json.loads(old.read_text())
    image = C/'actual-mp4-review/frames/shot-0298.jpg'
    source = W/'scripts/blender/desk_b1v1.py'
    assert sha(source) == '7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
    result = {'id': 'ys-chain-b1v1', 'candidate': 'B3',
              'kind': 'Correction of E-peer isolated97.6s physical-violation interpretation after rereading full individual N2',
              'earlierReview': str(old), 'earlierReviewSha256': sha(old),
              'earlierReviewPreservedUnchanged': True,
              'observationRetained': {'frame': 2928, 'time': 97.6, 'file': str(image), 'sha256': sha(image),
                                      'actuallyViewedPreviously': True, 'facingEnds': ['S', 'N']},
              'interpretationWithdrawn': 'The observed S/N at97.6 alone is not evidence of incorrect magnet physics: individual N2 explicitly prescribes NN approach, an180° escape flip, then SN attraction during the post-voice pause.',
              'priorError': 'I checked the single-frame caption/pole pairing without preserving the full specified comic temporal sequence. The claim of a confirmed original physics violation is withdrawn.',
              'correctReviewCriterion': 'Verify the complete NN approach/repulsion, back-eased180° escape, then SN attachment stages at their proper times, together with unchanged voice/captions. A proposed derivative may improve stage readability but must retain the requested flip and attachment.',
              'v2RemovingFlipNotAdopted': True,
              'newV3Status': 'Root/D designing separate add-only temporal-stage derivative; actual probe not yet received or accepted by this peer.',
              'originalSourceRawVideosCheckersAndNGRetained': True,
              'all354AssignedLaterFramesAnd36PageSHAReviewStillValid': report.get('allAssignedHalfSecondsActuallyViewed',False),
              'specification': str(SPEC), 'specificationSha256': sha(SPEC),
              'source': str(source), 'sourceSha256': sha(source),
              'renderCalls': 0, 'earListeningPerformed': False, 'finalPassed': False}
    # Do not infer a viewing flag from a differently named earlier field.
    result['laterReviewScopeUnchanged'] = 'The previously recorded180..356.5s actual-page/expanded-frame observations are unchanged; only the extra97.6 interpretation is corrected.'
    with OUT.open('x') as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(OUT)


if __name__ == '__main__':
    main()
