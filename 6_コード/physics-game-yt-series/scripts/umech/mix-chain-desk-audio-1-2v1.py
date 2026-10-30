"""Independent 1-2 mix. Exact supplied voice; continuous music and cue-aligned SFX."""
import os,json,hashlib,shutil
from pathlib import Path
import numpy as np
import desk_audio_lib as a

CID='ys-chain-1-2v1';CACHE=a.CACHE
assert str(CACHE)!='/private/tmp/ys/ys-chain-1-2v1','supplied cache is read-only'
DATA=json.loads((CACHE/'blender/data.json').read_text())['episode12']
CUES=DATA['cues'];K={c['key']:c for c in CUES}
source=Path(__file__).resolve().parents[1]/'blender/desk_assets/1-2v1'/f'{CID}.wav'
assert hashlib.sha256(source.read_bytes()).hexdigest()==DATA['audioSHA']
voicepath=CACHE/f'{CID}.voice.wav'
if not voicepath.exists():shutil.copy2(source,voicepath)
assert hashlib.sha256(voicepath.read_bytes()).hexdigest()==DATA['audioSHA']
voice=a.read(voicepath);n=len(voice);duration=n/a.SR

def at(key,label,offset=0):
    matches=[w['time'] for w in K[key]['wordEvents'] if w['word']==label]
    assert len(matches)==1,(key,label,matches)
    return matches[0]+offset

def make():
    # Base remains audible through transitions; accents cross-fade, not hard-cut.
    music=a.base_music(n,0,duration+.1)
    solve0=K['chk:alb']['start'];solve1=K['chk:judge']['start']
    music+=.55*a.base_music(n,solve0,solve1,bright=1)
    music+=.35*a.solved_music(n,solve1)
    for key in ['why:slow','why:skip','why:stay']:
        c=K[key];mask=a.env_ramp(n,[(0,0),(max(0,c['start']-.3),0),(c['start']+.3,1),(c['end']-.3,1),(c['end']+.3,0),(duration,0)])
        music*=1-.65*mask
        music+=a.dark_music(n,max(0,c['start']-.3),c['end']+.3)*mask
    music+=.28*a.toll_music(n,at('why:skip','1文字飛ばすと'))
    # after applies to one cue only, then returns to the original brighter base.
    c=K['next:point'];music+=.18*a.after_music(n,c['start'],c['end'])
    music=a.duck_under_voice(music,voice,gain=.18)
    fx=np.zeros(n);hits=[]
    def hit(name,t,x):
        a.add(fx,x,t);hits.append({'kind':name,'time':round(t,4)})
    def clicks(ts):
        for t in ts:hit('click',t,.12*a.click())
    clicks([26.69,27.78]+[29.30+i*.25 for i in range(7)]+[31.55])
    clicks([86.08+.5,122.45+.25])
    clicks([104.01+i*.12 for i in range(26)])
    clicks([260.50+i*.12 for i in range(10)])
    clicks([265.13+i*.12 for i in range(4)])
    # Six steps reach Z at its spoken cue, one crosses to A, seventeen reach R.
    clicks([269.22+i*.12 for i in range(6)]+[272.07]+[272.10+i*.12 for i in range(17)])
    clicks(np.arange(337.56,339.98,.06))
    hit('score',187.67+.3,.22*a.score_sfx())
    plan=json.loads((CACHE/'plan.json').read_text())[0]
    qs={q['diagram'].replace('c12v1-',''):q for s in plan['scenes'] for q in s['cues']}
    for key,c in K.items():
        for name,when in qs[key].get('sfx',[]):
            t=c['voiceEnd']+float(when[2:]) if isinstance(when,str) and when.startswith('e+') else c['start']+float(when)
            hit(name,t,a.MA.sfx(name)*a.MA.SFX_LEVEL.get(name,.4)*.55)
    for start,num,step in [(37.09,15,.08),(277.30,3,.12),(285.24,1,.1),(286.41,1,.1),(287.85,1,.1)]:
        for i in range(num):hit('tile',start+i*step,.055*a.tone(320,.08,.025,.001,partials=((1,1),(2.1,.2))))
    out=CACHE/f'{CID}.wav'
    levels=a.normalize_lufs(voice+music+fx,out)
    levels['quiet_runs']=a.quiet_runs(a.read(out));levels['source_voice_sha256']=DATA['audioSHA']
    levels['audition']='not listened to by ear'
    (CACHE/f'{CID}.levels.json').write_text(json.dumps(levels,ensure_ascii=False,indent=2))
    (CACHE/f'{CID}.mix.json').write_text(json.dumps({'mixSha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voiceSha256':DATA['audioSHA'],'hits':hits},ensure_ascii=False,indent=2))
    print(json.dumps(levels,ensure_ascii=False,indent=2))

if __name__=='__main__':make()
