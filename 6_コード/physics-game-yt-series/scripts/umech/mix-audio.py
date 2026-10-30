"""Add a calm ambient BGM and sound effects under the Nemo narration.

Everything is synthesized here (no third-party audio, no licensing questions).
The BGM ducks while the voice speaks and swells gently in the pauses.
Sound effects come from each cue's `sfx`: [[name, at]] where `at` is seconds from
the sentence start, or 'e+x' = x seconds after the voice of that sentence ends.

Usage: EM_FILM_CACHE=/private/tmp/X python3 scripts/umech/mix-audio.py <ids>
The voice-only track is kept as <id>.voice.wav; <id>.wav becomes the mix.
"""
import json, os, sys, wave, hashlib
from pathlib import Path
import numpy as np

SR = 24000
CACHE = Path(os.environ['EM_FILM_CACHE'])

def read(path):
    with wave.open(str(path)) as w:
        assert w.getframerate() == SR and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float32) / 32768

def write(path, x):
    y = np.clip(x, -1, 1)
    with wave.open(str(path), 'wb') as w:
        w.setparams((1, 2, SR, 0, 'NONE', 'not compressed')); w.writeframes((y * 32767).astype('<i2').tobytes())

def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)

def tone(freq, dur, decay, attack=.004, partials=((1, 1),)):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * k * t) for k, a in partials)
    return s * env(n, attack, decay)

rng = np.random.default_rng(7)
def lowpassed_noise(dur, cutoff_from, cutoff_to):
    n = int(dur * SR); noise = rng.standard_normal(n); out = np.zeros(n); y = 0.0
    cut = np.linspace(cutoff_from, cutoff_to, n); a = 1 - np.exp(-2 * np.pi * cut / SR)
    for i in range(n): y += a[i] * (noise[i] - y); out[i] = y
    return out / (np.abs(out).max() + 1e-9)

C6, E6, G6, C7 = 1046.5, 1318.5, 1568.0, 2093.0
def sfx(name):
    if name == 'pop':    # soft bubble for a new item
        n = int(.12 * SR); t = np.arange(n) / SR; f = 520 + 900 * t / .12
        return .35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, .035)
    if name == 'tick':   # countdown
        return .30 * tone(1900, .06, .012, .001)
    if name == 'ding':   # correct answer / key result
        a = tone(C6, 1.4, .45, partials=((1, 1), (2.01, .25), (3.0, .08))); b = np.zeros_like(a)
        g = .8 * tone(G6, 1.2, .4, partials=((1, 1), (2, .2))); s = int(.09 * SR); b[s:s + len(g)] = g[:len(b) - s]
        return .32 * (a + b)
    if name == 'chime':  # closing card: C E G C arpeggio
        out = np.zeros(int(2.2 * SR))
        for i, f in enumerate((C6, E6, G6, C7)):
            x = .22 * tone(f, 1.6, .55, partials=((1, 1), (2.01, .2))); s = int(i * .13 * SR); out[s:s + len(x)] += x[:len(out) - s]
        return out
    if name == 'whoosh': # scene change
        x = lowpassed_noise(.55, 300, 3200); n = len(x); t = np.arange(n) / n
        return .22 * x * np.sin(np.pi * t) ** 2
    if name == 'thump':  # parachute opening
        n = int(.5 * SR); t = np.arange(n) / SR
        return .45 * np.sin(2 * np.pi * (70 + 40 * np.exp(-t / .05)) * t) * env(n, .005, .12) + .12 * lowpassed_noise(.5, 1800, 200) * env(n, .002, .08)
    raise ValueError(name)

SFX_LEVEL = {'whoosh': .8, 'tick': .6, 'pop': .5, 'ding': .4, 'chime': .4, 'thump': .4}

def moving_average(x, w):
    # O(n) centred moving average (np.convolve is O(n*w), too slow for long films).
    c = np.cumsum(np.concatenate([[0.0], x])); h = w // 2
    i = np.arange(len(x)); lo = np.clip(i - h, 0, len(x)); hi = np.clip(i + h + 1, 0, len(x))
    return (c[hi] - c[lo]) / np.maximum(1, hi - lo)

