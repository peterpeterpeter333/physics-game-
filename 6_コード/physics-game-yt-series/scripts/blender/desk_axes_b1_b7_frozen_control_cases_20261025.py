"""NEW root-only, exact-case reuse of the two-pass137 B7 diagnostic.

Never infer historical/current raster differences to be random GPU noise.
Root must view and approve every historical/pass2 pair, with exact hashes.
No new control renders or fitted ROIs: reuse those frozen18 controls, then
render the original16 carry frames and2 unchanged contexts once. All old RGB0
and r2-policy NG results remain unmodified diagnostic evidence. Context pixel
comparisons remain diagnostic; authoritative inputs/geometry are strict and
separate root eyes on all18 actual new images remain mandatory for B5.
No run is possible before the real137 summary and root case receipt exist.
"""
import ast
import hashlib
import json
import os
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_b1_b7_window_policy_v3_20261025.py'
SOURCE_SHA='fdb6858923fcad77b282014cde20829f3f27f6dcdfb3785a15299bbc7e8366b8'
DIAGNOSTIC_HELPER=W/'scripts/blender/desk_axes_b1_b7_control18_distribution_diagnostic_20261025.py'
DIAGNOSTIC_HELPER_SHA='6c6adc908d80ae9a6c5caa7432b3e4bc96668d3ff0c2deec0ab4776fdd1eb23c'
DIAGNOSTIC_ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-all18-controls-diagnostic-20261025')
SUMMARY=DIAGNOSTIC_ROOT/'diagnostic-summary.json'
ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-frozen-control-cases-20261025')
NEW_OUT=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-frozen-control-cases-20261025')
ORIGINAL_GEOMETRY_SHA='d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'
RUNTIME_SHA='69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1'
ALL=list(range(4124,4142))
CONTEXT=[4124,4141]
CRITERION='same-authoritative-source-input-and-geometry; actual18 eyes pending; RGB0 retained'

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def valid_sha(x):return isinstance(x,str)and len(x)==64 and all(c in '0123456789abcdef'for c in x)
def verify(pins):
    for p,h in pins.items():assert valid_sha(h)and sha(p)==h,('Protected input differs',str(p))
def replace_exact(text,boundaries):
    original=text
    for before,after,count in boundaries:
        assert text.count(before)==count,('Nonunique declared case boundary',before[:100],text.count(before),count)
        text=text.replace(before,after)
    inverse=text
    for before,after,count in reversed(boundaries):
        assert inverse.count(after)==count;inverse=inverse.replace(after,before)
    assert inverse==original,'All private source boundaries must invert byte-exactly'
    ast.parse(text);return text

PATH_BOUNDARIES=[
 ('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v3-20261025',str(ROOT),1),
 ('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-v3-20261025',str(NEW_OUT),1)]
# Rename only the self-added supplemental control predicates. A root-approved
# exact18-case receipt does not claim pixel equality or compliance with r2.
CRITERION_BOUNDARIES=[
 ('all18ControlsExactPrincipalOrApprovedBackgroundOnly','all18FrozenControlsRootCaseApproved',5),
 ('all18ExactPrincipalOrApprovedBackgroundOnly','all18FrozenControlCaseVerificationPass',2),
 ('allContext2ExactPrincipalOrApprovedBackgroundOnly','allContext2SameStateAndGeometryEvidenceVerified',2),
 ('actualContext2PrincipalExactOrApprovedWindowOnly','actualContext2SameAuthoritativeStateGeometryAndInputDigest',1),
 ('all18ControlsPassedApprovedWindowPolicy','all18FrozenControlRootCaseVerificationPassed',1),
 ('context2PassedApprovedWindowPolicy','context2UnchangedStateGeometryEvidenceVerified',1)]
OBSERVATION_BOUNDARIES=[
 ('                bpy.ops.render.render(write_still=True,scene=scene.name)',
  "                _root_case.before_actual(j,row)\n                bpy.ops.render.render(write_still=True,scene=scene.name)\n                _root_case.after_actual(j,row)",1)]

