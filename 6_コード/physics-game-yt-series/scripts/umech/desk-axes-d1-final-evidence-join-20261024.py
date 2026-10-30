"""Join actual encoded-eye decisions to untouched proxy and exact physical facts.

No Blender, rendering, gate edits, automatic waiver or final acceptance. This
only reports whether each explicitly reviewed proxy-conflict candidate has
the evidence required by the user's limited 7/7b/sparse authorization. Every
original NG is copied unchanged, and all unrelated NG remain unresolved.
"""
import argparse, hashlib, json
from pathlib import Path

def read(path):
    return json.loads(Path(path).read_text())

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def join(request_file, physical_file, manifest_file, decisions_file, out):
    request_file, physical_file, manifest_file, decisions_file, out = map(
        Path, (request_file, physical_file, manifest_file, decisions_file, out))
    assert not out.exists() and not out.is_symlink(), 'Preserve earlier evidence'
    request, physical, manifest, decisions = map(
        read, (request_file, physical_file, manifest_file, decisions_file))
    assert request['episode'] == physical['episode'] == manifest['episode'] == decisions['episode'] == 'D-1'
    assert request['automaticApproval'] is False and physical['automaticApproval'] is False
    assert physical['exactDeliveredSourcesAndPosesUsed'] is True and physical['everyOriginalNGPreserved'] is True
    assert physical['requestSha256'] == sha(request_file)
    assert physical['originalGateSha256'] == request['originalGateSha256']
    assert physical['originalFrameSamplesSha256'] == request['originalFrameSamplesSha256']
    assert sha(request['originalGate']) == request['originalGateSha256']
    assert sha(request['originalFrameSamples']) == request['originalFrameSamplesSha256']
    assert manifest['mp4Sha256'] == sha(manifest['mp4']) == decisions['mp4Sha256']
    assert decisions['actualEncodedMp4FramesActuallyViewed'] is True
    assert decisions['originalGateNGPreserved'] is True
    actual = {int(r['frameIndex']): r for r in manifest['frames']}
    geometry = {round(r['time'] * 30): r for r in physical['rows']}
    eyes = {int(r['frameIndex']): r for r in decisions['decisions']}
    assert len(eyes) == len(decisions['decisions']), 'No ambiguous eye decision'
    assert len(geometry) == len(physical['rows']), 'No ambiguous delivered frame'
    flags = ['actualPrincipalMatched', 'principalActuallyVisible', 'noSevereClipping',
             'educationalReadabilityPass', 'cueVoiceContentConsistent', 'noPatternGaming']
    rows = []
    for candidate in request['requests']:
        j = int(candidate['frameIndex'])
        assert j == round(candidate['time'] * 30) and j in actual and j in geometry
        frame, surface, eye = actual[j], geometry[j], eyes.get(j)
        assert surface['deliveredFrame']['frame'] == j
        frame_file = manifest_file.parent / 'frames-d1v1' / frame['file']
        assert sha(frame_file) == frame['fileSha256'], ('Changed actual MP4 JPEG', j)
        physical_pass = surface['pass'] is True
        eye_pass = False
        if eye is not None:
            assert eye['fileSha256'] == frame['fileSha256']
            assert Path(eye['actualMp4FrameFile']).resolve() == frame_file.resolve()
            assert isinstance(eye.get('note'), str) and eye['note'].strip()
            eye_pass = all(eye.get(flag) is True for flag in flags)
        # An actual width/visibility/readability failure is never a proxy waiver.
        ready = physical_pass and eye_pass
        rows.append({
            'frameIndex': j, 'time': candidate['time'], 'cue': surface['cue'],
            'originalProxyCandidate': candidate, 'originalNGPreserved': True,
            'exactDeliveredObjectAndCamera': surface['deliveredFrame'],
            'actualSemanticPrincipal': surface['semanticPrincipal'],
            'actualEvaluatedSurface': surface['actualSurface'],
            'physicalChecks': surface['physicalChecks'],
            'criticalChecks': surface['criticalChecks'],
            'physicalPass': physical_pass, 'actualMp4FrameFile': str(frame_file),
            'actualMp4FrameSha256': frame['fileSha256'],
            'actualEyeDecision': eye, 'actualEyeDecisionPass': eye_pass,
            'caseEvidenceSatisfiesLimitedUserAuthorization': ready,
            'notAnOriginalInspectorPass': True,
        })
    other_ng = [r for r in request['originalNG'] if str(r['no']) not in ('7', '7b')]
    result = {
        'episode': 'D-1', 'kind': 'Original facts plus explicit case evidence; never rewritten gate results',
        'mp4': manifest['mp4'], 'mp4Sha256': manifest['mp4Sha256'],
        'inputs': {str(p): sha(p) for p in (request_file, physical_file, manifest_file, decisions_file)},
        'originalGatePass': request['originalGatePass'],
        'originalNG': request['originalNG'], 'allOriginalNGPreserved': True,
        'unresolvedNonSupplementableNG': other_ng,
        'candidateSamples': len(rows), 'explicitlyEyeReviewedCandidates': sum(r['actualEyeDecision'] is not None for r in rows),
        'candidatesWithCompletePermittedCaseEvidence': sum(r['caseEvidenceSatisfiesLimitedUserAuthorization'] for r in rows),
        'unresolvedCandidateFrames': [r['frameIndex'] for r in rows if not r['caseEvidenceSatisfiesLimitedUserAuthorization']],
        'allCandidateCaseEvidencePresent': bool(rows) and all(r['caseEvidenceSatisfiesLimitedUserAuthorization'] for r in rows),
        'scope': 'Only actual object size/visibility/readability conflicts with untouched original 7/7b/sparse proxies; no other test exemption',
        'allHalfSecondsAndCueEndsViewedClaimedHere': False,
        'actualEarListeningClaimed': False, 'finalAcceptance': False,
        'rows': rows,
    }
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(result, ensure_ascii=False, indent=1) + '\n')
    return result

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    for name in ('request', 'physical', 'manifest', 'decisions', 'out'):
        parser.add_argument('--' + name, required=True)
    args = parser.parse_args()
    result = join(args.request, args.physical, args.manifest, args.decisions, args.out)
    print(json.dumps({k: v for k, v in result.items() if k not in ('rows', 'originalNG')}, ensure_ascii=False))
