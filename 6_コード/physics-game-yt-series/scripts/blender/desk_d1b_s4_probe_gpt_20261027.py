"""Read actual loaded S4 poses; render only explicitly requested new trial frames."""
import json
from pathlib import Path

def fill_integer_grid(gui):
    import bpy
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    root=Path(ns['A'].cache); raw=root/'review/motion-final'
    p=json.loads((Path(ns['__file__']).parents[2]/'outputs/ys-chain-d1b-backup/S4_20261027/independent-probe-plan_20261027.json').read_text())
    expected=set()
    for w in p['windows']:
        expected.update(range(w['firstFrame'],w['lastFrame']+1,30//w['fps']))
    missing=sorted(j for j in expected if not (raw/('%05d.jpg'%j)).is_file())
    if missing: gui.preview([j/30 for j in missing],str(raw),4)
    with (root/'review/integer-grid-complete.json').open('x') as f:
        json.dump(dict(sourceKey=ns['render_key'](),expected=len(expected),filled=missing,
            allPresent=all((raw/('%05d.jpg'%j)).is_file() for j in expected)),f)
    with (root/'review/scene-inventory.json').open('x') as f:
        json.dump(dict(current=ns['d'].SC.name,scenes=[dict(name=s.name,objects=len(s.objects)) for s in bpy.data.scenes]),f)
    return None

def door_candidates(gui):
    gui.refresh_behavior()
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    old=ns['CAM']['door'][:]
    try:
        for i,cam in enumerate([
            [-.435,.10,.10,.30,-50,15,50],
            [-.435,.10,.10,.26,-60,15,45],
            [-.435,.10,.10,.30,-35,15,45],
        ]):
            ns['CAM']['door']=cam
            gui.preview([238.266667],str(Path(ns['A'].cache)/('review/door-candidate%d'%i)),4)
    finally: ns['CAM']['door']=old
    return None

def run(gui):
    gui.refresh_behavior()
    ns=gui.EPISODES['d1b_s4']['main'].__globals__
    result=[]
    for t in [319.966667,326.9,333.2,334.8,350.366667]:
        cam,st,X=ns['apply'](t)
        M=ns['M']; panel=M['s4']['drain']['panel']; root=M['dflap']
        result.append(dict(time=t,drain=st['drain'],rootEuler=list(root.rotation_euler),
            rootBase=list(M['dflap_base']),panelWorld=[list(row) for row in panel.matrix_world],
            primary=ns['measure_primary'](t,st,X)))
    p=Path(ns['A'].cache)/'review/pass2-live-pose.json'
    with p.open('x') as f: json.dump(result,f,ensure_ascii=False,indent=1)
    return gui.preview([23.166667,24.966667,47,50.666667,122.266667,238.266667,264.066667,264.566667,265.366667,319.966667,326.9,333.2,334.8,350.366667,355.966667,446.9,459.933333],
        str(Path(ns['A'].cache)/'review/pass2'),samples=4)
