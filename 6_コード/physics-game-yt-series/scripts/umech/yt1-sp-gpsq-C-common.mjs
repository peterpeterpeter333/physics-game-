// 特別編 v3「疑問20連発」担当C（Q11〜Q15）の共通部品。図のキーは持たない（-diagrams で終わらないので自動読み込みされない）。
// 上の Q 点列（Q1〜Q20）・Q カード・橋の札、v2 パート3（yt1-sp-gps2-3-diagrams.mjs）から写した部品（ボスの式・綱引き・飛行機など）。
// v1・v2 の図は import して呼ぶだけ（編集しない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix,poly} from './anim.mjs';

export const PI=Math.PI;
export const SLOW='#6f9dff', FAST=C.a, HI=C.hi, LIGHT='#fff3a0', MIR='#b9c3d4', MU=C.p;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const cc=cs(C.v,'c');
export const T=(src,x,y,o={})=>tex(src,x,y,{size:44,...o});
export const B=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',weight:700,...o});
export const sT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export function tag(s,x,y,{color=C.hi,g=1,size=24}={}){
 const w=[...s].length*size+30;
 return fade(g,rect(x-w/2,y-size*.85-8,w,size+18,{fill:color,fo:.14,stroke:color,sw:2,rx:16})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}
export const shift=(dx,dy,svg,s=1)=>`<g transform="translate(${dx} ${dy}) scale(${s})">${svg}</g>`;

// ---------------- Q1〜Q20 の点の列（全担当共通の見た目） ----------------
// 画面上の右寄り、直径 12px の点 20 個、間隔 22px。解いた Q＝水色の塗り、いまの Q＝黄色の輪で光る、未来の Q＝灰の輪。左に ★。
// solve (0..1)：橋の cue で、いまの Q の点が水色に塗られていく。
const STARS=n=>n<=6?1:n<=10?2:n<=15?3:4;
export function qRow(n,{t=0,solve=0}={}){
 const y=16,x0=1182-19*22;
 let s=label('★'.repeat(STARS(n)),x0-16,y+8,{size:22,color:HI,anchor:'end',weight:700});
 for(let i=1;i<=20;i++){
  const x=x0+(i-1)*22;
  if(i<n)s+=dot(x,y,6,C.x);
  else if(i===n){
   const pulse=.5+.5*Math.sin(t*4);
   s+=dot(x,y,11,HI,.12+.14*pulse);
   if(solve>0)s+=dot(x,y,6*solve,C.x);
   s+=ring(x,y,6,{color:HI,w:2.5});
  }
  else s+=ring(x,y,5,{color:'#6b7a96',w:2});
 }
 return s;
}
// Q カード：中央に大きく黄色の「Q.n」、その下に白で問い。to (0..1) で上へ小さく畳む。
export function qCard(n,q,{g=1,to=0,y=170,tx=240}={}){
 const s0=mix(1,.55,to),cy=mix(y,72,to),cx=mix(600,tx,to);
 const W=Math.max(560,[...q].length*46+120);
 let s=rect(600-W/2,cy-110,W,250,{fill:'#131f38',fo:.94,stroke:HI,sw:3,rx:22});
 s+=label(`Q.${n}`,600,cy+12,{size:104,color:HI,anchor:'middle',weight:700});
 s+=label(q,600,cy+92,{size:44,color:C.ink,anchor:'middle',weight:700});
 return fade(g,`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${s0.toFixed(3)}) translate(-600 ${(-cy).toFixed(1)})">${s}</g>`);
}
// 橋の札：右下に「次の疑問 →」
export function nextQ(g=1,t=0){
 const dx=6*Math.sin(t*4);
 return fade(g,rect(905,452,280,56,{fill:'#131f38',fo:.94,stroke:HI,sw:2,rx:14})+label('次の疑問',1010,490,{size:30,color:HI,anchor:'middle',weight:700})+arrow(1100+dx*.3,481,1158+dx,481,{color:HI,w:5,head:16}));
}
// 2 枚の図を途中で入れ替える（a は p0 まで、b は p0〜p1 で現れる）。pa/pb：それぞれに渡す p の範囲。
export const xf=(fa,fb,p0,p1,{pa=[0,1],pb=[0,1]}={})=>(p,ctx)=>{
 const u=seg(p,p0,p1);
 const qa=mix(pa[0],pa[1],clamp(p/p1)),qb=mix(pb[0],pb[1],clamp((p-p0)/(1-p0)));
 return (u<1?fade(1-u,fa(qa,ctx)):'')+(u>0?fade(u,fb(qb,ctx)):'');
};

// ---------------- 写した部品（v2 パート3 と同じ見た目） ----------------
export function person(x,y,{col=C.dim,s=1}={}){
 return ring(x,y-58*s,10*s,{color:col,w:3})+line(x,y-48*s,x,y-22*s,{color:col,w:3})+line(x,y-22*s,x-9*s,y,{color:col,w:3})+line(x,y-22*s,x+9*s,y,{color:col,w:3})+line(x-12*s,y-38*s,x+12*s,y-38*s,{color:col,w:3});
}
export function train(x,y,w,h,{col='#4a5a78',g=1,win=true,wheels=true}={}){
 let s=rect(x,y,w,h,{fill:col,fo:.35,stroke:'#8fa0bf',sw:2,rx:14});
 if(win)for(let i=0;i<3;i++)s+=rect(x+18+i*(w-36)/3,y+16,(w-36)/3-12,h*.32,{fill:'#9fc2ff',fo:.25,stroke:'#9fc2ff',sw:1,rx:4});
 if(wheels)s+=ring(x+w*.2,y+h+8,10,{color:C.dim,w:3,fill:C.bg})+ring(x+w*.8,y+h+8,10,{color:C.dim,w:3,fill:C.bg});
 return fade(g,s);
}
export const photon=(x,y,g=1)=>fade(g,dot(x,y,16,LIGHT,.25)+dot(x,y,9,LIGHT));
export function mirrors(x,yb,{L=180,w=96,g=1,col=MIR}={}){
 return fade(g,rect(x-w/2,yb,w,9,{fill:col,fo:.9,stroke:col,rx:3})+rect(x-w/2,yb-L-9,w,9,{fill:col,fo:.9,stroke:col,rx:3})
  +line(x-w/2+4,yb,x-w/2+4,yb-L,{color:C.faint,w:2})+line(x+w/2-4,yb,x+w/2-4,yb-L,{color:C.faint,w:2}));
}
export function lightClock(x,yb,t,{L=180,rate=1,g=1}={}){
 const tau=L/200,u=((t*rate)/tau)%2,y=yb-L*(u<1?u:2-u);
 return fade(g,mirrors(x,yb,{L})+line(x,yb,x,y,{color:HI,w:3,opacity:.5})+photon(x,y));
}
export const slowMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y+len,{color:SLOW,w:7,head:20})+label('−',x-26,y+len*.5+10,{size:40,color:SLOW,anchor:'middle',weight:700})+(text?label(text,x+22,y+len*.5+10,{size:30,color:SLOW,weight:700}):''));
export const fastMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y-len,{color:FAST,w:7,head:20})+label('＋',x-28,y-len*.5+10,{size:40,color:FAST,anchor:'middle',weight:700})+(text?label(text,x+22,y-len*.5+10,{size:30,color:FAST,weight:700}):''));
export function plane(x,y,deg,{col='#e8eef8',s=1}={}){
 const sh=`<polygon points="-22,-3 16,-3 24,0 16,3 -22,3" fill="${col}"/><polygon points="-2,-2 -12,-20 -5,-20 9,-2" fill="${col}"/><polygon points="-2,2 -12,20 -5,20 9,2" fill="${col}"/><polygon points="-20,-2 -26,-10 -22,-10 -15,-2" fill="${col}"/><polygon points="-20,2 -26,10 -22,10 -15,2" fill="${col}"/>`;
 return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-deg).toFixed(1)}) scale(${s})">${sh}</g>`;
}
export const P=(x,y,r,th)=>[x+r*Math.cos(th),y-r*Math.sin(th)];
export function arcArrow(x,y,r,th0,th1,{color=C.v,w=5,head=16}={}){
 const n=24,pts=[];for(let i=0;i<=n;i++)pts.push(P(x,y,r,mix(th0,th1,i/n)));
 const [ax,ay]=pts[n-4],[bx,by]=pts[n];
 return draw(pts.slice(0,n-3),1,{color,w})+arrow(ax,ay,bx,by,{color,w,head});
}

