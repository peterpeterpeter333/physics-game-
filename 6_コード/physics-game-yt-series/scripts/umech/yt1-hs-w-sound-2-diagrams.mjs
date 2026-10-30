// 高校編「音波・深く学ぶ 2/3」(ys-hs-w-sound-2) — 図。Stage 1200×515.
// うなり：耳の位置での「空気の右へのずれ」の時間グラフ（縦は ずれ、上下の運動ではない）。
// 440 Hz・442 Hz を、見やすいように 1秒に 20回・22回で描く（差の 2回は実際と同じ → 強め合いは 0、0.5、1.0 s）。
// 色：f 桃、t 金、440 Hz の波 水色系、442 Hz の波 桃系、足した波 白、強め合い 黄の縦線、弱め合い 灰の縦線。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,clamp} from './anim.mjs';
import {card,tag,T2,tSince,LC,TCOL,FC,VCOL,ROPE,MK,HZ,SS,Vt,speaker,ear,AIR} from './yt1-hs-w-sound-1-diagrams.mjs';
import {table} from './yt1-hs-m-energy-1-diagrams.mjs';

const K='hs-w-sound-2:';
const PI=Math.PI;
export const W1='#8fd3ff', W2='#ff9fd2';
// ---- beat graphs: time 0..1 s over x0..x1 --------------------------------------------------------
export const BG={x0:190,x1:1090,ys:[100,215,385],A:36,f1:20,f2:22};
const BX=t=>BG.x0+(BG.x1-BG.x0)*t;
export function btrace(y,fn,{upto=1,g=1,color=ROPE,w=3,amp=BG.A,from=0}={}){
 const pts=[],N=1400;for(let i=0;i<=N;i++){const t=from+(upto-from)*i/N;pts.push([BX(t),y-amp*fn(t)]);}
 return fade(g,draw(pts,1,{color,w}));
}
export const s1=t=>Math.cos(2*PI*BG.f1*t), s2=t=>Math.cos(2*PI*BG.f2*t), sum=t=>(s1(t)+s2(t))/2;
export function beatPanels({g1=1,g2=1,gs=0,u1=1,u2=1,us=1,marks=0,weak=0,axis=1,env=0,note=0,dim=1,lab=1}={}){
 let s='';const [y1,y2,ys]=BG.ys;
 const base=(y,g)=>fade(g*.8,line(BG.x0,y,BG.x1,y,{color:C.faint,w:2,dash:'6 8'}));
 if(g1)s+=base(y1,g1)+btrace(y1,s1,{upto:u1,g:g1*dim,color:W1})+(lab?fade(g1,label('440 Hz',BG.x0-16,y1+8,{size:24,color:W1,anchor:'end',weight:700})):'');
 if(g2)s+=base(y2,g2)+btrace(y2,s2,{upto:u2,g:g2*dim,color:W2})+(lab?fade(g2,label('442 Hz',BG.x0-16,y2+8,{size:24,color:W2,anchor:'end',weight:700})):'');
 if(gs)s+=base(ys,gs)+btrace(ys,sum,{upto:us,g:gs,color:ROPE,amp:2*BG.A})+(lab?fade(gs,label('足した',BG.x0-16,ys-6,{size:24,color:ROPE,anchor:'end',weight:700})+label('ずれ',BG.x0-16,ys+24,{size:24,color:ROPE,anchor:'end',weight:700})):'');
 if(env){const up=[],dn=[];for(let i=0;i<=300;i++){const t=i/300,e=2*BG.A*Math.abs(Math.cos(2*PI*t));up.push([BX(t),ys-e]);dn.push([BX(t),ys+e]);}
  s+=fade(env,draw(up,1,{color:C.hi,w:3,dash:'10 7'})+draw(dn,1,{color:C.hi,w:3,dash:'10 7'}));}
 if(marks)[0,.5,1].forEach(t=>{s+=fade(marks,line(BX(t),y1-48,BX(t),ys+2*BG.A+8,{color:C.hi,w:3}));});
 if(weak)[.25,.75].forEach(t=>{s+=fade(weak,line(BX(t),y1-48,BX(t),ys+2*BG.A+8,{color:C.dim,w:3,dash:'6 6'}));});
 if(axis){const ya=ys+2*BG.A+26;s+=fade(axis,[0,.25,.5,.75,1].map(t=>label(t===0?'0':t===1?'1.0':String(t),BX(t),ya+6,{size:22,color:TCOL,anchor:'middle'})).join('')+label('[s]',BG.x1+40,ya+6,{size:22,color:TCOL}));}
 if(note)s+=fade(note,label('振動の 回数は 実際より 少なく 描いています（差の 1秒に 2回は 同じ）',600,26,{size:22,color:C.dim,anchor:'middle'}));
 return s;
}
// ---- superposition bars --------------------------------------------------------------------------
function bars(x,a,b,{g=1,u=1,res=''}={}){
 const y0=330,k=70;let s=fade(g,line(x-150,y0,x+150,y0,{color:C.dim,w:2}));
 const bar=(xx,v,c,gg)=>fade(gg,rect(xx-26,v>0?y0-k*v:y0,52,k*Math.abs(v),{fill:c,fo:.55,stroke:c,rx:6})+label((v>0?'＋':'−')+Math.abs(v),xx,v>0?y0-k*v-14:y0-k*v+30,{size:26,color:c,anchor:'middle',weight:700}));
 s+=bar(x-110,a,W1,g)+fade(g,label('＋',x-55,y0-40,{size:32,color:C.ink,anchor:'middle'}))+bar(x,b,W2,g);
 s+=fade(g*u,label('＝',x+55,y0-40,{size:32,color:C.ink,anchor:'middle'}));
 const r=a+b;if(r!==0)s+=fade(g*u,rect(x+110-26,y0-k*r,52,k*r,{fill:ROPE,fo:.55,stroke:ROPE,rx:6})+label('＋'+r,x+110,y0-k*r-14,{size:26,color:ROPE,anchor:'middle',weight:700}));
 else s+=fade(g*u,label('0',x+110,y0-14,{size:30,color:ROPE,anchor:'middle',weight:700}));
 if(res)s+=fade(g*u,label(res,x,y0+150,{size:32,color:r?C.hi:C.dim,anchor:'middle',weight:700}));
 return s;
}
// ---- two phase dials (pointer up ＝ 山) ------------------------------------------------------------
function dial(x,y,cyc,text,color,{g=1}={}){
 const a=PI/2-2*PI*cyc,X=x+52*Math.cos(a),Y=y-52*Math.sin(a);
 return fade(g,ring(x,y,64,{color:C.dim,w:3,fill:'#131f38'})+label('山',x,y-74,{size:22,color:C.dim,anchor:'middle'})+label('谷',x,y+94,{size:22,color:C.dim,anchor:'middle'})+arrow(x,y,X,Y,{color,w:6,head:16})+label(text,x,y+130,{size:24,color,anchor:'middle',weight:700}));
}
const COLS=[{h:'時刻',color:TCOL,w:130},{h:'440 Hz',color:W1,w:150},{h:'442 Hz',color:W2,w:150},{h:'ずれ',color:C.hi,w:110}];
function ctable(rows,{g=1,hl=[]}={}){return table({x:60,y:60,cols:COLS,rows,hl,rh:62,g,size:28});}
const R0=['0 s','0 回','0 回','0'],R1=['0.25 s','110 回','110.5 回','半回'],R2=['0.5 s','220 回','221 回','1 回'];
function dials(c1,c2,res,{g=1,rc=C.hi}={}){
 return dial(820,210,c1,'440 Hz',W1,{g})+dial(1040,210,c2,'442 Hz',W2,{g})+(res?fade(g,label(res,930,440,{size:32,color:rc,anchor:'middle',weight:700})):'');
}
// ---- hearing range (log scale) -------------------------------------------------------------------
const LX=f=>150+Math.log10(f)/Math.log10(30000)*900;
function hear({g=1,m2=0,m441=0}={}){
 let s=fade(g,line(LX(1),330,LX(30000),330,{color:C.dim,w:3})+rect(LX(20),300,LX(20000)-LX(20),60,{fill:C.F,fo:.18,stroke:C.F,rx:8})+label('人に 聞こえる 範囲（およそ 20 Hz 〜 20000 Hz）',(LX(20)+LX(20000))/2,280,{size:24,color:C.F,anchor:'middle',weight:700}));
 s+=fade(g,[1,10,100,1000,10000].map(f=>line(LX(f),322,LX(f),338,{color:C.dim})+label(String(f),LX(f),390,{size:22,color:C.dim,anchor:'middle'})).join('')+label('Hz',LX(30000)+10,396,{size:22,color:C.dim}));
 if(m2)s+=fade(m2,dot(LX(2),330,11,C.a)+label('2 Hz',LX(2),440,{size:26,color:C.a,anchor:'middle',weight:700}));
 if(m441)s+=fade(m441,dot(LX(441),330,11,C.hi)+label('441 Hz',LX(441),440,{size:26,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
// ---- tuning: beat traces with difference d (display) -----------------------------------------------
function tune(y,d,text,{g=1}={}){
 const fn=t=>(Math.cos(2*PI*20*t)+Math.cos(2*PI*(20+d)*t))/2;
 return fade(g,line(BG.x0,y,BG.x1,y,{color:C.faint,w:2,dash:'6 8'}))+btrace(y,fn,{g,amp:34,w:2.5})+fade(g,label(text,BG.x0-16,y+8,{size:24,color:C.ink,anchor:'end',weight:700}));
}
// ---- reflection teaser ----------------------------------------------------------------------------
function reflect(p,{g=1}={}){
 let s=speaker(0,{o:{...AIR,mx:200},g,y0:150,y1:290})+fade(g,rect(980,90,40,280,{fill:'#56627a',fo:.9,stroke:C.dim,rx:4})+label('壁',1000,74,{size:26,color:C.dim,anchor:'middle'}));
 s+=arrow(240,190,960,190,{color:W1,w:5,head:18,g:g*seg(p,.05,.4)});
 s+=arrow(960,250,240,250,{color:W2,w:5,head:18,g:g*seg(p,.4,.75)});
 s+=fade(g*seg(p,.1,.3),label('もとの 音',600,170,{size:26,color:W1,anchor:'middle',weight:700}))+fade(g*seg(p,.5,.7),label('跳ね返った 音',600,300,{size:26,color:W2,anchor:'middle',weight:700}));
 return s;
}

export const hsWSound2Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=beatPanels({g1:0,g2:0,gs:seg(p,.05,.2),us:lin(p,.05,.8),axis:0,lab:0});
  s+=fade(seg(p,.5,.65),[0,.5,1].map(t=>label('ワーン',BX(t),BG.ys[2]-2*BG.A-24,{size:28,color:C.hi,anchor:'middle',weight:700})).join(''));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.45,beatPanels({g1:0,g2:0,gs:1,axis:0,lab:0}));
  s+=card(250,60,700,130,label('1秒に 何回？',600,145,{size:44,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ex']:(p)=>{
  const fork=(x,c,t,g)=>fade(g,rect(x-24,120,16,170,{fill:c,fo:.7,stroke:c,rx:6})+rect(x+8,120,16,170,{fill:c,fo:.7,stroke:c,rx:6})+rect(x-24,282,48,22,{fill:c,fo:.7,stroke:c,rx:6})+rect(x-8,300,16,90,{fill:c,fo:.7,stroke:c,rx:4})+label(t,x,450,{size:32,color:c,anchor:'middle',weight:700}));
  let s=fork(420,W1,'440 Hz',seg(p,.05,.2))+fork(780,W2,'442 Hz',seg(p,.15,.3));
  s+=fade(seg(p,.55,.7),label('音叉：決まった 振動数で 鳴る',600,60,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'pred']:(p)=>{
  let s=card(250,40,700,110,label('1秒に 何回 ワーン？',600,112,{size:38,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  ['1回','2回','441回','882回'].forEach((t,i)=>{const x=270+i*220;s+=fade(seg(p,.15+i*.08,.25+i*.08),rect(x-85,240,170,80,{fill:FC,fo:.1,stroke:FC,sw:2,rx:14})+label(t,x,292,{size:32,color:C.ink,anchor:'middle',weight:700}));});
  return s;
 },
 // ================= S2 重ね合わせ =================
 [K+'g1']:(p)=>{
  let s=beatPanels({g1:seg(p,.05,.2),u1:lin(p,.2,.85),g2:0,gs:0,axis:seg(p,.05,.2)});
  s+=fade(seg(p,.05,.2),label('耳の 位置での 空気の 右への ずれ',600,26,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'g2']:(p)=>{
  let s=beatPanels({g1:1,g2:seg(p,.05,.2),u2:lin(p,.1,.6),gs:0,note:seg(p,.6,.75)});
  return s;
 },
 [K+'sp1']:(p)=>{
  let s=fade(.3,beatPanels({g1:1,g2:1,gs:0,lab:0,axis:0}));
  s+=card(200,300,800,150,label('同時に 届くと',600,355,{size:28,color:C.ink,anchor:'middle'})+label('ずれ ＝ 二つの ずれの 和',600,415,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=tag('重ね合わせ',600,490,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'sp2']:(p)=>{
  let s=fade(.3,beatPanels({g1:1,g2:1,gs:0,lab:0,axis:0}));
  s+=card(200,300,800,150,label('ずれ ＝ 二つの ずれの 和',600,365,{size:36,color:C.hi,anchor:'middle',weight:700})+label('詳しくは「干渉と回折」の 単元で',600,420,{size:26,color:C.dim,anchor:'middle'}),1,C.hi);
  return s;
 },
 [K+'bar1']:(p)=>bars(600,1,1,{u:seg(p,.3,.45),res:'強め合い'}),
 [K+'bar2']:(p)=>fade(.35,bars(330,1,1,{res:'強め合い'}))+bars(850,1,-1,{g:seg(p,.05,.2),u:seg(p,.3,.45),res:'弱め合い'}),
 [K+'sum']:(p)=>beatPanels({gs:seg(p,.05,.15),us:lin(p,.1,.9)}),
 [K+'sum2']:(p)=>beatPanels({gs:1,marks:seg(p,.05,.25),weak:seg(p,.35,.55)}),
 [K+'beat']:(p)=>{
  let s=beatPanels({gs:1,marks:1,weak:1,env:seg(p,.1,.3)});
  s+=fade(seg(p,.4,.55),[0,.5,1].map(t=>label('強',BX(t)+(t===1?-24:24),BG.ys[0]-40,{size:24,color:C.hi,anchor:'middle',weight:700})).join('')+[.25,.75].map(t=>label('弱',BX(t)+24,BG.ys[0]-40,{size:24,color:C.dim,anchor:'middle',weight:700})).join(''));
  return s;
 },
 // ================= S3 ずれを数える =================
 [K+'cnt0']:(p)=>ctable([['','','',''],['','','',''],['','','','']],{g:seg(p,.1,.25)})+dials(0,0,'',{g:seg(p,.3,.45)}),
 [K+'cnt1']:(p)=>ctable([R0,['','','',''],['','','','']],{hl:[0]})+dials(0,0,'そろう → 強め合い',{g:1})+fade(1-seg(p,.4,.6),''),
 [K+'cnt2']:(p)=>ctable([R0,[R1[0],seg(p,.4,.55)>.5?R1[1]:'','',''],['','','','']])+dials(0,0,'')+fade(seg(p,.55,.7),label('440 × 0.25 ＝ 110',600,470,{size:30,color:W1,anchor:'middle',weight:700})),
 [K+'cnt3']:(p)=>ctable([R0,[R1[0],R1[1],seg(p,.3,.45)>.5?R1[2]:'',seg(p,.6,.75)>.5?R1[3]:''],['','','','']],{hl:[1]})+dials(0,.5*seg(p,.6,.75),'')+fade(seg(p,.3,.45),label('442 × 0.25 ＝ 110.5',600,470,{size:30,color:W2,anchor:'middle',weight:700})),
 [K+'cnt4']:(p)=>ctable([R0,R1,['','','','']],{hl:[1]})+dials(0,.5,'山 と 谷 → 弱め合い',{rc:C.dim}),
 [K+'cnt5']:(p)=>ctable([R0,R1,[R2[0],seg(p,.1,.25)>.5?R2[1]:'',seg(p,.3,.45)>.5?R2[2]:'',seg(p,.6,.75)>.5?R2[3]:'']],{hl:[2]})+dials(0,.5+.5*seg(p,.6,.75),''),
 [K+'cnt6']:(p)=>ctable([R0,R1,R2],{hl:[2]})+dials(0,1,'またそろう → 強め合い'),
 [K+'cnt7']:(p)=>ctable([R1,R2,['0.75 s','330 回','331.5 回','1.5 回']],{hl:[2]})+dials(0,.5,'山 と 谷 → 弱め合い',{rc:C.dim}),
 [K+'rate1']:(p)=>{
  let s=card(160,30,880,120,T2(`442-440=2`,600,100,{size:48,auto:false}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.1,.25),label('1秒あたりに たまる ずれの 回数',600,190,{size:26,color:C.dim,anchor:'middle'}));
  const y=330;s+=fade(seg(p,.4,.55),line(BX(0),y,BX(1),y,{color:TCOL,w:3})+[0,.5,1].map(t=>line(BX(t),y-12,BX(t),y+12,{color:TCOL,w:3})+label(t===0?'0':t===1?'1.0 s':'0.5 s',BX(t),y+44,{size:24,color:TCOL,anchor:'middle'})).join(''));
  s+=fade(seg(p,.6,.75),label('ずれ 1回',BX(.25),y-24,{size:26,color:C.hi,anchor:'middle',weight:700})+label('ずれ 2回',BX(.75),y-24,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),[.5,1].map(t=>label('強',BX(t),y+90,{size:28,color:C.hi,anchor:'middle',weight:700})).join(''));
  return s;
 },
 [K+'rate2']:(p)=>{
  let s=beatPanels({g1:.5,g2:.5,gs:1,marks:1,env:1});
  s+=card(760,0,330,56,label('1秒に 2回',925,38,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'gen1']:(p)=>{
  let s=card(150,60,900,180,label('うなりの 回数（1秒あたり）',600,120,{size:30,color:C.ink,anchor:'middle'})+T2(`=|{\\color{${FC}}f_1}-{\\color{${FC}}f_2}|`,600,195,{size:56,auto:false}),seg(p,.05,.2),C.hi);
  s+=tag('導いた 結果',600,300,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'gen2']:(p)=>{
  let s=card(150,60,900,180,label('うなりの 回数（1秒あたり）',600,120,{size:30,color:C.ink,anchor:'middle'})+T2(`=|{\\color{${FC}}f_1}-{\\color{${FC}}f_2}|`,600,195,{size:56,auto:false}),1,C.hi);
  s+=fade(seg(p,.1,.25),label('| |：絶対値（大きい 方 − 小さい 方）',600,320,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('例：|440 − 442| ＝ 2',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'gen3']:(p)=>tune(150,2,'差 2 Hz',{g:seg(p,.05,.2)})+tune(330,1,'差 1 Hz',{g:seg(p,.3,.45)})+fade(seg(p,.6,.75),label('差が 小さい ほど ゆっくり',600,470,{size:30,color:C.hi,anchor:'middle',weight:700})),
 // ================= S4 聞こえる高さ =================
 [K+'pit1']:(p)=>{
  let s=beatPanels({g1:0,g2:0,gs:1});
  s+=card(250,40,700,110,label('どんな 高さの 音？',600,112,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'pit2']:(p)=>{
  let s=beatPanels({g1:0,g2:0,gs:1});
  s+=card(250,40,700,150,label('細かい 揺れ：1秒に 約 441回',600,105,{size:34,color:ROPE,anchor:'middle',weight:700})+label('（440 と 442 の 真ん中）',600,160,{size:26,color:C.dim,anchor:'middle'}),seg(p,.2,.35),ROPE);
  return s;
 },
 [K+'pit3']:(p)=>{
  let s=beatPanels({g1:0,g2:0,gs:1,env:seg(p,.3,.5)});
  s+=card(250,40,700,150,label('高さ：約 441 Hz の まま',600,105,{size:34,color:ROPE,anchor:'middle',weight:700})+label('変わるのは 強さ',600,160,{size:30,color:C.hi,anchor:'middle',weight:700}),1,ROPE);
  return s;
 },
 [K+'pit4']:(p)=>{
  let s=beatPanels({g1:0,g2:0,gs:1,env:1,marks:seg(p,.1,.3)});
  s+=card(250,40,700,110,label('外側の 線：1秒に 2回 ふくらむ',600,110,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'pit5']:(p)=>beatPanels({g1:0,g2:0,gs:1,env:1,marks:1})+card(250,40,700,110,label('0 s・0.5 s・1.0 s ＝ 強め合い',600,110,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 [K+'mis1']:(p)=>card(160,60,880,140,label('✕ うなり ＝ 2 Hz の 低い 音',600,148,{size:38,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a),
 [K+'mis1b']:(p)=>hear({g:seg(p,.05,.2),m2:seg(p,.45,.6),m441:seg(p,.7,.85)}),
 [K+'mis2']:(p)=>{
  let s=card(160,60,880,120,label('✕ うなりの 回数 ＝ 振動数の 和',600,135,{size:36,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(160,240,880,120,label('数えるのは ずれ ＝ 振動数の 差',600,315,{size:36,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.F);
  return s;
 },
 // ================= S5 チューニング =================
 [K+'tun1']:(p)=>{
  let s=tune(150,2,'基準と 楽器',{g:seg(p,.1,.25)});
  s+=fade(seg(p,.4,.55),label('うなりを 聞いて 合わせる',600,320,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tun2']:(p)=>tune(110,2,'差 2 Hz')+tune(270,1,'差 1 Hz',{g:seg(p,.4,.55)})+tune(430,.5,'差 0.5 Hz',{g:seg(p,.6,.75)}),
 [K+'tun3']:(p)=>fade(.35,tune(110,2,'差 2 Hz')+tune(270,1,'差 1 Hz'))+tune(430,0,'差 0',{g:seg(p,.05,.2)})+fade(seg(p,.4,.55),label('うなり なし ＝ そろった',1090,380,{size:28,color:C.F,anchor:'end',weight:700})),
 // ================= S6 元の問いと次の問い =================
 [K+'ans1']:(p)=>{
  let s=fade(.4,beatPanels({g1:1,g2:1,gs:1,marks:1,env:1,axis:1}));
  s+=card(240,150,720,130,label('1秒に 振動数の 差の 回数 ずれる',600,228,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=fade(.4,beatPanels({g1:1,g2:1,gs:1,marks:1,env:1,axis:1}));
  s+=card(240,120,720,200,label('うなりの 回数（1秒あたり）',600,170,{size:28,color:C.ink,anchor:'middle'})+T2(`|{\\color{${FC}}f_1}-{\\color{${FC}}f_2}|`,600,235,{size:52,auto:false})+label('440 Hz と 442 Hz → 2回',600,295,{size:28,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  return s;
 },
 [K+'n1']:(p)=>reflect(p),
 [K+'n2']:(p)=>reflect(1)+card(200,395,800,100,label('重なると、何が 起こる？',600,458,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi),
 [K+'bye']:(p)=>fade(.5,reflect(1))+card(200,395,800,100,label('次回：深く学ぶ 3/3',600,458,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim),
};
