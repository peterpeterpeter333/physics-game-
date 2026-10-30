"""Non-rendering Blender parenting probe; no .blend is saved."""
import ast,json,math,sys,types
from pathlib import Path
import bpy
from mathutils import Vector,Matrix,Euler

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
OUT=Path(__file__).with_suffix('.json')
libpath=W/'scripts/blender/desk_lib.py'
selected={'lin_rgb','rgb','link','principled','mat','set_emit','wood','put','box','cyl','sphere','torus','empty','parent','show','show_tree'}
defs=[node for node in ast.parse(libpath.read_text()).body if isinstance(node,(ast.FunctionDef,ast.AsyncFunctionDef)) and node.name in selected]
d=types.ModuleType('desk_lib');d.__file__=str(libpath)
d.__dict__.update({'bpy':bpy,'math':math,'Vector':Vector,'Matrix':Matrix,'Euler':Euler,'MATS':{}})
exec(compile(ast.Module(body=defs,type_ignores=[]),str(libpath),'exec'),d.__dict__)
path=W/'scripts/blender/desk_lib_b2a_gpt_20261029.py'
p=types.ModuleType('b2parts_audit');p.__file__=str(path);p.d=d
# The audit namespace gets the exact desk_lib function definitions, without
# replacing sys.modules['desk_lib'] or changing the live scene's library.
parts_tree=ast.parse(path.read_text())
parts_tree.body=[node for node in parts_tree.body if not (
    isinstance(node,ast.Import) and any(alias.name=='desk_lib' for alias in node.names))]
exec(compile(parts_tree,str(path),'exec'),p.__dict__)
checks=[]
def add(name,error,limit=2e-6,**extra):
    checks.append({'test':name,'error':float(error),'limit':limit,'pass':float(error)<=limit,**extra})
def actual_vertex(model,ob,index):
    bpy.context.view_layer.update()
    return model['root'].matrix_world.inverted() @ (ob.matrix_world @ ob.data.vertices[index].co)
def local_center(model,ob):
    bpy.context.view_layer.update()
    return model['root'].matrix_world.inverted() @ ob.matrix_world.translation
def world_pose(model):
    model['root'].location=(.31,-.22,.18)
    model['root'].rotation_euler=(2.31,.44,-.37)
    model['root'].scale=(1.1,.83,.94)
    bpy.context.view_layer.update()

terre=p.terrella('audit_terrella')
for transformed in (False,True):
    if transformed:world_pose(terre)
    for dip in (0,12,45,72):
        p.terrella_state(terre,field=1,dip=dip,phase=.723,surface=True)
        for side in ('South','North'):
            comp=terre['parts']['compass'+side]
            red=comp['halves'][0]
            actual=actual_vertex(terre,red,2)
            target=terre['anchors']['compass'+side+'NeedleTip']
            add('terrella_%s_%d_%s'%(side,dip,transformed),(actual-target).length)
            if dip:
                # Actual magnetic north end relative to pivot, not just metadata.
                a=(actual-comp['center']).normalized().dot(comp['normal'])
                expected=(1 if side=='South' else -1)*math.sin(math.radians(dip))
                add('terrella_sign_%s_%d_%s'%(side,dip,transformed),0 if a*expected>0 else 1,
                    actualOutwardDot=a,expectedSign=expected)
    # Verify a field arrow follows the path order, not its inverse.
    for i,(arrow,pathpts) in enumerate(zip(terre['parts']['field_arrows'],terre['parts']['field_paths'])):
        u=(.723*.19+i*.137)%1;k=min(len(pathpts)-2,int(u*(len(pathpts)-1)))
        b=(pathpts[k+1]-pathpts[k]).normalized()
        actual=arrow.rotation_euler.to_quaternion() @ Vector((0,1,0))
        add('field_arrow_direction_%d_%s'%(i,transformed),1-actual.dot(b))

