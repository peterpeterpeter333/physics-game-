"""Technical curiosity chain 1-2, 2nd edition (ys-chain-1-2v2). Copy of desk_1_2v1.py (ChatGPT) with closer cameras.
The 1st-edition files are not changed. Independent scene; immutable supplied narration."""
import os,sys,json,math,time,hashlib,argparse
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
original_argv=sys.argv[:]
# desk_lib's importer selects 1-1 assets. Do not pass 1-2 cache into its 1-1 loader.
sys.argv=sys.argv[:sys.argv.index('--')] if '--' in sys.argv else sys.argv
import bpy
if bpy.app.background:
    import desk_lib as d
else:
    # GUI-only import adapter. No shared file is edited: retain the existing scene,
    # avoid invalidating the running console, and use the view-layer active object
    # (Context.active_object is unavailable in Blender 5.2's console context).
    import types
    libpath=os.path.join(os.path.dirname(__file__),'desk_lib.py')
    libsource=open(libpath).read()
    assert libsource.count('bpy.ops.wm.read_factory_settings(use_empty=True)')==1
    libsource=libsource.replace('bpy.ops.wm.read_factory_settings(use_empty=True)','pass # GUI scene already empty')
    libsource=libsource.replace('bpy.context.active_object','bpy.context.view_layer.objects.active')
    # Keep previous GUI scenes recoverable, but free canonical model names.
    for o in bpy.data.objects:o.name='previous_1_2v1_'+o.name
    bpy.context.window.scene=bpy.data.scenes.new('Technical chain 1-2v1')
    d=types.ModuleType('desk_lib');d.__file__=libpath;sys.modules['desk_lib']=d
    exec(compile(libsource,libpath,'exec'),d.__dict__)
sys.argv=original_argv
import desk_lib_1_2v2 as ext
if not bpy.app.background:
    import importlib
    ext=importlib.reload(ext)
import bpy
from mathutils import Vector

def args():
    p=argparse.ArgumentParser()
    p.add_argument('--cache',default='/private/tmp/ys/ys-chain-1-2v2')
    p.add_argument('--catalog',action='store_true')
    p.add_argument('--times');p.add_argument('--from',dest='start',type=float,default=0)
    p.add_argument('--to',dest='stop',type=float,default=1e9)
    p.add_argument('--scale',type=float,default=1);p.add_argument('--samples',type=int,default=16)
    p.add_argument('--retouch',action='store_true');p.add_argument('--every',type=int,default=1);p.add_argument('--out');p.add_argument('--force',action='store_true')
    return p.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
A=args();assert A.cache not in ['/private/tmp/ys/ys-chain-1-2v1','/private/tmp/ys/ys-chain-1-2v1-render']
DATA=json.load(open(os.path.join(A.cache,'blender','data.json')))['episode12']
CUES=DATA['cues'];CUE={c['key']:c for c in CUES}
PARTS,GROUPS=ext.build(DATA)
MANAGED=list({o for oo in GROUPS.values() for o in oo})
d.SC.render.resolution_x=round(1080*A.scale);d.SC.render.resolution_y=round(1920*A.scale)
d.SC.eevee.taa_render_samples=A.samples

def visible(*names):
    for name in names:
        for o in GROUPS[name]:d.show(o,True)

def hide_all():
    for o in MANAGED:d.show(o,False)

def catalog():
    out=A.out or os.path.join(A.cache,'blender','catalog-1-2v1')
    os.makedirs(out,exist_ok=True)
    specs=[('alberti',['alberti'],(0,-.1,0),.32),('marker',['marker'],(0,-.3,0),.07),
      ('schedule',['schedule'],(0,-.1,0),.30),('numbers',['caesar','numbers'],(0,-.1,0),.36),
      ('keyword',['keyword'],(0,-.29,0),.72),('longkey',['longkey'],(0,-.37,0),.41),
      ('paperstack',['alberti','paperstack'],(.08,-.1,0),.48),('stack',['stack'],(0,-.1,0),.15),
      ('books',['bellaso','vigenere'],(.02,-.1,0),.50),('receiver',['alberti','receiver'],(.10,-.1,0),.66),
      ('corrupt',['keyword','corrupt'],(0,-.24,0),.72),('towers',['towers'],(0,-.1,.06),.83),
      ('nameclock',['nameclock','dolls'],(0,-.1,.04),.70)]
    d.letter_state(3);d.bellaso_open(PARTS['bellaso'],1)
    for name,groups,center,span in specs:
        hide_all();visible(*groups)
        if name=='nameclock':d.name_clock_set(PARTS['nameclock'],3,True)
        for top in [False,True]:
            f=os.path.join(out,'1_2v1_'+name+('_top.jpg' if top else '_oblique.jpg'))
            if os.path.exists(f) and not A.force:continue
            d.catalog_camera(center,top=top,span=span)
            d.SC.render.filepath=f;bpy.ops.render.render(write_still=True)
            print('[1-2 catalog]',f,flush=True)

# The episode-specific state code is also loadable into the live GUI namespace:
# rebuilding the reference room between every preview would waste GPU memory.
exec(compile(open(os.path.join(os.path.dirname(__file__),'desk_1_2v2_state.py')).read(),
             'desk_1_2v2_state.py','exec'),globals())

if __name__=='__main__':
    if A.catalog:catalog()
    elif A.retouch:
        exec(compile(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'desk_1_2v2_retouch.py')).read(),'desk_1_2v2_retouch.py','exec'),globals())
    else:main()
