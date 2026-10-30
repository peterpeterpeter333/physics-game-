import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// Serialize the manual observations made by /root/e1_row_timing_final after all
// eighteen current-final contact sheets were displayed with original detail.
// This records actual viewing; it does not infer viewing from file existence.
const W='/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series';
const MP='/private/tmp/ys/ys-chain-c1v1-final-v4-middle019-036-personal-contacts-20261025/manifest.json';
const MS='ffbac490d7339b72281265e12c383d4c9d1e9c2fb0780c2b031029215cdd8b10';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
assert.equal(sha(MP),MS);const m=read(MP);
assert.equal(sha(m.currentIndex),m.currentIndexSha256);assert.equal(sha(m.oldRequiredIndex),m.oldRequiredIndexSha256);
assert.equal(sha(m.mp4),m.mp4Sha256);
const observations={
 19:'119.000–124.000秒。数字輪0020から、もう一度ゆっくり示す説明模型へ移る。十と一の札、2と9、金色の歯車が読める。左の他の桁は寄りで一部外れるが、この段の十・一は残る。',
 20:'125.000–132.000秒。出っ張りと一の9から0への変化、隣の十の2から3への変化が選択画像上で追える。上の数字札と前の輪が分離して読め、字幕は主要な札を隠さない。',
 21:'133.000–139.000秒。十3・一0の結果と字幕「2から3に進みました」が矛盾しない。寄りのまま主対象が読め、主役の欠落や空白なし。',
 22:'140.000–147.367秒。7→8→9→0の3目盛り、0→5の5目盛り、合わせて8という札と、一の0→2→5の進みが読める。十3は維持され、結果35が読み取れる。',
 23:'147.933–154.200秒。手が十の入力輪を操作し、35から45になる。五桁の数字札と手の操作先が確認できる。画面が引かれても35／45を読める。',
 24:'155.000–161.000秒。27+18=45の結果から機械と筆算の上下比較へ移る。既知差し替え5コマ4710/4727/4740/4770/4800も現在のJPEGで直接見た。紙の繰上がり1・27・+18・45は字幕と分離している。',
 25:'162.000–169.000秒。筆算の1と1、機械の繰上がりを先・10をあと、という二つの順番が、紙と機械を残したまま説明される。結果45と紙面は消えず、字幕で数値を失わない。',
 26:'170.000–176.000秒。足す数は同じ→45の札と結果が見える。175秒から指定の全画面の顔へ切り替わる。顔の画面は図の描画欠落と扱わない。',
 27:'177.000–182.667秒。指定された全画面の顔のあと、人の手0―機械0の得点板に切り替わる。字幕と得点は離れており、両方読める。',
 28:'183.000–189.000秒。得点が0―1になる。そのあと指定された青い顔、次に作る側からの模型へフェードする。188秒の顔と模型の重なりは移行フレームであり、消失・二重描画の恒常不良とは判断しない。',
 29:'189.600–196.000秒。09999の札、入力する指、仮説「出っ張りで隣を押す」が見える。新たな数値誤り・札欠け・主役欠落なし。',
 30:'197.000–204.000秒。もし正しいなら、直接つなぐ仮説と一の輪を回す指を示す。主要な模型と字幕は分離し、上の仮説札も画面内。',
 31:'205.000–212.000秒。五つを一度に回す予言の矢印から、歯車を増やした比較模型へ移る。後者は「大げさに描いた」と明記され、実物の桁数と混同しない。',
 32:'213.000–219.300秒。横一列の歯車と指、強く押す際の機構が見える。小さな歯の細部は一覧より原寸の方が明瞭で、6450を原寸再表示し各輪と指の接触を確認した。',
 33:'219.867–226.000秒。指が退いた後も模型は残り、直接押す方式の判定△から別の仕掛けへの説明札が現れる。上部札は多いが重なりで読めない札は見つからない。',
 34:'226.600–234.000秒。一の桁の寄りへ移り、小さなおもりの付いた金色の腕が見える。一の7から8に進むと腕が上がる変化が選択画像で読める。左の他桁は寄りによる切れで、主役の腕と一・十は残る。',
 35:'234.367–240.000秒。一の9まで持ち上がった腕が、9→0のところで落ち、十が0→1になる。金色の腕とおもりは前面で見え、数字札も読める。',
 36:'241.000–248.000秒。十1・一0と落ちた腕を示す。字幕は下部入力輪と台の一部に重なるが、説明中の前の十の輪・上の腕・結果札は読める。7230を原寸で再表示して確認。'
};
const VIEWER='/root/e1_row_timing_final';
const pages=m.pages.map(p=>{
 assert.equal(sha(p.file),p.fileSha256);assert(observations[p.oldPage]);
 return {...p,actualViewer:VIEWER,displayedWithViewImage:true,displayDetail:'original',displayedDimensions:[1800,1336],
  allNineAllocatedCellsPersonallyViewed:true,unusedTenthWhiteCellExcluded:true,observation:observations[p.oldPage],
  newP0P1P2FindingIdentified:false,
  cells:p.cells.map(x=>{assert.equal(sha(x.file),x.fileSha256);assert.equal(sha(x.oldFile),x.oldFileSha256);
   return {...x,actualViewer:VIEWER,personallyViewedAsContactCell:true,individualFullOriginalDisplayed:[4727,6450,7230].includes(x.frame)};})};
});
const frames=pages.flatMap(x=>x.cells);assert.equal(frames.length,162);
const c=read(m.currentIndex),o=read(m.oldRequiredIndex),cm=new Map(c.frames.map(x=>[x.frame,x]));
const same=o.frames.filter(x=>cm.get(x.frame)?.sha256===x.sha256).map(x=>x.frame);
const changed=o.frames.filter(x=>cm.get(x.frame)?.sha256!==x.sha256).map(x=>x.frame);
const oldSet=new Set(o.frames.map(x=>x.frame)),reuse=new Set(c.priorScopedReviewReuseCandidateFrames);
const extra=c.frames.filter(x=>reuse.has(x.frame)&&!oldSet.has(x.frame));
assert.equal(same.length,473);assert.deepEqual(changed,[4710,4727,4740,4770,4800]);
assert.deepEqual(extra.map(x=>x.frame),[8535,8565]);
for(const x of extra){assert.equal(sha(x.file),x.sha256);assert.equal(sha(x.priorActualFile),x.priorActualSha256);assert.equal(x.sha256,x.priorActualSha256);}
assert.equal(same.length+extra.length,475);
const originalDetailFrames=frames.filter(x=>x.individualFullOriginalDisplayed).map(x=>({frame:x.frame,file:x.file,fileSha256:x.fileSha256,
 actualViewer:VIEWER,detail:'original',dimensions:[1080,1920],displayed:true}));
