"""Root-queued D1 r15 production, canonical desk_lib.main, isolated fresh cache.

runpy.run_path(..., init_globals={'nsD1': nsD1,
    'D1_PRODUCTION_AUTHORIZED': True, 'D1_RENDER_NOW': True})
Without D1_RENDER_NOW this validates/prepares only. Never starts a second GUI.
"""
import ast,hashlib,json,os,time,types
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
OLD=Path('/private/tmp/ys/ys-chain-d1v1-render')
PROD=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
EXPECTED={
 'scripts/blender/desk_d1v1.py':'004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2',
 'scripts/blender/desk_lib_d1.py':'742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923',
 'scripts/umech/desk-d1v1-overlay.mjs':'9e1105b7a0c4a077b9f4a9067a31760882398304460132ecb22b78ab50ad4a2f'}
VOICE='74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab'
DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,v):Path(p).write_text(json.dumps(v,ensure_ascii=False,indent=1))
def code_equivalent(a,b):
    # Serialization includes string-interning bookkeeping, so compare every
    # public non-callable code field recursively rather than marshal bytes.
    # This includes actual instructions, nested constants, names, flags, file,
    # line information and exception table, not just a source filename.
    if isinstance(a,types.CodeType) or isinstance(b,types.CodeType):
        if not isinstance(a,types.CodeType) or not isinstance(b,types.CodeType):return False
        fields=[n for n in dir(a) if n.startswith('co_') and not callable(getattr(a,n))]
        return all(hasattr(b,n) and code_equivalent(getattr(a,n),getattr(b,n)) for n in fields)
    if isinstance(a,tuple) or isinstance(b,tuple):
        return isinstance(a,tuple) and isinstance(b,tuple) and len(a)==len(b) and all(code_equivalent(x,y) for x,y in zip(a,b))
    return a==b
