"""D1 final local derivative, root GUI only. Draft until audited and pinned.

Keeps frozen source/voice/captions, original raw and the approved private water
fix. One bundle repairs readable hot-can tongs, attached hemisphere valve,
top-down coal consumption, .8s valve gas, equal pressure arrows and the actual
same stopped bookend camera. Getter fixes require the independent diagnosis.
No original runtime function is rebound. Original inspector NG is retained.
"""
import ast,copy,hashlib,json,math,runpy,time,types
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
PROD=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
CAM=Path('/private/tmp/ys/ys-chain-d1v1-camera-patch-v2-20261024')
OUT=Path('/private/tmp/ys/ys-chain-d1v1-final-local-bundle-v3-20261024')
CAM_HELPER=W/'scripts/blender/desk_axes_d1_camera_patch_v2_20261024.py'
CAM_SHA='6ef21b9a7c5207855bb9c3ec52e3a1f36a98cd80210d78f1278507303e05857f'
V4_SHA='7ec8ee0c86872a47de4b505fb469d08e8055fd69528fdcba0c5884677f15fcb6'
DIAG=C/'d1-straw-trace-height-diagnostic-v2-20261024.json'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_text())
def save(p,x):
    with Path(p).open('x')as f:json.dump(x,f,ensure_ascii=False,indent=1)
def stats(folder):return {str(p):(p.stat().st_size,p.stat().st_mtime_ns) for p in sorted(Path(folder).glob('*.jpg'))}
def normmap(m):return {int(j):int(k) for j,k in m.items()}

def schedule(g,camera,height_kinds):
    """No bpy calls. Exact output time phases retain all other object refs."""
    ranges,cam_pose,cam_map,cam_refs,_,plans=camera['derive'](g)
    T,S,E=g['T'],g['S'],g['E'];nf=g['NF']
    def next_start(key):
        c=g['CUE'][key];i=g['CUES'].index(c)
        return g['CUES'][i+1]['start'] if i+1<len(g['CUES']) else g['DATA']['duration']
    limits={
      'tongs':[T('can:heat','サカサ')-.5,T('can:heat','サカサ')+1.6],
      'equalArrows':[T('eng:steam','オシカエス'),E('eng:up')],
      'valveGas':[T('size:guericke','ヌキマシタ'),next_start('size:guericke')],
      'valveFollow':[T('size:pull','クウキオ'),next_start('size:pull')],
      'coalTopOrder':[T('next:waste','アタタメナオス')+1,next_start('next:who')],
      'sameBookendCamera':[S('last:air'),g['DATA']['duration']],
      'sameOpeningCamera':[0,S('mine:rule')],
    }
    if 'straw'in height_kinds:limits['strawFixedBottom']=[S('straw:drink'),next_start('straw:push')]
    if 'trace'in height_kinds:limits['traceFixedTop']=[T('eng:arm','タンコオノソコ'),next_start('eng:arm')]
    first_stopped=list(g['pose_at'](2.0))
    assert first_stopped==list(g['pose_at'](3.0))
    # Same true camera at both bookends. The final engine is taller than the
    # opening ground-only mine, so both move back together, never shrink models.
    first_stopped[3]=1.12
    def original_ref(j):return j if plans[j][0]=='render' else plans[j][1]
    def base_delivery(j):
        if j in cam_map:
            k=cam_map[j];return {'actualFrame':k,'unchangedOtherObjectSourceFrame':cam_refs[k],'cameraOperationTime':k/30,'pose':list(cam_pose(k/30)),'raw':str(CAM/'blender/patch'/('%05d.jpg'%k)),'layer':'camera'}
        ref=original_ref(j)
        return {'actualFrame':ref,'unchangedOtherObjectSourceFrame':ref,'cameraOperationTime':ref/30,'pose':list(g['pose_at'](ref/30)),'raw':str(PROD/'blender/desk'/('%05d.jpg'%j)),'layer':'production'}
    def reasons(t):return [name for name,(a,b)in limits.items() if a<=t<b]
    def phases(t):
        why=reasons(t);v=[]
        if 'valveGas'in why:v.append(['gas',round(t,12) if t<limits['valveGas'][0]+.8 else 'off'])
        if 'coalTopOrder'in why:v.append(['coal',int(max(0,base_delivery(round(t*30))['unchangedOtherObjectSourceFrame']/30-T('next:waste','アタタメナオス')))])
        return v
    def pose(t):
        j=round(t*30)
        if 'sameOpeningCamera'in reasons(t):
            p=list(first_stopped);p[3]+=.08*(1-g['U'](t,0,1.5));return p
        if 'sameBookendCamera'in reasons(t):
            p=list(first_stopped);p[3]*=1+.1*(1-g['U'](t,S('last:air'),1.2));return p
        return base_delivery(j)['pose']
    replacements={};sources={};unique={};outputs_by_reason={k:[]for k in limits}
    for j in range(nf):
        why=reasons(j/30)
        if not why:continue
        old=base_delivery(j);ref=old['unchangedOtherObjectSourceFrame']
        sig=(ref,tuple(round(x,12)for x in pose(j/30)),tuple(why),json.dumps(phases(j/30),sort_keys=True))
        k=unique.setdefault(sig,j);replacements[j]=k;sources[k]=ref
        for name in why:outputs_by_reason[name].append(j)
    frames=sorted(sources)
    return {'limits':limits,'baseDelivery':base_delivery,'pose':pose,'reasons':reasons,'phases':phases,'replacements':replacements,'sources':sources,'frames':frames,'plans':plans,'firstStoppedPose':first_stopped,'outputsByReason':outputs_by_reason}

