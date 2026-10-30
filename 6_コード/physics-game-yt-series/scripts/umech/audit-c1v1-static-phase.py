"""Three actual frames only: diagnose integer sampling, not final gate 5."""
import os,json,hashlib,importlib.util,tempfile
from pathlib import Path
import numpy as np
W=Path(__file__).resolve().parents[2];root=Path('/private/tmp/ys/ys-chain-c1v1');cache=root/'r12-probe-preflight'
meta=json.loads((cache/'c1-probe1s-metadata.json').read_text());th=meta['thresholds']
source=W/'scripts/umech/desk-quality-gate-frames.py';spec=importlib.util.spec_from_file_location('unaltered_c1_phase_features',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
files=[root/'r11-probe-preflight/probe1s-review-c1v1/136.jpg',cache/'trial-review/frame-04095.jpg',root/'r11-probe-preflight/probe1s-review-c1v1/137.jpg'];times=[136,136.5,137]
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
with tempfile.NamedTemporaryFile('w',suffix='.txt',delete=False) as f:
    f.write('ffconcat version 1.0\n')
    for path in files:f.write("file '%s'\nduration 1\n"%str(path))
    concat=f.name
try:gray=np.array([m.gray(a) for a in m.run_frames(ff,['-f','concat','-safe','0','-i',concat,'-vf','scale=270:480:flags=area','-fps_mode','passthrough'],270,480)])
finally:os.unlink(concat)
assert len(gray)==3
df=np.abs(np.diff(m.blocks(gray),axis=0));df[:,int(30*th['capBand'][0]):int(30*th['capBand'][1]),:]=0
counts=(df>th['staticBlockDiff']).sum(axis=(1,2));direct=np.abs(m.blocks(gray[[0,2]])[1]-m.blocks(gray[[0,2]])[0]);direct[int(30*th['capBand'][0]):int(30*th['capBand'][1]),:]=0
report={'diagnosticOnly':True,'notFullGate5':True,'notMP4':True,'times':times,'files':[{'file':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files],'originalSource':str(source),'originalSourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'thresholds':{k:th[k] for k in ['capBand','staticBlockDiff','staticBlocks']},'changedBlocks':[int(v) for v in counts],'movingAtHalfSecond':[bool(v>=th['staticBlocks']) for v in counts],'direct136to137ChangedBlocks':int((direct>th['staticBlockDiff']).sum()),'actualExistingHighlight':[136.39,136.99],'noNewHighlightAdded':True}
(cache/'c1-static-phase-diagnostic.json').write_text(json.dumps(report,ensure_ascii=False,indent=1));print(json.dumps(report,ensure_ascii=False,indent=1))
