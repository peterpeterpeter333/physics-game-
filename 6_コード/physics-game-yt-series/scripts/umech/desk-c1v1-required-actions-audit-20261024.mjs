// Explicit common§11 / individual§7 all43-row audit against the actual C17 candidate.
// New C19 repairs are listed as pending until new actual images and MP4 are viewed.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const W=new URL('../../',import.meta.url).pathname,R='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17';
const dir='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22',individual=dir+'/C-1/C-1_制作指示書.md',common=dir+'/07_軸の1本目_共通の制作指示.md';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const out=R+'/c1-required43-and-physical15-audit.json',md=W+'docs/video-revision-20260924/deep/C-1_全43行必須動作照合_20261024_ChatGPT.md';assert(!fs.existsSync(out)&&!fs.existsSync(md));
const D=read(R+'/blender/data.json'),I=read(R+'/actual-final-review/actual-final-index.json'),H=read(R+'/actual-final-review/c1-r17-human-qa.json');assert(H.allIndexedActualSamplesViewedByTeam&&I.uniqueFrames===1334);
const notes=[
 ['recorded-approved-pose-difference','帳簿6枚から1.5秒ごとに増加、筆記手/線/炎。冒頭と最後の同一静定姿勢を優先した既承認構図で、冒頭1.5秒の追加寄りは未実装と記録。'],
 ['present','役人の語で帽子の小さいhop。'],['present','反乱15.96から.8秒浮上、10体揺れ。R17は16.36まで紙と筆記手を保持し、10頭が見えてからcut。'],['present','群衆維持、小困り顔は元face。'],
 ['c19-real-framing-fix-pending','23枚の崩れ/回転/羽根ペン倒れは存在。全23枚の幅/切れをC19で補正予定。0–0は明瞭HUDを共通6.0の代替として採用し、個別の3D得点板起上がりは未実装と記録（root指示）。'],
 ['present','若い人形と考えましたの3D歯車回転。紙との配置関係は机上の固定配置、画では人物へ寄る。'],
 ['c19-required-reveal-pending','27/＋18は各語で既に表示。指定.6秒の筆記的revealだけ不足を確認し、新complete-frameで同じglyph/同じ語開始のclipを追加。'],
 ['present','15→5、赤い繰上がり1、7＋8＝15。'],['present','十位3→4、45と下線。'],['present','赤い1に赤丸、小じと目。'],
 ['present','箱を歯車の語で.8秒降下/小bounce、蓋開、00000。R16既知誤holdはsettled semantic状態へ新描画済。'],
 ['present','手が一位盤の縁を弧追従、0→1 .4秒、voice後0戻し。'],
 ['present','十位2回/一位7回、00027、語境界で手を十→一へ移すR16実修正済。'],
 ['present','指追従して7→8→9で停止。'],['present','9と盤に触れた手が停止、固定考え顔。'],['present','9→0、十位は2のまま？。'],
 ['present','0019→0020の一/十同時めくれ。'],['present','M2浮上/拡大、29から再説明、実接点N3が隣を押して30。'],['present','十位2→3黄、残り五刻み0→5と三つの札。'],
 ['present','M2沈降、手が十位一刻み35→45。'],['present','筆算上の1と1の黄、機械の十位窓黄、同じ答45。overlayのrow21分岐に両者の語時刻を確認。'],['present','同じ物と固定全画面ひらめき顔。'],
 ['present','消えましたで機械1、HUD0–1、点音。'],['present','45→全reset0 .4秒→9999 .6秒、手が一位に触れる。'],['present','模型静定/仮説札。'],['present','四つの接点黄が同時、五本の黄矢印同時。'],
 ['c19-real-framing-fix-pending','全8輪/支持枠、指±2mm10Hz/押込み、ひび.2秒は存在。209.5秒で実幅78.32%の本物の過大なので全8輪66%へ補正予定。'],
 ['present','8輪を消し5輪へ、不要手はR16新実画で除去、△/だから札。'],['present','7入直し→8→9、腕60*d/9で上昇、指は弧追従。'],['present','9→0で腕.15秒落下/跳返り、十位を押す。'],
 ['present','手を消して腕説明の三段札。R16が誤holdの不要手を除去済。'],['present','ししおどし給水/ゆっくり傾き→こぼれ→尻が石を打つ。'],['present','9999/4腕黄、右から.25秒差で4落下/10000、数と手の動きが対応。'],
 ['present-approved-face-exception','明示承認どおりcamera.8秒→8枚.81秒連倒→voiceEnd後顔1.19秒。原plan faceは不変、private描画だけ遅延。88実試写とC17 actualで因果確認。'],
 ['present','機械2、○札、0–2/点音。'],['c19-real-background-fix-pending','12台×3段＝36試作、左から.1秒差で置く。背景panelの実z-fightだけC19描画時1mm補正予定。'],['present','試作維持、固定小考え顔。'],
 ['c19-required-point-timing-pending','値札の揺れは高くてで正しい。しかし3D/HUD/低点音が結論前307.6527秒に人1を出す実欠陥。voiceEnd312.3177後+.15＝312.4677へ点を遅延、固定顔中はHUD無し、次cue313.7487で同文言HUD。'],
 ['present','開蓋M1内の歯車回転を継続。'],['present','同じM1/固定小じと目。'],['present','0→7→14→21、.4秒差。既存語/数の札のみ、もう一つの工夫の既存札読み返し。'],
 ['present','00999、3腕上、手が一位、答を示さず停止。別問題PNGだけ1000/3回。'],['present','冒頭と同じ帳簿/炎/姿勢、M1横、羽根ペン置いたまま。'],
];assert(notes.length===43);
const table=new Map();for(const line of fs.readFileSync(individual,'utf8').split('\n')){const m=line.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);if(m)table.set(+m[1],m.slice(2));}
const rows=notes.map(([status,note],i)=>{const row=i+1,cues=D.cues.filter(c=>c.row===row),frames=I.frames.filter(f=>cues.some(c=>f.time>=c.start&&f.time<c.end));assert(cues.length&&frames.length&&table.has(row));return {row,status,note,individualInstruction:table.get(row),cues:cues.map(c=>({key:c.key,start:c.start,voiceEnd:c.voiceEnd,end:c.end,words:c.words})),actualEncodedMp4Samples:frames.map(f=>({frame:f.frame,time:f.time,file:f.file,sha256:f.sha256})),teamActuallyViewedAllListedSamples:true,newC19ActualVerificationPending:status.includes('pending')};});
const physical15=[
 ...[32,32.5,33,33.5].map(time=>({time,role:'帳簿23枚の山/散布',width:38.7713664,clip:false,classification:'real-C19-fix',note:'最上面1枚38.77%を全群の代用にしない。実際に見える全23枚の群を40–70%へ。'})),
 {time:75.5,role:'一位入力盤と値窓（寄り導入）',width:12.514069,clip:false},{time:76,role:'同じ入力盤と窓',width:37.129544,clip:false},
 {time:82.5,role:'十/一の入力盤と対応値窓',width:113.664216,clip:true,note:'この旧値は外木箱全体。実像の0000/現在の盤と手は可視、未使用左盤/外箱の意図した寄り。'},
 {time:90.5,role:'18の説明から一位へ寄る入力盤/窓',width:22.0215536,clip:false},{time:91,role:'同じ盤/窓',width:33.8226178,clip:false},
 {time:119.5,role:'旧M1の文脈→浮上M2 pair',width:39.1714748,clip:false,note:'機械も119.41、出っぱり説明123.54以後。未浮上の次模型pairだけを現主役としない。'},
 {time:147.5,role:'沈降M2→M1十/一盤と値窓',width:96.184972,clip:true,note:'旧値は全木箱。0035/二つの現操作盤は可視、M2は1秒で縮んで沈む。'},
 {time:148,role:'同じ二入力盤/値窓',width:73.945780,clip:false,note:'旧値は全木箱。'},
 {time:185.5,role:'旧M1文脈→9999の全5輪浮上',width:36.1597666,clip:false,note:'ところが185.54、作る側186.33、9999 189.35。浮上前の次模型だけを現主役としない。'},
 {time:209.5,role:'全8歯車と必要支持枠',width:78.3194739,clip:false,classification:'real-C19-fix',note:'全8が真の主役なので実過大。C19で66%へ。'},
 {time:226.5,role:'旧M1文脈→腕付き一/十の二輪',width:20.3985756,clip:false,note:'歯車の横226.83より前、M2浮上中。'}
].map(p=>({...p,classification:p.classification??'legitimate-functional-focus-or-pre-explanation-context',notAutomaticPhysicalAcceptance:true,namedFunctionalAndSeparateContextMeasurementPending:!p.classification,note:(p.note??'説明前の入力盤への寄り。完成前の目標盤だけと現M1文脈を分離する。')+' C19 preflightは手/外木箱を水増しせず、named盤+対応窓/別M1文脈を実投影する。数値は元のprincipal定義であり再測定値ではない。'}));assert(physical15.length===15);
const report={date:new Date().toISOString(),baseCandidate:R,baseMp4Sha256:I.mp4Sha256,originalAllSevenChecksExitZero:true,originalGateNotWaived:true,all43RowsExplicitlyCompared:true,actualSamples:I.uniqueFrames,actualSampleReviewEvidence:R+'/actual-final-review/c1-r17-human-qa.json',humanEvidenceSha256:sha(R+'/actual-final-review/c1-r17-human-qa.json'),instructionSha256:{[individual]:sha(individual),[common]:sha(common)},sourceSha256:Object.fromEntries(['scripts/blender/desk_c1v1.py','scripts/umech/desk-c1v1-overlay.mjs','scripts/blender/desk_axes_c1_final_visible_bundle_r19.py','scripts/umech/desk-c1v1-complete-frame.mjs','scripts/umech/mix-chain-desk-audio-c1v1-r19.py'].map(f=>[W+f,sha(W+f)])),rows,physical15,c19ActualTrialPending:true,c19FinalMp4Pending:true,earsVerified:false,finalAcceptance:false};fs.writeFileSync(out,JSON.stringify(report,null,1));
const doc=['# C-1 全43行・必須の手と動き照合（2026-10-24）','','正本・台本・音声・字幕・planは変更しない。共通とC個別を全文再読し、既存source/53cueの語時刻/実MP41334抽出全149一覧の実視認を43行へ対応させた。全10814枚/耳の検収ではない。C17の元7検査は全exit0のまま保存。','','新規修正束は23枚の実framing、全8輪の実framing、背景panel実z-fight、行38の結論後加点、および行7の.6秒reveal。新試写と最終MP4は未確認。追加必須一覧はここで閉じ、以後は具体的な実欠陥のみ扱う。','','|行|状態|照合結果|','|---|---|---|',...rows.map(r=>`|${r.row}|${r.status}|${r.note}|`),'','## 物理候補15点の切分け','','この表の幅は旧principalによる値。実像に合うnamed機能部をC19で別計測し、外箱/手で水増ししない。自動免除はしない。','','|秒|役割|旧幅%|clip|分類|','|---|---|---|---|---|',...physical15.map(p=>`|${p.time}|${p.role}|${p.width.toFixed(4)}|${p.clip}|${p.classification}|`),'','全JSON：'+out,'','C17 pose由来全10814出力の俯瞰65°以上は835枚7.7215%（原画像推定14.8%とは別）。C19は全poseで20%以下を再assertする。',''];fs.writeFileSync(md,doc.join('\n'));console.log(JSON.stringify({out,md,rows:rows.length,physical15:physical15.length}));
