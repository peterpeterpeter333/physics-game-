// Record only images actually inspected; no rendering, encoding or approvals.
import fs from 'node:fs';
import crypto from 'node:crypto';
const C='/private/tmp/ys/ys-chain-d1v1-render';
const out=C+'/d1-moving27-existing-images-20261024.json';
if(fs.existsSync(out))throw new Error('Preserve existing review record');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const auditPath=C+'/d1-semantic-physical-r15.json';
const audit=JSON.parse(fs.readFileSync(auditPath));
const prev=JSON.parse(fs.readFileSync(C+'/d1-semantic-physical-r12.json'));
const oldManifest=JSON.parse(fs.readFileSync(C+'/probe-review-d1v1-r8/d1v1-probe-review.json')).manifest;
const facts={
 '00810':'模型がゼロ。木目と壁だけ。',
 '00822':'得点板が右端で切れ、水1だけが見える。',
 '01010':'旧カメラの炭鉱断面が左端に切れ、馬は見えない。r12で経路が変更されたため現版の証明に使わない。',
 '01080':'炭鉱が右端で切れているが、馬と小屋、坑の水位は見える。旧 horse→mine 経路。',
 '01851':'前の完成機関全体が見える。入口直前。',
 '01870':'筒とピストンが見える。筒そのものは切れていない。',
 '02910':'前の筒の接写だけ。新しい風船は未入画。',
 '02928':'風船とスプーンが右下へ寄り、スプーン柄が右で切れる。',
 '03501':'前の風船とスプーンが小さく中央に残る。缶は見えない。入口前。',
 '03520':'缶、皿、コンロは画内。旧赤輪は現版で印刷帯へ修正済み。',
 '04320':'前の潰れた缶と矢印。コップは見えない。入口直後の可能性がある。',
 '04337':'コップが右寄り、ストロー上端が右で切れる。',
 '05540':'前の100kgおもりは全部見える。缶はまだ見えない。',
 '05560':'缶、矢印が画内に入るが左の手形板が左切れ。',
 '06480':'炭鉱は左端の細い切片だけ。大半は木目と壁、右に得点板の一部。',
 '06492':'炭鉱全体の左半分が左画外。筒は見える。',
 '06818':'完成機関全体と筒を指す手が見える。新しい筒接写の入口前。',
 '06834':'筒は見える。梁と左側の機関は画面端で切れる。',
 '07639':'前の筒の接写は見えるが、ポンプ全体は入らない。',
 '07658':'全体へ引く途中、梁と炭鉱の左側が左画外。',
 '08310':'前の炭鉱全体。新しい2本の筒は見えない。',
 '08337':'細い筒が右寄り、太い筒の大部分が右画外。',
 '08526':'前の細い/太い筒と矢印は全部見える。面積円盤は見えない。',
 '08544':'面積円盤が中央に入る。切れは見当たらないが小さめ。',
 '09677':'前のおもりと4頭の馬。半球はまだ見えない。',
 '09696':'左半球が左画外へ切れている。右半球は画内。',
 '10068':'前の合わさった半球が中央。馬8頭はまだ見えない。',
 '10088':'8頭を含む幅に引く途中で、左端の馬が左切れ。',
 '10320':'前の離れた半球と8頭の馬が全部見える。地図は未入画。',
 '10346':'地図が中央。切れは見当たらない。',
 '10640':'前の地図。新しい筒はまだ見えない。',
 '10658':'筒と炭鉱が左端へ大きく切れる。中央と右は壁/机。',
 '10836':'前の筒接写。新しい石炭は見えない。',
 '10856':'石炭と筒は見えるが梁/機関左側が左画外。',
 '11460':'前の石炭、筒、炭鉱一部。富士山はまだ見えない。',
 '11487':'富士山が右画外で切れ、山頂側機関も右端に寄る。',
 '11910':'炭鉱が左端へ大きく切れ、中央は木目/壁。',
 '11922':'炭鉱左側がまだ画外。筒、得点板の一部は見える。'
};
const images=Object.entries(facts).map(([n,observation])=>{
 const image=C+'/blender/probe1s-d1v1-r8/'+n+'.jpg';
 const m=oldManifest.find(x=>x.source===image);if(!m)throw new Error(n);
 return {revision:'r8',time:m.time,image,sha256:sha(image),actuallyViewed:true,observation,currentR15Evidence:false};
});
for(const [n,time,observation] of [
 ['07',33.2,'得点板だけが見え、声がいう馬はまだ画外。'],
 ['08',33.45,'馬が画内へ戻る。炭鉱を斜めから見ている。'],
 ['09',33.7,'馬は画内。実際の馬幅はまだ小さい。'],
 ['14',41.922,'設置前の炭鉱が全部入る。幅72.51%で40–70%をわずかに超えるが、巨大クリップではない。']
]){const image=C+'/gate-c-d1v1-r12/d1v1-'+n+'.png';images.push({revision:'r12',time,image,sha256:sha(image),actuallyViewed:true,observation,currentR15Evidence:'camera path unchanged; later focus/material differences remain'});}
const revealImage=C+'/blender/landmarks-d1v1-r14/04007.jpg';
images.push({revision:'r14',time:133.570667,image:revealImage,sha256:sha(revealImage),actuallyViewed:true,observation:'缶本体と成長中の短い矢印は画内。コンロ左端は切れるが主役でない。元幅34.756%は実際の途中サイズなので40–70%合格にはしない。旧太い赤帯はr15で印刷帯へ修正済み。',currentR15Evidence:'same exact camera; only printed-band material differs'});
const byCue={
 'mine:rule':['00810','00822'],'mine:mio':['01010'], 'nc:install':['01080'],
 'myth:side':['01851','01870'],'shrink:spoon':['02910','02928'],
 'can:heat':['03501','03520'],'air:who':[], 'straw:drink':['04320','04337'],
 'air:inside':['05540','05560'],'eng:apply':['06480','06492'],
 'eng:steam':['06818','06834'],'eng:down':['07639','07658'],
 'size:wide':['08310','08337'],'size:53':['08526','08544'],
 'size:guericke':['09677','09696'],'size:pull':['10068','10088'],
 'next:spread':['10320','10346'],'next:mio':['10640','10658'],
 'next:waste':['10836','10856'],'ch:fuji':['11460','11487'],'last:air':['11910','11922']
};
const rows=audit.rows.filter(r=>r.cameraTransition&&!r.pass).map(r=>{
 const pr=prev.rows.find(x=>x.cue===r.cue&&Math.abs(x.time-r.time)<1e-5);
 const selected=images.filter(x=>byCue[r.cue].some(n=>x.image.endsWith('/'+n+'.jpg')) || r.cue==='mine:mio'&&x.revision==='r12'&&x.time<34 || r.cue==='nc:install'&&x.time===41.922 || r.cue==='air:who'&&x.revision==='r14');
 return {cue:r.cue,time:r.time,physical:r.actualSurface,physicalChecks:r.physicalChecks,criticalSurface:r.criticalSurface,criticalChecks:r.criticalChecks,r12CameraPoseExactlyEqual:pr?JSON.stringify(pr.actualPose)===JSON.stringify(r.actualPose):null,exactTimeCurrentR15JpegExists:false,viewedImagePaths:selected.map(x=>x.image),judgment:r.cue==='air:who'?'No loss/clipping of can and current arrows in same-camera r14 image; intermediate width remains original NG. Preserve meaningful same-site reveal.':'Do not waive. Exact r15 moving frame absent; linked old/nearby actual images plus current physical failure require targeted correction/actual trial.'};
});
const result={episode:'D-1',recordedAt:new Date().toISOString(),status:'Existing pre-production trial images only, NOT a final MP4 review',sourceAudit:auditPath,sourceAuditSha256:sha(auditPath),frozenSourceSha256:audit.sourceSha256,knownMovingFailures:rows.length,actuallyViewedImages:images.length,originalPhysicalNGPreserved:true,originalInspectorModified:false,finalAcceptance:false,gpuOrHeavyCpuExecuted:false,sourceModified:false,scopeWarning:'r15 has only the three can-collapse trial JPEGs. Most linked moving images are r8 near-times with different camera calibration; they are not exact r15 proof. r12 has identical audit poses for 25 of these 27 states, but only four linked r12 JPEGs. visible=true in physical checks means render visibility, NOT screen intersection.',rows,images,proposedPatch:{exclude:['air:who'],candidateCues:Object.keys(byCue).filter(k=>k!=='air:who'),method:'New derived camera-only helper: cut to each next site, 10% safe approach within same existing move duration; keep all unchanged object source frames and dependent holds. Preserve meaningful same-site balloon tracking, can inversion/close/reveal and unit/weight/palm cameras. Every replacement geometry frame bounds/width plus actual previews still required.'},notConfirmed:['No exact current r15 images for the 27 moving audit times','No final encoded D1 MP4 exists yet','No actual-ear listening','No patched camera actual trial or full geometry audit has run']};
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),rows:rows.length,images:images.length}));
