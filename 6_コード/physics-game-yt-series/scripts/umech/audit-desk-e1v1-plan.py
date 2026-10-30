"""Read-only planning diagnostic, no bpy import and no render."""
import ast,json,math,os,collections
path=os.path.abspath(os.path.join(os.path.dirname(__file__),'../blender/desk_e1v1.py'))
data=json.load(open('/private/tmp/ys/ys-chain-e1v1/blender/data.json'))
cues={c['key']:c for c in data['cues']}
def T(key,word,occ=0):return [w['time'] for w in cues[key]['wordEvents'] if word in w['word']][occ]
scope={'CUES':data['cues'],'S':lambda k:cues[k]['start'],'E':lambda k:cues[k]['end'],'T':T,'DUR':data['duration'],'FPS':30,'math':math}
nodes=[]
for n in ast.parse(open(path).read(),path).body:
    if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id in ['SPANS','EVENTS']:nodes.append(n)
    elif isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS':nodes.append(n)
    elif isinstance(n,ast.FunctionDef) and n.name=='plan':nodes.append(n)
exec(compile(ast.Module(body=nodes,type_ignores=[]),path,'exec'),scope)
nf=math.ceil(data['duration']*30);counts=collections.Counter(scope['plan'](j)[0] for j in range(nf))
result={'scope':'deterministic plan calculation, no rendering','frames':nf,'counts':dict(counts),'renderFraction':counts['render']/nf,'source':path,'eta':'not estimated until actual GUI per-frame times exist'}
json.dump(result,open('/private/tmp/ys/ys-chain-e1v1/e1v1-render-plan-stats.json','w'),indent=2)
print(json.dumps(result,indent=2))
