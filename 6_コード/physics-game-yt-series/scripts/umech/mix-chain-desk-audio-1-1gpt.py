"""Mix the ChatGPT 1-1 pilot from its own picture and narration cues.

The sound generators are shared with the reference; event times and arrangement
below are selected for this pilot. The untouched narration comes from voice.wav.
"""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import sys

import numpy as np


def sound_tools():
    path = Path(__file__).with_name('mix-chain-desk-audio-1-1v6.py')
    spec = importlib.util.spec_from_file_location('desk_sound_tools', path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main(cid):
    tools = sound_tools()
    cache = Path(os.environ['EM_FILM_CACHE'])
    clip = json.loads((cache / 'plan.json').read_text())[0]
    timed = json.loads((cache / f'{cid}.json').read_text())
    voice_path = cache / f'{cid}.voice.wav'
    if not voice_path.exists():
        raise SystemExit('Render narration before mixing')
    voice = tools.read(voice_path)
    sr = tools.SR
    n = len(voice)
    dur = n / sr
    cues = [q for scene in clip['scenes'] for q in scene['cues']]
    caps = [cap for scene in timed['scenes'] for cap in scene['captions']]
    assert len(cues) == len(caps) == 85
    by_key = {q['diagram'].removeprefix('c11gpt-'): (q, cap)
              for q, cap in zip(cues, caps)}
    phrases = json.loads((cache / 'phrase-times.json').read_text())

    def moment(key, word=None, occurrence=0):
        q, cap = by_key[key]
        if word is None:
            return cap['start']
        timing = phrases[q['subtitle']]
        matches = list(re.finditer(re.sub('[ウオ]', '[ウオ]', word), timing['s']))
        if len(matches) <= occurrence:
            raise AssertionError(f'No spoken anchor {key}: {word}')
        return cap['start'] + timing['t'][matches[occurrence].start()]

    # Investigation, discovery, consequence, then the next riddle.
    solve = moment('rows:fill')
    discovery = moment('rows:done')
    dark = moment('end:a')
    toll = moment('end:exec')
    return_to_light = moment('end:mio')
    assert 0 < solve < discovery < dark < toll < return_to_light < dur
    music = np.zeros(n)
    music += tools.base_music(n, 0, solve)
    music += tools.base_music(n, solve, discovery + .3, bright=1) * 1.22
    chord_len = int(4.5 * sr)
    tools.add(music, tools.pad([tools.hz(v) for v in (48, 60, 64, 67, 72)],
                               chord_len) * np.exp(-np.arange(chord_len) / sr / 2.2),
              discovery)
    tools.add(music, .75 * tools.MA.sfx('chime'), discovery)
    music += tools.base_music(n, discovery + 1.5, dark + .25) * .9
    a, b = int(dark * sr), int((return_to_light + 1.6) * sr)
    t = np.arange(b - a) / sr
    low = tools.pad([tools.hz(v) for v in (38, 50, 53, 57)], b - a, det=.2)
    low *= .8 + .2 * np.sin(2 * np.pi * t / 6)
    low *= tools.env_ramp(b-a, [(0, 0), (.8, .55), (toll-dark, .55),
                                (toll-dark+1, .32),
                                (return_to_light-dark, .32), (t[-1], 0)])
    music[a:b] += low
    tools.add(music, .85 * tools.bell_low(), toll + 1.1)
    music += tools.base_music(n, return_to_light, dur + 1) * .55
    # The quiet transition must not turn into a false audio cut.
    pad_begin, pad_end = 430.45, 432.55
    start, end = int(pad_begin * sr), int(pad_end * sr)
    t = np.arange(end-start) / sr
    env = np.minimum(np.clip(t/.65, 0, 1), np.clip((t[-1]-t)/.65, 0, 1))
    music[start:end] += .037 * env * (.84*np.sin(2*np.pi*110*t)
                                     + .16*np.sin(2*np.pi*164.81*t))
    speech_energy = np.sqrt(tools.moving_average(voice**2, int(.05*sr)))
    speech_energy = tools.moving_average(speech_energy, int(.4*sr))
    speech_energy /= speech_energy.max() + 1e-9
    music *= .20 * (1 - .55*np.clip(speech_energy*4, 0, 1))

    effects = np.zeros(n)
    hits = []
    def hit(name, when, sound):
        tools.add(effects, sound, when)
        hits.append([name, round(when, 3)])
    click = tools.click()
    # Every sound is tied to a visible movement in desk_1_1gpt.py.
    for key, word in [('disk:ad','ビイ'), ('disk:ad','スィイ'),
                      ('disk:be','スィイ'), ('ring:zc','ビイ')]:
        hit('pointer', moment(key, word), .11*click)
    rotate_start = moment('disk:turn','サンメモリ')
    for i in range(3):
        hit('inner-ring', rotate_start + .18 + i*.22, .17*click)
    for i in range(13):
        hit('full-ring', moment('disk:25')+.48+i*.15, .05*click)
    hit('spin', moment('disk:spin')+.35, .35*tools.whirr(2.0))
    for i in range(3):
        hit('letter-swap', moment('e3:flip')+.9+i*.34, .10*click)
    for i in range(5):
        hit('dice', moment('dice:roll')+.75+i*.45,
            .075*tools.tone(220, .12, .03, .002, partials=((1,1),(2.7,.4))))
    for key in ('logic:judge','rows:f3','rows:h','rows:j'):
        hit('discovery', moment(key)+.8, .13*tools.MA.sfx('chime'))
    for key, word in (('disk:three','キャット'), ('rows:done','カゾエタ')):
        hit('score', moment(key, word), .22*tools.score_sfx())

    raw_mix = voice + music + effects
    # A brief pause before the execution line keeps the same low harmony.
    gap_start, gap_end = int(447.9 * sr), int(450.0 * sr)
    t = np.arange(gap_end-gap_start) / sr
    gap_env = np.minimum(np.clip(t/.55, 0, 1),
                         np.clip((t[-1]-t)/.55, 0, 1))
    raw_mix[gap_start:gap_end] += .05 * gap_env * (
        .82*np.sin(2*np.pi*110*t) + .18*np.sin(2*np.pi*164.81*t))
    out = cache / f'{cid}.wav'
    temp = cache / f'{cid}.gpt-mixtmp.wav'
    gain = 1.0
    for _ in range(3):
        y = np.tanh(raw_mix * gain / .88) * .88
        tools.write(temp, y)
        loud, _ = tools.loudness(temp)
        if abs(loud + 14) < .25:
            break
        gain *= 10 ** ((-14-loud)/20)
    os.replace(temp, out)
    loud, peak = tools.loudness(out)
    runs = tools.quiet_runs(tools.read(out))
    report = {'integrated_lufs': loud, 'peak_dbfs': peak,
              'quiet_runs_below_-35dB_0.25s': runs,
              'music_arc': {'solve': solve, 'discovery': discovery,
                            'dark': dark, 'toll': toll,
                            'return_to_light': return_to_light},
              'sfx': hits}
    (cache / f'{cid}.gpt-audio-levels.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2))
    (cache / f'{cid}.mix.json').write_text(json.dumps({
        'mixSha256': hashlib.sha256(out.read_bytes()).hexdigest(),
        'voice': voice_path.name}))
    print(f'{cid}: {loud:.1f} LUFS, peak {peak:.1f} dBFS, '
          f'quiet runs {len(runs)}; {len(hits)} timed effects')
    if runs or abs(loud+14) > .7:
        raise SystemExit('Audio level target not met')


if __name__ == '__main__':
    main(sys.argv[1])
