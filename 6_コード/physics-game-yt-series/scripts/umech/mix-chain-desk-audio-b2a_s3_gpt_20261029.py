"""B-2前編S3: frozen Nemo speech + deeply ducked original procedural music/SFX.

Existing source/script/voice/subtitle clocks remain read-only. No synthesis API,
shared-code edits or UI operations. A shared Blender motion-events JSON is
required for kick sounds; no independent guessed kick times are introduced.

Run with the physics-quest-tools Python:
  python THIS --motion-events <root motion-events.json>

Outputs are new files under the new S3 cache/audio; existing files are refused.
"""
from pathlib import Path
import argparse, hashlib, json, os, shutil, sys, time, wave
import numpy as np

W=Path(__file__).resolve().parents[2]
SOURCE=Path('/private/tmp/ys/ys-chain-b2a_gpt_20261029')
DEST=Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029')
BACKUP=W/'outputs/ys-chain-b2a-backup/S3_20261029/audio'
CID='ys-chain-b2a_gpt_20261029'
SR=24000
os.environ.setdefault('EM_FILM_CACHE',str(DEST))
import desk_audio_lib as a

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def norm(s):
    s=''.join(chr(ord(c)+0x60) if '\u3041'<=c<='\u3096' else c for c in s)
    s=''.join(c for c in s if c not in "'_ \t\n").replace('ヲ','オ').replace('ハ','ワ').replace('ヘ','エ').replace('ヅ','ズ').replace('ヂ','ジ')
    vowels={'ア':'アカサタナハマヤラワガザダバパャァ','イ':'イキシチニヒミリギジヂビピィ','ウ':'ウクスツヌフムユルグズヅブプュゥヴ','エ':'エケセテネヘメレゲゼデベペェ','オ':'オコソトノホモヨロヲゴゾドボポョォ'}
    def v(c):return next((k for k,x in vowels.items() if c in x),'ウ')
    out=''
    for c in s:
        d=v(out[-1] if out else 'ア') if c=='ー' else c
        if d=='ウ' and out and v(out[-1])=='オ':d='オ'
        out+=d
    return out

def vgate(voice):
    # Copied verbatim from the approved C-1 BGM correction, not the shallow
    # shared duck_under_voice(). One gate is reused for all stems.
    e=np.sqrt(a.moving_average(voice**2,int(.05*a.SR)))
    e=a.moving_average(e,int(.4*a.SR))
    ref=np.percentile(e[e>1e-4],25) if (e>1e-4).any() else 1
    return np.clip(e/ref,0,1)

def duck_deep(music,voice,gain=.18,depth=.90,gate=None):
    return music*gain*(1-depth*(vgate(voice) if gate is None else gate))

def bed_duck(voice,gate=None):return 1-.75*(vgate(voice) if gate is None else gate)

def rms(x):return float(np.sqrt(np.mean(x.astype(np.float64)**2))) if len(x) else 0.
def db(x):return 20*np.log10(max(float(x),1e-12))

def measure_windows(voice,music,presence_reference=None):
    rows=[]
    presence=voice if presence_reference is None else presence_reference
    for i in range(0,len(voice),SR):
        v=rms(voice[i:i+SR]);m=rms(music[i:i+SR])
        # A non-overlapping one-second block is voiced when the source PCM RMS
        # exceeds -45 dBFS. This definition and every block are saved, not hidden.
        if db(rms(presence[i:i+SR]))>-45:rows.append({'start':i/SR,'seconds':len(voice[i:i+SR])/SR,'voiceDbfs':db(v),'bgmDbfs':db(m),'differenceDb':db(v)-db(m)})
    values=np.array([r['differenceDb'] for r in rows])
    return {'windowSeconds':1,'voicePresentCriterion':'original voice PCM RMS > -45 dBFS','voicedWindows':len(rows),'medianDb':float(np.median(values)),'p10Db':float(np.percentile(values,10)),'minimumDb':float(values.min()),'windows':rows}