def load_cases(*,summary_sha256,root_approval,root_approval_sha256):
    assert valid_sha(summary_sha256)and valid_sha(root_approval_sha256)
    approval_path=Path(root_approval).resolve()
    assert approval_path.is_file()and not approval_path.is_symlink()
    pins={SOURCE:SOURCE_SHA,DIAGNOSTIC_HELPER:DIAGNOSTIC_HELPER_SHA,
          SUMMARY:summary_sha256,approval_path:root_approval_sha256,Path(__file__).resolve():sha(__file__)}
    def pin(p,h):
        p=Path(p)
        if p in pins:assert pins[p]==h,('Conflicting protected SHA',str(p))
        pins[p]=h
    verify(pins);s=read(SUMMARY);a=read(approval_path)
    assert s['episode']=='B-1'and s['mode']=='all18-controls-distribution-diagnostic-only'
    assert s['helperSha256']==DIAGNOSTIC_HELPER_SHA and s['actualImageCount']==36 and s['actualFrameSet']==ALL
    assert s['all36StrictTransactionGuardsPass']is True and s['all36ControlsGeneratedWithoutStoppingAtPixelPolicyNG']is True
    assert s['geometryRepairOrActualNeedleProbeInvoked']is False and s['newToleranceOrNewBackgroundApprovalGranted']is False
    assert s['finalAcceptance']is False and len(s['passes'])==2
    assert a['episode']=='B-1'and a['purpose']=='root-approval-of-exact-137-frozen-control18-cases-only'
    assert a['actualViewer']=='root'and a['reviewedAll18HistoricalAndPass2Pairs']is True and a['reviewedImageCount']==36
    assert a['diagnosticSummary']=={'path':str(SUMMARY),'sha256':summary_sha256}
    assert a['originalGeometryHelperSha256']==ORIGINAL_GEOMETRY_SHA and a['actualRuntimeDiagnosticSha256']==RUNTIME_SHA
    assert a['historicalVersusCurrentDifferenceCause']=='not-established'
    assert a['noGeneralRasterToleranceGranted']is True and a['reuseExactlyApprovedPass2Controls']is True
    assert a['requireSeparateAll18ActualRepairImageApproval']is True and a['context2Criterion']==CRITERION
    assert a['finalAcceptance']is False
    assert len(a['cases'])==18 and [x['frame']for x in a['cases']]==ALL
    assert len(a['diagnosticPassReports'])==2 and [x['pass']for x in a['diagnosticPassReports']]==[1,2]
    repeated={x['frame']:x for x in s['repeatedControlComparisons']}
    assert sorted(repeated)==ALL and all(x['exactInputStateDigestEqual']is True for x in repeated.values())
    passes=[]
    for number,p in enumerate(s['passes'],1):
        assert p['pass']==number and p['allOriginalStrictTransactionGuardsPassed']is True and p['modelRepairApplied']is False
        report_path=Path(p['report']);assert report_path==DIAGNOSTIC_ROOT/('pass-%02d'%number)/'before-controls.json'
        approved_report=a['diagnosticPassReports'][number-1]
        assert approved_report['path']==str(report_path)and approved_report['sha256']==p['reportSha256']
        pin(report_path,p['reportSha256']);verify({report_path:p['reportSha256']});r=read(report_path)
        metadata_path=report_path.parent/'diagnostic-metadata.json'
        assert approved_report['metadataPath']==str(metadata_path)
        pin(metadata_path,approved_report['metadataSha256']);verify({metadata_path:approved_report['metadataSha256']});m=read(metadata_path)
        assert r['frames']==ALL and len(r['actualImages'])==len(r['comparisonRows'])==18
        assert r['controlSettings']=={'resolution':[1080,1920,100],'jpegQuality':92,'taaRenderSamples':16}
        assert r.get('error')is None and r.get('cleanupError')is None and r['restorationOffenders']==[]
        assert r['protectionChecks']and all(x is True for x in r['protectionChecks'].values())
        images={x['frame']:x for x in r['actualImages']};comparisons={x['frame']:x for x in r['comparisonRows']}
        states={x['frame']:x for x in m['supplementalWindowControlPolicy']['controlStateProofs']}
        assert sorted(images)==sorted(comparisons)==sorted(states)==ALL
        for j in ALL:
            image=images[j];comparison=comparisons[j];state=states[j]
            assert image['otherObjectSourceFrame']==j and state['otherObjectSourceFrame']==j
            assert state['pass']is True and state['originalActualWorldToleranceUnchanged']==1e-9
            assert comparison['quantizationExactlyEqual']is True and comparison['imageDimensions']==[1080,1920,3]
            assert comparison['leftSha256']==image['sourceSha256']and comparison['rightSha256']==image['sha256']
            assert image['path']==str(report_path.parent/'before-controls'/('%05d.jpg'%j))
            pin(image['path'],image['sha256']);pin(image['source'],image['sourceSha256'])
        passes.append({'report':r,'metadata':m,'images':images,'comparisons':comparisons,'states':states,'reportPath':report_path,'metadataPath':metadata_path})
    case_by_frame={x['frame']:x for x in a['cases']}
    for j in ALL:
        first,last=passes[0]['images'][j],passes[1]['images'][j];case=case_by_frame[j];repeat=repeated[j]
        assert first['source']==last['source']and first['sourceSha256']==last['sourceSha256']and first['pose']==last['pose']
        assert case['sourcePath']==last['source']and case['sourceSha256']==last['sourceSha256']
        assert case['pass1Path']==first['path']and case['pass1Sha256']==first['sha256']
        assert case['pass2Path']==last['path']and case['pass2Sha256']==last['sha256']
        before1=passes[0]['states'][j]['beforeInputStateSha256'];before2=passes[1]['states'][j]['beforeInputStateSha256']
        assert before1==before2==case['beforeInputStateSha256']==repeat['firstInputStateSha256']==repeat['secondInputStateSha256']
        assert repeat['comparison']['leftSha256']==first['sha256']and repeat['comparison']['rightSha256']==last['sha256']
        assert case['pass2OriginalFullImageZeroDifferencePass']is passes[1]['comparisons'][j]['originalFullImageZeroDifferencePass']
        assert case['repeatedInputStateDigestEqual']is True and case['actualRootPairViewed']is True and case['approvedForFrozenControlReuse']is True
    for p,h in s['protectedInputSha256'].items():
        pin(p,h)
    verify(pins)
    return {'summary':s,'approval':a,'approvalPath':approval_path,'approvalSha256':root_approval_sha256,
        'summarySha256':summary_sha256,'passes':passes,'cases':case_by_frame,'pins':pins}

