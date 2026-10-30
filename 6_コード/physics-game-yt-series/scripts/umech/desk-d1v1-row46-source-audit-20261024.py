"""Read-only D1 section-7 audit. AST-only timing; never imports bpy/builders.

This inventories implementation and existing preview evidence. It is not a
final actual-MP4 review or an inspector waiver. Root owns all render jobs.
"""
import ast,bisect,hashlib,json,math,random,re,types
from datetime import datetime,timezone
from pathlib import Path

W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
C=Path('/private/tmp/ys/ys-chain-d1v1-render')
P=Path('/private/tmp/ys/ys-chain-d1v1-production-r15')
SPEC=Path('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/D-1/D-1_制作指示書.md')
SOURCE=W/'scripts/blender/desk_d1v1.py'
LIB=W/'scripts/blender/desk_lib_d1.py'
OVERLAY=W/'scripts/umech/desk-d1v1-overlay.mjs'
OUT=W/'docs/video-revision-20260924/deep/D-1_全46行_源と時刻と実画対応_20261024.json'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def excerpt(path,first,last):
    lines=Path(path).read_text().splitlines()
    return {'source':str(path),'line':first,'lastLine':last,'sourceSha256':sha(path),'text':'\n'.join(lines[first-1:last])}

# These are exact functions/assignments extracted without executing imports,
# model builders, rendering or any mutable existing data writer.
shared_tree=ast.parse((W/'scripts/blender/desk_lib.py').read_text())
shared={"re":re}
nodes=[n for n in shared_tree.body if isinstance(n,ast.FunctionDef) and n.name in ['vowel_of','norm'] or isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='VOW' for t in n.targets)]
exec(compile(ast.Module(body=nodes,type_ignores=[]),'readonly-norm-ast','exec'),shared)
data=json.loads((C/'blender/data.json').read_text());pt=json.loads((C/'phrase-times.json').read_text())
scope={'math':math,'bisect':bisect,'DATA':data,'CUES':data['cues'],'STARTS':[c['start'] for c in data['cues']],'CUE':{c['key']:c for c in data['cues']},'PT':pt,'FPS':30,'d':types.SimpleNamespace(norm=shared['norm'],sm=lambda x:max(0,min(1,x))**2*(3-2*max(0,min(1,x))))}
tree=ast.parse(SOURCE.read_text())
functions=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['S','E','T','U','cue_at','stroke','plan_d1']]
assignments=[n for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id in ['D1_POSES','SPANS','EVENTS'] for t in n.targets) or isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name) and n.target.id=='SPANS']
exec(compile(ast.Module(body=functions,type_ignores=[]),str(SOURCE),'exec'),scope)
exec(compile(ast.Module(body=assignments,type_ignores=[]),str(SOURCE),'exec'),scope)
T,S,E=scope['T'],scope['S'],scope['E'];nf=math.ceil(data['duration']*30)
plans=[scope['plan_d1'](j) for j in range(nf)]
assert nf==12163 and sum(p[0]=='render' for p in plans)==5070

# Exact individual section-7 table text, preserving every requirement.
table={}
for line in SPEC.read_text().splitlines():
    if re.match(r'^\| \d+ \|',line):
        cells=[s.strip() for s in line.strip('|').split('|')]
        if len(cells)==5:table[int(cells[0])]=dict(zip(['row','sceneAndProps','camera','handAndAction','labels'],cells))
assert set(table)==set(range(1,47))