def protected_snapshot():
    paths=[]
    for folder in sorted(Path('/private/tmp/ys').glob('ys-chain-*')):
        if folder==PROD:continue
        for pattern in ['blender/**/meta.json','blender/**/trial-coverage*.json','blender/**/catalog*provenance.json']:
            paths.extend(folder.glob(pattern))
        for foldername in ['desk','probe1s-d1v1-r8','landmarks-d1v1-r15','catalog-d1v1-final-r15']:
            images=sorted((folder/'blender'/foldername).glob('*.jpg'))
            if images:paths.extend([images[0],images[-1]])
        # Other episodes' owned outputs may use revision-specific names.
        for child in sorted((folder/'blender').glob('*')):
            if child.is_dir():
                images=sorted(child.glob('*.jpg'))
                if images:paths.extend([images[0],images[-1]])
    return {str(p):{'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(set(paths)) if p.is_file()}

assert globals().get('D1_PRODUCTION_AUTHORIZED') is True,'Only root may authorize/queue D1 production'
assert 'nsD1' in globals(),'Existing final D1 namespace required; do not rebuild other scenes'
g=nsD1['main'].__globals__;bpy=g['bpy'];d=g['d'];out=PROD/'blender/desk'
assert d.SC.render.engine=='BLENDER_EEVEE','Approved r15 uses Eevee; do not silently change the renderer'
assert not PROD.is_symlink() and not (PROD/'blender').is_symlink() and not out.is_symlink(),'Production directories must not redirect old/other raw output'
if out.exists():assert all(not p.is_symlink() for p in out.rglob('*')),'Existing production output may not contain symlink targets'
for p,h in EXPECTED.items():assert sha(W/p)==h,('Frozen D1 source changed',p)
assert sha(OLD/'blender/data.json')==DATA and sha(OLD/'ys-chain-d1v1.voice.wav')==VOICE
assert g['DATA']==json.loads((OLD/'blender/data.json').read_text())
assert g['P']['can']['can'].get('printed_label') is True,'D1 final material-band patch is missing'
assert g['_VIS_QUEUE'] is None,'D1 visibility transaction is still active'
tree=ast.parse((W/'scripts/blender/desk_d1v1.py').read_text());compiled={}
names=['main','plan_d1','pose_at','set_camera','can_state','visible']
nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names]
exec(compile(ast.Module(body=nodes,type_ignores=[]),str(W/'scripts/blender/desk_d1v1.py'),'exec'),compiled)
for n in names:assert code_equivalent(g[n].__code__,compiled[n].__code__),('D1 runtime function is not the frozen r15 source',n)
libpath=W/'scripts/blender/desk_lib.py';libtree=ast.parse(libpath.read_text());canonical={}
exec(compile(ast.Module(body=[n for n in libtree.body if isinstance(n,ast.FunctionDef) and n.name=='main'],type_ignores=[]),str(libpath),'exec'),canonical)
assert code_equivalent(d.main.__code__,canonical['main'].__code__),'D1 must retain canonical shared main code'
review=json.loads((OLD/'d1-r15-viewfix-final-actual-review.json').read_text())
assert review['sourceSha256']==EXPECTED['scripts/blender/desk_d1v1.py'] and review['overlaySourceSha256']==EXPECTED['scripts/umech/desk-d1v1-overlay.mjs']
assert review['allListedActuallyViewed'] and len(review['rows'])==3
physical=json.loads((OLD/'d1-semantic-physical-r15.json').read_text());held=[r for r in physical['rows'] if not r['cameraTransition']]
assert physical['sourceSha256']==review['sourceSha256'] and len(held)==303 and all(r['pass'] for r in held)
audit=json.loads((OLD/'d1-source-audit-r15-plan-proof.json').read_text())
assert audit['sourceSha256']==review['sourceSha256'] and audit['fullFramePlanAudit']['movingFramesIncorrectlyDuplicated']==0
plans=[g['plan_d1'](j) for j in range(g['NF'])];rendered=[j for j,p in enumerate(plans) if p[0]=='render'];dups=[j for j,p in enumerate(plans) if p[0]=='dup']
assert g['NF']==12163 and len(rendered)==5070 and len(dups)==7093 and all(p[0] in ['render','dup'] for p in plans)
assert all(0<=plans[j][1]<j and plans[plans[j][1]][0]=='render' for j in dups)
for proof in audit['canCameraFramePlanProof']:
    assert proof['spanPresent'] and proof['incorrectDuplicates']==0
    assert all(plans[j][0]=='render' for j in range(proof['firstFrame'],proof['lastFrame']+1))
plan_sha=hashlib.sha256(json.dumps(plans,separators=(',',':')).encode()).hexdigest()
prepared={'episode':'D-1','revision':'r15-viewfix-final','sourceSha256':EXPECTED,'sourceCache':str(OLD),'productionCache':str(PROD),'output':str(out),'scene':d.SC.name,'renderer':d.SC.render.engine,'frames':g['NF'],'fps':30,'duration':g['DATA']['duration'],'renderFrames':len(rendered),'duplicateFrames':len(dups),'copyFromOtherEpisodeFrames':0,'planSha256':plan_sha,'canCameraFramePlanProof':audit['canCameraFramePlanProof'],'canonicalSharedMainCodeVerified':True,'canonicalSharedMainSourceSha256':sha(libpath),'privateExplicitSceneProxySourceSha256':sha(W/'scripts/blender/desk_render_axes.py'),'userApprovedSupplementScope':'Only scenes in which original 7b/sparse heuristic conflicts with measured real objects and actual visual review; keep every original NG. Not a global waiver. Final encoded gates and scene-by-scene evidence remain required.','productionStarted':False}
print(json.dumps(prepared,ensure_ascii=False),flush=True)
if globals().get('D1_RENDER_NOW') is True:
    started=PROD/'d1-production-started.json';finished=PROD/'d1-production-finished.json'
    if PROD.exists():
        assert globals().get('D1_PRODUCTION_RESUME') is True,'Preserve existing D1 production; explicit same-source resume required'
        previous=json.loads(started.read_text());assert previous['sourceSha256']==EXPECTED and previous['planSha256']==plan_sha
        if finished.exists():raise RuntimeError('D1 production already complete; preserve it')
        if (out/'meta.json').exists():
            meta=json.loads((out/'meta.json').read_text());assert all((out/('%05d.jpg'%j)).is_file() and (out/('%05d.jpg'%j)).stat().st_size>1000 for j in meta.get('done',[]))
    else:
        (PROD/'blender').mkdir(parents=True)
        for f in ['plan.json','ys-chain-d1v1.json','phrase-times.json','ys-chain-d1v1.voice.wav','ys-chain-d1v1.wav','ys-chain-d1v1.mix.json']:
            src=OLD/f;assert src.is_file();(PROD/f).symlink_to(src)
        (PROD/'blender/data.json').symlink_to(OLD/'blender/data.json')
        if (OLD/'blender/tex').exists():(PROD/'blender/tex').symlink_to(OLD/'blender/tex',target_is_directory=True)
        dump(started,{**prepared,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'startedUnix':time.time(),'productionStarted':True})
    before=protected_snapshot();dump(PROD/'d1-protected-before.json',before)
    A=g['A'];A.cache=str(PROD);A.out=str(out);A.times=None;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16;A.anchors_only=False
    bpy.context.window.scene=d.SC;assert bpy.context.scene is d.SC
    d.SC.render.resolution_x=1080;d.SC.render.resolution_y=1920;d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=16;d.SC.render.image_settings.file_format='JPEG'
    print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 final production START: 5070 real renders, 7093 same-state clones',flush=True)
    clock=time.time();failure=None;invocation=PROD/('d1-production-invocation-%d.json'%time.time_ns())
    try:
        g['main']()
        assert bpy.context.scene is d.SC
        assert all((out/('%05d.jpg'%j)).is_file() and not (out/('%05d.jpg'%j)).is_symlink() and (out/('%05d.jpg'%j)).stat().st_size>1000 for j in range(g['NF'])),'D1 production has missing/empty/redirected JPEGs'
        meta=json.loads((out/'meta.json').read_text());anc=json.loads((out/'anchors.json').read_text())
        assert meta['frames']==anc['frames']==g['NF'] and meta['fps']==anc['fps']==30 and meta['key']==anc['key']
        assert set(meta['done'])==set(rendered) and all(len(v)==g['NF'] for v in anc['anchors'].values())
        for p,h in EXPECTED.items():assert sha(W/p)==h
        assert sha(PROD/'ys-chain-d1v1.voice.wav')==VOICE and sha(PROD/'blender/data.json')==DATA
    except BaseException as exc:
        failure={'type':type(exc).__name__,'message':str(exc)}
        raise
    finally:
        after=protected_snapshot();unchanged=all(after.get(p)==v for p,v in before.items())
        dump(PROD/'d1-protected-after.json',after)
        dump(invocation,{'time':time.strftime('%Y-%m-%d %H:%M:%S'),'seconds':round(time.time()-clock,3),'error':failure,'protectedSampledFiles':len(before),'oldAndOtherEpisodeSampledFilesUnchanged':unchanged,'changedSampledFiles':[p for p,v in before.items() if after.get(p)!=v],'completionRecordWritten':False})
        if failure is None:assert unchanged,'A protected old/other-episode sampled file changed'
    record={**prepared,'productionStarted':True,'finishedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'invocationSeconds':round(time.time()-clock,3),'totalSinceFirstStartSeconds':round(time.time()-json.loads(started.read_text())['startedUnix'],3),'renderKey':meta['key'],'all12163JpegsPresent':True,'all5070RenderSourcesDone':True,'allAnchorsComplete':True,'protectedSampledFiles':len(before),'oldAndOtherEpisodeSampledFilesUnchanged':True,'voiceSha256':VOICE,'dataSha256':DATA,'status':'3D production complete only; final MP4, every-second/cue-end actual review and original/supplementary final checks still pending'}
    dump(finished,record);dump(PROD/'d1-protected-after.json',after);print(json.dumps(record,ensure_ascii=False),flush=True)
