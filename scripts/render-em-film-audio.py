"""Offline, cached Nemo speech. No TTS engine is shipped to app users."""
from pathlib import Path
import os, json, hashlib, urllib.request, urllib.parse, wave, io
import numpy as np

CACHE=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/physics-em-films'))
SPEAKER=10001
def request(endpoint, params, payload=None):
    req=urllib.request.Request('http://127.0.0.1:50123/'+endpoint+'?'+urllib.parse.urlencode(params),data=json.dumps(payload).encode() if payload is not None else b'',headers={'Content-Type':'application/json'})
    return urllib.request.urlopen(req,timeout=180).read()
def speech(text):
    spoken=text.replace('電場','でんば').replace('磁場','じば')
    key=hashlib.sha256(f'{SPEAKER}|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24]
    file=CACHE/'speech'/f'{key}.wav'
    if not file.exists():
        query=json.loads(request('audio_query',{'text':spoken,'speaker':SPEAKER}))
        query.update(speedScale=.90,prePhonemeLength=.15,postPhonemeLength=.2)
        data=request('synthesis',{'speaker':SPEAKER},query)
        with wave.open(io.BytesIO(data)) as w:
            assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2
        file.write_bytes(data)
    with wave.open(str(file)) as w:return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()

(CACHE/'speech').mkdir(exist_ok=True)
plan=json.loads((CACHE/'plan.json').read_text())
for ci,clip in enumerate(plan):
    start=0;segments=[]
    for scene in clip['scenes']:
        scene['start']=start;scene['captions']=[]
        sentences=[p+'。' for p in scene['narration'].split('。') if p]
        for text in sentences:
            samples=speech(text)
            duration=len(samples)/24000
            scene['captions'].append({'start':start,'end':start+duration+.45,'text':text})
            segments.append((start+.15,samples));start+=duration+.6
        # A short silent reading interval, not padding a thin explanation to a minute.
        start+=1.2
        scene['end']=start
    clip['duration']=start
    track=np.zeros(round(start*24000),dtype='<i2')
    for t,samples in segments:
        pos=round(t*24000);track[pos:pos+len(samples)]=samples
    with wave.open(str(CACHE/f"{clip['id']}.wav"),'wb') as w:
        w.setparams((1,2,24000,0,'NONE','not compressed'));w.writeframes(track.tobytes())
    (CACHE/f"{clip['id']}.json").write_text(json.dumps(clip,ensure_ascii=False,indent=2))
    print(f"{ci+1}/{len(plan)} {clip['id']}: {start:.1f}s",flush=True)
(CACHE/'timed-plan.json').write_text(json.dumps(plan,ensure_ascii=False,indent=2))
