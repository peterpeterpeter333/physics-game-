"""Root-only D hidden-cache normalization and strict complete replay cleanup.

Temporarily unhide OWNED visibility, normally evaluate, restore every flag,
normally evaluate again. No transform/world/basis/constraint setter is added
by normalization. Snapshot and restoration compare actual Blender world state
at the original1e-9; parent-equation float-roundoff diagnostics are separate.
Original7e10 close guards execute directly and cannot be swallowed by150a.
Actual105/112/117 and every original file remain immutable. No rendering.
"""
import hashlib
import json
from pathlib import Path
import runpy
import time

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
V2=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
V2_SHA='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
AUDIT=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
AUDIT_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
IMAGES_SHA='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v5-20261025')
FAILED=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v4-pointer-20261025/diagnostic/report.json')
FAILED_SHA='28638bf284a7b32b74187b3e18077cea8432ad5e1e41a408d2995e653fdb59b9'
FAILED_CHILD=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v4-pointer-20261025/transform-restoration/close-1792907335017810000.json')
FAILED_CHILD_SHA='fb2a10b93126585d2779ff2d396a8d5b8aac33c90af1ec554786379ab4ea099e'
TOLERANCE=1e-9
ORIGINAL_GUARDS=('allEntryObjectTransformsRestored','noNewGeometryRemains','runtimeBindingsUnchanged',
 'runtimeDataUnchanged','allEntryMaterialAndHighlightInputsRestored','sourcesAndProtectedInputsUnchanged',
 'allDeliveredRawShaAndStatsUnchanged','allOtherExistingSceneOutputsUnchanged','allSceneFilepathsRestored','visibilityQueueClosed')
SCENARIOS=('engine-catalog-oblique','engine-catalog-top','no-operation','exact-delivered7917','problem-challenge','problem-answer')
PINS={str(V2):V2_SHA,str(AUDIT):AUDIT_SHA,str(IMAGES):IMAGES_SHA,str(FAILED):FAILED_SHA,str(FAILED_CHILD):FAILED_CHILD_SHA}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def flat(m):return[float(v)for row in m for v in row]
def delta(a,b):return max((abs(x-y)for x,y in zip(a,b)),default=0.)
def verify():
    for p,h in PINS.items():assert sha(p)==h,p
def write(p,x):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(OUT)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists());p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def error_info(e):return None if e is None else {'type':type(e).__name__,'messagePrefix':str(e)[:240]}
def pointer(o):return o.as_pointer()if o is not None else None

verify();_v2=runpy.run_path(str(V2));_V2=_v2['DeliveredReplay'];_audit=_v2['_original'];_Base=_audit['DeliveredReplay']
def constraints(o):return[{'name':c.name,'type':c.type,'mute':bool(c.mute),'influence':float(c.influence),'targetPointer':pointer(getattr(c,'target',None))}for c in o.constraints]
def channels(g,o,layer):
    r=_v2['serial'](_v2['transform'](o),lambda q:g['CREATED_NAME'].get(q,q.name));r.pop('matrix_world')
    r.update(hide_render=bool(o.hide_render),hide_viewport=bool(o.hide_viewport),
        layerHidden=bool(o.hide_get(view_layer=layer))if o.name in layer.objects else None,constraints=constraints(o),
        dataPointer=pointer(o.data),materialPointers=[pointer(s.material)for s in o.material_slots],
        shapeValues=[float(k.value)for k in o.data.shape_keys.key_blocks]if o.type=='MESH'and o.data.shape_keys else [],font=o.data.body if o.type=='FONT'else None)
    return r
def update(g,objects):
    for o in objects:o.update_tag()
    g['bpy'].context.view_layer.update();g['bpy'].context.evaluated_depsgraph_get().update();g['bpy'].context.view_layer.update()

