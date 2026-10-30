// CPU-only source attestation. No Blender, encode, original edits, or image viewing.
// This NEW writer creates one NEW receipt and never overwrites an existing file.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const W=fileURLToPath(new URL('../../',import.meta.url));
const H='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22';
const C='/private/tmp/ys/ys-chain-b1v1-final4-owned-resume-v2-20261025';
process.env.EM_FILM_CACHE=C;
const {voiceMap,wt}=await import('./yt1-chain-00bx-common.mjs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const text=p=>fs.readFileSync(p,'utf8');
const output=W+'outputs/axes-20261023/b1-all39-row-source-timing-attestation-v2-20261025.json';
assert(!fs.existsSync(output),'Preserve prior receipt');
const instruction=H+'/B-1/B-1_制作指示書.md';
const common=H+'/07_軸の1本目_共通の制作指示.md';
const canon=W+'docs/video-revision-20260924/deep/技術の疑問の鎖_B-1_第1版_ナレーション.md';
const table=W+'docs/video-revision-20260924/deep/B-1_cue時刻一覧.md';
const rows=[...text(instruction).matchAll(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/gm)].map(m=>({row:+m[1],principalRequirement:m[2],cameraRequirement:m[3],actionRequirement:m[4],signRequirement:m[5]}));
assert.equal(rows.length,39);
const data=read(C+'/blender/data.json').b1,plan=read(C+'/plan.json')[0],clip=read(C+'/ys-chain-b1v1.json'),pt=read(C+'/phrase-times.json');
const cues=[];
for(let si=0;si<plan.scenes.length;si++)for(let qi=0;qi<plan.scenes[si].cues.length;qi++){
 const q=plan.scenes[si].cues[qi],cap=clip.scenes[si].captions[qi],key=q.diagram.replace('cb1v1-','');
 const d=data.cues.find(c=>c.key===key);assert(d&&d.start===cap.start&&d.end===cap.end,key);
 assert(pt[q.subtitle]?.kana===(q.kana??null),'Never accept estimated voiceMap '+key);
 assert.deepEqual(voiceMap({cue:q}),pt[q.subtitle]);
 assert(pt[q.subtitle].s.length===pt[q.subtitle].t.length);
 cues.push({key,q,cap,d});
}
assert.equal(cues.length,50);assert.equal(new Set(cues.map(c=>c.key)).size,50);
// Independently re-evaluate the exact frozen voiceMap's primary spoken words.
// Expected seconds are the supplied rounded cue-time table, not a substitute audio.
const wordSpecs={
 'open:box':[['この小さな針','コノチイサナハリ',4.13]],
 'open:mio':[['方位磁針','ホオイジシン',7.13]],
 'open:who':[['1600年ごろ','センロッピャクネンゴロ',12.72]],
 'lore:star':[['北極星','ホッキョクセイ',20.10]],
 'lore:island':[['黒い磁石の岩','クロイジシャクノイワ',33.12]],
 'lore:mio':[['どっちも','ドッチモ',36.32]],
 'lore:garlic':[['ニンニクを食べるな','ニンニクオタベルナ',46.56]],
 'doubt:gilbert':[['ウィリアム・ギルバート','ウィリアムギルバアト',52.18]],
 'garlic:side':[['破る側から','ヤブルガワカラ',60.67]],
 'garlic:rub':[['たっぷり塗りました','タップリヌリマシタ',68.49]],
 'garlic:nail':[['引き寄せました','ヒキヨセマシタ',74.61]],
 'garlic:mio':[['まちがってた','マチガッテタ',78.08]],
 'rule:first':[['北を向く','キタオムク',81.21]],
 'rule:bar':[['N極','エヌキョク',88.39],['S極','エスキョク',88.96]],
 'rule:pull':[['引き合います','ヒキアイマス',94.15],['押し返し合います','オシカエシアイマス',96.58]],
 'rule:needle':[['北を向くほう','キタオムクホオ',101.83],['N極','エヌキョク',103.26]],
 'rule:vane':[['風の吹いてくる向きに','カゼノフイテクルムキニ',107.97],['磁石の力が引く','ジシャクノチカラガヒク',111.35]],
 'rule:north':[['針のN極（矢印の対象トークンN極）','エヌキョク',117.79],['北に','キタニ',116.80]],
 'terella:idea':[['ギルバート','ギルバアト',121.65]],
 'terella:make':[['削って','ケズッテ',126.40],['丸い球','マルイタマ',127.15]],
 'terella:place':[['置いていきます','オイテイキマス',135.35]],
 'terella:top':[['同じてっぺん','オナジテッペン',140.47]],
 'terella:mio':[['本物の地球','ホンモノノチキュウ',143.69]],
 'terella:dip':[['水平なのに','スイヘイナノニ',153.97],['下へ傾いて','シタエカタムイテ',157.18]],
 'lines:iron':[['鉄の粉をまくと','テツノコナオマクト',160.94],['線になって','センニナッテ',163.73],['N極から','エヌキョクカラ',166.91],['S極へ','エスキョクエ',170.13]],
 'lines:follow':[['この線に沿って','コノセンニソッテ',175.17]],
 'lines:dip':[['下を向きます','シタオムキマス',181.87],['上を向きます','ウエオムキマス',185.82]],
 'test:side':[['確かめる側から','タシカメルガワカラ',188.89]],
 'test:hyp':[['仮説','カセツ',192.74]],
 'test:if':[['ロンドン','ロンドン',201.72],['真ん中の帯','マンナカノオビ',202.55],['てっぺん','テッペン',203.38]],
 'test:70':[['針を置く（動作トークン置く）','オクト',208.58],['およそ70度','オヨソナナジュウド',210.23],['およそ70度・2回目','オヨソナナジュウド',214.27,1]],
 'test:others':[['北極星','ホッキョクセイ',219.55],['空の上を向く','ソラノウエオムク',222.13]],
 'test:island':[['島へ向かう線','シマエムカウセン',227.95],['地面の下を浅く','ジメンノシタオアサク',229.27],['20度ほど','ニジュウドホド',232.30]],
 'test:fact':[['事実','ジジツ',238.48]],
 'test:norman':[['1581年','センゴヒャクハチジュウイチネン',240.81],['上下にも自由に動く針','ジョオゲニモジユウニウゴクハリ',244.87],['約72度','ヤクナナジュウニド',249.28]],
 'test:judge':[['地球が磁石','チキュウガジシャク',253.85],['星の言い伝え','ホシノイイツタエ',255.98],['島の言い伝え','シマノイイツタエ',257.13],['崩れた','クズレタ',258.36]],
 'test:mio':[['足の下の地球','アシノシタノチキュウ',265.03]],
 'bar:inside':[['地球の中に','チキュウノナカニ',269.72],['棒磁石','ボオジシャク',271.58]],
 'odd:wait':[['ちょっと待って','チョットマッテ',276.91]],
 'odd:which':[['地球の北','チキュウノキタ',283.86],['N極ですか','エヌキョクデスカ',281.57]],
 'odd:s':[['磁石のS極（表示トークンS極）','エスキョク',293.74]],
 'odd:n':[['N極','エヌキョク',296.49]],
 'odd:mio':[['S極','エスキョク',299.85]],
 'odd:name':[['N極と呼ぶ','エヌキョクトヨブ',303.71],['S極になる','エスキョクニナル',307.43]],
 'next:book':[['1600年','センロッピャクネン',315.63]],
 'next:mio':[['地球の中のどこ','チキュウノナカノドコ',321.23]],
 'next:later':[['電気','デンキ',329.80]],
 'ch:q':[['オーストラリア','オオストラリア',335.65]],
 'ch:next':[['電気と電波の回','デンキトデンパノカイ',345.66]],
 'last:needle':[['嵐の夜','アラシノヨル',348.99]]
};
// Per-row reasoning is human source reading, not programmatically inferred PASS.
const S='scripts/blender/desk_b1v1.py',L='scripts/blender/desk_lib_b1.py',B6='scripts/blender/desk_axes_b1_integrated_b6_v6_20261024.py',O='scripts/umech/desk-b1v1-overlay.mjs';
const rowAudit=[
 [1,'source-matches-design',`${S}:139–144; ${B6}:apply_integrated; ${L}:compass`, 'Box opens110 degrees over0.9s, damped40-degree needle; blue hand touches; unchanged ship is on right. B6 frames principal box plus ship without reorienting ship.','0–0.9s lid;1.8s damping;4.13s needle phrase.'],
 [2,'source-matches-design',`${S}:compass_state; chain-b-1.mjs:open:mio`, 'Same open compass, small proud Mio face, no extra physical action.','7.003–11.164s; reused static object state, not claimed new motion.'],
 [3,'approved-framing-derivative',`${S}:apply_state board rotation; desk_axes_b1_score_entries_d1_v2_20261024.py:84–139`, 'Physical board rises at1600word; new B3 shifts board+0.20m on table with all digits clear of compass lid; holds original0–0 HUD through18.74.','12.72–13.32s rise; source camera transition is1.0s rather than requested1.2s.'],
 [4,'instruction-internal-direction-conflict',`${S}:41–43,204–206; ${O}:r4`, '24 yellow dots grow from compass toward star. Matches section7 connection/growth, but N4 explicitly says star-to-compass; the two instructions are not direction-identical.','20.10s then24dots at0.025s intervals (0.575s).'],
 [5,'source-matches-design',`${S}:214; ${L}:map; ${O}:r5`, 'Recreated map has raised black rock; rock rises1cm at blackrockword; reproduction notice is explicit.','33.12–33.52s rise; only lighting appearance awaits actual pictures.'],
 [6,'source-matches-design',`${S}:map group; chain-b-1.mjs:lore:mio`, 'Same map and small thinking Mio; no physical-action requirement.','36.186–39.249s.'],
 [7,'approved-staging-derivative',`${S}:sailor; desk_axes_b1_camera_size_b4_v4_20261024.py:34–53; ${B6}:apply_lore_garlic_initial`, 'Garlic waiting location shifts only before unchanged43.5–45.5s mouth approach; freezes then0.3s jitter at eat-notword. Sailor pose itself does not animate; garlic carries the gesture.','Approach43.5–45.5; jitter46.56–46.86; interpreted frozen sailor with trembling garlic.'],
 [8,'source-matches-design',`${S}:gilbert group; ${O}:r8`, 'Gilbert rises and falls2cm on a sine hop at name. No separate forward horizontal translation is encoded although section7 says jump and come forward.','52.18–52.58s hop; forward part is absent in literal source.'],
 [9,'approved-staging-derivative',`${S}:garlic; ${B6}:garlic staging`, 'Blue hand approaches garlic, rubs three sinusoidal round trips; three streaks appear0.6s apart; Gilbert model remains as observing context.','Rub68.49–70.35s; approach68.09–68.49; return70.35–71.15 spans into following cue.'],
 [10,'source-matches-design',`${S}:garlic nails; mixed SFX provenance`, 'Three nails approach magnet, stagger0.07s, each0.4s. Sound mix is source-bound only; not independently heard here.','74.61/74.68/74.75s start; each0.4s.'],
 [11,'partial-literal-design-match',`${O}:score loop; chain-b-1.mjs:garlic:mio`, '2D HUD changes0–1 and +1 floats; small jitome face. Physical board numeric1.25x pulse required by E2/section7 is not encoded in row11; common6.0 permits 2D board, but literal individual request differs.','78.08s score; do not claim physical digit pulse.'],
 [12,'approved-staging-derivative',`${S}:rule:first/r12; ${B6}:retire props; ${O}:r12`, 'Two bars Nred/Sblue; garlic and nails retire first sideways then back to avoid passing through magnetB. Each N/S end glows at supplied word.','Props81.08–81.88s; N88.39/S88.96 each0.4s.'],
 [13,'approved-semantic-derivative',`desk_axes_b1_repel_b5_v4_20261024.py:stages; ${B6}:pair`, 'First NS attracts; NN approach visibly recoils, then180-degree escape, then SN attachment in voice pause. Preserves source field/hand meaning with explicitly separated stages rather than visually ambiguous NN rotation.','NS94.15; NN96.58; recoil97.08–97.43; spin97.65–98.00; attachment98.20–98.60.'],
 [14,'approved-framing-derivative',`${S}:r14; desk_axes_b1_score_entries_d1_v2_20261024.py:compass_pose; ${O}:r14`, 'Red north-seeking tip glows; north-tip=N and declination notice; entire lid retained by new whole-cue fit.','Glow101.83–102.43; Nlabel103.26.'],
 [15,'source-direction-mismatch',`${L}:109–120; ${S}:208–211; ${O}:r15`, 'Wind curves travel world−X. Rooster head is initially+X and root rotates+70degrees aboutZ, so final head=(cos70,sin70), not upwind+X. Vane turn therefore does not literally demonstrate pointing toward arriving wind. Compass/magnet approach still turns needle at111.35.','Wind107.97–108.57; vane107.97–108.67; bar/needle111.35–112.05. Requires root-authorized NEW visual-only correction or explicit noncompliance.'],
 [16,'source-matches-design',`${O}:r16; ${B6}:compass framing`, 'Yellow arrow extends from red needle tip toward north anchor at N極word117.79,0.99s after北に116.80; meaning correct but literal section7 requests北に.','117.79s onset,0.22s ease.'],
 [17,'approved-staging-with-word-offset',`${S}:terrella_state; ${B6}:rough-stone descent`, 'Rough stone now descends4cm at idea cue, with small bounce. Carving starts at削って and completes0.8s later; requested丸い球word is0.75s after carving starts. Canonical audio untouched.','Descent121.52–122.32; carving126.40–127.20 vs丸い球127.15.'],
 [18,'source-boundary-shortfall',`${S}:terrella_state149–175`, 'Six needles drop0.25s each, starts0.4s apart, blue hand continuous. Sixth begins137.35 but row18 ends137.43, next cue137.469 resets drop offset and hand disappears; lastdrop cannot finish smoothly by137.60.','Sixstarts135.35+i×0.4; last137.35, intendedend137.60; source jump boundary137.469. Actual encoded pictures still unviewed.'],
 [19,'source-matches-meaning-not-literal-simultaneity',`${S}:terrella_state149–161; ${L}:needles`, '12 needles align along local north tangent, then later dip. Alignment is staggered0.03s per index, not literally all simultaneous as section7 says. White meridians remain, letters not revealed yet.','140.47+i×0.03 over0.5s each; all done141.30 rather than140.97.'],
 [20,'source-matches-design',`chain-b-1.mjs:terella:mio; desk-frame.mjs:faceLayer`, 'Frozen full-screen hirameki face; background remains source geometry. No physical action requested.','143.558–147.185s face window per frozen metadata.'],
 [21,'source-matches-design',`${S}:terrella_state/r21; desk-b1v1-data.mjs:dip/needles`, 'Equatorial horizontal needle highlighted; north-latitude needles interpolate tangent to exact dipoleB downward in0.15s sequence. Equal latitude opposite-longitude samples share correct local semantics.','Horizontal153.97; dip157.18+i×0.15,0.45s; compare actual row21 indices for final visibility.'],
 [22,'approved-annotation-derivative',`${S}:powder_state; ${L}:powder; desk-b1v1-final3-frame.mjs; desk-b1v1-review-overlay.mjs`, 'Bottle shakes with blue hand,3000particles align onto16dipole lines, yellow arrows move redN to blueS. New labels use leaders and8pixel exact-pole markers; these are 2D position annotations, not visible rear3D-cap proof.','Shake160.94–162.6; align163.73–164.73; N166.91/S170.13.'],
 [23,'source-matches-design',`${S}:terrella_state,powder_state,r23; desk-b1v1-review-overlay.mjs`, 'Needles remain exactB along lines; north/S-top side dips down, south/N-bottom side rises, equator horizontal. Source highlighting uses pole materials, not exclusively an individual needle mesh.','Sside181.87/Nside185.82; physical highlighting target differs subtly from requestedneedle.'],
 [24,'source-matches-design',`${S}:globe_state; ${O}:logic cards`, 'Globe and hypothesis card, green evidence-side view card. No new physical movement requested after camera settling.','Hypothesis192.74; camera only transitions1.0s rather than requested1.2.'],
 [25,'approved-semantic-pointing-derivative',`${S}:london; desk_axes_b1_small_gesture_20261024.py:46–64; desk-b1v1-data.mjs:dip`, 'Reference hand tip tracks London/equator/pole intermediate then London exact position; wrist shrunk about unchanged tip. Needle placed atlatitude51.5 and tips downward atan2(2sinλ,cosλ)=68.31degrees, not handpicked70.','Reference201.72/202.55/203.38/204.15/205.37; place208.58–208.88; dip210.23–210.83.'],
 [26,'source-word-offsets-with-correct-geometry',`${S}:globe_state194–196; ${L}:globe lines; ${O}:prediction cards`, 'Three local-horizon lines: star+51.5, islandstraightchord−19.25, known magneticprediction−68.31. Star/island lines begin atobject words before requested concluding direction phrases. Third curve234.40 after voice ends within originalpause.','Starline219.55 vs空の上222.13; islandline227.95 vs地面の下229.27; third234.40. Cards wait222.13/232.30/234.40.'],
 [27,'source-matches-design',`${S}:meter; ${L}:meter; ${O}:r27`, 'Norman dipmeter has horizontalreference; damped±20degree wiggle then71°50′ (~72) downward stop at72word, marklights.','Wiggle244.87–248.63; final248.63–249.28; mark/fact249.28.'],
 [28,'partial-literal-word-match',`${O}:r28,score; ${S}:predict`, 'Circle magneticprediction, crossstar/island, score1→2→3; conclusion uses地球が磁石word253.85, notlater仮説だけ254.89; two crosses followtheirindividualspokenwords, notfixed0.2s apart. Physicalnumericpulse not encoded as inrow11.','Circle253.85; crosses255.98/257.13; score258.36/+0.3.'],
 [29,'source-matches-design',`chain-b-1.mjs:test:mio; desk-frame.mjs:faceLayer`, 'Full-screen hirameki face; previouscomparison context retained behind. No physical action required.','260.614–268.014s.'],
 [30,'source-matches-design',`${S}:globe_state; ${O}:viewCard`, 'Gray innerbarappears at棒磁石 while surface alpha goes1→0.4 (60%transparent); N/S letters/colors notpremature. Explicitたとえ話 preservesmodel-vs-realEarth distinction.','271.58–272.38s; 地球の中に269.72 table calls transparency earlier, but actualsection7target棒磁石 supports271.58.'],
 [31,'source-matches-staged-face-reading',`chain-b-1.mjs:odd:wait,odd:which; ${O}:r31`, 'Full-face question only firstcue; secondcue has no fullface, globe?visible at地球の北word. Preserves stagedquestion without obstructingactualquestionmark.','Fullface276.781–280.97; ?283.86. Suppliedtime table N極ですか281.57 is wrong; actualquestionword recomputed in receipt.'],
 [32,'source-matches-design',`${S}:globe_state,apply_state r32; ${O}:r32`, 'Northern innerbarend blueS atspokenS, southernend redN atspokenN; yellow attractionfromcompassNtonorthernS. Geographicnorth+Z is not mislabeled asmagneticN.','BlueS293.74; redN296.49; arrow293.74.'],
 [33,'source-matches-design',`chain-b-1.mjs:odd:mio; desk-frame.mjs:faceLayer`, 'Full-screen shockedMio; frozenvoice/SFX source must be heard independently.','298.425–301.585s; S/bell299.85.'],
 [34,'partial-literal-word-match',`${O}:r34`, 'Namingsequence explicitlydisplayed; firstcardatN極と呼ぶ303.71 instead of先に決めた304.82; secondatS極になる307.43. Meaningcorrect, firstlabel~1.11s earlierthanliteralinstructionword.','303.71 then307.43.'],
 [35,'source-matches-design',`${S}:book; ${O}:score loop; chain-b-1.mjs:next:book`, 'Book opensat1600word, physicalboard shows0–3; HUD displaysscoreonlynoaward; smallKaiproudface.','315.63–316.43s open; HUD315.63 sourceunchanged.'],
 [36,'immutable-metadata-design-conflict',`chain-b-1.mjs:next:mio face a0 b1; desk-frame.mjs:full-face suppresses overlay; ${O}:r36`, 'Frozenfull-screenMio coversglobeand suppressionomits?overlay throughcue. Section7 askscutawaycenter?atどこに; existingoverlaywouldstartcap.start+1=321.463 notactualphrase321.23 evenifshown. Cannothonestlyattestliteralpasswithoutrootpolicydecision/new visualderivative.','320.463–326.41fullface; ?notvisiblebydesign; noactualimageclaim.'],
 [37,'source-word-offset',`${S}:apply_state r37; ${L}:mysterybox; ${O}:r37`, 'Closedwoodbox visiblefromcue326.445, lightningonly329.80–330.5at電気. Requirementboxplacementat電気notencoded; mainlabelwaits329.80.','Boxvisible326.445; lightning329.80.'],
 [38,'approved-annotation-derivative',`${S}:challenge_setup; desk_axes_b1_challenge_b3_v2_20261024.py; desk-b1v1-review-overlay.mjs`, 'Southhemisphere−30latitude problemneedleheldlocalhorizontal withanswerdirectionnotrevealed; actualsourcequestionstateclearsotherneedles. Offset?keepsneedlevisible; noansweracceptedhere.','Question335.65; answer-next notice343.593; finalimageeyesrequired.'],
 [39,'approved-framing-derivative',`${S}:compass_state; ${B6}:SHIP camera`, 'Samephysicalcompassandrightshipasopening,8degree dampedneedle, noopeninghand; B6 samewhole-objectframingforbookendafter1.2sec approach.','348.865s start;8degree exp−2t cos9t. Actualbookendexactproofstillrootreview.']
];
assert.equal(rowAudit.length,39);assert(rowAudit.every((r,i)=>r[0]===i+1));
const sourceFiles=[common,instruction,canon,table,W+'docs/video-revision-20260924/ytseries/chain-b-1.mjs',...[
 S,L,B6,O,'scripts/umech/desk-b1v1-data.mjs','scripts/umech/desk-b1v1-review-overlay.mjs','scripts/umech/desk-b1v1-final3-frame.mjs','scripts/umech/desk-frame.mjs','scripts/umech/yt1-chain-00bx-common.mjs','scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py','scripts/blender/desk_axes_b1_small_gesture_20261024.py','scripts/blender/desk_axes_b1_score_entries_d1_v2_20261024.py','scripts/blender/desk_axes_b1_camera_size_b4_v4_20261024.py','scripts/umech/desk-b1v1-final-b6-v6-owned-resume-v2-assemble-20261025.mjs'].map(p=>W+p),...['plan.json','ys-chain-b1v1.json','phrase-times.json','blender/data.json','prepared.json','composite-provenance.json','final-held-dimensions.json'].map(p=>C+'/'+p),W+'outputs/axes-20261023/b1-owned-resume-v2-independent-preflight-20261025.json'];
const sourcePins=sourceFiles.map(p=>({path:p,sha256:sha(p)}));
const wordChecks=[];
for(const c of cues){assert(wordSpecs[c.key],c.key);for(const [label,kana,expected,occ=0] of wordSpecs[c.key]){
 const actual=c.cap.start+wt({cue:c.q},kana,occ),delta=actual-expected;
 wordChecks.push({cue:c.key,row:c.d.row,word:label,kana,occurrence:occ,suppliedTableSeconds:expected,exactVoiceMapSeconds:actual,deltaSeconds:delta,roundedTableMatches:Math.abs(delta)<=.01001,voiceMapExactKana:true,estimatedTimingUsed:false});
}}
const report={schemaVersion:2,supersedes:'b1-all39-row-source-timing-attestation-20261025.json (v1 manual expected-token labels corrected; original retained)',id:'ys-chain-b1v1',scope:'All39 canonical shooting rows /50 cues SOURCE and exact frozen word timing only',createdAt:new Date().toISOString(),reviewer:'/root/b1_final_cpu_preflight',actualImagesViewed:false,actualVideoWatched:false,actualAudioHeard:false,finalAcceptance:false,
 preservation:'Read-only audit of immutable originals and actual prepared B3+B6-owned-resume-v2 source metadata. Only this NEW writer and receipt created. No GPU/encode/git/shared edit.',
 actualPreparedIndependentReceipt:sourcePins.at(-1),sourcePins,
 coverage:{canonicalShootingRows:39,sourceCues:50,exactPhraseMaps:50,primaryWordChecks:wordChecks.length,wordChecksWithTableDiscrepancy:wordChecks.filter(x=>!x.roundedTableMatches).length},
 caveats:['Not an actual-image, ear, or final MP4 review. Design matching does not imply visibility, no collision, color readability, framing or caption pass.','Held-frame final source paths/poses must be joined through actual composite-provenance.json; never evaluate nominal time as replacement for held source. Prior independent receipt already validates raw803=487+316 and prepared output protection.','Narration uses attraction as an elementary analogy. Magnetic compass turns from torque/alignment in a magnetic field; uniform field can exert zero net translational force. Immutable Japanese is reported, never rewritten.','Spherical dipole and latitude51.5 are an idealized test, not a claim London2026 real declination/inclination equal68.31. Island point model−19.25 assumesa north-pole source.'],
 rows:rows.map((r,i)=>{const a=rowAudit[i],cs=cues.filter(c=>c.d.row===r.row);return {...r,sourceStatus:a[1],sourceReferences:a[2],sourceReasoning:a[3],sourceTiming:a[4],cues:cs.map(c=>({key:c.key,start:c.cap.start,end:c.cap.end,sourceGroup:c.d.group,sourceCamera:c.d.camera,sourceFace:c.q.face??null,sourceView:c.q.view??null,suppliedWordEvents:c.d.wordEvents,exactPrimaryWords:wordChecks.filter(w=>w.cue===c.key)})),actualImagesViewed:false,actualAudioHeard:false,finalVisualAcceptance:'pending'};}),
 wordChecks,
 nextRequired:'Root disposition of source conflicts/offsets, then actual final image and audio review. Do not convert this receipt to all39 literal PASS.'};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:output,sha256:sha(output),coverage:report.coverage,tableDiscrepancies:wordChecks.filter(x=>!x.roundedTableMatches),finalAcceptance:false},null,2));