class RootCases:
    def __init__(self,owner,cases):
        self.owner=owner;self.cases=cases;self.actual_states=[];self.pending={};self.actual_report=None
    def before_actual(self,j,row):
        assert j in ALL and j not in self.pending and row['pass']is True
        assert row['allNonAuthorizedObjectChannelsUnchanged']is True
        assert row['pose']==self.cases['passes'][1]['images'][j]['pose']and row['unchangedOtherObjectSourceFrame']==j
        assert row['explicitChanges']['principalRockWorldGeometryUnchanged']is True
        assert row['explicitChanges']['principalRockBaselineWorldVerticesSha256']==row['explicitChanges']['principalRockActualWorldVerticesSha256']
        state=self.owner.policy.capture(self.owner)
        if j in CONTEXT:assert jsha(state)==self.cases['cases'][j]['beforeInputStateSha256'],'Unchanged-context input differs from approved137 pass2'
        self.pending[j]=state
        self.owner.policy.before_control(self.owner,j,j,row['pose'])
    def after_actual(self,j,row):
        before=self.pending.pop(j);self.owner.policy.after_control(self.owner,j)
        proof=self.owner.policy.states[-1]
        assert proof['frame']==j and proof['pass']is True and proof['beforeInputStateSha256']==jsha(before)
        self.actual_states.append({**proof,'contextOnly':j in CONTEXT,
            'matchesFrozen137InputDigest':jsha(before)==self.cases['cases'][j]['beforeInputStateSha256'],
            'root18ActualImageEyesStillPending':True})
    def context_compare(self,left,right,left_sha,right_sha,retained_compare):
        assert self.actual_report is not None
        controls={x['frame']:x for x in self.owner.control_report['actualImages']}
        actual={x['frame']:x for x in self.actual_report['actualImages']}
        candidates=[j for j in CONTEXT if str(left)==controls[j]['path']and str(right)==actual[j]['path']]
        assert len(candidates)==1,'Only the two explicit unchanged contexts may use context criterion'
        j=candidates[0];assert left_sha==controls[j]['sha256']and right_sha==actual[j]['sha256']
        original=retained_compare(self.owner,left,right,left_sha,right_sha)
        row=next(x for x in self.actual_report['physical']if x['frame']==j)
        state=next(x for x in self.actual_states if x['frame']==j)
        assert row['contextOnly']is True and row['operationTime']is None and row['allNonAuthorizedObjectChannelsUnchanged']is True
        assert row['unchangedOtherObjectSourceFrame']==j and row['pose']==controls[j]['pose']
        change=row['explicitChanges'];assert change['principalRockWorldGeometryUnchanged']is True
        assert change['principalRockBaselineWorldVerticesSha256']==change['principalRockActualWorldVerticesSha256']
        assert change['baselineSixthNeedleLocation']==change['actualSixthNeedleLocation']and change['baselineKaiHand']==change['actualKaiHand']
        assert state['pass']is True and state['matchesFrozen137InputDigest']is True
        # Original full-RGB pass is NOT mutated. This top-level pass is the
        # separately named source/state/geometry criterion, never pixel equality.
        return {**original,'originalFullImageZeroDifferencePass':original['pass'],
            'originalZeroDifferenceComparisonUnchanged':original,'originalZeroDifferenceNGRetained':not original['pass'],
            'pass':True,'comparisonMethod':'Exact approved control/input/ref/pose/unchanged channels and rock geometry; original context RGB0 retained, root actual18 eyes pending',
            'criterion':CRITERION,'contextFrame':j,'fullImageRgbExactNotInferredFromNewCriterion':True,
            'root18ActualImageEyesStillPending':True,'finalAcceptance':False}
    def metadata(self):
        c=self.cases
        return {'criterion':CRITERION,'diagnosticSummary':str(SUMMARY),'diagnosticSummarySha256':c['summarySha256'],
            'rootExact18CaseApproval':str(c['approvalPath']),'rootExact18CaseApprovalSha256':c['approvalSha256'],
            'diagnosticPass2ControlsReused':True,'newControlRendersThisInvocation':0,
            'historicalVersusCurrentRasterDifferenceCause':'not-established','noGeneralPixelToleranceOrNewRoi':True,
            'allOldFullRgbAndPolicyResultsRetained':True,'actualRenderInputProofs':self.actual_states,
            'separateExactSHAApprovalOfAll18ActualRepairImagesStillRequired':True,'finalAcceptance':False}

