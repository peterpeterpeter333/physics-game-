"""Root-only actual images for the separately audited three-pier derivative.

Import is inert. Frozen audit/replay, original delivered rows, source guards,
and the evaluated contact formula are reused unchanged. No source, live
function, existing raw, original problem image, voice, caption or time changes.
Probe pixels require subsequent human approval; this helper never grants it.
"""
import copy
import hashlib
import json
from pathlib import Path
import runpy
import shutil
import time

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
AUDITOR=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
AUDITOR_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
COMPOSER=W/'scripts/umech/desk-d1v1-problem.mjs'
COMPOSER_SHA='a76792a81e9f1d7bc2b20b065f88d54e98d0c21453154c5ca60652acd3422f7d'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def same(a,b,tolerance=1e-9):
    if isinstance(a,dict):return isinstance(b,dict)and a.keys()==b.keys()and all(same(v,b[k],tolerance)for k,v in a.items())
    if isinstance(a,(tuple,list)):return isinstance(b,(tuple,list))and len(a)==len(b)and all(same(x,y,tolerance)for x,y in zip(a,b))
    if isinstance(a,(int,float))and not isinstance(a,bool):return isinstance(b,(int,float))and abs(a-b)<=tolerance
    return a==b
def safe_path(p):
    p=Path(p)
    assert p.is_absolute()and not any(x.is_symlink()for x in [p,*p.parents]if x.exists()),str(p)
    assert p.is_relative_to(OUT)and p!=OUT,str(p)
    return p
def image_record(p,**extra):
    p=Path(p);assert p.is_file()and not p.is_symlink()and p.stat().st_size>1000
    return {'path':str(p),'sha256':sha(p),'actuallyViewed':False,**extra}

def load_audit(path,pin):
    path=Path(path)
    assert path==OUT/'audit/report.json'and isinstance(pin,str)and len(pin)==64 and sha(path)==pin
    a=read(path)
    assert a['helperSha256']==AUDITOR_SHA and a['mode']=='audit'and a['renders']==0 and not a.get('error')
    assert a['allGuardedStatesPass']and not a['failedRepresentatives']and not a['fullSourceReplayPending']
    assert a['all12163OutputsJoinedExactly']and a['uniqueDeliveredSourceSignaturesReplayed']==5074
    assert a['protectionChecks']and all(a['protectionChecks'].values())
    states=a['candidateStates'];mapping={int(j):int(k)for j,k in a['replacementOutputToPatchSource'].items()}
    byframe={int(r['representativeFrame']):r for r in states}
    assert len(states)==len(byframe)==a['actualVisibleSourceSignatures']and len(mapping)==a['affectedOutputCount']
    assert set(mapping.values())==set(byframe)and all(r['pass']for r in states)
    for k,r in byframe.items():
        assert r['delivered']['frame']==k and all(mapping[j]==k for j in r['representedOutputs'])
    return a,byframe,mapping

def select_probe(replay,states,mapping):
    """Only exact audited delivered sources; never a nearest unrelated time."""
    main=[r for r in states.values()if any(c['copy']=='main'for c in r['contacts'])]
    fuji=[r for r in states.values()if len([c for c in r['contacts']if c['copy']!='main'])==2]
    assert main and fuji and 7917 in mapping,'Required actual263.9 output was not audited for repair'
    first=min(main,key=lambda r:r['representativeFrame'])
    wide=max(main,key=lambda r:(r['delivered']['pose'][3],-r['representativeFrame']))
    ffirst=min(fuji,key=lambda r:r['representativeFrame']);flast=max(fuji,key=lambda r:r['representativeFrame'])
    reasons={}
    for r,why in [(states[mapping[7917]],'Confirmed encoded263.9s axle-gap example; exact delivered source'),
        (first,'Earliest actual unhidden main pier; original assembly offset retained'),
        (wide,'Widest delivered main-engine camera among affected sources'),
        (ffirst,'First affected Fuji delivery with both0.4-scale engine copies'),
        (flast,'Last affected Fuji delivery with both0.4-scale engine copies')]:
        reasons.setdefault(r['representativeFrame'],[]).append(why)
    return sorted(reasons),reasons