def normalize(g,phase):
    """Owned flags only; all authoritative channels/flags must return EXACT."""
    bpy=g['bpy'];scene=g['d'].SC;assert pointer(bpy.context.window.scene)==pointer(scene)and g['_VIS_QUEUE']is None
    layer=bpy.context.window.view_layer;objects=list(scene.objects);frame=(scene.frame_current,scene.frame_subframe)
    before={o:channels(g,o,layer)for o in objects};raw_before={o:flat(o.matrix_world)for o in objects}
    flags={o:(o.hide_render,o.hide_viewport,o.hide_get(view_layer=layer)if o.name in layer.objects else None)for o in objects};failure=None
    try:
        for o,(hr,hv,local)in flags.items():
            if hr:o.hide_render=False
            if hv:o.hide_viewport=False
            if local is True:o.hide_set(False,view_layer=layer)
        update(g,objects)
    except BaseException as e:failure=e
    finally:
        for o,(hr,hv,local)in flags.items():
            if o.hide_render!=hr:o.hide_render=hr
            if o.hide_viewport!=hv:o.hide_viewport=hv
            if local is not None and o.hide_get(view_layer=layer)!=local:o.hide_set(local,view_layer=layer)
        update(g,objects)
    after={o:channels(g,o,layer)for o in objects};offenders=[{'name':g['CREATED_NAME'].get(o,o.name),'before':before[o],'after':after[o]}for o in objects if before[o]!=after[o]]
    dg=bpy.context.evaluated_depsgraph_get();evaluated=[];derived=[]
    for o in objects:
        world=flat(o.matrix_world);ev=flat(o.evaluated_get(dg).matrix_world);difference=delta(world,ev)
        evaluated.append({'name':g['CREATED_NAME'].get(o,o.name),'actualWorldSha256':jsha(world),'evaluatedWorldSha256':jsha(ev),
            'actualVersusEvaluatedMaximumDifference':difference,'exactZero':difference==0.,'derivedCacheChanged':world!=raw_before[o]})
        active=[c for c in constraints(o)if not c['mute']and c['influence']!=0]
        if not active and(o.parent is None or o.parent_type=='OBJECT'):
            expected=o.matrix_basis if o.parent is None else o.parent.matrix_world@o.matrix_parent_inverse@o.matrix_basis
            residual=delta(world,flat(expected))
            if residual>TOLERANCE:derived.append({'name':g['CREATED_NAME'].get(o,o.name),'actualWorld':world,'parentInverseBasisWorld':flat(expected),'maximumDifference':residual,
                'activeConstraints':active,'diagnosticOnlyNotSavedWorldRestorationComparison':True})
    checks={'allInputChannelsConstraintsFlagsAndGeometryPointersUnchanged':not offenders,
        'allActualWorldEqualsEvaluatedWorldExactly':all(r['exactZero']for r in evaluated),
        'sceneFrameAndSubframeUnchanged':frame==(scene.frame_current,scene.frame_subframe),'normalEvaluationCompletedWithoutException':failure is None}
    report={'phase':phase,'helperSha256':sha(__file__),'objectCount':len(objects),'beforeInputChannelsSha256':jsha({o.name:before[o]for o in objects}),
        'afterInputChannelsSha256':jsha({o.name:after[o]for o in objects}),'inputOffenders':offenders,
        'actualVersusEvaluatedWorld':evaluated,'parentEquationResidualsRetained':derived,
        'parentEquationFloatRoundoffNotUsedAsRestorationTolerance':True,'originalSavedVersusRestoredWorldToleranceUnchanged':TOLERANCE,
        'onlyOwnedVisibilityTemporarilyAssigned':True,'worldBasisTransformConstraintAssignmentsAdded':0,
        'protectionChecks':checks,'pass':all(v is True for v in checks.values()),'error':error_info(failure),'renders':0,'finalAcceptance':False}
    path=OUT/'normalizations'/('%s-%d.json'%(phase,time.time_ns()));write(path,report)
    summary={'path':str(path),'sha256':sha(path),'phase':phase,'objectCount':len(objects),'pass':report['pass'],
        'changedDerivedCacheObjects':sum(r['derivedCacheChanged']for r in evaluated),'parentEquationResidualCount':len(derived),'protectionChecks':checks}
    assert report['pass'],{'normalization':summary,'error':error_info(failure)}
    return summary