def prepare(ns,height_diagnostic_sha256):
    """All runtime transforms live in private callables, never g rebindings."""
    assert sha(CAM_HELPER)==CAM_SHA
    camera=runpy.run_path(str(CAM_HELPER));g=ns['main'].__globals__;bpy=g['bpy'];d=g['d']
    camera['verify_canonical'](g)
    marker=ns['D1_WATER_CENTER_V4'];assert marker['helperSha256']==V4_SHA and g['mine_state']is marker['wrapper']
    assert height_diagnostic_sha256 and sha(DIAG)==height_diagnostic_sha256
    diagnosis=read(DIAG);assert diagnosis['renders']==0 and diagnosis['filesOrFunctionsModified']is False
    assert diagnosis['sourceSha256']==sha(g['__file__'])
    visible_rows=[r for r in diagnosis['rows']if not r['hiddenInThisState']]
    unused_hidden_rows=[r for r in diagnosis['rows']if r['hiddenInThisState']]
    assert len(diagnosis['rows'])==12 and len(visible_rows)==11 and len(unused_hidden_rows)==1
    heights={kind for kind in ['straw','trace']if any(r['kind']==kind and not r['centerMatchesWithin1eMinus5']for r in visible_rows)}
    # A hidden, not-yet-active trace may retain its BASE dimensions. Preserve
    # that row as an unused-state observation, never call its error a pass.
    assert all(abs(r['heightError'])<=1e-5 for r in visible_rows),'A visible height-setting failure is not the diagnosed center-only repair'
    plan=schedule(g,camera,heights);P=g['P'];Vector=g['Vector'];created=g['CREATED_NAME']
    from mathutils import Matrix
    tongs=P['can']['tongs'];wood=[o for o in g['CHILDREN'][tongs]if o.type=='MESH'];assert len(wood)==2
    wood.sort(key=lambda o:g['BASE'][o][0].y)
    # Fixed world-Z ordering of the REAL evaluated coal, not random creation order.
    g['apply'](g['S']('next:waste'));bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get()
    coal=[]
    for o in P['coal']['pieces']:
        eo=o.evaluated_get(dg);me=eo.to_mesh()
        try:top=max((o.matrix_world@v.co).z for v in me.vertices)
        finally:eo.to_mesh_clear()
        coal.append((float(top),created[o],o))
    coal.sort(key=lambda x:(-x[0],x[1]));coal_rank={o:i for i,(_,_,o)in enumerate(coal)}
    original_apply=g['apply']
    def set_camera(j):
        t=j/30;p=plan['pose'](t);base=plan['baseDelivery'](j)
        operation=t if any(x in plan['reasons'](t)for x in ['sameOpeningCamera','sameBookendCamera'])else base['cameraOperationTime']
        types.FunctionType(g['set_camera'].__code__,{**g,'pose_at':lambda _t:p})(operation)
    def apply(j):
        t=j/30;ref=plan['sources'].get(j,plan['baseDelivery'](j)['unchangedOtherObjectSourceFrame']);aa=original_apply(ref/30)
        why=plan['reasons'](t)
        if 'tongs'in why:
            cm=P['can']['can']['root'].matrix_world.copy()
            # Existing .11m wooden bars: jaw tips straddle the metal in its
            # localX direction, while the handle stays in front along local-Y.
            # Y-axis inversion therefore never swings the hand through metal.
            tongs.matrix_world=Matrix.Identity(4)
            for sign,o in zip([-1,1],wood):
                tip=cm@Vector((sign*.0325,0,0));handle=cm@Vector((sign*.006,-.105,.012));axis=handle-tip
                o.location=(tip+handle)/2;o.rotation_euler=axis.to_track_quat('X','Z').to_euler();o.scale=g['BASE'][o][2].copy();o.scale.x*=axis.length/.11
                d.show(o,True)
            grip=cm@Vector((0,-.108,.012))
            g['small_hand_d1']('kai',grip,yaw=0,pitch=-15,scale=.45)
        if 'equalArrows'in why:
            root=P['engine']['balance'];ratio=.048/.046;bottom=P['engine']['bottom']+.014
            root.scale.z*=ratio;root.location.z+=bottom*(1-ratio)
        if 'valveGas'in why:
            event=g['T']('size:guericke','ヌキマシタ');active=event<=t<event+.8
            for i,o in enumerate(P['hemi']['gas']):
                v=(t*.8+i/10)%1;o.location=P['hemi']['center']+Vector((0,0,.07+.03*v));d.show(o,active)
        if 'valveFollow'in why:
            q=P['hemi'];release=g['U'](ref/30,g['T']('size:pull','クウキオ'),.6);part=q['parts'][1]
            # Original right part before release has the same joined/apart pose.
            # Original valve already includes apart and its own opening rotation.
            base=part.matrix_world.copy();base.translation.x-=.08*release
            base=Matrix.Translation(base.translation) # rest sphere's BASE rotation is zero
            rigid=part.matrix_world@base.inverted()
            for o in [q['valve'],q['valvepipe']]:o.matrix_world=rigid@o.matrix_world
        if 'coalTopOrder'in why:
            # Only replace the order, never add a new consumption step in a
            # previously held frame or in row44. The delivered ref count stays.
            n=int(max(0,ref/30-g['T']('next:waste','アタタメナオス')))
            for o in P['coal']['pieces']:d.show(o,coal_rank[o]>=n)
        if 'strawFixedBottom'in why:
            h=.01+.10*g['U'](ref/30,g['T']('straw:push','オシアゲテ'),1);P['straw']['juice'].location.z=.02+h/2
        if 'traceFixedTop'in why:
            h=.001+.47*g['U'](ref/30,g['T']('eng:arm','タンコオノソコ'),1);P['engine']['trace'].location.z=.54-h/2
        set_camera(j);bpy.context.view_layer.update();return aa
    return {'g':g,'d':d,'bpy':bpy,'camera':camera,'plan':plan,'apply':apply,'heightKinds':sorted(heights),'coalOrder':[{'object':n,'evaluatedTopZ':z,'rank':i}for i,(z,n,o)in enumerate(coal)],'diagnosis':diagnosis,'diagnosisVisibleRows':visible_rows,'diagnosisUnusedHiddenRows':unused_hidden_rows,'diagnosisSha256':height_diagnostic_sha256}

