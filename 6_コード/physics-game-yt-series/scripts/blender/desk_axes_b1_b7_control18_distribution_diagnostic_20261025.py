"""Root-only NEW all18 replay-controls diagnostic, never a needle repair/probe.

Two fresh passes retain every pixel-policy failure while continuing all18.
Only pixel-NG early exits become diagnostic observations. Original namespace,
state/material/light/mesh/file preservation and world1e-9 cleanup still stop.
No geometry run, gate waiver, output substitution or final acceptance occurs.
"""
import ast,hashlib,json,os,subprocess,time
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
SOURCE=W/'scripts/blender/desk_axes_b1_b7_window_policy_v3_20261025.py'
SOURCE_SHA='fdb6858923fcad77b282014cde20829f3f27f6dcdfb3785a15299bbc7e8366b8'
COMPARE=W/'scripts/umech/compare-b1-b7-window-policy-v3-20261025.py'
COMPARE_SHA='0c8449b7751e7071274bd05e52454b2ea49748026863a418e42f5d02eb86d71e'
FAILED=Path('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v3-20261025/probe/before-controls.json')
FAILED_SHA='6d201590199ca337cd860247b9bbe75d066cf7d70c5e1c63dec230296a8cf901'
FAILED_ENVELOPE=FAILED.parent/'failure.json'
FAILED_ENVELOPE_SHA='acacaf64bbc625fed1ec765c3fd607b3fef1cc00380bbb93b868b4c215205741'
ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-all18-controls-diagnostic-20261025')
UNUSED_GEOMETRY_OUT=Path('/private/tmp/ys/ys-chain-b1v1-b7-all18-controls-unused-geometry-20261025')
PYTHON=Path('/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
PINS={SOURCE:SOURCE_SHA,COMPARE:COMPARE_SHA,FAILED:FAILED_SHA,FAILED_ENVELOPE:FAILED_ENVELOPE_SHA,
      Path(__file__).resolve():sha(__file__)}
def verify():
    for p,h in PINS.items():assert sha(p)==h,p
def replace_exact(original,boundaries):
    text=original
    for before,after in boundaries:
        assert text.count(before)==1,('Nonunique diagnostic boundary',before[:120])
        text=text.replace(before,after,1)
    inverse=text
    for before,after in reversed(boundaries):
        assert inverse.count(after)==1;inverse=inverse.replace(after,before,1)
    assert inverse==original;ast.parse(text);return text

PATH_BOUNDARIES=[
 ('/private/tmp/ys/ys-chain-b1v1-b7-window-policy-v3-20261025',str(ROOT)),
 ('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-v3-20261025',str(UNUSED_GEOMETRY_OUT))]
CONTROL_BOUNDARIES=[
 ("                assert comparison['pass'],('Before-control pixels differ; no waiver/no probe',j,comparison)",
  "                assert isinstance(comparison['pass'],bool), 'Diagnostic records true or false without relabeling'"),
 ("                print('B7 before-control exact',j,comparison['comparisonMethod'],flush=True)",
  "                print('B7 diagnostic before-control',j,comparison['pass'],comparison['comparisonMethod'],flush=True)"),
 ("        assert report['all18ControlsExactPrincipalOrApprovedBackgroundOnly']and not report.get('error')",
  "        assert len(report['comparisonRows'])==18 and not report.get('error'), 'All18 comparisons required; global pixel-policy NG is retained'")]

def build():
    verify();original=SOURCE.read_text();text=replace_exact(original,PATH_BOUNDARIES)
    outer={'__name__':'_root_b7_all18_diagnostic_source_private','__file__':str(Path(__file__).resolve())}
    exec(compile(text,str(SOURCE)+' [private diagnostic fresh paths only]','exec'),outer)
    recovered,_=outer['scope']['build']()
    assert recovered['ROOT']==ROOT and recovered['NEW_OUT']==UNUSED_GEOMETRY_OUT
    return outer,recovered

def run(ns,authorized=False,*,expected_helper_sha256,passes=2):
    assert authorized is True and passes==2 and sha(__file__)==expected_helper_sha256;verify()
    assert not os.path.lexists(ROOT)and not os.path.lexists(UNUSED_GEOMETRY_OUT),'Keep all prior attempts'
    started=time.time();outer,recovered=build();env,recovery=recovered['prepare'](ns)
    assert env['ROOT']==ROOT and not os.path.lexists(UNUSED_GEOMETRY_OUT)
    # Replace only the NEW private class's control18 method, not any live model
    # function, global binding or frozen source. No private geometry run call.
    # The inherited method's actual globals are ea40 after the policy's seven
    # boundaries, not the outer recovery wrapper's Python dictionary.
    frozen_compat=recovered['COMPAT'].read_text()
    fresh_compat=recovered['_POLICY_ADAPT_COMPAT'](recovered['replace_exact'](frozen_compat,[recovered['COMPAT_BOUNDARY']]))
    altered=replace_exact(fresh_compat,CONTROL_BOUNDARIES)
    cls=next(n for n in ast.parse(altered).body if isinstance(n,ast.ClassDef)and n.name=='Compatibility')
    method=next(n for n in cls.body if isinstance(n,ast.FunctionDef)and n.name=='control18')
    assert env['Compatibility'].control18.__globals__ is env
    exec(compile(ast.Module(body=[method],type_ignores=[]),str(recovered['COMPAT'])+' [diagnostic pixel failures continue]','exec'),env)
    env['Compatibility'].control18=env['control18']
    # Verify the same complete source/prepared inventories before any render.
    derived=env['adapt_text']();private={'__name__':'_root_b7_diagnostic_geometry_definitions_only','__file__':str(env['ORIGINAL'])}
    exec(compile(derived,str(env['ORIGINAL'])+' [definitions only; run never called]','exec'),private)
    assert private['OUT']==UNUSED_GEOMETRY_OUT
    results=[];actual_sets=[];states=[];protected=None
    for pass_no in range(1,passes+1):
        mode='pass-%02d'%pass_no
        compat=env['Compatibility'](ns,mode,expected_helper_sha256,recovered['RUNTIME_SHA'],private,derived)
        compat.added_pins.update({str(p):h for p,h in PINS.items()})
        private['_compat']=compat;private['PINS'].update({Path(p):h for p,h in compat.added_pins.items()})
        private['verify'](private['PINS'])
        prepared=env['read'](env['BASE']/'prepared.json')
        private['verify'](prepared['protectedInputSha256'])
        private['verify']({str(env['BASE']/p):h for p,h in prepared['outputHashes'].items()})
        defs=[n for n in ast.parse(private['STAGE'].read_text()).body if isinstance(n,ast.FunctionDef)]
        compat.verify_functions(ns,compat.g,defs)
        try:
            compat.control18()
            report=compat.control_report
            assert [r['frame']for r in report['actualImages']]==env['ALL']
            assert len(report['comparisonRows'])==18 and len(compat.policy.states)==18
            assert not report.get('error')and not report.get('cleanupError')and report['restorationOffenders']==[]
            assert report['protectionChecks']and all(v is True for v in report['protectionChecks'].values())
            compat.verify_functions(ns,compat.g,defs);verify()
            assert compat.tools['bindings'](compat.g)==compat.initial_bindings and compat.tools['bindings'](ns)==compat.initial_snapshot_bindings
            metadata=compat.metadata();env['write_new'](ROOT/mode/'diagnostic-metadata.json',metadata)
            results.append({'pass':pass_no,'report':str(compat.out/'before-controls.json'),'reportSha256':sha(compat.out/'before-controls.json'),
                'all18WholeImageRgbExact':all(r['originalFullImageZeroDifferencePass']for r in report['comparisonRows']),
                'all18ExistingR2PolicyPass':report['all18ControlsExactPrincipalOrApprovedBackgroundOnly'],
                'wholeImageNgFrames':[r['frame']for r in report['comparisonRows']if not r['originalFullImageZeroDifferencePass']],
                'existingPolicyNgFrames':[r['frame']for r in report['comparisonRows']if not r['pass']],
                'allOriginalStrictTransactionGuardsPassed':True,'modelRepairApplied':False})
            actual_sets.append({r['frame']:r for r in report['actualImages']});states.append({r['frame']:r for r in compat.policy.states})
            protected={str(p):h for p,h in private['PINS'].items()}
        except BaseException as error:
            failure=ROOT/mode/'diagnostic-failure.json'
            if not os.path.lexists(failure):env['write_new'](failure,{'type':type(error).__name__,'message':str(error),'finalAcceptance':False})
            raise
    repeats=[]
    for j in env['ALL']:
        left,right=actual_sets[0][j],actual_sets[1][j]
        child=subprocess.run([str(PYTHON),str(COMPARE),'--left',left['path'],'--right',right['path'],
            '--left-sha256',left['sha256'],'--right-sha256',right['sha256']],capture_output=True,text=True,check=False)
        assert child.returncode in(0,2),('Repeat comparator execution failure',child.stderr[:1000])
        comparison=json.loads(child.stdout);assert comparison['pass']==(child.returncode==0)
        repeats.append({'frame':j,'exactInputStateDigestEqual':states[0][j]['beforeInputStateSha256']==states[1][j]['beforeInputStateSha256'],
            'firstInputStateSha256':states[0][j]['beforeInputStateSha256'],'secondInputStateSha256':states[1][j]['beforeInputStateSha256'],
            'comparison':comparison,'sameStateJitterOnlyEstablishedIfInputDigestEqual':True})
    verify();private['verify'](private['PINS']);assert not os.path.lexists(UNUSED_GEOMETRY_OUT)
    result={'episode':'B-1','mode':'all18-controls-distribution-diagnostic-only','helper':str(Path(__file__).resolve()),'helperSha256':expected_helper_sha256,
        'protectedInputSha256':protected,'actualImageCount':36,'actualFrameSet':env['ALL'],'passes':results,'repeatedControlComparisons':repeats,
        'pathBoundaries':[{'before':a,'after':b}for a,b in PATH_BOUNDARIES],
        'onlyThreeControlMethodDiagnosticBoundaries':[{'before':a,'after':b}for a,b in CONTROL_BOUNDARIES],
        'allDeclaredSourceBoundariesUniqueAndInverseByteExact':True,
        'all36ControlsGeneratedWithoutStoppingAtPixelPolicyNG':True,
        'globalWholeImageZeroDifferencePass':all(r['all18WholeImageRgbExact']for r in results),
        'globalExistingR2PolicyPass':all(r['all18ExistingR2PolicyPass']for r in results),
        'all36StrictTransactionGuardsPass':True,'geometryRepairOrActualNeedleProbeInvoked':False,
        'newToleranceOrNewBackgroundApprovalGranted':False,'originalGateExecutedOrModified':False,
        'originalFailuresRemainProtected':True,'seconds':time.time()-started,'actualImagesPersonallyViewed':False,'earsVerified':False,'finalAcceptance':False}
    env['write_new'](ROOT/'diagnostic-summary.json',result)
    return result
