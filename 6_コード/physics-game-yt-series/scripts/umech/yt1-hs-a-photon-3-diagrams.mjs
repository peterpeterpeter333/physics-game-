// 高校編「光子と電子・深く学ぶ 3/3」(ys-hs-a-photon-3) — 図。Stage 1200×515.
// 色は 1/3・2/3 と同じ：E・準位・段差 橙、ν 桃、λ 水色、c 紫、h 白、光子 黄、電子 青、干渉縞 淡い黄。
// 補助線①干渉縞（波）と光電効果（粒）を左右に並べ、E＝hc/λ でつなぐ。②水素の準位の階段（eV の目盛り）、落ちる電子と出ていく光子。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,tex,texWidth,clamp,mix} from './anim.mjs';
import {card,tag,sceneT,electron,NEG,EC,NC,LC,CC,PH,RED,UV,GRN,WHITE,cs,Et,nut,lt,ct,ht,U,TX,P10,H_,E19,bigL,
 metal,wavy,photon,ebar,cross,check,cl} from './yt1-hs-a-photon-1-diagrams.mjs';

const K='hs-a-photon-3:';
const PI=Math.PI;
const fc=(x,y,w,h,src,{g=1,size=46,col=C.hi}={})=>card(x,y,w,h,TX(src,x+w/2,y+h/2+size*.3,{size}),g,col);
const EHC=`${Et}=\\dfrac{${ht}${ct}}{${lt}}`, LHC=`${lt}=\\dfrac{${ht}${ct}}{${Et}}`;
// wavelength (nm) → display colour
export function wl(n){const st=[[380,'#8a5cff'],[440,'#4a6bff'],[490,'#3fc4ff'],[530,'#5fd068'],[580,'#ffe34d'],[605,'#ff9a3c'],[640,'#ff4b4b'],[720,'#ff4b4b']];
 if(n<=st[0][0])return st[0][1];for(let i=1;i<st.length;i++)if(n<=st[i][0])return (n-st[i-1][0])<(st[i][0]-n)?st[i-1][1]:st[i][1];return st[st.length-1][1];}
