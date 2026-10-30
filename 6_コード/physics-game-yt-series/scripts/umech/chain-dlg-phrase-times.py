"""（掛け合い用の写し：chain-00bx-phrase-times.py に、utterance の speaker を足したもの。元のファイルは変えていない。
 speaker の無い cue は 10001 で、元と同じ鍵・同じ結果。音声は scripts/render-dialogue-audio.py で作る。）
技術の疑問の鎖 序章2-1〜2-3（暗号の3本）の「声の窓」：各 cue の声で、どのカナを何秒に言うかを書き出す。
音声（render-em-film-audio.py）を作った後に実行する。図（yt1-chain-00bx-common.mjs の wt・ws）が読み、
計算の段・数える印を、声がその文字・数を言う時刻に合わせる。

Usage: python3 scripts/umech/chain-dlg-phrase-times.py <EM_FILM_CACHE> <clip-id>
  → <EM_FILM_CACHE>/phrase-times.json  {字幕: {kana, s（そろえたカナ）, t（各文字の始まりの秒、cue の始まりから）, end}}

時刻の求め方：speech/<key>.query.json（Nemo の accent_phrases：モーラごとの子音・母音の長さ、句の後の間）を足し、
合成と同じ speedScale（.90）で割る。cue の声は caption の始まりから 0.04 秒後に置かれる（render-em-film-audio.py）。
各 cue で、計算した長さと wav の長さの差を確かめ（音素ごとの丸めで ±0.1 秒ほどずれる）、0.12 秒を超えたら止める。
声の部分の時刻は、wav の長さに合うように少し伸び縮みさせる。
"""
import json, sys, os, hashlib, wave
from pathlib import Path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from narration_pronunciation import word_reading, speech_key
from narration_fluency import VERSION, SPACING_VERSION

SPEAKER = 10001
cache, cid = Path(sys.argv[1]), sys.argv[2]
clip = json.loads((cache / f'{cid}.json').read_text())
VOW = {'ア': 'アカサタナハマヤラワガザダバパャァ', 'イ': 'イキシチニヒミリギジヂビピィ', 'ウ': 'ウクスツヌフムユルグズヅブプュゥヴ', 'エ': 'エケセテネヘメレゲゼデベペェ', 'オ': 'オコソトノホモヨロヲゴゾドボポョォ'}
def vowel_of(c):
    for v, s in VOW.items():
        if c in s: return v
    return 'ウ'
def norm(s):
    s = ''.join(chr(ord(c) + 0x60) if 0x3041 <= ord(c) <= 0x3096 else c for c in s)
    s = s.replace("'", '').replace('_', '').replace('ヲ', 'オ').replace('ハ', 'ワ').replace('ヘ', 'エ').replace('ヅ', 'ズ').replace('ヂ', 'ジ')
    o = ''
    for c in s:
        d = vowel_of(o[-1] if o else 'ア') if c == 'ー' else c
        if d == 'ウ' and o and vowel_of(o[-1]) == 'オ': d = 'オ'
        o += d
    return o

def key_of(text, reading, speed, kana, speaker=None):
    SPEAKER_ = SPEAKER if speaker is None else int(speaker)
    spoken = word_reading(reading) if reading is not None else None
    key = hashlib.sha256(f'explicit-v1|{SPEAKER_}|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24] if reading is not None else speech_key(text, SPEAKER_)
    key = hashlib.sha256(f'{VERSION}|{key}'.encode()).hexdigest()[:24]
    key = hashlib.sha256(f'{SPACING_VERSION}|{key}'.encode()).hexdigest()[:24]
    if speed is not None: key = hashlib.sha256(f'{key}|speed-{speed}'.encode()).hexdigest()[:24]
    if kana is not None: key = hashlib.sha256(f'{key}|kana-{kana}'.encode()).hexdigest()[:24]
    return key

out = {}; worst = 0
for scene in clip['scenes']:
    for u in scene['utterances']:
        k = key_of(u['subtitle'], u.get('reading'), u.get('speed'), u.get('kana'), u.get('speaker'))
        q = json.loads((cache / 'speech' / f'{k}.query.json').read_text())
        speed = float(u.get('speed') or (.90 if u.get('kana') else 1.0))
        pre = .08 if u.get('kana') else None
        # 合成に使った query の pre/post は query.json に無いので、kana のときは .08/.10（render-em-film-audio.py と同じ）
        with wave.open(str(cache / 'speech' / f'{k}.wav')) as w: dur = w.getnframes() / w.getframerate()
        s = ''; t = []; acc = 0.0
        moras = []
        for ph in q['accent_phrases']:
            for m in ph['moras']: moras.append((m['text'], (m.get('consonant_length') or 0) + m['vowel_length']))
            if ph.get('pause_mora'): moras.append(('', ph['pause_mora']['vowel_length']))
        body = sum(x[1] for x in moras)
        if pre is None:
            # kana の無い cue：前後の無音を wav の長さから割り振る（前後を同じとみる）
            pad = max(0.0, dur - body / speed) / 2; pre_s = pad
        else:
            pre_s = pre / speed
        calc = (pre + body + .10) / speed if pre is not None else dur
        # 問いの kana（末尾の ？）は、合成で語尾の上がりが足される（query のモーラに無い）。その分だけ wav が長いので、伸び縮みはしない
        isq = (u.get('kana') or '').endswith('？')
        if isq and 0 <= dur - calc < .3: worst_q = dur - calc
        elif abs(calc - dur) > .12: raise SystemExit(f'長さが合わない {u["subtitle"]} 計算 {calc:.3f} wav {dur:.3f}')
        # 合成は音素ごとに長さを丸めるので、計算と wav が数十 ms ずれる。声の部分の長さを wav に合わせて伸び縮みさせる
        if not isq: worst = max(worst, abs(calc - dur))
        k = 1.0 if isq else (dur - (pre_s + (.10 / speed if pre is not None else pre_s))) / (body / speed) if pre is not None else 1.0
        raw = ''
        for txt, L in moras:
            for c in txt: raw += c; t.append(round(.04 + pre_s + k * acc / speed, 3))
            acc += L
        s = norm(raw)                     # 長音・オ段の後のウは前の文字で決まるので、cue 全体で そろえる（1文字 ↔ 1文字）
        assert len(s) == len(t), (raw, s)
        out[u['subtitle']] = {'kana': u.get('kana'), 's': s, 't': t, 'end': round(.04 + pre_s + k * body / speed, 3)}
(cache / 'phrase-times.json').write_text(json.dumps(out, ensure_ascii=False))
print(f'{cid}: {len(out)} cue、計算と wav の長さの差 最大 {worst*1000:.1f} ms（問いの cue を除く） → {cache}/phrase-times.json')