class DeliveredReplay(_V2):
    """Same public replay API; direct original10 close, no nested close wrappers."""
    def __init__(self,ns,cache=FINAL):
        self.normalizations=[];self.previous_layer=ns['main'].__globals__['bpy'].context.window.view_layer
        super().__init__(ns,cache);self.protected.update(PINS);self.protected[str(Path(__file__).resolve())]=sha(__file__)
    def snapshot_entry(self):
        self.normalizations.append(normalize(self.g,'before-entry-snapshot'))
        super().snapshot_entry();self.entry_layer=self.bpy.context.window.view_layer
        self.entry_layer_hidden={o:o.hide_get(view_layer=self.entry_layer)if o.name in self.entry_layer.objects else None for o in self.objects}
    def visibility_offenders(self):
        return[{'name':self.name(o),'entry':[s[3],s[4],self.entry_layer_hidden[o]],'actual':[o.hide_render,o.hide_viewport,o.hide_get(view_layer=self.entry_layer)if o.name in self.entry_layer.objects else None]}
            for o,s in self.entry.items()if(o.hide_render,o.hide_viewport,o.hide_get(view_layer=self.entry_layer)if o.name in self.entry_layer.objects else None)!=(s[3],s[4],self.entry_layer_hidden[o])]
    def restore_full_transforms(self):
        self.bpy.context.window.scene=self.scene;self.bpy.context.window.view_layer=self.entry_layer;assert self.g['_VIS_QUEUE']is None
        for o,s in self.entry.items():
            if o.hide_render!=s[3]:o.hide_render=s[3]
            if o.hide_viewport!=s[4]:o.hide_viewport=s[4]
            local=self.entry_layer_hidden[o]
            if local is not None and o.hide_get(view_layer=self.entry_layer)!=local:o.hide_set(local,view_layer=self.entry_layer)
        _V2.restore_full_transforms(self) # Exact retained full component/update implementation.
        self.normalizations.append(normalize(self.g,'after-full-component-restoration'))
        assert not self.visibility_offenders(),'Exact entry flags not restored'
        return self.offenders() # Original1e-9, actual saved world versus actual restored world.
    def close(self):
        if self.closed:return
        checks={};failure=None;restore_error=None;before=[]
        try:before=self.restore_full_transforms()
        except BaseException as e:restore_error=e
        try:checks.update(_Base.close(self)) # Original7e exact10 guards; no150a exception swallowing.
        except BaseException as e:
            failure=e
            if e.args and isinstance(e.args[0],dict):checks.update(e.args[0])
        previous=self.bpy.context.window.scene;layer=self.bpy.context.window.view_layer
        try:
            self.bpy.context.window.scene=self.scene;self.bpy.context.view_layer.update();after=self.offenders();visible=self.visibility_offenders()
        finally:
            self.bpy.context.window.scene=self.previous;self.bpy.context.window.view_layer=self.previous_layer;self.bpy.context.view_layer.update()
        checks['requiredOriginal10GuardsPresentAndTrue']=all(checks.get(k)is True for k in ORIGINAL_GUARDS)
        checks['originalCloseHadNoException']=failure is None
        checks['fullComponentRestorationHadNoException']=restore_error is None
        checks['fullTransformRepresentationRestored']=not after and not before
        checks['allEntryVisibilityFlagsAndLayerHideRestored']=not visible
        checks['cameraFunctionNamespacesUseOwnedEpisodeObjects']=all(v['sameObject']for f in self.namespace_evidence().values()for v in f.values())
        checks['allRecordedNormalizationsPassed']=bool(self.normalizations)and all(r['pass']for r in self.normalizations)
        checks['entryContextSceneAndLayerRNAPointersRestored']=pointer(self.bpy.context.window.scene)==pointer(self.previous)and pointer(self.bpy.context.window.view_layer)==pointer(self.previous_layer)
        report={'helperSha256':sha(__file__),'originalAuditSha256':AUDIT_SHA,'retainedFullComponentHelperSha256':V2_SHA,
            'toleranceUnchanged':TOLERANCE,'requiredOriginalGuardNames':list(ORIGINAL_GUARDS),'missingOriginalGuardNames':[k for k in ORIGINAL_GUARDS if k not in checks],
            'normalizations':self.normalizations,'afterOriginalCloseOffenders':after,'afterCloseVisibilityOffenders':visible,
            'namespaceBindings':self.namespace_evidence(),'originalCloseError':error_info(failure),'fullComponentRestorationError':error_info(restore_error),
            'protectionChecks':checks,'allPass':bool(checks)and all(v is True for v in checks.values()),
            'noWorldOrBasisMatrixAssignment':True,'renders':0,'automaticApproval':False,'finalAcceptance':False}
        path=OUT/'transform-restoration'/('close-%d.json'%time.time_ns());write(path,report)
        self.transformRestorationDiagnostics=report;self.transformRestorationReport={'path':str(path),'sha256':sha(path)}
        assert report['allPass'],{'protectionChecks':checks,'transformDiagnostics':self.transformRestorationReport,'originalCloseError':error_info(failure)}
        return checks

