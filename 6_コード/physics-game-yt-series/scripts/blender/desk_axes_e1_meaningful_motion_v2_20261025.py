"""Private v2 adapter: physical1s pendulum, coherent local snapshot, RNA context.

The frozen v1 draft remains untouched. No world/basis is assigned. Temporary
owned-only visibility evaluation requires an explicit root flag and is undone
before snapshot/strict comparison. Original1e-9 before/after restoration remains.
The parent-product equation is diagnostic: float32 matrix multiplication has
its own rounding, distinct from comparing two saved actual Blender worlds.
"""
import hashlib
import json
from pathlib import Path
import time

SOURCE = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series/scripts/blender/desk_axes_e1_meaningful_motion_v1_20261025.py')
SOURCE_SHA = '5257b7d6e3c7c707644614cbab8aa8e7e614770d4318896af7050044d036ec22'
OUT = Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v2-20261025')
STRICT_RESTORE_TOLERANCE = 1e-9

def _sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def _flat(m):
    return tuple(float(v) for row in m for v in row)

def _pointer(o):
    return int(o.as_pointer()) if o is not None else None

def _rna(v):
    if v is None or isinstance(v,(str,int,float,bool)):
        return v
    if hasattr(v,'as_pointer'):
        return (_pointer(v),getattr(v,'name',None),type(v).__name__)
    return tuple(_rna(x) for x in v)

def _channels(ob,layer):
    keys=('location','scale','rotation_mode','rotation_euler','rotation_quaternion','rotation_axis_angle',
          'delta_location','delta_scale','delta_rotation_euler','delta_rotation_quaternion',
          'matrix_parent_inverse','matrix_basis','color','parent_type','parent_bone','parent_vertices')
    r={k:(_flat(getattr(ob,k)) if k.startswith('matrix_') else _rna(getattr(ob,k))) for k in keys}
    r.update(parent=_pointer(ob.parent),data=_pointer(ob.data),hide_render=bool(ob.hide_render),
             hide_viewport=bool(ob.hide_viewport),layerHide=bool(ob.hide_get(view_layer=layer)),
             materials=tuple(_pointer(s.material) for s in ob.material_slots),
             animationData=_pointer(ob.animation_data),
             shapeValues=tuple(float(k.value) for k in ob.data.shape_keys.key_blocks) if ob.type=='MESH' and ob.data.shape_keys else (),
             fontBody=ob.data.body if ob.type=='FONT' else None)
    constraints=[]
    for c in ob.constraints:
        properties={}
        for prop in c.bl_rna.properties:
            if prop.identifier=='rna_type':
                continue
            value=getattr(c,prop.identifier)
            if prop.type=='COLLECTION':
                properties[prop.identifier]=tuple(tuple((p.identifier,_rna(getattr(x,p.identifier)))
                    for p in x.bl_rna.properties if p.identifier!='rna_type' and p.type!='COLLECTION') for x in value)
            else:
                properties[prop.identifier]=_rna(value)
        constraints.append((_pointer(c),properties))
    r['constraints']=constraints
    return r

def _context(bpy):
    s,l=bpy.context.window.scene,bpy.context.window.view_layer
    return {'scenePointer':_pointer(s),'sceneName':s.name,'layerPointer':_pointer(l),
            'layerName':l.name,'layerOwnerPointer':_pointer(l.id_data),
            'frame':s.frame_current,'subframe':s.frame_subframe}