def apply_checked(replay,audit_module,record):
    """Recheck non-pier invariance and strict real geometry before each image."""
    g,d,bpy=replay.g,replay.d,replay.bpy;row=record['delivered']
    aa=replay.replay(row);pier_set={f['pier']for f in replay.families}
    visible=[f for f in replay.families if not f['pier'].hide_render]
    assert {f['role']for f in visible}=={c['copy']for c in record['contacts']}
    nonpier={o:audit_module['object_state'](o)for o in replay.scene.objects if o not in pier_set}
    hidden={o:audit_module['object_state'](o)for o in pier_set if o.hide_render}
    anchor_before={name:list(d.project(point))for name,point in aa.items()}
    source_t=row['unchangedOtherObjectSourceFrame']/30
    role,objects,critical=replay.tools['principal'](g['cue_at'](source_t),source_t)
    dg=bpy.context.evaluated_depsgraph_get()
    projection=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
    before=replay.tools['project'](objects,projection,dg)
    contacts=[replay.repair(f)for f in visible]
    assert all(audit_module['object_state'](o)==v for o,v in nonpier.items()),'A non-pier object changed'
    assert all(audit_module['object_state'](o)==v for o,v in hidden.items()),'A hidden pier changed'
    anchors={name:list(d.project(point))for name,point in aa.items()}
    assert same(anchor_before,anchors,1e-10),'The contact repair must not move any anchor'
    dg=bpy.context.evaluated_depsgraph_get();after=replay.tools['project'](objects,projection,dg)
    cb=replay.tools['project'](critical,projection,dg);checks=replay.tools['checks'](after)
    cc=replay.tools['checks'](cb,True)if cb else None
    passed=all(c['pass']for c in contacts)and checks['visible']and checks['size40to70']and checks['frameSafe']and(cc is None or cc['frameSafe'])
    fresh={'frame':row['frame'],'pose':row['pose'],'delivered':row,'semanticPrincipal':role,
        'beforeActualSurface':before,'afterActualSurface':after,'physicalChecks':checks,
        'criticalSurface':cb,'criticalChecks':cc,'contacts':contacts,
        'allNonPierObjectsIncludingAxleBeamPistonWaterCameraUnchanged':True,'pass':bool(passed)}
    for k in ['semanticPrincipal','beforeActualSurface','afterActualSurface','physicalChecks','criticalSurface','criticalChecks','contacts']:
        assert same(fresh[k],record[k]),('Fresh replay differs from successful audited geometry',row['frame'],k)
    assert passed,('Strict repaired geometry failed before pixels',row['frame'])
    return fresh,anchors

def render_one(replay,path,fmt='JPEG'):
    path=safe_path(path);assert not path.exists();path.parent.mkdir(parents=True,exist_ok=True)
    scene=replay.scene;bpy=replay.bpy;bpy.context.window.scene=scene
    assert scene.render.engine=='BLENDER_EEVEE'and scene.render.resolution_x==1080 and scene.render.resolution_y==1920
    assert scene.render.resolution_percentage==100 and scene.eevee.taa_render_samples==16
    assert not getattr(scene.render,'use_motion_blur',False)
    scene.render.image_settings.file_format=fmt;scene.render.image_settings.quality=92;scene.render.filepath=str(path)
    bpy.ops.render.render(write_still=True,scene=scene.name)
    return image_record(path)

def setup_extra(replay,audit_module,kind):
    """Original canonical problem/catalog setup, then only visible-pier repair."""
    g,d,bpy=replay.g,replay.d,replay.bpy
    g['reset']();d.show(replay.local['coalSupport'],False)
    if kind=='challenge':g['challenge_setup']()
    elif kind=='answer':g['answer_state']()
    elif kind=='engine':g['visible']('engine')
    else:raise AssertionError(kind)
    bpy.context.view_layer.update();piers={f['pier']for f in replay.families}
    nonpier={o:audit_module['object_state'](o)for o in replay.scene.objects if o not in piers}
    visible=[f for f in replay.families if not f['pier'].hide_render]
    assert len(visible)==(1 if kind=='engine'else 2)
    contacts=[replay.repair(f)for f in visible]
    assert all(c['pass']for c in contacts)
    assert all(audit_module['object_state'](o)==v for o,v in nonpier.items())
    return contacts

