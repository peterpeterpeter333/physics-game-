"""Read untouched final gate NPZ; request evidence, never grant exceptions."""
import argparse,hashlib,json,pathlib
import numpy as np
p=argparse.ArgumentParser();p.add_argument('--gate',required=True);p.add_argument('--npz',required=True);p.add_argument('--out',required=True);a=p.parse_args()
out=pathlib.Path(a.out)
if out.exists():raise RuntimeError('Existing D1 supplementary requests preserved')
gate=json.loads(pathlib.Path(a.gate).read_text());assert gate['id']=='ys-chain-d1v1'
samples=np.load(a.npz,allow_pickle=False);assert 'desk_t' in samples and 'desk_feat' in samples
ts=samples['desk_t'];ft=samples['desk_feat'];assert len(ts)==len(ft)>800
th=gate['thresholds'];requests=[]
for t,f in zip(ts,ft):
    subject=float(f[5]);sparse=bool(f[2]>th['sparseWood'] and f[4]<th['sparseBusy']);reasons=[]
    if subject<th['subjectMedian']:reasons.append('7b-median-proxy-candidate')
    if subject<th['subjectSmall']:reasons.append('7b-small-proxy-candidate')
    if sparse:reasons.append('sparse-proxy-candidate')
    if reasons:requests.append({'time':float(t),'frameIndex':int(round(float(t)*30)),'reasons':reasons,'originalSubjectProxy':subject,'originalWood':float(f[2]),'originalBusy':float(f[4]),'originalSmall':subject<th['subjectSmall'],'originalSparse':sparse,'actualPhysicalAuditRequired':True,'actualVisualReviewRequired':True,'approved':False})
sha=lambda f:hashlib.sha256(pathlib.Path(f).read_bytes()).hexdigest()
record={'episode':'D-1','status':'Evidence requests only; every original NG is retained and no request is an approval','originalGate':str(pathlib.Path(a.gate).resolve()),'originalGateSha256':sha(a.gate),'originalFrameSamples':str(pathlib.Path(a.npz).resolve()),'originalFrameSamplesSha256':sha(a.npz),'originalGatePass':gate['pass'],'originalNG':[r for r in gate['results'] if r['status']=='NG'],'originalThresholds':th,'worldSamples':len(ts),'candidateSamples':len(requests),'requests':requests,'requestedTimes':[r['time'] for r in requests],'scope':'Only user-authorized original 7b/sparse disagreements with actual model size and actual visual review; never other gates or blanket exemption','automaticApproval':False}
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(record,ensure_ascii=False,indent=1));print(json.dumps({k:v for k,v in record.items() if k not in ['requests','requestedTimes','originalThresholds','originalNG']},ensure_ascii=False))
