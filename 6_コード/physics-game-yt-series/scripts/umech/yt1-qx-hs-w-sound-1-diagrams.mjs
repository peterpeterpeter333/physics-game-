// 問題編 解説「680 Hz のスピーカーと雷」(ys-qx-hs-w-sound-1) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/302_音波.md の q-hs-w-sound-1（解説 17 行）。
// 色（正本の指定）：波長 λ・距離 水色、時刻 t 金、振動数 f 桃、速さ V 紫、ずれ・振幅 A 白、印・密 黄、強調 黄。
// 音は縦波：空気の粒（点）は左右に往復するだけ。グラフは「粒の右へのずれ」を縦にとったもの。
// 元の単元動画（yt1-hs-w-sound-1）の部品を読み込んで使う（そのファイルは編集しない）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には、中央の V の枠のほかは描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,poly,clamp} from './anim.mjs';
import {T2,LC,TCOL,FC,VCOL,ROPE,MK,AIR,airS,denseD,speaker,scenePhase,span} from './yt1-hs-w-sound-1-diagrams.mjs';
import {card,goalTag,answerTag,answerTagW,wrongCard,wrongSeq,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-sound-1:';
const PI=Math.PI;
const G1='空気中の 波長 λ',G2='振幅を 2倍に したときの 変化',G3='雷までの 距離';
const A1=g=>answerTag(1,'B','0.50 m',{g}),A2=g=>answerTag(2,'D','大きくなり、高さと波長は同じ',{g,maxW:520}),A3=g=>answerTag(3,'C','1.5 km',{g});
const hash=(i,r)=>{const z=Math.sin(i*12.9898+r*78.233)*43758.5453;return z-Math.floor(z);};
const W1=(s,o={})=>wrongCard(...s,o);

// ---- 空気の粒の列（左にスピーカー）。o.rows の行に粒を並べる -------------------------------------------
export const O={...AIR,x0:300,x1:1160,mx:260,rows:[150,180,210,240,270],n:34,lam:300,A:14,T:1.6,gy:440,gA:2.4,y0:130,y1:290};
export const O2={...O,rows:[232,256,280,304,328],y0:212,y1:348};
const MARKS=[5,13,21,29];
function airQ(ph,{o=O,A=o.A,g=1,dense=0,sparse=0,boost=0,marks=1,front=false,graph=0,dlab=1}={}){
 let s=speaker(ph,{o,A,g,y0:o.y0,y1:o.y1});
 const L=o.lam;
 if(dense||sparse)for(const d of denseD(ph,{o,front})){const x=o.x0+d;
  if(dense)s+=fade(g*dense,rect(x-30,o.rows[0]-20,60,o.rows.at(-1)-o.rows[0]+40,{fill:C.hi,fo:.14+.3*boost,stroke:C.hi,sw:1.5+2*boost,rx:10})+(dlab?label('密',x,o.rows[0]-32,{size:24,color:C.hi,anchor:'middle',weight:700}):''));
  const xr=x+L/2;if(sparse&&xr<o.x1-10&&xr>o.x0+10&&(!front||d>L/2+10))s+=fade(g*sparse,label('疎',xr,o.rows[0]-32,{size:24,color:C.dim,anchor:'middle',weight:700}));}
 o.rows.forEach((y,r)=>{for(let i=0;i<o.n;i++){const bx=o.x0+(o.x1-o.x0)*i/(o.n-1)+(r%2?6:-6)+(hash(i,r)-.5)*6,by=y+(hash(i,r+9)-.5)*8;
  const X=bx+airS(bx-o.x0,ph,{o,A,front}),h=marks&&r===2&&MARKS.includes(i);s+=fade(g,dot(X,by,h?10:6,h?MK:'#a9d8ff'));}});
 if(graph){const pts=[];for(let x=o.x0;x<=o.x1;x+=4)pts.push([x,o.gy-o.gA*airS(x-o.x0,ph,{o,A,front})]);
  s+=fade(g*graph,line(o.x0,o.gy,o.x1,o.gy,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:4})
   +label('粒の 右への ずれ',o.x0,o.gy-52,{size:22,color:ROPE,weight:700}));}
 return s;
}
// つまみ（指す向き u＝0〜1）。lines＝下に書く文字 [[文字,色,大きさ],…]
function knob(x,y,u,{g=1,act=0,color=C.ink,lines=[],r=30}={}){
 const a=PI*(1.25-1.5*u);
 let s='';
 if(act)s+=fade(act,ring(x,y,r+10,{color:C.hi,w:4}));
 s+=ring(x,y,r,{color:act?color:C.dim,w:act?4:3,fill:'#131f38'})+line(x,y,x+r*.8*Math.cos(a),y-r*.8*Math.sin(a),{color,w:5});
 lines.forEach(([t,c,sz],i)=>{s+=label(t,x,y+r+(r>32?36:26)+i*30,{size:sz??24,color:c??color,anchor:'middle',weight:700});});
 return fade(g,s);
}
const KF={x:70,y:380},KA={x:190,y:380};
const knobF=({g=1,act=0}={})=>knob(KF.x,KF.y,.55,{g,act,color:FC,lines:[['振動数',FC,24],['680 Hz',FC,26]]});
const knobA=(u=.35,{g=1,act=0}={})=>knob(KA.x,KA.y,u,{g,act,color:C.ink,lines:[['振幅',C.ink,24]]});
function hand(x,y,g=1){return fade(g,rect(x+14,y+6,46,30,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:12})+rect(x+2,y+12,24,12,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:5}));}
const Vcard=(g=1)=>card(450,4,300,64,label('V ＝ 340 m/s',600,47,{size:28,color:VCOL,anchor:'middle',weight:700}),g,VCOL);
// 雷の予告・雷の場面の部品
function cloud(x,y,g=1,k=1){return fade(g,[[0,0,46],[44,-14,40],[86,4,38],[40,16,40]].map(([dx,dy,r])=>dot(x+dx*k,y+dy*k,r*k,'#56627a')).join(''));}
function bolt(x,y,g=1,k=1){return fade(g,poly([[x,y],[x+34*k,y],[x+12*k,y+70*k],[x+40*k,y+70*k],[x-12*k,y+170*k],[x+4*k,y+96*k],[x-24*k,y+96*k]],{fill:C.hi,fo:1}));}
function person(x,y,{g=1,color='#d6deec',h=1}={}){return fade(g,dot(x,y-118*h,16*h,color)+line(x,y-100*h,x,y-48*h,{color,w:6*h})+line(x,y-48*h,x-16*h,y,{color,w:6*h})+line(x,y-48*h,x+16*h,y,{color,w:6*h})+line(x,y-86*h,x-22*h,y-58*h,{color,w:6*h})+line(x,y-86*h,x+22*h,y-58*h,{color,w:6*h}));}
const GY=440,PX=1020,SRC=[170,290],EYE=[PX,GY-118];
function thunder({flash=0,clock=null,clockG=1,g=1}={}){
 let s=fade(g,line(60,GY,1140,GY,{color:C.dim,w:3}))+cloud(110,110,g)+bolt(150,130,g*flash)+person(PX,GY,{g});
 s+=fade(g,label('聞き手',PX,GY+34,{size:24,color:C.dim,anchor:'middle',weight:700}));
 if(clock!==null)s+=card(PX-150,96,300,64,label(`時計 ${clock.toFixed(1)} s`,PX,140,{size:30,color:TCOL,anchor:'middle',weight:700}),g*clockG,TCOL);
 return s;
}
function fronts(r,{g=1}={}){let s='';for(let j=0;j<3;j++){const rr=r-j*36;if(rr<=8)continue;
 const a0=-Math.min(.55,Math.asin(Math.min(1,(SRC[1]-100)/rr))),a1=Math.min(.6,Math.asin(Math.min(1,(GY-4-SRC[1])/rr)));
 s+=fade(g*(.85-j*.22),`<path d="M${SRC[0]+rr*Math.cos(a0)} ${SRC[1]+rr*Math.sin(a0)} A ${rr} ${rr} 0 0 1 ${SRC[0]+rr*Math.cos(a1)} ${SRC[1]+rr*Math.sin(a1)}" fill="none" stroke="#a9d8ff" stroke-width="3"/>`);}return s;}
