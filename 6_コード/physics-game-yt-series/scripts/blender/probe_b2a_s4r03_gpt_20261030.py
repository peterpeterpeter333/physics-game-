"""New isolated S3-quality correction proof, not a change to original QA."""
from pathlib import Path
import contextlib,json,runpy,time,traceback
import bpy

W=Path(__file__).resolve().parents[2]
R=W/'outputs/ys-chain-b2a-backup/S4修正03_20261030'


def run(ns,version='01'):
    out=R/('S3連続試写_'+version)
    out.mkdir(parents=True,exist_ok=False)
    started=time.time()
    with (out/'probe.log').open('x',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            mod=runpy.run_path(str(W/'scripts/blender/patch_b2a_s4r03_coordinator_gpt_20261030.py'))
            ctx=mod['install'](ns);g=ctx['g'];d=g['d'];ev=ctx['events'];r19=ctx['row19']['clock'];r27=ctx['alarm']['events']
            d.SC.render.resolution_x=540;d.SC.render.resolution_y=960
            d.SC.render.resolution_percentage=100;d.SC.eevee.taa_render_samples=4
            specs=[
                ('13_rub',118.0),('13_charge',ev['r13Spark']-.4),('13_spark',ev['r13Spark']+.05),
                ('19_machine',r19['turn']+.5),('19_spark',r19['spark']+.05),
                ('19_contact',r19['contact']+.1),('19_kick_peak',r19['kick']+.15),
                ('21_glyph',ev['r21Reveal']+.5),('21_pulse',ev['r21Pulse']+.55),
                ('22_path',.5*(ev['r22Circuit']+ev['r22CircuitEnd'])),
                ('27_before',r27['smokeArrivalAndFirstLamp']-.12),
                ('27_ring',r27['smokeArrivalAndFirstLamp']+.1),
                ('27_macro',r27['undersideOnePushInEnd']+.1),
                ('36_glyph',ev['r36Strike']-.2),('36_cancel',ev['r36Strike']+.2),
            ]
            records=[]
            for name,t in specs:
                j=round(t*30);t=j/30;s=g['apply'](t)
                file=out/(name+'.jpg');assert not file.exists()
                g['render_file'](file)
                rec={'name':name,'j':j,'time':t,'row':s['row'],'file':str(file),
                     'primary':g['measurement'](s['primary']),'anchors':g['label_anchors'](s)}
                if s['row']==27:
                    rec['alarm']=ctx['alarmModule']['measure_projected_groups'](g,ctx['alarm'])
                    rec['state']=ctx['alarm']['lastMetadata']
                if s['row']==19:
                    rec['layout']=ctx['row19']['layoutMeasurements']
                if s['row'] in (21,22,36):rec['glyph']=g['measurement']([ctx['glyph']])
                records.append(rec)
                print('R03_PROBE',name,j,flush=True)
            result={'completed':True,'records':records,'events':ev,'row19Clocks':r19,
                    'row27Clocks':r27,'warnings':g['EVENT_WARNINGS'],'elapsedSeconds':time.time()-started}
        except BaseException as e:
            traceback.print_exc();result={'completed':False,'error':repr(e),'elapsedSeconds':time.time()-started}
        (out/'probe-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    return None
