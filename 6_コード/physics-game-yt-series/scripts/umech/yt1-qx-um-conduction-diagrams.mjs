// 問題編 解説「2 mm² の銅線と、直列の3つの抵抗」（q-um-conduction、大学編 24 電流・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/24_電流.md の q-um-conduction（解説 19 行）。
// 配置：前半は左（x＜640）に銅線、右（x 660〜1180）に式の枠。後半は左に回路図、右に電位の階段のグラフ。札の帯（y＜78）には図を描かない。
// 色（正本）：電流 I 緑、電荷 e 桃、時間 Δt・断面 S 金、電子 青、𝐄・合図 水色、電子の速度 v 紫、電圧 紫、R 黄。n は白。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,wrongCard,sentWin,cueT,tAt,durOf} from './yt1-qx-common.mjs';

const K='qx-um-conduction:';
const NEG='#7fb3ff',EC=C.x,QCOL=C.p,TC=C.t,IC=C.F,VC=C.v,RC=C.hi,BAD='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,color:C.ink,...o});
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const U=s=>`\\,\\mathrm{${s}}`;
const e_=cs(QCOL,'e'),n_=cs(C.ink,'n'),S_=cs(TC,'S'),v_=cs(VC,'v'),Dt=cs(TC,'\\Delta t'),I_=cs(IC,'I');
const PX=660,PW=520,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const G1='ドリフト速度 v',G2='3 Ω の両端の電圧',G3='電圧の和が 12 V になる理由';
const ANS1=g=>answerTag(1,'D','1.25×10⁻⁴ m/s',{g}),ANS2=g=>answerTag(2,'B','6 V',{g}),ANS3=g=>answerTag(3,'D','',{g});

// ---- 前半：銅線 ---------------------------------------------------------------------------------
const WX1=60,WX2=620,WY=300,HH=55,GX=400,LC=160;
function wire(g=1){
 return fade(g,rect(WX1,WY-HH,WX2-WX1,2*HH,{fill:'#b87a4a',fo:.14,stroke:'#c89060',sw:2.5,rx:10})
  +`<ellipse cx="${WX1}" cy="${WY}" rx="16" ry="${HH}" fill="#2a1a10" stroke="#c89060" stroke-width="2.5"/>`
  +`<path d="M${WX2} ${WY-HH} a16 ${HH} 0 0 1 0 ${2*HH}" fill="none" stroke="#c89060" stroke-width="2.5"/>`);
}
const section=(g=1,glow=0)=>fade(g,`<ellipse cx="${GX}" cy="${WY}" rx="18" ry="${HH+4}" fill="${TC}" fill-opacity="${.14+.2*glow}" stroke="${TC}" stroke-width="${3.5+2*glow}"/>`);
// 電子（決まった散らばり）。shift＞0 で左へずれる（端で回り込む）。mark：円柱の中にいた電子に黄の輪
const EL=Array.from({length:30},(_,i)=>{const r=Math.abs(Math.sin(i*12.9898+3.1)*43758.5453)%1,q=Math.abs(Math.sin(i*78.233+1.7)*12345.678)%1;return [WX1+30+(i+r*.8)*(WX2-WX1-60)/30,WY-HH+16+q*(2*HH-32)];});
function electrons(shift=0,{g=1,mark=0,markShift=0}={}){
 const L=WX2-WX1-60;let s='';
 for(const [x0,y] of EL){
  const x=WX1+30+((((x0-WX1-30)-shift)%L)+L)%L;
  s+=dot(x,y,8,NEG)+ring(x,y,8,{color:'#c8dcff',w:1.5});
  const xm=WX1+30+((((x0-WX1-30)-markShift)%L)+L)%L;
  if(mark&&xm>GX+4&&xm<GX+LC-4)s+=fade(mark,ring(x,y,13,{color:C.hi,w:2.5}));
 }
 return fade(g,s);
}
const iArrow=(g=1)=>fade(g,arrow(90,215,260,215,{color:IC,w:6,head:18})+label('I ＝ 3.4 A',175,192,{size:30,color:IC,weight:700,anchor:'middle'}));
const sLabel=(g=1,txt='S ＝ 2 mm²')=>fade(g,label(txt,GX+30,WY+HH+40,{size:28,color:TC,weight:700,anchor:'middle'}));
function cylinder(g=1,{len=LC}={}){
 return fade(g,`<ellipse cx="${GX+len}" cy="${WY}" rx="16" ry="${HH-4}" fill="none" stroke="${TC}" stroke-width="3" stroke-dasharray="7 5"/>`
  +line(GX,WY-HH+4,GX+len,WY-HH+4,{color:TC,w:3,dash:'7 5'})+line(GX,WY+HH-4,GX+len,WY+HH-4,{color:TC,w:3,dash:'7 5'}));
}