frog=p.frog_experiment('audit_frog')
for transformed in (False,True):
    if transformed:world_pose(frog)
    for contact in (0,.5,1):
        res=p.frog_contacts(frog,contact)
        tips=[]
        for i,(curve,tip) in enumerate(zip(frog['parts']['rods'],frog['parts']['tips'])):
            point=Vector(curve.data.splines[0].points[-1].co[:3])
            bpy.context.view_layer.update()
            world=curve.matrix_world @ point
            sphere=tip.matrix_world.translation
            add('frog_curve_tip_%d_%s_%s'%(i,contact,transformed),(world-sphere).length)
            add('frog_tip_anchor_%d_%s_%s'%(i,contact,transformed),(sphere-res['world'][i]).length)
            base=Vector(curve.data.splines[0].points[0].co[:3])
            add('frog_fixed_base_%d_%s_%s'%(i,contact,transformed),(base-frog['parts']['contact_bases'][i]).length)
            tips.append(sphere)
        if contact==1:add('frog_contact_exact_%s'%transformed,(tips[1]-tips[0]).length)

pile=p.volta_pile('audit_pile',units=30)
for transformed in (False,True):
    if transformed:world_pose(pile)
    for n in (1,15,30):
        p.pile_state(pile,visible_units=n)
        for i in (0,n-1):
            for kind,ob in pile['parts']['layers'][i].items():
                add('pile_center_%d_%s_%d_%s'%(i,kind,n,transformed),
                    (local_center(pile,ob)-pile['layer_centers'][i][kind]).length)
        top=pile['parts']['top_lug'];anchor=pile['anchors']['top_terminal']
        # Right edge of the lug, exactly at the electrical-connection anchor.
        expect=local_center(pile,top)+Vector((.0175,0,0))
        add('pile_top_terminal_%d_%s'%(n,transformed),(anchor-expect).length)
        # Every layer interface is in contact (Zn/paper/Cu, then Cu/Zn).
        cc=pile['layer_centers'][0]
        add('pile_zinc_paper_gap_%s'%transformed,abs((cc['zinc'].z+.001)-(cc['paper'].z-.0013)))
        add('pile_paper_copper_gap_%s'%transformed,abs((cc['paper'].z+.0013)-(cc['copper'].z-.001)))
        if n>1:add('pile_copper_nextzinc_gap_%s'%transformed,
                   abs((cc['copper'].z+.001)-(pile['layer_centers'][1]['zinc'].z-.001)))

leaves=p.electroscope('audit_leaves')
for transformed in (False,True):
    if transformed:world_pose(leaves)
    for opening in (0,.5,1):
        p.electroscope_state(leaves,opening)
        for i,hinge in enumerate(leaves['parts']['leaf_hinges']):
            ob=next(c for c in hinge.children if c.type=='MESH')
            a=actual_vertex(leaves,ob,2);b=actual_vertex(leaves,ob,3)
            center=(a+b)*.5
            expected=leaves['anchors']['leaf_left' if i==0 else 'leaf_right']
            add('goldleaf_actual_tip_%d_%s_%s'%(i,opening,transformed),(center-expected).length)

# Construct every other factory once. Shader/mesh factories must not depend on
# the render stage, and the model object list must contain all descendants.
models=[terre,frog,pile,leaves]
for kind in ('covered_table','static_generator','rubbed_glass','water_analogy','dry_cell','torpedo_ray','smoke_alarm','scientist','door_knob'):
    models.append(p.FACTORIES[kind]('audit_'+kind))
for model in models:
    allchildren=set(model['root'].children_recursive)|{model['root']}
    listed=set(model['objects'])
    add('object_list_'+model['name'],len(allchildren.symmetric_difference(listed)),limit=0)
    # A reset must retain the caller's external transform.
    world_pose(model)
    old=model['root'].matrix_world.copy();p.reset(model);bpy.context.view_layer.update()
    add('root_preserved_'+model['name'],max(abs(old[r][c]-model['root'].matrix_world[r][c]) for r in range(4) for c in range(4)))
    p.visible(model,False)

report={'scope':'actual Blender object matrices and mesh vertices; no render/no .blend save',
        'partsFile':str(path),'checks':checks,'total':len(checks),
        'failed':[c for c in checks if not c['pass']]}
OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('B2A_PARTS_PROBE',json.dumps({'total':len(checks),'failed':report['failed'],'path':str(OUT)}))
if report['failed']:raise RuntimeError('parts parenting probe failed')
