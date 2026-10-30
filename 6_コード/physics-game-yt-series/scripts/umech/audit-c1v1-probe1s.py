"""共有のfeaturesを読むだけで、C-1の全編1秒probeを予備集計する。"""
import os,json,importlib.util,subprocess,tempfile,hashlib
from pathlib import Path
import numpy as np
W=Path(__file__).resolve().parents[2];cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'));meta=json.loads((cache/'c1-probe1s-metadata.json').read_text());TH=meta['thresholds']
source=W/'scripts/umech/desk-quality-gate-frames.py';spec=importlib.util.spec_from_file_location('immutable_desk_features',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff=os.environ.get('FFMPEG','/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
with tempfile.NamedTemporaryFile('w',suffix='.txt',delete=False) as f:
    f.write('ffconcat version 1.0\n')
    for t in meta.get('qaTimes',meta['times']):f.write("file '%s'\nduration 1\n"%(str(Path(meta['raw'])/('%05d.jpg'%round(t*30))).replace("'","'\\''")))
    concat=f.name
try:
    qa_values=[m.features(a) for a in m.run_frames(ff,['-f','concat','-safe','0','-i',concat,'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)]
finally:os.unlink(concat)
qa_times=meta.get('qaTimes',meta['times']);assert len(qa_values)==len(qa_times)
by_frame={round(t*30):v for t,v in zip(qa_times,qa_values)};values=[by_frame[t*30] for t in meta['times']]
assert len(values)==len(meta['times']),(len(values),len(meta['times']))
a=np.array(values,np.float32);wall=a[:,0]>=TH['wallBand'];over=(a[:,3]>TH['overheadWoodTop'])&~wall;sparse=(a[:,2]>TH['sparseWood'])&(a[:,4]<TH['sparseBusy']);sparse_runs=m.runs(sparse,1);sub=a[:,5]
metrics={'samples':len(a),'step':1,'wall_ratio':float(wall.mean()),'overhead_ratio':float(over.mean()),'sparse_longest':sparse_runs[0][1] if sparse_runs else 0,'sparse_runs':sparse_runs,'subject_median':float(np.median(sub)),'subject_small_ratio':float((sub<TH['subjectSmall']).mean()),'subject_small_runs':m.runs(sub<TH['subjectSmall'],1)}
checks={'4':metrics['overhead_ratio']<=TH['overheadMax'],'6':metrics['wall_ratio']>=TH['wallMin'],'7':metrics['sparse_longest']<TH['sparseMax'],'7b':metrics['subject_median']>=TH['subjectMedian'] and metrics['subject_small_ratio']<=TH['subjectSmallMax']}
# Same read-only blocks/gray/gmap/corr functions as the full gate. Only sampling
# interval is 1 second here; final MP4 is still tested at the gate's 0.5 seconds.
with tempfile.NamedTemporaryFile('w',suffix='.txt',delete=False) as f:
    f.write('ffconcat version 1.0\n')
    for t in meta['times']:f.write("file '%s'\nduration 1\n"%(str(Path(meta['review'])/('%03d.jpg'%t)).replace("'","'\\''")))
    concat=f.name
try:
    composite=[m.gray(a) for a in m.run_frames(ff,['-f','concat','-safe','0','-i',concat,'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)]
finally:os.unlink(concat)
assert len(composite)==len(meta['times'])
gray=np.array(composite);df=np.abs(np.diff(m.blocks(gray),axis=0));df[:,int(30*TH['capBand'][0]):int(30*TH['capBand'][1]),:]=0
moving=(df>TH['staticBlockDiff']).sum(axis=(1,2))>=TH['staticBlocks'];static=m.runs(~moving,1)
k=round(TH['endsSec']);first=[m.gmap(a) for a in gray[:k+1]];last=[m.gmap(a) for a in gray[-k-1:]]
metrics.update({'static_longest':static[0][1] if static else 0,'static_runs':static,'ends_corr':max(m.corr(a,b) for a in first for b in last)})
checks.update({'5':metrics['static_longest']<TH['staticMax'],'10':metrics['ends_corr']>=TH['endsMin']})
report={'isPreflight':True,'notFull30fps':True,'pass':all(checks.values()),'checks':checks,'metrics':metrics,'source':str(source),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'scale':'270:480:flags=area','features':[{'time':t,**dict(zip(m.FEATS,v))} for t,v in zip(meta['times'],values)],'allQaFeatures':[{'time':t,'frame':round(t*30),**dict(zip(m.FEATS,v))} for t,v in zip(qa_times,qa_values)]}
(cache/'c1-probe1s-world-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=1));print(json.dumps({k:v for k,v in report.items() if k not in ['features','allQaFeatures']},ensure_ascii=False,indent=1))
raise SystemExit(0 if report['pass'] else 1)
