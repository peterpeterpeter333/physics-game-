// YouTube シリーズ「マクスウェル方程式・上級 2/4」(ys-ue-maxwell-2) — 図。Stage 1200×515.
// 色：𝐄・E_y 水色、𝐁・B_z 橙、t 金、長方形の辺 ＋の辺 黄・−の辺 赤・0 の辺 灰、dx・dy・dz 白、強調 黄。
// xy 面の図：x 右、y 上、z 手前（⊙）。長方形は反時計回り（下 → 右 → 上 → 左）、表 +z。
//   右の辺（x＋dx）を上向き：+E_y(x+dx)dy（黄）、左の辺（x）を下向き：−E_y(x)dy（赤）、上下 0（灰）。B_z は ⊙（手前）。
// xz 面の図：x 右、z 上 → 手前は −y、+y は奥（⊗）。表 +y → 画面上は時計回り（左 → 上 → 右 → 下）。
//   左の辺（x）を上向き：+B_z(x)dz（黄）、右の辺（x＋dx）を下向き：−B_z(x+dx)dz（赤）、上下 0（灰）。E_y は ⊗（奥）。
// 字幕では E_y・B_z と書かない（図の TeX の中だけ）。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight,brace} from './anim.mjs';
import {card,T,cs,head,outSym,inSym} from './yt1-um-current-field-1-diagrams.mjs';
import {L,TF} from './yt1-ue-potential-1-diagrams.mjs';
import {mixed} from './yt1-ue-ampere-1-diagrams.mjs';
import {EC,CB,TC,HI,BAD,INK,DIM,vE,vB,tt,PE,PB,eps,mu,dr,eqSplit} from './yt1-ue-maxwell-1-diagrams.mjs';

const K='ue-maxwell-2:';
const GRY='#8da0bf',PLUS=HI,MINUS=BAD;
const Ey=cs(EC,'E_y'),Bz=cs(CB,'B_z'),Es=cs(EC,'E'),Bs=cs(CB,'B');
const pd=(f,v)=>`\\dfrac{\\partial ${f}}{\\partial ${v}}`;
const dEx=pd(Ey,'x'),dBt=pd(Bz,tt),dBx=pd(Bz,'x'),dEt=pd(Ey,tt);
const FAR=`\\oint ${vE}\\cdot ${dr}=-\\dfrac{d${PB}}{d${tt}}`;
const AMV=`\\oint ${vB}\\cdot ${dr}=${mu}${eps}\\dfrac{d${PE}}{d${tt}}`;
const RES1=`${dEx}=-${dBt}`,RES2=`-${dBx}=${mu}${eps}${dEt}`;
const U=s=>`\\,\\mathrm{${s}}`;
const cardR=(inner,g=1,stroke=C.faint)=>card(610,30,560,450,inner,g,stroke);

// ---- small axis triads -------------------------------------------------------------------------------
function triadXY(x=60,y=470,g=1){return fade(g,arrow(x,y,x+60,y,{color:DIM,w:2.5,head:11})+label('x',x+66,y+8,{size:22,color:DIM})+arrow(x,y,x,y-60,{color:DIM,w:2.5,head:11})+label('y',x-6,y-68,{size:22,color:DIM})+ring(x,y,9,{color:DIM,w:2.5})+dot(x,y,3,DIM)+label('z（手前）',x+14,y-18,{size:22,color:DIM}));}
function triadXZ(x=60,y=470,g=1){const d=6;return fade(g,arrow(x,y,x+60,y,{color:DIM,w:2.5,head:11})+label('x',x+66,y+8,{size:22,color:DIM})+arrow(x,y,x,y-60,{color:DIM,w:2.5,head:11})+label('z',x-6,y-68,{size:22,color:DIM})+ring(x,y,9,{color:DIM,w:2.5})+line(x-d,y-d,x+d,y+d,{color:DIM,w:2.5})+line(x-d,y+d,x+d,y-d,{color:DIM,w:2.5})+label('y（奥）',x+14,y-18,{size:22,color:DIM}));}

