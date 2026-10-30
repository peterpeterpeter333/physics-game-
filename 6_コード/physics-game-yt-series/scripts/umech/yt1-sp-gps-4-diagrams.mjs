// 特別編「GPS と相対性理論」パート4/4 (ys-sp-gps-4) — 図。Stage 1200×515.
// 色：c・v 紫、時間 t 金、x・y・z 水色、b 金、力 緑、加速度 a 赤、エネルギー（位置エネルギー）橙、差 黄。
// 衛星の時計が「遅れる」＝青 #6f9dff の下向き矢印と−、「進む」＝赤の上向き矢印と＋。
// 共通の部品（地球・衛星・時計・夜の地図）はこのファイルの中に描く（他パートのファイルは読み込まない）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp,mix,poly,lin} from './anim.mjs';
import {card,tag,TX,fcard,cs,cross,okMark,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';

const K='sp-gps-4:';
const PI=Math.PI;
const SLOW='#6f9dff', FAST=C.a, HI=C.hi, CC=C.v, TC=C.t, XC=C.x, EC=C.E, GRN=C.F, AC=C.a;
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',weight:700,...o});
const U=s=>`\\,\\mathrm{${s}}`;
const ct=cs(CC,'c'), gt=cs(AC,'g'), ht=cs(XC,'h'), rt=cs(XC,'r'), Rt=cs(XC,'R');
const nn=v=>Number(v).toFixed(1);

// ---------------------------------------------------------------- common parts
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
function clock(x,y,R,{T=0,rate=1,name='',col=C.ink,g=1,nameCol=null,off=0}={}){
 let s=dot(x,y,R,'#131f38')+ring(x,y,R,{color:col,w:3});
 for(let i=0;i<12;i++){const a=i*PI/6;s+=line(x+R*.8*Math.sin(a),y-R*.8*Math.cos(a),x+R*.94*Math.sin(a),y-R*.94*Math.cos(a),{color:C.dim,w:i%3?2:3});}
 const am=T*rate*1.3+off, ah=am/12+.9;
 s+=line(x,y,x+R*.5*Math.sin(ah),y-R*.5*Math.cos(ah),{color:C.ink,w:5})+line(x,y,x+R*.8*Math.sin(am),y-R*.8*Math.cos(am),{color:TC,w:3})+dot(x,y,Math.max(4,R*.08),C.ink);
 if(name)s+=tag(name,x,y+R+32,{color:nameCol??col,size:24});
 return fade(g,s);
}
// clock runs fast (red up arrow +) / slow (blue down arrow −)
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
function bathScale(x,y,{val='60.0',g=1}={}){ // y = top surface
 return fade(g,rect(x-46,y,92,16,{fill:'#9aa6b8',fo:.9,stroke:C.dim,rx:4})+rect(x+50,y-34,104,42,{fill:'#0f1a30',fo:1,stroke:XC,rx:6})+label(`${val} kg`,x+102,y-5,{size:24,color:XC,anchor:'middle',weight:700}));
}
function elevator(x,y,w,h,{g=1,dash=''}={}){
 if(dash)return fade(g,`<rect x="${nn(x)}" y="${nn(y)}" width="${w}" height="${h}" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="${dash}"/>`);
 return fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:C.dim,sw:4,rx:4})+line(x,y+h,x+w,y+h,{color:C.ink,w:7})+line(x,y,x+w,y,{color:C.ink,w:5}));
}
// vertical light wave from yb (bottom) up to yt; wavelength grows from lam0 to lam0*(1+stretch) toward the top
function vwave(x,yb,yt,{lam0=30,stretch=0,amp=11,ph=0,color=HI,w=4,g=1,crests=0}={}){
 const H=yb-yt;if(H<=2)return '';const pts=[];let phase=0,last=null,cr='';
 for(let s=0;s<=H;s+=2){const lam=lam0*(1+stretch*s/H);phase+=2/lam;const q=phase-ph;pts.push([x+amp*Math.sin(2*PI*q),yb-s]);
  const k=Math.floor(q-.25);if(crests&&last!==null&&k!==last)cr+=line(x-26,yb-s,x+26,yb-s,{color:HI,w:2,opacity:.8});last=k;}
 return fade(g,draw(pts,1,{color,w})+cr);
}
function tower(x,yb,yt,{g=1,w=70}={}){ // lattice tower, base width w
 const xl=x-w/2,xr=x+w/2,tl=x-12,tr=x+12;let s=line(xl,yb,tl,yt,{color:'#8a97ad',w:4})+line(xr,yb,tr,yt,{color:'#8a97ad',w:4});
 const n=8;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,y0=mix(yb,yt,u0),y1=mix(yb,yt,u1),a0=mix(xl,tl,u0),b0=mix(xr,tr,u0),a1=mix(xl,tl,u1),b1=mix(xr,tr,u1);
  s+=line(a0,y0,b1,y1,{color:'#5d6a82',w:2})+line(b0,y0,a1,y1,{color:'#5d6a82',w:2})+line(a1,y1,b1,y1,{color:'#8a97ad',w:2});}
 s+=rect(x-26,yt-14,52,14,{fill:'#8a97ad',fo:.9,stroke:'#8a97ad',rx:2});
 return fade(g,s);
}
function groundArc(yTop,{g=1,cx=600}={}){ // the Earth's surface seen up close
 return fade(g,`<circle cx="${cx}" cy="${yTop+2600}" r="2600" fill="#1d3f7a" fill-opacity=".85" stroke="#8db8ff" stroke-width="3"/>`);
}
function nightMap(x,y,w,h,{T=0,pin=1,g=1,blur=0}={}){
 let s=`<clipPath id="spg4m${Math.round(x)}_${Math.round(y)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/></clipPath>`;
 let inner=rect(x,y,w,h,{fill:'#0d1830',fo:1,stroke:'#2a3c60',rx:16});
 inner+=`<path d="M${x} ${y+h*.72} C${x+w*.3} ${y+h*.55} ${x+w*.55} ${y+h*.95} ${x+w} ${y+h*.7}" fill="none" stroke="#1d4c86" stroke-width="22" opacity=".8"/>`;
 for(let i=1;i<9;i++){const xx=x+w*i/9+((i*37)%17)-8;inner+=line(xx,y,xx+((i%3)-1)*30,y+h,{color:'#25385c',w:i%3?3:6});}
 for(let i=1;i<6;i++){const yy=y+h*i/6+((i*23)%13)-6;inner+=line(x,yy,x+w,yy+((i%2)?-20:14),{color:'#25385c',w:i%2?3:6});}
 for(let i=0;i<70;i++){const px=x+((i*0.618034*991)%1)*w,py=y+((i*0.754877*983)%1)*h;inner+=dot(px,py,2,i%4?'#ffcf67':'#e9f0ff',.35);}
 s+=`<g clip-path="url(#spg4m${Math.round(x)}_${Math.round(y)})">${inner}</g>`;
 if(pin){const cx=x+w*.52,cy=y+h*.48,pu=(T*.8)%1;
  if(blur)s+=dot(cx,cy,blur,'#4d8dff',.18)+ring(cx,cy,blur,{color:'#4d8dff',w:2,dash:'6 6'});
  s+=fade(1-pu,ring(cx,cy,14+34*pu,{color:'#4d8dff',w:3}))+dot(cx,cy,14,'#4d8dff')+ring(cx,cy,14,{color:'#fff',w:3});}
 return fade(g,s);
}
const mapPin=(x,y,w,h)=>[x+w*.52,y+h*.48];
function ruleNote(s,x,y,g=1){return fade(g,label(s,x,y,{size:22,color:C.dim,anchor:'middle'}));}

