"""NEW transparent root-only B7 cache/RNA recovery; original files immutable.

The ea40 namespace/18-zero-difference-control machinery is retained in private
memory. Exactly declared geometry-source boundaries add normal evaluation before
snapshot/after restoration, RNA identity comparison and a fresh output root.
No geometry/time/quality/safe-area change and no original1e-9 before/after waiver.
Audit renders zero images and must pass before a separately authorized probe.
"""
import ast
import hashlib
import json
import os
from pathlib import Path
import runpy
import time

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
COMPAT=W/'scripts/blender/desk_axes_b1_b7_namespace_compat_20261025.py'
COMPAT_SHA='ea40e31506f9f0d0aee236f21639c7776f8b4786a274a187a740298a3e0a5e89'
DIAG_HELPER=W/'scripts/blender/desk_axes_b1_b7_cache_coherency_diagnostic_20261025.py'
DIAG_HELPER_SHA='169bcd5a0ee1c0e858d67423030b491dceb07dc9926bc47e45ef5c0416ed5d6d'
DIAG=W/'outputs/axes-20261023/b1-b7-cache-coherency-diagnostic-20261025.json'
DIAG_SHA='a006d93ca3a572a94694f580590315dcd0558a468a52a453658ff7f1e7c21a41'
RESIDUAL=W/'outputs/axes-20261023/b1-b7-116-derived-cache-residuals-independent-20261025.json'
RESIDUAL_SHA='b4485939bf192f04bdeeed0c0ab8550fbaf63030374944038507e55bd3d71eac'
ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-cache-recovery-20261025')
NEW_OUT=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-cache-recovered-20261025')
TOLERANCE=1e-9
RUNTIME_SHA='69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1'
EXTRA_PINS={COMPAT:COMPAT_SHA,DIAG_HELPER:DIAG_HELPER_SHA,DIAG:DIAG_SHA,RESIDUAL:RESIDUAL_SHA}
COMPAT_BOUNDARY=("ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-namespace-compat-20261025')", "ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-cache-recovery-20261025')")
GEOMETRY_BOUNDARIES=[
 ("OUT=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-20261025')",
  "OUT=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-cache-recovered-20261025')"),
 ("        self.objects=list(self.bpy.data.objects);self.transforms={o:transform(o)for o in self.objects}",
  "        _recovery.normalize(g,'before-actual-entry-snapshot')\n        self.objects=list(self.bpy.data.objects);self.transforms={o:transform(o)for o in self.objects}"),
 ("        self.bpy.context.view_layer.update()\n        self.bpy.context.window.scene=self.window_scene",
  "        _recovery.normalize(self.g,'after-channel-restoration-before-original-world-comparison')\n        self.bpy.context.view_layer.update()\n        self.bpy.context.window.scene=self.window_scene"),
 ("        checks['contextWindowSceneRestored']=self.bpy.context.window.scene is self.window_scene\n        checks['contextViewLayerRestored']=self.bpy.context.window.view_layer is self.window_view_layer",
  "        checks['contextWindowSceneRestored']=_recovery.same_scene(self.bpy.context.window.scene,self.window_scene)\n        checks['contextViewLayerRestored']=_recovery.same_layer(self.bpy.context.window.view_layer,self.window_view_layer,self.window_scene)"),
 ("        checks['contextRestoredEvenOnStrictFailure']=bpy.context.window.scene is old_window_scene and bpy.context.window.view_layer is old_view_layer",
  "        checks['contextRestoredEvenOnStrictFailure']=_recovery.same_scene(bpy.context.window.scene,old_window_scene)and _recovery.same_layer(bpy.context.window.view_layer,old_view_layer,old_window_scene)")]

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def pointer(o):return int(o.as_pointer())if o is not None else None
def verify():
    for p,h in EXTRA_PINS.items():assert sha(p)==h,p
def replace_exact(text,boundaries):
    original=text
    for before,after in boundaries:
        assert text.count(before)==1,('Declared boundary not unique',before)
        text=text.replace(before,after,1)
    inverse=text
    for before,after in reversed(boundaries):
        assert inverse.count(after)==1;inverse=inverse.replace(after,before,1)
    assert inverse==original,'Private derivative must invert byte-exactly'
    ast.parse(text)
    return text

