"""No-render check: deterministic r15 water surfaces must have intended centers.

This does not install or alter any function. Root may call it only after the
strict v3 restoration has succeeded. Existing source and evidence are retained.
"""
import hashlib,json,time
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
SOURCE=W/'scripts/blender/desk_d1v1.py'
SOURCE_SHA='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2'
V3_SHA='c5f5f26cafcb9148d1c6cae5bdf13917a68d153b1459662adc9b0770c965cc07'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def check(ns,authorized=False,out=None):
    assert authorized is True,'Only root may queue this no-render check'
    target=Path(out or C/'d1-water-intent-after-v3-20261024.json')
    assert not target.exists() and not target.is_symlink(),'Keep existing evidence'
    assert sha(SOURCE)==SOURCE_SHA
    marker=ns['D1_DETERMINISTIC_RESET_V3'];assert marker['helperSha256']==V3_SHA
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy']
    assert g['reset'] is marker['wrapper'] and g['_VIS_QUEUE'] is None
    old_scene=bpy.context.window.scene;identities=[o.as_pointer() for o in d.SC.objects]
    rows=[];started=time.time()
    report={'episode':'D-1','kind':'No-render water intention check after strict restoration','startedAt':time.strftime('%Y-%m-%d %H:%M:%S'),'sourceSha256':SOURCE_SHA,'v3HelperSha256':V3_SHA,'helperSha256':sha(__file__),'renders':0,'functionsInstalled':False,'sourceModified':False,'originalStrictTolerance':1e-5,'rows':rows,'passed':False}
    try:
        bpy.context.window.scene=d.SC
        # Different preceding model/camera states expose transform history.
        for predecessor in (403.3,169.8,248.5):
            g['apply'](predecessor);bpy.context.view_layer.update()
            for t in (0.,0.,20.,34.216667,250.,403.3):
                g['apply'](t);bpy.context.view_layer.update()
                w=g['water'](t)
                for key,height,base in (('shaft',max(.008,w),.02),('pool',max(.006,w*.15),.023)):
                    o=g['P']['mine'][key];expected=base+height/2
                    row={'predecessor':predecessor,'time':t,'object':key,'waterMeters':w,'expectedHeightMeters':height,'actualHeightMeters':float(o.dimensions.z),'expectedCenterZMeters':expected,'actualCenterZMeters':float(o.location.z),'worldCenterZMeters':float(o.matrix_world.translation.z)}
                    row['maximumDifferenceMeters']=max(abs(row['actualHeightMeters']-height),abs(row['actualCenterZMeters']-expected),abs(row['worldCenterZMeters']-expected))
                    row['pass']=row['maximumDifferenceMeters']<=1e-5
                    rows.append(row)
        report['passed']=all(r['pass'] for r in rows)
        report['maximumDifferenceMeters']=max(r['maximumDifferenceMeters'] for r in rows)
        assert report['passed'],'Water centers/heights must match their intended frozen formula, not merely repeat deterministically'
        return report
    except BaseException as e:
        report['error']={'type':type(e).__name__,'message':str(e)};raise
    finally:
        assert sha(SOURCE)==SOURCE_SHA and identities==[o.as_pointer() for o in d.SC.objects]
        assert g['reset'] is marker['wrapper'] and g['_VIS_QUEUE'] is None
        bpy.context.window.scene=old_scene
        report['seconds']=round(time.time()-started,3)
        target.write_text(json.dumps(report,ensure_ascii=False,indent=1))
        print('D1 WATER INTENT',report['passed'],str(target),flush=True)