def bgm(dur, voice):
    """Ambient pad: slow chord changes, detuned sines, sparse bell notes; ducks under speech."""
    n = len(voice); t = np.arange(n) / SR; out = np.zeros(n)
    chords = [(130.81, 164.81, 196.0, 246.94, 293.66), (110.0, 130.81, 164.81, 196.0, 246.94),
              (87.31, 110.0, 130.81, 164.81, 196.0), (98.0, 123.47, 146.83, 196.0, 220.0)]
    L = 8.0
    for i in range(int(dur // L) + 2):
        start = i * L - 2; freqs = chords[i % 4]
        a, b = max(0, int(start * SR)), min(n, int((start + L + 2) * SR))   # only where this chord sounds
        if a >= b: continue
        ts = t[a:b]
        w = np.clip((ts - start) / 2, 0, 1) * np.clip((start + L + 2 - ts) / 2, 0, 1)   # 2 s crossfades
        w = np.sin(w * np.pi / 2) ** 2
        for f in freqs:
            for d in (-.35, .35):
                out[a:b] += w * np.sin(2 * np.pi * (f + d) * ts + i) / (len(freqs) * 2)
    out *= .55 + .45 * np.sin(2 * np.pi * t / 11.0)                                   # slow breathing
    for k, f in enumerate([523.25, 659.25, 783.99, 659.25, 587.33, 783.99]):          # sparse bell notes
        for s0 in np.arange(3 + k * 2.3, dur, 13.8):
            x = .18 * tone(f, 2.5, .9, .01, partials=((1, 1), (2, .15))); a = int(s0 * SR); out[a:a + len(x)] += x[:max(0, n - a)]
    # Duck under the voice (50 ms envelope, smoothed).
    e = np.sqrt(moving_average(voice[:n] ** 2, int(.05 * SR)))
    e = moving_average(e, int(.4 * SR)); e = e / (e.max() + 1e-9)
    gain = .18 * (1 - .82 * np.clip(e * 4, 0, 1))
    fade = np.clip(t / 2.5, 0, 1) * np.clip((dur - t) / 3.0, 0, 1)
    return out * gain * fade

def main(ids):
    plan = {c['id']: c for c in json.loads((CACHE / 'plan.json').read_text())}
    for cid in ids:
        timed = json.loads((CACHE / f'{cid}.json').read_text()); wav = CACHE / f'{cid}.wav'
        voice_path = CACHE / f'{cid}.voice.wav'; marker = CACHE / f'{cid}.mix.json'
        current = hashlib.sha256(wav.read_bytes()).hexdigest()
        if not (marker.exists() and json.loads(marker.read_text())['mixSha256'] == current and voice_path.exists()):
            voice_path.write_bytes(wav.read_bytes())       # a freshly synthesized voice track
        voice = read(voice_path); n = len(voice); dur = n / SR
        mix = voice.copy() + bgm(dur, voice)
        cues = [q for s in plan[cid]['scenes'] for q in s['cues']]; caps = [c for s in timed['scenes'] for c in s['captions']]
        assert len(cues) == len(caps)
        for q, cap in zip(cues, caps):
            voice_end = cap['end'] - .12 - float(q.get('pause') or 0)
            for name, at in q.get('sfx', []):
                t0 = voice_end + float(at[2:]) if isinstance(at, str) and at.startswith('e+') else cap['start'] + float(at)
                # Effects sit well under the voice (about 8 dB below speech level).
                x = sfx(name) * SFX_LEVEL.get(name, .4); a = int(max(0, t0) * SR); mix[a:a + len(x)] += x[:max(0, n - a)]
        peak = np.abs(mix).max()
        if peak > .98: mix *= .98 / peak
        write(wav, mix)
        marker.write_text(json.dumps({'mixSha256': hashlib.sha256(wav.read_bytes()).hexdigest(), 'voice': voice_path.name}))
        print(f'mixed {cid}: {dur:.1f}s, peak {peak:.2f}')

if __name__ == '__main__':
    main(sys.argv[1:])
