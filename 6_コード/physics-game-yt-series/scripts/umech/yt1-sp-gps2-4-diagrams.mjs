// 特別編 v2「GPS と相対性理論」パート4/4 (ys-sp-gps2-4) — 図。Stage 1200×515.
// v2 は難しさ★★★★：言葉の式（高さ×重力の強さ÷光の速さの2乗）を1本だけ。数値は結果だけ（計算の式は出さない）。
// v1 パート4の図（yt1-sp-gps-4-diagrams.mjs）は import して、そのまま、または時間を割り当て直して再利用する（編集しない）。
// 共通の部品（地球・衛星・時計・夜の地図など）は v1 から写して、このファイルの中に描く。
// 色：c・v 紫、時間 t 金、x・y・z 水色、力 緑、加速度 a 赤、差 黄。
// 衛星の時計が「遅れる」＝青 #6f9dff の下向き矢印と−、「進む」＝赤の上向き矢印と＋。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix,poly,lin,smooth} from './anim.mjs';
import {card,tag,TX,okMark,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {spGps4Diagrams as V1} from './yt1-sp-gps-4-diagrams.mjs';

const K='sp-gps2-4:';
const PI=Math.PI;
const SLOW='#6f9dff', FAST=C.a, HI=C.hi, CC=C.v, TC=C.t, XC=C.x, GRN=C.F, AC=C.a;
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',weight:700,...o});
const nn=v=>Number(v).toFixed(1);
const v1=(key,p,ctx)=>V1['sp-gps-4:'+key](clamp(p),ctx);

// ---------------------------------------------------------------- common parts (copied from v1)
function earth(x,y,R,{g=1}={}){
 let s=dot(x,y,R*1.07,'#3b74d6',.18)+dot(x,y,R,'#2a5fbf')
  +`<ellipse cx="${nn(x-R*.3)}" cy="${nn(y-R*.05)}" rx="${nn(R*.3)}" ry="${nn(R*.2)}" fill="#3f8f78" fill-opacity=".5"/>`
  +`<ellipse cx="${nn(x+R*.32)}" cy="${nn(y+R*.35)}" rx="${nn(R*.22)}" ry="${nn(R*.14)}" fill="#3f8f78" fill-opacity=".45"/>`
  +dot(x-R*.35,y-R*.38,R*.32,'#7fb0ff',.22)+ring(x,y,R,{color:'#8db8ff',w:2});
 return fade(g,s);
}
function sat(x,y,{k=1,g=1,rot=0}={}){
 const pan=(x0)=>rect(x0,-11,40,22,{fill:'#3466d8',fo:.95,stroke:'#9cc0ff',sw:1.5,rx:2})+line(x0+13,-11,x0+13,11,{color:'#9cc0ff',w:1})+line(x0+27,-11,x0+27,11,{color:'#9cc0ff',w:1});
 const s=`<g transform="translate(${nn(x)} ${nn(y)}) rotate(${nn(rot)}) scale(${k})">`
  +pan(-64)+pan(24)+line(-24,0,-14,0,{color:C.dim,w:3})+line(14,0,24,0,{color:C.dim,w:3})
  +rect(-15,-15,30,30,{fill:'#e0b043',fo:1,stroke:'#ffe08a',sw:2,rx:3})+line(0,15,0,24,{color:C.dim,w:2})+dot(0,26,4,'#ffe08a')+'</g>';
 return fade(g,s);
}
// analog clock; ang (if given) overrides the minute-hand angle
function clock(x,y,R,{T=0,rate=1,name='',col=C.ink,g=1,nameCol=null,off=0,ang=null,face='#131f38'}={}){
 let s=dot(x,y,R,face)+ring(x,y,R,{color:col,w:3});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.8*Math.sin(a),y-R*.8*Math.cos(a),x+R*.94*Math.sin(a),y-R*.94*Math.cos(a),{color:C.dim,w:i%3?2:3});}
 const am=ang??(T*rate*1.3+off), ah=am/12+.9;
 s+=line(x,y,x+R*.5*Math.sin(ah),y-R*.5*Math.cos(ah),{color:C.ink,w:5})+line(x,y,x+R*.8*Math.sin(am),y-R*.8*Math.cos(am),{color:TC,w:3})+dot(x,y,Math.max(4,R*.08),C.ink);
 if(name)s+=tag(name,x,y+R+32,{color:nameCol??col,size:24});
 return fade(g,s);
}
const upSign=(x,y,len,txt,{g=1,size=30,dx=16}={})=>fade(g,arrow(x,y,x,y-len,{color:FAST,w:6,head:18})+(txt?label(txt,x+dx,y-len/2+10,{size,color:FAST,weight:700}):''));
const downSign=(x,y,len,txt,{g=1,size=30,dx=16}={})=>fade(g,arrow(x,y,x,y+len,{color:SLOW,w:6,head:18})+(txt?label(txt,x+dx,y+len/2+10,{size,color:SLOW,weight:700}):''));
function stars(x,y,w,h,{off=0,g=1,n=46}={}){
 let s='';for(let i=0;i<n;i++){const px=x+((i*0.618034*997)%1)*w;let py=((i*0.414214*991)%1)*h+off;py=((py%h)+h)%h;s+=dot(px,y+py,i%5?1.6:2.6,'#cfd9ee',.75);}
 return fade(g,s);
}
function person(x,yf,h=150,{g=1,col=C.ink}={}){
 const hr=h*.11,hy=yf-h+hr,sh=yf-h*.74,hip=yf-h*.42;
 return fade(g,ring(x,hy,hr,{color:col,w:4,fill:'#131f38'})+line(x,hy+hr,x,hip,{color:col,w:5})
  +line(x,sh,x-h*.2,sh+h*.25,{color:col,w:4})+line(x,sh,x+h*.2,sh+h*.25,{color:col,w:4})
  +line(x,hip,x-h*.14,yf,{color:col,w:5})+line(x,hip,x+h*.14,yf,{color:col,w:5}));
}
function elevator(x,y,w,h,{g=1}={}){
 return fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:C.dim,sw:4,rx:4})+line(x,y+h,x+w,y+h,{color:C.ink,w:7})+line(x,y,x+w,y,{color:C.ink,w:5}));
}
function vwave(x,yb,yt,{lam0=30,stretch=0,amp=11,ph=0,color=HI,w=4,g=1,crests=0}={}){
 const H=yb-yt;if(H<=2)return '';const pts=[];let phase=0,last=null,cr='';
 for(let s=0;s<=H;s+=2){const lam=lam0*(1+stretch*s/H);phase+=2/lam;const q=phase-ph;pts.push([x+amp*Math.sin(2*PI*q),yb-s]);
  const k=Math.floor(q-.25);if(crests&&last!==null&&k!==last)cr+=line(x-24,yb-s,x+24,yb-s,{color:HI,w:2,opacity:.8});last=k;}
 return fade(g,draw(pts,1,{color,w})+cr);
}
function tower(x,yb,yt,{g=1,w=70}={}){
 const xl=x-w/2,xr=x+w/2,tl=x-12,tr=x+12;let s=line(xl,yb,tl,yt,{color:'#8a97ad',w:4})+line(xr,yb,tr,yt,{color:'#8a97ad',w:4});
 const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,y0=mix(yb,yt,u0),y1=mix(yb,yt,u1),a0=mix(xl,tl,u0),b0=mix(xr,tr,u0),a1=mix(xl,tl,u1),b1=mix(xr,tr,u1);
  s+=line(a0,y0,b1,y1,{color:'#5d6a82',w:2})+line(b0,y0,a1,y1,{color:'#5d6a82',w:2})+line(a1,y1,b1,y1,{color:'#8a97ad',w:2});}
 s+=rect(x-26,yt-14,52,14,{fill:'#8a97ad',fo:.9,stroke:'#8a97ad',rx:2});
 return fade(g,s);
}
function groundArc(yTop,{g=1,cx=600}={}){
 return fade(g,`<circle cx="${cx}" cy="${yTop+2600}" r="2600" fill="#1d3f7a" fill-opacity=".85" stroke="#8db8ff" stroke-width="3"/>`);
}
function nightMap(x,y,w,h,{T=0,pin=1,g=1,blur=0,pinAt=null,id='a'}={}){
 const cid=`spg24m${id}${Math.round(x)}_${Math.round(y)}`;
 let s=`<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/></clipPath>`;
 let inner=rect(x,y,w,h,{fill:'#0d1830',fo:1,stroke:'#2a3c60',rx:16});
 inner+=`<path d="M${x} ${y+h*.72} C${x+w*.3} ${y+h*.55} ${x+w*.55} ${y+h*.95} ${x+w} ${y+h*.7}" fill="none" stroke="#1d4c86" stroke-width="22" opacity=".8"/>`;
 for(let i=1;i<9;i++){const xx=x+w*i/9+((i*37)%17)-8;inner+=line(xx,y,xx+((i%3)-1)*30,y+h,{color:'#25385c',w:i%3?3:6});}
 for(let i=1;i<6;i++){const yy=y+h*i/6+((i*23)%13)-6;inner+=line(x,yy,x+w,yy+((i%2)?-20:14),{color:'#25385c',w:i%2?3:6});}
 for(let i=0;i<70;i++){const px=x+((i*0.618034*991)%1)*w,py=y+((i*0.754877*983)%1)*h;inner+=dot(px,py,2,i%4?'#ffcf67':'#e9f0ff',.35);}
 s+=`<g clip-path="url(#${cid})">${inner}</g>`;
 if(pin){const [cx,cy]=pinAt??[x+w*.52,y+h*.48],pu=(T*.8)%1;
  if(blur)s+=dot(cx,cy,blur,'#4d8dff',.18)+ring(cx,cy,blur,{color:'#4d8dff',w:2,dash:'6 6'});
  s+=fade(1-pu,ring(cx,cy,14+34*pu,{color:'#4d8dff',w:3}))+dot(cx,cy,14,'#4d8dff')+ring(cx,cy,14,{color:'#fff',w:3});}
 return fade(g,s);
}
function skytree(x,yb,yt,{g=1}={}){
 const H=yb-yt;const pts=[[x-60,yb],[x-14,yt+H*.32],[x-10,yt+H*.12],[x-4,yt],[x+4,yt],[x+10,yt+H*.12],[x+14,yt+H*.32],[x+60,yb]];
 let s=poly(pts,{fill:'#c7d2e6',fo:.85,stroke:'#e6edf8',sw:2});
 s+=rect(x-26,yt+H*.32-10,52,20,{fill:'#e6edf8',fo:1,stroke:'#fff',rx:6})+rect(x-18,yt+H*.18-8,36,14,{fill:'#e6edf8',fo:1,stroke:'#fff',rx:5});
 for(let i=1;i<7;i++){const y=yb-H*.32*i/7*2.1;if(y<yt+H*.34)break;const hw=mix(60,14,(yb-y)/(H*.68));s+=line(x-hw,y,x+hw,y,{color:'#8a97ad',w:2});}
 return fade(g,s);
}
function phone(x,y,w,h,{g=1,inner=''}={}){
 return fade(g,rect(x,y,w,h,{fill:'#0b1122',fo:1,stroke:'#cfd9ee',sw:5,rx:28})+inner+rect(x+w/2-30,y+12,60,8,{fill:'#cfd9ee',fo:.8,stroke:'#cfd9ee',rx:4}));
}
function digitRow(str,x,y,{size=54,sp=36,lit=99,col=C.ink,dimCol=C.faint,colorAt=null}={}){
 let s='',cx=x;
 for(let i=0;i<str.length;i++){const ch=str[i];const w=(ch==='.'||ch===',')?sp*.5:sp;const c=i<lit?(colorAt?colorAt(i):col):dimCol;
  s+=label(ch,cx+w/2,y,{size,color:c,anchor:'middle',weight:700});cx+=w;}
 return s;
}
const digitW=(str,sp=36)=>[...str].reduce((a,ch)=>a+((ch==='.'||ch===',')?sp*.5:sp),0);
const ruleNote=(s,x,y,g=1)=>fade(g,label(s,x,y,{size:22,color:C.dim,anchor:'middle'}));

