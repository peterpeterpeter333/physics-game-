"""New CLI-launched GUI process only; no CUA, capture, or other-app control.

Run the Blender binary WITHOUT --background, with
D1A_FRAMING_NEW_INSTANCE=1 and --python THIS -- --mode review|production.
One build in each mode. A GUI timer starts work after its event loop is ready.
The new process quits on success/failure; no existing Blender process is used.
"""
from pathlib import Path
import argparse, contextlib, datetime, hashlib, json, os, runpy, sys, time, traceback
import bpy
sys.dont_write_bytecode=True

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
BASE=Path('/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')
CACHE=Path('/private/tmp/ys/ys-chain-d1a_s3_framing_gpt_20261028')
SCENE=W/'scripts/blender/desk_d1a_s3_gpt_20261028.py'
HELPER=W/'scripts/blender/desk_d1a_s3_framing_gpt_20261028.py'
LOADER=W/'scripts/umech/desk-d1a-framing-loader_s3_gpt_20261028.mjs'
BASE_KEY='8eb303df05bafa5a3d96'
EXPECTED_HELPER_SHA='22b1376c02c2e54cb3803245abc808d37c9c8f471bc91f5644dc5c481dfe84c4'
EXPECTED_LOADER_SHA='82c8188c915c6b3712b250de31d741bb320537aedc1fca4a1f2a3dc5a40b27a3'

def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def put(p,value):
    with Path(p).open('x') as f:json.dump(value,f,ensure_ascii=False,indent=1);f.write('\n')

parser=argparse.ArgumentParser()
parser.add_argument('--mode',choices=['review','production'],required=True)
parser.add_argument('--label',default='cli_candidate1')
parser.add_argument('--wide-distance',type=float,default=.47)
parser.add_argument('--bucket-distance',type=float,default=.55)
opts=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
assert os.environ.get('D1A_FRAMING_NEW_INSTANCE')=='1','Only a separately launched process may run this file'
assert not bpy.app.background,'Use a new normal GUI instance; headless startup was tested once and crashed'
assert '--python' in sys.argv and str(Path(__file__).resolve()) in sys.argv,'Do not execute this runner in an existing GUI console'
assert opts.label.replace('-','').replace('_','').isalnum()
assert sha(HELPER)==EXPECTED_HELPER_SHA and sha(LOADER)==EXPECTED_LOADER_SHA,'Frozen framing helper/loader changed'
stamp=datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')
OUT=W/'outputs/ys-chain-d1a-backup/S3_20261028/framing'/('cli-'+opts.mode+'-'+stamp)
OUT.mkdir(parents=True,exist_ok=False)
LOG=OUT/'stdout-stderr.log';RESULT=OUT/'result.json'
record={'mode':opts.mode,'label':opts.label,'pid':os.getpid(),'startedAt':datetime.datetime.now().isoformat(),'newGUIProcess':True,'background':False,
        'CUAUsed':False,'screenCaptured':False,'existingBlenderClosed':False,'baseSourceKey':BASE_KEY,
        'sceneSource':str(SCENE),'framingHelper':str(HELPER),'helperSha256':sha(HELPER),'loaderSha256':sha(LOADER),
        'baseCache':str(BASE),'candidateCache':str(CACHE),'log':str(LOG),'renderedMovie':False,'exportStarted':False,'allMoviePass':False,'earsPerformed':False}
put(OUT/'process.json',record)

def build():
    meta=read(BASE/'blender/desk/meta.json')
    assert meta.get('key')==BASE_KEY and meta.get('frames')==11618 and isinstance(meta.get('finished'),str),'Base render must finish before building the correction scene'
    assert not meta.get('previewOnly') and not meta.get('sampleOnly')
    for p in [BASE/'blender/desk/anchors.json',BASE/'blender/primary.json',BASE/'blender/primary-metadata.json',BASE/'blender/delivered-camera-poses_gpt_20261026.json']:assert p.is_file()
    sys.path.insert(0,str(W/'scripts/blender'))
    before=sys.argv[:];old_bytecode=sys.dont_write_bytecode;sys.dont_write_bytecode=True
    try:
        # The unchanged scene imports its normal desk library in this NEW GUI
        # process. Its factory reset cannot affect another Blender process.
        sys.argv=[str(SCENE),'--','--cache',str(BASE),'--scale','.5','--samples','4']
        ns=runpy.run_path(str(SCENE),run_name='d1a_framing_cli_scene')
        ns=ns['main'].__globals__
    finally:sys.argv=before;sys.dont_write_bytecode=old_bytecode
    assert ns['render_key']()==BASE_KEY and ns['NF']==11618
    assert bpy.context.window is not None,'Normal GUI did not provide a window'
    return ns

def work():
    began=time.time()
    try:
        with LOG.open('x',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
            try:
                print('FRAMING_NEW_GUI_START',os.getpid(),opts.mode,flush=True)
                ns=build();print('FRAMING_NEW_GUI_BUILT',len(ns['d'].SC.objects),flush=True)
                helper=runpy.run_path(str(HELPER),run_name='d1a_framing_cli_helper')
                if opts.mode=='review':
                    helper['review'](ns,wide_distance=opts.wide_distance,bucket_distance=opts.bucket_distance,label=opts.label)
                    p=read(CACHE/'review'/opts.label/'projection.json')
                    record.update(executionCompleted=True,projectionPass=p['allProjectedFramesPass'],projectedFrames=p['projectedFrames'],failingProjectionFrames=len(p['failingFrames']),
                                  sourceKey=p['sourceKey'],reviewDirectory=str(CACHE/'review'/opts.label),samples=len(p['samples']),state='review images saved; parent must inspect; no production approval inferred')
                else:
                    helper['production'](ns,label=opts.label)
                    m=read(CACHE/'blender/desk/meta.json')
                    record.update(executionCompleted=True,sourceKey=m['key'],frames=m['frames'],finished=m['finished'],state='correction raw completed; no export/check/backup automatically started')
                assert ns['render_key']()==BASE_KEY,'Base scene source changed'
                assert sha(HELPER)==EXPECTED_HELPER_SHA and sha(LOADER)==EXPECTED_LOADER_SHA
                print('FRAMING_NEW_GUI_DONE',record['state'],flush=True)
            except BaseException as e:
                record.update(executionCompleted=False,state='failed; new evidence retained; no retry',error=repr(e),traceback=traceback.format_exc())
                traceback.print_exc()
    finally:
        record.update(endedAt=datetime.datetime.now().isoformat(),elapsedSeconds=time.time()-began,newInstanceQuitRequested=True)
        put(RESULT,record)
        # This operator is executed inside the separately launched PID only.
        # It does not address or close any already-running Blender process.
        try:bpy.ops.wm.quit_blender('EXEC_DEFAULT')
        except BaseException as e:
            put(OUT/'quit-error.json',{'pid':os.getpid(),'error':repr(e),'resultPreserved':str(RESULT)})
            os._exit(1)
    return None

bpy.app.timers.register(work,first_interval=1.0)
