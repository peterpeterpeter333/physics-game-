"""Existing-GUI D1 production entry, after real all-range r8 preview approval."""
import os,json,time,runpy,hashlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/desk';source=W+'/scripts/blender/desk_d1v1.py'
patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r8.py');expected=patch['EXPECTED_SOURCE'];sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
assert sha(source)==expected,'Frozen D1 source changed'
approval=json.load(open(C+'/probe-approval-d1v1-r8.json'));assert approval['sourceSha256']==expected and approval['allImagesVisuallyReviewed'] and approval['proceedToProduction'],'Actual r8 all-range visual approval is required'
metrics=approval['integerSecondMetrics'];assert metrics['subjectMedian']>=.60 and metrics['subjectSmallRatio']<=.20 and metrics['sparseLongest']<4,'Original-metric full-range preview must pass before production'
assert sha(C+'/ys-chain-d1v1.voice.wav')=='74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab','Supplied D1 voice changed'
started=C+'/d1-full-r8-started.json'
if os.path.exists(OUT):
    assert globals().get('D1_RESUME') is True,'Existing output preserved; explicit same-revision resume required'
    assert json.load(open(started))['sourceSha256']==expected,'Cannot resume different-revision output'
else:
    assert not os.path.exists(started),'Unexpected previous production start record'
    json.dump({'revision':'r8','sourceSha256':expected,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'startedUnix':time.time()},open(started,'w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 full production START',flush=True);print(json.dumps(patch['install'](nsD1)),flush=True)
g=nsD1['main'].__globals__;A=g['A'];A.times=None;A.out=None;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['d'].SC.render.resolution_x=1080;g['d'].SC.render.resolution_y=1920;g['d'].SC.eevee.taa_render_samples=16
before=time.time();g['main']();meta=json.load(open(OUT+'/meta.json'));anchor=json.load(open(OUT+'/anchors.json'));nf=g['NF']
assert all(os.path.exists(OUT+'/'+str(j).zfill(5)+'.jpg') for j in range(nf)),'D1 production frames missing'
assert meta['frames']==nf and anchor['frames']==nf and meta['key']==anchor['key'] and all(len(v)==nf for v in anchor['anchors'].values()),'D1 production provenance incomplete'
record={'episode':'D-1','revision':'r8','sourceSha256':expected,'geometrySha256':sha(W+'/scripts/blender/desk_lib_d1.py'),'dataSha256':sha(C+'/blender/data.json'),'voiceSha256':sha(C+'/ys-chain-d1v1.voice.wav'),'frames':nf,'fps':30,'duration':g['DATA']['duration'],'uniqueRenderedFrames':len(meta['done']),'renderKey':meta['key'],'finishedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'thisInvocationSeconds':time.time()-before,'totalFromFirstStartSeconds':time.time()-json.load(open(started))['startedUnix'],'output':OUT,'status':'3D production only; MP4 export and final strict gates pending'}
json.dump(record,open(C+'/d1-full-r8-finished.json','w'),indent=1);print(json.dumps(record),flush=True);print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r8 full production DONE',flush=True)
