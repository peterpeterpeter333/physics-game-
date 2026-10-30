"""Targeted correction jobs on the retained Blender GUI; no original writes."""
from pathlib import Path
import contextlib,json,math,runpy,time,traceback
import bpy

W=Path(__file__).resolve().parents[2]
R=W/'outputs/ys-chain-b2a-backup/S4修正03_20261030'
C7=Path('/private/tmp/ys/ys-chain-b2a_s4r03_gpt_20261030')
TRIAL=Path('/private/tmp/ys/ys-chain-b2a_r03trial_gpt_20261030')
RANGES=[(3482,3802),(5490,5850),(6273,7008),(8532,8895),(11880,12390)]


def manifest(ctx):
    ev=ctx['events'];c19=ctx['row19']['clock'];c27=ctx['alarm']['events']
    critical=[
        [('rub',120.6),('charges',ev['r13Spark']-.4),('spark',ev['r13Spark']+.05),('empty',ev['r13Spark']+.25)],
        [('crank',c19['turn']+.4),('white-spark',c19['spark']+.05),('scalpel',c19['contact']+.05),('kick-before',c19['kick']-.04),('kick-peak',c19['kickPeak']),('kick-return',c19['kickEnd']+.04)],
        [('hypothesis-before',ev['r21Reveal']-.04),('hypothesis-mark',ev['r21Reveal']+.4),('single-pulse',ev['r21Pulse']+.55),('path-return',ev['r22Return']+.1),('one-loop-start',ev['r22Circuit']),('one-loop-middle',.5*(ev['r22Circuit']+ev['r22CircuitEnd'])),('one-loop-end',ev['r22CircuitEnd'])],
        [('smoke-before',c27['smokeArrivalAndFirstLamp']-.08),('smoke-lamp-waves-foot',c27['smokeArrivalAndFirstLamp']+.1),('lamp-off',c27['smokeArrivalAndFirstLamp']+.5),('single-underside',c27['undersideOnePushInEnd']+.1),('no-alarm-smoke',c27['noSmokeStatement']+.2)],
        [('glyph-before-strike',ev['r36Strike']-.1),('glyph-and-label-strike',ev['r36Strike']+.1)],
    ]
    windows=[]
    for i,((a,b),points) in enumerate(zip(RANGES,critical)):
        windows.append({'id':'correction-'+str(i+1),'fromFrame':a,'toFrameExclusive':b,
                        'criticalFrames':[{'j':round(t*30),'label':name} for name,t in points]})
    return {'key':'b2a_s4final_gpt_20261030','fps':30,'windows':windows}


def run_trial(ns):
    destination=R/'連続試写_描画記録.json';log_file=R/'連続試写_描画.log'
    assert not destination.exists() and not log_file.exists()
    assert TRIAL.is_dir()
    ctx=ns['_b2a_s4r03_coordinator'];g=ctx['g']
    previous=(g['C'],ns['C']);started=time.time();start_iso=time.strftime('%Y-%m-%dT%H:%M:%S%z')
    with log_file.open('x',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            g['C']=ns['C']=TRIAL
            man=manifest(ctx);mp=R/'連続試写_manifest.json'
            assert not mp.exists();mp.write_text(json.dumps(man,ensure_ascii=False,indent=2))
            result=g['motion_trial'](man['windows'])
            assert result['allRequestedFrames'] and result['rendered']==2288
            receipt={'completed':True,'result':result,'cache':str(TRIAL),'manifest':str(mp),
                     'start':start_iso,'end':time.strftime('%Y-%m-%dT%H:%M:%S%z'),'elapsedWallSeconds':time.time()-started,
                     'sourceVoiceCaptionsBgmChanged':False}
        except BaseException as error:
            traceback.print_exc();receipt={'completed':False,'error':repr(error),'elapsedWallSeconds':time.time()-started}
        finally:g['C'],ns['C']=previous
        destination.write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
    return None


def run_native(ns):
    destination=R/'2288コマ_本番部分修正_20261030.json';log_file=R/'2288コマ_本番部分修正_20261030.log'
    assert not destination.exists() and not log_file.exists()
    acceptance=json.loads((R/'S3連続試写_視認判定.json').read_text())
    assert acceptance['requiredVisualsAccepted'] and acceptance['measurementsAccepted']
    assert not (C7/'blender/desk/meta.json').exists()
    assert sum(1 for a,b in RANGES for j in range(a,b) if not (C7/'blender/desk'/f'{j:05d}.jpg').exists())==2288
    g=ns['_b2a_s4r03_coordinator']['g'];previous=(g['C'],ns['C'])
    # Picture-identical nomenclature synchronization: the retained shot plan
    # names the helper role, represented by the connected scalpel-holding arm.
    # This changes no mesh, transform, word, sound, subtitle or old QA plan.
    component=runpy.run_path(str(W/'scripts/blender/patch_b2a_s4r3_row19_gpt_20261030.py'))
    row19=ns['_b2a_s4r03_coordinator']['row19']
    row19['stage'].__globals__['_show']=component['_show']
    row19['apply'].__globals__['_show']=component['_show']
    started=time.time();start_iso=time.strftime('%Y-%m-%dT%H:%M:%S%z')
    with log_file.open('x',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            g['C']=ns['C']=C7
            g['RENDER_REUSE']={'identityVersion':'jpeg-image-data-v2','last':None,'file':None,'verifiedRows':set(),'disabledRows':set(),'drawn':0,'reused':0,'proofs':[]}
            results=[]
            for a,b in RANGES:
                print('CORRECTION_RANGE_START',a,b,flush=True)
                result=g['production'](a,b);assert not result.get('paused')
                results.append({'fromFrame':a,'toFrameExclusive':b,**result})
                print('CORRECTION_RANGE_END',a,b,flush=True)
            meta=json.loads((C7/'blender/desk/meta.json').read_text())
            assert meta['resolution']==[1080,1920] and meta['samples']==16 and meta['frames']==14846
            assert len(list((C7/'blender/desk').glob('[0-9][0-9][0-9][0-9][0-9].jpg')))==14846
            saved=R/'B-2前編_S4修正03_20261030.blend';assert not saved.exists()
            bpy.ops.wm.save_as_mainfile(filepath=str(saved))
            receipt={'completed':True,'resolution':[1080,1920],'samples':16,'fps':30,
                     'replacedFrames':2288,'fullNativeFrames':14846,'ranges':results,
                     'start':start_iso,'end':time.strftime('%Y-%m-%dT%H:%M:%S%z'),
                     'elapsedWallSeconds':time.time()-started,'cache':str(C7),'savedProject':str(saved),
                     'sourceVoiceCaptionsBgmChanged':False,'priorNativeFramesWritten':False,
                     'losslessIdenticalStateReuse':{k:(sorted(v) if isinstance(v,set) else v) for k,v in g['RENDER_REUSE'].items()}}
        except BaseException as error:
            traceback.print_exc();receipt={'completed':False,'error':repr(error),'elapsedWallSeconds':time.time()-started}
        finally:g['C'],ns['C']=previous
        destination.write_text(json.dumps(receipt,ensure_ascii=False,indent=2))
    return None
