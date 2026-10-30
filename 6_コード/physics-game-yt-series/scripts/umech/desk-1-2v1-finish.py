"""Wait for this render, encode privately, and prepare evidence for manual review.
Never publishes, modifies the app, or marks a visual/aural review as completed.
"""
import os,sys,time,json,hashlib,subprocess
from pathlib import Path
W=Path(__file__).resolve().parents[2]
C=Path('/private/tmp/ys/ys-chain-1-2v1-render');ID='ys-chain-1-2v1'
FF=Path('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1')
ENV={**os.environ,'EM_FILM_CACHE':str(C),'FILM_OUTPUT':str(C/'out'),'FFMPEG':str(FF)}
F=C/'blender'/'desk';LOG=C/'blender'/'1_2v1_full.log'
COUNT=11777
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def wait_render():
    prev=None;started=time.time()
    while True:
        text=LOG.read_text() if LOG.exists() else ''
        if 'Traceback (most recent call last)' in text:raise RuntimeError('Blender render failed; see '+str(LOG))
        m=F/'meta.json';meta=json.loads(m.read_text()) if m.exists() else {}
        state=(len(meta.get('done',[])),len(list(F.glob('*.jpg'))))
        if state!=prev:print('Blender: completed dynamic frames / files',state,flush=True);prev=state
        if state[1]>=COUNT and '無いコマ 0' in text:
            missing=[i for i in range(COUNT) if not (F/f'{i:05d}.jpg').is_file()]
            if missing:raise RuntimeError('Missing frames '+str(missing[:10]))
            return
        if time.time()-started>12*3600:raise TimeoutError('Render wait exceeded 12 hours')
        time.sleep(5)
def run(label,args):
    print(label,'START',flush=True)
    with (C/(label+'-1-2v1.log')).open('w') as out:
        code=subprocess.run(args,cwd=W,env=ENV,stdout=out,stderr=subprocess.STDOUT).returncode
    print(label,'exit',code,flush=True);return code
def protect():
    expected=json.loads((C/'blender/protected-1-2v1.json').read_text());results={}
    for name,value in expected.items():
        b=(W/name).read_bytes()
        if name=='scripts/umech/desk-frame.mjs':
            b=b.replace(b"import {overlay1_2v1} from './desk-1-2v1-overlay.mjs';\n",b'')
            b=b.replace(b",'1-2v1':overlay1_2v1",b'')
        results[name]=hashlib.sha256(b).hexdigest()==value
    D=json.loads((C/'blender/data.json').read_text())['episode12']
    results['original voice']=sha(C/(ID+'.voice.wav'))==D['audioSHA']
    assert all(results.values()),results
    pairs=list((C/'gate-1-2v1/regression-before').glob('*.png'))
    for p in pairs:
        assert subprocess.run(['cmp',str(p),str(C/'gate-1-2v1/regression-after'/p.name)],capture_output=True).returncode==0,p
    return {'protected':results,'byte_identical_legacy_frames':len(pairs)}
if __name__=='__main__':
    evidence=protect();wait_render()
    code=run('encode',['node','scripts/render-all-films-gptv2.mjs',ID])
    if code:raise SystemExit('Encoding failed; no final video delivered')
    movie=C/'out'/(ID+'.mp4')
    checks={}
    checks['qx-verify']=run('qx-verify',['node','scripts/umech/qx-verify.mjs',ID,str(movie)])
    checks['mxr-review']=run('mxr-review',['node','scripts/umech/mxr-review.mjs'])
    checks['quality-gate']=run('quality-gate',['node','scripts/umech/desk-quality-gate.mjs',ID,'--cache',str(C),'--mp4',str(movie),'--ref','ys-chain-1-1v6',
        '--script','docs/video-revision-20260924/ytseries/chain-1-2.mjs',
        '--md','docs/video-revision-20260924/deep/技術の疑問の鎖_1-2_第1版_ナレーション.md'])
    checks['export']=run('export',['node','scripts/umech/export-script-md.mjs',str(C/'script-export-1-2v1'),'docs/video-revision-20260924/ytseries/chain-1-2.mjs'])
    evidence.update(checks=checks,movie=str(movie),manual_full_frame_review=False,ear_review=False,
        note='Render completed is not quality approval. Inspect all verify/review sheets, fix findings, and rerun checks.')
    (C/'finish-1-2v1.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2))
    print(json.dumps(evidence,ensure_ascii=False,indent=2),flush=True)
