// 問題編 解説「勢いが落ちて跳ね返るボール」（q-um-momentum-change、大学編 14 運動量・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/14_運動量.md の q-um-momentum-change（解説 17 行）。
// 色（単元動画 ys-um-momentum-change-1/2 と同じ）：運動量 p 桃、力 F 緑、速度 v 紫、時間 t 金、強調 黄。跳ね返る向き（左）が正。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。文字は 22px 以上。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,pauseBadge,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-momentum-change:';
const CP=C.p,CV=C.v,CF=C.F,CT=C.t,HI=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}{${s}}}`;
const PMS='\\,\\mathrm{kg\\cdot m/s}';
const G1='運動量の変化 Δp',G2='平均の力',G3='最大の力';
const A1=g=>answerTag(1,'C','5.0 kg·m/s',{g}),A2=g=>answerTag(2,'A','250 N',{g}),A3=g=>answerTag(3,'B','500 N',{g});
function atMark(ctx,mark,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/[\s。]/g,''),i=r.indexOf(mark.replace(/\s/g,''));
 return i<0?fb:i/r.length*voiceEnd(ctx);
}
const PX=640,PW=540,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:28,whySize:24};

// ---- ボールと壁 ------------------------------------------------------------------------------------
const R=30,BALL='#8fa6c9',BALLF='#22324f';
function ball(x,y,{sq=0,g=1,lab=''}={}){
 const rx=R*(1-.28*sq),ry=R*(1+.18*sq);
 let s=`<ellipse cx="${x.toFixed(1)}" cy="${y}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${BALLF}" stroke="${BALL}" stroke-width="3"/>`;
 if(lab)s+=label(lab,x,y+R+30,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
function wallR(x,y1,y2,g=1){
 let s=rect(x,y1,26,y2-y1,{fill:'#3a4a66',fo:.85,stroke:'none',rx:2})+line(x,y1,x,y2,{color:C.dim,w:4});
 for(let q=y1+6;q<y2-10;q+=24)s+=line(x+4,q+14,x+22,q,{color:C.dim,w:2});
 return fade(g,s);
}
// 跳ね返る向き（左）が正
function posDir(x=40,y=110,g=1){return fade(g,arrow(x+80,y,x,y,{color:HI,w:4,head:14})+label('跳ね返る向き（左）が正（＋）',x+94,y+8,{size:22,color:HI}));}
function vArr(x,y,dir,txt,{g=1,len=90}={}){
 const x1=x+dir*(R+10),x2=x1+dir*len;
 return fade(g,arrow(x1,y,x2,y,{color:CV,w:6,head:18})+label(txt,(x1+x2)/2,y-16,{size:26,color:CV,anchor:'middle',weight:700}));
}
// 出題中の動き：0〜2 s 右へ（15 m/s）、2〜2.3 s 接触（つぶれる）、2.3〜4 s 左へ（10 m/s）、4 s で止める（映像を一時停止）
const WX=820,BY=230,X0=200,XC=WX-R,SP=(XC-X0)/2;
function motion(t){
 if(t<2)return {x:X0+SP*t,ph:0,sq:0};
 if(t<2.3){const sq=Math.sin(Math.PI*(t-2)/.3);return {x:WX-R*(1-.28*sq),ph:1,sq};}
 return {x:XC-SP*(10/15)*Math.min(t-2.3,1.7),ph:2,sq:0};
}
function setup(t,{badge=1}={}){
 const {x,ph,sq}=motion(t);
 let s=line(60,BY,WX,BY,{color:C.faint,w:2,dash:'6 8'})+wallR(WX,140,320)+posDir(40,110);
 s+=ball(x,BY,{sq,lab:'0.20 kg'});
 if(ph===0)s+=vArr(x,BY-58,1,'15 m/s');
 if(ph===2)s+=vArr(x,BY-58,-1,'10 m/s',{g:seg(t,2.3,2.5),len:60});
 s+=fade(seg(t,1.95,2.15),label('接触 0.020 s',WX+40,190,{size:28,color:CT,weight:700}));
 if(badge)s+=pauseBadge({x:600,y:86,g:seg(t,4,4.3)});
 return s;
}
// 力–時刻の軸と二等辺三角形の形だけ（目盛りなし）
function shapeOnly(g=1){
 const ox=540,oy=440,bw=300,bh=110;
 let s=arrow(ox,oy,ox+bw+150,oy,{color:CT,w:3,head:14})+arrow(ox,oy,ox,oy-bh-50,{color:CF,w:3,head:14});
 s+=label('時刻 t',ox+bw+160,oy+8,{size:24,color:CT,weight:700})+label('壁の力 F',ox+14,oy-bh-40,{size:24,color:CF,weight:700});
 s+=draw([[ox,oy],[ox+bw/2,oy-bh],[ox+bw,oy]],1,{color:CF,w:4});
 s+=line(ox,oy+22,ox+bw,oy+22,{color:CT,w:3})+line(ox,oy+14,ox,oy+30,{color:CT,w:3})+line(ox+bw,oy+14,ox+bw,oy+30,{color:CT,w:3});
 s+=label('0.020 s',ox+bw/2,oy+52,{size:24,color:CT,anchor:'middle',weight:700});
 s+=note('重力は無視',1110,500);
 return fade(g,s);
}

// ---- 小問1：前と後の2段、速度の数直線 ------------------------------------------------------------------
const WX1=560,Y1=170,Y2=290,BX1=330;
function rows({vel=1}={}){
 let s=wallR(WX1,Y1-60,Y1+50)+wallR(WX1,Y2-60,Y2+50);
 s+=label('前',60,Y1+10,{size:30,color:C.dim,weight:700})+label('後',60,Y2+10,{size:30,color:C.dim,weight:700});
 s+=ball(BX1,Y1)+ball(BX1,Y2);
 if(vel){s+=vArr(BX1,Y1,1,'15 m/s',{g:vel,len:90})+vArr(BX1,Y2,-1,'10 m/s',{g:vel,len:60});}
 return s;
}
// 運動量の矢印（前：右向き −3.0、後：左向き ＋2.0）。1 kg·m/s あたり 40 px
function pRows(g=1){
 const k=40,ya=Y1-50,yb=Y2-50,x0=BX1-60;
 return fade(g,arrow(x0,ya,x0+3*k,ya,{color:CP,w:8,head:20})+label('−3.0',x0+3*k+14,ya+9,{size:28,color:CP,weight:700})
  +arrow(x0+2*k,yb,x0,yb,{color:CP,w:8,head:20})+label('＋2.0',x0-14,yb+9,{size:28,color:CP,anchor:'end',weight:700}));
}
// 速度の数直線（紫）：右が大きい（ふつうの数直線）。−20〜15
const NX=120,NW=960,NY=450,VMIN=-20,VMAX=15,NXv=v=>NX+NW*(v-VMIN)/(VMAX-VMIN);
function numLine({g=1,pts=0,dv=0,lenLab=0}={}){
 let s=arrow(NX-10,NY,NX+NW+20,NY,{color:CV,w:3,head:14})+label('速度 v [m/s]（跳ね返る向きが正）',NX,NY-50,{size:22,color:CV});
 for(let v=-20;v<=15;v+=5){s+=line(NXv(v),NY-8,NXv(v),NY+8,{color:C.dim,w:2})+label(v>0?`＋${v}`:v<0?`−${-v}`:'0',NXv(v),NY+34,{size:22,color:C.dim,anchor:'middle'});}
 if(pts){
  s+=fade(pts,dot(NXv(-15),NY,10,CV)+label('前 −15',NXv(-15),NY-18,{size:26,color:CV,anchor:'middle',weight:700})
   +dot(NXv(10),NY,10,CV)+label('後 ＋10',NXv(10),NY-18,{size:26,color:CV,anchor:'middle',weight:700}));
 }
 if(dv)s+=arrow(NXv(-15),NY-4,NXv(10),NY-4,{color:HI,w:6,head:20,g:dv});
 if(lenLab)s+=fade(lenLab,label('長さ 25',(NXv(-15)+NXv(10))/2,NY-18,{size:28,color:HI,anchor:'middle',weight:700}));
 return fade(g,s);
}

// ---- 小問2・3：力–時刻のグラフ（左） ---------------------------------------------------------------
const GX=110,GY=460,TS=22000,FS=.55;
const gX=t=>GX+t*TS,gY=f=>GY-f*FS;
function axesFT({g=1,ticks=[]}={}){
 let s=arrow(GX-10,GY,GX+500,GY,{color:CT,w:3,head:14})+arrow(GX,GY+10,GX,GY-370,{color:CF,w:3,head:14});
 s+=label('t [s]',GX+505,GY-14,{size:24,color:CT,anchor:'end',weight:700})+label('F [N]',GX+14,GY-352,{size:24,color:CF,weight:700});
 s+=line(gX(.02),GY-6,gX(.02),GY+6,{color:CT,w:2.5})+label('0.020',gX(.02),GY+34,{size:24,color:CT,anchor:'middle',weight:700})+label('0',GX-12,GY+30,{size:22,color:C.dim,anchor:'end'});
 for(const f of ticks)s+=line(GX-6,gY(f),GX+6,gY(f),{color:C.dim,w:2})+label(String(f),GX-12,gY(f)+8,{size:22,color:C.dim,anchor:'end'});
 return fade(g,s);
}
const TRI=(h=500)=>[[gX(0),GY],[gX(.01),gY(h)],[gX(.02),GY]];
function triangle({g=1,fill=0,q=0,areaLab=0,apexLab=0}={}){
 let s=poly(TRI(),{fill:CP,fo:.3*fill,stroke:'none'})+draw(TRI(),1,{color:CF,w:4});
 if(q)s+=fade(q,label('?',gX(.01),gY(500)-16,{size:36,color:HI,anchor:'middle',weight:700}));
 if(areaLab)s+=fade(areaLab,label('面積 5.0 N·s',gX(.0062),GY-50,{size:26,color:C.ink,anchor:'middle',weight:700}));
 if(apexLab)s+=fade(apexLab,label('500 N',gX(.01),gY(500)-16,{size:30,color:HI,anchor:'middle',weight:700})+line(GX,gY(500),gX(.01),gY(500),{color:HI,w:2,dash:'6 6'})+label('500',GX-12,gY(500)+8,{size:22,color:HI,anchor:'end'}));
 return fade(g,s);
}
function avgRect({g=1,lab=1}={}){
 let s=`<rect x="${gX(0)}" y="${gY(250).toFixed(1)}" width="${.02*TS}" height="${(250*FS).toFixed(1)}" fill="${CF}" fill-opacity=".08" stroke="${CF}" stroke-width="3.5" stroke-dasharray="10 7"/>`;
 if(lab)s+=fade(lab,line(GX-6,gY(250),GX+6,gY(250),{color:CF,w:2})+label('250',GX-12,gY(250)+8,{size:22,color:CF,anchor:'end',weight:700}));
 return fade(g,s);
}
// 放物線の山（底辺 0.020 s、面積 5.0 → 頂上 375 N）
const HUMP=(h=375,n=40)=>Array.from({length:n+1},(_,i)=>{const u=i/n;return [gX(.02*u),gY(4*h*u*(1-u))];});

// 「単元動画の例」の札（灰色の丸い札）
function tagBox(t,x,y,{size=24}={}){const w=t.length*size*1.02+30;return rect(x-w/2,y-size*.85-8,w,size+18,{fill:C.dim,fo:.14,stroke:C.dim,sw:2,rx:16})+label(t,x,y+2,{size,color:C.ink,anchor:'middle',weight:700});}
// 小さなグラフ（行16・まとめ）：x,y＝原点、w＝底辺の幅、kind＝tri|hump|rect
function mini(x,y,w,kind,{g=1,sc=.36,lab=''}={}){
 const H={tri:500,hump:375,rect:250}[kind];let s=arrow(x-6,y,x+w+30,y,{color:CT,w:2.5,head:12})+arrow(x,y+6,x,y-200,{color:CF,w:2.5,head:12});
 if(kind==='tri'){const P=[[x,y],[x+w/2,y-H*sc],[x+w,y]];s+=poly(P,{fill:CP,fo:.3})+draw(P,1,{color:CF,w:3.5});}
 if(kind==='hump'){const P=Array.from({length:41},(_,i)=>{const u=i/40;return [x+w*u,y-4*H*sc*u*(1-u)];});s+=poly(P,{fill:CP,fo:.3})+draw(P,1,{color:CF,w:3.5});}
 if(kind==='rect')s+=rect(x,y-H*sc,w,H*sc,{fill:CP,fo:.3,stroke:CF,sw:3.5,rx:0});
 s+=line(x,y-250*sc,x+w,y-250*sc,{color:HI,w:2.5,dash:'7 6'});
 if(lab)s+=label(lab,x+w/2,y+36,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}

export const ytQxUmMomentumChangeDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 s）：0〜2 s 壁へ 15 m/s、2〜4 s 跳ね返って 10 m/s、接触中に「接触 0.020 s」。4〜6 s 下に力–時刻の軸と二等辺三角形の形だけ・「重力は無視」。
 // 運動量の変化・力の値は出さない。
 [K+'q1']:(p,ctx)=>{
  const t=cueT(ctx);
  return setup(t)+shapeOnly(seg(t,4,4.6));
 },

 // ===================== 小問1 =====================
 // 1. 出題中の図（壁へ向かい、跳ね返る）。下に「小問1」の枠
 [K+'goal1']:(p,ctx)=>{
  const t=tAt(ctx,K+'goal1');
  let s=setup(t);
  s+=card(250,330,700,150,label('小問1',600,375,{size:26,color:C.dim,anchor:'middle'})+label('壁に 当たる 前後の 運動量の 変化',600,435,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 前と後の2段（速度）、右に「後 − 前」。2文目：速度の数直線に −15 と ＋10
 [K+'line']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=rows({})+posDir(700,110);
  s+=card(700,150,440,110,label('変化 ＝ 後 − 前',920,218,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.05,.15),HI);
  s+=numLine({g:seg(p,b,b+.08),pts:seg(p,b+.3,b+.45)});
  s+=goalTag(G1);
  return s;
 },
 // 3a. 数直線で −15 → ＋10 の黄の矢印「長さ 25」。右に Δv と Δp の式
 [K+'dv']:(p)=>{
  let s=rows({})+numLine({pts:1,dv:seg(p,.05,.25),lenLab:seg(p,.2,.3)});
  s+=card(PX,100,PW,250,T(`\\Delta ${cc(CV,'v')}=10-(-15)=${cc(CV,'25\\,\\mathrm{m/s}')}`,PC,165,34)
   +fade(seg(p,.45,.6),T(`\\Delta ${cc(CP,'p')}=0.20\\times25`,PC,240,36))
   +fade(seg(p,.6,.75),T(`=${cc(CP,'5.0'+PMS)}`,PC,310,38)),seg(p,.02,.12),CP);
  s+=goalTag(G1);
  return s;
 },
 // 3b. 小問1 の答え C
 [K+'ans1']:(p)=>{
  let s=rows({})+numLine({pts:1,dv:1,lenLab:1});
  s+=card(PX,100,PW,250,T(`\\Delta ${cc(CV,'v')}=10-(-15)=${cc(CV,'25\\,\\mathrm{m/s}')}`,PC,165,34)
   +T(`\\Delta ${cc(CP,'p')}=0.20\\times25`,PC,240,36)+T(`=${cc(CP,'5.0'+PMS)}`,PC,310,38),1,CP);
  s+=goalTag(G1)+A1(seg(p,.05,.15));
  return s;
 },
 // 4. 運動量の矢印（桃）：前は右向き −3.0、後は左向き ＋2.0。差 5.0
 [K+'pcheck']:(p)=>{
  let s=rows({vel:0})+pRows(seg(p,.05,.25))+posDir(40,410);
  s+=panel(100,260,T(`${cc(CP,'p_{1}')}=0.20\\times(-15)=${cc(CP,'-3.0')}`,PC,160,32)
   +fade(seg(p,.25,.4),T(`${cc(CP,'p_{2}')}=0.20\\times10=${cc(CP,'+2.0')}`,PC,225,32))
   +fade(seg(p,.5,.65),T(`\\Delta ${cc(CP,'p')}=2.0-(-3.0)=${cc(CP,'5.0')}`,PC,300,34)),seg(p,.02,.1),CP);
  s+=fade(seg(p,.05,.2),label('（添字 1＝前、2＝後）',PC,395,{size:22,color:C.dim,anchor:'middle'}));
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 5a. 誤答 A（速さの差だけ）
 [K+'wrong1A']:(p)=>{
  let s=rows({vel:0})+pRows(1)+posDir(40,410);
  s+=wrongCard('A','1.0',['向きが逆に なったことを 落とした'],{...WOPT,y:150,mid:'0.20\\times(15-10)=1.0',g:seg(p,.03,.1)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 5b. 誤答 B → D（一枚ずつ）
 [K+'wrong1BD']:(p,ctx)=>{
  const b=atMark(ctx,'ディーの',.5);
  let s=rows({vel:0})+pRows(1)+posDir(40,410);
  s+=wrongSeq(p,ctx,[['B','3.0','止まるまでの 分だけ',{mid:'0.20\\times15=3.0'}],['D','2.0','後の 運動量で、変化 ではない',{mid:'0.20\\times10=2.0'}]],{win:[[0,b],[b,1]],opts:{...WOPT,y:150}});
  s+=goalTag(G1)+A1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 6. 力–時刻のグラフを大きく（三角形の線）。右の枠「小問2」
 [K+'goal2']:(p)=>{
  let s=axesFT({g:seg(p,0,.15)})+triangle({g:seg(p,.1,.3)});
  s+=panel(100,200,label('小問2',PC,148,{size:26,color:C.dim,anchor:'middle'})+label('壁が ボールに 及ぼした',PC,205,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('平均の力の 大きさ',PC,255,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 7. 法則 Δp＝∫F dt。三角形の内側を桃で塗り「面積 5.0 N·s」
 [K+'area']:(p)=>{
  let s=axesFT()+triangle({fill:seg(p,.4,.6),areaLab:seg(p,.55,.7)});
  s+=panel(100,220,kindTag('法則',PC,150,{text:'Δp ＝ ∫F dt'})
   +fade(seg(p,.15,.3),label('力は 刻々と 変わる',PC,205,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.45,.6),label('グラフの 面積 ＝ Δp ＝ 5.0 N·s',PC,270,{size:28,color:CP,anchor:'middle',weight:700})),seg(p,.02,.1),CF);
  s+=goalTag(G2);
  return s;
 },
 // 8a. 同じ幅・同じ面積の長方形（緑の点線）
 [K+'rect']:(p)=>{
  let s=axesFT()+triangle({fill:1,areaLab:1})+avgRect({g:seg(p,.15,.35),lab:seg(p,.4,.55)});
  s+=panel(100,220,label('同じ 0.020 s・同じ 面積の 長方形',PC,150,{size:26,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),T(`\\overline{${cc(CF,'F')}}\\times0.020=5.0`,PC,225,40))
   +fade(seg(p,.5,.65),label('平均の力 ＝ 長方形の 高さ',PC,290,{size:26,color:C.ink,anchor:'middle'})),seg(p,.02,.1),CF);
  s+=goalTag(G2);
  return s;
 },
 // 8b. 5.0÷0.020＝250 N。答えの札 A
 [K+'avg']:(p,ctx)=>{
  let s=axesFT()+triangle({fill:1,areaLab:1})+avgRect({});
  s+=panel(100,220,label('同じ 0.020 s・同じ 面積の 長方形',PC,150,{size:26,color:CF,anchor:'middle',weight:700})
   +T(`\\overline{${cc(CF,'F')}}=\\dfrac{5.0}{0.020}=${cc(CF,'250\\,\\mathrm{N}')}`,PC,240,40),1,CF);
  s+=goalTag(G2)+A2(seg(p,atMark(ctx,'しょうもん にの',.6),atMark(ctx,'しょうもん にの',.6)+.06));
  return s;
 },
 // 9. 誤答 B → C → D（一枚ずつ、右の枠の下）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),a=W[1]?W[1][0]:.35,b=atMark(ctx,'ディーの',.7);
  let s=axesFT()+triangle({fill:1,areaLab:1})+avgRect({});
  s+=panel(100,120,T(`\\overline{${cc(CF,'F')}}=\\dfrac{5.0}{0.020}=${cc(CF,'250\\,\\mathrm{N}')}`,PC,165,36),1,C.faint);
  s+=wrongSeq(p,ctx,[['B','0.10 N','5.0×0.020 と 掛けた',{mid:'5.0\\times0.020=0.10'}],['C','50 N','Δp を 1.0 とした',{mid:'1.0\\div0.020=50'}],['D','100 N','後の 運動量 2.0 を 使った',{mid:'2.0\\div0.020=100'}]],{win:[[0,a],[a,b],[b,1]],opts:{...WOPT,y:240}});
  s+=goalTag(G2)+A2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 10. 二等辺三角形の頂上に「?」
 [K+'goal3']:(p)=>{
  let s=axesFT()+triangle({fill:1,q:seg(p,.2,.35)});
  s+=panel(100,200,label('小問3',PC,148,{size:26,color:C.dim,anchor:'middle'})+label('二等辺三角形の とき',PC,205,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('力の 最大値',PC,255,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 11. 底辺 0.020 s（金）と高さ「?」を光らせる。三角形の面積 ½×底辺×高さ
 [K+'tri']:(p)=>{
  let s=axesFT()+triangle({fill:1,q:1,areaLab:seg(p,.05,.15)});
  s+=fade(seg(p,.4,.5),line(gX(0),GY+4,gX(.02),GY+4,{color:CT,w:8})+label('底辺',gX(.01),GY+34,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.65),line(gX(.01),GY,gX(.01),gY(500),{color:HI,w:4,dash:'8 6'})+label('高さ',gX(.01)+12,gY(250),{size:24,color:HI,weight:700}));
  s+=panel(100,200,label('面積は 同じ 5.0 N·s',PC,150,{size:28,color:CP,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('三角形の 面積',PC,205,{size:24,color:C.dim,anchor:'middle'})+label('½ × 底辺 × 高さ',PC,255,{size:32,color:C.ink,anchor:'middle',weight:700})),seg(p,.02,.1),CP);
  s+=goalTag(G3);
  return s;
 },
 // 12. 式を一行ずつ：½×0.020×高さ＝5.0 → 高さ＝5.0×2÷0.020 → ＝500 N。頂上に「500 N」。答えの札 B
 [K+'peak']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.75;
  let s=axesFT()+triangle({fill:1,q:1-seg(p,.55,.62),apexLab:seg(p,.6,.7)});
  s+=panel(100,300,T('\\tfrac{1}{2}\\times0.020\\times h=5.0',PC,160,36)
   +fade(seg(p,.25,.38),T('h=5.0\\times2\\div0.020',PC,240,36))
   +fade(seg(p,.45,.58),T(`=${cc(CF,'500\\,\\mathrm{N}')}`,PC,315,40))
   +fade(seg(p,.05,.15),label('h ＝ 高さ',PX+PW-20,380,{size:22,color:C.dim,anchor:'end'})),seg(p,.02,.1),CF);
  s+=goalTag(G3)+A3(seg(p,b,b+.08));
  return s;
 },
 // 13. 長方形からはみ出す三角形の頂上を黄で光らせる（頂上は2倍）。2文目：誤答 A
 [K+'twice']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=axesFT()+triangle({fill:1,apexLab:1})+avgRect({});
  s+=fade(seg(p,.05,.2),poly([[gX(.005),gY(250)],[gX(.01),gY(500)],[gX(.015),gY(250)]],{fill:HI,fo:.45,stroke:HI,sw:3}));
  s+=fade(seg(p,.15,.3),label('頂上 ＝ 2 × 250',gX(.0125)+10,gY(375),{size:24,color:HI,weight:700}));
  s+=panel(100,120,label('同じ 面積 なら 頂上は 長方形の 高さの 2倍',PC,170,{size:24,color:HI,anchor:'middle',weight:700}),seg(p,.05,.15),HI);
  s+=wrongCard('A','250 N','平均と 最大を 同じとした',{...WOPT,y:260,g:seg(p,b,b+.05)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 14. 誤答 C → D（一枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const b=atMark(ctx,'ディーの',.5);
  let s=axesFT()+triangle({fill:1,apexLab:1})+avgRect({});
  s+=panel(100,120,T('h=5.0\\times2\\div0.020=500\\,\\mathrm{N}',PC,165,32),1,C.faint);
  s+=wrongSeq(p,ctx,[['C','125 N','×2 ではなく ×½ に した',{mid:'\\tfrac{1}{2}\\times5.0\\div0.020=125'}],['D','5.0 N','力積 5.0 N·s を 力とした',{mid:'5.0\\,\\mathrm{N\\cdot s}\\ne5.0\\,\\mathrm{N}'}]],{win:[[0,b],[b,1]],opts:{...WOPT,y:240}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 15. 単元動画の山の形の例（頂上 900 N・平均 600 N、Δt＝0.010 s）を右の小さな枠に。2文目：最大の力は波形で変わる
 [K+'hump']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=fade(.45,axesFT()+triangle({fill:1,apexLab:1})+avgRect({lab:0}));
  // 小さな枠：放物線 F＝3600 u(1−u)、頂上 900、平均 600
  const x0=PX,y0=96,w=PW,h=330,ox=x0+80,oy=y0+h-50,bw=300,sc=.2;
  let ins=card(x0,y0,w,h,'',1,C.ink)+tagBox('単元動画の例',x0+110,y0+40);
  ins+=arrow(ox-6,oy,ox+bw+60,oy,{color:CT,w:2.5,head:12})+arrow(ox,oy+6,ox,oy-250,{color:CF,w:2.5,head:12});
  const P=Array.from({length:41},(_,i)=>{const u=i/40;return [ox+bw*u,oy-3600*u*(1-u)*sc];});
  ins+=poly(P,{fill:CP,fo:.25})+draw(P,1,{color:CF,w:3.5});
  ins+=line(ox,oy-600*sc,ox+bw,oy-600*sc,{color:HI,w:2.5,dash:'7 6'})+label('平均 600 N',ox+bw+10,oy-600*sc+8,{size:22,color:HI,weight:700});
  ins+=label('頂上 900 N',ox+bw/2,oy-900*sc-12,{size:24,color:CF,anchor:'middle',weight:700})+label('0.010 s',ox+bw,oy+30,{size:22,color:CT,anchor:'middle',weight:700});
  s+=fade(seg(p,.03,.15),ins);
  s+=fade(seg(p,b,b+.08),label('最大の力は 波形 によって 変わる',PC,475,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 16. F平均＝Δp/Δt を大きく。三角形・放物線の山・長方形が同じ面積（同じ底辺 0.020 s）
 [K+'same']:(p)=>{
  let s=T(`\\overline{${cc(CF,'F')}}=\\dfrac{\\Delta ${cc(CP,'p')}}{\\Delta ${cc(CT,'t')}}=\\dfrac{5.0}{0.020}=${cc(CF,'250\\,\\mathrm{N}')}`,600,140,44);
  const xs=[130,500,870],y=400,w=200;
  [['tri','三角形'],['hump','山の形'],['rect','長方形']].forEach(([k,l],i)=>{s+=mini(xs[i],y,w,k,{g:seg(p,.15+.1*i,.25+.1*i),lab:l});});
  s+=fade(seg(p,.5,.6),label('面積は どれも 5.0 N·s',380,488,{size:26,color:CP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.7),label('点線 ＝ 平均 250 N（同じ）',850,488,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=goalTag(G3)+A3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 17. Δp＝∫F dt と、面積の図を並べる。右上に答えの札3枚
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(30,96,555,400,label('力を 時間で 積む',307,140,{size:28,color:C.ink,anchor:'middle',weight:700})
   +T(`\\Delta ${cc(CP,'p')}=\\int ${cc(CF,'F')}\\,d${cc(CT,'t')}`,307,230,52)
   +label('向きを 含めて 後 − 前',307,340,{size:28,color:HI,anchor:'middle',weight:700})
   +label('（跳ね返る 向きが 正）',307,390,{size:24,color:C.dim,anchor:'middle'}),seg(p,.03,.15),CF);
  const ox=700,oy=440,bw=300,sc=.5;
  let r=label('面積 ÷ 幅 ＝ 平均の力',892,140,{size:28,color:C.ink,anchor:'middle',weight:700});
  r+=arrow(ox-6,oy,ox+bw+50,oy,{color:CT,w:2.5,head:12})+arrow(ox,oy+6,ox,oy-280,{color:CF,w:2.5,head:12});
  const P=[[ox,oy],[ox+bw/2,oy-500*sc],[ox+bw,oy]];
  r+=poly(P,{fill:CP,fo:.3})+draw(P,1,{color:CF,w:3.5})+`<rect x="${ox}" y="${oy-250*sc}" width="${bw}" height="${250*sc}" fill="none" stroke="${CF}" stroke-width="3" stroke-dasharray="10 7"/>`;
  r+=label('0.020 s',ox+bw/2,oy+32,{size:22,color:CT,anchor:'middle',weight:700})+label('250 N',ox+bw+12,oy-250*sc+8,{size:22,color:CF,weight:700});
  s+=card(615,96,555,400,r,seg(p,b,b+.12),HI);
  s+=answerRow([[1,'C',''],[2,'A','250 N'],[3,'B','500 N']],{g:seg(p,.8,.9)});
  return s;
 },
};
