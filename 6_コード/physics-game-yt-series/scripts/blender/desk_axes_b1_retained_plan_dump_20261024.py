"""Read retained B scheduling data exactly; no apply/render or state writes."""
import hashlib,json,types
from pathlib import Path
gB=nsB1r6['main'].__globals__
p=Path('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')
assert not p.exists()
def signature(code):
    return {'bytes':code.co_code.hex(),'names':list(code.co_names),'vars':list(code.co_varnames),'constants':[signature(x) if isinstance(x,types.CodeType) else repr(x) for x in code.co_consts]}
plans=[list(gB['plan'](j)) for j in range(10700)]
meta=json.loads(Path('/private/tmp/ys/ys-chain-b1v1/blender/desk/meta.json').read_text())
actual=[j for j,r in enumerate(plans) if r[0]=='render']
record={'scope':'Read-only retained GUI plan; not independent canonical-source certification','sourcePath':gB['__file__'],'sourceSha256':hashlib.sha256(Path(gB['__file__']).read_bytes()).hexdigest(),'planCode':signature(gB['plan'].__code__),'SPANS':gB['SPANS'],'EVENTS':gB['EVENTS'],'CUES':gB['CUES'],'plans':plans,'actualRenderFrames':actual,'metaDone':meta['done'],'exactRenderFramesMatchOriginalMeta':sorted(actual)==sorted(meta['done']),'renders':0,'applyCalls':0,'namespaceBindingsChanged':False}
p.write_text(json.dumps(record,ensure_ascii=False,indent=1))
print('B1 RETAINED PLAN',len(actual),record['exactRenderFramesMatchOriginalMeta'],str(p),flush=True)