def extra_images(replay,audit_module,dest):
    """Four small supplemental actual views. No delivered frame is invented."""
    raw=dest/'problem-raw';raw.mkdir();images=[]
    for name,kind in [('挑戦','challenge'),('答え','answer')]:
        contacts=setup_extra(replay,audit_module,kind)
        images.append({**render_one(replay,raw/(name+'.png'),'PNG'),'kind':kind,'contacts':contacts,
            'originalCanonicalSetupAndCamera':True,'notADeliveredTimeSample':True})
    original=FINAL/'problem/problem.json';shutil.copyfile(original,raw/'problem.json');assert sha(raw/'problem.json')==sha(original)
    catalog=dest/'catalog';catalog.mkdir();catalog_images=[]
    for top in [False,True]:
        contacts=setup_extra(replay,audit_module,'engine')
        replay.d.catalog_camera((-.20,.10,.38),top,.32);replay.bpy.context.view_layer.update()
        p=catalog/('engine-'+('top'if top else'oblique')+'.jpg')
        catalog_images.append({**render_one(replay,p),'view':'top'if top else'oblique','contacts':contacts,
            'originalEngineCatalogCamera':True,'notADeliveredTimeSample':True})
    command=f"EM_FILM_CACHE='{FINAL}' D1_PROBLEM_SOURCE='{raw}' D1_PROBLEM_OUT='{dest/'problem'}' node scripts/umech/desk-d1v1-problem.mjs"
    return images,catalog_images,{'raw':str(raw),'canonicalProblemJsonSha256':sha(original),
        'rawCanonicalProblemJson':str(raw/'problem.json'),'originalAnswerLabelMustBeReapplied':True,
        'composer':str(COMPOSER),'composerSha256':sha(COMPOSER),'commandFromWorkspace':command,
        'finalProblem':str(dest/'problem'),'compositionPending':True,'finalAcceptance':False}

def approved_probe(pin,receipt_path,receipt_pin,audit_pin):
    p=OUT/'probe/report.json';assert isinstance(pin,str)and len(pin)==64 and sha(p)==pin
    pr=read(p);assert pr['helperSha256']==sha(__file__)and pr['auditReportSha256']==audit_pin
    assert pr['mode']=='probe'and pr['allReplacementPhysicalPass']and pr['allRequestedActuallyRendered']and not pr.get('error')
    assert pr['protectionChecks']and all(pr['protectionChecks'].values())
    receipt_path=Path(receipt_path);assert isinstance(receipt_pin,str)and len(receipt_pin)==64 and sha(receipt_path)==receipt_pin
    rr=read(receipt_path)
    assert rr['approved']is True and rr['probeReportSha256']==pin and rr['helperSha256']==sha(__file__)
    assert rr['auditReportSha256']==audit_pin and rr['allRequiredProbeImagesPersonallyViewed']is True
    images=pr['actualImages']+pr['newProblemRawImages']+pr['newEngineCatalogImages']
    assert rr['reviewedImageSha256']=={r['path']:r['sha256']for r in images},'Human receipt must cover every required actual image'
    assert all(sha(r['path'])==r['sha256']for r in images)
    return pr,receipt_path

