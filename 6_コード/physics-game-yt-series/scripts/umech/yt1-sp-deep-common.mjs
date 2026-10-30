// 深掘りショート（縦長 vert-v1、ys-deep-NN）の共通部品。01「ストローは、なぜ折れて見える？」で作った形。
// 図のキーは持たない（ファイル名が -diagrams で終わらないので自動読み込みされない）。各回の図ファイルから import して使う。
// 舞台は 1000×920（frame-vert.mjs の VSTAGE、1単位＝1px）。文字は 36px 以上。
// 舞台の y>560 では、x<900 に大事な物を置く（ショートの右の操作ボタン）。
//
// 時間：cueT(p,ctx) cue の中の秒 ／ voiceEnd(ctx) 声の終わり（cue の pause を除く）／ vseg(ctx,p,a,b) 声の割合 a〜b の進み 0→1
//       sentWin(ctx) 各文が読まれる区間（秒）／ swin(ctx,p,i,a,b) i 番目の文の中の割合 a〜b の進み
//       ctx.tg 同じ続きの組（キーの ':' の前が同じ）が始まってからの秒
// 形  ：tag(kind,x,y) 種類の札（実験・仮説・予想・定義・結果）／ note(text,x,y) 灰色の注記（「大きく誇張」など）
//       bigQ(x,y,g) 大きな「？」／ finalCard(lines,g) 最後の問い（黄の枠）／ eye(x,y,dir) 目
// 光  ：LIGHT（光の線の色）、WATER（水の塗り）、SURF（水面の線）、snellR(i,n)、surfacePoint(obj,eye,ys,n)
import {C,seg,clamp,fade,label,line,rect,dot,ring,draw,scaleAt} from './anim.mjs';

export const W=1000,H=920,HC=C.hi;
export const LIGHT='#fff1b8',WATER='#3f8cff',SURF='#7fb2ff',GLASS='#c9d6ea';
export const N_WATER=1.33;
export const cueT=(p,ctx)=>ctx&&typeof ctx.t==='number'?ctx.t:p*8;
export const durOf=ctx=>ctx&&ctx.dur?ctx.dur:8;
export const voiceEnd=ctx=>Math.max(.5,durOf(ctx)-.12-((ctx&&ctx.cue&&ctx.cue.pause)||0));
export const vseg=(ctx,p,a,b)=>{const ve=voiceEnd(ctx),t=cueT(p,ctx);return seg(t,a*ve,b*ve);};
export function sentWin(ctx){
 const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean);
 const ve=voiceEnd(ctx);if(r.length<2)return [[0,ve]];
 const tot=r.reduce((a,x)=>a+x.length,0);let acc=0;
 return r.map(x=>{const a=acc/tot*ve;acc+=x.length;return [a,acc/tot*ve];});
}
export const swin=(ctx,p,i,a,b)=>{const w=sentWin(ctx)[Math.min(i,sentWin(ctx).length-1)],t=cueT(p,ctx),L=w[1]-w[0];return seg(t,w[0]+a*L,w[0]+b*L);};
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);

