"""後編の新しい部品だけを同じ机・光で撮る。元ソース/模型は変更しない。"""
import os, json

def render(ns):
    import bpy
    import importlib
    import desk_d1ab_shotqa_gpt_20261026 as qa
    qa = importlib.reload(qa)
    d, M = ns['d'], ns['M']
    out = ns['A'].cache + '/blender/catalog-v4_gpt_20261026'
    os.makedirs(out, exist_ok=True)
    specs = [
        ('layout', 1.5, None, []),
        ('boiler', 76, None, ['kwater', 'bubbles', 'kpuffs', 'flames']),
        ('steam_valve_and_tap', 90, None, ['sdrops', 'tapstream']),
        ('cylinder_piston', 102, None, ['film', 'airdots', 'steamfill']),
        ('beam_chain_rod', 122, None, []),
        ('bottom_pump_down', 247.7, None, ['barrelwater', 'belowwater', 'pdrops']),
        ('bottom_pump_up', 256.5, None, ['barrelwater', 'belowwater', 'pdrops']),
        ('bottom_foot_valve', 265.7, None, ['barrelwater', 'belowwater', 'pdrops']),
        ('drain_valve', 335, None, ['ddrops', 'dair', 'dtubwater']),
        ('tank', 343, None, ['tankwater']),
        ('jack_pump', 351, None, ['jwater', 'jdrops', '_gpt_jin_drops']),
        ('lever_and_tappets', 414, None, []),
    ]
    receipt = []
    for name, t, _, fluids in specs:
        ns['apply'](t)
        cue = ns['cue_at'](t)
        primary, candidates, reason = qa.semantic_primary(ns, cue, t)
        excluded = set(M.get('_gpt_obsolete', []))
        meshes = qa._visible_meshes(candidates, excluded)
        if not meshes: raise RuntimeError(('catalog primary missing', name))
        oldvisible = {obj for obj in d.SC.objects if not obj.hide_render}
        chosen = set(meshes)
        for role in fluids:
            chosen.update(obj for obj in qa._objects(M.get(role)) if obj in oldvisible)
        d.catalog_stage()
        for obj in chosen: d.show(obj, True)
        measurement = qa._project(ns, meshes, {})
        center = measurement['world_center']
        for top in (False, True):
            d.catalog_camera(center, top)
            d.CAM_D.dof.aperture_fstop = 32 if name == 'jack_pump' else 11
            for attempt in range(5):
                bpy.context.view_layer.update()
                measure = qa._project(ns, meshes, {})
                ratio = max(measure['width_ratio'] / .62, measure['height_ratio'] / .72)
                if abs(ratio - 1) < .025: break
                d.CAM_D.lens /= ratio
            bpy.context.view_layer.update()
            path = out + '/' + name + ('_top.jpg' if top else '_oblique.jpg')
            if not os.path.exists(path):
                d.SC.render.filepath = path
                bpy.ops.render.render(write_still=True, scene=d.SC.name)
            receipt.append({'part': name, 'source_time': t, 'primary': primary,
                            'reason': reason, 'view': 'top' if top else 'oblique',
                            'image': path, 'measurement': qa._project(ns, meshes, {}),
                            'lens': d.CAM_D.lens})
            print('CATALOG', name, top, flush=True)
    json.dump(receipt, open(out + '/catalog-receipt.json', 'w'), ensure_ascii=False, indent=1)
    ns['apply'](1.5)
    return out
