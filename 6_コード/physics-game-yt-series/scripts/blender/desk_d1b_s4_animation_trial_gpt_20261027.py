"""Three-frame timing trial only; no production frames or finished flags touched."""
import contextlib
import json
import pathlib
import time

OUT=pathlib.Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-d1b-backup/S4_20261027/performance_probe_20261027/animation-three-frame-trial')

def run(gui):
    import bpy
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    scene=ns['d'].SC
    assert ns['render_key']()=='34fd85d838051328f9a2'
    assert (pathlib.Path(ns['A'].cache)/'STOP_S4').exists()
    assert not OUT.exists()
    OUT.mkdir(parents=True)
    result={'sourceKey':ns['render_key'](),'productionStarted':False,'frameRange':[30,32],'resolution':[1080,1920],'samples':16,'frames':[]}
    old=(scene.frame_start,scene.frame_end,scene.frame_step,scene.frame_current,scene.render.filepath,scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage,scene.eevee.taa_render_samples,scene.render.use_lock_interface)
    prior_primary=ns['PRIMARY'].copy()
    prior_metadata=ns['S3_PRIMARY_METADATA'].copy()
    def prepare(sc,*unused):
        if sc!=scene:return
        j=int(sc.frame_current); assert 30<=j<=32
        a=time.perf_counter();cam,st,X=ns['apply'](j/30)
        anchors=ns['anchors_now'](j/30,st)
        box=ns['measure_primary'](j/30,st,X)
        result['frames'].append({'frame':j,'time':j/30,'prepareSeconds':time.perf_counter()-a,'anchors':anchors,'primary':box})
    try:
        scene.frame_start,scene.frame_end,scene.frame_step=30,32,1
        scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage=1080,1920,100
        scene.eevee.taa_render_samples=16
        scene.render.use_lock_interface=True
        scene.render.filepath=str(OUT/'#####')
        bpy.app.handlers.render_pre.append(prepare)
        with (OUT/'blender.log').open('x') as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
            a=time.perf_counter(); bpy.ops.render.render(animation=True,scene=scene.name); result['elapsedSeconds']=time.perf_counter()-a
        assert [f['frame'] for f in result['frames']]==[30,31,32]
        assert all((OUT/('%05d.jpg'%j)).is_file() for j in range(30,33))
        with (OUT/'receipt.json').open('x') as f:json.dump(result,f,indent=2)
    finally:
        if prepare in bpy.app.handlers.render_pre:bpy.app.handlers.render_pre.remove(prepare)
        scene.frame_start,scene.frame_end,scene.frame_step,frame,scene.render.filepath,scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage,scene.eevee.taa_render_samples,scene.render.use_lock_interface=old
        scene.frame_set(frame)
        ns['PRIMARY'].clear();ns['PRIMARY'].update(prior_primary)
        ns['S3_PRIMARY_METADATA'].clear();ns['S3_PRIMARY_METADATA'].update(prior_metadata)
    return None
