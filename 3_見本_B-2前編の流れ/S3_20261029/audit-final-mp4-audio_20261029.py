"""Read-only final MP4 audio audit. Creates new diagnostics; never changes media.

No ear-listening claim is made. audio-v4 remains the immutable reference.
"""
import argparse
import hashlib
import json
import math
import re
import subprocess
import wave
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

FF = '/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
HERE = Path(__file__).resolve().parent
MIX_RECORD = HERE / 'audio/ys-chain-b2a_gpt_20261029.s3.mix.json'
LEVELS = HERE / 'audio/ys-chain-b2a_gpt_20261029.s3.levels.json'
TIMING = Path('/private/tmp/ys/ys-chain-b2a_gpt_20261029/ys-chain-b2a_gpt_20261029.json')
SR = 24000
FPS = 30


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def read_json(path):
    return json.loads(path.read_text())


def run(args):
    return subprocess.run([FF, *args], capture_output=True)


def decoded_pcm(path):
    result = run(['-hide_banner', '-nostats', '-xerror', '-err_detect', 'explode', '-i', str(path), '-map', '0:a:0', '-vn', '-sn', '-dn', '-c:a', 'pcm_s16le', '-f', 's16le', '-'])
    return result, np.frombuffer(result.stdout, dtype='<i2').astype(np.float32) / 32768


def stream_identity(stderr):
    # Inspect only the Input section; Output repeats the same stream identity.
    inp = stderr.split('Output #', 1)[0]
    audio = [line.strip() for line in inp.splitlines() if re.search(r'Stream #\d+:\d+.*Audio:', line)]
    duration = re.search(r'Duration: (\d+):(\d+):([\d.]+)', inp)
    seconds = int(duration[1]) * 3600 + int(duration[2]) * 60 + float(duration[3]) if duration else None
    return audio, seconds


