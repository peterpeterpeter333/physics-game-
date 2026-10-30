// 問題編 解説「坂を上る車の仕事率と、カーブ」（q-uc-work、大学編 12 仕事・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/12_仕事.md の q-uc-work（解説 18 行）。
// 配置：左に坂と車（小問3 は上から見たカーブ）、右の列に式・角度ダイヤル・仕事率の帳簿。誤答カードは右の列の下。
// 色：力 F 緑、速度 v 紫、仕事率・エネルギー 橙、坂の角 α 橙、力と速度の間の角 θ 桃、強調 黄、負・誤り 赤。
// 図のために決めた値：坂の角は大きく描く（約 20°、sinα＝0.04 は約 2.3°）。カーブの半径は任意（数値は出さない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,ground,poly,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-uc-work:';
const CF=C.F,CE=C.E,CV=C.v,CA=C.E,CTH=C.p,CN='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cv=s=>`{\\color{${CV}}${s}}`,cf=s=>`{\\color{${CF}}${s}}`,ce=s=>`{\\color{${CE}}${s}}`,cn=s=>`{\\color{${CN}}${s}}`;
const BF='\\mathbf{F}',BV='\\mathbf{v}';
const G1='重力の仕事率 P',G2='加速度 dv/dt',G3='中心向きの力の仕事率';
const ANS1=g=>answerTag(1,'C','−8000 W',{g}),ANS2=g=>answerTag(2,'D','0.1 m/s²',{g}),ANS3=g=>answerTag(3,'A','0 W',{g});
const RX=690,RW=490,RC=RX+RW/2;
const WOPT={x:RX,w:RW,y:360,size:26,whySize:22};

// ---- 坂と車 ----
const SL={x0:60,y0:450,x1:620,y1:250};
const dx=SL.x1-SL.x0,dy=SL.y1-SL.y0,Ls=Math.hypot(dx,dy),U=[dx/Ls,dy/Ls],NN=[U[1],-U[0]],AD=Math.atan2(-dy,dx);
function carAt(s){const c=[SL.x0+dx*s,SL.y0+dy*s],h=50,w=90,cor=(a,b)=>[c[0]+U[0]*a+NN[0]*b,c[1]+U[1]*a+NN[1]*b];
 return {poly:[cor(-w/2,0),cor(w/2,0),cor(w/2,h),cor(-w/2,h)],m:cor(0,h/2),cor};}
