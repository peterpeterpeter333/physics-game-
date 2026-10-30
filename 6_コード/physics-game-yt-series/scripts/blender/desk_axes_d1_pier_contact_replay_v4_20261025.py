"""Root-only v4: diagnose/refresh derived dependency caches before entry capture.

No world/basis/channel/visibility assignment is used for cache preparation.
Only Object.update_tag(), depsgraph.update(), and view_layer.update() are used.
Snapshot is allowed only after strict real parent/basis/world/evaluated-world
coherency for the three affected piers and their parents. Actual failed105/112
remain immutable evidence. The original1e-9 restoration comparison is retained.
The retained150a close must also contain every original10 guard and no exception.
Import is definitions/read-only pins only. Root queues both diagnostic APIs.
"""
import hashlib
import json
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
V3=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v3_20261025.py'
V3_SHA='c2affda7bb6287c50d99f7badfb2bbf936acbe725fb74de6b94410557f440e2a'
FAILED=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v3-20261025/diagnostic/report.json')
FAILED_SHA='10ef759e1cd6693a1f4b71a5f85a56a954e7424ba8678ca91cb41751da03ed58'
FAILED_CHILD=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v3-20261025/transform-restoration/close-1792905631726392000.json')
FAILED_CHILD_SHA='7a601954668e039232055bff8d65cd207f0726ecacaf54aa8dcd460abd9e68b7'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v4-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
TOLERANCE=1e-9
ORIGINAL_GUARDS=('allEntryObjectTransformsRestored','noNewGeometryRemains','runtimeBindingsUnchanged',
 'runtimeDataUnchanged','allEntryMaterialAndHighlightInputsRestored','sourcesAndProtectedInputsUnchanged',
 'allDeliveredRawShaAndStatsUnchanged','allOtherExistingSceneOutputsUnchanged','allSceneFilepathsRestored','visibilityQueueClosed')
PIERS={'d1_engine_pier','d1_fuji_base_pier','d1_fuji_top_pier'}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def flat(m):return[float(v)for row in m for v in row]
def delta(a,b):return max((abs(x-y)for x,y in zip(a,b)),default=0.)
def write(p,x):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(OUT)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists());p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)

assert sha(V3)==V3_SHA
_v3=runpy.run_path(str(V3)) # No episode namespace is opened.
_V3=_v3['DeliveredReplay'];_v2=_v3['_v2'];_audit=_v2['_original']
PINS={**_v3['PINS'],str(V3):V3_SHA,str(FAILED):FAILED_SHA,str(FAILED_CHILD):FAILED_CHILD_SHA}
def verify():
    for p,h in PINS.items():assert sha(p)==h,p

def name(g,o):return g['CREATED_NAME'].get(o,o.name)
def constraints(o):
    return[{'name':c.name,'type':c.type,'mute':bool(c.mute),'influence':float(c.influence),
        'target':getattr(c,'target',None).name if getattr(c,'target',None)is not None else None}for c in o.constraints]
def channels(g,o):
    r=_v2['serial'](_v2['transform'](o),lambda q:name(g,q));r.pop('matrix_world')
    r.update(hide_render=bool(o.hide_render),hide_viewport=bool(o.hide_viewport),view_layer_hide_get=bool(o.hide_get()),
        constraints=constraints(o),dataPointer=o.data.as_pointer()if o.data else None,
        materialPointers=[s.material.as_pointer()if s.material else None for s in o.material_slots],
        shapeValues=[float(k.value)for k in o.data.shape_keys.key_blocks]if o.type=='MESH'and o.data.shape_keys else [],
        fontBody=o.data.body if o.type=='FONT'else None)
    return r
def owned_objects(g):return list(g['d'].SC.objects)
def selected_targets(g):
    found={name(g,o):o for o in owned_objects(g)if name(g,o)in PIERS};assert set(found)==PIERS
    result=set(found.values())
    for o in list(result):
        parent=o.parent
        while parent is not None:result.add(parent);parent=parent.parent
    return sorted(result,key=lambda o:name(g,o))

