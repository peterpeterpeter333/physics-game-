"""Read-only source validation; writes a fresh diagnostic receipt, not media."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

W = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
ACTUAL = Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029/blender/motion-events.json')
AST = OUT / 'motion-events-readonly-evaluation.json'
AUDIO = OUT / 'audio'
RECEIPT = AUDIO / 'S3-audio-blender-motion-validation_20261029.json'


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    if RECEIPT.exists():
        raise FileExistsError('Diagnostic receipt already exists; refusing overwrite.')
    actual, expected = read(ACTUAL), read(AST)
    mix_record = read(AUDIO / 'ys-chain-b2a_gpt_20261029.s3.mix.json')
    levels = read(AUDIO / 'ys-chain-b2a_gpt_20261029.s3.levels.json')
    preflight = read(AUDIO / 'codec-preflight/aac96-preflight.json')
    kicks = [event for event in levels['sfx'] if event['kind'] == 'frog-kick']
    checks = {
        'fpsExactly30': actual['fps'] == expected['fps'] == 30,
        'tenEventsExactly': len(actual['events']) == len(expected['events']) == len(kicks) == 10,
        'eventsExactlyEqualToAst': actual['events'] == expected['events'],
        'shapeExactlyEqualToAst': actual['shape'] == expected['shape'],
        'audioSourceEventsExactlyEqualToBlender': [k['sourceEvent'] for k in kicks] == actual['events'],
        'audioNearestFramePlacementExact': all(k['frame'] == round(e['start'] * actual['fps']) and k['seconds'] == k['frame'] / actual['fps'] and k['sample'] == round(k['seconds'] * levels['sampleRate']) for k, e in zip(kicks, actual['events'])),
        'mixFileHashUnchanged': sha(Path(mix_record['output'])) == mix_record['mixSha256'] == preflight['inputSha256'],
        'permanentMixCopyHashUnchanged': sha(AUDIO / 'ys-chain-b2a_gpt_20261029.s3.mixed.wav') == mix_record['mixSha256'],
        'aacPreflightPassed': preflight['pass'] is True,
    }
    receipt = {
        'createdUtc': datetime.now(timezone.utc).isoformat(),
        'scope': 'Read-only comparison of actual Blender-emitted motion events, independently AST-extracted events, and frozen audio-v4 effect placement. Not visual render verification, not final MP4 validation, not an ear check.',
        'inputs': {
            'actualBlender': {'path': str(ACTUAL), 'sha256': sha(ACTUAL)},
            'astEvaluation': {'path': str(AST), 'sha256': sha(AST)},
            'mixRecord': str(AUDIO / 'ys-chain-b2a_gpt_20261029.s3.mix.json'),
            'mixSha256': mix_record['mixSha256'],
            'sourceVoiceSha256': mix_record['sourceVoiceSha256'],
        },
        'checks': checks,
        'pass': all(checks.values()),
        'events': actual['events'],
        'metricsFromFinalAudio': {
            'durationSeconds': levels['durationSeconds'],
            'integratedLUFS': levels['integrated_lufs'],
            'truePeakDbfs': levels['peak_dbfs'],
            'voiceBgmDifferenceMedianDb': levels['voiceBgmDifferenceMedianDb'],
            'voiceBgmDifferenceP10Db': levels['voiceBgmDifferenceP10Db'],
            'quietRuns': levels['quiet_runs_below_-35dB_0.25s'],
            'aacPreflight': preflight,
        },
        'unchanged': ['Master narration', 'source script', 'original voice', 'subtitle text', 'subtitle timings', 'audio-v4 WAV', 'all existing files'],
        'remaining': ['Final MP4 strict decode/loudness/silence check', 'Rendered movement and flash visual verification', 'Ear-based full listen not performed: this chat cannot listen to audio'],
    }
    RECEIPT.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'receipt': str(RECEIPT), 'pass': receipt['pass'], 'checks': checks}, ensure_ascii=False, indent=2))
    if not receipt['pass']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