def _normal(g,roots,phase,allow_temporary_unhide,proofs):
    bpy,scene=g['bpy'],g['d'].SC
    assert _pointer(bpy.context.window.scene)==_pointer(scene) and g.get('_SHOW_QUEUE') is None
    layer=bpy.context.window.view_layer
    owned=list(scene.objects)
    assert all(o.name in layer.objects for o in roots)
    targets=list(dict.fromkeys(roots))
    for ob in list(targets):
        parent=ob.parent
        while parent is not None:
            assert parent.name in scene.objects
            if parent not in targets:
                targets.append(parent)
            parent=parent.parent
    before={o:_channels(o,layer) for o in owned}
    flags={o:(bool(o.hide_render),bool(o.hide_viewport),bool(o.hide_get(view_layer=layer))) for o in owned}
    stages=[]
    def probe(label):
        dg=bpy.context.evaluated_depsgraph_get()
        rows=[]
        for ob in targets:
            actual=_flat(ob.matrix_world)
            evaluated=_flat(ob.evaluated_get(dg).matrix_world)
            basis=ob.matrix_basis.copy()
            expected=basis if ob.parent is None else ob.parent.matrix_world@ob.matrix_parent_inverse@basis
            diff=max(abs(a-b) for a,b in zip(actual,evaluated))
            formula=max(abs(a-b) for a,b in zip(actual,_flat(expected)))
            rows.append({'name':ob.name,'pointer':_pointer(ob),'world':actual,'evaluatedWorld':evaluated,
                         'actualWorldVersusEvaluatedMaxDelta':diff,
                         'parentProductMaxDeltaDiagnosticOnly':formula})
        stage={'name':label,'objects':rows,
               'allActualWorldsMatchTheirEvaluatedWorlds':all(r['actualWorldVersusEvaluatedMaxDelta']<=STRICT_RESTORE_TOLERANCE for r in rows)}
        stages.append(stage)
        return stage
    def update():
        for ob in owned:
            ob.update_tag()
        bpy.context.evaluated_depsgraph_get().update()
        bpy.context.view_layer.update()
    did_unhide=False
    error=None
    try:
        probe('owned-scene-before-normal-refresh')
        update()
        normal=probe('normal-tag-depsgraph-viewlayer-refresh')
        if not normal['allActualWorldsMatchTheirEvaluatedWorlds'] and allow_temporary_unhide:
            did_unhide=True
            for ob,(hr,hv,hidden) in flags.items():
                if hr: ob.hide_render=False
                if hv: ob.hide_viewport=False
                if hidden: ob.hide_set(False,view_layer=layer)
            update()
            probe('explicitly-authorized-owned-hidden-cache-evaluation')
    except BaseException as exc:
        error={'type':type(exc).__name__,'message':str(exc)}
        raise
    finally:
        for ob,(hr,hv,hidden) in flags.items():
            if bool(ob.hide_render)!=hr: ob.hide_render=hr
            if bool(ob.hide_viewport)!=hv: ob.hide_viewport=hv
            if bool(ob.hide_get(view_layer=layer))!=hidden: ob.hide_set(hidden,view_layer=layer)
        update()
        final=probe('exact-owned-visibility-restored-and-normal-refresh')
        changed=[o.name for o in owned if _channels(o,layer)!=before[o]]
        record={'phase':phase,'stages':stages,'localChannelOffenders':changed,
                'allOwnedLocalChannelsConstraintsVisibilityPointersAndBasisUnchanged':not changed,
                'allActualWorldsMatchEvaluatedAfterFlagsRestored':final['allActualWorldsMatchTheirEvaluatedWorlds'],
                'parentProductEquationDiagnosticOnlyFloat32RoundingNotASavedWorldRestoreTolerance':True,
                'strictSavedActualWorldRestoreToleranceUnchanged':STRICT_RESTORE_TOLERANCE,
                'temporaryVisibilityExplicitlyAllowed':allow_temporary_unhide,
                'temporaryOwnedVisibilityEvaluationPerformed':did_unhide,
                'worldBasisOrTransformAssignmentPerformed':False,'error':error}
        proofs.append(record)
        assert not changed and record['allActualWorldsMatchEvaluatedAfterFlagsRestored'] and error is None, 'Owned dependency normalization not proven; no snapshot/acceptance'

assert _sha(SOURCE)==SOURCE_SHA
_original=SOURCE.read_text()
_text=_original
_boundaries=[]
def _replace(before,after):
    global _text
    assert _text.count(before)==1,('Nonunique private v2 boundary',before[:90])
    _text=_text.replace(before,after,1)
    _boundaries.append((before,after))

_replace("OUT = Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v1-20261025')",
         "OUT = Path('/private/tmp/ys/ys-chain-e1v1-meaningful-motion-v2-20261025')")
_replace("PERIOD, AMPLITUDE, BLEND = 1.6, .18, .6","PERIOD, AMPLITUDE, BLEND = 1., .18, .6")
_replace("    transforms = {o: {p: _copy_value(getattr(o, p)) for p in transform_properties} for o in roots}",
         "    _NORMAL(g, roots, 'entry-before-snapshot', _ALLOW_TEMPORARY_UNHIDE, _NORMAL_PROOFS)\n"
         "    transforms = {o: {p: _copy_value(getattr(o, p)) for p in transform_properties} for o in roots}")