def build(cases=None):
    verify({SOURCE:SOURCE_SHA,DIAGNOSTIC_HELPER:DIAGNOSTIC_HELPER_SHA})
    text=replace_exact(SOURCE.read_text(),PATH_BOUNDARIES)
    outer={'__name__':'_root_b7_frozen_control_cases_private','__file__':str(Path(__file__).resolve())}
    exec(compile(text,str(SOURCE)+' [private frozen-control paths only]','exec'),outer)
    if cases is not None:outer['scope']['EXTRA'].update(cases['pins'])
    recovered,_=outer['scope']['build']()
    old_adapt=recovered['_POLICY_ADAPT_COMPAT']
    def criterion_adapt(body):return replace_exact(old_adapt(body),CRITERION_BOUNDARIES)
    recovered['_POLICY_ADAPT_COMPAT']=criterion_adapt
    original_prepare=recovered['prepare']
    def prepare(ns):
        assert cases is not None,'Actual137 and root case approval are required; static build is not runnable'
        verify(cases['pins']);env,recovery=original_prepare(ns);base=env['Compatibility']
        # The policy-injected compatibility class in ea40 defines compare as a
        # WindowPolicy route. Its original complete-RGB comparator is retained
        # inside the policy object and used below without changing its result.
        class FrozenCompatibility(base):
            def __init__(self,*args,**kwargs):
                super().__init__(*args,**kwargs);self.root_cases=RootCases(self,cases)
                self.private['_root_case']=self.root_cases
                self.added_pins.update({str(p):h for p,h in cases['pins'].items()})
            def control18(self):
                verify(cases['pins']);self.verify_namespace(self.ns,self.g)
                g=self.g;bpy=g['bpy'];scene=g['d'].SC;oldscene=bpy.context.window.scene;oldlayer=bpy.context.window.view_layer
                poses=env['read'](env['BASE']/'blender/delivered-camera-poses.json')['poses']
                data=env['read'](env['BASE']/'composite-provenance.json')
                before_inventory=self.private['inventory'](env['BASE']/'blender/desk')
                tx=None;report={'mode':'root-approved exact137 pass2 controls reused; zero control renders','frames':ALL,
                    'raw':str(cases['passes'][1]['reportPath'].parent/'before-controls'),'actualImages':[],
                    'comparisonRows':[],'newControlRendersThisInvocation':0,'all18FrozenControlsRootCaseApproved':False,
                    'originalWholeImageZeroDifferenceCriterionUnchanged':True,'probeDeliveryImagesNotClaimedHere':True,'finalAcceptance':False}
                self.control_report=report
                try:
                    bpy.context.window.scene=scene;bpy.context.view_layer.update()
                    tx=self.private['SceneTransaction'](g,oldscene,oldlayer)
                    scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
                    scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=92;scene.eevee.taa_render_samples=16
                    assert scene.render.engine=='BLENDER_EEVEE'and scene.view_settings.view_transform=='Standard'and scene.view_settings.look=='None'
                    for j in ALL:
                        frozen=cases['passes'][1]['images'][j];old=data['records'][j]
                        assert old['source']==frozen['source']and old['sha256']==frozen['sourceSha256']
                        assert old['originalObjectSourceFrame']==j and poses[j]==frozen['pose']
                        g['apply'](j/30);g['pose_b1'](poses[j]);bpy.context.view_layer.update()
                        self.policy.before_control(self,j,j,poses[j])
                        assert jsha(self.policy.capture(self))==cases['cases'][j]['beforeInputStateSha256'],'Current authoritative input does not match approved137 pass2'
                        self.policy.after_control(self,j)
                        old_comparison=cases['passes'][1]['comparisons'][j]
                        report['actualImages'].append({**frozen,'renderedThisInvocation':False,
                            'reusedFromDiagnostic137Pass':2,'actuallyViewed':False})
                        report['comparisonRows'].append({**old_comparison,
                            'retainedOriginal137Pass2Comparison':old_comparison,'retainedOriginal137R2PolicyPass':old_comparison['pass'],
                            'pass':True,'rootExactFrozenCaseApproved':True,'noPixelEqualityInferred':True,
                            'comparisonMethod':'Exact137 pass2 JPEG reused with exact root18-case approval and matching live authoritative input digest'})
                    report['all18FrozenControlsRootCaseApproved']=len(report['actualImages'])==18
                except BaseException as error:
                    report['error']={'type':type(error).__name__,'message':str(error)};raise
                finally:
                    checks={};offenders=[];cleanup=None
                    try:
                        if tx is not None:checks,offenders=tx.close()
                    except BaseException as error:cleanup={'type':type(error).__name__,'message':str(error)}
                    finally:
                        bpy.context.window.scene=oldscene;bpy.context.window.view_layer=oldlayer;bpy.context.view_layer.update()
                    checks['all10700BaseRawStatAndPathsUnchanged']=self.private['inventory'](env['BASE']/'blender/desk')==before_inventory
                    checks['all18OriginalSourceJpegSHAUnchanged']=all(sha(r['source'])==r['sourceSha256']for r in self.headers['rows'])
                    checks['allApproved137DiagnosticAndCaseReceiptFilesUnchanged']=all(sha(p)==h for p,h in cases['pins'].items())
                    checks['noRuntimeOrSnapshotRebinding']=self.tools['bindings'](g)==self.initial_bindings and self.tools['bindings'](self.ns)==self.initial_snapshot_bindings
                    report.update(protectionChecks=checks,restorationOffenders=offenders,cleanupError=cleanup)
                    self.verify_pins();env['write_new'](self.out/'before-controls.json',report)
                    assert tx is not None and not cleanup and not offenders and checks and all(x is True for x in checks.values()),('Frozen-control strict cleanup failed',checks,cleanup,offenders)
                assert report['all18FrozenControlsRootCaseApproved']and not report.get('error')
            def compare(self,left,right,left_sha=None,right_sha=None):
                retained=self.policy.retained_compare
                return self.root_cases.context_compare(left,right,left_sha,right_sha,retained)
            def metadata(self):
                result=super().metadata()
                result['retainedInactiveSupplementalR2ControlPolicy']=result.pop('supplementalWindowControlPolicy')
                result['rootFrozenControlCases']=self.root_cases.metadata()
                result['controlImagesRendered']=0
                result['controlImagesReused']=0 if self.control_report is None else len(self.control_report['actualImages'])
                result['context2PixelComparisonsAreDiagnosticNotEqualityClaims']=True
                result['sourceBoundaryDeclaration']+=' PLUS six supplemental-criterion name substitutions and one read-only actual-render observation boundary; private class adds exact frozen-case reuse'
                result['frozenCasePrivateBoundaries']={'paths':PATH_BOUNDARIES,'criteria':CRITERION_BOUNDARIES,'readOnlyRenderObservation':OBSERVATION_BOUNDARIES,
                    'allSourceReplacementsInverseByteExact':True,'originalGeometryHelperSha256':ORIGINAL_GEOMETRY_SHA,
                    'actualContainerAdapter':str(Path(__file__).resolve()),'actualContainerAdapterSha256':sha(__file__)}
                return result
            def write_report(self,path,report):
                self.root_cases.actual_report=report
                if self.mode=='probe'and not report.get('error')and not report.get('cleanupError')and len(report['actualImages'])==18:
                    assert [x['frame']for x in self.root_cases.actual_states]==ALL and not self.root_cases.pending
                    assert all(x['pass']is True for x in self.root_cases.actual_states)
                    report['protectionChecks']['all18ActualRendersPreserveExactAuthoritativeInputsAndWorldOneEMinus9']=True
                    report['protectionChecks']['all18FrozenControlReuseInputDigestsAndProtectedJpegsVerified']=True
                report['rootFrozenControlCases']=self.root_cases.metadata()
                return super().write_report(path,report)
        old_geometry=env['adapt_text']
        env['adapt_text']=lambda:replace_exact(old_geometry(),OBSERVATION_BOUNDARIES)
        env['Compatibility']=FrozenCompatibility
        return env,recovery
    recovered['prepare']=prepare
    return recovered

def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,summary_sha256,
        root_approval,root_approval_sha256,approved_audit_sha256=None):
    assert authorized is True and mode in('audit','probe')and sha(__file__)==expected_adapter_sha256
    assert not os.path.lexists(ROOT/mode)and not os.path.lexists(NEW_OUT/mode),'Never overwrite any attempt'
    cases=load_cases(summary_sha256=summary_sha256,root_approval=root_approval,root_approval_sha256=root_approval_sha256)
    scope=build(cases)
    result=scope['run'](ns,authorized=True,mode=mode,expected_adapter_sha256=expected_adapter_sha256,
        approved_audit_sha256=approved_audit_sha256)
    verify(cases['pins'])
    assert result['helperSha256']==ORIGINAL_GEOMETRY_SHA and result['namespaceCompatibility']['actualAdapterSha256']==expected_adapter_sha256
    assert result['rootFrozenControlCases']['newControlRendersThisInvocation']==0
    if mode=='probe':
        assert len(result['actualImages'])==18 and result['actualPatchRenders']==16 and result['actualContextRenders']==2
        assert result['rootFrozenControlCases']['separateExactSHAApprovalOfAll18ActualRepairImagesStillRequired']is True
    return result
