"""Root-only zero-render diagnosis of B114's derived-cache/context failures.

No episode apply/pose/reset/setup is called. No transform, matrix, constraint,
material, geometry, frame or runtime binding is assigned. Normal dependency
updates are observed first. Only an explicit root flag allows temporary B-scene
object visibility changes; exact entry flags are restored in a finally block.
Derived world caches are diagnostic outputs, never forced back to stale values.
This is NOT a replacement for the original strict B7 restoration guard.
"""
import hashlib
import json
import os
from pathlib import Path
import runpy
import time

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_b1_sixth_needle_carry_b7_20261025.py'
COMPAT=W/'scripts/blender/desk_axes_b1_b7_namespace_compat_20261025.py'
TOOLS=W/'scripts/blender/desk_axes_b1_b7_namespace_diagnostic_v2_20261025.py'
RUNTIME=W/'outputs/axes-20261023/b1-b7-runtime-namespace-diagnostic-v2-20261025.json'
FAILED=Path('/private/tmp/ys/ys-chain-b1v1-sixth-needle-carry-b7-20261025/audit/report.json')
OUT=W/'outputs/axes-20261023/b1-b7-cache-coherency-diagnostic-20261025.json'
PINS={ORIGINAL:'d1736e949348256273198cc181bfc2abe42125f9b8139b8bb466867dc8bc1e54',
 COMPAT:'ea40e31506f9f0d0aee236f21639c7776f8b4786a274a187a740298a3e0a5e89',
 TOOLS:'98e11823b952c024d7769e678ced48a1274fa198ab94379b13971f536b4abcb0',
 RUNTIME:'69c657e35b6f6c1c121d927b6094eb3aa01f2c7db8bbe917433552296863f3e1',
 FAILED:'9472ac5b6b1a270fe2e934c58bbb81223a591173f673d4bd84ae3a4897375bf9'}
TOLERANCE=1e-9

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def flat(m):return [float(x)for row in m for x in row]
def delta(a,b):
    assert len(a)==len(b)
    return max((abs(x-y)for x,y in zip(a,b)),default=0.)
def pointer(o):return int(o.as_pointer())if o is not None else None
def context(bpy):
    scene=bpy.context.window.scene;layer=bpy.context.window.view_layer
    return {'scenePointer':pointer(scene),'sceneName':scene.name,'viewLayerPointer':pointer(layer),
        'viewLayerName':layer.name,'viewLayerIdDataPointer':pointer(layer.id_data),
        'sceneFrame':scene.frame_current,'sceneSubframe':scene.frame_subframe,
        'pythonLayerWrapperIdentity':id(layer),'contextLayerPointer':pointer(bpy.context.view_layer)}
def context_equal(a,b):
    keys=('scenePointer','sceneName','viewLayerPointer','viewLayerName','viewLayerIdDataPointer','sceneFrame','sceneSubframe','contextLayerPointer')
    return all(a[k]==b[k]for k in keys)
def rna(value,depth=0):
    if value is None or isinstance(value,(str,bool,int,float)):return value
    if hasattr(value,'as_pointer'):return {'pointer':pointer(value),'type':type(value).__name__,'name':getattr(value,'name',None)}
    return [rna(v,depth+1)for v in value]
def constraints(ob):
    result=[]
    for c in ob.constraints:
        props={}
        for prop in c.bl_rna.properties:
            if prop.identifier in ('rna_type',):continue
            value=getattr(c,prop.identifier)
            if prop.type=='COLLECTION':
                rows=[]
                for v in value:
                    rows.append({p.identifier:rna(getattr(v,p.identifier))for p in v.bl_rna.properties if p.identifier!='rna_type'and p.type!='COLLECTION'})
                props[prop.identifier]=rows
            else:props[prop.identifier]=rna(value)
        result.append({'pointer':pointer(c),'properties':props,'customProperties':{k:rna(c[k])for k in c.keys()}})
    return result
def object_channels(ob,transform,layer):
    state=transform(ob);state.pop('matrix_world')
    state.update(objectPointer=pointer(ob),dataPointer=pointer(ob.data),constraintState=constraints(ob),
        materialPointers=[pointer(s.material)for s in ob.material_slots],
        visibleLayerMember=ob.name in layer.objects,
        perLayerHide=bool(ob.hide_get(view_layer=layer))if ob.name in layer.objects else None,
        animationDataPointer=pointer(ob.animation_data),
        fontBody=ob.data.body if ob.type=='FONT'else None,
        shapeValues=[float(k.value)for k in ob.data.shape_keys.key_blocks]if ob.type=='MESH'and ob.data.shape_keys else [])
    return state
