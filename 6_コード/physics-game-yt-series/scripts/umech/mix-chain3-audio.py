"""技術の疑問の鎖 序章2-1 第3版（ys-chain-00b1v3）の音：流しっぱなしの BGM は使わず、山場だけに短い音楽を付ける。
mix-audio.py（変えていない）の音の部品（tone・sfx・moving_average・read・write）を読み込んで使う。この動画だけに使う。

- 効果音：cue の sfx（mix-audio.py と同じ名前と大きさ）。加えて cue の score（点が入る cue）には、声が「カチデス」と言う時刻に
  小さな2音（'score'）。時刻は $EM_FILM_CACHE/phrase-times.json（chain-dlg-phrase-times.py）から。
- 音楽（cue の music）：
  rise    解ける瞬間の前半（行27〜29）：A の短調の和音を弱く、0.5 秒ごとの低い鼓動。だんだん強く
  peak    行30（1文字ずつ読めていく）：和音が Am→F→C→G と進み、上へ上がる分散和音。一番強い
  resolve 行31（読めた）：C の長調の和音と鐘、ゆっくり消える
  dark    行33〜35（女王の結末）：低い持続音（D の短調）を、ごく弱く
  toll    行36（処刑）：持続音をさらに弱く、低い鐘を1回
  fade    行37：持続音が消える
  音楽は声の間は下げる（声の包絡で 6 割下げる）。
- 終わりに、音楽・効果音・声の大きさ（dBFS）を数値で書き出す（耳で聞けないので数値で確かめる）→ <id>.levels.json

Usage: EM_FILM_CACHE=/private/tmp/ys/ys-chain-00b1v3 python scripts/umech/mix-chain3-audio.py ys-chain-00b1v3
"""
import json, os, sys, hashlib, importlib.util
from pathlib import Path
import numpy as np

_spec = importlib.util.spec_from_file_location('mix_audio', str(Path(__file__).with_name('mix-audio.py')))
MA = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(MA)
SR, CACHE = MA.SR, MA.CACHE
tone, read, write, moving_average = MA.tone, MA.read, MA.write, MA.moving_average

A2, C3, D2, D3, F3, G3, A3, C4, E4, G4, A4, B3, C5, E5, G5 = 110.0, 130.81, 73.42, 146.83, 174.61, 196.0, 220.0, 261.63, 329.63, 392.0, 440.0, 246.94, 523.25, 659.25, 783.99
F2 = 87.31
def pad(freqs, n, t0=0.0, det=.3):
    t = np.arange(n) / SR + t0; o = np.zeros(n)
    for f in freqs:
        for d in (-det, det): o += np.sin(2 * np.pi * (f + d) * t)
    return o / (2 * len(freqs))
def ramp(n, a, b): return np.linspace(a, b, n) if n > 0 else np.zeros(0)
def edge(n, fi, fo):
    e = np.ones(n); i = min(n, int(fi * SR)); o = min(n, int(fo * SR))
    if i: e[:i] = np.sin(np.linspace(0, np.pi / 2, i)) ** 2
    if o: e[n - o:] = np.minimum(e[n - o:], np.cos(np.linspace(0, np.pi / 2, o)) ** 2)
    return e
def score_sfx():
    a = .5 * tone(MA.G6, .5, .14, partials=((1, 1), (2, .2))); b = .5 * tone(MA.C7, .7, .2, partials=((1, 1), (2, .2)))
    out = np.zeros(int(.9 * SR)); out[:len(a)] += a; s = int(.11 * SR); out[s:s + len(b)] += b[:len(out) - s]; return out
def bell_low(f=110.0, dur=6.0):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / d) for k, a, d in ((1, 1, 2.4), (2.76, .45, 1.2), (5.4, .2, .6), (.5, .35, 3.0)))
    return s * np.minimum(1, t / .01)

