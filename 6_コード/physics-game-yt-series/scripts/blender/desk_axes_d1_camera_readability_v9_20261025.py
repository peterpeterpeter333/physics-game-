"""Root-only DOF derivative of actual-v8 fixed cameras; import is inert.

No camera search: actual-v8 poses, model/source states, anchors, geometry and
times must compare unchanged. Only focus/use_dof/aperture are set after the
private actual camera application. Existing/shared helpers remain immutable.
Fresh audit/probe and root pixel review are required; old blurry pixels stay.
"""
import hashlib
import json
from pathlib import Path
import runpy
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
V8=W/'scripts/blender/desk_axes_d1_camera_solver_v8_20261025.py'
V8_SHA='85420b61e740d63102703ebf04032c51de46f98022a1660d7c70467845446e11'
BASE=W/'scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'
BASE_SHA='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
CAMERA=W/'scripts/blender/desk_axes_d1_four_cue_camera_20261025.py'
CAMERA_SHA='9624c1496089b41d22e7b2321515a7fec2847506685e24d64726259e48c37e00'
V8_ROOT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v8-20261025')
V8_AUDIT_SHA='7534f6d06c467a4e37df799ed460d83379ebd5be2f7341eeaf312f532631bb74'
V8_PROBE_SHA='d24e88a38a5164a6c2a7296431161612040b112db8640f68766142dcf5794290'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-20261025')

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

FOCUS_CAPTURE="""
                if phase['name']=='twenty-two-palms':
                    roots=g['P']['area']['palms'];assert len(roots)==22
                    focus=np.mean([np.asarray(o.matrix_world.translation,dtype=float)for o in roots],axis=0)
                    focus_role='actual22 palm-root plane, not the lowered framing target'
                else:
                    focus_cloud=clouds[states[sig]['critical']or states[sig]['primary']][:,:3]
                    focus=(focus_cloud.min(axis=0)+focus_cloud.max(axis=0))*.5
                    focus_role='actual critical-surface center'if states[sig]['critical']else'actual principal-surface center'
                assert np.isfinite(focus).all()
                states[sig].update(readableFocusPoint=[float(v)for v in focus],readableFocusRole=focus_role)
"""
DOF_FUNCTION="""        readable_dof={};report['readableDofByOutputFrame']=readable_dof
        def enforce_readable_dof(j):
            assert j in selected
            model=all_state_rows[j];point=g['Vector'](model['readableFocusPoint'])
            assert d.CAM_D.dof.focus_object is None,'A foreign focus_object must not silently override the policy'
            world=np.asarray(d.CAM.matrix_world).copy();lens=float(d.CAM_D.lens)
            dg=bpy.context.evaluated_depsgraph_get()
            projection=np.asarray(d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()).copy()
            phase=selected[j]['name'];requested_fstop=64. if phase=='square'else 11.2
            # RNA stores these camera scalars as binary32. Test that exact
            # stored value, rather than loosening the original1e-9 tolerance.
            focus=float(np.float32((point-d.CAM.location).length));fstop=float(np.float32(requested_fstop))
            assert focus>0
            d.CAM_D.dof.use_dof=True;d.CAM_D.dof.focus_distance=focus;d.CAM_D.dof.aperture_fstop=fstop
            bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
            after=np.asarray(d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted())
            matrix_error=float(np.abs(np.asarray(d.CAM.matrix_world)-world).max());projection_error=float(np.abs(after-projection).max())
            assert matrix_error<=1e-9 and projection_error<=1e-9 and float(d.CAM_D.lens)==lens
            assert d.CAM_D.dof.use_dof and abs(float(d.CAM_D.dof.focus_distance)-focus)<=1e-9 and abs(float(d.CAM_D.dof.aperture_fstop)-fstop)<=1e-9
            record={'frame':j,'phase':phase,'unchangedOtherObjectSourceFrame':ctx.rows[j]['unchangedOtherObjectSourceFrame'],'focusPoint':model['readableFocusPoint'],'focusRole':model['readableFocusRole'],'requestedFstop':requested_fstop,'storedFstop':float(d.CAM_D.dof.aperture_fstop),'storedFocusDistance':float(d.CAM_D.dof.focus_distance),'useDof':True,'lensUnchanged':lens,'cameraWorldMatrixDelta':matrix_error,'projectionMatrixDelta':projection_error,'toleranceUnchanged':1e-9,'actualPixelApproval':False}
            if j in readable_dof:assert same(record,readable_dof[j])
            else:readable_dof[j]=record
"""

