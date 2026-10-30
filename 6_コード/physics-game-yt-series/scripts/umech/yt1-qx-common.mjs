// 問題編（ys-qx-*）の共通部品。全担当がこのファイルを import して使う（このファイルは統括だけが直す）。
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/01_共通の約束（ChatGPTへの指示書）.md の「共通の部品」「色」。
// 名前が -diagrams.mjs で終わらないので、diagrams.mjs の自動読み込みの対象外（図のキーは持たない）。
//
// 画面（ステージ 1200×515。解説動画では左上に題と見出し、下に字幕の帯がある。問題アニメでは字幕の帯なし）
//   ┌ goalTag「求めるもの：…」（左上・白枠）           answerTag「小問n の答え：X（値）」（右上・黄枠）┐
//   │  ← 札の帯は y＝0〜QX.TOP（78px）。札を出す cue の図は、QX.TOP より下に描く。                         │
//   │  図・式（主役は一つ）                                                                                  │
//   │  wrongCard「× 誤答 X：値」＋理由1行（1枚ずつ。wrongSeq でナレーションの文に合わせて切り替える）       │
//   └────────────────────────────────────────────────────────────────────────────┘
// 使い方の例（図のファイル scripts/umech/yt1-qx-<id>-diagrams.mjs の中）：
//   import {QX,QC,card,goalTag,answerTag,wrongCard,wrongSeq,kindTag,pauseBadge,legend,sentWin,cueT,tAt} from './yt1-qx-common.mjs';
//   [K+'ans1']:(p,ctx)=>picture(...)+goalTag('前方の波長 λ前')+answerTag(1,'C','0.50 m',{g:seg(p,.1,.25)}),
//   [K+'wrong']:(p,ctx)=>picture(...)+wrongSeq(p,ctx,[['B','0.63 m','前方なのに V＋vs を使った'],['D','0.067 m','1周期に列車が進む距離を、波長とした']]),
import {C,clamp,seg,fade,label,line,rect,ring,tex,texWidth} from './anim.mjs';

// ---- 配置と色 --------------------------------------------------------------------------------------
export const QX={W:1200,H:515,TOP:78,PAD:10};
// 01_共通の約束 の色。anim.mjs の C と同じ値（温度だけ追加）。
export const QC={
 x:C.x,E:C.x,lam:C.x,          // 位置 x・電場 𝐄・波長 λ：水色
 v:C.v,V:C.v,emf:C.v,          // 速度 v、電位 V・起電力 ℰ：紫
 a:C.a,                        // 加速度 a：赤
 F:C.F,I:C.F,                  // 力 F、電流 I：緑
 t:C.t,                        // 時間 t（周期 T も）：金
 U:C.E,B:C.E,                  // エネルギー・磁場 𝐁：橙
 p:C.p,q:C.p,f:C.p,            // 運動量 p、電荷 q、振動数 f：桃
 T:'#b8e86a',                  // 温度 T：黄緑
 hi:C.hi,                      // 強調：黄
 bad:'#ff6b6b',                // 誤答の ×
 ink:C.ink,dim:C.dim,faint:C.faint,bg:C.bg,
};
export const CARD_FILL='#131f38';
// 紺の塗り・角の丸い枠（大学編・高校編の解説動画と同じ見た目）
export const card=(x,y,w,h,inner='',g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:CARD_FILL,fo:.96,stroke,sw:2,rx:14})+inner);

// 文字の幅の見積もり（Hiragino の太字。全角 1.02、半角 0.64、半角スペース 0.34。少し大きめに見積もる）
export function textW(s,size){let w=0;for(const ch of String(s))w+=ch===' '?.34:/[!-~]/.test(ch)?.64:1.02;return w*size;}

