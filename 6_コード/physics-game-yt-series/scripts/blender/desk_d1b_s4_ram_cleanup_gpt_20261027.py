"""Back up then remove only this task's superseded in-memory scene copies.

Disk source, inputs, old outputs, the active S4 scene and initial Scene stay intact.
This is not a geometry, render-quality, sampling or checker change.
"""
import json
import pathlib
import time

OUT=pathlib.Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-d1b-backup/S4_20261027/performance_probe_20261027')
OLD=('D1AB_d1b_gpt_20261026','D1B_S3_20261026','D1B_S3_20261026.001','D1B_S4_20261027')

def run(gui):
    import bpy
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    active=ns['d'].SC
    assert active.name=='D1B_S4_20261027.001'
    assert ns['render_key']()=='34fd85d838051328f9a2'
    assert (pathlib.Path(ns['A'].cache)/'STOP_S4').exists()
    oldscenes=[bpy.data.scenes[name] for name in OLD]
    keepobjects={o for s in bpy.data.scenes if s not in oldscenes for o in s.objects}
    remove={o for s in oldscenes for o in s.objects if o not in keepobjects}
    assert all(o.name.startswith('d1b_s4_prior_') for o in remove)
    assert not (remove & set(active.objects))
    OUT.mkdir(parents=True,exist_ok=True)
    backup=OUT/'superseded-ram-scenes-recoverable.blend'
    receipt=OUT/'ram-cleanup.json'
    assert not backup.exists() and not receipt.exists()
    result={'sourceKey':ns['render_key'](),'activeScene':active.name,'removedSceneNames':list(OLD),'removedObjectCount':len(remove),'beforeObjectCount':len(bpy.data.objects),'backup':str(backup),'deletedDiskFiles':0}
    active_names=sorted(o.name for o in active.objects)
    a=time.perf_counter()
    bpy.ops.wm.save_as_mainfile(filepath=str(backup),copy=True,check_existing=True)
    assert backup.is_file() and backup.stat().st_size>1000
    result['backupSeconds']=time.perf_counter()-a
    bpy.data.batch_remove(ids=tuple(oldscenes)+tuple(remove))
    assert sorted(o.name for o in active.objects)==active_names
    assert ns['render_key']()==result['sourceKey']
    result['afterObjectCount']=len(bpy.data.objects)
    result['remainingScenes']=[{'name':s.name,'objects':len(s.objects)} for s in bpy.data.scenes]
    result['activeSceneUnchanged']=True
    with receipt.open('x') as f:json.dump(result,f,indent=2)
    return None