const RMAX=Math.hypot(EYE[0]-SRC[0],EYE[1]-SRC[1])-20;

// ---- 縮尺を引いた帯（1秒で 340 m） -----------------------------------------------------------------
const BX0=150,BX1=1030,BY=260,GAP=30;   // 340 m → 880 px。密は GAP px おきに描く（省略）
function band(u,{g=1,arrowG=1,lab340=0,mark=1,zoom=0,div=0}={}){
 const xf=BX0+(BX1-BX0)*u;
 let s=fade(g,rect(BX0,BY-44,1150-BX0,88,{fill:'#16223b',fo:1,stroke:C.faint,rx:8})+rect(BX0-60,BY-34,52,68,{fill:'#26324a',fo:1,stroke:C.dim,rx:8})+label('スピーカー',BX0-34,BY+70,{size:22,color:C.dim,anchor:'middle'}));
 let ls='';for(let x=xf;x>BX0+2;x-=GAP)ls+=line(x,BY-36,x,BY+36,{color:C.hi,w:x===xf?6:3,opacity:x===xf?1:.75});
 s+=fade(g,ls);
 if(mark&&u>.01)s+=fade(g,dot(xf,BY-50,9,MK)+label('最初の 密',Math.min(xf,1080),BY-66,{size:24,color:MK,anchor:'middle',weight:700}));
 if(u>.01)s+=fade(g*arrowG,arrow(BX0,BY+70,xf,BY+70,{color:VCOL,w:5,head:16}));
 if(lab340)s+=fade(g*lab340,label('340 m',BX1+16,BY+80,{size:30,color:VCOL,weight:700}));
 if(div)s+=fade(g*div,line(BX1,BY-50,BX1,BY+50,{color:VCOL,w:3,dash:'6 6'}));
 if(zoom){const zx=BX0+GAP*9;   // 隣り合う2本の密を拡大
  s+=fade(g*zoom,rect(zx-8,BY-42,GAP+16,84,{fill:'none',fo:0,stroke:LC,sw:3,rx:6})
   +line(zx-8,BY+42,420,382,{color:LC,w:2,dash:'5 6'})+line(zx+GAP+8,BY+42,780,382,{color:LC,w:2,dash:'5 6'})
   +rect(420,382,360,100,{fill:'#16223b',fo:1,stroke:LC,sw:3,rx:10})
   +line(480,392,480,472,{color:C.hi,w:5})+line(720,392,720,472,{color:C.hi,w:5}))
   +span(480,720,450,'0.50 m',LC,g*zoom,28,-14);}
 return s;
}