def run(ns,authorized=False,mode='probe',audit_report_sha256=None,
        probe_report_sha256=None,root_probe_visual_receipt=None,root_probe_visual_receipt_sha256=None):
    assert authorized is True and mode in ('probe','render'),'Root alone queues these actual images'
    assert sha(AUDITOR)==AUDITOR_SHA and sha(COMPOSER)==COMPOSER_SHA and not OUT.is_symlink()
    audit_module=runpy.run_path(str(AUDITOR));audit,states,mapping=load_audit(OUT/'audit/report.json',audit_report_sha256)
    dest=safe_path(OUT/mode);assert not dest.exists(),'Prior pixels and report are immutable; no overwrite/resume is implicit'
    probe=None
    if mode=='render':
        probe,receipt=approved_probe(probe_report_sha256,root_probe_visual_receipt,root_probe_visual_receipt_sha256,audit_report_sha256)
    ctx=None;started=time.time();dest.mkdir();report={'episode':'D-1','mode':mode,'helperSha256':sha(__file__),
        'auditHelper':str(AUDITOR),'auditHelperSha256':AUDITOR_SHA,'auditReport':str(OUT/'audit/report.json'),
        'auditReportSha256':audit_report_sha256,'originalMergeSha256':audit['mergeSha256'],
        'originalProvenanceSha256':audit['provenanceSha256'],'sourceCache':str(FINAL),'actualSources':len(states),
        'replacementOutputs':len(mapping),'explicitPierTransformDerivative':True,'modelsUnchanged':False,
        'onlyExistingThreePierLocalZScaleAndCenterDerived':True,'allOriginalNGPreserved':True,
        'sourceVoiceCaptionsOriginalRawOrProblemModified':False,'automaticApproval':False,
        'actualImageEyeReviewPending':True,'finalAcceptance':False,'allPatchFramesActuallyRendered':False,
        'rawReusedFromOriginalUncorrectedCache':False,'allReplacementPhysicalPass':False}
    settings=None;extra_before={};probe_before={}
    try:
        ctx=audit_module['DeliveredReplay'](ns);ctx.open();scene=ctx.scene;bpy=ctx.bpy
        settings={k:getattr(scene.render,k)for k in ['resolution_x','resolution_y','resolution_percentage','use_file_extension','use_motion_blur']if hasattr(scene.render,k)}
        image_settings={k:getattr(scene.render.image_settings,k)for k in ['file_format','quality','color_mode','color_depth','compression']}
        samples=scene.eevee.taa_render_samples
        for p in (FINAL/'problem').glob('*'):
            if p.is_file():extra_before[str(p)]=audit_module['raw_state'](p)
        protected={str(Path(__file__).resolve()):sha(__file__),str(AUDITOR):AUDITOR_SHA,
            str(OUT/'audit/report.json'):audit_report_sha256,str(COMPOSER):COMPOSER_SHA,**audit['originalSourceSha256']}
        if probe:
            protected.update({str(OUT/'probe/report.json'):probe_report_sha256,str(receipt):root_probe_visual_receipt_sha256})
            probe_before={r['path']:audit_module['raw_state'](r['path'])for r in probe['actualImages']+probe['newProblemRawImages']+probe['newEngineCatalogImages']}
        for p,h in protected.items():assert sha(p)==h
        assert set(mapping.values())==set(states)
        for k,r in states.items():
            sig=audit_module['signature'](r['delivered'])
            assert sig in ctx.states and ctx.states[sig]==r['delivered']and ctx.outputs[sig]==r['representedOutputs']
        report['pins']=protected;report['protectedInputSha256']=protected
        scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
        scene.eevee.taa_render_samples=16;scene.render.use_file_extension=True
        if hasattr(scene.render,'use_motion_blur'):scene.render.use_motion_blur=False
        physical=[];anchors_by_source={}
        for k in sorted(states):
            fresh,aa=apply_checked(ctx,audit_module,states[k]);physical.append(fresh);anchors_by_source[k]=aa
        assert len(physical)==audit['actualVisibleSourceSignatures']and all(r['pass']for r in physical)
        if probe:
            assert same(physical,probe['physical'])and same(anchors_by_source, {int(k):v for k,v in probe['anchorProjectionsByActualFrame'].items()})
            assert {str(k):v for k,v in mapping.items()}==probe['replacementFrameToActualPatchFrame']
        report.update(physical=physical,allReplacementPhysicalPass=True,
            all5074OriginalDeliverySignaturesAuditedSeparately=True,all12163OutputsJoinedExactly=True,
            replacementFrameToActualPatchFrame=mapping,
            patchFrameToOriginalDeliveredRow={k:r['delivered']for k,r in states.items()},
            allNonPierObjectsUnchangedAtEverySource=True)
        write(dest/'preflight.json',report)
        wanted,reasons=select_probe(ctx,states,mapping)if mode=='probe'else(sorted(states),{})
        raw=dest/'blender/patch';raw.mkdir(parents=True);images=[];rendered=[];reused=[]
        probe_images={r['frame']:r for r in probe['actualImages']}if probe else {}
        for k in wanted:
            f=raw/('%05d.jpg'%k)
            if k in probe_images:
                source=probe_images[k];shutil.copyfile(source['path'],f);assert sha(f)==source['sha256']
                assert f.stat().st_ino!=Path(source['path']).stat().st_ino
                record=image_record(f,reusedFromApprovedExactProbe=source['path'],reusedProbeImageSha256=source['sha256'])
                reused.append(k)
            else:
                fresh,aa=apply_checked(ctx,audit_module,states[k]);assert same(aa,anchors_by_source[k],1e-10)
                record=render_one(ctx,f);rendered.append(k)
            images.append({**record,'frame':k,'time':k/30,'pose':states[k]['delivered']['pose'],
                'delivered':states[k]['delivered'],'reasons':reasons.get(k,[]),'notAnUnchangedOriginalRawCopy':True})
            if len(images)%100==0:print('D pier actual images',mode,len(images),'/',len(wanted),flush=True)
        old=read(FINAL/'blender/desk/anchors.json');arrays=copy.deepcopy(old['anchors'])
        assert all(len(v)==12163 for v in arrays.values())
        for j,k in mapping.items():
            assert set(arrays)==set(anchors_by_source[k])
            for name in arrays:arrays[name][j]=anchors_by_source[k][name]
        anchors=raw/'anchors.json';write(anchors,{'fps':30,'frames':12163,'anchors':arrays})
        if mode=='probe':problem,catalog,composition=extra_images(ctx,audit_module,dest)
        else:
            problem=[];catalog=[]
            for field,folder in [('newProblemRawImages','problem-raw'),('newEngineCatalogImages','catalog')]:
                target=dest/folder;target.mkdir()
                for source in probe[field]:
                    f=target/Path(source['path']).name;shutil.copyfile(source['path'],f);assert sha(f)==source['sha256']
                    r={**source,'path':str(f),'reusedFromApprovedExactProbe':source['path'],'actuallyViewed':False}
                    (problem if field=='newProblemRawImages'else catalog).append(r)
            shutil.copyfile(OUT/'probe/problem-raw/problem.json',dest/'problem-raw/problem.json')
            assert sha(dest/'problem-raw/problem.json')==sha(FINAL/'problem/problem.json')
            composition={**probe['newProblemComposition'],'raw':str(dest/'problem-raw'),
                'rawCanonicalProblemJson':str(dest/'problem-raw/problem.json'),'finalProblem':str(dest/'problem'),
                'commandFromWorkspace':f"EM_FILM_CACHE='{FINAL}' D1_PROBLEM_SOURCE='{dest/'problem-raw'}' D1_PROBLEM_OUT='{dest/'problem'}' node scripts/umech/desk-d1v1-problem.mjs"}
        report.update(raw=str(raw),anchors=str(anchors),anchorsSha256=sha(anchors),anchorProjectionsByActualFrame=anchors_by_source,
            actualImages=images,actualImageCount=len(images),renderedInThisRunFrames=rendered,
            independentCopiesFromApprovedProbeFrames=reused,renders=len(rendered),
            allRequestedActuallyRendered=True,allPatchFramesActuallyRendered=mode=='render'and len(images)==len(states),
            newProblemRawImages=problem,newEngineCatalogImages=catalog,newProblemComposition=composition,
            status='Actual pier-corrected images ready; answer-label composition and final encoded checks/eyes remain pending')
        if mode=='render':report.update(rootProbeVisualReceipt=str(receipt),rootProbeVisualReceiptSha256=root_probe_visual_receipt_sha256,
            approvedProbeReport=str(OUT/'probe/report.json'),approvedProbeReportSha256=probe_report_sha256,
            reusedImagesWereActuallyRenderedInExactApprovedProbe=True)
        return report
    except BaseException as error:
        report.update(status='Stopped; original sources and pixels preserved; no final acceptance',error={'type':type(error).__name__,'message':str(error)})
        raise
    finally:
        checks={}
        if ctx is not None:
            if settings is not None:
                for k,v in settings.items():setattr(ctx.scene.render,k,v)
                for k,v in image_settings.items():setattr(ctx.scene.render.image_settings,k,v)
                ctx.scene.eevee.taa_render_samples=samples
            try:checks.update(ctx.close())
            except BaseException as error:
                checks['replayRestorationCompleted']=False
                report['cleanupError']={'type':type(error).__name__,'message':str(error)}
            finally:
                checks.update(originalProblemImagesAndJsonShaAndStatsUnchanged=all(audit_module['raw_state'](p)==s for p,s in extra_before.items()),
                    approvedProbePixelsShaAndStatsUnchanged=all(audit_module['raw_state'](p)==s for p,s in probe_before.items()),
                    allPinnedInputsUnchanged=all(sha(p)==h for p,h in report.get('pins',{}).items()),
                    renderSettingsRestored=settings is None or all(getattr(ctx.scene.render,k)==v for k,v in settings.items())and
                        all(getattr(ctx.scene.render.image_settings,k)==v for k,v in image_settings.items())and ctx.scene.eevee.taa_render_samples==samples)
        report['protectionChecks']=checks;report['seconds']=round(time.time()-started,3)
        write(dest/'report.json',report)
        assert checks and all(checks.values()),checks
