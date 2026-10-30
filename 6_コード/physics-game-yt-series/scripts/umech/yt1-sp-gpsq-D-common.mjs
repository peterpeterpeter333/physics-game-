// 特別編 v3「疑問20連発」担当D（Q16〜Q20）の共通部品。Stage 1200×515.
// ファイル名が yt1-*-diagrams.mjs ではないので自動では読み込まれない（Q16〜Q20 の図ファイルが import する）。
// - qHud：画面上の右寄りの Q1〜Q20 の点の列（直径 12px・間隔 22px）と、その左の★。
//     解いた Q＝水色の塗り、いまの Q＝黄色の輪で光る、未来の Q＝灰の輪。
// - qCard：各本の最初の cue（中央に大きく黄色の「Q.n」、その下に白で問い）。
// - nextQ：橋の cue（最後）の右下「次の疑問 →」。
// - v1 / v2：特別編 v1・v2 パート4の図（編集しない。import して再利用する）。
// 色：c・v 紫、時間 t 金、x・y・z 水色、力 緑、加速度 a 赤、差 黄。遅れる＝青 #6f9dff の下向き矢印と−、進む＝赤の上向き矢印と＋。
import {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,mix,poly} from './anim.mjs';
import {card,tag,okMark,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {spGps4Diagrams as V1} from './yt1-sp-gps-4-diagrams.mjs';
import {spGps2_4Diagrams as V2} from './yt1-sp-gps2-4-diagrams.mjs';
export {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,mix,poly,card,tag,okMark,sceneT};

const PI=Math.PI;
export const SLOW='#6f9dff', FAST=C.a, HI=C.hi, CC=C.v, TC=C.t, XC=C.x, GRN=C.F, AC=C.a;
export const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',weight:700,...o});
const nn=v=>Number(v).toFixed(1);
export const v1=(key,p,ctx)=>V1['sp-gps-4:'+key](clamp(p),ctx);
export const v2=(key,p,ctx)=>V2['sp-gps2-4:'+key](clamp(p),ctx);
// shrink a picture about the bottom centre so its top clears the Q-dot row
export const lower=(svg,k=.94)=>`<g transform="translate(600 515) scale(${k}) translate(-600 -515)">${svg}</g>`;

// ---------------------------------------------------------------- Q1〜Q20 dot row
// n = the current Q (1..20). done = 0..1 : the finale fills the current dot too (Q20).
export function qHud(n,{T=0,done=0,stars=4}={}){
 const R=6,gap=22,xr=1182,y=17,x0=xr-19*gap,sx=x0-20;
 const starTxt='★'.repeat(stars),sw=stars*22;
 let s=rect(sx-sw-14,1,xr+R+14-(sx-sw-14),32,{fill:C.bg,fo:.82,stroke:'#22324f',sw:1.5,rx:16});
 s+=label(starTxt,sx,y+8,{size:22,color:HI,anchor:'end',weight:700});
 for(let i=0;i<20;i++){
  const x=x0+i*gap,q=i+1;
  if(q<n)s+=dot(x,y,R,XC);
  else if(q===n){
   const pulse=.5+.5*Math.sin(T*4);
   if(done>0)s+=fade(done,dot(x,y,R,XC));
   s+=fade(1-done,ring(x,y,R+3+2*pulse,{color:HI,w:1.5})+dot(x,y,R*.45,HI,.6*pulse));
   s+=ring(x,y,R,{color:done>.5?XC:HI,w:2.5});
  }
  else s+=ring(x,y,R-1,{color:'#66748e',w:2});
 }
 return s;
}
// the Q card of the first cue
export function qCard(n,q,{g=1,T=0}={}){
 let s=rect(150,70,900,330,{fill:'#131f38',fo:.96,stroke:HI,sw:3,rx:22});
 s+=label(`Q.${n}`,600,250,{size:132,color:HI,anchor:'middle',weight:800});
 s+=label(q,600,345,{size:44,color:C.ink,anchor:'middle',weight:700});
 s+=line(420,290,780,290,{color:HI,w:2,opacity:.35});
 return fade(g,s);
}
// the bridge mark of the last cue
export function nextQ(p,T=0,{x=1182,y=492}={}){
 const g=seg(p,.3,.45),w=200,bob=4*Math.sin(T*4);
 return fade(g,rect(x-w,y-36,w,50,{fill:'#131f38',fo:.94,stroke:HI,sw:2.5,rx:25})
  +label('次の疑問',x-w+24,y-2,{size:26,color:HI,weight:700})
  +arrow(x-62+bob,y-11,x-22+bob,y-11,{color:HI,w:4,head:14}));
}

// ---------------------------------------------------------------- parts copied from v2 (v2 does not export them)
export function earth(x,y,R,{g=1}={}){
 let s=dot(x,y,R*1.07,'#3b74d6',.18)+dot(x,y,R,'#2a5fbf')
  +`<ellipse cx="${nn(x-R*.3)}" cy="${nn(y-R*.05)}" rx="${nn(R*.3)}" ry="${nn(R*.2)}" fill="#3f8f78" fill-opacity=".5"/>`
  +`<ellipse cx="${nn(x+R*.32)}" cy="${nn(y+R*.35)}" rx="${nn(R*.22)}" ry="${nn(R*.14)}" fill="#3f8f78" fill-opacity=".45"/>`
  +dot(x-R*.35,y-R*.38,R*.32,'#7fb0ff',.22)+ring(x,y,R,{color:'#8db8ff',w:2});
 return fade(g,s);
}
export function clock(x,y,R,{T=0,rate=1,name='',col=C.ink,g=1,nameCol=null,off=0,ang=null,face='#131f38'}={}){
 let s=dot(x,y,R,face)+ring(x,y,R,{color:col,w:3});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.8*Math.sin(a),y-R*.8*Math.cos(a),x+R*.94*Math.sin(a),y-R*.94*Math.cos(a),{color:C.dim,w:i%3?2:3});}
 const am=ang??(T*rate*1.3+off), ah=am/12+.9;
 s+=line(x,y,x+R*.5*Math.sin(ah),y-R*.5*Math.cos(ah),{color:C.ink,w:5})+line(x,y,x+R*.8*Math.sin(am),y-R*.8*Math.cos(am),{color:TC,w:3})+dot(x,y,Math.max(4,R*.08),C.ink);
 if(name)s+=tag(name,x,y+R+32,{color:nameCol??col,size:24});
 return fade(g,s);
}
export const upSign=(x,y,len,txt,{g=1,size=30,dx=16}={})=>fade(g,arrow(x,y,x,y-len,{color:FAST,w:6,head:18})+(txt?label(txt,x+dx,y-len/2+10,{size,color:FAST,weight:700}):''));
export function tower(x,yb,yt,{g=1,w=70}={}){
 const xl=x-w/2,xr=x+w/2,tl=x-12,tr=x+12;let s=line(xl,yb,tl,yt,{color:'#8a97ad',w:4})+line(xr,yb,tr,yt,{color:'#8a97ad',w:4});
 const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,y0=mix(yb,yt,u0),y1=mix(yb,yt,u1),a0=mix(xl,tl,u0),b0=mix(xr,tr,u0),a1=mix(xl,tl,u1),b1=mix(xr,tr,u1);
  s+=line(a0,y0,b1,y1,{color:'#5d6a82',w:2})+line(b0,y0,a1,y1,{color:'#5d6a82',w:2})+line(a1,y1,b1,y1,{color:'#8a97ad',w:2});}
 s+=rect(x-26,yt-14,52,14,{fill:'#8a97ad',fo:.9,stroke:'#8a97ad',rx:2});
 return fade(g,s);
}
export function groundArc(yTop,{g=1,cx=600}={}){
 return fade(g,`<circle cx="${cx}" cy="${yTop+2600}" r="2600" fill="#1d3f7a" fill-opacity=".85" stroke="#8db8ff" stroke-width="3"/>`);
}
// magnifier lens with content clipped inside
export function lens(x,y,R,inner,{g=1,id='q'}={}){
 const cid=`spgq${id}${Math.round(x)}_${Math.round(y)}`;
 return fade(g,`<clipPath id="${cid}"><circle cx="${x}" cy="${y}" r="${R}"/></clipPath>`+dot(x,y,R,'#0f1a30',.96)+`<g clip-path="url(#${cid})">${inner}</g>`
  +ring(x,y,R,{color:C.ink,w:5})+line(x+R*.72,y+R*.72,x+R*1.25,y+R*1.25,{color:C.ink,w:12}));
}