// ---------------------------------------------------------------- elevator scene pieces
const EL={L:{x:150,y:120,w:220,h:290},R:{x:830,y:120,w:220,h:290}};
function groundElevator(T,{g=1,lab=1}={}){
 const e=EL.L,fy=e.y+e.h;let s='';
 s+=rect(60,fy+4,420,90,{fill:'#1d3f7a',fo:.8,stroke:'#8db8ff',rx:4})+L('地面',270,fy+60,{size:24,color:'#cfe0ff'});
 s+=elevator(e.x,e.y,e.w,e.h)+bathScale(e.x+70,fy-16,{})+person(e.x+70,fy-16,150);
 s+=arrow(e.x+150,fy-210,e.x+150,fy-110,{color:GRN,w:5,head:14})+label('重力',e.x+162,fy-150,{size:24,color:GRN,weight:700});
 if(lab)s+=L('地上で 止まっている',e.x+e.w/2,e.y-22,{size:28});
 return fade(g,s);
}
function spaceElevator(T,{g=1,lab=1,acc=1}={}){
 const e=EL.R,fy=e.y+e.h;let s=rect(700,40,480,470,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14});
 s+=stars(700,40,480,470,{off:acc?18*T*T%470:0});
 s+=elevator(e.x,e.y,e.w,e.h)+bathScale(e.x+70,fy-16,{})+person(e.x+70,fy-16,150);
 s+=arrow(e.x+e.w+50,fy-40,e.x+e.w+50,e.y+40,{color:AC,w:6,head:18})+label('a',e.x+e.w+66,e.y+e.h/2,{size:34,color:AC,weight:700});
 if(lab)s+=L('宇宙で 上向きに 加速',e.x+e.w/2,e.y-22,{size:28});
 return fade(g,s);
}

// ---------------------------------------------------------------- −GM/r graph
const GR={x0:110,y0:110,kx:620/30000,ky:4.95,xmax:30000};
const gx=r=>GR.x0+r*GR.kx, gy=u=>GR.y0-u*GR.ky; // u in MJ/kg (negative)
const GMm=3.986e14, RE=6371, RS=26600;
const phi=r=>-GMm/(r*1e3)/1e6;
function wellGraph({g=1,draw:dp=1,marks=1,diff=0}={}){
 let s=line(GR.x0,GR.y0,GR.x0+650,GR.y0,{color:C.dim,w:3})+line(GR.x0,GR.y0-30,GR.x0,gy(-66),{color:C.dim,w:3});
 s+=label('0',GR.x0-14,GR.y0+8,{size:24,color:C.dim,anchor:'end'});
 s+=label('地球の 中心からの 距離',GR.x0+650,GR.y0-14,{size:24,color:XC,anchor:'end',weight:700});
 s+=label('1 kg あたりの 位置エネルギー',GR.x0+14,GR.y0+40,{size:24,color:EC,weight:700});
 const pts=[];for(let r=RE;r<=GR.xmax;r+=150)pts.push([gx(r),gy(phi(r))]);
 s+=draw(pts,dp,{color:EC,w:5});
 s+=fade(dp,TX(`-\\dfrac{GM}{${rt}}`,gx(16000),gy(phi(16000))+70,{size:40}));
 const xR=gx(RE),yR=gy(phi(RE)),xS=gx(RS),yS=gy(phi(RS));
 s+=fade(marks,earth(xR,yR,20)+L('地表',xR-34,yR+8,{size:24,anchor:'end'})+TX(Rt,xR,yR+50,{size:30}));
 s+=fade(marks,sat(xS,yS-30,{k:.6})+L('衛星',xS+46,yS-22,{size:24,anchor:'start'})+TX(rt,xS+30,yS+34,{size:30})+dot(xS,yS,6,HI));
 if(diff>0){
  s+=fade(diff,line(xR,yR,xS+40,yR,{color:HI,w:2,dash:'8 6'})+arrow(xS+40,yR,xS+40,yS+4,{color:HI,w:5,head:16})+L('差',xS+64,(yR+yS)/2+8,{size:28,color:HI}));
 }
 return fade(g,s);
}

// ---------------------------------------------------------------- balance (tug-of-war result)
function balance({g=1,u=0,load=1}={}){
 const cx=600,cy=170,Lb=300,a=.13*u;
 const lx=cx-Lb*Math.cos(a),ly=cy-Lb*Math.sin(a),rx=cx+Lb*Math.cos(a),ry=cy+Lb*Math.sin(a);
 let s=poly([[cx-50,cy+300],[cx+50,cy+300],[cx,cy]],{fill:'#56627a',fo:1,stroke:C.dim});
 s+=line(lx,ly,rx,ry,{color:C.ink,w:6})+dot(cx,cy,9,C.ink);
 const pan=(px,py)=>line(px,py,px-80,py+100,{color:C.dim,w:2})+line(px,py,px+80,py+100,{color:C.dim,w:2})+line(px-95,py+100,px+95,py+100,{color:C.ink,w:5});
 s+=pan(lx,ly)+pan(rx,ry);
 s+=fade(load,rect(lx-50,ly+58,100,42,{fill:SLOW,fo:.5,stroke:SLOW,rx:6})+label('−7',lx,ly+90,{size:30,color:'#fff',anchor:'middle',weight:700}));
 s+=fade(load,rect(rx-70,ry+20,140,80,{fill:FAST,fo:.5,stroke:FAST,rx:6})+label('＋46',rx,ry+72,{size:36,color:'#fff',anchor:'middle',weight:700}));
 s+=fade(load,downSign(lx-150,ly+20,70,'',{})+L('速さ',lx-150,ly+130,{size:28,color:SLOW})+L('1日 −7 μs',lx-150,ly+166,{size:26,color:SLOW}));
 s+=fade(load,upSign(rx+150,ry+100,70,'',{})+L('高さ',rx+150,ry+130,{size:28,color:FAST})+L('1日 ＋46 μs',rx+150,ry+166,{size:26,color:FAST}));
 return fade(g,s);
}