// ---------------------------------------------------------------- v2 parts: staircase, quiz card
// 階段 ★1〜★4。lit = いま光っている段（1..4）。done=1 なら 1..lit を全部明るく。next>0 で、★4 の上に「？」の段。
function stairs(x,y,{k=1,lit=4,g=1,T=0,next=0,glow=1}={}){
 const sw=150*k,sh=56*k;let s='';
 for(let i=0;i<4;i++){
  const x0=x+i*sw,y0=y-(i+1)*sh,on=i+1===lit,past=i+1<lit;
  const col=on?HI:past?'#cfa94a':C.faint;
  s+=rect(x0,y0,sw,(i+1)*sh,{fill:on?HI:past?'#5b4a1c':'#1a2640',fo:on?.28:.9,stroke:col,sw:on?3:2,rx:4});
  s+=label('★'.repeat(i+1),x0+sw/2,y0+sh*.62,{size:Math.round(26*k),color:on?HI:past?'#e8c869':C.dim,anchor:'middle',weight:700});
  if(on)s+=fade(glow*(.5+.5*Math.sin(T*4)),rect(x0-4,y0-4,sw+8,(i+1)*sh+8,{fill:'none',fo:0,stroke:HI,sw:2,rx:6}));
 }
 if(next>0){const x0=x+4*sw,y0=y-5*sh;
  s+=fade(next,`<rect x="${nn(x0)}" y="${nn(y0)}" width="${nn(sw)}" height="${nn(5*sh)}" rx="4" fill="#0b1122" stroke="${HI}" stroke-width="2.5" stroke-dasharray="8 7"/>`
   +label('？',x0+sw/2,y0+sh*.7,{size:Math.round(34*k),color:HI,anchor:'middle',weight:700}));}
 return fade(g,s);
}
// Q. card: choices = [[letter,text],...]. ans = index of the right choice (lit with ansG). countdown during the cue's pause.
function quiz(x,y,w,h,{q=[],choices=[],g=1,ctx=null,ans=-1,ansG=0,cdG=1}={}){
 let s=rect(x,y,w,h,{fill:'#131f38',fo:.97,stroke:HI,sw:3,rx:16});
 s+=label('Q.',x+28,y+62,{size:52,color:HI,weight:700});
 q.forEach((t,i)=>{s+=label(t,x+110,y+52+i*40,{size:30,color:C.ink,weight:700});});
 const y0=y+62+q.length*40;
 choices.forEach(([a,t],i)=>{
  const yy=y0+i*72,right=i===ans,lit=right?ansG:0,dim=ans>=0?1-.55*ansG*(right?0:1):1;
  let r=rect(x+24,yy,w-48,58,{fill:right?HI:'#1a2640',fo:right?.08+.25*lit:.9,stroke:right&&lit>.01?HI:C.faint,sw:right?2+2*lit:2,rx:12});
  r+=dot(x+56,yy+29,20,right&&lit>.5?HI:'#2b3b5c')+label(a,x+56,yy+38,{size:26,color:right&&lit>.5?'#131f38':C.ink,anchor:'middle',weight:700});
  r+=label(t,x+92,yy+39,{size:28,color:right&&lit>.5?HI:C.ink,weight:700});
  if(right&&lit>.01)r+=fade(lit,okMark(x+w-60,yy+30));
  s+=fade(dim,r);
 });
 // countdown ring
 if(ctx&&cdG>0){
  const pz=ctx.cue?.pause??0,vEnd=Math.max(0,(ctx.dur??0)-pz),u=pz>0?clamp((ctx.t-vEnd)/pz):0;
  const cx=x+w-48,cy=y+46,R=28,circ=2*PI*R,left=1-u;
  let c=ring(cx,cy,R,{color:C.faint,w:6});
  if(u>0&&u<1)c+=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${HI}" stroke-width="6" stroke-dasharray="${nn(circ*left)} ${nn(circ)}" transform="rotate(-90 ${cx} ${cy})" stroke-linecap="round"/>`
   +label(String(Math.max(1,Math.ceil(left*pz))),cx,cy+11,{size:30,color:HI,anchor:'middle',weight:700});
  else if(u===0)c+=ring(cx,cy,R,{color:HI,w:6})+label(String(Math.round(pz)||''),cx,cy+11,{size:30,color:HI,anchor:'middle',weight:700});
  s+=fade(cdG*(u>=1?0:1),c);
 }
 return fade(g,s);
}

