"""Pure AST timing reproduction. No bpy, scene application, imports of episodes, or file writes."""
import ast,hashlib,json,math,types
from pathlib import Path
W=Path(__file__).resolve().parents[2]
old=W/'scripts/blender/desk_axes_b1_repel_b5_v3_20261024.py'
new=W/'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py'
stage=W/'scripts/blender/desk_b1v1.py'
shared=W/'scripts/blender/desk_lib.py'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def tree(p):return ast.parse(p.read_text())
def one(t,name):return next(n for n in ast.walk(t)if isinstance(n,ast.FunctionDef)and n.name==name)
def code(nodes,p,scope):exec(compile(ast.Module(body=nodes,type_ignores=[]),str(p),'exec'),scope)
assert sha(old)=='b5284ff4c264a57153d2f4bc31480e37f6b7e4bea019b579bdd967b4bba6dc6d'
ot,nt,st,dt=tree(old),tree(new),tree(stage),tree(shared)
dscope={};code([one(dt,n)for n in ['clamp','sm','seg','lin','back']],shared,dscope)
d=types.SimpleNamespace(**dscope);uscope={'d':d};code([one(st,'u')],stage,uscope)
def stages(t):
 scope={'d':d,'g':{'u':uscope['u']},'math':math}
 for node in t.body:
  if isinstance(node,ast.Assign)and any(isinstance(x,ast.Name)and x.id in ['SPIN_START','SPIN_END','ATTACH_START','ATTACH_END','RECOIL_METERS']for x in node.targets):
   code([node],new,scope)
 code([one(t,'stages')],new,scope)
 return scope['stages']
o,n=stages(ot),stages(nt)
samples=[94.6,96.8,97.08,97.43,97.6,97.65,97.83333333333333,98.,98.2,98.4,98.6,98.66666666666667]
rows=[{'time':t,'oldStages':o(t),'newStages':n(t)}for t in samples]
assert all(o(t)[:2]==n(t)[:2]for t in samples),'Do not alter recoil or comic spin'
assert n(98.2)[2]==0 and abs(n(98.4)[2]-.5)<1e-12 and n(98.6)[2]==1
assert o(98.66666666666667)[2]<.0001
equal_functions=['tree','principal','poles','nearest_poles','world_points','project','place','measure','corrected_pose','state']
for name in equal_functions:assert ast.dump(one(ot,name),include_attributes=False)==ast.dump(one(nt,name),include_attributes=False),name
old_gap=next(x for x in ast.walk(ot)if isinstance(x,ast.Assert)and 'actual_gap' in ast.dump(x.test))
new_gap=next(x for x in ast.walk(nt)if isinstance(x,ast.Assert)and 'actual_gap' in ast.dump(x.test))
assert ast.dump(old_gap.test)==ast.dump(new_gap.test)
result={'kind':'Pure AST reproduction of B5v3 end-time versus duration bug; not a GUI result',
 'inputs':[{'path':str(p),'sha256':sha(p)}for p in [old,new,stage,shared]],
 'uDefinition':ast.unparse(one(st,'u')),'segDefinition':ast.unparse(one(dt,'seg')),
 'oldAttachmentExpression':'u(t,98.20,98.60)','newAttachmentExpression':'u(t,98.20,98.60-98.20)',
 'oldDurationSeconds':98.6,'newDurationSeconds':98.6-98.2,'samples':rows,
 'oldAttachmentProgressAtFailedFinalCheck':o(98.66666666666667)[2],
 'newAttachmentProgressAtSameFinalCheck':n(98.66666666666667)[2],
 'recoilAndSpinNumericallyUnchangedAtAllSamples':True,'matrixPlacementGeometryFunctionsASTUnchanged':equal_functions,
 'strictGapAssertionTestASTUnchanged':ast.unparse(new_gap.test),'strictGapToleranceMeters':1e-6,
 'cause':'Frozen episode u takes a duration; the prior helper accidentally supplied an absolute end time. This alone prevents end-stage closure. No matrix/depsgraph workaround or tolerance relaxation is used.',
 'oldFailedRuntimeRecord':'/private/tmp/ys/ys-chain-b1v1-repel-b5-v3-20261024/probe/report.json',
 'actualRuntimeGapValueNotRecordedInOldFailure':True,'newGUIPhysicalGuardSuccess':False,
 'noGPUCalls':True,'noFileWritesByThisScript':True,'noOriginalSourceOrEvidenceEdited':True,'finalAcceptance':False}
print(json.dumps(result,ensure_ascii=False,indent=1))