class Recovery:
    def __init__(self,g):
        self.g=g;self.tools=runpy.run_path(str(DIAG_HELPER));self.original=runpy.run_path(str(self.tools['ORIGINAL']))
        self.history=[];self.context_comparisons=[]
        actual=read(DIAG);residual=read(RESIDUAL)
        assert all(v is True for v in actual['protectionChecks'].values())
        assert residual['inputSha256']==DIAG_SHA and residual['actualWorldEqualsEvaluatedWorldForEveryTargetExactly']
        assert residual['originalThresholdsChanged']is False
    def same_scene(self,actual,expected):
        r={'kind':'scene','actualPointer':pointer(actual),'expectedPointer':pointer(expected),'actualName':actual.name,'expectedName':expected.name,
            'pythonWrapperIs':actual is expected}
        r['pass']=r['actualPointer']==r['expectedPointer']and r['actualName']==r['expectedName']
        self.context_comparisons.append(r);return r['pass']
    def same_layer(self,actual,expected,scene):
        r={'kind':'view-layer','actualPointer':pointer(actual),'expectedPointer':pointer(expected),'actualName':actual.name,'expectedName':expected.name,
            'actualOwnerPointer':pointer(actual.id_data),'expectedOwnerPointer':pointer(expected.id_data),'scenePointer':pointer(scene),
            'pythonWrapperIs':actual is expected}
        r['pass']=r['actualPointer']==r['expectedPointer']and r['actualName']==r['expectedName']and r['actualOwnerPointer']==r['expectedOwnerPointer']==r['scenePointer']
        self.context_comparisons.append(r);return r['pass']
    def normalize(self,g,phase):
        assert g is self.g;verify();bpy=g['bpy'];scene=g['d'].SC
        assert pointer(bpy.context.window.scene)==pointer(scene)and g['VIS_QUEUE']is None
        layer=bpy.context.window.view_layer;objects=list(scene.objects);transform=self.original['transform'];tools=self.tools
        before={ob:tools['object_channels'](ob,transform,layer)for ob in objects}
        flags={ob:(ob.hide_render,ob.hide_viewport,ob.hide_get(view_layer=layer)if ob.name in layer.objects else None)for ob in objects}
        raw_before={ob:tools['flat'](ob.matrix_world)for ob in objects}
        frames=(scene.frame_current,scene.frame_subframe);error=None
        try:
            for ob,(hr,hv,local)in flags.items():
                if hr:ob.hide_render=False
                if hv:ob.hide_viewport=False
                if local is True:ob.hide_set(False,view_layer=layer)
            tools['update'](g,objects,tag=True)
        except BaseException as e:error=e
        finally:
            for ob,(hr,hv,local)in flags.items():
                if ob.hide_render!=hr:ob.hide_render=hr
                if ob.hide_viewport!=hv:ob.hide_viewport=hv
                if local is not None and ob.hide_get(view_layer=layer)!=local:ob.hide_set(local,view_layer=layer)
            tools['update'](g,objects,tag=True)
        after={ob:tools['object_channels'](ob,transform,layer)for ob in objects}
        changed=[{'object':ob.name,'before':before[ob],'after':after[ob]}for ob in objects if before[ob]!=after[ob]]
        dg=bpy.context.evaluated_depsgraph_get()
        evaluated=[]
        for ob in objects:
            aw=tools['flat'](ob.matrix_world);ew=tools['flat'](ob.evaluated_get(dg).matrix_world)
            difference=tools['delta'](aw,ew)
            evaluated.append({'object':ob.name,'actualWorldSha256':jsha(aw),'evaluatedWorldSha256':jsha(ew),
                'actualVersusEvaluatedMaximumAbsoluteDifference':difference,'exactZero':difference==0.,
                'cacheChangedVersusPreNormalization':aw!=raw_before[ob]})
        row={'phase':phase,'objectCount':len(objects),'entryChannelSha256':jsha({o.name:before[o]for o in objects}),
            'restoredChannelSha256':jsha({o.name:after[o]for o in objects}),'fullInputChannelConstraintVisibilityOffenders':changed,
            'allInputChannelsConstraintsVisibilityAndPointersUnchanged':not changed,
            'actualVersusEvaluatedWorld':evaluated,'allActualWorldEqualsEvaluatedWorldExactly':all(r['exactZero']for r in evaluated),
            'frameAndSubframeUnchanged':frames==(scene.frame_current,scene.frame_subframe),
            'normalObjectTagDepsgraphUpdatesAndTemporaryOwnedVisibilityOnly':True,'worldOrBasisAssignments':0,
            'error':None if error is None else {'type':type(error).__name__,'message':str(error)}}
        self.history.append(row)
        assert error is None and not changed and row['frameAndSubframeUnchanged']and row['allActualWorldEqualsEvaluatedWorldExactly'],('Normal cache refresh failed; no waiver',row)
    def metadata(self):
        return {'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),
            'retainedNamespaceCompatibilityAdapter':str(COMPAT),'retainedNamespaceCompatibilityAdapterSha256':COMPAT_SHA,
            'retainedCompatibilitySourceOnlyRootBoundaryChanged':True,'retainedCompatibilitySourceInverseByteExact':True,
            'additionalGeometrySourceBoundaries':[{'before':a,'after':b}for a,b in GEOMETRY_BOUNDARIES],
            'additionalGeometrySourceInverseByteExact':True,'freshGeometryOutput':str(NEW_OUT),
            'actual116Diagnostic':str(DIAG),'actual116DiagnosticSha256':DIAG_SHA,
            'independentBinary32ResidualEvidence':str(RESIDUAL),'independentBinary32ResidualEvidenceSha256':RESIDUAL_SHA,
            'derivedParentEquationIsNotOriginalBeforeAfterRestorationTest':True,
            'derivedOneULPResidualNeverUsedAsRestorationTolerance':True,
            'originalActualSavedWorldVersusRestoredWorldToleranceUnchanged':TOLERANCE,
            'normalizations':self.history,'RNAContextComparisons':self.context_comparisons,
            'allRecordedNormalizationsPreserveInputsAndExactEvaluatedWorld':bool(self.history)and all(r['allInputChannelsConstraintsVisibilityAndPointersUnchanged']and r['allActualWorldEqualsEvaluatedWorldExactly']and r['frameAndSubframeUnchanged']and r['error']is None for r in self.history),
            'onlyOwnedVisibilityTemporarilyAssigned':True,'transformMatrixConstraintAssignmentsAdded':0,
            'noThresholdOrGeometryTimeQualityChange':True,'finalAcceptance':False}

