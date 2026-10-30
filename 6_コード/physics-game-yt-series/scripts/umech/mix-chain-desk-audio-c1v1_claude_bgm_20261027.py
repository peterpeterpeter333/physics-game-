"""C-1：BGM を声と重ならないように作り直した mix（Claude 2026-10-27、ユーザーの指摘「2分50秒あたりから BGM が解説とかなり被る」）。

r19（mix-chain-desk-audio-c1v1-r19.py）と同じ作り方（効果音の時刻・点の音の直しを含む）に、次の3つだけを変える。
- 声がある間の BGM の下げ幅：55％ → 90％。下げる量は、声の一番大きい所ではなく、声の小さめの所（声の大きさの下から25％）を基準にして、声がある間は必ず深く下げる。
- ずっと鳴る和音の帯（bed）も、声がある間は 75％ 下げる（これまでは下げていなかった）。声のない間は、今と同じ大きさで流す。
- solve の区間（おもりの腕〜パタパタ）：速い16分音符のマリンバ（bright=1）と1.25倍をやめ、ふつうの伴奏（bright=0）にする。
- BGM 全体の基本の大きさ：.20 → .18。
声の元ファイル・効果音・−14 LUFS の決まりは変えない。元の mix（.mixed.wav・.r13・.r19）は上書きしない。出力は <cid>.bgm27b.mixed.wav。
測った値（BGM だけを別に書き出して測る）：声がある時の声と BGM の差の中央値 r19 9.3dB → 17.9dB。声のない間の BGM は −28.1 → −29.3dB。
"""
import os, sys, json, hashlib
from pathlib import Path
import numpy as np


def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    root = Path(__file__).resolve().parent
    cache = Path(os.environ.get('EM_FILM_CACHE', '/private/tmp/ys/ys-chain-c1v1')); cid = 'ys-chain-c1v1'
    os.environ.setdefault('EM_FILM_CACHE', str(cache))
    base = root / 'mix-chain-desk-audio-c1v1.py'; source = base.read_text()
    changes = {
        # r19 と同じ直し
        "K['arm:domino'][1]['start']+j*.08": "K['arm:domino'][1]['start']+.8+j*.08",
        "tt=c['start']+a.phrase_time(q['subtitle'],q['score']['at'])": "tt=D['effects']['toll'] if q['score']['make']==1 else c['start']+a.phrase_time(q['subtitle'],q['score']['at'])",
        # BGM の直し（この版だけ）
        "a.base_music(n,sv[0],sd[0]+.3,bright=1)*1.25": "a.base_music(n,sv[0],sd[0]+.3,bright=0)",
        "music=a.duck_under_voice(music,voice,.20)": "music=duck_deep(music,voice,.18,.90)",
        "    music+=bed\n": "    music+=bed*bed_duck(voice)\n",
        # 出力の名前
        "cid+'.mixed.wav'": "cid+'.bgm27b.mixed.wav'",
        "cid+'.levels.json'": "cid+'.bgm27b.levels.json'",
        "cid+'.mix.json'": "cid+'.bgm27b.mix.json'",
    }
    for before, after in changes.items():
        assert source.count(before) == 1, before
        source = source.replace(before, after)
    for x in ['.bgm27b.mixed.wav', '.bgm27b.levels.json', '.bgm27b.mix.json']:
        assert not (cache / (cid + x)).exists(), '前の出力を上書きしない：' + x
    protected = {str(cache / (cid + x)): sha(cache / (cid + x)) for x in ['.wav', '.voice.wav', '.json'] + [y for y in ['.mixed.wav', '.r13.mixed.wav', '.r19.mixed.wav'] if (cache / (cid + y)).exists()]}
    sys.path.insert(0, str(root))
    import desk_audio_lib as a

    def vgate(voice):
        e = np.sqrt(a.moving_average(voice ** 2, int(.05 * a.SR))); e = a.moving_average(e, int(.4 * a.SR))
        ref = np.percentile(e[e > 1e-4], 25) if (e > 1e-4).any() else 1
        return np.clip(e / ref, 0, 1)

    def duck_deep(music, voice, gain=.18, depth=.90):
        return music * gain * (1 - depth * vgate(voice))

    def bed_duck(voice):
        return 1 - .75 * vgate(voice)

    ns = {'__file__': str(base), '__name__': 'c1_bgm27b', 'duck_deep': duck_deep, 'bed_duck': bed_duck}
    exec(compile(source, str(base), 'exec'), ns); ns['main'](cid)
    assert all(sha(p) == h for p, h in protected.items()), '元のファイルが変わった'
    levels = json.loads((cache / (cid + '.bgm27b.levels.json')).read_text())
    assert abs(levels['integrated_lufs'] + 14) < .3 and levels['quiet_runs_below_-35dB_0.25s'] == []
    print(json.dumps({'integrated_lufs': levels['integrated_lufs'], 'peak_dbfs': levels['peak_dbfs'], 'out': str(cache / (cid + '.bgm27b.mixed.wav'))}, ensure_ascii=False))


if __name__ == '__main__':
    main()