const KIND={'実験':'#edf4ff','仮説':'#ffb36b','予想':'#ffb36b','仮定':'#9aabc7','定義':'#ffe28a','結果':'#83ecc0','今の値':'#9aabc7'};
export function tag(kind,x,y,{g=1,size=36,text='',color,anchor='start'}={}){
 const s=text?`${kind}：${text}`:kind,col=color??KIND[kind]??C.dim,w=jw(s)*size+36,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return fade(g,rect(x0,y-size*.85-10,w,size+22,{fill:C.bg,fo:.88,stroke:'none',rx:(size+22)/2})+rect(x0,y-size*.85-10,w,size+22,{fill:col,fo:.14,stroke:col,sw:2.5,rx:(size+22)/2})+label(s,x0+w/2,y+2,{size,color:col,anchor:'middle',weight:700}));
}
export const note=(text,x,y,{g=1,anchor='start'}={})=>fade(g,label(text,x,y,{size:36,color:C.dim,anchor}));
// 図の上に重ねる文字（後ろに暗い板を敷いて読みやすくする）
export function plate(text,x,y,{size=38,color=C.ink,anchor='start',weight=700,g=1}={}){
 const w=jw(text)*size+24,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x-12;
 return fade(g,rect(x0,y-size*.9,w,size*1.25,{fill:C.bg,fo:.8,stroke:'none',rx:10})+label(text,x,y,{size,color,anchor,weight}));
}
export const bigQ=(x,y,g=1,size=220)=>fade(g,scaleAt(x,y-size*.35,.8+.2*g,label('？',x,y,{size,color:HC,anchor:'middle',weight:700})));
export function finalCard(lines,g=1,{y=300,size=56}={}){
 const w=Math.min(960,Math.max(...lines.map(jw))*size+90),h=50+lines.length*(size+22),x0=(W-w)/2;
 let s=rect(x0,y,w,h,{fill:'#131f38',fo:.95,stroke:HC,sw:5,rx:22});
 lines.forEach((L,i)=>{s+=label(L,W/2,y+size+28+i*(size+22),{size,color:HC,anchor:'middle',weight:700});});
 return fade(g,scaleAt(W/2,y+h/2,.92+.08*g,s));
}
// 目（横向き）。dir：見ている向き（ラジアン、0＝右、正＝下向き）
export function eye(x,y,dir=0,{size=46,color='#e8eef8'}={}){
 const c=Math.cos(dir),s=Math.sin(dir),P=(u,v)=>[x+u*c-v*s,y+u*s+v*c],r=size;
 const a=P(-r*.9,0),b=P(r*.9,0),t=P(0,-r*.62),d=P(0,r*.62),pc=P(r*.25,0);
 return `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${t[0].toFixed(1)} ${t[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)} Q${d[0].toFixed(1)} ${d[1].toFixed(1)} ${a[0].toFixed(1)} ${a[1].toFixed(1)} Z" fill="#0b1122" stroke="${color}" stroke-width="4"/>`+dot(pc[0],pc[1],r*.3,'#6adfff')+dot(pc[0],pc[1],r*.14,'#0b1122');
}
// 屈折：入る角 i（ラジアン、面に垂直な線から）→ 曲がった後の角。n＝（入る側の速さ）÷（出る側の速さ）
export const snellR=(i,n=N_WATER)=>Math.asin(clamp(Math.sin(i)/n,-1,1));
// 水の中の点 obj から、水面 y=ys で曲がって、空気の中の点 eyeP に届く光の、水面の点の x を求める（二分法）。
export function surfacePoint(obj,eyeP,ys,n=N_WATER){
 const d=obj[1]-ys,h=ys-eyeP[1];let lo=Math.min(obj[0],eyeP[0]),hi=Math.max(obj[0],eyeP[0]);
 const f=x=>{const sw=(obj[0]-x)/Math.hypot(obj[0]-x,d),sa=(x-eyeP[0])/Math.hypot(x-eyeP[0],h);return sa-n*sw;};
 // f は x について単調。符号の変わる所を探す
 const fl=f(lo);for(let k=0;k<60;k++){const m=(lo+hi)/2;if((f(m)>0)===(fl>0))lo=m;else hi=m;}
 return (lo+hi)/2;
}
// 目から見た、水の中の点 obj の見かけの位置（obj の真上、目から水面の点へのまっすぐな線の延長上）
export function apparent(obj,eyeP,ys,n=N_WATER){
 const x=surfacePoint(obj,eyeP,ys,n),k=(obj[0]-x)/(x-eyeP[0]);
 return [obj[0],ys+(ys-eyeP[1])*k];
}
export {C,seg,clamp,fade,label,line,rect,dot,ring,draw};
