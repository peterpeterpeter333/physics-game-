// YouTube シリーズ「空気抵抗・初級 1/2」(ys-ui-drag-1) — 図。Stage 1200×515.
// 色（anim.mjs C）：力 F 緑（重力・抵抗とも）、速度 v 紫、加速度 a 赤、時刻 t 金、強調 黄。
// 下向きを正。m＝1 kg、g＝10 m/s² → 重力 10 N。抵抗 R＝kv（モデル）。力の矢印 1 N ＝ NPX px。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,cart,ground} from './anim.mjs';

const K='ui-drag-1:';
const CF=C.F,CV=C.v,CA=C.a,CT=C.t,CH=C.hi;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const swap=(p,a,b,t=.12)=>fade(1-seg(p,0,t),a)+fade(seg(p,t*.6,t+.1),b);

// ---- the falling ball with its arrows -------------------------------------------------------------
const NPX=11;
function ball(x,y,{r=30,g=1}={}){return fade(g,ring(x,y,r,{color:C.dim,w:3,fill:'#2b3d63'})+dot(x-9,y-9,7,'#5a73a6'));}
function gravA(x,y,N,{r=30,g=1,text='重力 mg',px=NPX,tx=16}={}){
 const L=N*px;if(L<2)return '';
 return arrow(x,y+r,x,y+r+L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y+r+L-4,{size:24,color:CF})):'');
}
function resA(x,y,N,{r=30,g=1,text='抵抗 R',px=NPX,tx=16}={}){
 const L=N*px;if(L<2)return text?fade(g,label(text,x+tx,y-r-6,{size:24,color:CF})):'';
 return arrow(x,y-r,x,y-r-L,{color:CF,w:6,g})+(text?fade(g,label(text,x+tx,y-r-L+18,{size:24,color:CF})):'');
}
function velA(x,y,v,{g=1,px=30,text='速度',dx=-70}={}){
 const L=v*px;if(L<2)return text?fade(g,label(text+' 0',x+dx,y+8,{size:24,color:CV,anchor:'middle'})):'';
 return arrow(x+dx,y-L/2,x+dx,y+L/2,{color:CV,w:7,g})+(text?fade(g,label(text,x+dx-14,y-L/2-10,{size:24,color:CV,anchor:'middle'})):'');
}
function posAxis(x,y,g=1){return fade(g,label('下向きが正',x,y-12,{size:22,color:C.dim,anchor:'middle'})+arrow(x,y,x,y+80,{color:C.dim,w:3,head:14})+label('＋',x+14,y+60,{size:26,color:C.dim}));}
function trail(x,y,g=1){let s='';for(let i=1;i<=3;i++)s+=ring(x,y-i*44,30-i*4,{color:C.faint,w:2,dash:'5 6'});return fade(g,s);}

function cloud(x,y){return [[0,0,40],[40,-18,46],[88,0,38],[40,14,40]].map(([dx,dy,r])=>ring(x+dx,y+dy,r,{color:'#6f7f9c',w:0,fill:'#4b5a78'})).join('');}
function drop(x,y,s=1){return `<path d="M${x} ${y-22*s} C ${x+14*s} ${y-4*s}, ${x+14*s} ${y+10*s}, ${x} ${y+12*s} C ${x-14*s} ${y+10*s}, ${x-14*s} ${y-4*s}, ${x} ${y-22*s} Z" fill="${C.x}" fill-opacity=".8"/>`;}

