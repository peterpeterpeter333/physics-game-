"""A S3 only: immutable voice, C-1 quiet BGM ducking, original cue-timed SFX."""
import os, json, hashlib, subprocess, math
from pathlib import Path
import numpy as np
import desk_audio_lib as a
CID='ys-chain-d1a'; CACHE=a.CACHE
assert str(CACHE)=='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028'
assert CACHE.is_dir() and not CACHE.is_symlink()
OUTPUTS=['.s3c.mixed.wav','.s3c.bgm.wav','.s3c.levels.json','.s3c.mix.json','.s3c.voice-bgm.json','.s3c.limited.wav']
for suffix in OUTPUTS:
    assert not (CACHE/(CID+suffix)).exists(), 'Preserve existing S3 output: '+suffix
PROTECTED={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in
    [CACHE/x for x in ['plan.json',CID+'.json','phrase-times.json','blender/data.json',CID+'.voice.wav',CID+'.wav']] if p.exists()}
SOURCE=Path(__file__).resolve().parents[1]/'blender/desk_assets/d1a'
source=SOURCE/f'{CID}.wav'; voicepath=CACHE/f'{CID}.voice.wav'
assert hashlib.sha256(voicepath.read_bytes()).digest()==hashlib.sha256(source.read_bytes()).digest()
voice=a.read(voicepath); n=len(voice); duration=n/a.SR
DATA=json.loads((CACHE/'blender/data.json').read_text());K={c['key']:c for c in DATA['cues']}
WORDMAP=CACHE/'word-events-actual_s3_20261028.json'; ACTUAL=json.loads(WORDMAP.read_text()); WORDSHA=hashlib.sha256(WORDMAP.read_bytes()).hexdigest()
plan=json.loads((CACHE/'plan.json').read_text())[0]; qs={q['diagram'].replace('cd1a-',''):q for s in plan['scenes'] for q in s['cues']}
def S(k):return K[k]['start']
def E(k):return K[k]['end']
def W(k,label):
    found=[e for e in K[k]['wordEvents'] if e['word']==label];assert len(found)==1,(k,label)
    v=ACTUAL[k][label]['time']; assert math.isfinite(v); return v
def vgate(voice):
    # Exact C-1 Claude gate: 50ms RMS, 400ms smoothing, voiced25th percentile.
    e=np.sqrt(a.moving_average(voice**2,int(.05*a.SR)));e=a.moving_average(e,int(.4*a.SR))
    ref=np.percentile(e[e>1e-4],25) if (e>1e-4).any() else 1
    return np.clip(e/ref,0,1)
def duck_deep(music,voice,gain=.18,depth=.90):
    return music*gain*(1-depth*vgate(voice))
def bed_duck(voice):
    return 1-.75*vgate(voice)
def measure_voice_bgm(stem):
    bgm=a.read(stem);assert len(bgm)==len(voice)
    rows=[]
    for i in range(0,len(voice),a.SR):
        v,b=voice[i:i+a.SR],bgm[i:i+a.SR]
        if len(v)<a.SR//4:continue
        vr,br=float(np.sqrt(np.mean(v.astype(float)**2))),float(np.sqrt(np.mean(b.astype(float)**2)))
        vd,bd=20*math.log10(max(vr,1e-12)),20*math.log10(max(br,1e-12))
        fraction=float(np.mean(np.abs(v)>10**(-45/20)))
        rows.append(dict(start=i/a.SR,duration=len(v)/a.SR,voiceDbfs=vd,bgmDbfs=bd,differenceDb=vd-bd,voicePresent=vd>-45 and fraction>=.10))
    present=[r['differenceDb'] for r in rows if r['voicePresent']];assert present
    report=dict(method='Aligned1s RMS, supplied voice-only WAV versus written BGM-only WAV',measurementDomain='pre-master components, no separate normalization',voicePresentRule='RMS>-45dBFS and>=10% samples>-45dBFS',medianVoiceMinusBgmDb=float(np.median(present)),p10VoiceMinusBgmDb=float(np.percentile(present,10)),requiredMedianDb=15,musicDuckDepth=.90,bedDuckDepth=.75,voiceReferencePercentile=25,fastSolvePattern=False,solveGainBoost=False,earsPerformed=False,windows=rows)
    report['pass']=report['medianVoiceMinusBgmDb']>=15
    (CACHE/f'{CID}.s3c.voice-bgm.json').write_text(json.dumps(report,ensure_ascii=False,indent=1))
    assert report['pass'], report['medianVoiceMinusBgmDb']
    return report
