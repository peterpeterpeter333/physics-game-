"""Strict private replay v3: restore saved visibility before unchanged v2 transforms.

Actual105 showed ten outwater objects with identical transform channels/basis
but stale world matrices. Original close (which also restores visibility) passed.
This adds only exact saved hide_render/hide_viewport restoration; no temporary
all-visible state, matrix_world/basis assignment, tolerance change or rendering.
The failed150a diagnostic and all original source/media remain pinned/preserved.
Import defines wrappers only; root alone calls diagnostic/opens the namespace.
"""
import hashlib
import json
from pathlib import Path
import runpy
import time

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
V2=W/'scripts/blender/desk_axes_d1_pier_contact_replay_v2_20261025.py'
V2_SHA='150a4bca4f8bd0f6c42077afb7b27d6d99f76aac6f1004a56a5b0be43441796c'
ORIGINAL=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
ORIGINAL_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
IMAGES_SHA='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
FAILED=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025/diagnostic/report.json')
FAILED_SHA='74adf3d47abb4ca451fea2237f66ac77244627dee6f08481dcef92333827dc31'
FAILED_CHILD=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025/transform-restoration/close-1792905276548854000.json')
FAILED_CHILD_SHA='c9fcde594d63c0ccc1220a3ec68a4aa15b0ee2baa5c093be376b08ba7b77a130'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v3-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
TOLERANCE=1e-9
PINS={str(V2):V2_SHA,str(ORIGINAL):ORIGINAL_SHA,str(IMAGES):IMAGES_SHA,str(FAILED):FAILED_SHA,str(FAILED_CHILD):FAILED_CHILD_SHA}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def verify():
    for p,h in PINS.items():assert sha(p)==h,p
def write(p,x):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(OUT)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists())
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)

verify()
_v2=runpy.run_path(str(V2)) # Definitions only; no namespace/render operation.
_V2=_v2['DeliveredReplay']

