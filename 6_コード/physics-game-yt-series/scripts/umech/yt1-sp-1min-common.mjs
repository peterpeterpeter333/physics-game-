// 特別編「1分の疑問」シリーズ（ys-sp-1min-*）の共通部品。01「空は、なぜ青い？」で作った形。
// 図のキーは持たない（ファイル名が -diagrams で終わらないので自動読み込みされない）。他の回は import して使う（編集は 01 の担当だけ）。
//
// 形（全回でそろえる）
//  - 画面右上：「疑問 n」カウンター。新しい疑問で数字が下から繰り上がる（黄）。解けたら枠が水色になり ✓ が付く。
//  - 最初の cue：Q カード（大きな黄色の「Q」、その下に白で問い）。qcard()
//  - 途中で生まれる疑問：画面中央に「疑問 n」カードが出て、左上の札（ピル）に縮む。wrap(...,{q:{...}})
//  - 答えが出た cue の終わり：カウンターの左に「次の疑問 →」。wrap(...,{bridge:.8})
//  - 最後の cue：黄色の枠の問い。finalQ()
// 使い方：export const xxxDiagrams={ 'sp-1min-<名前>:<場面>': wrap(n, (p,ctx)=>svg, {...}) }
import {C,seg,clamp,fade,label,line,rect,dot,ring,draw,arrow,scaleAt} from './anim.mjs';

export const HC=C.hi, OK=C.x;
export const cueT=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8;
export const durOf=ctx=>ctx&&ctx.dur?ctx.dur:8;
// end of the voice inside the cue (the cue = voice + pause)
export const voiceEnd=ctx=>Math.max(.5,durOf(ctx)-.12-((ctx&&ctx.cue&&ctx.cue.pause)||0));
// progress of a window [a,b] given as fractions of the voice (0 = cue start, 1 = voice end)
export const vseg=(ctx,p,a,b)=>{const ve=voiceEnd(ctx),t=cueT(p,ctx);return seg(t,a*ve,b*ve);};
const jw=s=>[...s].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0); // rough width in "em"

