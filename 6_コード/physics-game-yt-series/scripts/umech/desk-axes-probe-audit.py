"""Preflight diagnostics of actual one-second renders; not a replacement for the final MP4 gate."""
import os,sys,json,glob,subprocess,importlib.util,tempfile,math
import numpy as np
spec=importlib.util.spec_from_file_location('unchanged_desk_features',os.path.join(os.path.dirname(__file__),'desk-quality-gate-frames.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
cache,folder,out=sys.argv[1:4]
data=json.load(open(cache+'/blender/data.json'));data=data.get('b1',data)
duration=data.get('duration',json.load(open(cache+'/plan.json'))[0].get('duration'))
if duration is None:duration=json.load(open(cache+'/'+json.load(open(cache+'/plan.json'))[0]['id']+'.json'))['duration']
expected=range(math.ceil(duration));files=[folder+'/%05d.jpg'%(s*30) for s in expected]
missing=[f for f in files if not os.path.exists(f)]
if missing:raise RuntimeError('Incomplete one-second probe: '+str(len(missing))+' missing; first '+missing[0])
ff=os.environ.get('FFMPEG','/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
with tempfile.NamedTemporaryFile('w',suffix='.ffconcat',delete=False) as listing:
    listing.write('ffconcat version 1.0\n')
    for f in files:listing.write("file '%s'\nduration 1\n"%f.replace("'","'\\''"))
    listpath=listing.name
frames=[]
try:
    for sec,img in enumerate(m.run_frames(ff,['-f','concat','-safe','0','-i',listpath,'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)):
        if sec>=len(files):break
        cue=next((c for c in data['cues'] if c['start']<=sec<c['end']),data['cues'][-1])
        frames.append({'t':sec,'row':cue['row'],'key':cue['key'],'file':files[sec],**dict(zip(m.FEATS,m.features(img)))})
finally:os.unlink(listpath)
assert len(frames)==len(files),(len(frames),len(files))
result={'scope':'actual integer-second raw Blender frames; not the final 0.5-second MP4 gate',
 'samples':len(frames),'duration':duration,'medianSubject':float(np.median([f['subject'] for f in frames])),
 'smallRatio':sum(f['subject']<.35 for f in frames)/len(frames),
 'smallRuns':m.runs([f['subject']<.35 for f in frames],1),
 'sparseRuns':m.runs([f['wood']>.85 and f['busy']<.02 for f in frames],1),
 'wallRatio':sum(f['wall_band']>=.03 for f in frames)/len(frames),'frames':frames}
json.dump(result,open(out,'w'),ensure_ascii=False,indent=1)
print(json.dumps({k:v for k,v in result.items() if k!='frames'},ensure_ascii=False))
