"""CPU-only C20 scalar/AST regression proof; never imports or runs Blender."""
import ast,hashlib,json,runpy
from pathlib import Path
import numpy as np

W=Path(__file__).resolve().parents[2]
old=W/'scripts/blender/desk_axes_c1_final_visible_bundle_r19.py'
new=W/'scripts/blender/desk_axes_c1_final_visible_bundle_r20.py'
out=Path('/private/tmp/ys/ys-chain-c1v1/c1-r20-runtime-fix-static-proof.json')
assert not out.exists()
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
assert sha(old)=='50f591dee6c59c0105cc8f360bedd391560b6f2ac8342a1786fe5c29216a5171'
trees=[ast.parse(p.read_text()) for p in (old,new)]
def nested(tree,name):
    setup=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='setup')
    return next(n for n in setup.body if isinstance(n,ast.FunctionDef) and n.name==name)
stable=['score_changed','score_phase','base_pose','baseline','world_points','project','measure','fit','paper_roots','new_pose','apply','physical','verify']
for name in stable:assert ast.dump(nested(trees[0],name),include_attributes=False)==ast.dump(nested(trees[1],name),include_attributes=False),name
a=nested(trees[0],'panel_visible');b=nested(trees[1],'panel_visible')
assert isinstance(b.body[-1].value,ast.Call) and isinstance(b.body[-1].value.func,ast.Name) and b.body[-1].value.func.id=='bool'
b.body[-1].value=b.body[-1].value.args[0]
assert ast.dump(a,include_attributes=False)==ast.dump(b,include_attributes=False)
m=runpy.run_path(str(new));scalar=m['json_scalar']
v={'visible':np.bool_(True),'width':np.float64(.6600000000000001),'frames':np.int64(10814)}
native=json.loads(json.dumps(v,default=scalar,allow_nan=False))
assert native=={'visible':True,'width':.6600000000000001,'frames':10814} and type(native['visible']) is bool
rejected=[]
for label,value in [('array',np.array([1])),('unknown',object()),('NaN',np.float64(float('nan'))),('infinity',np.float64(float('inf')))]:
    try:json.dumps(value,default=scalar,allow_nan=False)
    except (TypeError,ValueError):rejected.append(label)
assert len(rejected)==4
oldtrial=Path('/private/tmp/ys/ys-chain-c1v1-visible-r19-trial')
assert oldtrial.exists() and not list(oldtrial.rglob('*.jpg'))
report={'sourceSha256':{str(old):sha(old),str(new):sha(new),str(Path(__file__).resolve()):sha(__file__)},'unchangedNumericalAndActionFunctionsAstEqual':stable,'panelVisibilityOnlyChange':'native bool around the identical area>1 test','nativeScalarPrecisionPreserved':native,'unsupportedOrNonFiniteRejected':rejected,'oldC19TrialPreserved':str(oldtrial),'oldC19TrialInventory':[str(p) for p in oldtrial.rglob('*')],'oldC19JpegCount':0,'restoreToleranceUnchanged':1e-12,'restoreRuntimeNotYetVerified':True,'cameraGeometryGatesNotRunByThisScript':True,'actualImagesApproved':False,'noBlenderRenderOrQueueSubmission':True}
out.write_text(json.dumps(report,ensure_ascii=False,indent=1,allow_nan=False))
print(json.dumps({'out':str(out),'stableFunctions':len(stable),'scalarCases':4,'runtimeRestorePending':True}))
