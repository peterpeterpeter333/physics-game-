"""D-1 後編（ys-chain-d1b）の音楽と効果音（Claude 2026-10-26）。mix-chain-desk-audio-d1v1.py を写して、キーを後編に合わせた。
声は scripts/blender/desk_assets/d1b/ys-chain-d1b.wav をそのまま使う（再生成も再圧縮もしない）。
音楽：solve＝行13〜19（run:steam〜run:back）、solved＝行36（run:repeat）、dark＝next:waste、toll＝next:100（鐘は声の後）、after＝next:who。
効果音：台本の sfx（whoosh・chime）、弁のカチ、蒸気のシュー、水の流れ、レバーのパタン、機械の音、得点の音。時刻は cue キーと声の語（data.json）。
"""
import os, json, hashlib, shutil, subprocess, math
from pathlib import Path
import numpy as np
import desk_audio_lib as a
CID = 'ys-chain-d1b'; CACHE = a.CACHE
assert str(CACHE) == '/private/tmp/ys/ys-chain-d1b_gpt_20261026', 'Only isolated GPT cache is writable'
assert not (CACHE / f'{CID}.wav').is_symlink(), 'Never overwrite supplied sound'
assert not (CACHE / f'{CID}.wav').exists(), 'Preserve existing mix; use a new revision cache'
DATA = json.loads((CACHE / 'blender/data.json').read_text()); K = {c['key']: c for c in DATA['cues']}
SOURCE = Path(__file__).resolve().parents[1] / 'blender/desk_assets/d1b'
source = SOURCE / f'{CID}.wav'; voicepath = CACHE / f'{CID}.voice.wav'
if not voicepath.exists(): shutil.copy2(source, voicepath)
assert hashlib.sha256(voicepath.read_bytes()).digest() == hashlib.sha256(source.read_bytes()).digest()
voice = a.read(voicepath); n = len(voice); duration = n / a.SR
plan = json.loads((CACHE / 'plan.json').read_text())[0]; qs = {q['diagram'].replace('cd1b-', ''): q for s in plan['scenes'] for q in s['cues']}
def W(key, label):
    found = [x['time'] for x in K[key]['wordEvents'] if x['word'] == label]; assert len(found) == 1, (key, label); return found[0]
def S(k): return K[k]['start']
def E(k): return K[k]['end']