// ---- S4 table: 合力 → 加速度 → 速度の変化 ----------------------------------------------------------
const TX=[395,565,760,1010],TH=78;
const ROWS=[['0','10','10','1'],['4','6','6','0.6'],['10','0','0','0']],RY=[185,260,335];
function tHead(g=1){
 return fade(g,label('抵抗 R',TX[0],TH,{size:26,color:CF,anchor:'middle',weight:700})+label('合力',TX[1],TH,{size:26,color:CF,anchor:'middle',weight:700})
  +label('加速度 a',TX[2],TH,{size:26,color:CA,anchor:'middle',weight:700})+label('0.1 秒の速度変化',TX[3],TH,{size:26,color:CV,anchor:'middle',weight:700})
  +label('[N]',TX[0],TH+32,{size:22,color:C.dim,anchor:'middle'})+label('[N]',TX[1],TH+32,{size:22,color:C.dim,anchor:'middle'})
  +label('[m/s²]',TX[2],TH+32,{size:22,color:C.dim,anchor:'middle'})+label('[m/s]',TX[3],TH+32,{size:22,color:C.dim,anchor:'middle'})
  +label('→',(TX[1]+TX[2])/2+10,TH,{size:28,color:C.dim,anchor:'middle'})+label('→',(TX[2]+TX[3])/2-40,TH,{size:28,color:C.dim,anchor:'middle'})
  +line(310,TH+48,1180,TH+48,{color:C.faint,w:2}));
}
function tRow(i,gs=[1,1,1,1]){
 const [R,F,a,dv]=ROWS[i],y=RY[i];
 let s=fade(gs[0],label(R,TX[0],y,{size:30,color:CF,anchor:'middle',weight:700}));
 s+=fade(gs[1],label(i===0?'10':`10 − ${R} ＝ ${F}`,TX[1],y,{size:28,color:CF,anchor:'middle',weight:700}));
 s+=fade(gs[2],label(a,TX[2],y,{size:30,color:CA,anchor:'middle',weight:700}));
 s+=fade(1-gs[3],label('？',TX[3],y,{size:30,color:CH,anchor:'middle',weight:700}))+fade(gs[3],label(dv==='0'?'0':'≈ '+dv,TX[3],y,{size:30,color:CV,anchor:'middle',weight:700}));
 return s;
}
const tNotes=(g1=1,g2=1)=>fade(g1,label('a ＝ 合力 ÷ 1 kg',TX[2],420,{size:24,color:CA,anchor:'middle'}))+fade(g2,label('Δv ≈ a × 0.1 s',TX[3],420,{size:24,color:CV,anchor:'middle'}));
function tBall(R,v,g=1){return fade(g,ball(150,250,{r:24})+gravA(150,250,10,{r:24,px:9,text:'10 N',tx:12})+resA(150,250,R,{r:24,px:9,text:R?`${R} N`:'0 N',tx:12})+velA(150,250,v,{px:26,text:'v',dx:-62}));}

// ---- summary cards -------------------------------------------------------------------------------
function sumCards(g1,g2,g3,hi=-1){
 const rows=[['合力 ＝ mg − R（下向きが正）','抵抗 R ＝ kv は モデル（仮定）'],['合力が決めるのは 加速度','つり合い → a ＝ 0 → 同じ速度で 落ち続ける'],['つり合い ≠ 静止','「速度が変わらない」という意味']];
 return [g1,g2,g3].map((g,i)=>card(170,40+i*150,860,130,label(rows[i][0],600,95+i*150,{size:32,color:i===2?CH:C.ink,anchor:'middle',weight:700})+label(rows[i][1],600,140+i*150,{size:26,color:C.dim,anchor:'middle'}),g,i===hi?CH:C.faint)).join('');
}

