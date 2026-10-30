// 特別編 v2「GPS と相対性理論」パート3/4 (ys-sp-gps2-3) — 図。Stage 1200×515.
// 色：c・v 紫、t 金、光 黄、遅れ 青 #6f9dff（下向き・−）、進み 赤（上向き・＋）、差・強調 黄、ミューオン 桃。
// 光時計・旅客機・結果のグラフは v1（yt1-sp-gps-3-diagrams.mjs）の図をそのまま呼ぶ（v1 のファイルは編集しない）。
// 光時計の部品は v1 から写して使う（v＝0.6c、γ＝1.25）。
// ミューオンの雨：高さは実寸（1 km＝28 px、地上 0〜15 km）。生まれる高さ 12〜15 km。
//   遅れなし：平均の飛ぶ距離 0.66 km（指数分布）。実際：γβ×0.66 ≈ 10.4 km（0.998c、γ≈15.8）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,clamp,mix,poly,smooth} from './anim.mjs';
import {card} from './yt1-hs-m1-velocity-1-diagrams.mjs';
import {tag} from './yt1-hs-m-energy-1-diagrams.mjs';
import {clockFace,satellite,earth,spGps3Diagrams as V1} from './yt1-sp-gps-3-diagrams.mjs';

const K='sp-gps2-3:';
const PI=Math.PI;
const SLOW='#6f9dff', FAST=C.a, HI=C.hi, LIGHT='#fff3a0', MIR='#b9c3d4', MU=C.p;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const cc=cs(C.v,'c');
const T=(src,x,y,o={})=>tex(src,x,y,{size:44,...o});
const sT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
const B=(s,x,y,o={})=>label(s,x,y,{size:28,color:C.ink,anchor:'middle',weight:700,...o});
const v1=(name)=>(p,ctx)=>V1['sp-gps-3:'+name](p,ctx);

// ---------------- stairs ★1〜★4 (small, top right) ----------------
function stairs(x,y,{cur=3,next=0,g=1}={}){ // x,y = top-left; next = glow of the following step (0..1)
 let s=label('難しさ',x-12,y+84,{size:22,color:C.dim,anchor:'end',weight:700});
 for(let i=0;i<4;i++){
  const h=34+i*18,bx=x+i*76,by=y+92-h,n=i+1;
  const on=n<cur?.45:n===cur?1:0;const lit=n===cur?1-next*.55:n===cur+1?next:0;
  const col=lit>.5?HI:n<cur?C.dim:C.faint;
  s+=rect(bx,by,70,h,{fill:lit>0?HI:C.dim,fo:lit>0?.12+.25*lit:on*.18,stroke:lit>0?HI:C.faint,sw:lit>0?3:1.5,rx:6});
  if(lit>0)s+=fade(lit*.5,rect(bx-4,by-4,78,h+8,{fill:'none',fo:0,stroke:HI,sw:2,rx:9}));
  s+=label(`★${n}`,bx+35,by+h/2+8,{size:22,color:lit>.3?HI:n<=cur?C.ink:C.dim,anchor:'middle',weight:700});
 }
 return fade(g,s);
}

// ---------------- quiz ----------------
// countdown ring fills during the pause after the voice (ctx.cue.pause)
function countdown(x,y,p,ctx,r=30){
 const dur=ctx?.dur||8,pz=ctx?.cue?.pause||3,u=lin(p,1-pz/dur,1);
 const a=-PI/2+2*PI*u*.999;
 let s=ring(x,y,r,{color:C.faint,w:7});
 if(u>0)s+=`<path d="M${x} ${y-r} A${r} ${r} 0 ${u>.5?1:0} 1 ${(x+r*Math.cos(a)).toFixed(1)} ${(y+r*Math.sin(a)).toFixed(1)}" fill="none" stroke="${HI}" stroke-width="7" stroke-linecap="round"/>`;
 const left=Math.max(0,Math.ceil(pz*(1-u)-1e-6));
 s+=label(u>0&&u<1?String(left):'？',x,y+10,{size:28,color:HI,anchor:'middle',weight:700});
 return s;
}
function options(y,opts,{ans=-1,reveal=0,g=1,w=330,h=96,gap=30}={}){
 const n=opts.length,W=n*w+(n-1)*gap,x0=600-W/2;let s='';
 opts.forEach(([key,txt],i)=>{
  const x=x0+i*(w+gap),ok=i===ans,dim=reveal*(ok?0:.55);
  let q=rect(x,y,w,h,{fill:ok&&reveal?HI:'#131f38',fo:ok?.08+.2*reveal:.96,stroke:ok&&reveal?HI:C.faint,sw:ok?2+3*reveal:2,rx:14});
  q+=dot(x+46,y+h/2,24,ok&&reveal>.5?HI:C.faint)+label(key,x+46,y+h/2+10,{size:28,color:ok&&reveal>.5?C.bg:C.ink,anchor:'middle',weight:700});
  q+=label(txt,x+w/2+26,y+h/2+11,{size:30,color:ok&&reveal>.5?HI:C.ink,anchor:'middle',weight:700});
  if(ok&&reveal>0)q+=fade(reveal,rect(x-6,y-6,w+12,h+12,{fill:'none',fo:0,stroke:HI,sw:2,rx:18}));
  s+=fade(1-dim,q);
 });
 return fade(g,s);
}
const qMark=(x,y,g=1)=>fade(g,rect(x-46,y-46,92,92,{fill:HI,fo:.16,stroke:HI,sw:3,rx:18})+label('Q.',x,y+16,{size:46,color:HI,anchor:'middle',weight:700}));