def music(cues, caps, n):
    """Return the music track (no ducking yet) and the list of segments [(name, start, end)]."""
    out = np.zeros(n); segs = []
    def span(name):
        idx = [i for i, q in enumerate(cues) if q.get('music') == name]
        return (caps[idx[0]]['start'], caps[idx[-1]]['end']) if idx else None
    # ---- 解ける瞬間 ----
    r, p, z = span('rise'), span('peak'), span('resolve')
    if r and p and z:
        a, b = int(r[0] * SR), int(r[1] * SR)
        m = b - a; x = pad((A2, A3, C4, E4), m) * ramp(m, .35, .6)
        t = np.arange(m) / SR
        beat = np.zeros(m)
        for s0 in np.arange(.25, m / SR, .5):
            k = tone(A2 / 2 * 2, .35, .09, .004, partials=((1, 1), (2, .3))); i = int(s0 * SR); beat[i:i + len(k)] += k[:max(0, m - i)]
        x += .55 * beat * ramp(m, .5, 1)
        out[a:b] += x * edge(m, 1.2, 0); segs.append(('rise', r[0], r[1]))
        # peak：和音の進行と 上がる分散和音
        a, b = int(p[0] * SR), int(p[1] * SR); m = b - a
        prog = [(A2, A3, C4, E4), (F2, F3, A3, C4), (C3, G3, C4, E4), (G3 / 2, G3, B3, 293.66)]
        L = 1.2; x = np.zeros(m)
        for ci in range(int(m / SR / L) + 1):
            i0, i1 = int(ci * L * SR), min(m, int((ci + 1) * L * SR) + int(.2 * SR))
            if i0 >= m: break
            seg = pad(prog[ci % 4], i1 - i0) * edge(i1 - i0, .08, .2); x[i0:i1] += seg
            arp = [f * 2 for f in prog[ci % 4][1:]] + [prog[ci % 4][1] * 4]
            for j, f in enumerate(arp * 2):
                s0 = int((ci * L + j * L / 8) * SR); k = .5 * tone(f, .5, .16, .004, partials=((1, 1), (2, .25)))
                if s0 < m: x[s0:s0 + len(k)] += k[:m - s0]
        out[a:b] += x * ramp(m, .65, 1.0); segs.append(('peak', p[0], p[1]))
        # resolve：C の長調と鐘
        a, b = int(z[0] * SR), min(n, int((z[1] + 1.5) * SR)); m = b - a
        x = 1.6 * pad((C3, C4, E4, G4, C5), m) * np.exp(-np.arange(m) / SR / 2.6)
        k = .7 * MA.sfx('chime'); x[:len(k)] += k[:m]
        out[a:b] += x * edge(m, .05, 1.2); segs.append(('resolve', z[0], z[1] + 1.5))
    # ---- 女王の結末 ----
    d, tl, fd = span('dark'), span('toll'), span('fade')
    if d and tl and fd:
        a, b = int(d[0] * SR), int(fd[1] * SR); m = b - a; t = np.arange(m) / SR
        x = pad((D2, D3, F3, A3 / 2 * 2), m, det=.2) * (.75 + .25 * np.sin(2 * np.pi * t / 7.0))
        lvl = np.ones(m) * .5
        i_t, i_f = int((tl[0] - d[0]) * SR), int((fd[0] - d[0]) * SR)
        lvl[i_t:] = .32; lvl = moving_average(lvl, int(1.5 * SR))
        lvl[i_f:] *= np.linspace(1, 0, m - i_f)
        out[a:b] += x * lvl * edge(m, 2.0, .3); segs.append(('dark', d[0], fd[1]))
        k = .9 * bell_low(); i = int((tl[0] + .25) * SR); out[i:i + len(k)] += k[:max(0, n - i)]
    return out, segs

def phrase_time(sub, needle):
    pt = json.loads((CACHE / 'phrase-times.json').read_text()).get(sub)
    if not pt: raise SystemExit(f'phrase-times に無い：{sub}')
    i = pt['s'].find(needle)
    if i < 0: raise SystemExit(f'「{needle}」が声に無い：{sub}')
    return pt['t'][i]