// ---- 後半：回路と電位の階段 ----------------------------------------------------------------------
const CLx=90,CRx=470,CTy=130,CBy=440,BYc=285;
const R1=[220,340],R2=[230,350],R3=[220,340];
function circuit({g=1,cur=0,glow=0,hl3=0,vals=0}={}){
 let s='';const w={color:C.dim,w:4};
 s+=line(CLx,CTy,CLx,BYc-12,w)+line(CLx,BYc+12,CLx,CBy,w);
 s+=line(CLx,CTy,R1[0],CTy,w)+line(R1[1],CTy,CRx,CTy,w);
 s+=line(CRx,CTy,CRx,R2[0],w)+line(CRx,R2[1],CRx,CBy,w);
 s+=line(CRx,CBy,R3[1],CBy,w)+line(R3[0],CBy,CLx,CBy,w);
 // 電池（上が＋）
 s+=line(CLx-34,BYc-12,CLx+34,BYc-12,{color:C.ink,w:4})+line(CLx-18,BYc+12,CLx+18,BYc+12,{color:C.ink,w:9});
 s+=label('＋',CLx+44,BYc-4,{size:24,color:C.a,weight:700})+label('12 V',CLx+30,BYc+42,{size:28,color:VC,weight:700});
 // 抵抗（黄の箱）
 s+=rect(R1[0],CTy-18,R1[1]-R1[0],36,{fill:'#2a2610',fo:1,stroke:RC,sw:3,rx:4})+label('1 Ω',(R1[0]+R1[1])/2,CTy-30,{size:28,color:RC,anchor:'middle',weight:700});
 s+=rect(CRx-18,R2[0],36,R2[1]-R2[0],{fill:'#2a2610',fo:1,stroke:RC,sw:3,rx:4})+label('2 Ω',CRx+30,(R2[0]+R2[1])/2+10,{size:28,color:RC,weight:700});
 s+=rect(R3[0],CBy-18,R3[1]-R3[0],36,{fill:'#2a2610',fo:1,stroke:RC,sw:3,rx:4})+label('3 Ω',(R3[0]+R3[1])/2,CBy+50,{size:28,color:RC,anchor:'middle',weight:700});
 if(hl3)s+=fade(hl3,highlight(R3[0]-14,CBy-32,R3[1]-R3[0]+28,64,1,C.hi));
 if(vals)s+=fade(vals,label('2 V',(R1[0]+R1[1])/2,CTy+50,{size:24,color:VC,anchor:'middle',weight:700})+label('4 V',CRx-30,(R2[0]+R2[1])/2+8,{size:24,color:VC,anchor:'end',weight:700})
  +label('6 V',(R3[0]+R3[1])/2,CBy-34,{size:24,color:VC,anchor:'middle',weight:700}));
 if(cur){const ww=6+3*glow,col=IC;
  s+=fade(cur,arrow(120,CTy,190,CTy,{color:col,w:ww,head:18})+arrow(CRx,370,CRx,425,{color:col,w:ww,head:18})+arrow(200,CBy,130,CBy,{color:col,w:ww,head:18})
   +label('I',155,CTy+36,{size:28,color:col,weight:700,anchor:'middle'})+label('I',CRx-24,405,{size:28,color:col,weight:700,anchor:'end'})+label('I',165,CBy-26,{size:28,color:col,weight:700,anchor:'middle'}));
  if(glow)s+=fade(glow*.6,ring(155,CTy,44,{color:C.hi,w:3})+ring(CRx,398,44,{color:C.hi,w:3})+ring(165,CBy,44,{color:C.hi,w:3}));}
 return fade(g,s);
}
// 回路を一周する点（u＝0〜1、電池の＋から時計回り）
const LOOP=[[CLx,BYc-12],[CLx,CTy],[CRx,CTy],[CRx,CBy],[CLx,CBy],[CLx,BYc+12]];
function along(pts,f){let L=0;const d=[];for(let i=1;i<pts.length;i++){const q=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(q);L+=q;}
 let w=L*clamp(f);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}return pts.at(-1);}