def coherence_probe(g,targets):
    bpy=g['bpy'];dg=bpy.context.evaluated_depsgraph_get();rows=[]
    for o in targets:
        evaluated=o.evaluated_get(dg);basis=o.matrix_basis.copy();world=o.matrix_world.copy();evworld=evaluated.matrix_world.copy()
        active=[c for c in constraints(o)if not c['mute']and c['influence']!=0]
        simple=(o.parent is None or o.parent_type=='OBJECT')and not active
        if o.parent is None:expected=basis;expected_eval_parent=basis;parent_world=None;parent_eval_world=None
        else:
            parent_world=o.parent.matrix_world.copy();parent_eval_world=o.parent.evaluated_get(dg).matrix_world.copy()
            expected=parent_world@o.matrix_parent_inverse@basis
            expected_eval_parent=parent_eval_world@o.matrix_parent_inverse@basis
        a,b,c,d=map(flat,[world,evworld,expected,expected_eval_parent])
        errors={'worldVersusParentInverseBasis':delta(a,c),'evaluatedWorldVersusParentInverseBasis':delta(b,d),
            'worldVersusEvaluatedWorld':delta(a,b),'parentWorldVersusEvaluatedParentWorld':0. if parent_world is None else delta(flat(parent_world),flat(parent_eval_world))}
        rows.append({'creationName':name(g,o),'objectName':o.name,'isPier':name(g,o)in PIERS,
            'channels':channels(g,o),'parentName':name(g,o.parent)if o.parent else None,
            'parentType':o.parent_type,'parentWorld':flat(parent_world)if parent_world is not None else None,
            'evaluatedParentWorld':flat(parent_eval_world)if parent_eval_world is not None else None,
            'matrixParentInverse':flat(o.matrix_parent_inverse),'matrixBasis':flat(basis),'matrixWorld':a,
            'evaluatedMatrixWorld':b,'parentWorldTimesInverseTimesBasis':c,'evaluatedParentTimesInverseTimesBasis':d,
            'evaluatedPointer':evaluated.as_pointer(),'originalPointer':o.as_pointer(),
            'evaluatedIsEvaluated':bool(evaluated.is_evaluated),'activeConstraints':active,
            'simpleObjectParentEquationApplicable':simple,'deltas':errors,
            'coherentWithinOriginal1eMinus9':simple and all(v<=TOLERANCE for v in errors.values())})
    return {'objects':rows,'depsgraphMode':dg.mode,'sceneName':bpy.context.window.scene.name,
        'viewLayerName':bpy.context.view_layer.name,'sceneFrame':bpy.context.window.scene.frame_current,
        'allRequiredThreePiersPresent':len([r for r in rows if r['isPier']])==3,
        'allRequiredPiersAndParentsCoherent':bool(rows)and all(r['coherentWithinOriginal1eMinus9']for r in rows),
        'toleranceUnchanged':TOLERANCE,'noWorldOrBasisAssignments':True}

def refresh_before_snapshot(g):
    """Normal evaluation only; model/visibility/constraints must be byte-equal."""
    bpy=g['bpy'];d=g['d'];assert bpy.context.window.scene is d.SC and g['_VIS_QUEUE']is None
    objects=owned_objects(g);targets=selected_targets(g);before={o:channels(g,o)for o in objects}
    stages=[{'stage':'entry-before-refresh','probe':coherence_probe(g,targets)}]
    dg=bpy.context.evaluated_depsgraph_get();dg.update();bpy.context.view_layer.update()
    stages.append({'stage':'normal-depsgraph-and-view-layer-update','probe':coherence_probe(g,targets)})
    for o in objects:o.update_tag() # Invalidate derived evaluation, not a transform setter.
    dg=bpy.context.evaluated_depsgraph_get();dg.update();bpy.context.view_layer.update()
    stages.append({'stage':'owned-object-update-tag-and-normal-update','probe':coherence_probe(g,targets)})
    offenders=[{'creationName':name(g,o),'before':before[o],'after':channels(g,o)}for o in objects if channels(g,o)!=before[o]]
    report={'stages':stages,'allSavedChannelsVisibilityConstraintsAndGeometryPointersUnchanged':not offenders,
        'channelOffenders':offenders,'entryObjectCount':len(objects),
        'normalDependencyUpdatesOnly':True,'worldOrBasisAssigned':False,'temporaryVisibilityChanges':False,
        'allRequiredPiersAndParentsCoherentBeforeSnapshot':stages[-1]['probe']['allRequiredPiersAndParentsCoherent'],
        'toleranceUnchanged':TOLERANCE}
    return report

