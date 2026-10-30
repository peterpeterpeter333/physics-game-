"""Private exact-replay v2: complete transform restoration and zero-pixel diagnosis.

The original7e6c audit/contact/replay source remains unchanged. No world-matrix
fallback, numeric tolerance change, model rebuild, live-function rebind or
render operator. A rotation-mode cause is only a hypothesis until measured.
"""
import hashlib
import json
from pathlib import Path
import runpy
import time
import types

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
ORIGINAL=W/'scripts/blender/desk_axes_d1_pier_contact_audit_20261025.py'
ORIGINAL_SHA='7e6c0c3dfb26427a996a1869ab13ea7f69c17b2c39784a827ee5e82dd083768a'
IMAGES=W/'scripts/blender/desk_axes_d1_pier_contact_images_20261025.py'
IMAGES_SHA='4e9d41accb35d8a31211a65c3ce76740a7e07dc81d021a6a2e2bc0e114b0b479'
OUT=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-v2-20261025')
FINAL=Path('/private/tmp/ys/ys-chain-d1v1-final-complete-v4-resumed-20261025')
TOLERANCE=1e-9

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def write(p,x):
    p=Path(p);assert not p.exists()and not p.is_symlink()
    p.parent.mkdir(parents=True,exist_ok=True)
    with p.open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1,allow_nan=False)
def flat(m):return tuple(float(x)for row in m for x in row)
def difference(a,b):return max((abs(float(x)-float(y))for x,y in zip(a,b)),default=0.)

assert sha(ORIGINAL)==ORIGINAL_SHA
_original=runpy.run_path(str(ORIGINAL)) # definitions only; original import is inert
_Base=_original['DeliveredReplay']

def transform(ob):
    return {'location':ob.location.copy(),'rotation_mode':ob.rotation_mode,
        'rotation_euler':ob.rotation_euler.copy(),'rotation_quaternion':ob.rotation_quaternion.copy(),
        'rotation_axis_angle':tuple(ob.rotation_axis_angle),'scale':ob.scale.copy(),
        'delta_location':ob.delta_location.copy(),'delta_rotation_euler':ob.delta_rotation_euler.copy(),
        'delta_rotation_quaternion':ob.delta_rotation_quaternion.copy(),'delta_scale':ob.delta_scale.copy(),
        'matrix_parent_inverse':ob.matrix_parent_inverse.copy(),'matrix_basis':ob.matrix_basis.copy(),
        'matrix_world':ob.matrix_world.copy(),'parent':ob.parent,'parent_type':ob.parent_type,
        'parent_bone':ob.parent_bone,'parent_vertices':tuple(ob.parent_vertices)}

def serial(state,name):
    result={}
    for key,value in state.items():
        if key.startswith('matrix_'):result[key]=list(flat(value))
        elif key=='parent':result[key]=name(value)if value is not None else None
        elif isinstance(value,str):result[key]=value
        else:result[key]=list(value)
    return result

class DeliveredReplay(_Base):
    """Same public API; repairs/restores are still episode-private callables."""
    def __init__(self,ns,cache=FINAL):
        self.transformRestorationReport=None;self.transformRestorationDiagnostics=None
        super().__init__(ns,cache)
        self.protected[str(ORIGINAL)]=ORIGINAL_SHA
        self.protected[str(Path(__file__).resolve())]=sha(__file__)

    def snapshot_entry(self):
        super().snapshot_entry()
        self.full_entry={o:transform(o)for o in self.objects}

    def name(self,o):return self.g['CREATED_NAME'].get(o,o.name)

    def namespace_evidence(self):
        results={}
        for name in ['catalog_camera','pose_cam']:
            fn=getattr(self.d,name);gg=fn.__globals__
            results[name]={}
            for key,expected in [('CAM',self.d.CAM),('CAM_D',self.d.CAM_D),('SC',self.d.SC)]:
                value=gg.get(key)
                results[name][key]={'sameObject':value is expected,'actualName':getattr(value,'name',None),
                    'expectedName':getattr(expected,'name',None),
                    'actualPointer':value.as_pointer()if hasattr(value,'as_pointer')else None,
                    'expectedPointer':expected.as_pointer()}
        return results

    def offenders(self):
        answer=[]
        for ob,entry in self.full_entry.items():
            after=transform(ob);a=serial(entry,self.name);b=serial(after,self.name);deltas={}
            for key in a:
                if isinstance(a[key],list):
                    value=difference(a[key],b[key])
                    if value>TOLERANCE:deltas[key]=value
                elif a[key]!=b[key]:deltas[key]={'entry':a[key],'after':b[key]}
            if deltas:
                answer.append({'creationName':self.name(ob),'objectName':ob.name,'objectType':ob.type,
                    'entry':a,'after':b,'channelDifferences':deltas,
                    'maxWorldMatrixDelta':difference(a['matrix_world'],b['matrix_world']),
                    'maxBasisMatrixDelta':difference(a['matrix_basis'],b['matrix_basis'])})
        return answer

    def restore_full_transforms(self):
        self.bpy.context.window.scene=self.scene
        for ob,s in self.full_entry.items():
            assert ob.parent is s['parent']and ob.parent_type==s['parent_type']and ob.parent_bone==s['parent_bone']and tuple(ob.parent_vertices)==s['parent_vertices'],'Original parent relationship changed'
            ob.rotation_mode=s['rotation_mode']
            for key in ['location','rotation_quaternion','rotation_axis_angle','rotation_euler','scale',
                'delta_location','delta_rotation_quaternion','delta_rotation_euler','delta_scale','matrix_parent_inverse']:
                setattr(ob,key,s[key])
        self.bpy.context.view_layer.update()
        # Basis/world are derived from the saved actual channels, not forced to
        # hide an omitted channel, changed parent, constraint or evaluation bug.
        return self.offenders()

    def restore_original_components_only(self):
        """Exact old component restoration for diagnosis; no close()/render."""
        self.bpy.context.window.scene=self.scene
        for ob,(location,rotation,scale,render,viewport,material,shapes,text)in self.entry.items():
            ob.location=location;ob.rotation_euler=rotation;ob.scale=scale
            if ob.hide_render!=render:ob.hide_render=render
            if ob.hide_viewport!=viewport:ob.hide_viewport=viewport
            if ob.active_material is not material:ob.active_material=material
            for key,value in shapes:key.value=value
            if text is not None:ob.data.body=text
        self.bpy.context.view_layer.update()
        return self.offenders()

    def close(self):
        if self.closed:return
        report={'helperSha256':sha(__file__),'originalAuditSha256':ORIGINAL_SHA,
            'toleranceUnchanged':TOLERANCE,'namespaceBindings':self.namespace_evidence(),
            'noWorldOrBasisMatrixAssignment':True,'beforeRestorationOffenders':self.offenders()}
        checks={};original_error=None
        try:
            report['afterFullComponentRestoreBeforeOriginalClose']=self.restore_full_transforms()
        except BaseException as error:
            report['fullComponentRestorationError']={'type':type(error).__name__,'message':str(error)}
        try:checks.update(super().close())
        except BaseException as error:
            original_error=error
            if error.args and isinstance(error.args[0],dict):checks.update(error.args[0])
            report['originalCloseError']={'type':type(error).__name__,'message':str(error)}
        previous=self.bpy.context.window.scene
        try:
            self.bpy.context.window.scene=self.scene;self.bpy.context.view_layer.update()
            report['afterOriginalCloseOffenders']=self.offenders()
        finally:self.bpy.context.window.scene=previous
        checks['fullTransformRepresentationRestored']=not report['afterOriginalCloseOffenders']and not report.get('fullComponentRestorationError')
        checks['cameraFunctionNamespacesUseOwnedEpisodeObjects']=all(v['sameObject']for f in report['namespaceBindings'].values()for v in f.values())
        report.update(protectionChecks=checks,allPass=all(checks.values()),renders=0,automaticApproval=False,finalAcceptance=False)
        dest=OUT/'transform-restoration'/('close-%d.json'%time.time_ns());write(dest,report)
        self.transformRestorationDiagnostics=report;self.transformRestorationReport={'path':str(dest),'sha256':sha(dest)}
        assert report['allPass'],{'protectionChecks':checks,'transformDiagnostics':self.transformRestorationReport,
            'allOffenders':report['afterOriginalCloseOffenders'],'originalCloseError':str(original_error)if original_error else None}
        return checks

