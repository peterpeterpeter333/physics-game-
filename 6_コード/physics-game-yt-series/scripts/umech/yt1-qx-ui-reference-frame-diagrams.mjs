// 問題編 解説「バスの中のボール、回る球、遠くの重力」（q-ui-reference-frame、大学編 19 慣性力と軌道・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/19_慣性力と軌道.md の q-ui-reference-frame（解説 18 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x・X・r・R 水色、バスの目盛り x′・Δ𝐯 黄（凡例を出す）、速度 v 紫、加速度 a・A・g 赤、力 F 緑（慣性力は緑の破線）、時間 t 金。
// バスの描き方・円の描き方は 単元動画（yt1-ui-reference-frame-1/2-diagrams.mjs）を写して変えた（あちらは編集しない）。
// 図のために決めた値（問題文にない）：バスの長さ 15 m（前の端＝バスの目盛りの 0。ボールは最初その前の端の所）。
//   地面の 1 m＝32 px。円の図の2点は 60° と 120°（球は 3 s で 6 rad 回って 120° で止まる。ω＝v/r＝2 rad/s の実時間）。
//   地球の半径 R＝70 px（3R の円が画面に入る大きさ）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,kindTag,pauseBadge,legend,note,cueT,tAt,sentWin,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-reference-frame:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const BALL='#e8a05a',EARTH='#4d8fe0';
const G1='バスの目盛りで見た加速度 a′',G2='地面から見た加速度',G3='高さ 2R での重力加速度';
const ANS1=g=>answerTag(1,'C','後ろ向きに 3 m/s²',{g}),ANS2=g=>answerTag(2,'B','中心向きに 8 m/s²',{g}),ANS3=g=>answerTag(3,'C','約 1.1 m/s²',{g});
const LEG1=(g=1)=>legend([['x′ 黄（車内）',C.hi],['x 水色（地面）',C.x]],890,466,{g});
const xp=col(C.hi,"x'"),xg=col(C.x,'x'),XX=col(C.x,'X'),tt=col(C.t,'t');

