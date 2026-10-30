"""Fresh-cache targeted native correction; prior S4 files are read-only."""
from pathlib import Path
import contextlib
import json
import runpy
import time
import traceback
import bpy

W = Path(__file__).resolve().parents[2]
R = W/'outputs/ys-chain-b2a-backup/S4修正02_20261030'
C6 = Path('/private/tmp/ys/ys-chain-b2a_s4earth_gpt_20261030')


def run(ns):
    result_file = R/'地表609コマ_本番部分修正_20261030.json'
    log_file = R/'地表609コマ_本番部分修正_20261030.log'
    assert not result_file.exists() and not log_file.exists()
    assert C6.is_dir() and not (C6/'blender/desk/meta.json').exists()
    patch_module = runpy.run_path(str(W/'scripts/blender/patch_b2a_s4_earth_slice_width_gpt_20261030.py'))
    g = ns['production'].__globals__
    old_cache, old_ns_cache = g['C'], ns['C']
    for j in range(1235,1844):
        assert not (C6/'blender/desk'/f'{j:05d}.jpg').exists()
    started = time.time()
    with log_file.open('x', buffering=1) as log, contextlib.redirect_stdout(log), contextlib.redirect_stderr(log):
        try:
            patch = patch_module['install'](ns,target=.70)
            g['C'] = ns['C'] = C6
            g['RENDER_REUSE'] = {'identityVersion':'jpeg-image-data-v2','last':None,'file':None,'verifiedRows':set(),'disabledRows':set(),'drawn':0,'reused':0,'proofs':[]}
            result = g['production'](1235,1844)
            assert result['frames'] == 14846
            meta = json.loads((C6/'blender/desk/meta.json').read_text())
            assert meta['resolution'] == [1080,1920] and meta['samples'] == 16
            assert meta['frames'] == 14846 and not meta['sampleOnly']
            project = R/'B-2前編_S4地表幅修正_20261030.blend'
            assert not project.exists()
            bpy.ops.wm.save_as_mainfile(filepath=str(project))
            receipt = {'completed':True,'fromFrame':1235,'toFrameExclusive':1844,'replacedFrames':609,'fullNativeFrames':14846,'resolution':[1080,1920],'samples':16,'fps':30,'cache':str(C6),'elapsedWallSeconds':time.time()-started,'ratios':patch['ratios'],'probe':patch['probe'],'savedProject':str(project),'priorNativeFramesWritten':False,'voiceCaptionsOrBgmChanged':False}
        except BaseException as error:
            traceback.print_exc()
            receipt = {'completed':False,'error':repr(error),'cache':str(C6),'elapsedWallSeconds':time.time()-started}
        finally:
            g['C'], ns['C'] = old_cache, old_ns_cache
            patch_module['uninstall'](ns)
        with result_file.open('x', encoding='utf-8') as out:
            json.dump(receipt,out,ensure_ascii=False,indent=2)
    return None