// ---- 札 ---------------------------------------------------------------------------------------------
// 「求めるもの：…」 左上・白枠。小問の最初の cue で出し、その小問の答えまで出したままにしてよい。
export function goalTag(text,{g=1,x=QX.PAD,y=8,size=26}={}){
 const head='求めるもの：',w=textW(head,size)+textW(text,size)+32,h=size+30;
 return fade(g,rect(x,y,w,h,{fill:CARD_FILL,fo:.96,stroke:C.ink,sw:2.5,rx:10})
  +label(head,x+16,y+h/2+size*.36,{size,color:C.dim,weight:700})
  +label(text,x+16+textW(head,size),y+h/2+size*.36,{size,color:C.ink,weight:700}));
}
// 「小問n の答え：X（値）」 右上・黄枠。答えを声で言う cue で出す。値が長いと2行（2行目に（値））。
// value に TeX を使うときは {tex:'...'} を渡す（値の部分だけ TeX で描く）。
function answerGeom(n,letter,value,size,maxW){
 const head=`小問${n} の答え：${letter}`;
 const isTex=value&&typeof value==='object';
 const valW=!value?0:isTex?texWidth(value.tex,size*1.05,false)+textW('（）',size):textW(`（${value}）`,size);
 const one=textW(head,size)+valW+32<=maxW;
 return {head,isTex,valW,one,w:one?textW(head,size)+valW+32:Math.max(textW(head,size),valW)+32,h:one?size+30:2*size+42};
}
// 答えの札の幅（札を横に並べるときに使う）
export const answerTagW=(n,letter,value='',{size=26,maxW=700}={})=>answerGeom(n,letter,value,size,maxW).w;
// 答えの札を右上に横一列に並べる（まとめの最後など）。items＝[[n,letter,value],...]（左から順）
export function answerRow(items,{g=1,right=QX.W-QX.PAD,gap=12,size=26}={}){
 let x=right,s='';
 for(const it0 of [...items].reverse()){const it=[it0[0],it0[1],it0[2]??''];s+=answerTag(...it,{g,right:x,size});x-=answerTagW(...it,{size})+gap;}
 return s;
}
export function answerTag(n,letter,value='',{g=1,right=QX.W-QX.PAD,y=8,size=26,maxW=700}={}){
 const {head,isTex,valW,one,w,h}=answerGeom(n,letter,value,size,maxW);
 const x=right-w,base=y+size+7;
 let s=rect(x,y,w,h,{fill:C.hi,fo:.13,stroke:C.hi,sw:3,rx:10})+rect(x,y,w,h,{fill:CARD_FILL,fo:.55,stroke:'none',rx:10});
 s+=label(head,x+16,base,{size,color:C.hi,weight:700});
 if(value){
  const vx=one?x+16+textW(head,size):x+16,vy=one?base:base+size+12;
  if(isTex){const tw=texWidth(value.tex,size*1.05,false);
   s+=label('（',vx,vy,{size,color:C.ink,weight:700})+tex(value.tex,vx+textW('（',size)+tw/2,vy-size*.36,{size:size*1.05,auto:false})+label('）',vx+textW('（',size)+tw,vy,{size,color:C.ink,weight:700});}
  else s+=label(`（${value}）`,vx,vy,{size,color:C.ink,weight:700});
 }
 return fade(g,s);
}
// 誤答カード：1行目「× 誤答 X：値」（× は赤、文字は灰色）、2行目に理由（why は文字列、または2行までの配列）。
// 既定の置き場所は、画面下の中央（字幕の帯のすぐ上）。正解の導出中には出さない。
// mid に TeX を渡すと、1行目と理由の間に式を1行入れる（例：誤答の計算 600×340/380≈537 Hz）。
export function wrongCard(letter,value,why,{g=1,x=150,y=345,w=900,size=28,whySize=24,mid='',midSize=34}={}){
 const rows=[].concat(why??[]),mh=midH(mid,midSize),h=size+30+mh+rows.length*(whySize+12)+10;
 const head=`誤答 ${letter}：${value}`;
 let s=rect(x,y,w,h,{fill:'#1f1622',fo:.96,stroke:'#8a4a55',sw:2.5,rx:12});
 const hx=x+w/2-(textW(head,size)+size*1.1)/2;
 s+=label('×',hx,y+size+12,{size:size*1.1,color:QC.bad,weight:700})+label(head,hx+size*1.1,y+size+12,{size,color:'#c9d2e0',weight:700});
 if(mid)s+=tex(mid,x+w/2,y+size+26+mh/2,{size:midSize,auto:false,color:'#c9d2e0'});
 rows.forEach((r,i)=>{s+=label(r,x+w/2,y+size+24+mh+(i+1)*(whySize+12)-4,{size:whySize,color:C.dim,anchor:'middle'});});
 return fade(g,s);
}
const midH=(mid,size)=>!mid?0:/frac/.test(mid)?size*2.9:size*1.9;
export const wrongH=({size=28,whySize=24,mid='',midSize=34,lines=1}={})=>size+30+midH(mid,midSize)+lines*(whySize+12)+10;
// 誤答カードを1枚ずつ。cards＝[[記号,値,理由,{mid,…（このカードだけの指定）}],...]。
// 既定では、この cue のナレーションの文（。で区切る）に1枚ずつ割り当てる（文が1つでカードが2枚なら、読みの長さで半分に分ける）。
// win を渡すと、その区間 [[a,b],...]（cue の進み 0〜1）で出す。前のカードは次のカードが出る前に消える。
export function wrongSeq(p,ctx,cards,{win,opts={},keepLast=true}={}){
 const W=win??splitWin(ctx,cards.length);
 let s='';
 cards.forEach(([l,v,why,own],i)=>{
  const [a,b]=W[i],last=i===cards.length-1;
  const gin=seg(p,a+.01,a+.05),gout=last&&keepLast?0:seg(p,b-.04,b-.005);
  s+=wrongCard(l,v,why,{...opts,...(own??{}),g:gin*(1-gout)});
 });
 return s;
}