// ---- つまみの表（S2・まとめ） -----------------------------------------------------------------------
function knobPanel({g=1,hiA=0,hiF=0,uA=.7,labs=1,x0=150,y0=114,w=900,h=222}={}){
 const xa=x0+w*.27,xf=x0+w*.73,y=y0+86;
 let s=card(x0,y0,w*.47,h,'',g,hiA?C.hi:C.faint)+card(x0+w*.53,y0,w*.47,h,'',g,hiF?C.hi:C.faint);
 s+=knob(xa,y,uA,{g,act:hiA,color:C.ink,r:40,lines:[['振幅 A',C.ink,28]]});
 s+=knob(xf,y,.55,{g,act:hiF,color:FC,r:40,lines:[['振動数 f',FC,28]]});
 s+=fade(g*labs,label('→ 大きさ',xa,y0+h-22,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 高さ',xf,y0+h-22,{size:30,color:FC,anchor:'middle',weight:700}));
 return s;
}
// 振幅の比べ（前 A／後 2A）。山は x＝400・700（間隔 300 px＝0.50 m）
function compare(g=1){
 const gx0=250,gx1=1100,lam=300,xc=400;
 const tr=(y,A)=>{const pts=[];for(let x=gx0;x<=gx1;x+=4)pts.push([x,y-A*Math.cos(2*PI*(x-xc)/lam)]);return line(gx0,y,gx1,y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:4});};
 let s=tr(170,32)+tr(345,64);
 s+=label('前：振幅 A',gx0-14,178,{size:26,color:C.ink,anchor:'end',weight:700})+label('後：振幅 2A',gx0-14,353,{size:26,color:C.ink,anchor:'end',weight:700});
 s+=line(400,110,400,470,{color:LC,w:2,dash:'5 6'})+line(700,110,700,470,{color:LC,w:2,dash:'5 6'});
 s=fade(g,s)+span(400,700,244,'0.50 m',LC,g,26,-10)+span(400,700,452,'0.50 m',LC,g,26,-12);
 return s;
}
// 小さい音・大きい音が同じ速さで進む（2本の列）
const OS={...O,rows:[150,172,194],y0:134,y1:210,lam:300,T:2.6},OL={...O,rows:[266,288,310],y0:250,y1:326,lam:300,T:2.6};
function race(t,g=1){
 const ph=t/OS.T,xf=Math.min(O.x1,O.x0+OS.lam*ph);
 let s=airQ(ph,{o:OS,A:9,front:true,dense:.8,marks:0,g,dlab:0})+airQ(ph,{o:OL,A:18,front:true,dense:.8,boost:.6,marks:0,g,dlab:0});
 s+=fade(g,label('小さい 音',128,180,{size:24,color:C.ink,anchor:'end',weight:700})+label('大きい 音',128,296,{size:24,color:C.ink,anchor:'end',weight:700}));
 if(xf>O.x0+60){s+=arrow(xf-130,124,xf,124,{color:VCOL,w:5,head:14,g})+arrow(xf-130,240,xf,240,{color:VCOL,w:5,head:14,g});
  s+=fade(g,line(xf,118,xf,334,{color:VCOL,w:2,dash:'5 6'}));}
 return s;
}

export const qxHsWSound1Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1）：スピーカーの膜が揺れ、粒が往復し、密と疎が右へ伝わる。下にずれのグラフ。つまみ2つ、V。λ の物差しは付けない。
 [K+'q0']:(p,ctx)=>{
  const ph=Math.max(0,cueT(ctx)-.3)/O.T;
  let s=airQ(ph,{front:true,dense:seg(p,.12,.3),sparse:seg(p,.3,.45),graph:seg(p,.2,.4)});
  s+=knobF()+knobA(.35)+Vcard();
  return s;
 },
 // 小問2：粒の列・密と疎・グラフを消し、スピーカー・つまみ2つ・V だけ。手が振幅のつまみを回し「振幅 ×2」。
 [K+'q2']:(p)=>{
  const u=.35+.35*seg(p,.2,.65);
  let s=speaker(0,{o:O,y0:O.y0,y1:O.y1})+knobF()+knobA(u,{act:seg(p,.05,.2)})+hand(KA.x+10,KA.y+14,seg(p,.05,.2)*(1-seg(p,.75,.9)));
  s+=fade(seg(p,.8,.92),label('振幅 ×2',KA.x+50,KA.y+8,{size:30,color:C.ink,weight:700}));
  s+=Vcard();
  return s;
 },
 // 小問3：暗転して雷の場面。稲妻が光り、聞き手の横の時計が 0 → 4.5 s。波面・距離の矢印は描かない。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),fl=seg(t,.2,.3)*(1-.65*seg(t,.7,.9));
  return thunder({flash:fl,clock:4.5*clamp((t-.3)/4.5),clockG:seg(t,0,.2)});
 },
 // ================= S1 小問1：波長 =================
 // 1. 出題中のスピーカーと密・疎、680 Hz、V。右下に雷の場面を小さく予告し、すぐ消す
 [K+'setup']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,{},O.T);
  let s=airQ(ph,{front:true,dense:1,sparse:1,graph:1});
  s+=knobF()+knobA(.35)+Vcard();
  const pv=seg(p,.55,.62)*(1-seg(p,.82,.9));
  s+=fade(pv,card(860,330,320,170,'',1,C.dim)+`<g transform="translate(860 320) scale(.27)">${thunder({flash:1})}</g>`+label('雷の 場面',1020,490,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 // 2. 求めるもの：空気中の波長。密の帯を光らせる
 [K+'goal1']:(p,ctx)=>{
  const ph=scenePhase(p,ctx,{},O.T),b=seg(p,.25,.4)*(.5+.5*Math.sin(cueT(ctx)*5)**2);
  let s=airQ(ph,{front:true,dense:1,sparse:1,graph:1,boost:b});
  s+=knobF()+knobA(.35)+Vcard(1-seg(p,0,.1));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 縮尺を引いた帯。1秒を早回しで送り出す。時計 0 → 1 s、密のカウンター 0 → 680、最初の密へ紫の矢印 340 m
 [K+'band']:(p,ctx)=>{
  const ve=voiceEnd(ctx),u=lin(p,.05,ve*.92);
  let s=band(u,{lab340:seg(p,ve*.9,ve*.97)});
  // PQ-037：1文目のあいだ、密の1本（先頭から2本目）を黄色い枠で囲み、何を「密」と呼ぶかの札を付ける
  const W=sentWin(ctx),e1=W[1]?W[1][0]:.5,bx=BX0+(BX1-BX0)*u-2*GAP,bg=seg(p,.03,.09)*(1-seg(p,e1,e1+.04));
  if(bx>BX0+8&&bg>0){const lx=Math.max(330,Math.min(900,bx));
   s+=fade(bg,rect(bx-13,BY-48,26,96,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:8})+line(bx,BY+48,lx,BY+104,{color:C.hi,w:2,dash:'5 5'})
    +label('密：空気が 周りより 詰まった 部分',lx,BY+130,{size:26,color:C.hi,anchor:'middle',weight:700}));}
  s+=card(20,90,240,60,label(`時間 ${u>=.999?'1.0':(u).toFixed(1)} s`,140,131,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,0,.05),TCOL);
  s+=card(900,90,280,60,label(`密 ${Math.round(680*u)} 個`,1040,131,{size:28,color:FC,anchor:'middle',weight:700}),seg(p,0,.05),FC);
  s+=note('（密の 数は 省略して 描いています）',600,490,{g:seg(p,.05,.15)});
  s+=goalTag(G1);
  return s;
 },
 // 4. 340 m の中に 680 個 → 間隔 0.50 m（拡大）。2文目：λ＝V/f の式と、元の縮尺の図（密と密の間に 0.50 m）
 [K+'div']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,o1=1-seg(p,b-.02,b+.04),o2=seg(p,b+.03,b+.1);
  let s=band(1,{lab340:1,div:seg(p,.03,.12),zoom:seg(p,.12,.25),mark:0,g:o1});
  s+=card(330,90,540,64,T2('340\\div 680=0.50\\ \\mathrm{m}',600,132,{size:36,auto:false,color:LC}),seg(p,.3,.4)*o1,LC);
  s+=fade(o1*seg(p,.05,.1),note('（密の 数は 省略して 描いています）',1000,505));
  s+=card(250,88,700,76,T2(`{\\color{${LC}}\\lambda}=\\dfrac{{\\color{${VCOL}}V}}{{\\color{${FC}}f}}=340\\div 680=0.50\\ \\mathrm{m}`,600,136,{size:34,auto:false}),o2,LC);
  s+=fade(o2,fig2(ctx,seg(p,b+.15,b+.25)));
  s+=goalTag(G1);
  return s;
 },
 // 5. 小問1 の答え B。誤答 A・C（単位が m にならない）を1枚ずつ
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,m=(b+voiceEnd(ctx))/2;
  let s=card(250,88,700,76,T2(`{\\color{${LC}}\\lambda}=\\dfrac{{\\color{${VCOL}}V}}{{\\color{${FC}}f}}=340\\div 680=0.50\\ \\mathrm{m}`,600,136,{size:34,auto:false}),1,LC);
  s+=fade(1-.45*seg(p,b,b+.05),fig2(ctx,1));
  s+=wrongSeq(p,ctx,[['A','2.0 m','割る向きを逆にした'],['C','2.3×10⁵ m','速さと振動数を掛けた']],{win:[[b,m],[m,1]],opts:{y:370}});
  s+=goalTag(G1)+A1(seg(p,W[0][1]-.06,W[0][1]));
  return s;
 },
 // 6. 誤答 D（440 Hz の波長）。340÷440 と 340÷680 を並べる
 [K+'wrongD1']:(p)=>{
  let s=card(200,96,800,100,label('440 Hz の 音',330,156,{size:28,color:FC,anchor:'middle',weight:700})+T2('340\\div 440\\approx 0.77\\ \\mathrm{m}',730,148,{size:36,auto:false,color:C.dim}),seg(p,.1,.2),C.faint);
  s+=card(200,212,800,100,label('680 Hz の 音',330,272,{size:28,color:FC,anchor:'middle',weight:700})+T2('340\\div 680=0.50\\ \\mathrm{m}',730,264,{size:36,auto:false,color:LC}),seg(p,.15,.25),LC);
  s+=wrongCard('D','0.77 m','動画の 440 Hz の波長を使った',{g:seg(p,.02,.08)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2：振幅を2倍 =================
 // 7. 小問2 の画面（スピーカー・つまみ2つ・振幅 ×2）。求めるもの。振幅のつまみを光らせる
 [K+'goal2']:(p,ctx)=>{
  const b=seg(p,.3,.45)*(.5+.5*Math.sin(cueT(ctx)*5)**2);
  let s=speaker(0,{o:O,y0:O.y0,y1:O.y1})+knobF()+knobA(.7,{act:b});
  s+=label('振幅 ×2',KA.x+50,KA.y+8,{size:30,color:C.ink,weight:700});
  s+=Vcard(1-seg(p,0,.1));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 粒の列を描き直す。揺れ幅が広がり、密が濃くなる。2文目：密と密の間に 0.50 m の物差し（両端を点線で固定）
 [K+'amp']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,t=tAt(ctx,K+'amp'),gr=seg(p,.12,b-.05);
  const ph=t/O.T,A=O.A*(1+gr);
  let s=airQ(ph,{A,dense:seg(p,.03,.12),boost:gr,g:seg(p,0,.08)});
  s+=knobF()+knobA(.7,{act:.6})+label('振幅 ×2',KA.x+50,KA.y+8,{size:30,color:C.ink,weight:700});
  s+=fade(seg(p,.2,.3)*(1-seg(p,b,b+.05)),label('揺れ幅が 大きく → 密は より 密に',760,350,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=ruler(seg(p,b+.02,b+.1));
  s+=goalTag(G2);
  return s;
 },
 // 9. 振幅 A → 大きさ、振動数 f → 高さ。680 Hz は変えていない。λ＝340÷680＝0.50 m（そのまま）
 [K+'rule']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=knobPanel({hiF:seg(p,b,b+.06)});
  s+=fade(seg(p,b+.02,b+.08),label('680 Hz（変えていない）',150+900*.73,114+222+40,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=card(250,400,700,80,T2('\\lambda=340\\div 680=0.50\\ \\mathrm{m}',540,450,{size:36,auto:false,color:LC})+label('（そのまま）',830,452,{size:28,color:LC,anchor:'middle',weight:700}),seg(p,b+.2,b+.3),LC);
  s+=goalTag(G2);
  return s;
 },
 // 10a. 小問2 の答え D。答えのあとで、ずれのグラフを上下に比べる（山の高さだけ2倍、間隔は 0.50 m のまま）
 [K+'ans2']:(p,ctx)=>{
  let s=compare(seg(p,voiceEnd(ctx)+.02,voiceEnd(ctx)+.12));
  const ve=voiceEnd(ctx);s+=goalTag(G2)+A2(seg(p,ve-.12,ve-.02));
  return s;
 },
 // 10b. 比較のグラフを消してから、誤答 A
 [K+'wrongA2']:(p)=>{
  let s=compare(1-seg(p,0,.08));
  s+=fade(seg(p,.08,.16),knobPanel({hiA:.6,hiF:.6,labs:1}));
  s+=wrongCard('A','高くなり、波長が短くなる','振幅と振動数を取り違えた',{g:seg(p,.12,.2)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 11. 誤答 B：小さい音と大きい音の密の先頭が、同じ速さで並んで進む
 [K+'wrongB2']:(p,ctx)=>{
  let s=race(tAt(ctx,K+'wrongB2'),seg(p,0,.08));
  s+=wrongCard('B','速く伝わる','速さは空気で決まる',{g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // 12. 誤答 C：何も変わらない
 [K+'wrongC2']:(p)=>{
  let s=knobPanel({hiA:seg(p,.05,.2)});
  s+=wrongCard('C','何も変わらない','振幅が大きさを決めることを忘れた',{g:seg(p,.03,.1)});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3：雷までの距離 =================
 // 13. 雷の場面。求めるもの。2文目：稲妻が光り、目に光が一瞬で届き、時計が動き出す。音の波面が 4.5 s で聞き手に着く
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,ve=voiceEnd(ctx),u=lin(p,b+.04,ve);
  const fl=seg(p,b,b+.02)*(1-seg(p,b+.12,b+.2));
  let s=thunder({flash:fl,clock:4.5*u});
  s+=fade(fl,line(SRC[0],SRC[1]-60,EYE[0]-20,EYE[1],{color:C.hi,w:3,opacity:.6}));
  s+=fade(seg(p,b,b+.03)*(1-seg(p,b+.12,b+.2)),label('光：ほぼ 一瞬',560,150,{size:26,color:C.hi,anchor:'middle',weight:700}));
  if(u>0)s+=fronts(RMAX*u+20,{g:1-seg(p,ve+.02,1)*.0});
  s+=fade(seg(p,b+.15,b+.25),label('音が 進む 時間',560,330,{size:26,color:VCOL,anchor:'middle',weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 14. 片道の水色の矢印。340×4.5＝1530 m ≈ 1.5 km。小問3 の答え C
 [K+'dist']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=thunder({flash:0,clock:4.5});
  s+=arrow(SRC[0]+30,380,PX-50,380,{color:LC,w:6,head:18,g:seg(p,.03,.15)})+fade(seg(p,.05,.15),label('片道',600,366,{size:26,color:LC,anchor:'middle',weight:700}));
  s+=card(300,180,600,80,T2('340\\times 4.5=1530\\ \\mathrm{m}\\approx 1.5\\ \\mathrm{km}',600,230,{size:36,auto:false,color:LC}),seg(p,.15,.3),LC);
  const ve=voiceEnd(ctx);s+=goalTag(G3)+A3(seg(p,ve-.06,ve));
  return s;
 },
 // 15. 往復の矢印に ×。誤答 A（往復と考え2で割った）、誤答 B（速さを時間で割った）
 [K+'wrongAB3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=thunder({flash:0,clock:4.5});
  const og=seg(p,.03,.12)*(1-seg(p,b,b+.05));
  s+=fade(og*.7,arrow(SRC[0]+40,210,PX-60,210,{color:LC,w:4,head:14})+arrow(PX-60,250,SRC[0]+40,250,{color:LC,w:4,head:14}));
  s+=fade(og*seg(p,.1,.18),label('×',600,262,{size:90,color:'#ff6b6b',anchor:'middle',weight:700})+label('往復ではない',600,170,{size:26,color:'#ff6b6b',anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','0.77 km','往復と考え、2で割った'],['B','76 m','速さを時間で割った']],{opts:{x:120,w:800}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. 誤答 D（1秒に約1 km）。340×3＝1020 m ≈ 1.0 km
 [K+'wrongD3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=thunder({flash:0,clock:4.5,g:.5});
  s+=card(250,150,620,80,T2('340\\times 3=1020\\ \\mathrm{m}\\approx 1.0\\ \\mathrm{km}',560,200,{size:36,auto:false,color:LC}),seg(p,b,b+.08),LC);
  s+=fade(seg(p,b+.05,b+.12),label('3秒で 約 1 km',560,270,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=wrongCard('D','4.5 km','1秒に約1 km と覚えていた',{x:120,w:800,g:seg(p,.03,.1)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=knobPanel({g:seg(p,.03,.12),x0:20,y0:110,w:560,h:220});
  s+=card(600,110,580,100,T2('\\lambda=340\\div 680=0.50\\ \\mathrm{m}',890,170,{size:36,auto:false,color:LC}),seg(p,.1,.2),LC);
  s+=card(600,230,580,100,T2('340\\times 4.5\\approx 1.5\\ \\mathrm{km}',890,290,{size:36,auto:false,color:LC}),seg(p,.15,.25),LC);
  s+=card(150,360,900,90,label('速さ ほぼ 一定 → 高い 音 ほど 波長が 短い',600,416,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,b,b+.08),C.hi);
  s+=ansRow(seg(p,.6,.7));
  return s;
 },
};
// 答えの札を右上に横一列（2番目は2行）
function ansRow(g){
 const it=[[1,'B','0.50 m',{}],[2,'D','大きくなり、高さと波長は同じ',{maxW:330}],[3,'C','1.5 km',{}]];
 let x=1190,s='';
 for(const [n,l,v,o] of [...it].reverse()){s+=answerTag(n,l,v,{g,right:x,size:22,...o});x-=answerTagW(n,l,v,{size:22,...o})+10;}
 return s;
}
// 元の縮尺の図（下寄せ）に、密と密の間の 0.50 m の物差し（固定・両端は点線）
function fig2(ctx,rg){
 const ph=scenePhase(0,ctx,{},O.T);
 return airQ(ph,{o:O2,dense:1,dlab:0,marks:1})+ruler2(rg);
}
const RX=600;
function ruler2(g){return fade(g,line(RX,200,RX,346,{color:LC,w:2,dash:'5 6'})+line(RX+O.lam,200,RX+O.lam,346,{color:LC,w:2,dash:'5 6'}))+span(RX,RX+O.lam,204,'0.50 m',LC,g,26,-12);}
function ruler(g){return fade(g,line(RX,120,RX,300,{color:LC,w:2,dash:'5 6'})+line(RX+O.lam,120,RX+O.lam,300,{color:LC,w:2,dash:'5 6'}))+span(RX,RX+O.lam,322,'',LC,g)+fade(g,label('0.50 m',RX+O.lam/2,360,{size:28,color:LC,anchor:'middle',weight:700})+label('間隔は 変わらない',RX+O.lam/2,400,{size:28,color:C.hi,anchor:'middle',weight:700}));}
