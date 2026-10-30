"""Root-only exact final LOCAL > CAMERA > PRODUCTION physical supplement.

Replays the actual source k/ref/pose and private semantic derivative. Never
evaluates an unrelated nominal source, changes a test, or approves its own NG.
"""
import hashlib,json,runpy,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-20261024')
STAGE='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
AUDITOR_SHA='730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def stats(folder):return {str(p):(p.stat().st_size,p.stat().st_mtime_ns)for p in Path(folder).glob('*.jpg')}
def run(ns,authorized=False,cache=str(FINAL),request=None,out=None):
    assert authorized is True;cache=Path(cache);request=Path(request or cache/'d1-supplement-requests.json');out=Path(out or cache/'d1-complete-delivered-physical-supplement-20261024.json');assert not out.exists()
    req=read(request);assert req['episode']=='D-1'and req['automaticApproval']is False
    times=sorted(set(float(t)for t in req['requestedTimes']));assert times and all(0<=t<405.405 for t in times)
    merge=read(cache/'d1-complete-merge.json');assert merge['frames']==12163 and merge['finalPassed']is False
    helper=Path(merge['localHelper']);assert sha(helper)==merge['localHelperSha256'];local_root=Path(merge['localBundle']);lp=read(local_root/'render/report.json');assert sha(local_root/'render/report.json')==merge['localRenderReportSha256'];assert lp['allPatchFramesActuallyRendered']and lp['allReplacementPhysicalPass']
    module=runpy.run_path(str(helper));assert module['OUT']==local_root
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];assert sha(g['__file__'])==STAGE
    previous=bpy.context.window.scene;bindings={k:g[k]for k in ['apply','main','pose_at','set_camera','mine_state','reset','plan_d1','SPANS','EVENTS']};before={str(p):stats(p)for p in [Path(merge['production'])/'blender/desk',Path(merge['camera'])/'blender/patch',Path(lp['raw'])]};started=time.time()
    try:
        bpy.context.window.scene=d.SC
        diagnostic=next(Path(p)for p in lp['frozen']if Path(p).name=='d1-straw-trace-height-diagnostic-v2-20261024.json');s=module['prepare'](ns,lp['frozen'][str(diagnostic)]);plan=s['plan']
        assert {str(j):k for j,k in plan['replacements'].items()}==lp['replacementFrameToActualPatchFrame']
        assert {str(j):k for j,k in plan['sources'].items()}==lp['patchFrameToUnchangedOtherObjectSourceFrame']
        all_rows=read(cache/'blender/delivered-provenance.json')['frames'];assert len(all_rows)==12163;joins={}
        for t in times:
            j=round(t*30);r=all_rows[j];assert r['frame']==j and(cache/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(r['raw']).resolve()
            if r['layer']=='local':assert plan['replacements'][j]==r['actualFrame']and plan['sources'][r['actualFrame']]==r['unchangedOtherObjectSourceFrame']
            else:
                baseline=plan['baseDelivery'](j);assert baseline['layer']==r['layer']and baseline['actualFrame']==r['actualFrame']and baseline['unchangedOtherObjectSourceFrame']==r['unchangedOtherObjectSourceFrame']and baseline['pose']==r['pose']
            joins[j]=r
        original=g['apply']
        def apply(t):
            row=joins[round(t*30)]
            if row['layer']=='local':aa=s['apply'](row['actualFrame'])
            else:
                aa=original(row['unchangedOtherObjectSourceFrame']/30);p=row['pose'];types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:p})(row['cameraOperationTime'])
            bpy.context.view_layer.update();return aa
        # The original semantic inspector also asks pose(t-1/FPS) to classify
        # transition frames. That neighbour need not itself be a requested NG.
        def pose(t):return all_rows[max(0,min(12162,round(t*30)))]['pose']
        auditor=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py';assert sha(auditor)==AUDITOR_SHA
        text=auditor.read_text();needle="        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))";assert text.count(needle)==1
        replace="        next_start=g['CUES'][g['CUES'].index(c)+1]['start'] if g['CUES'].index(c)+1<len(g['CUES']) else g['DATA']['duration']\n        samples=[t for t in REQUESTED_TIMES if a<=t<next_start]"
        scope={'__file__':str(auditor),'REQUESTED_TIMES':times};exec(compile(text.replace(needle,replace),str(auditor),'exec'),scope)
        private={**g,'apply':apply,'pose_at':pose};result=scope['check']({'main':types.FunctionType(g['main'].__code__,private)},str(out),revision='Exact complete delivered local/camera/original source states; no waiver',expected_source=STAGE)
        assert len(result['rows'])==len(times)and sorted(r['time']for r in result['rows'])==times
        for r in result['rows']:
            joined=joins[round(r['time']*30)];assert r['actualPose']==joined['pose'];r['deliveredFrame']=joined;r['deliveredRawSha256']=sha(joined['raw']);r['caseSupplementApproved']=False;r['actualEncodedImageNeedsEyeReview']=True
        result.update({'helperSha256':sha(__file__),'requestFile':str(request),'requestSha256':sha(request),'mergeSha256':sha(cache/'d1-complete-merge.json'),'localDerivativeHelperSha256':sha(helper),'localRenderReportSha256':merge['localRenderReportSha256'],'allOriginalNGPreserved':True,'originalNG':req['originalNG'],'originalGateSha256':req['originalGateSha256'],'originalFrameSamplesSha256':req['originalFrameSamplesSha256'],'exactDeliveredSourcesAndPosesUsed':True,'explicitLocalSemanticDerivativesReplayed':True,'renders':0,'automaticApproval':False,'finalAcceptance':False,'seconds':time.time()-started})
        out.write_text(json.dumps(result,ensure_ascii=False,indent=1));return result
    finally:
        bpy.context.window.scene=previous;assert all(g[k]is v for k,v in bindings.items());assert all(stats(p)==v for p,v in before.items());assert sha(g['__file__'])==STAGE and sha(helper)==merge['localHelperSha256']