// ---------------- copied light-clock parts (from v1, unchanged geometry) ----------------
function person(x,y,{col=C.dim,s=1}={}){
 return ring(x,y-58*s,10*s,{color:col,w:3})+line(x,y-48*s,x,y-22*s,{color:col,w:3})+line(x,y-22*s,x-9*s,y,{color:col,w:3})+line(x,y-22*s,x+9*s,y,{color:col,w:3})+line(x-12*s,y-38*s,x+12*s,y-38*s,{color:col,w:3});
}
function train(x,y,w,h,{col='#4a5a78',g=1,win=true,wheels=true}={}){
 let s=rect(x,y,w,h,{fill:col,fo:.35,stroke:'#8fa0bf',sw:2,rx:14});
 if(win)for(let i=0;i<3;i++)s+=rect(x+18+i*(w-36)/3,y+16,(w-36)/3-12,h*.32,{fill:'#9fc2ff',fo:.25,stroke:'#9fc2ff',sw:1,rx:4});
 if(wheels)s+=ring(x+w*.2,y+h+8,10,{color:C.dim,w:3,fill:C.bg})+ring(x+w*.8,y+h+8,10,{color:C.dim,w:3,fill:C.bg});
 return fade(g,s);
}
const LC={L:180,c:200,beta:.6};const GAM=1/Math.sqrt(1-LC.beta**2);
const tri=u=>u<1?u:2-u;
function mirrors(x,yb,{L=LC.L,w=96,g=1,col=MIR}={}){
 return fade(g,rect(x-w/2,yb,w,9,{fill:col,fo:.9,stroke:col,rx:3})+rect(x-w/2,yb-L-9,w,9,{fill:col,fo:.9,stroke:col,rx:3})
  +line(x-w/2+4,yb,x-w/2+4,yb-L,{color:C.faint,w:2})+line(x+w/2-4,yb,x+w/2-4,yb-L,{color:C.faint,w:2}));
}
const photon=(x,y,g=1)=>fade(g,dot(x,y,16,LIGHT,.25)+dot(x,y,9,LIGHT));
function restClock(x,yb,t,{L=LC.L,showTick=true,g=1,trail=true}={}){
 const tau=L/LC.c,u=(t/tau)%2,y=yb-L*tri(u);let s=mirrors(x,yb,{L});
 if(trail)s+=line(x,yb,x,y,{color:HI,w:3,opacity:.5});
 s+=photon(x,y);
 const since=(t%(2*tau));
 if(showTick&&t>2*tau-.05&&since<.45)s+=fade(1-since/.45,label('カチッ',x+62,yb+6,{size:26,color:HI,weight:700}));
 return fade(g,s);
}
function movingClock(x0,yb,t,{L=LC.L,g=1,trainBox=true,loopTicks=2}={}){
 const tau=L/(LC.c*Math.sqrt(1-LC.beta**2)),vx=LC.beta*LC.c,Pd=2*tau*loopTicks;
 const tt=((t%Pd)+Pd)%Pd,x=x0+vx*tt,u=(tt/tau),y=yb-L*tri(u%2);
 const edge=Math.min(1,tt/.3,(Pd-tt)/.3);
 let s='';
 if(trainBox)s+=rect(x-58,yb-L-32,116,L+60,{fill:'#4a5a78',fo:.18,stroke:'#8fa0bf',sw:2,rx:14});
 const pts=[[x0,yb]];const nb=Math.floor(u);for(let i=1;i<=nb;i++)pts.push([x0+vx*tau*i,yb-L*(i%2)]);pts.push([x,y]);
 s+=draw(pts,1,{color:HI,w:3,opacity:.75});
 s+=mirrors(x,yb,{L})+photon(x,y);
 const since=tt%(2*tau);
 if(tt>2*tau-.05&&since<.45)s+=fade(1-since/.45,label('カチッ',x+62,yb+6,{size:26,color:HI,weight:700}));
 s+=arrow(x-36,yb-L-52,x+36,yb-L-52,{color:C.v,w:4,head:14})+label('v',x+48,yb-L-44,{size:28,color:C.v,weight:700});
 return fade(g*edge,s);
}
const PANEL={l:[20,40,430,400],r:[470,40,710,400]};
function panels({gl=1,gr=1}={}){
 const [a,b,c,d]=PANEL.l,[e,f,h,k]=PANEL.r;
 return fade(gl,rect(a,b,c,d,{fill:'#101a30',fo:.9,stroke:C.faint,rx:14})+B('電車の 中から 見る',a+c/2,b+38,{size:26,color:C.dim}))
  +fade(gr,rect(e,f,h,k,{fill:'#101a30',fo:.9,stroke:C.faint,rx:14})+B('ホームから 見る',e+h/2,f+38,{size:26,color:C.dim})+line(e+10,f+k-24,e+h-10,f+k-24,{color:C.dim,w:3})+person(e+40,f+k-26,{s:.9}));
}
const LX=235,RX0=540,YB=395;
function zigzag(x0,yb,{L=LC.L,ticks=2,g=1,col=HI,w=3}={}){
 const step=LC.beta/Math.sqrt(1-LC.beta**2)*L;const pts=[];for(let i=0;i<=ticks*2;i++)pts.push([x0+step*i,yb-L*(i%2)]);
 return fade(g,draw(pts,1,{color:col,w}));
}
const slowMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y+len,{color:SLOW,w:7,head:20})+label('−',x-26,y+len*.5+10,{size:40,color:SLOW,anchor:'middle',weight:700})+(text?label(text,x+22,y+len*.5+10,{size:30,color:SLOW,weight:700}):''));
const fastMark=(x,y,len=70,{g=1,text=''}={})=>fade(g,arrow(x,y,x,y-len,{color:FAST,w:7,head:20})+label('＋',x-28,y-len*.5+10,{size:40,color:FAST,anchor:'middle',weight:700})+(text?label(text,x+22,y-len*.5+10,{size:30,color:FAST,weight:700}):''));
const P=(x,y,r,th)=>[x+r*Math.cos(th),y-r*Math.sin(th)];
function plane(x,y,deg,{col='#e8eef8',s=1}={}){
 const sh=`<polygon points="-22,-3 16,-3 24,0 16,3 -22,3" fill="${col}"/><polygon points="-2,-2 -12,-20 -5,-20 9,-2" fill="${col}"/><polygon points="-2,2 -12,20 -5,20 9,2" fill="${col}"/><polygon points="-20,-2 -26,-10 -22,-10 -15,-2" fill="${col}"/><polygon points="-20,2 -26,10 -22,10 -15,2" fill="${col}"/>`;
 return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(-deg).toFixed(1)}) scale(${s})">${sh}</g>`;
}
function arcArrow(x,y,r,th0,th1,{color=C.v,w=5,head=16}={}){
 const n=24,pts=[];for(let i=0;i<=n;i++)pts.push(P(x,y,r,mix(th0,th1,i/n)));
 const [ax,ay]=pts[n-4],[bx,by]=pts[n];
 return draw(pts.slice(0,n-3),1,{color,w})+arrow(ax,ay,bx,by,{color,w,head});
}
// speed meter (gauge) that always reads 30万 km/s
function gauge(x,y,r,{g=1,wob=0,text='30万 km/s'}={}){
 let s=`<path d="M${x-r} ${y} A${r} ${r} 0 0 1 ${x+r} ${y}" fill="#131f38" stroke="${C.v}" stroke-width="4"/>`;
 for(let i=0;i<=8;i++){const a=PI-PI*i/8;s+=line(x+r*.82*Math.cos(a),y-r*.82*Math.sin(a),x+r*.96*Math.cos(a),y-r*.96*Math.sin(a),{color:C.dim,w:i%4?2:3});}
 const a=PI*.28+wob;s+=line(x,y,x+r*.78*Math.cos(a),y-r*.78*Math.sin(a),{color:HI,w:5})+dot(x,y,6,HI);
 s+=label(text,x,y+34,{size:24,color:C.v,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---------------- muon rain ----------------
const GY=470,PXKM=28,AX=110; // ground y, px per km, altitude axis x
const altY=km=>GY-km*PXKM;
const COLL={x0:150,x1:400},COLR={x0:450,x1:700};
const hash=(i,k)=>{const v=Math.sin(i*12.9898+k*78.233)*43758.5453;return v-Math.floor(v);};
function sky({g=1,cols=0,labelsL=0,labelsR=0}={}){
 let s=rect(AX,altY(15.6),600,GY-altY(15.6),{fill:'#13234a',fo:.55,stroke:'none',rx:4});
 s+=rect(AX,altY(15.2),600,.8*PXKM,{fill:MU,fo:.1,stroke:'none',rx:0});
 s+=rect(AX,GY,600,30,{fill:'#2e5236',fo:.9,stroke:'none',rx:0})+line(AX,GY,AX+600,GY,{color:'#6fae7a',w:3});
 s+=line(AX,altY(15.4),AX,GY,{color:C.dim,w:2});
 for(const km of [0,5,10,15]){s+=line(AX-8,altY(km),AX,altY(km),{color:C.dim,w:2})+label(km?`${km} km`:'地上',AX-12,altY(km)+8,{size:22,color:C.dim,anchor:'end'});}
 s+=fade(cols,line(425,altY(15.4),425,GY,{color:C.faint,w:2,dash:'6 8'}));
 s+=fade(labelsL,label('時間の 遅れが ない 場合',275,26,{size:24,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(labelsR,label('実際',575,26,{size:26,color:HI,anchor:'middle',weight:700}));
 return fade(g,s);
}
// tiny clock on a particle
const miniClock=(x,y,ang)=>ring(x,y,9,{color:C.t,w:2,fill:'#16223b'})+line(x,y,x+6.5*Math.sin(ang*2*PI),y-6.5*Math.cos(ang*2*PI),{color:C.t,w:2});
function rain(Tm,{x0,x1,lam,seed=1,vk=4,dt=.13,clocks=0,g=1,hmin=14.6,hmax=15,noX=0,clockRate=.07}={}){
 const life=hmax/vk+1.4;let s='';
 const i0=Math.max(0,Math.floor((Tm-life)/dt)),i1=Math.floor(Tm/dt);
 for(let i=i0;i<=i1;i++){
  const age=Tm-i*dt;if(age<0)continue;
  const h0=hmin+(hmax-hmin)*hash(i,seed),d=-lam*Math.log(1-.999*hash(i,seed+1)),x=x0+(x1-x0)*hash(i,seed+2);
  const f=age*vk;
  if(f<Math.min(d,h0)){
   const alt=h0-f,tr=Math.min(f,.9);
   s+=line(x,altY(alt+tr),x,altY(alt),{color:MU,w:3,opacity:.35})+dot(x,altY(alt),5,MU);
   if(clocks>0)s+=fade(clocks,miniClock(x+15,altY(alt)-4,age*clockRate));
  }else if(d<h0){
   const ad=(f-d)/vk;if(ad<1.1&&!noX){const y=altY(h0-d),k=7;s+=fade(1-ad/1.1,line(x-k,y-k,x+k,y+k,{color:SLOW,w:3})+line(x-k,y+k,x+k,y-k,{color:SLOW,w:3}));}
  }else{
   const ag=(f-h0)/vk;if(ag<.5)s+=fade(1-ag/.5,ring(x,GY,6+22*ag,{color:HI,w:3}));
  }
 }
 return fade(g,s);
}
// cosmic-ray hits at the top: incoming streak + burst
function showers(Tm,{g=1,n=3}={}){
 let s='';
 for(let j=0;j<n;j++){
  const per=1.6,ph=((Tm+j*per/n)%per)/per,x=180+((j*197+Math.floor((Tm+j*per/n)/per)*131)%480),y=altY(13.6+((j*0.7)%1.2));
  if(ph<.35){const u=ph/.35,hx=x-40*(1-u),hy=y-120*(1-u);s+=line(Math.max(x-40,hx-25),Math.max(y-120,hy-75),hx,hy,{color:'#ffffff',w:3,opacity:.7})+dot(hx,hy,4,'#ffffff');}
  else{const u=(ph-.35)/.65;s+=fade(1-u,ring(x,y,6+30*u,{color:'#ffffff',w:2})+dot(x,y,5*(1-u)+2,'#ffffff'));}
 }
 return fade(g,s);
}
function skytree(x,yb,h,{col='#cfd8e8',g=1}={}){
 const w=h*.12;
 let s=poly([[x-w,yb],[x+w,yb],[x+w*.18,yb-h*.92],[x-w*.18,yb-h*.92]],{fill:col,fo:.85});
 s+=line(x,yb-h*.92,x,yb-h,{color:col,w:Math.max(1.5,h*.012)});
 s+=rect(x-w*.55,yb-h*.56,w*1.1,h*.05,{fill:col,fo:1,stroke:col,sw:1,rx:2})+rect(x-w*.4,yb-h*.74,w*.8,h*.035,{fill:col,fo:1,stroke:col,sw:1,rx:2});
 return fade(g,s);
}
// magnified, slowed view of the first 2 km after birth (no dilation)
function inset(Tm,{g=1}={}){
 const X0=760,X1=1170,Y0=110,Y1=470,KM=(Y1-Y0)/2,yd=dkm=>Y0+dkm*KM;
 let s=rect(X0,Y0-50,X1-X0,Y1-Y0+60,{fill:'#0f1830',fo:.95,stroke:C.dim,sw:2,rx:12});
 s+=label('拡大・スロー：生まれてから 2 km',(X0+X1)/2,Y0-18,{size:24,color:C.dim,anchor:'middle',weight:700});
 s+=line(X0+10,Y0,X1-10,Y0,{color:MU,w:2,opacity:.6})+label('生まれた 所',X0+16,Y0+28,{size:22,color:MU});
 for(const km of [1,2])s+=line(X0+10,yd(km),X0+30,yd(km),{color:C.dim,w:2})+label(`${km} km`,X0+36,yd(km)+8,{size:22,color:C.dim});
 // mean distance 660 m
 s+=line(X0+10,yd(.66),X1-90,yd(.66),{color:HI,w:3,dash:'10 7'})+label('平均 約660 m',X0+130,yd(.66)+30,{size:24,color:HI,weight:700});
 // skytree scale (634 m)
 s+=skytree(X1-45,yd(.634),yd(.634)-Y0,{col:'#8fa0bf'})+label('634 m',X1-45,yd(.634)+28,{size:22,color:C.dim,anchor:'middle'});
 // particles (slow motion 0.5 km/s)
 const vk=.5,dt=.3,life=2/vk+1;const i0=Math.max(0,Math.floor((Tm-life)/dt)),i1=Math.floor(Tm/dt);
 for(let i=i0;i<=i1;i++){
  const age=Tm-i*dt,d=-.66*Math.log(1-.999*hash(i,7)),x=X0+60+(X1-X0-180)*hash(i,8),f=age*vk;
  if(f<Math.min(d,2)){s+=line(x,yd(Math.max(0,f-.25)),x,yd(f),{color:MU,w:3,opacity:.4})+dot(x,yd(f),7,MU);}
  else if(d<2){const ad=(f-d)/vk;if(ad<1.4){const y=yd(d),k=9;s+=fade(1-ad/1.4,line(x-k,y-k,x+k,y+k,{color:SLOW,w:4})+line(x-k,y+k,x+k,y-k,{color:SLOW,w:4}));}}
 }
 // zoom connectors from the left column's birth band
 s+=line(400,altY(15),X0,Y0-50,{color:C.faint,w:1.5,dash:'4 6'})+line(400,altY(12.8),X0,Y1+10,{color:C.faint,w:1.5,dash:'4 6'});
 return fade(g,s);
}

// ---------------- boss formula ----------------
const BOSS=`t=\\dfrac{t_0}{\\sqrt{1-v^2/${cc}^2}}`;
function bossFrame(x,y,w,h,{g=1,glow=0}={}){
 let s=rect(x,y,w,h,{fill:'#1a1430',fo:.95,stroke:HI,sw:4,rx:18});
 s+=fade(.35+.4*glow,rect(x-8,y-8,w+16,h+16,{fill:'none',fo:0,stroke:HI,sw:2,rx:24}));
 // corner studs
 for(const [cx,cy] of [[x,y],[x+w,y],[x,y+h],[x+w,y+h]])s+=dot(cx,cy,7,HI);
 return fade(g,s);
}
// approximate symbol positions in BOSS rendered at (X,Y,size)
function bossPos(X,Y,size){
 const W=texWidth(BOSS,size),left=X-W/2,wEq=texWidth('t=',size),fracL=left+wEq,fracW=W-wEq;
 const wSq=texWidth(`\\sqrt{1-}`,size),wV=texWidth('v',size),wV2=texWidth(`\\sqrt{1-v^2/}`,size),wC=texWidth(cc,size);
 const denL=fracL+(fracW-texWidth(`\\sqrt{1-v^2/${cc}^2}`,size))/2;
 return {t:[left+texWidth('t',size)/2,Y-38],t0:[fracL+fracW/2,Y-size*.62-38],v:[denL+wSq+wV/2-size*.05+71,Y+size*.85-38],c:[denL+wV2+wC/2+10,Y+size*.85-38],den:[fracL+fracW/2,Y+size*.85],W};
}

// ---------------- tug of war ----------------
function tug(Tm,{g=1,leftTxt='',rightTxt='？',lean=0,shake=1,leftDone=0}={}){
 const k=(18*Math.sin(Tm*1.7)+6*Math.sin(Tm*4.3))*shake+lean;
 let s=line(150+k,420,1050+k,420,{color:'#c8a46a',w:7});
 s+=dot(600+k,420,13,HI);
 const fig=(x,dir,col)=>{const hx=x-dir*12,hy=362;return dot(hx,hy,12,col)+line(hx,hy+12,x+dir*8,445,{color:col,w:6})+line(x+dir*8,445,x+dir*28,490,{color:col,w:6})+line(x+dir*8,445,x-dir*6,494,{color:col,w:6})+line(hx+dir*2,hy+34,x+dir*34,420,{color:col,w:5});};
 for(const x of [230,300,370])s+=fig(x+k,-1,SLOW);
 for(const x of [830,900,970])s+=fig(x+k,1,FAST);
 s+=card(150,250,300,80,label('速さ',215,301,{size:30,color:SLOW,anchor:'middle',weight:700})+(leftTxt?label(leftTxt,350,302,{size:30,color:SLOW,anchor:'middle',weight:700}):''),1,leftDone?SLOW:C.faint);
 s+=card(750,250,300,80,label('高さ',815,301,{size:30,color:FAST,anchor:'middle',weight:700})+label(rightTxt,950,302,{size:34,color:FAST,anchor:'middle',weight:700}),1,C.faint);
 return fade(g,s);
}

export const spGps2_3Diagrams={
 // ================= S1 光だけは、足し算できない =================
 [K+'r1']:(p,ctx)=>{
  const u=seg(p,.03,.95),tx=150+u*170;
  let s=stairs(880,4,{cur:3,g:seg(p,0,.08)});
  s+=line(30,440,1170,440,{color:C.dim,w:3})+label('ホーム',40,478,{size:24,color:C.dim});
  s+=person(80,440,{s:1.1});
  s+=train(tx,300,280,110);
  const gb=seg(p,.3,.36),bx=tx+290+seg(p,.32,.75)*420;
  s+=fade(gb,dot(bx,345,14,'#f4f4f4')+ring(bx,345,14,{color:C.dim,w:2}));
  // arrows (lengths: train 220, ball 220 → sum 440)
  s+=fade(seg(p,.1,.22),arrow(150,180,370,180,{color:C.v,w:6,head:18})+label('電車の 速さ',260,160,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.38,.5),arrow(370,180,590,180,{color:C.v,w:6,head:18})+label('ボールの 速さ',480,222,{size:26,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.62,.75),arrow(150,250,590,250,{color:HI,w:7,head:20})+label('ホームの 人に 見える 速さ',610,258,{size:28,color:HI,weight:700}));
  return s;
 },
 [K+'r2']:(p,ctx)=>{
  let s=line(30,440,1170,440,{color:C.dim,w:3})+label('ホーム',40,478,{size:24,color:C.dim});
  s+=person(80,440,{s:1.1})+train(320,300,280,110);
  s+=arrow(150,180,370,180,{color:C.v,w:6,head:18})+label('電車の 速さ',260,160,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=arrow(370,180,590,180,{color:C.v,w:6,head:18})+label('ボールの 速さ',480,222,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=arrow(150,250,590,250,{color:HI,w:7,head:20})+label('ホームの 人に 見える 速さ',610,258,{size:28,color:HI,weight:700});
  s+=card(700,40,460,150,B('速さは 足し算',930,100,{size:36,color:HI})+B('電車 ＋ ボール',930,155,{size:30,color:C.v}),seg(p,.05,.25),HI);
  s+=fade(seg(p,.6,.75),B('当たり前…？',930,360,{size:32,color:C.dim}));
  return s;
 },
 [K+'r3']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=line(30,440,1170,440,{color:C.dim,w:3})+train(160,300,280,110);
  // a lamp at the front of the train: light runs ahead
  s+=rect(440,330,26,30,{fill:LIGHT,fo:.8,stroke:LIGHT,rx:4});
  const lx=470+((t*420)%700);s+=line(470,345,lx,345,{color:LIGHT,w:6,opacity:.45})+photon(lx,345);
  s+=arrow(150,180,370,180,{color:C.v,w:6,head:18})+label('電車の 速さ',260,160,{size:26,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),arrow(370,180,700,180,{color:LIGHT,w:6,head:18})+label('光の 速さ',535,222,{size:26,color:LIGHT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),label('＋ ？',380,120,{size:44,color:C.a,anchor:'middle',weight:700}));
  s+=card(760,40,400,120,B('光だけは 違う',960,115,{size:40,color:HI}),seg(p,.35,.55),HI);
  return s;
 },
 [K+'r4']:(p,ctx)=>{
  const t=sT(p,ctx);let s='';
  const row=(y,title,dir,g)=>{
   const lx=110+((t*360)%640),sp=1+seg(p,.2,.8)*1.6,ox=dir>0?110+((t*70*sp)%420):700-((t*70*sp)%420);
   let q=label(title,40,y-66,{size:28,color:C.ink,weight:700});
   q+=line(60,y,780,y,{color:C.faint,w:2,dash:'6 10'});
   q+=line(Math.max(60,lx-150),y,lx,y,{color:LIGHT,w:6,opacity:.5})+photon(lx,y);
   q+=person(ox,y+44,{col:C.v,s:.8})+arrow(ox+(dir>0?14:-14),y+10,ox+(dir>0?40+30*sp:-40-30*sp),y+10,{color:C.v,w:4,head:12});
   q+=gauge(980,y+16,78,{g:seg(p,.45,.6),wob:.015*Math.sin(t*9+y)});
   return fade(g,q);
  };
  s+=row(175,'光を 追いかけながら 測る',1,seg(p,.04,.15));
  s+=row(400,'光に 向かっていきながら 測る',-1,seg(p,.2,.32));
  s+=fade(seg(p,.6,.72),label('どちらも 同じ！',980,40,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r5']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=tag('実験',600,50,{color:C.ink,size:30,g:seg(p,.02,.12)});
  for(let i=0;i<5;i++)s+=gauge(170+i*215,240,72,{g:seg(p,.08+i*.07,.16+i*.07),wob:.012*Math.sin(t*8+i*2),text:'30万 km/s'});
  s+=card(200,330,800,150,B('光の 速さは、いつも 同じ',600,390,{size:36,color:C.v})+B('何度 測っても 変わらない 自然の 事実',600,445,{size:28,color:C.ink}),seg(p,.5,.65),C.v);
  return s;
 },
 [K+'r6']:v1('c5'),
 // ================= S2 光時計（v1 の図を再利用） =================
 [K+'r7']:v1('c6'),
 [K+'r8']:v1('c7'),
 [K+'r9']:v1('c8'),
 [K+'r10']:v1('c9'),
 [K+'r11']:v1('c10'),
 [K+'r12']:v1('c11'),
 [K+'r13']:(p,ctx)=>{
  // race on two straight tracks: straight path (L) and the diagonal (1.25 L), same light speed
  const t=sT(p,ctx),Lp=380,per=4.6,tt=(t%per),v=180; // px/s
  const run=(y,len,title,col,g)=>{
   const x0=150,d=Math.min(len,v*tt),done=v*tt>=len,since=tt-len/v;
   let q=label(title,x0,y-44,{size:26,color:C.ink,weight:700});
   q+=line(x0,y,x0+len,y,{color:col,w:5,opacity:.45})+line(x0,y-16,x0,y+16,{color:C.dim,w:3})+line(x0+len,y-16,x0+len,y+16,{color:C.dim,w:3});
   q+=line(x0,y,x0+d,y,{color:LIGHT,w:6,opacity:.7})+photon(x0+d,y);
   q+=label('c',x0+d,y-22,{size:24,color:C.v,anchor:'middle',weight:700});
   // timer bar (gold): grows while the light runs
   const tb=Math.min(tt,len/v);q+=rect(820,y-15,tb*95,30,{fill:C.t,fo:.55,stroke:C.t,rx:4});
   if(done&&since<1.2)q+=fade(1-since/1.2,label('着いた！',x0+len+20,y+9,{size:26,color:HI,weight:700}));
   return fade(g,q);
  };
  let s=run(170,Lp,'まっすぐな 道',C.ink,seg(p,.02,.12));
  s+=run(330,Lp*GAM,'斜めの 道（1.25 倍 長い）',HI,seg(p,.08,.18));
  s+=fade(seg(p,.02,.12),label('かかった 時間',920,100,{size:24,color:C.t,anchor:'middle',weight:700}));
  s+=card(250,410,700,80,B('光の 速さは 同じ → 長い 道ほど 時間が かかる',600,460,{size:28,color:HI}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'r14']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=panels();
  s+=restClock(LX,YB,t);
  s+=movingClock(RX0,YB,t);
  const k=95,gb=seg(p,.3,.45),gt=seg(p,.45,.6);
  s+=fade(gb,label('1カチッ',30,485,{size:24,color:C.dim,weight:700})+rect(130,465,2*k*gb,28,{fill:C.t,fo:.55,stroke:C.t,rx:4}));
  s+=fade(gt,label('1カチッ',480,485,{size:24,color:C.dim,weight:700})+rect(580,465,2*GAM*k*gt,28,{fill:C.t,fo:.55,stroke:C.t,rx:4})+B('長い ＝ ゆっくり',1000,488,{size:28,color:HI}));
  return s;
 },
 [K+'r15']:v1('c14'),
 [K+'r16']:v1('c15'),
 // ================= S3 宇宙から降ってくる証拠（ミューオンの雨） =================
 [K+'r17']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=sky({g:seg(p,0,.15)});
  s+=showers(t,{g:seg(p,.45,.6),n:2});
  s+=card(760,120,410,220,B('本当に？',965,180,{size:32,color:C.dim})+B('証拠は 空から',965,245,{size:36,color:HI})+B('毎日 降ってくる',965,300,{size:36,color:HI}),seg(p,.4,.55),HI);
  return s;
 },
 [K+'r18']:(p,ctx)=>{
  const t=sT(p,ctx),gm=seg(p,.45,.6);
  let s=sky()+showers(t,{n:3});
  s+=fade(gm,rain(t,{x0:150,x1:700,lam:.66,seed:3,dt:.06,noX:1}));
  s+=fade(seg(p,.05,.2),label('宇宙からの 粒',700,72,{size:24,color:'#ffffff',anchor:'end',weight:700}));
  s+=fade(seg(p,.25,.4),label('上空 十数キロ で 生まれる',150,altY(14.4)+34,{size:24,color:MU,weight:700}));
  s+=card(760,140,410,200,label('空気に ぶつかって 生まれる',965,200,{size:26,color:C.ink,anchor:'middle',weight:700})+dot(860,268,9,MU)+B('ミューオン',990,280,{size:40,color:MU}),gm,MU);
  return s;
 },
 [K+'r19']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=sky()+showers(t,{n:3})+rain(t,{x0:150,x1:700,lam:.66,seed:3,dt:.06});
  // a single muon that lives briefly and turns into other particles (loop 2.4 s)
  const per=2.4,ph=(t%per)/per,cx=965,cy=200;
  let m='';
  if(ph<.55){m+=dot(cx,cy,16,MU)+miniClock(cx+34,cy-10,ph*1.2);}
  else{const u=(ph-.55)/.45;m+=fade(1-u*.6,dot(cx,cy,6*(1-u),MU));for(const a of [.3,2.4,4.3]){const r=10+80*u;m+=fade(1-u,dot(cx+r*Math.cos(a),cy-r*Math.sin(a),7,a<1?C.x:C.dim));}
   m+=fade(Math.min(1,u*3)*(1-u*.5),label('別の 粒に',cx,cy+66,{size:24,color:C.dim,anchor:'middle',weight:700}));}
  s+=card(760,90,410,380,m+line(780,300,1150,300,{color:C.faint,w:2})+B('とても 短命',965,350,{size:32,color:MU})+B('平均 100万分の2秒',965,410,{size:30,color:C.t})+label('（約 2.2 μs）',965,448,{size:22,color:C.dim,anchor:'middle'}),seg(p,.02,.15),MU);
  return s;
 },
 [K+'r20']:(p,ctx)=>{
  const t=sT(p,ctx),gL=seg(p,.02,.15);
  let s=sky({cols:gL,labelsL:gL});
  s+=fade(gL,rain(t,{...COLL,lam:.66,seed:11}));
  // bracket: 660 m below the birth band (to scale: 18 px)
  const ya=altY(14.8),yb=altY(14.8-.66);
  s+=fade(seg(p,.35,.5),line(408,ya,418,ya,{color:HI,w:3})+line(408,yb,418,yb,{color:HI,w:3})+line(413,ya,413,yb,{color:HI,w:3})+label('約660 m で 消える',275,yb+44,{size:24,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),skytree(385,GY,0.634*PXKM)+label('スカイツリー（実寸）',395,GY-26,{size:22,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.62,.76),label('×',275,GY-140,{size:60,color:SLOW,anchor:'middle',weight:700})+B('地上まで 届かない？',275,GY-90,{size:26,color:SLOW}));
  s+=inset(t,{g:seg(p,.12,.28)});
  s+=fade(seg(p,.2,.35),label('光の 速さ × 100万分の2秒 ≈ 660 m',965,40,{size:24,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r21']:(p,ctx)=>{
  const t=sT(p,ctx),gR=seg(p,.05,.2);
  let s=sky({cols:1,labelsL:1,labelsR:gR});
  s+=fade(.6,rain(t,{...COLL,lam:.66,seed:11}));
  s+=fade(gR,rain(t,{...COLR,lam:10.4,seed:21,dt:.11}));
  // a person standing on the ground in the right column; particles pass through
  s+=fade(seg(p,.45,.6),person(640,GY,{col:C.ink,s:1.2}));
  s+=card(760,90,410,170,B('ところが 地上で',965,150,{size:30,color:C.ink})+B('たくさん 見つかる',965,210,{size:36,color:HI}),seg(p,.15,.3),HI);
  s+=card(760,290,410,170,B('今も あなたの 体を',965,350,{size:28,color:C.ink})+B('通り抜けている',965,408,{size:34,color:MU}),seg(p,.5,.65),MU);
  return s;
 },
 [K+'r22']:(p,ctx)=>{
  const t=sT(p,ctx),gc=seg(p,.3,.45);
  let s=sky({cols:1,labelsL:1,labelsR:1});
  s+=fade(.6,rain(t,{...COLL,lam:.66,seed:11}));
  s+=rain(t,{...COLR,lam:10.4,seed:21,dt:.11,clocks:gc});
  s+=card(760,40,410,440,'',seg(p,.02,.15),C.faint);
  s+=fade(seg(p,.05,.2),B('光に 近い 速さ',965,95,{size:30,color:C.v}));
  s+=fade(seg(p,.1,.25),clockFace(870,230,70,{ang:t/3,name:'地上'}));
  s+=fade(gc,clockFace(1065,230,70,{ang:t/3/15.8,name:'ミューオン',col:MU}));
  s+=fade(seg(p,.55,.7),B('地上から 見ると',965,390,{size:28,color:C.ink})+B('ゆっくり 進む',965,445,{size:34,color:SLOW}));
  return s;
 },
 [K+'r23']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=sky({cols:1,labelsL:1,labelsR:1});
  s+=fade(.75,rain(t,{...COLL,lam:.66,seed:11}));
  s+=rain(t,{...COLR,lam:10.4,seed:21,dt:.11,clocks:1});
  s+=fade(seg(p,.55,.7),rect(478,GY-46,194,46,{fill:C.bg,fo:.85,stroke:HI,sw:2,rx:10})+B('地上まで 届く',575,GY-12,{size:28,color:HI}));
  s+=fade(seg(p,.55,.7),label('660 m で 消える',275,GY-12,{size:24,color:SLOW,anchor:'middle',weight:700}));
  // lifetime bars
  const k=22,gb=seg(p,.1,.22),gl=seg(p,.25,.5);
  let c='';
  c+=label('寿命（平均）',965,85,{size:26,color:C.dim,anchor:'middle',weight:700});
  c+=label('止まっている とき',790,135,{size:24,color:C.ink,weight:700})+fade(gb,rect(790,150,1*k,28,{fill:C.t,fo:.6,stroke:C.t,rx:4})+label('2.2 μs',830,172,{size:24,color:C.t,weight:700}));
  c+=label('地上から 見ると',790,235,{size:24,color:C.ink,weight:700})+rect(790,250,15.8*k*gl,28,{fill:C.t,fo:.6,stroke:C.t,rx:4});
  c+=fade(seg(p,.4,.55),B('十倍 以上！',965,340,{size:44,color:HI}));
  s+=card(760,40,410,340,c,seg(p,.02,.12),HI);
  return s;
 },
 // ================= S4 旅客機で、地球一周 =================
 [K+'r24']:(p,ctx)=>{
  const t=sT(p,ctx),x=180+seg(p,.1,.95)*820;
  let s=card(330,60,540,170,B('1971年',600,140,{size:56,color:C.t})+label('もっと 身近な 実験',600,200,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.18),C.t);
  s+=line(80,380,1120,380,{color:C.faint,w:2,dash:'6 10'});
  s+=fade(seg(p,.1,.2),plane(x,330-20*Math.sin(t*1.3),0,{col:'#ffd27a',s:1.8}));
  s+=tag('実験',600,470,{color:C.ink,size:28,g:seg(p,.4,.55)});
  return s;
 },
 [K+'r25']:v1('c28'),
 [K+'r26']:(p,ctx)=>{
  let s=qMark(140,90,seg(p,0,.1));
  s+=fade(seg(p,.05,.18),label('地上の 時計と 比べて、',220,80,{size:30,color:C.ink,weight:700})+label('遅れていたのは どちら？',220,130,{size:38,color:HI,weight:700}));
  s+=options(230,[['A','東回り'],['B','西回り'],['C','両方とも 同じ']],{g:seg(p,.3,.45),w:340});
  s+=fade(seg(p,.5,.6),countdown(600,430,p,ctx,34));
  return s;
 },
 [K+'r27']:(p,ctx)=>{
  const t=sT(p,ctx),rv=seg(p,0,.12);
  let s=options(20,[['A','東回り'],['B','西回り'],['C','両方とも 同じ']],{ans:0,reveal:rv,w:300,h:80});
  s+=clockFace(250,250,62,{ang:t/8,name:'地上'});
  s+=clockFace(600,250,62,{ang:t/8-.03*seg(p,.15,.35),name:'東回り',col:SLOW});
  s+=clockFace(950,250,62,{ang:t/8+.08*seg(p,.5,.7),name:'西回り',col:FAST});
  s+=slowMark(700,200,70,{g:seg(p,.15,.3)})+fade(seg(p,.15,.3),B('約 59 ns 遅れ',600,400,{size:30,color:SLOW}));
  s+=fastMark(1060,290,70,{g:seg(p,.5,.65)})+fade(seg(p,.5,.65),B('約 273 ns 進み',950,400,{size:30,color:FAST}));
  s+=fade(seg(p,.7,.82),label('ns（ナノ秒）＝ 10億分の1秒',600,470,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r28']:(p,ctx)=>{
  const t=sT(p,ctx),EX=320,EY=262,ER=150,ORB=192,WG=.28,WP=.25,rot=t*WG;
  let s=earth(EX,EY,ER,{rot})+ring(EX,EY,ORB,{color:C.faint,w:2,dash:'6 8'});
  s+=label('北極の 上から 見た 地球',EX,30,{size:24,color:C.dim,anchor:'middle'});
  // ground station and its velocity
  const th=1.2+rot,[gx,gy]=P(EX,EY,ER,th);
  s+=dot(gx,gy,9,'#ffe08a')+ring(gx,gy,13,{color:'#ffe08a',w:2});
  s+=fade(seg(p,.05,.18),arcArrow(EX,EY,ER+28,-.9,0,{color:C.v,w:4,head:14})+label('自転：西 → 東',EX,EY+ORB+40,{size:24,color:C.v,anchor:'middle',weight:700}));
  const te=.6+t*(WG+WP),[ex,ey]=P(EX,EY,ORB,te);
  s+=fade(seg(p,.3,.42),plane(ex,ey,te*180/PI+90,{col:'#ffd27a'}));
  // speed bars (seen from the centre)
  const bx=660,bar=(y,lab,col,parts,g)=>{let q=label(lab,bx,y+8,{size:26,color:col,weight:700}),x=bx+120;for(const [w,c] of parts){q+=rect(x,y-15,w,30,{fill:c,fo:.6,stroke:c,rx:4});x+=w;}return fade(g,q);};
  s+=label('地球の 中心から 見た 速さ',900,90,{size:24,color:C.dim,anchor:'middle'});
  s+=bar(160,'地面','#ffe08a',[[230,C.v]],seg(p,.2,.32));
  s+=bar(240,'東回り','#ffd27a',[[230,C.v],[170*seg(p,.5,.65),HI]],seg(p,.42,.52));
  s+=fade(seg(p,.5,.65),label('＋ 飛行機の 速さ',1130,290,{size:22,color:HI,anchor:'end',weight:700}));
  s+=card(660,340,500,120,B('地面より さらに 速い',910,390,{size:30,color:C.v})+B('→ 時計が 遅れる',910,438,{size:30,color:SLOW}),seg(p,.7,.82),SLOW);
  return s;
 },
 [K+'r29']:v1('c33'),
 // ================= S5 ボスの式 =================
 [K+'r30']:(p,ctx)=>{
  const t=sT(p,ctx),gi=seg(p,.15,.45),sc=mix(.55,1,gi),glow=.5+.5*Math.sin(t*3);
  let s=bossFrame(250,90,700,300,{g:seg(p,.05,.25),glow});
  s+=tag('ボスの 式',600,80,{color:HI,size:28,g:seg(p,.05,.25)});
  s+=fade(gi,`<g transform="translate(600 245) scale(${sc.toFixed(3)}) translate(-600 -245)">${T(BOSS,600,245,{size:80})}</g>`);
  s+=fade(seg(p,.6,.75),B('時間の 遅れを 表す 式',600,460,{size:30,color:C.dim}));
  return s;
 },
 [K+'r31']:(p,ctx)=>{
  const X=600,Y=150,SZ=66,q=bossPos(X,Y,SZ);
  let s=bossFrame(X-q.W/2-60,30,q.W+120,230,{g:1,glow:.4})+T(BOSS,X,Y,{size:SZ});
  const items=[
   ['t','t',['止まっている 人が','測った 時間'],C.t,40,seg(p,.28,.4)],
   ['t0','t_0',['動いている 時計が','刻んだ 時間'],C.t,333,seg(p,.03,.15)],
   ['v','v',['時計の 速さ'],C.v,626,seg(p,.55,.65)],
   ['c',cc,['光の 速さ'],C.v,919,seg(p,.75,.85)],
  ];
  for(const [key,src,txt,col,cx,g] of items){
   const [sx,sy]=q[key],cy=310;
   let o=ring(sx,sy-SZ*.12,SZ*.42,{color:col,w:3})+line(sx,sy+SZ*.3,cx+120,cy,{color:col,w:2,dash:'5 5'});
   o+=card(cx,cy,240,170,T(src,cx+120,cy+52,{size:46})+txt.map((u,i)=>label(u,cx+120,cy+108+i*34,{size:24,color:C.ink,anchor:'middle',weight:700})).join(''),1,col);
   s+=fade(g,o);
  }
  return s;
 },
 [K+'r32']:(p,ctx)=>{
  // v knob: small v first, then sliding toward c
  const b=p<.42?mix(.02,.12,seg(p,.05,.4)):mix(.12,.995,Math.pow(seg(p,.47,.86),.8));
  const den=Math.sqrt(1-b*b),gam=1/den;
  const bw=texWidth(BOSS,38);let s=bossFrame(170-bw/2-22,30,bw+44,130,{glow:.3})+T(BOSS,170,100,{size:38});
  // slider
  const X0=430,X1=1130,kx=mix(X0,X1,b);
  s+=label('v のつまみ',X0,52,{size:24,color:C.v,weight:700});
  s+=line(X0,90,X1,90,{color:C.faint,w:8})+line(X0,90,kx,90,{color:C.v,w:8});
  s+=label('0',X0,128,{size:22,color:C.dim,anchor:'middle'})+label('光の 速さ c',X1,128,{size:22,color:C.v,anchor:'middle',weight:700});
  s+=line(X0+.998*(X1-X0),78,X0+.998*(X1-X0),102,{color:MU,w:3})+label('ミューオン',X0+.998*(X1-X0)-12,60,{size:22,color:MU,anchor:'end'});
  s+=label('旅客機・GPS 衛星：ほぼ 0',X0+6,160,{size:22,color:C.dim});
  s+=dot(kx,90,17,C.v)+ring(kx,90,17,{color:'#ffffff',w:2});
  s+=label(`v ＝ ${b.toFixed(2)} c`,1130,165,{size:26,color:C.v,anchor:'end',weight:700});
  // denominator meter
  const M0=330,MW=700;
  s+=label('分母',40,232,{size:28,color:C.ink,weight:700})+T(`\\sqrt{1-v^2/${cc}^2}`,200,232,{size:34});
  s+=rect(M0,208,MW,32,{fill:C.faint,fo:.4,stroke:C.faint,rx:6})+rect(M0,208,MW*den,32,{fill:HI,fo:.65,stroke:HI,rx:6});
  s+=label('1',M0+MW+14,234,{size:24,color:C.dim})+label('0',M0-14,234,{size:24,color:C.dim,anchor:'end'});
  s+=label(den.toFixed(den>.995?4:2),M0+MW*den/2,234,{size:24,color:C.bg,anchor:'middle',weight:700});
  // time bars: t0 fixed, t = t0 / den
  const U0=90,TX0=350,TMAX=780;
  s+=label('動く 時計の 時間',40,318,{size:24,color:C.ink,weight:700})+T('t_0',318,316,{size:34});
  s+=rect(TX0,296,U0,30,{fill:C.t,fo:.35,stroke:C.t,rx:4});
  s+=label('止まっている 人の 時間',40,398,{size:24,color:C.ink,weight:700})+T('t',318,396,{size:34});
  const wt=Math.min(TMAX,U0*gam);s+=rect(TX0,376,wt,30,{fill:C.t,fo:.7,stroke:C.t,rx:4});
  if(U0*gam>TMAX)s+=arrow(TX0+TMAX,391,TX0+TMAX+40,391,{color:HI,w:5,head:14});
  s+=label(`t₀ の ${gam<10?gam.toFixed(gam<1.01?4:2):gam.toFixed(1)} 倍`,TX0+Math.min(wt,TMAX)+(U0*gam>TMAX?60:14),400,{size:24,color:HI,weight:700});
  s+=fade(seg(p,.82,.95),B('どこまでも 引き延ばされる',600,480,{size:30,color:HI}));
  s+=fade(seg(p,.1,.25)*(1-seg(p,.45,.55)),B('分母 ≈ 1 → 時間は ほとんど 変わらない',600,480,{size:28,color:C.dim}));
  return s;
 },
 [K+'r33']:(p,ctx)=>{
  // the diagonal light path with a right triangle and squares on its sides (Pythagoras, no formula)
  const L=150,bb=L*.75,x0=330,yb=330,X=x0+bb,Y=yb-L,hyp=L*1.25;
  let s=fade(.35,zigzag(x0-2*bb,yb+0,{L,ticks:2}));
  const gt=seg(p,.1,.25),gsq=seg(p,.3,.5);
  s+=fade(gt,poly([[x0,yb],[X,yb],[X,Y]],{fill:HI,fo:.15})+line(x0,yb,X,Y,{color:HI,w:5})+line(x0,yb,X,yb,{color:C.v,w:4,dash:'10 7'})+line(X,yb,X,Y,{color:C.ink,w:4})+draw([[X-16,yb],[X-16,yb-16],[X,yb-16]],1,{color:C.dim,w:2}));
  s+=fade(gsq,poly([[X,yb],[X+L,yb],[X+L,Y],[X,Y]],{fill:C.ink,fo:.12,stroke:C.ink,sw:2}));
  s+=fade(gsq,poly([[x0,yb],[X,yb],[X,yb+bb],[x0,yb+bb]],{fill:C.v,fo:.15,stroke:C.v,sw:2}));
  s+=fade(gsq,poly([[x0,yb],[X,Y],[X-L,Y-bb],[x0-L,yb-bb]],{fill:HI,fo:.15,stroke:HI,sw:2}));
  s+=fade(gt,label('斜めの 光の 道',x0-16,yb+32,{size:24,color:HI,anchor:'end',weight:700})+label('まっすぐ',X+L/2,Y+L/2+8,{size:24,color:C.ink,anchor:'middle',weight:700})+label('横に 進んだ',x0+bb/2,yb+bb+30,{size:22,color:C.v,anchor:'middle',weight:700}));
  s+=card(720,70,450,140,B('中学の',945,125,{size:28,color:C.dim})+B('三平方の 定理',945,180,{size:36,color:HI}),seg(p,.25,.4),HI);
  s+=fade(seg(p,.55,.7),label('＋ 斜めの 光の 道',945,262,{size:30,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),arrow(945,290,945,340,{color:HI,w:5,head:16})+bossFrame(745,355,400,120,{glow:.3})+T(BOSS,945,415,{size:36}));
  return s;
 },
 [K+'r34']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=satellite(150,90,1.2)+fade(seg(p,.05,.18),arrow(240,90,330,90,{color:C.v,w:4,head:14})+label('秒速 約3.9 km',345,98,{size:24,color:C.v,weight:700}));
  s+=fade(seg(p,.1,.25),arrow(520,90,580,90,{color:C.dim,w:4,head:14}));
  s+=fade(seg(p,.1,.25),T(BOSS,730,100,{size:34}));
  s+=fade(seg(p,.3,.45),card(900,20,280,150,'',1,SLOW)+slowMark(950,40,90)+label('7 μs',1025,92,{size:34,color:SLOW,weight:700})+label('1日に 約',1025,140,{size:22,color:C.dim,weight:700}));
  s+=tug(t,{g:seg(p,.5,.62),leftTxt:seg(p,.65,.8)>.5?'−7 μs/日':'',leftDone:seg(p,.65,.8),lean:-10*seg(p,.65,.8)});
  return s;
 },
 [K+'r35']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=satellite(150,90,1.2)+T(BOSS,730,100,{size:34,opacity:.6});
  s+=card(900,20,280,150,'',1,SLOW)+slowMark(950,40,90)+label('7 μs',1025,92,{size:34,color:SLOW,weight:700})+label('1日に 約',1025,140,{size:22,color:C.dim,weight:700});
  s+=tug(t,{leftTxt:'−7 μs/日',leftDone:1,lean:-10});
  s+=fade(seg(p,.2,.4),label('解決 ✓',300,225,{size:30,color:SLOW,anchor:'middle',weight:700}));
  return s;
 },
 [K+'r36']:(p,ctx)=>{
  const t=sT(p,ctx);
  let s=earth(170,560,250,{pole:false,rot:t*.03});
  s+=satellite(220,140,1.1)+fastMark(330,190,80,{g:seg(p,.1,.25)});
  s+=card(440,130,720,200,B('高さは、なぜ',800,200,{size:38,color:C.ink})+B('時計を 進める？',800,268,{size:46,color:FAST}),seg(p,.05,.2),FAST);
  s+=fade(seg(p,.45,.6),B('カギは 重力',800,380,{size:34,color:C.F}));
  s+=stairs(880,412,{cur:3,next:seg(p,.6,.78),g:seg(p,.5,.6)});
  return s;
 },
};
