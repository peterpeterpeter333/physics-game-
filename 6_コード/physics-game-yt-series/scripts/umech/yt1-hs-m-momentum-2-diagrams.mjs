// 高校編「運動量と力積・深く学ぶ 2/2」(ys-hs-m-momentum-2) — 図。Stage 1200×515.
// 内力・外力、F₁₂＋F₂₁＝0 から Δp₁＋Δp₂＝0、くっつく衝突（2.0 kg・3.0 m/s ＋ 静止 1.0 kg → 2.0 m/s）、K の減少、分裂（−1.0 と ＋2.0 m/s）。
// 色：運動量 p 桃、力 F 緑（球1が受ける力は濃い緑、球2が受ける力は薄い緑）、速度 v 紫、時間 t 金、K 濃い橙。右向きを正とする。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,texWidth,poly,ground,cart,spring,axes,draw} from './anim.mjs';
import {card,FA,VA,table,T2,Fc,KC,ebar,tag,PC,Pt,PA,PK,VK,mcart,posDir} from './yt1-hs-m-momentum-1-diagrams.mjs';
import {hsForce3Diagrams} from './yt1-hs-m-force-3-diagrams.mjs';
export {posDir};

const K='hs-m-momentum-2:';
const F2='#5fc39b'; // partner force (06 と同じ)
const B1='#8fa6c9', B2='#c9a46a';
export const P1=`${Pt}_1`, P2=`${Pt}_2`, DP1=`\\Delta ${Pt}_1`, DP2=`\\Delta ${Pt}_2`;
export const F12='F_{12}', F21=`{\\color{${F2}}F_{21}}`;
const GY=420;
// ---- balls ------------------------------------------------------------------------------------
export function ball1(x,{o=1,text='1',sub=''}={}){return fade(o,dot(x,GY-56,56,B1)+label(text,x,GY-50,{size:30,color:C.bg,anchor:'middle',weight:700})+(sub?label(sub,x-25,GY+40,{size:24,color:C.ink,anchor:'middle',weight:700}):''));}
export function ball2(x,{o=1,text='2',sub=''}={}){return fade(o,dot(x,GY-42,42,B2)+label(text,x,GY-36,{size:28,color:C.bg,anchor:'middle',weight:700})+(sub?label(sub,x+30,GY+40,{size:24,color:C.ink,anchor:'middle',weight:700}):''));}
// balls touching at x=600: ball1 centre 544, ball2 centre 642
const T1=544,T2x=642;
function contact({g=1,forces=1,labels=1,box=0,ext=0,sub=1}={}){
 let s=fade(g,ground(100,1100,GY)+ball1(T1,{sub:sub?'2.0 kg':''})+ball2(T2x,{sub:sub?'1.0 kg':''}));
 if(box)s+=fade(box,`<rect x="${T1-110}" y="${GY-170}" width="${T2x-T1+210}" height="235" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`+label('1組',T1-90,GY-185,{size:28,color:C.hi,weight:700}));
 if(forces){
  s+=FA(T1-20,GY-160,T1-160,GY-160,{g:forces,w:8,head:22})+FA(T2x+20,GY-160,T2x+160,GY-160,{g:forces,w:8,head:22,color:F2});
  if(labels)s+=fade(forces*labels,tex(F12,T1-95,GY-200,{size:38})+tex(F21,T2x+95,GY-200,{size:38,auto:false}));
 }
 if(ext){
  s+=FA(820,GY-110,820,GY-10,{g:ext,w:7,head:18})+FA(880,GY-10,880,GY-110,{g:ext,w:7,head:18,color:'#b9f5dc'});
  s+=fade(ext,label('重力',805,GY-40,{size:24,color:C.F,anchor:'end',weight:700})+label('垂直抗力',895,GY-70,{size:24,color:'#b9f5dc',weight:700})+label('（2球の 合計）',850,GY+40,{size:22,color:C.dim,anchor:'middle'}));
 }
 return s;
}
// ---- equation stack ---------------------------------------------------------------------------
const EQ=[
 {src:`${DP1}=${F12}\\Delta t`,y:90},
 {src:`${DP2}=${F21}\\Delta t`,y:180},
 {src:`${DP1}+${DP2}=(${F12}+${F21})\\Delta t`,y:290},
];
function eqs(step,p,{x=600}={}){
 let s='';
 EQ.forEach((r,i)=>{if(i>step)return;const o=i===step?seg(p,.05,.25):1;s+=fade(o,T2(r.src,x,r.y,{size:44}));});
 return s;
}
// ---- momentum bars before/after (tip to tail) --------------------------------------------------
function pRow(y,parts,{g=1,x0=300,lab='',k=PK,size=24}={}){
 let s='',x=x0;
 parts.forEach(([v,c,t])=>{if(!v)return;s+=fade(g,arrow(x,y,x+v*k,y,{color:c,w:9,head:22})+(t?label(t,x+v*k/2,y-18,{size,color:c,anchor:'middle',weight:700}):''));x+=v*k;});
 if(lab)s+=fade(g,label(lab,x0-30,y+9,{size:26,color:C.ink,anchor:'end',weight:700}));
 return s;
}
const PB1='#ff9ce6', PB2='#ffc9f1';
// ---- carts with spring (split) ------------------------------------------------------------------
function splitScene(u,{g=1,v=1,q=0}={}){ // u: 0 together → 1 apart
 const xa=520-200*u,xb=700+220*u;
 let s=fade(g,ground(100,1100,GY)+mcart(xa,GY,{text:'2.0 kg'})+mcart(xb,GY,{text:'1.0 kg',w:110}));
 if(u<.15)s+=fade(g,spring(xa+75,xb-55,GY-45,{coils:6,amp:12,color:C.hi}));
 else s+=fade(g,spring(xb-55-90,xb-55,GY-45,{coils:6,amp:8,color:C.dim}));
 if(v&&u>.5){
  s+=fade(g*v,VA(xa-60,GY-120,xa-60-1*VK*2,GY-120)+label('1.0 m/s',xa-60-VK,GY-140,{size:24,color:C.v,anchor:'middle',weight:700}));
  s+=fade(g*v,VA(xb+40,GY-120,xb+40+2*VK*2,GY-120)+label(q?'v ＝ ？':'2.0 m/s',xb+40+2*VK,GY-140,{size:24,color:C.v,anchor:'middle',weight:700}));
 }
 return s;
}

