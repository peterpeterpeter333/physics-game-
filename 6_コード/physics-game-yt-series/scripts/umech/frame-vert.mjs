// Frame composer for visualPilot 'vert-v1'（縦長 1080×1920、YouTube ショート「深掘りショート」）。
// 横長の umech-v1（frame.mjs、1280×760）とは別のファイル。横長の動画には一切かかわらない。
//
// 割り付け（1080×1920）
//   y 0–110      空ける（ショートの上の操作）
//   y 140        シリーズ名（36px、灰）  例「深掘りショート 01」（clip.series、なければ出さない）
//   y 205/270    題（問いの形、52px、太字、2行まで）
//   y 296–348    場面の札（clip の scene.heading、36px）と「n / m」
//   y 372–1292   図の舞台 1000×920（x 40–1040）。図は viewBox 0 0 1000 920 で描く（1単位＝1px）
//   y 1312       区切り線
//   y 1372–1564  字幕 48px、行送り 64px、4行まで（1行 約18字）。x 60–940（右の操作ボタンを避ける）
//   y 1690       音声の表記（36px、灰）
//   y 1904–1914  進み具合の細い棒
// ショートの操作に隠れやすい所：右端（x>940、y 900–1700）と下端（y>1600）。舞台の中でも、
//   図の y>560（画面 y>930）では x<900 に大事な物を置く。
// diagrams：scripts/umech/diagrams.mjs の登録（yt1-*-diagrams.mjs は自動で読み込まれる）を使う。
//   図の関数は (p, ctx) => svg。ctx = {t, dur, k, cue, clip, scene, tg, W:1000, H:920}
//   t = cue の中の秒、dur = cue の長さ、tg = 同じ続きの組（キーの ':' の前が同じ cue が続く間）が始まってからの秒。
// 掛け合い：cue に speaker がある動画だけ、字幕・区切り線・音声の表記を vert-dialogue.mjs が描く（無い動画は今まで通り）。
import {C,clamp,smooth,label,line,rect,fade,esc} from './anim.mjs';
import {diagrams} from './diagrams.mjs';
import {isDialogue,dialogueRows,dialogueCaptions,dialogueChips,dialogueCredit} from './vert-dialogue.mjs';
// 机の上の画面（scene に deskFrame がある動画だけ。技術の疑問の鎖 1-1 第4版から）。他の動画は通らない
import {deskFrame} from './desk-frame.mjs';

export const VERT_PILOT='vert-v1';
export const VW=1080,VH=1920;
export const VSTAGE={x:40,y:372,w:1000,h:920};
export const VCAP={x:60,size:48,lh:64,y0:1372,max:18.3,lines:4};
export const VTITLE={size:52,max:19.6,lines:2};

// 文字の幅（em）：全角 1、半角 0.55。
export const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
// 日本語の折り返し（字幕・題）。行の数を少なく、かつ語の途中で折らないように選ぶ（動的計画法）。
//  折る所の良さ：句読点・閉じかっこの後 ◎ ／ ひらがな→漢字・カタカナ・数字 ○ ／ それ以外 △ ／ 語の途中（ひらがな→ひらがな、漢字→送りがな、カタカナの中）×
//  行頭に句読点・閉じかっこ・長音を置かない。数字・英字の並び（1.33、30°）は割らない。
//  cue に lines（字幕を行に分けた配列。つなぐと字幕と同じ）があれば、それを使う。
const NOHEAD=/[。、，．）」』？！ー・%°]/;
const isK=c=>/[\u4e00-\u9fff々]/.test(c),isH=c=>/[\u3041-\u309f]/.test(c),isKata=c=>/[\u30a0-\u30ff]/.test(c),isA=c=>/[0-9A-Za-z.]/.test(c);
function breakCost(a,b){
 if(NOHEAD.test(b))return Infinity;
 if(isA(a)&&isA(b))return Infinity;
 if(/[、。？！」』）]/.test(a))return 0;
 if(isH(a)&&(isK(b)||isKata(b)||isA(b)||/[「『（]/.test(b)))return 4;
 if((isH(a)&&isH(b))||(isK(a)&&isH(b))||(isKata(a)&&isKata(b))||(isK(a)&&isK(b)))return 15;
 return 8;
}
export function wrapJa(s,max,{lineCost=12}={}){
 const ch=[...String(s)],N=ch.length,w=ch.map(c=>/[ -~]/.test(c)?.55:1);
 const best=Array(N+1).fill(Infinity),from=Array(N+1).fill(-1);best[0]=0;
 for(let i=0;i<N;i++){if(best[i]===Infinity)continue;let W=0;
  for(let j=i+1;j<=N;j++){W+=w[j-1];if(W>max&&j>i+1)break;
   const bc=j===N?0:breakCost(ch[j-1],ch[j]);if(bc===Infinity)continue;
   const short=j===N&&W<2.5&&i>0?10:0;
   const c=best[i]+lineCost+bc+short;if(c<best[j]){best[j]=c;from[j]=i;}}}
 if(best[N]===Infinity)return [String(s)];
 const rows=[];for(let j=N;j>0;j=from[j])rows.unshift(ch.slice(from[j],j).join(''));
 return rows;
}
export const captionRows=(text,q)=>{if(q?.lines){if(q.lines.join('')!==text)throw Error(`cue.lines must join to the subtitle: ${text}`);return q.lines;}return wrapJa(text,VCAP.max);};

