"""B-1 dedicated mix; write a new file, never replace the supplied voice WAV."""
import os,json,hashlib
from pathlib import Path
import numpy as np
import desk_audio_lib as a
def main():
    cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-b1v1'));cid='ys-chain-b1v1';source=cache/(cid+'.wav');sha=hashlib.sha256(source.read_bytes()).hexdigest()
    voice=a.read(source);n=len(voice);dur=n/a.SR;plan=json.loads((cache/'plan.json').read_text())[0];timed=json.loads((cache/(cid+'.json')).read_text());cues=[q for s in plan['scenes'] for q in s['cues']];caps=[c for s in timed['scenes'] for c in s['captions']]
    def span(name):
        ix=[i for i,q in enumerate(cues) if q.get('music')==name];return [caps[ix[0]]['start'],caps[ix[-1]]['end']]
    sv,sd,dk,tl,af=[span(k) for k in ['solve','solved','dark','toll','after']]
    music=a.base_music(n,0,sv[0])+1.25*a.base_music(n,sv[0],sd[0]+.3,bright=1)+a.solved_music(n,sd[0])+.9*a.base_music(n,sd[0]+1.6,dk[0]+.2)
    music+=a.dark_music(n,dk[0],af[1])*.65+a.toll_music(n,299.85)*.28+a.after_music(n,af[0],dur+.1)
    music=a.duck_under_voice(music,voice,.20)+.040*a.pad([a.hz(48),a.hz(55),a.hz(64)],n)
    music*=a.env_ramp(n,[(0,1),(dur-.10,1),(dur,0)]);fx=np.zeros(n);hits=[]
    def hit(nm,t,x):a.add(fx,x,t);hits.append([nm,t])
    hit('lid',.24,a.tone(360,.12,.035,.002)*.16)
    for t in [.8,1,1.3,1.65]:hit('needle',t,a.click()*.025)
    for i in range(3):hit('nail',75.01+i*.07,a.click()*.24)
    hit('magnet',94.55,a.click()*.17);hit('turn',97.08,a.whirr(.35)*.14);hit('magnet-return',98.15,a.click()*.17)
    for t in [78.08,258.36,258.66]:hit('score',t,a.score_sfx()*.20)
    hit('carve',126.40,a.MA.lowpassed_noise(.8,3000,600)*.07);hit('filings',163.73,a.MA.lowpassed_noise(1,3000,900)*.13);hit('dip',249.28,a.click()*.10)
    mixed=voice+music+fx;out=cache/(cid+'.mixed.wav');gain=1
    for _ in range(8):
        a.write(out,a.soft_limit(mixed*gain,ceil=10**(-2/20)));level,peak=a.loudness(out)
        if abs(level+14)<.25:break
        gain*=10**((-14-level)/20)
    quiet=a.quiet_runs(a.read(out));assert hashlib.sha256(source.read_bytes()).hexdigest()==sha
    levels={'integrated_lufs':level,'true_peak_dbfs':peak,'quiet_runs':quiet,'voice_unchanged':True,'voice_sha256':sha,'sfx':hits,'music_spans':dict(zip(['solve','solved','dark','toll','after'],[sv,sd,dk,tl,af]))}
    (cache/(cid+'.levels.json')).write_text(json.dumps(levels,ensure_ascii=False,indent=1));print(json.dumps(levels,ensure_ascii=False,indent=1))
if __name__=='__main__':main()
