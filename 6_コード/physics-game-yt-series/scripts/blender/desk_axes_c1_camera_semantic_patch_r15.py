"""C-only r15: exact camera-entry and confirmed semantic-hold corrections.

Root calls patch(nsC1); this file never starts or submits a GPU job itself.
The unsuccessful r14 source/output evidence is preserved byte-for-byte.
Only four confirmed semantic-state omissions are re-mapped; object formulas,
supplied data, narration, captions, approved face and domino times stay fixed.
"""
import hashlib,runpy
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=W/'scripts/blender/desk_axes_c1_camera_patch_20261024.py'
SEMANTIC=W/'scripts/umech/desk-c1v1-semantic-hold-audit.py'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def patch(ns,dry_run=False):
    assert sha(BASE)=='560991b3a71e02071ae30eac24b2f2ddcf54ff5a8fb8f6a57a8fe704ec97e200'
    assert sha(SEMANTIC)=='36164ec6b55c90cc45d676f0833e6c074015068412960341b181c6cc7a111d80'
    g=ns['main'].__globals__
    semantic=runpy.run_path(str(SEMANTIC))['audit'](g)
    confirmed={'gear:box':{'M1.drop.z','M1.lid.x'},'gear:27':{'hand'},'hard:judge':{'hand'},'arm:store':{'hand'}}
    assert len(semantic['semanticCorrections'])==586
    assert all(r['cue'] in confirmed and set(r['changedSemanticFields'])<=confirmed[r['cue']] for r in semantic['semanticCorrections'])
    source=BASE.read_text()
    def replace(a,b):
        nonlocal source
        assert source.count(a)==1,('Unexpected pinned source',a)
        source=source.replace(a,b)
    replace("FINAL=Path('/private/tmp/ys/ys-chain-c1v1-camera-final-20261024')","FINAL=Path('/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r15')")
    replace("frozen={**prod['sourceSha256'],**prod['immutableInputSha256']}","frozen={**prod['sourceSha256'],**prod['immutableInputSha256'],**PATCH_DEPENDENCIES}")
    replace("ranges.append({'cue':key,'start':c['start'],'end':c['start']+duration,'duration':duration,'targetPose':list(c['pose'])})", """pose=list(c['pose'])
        # The fixed row11 composition contains the complete actual .22m drop.
        # The erroneous old static hold is corrected separately, not disguised
        # by a camera move. Keep this one pose through the entire box cue.
        if key=='gear:box':pose[2]=.10;pose[3]=1.17
        end=g['S']('gear:dial') if key=='gear:box' else c['start']+duration
        ranges.append({'cue':key,'start':c['start'],'end':end,'moveEnd':c['start']+duration,'duration':duration,'targetPose':pose})""")
    replace("p=list(r['targetPose']);u=d.seg(t,r['start'],r['end']);p[3]*=1.1-.1*u", """p=list(r['targetPose']);u=d.seg(t,r['start'],r['moveEnd'])
        # Original M2 really grows .588→1 while rising. A ten-percent approach
        # would exaggerate that growth. Preserve its formula and frame it with
        # a gentle pull-back for the pair, or a 4% approach for all five wheels.
        initial=.85 if r['cue']=='carry:simple' else 1.04 if r['cue'] in {'hard:9999','arm:wait','ch:intro','gear:box'} else 1.1
        p[3]*=initial+(1-initial)*u""")
    replace("assert len(seen)==prod['uniqueStates']==4317\n    changed_sources=", """assert len(seen)==prod['uniqueStates']==4317
    assert plans==SEMANTIC_RESULT['oldMap']
    original_plans=plans[:];plans=SEMANTIC_RESULT['semanticMap']
    semantic_changed={r['frame'] for r in SEMANTIC_RESULT['semanticCorrections']}
    semantic_sources={plans[j] for j in semantic_changed}
    changed_sources=""")
    replace("changed_sources={ref for ref in plans if corrected_pose(ref/30)!=original_pose(ref/30)}", "changed_sources={ref for ref in plans if corrected_pose(ref/30)!=original_pose(ref/30)}|semantic_sources")
    replace("guard=ROOT/'c1-camera-r14-preflight.json'", "guard=ROOT/'c1-camera-semantic-r15-preflight.json'")
    replace("'cameraOnly':True,'ranges':ranges", "'cameraOnly':False,'cameraAndConfirmedSemanticHoldCorrectionOnly':True,'semanticCorrections':SEMANTIC_RESULT['semanticCorrections'],'ranges':ranges")
    replace("'revision':'r14-camera-only'", "'revision':'r15-camera-and-confirmed-semantic-holds'")
    replace("'patchSourceSha256':sha(__file__),'cameraOnly'","'patchSourceSha256':sha(__file__),'patchDependencySha256':PATCH_DEPENDENCIES,'cameraOnly'")
    replace("'patchFrameToUnchangedObjectSourceFrame':{j:plans[j] for j in frames}", "'patchFrameToSemanticObjectSourceFrame':{j:plans[j] for j in frames},'semanticCorrections':SEMANTIC_RESULT['semanticCorrections'],'originalHeldSourceMap':original_plans,'deliveredSemanticSourceMap':plans")
    replace("'cameraOnly':True,'allPatchJpegsActuallyRendered'", "'cameraOnly':False,'cameraAndConfirmedSemanticHoldCorrectionOnly':True,'originalObjectFormulaUnchanged':True,'objectSourceTimesChangedOnlyAsExplicitlyListed':True,'allPatchJpegsActuallyRendered'")
    replace("'method':'Exact delivered held-source poses; cuts count as movement; only listed inter-site entrances use cut plus ten-percent approach'", "'method':'Exact delivered semantic held-source poses; cuts count as movement; listed incoming sites cut to the framed target with original-duration approach, except pair rise uses a gentle pull-back and whole-M2 uses 4% approach; row11 fixed pose spans the real drop'")
    replace("'method':'Exact delivered held-source state and patched camera; same named subjects as original721 audit; no geometry inflation'", "'method':'Exact delivered semantic held-source state and corrected camera; 586 explicitly listed output holds differ from erroneous originals; same named subjects as original721 audit; no geometry inflation'")
    compile(source,str(Path(__file__).resolve()),'exec')
    if dry_run:return {'compiled':True,'originalUnique':semantic['oldUnique'],'semanticOutputCorrections':len(semantic['semanticCorrections']),'newSemanticSources':sorted({r['newSemanticFrame'] for r in semantic['semanticCorrections']}),'source':source}
    private={'__file__':str(Path(__file__).resolve()),'__name__':'c1_r15_private','SEMANTIC_RESULT':semantic,'PATCH_DEPENDENCIES':{str(p):sha(p) for p in [BASE,SEMANTIC,Path(__file__)]}}
    exec(compile(source,str(Path(__file__).resolve()),'exec'),private)
    return private['patch'](ns)