// ---------------------------------------------------------------- elevator quiz pieces
// a small elevator scene centred at cx: kind 'ground' or 'space'. out = opacity of the outside context.
function miniElev(cx,kind,T,{out=1,g=1,frame=0}={}){
 const ex=cx-90,ey=120,ew=180,eh=250,fy=ey+eh;let s='';
 if(kind==='space'){
  s+=fade(out,rect(cx-150,25,300,470,{fill:'#050a18',fo:.95,stroke:'#1c2a44',rx:14})+stars(cx-150,25,300,470,{off:16*T*T%470,n:30}));
  s+=fade(out,arrow(cx+118,fy-30,cx+118,ey+40,{color:AC,w:6,head:16})+L('加速',cx+118,fy+30,{size:24,color:AC}));
  s+=fade(out,L('宇宙で 加速',cx,85,{size:28}));
 } else {
  s+=fade(out,rect(cx-150,fy+4,300,80,{fill:'#1d3f7a',fo:.85,stroke:'#8db8ff',rx:4})+L('地面',cx,fy+56,{size:24,color:'#cfe0ff'}));
  s+=fade(out,arrow(cx+118,ey+40,cx+118,ey+150,{color:GRN,w:6,head:16})+L('重力',cx+118,ey+190,{size:24,color:GRN}));
  s+=fade(out,L('地上で 静止',cx,85,{size:28}));
 }
 s+=elevator(ex,ey,ew,eh)+rect(cx-60,fy-16,70,12,{fill:'#9aa6b8',fo:.9,stroke:C.dim,rx:3})+person(cx-25,fy-16,140);
 s+=arrow(cx+40,fy-70,cx+40,fy-26,{color:C.dim,w:3,head:10});
 if(frame>0)s+=fade(frame,rect(ex-8,ey-8,ew+16,eh+16,{fill:'none',fo:0,stroke:HI,sw:4,rx:8}));
 return fade(g,s);
}