def db(x): return 20 * np.log10(max(1e-9, float(np.sqrt(np.mean(np.square(x)))))) if len(x) else -999
def pk(x): return 20 * np.log10(max(1e-9, float(np.abs(x).max()))) if len(x) else -999

def main(cid):
    plan = {c['id']: c for c in json.loads((CACHE / 'plan.json').read_text())}
    timed = json.loads((CACHE / f'{cid}.json').read_text()); wav = CACHE / f'{cid}.wav'
    voice_path = CACHE / f'{cid}.voice.wav'; marker = CACHE / f'{cid}.mix.json'
    current = hashlib.sha256(wav.read_bytes()).hexdigest()
    if not (marker.exists() and json.loads(marker.read_text())['mixSha256'] == current and voice_path.exists()):
        voice_path.write_bytes(wav.read_bytes())
    voice = read(voice_path); n = len(voice); dur = n / SR
    cues = [q for s in plan[cid]['scenes'] for q in s['cues']]; caps = [c for s in timed['scenes'] for c in s['captions']]
    assert len(cues) == len(caps)
    # 音楽（声の間は下げる）
    mus, segs = music(cues, caps, n)
    e = np.sqrt(moving_average(voice ** 2, int(.05 * SR))); e = moving_average(e, int(.4 * SR)); e = e / (e.max() + 1e-9)
    MUS_GAIN = .16
    mus = mus * MUS_GAIN * (1 - .6 * np.clip(e * 4, 0, 1))
    fx = np.zeros(n); hits = []
    for q, cap in zip(cues, caps):
        voice_end = cap['end'] - .12 - float(q.get('pause') or 0)
        items = [(nm, at) for nm, at in q.get('sfx', [])]
        if q.get('score'): items.append(('score', cap['start'] + phrase_time(q['subtitle'], 'カチデス')))
        for name, at in items:
            if name == 'score': t0 = at; x = score_sfx() * .2
            else:
                t0 = voice_end + float(at[2:]) if isinstance(at, str) and at.startswith('e+') else cap['start'] + float(at)
                x = MA.sfx(name) * MA.SFX_LEVEL.get(name, .4)
            a = int(max(0, t0) * SR); fx[a:a + len(x)] += x[:max(0, n - a)]; hits.append((name, round(t0, 2), round(pk(x), 1)))
    mix = voice + mus + fx
    peak = np.abs(mix).max()
    if peak > .98: mix *= .98 / peak
    write(wav, mix)
    marker.write_text(json.dumps({'mixSha256': hashlib.sha256(wav.read_bytes()).hexdigest(), 'voice': voice_path.name}))
    # 大きさの数値
    voiced = voice[np.abs(moving_average(voice ** 2, int(.05 * SR))) > 1e-4]
    lv = {'voice_rms_dbfs_voiced': round(db(voiced), 1), 'voice_peak_dbfs': round(pk(voice), 1), 'mix_peak_dbfs': round(pk(mix), 1),
          'music_outside_segments_peak_dbfs': None, 'segments': [], 'sfx': hits}
    inside = np.zeros(n, bool)
    for name, a, b in segs:
        i, j = int(a * SR), min(n, int(b * SR)); inside[i:j] = True
        m = mus[i:j]; v = voice[i:j]; quiet = np.abs(moving_average(v ** 2, int(.05 * SR))) < 1e-6
        lv['segments'].append({'name': name, 'start': round(a, 1), 'end': round(b, 1), 'music_rms_dbfs': round(db(m), 1), 'music_peak_dbfs': round(pk(m), 1),
                               'music_rms_in_voice_gaps_dbfs': round(db(m[quiet]), 1), 'music_rms_under_voice_dbfs': round(db(m[~quiet]), 1)})
    lv['music_outside_segments_peak_dbfs'] = round(pk(mus[~inside]), 1) if (~inside).any() else None
    (CACHE / f'{cid}.levels.json').write_text(json.dumps(lv, ensure_ascii=False, indent=1))
    print(f'mixed {cid}: {dur:.1f}s, peak {peak:.2f}'); print(json.dumps(lv, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main(sys.argv[1])
