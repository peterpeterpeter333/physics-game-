// 「技術の疑問の鎖」（縦長 1080×1920、Blender の机の 3D、ys-chain-*）の自動品質検査。映像の質を落とさないための関門。
// 使い方：node scripts/umech/desk-quality-gate.mjs <ID> [--mp4 path] [--cache dir] [--ref ys-chain-1-1v6]
//            [--md 正本.md] [--script 台本.mjs] [--no-compare] [--no-voice-checks]
//   既定：--cache /private/tmp/ys/<ID>、--mp4 <cache>/out/<ID>.mp4、--ref ys-chain-1-1v6（見本の mp4 は /private/tmp/ys/<ref>/out/<ref>.mp4）
//   結果：表を出す。1つでも NG なら終了コード 1。JSON の報告は <cache>/quality-gate.json、見比べの画像は <cache>/gate/compare-NN.jpg
//
// 項目（判定の仕方の詳細は各関数の上）
//   1 はみ出し（SVG の外枠）／1b 画面の端の文字（mp4、参考）／2 36px 未満の文字／3 カメラが動く割合／4 真上の画の割合
//   5 同じ構図の長さ／6 壁か窓が映る割合／7 物が少ない画面の長さ／8 字幕の区切りの表示時間／9 音量と無音／10 冒頭と最後
//   11 既存の確認（chain-desk-lint・check-readings・prosody・prosody-speaker・qx-verify）／12 見本との見比べ画像（合否に使わない）
//
// 道具：ffmpeg（imageio_ffmpeg の物）と、numpy の入った python（physics-quest-tools の pyenv）。外部のパッケージは使わない。
// 画の数え方は desk-quality-gate-frames.py（同じフォルダ）。
import {readFileSync,writeFileSync,existsSync,mkdirSync,readdirSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';

// ======================= 閾値（見本 1-1 第6版 と ChatGPT 試作 ys-chain-1-1gpt で校正。2026-10-22） =======================
// 値の後ろの［］は、校正したときの 見本 v6 ／ 試作 gpt の値。
export const TH={
 // 1. はみ出し：SVG の文字と札（rect）の外枠が、この枠の中にあること。
 //    tol（文字）：見本の「見方」の札は x 36 から始まるので、4px を許すため 6px の余裕。
 //    tolRect（札の地の rect）：見本の年の札・得点の札（y 130 の pill、高さ 60）の地は y 100 から始まり、5:10 の紙の札（y 1570）の影は
 //    y 1614 まで出る。字は枠の中なので、地と影は 16px まで許す。
 //    顔の層（全画面の地の rect がある <g>、clip-path の付いた小さな顔の <g>）の中は見ない（顔の絵の腕は画面の外まで描く）。
 safe:{x0:40,x1:1040,y0:110,y1:1600},tol:6,tolRect:16,
 //    persist：同じ物が、この数以上の時刻ではみ出したときだけ数える。見本の得点の「1」は点が入る 0.5 秒だけ 1.5 倍にふくらみ、
 //    y 99 まで出る（一瞬の動き）。各 cue に 6 時刻あるので、置きっぱなしの札のはみ出しは 2 時刻以上に出る。
 persist:2,
 // 1c. 字が札の外へ：字のインク（sharp＝書き出しと同じ librsvg で実際に描いて測る）が、同じ <g> の札の地 rect の左右から出る量。
 //    cardTol px を越えた物を数え、「最大 cardMax px を越える」か「cardCount 個以上」で NG。
 //    見本にも 6:09「N ＝ M（NXXJ ＝ MEET）」の N が青い札から 14px 出る所がある（目で見ても出ている。見本の傷）。見本を合格にするため線は緩い。
 //    ［v6 3 個・最大 14px ／ gpt 8 個・最大 20px（6:20「QSNI → ARMY」、0:36「CAT → FDW」は Q・C が札の色の帯に重なる）］
 cardTol:2,cardMax:15,cardCount:5,
 svgSamples:[.03,.2,.4,.6,.8,.97],        // 各 cue の中の、SVG を作る時刻（cue の長さに対する割合）
 // 1b. mp4 の左右の端の帯（0〜40px、y 110〜1600）の「明るい字の縁」の数。参考（合否に使わない）：
 //    見本でも窓の光・紙の端・大写しの円板の文字が端にかかり、試作より多い（見本 13％ のコマ ／ 試作 0％、閾値 200 のとき）。
 edgeText:200,
 // 2. 文字の大きさ（SVG の font-size × 拡大）
 //    区切りの記号だけの text（「、」「→」など）は数えない：見本の計算の段（stepsRow）の区切りは size×0.8＝35.2px・32px。
 minFont:36,sepOnly:/^[\s、。，．・→←↑↓⇒\-–—…:：|｜\/／]+$/,
 // 3. カメラが動いている割合（blender/camera-motion.json の moving_ratio）。無ければ 3D のコマから推定（camMoveFrac：画面の塊の
 //    この割合以上が 0.5 秒で変わったら「動いている」）。［v6 0.124 ／ gpt 0.000（試作は切り替えだけで、動かない）］
 cameraMax:.20,camMoveFrac:.5,
 step:.5,                                  // コマを見る間隔（秒）
 // 4. 真上の画：カメラの姿勢がキャッシュに無いので、画から推定する。「画面の上 25％ が wood_top の割合以上 木目」かつ「壁の帯が無い」。
 //    ［v6 0.195（3D のコマ）／ 0.151（mp4）、gpt 0.666 ／ 0.500］
 overheadWoodTop:.9,overheadMax:.30,
 // 6. 壁か窓が映る画：画面の上 55％ に、行の 60％ 以上が「壁の色でぼけている」か「窓の光」の行が、画面の高さの wallBand 以上続く（上 15％ から始まる）。
 //    見本の 1-1 第6版でも、円板・紙・塔の大写しで壁が映らない時間が長く、目で数えても 5割に届かない（およそ 4〜5割）。
 //    そのため、合格の線は 5割ではなく 35％ にした。［v6 0.445（3D のコマ）／ 0.436（mp4）、gpt 0.165 ／ 0.183］
 wallBand:.03,wallMin:.35,
 // 5. 同じ構図の長さ：mp4 の 0.5 秒ごとのコマ（字幕の帯 capBand は除く）を 8×5 画素の塊にして、明るさが staticBlockDiff より変わった塊が
 //    staticBlocks 個未満なら「動いていない」。動いていない区間の最長が staticMax 秒以上で NG。札が1つ出る・指が少し動くだけでも「動き」になる。
 //    ［v6 最長 6.5 秒（4:42、5:41 の穴埋め）／ gpt 最長 8.0 秒（5:51 ほか 3 か所。cue の間ずっと何も動かない）］
 capBand:[.55,.75],staticBlockDiff:3,staticBlocks:2,staticMax:8.0,
 // 7. 物が少ない画面：3D のコマで「木目の色が sparseWood より多い」かつ「細かい模様が sparseBusy より少ない」が続く長さ。
 //    決まりは「2秒以上続けない」だが、見本の 1-1 第6版にも 3:22.5〜3:26 に 3.5 秒の空の机（E のタイルが出る前）がある。
 //    見本を合格にするため、線は 4.0 秒にした。［v6 最長 3.5 秒 ／ gpt 最長 14.5 秒（4:11）］
 sparseWood:.85,sparseBusy:.02,sparseMax:4.0,
 // 7b. 物の大きさ（2026-10-23 追加）：3D のコマで、ピントの合ったはっきりした模様が縦に続く列の、画面の横幅に対する割合（subject）。
 //    背景は被写界深度でぼけているので、主役の物の横幅の目安になる。決まり「物は画面の横幅の4〜7割」を数で見る。
 //    中央値が subjectMedian 以上、かつ subjectSmall 未満（小さく遠い画）のコマが subjectSmallMax 以下で合格。
 //    ［v6 中央値 0.72・小さい画 11％ ／ v5 0.60・14％ ／ 1-2 ChatGPT 第1版 0.46・39％（物が小さいと指摘した版）／ 1-2 Claude 第2版 0.50・29％ ／ 1-1 gpt-v3 0.39・32％］
 subjectMedian:.60,subjectSmall:.35,subjectSmallMax:.20,
 // 7c・7d（2026-10-26 追加）：場面のファイルが書き出す主役の外枠 <cache>/blender/primary.json（{"コマ番号":[x0,y0,x1,y1,"主役の名前"]}）と、
 //    撮影の表 <cache>/shot-plan.json（[{cue:"cue キー", word:"合わせる語（カナ。無ければ cue の真ん中）", occ:0, primary:"主役の名前", minWidth:.5}]）で測る。
 //    模様の推定（7b）と違い、主役の本当の横幅を測る。全画面の顔が出ている間は数えない。
 //    7c：0.5 秒ごとに、主役の外枠がある割合 primaryCover 以上、横幅の中央値 primaryMedian 以上、primarySmall 未満の画が primarySmallMax 以下、
 //        外枠が画面の外へ primaryClip より多くはみ出す画が primaryClipMax 以下。
 //    7d：撮影の表の各行で、合わせる語の時刻から primaryWin 秒の間に、その主役が minWidth 以上の横幅で映るコマがある。
 //    primary.json が無い回（1-1〜1-2・B-1〜E-1 の第1版）は参考（—）。--require-primary を付けると、無いことを NG にする。
 primaryCover:.90,primaryMedian:.50,primarySmall:.35,primarySmallMax:.15,primaryClip:.15,primaryClipMax:.05,primaryWin:1.5,
 // 8. 字幕の区切りの表示時間（区切りの始まり＝声がその区切りの最初のカナを言う時刻、終わり＝次の区切り、最後は cue の終わり）。
 //    chain-desk-lint.mjs と同じ数え方。決まりは「0.5 秒未満なし」だが、見本の 1-1 第6版にも 3:33.2「1つも」の 0.45 秒が1つある
 //    （chain-desk-lint も「0.5秒未満 1」と出す）。見本を合格にするため、下限は 0.4 秒にし、0.5 秒未満の数は表に出す。
 //    ［v6 中央値 1.34 秒・0.4 秒未満 0 個（0.5 秒未満 1 個）／ gpt も同じ声なので同じ］
 capMedian:[1.0,1.5],capMin:.4,capWarn:.5,
 // 9. 音量（ffmpeg ebur128 の integrated）と無音（silencedetect −35dB・0.25 秒）［v6 −14.4 LUFS・0 回 ／ gpt −14.2・0 回］
 lufs:-14,lufsTol:.5,silenceDb:-35,silenceSec:.25,
 // 10. 冒頭と最後：最初の endsSec 秒と最後の endsSec 秒の mp4 のコマ（字幕の帯と上の題の帯は除く）の「細かさの地図」（模様がどこにあるか）の
 //    相関の最大。色の分布は、どちらも机と紙の色で似てしまい（v6 0.94 ／ gpt 0.96）見分けられないので、模様の位置で見る。
 //    ［v6 0.768（記号の手紙に戻る）／ gpt 0.247（冒頭は記号の手紙、最後は「JVX → THE」の紙）］
 endsSec:2.0,endsMin:.5,
};
// ====================================================================================================================

const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../..');
const HOME=os.homedir();
const FF=process.env.FFMPEG??path.join(HOME,'Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1');
const PY=process.env.PQ_PYTHON??path.join(HOME,'Library/Application Support/physics-quest-tools/pyenv/bin/python');

// ---------- 引数 ----------
const argv=process.argv.slice(2);
const opt=k=>{const i=argv.indexOf(k);return i>=0?argv[i+1]:undefined;};
const flag=k=>argv.includes(k);
const VALUED=['--mp4','--cache','--ref','--md','--script'];
const ID=argv.find((a,i)=>!a.startsWith('--')&&!(i>0&&VALUED.includes(argv[i-1])));
if(!ID){console.error('使い方：node scripts/umech/desk-quality-gate.mjs <ID> [--mp4 path] [--cache dir] [--ref ys-chain-1-1v6]');process.exit(2);}
const CACHE=path.resolve(opt('--cache')??`/private/tmp/ys/${ID}`);
const MP4=opt('--mp4')?path.resolve(opt('--mp4')):path.join(CACHE,'out',ID+'.mp4');
const REF=opt('--ref')??'ys-chain-1-1v6';
const REFMP4=existsSync(REF)&&REF.endsWith('.mp4')?REF:`/private/tmp/ys/${REF}/out/${REF}.mp4`;
process.env.EM_FILM_CACHE=CACHE;

const results=[];
const add=(no,name,status,value,rule,detail)=>{results.push({no,name,status,value,rule,detail});};
const sh=(cmd,args,o={})=>spawnSync(cmd,args,{encoding:'utf8',maxBuffer:1<<28,...o});
const f1=x=>typeof x==='number'?Number(x.toFixed(3)):x;
const mmss=t=>`${Math.floor(t/60)}:${(t%60).toFixed(1).padStart(4,'0')}`;
const readJSON=f=>JSON.parse(readFileSync(f,'utf8'));

// ---------- 字幕の時刻つきの clip（mxr-review.mjs と同じ組み立て） ----------
let clip=null;
try{
 const base=readJSON(path.join(CACHE,'plan.json'))[0];
 const a=readJSON(path.join(CACHE,ID+'.json'));
 clip={...base,duration:a.duration,scenes:base.scenes.map((s,i)=>({...s,start:a.scenes[i].start,end:a.scenes[i].end,captions:a.scenes[i].captions}))};
}catch(e){console.log(`（plan.json か ${ID}.json が読めない：${e.message}）`);}
const duration=clip?.duration??(()=>{const m=/Duration: (\d+):(\d+):([\d.]+)/.exec(sh(FF,['-i',MP4]).stderr);return m?+m[1]*3600+ +m[2]*60+ +m[3]:0;})();

// =============== 1・2. SVG のはみ出しと文字の大きさ ===============
// 描画の仕組み（frame-vert.mjs → desk-frame.mjs → 各回の overlay）を、各 cue の TH.svgSamples の時刻で呼んで SVG を得る。
// 机の JPEG（<image>）と defs を除き、<g> の transform・opacity をたどって、text と rect の外枠を画面の座標で求める。
//  - text の外枠：その text だけを sharp（書き出しと同じ librsvg）で実際に描き、インクの左右上下を測る（字体の本当の幅）。
//    overlay の札の幅は「半角 0.55」で見積もっているが、太字の英大文字は 0.7 前後あり、札からはみ出すことがある
//  - 札からのはみ出し：text と同じ <g> の中で、text の位置を含む rect（札の地）があれば、字のインクが札の左右に収まること（±cardTol）
//  - opacity が 0.05 未満の物（消えている途中）は見ない。画面の 9割以上の大きさの rect（背景、顔の全画面の地）は見ない
//  - font-size は transform の拡大をかけた値
const AFF={id:[1,0,0,1,0,0]};
const mul=(m,n)=>[m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]];
function parseTransform(s){
 let m=AFF.id;if(!s)return m;
 for(const [,fn,args] of s.matchAll(/(\w+)\s*\(([^)]*)\)/g)){
  const a=args.trim().split(/[\s,]+/).map(Number);let n=AFF.id;
  if(fn==='translate')n=[1,0,0,1,a[0]||0,a[1]||0];
  else if(fn==='scale')n=[a[0],0,0,a[1]??a[0],0,0];
  else if(fn==='rotate'){const r=a[0]*Math.PI/180,c=Math.cos(r),s2=Math.sin(r),cx=a[1]||0,cy=a[2]||0;n=mul(mul([1,0,0,1,cx,cy],[c,s2,-s2,c,0,0]),[1,0,0,1,-cx,-cy]);}
  else if(fn==='matrix')n=a;
  m=mul(m,n);
 }
 return m;
}
const attrs=s=>{const o={};for(const [,k,v] of s.matchAll(/([\w:-]+)="([^"]*)"/g))o[k]=v;return o;};
const jwChar=(c,mono)=>/[ -~]/.test(c)?(mono?.6:.55):1;
let sharpMod=null;const inkCache=new Map();
async function ink(it){   // text を1つだけ描いて、インクの外枠を（x, y）からの差で返す（拡大前の単位）
 const k=[it.s,it.fs,it.weight,it.family,it.anchor].join('|');if(inkCache.has(k))return inkCache.get(k);
 let r=null;
 try{
  if(!sharpMod)sharpMod=createRequire(path.join(ROOT,'package.json'))('sharp');
  const W=Math.ceil(Math.max(400,[...it.s].length*it.fs*1.4+200)),X=W/2,H=Math.ceil(it.fs*2.2),Y=Math.round(it.fs*1.5);
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/><text x="${X}" y="${Y}" font-family="${it.family||'Hiragino Sans'}" font-size="${it.fs}" font-weight="${it.weight}" text-anchor="${it.anchor}" fill="#000">${esc(it.s)}</text></svg>`;
  const {info}=await sharpMod(Buffer.from(svg)).trim({background:'#ffffff',threshold:40}).toBuffer({resolveWithObject:true});
  const l=-(info.trimOffsetLeft??0)-X,t=-(info.trimOffsetTop??0)-Y;r={l,r:l+info.width,t,b:t+info.height};
 }catch(e){r=null;if(!ink.warned){ink.warned=1;console.log('（sharp で字を測れない。半角 0.55 の見積もりを使う：'+e.message.slice(0,120)+'）');}}
 inkCache.set(k,r);return r;
}
const unesc=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
function boxOf(m,x0,y0,x1,y1){const pts=[[x0,y0],[x1,y0],[x0,y1],[x1,y1]].map(([x,y])=>[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]);
 return [Math.min(...pts.map(p=>p[0])),Math.min(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[0])),Math.max(...pts.map(p=>p[1]))];}
export function svgItems(svg){
 svg=svg.replace(/<image\b[^>]*>/g,'').replace(/<defs>[\s\S]*?<\/defs>/g,'').replace(/<clipPath\b[\s\S]*?<\/clipPath>/g,'').replace(/<style>[\s\S]*?<\/style>/g,'');
 const out=[];let gid=0;const stack=[{m:AFF.id,op:1,fs:null,anchor:null,family:'',weight:'400',id:0}];let txt=null;
 for(const tok of svg.matchAll(/<(\/?)([a-zA-Z]+)([^>]*?)(\/?)>|([^<]+)/g)){
  const [,close,tag,rest,self,text]=tok;const top=stack.at(-1);
  if(text!==undefined){if(txt)txt.s+=unesc(text);continue;}
  if(close){if(tag==='text'&&txt){out.push(txt);txt=null;}if(tag==='g'||tag==='svg'||tag==='text'||tag==='tspan')stack.length>1&&stack.pop();continue;}
  const a=attrs(rest);
  const m=mul(top.m,parseTransform(a.transform));const op=top.op*(a.opacity!==undefined?+a.opacity:1);
  const fs=a['font-size']!==undefined?+a['font-size']:top.fs;const anchor=a['text-anchor']??top.anchor;const family=a['font-family']??top.family;const weight=a['font-weight']??top.weight;
  if(tag==='g'||tag==='svg'){if(!self)stack.push({m,op,fs,anchor,family,weight,skip:top.skip||!!a['clip-path'],id:++gid});continue;}
  if(tag==='tspan'){if(!self)stack.push({...top});continue;}
  if(top.skip){if(tag==='text'&&!self)stack.push({m,op,fs,anchor,family,weight,skip:true,id:top.id});continue;}
  if(tag==='text'){const x=+(a.x??0),y=+(a.y??0);txt={kind:'text',m,op,fs:fs??16,anchor:anchor??'start',family,weight:weight??'400',mono:/Menlo|Monaco|mono/i.test(family),x,y,s:'',gid:top.id,idx:out.length};
   if(!self)stack.push({m,op,fs,anchor,family,weight,skip:top.skip,id:top.id});else{out.push(txt);txt=null;}continue;}
  if(tag==='rect'){const w=+(a.width??0),h=+(a.height??0),x=+(a.x??0),y=+(a.y??0);
   if(w>=1080*.9&&h>=1920*.5){if(stack.length>1&&/url\(#fbg/.test(a.fill??''))top.skip=true;continue;}   // 背景・顔の全画面の地
   out.push({kind:'rect',m,op,box:boxOf(m,x,y,x+w,y+h),w,h,fill:a.fill,gid:top.id,idx:out.length});}
 }
 for(const it of out)if(it.kind==='text'){
  const w=[...it.s].reduce((v,c)=>v+jwChar(c,it.mono),0)*it.fs;
  const x0=it.anchor==='middle'?it.x-w/2:it.anchor==='end'?it.x-w:it.x;
  it.box=boxOf(it.m,x0,it.y-.9*it.fs,x0+w,it.y+.15*it.fs);
  it.size=it.fs*Math.sqrt(Math.abs(it.m[0]*it.m[3]-it.m[1]*it.m[2]));
 }
 return out;
}
// インクの外枠で text の box を置き換え、同じ <g> の札（rect）を探す
async function refine(items){
 for(const it of items){if(it.kind!=='text'||!it.s.trim()||it.op<.05)continue;
  const k=await ink(it);if(!k)continue;
  it.box=boxOf(it.m,it.x+k.l,it.y+k.t,it.x+k.r,it.y+k.b);it.measured=true;
  const cx=(it.box[0]+it.box[2])/2,cy=(it.box[1]+it.box[3])/2;
  const card=items.filter(r=>r.kind==='rect'&&r.gid===it.gid&&r.idx<it.idx&&r.op>=.05&&r.fill!=='none'&&r.h<300&&r.box[0]<=cx&&cx<=r.box[2]&&r.box[1]<=cy&&cy<=r.box[3]).at(-1);
  if(card)it.card=card.box;
 }
 return items;
}
async function checkSvg(){
 if(!clip){add(1,'はみ出し（SVG）','NG','—','SVG を作れること','plan.json／字幕の時刻が無い');add(2,'36px 未満の文字','NG','—',`${TH.minFont}px 以上`,'SVG を作れない');return;}
 let vertFrame;
 try{({vertFrame}=await import(pathToFileURL(path.join(ROOT,'scripts/umech/frame-vert.mjs')).href));}
 catch(e){add(1,'はみ出し（SVG）','NG','—','SVG を作れること',`frame-vert.mjs が読めない：${e.message.slice(0,200)}`);add(2,'36px 未満の文字','NG','—','','同上');return;}
 const S=TH.safe,T=TH.tol;const over=new Map(),small=new Map(),cardOver=new Map();let frames=0,errs=[];
 const cues=clip.scenes.flatMap(s=>s.cues.map((q,i)=>({s,q,cap:s.captions[i]})));
 const times=[];cues.forEach(({s,q,cap},ci)=>{for(const p of TH.svgSamples)times.push({s,q,ci,t:cap.start+(cap.end-cap.start)*p});});
 times.unshift({s:clip.scenes[0],q:clip.scenes[0].cues[0],ci:0,t:.3},{s:clip.scenes[0],q:clip.scenes[0].cues[0],ci:0,t:1.2}); // 冒頭の題
 for(const {s,ci,t} of times){
  let svg;try{svg=vertFrame(clip,s,t);}catch(e){errs.push(`${mmss(t)} ${e.message.slice(0,120)}`);continue;}
  frames++;
  for(const it of await refine(svgItems(svg))){
   if(it.op<.05)continue;
   if(it.kind==='rect'&&(it.w>=1080*.9&&it.h>=1920*.5))continue;
   if(it.kind==='text'&&!it.s.trim())continue;
   const [x0,y0,x1,y1]=it.box;
   const label=it.kind==='text'?`「${it.s.trim().slice(0,24)}」`:`札 rect ${Math.round(it.w)}×${Math.round(it.h)}`;
   const tt=it.kind==='rect'?TH.tolRect:T;
   if(x0<S.x0-tt||x1>S.x1+tt||y0<S.y0-tt||y1>S.y1+tt){const k=label;if(!over.has(k))over.set(k,{t:+t.toFixed(2),cue:ci+1,what:label,box:it.box.map(v=>Math.round(v)),n:0});over.get(k).n++;}
   if(it.card){const o=Math.max(it.card[0]-x0,x1-it.card[2]);if(o>TH.cardTol){const k=label;const prev=cardOver.get(k);if(!prev||o>prev.px)cardOver.set(k,{t:+t.toFixed(2),cue:ci+1,what:label,px:Math.round(o),box:it.box.map(v=>Math.round(v)),card:it.card.map(v=>Math.round(v))});}}
   if(it.kind==='text'&&it.size<TH.minFont-.01&&!TH.sepOnly.test(it.s)){const k=`${ci}|${label}`;if(!small.has(k))small.set(k,{t:+t.toFixed(2),cue:ci+1,what:label,size:+it.size.toFixed(1)});}
  }
 }
 const all=[...over.values()],ov=all.filter(o=>o.n>=TH.persist),once=all.filter(o=>o.n<TH.persist),sm=[...small.values()],co=[...cardOver.values()].sort((a,b)=>b.px-a.px);
 const coMax=co[0]?.px??0,coNg=coMax>TH.cardMax||co.length>=TH.cardCount;
 add(1,'はみ出し（SVG：画面の枠）',ov.length||errs.length?'NG':'OK',`${ov.length} 件／${frames} コマ（一瞬だけ ${once.length}）`,`x ${S.x0}〜${S.x1}・y ${S.y0}〜${S.y1}（文字 ±${T}px・札の地 ±${TH.tolRect}px）`,
  [...ov.slice(0,12).map(o=>`${mmss(o.t)} cue ${o.cue} ${o.what} [${o.box.join(',')}] ${o.n} 時刻`),...once.slice(0,4).map(o=>`（一瞬・数えない）${mmss(o.t)} cue ${o.cue} ${o.what} [${o.box.join(',')}]`),...errs.slice(0,5).map(e=>'SVG を作れない：'+e)]);
 add('1c','はみ出し（SVG：字が札の外へ）',coNg?'NG':'OK',`${co.length} 個・最大 ${coMax}px`,`${TH.cardTol}px を越える物が ${TH.cardCount} 個未満、かつ最大 ${TH.cardMax}px 以下（見本で校正）`,co.slice(0,12).map(o=>`${mmss(o.t)} cue ${o.cue} ${o.what} ${o.px}px（字 x ${o.box[0]}〜${o.box[2]}／札 x ${o.card[0]}〜${o.card[2]}）`));
 add(2,'36px 未満の文字',sm.length?'NG':'OK',`${sm.length} 件`,`${TH.minFont}px 以上`,sm.slice(0,12).map(o=>`${mmss(o.t)} cue ${o.cue} ${o.what} ${o.size}px`));
}

// =============== 3〜7・10・1b. コマの画（python） ===============
function frameMetrics(){
 const desk=path.join(CACHE,'blender','desk');
 const args=[path.join(HERE,'desk-quality-gate-frames.py'),'--ff',FF,'--th',JSON.stringify(TH),'--dur',String(duration)];
 if(existsSync(MP4))args.push('--mp4',MP4);
 if(existsSync(desk))args.push('--desk',desk);
 if(process.env.GATE_NPZ)args.push('--npz',process.env.GATE_NPZ);
 const r=sh(PY,args,{timeout:1800000});
 if(r.status!==0){console.log(r.stderr.slice(-2000));return null;}
 return JSON.parse(r.stdout.trim().split('\n').at(-1));
}

// =============== 8. 字幕の区切りの表示時間 ===============
async function checkCaptions(){
 if(!clip)return add(8,'字幕の区切りの表示時間','NG','—','','字幕の時刻が無い');
 let chunkTimes;try{({chunkTimes}=await import(pathToFileURL(path.join(ROOT,'scripts/umech/desk-frame.mjs')).href));}catch(e){return add(8,'字幕の区切りの表示時間','NG','—','',e.message);}
 const durs=[];let inexact=0;
 for(const s of clip.scenes)s.cues.forEach((q,k)=>{const cap=s.captions[k];try{const {starts,exact}=chunkTimes(q,cap);if(!exact)inexact++;
  starts.forEach((a,i)=>durs.push({d:(i+1<starts.length?starts[i+1]:cap.end)-a,t:a,text:(q.cap?.[i]??[q.subtitle]).join('')}));}catch(e){inexact++;}});
 const v=durs.map(x=>x.d).sort((a,b)=>a-b);const med=v[Math.floor(v.length/2)]??0;const short=durs.filter(x=>x.d<TH.capMin),warn=durs.filter(x=>x.d<TH.capWarn);
 const ok=med>=TH.capMedian[0]&&med<=TH.capMedian[1]&&!short.length;
 add(8,'字幕の区切りの表示時間',ok?'OK':'NG',`中央値 ${med.toFixed(2)} 秒・${TH.capMin} 秒未満 ${short.length} 個（${TH.capWarn} 秒未満 ${warn.length}／${v.length} 個）`,`中央値 ${TH.capMedian.join('〜')} 秒、${TH.capMin} 秒未満なし（見本で校正）`,
  [...warn.slice(0,8).map(x=>`${mmss(x.t)} ${x.d.toFixed(2)} 秒「${x.text.slice(0,16)}」`),...(inexact?[`声と1文字ずつ合わない cue ${inexact} 個（時刻は割合で近似）`]:[])]);
}

// =============== 9. 音量と無音 ===============
function checkAudio(){
 if(!existsSync(MP4))return add(9,'音量・無音','NG','—','','mp4 が無い');
 const r=sh(FF,['-nostats','-i',MP4,'-vn','-af',`ebur128=framelog=quiet,silencedetect=n=${TH.silenceDb}dB:d=${TH.silenceSec}`,'-f','null','-']);
 const m=/Summary:[\s\S]*?I:\s*(-?[\d.]+) LUFS/.exec(r.stderr);const I=m?+m[1]:NaN;
 const st=[...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map(x=>+x[1]),en=[...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map(x=>+x[1]);
 const sil=st.map((a,i)=>[a,en[i]??duration]);
 const ok=Math.abs(I-TH.lufs)<=TH.lufsTol&&!sil.length;
 add(9,'音量・無音',ok?'OK':'NG',`${I} LUFS・無音 ${sil.length} 回`,`${TH.lufs}±${TH.lufsTol} LUFS、${TH.silenceDb}dB 以下 ${TH.silenceSec} 秒以上の無音 0 回`,sil.slice(0,8).map(([a,b])=>`${mmss(a)}〜${mmss(b)}`));
}

// =============== 11. 既存の確認 ===============
function existing(){
 const out=[];let anyNg=false;
 const plan=path.join(CACHE,'plan.json');
 // chain-desk-lint（正本が分かれば）
 const short=ID.replace(/^ys-/,'');
 const script=opt('--script')??path.join(ROOT,'docs/video-revision-20260924/ytseries',short+'.mjs');
 let md=opt('--md');
 if(!md&&existsSync(CACHE)){const c=readdirSync(CACHE).filter(f=>f.endsWith('.md')&&f.includes('正本'));if(c.length)md=path.join(CACHE,c[0]);}
 if(md&&existsSync(md)&&existsSync(script)){
  const r=sh('node',[path.join(ROOT,'scripts/umech/chain-desk-lint.mjs'),script,ID,md],{cwd:ROOT,env:{...process.env,EM_FILM_CACHE:CACHE},timeout:300000});
  const last=(r.stdout||'').trim().split('\n').at(-1);out.push(`chain-desk-lint：${r.status===0?'○':'×'} ${last}`);if(r.status!==0)anyNg=true;
 }else out.push(`chain-desk-lint：— 省略（${!existsSync(script)?'台本 '+path.basename(script)+' が無い':'正本が分からない（--md で渡す）'}）`);
 // 読み・アクセント（Nemo が要る。応答しなければ省略し、起動はしない）
 if(flag('--no-voice-checks'))out.push('check-readings・prosody・prosody-speaker：— 省略（--no-voice-checks）');
 else if(!existsSync(plan))out.push('check-readings・prosody：— plan.json が無い');
 else{
  const url=process.env.NEMO_URL??'http://127.0.0.1:50123';
  const alive=sh('curl',['-s','-m','3',url+'/version']).status===0;
  if(!alive)out.push(`check-readings・prosody・prosody-speaker：— 省略（Nemo ${url} が応答しない）`);
  else for(const [name,args] of [['check-readings',['check-readings.py',plan]],['prosody',['prosody.py',plan]],['prosody-speaker',['prosody-speaker.py',plan]]]){
   const r=sh('python3',[path.join(ROOT,'scripts/umech',args[0]),...args.slice(1)],{cwd:ROOT,env:{...process.env,NEMO_URL:url},timeout:900000});
   const tail=((r.stdout||'')+(r.stderr||'')).trim().split('\n').filter(Boolean).at(-1)??'';
   out.push(`${name}：${r.status===0?'○':'×'} 終了コード ${r.status}${tail?' … '+tail.slice(0,100):''}`);if(r.status!==0)anyNg=true;
  }
 }
 // qx-verify（report.txt があれば読む。無ければ走らせない）
 const rep=path.join(CACHE,'verify','report.txt');
 if(existsSync(rep)){const lines=readFileSync(rep,'utf8').split('\n').filter(Boolean);const ng=lines.filter(l=>l.startsWith('×'));const tri=lines.filter(l=>l.startsWith('△'));
  out.push(`qx-verify（report.txt）：${ng.length?'×':'○'} × ${ng.length}・△ ${tri.length}`);ng.slice(0,4).forEach(l=>out.push('   '+l));if(ng.length)anyNg=true;}
 else out.push('qx-verify：— report.txt が無い（走らせていない）');
 add(11,'既存の確認',anyNg?'NG':'OK',out.filter(l=>/：[○×]/.test(l)).length+' 本を確認','lint・読み・アクセント・qx-verify が通る',out);
}

// =============== 12. 見本との見比べ（合否に使わない） ===============
function compare(){
 if(flag('--no-compare'))return add(12,'見本との見比べ画像','—','省略','（合否に使わない）',[]);
 if(!existsSync(REFMP4)||!existsSync(MP4))return add(12,'見本との見比べ画像','—','作れない','（合否に使わない）',[`見本 ${REFMP4} か mp4 が無い`]);
 const dir=path.join(CACHE,'gate');rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
 const font='/System/Library/Fonts/Supplemental/Arial.ttf';
 const lab=(s,c)=>existsSync(font)?`,drawtext=fontfile=${font}:text='${s} %{eif\\:t\\:d}s':x=8:y=8:fontsize=22:fontcolor=${c}:box=1:boxcolor=black@0.6`:'';
 const fc=`[0:v]fps=1,scale=216:384${lab('REF','yellow')},tpad=stop=-1:stop_mode=add:color=black[a];[1:v]fps=1,scale=216:384${lab('TEST','white')}[b];[a][b]hstack=shortest=1,pad=iw+6:ih+6:3:3:gray,tile=6x2`;
 const r=sh(FF,['-v','error','-i',REFMP4,'-i',MP4,'-filter_complex',fc,'-fps_mode','passthrough','-q:v','4',path.join(dir,'compare-%02d.jpg')],{timeout:900000});
 const n=existsSync(dir)?readdirSync(dir).filter(f=>f.startsWith('compare-')).length:0;
 add(12,'見本との見比べ画像',r.status===0&&n?'—':'—',`${n} 枚`,'（合否に使わない）',[`${dir}/compare-NN.jpg：1枚に 12 秒（NN 枚目は ${'(NN−1)×12'} 秒から）。左＝見本 ${REF}、右＝${ID}`,...(r.status?[r.stderr.slice(0,300)]:[])]);
}

// =============== 7c・7d. 主役の外枠で測る大きさと、名前を言った物が映るか（2026-10-26 追加） ===============
async function checkPrimary(){
 const pf=path.join(CACHE,'blender','primary.json'),sf=path.join(CACHE,'shot-plan.json');
 const need=flag('--require-primary');
 if(!existsSync(pf)){add('7c','主役の大きさ（主役の外枠で測る）',need?'NG':'—','primary.json が無い','場面のファイルが毎コマの主役の外枠を書き出す',[pf]);add('7d','名前を言った物が映るか',need?'NG':'—','—','（primary.json が要る）',[]);return;}
 if(!clip){add('7c','主役の大きさ（主役の外枠で測る）','NG','—','','字幕の時刻が無い');return;}
 const P=readJSON(pf),W=1080,FPS=30;
 let C;try{C=await import(pathToFileURL(path.join(ROOT,'scripts/umech/yt1-chain-00bx-common.mjs')).href);}catch(e){add('7c','主役の大きさ（主役の外枠で測る）','NG','—','',e.message);return;}
 // cue の一覧と、全画面の顔の区間
 const cues=[],faces=[];
 for(const sc of clip.scenes)sc.cues.forEach((q,k)=>{const cap=sc.captions[k];const ctx={cue:q,t:0,dur:cap.end-cap.start};cues.push({q,cap,ctx,key:String(q.diagram??'')});
  const fc=q.face;if(fc&&!fc.small){let a=cap.start+(fc.a??0)*(cap.end-cap.start),b=cap.start+(fc.b??1)*(cap.end-cap.start);if(fc.at){try{a=cap.start+C.wt(ctx,fc.at);b=cap.end;}catch(e){}}faces.push([a-.05,b+.15]);}});
 const inFace=t=>faces.some(([a,b])=>t>=a&&t<=b);
 const box=j=>{const v=P[String(j)];return Array.isArray(v)&&v.length>=4?v:null;};
 const vis=v=>{const x0=Math.max(0,v[0]),x1=Math.min(W,v[2]);return Math.max(0,x1-x0)/W;};
 const clipped=v=>{const w=Math.max(1,v[2]-v[0]);return (Math.max(0,-v[0])+Math.max(0,v[2]-W))/w;};
 // 7c
 let n=0,have=0,small=0,clp=0;const ws=[],smallT=[],clipT=[],missT=[];
 for(let t=0;t<=duration;t+=TH.step){if(inFace(t))continue;n++;const v=box(Math.round(t*FPS));if(!v){missT.push(t);continue;}have++;const w=vis(v);ws.push(w);
  if(w<TH.primarySmall){small++;smallT.push(t);}if(clipped(v)>TH.primaryClip){clp++;clipT.push(t);}}
 ws.sort((a,b)=>a-b);const med=ws.length?ws[Math.floor(ws.length/2)]:0,cover=n?have/n:0,sr=have?small/have:1,cr=have?clp/have:1;
 const ok=cover>=TH.primaryCover&&med>=TH.primaryMedian&&sr<=TH.primarySmallMax&&cr<=TH.primaryClipMax;
 const runs=ts=>{const out=[];let a=null,p=null;for(const t of ts){if(a===null||t-p>TH.step+1e-6){if(a!==null)out.push([a,p-a+TH.step]);a=t;}p=t;}if(a!==null)out.push([a,p-a+TH.step]);return out.sort((x,y)=>y[1]-x[1]);};
 add('7c','主役の大きさ（主役の外枠で測る）',ok?'OK':'NG',`中央値 ${(med*100).toFixed(0)}％・小さい画 ${(sr*100).toFixed(1)}％・切れる画 ${(cr*100).toFixed(1)}％・外枠あり ${(cover*100).toFixed(0)}％`,
  `外枠あり ${TH.primaryCover*100}％以上、中央値 ${TH.primaryMedian*100}％以上、${TH.primarySmall*100}％未満が ${TH.primarySmallMax*100}％以下、切れる画 ${TH.primaryClipMax*100}％以下`,
  [...runs(smallT).slice(0,5).map(([a,d])=>`小さい画 ${mmss(a)}から ${d.toFixed(1)} 秒`),...runs(clipT).slice(0,3).map(([a,d])=>`画の外で切れる ${mmss(a)}から ${d.toFixed(1)} 秒`),...runs(missT).slice(0,3).map(([a,d])=>`外枠が無い ${mmss(a)}から ${d.toFixed(1)} 秒`)]);
 // 7d
 if(!existsSync(sf)){add('7d','名前を言った物が映るか',need?'NG':'—','shot-plan.json が無い','撮影の表を shot-plan.json にして置く',[sf]);return;}
 const plan=readJSON(sf),bad=[];let tested=0;
 const strip=k=>k.replace(/^c[a-z0-9]+-/,'');
 for(const r of plan){
  const c=cues.find(x=>x.key===r.cue||strip(x.key)===strip(String(r.cue)));
  if(!c){bad.push(`cue「${r.cue}」が台本に無い`);continue;}
  let t0;try{t0=c.cap.start+(r.word?C.wt(c.ctx,r.word,r.occ??0):(c.cap.end-c.cap.start)/2);}catch(e){bad.push(`cue「${r.cue}」：語「${r.word}」が声に無い`);continue;}
  tested++;let best=0,got='';
  for(let t=t0;t<=t0+TH.primaryWin+1e-6;t+=1/FPS){const v=box(Math.round(t*FPS));if(!v)continue;if(r.primary&&v[4]!==r.primary)continue;const w=vis(v);if(w>best){best=w;got=v[4];}}
  if(best<(r.minWidth??.5))bad.push(`${mmss(t0)} cue「${strip(c.key)}」${r.word?`「${r.word}」`:''}：主役「${r.primary}」の横幅 ${(best*100).toFixed(0)}％（${((r.minWidth??.5)*100).toFixed(0)}％ 以上が要る）${best===0?'・映っていない':''}`);
 }
 add('7d','名前を言った物が映るか（撮影の表）',bad.length?'NG':'OK',`${plan.length} 行中 ${bad.length} 行が足りない（声の時刻で測れた行 ${tested}）`,`各行：合わせる語から ${TH.primaryWin} 秒の間に、主役が表の横幅以上で映る`,bad.slice(0,12));
}

// =============== 実行 ===============
console.log(`品質検査 ${ID}\n  mp4   ${MP4}${existsSync(MP4)?'':'（無い）'}\n  cache ${CACHE}\n  見本  ${REF}`);
await checkSvg();
const fm=frameMetrics();
if(!fm){for(const [no,n] of [[3,'カメラが動く割合'],[4,'真上の画の割合'],[5,'同じ構図の長さ'],[6,'壁か窓が映る割合'],[7,'物が少ない画面の長さ'],[10,'冒頭と最後の画']])add(no,n,'NG','—','','コマを読めない');}
else{
 const src=fm.world_source==='desk'?'3D のコマ':'mp4 から推定';
 if(fm.edge_ratio!==undefined)add('1b','画面の端の文字（mp4・参考）','—',`${(fm.edge_ratio*100).toFixed(1)}％ のコマ`,`端 0〜40px の明るい字の縁 ${TH.edgeText} 以上（合否に使わない）`,fm.edge_times.length?['例 '+fm.edge_times.map(mmss).join('、')]:[]);
 // 3 カメラ
 const cm=path.join(CACHE,'blender','camera-motion.json');
 if(existsSync(cm)){const j=readJSON(cm);const r=j.moving_ratio??(j.moving_frames/j.frames);add(3,'カメラが動く割合',r<=TH.cameraMax?'OK':'NG',`${(r*100).toFixed(1)}％`,`${TH.cameraMax*100}％ 以下`,[`camera-motion.json（${j.moving_frames}/${j.frames} コマ）${j.method?' 方法：'+j.method:''}`]);}
 else if(fm.camera_est_ratio!==undefined)add(3,'カメラが動く割合',fm.camera_est_ratio<=TH.cameraMax?'OK':'NG',`${(fm.camera_est_ratio*100).toFixed(1)}％（推定）`,`${TH.cameraMax*100}％ 以下`,['camera-motion.json が無いので、画面の大部分が変わる 0.5 秒の割合で推定（切り替えも数える）']);
 else add(3,'カメラが動く割合','NG','—','','データが無い');
 if(fm.world_source){
  add(4,'真上の画の割合',fm.overhead_ratio<=TH.overheadMax?'OK':'NG',`${(fm.overhead_ratio*100).toFixed(1)}％`,`${TH.overheadMax*100}％ 以下`,[`${src}で推定（カメラの姿勢はキャッシュに無い）：画面の上 25％ が木目、かつ壁の帯なし`]);
  add(6,'壁か窓が映る割合',fm.wall_ratio>=TH.wallMin?'OK':'NG',`${(fm.wall_ratio*100).toFixed(1)}％`,`${TH.wallMin*100}％ 以上（見本で校正）`,[`${src}で推定：画面の上に、壁の色でぼけた帯か窓の光が、横いっぱいに続く`]);
  if(fm.subject_median!==undefined)add('7b','物の大きさ（主役の横幅）',fm.subject_median>=TH.subjectMedian&&fm.subject_small_ratio<=TH.subjectSmallMax?'OK':'NG',`中央値 ${(fm.subject_median*100).toFixed(0)}％・小さい画 ${(fm.subject_small_ratio*100).toFixed(1)}％`,`中央値 ${TH.subjectMedian*100}％ 以上、${TH.subjectSmall*100}％ 未満の画が ${TH.subjectSmallMax*100}％ 以下`,[`${src}で推定：ピントの合った模様が縦に続く列の横幅`,...fm.subject_small_runs.filter(r=>r[1]>=3).map(([a,d])=>`小さい画 ${mmss(a)}から ${d} 秒`)]);
  add(7,'物が少ない画面の長さ',fm.sparse_longest<TH.sparseMax?'OK':'NG',`最長 ${fm.sparse_longest} 秒`,`${TH.sparseMax} 秒未満（見本で校正）`,fm.sparse_runs.filter(r=>r[1]>=1).map(([a,d])=>`${mmss(a)}から ${d} 秒`));
 }
 if(fm.static_longest!==undefined){
  add(5,'同じ構図の長さ（何も動かない）',fm.static_longest<TH.staticMax?'OK':'NG',`最長 ${fm.static_longest} 秒`,`${TH.staticMax} 秒未満`,fm.static_runs.filter(r=>r[1]>=4).map(([a,d])=>`${mmss(a)}から ${d} 秒`));
  add(10,'冒頭と最後の画',fm.ends_corr>=TH.endsMin?'OK':'NG',`相関 ${fm.ends_corr}`,`${TH.endsMin} 以上`,[`最初と最後の ${TH.endsSec} 秒の「模様の位置」の相関の最大（参考：色の相関 ${fm.ends_color_corr}）`]);
 }else{add(5,'同じ構図の長さ（何も動かない）','NG','—','','mp4 が無い');add(10,'冒頭と最後の画','NG','—','','mp4 が無い');}
}
await checkPrimary();
await checkCaptions();
checkAudio();
existing();
compare();

// ---------- 表 ----------
const order=r=>parseFloat(String(r.no))+({b:.3,c:.6,d:.8}[String(r.no).slice(-1)]??0);
results.sort((a,b)=>order(a)-order(b));
const pad=(s,w)=>{s=String(s);const W=[...s].reduce((v,c)=>v+(/[ -~]/.test(c)?1:2),0);return s+' '.repeat(Math.max(0,w-W));};
console.log('\n'+pad('No',4)+pad('項目',34)+pad('判定',6)+pad('値',40)+'基準');
console.log('-'.repeat(120));
for(const r of results){
 console.log(pad(r.no,4)+pad(r.name,34)+pad(r.status==='OK'?'○ OK':r.status==='NG'?'× NG':'— ',6)+pad(r.value,40)+r.rule);
 for(const d of (r.detail??[]))console.log('      '+d);
}
const ng=results.filter(r=>r.status==='NG');
console.log('-'.repeat(120));
console.log(ng.length?`不合格 ${ng.length} 項目：${ng.map(r=>r.no).join('、')}`:'全項目 合格');
console.log('（耳での確認はしていない。音は数値だけ）');
const report={id:ID,mp4:MP4,cache:CACHE,ref:REF,date:new Date().toISOString(),pass:!ng.length,thresholds:TH,metrics:fm,results};
try{mkdirSync(CACHE,{recursive:true});writeFileSync(path.join(CACHE,'quality-gate.json'),JSON.stringify(report,null,1));console.log(`報告：${path.join(CACHE,'quality-gate.json')}`);}catch(e){console.log('報告を書けない：'+e.message);}
process.exit(ng.length?1:0);
