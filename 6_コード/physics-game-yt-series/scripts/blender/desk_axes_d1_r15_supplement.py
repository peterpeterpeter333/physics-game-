"""Root-queued read-only projection of exact original-gate candidate frames.

No renders, no changed original inspector, no automatic acceptance. Actual
encoded images must also be viewed before any case-specific supplement.
"""
import hashlib,json,os,time
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
C='/private/tmp/ys/ys-chain-d1v1-production-r15'
request=globals().get('D1_SUPPLEMENT_REQUEST',C+'/d1-supplement-requests.json')
out=globals().get('D1_SUPPLEMENT_OUT',C+'/d1-physical-supplement-r15.json')
assert globals().get('D1_SUPPLEMENT_AUTHORIZED') is True,'Only root queues D1 supplementary scene projection'
assert not os.path.exists(out),'Existing D1 supplementary evidence preserved'
evidence=json.load(open(request));assert evidence['episode']=='D-1' and evidence['automaticApproval'] is False
times=sorted(set(float(t) for t in evidence['requestedTimes']));assert times and all(0<=t<405.405 for t in times)
g=nsD1['main'].__globals__;assert g['P']['can']['can'].get('printed_label') is True
source=W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py';text=open(source).read()
needle="        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))"
assert text.count(needle)==1
# Clone only our own read-only semantic auditor's sampling schedule. The
# principal selection and actual evaluated-vertex projection remain identical.
replacement="        next_start=g['CUES'][g['CUES'].index(c)+1]['start'] if g['CUES'].index(c)+1<len(g['CUES']) else g['DATA']['duration']\n        samples=[t for t in REQUESTED_TIMES if a<=t<next_start]"
scope={'__file__':source,'REQUESTED_TIMES':times};exec(compile(text.replace(needle,replacement),source,'exec'),scope)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 final supplementary physical audit START',len(times),'requested states; no renders',flush=True)
r=scope['check'](nsD1,out,revision='r15-final-supplement',expected_source='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2')
assert len(r['rows'])==len(times) and sorted(x['time'] for x in r['rows'])==times
r.update({'requestFile':request,'requestSha256':hashlib.sha256(open(request,'rb').read()).hexdigest(),'originalGateSha256':evidence['originalGateSha256'],'originalFrameSamplesSha256':evidence['originalFrameSamplesSha256'],'originalNG':evidence['originalNG'],'everyOriginalNGPreserved':True,'actualEncodedVisualReviewStillRequired':True,'automaticApproval':False,'scope':'Only 7b/sparse candidate cases; actual measured/visible problems and all other gate NG remain unresolved until genuinely fixed'})
json.dump(r,open(out,'w'),ensure_ascii=False,indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 final supplementary physical audit DONE',out,flush=True)