// ---- タグ（大学編と同じ見た目：色の付いた丸い札）----------------------------------------------------
export const KIND={定義:C.hi,法則:C.F,近似:C.E,前提:C.dim,実験:C.ink,仮定:C.dim,結果:C.x};
export function kindTag(kind,x,y,{g=1,size=24,text='',color}={}){
 const s=text?`${kind}：${text}`:kind,col=color??KIND[kind]??C.dim,w=textW(s,size)+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:col,fo:.14,stroke:col,sw:2,rx:16})+label(s,x,y+2,{size,color:col,anchor:'middle',weight:700}));
}
// 「映像を一時停止」の表示（物体が止まったのではない、と区別する）。上の中央。
export function pauseBadge({g=1,x=QX.W/2,y=QX.TOP+8,size=26}={}){
 const t='映像を 一時停止',w=textW(t,size)+70,h=size+24,x0=x-w/2;
 return fade(g,rect(x0,y,w,h,{fill:'#2a3346',fo:.95,stroke:C.dim,sw:2,rx:h/2})
  +rect(x0+20,y+h/2-11,7,22,{fill:C.ink,fo:1,stroke:'none',rx:1})+rect(x0+32,y+h/2-11,7,22,{fill:C.ink,fo:1,stroke:'none',rx:1})
  +label(t,x0+52,y+h/2+size*.36,{size,color:C.ink,weight:700}));
}
// 凡例：items＝[[文字,色],...]。単元動画と色が違う量があるとき、その単元の色を示す。
export function legend(items,x,y,{g=1,size=22,dir='col',gap=14}={}){
 let s='',cx=x,cy=y;
 for(const [t,col] of items){
  s+=rect(cx,cy-size*.75,size*.9,size*.9,{fill:col,fo:.9,stroke:'none',rx:4})+label(t,cx+size*1.3,cy+2,{size,color:col,weight:700});
  if(dir==='col')cy+=size+gap;else cx+=size*1.3+textW(t,size)+gap*2;
 }
 return fade(g,s);
}
// 「大きく誇張」などの注記（灰色・小さめ、22px）
export const note=(t,x,y,{g=1,anchor='middle',size=22}={})=>fade(g,label(t,x,y,{size,color:C.dim,anchor}));

// ---- 時間の道具 ---------------------------------------------------------------------------------------
// cue の中の秒数（問題アニメでも同じ）
export const cueT=ctx=>ctx?.t??0;
// 声が終わる所（cue の進み 0〜1）。字幕の終わり＝声＋0.12 s＋pause。
export function voiceEnd(ctx){
 if(!ctx?.dur)return 1;const pause=ctx.cue?.pause??0;
 return clamp((ctx.dur-pause-.12)/ctx.dur,.2,1);
}
// この cue のナレーションの各文が読まれる区間 [[a,b],...]（cue の進み 0〜1。読みのかなの長さで割り振る）。
export function sentWin(ctx){
 const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean);
 const ve=voiceEnd(ctx);if(r.length<2)return [[0,ve]];
 const tot=r.reduce((a,x)=>a+x.length,0);let acc=0;
 return r.map((x,i)=>{const a=acc/tot*ve;acc+=x.length;return [a,i===r.length-1?Math.max(ve,acc/tot*ve):acc/tot*ve];});
}
// n 枚のカード用の区間。文の数と同じならそのまま。違えば、声の区間を n 等分。最後のカードは cue の終わりまで。
function splitWin(ctx,n){
 const w=sentWin(ctx);
 const out=w.length===n?w:Array.from({length:n},(_,i)=>[voiceEnd(ctx)*i/n,voiceEnd(ctx)*(i+1)/n]);
 out[n-1]=[out[n-1][0],1];return out;
}
// 同じ場面（scene）の中で、キー key の cue が始まってからの秒数。見つからなければ cue の中の秒数。
export function tAt(ctx,key){
 const sc=ctx?.scene;if(!sc?.captions||!sc.cues)return cueT(ctx);
 const i=sc.cues.findIndex(c=>c.diagram===key);if(i<0)return cueT(ctx);
 return ctx.t+(sc.captions[ctx.k]?.start??0)-(sc.captions[i]?.start??0);
}
// 同じ場面の、キー key の cue の長さ（秒）。続きの cue で、前の cue の終わりの状態に止めるときに使う。
export function durOf(ctx,key,fallback=8){
 const sc=ctx?.scene;if(!sc?.captions||!sc.cues)return fallback;
 const i=sc.cues.findIndex(c=>c.diagram===key);if(i<0)return fallback;
 return sc.captions[i].end-sc.captions[i].start;
}
// 問題アニメ（render-problem-clip.mjs）で描いているときは true。
export const isProblem=ctx=>!!ctx?.problem;
