"""Execute in the live 1-2 scene namespace; only retouch explicitly changed shots."""
def retouch12():
    from pathlib import Path
    root=Path(A.cache);saved=vars(A).copy()
    try:
        if globals().get('RETOUCH_MODE','preview')=='preview':
            A.times='1.8,257.6,272.3,278.6,314.0,318.0,391.0';A.out=str(root/'blender/preview-b3-1_2v1')
            main();return
        ranges=globals().get('RETOUCH_RANGES',[(0,12.6),(37.0,38.9),(245.8,259.0),(272.0,272.6),(276.3,334.65),(384.7,392.55)])
        suffix=globals().get('RETOUCH_SUFFIX','')
        plans=[plan12(j) for j in range(math.ceil(DATA['duration']*FPS))]
        renders={j for j,p in enumerate(plans) if p[0]=='render'}
        affected={j for j in renders if any(a<=j/FPS<b for a,b in ranges)}
        old=json.loads((root/'blender/desk/meta.json').read_text());old_done=set(old['done'])
        assert renders-affected<=old_done,'A new render outside the explicit retouch ranges was not covered'
        def digest(j):return hashlib.sha256((root/'blender/desk'/('%05d.jpg'%j)).read_bytes()).hexdigest()
        before={j:digest(j) for j in renders-affected}
        (root/('blender/retouch-before-1_2v1'+suffix+'.json')).write_text(json.dumps({'old_meta':old,'ranges':ranges,'unaffected_sha256':before},indent=1))
        A.times=None;A.out=str(root/'blender/desk');A.force=False
        for a,b in ranges:
            A.start=a;A.stop=b;print('[1-2 retouch]',a,b,flush=True);main()
        assert all(digest(j)==h for j,h in before.items()),'Unexpected change outside retouched shots'
        meta=json.loads((root/'blender/desk/meta.json').read_text())
        meta['done']=sorted(renders)
        meta['reuse_evidence']={'old_key':old['key'],'ranges':ranges,'unchanged_render_frames':len(before),'retouched_render_frames':len(affected)}
        (root/'blender/desk/meta.json').write_text(json.dumps(meta))
        (root/('blender/retouch-after-1_2v1'+suffix+'.json')).write_text(json.dumps(meta['reuse_evidence'],indent=1))
        print('[1-2 retouch] verified:',meta['reuse_evidence'],flush=True)
    finally:
        vars(A).clear();vars(A).update(saved)
retouch12()
