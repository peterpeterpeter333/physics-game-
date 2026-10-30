// YouTube シリーズ「電磁誘導・上級 1/2」(ys-ue-faraday-1) — 図。Stage 1200×515.
// 長いコイルは横から見た図：軸は左右。中の 𝐁 は右向き。各巻きの手前側（右半分の弧）の電流は下向き（右ねじ：x̂×ẑ＝−ŷ）。
// 回路記号のコイル：電流 I は左の端子から入り、右の端子から出る。I が増えるとき、端子電圧 V＝＋L dI/dt（入る側＋）、
//   電流の向きに数えた起電力 ℰ＝−L dI/dt（押し戻す向き＝左向きの紫の矢印）。
// 色：電流 I・i と巻き線 緑、起電力 ℰ・電圧 V 紫、𝐁 橙、磁束 Φ・Ψ 黄、エネルギー U・仕事率 P 橙、時間 t 金、L・n・A・ℓ 白、負・誤り 赤。
// 2/2 でも使う部品は export する（関数の export は図の登録に入らない）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,highlight,texWidth} from './anim.mjs';
import {head,outSym,inSym,arcPts,graph} from './yt1-um-induction-1-diagrams.mjs';
import {T,cs,card,TF} from './yt1-ue-capacitor-1-diagrams.mjs';
export {T,cs,card,TF,head,outSym,inSym,arcPts,graph};

const K='ue-faraday-1:';
export const CI=C.F,EMF=C.v,CB=C.E,PHI=C.hi,WC=C.E,TC=C.t,BAD=C.a,OK=C.F,INK=C.ink,DIM=C.dim,ELC='#7fb3ff';
export const LM=(s,x,y,o={})=>label(s,x,y,{size:26,color:INK,anchor:'middle',...o});
// TeX pieces
export const Ic=cs(CI,'I'),ic=cs(CI,'i'),EM=cs(EMF,'\\mathcal{E}'),Vt=cs(EMF,'V'),PS=cs(PHI,'\\Psi'),PH=cs(PHI,'\\Phi'),Bt=cs(CB,'B'),Ut=cs(WC,'U'),Pt=cs(WC,'P'),tt=cs(TC,'t');
export const dIdt=`\\dfrac{d${Ic}}{d${tt}}`,didt=`\\dfrac{d${ic}}{d${tt}}`,U_=s=>`\\,\\mathrm{${s}}`;
export const BACK=`${EM}=-L\\,${dIdt}`,TERM=`${Vt}=+L\\,${dIdt}`,UL=`${Ut}=\\tfrac12 L${Ic}^2`;