def prepare(ns):
    verify();source=COMPAT.read_text();body=replace_exact(source,[COMPAT_BOUNDARY])
    env={'__name__':'_root_b7_cache_recovery_private','__file__':str(Path(__file__).resolve())}
    exec(compile(body,str(COMPAT)+' [private fresh-root only]','exec'),env)
    original_adapt=env['adapt_text'];base_class=env['Compatibility'];recovery=Recovery(ns['main'].__globals__)
    def derived_geometry():
        text=original_adapt();return replace_exact(text,GEOMETRY_BOUNDARIES)
    class RecoveredCompatibility(base_class):
        def __init__(self,*args,**kwargs):
            super().__init__(*args,**kwargs);self.recovery=recovery;self.private['_recovery']=recovery
            self.added_pins.update({str(p):h for p,h in EXTRA_PINS.items()})
            assert self.private['OUT']==NEW_OUT
        def metadata(self):
            result=super().metadata()
            result.update(onlyThreeDeclaredSourceBoundariesChanged=False,
                sourceBoundaryDeclaration='Original three namespace/quality boundaries PLUS five separately declared cache/context/output boundaries',
                privateGlobalExtensionsExplicit=result['privateGlobalExtensionsExplicit']+['_recovery normalizer and RNAidentity only'],
                geometryTimeLimitsAndOriginalProtectionCodeUnchanged=False,
                geometryTimeLimitsAndOriginalFileProtectionCodeUnchanged=True,
                originalStrictActualBeforeAfterNumericalComparisonRetained=True,cacheRecovery=recovery.metadata())
            return result
        def write_report(self,path,report):
            report['protectionChecks']['ownedCacheRefreshPreservedFullInputsAndActualEvaluatedWorld']=recovery.metadata()['allRecordedNormalizationsPreserveInputsAndExactEvaluatedWorld']
            report['cacheRecovery']=recovery.metadata()
            return super().write_report(path,report)
    env['adapt_text']=derived_geometry;env['Compatibility']=RecoveredCompatibility
    return env,recovery

def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,runtime_report_sha256=RUNTIME_SHA,approved_audit_sha256=None):
    assert authorized is True and mode in('audit','probe')and sha(__file__)==expected_adapter_sha256
    assert runtime_report_sha256==RUNTIME_SHA and not os.path.lexists(ROOT/mode)and not os.path.lexists(NEW_OUT/mode)
    if mode=='probe':
        audit=NEW_OUT/'audit/report.json';completion=ROOT/'audit/completion.json'
        assert approved_audit_sha256 and sha(audit)==approved_audit_sha256 and completion.is_file()
        old=read(audit);done=read(completion)
        assert old['namespaceCompatibility']['actualAdapterSha256']==expected_adapter_sha256
        assert old['actualGuardedStates']==18 and old['allGuardedStatesPass']and old['actualImages']==[]
        assert all(v is True for v in old['protectionChecks'].values())and done['originalReportSha256']==approved_audit_sha256
    env,recovery=prepare(ns)
    result=env['run'](ns,authorized=True,mode=mode,expected_adapter_sha256=expected_adapter_sha256,runtime_report_sha256=runtime_report_sha256)
    assert result['cacheRecovery']['allRecordedNormalizationsPreserveInputsAndExactEvaluatedWorld']
    assert result['noWorldOrBasisMatrixForced']and all(v is True for v in result['protectionChecks'].values())
    if mode=='audit':assert result['actualImages']==[]and result['actualGuardedStates']==18
    return result
