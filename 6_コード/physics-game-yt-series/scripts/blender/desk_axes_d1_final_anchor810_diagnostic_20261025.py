"""Root-only zero-render exact-frame810 anchor-mismatch diagnosis.

The frozen903 helper and failed146 report are immutable. Three reversible
source boundaries select one ALREADY validated request, add diagnostic data,
and capture values before the UNCHANGED anchor assertion. No threshold is
relaxed, no assertion skipped, no model/pose forced beyond existing replay,
and the existing strict1e-9 restoration still runs even when810 fails.
Import/compile is inert: only root may call run with the frozen job arguments.
"""
import ast
import hashlib
import json
from pathlib import Path
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_d1_final_camera_pier_physical_v5_20261025.py'
ORIGINAL_SHA='1fa4235a08590e737f06c2940d0b4dc4f5c127d35de19199e6ec7a2f5421804c'
FAILED=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025/final-composite-physical-v5-20261025.json')
SOURCE_ANCHORS=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024/blender/patch/anchors.json')
SOURCE_COMPLETE=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024/camera-patch-complete.json')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
OUT=FINAL/'final-anchor810-diagnostic-20261025.json'
DETAILS=FINAL/'final-anchor810-diagnostic-details-20261025.json'
EXTRA_PINS={
    str(FAILED):'1ca5e7e538d23d574040a962ead211d558932b9a40048197720f29f79ce7b1e9',
    str(SOURCE_ANCHORS):'8b15b98366c33265f15e313cfba88854fec58178fa06f2dad37a50b4da871382',
    str(SOURCE_COMPLETE):'02f04a5fa1c994c7e37cfb7487b29f9b1d36f78ee308c52994d2a4c82c921944',
}

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):return json.loads(Path(p).read_text())
def exclusive(p,obj):
    p=Path(p);assert p.is_absolute()and p.is_relative_to(FINAL)and not p.exists()and not p.is_symlink()
    assert not any(q.is_symlink()for q in p.parents if q.exists())
    with p.open('x')as f:json.dump(obj,f,ensure_ascii=False,indent=1,allow_nan=False)
def pointer(x):return x.as_pointer()if x is not None and hasattr(x,'as_pointer')else None
def flat(x):return[float(v)for row in x for v in row]
def fdigest(fn):
    if not isinstance(fn,types.FunctionType):return{'type':type(fn).__name__}
    c=fn.__code__
    return{'name':fn.__name__,'filename':c.co_filename,'firstLine':c.co_firstlineno,
        'codeSha256':hashlib.sha256(c.co_code).hexdigest(),'globalsIdentity':id(fn.__globals__),
        'closureFreevars':list(c.co_freevars)}