// ---- long coil, side view ---------------------------------------------------------------------------------
// turns are narrow ellipses; back half (left arc) dim, front half (right arc) bright with a downward arrowhead.
export function solenoid({x0=110,x1=530,cy=255,ry=105,rx=15,n=12,g=1,curG=1,Bg=1,Bw=4,hl=[],hlCol=PHI,area=0,areaAt=-1,leads=1,ilab=1,col=CI,glow=0,Bk=1,heads=1,blab=1,up=0,headCol=null}={}){
 let s='';
 const xs=Array.from({length:n},(_,i)=>x0+(x1-x0)*(i+.5)/n);
 if(glow>0)s+=fade(glow,rect(x0-10,cy-ry,x1-x0+20,2*ry,{fill:WC,fo:.22,stroke:'none',rx:20})+rect(x0-40,cy-ry-30,x1-x0+80,2*ry+60,{fill:WC,fo:.08,stroke:'none',rx:40}));
 xs.forEach((x,i)=>{const on=hl.includes(i);s+=draw(arcPts(x,cy,rx,ry,90,270,24),1,{color:on?hlCol:col,w:on?4:3,opacity:on?.8:.4});});
 if(area>0){const xa=areaAt>=0?xs[areaAt]:(x0+x1)/2;s+=fade(area,`<ellipse cx="${xa}" cy="${cy}" rx="${rx+6}" ry="${ry-4}" fill="${PHI}" fill-opacity=".35" stroke="${PHI}" stroke-width="3"/>`);}
 if(Bg>0){const ys=[-.62,-.21,.21,.62];for(const k of ys){const y=cy+k*ry;s+=fade(Bg,arrow(x0-30,y,x1+60,y,{color:CB,w:Bw*Bk,head:12+4*Bk,opacity:.9}));}
  if(blab)s+=fade(Bg,label('B',x1+72,cy-ry*.62+8,{size:28,color:CB,weight:700}));}
 xs.forEach((x,i)=>{const on=hl.includes(i);s+=draw(arcPts(x,cy,rx,ry,-90,90,24),1,{color:on?hlCol:col,w:on?6:5});
  if(heads&&curG>0)s+=fade(curG,up?head(x+rx,cy-8,0,-1,{color:headCol||(on?hlCol:col),L:14}):head(x+rx,cy+8,0,1,{color:headCol||(on?hlCol:col),L:14}));});
 if(leads){s+=draw([[xs[0],cy-ry],[xs[0]-30,cy-ry-40],[x0-80,cy-ry-40]],1,{color:col,w:4});
  s+=draw([[xs[n-1],cy+ry],[xs[n-1]+30,cy+ry+40],[x1+80,cy+ry+40]],1,{color:col,w:4});
  if(ilab&&curG>0)s+=fade(curG,head(x0-30,cy-ry-40,1,0,{color:col,L:20})+label('I',x0-62,cy-ry-52,{size:30,color:col,weight:700}));}
 return fade(g,s);
}
// ---- inductor as a circuit element (horizontal) --------------------------------------------------------------
export const IND={xa:70,x1:240,x2:520,xb:690,y:270};
export function inductor({g=1,cur=0,curUp=1,curText='',emf=0,pol=0,vbr=0,src=0,y=IND.y,x1=IND.x1,x2=IND.x2,xa=IND.xa,xb=IND.xb,coilCol=CI}={}){
 let s=line(xa,y,x1,y,{color:DIM,w:4})+line(x2,y,xb,y,{color:DIM,w:4});
 const nh=4,r=(x2-x1)/(2*nh);let pts=[];
 for(let k=0;k<nh;k++){const cx=x1+r+2*r*k;pts=pts.concat(arcPts(cx,y,r,r*1.2,180,0,20));}
 s+=draw(pts,1,{color:coilCol,w:5});
 s+=dot(x1,y,7,INK)+dot(x2,y,7,INK);
 if(cur>0)s+=fade(cur,arrow(xa+20,y,xa+130,y,{color:CI,w:5,head:16})+label(curText||(curUp?'I（増加中）':'I'),xa+20,y+44,{size:26,color:CI,weight:700}));
 if(emf>0){const ya=y-r*1.2-60;s+=fade(emf,arrow(x2-10,ya,x1+10,ya,{color:EMF,w:6,head:18})+label('押し戻す 向き',(x1+x2)/2,ya-22,{size:24,color:EMF,anchor:'middle',weight:700}));}
 if(pol>0)s+=fade(pol,label('＋',x1-26,y-26,{size:34,color:EMF,anchor:'middle',weight:700})+label('−',x2+26,y-24,{size:38,color:EMF,anchor:'middle',weight:700}));
 if(vbr>0){const yb=y+70;s+=fade(vbr,line(x1,yb-12,x1,yb+12,{color:EMF,w:3})+line(x2,yb-12,x2,yb+12,{color:EMF,w:3})+arrow(x1,yb,x2-4,yb,{color:EMF,w:3,head:12})+label('入る 端子 → 出る 端子：電位の 下がり',(x1+x2)/2,yb+40,{size:22,color:EMF,anchor:'middle'}));}
 if(src>0){// a source on the left pushing current in
  const bx=xa+60;s+=fade(src,line(bx-8,y-30,bx-8,y+30,{color:INK,w:5})+line(bx+8,y-16,bx+8,y+16,{color:INK,w:9})+label('電源',bx,y-46,{size:22,color:DIM,anchor:'middle'}));}
 return fade(g,s);
}
// ---- L i – i graph (triangle) -------------------------------------------------------------------------------
export function LIgraph({x=90,y=440,w=470,h=330,g=1,line_=1,strips=0,n=8,hl=-1,tri=0,lab=1,nums=0}={}){
 const X=u=>x+w*u/1.15,Y=u=>y-h*u/1.15;
 let s=arrow(x-6,y,x+w+20,y,{color:DIM,w:2.5,head:12})+arrow(x,y+6,x,y-h-20,{color:DIM,w:2.5,head:12});
 if(tri)s+=fade(tri,poly([[X(0),Y(0)],[X(1),Y(0)],[X(1),Y(1)]],{fill:WC,fo:.3,stroke:WC,sw:2}));
 if(strips>0){for(let i=0;i<n;i++){const u0=i/n,on=i===hl;s+=fade(strips,rect(X(u0),Y(u0),X(u0+1/n)-X(u0),Y(0)-Y(u0),{fill:on?C.hi:WC,fo:on?.5:.3,stroke:on?C.hi:WC,sw:1.5,rx:0}));}}
 if(line_)s+=fade(line_,line(X(0),Y(0),X(1.08),Y(1.08),{color:INK,w:4}));
 if(lab){s+=label('i',x+w+30,y+8,{size:30,color:CI,weight:700})+T(`L\\,${ic}`,x,y-h-40,{size:30});
  s+=line(X(1),y-6,X(1),y+6,{color:DIM})+line(x-6,Y(1),x+6,Y(1),{color:DIM});
  if(nums){s+=label('2 A',X(1),y+32,{size:24,color:CI,anchor:'middle',weight:700})+label('0.2 Wb',x-10,Y(1)+8,{size:22,color:INK,anchor:'end'});}
  else{s+=T(Ic,X(1),y+30,{size:28})+T(`L${Ic}`,x-30,Y(1),{size:28});}}
 return {svg:fade(g,s),X,Y};
}
// ---- equation helpers ----------------------------------------------------------------------------------------
const box=(x,y,w,h,col=C.hi,g=1)=>highlight(x,y,w,h,g,col);
function rowsCard(x,y,w,h,rows,g=1,title=''){
 let s=title?LM(title,x+w/2,y+44,{size:24,color:DIM}):'';
 return card(x,y,w,h,s+rows,g);
}

