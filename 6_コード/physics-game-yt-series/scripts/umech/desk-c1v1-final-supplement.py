"""Join unchanged final gate NPZ with exact held-source physical bounds.

No original result/threshold is changed and no candidate is automatically
accepted. Human review must decide whether each mismatch is genuine.
"""
import argparse,hashlib,json,os,time
import numpy as np

def sha(p):
    with open(p,'rb') as f:return hashlib.sha256(f.read()).hexdigest()

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',default='/private/tmp/ys/ys-chain-c1v1');ap.add_argument('--npz');ap.add_argument('--gate');o=ap.parse_args()
    root=o.root;npz=o.npz or root+'/c1-final-gate-frame-data.npz';gate_path=o.gate or root+'/render-r13-cache/quality-gate.json'
    bounds_path=root+'/c1-final-held-halfsecond-bounds.json';output=root+'/c1-final-original7b-physical-supplement.json'
    assert not os.path.exists(output),'Preserve prior final supplement'
    bounds=json.load(open(bounds_path));gate=json.load(open(gate_path));production=json.load(open(root+'/c1-production-r13.json'));exported=json.load(open(root+'/c1-export-r13.json'))
    assert production['status']=='done' and production['missing']==0
    assert bounds['productionSourceSha256']==production['sourceSha256'] and bounds['immutableInputSha256']==production['immutableInputSha256']
    for p,h in {**production['sourceSha256'],**production['immutableInputSha256']}.items():assert sha(p)==h,p
    assert gate['id']=='ys-chain-c1v1' and gate['mp4']==exported['video'] and sha(gate['mp4'])==exported['videoSha256']
    data=np.load(npz);names=list(data['feat_names']);features=data['desk_feat'];times=data['desk_t'];th=gate['thresholds'];fm=gate['metrics']
    assert names==['wall_band','window','wood','wood_top','busy','subject']
    assert len(times)==len(features)==bounds['sampleCount']==721 and fm['world_source']=='desk'
    assert list(times)==[r['time'] for r in bounds['rows']]
    assert th['step']==.5 and th['subjectSmall']==.35 and th['subjectSmallMax']==.2 and th['subjectMedian']==.6
    assert round(float(np.median(features[:,5])),4)==fm['subject_median']
    assert round(float((features[:,5]<th['subjectSmall']).mean()),4)==fm['subject_small_ratio']
    rows=[];small_mask=features[:,5]<th['subjectSmall'];sparse_mask=(features[:,2]>th['sparseWood'])&(features[:,4]<th['sparseBusy'])
    for physical,feat,sm,sp in zip(bounds['rows'],features,small_mask,sparse_mask):
        small=bool(sm);sparse=bool(sp);w=physical['widthRatio']
        candidate=bool((small or sparse) and w is not None and .4<=w<=.7 and not physical['clipped'] and not physical['allNamedGeometryBelowDesk'] and physical['verticesBehindCamera']==0)
        rows.append({**physical,'originalFeatures':{name:float(value) for name,value in zip(names,feat)},'originalProxySmall':small,'originalProxySparse':sparse,'possibleProxyDisagreementOnly':candidate,'visualDecision':'pending; geometry alone does not prove visibility, focus or readability','actualRawFile':production['out']+'/%05d.jpg'%physical['requestedFrame']})
    affected=[r for r in rows if r['originalProxySmall'] or r['originalProxySparse']]
    report={'date':time.strftime('%Y-%m-%d %H:%M:%S'),'episode':'ys-chain-c1v1','notAReplacementQualityGate':True,'originalGatePassUnchanged':gate['pass'],'originalGateResultsUnchanged':gate['results'],'originalMetricsUnchanged':fm,'originalThresholdsUnchanged':th,'scope':'All 721 exact original desk half-second samples; each actual raw JPEG SHA equals the reconstructed production held-source JPEG. Evaluated named-subject geometry is at that held source time, not an invented current pose.','acceptance':'User explicitly permits physical bounds and actual human visual review only for genuine proxy disagreements. Original numerical NG is retained. This script does not mark candidates accepted.','sampleCount':len(rows),'smallProxySamples':sum(r['originalProxySmall'] for r in rows),'sparseProxySamples':sum(r['originalProxySparse'] for r in rows),'candidateMismatchSamplesNotAutomaticPass':sum(r['possibleProxyDisagreementOnly'] for r in rows),'affectedSamples':len(affected),'evidenceSha256':{p:sha(p) for p in [bounds_path,gate_path,npz,gate['mp4'],os.path.abspath(__file__)]},'sourceSha256':production['sourceSha256'],'immutableInputSha256':production['immutableInputSha256'],'rows':rows}
    with open(output,'w') as f:json.dump(report,f,ensure_ascii=False,indent=1)
    print(json.dumps({'output':output,'sampleCount':len(rows),'originalGatePassUnchanged':gate['pass'],'smallProxySamples':report['smallProxySamples'],'sparseProxySamples':report['sparseProxySamples'],'affectedSamples':len(affected),'candidatesNotAutomaticPass':report['candidateMismatchSamplesNotAutomaticPass']},ensure_ascii=False))

if __name__=='__main__':main()
