"""Check the pure frame plan without starting Blender or touching its scene."""
import ast,json,math,bisect
from pathlib import Path
W=Path(__file__).resolve().parents[2];C=Path('/private/tmp/ys/ys-chain-1-2v1-render')
data=json.loads((C/'blender/data.json').read_text())['episode12'];cues=data['cues']
source=ast.parse((W/'scripts/blender/desk_1_2v1_state.py').read_text())
nodes=[]
for n in source.body:
    if isinstance(n,ast.FunctionDef) and n.name in ['cue_at','plan12']:nodes.append(n)
    if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['SPANS','EVENTS'] for t in n.targets):nodes.append(n)
    if isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':nodes.append(n)
ns={'CUES':cues,'STARTS':[c['start'] for c in cues],'FPS':30,'math':math,'bisect':bisect}
exec(compile(ast.fix_missing_locations(ast.Module(body=nodes,type_ignores=[])),'render-plan-only','exec'),ns)
plan=[ns['plan12'](j) for j in range(math.ceil(data['duration']*30))]
bad=[(j,p[1],plan[p[1]]) for j,p in enumerate(plan) if p[0]=='dup' and (p[1]>j or plan[p[1]][0]!='render')]
if bad:raise AssertionError(('Clone points to non-rendered source',bad[:20]))
(C/'blender/plan-1-2v1.json').write_text(json.dumps(plan))
print('All clone sources are independently rendered:',len(plan),'frames,',sum(p[0]=='render' for p in plan),'renders')
