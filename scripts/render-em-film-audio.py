"""Offline, cached Nemo speech. No TTS engine is shipped to app users."""
from pathlib import Path
import os, json, urllib.request, urllib.parse, wave, io, sys, hashlib
import numpy as np
from narration_pronunciation import spoken_text, speech_key, validate_query, clip_fingerprint, word_reading
from narration_fluency import VERSION, SPACING_VERSION, fluent_query, guided_query, normalized_reading, spacing_query, mora_signature

CACHE=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/physics-em-films'))
SPEAKER=10001
READING_MODE=os.environ.get('NEMO_READING_MODE','furigana')
assert READING_MODE in ('furigana','kanji-guided')
def request(endpoint, params, payload=None):
    req=urllib.request.Request(os.environ.get('NEMO_URL','http://127.0.0.1:50123')+'/'+endpoint+'?'+urllib.parse.urlencode(params),data=json.dumps(payload).encode() if payload is not None else b'',headers={'Content-Type':'application/json'})
    return urllib.request.urlopen(req,timeout=180).read()
def speech(text, reading=None):
    spoken=word_reading(reading) if reading is not None else spoken_text(text)
    key=hashlib.sha256(f'explicit-v1|{SPEAKER}|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24] if reading is not None else speech_key(text,SPEAKER)
    key=hashlib.sha256(f'{VERSION}|{key}'.encode()).hexdigest()[:24]
    key=hashlib.sha256(f'{SPACING_VERSION}|{key}'.encode()).hexdigest()[:24]
    if READING_MODE=='kanji-guided':key=hashlib.sha256(f'{key}|kanji-guided|{spoken_text(text)}'.encode()).hexdigest()[:24]
    file=CACHE/'speech'/f'{key}.wav'
    if not file.exists():
        query=json.loads(request('audio_query',{'text':spoken,'speaker':SPEAKER}))
        if reading is None: validate_query(text,query)
        reference=query
        status='furigana'
        if READING_MODE=='kanji-guided' and reading is not None:
            natural=spoken_text(text)
            candidate=json.loads(request('audio_query',{'text':natural,'speaker':SPEAKER}))
            query,status=guided_query(natural,candidate,spoken,reference)
        else:
            compact=normalized_reading(spoken)
            candidate=json.loads(request('audio_query',{'text':compact,'speaker':SPEAKER})) if compact!=spoken else query
            query,status=spacing_query(spoken,reference,candidate)
        assert mora_signature(query)==mora_signature(reference)
        (CACHE/'speech'/f'{key}.query.json').write_text(json.dumps({'subtitle':text,'reading':spoken,'normalizedReading':normalized_reading(spoken),'spacingVersion':SPACING_VERSION,'pronunciationMatched':True,'readingMode':READING_MODE,'selection':status,'referenceKana':reference.get('kana'),'kana':query.get('kana'),'accent_phrases':query['accent_phrases']},ensure_ascii=False,indent=2))
        data=request('synthesis',{'speaker':SPEAKER},query)
        with wave.open(io.BytesIO(data)) as w:
            assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2
        file.write_bytes(data)
    with wave.open(str(file)) as w:return np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()

(CACHE/'speech').mkdir(exist_ok=True)
plan=json.loads((CACHE/'plan.json').read_text())
timed=[]
def script_key(clip):
    # Metadata-only title/diagram changes do not require another synthesis.
    content=[{'narration':s['narration'],'utterances':s.get('utterances')} for s in clip['scenes']]
    return hashlib.sha256(json.dumps(content,ensure_ascii=False,sort_keys=True).encode()).hexdigest()

for ci,clip in enumerate(plan):
    if len(sys.argv)>1 and clip['id'] not in sys.argv[1:]:continue
    audio_file=CACHE/f"{clip['id']}.wav"
    metadata_file=CACHE/f"{clip['id']}.json"
    if audio_file.exists() and metadata_file.exists():
        cached=json.loads(metadata_file.read_text())
        if script_key(cached)==script_key(clip) and cached.get('wordReadingVersion')=='20260924-v1' and cached.get('fluencyVersion')==VERSION and cached.get('spacingVersion')==SPACING_VERSION and cached.get('readingMode','furigana')==READING_MODE:
            with wave.open(str(audio_file)) as wave_file:
                valid=wave_file.getframerate()==24000 and wave_file.getnchannels()==1 and abs(wave_file.getnframes()/24000-cached['duration'])<.01
            if valid:
                updated=dict(cached,**clip)
                updated['duration']=cached['duration']
                updated['scenes']=[dict(scene,start=old['start'],end=old['end'],captions=old['captions']) for scene,old in zip(clip['scenes'],cached['scenes'])]
                metadata_file.write_text(json.dumps(updated,ensure_ascii=False,indent=2))
                timed.append(updated)
                print(f"Cached {ci+1}/{len(plan)} {clip['id']}",flush=True)
                continue
    # Included in the render fingerprint even if the corrected voice has the
    # same duration. Written Japanese remains unchanged in the subtitles.
    if any('電気束' in scene['narration'] for scene in clip['scenes']):
        clip['pronunciationOverrides']={'電気束':'でんきそく'}
    fingerprint=clip_fingerprint(clip)
    if fingerprint:clip['pronunciationFingerprint']=fingerprint
    clip['wordReadingVersion']='20260924-v1'
    clip['fluencyVersion']=VERSION
    clip['readingMode']=READING_MODE
    clip['spacingVersion']=SPACING_VERSION
    start=0;segments=[]
    for scene in clip['scenes']:
        scene['start']=start;scene['captions']=[]
        utterances=scene.get('utterances') or [{'subtitle':p+'。','reading':None} for p in scene['narration'].split('。') if p]
        for utterance in utterances:
            text=utterance['subtitle']
            samples=speech(text,utterance.get('reading'))
            duration=len(samples)/24000
            scene['captions'].append({'start':start,'end':start+duration+.12,'text':text})
            segments.append((start+.04,samples));start+=duration+.16
        # A short silent reading interval, not padding a thin explanation to a minute.
        start+=.55
        scene['end']=start
    clip['duration']=start
    track=np.zeros(round(start*24000),dtype='<i2')
    for t,samples in segments:
        pos=round(t*24000);track[pos:pos+len(samples)]=samples
    partial_audio=CACHE/f"{clip['id']}.pending.wav"
    with wave.open(str(partial_audio),'wb') as w:
        w.setparams((1,2,24000,0,'NONE','not compressed'));w.writeframes(track.tobytes())
    partial_audio.replace(audio_file)
    metadata_file.write_text(json.dumps(clip,ensure_ascii=False,indent=2))
    timed.append(clip)
    print(f"{ci+1}/{len(plan)} {clip['id']}: {start:.1f}s",flush=True)
# Selected generation must never mark unprocessed clips as timed and complete.
manifest=CACHE/('timed-selection.json' if len(sys.argv)>1 else 'timed-plan.json')
manifest.write_text(json.dumps(timed,ensure_ascii=False,indent=2))
