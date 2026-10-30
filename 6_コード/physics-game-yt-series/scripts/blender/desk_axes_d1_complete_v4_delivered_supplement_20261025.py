"""Exact delivered local-v4 > camera-v2 > original physical evidence, zero render.

Keeps original gate/NPZ failures. Replays source k/ref/pose, not nominal output
states. Root-approved straw body/mouth/escaping-effect roles are explicit here;
all original numeric safety thresholds remain unchanged. Never self-approves.
"""
import hashlib,json,runpy,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-20261025')
STAGE='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
LOCAL='1edcafa6e7d52033554834398ce49daf2f2022133c13ec6b87d7d77655d33ca2'
AUDITOR_SHA='730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def stats(folder):return {str(p):(p.stat().st_size,p.stat().st_mtime_ns)for p in Path(folder).glob('*.jpg')}
def run(ns,authorized=False,cache=str(FINAL),request=None,out=None):
    assert authorized is True;cache=Path(cache);request=Path(request or cache/'d1-supplement-requests.json');out=Path(out or cache/'d1-complete-v4-delivered-physical-supplement-20261025.json')
    replay=out.with_name(out.stem+'-evaluated-replay.json');assert not out.exists()and not replay.exists()
    req=read(request);assert req['episode']=='D-1'and req['automaticApproval']is False
    times=sorted(set(float(t)for t in req['requestedTimes']));assert times and all(0<=t<405.405 for t in times)
    merge=read(cache/'d1-complete-merge.json');assert merge['frames']==12163 and merge['finalPassed']is False
    helper=Path(merge['localHelper']);assert sha(helper)==merge['localHelperSha256']==LOCAL
    local_root=Path(merge['localBundle']);lp=read(local_root/'render/report.json');assert sha(local_root/'render/report.json')==merge['localRenderReportSha256']
    assert lp['allPatchFramesActuallyRendered']and lp['allReplacementPhysicalPass']and lp['actualFrameCount']==1991
    module=runpy.run_path(str(helper));assert module['OUT']==local_root
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];assert sha(g['__file__'])==STAGE
    previous=bpy.context.window.scene;bindings={k:g[k]for k in ['apply','main','pose_at','set_camera','mine_state','reset','plan_d1','SPANS','EVENTS']}
    before={str(p):stats(p)for p in [Path(merge['production'])/'blender/desk',Path(merge['camera'])/'blender/patch',Path(lp['raw'])]};started=time.time();s=None
    try:
        bpy.context.window.scene=d.SC
        diagnostic=next(Path(p)for p in lp['frozen']if Path(p).name=='d1-straw-trace-height-diagnostic-v2-20261024.json')
        s=module['prepare'](ns,lp['frozen'][str(diagnostic)]);plan=s['plan']
        assert {str(j):k for j,k in plan['replacements'].items()}==lp['replacementFrameToActualPatchFrame']
        assert {str(j):k for j,k in plan['sources'].items()}==lp['patchFrameToUnchangedOtherObjectSourceFrame']
        all_rows=read(cache/'blender/delivered-provenance.json')['frames'];assert len(all_rows)==12163;joins={}
        for t in times:
            j=round(t*30);r=all_rows[j];assert r['frame']==j and(cache/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(r['raw']).resolve()
            if r['layer']=='local':assert plan['replacements'][j]==r['actualFrame']and plan['sources'][r['actualFrame']]==r['unchangedOtherObjectSourceFrame']
            else:
                baseline=plan['baseDelivery'](j)
                assert baseline['layer']==r['layer']and baseline['actualFrame']==r['actualFrame']and baseline['unchangedOtherObjectSourceFrame']==r['unchangedOtherObjectSourceFrame']and baseline['pose']==r['pose']
            joins[j]=r
        original=g['apply']
        def apply(t):
            row=joins[round(t*30)]
            if row['layer']=='local':aa=s['apply'](row['actualFrame'])
            else:
                # The private new part is not in original MANAGED/reset lists.
                # Hide it explicitly outside its exact local-delivered states.
                d.show(s['coalSupport'],False);aa=original(row['unchangedOtherObjectSourceFrame']/30)
                p=row['pose'];types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:p})(row['cameraOperationTime'])
            bpy.context.view_layer.update();return aa
        def pose(t):return all_rows[max(0,min(12162,round(t*30)))]['pose']
        def source_time(t):return joins[round(t*30)]['unchangedOtherObjectSourceFrame']/30
        auditor=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py';assert sha(auditor)==AUDITOR_SHA
        text=auditor.read_text();needle="        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))";assert text.count(needle)==1
        replacement="        next_start=g['CUES'][g['CUES'].index(c)+1]['start'] if g['CUES'].index(c)+1<len(g['CUES']) else g['DATA']['duration']\n        samples=[t for t in REQUESTED_TIMES if a<=t<next_start]"
        text=text.replace(needle,replacement)
        needle="            role,objects,critical=principal(c,t);b=project(objects,projection,dg);cb=project(critical,projection,dg);box=project(objects,projection,dg,True)";assert text.count(needle)==1
        replacement="            role,objects,critical=principal(c,DELIVERED_SOURCE_TIME(t));semantic_details=None;path_safe=True\n            if c['group']=='straw':\n                objects,semantic_details,path_safe=STRAW_SEMANTIC_GEOMETRY(g,{'project':project,'checks':checks},projection,dg)\n                role='physical cup, bent straw, juice and active pressure arrows; mandatory mouth path and escaping original particles separately recorded'\n            b=project(objects,projection,dg);cb=project(critical,projection,dg);box=project(objects,projection,dg,True)"
        text=text.replace(needle,replacement)
        needle="            rows.append(row)";assert text.count(needle)==1
        text=text.replace(needle,"            row['rootApprovedStrawSemanticDetails']=semantic_details;row['mandatoryMouthPathSafe']=path_safe;row['pass']=bool(row['pass']and path_safe)\n"+needle)
        scope={'__file__':str(auditor),'REQUESTED_TIMES':times,'DELIVERED_SOURCE_TIME':source_time,'STRAW_SEMANTIC_GEOMETRY':module['straw_semantic_geometry']}
        exec(compile(text,str(auditor),'exec'),scope)
        private={**g,'apply':apply,'pose_at':pose}
        result=scope['check']({'main':types.FunctionType(g['main'].__code__,private)},str(replay),revision='Exact local-v4 delivered source replay; explicit straw roles; no threshold change or waiver',expected_source=STAGE)
        assert len(result['rows'])==len(times)and sorted(r['time']for r in result['rows'])==times
        physical={r['frame']:r for r in lp['physical']}
        for r in result['rows']:
            joined=joins[round(r['time']*30)];assert r['actualPose']==joined['pose']
            r.update(deliveredFrame=joined,deliveredRawSha256=sha(joined['raw']),caseSupplementApproved=False,actualEncodedImageNeedsEyeReview=True)
            if joined['layer']=='local':r['exactLocalSourceSemanticChecks']=physical[joined['actualFrame']]['localSemanticChecks']
        result.update(helperSha256=sha(__file__),requestFile=str(request),requestSha256=sha(request),mergeSha256=sha(cache/'d1-complete-merge.json'),localDerivativeHelperSha256=sha(helper),localRenderReportSha256=merge['localRenderReportSha256'],evaluatedReplayReport=str(replay),evaluatedReplayReportSha256=sha(replay),allOriginalNGPreserved=True,originalNG=req['originalNG'],originalGateSha256=req['originalGateSha256'],originalFrameSamplesSha256=req['originalFrameSamplesSha256'],exactDeliveredSourcesAndPosesUsed=True,explicitLocalSemanticDerivativesReplayed=True,privateAuditorAdaptations=['Requested exact output times','Semantic selection at delivered other-object source time','Root-approved straw body/mouth path/escaped effect distinction; original particle positions and clips preserved'],originalNumericThresholdsUnchanged=True,renders=0,automaticApproval=False,finalAcceptance=False,seconds=time.time()-started)
        with out.open('x')as f:json.dump(result,f,ensure_ascii=False,indent=1,allow_nan=False)
        return result
    finally:
        bpy.context.window.scene=d.SC
        if s is not None:s['cleanup']()
        else:
            for ob in list(d.SC.objects):
                if ob.get('D1_V4_SUPPORT_HELPER_SHA')==LOCAL:
                    mesh=ob.data;bpy.data.objects.remove(ob,do_unlink=True)
                    if mesh.users==0:bpy.data.meshes.remove(mesh)
        bpy.context.window.scene=previous
        assert all(g[k]is v for k,v in bindings.items())and all(stats(p)==v for p,v in before.items())
        assert sha(g['__file__'])==STAGE and sha(helper)==merge['localHelperSha256']
