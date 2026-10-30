"""Inert true-3D row22 magnifier. Parent calls preview(ns)/production(ns).

Uses the already-built S3 namespace, never imports/rebuilds the old Claude
scene. Main 11618 JPEGs and all supplied text/audio remain unchanged. The
parent-owned GUI performs rendering; this module does nothing on import.
"""
from pathlib import Path
import contextlib, hashlib, json, math, os, time

BASE = Path('/private/tmp/ys/ys-chain-d1a_s3_framing_gpt_20261028')
CACHE = Path('/private/tmp/ys/ys-chain-d1a_s3_magnifier_gpt_20261028')
RAW_KEY = 'f19573c5b0db3fdeb437'
SCENE_KEY = '8eb303df05bafa5a3d96'
FPS, NF = 30, 11618
SELF = Path(__file__).resolve()
SQUARE = (.418, -.045, .002)
POSE = [.418, -.045, .006, .12, -6, 35, 200]

def sha(p):
    h = hashlib.sha256()
    with Path(p).open('rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''): h.update(b)
    return h.hexdigest()

def read(p):
    with Path(p).open(encoding='utf8') as f: return json.load(f)

def output(p):
    p = Path(p)
    assert str(p).startswith(str(CACHE) + os.sep)
    for q in [p] + list(p.parents):
        assert not q.is_symlink(), 'No symlink output: ' + str(q)
        if q == CACHE: break
    return p

def write(p, value):
    p = output(p); p.parent.mkdir(parents=True, exist_ok=True)
    with p.open('x', encoding='utf8') as f:
        json.dump(value, f, ensure_ascii=False, separators=(',', ':'), allow_nan=False)

def definition(ns):
    assert Path(ns['A'].cache) == Path('/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')
    assert ns['render_key']() == SCENE_KEY and ns['FPS'] == FPS and ns['NF'] == NF
    assert CACHE.is_dir() and CACHE.resolve() == CACHE and not CACHE.is_symlink(), 'Run the new prepare.mjs first'
    meta = read(CACHE/'blender/desk/meta.json')
    assert meta['key'] == RAW_KEY and meta['frames'] == NF and meta['stage'] == 'S3'
    a = ns['W']('air:1kg', '1平方センチメートル')
    b = ns['W']('air:1kg', '手のひら')
    assert 194 < a < b < 205
    return {'stage': 'S3', 'kind': 'True separate-camera macro, not enlarged main pixels',
            'rawSourceKey': RAW_KEY, 'originalSceneKey': SCENE_KEY,
            'macroHelperSha256': sha(SELF), 'start': a, 'endExclusive': b,
            'fadeInSeconds': .3, 'fadeOutSeconds': .3, 'fps': FPS,
            'first': math.ceil(a*FPS-1e-8), 'last': math.ceil(b*FPS-1e-8)-1,
            'resolution': [480,480], 'samples': 4, 'pose': POSE,
            'focusPoint': [.418,-.045,.007], 'fstop': 22,
            'square': list(SQUARE), 'squareEdge': [.423,-.045,.002],
            'logicalProjectionResolution': [1080,1920],
            'mainRawChanged': False, 'scriptVoiceCaptionsChanged': False}

@contextlib.contextmanager
def restored(ns, restore_time):
    import bpy
    d = ns['d']; sc = d.SC
    win = bpy.context.window or next(iter(bpy.context.window_manager.windows))
    prior = win.scene
    settings = (sc.render.resolution_x, sc.render.resolution_y,
                sc.render.resolution_percentage, sc.eevee.taa_render_samples,
                sc.render.filepath, sc.render.image_settings.file_format)
    cam = (d.CAM.matrix_world.copy(), d.CAM_D.lens,
           d.CAM_D.dof.aperture_fstop, d.CAM_D.dof.focus_distance)
    names = ['PRIMARY','S3_PRIMARY_METADATA','S3_PRIMARY_SELECTIONS',
             '_A3_QA_SELECTION_INDEX','S3_PRIMARY_WARNINGS','_A3_QA_VERTEX_CACHE']
    old = {k:ns.get(k) for k in names}; present = {k:k in ns for k in names}
    try:
        win.scene = sc
        assert (d.W,d.H) == (1080,1920), 'Keep logical projection dimensions unchanged'
        with bpy.context.temp_override(window=win,scene=sc,view_layer=sc.view_layers[0]): yield
    finally:
        ns['apply'](restore_time)
        d.CAM.matrix_world = cam[0]; d.CAM_D.lens = cam[1]
        d.CAM_D.dof.aperture_fstop = cam[2]; d.CAM_D.dof.focus_distance = cam[3]
        (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage,
         sc.eevee.taa_render_samples,sc.render.filepath,sc.render.image_settings.file_format) = settings
        for k in names:
            if present[k]: ns[k] = old[k]
            else: ns.pop(k,None)
        win.scene = prior; bpy.context.view_layer.update()

def render(ns, p, indices, out, restore_time):
    import bpy
    from mathutils import Vector
    assert not out.exists(), 'Preserve earlier macro output; use a new preview label'
    output(out).mkdir(parents=True)
    frames = []; started = time.time(); d = ns['d']; sc = d.SC
    with restored(ns,restore_time):
        for j in indices:
            assert not (CACHE/'STOP_MAGNIFIER').exists(), 'STOP_MAGNIFIER present'
            assert p['first'] <= j <= p['last']
            t = j/FPS
            # Apply the unmodified main scene with its original portrait aspect
            # before projecting the true 1cm square into logical main pixels.
            sc.render.resolution_x=540; sc.render.resolution_y=960
            sc.render.resolution_percentage=100
            ns['apply'](t); bpy.context.view_layer.update()
            sq = d.project(Vector(SQUARE)); edge = d.project(Vector(p['squareEdge']))
            assert sq[2] and edge[2] and all(math.isfinite(v) for v in sq+edge)
            extra = {'frame':j,'t':t,'sq':sq,'sq_edge':edge,
                     'magT':p['start'],'magEnd':p['endExclusive'],
                     'rawSourceKey':RAW_KEY,'projection':'Unmodified main camera; logical1080x1920'}
            sc.render.resolution_x=sc.render.resolution_y=480
            sc.eevee.taa_render_samples=4; sc.render.image_settings.file_format='JPEG'
            d.pose_cam(POSE)
            d.CAM_D.dof.focus_distance=(Vector(p['focusPoint'])-d.CAM.location).length
            d.CAM_D.dof.aperture_fstop=22
            image=out/('mag-%05d.jpg'%j); sc.render.filepath=str(image)
            bpy.ops.render.render(write_still=True,scene=sc.name)
            write(out/('extra-%05d.json'%j),extra)
            frames.append({'frame':j,'time':t,'image':str(image),'extra':str(out/('extra-%05d.json'%j))})
            if len(frames)%30==0: print('MAGNIFIER',len(frames),'/',len(indices),flush=True)
    assert ns['render_key']()==SCENE_KEY and sha(SELF)==p['macroHelperSha256']
    result={'stage':'S3','rawSourceKey':RAW_KEY,'originalSceneKey':SCENE_KEY,
            'definition':p,'frames':frames,'count':len(frames),
            'elapsedSeconds':time.time()-started,'mainRawModified':False,
            'productionMacroComplete':indices==list(range(p['first'],p['last']+1)),
            'personallyViewed':False,'wholeMoviePass':False}
    write(out/'manifest.json',result)
    return result

def preview(ns,label='candidate1',restore_time=(NF-1)/FPS):
    assert label.replace('-','').replace('_','').isalnum()
    p=definition(ns)
    one=ns['W']('air:1kg','1キログラム')
    indices=sorted({math.ceil((p['start']+.1)*FPS-1e-8),
                    math.ceil((one+.2)*FPS-1e-8),
                    math.floor((p['endExclusive']-.1)*FPS+1e-8)})
    assert len(indices)==3
    out=output(CACHE/'magnifier/preview'/label)
    render(ns,p,indices,out,restore_time)
    print('MAGNIFIER_PREVIEW_READY',str(out),flush=True)
    return None

def production(ns,restore_time=(NF-1)/FPS):
    p=definition(ns)
    out=output(CACHE/'magnifier/frames')
    # Parent reviews preview first. No exporter/checker/backup is auto-started.
    approval=read(CACHE/'MAGNIFIER_APPROVED.json')
    assert approval.get('approved') is True and approval.get('macroHelperSha256')==p['macroHelperSha256'] and approval.get('rawSourceKey')==RAW_KEY
    result=render(ns,p,list(range(p['first'],p['last']+1)),out,restore_time)
    write(CACHE/'magnifier/definition.json',p)
    print('MAGNIFIER_COMPLETE',result['count'],'main raw unchanged; no export started',flush=True)
    return None
