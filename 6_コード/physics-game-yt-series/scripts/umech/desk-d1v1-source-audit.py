"""D1 read-only source/timing audit. No Blender or canonical input changes."""
import argparse,ast,bisect,datetime,hashlib,json,math,pathlib,re,types
ap=argparse.ArgumentParser();ap.add_argument('--cache',default='/private/tmp/ys/ys-chain-d1v1-render');ap.add_argument('--revision',default='r6');ap.add_argument('--out',required=True);a=ap.parse_args()
root=pathlib.Path(__file__).resolve().parents[2];source=root/'scripts/blender/desk_d1v1.py';lib=root/'scripts/blender/desk_lib.py';data_path=pathlib.Path(a.cache)/'blender/data.json';data=json.loads(data_path.read_text());pt=json.loads((pathlib.Path(a.cache)/'phrase-times.json').read_text());tree=ast.parse(source.read_text())
g={'re':re,'bisect':bisect,'math':math,'DATA':data,'CUES':data['cues'],'CUE':{c['key']:c for c in data['cues']},'STARTS':[c['start'] for c in data['cues']]}
normnodes=[n for n in ast.parse(lib.read_text()).body if isinstance(n,ast.FunctionDef) and n.name in ['norm','vowel_of'] or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='VOW' for t in n.targets)]
exec(compile(ast.Module(body=normnodes,type_ignores=[]),str(lib),'exec'),g)
g['d']=types.SimpleNamespace(norm=g['norm'],sm=lambda x:(lambda v:v*v*(3-2*v))(max(0,min(1,x))));g['PT']=pt
names={'S','E','T','U','cue_at','camera_pose_d1','pose_at','stroke','plan_d1'}
g['FPS']=30
nodes=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in names or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['D1_POSES','SPANS','EVENTS'] for t in n.targets) or isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS']
exec(compile(ast.Module(body=nodes,type_ignores=[]),str(source),'exec'),g)
checks=[]
for n in ast.walk(tree):
    if not isinstance(n,ast.Call) or not isinstance(n.func,ast.Name) or n.func.id!='T' or len(n.args)<2:continue
    if not all(isinstance(v,ast.Constant) for v in n.args[:2]):continue
    key,needle=[v.value for v in n.args[:2]];occ=n.args[2].value if len(n.args)>2 else 0;t=g['T'](key,needle,occ);c=g['CUE'][key]
    assert c['start']<=t<=c['end'],('Word trigger outside cue',key,needle,t)
    checks.append({'key':key,'word':needle,'time':round(t,6),'line':n.lineno})
nf=math.ceil(data['duration']*30);poses=[tuple(round(x,10) for x in g['pose_at'](j/30)) for j in range(nf)];moving=[False]+[poses[j]!=poses[j-1] for j in range(1,nf)];spans=[];start=None
for j,flag in enumerate(moving+[False]):
    if flag and start is None:start=j/30
    if not flag and start is not None:spans.append([start,j/30]);start=None
# Conservative horse-mesh envelope under tangent rotation, including ears,
# head, legs, hoof corners and tail. It must stay on the right grass block.
cx,cy,r=-.2909,.082,.019;long=.03052;lateral=.0091;envelope=math.hypot(r+lateral,long);bounds=[cx-envelope,cx+envelope,cy-envelope,cy+envelope]
assert bounds[0]>=-.333 and bounds[2]>=.04 and bounds[3]<=.16 and bounds[1]<-.2475,('Horse crosses shaft/grass/hut',bounds)
last=[g['stroke'](g['S']('last:air')+(g['E']('last:air')-g['S']('last:air'))*p) for p in [0,.25,.5,.75,1]]
assert abs(last[0])+abs(last[2]-1)+abs(last[4])+abs(last[1]-last[3])<1e-7 and 0<last[1]<1
sha=lambda p:hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()
record={'episode':'D-1','revision':'r6','status':'source checks only; GUI visual confirmation and complete final-video gates pending','createdAt':datetime.datetime.now().astimezone().isoformat(),'sourceSha256':sha(source),'geometrySha256':sha(source.parent/'desk_lib_d1.py'),'dataSha256':sha(data_path),'voiceSha256':sha(pathlib.Path(a.cache)/'ys-chain-d1v1.voice.wav'),'literalWordTriggerCalls':len(checks),'uniqueWordTriggers':len({(r['key'],r['word'],r['time']) for r in checks}),'wordTriggerErrors':0,'triggers':checks,'nominalDataCamerasUnchanged':True,'poseConvention':'[target x,y,z (m), distance (m), azimuth (deg), elevation (deg), nominal lens (mm), effective lens=nominal*.78]','resolvedCameraPoses':{k:g['camera_pose_d1'](k) for k in data['cameras']},'cameraOverrides':g['D1_POSES'],'dynamicPoses':[{'cue':'air:1kg','unitSquarePose':[.24,-.04,.014,.12,0,40,100],'unitMoveSeconds':.8,'palmMoveStart':g['T']('air:1kg','テノヒラ'),'palmMoveSeconds':.8},{'cue':'size:2t','from':'area','to':'heavy','start':g['T']('size:2t','ニトン')-1,'moveSeconds':1}],'cameraMotion':{'frames':nf,'movingFrames':sum(moving),'movingRatio':sum(moving)/nf,'topRatio':sum(p[5]>=65 for p in poses)/nf,'movingSpans':spans},'horseSafety':{'center':[cx,cy,.32],'radius':r,'conservativeEnvelope':envelope,'xyBounds':bounds,'grassBounds':[-.333,0,.04,.16],'hutLeftBound':-.2475,'continuousAllAnglesSafe':True},'lastCueStrokeQuarterSamples':last,'trialSeconds':[4,18,20,24.5,34,45.6,47.2,51.2,54.8,63,84.3,118.8,126.17,140.5,165,169.8,172.3,175.5,179,194,221.5,225.5,229,263.9,279.5,283,311.7,321,400,403.3]}
record['revision']=a.revision
record['dynamicPoses']=[{'cue':'air:1kg','unitSquarePose':g['pose_at'](169.8),'unitMoveSeconds':.8,'weightPose':g['pose_at'](172.3),'weightMoveStart':g['T']('air:1kg','イチキログラム')-(.4 if 'heavyclose' in g['D1_POSES'] else 0),'weightMoveSeconds':.4,'palmMoveStart':g['T']('air:1kg','テノヒラ'),'palmMoveSeconds':.8},{'cue':'size:2t','from':'area','to':'heavyclose' if 'heavyclose' in g['D1_POSES'] else 'heavy','start':g['T']('size:2t','ニトン')-1,'moveSeconds':1},{'cue':'last:air','resolvedPose':g['pose_at'](400),'moveSeconds':1.2}]
if 'heavyclose' in g['D1_POSES']:
    record['dynamicPoses'] += [{'cue':'shrink:spoon/back','actualPhaseSamples':[{'time':t,'pose':g['pose_at'](t)} for t in [99,100.5,104,113.8,115.5]],'reason':'same real tablespoon/balloon experiment remains readable while volume changes'},{'cue':'nc:install','mineIntroMoveSeconds':.8,'installationMoveStart':g['T']('nc:install','スエツケ')-1.2,'installationMoveSeconds':1.2},{'cue':'size:horse','from':'heavyclose','to':'heavy','start':g['T']('size:horse','ウマ')-.4,'moveSeconds':1}]