def make():
    sv = (S('run:steam'), E('run:back')); sd = (S('run:repeat'), E('run:repeat')); dk = (S('next:waste'), E('next:waste')); tl = (S('next:100'), E('next:100')); af = (S('next:who'), E('next:who'))
    music = a.base_music(n, 0, sv[0]); music += 1.25 * a.base_music(n, sv[0], sd[0] + .3, bright=1)
    music += a.solved_music(n, sd[0]); music += .9 * a.base_music(n, sd[0] + 1.6, dk[0] + .2)
    dark = a.dark_music(n, dk[0], af[1]); dark *= a.env_ramp(n, [(0, 0), (dk[0], 0), (dk[0] + .8, 1), (tl[0], 1), (tl[0] + 1, .65), (af[0], .65), (af[1], .45), (duration, .45)])
    music += dark; voice_end = tl[1] - .12 - float(qs['next:100'].get('pause', 0)); music += .28 * a.toll_music(n, voice_end + .15)
    music += a.base_music(n, af[1] - 1.5, duration + .1) * a.env_ramp(n, [(0, 1), (duration - 1, 1), (duration, .35)])
    music += .035 * a.pad([a.hz(48), a.hz(55), a.hz(60)], n)
    music = a.duck_under_voice(music, voice, gain=.20); fx = np.zeros(n); hits = []
    def hit(name, t, x):
        if 0 <= t < duration: a.add(fx, x, t); hits.append({'name': name, 'time': round(float(t), 4)})
    for key, c in K.items():
        for name, when in qs[key].get('sfx', []) or []:
            ve = c['end'] - .12 - float(qs[key].get('pause', 0)); t = ve + float(when[2:]) if isinstance(when, str) and when.startswith('e+') else c['start'] + float(when)
            hit(name, t, a.MA.sfx(name) * a.MA.SFX_LEVEL.get(name, .4) * .5)
    click = lambda: .09 * a.click()
    hiss = lambda d=.8: .035 * a.MA.lowpassed_noise(d, 1500, 6000)
    water = lambda d=.7: .035 * a.MA.lowpassed_noise(d, 500, 3200)
    thunk = lambda: .05 * a.tone(230, .5, .2, .05, partials=((1, 1), (3, .15)))
    def clack():
        x = .10 * a.tone(140, .25, .06, .001, partials=((1, 1), (2.6, .4))); c = .06 * a.click(); x[:len(c)] += c[:len(x)]; return x
    # 炭鉱の水の滴（行1）
    for t in np.arange(S('open:machine') + 1.3, E('open:machine'), 2.3): hit('water_drop', t, .055 * a.tone(760, .16, .06, .001, partials=((1, 1), (1.7, .3))))
    # 機械がゆっくり動く所（行1・6）：周期 68.19/11 秒
    per = S('boiler:fire') / 11
    for t in np.arange(per * .42, S('boiler:fire'), per): hit('mechanism', t, .8 * thunk())
    # 行7：火と沸く
    hit('fire', W('boiler:fire', '石炭を燃やして'), .03 * a.MA.lowpassed_noise(1.2, 200, 1200))
    hit('boiling', W('boiler:fire', 'わかします'), .05 * a.MA.lowpassed_noise(1.4, 400, 2200))
    hit('steam_hiss', W('boiler:steam', '蒸気になって'), hiss(1.2))
    # 行8：蛇口と弁
    for t in [W('valve:tap', '開けたり'), W('valve:tap', '開けたり') + .55, W('valve:tap', '水道の蛇口'), W('valve:tap', '水道の蛇口') + 1.8]: hit('valve_click', t, click())
    hit('tap_water', W('valve:tap', '水道の蛇口') + .2, water(1.6))
    # 行9：ピストンが上下
    hit('piston', W('cyl:open', '上下に動くふた'), .6 * thunk())
    # 行13〜19
    o_s = W('run:steam', '蒸気の弁を開けて') + .3
    hit('valve_click', o_s, click()); hit('steam_hiss', o_s + .2, hiss(2.0))
    hit('mechanism', W('run:up', '下がり'), thunk()); hit('valve_click', W('run:shut', '閉じます'), click())
    hit('valve_click', W('run:spray', '開けます'), click()); hit('cold_water', W('run:spray', '細い管'), water(1.4))
    hit('cold_spray', W('run:spray', '噴き出します'), .055 * a.MA.lowpassed_noise(.9, 600, 5000))
    hit('condense', W('run:empty', '水に戻って'), .03 * a.MA.lowpassed_noise(1.0, 300, 1200))
    hit('mechanism', W('run:down', '押し下げます'), thunk()); hit('pump_water', W('run:down', '引き上げられます'), water(.8))
    hit('valve_click', W('run:back', '冷水の弁を閉じて'), click()); hit('valve_click', W('run:back', '蒸気の弁を開ければ'), click()); hit('steam_hiss', W('run:back', '蒸気の弁を開ければ') + .2, hiss(1.0))
    # 行23〜30：ポンプの中
    hit('door_click', W('pump:opens', '開き'), click()); hit('door_click', W('pump:opens', '閉じます'), click())
    hit('flap', W('pump:down', '開きます'), .7 * click()); hit('water', W('pump:down', '通り抜けて'), water(1.2))
    hit('flap', W('pump:up', '閉じます'), .7 * click()); hit('water', W('pump:up', '持ち上げます'), water(1.0))
    hit('flap', W('pump:refill', '底の弁が開き'), .7 * click()); hit('water', W('pump:refill', '新しい水'), water(1.4))
    a0 = W('pump:repeat', 'くり返す'); pr = (W('pump:repeat', 'あふれ出ます') - a0) / 2
    for i in range(2): hit('mechanism', a0 + pr * (i + .42), .7 * thunk()); hit('water', a0 + pr * (i + .7), water(.6))
    hit('overflow', W('pump:repeat', 'あふれ出ます'), water(1.6))
    hit('water', W('pump:novalve', 'すき間から下へ'), water(1.0))
    # 行32・33：排水
    hit('steam_hiss', W('drain:steam', '次に蒸気が入る'), hiss(1.4)); hit('valve_click', W('drain:steam', '次に蒸気が入る'), click())
    hit('flap', W('drain:out', '弁を押し開けて'), click()); hit('drain_water', W('drain:out', '下り坂の管'), water(2.0))
    # 機械がくり返す所：行35・36（周期 4）、行42（3.6）、行44〜46（2）、行48（6）
    for t0, t1, p, ph0 in [(S('tank:self'), E('run:repeat'), 4.0, .56), (S('lever:auto'), E('lever:auto'), 3.6, .40), (S('next:mio2'), E('next:who'), 2.0, .40), (S('last:valve'), duration - .5, 6.0, .56)]:
        k0 = math.ceil(ph0 - .42); t = t0 + (k0 + .42 - ph0) * p
        while t < t1:
            if t >= t0: hit('mechanism', t, .8 * thunk()); hit('pump_water', t + .5 * p, .8 * water(.6))
            t += p
        if t1 == E('lever:auto') or t0 == S('last:valve'):
            t = t0 + (math.ceil(ph0 - .44) + .44 - ph0) * p
            while t < t1:
                if t >= t0: hit('lever_clack', t, .7 * clack()); hit('lever_clack', t + .49 * p, .7 * clack())
                t += p
    # 行38：人が手で開け閉め（だんだん速く）
    t0 = S('lever:hand') + .3; t1 = E('lever:hand'); p0, p1 = 4.6, 2.6
    ph = 0.0; t = t0; dt = 1 / 120; marks = [.42, .47, .90, .95]; last = .2
    while t < t1:
        u = (t - t0) / (t1 - t0); ph_new = ph + dt / (p0 + (p1 - p0) * u)
        for m in marks:
            for base in [math.floor(.2 + ph), math.floor(.2 + ph_new)]:
                x = base + m
                if .2 + ph < x <= .2 + ph_new: hit('valve_click', t, click())
        ph = ph_new; t += dt
    # 行39：レバーのパタン
    hit('lever_clack', W('lever:flip', '倒れる（1回目）') + .2, clack()); hit('lever_clack', W('lever:flip', '反対へ倒れる') + .2, clack())
    hit('lever_clack', W('lever:tappet', 'レバーを下から押し') + .28, clack()); hit('lever_clack', W('lever:tappet', 'レバーを上から押します') + .28, clack())
    hit('lever_clack', W('lever:fall', 'パタンと') + .35, clack())
    # 行45：石炭が減る（小さく）
    for i, t in enumerate(np.arange(W('next:waste', '石炭の熱'), S('next:who'), 1.3)): hit('coal', t, .025 * a.tone(320 + 40 * (i % 3), .12, .04, .001, partials=((1, 1), (2.3, .3))))
    # 行47：壊れた弁がぶらぶら
    for t in np.arange(W('ch:drain', '開く'), E('ch:answer'), 1.2): hit('creak', t, .03 * a.tone(520, .2, .08, .01, partials=((1, 1), (1.5, .4))))
    # 得点の音
    for key, label, low in [('score:still', '水 1−0 人（得点板）', True), ('run:repeat', 'くり返し（得点板 水 1−1 人）', False), ('next:spread', 'くみ出せる（得点板 水 1−2 人・カイ得意顔）', False)]:
        hit('score_low' if low else 'score', W(key, label), .17 * a.bell_low(165, .7) if low else .22 * a.score_sfx())
    # 地図の印が増える（点の音）
    for i, t in enumerate(np.arange(W('next:spread', '数十年'), W('next:spread', '数十年') + .14 * 30, .14 * 3)): hit('dot', t, .03 * a.tone(880 + 30 * (i % 4), .08, .03, .001))
    hit('flash', W('last:valve', '小さな弁'), .05 * a.tone(1320, .5, .25, .01, partials=((1, 1), (2, .3))))
    out = CACHE / f'{CID}.wav'; levels = a.normalize_lufs(voice + music + fx, out, target=-13.7)
    limited = CACHE / f'{CID}.limited.wav'
    subprocess.run([a.FF, '-y', '-v', 'error', '-i', str(out), '-af', 'aresample=96000,alimiter=limit=0.75:attack=5:release=50:level=false:latency=true,aresample=24000', '-c:a', 'pcm_s16le', str(limited)], check=True)
    os.replace(limited, out); levels['integrated_lufs'], levels['peak_dbfs'] = a.loudness(out)
    correction = min(-14 - levels['integrated_lufs'], -1.55 - levels['peak_dbfs'])
    if correction > 0:
        a.write(out, a.read(out) * 10 ** (correction / 20)); levels['integrated_lufs'], levels['peak_dbfs'] = a.loudness(out)
    levels['quiet_runs_below_-35dB_0.25s'] = a.quiet_runs(a.read(out)); levels['source_voice_sha256'] = hashlib.sha256(source.read_bytes()).hexdigest()
    levels['music_spans'] = {'solve': sv, 'solved': sd, 'dark': dk, 'toll': tl, 'after': af}; levels['sfx'] = hits; levels['audition'] = '耳での確認はしていない'
    (CACHE / f'{CID}.levels.json').write_text(json.dumps(levels, ensure_ascii=False, indent=1))
    (CACHE / f'{CID}.mix.json').write_text(json.dumps({'mixSha256': hashlib.sha256(out.read_bytes()).hexdigest(), 'voiceSha256': levels['source_voice_sha256']}, indent=1))
    print(json.dumps({k: v for k, v in levels.items() if k != 'sfx'}, ensure_ascii=False, indent=1)); print('sfx', len(hits))
if __name__ == '__main__': make()

