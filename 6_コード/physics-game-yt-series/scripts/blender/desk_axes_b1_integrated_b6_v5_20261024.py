"""Root-only B3+B4v4+B5v4+B6v5 integrated actual-source derivative.

Import is inert. Audit renders zero images. Root approves dependency and
integrated probes before one final raw render. Original source/media stay fixed.
"""
import ast,copy,hashlib,json,math,os,runpy,time,types
from pathlib import Path
import numpy as np

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
B3=Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
B4=Path('/private/tmp/ys/ys-chain-b1v1-camera-size-b4-v4-20261024/probe/report.json')
B4SOURCE=W/'scripts/blender/desk_axes_b1_camera_size_b4_v4_20261024.py'
B5=Path('/private/tmp/ys/ys-chain-b1v1-repel-b5-v4-20261024/probe/report.json')
B5SOURCE=W/'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py'
B5SHA='02c64b5916c754b08b67c5a46330d11a0ca58323ca2f67844a70d4175a9b65d3'
B4SHA='d0a04b5b7a933e609a6a26b869d16decd0ff0bf6e493a4384e7bc918d8a28dc2'
BASESHA='3956feb23129e64514852978fba184e9e3f416f627e5c1139b5f94a12ed19841'
STAGESHA='7b82aac06a606983b4faa00dbca898c8da07ab417bd7a21d0a0b48b6a3a58eb4'
OUT=Path('/private/tmp/ys/ys-chain-b1v1-integrated-b6-v5-20261024')
SHIP={'open:box','open:mio','last:needle'}
GARLIC={'garlic:side','garlic:rub','garlic:nail','garlic:mio'}
PAIR={'rule:first','rule:bar','rule:pull'}
KEYS=SHIP|GARLIC|PAIR|{'lore:garlic','rule:north','terella:idea'}
PROBES=(1.5,5.,39.3,46.5,61.5,68.3,68.7,75.5,81.2,81.6,82.,94.6,97.6,97.83333333333333,98.6,115.,121.6,122.,122.4,355.)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def write(p,v):
    with Path(p).open('x') as f:json.dump(v,f,ensure_ascii=False,indent=1,allow_nan=False)
def inventory(p):return {f.name:(f.stat().st_size,f.stat().st_mtime_ns,str(f.resolve())) for f in sorted(Path(p).glob('*.jpg'))}

class CameraFitConvergenceError(RuntimeError):pass

