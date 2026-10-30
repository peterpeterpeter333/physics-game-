"""Root-only, zero-render exact geometry for the final pier+layout MP4.

Uses the frozen delivered replay/contact implementation and the unchanged
semantic auditor with exactly the prior d18 requested-time/straw adaptations.
No source/live-function edits, inspector waiver, image substitution or approval.
Import is inert; actual files and hashes must be supplied explicitly by root.
"""
import hashlib
import json
import math
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-pier-layout-20261025')
AUDIT=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
SEMANTIC=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py'
PINS={
 str(AUDIT):'7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a',
 str(IMAGES):'4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479',
 str(SEMANTIC):'730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d',
 str(W/'scripts/blender/desk_axes_d1_complete_v4_delivered_supplement_20261025.py'):'d18ae16ac335ab12c2bd209b3a0eb526f92dba5cbd5f933b7087eff0107f6b60',
 str(W/'scripts/umech/desk-d1v1-pier-layout-final-v2-20261025.mjs'):'0d851abc709c14f11e6b674ad1dc57d6be517186f1c4601164af9f82285f672a',
 str(W/'scripts/umech/desk-d1v1-pier-layout-hooks-20261025.mjs'):'d16f14c5b1b9b38eef99190e5480ac922524e0f100683e012d6d57618a772b96'}
STAGE='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def pinned(p,h):
    p=Path(p);assert p.is_absolute()and isinstance(h,str)and len(h)==64 and all(c in '0123456789abcdef'for c in h)
    assert sha(p)==h,str(p)
    return p
def pin_into(pins,p,h):
    p=Path(p);p=p if p.is_absolute()else W/p
    key=str(p)
    if key in pins:assert pins[key]==h,('Conflicting pin',key)
    pinned(p,h);pins[key]=h
def pins_match(pins):
    try:return all(sha(p)==h for p,h in pins.items())
    except OSError:return False
def raw_state(p):
    s=Path(p).stat();return [s.st_size,s.st_mtime_ns,sha(p)]
def same(a,b,tolerance=1e-9):
    if isinstance(a,dict):return isinstance(b,dict)and a.keys()==b.keys()and all(same(v,b[k],tolerance)for k,v in a.items())
    if isinstance(a,(list,tuple)):return isinstance(b,(list,tuple))and len(a)==len(b)and all(same(x,y,tolerance)for x,y in zip(a,b))
    if isinstance(a,(int,float))and not isinstance(a,bool):return isinstance(b,(int,float))and math.isfinite(float(a))and math.isfinite(float(b))and abs(a-b)<=tolerance
    return a==b
def safe_output(p):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(FINAL)and p!=FINAL
    assert not p.exists()and not p.is_symlink()
    assert all(not q.is_symlink()for q in p.parents if q.exists())
    return p
def requested_auditor(times,source_time,straw_geometry):
    """Same three exact adaptation sites as the frozen prior d18 helper."""
    text=SEMANTIC.read_text()
    needle="        samples=sorted(set(round(max(a+.001,min(c['end']-.001,t)),6) for t in samples))"
    assert text.count(needle)==1
    text=text.replace(needle,"        next_start=g['CUES'][g['CUES'].index(c)+1]['start'] if g['CUES'].index(c)+1<len(g['CUES']) else g['DATA']['duration']\n        samples=[t for t in REQUESTED_TIMES if a<=t<next_start]")
    needle="            role,objects,critical=principal(c,t);b=project(objects,projection,dg);cb=project(critical,projection,dg);box=project(objects,projection,dg,True)"
    assert text.count(needle)==1
    text=text.replace(needle,"            role,objects,critical=principal(c,DELIVERED_SOURCE_TIME(t));semantic_details=None;path_safe=True\n            if c['group']=='straw':\n                objects,semantic_details,path_safe=STRAW_SEMANTIC_GEOMETRY(g,{'project':project,'checks':checks},projection,dg)\n                role='physical cup, bent straw, juice and active pressure arrows; mandatory mouth path and escaping original particles separately recorded'\n            b=project(objects,projection,dg);cb=project(critical,projection,dg);box=project(objects,projection,dg,True)")
    needle="            rows.append(row)";assert text.count(needle)==1
    text=text.replace(needle,"            row['rootApprovedStrawSemanticDetails']=semantic_details;row['mandatoryMouthPathSafe']=path_safe;row['pass']=bool(row['pass']and path_safe)\n"+needle)
    scope={'__file__':str(SEMANTIC),'REQUESTED_TIMES':times,'DELIVERED_SOURCE_TIME':source_time,'STRAW_SEMANTIC_GEOMETRY':straw_geometry}
    exec(compile(text,str(SEMANTIC),'exec'),scope)
    return scope,hashlib.sha256(text.encode()).hexdigest()

