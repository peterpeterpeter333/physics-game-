"""Part A only: supplied voice byte-identical; synthesized quiet music and cue-timed SFX."""
import os, json, hashlib, subprocess
from pathlib import Path
import numpy as np
import desk_audio_lib as a
CID='ys-chain-d1a'; CACHE=a.CACHE
assert str(CACHE)=='/private/tmp/ys/ys-chain-d1a_gpt_20261026'
mix_out=CACHE/f'{CID}.wav'
if mix_out.exists():
    assert os.environ.get('D1A_REMIX')=='1', 'Existing mix is preserved unless this generated mix is explicitly revised'
    previous=json.loads((CACHE/f'{CID}.mix.json').read_text())
    assert not mix_out.is_symlink()
    assert hashlib.sha256(mix_out.read_bytes()).hexdigest()==previous['mixSha256']
    backup=CACHE/f'{CID}.mix-before-floor_gpt_20261026.wav'
    if not backup.exists():
        import shutil
        shutil.copyfile(mix_out,backup)
SOURCE=Path(__file__).resolve().parents[1]/'blender/desk_assets/d1a'
source=SOURCE/f'{CID}.wav'; voicepath=CACHE/f'{CID}.voice.wav'
assert hashlib.sha256(voicepath.read_bytes()).digest()==hashlib.sha256(source.read_bytes()).digest()
voice=a.read(voicepath); n=len(voice); duration=n/a.SR
DATA=json.loads((CACHE/'blender/data.json').read_text());K={c['key']:c for c in DATA['cues']}
plan=json.loads((CACHE/'plan.json').read_text())[0]; qs={q['diagram'].replace('cd1a-',''):q for s in plan['scenes'] for q in s['cues']}
def S(k):return K[k]['start']
def E(k):return K[k]['end']
def W(k,label):
    found=[e['time'] for e in K[k]['wordEvents'] if e['word']==label];assert len(found)==1,(k,label);return found[0]
def make():
    sv=(S('can:fill'),E('can:mio'));sd=(S('air:pusher'),E('air:pusher'));dk=(S('guericke:pull'),E('guericke:push'));tl=(S('size:pull'),E('size:pull'));af=(S('next:mio'),E('next:mio'))
    music=a.base_music(n,0,sv[0]);music+=1.25*a.base_music(n,sv[0],sd[0]+.3,bright=1)
    music+=a.solved_music(n,sd[0]);music+=.9*a.base_music(n,sd[0]+1.6,dk[0]+.2)
    dark=a.dark_music(n,dk[0],af[1]);dark*=a.env_ramp(n,[(0,0),(dk[0],0),(dk[0]+.8,1),(tl[0],1),(tl[0]+1,.65),(af[0],.65),(af[1],.45),(duration,.45)])
    music+=dark;voice_end=tl[1]-.12-float(qs['size:pull'].get('pause',0));music+=.28*a.toll_music(n,voice_end+.15)
    music+=a.base_music(n,af[1]-1.5,duration+.1)*a.env_ramp(n,[(0,1),(duration-1,1),(duration,.35)])
    music+=.035*a.pad([a.hz(48),a.hz(55),a.hz(60)],n)
    music=a.duck_under_voice(music,voice,gain=.20)
    # A soft sustained chord remains under dark/toll transitions too. Narration is untouched.
    music+=.024*a.pad([a.hz(48),a.hz(55),a.hz(60)],n)
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
    out=CACHE/f'{CID}.wav';levels=a.normalize_lufs(voice+music+fx,out,target=-13.7)
    limited=CACHE/f'{CID}.limited.wav'
    subprocess.run([a.FF,'-y','-v','error','-i',str(out),'-af','aresample=96000,alimiter=limit=0.75:attack=5:release=50:level=false:latency=true,aresample=24000','-c:a','pcm_s16le',str(limited)],check=True)
    os.replace(limited,out);levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    correction=min(-14-levels['integrated_lufs'],-1.55-levels['peak_dbfs'])
    if correction>0:a.write(out,a.read(out)*10**(correction/20));levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    levels['quiet_runs_below_-35dB_0.25s']=a.quiet_runs(a.read(out));levels['source_voice_sha256']=hashlib.sha256(source.read_bytes()).hexdigest();levels['music_spans']={'solve':sv,'solved':sd,'dark':dk,'toll':tl,'after':af};levels['sfx']=hits;levels['audition']='耳での確認はしていない'
    (CACHE/f'{CID}.levels.json').write_text(json.dumps(levels,ensure_ascii=False,indent=1));(CACHE/f'{CID}.mix.json').write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voiceSha256':levels['source_voice_sha256']},indent=1))
    print(json.dumps({k:v for k,v in levels.items() if k!='sfx'},ensure_ascii=False,indent=1));print('sfx',len(hits))
if __name__=='__main__':make()