// ---- wave snapshot: E_y arrows (cyan) and B_z markers (⊙/⊗ orange) along x -------------------------
function wave({g=1,ph=0,x0=60,x1=560,cy=250,amp=110,n=13,B=1,E=1,hlx=-1}={}){
 let s=arrow(x0-10,cy,x1+30,cy,{color:DIM,w:2.5,head:13})+label('x',x1+36,cy+8,{size:24,color:DIM});
 for(let i=0;i<n;i++){const x=x0+20+i*(x1-x0-40)/(n-1),v=Math.sin(2*Math.PI*(i/(n-1)*1.25)-ph);
  if(E&&Math.abs(v)>.08)s+=arrow(x,cy,x,cy-amp*v,{color:EC,w:4,head:12});
  if(B){const r=6+10*Math.abs(v);if(Math.abs(v)>.15)s+=fade(B,(v>0?outSym:inSym)(x,cy+185,r,CB));}
 }
 if(B)s+=fade(B,label('𝐁',x0-30,cy+194,{size:26,color:CB,weight:700}));
 if(hlx>=0)s+=line(hlx,cy-150,hlx,cy+150,{color:HI,w:2.5,dash:'8 6'});
 return fade(g,s);
}

// ---- the zoomed rectangle -------------------------------------------------------------------------
const XL=175,XR=415,YB=375,YT=165,XM=(XL+XR)/2,YM=(YB+YT)/2;
// mode 'xy' (ccw: bottom→right→top→left) or 'xz' (cw: left→top→right→bottom)
function sideCol(i,mode){// i: 0 bottom,1 right,2 top,3 left
 if(mode==='xy')return [GRY,PLUS,GRY,MINUS][i];
 return [GRY,MINUS,GRY,PLUS][i];
}
function rectFig({mode='xy',g=1,hl=-1,colors=0,heads=1,fieldL=1,fieldR=1,inner=1,dims=1,vals=null,dimOthers=0}={}){
 const sides=[[[XL,YB],[XR,YB]],[[XR,YB],[XR,YT]],[[XR,YT],[XL,YT]],[[XL,YT],[XL,YB]]];
 const dirs=mode==='xy'?[[1,0],[0,-1],[-1,0],[0,1]]:[[-1,0],[0,1],[1,0],[0,-1]];
 let s='';
 sides.forEach(([a,b],i)=>{const on=hl<0||hl===i,col=colors||hl===i?sideCol(i,mode):INK;const op=on?1:(dimOthers?.35:1);
  s+=fade(op,line(a[0],a[1],b[0],b[1],{color:col,w:hl===i?7:4}));
  if(heads){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;s+=fade(op,head(mx+dirs[i][0]*12,my+dirs[i][1]*12,dirs[i][0],dirs[i][1],{color:col,L:20}));}
 });
 // field arrows on the left and right sides
 const lenL=vals?vals[0]*48:130,lenR=vals?vals[1]*48:150;
 if(mode==='xy'){
  if(fieldL)s+=fade(fieldL,arrow(XL-34,YM+lenL/2,XL-34,YM-lenL/2,{color:EC,w:5,head:15})+T(`${Ey}(x)`,XL-50,YM-lenL/2+12,{size:25,anchor:'end'}));
  if(fieldR)s+=fade(fieldR,arrow(XR+34,YM+lenR/2,XR+34,YM-lenR/2,{color:EC,w:5,head:15})+T(`${Ey}(x+dx)`,XR+50,YM-lenR/2+12,{size:25,anchor:'start'}));
  if(inner)s+=fade(inner,outSym(XM,YM,20,CB)+T(Bz,XM+42,YM+8,{size:30}));
 }else{
  if(fieldL)s+=fade(fieldL,arrow(XL-34,YM+lenL/2,XL-34,YM-lenL/2,{color:CB,w:5,head:15})+T(`${Bz}(x)`,XL-50,YM-lenL/2+12,{size:25,anchor:'end'}));
  if(fieldR)s+=fade(fieldR,arrow(XR+34,YM+lenR/2,XR+34,YM-lenR/2,{color:CB,w:5,head:15})+T(`${Bz}(x+dx)`,XR+50,YM-lenR/2+12,{size:25,anchor:'start'}));
  if(inner)s+=fade(inner,inSym(XM,YM,20,EC)+T(Ey,XM+42,YM+8,{size:30}));
 }
 if(dims){s+=fade(dims,brace(XL,XR,YB+12,{dir:1,color:INK})+T('dx',XM,YB+62,{size:28})+line(XL-110,YB,XL-110,YT,{color:INK,w:2})+line(XL-118,YB,XL-102,YB,{color:INK,w:2})+line(XL-118,YT,XL-102,YT,{color:INK,w:2})+T(mode==='xy'?'dy':'dz',XL-138,YM+8,{size:28}));}
 s+=line(XL,YB+4,XL,YB+80,{color:DIM,w:1.5,dash:'4 5'})+line(XR,YB+4,XR,YB+80,{color:DIM,w:1.5,dash:'4 5'})+label('x',XL-8,YB+100,{size:24,color:DIM,anchor:'middle'})+label('x＋dx',XR+8,YB+100,{size:24,color:DIM,anchor:'middle'});
 s+=mode==='xy'?triadXY(40,490):triadXZ(40,490);
 return fade(g,s);
}

