"""Read-only supplied-input/cached-pronunciation and qx-style audio subset.

No network, synthesis, source edits, video encoding, or final-video approval.
The original readings/prosody/qx programs remain unchanged. Their API-based
CLI checks and final-MP4 checks are explicitly not claimed by this subset.
"""
import sys
sys.dont_write_bytecode = True
import hashlib
import json
import math
import re
import subprocess
import wave
from pathlib import Path

W = Path(__file__).resolve().parents[2]
CACHE = Path('/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026')
ASSETS = W / 'scripts/blender/desk_assets/d1b'
OUT = CACHE / 'qa/input-audio-local-recheck2_s3_20261026.json'
assert not OUT.exists(), 'Preserve prior result'
sys.path.insert(0, str(W / 'scripts'))
from narration_pronunciation import word_reading
from narration_fluency import VERSION, SPACING_VERSION, normalized_reading

def digest(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()

baseline_file = W / 'outputs/d1ab-gpt-20261026/qa/immutable-input-sha256-before.json'
baseline = json.loads(baseline_file.read_text())
master = W / 'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1後編_ナレーション.md'
script = W / 'docs/video-revision-20260924/ytseries/chain-d-1b.mjs'
copy_master = Path('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/D-1前編後編/技術の疑問の鎖_D-1後編_ナレーション.md')
checked = []
for r in baseline['files']:
    p = Path(r['path'])
    if p in (master, script, copy_master) or p.is_relative_to(ASSETS):
        actual = digest(p) if p.is_file() else None
        checked.append({'path': str(p), 'unchanged': actual == r['sha256'], 'sha256': actual})
assert all(any(x['path'] == str(p) for x in checked) for p in (master, script, copy_master))
copies = []
for name in ('plan.json', 'ys-chain-d1b.json', 'phrase-times.json', 'ys-chain-d1b.voice.wav'):
    copies.append({'name': name, 'source': str(ASSETS/name), 'copy': str(CACHE/name), 'byteIdentical': digest(ASSETS/name) == digest(CACHE/name), 'sha256': digest(CACHE/name)})

# Only function definitions from the existing readings checker are reused.
# Its plan loop (and therefore every HTTP query) is not executed.
readings_file = W / 'scripts/umech/check-readings.py'
reading_ns = {'__file__': str(readings_file), '__name__': 'cached_readings_functions'}
exec(compile(readings_file.read_text().split('plan = json.load', 1)[0], str(readings_file), 'exec'), reading_ns)
expected, engine, norm = (reading_ns[k] for k in ('expected', 'engine', 'norm'))
def kana_signature(kana):
    return norm(re.sub(r'[^ァ-ヴー]', '', kana))

plan = json.loads((CACHE/'plan.json').read_text())
cached = []
for clip in plan:
    for scene in clip['scenes']:
        assert len(scene['cues']) == len(scene['utterances'])
        for cue, u in zip(scene['cues'], scene['utterances']):
            spk = int(u.get('speaker') or 10001)
            spoken = word_reading(u['reading'])
            key = hashlib.sha256(f'explicit-v1|{spk}|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24]
            key = hashlib.sha256(f'{VERSION}|{key}'.encode()).hexdigest()[:24]
            key = hashlib.sha256(f'{SPACING_VERSION}|{key}'.encode()).hexdigest()[:24]
            if u.get('speed') is not None:
                key = hashlib.sha256(f'{key}|speed-{u["speed"]}'.encode()).hexdigest()[:24]
            if u.get('kana') is not None:
                key = hashlib.sha256(f'{key}|kana-{u["kana"]}'.encode()).hexdigest()[:24]
            qfile, wav = ASSETS/'speech'/f'{key}.query.json', ASSETS/'speech'/f'{key}.wav'
            r = {'cue': cue.get('diagram'), 'speaker': spk, 'query': str(qfile), 'wav': str(wav), 'exactSynthesisKeyFound': qfile.is_file() and wav.is_file()}
            if r['exactSynthesisKeyFound']:
                q = json.loads(qfile.read_text())
                want = expected(u['reading'])
                r.update(readingMetadataEqual=q.get('reading') == spoken,
                         subtitleMetadataEqual=q.get('subtitle') == u['subtitle'],
                         pronunciationMatchedMetadata=q.get('pronunciationMatched'),
                         normalizedReadingEqual=q.get('normalizedReading') == normalized_reading(spoken),
                         suppliedKanaEqualsCue=cue.get('kana') == u.get('kana'),
                         cachedPhonemesEqualFurigana=engine(q) == want,
                         suppliedKanaSoundsEqualFurigana=kana_signature(u['kana']) == want,
                         selectedProsody=q.get('selection'),
                         accentPhraseCount=len(q['accent_phrases']),
                         pauseCount=sum(bool(p.get('pause_mora')) for p in q['accent_phrases']))
                r['pass'] = all(r[k] is True for k in ('readingMetadataEqual', 'subtitleMetadataEqual', 'pronunciationMatchedMetadata', 'normalizedReadingEqual', 'suppliedKanaEqualsCue', 'cachedPhonemesEqualFurigana', 'suppliedKanaSoundsEqualFurigana'))
            else:
                r['pass'] = False
            cached.append(r)

ffmpeg = Path.home()/'Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
assert ffmpeg.is_file()
def ff(args):
    p = subprocess.run([str(ffmpeg), *args], text=True, capture_output=True)
    return {'exitCode': p.returncode, 'stdout': p.stdout, 'stderr': p.stderr}
def silences(file, noise, minimum):
    p = ff(['-v', 'info', '-i', str(file), '-af', f'silencedetect=n={noise}:d={minimum}', '-f', 'null', '-'])
    starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', p['stderr'])]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', p['stderr'])]
    return p, [(a, ends[i] if i < len(ends) else math.inf) for i, a in enumerate(starts)]

