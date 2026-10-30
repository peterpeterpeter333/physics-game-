"""GUI full D1 production, only after recorded all-range r7 preview approval."""
import os,json,time,runpy,hashlib
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render';OUT=C+'/blender/desk';source=W+'/scripts/blender/desk_d1v1.py'
patch=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r7.py');expected=patch['EXPECTED_SOURCE'];sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
assert sha(source)==expected,'Frozen D1 source changed'
approval=json.load(open(C+'/probe-approval-d1v1-r7.json'))
assert approval['sourceSha256']==expected and approval['allImagesVisuallyReviewed'] and approval['proceedToProduction'],'Actual r7 all-range preview approval is required'
assert sha(C+'/ys-chain-d1v1.voice.wav')=='74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab','Supplied D1 voice changed'
started=C+'/d1-full-r7-started.json'
if os.path.exists(OUT):
    assert globals().get('D1_RESUME') is True,'Existing output is preserved; explicit same-revision resume required'
    assert json.load(open(started))['sourceSha256']==expected,'Cannot resume different-revision D1 output'
else:
    assert not os.path.exists(started),'Unexpected previous production start record'
    json.dump({'revision':'r7','sourceSha256':expected,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'startedUnix':time.time()},open(started,'w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 full production START',flush=True)
print(json.dumps(patch['install'](nsD1)),flush=True)
g=nsD1['main'].__globals__;A=g['A'];A.times=None;A.out=None;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16
g['bpy'].context.window.scene=g['d'].SC;g['d'].SC.render.resolution_x=1080;g['d'].SC.render.resolution_y=1920;g['d'].SC.eevee.taa_render_samples=16
before=time.time();g['main']();meta=json.load(open(OUT+'/meta.json'));anchor=json.load(open(OUT+'/anchors.json'));nf=g['NF']
assert all(os.path.exists(OUT+'/'+str(j).zfill(5)+'.jpg') for j in range(nf)),'D1 production frames missing'
assert meta['frames']==nf and anchor['frames']==nf and meta['key']==anchor['key'],'D1 production provenance incomplete'
assert all(len(v)==nf for v in anchor['anchors'].values()),'D1 full anchors missing'
record={'episode':'D-1','revision':'r7','sourceSha256':expected,'geometrySha256':sha(W+'/scripts/blender/desk_lib_d1.py'),'dataSha256':sha(C+'/blender/data.json'),'voiceSha256':sha(C+'/ys-chain-d1v1.voice.wav'),'frames':nf,'fps':30,'duration':g['DATA']['duration'],'uniqueRenderedFrames':len(meta['done']),'renderKey':meta['key'],'finishedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'thisInvocationSeconds':time.time()-before,'totalFromFirstStartSeconds':time.time()-json.load(open(started))['startedUnix'],'output':OUT,'status':'3D production only; MP4 export and final strict gates pending'}
json.dump(record,open(C+'/d1-full-r7-finished.json','w'),indent=1);print(json.dumps(record),flush=True)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D-1 r7 full production DONE',flush=True)