def capture(ctx,j,row,points,projected,expected,poses,report,pins):
    """Only read current state, recompute projections independently, EXCL log."""
    import numpy as np
    from mathutils import Vector
    from bpy_extras.object_utils import world_to_camera_view
    assert j==810 and DETAILS.is_relative_to(FINAL)
    g,d,bpy=ctx.g,ctx.d,ctx.bpy;dg=bpy.context.evaluated_depsgraph_get()
    matrix=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted()
    point_values={n:[float(v)for v in p]for n,p in points.items()}
    fresh=g['anchors'](row['unchangedOtherObjectSourceFrame']/30)
    independent={}
    for name,p in points.items():
        v=world_to_camera_view(ctx.scene,d.CAM,Vector(p))
        clip=np.asarray(matrix,dtype=np.float64)@np.asarray([*p,1.],dtype=np.float64)
        ndc=clip[:3]/clip[3]
        xy=[float((ndc[0]*.5+.5)*1080),float((.5-ndc[1]*.5)*1920)]
        independent[name]={'worldToCameraUnrounded':[float(v.x*1080),float((1-v.y)*1920),float(v.z)],
            'worldToCameraRounded01':[round(v.x*1080,1),round((1-v.y)*1920,1),1 if 0<=v.x<=1 and 0<=v.y<=1 and v.z>0 else 0],
            'matrixUnroundedPixels':xy,'matrixRounded01Pixels':[round(x,1)for x in xy],
            'actualRuntimeProjected':projected[name],'expectedDelivered':expected[name],
            'runtimeMinusDelivered':[float(a-b)for a,b in zip(projected[name],expected[name])],
            'unroundedMinusDeliveredXY':[float(x-y)for x,y in zip(xy,expected[name][:2])]}
    funcs={}
    for name,fn in[('project',d.project),('pose_cam',d.pose_cam),('set_camera',g['set_camera']),('anchors',g['anchors']),('apply',g['apply'])]:
        gg=fn.__globals__ if isinstance(fn,types.FunctionType)else{}
        funcs[name]={**fdigest(fn),'objects':{k:{'pointer':pointer(gg.get(k)),'name':getattr(gg.get(k),'name',None),
            'sameAsOwned':gg.get(k)is value}for k,value in[('SC',d.SC),('CAM',d.CAM),('CAM_D',d.CAM_D)]},
            'constantWidth':gg.get('W')if isinstance(gg.get('W'),(int,float))else None,
            'constantHeight':gg.get('H')if isinstance(gg.get('H'),(int,float))else None,
            'episodeDModuleSame':gg.get('d')is d if 'd'in gg else None}
    role,objects,critical=ctx.tools['principal'](g['cue_at'](row['unchangedOtherObjectSourceFrame']/30),row['unchangedOtherObjectSourceFrame']/30)
    surface=ctx.tools['project'](objects,matrix,dg)
    critical_surface=ctx.tools['project'](critical,matrix,dg)
    historical=next(r for r in load(SOURCE_COMPLETE)['physical']if r['frame']==j)
    details={'episode':'D-1','mode':'zero-render-one-frame-anchor-diagnostic','helperSha256':sha(__file__),
        'original903Helper':str(ORIGINAL),'original903HelperSha256':ORIGINAL_SHA,
        'original146Failure':str(FAILED),'original146FailureSha256':pins[str(FAILED)],
        'frame':j,'time':j/30,'deliveredRow':row,'requestedPose':poses[j],
        'authoritativeCameraPatchAnchors':{n:a[j]for n,a in load(SOURCE_ANCHORS)['anchors'].items()},
        'sourceAnchorFile':str(SOURCE_ANCHORS),'sourceAnchorSha256':pins[str(SOURCE_ANCHORS)],
        'returnedWorldAnchorPoints':point_values,'freshAnchorsSameSourceTime':{n:list(p)for n,p in fresh.items()},
        'projected':projected,'expected':expected,'perAnchorIndependentProjection':independent,
        'namespaceFunctions':funcs,
        'scene':{'ownedScene':d.SC.name,'ownedScenePointer':pointer(d.SC),'activeScene':bpy.context.window.scene.name,
            'activeScenePointer':pointer(bpy.context.window.scene),'ownedCameraPointer':pointer(d.CAM),
            'actualSceneCameraPointer':pointer(d.SC.camera),'render':{k:getattr(d.SC.render,k)for k in['resolution_x','resolution_y','resolution_percentage','pixel_aspect_x','pixel_aspect_y']}},
        'camera':{'worldMatrix':flat(d.CAM.matrix_world),'evaluatedWorldMatrix':flat(d.CAM.evaluated_get(dg).matrix_world),
            'data':{k:getattr(d.CAM_D,k)for k in['type','lens','sensor_width','sensor_height','sensor_fit','shift_x','shift_y','ortho_scale','clip_start','clip_end']}},
        'semanticPrincipal':role,'currentSurface':surface,'currentCriticalSurface':critical_surface,
        'historicalRendered810PhysicalRecord':historical,
        'originalAnchorAssertionToleranceUnchanged':1e-5,'originalSavedWorldRestorationToleranceUnchanged':1e-9,
        'originalAssertionWillStillExecute':True,'renders':0,'thresholdRelaxation':False,'automaticApproval':False,
        'originalNGPreserved':True,'actualImagesPersonallyViewedByThisDiagnostic':False,'finalAcceptance':False,
        'protectedInputSha256':dict(pins)}
    exclusive(DETAILS,details)
    report['anchor810Diagnostic']={'path':str(DETAILS),'sha256':sha(DETAILS),'assertionNotBypassed':True}

def private_scope():
    assert sha(ORIGINAL)==ORIGINAL_SHA
    original=ORIGINAL.read_text();text=original;boundaries=[]
    def replace(a,b):
        nonlocal text
        assert text.count(a)==1,a[:100];text=text.replace(a,b,1);boundaries.append((a,b))
    a="frames,origins,endpoint=actual_requests(pins,req,coverage,mp4_sha256,additional_actual_manifests);times=[j/30 for j in frames]"
    b="frames,origins,endpoint=actual_requests(pins,req,coverage,mp4_sha256,additional_actual_manifests);all903_diagnostic_frames=list(frames);assert 810 in frames;frames=[810];times=[j/30 for j in frames]"
    replace(a,b)
    a="    ctx=None;checks={};observations={};started=time.time()"
    b="    report['diagnosticOnly']={'originalValidatedRequestCount':len(all903_diagnostic_frames),'selectedFrames':[810],'original903CoverageNotClaimed':True,'sourceBoundaryCount':3,'inverseExactOriginalVerified':True}\n    ctx=None;checks={};observations={};started=time.time()"
    replace(a,b)
    a="            assert set(projected)==names and same(projected,expected,1e-5),('Actual versus delivered anchors mismatch',j)"
    b="            anchor810_capture(ctx,j,row,points,projected,expected,poses,report,pins)\n"+a
    replace(a,b)
    inverse=text
    for a,b in reversed(boundaries):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
    assert inverse==original;ast.parse(text)
    scope={'__file__':str(Path(__file__).resolve()),'__name__':'d1_anchor810_diagnostic_private','anchor810_capture':capture}
    exec(compile(text,str(ORIGINAL)+' [three exact diagnostic boundaries]','exec'),scope)
    for p,h in EXTRA_PINS.items():assert sha(p)==h;scope['PINS'][p]=h
    scope['PINS'][str(ORIGINAL)]=ORIGINAL_SHA
    scope['PINS'][str(Path(__file__).resolve())]=sha(__file__)
    return scope

def run(ns,authorized=False,**kwargs):
    assert authorized is True
    assert kwargs['out']==OUT and not OUT.exists()and not DETAILS.exists()
    assert load(FAILED)['error']['message']=="('Actual versus delivered anchors mismatch', 810)"
    scope=private_scope()
    return scope['run'](ns,authorized=True,**kwargs)
