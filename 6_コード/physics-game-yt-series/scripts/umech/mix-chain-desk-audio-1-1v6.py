"""技術の疑問の鎖 1-1 第6版（ys-chain-1-1v6）の音。第5版の mix-chain-desk-audio-1-1v5.py（変えていない）の写しで、音楽・効果音・大きさ・時刻の決め方は同じ。
第6版で変えたこと：
  - 行40 を 40a〜40k に差し替えた：音楽 solve は 40k（鍵 rows:fill）だけ（第5版の行40 と同じ長さ・同じ音楽）。40a〜40j は base のまま。
    40f3「QはAです」・40h「TELLだ」・40j「WILLです」の後に、小さな ding（cue の sfx）。
  - 行43 を 43a〜43c に差し替えた：dark は 43a から（第5版の行43 と同じ）。
Usage: EM_FILM_CACHE=/private/tmp/ys/ys-chain-1-1v6 python scripts/umech/mix-chain-desk-audio-1-1v6.py ys-chain-1-1v6
以下は第5版の説明：
技術の疑問の鎖 1-1 第5版（ys-chain-1-1v5）の音。第4版の mix-chain-desk-audio.py（変えていない）の写しで、音楽・効果音・大きさは同じ。
第5版で変えたのは、物の動きに合わせた小さな効果音の時刻だけ（desk_1_1v5.py と同じ時刻）：
  指が外の輪を1目盛り進む（行6・7・10）、内の円板を3目盛り回す（行11）、ひと回り（行13）、1つ・2つ・3つ（行14）、サイコロが着く（行34）。
以下は第4版の説明：
技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）の音：声の下に、音楽を途切れず流す（無音を作らない）。全体を −14 LUFS 前後にそろえる。
mix-audio.py・mix-chain3-audio.py（どちらも変えていない）の部品（tone・sfx・moving_average・read・write）を読み込んで使う。この動画だけに使う。

- 音楽（0 秒から最後まで続く。声の間は下げる）
  base    いつもの音楽：マリンバのような分散和音（C→Am→F→G、1小節 2.4 秒）、低い弦の音、弱い和音の持続音
  solve   解ける瞬間（cue の music 'solve'＝行22）：同じ進行で、高い分散和音が加わり、上へ上がる。いちばん強い
  solved  行23：C の長調の和音と鐘 → すぐ base に戻る
  dark    結末（'dark'＝行24〜26）：D の短調の持続音と、遅い低い鼓動（base は止める）
  toll    行27（処刑）：持続音を弱く、低い鐘を1回
  after   行28：持続音が少しずつ base へ戻る（行29 から base）
- 効果音：cue の sfx（mix-audio.py と同じ名前）。点が入る時（cue の score.at を声が言う時刻）に小さな2音。円板が1目盛り回る時に小さな「カチ」
  （行5 の3目盛り、行9 の 1つ・2つ・3つ）。行9 の猛スピードの回転に「ヒュルル」（雑音を回す音）。
- 最後に、全体の大きさを測って（ffmpeg ebur128）−14 LUFS にそろえ、ピークを −1.5 dBFS 以下に抑える（やわらかい制限）。
- 数値（LUFS、ピーク、−35 dB 以下が 0.25 秒以上続く所の数）を <id>.levels.json に書く。耳では聞いていない。
Usage: EM_FILM_CACHE=/private/tmp/ys/ys-chain-1-1v5 python scripts/umech/mix-chain-desk-audio-1-1v5.py ys-chain-1-1v5
"""
import json, os, sys, hashlib, importlib.util, subprocess, re
from pathlib import Path
import numpy as np

_spec = importlib.util.spec_from_file_location('mix_audio', str(Path(__file__).with_name('mix-audio.py')))
MA = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(MA)
SR, CACHE = MA.SR, MA.CACHE
tone, read, write, moving_average = MA.tone, MA.read, MA.write, MA.moving_average
FF = os.environ.get('FFMPEG', os.path.expanduser('~/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'))

def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
# 和音（MIDI）：C、Am、F、G
PROG = [(48, [60, 64, 67, 72]), (45, [57, 60, 64, 69]), (41, [53, 57, 60, 65]), (43, [55, 59, 62, 67])]
BAR = 2.4
def marimba(f, dur=.5, amp=.5):
    return amp * tone(f, dur, .16, .003, partials=((1, 1), (4.0, .18), (10.0, .04)))
