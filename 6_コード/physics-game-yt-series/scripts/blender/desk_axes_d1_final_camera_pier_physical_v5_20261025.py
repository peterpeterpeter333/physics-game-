"""Root-only exact final-camera/pier/layout physical replay; zero rendering.

Import is inert. Actual120 and completed v9 camera/v5 pier reports, final
prepared/export/MP4/original requests/actual-review coverage are root-pinned
arguments, never guessed from a file presently on disk. Original546 requests
remain exact; new selected actual frames are additional evidence. The sole
proven source12162->encoded12161 endpoint is separately recorded, never used
to remap an original physical candidate or substitute raw for actual pixels.
No source/live callable, semantic threshold, original NG or eye approval edits.
"""
import ast
import hashlib
import json
import math
from pathlib import Path
import re
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
PIER=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025')
CAMERA=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025')
AUDIT=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
RECOVERY=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v5_20261025.py'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
ADAPTER=W/'scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'
CAMERA_HELPER=W/'scripts/blender/desk_axes_d1_camera_readability_v9_verified_20261025.py'
FOCUS_HELPER=W/'scripts/blender/desk_axes_d1_camera_readability_v9_20261025.py'
CANONICAL_CAMERA=W/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
SEMANTIC=W/'scripts/blender/desk_d1v1_semantic_audit_r9.py'
D18=W/'scripts/blender/desk_axes_d1_complete_v4_delivered_supplement_20261025.py'
RUNNER=W/'scripts/umech/desk-d1v1-camera-pier-layout-final-v5-contract-20261025.mjs'
HOOK=W/'scripts/umech/desk-d1v1-camera-pier-layout-hooks-v3-20261025.mjs'
ADDITIONAL_ACTUAL=W/'scripts/umech/d1-final-original546-additional-actual-20261025.mjs'
STAGE='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
PINS={str(p):h for p,h in[
 (AUDIT,'7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'),
 (RECOVERY,'bc91b1089c3714378cbd98bd39229f288b0e6cf7f7011a492e85d3df7cccbcf7'),
 (IMAGES,'4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'),
 (ADAPTER,'f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'),
 (CAMERA_HELPER,'0c8a3b394ae877ec08b0db709864e18b4f6cfe053199ae522261252cf14cc419'),
 (FOCUS_HELPER,'7a9caa4056b9ea6a2987ff06d8f795e9ad71a5af1b5c58bcd6e77af94ce7875a'),
 (CANONICAL_CAMERA,'9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'),
 (SEMANTIC,'730fdb74a6661509b8fa4f2a8069e2872d91fab26701aca55e4cc264ab60509d'),
 (D18,'d18ae16ac335ab12c2bd209b3a0eb526f92dba5cbd5f933b7087eff0107f6b60'),
 (RUNNER,'650bb79fc1af50a63a828610bf56e3abcdcaf4bc75466a32f24392e78d2cec5c'),
 (HOOK,'2d79005c96f09f8f1dc009c63969e529d7409fcee370a0317faabcce2dc38393'),
 (ADDITIONAL_ACTUAL,'c60b9dd34d37c42027764af2cb978fe066de6d007a6125bdb5061029accc785d'),
 (BASE/'d1-supplement-requests.json','16088d186cd25ee6d7fa3fc29ad2a2aa45ffab7ddef8ae3748da5a3138e9bee8'),
 (BASE/'d1-complete-merge.json','2184a78457c7444799b857524f860c5c71c58c7c25d14365593d5ad00891a9e8'),
 (BASE/'blender/delivered-provenance.json','c7813f40a8fc9fefb5d0cdea49022e9633be510f69589c852a8b337a15b87d94'),
 (Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v5-20261025/diagnostic/report.json'),'5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d')
]}
ORIGINAL_GUARDS=('allEntryObjectTransformsRestored','noNewGeometryRemains','runtimeBindingsUnchanged','runtimeDataUnchanged','allEntryMaterialAndHighlightInputsRestored','sourcesAndProtectedInputsUnchanged','allDeliveredRawShaAndStatsUnchanged','allOtherExistingSceneOutputsUnchanged','allSceneFilepathsRestored','visibilityQueueClosed')

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def pin(pins,p,h):
    p=Path(p);p=p if p.is_absolute()else W/p;key=str(p)
    assert isinstance(h,str)and len(h)==64 and all(c in '0123456789abcdef'for c in h)
    assert key not in pins or pins[key]==h,('Conflicting pin',key)
    assert sha(p)==h,key;pins[key]=h;return p
def same(a,b,tolerance=1e-9):
    if isinstance(a,dict):return isinstance(b,dict)and a.keys()==b.keys()and all(same(v,b[k],tolerance)for k,v in a.items())
    if isinstance(a,(tuple,list)):return isinstance(b,(tuple,list))and len(a)==len(b)and all(same(x,y,tolerance)for x,y in zip(a,b))
    if isinstance(a,(int,float))and not isinstance(a,bool):return isinstance(b,(int,float))and not isinstance(b,bool)and math.isfinite(float(a))and math.isfinite(float(b))and abs(a-b)<=tolerance
    return a==b
def raw_state(p):
    s=Path(p).stat();return[s.st_size,s.st_mtime_ns,sha(p)]
def safe_output(p):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(FINAL)and p!=FINAL
    assert not p.exists()and not p.is_symlink()and p.parent.is_dir()
    assert not any(q.is_symlink()for q in p.parents if q.exists());return p
def contract(r):return[r[k]for k in['layer','actualFrame','unchangedOtherObjectSourceFrame','semanticOperationTime','cameraOperationTime','pose']]
def strict_child(pins,evidence):
    child=pin(pins,evidence['path'],evidence['sha256']);r=read(child)
    assert r['helperSha256']==PINS[str(RECOVERY)]and r['allPass']and r['toleranceUnchanged']==1e-9
    assert r['missingOriginalGuardNames']==[]and not r['afterOriginalCloseOffenders']and not r['afterCloseVisibilityOffenders']
    assert r['originalCloseError']is None and r['fullComponentRestorationError']is None and r['normalizations']
    assert all(r['protectionChecks'].get(k)is True for k in ORIGINAL_GUARDS)and len(r['protectionChecks'])>=18 and all(v is True for v in r['protectionChecks'].values())
    assert all(v['sameObject']for f in r['namespaceBindings'].values()for v in f.values())
    for n in r['normalizations']:
        x=read(pin(pins,n['path'],n['sha256']))
        assert n['pass']and x['pass']and x['helperSha256']==PINS[str(RECOVERY)]and all(v is True for v in x['protectionChecks'].values())
        assert x['worldBasisTransformConstraintAssignmentsAdded']==0 and x['originalSavedVersusRestoredWorldToleranceUnchanged']==1e-9
    summary={k:r[k]for k in ['helperSha256','allPass','toleranceUnchanged','protectionChecks','missingOriginalGuardNames','originalCloseError','fullComponentRestorationError']}
    summary.update(afterOriginalCloseOffenderCount=0,afterCloseVisibilityOffenderCount=0)
    if 'strictSummary'in evidence:assert evidence['strictSummary']==summary
    return summary

def requested_auditor(times,source_time,straw_geometry):
    """Extract the exact three text-replacement pairs from pinned original d18.

    This is AST data extraction, never execution of the old-cache helper.
    Original semantic code is otherwise byte-identical, including thresholds.
    """
    body=next(n for n in ast.parse(D18.read_text()).body if isinstance(n,ast.FunctionDef)and n.name=='run')
    env={};changes=[];text=SEMANTIC.read_text();original=text
    def literal(n):
        if isinstance(n,ast.Constant)and isinstance(n.value,str):return n.value
        if isinstance(n,ast.BinOp)and isinstance(n.op,ast.Add):return literal(n.left)+literal(n.right)
        assert isinstance(n,ast.Name)and n.id in env;return env[n.id]
    for n in sorted((n for n in ast.walk(body)if isinstance(n,ast.Assign)),key=lambda n:n.lineno):
        if len(n.targets)!=1 or not isinstance(n.targets[0],ast.Name):continue
        name=n.targets[0].id
        if name in('needle','replacement')and isinstance(n.value,ast.Constant):env[name]=literal(n.value)
        v=n.value
        if name=='text'and isinstance(v,ast.Call)and isinstance(v.func,ast.Attribute)and isinstance(v.func.value,ast.Name)and v.func.value.id=='text'and v.func.attr=='replace':
            assert len(v.args)==2 and not v.keywords;a,b=map(literal,v.args)
            assert text.count(a)==1;text=text.replace(a,b,1);changes.append((a,b))
    assert len(changes)==3;inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    scope={'__file__':str(SEMANTIC),'REQUESTED_TIMES':times,'DELIVERED_SOURCE_TIME':source_time,'STRAW_SEMANTIC_GEOMETRY':straw_geometry}
    exec(compile(text,str(SEMANTIC),'exec'),scope)
    return scope,hashlib.sha256(text.encode()).hexdigest(),changes

def js_frame(t):
    assert math.isfinite(float(t))and t>=0
    return int(math.floor(float(t)*30+.5))

def actual_requests(pins,req,coverage,mp4_sha256,additional_actual_manifests):
    """Keep original546 exact; add final candidates/required actual images."""
    old=read(BASE/'d1-supplement-requests.json');assert len(old['requests'])==len(old['requestedTimes'])==546
    assert coverage['mp4Sha256']==mp4_sha256 and coverage['sourceFrames']==12163
    assert coverage['originalCandidatesAllExact']and coverage['allRequestedActualFramesPresent']
    count=coverage['actualEncodedFrames'];assert count in(12162,12163)
    decoded=actual_decoded_rows(pins,coverage,mp4_sha256,additional_actual_manifests);indices=set(decoded)
    selection=read(pin(pins,coverage['selection'],coverage['selectionSha256']))
    assert selection['mp4Sha256']==mp4_sha256 and selection['encodedFrames']==count and selection['sourceFrames']==12163
    assert Path(selection['originalCandidates'])==FINAL/'d1-supplement-requests.json'and selection['originalCandidatesSha256']==sha(selection['originalCandidates'])
    mappings=coverage['actualEndpointMappings'];assert selection['actualEndpointMappings']==mappings
    if count==12163:assert mappings==[]and coverage['actualEofProof']is None
    else:
        assert len(mappings)==1;m=mappings[0];proof=coverage['actualEofProof']
        assert m['requestedSourceFrame']==12162 and m['actualEncodedFrame']==12161 and m['notCueEndOrPhysicalRequest']is True
        assert abs(m['actualEncodedTime']-12161/30)<1e-9 and abs(m['timeDifferenceSeconds']-1/30)<1e-9
        assert proof['containerVideoSamples']==proof['decodedThroughEofFrameCount']==12162 and proof['lastActualFrame']==12161
        assert proof['noRawSubstitution']and proof['noReencode']
        log=pin(pins,proof['tailLog'],proof['tailLogSha256']);text=log.read_text()
        tb=proof['timeBase'];assert len(tb)==2 and all(isinstance(x,int)and x>0 for x in tb)
        found=re.search(r'config in time_base:\s*(\d+)/(\d+)',text);assert found and [int(found[1]),int(found[2])]==tb
        tail=[(int(a),int(b))for a,b in re.findall(r'\bn:\s*(\d+) pts:\s*(\d+) pts_time:',text)]
        assert len(tail)==len(proof['decodedTail'])==3
        for i,((n,pts),r)in enumerate(zip(tail,proof['decodedTail'])):
            assert n==r['tailIndex']==i and pts==r['pts']and abs(pts*tb[0]/tb[1]-(12159+i)/30)<=1e-9
            assert abs(r['exactTime']-pts*tb[0]/tb[1])<=1e-9
    origins={}
    def add(frame,origin):
        assert isinstance(frame,int)and 0<=frame<count and frame in indices
        origins.setdefault(frame,[]).append(origin)
    for kind,source in[('preserved-original546',old),('new-original-inspector-candidate',req)]:
        assert source['episode']=='D-1'and source['automaticApproval']is False
        assert sorted(set(source['requestedTimes']))==sorted(set(r['time']for r in source['requests']))
        for r in source['requests']:
            j=r['frameIndex'];assert isinstance(j,int)and abs(float(r['time'])*30-j)<1e-7
            add(j,{'kind':kind,'originalRequest':r,'requestedSourceTime':r['time'],'requestedSourceFrame':j,'actualEncodedFrame':j,'actualEncodedTime':j/30,'endpointRemapped':False})
    for r in selection['requests']:
        j=js_frame(r['time']);requested=r.get('requestedSourceFrame',j)
        if requested!=j:
            assert count==12162 and requested==12162 and j==12161
            assert 'explicit-actual-last-frame-for-source12162'in r['reasons']and r['requestedSourceTime']==mappings[0]['requestedTime']
        add(j,{'kind':'new-final-required-actual-image','originalRequest':r,'requestedSourceTime':r.get('requestedSourceTime',r['time']),
            'requestedSourceFrame':requested,'actualEncodedFrame':j,'actualEncodedTime':j/30,'endpointRemapped':requested!=j})
    original_frames={r['frameIndex']for r in old['requests']};assert len(original_frames)==546 and original_frames<=set(origins)
    return sorted(origins),origins,{'preservedOriginal546Request':str(BASE/'d1-supplement-requests.json'),
        'preservedOriginal546RequestSha256':PINS[str(BASE/'d1-supplement-requests.json')],
        'original546RequestedTimesUnchanged':old['requestedTimes'],'original546FrameRemaps':0,
        'actualEncodedFrames':count,'actualEndpointMappings':mappings,'actualEofProof':coverage['actualEofProof'],
        'coverageSelectionSha256':coverage['selectionSha256'],'allMeasurementsUseActualEncodedFrameDelivery':True,
        'rawOrGeometryNeverSubstitutesForEndpointPixelEvidence':True}


def camera_policy_replayer(ctx,cam):
    """Execute the exact pinned v9 focus/DOF literals in private globals."""
    import numpy as np
    g,d,bpy=ctx.g,ctx.d,ctx.bpy
    literals={n.targets[0].id:ast.literal_eval(n.value)for n in ast.parse(FOCUS_HELPER.read_text()).body
        if isinstance(n,ast.Assign)and isinstance(n.targets[0],ast.Name)and n.targets[0].id in('FOCUS_CAPTURE','DOF_FUNCTION')}
    assert set(literals)=={'FOCUS_CAPTURE','DOF_FUNCTION'}
    tree=ast.parse(CANONICAL_CAMERA.read_text())
    nodes=[n for n in ast.walk(tree)if isinstance(n,ast.FunctionDef)and n.name=='world_points'];assert len(nodes)==1
    world_scope={'bpy':bpy,'np':np,'hashlib':hashlib,'local_cache':{},'clouds':{}}
    exec(compile(ast.Module(body=nodes,type_ignores=[]),str(CANONICAL_CAMERA)+' [exact world_points]','exec'),world_scope)
    focus_scope={'g':g,'np':np}
    exec(compile('def focus_capture():\n'+literals['FOCUS_CAPTURE'],str(FOCUS_HELPER)+' [exact focus capture]','exec'),focus_scope)
    cp={r['frame']:r for r in cam['physical']};selected={j:{'name':r['phase']}for j,r in cp.items()};models={}
    scope={'ctx':ctx,'g':g,'d':d,'bpy':bpy,'np':np,'same':same,'selected':selected,'all_state_rows':models,'report':{}}
    exec(compile('def install():\n'+literals['DOF_FUNCTION']+'\n        return enforce_readable_dof,readable_dof\n',str(FOCUS_HELPER)+' [exact DOF function]','exec'),scope)
    enforce,records=scope['install']()
    def apply(k):
        t=ctx.rows[k]['unchangedOtherObjectSourceFrame']/30
        role,objects,critical=ctx.tools['principal'](g['cue_at'](t),t)
        pk=world_scope['world_points'](objects);ck=world_scope['world_points'](critical);assert pk is not None
        state={'primary':pk,'critical':ck}
        focus_scope.update(phase={'name':selected[k]['name']},states={0:state},sig=0,clouds=world_scope['clouds'])
        focus_scope['focus_capture']();models[k]=state;enforce(k)
        expected=cam['readableDofByOutputFrame'][str(k)]
        assert same(records[k],expected),('Exact final rendered DOF differs',k)
        return records[k]
    def world_geometry():
        t=ctx.rows[current_source[0]]['unchangedOtherObjectSourceFrame']/30;c=g['cue_at'](current_source[0]/30)
        role,objects,critical=ctx.tools['principal'](c,t);details=None
        if c['group']=='straw':
            dg=bpy.context.evaluated_depsgraph_get();projection=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
            objects,details,_=ctx.module['straw_semantic_geometry'](g,ctx.tools,projection,dg)
        def describe(items):
            key=world_scope['world_points'](items)
            if key is None:return None
            vv=world_scope['clouds'][key][:,:3]
            names=[g['CREATED_NAME'].get(o,o.name)for o in dict.fromkeys(items)if world_scope['world_points']([o])is not None]
            return {'worldBounds':[float(v)for v in np.concatenate((vv.min(axis=0),vv.max(axis=0)))],
                'worldVertexSha256':key,'vertexCount':len(vv),'visibleObjectCreationNames':names,
                'semanticSourceTime':t,'notActualPixelVisibilityOrEyeApproval':True}
        return {'primary':describe(objects),'critical':describe(critical),'strawSeparateRoleDetails':details}
    current_source=[0]
    def geometry(j):
        current_source[0]=j
        try:return world_geometry()
        finally:world_scope['clouds'].clear()
    return apply,geometry

def actual_decoded_rows(pins,coverage,mp4_sha256,additional_actual_manifests):
    """Exact generic-review schema; additional missing546 pixels stay separate."""
    rows={};manifests=[(coverage['manifest'],coverage['manifestSha256']),*additional_actual_manifests]
    for filename,h in manifests:
        mf=pin(pins,filename,h);assert mf.is_absolute()and mf.is_relative_to(FINAL)and mf.resolve().is_relative_to(FINAL.resolve())
        manifest=read(mf);assert manifest['mp4Sha256']==mp4_sha256;seen=set();additional=str(mf)!=coverage['manifest']
        if additional:
            assert manifest['parentCoverage']==str(FINAL/'actual-final-review/required-coverage-and-reuse.json')and manifest['parentCoverageSha256']==sha(manifest['parentCoverage'])
            assert manifest['originalCandidates']==str(BASE/'d1-supplement-requests.json')and manifest['originalCandidatesSha256']==PINS[str(BASE/'d1-supplement-requests.json')]
            assert manifest['sourceFrames']==12163 and manifest['actualEncodedFrames']==coverage['actualEncodedFrames']and manifest['exactOriginal546']==546 and manifest['endpointRemapping']==[]
            assert manifest['allActualImagesFromSameFinalMp4']and manifest['originalManifestsEdited']is False
            assert {r['frameIndex']for r in manifest['frames']}=={r['frameIndex']for r in read(BASE/'d1-supplement-requests.json')['requests']}
        folder=mf.parent/'frames-d1v1'
        for r in manifest['frames']:
            j=r['frameIndex'];assert isinstance(j,int)and not isinstance(j,bool)and 0<=j<coverage['actualEncodedFrames']and j not in seen;seen.add(j)
            f=folder/r['file'];assert f.is_relative_to(folder)and f.resolve().is_relative_to(FINAL.resolve())and f.is_file()
            if f.is_symlink():assert additional and j in rows and f.resolve()==Path(rows[j]['actualDecodedJpeg']).resolve()and r['fileSha256']==rows[j]['fileSha256']
            else:assert f.resolve().is_relative_to(folder.resolve())
            if additional:assert r['sourceIsFinalMp4']and r['rawSourceSubstitution']is False
            pin(pins,f,r['fileSha256'])
            row={**r,'actualDecodedJpeg':str(f),'actualDecodedManifest':str(mf),'actualDecodedManifestSha256':h}
            if j in rows:assert rows[j]['fileSha256']==r['fileSha256'],('Duplicate actual frame has differing encoded JPEG evidence',j)
            else:rows[j]=row
    return rows

def face_hint(data,j):
    t=j/30;c=next((c for c in reversed(data['cues'])if c['start']<=t),data['cues'][0])
    face=c.get('face')
    return {'cue':c['key'],'declaration':face,'possibleWholeFaceDeclared':bool(face and not face.get('small',False)),
        'scope':'Cue metadata only; fade/opacity/occlusion require the actual final decoded JPEG',
        'geometryPassNotChangedByFaceHint':True,'wholeFaceExceptionApprovedHere':False}

def run(ns,authorized=False,*,prepared_sha256,export_sha256,request,request_sha256,mp4,mp4_sha256,
        pier_render_report,pier_render_report_sha256,pier_completion_sha256,pier_probe_report_sha256,
        camera_render_report,camera_render_report_sha256,camera_audit_report_sha256,
        recovery_diagnostic_sha256,review_coverage,review_coverage_sha256,out,additional_actual_manifests=()):
    assert authorized is True and FINAL.is_dir()and not FINAL.is_symlink()
    pins={}
    for p,h in PINS.items():pin(pins,p,h)
    pin(pins,Path(__file__).resolve(),sha(__file__))
    prepared_file=pin(pins,FINAL/'prepared.json',prepared_sha256);export_file=pin(pins,FINAL/'export.json',export_sha256)
    request=pin(pins,request,request_sha256);mp4=pin(pins,mp4,mp4_sha256);review_coverage=pin(pins,review_coverage,review_coverage_sha256)
    assert request==FINAL/'d1-supplement-requests.json'and mp4==FINAL/'out/ys-chain-d1v1.mp4'
    assert review_coverage==FINAL/'actual-final-review/required-coverage-and-reuse.json'
    pier_render_report=pin(pins,pier_render_report,pier_render_report_sha256);camera_render_report=pin(pins,camera_render_report,camera_render_report_sha256)
    assert pier_render_report==PIER/'render/report.json'and camera_render_report==CAMERA/'render/report.json'
    prepared,exported,req,coverage=map(read,[prepared_file,export_file,request,review_coverage]);pr,cam=map(read,[pier_render_report,camera_render_report])
    assert prepared['cache']==str(FINAL)and prepared['source']==str(BASE)and prepared['frames']==12163 and prepared['finalAcceptance']is False
    assert prepared['runnerSha256']==PINS[str(RUNNER)]and prepared['hookSha256']==PINS[str(HOOK)]and prepared['cameraPierMapsDisjoint']
    assert prepared['report']==str(pier_render_report)and prepared['reportSha256']==pier_render_report_sha256 and prepared['helperSha256']==PINS[str(ADAPTER)]
    assert prepared['cameraReport']==str(camera_render_report)and prepared['cameraReportSha256']==camera_render_report_sha256 and prepared['cameraHelperSha256']==PINS[str(CAMERA_HELPER)]
    assert exported['preparedSha256']==prepared_sha256 and exported['video']==str(mp4)and exported['videoSha256']==mp4_sha256 and exported['sourceFrames']==12163
    for hh in[prepared['protectedInputSha256'],prepared['generatedInputSha256'],pr['pins'],cam['pins']]:
        for p,h in hh.items():pin(pins,p,h)
    assert pr['mode']==cam['mode']=='render'and pr['helperSha256']==PINS[str(ADAPTER)]and cam['helperSha256']==PINS[str(CAMERA_HELPER)]
    for r in[pr,cam]:assert not r.get('error')and not r.get('cleanupError')and r['allReplacementPhysicalPass']and r['allRequestedActuallyRendered']and r['allPatchFramesActuallyRendered']and r['protectionChecks']and all(v is True for v in r['protectionChecks'].values())
    completion_file=pin(pins,prepared['pierAdapterCompletion'],pier_completion_sha256);completion=read(completion_file)
    assert completion_file==PIER/'render/v5-adapter-completion.json'and prepared['pierAdapterCompletionSha256']==pier_completion_sha256
    assert completion['adapterSha256']==PINS[str(ADAPTER)]and completion['frozenRunReportSha256']==pier_render_report_sha256
    assert completion['extraPinsUnchanged']and completion['strictCompleteTransformRestorationPassed']and not completion.get('error')
    for p,h in completion['extraProtectedInputSha256'].items():pin(pins,p,h)
    assert completion['actual120DiagnosticSha256']==recovery_diagnostic_sha256 and completion['completeTransformRestorationEvidence']
    for child in completion['completeTransformRestorationEvidence']:strict_child(pins,child)
    strict_child(pins,cam['completeTransformRestorationEvidence'])
    # Actual120 all6 strict recovery is required before episode namespace access.
    adapter=runpy.run_path(str(ADAPTER));extra=adapter['diagnostic_pins'](recovery_diagnostic_sha256)
    for p,h in extra.items():pin(pins,p,h)
    camera_audit=pin(pins,CAMERA/'audit/report.json',camera_audit_report_sha256);ca=read(camera_audit)
    assert cam['auditReportSha256']==camera_audit_report_sha256 and ca['mode']=='audit'and ca['renders']==0 and ca['allReplacementPhysicalPass']and not ca.get('error')and not ca.get('cleanupError')and all(v is True for v in ca['protectionChecks'].values())
    # The current APIs never generate obsolete105 audit receipts. Verify
    # actual120 proof and exact final audit/probe/render records instead.
    for rr in[pr,cam,ca]:
        q=rr['verifiedV5RuntimeAdapter'];expected='three-pier-images'if rr is pr else'four-cue-camera'
        assert q['role']==expected and q['adapterSha256']==rr['helperSha256']
        assert q['actual120DiagnosticSha256']==recovery_diagnostic_sha256 and q['recoveryHelperSha256']==PINS[str(RECOVERY)]
        assert q['actual120StrictSuccessRequiredBeforeNamespace']and q['old105SuccessNotAssumed']and q['thresholdsGeometryAndOperationTimesUnchanged']
        for p,h in q['extraProtectedInputSha256'].items():pin(pins,p,h)
    cpfile=pin(pins,CAMERA/'probe/report.json',cam['approvedProbeReportSha256']);cam_probe=read(cpfile)
    for rr,m in[(ca,'audit'),(cam_probe,'probe'),(cam,'render')]:
        assert rr['mode']==m and rr['helperSha256']==PINS[str(CAMERA_HELPER)]and rr['allReplacementPhysicalPass']
        assert not rr.get('error')and not rr.get('cleanupError')and all(v is True for v in rr['protectionChecks'].values())
        assert rr['entryDofRestorationPassed']and rr['protectionChecks']['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9']
        for e in rr['entryDofRestorationEvidence']:
            assert e['pass']and e['originalCloseCompleted']and e['toleranceUnchanged']==1e-9 and e['restorationSettersAdded']==0
            assert set(e['entry'])==set(e['afterOriginalClose'])=={'use_dof','focus_distance','aperture_fstop'}
            assert same(e['entry'],e['afterOriginalClose'])
        for field in['fixedPhasePoses','replacementFrameToActualPatchFrame','deliveredCameraPoses','physical','cameraMotion','readableDofByOutputFrame']:
            assert same(rr[field],cam[field]),('Actual camera proof mismatch',m,field)
        strict_child(pins,rr['completeTransformRestorationEvidence'])
    assert cam_probe['auditReportSha256']==camera_audit_report_sha256 and cam_probe['allRequestedActuallyRendered']
    pier_probe=pin(pins,PIER/'probe/report.json',pier_probe_report_sha256)
    assert pr['approvedProbeReport']==str(pier_probe)and pr['approvedProbeReportSha256']==pier_probe_report_sha256
    for r,path_key,hash_key in[(pr,'rootProbeVisualReceipt','rootProbeVisualReceiptSha256'),(cam,'rootVisualReceipt','rootVisualReceiptSha256')]:
        eye=read(pin(pins,r[path_key],r[hash_key]));assert eye['approved']and eye['allRequiredProbeImagesPersonallyViewed']and eye['helperSha256']==r['helperSha256']and eye['probeReportSha256']==r['approvedProbeReportSha256']
    assert req['episode']=='D-1'and req['automaticApproval']is False
    gate_file=pin(pins,req['originalGate'],req['originalGateSha256']);npz=pin(pins,req['originalFrameSamples'],req['originalFrameSamplesSha256'])
    assert gate_file.is_relative_to(FINAL)and npz.is_relative_to(FINAL)and read(gate_file)['thresholds']==req['originalThresholds']
    gate_receipt=gate_file.parent/'d1-original-and-supplement-pending.json';pin(pins,gate_receipt,sha(gate_receipt));gate=read(gate_receipt)
    assert gate['mp4Sha256']==mp4_sha256 and gate['allOriginalNGPreserved']
    frames,origins,endpoint=actual_requests(pins,req,coverage,mp4_sha256,additional_actual_manifests);times=[j/30 for j in frames]
    image=runpy.run_path(str(IMAGES));audit=runpy.run_path(str(AUDIT));recovery=runpy.run_path(str(RECOVERY))
    audit_file=pin(pins,pr['auditReport'],pr['auditReportSha256']);assert audit_file==PIER/'audit/report.json'
    load=image['load_audit'];private_load=types.FunctionType(load.__code__,{**load.__globals__,'OUT':PIER},load.__name__,load.__defaults__,load.__closure__)
    _,states,pier_map=private_load(audit_file,pr['auditReportSha256'])
    assert pier_map=={int(j):int(k)for j,k in pr['replacementFrameToActualPatchFrame'].items()}
    assert len(states)==pr['actualSources']==prepared['pillarActualSources']==2062 and len(pier_map)==pr['replacementOutputs']==prepared['pillarReplacementOutputs']==5004
    camera_map={int(j):int(k)for j,k in cam['replacementFrameToActualPatchFrame'].items()};assert not set(camera_map)&set(pier_map)and cam['pierOutputIntersection']==[]
    assert len(camera_map)==cam['replacementOutputs']==prepared['cameraReplacementOutputs']==948 and len(set(camera_map.values()))==cam['actualSources']==prepared['cameraActualSources']==428
    assert set(map(int,cam['readableDofByOutputFrame']))==set(camera_map)
    for snap in prepared['sourceFileSnapshots']:
        assert Path(snap['file']).stat().st_size==snap['bytes']and sha(snap['file'])==snap['sha256'],('Prepared source content differs',snap['file'])
    def indexed_images(r):
        result={im['frame']:im for im in r['actualImages']};assert len(result)==len(r['actualImages'])==r['actualSources']
        for k,im in result.items():assert Path(im['path'])==Path(r['raw'])/('%05d.jpg'%k);pin(pins,im['path'],im['sha256'])
        return result
    pi,ci=indexed_images(pr),indexed_images(cam);pp={r['frame']:r for r in pr['physical']};cp={r['frame']:r for r in cam['physical']}
    assert set(states)==set(pi)==set(pp)and len(cp)==len(cam['physical'])==len(camera_map)
    pa=read(pin(pins,pr['anchors'],pr['anchorsSha256']));caa=read(pin(pins,cam['anchors'],cam['anchorsSha256']))
    rows=read(FINAL/'blender/delivered-provenance.json')['frames'];poses=read(FINAL/'blender/delivered-camera-poses.json')
    anchors=read(FINAL/'blender/desk/anchors.json');meta=read(FINAL/'blender/desk/meta.json')
    base_rows=read(BASE/'blender/delivered-provenance.json')['frames'];base_anchors=read(BASE/'blender/desk/anchors.json')
    assert len(rows)==len(poses)==len(base_rows)==anchors['frames']==meta['frames']==12163 and anchors['key']==meta['key']
    names=set(anchors['anchors']);assert names==set(pa['anchors'])==set(caa['anchors'])==set(base_anchors['anchors'])
    assert anchors['fps']==pa['fps']==caa['fps']==30 and all(len(v)==12163 for a in[anchors,pa,caa,base_anchors]for v in a['anchors'].values())
    raw_before={};links_before={}
    for j,(row,old)in enumerate(zip(rows,base_rows)):
        assert row['frame']==old['frame']==j and row['pose']==poses[j]==cam['deliveredCameraPoses'][j]
        if j in camera_map:
            k=camera_map[j];source=cam['patchFrameToOriginalDeliveredRow'][str(k)];ph=cp[j]
            assert source==base_rows[k]and contract(source)==contract(old)and ph['delivered']==old and ph['patchSource']==k and ph['pose']==poses[j]and ph['pass']and ph['primary40to70AndSafe1550']and ph['originalCriticalSafe1100']
            expected={**old,'layer':'four-cue-camera','actualFrame':k,'pose':poses[j],'cameraOperationTime':k/30,'raw':ci[k]['path'],'originalDeliveredRow':old,'cameraSourceDeliveredRow':source,'cameraPatchSourceFrame':k,'originalModelHandAndSemanticOperationTimesPreserved':True}
            expected_anchors={n:caa['anchors'][n][k]for n in names}
        elif j in pier_map:
            k=pier_map[j];source=pr['patchFrameToOriginalDeliveredRow'][str(k)]
            assert source==base_rows[k]==states[k]['delivered']==pp[k]['delivered']and contract(source)==contract(old)and pp[k]['pose']==old['pose']and pp[k]['pass']
            expected={**old,'layer':'pier-contact','actualFrame':k,'raw':pi[k]['path'],'originalDeliveredRow':old,'pierSourceDeliveredRow':source,'pierContactSourceFrame':k,'originalCameraAndSemanticOperationTimesPreserved':True}
            expected_anchors={n:pa['anchors'][n][k]for n in names}
        else:expected=old;expected_anchors={n:base_anchors['anchors'][n][j]for n in names}
        assert row==expected and all(anchors['anchors'][n][j]==expected_anchors[n]for n in names),('Exact delivered mapping/anchors failed',j)
        link=FINAL/'blender/desk'/('%05d.jpg'%j);raw=link.resolve();assert raw==Path(row['raw']).resolve();links_before[str(link)]=str(raw)
        if str(raw)not in raw_before:raw_before[str(raw)]=raw_state(raw)
    dest=safe_output(out);replay_file=safe_output(dest.with_name(dest.stem+'-evaluated-replay.json'))
    decoded=actual_decoded_rows(pins,coverage,mp4_sha256,additional_actual_manifests);data=read(FINAL/'blender/data.json')
    report={'episode':'D-1','mode':'exact-final-camera-pier-layout-physical-supplement','helperSha256':sha(__file__),
        'cache':str(FINAL),'preparedSha256':prepared_sha256,'exportSha256':export_sha256,'request':str(request),'requestSha256':request_sha256,
        'mp4':str(mp4),'mp4Sha256':mp4_sha256,'reviewCoverage':str(review_coverage),'reviewCoverageSha256':review_coverage_sha256,
        'pierRenderReport':str(pier_render_report),'pierRenderReportSha256':pier_render_report_sha256,'pierAdapterCompletionSha256':pier_completion_sha256,
        'cameraRenderReport':str(camera_render_report),'cameraRenderReportSha256':camera_render_report_sha256,
        'actual120DiagnosticSha256':recovery_diagnostic_sha256,'actualCameraAuditSha256':camera_audit_report_sha256,'actualPierProbeSha256':pier_probe_report_sha256,
        'requestedTimes':times,'requestedFrameOrigins':origins,'endpointEvidence':endpoint,'renders':0,
        'all12163OutputLayerCounts':{'fourCueCamera':len(camera_map),'pierContact':len(pier_map),'unchangedQ4':12163-len(camera_map)-len(pier_map)},
        'replayScope':'Only preserved original546, new original-inspector candidates and required actual-review selection; all12163 raw/pose/anchors are joined, not all12163 newly geometry-replayed',
        'additionalActualManifests':[{'path':str(Path(p)),'sha256':h,'scope':'Additional exact decoded images; not a mutation of the original final review manifest'}for p,h in additional_actual_manifests],
        'actualDecodedImagesPinnedNotPersonallyViewed':True,'currentOriginalNG':req['originalNG'],
        'preservedOriginal546NG':read(BASE/'d1-supplement-requests.json')['originalNG'],
        'originalNG':req['originalNG'],'originalGateSha256':req['originalGateSha256'],'originalFrameSamplesSha256':req['originalFrameSamplesSha256'],
        'originalThresholds':req['originalThresholds'],'protectedInputSha256':pins,'originalNGPreserved':True,'automaticApproval':False,
        'actualEncodedImageNeedsEyeReview':True,'allActualImagesPersonallyViewed':False,'earsVerified':False,'finalAcceptance':False}
    ctx=None;checks={};observations={};started=time.time()
    try:
        ctx=recovery['DeliveredReplay'](ns,cache=BASE);ctx.open();ctx.protected.update(pins)
        g,d,bpy=ctx.g,ctx.d,ctx.bpy;assert sha(g['__file__'])==STAGE and ctx.rows==base_rows
        apply_dof,world_geometry=camera_policy_replayer(ctx,cam)
        def apply(t):
            j=js_frame(t);assert j in origins;row=rows[j];contacts=[];dof=None
            if row['layer']=='four-cue-camera':
                k=row['actualFrame'];source=row['cameraSourceDeliveredRow'];points=ctx.replay(source)
                objects={o:audit['object_state'](o)for o in ctx.scene.objects if o is not d.CAM}
                types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:poses[j]})(k/30);bpy.context.view_layer.update()
                assert all(audit['object_state'](o)==s for o,s in objects.items()),'Camera-only replay changed a model or hand'
                dof=apply_dof(k)
                assert same({a:v for a,v in dof.items()if a!='frame'},{a:v for a,v in cam['readableDofByOutputFrame'][str(j)].items()if a!='frame'})
                projected={n:list(d.project(v))for n,v in points.items()}
            elif row['layer']=='pier-contact':
                k=row['actualFrame'];fresh,projected=image['apply_checked'](ctx,audit,states[k]);assert image['same'](fresh,pp[k]);contacts=fresh['contacts']
            else:
                points=ctx.replay(row);projected={n:list(d.project(v))for n,v in points.items()}
            expected={n:anchors['anchors'][n][j]for n in names}
            assert set(projected)==names and same(projected,expected,1e-5),('Actual versus delivered anchors mismatch',j)
            actual=decoded[j];geometry=world_geometry(j)
            observation={'deliveredFrame':row,'actualEncodedFrame':j,'actualEncodedTime':j/30,'requestedOrigins':origins[j],
                'actualFinalDecodedJpeg':actual['actualDecodedJpeg'],'actualFinalDecodedJpegSha256':actual['fileSha256'],
                'actualDecodedManifestRow':actual,'semanticWorldGeometry':geometry,'faceDeclarationHint':face_hint(data,j),
                'finalCameraDofPolicyReplayed':dof,'actualRawSourceFrame':row['actualFrame'],
                'unchangedOtherObjectSourceFrame':row['unchangedOtherObjectSourceFrame'],'semanticOperationTime':row['semanticOperationTime'],'cameraOperationTime':row['cameraOperationTime'],
                'actualRawSha256':sha(row['raw']),'actualCameraWorldMatrix':[float(v)for line in d.CAM.matrix_world for v in line],
                'actualCameraLens':d.CAM_D.lens,'actualProjectedAnchors':projected,'deliveredAnchors':expected,'anchorsMatchTolerancePixels':1e-5,
                'pierContacts':contacts,'caseSupplementApproved':False,'actualEncodedImageNeedsEyeReview':True}
            if j in observations:assert same(observations[j],observation)
            observations[j]=observation;return projected
        def pose(t):return poses[max(0,min(12162,js_frame(t)))]
        def source_time(t):return rows[js_frame(t)]['unchangedOtherObjectSourceFrame']/30
        scope,adapted_hash,changes=requested_auditor(times,source_time,ctx.module['straw_semantic_geometry'])
        private={**g,'apply':apply,'pose_at':pose}
        result=scope['check']({'main':types.FunctionType(g['main'].__code__,private)},str(replay_file),
            revision='Exact final four-cue-camera > three-pier-contact > Q4 delivery; unchanged d18 principal/straw/thresholds; no waiver',expected_source=STAGE)
        assert len(result['rows'])==len(frames)and sorted(js_frame(r['time'])for r in result['rows'])==frames and set(observations)==set(frames)
        for r in result['rows']:
            j=js_frame(r['time']);assert r['actualPose']==poses[j];r.update(observations[j])
            for name,field in [('primary','actualSurface'),('critical','criticalSurface')]:
                world=r['semanticWorldGeometry'][name]
                if r[field]is None:assert world is None
                else:
                    assert world is not None and world['vertexCount']==r[field]['vertexCount']
                    assert world['visibleObjectCreationNames']==r[field]['objectNames'],'World bounds must describe the same untouched semantic role'
        report.update(rows=result['rows'],allPass=result['allPass'],failures=result['failures'],metadata=result['metadata'],cueCount=result['cueCount'],states=result['states'],
            evaluatedReplayReport=str(replay_file),evaluatedReplayReportSha256=sha(replay_file),adaptedAuditorSha256=adapted_hash,
            unchangedAuditorSha256=PINS[str(SEMANTIC)],exactPriorD18AdaptationPairs=changes,originalNumericThresholdsUnchanged=True,
            exactDeliveredSourcesAndPosesUsed=True,everyOriginalNGPreserved=True,all12163RawPoseAnchorMappingsVerified=True,
            exactRequestedFrames=len(frames),original546RequestsUnchanged=True,original546FrameRemaps=0,
            noOriginalPhysicalRequestEndpointFallback=True,explicitSameApprovedStrawRoles=True,caseSupplementApproved=False,
            status='Evaluated geometry only; all original/final NG retained; actual encoded images require attributed case review')
    except BaseException as error:
        report['error']={'type':type(error).__name__,'message':str(error)[:1200]};raise
    finally:
        if ctx is not None:
            try:checks.update(ctx.close())
            except BaseException as error:checks['replayRestorationCompleted']=False;report['cleanupError']={'type':type(error).__name__,'message':str(error)[:1200]}
            try:
                dof_after={k:getattr(ctx.d.CAM_D.dof,k)for k in ctx.dof}
                checks['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9']=set(ctx.dof)=={'use_dof','focus_distance','aperture_fstop'}and same(ctx.dof,dof_after)
                report['entryDofRestorationEvidence']={'entry':ctx.dof,'afterOriginalClose':dof_after,'toleranceUnchanged':1e-9,'restorationSettersAdded':0,'pass':checks['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9']}
            except BaseException as error:
                checks['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9']=False;report['dofRestorationError']={'type':type(error).__name__,'message':str(error)[:1200]}
            evidence=ctx.transformRestorationReport;report['completeTransformRestorationEvidence']=evidence
            if evidence is not None:
                try:report['completeTransformRestorationStrictSummary']=strict_child(pins,evidence);checks['strictCompleteTransformRestorationPassed']=True
                except BaseException as error:checks['strictCompleteTransformRestorationPassed']=False;report['restorationEvidenceError']={'type':type(error).__name__,'message':str(error)[:1200]}
        else:checks['replayNamespaceOpened']=False
        try:checks['allPinnedInputsShaUnchanged']=all(sha(p)==h for p,h in pins.items())
        except OSError:checks['allPinnedInputsShaUnchanged']=False
        try:checks['allFinalDeliveredRawShaAndStatsUnchanged']=all(raw_state(p)==s for p,s in raw_before.items())
        except OSError:checks['allFinalDeliveredRawShaAndStatsUnchanged']=False
        checks['allFinal12163RawLinksUnchanged']=all(str(Path(p).resolve())==v for p,v in links_before.items())
        report.update(protectionChecks=checks,seconds=round(time.time()-started,3),allOriginalNGPreserved=True,automaticApproval=False,finalAcceptance=False,renders=0)
        write(dest,report);assert checks and all(v is True for v in checks.values()),checks
    return report