const GL=140;
function slope({s=.55,g=1,v=1,vlen=140,vtxt='25 m/s',mg=1,split=0,along=1,perp=1,alongHi=0,perpGrey=0,alpha=1,theta=0,notes=1,hiMg=0}={}){
 const {x0,y0,x1,y1}=SL;
 let o=poly([[x0,y0],[x1,y0],[x1,y1]],{fill:C.dim,fo:.12,stroke:C.dim,sw:2});
 if(alpha){const pts=Array.from({length:13},(_,i)=>{const a=AD*i/12;return [x0+80*Math.cos(a),y0-80*Math.sin(a)];});
  o+=fade(alpha,draw(pts,1,{color:CA,w:3})+label('α',x0+96,y0-10,{size:28,color:CA,weight:700})+label('sinα ＝ 0.04',x0+150,y0+36,{size:24,color:CA,weight:700}));}
 const car=carAt(s),m=car.m;
 o+=poly(car.poly,{fill:C.x,fo:.35,stroke:C.x,sw:2.5});
 if(v){const a=[m[0]+NN[0]*44,m[1]+NN[1]*44],b=[a[0]+U[0]*vlen,a[1]+U[1]*vlen];
  o+=fade(v,arrow(a[0],a[1],b[0],b[1],{color:CV,w:6,head:18})+(vtxt?label(vtxt,b[0]+10,b[1]-4,{size:26,color:CV,weight:700}):label('𝐯',b[0]+10,b[1]-4,{size:28,color:CV,weight:700})));}
 if(mg){o+=fade(mg*(perpGrey?1:1),arrow(m[0],m[1],m[0],m[1]+GL,{color:CF,w:6,head:18})+label('mg',m[0]+12,m[1]+GL-4,{size:26,color:CF,weight:700}));
  if(hiMg)o+=fade(hiMg,ring(m[0],m[1]+GL/2,GL/2+14,{color:C.hi,w:3,dash:'8 8'}));}
 if(split){const sa=Math.sin(AD),ca=Math.cos(AD);
  const al=[m[0]-U[0]*GL*sa,m[1]-U[1]*GL*sa],pe=[m[0]-NN[0]*GL*ca,m[1]-NN[1]*GL*ca];
  o+=fade(split*.8,line(al[0],al[1],m[0],m[1]+GL,{color:CF,w:2,dash:'6 6'})+line(pe[0],pe[1],m[0],m[1]+GL,{color:CF,w:2,dash:'6 6'}));
  o+=fade(split*along,arrow(m[0],m[1],al[0],al[1],{color:alongHi?CN:CF,w:7,head:16})+label(alongHi?'320 N':'坂に 沿う 成分',al[0]-12,al[1]-14,{size:22,color:alongHi?CN:CF,weight:700,anchor:'end'}));
  o+=fade(split*perp,arrow(m[0],m[1],pe[0],pe[1],{color:perpGrey?C.faint:CF,w:5,head:14})+label('坂に 垂直な 成分',pe[0]+36,pe[1]+2,{size:22,color:perpGrey?C.faint:CF,weight:700}));}
 if(theta){const a0=Math.atan2(U[1],U[0]),a1=Math.PI/2,pts=Array.from({length:17},(_,i)=>{const a=mix(a0,a1,i/16);return [m[0]+40*Math.cos(a),m[1]+40*Math.sin(a)];});
  o+=fade(theta,draw(pts,1,{color:CTH,w:3.5})+label('θ',m[0]+50,m[1]-6,{size:28,color:CTH,weight:700}));}
 if(notes)o+=fade(notes,label('g ＝ 10 m/s²',30,108,{size:22,color:C.dim})+label('坂の角 ＝ α（動画では θ）',30,138,{size:22,color:C.dim})
  +label('力と速度の間の角 ＝ θ',30,168,{size:22,color:C.dim})+label('（角は 大きく 描いています）',30,198,{size:22,color:C.dim}));
 return fade(g,o);
}
// 仕事率の帳簿
function ledger({g=1,grav='?',tot='?',hiGrav=0,hiTot=0,y=90,h=250}={}){
 let s=label('仕事率の 帳簿',RC,y+40,{size:26,color:CE,anchor:'middle',weight:700});
 const row=(t,val,yy,col)=>label(t,RX+40,yy,{size:28,color:C.ink,weight:700})+label(val,RX+RW-40,yy,{size:30,color:col,anchor:'end',weight:700});
 s+=row('エンジン','＋10 kW',y+95,CE)+row('重力',grav,y+150,grav==='?'?C.faint:CN);
 s+=line(RX+30,y+175,RX+RW-30,y+175,{color:C.faint,w:2})+row('合計',tot,y+215,tot==='?'?C.faint:CE);
 if(hiGrav)s+=fade(hiGrav,highlight(RX+20,y+118,RW-40,46,1,C.hi));
 if(hiTot)s+=fade(hiTot,highlight(RX+20,y+183,RW-40,46,1,C.hi));
 return card(RX,y,RW,h,s,g,CE);
}
// 角度ダイヤル（0°〜180°。針は 𝐅 の向き、基準は 𝐯）
function dial(cx,cy,r,th,{g=1,txt='',txtCol=C.ink}={}){
 let s=draw(Array.from({length:37},(_,i)=>{const a=Math.PI*i/36;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];}),1,{color:C.dim,w:3});
 for(const [d,t] of [[0,'0°'],[90,'90°'],[180,'180°']]){const a=d*Math.PI/180;
  s+=line(cx+(r-10)*Math.cos(a),cy-(r-10)*Math.sin(a),cx+(r+6)*Math.cos(a),cy-(r+6)*Math.sin(a),{color:C.dim,w:3})
   +label(t,cx+(r+30)*Math.cos(a),cy-(r+22)*Math.sin(a)+8,{size:22,color:C.dim,anchor:'middle'});}
 s+=arrow(cx,cy,cx+r*.85,cy,{color:CV,w:4,head:12});
 const a=th*Math.PI/180;s+=arrow(cx,cy,cx+r*.8*Math.cos(a),cy-r*.8*Math.sin(a),{color:CF,w:6,head:16})+dot(cx,cy,6,C.ink);
 if(txt)s+=label(txt,cx,cy+40,{size:30,color:txtCol,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- 上から見たカーブ ----
const CC=[320,320],CR=160;
function curve({phi=.2,g=1,force=1,vel=0,right=0,ftxt='4000 N',vtxt='𝐯',speedNote=0,top=1}={}){
 const [cx,cy]=CC,P=[cx+CR*Math.cos(phi),cy-CR*Math.sin(phi)],t=[-Math.sin(phi),-Math.cos(phi)],n=[-Math.cos(phi),Math.sin(phi)];
 let s=ring(cx,cy,CR,{color:C.dim,w:3,dash:'10 9'})+dot(cx,cy,6,C.dim)+label('中心',cx+12,cy+26,{size:22,color:C.dim});
 const cor=(a,b)=>[P[0]+t[0]*a+n[0]*b,P[1]+t[1]*a+n[1]*b];
 s+=poly([cor(-30,-17),cor(30,-17),cor(30,17),cor(-30,17)],{fill:C.x,fo:.35,stroke:C.x,sw:2.5});
 if(force)s+=fade(force,arrow(P[0]+n[0]*20,P[1]+n[1]*20,P[0]+n[0]*125,P[1]+n[1]*125,{color:CF,w:6,head:18})+label(ftxt,P[0]+n[0]*55-t[0]*50,P[1]+n[1]*55-t[1]*50+10,{size:26,color:CF,weight:700,anchor:'start'}));
 if(vel)s+=fade(vel,arrow(P[0]+t[0]*34,P[1]+t[1]*34,P[0]+t[0]*130,P[1]+t[1]*130,{color:CV,w:6,head:18})+label(vtxt,P[0]+t[0]*130-8,P[1]+t[1]*130-12,{size:28,color:CV,weight:700,anchor:'end'}));
 if(right){const q=20,o=[P[0]+n[0]*22,P[1]+n[1]*22];s+=fade(right,draw([[o[0]+t[0]*q,o[1]+t[1]*q],[o[0]+t[0]*q+n[0]*q,o[1]+t[1]*q+n[1]*q],[o[0]+n[0]*q,o[1]+n[1]*q]],1,{color:C.hi,w:3}));}
 if(top)s+=label('上から 見た 図',30,470,{size:22,color:C.dim});
 if(speedNote)s+=fade(speedNote,label('一定の 速さ 25 m/s',30,503,{size:24,color:C.ink,weight:700}));
 return fade(g,s);
}

export const ytQxUcWorkDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（小問1・2、5 秒）：0〜2 s 車が坂を少し上り、25 m/s の矢印を付けて映像を一時停止。2〜3 s mg（1本だけ）と札。3〜5 s 帳簿。静止。
 [K+'q0']:(p)=>{
  const s=mix(.3,.55,seg(p,0,.4));
  let o=slope({s,mg:seg(p,.42,.55),notes:seg(p,.45,.6),alpha:1});
  o+=pauseBadge({g:seg(p,.4,.46),x:940,y:420});
  o+=ledger({g:seg(p,.62,.85)});
  return o;
 },
 // 小問3（2.5 秒）：暗転のあと、上から見たカーブと車、中心向きの力 4000 N。速度の矢印は描かない。静止。
 [K+'q3']:(p)=>curve({g:seg(p,0,.35),force:seg(p,.35,.7),speedNote:seg(p,.6,.9)}),

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>slope({hiMg:seg(p,.25,.4)})+ledger({})+goalTag(G1,{g:seg(p,.02,.12)}),
 // 2. 定義 P＝𝐅·𝐯＝Fv cosθ。α と θ を別々の色で
 [K+'def']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=slope({theta:seg(p,b+.15,b+.3)});
  s+=card(RX,90,RW,250,kindTag('定義',RC,128,{g:seg(p,.03,.12)})+fade(seg(p,.05,.15),T(`P=${BF}\\cdot${BV}=Fv\\cos\\theta`,RC,195,36))
   +fade(seg(p,b,b+.1),label('α：坂の 角',RC,260,{size:26,color:CA,anchor:'middle',weight:700}))
   +fade(seg(p,b+.15,b+.25),label('θ：力と 速度の 間の 角',RC,305,{size:26,color:CTH,anchor:'middle',weight:700})),1,C.hi);
  s+=fade(seg(p,b,b+.1),highlight(SL.x0+70,SL.y0-46,62,56,1,CA));
  return s+goalTag(G1);
 },
 // 3. mg を二つの成分に分ける。垂直な成分はダイヤル 90° で 0 W
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=slope({split:seg(p,.05,.3)});
  s+=card(RX,90,RW,250,label('坂に 垂直な 成分 と 𝐯',RC,128,{size:24,color:C.dim,anchor:'middle'})+dial(RC,270,100,90,{g:seg(p,b,b+.1),txt:seg(p,b+.15,b+.22)>0?'0 W':''}),seg(p,b-.05,b+.05));
  return s+goalTag(G1);
 },
 // 4. 坂に沿う成分 mg sinα＝320 N、速度と逆向き（ダイヤル 180°）
 [K+'along']:(p)=>{
  let s=slope({split:1,alongHi:1,perp:.35});
  s+=card(RX,90,RW,275,label('坂に 沿う 成分',RC,125,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.03,.15),T('mg\\sin\\alpha=800\\times10\\times0.04',RC,170,28))+fade(seg(p,.2,.32),T(cn('=320\\ \\mathrm{N}'),RC,215,34))
   +fade(seg(p,.5,.6),dial(RC,335,60,180,{})),1);
  s+=fade(seg(p,.6,.7),label('速度と 逆向き（180°）',RC,405,{size:26,color:CN,anchor:'middle',weight:700}));
  return s+goalTag(G1);
 },
 // 5. P＝−320×25＝−8000 W。帳簿に重力 −8 kW。小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=slope({split:1,alongHi:1,perp:.35});
  s+=ledger({grav:p>.25?'−8 kW':'?',hiGrav:seg(p,.25,.32)*(1-seg(p,b,b+.1))});
  s+=fade(seg(p,.03,.15),T(`P=-320\\times25=${cn('-8000\\ \\mathrm{W}')}`,RC,395,32));
  s+=fade(seg(p,b+.05,b+.15),label('1秒に 8 kJ ずつ K を 奪う',RC,460,{size:26,color:CN,anchor:'middle',weight:700}));
  return s+goalTag(G1)+ANS1(seg(p,b-.12,b-.06));
 },
 // 6. 誤答 A・B
 [K+'wrong1']:(p,ctx)=>slope({split:1,alongHi:1,perp:.35})+ledger({grav:'−8 kW'})
   +wrongSeq(p,ctx,[['A','−320 W','速さ 25 m/s を掛けていない'],['B','＋8000 W','逆向き（180°）なのに正にした']],{opts:WOPT})+goalTag(G1)+ANS1(1),
 // 7. 誤答 D。mg のうち坂に垂直な成分を灰色に
 [K+'wrong1d']:(p)=>slope({split:1,alongHi:1,perpGrey:seg(p,.3,.4)>0?1:0})+ledger({grav:'−8 kW'})
   +wrongCard('D','−200000 W','sinα を掛けていない',{...WOPT,g:seg(p,.03,.1)})+goalTag(G1)+ANS1(1),

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>slope({})+ledger({grav:'−8 kW'})+goalTag(G2,{g:seg(p,.02,.12)}),
 // 9a. 法則 dK/dt＝𝐅·𝐯（𝐅 は合力）
 [K+'law']:(p)=>slope({})+ledger({grav:'−8 kW'})
   +card(RX,355,RW,120,kindTag('法則',RC,388,{g:seg(p,.05,.15)})+fade(seg(p,.1,.22),T(`\\dfrac{d${ce('K')}}{dt}=${BF}\\cdot${BV}`,RC-60,445,30)+label('（𝐅 は 合力）',RC+80,452,{size:24,color:C.ink,weight:700})),1,CF)+goalTag(G2),
 // 9b. 帳簿の合計 ＋2 kW
 [K+'law2']:(p)=>slope({})+ledger({grav:'−8 kW',tot:p>.6?'＋2 kW':'?',hiTot:seg(p,.6,.7)})
   +card(RX,355,RW,120,kindTag('法則',RC,388)+T(`\\dfrac{d${ce('K')}}{dt}=${BF}\\cdot${BV}`,RC-60,445,30)+label('（𝐅 は 合力）',RC+80,452,{size:24,color:C.ink,weight:700}),1,CF)
   +fade(seg(p,.3,.45),label('＋10 − 8 ＝ ＋2 kW（＋2000 W）',RC,500,{size:24,color:CE,anchor:'middle',weight:700}))+goalTag(G2),
 // 10. K＝½mv² を時間で微分：2 と ½ が打ち消す（カット）
 [K+'diff']:(p)=>{
  let s=label('1次元',440,170,{size:26,color:C.dim,anchor:'end'});
  s+=fade(seg(p,.03,.12),T(`${ce('K')}=\\tfrac{1}{2}m${cv('v')}^2`,600,160,46));
  const parts=[`\\dfrac{d${ce('K')}}{dt}=`,'\\tfrac{1}{2}',`m\\cdot`,'2',`${cv('v')}\\dfrac{d${cv('v')}}{dt}`],sz=46,ws=parts.map(q=>texWidth(q,sz,false));
  const tot=ws.reduce((a,b)=>a+b,0)+8*4;let x=600-tot/2;const xs=[];for(const w of ws){xs.push(x);x+=w+8;}
  const g2=seg(p,.25,.4),cn2=seg(p,.5,.6);
  s+=fade(g2,parts.map((q,i)=>T(q,xs[i],285,sz,{anchor:'start',opacity:(i===1||i===3)?1-.6*cn2:1})).join(''));
  s+=fade(cn2,line(xs[1]-2,310,xs[1]+ws[1]+2,255,{color:CN,w:4})+line(xs[3]-2,305,xs[3]+ws[3]+2,265,{color:CN,w:4}));
  s+=fade(seg(p,.65,.8),T(`\\dfrac{d${ce('K')}}{dt}=m${cv('v')}\\dfrac{d${cv('v')}}{dt}`,600,440,50)+highlight(600-texWidth(`\\dfrac{dK}{dt}=mv\\dfrac{dv}{dt}`,50,false)/2-16,385,texWidth(`\\dfrac{dK}{dt}=mv\\dfrac{dv}{dt}`,50,false)+32,100,1,C.hi));
  return s+goalTag(G2);
 },
 // 11a. dv/dt＝2000÷(800×25)＝0.1 m/s²。小問2 の答え D（カット）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=slope({});
  s+=card(RX,90,RW,250,fade(seg(p,.03,.15),T(`\\dfrac{d${cv('v')}}{dt}=\\dfrac{2000}{800\\times25}`,RC,170,40))+fade(seg(p,.35,.5),T(`=0.1\\ \\mathrm{m/s^2}`,RC,275,44)),1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 11b. 2026-10-16 点検PQ-016：0.1 m/s² は速さ 25 m/s の「この瞬間」の値。文1で「この 瞬間」の札、文2で「仕事率が一定でも、速さが変わると加速度は変わる」。
 //   速度の矢印は伸ばさない（25 m/s の瞬間のまま）。
 [K+'ans2b']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=slope({});
  s+=card(RX,90,RW,250,T(`\\dfrac{d${cv('v')}}{dt}=\\dfrac{2000}{800\\times25}`,RC,170,40)+T(`=0.1\\ \\mathrm{m/s^2}`,RC,275,44),1);
  s+=fade(seg(p,.03,.12),card(RX+60,360,RW-120,56,label('この 瞬間（v ＝ 25 m/s）の 値',RC,397,{size:24,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=fade(seg(p,b,b+.08),label('仕事率が 一定でも',RC,455,{size:24,color:C.ink,anchor:'middle',weight:700})
   +label('速さが 変わると、加速度は 変わる',RC,490,{size:24,color:C.ink,anchor:'middle',weight:700}));
  return s+goalTag(G2)+ANS2(1);
 },
 // 12. 帳簿の重力の欄を黄で囲む。誤答 A・B・C を一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],m=e*.5;
  let s=slope({vtxt:''})+ledger({grav:'−8 kW',tot:'＋2 kW',hiGrav:seg(p,.02,.1)});
  s+=wrongSeq(p,ctx,[['A','0.5','重力の −8 kW を入れていない'],['B','−0.1','合計は ＋2000 W で正'],['C','2.5','mv の v を落とした']],{win:[[0,m],[m,e],[W[1]?W[1][0]:.6,1]],opts:WOPT});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>curve({force:1})+card(RX,110,RW,200,label('カーブ（速さ 一定 25 m/s）',RC,165,{size:26,color:C.dim,anchor:'middle'})
   +label('中心向きの 力 4000 N の',RC,225,{size:28,color:C.ink,anchor:'middle',weight:700})+label('仕事率 と その 理由',RC,270,{size:28,color:CE,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi)+goalTag(G3,{g:seg(p,.02,.12)}),
 // 14. 速度（接線向き）と直角の印
 [K+'perp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  return curve({force:1,vel:seg(p,.3,.45),right:seg(p,b,b+.1)})+fade(seg(p,b,b+.1),card(RX,110,RW,120,label('力 ⊥ 速度（直角）',RC,182,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi))+goalTag(G3);
 },
 // 15. ダイヤルを 90° で止めて 0 W。小問3 の答え A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.65,th=mix(0,90,seg(p,.15,.45));
  let s=curve({force:1,vel:1,right:1});
  s+=card(RX,90,RW,330,fade(seg(p,.02,.12),T('P=Fv\\cos\\theta',RC,140,36))+dial(RC,320,110,th,{txt:seg(p,.45,.5)>0?'θ ＝ 90°、P ＝ 0 W':''}),1);
  return s+goalTag(G3)+ANS3(seg(p,b,b+.06));
 },
 // 16. 速度の矢印の長さは同じで、向きだけが回る。誤答 B
 [K+'wrong3b']:(p,ctx)=>{
  const phi=.2+1.0*seg(p,.1,.9);
  let s=curve({phi,force:1,vel:1,right:1,ftxt:'4000 N'});
  s+=card(RX,90,RW,200,label('力は 0 では ない',RC,150,{size:28,color:CF,anchor:'middle',weight:700})+label('→ 速度の 向きを 変える',RC,200,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('（速さは 同じ）',RC,250,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.2));
  s+=wrongCard('B','力が 0 だから','力は 4000 N、道を曲げている',{...WOPT,y:330,g:seg(p,.03,.1)});
  return s+goalTag(G3)+ANS3(1);
 },
 // 17. 誤答 C・D
 [K+'wrong3']:(p,ctx)=>{
  let s=curve({phi:1.2,force:1,vel:1,right:1});
  s+=wrongSeq(p,ctx,[['C','100 kW','4000×25、cos 90° を落とした'],['D','−100 kW','直角な力は速さを変えない']],{opts:{...WOPT,y:200}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(40,110,600,300,label('合力の 仕事率',340,160,{size:26,color:C.dim,anchor:'middle'})+T(`\\dfrac{d${ce('K')}}{dt}=${BF}\\cdot${BV}`,340,250,52)
   +label('＝ K の 増える 速さ',340,350,{size:28,color:CE,anchor:'middle',weight:700}),seg(p,.02,.12),CE);
  const cx=900,cy=290;
  s+=fade(seg(p,b,b+.1),card(700,110,460,300,arrow(cx-60,cy+60,cx+120,cy+60,{color:CV,w:6,head:18})+label('𝐯',cx+130,cy+68,{size:28,color:CV,weight:700})
   +arrow(cx-60,cy+60,cx-60,cy-90,{color:CF,w:6,head:18})+label('𝐅',cx-80,cy-90,{size:28,color:CF,weight:700,anchor:'end'})
   +draw([[cx-40,cy+60],[cx-40,cy+40],[cx-60,cy+40]],1,{color:C.hi,w:3})
   +label('仕事 0、道を 曲げる',cx,cy+105,{size:26,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  s+=answerRow([[1,'C','−8000 W'],[2,'D','0.1 m/s²'],[3,'A','0 W']],{g:seg(p,.85,.93)});
  return s;
 },
};
