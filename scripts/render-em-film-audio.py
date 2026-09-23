"""Offline, cached Nemo speech. No TTS engine is shipped to app users."""
from pathlib import Path
import os, json, urllib.request, urllib.parse, wave, io, sys, hashlib
import numpy as np
from narration_pronunciation import spoken_text, speech_key, validate_query, clip_fingerprint, word_reading

CACHE=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/physics-em-films'))
SPEAKER=10001
def request(endpoint, params, payload=None):
    req=urllib.request.Request(os.environ.get('NEMO_URL','http://127.0.0.1:50123')+'/'+endpoint+'?'+urllib.parse.urlencode(params),data=json.dumps(payload).encode() if payload is not None else b'',headers={'Content-Type':'application/json'})
    return urllib.request.urlopen(req,timeout=180).read()
def speech(text, reading=None):
    spoken=word_reading(reading) if reading is not None else spoken_text(text)
    key=hashlib.sha256(f'explicit-v1|{SPEAKER}|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24] if reading is not None else speech_key(text,SPEAKER)
    file=CACHE/'speech'/f'{key}.wav'
    if not file.exists():
        query=json.loads(request('audio_query',{'text':spoken,'speaker':SPEAKER}))
        if reading is None: validate_query(text,query)
        (CACHE/'speech'/f'{key}.query.json').write_text(json.dumps({'subtitle':text,'reading':spoken,'kana':query.get('kana'),'accent_phrases':query['accent_phrases']},ensure_ascii=False,indent=2))
        query.update(speedScale=.90,prePhonemeLength=.15,postPhonemeLength=.2)
        data=request('synthesis',{'speaker':SPEAKER},query)
        with wave.open(io.BytesIO(data)) as w:
            assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2
        file.write_bytes(data)
    with wave.open(str(file)) as w:return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()

(CACHE/'speech').mkdir(exist_ok=True)
plan=json.loads((CACHE/'plan.json').read_text())
for ci,clip in enumerate(plan):
    if len(sys.argv)>1 and clip['id'] not in sys.argv[1:]:continue
    # Included in the render fingerprint even if the corrected voice has the
    # same duration. Written Japanese remains unchanged in the subtitles.
    if any('電気束' in scene['narration'] for scene in clip['scenes']):
        clip['pronunciationOverrides']={'電気束':'でんきそく'}
    fingerprint=clip_fingerprint(clip)
    if fingerprint:clip['pronunciationFingerprint']=fingerprint
    clip['wordReadingVersion']='20260924-v1'
    start=0;segments=[]
    for scene in clip['scenes']:
        scene['start']=start;scene['captions']=[]
        utterances=scene.get('utterances') or [{'subtitle':p+'。','reading':None} for p in scene['narration'].split('。') if p]
        for utterance in utterances:
            text=utterance['subtitle']
            samples=speech(text,utterance.get('reading'))
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