def straw_semantic_geometry(g,tools,projection,dg):
    """Body stays primary; air deliberately leaving the mouth stays recorded.

    Root explicitly adopted this exact distinction after the original raw and
    v2 diagnostics. No test or safety limit is changed, and no particle is hidden.
    """
    bubbles=set(g['P']['straw']['bubbles']);body=[o for o in g['G']['straw']if o not in bubbles]
    visible=[o for o in bubbles if not o.hide_render]
    mouth_path=[o for o in visible if o.location.z<=.145]
    escaped=[o for o in visible if o.location.z>.145]
    path=tools['project'](mouth_path,projection,dg);outside=tools['project'](escaped,projection,dg)
    path_safe=not mouth_path or path is not None and tools['checks'](path)['frameSafe']
    details={'primaryDefinition':'physical cup + bent straw + juice + pressure arrows; air-exit effect not added to its width','mouthWorldZ':.145,'visibleAirParticleCount':len(visible),'mandatoryPathParticleCount':len(mouth_path),'mandatoryPathBox':path,'mandatoryPathFrameSafe40to1040x110to1600':path_safe,'escapedAboveMouthParticleCount':len(escaped),'escapedEffectBoxIncludingOriginalClip':outside,'escapedEffectClipPreserved':outside is not None and not outside['allVerticesInFrame'],'airParticleGeometryPositionsVisibilityUnchanged':True,'notOriginalInspectorThresholdChange':True}
    return body,details,path_safe