def coherence(g,objects,layer):
    bpy=g['bpy'];dg=bpy.context.evaluated_depsgraph_get();rows=[]
    for ob in objects:
        world=ob.matrix_world.copy();basis=ob.matrix_basis.copy();evaluated=ob.evaluated_get(dg)
        eworld=evaluated.matrix_world.copy()
        active=any(not c.mute and c.influence!=0 for c in ob.constraints)
        simple=not active and(ob.parent is None or ob.parent_type=='OBJECT')
        parentworld=ob.parent.matrix_world.copy()if ob.parent else None
        epworld=ob.parent.evaluated_get(dg).matrix_world.copy()if ob.parent else None
        expected=basis if ob.parent is None else parentworld@ob.matrix_parent_inverse@basis
        eexpected=basis if ob.parent is None else epworld@ob.matrix_parent_inverse@basis
        ds={'worldVersusParentInverseBasis':delta(flat(world),flat(expected)),
            'evaluatedWorldVersusEvaluatedParentInverseBasis':delta(flat(eworld),flat(eexpected)),
            'worldVersusEvaluatedWorld':delta(flat(world),flat(eworld))}
        rows.append({'name':ob.name,'pointer':pointer(ob),'parent':ob.parent.name if ob.parent else None,
            'matrixWorld':flat(world),'evaluatedMatrixWorld':flat(eworld),'matrixBasis':flat(basis),
            'parentInverse':flat(ob.matrix_parent_inverse),'parentWorldTimesInverseTimesBasis':flat(expected),
            'evaluatedParentTimesInverseTimesBasis':flat(eexpected),'simpleParentEquationApplicable':simple,
            'hide_render':bool(ob.hide_render),'hide_viewport':bool(ob.hide_viewport),
            'perLayerHide':bool(ob.hide_get(view_layer=layer))if ob.name in layer.objects else None,
            'deltas':ds,'coherentWithinOriginalTolerance':simple and all(v<=TOLERANCE for v in ds.values())})
    return {'objects':rows,'depsgraphMode':dg.mode,'context':context(bpy),'count':len(rows),
        'incoherentNames':[r['name']for r in rows if not r['coherentWithinOriginalTolerance']],
        'allTargetsCoherent':bool(rows)and all(r['coherentWithinOriginalTolerance']for r in rows)}
def update(g,objects,tag=False):
    if tag:
        for ob in objects:ob.update_tag()
    g['bpy'].context.evaluated_depsgraph_get().update();g['bpy'].context.view_layer.update()
def verify_runtime(ns,g,tools,report):
    assert id(g)==report['actualMainGlobalsIdentity']and id(ns)==report['actualSnapshotIdentity']
    guard=g['apply'];assert tools['description'](guard.__code__)==report['exactCancellationWrapper']
    closure=dict(zip(guard.__code__.co_freevars,(c.cell_contents for c in guard.__closure__ or())))
    assert set(closure)=={'original'}and closure['original'].__globals__ is g
    assert id(closure['original'])==report['guardOriginalFunctionIdentity']and ns['apply']is closure['original']
    for row in report['runtimeFunctions']:
        bound=g[row['name']];fn=closure['original']if row['name']=='apply'else bound
        assert id(bound)==row['bindingIdentity']and id(fn)==row['resolvedOriginalIdentity']
        assert fn.__globals__ is g and tools['description'](fn.__code__)==row['runtimeCode']
    assert g['VIS_QUEUE']is None