// ---------- 「疑問 n」カウンター（右上） ----------
export const CX0=1010, CY0=6, CW=172, CH=46;
export function counter(n,t,{roll=-1,solved=0}={}){
 // roll = time (s) when the number rolls from n-1 to n (-1: already n)
 const u=roll<0?1:seg(t,roll,roll+.45),pop=roll<0?0:Math.exp(-Math.max(0,t-roll-.45)*5)*(t>=roll?1:0);
 const col=solved>0?OK:HC;
 let s=rect(CX0,CY0,CW,CH,{fill:'#131f38',fo:.96,stroke:solved>0?OK:HC,sw:2.5,rx:23});
 s+=label('疑問',CX0+56,CY0+33,{size:24,color:C.dim,anchor:'middle',weight:700});
 const nx=CX0+124,ny=CY0+36;
 let num='';
 if(n>1&&u<1)num+=fade(1-u,label(String(n-1),nx,ny-28*u,{size:34,color:OK,anchor:'middle',weight:700}));
 num+=fade(u,scaleAt(nx,ny-12,1+.35*pop,label(String(n),nx,ny+28*(1-u),{size:34,color:col,anchor:'middle',weight:700})));
 s+=`<clipPath id="q1mC"><rect x="${CX0+100}" y="${CY0+3}" width="48" height="${CH-6}"/></clipPath><g clip-path="url(#q1mC)">${num}</g>`;
 if(solved>0)s+=fade(solved,draw([[CX0+148,CY0+24],[CX0+155,CY0+32],[CX0+166,CY0+16]],1,{color:OK,w:4}));
 if(pop>.02)s+=fade(pop,ring(nx,CY0+CH/2,16+8*(1-pop),{color:HC,w:2.5}));
 return s;
}
// 「次の疑問 →」：カウンターの左（矢印がカウンターを指す）
export function nextTag(g,t){
 if(g<=.001)return '';
 const dx=5*Math.sin(t*5),x=CX0-214;
 let s=rect(x,CY0,198,CH,{fill:'#131f38',fo:.96,stroke:HC,sw:2.5,rx:23});
 s+=label('次の疑問',x+76,CY0+32,{size:26,color:HC,anchor:'middle',weight:700})+arrow(x+138+dx*.3,CY0+23,x+184+dx,CY0+23,{color:HC,w:4,head:14});
 return fade(g,s);
}
// ---------- 疑問の札（左上のピル）と、中央の「疑問 n」カード ----------
export function pill(n,text,{g=1}={}){
 const size=26,w=jw(text)*size+120;
 let s=rect(10,CY0,w,CH,{fill:'#131f38',fo:.96,stroke:HC,sw:2,rx:23});
 s+=dot(40,CY0+CH/2,17,HC)+label('Q',40,CY0+32,{size:24,color:'#0b1122',anchor:'middle',weight:700});
 s+=label(`${n}`,72,CY0+33,{size:26,color:HC,anchor:'middle',weight:700});
 s+=label(text,94,CY0+33,{size,color:C.ink,weight:700});
 return fade(g,s);
}
export function bigQ(n,lines,{g=1,sc=1}={}){
 const W=Math.max(560,Math.max(...lines.map(jw))*48+120),H=150+lines.length*62,x=600-W/2,y=258-H/2;
 let s=rect(x,y,W,H,{fill:'#131f38',fo:.97,stroke:HC,sw:3,rx:20});
 s+=label(`疑問 ${n}`,600,y+78,{size:56,color:HC,anchor:'middle',weight:700});
 lines.forEach((L,i)=>{s+=label(L,600,y+150+i*62,{size:46,color:C.ink,anchor:'middle',weight:700});});
 return fade(g,scaleAt(600,258,sc,s));
}
// Q カード（各本の最初の cue）：大きな黄色の「Q」、その下に白で問い。bg = 背景の絵（任意）
export function qcard(lines,p,t,{bg='',y0=200}={}){
 const pop=seg(t,0,.45),sc=.7+.3*pop+.05*Math.exp(-Math.max(0,t-.45)*8);
 let s=bg;
 s+=fade(pop,scaleAt(600,y0-50,sc,label('Q',600,y0,{size:150,color:HC,anchor:'middle',weight:700})));
 lines.forEach((L,i)=>{s+=fade(seg(t,.25+i*.2,.65+i*.2),label(L,600,y0+110+i*66,{size:56,color:C.ink,anchor:'middle',weight:700}));});
 return s;
}
// 最後の cue：黄色の枠の問い（次の本へ）
export function finalQ(lines,g=1,{x=600,y=150,sc=1}={}){
 const W=Math.max(...lines.map(jw))*50+110,H=40+lines.length*64,x0=x-W/2;
 let s=rect(x0,y,W,H,{fill:'#131f38',fo:.94,stroke:HC,sw:5,rx:18});
 lines.forEach((L,i)=>{s+=label(L,x,y+70+i*64,{size:50,color:HC,anchor:'middle',weight:700});});
 return fade(g,scaleAt(x,y+H/2,sc,s));
}

// ---------- 包み：絵の fade-in・カウンター・疑問カード・橋 ----------
// n: いまの疑問の番号。opts:
//  fadeIn  : 絵を 0.35 秒で出す（同じ絵が続く cue は false）
//  roll    : カウンターが n-1 → n に繰り上がる時点（声の割合 0〜1）。省略すると最初から n。
//  q       : {text, lines, end, start=0} 中央の「疑問 n」カードを声の [start,end] に出し、左上の札（text）に縮める
//  pill    : 左上の札を最初から出す（同じ疑問が続く cue）
//  bridge  : 声の割合。ここから「次の疑問 →」とカウンターの ✓
export function wrap(n,fn,{fadeIn=true,roll=-1,q=null,pill:pl='',bridge=-1}={}){
 return (p,ctx)=>{
  const t=cueT(p,ctx),ve=voiceEnd(ctx),fi=fadeIn?clamp(t/.35):1,f=fi*fi*(3-2*fi);
  let s=fade(f,fn(p,ctx));
  let qs='';
  if(q){const t0=(q.start||0)*ve,t1=q.end*ve,u=seg(t,t1,t1+.45),gin=seg(t,t0,t0+.3);
   if(u<1){qs+=rect(0,0,1200,515,{fill:C.bg,fo:.62*gin*(1-u),stroke:'none',rx:0});
    qs+=bigQ(n,q.lines,{g:gin*(1-u),sc:(.85+.15*gin)*(1-.4*u)});}
   qs+=pill(n,q.text,{g:u});}
  else if(pl)qs+=pill(n,pl);
  s+=qs;
  const rt=roll<0?-1:roll*ve+(roll===0?.1:0),sv=bridge<0?0:seg(t,bridge*ve,bridge*ve+.3);
  s+=counter(n,t,{roll:rt,solved:sv});
  if(bridge>=0)s+=nextTag(seg(t,bridge*ve+.15,bridge*ve+.5),t);
  return s;
 };
}
