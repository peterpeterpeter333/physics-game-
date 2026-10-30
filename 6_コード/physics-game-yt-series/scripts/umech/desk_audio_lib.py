"""1-1 第6版の音楽・効果音・声のダッキング・音量調整の再利用部品。"""
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


def duck_under_voice(music, voice, gain=.20):
    e=np.sqrt(moving_average(voice**2,int(.05*SR)))
    e=moving_average(e,int(.4*SR));e=e/(e.max()+1e-9)
    return music*gain*(1-.55*np.clip(e*4,0,1))

def soft_limit(x, ceil=10**(-1.5/20)):
    g=np.minimum(1.0,ceil/np.maximum(np.abs(x),1e-9))
    w=int(.004*SR);gm=np.array([g[max(0,i-w):i+w+1].min() for i in range(0,len(g),w)])
    gm=np.repeat(gm,w)[:len(x)];gm=np.minimum(gm,moving_average(gm,2*w))
    return x*gm

def normalize_lufs(mix, path, target=-14, tolerance=.3):
    gain=1.0
    for _ in range(3):
        y=soft_limit(mix*gain);write(path,y);level,peak=loudness(path)
        if abs(level-target)<tolerance:break
        gain*=10**((target-level)/20)
    return {'integrated_lufs':level,'peak_dbfs':peak,'gain':gain}

def dark_music(n, t0, t1):
    out=np.zeros(n);a=max(0,int(t0*SR));b=min(n,int(t1*SR));m=b-a
    if m<=0:return out
    t=np.arange(m)/SR
    out[a:b]=pad([hz(38),hz(50),hz(53),hz(57)],m,det=.2)*(.8+.2*np.sin(2*np.pi*t/6))*.55
    return out

def solved_music(n,t0,dur=4.5):
    out=np.zeros(n);a=int(t0*SR);m=min(n-a,int(dur*SR))
    if m<=0:return out
    x=1.4*pad([hz(48),hz(60),hz(64),hz(67),hz(72)],m)*np.exp(-np.arange(m)/SR/2.2)
    out[a:a+m]+=x*np.minimum(1,np.arange(m)/(.05*SR))
    return out

def toll_music(n,t0):
    out=np.zeros(n);add(out,.9*bell_low(),t0);return out

def after_music(n,t0,t1):return base_music(n,t0,t1)*.9