export const ytUeFaraday1Diagrams={
 // ===== S1 前回の問い =====
 [K+'prev']:(p)=>{
  let s=solenoid({curG:seg(p,0,.2),Bg:seg(p,.15,.35)});
  s+=card(720,80,440,340,LM('アンペールの法則・上級 3/3',940,125,{size:22,color:DIM})
   +T(`${Bt}=\\mu_0 n${Ic}`,940,215,{size:54})
   +LM('長い コイルの 中：一様',940,290,{size:26,color:INK})
   +fade(seg(p,.55,.7),LM('磁場は 電流で 決まる',940,360,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  const k=1+.25*Math.sin(p*Math.PI*4);
  let s=solenoid({Bk:k});
  s+=card(720,80,440,340,LM('前回の 最後の 問い',940,125,{size:22,color:DIM})
   +LM('電流を 変える → 磁束が 変わる',940,190,{size:24,color:INK})
   +LM('→ コイル 自身に 起電力',940,240,{size:26,color:EMF,weight:700})
   +fade(seg(p,.5,.65),LM('コイルが 持つ',940,310,{size:28,color:INK})+LM('「電流の 慣性」とは？',940,360,{size:34,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  const hl=p<.25?[]:Array.from({length:12},(_,i)=>i).filter(i=>i<=Math.floor(seg(p,.25,.6)*12));
  let s=solenoid({area:seg(p,.05,.2),areaAt:0,hl});
  s+=fade(seg(p,.05,.2),label('Φ（1巻き）',125,400,{size:26,color:PHI,weight:700,anchor:'middle'}));
  s+=card(720,80,440,340,LM('中級',940,125,{size:22,color:DIM})
   +LM('Φ：1巻きを 貫く 磁束',940,190,{size:26,color:PHI})
   +fade(seg(p,.45,.6),T(`${PS}=N${PH}`,940,275,{size:52}))
   +fade(seg(p,.6,.75),LM('鎖交磁束（全部の 巻きの 合計）',940,355,{size:24,color:PHI,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'recall2']:(p)=>{
  let s=solenoid({hl:Array.from({length:12},(_,i)=>i),Bg:.8});
  s+=card(720,80,440,340,LM('ファラデーの 法則',940,130,{size:26,color:INK,weight:700})
   +T(`${EM}=-\\dfrac{d${PS}}{d${tt}}`,940,230,{size:54})
   +fade(seg(p,.4,.55),LM('実験に 支えられた 原理',940,330,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=LM('今回の 道すじ',600,80,{size:28,color:DIM});
  const rows=[['① L を 定義する：Ψ ＝ LI',PHI],['② 符号の 2つの 数え方：',EMF],['③ コイルの エネルギー U ＝ ？',WC]];
  rows.forEach(([t,c],i)=>{s+=fade(seg(p,.1+i*.2,.25+i*.2),card(250,120+i*115,700,90,label(t,290,175+i*115,{size:34,color:c,weight:700}),1)+(i===1?T(EM,762,165+i*115,{size:38})+label('と V',792,175+i*115,{size:34,color:c,weight:700}):''));});
  return s;
 },
 // ===== S2 L の定義 =====
 [K+'coil']:(p)=>{
  const hl=p<.6?[]:Array.from({length:12},(_,i)=>i);
  let s=solenoid({curG:seg(p,0,.25),Bg:seg(p,.25,.5),hl});
  s+=card(720,90,440,320,LM('電流 I を 流す',940,150,{size:28,color:CI,weight:700})
   +fade(seg(p,.25,.4),LM('→ 中に 磁場 B',940,220,{size:28,color:CB,weight:700}))
   +fade(seg(p,.55,.7),LM('→ 自分の 巻きを 貫く',940,290,{size:28,color:PHI,weight:700})+LM('（鎖交磁束 Ψ）',940,340,{size:24,color:PHI})),seg(p,0,.15));
  return s;
 },
 [K+'prop']:(p)=>{
  const u=.5+.5*seg(p,.3,.7);// current grows from 1 to 2 (in units)
  let s=solenoid({x0:80,x1:400,ry:85,n:9,Bk:.6+.5*(u-.5)*2,cy:250,hl:Array.from({length:9},(_,i)=>i)});
  // Ψ–I graph
  const gx=600,gy=430,gw=480,gh=300;
  s+=arrow(gx-6,gy,gx+gw+20,gy,{color:DIM,w:2.5,head:12})+arrow(gx,gy+6,gx,gy-gh-20,{color:DIM,w:2.5,head:12});
  s+=label('I',gx+gw+30,gy+8,{size:30,color:CI,weight:700})+label('Ψ',gx-10,gy-gh-30,{size:30,color:PHI,weight:700,anchor:'end'});
  s+=line(gx,gy,gx+gw*.95,gy-gh*.95,{color:INK,w:4});
  const px=gx+gw*.9*u,py=gy-gh*.9*u;s+=dot(px,py,10,C.hi)+line(px,gy,px,py,{color:CI,w:2,dash:'6 6'})+line(gx,py,px,py,{color:PHI,w:2,dash:'6 6'});
  s+=fade(seg(p,.6,.8),label('I が 2倍 → Ψ も 2倍',gx+40,gy-gh+10,{size:28,color:C.hi,weight:700}));
  s+=label('鉄心なし・形は 一定',240,470,{size:24,color:DIM,anchor:'middle'});
  return s;
 },
 [K+'def']:(p)=>{
  const gx=110,gy=430,gw=440,gh=300;
  let s=arrow(gx-6,gy,gx+gw+20,gy,{color:DIM,w:2.5,head:12})+arrow(gx,gy+6,gx,gy-gh-20,{color:DIM,w:2.5,head:12});
  s+=label('I',gx+gw+30,gy+8,{size:30,color:CI,weight:700})+label('Ψ',gx-10,gy-gh-30,{size:30,color:PHI,weight:700,anchor:'end'});
  s+=line(gx,gy,gx+gw*.95,gy-gh*.95,{color:INK,w:4});
  // slope triangle
  const a=[gx+gw*.4,gy-gh*.4],b=[gx+gw*.7,gy-gh*.4],c=[gx+gw*.7,gy-gh*.7];
  s+=fade(seg(p,.1,.3),draw([a,b,c],1,{color:C.hi,w:3})+label('傾き ＝ L',b[0]+16,(b[1]+c[1])/2+8,{size:28,color:INK,weight:700}));
  s+=card(660,70,500,380,LM('定義（線形の コイル）',910,115,{size:24,color:DIM})
   +T(`${PS}=L${Ic}`,910,200,{size:60})
   +fade(seg(p,.35,.5),LM('L：自己インダクタンス',910,285,{size:28,color:INK,weight:700}))
   +fade(seg(p,.6,.75),T(`1\\,\\mathrm{H}=1\\,\\mathrm{Wb/A}`,910,370,{size:40})+LM('（ヘンリー）',910,420,{size:22,color:DIM})),seg(p,0,.15));
  s+=box(810,150,200,90,C.hi,seg(p,.15,.3));
  return s;
 },
 [K+'notPhi']:(p)=>{
  let s=solenoid({x0:70,x1:450,ry:85,n:8,cy:230,area:1,areaAt:3,Bg:.5,leads:0,curG:0});
  s+=fade(seg(p,.35,.55),solenoid({x0:690,x1:1070,ry:85,n:8,cy:230,hl:[0,1,2,3,4,5,6,7],Bg:.5,leads:0,curG:0}));
  s+=LM('Φ：1巻きを 貫く 磁束',260,370,{size:28,color:PHI,weight:700});
  s+=fade(seg(p,.35,.55),LM('Ψ：全部の 巻きの 合計',880,370,{size:28,color:PHI,weight:700})+LM('（同じ Φ が N 巻きなら NΦ）',880,410,{size:24,color:PHI}));
  s+=fade(seg(p,.6,.75),LM('Ψ ＝ LI の L は、全部の 巻きの 分を まとめた 定数',600,480,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.35,.55),label('≠',570,250,{size:60,color:BAD,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sol1']:(p)=>{
  let s=solenoid({area:seg(p,.4,.6),areaAt:5});
  s+=fade(seg(p,.45,.6),label('断面積 A',302,135,{size:26,color:INK,weight:700,anchor:'middle'}));
  s+=card(720,80,440,340,LM('長い コイル（前回）',940,125,{size:22,color:DIM})
   +T(`${Bt}=\\mu_0 n${Ic}`,940,200,{size:46})
   +fade(seg(p,.45,.6),LM('1巻きを 貫く 磁束',940,270,{size:24,color:PHI}))
   +fade(seg(p,.55,.75),T(`${PH}=${Bt}A=\\mu_0 n${Ic}A`,940,345,{size:42})),seg(p,0,.15));
  return s;
 },
 [K+'sol2']:(p)=>{
  const k=Math.floor(seg(p,.15,.5)*12);
  let s=solenoid({hl:Array.from({length:12},(_,i)=>i).filter(i=>i<k),area:.6,areaAt:5,ilab:0});
  s+=line(110,410,530,410,{color:INK,w:2})+line(110,400,110,420,{color:INK,w:2})+line(530,400,530,420,{color:INK,w:2})+label('長さ ℓ',320,450,{size:28,color:INK,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),label('巻きは nℓ 個',320,495,{size:26,color:PHI,anchor:'middle',weight:700}));
  s+=card(720,80,440,340,LM('どの 巻きも 同じ Φ',940,130,{size:26,color:PHI})
   +fade(seg(p,.5,.7),T(`${PS}=n\\ell\\times ${PH}`,940,215,{size:44}))
   +fade(seg(p,.65,.85),T(`=n\\ell\\times\\mu_0 n${Ic}A`,940,310,{size:42})),seg(p,0,.15));
  return s;
 },
 [K+'sol3']:(p)=>{
  let s=TF(`${PS}=n\\ell\\times\\mu_0 n${Ic}A`,600,85,{size:44});
  s+=fade(seg(p,.05,.2),LM('掛ける 順を 並べ替える',1000,95,{size:24,color:DIM}));
  s+=TF(`${PS}=(\\mu_0 n^2A\\ell)\\times${Ic}`,600,215,{size:52,g:seg(p,.15,.35)});
  s+=fade(seg(p,.4,.55),TF(`${PS}=\\;L\\;\\times${Ic}`,600,320,{size:40,col:DIM})+LM('と 見比べる',900,328,{size:24,color:DIM,anchor:'start'}));
  s+=TF(`L=\\mu_0 n^2A\\ell`,600,440,{size:58,box:true,g:seg(p,.6,.8)});
  return s;
 },
 [K+'n2']:(p)=>{
  let s=label('n',60,140,{size:30,color:INK,weight:700})+solenoid({x0:110,x1:470,ry:70,n:6,cy:140,leads:0,Bk:.6,Bw:4,hl:[]});
  s+=fade(seg(p,.1,.3),label('2n',50,370,{size:30,color:INK,weight:700})+solenoid({x0:110,x1:470,ry:70,n:12,cy:370,leads:0,Bk:1.2,Bw:4}));
  s+=card(680,70,480,380,LM('巻きを 2倍に 密にすると',920,120,{size:26,color:INK})
   +fade(seg(p,.3,.45),LM('中の 磁場 B：2倍',920,200,{size:30,color:CB,weight:700}))
   +fade(seg(p,.45,.6),LM('それが 貫く 巻きの 数：2倍',920,265,{size:30,color:PHI,weight:700}))
   +fade(seg(p,.65,.8),LM('→ L は 2 × 2 ＝ 4倍',920,350,{size:34,color:C.hi,weight:700})+T(`L\\propto n^2`,920,415,{size:36})),seg(p,0,.15));
  return s;
 },
 [K+'num']:(p)=>{
  let s=card(100,40,1000,430,'',1);
  s+=T(`n=1000\\,\\mathrm{/m}\\ \\Rightarrow\\ n^2=10^{6}\\,\\mathrm{/m^2}`,600,105,{size:34});
  s+=T(`A=10^{-3}\\,\\mathrm{m^2},\\quad \\ell=0.2\\,\\mathrm{m}`,600,170,{size:34});
  s+=TF(`L=\\mu_0 n^2A\\ell`,600,260,{size:44,g:seg(p,.3,.45)});
  s+=TF(`=4\\pi\\times10^{-7}\\times10^{6}\\times10^{-3}\\times0.2`,600,370,{size:44,g:seg(p,.5,.7)});
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(100,40,1000,430,'',1);
  s+=TF(`L=4\\pi\\times10^{-7}\\times10^{6}\\times10^{-3}\\times0.2`,600,110,{size:38});
  s+=TF(`=4\\pi\\times10^{-4}\\times0.2`,600,210,{size:42,g:seg(p,.05,.25)});
  s+=TF(`\\approx 2.5\\times10^{-4}\\,\\mathrm{H}`,600,320,{size:52,box:true,g:seg(p,.25,.45)});
  s+=fade(seg(p,.55,.7),LM('巻数 nℓ ＝ 1000 × 0.2 ＝ 200 回',600,430,{size:30,color:PHI,weight:700}));
  return s;
 },
 // ===== S3 逆起電力と端子電圧 =====
 [K+'law']:(p)=>{
  const k=1+.3*seg(p,.1,.9);
  let s=solenoid({Bk:k,hl:Array.from({length:12},(_,i)=>i)});
  s+=fade(seg(p,.1,.3),label('I が 変わる → Ψ が 変わる',320,480,{size:26,color:INK,anchor:'middle',weight:700}));
  s+=card(720,80,440,340,LM('ファラデーの 法則',940,130,{size:26,color:INK})
   +fade(seg(p,.5,.65),T(`${EM}=-\\dfrac{d${PS}}{d${tt}}`,940,240,{size:54}))
   +fade(seg(p,.6,.75),LM('コイル 自身に 起電力',940,345,{size:28,color:EMF,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=TF(`${EM}=-\\dfrac{d${PS}}{d${tt}}`,600,85,{size:44});
  s+=fade(seg(p,.05,.2),LM('Ψ ＝ LI を 代入',960,95,{size:24,color:PHI}));
  s+=TF(`=-\\dfrac{d(L${Ic})}{d${tt}}`,600,215,{size:48,g:seg(p,.1,.3)});
  s+=fade(seg(p,.35,.5),LM('L 一定 → 外へ',960,225,{size:24,color:INK}));
  s+=TF(BACK,600,385,{size:58,box:true,frac:true,g:seg(p,.45,.65)});
  s+=fade(seg(p,.7,.85),LM('自己誘導の 起電力',600,490,{size:26,color:EMF,weight:700}));
  return s;
 },
 [K+'dir']:(p)=>{
  let s=inductor({cur:1,emf:seg(p,.3,.5)});
  s+=card(740,70,420,380,LM('電流の 向きに 沿って 数える',950,120,{size:24,color:DIM})
   +T(BACK,950,210,{size:44})
   +fade(seg(p,.25,.4),label('I が 増える →',935,310,{size:30,color:EMF,weight:700,anchor:'end'})+T(`${EM}<0`,1000,300,{size:36}))
   +fade(seg(p,.6,.75),LM('逆起電力',950,380,{size:36,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'term']:(p)=>{
  let s=inductor({cur:1,pol:seg(p,.3,.5),vbr:seg(p,.45,.65)});
  s+=card(740,70,420,380,LM('端子電圧（初級と 同じ）',950,120,{size:24,color:DIM})
   +T(TERM,950,210,{size:44})
   +fade(seg(p,.35,.5),LM('I が 増える → 入る 側が ＋',950,305,{size:28,color:EMF,weight:700}))
   +fade(seg(p,.6,.75),LM('入る 端子 − 出る 端子',950,375,{size:26,color:INK})),seg(p,0,.15));
  return s;
 },
 [K+'same']:(p)=>{
  let s=inductor({cur:1,emf:1,pol:1});
  s+=card(740,60,420,400,T(BACK,950,135,{size:36})+LM('電流の 向きに 数える',950,195,{size:22,color:DIM})
   +T(TERM,950,275,{size:36})+LM('入る 端子 − 出る 端子',950,335,{size:22,color:DIM})
   +fade(seg(p,.2,.35),LM('同じ 現象を 逆向きに 数えた',950,410,{size:26,color:C.hi,weight:700})),1);
  s+=fade(seg(p,.55,.7),LM('電源は この 電圧に 逆らって 押し込む',380,440,{size:26,color:INK,weight:700}));
  return s;
 },
 [K+'graph']:(p)=>shapeGraphs(p,{draw_:seg(p,.1,.7)}),
 [K+'flat']:(p)=>shapeGraphs(p,{draw_:1,marks:seg(p,.05,.3),flat:seg(p,.4,.6),msg:seg(p,.65,.8)}),
 [K+'ex']:(p)=>exGraphs(p,{iG:seg(p,.2,.6),eG:0}),
 [K+'ex2']:(p)=>exGraphs(p,{iG:1,eG:seg(p,.3,.5),calc:1}),
 [K+'inertia']:(p)=>{
  let s=card(110,60,980,400,'',1);
  s+=LM('力学',300,130,{size:26,color:DIM})+LM('コイル',900,130,{size:26,color:DIM});
  s+=T(`F=m\\,\\dfrac{dv}{d${tt}}`,300,230,{size:50,auto:true});
  s+=T(`${Vt}=L\\,${dIdt}`,900,230,{size:50});
  s+=fade(seg(p,.2,.35),LM('m ↔ L',600,200,{size:30,color:INK,weight:700})+LM('v ↔ I',600,250,{size:30,color:INK,weight:700}));
  s+=fade(seg(p,.35,.5),LM('速度の 変化に 逆らう',300,330,{size:26,color:INK})+LM('電流の 変化に 逆らう',900,330,{size:26,color:INK}));
  s+=fade(seg(p,.6,.75),LM('「電流の 慣性」',600,420,{size:38,color:C.hi,weight:700}));
  return s;
 },
 // ===== S4 エネルギー =====
 [K+'eask']:(p)=>{
  let s=inductor({cur:1,pol:1});
  s+=card(740,90,420,330,LM('I を 0 から I まで 増やす',950,150,{size:26,color:INK})
   +LM('電源は 逆らって 仕事を する',950,210,{size:26,color:INK})
   +fade(seg(p,.4,.55),LM('その 仕事は',950,290,{size:30,color:WC,weight:700})+LM('どこへ？',950,345,{size:36,color:C.hi,weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'power']:(p)=>{
  let s=inductor({cur:1,pol:1,y:200,xa:150,x1:320,x2:600,xb:770,curText:'i（途中の 電流）'});
  s+=fade(seg(p,0,.15),label('i は 小文字：途中の 電流',150,95,{size:26,color:CI,weight:700}));
  s+=TF(`${Pt}=${Vt}\\,${ic}`,450,370,{size:46,g:seg(p,.25,.4)});
  s+=fade(seg(p,.3,.45),LM('端子電圧 × 電流',450,450,{size:24,color:DIM}));
  s+=TF(`=L\\,${ic}\\,${didt}`,800,370,{size:46,g:seg(p,.55,.75)});
  return s;
 },
 [K+'dU']:(p)=>{
  const c=seg(p,.4,.55)>.5;
  let s=TF(`d${Ut}=${Pt}\\,d${tt}`,600,85,{size:46});
  s+=fade(seg(p,.05,.2),LM('短い 時間 dt の 仕事',960,95,{size:24,color:DIM}));
  const dt=c?`{\\color{${BAD}}{\\cancel{d${tt}}}}`:`d${tt}`;
  s+=TF(`=L\\,${ic}\\,\\dfrac{d${ic}}{${dt}}\\,${dt}`,600,230,{size:50,g:seg(p,.15,.35)});
  s+=TF(`d${Ut}=L\\,${ic}\\,d${ic}`,600,410,{size:60,box:true,g:seg(p,.6,.8)});
  return s;
 },
 [K+'strip']:(p)=>{
  const n=8,hl=5;const {svg,X,Y}=LIgraph({strips:seg(p,.2,.5),n,hl});
  let s=svg;const u0=hl/n;
  s+=fade(seg(p,.4,.6),label('L i',X(u0)-10,Y(u0/2)+8,{size:24,color:INK,anchor:'end'})+label('di',X(u0+.5/n),Y(0)+32,{size:24,color:CI,anchor:'middle'}));
  s+=card(640,90,520,330,LM('細い 短冊 1本',900,140,{size:26,color:DIM})
   +T(`d${Ut}=L\\,${ic}\\times d${ic}`,900,240,{size:46})
   +LM('高さ × 幅 ＝ 仕事',900,340,{size:28,color:WC,weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'tri']:(p)=>{
  const {svg}=LIgraph({tri:1});
  let s=svg;
  s+=fade(seg(p,.5,.65),label('傾き L',130,300,{size:28,color:INK,weight:700}));
  // inset: capacitor V–q triangle
  const ix=720,iy=380,iw=200,ih=170;
  let inset=arrow(ix,iy,ix+iw+14,iy,{color:DIM,w:2,head:10})+arrow(ix,iy,ix,iy-ih-14,{color:DIM,w:2,head:10})
   +poly([[ix,iy],[ix+iw*.85,iy],[ix+iw*.85,iy-ih*.85]],{fill:WC,fo:.3,stroke:WC,sw:2})+line(ix,iy,ix+iw*.92,iy-ih*.92,{color:EMF,w:3})
   +label('q',ix+iw+24,iy+6,{size:22,color:C.p,weight:700})+label('電圧',ix,iy-ih-26,{size:22,color:EMF,anchor:'middle'});
  s+=card(640,60,520,400,LM('コンデンサ・上級 1/2',900,105,{size:22,color:DIM})+inset+label('½CV²',ix+iw+40,iy-80,{size:28,color:WC,weight:700}),seg(p,0,.2));
  s+=fade(seg(p,.25,.4),LM('同じ 三角形',900,445,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'int']:(p)=>{
  const n=Math.round(mix(8,40,seg(p,.1,.5)));const {svg}=LIgraph({strips:1,n,tri:seg(p,.5,.7)});
  let s=svg;
  s+=card(640,90,520,330,LM('0 から I まで 足す',900,140,{size:26,color:DIM})
   +T(`${Ut}=\\int_0^{${Ic}}L\\,${ic}\\,d${ic}`,900,240,{size:44})
   +fade(seg(p,.55,.7),T(`=L\\int_0^{${Ic}}${ic}\\,d${ic}`,900,350,{size:40})+label('L は 定数',1130,410,{size:22,color:INK,anchor:'end'})),seg(p,0,.15));
  return s;
 },
 [K+'int2']:(p)=>{
  let s=TF(`${Ut}=L\\Big[\\dfrac{${ic}^2}{2}\\Big]_0^{${Ic}}`,600,95,{size:48});
  s+=fade(seg(p,.05,.2),LM('i の 原始関数：i²/2',960,105,{size:24,color:DIM}));
  s+=TF(`=L\\Big(\\dfrac{${Ic}^2}{2}-0\\Big)`,600,245,{size:46,g:seg(p,.2,.4)});
  s+=TF(UL,420,410,{size:58,box:true,g:seg(p,.45,.6)});
  s+=fade(seg(p,.7,.85),T(`=\\tfrac12\\times${Ic}\\times L${Ic}`,840,410,{size:40})+LM('三角形の 面積',840,480,{size:24,color:WC,weight:700}));
  return s;
 },
 [K+'enum']:(p)=>{
  const {svg}=LIgraph({tri:1,nums:1});
  let s=svg;
  s+=card(640,90,520,330,LM('L ＝ 0.1 H，I ＝ 2 A',900,140,{size:26,color:DIM})
   +T(`${Ut}=\\tfrac12\\times0.1\\times2^2`,900,235,{size:42})
   +fade(seg(p,.35,.55),T(`=0.2${U_('J')}`,900,330,{size:50})),seg(p,0,.15));
  s+=fade(seg(p,.6,.75),label('底 2 A × 高さ 0.2 Wb ÷ 2 ＝ 0.2 J',330,505,{size:22,color:WC,anchor:'middle'}));
  return s;
 },
 [K+'check']:(p)=>powerGraph(p,{lineG:seg(p,.3,.7)}),
 [K+'check2']:(p)=>powerGraph(p,{lineG:1,tri:seg(p,.05,.3),calc:1}),
 [K+'stored']:(p)=>{
  let s=solenoid({glow:seg(p,.1,.35),Bg:.7,hl:[]});
  s+=fade(seg(p,.1,.3),label('磁場に 蓄えられる',320,490,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(720,80,440,340,LM('理想 コイル（抵抗 0）',940,130,{size:24,color:DIM})
   +LM('仕事 → 熱に ならない',940,200,{size:28,color:INK})
   +fade(seg(p,.2,.35),LM('→ 磁場の エネルギー',940,260,{size:30,color:WC,weight:700}))
   +fade(seg(p,.6,.75),LM('I を 減らすと',940,330,{size:26,color:CI})+LM('回路へ 返る',940,375,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S5 対応 =====
 [K+'table']:(p)=>analogy(p,{bad:0}),
 [K+'notmap']:(p)=>analogy(p,{bad:seg(p,.1,.35)}),
 [K+'field']:(p)=>{
  let s=solenoid({glow:1,Bg:.6,curG:.4,heads:0});
  // slow electrons on the front arcs
  for(let i=0;i<12;i++){const x=110+420*(i+.5)/12+15,y=255-60+((p*20+i*7)%30);s+=dot(x,y,6,ELC);}
  s+=label('電子：とても 遅い',320,490,{size:26,color:ELC,anchor:'middle',weight:700});
  s+=card(720,90,440,320,LM('エネルギーは',940,160,{size:28,color:INK})
   +LM('電子の 運動 ではなく',940,225,{size:28,color:DIM})
   +fade(seg(p,.4,.6),LM('コイルの 中と まわりの',940,300,{size:28,color:WC,weight:700})+LM('磁場に ある',940,350,{size:32,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S6 まとめ =====
 [K+'sum1']:(p)=>{
  let s=card(90,40,1020,440,'',1);
  const rows=[[`${PS}=L${Ic}`,'定義（線形の コイル）',PHI],[BACK,'ファラデーの 法則から',EMF],[UL,'仕事の 積分から',WC]];
  rows.forEach(([e,t,c],i)=>{const y=120+i*125;s+=fade(seg(p,.05+i*.25,.2+i*.25),T(e,400,y,{size:44})+label(t,700,y+10,{size:28,color:c,weight:700}));});
  s+=fade(seg(p,.8,.95),LM('長い コイル：L ＝ μ₀n²Aℓ',600,465,{size:24,color:DIM}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=inductor({cur:1,emf:1,coilCol:CI});
  s+=fade(seg(p,.4,.6),rect(IND.x1-20,IND.y-110,IND.x2-IND.x1+40,150,{fill:WC,fo:.18,stroke:'none',rx:30})+label('磁場の エネルギー ½LI²',(IND.x1+IND.x2)/2,IND.y+90,{size:28,color:WC,anchor:'middle',weight:700}));
  s+=card(740,90,420,330,LM('「電流の 慣性」',950,160,{size:34,color:C.hi,weight:700})
   +LM('＝ 電流の 変化を',950,235,{size:28,color:INK})+LM('妨げる 逆起電力',950,280,{size:28,color:EMF,weight:700})
   +fade(seg(p,.5,.65),LM('逆らった 仕事 → 磁場へ',950,360,{size:26,color:WC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  let s=solenoid({x0:70,x1:330,ry:85,n:7,cy:240,Bk:.8,ilab:1,blab:0});
  s+=fade(seg(p,.25,.45),solenoid({x0:470,x1:730,ry:85,n:7,cy:240,Bg:0,curG:0,leads:1,ilab:0,col:DIM})+label('？',600,120,{size:48,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),[-.62,-.21,.21,.62].map(k=>line(390,240+k*85,760,240+k*85,{color:CB,w:3,dash:'10 8',opacity:.8})).join(''));
  s+=label('コイル1',200,385,{size:26,color:CI,anchor:'middle',weight:700})+fade(seg(p,.25,.45),label('コイル2',600,385,{size:26,color:DIM,anchor:'middle',weight:700}));
  s+=card(800,80,370,350,LM('次の 問い',985,130,{size:22,color:DIM})
   +LM('隣の コイルに',985,200,{size:28,color:INK})+LM('起電力を 作らせたら？',985,245,{size:28,color:EMF,weight:700})
   +fade(seg(p,.5,.65),LM('導線で つながずに',985,320,{size:26,color:INK})+LM('エネルギーを 渡せる？',985,365,{size:28,color:C.hi,weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};

// ---- smooth I(t) and ℰ(t) stacked ---------------------------------------------------------------------------
const sm=u=>{u=clamp((u-.1)/.5);return u*u*(3-2*u);};
const dsm=u=>{const v=(u-.1)/.5;return v<0||v>1?0:6*v*(1-v)/.5;};
function shapeGraphs(p,{draw_=1,marks=0,flat=0,msg=0}={}){
 const x0=110,w=560;
 let s=label('I',x0-20,60,{size:30,color:CI,weight:700,anchor:'end'})+T(EM,x0+24,272,{size:34});
 s+=arrow(x0,215,x0+w+20,215,{color:DIM,w:2.5,head:12})+arrow(x0,220,x0,45,{color:DIM,w:2.5,head:12})+label('t',x0+w+34,222,{size:26,color:TC,weight:700});
 s+=arrow(x0,300,x0+w+20,300,{color:DIM,w:2.5,head:12})+arrow(x0,480,x0,285,{color:DIM,w:2.5,head:12})+label('t',x0+w+34,290,{size:26,color:TC,weight:700})+label('0',x0-12,306,{size:22,color:DIM,anchor:'end'});
 const N=120,pts1=[],pts2=[];
 for(let k=0;k<=N;k++){const u=k/N;pts1.push([x0+w*u,215-140*sm(u)]);pts2.push([x0+w*u,300+160*dsm(u)/3]);}
 s+=draw(pts1,draw_,{color:CI,w:5})+draw(pts2,draw_,{color:EMF,w:5});
 if(marks>0){const u=.35,x=x0+w*u;s+=fade(marks,line(x,60,x,480,{color:C.hi,w:2,dash:'8 7'})+dot(x,300+160,9,C.hi)+label('坂が 最も 急',x-12,80,{anchor:'end',size:24,color:C.hi,weight:700})+label('',x,80,{size:24,color:C.hi,weight:700})+T(EM,x+40,468,{size:28})+label('が 最も 負',x+58,475,{size:24,color:EMF,weight:700}));}
 if(flat>0){const xa=x0+w*.62;s+=fade(flat,rect(xa,50,x0+w-xa,440,{fill:C.hi,fo:.06,stroke:'none',rx:0})+label('I 一定',xa+20,170,{size:24,color:CI,weight:700})+T(`${EM}=0`,xa+60,338,{size:30}));}
 s+=card(740,100,420,300,T(BACK,950,190,{size:40})+LM('傾きに 比例した 負の 値',950,280,{size:26,color:EMF,weight:700})
  +fade(msg,LM('値ではなく 変化率',950,350,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
 return s;
}
// ---- example: 0 → 2 A in 0.01 s ---------------------------------------------------------------------------------
function exGraphs(p,{iG=1,eG=0,calc=0}={}){
 const x0=110,w=480,tmax=.02,X=t=>x0+w*t/tmax;
 let s=label('I［A］',x0,45,{size:22,color:CI,anchor:'middle'});
 s+=arrow(x0,215,x0+w+20,215,{color:DIM,w:2.5,head:12})+arrow(x0,220,x0,62,{color:DIM,w:2.5,head:12})+label('t［s］',x0+w+30,245,{size:22,color:TC,anchor:'middle'});
 const Yi=a=>215-130*a/2;
 s+=line(x0-5,Yi(2),x0+5,Yi(2),{color:DIM})+label('2',x0-12,Yi(2)+8,{size:22,color:CI,anchor:'end'});
 s+=line(X(.01),210,X(.01),220,{color:DIM})+label('0.01',X(.01),245,{size:22,color:TC,anchor:'middle'});
 s+=draw([[X(0),Yi(0)],[X(.01),Yi(2)],[X(.02),Yi(2)]],iG,{color:CI,w:5});
 if(eG>0){
  s+=fade(eG,T(EM,x0-8,282,{size:26})+label('［V］',x0+8,290,{size:22,color:EMF})+arrow(x0,320,x0+w+20,320,{color:DIM,w:2.5,head:12})+arrow(x0,480,x0,300,{color:DIM,w:2.5,head:12})+label('0',x0-12,326,{size:22,color:DIM,anchor:'end'}));
  const Ye=v=>320-130*v/20;
  s+=fade(eG,line(x0-5,Ye(-20),x0+5,Ye(-20),{color:DIM})+label('−20',x0-12,Ye(-20)+8,{size:22,color:EMF,anchor:'end'})
   +draw([[X(0),Ye(-20)],[X(.01),Ye(-20)],[X(.01),Ye(0)],[X(.02),Ye(0)]],1,{color:EMF,w:5}));
 }
 let c=LM('L ＝ 0.1 H',950,125,{size:28,color:INK,weight:700})+LM('0.01 s で 0 → 2 A',950,175,{size:26,color:CI})+LM('（一定の 割合）',950,215,{size:22,color:DIM});
 if(calc){c+=fade(seg(p,.05,.2),T(`${dIdt}=\\dfrac{2}{0.01}=200${U_('A/s')}`,950,280,{size:28}));
  c+=fade(seg(p,.3,.45),T(`${EM}=-0.1\\times200=-20${U_('V')}`,950,355,{size:30}));
  c+=fade(seg(p,.6,.75),LM('端子電圧 ＋20 V',950,420,{size:28,color:EMF,weight:700}));}
 return s+card(720,70,460,390,c,1);
}
// ---- P–t triangle check ---------------------------------------------------------------------------------------
function powerGraph(p,{lineG=1,tri=0,calc=0}={}){
 const {s:ax,X,Y}=graph(110,430,500,320,{tmax:.012,fmin:0,fmax:45,tt:[[.01,'0.01']],ft:[[40,'40']],xl:'t［s］',yl:'P［W］',ycol:WC});
 let s=ax;
 if(tri)s+=fade(tri,poly([[X(0),Y(0)],[X(.01),Y(0)],[X(.01),Y(40)]],{fill:WC,fo:.3,stroke:WC,sw:2}));
 s+=draw([[X(0),Y(0)],[X(.01),Y(40)]],lineG,{color:WC,w:5});
 let c=LM('仕事率 P ＝ 20 V × i',935,140,{size:28,color:INK,weight:700})+LM('i：0 → 2 A（一様）',935,195,{size:24,color:CI})
  +fade(lineG,LM('P：0 → 40 W（直線）',935,250,{size:28,color:WC,weight:700}));
 if(calc)c+=fade(seg(p,.2,.4),T(`\\tfrac12\\times0.01\\times40=0.2${U_('J')}`,935,330,{size:34}))+fade(seg(p,.5,.65),LM('½LI² と 一致 ✓',935,400,{size:30,color:OK,weight:700}));
 return s+card(700,80,470,370,c,1);
}
// ---- analogy table ------------------------------------------------------------------------------------------------
function analogy(p,{bad=0}={}){
 let s=card(100,30,1000,455,'',1);
 s+=LM('コイル',380,80,{size:28,color:DIM})+LM('動く 物体',820,80,{size:28,color:DIM});
 const rows=[[`L`,`m`],[Ic,`v`],[`${Vt}=L\\,${dIdt}`,`F=m\\,\\dfrac{dv}{d${tt}}`],[UL,`\\tfrac12 mv^2`]];
 rows.forEach(([a,b],i)=>{const y=135+i*74;s+=T(a,380,y,{size:i>=2?30:34})+T(b,820,y,{size:i>=2?30:34,auto:true})+LM('↔',600,y+10,{size:30,color:DIM});});
 if(bad>0){const y=135+4*74+6;
  s+=fade(bad,line(150,y-40,1050,y-40,{color:C.faint,w:2})+LM('位置 x（動いた 場所）',820,y+12,{size:28,color:INK})+LM('↔',600,y+12,{size:30,color:DIM})+LM('対応なし',380,y+12,{size:30,color:BAD,weight:700})
   +label('✗',505,y+14,{size:34,color:BAD,weight:700}));}
 return s;
}
