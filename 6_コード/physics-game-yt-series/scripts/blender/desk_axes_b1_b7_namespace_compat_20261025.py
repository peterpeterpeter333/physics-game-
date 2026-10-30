"""Root-only transparent three-boundary B7 compatibility adapter; inert import.

The original d173 helper is immutable. Two inapplicable current-source/global
assertions become stronger explicit actual-runtime pins; JPEG quality95 becomes
the actual18-source quality92. Every original geometry/time/numeric/restoration
guard remains unchanged. Probe first renders18 separate before-controls and
requires byte-exact or decoded-RGB maxdiff0 versus the actual B4→B3 sources.
The original18 probe outputs remain a distinct scope; both context outputs must
also equal their before-controls. Audit has zero rendering and no control claim.
"""
import ast,hashlib,json,os,runpy,subprocess,time,types
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
ORIGINAL_SHA='d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54'
TOOLS=W/'scripts/blender/desk_axes_b1_b7_namespace_diagnostic_v2_20261025.py'
TOOLS_SHA='98e11823b952c024d7769e678ced48a1274fa198ab94379b13971f536b4abcb0'
RUNTIME=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-v2-20261025.json'
INITIAL=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-20261025.json'
INITIAL_SHA='23db067750d03c05add9accae86506b80219e894f021794739396d5ade4ec321'
HEADERS=W/'outputs/axes-20261023/b1-b7-control18-source-quantization-proof-20261025.json'
HEADERS_SHA='73b042746ae1e922ef60079f3f15bcc57d50660a9852c719a29a3d99b9928c56'
COMPARE=W/'scripts/umech/compare-b1-b7-jpeg-rgb-exact-20261025.py'
COMPARE_SHA='f40eb8ee33e8ffd1ad07fe0ed5bf5d5508f0b335acd687cbcca9feef2b17391f'
PYTHON=Path('/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
ROOT=Path('/private/tmp/ys/ys-chain-b1v1-b7-namespace-compat-20261025')
BASE=Path('/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025')
ALL=list(range(4124,4142));CONTEXT=[4124,4141]

BOUNDARIES=[
 ("    assert g['apply'].__globals__ is g and g['pose_b1'].__globals__ is g",
  "    assert _compat.verify_namespace(ns,g), 'Actual pinned cancellation wrapper and namespace must pass'"),
 ("    assert all(g[n.name].__code__==fresh[n.name].__code__ for n in defs),'Original function AST must be exact; no inherited visual-wrapper rebinding'",
  "    assert _compat.verify_functions(ns,g,defs), 'Exact actual mixed-runtime code/identity pin must pass; no reload'"),
 ("        scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95;scene.eevee.taa_render_samples=16",
  "        scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=92;scene.eevee.taa_render_samples=16")]

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def validsha(h):return isinstance(h,str)and len(h)==64 and all(c in '0123456789abcdef'for c in h)
def write_new(p,value):
    p=Path(p);assert p.is_relative_to(ROOT)and not os.path.lexists(p)
    assert not any(q.is_symlink()for q in p.parents if q.exists())
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(value,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
def adapt_text():
    assert sha(ORIGINAL)==ORIGINAL_SHA
    original=ORIGINAL.read_text();text=original
    for before,after in BOUNDARIES:
        assert text.count(before)==1; text=text.replace(before,after,1)
    inverse=text
    for before,after in reversed(BOUNDARIES):
        assert inverse.count(after)==1;inverse=inverse.replace(after,before,1)
    assert inverse==original,'Only the exact three declared boundaries may differ'
    ast.parse(text,str(ORIGINAL))
    return text

class Compatibility:
    def __init__(self,ns,mode,adapter_sha,runtime_sha,private,derived_text):
        self.ns=ns;self.g=ns['main'].__globals__;self.mode=mode;self.adapter_sha=adapter_sha
        self.private=private;self.original_write=private['write'];self.out=ROOT/mode
        self.runtime_sha=runtime_sha;self.runtime=read(RUNTIME);self.headers=read(HEADERS)
        self.tools=runpy.run_path(str(TOOLS));self.originalReport=private['OUT']/mode/'report.json'
        self.sidecar=self.out/'compatibility.json';self.control_report=None;self.context_comparisons=[]
        self.validation_calls=[];self.initial_bindings=self.tools['bindings'](self.g)
        self.initial_snapshot_bindings=self.tools['bindings'](ns)
        self.derived_sha=hashlib.sha256(derived_text.encode()).hexdigest()
        self.added_pins={str(Path(__file__).resolve()):adapter_sha,str(TOOLS):TOOLS_SHA,str(RUNTIME):runtime_sha,
            str(INITIAL):INITIAL_SHA,str(HEADERS):HEADERS_SHA,str(COMPARE):COMPARE_SHA}
        for p,h in self.headers['inputsSha256'].items():
            assert p not in self.added_pins or self.added_pins[p]==h;self.added_pins[p]=h
        for p,h in self.runtime['inputSha256'].items():
            assert p not in self.added_pins or self.added_pins[p]==h;self.added_pins[p]=h
        assert self.runtime['helperSha256']==TOOLS_SHA and self.runtime['initialActual111EvidenceSha256']==INITIAL_SHA
        assert self.runtime['all10700RetainedPlansExact']and self.runtime['noRuntimeRebindings']and self.runtime['pinnedInputsUnchanged']
        assert self.headers['all18ActualSourcesAreB3RawNotB6']and self.headers['all18JpegTablesIdenticalAndExactStandard92']
        assert [r['frame']for r in self.headers['rows']]==ALL

    def verify_pins(self):
        assert sha(ORIGINAL)==ORIGINAL_SHA
        for p,h in self.added_pins.items():assert sha(p)==h,('Compatibility input changed',p)

    def verify_namespace(self,ns,g):
        self.verify_pins();assert ns is self.ns and g is self.g
        assert id(g)==self.runtime['actualMainGlobalsIdentity']and id(ns)==self.runtime['actualSnapshotIdentity']
        assert g['main']is ns['main']and g['main'].__globals__ is g and g['pose_b1'].__globals__ is g
        guarded=g['apply'];assert isinstance(guarded,types.FunctionType)
        dc=self.tools['compiled_defs'](self.tools['DISPATCHER'])['_axes_guard']
        guardcode=self.tools['children'](dc)['guarded']
        assert guarded.__code__==guardcode and getattr(guarded,'_axes_guarded',False)is True
        closure=dict(zip(guarded.__code__.co_freevars,(c.cell_contents for c in guarded.__closure__ or ())))
        assert set(closure)=={'original'}and isinstance(closure['original'],types.FunctionType)
        original=closure['original'];assert original.__globals__ is g and ns['apply']is original
        ag=guarded.__globals__;assert ag.get('_AXES_SESSION')is ag and Path(ag['_AXES_ROOT'])==Path('/private/tmp/ys/axes-active-queue')
        assert ag['_axes_guard'].__globals__ is ag and ag['_axes_guard'].__code__==dc
        assert self.tools['description'](guarded.__code__)==self.runtime['exactCancellationWrapper']
        assert id(original)==self.runtime['guardOriginalFunctionIdentity']
        for r in self.runtime['modelObjectIdentity']:
            assert r['sameObject']and ns[r['key']]is g[r['key']]and id(g[r['key']])==r['runtimeIdentity']
        assert id(g['EVENTS'])==self.runtime['EVENTS']['runtimeIdentity']and g['EVENTS']==self.runtime['EVENTS']['runtimeValues']
        assert id(ns['EVENTS'])==self.runtime['EVENTS']['snapshotIdentity']and ns['EVENTS']==self.runtime['EVENTS']['snapshotValues']
        self.validation_calls.append('exact actual guard+closure+globals+model identities')
        return True

    def verify_functions(self,ns,g,defs):
        self.verify_namespace(ns,g)
        captured={r['name']:r for r in self.runtime['runtimeFunctions']}
        assert set(captured)=={n.name for n in defs}
        original=g['apply'].__closure__[0].cell_contents
        for name,r in captured.items():
            binding=g[name];fn=original if name=='apply'else binding
            assert id(binding)==r['bindingIdentity']and id(fn)==r['resolvedOriginalIdentity']and fn.__globals__ is g
            assert self.tools['description'](fn.__code__)==r['runtimeCode'],('Actual runtime function changed',name)
        self.validation_calls.append('all captured actual code bytes/constants/flags/locations/full marshal exact')
        return True

    def compare(self,left,right,left_sha=None,right_sha=None):
        left=Path(left);right=Path(right);lh=sha(left);rh=sha(right)
        assert (left_sha is None or lh==left_sha)and(right_sha is None or rh==right_sha)
        if lh==rh:
            return {'left':str(left),'right':str(right),'leftSha256':lh,'rightSha256':rh,'byteExact':True,
                'comparisonMethod':'exact complete JPEG bytes','decodedRgbComparisonPerformed':False,'zeroDifferenceEstablishedByByteEquality':True,'allowedDifference':0,'pass':True}
        assert sha(COMPARE)==COMPARE_SHA and PYTHON.is_file()
        child=subprocess.run([str(PYTHON),str(COMPARE),'--left',str(left),'--left-sha256',lh,
            '--right',str(right),'--right-sha256',rh],capture_output=True,text=True,check=False)
        assert child.returncode in(0,2),('Independent RGB comparator failed',child.returncode,child.stderr)
        result=json.loads(child.stdout);assert result['leftSha256']==lh and result['rightSha256']==rh
        result.update(comparisonMethod='explicit independently decoded RGB maximum-channel-difference comparison',
            decodedRgbComparisonPerformed=True,comparatorSha256=COMPARE_SHA,
            pass_=result['decodedRgbExact']is True and result['maximumAbsoluteChannelDifference']==0)
        result['pass']=result.pop('pass_');assert result['pass']==(child.returncode==0)
        assert sha(left)==lh and sha(right)==rh
        return result

    def control18(self):
        self.verify_namespace(self.ns,self.g)
        g=self.g;d=g['d'];bpy=g['bpy'];scene=d.SC;oldscene=bpy.context.window.scene;oldlayer=bpy.context.window.view_layer
        data=read(BASE/'composite-provenance.json');poses=read(BASE/'blender/delivered-camera-poses.json')['poses']
        before_inventory=self.private['inventory'](BASE/'blender/desk');proofs={r['frame']:r for r in self.headers['rows']}
        controls=self.out/'before-controls';assert not os.path.lexists(controls)
        bpy.context.view_layer.update();bpy.context.window.scene=scene;bpy.context.view_layer.update()
        tx=None;report={'mode':'separate before-controls','frames':ALL,'raw':str(controls),'actualImages':[],
            'comparisonRows':[],'controlSettings':{'resolution':[1080,1920,100],'jpegQuality':92,'taaRenderSamples':16},
            'pixelTolerance':0,'all18ByteOrDecodedRgbExact':False,'probeDeliveryImagesNotClaimedHere':True,'finalAcceptance':False}
        self.control_report=report
        try:
            tx=self.private['SceneTransaction'](g,oldscene,oldlayer)
            controls.mkdir(parents=True)
            scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100
            scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=92;scene.eevee.taa_render_samples=16
            assert scene.render.engine=='BLENDER_EEVEE'and scene.view_settings.view_transform=='Standard'and scene.view_settings.look=='None'
            for j in ALL:
                old=data['records'][j];evidence=proofs[j];assert old['source']==evidence['source']and old['sha256']==evidence['sourceSha256']
                ref=old['originalObjectSourceFrame'];assert ref==evidence['otherObjectSourceFrame']and poses[j]==evidence['pose']
                g['apply'](ref/30);g['pose_b1'](poses[j]);bpy.context.view_layer.update()
                file=controls/('%05d.jpg'%j);assert not os.path.lexists(file);scene.render.filepath=str(file)
                bpy.ops.render.render(write_still=True,scene=scene.name)
                assert file.is_file()and not file.is_symlink()and file.stat().st_size>1000
                h=sha(file);comparison=self.compare(old['source'],file,old['sha256'],h)
                report['actualImages'].append({'frame':j,'path':str(file),'sha256':h,'source':old['source'],'sourceSha256':old['sha256'],'otherObjectSourceFrame':ref,'pose':poses[j],'actuallyViewed':False})
                report['comparisonRows'].append({'frame':j,**comparison})
                assert comparison['pass'],('Before-control pixels differ; no waiver/no probe',j,comparison)
                print('B7 before-control exact',j,comparison['comparisonMethod'],flush=True)
            report['all18ByteOrDecodedRgbExact']=len(report['comparisonRows'])==18 and all(r['pass']for r in report['comparisonRows'])
        except BaseException as error:
            report['error']={'type':type(error).__name__,'message':str(error)};raise
        finally:
            checks={};offenders=[];cleanup=None
            try:
                if tx is not None:checks,offenders=tx.close()
            except BaseException as error:cleanup={'type':type(error).__name__,'message':str(error)}
            finally:
                bpy.context.window.scene=oldscene;bpy.context.window.view_layer=oldlayer;bpy.context.view_layer.update()
            checks['all10700BaseRawStatAndPathsUnchanged']=self.private['inventory'](BASE/'blender/desk')==before_inventory
            checks['all18OriginalSourceJpegSHAUnchanged']=all(sha(r['source'])==r['sourceSha256']for r in self.headers['rows'])
            checks['noRuntimeOrSnapshotRebinding']=self.tools['bindings'](g)==self.initial_bindings and self.tools['bindings'](self.ns)==self.initial_snapshot_bindings
            report.update(protectionChecks=checks,restorationOffenders=offenders,cleanupError=cleanup)
            self.verify_pins();write_new(self.out/'before-controls.json',report)
            assert tx is not None and not cleanup and not offenders and checks and all(checks.values()),('Control strict cleanup failed',checks,cleanup,offenders)
        assert report['all18ByteOrDecodedRgbExact']and not report.get('error')
        self.control_report=report

    def metadata(self):
        return {'adapter':str(Path(__file__).resolve()),'actualAdapterSha256':self.adapter_sha,'originalGeometryHelper':str(ORIGINAL),
            'originalGeometryHelperSha256':ORIGINAL_SHA,'originalReportHelperShaMeansGeometrySourceNotActualAdapter':True,
            'actualRuntimeDiagnostic':str(RUNTIME),'actualRuntimeDiagnosticSha256':self.runtime_sha,'initialDiagnosticSha256':INITIAL_SHA,
            'actualRuntimeSemanticDigest':self.runtime['runtimeFunctionSemanticDigest'],'actualRuntimeMarshalDigest':self.runtime['runtimeFunctionMarshalDigest'],
            'sourceQuantizationProof':str(HEADERS),'sourceQuantizationProofSha256':HEADERS_SHA,'threeExactSourceBoundaries':[{'before':a,'after':b}for a,b in BOUNDARIES],
            'onlyThreeDeclaredSourceBoundariesChanged':True,'inverseByteExactToOriginal':True,'privateDerivedSourceSha256':self.derived_sha,
            'privateOriginalPINSExplicitlyExtendedBy':self.added_pins,'guardedApplyNeverUnwrappedForCallsOrRebound':True,
            'actualOriginal18ProbeScopeUnchanged':True,'controlScopeSeparate':True,'controlImagesRendered':len(self.control_report['actualImages'])if self.control_report is not None else 0,
            'all18ControlImageComparisonsPass':self.control_report is not None and self.control_report['all18ByteOrDecodedRgbExact'],
            'controlReport':str(self.out/'before-controls.json')if self.control_report is not None else None,
            'controlReportSha256':sha(self.out/'before-controls.json')if(self.out/'before-controls.json').is_file()else None,
            'controlReportWritten':(self.out/'before-controls.json').is_file(),
            'context2Comparisons':self.context_comparisons,'allContext2BeforeAfterExact':len(self.context_comparisons)==2 and all(x['pass']for x in self.context_comparisons),
            'validationCalls':self.validation_calls,'geometryTimeLimitsAndOriginalProtectionCodeUnchanged':True,
            'oldCurrentWholeSourceASTClaimNotApplicableToMixedRuntime':True,
            'privateGlobalExtensionsExplicit':['_compat exact-pin object','write output-metadata hook','PINS strict superset only'],
            'finalAcceptance':False}

    def write_report(self,path,report):
        assert Path(path)==self.originalReport and report['helperSha256']==ORIGINAL_SHA
        successful=self.mode=='probe'and not report.get('error')and not report.get('cleanupError')and len(report['actualImages'])==18
        if successful:
            assert self.control_report is not None and self.control_report['all18ByteOrDecodedRgbExact']
            controls={r['frame']:r for r in self.control_report['actualImages']};actual={r['frame']:r for r in report['actualImages']}
            self.context_comparisons=[{'frame':j,**self.compare(controls[j]['path'],actual[j]['path'],controls[j]['sha256'],actual[j]['sha256'])}for j in CONTEXT]
            report['protectionChecks']['actualContext2ImagesEqualBeforeControlsAtZeroTolerance']=all(x['pass']for x in self.context_comparisons)
        self.verify_pins();metadata=self.metadata()
        write_new(self.sidecar,metadata)
        report['namespaceCompatibility']={**metadata,'sidecar':str(self.sidecar),'sidecarSha256':sha(self.sidecar)}
        report['originalGeometryHelperSha256']=ORIGINAL_SHA
        assert all(report['protectedInputSha256'].get(k)==v for k,v in self.added_pins.items())
        self.original_write(path,report)

def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,runtime_report_sha256):
    assert authorized is True and mode in('audit','probe')and validsha(expected_adapter_sha256)and validsha(runtime_report_sha256)
    assert sha(__file__)==expected_adapter_sha256 and sha(RUNTIME)==runtime_report_sha256
    assert not os.path.lexists(ROOT/mode)and not ROOT.is_symlink(),'Never overwrite any compatibility attempt'
    for p,h in[(ORIGINAL,ORIGINAL_SHA),(TOOLS,TOOLS_SHA),(INITIAL,INITIAL_SHA),(HEADERS,HEADERS_SHA),(COMPARE,COMPARE_SHA)]:assert sha(p)==h,p
    text=adapt_text();private={'__name__':'_root_b7_three_boundary_private','__file__':str(ORIGINAL)}
    exec(compile(text,str(ORIGINAL)+' [explicit three-boundary adapter]','exec'),private)
    compat=Compatibility(ns,mode,expected_adapter_sha256,runtime_report_sha256,private,text)
    private['_compat']=compat;private['PINS'].update({Path(p):h for p,h in compat.added_pins.items()});private['write']=compat.write_report
    # Verify the unchanged geometry helper's complete pins and prepared guards
    # before the first control render, not only later inside its original run.
    private['verify'](private['PINS'])
    prepared=read(BASE/'prepared.json')
    private['verify'](prepared['protectedInputSha256'])
    private['verify']({str(BASE/p):h for p,h in prepared['outputHashes'].items()})
    # Do not swap/unwrap/rebind guarded apply or any actual episode function.
    defs=[n for n in ast.parse(private['STAGE'].read_text()).body if isinstance(n,ast.FunctionDef)]
    compat.verify_functions(ns,compat.g,defs)
    try:
        if mode=='probe':compat.control18()
        result=private['run'](ns,authorized=True,mode=mode,expected_helper_sha256=ORIGINAL_SHA)
        assert result['namespaceCompatibility']['actualAdapterSha256']==expected_adapter_sha256
        compat.verify_pins();assert compat.tools['bindings'](compat.g)==compat.initial_bindings and compat.tools['bindings'](ns)==compat.initial_snapshot_bindings
        if mode=='probe':assert result['namespaceCompatibility']['all18ControlImageComparisonsPass']and result['namespaceCompatibility']['allContext2BeforeAfterExact']
        write_new(ROOT/mode/'completion.json',{'actualAdapterSha256':expected_adapter_sha256,'originalGeometryHelperSha256':ORIGINAL_SHA,
            'runtimeReportSha256':runtime_report_sha256,'originalReport':str(compat.originalReport),'originalReportSha256':sha(compat.originalReport),
            'compatibilitySidecar':str(compat.sidecar),'compatibilitySidecarSha256':sha(compat.sidecar),'mode':mode,
            'control18Verified':mode=='probe','context2Verified':mode=='probe','originalNumericGuardsSucceeded':result['allGuardedStatesPass'],
            'originalActualProbeImageCount':len(result['actualImages']),'finalAcceptance':False})
        return result
    except BaseException as error:
        failure=ROOT/mode/'failure.json'
        if not os.path.lexists(failure):write_new(failure,{'error':{'type':type(error).__name__,'message':str(error)},'namespaceCompatibility':compat.metadata(),'finalAcceptance':False})
        raise