def pluck_bass(f, dur=1.0, amp=.6):
    return amp * tone(f, dur, .35, .006, partials=((1, 1), (2, .35), (3, .12)))
def pad(freqs, n, t0=0.0, det=.25):
    t = np.arange(n) / SR + t0; o = np.zeros(n)
    for f in freqs:
        for d in (-det, det): o += np.sin(2 * np.pi * (f + d) * t)
    return o / (2 * len(freqs))
def add(out, x, t):
    a = int(t * SR)
    if a >= len(out) or a + len(x) <= 0: return
    if a < 0: x = x[-a:]; a = 0
    out[a:a + len(x)] += x[:len(out) - a]
def env_ramp(n, segs):
    """segs：[(秒, 大きさ)…] を直線でつないだ包絡"""
    t = np.arange(n) / SR; ts = [s for s, _ in segs]; vs = [v for _, v in segs]
    return np.interp(t, ts, vs)

def base_music(n, t0, t1, bright=0.0):
    """t0〜t1 秒の base（bright＞0 で高い分散和音を足す＝solve）"""
    out = np.zeros(n)
    k0 = int(np.floor(t0 / BAR)); k1 = int(np.ceil(t1 / BAR))
    for k in range(k0, k1 + 1):
        b = k * BAR; root, ch = PROG[k % 4]
        add(out, pluck_bass(hz(root - 12), 1.1, .55), b); add(out, pluck_bass(hz(root - 12), 1.0, .4), b + BAR / 2)
        pat = [0, 1, 2, 3, 2, 1, 2, 3]
        for j, p in enumerate(pat):
            add(out, marimba(hz(ch[p]), .45, .34 if j % 2 == 0 else .26), b + j * BAR / 8)
        if bright > 0:
            for j in range(16):
                add(out, marimba(hz(ch[j % 4] + 12 + (12 if j >= 8 else 0)), .3, .22 * bright), b + j * BAR / 16)
        m = int(BAR * SR) + int(.3 * SR); a = int(b * SR)
        if a < n:
            x = pad([hz(x) for x in ch[:3]], min(m, n - a)) * (.10 + .10 * bright)
            e = np.minimum(1, np.minimum(np.arange(len(x)) / (.25 * SR), (len(x) - np.arange(len(x))) / (.3 * SR)))
            out[a:a + len(x)] += x * e
    w = np.zeros(n); i0, i1 = max(0, int(t0 * SR)), min(n, int(t1 * SR)); w[i0:i1] = 1
    return out * moving_average(w, int(.6 * SR))

def bell_low(f=110.0, dur=6.0):
    m = int(dur * SR); t = np.arange(m) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t / d) for k, a, d in ((1, 1, 2.4), (2.76, .45, 1.2), (5.4, .2, .6), (.5, .35, 3.0)))
    return s * np.minimum(1, t / .01)
def score_sfx():
    a = .5 * tone(MA.G6, .5, .14, partials=((1, 1), (2, .2))); b = .5 * tone(MA.C7, .7, .2, partials=((1, 1), (2, .2)))
    out = np.zeros(int(.9 * SR)); out[:len(a)] += a; s = int(.11 * SR); out[s:s + len(b)] += b[:len(out) - s]; return out
def click():
    return .5 * tone(2600, .06, .008, .0005) + .3 * tone(900, .06, .012, .0008)
def whirr(dur):
    x = MA.lowpassed_noise(dur, 800, 3500); m = len(x); t = np.arange(m) / SR
    return .35 * x * (.6 + .4 * np.sin(2 * np.pi * 14 * t)) * np.sin(np.pi * t / dur) ** .5

def phrase_time(sub, needle, occ=0):
    pt = json.loads((CACHE / 'phrase-times.json').read_text()).get(sub)
    if not pt: raise SystemExit(f'phrase-times に無い：{sub}')
    VOW = {'ア': 'アカサタナハマヤラワガザダバパャァ', 'イ': 'イキシチニヒミリギジヂビピィ', 'ウ': 'ウクスツヌフムユルグズヅブプュゥヴ', 'エ': 'エケセテネヘメレゲゼデベペェ', 'オ': 'オコソトノホモヨロヲゴゾドボポョォ'}
    pat = re.compile(re.sub('[ウオ]', '[ウオ]', needle))
    pos = 0
    for _ in range(occ + 1):
        r = pat.search(pt['s'], pos)
        if not r: raise SystemExit(f'「{needle}」が声に無い：{sub}')
        pos = r.start() + 1
    return pt['t'][r.start()]