def run(ns,authorized=False,*,prepared_sha256,request,request_sha256,mp4,mp4_sha256,
        pier_render_report,pier_render_report_sha256,out):
    """Root alone calls this after actual new MP4 and original requests exist.

    Hash arguments are mandatory, never inferred from whichever file is present.
    It performs geometry only; neither bpy.render nor an encoder is called.
    """
    assert authorized is True,'Root-only no-render execution requires explicit authorization'
    assert FINAL.is_dir()and not FINAL.is_symlink()
    request=pinned(request,request_sha256);mp4=pinned(mp4,mp4_sha256)
    prepared_file=pinned(FINAL/'prepared.json',prepared_sha256)
    pier_render_report=pinned(pier_render_report,pier_render_report_sha256)
    assert request==FINAL/'d1-supplement-requests.json'and mp4==FINAL/'out/ys-chain-d1v1.mp4'
    dest=safe_output(out);replay_file=safe_output(dest.with_name(dest.stem+'-evaluated-replay.json'))
    assert dest.parent.is_dir()and replay_file.parent==dest.parent
    prepared=read(prepared_file);render=read(pier_render_report);req=read(request)
    assert prepared['cache']==str(FINAL)and prepared['finalAcceptance']is False
    assert prepared['report']==str(pier_render_report)and prepared['reportSha256']==pier_render_report_sha256
    assert render['mode']=='render'and render['allPatchFramesActuallyRendered']and render['allReplacementPhysicalPass']
    assert not render.get('error')and not render.get('cleanupError')and render['protectionChecks']and all(render['protectionChecks'].values())
    assert render['helperSha256']==PINS[str(IMAGES)]and render['auditHelperSha256']==PINS[str(AUDIT)]
    assert req['episode']=='D-1'and req['automaticApproval']is False
    times=sorted(set(float(t)for t in req['requestedTimes']))
    assert times and all(math.isfinite(t)and 0<=t<405.405 for t in times)
    assert times==sorted(set(float(r['time'])for r in req['requests']))
    assert all(round(r['time']*30)==r['frameIndex']for r in req['requests'])
    assert len({round(t*30)for t in times})==len(times),'No implicit nearest-time merging'
    gate_file=pinned(req['originalGate'],req['originalGateSha256'])
    npz_file=pinned(req['originalFrameSamples'],req['originalFrameSamplesSha256'])
    assert gate_file.is_relative_to(FINAL)and npz_file.is_relative_to(FINAL)
    gate_receipt=gate_file.parent/'d1-original-and-supplement-pending.json';gate=read(gate_receipt)
    assert gate['mp4Sha256']==mp4_sha256 and gate['allOriginalNGPreserved']
    exported=read(FINAL/'export.json');assert exported['video']==str(mp4)and exported['videoSha256']==mp4_sha256
    assert exported['preparedSha256']==prepared_sha256
    assert read(gate_file)['thresholds']==req['originalThresholds']
    pins={}
    for p,h in PINS.items():pin_into(pins,p,h)
    for p,h in prepared['protectedInputSha256'].items():pin_into(pins,p,h)
    for p,h in prepared['generatedInputSha256'].items():pin_into(pins,p,h)
    for p,h in render['pins'].items():pin_into(pins,p,h)
    for p,h in {str(Path(__file__).resolve()):sha(__file__),str(prepared_file):prepared_sha256,
        str(request):request_sha256,str(mp4):mp4_sha256,str(pier_render_report):pier_render_report_sha256,
        str(gate_file):req['originalGateSha256'],str(npz_file):req['originalFrameSamplesSha256'],
        str(gate_receipt):sha(gate_receipt),str(FINAL/'export.json'):sha(FINAL/'export.json')}.items():pin_into(pins,p,h)
    pin_into(pins,render['anchors'],render['anchorsSha256'])
    audit_report=pinned(render['auditReport'],render['auditReportSha256']);pin_into(pins,audit_report,render['auditReportSha256'])
    image_module=runpy.run_path(str(IMAGES));audit_module=runpy.run_path(str(AUDIT))
    audit,states,replacements=image_module['load_audit'](audit_report,render['auditReportSha256'])
    assert replacements=={int(j):int(k)for j,k in render['replacementFrameToActualPatchFrame'].items()}
    assert len(states)==render['actualSources']==prepared['pillarActualSources']
    assert len(replacements)==render['replacementOutputs']==prepared['pillarReplacementOutputs']
    actual_images={int(r['frame']):r for r in render['actualImages']};physical={int(r['frame']):r for r in render['physical']}
    assert set(states)==set(actual_images)==set(physical)
    for r in actual_images.values():pin_into(pins,r['path'],r['sha256'])
    rows=read(FINAL/'blender/delivered-provenance.json')['frames'];poses=read(FINAL/'blender/delivered-camera-poses.json')
    anchors=read(FINAL/'blender/desk/anchors.json');meta=read(FINAL/'blender/desk/meta.json')
    assert len(rows)==len(poses)==anchors['frames']==meta['frames']==12163 and anchors['key']==meta['key']
    assert anchors['fps']==30 and all(len(a)==12163 for a in anchors['anchors'].values())
    final_raw_before={};final_links_before={}
    for j,r in enumerate(rows):
        assert r['frame']==j and r['pose']==poses[j]
        link=FINAL/'blender/desk'/('%05d.jpg'%j);f=link.resolve();assert f==Path(r['raw']).resolve()
        final_links_before[str(link)]=str(f)
        if str(f)not in final_raw_before:final_raw_before[str(f)]=raw_state(f)
    report={'episode':'D-1','mode':'exact-final-physical-supplement','helperSha256':sha(__file__),
        'cache':str(FINAL),'preparedSha256':prepared_sha256,'request':str(request),'requestSha256':request_sha256,
        'mp4':str(mp4),'mp4Sha256':mp4_sha256,'pierRenderReport':str(pier_render_report),
        'pierRenderReportSha256':pier_render_report_sha256,'requestedTimes':times,'renders':0,
        'originalNG':req['originalNG'],'originalGateSha256':req['originalGateSha256'],
        'originalFrameSamplesSha256':req['originalFrameSamplesSha256'],'originalThresholds':req['originalThresholds'],
        'originalNGPreserved':True,'automaticApproval':False,'actualEncodedImageNeedsEyeReview':True,
        'earsVerified':False,'finalAcceptance':False,'inputSha256Before':pins,'old099NotAFinalRawCertification':True}
    ctx=None;started=time.time();joins={};observations={};checks={}
    try:
        ctx=audit_module['DeliveredReplay'](ns,cache=BASE);ctx.open();g,d,bpy=ctx.g,ctx.d,ctx.bpy
        assert sha(g['__file__'])==STAGE
        assert len(ctx.rows)==12163
        for t in times:
            j=round(t*30);r=rows[j];assert 0<=j<12163
            if r['layer']=='pier-contact':
                k=r['actualFrame'];assert replacements[j]==k==r['pierContactSourceFrame']
                assert r['originalDeliveredRow']==ctx.rows[j]and r['pierSourceDeliveredRow']==ctx.rows[k]
                assert audit_module['signature'](ctx.rows[j])==audit_module['signature'](ctx.rows[k])
                assert states[k]['delivered']==r['pierSourceDeliveredRow']==render['patchFrameToOriginalDeliveredRow'][str(k)]
                assert Path(r['raw']).resolve()==Path(actual_images[k]['path']).resolve()
                assert sha(r['raw'])==actual_images[k]['sha256']
            else:assert j not in replacements and r==ctx.rows[j]
            joins[j]=r
        def apply(t):
            j=round(t*30);row=joins[j]
            if row['layer']=='pier-contact':
                k=row['actualFrame'];fresh,projected=image_module['apply_checked'](ctx,audit_module,states[k])
                assert image_module['same'](fresh,physical[k]),'Same audited/rendered actual source geometry required'
                contacts=fresh['contacts'];nonpier=True
            else:
                points=ctx.replay(row);projected={name:list(d.project(point))for name,point in points.items()}
                contacts=[];nonpier=True
            assert set(projected)==set(anchors['anchors'])
            expected={name:values[j]for name,values in anchors['anchors'].items()}
            assert same(projected,expected,1e-5),('Actual replay versus delivered anchor mismatch',j)
            assert row['pose']==poses[j]
            observation={'deliveredFrame':row,'actualRawSha256':sha(row['raw']),
                'actualCameraWorldMatrix':[float(v)for line in d.CAM.matrix_world for v in line],
                'actualCameraLens':d.CAM_D.lens,'actualProjectedAnchors':projected,
                'deliveredAnchors':expected,'anchorsMatchTolerancePixels':1e-5,
                'pierContacts':contacts,'allNonPierObjectsUnchangedByContactRepair':nonpier,
                'originalOperationTimesAndPosePreserved':True,'caseSupplementApproved':False,
                'actualEncodedImageNeedsEyeReview':True}
            if j in observations:assert same(observations[j],observation)
            observations[j]=observation
            return projected
        def pose(t):return poses[max(0,min(12162,round(t*30)))]
        def source_time(t):return joins[round(t*30)]['unchangedOtherObjectSourceFrame']/30
        scope,adapted_hash=requested_auditor(times,source_time,ctx.module['straw_semantic_geometry'])
        private={**g,'apply':apply,'pose_at':pose}
        result=scope['check']({'main':types.FunctionType(g['main'].__code__,private)},str(replay_file),
            revision='Exact final pier-contact > original local/camera/production source; no threshold change or waiver',expected_source=STAGE)
        assert len(result['rows'])==len(times)and sorted(r['time']for r in result['rows'])==times
        assert set(observations)==set(joins)
        for r in result['rows']:
            j=round(r['time']*30);assert r['actualPose']==poses[j]
            r.update(observations[j])
        report.update(result=result,evaluatedReplayReport=str(replay_file),evaluatedReplayReportSha256=sha(replay_file),
            adaptedAuditorSha256=adapted_hash,unchangedAuditorSha256=PINS[str(SEMANTIC)],
            exactRequestedFrames=len(joins),allRequestedTimesAndFramesExact=True,requestedFrameRemaps=0,
            allRequestedActualRawPoseAndAnchorsJoined=True,originalNumericThresholdsUnchanged=True,
            identicalPriorD18AuditorAdaptationSites=True,explicitSameApprovedStrawRoles=True,
            newPierSourcesReplayedWithFrozenSameContactFormula=True,nonPierSourcesUnmodified=True,
            caseSupplementApproved=False,allActualImagesPersonallyViewed=False,
            status='Geometry evidence only; retain every original NG and await actual final-image case decisions')
    except BaseException as error:
        report.update(error={'type':type(error).__name__,'message':str(error)},status='Stopped without rendering; original and final inputs preserved; no approval')
        raise
    finally:
        if ctx is not None:
            try:checks.update(ctx.close())
            except BaseException as error:
                checks['replayRestorationCompleted']=False;report['cleanupError']={'type':type(error).__name__,'message':str(error)}
        checks['allPinnedInputsShaUnchanged']=pins_match(pins)
        try:checks['allFinalDeliveredRawShaAndStatsUnchanged']=all(raw_state(p)==s for p,s in final_raw_before.items())
        except OSError:checks['allFinalDeliveredRawShaAndStatsUnchanged']=False
        checks['allFinal12163RawLinksUnchanged']=all(str(Path(p).resolve())==v for p,v in final_links_before.items())
        report.update(protectionChecks=checks,seconds=round(time.time()-started,3),
            allOriginalNGPreserved=True,automaticApproval=False,finalAcceptance=False,renders=0)
        write(dest,report)
        assert checks and all(checks.values()),checks
    return report
