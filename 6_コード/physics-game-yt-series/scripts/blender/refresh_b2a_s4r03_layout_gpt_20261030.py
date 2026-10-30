"""Reload only newly authored row19/27 resources, retaining the live scene."""
from pathlib import Path
import contextlib,json,runpy,time,traceback
W=Path(__file__).resolve().parents[2]
R=W/'outputs/ys-chain-b2a-backup/S4修正03_20261030'


def run(ns,version='02'):
    out=R/('配置再点検_'+version);out.mkdir(parents=True,exist_ok=False)
    with (out/'refresh.log').open('x',buffering=1) as log,contextlib.redirect_stdout(log),contextlib.redirect_stderr(log):
        try:
            c=ns['_b2a_s4r03_coordinator'];g=c['g'];r19=c['row19']
            m=runpy.run_path(str(W/'scripts/blender/patch_b2a_s4r3_row19_gpt_20261030.py'))
            r19['stage'].__globals__['_show']=m['_show']
            r19['apply'].__globals__['_show']=m['_show']
            m['_layout'](r19)
            a=runpy.run_path(str(W/'scripts/blender/desk_b2a_row27_alarm_gpt_20261030.py'))
            a['migrate_probe01_adjustments'](g,c['alarm'],source_offset_z=-.04)
            c['alarmModule'].update(a)
            result={'completed':True,'row19Layout':r19['layoutMeasurements']}
            (out/'refresh-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
            probe=runpy.run_path(str(W/'scripts/blender/probe_b2a_s4r03_gpt_20261030.py'))
            probe['run'](ns,version=version)
            audit=runpy.run_path(str(W/'scripts/blender/check_b2a_s4r3_row19_gpt_20261030.py'))
            audit['run'](ns,r19,output_dir=out/'row19投影面積検査')
        except BaseException as e:
            traceback.print_exc()
            (out/'error.json').write_text(json.dumps({'completed':False,'error':repr(e)},ensure_ascii=False,indent=2))
    return None
