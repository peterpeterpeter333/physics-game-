// 高校編「光波・要点」(ys-hs-w-light-summary) — 図。Stage 1200×515. 深く学ぶ版 1/3〜3/3 の部品を使う。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,sceneT,tSince,arc,LC,FC,VCOL,ANG,LIGHT,GLASS,GLINE,ct,vt,th,vi,E8,MS,
 medium,normal,refr,rays,angMark,beam,hWave,HW} from './yt1-hs-w-light-1-diagrams.mjs';
import {G,cons} from './yt1-hs-w-light-2-diagrams.mjs';

const K='hs-w-light-summary:';
const R=Math.PI/180;
const F=(src,x,y,size=46,o={})=>tex(src,x,y,{size,auto:false,...o});
const sinT=i=>`\\sin${th(i)}`, thc=`{\\color{${ANG}}\\theta_{\\mathrm{c}}}`;
const SNELL=`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`;
const RED='#ff6b6b', VIO='#b48cff';
const TC=Math.asin(1/1.5)/R;
const O=[560,250];
const gm=(o={})=>medium({y:O[1],upFill:GLASS,lowFo:0,upper:'ガラス n₁ ＝ 1.5',lower:'空気 n₂ ＝ 1.0',lx:330,...o});

export const hsWLightSummaryDiagrams={
 // ================= 結論 =================
 [K+'c1']:(p,ctx)=>{
  let s=card(300,40,600,180,F(`n=\\dfrac{${ct}}{${vt}}`,600,145,60),seg(p,.3,.45),C.ink);
  s+=fade(seg(p,.35,.5),label('屈折率',230,145,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('c：真空の 速さ　v：物質の 中の 速さ',600,300,{size:30,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'c2');
  let s=hWave(t,{o:{...HW,y:250}});
  s+=card(80,420,330,70,label('振動数：同じ',245,467,{size:28,color:FC,anchor:'middle',weight:700}),seg(p,.05,.2),FC);
  s+=card(450,420,330,70,label('速さ：n 分の1',615,467,{size:28,color:VCOL,anchor:'middle',weight:700}),seg(p,.45,.6),VCOL);
  s+=card(820,420,330,70,label('波長：n 分の1',985,467,{size:28,color:LC,anchor:'middle',weight:700}),seg(p,.55,.7),LC);
  return s;
 },
 [K+'c3']:(p,ctx)=>{
  const t=sceneT(p,ctx),Q=[400,280];
  let s=medium({y:280,x1:760,lx:740})+beam({O:Q,th1:35,w:100,la:300,lb:220,t});
  s+=card(780,90,400,130,F(SNELL,980,165,36),seg(p,.3,.45),C.hi);
  s+=fade(seg(p,.6,.75),label('スネルの 法則',980,270,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'c4']:(p,ctx)=>{
  const Q=[400,280],t2=refr(35,1,1.5);
  let s=medium({y:280,x1:760,lx:740})+normal(...Q,{up:250,down:220,text:'法線',g:seg(p,.45,.6)})+rays({O:Q,th1:35,la:290,lb:220});
  s+=angMark(Q,'in',35,{r:90,text:th(1),g:seg(p,.05,.2)})+angMark(Q,'out',t2,{r:100,text:th(2),g:seg(p,.2,.35)});
  s+=card(780,90,400,130,F(SNELL,980,165,36),1,C.hi);
  s+=fade(seg(p,.6,.75),label('角は 法線から',980,280,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= 一言の理由 =================
 [K+'r1']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'r1');
  let s=medium({y:270})+beam({O:[560,270],th1:40,w:150,la:330,lb:250,t,hlCrest:0});
  s+=fade(seg(p,.4,.55),label('先に 着いた 側から 遅くなる',640,60,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'r2']:(p,ctx)=>cons({ra:seg(p,.1,.4),rb:seg(p,.3,.6),circ:seg(p,.3,.5),nwf:seg(p,.6,.8)}),
 [K+'r3']:(p,ctx)=>{
  let s=fade(.85,cons({ra:1,rb:1,circ:.4,nwf:1,dl:1,t1:1,t2:1,ang1:1,ang2:1}));
  s+=card(820,30,360,120,F(`\\dfrac{${sinT(1)}}{${sinT(2)}}=\\dfrac{${vi(1)}}{${vi(2)}}`,1000,92,34),seg(p,.1,.25),C.ink);
  s+=card(820,190,360,100,F(SNELL,1000,242,28),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= 数値例 =================
 [K+'n1']:(p,ctx)=>{
  let s=card(80,60,1040,130,F(`${vt}=\\dfrac{3.0${E8}}{1.5}=2.0${E8}${MS}`,600,135,44),seg(p,.2,.35),VCOL);
  s+=fade(seg(p,.05,.2),label('ガラス n ＝ 1.5',600,260,{size:32,color:GLINE,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'n2');
  let s=hWave(t,{o:{...HW,y:320,A:50,lam:240},labels:1});
  s+=card(220,30,760,110,F('\\dfrac{600\\ \\mathrm{nm}}{1.5}=400\\ \\mathrm{nm}',600,95,42),seg(p,.3,.45),LC);
  return s;
 },
 [K+'n3']:(p,ctx)=>{
  const Q=[400,300],t2=refr(30,1,1.5);
  let s=medium({y:300,x1:760,lx:740})+normal(...Q,{up:260,down:200})+rays({O:Q,th1:30,la:280,lb:200});
  s+=angMark(Q,'in',30,{r:90,text:'30^\\circ'})+angMark(Q,'out',t2,{r:100,text:'19^\\circ',g:seg(p,.7,.85)});
  s+=card(780,40,400,90,F(`1.0\\times0.50=1.5\\times${sinT(2)}`,980,92,28),seg(p,.1,.25),C.hi);
  s+=card(780,160,400,90,F(`${sinT(2)}\\approx0.33`,980,212,34),seg(p,.5,.62),ANG);
  s+=card(780,280,400,90,F(`${th(2)}\\approx19^\\circ`,980,332,34),seg(p,.7,.82),ANG);
  return s;
 },
 [K+'n4']:(p,ctx)=>{
  const Q=[400,300],t2=refr(30,1,1.5);
  let s=medium({y:300,x1:760,lx:740})+normal(...Q,{up:260,down:200})+rays({O:Q,th1:30,la:280,lb:200});
  s+=angMark(Q,'in',30,{r:90,text:'30^\\circ'})+angMark(Q,'out',t2,{r:100,text:'19^\\circ'});
  s+=card(800,100,360,100,label('法線に 近づく',980,165,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'n5']:(p,ctx)=>{
  const a=mix(30,TC,seg(p,.4,.85)),t2=refr(a,1.5,1);
  let s=gm()+normal(...O,{up:230,down:250})+rays({O,th1:a,n1:1.5,n2:1,la:260,lb:400});
  s+=angMark(O,'in',a,{r:80,text:th(1)})+angMark(O,'out',t2,{r:95,text:th(2)});
  s+=fade(seg(p,.05,.2),label('法線から 離れる',60,60,{size:30,color:C.hi,weight:700}));
  s+=card(830,60,330,90,label('臨界角 θc',995,118,{size:32,color:ANG,anchor:'middle',weight:700}),seg(p,.8,.92),ANG);
  return s;
 },
 [K+'n6']:(p,ctx)=>{
  const a=mix(TC,50,seg(p,.45,.7)),t2=refr(a,1.5,1);
  let s=gm()+normal(...O,{up:230,down:250})+rays({O,th1:a,n1:1.5,n2:1,la:260,lb:400,refl:a>TC+.01?1:.5,trans:t2===null?0:1});
  s+=angMark(O,'in',a,{r:80,text:th(1)});
  s+=card(780,40,400,110,F(`\\sin${thc}=\\dfrac{1.0}{1.5}`,980,100,34),seg(p,0,.15),C.hi);
  s+=card(780,180,400,80,F(`${thc}\\approx42^\\circ`,980,228,34),seg(p,.15,.3),ANG);
  s+=fade(seg(p,.75,.9),label('外へ 出られない',O[0]+60,O[1]+80,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'n7']:(p,ctx)=>{
  const y0=200,y1=320,inc=70,step=(y1-y0)*Math.tan(inc*R);
  let s=rect(60,y0,1080,y1-y0,{fill:GLASS,fo:.35,stroke:GLINE,sw:3,rx:30});
  const pts=[[60,260]];let x=60+(y1-260)*Math.tan(inc*R),y=y1;pts.push([x,y]);
  while(x<1140){x+=step;y=y===y1?y0:y1;pts.push([Math.min(1140,x),x>1140?mix(pts[pts.length-1][1],y,(1140-(x-step))/step):y]);}
  s+=draw(pts,lin(p,.05,.8),{color:LIGHT,w:4});
  s+=card(400,40,400,90,label('全反射',600,100,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.3,.45),label('光ファイバー',600,400,{size:32,color:GLINE,anchor:'middle',weight:700}));
  return s;
 },
 [K+'n8']:(p,ctx)=>{
  const P1=[440,90],P2=[280,420],P3=[600,420];
  let s=poly([P1,P2,P3],{fill:GLASS,fo:.3,stroke:GLINE,sw:3});
  const inP=[mix(P1[0],P2[0],.5),mix(P1[1],P2[1],.5)];
  s+=line(40,330,...inP,{color:'#ffffff',w:7});
  const cols=['#ff4d4d','#ff9a3c','#ffe14d','#5fe06a','#4dc3ff','#6b7bff','#b48cff'];
  cols.forEach((c,i)=>{const e=[mix(P1[0],P3[0],.6),mix(P1[1],P3[1],.6)];
   s+=fade(seg(p,.4,.55),line(...inP,e[0],e[1]+i*3-6,{color:c,w:3})+line(e[0],e[1]+i*3-6,900,e[1]+120+i*28,{color:c,w:5}));});
  s+=card(880,40,300,170,label('赤 1.51',1030,105,{size:34,color:RED,anchor:'middle',weight:700})+label('紫 1.53',1030,170,{size:34,color:VIO,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.6,.75),label('（広がりは 大きく 描いています）',40,50,{size:22,color:C.dim}));
  return s;
 },
 // ================= よくある間違い =================
 [K+'m1']:(p,ctx)=>{
  const Q=[520,280];
  let s=medium({y:280})+normal(...Q,{up:250,down:220,text:'法線'})+rays({O:Q,th1:30,la:280,lb:220});
  s+=angMark(Q,'in',30,{r:90,text:'30^\\circ'});
  s+=fade(seg(p,.3,.45),arc(Q[0],Q[1],150,120,180,{color:C.a,w:4})+label('境界面から 測る ✕',150,230,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'m2']:(p,ctx)=>{
  const Q=[520,280];
  let s=medium({y:280})+normal(...Q,{up:250,down:220,text:'法線'})+rays({O:Q,th1:30,la:280,lb:220});
  s+=angMark(Q,'in',30,{r:90,text:'30^\\circ'})+arc(Q[0],Q[1],150,120,180,{color:C.a,w:4})+label('60°',300,250,{size:30,color:C.a,weight:700});
  s+=card(800,40,370,90,F('\\sin30^\\circ=0.50',985,92,34),seg(p,.1,.25),C.hi);
  s+=card(800,150,370,90,F('\\sin60^\\circ\\approx0.87',985,202,34,{color:C.a}),seg(p,.25,.4),C.a);
  s+=fade(seg(p,.6,.75),label('法線を 描いてから 角に 印',985,420,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'m3']:(p,ctx)=>{
  let s=card(200,50,800,110,label('n が 大きい ほど 速い ✕',600,120,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(200,250,800,110,label('n が 大きい ほど 遅い',600,320,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= まとめ =================
 [K+'s1']:(p,ctx)=>{
  let s=card(200,30,800,130,F(`n=\\dfrac{${ct}}{${vt}}`,600,105,48),seg(p,.05,.2),C.ink);
  s+=card(200,200,800,130,F(SNELL,600,275,48),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.6,.75),label('角度は 法線から',600,410,{size:32,color:ANG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'s2']:(p,ctx)=>card(300,170,600,140,label('理由は 深く学ぶ版で',600,258,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};