# Line references are implementation evidence, not inferred visual acceptance.
# Camera operation is universally pose_at/set_camera plus the pending private
# camera-only patch. Card/face behavior comes from the unmodified canonical cue.
mapping={
1:('mine_state / water',(182,189),(150,180),[28,29],'Water-height v4 derivative verified separately; same mine geometry.'),
2:('mine_state',(185,189),(169,179),[34],'Extra droplets and gallery emission use existing voice-word times.'),
3:('horse_state / score',(230,242),(182,195),[31,32],'Horse circle, winch and bucket move; 2D score exists. Physical-board rise is not implemented in D apply.'),
4:('score',(334,334),(191,195),[35],'Score camera and both explanatory cards exist.'),
5:('horse_state',(230,242),(182,188),[],'Sweat appears only during mine:mio; canonical small face is unchanged.'),
6:('engine_state assembly',(224,229),(69,97),[29],'Component order boiler/cylinder/beam/rod uses .3 s increments; roots descend into position.'),
7:('highlight_d1 / hands',(173,181),(69,97),[36,38],'Boiler/cylinder/piston/beam highlights and four anchor labels use exact word times.'),
8:('engine visible',(326,330),(69,97),[],'Canonical full-frame face; no new model action required.'),
9:('engine / logic camera',(196,214),(57,97),[40,45],'Cutaway cylinder, hypothesis and view card exist; final occlusion is not inferred from source.'),
10:('engine / logic camera',(196,214),(57,97),[40,45],'If/prediction paper cards are present.'),
11:('engine_state spray',(202,209),(88,92),[40,45],'Blue spray lasts .8 s from the existing cold-water word; steam condensation is implemented.'),
12:('engine_state',(202,206),(88,97),[40,45],'Judgement X and supplied small face; no new model action required.'),
13:('engine visible',(326,330),(69,97),[],'Canonical thinking face is unchanged.'),
14:('balloon_state',(255,259),(196,203),[47,50],'Radius .02→.12 in1.5 s; spoon liquid hides only near full inflation.'),
15:('balloon_state',(255,259),(196,203),[51],'Radius shrinks in1 s with non-spherical oscillation, liquid returns; material/shape appearance still actual-review dependent.'),
16:('can_state',(243,254),(99,142),[],'Tongs and blue hand invert the can in1 s; red band is surface material on same shape key.'),
17:('can_state',(243,246),(99,142),[52],'Crush .15 s and fixed canclose camera; final printed-band/viewcard previews were actually viewed.'),
18:('canclose',(115,116),(99,142),[],'Canonical full-frame surprise face; close camera stays fixed.'),
19:('can_state reveal',(248,251),(210,212),[53,54],'Twelve equal arrows grow .5 s at existing word; camera simultaneously reveals them; viewcard y110.'),
20:('straw branch',(337,341),(217,225),[],'Ten bubbles rise/disappear, three pressure arrows and rising orange column; center getter candidate awaiting root diagnostic.'),
21:('layers_state',(264,270),(227,243),[55],'Ten layers appear bottom-up at .1 s increments; opacity and particle counts decrease upward.'),
22:('weights_state / staged camera',(121,129),(244,254),[56,58],'1kg/100kg appear and descend at words; 1cm square then palm is a deliberate three-stage camera.'),
23:('weights visible',(343,343),(244,254),[56,58],'Canonical small face; no new model action required.'),
24:('inside branch / weights_state',(343,350),(244,254),[60,63],'Opposing palm arrows are equal .06m, then upper-only; can has external arrows only.'),
25:('inside branch',(343,350),(244,254),[],'Canonical thinking face; no new model action required.'),
26:('twocans_state',(271,279),(256,261),[64,67],'Left particles remain with .12 contraction; right descend, turn blue, vanish, right crush .17.'),
27:('engine_state trace / hands',(216,221),(84,97),[],'Yellow line growth and pump/piston/beam highlights exist; trace fixed-top center getter candidate awaiting diagnostic.'),
28:('stroke / engine_state',(190,220),(69,97),[],'Steam enters, balanced opposing arrows, mine rod down and piston up share stroke(t).'),
29:('engine_state condensation',(202,209),(88,92),[68],'Blue spray, shrinking steam and bottom condensate use existing cold-water words.'),
30:('engine visible',(326,330),(69,97),[],'Canonical small insight face; no new action required.'),
31:('stroke / outflow',(190,223),(69,97),[69,72],'Atmosphere arrow, piston down, mine rod up and spout water; exact final continuity still pending actual MP4.'),
32:('stroke / repeat plan',(190,195),(69,97),[31,32,73],'Four-second period kept; two-cycle requirement conflicts with fixed4.862667 s cue.'),
33:('stroke versus plan',(190,195),(69,97),[],'Mathematical motion continues, but no continuous SPAN covers row33; actual full-face masking must be checked.'),
34:('twins branch',(352,355),(263,271),[],'2/18 arrows use ratio9 data, introduced at exact growth word.'),
35:('area / hands',(312,319),(273,286),[74,80],'22 true3D palm plates, diameter/radius and staged formula; .06s plate spacing.'),
36:('heavy branch',(356,371),(288,293),[82,85],'Palms glow; weight drops .4 s, desk/model shake .002m; fixed annotation and weight mark exist.'),
37:('heavy branch',(356,371),(288,293),[],'Canonical small surprise face; heavyclose camera maintained.'),
38:('heavy horses',(362,364),(288,293),[87,89],'Four horses reveal/hop .2s apart and stand beside weight; same original voice.'),
39:('hemispheres_state',(280,299),(295,317),[29],'Join .8s and valve gas exists; gas outward visibility lasts until cue end rather than specified .8s.'),
40:('hemispheres_state',(280,299),(295,317),[],'Four horses per side and taut ropes, valve hand, halves separate/roll .6s and horses lurch.'),
41:('map branch',(373,377),(319,329),[31,32],'Thirty stamps .05s apart from UK region; 1−2 score and supplied small Kai face.'),
42:('engine_state cold loop',(202,211),(69,97),[],'Blue spray/cold material exists during alternating even integer seconds; supplied small face.'),
43:('fuel / coal branch',(202,211),(331,336),[90,93],'Red/blue1s loop and100-cell card exist; coal removes creation-index order, not height order.'),
44:('coal branch / anchor',(331,333),(331,336),[94],'Question mark references fixed coal anchor; final clearance pending actual.'),
45:('challenge_setup',(396,403),(338,354),[95,99],'Two mini engines and static63% summit atmosphere; answer arrows are hidden in main film.'),
46:('stroke / last camera',(190,195),(150,180),[],'Final slow single cycle over8.03 s and declining water; exact same-position endpoint camera differs slightly and ends comparison must be actual-tested.'),
}
assert set(mapping)==set(range(1,47))