const result={date:'2026-10-25',episode:'C-1',kind:'Scoped supplemental actual-final personal image review',
 actualViewer:VIEWER,receiptSerializer:VIEWER,mp4:m.mp4,mp4Sha256:m.mp4Sha256,
 manifest:MP,manifestSha256:MS,currentIndex:m.currentIndex,currentIndexSha256:m.currentIndexSha256,
 oldRequiredIndex:m.oldRequiredIndex,oldRequiredIndexSha256:m.oldRequiredIndexSha256,
 scope:{oldRequiredPages:[19,36],pageCount:18,uniqueCurrentFinalFrames:162,firstFrame:3570,lastFrame:7440,
  firstTime:119,lastTime:248,sameOldJpegCount:157,changedOldJpegCount:5,
  changedCurrentFramesDirectlyViewed:[4710,4727,4740,4770,4800],
  allAllocatedCellsPersonallyViewed:true,all511CurrentIndexFramesPersonallyViewedByThisReviewer:false,
  originalDetailFramesPersonallyDisplayed:originalDetailFrames},
 pages,frames,
 findings:{newP0:[],newP1:[],newP2:[],
  P3Observations:[{frames:[6450],status:'Optional density observation, not a required repair',
   observation:'The overview of a larger gear train uses several upper-left hypothesis labels and a relatively shallow mechanism. Full-size review confirms that the wheels, pointing finger, and explicit exaggerated-model label remain readable.'},
   {frames:[7230],status:'Scoped partial subtitle overlap, main mechanism readable',
    observation:'Subtitle overlaps portions of lower input wheels/base, not the front tens wheel, falling weighted arm, or result cards used for this explanation. Do not claim zero overlap.'}],
  noNewRequiredVisualRepairIdentifiedInThisScope:true,allOriginalAutomaticThresholdsSatisfiedNotAsserted:true},
 oldAttributionHandling:{oldParentAndTeamAttestationsEdited:false,oldContextErrorErased:false,
  current162PersonallyViewedNow:true,rootNotReassignedAsViewer:true,
  scopeResolution:'The 157 byte-identical middle-scope images now also have direct personal viewing by this reviewer. The five changed images were already in the new36 root review; they were additionally viewed here. No image count is added to the 511-frame union.'},
 independentReuseCountCheck:{old478SameCurrentJpeg:473,old478ChangedCurrentJpeg:5,
  additionalPriorRootDominoSameJpegFrames:extra.map(x=>({frame:x.frame,file:x.file,sha256:x.sha256,priorFile:x.priorActualFile,priorSha256:x.priorActualSha256})),
  totalExistingReuseCandidates:475,newCurrentIndexFrames:36,currentUnion:511,
  middleSupplementDoesNotIncreaseCurrentUnion:true},
 limits:{earsVerified:false,continuousVideoPlaybackViewed:false,all30fpsViewed:false,
  onlyThisScopePersonallyReviewed:true,noEntire511PersonalReviewClaim:true,
  noAutomaticFinalApproval:true,allOriginalMechanicalGatesUnchanged:true,
  historicalScriptDifferencesNotResolvedByThisImageReview:true},
 sourceHelper:m.sourceHelper,sourceHelperSha256:m.sourceHelperSha256,
 recordSerializer:path.resolve(new URL(import.meta.url).pathname),recordSerializerSha256:sha(new URL(import.meta.url)),
 noGpu:true,noVideoDecode:true,noEncode:true,existingFilesEdited:false,commitOrPushPerformed:false};
const out=path.join(W,'outputs/axes-20261023/c1-final-v4-middle019-036-current162-personal-review-20261025.json');
assert(!fs.existsSync(out));fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({receipt:out,sha256:sha(out),pages:18,frames:162,newRequiredVisualRepairs:0,earsVerified:false}));