def run(ns,authorized=False,mode='audit',b4_probe_sha256=None,b5_probe_sha256=None,dependency_probes_visually_approved=False,visually_approved=False,probe_report_sha256=None):
    assert authorized is True and mode in {'audit','probe','render'}
    dest=OUT/mode;assert not OUT.is_symlink() and not os.path.lexists(dest)
    assert sha(B3/'prepared.json')==BASESHA and sha(B5SOURCE)==B5SHA and sha(B4SOURCE)==B4SHA
    assert b4_probe_sha256 and b5_probe_sha256 and sha(B4)==b4_probe_sha256 and sha(B5)==b5_probe_sha256
    p4=read(B4);p5=read(B5);prepared=read(B3/'prepared.json');provenance=read(B3/'composite-provenance.json')
    assert p4['helperSha256']==B4SHA and p5['helperSha256']==B5SHA
    assert p4['allGuardedStatesPass'] and p5['allGuardedStatesPass'] and len(p4['actualImages'])==4 and len(p5['actualImages'])==4
    assert p4['approachFractions']=={'lore:garlic':.01,'rule:first':.05,'rule:north':.05}
    assert p4['modelsVoiceSubtitlesAndTimesUnchanged']is False
    assert p4['modelMeshesVoiceSubtitlesAndSourceTimesUnchanged']and p4['garlicInitialPlacementIsExplicitDerivative']
    assert p4['placementFunction']=='apply_lore_garlic_initial'and p4['placementFunctionHelperSha256']==B4SHA
    for proof in (p4,p5):
        assert all(proof['protectionChecks'].values())
        for im in proof['actualImages']:assert sha(im['path'])==im['sha256']
    if mode!='audit':assert dependency_probes_visually_approved is True
    for p,h in prepared['outputHashes'].items():assert sha(B3/p)==h
    poses3=read(B3/'blender/delivered-camera-poses.json')['poses'];assert len(poses3)==10700
    g=ns['main'].__globals__;d=g['d'];bpy=g['bpy'];scene=d.SC
    assert sha(g['__file__'])==STAGESHA and scene.render.engine=='BLENDER_EEVEE' and g['VIS_QUEUE'] is None
    plan=read('/private/tmp/ys/ys-chain-b1v1-retained-plan-20261024.json')['plans']
    assert len(plan)==10700 and all(tuple(g['plan'](j))==tuple(p) for j,p in enumerate(plan))
    original_apply=g['apply'];cues={c['key']:c for c in g['CUES']}
    bindings={k:g[k] for k in ('main','apply','apply_state','plan','pose_at','SPANS','EVENTS','BASE','GROUPS','CHILDREN')}
    old_scene=bpy.context.window.scene;paths={s.name:s.render.filepath for s in bpy.data.scenes}
    other_files={p:sha(p) for p in paths.values() if p and Path(p).is_file()}
    settings={k:getattr(scene.render,k) for k in ('filepath','resolution_x','resolution_y','resolution_percentage')}
    old_extra=(scene.render.image_settings.file_format,scene.render.image_settings.quality,scene.eevee.taa_render_samples)
    old_inventory=inventory(B3/'blender/desk');assert len(old_inventory)==10700
    protected_paths=[Path(g['__file__']),W/'scripts/blender/desk_lib_b1.py',B3/'prepared.json',B3/'composite-provenance.json',B3/'blender/delivered-camera-poses.json',B3/'blender/desk/anchors.json',B3/'blender/desk/meta.json',B4,B5,B5SOURCE,B4SOURCE]
    protected_paths += [Path(g['A'].cache)/f for f in ['ys-chain-b1v1.wav','ys-chain-b1v1.json','phrase-times.json','blender/data.json']]
    protected={str(p):sha(p) for p in protected_paths};data_before=json.dumps(g['DATA'],sort_keys=True)
    report={'id':'ys-chain-b1v1','mode':mode,'helperSha256':sha(__file__),'b3PreparedSha256':BASESHA,'b4ProbeSha256':b4_probe_sha256,'b5ProbeSha256':b5_probe_sha256,'dependencyProbeVisualApproval':dependency_probes_visually_approved,'kind':'integrated B4+B5v4 plus required B6 shot actions','actualImages':[],'originalInspectorModified':False,'originalGateNGPreserved':True,'finalAcceptance':False}
    started=time.time();source_hashes={};projection_error=0.;local_cache={}
    try:
        bpy.context.window.scene=scene
        selected=[j for j in range(10700) if g['cue_at'](j/30)['key'] in KEYS];refs={}
        for j in selected:
            r=provenance['records'][j];assert r['frame']==j
            ref=r['originalObjectSourceFrame'];ref=(j if plan[j][0]=='render' else plan[j][1]) if ref is None else ref
            assert g['cue_at'](ref/30)['key']==g['cue_at'](j/30)['key']
            real=str(Path(r['source']).resolve());assert (B3/'blender/desk'/('%05d.jpg'%j)).resolve()==Path(real)
            if real not in source_hashes:source_hashes[real]=sha(real)
            assert source_hashes[real]==r['sha256'];refs[j]=ref
        def tree(o):return [o]+[v for child in g['CHILDREN'].get(o,()) for v in tree(child)]
        def world_points(obs):
            deps=bpy.context.evaluated_depsgraph_get();points=[]
            for ob in dict.fromkeys(obs):
                if ob.hide_render or ob.type not in ('MESH','FONT','CURVE'):continue
                cacheable=ob.type=='MESH' and not ob.data.shape_keys
                if cacheable and ob in local_cache:vv=local_cache[ob]
                else:
                    ev=ob.evaluated_get(deps);me=ev.to_mesh()
                    if me is None:continue
                    try:
                        v=np.empty(len(me.vertices)*3,dtype=np.float64);me.vertices.foreach_get('co',v);vv=np.column_stack((v.reshape(-1,3),np.ones(len(me.vertices))))
                    finally:ev.to_mesh_clear()
                    if cacheable:local_cache[ob]=vv
                if len(vv):points.append(vv@np.asarray(ob.matrix_world,dtype=np.float64).T)
            assert points;return np.concatenate(points)
        def project(vv):
            nonlocal projection_error
            deps=bpy.context.evaluated_depsgraph_get();m=d.CAM.calc_matrix_camera(deps,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted();q=vv@np.asarray(m).T
            assert np.isfinite(q).all() and (q[:,3]>0).all()
            xy=np.column_stack(((q[:,0]/q[:,3]+1)*540,(1-q[:,1]/q[:,3])*960))
            for k in {0,len(vv)//2,len(vv)-1}:
                old=d.project(g['Vector'](vv[k,:3]));e=max(abs(old[0]-xy[k,0]),abs(old[1]-xy[k,1]));projection_error=max(projection_error,float(e));assert e<=.11
            return [float(xy[:,0].min()),float(xy[:,1].min()),float(xy[:,0].max()),float(xy[:,1].max())]
        # Reuse pinned v4 stage/place definitions without invoking its full run.
        v3=runpy.run_path(str(B5SOURCE));tree_ast=ast.parse(B5SOURCE.read_text());outer=next(n for n in tree_ast.body if isinstance(n,ast.FunctionDef) and n.name=='run');tr=next(n for n in outer.body if isinstance(n,ast.Try));defs=[n for n in tr.body if isinstance(n,ast.FunctionDef) and n.name in {'stages','place'}];assert len(defs)==2
        phase={**v3,'g':g,'d':d,'bpy':bpy,'original_apply':original_apply,'world_points':world_points,'tree':tree};exec(compile(ast.Module(body=defs,type_ignores=[]),str(B5SOURCE),'exec'),phase)
        b4module=runpy.run_path(str(B4SOURCE));lore_placement=b4module['apply_lore_garlic_initial']
        report['loreGarlicInitialPlacement']={'helper':str(B4SOURCE),'helperSha256':B4SHA,'function':'apply_lore_garlic_initial',
            'strictSameDefinitionAsApprovedB4Probe':True,'oldInitial':[0.,-.12,.018],'newInitial':[.035,-.047,.018],
            'waitingShiftMeters':math.hypot(.035,.073),'onlyCue':'lore:garlic','originalNoseApproachAndSniffRetained':True,
            'fixedSiteException':'Only the explicitly approved lore garlic waiting endpoint moves about8.10cm; all other fixed sites stay original.'}
        b5place=phase['place'];b5stages=phase['stages'];az=math.radians(poses3[2061][4]);right=g['Vector']((math.cos(az),math.sin(az),0));away=g['Vector']((-math.sin(az),math.cos(az),0))
        a=g['PARTS']['magnets']['a'];garlic=g['PARTS']['garlic'];doll=g['PARTS']['gilbert'];doll_site=g['BASE'][doll][0].copy()
        doll_delta=g['Vector']((0,0,0));wait_shift=g['Vector']((0,0,0));wait=g['BASE'][garlic['root']][0].copy()
        from mathutils import Matrix
        ship_pivot=g['Vector']((.13,.30,0));ship_site=ship_pivot.copy();ship_rot=Matrix.Identity(3)
        rock=g['PARTS']['terrella']['rock'];poles=[o for o in g['GROUPS']['terrella'] if 'b1_pole' in o.name and o.type=='MESH'];assert len(poles)==2
        retire_start=cues['rule:first']['start'];descent_start=cues['terella:idea']['start']
        def show(obs):
            for ob in obs:
                if ob.hide_render:ob.hide_render=False
                if ob.hide_viewport:ob.hide_viewport=False
        def shift_group(name,delta):
            for ob in g['GROUPS'][name]:
                if ob.parent not in g['GROUPS'][name]:ob.location+=delta
        def place(ref,t):
            key=g['cue_at'](t)['key'];points=b5place(ref,t) if key=='rule:pull' else original_apply(ref/30)
            bar_before={o:tuple(v for row in o.matrix_world for v in row) for o in (g['PARTS']['magnets']['a'],g['PARTS']['magnets']['b'])} if key=='rule:pull' else {}
            if key=='lore:garlic':lore_placement(g,ref)
            # Reproduce B3's already approved grounded board +.20m, not old site.
            if key=='open:who':d.board_h.location.x+=.20
            if key in SHIP or key=='open:who':
                for ob in g['GROUPS']['ship']:
                    if ob.parent not in g['GROUPS']['ship']:
                        ob.location=ship_site+ship_rot@(ob.location-ship_pivot);ob.rotation_euler=(ship_rot@ob.rotation_euler.to_matrix()).to_euler()
            if key=='doubt:gilbert' or key in GARLIC:show(g['GROUPS']['gilbert']);shift_group('gilbert',doll_delta)
            if key in GARLIC:
                if t<68.09:garlic['root'].location=wait.copy()
                elif t<68.49:garlic['root'].location=wait.lerp(g['Vector']((-.035,-.02,.036)),g['u'](t,68.09,.4))
                elif 70.35<=t<71.15:
                    end=g['Vector']((-.035+.025*math.sin(g['u'](70.35,68.49,1.8)*math.pi*6),-.02,.036));garlic['root'].location=end.lerp(wait,g['u'](t,70.35,.8))
                elif t>=71.15:garlic['root'].location=wait.copy()
            if key in PAIR:
                # First slide sideways clear of the two real magnets, then
                # backward to the stable rear site; do not pass through B.
                u=g['u'](t,retire_start,.8);delta=g['Vector']((.10*min(1,u/.35),.30*max(0,(u-.35)/.65),0));show(tree(garlic['root']));garlic['root'].location=wait+delta
                for nail in garlic['nails']:show(tree(nail));nail.location=g['BASE'][nail][0]+g['Vector']((0,-.04,0))+delta
            if key=='terella:idea':
                u=g['u'](t,descent_start,.8);dz=.040*(1-u)-.002*math.sin(math.pi*u)
                for ob in [rock]+poles:ob.location.z+=dz
            bpy.context.view_layer.update()
            assert all(tuple(v for row in o.matrix_world for v in row)==m for o,m in bar_before.items()),'B6 secondary props must preserve exact B5v4 bars'
            return points
        def principal(key):
            if key in SHIP or key=='rule:north':return g['GROUPS']['compass']
            if key=='open:who':return g['GROUPS']['compass']+tree(d.board_h)
            if key=='lore:garlic':return g['GROUPS']['sailor']
            if key=='doubt:gilbert':return g['GROUPS']['gilbert']
            if key in GARLIC:return tree(a)
            if key in PAIR:return g['GROUPS']['magnets']
            if key=='terella:idea':return [rock]
            raise AssertionError(key)
        def critical(key):
            if key in SHIP:return g['GROUPS']['ship']
            if key=='lore:garlic':return tree(garlic['root'])
            if key in GARLIC:return g['GROUPS']['gilbert']+tree(garlic['root'])+[v for nail in garlic['nails'] for v in tree(nail)]
            return []
        def measure(vv,p):g['pose_b1'](p);bpy.context.view_layer.update();return project(vv)
        cloud_cache={}
        def cloud(keys,role):
            sig=(tuple(sorted(keys)),role)
            if sig not in cloud_cache:
                clouds=[]
                for j in selected:
                    key=g['cue_at'](j/30)['key']
                    if key in keys:
                        place(refs[j],j/30)
                        obs=principal(key) if role=='principal' else critical(key) if role=='critical' else tree(g['PARTS']['compass']['needle'])
                        clouds.append(world_points(obs))
                cloud_cache[sig]=np.unique(np.concatenate(clouds),axis=0)
            return cloud_cache[sig]
        fit_attempts=[];report['cameraFitAttempts']=fit_attempts
        def fit(keys,pose,target,center):
            """Bounded damped solve; real quality/clip thresholds stay unchanged.

            World X becomes nearly view-parallel at az90. Solve in the true
            screen-horizontal XY direction plus world Z, not a singular X/Z basis.
            """
            vv=cloud(keys,'principal');p=list(pose);wanted=np.asarray(center,dtype=float)
            az=math.radians(p[4]);directions=[np.array([math.cos(az),math.sin(az),0.]),np.array([0.,0.,1.])]
            trace={'keys':sorted(keys),'target':target,'center':list(center),'initialPose':p[:],
                'basis':[v.tolist()for v in directions],'maximumPanStepMeters':.025,'iterations':[],'converged':False}
            fit_attempts.append(trace)
            def residual(bb):
                c=np.array([(bb[0]+bb[2])/2,(bb[1]+bb[3])/2]);w=(bb[2]-bb[0])/1080
                return c,w,float(np.linalg.norm(wanted-c)+1080*abs(w-target))
            for iteration in range(80):
                bb=measure(vv,p);ratio=((bb[2]-bb[0])/1080)/target
                p[3]*=max(.5,min(2.,ratio))
                if not .12<=p[3]<=2.5:
                    trace['failure']='Solver camera distance outside its bounded search domain'
                    raise CameraFitConvergenceError(trace['failure'])
                bb=measure(vv,p);c,w,score=residual(bb);delta=wanted-c
                row={'iteration':iteration,'pose':p[:],'width':w,'center':c.tolist(),'score':score};trace['iterations'].append(row)
                if abs(w-target)<2e-5 and float(np.abs(delta).max())<.05:
                    trace.update(converged=True,fittedPose=p[:],finalBox=bb);return p
                if float(np.abs(delta).max())<.05:continue
                cols=[]
                for direction in directions:
                    pp=p[:]
                    for axis in range(3):pp[axis]+=.001*float(direction[axis])
                    bc=measure(vv,pp);cc=np.array([(bc[0]+bc[2])/2,(bc[1]+bc[3])/2]);cols.append((cc-c)/.001)
                jac=np.column_stack(cols);assert np.isfinite(jac).all()
                gram=jac.T@jac;damping=max(1e-9,float(np.trace(gram))*1e-10)
                change=np.linalg.solve(gram+np.eye(2)*damping,jac.T@delta)
                assert np.isfinite(change).all(),'Non-finite private camera step'
                peak=float(np.abs(change).max());change*=min(1.,.025/max(peak,1e-15))
                condition=float(np.linalg.cond(jac))
                row.update(jacobianCondition=condition if math.isfinite(condition) else 'non-finite',rawPanStepMaximumMeters=peak,boundedPanStep=change.tolist())
                accepted=False
                for fraction in (1.,.5,.25,.125,.0625,.03125,.015625):
                    trial=p[:]
                    for coefficient,direction in zip(change,directions):
                        for axis in range(3):trial[axis]+=float(coefficient*direction[axis]*fraction)
                    tb=measure(vv,trial);trial[3]*=max(.5,min(2.,((tb[2]-tb[0])/1080)/target))
                    if not .12<=trial[3]<=2.5:continue
                    tb=measure(vv,trial);tc,tw,new_score=residual(tb)
                    if new_score<score-1e-7:
                        p=trial;row.update(acceptedFraction=fraction,newScore=new_score);accepted=True;break
                if not accepted:
                    trace['failure']='No bounded damped step reduced the exact projected residual'
                    raise CameraFitConvergenceError(trace['failure'])
            trace['failure']='Private solver iteration bound reached without exact target/center convergence'
            raise CameraFitConvergenceError(trace['failure'])
        candidates=[];report['cameraCandidates']=candidates
        def choose(keys,baseline,azimuths,elevations,targets,centers,ship=False):
            primary=cloud(keys,'principal');required=cloud(keys,'critical');needle=cloud(keys,'needle') if ship else None
            for azimuth in azimuths:
                for elevation in elevations:
                    for target in targets:
                        for center in centers:
                            base=list(baseline);base[4]=azimuth;base[5]=elevation
                            row={'keys':sorted(keys),'target':target,'azimuth':azimuth,'elevation':elevation,'requestedCenter':list(center),'checks':[]}
                            candidates.append(row)
                            try:p=fit(keys,base,target,center)
                            except CameraFitConvergenceError as exc:
                                row.update(solverConverged=False,solverFailure=str(exc),solverAttemptIndex=len(fit_attempts)-1);continue
                            checks=[];row.update(solverConverged=True,solverAttemptIndex=len(fit_attempts)-1,pose=p)
                            for factor in (1.,1.04):
                                pp=p[:];pp[3]*=factor;bb=measure(primary,pp);cc=project(required);w=(bb[2]-bb[0])/1080
                                good=.4<=w<=.7 and bb[0]>=40 and bb[2]<=1040 and bb[1]>=110 and bb[3]<=1600 and cc[0]>=0 and cc[2]<=1080 and cc[1]>=210 and cc[3]<=1120
                                nn=project(needle) if ship else None
                                if ship:
                                    good=good and nn[1]>=210 and nn[3]<=1120 and (cc[0]+cc[2])/2>(bb[0]+bb[2])/2+30
                                    good=good and (cc[0]>=nn[2]+8 or cc[3]<=nn[1]-8)
                                checks.append({'factor':factor,'primaryBox':bb,'width':w,'criticalBox':cc,'needleBox':nn,'pass':bool(good)})
                            row['checks']=checks
                            if all(x['pass'] for x in checks):return p
            raise AssertionError(('Original fixed prop site could not be framed; preserve values and ask root',sorted(keys),len(candidates)))
        ship_pose=choose(SHIP,poses3[60],(-10,0,10,20),(40,35,30),(.50,.46,.42),((420,650),(420,700),(420,750),(380,700)),ship=True)
        garlic_pose=choose(GARLIC,poses3[2061],(90,85,95,80,100,75,70),(25,30,36),(.42,.44,.48,.50),((500,950),(540,950),(500,900),(540,900),(600,950),(600,900)))
        newposes={'ship':ship_pose,'garlic':garlic_pose,'descent':fit({'terella:idea'},poses3[3690],.66,(540,820))}
        def camera(t):
            j=min(10699,max(0,round(t*30)));key=g['cue_at'](t)['key'];cue=cues[key]
            if key in p4['newPoses']:
                p=list(p4['newPoses'][key]);p[3]*=1+p4['approachFractions'][key]*(1-g['u'](t,cue['start'],cue['move'])) if cue['move'] else 1;return p
            if key=='rule:pull':return list(p5['newPoses'][key])
            kind='ship' if key in SHIP else 'garlic' if key in GARLIC else 'descent' if key=='terella:idea' else None
            if kind is None:return list(poses3[j])
            p=list(newposes[kind]);duration=1.5 if key=='open:box' else 1.2 if key=='last:needle' else 1 if key=='garlic:side' else 1.4 if kind=='descent' else 0
            if duration:p[3]*=1+.04*(1-g['u'](t,cue['start'],duration))
            return p
        def phase_values(t):
            key=g['cue_at'](t)['key']
            if key=='rule:pull':return tuple(round(v,12) for v in b5stages(t))
            if key=='rule:first':return (round(g['u'](t,retire_start,.8),12),)
            if key=='terella:idea':return (round(g['u'](t,descent_start,.8),12),)
            if key in GARLIC:return (round(g['u'](t,68.09,.4),12),round(g['u'](t,70.35,.8),12))
            return ()
        replacements={};sources={};unique={}
        for j in selected:
            sig=(refs[j],tuple(round(v,12) for v in camera(j/30)),phase_values(j/30));k=unique.setdefault(sig,j);replacements[j]=k;sources[k]=refs[j]
        def state(j):
            aa=place(sources[j],j/30);g['pose_b1'](camera(j/30));bpy.context.view_layer.update();return aa
        physical=[];magnetic_proof=[]
        for j in sorted(sources):
            state(j);key=g['cue_at'](j/30)['key'];box=project(world_points(principal(key)));w=(box[2]-box[0])/1080
            assert .4<=w<=.7 and box[0]>=40 and box[2]<=1040 and box[1]>=110 and box[3]<=1600,('B6 named principal guard',j,key,w,box)
            obs=critical(key);cr=project(world_points(obs)) if obs else None
            critical_y=(110,1600) if key=='lore:garlic' else (210,1120)
            if cr is not None:assert cr[0]>=0 and cr[2]<=1080 and cr[1]>=critical_y[0] and cr[3]<=critical_y[1],('B6 separately named critical prop guard',j,key,cr,critical_y)
            if key=='lore:garlic':assert cr[0]>=40 and cr[2]<=1040,'Same exact B4v4 critical-garlic safe frame, no inflated primary'
            if key in SHIP:
                needle_box=project(world_points(tree(g['PARTS']['compass']['needle'])))
                assert needle_box[1]>=210 and needle_box[3]<=1120 and (cr[0]+cr[2])/2>(box[0]+box[2])/2+30 and (cr[0]>=needle_box[2]+8 or cr[3]<=needle_box[1]-8),('Ship right/needle-critical guard',j,box,cr,needle_box)
            retired_box=project(world_points(tree(garlic['root'])+[v for nail in garlic['nails'] for v in tree(nail)])) if key in PAIR else None
            if key=='rule:pull' and j in {2838,2904,2928,2958}:
                labels=[]
                for root in (g['PARTS']['magnets']['a'],g['PARTS']['magnets']['b']):labels.append({o.data.body:o.matrix_world.translation.copy() for o in tree(root) if o.type=='FONT' and o.data.body in {'N','S'}})
                pairs=sorted(((float((av-bv).length),ap,bp) for ap,av in labels[0].items() for bp,bv in labels[1].items()))
                expected=('N','S') if j==2838 else ('S','N') if j==2958 else ('N','N')
                assert pairs[0][1:]==expected,('Integrated B6 magnetic stage changed',j,pairs)
                magnetic_proof.append({'frame':j,'time':j/30,'expected':list(expected),'nearestPair':list(pairs[0]),'otherPropsNotPartOfProof':True})
            physical.append({'frame':j,'time':j/30,'cue':key,'unchangedOtherObjectSourceFrame':sources[j],'operationTime':j/30,'pose':camera(j/30),'box':box,'widthRatio':w,'criticalBox':cr,'criticalVerticalBounds':list(critical_y),'criticalRoleCriterion':'B4v4 separately moving garlic uses same full caption-safe frame as the original primary; ship and distant experiment helpers keep upper-midframe bounds' if key=='lore:garlic' else 'original upper-midframe separate helper criterion','retiringSecondaryPropsBox':retired_box,'retiringSecondaryNotCountedAsPrincipal':True,'evaluatedGeometry':True,'phaseValues':list(phase_values(j/30)),'loreGarlicWaitingDerivativeSourceFrame':sources[j]if key=='lore:garlic'else None,'principalExcludesSecondaryPropsAndHands':True,'pass':True})
        report.update({'allGuardedStatesPass':True,'physical':physical,'projectionMaxDifferencePixels':projection_error,'newPoses':newposes,'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedObjectSourceFrame':sources,'replacementOutputs':len(replacements),'actualSources':len(sources),'allHeldDependenciesMapped':True,'newActionsEvaluateOutputTime':True,'B3GroundedBoardShiftRetained':[.20,0,0],'B4FitAndB5V4PhasesRetained':True,'priority':'Integrated B6 raw supersedes B4/B5 outputs; no standalone full render required. Other outputs stay exact B3.','ship':{'old':list(ship_pivot),'new':list(ship_site),'yaw':math.pi/2,'scaleUnchanged':True,'sameBookends':True},'Gilbert':{'old':list(g['BASE'][doll][0]),'new':list(doll_site),'scaleMeshUnchanged':True},'garlicWaitingShift':list(wait_shift),'garlicEntryBlend':[68.09,68.49],'garlicReturnBlend':[70.35,71.15],'retire':{'start':retire_start,'end':retire_start+.8,'delta':[0,.30,0],'remainOnRearTabletop':True},'descent':{'start':descent_start,'end':descent_start+.8,'height':.04,'fixedStand':True},'scoreboard':'Shared6.0 permits existing2D upper-right0–1/+1; no added3D row11 board. Individual wording difference must stay in final report.','modelDerivativeExplicit':True,'voiceCaptionsCanonicalSourceUnchanged':True,'actualCompositeReviewPending':True})
        assert len(magnetic_proof)==4,'All four integrated magnetic stage proofs required'
        report['integratedMagneticWorldProof']=magnetic_proof
        report['ship'].update(yaw=0.,originalPositionAndOrientationPreserved=True)
        report['Gilbert'].update(originalPositionAndOrientationPreserved=True,notMoved34cm=True)
        report['B3GroundedBoardShiftRetained']='The exact B3 score raw/anchors stay outside this replacement map; no old hidden0 is reintroduced.'
        report['projectedBoundsAreNotActualOcclusionApproval']=True
        report['lorePlacementIsExplicitModelTransformDerivative']=True
        report['noOtherFixedSiteExceptionAdded']=True
        report['solverMethod']='Screen-horizontal XY plus world Z; bounded25mm damped steps and exact-residual line search. Original projection and all quality thresholds unchanged.'
        report['priorV3SolverFailure']={'completedCameraCandidates':23,'completedKeys':'SHIP','lastCompletedCandidatePassed':True,
            'failedNextKeyGroup':'GARLIC','failedAzimuth':90,'cause':'World-X/Z Jacobian is ill-conditioned when X is view-parallel; no real image-quality guard was waived.'}
        report['priorV4PhysicalCandidateFailure']={'report':'/private/tmp/ys/ys-chain-b1v1-integrated-b6-v4-20261024/audit/report.json',
            'sha256':'6f947cb69788d9ab690236a9d1efa8d08e6f3c8fed1ce9f1f249f35b48769056',
            'all79SolversConverged':True,'shipCandidates':23,'garlicCandidates':56,'zeroImages':True,
            'example':{'azimuth':75,'elevation':36,'target':.48,'center':[540,850],
                'criticalBox':[-1.5330581171149715,23.613630709067763,1111.1610118430792,1112.6506584857018]},
            'reason':'The critical union exceeded the unchanged910px upper-midframe height; recentering alone cannot fit it.',
            'v5Change':'Only GARLIC camera candidates: lower elevations25/30 plus original36, smaller real-bar targets42/44 plus48/50, and centered/left-center positions. All real quality guards, original model sites and source refs are unchanged.'}
        report['retire'].update(delta=[.10,.30,0],firstSidewaysFraction=.35,reason='First clear the real magnets, then slide backward; no overlap through B')
        report['patchFrameToUnchangedOtherObjectSourceFrame']=sources
        report['legacySourceMapFieldMeaning']='patchFrameToUnchangedObjectSourceFrame retains other-object source time; ship/doll/garlic/nail/rock and staged bars are explicitly recorded derivatives evaluated at output time.'
        if mode=='render':
            prfile=OUT/'probe/report.json';assert visually_approved is True and probe_report_sha256 and sha(prfile)==probe_report_sha256;pr=read(prfile)
            assert pr['helperSha256']==sha(__file__) and pr['allGuardedStatesPass'] and len(pr['actualImages'])>=12 and pr['physical']==physical
            assert pr['replacementFrameToActualPatchFrame']=={str(j):k for j,k in replacements.items()};wanted=sorted(sources);report['approvedProbeReportSha256']=probe_report_sha256
        else:wanted=[] if mode=='audit' else sorted({replacements[round(t*30)] for t in PROBES})
        dest.mkdir(parents=True);write(dest/'preflight.json',report)
        if mode=='audit':report.update(status='Numerical only; zero rendered images',allPatchFramesActuallyRendered=False);return report
        arg=copy.copy(g['A']);arg.cache=str(dest);arg.out=str(dest/'blender/patch');arg.times=','.join(str(j/30) for j in wanted);arg.force=False;arg.samples=16;arg.scale=1;arg.every=1;arg.start=0;arg.stop=1e9
        scene.render.resolution_x=1080;scene.render.resolution_y=1920;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='JPEG';scene.render.image_settings.quality=95;scene.eevee.taa_render_samples=16
        scope={**g,'A':arg,'apply':lambda t:state(round(t*30)),'pose_at':camera};types.FunctionType(g['main'].__code__,scope)()
        raw=Path(arg.out)
        for j in wanted:
            f=raw/('%05d.jpg'%j);assert f.is_file() and not f.is_symlink() and f.stat().st_size>1000;report['actualImages'].append({'frame':j,'time':j/30,'path':str(f),'sha256':sha(f),'actuallyViewed':False})
        report.update(raw=str(raw),anchors=str(raw/'anchors.json'),allPatchFramesActuallyRendered=mode=='render',status='Actual integrated probes pending eyes' if mode=='probe' else 'Actual integrated B6 raw; final MP4 QA pending')
        return report
    except BaseException as e:report.update(status='FAIL; preserved original/B3/probes',error={'type':type(e).__name__,'message':str(e)});raise
    finally:
        for key,value in settings.items():setattr(scene.render,key,value)
        scene.render.image_settings.file_format,scene.render.image_settings.quality,scene.eevee.taa_render_samples=old_extra;bpy.context.window.scene=old_scene
        checks={'runtimeBindingsUnchanged':all(g[k] is v for k,v in bindings.items()),'protectedInputsUnchanged':all(sha(p)==h for p,h in protected.items()),'allB3RawInventoryUnchanged':inventory(B3/'blender/desk')==old_inventory,'selectedB3ActualSourceBytesUnchanged':all(sha(p)==h for p,h in source_hashes.items()),'allSceneFilepathsAndExistingFilesUnchanged':all(bpy.data.scenes[n].render.filepath==p for n,p in paths.items()) and all(sha(p)==h for p,h in other_files.items()),'dataUnchanged':json.dumps(g['DATA'],sort_keys=True)==data_before,'visibilityQueueClosed':g['VIS_QUEUE'] is None}
        report.update(protectionChecks=checks,protectedInputSha256=protected,seconds=round(time.time()-started,3))
        if not dest.exists():dest.mkdir(parents=True)
        write(dest/'report.json',report);assert all(checks.values()),checks
