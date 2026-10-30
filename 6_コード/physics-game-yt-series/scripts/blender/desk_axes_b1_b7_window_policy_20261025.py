"""Root-only NEW B7 controls policy; old0RGB NG and all prior sources retained.

Only the explicitly approved background window rectangle may differ by2/500px.
All explanatory/non-window RGB remains exact. This is NOT an original quality
gate exemption and does not alter any geometry/restoration1e-9 threshold.
Fresh audit first, then fresh18before-controls and18actual repair/context images.
"""
import ast
import hashlib
import json
from pathlib import Path
import subprocess

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
RECOVERY=W/'scripts/blender/desk_axes_b1_b7_cache_recovery_20261025.py'
RECOVERY_SHA='37e6db84e45e544a68175eb8979734a2c63a7ef6928de5bc0ee5e1498e257efc'
POLICY=W/'outputs/axes-20261023/root-b1-window-only-control-policy-20261025.json'
POLICY_SHA='33bb141baf253c1d501e5ce63b9298201996b4ff4efff4ddf5d05e8f10809f5b'
COMPARATOR=W/'scripts/umech/compare-b1-b7-window-policy-20261025.py'
COMPARATOR_SHA='4fe4e2d51abccbfc884512c776b72b1ab2e147822bcbfd0f04b72dbb40db502b'
OLD_FAILURE=Path('/private/tmp/ys/ys-chain-b1v1-b7-cache-recovery-20261025/probe/before-controls.json')
OLD_FAILURE_SHA='de102ba011751c5c391df15f305fbd4d9fd4bfd9b964ecc730ee52db901a1a7d'
PYTHON=Path('/Users/ken/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3')
EXTRA={RECOVERY:RECOVERY_SHA,POLICY:POLICY_SHA,COMPARATOR:COMPARATOR_SHA,OLD_FAILURE:OLD_FAILURE_SHA}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def jsha(x):return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(',',':'),allow_nan=False).encode()).hexdigest()
def verify():
    for p,h in EXTRA.items():assert sha(p)==h,p
def change(text,before,after,count=1):
    assert text.count(before)==count,('Nonunique declared policy boundary',before[:90],text.count(before))
    result=text.replace(before,after)
    assert result.count(after)==count and result.replace(after,before)==text,'Exact inverse required'
    return result

# Exact ea40 private-body boundaries, in addition to37e's declared fresh ROOT.
POLICY_COMPAT_BOUNDARIES=[
 ('all18ByteOrDecodedRgbExact','all18ControlsExactPrincipalOrApprovedBackgroundOnly',5),
 ('all18ControlImageComparisonsPass','all18ExactPrincipalOrApprovedBackgroundOnly',2),
 ('allContext2BeforeAfterExact','allContext2ExactPrincipalOrApprovedBackgroundOnly',2),
 ('actualContext2ImagesEqualBeforeControlsAtZeroTolerance','actualContext2PrincipalExactOrApprovedWindowOnly',1),
 ("'control18Verified':mode=='probe','context2Verified':mode=='probe'",
  "'all18ControlsPassedApprovedWindowPolicy':mode=='probe','context2PassedApprovedWindowPolicy':mode=='probe'",1),
 ("                g['apply'](ref/30);g['pose_b1'](poses[j]);bpy.context.view_layer.update()\n                file=controls/('%05d.jpg'%j)",
  "                g['apply'](ref/30);g['pose_b1'](poses[j]);bpy.context.view_layer.update()\n                self.policy.before_control(self,j,ref,poses[j])\n                file=controls/('%05d.jpg'%j)",1),
 ("                h=sha(file);comparison=self.compare(old['source'],file,old['sha256'],h)",
  "                self.policy.after_control(self,j)\n                h=sha(file);comparison=self.compare(old['source'],file,old['sha256'],h)",1)]