class DeliveredReplay(_V2):
    """Compatible open/replay/repair/tools/rows/close API; two exact extra setters."""
    def __init__(self,ns,cache=FINAL):
        self.visibilityRestorationStages=[]
        super().__init__(ns,cache)
        self.protected.update(PINS)
        self.protected[str(Path(__file__).resolve())]=sha(__file__)

    def visibility_offenders(self):
        result=[]
        for ob,saved in self.entry.items():
            expected=[bool(saved[3]),bool(saved[4])];actual=[bool(ob.hide_render),bool(ob.hide_viewport)]
            if actual!=expected:
                result.append({'creationName':self.name(ob),'objectName':ob.name,
                    'entryHideRender':expected[0],'actualHideRender':actual[0],
                    'entryHideViewport':expected[1],'actualHideViewport':actual[1]})
        return result

    def state_probe(self):
        return {'entryObjectCount':len(self.objects),'transformOffenders':self.offenders(),
            'visibilityOffenders':self.visibility_offenders(),'visibilityQueueClosed':self.g['_VIS_QUEUE']is None,
            'namespaceBindings':self.namespace_evidence(),
            'checksCoverAllSavedEntryObjects':True,'matrixToleranceUnchanged':TOLERANCE,
            'materialsShapesAndTextAreStillGuardedByOriginalClose':True}

    def restore_full_transforms(self):
        assert self.g['_VIS_QUEUE']is None,'Do not close or bypass an active visibility transaction'
        self.bpy.context.window.scene=self.scene
        before=self.visibility_offenders()
        # Exact saved values only. Never force hidden entry objects visible.
        for ob,saved in self.entry.items():
            if ob.hide_render!=saved[3]:ob.hide_render=saved[3]
            if ob.hide_viewport!=saved[4]:ob.hide_viewport=saved[4]
        # The exact original v2 function still restores every transform channel
        # and calls view_layer.update(). World/basis remain derived, never set.
        result=_V2.restore_full_transforms(self)
        after=self.visibility_offenders()
        self.visibilityRestorationStages.append({'beforeVisibilityVersusSavedEntry':before,
            'afterVisibilityVersusSavedEntry':after,'afterUnchangedV2TransformRestoreOffenders':result,
            'onlySetSavedHideRenderAndHideViewport':True,'originalV2TransformFunctionReused':True,
            'matrixToleranceUnchanged':TOLERANCE})
        assert not after,'Saved entry visibility was not restored exactly'
        return result

    def close(self):
        if self.closed:return
        before=self.state_probe();checks={};failure=None;v2_evidence=None;v2_report=None
        try:checks.update(super().close())
        except BaseException as error:
            failure=error
            if error.args and isinstance(error.args[0],dict):checks.update(error.args[0].get('protectionChecks',{}))
        v2_evidence=self.transformRestorationReport
        if v2_evidence is not None:
            assert sha(v2_evidence['path'])==v2_evidence['sha256'];v2_report=read(v2_evidence['path'])
        previous=self.bpy.context.window.scene
        try:
            self.bpy.context.window.scene=self.scene;self.bpy.context.view_layer.update();after=self.state_probe()
        finally:self.bpy.context.window.scene=previous
        checks['allEntryVisibilityFlagsRestored']=not after['visibilityOffenders']
        checks['retainedV2StrictCloseAllGuardsPassed']=bool(v2_report)and v2_report['helperSha256']==V2_SHA and v2_report['toleranceUnchanged']==TOLERANCE and v2_report['allPass']and all(v is True for v in v2_report['protectionChecks'].values())
        report={'helperSha256':sha(__file__),'retainedV2HelperSha256':V2_SHA,'originalAuditSha256':ORIGINAL_SHA,
            'toleranceUnchanged':TOLERANCE,'namespaceBindings':after['namespaceBindings'],
            'beforeRestorationOffenders':before['transformOffenders'],
            'afterOriginalCloseOffenders':after['transformOffenders'],
            'beforeVisibilityVersusSavedEntry':before['visibilityOffenders'],
            'afterVisibilityVersusSavedEntry':after['visibilityOffenders'],
            'visibilityRestorationStages':self.visibilityRestorationStages,
            'beforeCloseStateProbe':before,'afterCloseStateProbe':after,
            'retainedV2CloseEvidence':v2_evidence,'retainedV2CloseFullReport':v2_report,
            'noWorldOrBasisMatrixAssignment':True,'onlyAdditionalRestoredChannels':['hide_render','hide_viewport'],
            'protectionChecks':checks,'allPass':failure is None and bool(checks)and all(v is True for v in checks.values()),
            'renders':0,'automaticApproval':False,'finalAcceptance':False,
            'retainedCloseError':None if failure is None else {'type':type(failure).__name__,'message':str(failure)}}
        path=OUT/'transform-restoration'/('close-%d.json'%time.time_ns());write(path,report)
        self.transformRestorationDiagnostics=report;self.transformRestorationReport={'path':str(path),'sha256':sha(path)}
        assert report['allPass'],{'protectionChecks':checks,'transformDiagnostics':self.transformRestorationReport,
            'allOffenders':after['transformOffenders'],'retainedCloseError':report['retainedCloseError']}
        return checks