def diagnostic(ns,authorized=False,out=None):
    """One root zero-render job: catalog13 first, then all six setups once."""
    assert authorized is True;verify();dest=Path(out or OUT/'diagnostic/report.json');assert not dest.exists()
    report={'mode':'zero-render-owned-hidden-cache-recovery','helperSha256':sha(__file__),'originalAuditSha256':AUDIT_SHA,
        'retainedFullComponentHelperSha256':V2_SHA,'failed117':str(FAILED),'failed117Sha256':FAILED_SHA,
        'failed117Child':str(FAILED_CHILD),'failed117ChildSha256':FAILED_CHILD_SHA,'scenarioOrder':list(SCENARIOS),
        'scenarios':[],'toleranceUnchanged':TOLERANCE,'renders':0,'automaticApproval':False,'finalAcceptance':False}
    ctx=None;started=time.time()
    try:
        ctx=DeliveredReplay(ns);ctx.open();image=runpy.run_path(str(IMAGES))
        for label in SCENARIOS:
            assert not ctx.restore_full_transforms(),'Scenario precondition full restoration failed'
            if label=='exact-delivered7917':
                ctx.replay(ctx.rows[7917])
                for f in ctx.families:
                    if not f['pier'].hide_render:ctx.repair(f)
            elif label.startswith('problem-'):image['setup_extra'](ctx,_audit,label.split('-')[1])
            elif label.startswith('engine-catalog-'):
                image['setup_extra'](ctx,_audit,'engine');ctx.d.catalog_camera((-.20,.10,.38),label.endswith('-top'),.32);ctx.bpy.context.view_layer.update()
            offenders=ctx.restore_full_transforms();visibility=ctx.visibility_offenders()
            row={'scenario':label,'newFullRestorePass':not offenders and not visibility,'offenderCount':len(offenders),
                'visibilityOffenderCount':len(visibility),'normalization':ctx.normalizations[-1],'namespaceBindings':ctx.namespace_evidence()}
            if offenders or visibility:
                path=OUT/'scenario-failures'/(label+'.json');write(path,{'transformOffenders':offenders,'visibilityOffenders':visibility});row.update(failureEvidence=str(path),failureEvidenceSha256=sha(path))
            report['scenarios'].append(row);assert row['newFullRestorePass'],('Scenario strict restoration failed',label,row.get('failureEvidence'))
        report['allScenarioFullRestorationsPass']=len(report['scenarios'])==6 and all(r['newFullRestorePass']for r in report['scenarios'])
    except BaseException as e:report['error']=error_info(e);raise
    finally:
        if ctx is not None:
            try:report['protectionChecks']=ctx.close()
            except BaseException as e:report['cleanupError']=error_info(e)
            report['transformRestorationReport']=ctx.transformRestorationReport;report['normalizations']=ctx.normalizations
        report.update(seconds=round(time.time()-started,3),allPinnedSourcesAndFailed117EvidenceUnchanged=all(sha(p)==h for p,h in PINS.items()))
        write(dest,report)
        assert not report.get('error')and not report.get('cleanupError')and report.get('protectionChecks')and all(v is True for v in report['protectionChecks'].values())and report['allPinnedSourcesAndFailed117EvidenceUnchanged'],{'report':str(dest),'reportSha256':sha(dest),'error':report.get('error'),'cleanupError':report.get('cleanupError')}
    return report
