"""Original image-feature diagnostics on irregular actual keyframes, not final acceptance."""
import sys,os,json,subprocess,importlib.util,tempfile
import numpy as np
cache,folder,times_file,out=sys.argv[1:5]
times=json.load(open(times_file));times=times['times'] if isinstance(times,dict) else times
spec=importlib.util.spec_from_file_location('unchanged_desk_features',os.path.join(os.path.dirname(__file__),'desk-quality-gate-frames.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
files=[folder+'/%05d.jpg'%round(t*30) for t in times]
assert all(os.path.exists(p) for p in files),'Missing actual image; do not use nearest-frame fallback'
with tempfile.NamedTemporaryFile('w',suffix='.ffconcat',delete=False) as listing:
 listing.write('ffconcat version 1.0\n')
 for p in files:listing.write("file '%s'\nduration 1\n"%p.replace("'","'\\''"))
 listpath=listing.name
frames=[]
try:
 for i,img in enumerate(m.run_frames(ff,['-f','concat','-safe','0','-i',listpath,'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)):
  if i>=len(times):break
  frames.append({'time':times[i],'file':files[i],**dict(zip(m.FEATS,m.features(img)))})
finally:os.unlink(listpath)
assert len(frames)==len(times)
report={'scope':'biased irregular real keyframes, NOT a full-duration or final MP4 gate','samples':len(frames),'medianSubject':float(np.median([f['subject'] for f in frames])),'smallRatio':sum(f['subject']<.35 for f in frames)/len(frames),'frames':frames}
json.dump(report,open(out,'w'),indent=1);print(json.dumps({k:v for k,v in report.items() if k!='frames'}))
