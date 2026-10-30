// 特別編「1分の疑問」11 飛行機はなぜ飛べる (ys-sp-1min-plane) — 図。Stage 1200×515。
import {C,seg,lin,fade,label,line,rect,dot,ring,arrow,clamp,mix,poly,draw} from './anim.mjs';
import {HC,cueT,qcard,finalQ,wrap} from './yt1-sp-1min-common.mjs';
import {tag,cross,okMark,card,vfn} from './yt1-sp-1min-mpb-common.mjs';

const K='sp-1min-plane:';
const F=C.F,AIR=C.v,WING='#c9d3e6',BODY='#dfe7f3';
const mixc=u=>u>.5?C.a:C.dim;
const smooth=u=>{u=clamp(u);return u*u*(3-2*u);};

// 翼の断面（NACA 4桁型）。LE=(x0,y0)、翼弦 c、迎え角 a（度、正で機首上げ）、inv で上下さかさま
function foilPts(x0,y0,c,a,{inv=false,m=.05,pp=.4,t=.13}={}){
 const r=a*Math.PI/180,up=[],lo=[];
 for(let i=0;i<=40;i++){const x=(1-Math.cos(Math.PI*i/40))/2;
  const yc=x<pp?m/pp/pp*(2*pp*x-x*x):m/(1-pp)/(1-pp)*(1-2*pp+2*pp*x-x*x);
  const yt=5*t*(.2969*Math.sqrt(x)-.126*x-.3516*x*x+.2843*x**3-.1015*x**4);
  const sg=inv?-1:1;
  for(const [arr,yy] of [[up,sg*(yc+yt)],[lo,sg*(yc-yt)]]){const dx=c*x,dy=-c*yy;arr.push([x0+dx*Math.cos(r)-dy*Math.sin(r),y0+dx*Math.sin(r)+dy*Math.cos(r)]);}
 }
 return inv?{up:lo,lo:up}:{up,lo};
}
function foil(x0,y0,c,a,opt={},{fill=WING,g=1}={}){
 const {up,lo}=foilPts(x0,y0,c,a,opt);
 return fade(g,poly([...up,...lo.slice().reverse()],{fill,fo:.92,stroke:'#ffffff',sw:2}));
}
function plate(x0,y0,c,a,{g=1}={}){const r=a*Math.PI/180;return fade(g,line(x0,y0,x0+c*Math.cos(r),y0+c*Math.sin(r),{color:WING,w:9}));}
// 流線：翼の前は水平、翼を過ぎると下へ曲がる
function stream(yin,{x0=60,x1=1140,LE=420,ch=380,yw=260,D=70,clear=0}={}){
 const pts=[];
 for(let x=x0;x<=x1;x+=10){
  const k=Math.exp(-Math.abs(yin-yw)/150);
  let y=yin+D*k*smooth((x-LE+40)/(ch+260));
  if(clear)y+=clear*Math.exp(-(((x-(LE+ch*.3))/(ch*.45))**2));
  pts.push([x,y]);
 }
 return pts;
}
function along(pts,f){
 let L=0;const d=[];for(let i=1;i<pts.length;i++){d.push(Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));L+=d[i-1];}
 let w=L*clamp(f);for(let i=1;i<pts.length;i++){if(d[i-1]>=w){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}
 return pts[pts.length-1];
}
function flow(lines,t,{g=1,dots=true,col=AIR,op=.55}={}){
 let s='';
 for(const pts of lines){s+=draw(pts,1,{color:col,w:2.5,opacity:op});
  if(dots)for(let k=0;k<12;k++){const f=((t*.11+k/12)%1);const [x,y]=along(pts,f);s+=dot(x,y,4,col,.9);}}
 return fade(g,s);
}
// 大型旅客機（横から・右向き）
function airliner(x,y,L,{g=1}={}){
 const h=L*.11,x0=x-L/2,x1=x+L/2;
 let s=poly([[x0+L*.02,y-h*.3],[x0-L*.02,y-h*2.1],[x0+L*.09,y-h*2.1],[x0+L*.2,y-h*.4]],{fill:BODY,fo:1,stroke:'#9fb0c8',sw:1.5});
 s+=`<path d="M${x0} ${y-h*.45} L${x1-h*.9} ${y-h*.5} Q${x1+h*.15} ${y-h*.4} ${x1+h*.2} ${y+h*.15} Q${x1} ${y+h*.5} ${x1-h*.9} ${y+h*.5} L${x0+L*.12} ${y+h*.5} Q${x0+L*.04} ${y+h*.4} ${x0} ${y-h*.1} Z" fill="${BODY}" stroke="#9fb0c8" stroke-width="1.5"/>`;
 s+=line(x0+L*.02,y-h*.1,x1-h*.4,y-h*.1,{color:'#4f7fd6',w:h*.18});
 for(let i=0;i<22;i++)s+=dot(x0+L*.16+i*L*.031,y-h*.2,h*.07,'#33415c');
 s+=poly([[x-L*.05,y+h*.25],[x+L*.12,y+h*.35],[x-L*.12,y+h*.95],[x-L*.2,y+h*.95]],{fill:'#aebbd0',fo:1,stroke:'#8a99b3',sw:1});
 s+=rect(x-L*.02,y+h*.55,L*.13,h*.5,{fill:'#8a99b3',fo:1,stroke:'#6b7a94',sw:1,rx:h*.2});
 s+=poly([[x0+L*.03,y],[x0-L*.02,y+h*.15],[x0+L*.1,y+h*.15]],{fill:'#aebbd0',fo:1});
 return fade(g,s);
}
// 小さなプロペラ機（右向き）。inv でさかさま
function smallPlane(x,y,L,{inv=false,g=1,t=0}={}){
 const h=L*.16;
 let s=`<path d="M${x-L/2} ${y-h*.3} L${x+L*.38} ${y-h*.45} Q${x+L/2} ${y-h*.3} ${x+L/2} ${y} Q${x+L/2} ${y+h*.4} ${x+L*.38} ${y+h*.45} L${x-L/2} ${y+h*.15} Z" fill="#e66a5a" stroke="#ffd0c8" stroke-width="1.5"/>`;
 s+=poly([[x-L*.45,y-h*.2],[x-L*.52,y-h*1.4],[x-L*.38,y-h*1.4],[x-L*.3,y-h*.25]],{fill:'#e66a5a',fo:1});
 s+=`<ellipse cx="${x+L*.05}" cy="${y+h*.1}" rx="${L*.22}" ry="${h*.22}" fill="#f3f0e6" stroke="#c9c3b0" stroke-width="1.5"/>`;
 s+=poly([[x-L*.48,y-h*.05],[x-L*.3,y-h*.05],[x-L*.36,y+h*.25],[x-L*.5,y+h*.25]],{fill:'#f3f0e6',fo:1});
 s+=line(x+L*.2,y+h*.4,x+L*.24,y+h*1.1,{color:'#c9d3e6',w:3})+dot(x+L*.24,y+h*1.15,h*.25,'#33415c');
 s+=`<path d="M${x+L*.1} ${y-h*.45} Q${x+L*.18} ${y-h*1.1} ${x+L*.26} ${y-h*.42}" fill="#7fd0ff" fill-opacity=".6" stroke="#cfe8ff" stroke-width="1.5"/>`;
 const pr=h*1.3*Math.abs(Math.cos(t*20));s+=line(x+L/2+4,y-pr,x+L/2+4,y+pr,{color:'#c9d3e6',w:3});
 const inner=inv?`<g transform="translate(0 ${2*y}) scale(1 -1)">${s}</g>`:s;
 return fade(g,inner);
}

