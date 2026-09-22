import {build} from 'esbuild';
import Module from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import mechanics from '../docs/video-scripts/high-school-mechanics.mjs';
import thermal from '../docs/video-scripts/high-school-thermal.mjs';
import waves from '../docs/video-scripts/high-school-waves.mjs';
import em from '../docs/video-scripts/high-school-em.mjs';
import atomic from '../docs/video-scripts/high-school-atomic.mjs';
import math from '../docs/video-scripts/university-math.mjs';
import univMechanics from '../docs/video-scripts/university-mechanics.mjs';
import bridges from '../docs/video-scripts/bridges.mjs';
import followups from '../docs/video-scripts/advanced-followups.mjs';
import reviewNotes from '../docs/video-scripts/review-notes.mjs';

export const levels=['intro','middle','advanced'];
export const levelNames={intro:'初級',middle:'中級',advanced:'上級'};
const sections=[['high-school-mechanics','高校範囲・力学',mechanics],['high-school-thermal','高校範囲・熱力学',thermal],['high-school-waves','高校範囲・波動',waves],['high-school-em','高校範囲・電磁気',em],['high-school-atomic','高校範囲・原子',atomic],['university-math','大学・数学',math],['university-mechanics','大学・力学',univMechanics]];
// The graph expresses knowledge prerequisites, not locked navigation or required completions.
const prerequisites={
 'm1-velocity':[], 'm1-acceleration':['m1-velocity'],'m1-uniform-accel':['m1-acceleration'],
 'm-freefall':['m1-uniform-accel','m-force'],'m-projectile':['m-freefall'],'m-force':['m1-acceleration'],
 'm-energy':['m-force'],'m-momentum':['m-force'],'m-circular':['m1-acceleration','m-force'],'m-shm':['m-energy'],
 't-heat':[],'t-gas':['t-heat'],'t-ideal':['t-gas'],'t-firstlaw':['t-ideal','m-energy'],
 'w-basics':['m-shm'],'w-sound':['w-basics'],'w-doppler':['w-basics'],'w-light':['w-basics'],'w-interference':['w-light','w-sound'],
 'e-current':[],'e-power':['e-current','m-energy'],'e-field':['m-force'],'e-capacitor':['e-field','e-current'],'e-magnet':['e-field','w-basics'],
 'a-photon':['w-interference','m-energy'],'a-bohr':['a-photon','m-circular','e-field'],'a-nucleus':['a-photon'],
 'um-derivative':['m1-velocity'],'um-integral':['m1-velocity'],'um-rules':['um-derivative'],
 'um-taylor':['um-rules'],'um-vector':[],'um-dot':['um-vector','m-energy'],'um-cross':['um-vector'],
 'um-ode':['um-derivative','um-integral'],'um-shm-ode':['um-ode','um-taylor'],
 'uc-newton':['um-derivative','um-integral','um-vector','m-force'],'uc-drag':['uc-newton','um-ode'],
 'uc-work':['uc-newton','um-dot'],'uc-potential':['uc-work','um-integral'],'uc-momentum':['uc-newton','um-integral'],
 'uc-angular':['uc-momentum','um-cross'],'uc-shm':['uc-newton','um-shm-ode'],
 'uc-rigid1':['uc-work','um-integral'],'uc-rigid2':['uc-rigid1','uc-angular'],
 'uc-frontier':['uc-newton','uc-angular'],
};
const bridgeAfter={
 'ui-curve-tiles':'um-integral','ui-through-a-surface':'um-vector','um-path-pieces':'um-vector','um-area-vector':'um-vector',
 'ui-motion-record':'um-derivative','ui-force-map':'uc-newton','ui-work-changing':'uc-work','ui-energy-change':'uc-work',
 'ui-turning-motion':'m-circular','um-newton-components':'uc-newton','um-work-sum':'uc-work','um-work-vector':'uc-work',
};
const bridgePrerequisites={
 'ui-curve-tiles':[], 'ui-through-a-surface':['um-vector'],
 'um-path-pieces':['um-vector'],'um-area-vector':['um-vector'],
 'ui-motion-record':[],'ui-force-map':['m-force'],'ui-work-changing':['m-energy'],
 'ui-energy-change':['m-energy'],'ui-turning-motion':['m1-acceleration'],
 'um-newton-components':['um-vector','m-force'],'um-work-sum':['um-integral','m-energy'],
 'um-work-vector':['um-vector','um-dot'],
};
const emConnections={
 'um-integral':['ui-work-bent-path','um-line-integral-entry','ue-integrals'],
 'um-dot':['ui-work-direction','um-line-element','ue-integrals'],
 'um-cross':['ui-magnetic-force','um-magnetic-force','ue-lorentz'],
 'um-ode':['ui-circuit-time','um-circuit-time','ue-transient'],
 'uc-work':['ui-electric-work-path','um-electrostatic-potential-path','ue-potential'],
 'ui-through-a-surface':['ui-flux-one-tile','um-em-area-vector','ue-integrals'],
 'um-area-vector':['ui-flux-one-tile','um-em-area-vector','ue-integrals'],
 'um-work-vector':['ui-electric-work-path','um-line-integral-entry','ue-integrals'],
 'e-field':['ui-field-map','um-gauss-sphere-preview','ue-gauss'],
 'e-capacitor':['ui-capacitance','um-capacitance','ue-capacitor'],
 'e-magnet':['ui-induction','um-induction','ue-faraday'],
};