def run(ns,authorized=False,*,expected_helper_sha256,allow_temporary_unhide=False):
    assert authorized is True and type(allow_temporary_unhide)is bool
    assert sha(__file__)==expected_helper_sha256 and not os.path.lexists(OUT)
    for p,h in PINS.items():assert sha(p)==h,p
    failed=json.loads(FAILED.read_text());runtime=json.loads(RUNTIME.read_text())
    assert failed['allGuardedStatesPass']and failed['actualGuardedStates']==18
    offenders=failed['restorationOffenders'];assert len(offenders)==55 and all(r['channel']=='matrix_world'for r in offenders)
    tools=runpy.run_path(str(TOOLS));helper=runpy.run_path(str(ORIGINAL));g=ns['main'].__globals__;bpy=g['bpy'];scene=g['d'].SC
    verify_runtime(ns,g,tools,runtime);gbefore=tools['bindings'](g);nbefore=tools['bindings'](ns)
    window_scene=bpy.context.window.scene;window_layer=bpy.context.window.view_layer;entry_context=context(bpy)
    paths={s:s.render.filepath for s in bpy.data.scenes};media={p:sha(p)for p in paths.values()if p and Path(p).is_file()}
    objects=list(bpy.data.objects);owned=list(scene.objects)
    target_names={r['object']for r in offenders};targets=[o for o in owned if o.name in target_names]
    assert len(targets)==55
    for ob in list(targets):
        parent=ob.parent
        while parent is not None:
            if parent not in targets:targets.append(parent)
            parent=parent.parent
    targets.sort(key=lambda o:o.name)
    transform=helper['transform'];before=None;layer=None;flags=None;report={
        'episode':'B-1','kind':'Zero-render cache/context diagnostic; no strict guard exemption',
        'helper':str(Path(__file__).resolve()),'helperSha256':expected_helper_sha256,
        'inputSha256':{str(p):h for p,h in PINS.items()},'actualFailed114':str(FAILED),'actualFailed114Sha256':PINS[FAILED],
        'failedWorldOnlyCount':55,'allowTemporaryUnhideExplicitlyAuthorized':allow_temporary_unhide,
        'toleranceUnchanged':TOLERANCE,'stages':[],'renders':0,'episodeApplyPoseSetupCalls':0,
        'worldOrBasisAssignments':0,'transformOrConstraintAssignments':0,'finalAcceptance':False}
    started=time.time();error=None
    try:
        bpy.context.window.scene=scene;layer=bpy.context.window.view_layer
        before={o:object_channels(o,transform,layer)for o in objects}
        flags={o:(o.hide_render,o.hide_viewport,o.hide_get(view_layer=layer)if o.name in layer.objects else None)for o in owned}
        report['stages'].append({'name':'selected-B-scene-before-refresh','probe':coherence(g,targets,layer)})
        update(g,owned);report['stages'].append({'name':'normal-update-only','probe':coherence(g,targets,layer)})
        update(g,owned,tag=True);report['stages'].append({'name':'owned-object-tag-and-normal-update','probe':coherence(g,targets,layer)})
        if allow_temporary_unhide and not report['stages'][-1]['probe']['allTargetsCoherent']:
            for ob,(hr,hv,local)in flags.items():
                if hr:ob.hide_render=False
                if hv:ob.hide_viewport=False
                if local is True:ob.hide_set(False,view_layer=layer)
            update(g,owned,tag=True)
            report['stages'].append({'name':'temporary-B-object-visible-normal-update','probe':coherence(g,targets,layer)})
        report['successfulExecutionNotRestorationApproval']=True
    except BaseException as e:error=e;report['error']={'type':type(e).__name__,'message':str(e)[:1000]}
    finally:
        if flags is not None:
            for ob,(hr,hv,local)in flags.items():
                if ob.hide_render!=hr:ob.hide_render=hr
                if ob.hide_viewport!=hv:ob.hide_viewport=hv
                if local is not None and ob.hide_get(view_layer=layer)!=local:ob.hide_set(local,view_layer=layer)
            update(g,owned,tag=True)
            report['stages'].append({'name':'exact-entry-visibility-restored-and-normal-update','probe':coherence(g,targets,layer)})
        after={o:object_channels(o,transform,layer)for o in objects}if before is not None else {}
        channels_changed=[{'object':o.name,'before':before[o],'after':after[o]}for o in objects if before is not None and before[o]!=after[o]]
        bpy.context.window.scene=window_scene;bpy.context.window.view_layer=window_layer;bpy.context.view_layer.update()
        restored=context(bpy);verify_runtime(ns,g,tools,runtime)
        checks={'allOriginalChannelsConstraintsVisibilityAndPointersUnchanged':not channels_changed,
            'runtimeGlobalsAndSnapshotBindingsUnchanged':tools['bindings'](g)==gbefore and tools['bindings'](ns)==nbefore,
            'allPinnedInputsAndFailureEvidenceUnchanged':all(sha(p)==h for p,h in PINS.items()),
            'allSceneFilepathsUnchanged':all(s.render.filepath==p for s,p in paths.items()),
            'existingSceneOutputBytesUnchanged':all(sha(p)==h for p,h in media.items()),
            'contextSceneLayerPointerNameOwnerAndFrameRestored':context_equal(entry_context,restored),
            'visibilityQueueClosed':g['VIS_QUEUE']is None}
        report.update(protectionChecks=checks,channelOffenders=channels_changed,
            entryContext=entry_context,restoredContext=restored,
            pythonWrapperIdentityOnlyDiagnostic={'sameSceneWrapperIs':bpy.context.window.scene is window_scene,
                'sameViewLayerWrapperIs':bpy.context.window.view_layer is window_layer,
                'sameRNAPointers':entry_context['viewLayerPointer']==restored['viewLayerPointer'],
                'pythonIsNotUsedAsRNAIdentityProof':True},
            allRequiredMatricesCoherentAfterFlagsRestored=bool(report['stages'])and report['stages'][-1]['probe']['allTargetsCoherent'],
            temporaryVisibilityChangePerformed=any(s['name']=='temporary-B-object-visible-normal-update'for s in report['stages']),
            seconds=round(time.time()-started,3))
        assert not os.path.lexists(OUT)
        with OUT.open('x')as f:json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
        assert all(checks.values()),('Zero-render diagnostic protection failed',checks)
    if error is not None:raise error
    print(json.dumps({'path':str(OUT),'sha256':sha(OUT),'coherent':report['allRequiredMatricesCoherentAfterFlagsRestored'],
        'renders':0,'finalAcceptance':False}),flush=True)
    return report
