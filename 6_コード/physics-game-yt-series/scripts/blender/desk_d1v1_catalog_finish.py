"""D1 catalog-only framing repairs; production scene geometry and timing stay fixed."""
import os,shutil,json,hashlib
def finish(ns,out,source='/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-r4'):
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];bpy.context.window.scene=d.SC
    if os.path.exists(out):raise RuntimeError('Existing D1 catalog is preserved; choose a fresh output')
    files=sorted(f for f in os.listdir(source) if f.endswith('.jpg'));assert len(files)==26
    repair={'d1v1_area_oblique.jpg','d1v1_area_top.jpg','d1v1_weights_oblique.jpg','d1v1_weights_top.jpg'}
    os.makedirs(out)
    for name in files:
        if name not in repair:shutil.copy2(os.path.join(source,name),os.path.join(out,name))
    prior=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='JPEG'
    try:
        for name,groups,center,span in [('area',['area','heavy'],(.24,-.10,.07),.30),('weights',['weights'],(.29,-.04,.05),.18)]:
            g['reset']();g['visible'](*groups)
            if name=='weights':
                # These opposing-force arrows belong to the later hand/can cue;
                # they need not hide the 100kg engraving in this part portrait.
                d.show_tree(g['P']['weights']['up'],False);d.show_tree(g['P']['weights']['down'],False)
            for top in [False,True]:
                d.catalog_camera(center,top,span);d.SC.render.filepath=os.path.join(out,'d1v1_'+name+('_top.jpg' if top else '_oblique.jpg'));bpy.ops.render.render(write_still=True,scene=d.SC.name)
    finally:d.SC.render.image_settings.file_format=prior
    sha=lambda f:hashlib.sha256(open(f,'rb').read()).hexdigest()
    record={'episode':'D-1','sourceCatalog':source,'reframed':sorted(repair),'geometryChanged':False,'files':{f:sha(os.path.join(out,f)) for f in files}}
    json.dump(record,open(os.path.join(out,'catalog-d1v1-provenance.json'),'w'),indent=1);return record
