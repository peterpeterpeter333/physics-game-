"""Read-only, exact 30fps semantic-state audit of frozen C production holds.

The original scene_key is evaluated from its AST, not reimplemented. The
signature covers every otherwise-unkeyed object/hand visibility or time-driven
state used by apply_state/calculator_state/mechanism_state/hands. It does not
change the original cache, formulas, source files or production output.
"""
import ast,hashlib,json,math,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ROOT=Path('/private/tmp/ys/ys-chain-c1v1')
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def signature(g,t):
    c=g['cue_at'](t);r=c['row'];group=c['group'];d=g['d'];fx=g['FX'];s=g['S'];tw=g['T'];st=g['wheel_steps'](t)
    q={}
    m1=group in ['m1','order','m2','arm','eight'] or r==43
    m2=group in ['m2','arm'] or r==20 and t<s('carry:ten')+1
    if m1:
        u=d.lin(t,fx['box'],fx['box']+.8)
        q['M1.drop.z']=.22*(1-d.back(u)) if t<fx['box']+.8 else 0
        q['M1.lid.x']=-110*d.seg(t,fx['box']+.3,fx['box']+1.1)
        q['M1.priceTag.visible']=t>=s('dad:price')
    q['M2.visible']=m2
    if m2:
        starts=[s(k) for k in ['carry:simple','hard:9999','arm:lift','arm:wait','ch:intro']]
        start=max([a for a in starts if a<=t] or [starts[0]])
        u=d.seg(t,start,start+1)
        q['M2.rise.scale']=d.lerp(1/1.7,1,u);q['M2.rise.z']=-.10*(1-u)
        if r==20:
            u=d.seg(t,s('carry:ten'),s('carry:ten')+1)
            q['M2.rise.scale']=d.lerp(1,1/1.7,u);q['M2.rise.z']=-.10*u
        q['M2.arms.visible']=s('arm:lift')<=t<s('dad:proto') or s('ch:intro')<=t<s('last:desk')
    # The hand's place changes without necessarily changing wheel digits.
    if r in [12,13,14,15,16,20]:
        q['hand']=('M1',3 if r==13 and t<tw('gear:27','一の位の歯車') or r==20 else 4,160 if r==12 else 60,-30 if r==12 else -32)
    elif r in [24,25,26,27,29,30,33,42]:q['hand']=('eight' if r==27 else 'M2',4)
    else:q['hand']=None
    # Dynamic paper/flame/crowd/Pascal/meter/shishi/domino/score/proto/tag
    # states are all explicit live frames in frozen scene_key, except the
    # settled proto state after row36, which is constant by row37's first key.
    return tuple((k,round(v,7) if isinstance(v,float) else v) for k,v in sorted(q.items()))

def audit(g):
    seen={};old=[]
    for j in range(g['NF']):
        key=g['scene_key'](j/30)
        if key not in seen:seen[key]=j
        old.append(seen[key])
    signatures=[signature(g,j/30) for j in range(g['NF'])]
    exact={};new=[];affected=[]
    for j,ref in enumerate(old):
        key=(g['scene_key'](j/30),signatures[j]);exact.setdefault(key,j)
        newref=ref if signatures[j]==signatures[ref] else exact[key]
        new.append(newref)
        if newref!=ref:
            changed=[k for k,v in signatures[j] if dict(signatures[ref]).get(k)!=v]
            affected.append({'frame':j,'time':j/30,'cue':g['cue_at'](j/30)['key'],'oldHeldFrame':ref,'oldHeldTime':ref/30,'newSemanticFrame':newref,'newSemanticTime':newref/30,'changedSemanticFields':changed,'oldSemanticState':dict(signatures[ref]),'requiredSemanticState':dict(signatures[j])})
    return {'frames':g['NF'],'oldUnique':len(seen),'semanticCorrections':affected,'oldMap':old,'semanticMap':new,'method':'Original scene_key AST plus exact requested-time semantic signatures; a wrong held state is re-mapped only when these signatures differ; original object formulas are not modified.'}

def standalone():
    source=W/'scripts/blender/desk_c1v1.py';lib=W/'scripts/blender/desk_lib.py';data=ROOT/'blender/data.json';prod=ROOT/'c1-production-r13.json'
    original=json.loads(prod.read_text());assert all(sha(p)==h for p,h in {**original['sourceSha256'],**original['immutableInputSha256']}.items())
    ds={};tree=ast.parse(lib.read_text());names={'clamp','sm','seg','lin','lerp','back','pose_mix'}
    exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names],type_ignores=[]),str(lib),'exec'),ds)
    d=types.SimpleNamespace(**{k:ds[k] for k in names});b=json.loads(data.read_text());g={'d':d,'math':math,'CUES':b['cues'],'CUE':{c['key']:c for c in b['cues']},'DUR':b['duration'],'FX':b['effects'],'EVENTS':b['events'],'FPS':30,'NF':math.ceil(b['duration']*30)}
    g['S']=lambda k:g['CUE'][k]['start'];g['E']=lambda k:g['CUE'][k]['end'];g['VE']=lambda k:g['CUE'][k]['voiceEnd']
    tree=ast.parse(source.read_text());names={'T','cue_at','digits','wheel_steps','cam_keys','raw_pose','scene_key'}
    exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names],type_ignores=[]),str(source),'exec'),g);g['KEYS']=g['cam_keys']()
    report=audit(g);assert report['oldUnique']==original['uniqueStates']==4317
    report.update(sourceSha256={str(p):sha(p) for p in [source,lib,data,prod,Path(__file__)]},originalRawNotModified=True,notAVisualReview=True)
    output=ROOT/'c1-semantic-hold-audit-r15.json';assert not output.exists();output.write_text(json.dumps(report,ensure_ascii=False,indent=1))
    by={}
    for r in report['semanticCorrections']:
        v=by.setdefault(r['cue'],{'count':0,'first':r['time'],'last':r['time'],'fields':set()});v['count']+=1;v['last']=r['time'];v['fields'].update(r['changedSemanticFields'])
    for v in by.values():v['fields']=sorted(v['fields'])
    print(json.dumps({'output':str(output),'affected':len(report['semanticCorrections']),'byCue':by},ensure_ascii=False,indent=1))
if __name__=='__main__':standalone()