// 電位のグラフ：横軸＝一周の道のり（電池 → 1 Ω → 2 Ω → 3 Ω → 電池）
const GX0=610,GX1=1150,GY0=360,GSC=19.2;
const gx=u=>GX0+(GX1-GX0)*u,gy=V=>GY0-GSC*V;
const SEG=[['電池',0,.08,0,12],['1 Ω',.25,.35,12,10],['2 Ω',.5,.6,10,6],['3 Ω',.75,.85,6,0]];
function Vat(u){if(u<=.08)return 12*u/.08;if(u<.25)return 12;if(u<.35)return 12-2*(u-.25)/.1;if(u<.5)return 10;if(u<.6)return 10-4*(u-.5)/.1;if(u<.75)return 6;if(u<.85)return 6-6*(u-.75)/.1;return 0;}
function graph({g=1,upto=0,drops=0,vals=0,hl6=0,segLab=1,axisLab=1,dotU=null}={}){
 let s=arrow(GX0-10,GY0,GX1+30,GY0,{color:C.dim,w:2.5,head:14})+arrow(GX0,GY0+10,GX0,gy(12)-40,{color:C.dim,w:2.5,head:14});
 s+=label('電位',GX0,gy(12)-52,{size:24,color:VC,anchor:'middle',weight:700})+label('0',GX0-14,GY0+8,{size:22,color:C.dim,anchor:'end'});
 if(axisLab)s+=label('回路を 一周する 道のり →',(GX0+GX1)/2,GY0+62,{size:22,color:C.dim,anchor:'middle'});
 if(segLab)s+=SEG.map(([t,a,b])=>label(t,gx((a+b)/2),GY0+30,{size:22,color:t==='電池'?VC:RC,anchor:'middle',weight:700})).join('');
 if(upto>0){const N=200,pts=[];for(let i=0;i<=N*upto;i++){const u=i/N;pts.push([gx(u),gy(Vat(u))]);}s+=draw(pts,1,{color:VC,w:5});}
 if(upto>.08)s+=label('12 V',gx(.04)-14,gy(12)+4,{size:24,color:VC,anchor:'end',weight:700});
 const lab=(k,txt,col)=>{const [,a,b,v0,v1]=SEG[k];return label(txt,gx(b)+10,gy((v0+v1)/2)+8,{size:24,color:col,weight:700});};
 [[1,'1I'],[2,'2I'],[3,'3I']].forEach(([k,t])=>{if(upto>SEG[k][2]-.02)s+=fade(drops*(1-vals),lab(k,t,RC));});
 [[1,'2 V'],[2,'4 V'],[3,'6 V']].forEach(([k,t])=>{s+=fade(vals,lab(k,t,k===3&&hl6?C.hi:VC));});
 if(hl6)s+=fade(hl6,highlight(gx(.73),gy(6)-10,gx(.87)-gx(.73)+70,GSC*6+20,1,C.hi));
 if(dotU!==null)s+=dot(gx(dotU),gy(Vat(dotU)),10,C.hi);
 return fade(g,s);
}