def make():
    sv=(S('can:fill'),E('can:mio'));sd=(S('air:pusher'),E('air:pusher'));dk=(S('guericke:pull'),E('guericke:push'));tl=(S('size:pull'),E('size:pull'));af=(S('next:mio'),E('next:mio'))
    music=a.base_music(n,0,sv[0]);music+=a.base_music(n,sv[0],sd[0]+.3,bright=0)
    music+=a.solved_music(n,sd[0]);music+=.9*a.base_music(n,sd[0]+1.6,dk[0]+.2)
    dark=a.dark_music(n,dk[0],af[1]);dark*=a.env_ramp(n,[(0,0),(dk[0],0),(dk[0]+.8,1),(tl[0],1),(tl[0]+1,.65),(af[0],.65),(af[1],.45),(duration,.45)])
    music+=dark;voice_end=tl[1]-.12-float(qs['size:pull'].get('pause',0));music+=.28*a.toll_music(n,voice_end+.15)
    music+=a.base_music(n,af[1]-1.5,duration+.1)*a.env_ramp(n,[(0,1),(duration-1,1),(duration,.35)])
    bed=.024*a.pad([a.hz(48),a.hz(55),a.hz(60)],n)
    music=duck_deep(music,voice,.18,.90)+bed*bed_duck(voice)
    stem=CACHE/f'{CID}.s3c.bgm.wav';a.write(stem,music)
    comparison=measure_voice_bgm(stem)
    fx=np.zeros(n);hits=[];rng=np.random.default_rng(441)
    def hit(name,t,x):
        if 0<=t<duration:a.add(fx,x,t);hits.append({'name':name,'time':round(float(t),4)})
    def click():return .065*a.click()
    def hiss(d=.8):return .035*a.MA.lowpassed_noise(d,1500,6000)
    def water(d=.7):return .035*a.MA.lowpassed_noise(d,500,3200)
    for key,c in K.items():
        for name,when in qs[key].get('sfx',[]) or []:
            ve=c['end']-.12-float(qs[key].get('pause',0));t=ve+float(when[2:]) if isinstance(when,str) and when.startswith('e+') else c['start']+float(when)
            hit(name,t,a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name,.4)*.5)
    for t in np.arange(S('mine:open')+1.3,E('mine:water'),2.3):hit('water_drop',t,.055*a.tone(760,.16,.06,.001,partials=((1,1),(1.7,.3))))
    for t in np.arange(W('gin:horse','人や馬'),E('gin:closed'),.7):hit('hoof',t,.04*a.tone(160,.1,.035,.001,partials=((1,1),(2.9,.3))))
    hit('rope_winding',W('gin:drum','巻き取られて'),.04*a.whirr(1.1));hit('bucket_water',W('gin:drum','引き上げられる'),water(.7))
    for i in range(4):hit('assembly',W('nc:install','据えつけました')+.3*i,.08*a.click())
    hit('cold_spray',W('myth:fact','吹きこんで'),.055*a.MA.lowpassed_noise(.8,600,5000))
    hit('expansion',W('shrink:spoon','ふくらみます'),hiss(.6));hit('shrink',W('shrink:back','縮みます'),hiss(.45))
    hit('boiling',W('can:fill','温めます'),.05*a.MA.lowpassed_noise(1.4,400,2200));hit('air_leaving_can',W('can:fill','追い出して'),hiss(.8))
    hit('water_seal',W('can:flip','つけると'),water(.35))
    crush=(rng.normal(0,1,int(.22*a.SR))*np.exp(-np.arange(int(.22*a.SR))/(a.SR*.045)))*.10
    hit('can_crush',W('can:crush','ぐしゃっと'),crush*10**(4/20))
    hit('straw',W('straw:push','押し上げて'),water(.6))
    for k,label in [('air:1kg','1キログラム'),('air:1kg','100キログラム分'),('size:2t','2トン分')]:hit('weight',W(k,label),.12*a.tone(90,.3,.09,.001,partials=((1,1),(1.4,.3))))
    hit('condense',W('cyl:likecan','冷やす'),water(.55));hit('piston_down',W('cyl:likecan','ピストンを押します'),.04*a.tone(230,.5,.2,.05,partials=((1,1),(3,.15))))
    hit('score_low',W('gin:closed','閉じて（得点板 水 1−0 人）'),.17*a.bell_low(165,.7))
    # New Guericke pump: doors visibly open/close while air travels out of the sphere.
    hit('pump_handle',W('guericke:pull','取っ手を引く'),.05*a.whirr(.4));hit('inlet_flap',W('guericke:pull','押し開けて'),click());hit('air_inlet',W('guericke:pull','入ってきます'),hiss(.45))
    hit('pump_handle',W('guericke:push','取っ手を押す'),.05*a.whirr(.4));hit('inlet_close',W('guericke:push','入口の弁は閉じ'),click());hit('air_outlet',W('guericke:push','出ていきます'),hiss(.6))
    valve=W('size:pull','空気を入れる');hit('valve_hiss',valve,.08*a.MA.lowpassed_noise(.4,900,5000));hit('hemisphere_pop',valve+.55,.10*a.tone(440,.15,.04,.001,partials=((1,1),(2.3,.3))));hit('horse_stumble',valve+.68,.07*a.tone(180,.15,.05,.001))
    out=CACHE/f'{CID}.s3c.mixed.wav';levels=a.normalize_lufs(voice+music+fx,out,target=-13.7)
    limited=CACHE/f'{CID}.s3c.limited.wav'
    subprocess.run([a.FF,'-y','-v','error','-i',str(out),'-af','aresample=96000,alimiter=limit=0.75:attack=5:release=50:level=false:latency=true,aresample=24000','-c:a','pcm_s16le',str(limited)],check=True)
    os.replace(limited,out);levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    correction=min(-14-levels['integrated_lufs'],-1.55-levels['peak_dbfs'])
    if correction>0:a.write(out,a.read(out)*10**(correction/20));levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    levels['quiet_runs_below_-35dB_0.25s']=a.quiet_runs(a.read(out));levels['source_voice_sha256']=hashlib.sha256(source.read_bytes()).hexdigest();levels['music_spans']={'solve':sv,'solved':sd,'dark':dk,'toll':tl,'after':af};levels['sfx']=hits;levels['audition']='耳での確認はしていない'
    (CACHE/f'{CID}.s3c.mix.json').write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voiceSha256':levels['source_voice_sha256'],'bgmStemSha256':hashlib.sha256(stem.read_bytes()).hexdigest(),'medianVoiceMinusBgmDb':comparison['medianVoiceMinusBgmDb'],'sampleRate':a.SR,'samples':n,'audioDuration':duration,'BGMOnlyRevision':True,'speechRegenerated':False,'actualWordEventsSha256':WORDSHA},indent=1))
    levels['bgm_stem']=str(stem);levels['median_voice_minus_bgm_db']=comparison['medianVoiceMinusBgmDb']
    (CACHE/f'{CID}.s3c.levels.json').write_text(json.dumps(levels,ensure_ascii=False,indent=1))
    assert abs(levels['integrated_lufs']+14)<.3,levels
    assert levels['quiet_runs_below_-35dB_0.25s']==[],levels['quiet_runs_below_-35dB_0.25s']
    assert len(a.read(out))==n,'Mix duration/sample count differs from supplied voice'
    assert all(hashlib.sha256(Path(p).read_bytes()).hexdigest()==digest for p,digest in PROTECTED.items()),'An existing input changed'
    assert hashlib.sha256(WORDMAP.read_bytes()).hexdigest()==WORDSHA,'Actual word map changed during mixing'
    print(json.dumps({k:v for k,v in levels.items() if k!='sfx'},ensure_ascii=False,indent=1));print('sfx',len(hits))
if __name__=='__main__':make()

