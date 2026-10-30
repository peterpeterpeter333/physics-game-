// E-1 agent's independent, read-only D-1 source/selected-image review receipt.
// This does not import episode modules, apply Blender state, or run a checker.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const output=W+'docs/video-revision-20260924/deep/E-1_peer_D-1_全46行独立確認_20261024.json';
if(fs.existsSync(output))throw Error('Preserve the existing review receipt; create a new version.');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const file=p=>({path:p,sha256:hash(p)});
const dataPath='/private/tmp/ys/ys-chain-d1v1-render/blender/data.json';
const data=JSON.parse(fs.readFileSync(dataPath));
const source=W+'scripts/blender/desk_d1v1.py',lib=W+'scripts/blender/desk_lib_d1.py';
const sourceText=fs.readFileSync(source,'utf8'),libText=fs.readFileSync(lib,'utf8');
for(const text of ["q['tongs'].location.x=.12*inv","crush=U(t,T('can:crush','グシャット'),.15)","o.location.z+=.04*(1-U(t,at,.3))"])
 if(!sourceText.includes(text))throw Error('Reviewed source changed: '+text);
for(const text of ["top+.073","top+.025","bottom+.014","bottom+.060"])
 if(!libText.includes(text))throw Error('Reviewed arrow geometry changed: '+text);
