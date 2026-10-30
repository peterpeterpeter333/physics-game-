"""Check every repaired output against its preserved original, including audio."""
from pathlib import Path
import concurrent.futures as futures
import json,os,subprocess,sys,hashlib
import numpy as np
from narration_fluency import VERSION
ROOT=Path(__file__).resolve().parents[1]
MEDIA=ROOT/'public/media';WORK=ROOT/'docs/video-fluency-20260924'
BACKUP=Path('/private/tmp/physics-fluency-repair/originals')
FF=os.environ['FFMPEG']
def pcm(path):
    b=subprocess.run([FF,'-v','error','-i',str(path),'-vn','-ac','1','-ar','24000','-f','s16le','-'],check=True,capture_output=True).stdout
    return np.frombuffer(b,dtype='<i2').astype(np.float64)
def check(row):
    file=MEDIA/row['file'];c=json.loads(file.with_suffix('.json').read_text())
    assert c.get('fluencyRepairVersion')==VERSION,row['file']
    original=BACKUP/row['file'];old=json.loads(original.with_suffix('.json').read_text())
    assert [s['narration'] for s in old['scenes']]==[s['narration'] for s in c['scenes']]
    for s in c['scenes']:
        assert s['end']>s['start']
        for cap in s.get('captions',[]):assert s['start']<=cap['start']<cap['end']<=s['end']
    assert abs(c['scenes'][-1]['end']-c['duration'])<1e-8
    before=pcm(original);after=pcm(file);parts=[];cursor=0;peak=0
    for cut in row['cuts']:
        a=round(cut['start']*24000);b=round(cut['end']*24000)
        peak=max(peak,float(np.max(np.abs(before[a:b]))))
        parts.append(before[cursor:a]);cursor=b
    parts.append(before[cursor:]);expected=np.concatenate(parts)
    n=min(len(expected),len(after));correlation=float(np.corrcoef(expected[:n],after[:n])[0,1])
    # -50 dB threshold plus a small decoding/rounding allowance. No actual
    # syllable may be excised. AAC re-encoding is lossy, so compare correlation.
    assert peak<=120,(row['file'],'non-silent cut',peak)
    assert correlation>.98,(row['file'],'audio alignment',correlation)
    assert abs(n/24000-c['duration'])<.12,(row['file'],'duration')
    return {'file':row['file'],'removedSeconds':old['duration']-c['duration'],'cutPeak':peak,'audioCorrelation':correlation,
            'originalBytes':original.stat().st_size,'originalSha256':hashlib.sha256(original.read_bytes()).hexdigest(),
            'originalRenderKey':old.get('renderKey'),'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'renderKey':c.get('renderKey')}
report=json.loads((WORK/'audit.json').read_text())
rows=[r for r in report['videos'] if r['cuts']]
partial='--ready-only' in sys.argv
if partial:rows=[r for r in rows if json.loads((MEDIA/r['file']).with_suffix('.json').read_text()).get('fluencyRepairVersion')==VERSION]
with futures.ThreadPoolExecutor(max_workers=3) as pool: results=list(pool.map(check,rows))
for file in ([] if partial else (ROOT/'src/content').glob('*video-catalog.generated.json')):
    for c in json.loads(file.read_text()):
        directory=c.get('mediaDirectory') or ('em' if file.name=='em-video-catalog.generated.json' else 'lessons')
        actual=json.loads((MEDIA/directory/(c['id']+'.json')).read_text())
        assert c['duration']==actual['duration'] and c.get('renderKey')==actual.get('renderKey'),(file.name,c['id'])
out={'audited':report['videoCount'],'repaired':len(results),'unchanged':report['videoCount']-len(results),'removedSeconds':sum(r['removedSeconds'] for r in results),'minimumAudioCorrelation':min(r['audioCorrelation'] for r in results),'maximumCutPeak':max(r['cutPeak'] for r in results),'results':results,'limitations':'Signal/synchronization checks, not a subjective listening review.'}
out['partial']=partial
(WORK/('verification-partial.json' if partial else 'verification.json')).write_text(json.dumps(out,ensure_ascii=False,indent=2))
print(json.dumps({k:v for k,v in out.items() if k!='results'},ensure_ascii=False))
