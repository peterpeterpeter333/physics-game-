// YouTube シリーズ「電磁誘導・上級 2/2」(ys-ue-faraday-2) — 図。Stage 1200×515.
// 2つのコイル（横から見た図）：コイル1 左、コイル2 右、共通の軸は左右。I₁ の磁場は右向き（コイル1の手前の弧は下向きの電流）。
// I₁ が増えるとき、閉じたコイル2の誘導電流は左向きの磁場（赤）をつくる向き → コイル2の手前の弧は上向き。
// 変圧器：四角い鉄心（灰）。左の脚にコイル1（N₁＝少ない巻き）、右の脚にコイル2（N₂＝多い巻き）。共通の Φ（黄）は鉄心の中を一周
//   （ある瞬間：左の脚で上向き → 上 → 右の脚で下向き → 下）。符号は巻く向きで変わるので、電圧は大きさで扱う。
// 色：電流 I₁・I₂ と巻き線 緑、起電力 ℰ・電圧 V 紫、𝐁 橙、誘導の磁場 赤、磁束 Φ・Ψ 黄、電力・エネルギー 橙、t 金、M・N 白、鉄心 灰。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,highlight} from './anim.mjs';
import {T,cs,card,TF,head,arcPts,solenoid,inductor,LM,CI,EMF,CB,PHI,WC,TC,BAD,OK,INK,DIM,EM,Vt,Ic,PS,PH,tt,dIdt,U_,BACK,UL} from './yt1-ue-faraday-1-diagrams.mjs';

const K='ue-faraday-2:';
const IND='#ff6b6b',CORE='#8795ad';
const I1=cs(CI,'I_1'),I2=cs(CI,'I_2'),V1=cs(EMF,'V_1'),V2=cs(EMF,'V_2'),E2=cs(EMF,'\\mathcal{E}_2'),P2=cs(PHI,'\\Psi_2'),P1=cs(PHI,'\\Psi_1');
const dI1=`\\dfrac{d${I1}}{d${tt}}`,dPh=`\\left|\\dfrac{d${PH}}{d${tt}}\\right|`;
const DEF=`${P2}=M${I1}`,MUT=`${E2}=-M\\,${dI1}`,VR=`\\dfrac{|${V2}|}{|${V1}|}=\\dfrac{N_2}{N_1}`,IR=`\\dfrac{${I1}}{${I2}}=\\dfrac{N_2}{N_1}`;

