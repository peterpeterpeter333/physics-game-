"""D1a S4 v2: unchanged speech, quieter BGM, natural pauses, exact close SFX.

Only this new S4 cache receives new files. The original S3 mixed/stem WAVs,
scripts, speech, captions and timings are never written. No synthesis/API call.
Run --analyze-only to measure/rehearse the BGM correction entirely in RAM.
Full mixing requires --sfx-timing <new actual-visual-timing.json>.
"""
import argparse
import datetime
import hashlib
import json
import math
import os
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
import numpy as np

WROOT = Path(__file__).resolve().parents[2]
R4 = WROOT / 'outputs/ys-chain-d1a-backup/S4_20261028'
CACHE = Path('/private/tmp/ys/ys-chain-d1a_s4_gpt_20261028')
S3 = WROOT / 'outputs/ys-chain-d1a-backup/S3_20261028/magnifier/cache'
CID = 'ys-chain-d1a'
REVISION = 's4v3'
SUFFIXES = ['.'+REVISION+x for x in ['.mixed.wav', '.bgm.wav', '.levels.json', '.mix.json',
            '.voice-bgm.json', '.bgm-deficits-before.json', '.bgm-adjustment.json',
            '.limited.wav', '.fx.wav']]


def sha(p):
    h = hashlib.sha256()
    with Path(p).open('rb') as f:
        for x in iter(lambda: f.read(1 << 20), b''):
            h.update(x)
    return h.hexdigest()


def read_json(p):
    return json.loads(Path(p).read_text(encoding='utf8'))


