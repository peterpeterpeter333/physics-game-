"""Join original final numerical results to latest exact delivered physical states.

No original gate value is replaced. Physical bounds alone never mark a proxy
disagreement accepted; the actual encoded half-second image must be reviewed.
"""
import argparse,hashlib,json,os,time
from pathlib import Path
import numpy as np
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',required=True);ap.add_argument('--npz');ap.add_argument('--gate');a=ap.parse_args();root=Path(a.root)
    npz=Path(a.npz or root/'c1-final-gate-frame-data.npz');gatepath=Path(a.gate or root/'quality-gate.json');gate=read(gatepath)
    proof=read(root/'camera-patch.json');exported=read(root/'c1-final-export.json');original=Path(proof['originalRoot']);prod=read(original/'c1-production-r13.json')
    physical=read(root/'final-held-dimensions.json');old721=read(original/'c1-final-held-halfsecond-bounds.json');actual=read(root/'actual-final-review/actual-final-index.json')
    output=root/'c1-final-original7b-physical-supplement.json';assert not output.exists()
    assert gate['id']=='ys-chain-c1v1' and gate['mp4']==exported['video'] and sha(gate['mp4'])==exported['videoSha256']==actual['mp4Sha256']
    assert sha(root/'camera-patch.json')==exported['patchProofSha256'] and prod['status']=='done' and prod['missing']==0
    frozen={**prod['sourceSha256'],**prod['immutableInputSha256'],**proof.get('patchDependencySha256',{})}
    assert all(sha(p)==h for p,h in frozen.items())
    z=np.load(npz);names=list(z['feat_names']);features=z['desk_feat'];times=z['desk_t'];th=gate['thresholds'];metrics=gate['metrics']
    assert names==['wall_band','window','wood','wood_top','busy','subject'] and len(times)==len(features)==721
    assert list(times)==[k*.5 for k in range(721)] and metrics['world_source']=='desk'
    assert th['step']==.5 and th['subjectSmall']==.35 and th['subjectSmallMax']==.2 and th['subjectMedian']==.6
    assert round(float(np.median(features[:,5])),4)==metrics['subject_median']
    assert round(float((features[:,5]<th['subjectSmall']).mean()),4)==metrics['subject_small_ratio']
    bytime={r['time']:r for r in physical['samples']};oldbytime={r['time']:r for r in old721['rows']};actualbyframe={r['frame']:r for r in actual['frames']}
    paperpath=root/'visible-paper-hold-dimensions.json';paper=read(paperpath) if paperpath.exists() else None
    if paper is not None:assert paper['cameraPatchProofSha256']==sha(root/'camera-patch.json')
    paperbytime={r['time']:r for r in paper['rows']} if paper is not None else {}
    replacement=proof['replacementFrameToActualPatchFrame'];semantic=proof.get('deliveredSemanticSourceMap')
    rows=[]
    for t,feat in zip(times,features):
        t=float(t);p=bytime[t];j=round(t*30);assert p['frame']==j
        raw=root/'blender/desk'/('%05d.jpg'%j)
        source=Path(proof['raw'])/('%05d.jpg'%replacement[str(j)]) if str(j) in replacement else Path(prod['out'])/('%05d.jpg'%oldbytime[t]['heldSourceFrame'])
        assert sha(raw)==sha(source),'Delivered JPEG does not equal the recorded actual source'
        if semantic is not None:assert p['objectSourceFrame']==semantic[j]
        image=actualbyframe[j];assert image['originalGateHalfSecond'] and sha(image['file'])==image['sha256']
        small=bool(feat[5]<th['subjectSmall']);sparse=bool(feat[2]>th['sparseWood'] and feat[4]<th['sparseBusy'])
        effective=paperbytime.get(t,p)
        candidate=bool((small or sparse) and effective['within40to70'] and not effective['clipped'] and (t in paperbytime or p['maximumWorldZ']>0))
        rows.append({**p,'effectiveVisibleNamedSubject':effective,'cueSubjectEvidenceNotOverwritten':True,'originalProxyFeatures':dict(zip(names,map(float,feat))),'originalProxySmall':small,'originalProxySparse':sparse,'candidateProxyDisagreementOnly':candidate,'accepted':False,'humanDecision':'pending actual encoded image review; not accepted by geometry alone','deliveredRaw':str(raw),'deliveredRawSha256':sha(raw),'actualHeldSource':str(source),'actualEncodedFrame':image['file'],'actualEncodedFrameSha256':image['sha256'],'originalR13PhysicalState':oldbytime[t]})
    report={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'episode':'ys-chain-c1v1','cache':str(root),'notAReplacementGate':True,'originalGatePassUnchanged':gate['pass'],'originalResultsUnchanged':gate['results'],'originalThresholdsUnchanged':th,'originalMetricsUnchanged':metrics,'acceptance':'User permits exact physical bounds plus actual human visual review for genuine 7b/sparse proxy disagreements only. Numerical NG remains NG. This join never auto-accepts a sample. Real framing or visibility defects must be corrected.','sampleCount':721,'smallProxySamples':sum(r['originalProxySmall'] for r in rows),'sparseProxySamples':sum(r['originalProxySparse'] for r in rows),'possibleProxyDisagreementCandidates':sum(r['candidateProxyDisagreementOnly'] for r in rows),'physicalWidthOutside40to70':sum(not r['within40to70'] for r in rows),'physicalClipped':sum(r['clipped'] for r in rows),'original721Preserved':str(original/'c1-final-held-halfsecond-bounds.json'),'actualRowsMatchLatestDeliveredSemanticTimes':True,'evidenceSha256':{str(p):sha(p) for p in [gatepath,npz,root/'camera-patch.json',root/'final-held-dimensions.json',root/'actual-final-review/actual-final-index.json',Path(__file__)]},'rows':rows}
    report.update(effectiveVisibleSubjectWidthOutside40to70=sum(not r['effectiveVisibleNamedSubject']['within40to70'] for r in rows),effectiveVisibleSubjectClipped=sum(r['effectiveVisibleNamedSubject']['clipped'] for r in rows),paperHoldExplicitAddendum=str(paperpath) if paper is not None else 'not available; future crowd subject remains uncorrected in this diagnostic, not an actual paper-framing claim')
    if paper is not None:report['evidenceSha256'][str(paperpath)]=sha(paperpath)
    output.write_text(json.dumps(report,ensure_ascii=False,indent=1));print(json.dumps({k:v for k,v in report.items() if k not in {'rows','originalResultsUnchanged','originalThresholdsUnchanged','originalMetricsUnchanged','evidenceSha256'}},ensure_ascii=False))
if __name__=='__main__':main()
