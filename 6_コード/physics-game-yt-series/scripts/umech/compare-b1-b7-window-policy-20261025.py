"""CPU-only narrowly approved B window-policy comparator, no image writes.

Full-image original zero-difference result is retained separately. No general
2-level image tolerance: all RGB outside the exact approved rectangle is zero.
Output is limited statistics, not a list of every differing pixel.
"""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image
import numpy as np
POLICY=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/axes-20261023/root-b1-window-only-control-policy-20261025.json')
POLICY_SHA='33bb141baf253c1d501e5ce63b9298201996b4ff4efff4ddf5d05e8f10809f5b'
RECTANGLE=(888,0,920,109)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def stamp(p):
 s=Path(p).stat();return(s.st_size,s.st_mtime_ns,s.st_ino,s.st_dev)
def compare(left,right,left_sha,right_sha):
 assert sha(POLICY)==POLICY_SHA
 assert sha(left)==left_sha and sha(right)==right_sha
 before={p:stamp(p)for p in(left,right)}
 with Image.open(left)as im:a=np.array(im.convert('RGB'));aq=im.quantization
 with Image.open(right)as im:b=np.array(im.convert('RGB'));bq=im.quantization
 assert a.shape==b.shape==(1920,1080,3)
 difference=np.abs(a.astype(np.int16)-b.astype(np.int16));changed=np.any(difference!=0,axis=2)
 inside=np.zeros(changed.shape,dtype=bool);x0,y0,x1,y1=RECTANGLE;inside[y0:y1+1,x0:x1+1]=True
 yy,xx=np.where(changed);count=len(xx);outside_max=int(difference[~inside].max())
 window_max=int(difference[inside].max());same_quant=aq==bq
 full_zero=not count
 policy_pass=outside_max==0 and window_max<=2 and count<=500 and same_quant
 assert all(sha(p)==h for p,h in[(left,left_sha),(right,right_sha)])and all(stamp(p)==s for p,s in before.items())
 values,counts=np.unique(difference,return_counts=True)
 return {'left':str(left),'right':str(right),'leftSha256':left_sha,'rightSha256':right_sha,
  'leftDecodedRgbSha256':hashlib.sha256(a.tobytes()).hexdigest(),'rightDecodedRgbSha256':hashlib.sha256(b.tobytes()).hexdigest(),
  'byteExact':left_sha==right_sha,'decodedRgbExact':full_zero,'originalFullImageZeroDifferencePass':full_zero,
  'rootApprovedWindowPolicy':str(POLICY),'rootApprovedWindowPolicySha256':POLICY_SHA,
  'approvedWindowRectangleInclusive':list(RECTANGLE),'imageDimensions':[1080,1920,3],
  'changedPixelCount':count,'maximumChangedPixelCount':500,'maximumAbsoluteChannelDifference':int(difference.max()),
  'maximumAbsoluteChannelDifferenceOutsideApprovedWindow':outside_max,'maximumAbsoluteChannelDifferenceInsideApprovedWindow':window_max,
  'approvedWindowMaximumChannelDifference':2,'allNonWindowRgbExact':outside_max==0,
  'changedPixelBoxInclusive':None if count==0 else[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],
  'absoluteChannelDeltaHistogram':{str(int(v)):int(c)for v,c in zip(values,counts)},
  'quantizationExactlyEqual':same_quant,'criterion':'Exact all-principal/non-window RGB, or explicitly approved tiny window-only residual',
  'allExactPrincipalOrApprovedBackgroundOnly':policy_pass,'pass':policy_pass,
  'originalZeroDifferenceCriterionChanged':False,'originalZeroDifferenceNGRetained':not full_zero,
  'fullPixelDifferencesEnumerated':False,'renderOrEncodePerformed':False,'filesWritten':0,'rootFinalImageApproval':False,'finalAcceptance':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--left',required=True);p.add_argument('--right',required=True);p.add_argument('--left-sha256',required=True);p.add_argument('--right-sha256',required=True)
 a=p.parse_args();result=compare(Path(a.left),Path(a.right),a.left_sha256,a.right_sha256)
 print(json.dumps(result,ensure_ascii=False,allow_nan=False));raise SystemExit(0 if result['pass']else 2)