// ---------------------------------------------------------------- tug of war
// off: rope shift in px (+ = toward 高さ/right). show: [left team, right team]
function puller(x,y,dir,col,T,ph){ // dir -1 pulls left, +1 pulls right; leans away from the centre
 const bob=3*Math.sin(T*6+ph);
 const fx=x+dir*-18,hx=x+dir*28,hy=y-118+bob,hip=[x+dir*12,y-55];
 return line(fx,y,hip[0],hip[1],{color:col,w:6})+line(fx+dir*26,y,hip[0],hip[1],{color:col,w:6})
  +line(hip[0],hip[1],hx,hy+16,{color:col,w:6})+ring(hx,hy,14,{color:col,w:4,fill:'#131f38'})
  +line(hx-dir*4,hy+34,x-dir*30,y-88,{color:col,w:5});
}
function tug(T,{off=0,left=1,right=1,bars=1,flagWin=0,g=1}={}){
 const gy=440,ry=352;let s='';
 s+=line(60,gy,1140,gy,{color:C.dim,w:3});
 s+=line(600,gy-150,600,gy+14,{color:C.faint,w:2,dash:'6 6'});
 s+=fade(flagWin,line(740,gy-150,740,gy+14,{color:FAST,w:3,dash:'8 6'})+L('高さの 勝ち',740,gy+44,{size:24,color:FAST}));
 s+=line(140+off,ry,1060+off,ry,{color:'#c9a46a',w:7});
 s+=poly([[600+off,ry],[600+off,ry-56],[640+off,ry-42]],{fill:HI,fo:1,stroke:HI})+line(600+off,ry,600+off,ry-58,{color:C.ink,w:3});
 s+=fade(left,[230,300,370].map((x,i)=>puller(x+off,gy,-1,SLOW,T,i)).join(''));
 s+=fade(right,[830,900,970].map((x,i)=>puller(x+off,gy,1,FAST,T,i+2)).join(''));
 // team signs
 s+=fade(left*bars,downSign(110,90,70,'',{})+L('速さ',190,110,{size:34,color:SLOW,anchor:'start'})+L('1日 −7 μs',190,156,{size:30,color:SLOW,anchor:'start'}));
 s+=fade(right*bars,upSign(1100,160,70,'',{})+L('高さ',1060,110,{size:34,color:FAST,anchor:'end'})+L('1日 ＋46 μs',1060,156,{size:30,color:FAST,anchor:'end'}));
 // strength bars (same scale): 7 vs 46
 const k=9;
 s+=fade(left*bars,rect(590-7*k,214,7*k,30,{fill:SLOW,fo:.7,stroke:SLOW,rx:4}));
 s+=fade(right*bars,rect(610,214,46*k*right,30,{fill:FAST,fo:.7,stroke:FAST,rx:4}));
 s+=fade(bars*Math.max(left,right),L('引く 強さ',600,200,{size:22,color:C.dim}));
 return fade(g,s);
}

// ---------------------------------------------------------------- black hole
function blackHole(x,y,R,T,{g=1}={}){
 let s='';
 for(let i=6;i>=1;i--)s+=dot(x,y,R*(1+i*.22),'#ff9a3c',.035*i/2);
 // back half of the disk
 const disk=(front)=>{let o='';for(let i=0;i<7;i++){const rx=R*(1.5+i*.28),ry=rx*.22,col=i<2?'#ffe7a8':i<4?'#ffb15a':'#e0632e',op=.85-i*.1;
   o+=`<path d="M${nn(x-rx)} ${nn(y)} A${nn(rx)} ${nn(ry)} 0 0 ${front?0:1} ${nn(x+rx)} ${nn(y)}" fill="none" stroke="${col}" stroke-width="${nn(5-i*.4)}" opacity="${nn(op)}" stroke-dasharray="${nn(14+i*3)} ${nn(6+i)}" stroke-dashoffset="${nn((front?-1:1)*T*40*(1+i*.2))}"/>`;}return o;};
 s+=disk(false);
 // lensed image of the far side (arc over the top)
 s+=`<path d="M${nn(x-R*1.25)} ${nn(y)} A${nn(R*1.25)} ${nn(R*1.25)} 0 0 1 ${nn(x+R*1.25)} ${nn(y)}" fill="none" stroke="#ffcf7a" stroke-width="6" opacity=".55"/>`;
 s+=ring(x,y,R*1.08,{color:'#ffe2a0',w:3})+dot(x,y,R,'#000');
 s+=disk(true);
 return fade(g,s);
}