// ---------------- ボスの式 ----------------
export const BOSS=`t=\\dfrac{t_0}{\\sqrt{1-v^2/${cc}^2}}`;
export function bossFrame(x,y,w,h,{g=1,glow=0}={}){
 let s=rect(x,y,w,h,{fill:'#1a1430',fo:.95,stroke:HI,sw:4,rx:18});
 s+=fade(.35+.4*glow,rect(x-8,y-8,w+16,h+16,{fill:'none',fo:0,stroke:HI,sw:2,rx:24}));
 for(const [cx,cy] of [[x,y],[x+w,y],[x,y+h],[x+w,y+h]])s+=dot(cx,cy,7,HI);
 return fade(g,s);
}
export function bossPos(X,Y,size){
 const W=texWidth(BOSS,size),left=X-W/2,wEq=texWidth('t=',size),fracL=left+wEq,fracW=W-wEq;
 const wSq=texWidth(`\\sqrt{1-}`,size),wV=texWidth('v',size),wV2=texWidth(`\\sqrt{1-v^2/}`,size),wC=texWidth(cc,size);
 const denL=fracL+(fracW-texWidth(`\\sqrt{1-v^2/${cc}^2}`,size))/2;
 return {t:[left+texWidth('t',size)/2,Y-38],t0:[fracL+fracW/2,Y-size*.62-38],v:[denL+wSq+wV/2-size*.05+71,Y+size*.85-38],c:[denL+wV2+wC/2+10,Y+size*.85-38],den:[fracL+fracW/2,Y+size*.85],W};
}

