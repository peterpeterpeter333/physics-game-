"""C-1：声の元ファイルを変えず、新しいmixed.wavへ音楽と物の音を合成。"""
import os,sys,json,hashlib
from pathlib import Path
import numpy as np
import desk_audio_lib as a

def main(cid='ys-chain-c1v1'):
    cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'));D=json.loads((cache/'blender/data.json').read_text());plan=json.loads((cache/'plan.json').read_text())[0];timed=json.loads((cache/(cid+'.json')).read_text());source=cache/(cid+'.wav');voicecopy=cache/(cid+'.voice.wav')
    if not voicecopy.exists():voicecopy.write_bytes(source.read_bytes())
    voice=a.read(voicecopy);n=len(voice);dur=n/a.SR
    cues=[q for s in plan['scenes'] for q in s['cues']];caps=[c for s in timed['scenes'] for c in s['captions']];K={q['diagram'].replace('cc1v1-',''):(q,c) for q,c in zip(cues,caps)}
    def span(name):
        ix=[i for i,q in enumerate(cues) if q.get('music')==name];return [caps[ix[0]]['start'],caps[ix[-1]]['end']]
    sv,sd,dk,tl,af=[span(name) for name in ['solve','solved','dark','toll','after']]
    music=a.base_music(n,0,sv[0])+a.base_music(n,sv[0],sd[0]+.3,bright=1)*1.25+a.solved_music(n,sd[0])+a.base_music(n,sd[0]+1.6,dk[0]+.2)*.9
    a.add(music,.8*a.MA.sfx('chime'),sd[0])
    dark=a.dark_music(n,dk[0],af[1]);dark*=a.env_ramp(n,[(0,0),(dk[0],0),(dk[0]+.8,1),(tl[0]+1,.6),(af[0],.6),(af[1],.45),(af[1]+.1,0)])
    music+=dark
    # 小さな低い鐘は「ありませんでした」の声の後。
    music+=a.toll_music(n,D['effects']['toll'])*.40
    music+=a.after_music(n,af[0],dur+.1)
    music=a.duck_under_voice(music,voice,.20)
    # 声が無い間も基調和音を続ける。最後の0.10秒だけ短く閉じる。
    bed=.040*a.pad([a.hz(48),a.hz(55),a.hz(64)],n)
    music+=bed
    music*=a.env_ramp(n,[(0,1),(dur-.10,1),(dur,0)])
    fx=np.zeros(n);hits=[]
    def hit(name,t,x):a.add(fx,x,t);hits.append([name,round(t,4)])
    for q,c in zip(cues,caps):
        ve=c['end']-.12-float(q.get('pause') or 0)
        for name,at in q.get('sfx',[]):
            tt=ve+float(at[2:]) if isinstance(at,str) else c['start']+float(at);hit(name,tt,a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name,.4))
        if q.get('score'):
            tt=c['start']+a.phrase_time(q['subtitle'],q['score']['at'])
            sound=a.score_sfx()*.22
            if q['score']['make']==1:sound=a.tone(523.25,.45,.15,.003)*.12
            hit('score',tt,sound)
    # 盤が一目盛り動くたびのカチ。resetは入れ直す速いカチカチ。
    prev=0
    for e in D['events']:
        if e['time']==0:continue
        if e['tag']=='reset':
            count=sum(abs(int(x)-int(y)) for x,y in zip(str(prev).zfill(5),str(e['value']).zfill(5)))
            for j in range(count):hit('reset-click',e['time']+e['duration']*j/max(1,count),a.click()*.05)
        else:hit('click',e['time']+e['duration']*.5,a.click()*.14)
        if e['tag']=='drop':hit('arm-drop',e['time']+.14,a.tone(240,.14,.035,.002,partials=((1,1),(2.7,.4)))*.25)
        prev=e['value']
    F=D['effects'];hit('paper-collapse',F['collapse'],a.MA.lowpassed_noise(1.05,2600,400)*.12)
    for j in range(35):hit('quill',.1+j*.85,a.MA.lowpassed_noise(.18,3200,2000)*.014)
    hit('meter',F['meter']+.15,a.tone(340,.10,.025,.002)*.17)
    hit('crack',F['crack'],a.MA.lowpassed_noise(.10,4800,1300)*.18)
    hit('bamboo',F['shishi']+.16,a.tone(740,.24,.07,.001,partials=((1,1),(2.7,.25)))*.25)
    for j in range(8):hit('domino',K['arm:domino'][1]['start']+j*.08,a.tone(420,.07,.018,.001)*.13)
    mix=voice+music+fx;out=cache/(cid+'.mixed.wav');gain=1
    # 再生波形のピークの余裕を持たせる（元ライブラリのsample limitはそのまま）。
    for _ in range(8):
        final=a.soft_limit(mix*gain,ceil=10**(-3/20));a.write(out,final);level,peak=a.loudness(out)
        if abs(level+14)<.3:break
        gain*=10**((-14-level)/20)
    levels={'integrated_lufs':level,'peak_dbfs':peak,'gain':gain};final=a.read(out);levels.update({'quiet_runs_below_-35dB_0.25s':a.quiet_runs(final),'music_spans':dict(zip(['solve','solved','dark','toll','after'],[sv,sd,dk,tl,af])),'sfx':hits,'voice_sha256':hashlib.sha256(voicecopy.read_bytes()).hexdigest(),'source_unchanged':hashlib.sha256(source.read_bytes()).hexdigest()==hashlib.sha256(voicecopy.read_bytes()).hexdigest()})
    (cache/(cid+'.levels.json')).write_text(json.dumps(levels,ensure_ascii=False,indent=1));(cache/(cid+'.mix.json')).write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voice':voicecopy.name,'output':out.name},indent=1));print(json.dumps({k:v for k,v in levels.items() if k!='sfx'},ensure_ascii=False,indent=1))
if __name__=='__main__':main(sys.argv[1] if len(sys.argv)>1 else 'ys-chain-c1v1')