export const ytUeMaxwell2Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  let s=card(80,60,1040,200,L('前回：アンペール・マクスウェルの 法則',600,105,{size:26,color:DIM})+eqSplit(600,195,50,{box:seg(p,.3,.45),boxR:1}),seg(p,0,.15));
  s+=fade(seg(p,.5,.65),card(330,320,540,110,L('電荷保存と 矛盾しない',600,387,{size:32,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=card(60,40,520,430,L('前回の 最後の 問い',320,95,{size:24,color:DIM})+L('電場と 磁場が',320,180,{size:28})+L('互いに 生み合うなら',320,225,{size:28})+L('空間を 伝わる 波？',320,290,{size:32,color:HI,weight:700}),seg(p,0,.15),HI);
  s+=fade(seg(p,.4,.55),card(620,40,520,430,L('その 式を',880,150,{size:28})+T(`\\oint ${vE}\\cdot ${dr},\\ \\oint ${vB}\\cdot ${dr}`,880,240,{size:42})+L('から どう 取り出す？',880,330,{size:30,color:HI,weight:700}),1));
  return s;
 },
 [K+'plan']:(p)=>{
  const k=seg(p,.4,.85),w=420-(420-60)*k,h=300-(300-44)*k,cx=300,cy=255;
  let s=fade(1-k*.2,`<ellipse cx="${cx}" cy="${cy}" rx="${(w/2)*(1-k)+30*k}" ry="${(h/2)*(1-k)+22*k}" fill="none" stroke="${INK}" stroke-width="4" opacity="${(1-k).toFixed(2)}"/>`);
  s+=fade(k,rect(cx-30,cy-22,60,44,{fill:HI,fo:.15,stroke:HI,sw:3,rx:2}));
  s+=fade(seg(p,.05,.2),L('輪 全体：1つの 数',300,90,{size:28,color:DIM}));
  s+=fade(seg(p,.7,.85),L('小さな 長方形 → 各点の 式',300,440,{size:28,color:HI,weight:700}));
  s+=cardR(L('今回の 道筋',890,85,{size:26,color:DIM})+L('① 場面を 絞る',890,160,{size:28})+L('② xy 面の 長方形',890,225,{size:28})+L('　 → ファラデー',890,265,{size:28,color:EC})+L('③ xz 面の 長方形',890,330,{size:28})+L('　 → アンペール・マクスウェル',890,370,{size:26,color:CB}),seg(p,.1,.25));
  return s;
 },
 // ===== S2 場面を絞る =====
 [K+'vac']:(p)=>{
  let s=card(80,40,1040,180,L('③ ファラデー',230,95,{size:28,color:EC,weight:700})+T(FAR,700,140,{size:46}),1);
  const k=seg(p,.35,.6);
  s+=card(80,260,1040,200,L('④ アンペール・マクスウェル',260,315,{size:26,color:CB,weight:700})
   +fade(1-k,T(`\\oint ${vB}\\cdot ${dr}=${mu}${cs(C.F,'I')}+${mu}${eps}\\dfrac{d${PE}}{d${tt}}`,700,370,{size:46}))+fade(k,T(AMV,700,370,{size:46})),1);
  s+=fade(seg(p,.2,.35)*(1-k),line(610,395,700,345,{color:BAD,w:4}));
  s+=fade(seg(p,.6,.75),L('真空：電荷 0・電流 0',260,420,{size:26,color:HI}));
  return s;
 },
 [K+'axes']:(p)=>{
  const ox=200,oy=330;
  let s=arrow(ox,oy,ox+220,oy,{color:INK,w:4,head:18,g:seg(p,.05,.3)})+fade(seg(p,.2,.3),label('x（右）',ox+232,oy+10,{size:28,color:INK}));
  s+=arrow(ox,oy,ox,oy-220,{color:INK,w:4,head:18,g:seg(p,.3,.55)})+fade(seg(p,.45,.55),label('y（上）',ox-20,oy-232,{size:28,color:INK}));
  s+=fade(seg(p,.6,.8),ring(ox,oy,18,{color:INK,w:4})+dot(ox,oy,6,INK)+label('z（手前 ⊙）',ox-30,oy+56,{size:28,color:INK}));
  s+=cardR(L('座標',890,100,{size:26,color:DIM})+L('x：右向き',890,190,{size:30})+L('y：上向き',890,260,{size:30})+L('z：画面の 手前向き ⊙',890,330,{size:30}),1);
  return s;
 },
 [K+'assume']:(p)=>{
  let s=wave({g:1,B:seg(p,.55,.7),E:seg(p,.35,.5)>0?1:0});
  s+=fade(seg(p,.05,.2),arrow(420,80,540,80,{color:HI,w:5,head:16})+label('進む 向き',420,60,{size:24,color:HI}));
  s+=cardR(L('仮定',890,95,{size:26,color:DIM})+L('波は x 方向に 進む',890,175,{size:28,color:HI})+fade(seg(p,.35,.5),mixed([`$${vE}$`,'は y 方向 だけ'],890,255,{size:30,color:EC}))
   +fade(seg(p,.55,.7),mixed([`$${vB}$`,'は z 方向 だけ（⊙／⊗）'],890,335,{size:28,color:CB})),1);
  return s;
 },
 [K+'comp']:(p)=>{
  let s=wave({});
  s+=cardR(T(`${Ey}(x,${tt}),\\ \\ ${Bz}(x,${tt})`,890,140,{size:44})+L('位置 x と 時刻 t だけで 決まる',890,240,{size:26})+fade(seg(p,.5,.65),L('y・z を ずらしても 同じ 値',890,320,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'partial']:(p)=>{
  const xx=80+380*seg(p,.35,.85);
  let s=wave({B:0,hlx:xx});
  s+=fade(seg(p,.3,.4),arrow(150,440,450,440,{color:HI,w:4,head:15})+label('x を 動かす',300,480,{size:24,color:HI,anchor:'middle'}));
  s+=cardR(TF(`\\dfrac{\\partial}{\\partial x}`,890,140,{size:56,frac:true})+L('t を 止めた まま',890,250,{size:30,color:TC,weight:700})+L('x だけを 動かした 傾き',890,310,{size:28}),1);
  return s;
 },
 [K+'partialt']:(p)=>{
  let s=wave({B:0,ph:2*Math.PI*.6*seg(p,.2,1),hlx:255});
  s+=dot(255,250,8,HI)+fade(seg(p,.1,.25),label('x を 固定',255,440,{size:24,color:HI,anchor:'middle'}));
  s+=cardR(TF(`\\dfrac{\\partial}{\\partial ${tt}}`,890,140,{size:56,frac:true})+L('x を 止めた まま',890,250,{size:30,color:HI,weight:700})+L('時間だけ 進めた 変化率',890,310,{size:28})+fade(seg(p,.6,.75),L('中級：偏微分',890,390,{size:26,color:DIM})),1);
  return s;
 },
 // ===== S3 xy 面・ファラデー =====
 [K+'rect']:(p)=>{
  let s=rectFig({heads:0,fieldL:0,fieldR:0,inner:0,dims:seg(p,.25,.45),g:seg(p,0,.2)});
  s+=cardR(L('xy 面の 小さな 長方形',890,95,{size:28,color:INK,weight:700})+L('横 dx、縦 dy',890,180,{size:30})+fade(seg(p,.5,.65),L('左の 辺：位置 x',890,270,{size:28}))+fade(seg(p,.6,.75),L('右の 辺：位置 x＋dx',890,330,{size:28})),1);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=rectFig({fieldL:0,fieldR:0,inner:0,heads:1,g:1});
  s+=fade(seg(p,.4,.6),outSym(XM,YM,22,HI)+label('表 +z（手前）',XM,YM+56,{size:24,color:HI,anchor:'middle'}));
  s+=cardR(L('たどる 向き',890,95,{size:26,color:DIM})+L('手前から 見て 反時計回り',890,175,{size:30,weight:700})+fade(seg(p,.4,.6),L('右ねじ → 表は +z（⊙）',890,265,{size:28,color:HI})),1);
  return s;
 },
 [K+'right']:(p)=>{
  let s=rectFig({hl:1,dimOthers:1,colors:0,fieldL:.35,inner:.35});
  s+=cardR(T(`\\oint ${vE}\\cdot ${dr}`,890,110,{size:42})+L('＝ 右 ＋ 上 ＋ 左 ＋ 下',890,190,{size:28})+fade(seg(p,.4,.55),L('右の 辺：一歩は 上向き',890,280,{size:28,color:PLUS}))+fade(seg(p,.6,.75),mixed([`$${vE}$`,'と 同じ 向き'],890,345,{size:28,color:PLUS})),1);
  return s;
 },
 [K+'right2']:(p)=>{
  let s=rectFig({hl:1,dimOthers:1,fieldL:.35,inner:.35});
  s+=cardR(L('右の 辺の 寄与',890,100,{size:26,color:PLUS})+TF(`+${Ey}(x+dx)\\,dy`,890,200,{size:44,g:seg(p,.2,.4)}),1,PLUS);
  return s;
 },
 [K+'top']:(p)=>{
  let s=rectFig({hl:2,dimOthers:1,fieldL:.5,fieldR:.5,inner:.35});
  s+=fade(seg(p,.2,.4),line(XM-14,YT,XM-14,YT-14,{color:INK,w:2.5})+line(XM-14,YT-14,XM,YT-14,{color:INK,w:2.5}));
  s+=cardR(L('上の 辺',890,100,{size:26,color:GRY})+L('一歩：左向き',890,175,{size:28})+mixed([`$${vE}$`,'と 直角'],890,240,{size:28})+fade(seg(p,.5,.65),T('0',890,330,{size:52})),1);
  return s;
 },
 [K+'left']:(p)=>{
  let s=rectFig({hl:3,dimOthers:1,fieldR:.35,inner:.35});
  s+=cardR(L('左の 辺：一歩は 下向き',890,100,{size:26,color:MINUS})+mixed([`$${vE}$`,'と 逆向き'],890,170,{size:28,color:MINUS})+TF(`-${Ey}(x)\\,dy`,890,270,{size:44,g:seg(p,.4,.6)}),1,MINUS);
  return s;
 },
 [K+'bottom']:(p)=>{
  let s=rectFig({hl:0,dimOthers:1,fieldL:.5,fieldR:.5,inner:.35});
  s+=cardR(L('下の 辺',890,100,{size:26,color:GRY})+L('一歩：右向き',890,175,{size:28})+mixed([`$${vE}$`,'と 直角'],890,240,{size:28})+fade(seg(p,.5,.65),T('0',890,330,{size:52})),1);
  return s;
 },
 [K+'sum']:(p)=>{
  let s=rectFig({colors:1});
  s+=cardR(T(`\\oint ${vE}\\cdot ${dr}`,890,95,{size:40})+T(`=${cs(PLUS,'+'+'E_y(x+dx)\\,dy')}+0${cs(MINUS,'-E_y(x)\\,dy')}+0`,890,175,{size:30})
   +TF(`=\\big[${Ey}(x+dx)-${Ey}(x)\\big]\\,dy`,890,290,{size:38,g:seg(p,.35,.55),box:true}),1);
  return s;
 },
 [K+'num']:(p)=>{
  let s=rectFig({vals:[3.0,3.3],inner:.35,heads:0,dims:0});
  s+=label('3.0 V/m',XL-50,YM+30,{size:24,color:EC,anchor:'end'})+label('3.3 V/m',XR+50,YM+30,{size:24,color:EC});
  s+=fade(1,brace(XL,XR,YB+12,{dir:1,color:INK})+label('dx＝1 mm',XM,YB+66,{size:26,color:INK,anchor:'middle'}));
  s+=cardR(L('例',890,95,{size:26,color:DIM})+T(`dx=1${U('mm')}`,890,165,{size:40})+T(`${Ey}:\\ 3.0\\ \\to\\ 3.3${U('V/m')}`,890,245,{size:40,g:1})+fade(seg(p,.55,.7),mixed(['差は',`$0.3${U('V/m')}$`],890,335,{size:36,color:HI,weight:700})),1);
  return s;
 },
 [K+'div']:(p)=>{
  let s=rectFig({vals:[3.0,3.3],inner:.35,heads:0,dims:0});
  s+=cardR(L('差 ÷ 幅',890,95,{size:28,color:HI,weight:700})+TF(`\\dfrac{0.3${U('V/m')}}{0.001${U('m')}}`,890,200,{size:46,frac:true})+TF(`=300${U('V/m^2')}`,890,320,{size:46,g:seg(p,.35,.55),box:true})+fade(seg(p,.6,.75),L('x 方向の 傾き',890,410,{size:28,color:EC})),1);
  return s;
 },
 [K+'approx']:(p)=>{
  let s=rectFig({colors:1});
  s+=cardR(L('dx が 小さければ',890,95,{size:26,color:DIM})+TF(`${Ey}(x+dx)-${Ey}(x)`,890,180,{size:40})+TF(`\\approx ${dEx}\\,dx`,890,300,{size:48,frac:true,g:seg(p,.3,.5)}),1);
  return s;
 },
 [K+'lhs']:(p)=>{
  let s=rectFig({colors:1});
  s+=cardR(L('左辺',890,95,{size:26,color:DIM})+T(`\\oint ${vE}\\cdot ${dr}`,890,175,{size:42})+TF(`\\approx ${dEx}\\,dx\\,dy`,890,300,{size:48,frac:true,g:seg(p,.2,.4),box:true}),1);
  return s;
 },
 [K+'flux']:(p)=>{
  let s=rectFig({colors:1,inner:1,fieldL:.4,fieldR:.4});
  s+=fade(seg(p,.1,.3),rect(XL+3,YT+3,XR-XL-6,YB-YT-6,{fill:CB,fo:.12,stroke:'none'}));
  s+=cardR(L('右辺：貫く 磁束（表 +z）',890,95,{size:26,color:DIM})+TF(`${PB}\\approx ${Bz}\\,dx\\,dy`,890,195,{size:46,g:seg(p,.2,.4)})+fade(seg(p,.6,.75),L('長方形の 中で B は ほぼ 一定',890,300,{size:26,color:CB})),1);
  return s;
 },
 [K+'rhs']:(p)=>{
  let s=rectFig({colors:1,inner:1,fieldL:.4,fieldR:.4});
  s+=cardR(L('長方形は 動かない',890,95,{size:26,color:DIM})+TF(`\\dfrac{d${PB}}{d${tt}}\\approx ${dBt}\\,dx\\,dy`,890,200,{size:44,frac:true})+fade(seg(p,.5,.65),L('ファラデー：負号が 付く',890,300,{size:28,color:HI})+TF(`-${dBt}\\,dx\\,dy`,890,385,{size:44,frac:true})),1);
  return s;
 },
 [K+'divide']:(p)=>{
  const k=seg(p,.35,.6);
  let s=card(60,40,1080,420,L('左辺 ≈ 右辺',600,90,{size:26,color:DIM})+T(`${dEx}\\,dx\\,dy\\ \\approx\\ -${dBt}\\,dx\\,dy`,600,200,{size:52}),1);
  if(k>0){const w1=texWidth(`${dEx}\\,dx\\,dy\\ \\approx\\ -${dBt}\\,dx\\,dy`,52,false),x0=600-w1/2,wa=texWidth(`${dEx}\\,`,52,false),wb=texWidth('dx\\,dy',52,false),wc=texWidth(`${dEx}\\,dx\\,dy\\ \\approx\\ -${dBt}\\,`,52,false);
   s+=fade(k,line(x0+wa-4,225,x0+wa+wb+4,180,{color:BAD,w:4})+line(x0+wc-4,225,x0+wc+wb+4,180,{color:BAD,w:4}));}
  s+=fade(seg(p,.1,.3),L('両辺 ÷ dx dy',600,330,{size:32,color:HI,weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=card(60,40,1080,420,L('極限：dx、dy → 0（≈ が ＝ に）',600,80,{size:26,color:DIM})+TF(RES1,600,235,{size:64,frac:true,box:true}),1,HI);
  s+=fade(seg(p,.4,.55),L('E の 場所の 変化',380,370,{size:28,color:EC,weight:700})+L('＝ −（B の 時間の 変化）',780,370,{size:28,color:CB,weight:700}));
  return s;
 },
 // ===== S4 xz 面・アンペール・マクスウェル =====
 [K+'why']:(p)=>{
  let s=card(80,30,1040,200,L('④ 真空の アンペール・マクスウェル',600,75,{size:26,color:CB,weight:700})+T(AMV,600,165,{size:44}),1);
  s+=fade(seg(p,.4,.6),card(230,260,740,170,mixed([`$${vB}$`,'を 一周で 足す'],600,320,{size:30})+mixed([`$${vB}$`,'の 向き（z）に 沿う 辺が 要る'],600,385,{size:30,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'plane']:(p)=>{
  let s=rectFig({mode:'xz',heads:0,fieldL:0,fieldR:0,inner:0,dims:seg(p,.1,.3)});
  s+=cardR(L('xz 面の 長方形',890,95,{size:28,weight:700})+L('横 dx、縦 dz',890,175,{size:30})+fade(seg(p,.4,.55),L('右が x、上が z',890,265,{size:28}))+fade(seg(p,.6,.75),L('→ y は 画面の 奥向き ⊗',890,330,{size:28,color:HI,weight:700})),1);
  return s;
 },
 [K+'normal']:(p)=>{
  let s=rectFig({mode:'xz',heads:0,fieldL:0,fieldR:0,inner:seg(p,.1,.3)});
  s+=fade(seg(p,.45,.6),inSym(XL+38,YT+38,16,HI)+label('表 +y',XL+38,YT+82,{size:22,color:HI,anchor:'middle'}));
  s+=cardR(L('電気束は y 方向で 数える',890,95,{size:26,color:DIM})+mixed([`$${Ey}$`,'：奥向き ⊗'],890,180,{size:30,color:EC})+fade(seg(p,.45,.6),L('表を +y（奥向き）に 選ぶ',890,280,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'cw']:(p)=>{
  let s=rectFig({mode:'xz',heads:1,fieldL:0,fieldR:0,inner:1});
  s+=inSym(XL+38,YT+38,16,HI)+label('表 +y',XL+38,YT+82,{size:22,color:HI,anchor:'middle'});
  s+=cardR(L('右ねじの 約束',890,95,{size:26,color:DIM})+L('表が 奥向き',890,175,{size:30})+L('↓',890,225,{size:30})+L('画面で 見て 時計回り',890,290,{size:32,color:HI,weight:700}),1);
  return s;
 },
 [K+'left2']:(p)=>{
  let s=rectFig({mode:'xz',hl:3,dimOthers:1,fieldR:.35,inner:.4});
  s+=cardR(L('左の 辺：一歩は 上向き',890,100,{size:26,color:PLUS})+mixed([`$${vB}$`,'と 同じ 向き'],890,170,{size:28,color:PLUS})+TF(`+${Bz}(x)\\,dz`,890,270,{size:44,g:seg(p,.4,.6)}),1,PLUS);
  return s;
 },
 [K+'tb2']:(p)=>{
  let s=rectFig({mode:'xz',hl:-1,colors:0,fieldL:.5,fieldR:.5,inner:.4});
  s+=fade(1,line(XL,YT,XR,YT,{color:GRY,w:7})+line(XL,YB,XR,YB,{color:GRY,w:7}));
  s+=cardR(L('上の 辺・下の 辺',890,100,{size:26,color:GRY})+L('一歩：x 方向',890,175,{size:28})+mixed([`$${vB}$`,'と 直角'],890,240,{size:28})+fade(seg(p,.5,.65),T('0',890,330,{size:52})),1);
  return s;
 },
 [K+'right2b']:(p)=>{
  let s=rectFig({mode:'xz',hl:1,dimOthers:1,fieldL:.35,inner:.4});
  s+=cardR(L('右の 辺：一歩は 下向き',890,100,{size:26,color:MINUS})+mixed([`$${vB}$`,'と 逆向き'],890,170,{size:28,color:MINUS})+TF(`-${Bz}(x+dx)\\,dz`,890,270,{size:44,g:seg(p,.35,.55)}),1,MINUS);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=rectFig({mode:'xz',colors:1});
  s+=cardR(T(`\\oint ${vB}\\cdot ${dr}`,890,95,{size:40})+TF(`=\\big[${Bz}(x)-${Bz}(x+dx)\\big]\\,dz`,890,185,{size:36})
   +fade(seg(p,.35,.5),L('引く 順が 逆',890,255,{size:26,color:HI}))+TF(`\\approx -${dBx}\\,dx\\,dz`,890,375,{size:46,frac:true,g:seg(p,.5,.7),box:true}),1);
  return s;
 },
 [K+'rhs2']:(p)=>{
  let s=rectFig({mode:'xz',colors:1,inner:1,fieldL:.4,fieldR:.4});
  s+=fade(seg(p,.05,.25),rect(XL+3,YT+3,XR-XL-6,YB-YT-6,{fill:EC,fo:.10,stroke:'none'}));
  s+=cardR(L('右辺：電気束（表 +y）',890,95,{size:26,color:DIM})+TF(`${PE}\\approx ${Ey}\\,dx\\,dz`,890,180,{size:44,g:seg(p,.1,.3)})
   +TF(`${mu}${eps}\\dfrac{d${PE}}{d${tt}}\\approx ${mu}${eps}${dEt}\\,dx\\,dz`,890,320,{size:38,frac:true,g:seg(p,.4,.6)}),1);
  return s;
 },
 [K+'result2']:(p)=>{
  let s=card(60,40,1080,420,L('dx dz で 割って 極限',600,80,{size:26,color:DIM})+TF(RES2,600,235,{size:64,frac:true,box:true}),1,HI);
  s+=fade(seg(p,.5,.65),L('B は z 成分、E は y 成分',600,370,{size:28,color:INK}));
  return s;
 },
 [K+'sign']:(p)=>{
  let s=rectFig({mode:'xz',colors:1,hl:1});
  s+=inSym(XL+38,YT+38,16,HI)+label('表 +y',XL+38,YT+82,{size:22,color:HI,anchor:'middle'});
  s+=cardR(L('負号は どこから？',890,95,{size:28,color:HI,weight:700})+L('表 +y → 時計回り',890,180,{size:28})+L('x が 大きい 右の 辺を',890,250,{size:28,color:MINUS})+L('−z 向きに たどる',890,300,{size:30,color:MINUS,weight:700})+fade(seg(p,.6,.75),TF(`-${dBx}`,890,395,{size:44,frac:true})),1);
  return s;
 },
 [K+'flip']:(p)=>{
  let s=card(60,40,1080,420,L('表を −y に 選ぶと',600,90,{size:28,color:DIM})+T(`${dBx}=-${mu}${eps}${dEt}`,600,200,{size:52})
   +fade(seg(p,.3,.45),L('両辺に −1 を 掛けると',600,300,{size:26,color:DIM})+T(RES2,600,380,{size:46})),1);
  s+=fade(seg(p,.6,.75),L('同じ 式',1000,390,{size:30,color:HI,weight:700}));
  return s;
 },
 // ===== S5 2本の式 =====
 [K+'pair']:(p)=>{
  let s=card(60,30,1080,200,L('1本目（ファラデー）',230,80,{size:26,color:EC,weight:700})+TF(RES1,700,140,{size:54,frac:true}),1,EC);
  s+=card(60,260,1080,200,L('2本目（アンペール・マクスウェル）',285,305,{size:22,color:CB,weight:700})+TF(RES2,700,370,{size:54,frac:true}),seg(p,.3,.45),CB);
  s+=fade(seg(p,.15,.3),L('E の 場所 ↔ B の 時間',230,190,{size:24,color:INK}))+fade(seg(p,.5,.65),L('B の 場所 ↔ E の 時間',230,420,{size:24,color:INK}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(60,40,1080,420,TF(RES1,600,120,{size:50,frac:true})+L('単位',600,210,{size:26,color:DIM})
   +fade(seg(p,.1,.25),T(`\\mathrm{V/m^2}`,330,300,{size:44})+L('左辺',330,370,{size:26,color:EC}))
   +fade(seg(p,.35,.55),T(`\\mathrm{T/s}=\\dfrac{\\mathrm{V\\cdot s/m^2}}{\\mathrm{s}}=\\mathrm{V/m^2}`,820,300,{size:40})+L('右辺（T＝V·s/m²）',820,385,{size:26,color:CB})),1);
  return s;
 },
 [K+'limit']:(p)=>{
  let s=card(60,40,1080,420,L('途中：有限の 長方形',600,95,{size:26,color:DIM})+T(`${dEx}\\,dx\\,dy\\ \\approx\\ -${dBt}\\,dx\\,dy`,600,175,{size:44})
   +fade(seg(p,.4,.55),L('極限：dx、dy → 0',600,270,{size:26,color:DIM})+T(RES1,600,385,{size:50})),1);
  s+=fade(seg(p,.2,.35),label('≈',1040,185,{size:44,color:HI,anchor:'middle'}))+fade(seg(p,.6,.75),label('＝',1040,395,{size:44,color:HI,anchor:'middle'}));
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=rectFig({colors:1,g:.9});
  s+=cardR(L('まとめ',890,95,{size:26,color:DIM})+L('小さな 長方形の 一周',890,170,{size:28})+L('→ 向かい合う 辺の 差',890,230,{size:28,color:HI})+fade(seg(p,.4,.55),L('÷ 面積 → 偏微分',890,310,{size:30,color:HI,weight:700})),1);
  return s;
 },
 [K+'sum2b']:(p)=>{
  let s=card(60,30,1080,200,L('ファラデー',230,80,{size:26,color:EC,weight:700})+TF(RES1,700,140,{size:54,frac:true}),1,EC);
  s+=card(60,260,1080,200,L('アンペール・マクスウェル',230,310,{size:24,color:CB,weight:700})+TF(RES2,700,370,{size:54,frac:true}),1,CB);
  s+=fade(seg(p,.5,.65),L('負号：表と 回る 向きの 約束',230,420,{size:22,color:HI}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=card(60,30,1080,170,TF(RES1,330,120,{size:46,frac:true})+TF(RES2,820,120,{size:46,frac:true}),1);
  s+=card(200,240,800,220,L('次の 問い',600,290,{size:26,color:DIM})+L('B を 消すと、E だけの 式は？',600,355,{size:32,color:EC,weight:700})+L('どんな 速さの 波？',600,415,{size:32,color:HI,weight:700}),seg(p,.1,.25),HI);
  return s;
 },
};
