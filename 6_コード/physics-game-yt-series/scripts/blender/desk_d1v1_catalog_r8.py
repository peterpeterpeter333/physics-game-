"""Preserve 24 approved portraits and refresh only the corrected mine/horse pair."""
import os,json,hashlib,shutil
def finish(ns,out='/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-final-r8'):
    source='/private/tmp/ys/ys-chain-d1v1-render/blender/catalog-d1v1-final';g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];bpy.context.window.scene=d.SC
    assert not os.path.exists(out),'Existing D1 r8 catalog preserved'
    files=sorted(f for f in os.listdir(source) if f.endswith('.jpg'));assert len(files)==26
    repair={'d1v1_mine_oblique.jpg','d1v1_mine_top.jpg'};os.makedirs(out)
    for name in files:
        if name not in repair:shutil.copy2(source+'/'+name,out+'/'+name)
    prior=d.SC.render.image_settings.file_format;d.SC.render.image_settings.file_format='JPEG'
    try:
        g['reset']();g['visible']('mine','horse');g['mine_state'](20);g['horse_state'](20);bpy.context.view_layer.update()
        for top in [False,True]:
            d.catalog_camera((-.20,.10,.18),top,.40);d.SC.render.filepath=out+'/d1v1_mine'+('_top.jpg' if top else '_oblique.jpg');bpy.ops.render.render(write_still=True,scene=d.SC.name)
    finally:d.SC.render.image_settings.file_format=prior
    sha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest();record={'episode':'D-1','revision':'r8','sourceCatalog':source,'refreshed':sorted(repair),'modelMeshesChanged':False,'correctedState':'Horse stays on grass, tangent to orbit; slender pillar reveals winch arm','files':{f:sha(out+'/'+f) for f in files}}
    json.dump(record,open(out+'/catalog-d1v1-provenance.json','w'),indent=1);return record
