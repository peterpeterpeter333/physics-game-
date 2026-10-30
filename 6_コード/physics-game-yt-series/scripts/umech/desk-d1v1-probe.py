"""D-1 preview diagnostics; call unchanged original feature extraction, never a gate substitute."""
import argparse,hashlib,importlib.util,json,pathlib,subprocess,tempfile
import numpy as np
ap=argparse.ArgumentParser();ap.add_argument('--frames',required=True);ap.add_argument('--cache',default='/private/tmp/ys/ys-chain-d1v1-render');ap.add_argument('--out',required=True);ap.add_argument('--integer-only',action='store_true');args=ap.parse_args()
base=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('d1_original_frame_features',base/'desk-quality-gate-frames.py')
original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)
cache=pathlib.Path(args.cache);data=json.loads((cache/'blender/data.json').read_text());th=json.loads((cache/'quality-gate.json').read_text())['thresholds']
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
files=sorted(p for p in pathlib.Path(args.frames).glob('*.jpg') if p.stem.isdigit())
if args.integer_only:files=[p for p in files if int(p.stem)%30==0]
if not files:raise RuntimeError('No D1 preview frames')
target=pathlib.Path(args.out)
if target.exists():raise RuntimeError('Existing D1 diagnostic preserved; choose a new --out')
with tempfile.TemporaryDirectory(prefix='d1-probe-',dir='/private/tmp') as temp:
    listing=pathlib.Path(temp)/'frames.txt'
    listing.write_text('ffconcat version 1.0\n'+''.join("file '%s'\nduration 1\n"%str(p).replace("'","'\\''") for p in files))
    feat=[];detail_maps=[]
    for img in original.run_frames(ff,['-f','concat','-safe','0','-i',str(listing),'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480):
        feat.append(original.features(img));detail_maps.append(original.gmap(original.gray(img)))
if len(feat)!=len(files):raise RuntimeError(('D1 diagnostic frame count',len(feat),len(files)))
ts=np.array([int(p.stem)/30 for p in files]);ft=np.array(feat);rows=[]
for t,f,p in zip(ts,ft,files):
    c=next((c for c in data['cues'] if c['start']<=t<c['end']),data['cues'][-1]);rows.append({'time':round(float(t),4),'cue':c['key'],'group':c['group'],'frame':str(p),**dict(zip(original.FEATS,map(float,f)))})
uniform=len(ts)>1 and np.allclose(np.diff(ts),np.diff(ts)[0],atol=.002)
expected=np.arange(int(np.ceil(data['duration'])),dtype=float)
complete=len(ts)==len(expected) and np.allclose(ts,expected,atol=.002)
result={'episode':'D-1','status':'PREVIEW DIAGNOSTIC ONLY; not full-video gate','frames':len(files),'uniformTimeSamples':bool(uniform),'completeIntegerSecondCoverage':bool(complete),'expectedIntegerSeconds':len(expected),'originalFeatures':str(base/'desk-quality-gate-frames.py'),'originalFeaturesSha256':hashlib.sha256((base/'desk-quality-gate-frames.py').read_bytes()).hexdigest(),'subjectMetricIsImageHeuristicNotMeasuredPhysicalWidth':True,'rows':rows}
if uniform:
    step=float(np.median(np.diff(ts)));sparse=(ft[:,2]>th['sparseWood'])&(ft[:,4]<th['sparseBusy']);small=ft[:,5]<th['subjectSmall'];wall=ft[:,0]>=th['wallBand']
    result['fullSpanEstimate' if complete else 'partialSpanEstimate']={'sampleStep':step,'first':float(ts[0]),'last':float(ts[-1]),'subjectMedian':float(np.median(ft[:,5])),'subjectSmallRatio':float(small.mean()),'subjectSmallRuns':original.runs(small,step),'sparseRuns':original.runs(sparse,step),'wallRatio':float(wall.mean()),'overheadRatio':float(((ft[:,3]>th['overheadWoodTop'])&~wall).mean())}
    result['byCue']=[{'cue':c['key'],'sampleCount':sum(r['cue']==c['key'] for r in rows),'subjectMedian':float(np.median([r['subject'] for r in rows if r['cue']==c['key']])),'smallRatio':float(np.mean([r['subject']<th['subjectSmall'] for r in rows if r['cue']==c['key']]))} for c in data['cues'] if any(r['cue']==c['key'] for r in rows)]
    if complete:
        window=float(th['endsSec']);k=int(round(window/step));first=list(range(0,min(len(ts),k+1)));last=list(range(max(0,len(ts)-k-1),len(ts)))
        pairs=[{'firstTime':float(ts[a]),'lastTime':float(ts[b]),'correlation':original.corr(detail_maps[a],detail_maps[b])} for a in first for b in last]
        result['endsPreview']={'status':'Raw 3D integer-second subset only; not final encoded gate10','sampleStep':step,'windowSeconds':window,'best':max(pairs,key=lambda p:p['correlation']),'pairs':pairs}
target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(result,ensure_ascii=False,indent=1));print(json.dumps({k:v for k,v in result.items() if k not in ['rows','byCue']},ensure_ascii=False,indent=1))
