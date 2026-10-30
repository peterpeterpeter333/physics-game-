"""Encode only after the verified partial retouch finishes; retain first pass."""
import importlib.util,json,time,os
from pathlib import Path

P=Path(__file__).with_name('desk-1-2v1-finish.py')
spec=importlib.util.spec_from_file_location('finish12',P)
f=importlib.util.module_from_spec(spec);spec.loader.exec_module(f)
suffix=os.environ.get('FINAL_PASS','')
proof=f.C/('blender/retouch-after-1_2v1'+os.environ.get('RETOUCH_PROOF_SUFFIX',suffix)+'.json')
start=time.time()
while not proof.exists():
    log=(f.C/'blender/retouch-1_2v1.log').read_text()
    if 'Traceback (most recent call last)' in log:raise RuntimeError(log[-6000:])
    if time.time()-start>7200:raise TimeoutError('Retouch did not finish')
    time.sleep(5)
f.ENV['FILM_OUTPUT']=str(f.C/('out-final-1-2v1'+suffix))
assert f.run('encode-final',['node','scripts/render-all-films-gptv2.mjs',f.ID])==0
movie=Path(f.ENV['FILM_OUTPUT'])/(f.ID+'.mp4')
checks={}
checks['qx-verify']=f.run('qx-final',['node','scripts/umech/qx-verify.mjs',f.ID,str(movie)])
checks['mxr-review']=f.run('mxr-final',['node','scripts/umech/mxr-review.mjs'])
checks['quality-gate']=f.run('quality-final',['node','scripts/umech/desk-quality-gate.mjs',f.ID,'--cache',str(f.C),'--mp4',str(movie),'--ref','ys-chain-1-1v6','--script','docs/video-revision-20260924/ytseries/chain-1-2.mjs','--md','docs/video-revision-20260924/deep/技術の疑問の鎖_1-2_第1版_ナレーション.md'])
checks['export']=f.run('export-final',['node','scripts/umech/export-script-md.mjs',str(f.C/'script-export-1-2v1'),'docs/video-revision-20260924/ytseries/chain-1-2.mjs'])
result={'checks':checks,'movie':str(movie),'retouch':json.loads(proof.read_text()),'manual_full_frame_review':False,'ear_review':False}
(f.C/('final-checks-1-2v1'+suffix+'.json')).write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False,indent=2),flush=True)