// "hν＝E高−E低" drawn from pieces (no Japanese inside TeX)
function fHL(x,y,{size=46,g=1,lead=`${ht}${nut}=`}={}){
 const p=[[lead,'t'],[cs(EC,'E'),'t'],['高','l'],['-','t'],[cs(EC,'E'),'t'],['低','l']];
 const ws=p.map(([s,k])=>k==='t'?texWidth(s,size,false)+(s==='-'?size*.5:0):size*.6);const W=ws.reduce((a,b)=>a+b,0);let xx=x-W/2,s='';
 p.forEach(([q,k],i)=>{if(k==='t')s+=TX(q,xx+(q==='-'?size*.25:0),y,{size,anchor:'start'});else s+=label(q,xx,y+size*.25,{size:Math.round(size*.55),color:EC,weight:700});xx+=ws[i];});
 return fade(g,s);
}
// ---- wave panel / particle panel -------------------------------------------------------------------
function fringePanel(x,y,{g=1,lab='干渉：波'}={}){
 let s=card(x,y,520,360,'',1);
 for(let yy=y+30;yy<y+330;yy+=4){const I=Math.cos(PI*(yy-(y+180))/40)**2;s+=rect(x+380,yy,60,4.5,{fill:'#fff3b0',fo:.08+.85*I,stroke:'none',rx:0});}
 s+=rect(x+130,y+30,10,130,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(x+130,y+176,10,8,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(x+130,y+200,10,130,{fill:'#56627a',fo:1,stroke:'none',rx:2});
 for(let k=1;k<6;k++){s+=`<path d="M ${x+135} ${y+168-k*36} A ${k*36} ${k*36} 0 0 1 ${x+135} ${y+168+k*36}" fill="none" stroke="#7fb6ff" stroke-width="2" opacity="${.7-k*.08}"/>`;s+=`<path d="M ${x+135} ${y+192-k*36} A ${k*36} ${k*36} 0 0 1 ${x+135} ${y+192+k*36}" fill="none" stroke="#ff9ce6" stroke-width="2" opacity="${.7-k*.08}"/>`;}
 s+=label(lab,x+260,y+400,{size:30,color:C.x,anchor:'middle',weight:700});
 return fade(g,s);
}
function particlePanel(x,y,t,{g=1,lab='光電効果：粒'}={}){
 let s=card(x,y,520,360,'',1)+metal(x+60,y+290,400,{text:''})+electron(x+330,y+270,{r:15});
 for(let i=0;i<3;i++){const u=((t*.6+i/3)%1);s+=photon(x+80+u*230,y+60+u*200);}
 s+=label(lab,x+260,y+400,{size:30,color:PH,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- hydrogen levels ---------------------------------------------------------------------------------
const LV={x0:200,x1:600,top:70,k:80}; // y = top - E*k  (E ≤ 0)
const ly=E=>LV.top-E*LV.k;
function ladder({g=1,vals=1,hl=[],x0=LV.x0,x1=LV.x1,zero=1,deep=1}={}){
 let s='';
 if(zero)s+=line(x0,ly(0),x1,ly(0),{color:C.dim,w:2,dash:'8 8'})+label('0',x0-16,ly(0)+8,{size:24,color:C.dim,anchor:'end'});
 [[-0.85,'−0.85'],[-1.51,'−1.51'],[-3.40,'−3.40']].forEach(([E,t])=>{const h=hl.includes(t);s+=line(x0,ly(E),x1,ly(E),{color:h?C.hi:EC,w:h?5:4});if(vals)s+=label(t+' eV',x0-16,ly(E)+9,{size:24,color:h?C.hi:EC,anchor:'end',weight:700});});
 if(deep){s+=line(x0,480,x1,480,{color:EC,w:4})+label('−13.6 eV',x0-16,489,{size:24,color:EC,anchor:'end',weight:700});
  s+=line(x0+200,410,x0+230,400,{color:C.dim,w:2})+line(x0+200,425,x0+230,415,{color:C.dim,w:2})+label('（下は 省略）',x0+250,420,{size:22,color:C.dim});}
 return fade(g,s);
}
function genericLadder({g=1,y0=90,dy=[0,60,140,260,400],x0=200,x1=700}={}){
 let s='';dy.forEach(d=>{s+=line(x0,y0+d,x1,y0+d,{color:EC,w:4});});return fade(g,s);
}
// a short wave strip for a wavelength in px
function strip(x,y,w,lam,col,{amp=20,t=0,g=1}={}){const pts=[];for(let xx=x;xx<=x+w;xx+=3)pts.push([xx,y-amp*Math.sin(2*PI*((xx-x)/lam-t*.6))]);return fade(g,draw(pts,1,{color:col,w:4}));}
// spectrum bar 380–720 nm with lines
function specBar(x,y,w,h,lines,{g=1,name='',dark=1,lab=0}={}){
 const X=n=>x+w*(n-380)/(720-380);let s=rect(x,y,w,h,{fill:'#0f1420',fo:1,stroke:C.dim,sw:2,rx:4});
 lines.forEach(([n,o])=>{s+=rect(X(n)-3,y+3,6,h-6,{fill:wl(n),fo:o??1,stroke:'none',rx:1});if(lab)s+=label(String(n),X(n),y-10,{size:22,color:wl(n),anchor:'middle',weight:700});});
 if(name)s+=label(name,x-16,y+h/2+9,{size:26,color:C.ink,anchor:'end',weight:700});
 return fade(g,s);
}
const H_LINES=[[656],[486],[434],[410]], HE_LINES=[[668],[588],[502],[471],[447]], NE_LINES=[[640],[633],[614],[609],[594],[585],[540]];

export const hsAPhoton3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{const t=sceneT(p,ctx);return fringePanel(40,30,{g:seg(p,0,.2)})+particlePanel(640,30,t,{g:seg(p,.45,.6)});},
 [K+'q2']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=fade(.3,fringePanel(40,30)+particlePanel(640,30,t));
  s+=card(250,70,700,100,label('どちらが 本当？',600,132,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  s+=specBar(300,300,720,70,H_LINES,{g:seg(p,.45,.6)})+bigL('原子が 出す 光の 色は？',600,260,{size:30,color:C.hi,g:seg(p,.45,.6)});
  return s;
 },
 [K+'plan']:(p)=>{
  const it=[[`${ct}=${nut}${lt}`,LC],[EHC,EC],['色',RED]];let s='';
  it.forEach(([src,c],i)=>{const x=80+i*370,o=seg(p,.1+i*.2,.25+i*.2);s+=card(x,150,300,170,i<2?TX(src,x+150,250,{size:i?44:46}):label('原子の 色',x+150,250,{size:34,color:C.ink,anchor:'middle',weight:700}),o,c);
   if(i<2)s+=fade(seg(p,.25+i*.2,.35+i*.2),arrow(x+305,235,x+365,235,{color:C.dim,w:4,head:14}));});
  return s;
 },
 // ================= S2 二重性 =================
 [K+'d1']:(p)=>{let s=fringePanel(340,30,{g:seg(p,0,.2)});s+=tag('波の 重ね合わせ',220,120,{color:C.x,g:seg(p,.5,.65)});return s;},
 [K+'d2']:(p,ctx)=>{const t=sceneT(p,ctx);let s=fade(.35,fringePanel(40,30))+particlePanel(640,30,t,{g:seg(p,0,.2)});s+=tag('1個 hν',900,70,{color:PH,g:seg(p,.4,.55)});return s;},
 [K+'d3']:(p,ctx)=>{const t=sceneT(p,ctx);let s=fringePanel(40,30)+particlePanel(640,30,t);s+=tag('実験 事実',310,60,{color:C.dim,g:seg(p,.05,.2)})+tag('実験 事実',900,60,{color:C.dim,g:seg(p,.05,.2)});return s;},
 [K+'d4']:(p,ctx)=>{const t=sceneT(p,ctx);let s=fade(.35,fringePanel(40,30)+particlePanel(640,30,t));s+=card(330,170,540,120,label('光の 二重性',600,245,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);return s;},
 [K+'mis1']:(p)=>{
  let s=card(200,60,800,110,label('光が 波 ⇄ 粒 に 変身する',600,128,{size:34,color:C.a,anchor:'middle',weight:700}),seg(p,0,.15),C.a)+cross(600,115,{s:50,g:seg(p,.3,.45)});
  s+=card(200,260,800,140,label('同じ 光が、いつも',600,318,{size:32,color:C.ink,anchor:'middle',weight:700})+label('波と 粒の 両方の 性質を 持つ',600,370,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'d6']:(p,ctx)=>{
  let s=card(240,30,720,380,'',seg(p,0,.15));
  s+=fade(seg(p,0,.15),rect(400,60,10,130,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(400,206,10,8,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(400,230,10,150,{fill:'#56627a',fo:1,stroke:'none',rx:2})+rect(780,60,8,320,{fill:'#c8d2e4',fo:.9,stroke:'none',rx:2}));
  const n=Math.floor(260*lin(p,.1,.9));for(let i=0;i<n;i++){const r1=(Math.sin(i*12.9898)*43758.5453)%1,r2=(Math.sin(i*78.233)*12345.678)%1;const yy=220+Math.abs(r1)*300-150;const I=Math.cos(PI*(yy-220)/40)**2;if(Math.abs(r2)>I)continue;s+=dot(800+Math.abs(r2)*40,yy,3.5,NEG);}
  s+=electron(300,220,{r:14,op:seg(p,0,.15)})+bigL('電子でも 縞が できる',600,460,{size:30,color:NEG,g:seg(p,.3,.45)})+tag('次の 単元',1060,60,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 // ================= S3 E＝hc/λ =================
 [K+'e1']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=strip(100,110,1000,160,WHITE,{t,g:seg(p,0,.15)});
  s+=fade(seg(p,0,.15),line(300,170,460,170,{color:LC,w:3})+line(300,160,300,180,{color:LC,w:3})+line(460,160,460,180,{color:LC,w:3})+TX(lt,380,210,{size:36}));
  s+=fc(380,280,440,120,`${ct}=${nut}\\,${lt}`,{g:seg(p,.45,.6),col:C.v,size:52});
  return s;
 },
 [K+'e2']:(p)=>{
  let s=fc(380,40,440,110,`${ct}=${nut}\\,${lt}`,{col:C.v,size:48});
  s+=fade(seg(p,.05,.25),label('両辺を λ で 割る',980,230,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fc(380,190,440,130,`${nut}=\\dfrac{${ct}}{${lt}}`,{g:seg(p,.25,.45),col:NC,size:48});
  return s;
 },
 [K+'e3']:(p)=>{
  let s=fade(.5,fc(80,40,360,130,`${nut}=\\dfrac{${ct}}{${lt}}`,{col:NC,size:44}));
  s+=fc(760,40,360,130,`${Et}=${ht}${nut}`,{col:EC,size:48,g:seg(p,0,.15)});
  s+=fade(seg(p,.15,.35),arrow(450,105,750,105,{color:C.hi,w:4,head:16})+label('代入',600,90,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fc(380,250,440,160,EHC,{g:seg(p,.5,.65),col:C.hi,size:56});
  return s;
 },
 [K+'e4']:(p)=>{
  let s=fc(380,150,440,160,EHC,{col:C.hi,size:56});
  s+=fade(seg(p,.05,.25),arrow(420,235,250,235,{color:PH,w:4,head:14})+label('粒 1個の',150,225,{size:28,color:PH,anchor:'middle',weight:700})+label('エネルギー',150,265,{size:28,color:PH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),arrow(780,270,950,270,{color:LC,w:4,head:14})+label('波の 波長',1050,280,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'e5']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=fade(.6,fc(380,20,440,140,EHC,{col:C.hi,size:50}));
  s+=strip(80,250,600,150,RED,{t,g:seg(p,.3,.45)})+fade(seg(p,.3,.45),label('長い 波長',80,215,{size:26,color:RED,weight:700}))+ebar(900,290,1.8,30,{w:50,stroke:RED,top:'',g:seg(p,.3,.45)});
  s+=strip(80,410,600,60,UV,{t,g:seg(p,.5,.65)})+fade(seg(p,.5,.65),label('短い 波長',80,375,{size:26,color:UV,weight:700}))+ebar(1040,460,4.1,30,{w:50,stroke:UV,g:seg(p,.5,.65)});
  s+=bigL('光子の エネルギー',970,200,{size:26,color:EC,g:seg(p,.6,.75)});
  return s;
 },
 [K+'e6']:(p)=>cl(`${ht}${ct}=${H_}\\times ${P10('3.0','8')}=${P10('1.98','-25')}${U('J\\cdot m')}`,90,110,seg(p,.2,.4),{size:40}),
 [K+'e7']:(p)=>cl(`${ht}${ct}=${H_}\\times ${P10('3.0','8')}=${P10('1.98','-25')}${U('J\\cdot m')}`,90,110,1,{size:40})+cl(`\\dfrac{${P10('1.98','-25')}}{${E19}}\\approx ${P10('1.24','-6')}${U('eV\\cdot m')}`,90,240,seg(p,.2,.4),{size:40}),
 [K+'e8']:(p)=>{
  let s=fade(.6,cl(`${ht}${ct}=${H_}\\times ${P10('3.0','8')}=${P10('1.98','-25')}${U('J\\cdot m')}`,90,110,1,{size:40})+cl(`\\dfrac{${P10('1.98','-25')}}{${E19}}\\approx ${P10('1.24','-6')}${U('eV\\cdot m')}`,90,240,1,{size:40}));
  s+=fade(seg(p,.05,.2),label('1 m ＝ 10⁹ nm',1100,330,{size:26,color:C.dim,anchor:'end',weight:700}));
  s+=card(150,340,800,120,TX(`${ht}${ct}\\approx ${P10('1.24','3')}${U('eV\\cdot nm')}=1240${U('eV\\cdot nm')}`,550,415,{size:42}),seg(p,.2,.4),C.hi);
  return s;
 },
 [K+'e9']:(p)=>{
  let s=card(150,40,800,110,TX(`${ht}${ct}\\approx 1240${U('eV\\cdot nm')}`,550,110,{size:42}),1,C.hi);
  s+=cl(`${Et}=\\dfrac{1240}{700}\\approx ${cs(EC,'1.8'+U('eV'))}`,200,280,seg(p,.2,.4),{size:46});
  s+=fade(seg(p,.2,.4),photon(820,270,{color:RED})+label('700 nm の 赤',880,280,{size:26,color:RED,weight:700}));
  s+=tag('深く学ぶ 1/3 と 一致',600,420,{color:C.hi,g:seg(p,.65,.8)});
  return s;
 },
 // ================= S4 エネルギー準位 =================
 [K+'l1']:(p)=>{
  let s=genericLadder({g:seg(p,.3,.5)});
  s+=fade(seg(p,.3,.5),electron(450,90+260-16,{r:14}));
  s+=bigL('決まった 値 だけ',900,200,{size:32,color:EC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'l2']:(p)=>{
  let s=genericLadder({})+electron(450,334,{r:14});
  s+=bigL('エネルギー 準位',900,140,{size:34,color:EC,g:seg(p,0,.15)});
  s+=fade(seg(p,.45,.6),electron(560,280,{r:14,op:.5})+cross(560,280,{s:22})+label('途中には いられない',740,288,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'l3']:(p)=>{
  let s=genericLadder({})+electron(450,334,{r:14});
  s+=tag('観察に 支えられた 事実',930,150,{color:C.hi,g:seg(p,.05,.2),size:26});
  s+=card(760,240,360,110,label('なぜ 飛び飛び？',940,285,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ 次の 単元',940,330,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'l4']:(p)=>{
  const u=seg(p,.15,.6);let s=genericLadder({});
  s+=label('高い 準位',720,98+140,{size:26,color:EC,weight:700})+label('低い 準位',720,98+260,{size:26,color:EC,weight:700});
  s+=electron(450,mix(90+140-16,90+260-16,u),{r:14});
  s+=fade(seg(p,.6,.8),arrow(880,230,880,350,{color:EC,w:4,head:14})+label('差の 分 減る',900,300,{size:26,color:EC,weight:700}));
  return s;
 },
 [K+'l5']:(p)=>{
  let s=genericLadder({})+label('高い 準位',720,98+140,{size:26,color:EC,weight:700})+label('低い 準位',720,98+260,{size:26,color:EC,weight:700})+electron(450,334,{r:14});
  s+=fade(seg(p,0,.15),rect(520,230,40,120,{fill:EC,fo:.5,stroke:EC,sw:2,rx:4}));
  const u=seg(p,.1,.5);s+=photon(mix(560,820,u),mix(290,150,u))+wavy(560,290,mix(560,800,u)+1,mix(290,160,u),{color:RED,g:u>0.05?1:0});
  s+=fHL(960,440,{g:seg(p,.5,.65)});
  s+=tag('エネルギー保存',1080,60,{color:C.dim,g:seg(p,.5,.65)});
  return s;
 },
 [K+'l6']:(p,ctx)=>{
  let s=genericLadder({x0:120,x1:520});
  s+=fade(seg(p,0,.2),arrow(250,90+140,250,90+260,{color:RED,w:5,head:16})+arrow(400,90,400,90+260,{color:UV,w:5,head:16}));
  s+=fade(seg(p,0,.2),label('小さい 段差',230,60,{size:26,color:RED,anchor:'middle',weight:700})+label('大きい 段差',430,60,{size:26,color:UV,anchor:'middle',weight:700}));
  s+=strip(620,180,500,150,RED,{g:seg(p,.3,.45),amp:16})+fade(seg(p,.3,.45),label('長い 波長',620,140,{size:26,color:RED,weight:700}));
  s+=strip(620,370,500,55,UV,{g:seg(p,.55,.7),amp:16})+fade(seg(p,.55,.7),label('短い 波長（エネルギー 大）',620,330,{size:26,color:UV,weight:700}));
  return s;
 },
 // ================= S5 水素の赤い光 =================
 [K+'c1']:(p)=>{
  let s=ladder({g:seg(p,0,.2)})+bigL('水素原子',850,90,{size:34,color:C.ink,g:seg(p,0,.2)});
  s+=card(680,190,460,120,label('準位の 値は',910,238,{size:26,color:C.ink,anchor:'middle',weight:700})+label('次の 単元で 計算する',910,285,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'c2']:(p)=>{
  const u=seg(p,.2,.7);let s=ladder({hl:['−1.51','−3.40']});
  s+=electron(380,mix(ly(-1.51),ly(-3.40),u)-16,{r:14});
  s+=fade(seg(p,.2,.4),arrow(440,ly(-1.51)+6,440,ly(-3.40)-6,{color:C.hi,w:4,head:14}));
  return s;
 },
 [K+'c3']:(p)=>{
  let s=ladder({hl:['−1.51','−3.40']})+electron(380,ly(-3.40)-16,{r:14});
  s+=fade(seg(p,0,.2),rect(630,ly(-1.51),50,ly(-3.40)-ly(-1.51),{fill:EC,fo:.5,stroke:EC,sw:2,rx:4})+label('1.89 eV',700,(ly(-1.51)+ly(-3.40))/2+9,{size:28,color:EC,weight:700}));
  s+=cl(`-1.51-(-3.40)=${cs(EC,'1.89'+U('eV'))}`,700,110,seg(p,.1,.3),{size:38});
  s+=fade(seg(p,.6,.75),photon(900,330,{color:RED})+label('光子 1個',940,340,{size:26,color:PH,weight:700}));
  return s;
 },
 [K+'c4']:(p)=>{
  let s=TX(EHC,600,110,{size:52});
  s+=fade(seg(p,.1,.3),label('両辺に λ を 掛ける',1000,230,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.6),TX(`${Et}\\,${lt}=${ht}${ct}`,600,250,{size:52}));
  return s;
 },
 [K+'c5']:(p)=>{
  let s=fade(.5,TX(EHC,600,110,{size:52}))+TX(`${Et}\\,${lt}=${ht}${ct}`,600,250,{size:52});
  s+=fade(seg(p,.05,.25),label('両辺を E で 割る',1000,370,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fc(380,320,440,150,LHC,{g:seg(p,.3,.5),col:LC,size:52});
  return s;
 },
 [K+'c6']:(p)=>{
  let s=fc(80,40,400,140,LHC,{col:LC,size:48});
  s+=cl(`${lt}=\\dfrac{1240${U('eV\\cdot nm')}}{1.89${U('eV')}}\\approx ${cs(LC,'656'+U('nm'))}`,120,300,seg(p,.1,.35),{size:44});
  return s;
 },
 [K+'c7']:(p)=>{
  let s=specBar(140,230,920,90,[[656]],{g:seg(p,0,.2),lab:1});
  s+=fade(seg(p,0,.2),label('400 nm',140,360,{size:22,color:C.dim,anchor:'middle'})+label('700 nm',140+920*(700-380)/340,360,{size:22,color:C.dim,anchor:'middle'}));
  s+=bigL('水素の 赤い 線',600,120,{size:32,color:RED,g:seg(p,.4,.55)});
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=card(100,40,1000,120,TX(`${lt}=\\dfrac{1240}{3.40}\\approx 365${U('nm')}`,420,115,{size:40})+label('（紫外線）',800,112,{size:28,color:UV,weight:700}),seg(p,0,.15),C.a)+cross(600,100,{s:46,g:seg(p,.3,.45)});
  s+=label('準位の 値 そのもの',600,200,{size:26,color:C.a,anchor:'middle',weight:700});
  s+=card(100,280,1000,130,TX(`${lt}=\\dfrac{1240}{1.89}\\approx 656${U('nm')}`,420,360,{size:40})+label('準位の 差',800,355,{size:30,color:GRN,weight:700}),seg(p,.55,.7),GRN);
  return s;
 },
 [K+'spec']:(p)=>{
  let s=specBar(260,80,860,70,H_LINES,{name:'水素',g:seg(p,0,.2)});
  s+=specBar(260,220,860,70,HE_LINES,{name:'ヘリウム',g:seg(p,.2,.4)});
  s+=specBar(260,360,860,70,NE_LINES,{name:'ネオン',g:seg(p,.4,.6)});
  s+=bigL('線スペクトル：元素ごとの 色',690,480,{size:28,color:C.hi,g:seg(p,.7,.85)});
  return s;
 },
 [K+'use']:(p)=>{
  const it=[['ネオンサイン','#ff6b4b'],['炎色反応','#ffd34d'],['星の 成分','#9fd0ff']];let s='';
  it.forEach(([t,c],i)=>{const x=80+i*370;s+=card(x,170,300,150,label(t,x+150,255,{size:32,color:c,anchor:'middle',weight:700}),seg(p,.1+i*.2,.25+i*.2),c);});
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=fade(.45,fringePanel(20,40,{lab:'波'})+particlePanel(660,40,t,{lab:'粒'}));
  s+=fc(430,160,340,150,EHC,{g:seg(p,.3,.45),col:C.hi,size:50});
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=ladder({hl:['−1.51','−3.40'],deep:0})+rect(630,ly(-1.51),50,ly(-3.40)-ly(-1.51),{fill:EC,fo:.5,stroke:EC,sw:2,rx:4});
  s+=fc(740,150,400,150,LHC,{g:seg(p,.3,.45),col:LC,size:50});
  return s;
 },
 [K+'univ']:(p)=>card(200,170,800,150,label('大学編',600,230,{size:30,color:C.dim,anchor:'middle',weight:700})+label('準位を 量子力学の 方程式から 求める',600,285,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
 [K+'end']:(p)=>card(250,140,700,200,label('次の 単元',600,210,{size:30,color:C.dim,anchor:'middle'})+label('物質波と ボーア模型',600,280,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
 [K+'next']:(p,ctx)=>{
  const t=sceneT(p,ctx);let s=ladder({hl:['−1.51','−3.40'],deep:0,g:seg(p,0,.15)});
  s+=bigL('なぜ 飛び飛び？',360,470,{size:30,color:C.hi,g:seg(p,.1,.25)});
  const g=seg(p,.5,.65);const pts=[];for(let a=0;a<=2*PI+.01;a+=.03){const r=110+14*Math.sin(8*a-t*2);pts.push([900+r*Math.cos(a),260+r*Math.sin(a)]);}
  s+=fade(g,draw(pts,1,{color:NEG,w:4})+dot(900,260,12,C.a)+label('電子の 波？',900,440,{size:30,color:NEG,anchor:'middle',weight:700}));
  return s;
 },
};