def run(ns,authorized=False,out=None):
    """Unchanged original full audit code, only v2 replay class/new output."""
    assert authorized is True
    scope={**_original['run'].__globals__,'DeliveredReplay':DeliveredReplay,'OUT':OUT,'__file__':__file__}
    return types.FunctionType(_original['run'].__code__,scope)(ns,authorized=True,out=out)

def diagnostic(ns,authorized=False,out=None):
    """Root queued zero-render source/problem/catalog cleanup isolation."""
    assert authorized is True and sha(IMAGES)==IMAGES_SHA
    dest=Path(out or OUT/'diagnostic/report.json');assert dest.is_relative_to(OUT)and not dest.exists()
    ctx=None;started=time.time();report={'mode':'zero-render-transform-diagnostic','helperSha256':sha(__file__),
        'originalAuditSha256':ORIGINAL_SHA,'originalImagesSha256':IMAGES_SHA,'renders':0,'scenarios':[],
        'causeNotAssumedQuaternion':True,'toleranceUnchanged':TOLERANCE,'automaticApproval':False,'finalAcceptance':False}
    try:
        ctx=DeliveredReplay(ns);ctx.open();image=runpy.run_path(str(IMAGES))
        report['namespaceBindings']=ctx.namespace_evidence()
        for label in ['no-operation','exact-delivered7917','problem-challenge','problem-answer','engine-catalog-oblique','engine-catalog-top']:
            assert not ctx.restore_full_transforms(),'Full precondition restoration failed'
            if label=='exact-delivered7917':
                ctx.replay(ctx.rows[7917])
                for f in ctx.families:
                    if not f['pier'].hide_render:ctx.repair(f)
            elif label.startswith('problem-'):image['setup_extra'](ctx,_original,label.split('-')[1])
            elif label.startswith('engine-catalog-'):
                image['setup_extra'](ctx,_original,'engine');ctx.d.catalog_camera((-.20,.10,.38),label.endswith('-top'),.32);ctx.bpy.context.view_layer.update()
            old=ctx.restore_original_components_only();full=ctx.restore_full_transforms()
            report['scenarios'].append({'scenario':label,'oldComponentOnlyRestoreOffenders':old,
                'oldComponentOnlyPass':not old,'newFullRestoreOffenders':full,'newFullRestorePass':not full,
                'namespaceBindings':ctx.namespace_evidence()})
            assert not full,('Full restoration not proven',label)
        report['allScenarioFullRestorationsPass']=all(r['newFullRestorePass']for r in report['scenarios'])
    except BaseException as error:
        report['error']={'type':type(error).__name__,'message':str(error)}
        raise
    finally:
        if ctx is not None:
            try:report['protectionChecks']=ctx.close()
            except BaseException as error:report['cleanupError']={'type':type(error).__name__,'message':str(error)}
            report['transformRestorationReport']=ctx.transformRestorationReport
        report['seconds']=round(time.time()-started,3);write(dest,report)
        assert not report.get('error')and not report.get('cleanupError')and report.get('protectionChecks')and all(report['protectionChecks'].values()),report
    return report