// ---- 合図の場面（行8）---------------------------------------------------------------------------
function signalScene(t){
 const y=200,x1=110,x2=1090,ts=.8,front=clamp((t-ts)/.6)*(x2-x1);
 let s=line(x1,y-24,x2,y-24,{color:'#c89060',w:3})+line(x1,y+24,x2,y+24,{color:'#c89060',w:3});
 // 電池とスイッチ（左端）、電球（右端）
 s+=line(60,y-30,60,y+30,{color:C.ink,w:4})+line(78,y-16,78,y+16,{color:C.ink,w:8})+label('電池',69,y+66,{size:22,color:C.dim,anchor:'middle'});
 const on=t>ts;s+=line(84,y,x1,on?y:y-22,{color:C.ink,w:4})+label('スイッチ',100,y-50,{size:22,color:C.dim,anchor:'middle'});
 const lit=front>=x2-x1-1;
 s+=ring(x2+40,y,26,{color:lit?C.hi:C.dim,w:3,fill:lit?'#5a4a10':'none'})+(lit?fade(.5,ring(x2+40,y,40,{color:C.hi,w:3})):'')+label('電球',x2+40,y+66,{size:22,color:C.dim,anchor:'middle'});
 if(front>0&&!lit)s+=rect(x1+front-14,y-26,28,52,{fill:EC,fo:.5,stroke:EC,sw:2,rx:6});
 if(front>0)s+=rect(x1,y-22,front,44,{fill:EC,fo:.10,stroke:'none',rx:0});
 if(front>0&&front<x2-x1)s+=label('合図の 前線',x1+front,y-40,{size:24,color:EC,anchor:'middle',weight:700});
 for(let i=0;i<24;i++){const x0=x1+20+i*40;const moving=front>x0-x1;s+=dot(x0-(moving?3*Math.sin((t-ts)*9+i):0),y+(i%2?10:-10),7,NEG);}
 // 拡大：1 秒で 約 0.13 mm（実際の大きさを拡大して描く）
 const te=clamp(t-ts-.6,0,1);
 let z=rect(300,300,600,170,{fill:'#0e1830',fo:.98,stroke:C.dim,sw:2,rx:10})+label('拡大',890,330,{size:22,color:C.dim,anchor:'end'});
 z+=line(380,420,820,420,{color:C.dim,w:2})+line(380,408,380,432,{color:C.dim,w:3})+line(820,408,820,432,{color:C.dim,w:3});
 z+=label('0',380,458,{size:22,color:C.dim,anchor:'middle'})+label('約 0.13 mm',820,458,{size:24,color:VC,anchor:'middle',weight:700});
 z+=dot(mix(380,820,te),380,12,NEG)+ring(mix(380,820,te),380,12,{color:'#c8dcff',w:2});
 z+=label(`電子の 動き ${te.toFixed(1)} 秒`,400,340,{size:24,color:C.ink});
 s+=fade(seg(t,ts+.5,ts+.9),z);
 return s;
}

