"""Audit every MP4; shorten verified silence with identical audio/video cuts.

Existing spoken sounds are not regenerated or accelerated. Subtitle/scene clocks
are mapped through the same cuts. Originals are preserved outside public/media.
"""
from pathlib import Path
import concurrent.futures as futures
import hashlib, json, math, os, re, shutil, subprocess, sys
import urllib.request, urllib.parse
from narration_pronunciation import word_reading, spoken_text
from narration_fluency import formatting_pause_indices, pause_windows, VERSION

ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'public/media'
WORK=ROOT/'docs/video-fluency-20260924'
CACHE=Path('/private/tmp/physics-fluency-repair')
BACKUP=CACHE/'originals'
FF=os.environ['FFMPEG']
for p in (WORK,CACHE,BACKUP,CACHE/'queries'):p.mkdir(parents=True,exist_ok=True)

def query_for(spoken):
    key=hashlib.sha256(spoken.encode()).hexdigest()
    file=CACHE/'queries'/f'{key}.json'
    if file.exists():return json.loads(file.read_text())
    url='http://127.0.0.1:50123/audio_query?'+urllib.parse.urlencode({'speaker':10001,'text':spoken})
    q=json.load(urllib.request.urlopen(urllib.request.Request(url,data=b''),timeout=60))
    file.write_text(json.dumps(q,ensure_ascii=False))
    return q

def map_time(t,cuts):
    return t-sum(max(0,min(t,b)-a) for a,b in cuts if t>a)

def inspect(path):
    relative=str(path.relative_to(MEDIA))
    meta=path.with_suffix('.json')
    c=json.loads(meta.read_text())
    result={'file':relative,'id':c.get('id',path.stem),'duration':c['duration'],'cuts':[],'warnings':[]}
    if c.get('fluencyRepairVersion')==VERSION:
        return dict(result,alreadyRepaired=True)
    run=subprocess.run([FF,'-hide_banner','-i',str(path),'-af','silencedetect=noise=-50dB:d=0.16','-vn','-f','null','-'],capture_output=True,text=True)
    if run.returncode:raise RuntimeError(relative+run.stderr[-1500:])
    fps=re.search(r'(\d+(?:\.\d+)?) fps',run.stderr)
    if not fps or float(fps[1])!=24:
        result['warnings'].append('Non-24fps media: manual review required');return result
    silences=[];start=None
    for event,value in re.findall(r'silence_(start|end): ([\d.]+)',run.stderr):
        if event=='start':start=float(value)
        elif start is not None:silences.append((start,float(value)));start=None
    if start is not None:silences.append((start,c['duration']))
    result['silences']=len(silences)
    captions=[cap for s in c['scenes'] for cap in s.get('captions',[])]
    if not captions:
        result['warnings'].append('Legacy film: scene-boundary audit only; no explicit spaced reading or sentence clocks')
    word_pauses=[]
    for scene in c['scenes']:
        utterances=scene.get('utterances')
        for j,cap in enumerate(scene.get('captions',[])):
            reading=utterances[j].get('reading') if utterances and j<len(utterances) else None
            spoken=word_reading(reading) if reading is not None else spoken_text(cap['text'])
            if not re.search(r'\s',spoken.strip()):continue
            q=query_for(spoken);indices=formatting_pause_indices(spoken,q)
            if indices is None:
                result['warnings'].append('Ambiguous spacing: '+cap['text']);continue
            for a,b in pause_windows(q,indices):word_pauses.append((cap['start']+.15+a,cap['start']+.15+b))
    bounds=[cap['start'] for cap in captions[1:]]
    scene_bounds=[s['start'] for s in c['scenes'][1:]]
    for a,b in silences:
        target=None;reason=None
        if any(a-.04<=v<=b+.04 for v in scene_bounds):target=.85;reason='scene'
        elif any(a-.04<=v<=b+.04 for v in bounds):target=.42;reason='sentence'
        elif any(min(b,y)-max(a,x)>.10 for x,y in word_pauses):target=.10;reason='formatting-space'
        if target is None or b-a<target+.10:continue
        # Keep both edges and cut only central digital silence. Quantize to the
        # existing 24fps grid: 1 video frame == 1000 audio samples at 24kHz.
        left=math.ceil((a+target/2)*24)/24
        right=math.floor((b-target/2)*24)/24
        if right>left:result['cuts'].append({'start':left,'end':right,'reason':reason})
    result['removedSeconds']=sum(x['end']-x['start'] for x in result['cuts'])
    return result