// 共通の翼（cue 2〜5）
const LE=[420,250],CH=380,AL=6;
const FP=foilPts(LE[0],LE[1],CH,AL),TE=FP.up[FP.up.length-1];
const offset=(pts,d)=>pts.map(([x,y])=>[x,y+d]);
const UP0=[[90,LE[1]-14],[LE[0]-8,LE[1]-14]],UPS=offset(FP.up,-14),UPD=[[TE[0],TE[1]-14],[TE[0]+300,TE[1]+20]];
const LO0=[[90,LE[1]+14],[LE[0]-8,LE[1]+14]],LOS=offset(FP.lo,14),LOD=[[TE[0],TE[1]+14],[TE[0]+300,TE[1]+48]];
// T を 3区間（前・翼・後ろ）に振り分けて粒の位置
function parcel(T,a,b,P0,PS,PD){
 if(T<a)return along(P0,T/a);
 if(T<b)return along(PS,(T-a)/(b-a));
 return along(PD,Math.min(1,(T-b)*1.2));
}
function teMark(g=1){return fade(g,line(TE[0]+2,TE[1]-80,TE[0]+2,TE[1]+80,{color:C.dim,w:2,dash:'6 6'})+label('後ろの端',TE[0]+2,TE[1]+110,{size:24,color:C.dim,anchor:'middle',weight:700}));}
function parcels(T,aU,bU,aL,bL){
 const u=parcel(T,aU,bU,UP0,UPS,UPD),l=parcel(T,aL,bL,LO0,LOS,LOD);
 return dot(u[0],u[1],11,C.x)+ring(u[0],u[1],15,{color:'#ffffff',w:2})+dot(l[0],l[1],11,C.E)+ring(l[0],l[1],15,{color:'#ffffff',w:2});
}
const LINES=[110,165,210,310,360,420].map(y=>stream(y,{clear:y<260?-18:0,D:110}));

