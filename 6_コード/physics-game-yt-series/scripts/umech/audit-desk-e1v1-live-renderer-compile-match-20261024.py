"""Compare a REAL GUI diagnostic with the independent 3.13 reproduction.

Read-only evidence join; no bpy import, renderer change, guard waiver or GPU.
"""
import argparse
import hashlib
import json
from pathlib import Path

C = Path('/private/tmp/ys/ys-chain-e1v1')
REPRO = C / 'e1v1-renderer-compile-reproduction-20261024.json'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--diagnostic', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    assert not args.out.exists(), 'Preserve prior evidence'
    live = json.loads(args.diagnostic.read_text())
    repro = json.loads(REPRO.read_text())
    assert live['id'] == repro['id'] == 'ys-chain-e1v1'
    full = repro['codes']['guiAdapterWholeSourceMain']
    canonical = repro['codes']['originalRunnerExtractedAstMain']
    checks = {
        'sameProtectedSharedSource': live['sharedSourceSha256'] == repro['sourceSha256'],
        'oldRendererGlobalsAreOriginalModule': live['oldRendererGlobalsAreOriginalModule'],
        'liveOldBytecodeMatchesReproducedWholeSource': live['oldRendererCode']['bytecodeHex'] == full['bytecodeHex'],
        'liveOldExceptionTableMatchesReproducedWholeSource': live['oldRendererCode']['exceptionTableHex'] == full['exceptionTableHex'],
        'liveCanonicalBytecodeMatchesReproducedExtractedAst': live['canonicalRendererCode']['bytecodeHex'] == canonical['bytecodeHex'],
        'liveCanonicalExceptionTableMatchesReproducedExtractedAst': live['canonicalRendererCode']['exceptionTableHex'] == canonical['exceptionTableHex'],
        'liveDifferencePathsOnlyCodeAndExceptionTable': sorted(d['path'] for d in live['codeDifferences']) == ['main.co_code', 'main.co_exceptiontable'],
        'reproducedDifferencePathsOnlyCodeAndExceptionTable': sorted(repro['wholeSourceVsExtractedAstDifferencePaths']) == ['main.co_code', 'main.co_exceptiontable'],
        'normalizedDiagnosticInstructionsEqual': repro['diagnosticNormalizedInstructionsEqual'],
        'guiAdapterDoesNotChangeMainCode': repro['guiAdapterDoesNotChangeMainCode'],
    }
    confirmed = all(checks.values())
    record = {'id': 'ys-chain-e1v1', 'scope': 'Real GUI code compared byte-for-byte with independent compile-only reproduction',
              'liveDiagnostic': {'path': str(args.diagnostic), 'sha256': sha(args.diagnostic)},
              'reproduction': {'path': str(REPRO), 'sha256': sha(REPRO)},
              'helperSha256': sha(__file__), 'checks': checks,
              'causeConfirmed': confirmed,
              'cause': 'Same source definition, different Python3.13 whole-source versus extracted-AST method-call NULL encoding and exception offsets' if confirmed else 'NOT confirmed; investigate differing checks without bypassing original guard',
              'originalGuardStillRequired': True, 'guardModifiedOrWaived': False,
              'restorationOrRenderingPerformed': False,
              'nextStepIfConfirmed': 'Root-only canonical main AST restoration into original module, 42-state projection/image-file preservation checks, then unchanged original guard'}
    with args.out.open('x') as f:
        json.dump(record, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print(json.dumps({'out': str(args.out), 'causeConfirmed': confirmed, 'checks': checks}))
    assert confirmed, 'Original guard remains; unmatched code needs investigation'


if __name__ == '__main__':
    main()