class DeliveredReplay(_V3):
    def __init__(self,ns,cache=FINAL):
        self.entryCoherencyReport=None
        self.postRestoreDependencyRefreshStages=[]
        super().__init__(ns,cache);self.protected.update(PINS);self.protected[str(Path(__file__).resolve())]=sha(__file__)

    def snapshot_entry(self):
        self.entryCoherencyReport=refresh_before_snapshot(self.g)
        assert self.entryCoherencyReport['allSavedChannelsVisibilityConstraintsAndGeometryPointersUnchanged'],'Normal evaluation changed an input channel'
        assert self.entryCoherencyReport['allRequiredPiersAndParentsCoherentBeforeSnapshot'],'Entry dependency matrices remain incoherent; do not capture a false baseline'
        # Snapshot only newly evaluated actual Blender state; never assign a
        # world matrix or replace an already saved entry after operations.
        super().snapshot_entry()

    def restore_full_transforms(self):
        old=super().restore_full_transforms()
        refresh=refresh_before_snapshot(self.g)
        after=self.offenders()
        self.postRestoreDependencyRefreshStages.append({'beforeNormalRefreshOffenders':old,
            'normalDependencyRefresh':refresh,'afterNormalRefreshVersusSavedCoherentEntryOffenders':after})
        assert refresh['allSavedChannelsVisibilityConstraintsAndGeometryPointersUnchanged'],'Normal restoration evaluation changed an input channel'
        assert refresh['allRequiredPiersAndParentsCoherentBeforeSnapshot'],'Restored dependency matrices remain incoherent'
        return after

    def close(self):
        if self.closed:return
        checks={};failure=None
        try:checks.update(super().close())
        except BaseException as error:
            failure=error
            if error.args and isinstance(error.args[0],dict):checks.update(error.args[0].get('protectionChecks',{}))
        retained=self.transformRestorationReport;r3=None;r2=None
        if retained is not None:
            assert sha(retained['path'])==retained['sha256'];r3=read(retained['path']);r2=r3.get('retainedV2CloseFullReport')
        original_checks=r2.get('protectionChecks',{})if isinstance(r2,dict)else {}
        checks['requiredOriginal10GuardsPresentAndTrue']=all(original_checks.get(k)is True for k in ORIGINAL_GUARDS)
        checks['retainedOriginalCloseHadNoException']=bool(r2)and 'originalCloseError'not in r2 and 'fullComponentRestorationError'not in r2 and bool(r3)and r3.get('retainedCloseError')is None
        checks['entryCoherencyVerifiedBeforeSnapshot']=bool(self.entryCoherencyReport)and self.entryCoherencyReport['allSavedChannelsVisibilityConstraintsAndGeometryPointersUnchanged']and self.entryCoherencyReport['allRequiredPiersAndParentsCoherentBeforeSnapshot']
        report={'helperSha256':sha(__file__),'retainedV3HelperSha256':V3_SHA,'retainedV2HelperSha256':_v3['V2_SHA'],
            'originalAuditSha256':_v3['ORIGINAL_SHA'],'toleranceUnchanged':TOLERANCE,
            'entryCoherencyReport':self.entryCoherencyReport,'postRestoreDependencyRefreshStages':self.postRestoreDependencyRefreshStages,
            'retainedV3CloseEvidence':retained,'retainedV3CloseFullReport':r3,
            'requiredOriginalGuardNames':list(ORIGINAL_GUARDS),'missingOriginalGuardNames':[k for k in ORIGINAL_GUARDS if k not in original_checks],
            'namespaceBindings':r3.get('namespaceBindings',{})if r3 else {},
            'afterOriginalCloseOffenders':r3.get('afterOriginalCloseOffenders',[])if r3 else [],
            'protectionChecks':checks,'allPass':failure is None and bool(checks)and all(v is True for v in checks.values()),
            'worldOrBasisAssigned':False,'renders':0,'automaticApproval':False,'finalAcceptance':False,
            'retainedCloseError':None if failure is None else {'type':type(failure).__name__,'message':str(failure)[:400]}}
        dest=OUT/'transform-restoration'/('close-%d.json'%time.time_ns());write(dest,report)
        self.transformRestorationDiagnostics=report;self.transformRestorationReport={'path':str(dest),'sha256':sha(dest)}
        assert report['allPass'],{'protectionChecks':checks,'transformDiagnostics':self.transformRestorationReport,'retainedCloseError':report['retainedCloseError']}
        return checks