// ---------------- 綱引き ----------------
export function tug(Tm,{g=1,leftTxt='',rightTxt='？',lean=0,shake=1,leftDone=0,rightGlow=0}={}){
 const k=(18*Math.sin(Tm*1.7)+6*Math.sin(Tm*4.3))*shake+lean;
 let s=line(150+k,420,1050+k,420,{color:'#c8a46a',w:7});
 s+=dot(600+k,420,13,HI);
 const fig=(x,dir,col)=>{const hx=x-dir*12,hy=362;return dot(hx,hy,12,col)+line(hx,hy+12,x+dir*8,445,{color:col,w:6})+line(x+dir*8,445,x+dir*28,490,{color:col,w:6})+line(x+dir*8,445,x-dir*6,494,{color:col,w:6})+line(hx+dir*2,hy+34,x+dir*34,420,{color:col,w:5});};
 for(const x of [230,300,370])s+=fig(x+k,-1,SLOW);
 for(const x of [830,900,970])s+=fig(x+k,1,FAST);
 s+=card(150,250,300,80,label('速さ',215,301,{size:30,color:SLOW,anchor:'middle',weight:700})+(leftTxt?label(leftTxt,350,302,{size:30,color:SLOW,anchor:'middle',weight:700}):''),1,leftDone?SLOW:C.faint);
 s+=card(750,250,300,80,label('高さ',815,301,{size:30,color:FAST,anchor:'middle',weight:700})+label(rightTxt,950,302,{size:34,color:FAST,anchor:'middle',weight:700}),1,rightGlow?FAST:C.faint);
 if(rightGlow)s+=fade(rightGlow*(.5+.5*Math.sin(Tm*4)),rect(744,244,312,92,{fill:'none',fo:0,stroke:FAST,sw:3,rx:18}));
 return fade(g,s);
}