_replace("'principalGroups':groups,'principal':bb,'critical':critical,",
         "'principalGroups':list(groups),'principal':bb,'critical':critical,")
_replace("            bpy.context.window.scene = scene\n            bpy.context.view_layer.update()\n        except BaseException as error:",
         "            bpy.context.window.scene = scene\n            bpy.context.view_layer.update()\n"
         "            _NORMAL(g, roots, 'restore-before-strict-original-world-comparison', _ALLOW_TEMPORARY_UNHIDE, _NORMAL_PROOFS)\n"
         "        except BaseException as error:")
_replace("checks['contextSceneRestored'] = bpy.context.window.scene is old_scene",
         "checks['contextSceneRestored'] = bpy.context.window.scene.as_pointer() == old_scene.as_pointer() and bpy.context.window.scene.name == old_scene.name")
_replace("'allPass':not report.get('error') and all(checks.values())})",
         "'allPass':not report.get('error') and all(checks.values()), 'normalDependencyProofs':_NORMAL_PROOFS, 'privateV2SourceAdapter':_SOURCE_PROOF})")

_inverse=_text
for before,after in reversed(_boundaries):
    assert _inverse.count(after)==1
    _inverse=_inverse.replace(after,before,1)
assert _inverse==_original
_source_proof={'source':str(SOURCE),'sourceSha256':SOURCE_SHA,'adapter':str(Path(__file__).resolve()),
               'adapterSha256':_sha(__file__),'exactReversibleBoundaries':len(_boundaries),
               'inverseByteIdenticalToFrozenV1':True,'sourceAndAudioSubtitlesUntouched':True,
               'landAndShipboardRegularPendulumBothOneSecond':True}
_scope={'__name__':'e1_meaningful_motion_v2_private','__file__':str(Path(__file__).resolve()),
        '_NORMAL':_normal,'_NORMAL_PROOFS':[],'_ALLOW_TEMPORARY_UNHIDE':False,'_SOURCE_PROOF':_source_proof}
exec(compile(_text,str(SOURCE)+' [private v2 derivative]','exec'),_scope)

def run(ns,authorized=False,mode='probe',approved_probe_sha256=None,*,allow_temporary_unhide=False):
    assert authorized is True and type(allow_temporary_unhide) is bool
    assert _sha(SOURCE)==SOURCE_SHA
    g=ns['apply'].__globals__
    bpy,scene=g['bpy'],g['d'].SC
    old_scene,old_layer=bpy.context.window.scene,bpy.context.window.view_layer
    context_before=_context(bpy)
    _scope['_NORMAL_PROOFS']=[]
    _scope['_ALLOW_TEMPORARY_UNHIDE']=allow_temporary_unhide
    result=None
    error=None
    began=time.time()
    try:
        bpy.context.window.scene=scene
        # The retained E delivery uses this scene's existing first view layer.
        bpy.context.window.view_layer=scene.view_layers[0]
        result=_scope['run'](ns,authorized=True,mode=mode,approved_probe_sha256=approved_probe_sha256)
        return result
    except BaseException as exc:
        error={'type':type(exc).__name__,'message':str(exc)[:2000]}
        raise
    finally:
        bpy.context.window.scene=old_scene
        bpy.context.window.view_layer=old_layer
        bpy.context.view_layer.update()
        context_after=_context(bpy)
        restored=context_before==context_after
        receipt={'mode':mode,'helperSha256':_sha(__file__),'sourceAdapter':_source_proof,
                 'contextBefore':context_before,'contextAfter':context_after,'contextRestoredByExactRNAPointersNamesOwnerAndFrame':restored,
                 'normalDependencyProofs':_scope['_NORMAL_PROOFS'],'allowTemporaryUnhideExplicitlyAuthorized':allow_temporary_unhide,
                 'operationError':error,'finalAcceptance':False,'seconds':time.time()-began}
        folder=OUT/'context-transactions'
        folder.mkdir(parents=True,exist_ok=True)
        path=folder/('context-%d.json'%time.time_ns())
        with path.open('x') as stream:
            json.dump(receipt,stream,ensure_ascii=False,indent=1,allow_nan=False)
        assert restored,'Original window scene/view-layer RNA context not restored'