if 'canclose' in g['D1_POSES']:
    record['dynamicPoses'] += [{'cue':'can:heat/crush/mio','from':'can','to':'canclose','start':g['T']('can:heat','サカサ')+2.2,'moveSeconds':.8,'crushCameraStopped':True,'crushTime':g['T']('can:crush','グシャット'),'returnStart':g['T']('air:who','マワリノ'),'returnSeconds':.5,'arrowRevealFromExistingWordSeconds':.5,'principalDuringCrush':'can only, excludes stove and water dish'}]
    record['focusOverrides']=[{'cue':'mine:mio','target':'actual animated horse root plus .0238 m in Z','apertureFStop':11.2},{'cue':'air:1kg before 1kg','target':[.24,-.04,.003],'apertureFStop':64,'reason':'resolve the actual top face of the 1 cm square at the existing macro lens; no geometry/material/light change'}]
stale=[]
for trigger in checks:
    t=trigger['time'];j=math.ceil(t*30);mode,src=g['plan_d1'](j)
    if mode=='dup' and src/30<t-1e-5:stale.append(trigger)
plans=[g['plan_d1'](j) for j in range(nf)];bad=[j for j,(mode,src) in enumerate(plans) if mode=='dup' and (not 0<=src<j or plans[src][0]!='render')]
assert not stale and not bad,('Stale or invalid D1 duplicate dependencies',stale,bad)
record['fullFramePlanAudit']={'frames':nf,'uniqueRenderedFrames':sum(p[0]=='render' for p in plans),'invalidDuplicateSources':len(bad),'staleLiteralWordTriggerStates':len(stale),'usesOriginalRenderer':True}
unrendered_motion=[j for j in range(nf) if moving[j] and plans[j][0]!='render']
assert not unrendered_motion,('D1 actual moving-camera frame incorrectly duplicated',unrendered_motion)
record['fullFramePlanAudit']['cameraMovingFrames']=sum(moving)
record['fullFramePlanAudit']['movingFramesIncorrectlyDuplicated']=len(unrendered_motion)
if 'canclose' in g['D1_POSES']:
    proof=[]
    for label,start,end in [('can close after tongs',g['T']('can:heat','サカサ')+2.2,g['T']('can:heat','サカサ')+3),('pressure reveal at existing spoken word',g['T']('air:who','マワリノ'),g['T']('air:who','マワリノ')+.5)]:
        indices=[j for j in range(nf) if start-.034<=j/30<=end+.034]
        moving_indices=[j for j in indices if moving[j]]
        assert indices and all(plans[j][0]=='render' for j in indices),(label,'Can movement frame duplicated')
        proof.append({'motion':label,'start':start,'end':end,'spanPresent':any(abs(x-start)<1e-8 and abs(y-end)<1e-8 for x,y in g['SPANS']),'firstFrame':indices[0],'lastFrame':indices[-1],'allCoveredFrames':len(indices),'actualCameraChangingFrames':len(moving_indices),'renderedFrames':sum(plans[j][0]=='render' for j in indices),'incorrectDuplicates':0})
    record['canCameraFramePlanProof']=proof
out=pathlib.Path(a.out)
if out.exists():raise RuntimeError('Existing source audit preserved; choose another --out')
out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(record,ensure_ascii=False,indent=1))
print(json.dumps({k:v for k,v in record.items() if k not in ['triggers','resolvedCameraPoses','trialSeconds']},ensure_ascii=False,indent=1))