review_files=[C/f for f in ['d1-r8-whole-visual-review.json','d1-r12-actual-visual-review.json','d1-r14-actual-visual-review.json','d1-r15-actual-visual-review.json','d1-r15-viewfix-final-actual-review.json']]
reviews=[]
for path in review_files:
    if not path.exists():continue
    x=json.loads(path.read_text())
    reviews.append((path,x))
rows=[]
for row in range(1,47):
    cues=[c for c in data['cues'] if c['row']==row];a=min(c['start'] for c in cues);b=max(c['end'] for c in cues)
    function,sr,lr,ol,note=mapping[row]
    evidence=[]
    for path,x in reviews:
        for rr in x.get('rows',[]):
            if a<=rr.get('time',-1)<=b:
                evidence.append({'record':str(path),'recordSha256':sha(path),'revision':x.get('revision'), 'time':rr['time'],'image':rr.get('image'),'imageSha256':rr.get('sha256',rr.get('imageSha256')),'actuallyViewedInThatHistoricalRecord':rr.get('individuallyViewed',False),'notFinalMP4':True,'notAutomaticallyCurrentRevision':x.get('sourceSha256')!=sha(SOURCE)})
    indices=[j for j in range(nf) if a<=j/30<b]
    prod=[]
    for c in cues:
        j=math.ceil((c['end']-.1)*30);f=P/'blender/desk'/f'{j:05}.jpg'
        if f.exists():prod.append({'frame':j,'time':j/30,'path':str(f),'currentlyExists':True,'viewedByThisNewAudit':False})
    rows.append({'row':row,'exactInstruction':table[row],'start':a,'end':b,'cues':[{'key':c['key'],'start':c['start'],'end':c['end'],'camera':c['camera'],'move':c['move'],'wordEvents':c['wordEvents']} for c in cues], 'sourceImplementationFunction':function,'stageEvidence':excerpt(SOURCE,*sr),'geometryEvidence':excerpt(LIB,*lr),'overlayEvidence':[excerpt(OVERLAY,i,i) for i in ol],'schedule':{'outputFrames':len(indices),'renderFrames':sum(plans[j][0]=='render' for j in indices),'duplicateFrames':sum(plans[j][0]=='dup' for j in indices)},'implementationNote':note,'historicalActualPreviewEvidence':evidence,'existingProductionCueEndFilesNotViewedByThisAudit':prod,'sourceReviewed':True,'finalActualMP4Reviewed':False,'finalVisualAcceptance':False})