export const ytUiDrag1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const A=axes({x:110,y:440,w:470,h:320,xmax:3.2,ymax:5,xticks:[1,2,3],yticks:[1,2,3,4],grid:true,g:seg(p,0,.12),xlabel:'t [s]',ylabel:'速度 v [m/s]',xcolor:CT,ycolor:CV});
  let s=A.svg;const pts=[0,.5,1,1.5,2].map(t=>[A.X(t),A.Y(2*t)]);
  s+=draw(pts,seg(p,.05,.4),{color:CV,w:4});
  pts.forEach((q,i)=>{s+=fade(seg(p,.05+i*.07,.1+i*.07),dot(q[0],q[1],7,CV));});
  s+=fade(seg(p,.12,.35),label('0.5 秒ごとに ＋1 m/s',700,170,{size:30,color:CV}));
  s+=draw([[A.X(2),A.Y(4)],[A.X(3.1),A.Y(4)]],seg(p,.55,.8),{color:CV,w:4,dash:'10 8'});
  s+=fade(seg(p,.5,.7),label('力を 0 にすると',700,270,{size:30,color:CF})+label('a ＝ 0、速度はそのまま',700,325,{size:30,color:CV,weight:700}));
  return s;
 },
 [K+'recap2']:(p)=>{
  const v=4*smooth(clamp(p/.85));
  let s=ball(270,250)+gravA(270,250,10,{text:'重力'})+resA(270,250,2*v,{text:'抵抗'})+velA(270,250,v,{text:'速度'});
  s+=card(520,110,650,270,label('前回の最後の問い',845,160,{size:26,color:C.dim,anchor:'middle'})
   +label('落ちる物体には、空気の抵抗も働く',845,220,{size:30,anchor:'middle'})
   +label('抵抗が 速さとともに増えると',845,275,{size:30,anchor:'middle'})
   +label('速度は どこまで増える？',845,338,{size:34,color:CH,anchor:'middle',weight:700}),seg(p,0,.2),CH);
  return s;
 },
 [K+'rain']:(p)=>{
  let s=cloud(150,95)+ground(60,380,470);
  s+=line(80,110,80,465,{color:C.dim,w:2,dash:'6 6'})+label('約 2000 m',96,300,{size:24,color:C.x});
  s+=drop(210,mix(150,440,smooth(clamp(p/.75))),1.1);
  s+=card(460,70,710,250,label('抵抗が なければ',815,120,{size:28,color:C.dim,anchor:'middle'})
   +tex('v=\\sqrt{2gh}\\approx 198\\,\\mathrm{m/s}',815,195,{size:44})
   +label('（約 700 km/h）',815,270,{size:28,color:CA,anchor:'middle'}),seg(p,.3,.5));
  return s;
 },
 [K+'rain2']:(p)=>{
  let s=cloud(150,95)+ground(60,380,470)+line(80,110,80,465,{color:C.dim,w:2,dash:'6 6'})+label('約 2000 m',96,300,{size:24,color:C.x})+drop(210,440,1.1);
  s+=card(460,70,710,250,label('抵抗が なければ',815,120,{size:28,color:C.dim,anchor:'middle'})+tex('v=\\sqrt{2gh}\\approx 198\\,\\mathrm{m/s}',815,195,{size:44})+label('（約 700 km/h）',815,270,{size:28,color:CA,anchor:'middle'}));
  const g=seg(p,.05,.3);
  s+=card(460,340,710,160,label('実際の雨粒',520,390,{size:28,color:C.x})
   +rect(520,410,520*seg(p,.1,.35),22,{fill:CA,fo:.6,rx:5})+fade(seg(p,.3,.4),label('198 m/s',1050,430,{size:22,color:CA}))
   +rect(520,450,520*9/198*seg(p,.3,.45),22,{fill:CV,fo:.9,rx:5})+fade(seg(p,.35,.5),label('10 m/s に届かない',560,470,{size:26,color:CV,weight:700})),g,CV);
  return s;
 },
 [K+'ask']:(p)=>{
  let s=ball(300,255)+gravA(300,255,10,{text:'重力 10 N',g:seg(p,.05,.25)})+resA(300,255,10,{text:'抵抗 10 N',g:seg(p,.15,.35)});
  s+=fade(seg(p,.35,.5),label('速度',230,250,{size:26,color:CV,anchor:'middle'})+label('？',230,300,{size:44,color:CH,anchor:'middle',weight:700}));
  s+=card(560,140,580,220,label('重力と抵抗が つり合ったら',850,215,{size:32,anchor:'middle'})+label('物体は 止まる？',850,295,{size:40,color:CH,anchor:'middle',weight:700}),seg(p,.3,.5),CH);
  return s;
 },

 // ===== S2 落ちる物体の力 =====
 [K+'choose']:(p)=>{
  let s=posAxis(110,170,seg(p,.5,.7))+trail(330,215,seg(p,.1,.3))+ball(330,215,{g:seg(p,0,.2)});
  s+=fade(seg(p,.15,.35),label('調べる物体：落ちていく 小さな球',590,200,{size:30}));
  s+=fade(seg(p,.55,.75),label('向き：下向きを ＋ とする',590,270,{size:30,color:C.dim}));
  return s;
 },
 [K+'grav']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10,{g:seg(p,.05,.3)});
  s+=fade(seg(p,.3,.5),label('重力：大きさ mg、下向き',590,150,{size:30,color:CF,weight:700}));
  s+=fade(seg(p,.5,.65),label('m：質量 [kg]',610,210,{size:28}));
  s+=fade(seg(p,.7,.85),label('g：重力加速度',610,260,{size:28}));
  return s;
 },
 [K+'g98']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10);
  s+=label('重力：大きさ mg、下向き',590,150,{size:30,color:CF,weight:700})+label('m：質量 [kg]',610,210,{size:28})+label('g：重力加速度',610,260,{size:28});
  s+=card(580,300,590,190,tex('g\\approx 9.8\\,\\mathrm{m/s^2}',875,355,{size:42})
   +fade(seg(p,.4,.6),label('抵抗がなければ、速度が',875,415,{size:26,color:C.dim,anchor:'middle'})+label('毎秒 約 9.8 m/s ずつ 増える',875,458,{size:28,color:CV,anchor:'middle'})),seg(p,.05,.25));
  return s;
 },
 [K+'g10']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10,{text:''});
  s+=swap(p,label('重力 mg',346,365,{size:24,color:CF}),label('重力 10 N',346,365,{size:24,color:CF,weight:700}),.5);
  s+=label('重力：大きさ mg、下向き',590,150,{size:30,color:CF,weight:700})+label('m：質量 [kg]',610,210,{size:28})+label('g：重力加速度',610,260,{size:28});
  const old=tex('g\\approx 9.8\\,\\mathrm{m/s^2}',875,355,{size:42})+label('抵抗がなければ、速度が',875,415,{size:26,color:C.dim,anchor:'middle'})+label('毎秒 約 9.8 m/s ずつ 増える',875,458,{size:28,color:CV,anchor:'middle'});
  const nw=label('計算用に g ＝ 10 m/s²、m ＝ 1 kg',875,350,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.4,.6),tex('mg=1\\,\\mathrm{kg}\\times 10\\,\\mathrm{m/s^2}=10\\,\\mathrm{N}',875,430,{size:34}));
  s+=card(580,300,590,190,swap(p,old,nw));
  return s;
 },
 [K+'resist']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10,{text:'重力 10 N'});
  s+=resA(330,215,4,{g:seg(p,.3,.5)})+velA(330,215,3,{g:seg(p,.55,.75),text:'速度',dx:-90});
  const old=label('重力：大きさ mg、下向き',590,150,{size:30,color:CF,weight:700})+label('m：質量 [kg]',610,210,{size:28})+label('g：重力加速度',610,260,{size:28})
   +card(580,300,590,190,label('計算用に g ＝ 10 m/s²、m ＝ 1 kg',875,350,{size:28,color:C.dim,anchor:'middle'})+tex('mg=1\\,\\mathrm{kg}\\times 10\\,\\mathrm{m/s^2}=10\\,\\mathrm{N}',875,430,{size:34}));
  const nw=label('空気の抵抗：運動と 逆向き',590,160,{size:30,color:CF,weight:700})
   +fade(seg(p,.55,.75),label('球は 下へ落ちている（紫）',610,230,{size:28,color:CV}))
   +fade(seg(p,.7,.9),label('→ 抵抗は 上向き',610,285,{size:30,color:CF,weight:700}));
  s+=swap(p,old,nw);
  return s;
 },
 [K+'signs']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10,{text:'重力 10 N'})+resA(330,215,4,{text:'抵抗 R'})+velA(330,215,3,{text:'速度',dx:-90});
  s+=label('空気の抵抗：運動と 逆向き',590,160,{size:30,color:CF,weight:700});
  s+=fade(seg(p,.1,.3),label('抵抗の大きさ ＝ R',610,230,{size:30,color:CF}));
  s+=card(580,280,590,200,label('下向きが ＋ なので',875,330,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),label('重力',700,400,{size:28,color:CF})+tex('+mg',820,398,{size:40,color:CF}))
   +fade(seg(p,.7,.85),label('抵抗',700,460,{size:28,color:CF})+tex('-R',820,458,{size:40,color:CF})),seg(p,.4,.55));
  return s;
 },
 [K+'tip']:(p)=>{
  let s=posAxis(110,170)+trail(330,215)+ball(330,215)+gravA(330,215,10,{text:'重力 10 N'})+resA(330,215,4,{text:'抵抗 R'})+velA(330,215,3,{text:'速度',dx:-90});
  // tip-to-tail on a vertical line (20 px per N)
  const X0=700,Y0=90,P=24,y1=Y0+10*P,y2=y1-4*P;
  s+=arrow(X0,Y0,X0,y1,{color:CF,w:6,g:seg(p,.05,.3)})+fade(seg(p,.1,.3),label('mg（下へ）',X0-16,(Y0+y1)/2,{size:26,color:CF,anchor:'end'}));
  s+=arrow(X0+40,y1,X0+40,y2,{color:CF,w:6,g:seg(p,.35,.55)})+fade(seg(p,.4,.55),label('R（上へ戻る）',X0+56,y1-10,{size:26,color:CF}));
  s+=fade(seg(p,.6,.75),line(X0+90,Y0,X0+90,y2,{color:CH,w:6})+line(X0+80,Y0,X0+100,Y0,{color:CH,w:4})+line(X0+80,y2,X0+100,y2,{color:CH,w:4})+line(X0,y2,X0+100,y2,{color:CH,w:2,dash:'5 5'}));
  s+=fade(seg(p,.65,.85),label('合力',X0+110,(Y0+y2)/2-10,{size:28,color:CH,weight:700})+tex('mg-R',X0+200,(Y0+y2)/2+34,{size:38,color:CH}));
  return s;
 },

 // ===== S3 抵抗のモデル =====
 [K+'what']:(p)=>{
  const v=1+2*smooth(clamp((p-.1)/.6));
  let s=ball(330,250)+gravA(330,250,10,{text:'重力 10 N'})+resA(330,250,2*v,{text:'抵抗 R'})+velA(330,250,v,{text:'速度',dx:-90});
  s+=fade(seg(p,.05,.25),label('R は 何で決まる？',600,160,{size:34,color:CH,weight:700}));
  s+=fade(seg(p,.4,.6),label('速く動くほど 空気を強く押しのける',600,250,{size:28}));
  s+=fade(seg(p,.6,.8),label('速さ ↑ → 抵抗 ↑',600,320,{size:32,color:CF,weight:700}));
  return s;
 },
 ...(()=>{
  const G=(g=1)=>axes({x:110,y:440,w:380,h:330,xmax:4.4,ymax:17,xticks:[1,2,3,4],yticks:[2,4,6,8,10,12,14,16],grid:true,g,xlabel:'v [m/s]',ylabel:'抵抗 R [N]',xcolor:CV,ycolor:CF});
  const base=(A,gl=1)=>A.plot(v=>2*v,{from:0,to:4.2,p:gl,color:CF,w:5});
  const right=(inner)=>inner;
  return {
   [K+'model']:(p)=>{
    const A=G(seg(p,0,.15));let s=A.svg+base(A,seg(p,.4,.7));
    s+=fade(seg(p,.1,.3),label('仮定（モデル）',870,130,{size:28,color:CH,anchor:'middle',weight:700}));
    s+=fade(seg(p,.25,.45),label('抵抗は 速さに比例する',870,190,{size:30,anchor:'middle'}));
    s+=fade(seg(p,.55,.75),tex('R=kv',870,290,{size:66,color:CF}));
    s+=fade(seg(p,.7,.9),label('k：比例の係数（正の数）',870,370,{size:26,color:C.dim,anchor:'middle'}));
    return s;
   },
   [K+'double']:(p)=>{
    const A=G();let s=A.svg+base(A);
    const g1=seg(p,.05,.25),g2=seg(p,.25,.45);
    s+=fade(g1,line(A.X(1),A.Y(0),A.X(1),A.Y(2),{color:CV,w:2,dash:'5 5'})+line(A.X(0),A.Y(2),A.X(1),A.Y(2),{color:CF,w:2,dash:'5 5'})+dot(A.X(1),A.Y(2),8,CH));
    s+=fade(g2,line(A.X(2),A.Y(0),A.X(2),A.Y(4),{color:CV,w:2,dash:'5 5'})+line(A.X(0),A.Y(4),A.X(2),A.Y(4),{color:CF,w:2,dash:'5 5'})+dot(A.X(2),A.Y(4),8,CH));
    s+=fade(seg(p,.2,.4),label('速さ 2倍 → 抵抗 2倍',870,160,{size:30,color:CH,anchor:'middle',weight:700}));
    s+=A.plot(v=>4*v,{from:0,to:4.2,p:seg(p,.55,.8),color:CF,w:3,dash:'10 8'});
    s+=fade(seg(p,.7,.85),label('k 大',A.X(3.4)-20,A.Y(15),{size:24,color:CF,anchor:'end'})+label('k 小',A.X(4.2)+10,A.Y(8.4)+8,{size:24,color:CF}));
    s+=fade(seg(p,.6,.8),label('k が大きいほど',870,260,{size:30,anchor:'middle'})+label('同じ速さでも 抵抗が強い',870,310,{size:30,anchor:'middle'}));
    return s;
   },
   [K+'unit']:(p)=>{
    const A=G();let s=A.svg+base(A);
    s+=card(620,80,550,380,tex('k=\\dfrac{R}{v}',895,165,{size:52})
     +fade(seg(p,.2,.4),tex('\\dfrac{\\mathrm{N}}{\\mathrm{m/s}}=\\mathrm{N\\cdot s/m}',895,275,{size:44}))
     +fade(seg(p,.55,.75),label('1 m/s あたり 何 N の抵抗か',895,365,{size:28,color:CH,anchor:'middle',weight:700}))
     +fade(seg(p,.75,.9),label('（kg/s と同じ）',895,420,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
    return s;
   },
   [K+'ex']:(p)=>{
    const A=G();let s=A.svg+base(A);
    const g1=seg(p,.25,.45),g2=seg(p,.55,.75);
    s+=fade(g1,line(A.X(1),A.Y(0),A.X(1),A.Y(2),{color:CV,w:2,dash:'5 5'})+line(A.X(0),A.Y(2),A.X(1),A.Y(2),{color:CF,w:2,dash:'5 5'})+dot(A.X(1),A.Y(2),8,CH));
    s+=fade(g2,line(A.X(3),A.Y(0),A.X(3),A.Y(6),{color:CV,w:2,dash:'5 5'})+line(A.X(0),A.Y(6),A.X(3),A.Y(6),{color:CF,w:2,dash:'5 5'})+dot(A.X(3),A.Y(6),8,CH));
    s+=card(620,80,550,380,tex('k=2\\,\\mathrm{N\\cdot s/m}',895,150,{size:44})
     +fade(g1,label('1 m/s',720,260,{size:30,color:CV})+label('→',830,260,{size:30,color:C.dim})+label('2 N',1060,260,{size:32,color:CF,anchor:'end',weight:700}))
     +fade(g2,label('3 m/s',720,340,{size:30,color:CV})+label('→',830,340,{size:30,color:C.dim})+label('6 N',1060,340,{size:32,color:CF,anchor:'end',weight:700})),seg(p,0,.15));
    return s;
   },
  };
 })(),
 [K+'assume']:(p)=>{
  const A=axes({x:110,y:440,w:380,h:320,xmax:3.3,ymax:10,xticks:[1,2,3],yticks:[],g:seg(p,0,.15),xlabel:'v',ylabel:'抵抗',xcolor:CV,ycolor:CF});
  let s=A.svg+A.plot(v=>2*v,{from:0,to:3.2,p:seg(p,.1,.35),color:CF,w:5})+A.plot(v=>v*v,{from:0,to:3.15,p:seg(p,.6,.85),color:C.E,w:4,dash:'10 8'});
  s+=fade(seg(p,.2,.35),label('∝ v',A.X(3.2)+10,A.Y(6.4)+8,{size:26,color:CF}))+fade(seg(p,.75,.9),label('∝ v²',A.X(3.1)-10,A.Y(9.6)+4,{size:26,color:C.E,anchor:'end'}));
  s+=card(580,60,590,120,label('R ＝ kv は 法則ではなく',875,110,{size:30,anchor:'middle'})+label('計算のための モデル（仮定）',875,155,{size:30,color:CH,anchor:'middle',weight:700}),seg(p,.05,.2),CH);
  s+=card(580,205,590,120,label('よく合う',610,250,{size:26,color:CF,weight:700})+label('ごく小さな粒が ゆっくり落ちる',610,295,{size:28}),seg(p,.4,.55));
  s+=card(580,345,590,120,label('速い物体',610,390,{size:26,color:C.E,weight:700})+label('抵抗は 速さの2乗に 近い',610,435,{size:28}),seg(p,.62,.78));
  return s;
 },
 [K+'brake']:(p)=>{
  let s=card(60,110,480,250,label('微分方程式の回',300,160,{size:26,color:C.dim,anchor:'middle'})+tex('\\dfrac{dv}{dt}=-kv',300,245,{size:50})+label('ブレーキ ∝ 速さ',300,320,{size:28,color:CF,anchor:'middle'}),seg(p,0,.15));
  s+=arrow(560,235,650,235,{color:C.dim,w:4,g:seg(p,.2,.35)})+fade(seg(p,.2,.35),label('同じ考え方',605,205,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(670,110,470,250,label('今回',905,160,{size:26,color:C.dim,anchor:'middle'})+tex('R=kv',905,245,{size:54,color:CF})+label('抵抗 ∝ 速さ',905,320,{size:28,color:CF,anchor:'middle'}),seg(p,.3,.45));
  s+=fade(seg(p,.6,.8),label('モデルを1つ決める → あとは 同じ手順で計算',600,430,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'netkv']:(p)=>{
  const v=4*smooth(clamp((p-.25)/.6));
  let s=posAxis(90,150)+ball(300,250)+gravA(300,250,10,{text:'重力 mg ＝ 10 N'})+resA(300,250,2*v,{text:'抵抗 kv'})+velA(300,250,v,{text:'速度',dx:-90});
  s+=card(620,90,550,140,label('合力',700,175,{size:32,color:CF,weight:700})+tex('=mg-kv',930,172,{size:50,color:CF}),seg(p,0,.2));
  s+=fade(seg(p,.2,.4),label('重力 mg：一定',650,300,{size:30,color:CF}));
  s+=fade(seg(p,.4,.6),label('抵抗 kv：速さとともに 増える',650,360,{size:30,color:CF,weight:700}));
  s+=fade(seg(p,.3,.5),label(`速度 ${(v).toFixed(1)} m/s → 抵抗 ${(2*v).toFixed(1)} N`,650,440,{size:26,color:C.dim}));
  return s;
 },

 // ===== S4 合力から速度の変化へ =====
 [K+'table']:(p)=>{
  let s=tBall(0,0,seg(p,0,.2))+tHead(seg(p,.05,.3));
  s+=highlight(TX[1]-80,TH-36,160,50,seg(p,.4,.5)*(1-seg(p,.55,.6)));
  s+=highlight(TX[2]-90,TH-36,180,50,seg(p,.55,.62)*(1-seg(p,.7,.75)));
  s+=highlight(TX[3]-150,TH-36,300,50,seg(p,.72,.8));
  return s;
 },
 [K+'row0']:(p)=>tBall(0,0)+tHead()+tRow(0,[seg(p,.05,.2),seg(p,.4,.55),seg(p,.7,.85),0])+tNotes(seg(p,.7,.85),0),
 [K+'row0b']:(p)=>tBall(0,seg(p,.2,.8))+tHead()+tRow(0,[1,1,1,seg(p,.4,.6)])+tNotes(1,seg(p,.15,.3))+highlight(TX[3]-110,RY[0]-38,220,52,seg(p,.5,.65)),
 [K+'row4']:(p)=>tBall(4,2)+tHead()+tRow(0)+tRow(1,[seg(p,.05,.2),seg(p,.25,.4),seg(p,.5,.65),seg(p,.75,.9)])+tNotes(),
 [K+'row4b']:(p)=>{
  let s=tBall(4,2)+tHead()+tRow(0)+tRow(1)+tNotes();
  s+=highlight(TX[3]-110,RY[0]-38,220,127,seg(p,.1,.3));
  s+=fade(seg(p,.25,.45),label('増え方が 小さくなる',TX[3],RY[2]+5,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('抵抗 ↑ → 合力 ↓',TX[1],RY[2]+5,{size:26,color:CF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'row10']:(p)=>{
  const g=seg(p,.05,.3);
  let s=tBall(4+6*g,2+seg(p,.05,.3))+tHead()+tRow(0)+tRow(1)+tRow(2,[seg(p,.05,.2),seg(p,.3,.45),seg(p,.55,.7),seg(p,.7,.85)])+tNotes();
  s+=highlight(320,RY[2]-40,860,56,seg(p,.8,.95));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=ball(260,250)+gravA(260,250,10,{text:'重力 10 N'})+resA(260,250,10,{text:'抵抗 10 N'})+velA(260,250,3,{text:'速度',dx:-90});
  s+=fade(seg(p,.05,.2),label('合力 0、a ＝ 0',540,120,{size:30,color:CF,weight:700})+label('球は すでに 下へ落ちている',540,170,{size:28,color:CV}));
  s+=card(540,220,600,100,label('① 止まる？',580,282,{size:32}),seg(p,.3,.45));
  s+=card(540,345,600,100,label('② 同じ速度で 落ち続ける？',580,407,{size:32}),seg(p,.5,.65));
  return s;
 },
 [K+'answer']:(p)=>{
  let s=ball(260,250)+gravA(260,250,10,{text:'重力 10 N'})+resA(260,250,10,{text:'抵抗 10 N'})+velA(260,250,3,{text:'速度',dx:-90});
  s+=label('合力 0、a ＝ 0',540,120,{size:30,color:CF,weight:700})+label('球は すでに 下へ落ちている',540,170,{size:28,color:CV});
  s+=fade(1-.6*seg(p,.2,.4),card(540,220,600,100,label('① 止まる？',580,282,{size:32})))+fade(seg(p,.2,.4),label('✗',1100,284,{size:40,color:CA,anchor:'middle',weight:700}));
  s+=card(540,345,600,100,label('② 同じ速度で 落ち続ける？',580,407,{size:32}),1,seg(p,.6,.7)>.5?CH:C.faint)+fade(seg(p,.6,.8),label('○',1100,410,{size:40,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.05,.25),label('a ＝ 0 ⇔ 速度が 変わらない',840,490,{size:28,color:CH,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S5 つり合いは静止ではない =====
 ...(()=>{
  const strobe=(g=1,n=5)=>{let s='';for(let i=0;i<n;i++)s+=ring(110,90+i*85,16,{color:CV,w:2,fill:'#2b3d63'});
   return fade(g,s+label('0.1 秒ごと',110,62,{size:22,color:C.dim,anchor:'middle'})+line(140,90,140,90+85,{color:CH,w:3})+line(140,175,140,260,{color:CH,w:3,dash:'4 4'}));};
  const big=(g=1)=>fade(g,ball(420,255,{r:34})+gravA(420,255,10,{r:34,text:'重力 10 N'})+resA(420,255,10,{r:34,text:'抵抗 10 N'})+velA(420,255,3.4,{text:'速度',dx:-100}));
  return {
   [K+'arrows']:(p)=>{
    let s=strobe(seg(p,.6,.8))+big(seg(p,0,.2));
    s+=fade(seg(p,.1,.3),label('緑：力',700,140,{size:30,color:CF,weight:700})+label('下 10 N と 上 10 N → 打ち消し合う',700,190,{size:28,color:CF}));
    s+=fade(seg(p,.5,.7),label('紫：速度',700,290,{size:30,color:CV,weight:700})+label('下向きのまま 残る',700,340,{size:28,color:CV}));
    s+=fade(seg(p,.7,.9),label('等間隔 → 速さ一定',700,430,{size:26,color:CH}));
    return s;
   },
   [K+'arrows2']:(p)=>{
    let s=strobe()+big();
    s+=label('緑：力',700,140,{size:30,color:CF,weight:700})+label('下 10 N と 上 10 N → 打ち消し合う',700,190,{size:28,color:CF});
    s+=label('紫：速度',700,290,{size:30,color:CV,weight:700})+label('下向きのまま 残る',700,340,{size:28,color:CV});
    s+=card(680,390,490,110,label('2つの力は 働いたまま',925,430,{size:28,anchor:'middle',weight:700})+tex('10+(-10)=0',925,478,{size:34,color:CF}),seg(p,.1,.3),CH);
    return s;
   },
  };
 })(),
 [K+'box']:(p)=>{
  const x=mix(260,760,clamp(p));
  let s=ground(80,1150,400)+cart(x,400,{w:140,h:70,color:C.x})+arrow(x+80,300,x+200,300,{color:CV,w:7})+label('速度',x+140,285,{size:24,color:CV,anchor:'middle'});
  s+=card(250,70,700,150,label('前回：押す力を 0 にすると',600,125,{size:28,color:C.dim,anchor:'middle'})+label('合力 0 → 速度は そのまま',600,185,{size:34,color:CH,anchor:'middle',weight:700}),seg(p,.05,.25));
  s+=fade(seg(p,.6,.8),label('落ちる球でも 同じ',600,480,{size:28,color:CF,anchor:'middle'}));
  return s;
 },
 ...(()=>{
  const book=(g=1)=>fade(g,rect(110,330,300,18,{fill:'#6b5a44',fo:1,rx:3})+line(140,348,140,470,{color:'#6b5a44',w:8})+line(380,348,380,470,{color:'#6b5a44',w:8})
   +rect(200,290,120,40,{fill:C.x,fo:.35,rx:4})+label('本',260,318,{size:24,anchor:'middle'})
   +arrow(260,330,260,430,{color:CF,w:6})+label('重力',276,420,{size:24,color:CF})
   +arrow(260,290,260,190,{color:CF,w:6})+label('机が押す力',276,205,{size:24,color:CF})
   +label('速度 0',260,140,{size:28,color:CV,anchor:'middle',weight:700}));
  const fall=(g=1)=>fade(g,ball(760,255,{r:28})+gravA(760,255,10,{r:28,px:9,text:'重力'})+resA(760,255,10,{r:28,px:9,text:'抵抗'})+velA(760,255,3,{text:'速度',dx:-80})
   +label('速度 下向き',760,470,{size:28,color:CV,anchor:'middle',weight:700}));
  const heads=(g=1)=>fade(g,label('合力 0',260,80,{size:30,color:CF,anchor:'middle',weight:700})+label('合力 0',760,80,{size:30,color:CF,anchor:'middle',weight:700}));
  return {
   [K+'book']:(p)=>book(seg(p,0,.2))+fall(seg(p,.35,.55))+heads(seg(p,.2,.4))+fade(seg(p,.7,.9),label('同じ 0 でも',1030,250,{size:28,color:CH,anchor:'middle'})+label('速度が違う',1030,295,{size:28,color:CH,anchor:'middle',weight:700})),
   [K+'book2']:(p)=>{
    let s=fade(1-seg(p,.05,.2),book()+fall()+heads());
    s+=card(170,110,860,300,label('合力 0 が 決めるのは',600,170,{size:28,color:C.dim,anchor:'middle'})+label('速度が 変わらない（a ＝ 0）',600,225,{size:34,color:CA,anchor:'middle',weight:700})
     +fade(seg(p,.45,.6),label('どんな速度か は',600,300,{size:28,color:C.dim,anchor:'middle'})+label('それまでの運動で 決まっている',600,355,{size:34,color:CV,anchor:'middle',weight:700})),seg(p,.1,.25),CH);
    return s;
   },
  };
 })(),
 [K+'terminal']:(p)=>{
  let s='';for(let i=0;i<5;i++)s+=fade(seg(p,i*.08,i*.08+.1),ring(160,90+i*85,16,{color:CV,w:2,fill:'#2b3d63'}));
  s+=fade(seg(p,.3,.45),ball(400,255,{r:30})+gravA(400,255,10,{text:'重力'})+resA(400,255,10,{text:'抵抗'}));
  s+=card(620,130,550,250,label('重力と抵抗が つり合い',895,190,{size:28,anchor:'middle'})+label('一定の速さで落ちる ときの速さ',895,240,{size:28,anchor:'middle'})
   +label('＝ 終端速度',895,320,{size:40,color:CH,anchor:'middle',weight:700}),seg(p,.4,.6),CH);
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>sumCards(seg(p,0,.2),0,0,0),
 [K+'sum2']:(p)=>sumCards(1,seg(p,0,.2),0,1),
 [K+'sum3']:(p)=>sumCards(1,1,seg(p,0,.2),2),
 [K+'next']:(p)=>{
  let s=ball(260,130,{g:seg(p,0,.2)})+fade(seg(p,.1,.3),label('速度 0 から 落とす',260,80,{size:26,color:CV,anchor:'middle'}));
  s+=arrow(260,175,260,460,{color:C.faint,w:3,g:seg(p,.2,.5)});
  s+=card(480,140,680,240,label('次の問い',820,190,{size:26,color:C.dim,anchor:'middle'})+label('加速は いつ止まる？',820,260,{size:36,color:CH,anchor:'middle',weight:700})+label('そのときの 速さは？',820,330,{size:36,color:CH,anchor:'middle',weight:700}),seg(p,.3,.5),CH);
  return s;
 },
};
