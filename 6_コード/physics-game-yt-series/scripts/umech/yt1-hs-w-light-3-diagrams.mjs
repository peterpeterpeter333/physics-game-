// 高校編「光波・深く学ぶ 3/3」(ys-hs-w-light-3) — 図。Stage 1200×515.
// 色は 1/3・2/3 と同じ（θ 橙、n 白、光 淡い黄、ガラス・水 青）。上がガラス（n₁＝1.5）、下が空気（n₂＝1.0）。
// 反射光の明るさは定性的（臨界角に近づくと強くなる）。分散の図の角度は計算値どおり（赤 35.0°、紫 34.5°）、プリズムと雨粒の色の広がりは見やすく描いたもの。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,arc,LC,FC,VCOL,TCOL,ANG,LIGHT,GLASS,GLINE,ct,vt,th,E8,
 medium,normal,refr,rays,angMark,beam} from './yt1-hs-w-light-1-diagrams.mjs';

const K='hs-w-light-3:';
const PI=Math.PI, R=PI/180;
const F=(src,x,y,size=46,o={})=>tex(src,x,y,{size,auto:false,...o});
const sinT=i=>`\\sin${th(i)}`, thc=`{\\color{${ANG}}\\theta_{\\mathrm{c}}}`, sinC=`\\sin${thc}`;
const TC=Math.asin(1/1.5)/R; // 41.8°
const RED='#ff6b6b', VIO='#b48cff';
const O=[560,250];
// glass above, air below
const gm=(o={})=>medium({y:O[1],upFill:GLASS,lowFo:0,upper:'ガラス n₁ ＝ 1.5',lower:'空気 n₂ ＝ 1.0',lx:330,...o});
const reflOp=a=>clamp(.18+.82*Math.pow(Math.min(1,a/TC),8));
const transOp=a=>a>TC+1e-6?0:clamp(1-.6*Math.pow(a/TC,8));
function exitScene(a,{g=1,labels=1,marks=1,lb=230,showRefl=1,num=0}={}){
 const t2=refr(a,1.5,1);
 let s=gm({g})+normal(...O,{up:230,down:250,g})+rays({O,th1:a,n1:1.5,n2:1,la:260,lb,lr:260,g,trans:transOp(a),refl:showRefl?reflOp(a):0});
 if(marks){s+=angMark(O,'in',a,{r:80,text:th(1),g});if(t2!==null)s+=angMark(O,'out',t2,{r:95,text:th(2),g:g*transOp(a)});}
 if(num){s+=fade(g,label(`入射角 ${a.toFixed(0)}°`,60,60,{size:30,color:ANG,weight:700}));
  s+=fade(g,label(t2===null?'屈折光 なし':`屈折角 ${t2.toFixed(0)}°`,60,110,{size:30,color:t2===null?C.a:ANG,weight:700}));}
 return s;
}
// ---- raindrop ray (physical: refraction in, reflection at the back, refraction out) -------------
function refract(d,nOut,eta){ // nOut: unit normal pointing to the incident side
 const ci=-(d[0]*nOut[0]+d[1]*nOut[1]),k=1-eta*eta*(1-ci*ci);if(k<0)return null;
 const ct2=Math.sqrt(k);return [eta*d[0]+(eta*ci-ct2)*nOut[0],eta*d[1]+(eta*ci-ct2)*nOut[1]];
}
function dropPath(Cc,Rr,b,n){
 const al=Math.asin(b),E=[Cc[0]-Rr*Math.cos(al),Cc[1]-Rr*Math.sin(al)];
 const nE=[(E[0]-Cc[0])/Rr,(E[1]-Cc[1])/Rr];let d=refract([1,0],nE,1/n);
 const hit=(P0,dd)=>{const w=[P0[0]-Cc[0],P0[1]-Cc[1]],k=-2*(w[0]*dd[0]+w[1]*dd[1]);return [P0[0]+k*dd[0],P0[1]+k*dd[1]];};
 const Q=hit(E,d),nQ=[(Q[0]-Cc[0])/Rr,(Q[1]-Cc[1])/Rr],dot2=d[0]*nQ[0]+d[1]*nQ[1];
 const d2=[d[0]-2*dot2*nQ[0],d[1]-2*dot2*nQ[1]],X=hit(Q,d2),nX=[(X[0]-Cc[0])/Rr,(X[1]-Cc[1])/Rr];
 const d3=refract(d2,[-nX[0],-nX[1]],n);
 return {E,Q,X,d3};
}

