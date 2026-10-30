// YouTube シリーズ「回路の時間変化・初級 2/2」(ys-ui-circuit-time-2) — 図。Stage 1200×515.
// 色：電圧 V・起電力 ℰ 紫、電流 I 緑、電荷 q 桃、電流の変化率 dI/dt 赤、時間 t 金、磁場 𝐁 橙、磁束 Φ 黄（電磁誘導の回と同じ）。
// 補助線①：I–t グラフ（上）と、その下にコイルの電圧 V_L の棒（区間ごと。水平な区間で 0）。
// 補助線②：三つの部品の表。抵抗—I（緑）、コンデンサ—q（桃）、コイル—dI/dt（赤）。
// コイルの電圧の向き：電流が増えるとき、電流が入る側が高い（＋）。減るときは逆。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes} from './anim.mjs';
import {cs,card,T} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='ui-circuit-time-2:';
const POS=C.a,NEG='#7fb3ff',QC=C.p,TC=C.t,IC=C.F,VC=C.v,CC=C.hi,BC=C.E,PHI=C.hi,DC=C.a;
const U=s=>`\\,\\mathrm{${s}}`;
const panel=(x,y,w,h,inner,g=1,stroke=C.faint)=>card(x,y,w,h,inner,g,stroke);
const f1=v=>String(Number(v.toFixed(1)));
const dIdt=`\\dfrac{d${cs(IC,'I')}}{d${cs(TC,'t')}}`;
const dIdtS=`d${cs(IC,'I')}/d${cs(TC,'t')}`;

// ---- symbols ------------------------------------------------------------------------------------
function zig(x1,x2,y,color=C.ink){const pts=[[x1,y]];const n=6;for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-18:18)]);pts.push([x2,y]);return draw(pts,1,{color,w:4});}
function coilSym(x1,x2,y,{n=5,color=C.ink,w=4,r}={}){const d=(x2-x1)/n,rr=r??d/2;let s=`<path d="M${x1} ${y}`;for(let i=0;i<n;i++)s+=` a${d/2} ${rr} 0 0 1 ${d} 0`;return s+`" fill="none" stroke="${color}" stroke-width="${w}"/>`;}
function capSym(x,y,h=90){return rect(x-22,y-h/2,8,h,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2})+rect(x+14,y-h/2,8,h,{fill:C.dim,fo:.9,stroke:C.dim,sw:1,rx:2});}
function loops(x1,x2,y,{n=8,ry=70,rx=16,color=C.ink,w=4}={}){const d=(x2-x1)/n;let s='';for(let i=0;i<n;i++){const cx=x1+(i+.5)*d;s+=`<ellipse cx="${cx}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="${w}"/>`;}return s;}
// big coil: loops between CX1..CX2 at CY, leads at the bottom of the loops
const CX1=230,CX2=630,CY=250,RY=70;
function bigCoil({I=0,B=0,flux=0,lead=true,g=1}={}){
 let s='';
 if(lead)s+=line(90,CY+RY,CX1+16,CY+RY,{color:C.dim,w:4})+line(CX2-16,CY+RY,770,CY+RY,{color:C.dim,w:4});
 s+=loops(CX1,CX2,CY,{n:8,ry:RY});
 if(B>0.01)s+=arrow(CX1-30,CY,CX1-30+(CX2-CX1+80)*clamp(B),CY,{color:BC,w:4+3*clamp(B),head:16});
 if(flux>0.01)s+=fade(flux,`<ellipse cx="${CX1+25}" cy="${CY}" rx="18" ry="${RY-6}" fill="${PHI}" fill-opacity=".22" stroke="${PHI}" stroke-width="3"/>`);
 if(I>0.01)s+=arrow(110,CY+RY+34,110+120*clamp(I),CY+RY+34,{color:IC,w:4+3*clamp(I),head:14})+label('電流 I',110,CY+RY+74,{size:24,color:IC,weight:700});
 return fade(g,s);
}
function terminals(sign,g=1){ // sign +1: entry (left) high; -1: entry low
 const a=sign>0?['＋','−']:['−','＋'],ca=sign>0?[POS,NEG]:[NEG,POS];
 return fade(g,label(a[0],CX1-20,CY+RY-18,{size:30,color:ca[0],anchor:'middle',weight:700})+label(a[1],CX2+20,CY+RY-18,{size:30,color:ca[1],anchor:'middle',weight:700}));
}

