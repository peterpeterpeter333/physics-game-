"""Dedicated foreground-capable Blender GUI process; NEVER use -b.

Launch only after approval, for example:
Blender --no-window-focus --python <this file> -- --mode probe 
  --session /private/tmp/ys/ys-chain-d1v1-render/gui-r8-probe --dedicated-process
No action is taken in any other running Blender process. The one-second timer
waits for this fresh GUI's window/context before importing D1. Its own PID is
recorded and only this process invokes quit_blender on completion/failure.
"""
import argparse,contextlib,hashlib,json,math,os,pathlib,runpy,sys,time,traceback
import bpy
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series'
EXPECTED_SOURCE='8b6f87b246a902dacfb69aa8197e8e7d193bc2c7df1ad26f92b7a7a8799cf100'
EXPECTED_LIB='ab653d04a0c809f763e9c4c344321c4197e72eeaf09cb7599a8b02dd9c66ab81'
EXPECTED_DATA='eb0404efd07b5d4cad1edbef66af7961c8fef4bb3524760baf0aa9dbaf2dda44'
parser=argparse.ArgumentParser();parser.add_argument('--mode',choices=['trial','probe','production'],required=True);parser.add_argument('--cache',default='/private/tmp/ys/ys-chain-d1v1-render');parser.add_argument('--session',required=True);parser.add_argument('--out');parser.add_argument('--dedicated-process',action='store_true');parser.add_argument('--keep-open',action='store_true')
OPTIONS=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
assert not bpy.app.background,'D1 standalone requires a GUI, not background/Metal CLI'
assert OPTIONS.dedicated_process,'Only launch this script in its own new Blender process'
C=os.path.abspath(OPTIONS.cache);SESSION=os.path.abspath(OPTIONS.session);OUT=os.path.abspath(OPTIONS.out or C+'/blender/'+({'trial':'landmarks-d1v1-r8-standalone','probe':'probe1s-d1v1-r8','production':'desk'}[OPTIONS.mode]))
assert SESSION.startswith(C+'/') and OUT.startswith(C+'/'),'D1 session/output must be within its own cache'
assert not os.path.exists(SESSION),'Existing D1 standalone session preserved'
assert not os.path.exists(OUT),'Existing D1 rendered output preserved; choose a fresh output'
os.makedirs(SESSION);LOG=SESSION+'/d1-standalone.log';STATUS=SESSION+'/status.json';PID=os.getpid();BEGIN=time.time()
sha=lambda p:hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
STATE={'episode':'D-1','revision':'r8','mode':OPTIONS.mode,'pid':PID,'session':SESSION,'output':OUT,'sourceSha256':EXPECTED_SOURCE,'startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'startedUnix':BEGIN,'stage':'waiting-for-one-second-GUI-timer','status':'running','finalVideoComplete':False}
def status(**fields):
    STATE.update(fields);STATE['updatedAt']=time.strftime('%Y-%m-%d %H:%M:%S');STATE['elapsedSeconds']=round(time.time()-BEGIN,3);pathlib.Path(STATUS).write_text(json.dumps(STATE,ensure_ascii=False,indent=1))
status()

def run_after_gui_ready():
    # The callback is never re-registered after it begins heavy work.
    if bpy.context.window is None:return 1.0
    with open(LOG,'a',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 standalone GUI START PID',PID,OPTIONS.mode,flush=True)
            source=W+'/scripts/blender/desk_d1v1.py'
            assert sha(source)==EXPECTED_SOURCE and sha(W+'/scripts/blender/desk_lib_d1.py')==EXPECTED_LIB and sha(C+'/blender/data.json')==EXPECTED_DATA,'Frozen D1 source/lib/data changed'
            approval_path=None
            if OPTIONS.mode!='trial':
                approval_path=C+('/trial-approval-d1v1-r8.json' if OPTIONS.mode=='probe' else '/probe-approval-d1v1-r8.json');approval=json.load(open(approval_path));assert approval['sourceSha256']==EXPECTED_SOURCE,'Wrong revision approval'
                if OPTIONS.mode=='probe':assert approval['trialImagesVisuallyReviewed'] and approval['proceedToAllRangeProbe'],'Actual 3-shot r8 visual approval required'
                else:
                    assert approval['allImagesVisuallyReviewed'] and approval['proceedToProduction'],'Actual all-range r8 visual approval required'
                    metrics=approval['integerSecondMetrics'];assert metrics['subjectMedian']>=.60 and metrics['subjectSmallRatio']<=.20 and metrics['sparseLongest']<4,'Original-metric all-range preview must pass before production'
            assert sha(C+'/ys-chain-d1v1.voice.wav')=='74b0951c096caea1be50a5442030cac089dc51c41ea076987bd7633fe369d0ab','Supplied voice changed'
            status(stage='fresh-D1-model-build',approval=approval_path)
            old_argv=sys.argv[:]
            try:
                sys.argv=['desk_d1v1.py','--','--cache',C,'--scale','1','--samples','16'];ns=runpy.run_path(source,run_name='d1r8_'+OPTIONS.mode+'_dedicated_gui')
            finally:sys.argv=old_argv
            g=ns['main'].__globals__;bpy.context.window.scene=g['d'].SC;A=g['A'];A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16;A.out=OUT
            print('D1 fresh model built:',len(g['d'].SC.objects),'scene objects',flush=True)
            runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r8.py')['check_bounds'](ns,SESSION+'/actual-geometry-bounds.json')
            if OPTIONS.mode=='trial':
                A.times='169.8,172.3,403.3';status(stage='rendering-three-trial-frames',expectedFrames=3);g['main']();status(status='done',stage='three-trial-frames-ready-visual-approval-pending',renderedFrames=3)
            elif OPTIONS.mode=='probe':
                audit=json.load(open(C+'/d1-source-audit-r8-finalfreeze.json'));assert audit['sourceSha256']==EXPECTED_SOURCE;times=sorted(set([float(i) for i in range(math.ceil(g['DATA']['duration']))]+[round((c['end']-.06)*30)/30 for c in g['CUES']]+[round(t*30)/30 for t in g['DATA']['landmarks']]+[round((a+b)/2*30)/30 for a,b in audit['cameraMotion']['movingSpans']]+audit['trialSeconds']+[169.8,171.8,172.3,400,403.3]));A.times=','.join(map(str,times));status(stage='rendering-all-range-probe',expectedFrames=len(times));g['main']()
                json.dump({'times':times,'integerSeconds':406,'cueEnds':len(g['CUES']),'revision':'r8','sourceSha256':EXPECTED_SOURCE},open(OUT+'/probe-coverage-d1v1-r8.json','w'),indent=1)
                catalog=runpy.run_path(W+'/scripts/blender/desk_d1v1_catalog_r8.py')['finish'](ns);print(json.dumps(catalog),flush=True)
                status(status='done',stage='probe-render-complete-visual-review-pending',renderedFrames=len(times),catalog=C+'/blender/catalog-d1v1-final-r8')
            else:
                A.times=None;status(stage='rendering-production-3D',expectedFrames=g['NF']);g['main']();meta=json.load(open(OUT+'/meta.json'));anchors=json.load(open(OUT+'/anchors.json'));nf=g['NF'];assert all(os.path.exists(OUT+'/'+str(j).zfill(5)+'.jpg') for j in range(nf)),'Production frames missing'
                assert meta['frames']==nf and anchors['frames']==nf and meta['key']==anchors['key'] and all(len(v)==nf for v in anchors['anchors'].values()),'Production provenance incomplete'
                status(status='done',stage='production-3D-complete-MP4-and-final-gates-pending',renderedFrames=nf,uniqueRenderedFrames=len(meta['done']),renderKey=meta['key'])
            print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 standalone GUI DONE',flush=True)
        except BaseException as error:
            traceback.print_exc(file=log);status(status='failed',stage='failed-no-completion-claim',error=str(error));print('D1 standalone GUI FAILED',flush=True)
        finally:
            if not OPTIONS.keep_open:
                assert os.getpid()==PID,'Refuse to quit a different process'
                bpy.app.timers.register(quit_only_this_process,first_interval=.25)
    return None

def quit_only_this_process():
    assert os.getpid()==PID,'Refuse to quit a different process'
    bpy.ops.wm.quit_blender();return None

bpy.app.timers.register(run_after_gui_ready,first_interval=1.0)
