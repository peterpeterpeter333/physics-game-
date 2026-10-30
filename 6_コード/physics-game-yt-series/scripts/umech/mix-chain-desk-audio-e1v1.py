"""E-1 private mix. Supplied WAV and .voice.wav are never overwritten."""
import sys,os,json,hashlib
from pathlib import Path
import numpy as np
sys.path.insert(0,str(Path(__file__).parent))
import desk_audio_lib as a

def main(cid='ys-chain-e1v1'):
    cache=a.CACHE;source=cache/(cid+'.voice.wav');source=source if source.exists() else cache/(cid+'.wav')
    voicehash=hashlib.sha256(source.read_bytes()).hexdigest();voice=a.read(source);n=len(voice);dur=n/a.SR
    data=json.loads((cache/'blender/data.json').read_text());cues=data['cues'];C={c['key']:c for c in cues}
    def T(key,word):return next(w['time'] for w in C[key]['wordEvents'] if word in w['word'])
    def S(key):return C[key]['start']
    plan=json.loads((cache/'plan.json').read_text())[0]
    Q={q['diagram'].replace('ce1v1-',''):q for s in plan['scenes'] for q in s['cues']}
    times={name:(min(c['start'] for c in cues if c['music']==name),max(c['end'] for c in cues if c['music']==name)) for name in ['solve','solved','dark','toll','after']}
    solve,solved,dark,toll,after=[times[x] for x in ['solve','solved','dark','toll','after']]
    assert solve[0]<solved[0]<dark[0]<toll[0]<after[0]
    # Accident: a quiet low pad and distant sea. No marimba, comic sound, or score flourish.
    mus=np.zeros(n);acc_end=S('two:need')
    # No symmetric detuning here: common detuning creates slow amplitude zeros.
    opening=a.pad([110,146.83,220],n,det=0)*.024
    opening*=a.env_ramp(n,[(0,1),(acc_end,1),(acc_end+2,0),(dur,0)])
    mus+=opening
    base=a.base_music(n,acc_end,solve[0]);base*=a.env_ramp(n,[(0,0),(acc_end,0),(acc_end+2,1),(dur,1)]);mus+=a.duck_under_voice(base,voice)
    del base,opening
    mus+=a.duck_under_voice(a.base_music(n,solve[0],solved[0]+.3,bright=1)*1.25,voice)
    mus+=a.duck_under_voice(a.solved_music(n,solved[0]),voice)
    mus+=a.duck_under_voice(a.base_music(n,solved[0]+1.6,dark[0]+.2)*.9,voice)
    mus+=a.duck_under_voice(a.dark_music(n,dark[0],after[1]),voice)
    mus+=a.duck_under_voice(a.toll_music(n,C['dr:cause']['voiceEnd']+.15)*.45,voice)
    mus+=a.duck_under_voice(a.after_music(n,after[1]-1.5,dur+1),voice)
    # Quiet floor remains throughout pauses and the last hold; no fade into digital silence.
    mus+=a.pad([130.81,196],n,det=.15)*.012*a.env_ramp(n,[(0,0),(acc_end,0),(acc_end+2,1),(dur,1)])
    fx=np.zeros(n);hits=[]
    def hit(name,t,wave):a.add(fx,wave,t);hits.append({'sound':name,'time':round(t,3)})
    hit('accident_low_bell',T('fog:wreck','沈み'),a.bell_low(82.4,2.4)*.08)
    hit('score',T('lat:50','50度'),a.score_sfx()*.13)
    hit('score_low',T('pen:judge','負けた'),a.tone(196,.35,.16,.006)*.10)
    hit('torch_click',T('lon:torch','懐中電灯'),a.click()*.10)
    # Distant wave bed and occasional low wood creak during the first six lines.
    sea=a.MA.lowpassed_noise(acc_end,80,360);sea*=.003*(.6+.4*np.sin(np.arange(len(sea))/a.SR*.35));a.add(fx,sea,0)
    for tm in [7,18,29]:hit('ship_creak',tm,a.tone(97,.9,.35,.04,partials=((1,1),(1.06,.3)))*.012)
    for j in range(2):hit('sleep_breath',T('tz:3am','朝の3時')+.4+j*1.4,a.MA.lowpassed_noise(.8,100,700)*np.sin(np.linspace(0,np.pi,round(.8*a.SR)))**2*.025)
    hit('rope',T('dr:log','綱'),a.MA.lowpassed_noise(2,500,1600)*.016)
    hit('sand',T('dr:log','砂時計'),a.MA.lowpassed_noise(2.1,2000,5000)*.012)
    for j in range(13):hit('uneven_pendulum',T('pen:sway','波')+j*.32+.12*np.sin(j*1.7),a.click()*(.06+.04*(j%3==0)))
    for j in range(2):hit('coin',T('prize:act','大きな賞金')+.55+j*.18,a.tone(1700+j*340,.35,.08,.001,partials=((1,1),(2.73,.25)))*.08)
    for c in cues:
        if c['row']<=6:continue
        for name,when in Q[c['key']].get('sfx',[]):
            tm=c['voiceEnd']+float(when[2:]) if isinstance(when,str) and when.startswith('e+') else c['start']+float(when)
            hit(name,tm,a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name,.4)*.65)
    mix=voice+mus+fx;out=cache/(cid+'.mix.wav')
    info=a.normalize_lufs(mix,out);mixed=a.read(out);quiet=a.quiet_runs(mixed)
    assert hashlib.sha256(source.read_bytes()).hexdigest()==voicehash,'Supplied voice changed'
    info.update({'quiet_runs_below_-35dB_0.25s':quiet,'music_spans':times,'accident_pad_only':[0,acc_end],'sfx':hits,'source':str(source),'source_sha256':voicehash,'output':str(out),'duration':dur,'ear_review':False})
    (cache/(cid+'.levels.json')).write_text(json.dumps(info,ensure_ascii=False,indent=1))
    (cache/(cid+'.mix.json')).write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voice':source.name,'voiceSHA256':voicehash,'output':out.name},indent=1))
    print(json.dumps(info,ensure_ascii=False,indent=1))
    assert abs(info['integrated_lufs']+14)<=.5
    assert len(quiet)==0,quiet
if __name__=='__main__':main(sys.argv[1] if len(sys.argv)>1 else 'ys-chain-e1v1')