// ---- two coils side by side ---------------------------------------------------------------------------------------
function twoCoils({g=1,c1=1,c2=1,link=1,i2=0,ind=0,closed=0,k=1,hl2=0,q2=0}={}){
 let s=solenoid({x0:70,x1:330,ry:85,n:7,cy:240,Bk:.8*k,blab:0,curG:c1,ilab:0});
 // field lines from coil 1 continuing through coil 2 (spreading a little)
 if(link>0)s+=fade(link,[-.62,-.21,.21,.62].map(f=>draw([[390,240+f*85],[560,240+f*85*1.05],[780,240+f*85*1.15]],1,{color:CB,w:3,dash:'10 8',opacity:.85})).join('')+head(790,240+.62*85*1.15,1,0,{color:CB,L:14})+head(790,240-.62*85*1.15,1,0,{color:CB,L:14}));
 s+=fade(c2,solenoid({x0:470,x1:730,ry:85,n:7,cy:240,Bg:0,curG:i2,up:1,leads:0,ilab:0,col:i2>0||hl2>0?CI:DIM,hl:hl2>0?[0,1,2,3,4,5,6]:[]}));
 if(ind>0)s+=fade(ind,[-.3,.3].map(f=>arrow(720,240+f*85,480,240+f*85,{color:IND,w:5,head:16})).join('')+label('誘導の 磁場',600,135,{size:24,color:IND,anchor:'middle',weight:700}));
 if(closed>0)s+=fade(closed,draw([[489,155],[489,112],[425,112],[425,460],[785,460],[785,325],[711,325]],1,{color:i2>0?CI:DIM,w:3})+rect(520,445,80,30,{fill:'#131f38',fo:1,stroke:INK,sw:2,rx:4})+label('R',560,468,{size:22,color:INK,anchor:'middle'}));
 s+=label('コイル1',200,405,{size:26,color:CI,anchor:'middle',weight:700})+fade(c2,label('コイル2',600,405,{size:26,color:i2>0||hl2>0?CI:DIM,anchor:'middle',weight:700}));
 s+=fade(c1,T(I1,40,128,{size:30}));
 return fade(g,s);
}
// ---- transformer on an iron core -----------------------------------------------------------------------------------
const TR={x0:200,x1:640,y0:80,y1:440,w:70};
function legCoil(cx,ya,yb,n,{g=1,col=CI,heads=0,dir=1}={}){
 let s='';const rx=TR.w/2+22,ry=12;
 for(let i=0;i<n;i++){const y=ya+(yb-ya)*(i+.5)/n;
  s+=draw(arcPts(cx,y,rx,ry,0,180,20),1,{color:col,w:3,opacity:.45});
  s+=draw(arcPts(cx,y,rx,ry,180,360,20),1,{color:col,w:5});
  if(heads)s+=head(cx+dir*8,y+ry,dir,0,{color:col,L:12});}
 return fade(g,s);
}
function source(x,y,g=1){return fade(g,ring(x,y,30,{color:EMF,w:3,fill:'#131f38'})+draw(Array.from({length:21},(_,i)=>[x-18+36*i/20,y-10*Math.sin(i/20*2*Math.PI)]),1,{color:EMF,w:3}));}
function transformer({g=1,phi=0,coils=1,n1=5,n2=12,labels=1,volt=0,cur=0,load=1,src=1,p=0,hlTurn=0}={}){
 const {x0,x1,y0,y1,w}=TR;
 let s=rect(x0,y0,x1-x0,y1-y0,{fill:CORE,fo:.35,stroke:CORE,sw:2,rx:8})+rect(x0+w,y0+w,x1-x0-2*w,y1-y0-2*w,{fill:C.bg,fo:1,stroke:CORE,sw:2,rx:4});
 s+=label('鉄心',(x0+x1)/2,y0-14,{size:24,color:INK,anchor:'middle'});
 if(phi>0){// flux arrows around the core (clockwise on screen: up the left leg)
  const cxl=x0+w/2,cxr=x1-w/2,cyt=y0+w/2,cyb=y1-w/2,mv=((p*1.5)%1);
  const loop=[[cxl,cyb],[cxl,cyt],[cxr,cyt],[cxr,cyb],[cxl,cyb]];
  s+=fade(phi,draw(loop,1,{color:PHI,w:3,dash:'14 10',opacity:.9})+head(cxl,(cyt+cyb)/2-40,0,-1,{color:PHI,L:18})+head((cxl+cxr)/2+30,cyt,1,0,{color:PHI,L:18})+head(cxr,(cyt+cyb)/2+40,0,1,{color:PHI,L:18})+head((cxl+cxr)/2-30,cyb,-1,0,{color:PHI,L:18})
   +label('Φ',x0+w+50,(y0+y1)/2+10,{size:34,color:PHI,anchor:'middle',weight:700}));
 }
 if(coils>0){s+=legCoil(x0+w/2,y0+w+20,y1-w-20,n1,{g:coils,heads:cur>0,dir:1})+legCoil(x1-w/2,y0+w+5,y1-w-5,n2,{g:coils});
  if(hlTurn>0){const y=y0+w+20+(y1-w-20-(y0+w+20))*(.5)/n1;s+=fade(hlTurn,ring(x0+w/2,y,28,{color:C.hi,w:3}));}
  // leads
  s+=fade(coils,draw([[x0-22,y0+w+30],[110,y0+w+30],[110,(y0+y1)/2-30]],1,{color:CI,w:3})+draw([[110,(y0+y1)/2+30],[110,y1-w-30],[x0-22,y1-w-30]],1,{color:CI,w:3}));
  if(src)s+=fade(coils,source(110,(y0+y1)/2));
  s+=fade(coils,draw([[x1+22,y0+w+15],[740,y0+w+15],[740,(y0+y1)/2-35]],1,{color:CI,w:3})+draw([[740,(y0+y1)/2+35],[740,y1-w-15],[x1+22,y1-w-15]],1,{color:CI,w:3}));
  if(load)s+=fade(coils,rect(725,(y0+y1)/2-35,30,70,{fill:'#131f38',fo:1,stroke:INK,sw:2,rx:4})+label('負荷',790,(y0+y1)/2+8,{size:20,color:DIM,anchor:'middle'}));
  if(labels)s+=fade(coils,T('N_1',x0+w/2,y1+40,{size:30})+T('N_2',x1-w/2,y1+40,{size:30})+label('コイル1',x0+w/2-90,y1+44,{size:22,color:CI,anchor:'end'})+label('コイル2',x1-w/2+70,y1+44,{size:22,color:CI}));
 }
 if(volt>0)s+=fade(volt,T(V1,60,(y0+y1)/2,{size:34})+T(V2,800,(y0+y1)/2-70,{size:34}));
 if(cur>0)s+=fade(cur,T(I1,150,y0+w+5,{size:30})+T(I2,690,y0+w-10,{size:30}));
 return fade(g,s);
}
// ---- cells in series ------------------------------------------------------------------------------------------------
function cells(x,yb,n,{g=1,lab=''}={}){
 let s='';const h=Math.min(30,300/n);
 for(let i=0;i<n;i++){const y=yb-i*h;s+=rect(x-40,y-h+4,80,h-6,{fill:EMF,fo:.25,stroke:EMF,sw:2,rx:3});}
 s+=label(lab,x,yb+36,{size:26,color:INK,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- transmission line ---------------------------------------------------------------------------------------------
function box(x,y,w,h,t,col=INK){return rect(x,y,w,h,{fill:'#131f38',fo:1,stroke:col,sw:2.5,rx:10})+label(t,x+w/2,y+h/2+9,{size:24,color:col,anchor:'middle',weight:700});}
function xfm(x,y,{g=1,lab=''}={}){// two small coil symbols facing each other
 let s='';for(const dx of [-16,16]){const pts=[];for(let k=0;k<4;k++)pts.push(...arcPts(x+dx,y-36+18*k+9,9,9,dx<0?90:-90,dx<0?270:90,10));s+=draw(pts,1,{color:CI,w:3});}
 s+=line(x,y-42,x,y+42,{color:CORE,w:4});
 return fade(g,s+label(lab,x,y+70,{size:22,color:INK,anchor:'middle',weight:700}));
}
function grid({g=1,up=0,down=0,lineV='',lineI='',loss='',hl=0}={}){
 let s=box(40,200,140,70,'発電所',WC)+box(1020,200,140,70,'町',INK);
 s+=line(180,235,1020,235,{color:DIM,w:4});
 s+=fade(up,xfm(290,235,{lab:'上げる'}));
 s+=fade(down,xfm(910,235,{lab:'下げる'}));
 s+=label('送電線（抵抗 10 Ω）',600,205,{size:24,color:DIM,anchor:'middle'});
 if(lineV)s+=label(lineV,600,300,{size:34,color:EMF,anchor:'middle',weight:700});
 if(lineI)s+=label(lineI,600,350,{size:30,color:CI,anchor:'middle',weight:700});
 if(loss)s+=label(loss,600,405,{size:30,color:WC,anchor:'middle',weight:700});
 return fade(g,s);
}

export const ytUeFaraday2Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=inductor({cur:1,emf:1});
  s+=card(740,80,420,350,LM('電磁誘導・上級 1/2',950,125,{size:22,color:DIM})
   +T(BACK,950,210,{size:44})
   +fade(seg(p,.45,.6),T(UL,950,320,{size:46})+LM('磁場に 蓄える',950,390,{size:26,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=twoCoils({c2:1,link:seg(p,.1,.3)});
  s+=label('？',600,120,{size:48,color:C.hi,anchor:'middle',weight:700});
  s+=card(820,80,350,350,LM('前回の 最後の 問い',995,125,{size:22,color:DIM})
   +LM('隣の コイルに',995,190,{size:26,color:INK})+LM('起電力を 作らせたら？',995,235,{size:26,color:EMF,weight:700})
   +fade(seg(p,.45,.6),LM('導線で つながずに',995,310,{size:26,color:INK})+LM('エネルギーを 渡せる？',995,355,{size:26,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s=LM('今回の 道すじ',600,80,{size:28,color:DIM});
  const rows=[['① 相互インダクタンス M を 定義',PHI],['② 変圧器：電圧の 比と 電流の 比',EMF],['③ 送電に つなぐ',WC]];
  rows.forEach(([t,c],i)=>{s+=fade(seg(p,.1+i*.2,.25+i*.2),card(250,120+i*115,700,90,label(t,290,175+i*115,{size:34,color:c,weight:700}),1));});
  return s;
 },
 // ===== S2 =====
 [K+'two']:(p)=>{
  let s=twoCoils({c2:seg(p,0,.2),link:seg(p,.5,.75)});
  s+=card(840,90,330,320,LM('コイル1 に I₁',1005,150,{size:28,color:CI,weight:700})
   +fade(seg(p,.45,.6),LM('磁場の 一部が',1005,230,{size:26,color:CB})+LM('コイル2 を 貫く',1005,275,{size:28,color:CB,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'psi2']:(p)=>{
  let s=twoCoils({hl2:seg(p,.05,.25)});
  s+=card(840,70,330,380,LM('コイル2 の 鎖交磁束',1005,120,{size:24,color:PHI,weight:700})
   +T(P2,1005,190,{size:46})
   +fade(seg(p,.45,.6),LM('I₁ が 2倍',1005,270,{size:26,color:CI})+LM('→ Ψ₂ も 2倍',1005,315,{size:28,color:PHI,weight:700}))
   +fade(seg(p,.7,.85),LM('（比例）',1005,370,{size:24,color:DIM})),seg(p,0,.15));
  return s;
 },
 [K+'def']:(p)=>{
  let s=twoCoils({hl2:1});
  s+=card(820,70,350,380,LM('定義（線形のとき）',995,115,{size:24,color:DIM})
   +T(DEF,995,200,{size:50})
   +fade(seg(p,.35,.5),LM('M：相互インダクタンス',995,285,{size:26,color:INK,weight:700}))
   +fade(seg(p,.6,.75),LM('単位 H（L と 同じ）',995,355,{size:28,color:INK})),seg(p,0,.15));
  s+=fade(seg(p,.15,.3),highlight(865,150,260,95,1,C.hi));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=twoCoils({hl2:.6});
  s+=fade(seg(p,.1,.25),line(330,320,470,320,{color:INK,w:2})+label('距離',400,350,{size:24,color:INK,anchor:'middle'}));
  s+=card(820,70,350,380,LM('M を 決めるもの',995,115,{size:24,color:DIM})
   +LM('形・巻数',995,185,{size:28,color:INK,weight:700})+LM('距離・向き',995,235,{size:28,color:INK,weight:700})+LM('間の 物質',995,285,{size:28,color:INK,weight:700})
   +fade(seg(p,.55,.7),LM('変わらなければ 一定',995,360,{size:26,color:C.hi,weight:700})+LM('（磁場 ∝ 電流 の 範囲）',995,400,{size:22,color:DIM})),seg(p,0,.15));
  return s;
 },
 [K+'emf']:(p)=>{
  let s=TF(`${E2}=-\\dfrac{d${P2}}{d${tt}}`,600,95,{size:46});
  s+=fade(seg(p,.05,.2),LM('コイル2 に ファラデーの 法則',990,105,{size:24,color:DIM}));
  s+=TF(`=-\\dfrac{d(M${I1})}{d${tt}}`,600,235,{size:46,g:seg(p,.3,.5)});
  s+=fade(seg(p,.4,.55),LM('M 一定 → 外へ',990,245,{size:24,color:INK}));
  s+=TF(MUT,600,400,{size:58,box:true,frac:true,g:seg(p,.55,.75)});
  return s;
 },
 [K+'lenz']:(p)=>{
  let s=twoCoils({k:1+.3*seg(p,.1,.6),closed:1,i2:seg(p,.45,.6),ind:seg(p,.5,.7)});
  s+=card(840,70,330,380,LM('I₁ が 増える',1005,120,{size:26,color:CI,weight:700})
   +LM('→ 右向きの 磁束が 増える',1005,170,{size:22,color:CB})
   +fade(seg(p,.45,.6),LM('コイル2 の 電流',1005,245,{size:26,color:CI,weight:700})+LM('左向きの 磁場を つくる',1005,290,{size:24,color:IND,weight:700}))
   +fade(seg(p,.7,.85),LM('（手前の 弧で 上向き）',1005,345,{size:22,color:DIM})),seg(p,0,.15));
  return s;
 },
 [K+'dc']:(p)=>{
  let s=twoCoils({closed:1,i2:1,ind:1,k:1.3});
  s+=card(840,70,330,380,LM('増加を 妨げる 向き',1005,125,{size:26,color:IND,weight:700})+LM('（レンツの 法則）',1005,170,{size:22,color:DIM})
   +fade(seg(p,.45,.6),LM('I₁ を 一定に すると',1005,255,{size:26,color:CI})+T(`${E2}=\\,?`,1005,330,{size:44})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'dc2']:(p)=>{
  let s=twoCoils({closed:1,i2:0,ind:0,k:1});
  s+=card(820,60,350,400,T(`${dI1}=0`,995,140,{size:40})
   +fade(seg(p,.1,.25),T(`\\Rightarrow\\ ${E2}=0`,995,230,{size:40}))
   +fade(seg(p,.4,.55),LM('変わらなければ 何も 起きない',995,310,{size:22,color:INK}))
   +fade(seg(p,.65,.8),LM('→ 交流を 使う',995,380,{size:30,color:C.hi,weight:700})),1);
  return s;
 },
 [K+'phone']:(p)=>{
  // charging pad (coil 1) and phone (coil 2), side view
  let s=rect(120,330,500,60,{fill:'#2a3550',fo:1,stroke:DIM,sw:2,rx:14})+label('充電台',100,370,{size:24,color:INK,anchor:'end'})+label('',370,370,{size:24,color:INK,anchor:'middle'});
  s+=rect(150,180,440,40,{fill:'#1c2438',fo:1,stroke:INK,sw:2,rx:10})+label('スマホ',370,165,{size:24,color:INK,anchor:'middle'});
  for(let k=0;k<4;k++){s+=draw(arcPts(370,350,60+k*28,10,180,360,30),1,{color:CI,w:3});s+=draw(arcPts(370,205,50+k*24,8,180,360,30),1,{color:CI,w:3});}
  const u=Math.sin(p*Math.PI*6);
  [-1,0,1].forEach(d=>{s+=arrow(370+d*90,325,370+d*90,235,{color:CB,w:4,head:14,opacity:.5+.4*Math.abs(u)});});
  s+=label('コイル1',660,365,{size:24,color:CI,weight:700})+label('コイル2',660,210,{size:24,color:CI,weight:700});
  s+=card(820,110,350,290,LM('台の コイル ＝ 1',995,190,{size:28,color:CI,weight:700})+LM('スマホの コイル ＝ 2',995,250,{size:28,color:CI,weight:700})+LM('変化する 磁場で つながる',995,330,{size:22,color:CB}),seg(p,0,.15));
  return s;
 },
 [K+'ih']:(p)=>{
  let s=rect(120,330,500,60,{fill:'#2a3550',fo:1,stroke:DIM,sw:2,rx:14})+label('IH の 天板',370,425,{size:24,color:INK,anchor:'middle'});
  for(let k=0;k<4;k++)s+=draw(arcPts(370,350,60+k*28,10,180,360,30),1,{color:CI,w:3});
  // pot
  s+=rect(200,180,340,110,{fill:'#4a4f5c',fo:1,stroke:INK,sw:2,rx:10})+label('鍋',370,165,{size:26,color:INK,anchor:'middle'});
  const gl=seg(p,.4,.7);
  s+=fade(gl,rect(205,262,330,26,{fill:WC,fo:.6,stroke:'none',rx:4}));
  // eddy current loops on the bottom
  s+=fade(seg(p,.2,.4),[-90,0,90].map(d=>draw(arcPts(370+d,275,34,8,0,360,30),1,{color:CI,w:3})).join('')+label('渦電流',560,275,{size:24,color:CI,weight:700}));
  s+=card(820,90,350,330,LM('鍋底 ＝ コイル2 の 役',995,160,{size:26,color:CI,weight:700})
   +fade(seg(p,.35,.5),LM('渦電流が 流れる',995,235,{size:26,color:CI}))
   +fade(seg(p,.55,.7),LM('ジュール熱 → 鍋が 温まる',995,310,{size:24,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'energy']:(p)=>{
  let s=twoCoils({closed:1,i2:1,ind:1});
  s+=fade(seg(p,.3,.5),arrow(470,120,330,120,{color:IND,w:4,head:14})+label('コイル1 にも 起電力',400,95,{size:22,color:IND,anchor:'middle',weight:700}));
  s+=card(840,70,330,380,LM('無からは 生まれない',1005,125,{size:26,color:INK,weight:700})
   +fade(seg(p,.35,.5),LM('コイル2 の 電流の 磁場',1005,205,{size:22,color:IND})+LM('→ コイル1 に 起電力',1005,245,{size:22,color:EMF}))
   +fade(seg(p,.6,.75),LM('電源が 逆らって',1005,320,{size:24,color:INK})+LM('余分に 仕事',1005,360,{size:30,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=twoCoils({closed:1,i2:1,link:1,k:1+.2*Math.sin(p*Math.PI*4)});
  s+=card(840,90,330,340,LM('導線で つながずに',1005,150,{size:24,color:INK})+LM('渡せる 理由',1005,195,{size:28,color:C.hi,weight:700})
   +fade(seg(p,.3,.5),LM('変化する 磁場が',1005,270,{size:26,color:CB,weight:700})+LM('間の 空間を 通して',1005,315,{size:24,color:INK})+LM('起電力を 作る',1005,360,{size:26,color:EMF,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 =====
 [K+'core']:(p)=>{
  let s=transformer({coils:seg(p,.1,.3),phi:seg(p,.5,.7),p,volt:0});
  s+=card(860,90,310,320,LM('同じ 鉄心に 巻く',1015,150,{size:26,color:INK,weight:700})
   +fade(seg(p,.5,.65),LM('磁束を 中に 通す',1015,230,{size:26,color:PHI,weight:700})+LM('外へ 漏らしにくい',1015,280,{size:24,color:INK})),seg(p,0,.15));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=transformer({phi:1,p});
  s+=card(860,70,310,380,LM('理想変圧器（仮定）',1015,120,{size:24,color:C.hi,weight:700})
   +fade(seg(p,.2,.35),LM('① どの 巻きも',1015,195,{size:24,color:INK})+LM('同じ Φ が 貫く',1015,235,{size:26,color:PHI,weight:700}))
   +fade(seg(p,.55,.7),LM('② 損失が ない',1015,310,{size:26,color:INK,weight:700})+LM('（抵抗・鉄心の 熱）',1015,350,{size:22,color:DIM})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'perturn']:(p)=>{
  let s=transformer({phi:1,p,hlTurn:seg(p,.1,.3)});
  s+=card(860,90,310,320,LM('1巻き あたりの',1015,150,{size:24,color:INK})+LM('起電力の 大きさ',1015,190,{size:26,color:EMF,weight:700})
   +fade(seg(p,.35,.5),T(dPh,1015,280,{size:44}))
   +fade(seg(p,.6,.75),LM('どちらの コイルでも 同じ',1015,365,{size:22,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'v1']:(p)=>{
  let s=transformer({phi:1,p,volt:seg(p,.4,.6),cur:0});
  s+=card(860,70,310,380,LM('コイル1：N₁ 巻き',1015,120,{size:26,color:INK,weight:700})
   +fade(seg(p,.2,.35),T(`${P1}=N_1${PH}`,1015,190,{size:36}))
   +fade(seg(p,.35,.5),LM('巻き線の 抵抗 0',1015,255,{size:22,color:DIM}))
   +fade(seg(p,.5,.7),T(`|${V1}|=N_1${dPh}`,1015,330,{size:32})),seg(p,0,.15));
  return s;
 },
 [K+'v2']:(p)=>{
  let s=transformer({phi:1,p,volt:1});
  s+=card(860,70,310,380,T(`|${V1}|=N_1${dPh}`,1015,140,{size:32})
   +fade(seg(p,.05,.25),T(`|${V2}|=N_2${dPh}`,1015,240,{size:32}))
   +fade(seg(p,.55,.7),LM('同じ |dΦ/dt|',1015,330,{size:28,color:C.hi,weight:700})),1);
  return s;
 },
 [K+'ratio']:(p)=>{
  const c=seg(p,.25,.4)>.5;
  const d=c?`{\\color{${BAD}}{\\cancel{${dPh}}}}`:dPh;
  let s=TF(`\\dfrac{|${V2}|}{|${V1}|}=\\dfrac{N_2\\,${d}}{N_1\\,${d}}`,600,150,{size:40,frac:true});
  s+=fade(seg(p,.2,.35),LM('|dΦ/dt| が 約分',990,150,{size:24,color:BAD}));
  s+=TF(VR,600,350,{size:54,box:true,frac:true,g:seg(p,.45,.65)});
  s+=fade(seg(p,.7,.85),LM('電圧の 比 ＝ 巻数の 比',600,490,{size:30,color:EMF,weight:700}));
  return s;
 },
 [K+'stack']:(p)=>{
  let s=cells(260,420,5,{lab:'コイル1：5巻き'})+cells(620,420,12,{lab:'コイル2：12巻き',g:seg(p,.1,.3)});
  s+=label('1巻き ＝ 電池 1個',440,90,{size:28,color:EMF,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),label('（同じ 電圧）',440,130,{size:22,color:DIM,anchor:'middle'}));
  s+=card(820,110,350,290,LM('巻数 ＝ 直列の 電池の 数',995,190,{size:24,color:INK,weight:700})
   +fade(seg(p,.6,.75),LM('電圧 ∝ 巻数',995,280,{size:34,color:C.hi,weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=transformer({phi:1,p,volt:1});
  s+=card(860,90,310,320,LM('符号（向き）は',1015,155,{size:26,color:INK})+LM('巻く 向き・端子の',1015,205,{size:24,color:INK})+LM('取り方で 変わる',1015,245,{size:24,color:INK})
   +fade(seg(p,.4,.55),LM('→ 大きさで 比べる',1015,325,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(100,40,1000,430,'',1);
  s+=T(`${V1}=100${U_('V')},\\quad N_1=100,\\quad N_2=2000`,600,110,{size:38});
  s+=fade(seg(p,.3,.45),T(`\\dfrac{100${U_('V')}}{100}=1${U_('V')}`,600,220,{size:40})+label('1巻き あたり',330,230,{size:26,color:INK,anchor:'end'}));
  s+=TF(`${V2}=2000\\times1${U_('V')}=2000${U_('V')}`,600,350,{size:46,box:true,g:seg(p,.6,.8)});
  return s;
 },
 // ===== S4 =====
 [K+'power']:(p)=>{
  let s=transformer({phi:1,p,volt:1,cur:1});
  s+=card(860,70,310,380,LM('損失なし（仮定）',1015,120,{size:24,color:C.hi,weight:700})
   +LM('入る 電力 ＝ 出る 電力',1015,190,{size:24,color:WC,weight:700})
   +fade(seg(p,.4,.6),T(`${V1}${I1}=${V2}${I2}`,1015,290,{size:40})),seg(p,0,.15));
  return s;
 },
 [K+'iratio']:(p)=>{
  let s=TF(`${V1}${I1}=${V2}${I2}`,600,90,{size:46});
  s+=TF(`\\dfrac{${I1}}{${I2}}=\\dfrac{${V2}}{${V1}}=\\dfrac{N_2}{N_1}`,600,260,{size:56,box:true,frac:true,g:seg(p,.1,.35)});
  s+=fade(seg(p,.6,.75),LM('電流の 比 ＝ 巻数の 比の 逆',600,440,{size:32,color:CI,weight:700}));
  return s;
 },
 [K+'inum']:(p)=>{
  let s=card(100,40,1000,430,'',1);
  s+=T(`${I2}=0.5${U_('A')},\\quad \\dfrac{N_2}{N_1}=\\dfrac{2000}{100}=20`,600,130,{size:40});
  s+=TF(`${I1}=0.5\\times20=10${U_('A')}`,600,320,{size:52,box:true,g:seg(p,.35,.55)});
  return s;
 },
 [K+'pnum']:(p)=>{
  let s=card(100,40,1000,430,'',1);
  s+=LM('コイル1',330,120,{size:28,color:DIM})+LM('コイル2',870,120,{size:28,color:DIM});
  s+=T(`100${U_('V')}\\times10${U_('A')}`,330,220,{size:40})+fade(seg(p,.2,.4),T(`2000${U_('V')}\\times0.5${U_('A')}`,870,220,{size:40}));
  s+=fade(seg(p,.5,.7),T(`=1000${U_('W')}`,330,320,{size:44})+T(`=1000${U_('W')}`,870,320,{size:44})+LM('＝',600,330,{size:44,color:OK,weight:700})+LM('同じ 電力 ✓',600,430,{size:30,color:OK,weight:700}));
  return s;
 },
 [K+'nofree']:(p)=>{
  let s=card(150,60,900,400,'',1);
  s+=LM('電圧 × 20',600,170,{size:44,color:EMF,weight:700});
  s+=fade(seg(p,.25,.4),LM('エネルギー × 1（増えない）',600,260,{size:34,color:WC,weight:700}));
  s+=fade(seg(p,.5,.65),LM('電流 × 1/20',600,360,{size:44,color:CI,weight:700}));
  return s;
 },
 // ===== S5 =====
 [K+'line']:(p)=>grid({loss:'',lineV:'1 MW を 送る'}),
 [K+'line2']:(p)=>{
  let s=grid({g:1});
  s+=card(150,280,420,200,LM('10 kV',360,320,{size:30,color:EMF,weight:700})+LM('電流 100 A',360,370,{size:26,color:CI})+LM('損失 100 kW',360,420,{size:28,color:WC,weight:700}),1);
  s+=fade(seg(p,.5,.65),card(630,280,420,200,LM('100 kV',840,320,{size:30,color:EMF,weight:700})+LM('電流 10 A',840,370,{size:26,color:CI})+LM('損失 1 kW',840,420,{size:28,color:WC,weight:700}),1,OK));
  return s;
 },
 [K+'up']:(p)=>{
  let s=grid({up:seg(p,.05,.25)});
  s+=fade(seg(p,.2,.35),label('10 kV',220,185,{size:26,color:EMF,anchor:'middle',weight:700})+label('100 kV',375,185,{size:24,color:EMF,anchor:'middle',weight:700}));
  s+=card(250,340,700,150,LM('巻数比 1 : 10',600,385,{size:32,color:INK,weight:700})
   +fade(seg(p,.55,.7),LM('電圧 × 10，電流 × 1/10',600,450,{size:30,color:C.hi,weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'down']:(p)=>{
  let s=grid({up:1,down:seg(p,.45,.65)});
  s+=card(250,340,700,150,LM('損失 ＝ I² R：電流 1/10 → 損失 1/100',600,390,{size:28,color:WC,weight:700})
   +fade(seg(p,.5,.65),LM('町の 近くで 巻数比を 逆に して 下げる',600,450,{size:26,color:INK})),seg(p,0,.15));
  return s;
 },
 [K+'ac']:(p)=>{
  let s=transformer({phi:.4+.6*Math.abs(Math.sin(p*Math.PI*3)),p,volt:1});
  s+=card(860,90,310,320,LM('磁束が 変化し続ける',1015,155,{size:24,color:PHI,weight:700})+LM('ことが 必要',1015,195,{size:24,color:INK})
   +fade(seg(p,.4,.55),LM('→ 交流',1015,280,{size:36,color:C.hi,weight:700})+LM('（送電の 大きな 理由）',1015,330,{size:22,color:DIM})),seg(p,0,.15));
  return s;
 },
 // ===== S6 =====
 [K+'sum1']:(p)=>{
  let s=card(90,40,1020,440,'',1);
  s+=T(DEF,380,130,{size:46})+label('定義',700,140,{size:30,color:PHI,weight:700});
  s+=fade(seg(p,.3,.45),T(MUT,380,270,{size:46})+label('ファラデーの 法則から',700,280,{size:30,color:EMF,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,40,1020,440,LM('理想変圧器の 仮定から',600,100,{size:26,color:C.hi,weight:700}),1);
  s+=T(VR,380,220,{size:46})+label('電圧：巻数の 比',680,230,{size:30,color:EMF,weight:700});
  s+=fade(seg(p,.35,.5),T(IR,380,370,{size:46})+label('電流：その 逆',680,380,{size:30,color:CI,weight:700}));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=transformer({phi:1,p,volt:1,cur:1});
  s+=card(860,90,310,320,LM('つながずに 渡せる',1015,160,{size:26,color:INK,weight:700})
   +fade(seg(p,.3,.45),LM('変化する 磁束が',1015,240,{size:26,color:PHI,weight:700})+LM('両方を 貫く',1015,290,{size:28,color:PHI,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  // R with L, and R with C (circuit sketches)
  const ckt=(x,y,kind,g=1)=>{let s=draw([[x,y],[x+340,y],[x+340,y+150],[x,y+150],[x,y]],1,{color:DIM,w:3});
   s+=line(x+50,y-22,x+50,y+22,{color:INK,w:4})+line(x+64,y-12,x+64,y+12,{color:INK,w:8});
   s+=rect(x+130,y-14,70,28,{fill:'#131f38',fo:1,stroke:INK,sw:2,rx:3})+label('R',x+165,y-24,{size:22,color:INK,anchor:'middle'});
   if(kind==='L'){const pts=[];for(let k=0;k<4;k++)pts.push(...arcPts(x+340,y+35+20*k+10,10,10,90,-90,10));s+=rect(x+330,y+30,20,90,{fill:C.bg,fo:1,stroke:'none',rx:0})+draw(pts,1,{color:CI,w:4})+label('L',x+366,y+82,{size:24,color:INK});}
   else{s+=rect(x+325,y+65,30,20,{fill:C.bg,fo:1,stroke:'none',rx:0})+line(x+318,y+68,x+362,y+68,{color:INK,w:4})+line(x+318,y+82,x+362,y+82,{color:INK,w:4})+label('C',x+372,y+82,{size:24,color:INK});}
   return fade(g,s);};
  let s=ckt(80,120,'L')+fade(seg(p,.1,.25),ckt(80,330,'C'));
  s+=card(560,80,600,360,LM('次の 問い',860,130,{size:22,color:DIM})
   +LM('コイルも コンデンサも 変化に 応じる',860,195,{size:26,color:INK})
   +fade(seg(p,.3,.45),LM('電源を 入れた 直後、',860,265,{size:28,color:INK})+LM('電流は どう 立ち上がる？',860,310,{size:30,color:CI,weight:700}))
   +fade(seg(p,.6,.75),LM('L と C だけなら？',860,385,{size:32,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};
