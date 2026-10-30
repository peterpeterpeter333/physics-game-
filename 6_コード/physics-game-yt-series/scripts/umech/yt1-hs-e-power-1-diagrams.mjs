// 高校編「電力とジュール熱・深く学ぶ 1/2」(ys-hs-e-power-1) — 図。Stage 1200×515.
// 色（電流とオームの法則の部品にそろえる）：電流 I 緑、電圧 V 紫、電荷 Q 桃、時間 t 金、電力 P・エネルギー W・熱 橙、抵抗 R 白、強調 黄。
// 電池の記号：長い細い線＝＋極、短い太い線＝−極。電流（緑の矢印）は電池の外で ＋極 → −極。
// 回路の部品（電池・抵抗・回路・電荷の粒）は 電流とオームの法則 1/4 の図と同じ形をここに写した（相手のファイルは制作中のため読み込まない）。
// 文字 W（エネルギーの量）は斜体の橙、単位のワットは立体の白 \mathrm{W}。
// 2/2・要点でも使う部品は export する（関数の export は図の登録に入らない）。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp,mix} from './anim.mjs';
import {card,tag,T2,sceneT} from './yt1-hs-t-heat-1-diagrams.mjs';
export {card,tag,T2,sceneT};

const K='hs-e-power-1:';
export const IC=C.F, VC=C.v, QC=C.p, TC=C.t, PC=C.E, WC=C.E, RC=C.ink, NEG='#7fb3ff', POS=C.a, BAD=C.a;
export const It=`{\\color{${IC}}I}`, Qt=`{\\color{${QC}}Q}`, Vt=`{\\color{${VC}}V}`, Rt=`{\\color{${RC}}R}`, Wt=`{\\color{${WC}}W}`, Pt=`{\\color{${PC}}P}`, tt=`{\\color{${TC}}t}`;
export const U=s=>`\\,\\mathrm{${s}}`;
export const PVI=`${Pt}=${Vt}${It}`, PRI=`${Pt}=${Rt}${It}^2`, PVR=`${Pt}=\\dfrac{${Vt}^2}{${Rt}}`;
// ---- tokens & circuit symbols (same shapes as 電流とオームの法則) ------------------------------------
export const qtok=(x,y,op=1,r=13)=>fade(op,ring(x,y,r,{color:QC,w:2.5,fill:'#3a2140'})+dot(x,y,r*.38,QC));
export function battery(x,y,{g=1,text='',gap=11,signs=true}={}){
 const xl=x-gap,xr=x+gap;
 let s=line(xr,y-36,xr,y+36,{color:C.ink,w:5})+line(xl,y-19,xl,y+19,{color:C.ink,w:10});
 if(signs)s+=label('＋',xr+22,y-24,{size:26,color:POS,anchor:'middle',weight:700})+label('−',xl-22,y-24,{size:28,color:NEG,anchor:'middle',weight:700});
 if(text)s+=label(text,x,y+68,{size:24,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
export function resistor(x1,x2,y,{color=C.ink,n=6,amp=18,w=4}={}){const pts=[[x1,y]];for(let i=1;i<n*2;i++)pts.push([x1+(x2-x1)*i/(n*2),y+(i%2?-amp:amp)]);pts.push([x2,y]);return draw(pts,1,{color,w});}
export function along(pts,f){
 let Ltot=0;const d=[];for(let i=1;i<pts.length;i++){const s=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);d.push(s);Ltot+=s;}
 let w=Ltot*(((f%1)+1)%1);for(let i=1;i<pts.length;i++){if(w<=d[i-1]){const u=w/d[i-1];return [mix(pts[i-1][0],pts[i][0],u),mix(pts[i-1][1],pts[i][1],u)];}w-=d[i-1];}
 return pts[pts.length-1];
}
const pathLen=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
// heat: orange wavy lines rising from a resistor spanning x1..x2 at height y
export function heatWaves(x1,x2,y,t,{g=1,n=4,h=70}={}){
 if(g<=0)return '';
 let s='';
 for(let i=0;i<n;i++){const x=x1+(x2-x1)*(i+.5)/n,ph=t*4+i*1.7;
  const pts=[];for(let k=0;k<=16;k++){const u=k/16;pts.push([x+9*Math.sin(ph+u*9),y-22-u*h]);}
  s+=draw(pts,1,{color:PC,w:3.5});}
 return fade(g,s);
}
// loop circuit: battery on the bottom wire (＋ right), resistor on the top wire.
// current: ＋ → right side up → top leftwards (through R) → left side down → −.
export const CIR={L:90,R:470,T:150,B:410,bx:280,ex:280};
export function circuit({o=CIR,g=1,cur=1,flow=0,t=0,heat=0,vlab=0,ilab=0,rlab=0,glow=0,ivals='',vvals='',rvals='',batt='電池',n=16}={}){
 const {L,R,T,B,bx,ex}=o;let s='';
 s+=line(bx+11,B,R,B,{color:C.dim,w:4})+line(R,B,R,T,{color:C.dim,w:4})+line(L,B,bx-11,B,{color:C.dim,w:4})+line(L,T,L,B,{color:C.dim,w:4});
 s+=line(L,T,ex-80,T,{color:C.dim,w:4})+line(ex+80,T,R,T,{color:C.dim,w:4});
 if(glow>0)s+=fade(glow,rect(ex-92,T-34,184,68,{fill:PC,fo:.25,stroke:'none',rx:16}));
 s+=resistor(ex-80,ex+80,T,{color:glow>.5?'#ffd2a0':RC});
 s+=battery(bx,B,{text:batt});
 if(flow>0){const P=[[bx+11,B],[R,B],[R,T],[L,T],[L,B],[bx-11,B]],Lp=pathLen(P);
  for(let k=0;k<n;k++){const [x,y]=along(P,k/n+40*t/Lp);if(Math.abs(y-B)<2&&Math.abs(x-bx)<30)continue;s+=fade(flow,qtok(x,y,1,10));}}
 if(cur>0)s+=fade(cur,arrow(bx+50,B,R-40,B,{color:IC,w:6,head:18})+arrow(R,B-40,R,T+40,{color:IC,w:6,head:18})+arrow(R-30,T,ex+95,T,{color:IC,w:6,head:18})
  +arrow(ex-95,T,L+30,T,{color:IC,w:6,head:18})+arrow(L,T+40,L,B-40,{color:IC,w:6,head:18})+arrow(L+30,B,bx-50,B,{color:IC,w:6,head:18}));
 if(heat>0)s+=heatWaves(ex-80,ex+80,T,t,{g:heat});
 if(ilab>0)s+=fade(ilab,T2(It+(ivals?`=${ivals}`:''),R+22,(T+B)/2+12,{size:40,anchor:'start'}));
 if(vlab>0)s+=fade(vlab,T2(Vt+(vvals?`=${vvals}`:''),bx,B-72,{size:40}));
 if(rlab>0)s+=fade(rlab,T2(Rt+(rvals?`=${rvals}`:''),ex,T+70,{size:40}));
 return fade(g,s);
}
// formula card centred in a box
export const fcard=(x,y,w,h,src,{g=1,size=50,col=C.hi,dy=0}={})=>card(x,y,w,h,T2(src,x+w/2,y+h/2+size*.3+dy,{size}),g,col);
// a question card in the middle of the stage
export const Qcard=(a,b,{g=1,y=130}={})=>card(170,y,860,210,label(a,600,y+70,{size:34,color:C.ink,anchor:'middle'})+label(b,600,y+150,{size:44,color:C.hi,anchor:'middle',weight:700}),g,C.hi);
// equation step: previous line (small, dim) → operation note → new line in a card
export function step(p,prev,next,op,{size=50,col=C.hi,y0=80,x=600,w=900}={}){
 let s=fade(.7,T2(prev,x,y0,{size:38}));
 s+=fade(seg(p,.05,.2),label(op,x,y0+82,{size:28,color:col,anchor:'middle',weight:700})+arrow(x,y0+100,x,y0+148,{color:col,w:4,head:14}));
 s+=card(x-w/2,y0+170,w,150,T2(next,x,y0+258,{size}),seg(p,.3,.5),col);
 return s;
}
// ---- simple icons ---------------------------------------------------------------------------------
export function stove(x,y,{g=1,on=1,t=0}={}){ // electric stove: box with glowing bars
 let s=rect(x-90,y-120,180,170,{fill:'#2a3550',fo:.95,stroke:C.dim,sw:2.5,rx:14});
 for(let i=0;i<3;i++)s+=rect(x-65,y-95+i*42,130,14,{fill:on>.5?'#ff8a4a':'#5a6278',fo:.95,stroke:'none',rx:7});
 s+=rect(x-60,y+50,20,14,{fill:C.dim,fo:1,stroke:'none',rx:3})+rect(x+40,y+50,20,14,{fill:C.dim,fo:1,stroke:'none',rx:3});
 if(on>0)s+=heatWaves(x-70,x+70,y-125,t,{g:on,n:3,h:55});
 return fade(g,s);
}
export function dryer(x,y,{g=1,s:k=1}={}){
 let s=`<path d="M${x-70*k} ${y-40*k} h${120*k} a${40*k} ${40*k} 0 0 1 0 ${80*k} h${-120*k} z" fill="#7d8aa3" fill-opacity=".9" stroke="${C.ink}" stroke-width="2.5"/>`;
 s+=rect(x-30*k,y+40*k,36*k,90*k,{fill:'#7d8aa3',fo:.9,stroke:C.ink,sw:2.5,rx:8});
 s+=rect(x-90*k,y-30*k,22*k,60*k,{fill:'#5a6278',fo:1,stroke:C.ink,sw:2,rx:4});
 for(let i=0;i<3;i++)s+=arrow(x-100*k,y+(i-1)*20*k,x-170*k,y+(i-1)*20*k,{color:PC,w:4,head:12});
 return fade(g,s);
}
export function tower(x,y,{g=1,h=170}={}){ // transmission tower (lattice)
 let s=draw([[x-45,y],[x-12,y-h],[x+12,y-h],[x+45,y]],1,{color:C.dim,w:4});
 s+=line(x-70,y-h+30,x+70,y-h+30,{color:C.dim,w:4})+line(x-55,y-h+70,x+55,y-h+70,{color:C.dim,w:4});
 for(let i=0;i<4;i++){const y1=y-i*h/4,y2=y-(i+1)*h/4,w1=45-33*i/4,w2=45-33*(i+1)/4;s+=line(x-w1,y1,x+w2,y2,{color:C.faint,w:2.5})+line(x+w1,y1,x-w2,y2,{color:C.faint,w:2.5});}
 return fade(g,s);
}
// ---- a coulomb packet carrying an energy box of V joules ---------------------------------------------
export function packet(x,y,{box=1,text='100 J',bh=52,g=1}={}){
 let s=qtok(x,y,1,24)+label('1 C',x,y+72,{size:24,color:QC,anchor:'middle',weight:700});
 if(box>0)s+=fade(box,rect(x-42,y-30-bh,84,bh,{fill:VC,fo:.35,stroke:VC,sw:2.5,rx:6})+label(text,x,y-30-bh/2+9,{size:24,color:C.ink,anchor:'middle',weight:700}));
 return fade(g,s);
}
// ---- area model: width = coulombs per second (I), height = joules per coulomb (V) -----------------
export function areaModel(x,y,{nx=1,ny=1,cw=110,ch=80,g=1,grow=1,wl='',hl='',al='',tiles=1}={}){
 let s='';
 const W=nx*cw*grow,Hh=ny*ch*grow;
 s+=rect(x,y-Hh,W,Hh,{fill:PC,fo:.3,stroke:PC,sw:3,rx:2});
 if(tiles&&grow>.99){for(let i=1;i<nx;i++)s+=line(x+i*cw,y-Hh,x+i*cw,y,{color:PC,w:2,dash:'6 5'});for(let j=1;j<ny;j++)s+=line(x,y-j*ch,x+W,y-j*ch,{color:PC,w:2,dash:'6 5'});}
 if(wl)s+=T2(wl,x+W/2,y+46,{size:36});
 if(hl)s+=T2(hl,x-14,y-Hh/2+12,{size:36,anchor:'end'});
 if(al)s+=T2(al,x+W/2,y-Hh/2+14,{size:38});
 return fade(g,s);
}
// ---- comparison columns: same V (left) / same I (right) ------------------------------------------
// rows: [R, P] ; bars proportional within the column
function column(x,{g=1,head='',fixed='',fcol=VC,rows=[],max=1,unitP='W',note='',ng=0,hl=0,bars=1}={}){
 const w=540;let s=rect(x,30,w,450,{fill:'#131f38',fo:.9,stroke:hl?C.hi:C.faint,sw:hl?3:2,rx:14});
 s+=label(head,x+w/2,78,{size:28,color:C.ink,anchor:'middle',weight:700});
 s+=rect(x+w/2-150,100,300,62,{fill:fcol,fo:.12,stroke:fcol,sw:3,rx:10})+T2(fixed,x+w/2,144,{size:38});
 rows.forEach(([r,pw,lab],i)=>{const y=230+i*95;
  s+=T2(`${Rt}=${r}${U('\\Omega')}`,x+115,y+14,{size:36});
  const bw=170*pw/max*bars;
  s+=rect(x+215,y-18,bw,40,{fill:PC,fo:.55,stroke:PC,sw:2,rx:6})+label(lab,x+225+bw,y+12,{size:28,color:PC,weight:700});
 });
 if(note)s+=fade(ng,label(note,x+w/2,445,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return fade(g,s);
}
export function compare({lg=1,rg=1,ln=0,rn=0,lhl=0,rhl=0,lbars=1,rbars=1}={}){
 return column(40,{g:lg,head:'電圧が 同じ（コンセントの 家電）',fixed:`${Vt}=100${U('V')}`,fcol:VC,rows:[[10,1000,'1000 W'],[20,500,'500 W']],max:1000,note:'R が 大きい → I が 減る → P 小',ng:ln,hl:lhl,bars:lbars})
  +column(620,{g:rg,head:'電流が 同じ（直列の 抵抗）',fixed:`${It}=2.0${U('A')}`,fcol:IC,rows:[[10,40,'40 W'],[20,80,'80 W']],max:80,note:'R が 大きい → V が 大きい → P 大',ng:rn,hl:rhl,bars:rbars});
}
// unit row J/C × C/s = J/s = W, with optional cancel
function unitRow(cancel,y,{g=1}={}){
 const c=cancel?'\\cancel{\\mathrm{C}}':'\\mathrm{C}';
 return fade(g,T2(`\\dfrac{\\mathrm{J}}{${c}}\\times\\dfrac{${c}}{\\mathrm{s}}=\\dfrac{\\mathrm{J}}{\\mathrm{s}}=\\mathrm{W}`,600,y,{size:64}));
}
// derivation board on the right of the small circuit
const BX=540,BW=620;
function board(rows,{g=1}={}){
 // rows: [{src, note, g, hl}]
 let s='';
 rows.forEach((r,i)=>{if(!(r.g>0))return;const y=95+i*100;
  let q=T2(r.src,BX+30,y+14,{size:42,anchor:'start'});
  if(r.note)q+=label(r.note,BX+BW-10,y+10,{size:24,color:C.dim,anchor:'end'});
  if(r.hl)q+=fade(r.hl,rect(BX+10,y-38,BW,78,{fill:C.hi,fo:.06,stroke:C.hi,sw:2.5,rx:10}));
  s+=fade(r.g,q);});
 return fade(g,s);
}
const SC={L:70,R:430,T:150,B:410,bx:250,ex:250};
const smallCirc=(t,o={})=>circuit({o:SC,t,vlab:1,ilab:1,flow:1,...o});
// counters for the packet scene
const GATE=600;
function packets(p,{move=[.15,.85],gone=0}={}){
 const u=seg(p,move[0],move[1]);let s='';
 s+=rect(60,290,1080,90,{fill:'#8795ad',fo:.12,stroke:C.dim,sw:2.5,rx:40});
 s+=`<ellipse cx="${GATE}" cy="335" rx="18" ry="58" fill="${C.hi}" fill-opacity=".12" stroke="${C.hi}" stroke-width="3"/>`+label('断面',GATE,476,{size:26,color:C.hi,anchor:'middle',weight:700});
 let n=0;
 for(let i=0;i<5;i++){const x=140+i*100+u*520;if(x>GATE)n++;if(gone&&x>GATE)continue;s+=packet(x,335);}
 return {s,n};
}

export const hsEPower1Diagrams={
 // ================= S1 前回の問い =================
 [K+'recap']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({t,cur:seg(p,.05,.25),vlab:seg(p,.2,.35),ilab:seg(p,.2,.35),rlab:seg(p,.2,.35),flow:seg(p,.1,.3)});
  s+=fcard(640,140,460,170,`${Vt}=${Rt}${It}`,{g:seg(p,.35,.55),size:58});
  s+=fade(seg(p,.5,.65),label('オームの 法則',870,360,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({t,vlab:1,ilab:1,rlab:1,flow:1});
  s+=fade(seg(p,.1,.3),label('？',280,90,{size:56,color:C.hi,anchor:'middle',weight:700}));
  s+=card(600,90,560,300,label('電池が 渡した エネルギーは',880,160,{size:30,color:C.ink,anchor:'middle'})+label('どこへ？',880,225,{size:46,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('1秒あたり、どれだけ？',880,320,{size:40,color:PC,anchor:'middle',weight:700})),seg(p,.15,.35),C.hi);
  return s;
 },
 [K+'stove']:(p,ctx)=>{
  const t=sceneT(p,ctx),h=seg(p,.35,.65);
  let s=circuit({t,flow:1,glow:h,heat:h,rlab:1});
  s+=stove(870,330,{on:seg(p,.05,.3),t});
  s+=fade(seg(p,.1,.3),label('電気ストーブ',870,445,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('抵抗が 熱くなる',280,40,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'plan']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({t,flow:1,glow:1,heat:1,rlab:1});
  s+=label('抵抗が 熱くなる',280,40,{size:30,color:PC,anchor:'middle',weight:700});
  s+=card(600,110,560,140,label('電池の エネルギー → 熱',880,195,{size:36,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=card(600,290,560,140,label('1秒あたり ＝ ？',880,375,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 // ================= S2 電力の定義 =================
 [K+'def']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=card(110,60,980,200,label('電力',600,130,{size:40,color:PC,anchor:'middle',weight:700})+label('1秒あたりに 変換される エネルギー',600,210,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.25,.45),T2(Pt,600,345,{size:80}));
  s+=tag('定義',600,450,{g:seg(p,.6,.75)});
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T2(Pt,600,110,{size:60});
  s+=card(250,170,700,170,T2(`\\mathrm{W}=\\mathrm{J/s}`,600,275,{size:70}),seg(p,.05,.25),PC);
  s+=fade(seg(p,.5,.7),label('W（ワット）＝ 1秒あたりの ジュール',600,420,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex100']:(p)=>{
  const u=seg(p,.15,.55);
  let s=rect(120,100,200*(1-u),60,{fill:PC,fo:.55,stroke:PC,sw:2,rx:6})+label('100 J',220,90,{size:28,color:PC,anchor:'middle',weight:700});
  s+=arrow(350,130,450,130,{color:C.dim,w:5,head:16});
  s+=rect(470,90,120,80,{fill:'#2a3550',fo:.95,stroke:C.dim,sw:2.5,rx:10})+label('機器',530,140,{size:26,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.1,.25),label('1 秒',400,200,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=card(650,70,500,130,T2(`100${U('J')}\\div 1${U('s')}=100${U('W')}`,900,150,{size:42}),seg(p,.55,.75),PC);
  return s;
 },
 [K+'ex10']:(p)=>{
  let s=label('100 J',220,90,{size:28,color:PC,anchor:'middle',weight:700})+arrow(350,130,450,130,{color:C.dim,w:5,head:16});
  s+=rect(470,90,120,80,{fill:'#2a3550',fo:.95,stroke:C.dim,sw:2.5,rx:10})+label('機器',530,140,{size:26,color:C.ink,anchor:'middle'})+label('1 秒',400,200,{size:30,color:TC,anchor:'middle',weight:700});
  s+=card(650,70,500,130,T2(`100${U('J')}\\div 1${U('s')}=100${U('W')}`,900,150,{size:42}),1,PC);
  const u=seg(p,.15,.75);
  s+=fade(seg(p,.05,.15),rect(120,300,200*(1-u),60,{fill:PC,fo:.55,stroke:PC,sw:2,rx:6})+label('100 J',220,290,{size:28,color:PC,anchor:'middle',weight:700})+arrow(350,330,450,330,{color:C.dim,w:5,head:16})
   +rect(470,290,120,80,{fill:'#2a3550',fo:.95,stroke:C.dim,sw:2.5,rx:10})+label('機器',530,340,{size:26,color:C.ink,anchor:'middle'})+label('10 秒',400,400,{size:30,color:TC,anchor:'middle',weight:700}));
  s+=card(650,270,500,130,T2(`100${U('J')}\\div 10${U('s')}=10${U('W')}`,900,350,{size:42}),seg(p,.6,.8),PC);
  return s;
 },
 [K+'rate']:(p)=>{
  let s=card(120,90,440,300,label('エネルギーの 量',340,160,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(Wt,340,260,{size:70})+label('単位 J',340,350,{size:30,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.faint);
  s+=card(640,90,440,300,label('変換する 速さ',860,160,{size:32,color:C.ink,anchor:'middle',weight:700})+T2(Pt,860,260,{size:70})+label('単位 W ＝ J/s',860,350,{size:30,color:C.dim,anchor:'middle'}),seg(p,.3,.5),PC);
  s+=fade(seg(p,.55,.7),label('電力は こちら',860,440,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wsym']:(p)=>{
  let s=card(120,70,440,330,label('量を 表す 文字',340,130,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(Wt,340,250,{size:110})+label('エネルギー（単位 J）',340,360,{size:28,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=card(640,70,440,330,label('単位',860,130,{size:30,color:C.ink,anchor:'middle',weight:700})+T2('\\mathrm{W}',860,250,{size:110})+label('ワット ＝ J/s',860,360,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.65),C.dim);
  s+=fade(seg(p,.7,.85),label('同じ 字でも 別物',600,460,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'wsym2']:(p)=>{
  let s=card(120,70,440,330,label('斜めの 橙',340,130,{size:30,color:PC,anchor:'middle',weight:700})+T2(Wt,340,250,{size:110})+label('エネルギー（単位 J）',340,360,{size:28,color:PC,anchor:'middle',weight:700}),1,PC);
  s+=card(640,70,440,330,label('まっすぐな 文字',860,130,{size:30,color:C.ink,anchor:'middle',weight:700})+T2('\\mathrm{W}',860,250,{size:110})+label('ワット ＝ J/s',860,360,{size:28,color:C.ink,anchor:'middle',weight:700}),1,C.dim);
  s+=fade(seg(p,.3,.5),T2(`${Wt}=500${U('J')}`,340,465,{size:40})+T2(`${Pt}=500${U('W')}`,860,465,{size:40}));
  return s;
 },
 // ================= S3 P＝VI を組み立てる =================
 [K+'setup']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({o:SC,t,cur:seg(p,.05,.25),flow:seg(p,.2,.4),vlab:seg(p,.2,.4),ilab:seg(p,.4,.6),rlab:1});
  s+=card(BX,110,BW,250,label('電圧 V をかけ、',BX+BW/2,190,{size:32,color:VC,anchor:'middle',weight:700})+label('電流 I が 流れる',BX+BW/2,270,{size:32,color:IC,anchor:'middle',weight:700}),seg(p,.3,.5),C.faint);
  return s;
 },
 [K+'vmean']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=smallCirc(t,{rlab:1});
  s+=card(BX,70,BW,170,T2(Vt,BX+70,170,{size:60})+label('1 C が 渡す エネルギー',BX+130,150,{size:30,color:C.ink,weight:700})+label('単位 J/C',BX+130,205,{size:30,color:VC,weight:700}),seg(p,.05,.25),VC);
  return s;
 },
 [K+'imean']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=smallCirc(t,{rlab:1});
  s+=card(BX,70,BW,170,T2(Vt,BX+70,170,{size:60})+label('1 C が 渡す エネルギー',BX+130,150,{size:30,color:C.ink,weight:700})+label('単位 J/C',BX+130,205,{size:30,color:VC,weight:700}),1,VC);
  s+=card(BX,270,BW,170,T2(It,BX+70,370,{size:60})+label('1秒間に 断面を 通る 電荷',BX+130,350,{size:30,color:C.ink,weight:700})+label('単位 C/s',BX+130,405,{size:30,color:IC,weight:700}),seg(p,.05,.25),IC);
  return s;
 },
 [K+'q1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return smallCirc(t,{rlab:1})+board([{src:`${Qt}=${It}\\times ${tt}=${It}${tt}`,note:'t 秒間に 通る 電荷',g:seg(p,.1,.3),hl:seg(p,.3,.5)}]);
 },
 [K+'w1']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return smallCirc(t,{rlab:1})+board([{src:`${Qt}=${It}${tt}`,note:'t 秒間に 通る 電荷',g:1},{src:`${Wt}=${Vt}\\times ${Qt}=${Vt}${Qt}`,note:'全部の エネルギー',g:seg(p,.15,.35),hl:seg(p,.35,.55)}]);
 },
 [K+'w2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return smallCirc(t,{rlab:1})+board([{src:`${Qt}=${It}${tt}`,note:'t 秒間に 通る 電荷',g:1,hl:seg(p,.05,.2)*(1-seg(p,.5,.7))},{src:`${Wt}=${Vt}${Qt}`,note:'全部の エネルギー',g:1},{src:`${Wt}=${Vt}${It}${tt}`,note:'Q に It を 入れる',g:seg(p,.2,.4),hl:seg(p,.4,.6)}]);
 },
 [K+'p']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  return smallCirc(t,{rlab:1,heat:1,glow:1})+board([{src:`${Qt}=${It}${tt}`,note:'t 秒間に 通る 電荷',g:1},{src:`${Wt}=${Vt}${Qt}`,note:'全部の エネルギー',g:1},{src:`${Wt}=${Vt}${It}${tt}`,note:'Q に It を 入れる',g:1},
   {src:`${Pt}=${Wt}/${tt}=${Vt}${It}`,note:'t で 割る',g:seg(p,.15,.35),hl:seg(p,.4,.6)}]);
 },
 [K+'unitchk']:(p)=>{
  let s=T2(`${Pt}=${Vt}\\times${It}`,600,90,{size:50});
  s+=fade(seg(p,.05,.2),label('1 C あたりの J',420,165,{size:26,color:VC,anchor:'middle',weight:700})+label('1秒あたりの C',780,165,{size:26,color:IC,anchor:'middle',weight:700}));
  s+=fade(1-seg(p,.45,.55),unitRow(false,300,{g:seg(p,.15,.3)}));
  s+=fade(seg(p,.45,.55),unitRow(true,300));
  s+=fade(seg(p,.6,.75),label('C が 消えて、1秒あたりの J ＝ W',600,450,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'box']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({o:SC,t,flow:1,glow:1,heat:1,vlab:seg(p,.2,.4),ilab:seg(p,.4,.6),vvals:`100${U('V')}`,ivals:`5.0${U('A')}`});
  s+=stove(880,330,{on:1,t,g:seg(p,.05,.25)});
  s+=fade(seg(p,.1,.25),label('電気ストーブ',880,445,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'box2']:(p)=>{
  const {s:s0,n}=packets(p,{move:[.35,.9]});
  let s=s0;
  s+=fade(seg(p,.05,.2),label('1 C ごとに 100 J の 箱',300,90,{size:30,color:VC,anchor:'middle',weight:700}));
  s+=card(760,40,380,150,label('通った 電荷',950,90,{size:26,color:C.dim,anchor:'middle'})+label(`${n} C`,950,160,{size:44,color:QC,anchor:'middle',weight:700}),seg(p,.3,.45),QC);
  s+=fade(seg(p,.85,.95),label('1 秒で 5 C',950,230,{size:30,color:TC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'box3']:(p)=>{
  let s='';
  const k=seg(p,.05,.35);
  for(let i=0;i<5;i++){const y=440-(i+1)*58;s+=fade(clamp(k*5-i),rect(780,y,140,52,{fill:VC,fo:.35,stroke:VC,sw:2.5,rx:6})+label('100 J',850,y+35,{size:26,color:C.ink,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.3,.45),line(950,150,950,440,{color:PC,w:4})+line(940,150,960,150,{color:PC,w:4})+line(940,440,960,440,{color:PC,w:4})+label('500 J',970,305,{size:34,color:PC,weight:700}));
  s+=label('1 秒に 5 C',850,480,{size:26,color:QC,anchor:'middle',weight:700});
  s+=card(60,120,640,140,T2(`${Pt}=${Vt}${It}=100\\times5.0`,380,205,{size:46}),seg(p,.35,.5),C.faint);
  s+=card(60,290,640,140,T2(`=500${U('W')}`,380,375,{size:56}),seg(p,.5,.65),PC);
  s+=fade(seg(p,.7,.85),label('毎秒 500 J が 熱に',380,470,{size:30,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 RI² =================
 [K+'ri0']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({o:SC,t,flow:1,ilab:1,rlab:1});
  s+=label('？',SC.bx,SC.B-62,{size:44,color:VC,anchor:'middle',weight:700});
  s+=card(BX,90,BW,140,label('分かっている：',BX+40,175,{size:30,color:C.ink,weight:700})+T2(`${Rt},\\ ${It}`,BX+330,175,{size:46,anchor:'start'}),seg(p,.1,.3),C.faint);
  s+=card(BX,270,BW,140,label('分からない：',BX+40,355,{size:30,color:C.ink,weight:700})+T2(Vt,BX+330,355,{size:46,anchor:'start'}),seg(p,.4,.6),VC);
  return s;
 },
 [K+'ri1']:(p)=>{
  let s=step(p,`${Pt}=${Vt}${It}`,`${Pt}=(${Rt}${It})\\times${It}`,'V を RI に 置き換える');
  s+=fade(seg(p,.05,.2),T2(`${Vt}=${Rt}${It}`,1010,95,{size:36})+label('オームの 法則',1010,140,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ri2']:(p)=>step(p,`${Pt}=${Rt}${It}\\times${It}`,PRI,'I × I を I² と 書く'),
 [K+'ri3']:(p)=>{
  let s=T2(PVI,250,150,{size:50})+fade(seg(p,.05,.2),arrow(400,140,520,140,{color:C.hi,w:5,head:16})+label('代入',460,110,{size:26,color:C.hi,anchor:'middle',weight:700})+T2(`${Vt}=${Rt}${It}`,460,200,{size:34}));
  s+=card(560,80,440,150,T2(PRI,780,170,{size:56}),seg(p,.15,.35),C.hi);
  s+=fade(seg(p,.4,.55),label('新しい 法則 ではない',600,320,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=tag('代入した だけ（結果）',600,400,{g:seg(p,.55,.7),size:26});
  return s;
 },
 [K+'guess']:(p)=>Qcard('同じ 抵抗で 電流を 2倍','発熱は 何倍？',{g:seg(p,.05,.25)}),
 [K+'four']:(p)=>{
  let s=areaModel(140,400,{nx:1,ny:1,cw:120,ch:110,wl:It,hl:Vt,al:Pt});
  s+=fade(seg(p,.05,.15),label('1秒に 通る 電荷',200,500,{size:24,color:IC,anchor:'middle'}));
  s+=fade(seg(p,.05,.15),label('1 C あたりの J',140,250,{size:24,color:VC,anchor:'middle'}));
  s+=arrow(330,330,430,330,{color:C.hi,w:5,head:16,g:seg(p,.15,.3)});
  const gr=seg(p,.2,.55);
  s+=areaModel(560,420,{nx:2,ny:2,cw:120,ch:110,grow:mix(.5,1,gr),g:seg(p,.18,.25),wl:gr>.6?`2${It}`:'',hl:gr>.6?`2${Vt}`:'',tiles:1});
  s+=fade(seg(p,.6,.75),label('2 × 2 ＝ 4倍',1000,250,{size:40,color:PC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'four2']:(p)=>{
  let s=T2(`${Rt}=10${U('\\Omega')}`,600,70,{size:40});
  s+=card(120,120,960,120,T2(`2.0${U('A')}:\\ 10\\times2.0^2=40${U('W')}`,600,195,{size:46}),seg(p,.05,.25),C.faint);
  s+=card(120,290,960,120,T2(`4.0${U('A')}:\\ 10\\times4.0^2=160${U('W')}`,600,365,{size:46}),seg(p,.45,.65),PC);
  s+=fade(seg(p,.7,.85),arrow(1110,190,1110,345,{color:C.hi,w:5,head:16})+label('4倍',1150,280,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S5 V²/R と条件 =================
 [K+'vr']:(p)=>{
  let s=step(p,PVI,`${Pt}=${Vt}\\times\\dfrac{${Vt}}{${Rt}}=\\dfrac{${Vt}^2}{${Rt}}`,'I を V/R に 置き換える',{size:50});
  s+=fade(seg(p,.05,.2),T2(`${It}=\\dfrac{${Vt}}{${Rt}}`,1010,95,{size:34}));
  return s;
 },
 [K+'three']:(p)=>{
  const items=[[`${Vt}${It}`,'V と I が 分かる'],[`${Rt}${It}^2`,'R と I が 分かる'],[`\\dfrac{${Vt}^2}{${Rt}}`,'V と R が 分かる']];
  let s=fade(seg(p,.0,.15),T2(`${Pt}=`,90,250,{size:56,anchor:'start'}));
  items.forEach(([src,lab],i)=>{const x=230+i*320;s+=card(x,130,280,220,T2(src,x+140,250,{size:56})+label(lab,x+140,325,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05+i*.1,.2+i*.1),PC);
   if(i<2)s+=fade(seg(p,.2+i*.1,.3+i*.1),label('＝',x+300,255,{size:40,color:C.ink,anchor:'middle'}));});
  s+=fade(seg(p,.55,.7),label('同じ 電力の 三つの 書き方',600,430,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'puzzle']:(p)=>{
  let s=card(100,90,460,280,T2(PRI,330,190,{size:54})+label('R が 大きい → P 大？',330,300,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  s+=card(640,90,460,280,T2(PVR,870,195,{size:54})+label('R が 大きい → P 小？',870,300,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.6),C.faint);
  return s;
 },
 [K+'puzzle2']:(p)=>{
  let s=card(100,60,460,250,T2(PRI,330,150,{size:54})+label('R が 大きい → P 大？',330,250,{size:32,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=card(640,60,460,250,T2(PVR,870,155,{size:54})+label('R が 大きい → P 小？',870,250,{size:32,color:C.ink,anchor:'middle',weight:700}),1,C.faint);
  s+=card(300,345,600,120,label('何を 一定に して 比べる？',600,420,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'samev']:(p)=>compare({lg:seg(p,.0,.15),rg:0,lbars:seg(p,.25,.6)}),
 [K+'samev2']:(p)=>{
  let s=compare({rg:0,ln:seg(p,.1,.3),lhl:1});
  s+=fade(seg(p,.35,.5),label('I ＝ 10 A',155,282,{size:22,color:IC,anchor:'middle'})+label('I ＝ 5 A',155,377,{size:22,color:IC,anchor:'middle'}));
  return s;
 },
 [K+'samei']:(p)=>compare({ln:1,rg:seg(p,.0,.15),rbars:seg(p,.25,.6)}),
 [K+'samei2']:(p)=>{
  let s=compare({ln:1,rn:seg(p,.1,.3),rhl:1});
  s+=fade(seg(p,.35,.5),label('V ＝ 20 V',735,282,{size:22,color:VC,anchor:'middle'})+label('V ＝ 40 V',735,377,{size:22,color:VC,anchor:'middle'}));
  return s;
 },
 [K+'myth']:(p)=>{
  let s=card(170,70,860,150,label('「抵抗が 大きいほど 必ず 熱い」',600,160,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,.0,.15),BAD);
  s+=fade(seg(p,.15,.3),line(290,148,890,148,{color:BAD,w:6})+label('誤解',965,160,{size:34,color:BAD,anchor:'middle',weight:700}));
  s+=card(250,280,700,150,label('まず、何が 一定かを 確かめる',600,370,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65),C.hi);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=circuit({o:SC,t,flow:1,glow:1,heat:1,vlab:1,ilab:1,rlab:1});
  s+=card(BX,90,BW,140,label('電池の エネルギー → 抵抗で 熱',BX+BW/2,170,{size:32,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=card(BX,270,BW,150,label('1秒あたり',BX+140,355,{size:30,color:C.ink,anchor:'middle',weight:700})+T2(PVI,BX+420,360,{size:56}),seg(p,.4,.6),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=areaModel(150,400,{nx:5,ny:1,cw:80,ch:150,wl:'',hl:''});
  for(let i=0;i<5;i++)s+=qtok(190+i*80,440,1,14);
  s+=label('1秒に 通る 電荷',350,490,{size:24,color:IC,anchor:'middle',weight:700});
  s+=label('1 C あたりの J',350,225,{size:24,color:VC,anchor:'middle',weight:700});
  s+=card(640,100,500,300,T2(`${Vt}\\ [\\mathrm{J/C}]`,890,170,{size:42})+T2(`\\times\\ ${It}\\ [\\mathrm{C/s}]`,890,250,{size:42})+T2(`=${Pt}\\ [\\mathrm{J/s}]`,890,340,{size:46}),seg(p,.1,.35),PC);
  return s;
 },
 [K+'next']:(p)=>{
  let s=dryer(220,160,{g:seg(p,.0,.15)});
  s+=card(400,70,740,150,label('1200 W × 10分 ＝ 何 J？',770,160,{size:40,color:PC,anchor:'middle',weight:700}),seg(p,.05,.25),PC);
  s+=tower(170,505,{g:seg(p,.45,.6),h:160})+fade(seg(p,.45,.6),line(100,375,40,405,{color:C.dim,w:2})+line(240,375,300,405,{color:C.dim,w:2}));
  s+=card(400,290,740,150,label('なぜ 高い 電圧で 送る？',770,380,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=dryer(220,160);
  s+=card(400,70,740,150,label('1200 W × 10分 ＝ 何 J？',770,160,{size:40,color:PC,anchor:'middle',weight:700}),1,PC);
  s+=tower(170,505,{h:160})+line(100,375,40,405,{color:C.dim,w:2})+line(240,375,300,405,{color:C.dim,w:2});
  s+=card(400,290,740,150,label('なぜ 高い 電圧で 送る？',770,380,{size:40,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=tag('次の回',770,480,{g:seg(p,.1,.3)});
  return s;
 },
};
