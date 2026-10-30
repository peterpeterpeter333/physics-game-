"""Re-render only B-1 row37 to correct an early box and a held lightning flash.

The original r8 full production is preserved. Supplied scripts/voice/captions and
the frozen stage source are read-only. Canonical d.main renders every patch frame.
"""
import copy,hashlib,json,math,os,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-b1v1')
P=Path('/private/tmp/ys/ys-chain-b1v1-timing-final-20261024')
g=nsB1r6['main'].__globals__
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
frozen=json.loads((C/'blender/b1-r8-probe-complete.json').read_text())
assert sha(g['__file__'])==frozen['sourceSha256']
assert json.loads((C/'b1-production-20261024.json').read_text())['status']=='done'
assert not P.exists(),'Preserve an existing B1 timing patch'
q=next(x for x in g['CUES'] if x['key']=='next:later')
nextStart=g['CUES'][g['CUES'].index(q)+1]['start']
# The last spoken cue's 3D state also remains visible in its existing tail gap.
# Cover that gap too, so the original held lightning cannot reappear afterwards.
first=math.ceil(q['start']*30-1e-8);last=math.ceil(nextStart*30-1e-8)-1
nf=math.ceil(g['DATA']['duration']*30)
voice=C/'ys-chain-b1v1.wav';beforeVoice=sha(voice)
beforeImages={str(p):sha(p) for p in [C/'blender/desk'/('%05d.jpg'%j) for j in [first,last]]}
P.mkdir();(P/'blender').mkdir()
for f in ['plan.json','ys-chain-b1v1.json','phrase-times.json']:(P/f).symlink_to(C/f)
(P/'blender/data.json').symlink_to(C/'blender/data.json')
original_apply=g['apply']
def corrected_apply(t):
    result=original_apply(t)
    # The individual shooting instruction puts the little closed box at the word
    # "electricity" (329.80s), not at the start of this five-second cue.
    if g['cue_at'](t)['key']=='next:later' and t<329.80:
        for ob in g['GROUPS']['mysterybox']:g['d'].show(ob,False)
    return result
a=copy.copy(g['A']);a.cache=str(P);a.out=str(P/'blender/patch');a.times=','.join(str(j/30) for j in range(first,last+1));a.force=False;a.samples=16;a.scale=1;a.every=1;a.start=0;a.stop=1e9
scope={**g,'__file__':str(W/'scripts/blender/desk_axes_b1_timing_patch_20261024.py'),'A':a,'apply':corrected_apply}
main=types.FunctionType(g['main'].__code__,scope)
g['bpy'].context.window.scene=g['d'].SC
g['d'].SC.render.resolution_x=1080;g['d'].SC.render.resolution_y=1920;g['d'].SC.render.resolution_percentage=100;g['d'].SC.eevee.taa_render_samples=16
g['d'].SC.render.image_settings.file_format='JPEG'
start=time.time();print('B1 ROW37 PATCH START',first,last,last-first+1,flush=True);main()
assert all((P/'blender/patch'/('%05d.jpg'%j)).is_file() for j in range(first,last+1))
assert sha(voice)==beforeVoice and sha(g['__file__'])==frozen['sourceSha256']
assert all(sha(p)==h for p,h in beforeImages.items()),'Original production images changed'
record={'id':'ys-chain-b1v1','status':'patch raw complete; composed cache and MP4 still pending','firstFrame':first,'lastFrame':last,'patchFrames':last-first+1,'frames':nf,'fps':30,'cueStart':q['start'],'cueEnd':q['end'],'coverageEnd':nextStart,'boxAppears':329.8,'lightningOn':329.8,'lightningOff':330.5,'allPatchFramesActuallyRendered':True,'originalStageSourceSha256':frozen['sourceSha256'],'patchSourceSha256':sha(scope['__file__']),'voiceSha256':beforeVoice,'originalProductionUntouched':True,'seconds':time.time()-start,'raw':str(P/'blender/patch'),'baseRaw':str(C/'blender/desk')}
(P/'timing-patch.json').write_text(json.dumps(record,ensure_ascii=False,indent=1))
print('B1 ROW37 PATCH COMPLETE',record,flush=True)