timed = json.loads((CACHE/'ys-chain-d1b.json').read_text())
voice, mix = CACHE/'ys-chain-d1b.voice.wav', CACHE/'ys-chain-d1b.wav'
voice_probe, silence = silences(voice, '-45dB', .25)
voiced, start = [], 0
for a, b in silence:
    if a > start + .02:
        voiced.append((start, a))
    start = b
if math.isfinite(start) and start < timed['duration'] - .05:
    voiced.append((start, timed['duration']))
caps = [dict(c, pause=float(s.get('utterances', [{}])[k].get('pause') or 0)) for s in timed['scenes'] for k, c in enumerate(s['captions'])]
problems, align = [], []
for i, c in enumerate(caps):
    v = [(a, b) for a, b in voiced if b > c['start']+.01 and a < c['end']-.01]
    local = []
    if not v:
        local.append('no voiced interval during caption')
    else:
        if v[0][0]-c['start'] > .35:
            local.append('voice onset exceeds0.35s')
        if v[-1][1] > c['end']+.05:
            local.append('voice passes caption end+0.05s')
        gaps = [v[k][0]-v[k-1][1] for k in range(1, len(v))]
        if max([0]+gaps) > 1.2:
            local.append('internal silence exceeds1.2s')
        if c['end']-v[-1][1] > c['pause']+1:
            local.append('tail silence exceeds pause+1s')
    align.append({'cue': i+1, 'start': c['start'], 'end': c['end'], 'problems': local})
    problems += [{'cue': i+1, 'problem': x} for x in local]
last_voice = voiced[-1][1] if voiced else 0
if last_voice > timed['duration']-.1:
    problems.append({'problem': 'voice reaches nominal ending'})
mix_probe, long_mix = silences(mix, '-40dB', 3.5)
decode = ff(['-v', 'error', '-xerror', '-i', str(mix), '-f', 'null', '-'])
with wave.open(str(mix)) as f:
    wavmeta = {'sampleRate': f.getframerate(), 'channels': f.getnchannels(), 'sampleWidth': f.getsampwidth(), 'samples': f.getnframes(), 'duration': f.getnframes()/f.getframerate()}

lint_command = ['node', '--import', './scripts/umech/desk-d1b-hooks_s3_20261026.mjs', 'scripts/umech/chain-desk-lint.mjs', str(script), 'ys-chain-d1b', str(master)]
import os
env = dict(os.environ, EM_FILM_CACHE=str(CACHE), PYTHONDONTWRITEBYTECODE='1')
lint = subprocess.run(lint_command, cwd=W, env=env, text=True, capture_output=True)
result = {
    'stage': 'S3 supplied-input/cached-query/audio-only mechanical recheck',
    'networkCallsPerformed': False, 'voiceRegenerated': False, 'earsPerformed': False,
    'originalFilesEdited': False, 'baseline': str(baseline_file),
    'immutableScope': {'filesChecked': len(checked), 'changed': [x for x in checked if not x['unchanged']], 'files': checked},
    'S3Copies': copies,
    'cachedPronunciation': {'count': len(cached), 'passCount': sum(x['pass'] for x in cached), 'checks': cached,
        'scope': 'Exact original synthesis cache key including provided kana and speaker; cached moras and supplied kana sounds match reviewed furigana. Does not independently approve pitch or naturalness.'},
    'originalApiCheckers': {'readings': 'NOT RUN: localhost engine unavailable; not started. Cached phoneme check above instead.',
        'prosody': 'NOT RUN: API engine unavailable; cached synthesis-key/kana/phoneme check above instead.',
        'prosodySpeaker': 'NOT RUN: same reason; speaker is included in exact cache key above.'},
    'masterAndCaptionLint': {'command': lint_command, 'exitCode': lint.returncode, 'stdout': lint.stdout, 'stderr': lint.stderr},
    'qxAudioSubset': {'methodSource': str(W/'scripts/umech/qx-verify.mjs'), 'methodSha256': digest(W/'scripts/umech/qx-verify.mjs'),
        'captionCount': len(caps), 'problems': problems, 'perCaption': align, 'lastVoiceEnd': last_voice,
        'voiceProbeExit': voice_probe['exitCode'], 'mixProbeExit': mix_probe['exitCode'],
        'mixSilencesOver3_5s': [[a, b if math.isfinite(b) else None] for a, b in long_mix],
        'mixDecode': decode, 'mixMetadata': wavmeta, 'timedDuration': timed['duration'],
        'lengthDifferenceSeconds': wavmeta['duration']-timed['duration']},
    'qxVerifyFull': 'NOT RUN: no actual final MP4 yet. Final video all-frame decode, duration, final mixed audio, 1Hz sheets, and visual review remain required.',
    'allMoviePass': False,
}
result['mechanicalSubsetPass'] = not result['immutableScope']['changed'] and all(x['byteIdentical'] for x in copies) and all(x['pass'] for x in cached) and lint.returncode == 0 and not problems and decode['exitCode'] == 0 and not decode['stderr'].strip() and abs(wavmeta['duration']-timed['duration']) < .01
OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open('x') as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
    f.write('\n')
print(json.dumps({'report': str(OUT), 'immutableChecked': len(checked), 'changed': len(result['immutableScope']['changed']), 'cachedQueryPass': sum(x['pass'] for x in cached), 'cachedQueryTotal': len(cached), 'lintExit': lint.returncode, 'qxAudioProblems': len(problems), 'mixSilencesOver3_5s': len(long_mix), 'mechanicalSubsetPass': result['mechanicalSubsetPass'], 'earsPerformed': False, 'qxFullPerformed': False}, ensure_ascii=False))
sys.exit(0 if result['mechanicalSubsetPass'] else 1)