class WindowPolicy:
    def __init__(self,retained_compare,recovery,source_proof):
        verify();self.retained_compare=retained_compare;self.recovery=recovery;self.source_proof=source_proof;self.comparisons=[];self.states=[];self.pending={}
        policy=json.loads(POLICY.read_text())
        assert policy['supplementalControlPolicyAuthorized']is True and policy['bothFullResolutionImagesPersonallyViewed']is True
        assert policy['permittedBackgroundRectangleInclusive']==[888,0,920,109]
        assert policy['maximumBackgroundChannelDelta']==2 and policy['maximumChangedBackgroundPixels']==500
        assert policy['exactPrincipalAndCriticalRgbRequired']and policy['all18NewProbeImagesRequireSeparateRootEyeApproval']
    def compare(self,owner,left,right,left_sha=None,right_sha=None):
        verify();original=self.retained_compare(owner,left,right,left_sha,right_sha)
        # Preserve that result's original pass/decodedRgbExact unchanged.
        lh,rh=sha(left),sha(right)
        child=subprocess.run([str(PYTHON),str(COMPARATOR),'--left',str(left),'--right',str(right),
            '--left-sha256',lh,'--right-sha256',rh],capture_output=True,text=True,check=False)
        assert child.returncode in(0,2),('CPU policy comparator error',child.returncode,child.stderr)
        result=json.loads(child.stdout)
        assert result['leftSha256']==lh and result['rightSha256']==rh
        assert result['originalFullImageZeroDifferencePass']==original['pass']
        assert result['pass']==(child.returncode==0)
        result['originalZeroDifferenceComparisonUnchanged']=original
        result['actualApprovedPolicyComparatorSha256']=COMPARATOR_SHA
        self.comparisons.append(result);verify();return result
    def capture(self,owner):
        g=owner.g;bpy=g['bpy'];scene=g['d'].SC;layer=bpy.context.window.view_layer
        assert bpy.context.window.scene.as_pointer()==scene.as_pointer()
        tools=self.recovery.tools;transform=self.recovery.original['transform']
        objects=list(scene.objects)
        channels={o.name:tools['object_channels'](o,transform,layer)for o in objects}
        visibleworld={o.name:tools['flat'](o.matrix_world)for o in objects if not o.hide_render}
        sockets=[]
        for kind,owners in [('material',bpy.data.materials),('world',bpy.data.worlds)]:
            for material in owners:
                for socket,value,node,index in self.recovery.original['sockets'](material.node_tree):
                    sockets.append([kind,material.as_pointer(),node,index,value])
        lights={ld.name:{'pointer':ld.as_pointer(),'energy':ld.energy,'color':list(ld.color),'type':ld.type}for ld in bpy.data.lights}
        camera=g['d'].CAM_D
        return {'channels':channels,'visibleWorld':visibleworld,'nodeInputs':sockets,'lights':lights,
            'camera':{'objectWorld':tools['flat'](g['d'].CAM.matrix_world),'dataPointer':camera.as_pointer(),
                'lens':camera.lens,'orthoScale':camera.ortho_scale,'type':camera.type,'focus':camera.dof.focus_distance,'aperture':camera.dof.aperture_fstop},
            'scenePointer':scene.as_pointer(),'viewLayerPointer':layer.as_pointer(),'frame':scene.frame_current,'subframe':scene.frame_subframe}
    def before_control(self,owner,j,ref,pose):
        assert j not in self.pending and j==ref
        self.pending[j]=(self.capture(owner),list(pose))
    def after_control(self,owner,j):
        before,pose=self.pending.pop(j);after=self.capture(owner)
        channels=before['channels']==after['channels'];nodes=before['nodeInputs']==after['nodeInputs'];lights=before['lights']==after['lights']
        camera=before['camera']==after['camera'];context=all(before[k]==after[k]for k in('scenePointer','viewLayerPointer','frame','subframe'))
        assert set(before['visibleWorld'])==set(after['visibleWorld'])
        world_delta=max((max(abs(a-b)for a,b in zip(v,after['visibleWorld'][name]))for name,v in before['visibleWorld'].items()),default=0.)
        row={'frame':j,'otherObjectSourceFrame':j,'pose':pose,'beforeInputStateSha256':jsha(before),'afterInputStateSha256':jsha(after),
            'allAuthoritativeObjectChannelsConstraintsVisibilityPointersUnchanged':channels,
            'allMaterialWorldNodeInputsUnchanged':nodes,'allLightEnergyColorTypeAndPointersUnchanged':lights,
            'actualCameraPoseAndDataUnchanged':camera,'sceneLayerFrameUnchanged':context,
            'visibleObjectCount':len(before['visibleWorld']),'visibleActualWorldMaximumDifference':world_delta,
            'originalActualWorldToleranceUnchanged':1e-9,'pass':channels and nodes and lights and camera and context and world_delta<=1e-9}
        self.states.append(row);assert row['pass'],('A before-control render changed actual state',row)
    def metadata(self):
        return {'rootPolicy':str(POLICY),'rootPolicySha256':POLICY_SHA,'comparator':str(COMPARATOR),'comparatorSha256':COMPARATOR_SHA,
            'exactPrivateSourceBoundaryProof':self.source_proof,
            'oldActual119bZeroDifferenceNG':str(OLD_FAILURE),'oldActual119bZeroDifferenceNGSha256':OLD_FAILURE_SHA,
            'originalFullImageZeroDifferenceCriterionRetainedAsSeparateResults':True,
            'fullImageRgbExactMustNotBeInferredFromPolicyPass':True,
            'approvedBackgroundRectangleInclusive':[888,0,920,109],'maximumChangedBackgroundPixels':500,'maximumBackgroundChannelDifference':2,
            'allOtherRgbMustBeExactlyEqual':True,'all18RootActualProbeEyesStillRequired':True,
            'controlStateProofs':self.states,'limitedComparisonStatistics':self.comparisons,'fullPixelEnumeration':False,
            'original7And7bAndGeometryAndRestorationThresholdsUnchanged':True,'finalAcceptance':False}