const P2='よく聞く説明は、正しい？',P3='下に押すと、なぜ上がる？';

export const sp1minPlaneDiagrams={
 // 1. Q：大型旅客機
 [K+'q']:wrap(1,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=fade(V(.1,.3),airliner(600+6*Math.sin(t*.8),420+4*Math.sin(t*1.3),480));
  s+=qcard(['飛行機は、なぜ 飛べる？'],p,t,{y0:180});
  s+=tag('何百 トン',1010,430,{g:V(.3,.5),size:30,color:C.E});
  return s;
 },{fadeIn:false,roll:0}),
 // 2. よく聞く説明：上と下の粒が同時に後ろへ
 [K+'equal']:wrap(2,(p,ctx)=>{
  const [V,VL]=vfn(p,ctx);
  let s=foil(...LE,CH,AL)+teMark(V(.2,.3));
  s+=tag('よく聞く説明',220,100,{g:V(.18,.28),size:28,color:C.dim});
  s+=fade(.35,draw([...UP0,...UPS],1,{color:C.x,w:2,dash:'4 6'})+draw([...LO0,...LOS],1,{color:C.E,w:2,dash:'4 6'}));
  const T=VL(.25,.95)*.9;
  s+=parcels(T,.25,.9,.25,.9);
  s+=fade(V(.95,1.05),label('同時に 着く？',TE[0]+30,TE[1]-60,{size:30,color:HC,weight:700}));
  return s;
 },{roll:0,q:{end:.2,lines:['よく聞く説明は、正しい？'],text:P2}}),
 // 3. 実際：上の粒がずっと先に着く
 [K+'real']:wrap(2,(p,ctx)=>{
  const [V,VL]=vfn(p,ctx);
  let s=foil(...LE,CH,AL)+teMark();
  s+=tag('よく聞く説明',220,100,{size:28,color:mixc(V(.05,.15))})+cross(345,92,18,V(.05,.15));
  s+=fade(.35,draw([...UP0,...UPS],1,{color:C.x,w:2,dash:'4 6'})+draw([...LO0,...LOS],1,{color:C.E,w:2,dash:'4 6'}));
  const T=VL(.25,.98);
  s+=parcels(T,.25,.5,.25,.95);
  s+=fade(V(.6,.7),label('上が 先に 着く',TE[0]+60,TE[1]-50,{size:28,color:C.x,weight:700}));
  s+=fade(V(.95,1.05),label('同時ではない',600,470,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 },{pill:P2}),
 // 4. 本当の鍵：空気を下へ曲げる
 [K+'down']:wrap(2,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=flow(LINES,t,{g:V(.05,.3)})+foil(...LE,CH,AL);
  s+=arrow(930,300,1040,440,{color:AIR,w:7,head:24,g:V(.5,.7)});
  s+=fade(V(.55,.75),label('空気を 下へ',1000,250,{size:32,color:AIR,anchor:'middle',weight:700}));
  return s;
 },{pill:P2,bridge:.95}),
 // 5. 反作用：翼は上へ。ボートのオールと同じ
 [K+'react']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let s=flow(LINES,t,{op:.35})+foil(...LE,CH,AL);
  s+=arrow(930,300,930,450,{color:F,w:8,head:26,g:V(.2,.3)})+fade(V(.22,.32),label('翼が 空気を 押す',955,400,{size:26,color:F,weight:700}));
  s+=arrow(610,240,610,80,{color:F,w:10,head:30,g:V(.32,.45)})+fade(V(.36,.46),label('空気が 翼を 押す',640,120,{size:28,color:F,weight:700}));
  const gb=V(.55,.68),W0=40,Y0=330;
  let b=rect(W0,Y0+120,430,55,{fill:'#1d4f86',fo:.9,stroke:'none',rx:0})+line(W0,Y0+120,W0+430,Y0+120,{color:'#7fb2ff',w:2});
  b+=poly([[190,Y0+95],[370,Y0+95],[350,Y0+125],[210,Y0+125]],{fill:'#c08a55',fo:1,stroke:'#e0b080',sw:2});
  b+=dot(280,Y0+70,12,'#f0c9a0')+rect(272,Y0+80,16,18,{fill:'#4f7fd6',fo:1,stroke:'none',rx:3});
  b+=line(285,Y0+88,170,Y0+150,{color:'#e0b080',w:5})+poly([[160,Y0+140],[178,Y0+150],[166,Y0+170],[148,Y0+160]],{fill:'#e0b080',fo:1});
  b+=arrow(150,Y0+158,80,Y0+158,{color:F,w:6,head:18})+label('水を 押す',100,Y0+30,{size:24,color:F,anchor:'middle',weight:700});
  b+=arrow(375,Y0+105,450,Y0+105,{color:F,w:6,head:18})+label('進む',420,Y0+30,{size:24,color:F,anchor:'middle',weight:700});
  s+=card(W0-15,Y0-5,460,185,b,gb,F);
  return s;
 },{roll:0,q:{end:.18,lines:['下に 押すと、なぜ 上がる？'],text:P3}}),
 // 6. 傾けるだけで：平らな板、さかさまの翼、背面飛行
 [K+'tilt']:wrap(3,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  const panel=(cx,inner,name,g)=>fade(g,inner+label(name,cx,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  const L1=[200,240,330,370].map(y=>stream(y,{x0:50,x1:560,LE:150,ch:260,yw:290,D:45}));
  const L2=[200,240,330,370].map(y=>stream(y,{x0:640,x1:1150,LE:740,ch:260,yw:290,D:45}));
  let a=flow(L1,t,{op:.45})+plate(150,275,260,10);
  a+=line(150,275,330,275,{color:C.dim,w:2,dash:'6 6'})+`<path d="M${150+120} 275 A120 120 0 0 1 ${150+120*Math.cos(.1745)} ${275+120*Math.sin(.1745)}" fill="none" stroke="${HC}" stroke-width="3"/>`;
  a+=fade(V(.15,.25),label('迎え角',150,335,{size:24,color:HC,weight:700}));
  a+=arrow(280,280,280,150,{color:F,w:7,head:22,g:V(.25,.35)});
  let b=flow(L2,t,{op:.45})+foil(740,270,260,10,{inv:true});
  b+=arrow(870,285,870,150,{color:F,w:7,head:22,g:V(.38,.48)});
  let s=panel(305,a,'平らな板',V(.12,.24))+panel(895,b,'さかさまの翼',V(.3,.42));
  s+=fade(V(.62,.72),smallPlane(600+20*Math.sin(t*.9),100,170,{inv:true,t})+label('さかさまでも 飛ぶ',600,185,{size:26,color:HC,anchor:'middle',weight:700}));
  return s;
 },{pill:P3,bridge:.96}),
 // 7. 次の疑問：なぜ空気の薄い高い空を？
 [K+'next']:wrap(4,(p,ctx)=>{
  const t=cueT(p,ctx),[V]=vfn(p,ctx);
  let air='';let r=7;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647;};
  for(let y=480;y>250;y-=10){const n=Math.round(36*Math.exp(-(480-y)/80));for(let i=0;i<n;i++)air+=dot(80+rnd()*1040,y+rnd()*8,2.5,'#7fb2ff',.55);}
  let s=fade(V(.3,.5),air+line(60,490,1140,490,{color:C.dim,w:3})+label('地上',90,480,{size:24,color:C.dim,weight:700}));
  s+=fade(V(.35,.5),airliner(560+8*Math.sin(t*.7),330,260));
  s+=fade(V(.45,.6),line(560,360,560,488,{color:HC,w:2,dash:'8 8'})+tag('高度 1万 m',720,400,{size:28}));
  s+=fade(V(.55,.7),label('薄い',1080,290,{size:26,color:'#7fb2ff',anchor:'middle',weight:700})+label('濃い',1080,460,{size:26,color:'#7fb2ff',anchor:'middle',weight:700}));
  s+=finalQ(['旅客機は なぜ、','空気の薄い 高い空を 飛ぶ？'],V(.05,.25),{y:66,sc:.9+.1*V(.05,.25)});
  return s;
 },{roll:0}),
};