// 緑の破線の矢印（慣性力：相互作用ではない）
function dashArrow(x,y,X,Y,{color=C.F,w=5,g=1,head=18}={}){
 if(g<=0)return '';const XE=mix(x,X,g),YE=mix(y,Y,g),L=Math.hypot(XE-x,YE-y);if(L<2)return '';
 const a=Math.atan2(YE-y,XE-x),h=Math.min(head,L*.6),bx=XE-h*Math.cos(a),by=YE-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'10 8',cap:'butt'})+`<polygon points="${XE},${YE} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
const mm=v=>v<0?`−${fmt(-v,1)}`:fmt(v,1);

// ===== バス（横から見た図）=====
// 地面の座標 m は画面の GX(m−S)。S＝0：地面から見た画面。S＝X：バスから見た画面（バスが止まって見える）。
// y0＝地面の目盛りの線。その下にバス（屋根 y0＋45、床 y0＋130）、床の下にバスの目盛り、道路 y0＋182。
const GX=m=>540+32*m,BL=15;
const Xbus=t=>1.5*t*t;
function bus({y0=110,X=0,S=0,ball=1,ballX=0,A=0,ruler=1,rlab=1,busScale=1,pin=0,kg=1,small=0}={}){
 let s='';const top=y0+45,fl=y0+130,road=y0+188;
 // 地面の目盛り（水色）
 if(ruler){
  s+=line(20,y0,1180,y0,{color:C.x,w:2.5});
  for(let m=-20;m<=24;m++){const x=GX(m-S);if(x<24||x>1176)continue;const big=m%2===0;
   s+=line(x,y0,x,y0+(big?12:7),{color:C.x,w:big?2.5:1.5});
   if(big)s+=label(String(m).replace('-','−'),x,y0+34,{size:22,color:C.x,anchor:'middle'});}
  if(rlab)s+=label('地面の目盛り x [m]',24,y0-12,{size:22,color:C.x,weight:700});
 }
 // 道路
 s+=line(10,road,1190,road,{color:C.faint,w:3});
 for(let m=-20;m<=24;m+=.5){const x=GX(m-S);if(x>14&&x<1186)s+=line(x,road,x-8,road+10,{color:C.faint,w:2});}
 // 車体（前の端＝X、後ろの端＝X−15）
 const xF=GX(X-S),xB=GX(X-S-BL);
 s+=rect(xB,top,xF-xB,fl-top,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:12});
  s+=rect(xB,fl,xF-xB,14,{fill:'#24324f',fo:1,stroke:'none',rx:3});
 [-13,-11,-3,-1].forEach(k=>{s+=ring(GX(X-S+k),fl+46,10,{color:C.dim,w:3,fill:C.bg});});
 // バスの目盛り（黄、バスと一緒に動く）：前の端が 0
 if(busScale){let g='';for(let k=-14;k<=0;k++){const x=GX(X-S+k),big=k%2===0;g+=line(x,fl,x,fl+(big?12:7),{color:C.hi,w:big?2.5:1.5});
   if(big)g+=label(String(k).replace('-','−'),x,fl+31,{size:22,color:C.hi,anchor:'middle'});}
  g+=`<polygon points="${xF},${fl-2} ${xF-9},${fl-16} ${xF+9},${fl-16}" fill="${C.hi}"/>`;
  s+=fade(busScale,g);}
 if(A){const ay=top+26;s+=fade(A,arrow(xB+30,ay,xB+150,ay,{color:C.a,w:6,head:18})+label('前向きに 3 m/s²',xB+166,ay+8,{size:24,color:C.a,weight:700}));}
 if(ball){const bx=GX(ballX-S),r=15;
  if(pin)s+=fade(pin,line(bx,y0+44,bx,fl-2*r-4,{color:C.x,w:2,dash:'5 6'}));
  s+=ring(bx,fl-r,r,{color:BALL,w:3,fill:'#4a3216'});
  if(kg)s+=label('0.5 kg',bx-22,fl-8,{size:22,color:C.ink,anchor:'end'});}
 return s;
}
const tLab=(t,x=1180,y=96)=>label(`t ＝ ${t.toFixed(1)} s`,x,y,{size:26,color:C.t,anchor:'end',weight:700});

// 時刻ごとの位置の表。fill＝[t列, x列, X列, x′列] それぞれ 0〜3（埋まった行の数）
const TC=[110,320,530,740];
function table({y=314,fill=[3,3,3,0],hi=-1,Xform=0,g=1}={}){
 const w=850;let s=rect(20,y,w,188,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12});
 const hd=[['t [s]',''],['ボール x [m]','（地面の目盛り）'],['バス X [m]','（地面の目盛り）'],['x′ [m]','（バスの目盛り）']],hc=[C.t,C.x,C.x,C.hi];
 hd.forEach(([a,b],i)=>{s+=label(a,TC[i],y+32,{size:24,color:hc[i],anchor:'middle',weight:700});if(b)s+=label(b,TC[i],y+58,{size:22,color:C.dim,anchor:'middle'});});
 s+=line(30,y+70,w+10,y+70,{color:C.faint,w:2});
 const data=[[0,0,0,0],[1,0,1.5,-1.5],[2,0,6,-6]];
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){const a=clamp(fill[i]-j);if(a<=0)continue;
  s+=fade(a,label(mm(data[j][i]),TC[i],y+104+j*36,{size:26,color:hc[i],anchor:'middle',weight:700}));}
 if(Xform)s+=fade(Xform,label('X ＝ 1.5t²',TC[2]+100,y+32,{size:22,color:C.x,weight:700}));
 if(hi>=0)s+=highlight(TC[hi]-100,y+6,200,178,1,hc[hi]);
 return fade(g,s);
}

// ===== 円（上から見た机）=====
const CX=330,CY=310,R=150,VS=110;
const P=(th,r=R)=>[CX+r*Math.cos(th),CY-r*Math.sin(th)];
const vdir=th=>[-Math.sin(th),-Math.cos(th)];
const D2R=Math.PI/180,TH1=60*D2R,TH2=120*D2R;
function desk({th=TH2,ball=1,vel=0,ghost=0,velLab=1,kg=1,hiV=0,str=1}={}){
 let s=rect(40,86,590,420,{fill:'#16223a',fo:.9,stroke:C.faint,sw:2,rx:14})+label('上から見た図',56,494,{size:22,color:C.dim});
 s+=ring(CX,CY,R,{color:C.dim,w:2.5,dash:'7 8'})+dot(CX,CY,7,C.dim);
 s+=label('2 m',CX+R*.5*Math.cos(-.5)+6,CY-R*.5*Math.sin(-.5)+30,{size:24,color:C.x,anchor:'middle',weight:700})+line(CX,CY,...P(-.5),{color:C.x,w:2.5,dash:'4 5'});
 const vArrow=(t,lab)=>{const [x,y]=P(t),[dx,dy]=vdir(t);return arrow(x,y,x+dx*VS,y+dy*VS,{color:C.v,w:6+3*hiV})+(lab&&velLab?(dy<0?label('4 m/s',x+dx*VS-10,y+dy*VS-8,{size:24,color:C.v,anchor:'end',weight:700}):label('4 m/s',x+dx*VS-8,y+dy*VS+30,{size:24,color:C.v,anchor:'end',weight:700})):'');};
 if(ghost){const [x,y]=P(TH1);s+=fade(ghost,ring(x,y,14,{color:C.hi,w:2.5,dash:'4 4'})+vArrow(TH1,1));}
 if(ball){const [x,y]=P(th);if(str)s+=line(CX,CY,x,y,{color:C.ink,w:2.5});
  s+=dot(x,y,15,C.hi);if(kg)s+=label('0.3 kg',x-20,y-20,{size:22,color:C.ink,anchor:'end'});
  if(vel)s+=fade(vel,vArrow(th,1));}
 return s;
}

// ===== 地球 =====
const EX=300,EY=300,ER=70;
function earth({arrows=1,merge=0,rings=0,tag=1,lines=0,spread=0}={}){
 let s='';
 if(rings)s+=fade(rings,[1,2,3].map(k=>ring(EX,EY,ER*k,{color:C.x,w:k===2?1.5:2,dash:'5 7'})).join('')
  +[1,2,3].map(k=>label(k===1?'R':k+'R',EX-ER*k*.866-6,EY+ER*k*.5+22,{size:22,color:C.x,anchor:'end'})).join(''));
 if(lines){let L='';for(let i=0;i<12;i++){const a=i*Math.PI/6+Math.PI/12;L+=line(EX+ER*Math.cos(a),EY-ER*Math.sin(a),EX+(3*ER+18)*Math.cos(a),EY-(3*ER+18)*Math.sin(a),{color:C.a,w:2.5,opacity:.85});}s+=fade(lines,L);}
 s+=ring(EX,EY,ER,{color:EARTH,w:3,fill:'#1d3a66'})+label('地球',EX,EY+9,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(spread){const a0=Math.PI/12,a1=a0+Math.PI/6;
  const arcP=(r)=>Array.from({length:13},(_,i)=>{const a=a0+(a1-a0)*i/12;return [EX+r*Math.cos(a),EY-r*Math.sin(a)];});
  s+=fade(spread,draw(arcP(ER+3),1,{color:C.hi,w:6})+draw(arcP(3*ER),1,{color:C.hi,w:6}));}
 const y=EY;
 if(arrows){
  const a1=1-merge;
  s+=fade(a1,arrow(EX,y,EX+ER,y,{color:C.x,w:5,head:14})+label('R',EX+ER/2,y-14,{size:28,color:C.x,anchor:'middle',weight:700})
   +arrow(EX+ER,y,EX+3*ER,y,{color:C.x,w:5,head:14})+label('高さ 2R',EX+2*ER,y-14,{size:26,color:C.x,anchor:'middle',weight:700}));
  s+=fade(merge,arrow(EX,y+2,EX+3*ER,y+2,{color:C.x,w:7,head:18})+label('r ＝ 3R',EX+2*ER,y+40,{size:28,color:C.x,anchor:'middle',weight:700}));
  s+=dot(EX+3*ER,y,8,C.hi);
 }
 if(tag)s+=fade(tag,label('地表で 9.8 m/s²',EX,EY-ER-20,{size:24,color:C.a,anchor:'middle',weight:700}));
 return s;
}
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};

export const ytQxUiReferenceFrameDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（約5秒）：0〜3 s でバスが右へ動き出す（実時間 X＝1.5t²）。ボールは地面の 0。表は x′ の列が空欄。3 s で映像を一時停止。
 [K+'q1']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),3);
  let s=bus({X:Xbus(t),A:1,pin:1});
  s+=table({fill:[3,3,3,0]});
  s+=tLab(t);
  s+=pauseBadge({g:clamp((cueT(ctx)-3)/.3),x:1030,y:400});
  return s;
 },
 // 小問2の図（約4秒）：球が半径 2 m の円を一定の速さで回る（0〜3 s、実時間 ω＝2 rad/s）。3 s で一時停止し、2点に速度の矢印。
 [K+'q2']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),3),th=TH2-2*(3-t),after=clamp((cueT(ctx)-3)/.5);
  let s=desk({th,vel:after,ghost:after});
  s+=pauseBadge({g:clamp((cueT(ctx)-3)/.3),x:900,y:110});
  s+=label('速さ 一定 4 m/s',900,260,{size:28,color:C.v,anchor:'middle',weight:700});
  return s;
 },
 // 小問3の図（約3秒）：地球の断面。中心から地表へ R、地表から上へ 高さ 2R（同じ水色で一直線）。札「地表で 9.8 m/s²」。静止。
 [K+'q3']:(p)=>{
  let s=fade(seg(p,0,.3),earth({arrows:0,tag:0}));
  s+=fade(seg(p,.25,.6),earth({tag:0}));
  s+=fade(seg(p,.55,.85),label('地表で 9.8 m/s²',EX,EY-ER-20,{size:24,color:C.a,anchor:'middle',weight:700}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図（t＝0）。札「求めるもの」。左上に凡例（札の下）
 [K+'goal1']:(p)=>{
  let s=bus({X:0,A:1,pin:1})+table({fill:[3,3,3,0]})+tLab(0);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  s+=LEG1(seg(p,.3,.45));
  return s;
 },
 // 2. 地面から見ると、バスだけが右へ進み、ボールは 0 に残る（t 0→2 s）。「横向きの力 0」
 [K+'ground']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.3,t=2*seg(p,b,Math.min(.95,b+.55));
  let s=bus({X:Xbus(t),A:1,pin:1})+table({fill:[3,3,3,0]})+tLab(t);
  s+=fade(seg(p,b+.05,b+.15),card(880,330,300,110,label('ボール：',1030,372,{size:24,color:C.ink,anchor:'middle'})+label('横向きの力 0',1030,414,{size:28,color:C.F,anchor:'middle',weight:700}),1,C.F));
  s+=fade(seg(p,0,.12),label('地面から見る',1180,286,{size:26,color:C.x,anchor:'end',weight:700}));
  s+=LEG1();
  s+=goalTag(G1);
  return s;
 },
 // 3. 表のバスの列に X＝1.5t² を書き、0、1.5、6 m を一つずつ。バスの前の端に水色の矢印 X（t＝2 s）
 [K+'Xcol']:(p)=>{
  const f=3*seg(p,.35,.85);
  let s=bus({X:6,A:0,pin:1})+table({fill:[3,3,f,0],hi:2})+tLab(2);
  const ay=110+75;
  s+=fade(seg(p,.1,.25),arrow(GX(0),ay,GX(6),ay,{color:C.x,w:6,head:16})+label('X',GX(3),ay-12,{size:30,color:C.x,anchor:'middle',weight:700})+line(GX(0),110,GX(0),ay+10,{color:C.x,w:2,dash:'4 5'}));
  s+=card(880,330,300,110,T(`${XX}=\\tfrac12\\times3\\times${tt}^2`,1030,370,30)+T(`=1.5${tt}^2`,1030,418,30),seg(p,.03,.15),C.x);
  s+=LEG1();
  s+=goalTag(G1);
  return s;
 },
 // 4. x′＝x−X。ボールの位置（地面の 0）からバスの目盛りの 0 までの差を黄の矢印で。x′ の列を 0、−1.5、−6 と埋める
 [K+'xpcol']:(p)=>{
  const f=3*seg(p,.4,.85);
  let s=bus({X:6,A:0,pin:1})+table({fill:[3,3,3,f],hi:3})+tLab(2);
  const ay=110+75;
  s+=fade(seg(p,.1,.25),arrow(GX(6),ay,GX(0),ay,{color:C.hi,w:6,head:16})+label('x′ ＝ −6',GX(3),ay-12,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(880,330,300,110,T(`${xp}=${xg}-${XX}`,1030,372,32)+T(`=0-1.5${tt}^2`,1030,420,28),seg(p,.03,.15),C.hi);
  s+=LEG1();
  s+=goalTag(G1);
  return s;
 },
 // 5. 右の枠で x′＝−1.5t² →「時間で1回微分」→ dx′/dt＝−3t（紫）→「もう1回微分」→ d²x′/dt²＝−3（赤）。札「a′＝a−A＝0−3」
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(20,90,560,410,label('バスの目盛りで読んだ位置',300,135,{size:24,color:C.dim,anchor:'middle'}),1);
  const rows=[[0,0],[1,-1.5],[2,-6]];
  s+=label('t [s]',170,185,{size:24,color:C.t,anchor:'middle',weight:700})+label('x′ [m]',400,185,{size:24,color:C.hi,anchor:'middle',weight:700});
  rows.forEach(([a,c],j)=>{s+=label(String(a),170,230+j*40,{size:26,color:C.t,anchor:'middle'})+label(mm(c),400,230+j*40,{size:26,color:C.hi,anchor:'middle'});});
  s+=fade(seg(p,b+.15,b+.3),line(50,340,550,340,{color:C.faint,w:2})+label('（同じこと）',300,380,{size:22,color:C.dim,anchor:'middle'})
   +T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}=0-3`,300,440,34));
  let r=T(`${xp}=-1.5${tt}^2`,890,140,38);
  r+=fade(seg(p,.1,.2),arrow(890,170,890,210,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',910,198,{size:24,color:C.dim}));
  r+=fade(seg(p,.2,.32),T(`{\\color{${C.v}}\\dfrac{d${xp}}{d${tt}}=-3${tt}}`,890,262,38));
  r+=fade(seg(p,b,b+.08),arrow(890,320,890,360,{color:C.dim,w:3,head:12})+label('もう 1回 微分',910,348,{size:24,color:C.dim}));
  r+=fade(seg(p,b+.08,b+.2),T(`{\\color{${C.a}}\\dfrac{d^2${xp}}{d${tt}^2}=-3}`,890,420,38)+label('m/s²',1080,428,{size:24,color:C.a}));
  s+=card(610,90,570,410,r,1);
  s+=goalTag(G1);
  return s;
 },
 // 6. 上下の画面：地面から見る／バスから見る（t 0→2 s）。力の矢印がないのは同じ、違うのは見ている人。小問1 の答え C
 [K+'two']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,t=2*seg(p,.05,.85);
  let s=twoPanels(t,{labels:seg(p,b,b+.1)});
  s+=goalTag(G1)+ANS1(seg(p,b-.06,b));
  return s;
 },
 // 7. 下の画面にだけ、慣性力 −1.5 N（緑の破線）。上の画面には何も足さない（仕切り線）
 [K+'inertial']:(p)=>{
  let s=twoPanels(2,{labels:0,inertial:seg(p,.3,.45),divider:seg(p,.5,.6)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 8. 誤答 A → B → D を一枚ずつ（上に正しい式の枠）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.5],[s0*.5,s0],[W[1]?W[1][0]:s0,1]];
  let s=card(150,96,900,140,label('バスの目盛りで見た加速度',600,140,{size:24,color:C.dim,anchor:'middle'})
   +T(`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}=0-3=-3\\ \\mathrm{m/s^2}`,600,200,40),1);
  s+=wrongSeq(p,ctx,[['A','0','地面から見た加速度'],['B','前向きに 3','a′＝a−A の向きを逆にした'],['D','後ろ向きに 6','3÷0.5（単位 m/(s²·kg)）']],{win:wins,opts:{y:270,size:28,whySize:24}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. バスの図とカードを消し、出題中の小問2の図（円と2点の速度の矢印）
 [K+'goal2']:(p)=>{
  let s=desk({vel:1,ghost:1});
  s+=panel(110,200,label('小問2',PC,160,{size:26,color:C.dim,anchor:'middle'})+label('速さ 一定 4 m/s で 円を 回る',PC,215,{size:28,color:C.v,anchor:'middle',weight:700})
   +label('地面から見た 加速度 は？',PC,265,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 2点の速度の矢印を光らせる。長さは同じ、向きが違う。札「速さ 一定、向き 変わる」
 [K+'dir']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,blink=.5+.5*Math.sin(cueT(ctx)*5);
  let s=desk({vel:1,ghost:1,hiV:seg(p,.05,.15)*blink});
  s+=panel(110,250,label('速さ 一定、向き 変わる',PC,175,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+label('速度（矢印）が 変わる',PC,265,{size:28,color:C.v,anchor:'middle'})
    +label('→ 加速度 が ある',PC,320,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,.05,.15),C.hi);
  s+=goalTag(G2);
  return s;
 },
 // 11. 2本の速度の矢印を外へ取り出し、根元をそろえる。先から先へ Δ𝐯（黄）。Δ𝐯 を2点の真ん中へ戻すと中心を指す
 [K+'dv']:(p)=>{
  let s=desk({vel:1,ghost:1});
  const ox=930,oy=250,[d1x,d1y]=vdir(TH1),[d2x,d2y]=vdir(TH2);
  const m=seg(p,.05,.3);
  const [g1x,g1y]=P(TH1),[g2x,g2y]=P(TH2);
  const a1=[mix(g1x,ox,m),mix(g1y,oy,m)],a2=[mix(g2x,ox,m),mix(g2y,oy,m)];
  s+=fade(seg(p,.03,.08),arrow(a1[0],a1[1],a1[0]+d1x*VS,a1[1]+d1y*VS,{color:C.v,w:6})+arrow(a2[0],a2[1],a2[0]+d2x*VS,a2[1]+d2y*VS,{color:C.v,w:6}));
  s+=fade(seg(p,.3,.4),label('根元を そろえる',ox-50,120,{size:24,color:C.dim,anchor:'middle'})+T(`${col(C.v,'\\mathbf{v}_1')}`,ox-120,oy-60,30)+T(`${col(C.v,'\\mathbf{v}_2')}`,ox-120,oy+90,30));
  const dvG=seg(p,.4,.55),t1=[ox+d1x*VS,oy+d1y*VS],t2=[ox+d2x*VS,oy+d2y*VS];
  s+=arrow(t1[0],t1[1],t2[0],t2[1],{color:C.hi,w:6,g:dvG,head:16})+fade(dvG,T(`${col(C.hi,'\\Delta\\mathbf{v}')}`,t1[0]-46,(t1[1]+t2[1])/2+10,32));
  // 戻す
  const back=seg(p,.65,.85),[mx,my]=P(Math.PI/2),L=t2[1]-t1[1];
  const bx=mix(t1[0],mx,back),by=mix(t1[1],my+18,back);
  s+=fade(back,arrow(bx,by,bx,by+L,{color:C.hi,w:7,head:18}));
  s+=fade(seg(p,.85,.95),label('Δ𝐯 を 戻すと 円の 中心を 向く',ox-40,440,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=legend([['Δ𝐯 黄',C.hi]],480,494,{g:seg(p,.4,.5)});
  s+=goalTag(G2);
  return s;
 },
 // 12a. 札「v²/r（単元動画で導いた結果）」、4² と 2 を入れて 8（赤）。球に中心向きの加速度（赤）。小問2 の答え B
 [K+'v2r']:(p,ctx)=>{
  let s=desk({vel:1,ghost:0});
  const [x,y]=P(TH2),ux=(CX-x)/R,uy=(CY-y)/R;
  s+=fade(seg(p,.35,.5),arrow(x+ux*20,y+uy*20,x+ux*120,y+uy*120,{color:C.a,w:7,head:18})+label('8 m/s²',x+ux*120-16,y+uy*120+16,{size:26,color:C.a,anchor:'end',weight:700}));
  s+=panel(96,300,kindTag('結果',PC,140,{text:'v²/r（単元動画で導いた結果）'})
   +T(`\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}=\\dfrac{4^2}{2}`,PC,230,40)
   +fade(seg(p,.2,.32),T(`={\\color{${C.a}}8\\ \\mathrm{m/s^2}}`,PC,320,40))
   +fade(seg(p,.32,.45),label('向き：円の 中心',PC,375,{size:26,color:C.a,anchor:'middle',weight:700})),seg(p,.03,.12),C.a);
  const ve=sentWin(ctx)[0][1];s+=goalTag(G2)+ANS2(seg(p,ve*.88,ve*.96));
  return s;
 },
 // 12b. この加速度は、糸の力 0.3×8＝2.4 N が生む（緑）
 [K+'tension2']:(p)=>{
  let s=desk({vel:1,ghost:0});
  const [x,y]=P(TH2),ux=(CX-x)/R,uy=(CY-y)/R;
  s+=arrow(x+ux*20,y+uy*20,x+ux*120,y+uy*120,{color:C.a,w:7,head:18})+label('8 m/s²',x+ux*120-16,y+uy*120+16,{size:26,color:C.a,anchor:'end',weight:700});
  s+=fade(seg(p,.2,.35),arrow(x+ux*20-uy*22,y+uy*20+ux*22,x+ux*95-uy*22,y+uy*95+ux*22,{color:C.F,w:6,head:16})+label('糸の力 2.4 N',x+ux*60+uy*30+12,y+uy*60-ux*30,{size:24,color:C.F,weight:700}));
  s+=panel(96,300,label('この加速度を 生む 力',PC,145,{size:26,color:C.dim,anchor:'middle'})
   +T(`m${col(C.a,'a')}=0.3\\times8`,PC,225,40)+fade(seg(p,.3,.45),T(`={\\color{${C.F}}2.4\\ \\mathrm{N}}`,PC,305,40))
   +fade(seg(p,.45,.6),label('糸の力（中心向き）',PC,370,{size:26,color:C.F,anchor:'middle',weight:700})),1,C.F);
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 13. 誤答 A → C → D を一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.48],[s0*.48,s0],[W[1]?W[1][0]:s0,1]];
  let s=desk({vel:1,ghost:0});
  const [x,y]=P(TH2),ux=(CX-x)/R,uy=(CY-y)/R;
  s+=arrow(x+ux*20,y+uy*20,x+ux*120,y+uy*120,{color:C.a,w:7,head:18})+label('8 m/s²',x+ux*120-16,y+uy*120+16,{size:26,color:C.a,anchor:'end',weight:700});
  s+=panel(96,150,label('地面から見た 加速度',PC,140,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}=\\dfrac{4^2}{2}={\\color{${C.a}}8}`,PC,205,34),1);
  s+=wrongSeq(p,ctx,[['A','0','向きが変われば 速度は 変わる'],['C','外向きに 8','回る人の 遠心力と 混ぜた'],['D','中心向きに 2','v/r（単位 1/s）']],{win:wins,opts:{...WOPT,y:265}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 円の図とカードを消し、出題中の小問3の図
 [K+'goal3']:(p)=>{
  let s=earth({});
  s+=panel(110,200,label('小問3',PC,160,{size:26,color:C.dim,anchor:'middle'})+label('地表から 高さ 2R の所',PC,215,{size:28,color:C.x,anchor:'middle',weight:700})
   +label('重力加速度 は？',PC,265,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 「r は中心から」。R と 2R の矢印を足して、中心から 3R の1本に。同心円 R・2R・3R を薄く
 [K+'r3R']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=earth({merge:seg(p,b+.1,b+.3),rings:seg(p,b+.3,b+.45)});
  s+=panel(110,280,label('式の r は 中心から',PC,170,{size:30,color:C.x,anchor:'middle',weight:700})
   +T(`F=\\dfrac{GMm}{${col(C.x,'r')}^2}`,PC,245,36)
   +fade(seg(p,b+.1,b+.25),T(`${col(C.x,'r')}=R+2R=3R`,PC,340,38)),seg(p,.03,.12),C.x);
  s+=goalTag(G3);
  return s;
 },
 // 16. 地球から出る同じ本数の線が、半径 R と 3R の円を通る。間隔が広がり、面積 9 倍。9.8÷9≈1.1。小問3 の答え C
 [K+'inv']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=earth({merge:1,rings:1,lines:seg(p,.05,.2),spread:seg(p,.2,.32),tag:0});
  s+=fade(seg(p,.22,.34),label('線の 間隔 3倍',470,130,{size:22,color:C.hi,weight:700}));
  s+=panel(96,330,label('重力は r² に 反比例',PC,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('球の 面積 9 倍 → 線の 混み方 1/9',PC,195,{size:24,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.48),T(`\\left(\\dfrac{R}{3R}\\right)^2=\\dfrac{1}{9}`,PC,265,36))
   +fade(seg(p,b,b+.12),T(`9.8\\div9\\approx{\\color{${C.a}}1.1\\ \\mathrm{m/s^2}}`,PC,370,38)),1,C.a);
  const ve=W[1]?W[1][1]:W[0][1];s+=goalTag(G3)+ANS3(seg(p,ve*.9,ve*.97));
  return s;
 },
 // 17. 誤答 A → B → D を一枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.62],[s0*.62,s0],[W[1]?W[1][0]:s0,1]];
  let s=earth({merge:1,rings:1,tag:0});
  s+=panel(96,150,label('高さ 2R の所（r ＝ 3R）',PC,140,{size:24,color:C.dim,anchor:'middle'})+T(`9.8\\div3^2\\approx{\\color{${C.a}}1.1}`,PC,205,34),1);
  s+=wrongSeq(p,ctx,[['A','約 2.45','r＝2R とした（9.8÷4）'],['B','約 3.3','1/r にした（9.8÷3）'],['D','約 4.9','高さ2倍で 半分 とした']],{win:wins,opts:{...WOPT,y:265}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 18. バスの2画面（a′＝−3）、円の Δ𝐯（中心向き 8）、地球と 3R（1.1）を並べ、式に矢印でつなぐ。答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  const cw=360,gap=30,x0=(1200-3*cw-2*gap)/2,xs=[0,1,2].map(i=>x0+i*(cw+gap)),y0=96,ch=250;
  const gs=[seg(p,.02,.12),seg(p,b,b+.1),seg(p,b+.2,b+.3)];
  let s='';
  // バス（小）
  let a=rect(xs[0]+20,y0+70,cw-40,80,{fill:'#141d33',fo:1,stroke:C.dim,sw:2.5,rx:10})+rect(xs[0]+20,y0+150,cw-40,10,{fill:'#24324f',fo:1,stroke:'none'});
  a+=ring(xs[0]+cw/2,y0+135,14,{color:BALL,w:3,fill:'#4a3216'})+arrow(xs[0]+cw/2-20,y0+105,xs[0]+cw/2-120,y0+105,{color:C.a,w:5,head:14});
  a+=label('バスの中から見る',xs[0]+cw/2,y0+40,{size:24,color:C.hi,anchor:'middle',weight:700})+label('a′ ＝ −3 m/s²',xs[0]+cw/2,y0+205,{size:28,color:C.a,anchor:'middle',weight:700});
  s+=card(xs[0],y0,cw,ch,a,gs[0]);
  // 円（小）
  const cx=xs[1]+cw/2,cy=y0+130,r=70;
  let c=ring(cx,cy,r,{color:C.dim,w:2,dash:'5 6'})+dot(cx,cy,5,C.dim)+dot(cx,cy-r,10,C.hi)+arrow(cx,cy-r+14,cx,cy-14,{color:C.hi,w:5,head:14});
  c+=label('円運動',cx,y0+40,{size:24,color:C.v,anchor:'middle',weight:700})+label('中心向き 8 m/s²',cx,y0+235,{size:26,color:C.a,anchor:'middle',weight:700});
  s+=card(xs[1],y0,cw,ch,c,gs[1]);
  // 地球（小）
  const ex=xs[2]+cw/2,ey=y0+135,er=24;
  let e=ring(ex,ey,3*er,{color:C.x,w:2,dash:'5 6'})+ring(ex,ey,er,{color:EARTH,w:3,fill:'#1d3a66'})+arrow(ex,ey,ex+3*er,ey,{color:C.x,w:4,head:12})+label('3R',ex+1.6*er,ey-10,{size:22,color:C.x,anchor:'middle'});
  e+=label('遠くの 重力',ex,y0+40,{size:24,color:C.x,anchor:'middle',weight:700})+label('9.8÷9 ≈ 1.1 m/s²',ex,y0+235,{size:26,color:C.a,anchor:'middle',weight:700});
  s+=card(xs[2],y0,cw,ch,e,gs[2]);
  const fy=y0+ch+40,fh=96,fs=[`${col(C.a,"a'")}=${col(C.a,'a')}-${col(C.a,'A')}`,`\\dfrac{${col(C.v,'v')}^2}{${col(C.x,'r')}}`,`F=\\dfrac{GMm}{${col(C.x,'r')}^2}`];
  fs.forEach((f,i)=>{s+=fade(gs[i],arrow(xs[i]+cw/2,y0+ch+4,xs[i]+cw/2,fy-4,{color:C.dim,w:3,head:12}))+card(xs[i]+30,fy,cw-60,fh,T(f,xs[i]+cw/2,fy+fh/2+4,i===0?36:32),gs[i],C.hi);});
  s+=answerRow([[1,'C',''],[2,'B',''],[3,'C','']],{g:seg(p,.85,.95)});
  return s;
 },
};

// 上下の2画面（行6・7）：上＝地面から見る、下＝バスから見る
function twoPanels(t,{labels=0,inertial=0,divider=0}={}){
 const X=Xbus(t);
 let s=bus({y0:92,X,S:0,A:1,pin:0,kg:0,rlab:0});
 s+=bus({y0:322,X,S:X,A:0,pin:0,kg:0,rlab:0});
 s+=line(0,298,1200,298,{color:divider?C.ink:C.faint,w:2+3*divider,dash:divider?'':'4 8'});
 s+=label('地面から見る',1180,250,{size:26,color:C.x,anchor:'end',weight:700})+label('バスから見る',1180,440,{size:26,color:C.hi,anchor:'end',weight:700});
 s+=label(`t ＝ ${t.toFixed(1)} s`,1180,205,{size:26,color:C.t,anchor:'end',weight:700});
 if(labels){
  s+=fade(labels,label('ボールに 力の矢印は ない（同じ）',1180,166,{size:24,color:C.F,anchor:'end',weight:700})
   +label('違うのは 見ている人',1180,395,{size:26,color:C.hi,anchor:'end',weight:700}));
 }
 if(inertial){
  const bx=GX(0-X),fl=322+130;
  s+=fade(inertial,dashArrow(bx-18,fl-15,bx-140,fl-15,{})+label('慣性力 −1.5 N',bx-150,fl-40,{size:24,color:C.F,weight:700}));
  s+=fade(inertial,label('何も 足さない',1180,166,{size:26,color:C.dim,anchor:'end',weight:700})+label('バスの中の 式に だけ',1180,395,{size:24,color:C.F,anchor:'end',weight:700}));
 }
 return s;
}
