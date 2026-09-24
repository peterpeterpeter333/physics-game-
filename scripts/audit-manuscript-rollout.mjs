// Read-only comparison of supplied manuscript requirements, compiled plan,
// local catalog and last fetched origin/main. Does not render or publish.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='docs/video-revision-20260924',read=f=>JSON.parse(readFileSync(f));
const remoteRef=execFileSync('git',['rev-parse','origin/main'],{encoding:'utf8'}).trim();
const fromGit=f=>JSON.parse(execFileSync('git',['show',`${remoteRef}:${f}`],{maxBuffer:25e6,encoding:'utf8'}));
const catalogs=load=>new Map(['lesson','em','prerequisite','revised','insert'].flatMap(k=>load(`src/content/${k}-video-catalog.generated.json`)).map(c=>[c.id,c]));
const local=catalogs(read),remote=catalogs(fromGit),plan=read(`${root}/full-plan.generated.json`),queue=read(`${root}/revision-queue.generated.json`),ledger=read(`${root}/import-ledger.generated.json`);
const text=c=>c?.scenes.map(s=>s.narration).join('')??'';
const normalize=s=>s.replace(/\s+/g,'');
const signature=c=>JSON.stringify(c?.scenes.map(s=>[s.narration,s.utterances?.map(u=>[u.subtitle,u.reading])])??null);
const sources=ledger.documents.map(d=>({file:d.file,hashMatches:createHash('sha256').update(readFileSync(`${root}/sources/${d.file}`)).digest('hex')===d.sha256}));
const requirements=queue.modifications.map(q=>{
 const matches=c=>q.pairs.every(p=>normalize(text(c)).includes(normalize(p.subtitle)));
 return {id:q.id,scene:q.scene,source:q.source,operation:q.operation,localWordingPresent:matches(local.get(q.id)),remoteWordingPresent:matches(remote.get(q.id)),status:matches(local.get(q.id))?'wording-found-needs-visual-review':'needs-reconciliation',requiredSubtitles:q.pairs.map(p=>p.subtitle)};
});
const clips=plan.map(c=>{
 const l=local.get(c.id),r=remote.get(c.id),path=`public/media/${c.mediaDirectory}/${c.id}`;
 const same=l&&signature(l)===signature(c),published=r&&signature(r)===signature(c);
 return {id:c.id,title:c.title,kind:c.kind??(c.id.startsWith('prep-')?'prerequisite':'main'),localCatalog:!!l,remoteCatalog:!!r,localScriptMatchesPlan:!!same,remoteScriptMatchesPlan:!!published,localMediaPresent:['json','jpg','mp4'].every(ext=>existsSync(`${path}.${ext}`)),status:published?'remote-script-matches':same?'local-only-script-match':l?'replacement-pending':'addition-pending',visualReview:'not-certified-by-this-audit'};
});
const plannedRoutes=read(`${root}/full-routes.generated.json`),liveInserts=read('src/content/insert-routes.generated.json'),livePreps=read('src/content/prerequisite-routes.generated.json');
const routing=[...Object.entries(plannedRoutes.inserts).map(([id,wanted])=>({type:'insert',id,wanted,current:liveInserts[id]??[]})),...Object.entries(plannedRoutes.prerequisites).map(([id,wanted])=>({type:'prerequisite',id,wanted,current:livePreps[id]??null}))].filter(r=>JSON.stringify(r.wanted)!==JSON.stringify(r.current));
const count=key=>clips.filter(c=>c.status===key).length;
const summary={sourceDocuments:sources.length,sourceHashFailures:sources.filter(s=>!s.hashMatches).length,plannedClips:clips.length,remoteScriptMatches:count('remote-script-matches'),localOnlyScriptMatches:count('local-only-script-match'),replacementPending:count('replacement-pending'),additionPending:count('addition-pending'),manuscriptRequirements:requirements.length,wordingNeedsReconciliation:requirements.filter(r=>!r.localWordingPresent).length,routeDifferences:routing.length};
const caveats=['origin/main is the last fetched Git reference, not live deployment verification.','Exact wording comparison flags both omissions and intentional rewrites; it cannot decide semantic equivalence.','Matching catalog text does not prove narration, math animation or placement quality.','Later user instructions override old automatic insertion: navigation must remain manual.'];
writeFileSync(`${root}/manuscript-rollout-audit.generated.json`,JSON.stringify({remoteRef,summary,caveats,sources,clips,requirements,routing},null,2));
const rows=clips.map(c=>`|${c.id}|${c.title.replaceAll('|','／')}|${c.status}|`);
writeFileSync(`${root}/台本反映チェック一覧.md`,[
 '# 差し替え台本の反映チェック（第1段階）','',
 `比較対象：差し替え台本9ファイル、現在の計画${summary.plannedClips}本、ローカルと前回取得した origin/main（${remoteRef.slice(0,8)}）。`,'',
 '## 集計','',
 `- リモート参照のカタログと計画の台本が一致：${summary.remoteScriptMatches}本`,
 `- ローカルのみ一致：${summary.localOnlyScriptMatches}本`,
 `- 既存動画の差し替えが必要：${summary.replacementPending}本`,
 `- 新規追加が必要：${summary.additionPending}本`,
 `- 原稿中の修正指示：${summary.manuscriptRequirements}件。字幕の原文一致が見つからず要照合：${summary.wordingNeedsReconciliation}件`,
 `- 挿入・前提経路の計画との差：${summary.routeDifferences}件`,'',
 'これは機械照合の一次一覧です。「一致」は完成判定ではありません。意図的な改稿と反映漏れを区別する内容点検、実映像・音声の検証が必要です。未一致の原文と出典行は隣のJSONに保存しています。','',
 '## 最新依頼を優先する共通条件','',
 '- Claudeの台本の説明・式・数値・新規追加を追跡する。演出のために削除しない。必要な最小修正は理由を記録する。',
 '- 3Blue1Brownを参考に、図で理由をつかみ、式の変化で導出を追う独自映像にする。',
 '- 一画面は図または式。図を説明する発話にはその図を必ず表示する。',
 '- 式変形の操作だけでなく目的も音声で説明する。',
 '- 標準0.9倍速、速度変更、音声と映像の同期を維持する。',
 '- 旧指示書の「自動で挟む」は採用しない。区切りで停止し、点・次へで手動移動する。',
 '- 初学者点検10点：配置と言葉／一定の速さと加速度／Δvの意味／相似と対応辺／時間で割る目的／極限への橋渡し／中心向きの理由／意味中心の音声／結果の解釈／図自体の大きさ。',
 '- 円運動固有の項目は、他単元では対応する「向き・幾何学的理由・極限・結果の意味」を点検する。無関係な内容を挿入しない。',
 '- 図欠落、字幕、読み、式、再生順を実動画と照合してから、単元単位で差し替え・pushする。バトルは残す。','',
 '## 動画単位の一覧','',
 '|動画ID|タイトル|一次判定|','|---|---|---|',...rows,'',
 'remote-script-matches：リモート参照の台本一致／local-only-script-match：ローカルのみ一致／replacement-pending：既存差し替え待ち／addition-pending：追加待ち',''
 ].join('\n'));
console.log(JSON.stringify(summary,null,2));