export const ytQxUmConductionDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（3 秒）：銅線・金の断面「S＝2 mm²」・「I＝3.4 A」・自由電子（動かさない）。円柱・速さは出さない。
 [K+'q1']:(p)=>`<g transform="translate(270 0)">${wire(seg(p,0,.25))+electrons(0,{g:seg(p,.15,.45)})+section(seg(p,.3,.55))+sLabel(seg(p,.4,.65))+iArrow(seg(p,.55,.85))}</g>`,
 // 小問2（3 秒）：暗転からの回路図（12 V、1 Ω・2 Ω・3 Ω 直列）。電流・電位は出さない。
 [K+'q2']:(p)=>`<g transform="translate(330 0)">${circuit({g:seg(p,.15,.7)})}</g>`,

 // ===================== 小問1 =====================
 [K+'intro']:(p)=>wire()+electrons(0)+section(seg(p,.05,.2),seg(p,.1,.3)*(1-seg(p,.4,.6)))+sLabel(seg(p,.1,.25))+iArrow(seg(p,.35,.55)),
 // 2. 電子の粒がゆっくり一方向（左）へずれ始める
 [K+'goal1']:(p,ctx)=>{
  const t=cueT(ctx);
  return wire()+electrons(18*Math.max(0,t-.8))+section()+sLabel()+iArrow()+fade(seg(p,.3,.45),arrow(560,420,420,420,{color:VC,w:5,head:16})+label('電子の ずれ',575,428,{size:24,color:VC,weight:700}))+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 3. 記号を図に（n・S）→ 円柱 vΔt → 印の付いた電子が全部断面を抜ける
 [K+'cyl']:(p,ctx)=>{
  const base=18*Math.max(0,durOf(ctx,K+'goal1')-.8);
  const u=seg(p,.55,.95);
  let s=wire()+section()+iArrow();
  s+=electrons(base+LC*u,{mark:seg(p,.45,.55),markShift:base});
  s+=fade(seg(p,.05,.15),label('n ＝ 1 m³ あたりの 自由電子の 数',WX1,WY+HH+40,{size:24,color:C.ink,weight:700}));
  s+=fade(seg(p,.15,.25),label('S ＝ 断面積',GX,WY-HH-20,{size:26,color:TC,weight:700,anchor:'middle'}));
  s+=cylinder(seg(p,.3,.42));
  s+=fade(seg(p,.35,.45),line(GX,WY+HH+70,GX+LC,WY+HH+70,{color:VC,w:3})+line(GX,WY+HH+60,GX,WY+HH+80,{color:VC,w:3})+line(GX+LC,WY+HH+60,GX+LC,WY+HH+80,{color:VC,w:3})
   +label('vΔt ＝ Δt の間に 電子が 進む 長さ',GX+LC+18,WY+HH+78,{size:24,color:VC,weight:700}));
  return s+goalTag(G1);
 },
 // 3b. 数と電荷の式を一行ずつ
 [K+'cyl2']:(p,ctx)=>{ // ctx を使う
  const base=18*Math.max(0,durOf(ctx,K+'goal1')-.8);
  let s=wire()+section()+iArrow()+electrons(base+LC,{mark:1,markShift:base})+cylinder(1);
  s+=line(GX,WY+HH+30,GX+LC,WY+HH+30,{color:VC,w:3})+line(GX,WY+HH+20,GX,WY+HH+40,{color:VC,w:3})+line(GX+LC,WY+HH+20,GX+LC,WY+HH+40,{color:VC,w:3})+label('vΔt',GX+LC/2,WY+HH+70,{size:26,color:VC,weight:700,anchor:'middle'});
  s+=label('S ＝ 断面積',GX,WY-HH-20,{size:26,color:TC,weight:700,anchor:'middle'});
  s+=panel(95,330,label('Δt の間に 断面を 通る',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.18),label('数',PX+50,232,{size:28,color:C.ink,weight:700})+T(`${n_}${S_}${v_}${Dt}`,PC+30,222,44))
   +fade(seg(p,.45,.58),label('電荷',PX+40,347,{size:28,color:QCOL,weight:700})+T(`${e_}${n_}${S_}${v_}${Dt}`,PC+30,337,44)),1,C.faint);
  return s+goalTag(G1);
 },
 // 4. Δt で割る（打ち消し線）→ I＝enSv → v＝I/(enS)
 [K+'solve']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cn=seg(p,.18,.26);
  const dt=cn>.5?`{\\color{${BAD}}\\cancel{${Dt}}}`:Dt;
  let s=label('電流 ＝ 1秒 あたりの 電荷',600,112,{size:28,color:C.dim,anchor:'middle'});
  s+=T(`${I_}=\\dfrac{${e_}${n_}${S_}${v_}${dt}}{${dt}}`,470,240,52);
  s+=fade(seg(p,.28,.38),T(`=${e_}${n_}${S_}${v_}`,750,242,52));
  s+=fade(seg(p,b,b+.08),arrow(600,318,600,352,{color:C.dim,w:3,head:12})+label('v について 解く',620,342,{size:24,color:C.dim}));
  s+=fade(seg(p,b+.1,b+.2),T(`${v_}=\\dfrac{${I_}}{${e_}${n_}${S_}}`,600,432,56)+highlight(480,352,240,150,1,VC));
  return s+goalTag(G1);
 },
 // 5. 面積の換算（1 mm 四方の図）→ enS の計算を一行ずつ
 [K+'area']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,cA=1-seg(p,b-.03,b+.02),cB=seg(p,b,b+.05);
  let a=rect(120,150,220,220,{fill:TC,fo:.12,stroke:TC,sw:3,rx:2})+label('1 mm',230,140,{size:26,color:TC,anchor:'middle',weight:700})+label('1 mm',350,268,{size:26,color:TC,weight:700})
   +label('（1 mm 四方）',230,410,{size:24,color:C.dim,anchor:'middle'});
  a+=panel(110,300,label('1 mm ＝ 10⁻³ m',PC,175,{size:32,color:C.ink,anchor:'middle',weight:700})
   +label('1 mm² ＝ 10⁻⁶ m²',PC,245,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.12,.25),line(PX+40,280,PX+PW-40,280,{color:C.faint,w:2})+label('2 mm² ＝ 2×10⁻⁶ m²',PC,340,{size:34,color:TC,anchor:'middle',weight:700})),1,C.hi);
  a=fade(seg(p,0,.06),a+highlight(PX+70,210,PW-140,50,seg(p,.04,.12),C.hi));
  let s=fade(cA,a);
  let q=label('S ＝ 2×10⁻⁶ m²',600,130,{size:26,color:TC,anchor:'middle'});
  q+=fade(seg(p,b+.05,b+.15),T(`${e_}${n_}${S_}=1.6\\times10^{-19}\\times8.5\\times10^{28}\\times2\\times10^{-6}`,600,230,40));
  q+=fade(seg(p,b+.35,b+.45),T(`=2.72\\times10^{4}${U('C/m')}`,600,330,46));
  s+=fade(cB,q);
  return s+goalTag(G1);
 },
 // 6. v＝3.4÷(2.72×10⁴)＝1.25×10⁻⁴ m/s（紫）。2文目で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=T(`${v_}=\\dfrac{${I_}}{${e_}${n_}${S_}}`,600,150,44);
  s+=fade(seg(p,.05,.18),T(`=\\dfrac{3.4}{2.72\\times10^{4}}`,600,265,44));
  s+=fade(seg(p,.3,.42),T(cs(VC,`=1.25\\times10^{-4}${U('m/s')}`),600,380,48));
  return s+goalTag(G1)+ANS1(seg(p,b,b+.08));
 },
 // 7. 誤答 A・C（1文目）→ B（2文目）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  let s=T(cs(VC,`${v_}=1.25\\times10^{-4}${U('m/s')}`),600,170,42);
  s+=wrongSeq(p,ctx,[['A','1.25×10⁻⁷ m/s','1 mm² ＝ 10⁻³ m² と 換算した'],['C','2.0×10⁻²³','e を 掛け忘れた（単位 C·m/s）'],['B','3×10⁸ m/s','真空中の 光の 速さ（電子の 速さでは ない）']],{win:w,opts:{y:270}});
  return s+goalTag(G1)+ANS1(1);
 },
 // 8. 合図の前線が導線を一気に進み、届いた所の電子がその場で動き出す。1 秒で約 0.13 mm
 [K+'signal']:(p,ctx)=>signalScene(cueT(ctx))+goalTag(G1)+ANS1(1),

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>circuit({g:seg(p,0,.15),hl3:seg(p,.4,.55)})+goalTag(G2,{g:seg(p,.03,.15)}),
 // 10. 電流は同じ I（3か所）。2文目でグラフの枠
 [K+'same']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  return circuit({cur:seg(p,.05,.2),hl3:1})+graph({g:seg(p,b,b+.12)})+goalTag(G2);
 },
 // 11. 電池で 12 V 上がり、抵抗ごとに I・2I・3I ずつ下がる（光の点が一周）
 [K+'loop']:(p)=>{
  const u=seg(p,.05,.9),[dx,dy]=along(LOOP,u);
  return circuit({cur:1,hl3:1})+dot(dx,dy,11,C.hi)+graph({upto:u,drops:1,dotU:u})+goalTag(G2);
 },
 // 11b. 一周で元の高さ → 12−1I−2I−3I＝0（黄）
 [K+'loop2']:(p)=>{
  let s=circuit({cur:1,hl3:1})+graph({upto:1,drops:1,axisLab:0});
  s+=fade(seg(p,.2,.35),T(cs(C.hi,`12-1${I_}-2${I_}-3${I_}=0`),(GX0+GX1)/2,470,38));
  return s+goalTag(G2);
 },
 // 12. I＝12÷6＝2 A、段に 2・4・6 V、6 V の段を黄で。2文目で答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=circuit({cur:1,hl3:1,vals:seg(p,b,b+.1)})+graph({upto:1,drops:1,vals:seg(p,.2,.32),hl6:seg(p,b+.05,b+.15),axisLab:0});
  s+=fade(1-seg(p,.02,.08),T(cs(C.hi,`12-1${I_}-2${I_}-3${I_}=0`),(GX0+GX1)/2,470,38));
  s+=fade(seg(p,.06,.15),T(`${I_}=\\dfrac{12}{6}=2${U('A')}`,(GX0+GX1)/2,470,36,{color:IC}));
  return s+goalTag(G2)+ANS2(seg(p,b+.1,b+.18));
 },
 // 13. 誤答 A・C（1文目）→ D（2文目）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.5,w=[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]];
  let s=circuit({cur:1,hl3:1,vals:1})+graph({upto:1,vals:1,hl6:1,axisLab:0,segLab:0});
  s+=wrongSeq(p,ctx,[['A','12 V','電池の 電圧が そのまま かかると 考えた'],['C','4 V','12 V を 3等分した'],['D','2 V','電流の 値と 取り違えた']],{win:w,opts:{x:560,w:620,y:395}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>circuit({cur:1,vals:1})+graph({upto:1,vals:1})+goalTag(G3,{g:seg(p,.03,.15)}),
 // 15. 3段を取り出して積み上げ、電池の 12 V とそろえる
 [K+'stack']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=circuit({cur:1,vals:1})+fade(1-seg(p,.02,.1),graph({upto:1,vals:1}));
  const base=GY0,x1=720,x2=960,bw=110;
  let q=line(GX0,base,GX1,base,{color:C.dim,w:2.5});
  q+=rect(x1,gy(12),bw,GSC*12,{fill:VC,fo:.3,stroke:VC,sw:3,rx:4})+label('電池 12 V',x1+bw/2,base+34,{size:24,color:VC,anchor:'middle',weight:700});
  const parts=[[0,2,'2 V',seg(p,.1,.2)],[2,4,'4 V',seg(p,.2,.3)],[6,6,'6 V',seg(p,.3,.4)]];
  for(const [v0,dv,t,g] of parts)q+=fade(g,rect(x2,gy(v0+dv),bw,GSC*dv,{fill:RC,fo:.22,stroke:RC,sw:3,rx:3})+label(t,x2+bw+14,gy(v0+dv/2)+8,{size:24,color:RC,weight:700}));
  q+=label('抵抗の 電圧',x2+bw/2,base+34,{size:24,color:RC,anchor:'middle',weight:700});
  q+=fade(seg(p,.4,.5),label('2＋4＋6 ＝ 12 V',x2+bw/2,gy(12)-40,{size:28,color:C.ink,anchor:'middle',weight:700}));
  q+=fade(seg(p,b,b+.1),line(x1-20,gy(12),x2+bw+20,gy(12),{color:C.hi,w:3,dash:'8 6'})+label('同じ 高さ',x1+bw/2,gy(12)-40,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.12),q);
  return s+goalTag(G3);
 },
 // 16. 光の点が回路を一周、グラフも元の高さへ。∮𝐄·d𝐫＝0 のカード。2文目で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.65,u=seg(p,.03,b-.05),[dx,dy]=along(LOOP,u);
  let s=circuit({cur:1,vals:1})+dot(dx,dy,11,C.hi)+graph({upto:1,vals:1,axisLab:0,dotU:u});
  s+=fade(seg(p,b-.12,b-.04),card(700,398,360,100,T(`\\oint${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{r}=0`,880,452,32),1,C.hi));
  return s+goalTag(G3)+ANS3(seg(p,b,b+.08));
 },
 // 17. 「第1法則（分岐点）」に ×、誤答 A → B
 [K+'wrongAB']:(p,ctx)=>{
  const W=sentWin(ctx),gA=seg(p,.02,.08)*(1-seg(p,W[0][1]-.04,W[0][1]));
  let s=circuit({cur:1,vals:1});
  s+=fade(gA,card(640,100,520,130,label('第1法則（分岐点）',900,150,{size:28,color:IC,anchor:'middle',weight:700})
   +label('入る 電流 ＝ 出る 電流',900,198,{size:26,color:C.ink,anchor:'middle'}),1,IC)
   +line(660,110,1140,220,{color:BAD,w:5})+line(1140,110,660,220,{color:BAD,w:5}));
  s+=wrongSeq(p,ctx,[['A','分岐点の 理由','第1法則（電荷の 保存）の 理由'],['B','電子が 旅する',['電子の 一周を 待たず、各場所の 電子が','一斉に 動き出す']]],{opts:{x:640,w:520,y:270}});
  return s+goalTag(G3)+ANS3(1);
 },
 // 18. 誤答 C：3か所の緑の矢印を同じ長さのまま光らせる
 [K+'wrongC']:(p,ctx)=>{
  const blink=.5+.5*Math.sin(cueT(ctx)*6);
  let s=circuit({cur:1,vals:1,glow:seg(p,.1,.2)*blink});
  s+=wrongCard('C','電流が 減る','直列の 電流は どこでも 同じ',{x:640,w:520,y:200,g:seg(p,.02,.08)});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p)=>{
  let s=card(80,120,500,300,label('第1法則',330,180,{size:32,color:IC,anchor:'middle',weight:700})
   +label('電荷の 保存',330,245,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('分岐点で 入る 電流 ＝ 出る 電流',330,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.03,.15),IC);
  s+=card(620,120,500,300,label('第2法則',870,180,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('一周 0 の 電位',870,245,{size:30,color:C.ink,anchor:'middle',weight:700})
   +T(`\\oint${cs(EC,'\\mathbf{E}')}\\cdot d\\mathbf{r}=0`,870,330,36),seg(p,.25,.38),C.hi);
  return s+answerRow([[1,'D',''],[2,'B',''],[3,'D','']],{g:seg(p,.45,.55)});
 },
};
