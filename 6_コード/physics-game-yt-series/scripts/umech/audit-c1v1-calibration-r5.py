"""Read-only original features/gmap on C1 calibration images, area scaled."""
import os,json,hashlib,importlib.util,subprocess
from pathlib import Path
import numpy as np
W=Path(__file__).resolve().parents[2];cache=Path(os.environ.get('EM_FILM_CACHE','/private/tmp/ys/ys-chain-c1v1'))
rev=os.environ.get('C1_CAL_REV','r5');assert rev in ['r5','r6'];folder=cache/('calibration-review-c1v1-'+rev);manifest=json.loads((folder/'manifest.json').read_text())
source=W/'scripts/umech/desk-quality-gate-frames.py';spec=importlib.util.spec_from_file_location('unchanged_c1_r5_features',source);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff=os.environ.get('FFMPEG','/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
def img(p):
 r=subprocess.run([ff,'-v','error','-i',str(p),'-frames:v','1','-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE,check=True)
 return np.frombuffer(r.stdout,np.uint8).reshape(480,270,3)
first=[m.gmap(m.gray(img(cache/'probe1s-review-c1v1'/('%03d.jpg'%t)))) for t in [0,1,2]]
records=[]
for c in manifest['records']:
 a=img(c['file']);b=m.gray(img(c['composite']));records.append({'tag':c['tag'],'time':c['time'],'pose':c['pose'],'focus':c['focus'],'fstop':c['fstop'],'paperCount':c['paperCount'],'compactPaperSpacing':c['compactPaperSpacing'],**dict(zip(m.FEATS,m.features(a))),'endsCorrelationAgainstR4First012':max(m.corr(x,m.gmap(b)) for x in first) if c['tag'].startswith('end-') else None})
out={'isCalibration':True,'notFinalVideo':True,'scale':'270:480:flags=area','algorithmSource':str(source),'algorithmSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'initialFrames':[0,1,2],'records':records}
if rev=='r6':
 out['sameCameraFirstLast']=[]
 for i in range(4):
  group=[c for c in manifest['records'] if c['tag'].startswith('desk-%d-'%i)];starts=[m.gmap(m.gray(img(c['composite']))) for c in group if c['time']<3];ends=[m.gmap(m.gray(img(c['composite']))) for c in group if c['time']>350]
  out['sameCameraFirstLast'].append({'candidate':i,'pose':group[0]['pose'],'endsCorrelation':max(m.corr(x,y) for x in starts for y in ends),'sameCamera':True,'startTimes':[0,1,2],'endTimes':[358,359,360]})
(folder/'audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=1));print(json.dumps(out,ensure_ascii=False,indent=1))
