"""Select a different owned scene deliberately, prove B renders only B outputs."""
import ast,os,json,time,hashlib
c='/private/tmp/ys/ys-chain-b1v1';ns=nsB1r6;g=ns['main'].__globals__;bpy=g['bpy']
tree=ast.parse(open(g['__file__']).read());names={'main','catalog','write_problem'}
nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names];assert len(nodes)==3
exec(compile(ast.Module(body=nodes,type_ignores=[]),g['__file__'],'exec'),g)
for name in names:ns[name]=g[name]
assert ns['main'].__globals__ is g
def fingerprints():
    result={}
    for scene in bpy.data.scenes:
        if scene is g['d'].SC:continue
        file=scene.render.filepath
        if os.path.isfile(file):result[file]={'mtimeNs':os.stat(file).st_mtime_ns,'sha256':hashlib.sha256(open(file,'rb').read()).hexdigest()}
    return result
before=fingerprints();bpy.context.window.scene=nsE1['apply'].__globals__['d'].SC
initial=bpy.context.scene.name;a=g['A'];a.times='63,135.6';a.out=c+'/blender/context-proof-b1v1-r8';a.force=False;a.samples=16;a.scale=1;a.start=0;a.stop=1e9;a.every=1
began=time.time();g['main']()
assert bpy.context.scene is g['d'].SC
after=fingerprints();assert before==after,'A different episode output was touched'
for t in [63,135.6]:
    f=a.out+'/%05d.jpg'%round(t*30);raw=open(f,'rb').read();assert raw[:2]==b'\xff\xd8' and raw[-2:]==b'\xff\xd9' and os.stat(f).st_mtime>=began
json.dump({'pass':True,'beforeActiveScene':initial,'afterActiveScene':bpy.context.scene.name,'sourceSha256':hashlib.sha256(open(g['__file__'],'rb').read()).hexdigest(),'otherSceneFilesUntouched':before,'actualImages':2,'seconds':time.time()-began},open(c+'/blender/context-proof-b1v1-r8.json','w'),indent=1)
print('B1 explicit-scene actual proof PASS,2 real JPEGs,other scene files unchanged',flush=True)