// 同じ続きの組（':' の前が同じ）が始まった時刻
const group=d=>(d??'').split(':')[0];
function groupStart(c,s,k,capStart){
 const flat=c.scenes.flatMap(sc=>sc.cues.map((q,i)=>({q,start:sc.captions?.[i]?.start??0,sc,i})));
 let j=flat.findIndex(f=>f.sc===s&&f.i===k);if(j<0)return capStart;
 while(j>0&&!flat[j].q.cut&&group(flat[j-1].q.diagram)===group(flat[j].q.diagram))j--;
 return flat[j].start;
}

export function vertFrame(c,s,t){
 if(c.visualPilot!==VERT_PILOT)return null;
 if(s.deskFrame)return deskFrame(c,s,t);
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],q=s.cues[k];
 if(!q)throw Error(`Missing cue ${c.id}/${s.index}/${k}`);
 if(q.display!=='diagram')throw Error(`vert-v1 draws diagrams only (cue ${c.id}/${s.index}/${k})`);
 const dur=Math.max(.05,cap.end-cap.start),p=clamp((t-cap.start)/dur);
 const dlg=isDialogue(c);
 const rows=dlg?dialogueRows(cap.text,q,{wrapJa,jw,max:VCAP.max}):captionRows(cap.text,q);if(rows.length>VCAP.lines)throw Error(`Caption overflow (${rows.length} lines) ${c.id}/${s.index}/${k}: ${cap.text}`);
 const prevQ=k>0?s.cues[k-1]:(s.index>0?c.scenes[s.index-1].cues.at(-1):null);
 const cut=!prevQ||q.cut||group(prevQ.diagram)!==group(q.diagram);
 const inA=cut?smooth(clamp((t-cap.start)/.35)):1;
 const fn=diagrams[q.diagram];if(!fn)throw Error(`Unknown diagram ${q.diagram} in ${c.id}`);
 const tg=t-groupStart(c,s,k,cap.start);
 const body=`<svg data-presentation="diagram" x="${VSTAGE.x}" y="${VSTAGE.y}" width="${VSTAGE.w}" height="${VSTAGE.h}" viewBox="0 0 ${VSTAGE.w} ${VSTAGE.h}" overflow="hidden">${fn(p,{t:t-cap.start,dur,k,cue:q,clip:c,scene:s,tg,W:VSTAGE.w,H:VSTAGE.h})}</svg>`;
 const title=wrapJa(c.title,VTITLE.max).slice(0,VTITLE.lines);
 const head=s.heading??'',hw=jw(head)*36+44,n=`${s.index+1} / ${c.scenes.length}`;
 let top='';
 if(c.series)top+=label(c.series,48,140,{size:36,color:C.dim});
 top+=title.map((v,i)=>label(v,48,205+i*65,{size:VTITLE.size,weight:700})).join('');
 top+=rect(44,296,hw,52,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:26})+label(head,44+hw/2,335,{size:36,color:C.hi,anchor:'middle',weight:700})+label(n,44+hw+22,335,{size:36,color:C.dim});
 const caps=dlg?dialogueCaptions(rows,q):rows.map((v,i)=>label(v,VCAP.x,VCAP.y0+i*VCAP.lh,{size:VCAP.size,weight:500})).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${VW}" height="${VH}"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif}</style><rect width="${VW}" height="${VH}" fill="${C.bg}"/>`
  +top+fade(inA,body)
  +(dlg?dialogueChips(q):line(40,1312,1040,1312,{color:'#28364e',w:2}))+caps
  +(dlg?dialogueCredit(c):label('音声：VOICEVOX Nemo 男声1',48,1690,{size:36,color:C.dim,opacity:.7}))
  +`<rect x="0" y="1904" width="${VW}" height="10" fill="#1c2a44"/><rect x="0" y="1904" width="${(VW*t/c.duration).toFixed(1)}" height="10" fill="${C.x}"/></svg>`;
}