// ---- I–t graph with V_L bars (補助線①) -----------------------------------------------------------
const It=t=>t<=0?0:t<1?4*t:t<3?4:t<5?4-2*(t-3):0;
const GX=200,GW=500,GT=(t)=>GX+GW*t/5.6;
function iGraph({g=1,p=1,y=250,h=170}={}){
 const A=axes({x:GX,y,w:GW,h,xmax:5.6,ymax:5.2,xticks:[1,2,3,4,5],yticks:[2,4],grid:true,g,xlabel:'t [s]',ylabel:'',xcolor:TC,ycolor:IC});
 return {A,svg:A.svg+fade(g,label('電流',GX-40,y-h+14,{size:24,color:IC,anchor:'end',weight:700})+label('I [A]',GX-40,y-h+44,{size:22,color:IC,anchor:'end'}))+A.plot(It,{from:0,to:5.4,p,color:IC,w:5,steps:540})};
}
function vRow({y=420,k=30,show=[1,1,1],g=1,label0=['コイルの','電圧'],vals=[2,0,-1],color=VC,ramp=false}={}){
 let s=line(GX-10,y,GX+GW+20,y,{color:C.dim,w:2.5})+label(label0[0],GX-24,y-30,{size:22,color,anchor:'end',weight:700})+label(label0[1],GX-24,y-4,{size:22,color,anchor:'end',weight:700});
 if(!ramp){
  const segs=[[0,1],[1,3],[3,5]];
  segs.forEach(([a,b],i)=>{if(!show[i])return;const v=vals[i];const x1=GT(a)+4,x2=GT(b)-4;
   if(Math.abs(v)<1e-6)s+=fade(show[i],line(x1,y,x2,y,{color,w:6})+label('0 V',(x1+x2)/2,y-14,{size:24,color,anchor:'middle',weight:700}));
   else s+=fade(show[i],rect(x1,v>0?y-k*v:y,x2-x1,k*Math.abs(v),{fill:color,fo:.45,stroke:color,sw:2,rx:3})+label(`${f1(Math.abs(v))} V`,(x1+x2)/2,v>0?y-k*v-10:y+k*Math.abs(v)+28,{size:24,color,anchor:'middle',weight:700}));});
 }else{
  const pts=[[GT(0),y],[GT(1),y-k*2],[GT(3),y-k*2],[GT(5),y],[GT(5.4),y]];
  s+=fade(show[0],`<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width="2"/>`+label('2 V',GT(2),y-k*2-10,{size:24,color,anchor:'middle',weight:700}));
 }
 return fade(g,s);
}
function segHi(a,b,g=1,color=C.hi){return highlight(GT(a)-4,50,GT(b)-GT(a)+8,420,g,color);}
function slopeTri(A,t0,dt,g=1,text=''){const i0=It(t0),i1=It(t0+dt);return fade(g,line(A.X(t0),A.Y(i0),A.X(t0+dt),A.Y(i0),{color:TC,w:3})+line(A.X(t0+dt),A.Y(i0),A.X(t0+dt),A.Y(i1),{color:DC,w:3})+(text?label(text,A.X(t0+dt)+10,A.Y((i0+i1)/2)+8,{size:22,color:DC,weight:700}):''));}

// ---- RL circuit (same geometry as 1/2) ----------------------------------------------------------
const CL=80,CR=600,CT=140,CB=410,BATX=350,SWA=150,SWB=215,RA=180,RB=320,LA=390,LB=540;
function battery(x,y,text='電池 6 V'){let s=line(x-10,y-34,x-10,y+34,{color:C.ink,w:5})+line(x+10,y-18,x+10,y+18,{color:C.ink,w:9});s+=label('＋',x-32,y-22,{size:24,color:POS,anchor:'middle',weight:700})+label('−',x+32,y-22,{size:26,color:NEG,anchor:'middle',weight:700});if(text)s+=label(text,x,y+62,{size:24,color:C.dim,anchor:'middle'});return s;}
function rlCircuit({I=0,sw=1,g=1,vals=true}={}){
 const W=pts=>draw(pts,1,{color:C.dim,w:4});
 let s=W([[SWA,CB],[CL,CB],[CL,CT],[RA,CT]])+zig(RA,RB,CT)+W([[RB,CT],[LA,CT]])+coilSym(LA,LB,CT,{n:5,r:26})+W([[LB,CT],[CR,CT],[CR,CB],[BATX+10,CB]])+W([[SWB,CB],[BATX-10,CB]]);
 const ang=mix(-0.55,0,clamp(sw)),L=SWB-SWA;
 s+=dot(SWA,CB,6,C.ink)+dot(SWB,CB,6,C.ink)+line(SWA,CB,SWA+L*Math.cos(ang),CB+L*Math.sin(ang),{color:C.ink,w:4})+label('スイッチ',(SWA+SWB)/2,CB+44,{size:22,color:C.dim,anchor:'middle'});
 s+=battery(BATX,CB);
 s+=label(vals?'抵抗 3 Ω':'抵抗',(RA+RB)/2,CT-38,{size:24,color:C.ink,anchor:'middle',weight:700})+label(vals?'コイル 0.5 H':'コイル',(LA+LB)/2,CT-44,{size:24,color:C.ink,anchor:'middle',weight:700});
 if(I>0.01){const o={color:IC,w:3+4*clamp(I),head:10+6*clamp(I)};
  s+=fade(Math.min(1,.35+I),arrow(BATX-45,CB,SWB+14,CB,o)+arrow(CL,CB-50,CL,CT+50,o)+arrow(CL+14,CT,RA-14,CT,o)+arrow(CR,CT+50,CR,CB-50,o)+arrow(CR-30,CB,BATX+45,CB,o)+label('電流 I',CL+16,(CT+CB)/2+8,{size:24,color:IC,weight:700}));}
 return fade(g,s);
}
function vbr(a,b,y,text,color,g=1){return fade(g,line(a,y,b,y,{color,w:3})+line(a,y-9,a,y+9,{color,w:3})+line(b,y-9,b,y+9,{color,w:3})+T(text,(a+b)/2,y+36,{size:30}));}
function bar2(vl,{x=760,base=450,k=52,w=76,g=1}={}){ // bottom: coil share (red), top: resistor share (green)
 const hl=k*vl,hr=k*(6-vl);let s='';
 s+=rect(x,base-hl,w,hl,{fill:DC,fo:.5,stroke:DC,sw:2,rx:3})+rect(x,base-6*k,w,hr,{fill:IC,fo:.5,stroke:IC,sw:2,rx:3});
 s+=line(x-18,base,x-18,base-6*k,{color:VC,w:3})+label('6 V',x-30,base-3*k+9,{size:28,color:VC,anchor:'end',weight:700});
 if(hr>30)s+=label(`抵抗 ${f1(6-vl)} V`,x+w+14,base-hl-hr/2+9,{size:26,color:IC,weight:700});
 if(hl>30)s+=label(`コイル ${f1(vl)} V`,x+w+14,base-hl/2+9,{size:26,color:DC,weight:700});
 return fade(g,s);
}