def coherency_diagnostic(ns,authorized=False,out=None):
    """First root job: no replay/setup/new geometry; observe normal cache updates."""
    assert authorized is True;verify();g=ns['main'].__globals__;bpy=g['bpy'];d=g['d']
    assert sha(g['__file__'])==_audit['PINS']['scripts/blender/desk_d1v1.py']
    previous=bpy.context.window.scene;old_layer=bpy.context.window.view_layer
    paths={s.name:s.render.filepath for s in bpy.data.scenes}
    media={p:sha(p)for p in paths.values()if p and Path(p).is_file()}
    bindings={k:g[k]for k in['main','apply','reset','pose_at','set_camera','plan_d1','SPANS','EVENTS','DATA']}
    data=json.dumps(g['DATA'],sort_keys=True);started=time.time();report={'mode':'zero-render-entry-coherency-diagnostic',
        'helperSha256':sha(__file__),'failedActual112':str(FAILED),'failedActual112Sha256':FAILED_SHA,
        'failedActual112Child':str(FAILED_CHILD),'failedActual112ChildSha256':FAILED_CHILD_SHA,
        'renders':0,'toleranceUnchanged':TOLERANCE,'automaticApproval':False,'finalAcceptance':False}
    try:
        bpy.context.window.scene=d.SC;bpy.context.view_layer.update()
        report['coherency']=refresh_before_snapshot(g)
        assert report['coherency']['allSavedChannelsVisibilityConstraintsAndGeometryPointersUnchanged']
        report['coherentForNewSnapshot']=report['coherency']['allRequiredPiersAndParentsCoherentBeforeSnapshot']
    except BaseException as error:
        report['error']={'type':type(error).__name__,'message':str(error)[:400]};raise
    finally:
        bpy.context.window.scene=previous;bpy.context.window.view_layer=old_layer;bpy.context.view_layer.update()
        checks={'runtimeBindingsUnchanged':all(g[k]is v for k,v in bindings.items()),
            'runtimeDataUnchanged':json.dumps(g['DATA'],sort_keys=True)==data,
            'allPinnedSourcesAndFailedEvidenceUnchanged':all(sha(p)==h for p,h in PINS.items()),
            'allOtherExistingSceneMediaUnchanged':all(sha(p)==h for p,h in media.items()),
            'allSceneFilepathsUnchanged':all(bpy.data.scenes[n].render.filepath==p for n,p in paths.items()),
            'entryWindowSceneAndLayerRestored':bpy.context.window.scene is previous and bpy.context.window.view_layer is old_layer,
            'visibilityQueueClosed':g['_VIS_QUEUE']is None}
        report.update(protectionChecks=checks,seconds=round(time.time()-started,3));write(Path(out or OUT/'coherency/report.json'),report)
        assert all(v is True for v in checks.values()),checks
    return report

def diagnostic(ns,authorized=False,out=None):
    """Second root job only after explicit successful read-only coherency proof."""
    assert authorized is True;verify()
    coherent=read(OUT/'coherency/report.json')
    assert coherent['helperSha256']==sha(__file__)and coherent['coherentForNewSnapshot']and not coherent.get('error')and all(v is True for v in coherent['protectionChecks'].values())
    old_globals=_v3['diagnostic'].__globals__;scope=dict(old_globals)
    for k,v in old_globals.items():
        if isinstance(v,types.FunctionType)and v.__globals__ is old_globals:
            fn=types.FunctionType(v.__code__,scope,v.__name__,v.__defaults__,v.__closure__);fn.__kwdefaults__=v.__kwdefaults__;scope[k]=fn
    scope.update(DeliveredReplay=DeliveredReplay,OUT=OUT,PINS=PINS,__file__=str(Path(__file__).resolve()))
    retained=OUT/'diagnostic/retained-v3-body-report.json'
    result=None;failure=None;started=time.time()
    try:
        result=scope['diagnostic'](ns,authorized=True,out=retained)
        assert result['allScenarioFullRestorationsPass']and len(result['scenarios'])==6
        return result
    except BaseException as error:failure=error;raise
    finally:
        r=read(retained)if retained.is_file()else {}
        report={**r,'helperSha256':sha(__file__),'retainedV3DiagnosticBodyCodeUnchanged':True,
            'retainedV3BodyReport':str(retained)if retained.is_file()else None,'retainedV3BodyReportSha256':sha(retained)if retained.is_file()else None,
            'actualCoherencyDiagnostic':str(OUT/'coherency/report.json'),'actualCoherencyDiagnosticSha256':sha(OUT/'coherency/report.json'),
            'failedActual112':str(FAILED),'failedActual112Sha256':FAILED_SHA,'failedActual112Child':str(FAILED_CHILD),'failedActual112ChildSha256':FAILED_CHILD_SHA,
            'allOriginal10CloseGuardsMandatory':True,'noOriginalCloseExceptionAllowed':True,
            'renders':0,'automaticApproval':False,'finalAcceptance':False,'seconds':round(time.time()-started,3)}
        if failure is not None:report['wrapperError']={'type':type(failure).__name__,'message':str(failure)[:400]}
        write(Path(out or OUT/'diagnostic/report.json'),report)
        assert failure is None and r.get('protectionChecks')and all(v is True for v in r['protectionChecks'].values())
