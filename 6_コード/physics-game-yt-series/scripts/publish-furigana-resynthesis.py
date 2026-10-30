"""Validate all staged movies before replacing the exact 27 inventoried files."""
from pathlib import Path
import json,os,subprocess,hashlib,shutil,re,sys,wave
import numpy as np
from narration_fluency import VERSION,SPACING_VERSION
from narration_pronunciation import word_reading,spoken_text,speech_key
ROOT=Path(__file__).resolve().parents[1];CACHE=Path('/private/tmp/physics-furigana-resynthesis')
FF=os.environ['FFMPEG'];plan=json.loads((CACHE/'plan.json').read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def script(c):return [(s['narration'],s.get('utterances')) for s in c['scenes']]
def query_key(text,reading):
    spoken=word_reading(reading) if reading is not None else spoken_text(text)
    key=hashlib.sha256(f'explicit-v1|10001|.90|.15|.2|{spoken}'.encode()).hexdigest()[:24] if reading is not None else speech_key(text)
    key=hashlib.sha256(f'{VERSION}|{key}'.encode()).hexdigest()[:24]
    return hashlib.sha256(f'{SPACING_VERSION}|{key}'.encode()).hexdigest()[:24]
results=[];publications=[]
for entry in plan:
    relative=Path(entry['mediaDirectory'])/entry['id']
    staged=CACHE/'rendered'/relative;live=ROOT/'public/media'/relative
    for ext in ('.mp4','.json','.jpg'):assert staged.with_suffix(ext).exists(),(relative,ext)
    c=json.loads(staged.with_suffix('.json').read_text());old=json.loads(live.with_suffix('.json').read_text())
    assert script(c)==script(entry)==script(old),entry['id']
    assert c['spacingVersion']==SPACING_VERSION and c['readingMode']=='furigana'
    assert c['duration']==c['scenes'][-1]['end']
    keys=[];fallbacks=0
    for s in c['scenes']:
        us=s.get('utterances') or [{'subtitle':p+'。','reading':None} for p in s['narration'].split('。') if p]
        assert ''.join(cap['text'] for cap in s['captions'])==s['narration']
        assert len(us)==len(s['captions'])
        for cap,u in zip(s['captions'],us):
            assert s['start']<=cap['start']<cap['end']<=s['end']
            key=query_key(u['subtitle'],u.get('reading'));keys.append(key)
            q=json.loads((CACHE/'speech'/f'{key}.query.json').read_text())
            assert q['spacingVersion']==SPACING_VERSION and q['pronunciationMatched'] is True
            assert not re.search(r'\s',q['normalizedReading'])
            fallbacks+=q['selection']=='reference-phonemes-preserved'
    video=staged.with_suffix('.mp4')
    subprocess.run([FF,'-v','error','-i',str(video),'-f','null','-'],check=True,capture_output=True)
    encoded=subprocess.run([FF,'-v','error','-i',str(video),'-vn','-ar','24000','-ac','1','-f','s16le','-'],check=True,capture_output=True).stdout
    with wave.open(str(CACHE/(entry['id']+'.wav'))) as w:raw=w.readframes(w.getnframes())
    a=np.frombuffer(encoded,dtype='<i2').astype(float);b=np.frombuffer(raw,dtype='<i2').astype(float);n=min(len(a),len(b))
    correlation=float(np.corrcoef(a[:n],b[:n])[0,1]);assert correlation>.98,(entry['id'],correlation)
    assert abs(len(b)/24000-c['duration'])<.001
    probe=subprocess.run([FF,'-hide_banner','-i',str(video)],capture_output=True,text=True)
    m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',probe.stderr);assert m
    assert abs(int(m[1])*3600+int(m[2])*60+float(m[3])-c['duration'])<.12
    results.append({'id':c['id'],'directory':c['mediaDirectory'],'beforeDuration':old['duration'],'duration':c['duration'],'sha256':digest(video),'bytes':video.stat().st_size,'renderKey':c['renderKey'],'audioCorrelation':correlation,'speechKeys':keys,'pronunciationPreservingFallbacks':fallbacks})
    publications.append((staged,live,c))
if '--publish' in sys.argv:
    for staged,live,c in publications:
        backup=CACHE/'before-resynthesis'/live.relative_to(ROOT/'public/media');backup.parent.mkdir(parents=True,exist_ok=True)
        for ext in ('.mp4','.json','.jpg'):
            if not backup.with_suffix(ext).exists():shutil.copy2(live.with_suffix(ext),backup.with_suffix(ext))
            pending=live.with_suffix(ext+'.pending');shutil.copy2(staged.with_suffix(ext),pending);os.replace(pending,live.with_suffix(ext))
    # Update only the two overlay catalogs. Other videos and routes stay intact.
    for filename in ('revised-video-catalog.generated.json','insert-video-catalog.generated.json'):
        file=ROOT/'src/content'/filename;current=json.loads(file.read_text())
        replacements={c['id']:c for _,_,c in publications if c['mediaDirectory']==('inserts' if filename.startswith('insert-') else 'revisions')}
        current=[replacements.get(c['id'],c) for c in current]
        pending=file.with_suffix('.pending');pending.write_text(json.dumps(current,ensure_ascii=False,separators=(',',':')));os.replace(pending,file)
report={'spacingVersion':SPACING_VERSION,'published':'--publish' in sys.argv,'videos':results,'count':len(results),'limit':'Query-phoneme equality and waveform/video tests; not a full subjective listening review.'}
(ROOT/'docs/video-fluency-20260924/resynthesis-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(f'{len(results)} movies validated; published={report["published"]}; {sum(r["pronunciationPreservingFallbacks"] for r in results)} pronunciation-preserving fallbacks')
