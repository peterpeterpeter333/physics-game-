"""Original, immutable image features and ends algorithm on actual r8 frames."""
import os,json,hashlib,importlib.util,subprocess
from pathlib import Path
import numpy as np
W=Path(__file__).resolve().parents[2];cache=Path('/private/tmp/ys/ys-chain-c1v1');rev=os.environ.get('C1_TRIAL_REV','r8');assert rev in ['r8','r9'];wrapped=os.environ.get('C1_WRAPPED')=='1';folder=cache/('r9-private-title-check/review' if wrapped else rev+'-preflight/review');meta=json.loads((folder/'manifest.json').read_text())
source=W/'scripts/umech/desk-quality-gate-frames.py';spec=importlib.util.spec_from_file_location('c1_r8_original_features',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
def img(p):
 r=subprocess.run([ff,'-v','error','-i',str(p),'-frames:v','1','-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,check=True)
 return np.frombuffer(r.stdout,np.uint8).reshape(480,270,3)
records=[]
for t in meta['times']:records.append({'time':t,**dict(zip(m.FEATS,m.features(img(Path(meta['raw'])/('%05d.jpg'%round(t*30))))))})
first=[m.gmap(m.gray(img(folder/('%d.png'%t)))) for t in [0,1,2]];last=[m.gmap(m.gray(img(folder/('%d.png'%t)))) for t in [358,359,360]]
out={'isPreflight':True,'notFull30fps':True,'notTimeWeighted':True,'scale':'270:480:flags=area','algorithmSourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'endsCorr':max(m.corr(a,b) for a in first for b in last),'records':records}
(cache/('c1-trial-'+rev+('-private-title' if wrapped else '')+'-features.json')).write_text(json.dumps(out,ensure_ascii=False,indent=1));print(json.dumps(out,ensure_ascii=False,indent=1))