// ---------------------------------------------------------------- misc pictures
function switchBox(x,y,{on=0,g=1}={}){ // on in 0..1
 let s=rect(x,y,300,150,{fill:'#131f38',fo:1,stroke:C.dim,rx:12})+L('補正の 装置',x+150,y+40,{size:28});
 const kx=mix(x+110,x+190,on),col=on>.5?GRN:'#7d889c';
 s+=rect(x+90,y+80,120,44,{fill:col,fo:.35,stroke:col,rx:22})+dot(kx,y+102,18,on>.5?GRN:'#b8c2d4');
 s+=label(on>.5?'入':'切',x+245,y+112,{size:28,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
function digitRow(str,x,y,{size=54,sp=36,lit=99,col=C.ink,dimCol=C.faint,hl=-1,colorAt=null}={}){
 let s='',cx=x;
 for(let i=0;i<str.length;i++){const ch=str[i];const w=ch==='.'?sp*.5:sp;const c=i<lit?(colorAt?colorAt(i):col):dimCol;
  if(i===hl)s+=rect(cx-2,y-size*.9,w+4,size*1.15,{fill:HI,fo:.18,stroke:HI,rx:6});
  s+=label(ch,cx+w/2,y,{size,color:c,anchor:'middle',weight:700});cx+=w;}
 return s;
}
const digitW=(str,sp=36)=>[...str].reduce((a,ch)=>a+(ch==='.'?sp*.5:sp),0);
function skytree(x,yb,yt,{g=1}={}){
 const H=yb-yt;const pts=[[x-60,yb],[x-14,yt+H*.32],[x-10,yt+H*.12],[x-4,yt],[x+4,yt],[x+10,yt+H*.12],[x+14,yt+H*.32],[x+60,yb]];
 let s=poly(pts,{fill:'#c7d2e6',fo:.85,stroke:'#e6edf8',sw:2});
 s+=rect(x-26,yt+H*.32-10,52,20,{fill:'#e6edf8',fo:1,stroke:'#fff',rx:6})+rect(x-18,yt+H*.18-8,36,14,{fill:'#e6edf8',fo:1,stroke:'#fff',rx:5});
 for(let i=1;i<7;i++){const y=yb-H*.32*i/7*2.1;if(y<yt+H*.34)break;const hw=mix(60,14,(yb-y)/(H*.68));s+=line(x-hw,y,x+hw,y,{color:'#8a97ad',w:2});}
 return fade(g,s);
}
function iconBase(x,y){ // cell tower
 return line(x,y+60,x-24,y+120,{color:C.ink,w:4})+line(x,y+60,x+24,y+120,{color:C.ink,w:4})+line(x,y,x,y+120,{color:C.ink,w:4})
  +`<path d="M${x-20} ${y-6} q-14 18 0 36 M${x+20} ${y-6} q14 18 0 36 M${x-34} ${y-16} q-20 28 0 56 M${x+34} ${y-16} q20 28 0 56" fill="none" stroke="${XC}" stroke-width="3"/>`;
}
function iconPylon(x,y){
 return line(x-30,y+120,x,y,{color:C.ink,w:4})+line(x+30,y+120,x,y,{color:C.ink,w:4})+line(x-40,y+30,x+40,y+30,{color:C.ink,w:4})+line(x-30,y+60,x+30,y+60,{color:C.ink,w:4})
  +line(x-40,y+30,x-120,y+50,{color:'#ffcf67',w:2})+line(x+40,y+30,x+120,y+50,{color:'#ffcf67',w:2});
}
function iconMarket(x,y){
 let s=rect(x-60,y,120,120,{fill:'#131f38',fo:1,stroke:C.dim,rx:8});
 const c=[[0,60,90,40,70,'#83ecc0'],[1,50,70,30,40,'#ff8f9b'],[2,30,60,20,50,'#83ecc0'],[3,20,40,10,25,'#83ecc0']];
 for(const [i,o,cl,h,l,col] of c){const xx=x-42+i*28;s+=line(xx,y+120-cl-8,xx,y+120-h+0,{color:col,w:2})+rect(xx-7,y+120-o,14,Math.abs(o-l)+6,{fill:col,fo:.8,stroke:col,rx:1});}
 return s;
}
function phone(x,y,w,h,{g=1,inner=''}={}){
 return fade(g,rect(x,y,w,h,{fill:'#0b1122',fo:1,stroke:'#cfd9ee',sw:5,rx:28})+inner+rect(x+w/2-30,y+12,60,8,{fill:'#cfd9ee',fo:.8,stroke:'#cfd9ee',rx:4}));
}
function fourCards(p,{g=1,show=4,small=0}={}){
 const items=[['ニュートン','万有引力が 衛星を 回す',GRN],['マクスウェル','電磁波が 時刻を 運ぶ',CC],['アインシュタイン','相対性理論が 時計を 合わせる',TC],['線形代数','4つの 未知数を 解く',XC]];
 const pos=[[40,40],[640,40],[40,330],[640,330]];let s='';
 items.forEach(([a,b,col],i)=>{if(i>=show)return;const [x,y]=pos[i];const gg=typeof g==='function'?g(i):g;
  s+=card(x,y,520,140,label(a,x+30,y+56,{size:34,color:col,weight:700})+label(b,x+30,y+108,{size:28,color:C.ink,weight:700}),gg,col);});
 return s;
}
function trainFlash(x,y,{T=0,g=1,flash=1}={}){
 let s=rect(x,y,520,90,{fill:'#24355a',fo:1,stroke:C.dim,rx:14});
 for(let i=0;i<6;i++)s+=rect(x+30+i*80,y+18,56,34,{fill:'#7fb3ff',fo:.35,stroke:'#7fb3ff',rx:4});
 s+=ring(x+90,y+100,14,{color:C.dim,w:3,fill:C.bg})+ring(x+430,y+100,14,{color:C.dim,w:3,fill:C.bg})+line(x-80,y+116,x+600,y+116,{color:C.dim,w:3});
 const f=(fx)=>{let o='';for(let i=0;i<8;i++){const a=i*PI/4+.2;o+=line(fx+16*Math.cos(a),y+45+16*Math.sin(a),fx+40*Math.cos(a),y+45+40*Math.sin(a),{color:HI,w:4});}return o+dot(fx,y+45,12,HI);};
 const pulse=.6+.4*Math.abs(Math.sin(T*2));
 s+=fade(flash*pulse,f(x-30)+f(x+550));
 return fade(g,s);
}

export const spGps4Diagrams={
 // ================= S1 エレベーターの思考実験 =================
 [K+'d1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=line(140,250,820,250,{color:C.dim,w:3});
  s+=fade(seg(p,.02,.15),dot(260,250,12,CC)+L('1905年',260,215,{size:28,color:C.dim})+L('特殊相対性理論',260,300,{size:30,color:CC}));
  s+=fade(seg(p,.15,.3),arrow(340,250,580,250,{color:C.dim,w:4,head:16})+L('10年後',460,215,{size:26,color:C.dim}));
  s+=fade(seg(p,.25,.4),dot(680,250,14,HI)+L('1915年',680,215,{size:28,color:C.dim})+L('一般相対性理論',680,300,{size:32,color:HI})+L('重力まで 含める',680,340,{size:26,color:GRN}));
  s+=card(870,120,250,300,elevator(925,170,140,200)+person(970,354,110)+L('出発点',995,150,{size:26,color:HI}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'d2']:(p,ctx)=>{
  const e={x:480,y:110,w:240,h:320},fy=e.y+e.h;
  let s=elevator(e.x,e.y,e.w,e.h)+fade(seg(p,.05,.2),person(e.x+80,fy-16,160))+bathScale(e.x+80,fy-16,{g:seg(p,.05,.2)});
  s+=L('窓の ない エレベーター',600,80,{size:28,color:C.dim});
  const u=seg(p,.4,.6);
  s+=fade(u,arrow(e.x+60,fy-60,e.x+60,fy-24,{color:C.dim,w:3,head:10})+arrow(e.x+100,fy-60,e.x+100,fy-24,{color:C.dim,w:3,head:10}));
  s+=card(800,190,340,120,L('体が 床に',970,240,{size:28})+L('押しつけられる',970,285,{size:28,color:HI}),u,HI);
  return s;
 },
 [K+'d3']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundElevator(T,{g:seg(p,.02,.15)})+spaceElevator(T,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.55,.7),L('？',600,250,{size:80,color:HI})+L('中からは',600,320,{size:26,color:C.ink})+L('区別できない',600,360,{size:28,color:HI}));
  return s;
 },
 [K+'d4']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=fade(.45,groundElevator(T,{lab:1})+spaceElevator(T,{lab:1}));
  s+=card(400,140,400,240,L('等価原理',600,265,{size:50,color:HI})+L('重力 と 加速 は',600,315,{size:26})+L('中から 区別 できない',600,352,{size:26}),seg(p,.5,.65),HI);
  s+=tag('原理',600,190,{color:HI,size:26,g:seg(p,.55,.7)});
  return s;
 },
 [K+'d5']:(p,ctx)=>{
  const T=sceneT(p,ctx);const e={x:330,y:140,w:240,h:300},fy=e.y+e.h;
  let s=rect(150,30,600,480,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+stars(150,30,600,480,{off:18*T*T%480});
  s+=elevator(e.x,e.y,e.w,e.h)+rect(e.x+e.w/2-22,fy-16,44,14,{fill:HI,fo:.9,stroke:HI,rx:3});
  s+=arrow(e.x+e.w+60,fy-40,e.x+e.w+60,e.y+40,{color:AC,w:6,head:18})+label('a',e.x+e.w+76,e.y+e.h/2,{size:34,color:AC,weight:700});
  const u=seg(p,.35,.85);
  s+=vwave(e.x+e.w/2,fy-18,mix(fy-18,e.y+4,u),{lam0:30,ph:T*1.2,g:seg(p,.3,.4)});
  s+=fade(seg(p,.1,.25),L('床',e.x-30,fy-6,{size:26,anchor:'end'})+L('天井',e.x-30,e.y+16,{size:26,anchor:'end'}));
  s+=card(800,170,340,160,L('床 から 天井 へ',970,230,{size:30})+L('光を 送る',970,280,{size:32,color:HI}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'d6']:(p,ctx)=>{
  const T=sceneT(p,ctx);const e={x:330,y:180,w:240,h:260},fy0=e.y+e.h;
  const tau=lin(p,.08,.8),d=110*tau*tau,front=fy0-(e.h+110)*tau;
  let s=rect(150,10,600,500,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+stars(150,10,600,500,{});
  s+=elevator(e.x-12,e.y,e.w+24,e.h,{dash:'8 8'})+label('光を 出した ときの 位置',e.x+e.w/2,fy0+40,{size:22,color:C.dim,anchor:'middle'});
  s+=elevator(e.x,e.y-d,e.w,e.h);
  s+=vwave(e.x+e.w/2,fy0-4,Math.max(front,e.y-d+4),{lam0:30,ph:T*1.2,amp:9});
  s+=dot(e.x+e.w/2,front,9,HI);
  const vlen=20+150*tau;
  s+=arrow(e.x+e.w+40,e.y-d+100,e.x+e.w+40,e.y-d+100-vlen*.55,{color:CC,w:6,head:16})+label('v',e.x+e.w+58,e.y-d+80,{size:32,color:CC,weight:700});
  s+=card(800,150,350,200,L('光が 届く までに',975,205,{size:28})+L('天井は 光から',975,255,{size:28})+L('遠ざかって 速く なる',975,300,{size:28,color:CC}),seg(p,.25,.4),CC);
  s+=ruleNote('外から 見た 図（大きく 誇張）',975,400,seg(p,.05,.2));
  return s;
 },
 [K+'d7']:(p,ctx)=>{
  const T=sceneT(p,ctx);const e={x:280,y:110,w:240,h:340},fy=e.y+e.h;
  let s=rect(120,20,560,490,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+stars(120,20,560,490,{off:18*T*T%490});
  s+=elevator(e.x,e.y,e.w,e.h)+rect(e.x+e.w/2-22,fy-16,44,14,{fill:HI,fo:.9,stroke:HI,rx:3});
  s+=vwave(e.x+e.w/2,fy-18,e.y+4,{lam0:30,stretch:seg(p,.05,.35)*.8,ph:T*1.2,crests:1});
  s+=fade(seg(p,.2,.35),L('間隔が 伸びる',e.x-20,e.y+60,{size:26,color:HI,anchor:'end'})+L('振動数 低い',e.x-20,e.y+96,{size:26,anchor:'end'})+L('出した 振動数',e.x-20,fy-30,{size:26,anchor:'end'}));
  s+=ruleNote('大きく 誇張',400,50,seg(p,.2,.35));
  // high-school Doppler reminder
  const g2=seg(p,.55,.7);
  let dp=dot(830,300,10,HI);
  for(let k=1;k<=3;k++)dp+=ring(830,300,22*k+((T*20)%22),{color:HI,w:2});
  dp+=person(1020,370,90,{col:C.ink})+arrow(1050,310,1130,310,{color:CC,w:4,head:14});
  s+=card(720,120,450,330,L('高校編の ドップラー効果',945,170,{size:28,color:HI})+dp+L('遠ざかると 低く 聞こえる',945,430,{size:26}),g2,HI);
  return s;
 },
 [K+'d8']:(p,ctx)=>{
  const T=sceneT(p,ctx);const out=1-seg(p,.02,.25),inn=seg(p,.15,.4);
  let s=fade(out,rect(120,20,560,490,{fill:'#050a18',fo:.9,stroke:'#1c2a44',rx:14})+elevator(280,110,240,340));
  s+=fade(inn,groundArc(455,{cx:400})+tower(400,455,110)+arrow(560,180,560,300,{color:GRN,w:6,head:18})+label('重力',580,250,{size:28,color:GRN,weight:700}));
  s+=fade(inn,vwave(400,445,120,{lam0:28,stretch:.8,ph:T*1.2,crests:1,amp:9}));
  s+=fade(seg(p,.35,.5),L('地上の 塔',400,500,{size:24,color:C.dim}));
  s+=card(700,130,450,240,L('重力に 逆らって',925,190,{size:30})+L('上る 光は',925,240,{size:30})+L('振動数が 下がる',925,300,{size:36,color:HI}),seg(p,.55,.7),HI);
  s+=tag('等価原理から',925,430,{color:HI,size:24,g:seg(p,.55,.7)});
  return s;
 },
 [K+'d9']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(455,{cx:300})+tower(300,455,110);
  s+=vwave(300,445,120,{lam0:28,stretch:.8,ph:T*1.2,crests:1,amp:9});
  s+=clock(160,380,46,{T,rate:1,name:'下',g:seg(p,.02,.15)})+clock(160,150,46,{T,rate:1.25,name:'上',g:seg(p,.02,.15)});
  // tick timelines
  const g2=seg(p,.4,.55),x0=520,x1=1150;
  let tl=label('上の 時計の 刻み',x0,190,{size:26,color:C.ink,weight:700})+line(x0,240,x1,240,{color:C.dim,w:2});
  for(let i=-2;i<16;i++){const xx=x0+((i*48-T*60)%(48*16)+48*16)%(48*16);if(xx<=x1)tl+=line(xx,222,xx,258,{color:TC,w:4});}
  tl+=label('下から 光で 届いた 刻み',x0,320,{size:26,color:HI,weight:700})+line(x0,370,x1,370,{color:C.dim,w:2});
  for(let i=-2;i<14;i++){const xx=x0+((i*60-T*60)%(60*13)+60*13)%(60*13);if(xx<=x1)tl+=line(xx,352,xx,388,{color:HI,w:4});}
  s+=fade(g2,tl);
  s+=card(520,420,630,80,L('上で 受け取ると、下の 刻みは ゆっくり',835,472,{size:28,color:HI}),seg(p,.62,.75),HI);
  s+=ruleNote('大きく 誇張',835,120,g2);
  return s;
 },
 [K+'d10']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(455,{cx:300})+tower(300,455,110);
  s+=clock(160,380,46,{T,rate:1,name:'低い所'})+clock(160,150,46,{T,rate:1.5,name:'高い所'});
  s+=upSign(240,190,80,'＋ 速く 進む',{g:seg(p,.1,.25),size:28,dx:100});
  s+=card(560,150,580,220,L('重力は',850,220,{size:34})+L('時間の 進み方を 変える',850,290,{size:44,color:HI}),seg(p,.5,.65),HI);
  return s;
 },
 // ================= S2 塔の上で測った =================
 [K+'t1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(455,{cx:300})+tower(300,455,110);
  s+=vwave(300,445,120,{lam0:28,stretch:.02,ph:T*1.2,amp:9,g:seg(p,.2,.35)});
  s+=fade(seg(p,.05,.2),line(200,455,200,110,{color:XC,w:3})+line(188,455,212,455,{color:XC,w:3})+line(188,110,212,110,{color:XC,w:3})+L('22.5 m',190,290,{size:28,color:XC,anchor:'end'}));
  s+=tag('実験',560,90,{color:HI,size:26,g:seg(p,.02,.15)})+fade(seg(p,.02,.15),L('1960年ごろ',700,99,{size:28,color:C.dim,anchor:'start'}));
  s+=card(520,150,620,260,L('振動数の 変化',830,205,{size:30})+TX(`\\approx2.5\\times10^{-15}`,830,295,{size:60})+L('＝ 1000兆分の 2.5',830,375,{size:32,color:HI}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'t2']:(p)=>{
  const str='0.0000000000000025',sp=40,W=digitW(str,sp),x=600-W/2;
  const n=Math.floor(mix(2,str.length,seg(p,.02,.45))+.001);
  let s=digitRow(str,x,220,{size:60,sp,lit:n,col:C.ink,colorAt:i=>i>=16?HI:C.ink});
  s+=fade(seg(p,.4,.55),L('1000兆分の 2.5',600,300,{size:34,color:HI}));
  s+=fade(seg(p,.6,.75),okMark(470,410)+L('予言 どおり',620,422,{size:36,color:GRN}));
  return s;
 },
 [K+'t3']:(p)=>{
  let s=groundArc(455,{cx:200})+tower(200,455,180,{w:60});
  s+=line(110,455,110,180,{color:XC,w:3})+line(98,455,122,455,{color:XC,w:3})+line(98,180,122,180,{color:XC,w:3})+TX(ht,85,330,{size:40});
  s+=card(360,40,800,220,L('進み方の 差の 割合',560,140,{size:30})+TX(`\\approx\\dfrac{${gt}\\,${ht}}{${ct}^2}`,880,160,{size:64}),seg(p,.05,.2),HI);
  s+=fade(seg(p,.25,.4),label('g：重力加速度 9.8 m/s²',390,300,{size:26,color:AC,weight:700})+label('c：光の 速さ',800,300,{size:26,color:CC,weight:700}));
  s+=fcard(360,320,800,180,`\\dfrac{9.8\\times22.5}{(3.0\\times10^{8})^{2}}\\approx2.5\\times10^{-15}`,{size:46,col:HI,g:seg(p,.5,.65),dy:8});
  s+=tag('近似',1080,95,{color:HI,size:24,g:seg(p,.1,.25)});
  return s;
 },
 [K+'t4']:(p)=>{
  let s=wellGraph({draw:seg(p,.3,.65),marks:seg(p,.6,.75)});
  s+=card(790,40,380,130,L('衛星ほど 高いと',980,90,{size:28})+L('g は 一定 でない',980,140,{size:30,color:AC}),seg(p,.02,.15),AC);
  s+=card(790,220,380,230,L('1 kg あたりの',980,262,{size:26})+L('位置エネルギー',980,298,{size:28,color:EC})+TX(`-\\dfrac{GM}{${rt}}`,980,392,{size:46}),seg(p,.7,.85),EC);
  return s;
 },
 [K+'t5']:(p)=>{
  let s=wellGraph({diff:seg(p,.15,.35)});
  s+=card(780,30,400,330,L('進み方の 差の 割合',980,80,{size:28})
   +TX(`\\approx\\dfrac{1}{${ct}^2}\\Big[\\Big(-\\dfrac{GM}{${rt}}\\Big)-\\Big(-\\dfrac{GM}{${Rt}}\\Big)\\Big]`,980,170,{size:25})
   +L('＝ 位置エネルギーの 差',980,250,{size:26,color:HI})+L('÷ c²',980,295,{size:28,color:CC}),seg(p,.3,.45),HI);
  s+=tag('近似',980,410,{color:HI,size:26,g:seg(p,.6,.75)})+fade(seg(p,.6,.75),L('弱い 重力',980,465,{size:26,color:C.dim}));
  return s;
 },
 [K+'t6']:(p)=>{
  let s=fade(seg(p,.02,.15),TX(`\\dfrac{GM}{${ct}^2}\\Big(\\dfrac{1}{${Rt}}-\\dfrac{1}{${rt}}\\Big)`,600,80,{size:44}));
  s+=fade(seg(p,.05,.2),label('GM＝3.99×10¹⁴ m³/s²　R＝6.37×10⁶ m　r＝2.66×10⁷ m',600,170,{size:24,color:C.dim,anchor:'middle'}));
  s+=fcard(330,200,540,110,`\\approx5.3\\times10^{-10}`,{size:52,col:HI,g:seg(p,.15,.3)});
  s+=fcard(60,340,880,130,`5.3\\times10^{-10}\\times86400${U('s')}\\approx4.6\\times10^{-5}${U('s')}`,{size:44,col:TC,g:seg(p,.45,.6)});
  s+=fade(seg(p,.7,.85),L('≈ 46 μs',1060,418,{size:38,color:FAST}));
  return s;
 },
 [K+'t7']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=earth(260,420,210);
  s+=line(260,420,820,150,{color:C.faint,w:2,dash:'6 8'});
  s+=sat(820,130,{k:1.2})+clock(980,200,62,{T,rate:1.4,name:'衛星',col:TC});
  s+=clock(300,320,50,{T,rate:1,name:'地上'});
  s+=upSign(1090,300,140,'',{g:seg(p,.3,.45)})+fade(seg(p,.3,.45),L('＋46 μs/日',1000,360,{size:34,color:FAST}));
  s+=card(560,400,420,90,L('高い 所に いる おかげで 速く',770,455,{size:26,color:FAST}),seg(p,.6,.75),FAST);
  return s;
 },
 // ================= S3 綱引きの決着 =================
 [K+'e1']:(p)=>balance({g:seg(p,.02,.15),load:seg(p,.15,.4),u:seg(p,.5,.85)}),
 [K+'e2']:(p)=>{
  let s=fade(.35,balance({u:1}));
  s+=card(250,40,700,260,L('差し引き',600,95,{size:30})+TX(`45.7-7.2\\approx38.5`,600,165,{size:46,color:C.ink})+L('1日 約 ＋38 μs',600,250,{size:52,color:HI}),seg(p,.05,.2),HI);
  s+=card(330,340,540,120,L('予想：速く 進む？ 遅れる？',600,385,{size:28})+L('答え：速く 進む',600,435,{size:30,color:FAST}),seg(p,.62,.75),C.faint);
  return s;
 },
 [K+'e3']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=fcard(80,30,1040,120,`38.5\\times10^{-6}${U('s')}\\times3.0\\times10^{8}${U('m/s')}\\approx1.15\\times10^{4}${U('m')}`,{size:40,col:HI,g:seg(p,.02,.15)});
  s+=fade(seg(p,.1,.25),label('（約 38 μs。正確には 38.5 μs）',600,190,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.4),L('約 11.5 km',600,250,{size:44,color:HI}));
  const mx=200,my=290,mw=800,mh=200;
  s+=fade(seg(p,.45,.6),nightMap(mx,my,mw,mh,{T,pin:0}));
  const u=seg(p,.55,.85);
  s+=fade(seg(p,.45,.6),dot(mx+180,my+100,12,'#4d8dff',.4)+arrow(mx+180,my+100,mx+180+440*u,my+100,{color:HI,w:4,head:14})+dot(mx+180+440*u,my+100,14,'#4d8dff')+ring(mx+180+440*u,my+100,14,{color:'#fff',w:3}));
  s+=fade(seg(p,.7,.85),L('冒頭の「1日に 約11キロ分」',mx+mw/2,my+mh-20,{size:26,color:C.ink}));
  return s;
 },
 [K+'e4']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=tag('目安',600,60,{color:HI,size:28,g:seg(p,.02,.15)})+fade(seg(p,.02,.15),L('時計の ずれ を 距離に 直した 値',600,115,{size:28}));
  const cards=[['x',XC],['y',XC],['z',XC],['b',TC]];
  cards.forEach(([v,col],i)=>{s+=card(90+i*110,200,90,90,TX(cs(col,v),135+i*110,262,{size:50}),seg(p,.3+i*.04,.42+i*.04),col);});
  s+=fade(seg(p,.4,.55),L('受信機は 一緒に 解く',290,340,{size:26,color:C.ink}));
  s+=fade(seg(p,.55,.7),nightMap(620,170,520,300,{T,blur:90}));
  s+=fade(seg(p,.65,.8),L('ずれ方は もっと 複雑',880,500,{size:26,color:HI}));
  return s;
 },
 // ================= S4 1977年、スイッチを入れずに打ち上げた =================
 [K+'f1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=card(60,100,440,300,L('1977年 試験衛星',280,170,{size:32})+L('結果',200,270,{size:28,color:C.dim})+rect(250,230,160,110,{fill:'#0f1a30',fo:1,stroke:HI,rx:10})+L('？',330,312,{size:70,color:HI}),seg(p,.02,.15),HI);
  const u=seg(p,.3,.8);
  s+=earth(860,700,280,{});
  s+=fade(seg(p,.25,.4),sat(860,mix(400,170,u),{k:1.4})+draw([[860,420],[860,mix(420,200,u)]],1,{color:'#ffcf67',w:3,dash:'4 8'}));
  s+=fade(seg(p,.45,.6),L('NTS-2',980,170,{size:34,color:TC,anchor:'start'})+L('セシウム 時計',980,215,{size:26,anchor:'start'}));
  return s;
 },
 [K+'f2']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=sat(240,200,{k:1.6})+clock(240,350,50,{T,rate:1.4,name:'衛星',col:TC});
  s+=card(420,40,420,130,L('本当に 宇宙の 時計に',630,92,{size:28})+L('現れる？',630,140,{size:30,color:HI}),seg(p,.02,.15),C.faint);
  s+=poly([[480,170],[520,170],[470,210]],{fill:'#131f38',fo:1,stroke:C.faint});
  s+=switchBox(560,280,{on:0,g:seg(p,.45,.6)});
  s+=fade(seg(p,.62,.75),L('最初は 切ったまま 打ち上げ',710,480,{size:28,color:HI}));
  return s;
 },
 [K+'f3']:(p,ctx)=>{
  const T=sceneT(p,ctx);const u=seg(p,.1,.85),days=Math.round(20*u);
  let s=clock(150,150,58,{T,rate:1,name:'地上'})+clock(150,380,58,{T,rate:1.25,name:'衛星',col:TC});
  s+=card(270,40,220,100,L(`${days} 日目`,380,105,{size:40,color:TC}),1,TC);
  const ax={x:560,y:450,w:560,h:330};
  s+=line(ax.x,ax.y,ax.x+ax.w,ax.y,{color:C.dim,w:3})+line(ax.x,ax.y,ax.x,ax.y-ax.h,{color:C.dim,w:3});
  s+=label('20 日',ax.x+ax.w-20,ax.y+36,{size:24,color:C.dim,anchor:'middle'})+label('0',ax.x,ax.y+36,{size:24,color:C.dim,anchor:'middle'});
  s+=label('衛星の 時計の 進みすぎ',ax.x+14,ax.y-ax.h+6,{size:24,color:FAST,weight:700});
  s+=draw([[ax.x,ax.y],[ax.x+(ax.w-20)*u,ax.y-(ax.h-60)*u]],1,{color:FAST,w:5});
  s+=fade(seg(p,.1,.25),tag('補正 なし',800,40+40,{color:C.dim,size:24}));
  return s;
 },
 [K+'f4']:(p)=>{
  const flip=seg(p,.05,.25),open=seg(p,.22,.4);
  let s=label('NTS-2：ずれの 割合（1兆分の）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(1-open,`<g transform="translate(600 260) scale(${nn(Math.max(.01,1-flip))} 1) translate(-600 -260)">`+rect(480,180,240,160,{fill:'#0f1a30',fo:1,stroke:HI,rx:12})+L('？',600,295,{size:90,color:HI})+'</g>');
  const bx=260,k=1.65;
  const bar=(y,v,txt,dash,g)=>fade(g,rect(bx,y,v*k*seg(p,.3,.6),60,{fill:FAST,fo:dash?.15:.55,stroke:FAST,rx:6})+(dash?`<rect x="${bx}" y="${y}" width="${nn(v*k*seg(p,.3,.6))}" height="60" rx="6" fill="none" stroke="${FAST}" stroke-width="3" stroke-dasharray="10 6"/>`:'')
   +L(txt,bx-20,y+42,{size:30,anchor:'end'})+fade(seg(p,.55,.7),TX(`${v}\\times10^{-12}`,bx+v*k-150,y+42,{size:34,color:'#fff'})));
  s+=bar(150,442.5,'測定',0,open)+bar(290,446.5,'予言',1,seg(p,.45,.6));
  return s;
 },
 [K+'f5']:(p)=>{
  const bx=260,k=1.65;
  let s=label('NTS-2：ずれの 割合（1兆分の）',600,60,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=rect(bx,150,442.5*k,60,{fill:FAST,fo:.55,stroke:FAST,rx:6})+L('測定',bx-20,192,{size:30,anchor:'end'})+TX(`442.5\\times10^{-12}`,bx+442.5*k-150,192,{size:34,color:'#fff'});
  s+=`<rect x="${bx}" y="290" width="${nn(446.5*k)}" height="60" rx="6" fill="${FAST}" fill-opacity=".15" stroke="${FAST}" stroke-width="3" stroke-dasharray="10 6"/>`+L('予言',bx-20,332,{size:30,anchor:'end'})+TX(`446.5\\times10^{-12}`,bx+446.5*k-150,332,{size:34,color:'#fff'});
  const xa=bx+442.5*k,xb=bx+446.5*k;
  s+=fade(seg(p,.05,.2),line(xa,140,xa,370,{color:HI,w:2,dash:'5 5'})+line(xb,140,xb,370,{color:HI,w:2,dash:'5 5'})+L('差 4.0 → 約 1 %',xb-14,262,{size:30,color:HI,anchor:'end'}));
  s+=fade(seg(p,.5,.65),okMark(420,440)+L('宇宙でも 当たっていた',640,452,{size:34,color:GRN}));
  return s;
 },
 [K+'f6']:(p,ctx)=>{
  const T=sceneT(p,ctx);const on=seg(p,.2,.4);
  let s=switchBox(450,60,{on});
  s+=clock(350,380,58,{T,rate:1,name:'地上'})+clock(850,380,58,{T,rate:mix(1.25,1,on),name:'衛星',col:TC,off:on>.5?0:0});
  s+=fade(seg(p,.4,.55),L('補正 開始',600,290,{size:32,color:GRN}));
  return s;
 },
 // ================= S5 打ち上げる前に、わざと遅く =================
 [K+'g1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(440,{})+sat(300,300,{k:1.6})+L('打ち上げ前',300,240,{size:26,color:C.dim});
  s+=rect(250,400,100,40,{fill:'#56627a',fo:1,stroke:C.dim,rx:4});
  s+=clock(620,230,80,{T,rate:mix(1,.8,seg(p,.4,.6)),name:'衛星の 時計',col:TC});
  s+=downSign(760,170,110,'わざと 遅く',{g:seg(p,.45,.6),size:30});
  return s;
 },
 [K+'g2']:(p)=>{
  const A='10.23000000000',B='10.22999999543',sp=46,W=digitW(B,sp),x=600-W/2-60;
  let s=L('基本の 振動数',600,60,{size:28,color:C.dim});
  s+=fade(seg(p,.02,.15),digitRow(A,x,170,{size:58,sp,col:C.ink})+label('MHz',x+W+20,170,{size:36,color:C.ink,weight:700}));
  s+=fade(seg(p,.02,.15),label('目標',x-30,170,{size:26,color:C.dim,anchor:'end'}));
  const n=Math.floor(mix(0,B.length,seg(p,.35,.85))+.001);
  s+=fade(seg(p,.3,.4),digitRow(B,x,330,{size:58,sp,lit:n,col:C.ink,hl:n<B.length?n-1:-1,colorAt:i=>i>=4?SLOW:C.ink})+label('MHz',x+W+20,330,{size:36,color:SLOW,weight:700})+label('地上',x-30,330,{size:26,color:C.dim,anchor:'end'}));
  // brace groups as read aloud: 22 | 999 | 999 | 543
  const gx0=x+3*sp*1+sp*.5-sp; // start of decimals
  const xs=i=>x+[...B.slice(0,i)].reduce((a,ch)=>a+(ch==='.'?sp*.5:sp),0);
  const grp=[[3,5],[5,8],[8,11],[11,14]];
  s+=fade(seg(p,.85,.95),grp.map(([a,b])=>line(xs(a)+4,380,xs(b)-4,380,{color:SLOW,w:3})).join('')+L('ほんの わずかに 低く',600,450,{size:30,color:SLOW}));
  return s;
 },
 [K+'g3']:(p,ctx)=>{
  const T=sceneT(p,ctx);const u=seg(p,.05,.5);
  let s=groundArc(470,{})+sat(260,mix(420,130,u),{k:1.3})+draw([[260,450],[260,mix(450,170,u)]],1,{color:'#ffcf67',w:3,dash:'4 8'});
  s+=upSign(420,330,120,'相対論の 効果で 速く',{g:seg(p,.2,.35),size:26});
  const sp=40,A='10.22999999543',B='10.23000000000',W=digitW(A,sp),x=820-W/2;
  const m=seg(p,.45,.65);
  s+=fade(1-m,digitRow(A,x,170,{size:50,sp,colorAt:i=>i>=4?SLOW:C.ink}))+fade(m,digitRow(B,x,170,{size:50,sp,col:HI}));
  s+=label('MHz',x+W+14,170,{size:30,color:C.ink,weight:700});
  s+=card(600,320,520,120,L('地上から 見て ぴったり',860,370,{size:28})+L('10.23 MHz',860,420,{size:36,color:HI}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'g4']:(p)=>{
  let s=fcard(60,60,1080,150,`10.23${U('MHz')}\\times(1-4.465\\times10^{-10})=10.22999999543${U('MHz')}`,{size:40,col:HI,g:seg(p,.02,.15)});
  s+=fade(seg(p,.2,.35),L('4.465×10⁻¹⁰：アインシュタインの 式から 出した 進み方の 差',600,260,{size:26,color:C.dim}));
  s+=card(250,310,700,140,L('時計の 目盛りを',600,365,{size:30})+L('最初から ずらしておく',600,420,{size:36,color:HI}),seg(p,.45,.6),HI);
  return s;
 },
 [K+'g5']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s='';
  const g1=seg(p,.02,.15);
  let a=earth(185,285,45)+`<ellipse cx="290" cy="285" rx="180" ry="145" fill="none" stroke="${C.dim}" stroke-width="2" stroke-dasharray="6 6"/>`;
  const th=T*.8;a+=sat(290+180*Math.cos(th),285+145*Math.sin(th),{k:.6});
  s+=card(30,30,540,460,a+L('軌道が わずかに 楕円（誇張）',300,90,{size:26})+L('→ 受信機が 計算で 直す',300,470,{size:26,color:HI}),g1,C.faint);
  const g2=seg(p,.45,.6);
  let b=rect(640,210,500,70,{fill:'#7a5cff',fo:.18,stroke:'#7a5cff',rx:8})+L('電離層',1085,255,{size:24,color:CC});
  const w1=(x0,lag,col)=>{let pts=[];for(let y=160;y<=430;y+=3){const inLayer=y>210&&y<280;pts.push([x0+10*Math.sin(2*PI*((y-(inLayer?lag*(y-210)/70:(y>=280?lag:0)))/(col===XC?26:40)-T)),y]);}return draw(pts,1,{color:col,w:3});};
  b+=w1(760,0,XC)+w1(940,18,TC);
  b+=L('振動数 1',760,470,{size:24,color:XC})+L('振動数 2',940,470,{size:24,color:TC});
  s+=card(610,30,560,460,b+L('2つの 振動数で 比べて',890,80,{size:28})+L('遅れを 取り除く',890,118,{size:28,color:HI}),g2,C.faint);
  return s;
 },
 // ================= S6 あなたの頭は、足より年をとる =================
 [K+'h1']:(p,ctx)=>{
  const rows=[['衛星','約 2万 km',TC,1],['スカイツリー','約 450 m',C.ink,0],['あなたの 頭','約 1.6 m',C.ink,0]];
  let s=line(300,70,300,460,{color:C.dim,w:3})+label('高さ',300,50,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([a,b,col,known],i)=>{const y=110+i*150,g=seg(p,.05+i*.2,.2+i*.2);
   s+=fade(g,dot(300,y,10,col)+label(a,340,y+10,{size:32,color:col,weight:700})+label(b,620,y+10,{size:30,color:C.dim,weight:700}));
   if(!known)s+=fade(g,L('？',900,y+12,{size:44,color:HI}));});
  s+=fade(seg(p,.05,.2),sat(900,100,{k:.9})+upSign(1000,140,60,'',{}));
  return s;
 },
 [K+'h2']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=groundArc(470,{cx:400})+skytree(330,470,40,{g:seg(p,.02,.2)});
  const yd=470-430*(450/634);
  s+=fade(seg(p,.2,.35),line(380,yd,560,yd,{color:C.dim,w:2,dash:'6 6'})+line(200,470,200,yd,{color:XC,w:3})+line(188,yd,212,yd,{color:XC,w:3})+L('約 450 m',185,(470+yd)/2,{size:28,color:XC,anchor:'end'}));
  s+=clock(640,yd,54,{T,rate:1,name:'展望台',g:seg(p,.3,.45)})+clock(640,400,54,{T,rate:1,name:'地上',g:seg(p,.3,.45)});
  s+=tag('実験',900,90,{color:HI,size:26,g:seg(p,.5,.65)});
  s+=card(780,140,380,150,L('2020年',970,190,{size:28,color:C.dim})+L('光格子時計',970,245,{size:34,color:TC}),seg(p,.5,.65),TC);
  return s;
 },
 [K+'h3']:(p,ctx)=>{
  const T=sceneT(p,ctx);const yd=470-430*(450/634);
  let s=groundArc(470,{cx:400})+skytree(330,470,40)+line(380,yd,560,yd,{color:C.dim,w:2,dash:'6 6'});
  s+=clock(640,yd,54,{T,rate:1.05,name:'展望台'})+clock(640,400,54,{T,rate:1,name:'地上'});
  s+=upSign(720,yd+40,90,'＋4 ns/日',{g:seg(p,.05,.2),size:32});
  s+=fcard(780,190,400,110,`\\dfrac{9.8\\times450}{(3.0\\times10^{8})^2}\\approx4.9\\times10^{-14}`,{size:30,col:C.faint,g:seg(p,.25,.4),dy:-4});
  s+=fade(seg(p,.4,.55),TX(`\\times86400${U('s')}\\approx4.2${U('ns')}`,980,350,{size:34}));
  s+=fade(seg(p,.6,.75),okMark(830,430)+L('予言 どおり',980,442,{size:32,color:GRN}));
  return s;
 },
 [K+'h4']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=clock(420,150,70,{T,rate:1,name:''})+clock(420,370,70,{T,rate:1,name:''});
  s+=line(560,150,560,370,{color:XC,w:4})+line(545,150,575,150,{color:XC,w:4})+line(545,370,575,370,{color:XC,w:4})+L('1 cm',590,272,{size:36,color:XC,anchor:'start'});
  s+=fade(seg(p,.02,.15),L('（図は 拡大）',420,40,{size:22,color:C.dim}));
  s+=card(720,150,430,250,L('進み方の 差',935,205,{size:28})+TX(`\\approx1.1\\times10^{-18}`,935,285,{size:42})+L('まで 読み取れる',935,365,{size:28,color:HI}),seg(p,.35,.5),HI);
  return s;
 },
 [K+'h5']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=line(150,470,700,470,{color:C.dim,w:3})+person(330,470,380);
  s+=fade(seg(p,.2,.35),line(470,470,470,90,{color:XC,w:3})+line(458,90,482,90,{color:XC,w:3})+line(458,470,482,470,{color:XC,w:3})+L('約 1.6 m',490,290,{size:30,color:XC,anchor:'start'}));
  s+=clock(800,140,50,{T,rate:1.15,name:'頭',g:seg(p,.35,.5)})+clock(800,400,50,{T,rate:1,name:'足',g:seg(p,.35,.5)});
  s+=line(380,130,740,140,{color:C.faint,w:2,dash:'6 6'})+line(400,460,740,400,{color:C.faint,w:2,dash:'6 6'});
  s+=upSign(890,190,80,'少しだけ 速い',{g:seg(p,.6,.75),size:28});
  return s;
 },
 [K+'h6']:(p)=>{
  let s=fade(seg(p,.02,.15),TX(`\\dfrac{9.8\\times1.6}{(3.0\\times10^{8})^2}\\approx1.74\\times10^{-16}`,600,80,{size:38}));
  s+=fade(seg(p,.15,.3),label('80年 ＝ 2.52×10⁹ 秒',600,175,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=fcard(170,220,860,130,`1.74\\times10^{-16}\\times2.52\\times10^{9}${U('s')}\\approx4.4\\times10^{-7}${U('s')}`,{size:40,col:HI,g:seg(p,.3,.45)});
  s+=card(330,380,540,100,L('頭は 約 0.4 μs 多く 年をとる',600,442,{size:32,color:FAST}),seg(p,.6,.75),FAST);
  return s;
 },
 [K+'h7']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=sat(600,70,{k:1.2})+L('GPS の 時刻',600,140,{size:26,color:TC});
  const items=[[230,'携帯の 基地局',iconBase],[600,'電力網',iconPylon],[970,'金融の 取引所',iconMarket]];
  items.forEach(([x,t,f],i)=>{const g=seg(p,.25+i*.15,.4+i*.15);
   s+=fade(g,draw([[600,160],[x,250]],1,{color:TC,w:2,dash:'6 6'})+f(x,280)+L(t,x,460,{size:28}));});
  return s;
 },
 [K+'h8']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s='';
  const items=[[230,'携帯の 基地局',iconBase],[600,'電力網',iconPylon],[970,'金融の 取引所',iconMarket]];
  items.forEach(([x,t,f])=>{s+=fade(.6,f(x,280)+L(t,x,460,{size:28}));});
  s+=clock(600,130,70,{T,rate:1,name:'',col:HI});
  s+=fade(seg(p,.3,.45),items.map(([x])=>line(600,200,x,270,{color:HI,w:2})).join(''));
  s+=card(760,60,400,110,L('補正 済みの 時計',960,128,{size:32,color:HI}),seg(p,.2,.35),HI);
  return s;
 },
 // ================= S7 手のひらの上の物理 =================
 [K+'z1']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=nightMap(40,20,1120,480,{T});
  s+=card(250,330,700,120,L('聞くだけで、なぜ 場所が 分かる？',600,405,{size:36,color:HI}),seg(p,.3,.45),HI);
  return s;
 },
 [K+'z2']:(p,ctx)=>{
  const T=sceneT(p,ctx);const mx=40,my=20,mw=1120,mh=480,[px,py]=mapPin(mx,my,mw,mh);
  let s=fade(.7,nightMap(mx,my,mw,mh,{T}));
  const sats=[[150,70,XC],[420,50,EC],[860,60,GRN],[1080,110,C.p]];
  sats.forEach(([x,y,col],i)=>{const g=seg(p,.05+i*.08,.18+i*.08);s+=fade(g,draw([[x,y],[px,py]],1,{color:col,w:3})+sat(x,y,{k:.8}));});
  s+=card(60,360,520,120,L('距離 ＝ c × 時間',320,412,{size:32,color:C.ink})+L('4つの 式を 同時に 解く',320,456,{size:28,color:XC}),seg(p,.4,.55),C.faint);
  return s;
 },
 [K+'z3']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=sat(180,140,{k:1.4})+clock(180,330,70,{T,rate:1.3,name:'衛星',col:TC});
  s+=downSign(420,120,90,'−7 速さ',{g:seg(p,.05,.2),size:30})+upSign(420,420,90,'＋46 高さ',{g:seg(p,.15,.3),size:30});
  s+=card(640,60,500,170,L('前もって 計算して 補正',890,125,{size:30})+L('1日 ＋38 μs',890,190,{size:40,color:HI}),seg(p,.35,.5),HI);
  s+=card(640,280,500,170,L('補正が なければ',890,335,{size:28})+L('1日も もたない',890,395,{size:36,color:FAST}),seg(p,.6,.75),FAST);
  return s;
 },
 [K+'z4']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  return fade(.35,nightMap(40,20,1120,480,{T}))+fourCards(p,{show:2,g:i=>seg(p,.15+i*.3,.3+i*.3)});
 },
 [K+'z5']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  return fade(.35,nightMap(40,20,1120,480,{T}))+fourCards(p,{show:4,g:i=>i<2?1:seg(p,.05+(i-2)*.35,.2+(i-2)*.35)});
 },
 [K+'z6']:(p,ctx)=>{
  const T=sceneT(p,ctx);const u=seg(p,.15,.6);
  const ph={x:490,y:40,w:220,h:440};
  let inner=nightMap(ph.x+14,ph.y+36,ph.w-28,ph.h-60,{T});
  let s=phone(ph.x,ph.y,ph.w,ph.h,{inner,g:seg(p,.02,.2)})+fade(seg(p,.55,.7),ring(600,260,150+8*Math.sin(T*2),{color:HI,w:3}));
  const cols=[GRN,CC,TC,XC],names=['万有引力','電磁波','相対性理論','線形代数'];
  const start=[[250,110],[950,110],[250,400],[950,400]];
  cols.forEach((col,i)=>{const [sx,sy]=start[i],x=mix(sx,600,u),y=mix(sy,260,u),k=mix(1,.7,u);
   s+=fade(1-seg(p,.5,.65),rect(x-110*k,y-34*k,220*k,68*k,{fill:'#131f38',fo:.95,stroke:col,sw:3,rx:12})+label(names[i],x,y+11*k,{size:Math.max(22,30*k),color:col,anchor:'middle',weight:700}));});
  s+=card(790,200,380,110,L('一つの 道具',980,268,{size:38,color:HI}),seg(p,.6,.75),HI);
  return s;
 },
 [K+'z7']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=card(200,30,800,110,L('光の 速さは、誰から 見ても 同じ',600,100,{size:34,color:CC}),seg(p,.05,.2),CC);
  s+=fade(seg(p,.3,.45),clock(330,300,70,{T,rate:1,name:'時間'})+okMark(450,240));
  const sh=.7+.3*Math.cos(T*1.5);
  s+=fade(seg(p,.55,.7),rect(650,280,320*sh,40,{fill:XC,fo:.4,stroke:XC,rx:4})+L('長さ',810,390,{size:28,color:XC})+L('も？',1010,312,{size:40,color:HI,anchor:'start'}));
  return s;
 },
 [K+'z8']:(p,ctx)=>{
  const T=sceneT(p,ctx);
  let s=trainFlash(340,330,{T,g:seg(p,.02,.15),flash:seg(p,.1,.25)});
  s+=fade(seg(p,.25,.4),L('同時？',600,300,{size:32,color:HI}));
  s+=fade(seg(p,.3,.45),rect(120,40,960,200,{fill:'#131f38',fo:.96,stroke:HI,sw:5,rx:18})
   +L('「同時に 起きた」ということさえ',600,115,{size:38,color:C.ink})+L('見る人に よって 違うのか？',600,185,{size:44,color:HI}));
  return s;
 },
};
