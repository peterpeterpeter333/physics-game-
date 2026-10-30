"""One same-source measurement; no source mutation or production-frame overwrite."""
import cProfile
import contextlib
import io
import json
import pathlib
import pstats
import time

OUT=pathlib.Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/outputs/ys-chain-d1b-backup/S4_20261027/performance_probe_20261027')

def run(gui):
    import bpy
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    OUT.mkdir(parents=True,exist_ok=True)
    receipt=OUT/'before-cleanup.json'
    assert not receipt.exists()
    assert ns['render_key']()=='34fd85d838051328f9a2'
    scene=ns['d'].SC
    old=(scene.render.filepath,scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage,scene.eevee.taa_render_samples)
    result={'sourceKey':ns['render_key'](),'time':1.0,'scenes':[{'name':s.name,'objects':len(s.objects)} for s in bpy.data.scenes],'currentScene':scene.name,'phases':{},'settings':{'resolution':[1080,1920],'samples':16}}
    profiler=cProfile.Profile()
    try:
        profiler.enable()
        a=time.perf_counter(); cam,st,X=ns['apply'](1.0); result['phases']['apply']=time.perf_counter()-a
        a=time.perf_counter(); ns['anchors_now'](1.0,st); result['phases']['anchors']=time.perf_counter()-a
        a=time.perf_counter(); ns['measure_primary'](1.0,st,X); result['phases']['primary']=time.perf_counter()-a
        profiler.disable()
        stream=io.StringIO(); pstats.Stats(profiler,stream=stream).sort_stats('cumulative').print_stats(55)
        result['cpuProfile']=stream.getvalue()
        scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage=1080,1920,100
        scene.eevee.taa_render_samples=16
        scene.render.filepath=str(OUT/'same-source-native-frame30.jpg')
        a=time.perf_counter()
        bpy.ops.render.render(write_still=True,scene=scene.name)
        result['phases']['render']=time.perf_counter()-a
        with receipt.open('x') as f: json.dump(result,f,indent=2)
    finally:
        scene.render.filepath,scene.render.resolution_x,scene.render.resolution_y,scene.render.resolution_percentage,scene.eevee.taa_render_samples=old
    return None