def small_kick(degrees=30):
    n=round(.085*SR);t=np.arange(n)/SR
    f=730-350*t/.085
    x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,t/.003)*np.exp(-t/.025)
    return x*.055*max(.22,min(1,abs(float(degrees))/30)**.5)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--motion-events',required=True);parser.add_argument('--output-dir',default=str(DEST/'audio-v4'))
    args=parser.parse_args();events_file=Path(args.motion_events).resolve();OUT=Path(args.output_dir).resolve()
    if OUT==SOURCE or SOURCE in OUT.parents:raise RuntimeError('Output cannot be inside the frozen source cache')
    OUT.mkdir(parents=True,exist_ok=True);BACKUP.mkdir(parents=True,exist_ok=True)
    paths={name:OUT/(CID+'.s3.'+suffix) for name,suffix in [('mixed','mixed.wav'),('bgm','bgmonly.wav'),('sfx','sfxonly.wav'),('voice','voice-contribution.wav'),('levels','levels.json'),('mix','mix.json'),('windows','voice-bgm-windows.json')]}
    for p in paths.values():
        if p.exists():raise RuntimeError('Refuse overwrite '+str(p))
    frozen=json.loads((W/'outputs/ys-chain-b2a-backup/S0_20261029/AUDIO_AND_TIMING_FROZEN.json').read_text())
    protected={f['path']:f['sha256'] for f in frozen['immutableMediaFiles']}
    protected.update({frozen['master']:frozen['masterSha256'],frozen['script']:frozen['scriptSha256']})
    assert all(sha(p)==h for p,h in protected.items()),'Frozen input mismatch before mixing'
    timed=json.loads((SOURCE/(CID+'.json')).read_text());PT=json.loads((SOURCE/'phrase-times.json').read_text())
    cues=[(q,sc['captions'][i]) for sc in timed['scenes'] for i,q in enumerate(sc['cues'])]
    def at(row,kana,occ=0):
        import re
        pattern=re.compile(re.sub('[ウオ]','[ウオ]',norm(kana)))
        hits=[]
        for q,cap in cues:
            if q['masterRow']!=row:continue
            p=PT[q['subtitle']]
            hits.extend(cap['start']+p['t'][m.start()] for m in pattern.finditer(p['s']))
        if len(hits)<=occ:raise ValueError('Spoken SFX anchor absent '+str((row,kana,occ)))
        return hits[occ]
    def span(name):
        caps=[cap for q,cap in cues if q.get('music')==name]
        assert caps,name
        return [caps[0]['start'],caps[-1]['end']]
    spans={k:span(k) for k in ['solve','solved','dark','toll','after']}
    sv,sd,dk,tl,af=[spans[k] for k in ['solve','solved','dark','toll','after']]
    assert all(x[0]<y[0] for x,y in zip([sv,sd,dk,tl],[sd,dk,tl,af]))
    voice=a.read(SOURCE/(CID+'.voice.wav'));n=len(voice);duration=n/SR
    assert abs(duration-timed['duration'])<1/SR
    gate=vgate(voice)
    # Exact frozen music allocation. The fast bright=1 pattern and 1.25 boost
    # are deliberately absent, including under explanation at the solve stage.
    music=a.base_music(n,0,sv[0])+a.base_music(n,sv[0],sd[0]+.3,bright=0)
    music+=a.solved_music(n,sd[0])+a.base_music(n,sd[0]+1.6,dk[0]+.2)*.9
    a.add(music,.8*a.MA.sfx('chime'),sd[0])
    dark=a.dark_music(n,dk[0],af[1])
    dark*=a.env_ramp(n,[(0,0),(dk[0],0),(dk[0]+.8,1),(tl[0]+1,.6),(af[0],.6),(af[1],.45),(af[1]+.1,0)])
    music+=dark
    toll_caps=[(q,cap) for q,cap in cues if q.get('music')=='toll']
    tq,tc=toll_caps[-1];toll_time=tc['end']-.12-float(tq.get('pause') or 0)
    music+=a.toll_music(n,toll_time)*.25
    music+=a.after_music(n,af[0],duration+.1)
    music=duck_deep(music,voice,.18,.90,gate)
    music+=.040*a.pad([a.hz(48),a.hz(55),a.hz(64)],n)*bed_duck(voice,gate)
    music*=a.env_ramp(n,[(0,1),(duration-.10,1),(duration,0)])
    initial_windows=measure_windows(voice,music)
    # If partly voiced one-second windows still mask a quiet syllable, lower
    # the accompaniment itself, never relax the 15/10dB acceptance criteria.
    extra_db=max(0,16-initial_windows['medianDb'],11-initial_windows['p10Db'])
    extra_gain=10**(-extra_db/20);music*=extra_gain
    preliminary=measure_windows(voice,music)
    assert preliminary['medianDb']>=15 and preliminary['p10Db']>=10
    motion=json.loads(events_file.read_text());motion_events=motion.get('events',motion.get('kicks',[])) if isinstance(motion,dict) else motion
    if not motion_events:raise RuntimeError('Shared motion events are empty')
    fps=motion.get('fps',30) if isinstance(motion,dict) else 30
    assert fps==30
    fx=np.zeros(n);hits=[]
    def hit(kind,t,x,source_event=None):
        j=round(float(t)*fps);actual=j/fps
        if not 0<=actual<duration:raise ValueError('SFX outside movie '+str((kind,t)))
        pos=round(actual*SR);x=x[:n-pos]
        x=x*(1-.6*gate[pos:pos+len(x)])
        fx[pos:pos+len(x)]+=x
        hits.append({'kind':kind,'sourceSeconds':float(t),'frame':j,'seconds':actual,'sample':pos,'sourceEvent':source_event})
    for e in motion_events:
        kind=e.get('kind','frog-kick')
        if kind in ('frog-kick','kick','knee'):
            deg=float(e.get('degrees',e.get('angleDegrees',30)))
            if deg:hit('frog-kick',float(e['start']),small_kick(deg),e)
        elif kind=='spark':hit('spark',float(e['start']),a.MA.lowpassed_noise(.055,4800,1300)*.045,e)
        elif kind=='stack-tap':hit('stack-tap',float(e['start']),a.click()*.035,e)
        else:raise ValueError('Unrecognized shared SFX event '+kind)
    for q,cap in cues:
        if q.get('score'):
            score=q['score'];hit('score',at(q['masterRow'],score['at']),a.score_sfx()*.12,{'cue':q['diagram'],'score':score})
    gain=1.;level=None;peak=None;final=None;continuity_fills=[]
    # Same gentle short-window peak limiting policy as the accepted C-1 mix.
    # No resampling, time stretching, voice regeneration or cue edits.
    for continuity_round in range(3):
        mix=voice+music+fx
        for iteration in range(16):
            # The shared limiter's default -1.5dB ceiling reduces unnecessary
            # peak compression versus the earlier -3dB attempt.
            final=a.soft_limit(mix*gain,ceil=10**(-1.5/20))
            a.write(paths['mixed'],final);level,peak=a.loudness(paths['mixed'])
            print('normalization',continuity_round,iteration+1,'LUFS',level,'peak',peak,flush=True)
            if abs(level+14)<.3:break
            gain*=10**((-14-level)/20)
        quiet=a.quiet_runs(a.read(paths['mixed']))
        if not quiet:break
        # Deep ducking can also mute the ambience just before a soft consonant.
        # Restore only these measured gaps with the same existing pad, smoothly
        # crossfaded. No voice, speech clock or acceptance threshold is altered.
        for start,end in quiet:
            lo=max(0,round((start-.10)*SR));hi=min(n,round((end+.10)*SR));m=hi-lo
            bed=a.pad([a.hz(48),a.hz(55),a.hz(64)],m,t0=lo/SR)
            fade=np.minimum(1,np.minimum(np.arange(m)/(.08*SR),(m-1-np.arange(m))/(.08*SR)))
            core0=max(0,round(start*SR)-lo);core1=min(m,round(end*SR)-lo)
            current=rms(final[lo+core0:lo+core1]);desired=10**(-31/20)
            amplitude=max(0,(desired-current)/max(1e-6,rms(bed[core0:core1])*gain))
            music[lo:hi]+=bed*fade*amplitude
            continuity_fills.append({'start':start,'end':end,'padGain':amplitude,'targetGapFloorDbfs':-31,'round':continuity_round})
    assert abs(level+14)<.3,(level,gain)
    # Apply the exact output limiting envelope to each stem. Their float sum
    # is the actual mixed signal, so SNR is not a pre-normalization estimate.
    scale=np.full(n,gain);nz=np.abs(mix)>1e-12;scale[nz]=final[nz]/mix[nz]
    voice_stem=voice*scale;music_stem=music*scale;fx_stem=fx*scale
    assert np.max(np.abs(voice_stem+music_stem+fx_stem-final))<1e-10
    a.write(paths['voice'],voice_stem);a.write(paths['bgm'],music_stem);a.write(paths['sfx'],fx_stem)
    # Actual written PCM stems, not in-memory estimates, are measured.
    measured=measure_windows(a.read(paths['voice']),a.read(paths['bgm']),presence_reference=voice)
    assert measured['medianDb']>=15 and measured['p10Db']>=10,{k:v for k,v in measured.items() if k!='windows'}
    actual=a.read(paths['mixed']);quiet=a.quiet_runs(actual)
    assert quiet==[],quiet
    assert all(sha(p)==h for p,h in protected.items()),'Frozen input changed during mixing'
    stem_sum=a.read(paths['voice'])+a.read(paths['bgm'])+a.read(paths['sfx'])
    pcm_error=float(np.max(np.abs(stem_sum-actual)))
    assert pcm_error<=4/32768
    metadata={
      'id':CID,'durationSeconds':duration,'sampleRate':SR,'channels':1,'integrated_lufs':level,'peak_dbfs':peak,'gain':gain,'outputSamplePeakCeilingDbfs':-1.5,
      'quiet_runs_below_-35dB_0.25s':quiet,'music_spans':spans,'bright':0,'solveBoost':1,
      'voiceDuckingDepth':.90,'bedDuckingDepth':.75,'gateReference':'25th percentile of non-silent smoothed source voice envelope',
      'extraMusicReductionDb':extra_db,'extraMusicGain':extra_gain,'continuityGapFills':continuity_fills,
      'voiceBgmDifferenceMedianDb':measured['medianDb'],'voiceBgmDifferenceP10Db':measured['p10Db'],
      'voiceBgmMeasurement':{k:v for k,v in measured.items() if k!='windows'},'sfx':hits,
      'motionEvents':str(events_file),'motionEventsSha256':sha(events_file),
      'frozenSourceVoice':str(SOURCE/(CID+'.voice.wav')),'frozenSourceVoiceSha256':sha(SOURCE/(CID+'.voice.wav')),
      'sourceAndScriptAndSubtitleClocksUnchanged':True,'speechRegenerated':False,'timeStretching':False,'earListeningPerformed':False,
      'voiceProcessing':'Only the common output gain/short-window peak-limiter envelope is applied during mixing; frozen voice PCM and timing remain unchanged at source.',
      'stemSumMaxPcmError':pcm_error,'musicSource':'Locally synthesized original procedural tones; no downloaded music or third-party recording.',
      'introPolicy':'Continuous very quiet BGM per S2/common6.5. Master row1 SFX-only wording is a reported instruction conflict; no voice/subtitles were added.',
      'paths':{k:str(v) for k,v in paths.items()},'limitedSampleFraction':float(np.mean(scale<gain*.99)),
    }
    paths['windows'].write_text(json.dumps(measured,ensure_ascii=False,indent=2))
    paths['levels'].write_text(json.dumps(metadata,ensure_ascii=False,indent=2))
    paths['mix'].write_text(json.dumps({'output':str(paths['mixed']),'mixSha256':sha(paths['mixed']),'sourceVoiceSha256':metadata['frozenSourceVoiceSha256'],'frozenSourceUnchanged':True,'files':{k:{'path':str(v),'sha256':sha(v)} for k,v in paths.items() if k not in ('mix',)}},ensure_ascii=False,indent=2))
    for p in paths.values():
        dest=BACKUP/p.name
        if dest.exists():raise RuntimeError('Refuse backup overwrite '+str(dest))
        shutil.copy2(p,dest)
    print(json.dumps({'mixed':str(paths['mixed']),'integrated_lufs':level,'peak_dbfs':peak,'quietRuns':quiet,'voiceBgmMedianDb':measured['medianDb'],'voiceBgmP10Db':measured['p10Db'],'sfxCount':len(hits),'frozenVoiceUnchanged':True,'earListeningPerformed':False,'backup':str(BACKUP)},ensure_ascii=False,indent=2))

if __name__=='__main__':main()
