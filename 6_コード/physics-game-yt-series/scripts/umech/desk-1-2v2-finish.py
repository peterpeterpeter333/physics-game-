"""1-2 第2版：書き直し（desk_1_2v2.py --retouch）の後、書き出しと検査をする。公開・アプリの変更はしない。
声と時刻・音（mix 済みの wav）は第1版の写しなので、mix はやり直さない。"""
import os,sys,json,subprocess,time
from pathlib import Path
W=Path(__file__).resolve().parents[2]
C=Path('/private/tmp/ys/ys-chain-1-2v2');ID='ys-chain-1-2v2'
FF='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
ENV={**os.environ,'EM_FILM_CACHE':str(C),'FILM_OUTPUT':str(C/'out'),'FFMPEG':FF}
SCRIPT='docs/video-revision-20260924/ytseries/chain-1-2v2.mjs'
MD='docs/video-revision-20260924/deep/技術の疑問の鎖_1-2_第1版_ナレーション.md'
def run(label,args):
    t=time.time()
    with (C/(label+'.log')).open('w') as out:code=subprocess.run(args,cwd=W,env=ENV,stdout=out,stderr=subprocess.STDOUT).returncode
    print(label,'exit',code,'%.0f s'%(time.time()-t),flush=True);return code
if __name__=='__main__':
    assert json.loads((C/'blender/retouch-restore.json').read_text())['restored_pixel_identical']>=0  # desk-1-2v2-restore.mjs が通った後
    steps=sys.argv[1:] or ['encode','qx-verify','mxr-review','quality-gate']
    movie=str(C/'out'/(ID+'.mp4'));res={}
    if 'encode' in steps:
        res['encode']=run('encode',['node','scripts/render-all-films-gptv2.mjs',ID])
        if res['encode']:raise SystemExit('encode failed')
    if 'qx-verify' in steps:res['qx-verify']=run('qx-verify',['node','scripts/umech/qx-verify.mjs',ID,movie])
    if 'mxr-review' in steps:res['mxr-review']=run('mxr-review',['node','scripts/umech/mxr-review.mjs'])
    if 'quality-gate' in steps:res['quality-gate']=run('quality-gate',['node','scripts/umech/desk-quality-gate.mjs',ID,'--cache',str(C),'--mp4',movie,'--ref','ys-chain-1-1v6','--script',SCRIPT,'--md',MD])
    (C/'finish-1-2v2.json').write_text(json.dumps(res,indent=1));print(res)