export const hsWLight3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>exitScene(30,{g:seg(p,0,.15)})+fade(seg(p,.6,.75),label('法線から 離れる',740,440,{size:30,color:C.hi,weight:700})),
 [K+'q2']:(p,ctx)=>{
  const a=mix(30,38,lin(p,.1,.8));
  return exitScene(a,{showRefl:0})+card(830,40,330,100,label('大きく すると？',995,102,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
 },
 [K+'pred']:(p,ctx)=>{
  let s=exitScene(30,{showRefl:0});
  s+=fade(seg(p,.05,.2),label('θ₂ ＞ θ₁',60,60,{size:32,color:ANG,weight:700}));
  s+=fade(seg(p,.35,.5),line(O[0],O[1],O[0]+400,O[1],{color:C.hi,w:3,dash:'6 6'})+label('90°',O[0]+410,O[1]+40,{size:28,color:C.hi,weight:700}));
  s+=card(830,330,330,110,label('先に 90° は？',995,398,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ================= S2 入射角を大きくする =================
 [K+'setup']:(p,ctx)=>exitScene(30,{showRefl:0,marks:1})+fade(seg(p,.1,.3),label('ガラス → 空気',60,60,{size:32,color:C.ink,weight:700})),
 [K+'at30']:(p,ctx)=>exitScene(30,{showRefl:0})+card(760,40,420,100,F(`1.5\\times\\sin30^\\circ=1.0\\times${sinT(2)}`,970,100,30),seg(p,.1,.25),C.hi),
 [K+'at30b']:(p,ctx)=>{
  let s=exitScene(30,{showRefl:0})+card(760,40,420,100,F(`1.5\\times\\sin30^\\circ=1.0\\times${sinT(2)}`,970,100,30),1,C.hi);
  s+=card(760,170,420,90,F(`${sinT(2)}=0.75`,970,225,36),seg(p,.1,.25),ANG);
  s+=card(760,290,420,90,F(`${th(2)}\\approx 49^\\circ`,970,345,36),seg(p,.55,.7),ANG);
  return s;
 },
 [K+'at40']:(p,ctx)=>{
  const a=mix(30,40,seg(p,0,.2));
  let s=exitScene(a,{showRefl:0});
  s+=card(760,40,420,100,F(`${sinT(2)}=1.5\\times0.64\\approx0.96`,970,100,30),seg(p,.25,.4),ANG);
  s+=card(760,170,420,90,F(`${th(2)}\\approx 75^\\circ`,970,225,36),seg(p,.55,.7),ANG);
  s+=fade(seg(p,.75,.9),label('境界に 寝てきた',820,470,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'refl']:(p,ctx)=>{
  const a=mix(30,40,lin(p,.1,.9));
  let s=exitScene(a,{num:1});
  s+=fade(seg(p,.2,.35),label('反射光',O[0]+200,O[1]-200,{size:28,color:LIGHT,weight:700}));
  s+=fade(seg(p,.4,.55),label('だんだん 強く',O[0]+200,O[1]-155,{size:26,color:C.hi,weight:700}));
  return s;
 },
 // ================= S3 臨界角 =================
 [K+'crit']:(p,ctx)=>{
  const a=mix(40,TC,seg(p,.05,.35));
  let s=exitScene(a,{marks:0,lb:420});
  s+=angMark(O,'in',a,{r:80,text:thc});
  s+=fade(seg(p,.35,.5),arc(O[0],O[1],95,270,360,{color:ANG,w:4})+label('90°',O[0]+90,O[1]+90,{size:28,color:ANG,weight:700}));
  s+=fade(seg(p,.45,.6),label('境界に 沿う',O[0]+250,O[1]+40,{size:28,color:C.hi,weight:700}));
  s+=card(830,40,330,100,label('臨界角 θc',995,102,{size:34,color:ANG,anchor:'middle',weight:700}),seg(p,.55,.7),ANG);
  s+=tag('定義',995,180,{color:C.hi,g:seg(p,.65,.8)});
  return s;
 },
 [K+'crit2']:(p,ctx)=>{
  let s=card(300,30,600,110,F(`n_1\\,${sinT(1)}=n_2\\,${sinT(2)}`,600,95,44),1,C.dim);
  s+=card(300,170,600,90,F(`${th(2)}=90^\\circ:\\ \\ ${sinT(2)}=1`,600,225,38),seg(p,.05,.2),ANG);
  s+=card(300,300,600,110,F(`n_1\\,${sinC}=n_2\\times1`,600,365,44),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'crit3']:(p,ctx)=>{
  let s=card(300,30,600,110,F(`n_1\\,${sinC}=n_2\\times1`,600,95,44),1,C.dim);
  s+=fade(seg(p,.05,.2),label('両辺 ÷ n₁',600,190,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(350,240,500,150,F(`${sinC}=\\dfrac{n_2}{n_1}`,600,325,56),seg(p,.2,.35),C.hi);
  s+=tag('結果',950,280,{color:C.hi,g:seg(p,.5,.65)});
  return s;
 },
 [K+'crit4']:(p,ctx)=>{
  let s=exitScene(TC,{marks:0,lb:420,showRefl:1});
  s+=angMark(O,'in',TC,{r:80,text:thc});
  s+=card(760,40,420,110,F(`${sinC}=\\dfrac{1.0}{1.5}\\approx0.67`,970,105,32),seg(p,.05,.2),C.hi);
  s+=card(760,180,420,90,F(`${thc}\\approx 42^\\circ`,970,235,36),seg(p,.55,.7),ANG);
  return s;
 },
 [K+'crit5']:(p,ctx)=>{
  let s=card(350,30,500,140,F(`${sinC}=\\dfrac{n_2}{n_1}`,600,110,50),1,C.hi);
  s+=card(120,250,440,120,F('n_1>n_2\\ \\Rightarrow\\ \\dfrac{n_2}{n_1}<1',340,320,34),seg(p,.05,.2),C.F);
  s+=fade(seg(p,.2,.35),label('臨界角が 決まる',340,420,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=card(640,250,440,120,F('n_1<n_2\\ \\Rightarrow\\ \\dfrac{n_2}{n_1}>1',860,320,34),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.6,.75),label('sin は 1 を 超えない → なし',860,420,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 全反射 =================
 [K+'at50']:(p,ctx)=>{
  const a=mix(TC,50,seg(p,0,.25));
  let s=exitScene(a,{marks:0});s+=angMark(O,'in',a,{r:80,text:th(1)});
  s+=card(760,40,420,100,F('1.5\\times\\sin50^\\circ\\approx1.15',970,100,34),seg(p,.4,.55),C.a);
  return s;
 },
 [K+'at50b']:(p,ctx)=>{
  let s=exitScene(50,{marks:0})+angMark(O,'in',50,{r:80,text:th(1)});
  s+=card(760,40,420,100,F('1.5\\times\\sin50^\\circ\\approx1.15',970,100,34),1,C.a);
  s+=card(760,170,420,90,F(`${sinT(2)}\\le 1`,970,225,38),seg(p,.05,.2),ANG);
  s+=fade(seg(p,.5,.65),label('満たす 屈折角が ない',970,320,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tir']:(p,ctx)=>{
  let s=exitScene(50,{marks:0})+angMark(O,'in',50,{r:80,text:th(1)});
  s+=card(800,40,360,110,label('全反射',980,112,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  s+=fade(seg(p,.1,.25),label('外へ 出られない',O[0]+60,O[1]+80,{size:28,color:C.a,weight:700}));
  s+=tag('結果',980,190,{color:C.hi,g:seg(p,.65,.8)});
  return s;
 },
 [K+'tir2']:(p,ctx)=>{
  const a=mix(32,52,lin(p,.05,.9));
  let s=exitScene(a,{num:1,marks:0})+angMark(O,'in',a,{r:80,text:th(1)});
  s+=tag('実験でも 確かめられる',1000,60,{color:C.dim,g:seg(p,0,.15)});
  return s;
 },
 [K+'cond']:(p,ctx)=>{
  let s=card(120,40,960,120,label('① 遅い 物質 → 速い 物質（n₁ ＞ n₂）',600,115,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  s+=fade(seg(p,0,.1),label('全反射の 条件',600,30,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cond2']:(p,ctx)=>{
  let s=card(120,40,960,120,label('① 遅い 物質 → 速い 物質（n₁ ＞ n₂）',600,115,{size:36,color:C.ink,anchor:'middle',weight:700}),1,C.hi);
  s+=label('全反射の 条件',600,30,{size:26,color:C.dim,anchor:'middle'});
  s+=card(120,210,960,120,F(`\\text{② 入射角}>${thc}`,600,282,42),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'rev']:(p,ctx)=>{
  const a=mix(30,85,lin(p,.05,.6)),t2=refr(a,1,1.33);
  let s=medium({y:O[1],lower:'水 n ＝ 1.33',upper:'空気'})+normal(...O,{up:230,down:250});
  s+=rays({O,th1:a,n1:1,n2:1.33,la:260,lb:230});
  s+=angMark(O,'in',a,{r:80,text:th(1)})+angMark(O,'out',t2,{r:95,text:th(2)});
  s+=fade(1,label(`入射角 ${a.toFixed(0)}°`,60,60,{size:30,color:ANG,weight:700})+label(`屈折角 ${t2.toFixed(0)}°`,60,110,{size:30,color:ANG,weight:700}));
  s+=card(800,330,370,110,label('90° に 届かない',985,398,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 // ================= S5 身のまわりの全反射 =================
 [K+'water']:(p,ctx)=>{
  let s=card(240,40,720,140,F(`${sinC}=\\dfrac{1.0}{1.33}\\approx0.75`,600,120,44),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.05,.2),label('水 → 空気',600,230,{size:30,color:GLINE,anchor:'middle',weight:700}));
  s+=card(390,280,420,110,F(`${thc}\\approx 49^\\circ`,600,345,44),seg(p,.55,.7),ANG);
  return s;
 },
 [K+'look']:(p,ctx)=>{
  const ys=110,E=[600,470],h=E[1]-ys,dx=h*Math.tan(48.8*R);
  let s=rect(0,ys,1200,515-ys,{fill:GLASS,fo:.25,stroke:'none',rx:0})+line(0,ys,1200,ys,{color:GLINE,w:3})+label('水面',40,ys-16,{size:26,color:GLINE,weight:700});
  s+=fade(seg(p,.05,.2),line(...E,E[0]-dx,ys,{color:LIGHT,w:3,dash:'8 6'})+line(...E,E[0]+dx,ys,{color:LIGHT,w:3,dash:'8 6'})+line(...E,E[0],ys,{color:C.ink,w:2,dash:'4 6'}));
  s+=fade(seg(p,.05,.2),arc(E[0],E[1],90,90,90+48.8,{color:ANG,w:4})+label('約49°',E[0]-150,E[1]-90,{size:26,color:ANG,weight:700}));
  s+=fade(seg(p,.35,.5),rect(0,ys-8,E[0]-dx,16,{fill:'#e8eef7',fo:.8,stroke:'none',rx:0})+rect(E[0]+dx,ys-8,1200-E[0]-dx,16,{fill:'#e8eef7',fo:.8,stroke:'none',rx:0}));
  s+=fade(seg(p,.4,.55),label('鏡のよう',100,ys+50,{size:28,color:'#e8eef7',weight:700})+label('鏡のよう',1100,ys+50,{size:28,color:'#e8eef7',anchor:'end',weight:700}));
  s+=fade(seg(p,.25,.4),label('外が 見える',600,ys+50,{size:28,color:LIGHT,anchor:'middle',weight:700}));
  s+=dot(...E,16,'#ffd6a0')+dot(E[0],E[1]-4,5,'#0b1122');
  return s;
 },
 [K+'fiber']:(p,ctx)=>{
  const y0=200,y1=320,inc=70;
  let s=rect(60,y0,1080,y1-y0,{fill:GLASS,fo:.35,stroke:GLINE,sw:3,rx:30})+label('細い ガラスの 線',600,y0-30,{size:28,color:GLINE,anchor:'middle',weight:700});
  // zigzag: angle of incidence 70° from the normal (vertical)
  const step=(y1-y0)*Math.tan(inc*R);const pts=[[60,260]];let x=60+(y1-260)*Math.tan(inc*R),y=y1;pts.push([x,y]);
  while(x<1140){x+=step;y=y===y1?y0:y1;pts.push([Math.min(1140,x),x>1140?mix(pts[pts.length-1][1],y,(1140-(x-step))/step):y]);}
  s+=draw(pts,lin(p,.1,.8),{color:LIGHT,w:4});
  s+=fade(seg(p,.5,.65),label('側面に 当たる 角 ＞ 臨界角',600,400,{size:28,color:ANG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fiber2']:(p,ctx)=>{
  const y0=200,y1=320,inc=70;
  let s=rect(60,y0,1080,y1-y0,{fill:GLASS,fo:.35,stroke:GLINE,sw:3,rx:30});
  const step=(y1-y0)*Math.tan(inc*R);const pts=[[60,260]];let x=60+(y1-260)*Math.tan(inc*R),y=y1;pts.push([x,y]);
  while(x<1140){x+=step;y=y===y1?y0:y1;pts.push([Math.min(1140,x),x>1140?mix(pts[pts.length-1][1],y,(1140-(x-step))/step):y]);}
  s+=draw(pts,1,{color:LIGHT,w:4});
  pts.slice(1,-1).forEach((q,i)=>{s+=fade(seg(p,.05+i*.08,.12+i*.08),ring(q[0],q[1],14,{color:C.hi,w:3}));});
  s+=fade(seg(p,.55,.7),label('全反射を くり返して 遠くへ',600,420,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 分散と虹 =================
 [K+'disp']:(p,ctx)=>{
  let s=card(200,50,800,110,label('屈折率は 色（波長）で 少し 違う',600,120,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=card(200,230,370,110,label('紫：大きい',385,300,{size:36,color:VIO,anchor:'middle',weight:700}),seg(p,.5,.65),VIO);
  s+=card(630,230,370,110,label('赤：小さい',815,300,{size:36,color:RED,anchor:'middle',weight:700}),seg(p,.6,.75),RED);
  return s;
 },
 [K+'vals']:(p,ctx)=>{
  let s=card(300,40,600,250,'',1,C.dim)+label('ある ガラスの 屈折率',600,90,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.1,.25),label('赤',450,170,{size:36,color:RED,anchor:'middle',weight:700})+label('1.51',700,170,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),label('紫',450,245,{size:36,color:VIO,anchor:'middle',weight:700})+label('1.53',700,245,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('測定値',600,350,{color:C.dim,g:seg(p,.6,.75)});
  return s;
 },
 [K+'at60']:(p,ctx)=>{
  const Q=[520,240];
  let s=medium({y:Q[1],lower:'ガラス',upper:'空気',lx:330})+normal(...Q,{up:220,down:260});
  s+=rays({O:Q,th1:60,n1:1,n2:1.52,la:280,lb:0,trans:0,heads:1});
  s+=angMark(Q,'in',60,{r:80,text:'60^\\circ'});
  s+=card(780,40,380,100,F('\\sin60^\\circ\\approx0.866',970,100,36),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'red']:(p,ctx)=>{
  const Q=[520,240];
  let s=medium({y:Q[1],lower:'ガラス',upper:'空気',lx:330})+normal(...Q,{up:220,down:260});
  s+=rays({O:Q,th1:60,n1:1,n2:1.51,la:280,lb:0,trans:0});
  s+=rays({O:Q,th1:60,n1:1,n2:1.51,la:0,lb:280,color:RED,trans:seg(p,.05,.2),heads:0});
  s+=card(760,40,420,110,F('\\dfrac{0.866}{1.51}\\approx0.574',970,105,34),seg(p,.05,.2),RED);
  s+=card(760,180,420,90,F('\\approx 35.0^\\circ',970,235,36,{color:RED}),seg(p,.55,.7),RED);
  return s;
 },
 [K+'violet']:(p,ctx)=>{
  const Q=[520,240];
  let s=medium({y:Q[1],lower:'ガラス',upper:'空気',lx:330})+normal(...Q,{up:220,down:260});
  s+=rays({O:Q,th1:60,n1:1,n2:1.51,la:280,lb:0,trans:0})+rays({O:Q,th1:60,n1:1,n2:1.51,la:0,lb:280,color:RED,heads:0})+rays({O:Q,th1:60,n1:1,n2:1.53,la:0,lb:280,color:VIO,trans:seg(p,.05,.2),heads:0});
  s+=card(760,40,420,110,F('\\dfrac{0.866}{1.53}\\approx0.566',970,105,34),seg(p,.05,.2),VIO);
  s+=card(760,180,420,90,F('\\approx 34.5^\\circ',970,235,36,{color:VIO}),seg(p,.55,.7),VIO);
  s+=fade(seg(p,.7,.85),label('（重なって 見える）',700,480,{size:24,color:C.dim}));
  return s;
 },
 [K+'gap']:(p,ctx)=>{
  // zoom: two rays 0.53° apart; 1 m along the rays → about 9 mm apart
  const A0=[120,120],L=900,a1=35.0*R,a2=34.47*R,k=1;
  const dirR=[Math.cos(a1-PI/2+PI/2),0];
  let s=label('拡大図（進んだ 道のりと 離れ方）',60,50,{size:26,color:C.dim,weight:700});
  // draw both nearly parallel, exaggerating the separation 20×
  const ex=20,base=[1,0.0];
  const pR=[A0[0]+L,A0[1]+L*Math.tan(0)];
  s+=line(A0[0],250,A0[0]+L*lin(p,.05,.4),250,{color:VIO,w:5});
  s+=line(A0[0],250,A0[0]+L*lin(p,.05,.4),250+L*lin(p,.05,.4)*Math.tan(.525*R*ex),{color:RED,w:5});
  s+=fade(seg(p,.4,.55),line(A0[0]+L,250,A0[0]+L,250+L*Math.tan(.525*R*ex),{color:C.hi,w:3})+label('約 9 mm',A0[0]+L-10,250+L*Math.tan(.525*R*ex)/2+40,{size:28,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.4,.55),label('1 m 進む',A0[0]+L/2,220,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('差 約 0.5°',A0[0]+30,330,{size:28,color:ANG,weight:700}));
  s+=fade(seg(p,.6,.75),label('（離れ方は 20倍に 広げて 描いています）',600,480,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'prism']:(p,ctx)=>{
  const P1=[520,90],P2=[360,420],P3=[680,420];
  let s=poly([P1,P2,P3],{fill:GLASS,fo:.3,stroke:GLINE,sw:3});
  const inP=[mix(P1[0],P2[0],.5),mix(P1[1],P2[1],.5)],mid=[560,300];
  s+=line(80,330,...inP,{color:'#ffffff',w:7})+label('白い 光',90,370,{size:26,color:C.ink,weight:700});
  const cols=['#ff4d4d','#ff9a3c','#ffe14d','#5fe06a','#4dc3ff','#6b7bff','#b48cff'];
  cols.forEach((c,i)=>{const e=[mix(P1[0],P3[0],.6),mix(P1[1],P3[1],.6)];const g=seg(p,.15,.35);
   s+=fade(g,line(...inP,e[0],e[1]+i*3-6,{color:c,w:3}));
   s+=fade(seg(p,.3,.5),line(e[0],e[1]+i*3-6,1150,e[1]+150+i*34,{color:c,w:5}));});
  s+=fade(seg(p,.55,.7),label('分散',1000,180,{size:36,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.75),label('（広がりは 大きく 描いています）',1160,50,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 [K+'white']:(p,ctx)=>{
  let s=card(150,60,900,120,label('プリズムが 色を 作る ✕',600,135,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(150,260,900,120,label('白い 光 ＝ 多くの 色が 混ざった もの',600,335,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'rain']:(p,ctx)=>{
  const Cc=[700,260],Rr=190;
  let s=fade(seg(p,0,.15),dot(...Cc,Rr,GLASS,.3)+ring(...Cc,Rr,{color:GLINE,w:3})+label('雨粒',Cc[0]+Rr+20,Cc[1]-Rr+30,{size:28,color:GLINE,weight:700}));
  const P=dropPath(Cc,Rr,.86,1.333);
  s+=fade(seg(p,.05,.2),line(60,P.E[1],...P.E,{color:'#ffffff',w:5})+label('太陽の 光',70,P.E[1]-16,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,.2,.35),line(...P.E,...P.Q,{color:LIGHT,w:4})+ring(...P.E,12,{color:C.hi,w:3}));
  s+=fade(seg(p,.2,.35),label('① 屈折',P.E[0]-120,P.E[1]-30,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.6),line(...P.Q,...P.X,{color:LIGHT,w:4})+ring(...P.Q,12,{color:C.hi,w:3})+label('② 反射',P.Q[0]+20,P.Q[1]+10,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.7,.85),line(...P.X,P.X[0]+260*P.d3[0],P.X[1]+260*P.d3[1],{color:LIGHT,w:4})+ring(...P.X,12,{color:C.hi,w:3})+label('③ 屈折',P.X[0]-40,P.X[1]+60,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'rain2']:(p,ctx)=>{
  const Cc=[700,240],Rr=190;
  let s=dot(...Cc,Rr,GLASS,.3)+ring(...Cc,Rr,{color:GLINE,w:3});
  [[1.30,'#ff4d4d'],[1.33,'#ffe14d'],[1.36,'#b48cff']].forEach(([n,c],i)=>{const P=dropPath(Cc,Rr,.86,n);
   if(i===0)s+=line(60,P.E[1],...P.E,{color:'#ffffff',w:5});
   const g=seg(p,.05+i*.12,.2+i*.12);
   s+=fade(g,line(...P.E,...P.Q,{color:c,w:2.5})+line(...P.Q,...P.X,{color:c,w:2.5})+line(...P.X,P.X[0]+420*P.d3[0],P.X[1]+420*P.d3[1],{color:c,w:4}));});
  s+=fade(seg(p,.5,.65),label('色ごとに 少しずつ ずれる',60,480,{size:28,color:C.hi,weight:700})+label('（ずれは 大きく 描いています）',1160,50,{size:22,color:C.dim,anchor:'end'}));
  return s;
 },
 // ================= S7 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const a=mix(30,TC,lin(p,.1,.8));
  return exitScene(a,{num:1,lb:420,marks:0})+angMark(O,'in',a,{r:80,text:th(1)});
 },
 [K+'ans2']:(p,ctx)=>{
  let s=exitScene(50,{marks:0})+angMark(O,'in',50,{r:80,text:th(1)});
  s+=card(800,40,360,100,label('全反射',980,105,{size:40,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(800,170,360,130,F(`${sinC}=\\dfrac{n_2}{n_1}`,980,240,40),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'ans3']:(p,ctx)=>{
  let s=card(300,40,600,100,label('物質の 中で 速さが 変わる',600,105,{size:34,color:VCOL,anchor:'middle',weight:700}),1,VCOL);
  ['屈折','全反射','分散'].forEach((w,i)=>{const x=150+i*330,o=seg(p,.15+i*.15,.3+i*.15);
   s+=fade(o,arrow(600,145,x+150,265,{color:C.dim,w:3,head:12}))+card(x,270,300,100,label(w,x+150,335,{size:36,color:C.ink,anchor:'middle',weight:700}),o,C.dim);});
  return s;
 },
 [K+'mis']:(p,ctx)=>{
  let s=card(100,40,1000,110,label('空気から 水へ 入る ときも 全反射',600,110,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(100,200,1000,110,label('プリズムが 色を 作る',600,270,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65),C.a);
  s+=fade(seg(p,.2,.3),line(120,50,1080,140,{color:C.a,w:4}))+fade(seg(p,.65,.75),line(120,210,1080,300,{color:C.a,w:4}));
  return s;
 },
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx),S1=[200,190],S2=[200,330],lam=60;
  let s='';
  for(const Sx of [S1,S2])for(let k=0;k<12;k++){const r=lam*(k+(t/1.4)%1);if(r>480)continue;s+=fade(seg(p,0,.15)*clamp(1.2-r/480),`<path d="M${Sx[0]} ${Sx[1]-r} A${r} ${r} 0 0 1 ${Sx[0]} ${Sx[1]+r}" fill="none" stroke="${LIGHT}" stroke-width="2.5"/>`);}
  s+=fade(seg(p,0,.15),dot(...S1,10,'#fff7c2')+dot(...S2,10,'#fff7c2'));
  s+=card(720,40,440,100,label('強め合い？ 弱め合い？',940,102,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  s+=card(720,370,440,100,label('どこで？ どうすれば 見える？',940,432,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'bye']:(p,ctx)=>card(250,170,700,140,label('次の単元：干渉と回折',600,258,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
};
