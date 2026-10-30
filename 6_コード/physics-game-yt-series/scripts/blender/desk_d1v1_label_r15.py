"""N4 red band on the existing metal mesh; 3 trial + 2 catalog renders only."""
import ast,hashlib,json,os,runpy,shutil,time
import numpy as np
W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';C='/private/tmp/ys/ys-chain-d1v1-render'
SHA='004521c4fbb3657c9c891dc1aa24846d82c393620f4a97902973cc9fd3def5a2';LIB='742d96fcde56f4a2c0eb066600a6428c983a2f96d5b4907824cf4a39f31b7923'
OUT=C+'/blender/landmarks-d1v1-r15';CAT=C+'/blender/catalog-d1v1-final-r15';OLD=C+'/blender/catalog-d1v1-final-r8'
assert not os.path.exists(OUT) and not os.path.exists(CAT),'Existing D1 r15 media preserved'
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r15 printed-label-only bundle START',flush=True)
p=runpy.run_path(W+'/scripts/blender/desk_d1v1_reload_r10.py');p['install'].__globals__['EXPECTED_SOURCE']=SHA;p['install'].__globals__['EXPECTED_LIB']=LIB;p['install'].__globals__['NAMES']=p['NAMES']|{'can_state','visible'}
r=p['install'](nsD1);r['revision']='r15';r['updates']=['N4 red band is material faces of the same metal body; no independent hoop'];print(json.dumps(r),flush=True)
g=nsD1['main'].__globals__;can=g['P']['can']['can'];body=can['body'];bpy=g['bpy'];d=g['d'];bpy.context.window.scene=d.SC
def metal_sha():
    h=hashlib.sha256()
    for vertices in [body.data.vertices]+[k.data for k in body.data.shape_keys.key_blocks]:
        values=np.empty(len(vertices)*3,dtype=np.float32);vertices.foreach_get('co',values);h.update(values.tobytes())
    return h.hexdigest()
before=metal_sha();libpath=W+'/scripts/blender/desk_lib_d1.py';tree=ast.parse(open(libpath).read());nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=='attach_can_printed_label'];assert len(nodes)==1
exec(compile(ast.Module(body=nodes,type_ignores=[]),libpath,'exec'),g);g['attach_can_printed_label'](can);assert metal_sha()==before,'Metal geometry or metal shape key changed'
report=runpy.run_path(W+'/scripts/blender/desk_d1v1_semantic_audit_r9.py')['check'](nsD1,C+'/d1-semantic-physical-r15.json',revision='r15',expected_source=SHA)
held=[r for r in report['rows'] if not r['cameraTransition']];assert held and all(r['pass'] for r in held),'D1 held physical failures remain; no trial rendered'
impact=g['T']('can:crush','グシャット');times=[impact-1/30,impact+.075,126.17]
A=g['A'];A.times=','.join(map(str,times));A.out=OUT;A.force=False;A.start=0;A.stop=1e9;A.every=1;A.scale=1;A.samples=16;g['main']()
files=[str(round(t*30)).zfill(5)+'.jpg' for t in times];assert all(os.path.isfile(OUT+'/'+f) and os.path.getsize(OUT+'/'+f)>1000 for f in files)
json.dump({'episode':'D-1','revision':'r15','sourceSha256':SHA,'geometrySourceSha256':LIB,'metalVertexAndShapeKeySha256Before':before,'metalVertexAndShapeKeySha256After':metal_sha(),'metalGeometryChanged':False,'labelImplementation':'middle two existing body-face rings use the existing red material; obsolete GUI torus retained hidden','times':times,'files':files,'expectedFrames':3,'scene':d.SC.name,'status':'3 local real trial frames only; full-range current revision and original final gates pending','productionStarted':False,'strictInspectorWaiver':False},open(OUT+'/trial-coverage-d1v1-r15.json','w'),indent=1)
oldfiles=sorted(f for f in os.listdir(OLD) if f.endswith('.jpg'));assert len(oldfiles)==26;repair={'d1v1_can_oblique.jpg','d1v1_can_top.jpg'};os.makedirs(CAT)
for f in oldfiles:
    if f not in repair:shutil.copy2(OLD+'/'+f,CAT+'/'+f)
prior=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='JPEG'
try:
    g['reset']();g['visible']('can');bpy.context.view_layer.update()
    for top in [False,True]:
        d.catalog_camera((.22,-.12,.05),top,.24);d.SC.render.filepath=CAT+'/d1v1_can'+('_top.jpg' if top else '_oblique.jpg');bpy.ops.render.render(write_still=True,scene=d.SC.name)
finally:d.SC.render.image_settings.file_format=prior
sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest();copied=[f for f in oldfiles if f not in repair];assert all(sha(CAT+'/'+f)==sha(OLD+'/'+f) for f in copied)
json.dump({'episode':'D-1','revision':'r15','sourceCatalog':OLD,'sourceSha256':SHA,'geometrySourceSha256':LIB,'refreshed':sorted(repair),'copiedUnchanged':copied,'all24CopiesByteIdentical':True,'metalGeometryChanged':False,'onlyModelChange':'N4 red printed band follows the same metal surface and shape key','files':{f:sha(CAT+'/'+f) for f in oldfiles}},open(CAT+'/catalog-d1v1-provenance.json','w'),indent=1)
print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 r15 DONE: 3 trial, 2 can catalog, 24 byte-identical copies; NO production',flush=True)
