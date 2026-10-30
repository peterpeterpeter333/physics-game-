"""Actual preview bookends; original read-only gray/gmap/corr, no masks."""
import importlib.util,json,os,subprocess,sys
import numpy as np
folder=sys.argv[1];out=sys.argv[2]
spec=importlib.util.spec_from_file_location('original_desk_features',os.path.join(os.path.dirname(__file__),'desk-quality-gate-frames.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
ff=os.environ.get('FFMPEG','/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
times=json.load(open(folder+'/comparison-e1v1.json'))['times'];rows=[]
duration=json.load(open('/private/tmp/ys/ys-chain-e1v1/blender/data.json'))['duration']
for i,t in enumerate(times):
    if not(t<=2 or t>=duration-2):continue
    file=folder+'/preview-%02d.png'%(i+1)
    p=subprocess.run([ff,'-v','error','-i',file,'-vf','scale=270:480:flags=area','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
    im=np.frombuffer(p.stdout,np.uint8).reshape(480,270,3);rows.append((t,m.gmap(m.gray(im))))
pairs=[{'first':a,'last':b,'corr':m.corr(am,bm)} for a,am in rows if a<=2 for b,bm in rows if b>=duration-2]
result={'scope':'available actual first/last two-second preview samples, NOT final MP4 gate','duration':duration,'first':[t for t,_ in rows if t<=2],'last':[t for t,_ in rows if t>=duration-2],'sameOriginalFunctions':True,'scale':'270:480:flags=area','extraMask':False,'pairs':pairs,'maxCorr':max(p['corr'] for p in pairs),'passAtOriginalPoint5':max(p['corr'] for p in pairs)>=.5}
json.dump(result,open(out,'w'),ensure_ascii=False,indent=2);print(json.dumps(result,ensure_ascii=False,indent=2))