export const hsMomentum2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  const u=seg(p,.05,.5),xa=250+(T1-250)*u,xb=900-(900-T2x)*u,hit=seg(p,.52,.64),vo=1-seg(p,.38,.48);
  let s=ground(100,1100,GY)+ball1(xa)+ball2(xb);
  s+=fade(vo,VA(xa-40,GY-150,xa+80,GY-150)+VA(xb+20,GY-150,xb-60,GY-150));
  s+=fade(hit,FA(T1-20,GY-160,T1-140,GY-160,{w:8})+FA(T2x+20,GY-160,T2x+140,GY-160,{w:8,color:F2}));
  s+=card(250,30,700,140,label('互いに 与え合う 力積は',600,85,{size:30,color:C.ink,anchor:'middle'})+label('どう なって いる？',600,145,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.35,contact({labels:0,sub:0}));
  s+=card(300,40,600,140,label('ヒント',600,95,{size:28,color:C.dim,anchor:'middle'})+label('作用・反作用（06）',600,150,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ================= S2 力積を足す =================
 [K+'sys']:(p)=>{
  const u=seg(p,.05,.4),xa=250+(T1-250)*u;
  let s=ground(100,1100,GY)+ball1(xa,{sub:'2.0 kg'})+ball2(T2x,{sub:'1.0 kg'});
  s+=fade(1-seg(p,.4,.5),VA(xa-40,GY-150,xa+80,GY-150));
  s+=fade(seg(p,.55,.75),`<rect x="${T1-110}" y="${GY-170}" width="${T2x-T1+210}" height="235" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`+label('1組',T1-90,GY-185,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'int']:(p)=>{
  let s=contact({forces:seg(p,.1,.3),labels:0,box:1});
  s+=card(820,60,330,120,label('内力',985,115,{size:38,color:C.F,anchor:'middle',weight:700})+label('組の 中の 力',985,160,{size:24,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'ext']:(p)=>{
  let s=contact({forces:.3,labels:0,box:1,ext:seg(p,.1,.3)});
  s+=card(820,60,330,120,label('外力',985,115,{size:38,color:'#b9f5dc',anchor:'middle',weight:700})+label('組の 外から の 力',985,160,{size:24,color:C.ink,anchor:'middle'}),seg(p,.45,.6),'#b9f5dc');
  return s;
 },
 [K+'horse']:(p)=>hsForce3Diagrams['hs-m-force-3:both2'](.3+.7*seg(p,0,.8)),
 [K+'f12']:(p)=>{
  let s=contact({forces:seg(p,.05,.25),labels:seg(p,.1,.3)});
  s+=fade(seg(p,.35,.5),label('球1が 受ける',T1-95,GY-250,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('球2が 受ける',T2x+95,GY-250,{size:24,color:F2,anchor:'middle',weight:700}));
  s+=posDir(880,60,{g:seg(p,.5,.65)});
  return s;
 },
 [K+'law']:(p)=>{
  let s=contact({});
  s+=posDir(880,60);
  s+=card(60,30,420,120,T2(`${F12}+${F21}=0`,270,92,{size:44,auto:false}),seg(p,.5,.65),C.F);
  s+=fade(seg(p,.1,.25),label('同じ 大きさ・逆向き',600,175,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'dt']:(p)=>{
  let s=fade(.4,contact({labels:0}));
  const x0=300,x1=900;
  s+=card(180,40,840,170,'',seg(p,.05,.2));
  s+=fade(seg(p,.1,.25),label('球1',250,100,{size:26,color:B1,anchor:'end',weight:700})+line(x0,92,x1,92,{color:C.faint,w:2})+rect(480,80,240,24,{fill:C.t,fo:.6,stroke:C.t,rx:4}));
  s+=fade(seg(p,.25,.4),label('球2',250,160,{size:26,color:B2,anchor:'end',weight:700})+line(x0,152,x1,152,{color:C.faint,w:2})+rect(480,140,240,24,{fill:C.t,fo:.6,stroke:C.t,rx:4}));
  s+=fade(seg(p,.45,.6),label('同じ Δt',600,195,{size:26,color:C.t,anchor:'middle',weight:700})+label('始まり',480,70,{size:22,color:C.dim,anchor:'middle'})+label('終わり',720,70,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'dp1']:(p)=>{
  let s=fade(seg(p,.05,.2),label('力積 ＝ 運動量の 変化（1/2）',600,40,{size:26,color:C.dim,anchor:'middle'}));
  s+=eqs(0,seg(p,.2,1));
  return s;
 },
 [K+'dp2']:(p)=>label('力積 ＝ 運動量の 変化（1/2）',600,40,{size:26,color:C.dim,anchor:'middle'})+eqs(1,p),
 [K+'add']:(p)=>{
  let s=label('力積 ＝ 運動量の 変化（1/2）',600,40,{size:26,color:C.dim,anchor:'middle'})+eqs(2,p);
  s+=fade(seg(p,.05,.2),line(300,225,900,225,{color:C.dim,w:2})+label('＋',270,236,{size:34,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('Δt を くくり出す',600,360,{size:26,color:C.t,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=label('力積 ＝ 運動量の 変化（1/2）',600,40,{size:26,color:C.dim,anchor:'middle'})+fade(.45,eqs(1,1))+eqs(2,1);
  const W=texWidth(EQ[2].src,44),w=texWidth(`(${F12}+${F21})`,44),wt=texWidth('\\Delta t',44),l=600+W/2-wt-w;
  s+=fade(seg(p,.05,.2),`<rect x="${l-6}" y="262" width="${w+12}" height="56" rx="10" fill="none" stroke="${C.hi}" stroke-width="3"/>`+label('＝ 0',l+w/2,360,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=card(330,385,540,100,T2(`${DP1}+${DP2}=0`,600,438,{size:48,auto:false}),seg(p,.3,.45),PC);
  return s;
 },
 [K+'ft']:(p)=>{
  const A=axes({x:110,y:450,w:560,h:360,xmax:.013,ymin:-1350,ymax:1350,xlabel:'t [s]',ylabel:'力 F [N]',xticks:[],yticks:[],xcolor:C.t,ycolor:C.F});
  const b=t=>t<0||t>.01?0:1200*Math.sin(Math.PI*t/.01)**2;
  const area=(sg,col,g)=>{const pts=[[A.X(0),A.Y(0)]];for(let i=0;i<=40;i++){const u=.01*i/40;pts.push([A.X(u),A.Y(sg*b(u))]);}pts.push([A.X(.01),A.Y(0)]);return fade(g,poly(pts,{fill:col,fo:.3,stroke:col,sw:2}));};
  let s=A.svg+area(1,F2,seg(p,.05,.25))+area(-1,C.F,seg(p,.25,.45));
  s+=fade(seg(p,.05,.25),tex(F21,A.X(.0115),A.Y(700),{size:36,auto:false}))+fade(seg(p,.25,.45),tex(F12,A.X(.0115),A.Y(-700),{size:36}));
  s+=card(760,90,400,200,label('上下に 同じ 形',960,155,{size:30,color:C.ink,anchor:'middle',weight:700})+label('面積が 打ち消し合う',960,225,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 // ================= S3 運動量保存則 =================
 [K+'cons']:(p)=>{
  const k=60;
  let s=pRow(170,[[6,PB1,'球1'],[0]],{lab:'衝突前',g:seg(p,.05,.2),k,size:28});
  s+=pRow(330,[[4,PB1,'球1'],[2,PB2,'球2']],{lab:'衝突後',g:seg(p,.3,.45),k,size:28});
  s+=fade(seg(p,.55,.7),line(300+6*k,120,300+6*k,370,{color:C.hi,w:3,dash:'8 8'})+label('合計の 長さは 同じ',300+6*k+30,260,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=card(200,50,800,220,label('運動量保存則',600,115,{size:42,color:C.hi,anchor:'middle',weight:700})+T2(`${P1}+${P2}`,400,200,{size:44,auto:false})+label('（衝突前）',400,250,{size:22,color:C.dim,anchor:'middle'})+label('＝',600,212,{size:40,color:C.ink,anchor:'middle'})+T2(`${P1}+${P2}`,800,200,{size:44,auto:false})+label('（衝突後）',800,250,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=tag('結果',600,330,{g:seg(p,.4,.55)});
  s+=fade(seg(p,.5,.65),label('定義 ＋ 作用・反作用の 法則 から 導いた',600,400,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'cond']:(p)=>{
  let s=label('保存する 条件',600,70,{size:32,color:C.hi,anchor:'middle',weight:700});
  s+=card(150,110,900,110,label('外力の 合計が 0',600,178,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.25,.4));
  s+=fade(seg(p,.45,.55),label('または',600,265,{size:26,color:C.dim,anchor:'middle'}));
  s+=card(150,290,900,110,label('衝突の 間の 外力の 力積が 無視できる',600,358,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.55,.7));
  return s;
 },
 [K+'cond2']:(p)=>{
  let s=contact({forces:.25,labels:0,ext:1,box:1});
  s+=card(820,60,340,150,label('縦の 外力',990,115,{size:30,color:C.ink,anchor:'middle',weight:700})+label('つり合って 合計 0',990,170,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'cond3']:(p)=>{
  let s=contact({forces:.25,labels:0,box:1});
  s+=FA(T1-20,GY-8,T1-70,GY-8,{g:seg(p,.05,.2),w:5,head:14})+fade(seg(p,.05,.2),label('摩擦',T1-130,GY-25,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=card(820,60,340,170,label('衝突は 一瞬',990,115,{size:30,color:C.t,anchor:'middle',weight:700})+label('摩擦の 力積は',990,160,{size:26,color:C.ink,anchor:'middle'})+label('ふつう 無視できる',990,200,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'mis']:(p)=>{
  let s=card(150,60,900,120,label('保存するのは 組の 合計 p₁ ＋ p₂',600,135,{size:34,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  s+=card(150,220,900,100,label('球1 だけの 運動量は 変わる（6.0 → 4.0 など）',600,282,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.35,.5));
  s+=fade(seg(p,.65,.8),label('1個の 物体に 保存則を 使うのは 間違い',600,400,{size:30,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 くっつく衝突 =================
 [K+'stick']:(p)=>{
  const u=seg(p,.05,.95),xa=240+180*u;
  let s=ground(100,1100,GY)+ball1(xa,{sub:'2.0 kg'})+ball2(T2x+120,{sub:'1.0 kg'})+posDir(80,60);
  s+=VA(xa-40,GY-150,xa-40+3*VK,GY-150)+label('3.0 m/s',xa-40+1.5*VK,GY-168,{size:24,color:C.v,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.65),label('止まって いる',T2x+120,GY-110,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stick2']:(p)=>{
  const u=seg(p,.05,.6),x=600+120*u;
  let s=ground(100,1100,GY)+posDir(80,60)+ball1(x-49)+ball2(x+49)+label('3.0 kg',x,GY+40,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),`<rect x="${x-120}" y="${GY-125}" width="240" height="135" rx="40" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="8 8"/>`+label('一体',x,GY-140,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),VA(x+80,GY-170,x+80+2*VK,GY-170)+label('u ＝ ？',x+190,GY-162,{size:28,color:C.v,weight:700}));
  return s;
 },
 [K+'before']:(p)=>{
  let s=label('衝突前',150,100,{size:28,color:C.dim,anchor:'middle',weight:700});
  s+=pRow(110,[[6,PB1,'2.0 × 3.0 ＝ 6.0']],{g:seg(p,.05,.2),x0:260});
  s+=fade(seg(p,.25,.4),label('球2：1.0 × 0 ＝ 0',600,190,{size:26,color:PB2,anchor:'middle',weight:700}));
  s+=card(160,250,880,120,T2('2.0\\times 3.0+1.0\\times 0=6.0\\ \\mathrm{kg\\cdot m/s}',600,310,{size:42,auto:false}),seg(p,.4,.55),PC);
  return s;
 },
 [K+'after']:(p)=>{
  let s=label('衝突前',150,100,{size:28,color:C.dim,anchor:'middle',weight:700})+pRow(110,[[6,PB1,'6.0']],{x0:260});
  s+=fade(seg(p,.05,.2),label('衝突後',150,240,{size:28,color:C.dim,anchor:'middle',weight:700}));
  s+=card(260,190,600,110,T2('3.0\\,u',560,245,{size:50,auto:false})+label('（3.0 kg が 速度 u）',730,255,{size:24,color:C.ink,anchor:'middle'}),seg(p,.3,.45),PC);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T2('6.0=3.0\\,u',600,110,{size:54,auto:false});
  s+=fade(seg(p,.3,.45),label('両辺 ÷ 3.0',600,200,{size:28,color:C.dim,anchor:'middle',weight:700}));
  s+=card(350,250,500,130,T2('u=2.0\\ \\mathrm{m/s}',600,318,{size:54,auto:false,color:C.v}),seg(p,.55,.7),C.v);
  return s;
 },
 [K+'check']:(p)=>{
  const cols=[{h:'',color:C.ink,w:130},{h:'衝突前',color:PC,w:170},{h:'衝突後',color:PC,w:200},{h:'変化',color:PC,w:170}];
  return table({x:180,y:60,cols,rows:[['球1','6.0','2.0×2.0＝4.0','−2.0'],['球2','0','1.0×2.0＝2.0','＋2.0'],['合計','6.0','6.0','0']],reveal:[seg(p,.05,.4),0,0],size:30,rh:72});
 },
 [K+'check2']:(p)=>{
  const cols=[{h:'',color:C.ink,w:130},{h:'衝突前',color:PC,w:170},{h:'衝突後',color:PC,w:200},{h:'変化',color:PC,w:170}];
  return table({x:180,y:60,cols,rows:[['球1','6.0','2.0×2.0＝4.0','−2.0'],['球2','0','1.0×2.0＝2.0','＋2.0'],['合計','6.0','6.0','0']],reveal:[1,seg(p,.05,.35),seg(p,.6,.8)],hl:[2],size:30,rh:72});
 },
 // ================= S5 運動エネルギーは？ =================
 [K+'k1']:(p)=>{
  let s=card(560,40,600,130,T2('\\tfrac12\\times 2.0\\times 3.0^2',860,90,{size:40,auto:false})+fade(seg(p,.5,.65),T2('=9.0\\ \\mathrm{J}',860,145,{size:40,auto:false,color:KC})),seg(p,.2,.35),KC);
  s+=line(100,440,520,440,{color:C.dim,w:2});
  s+=ebar(220,440,9,28,{g:seg(p,.6,.75),w:110,top:'9.0 J',text:'衝突前'});
  return s;
 },
 [K+'k2']:(p)=>{
  let s=card(560,40,600,130,T2('\\tfrac12\\times 3.0\\times 2.0^2',860,90,{size:40,auto:false})+fade(seg(p,.3,.45),T2('=6.0\\ \\mathrm{J}',860,145,{size:40,auto:false,color:KC})),seg(p,.05,.2),KC);
  s+=line(100,440,520,440,{color:C.dim,w:2})+ebar(220,440,9,28,{w:110,top:'9.0 J',text:'衝突前'});
  s+=ebar(420,440,6,28,{g:seg(p,.35,.5),w:110,top:'',text:'衝突後'})+fade(seg(p,.35,.5),label('6.0 J',420,440-6*28-12,{size:26,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),`<rect x="365" y="${440-9*28}" width="110" height="${3*28}" rx="6" fill="none" stroke="${C.a}" stroke-width="2.5" stroke-dasharray="7 7"/>`+label('3.0 J 減る',600,440-7.5*28,{size:28,color:C.a,weight:700}));
  return s;
 },
 [K+'k3']:(p)=>{
  let s=line(80,440,500,440,{color:C.dim,w:2})+ebar(180,440,9,28,{w:100,top:'9.0 J',text:'K 前'})+ebar(380,440,6,28,{w:100,top:'6.0 J',text:'K 後'});
  s+=fade(seg(p,.05,.2),label('3.0 J → 変形・音・熱',290,100,{size:28,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),line(640,440,1100,440,{color:C.dim,w:2})+rect(690,440-6*28,100,6*28,{fill:PC,fo:.5,stroke:PC,rx:6})+rect(940,440-6*28,100,6*28,{fill:PC,fo:.5,stroke:PC,rx:6})+label('p 前',740,474,{size:24,color:C.ink,anchor:'middle'})+label('p 後',990,474,{size:24,color:C.ink,anchor:'middle'})+label('6.0',740,440-6*28-12,{size:26,color:PC,anchor:'middle',weight:700})+label('6.0',990,440-6*28-12,{size:26,color:PC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('運動量は 保存・K は 保存しない',870,100,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'k4']:(p)=>card(150,120,900,200,label('衝突の 問題では',600,190,{size:30,color:C.ink,anchor:'middle'})+label('K の 保存を 勝手に 足さない',600,260,{size:40,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a),
 [K+'split']:(p)=>{
  const u=seg(p,.45,.95);
  let s=splitScene(u,{v:0})+posDir(80,60);
  s+=fade(1-seg(p,.4,.5),label('止まって いる',610,GY-150,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3)*(1-seg(p,.4,.5)),label('ばね',610,GY-80,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'split2']:(p)=>{
  let s=splitScene(1,{v:1,q:1})+posDir(80,60);
  s+=card(760,40,400,100,label('はじめの 合計 0',960,105,{size:30,color:PC,anchor:'middle',weight:700}),seg(p,.05,.2),PC);
  return s;
 },
 [K+'split3']:(p)=>{
  let s=fade(.35,splitScene(1,{v:1,q:p<.55?1:0}));
  s+=card(150,40,900,120,T2('2.0\\times(-1.0)+1.0\\times v=0',600,100,{size:44,auto:false}),seg(p,.05,.2),PC);
  s+=card(400,190,400,100,T2('v=2.0\\ \\mathrm{m/s}',600,240,{size:46,auto:false,color:C.v}),seg(p,.45,.6),C.v);
  s+=fade(seg(p,.7,.85),label('右向き',880,250,{size:28,color:C.v,weight:700}));
  return s;
 },
 [K+'split4']:(p)=>{
  const x0=330,k=75,g1=seg(p,.05,.2);
  let s=fade(g1,arrow(x0,150,x0-2*k,150,{color:PB1,w:9,head:22})+label('2.0 kg：−2.0',x0-12,130,{size:24,color:PB1,anchor:'end',weight:700})
   +arrow(x0,230,x0+2*k,230,{color:PB2,w:9,head:22})+label('1.0 kg：＋2.0',x0+12,210,{size:24,color:PB2,anchor:'start',weight:700})+line(x0,100,x0,260,{color:C.dim,w:2,dash:'6 6'}));
  s+=fade(g1,label('運動量の 合計 0',x0,310,{size:28,color:PC,anchor:'middle',weight:700}));
  s+=line(660,440,1140,440,{color:C.dim,w:2});
  s+=ebar(760,440,0.0001,60,{g:seg(p,.3,.45),w:110,top:'0 J',text:'K 前'});
  s+=ebar(1000,440,1,60,{g:seg(p,.4,.55),w:110,text:'K 後'})+fade(seg(p,.45,.6),`<g transform="translate(0 -60)">${ebar(1000,440,2,60,{w:110,color:'#ffb070'})}</g>`)+fade(seg(p,.55,.7),label('1.0 ＋ 2.0 ＝ 3.0 J',1000,440-3*60-14,{size:26,color:KC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('ばねの 位置エネルギー から',x0,400,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cmp']:(p)=>{
  const cols=[{h:'',color:C.ink,w:180},{h:'運動量の 合計',color:PC,w:300},{h:'運動エネルギー',color:KC,w:300}];
  return table({x:180,y:70,cols,rows:[['合体','6.0 → 6.0','9.0 J → 6.0 J'],['分裂','0 → 0','0 → 3.0 J']],reveal:[seg(p,.05,.3),seg(p,.35,.6)],size:32,rh:80})
   +fade(seg(p,.7,.85),label('運動量 と エネルギーは 別の 量',600,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>{
  let s=contact({});
  s+=card(60,30,560,120,label('互いに 与え合う 力積',340,80,{size:28,color:C.ink,anchor:'middle'})+label('同じ 大きさ・逆向き',340,128,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>card(150,100,900,240,label('外力の 力積が 無視できれば',600,175,{size:32,color:C.ink,anchor:'middle'})+T2(`${P1}+${P2}`,520,260,{size:50,auto:false})+label('は 変わらない',740,272,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),PC),
 [K+'next']:(p)=>{
  const cx=600,cy=270,r=170,th=-Math.PI/2+2*Math.PI*seg(p,0,1);
  let s=ring(cx,cy,r,{color:C.faint,w:3,dash:'8 8'})+dot(cx,cy,6,C.dim);
  [0,1,2,3].forEach(i=>{const a=i*Math.PI/2+Math.PI/4;const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);s+=fade(.45,VA(x,y,x-90*Math.sin(a),y+90*Math.cos(a)));});
  const x=cx+r*Math.cos(th),y=cy+r*Math.sin(th);
  s+=dot(x,y,20,C.hi)+VA(x,y,x-110*Math.sin(th),y+110*Math.cos(th),{w:6});
  s+=fade(seg(p,.3,.45),label('速さは 一定',950,200,{size:30,color:C.v,anchor:'middle',weight:700})+label('向きは 変わり続ける',950,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.3,ring(600,270,170,{color:C.faint,w:3,dash:'8 8'}));
  s+=card(250,120,700,200,label('円を 描いて 回る 物体の 速度は',600,190,{size:32,color:C.ink,anchor:'middle'})+label('変化して いる？',600,265,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('円運動と 万有引力',600,260,{size:52,color:C.hi,anchor:'middle',weight:700})+label('深く学ぶ 1/3 へ',600,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