def loudness(path):
    r = subprocess.run([FF, '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]); pk = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)
    return I, (float(pk[-1]) if pk else None)
def quiet_runs(x, thr_db=-35, min_s=.25):
    e = np.sqrt(moving_average(x ** 2, int(.05 * SR))); q = e < 10 ** (thr_db / 20)
    runs = []; i = 0; n = len(q)
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]: j += 1
            if (j - i) / SR >= min_s: runs.append((round(i / SR, 2), round(j / SR, 2)))
            i = j
        else: i += 1
    return runs

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
    K = {q['diagram'].split('-', 1)[1]: (q, c) for q, c in zip(cues, caps)}
    def span(name):
        idx = [i for i, q in enumerate(cues) if q.get('music') == name]
        return (caps[idx[0]]['start'], caps[idx[-1]]['end']) if idx else None
    sv, sd = span('solve'), span('solved'); dk, tl, af = span('dark'), span('toll'), span('after')
    assert sv and sd and dk and tl and af
    # ---- 音楽 ----
    mus = np.zeros(n)
    mus += base_music(n, 0, sv[0])
    mus += base_music(n, sv[0], sd[0] + .3, bright=1.0) * 1.25
    # solved：C の長調と鐘
    a = int(sd[0] * SR); m = min(n - a, int(4.5 * SR)); x = 1.4 * pad([hz(48), hz(60), hz(64), hz(67), hz(72)], m) * np.exp(-np.arange(m) / SR / 2.2)
    x[:len(MA.sfx('chime'))] += .8 * MA.sfx('chime')[:m]; mus[a:a + m] += x * np.minimum(1, np.arange(m) / (.05 * SR))
    mus += base_music(n, sd[0] + 1.6, dk[0] + .2) * .9
    # dark → toll → after
    a, b = int(dk[0] * SR), int(af[1] * SR); m = b - a; t = np.arange(m) / SR
    D = pad([hz(38), hz(50), hz(53), hz(57)], m, det=.2) * (.8 + .2 * np.sin(2 * np.pi * t / 6.0))
    for s0 in np.arange(0, m / SR, 1.2): add(D, .5 * tone(hz(38), .9, .3, .01, partials=((1, 1), (2, .3))), s0)
    lvl = env_ramp(m, [(0, 0), (.8, .55), (tl[0] - dk[0], .55), (tl[0] - dk[0] + 1.0, .32), (af[0] - dk[0], .32), (m / SR, .25)])
    mus[a:b] += D * lvl
    add(mus, .9 * bell_low(), tl[1] - float(K['end:exec'][0].get('pause') or 0) - .12 + .15)
    mus += base_music(n, af[1] - 1.5, dur + 1) * env_ramp(n, [(0, 1), (dur - 1.0, 1), (dur, .0)])
    # 声の間は下げる
    e = np.sqrt(moving_average(voice ** 2, int(.05 * SR))); e = moving_average(e, int(.4 * SR)); e = e / (e.max() + 1e-9)
    MUS_GAIN = .20
    mus = mus * MUS_GAIN * (1 - .55 * np.clip(e * 4, 0, 1))
    # ---- 効果音 ----
    fx = np.zeros(n); hits = []
    def hit(name, t0, x): add(fx, x, t0); hits.append((name, round(t0, 2)))
    for q, cap in zip(cues, caps):
        voice_end = cap['end'] - .12 - float(q.get('pause') or 0)
        for name, at in q.get('sfx', []):
            t0 = voice_end + float(at[2:]) if isinstance(at, str) and at.startswith('e+') else cap['start'] + float(at)
            hit(name, t0, MA.sfx(name) * MA.SFX_LEVEL.get(name, .4))
        if q.get('score'): hit('score', cap['start'] + phrase_time(q['subtitle'], q['score']['at']), score_sfx() * .22)
    # 円板のカチ（desk_1_1v5.py と同じ時刻）
    def at(key, needle, occ=0, end=False):
        q, cap = K[key]; pt = json.loads((CACHE / 'phrase-times.json').read_text())[q['subtitle']]
        if end:
            pat = re.compile(re.sub('[ウオ]', '[ウオ]', needle)); r = pat.search(pt['s']); j = r.end()
            return cap['start'] + (pt['t'][j] if j < len(pt['t']) else pt['end'])
        return cap['start'] + phrase_time(q['subtitle'], needle, occ)
    for key, nds in (('disk:ad', ['エエカラ', 'ビイ', 'スィイ', 'ディイト']), ('disk:be', ['ビイナラ', 'スィイ', 'ディイ', 'イイデ']), ('ring:zc', ['ゼット', 'エエ', 'ビイ', 'スィイデ'])):
        q, cap = K[key]; pos = 0; pt = json.loads((CACHE / 'phrase-times.json').read_text())[q['subtitle']]
        for i, nd in enumerate(nds):
            r = re.compile(re.sub('[ウオ]', '[ウオ]', nd)).search(pt['s'], pos); pos = r.end()
            if i: hit('tap', cap['start'] + pt['t'][r.start()], click() * .12)
    a = at('disk:turn', 'サンメモリ'); b = at('disk:turn', 'オクト', end=True)
    for k in range(3): hit('click', a + (b - a) * k / 3 + .2, click() * .18)
    a = at('disk:25', 'ニジュウロクメモリ'); b = at('disk:25', 'モドッテ', end=True)
    for k in range(26):
        u = k / 26; hit('click', a + (b - a) * (3 * u * u - 2 * u ** 3), click() * .08)
    # サイコロが着く（desk_1_1v5.py の dice_times と同じ）
    a = at('dice:roll', 'サイコロオ'); b = at('dice:roll', 'カタヨリガ') + .2; d = .62
    for k in range(5): hit('dice', a + (b - a - d) * k / 4 + d - .02, .5 * tone(220, .12, .03, .002, partials=((1, 1), (2.7, .4))) * .3)
    q, cap = K['disk:three']
    for nd in ('ヒトツ', 'フタツ', 'ミッツ'): hit('click', cap['start'] + phrase_time(q['subtitle'], nd) + .1, click() * .2)
    q, cap = K['disk:spin']; a = cap['start'] + .45; b = cap['end'] + .25; hit('whirr', a, whirr(b - a) * .5)
    mix = voice + mus + fx
    # ---- −14 LUFS にそろえる（2回まで測り直す）と、やわらかい制限 ----
    tmp = CACHE / f'{cid}.mixtmp.wav'
    def limit(x, ceil=10 ** (-1.5 / 20)):
        g = np.minimum(1.0, ceil / np.maximum(np.abs(x), 1e-9))
        w = int(.004 * SR); gm = np.array([g[max(0, i - w):i + w + 1].min() for i in range(0, len(g), w)])
        gm = np.repeat(gm, w)[:len(x)]; gm = np.minimum(gm, moving_average(gm, 2 * w))
        return x * gm
    gain = 1.0
    for it in range(3):
        y = limit(mix * gain); write(tmp, y); I, pk = loudness(tmp)
        if abs(I + 14) < .3: break
        gain *= 10 ** ((-14 - I) / 20)
    mix = y; os.replace(tmp, wav)
    marker.write_text(json.dumps({'mixSha256': hashlib.sha256(wav.read_bytes()).hexdigest(), 'voice': voice_path.name}))
    I, pk = loudness(wav)
    runs = quiet_runs(mix)
    lv = {'integrated_lufs': I, 'peak_dbfs': pk, 'gain': round(gain, 3), 'quiet_runs_below_-35dB_0.25s': runs,
          'music_spans': {'solve': sv, 'solved': sd, 'dark': dk, 'toll': tl, 'after': af}, 'sfx': hits}
    (CACHE / f'{cid}.levels.json').write_text(json.dumps(lv, ensure_ascii=False, indent=1))
    print(f'mixed {cid}: {dur:.1f}s, {I} LUFS, peak {pk} dBFS, 無音(−35dB, 0.25s 以上) {len(runs)} 回 {runs[:5]}')

if __name__ == '__main__':
    main(sys.argv[1])