def build():
    verify();text=RECOVERY.read_text();boundaries=[]
    def replace(before,after,count=1):
        nonlocal text
        text=change(text,before,after,count);boundaries.append((before,after,count))
    replace('/private/tmp/ys/ys-chain-b1v1-b7-cache-recovery-20261025','/private/tmp/ys/ys-chain-b1v1-b7-window-policy-20261025',2)
    replace('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-cache-recovered-20261025','/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-window-policy-20261025',2)
    replace('body=replace_exact(source,[COMPAT_BOUNDARY])','body=_POLICY_ADAPT_COMPAT(replace_exact(source,[COMPAT_BOUNDARY]))')
    replace("            self.added_pins.update({str(p):h for p,h in EXTRA_PINS.items()})",
        "            self.added_pins.update({str(p):h for p,h in EXTRA_PINS.items()})\n            self.added_pins.update(_POLICY_EXTRA_PINS)\n            self.policy=_POLICY_TYPE(base_class.compare,recovery,_POLICY_SOURCE_PROOF)")
    replace('        def metadata(self):\n            result=super().metadata()',
        '        def compare(self,*args,**kwargs):\n            return self.policy.compare(self,*args,**kwargs)\n        def metadata(self):\n            result=super().metadata()\n            result[\'supplementalWindowControlPolicy\']=self.policy.metadata()\n            result[\'originalAll18FullImageRgbExact\']=self.control_report is not None and len(self.control_report[\'comparisonRows\'])==18 and all(x[\'originalFullImageZeroDifferencePass\']for x in self.control_report[\'comparisonRows\'])')
    inverse=text
    for before,after,count in reversed(boundaries):
        assert inverse.count(after)==count;inverse=inverse.replace(after,before)
    assert inverse==RECOVERY.read_text();ast.parse(text)
    def adapt_compat(body):
        for before,after,count in POLICY_COMPAT_BOUNDARIES:body=change(body,before,after,count)
        ast.parse(body);return body
    proof={'actualAdapter':str(Path(__file__).resolve()),'actualAdapterSha256':sha(__file__),
        'retainedCacheRecoveryAdapter':str(RECOVERY),'retainedCacheRecoveryAdapterSha256':RECOVERY_SHA,
        'fiveRecoveryWrapperBoundaries':[{'before':a,'after':b,'count':n}for a,b,n in boundaries],
        'sevenRetainedCompatibilityPolicyBoundaries':[{'before':a,'after':b,'count':n}for a,b,n in POLICY_COMPAT_BOUNDARIES],
        'allBoundaryGroupsUniqueAndInverseByteExact':True,'privateCacheRecoverySourceSha256':hashlib.sha256(text.encode()).hexdigest(),
        'originalGeometryDerivationBoundariesAndOneEMinus9ComparisonsUnchanged':True}
    scope={'__name__':'_root_b7_window_policy_private','__file__':str(Path(__file__).resolve()),
        '_POLICY_ADAPT_COMPAT':adapt_compat,'_POLICY_EXTRA_PINS':{str(p):h for p,h in EXTRA.items()},'_POLICY_TYPE':WindowPolicy,'_POLICY_SOURCE_PROOF':proof}
    exec(compile(text,str(RECOVERY)+' [private explicit window-policy]','exec'),scope)
    return scope,boundaries

def run(ns,authorized=False,mode='audit',*,expected_adapter_sha256,approved_audit_sha256=None):
    assert authorized is True and sha(__file__)==expected_adapter_sha256
    scope,boundaries=build()
    # Metadata keeps full old results plus explicit policy and boundaries;
    # the retained recovery still enforces fresh audit before any probe.
    result=scope['run'](ns,authorized=True,mode=mode,expected_adapter_sha256=expected_adapter_sha256,
        approved_audit_sha256=approved_audit_sha256)
    verify();assert result['namespaceCompatibility']['actualAdapterSha256']==expected_adapter_sha256
    return result