def adapted_camera_source():
    retained=runpy.run_path(str(V8));original,metadata=retained['adapted_camera_source']();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,('Nonunique DOF boundary',a[:80]);text=text.replace(a,b,1);changes.append((a,b))
    marker="            if prior:fitted[name]=prior['fixedPhasePoses'][name];continue"
    replace(marker,"            fitted[name]=APPROVED_V8_AUDIT['fixedPhasePoses'][name]\n            if prior:assert same(fitted[name],prior['fixedPhasePoses'][name])\n            continue")
    marker="                states[sig]={'primary':world_points(objects),'critical':world_points(critical),'role':role,'delivered':row}"
    replace(marker,marker+FOCUS_CAPTURE)
    marker='        unique={};mapping={};sources={};physical=[]'
    replace(marker,DOF_FUNCTION+marker)
    marker="            camera(p);model=all_state_rows[j];b=box(clouds[model['primary']]);c=box(clouds[model['critical']])if model['critical']else None"
    replace(marker,marker.replace('camera(p);model=','camera(p);enforce_readable_dof(j);model='))
    marker="            fn=types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:delivered_poses[j]});fn(t);bpy.context.view_layer.update()"
    replace(marker,marker+';enforce_readable_dof(j)')
    marker="        if prior:\n            assert same(plan['fixedPhasePoses'],prior['fixedPhasePoses'])and same(physical,prior['physical'])"
    replace(marker,"        for field in ['fixedPhasePoses','replacementFrameToActualPatchFrame','patchFrameToOriginalDeliveredRow','deliveredCameraPoses','physical','cameraMotion']:\n            value=plan[field]\n            if isinstance(value,dict):value={str(k):v for k,v in value.items()}\n            assert same(value,APPROVED_V8_AUDIT[field]),('DOF-only derivative changed v8 geometry/plan',field)\n        assert len(readable_dof)==len(selected)\n"+marker)
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    return text,{**metadata,'additionalV9ReversibleSourceBoundaries':len(changes),'v9InverseByteIdenticalToV8DerivedSource':True,
        'retainedV8Source':str(V8),'retainedV8SourceSha256':V8_SHA,'v8AuditReport':str(V8_ROOT/'audit/report.json'),'v8AuditReportSha256':V8_AUDIT_SHA,
        'v8ProbeReport':str(V8_ROOT/'probe/report.json'),'v8ProbeReportSha256':V8_PROBE_SHA,
        'solverNotRerun':True,'allV8PhysicalAndCameraPlanFieldsMustMatchAtTolerance1eMinus9':True,
        'explicitDofDerivative':{'squareRequestedFstop':64,'allOtherSelectedPhasesRequestedFstop':11.2,'focus':'actual22 palm plane, otherwise critical/principal evaluated world-surface center','cameraWorldAndProjectionMatricesMustRemainWithin':1e-9,'rnaScalarsCheckedAtTheirExactBinary32Values':True,'oldV8PixelsNotReused':True,'actualPixelApprovalPending':True}}

def run_camera(ns,authorized=False,mode='audit',*,recovery_diagnostic_sha256='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',
        audit_report_sha256=None,probe_report_sha256=None,root_visual_receipt=None,root_visual_receipt_sha256=None):
    assert authorized is True and mode in('audit','probe','render')
    pins={str(BASE):BASE_SHA,str(V8):V8_SHA,str(CAMERA):CAMERA_SHA,str(V8_ROOT/'audit/report.json'):V8_AUDIT_SHA,str(V8_ROOT/'probe/report.json'):V8_PROBE_SHA,str(Path(__file__).resolve()):sha(__file__)}
    for p,h in pins.items():assert sha(p)==h,p
    approved=json.loads((V8_ROOT/'audit/report.json').read_text());probe=json.loads((V8_ROOT/'probe/report.json').read_text())
    for r,m in [(approved,'audit'),(probe,'probe')]:
        assert r['mode']==m and r['helperSha256']==V8_SHA and r['allReplacementPhysicalPass']and not r.get('error')and not r.get('cleanupError')and all(v is True for v in r['protectionChecks'].values())
        assert r['actualSources']==428 and r['replacementOutputs']==948
        pins.update(r['pins'])
    assert probe['allRequestedActuallyRendered']and len(probe['actualImages'])==30 and probe['auditReportSha256']==V8_AUDIT_SHA
    assert approved['fixedPhasePoses']==probe['fixedPhasePoses']and approved['deliveredCameraPoses']==probe['deliveredCameraPoses']
    text,metadata=adapted_camera_source();real=runpy.run_path
    def private_run_path(path,*args,**kwargs):
        if Path(path).resolve()==CAMERA:
            assert not args and not kwargs;scope={'__name__':'d1_camera_readability_v9_private','__file__':str(CAMERA),'APPROVED_V8_AUDIT':approved}
            exec(compile(text,str(CAMERA)+' [reversible DOF-only derivative of actualv8]','exec'),scope);return scope
        return real(path,*args,**kwargs)
    base=real(str(BASE));scope=base['_rebind']({'run':base['run_camera']},{'CAMERA_OUT':OUT,'__file__':str(Path(__file__).resolve()),'runpy':types.SimpleNamespace(run_path=private_run_path)})
    original_proof=scope['_proof']
    def proof(role,protected):
        for p,h in pins.items():assert p not in protected or protected[p]==h;protected[p]=h
        return{**original_proof(role,protected),'fixedCameraSolverDerivative':{**metadata,'priorRuntimeAdapter':str(BASE),'priorRuntimeAdapterSha256':BASE_SHA}}
    scope['_proof']=proof
    try:
        return scope['run_camera'](ns,authorized=True,mode=mode,recovery_diagnostic_sha256=recovery_diagnostic_sha256,
            audit_report_sha256=audit_report_sha256,probe_report_sha256=probe_report_sha256,
            root_visual_receipt=root_visual_receipt,root_visual_receipt_sha256=root_visual_receipt_sha256)
    finally:
        for p,h in pins.items():assert sha(p)==h,p