const evidence=[
 ['historical-r14',121.48366666666664,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r14/d1v1-04.png','The mitten visually overlaps the hot can; wooden tongs are not independently legible. Older raised red band is not the final printed band.'],
 ['historical-r14',122.58366666666663,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r14/d1v1-05.png','Inverted can is in the dish. This is an old composite, not a final MP4 frame.'],
 ['current-D071-production-raw',121.5,'/private/tmp/ys/ys-chain-d1v1-production-r15/blender/desk/03645.jpg','Directly viewed actual production raw: the mitten overlaps the silver/red can, and wooden tongs cannot be distinguished. No captions in this raw; it is not the final delivered MP4.'],
 ['historical-r12',234.223333,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r12/d1v1-37.png','Both opposing cylinder arrows and cutaway are visible. Perspective strongly changes apparent size; the 2 mm source difference is not claimed to explain all apparent inequality.'],
 ['historical-r12',115.5,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r12/d1v1-21.png','Reduced balloon remains smooth/rounded; spoon water is visible. Not current final acceptance.'],
 ['historical-r15-viewfix-final',126.08399999999997,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r15-viewfix-final/d1v1-02.png','Actual crush has a following printed red band and clear side creases. A still cannot establish or disprove a final rebound.'],
 ['historical-r12',339.7,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r12/d1v1-48.png','Eight horses, splitting hemispheres and valve hand are visible; not current final delivery.'],
 ['historical-r12',341.6,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r12/d1v1-49.png','After the halves separate, the valve/pipe remains suspended between them. This is direct old-image evidence plus unchanged-source analysis, not a newly viewed D071 frame.'],
 ['historical-r12',263.9,'/private/tmp/ys/ys-chain-d1v1-render/gate-c-d1v1-r12/d1v1-40.png','Mine rod, piston, outlet and blue water at the upper spout are visible. No claim of reviewing the whole water path in motion.'],
].map(([revision,time,path,observation])=>({...file(path),revision,time,actuallyViewedByE1:true,observation}));
const rowNotes=[
 'Mine cutaway, water rise, seep particles and title/year are implemented; v4 water-height derivative is separate existing evidence, not rerun here.',
 'Additional seep particles begin at the supplied seep-water word; gallery emission is tied to the gallery word.',
 'Horse body circles, winch rotates and bucket moves. Physical-board rise is a separately recorded difference; canonical 2D score exists.',
 'Score camera and both literal rule cards are implemented.',
 'Horse sweat and canonical small troubled face are implemented.',
 'Four assembly stages are ordered at .3 s intervals. Slight hop is absent from the monotonic vertical settling expression.',
 'Four part highlights and anchored boiler/cylinder/piston/beam labels are tied to existing word times.',
 'Supplied full-frame confident face remains unchanged; no new actual face review claimed.',
 'Cylinder is an open-front cutaway rather than a separate glass-window mesh; required hypothesis/view card exists.',
 'If/prediction cards use the supplied literal Japanese.',
 'Blue inlet spray lasts .8 s and steam shrinks; timing is the existing cold-water phrase.',
 'Judgement X and canonical small face exist.',
 'Canonical thinking face exists; not newly inspected as actual final.',
 'Spoon water, rising steam, radius .02 to .12 in1.5 s and numerical card exist.',
 'Radius falls in1 s and spoon water returns; deformation is only axis scale/4 percent Z oscillation, not wrinkles.',
 'Can rotates pi in1 s, moves into dish and has wood-tong objects. Actual selected production raw does not make the tongs legible and appears to show direct mitten contact.',
 'Four-sided crease shape key crushes in .15 s and fixed camera is used; its influence is monotonic, with no specified small rebound.',
 'Supplied full-frame surprise face remains unchanged.',
 'Twelve same-length outer can arrows reveal at the outside-air word; empty and pressure cards exist.',
 'Ten bubbles, rising juice and three downward cup arrows exist. Fixed-bottom dimensions-getter risk is already known and pending root GUI diagnostic.',
 'Ten layers stack at .1 s intervals; top opacity and 40-to4 particle counts encode thinner air.',
 'One and100 kg masses descend at their supplied words, beside the square/palm teaching plates.',
 'Canonical small face exists; no new actual final review.',
 'Palm inward/outward arrows are both .06 m, and inner arrow disappears at the existing absence word; crushed can has exterior arrows.',
 'Canonical thinking face exists.',
 'Left particles remain with modest contraction; right particles descend/change blue/vanish and can dents. Rain is modeled above both.',
 'Long-rod trace and highlights are implemented; fixed-top dimensions-getter risk is already known, not a new proposal.',
 'Steam entry and one coupled stroke drive piston/beam/mine rod. Opposing force arrows are .048/.046 m, not exactly equal as instructed.',
 'Blue spray, steam disappearance and bottom condensate are implemented.',
 'Canonical small insight face exists.',
 'Piston down/mine rod up and outlet water occur at supplied words. Selected old actual shows blue water at upper spout; whole path motion was not independently viewed.',
 'Known fixed-voice conflict:4.862667 s cue cannot contain two4 s periods. Not proposed again as a new fix.',
 'Mathematical stroke continues; missing continuous render span/full-face masking is an already recorded candidate, not newly established final failure.',
 'Two/eighteen arrows and radius/area ratio1:9 are data-asserted.',
 'Diameter/radius/formula cards and22 actual3D palm plates at .06 s intervals exist; original source data checks nonoverlap.',
 'Palms glow, marked2t mass drops, desk shakes .002 m, and approximation/real-vacuum note exists.',
 'Canonical small surprise face exists.',
 'Four horse figures appear/hop at .2 s spacing beside the2t comparison; weight-only note exists.',
 'Valve/gas and1650s card exist. Outward gas duration1.767 s vs .8 s is already recorded separately by D.',
 'Eight horses, taut ropes, opening valve hand, part separation/roll and stumble exist. Valve/pipe follows join apart but not release displacement, leaving it floating in an old actual image.',
 'Thirty real small-machine stamps appear at .05 s spacing from the UK area; canonical score1-2 and small Kai face exist.',
 'Blue water and shell cold color are active on even integer seconds; hot/cold alternation already begins in this cue rather than only at row43 heating-again word.',
 'Cylinder alternates at absolute integer seconds; coal removal occurs at integer offsets from364.064 s, hence changes are offset by .064 s. Coal top-down ordering is already D-recorded.100-cell card is correct.',
 'Question mark and reduced coal mountain are implemented.',
 'Static base/summit air layers and two miniature machines exist; answer arrows hidden in film; separate problem ratio about .63.',
 'Slow single cycle and lower water are implemented. Exact camera-array/bookend discrepancy is already D-recorded and requires delivered actual comparison.',
];
if(rowNotes.length!==46)throw Error('46-row receipt incomplete');
const findings=[
 {id:'D16-hot-can-tongs-not-legible',rows:[16],priority:'safety/explicit primary hand prop',status:'selected-current-production-raw-observed; final MP4 pending',source:{path:source,lines:[244,252,253,254]},detail:'Can rotates about Y, while tong root only translates X. Two wood bars exist but do not visibly separate mitten from hot can in the inspected current raw.',evidenceIndices:[0,1,2],proposedScope:'Root/D decide one local hand/tong placement correction only; no original edit or whole-film regeneration requested.'},
 {id:'D40-valve-not-following-released-half',rows:[40],priority:'required attached prop continuity',status:'source-confirmed with historical actual image; current production portion not viewed',source:{path:source,lines:[281,282,283,284,285]},detail:'Released halves gain +/- .08*release and rotation; valve/pipe gain only apart (zero after join). They consequently stay at center after separation.',evidenceIndices:[6,7]},
 {id:'D28-equal-force-arrow-lengths',rows:[28],priority:'explicit quantitative encoding',status:'source-exact difference, final semantic severity unconfirmed',source:{path:lib,lines:[94,95]},worldLengthsMetres:[.048,.046],differenceMetres:.002,ratio:24/23,detail:'Do not confuse this 4.35 percent world-length difference with the additional perspective difference in a close shot.',evidenceIndices:[3]},
 {id:'D43-color-coal-phase',rows:[42,43],priority:'explicit word/action timing',status:'source-only; not a newly viewed final failure',source:{path:source,lines:[202,209,210,211,331,332,333]},detail:'Hot/cold starts at next:mio, not the row43 heating-again word. Color changes at absolute integer seconds, coal removal one second after the relative word offset; exact offset about .064 s. This is small timing evidence, not a request for arbitrary extra animation.'},
 {id:'D6-assembly-hop',rows:[6],priority:'lower-priority literal animation detail',status:'source-only',source:{path:source,lines:[224,225,226,227,228,229]},detail:'Parts settle monotonically from+40 mm; no specified slight hop/bounce.'},
 {id:'D15-balloon-wrinkles',rows:[15],priority:'lower-priority literal appearance detail',status:'source-confirmed; old selected actual image smooth',source:{path:source,lines:[255,256,257]},detail:'Uniform sphere scaling and4 percent Z-axis oscillation do not create wrinkles.',evidenceIndices:[4]},
 {id:'D17-can-rebound',rows:[17],priority:'lower-priority literal animation detail',status:'source-only; still image cannot establish temporal rebound',source:{path:source,lines:[244,245,246]},detail:'The crush influence increases monotonically from0 to1; no final small return is encoded.',evidenceIndices:[5]},
];
const out={episode:'D-1',reviewer:'independent E-1 agent',recordedAt:new Date().toISOString(),kind:'Read-only all46 required-prop/action/word correspondence and nine actually viewed images; not final acceptance',
 inputs:[...[
 '/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/D-1/D-1_制作指示書.md',
 source,lib,W+'scripts/umech/desk-d1v1-data.mjs',W+'scripts/umech/desk-d1v1-overlay.mjs',W+'scripts/umech/mix-chain-desk-audio-d1v1.py',
 W+'docs/video-revision-20260924/deep/D-1_cue時刻一覧.md',W+'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1_第1版_ナレーション.md',dataPath,
 ].map(file)],
 all46SourceAndInstructionRead:true,all57CueTimingCorrespondenceChecked:data.cues.length===57,
 rows:rowNotes.map((note,i)=>({row:i+1,cues:data.cues.filter(c=>c.row===i+1).map(c=>({key:c.key,start:c.start,end:c.end,wordEvents:c.wordEvents})),independentSourceCheck:note,finalActualAcceptance:false})),
 selectedActualImages:evidence,actuallyViewedImages:9,currentProductionRawImagesViewed:1,historicalPreviewImagesViewed:8,
 newFindings:findings,
 knownNotNew:['row32 fixed-voice/two4second cycles conflict','straw fixed-bottom getter awaiting GUI079a','trace fixed-top getter awaiting GUI079a','row33 continuous rendering vs full-face coverage','coal creation-index vs top-down removal','hemi gas duration','physical-board rise absent with permitted2D scoring interpretation pending','bookend exact camera array'],
 constructionStyleDifferencesNotNewRepairRequests:['Open-front brass cylinder instead of an independently modeled glass panel','Straight metal piston connecting rod instead of chain links'],
 reviewedAudioRecipeOnly:true,actualEarListeningDone:false,finalMP4Reviewed:false,
 originalSourcesEdited:false,originalCaptionVoiceModified:false,modelReloaded:false,newGPUJobsSubmitted:0,encodeOrHeavyCPUStarted:false,
 E1PreparedHelpersKeptFrozen:true,originalInspectorNGPreserved:true,blanketWaiver:false,finalAcceptance:false,
 unverified:['No final delivered D MP4 yet reviewed by this receipt','Only one selected ongoing production raw viewed; other production output not reclassified as reviewed','Final timing/occlusion after camera patch and any root-approved local correction','No ears-on audition of final AAC','New candidate fixes have not been rendered/approved in this review'],
};
fs.writeFileSync(output,JSON.stringify(out,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({output,sha256:hash(output),rows:out.rows.length,cues:data.cues.length,images:evidence.length,finalAcceptance:false}));
