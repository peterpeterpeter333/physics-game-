"""D-1 music and physical SFX. Read the supplied voice, create only D-1 output."""
import os,json,hashlib,shutil,re,subprocess
from pathlib import Path
import numpy as np
import desk_audio_lib as a
CID='ys-chain-d1v1';CACHE=a.CACHE
DATA=json.loads((CACHE/'blender/data.json').read_text());K={c['key']:c for c in DATA['cues']}
SOURCE=Path(__file__).resolve().parents[1]/'blender/desk_assets/d1v1'
source=SOURCE/f'{CID}.wav';voicepath=CACHE/f'{CID}.voice.wav'
if not voicepath.exists():shutil.copy2(source,voicepath)
assert hashlib.sha256(voicepath.read_bytes()).digest()==hashlib.sha256(source.read_bytes()).digest()
voice=a.read(voicepath);n=len(voice);duration=n/a.SR
plan=json.loads((CACHE/'plan.json').read_text())[0];qs={q['diagram'].replace('cd1v1-',''):q for s in plan['scenes'] for q in s['cues']};pt=json.loads((CACHE/'phrase-times.json').read_text())
def at(key,word,occ=0):return K[key]['start']+a.phrase_time(qs[key]['subtitle'],word,occ)
def word(key,label):
    found=[x['time'] for x in K[key]['wordEvents'] if x['word']==label];assert len(found)==1,(key,label);return found[0]
def make():
    sv=(K['eng:steam']['start'],K['eng:down']['end']);sd=(K['eng:repeat']['start'],K['eng:repeat']['end']);dk=(K['next:waste']['start'],K['next:waste']['end']);tl=(K['next:100']['start'],K['next:100']['end']);af=(K['next:who']['start'],K['next:who']['end'])
    music=a.base_music(n,0,sv[0]);music+=1.25*a.base_music(n,sv[0],sd[0]+.3,bright=1)
    music+=a.solved_music(n,sd[0]);music+=.9*a.base_music(n,sd[0]+1.6,dk[0]+.2)
    dark=a.dark_music(n,dk[0],af[1]);dark*=a.env_ramp(n,[(0,0),(dk[0],0),(dk[0]+.8,1),(tl[0],1),(tl[0]+1,.65),(af[0],.65),(af[1],.45),(duration,.45)])
    music+=dark;voice_end=tl[1]-.12-float(qs['next:100'].get('pause',0));music+=.28*a.toll_music(n,voice_end+.15)
    music+=a.base_music(n,af[1]-1.5,duration+.1)*a.env_ramp(n,[(0,1),(duration-1,1),(duration,.35)])
    # A quiet sustained floor keeps the provided pauses audible through all cross-fades.
    music+=.035*a.pad([a.hz(48),a.hz(55),a.hz(60)],n)
    music=a.duck_under_voice(music,voice,gain=.20);fx=np.zeros(n);hits=[];rng=np.random.default_rng(441)
    def hit(name,t,x):a.add(fx,x,t);hits.append({'name':name,'time':round(t,4)})
    for key,c in K.items():
        for name,when in qs[key].get('sfx',[]):
            ve=c['end']-.12-float(qs[key].get('pause',0));t=ve+float(when[2:]) if isinstance(when,str) and when.startswith('e+') else c['start']+float(when)
            hit(name,t,a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name,.4)*.5)
    for t in np.arange(1.3,16,2.3):hit('water_drop',t,.055*a.tone(760,.16,.06,.001,partials=((1,1),(1.7,.3))))
    for t in np.arange(18,26,.7):hit('hoof',t,.04*a.tone(160,.1,.035,.001,partials=((1,1),(2.9,.3))))
    for i in range(4):hit('assembly',word('nc:install','据えつけました')+.3*i,.08*a.click())
    for key,label in [('myth:fact','吹きこんで'),('eng:cool','吹きこみます')]:hit('cold_spray',word(key,label),.055*a.MA.lowpassed_noise(.8,600,5000))
    hit('boiling',word('can:heat','温め'),.05*a.MA.lowpassed_noise(1.4,400,2200))
    crush=(rng.normal(0,1,int(.22*a.SR))*np.exp(-np.arange(int(.22*a.SR))/(a.SR*.045)))*.10
    # 4 dB louder than the other metal impact, as specified.
    hit('can_crush',word('can:crush','ぐしゃっと'),crush*10**(4/20))
    for key,label in [('air:1kg','1キログラム'),('air:1kg','100キログラム分'),('size:2t','2トン分')]:hit('weight',word(key,label),.12*a.tone(90,.3,.09,.001,partials=((1,1),(1.4,.3))))
    hit('mechanism',word('eng:down','押し下げます'),.045*a.tone(230,.5,.2,.05,partials=((1,1),(3,.15))))
    hit('pump_water',word('eng:down','地上へ'),.035*a.MA.lowpassed_noise(.7,500,3200))
    for t in np.arange(K['eng:repeat']['start'],K['eng:mio2']['end'],2):
        hit('mechanism',t,.045*a.tone(230,.5,.2,.05,partials=((1,1),(3,.15))));hit('pump_water',t+.9,.035*a.MA.lowpassed_noise(.7,500,3200))
    for key,nd in [('mine:horse','トジテ'),('eng:repeat','クリカエ'),('next:spread','クミダセル')]:
        hit('score_low' if key=='mine:horse' else 'score',at(key,nd),.17*a.bell_low(165,.7) if key=='mine:horse' else .22*a.score_sfx())
    valve=word('size:pull','空気を入れる');hit('valve_hiss',valve,.08*a.MA.lowpassed_noise(.4,900,5000));hit('hemisphere_pop',valve+.55,.10*a.tone(440,.15,.04,.001,partials=((1,1),(2.3,.3))))
    hit('horse_stumble',valve+.68,.07*a.tone(180,.15,.05,.001))
    out=CACHE/f'{CID}.wav';levels=a.normalize_lufs(voice+music+fx,out,target=-13.7)
    # Limit at four times the sample rate to catch intersample peaks as well.
    limited=CACHE/f'{CID}.limited.wav'
    subprocess.run([a.FF,'-y','-v','error','-i',str(out),'-af','aresample=96000,alimiter=limit=0.75:attack=5:release=50:level=false:latency=true,aresample=24000','-c:a','pcm_s16le',str(limited)],check=True)
    os.replace(limited,out);levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    correction=min(-14-levels['integrated_lufs'],-1.55-levels['peak_dbfs'])
    if correction>0:
        a.write(out,a.read(out)*10**(correction/20));levels['integrated_lufs'],levels['peak_dbfs']=a.loudness(out)
    levels['quiet_runs_below_-35dB_0.25s']=a.quiet_runs(a.read(out));levels['source_voice_sha256']=hashlib.sha256(source.read_bytes()).hexdigest();levels['music_spans']={'solve':sv,'solved':sd,'dark':dk,'toll':tl,'after':af};levels['sfx']=hits;levels['audition']='耳での確認はしていない'
    (CACHE/f'{CID}.levels.json').write_text(json.dumps(levels,ensure_ascii=False,indent=1));(CACHE/f'{CID}.mix.json').write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voiceSha256':levels['source_voice_sha256']},indent=1));print(json.dumps(levels,ensure_ascii=False,indent=1))
if __name__=='__main__':make()
