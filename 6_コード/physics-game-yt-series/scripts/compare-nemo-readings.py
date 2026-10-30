"""One-video controlled experiment; does not publish or modify app media."""
from pathlib import Path
import json,re,urllib.request,urllib.parse,copy,sys,wave,io,hashlib
import numpy as np
from narration_fluency import VERSION,mora_signature,guided_query,fluent_query

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts/nemo-reading-comparison'
OUT.mkdir(parents=True,exist_ok=True)
SOURCE=json.loads((ROOT/'docs/video-revision-20260924/full-plan.generated.json').read_text())
clip=next(c for c in SOURCE if c['id']=='ht-why-10')
def request(endpoint,text=None,payload=None):
    args={'speaker':10001}
    if text is not None:args['text']=text
    req=urllib.request.Request('http://127.0.0.1:50123/'+endpoint+'?'+urllib.parse.urlencode(args),data=json.dumps(payload).encode() if payload else b'',headers={'Content-Type':'application/json'})
    return urllib.request.urlopen(req,timeout=180).read()
def query(text):return json.loads(request('audio_query',text))
def hiragana(text):
    # The B control is genuinely hiragana, including katakana loanwords.
    return ''.join(chr(ord(ch)-0x60) if 'ァ'<=ch<='ヶ' else ch for ch in re.sub(r'\s+','',text))
def details(q):return {'kana':q['kana'],'phrases':[{'text':''.join(m['text'] for m in p['moras']),'accent':p['accent'],'pause':bool(p.get('pause_mora'))} for p in q['accent_phrases']]}
rows=[];variants={'kanji':[], 'hiragana':[]}
for u in clip['scenes'][0]['utterances']:
    ref=query(u['reading']);a=query(u['subtitle']);btext=hiragana(u['reading']);b=query(btext)
    aq,status=guided_query(u['subtitle'],a,u['reading'],ref)
    # Do not fix the experimental control silently. Abort if removing spaces
    # changes the specified pronunciation, so the experiment stays meaningful.
    assert mora_signature(b)==mora_signature(ref),('B changed reading',u)
    assert mora_signature(aq)==mora_signature(ref)
    variants['kanji'].append(aq);variants['hiragana'].append(fluent_query(btext,b))
    rows.append({'subtitle':u['subtitle'],'furigana':u['reading'],'hiraganaInput':btext,'kanjiStatus':status,'spaced':details(ref),'kanji':details(a),'hiragana':details(b),'phonemesMatch':True})
(OUT/'comparison.json').write_text(json.dumps({'rows':rows,'voice':'VOICEVOX Nemo 男声1','speed':.9,'controls':'same subtitles, animation, speaker, speed and punctuation; both A/B omit formatting spaces','limits':'Prosody differences are measured; naturalness requires listening.'},ensure_ascii=False,indent=2))
for name,queries in variants.items():
    cache=Path('/private/tmp/physics-nemo-reading-comparison')/name
    cache.mkdir(parents=True,exist_ok=True)
    entry=copy.deepcopy(clip);entry['title']=('A：漢字交じり' if name=='kanji' else 'B：ひらがな・空白なし')+' ／ 熱量の比較'
    entry['fluencyVersion']=VERSION;entry['comparisonMode']=name
    (cache/'plan.json').write_text(json.dumps([entry],ensure_ascii=False))
    start=0;segments=[];scene=entry['scenes'][0];scene['start']=0;scene['captions']=[]
    for u,q in zip(scene['utterances'],queries):
        key=hashlib.sha256(json.dumps(q,sort_keys=True).encode()).hexdigest()
        wav=cache/(key+'.wav')
        if not wav.exists():wav.write_bytes(request('synthesis',payload=q))
        with wave.open(str(wav)) as w:
            assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(24000,1,2)
            data=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()
        duration=len(data)/24000
        scene['captions'].append({'start':start,'end':start+duration+.12,'text':u['subtitle']})
        segments.append((start+.04,data));start+=duration+.16
    start+=.55;scene['end']=start;entry['duration']=start
    track=np.zeros(round(start*24000),dtype='<i2')
    for t,data in segments:
        p=round(t*24000);track[p:p+len(data)]=data
    with wave.open(str(cache/'ht-why-10.wav'),'wb') as w:
        w.setparams((1,2,24000,0,'NONE','not compressed'));w.writeframes(track.tobytes())
    (cache/'ht-why-10.json').write_text(json.dumps(entry,ensure_ascii=False,indent=2))
    print(name,round(start,2),'seconds; pronunciation verified',flush=True)