def write_json_new(p, obj):
    p = Path(p)
    assert p.parent.resolve() in [CACHE, R4], 'New reports stay in the S4 cache/report folder'
    with p.open('x', encoding='utf8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1, allow_nan=False)


def snapshot():
    baseline = read_json(R4 / 'immutable-input-baseline_s4_20261028.json')
    entries = baseline['protected49'] + baseline['frozenS3Sources'] + baseline['frozenS3Products']
    entries += [dict(path=x['path'], sha256=x['sha256']) for x in baseline['restored11']]
    before = {x['path']: sha(x['path']) for x in entries}
    assert all(before[x['path']] == x['sha256'] for x in entries), 'Original protected input changed'
    return before


def comparison(voice, bgm, sr):
    assert len(voice) == len(bgm)
    rows = []
    for i in range(0, len(voice), sr):
        v, b = voice[i:i+sr], bgm[i:i+sr]
        if len(v) < sr//4:
            continue
        vr = float(np.sqrt(np.mean(v.astype(float)**2)))
        br = float(np.sqrt(np.mean(b.astype(float)**2)))
        vd, bd = 20*math.log10(max(vr, 1e-12)), 20*math.log10(max(br, 1e-12))
        fraction = float(np.mean(np.abs(v) > 10**(-45/20)))
        rows.append(dict(start=i/sr, duration=len(v)/sr, voiceDbfs=vd, bgmDbfs=bd,
                         differenceDb=vd-bd, voicePresent=vd > -45 and fraction >= .10))
    present = [x['differenceDb'] for x in rows if x['voicePresent']]
    assert present
    return dict(method='Aligned1s RMS, supplied voice-only versus BGM-only samples',
                measurementDomain='pre-master components; no independent track normalization',
                voicePresentRule='RMS>-45dBFS and>=10% samples>-45dBFS',
                medianVoiceMinusBgmDb=float(np.median(present)),
                p10VoiceMinusBgmDb=float(np.percentile(present, 10)),
                requiredMedianDb=15, requiredP10Db=10,
                musicDuckDepth=.90, bedDuckDepth=.75, voiceReferencePercentile=25,
                voiceReferencePercentileChanged=False, fastSolvePattern=False,
                solveGainBoost=False, earsPerformed=False, windows=rows)


def quantized(x):
    # Exactly the immutable shared write() PCM16 quantization, without file IO.
    return (np.clip(x, -1, 1)*32767).astype('<i2').astype(np.float32)/32768


def restore_failed_pause_gains(gain, voice, sr):
    """Undo excess ducking only inside the first failed mix's real quiet runs.

    No composition, speech sample or gain during detectable speech is changed.
    The first S4 reports remain immutable evidence, not acceptance thresholds.
    """
    from desk_audio_lib import moving_average
    failed_path = CACHE/(CID+'.s4.levels.json')
    failed = read_json(failed_path)
    assert failed.get('source_voice_sha256') == sha(CACHE/(CID+'.voice.wav'))
    windows = failed['quiet_runs_below_-35dB_0.25s']
    assert windows, 'This minimal revision needs recorded first-mix quiet intervals'
    envelope = np.sqrt(np.maximum(0, moving_average(voice.astype(float)**2, round(.02*sr))))
    silent = envelope < 10**(-55/20)
    edges = np.flatnonzero(np.diff(np.r_[False, silent, False].astype(np.int8)))
    ramp, recovered = round(.15*sr), []
    before = gain.copy()
    for a, b in zip(edges[::2], edges[1::2]):
        overlaps = [w for w in windows if a/sr < w[1] and b/sr > w[0]]
        if b-a < round(.30*sr) or not overlaps:
            continue
        steps = np.arange(b-a)
        release = np.minimum(1, np.minimum(steps/ramp, (b-a-1-steps)/ramp))
        previous = gain[a:b].copy()
        gain[a:b] = previous+(1-previous)*release
        recovered.append(dict(start=a/sr, end=b/sr, sourceFailures=overlaps,
                              riseSeconds=.15, fallSeconds=.15,
                              maximumVoiceEnvelopeDbfs=float(20*np.log10(max(envelope[a:b].max(), 1e-12)))))
    assert recovered, 'No non-speaking pause overlaps the recorded quiet failures'
    assert np.all(gain >= before) and np.all(gain <= 1)
    assert np.array_equal(gain[~silent], before[~silent]), 'Never recover BGM over detectable speech'
    return dict(sourceFirstMixLevels=str(failed_path), sourceFirstMixLevelsSha256=sha(failed_path),
                sourceQuietFailures=windows, recoveryOnlyWithinVoiceBelowDbfs=-55,
                voiceEnvelopeSeconds=.02, recoveredPauses=recovered,
                gainAboveOriginalBgm=False, allSpeechDetectableSamplesUnchanged=True,
                changedGainSamples=int(np.count_nonzero(gain != before)), earsPerformed=False)


def attenuate_only(voice, original, sr):
    before = comparison(voice, original, sr)
    deficits = [x for x in before['windows'] if x['voicePresent'] and x['differenceDb'] < 10]
    gain = np.ones(len(original), dtype=np.float32)
    ramp = int(.15*sr)
    # Leave .5dB numerical headroom; the acceptance thresholds stay 10/15dB.
    for row in deficits:
        a = round(row['start']*sr); b = min(len(gain), round((row['start']+row['duration'])*sr))
        g = 10**((row['differenceDb']-10.5)/20)
        gain[a:b] = np.minimum(gain[a:b], g)
        lo, hi = max(0, a-ramp), min(len(gain), b+ramp)
        if a > lo:
            gain[lo:a] = np.minimum(gain[lo:a], np.linspace(1, g, a-lo, dtype=np.float32))
        if hi > b:
            gain[b:hi] = np.minimum(gain[b:hi], np.linspace(g, 1, hi-b, dtype=np.float32))
    # Recover only the two diagnosed natural rests, rather than lifting all
    # pauses (which was tested in RAM and missed the unchanged p10>=10 rule).
    pause_recovery = restore_failed_pause_gains(gain, voice, sr)
    assert np.all((gain > 0) & (gain <= 1)), 'Only attenuate the existing BGM'
    adjusted = quantized(original*gain)
    after = comparison(voice, adjusted, sr)
    after['pass'] = after['medianVoiceMinusBgmDb'] >= 15 and after['p10VoiceMinusBgmDb'] >= 10
    assert after['pass'], ('BGM correction misses unchanged acceptance limits', after['p10VoiceMinusBgmDb'], after['medianVoiceMinusBgmDb'])
    details = dict(originalIntervalsBelow10dB=deficits, originalIntervalCount=len(deficits),
                   targetIntervalDifferenceDb=10.5, rampSeconds=.15,
                   minBgmGain=float(gain.min()), samplesAttenuated=int(np.sum(gain < 1)),
                   percentOfSamplesAttenuated=float(np.mean(gain < 1)*100),
                   changedComposition=False, onlyBgmAttenuated=True,
                   sourceVoiceChanged=False, percentile15Used=False,
                   beforeMedianDb=before['medianVoiceMinusBgmDb'], beforeP10Db=before['p10VoiceMinusBgmDb'],
                   afterMedianDb=after['medianVoiceMinusBgmDb'], afterP10Db=after['p10VoiceMinusBgmDb'],
                   pauseRecovery=pause_recovery)
    return adjusted, before, after, details


def setup():
    assert str(os.environ.get('EM_FILM_CACHE')) == str(CACHE), 'Explicit new S4 cache required'
    assert CACHE.is_dir() and not CACHE.is_symlink() and CACHE.resolve() == CACHE
    import desk_audio_lib as a
    assert a.CACHE == CACHE and a.SR == 24000
    for rel in ['plan.json', CID+'.json', 'phrase-times.json', 'timed-selection.json',
                'prosody.txt', CID+'.voice.wav', CID+'.wav', 'word-events-actual_s3_20261028.json', 'blender/data.json']:
        assert (CACHE/rel).is_file() and not (CACHE/rel).is_symlink(), rel
        assert sha(CACHE/rel) == sha(S3/rel), 'Copied original input differs: '+rel
    supplied = WROOT / 'scripts/blender/desk_assets/d1a' / (CID+'.wav')
    assert sha(CACHE/(CID+'.voice.wav')) == sha(supplied)
    voice = a.read(CACHE/(CID+'.voice.wav'))
    original = a.read(S3/(CID+'.s3c.bgm.wav'))
    assert len(voice) == len(original)
    return a, voice, original


def sfx_close_event(file, actual):
    d = read_json(file)
    assert d.get('schema') == 'D1a-S4-visual-SFX-timing-v1' and d.get('fps') == 30
    assert isinstance(d.get('sceneSourceKey'), str) and len(d['sceneSourceKey']) >= 20
    e = d['events']['inlet_close']
    assert e['cue'] == 'guericke:push' and e['word'] == '入口の弁は閉じ'
    assert type(e['frame']) is int and 0 <= e['frame'] < 11618
    assert abs(e['time']-e['frame']/30) < 1e-8
    delta = e['time']-actual[e['cue']][e['word']]['time']
    assert .3 <= delta <= .5, 'Use the first fully-closed frame of the approved .3-.4s closure'
    return d, e


def make(args):
    before_protected = snapshot()
    previous_s4 = {str(p): sha(p) for p in CACHE.glob(CID+'.s4.*') if p.is_file()}
    a, voice, original = setup()
    music, before_bgm, after_bgm, adjustment = attenuate_only(voice, original, a.SR)
    if args.analyze_only:
        print(json.dumps({'analysisOnly': True, 'noFilesWritten': True, 'adjustment': adjustment,
                          'allProtectedUnchanged': all(sha(p) == h for p, h in before_protected.items()),
                          'firstS4ProductsUnchanged': all(sha(p) == h for p, h in previous_s4.items())}, ensure_ascii=False))
        return
    assert args.sfx_timing, '--sfx-timing with an actual approved full-close frame is required'
    assert all(not (CACHE/(CID+x)).exists() for x in SUFFIXES), 'Preserve every existing S4 output'
    actual_path = CACHE/'word-events-actual_s3_20261028.json'
    actual = read_json(actual_path)
    timing, close_event = sfx_close_event(args.sfx_timing, actual)
    timing_sha = sha(args.sfx_timing)
    data = read_json(CACHE/'blender/data.json'); cues = {c['key']: c for c in data['cues']}
    plan = read_json(CACHE/'plan.json')[0]
    qs = {q['diagram'].replace('cd1a-', ''): q for s in plan['scenes'] for q in s['cues']}
    def S(k): return cues[k]['start']
    def E(k): return cues[k]['end']
    def W(k, word):
        assert len([e for e in cues[k]['wordEvents'] if e['word'] == word]) == 1
        t = actual[k][word]['time']; assert math.isfinite(t); return t
    n, duration = len(voice), len(voice)/a.SR
    stem = CACHE/(CID+'.'+REVISION+'.bgm.wav')
    # music already contains one PCM quantization. Write it once and measure the
    # actual written samples, rather than certifying only an in-memory estimate.
    a.write(stem, music)
    measured = comparison(voice, a.read(stem), a.SR)
    measured['pass'] = measured['medianVoiceMinusBgmDb'] >= 15 and measured['p10VoiceMinusBgmDb'] >= 10
    assert measured['pass']
    write_json_new(CACHE/(CID+'.'+REVISION+'.bgm-deficits-before.json'),
                   dict(source=str(S3/(CID+'.s3c.bgm.wav')), sourceSha256=sha(S3/(CID+'.s3c.bgm.wav')),
                        voiceSha256=sha(CACHE/(CID+'.voice.wav')), **before_bgm))
    write_json_new(CACHE/(CID+'.'+REVISION+'.bgm-adjustment.json'), adjustment)
    write_json_new(CACHE/(CID+'.'+REVISION+'.voice-bgm.json'), measured)
    fx = np.zeros(n); hits = []; rng = np.random.default_rng(441)
    def hit(name, t, x):
        if 0 <= t < duration:
            a.add(fx, x, t); hits.append({'name': name, 'time': round(float(t), 4),
                                        'sampleIndex': int(t*a.SR)})
    def click(): return .065*a.click()
    def hiss(d=.8): return .035*a.MA.lowpassed_noise(d, 1500, 6000)
    def water(d=.7): return .035*a.MA.lowpassed_noise(d, 500, 3200)
    for key, c in cues.items():
        for name, when in qs[key].get('sfx', []) or []:
            ve = c['end']-.12-float(qs[key].get('pause', 0))
            t = ve+float(when[2:]) if isinstance(when, str) and when.startswith('e+') else c['start']+float(when)
            hit(name, t, a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name, .4)*.5)
    for t in np.arange(S('mine:open')+1.3, E('mine:water'), 2.3): hit('water_drop', t, .055*a.tone(760, .16, .06, .001, partials=((1,1),(1.7,.3))))
    for t in np.arange(W('gin:horse','人や馬'), E('gin:closed'), .7): hit('hoof', t, .04*a.tone(160, .1, .035, .001, partials=((1,1),(2.9,.3))))
    hit('rope_winding',W('gin:drum','巻き取られて'),.04*a.whirr(1.1)); hit('bucket_water',W('gin:drum','引き上げられる'),water(.7))
    for i in range(4): hit('assembly',W('nc:install','据えつけました')+.3*i,.08*a.click())
    hit('cold_spray',W('myth:fact','吹きこんで'),.055*a.MA.lowpassed_noise(.8,600,5000))
    hit('expansion',W('shrink:spoon','ふくらみます'),hiss(.6)); hit('shrink',W('shrink:back','縮みます'),hiss(.45))
    hit('boiling',W('can:fill','温めます'),.05*a.MA.lowpassed_noise(1.4,400,2200)); hit('air_leaving_can',W('can:fill','追い出して'),hiss(.8))
    hit('water_seal',W('can:flip','つけると'),water(.35))
    crush=(rng.normal(0,1,int(.22*a.SR))*np.exp(-np.arange(int(.22*a.SR))/(a.SR*.045)))*.10
    hit('can_crush',W('can:crush','ぐしゃっと'),crush*10**(4/20))
    hit('straw',W('straw:push','押し上げて'),water(.6))
    for k,label in [('air:1kg','1キログラム'),('air:1kg','100キログラム分'),('size:2t','2トン分')]: hit('weight',W(k,label),.12*a.tone(90,.3,.09,.001,partials=((1,1),(1.4,.3))))
    hit('condense',W('cyl:likecan','冷やす'),water(.55)); hit('piston_down',W('cyl:likecan','ピストンを押します'),.04*a.tone(230,.5,.2,.05,partials=((1,1),(3,.15))))
    hit('score_low',W('gin:closed','閉じて（得点板 水 1−0 人）'),.17*a.bell_low(165,.7))
    hit('pump_handle',W('guericke:pull','取っ手を引く'),.05*a.whirr(.4)); hit('inlet_flap',W('guericke:pull','押し開けて'),click()); hit('air_inlet',W('guericke:pull','入ってきます'),hiss(.45))
    hit('pump_handle',W('guericke:push','取っ手を押す'),.05*a.whirr(.4)); hit('inlet_close',close_event['time'],click()); hit('air_outlet',W('guericke:push','出ていきます'),hiss(.6))
    valve=W('size:pull','空気を入れる'); hit('valve_hiss',valve,.08*a.MA.lowpassed_noise(.4,900,5000)); hit('hemisphere_pop',valve+.55,.10*a.tone(440,.15,.04,.001,partials=((1,1),(2.3,.3)))); hit('horse_stumble',valve+.68,.07*a.tone(180,.15,.05,.001))
    fxstem=CACHE/(CID+'.'+REVISION+'.fx.wav'); a.write(fxstem,fx)
    out=CACHE/(CID+'.'+REVISION+'.mixed.wav')
    levels=a.normalize_lufs(voice+a.read(stem)+fx,out,target=-13.7)
    limited=CACHE/(CID+'.'+REVISION+'.limited.wav')
    subprocess.run([a.FF,'-n','-v','error','-i',str(out),'-af','aresample=96000,alimiter=limit=0.75:attack=5:release=50:level=false:latency=true,aresample=24000','-c:a','pcm_s16le',str(limited)],check=True)
    os.replace(limited,out)
    levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    correction=min(-14-levels['integrated_lufs'],-1.55-levels['peak_dbfs'])
    if correction>0:
        a.write(out,a.read(out)*10**(correction/20)); levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    levels.update(quiet_runs_below_m35dB_025s=a.quiet_runs(a.read(out)),sfx=hits,
                  source_voice_sha256=sha(CACHE/(CID+'.voice.wav')),
                  bgm_stem=str(stem),median_voice_minus_bgm_db=measured['medianVoiceMinusBgmDb'],
                  p10_voice_minus_bgm_db=measured['p10VoiceMinusBgmDb'],audition='耳での確認はしていない')
    levels['quiet_runs_below_-35dB_0.25s']=levels.pop('quiet_runs_below_m35dB_025s')
    levels['visualSfxTiming']={'path':str(args.sfx_timing.resolve()),'sha256':timing_sha,
                              'sceneSourceKey':timing['sceneSourceKey'],'inletCloseFrame':close_event['frame'],
                              'inletCloseTime':close_event['time'],'audioSampleIndex':int(close_event['time']*a.SR)}
    write_json_new(CACHE/(CID+'.'+REVISION+'.levels.json'),levels)
    provenance=dict(stage='S4',audioRevision=REVISION,mixSha256=sha(out),voiceSha256=sha(CACHE/(CID+'.voice.wav')),
                    bgmStemSha256=sha(stem),sourceS3BgmSha256=sha(S3/(CID+'.s3c.bgm.wav')),
                    sourceS3MixSha256=sha(S3/(CID+'.s3c.mixed.wav')),sampleRate=a.SR,samples=n,
                    audioDuration=duration,medianVoiceMinusBgmDb=measured['medianVoiceMinusBgmDb'],
                    p10VoiceMinusBgmDb=measured['p10VoiceMinusBgmDb'],speechRegenerated=False,
                    suppliedVoiceSamplesEdited=False,BGMOnlyRevision=False,BGMAndSFXTimingRevision=True,
                    actualWordEventsSha256=sha(actual_path),sfxTimingSha256=timing_sha,
                    visualSceneSourceKey=timing['sceneSourceKey'],SFXRetimed=['inlet_close'],
                    originalS3InputsUnchanged=all(sha(p)==h for p,h in before_protected.items()),
                    firstS4ProductsUnchanged=all(sha(p)==h for p,h in previous_s4.items()),
                    firstS4ProductHashes=previous_s4,
                    pauseRecovery=adjustment['pauseRecovery'],
                    earsPerformed=False)
    write_json_new(CACHE/(CID+'.'+REVISION+'.mix.json'),provenance)
    assert abs(levels['integrated_lufs']+14)<.3 and levels['peak_dbfs']<=-1.45,levels
    assert levels['quiet_runs_below_-35dB_0.25s']==[],levels['quiet_runs_below_-35dB_0.25s']
    assert len(a.read(out))==n and provenance['originalS3InputsUnchanged'] and provenance['firstS4ProductsUnchanged']
    assert sha(args.sfx_timing)==timing_sha,'Actual visual/SFX timing changed during mixing'
    print(json.dumps({'mix':str(out),'medianDb':measured['medianVoiceMinusBgmDb'],
                      'p10Db':measured['p10VoiceMinusBgmDb'],'lufs':levels['integrated_lufs'],
                      'peakDbfs':levels['peak_dbfs'],'quietRuns':levels['quiet_runs_below_-35dB_0.25s'],
                      'inletCloseFrame':close_event['frame'],'protectedUnchanged':True,'earsPerformed':False},ensure_ascii=False))


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--analyze-only',action='store_true')
    parser.add_argument('--sfx-timing',type=Path)
    make(parser.parse_args())
