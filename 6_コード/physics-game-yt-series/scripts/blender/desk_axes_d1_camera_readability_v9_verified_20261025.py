"""Root-only transparent v9 adapter: explicit post-close DOF1e-9 proof.

The read/pinned7a9 v9 remains immutable. No restoration formula, camera pose,
focus policy, quality threshold or pixel code changes. Private constructors
only observe their saved entry DOF; the final writer checks original close's
actual result and adds one strict guard to the same checked report dictionary.
"""
import hashlib
from pathlib import Path
import runpy

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_d1_camera_readability_v9_20261025.py'
ORIGINAL_SHA='7a9caa4056b9ea6a2987ff06d8f795e9ad71a5af1b5c58bcd6e77af94ce7875a'
BASE=W/'scripts/blender/desk_axes_d1_verified_v5_adapters_20261025.py'
BASE_SHA='f518e79055a897c63d2c5a089abad0d6f8725926f9ab7032ba92d0795e81f464'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025')

STRICT_WRITER="""    original_runtime=scope['_runtime'];original_write=scope['_write'];instances=[]
    def dof_observed_runtime(protected,images_writer=None):
        proxy=original_runtime(protected,images_writer);original_path=proxy.run_path
        def observed_path(path,*args,**kwargs):
            result=original_path(path,*args,**kwargs)
            if Path(path).resolve()==scope['RECOVERY']:
                parent=result['DeliveredReplay']
                class DofObserved(parent):
                    def __init__(self,*a,**kw):super().__init__(*a,**kw);instances.append(self)
                return{**result,'DeliveredReplay':DofObserved}
            return result
        return types.SimpleNamespace(run_path=observed_path)
    def dof_verified_writer(root,p,x,proof):
        proof['dofRestorationGuardAdapter']=RESTORATION_GUARD_METADATA
        if Path(p).name=='report.json':
            evidence=[]
            for ctx in instances:
                entry=dict(ctx.dof);after={k:getattr(ctx.d.CAM_D.dof,k)for k in entry};deltas={}
                for key,value in entry.items():
                    deltas[key]=(0. if after[key]is value else 1.)if isinstance(value,bool)else abs(float(after[key])-float(value))
                evidence.append({'entry':entry,'afterOriginalClose':after,'absoluteDifferences':deltas,'originalCloseCompleted':ctx.closed,'toleranceUnchanged':1e-9,'pass':bool(ctx.closed)and all(v<=1e-9 for v in deltas.values()),'restorationSettersAdded':0})
            passed=bool(instances)and len(evidence)==len(instances)and all(r['pass']for r in evidence)
            x['entryDofRestorationEvidence']=evidence;x['entryDofRestorationPassed']=passed
            x.setdefault('protectionChecks',{})['allEntryDofScalarsExplicitlyVerifiedAt1eMinus9']=passed
        return original_write(root,p,x,proof)
    scope['_runtime']=dof_observed_runtime;scope['_write']=dof_verified_writer
"""

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def run_camera(ns,authorized=False,mode='audit',**kwargs):
    assert authorized is True and mode in('audit','probe','render')
    pins={str(ORIGINAL):ORIGINAL_SHA,str(BASE):BASE_SHA,str(Path(__file__).resolve()):sha(__file__)}
    for p,h in pins.items():assert sha(p)==h,p
    original=ORIGINAL.read_text();text=original;changes=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1; text=text.replace(a,b,1);changes.append((a,b))
    marker='    for p,h in pins.items():assert sha(p)==h,p\n    approved='
    replace(marker,'    pins.update(EXTRA_INPUTS)\n'+marker)
    marker="    scope['_proof']=proof"
    replace(marker,marker+'\n'+STRICT_WRITER.rstrip())
    inverse=text
    for a,b in reversed(changes):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original
    metadata={'source':str(ORIGINAL),'sourceSha256':ORIGINAL_SHA,'adapter':str(Path(__file__).resolve()),'adapterSha256':sha(__file__),'exactAdditionalBoundaries':len(changes),'inverseByteIdenticalTo7a9V9':True,'originalCloseAndRestorationSettersUnchanged':True,'postCloseDofTolerance':1e-9,'automaticPixelApproval':False}
    initial={'__name__':'d1_v9_dof_guard_private','__file__':str(ORIGINAL),'EXTRA_INPUTS':pins,'RESTORATION_GUARD_METADATA':metadata}
    exec(compile(text,str(ORIGINAL)+' [private post-close DOF verification]','exec'),initial)
    base=runpy.run_path(str(BASE));scope=base['_rebind']({'run':initial['run_camera']},{'OUT':OUT,'__file__':str(Path(__file__).resolve())})
    try:return scope['run_camera'](ns,authorized=True,mode=mode,**kwargs)
    finally:
        for p,h in pins.items():assert sha(p)==h,p