def diagnostic(ns,authorized=False,out=None):
    """Root queue only, zero pixels: same six actual source/setup scenarios."""
    assert authorized is True;verify()
    dest=Path(out or OUT/'diagnostic/report.json');assert dest.is_relative_to(OUT)and not dest.exists()
    failed=read(FAILED);child=read(FAILED_CHILD)
    assert failed['helperSha256']==V2_SHA and failed['scenarios']==[]and failed['error']['message']=='Full precondition restoration failed'
    assert child['allPass']and not child['afterOriginalCloseOffenders']
    report={'mode':'zero-render-transform-and-entry-visibility-diagnostic','helperSha256':sha(__file__),
        'retainedV2HelperSha256':V2_SHA,'originalAuditSha256':ORIGINAL_SHA,'originalImagesSha256':IMAGES_SHA,
        'failedActual105':str(FAILED),'failedActual105Sha256':FAILED_SHA,'failedActual105Child':str(FAILED_CHILD),'failedActual105ChildSha256':FAILED_CHILD_SHA,
        'failed105BeforeOffenders':child['beforeRestorationOffenders'],'failed105AfterV2OnlyOffenders':child['afterFullComponentRestoreBeforeOriginalClose'],
        'failed105AfterOriginalCloseOffenders':child['afterOriginalCloseOffenders'],
        'onlyNewRestoredChannels':['hide_render','hide_viewport'],'causeRequiresActualStageEvidence':True,
        'renders':0,'scenarios':[],'toleranceUnchanged':TOLERANCE,'automaticApproval':False,'finalAcceptance':False}
    ctx=None;started=time.time()
    try:
        ctx=DeliveredReplay(ns);ctx.open();image=runpy.run_path(str(IMAGES))
        report['afterOpenBeforeAnyRestoration']=ctx.state_probe()
        old=_V2.restore_full_transforms(ctx)
        report['afterOriginalV2TransformOnlyPrecondition']={'offenders':old,'stateProbe':ctx.state_probe()}
        full=ctx.restore_full_transforms();report['afterNewEntryVisibilityAndV2TransformPrecondition']=ctx.state_probe()
        assert not full and not ctx.visibility_offenders(),'New exact entry-visibility precondition not proven'
        for label in['no-operation','exact-delivered7917','problem-challenge','problem-answer','engine-catalog-oblique','engine-catalog-top']:
            assert not ctx.restore_full_transforms();before=ctx.state_probe()
            assert not before['transformOffenders']and not before['visibilityOffenders']and before['visibilityQueueClosed']
            if label=='exact-delivered7917':
                ctx.replay(ctx.rows[7917])
                for family in ctx.families:
                    if not family['pier'].hide_render:ctx.repair(family)
            elif label.startswith('problem-'):image['setup_extra'](ctx,_v2['_original'],label.split('-')[1])
            elif label.startswith('engine-catalog-'):
                image['setup_extra'](ctx,_v2['_original'],'engine');ctx.d.catalog_camera((-.20,.10,.38),label.endswith('-top'),.32);ctx.bpy.context.view_layer.update()
            operation=ctx.state_probe();old=_V2.restore_full_transforms(ctx);old_probe=ctx.state_probe()
            full=ctx.restore_full_transforms();after=ctx.state_probe()
            row={'scenario':label,'beforeScenarioStateProbe':before,'afterScenarioBeforeRestoration':operation,
                'oldV2TransformOnlyRestoreOffenders':old,'oldV2TransformOnlyStateProbe':old_probe,
                'newFullRestoreOffenders':full,'newFullRestorePass':not full and not after['visibilityOffenders'],
                'afterNewCompleteStateProbe':after,'namespaceBindings':ctx.namespace_evidence()}
            report['scenarios'].append(row);assert row['newFullRestorePass'],('Exact restoration not proven',label)
        report['allScenarioFullRestorationsPass']=len(report['scenarios'])==6 and all(r['newFullRestorePass']for r in report['scenarios'])
    except BaseException as error:
        report['error']={'type':type(error).__name__,'message':str(error)};raise
    finally:
        if ctx is not None:
            try:report['protectionChecks']=ctx.close()
            except BaseException as error:report['cleanupError']={'type':type(error).__name__,'message':str(error)}
            report['transformRestorationReport']=ctx.transformRestorationReport
        report['allPinnedSourcesAndFailed105EvidenceUnchanged']=all(sha(p)==h for p,h in PINS.items())
        report['seconds']=round(time.time()-started,3);write(dest,report)
        assert not report.get('error')and not report.get('cleanupError')and report.get('protectionChecks')and all(v is True for v in report['protectionChecks'].values())and report['allPinnedSourcesAndFailed105EvidenceUnchanged'],report
    return report