# Independent source-data numerical checks for the remaining candidates.
repeat=S('eng:repeat');repeat_end=E('eng:repeat');mio=S('eng:mio2');mio_end=E('eng:mio2')
mio_frames=[j for j in range(nf) if mio<=j/30<mio_end]
frozen_runs=[];run=[]
for j in mio_frames:
    ref=j if plans[j][0]=='render' else plans[j][1]
    if run and ref!=run[-1][1]:
        frozen_runs.append(run);run=[]
    run.append((j,ref))
if run:frozen_runs.append(run)
longest=max(frozen_runs,key=len)
rng=random.Random(52);coals=[]
for i in range(40):
    angle=rng.random()*6.28;radius=.05*math.sqrt(rng.random());z=.33+.05*(1-radius/.055)*rng.random();size=rng.uniform(.008,.014)
    coals.append({'index':i,'centerZ':z,'radius':size,'topZApprox':z+size*.7})
order=sorted(coals,key=lambda x:x['topZApprox'],reverse=True)
for c in coals:c['rankByApproxTopZ']=next(i+1 for i,x in enumerate(order) if x['index']==c['index'])
outward=T('size:guericke','ヌキマシタ');outward_end=E('size:guericke')
issues=[
 {'id':'D-time32-fixedvoice-vs-two4sec-cycles','classification':'known instruction/time contradiction, preserved','rows':[32],'cueStart':repeat,'cueEnd':repeat_end,'availableSeconds':repeat_end-repeat,'requiredSecondsAt4secPeriod':8,'mathematicalCycles':(repeat_end-repeat)/4,'resolution':'Keep fixed voice and four-second period; no silent change, no claim of two full cycles.'},
 {'id':'D-straw-fixedbottom-getter','classification':'source risk, root GUI read-only diagnostic pending','rows':[20],'wordStart':T('straw:push','オシアゲテ'),'intendedBottomZ':.02,'source':excerpt(SOURCE,337,341),'actualFinalFailureConfirmed':False,'rootProductionRawObservation':{'frames':[4500,4590,4631],'times':[150,153,154.3666666667],'observedBy':'root','statement':'White straw, rising orange liquid and three downward pressure arrows were personally seen; fixed-bottom center cannot be inferred through opaque cup liquid.'}},
 {'id':'D-trace-fixedtop-getter','classification':'source risk, root GUI read-only diagnostic pending','rows':[27],'wordStart':T('eng:arm','タンコオノソコ'),'intendedTopZ':.54,'source':excerpt(SOURCE,216,221),'actualFinalFailureConfirmed':False},
 {'id':'D-row33-continuous-motion-schedule','classification':'source-confirmed render-coverage omission, visual effect not established','rows':[33],'cueStart':mio,'cueEnd':mio_end,'outputFrames':len(mio_frames),'renderFrames':sum(plans[j][0]=='render' for j in mio_frames),'duplicateFrames':sum(plans[j][0]=='dup' for j in mio_frames),'longestSameSourceSeconds':len(longest)/30,'longestSameSourceOutputRange':[longest[0][0]/30,longest[-1][0]/30],'retainedSourceTime':longest[0][1]/30,'fullFaceMayCoverModel':True,'source':excerpt(SOURCE,444,459),'actualFinalFailureConfirmed':False,'nextCheck':'Inspect actual MP4 face entrance/exit and engine visibility; if visible, preserve full motion via output-time local derivative, not fake motion/noise.'},
 {'id':'D-coal-top-removal-order','classification':'source-confirmed N11 ordering difference; actual visibility/occlusion pending','rows':[43,44],'source':excerpt(SOURCE,331,333),'geometrySource':excerpt(LIB,331,336),'deletedCreationIndicesBeforeTopmost':[0,1,2,3,4,5,6,7,8,9],'topmostApproxIndex':order[0]['index'],'firstTwelveApproxTopRanks':coals[:12],'actualFinalFailureConfirmed':False,'nextCheck':'Use real evaluated coal world tops/actual film to choose true top-down removal only if root approves; do not count hidden/background pieces as principal.'},
 {'id':'D-hemi-outward-gas-duration','classification':'source-confirmed timing difference, not a physics claim','rows':[39],'wordStart':outward,'visibilityEnd':outward_end,'actualSourceVisibleSeconds':outward_end-outward,'instructionSeconds':.8,'source':excerpt(SOURCE,290,294),'actualFinalFailureConfirmed':False,'nextCheck':'Actual preview must show clear air removal. Root decides whether .8 s limitation needs local timing correction.'},
 {'id':'D-physical-score-rise','classification':'individual physical-action difference, common2D allowance needs explicit interpretation','rows':[3],'source':excerpt(SOURCE,326,334),'scoreSource':excerpt(SOURCE,377,377),'overlay':excerpt(OVERLAY,31,33),'physicalBoardRiseCallExistsInDStage':False,'twoDimensionalScorePresent':True,'actualFinalFailureConfirmed':False,'nextCheck':'Do not mark physical rise as implemented. Root may document shared6.0 2D implementation rather than add unnecessary 3D motion.'},
]
report={'episode':'D-1','kind':'All46 section7 source/timing/historical-preview correspondence; not final visual acceptance','recordedAt':datetime.now(timezone.utc).isoformat(),'helper':str(Path(__file__).resolve()),'helperSha256':sha(__file__),'inputs':[{'path':str(p),'sha256':sha(p)} for p in [SPEC,SOURCE,LIB,OVERLAY,C/'blender/data.json',C/'phrase-times.json']],'rows':rows,'all46SourceReviewed':len(rows)==46,'all57CueCoverage':sum(len(r['cues']) for r in rows)==57,'originalPlan':{'outputFrames':nf,'renderFrames':5070,'duplicateFrames':7093,'unchanged':True},'separateExplicitWaterDerivative':'desk_axes_d1_r15_restore_v4_20261024.py; original frozen source remains unchanged','pendingPostProductionCameraPatch':'desk_axes_d1_camera_patch_20261024.py; final visual review must use delivered mapping, not nominal pose','remainingCandidates':issues,'pureSourceAuditOnly':True,'renderCalls':0,'GPUJobsSubmitted':0,'heavyCPUEncodingStarted':False,'modelsOrOriginalSourcesEdited':False,'historicalImagesNotReclassifiedAsCurrentFinal':True,'actualFinalMP4ExistsAndReviewed':False,'actualEarListeningDone':False,'originalInspectorNGPreserved':True,'original7or7bBlanketWaiver':False,'finalAcceptance':False}
assert not OUT.exists(),'Add-only audit: do not replace existing record'
OUT.write_text(json.dumps(report,ensure_ascii=False,indent=1))
print(json.dumps({'out':str(OUT),'sha256':sha(OUT),'rows':len(rows),'cues':sum(len(r['cues']) for r in rows),'sourceCandidates':[{k:x[k] for k in ['id','classification']} for x in issues],'row33':issues[3]},ensure_ascii=False,indent=1))