def run(ns,authorized=False,mode='audit',height_diagnostic_sha256=None,probe_report_sha256=None,visually_approved=False):
    assert authorized is True and mode in ['audit','probe','render'],'Root owns all GUI jobs'
    assert not OUT.is_symlink();dest=OUT/mode;assert not dest.exists(),'Preserve every prior diagnostic/probe/render'
    complete=read(CAM/'camera-patch-complete.json');production=read(PROD/'d1-production-finished.json')
    assert complete['allPatchFramesActuallyRendered']and complete['allReplacementFramesPhysicalPass']and production['all12163JpegsPresent']
    g=ns['main'].__globals__;bpy=g['bpy'];d=g['d'];previous=bpy.context.window.scene
    scene_paths={s.name:s.render.filepath for s in bpy.data.scenes};settings={k:getattr(d.SC.render,k)for k in ['filepath','resolution_x','resolution_y','resolution_percentage']};settings['format']=d.SC.render.image_settings.file_format;settings['samples']=d.SC.eevee.taa_render_samples
    bindings={k:g[k]for k in ['apply','apply_state_d1','mine_state','engine_state','reset','main','pose_at','set_camera','plan_d1','SPANS','EVENTS']}
    before={str(folder):stats(folder)for folder in [PROD/'blender/desk',Path(complete['raw'])]};other=runpy.run_path(str(CAM_HELPER))['other_raw_samples']()
    frozen={str(W/p):h for p,h in runpy.run_path(str(CAM_HELPER))['FROZEN'].items()};frozen[str(DIAG)]=height_diagnostic_sha256;frozen[str(W/'scripts/blender/desk_axes_d1_r15_restore_v4_20261024.py')]=V4_SHA;frozen[str(CAM/'camera-patch-complete.json')]=sha(CAM/'camera-patch-complete.json');frozen[str(PROD/'d1-production-finished.json')]=sha(PROD/'d1-production-finished.json')
    assert all(sha(p)==h for p,h in frozen.items());started=time.time();failure=None;report={'episode':'D-1','mode':mode,'helperSha256':sha(__file__),'frozen':frozen,'originalInspectorNGPreserved':True,'finalAcceptance':False,'renders':0}
    try:
        bpy.context.window.scene=d.SC;assert d.SC.render.engine=='BLENDER_EEVEE';s=prepare(ns,height_diagnostic_sha256);plan=s['plan'];frames=plan['frames'];replacements=plan['replacements'];sources=plan['sources'];tools=s['camera']['geometry_tools'](ns);physical=[]
        assert normmap(complete['replacementFrameToActualPatchFrame'])==s['camera']['derive'](g)[2]
        for j in frames:
            s['apply'](j);dg=bpy.context.evaluated_depsgraph_get();proj=d.CAM.calc_matrix_camera(dg,x=1080,y=1920,scale_x=1,scale_y=1)@d.CAM.matrix_world.inverted();c=g['cue_at'](sources[j]/30)
            role,objects,critical=tools['principal'](c,sources[j]/30);straw_details=None;path_safe=True
            if c['group']=='straw':
                objects,straw_details,path_safe=straw_semantic_geometry(g,tools,proj,dg);role='physical cup, bent straw, juice and active pressure arrows; mouth-path air separately checked'
            box=tools['project'](objects,proj,dg);cb=tools['project'](critical,proj,dg);bc=tools['checks'](box);cc=tools['checks'](cb,True)if cb else None
            passed=all(bc.values())and(cc is None or cc['frameSafe'])and path_safe;cross=s['camera']['projection_crosscheck'](g,objects,proj,dg);details={};why=plan['reasons'](j/30);Vector=g['Vector']
            if straw_details is not None:details['strawBodyAndAirExit']=straw_details
            if 'tongs'in why:
                tool=g['P']['can']['tongs'];wood=g['CHILDREN'][tool];wb=tools['project'](wood,proj,dg)
                details['woodenTongsVisibleBox']=wb;wood_safe=wb is not None and wb['allVerticesInFrame']and wb['x0']>=40 and wb['x1']<=1040 and wb['y0']>=110 and wb['y1']<=1600
                skin=[o for o in g['CHILDREN'][d.HANDS['kai']]if any(n in o.name for n in ['_palm','_fing','_mitt','_thumb'])]
                sb=tools['project'](skin,proj,dg);skin_safe=sb is not None and sb['allVerticesInFrame']and sb['x0']>=0 and sb['x1']<=1080 and sb['y0']>=110 and sb['y1']<=1600
                inv=g['P']['can']['can']['root'].matrix_world.inverted();skin_y=[]
                for o in skin:
                    eo=o.evaluated_get(dg);me=eo.to_mesh()
                    try:skin_y.extend((inv@o.matrix_world@v.co).y for v in me.vertices)
                    finally:eo.to_mesh_clear()
                assert skin_y;clear=max(skin_y)<=-.06
                details.update({'grippingMittenSkinBox':sb,'grippingMittenSkinFrameSafe':skin_safe,'maximumMittenSkinYInCanCoordinates':max(skin_y),'metalCanMinimumY':-.03,'mittenMetalClearanceAtLeastMeters':-.03-max(skin_y),'woodenTongsFrameSafe':wood_safe,'mittenDoesNotTouchMetal':clear});passed=passed and wood_safe and skin_safe and clear
            if 'equalArrows'in why:
                q=g['P']['engine'];up=q['push'].matrix_world;down=q['balance'].matrix_world
                outer=up@Vector((q['cylx'],q['cy']-.01,q['top']+.073))-up@Vector((q['cylx'],q['cy']-.01,q['top']+.025))
                inner=down@Vector((q['cylx'],q['cy']-.025,q['bottom']+.060))-down@Vector((q['cylx'],q['cy']-.025,q['bottom']+.014))
                equal=abs(outer.length-inner.length)<=1e-6;details.update({'externalPressureArrowMeters':outer.length,'internalPressureArrowMeters':inner.length,'sameForceSameActualArrowLength':equal});passed=passed and equal
            if 'valveFollow'in why:
                q=g['P']['hemi'];part=q['parts'][1].matrix_world;ve=(q['valve'].matrix_world.translation-part@Vector((0,0,.063))).length;pe=(q['valvepipe'].matrix_world.translation-part@Vector((0,0,.052))).length
                attached=max(ve,pe)<=1e-6;details.update({'valveCenterAttachmentErrorMeters':ve,'pipeCenterAttachmentErrorMeters':pe,'attachedToReleasedRightHemisphere':attached});passed=passed and attached
            for kind,reason in [('straw','strawFixedBottom'),('trace','traceFixedTop')]:
                if reason in why:
                    ref=sources[j]/30
                    if kind=='straw':o=g['P']['straw']['juice'];height=.01+.10*g['U'](ref,g['T']('straw:push','オシアゲテ'),1);center=.02+height/2
                    else:o=g['P']['engine']['trace'];height=.001+.47*g['U'](ref,g['T']('eng:arm','タンコオノソコ'),1);center=.54-height/2
                    error=max(abs(float(o.dimensions.z)-height),abs(float(o.location.z)-center));details[kind+'FixedEndMaximumErrorMeters']=error;passed=passed and error<=1e-5
            camera_time=j/30 if any(x in why for x in ['sameOpeningCamera','sameBookendCamera'])else plan['baseDelivery'](j)['cameraOperationTime']
            physical.append({'frame':j,'time':j/30,'unchangedOtherObjectSourceFrame':sources[j],'operationTime':j/30,'semanticOperationTime':j/30,'cameraOperationTime':camera_time,'pose':plan['pose'](j/30),'reasons':why,'phaseValues':plan['phases'](j/30),'semanticPrincipal':role,'actualSurface':box,'criticalSurface':cb,'physicalChecks':bc,'criticalChecks':cc,'originalProjectCrosscheck':cross,'localSemanticChecks':details,'pass':passed})
        report.update({'limits':plan['limits'],'outputsByReason':{k:len(v)for k,v in plan['outputsByReason'].items()},'actualFrames':frames,'actualFrameCount':len(frames),'replacementOutputCount':len(replacements),'replacementFrameToActualPatchFrame':replacements,'patchFrameToUnchangedOtherObjectSourceFrame':sources,'firstStoppedBookendPose':plan['firstStoppedPose'],'lastStoppedBookendPose':plan['pose'](404.5),'heightCenterFixes':s['heightKinds'],'coalEvaluatedTopOrder':s['coalOrder'],'physical':physical,'allReplacementPhysicalPass':all(r['pass']for r in physical),'physicalFailures':[r for r in physical if not r['pass']],'originalCameraCompleteReportSha256':sha(CAM/'camera-patch-complete.json'),'sameStoppedBookendPose':plan['pose'](404.5)==plan['firstStoppedPose'],'stageLibOverlayVoiceCaptionAndOriginalRawModified':False,'runtimeFunctionsRebound':False,'allActualImagesViewed':False})
        report['heightDiagnosisVisibleRows']=s['diagnosisVisibleRows'];report['heightDiagnosisUnusedHiddenRows']=s['diagnosisUnusedHiddenRows'];report['hiddenDiagnosisRowsNotReclassifiedAsNumericPass']=True
        assert report['sameStoppedBookendPose']and report['allReplacementPhysicalPass'],'Real local geometry/camera constraints failed; zero rendering'
        dest.mkdir(parents=True);save(dest/'preflight.json',report)
        if mode=='audit':report['status']='Numerical only; zero JPEG rendered';return report
        wanted=frames
        if mode=='probe':
            times=[0,2,20,120.6,121.5,122.3,240.5,334.65,334.85,339.5,339.8,341.6,365.2,367.2,379.5,398.2,403.3]
            if 'straw'in s['heightKinds']:times +=[150.16666666666666,152,153.5]
            if 'trace'in s['heightKinds']:times +=[220.3,220.9,221.5]
            wanted=sorted(set(replacements[round(t*30)]for t in times if round(t*30)in replacements))
        else:
            prfile=OUT/'probe/report.json';assert visually_approved is True and probe_report_sha256 and sha(prfile)==probe_report_sha256
            pr=read(prfile);assert pr['helperSha256']==sha(__file__)and pr['physical']==physical and pr['allReplacementPhysicalPass']
            assert normmap(pr['replacementFrameToActualPatchFrame'])==replacements
            for x in pr['actualImages']:assert sha(x['path'])==x['sha256']
            report['approvedProbeReportSha256']=probe_report_sha256
        raw=dest/'blender/patch';a=copy.copy(g['A']);a.cache=str(dest);a.out=str(raw);a.times=','.join(str(j/30)for j in wanted);a.force=False;a.start=0;a.stop=1e9;a.every=1;a.scale=1;a.samples=16;a.anchors_only=False
        # The frozen stage main and original canonical shared main remain used.
        # Only this clone's apply/camera/options change; no live g rebind occurs.
        private={**g,'A':a,'apply':lambda t:s['apply'](round(t*30)),'pose_at':plan['pose'],'set_camera':lambda t:None}
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 LOCAL BUNDLE',mode,len(wanted),'canonical actual JPEGs',flush=True)
        types.FunctionType(g['main'].__code__,private)()
        images=[]
        for j in wanted:
            f=raw/('%05d.jpg'%j);assert f.is_file()and not f.is_symlink()and f.stat().st_size>1000;images.append({'frame':j,'time':j/30,'path':str(f),'sha256':sha(f),'actuallyViewed':False})
        report.update({'raw':str(raw),'anchors':str(raw/'anchors.json'),'actualImages':images,'renders':len(wanted),'allRequestedActuallyRendered':True,'allPatchFramesActuallyRendered':mode=='render','status':'Actual local JPEGs ready; final composite/encoded review pending'})
        return report
    except BaseException as exc:failure={'type':type(exc).__name__,'message':str(exc)};report.update(status='FAIL; original raw and source preserved',error=failure);raise
    finally:
        report['seconds']=time.time()-started;checks={'runtimeBindingsUnchanged':all(g[k]is v for k,v in bindings.items()),'originalProductionAndCameraRawStatsUnchanged':all(stats(folder)==old for folder,old in before.items()),'originalSourceAndDependencyShaUnchanged':all(sha(p)==h for p,h in frozen.items()),'otherScenePathsUnchanged':all(bpy.data.scenes[n].render.filepath==p for n,p in scene_paths.items()if bpy.data.scenes[n]is not d.SC),'otherEpisodeSampledRawShaUnchanged':all(sha(p)==h for p,h in other.items())};report['protection']=checks
        for k,v in settings.items():
            if k not in ['format','samples']:setattr(d.SC.render,k,v)
        d.SC.render.image_settings.file_format=settings['format'];d.SC.eevee.taa_render_samples=settings['samples'];bpy.context.window.scene=previous
        dest.mkdir(parents=True,exist_ok=True);save(dest/'report.json',report)
        assert all(checks.values()),checks
        print(time.strftime('%Y-%m-%d %H:%M:%S'),'D1 LOCAL BUNDLE',mode,report.get('status'),flush=True)