// ================================================================ diagrams
export const spGps2_4Diagrams={
 // ================= S1 エレベーターの中では、区別できない =================
 [K+'s1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  const a=1-seg(p,.36,.46),b=seg(p,.42,.55);
  let s=fade(a,stairs(300,420,{k:1.2,lit:4,T})+L('いまの 段',300+3.5*180,420-4*67-30,{size:26,color:HI})+L('最後の 段：重力と 時間',600,490,{size:30,color:HI}));
  let tl=line(120,250,800,250,{color:C.dim,w:3});
  tl+=dot(230,250,12,CC)+L('1905年',230,215,{size:28,color:C.dim})+L('特殊相対性理論',230,300,{size:30,color:CC});
  tl+=fade(seg(p,.5,.6),arrow(320,250,570,250,{color:C.dim,w:4,head:16})+L('10年後',445,215,{size:26,color:C.dim}));
  tl+=fade(seg(p,.55,.65),dot(670,250,14,HI)+L('1915年',670,215,{size:28,color:C.dim})+L('重力の 理論',670,300,{size:32,color:HI})+L('一般相対性理論',670,340,{size:24,color:C.dim}));
  tl+=card(870,110,270,310,elevator(935,170,140,200)+person(980,354,110)+L('きっかけ',1005,152,{size:28,color:HI}),seg(p,.75,.85),HI);
  s+=fade(b,tl);
  return s;
 },
 [K+'s2']:(p,ctx)=>v1('d2',p,ctx),
 [K+'s3']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=miniElev(175,'ground',T,{g:seg(p,.02,.12)})+miniElev(1025,'space',T,{g:seg(p,.15,.28)});
  s+=quiz(340,25,520,465,{q:['この エレベーターは','どっち？'],choices:[['A','地上で 止まっている'],['B','宇宙で 加速している'],['C','中からは 決められない']],ctx,g:seg(p,.3,.42)});
  return s;
 },
 [K+'s4']:(p,ctx)=>{
  const T=sceneT(p,ctx);const o=1-seg(p,.3,.55),f=seg(p,.45,.65);
  let s=miniElev(175,'ground',T,{out:o,frame:f})+miniElev(1025,'space',T,{out:o,frame:f});
  s+=quiz(340,25,520,465,{q:['この エレベーターは','どっち？'],choices:[['A','地上で 止まっている'],['B','宇宙で 加速している'],['C','中からは 決められない']],ans:2,ansG:seg(p,.05,.2),cdG:0});
  s+=fade(f,L('中は 同じ',175,450,{size:28,color:HI})+L('中は 同じ',1025,450,{size:28,color:HI}));
  return s;
 },
 [K+'s5']:(p,ctx)=>v1('d4',p,ctx),
 [K+'s6']:(p,ctx)=>{
  const T=sceneT(p,ctx);const e={x:260,y:110,w:240,h:340},fy=e.y+e.h;
  let s=rect(100,20,560,490,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+stars(100,20,560,490,{off:18*T*T%490});
  s+=elevator(e.x,e.y,e.w,e.h)+rect(e.x+e.w/2-22,fy-16,44,14,{fill:HI,fo:.9,stroke:HI,rx:3});
  s+=arrow(e.x+e.w+60,fy-40,e.x+e.w+60,e.y+40,{color:AC,w:6,head:18})+L('加速',e.x+e.w+60,fy+30,{size:24,color:AC});
  const u=seg(p,.12,.5),st=seg(p,.45,.75)*.9;
  s+=vwave(e.x+e.w/2,fy-18,mix(fy-18,e.y+4,u),{lam0:30,stretch:st,ph:T*1.2,crests:1});
  s+=fade(seg(p,.05,.15),L('床',e.x-24,fy-6,{size:26,anchor:'end'})+L('天井',e.x-24,e.y+20,{size:26,anchor:'end'}));
  // spacing brackets: bottom (sent) vs top (received)
  const gb=seg(p,.55,.7),bot=30,top=30*(1+.9);
  const bx=e.x+e.w/2+40,lx=e.x+e.w+84;
  s+=fade(gb,line(bx,fy-40,bx,fy-40-bot,{color:C.ink,w:4})+line(bx+6,fy-55,lx-6,fy-55,{color:C.dim,w:1.5,dash:'4 4'})+L('出した 間隔',lx,fy-48,{size:22,anchor:'start',color:C.ink}));
  s+=fade(gb,line(bx,e.y+16,bx,e.y+16+top,{color:HI,w:4})+line(bx+6,e.y+44,lx-6,e.y+44,{color:C.dim,w:1.5,dash:'4 4'})+L('届いた 間隔',lx,e.y+52,{size:22,anchor:'start',color:HI}));
  s+=card(720,120,440,250,L('床 から 天井 へ 光',940,180,{size:30})+L('天井では 波が',940,250,{size:30})+L('引き伸ばされて 届く',940,300,{size:32,color:HI}),seg(p,.6,.75),HI);
  s+=ruleNote('大きく 誇張',940,420,seg(p,.6,.75));
  return s;
 },
 [K+'s7']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  // left: accelerating elevator (small)
  const e={x:90,y:100,w:170,h:300},fy=e.y+e.h;
  let a=rect(40,40,270,440,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+stars(40,40,270,440,{off:14*T*T%440,n:24});
  a+=elevator(e.x,e.y,e.w,e.h)+vwave(e.x+e.w/2,fy-8,e.y+6,{lam0:24,stretch:.9,ph:T*1.2,crests:1,amp:9});
  a+=arrow(285,fy-30,285,e.y+40,{color:AC,w:5,head:14});
  a+=L('加速',175,470,{size:24,color:AC});
  let s=fade(seg(p,.02,.12),a);
  s+=fade(seg(p,.12,.22),L('＝',380,270,{size:72,color:HI})+L('区別 できない',380,330,{size:22,color:HI}));
  // right: tower on the ground in gravity
  let b=rect(450,440,350,75,{fill:'#1d3f7a',fo:.85,stroke:'#8db8ff',rx:4})+tower(620,440,110,{w:80});
  b+=vwave(620,430,120,{lam0:24,stretch:.9*seg(p,.2,.45),ph:T*1.2,crests:1,amp:9});
  b+=arrow(740,170,740,300,{color:GRN,w:6,head:18})+L('重力',740,335,{size:24,color:GRN});
  b+=L('下',560,425,{size:24,anchor:'end'})+L('上',560,130,{size:24,anchor:'end'});
  s+=fade(seg(p,.18,.3),b);
  s+=card(830,120,340,280,L('下 から 上 へ',1000,180,{size:30})+L('届いた 光は',1000,230,{size:30})+L('刻みが',1000,295,{size:32,color:HI})+L('ゆっくりに 見える',1000,345,{size:32,color:HI}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'s8']:(p,ctx)=>v1('d9',p,ctx),
 [K+'s9']:(p,ctx)=>v1('d10',p,ctx),
 // ================= S2 スカイツリーで測った =================
 [K+'s10']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(470,{cx:400})+skytree(330,470,40,{g:seg(p,.05,.4)});
  s+=tag('実験',800,200,{color:HI,size:34,g:seg(p,.35,.55)})+fade(seg(p,.4,.6),L('本当に 測られた',800,280,{size:36,color:C.ink}));
  return s;
 },
 [K+'s11']:(p,ctx)=>{
  const T=sceneT(p,ctx);const yd=470-430*(450/634);
  let s=groundArc(470,{cx:400})+skytree(330,470,40);
  s+=fade(seg(p,.25,.4),line(380,yd,560,yd,{color:C.dim,w:2,dash:'6 6'})+line(200,470,200,yd,{color:XC,w:3})+line(188,yd,212,yd,{color:XC,w:3})+L('約 450 m',185,(470+yd)/2,{size:28,color:XC,anchor:'end'}));
  s+=fade(seg(p,.25,.4),L('展望台',380,yd-14,{size:24,color:C.dim,anchor:'start'}));
  s+=clock(640,yd,54,{T,rate:1,name:'展望台',g:seg(p,.6,.75)})+clock(640,400,54,{T,rate:1,name:'地上',g:seg(p,.6,.75)});
  s+=tag('実験',970,90,{color:HI,size:26,g:seg(p,.05,.2)});
  s+=card(790,140,370,150,L('2020年',975,190,{size:28,color:C.dim})+L('最先端の 時計',975,245,{size:34,color:TC}),seg(p,.6,.75),TC);
  return s;
 },
 [K+'s12']:(p,ctx)=>{
  const T=sceneT(p,ctx);const yd=470-430*(450/634);
  let s=groundArc(470,{cx:400})+skytree(330,470,40)+line(380,yd,560,yd,{color:C.dim,w:2,dash:'6 6'});
  s+=clock(640,yd,54,{T,rate:1.06,name:'展望台'})+clock(640,400,54,{T,rate:1,name:'地上'});
  s+=upSign(722,yd+40,90,'',{g:seg(p,.05,.2)});
  s+=card(790,60,380,240,L('1日に',980,110,{size:28})+L('約 10億分の 4 秒',980,175,{size:38,color:FAST})+L('速く 進んだ',980,235,{size:30,color:FAST})+L('（4 ナノ秒）',980,278,{size:22,color:C.dim}),seg(p,.1,.3),FAST);
  s+=fade(seg(p,.6,.75),okMark(820,390)+L('アインシュタインの',990,375,{size:28,color:GRN})+L('予言 どおり',990,420,{size:32,color:GRN}));
  return s;
 },
 [K+'s13']:(p,ctx)=>{
  // the one word equation of v2
  let s=fade(seg(p,.02,.12),L('進み方の 差の 割合',600,45,{size:30,color:C.dim}));
  const chip=(x,w,t,col,g)=>fade(g,rect(x,80,w,74,{fill:col,fo:.16,stroke:col,sw:3,rx:14})+L(t,x+w/2,129,{size:36,color:col}));
  const op=(t,x,g)=>fade(g,L(t,x,132,{size:44,color:C.ink}));
  const g1=seg(p,.08,.2),g2=seg(p,.18,.3),g3=seg(p,.28,.4);
  s+=fade(g1,L('≈',95,132,{size:44,color:C.ink}));
  s+=chip(135,150,'高さ',XC,g1)+op('×',318,g2)+chip(350,250,'重力の 強さ',AC,g2)+op('÷',635,g3)+chip(670,250,'光の 速さ',CC,g3)+fade(g3,L('2',935,100,{size:32,color:CC}));
  s+=tag('近似',1060,125,{color:HI,size:26,g:seg(p,.35,.45)});
  // numbers under the words
  const gn=seg(p,.5,.62);
  s+=fade(gn,arrow(210,162,210,196,{color:XC,w:3,head:10})+L('450 m',210,236,{size:32,color:XC})
   +arrow(475,162,475,196,{color:AC,w:3,head:10})+L('9.8 m/s²',475,236,{size:32,color:AC})
   +arrow(795,162,795,196,{color:CC,w:3,head:10})+L('秒速 30万 km',795,236,{size:32,color:CC}));
  s+=ruleNote('（重力の 強さ ＝ 重力加速度、光の 速さは 秒速 3億 m として 計算）',600,286,gn);
  s+=card(300,320,600,150,L('≈ 10兆分の 5',600,412,{size:56,color:HI}),seg(p,.72,.85),HI);
  return s;
 },
 [K+'s14']:(p,ctx)=>{
  const den='90,000,000,000,000,000',sp=34,W=digitW(den,sp),x=600-W/2;
  let s=fade(seg(p,.02,.12),L('光の 速さの 2乗 ＝ 3億 × 3億 ＝',600,60,{size:30,color:CC}));
  const n=Math.floor(mix(1,den.length,seg(p,.05,.4))+.001);
  s+=digitRow(den,x,140,{size:50,sp,lit:n,col:CC});
  s+=fade(seg(p,.35,.45),L('9京（けい）',600,195,{size:30,color:CC}));
  s+=fade(seg(p,.45,.55),arrow(600,215,600,260,{color:C.dim,w:4,head:14})+L('この 数で 割る',700,248,{size:26,color:C.dim,anchor:'start'}));
  const r='0.00000000000005',sp2=36,W2=digitW(r,sp2),x2=600-W2/2;
  const m=Math.floor(mix(0,r.length,seg(p,.5,.75))+.001);
  s+=digitRow(r,x2,330,{size:50,sp:sp2,lit:m,col:C.ink,colorAt:i=>i===r.length-1?HI:C.ink});
  s+=card(330,375,540,110,L('ふだんは まったく 気づかない',600,442,{size:34,color:HI}),seg(p,.75,.88),HI);
  return s;
 },
 [K+'s15']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=clock(380,150,70,{T,rate:1.003,name:''})+clock(380,370,70,{T,rate:1,name:''});
  s+=line(520,150,520,370,{color:XC,w:4})+line(505,150,535,150,{color:XC,w:4})+line(505,370,535,370,{color:XC,w:4})+L('高さ 1 cm',550,272,{size:34,color:XC,anchor:'start'});
  s+=fade(seg(p,.02,.15),L('（図は 拡大）',380,40,{size:22,color:C.dim}));
  s+=card(770,140,390,240,L('最先端の 時計',965,200,{size:30,color:TC})+L('1 cm の 違いまで',965,270,{size:32})+L('読み取れる',965,330,{size:34,color:HI}),seg(p,.35,.5),HI);
  return s;
 },
 [K+'s16']:(p,ctx)=>v1('h5',p,ctx),
 [K+'s17']:(p,ctx)=>{
  const T=sceneT(p,ctx);const u=seg(p,.1,.75),yrs=Math.round(80*u),diff=(0.44*u).toFixed(1);
  let s=line(100,470,420,470,{color:C.dim,w:3})+person(220,470,380);
  s+=clock(400,130,50,{T,rate:1.15,name:'頭',g:1})+clock(400,400,50,{T,rate:1,name:'足',g:1});
  s+=card(540,40,620,150,L('生きた 年',700,100,{size:28,color:C.dim})+L(`${yrs} 年`,700,160,{size:54,color:TC})+L('頭が 多く 年をとった 分',960,100,{size:24,color:FAST})+L(`${diff} μs`,960,160,{size:50,color:FAST}),1,C.faint);
  // bar of the accumulated difference
  s+=rect(560,230,580,36,{fill:'#1a2640',fo:1,stroke:C.faint,rx:6})+rect(560,230,580*u,36,{fill:FAST,fo:.6,stroke:FAST,rx:6});
  s+=card(560,320,580,150,L('80年で 約 100万分の 0.4 秒',850,385,{size:34,color:HI})+L('（0.4 マイクロ秒）',850,435,{size:24,color:C.dim}),seg(p,.78,.9),HI);
  return s;
 },
 // ================= S3 綱引きの決着 =================
 [K+'s18']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=earth(230,700,380);
  const u=seg(p,.05,.5);
  s+=draw([[360,330],[mix(360,860,u),mix(330,110,u)]],1,{color:C.faint,w:3,dash:'6 8'});
  s+=sat(mix(360,860,u),mix(330,110,u),{k:1.2,g:seg(p,.05,.15)});
  s+=fade(seg(p,.35,.5),L('高さ 約 2万 km',650,250,{size:32,color:XC}));
  s+=clock(1040,170,60,{T,rate:1,name:'衛星',col:TC,g:seg(p,.5,.65)});
  s+=fade(seg(p,.6,.75),L('？',1040,380,{size:90,color:HI}));
  return s;
 },
 [K+'s19']:(p,ctx)=>v1('t7',p,ctx)+ruleNote('上空では 重力が 弱く なる 分も 入れて 計算',300,60,seg(p,.05,.2)),
 [K+'s20']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  const l=seg(p,.02,.15),r=seg(p,.42,.55),off=-25*seg(p,.1,.4)+95*seg(p,.5,.95);
  return tug(T,{off,left:l,right:r});
 },
 [K+'s21']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  const off=70+90*seg(p,.02,.3),bars=1-seg(p,.2,.35);
  let s=tug(T,{off,bars,flagWin:seg(p,.15,.3)});
  s+=card(300,15,600,190,L('差し引き',600,60,{size:28,color:C.dim})+L('1日 約 ＋38 μs',600,135,{size:56,color:HI})+L('（45.7 − 7.2 ≈ 38.5）',600,180,{size:22,color:C.dim}),seg(p,.25,.4),HI);
  s+=card(40,15,240,120,L('予想は？',160,62,{size:26,color:C.dim})+L('速く 進む ＋',160,108,{size:28,color:FAST}),seg(p,.7,.82),FAST);
  return s;
 },
 [K+'s22']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=fade(seg(p,.02,.12),L('38 μs',220,70,{size:40,color:TC})+L('×',330,70,{size:40})+L('光の 速さ',470,70,{size:38,color:CC})+L('≈',610,70,{size:40})+L('約 11 km',740,70,{size:44,color:HI}));
  s+=tag('目安',1060,62,{color:HI,size:26,g:seg(p,.05,.15)});
  const mx=80,my=120,mw=1040,mh=380;
  s+=fade(seg(p,.25,.38),nightMap(mx,my,mw,mh,{T,pin:0,id:'d'}));
  const x0=mx+120,y0=my+mh*.5,step=270;
  const d=seg(p,.4,.95)*3,days=Math.floor(d+.0001);
  if(p>.25){
   s+=dot(x0,y0,12,'#4d8dff',.4)+ring(x0,y0,16,{color:'#4d8dff',w:2,dash:'4 4'})+L('正しい 場所',x0,y0+50,{size:22,color:C.dim});
   for(let i=1;i<=Math.min(3,days);i++)s+=line(x0+step*i,y0-18,x0+step*i,y0+18,{color:HI,w:3})+L(`${i}日 約 ${11*i} km`,x0+step*i,y0+56,{size:24,color:HI});
   const px=x0+step*d;
   if(d>0.01)s+=arrow(x0,y0-40,px,y0-40,{color:HI,w:4,head:14});
   s+=dot(px,y0,14,'#4d8dff')+ring(px,y0,14,{color:'#fff',w:3});
  }
  s+=fade(seg(p,.4,.5),L('補正しないと、毎日 たまっていく',600,my+mh-26,{size:26,color:C.ink}));
  return s;
 },
 // ================= S4 1977年の賭け =================
 [K+'s23']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=card(80,40,560,200,L('アインシュタインの 予言',360,100,{size:30,color:TC})+L('衛星の 時計は',360,155,{size:28})+L('1日 約 ＋38 μs 進む',360,205,{size:32,color:HI}),seg(p,.02,.15),TC);
  [[780,470],[930,470],[1080,470]].forEach(([x,y],i)=>{const g=seg(p,.25+i*.08,.38+i*.08);
   s+=person(x,y,170,{g})+fade(g,L('？',x+40,y-190+6*Math.sin(T*3+i),{size:48,color:HI}));});
  s+=fade(seg(p,.5,.62),L('技術者たち',930,232,{size:28,color:C.dim}));
  s+=fade(seg(p,.6,.72),L('本当に 信じて いた？',360,320,{size:36,color:HI}));
  return s;
 },
 [K+'s24']:(p,ctx)=>v1('f1',p,ctx)+fade(seg(p,.6,.75),L('「本当に 宇宙で 現れる？」 疑う 人も',300,460,{size:26,color:HI})),
 [K+'s25']:(p,ctx)=>v1('f2',p,ctx),
 [K+'s26']:(p,ctx)=>{
  const a=1-seg(p,.4,.46),b=seg(p,.4,.46)*(1-seg(p,.74,.8)),c=seg(p,.74,.8);
  return fade(a,v1('f3',p/.4,ctx))+fade(b,v1('f4',(p-.4)/.34,ctx))+fade(c,v1('f5',(p-.74)/.26,ctx));
 },
 [K+'s27']:(p,ctx)=>v1('f6',p,ctx),
 [K+'s28']:(p,ctx)=>{
  const a=1-seg(p,.36,.44),b=seg(p,.36,.44);
  return fade(a,v1('g1',p/.36,ctx))+fade(b,v1('g2',(p-.36)/.64,ctx));
 },
 [K+'s29']:(p,ctx)=>v1('g3',p/.7,ctx)+card(640,455,440,52,L('最初から 信じて 作られている',860,492,{size:26,color:HI}),seg(p,.72,.85),HI),
 // ================= S5 手のひらの上の物理 =================
 [K+'s30']:(p,ctx)=>v1('z1',p,ctx),
 [K+'s31']:(p,ctx)=>{
  const T=sceneT(p,ctx);const mx=40,my=20,mw=1120,mh=480,px=mx+mw*.52,py=my+mh*.48;
  let s=fade(.6,nightMap(mx,my,mw,mh,{T,id:'b'}));
  const sats=[[160,80],[420,60],[820,70],[1060,110]];
  sats.forEach(([x,y],i)=>{const g=seg(p,.05+i*.05,.15+i*.05);s+=fade(g,draw([[x,y],[px,py]],1,{color:TC,w:3,dash:'8 6'})+sat(x,y,{k:.75}));});
  const steps=[['① 衛星の 時刻を 聞く',TC],['② 届くまでの 時間 → 距離',CC],['③ 4機で 場所と 時計の ずれ',XC]];
  steps.forEach(([t,col],i)=>{s+=card(60+i*370,385,350,90,L(t,235+i*370,440,{size:24,color:col}),seg(p,.1+i*.28,.22+i*.28),col);});
  return s;
 },
 [K+'s32']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=sat(170,120,{k:1.3})+clock(170,300,62,{T,rate:1.3,name:'衛星',col:TC});
  s+=downSign(330,150,80,'速さで 遅れ',{g:seg(p,.05,.18),size:26});
  s+=upSign(330,420,80,'高さで 進む',{g:seg(p,.15,.28),size:26});
  const mx=560,my=40,mw=600,mh=380,fix=seg(p,.55,.75);
  const cx=mx+mw*.52,cy=my+mh*.48;
  const wob=(1-fix)*90;const ox=wob*Math.sin(T*2.3),oy=wob*.6*Math.cos(T*1.7);
  s+=fade(seg(p,.35,.45),nightMap(mx,my,mw,mh,{T,pinAt:[cx+ox,cy+oy],blur:fix<.95?10+wob*.6:0,id:'c'}));
  s+=fade(fix,ring(cx,cy,30,{color:HI,w:3})+okMark(cx+50,cy-30));
  s+=card(mx+40,my+mh+10,mw-80,60,L('両方を 計算に 入れて はじめて、正しい 場所',mx+mw/2,my+mh+50,{size:24,color:HI}),seg(p,.6,.72),HI);
  return s;
 },
 [K+'s33']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=fade(.35,nightMap(40,20,1120,480,{T,id:'e'}));
  const items=[[['ニュートンの','重力'],'衛星を 回す',GRN],[['電波が','光の 速さで'],'時刻を 運ぶ',CC],[['アインシュタインの','相対性理論'],'時計を 合わせる',TC]];
  items.forEach(([a,b,col],i)=>{const x=60+i*370,g=seg(p,.12+i*.24,.24+i*.24);
   s+=card(x,130,340,240,L(a[0],x+170,190,{size:28,color:col})+L(a[1],x+170,240,{size:34,color:col})+L(b,x+170,320,{size:30,color:C.ink}),g,col);});
  return s;
 },
 [K+'s34']:(p,ctx)=>{
  const T=sceneT(p,ctx);const u=seg(p,.15,.6);
  const ph={x:490,y:40,w:220,h:440};
  let inner=nightMap(ph.x+14,ph.y+36,ph.w-28,ph.h-60,{T,id:'f'});
  let s=phone(ph.x,ph.y,ph.w,ph.h,{inner,g:seg(p,.02,.2)})+fade(seg(p,.55,.7),ring(600,260,150+8*Math.sin(T*2),{color:HI,w:3}));
  const cols=[GRN,CC,TC],names=['重力','光の 速さ','相対性理論'];
  const start=[[200,130],[1000,130],[600,470]];
  cols.forEach((col,i)=>{const [sx,sy]=start[i],x=mix(sx,600,u),y=mix(sy,260,u),k=mix(1,.7,u);
   s+=fade(1-seg(p,.5,.65),rect(x-120*k,y-34*k,240*k,68*k,{fill:'#131f38',fo:.95,stroke:col,sw:3,rx:12})+label(names[i],x,y+11*k,{size:Math.max(22,30*k),color:col,anchor:'middle',weight:700}));});
  s+=card(790,200,380,110,L('一つに なる',980,268,{size:38,color:HI}),seg(p,.6,.75),HI);
  s+=card(30,200,400,110,L('教科書の 別々の ページ',230,268,{size:28,color:C.dim}),seg(p,.02,.15)*(1-seg(p,.5,.62)),C.faint);
  return s;
 },
 [K+'s35']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=stairs(170,470,{k:1.25,lit:4,T,next:seg(p,.35,.6)});
  s+=fade(seg(p,.05,.2),L('ここまで 登った',170+2*187,170,{size:28,color:C.dim}));
  s+=fade(seg(p,.55,.75),L('まだ 先が ある',170+4.5*187,470-5*70-24,{size:30,color:HI}));
  return s;
 },
 [K+'s36']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=fade(.6,stars(0,0,1200,515,{n:70}));
  s+=blackHole(250,300,78,T,{g:seg(p,.02,.15)});
  // three clocks: far → near, each slower
  const cl=[[1080,1,'遠く'],[880,.45,'近く'],[680,.08,'すぐ そば']];
  cl.forEach(([x,rate,nm],i)=>{const g=seg(p,.08+i*.1,.2+i*.1);
   s+=clock(x,335,52,{T,rate,name:nm,g,col:i===2?SLOW:C.ink,nameCol:i===2?SLOW:C.dim});});
  s+=fade(seg(p,.3,.42),arrow(1060,455,700,455,{color:SLOW,w:4,head:14})+L('重力が 強い ほど ゆっくり',880,495,{size:24,color:SLOW}));
  s+=fade(seg(p,.38,.5),L('？',680,272,{size:44,color:HI}));
  s+=fade(seg(p,.45,.58),rect(470,20,710,215,{fill:'#131f38',fo:.96,stroke:HI,sw:5,rx:18})
   +L('ブラックホールの そばでは',825,95,{size:40,color:C.ink})+L('時間は どうなる？',825,175,{size:52,color:HI}));
  return s;
 },
};
