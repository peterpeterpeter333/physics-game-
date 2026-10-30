"""Pure control-data test; no bpy, physical fit or actual probe claim."""
import hashlib
import json
from pathlib import Path
import runpy

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C = Path('/private/tmp/ys/ys-chain-e1v1')
OUT = C/'e1v1-local-fit-schedule-20261024.json'


def main():
    assert not OUT.exists()
    helper = W/'scripts/blender/desk_axes_e1_local_fit_20261024.py'
    h = runpy.run_path(str(helper))
    runner = runpy.run_path(str(W/'scripts/blender/desk_axes_e1_r9_production.py'))
    _, plans = runner['frozen_plan']()
    cues = json.loads((C/'blender/data.json').read_text())['cues']
    refs = sorted({j if p[0]=='render' else p[1] for j,p in enumerate(plans)
                   if h['current'](cues,j/30)['key'] in h['KEYS']
                   and j/30 < h['current'](cues,j/30)['start']+h['current'](cues,j/30)['move']})
    maximum = {k:{'distanceChanged':True,'pose':[0,0,0,1,0,35,40]} for k in refs}
    mapping, sources = h['dependent_mapping'](plans,maximum)
    assert len(refs)==len(sources)==len(mapping)==60
    assert all(plans[k][0]=='render' and j==k for j,k in mapping.items())
    assert all(round(t*30) in sources for t in h['PROBE_TIMES'])
    # Independent toy exercises the held-dependency branch absent from the two
    # real full-render moving intervals. No hold may be silently dropped.
    toy=[('render',None),('dup',0),('dup',0),('render',None),('dup',3)]
    a,b=h['dependent_mapping'](toy,{0:{'distanceChanged':True,'pose':[0,0,0,1,0,35,40]}})
    assert a=={0:0,1:0,2:0} and b=={0:0}
    a,b=h['dependent_mapping'](toy,{0:{'distanceChanged':False,'pose':[0,0,0,1,0,35,40]}})
    assert not a and not b
    result={'helper':str(helper),'helperSha256':hashlib.sha256(helper.read_bytes()).hexdigest(),
            'candidateOriginalActualStates':60,
            'actualRangesByCue':{key:{'firstFrame':min(k for k in refs if h['current'](cues,k/30)['key']==key),
                                           'lastFrame':max(k for k in refs if h['current'](cues,k/30)['key']==key),
                                           'actualFrames':sum(h['current'](cues,k/30)['key']==key for k in refs)} for key in h['KEYS']},
            'maximumRepairOutputsIfAll60NeedDistanceChange':len(mapping),
            'toyChangedSourceAllDependentHoldsCovered':True,'toyUnchangedSourceNotReplaced':True,
            'physicalFitAndActualProbeStillRequired':True,'bpyImported':False,'renderCalls':0,'originalSourcesEdited':False}
    with OUT.open('x') as f:
        json.dump(result,f,ensure_ascii=False,indent=1);f.write('\n')
    print(OUT)


if __name__=='__main__':
    main()
