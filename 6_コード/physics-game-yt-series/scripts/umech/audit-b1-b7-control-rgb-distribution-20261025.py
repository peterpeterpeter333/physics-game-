"""CPU JPEG-difference diagnosis only. No render, encode, tolerance or verdict change."""
import hashlib,json,collections
from pathlib import Path
from PIL import Image
import numpy as np
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=Path('/private/tmp/ys/ys-chain-b1v1-b7-cache-recovery-20261025/probe/before-controls.json')
OUT=W/'outputs/axes-20261023/b1-b7-119b-control-rgb-distribution-20261025.json'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert not OUT.exists()
m=json.loads(SOURCE.read_text());rows=[]
for record in m['actualImages']:
    left,right=Path(record['source']),Path(record['path'])
    assert sha(left)==record['sourceSha256']and sha(right)==record['sha256']
    with Image.open(left)as im:
        a=np.array(im.convert('RGB'));qa=im.quantization;left_header={k:str(v)for k,v in im.info.items()}
    with Image.open(right)as im:
        b=np.array(im.convert('RGB'));qb=im.quantization;right_header={k:str(v)for k,v in im.info.items()}
    assert a.shape==b.shape==(1920,1080,3)
    signed=b.astype(np.int16)-a.astype(np.int16);absolute=np.abs(signed);mask=np.any(absolute!=0,axis=2)
    yy,xx=np.where(mask);n=len(xx)
    coords=sorted(zip(xx.tolist(),yy.tolist()))
    pixel_rows=[{'x':int(x),'y':int(y),'oldRGB':a[y,x].tolist(),'newRGB':b[y,x].tolist(),
        'signedDelta':signed[y,x].tolist()}for x,y in coords]if n<=500 else []
    blocks=collections.Counter((int(x)//8,int(y)//8)for x,y in coords)
    rows.append({'frame':record['frame'],'left':str(left),'right':str(right),'leftSha256':sha(left),'rightSha256':sha(right),
        'quantizationExact':qa==qb,'leftHeader':left_header,'rightHeader':right_header,
        'pixelCount':int(mask.size),'changedPixelCount':n,'changedPixelFraction':n/mask.size,
        'changedChannelCount':int(np.count_nonzero(absolute)),
        'maximumAbsoluteChannelDifference':int(absolute.max()),'absoluteChannelDeltaHistogram':{str(int(k)):int(v)for k,v in zip(*np.unique(absolute,return_counts=True))},
        'signedNonzeroChannelHistogram':{str(int(k)):int(v)for k,v in zip(*np.unique(signed[signed!=0],return_counts=True))},
        'changedPixelBoxInclusive':None if n==0 else[int(xx.min()),int(yy.min()),int(xx.max()),int(yy.max())],
        'perChannelChangedPixels':[int(np.count_nonzero(absolute[:,:,c]))for c in range(3)],
        'meanAbsoluteChannelDifference':float(absolute.mean()),'rootMeanSquaredChannelDifference':float(np.sqrt(np.mean(signed.astype(np.float64)**2))),
        'changed8x8Blocks':[{'blockX':x,'blockY':y,'changedPixelCount':count}for(x,y),count in sorted(blocks.items())],
        'exactChangedPixelValuesIfAtMost500':pixel_rows,'oldZeroDifferenceCriterionPass':not n,
        'criterionChanged':False,'actualPersonallyViewed':False})
report={'episode':'B-1','reviewer':'/root/b1_final_cpu_preflight','kind':'Actual119b failed-control CPU residual distribution; no waiver',
    'source':str(SOURCE),'sourceSha256':sha(SOURCE),'rows':rows,'actualControlCount':len(rows),
    'strictCleanupProtectionChecks':m['protectionChecks'],'strictCleanupOffenderCount':len(m['restorationOffenders']),
    'cleanupError':m['cleanupError'],'allStrictCleanupChecksPass':all(v is True for v in m['protectionChecks'].values())and not m['restorationOffenders']and m['cleanupError']is None,
    'oldZeroDifferenceNGPreserved':True,'newRenderFloorHypothesisProven':False,'renderOrEncodePerformed':False,
    'originalThresholdsChanged':False,'finalAcceptance':False,'writerSha256':sha(__file__)}
with OUT.open('x')as f:json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
print(json.dumps({'path':str(OUT),'sha256':sha(OUT),'rows':[{k:r[k]for k in ['frame','changedPixelCount','changedChannelCount','maximumAbsoluteChannelDifference','changedPixelBoxInclusive','meanAbsoluteChannelDifference']}for r in rows],
    'allStrictCleanupChecksPass':report['allStrictCleanupChecksPass'],'finalAcceptance':False},indent=2))
