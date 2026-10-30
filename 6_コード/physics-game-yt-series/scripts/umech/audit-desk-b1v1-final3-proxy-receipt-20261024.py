"""Correct only the legacy B2 joiner's hard-coded candidate label, add-only.

The unchanged reusable joiner actually read the B3 NPZ/dimensions/manifest.
Its first new B3 report is preserved with its incorrect legacy label. This new
receipt verifies every input and retains all714 rows/original NG verbatim.
"""
import hashlib
import json
from pathlib import Path

C = Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
OLD = C/'b3-original-proxy-physical-e1-peer.json'
OUT = C/'b3-original-proxy-physical-e1-peer-v2.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists()
    r = json.loads(OLD.read_text())
    for p, info in r['inputs'].items():
        assert sha(p)==info['sha256']
    manifest = json.loads((C/'actual-mp4-review/manifest.json').read_text())
    assert sha(manifest['video'])==manifest['videoSha256']
    assert len(r['samples'])==714
    assert str(C/'validation-final-v1/quality-frames-original.npz') in r['inputs']
    assert str(C/'final-held-dimensions.json') in r['inputs']
    assert str(C/'actual-mp4-review/manifest.json') in r['inputs']
    legacy_label = r['candidate']
    r['candidate']='B1 third actual encoded MP4 candidate (B3); B4 real-size and B5 physics repairs pending'
    r['labelCorrectionReceipt']={'originalNewReport':str(OLD),'originalReportSha256':sha(OLD),
        'preservedLegacyLabel':legacy_label,'reason':'Legacy reusable CPU joiner has a hard-coded second-candidate label; actual inputs and714 joined rows are B3.',
        'numericalRowsOrThresholdsChanged':False,'originalReportOverwritten':False,
        'receiptHelperSha256':sha(__file__),'actualMp4Sha256IndependentlyVerified':manifest['videoSha256']}
    assert r['automaticGate7or7bWaiverApplied'] is False and r['finalPassed'] is False
    with OUT.open('x') as f:
        json.dump(r,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
    print(OUT)


if __name__=='__main__':
    main()