export async function sourceInventory(){
 const bundle=await build({stdin:{contents:"export {chapters} from './src/content/index'; export {universityCurriculum} from './src/content/university-curriculum';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'cjs',packages:'external'});
 const m=new Module(path.resolve('.video-script-inventory.cjs'));m.paths=Module._nodeModulePaths(process.cwd());m._compile(bundle.outputFiles[0].text,m.id);
 return m.exports;
}
export async function makePlan(){
 const {chapters,universityCurriculum}=await sourceInventory();
 const topics=Object.fromEntries(universityCurriculum.map(t=>[t.id,t]));
 const sourceStages=chapters.flatMap(c=>c.stages.map(s=>({id:s.id,title:s.title,chapter:c.id,chapterTitle:c.title,level:c.level??'unclassified',headings:s.lesson.steps.map(p=>p.heading)})));
 const targetStages=sourceStages.filter(s=>!['uem','ui-em','um-em'].includes(s.chapter));
 const records=[];
 for(const [family,familyTitle,items] of sections)for(const topic of items)topic.levels.forEach((video,index)=>{
  const level=levels[index],placement=topics[topic.id];
  const stageId=placement?(index===0?placement.intro.id:index===1?placement.middle.id:topic.id):topic.id;
  records.push({id:`${topic.id}-${level}-draft`,topicId:topic.id,stageId,family,familyTitle,title:topic.title,level,condition:topic.condition,prerequisiteTopics:prerequisites[topic.id],...video});
 });
 for(const [family,familyTitle,list] of [['bridges','既存の橋渡し単元',bridges],['advanced-followups','長い導出を分けた続編',followups]])list.forEach((e,index)=>{
  records.push({id:`${e.stageId}-${family}-${index+1}`,topicId:e.stageId,stageId:e.stageId,family,familyTitle,title:e.title,level:e.level,condition:e.condition,prerequisiteTopics:family==='bridges'?bridgePrerequisites[e.stageId]:[e.stageId],...e.video});
 });
 // Explicit next questions: within a topic progress through levels, then offer a connected topic.
 for(const item of records){
  const previousLevel=levels[levels.indexOf(item.level)-1];
  const previous=records.find(r=>r.topicId===item.topicId&&r.family===item.family&&r.level===previousLevel);
  item.previousVideo=previous?{id:previous.id,question:previous.question}:null;
  const existingId=emConnections[item.topicId]?.[levels.indexOf(item.level)];
  const existingStage=sourceStages.find(s=>s.id===existingId);
  item.existingEMConnection=existingStage?{stageId:existingStage.id,title:existingStage.title}:null;
  const nextLevel=levels[levels.indexOf(item.level)+1];
  let next=records.find(r=>r.topicId===item.topicId&&r.level===nextLevel&&r.family===item.family);
  if(!next&&item.family!=='advanced-followups')next=records.find(r=>r.family==='advanced-followups'&&r.stageId===item.stageId);
  if(!next&&item.family==='advanced-followups'){
   const siblings=records.filter(r=>r.family===item.family&&r.stageId===item.stageId);next=siblings[siblings.indexOf(item)+1];
  }
  if(!next)next=records.find(r=>r.family!=='advanced-followups'&&r.prerequisiteTopics.includes(item.topicId)&&r.level===item.level);
  if(!next&&item.family==='bridges')next=records.find(r=>r.topicId===bridgeAfter[item.stageId]&&r.level===item.level);
  item.next=next?{id:next.id,question:next.question}:null;
  const horizontal=records.find(r=>r.family!=='advanced-followups'&&r.prerequisiteTopics.includes(item.topicId)&&r.level===item.level);
  item.sameLevelNext=horizontal?{id:horizontal.id,question:horizontal.question}:null;
  item.status='editorial-script';
  item.estimatedSeconds=Math.ceil(item.beats.reduce((n,b)=>n+[...b.speech].length,0)/5+item.beats.length*2);
  item.review={mode:'author-self-review',actualLearnerTest:false,criteria:['対象の明示','記号と図の対応','新しい語の意味','前提と結論の区別','問いへの回答','次の問いとの接続']};
  item.review.note=reviewNotes[item.topicId];
 }
 return {version:1,scope:'Existing non-university-EM chapters; topic-level draft, not a claim of complete slide-by-slide replacement',records,sourceStages:targetStages,preservedStages:sourceStages.filter(s=>['uem','ui-em','um-em'].includes(s.chapter)),prerequisites};
}

const out='docs/video-scripts';
const anchor=id=>id;
const row=s=>s.replaceAll('|','\\|').replaceAll('\n',' ');
function renderVideo(v,byId){
 const n=levelNames[v.level];
 let md=`<a id="${anchor(v.id)}"></a>\n\n## ${v.title}｜${n}\n\n**今回の問い：${v.question}**\n\n- 対応単元：\`${v.stageId}\`\n- 条件：${v.condition}\n- 台詞を読む時間の目安：約${v.estimatedSeconds}秒（合成音声で未計測。図を眺める時間や途中計算の間は別に確保し、動画をこの秒数に収めない）\n- 前提の話題：${v.prerequisiteTopics.length?v.prerequisiteTopics.map(id=>'`'+id+'`').join('、'):'四則演算・単位・図の目盛りから開始'}\n\n`;
 if(v.previousVideo){const previous=byId.get(v.previousVideo.id);md+=`**前に確かめたこと**：[${previous.question}](${previous.family}.md#${previous.id})\n\n`;}
 v.beats.forEach((b,i)=>{md+=`### 場面${i+1}：${['出発点と疑問','図と計算で確かめる','分かったことと次への橋渡し'][i]??'補足'}\n\n**音声・字幕**\n\n${b.speech}\n\n**映像指示**：${b.visual}\n\n`;if(b.equation)md+=`**表示式**：${b.equation}\n\n**記号の説明**：${b.symbols}\n\n`;});
 if(v.next){const next=byId.get(v.next.id);md+=`**${next.level!==v.level?'この話を深める問い':'次につながる問い'}**：[${v.next.question}](${next.family}.md#${next.id})\n\n`;}
 else md+='**接続の区切り**：この主題の区切り。次の別主題との因果関係を無理に作らず、章選択へ戻れる。\n\n';
 if(v.sameLevelNext&&v.sameLevelNext.id!==v.next?.id){const next=byId.get(v.sameLevelNext.id);md+=`**同じ難度で進む選択肢**：[${next.question}](${next.family}.md#${next.id})\n\n`;}
 if(v.existingEMConnection)md+=`**既存の大学電磁気で使う場所**：${v.existingEMConnection.title}（\`${v.existingEMConnection.stageId}\`）。既存動画はそのまま使い、この原稿では再生成しない。\n\n`;
 return md;
}

if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 const plan=await makePlan();mkdirSync(out,{recursive:true});
 writeFileSync(`${out}/plan.generated.json`,JSON.stringify(plan,null,2)+'\n');
 const byId=new Map(plan.records.map(r=>[r.id,r]));
 const families=[...new Set(plan.records.map(r=>r.family))];
 for(const family of families){const list=plan.records.filter(r=>r.family===family);writeFileSync(`${out}/${family}.md`,(`# ${list[0].familyTitle}：動画台本・構成\n\n動画制作に使用した台本。制作・検証の記録は [PRODUCTION.md](PRODUCTION.md) を参照。式は絵コンテ用の表記。\n\n`+list.map(v=>renderVideo(v,byId)).join('---\n\n')).trimEnd()+'\n');}
 let index='# 全分野の動画構成・台本\n\n動画制作に使用した編集済みの台本と絵コンテ。動画化・アプリ組み込みの手順は [PRODUCTION.md](PRODUCTION.md) を参照。既存の大学電磁気40単元の動画は保持する。App Store提出は今回の対象外。\n\n';
 index+=`## 対象\n\n既存${plan.sourceStages.length}単元に対応する${plan.records.length}本の初稿。高校27単元×3段階、大学数学・力学の既存69単元、長い導出の続編6本。これは全ての分野・既存単元への対応であり、既存の各スライドの全論点を台本化し終えたという意味ではない。[元教材との対照表](coverage.md)で追加制作の対象を残す。\n\n`;
 index+='## 読む順番\n\n初級は量と現象の意味、中級は具体例と計算、上級は導出・条件・限界を扱う。「上級」は各主題内の深さであり、高校上級と大学上級が同じ前提知識という意味ではない。難易度の追加は台本上のみで、アプリのステージを追加・削除していない。\n\n各動画は、一つの問いを図と計算で解決する。段階の名称を音声で繰り返さず、具体的な主語と対象で説明する。3場面は台本の初期構成であり、固定のスライド数ではない。式変形が読み切れない場面は分割する。\n\n';
 index+='| 分野 | 台本数 | 台本 |\n|---|---:|---|\n';
 for(const family of families){const list=plan.records.filter(r=>r.family===family);index+=`| ${list[0].familyTitle} | ${list.length} | [読む](${family}.md) |\n`;}
 index+='\n## 内容のつながり\n\n- 位置の記録 → 速度 → 加速度 → 力 → 仕事・エネルギー → 振動 → 波。\n- 温度と熱 → 気体の状態 → 気体の仕事 → 熱と仕事の収支。\n- 波の伝わり方 → 音・光 → 干渉 → 光子・物質波 → 原子のエネルギー。\n- 電流と電圧 → 電力／電場 → コンデンサ → 電磁誘導 → 既存の大学電磁気。\n- 変化率と和 → 微分と積分 → ベクトルと内積・外積 → 微分方程式 → 大学力学・既存の大学電磁気。\n\nこれらは知識の依存関係であり、クリア制限ではない。各動画の末尾には具体的な次の問いとリンクを置く。無関係な動画を「だから次へ」と機械的に結ばない。\n\n';
 index+='## 読みやすさ・制作上の基準\n\n[日本語と初学者目線の自己レビュー](review.md)を参照。初稿は執筆者による確認であり、実際の学生による理解度テスト済みではない。字幕は音声文をそのまま一括で出さず、文ごとに出す。記号の説明は初出で図の同じ場所に添える。時刻は音声を作るまで確定しない。\n\n新しい式には意味・記号・図の操作を指定。法則・定義・近似・導出を区別する。立体の向きが必要な場面は3Dを指定し、グラフや割り算は2Dを使う。視点だけの回転を現象の変化に見せない。音声の読み・実際の文字サイズ・数学組版は動画制作時に再検査する。\n\n';
 index+='## 編集方法\n\n同名の `.mjs` が手書き台本の原本。`node scripts/build-all-video-scripts.mjs` で閲覧用MarkdownとJSONを再生成する。`node scripts/test-all-video-scripts.mjs` で単元の対応・三段階・記号欄・依存関係・リンクを検査する。生成ファイルを直接編集しない。\n';
 writeFileSync(`${out}/README.md`,index);
 let coverage='# 元教材との対照表\n\n「単元対応」は、その単元の中心テーマを扱う初稿があるという意味。元教材の全ての式・問題・例が動画へ移ったという意味ではない。下記の元見出しは自動抽出であり、難しい日本語が含まれる場合も読み上げに流用しない。制作前に各見出しを「採用／他動画と統合／補足へ／別動画追加」に分類する。\n\n';
 for(const s of plan.sourceStages){const refs=plan.records.filter(r=>r.stageId===s.id);coverage+=`## ${s.title}（${s.id}）\n\n既存分野：${s.chapterTitle}／既存難易度：${s.level}\n\n台本：${refs.map(r=>`[${levelNames[r.level]}：${r.question}](${r.family}.md#${r.id})`).join(' ／ ')}\n\n元教材の論点（詳細照合は制作前に必要）：\n\n${s.headings.map((h,i)=>`${i+1}. ${h}`).join('\n')}\n\n`;}
 writeFileSync(`${out}/coverage.md`,coverage.trimEnd()+'\n');
 let review='# 日本語・初学者目線の自己レビュー\n\n想定する読み手は、物理と数学の基礎に不安がある大学1年生。学力の数値で理解力を決めつけず、「その量を初めて見る」「記号だけでは対象を思い出せない」「何を求めているかを見失いやすい」という具体的な困り方で確認した。執筆者の自己レビューであり、実際の学生による試読や第三者レビューではない。\n\n## 今回見つけて直した点\n\n初稿の全音声文を見直し、計算をする人や、変化する物理量の省略を修正した。1回目の60件は [編集履歴1](editorial-revisions.json)、今回の再確認で直した58件は [編集履歴2](editorial-revisions-round2.json) に残した。2回目では主語らしい助詞の有無だけでなく、「この差」「その値」「二つの式」が何を指すか、問いの日本語が自然か、用語と式の対象が一致するかを見直した。助詞の機械チェックも併用したが、助詞の存在を主語の正しさの証明にはしていない。\n\n## 全台本の確認記録\n\n各行の注意点は該当主題の3段階と続編で共通して確認するもの。主語・対象、記号、用語、前提、問いへの回答、次の接続を自己点検した。\n\n| 台本 | 難度 | 特に確認した混乱・対処 |\n|---|---|---|\n';
 for(const v of plan.records)review+=`| [${row(v.title)}](${v.family}.md#${v.id}) | ${levelNames[v.level]} | ${row(v.review.note)} |\n`;
 review+='\n## 動画制作前に必要な確認\n\n- 元教材の各論点と [対照表](coverage.md) を照合する。冒頭の一本で全内容を扱ったことにしない。\n- 実際の学習者に「何を求めた動画か」「各文字は何か」を自分の言葉で答えてもらう。\n- 音声の読みを確認する。例：電場＝でんば、磁場＝じば、力積＝りきせき、内積＝ないせき、外積＝がいせき。記号を機械的に綴り読みしない。\n- 図の数値と式と音声が一致するか、端末サイズで字幕と記号が読めるかを確認する。\n- 目安尺はおよそ毎秒5文字と場面の間からの推定。長い計算は説明速度を上げず、場面または動画を分ける。\n- 初級を読み終えた直後に上級へ自動で進めない。同じ難度の関連主題と、同じ主題を深める進み方を選べるようにする。\n';
 writeFileSync(`${out}/review.md`,review);
 console.log(JSON.stringify({sourceStages:plan.sourceStages.length,existingUniversityEMPreserved:plan.preservedStages.length,draftVideos:plan.records.length,beats:plan.records.reduce((n,v)=>n+v.beats.length,0),levels:Object.fromEntries(levels.map(l=>[l,plan.records.filter(r=>r.level===l).length]))},null,2));
}