def repair(row):
    if not row['cuts']:return
    path=MEDIA/row['file'];meta=path.with_suffix('.json')
    backup=BACKUP/row['file'];backup.parent.mkdir(parents=True,exist_ok=True)
    if not backup.exists():shutil.copy2(path,backup);shutil.copy2(meta,backup.with_suffix('.json'))
    cuts=[(x['start'],x['end']) for x in row['cuts']]
    # select frame numbers, not floating-point timestamps, on both streams.
    remove='+'.join(f'between(n,{round(a*24)},{round(b*24)-1})' for a,b in cuts)
    filt=f"[0:v]select='not({remove})',setpts=N/(24*TB)[v];[0:a]aresample=24000,asetnsamples=n=1000:p=1,aselect='not({remove})',asetpts=N/SR/TB[a]"
    temporary=CACHE/(hashlib.sha256(row['file'].encode()).hexdigest()+'.mp4')
    cmd=[FF,'-y','-v','error','-threads','2','-i',str(path),'-filter_complex_threads','1','-filter_complex',filt,'-map','[v]','-map','[a]','-c:v','libx264','-threads','2','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-r','24','-c:a','aac','-b:a','128k','-movflags','+faststart',str(temporary)]
    subprocess.run(cmd,check=True,capture_output=True)
    subprocess.run([FF,'-v','error','-i',str(temporary),'-f','null','-'],check=True,capture_output=True)
    c=json.loads(meta.read_text());old_duration=c['duration']
    for s in c['scenes']:
        oldstart=s['start'];oldend=s.get('end',oldstart+s.get('duration',0))
        s['start']=map_time(oldstart,cuts);s['end']=map_time(oldend,cuts)
        if 'duration' in s:s['duration']=s['end']-s['start']
        for cap in s.get('captions',[]):
            cap['start']=map_time(cap['start'],cuts);cap['end']=map_time(cap['end'],cuts)
            assert cap['end']>cap['start']
    c['duration']=map_time(old_duration,cuts)
    c['fluencyRepairVersion']=VERSION
    c['fluencyRepair']={'method':'verified-silence-only; identical A/V frame cuts','originalDuration':old_duration,'removedSeconds':old_duration-c['duration'],'cuts':row['cuts']}
    c['renderKey']=hashlib.sha256((c.get('renderKey','')+json.dumps(row['cuts'])+VERSION).encode()).hexdigest()
    probe=subprocess.run([FF,'-hide_banner','-i',str(temporary)],capture_output=True,text=True)
    match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',probe.stderr)
    assert match and abs(int(match[1])*3600+int(match[2])*60+float(match[3])-c['duration'])<.12
    os.replace(temporary,path)
    meta.write_text(json.dumps(c,ensure_ascii=False,indent=2))

def sync_catalogs():
    for file in (ROOT/'src/content').glob('*video-catalog.generated.json'):
        clips=json.loads(file.read_text());changed=False
        for i,c in enumerate(clips):
            directory=c.get('mediaDirectory') or ('em' if file.name=='em-video-catalog.generated.json' else 'lessons')
            meta=MEDIA/directory/(c['id']+'.json')
            if meta.exists():
                updated=json.loads(meta.read_text())
                if updated.get('fluencyRepairVersion')==VERSION:clips[i]=updated;changed=True
        if changed:file.write_text(json.dumps(clips,ensure_ascii=False,separators=(',',':')))
    file=ROOT/'src/content/paper-battle-videos.generated.json'
    entries=json.loads(file.read_text())
    for entry in entries:
        for kind in ('question','solution'):
            c=json.loads((MEDIA/'paper-battles'/(entry[kind]['id']+'.json')).read_text())
            entry[kind].update(duration=c['duration'],renderKey=c['renderKey'])
    file.write_text(json.dumps(entries,ensure_ascii=False,indent=2))

if __name__=='__main__':
    if '--apply' in sys.argv:
        report=json.loads((WORK/'audit.json').read_text())
        chosen=[r for r in report['videos'] if r['cuts'] and (len(sys.argv)==2 or r['file'] in sys.argv[2:])]
        for n,row in enumerate(chosen):
            current=json.loads((MEDIA/row['file']).with_suffix('.json').read_text())
            if current.get('fluencyRepairVersion')!=VERSION:repair(row)
            sync_catalogs()
            print(f'{n+1}/{len(chosen)} repaired {row["file"]}',flush=True)
    else:
        files=sorted(MEDIA.rglob('*.mp4'));rows=[]
        with futures.ThreadPoolExecutor(max_workers=4) as pool:
            for n,row in enumerate(pool.map(inspect,files)):
                rows.append(row)
                if (n+1)%25==0:print(f'Audited {n+1}/{len(files)}',flush=True)
        report={'version':VERSION,'videos':rows,'videoCount':len(rows),'affected':sum(bool(r['cuts']) for r in rows),'warnings':sum(len(r['warnings']) for r in rows),'limits':'Signal and script audit, not a listening review. Actual spoken sounds and meaningful punctuation are preserved.'}
        (WORK/'audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
        print(json.dumps({k:v for k,v in report.items() if k!='videos'},ensure_ascii=False),flush=True)