def compare_waveform(actual, reference):
    # Codec-fidelity/alignment evidence, not a speech-intelligibility judgment.
    # Use a voiced 8-second block to estimate delay, then inspect the same
    # samples in six distributed 4-second blocks without time stretching.
    a = actual[2 * SR:10 * SR]
    b = reference[2 * SR:10 * SR]
    n_corr = len(a) + len(b) - 1
    n_fft = 1 << (n_corr - 1).bit_length()
    corr = np.fft.irfft(np.fft.rfft(a, n_fft) * np.fft.rfft(b[::-1], n_fft), n_fft)[:n_corr]
    lags = np.arange(1 - len(b), len(a))
    eligible = np.abs(lags) <= 2048
    lag = int(lags[eligible][int(np.argmax(corr[eligible]))])
    records = []
    for seconds in [2, 60, 150, 260, 380, 485]:
        start = int(seconds * SR)
        lo = max(0, start + lag)
        n = min(4 * SR, len(reference) - start, len(actual) - lo)
        x = actual[lo:lo + n].astype(np.float64)
        y = reference[start:start + n].astype(np.float64)
        rms = math.sqrt(float(np.mean(y * y)))
        error = math.sqrt(float(np.mean((x - y) ** 2))) / max(rms, 1e-12)
        pearson = float(np.corrcoef(x, y)[0, 1])
        records.append({'startSeconds': seconds, 'samples': n, 'pearson': pearson, 'relativeRmsError': error})
    return {'estimatedLagSamples': lag, 'estimatedLagSeconds': lag / SR, 'blocks': records, 'scope': 'AAC fidelity diagnostic only; not an ear check or a new mixing pass.'}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mp4', required=True)
    parser.add_argument('--out', required=True, help='Fresh diagnostic directory; existing directories are refused.')
    args = parser.parse_args()
    movie = Path(args.mp4).resolve()
    out = Path(args.out).resolve()
    assert movie.is_file() and movie.suffix.lower() == '.mp4', movie
    if out.exists():
        raise FileExistsError(f'Refusing existing diagnostic directory: {out}')
    assert out != movie.parent and movie not in out.parents
    out.mkdir(parents=True, exist_ok=False)
    record, levels, timing = read_json(MIX_RECORD), read_json(LEVELS), read_json(TIMING)
    mix = Path(record['output'])
    mix_hash_before = sha(mix)
    assert mix_hash_before == record['mixSha256'], 'Frozen audio-v4 hash mismatch'
    command = ['-hide_banner', '-nostats', '-xerror', '-err_detect', 'explode', '-i', str(movie), '-map', '0:a:0', '-vn', '-sn', '-dn', '-af', 'ebur128=framelog=quiet:peak=true,silencedetect=n=-35dB:d=0.25', '-f', 'null', '-']
    loudness = run(command)
    log = loudness.stderr.decode('utf8', errors='replace')
    (out / 'ffmpeg-audio-decode-loudness-silence.log').write_text(log)
    summary = log[log.rfind('Summary:'):]
    i_match = re.search(r'I:\s*(-?[\d.]+) LUFS', summary)
    peak_match = re.search(r'Peak:\s*(-?[\d.]+) dBFS', summary)
    lufs = float(i_match[1]) if i_match else None
    peak = float(peak_match[1]) if peak_match else None
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
    audio_lines, container_seconds = stream_identity(log)
    decode, pcm = decoded_pcm(movie)
    (out / 'ffmpeg-audio-pcm-decode.log').write_bytes(decode.stderr)
    audio_seconds = len(pcm) / SR
    expected_seconds = timing['duration']
    # MP4 AAC padding can add up to one 1024-sample AAC frame; video duration
    # can be quantized to one 30fps frame. Both are reported, not hidden.
    duration_tolerance = 1024 / SR + 1 / FPS
    with wave.open(str(mix), 'rb') as source:
        assert source.getnchannels() == 1 and source.getframerate() == SR and source.getsampwidth() == 2
        reference = np.frombuffer(source.readframes(source.getnframes()), dtype='<i2').astype(np.float32) / 32768
    waveform = compare_waveform(pcm, reference) if decode.returncode == 0 and len(pcm) > 10 * SR else None
    checks = {
        'strictAudioDecodeExitZero': loudness.returncode == 0,
        'strictPcmDecodeExitZero': decode.returncode == 0,
        'exactlyOneAacMono24kAudioStream': len(audio_lines) == 1 and 'Audio: aac ' in audio_lines[0] and '24000 Hz, mono' in audio_lines[0],
        'durationWithinCodecAndVideoQuantization': abs(audio_seconds - expected_seconds) <= duration_tolerance,
        'containerDurationWithinCodecAndVideoQuantization': container_seconds is not None and abs(container_seconds - expected_seconds) <= duration_tolerance,
        'integratedLufsMinus14WithinPoint5': lufs is not None and abs(lufs + 14) <= .5,
        'truePeakBelowZeroDbfs': peak is not None and peak < 0,
        'zeroSilenceRunsMinus35DbQuarterSecond': len(starts) == 0,
        'frozenMixHashUnchanged': sha(mix) == mix_hash_before == record['mixSha256'],
    }
    report = {
        'createdUtc': datetime.now(timezone.utc).isoformat(),
        'movie': str(movie), 'movieSha256': sha(movie),
        'mix': str(mix), 'mixSha256': mix_hash_before,
        'sourceVoiceSha256': record['sourceVoiceSha256'],
        'audioStreams': audio_lines,
        'strictDecodeExit': loudness.returncode, 'pcmDecodeExit': decode.returncode,
        'decodedPcmSampleCount': len(pcm), 'decodedPcmSha256': hashlib.sha256(decode.stdout).hexdigest(),
        'decodedAudioSeconds': audio_seconds, 'expectedSeconds': expected_seconds,
        'containerSeconds': container_seconds, 'durationToleranceSeconds': duration_tolerance,
        'integratedLUFS': lufs, 'truePeakDbfs': peak,
        'silenceStarts': starts, 'silenceEnds': ends,
        'voiceBgmDifferenceFromFrozenStemMeasurement': {'medianDb': levels['voiceBgmDifferenceMedianDb'], 'p10Db': levels['voiceBgmDifferenceP10Db'], 'scope': 'From immutable audio-v4 stems; cannot separate voice/BGM after AAC encoding.'},
        'waveformComparisonToFrozenMix': waveform,
        'command': [FF, *command],
        'checks': checks, 'pass': all(checks.values()),
        'scope': 'Final MP4 audio stream mechanical validation only. Does not replace visual video review, or ear-based full listening. No voice, subtitle, timing, mix or movie modifications.',
    }
    destination = out / 'final-mp4-audio-audit.json'
    destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'report': str(destination), 'pass': report['pass'], 'checks': checks, 'integratedLUFS': lufs, 'truePeakDbfs': peak, 'audioSeconds': audio_seconds, 'estimatedLagSamples': waveform and waveform['estimatedLagSamples']}, ensure_ascii=False, indent=2))
    if not report['pass']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
