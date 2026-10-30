"""r7 real trial frames, unchanged features and first/last correlation only."""
import os,json,hashlib,importlib.util,subprocess
from pathlib import Path
import numpy as np
W=Path(__file__).resolve().parents[2];cache=Path('/private/tmp/ys/ys-chain-c1v1');folder=cache/'r7-preflight/gate-c-c1v1'
source=W/'scripts/umech/desk-quality-gate-frames.py';spec=importlib.util.spec_from_file_location('c1_r7_original_features',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
def img(p):
 r=subprocess.run([ff,'-v','error','-i',str(p),'-frames:v','1','-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,check=True)
 return np.frombuffer(r.stdout,np.uint8).reshape(480,270,3)
meta=json.loads((cache/'blender/gate-c1v1-r7-run.json').read_text());records=[]
for t in meta['times']:
 a=img(cache/'blender/preview'/('%05d.jpg'%round(t*30)));records.append({'time':t,**dict(zip(m.FEATS,m.features(a)))})
first=[m.gmap(m.gray(img(folder/('extra-%d.png'%t)))) for t in [0,1,2]]
last=[m.gmap(m.gray(img(folder/('extra-%d.png'%t)))) for t in [358,359,360]]
out={'isPreflight':True,'notFull30fps':True,'notTimeWeighted':True,'scale':'270:480:flags=area','algorithmSourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'endsCorr':max(m.corr(a,b) for a in first for b in last),'records':records}
(cache/'c1-trial-r7-features.json').write_text(json.dumps(out,ensure_ascii=False,indent=1));print(json.dumps(out,ensure_ascii=False,indent=1))
