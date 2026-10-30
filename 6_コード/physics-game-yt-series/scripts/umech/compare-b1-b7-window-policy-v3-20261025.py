"""CPU-only fixed two-background-region policy; original RGB0/old policy kept.

No inferred rectangle and no full-image tolerance. Only the two root-approved
inclusive rectangles may differ, with independent per-region channel maxima.
"""
import argparse,hashlib,json,runpy
from pathlib import Path
import numpy as np
from PIL import Image

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/umech/compare-b1-b7-window-policy-v2-20261025.py'
SOURCE_SHA='e8f68141c27a7de90654a0dbb91ba24853f5b19403a9fab60075d5950239e36a'
POLICY=W/'outputs/axes-20261023/root-b1-window-and-edge-background-policy-r2-20261025.json'
POLICY_SHA='0499ccf90a678fc4b21f35c3e699ed2f469aabcaf85262741851f0f245578d14'
REGIONS=(((888,0,920,109),2),((1000,110,1079,255),4))
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def stamp(p):
    s=Path(p).stat();return(s.st_size,s.st_mtime_ns,s.st_ino,s.st_dev)
def compare(left,right,left_sha,right_sha):
    assert sha(SOURCE)==SOURCE_SHA and sha(POLICY)==POLICY_SHA
    policy=json.loads(POLICY.read_text())
    assert policy['supplementalControlPolicyAuthorized']is True and policy['actualViewer']=='root'
    assert [(tuple(x['rectangleInclusive']),x['maximumChannelDelta'])for x in policy['permittedBackgroundRegions']]==list(REGIONS)
    assert policy['maximumChangedBackgroundPixels']==500 and policy['allPixelsOutsideBothRegionsMustRemainRgbExact']is True
    assert policy['quantizationMustRemainIdentical']is True and policy['originalFullImageZeroDifferenceNGMustRemainRecorded']is True
    assert policy['all18NewProbeImagesRequireSeparateRootEyeApproval']is True and policy['finalAcceptance']is False
    old=runpy.run_path(str(SOURCE))['compare'](left,right,left_sha,right_sha)
    before={p:stamp(p)for p in(left,right)}
    with Image.open(left)as im:a=np.array(im.convert('RGB'));aq=im.quantization
    with Image.open(right)as im:b=np.array(im.convert('RGB'));bq=im.quantization
    assert a.shape==b.shape==(1920,1080,3)
    delta=np.abs(a.astype(np.int16)-b.astype(np.int16));changed=np.any(delta!=0,axis=2)
    union=np.zeros(changed.shape,dtype=bool);regions=[]
    for rectangle,limit in REGIONS:
        x0,y0,x1,y1=rectangle;area=delta[y0:y1+1,x0:x1+1]
        union[y0:y1+1,x0:x1+1]=True
        maximum=int(area.max());count=int(np.any(area!=0,axis=2).sum())
        regions.append({'rectangleInclusive':list(rectangle),'maximumAllowedChannelDelta':limit,
            'maximumAbsoluteChannelDifference':maximum,'changedPixelCount':count,'pass':maximum<=limit})
    outside=int(delta[~union].max());count=int(changed.sum());same_quant=aq==bq
    accepted=outside==0 and count<=500 and same_quant and all(r['pass']for r in regions)
    assert old['decodedRgbExact']==(count==0) and old['originalFullImageZeroDifferencePass']==(count==0)
    result={**old,'retainedPriorSingleWindowPolicyComparison':old,
        'rootApprovedWindowPolicy':str(POLICY),'rootApprovedWindowPolicySha256':POLICY_SHA,
        'approvedFixedBackgroundRegions':regions,'allPixelsOutsideApprovedRegionUnionRgbExact':outside==0,
        'maximumAbsoluteChannelDifferenceOutsideApprovedRegionUnion':outside,
        'maximumTotalChangedBackgroundPixels':500,'totalChangedBackgroundPixels':count,
        'criterion':'Exact RGB outside two explicitly root-approved fixed background regions; each region independently bounded',
        'comparisonMethod':'Root r2 fixed union: window max2 plus extreme-right blurred background max4; total500; outside union RGB0; original full-image0 and prior policy results retained',
        'allExactPrincipalOrApprovedBackgroundOnly':accepted,'pass':accepted,
        'priorSingleWindowPolicyPassUnchanged':old['pass'],'fullImageRgbExactNotInferredFromPolicyPass':True,
        'rootFinalImageApproval':False,'finalAcceptance':False}
    assert result['decodedRgbExact']==old['decodedRgbExact']
    assert result['originalFullImageZeroDifferencePass']==old['originalFullImageZeroDifferencePass']
    assert result['originalZeroDifferenceNGRetained']==old['originalZeroDifferenceNGRetained']
    assert all(sha(p)==h for p,h in[(left,left_sha),(right,right_sha)]) and all(stamp(p)==s for p,s in before.items())
    assert sha(SOURCE)==SOURCE_SHA and sha(POLICY)==POLICY_SHA
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--left',required=True);p.add_argument('--right',required=True);p.add_argument('--left-sha256',required=True);p.add_argument('--right-sha256',required=True)
    a=p.parse_args();result=compare(Path(a.left),Path(a.right),a.left_sha256,a.right_sha256)
    print(json.dumps(result,ensure_ascii=False,allow_nan=False));raise SystemExit(0 if result['pass']else 2)
