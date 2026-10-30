"""E1 preview-only 7b diagnostics, calling the original unmodified features()."""
import os,sys,json,glob,subprocess,importlib.util
import numpy as np
HERE=os.path.dirname(__file__)
spec=importlib.util.spec_from_file_location('original_desk_features',os.path.join(HERE,'desk-quality-gate-frames.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
source='/private/tmp/ys/ys-chain-e1v1'
folder=sys.argv[1] if len(sys.argv)>1 else source+'/blender/gate-e1v1-r2/frames'
output=sys.argv[2] if len(sys.argv)>2 else source+'/e1v1-r2-preview-frame-features.json'
ff=os.environ.get('FFMPEG','/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
data=json.load(open(source+'/blender/data.json'));frames=[]
def timed_runs(rows,predicate,step):
    # Discontinuous keyframes must not be compressed into a false long run.
    out=[];start=None;previous=None
    for f in rows+[None]:
        hit=f is not None and predicate(f)
        contiguous=previous is None or f is not None and abs(f['t']-previous-step)<1e-6
        if start is not None and (not hit or not contiguous):out.append((start,round(previous-start+step,3)));start=None
        if hit and start is None:start=f['t']
        previous=f['t'] if f is not None else None
    return sorted(out,key=lambda r:-r[1])
for file in sorted(glob.glob(folder+'/*.jpg')+glob.glob(folder+'/*.png')):
    stem=os.path.splitext(os.path.basename(file))[0]
    if not stem.isdigit():continue
    t=int(stem)/30
    p=subprocess.run([ff,'-v','error','-i',file,'-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
    image=np.frombuffer(p.stdout,np.uint8).reshape(480,270,3)
    feat=dict(zip(m.FEATS,m.features(image)));cue=next((c for c in reversed(data['cues']) if c['start']<=t),data['cues'][0])
    frames.append({'t':t,'key':cue['key'],'row':cue['row'],'file':file,**feat})
if not frames:raise RuntimeError('No actual E1 frames')
result={'scope':'preview samples only, not full film gate','samples':len(frames),'medianSubject':float(np.median([f['subject'] for f in frames])),'smallRatio':sum(f['subject']<.35 for f in frames)/len(frames),'frames':frames}
seconds=[f for f in frames if abs(f['t']-round(f['t']))<1e-7]
if seconds:
    result['integerSeconds']={'samples':len(seconds),'completeGrid':len(seconds)==int(np.ceil(data['duration'])) and all(abs(f['t']-i)<1e-7 for i,f in enumerate(seconds)),'medianSubject':float(np.median([f['subject'] for f in seconds])),'smallRatio':sum(f['subject']<.35 for f in seconds)/len(seconds),'sparseRuns':timed_runs(seconds,lambda f:f['wood']>.85 and f['busy']<.02,1),'wallRatio':sum(f['wall_band']>=.03 for f in seconds)/len(seconds)}
if len(sys.argv)>3:
    manifest=json.load(open(sys.argv[3]));actual=sorted(manifest['frames'],key=lambda f:f['t']);gray=[]
    for f in actual:
        p=subprocess.run([ff,'-v','error','-i',f['file'],'-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
        gray.append(m.gray(np.frombuffer(p.stdout,np.uint8).reshape(480,270,3)))
    if gray:
        pairs=[]
        for i in range(len(actual)-1):
            if abs(actual[i+1]['t']-actual[i]['t']-.5)>1e-6:continue
            df=np.abs(m.blocks(np.array(gray[i:i+2]))[1]-m.blocks(np.array(gray[i:i+2]))[0]);df[int(30*.55):int(30*.75),:]=0
            pairs.append({'start':actual[i]['t'],'end':actual[i+1]['t'],'changedBlocks':int((df>3).sum()),'moving':bool((df>3).sum()>=2)})
        result['sampledHalfSecondPairs']=pairs
        beginning=[m.gmap(g) for f,g in zip(actual,gray) if f['t']<=2];ending=[m.gmap(g) for f,g in zip(actual,gray) if f['t']>=data['duration']-2]
        if beginning and ending:result['sampledEnds']={'scope':'available first/last 2sec samples, not final MP4 gate','firstSamples':len(beginning),'lastSamples':len(ending),'corr':max(m.corr(a,b) for a in beginning for b in ending)}
        inds=[i for i,f in enumerate(actual) if abs(f['t']-round(f['t']))<1e-7]
        if len(inds)==int(np.ceil(data['duration'])) and all(abs(actual[k]['t']-i)<1e-7 for i,k in enumerate(inds)):
            gr=np.array([gray[i] for i in inds]);b=m.blocks(gr);df=np.abs(np.diff(b,axis=0));df[:,int(30*.55):int(30*.75),:]=0;r=m.runs((df>3).sum(axis=(1,2))<2,1)
            result['oneSecondComposite']={'scope':'complete 1sec grid, not final 0.5sec MP4 gate','samples':len(inds),'staticRuns':r[:10],'staticLongest':r[0][1] if r else 0,'endsCorr':max(m.corr(a,b) for a in [m.gmap(g) for g in gr[:3]] for b in [m.gmap(g) for g in gr[-3:]])}
json.dump(result,open(output,'w'),ensure_ascii=False,indent=2)
print(json.dumps({k:v for k,v in result.items() if k!='frames'},ensure_ascii=False))
for f in frames:print('%.2f %-14s subject=%.3f wood=%.3f busy=%.3f wall=%.3f'%(f['t'],f['key'],f['subject'],f['wood'],f['busy'],f['wall_band']))