// ---- table (補助線②) ------------------------------------------------------------------------------
function table({rows=[1,1,1],units=0,g=1}={}){
 const X=[70,290,560,890],Y=[80,190,300,410];let s='';
 s+=fade(g,label('部品',X[0]+80,Y[0]+40,{size:26,color:C.dim,anchor:'middle'})+label('両端の電圧',X[1]+130,Y[0]+40,{size:26,color:C.dim,anchor:'middle'})
  +label('何に比例？',X[2]+160,Y[0]+40,{size:26,color:C.dim,anchor:'middle'})+fade(units,label('単位',X[3]+130,Y[0]+40,{size:26,color:C.dim,anchor:'middle'})));
 const R=[
  [zig(X[0]+20,X[0]+140,0),`R${cs(IC,'I')}`,'電流 I',IC,`\\Omega=${U('V/A')}`],
  [capSym(X[0]+80,0,70),`\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,'電荷 q',QC,`${U('F')}=${U('C/V')}`],
  [coilSym(X[0]+20,X[0]+140,10,{n:5,r:22}),`L\\,${dIdt}`,'電流の変化率',DC,`${U('H')}=${U('V\\cdot s/A')}`]];
 R.forEach(([sym,tx,what,color,u],i)=>{const y=Y[i+1]+40;if(!rows[i])return;
  s+=fade(rows[i],rect(X[0]-10,y-48,1080,96,{fill:color,fo:.06,stroke:color,sw:2,rx:12})+`<g transform="translate(0 ${y})">${sym}</g>`
   +T(tx,X[1]+130,y+4,{size:34})+label(what,X[2]+160,y+10,{size:30,color,anchor:'middle',weight:700})+fade(units,T(u,X[3]+130,y+4,{size:34})));});
 return s;
}

export const ytUiCircuitTime2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recall']:(p)=>{
  let s=panel(140,90,560,300,label('前回：抵抗とコンデンサ',420,150,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(VC,'V_0')}=R${cs(IC,'I')}+\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,420,265,{size:56}),seg(p,0,.2));
  s+=fade(seg(p,.3,.5),rect(790,120,76,208,{fill:IC,fo:.5,stroke:IC,sw:2,rx:3})+rect(790,328,76,104,{fill:QC,fo:.55,stroke:QC,sw:2,rx:3})
   +label('抵抗 RI',880,230,{size:26,color:IC,weight:700})+label('コンデンサ q/C',880,388,{size:26,color:QC,weight:700})+label('6 V',775,285,{size:28,color:VC,anchor:'end',weight:700}));
  return s;
 },
 [K+'question']:(p)=>{
  const col=(x,sym,name,tx,g,color)=>fade(g,sym+label(name,x,300,{size:28,color:C.ink,anchor:'middle',weight:700})+T(tx,x,380,{size:44,color}));
  let s=col(250,zig(180,320,210),'抵抗',`R${cs(IC,'I')}`,seg(p,.02,.15),IC);
  s+=col(600,capSym(600,210,90)+line(520,210,578,210,{color:C.dim,w:4})+line(622,210,680,210,{color:C.dim,w:4}),'コンデンサ',`\\dfrac{${cs(QC,'q')}}{${cs(CC,'C')}}`,seg(p,.1,.25),QC);
  s+=col(950,coilSym(880,1020,212,{n:5,r:26}),'コイル','?',seg(p,.3,.45),C.hi);
  s+=highlight(840,140,220,290,seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'coil']:(p)=>{
  let s=bigCoil({I:seg(p,.3,.5),B:seg(p,.55,.85)});
  s+=fade(seg(p,.05,.2),label('コイル',430,120,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('磁場',CX2+80,CY-30,{size:26,color:BC,weight:700}));
  s+=panel(820,140,340,220,label('電流がつくる磁場の回',990,200,{size:24,color:C.dim,anchor:'middle'})+label('電流 → 中に磁場',990,260,{size:30,color:BC,anchor:'middle',weight:700}),seg(p,.5,.7));
  return s;
 },
 [K+'selfflux']:(p)=>{
  let s=bigCoil({I:1,B:1,flux:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),label('自分の巻きを 貫く',CX1-10,CY-RY-24,{size:26,color:PHI,weight:700}));
  s+=panel(820,110,340,280,label('自分の電流で',990,180,{size:28,color:IC,anchor:'middle',weight:700})+label('自分を貫く',990,240,{size:28,color:C.ink,anchor:'middle'})+label('磁束 Φ',990,300,{size:34,color:PHI,anchor:'middle',weight:700}),seg(p,.4,.6),PHI);
  return s;
 },
 // ===== S2 自分の電流の変化 =====
 [K+'const']:(p)=>{
  let s=bigCoil({I:.7,B:.7,flux:1});
  s+=panel(820,90,340,330,label('電流 一定',990,150,{size:30,color:IC,anchor:'middle',weight:700})+label('→ 磁場・磁束 一定',990,210,{size:28,color:PHI,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('磁束が 変わらない',990,285,{size:26,color:C.ink,anchor:'middle'})+label('→ 誘導は 起こらない',990,340,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25));
  return s;
 },
 [K+'change']:(p)=>{
  const u=mix(.3,1,seg(p,.05,.6));
  let s=bigCoil({I:u,B:u,flux:1});
  s+=panel(820,90,340,330,label('電流 増える',990,150,{size:30,color:IC,anchor:'middle',weight:700})+label('→ 磁束も 増える',990,210,{size:28,color:PHI,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('電磁誘導の回',990,285,{size:24,color:C.dim,anchor:'middle'})+label('→ 起電力が 生まれる',990,340,{size:28,color:VC,anchor:'middle',weight:700})),seg(p,.05,.25));
  return s;
 },
 [K+'self']:(p)=>{
  return panel(180,80,840,350,label('自己誘導',600,150,{size:40,color:C.hi,anchor:'middle',weight:700})
   +label('自分の電流の 変化',600,240,{size:32,color:IC,anchor:'middle',weight:700})+arrow(600,265,600,320,{color:C.dim,w:4,head:14})
   +label('自分に 起電力',600,370,{size:32,color:VC,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
 },
 [K+'up']:(p)=>{
  let s=bigCoil({I:mix(.4,1,seg(p,0,.9)),B:mix(.4,1,seg(p,0,.9)),flux:1});
  s+=fade(seg(p,.3,.5),arrow(560,CY-RY-40,300,CY-RY-40,{color:VC,w:6,head:18})+label('起電力：押し戻す',430,CY-RY-60,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=panel(820,140,340,220,label('レンツの法則',990,195,{size:26,color:C.dim,anchor:'middle'})+label('変化を 妨げる向き',990,250,{size:28,color:C.hi,anchor:'middle',weight:700})+label('電流 増える → 押し戻す',990,310,{size:24,color:C.ink,anchor:'middle'}),seg(p,.05,.25));
  return s;
 },
 [K+'down']:(p)=>{
  const u=mix(1,.35,seg(p,0,.9));
  let s=bigCoil({I:u,B:u,flux:1});
  s+=fade(seg(p,.2,.4),arrow(300,CY-RY-40,560,CY-RY-40,{color:VC,w:6,head:18})+label('起電力：流れ続けさせる',430,CY-RY-60,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=panel(820,140,340,220,label('電流 減る',990,195,{size:28,color:IC,anchor:'middle',weight:700})+label('→ 流れ続けさせる',990,250,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.7),label('どちらも 変化を 妨げる',990,310,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.25));
  return s;
 },
 [K+'ideal']:(p)=>{
  let s=panel(60,70,520,380,label('抵抗',320,125,{size:30,color:C.ink,anchor:'middle',weight:700})+zig(250,390,200)+line(170,200,250,200,{color:C.dim,w:4})+line(390,200,470,200,{color:C.dim,w:4})
   +arrow(180,245,280,245,{color:IC,w:5,head:14})+label('電流 一定',300,253,{size:24,color:IC})
   +label('電圧が 要り続ける',320,340,{size:28,color:VC,anchor:'middle',weight:700})+label('（RI）',320,390,{size:26,color:VC,anchor:'middle'}),seg(p,.4,.6));
  s+=panel(620,70,520,380,label('理想的なコイル',880,125,{size:30,color:C.ink,anchor:'middle',weight:700})+coilSym(810,950,202,{n:5,r:26})+line(730,200,810,200,{color:C.dim,w:4})+line(950,200,1030,200,{color:C.dim,w:4})
   +arrow(740,245,840,245,{color:IC,w:5,head:14})+label('電流 一定',860,253,{size:24,color:IC})
   +label('何も 妨げない',880,340,{size:28,color:C.hi,anchor:'middle',weight:700})+label('（電圧 0）',880,390,{size:26,color:VC,anchor:'middle'}),seg(p,.02,.2),C.hi);
  return s;
 },
 // ===== S3 インダクタンス L =====
 [K+'prop']:(p)=>{
  const A=axes({x:120,y:440,w:480,h:330,xmax:4.6,ymax:4.6,xticks:[1,2,3,4],yticks:[],grid:false,g:seg(p,.1,.3),xlabel:'電流 I',ylabel:'磁束の合計',xcolor:IC,ycolor:PHI});
  let s=A.svg+A.plot(x=>x,{from:0,to:4.2,p:seg(p,.3,.7),color:PHI,w:5});
  s+=panel(720,110,440,280,label('磁場 ∝ 電流',940,170,{size:30,color:BC,anchor:'middle',weight:700})+label('（電流がつくる磁場の回）',940,215,{size:22,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.65),label('全部の巻きを 貫く',940,285,{size:26,color:C.ink,anchor:'middle'})+label('磁束の合計 ∝ 電流',940,335,{size:30,color:PHI,anchor:'middle',weight:700})),seg(p,0,.2));
  return s;
 },
 [K+'L']:(p)=>{
  let s=panel(160,70,880,380,label('磁束の合計',600,125,{size:28,color:PHI,anchor:'middle',weight:700})
   +T(`${cs(PHI,'\\Phi')}=L\\,${cs(IC,'I')}`,600,225,{size:72})
   +fade(seg(p,.15,.35),label('L ＝ インダクタンス（定義）',600,320,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),label('巻き数や形で決まる コイルの性質',600,385,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'rate']:(p)=>{
  return panel(120,50,960,420,T(`${cs(PHI,'\\Phi')}=L\\,${cs(IC,'I')}`,600,110,{size:48})
   +fade(seg(p,.1,.3),label('1秒あたりの変化',360,195,{size:24,color:C.dim,anchor:'middle'})+T(`\\dfrac{d${cs(PHI,'\\Phi')}}{d${cs(TC,'t')}}=L\\,${dIdt}`,600,205,{size:48}))
   +fade(seg(p,.55,.75),T(`|${cs(VC,'\\mathcal{E}')}|=\\left|\\dfrac{d${cs(PHI,'\\Phi')}}{d${cs(TC,'t')}}\\right|=L\\left|${dIdt}\\right|`,600,345,{size:48})
    +label('起電力の大きさ ＝ 磁束の変化率（電磁誘導の法則）',600,440,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.1));
 },
 [K+'VL']:(p)=>{
  let s=bigCoil({I:1,B:.8,lead:true});
  s+=fade(seg(p,.05,.25),line(90,CY+RY+110,90,CY+RY+140,{color:VC,w:3})+line(770,CY+RY+110,770,CY+RY+140,{color:VC,w:3})+line(90,CY+RY+125,770,CY+RY+125,{color:VC,w:3}));
  s+=fade(seg(p,.05,.25),label('両端の電圧',430,CY+RY+160,{size:24,color:VC,anchor:'middle',weight:700}));
  s+=panel(810,90,360,320,label('理想的なコイル',990,145,{size:26,color:C.dim,anchor:'middle'})+label('両端の電圧 ＝',950,200,{size:26,color:VC,anchor:'middle'})+T(`|${cs(VC,'\\mathcal{E}')}|`,1080,196,{size:32})
   +fade(seg(p,.4,.6),T(`${cs(VC,'V')}=L\\,${dIdt}`,990,315,{size:54})+highlight(845,222,290,176,1,C.hi)),seg(p,.1,.3),VC);
  return s;
 },
 [K+'meter']:(p)=>{
  const gauge=(cx,title,sub,color,val,g)=>fade(g,ring(cx,230,110,{color:C.dim,w:3,fill:'#131f38'})+draw(Array.from({length:41},(_,i)=>{const a=Math.PI*(.95-.9*i/40);return [cx+90*Math.cos(a),230-90*Math.sin(a)];}),1,{color:C.dim,w:3})
   +line(cx,230,cx+80*Math.cos(Math.PI*(.95-.9*val)),230-80*Math.sin(Math.PI*(.95-.9*val)),{color,w:6})+dot(cx,230,8,color)
   +label(title,cx,380,{size:28,color:C.ink,anchor:'middle',weight:700})+label(sub,cx,425,{size:28,color,anchor:'middle',weight:700}));
  let s=gauge(330,'距離計','↔ 電流 I',IC,.7,seg(p,.05,.25))+gauge(870,'スピードメーター','↔ 変わる速さ dI/dt',DC,.35,seg(p,.2,.4));
  s+=fade(seg(p,.55,.75),label('コイルの電圧が 見るのは こちら',870,480,{size:26,color:C.hi,anchor:'middle',weight:700})+highlight(720,100,300,350,1,C.hi));
  return s;
 },
 [K+'unit']:(p)=>{
  return panel(120,60,960,400,label('L の単位',600,115,{size:28,color:C.dim,anchor:'middle'})
   +T(`L=\\dfrac{${cs(PHI,'\\Phi')}}{${cs(IC,'I')}}\\ \\to\\ \\dfrac{${cs(PHI,U('Wb'))}}{${cs(IC,U('A'))}}`,600,205,{size:48})
   +fade(seg(p,.3,.5),T(`1${U('Wb')}=1${U('V\\cdot s')}`,600,300,{size:40})+label('（電磁誘導の回：Wb/s ＝ V）',930,305,{size:22,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.8),T(`${U('H')}=${U('V\\cdot s/A')}`,600,395,{size:52,color:C.hi})+label('ヘンリー',850,402,{size:28,color:C.hi,weight:700})),seg(p,0,.1));
 },
 [K+'ex']:(p)=>{
  let s=bigCoil({I:mix(.3,1,lin(p,0,1)),B:mix(.3,1,lin(p,0,1)),lead:true})+terminals(1,seg(p,.5,.7));
  s+=fade(seg(p,.05,.2),label('L ＝ 0.5 H',430,120,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=panel(810,70,360,380,label('電流が 毎秒 4 A 増える',990,125,{size:26,color:IC,anchor:'middle',weight:700})
   +T(`${dIdt}=${cs(DC,'4'+U('A/s'))}`,990,205,{size:40})
   +fade(seg(p,.45,.65),T(`${cs(VC,'V')}=0.5${U('H')}\\times${cs(DC,'4'+U('A/s'))}`,990,305,{size:32})+T(`=${cs(VC,'2'+U('V'))}`,990,385,{size:46})),seg(p,.05,.2),DC);
  return s;
 },
 [K+'exunit']:(p)=>{
  const X=seg(p,.35,.6);
  let s=panel(120,90,960,340,'',seg(p,0,.12));
  s+=fade(1-X,T(`\\dfrac{\\mathrm{V}\\cdot\\mathrm{s}}{\\mathrm{A}}\\times\\dfrac{\\mathrm{A}}{\\mathrm{s}}`,480,230,{size:62}));
  s+=fade(X,T(`\\dfrac{\\mathrm{V}\\cdot{\\color{${DC}}\\cancel{\\color{${C.ink}}\\mathrm{s}}}}{{\\color{${C.hi}}\\cancel{\\color{${C.ink}}\\mathrm{A}}}}\\times\\dfrac{{\\color{${C.hi}}\\cancel{\\color{${C.ink}}\\mathrm{A}}}}{{\\color{${DC}}\\cancel{\\color{${C.ink}}\\mathrm{s}}}}`,480,230,{size:62}));
  s+=fade(seg(p,.7,.9),T(`=${cs(VC,'\\mathrm{V}')}`,820,230,{size:62}));
  s+=fade(seg(p,.4,.6),label('s と A が 消える',600,385,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 傾きを読む =====
 [K+'graph']:(p)=>{
  const {A,svg}=iGraph({g:seg(p,0,.15),p:seg(p,.15,.9)});
  let s=svg+fade(seg(p,.2,.35),label('0 → 4 A',A.X(.55)+14,A.Y(1.4),{size:22,color:IC,weight:700}))+fade(seg(p,.45,.6),label('4 A のまま',A.X(2),A.Y(4)-14,{size:22,color:IC,anchor:'middle',weight:700}))+fade(seg(p,.7,.85),label('4 → 0 A',A.X(4.2)+10,A.Y(2.4),{size:22,color:IC,weight:700}));
  s+=panel(800,90,370,300,label('コイル L ＝ 0.5 H',985,150,{size:28,color:C.ink,anchor:'middle',weight:700})+label('この電流を 流す',985,210,{size:26,color:IC,anchor:'middle'})
   +label('コイルの電圧は？',985,300,{size:30,color:VC,anchor:'middle',weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'seg1']:(p)=>{
  const {A,svg}=iGraph();
  let s=svg+segHi(0,1,seg(p,0,.15))+slopeTri(A,0,1,seg(p,.1,.3),'4 A/s')+vRow({show:[seg(p,.45,.65),0,0]});
  s+=panel(800,90,370,300,label('傾き 4 A/s',985,150,{size:30,color:DC,anchor:'middle',weight:700})+T(`0.5${U('H')}\\times${cs(DC,'4'+U('A/s'))}`,985,235,{size:34})+T(`=${cs(VC,'2'+U('V'))}`,985,315,{size:44}),seg(p,.25,.45),DC);
  return s;
 },
 [K+'predict']:(p)=>{
  const {A,svg}=iGraph();
  let s=svg+segHi(1,3,seg(p,0,.15))+vRow({show:[1,0,0]});
  s+=fade(seg(p,.2,.35),label('?',(GT(1)+GT(3))/2,405,{size:44,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(800,90,370,300,label('4 A で 一定の 2秒間',985,160,{size:28,color:IC,anchor:'middle',weight:700})+label('コイルの電圧は？',985,240,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.3),C.hi);
  return s;
 },
 [K+'seg2']:(p)=>{
  const {A,svg}=iGraph();
  let s=svg+segHi(1,3,1)+vRow({show:[1,seg(p,.1,.3),0]});
  s+=fade(seg(p,.05,.2),label('傾き 0',A.X(2),A.Y(4)+34,{size:24,color:DC,anchor:'middle',weight:700}));
  s+=panel(800,90,370,300,label('傾き 0',985,150,{size:30,color:DC,anchor:'middle',weight:700})+label('→ 電圧 0 V',985,210,{size:30,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('4 A 流れていても',985,285,{size:26,color:IC,anchor:'middle'})+label('電圧は 要らない',985,335,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),DC);
  return s;
 },
 [K+'seg3']:(p)=>{
  const {A,svg}=iGraph();
  let s=svg+segHi(3,5,seg(p,0,.15))+slopeTri(A,3,1,seg(p,.1,.3),'−2 A/s')+vRow({show:[1,1,seg(p,.45,.65)]});
  s+=panel(800,60,370,340,label('毎秒 2 A 減る',985,115,{size:28,color:DC,anchor:'middle',weight:700})+T(`0.5${U('H')}\\times${cs(DC,'2'+U('A/s'))}`,985,195,{size:34})+T(`=${cs(VC,'1'+U('V'))}`,985,270,{size:44})
   +fade(seg(p,.6,.8),label('向きは 最初と 逆',985,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.25,.45),DC);
  return s;
 },
 [K+'sign']:(p)=>{
  const one=(x0,up,g)=>{const cx1=x0+80,cx2=x0+300;let s=line(x0,260,cx1+10,260,{color:C.dim,w:4})+line(cx2-10,260,x0+380,260,{color:C.dim,w:4})+coilSym(cx1,cx2,262,{n:5,r:28});
   s+=arrow(x0+10,300,x0+110,300,{color:IC,w:up?7:4,head:15})+label(up?'電流 I 増える':'電流 I 減る',x0+190,150,{size:28,color:IC,anchor:'middle',weight:700});
   const a=up?['＋','−']:['−','＋'],c=up?[POS,NEG]:[NEG,POS];
   s+=label(a[0],cx1-10,235,{size:34,color:c[0],anchor:'middle',weight:700})+label(a[1],cx2+10,235,{size:34,color:c[1],anchor:'middle',weight:700});
   s+=label(up?'入る側が 高い':'入る側が 低い',x0+190,390,{size:28,color:VC,anchor:'middle',weight:700});
   return fade(g,s);};
  let s=one(90,true,seg(p,.02,.2))+one(690,false,seg(p,.3,.5));
  s+=fade(seg(p,.6,.8),label('妨げる向きが 入れ替わる',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'resistor']:(p)=>{
  const {A,svg}=iGraph({y:175,h:115});
  let s=svg+vRow({y:320,k:24,label0:['抵抗','0.5 Ω'],ramp:true,show:[seg(p,.2,.45)],color:IC});
  s+=vRow({y:440,k:24,label0:['コイル','0.5 H'],show:[1,1,1]});
  s+=panel(800,90,370,300,label('抵抗：V ＝ RI',985,150,{size:30,color:IC,anchor:'middle',weight:700})+T(`0.5\\,\\Omega\\times${cs(IC,'4'+U('A'))}=${cs(VC,'2'+U('V'))}`,985,230,{size:34})
   +fade(seg(p,.55,.75),label('4 A の間 ずっと 2 V',985,310,{size:26,color:C.ink,anchor:'middle'})),seg(p,.05,.2),IC);
  return s;
 },
 [K+'compare']:(p)=>{
  const {A,svg}=iGraph({y:175,h:115});
  let s=svg+vRow({y:320,k:24,label0:['抵抗','0.5 Ω'],ramp:true,color:IC})+vRow({y:440,k:24,label0:['コイル','0.5 H']});
  s+=panel(800,90,370,320,label('抵抗',985,150,{size:28,color:IC,anchor:'middle',weight:700})+label('→ グラフの 高さ',985,200,{size:30,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.3,.5),label('コイル',985,280,{size:28,color:DC,anchor:'middle',weight:700})+label('→ グラフの 傾き',985,330,{size:30,color:DC,anchor:'middle',weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'quiz']:(p)=>{
  return panel(220,80,760,350,label('確認',600,140,{size:28,color:C.dim,anchor:'middle'})
   +label('L ＝ 0.5 H のコイル',600,210,{size:32,color:C.ink,anchor:'middle',weight:700})+label('電流が 毎秒 6 A ずつ 減る',600,270,{size:32,color:DC,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),T(`|${cs(VC,'V')}|=\\;?\\;${U('V')}`,600,370,{size:52})),seg(p,0,.15),C.hi);
 },
 [K+'quizans']:(p)=>{
  return panel(220,80,760,350,label('確認',600,140,{size:28,color:C.dim,anchor:'middle'})
   +T(`|${cs(VC,'V')}|=0.5${U('H')}\\times${cs(DC,'6'+U('A/s'))}=${cs(VC,'3'+U('V'))}`,600,240,{size:46})
   +fade(seg(p,.45,.65),label('減っている → 向きは 増えるときと 逆',600,350,{size:30,color:C.hi,anchor:'middle',weight:700})),.999,C.hi);
 },
 [K+'spark']:(p)=>{
  const A=axes({x:GX,y:250,w:GW,h:170,xmax:3.2,ymax:5.2,xticks:[1,2,3],yticks:[2,4],grid:true,xlabel:'t [s]',ylabel:'',xcolor:TC,ycolor:IC});
  let s0=label('電流',GX-40,94,{size:24,color:IC,anchor:'end',weight:700})+label('I [A]',GX-40,124,{size:22,color:IC,anchor:'end'});
  let s=s0+A.svg+draw([[A.X(0),A.Y(4)],[A.X(2),A.Y(4)],[A.X(2.003),A.Y(0)],[A.X(3.1),A.Y(0)]],seg(p,.05,.4),{color:IC,w:5});
  s+=fade(seg(p,.3,.45),label('0.001 秒で 0',A.X(2)+14,A.Y(2.4),{size:24,color:DC,weight:700}));
  s+=fade(seg(p,.45,.6),line(GX-10,460,GX+GW+20,460,{color:C.dim,w:2.5})+rect(A.X(2)-3,300,8,160,{fill:VC,fo:.7,stroke:VC,sw:2,rx:2})+label('2000 V',A.X(2)+18,330,{size:26,color:VC,weight:700})+label('（途中を 省略）',A.X(2)+18,362,{size:22,color:C.dim})
   +label('コイルの',GX-24,430,{size:22,color:VC,anchor:'end',weight:700})+label('電圧',GX-24,456,{size:22,color:VC,anchor:'end',weight:700}));
  s+=panel(800,60,370,370,label('急に止める',985,115,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(`\\dfrac{${cs(IC,'4'+U('A'))}}{${cs(TC,'0.001'+U('s'))}}=${cs(DC,'4000'+U('A/s'))}`,985,210,{size:34})
   +fade(seg(p,.5,.7),T(`0.5${U('H')}\\times${cs(DC,'4000'+U('A/s'))}`,985,310,{size:30})+T(`=${cs(VC,'2000'+U('V'))}`,985,385,{size:44})),seg(p,.15,.3),DC);
  return s;
 },
 [K+'spark2']:(p)=>{
  let s=rlCircuit({I:0,sw:mix(1,0,seg(p,.1,.3)),vals:false});
  const sp=seg(p,.3,.45)*(1-seg(p,.75,.9));
  s+=fade(sp,draw([[SWB-6,CB-8],[SWB-22,CB-28],[SWB-8,CB-34],[SWB-26,CB-58]],1,{color:C.hi,w:4})+draw([[SWB+4,CB-10],[SWB+18,CB-34],[SWB+2,CB-40],[SWB+14,CB-62]],1,{color:C.hi,w:4})+ring(SWB-8,CB-20,26,{color:C.hi,w:2,dash:'4 4'}));
  s+=panel(700,130,460,240,label('スイッチを 切る',930,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 電流が 急に止まる',930,250,{size:28,color:IC,anchor:'middle'})+label('→ 大きな電圧で 火花',930,310,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.4),C.hi);
  return s;
 },
 // ===== S5 三つの部品 =====
 [K+'tableR']:(p)=>table({rows:[seg(p,.2,.4),0,0],g:seg(p,0,.15)}),
 [K+'tableCL']:(p)=>table({rows:[1,seg(p,.02,.2),seg(p,.45,.65)]}),
 [K+'units']:(p)=>table({units:seg(p,.05,.3)}),
 [K+'rl']:(p)=>{
  let s=rlCircuit({I:0,sw:0,g:seg(p,0,.2)});
  s+=highlight(LA-14,CT-76,LB-LA+28,112,seg(p,.1,.3),C.hi);
  s+=panel(700,90,460,330,label('電池',760,160,{size:28,color:C.dim})+label('6 V',1100,160,{size:30,color:VC,anchor:'end',weight:700})
   +label('抵抗',760,240,{size:28,color:C.dim})+label('3 Ω',1100,240,{size:30,color:C.ink,anchor:'end',weight:700})
   +label('コイル',760,320,{size:28,color:C.dim})+label('0.5 H',1100,320,{size:30,color:C.ink,anchor:'end',weight:700})
   +label('（コンデンサの代わり）',930,385,{size:22,color:C.dim,anchor:'middle'}),seg(p,.15,.3));
  return s;
 },
 [K+'rlstart']:(p)=>{
  let s=rlCircuit({I:0,sw:1})+vbr(RA,RB,CT+62,cs(VC,'0'+U('V')),IC,seg(p,.05,.2))+vbr(LA,LB,CT+62,cs(VC,'6'+U('V')),DC,seg(p,.3,.45));
  s+=bar2(6,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.55,.75),panel(640,20,540,90,T(`${dIdt}=\\dfrac{${cs(VC,'6'+U('V'))}}{0.5${U('H')}}=${cs(DC,'12'+U('A/s'))}`,910,72,{size:30}),1,DC));
  return s;
 },
 [K+'rlmid']:(p)=>{
  const v=mix(6,3,seg(p,.05,.35));
  let s=rlCircuit({I:.6,sw:1})+vbr(RA,RB,CT+62,cs(VC,f1(6-v)+U('V')),IC)+vbr(LA,LB,CT+62,cs(VC,f1(v)+U('V')),DC);
  s+=bar2(v);
  s+=fade(seg(p,.05,.2),label('電流 1 A',CR-30,CT+220,{size:24,color:IC,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.7),panel(640,20,540,90,T(`${dIdt}=\\dfrac{${cs(VC,'3'+U('V'))}}{0.5${U('H')}}=${cs(DC,'6'+U('A/s'))}`,910,72,{size:30}),1,DC));
  return s;
 },
 [K+'rlend']:(p)=>{
  const Irl=t=>2*(1-Math.exp(-6*t));
  const A=axes({x:110,y:440,w:540,h:330,xmax:1.15,ymax:2.6,xticks:[0.2,0.4,0.6,0.8,1],yticks:[1,2],grid:true,g:seg(p,0,.15),xlabel:'t [s]',ylabel:'電流 I [A]',xcolor:TC,ycolor:IC});
  let s=A.svg+A.plot(Irl,{from:0,to:1.1,p:seg(p,.1,.6),color:IC,w:5})+fade(seg(p,.3,.5),line(A.X(0),A.Y(2),A.X(1.12),A.Y(2),{color:IC,w:2.5,dash:'10 8'}));
  s+=fade(seg(p,.1,.25),draw([[A.X(0),A.Y(0)],[A.X(0.15),A.Y(12*0.15)]],1,{color:DC,w:3})+label('12 A/s',A.X(.15)+10,A.Y(1.8)+4,{size:22,color:DC,weight:700}));
  s+=panel(730,110,430,280,T(`\\dfrac{${cs(VC,'6'+U('V'))}}{3\\,\\Omega}=${cs(IC,'2'+U('A'))}`,945,190,{size:40})+label('に 近づく',945,265,{size:28,color:IC,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),label('前回の 電荷のグラフと',945,320,{size:24,color:C.dim,anchor:'middle'})+label('同じく 寝ていく',945,360,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.2,.4),IC);
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  const col=(x,title,color,body,g)=>card(x,90,340,330,label(title,x+170,145,{size:28,color,anchor:'middle',weight:700})+body,g,color);
  let s=col(60,'実験の法則',C.hi,label('電磁誘導の法則',230,225,{size:26,color:C.ink,anchor:'middle'})+label('ファラデー・レンツ',230,275,{size:26,color:C.ink,anchor:'middle'})+label('→ 自己誘導',230,340,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=col(430,'定義',PHI,T(`${cs(PHI,'\\Phi')}=L\\,${cs(IC,'I')}`,600,255,{size:48})+label('L：インダクタンス',600,340,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=col(800,'導いた結果',VC,T(`${cs(VC,'V')}=L\\,${dIdt}`,970,255,{size:44})+label('理想的なコイル',970,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'summary2']:(p)=>{
  const {A,svg}=iGraph();
  let s=svg+vRow({show:[1,1,1]});
  s+=panel(800,110,370,260,label('一定の電流',985,170,{size:28,color:IC,anchor:'middle',weight:700})+label('→ 電圧 0',985,220,{size:28,color:VC,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('電流の 変化',985,290,{size:28,color:DC,anchor:'middle',weight:700})+label('にだけ 応じる',985,340,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ac']:(p)=>{
  const A=axes({x:110,y:270,w:600,h:180,xmin:0,xmax:4.3,ymin:-2.2,ymax:2.2,xticks:[],yticks:[],grid:false,g:seg(p,0,.15),xlabel:'t',ylabel:'電流 I',xcolor:TC,ycolor:IC});
  let s=A.svg+A.plot(t=>2*Math.sin(2*Math.PI*t/2),{from:0,to:4.1,p:seg(p,.15,.7),color:IC,w:5,steps:300});
  s+=fade(seg(p,.4,.6),label('＋ 向き',A.X(.5),A.Y(2)-14,{size:24,color:IC,anchor:'middle',weight:700})+label('逆向き',A.X(1.5),A.Y(-2)+36,{size:24,color:IC,anchor:'middle',weight:700}));
  s+=panel(800,120,370,260,label('向きが 周期的に',985,190,{size:28,color:C.ink,anchor:'middle'})+label('入れ替わる電流',985,240,{size:28,color:IC,anchor:'middle',weight:700})
   +label('＝ 交流',985,310,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  const A=axes({x:110,y:240,w:600,h:140,xmin:0,xmax:4.3,ymin:-2.2,ymax:2.2,xticks:[],yticks:[],grid:false,xlabel:'t',ylabel:'電流 I',xcolor:TC,ycolor:IC});
  let s=A.svg+A.plot(t=>2*Math.sin(2*Math.PI*t/2),{from:0,to:4.1,color:IC,w:4,steps:300});
  s+=fade(seg(p,.1,.3),line(A.X(0.5),A.Y(2)-10,A.X(0.5),A.Y(-2.2),{color:TC,w:2,dash:'6 6'})+line(A.X(2.5),A.Y(2)-10,A.X(2.5),A.Y(-2.2),{color:TC,w:2,dash:'6 6'})+label('周期？',A.X(1.5),A.Y(2.2)-8,{size:24,color:TC,anchor:'middle',weight:700}));
  const sh=mix(0,1.6,lin(p,.3,1));
  s+=fade(seg(p,.3,.45),draw(Array.from({length:200},(_,i)=>{const x=i/199*4.2;return [110+620*x/4.3,400-50*Math.sin(2*Math.PI*(x-sh)/1.4)];}),1,{color:C.x,w:4})+label('空間を 伝わる波',110,470,{size:24,color:C.x,weight:700}));
  s+=panel(800,110,370,280,label('次の問い',985,165,{size:26,color:C.dim,anchor:'middle'})+label('交流の 周期・位相',985,230,{size:28,color:C.ink,anchor:'middle'})+label('空間を 伝わる波',985,280,{size:28,color:C.ink,anchor:'middle'})
   +label('どう読む？',985,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
};
