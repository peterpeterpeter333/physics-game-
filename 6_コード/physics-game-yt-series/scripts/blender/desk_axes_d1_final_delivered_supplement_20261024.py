"""Exact delivered-frame physical evidence for final original 7/7b candidates.

Root GUI only, no renders, no inspector edits and no automatic approval.
Join final output j to the actual camera-patch k and unchanged state ref, or
to the original render/dup ref. Thus projected geometry matches delivered JPEGs
instead of evaluating an unrelated nominal time or the old camera path.
"""
import hashlib,json,runpy,time,types
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
PROD=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
PATCH=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-20261024')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-patched-20261024')
STAGE_SHA='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
PATCH_SHA='0ab032966bae0acdf9788df05118c8373d345cadca304f2447d01a0a55fcbdfa'
V4_SHA='7ec8ee0c86872a47de4b505fb469d08e8055fd69528fdcba0c5884677f15fcb6'
AUDITOR_SHA='730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def stats(p):return {str(f):(f.stat().st_size,f.stat().st_mtime_ns) for f in sorted(Path(p).glob('*.jpg'))}
def run(ns,authorized=False,cache=str(FINAL),request=None,out=None):
    assert authorized is True,'Only root may queue this exact physical audit'
    cache=Path(cache);request=Path(request or cache/'d1-supplement-requests.json');out=Path(out or cache/'d1-final-delivered-physical-supplement-20261024.json')
    assert not out.exists() and not out.is_symlink(),'Keep prior evidence'
    evidence=json.loads(request.read_text());assert evidence['episode']=='D-1' and evidence['automaticApproval'] is False
    requested=sorted(set(float(t) for t in evidence['requestedTimes']));assert requested
    assert all(0<=t<405.405 for t in requested)
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d']
    marker=ns['D1_WATER_CENTER_V4'];assert marker['helperSha256']==V4_SHA and g['mine_state'] is marker['wrapper']
    assert sha(g['__file__'])==STAGE_SHA
    camfile=W/'scripts/blender/desk_axes_d1_camera_patch_20261024.py';assert sha(camfile)==PATCH_SHA
    camera=runpy.run_path(str(camfile));camera['verify_canonical'](g)
    merge=json.loads((cache/'d1-camera-merge.json').read_text());complete=json.loads((PATCH/'camera-patch-complete.json').read_text())
    assert merge['frames']==12163 and merge['finalPassed'] is False and complete['allPatchFramesActuallyRendered'] and complete['allReplacementFramesPhysicalPass']
    assert sha(PATCH/'camera-patch-complete.json')==merge['patchCompleteReportSha256']
    ranges,corrected_pose,replacements,refs,frames,plans=camera['derive'](g)
    assert {int(j):int(k) for j,k in complete['replacementFrameToActualPatchFrame'].items()}==replacements
    assert {int(j):int(k) for j,k in complete['patchFrameToUnchangedObjectSourceFrame'].items()}==refs
    assert sorted(complete['actualReplacementFrames'])==frames
    nf=12163
    def delivery(j):
        assert 0<=j<nf
        if j in replacements:
            k=replacements[j];ref=refs[k];pose=corrected_pose(k/30);camera_time=k/30
            # The original patch report carries its exact raw path explicitly.
            raw=Path(complete['raw'])/('%05d.jpg'%k)
        else:
            p=plans[j];ref=j if p[0]=='render' else p[1];k=ref;pose=g['pose_at'](ref/30);camera_time=ref/30;raw=PROD/'blender/desk'/('%05d.jpg'%j)
        chosen=cache/'blender/desk'/('%05d.jpg'%j)
        assert chosen.resolve()==raw.resolve() and raw.is_file() and raw.stat().st_size>1000,('Wrong final raw selection',j)
        return {'frame':j,'actualCameraFrame':k,'cameraOperationTime':camera_time,'unchangedObjectSourceFrame':ref,'pose':list(pose),'raw':str(raw),'selectedFinalRaw':str(chosen)}
    joins={round(t*30):delivery(round(t*30)) for t in requested}
    original_apply=g['apply']
    def final_pose(t):return delivery(max(0,min(nf-1,round(t*30))))['pose']
    def final_apply(t):
        row=joins[round(t*30)]
        aa=original_apply(row['unchangedObjectSourceFrame']/30)
        # Frozen D1 set_camera establishes the exact revised focus/fstop at the
        # actual render operation time, not at a later output's held time.
        p=row['pose']
        scope={**g,'pose_at':lambda _t:p}
        types.FunctionType(g['set_camera'].__code__,scope)(row['cameraOperationTime'])
        bpy.context.view_layer.update();return aa
    auditor=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py';assert sha(auditor)==AUDITOR_SHA
    text=auditor.read_text();needle="        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))";assert text.count(needle)==1
    replacement="        next_start=g['CUES'][g['CUES'].index(c)+1]['start'] if g['CUES'].index(c)+1<len(g['CUES']) else g['DATA']['duration']\n        samples=[t for t in REQUESTED_TIMES if a<=t<next_start]"
    scope={'__file__':str(auditor),'REQUESTED_TIMES':requested};exec(compile(text.replace(needle,replacement),str(auditor),'exec'),scope)
    private={**g,'apply':final_apply,'pose_at':final_pose};audit_ns={'main':types.FunctionType(g['main'].__code__,private)}
    old_scene=bpy.context.window.scene;bindings={k:g[k] for k in ('main','apply','mine_state','reset','pose_at','set_camera','plan_d1','SPANS','EVENTS')};before_raw={str(p):stats(p) for p in (PROD/'blender/desk',Path(complete['raw']))};started=time.time()
    try:
        result=scope['check'](audit_ns,str(out),revision='Exact final delivered frames + explicit water-center v4; no render/waiver',expected_source=STAGE_SHA)
        assert len(result['rows'])==len(requested) and sorted(r['time'] for r in result['rows'])==requested
        for r in result['rows']:
            row=joins[round(r['time']*30)];assert r['actualPose']==row['pose']
            r['deliveredFrame']=row;r['deliveredRawSha256']=sha(row['raw']);r['caseSupplementApproved']=False;r['actualEncodedImageStillNeedsEyeReview']=True
        result.update({'helperSha256':sha(__file__),'runtimeWaterDerivativeSha256':V4_SHA,'requestFile':str(request),'requestSha256':sha(request),'originalGateSha256':evidence['originalGateSha256'],'originalFrameSamplesSha256':evidence['originalFrameSamplesSha256'],'originalNG':evidence['originalNG'],'everyOriginalNGPreserved':True,'exactDeliveredSourcesAndPosesUsed':True,'actualEncodedVisualReviewStillRequired':True,'automaticApproval':False,'renders':0,'seconds':round(time.time()-started,3)})
        out.write_text(json.dumps(result,ensure_ascii=False,indent=1));return result
    finally:
        bpy.context.window.scene=old_scene
        assert all(g[k] is v for k,v in bindings.items()) and g['_VIS_QUEUE'] is None
        assert all(stats(p)==v for p,v in before_raw.items())
        assert sha(g['__file__'])==STAGE_SHA and sha(camfile)==PATCH_SHA and sha(auditor)==AUDITOR_SHA
