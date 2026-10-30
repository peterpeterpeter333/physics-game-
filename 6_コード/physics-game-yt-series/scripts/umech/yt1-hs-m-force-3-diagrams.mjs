// 高校編「力と運動方程式・深く学ぶ 3/3」(ys-hs-m-force-3) — 図。Stage 1200×515.
// 作用・反作用（壁・スケート）、本・机・地球を離した図（誰が誰に、ペアに番号）、馬と荷車、内力、摩擦 f＝μN。g＝9.8。
import {C,seg,fade,label,line,rect,dot,ring,arrow,tex,ground,wall,cart} from './anim.mjs';
import {card,FA,VA,box,T2,MG,NN,Fc} from './yt1-hs-m-force-1-diagrams.mjs';
import {desk,elevator} from './yt1-hs-m-force-2-diagrams.mjs';

const K='hs-m-force-3:';
const F2='#5fc39b'; // the partner force of a pair (same law, other body)
const X='<line';
const cross=(x,y,r=22,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:C.a,w:5})+line(x-r,y+r,x+r,y-r,{color:C.a,w:5}));
// ---- a person (simple figure) --------------------------------------------------------------------
function person(x,gy,{o=1,arms=0}={}){
 const c='#e9c7a6';
 return fade(o,dot(x,gy-150,18,c)+rect(x-20,gy-130,40,70,{fill:'#7f8fd8',fo:.9,stroke:'none',rx:10})+line(x-10,gy-60,x-14,gy-2,{color:'#4a5570',w:12})+line(x+10,gy-60,x+14,gy-2,{color:'#4a5570',w:12})+line(x+14,gy-115,x+14+60*arms+10,gy-108,{color:c,w:10}));
}
// ---- horse (simple) and cart -------------------------------------------------------------------
function horse(x,gy,{o=1}={}){
 const c='#b9895a';
 return fade(o,rect(x-80,gy-120,160,60,{fill:c,fo:.95,stroke:'none',rx:26})+rect(x+50,gy-175,34,80,{fill:c,fo:.95,stroke:'none',rx:12})+rect(x+60,gy-185,60,34,{fill:c,fo:.95,stroke:'none',rx:12})
  +[x-60,x-30,x+30,x+60].map(q=>line(q,gy-65,q,gy-2,{color:c,w:10})).join('')+label('馬',x-10,gy-82,{size:26,color:C.ink,anchor:'middle',weight:700}));
}
const HC={hx:850,cx:330,gy:420};
function horseCart({g=1,pull=1,back=1,fric=0,sel='',lab=1,ring2=0}={}){
 const {hx,cx,gy}=HC;
 let s=fade(g,ground(100,1100,gy)+horse(hx,gy)+cart(cx,gy,{w:220,h:80,color:'#c9a46a',text:'荷車',size:28})+line(cx+110,gy-40,hx-80,gy-70,{color:C.dim,w:4}));
 if(sel==='cart')s+=fade(g,`<rect x="${cx-130}" y="${gy-130}" width="260" height="140" rx="22" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`);
 if(sel==='both')s+=fade(g*ring2,`<rect x="${cx-140}" y="${gy-210}" width="${hx-cx+290}" height="225" rx="26" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`);
 s+=FA(cx+115,gy-75,cx+255,gy-75,{g:g*pull});
 if(lab&&pull>.1)s+=fade(g*pull,label('馬が 荷車を 引く',cx+215,gy-110,{size:24,color:C.F,anchor:'middle',weight:700}));
 s+=FA(hx-85,gy-90,hx-225,gy-90,{g:g*back,color:F2});
 if(lab&&back>.1)s+=fade(g*back,label('荷車が 馬を 引く',hx-155,gy+45,{size:24,color:F2,anchor:'middle',weight:700}));
 s+=FA(cx-40,gy-8,cx-150,gy-8,{g:g*fric,w:7,head:18});
 if(lab&&fric>.1)s+=fade(g*fric,label('地面からの 摩擦',cx-100,gy+40,{size:24,color:C.F,anchor:'middle',weight:700}));
 return s;
}
// ---- book / desk / earth, drawn apart ------------------------------------------------------------
// forces: n1 机→本 N (on book), r1 本→机 (on desk), g2 地球→本 mg (on book), r2 本→地球 (on earth)
function apart({g=1,o={n1:1,r1:1,g2:1,r2:1},show={n1:1,r1:1,g2:1,r2:1},lab=1,box2=0,boxP=''}={}){
 let s=fade(g,rect(500,170,160,50,{fill:'#6a8fd8',fo:.8,stroke:'#a9c2f0',rx:4})+label('本',580,204,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g,rect(420,330,320,22,{fill:'#9b7a52',fo:.9,stroke:'none',rx:4})+rect(440,352,16,90,{fill:'#9b7a52',fo:.9,stroke:'none'})+rect(704,352,16,90,{fill:'#9b7a52',fo:.9,stroke:'none'})+label('机',580,410,{size:26,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(g,`<circle cx="1010" cy="720" r="290" fill="#2a6f9e" fill-opacity=".55"/>`+label('地球',1010,500,{size:28,color:C.ink,anchor:'middle',weight:700}));
 const A=(k,x,y,X,Y,col,text,tx,ty,anc)=>show[k]?fade(o[k],FA(x,y,X,Y,{g,color:col,w:8,head:20})+(lab?label(text,tx,ty,{size:24,color:col,anchor:anc,weight:700}):'')):'';
 s+=A('n1',545,170,545,80,C.F,'① 机が 本を 押す（N）',525,100,'end');
 s+=A('g2',615,195,615,300,C.F,'② 地球が 本を 引く（mg）',635,275,'start');
 s+=A('r1',545,332,545,430,F2,'① 本が 机を 押す',525,470,'end');
 s+=A('r2',1010,432,1010,340,F2,'② 本が 地球を 引く',990,370,'end');
 if(boxP==='book')s+=fade(box2,`<rect x="480" y="60" width="160" height="250" rx="20" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`);
 return s;
}
const dimAll={n1:.25,r1:.25,g2:.25,r2:.25};

export const hsForce3Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p)=>{
  let s=desk({mg:0,nn:seg(p,.3,.45),lab:0});
  s+=fade(seg(p,.3,.45),label('机が 本を 押す',280,200,{size:26,color:C.F,anchor:'end',weight:700}));
  s+=FA(380,334,380,450,{g:seg(p,.65,.8),color:F2})+fade(seg(p,.65,.8),label('本が 机を 押す',520,440,{size:26,color:F2,weight:700}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=fade(.35,desk({mg:0,nn:1,lab:0})+FA(380,334,380,450,{color:F2}));
  s+=card(600,110,560,200,label('この 2つの 力は',880,175,{size:30,color:C.ink,anchor:'middle'})+label('つり合いの 2力 と 同じ？',880,250,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'confuse']:(p)=>{
  let s=card(100,80,480,300,label('机 → 本 ／ 本 → 机',340,150,{size:30,color:C.ink,anchor:'middle',weight:700})+FA(270,320,270,210)+FA(410,210,410,320,{color:F2}),seg(p,.05,.2));
  s+=card(620,80,480,300,label('重力 mg ／ 垂直抗力 N',860,150,{size:30,color:C.ink,anchor:'middle',weight:700})+FA(790,320,790,210)+FA(930,210,930,320),seg(p,.2,.35));
  s+=fade(seg(p,.45,.6),label('どちらも 同じ大きさ・逆向き',600,445,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 作用・反作用の法則 =================
 [K+'wall']:(p)=>{
  let s=wall(700,120,440)+ground(200,700,440)+person(520,440,{arms:1});
  s+=FA(600,300,690,300,{g:seg(p,.1,.25)})+fade(seg(p,.1,.25),label('手が 壁を 押す 50 N',760,250,{size:26,color:C.F,weight:700}));
  s+=FA(585,345,480,345,{g:seg(p,.45,.6),color:F2})+fade(seg(p,.45,.6),label('壁が 手を 押す 50 N',300,400,{size:26,color:F2,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('ちょうど 同じ 大きさ',900,380,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>card(120,70,960,260,label('作用・反作用の法則',600,135,{size:36,color:C.hi,anchor:'middle',weight:700})+label('力は 2つの 物体の 間で',600,205,{size:32,color:C.ink,anchor:'middle'})+label('同じ大きさ・逆向きの ペアで 生まれる',600,265,{size:34,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
 [K+'lawk']:(p)=>{
  let s=card(120,70,960,160,label('作用・反作用の法則',600,135,{size:32,color:C.hi,anchor:'middle',weight:700})+label('法則（実験に 支えられた 原理）',600,195,{size:30,color:C.ink,anchor:'middle'}),1,C.hi);
  s+=card(250,280,700,110,label('壁が 動くか どうかに 関係なく 成り立つ',600,348,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'skate']:(p)=>{
  let s=wall(900,120,430)+rect(100,430,800,14,{fill:'#bfe9ff',fo:.35,stroke:'#bfe9ff',sw:1.5,rx:3})+person(720,430,{arms:1.8});
  s+=fade(seg(p,.1,.25),label('質量 50 kg',720,250,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=FA(800,305,890,305,{g:seg(p,.5,.65),text:'50 N',dy:-22});
  return s;
 },
 [K+'skate2']:(p)=>{
  let s=wall(900,120,430)+rect(100,430,800,14,{fill:'#bfe9ff',fo:.35,stroke:'#bfe9ff',sw:1.5,rx:3})+person(720,430,{arms:1.8});
  s+=fade(.25,FA(800,305,890,305));
  s+=fade(seg(p,.05,.2),`<rect x="640" y="240" width="190" height="200" rx="24" fill="none" stroke="${C.hi}" stroke-width="3" stroke-dasharray="10 9"/>`);
  s+=FA(860,345,620,345,{g:seg(p,.35,.55),color:F2})+fade(seg(p,.35,.55),label('壁が 人を 押す 50 N',560,330,{size:28,color:F2,anchor:'end',weight:700}));
  s+=fade(seg(p,.7,.85),label('横向きの 力は これ だけ',300,200,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'skate3']:(p)=>{
  const x=720-260*seg(p,.4,.95)**2;
  let s=wall(900,120,430)+rect(100,430,800,14,{fill:'#bfe9ff',fo:.35,stroke:'#bfe9ff',sw:1.5,rx:3})+person(x,430);
  s+=arrow(x-30,200,x-140,200,{color:C.a,w:5,head:16})+label('a',x-85,185,{size:28,color:C.a,anchor:'middle',weight:700});
  s+=card(760,40,400,140,T2('a=\\dfrac{50}{50}',960,105,{size:44,auto:false})+label('＝ 1.0 m/s²（後ろ向き）',960,165,{size:24,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'skate4']:(p)=>{
  let s=wall(900,120,430)+rect(100,430,800,14,{fill:'#bfe9ff',fo:.35,stroke:'#bfe9ff',sw:1.5,rx:3})+person(460,430);
  s+=arrow(430,200,320,200,{color:C.a,w:5,head:16})+label('a',375,185,{size:28,color:C.a,anchor:'middle',weight:700});
  s+=card(540,50,600,250,label('壁：動かない',840,115,{size:30,color:C.ink,anchor:'middle',weight:700})+label('人：動き出す',840,170,{size:30,color:C.a,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('ペアの 相手の 力が 人に はたらく',840,250,{size:28,color:F2,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 // ================= S3 つり合いと作用・反作用 =================
 [K+'sep']:(p)=>apart({show:{n1:1,r1:1,g2:1,r2:1},o:{n1:seg(p,.2,.35),g2:seg(p,.3,.45),r1:seg(p,.45,.6),r2:seg(p,.55,.7)}}),
 [K+'book']:(p)=>apart({o:{n1:1,g2:1,r1:.2,r2:.2},box2:seg(p,.05,.2),boxP:'book'})+fade(seg(p,.3,.45),label('本が 受ける 力',210,300,{size:28,color:C.hi,anchor:'middle',weight:700})),
 [K+'pair1']:(p)=>apart({o:{n1:1,r1:1,g2:.2,r2:.2}})+card(120,140,250,120,label('作用・反作用',245,190,{size:26,color:C.hi,anchor:'middle',weight:700})+label('ペア ①',245,235,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi),
 [K+'pair2']:(p)=>apart({o:{n1:.2,r1:.2,g2:1,r2:1}})+card(120,140,250,120,label('作用・反作用',245,190,{size:26,color:C.hi,anchor:'middle',weight:700})+label('ペア ②',245,235,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi),
 [K+'balwhich']:(p)=>apart({o:{n1:1,g2:1,r1:.2,r2:.2},box2:seg(p,.3,.45),boxP:'book'})+card(100,140,280,120,label('つり合いの 2力',240,190,{size:26,color:C.hi,anchor:'middle',weight:700})+label('N と mg',240,235,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi),
 [K+'diff']:(p)=>{
  let s=card(80,90,500,260,label('つり合い',330,155,{size:36,color:C.hi,anchor:'middle',weight:700})+label('1つの 物体が 受ける 力',330,225,{size:30,color:C.ink,anchor:'middle'})+label('合力が 0 のとき',330,285,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  s+=card(620,90,500,260,label('作用・反作用',870,155,{size:36,color:C.F,anchor:'middle',weight:700})+label('2つの 物体の 間',870,225,{size:30,color:C.ink,anchor:'middle'})+label('いつでも 同じ大きさ・逆向き',870,285,{size:26,color:C.dim,anchor:'middle'}),seg(p,.45,.6),C.F);
  return s;
 },
 [K+'elev']:(p)=>{
  let s=elevator({acc:1});
  s+=card(640,90,480,250,label('N ＝ 21.6 N',880,160,{size:36,color:C.F,anchor:'middle',weight:700})+label('mg ＝ 19.6 N',880,225,{size:36,color:C.F,anchor:'middle',weight:700})+fade(seg(p,.6,.75),label('つり合わない',880,295,{size:32,color:C.a,anchor:'middle',weight:700})),seg(p,.25,.4));
  return s;
 },
 [K+'elev2']:(p)=>{
  let s=elevator({acc:1});
  s+=FA(300,432,300,500,{g:seg(p,.05,.2),color:F2,w:7,head:16});
  s+=card(640,90,480,250,label('本が 床を 押す 力',880,155,{size:28,color:F2,anchor:'middle',weight:700})+label('21.6 N ＝ N',880,215,{size:36,color:F2,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('加速中も 作用・反作用',880,290,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),F2);
  return s;
 },
 // ================= S4 なぜ打ち消し合わない =================
 [K+'horse']:(p)=>horseCart({pull:seg(p,.05,.2),back:seg(p,.25,.4)})+fade(seg(p,.6,.75),label('なぜ 荷車は 動ける？',600,120,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'mis']:(p)=>{
  let s=fade(.35,horseCart({lab:0}));
  s+=card(170,60,860,140,label('作用と 反作用が 打ち消し合う → 動けない',600,140,{size:32,color:C.dim,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=fade(seg(p,.55,.7),line(220,132,980,132,{color:C.a,w:4})+label('誤解',1060,145,{size:32,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'horse2']:(p)=>{
  let s=horseCart({lab:0});
  s+=fade(seg(p,.05,.2),label('馬が 荷車を 引く → 荷車に はたらく',HC.cx+185,HC.gy-110,{size:24,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('荷車が 馬を 引く → 馬に はたらく',HC.hx-155,HC.gy+45,{size:24,color:F2,anchor:'middle',weight:700}));
  return s;
 },
 [K+'horse3']:(p)=>{
  let s=horseCart({lab:0,back:.25,sel:'cart'});
  s+=card(150,40,900,110,label('荷車の 合力の 中で 打ち消し合う 相手は ない',600,108,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 [K+'horse4']:(p)=>{
  let s=horseCart({lab:1,back:.25,sel:'cart',fric:seg(p,.3,.45)});
  s+=card(600,30,560,110,label('引く 力 ＞ 摩擦 → 荷車は 加速',880,98,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'both']:(p)=>horseCart({lab:0,sel:'both',ring2:seg(p,.05,.25)})+fade(seg(p,.3,.45),label('馬 ＋ 荷車 ＝ 1つの 物体',600,70,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'both2']:(p)=>{
  let s=horseCart({lab:0,sel:'both',ring2:1,pull:1-.6*seg(p,.2,.4),back:1-.6*seg(p,.2,.4)});
  s+=fade(seg(p,.2,.35),label('内力 → 打ち消し合う',600,70,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('→ 運動量の 単元で 使う',600,480,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S5 摩擦がある運動 =================
 [K+'fr1']:(p)=>ground(150,1050,400)+box(500,400,{text:'2.0 kg',w:150,h:90,size:26})+FA(575,355,575+10*28,355,{g:seg(p,.3,.5),text:'10 N',dy:-22}),
 [K+'fr2']:(p)=>{
  let s=ground(150,1050,400)+box(500,400,{text:'2.0 kg',w:150,h:90,size:26})+FA(575,355,575+10*28,355,{text:'10 N',dy:-22});
  s+=FA(425,392,425-4*28,392,{g:seg(p,.05,.2),w:8,head:20})+fade(seg(p,.05,.2),label('摩擦 4 N',370,445,{size:26,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),T2('F=10-4=6\\ \\mathrm{N}',600,130,{size:50}));
  return s;
 },
 [K+'fr3']:(p)=>{
  let s=T2('a=\\dfrac{F}{m}',350,140,{size:52});
  s+=fade(seg(p,.1,.3),T2('=\\dfrac{6}{2.0}',350,290,{size:52,auto:false}));
  s+=card(620,160,480,120,tex('a=3.0\\ \\mathrm{m/s^2}',860,222,{size:48,auto:false,color:C.a}),seg(p,.5,.65),C.a);
  return s;
 },
 [K+'fr3b']:(p)=>{
  let s=card(620,160,480,120,tex('a=3.0\\ \\mathrm{m/s^2}',860,222,{size:48,auto:false,color:C.a}),1,C.a);
  [0,1,2].forEach(i=>{const x=130+i*150;s+=fade(seg(p,.05+i*.2,.2+i*.2),ground(x-60,x+60,400)+box(x,400,{w:70,h:56})+label(`${i} s`,x,440,{size:22,color:C.t,anchor:'middle'})+(i?VA(x-10,320,x-10+i*45,320)+label(i===1?'3.0 m/s':'6.0 m/s',x+10,300,{size:22,color:C.v,anchor:'middle'}):''));});
  s+=fade(seg(p,.55,.7),label('1秒ごとに ＋3.0 m/s',860,360,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fr4']:(p)=>{
  const x=380+300*seg(p,.05,.95);
  let s=ground(150,1050,400)+box(x,400,{w:150,h:90})+FA(x+75,355,x+75+6*28,355,{text:'引く 力',dy:-22})+FA(x-75,392,x-75-6*28,392,{text:'摩擦',dy:-26,w:8,head:20});
  s+=VA(x-40,250,x+60,250)+label('v 一定',x+10,232,{size:24,color:C.v,anchor:'middle',weight:700});
  s+=card(250,40,700,100,label('a ＝ 0 → 合力 0 → 引く 力 ＝ 摩擦',600,102,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  return s;
 },
 [K+'mu1']:(p)=>{
  let s=card(380,70,440,140,T2('f=\\mu '+NN,600,145,{size:62,auto:false}),seg(p,.05,.2),C.F);
  s+=fade(seg(p,.3,.45),label('f：すべるときの 摩擦の 大きさ',600,280,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('μ：面で 決まる 数（動摩擦係数）',600,340,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('N：垂直抗力',600,400,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mu2']:(p)=>{
  let s=card(380,40,440,120,T2('f=\\mu '+NN,600,105,{size:54,auto:false}),1,C.F);
  s+=card(150,200,900,110,label('面の 性質を まとめた モデル（仮定）',600,268,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(150,340,900,100,label('法則 ではない・どんな 抵抗にも 使える 式 ではない',600,402,{size:28,color:C.dim,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'mu3']:(p)=>{
  let s=T2('f=\\mu '+NN,600,80,{size:50,auto:false});
  s+=fade(seg(p,.05,.25),label('μ ＝ 0.30、N ＝ 19.6 N',600,160,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),T2('=0.30\\times 19.6',600,245,{size:48,auto:false}));
  s+=card(400,300,400,110,T2('\\approx 5.9\\ \\mathrm{N}',600,358,{size:52,auto:false,color:Fc}),seg(p,.55,.7),C.F);
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>apart({o:{n1:1,r1:1,g2:.2,r2:.2}})+card(80,130,300,140,label('作用・反作用',230,185,{size:28,color:C.F,anchor:'middle',weight:700})+label('つり合い ではない',230,235,{size:26,color:C.a,anchor:'middle',weight:700}),seg(p,.3,.45),C.F),
 [K+'ans2']:(p)=>apart({o:{n1:1,g2:1,r1:.2,r2:.2},box2:1,boxP:'book'})+card(80,130,300,140,label('つり合いの 2力',230,185,{size:28,color:C.hi,anchor:'middle',weight:700})+label('本が 受ける N と mg',230,235,{size:24,color:C.F,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi),
 [K+'mis2']:(p)=>{
  let s=apart({o:{n1:1,g2:1,r1:.2,r2:seg(p,.5,.65)>.5?1:.2}});
  s+=card(80,130,300,140,label('N と mg は',230,185,{size:28,color:C.ink,anchor:'middle',weight:700})+label('ペア ではない',230,235,{size:28,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=fade(seg(p,.5,.65),label('重力の 相手 → 地球',1000,170,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum']:(p)=>{
  const L=[['慣性の法則','力 0 → 速度 一定'],['ma ＝ F','F は 合力'],['作用・反作用','2物体の 間の ペア']];
  let s='';
  L.forEach((r,i)=>{s+=card(60+i*370,120,340,200,label(r[0],230+i*370,195,{size:34,color:C.hi,anchor:'middle',weight:700})+label(r[1],230+i*370,265,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05+i*.2,.2+i*.2),C.hi);});
  s+=fade(seg(p,.7,.85),label('3つの 法則',600,400,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  const u=seg(p,.1,.9),x=250+600*u;
  let s=ground(100,1100,400)+box(x,400,{w:110,h:80})+FA(x-130,355,x-58,355)+fade(.0,'');
  s+=line(250,450,x,450,{color:C.x,w:4})+label('押した 距離',(250+x)/2,485,{size:24,color:C.x,anchor:'middle'});
  s+=VA(x-30,290,x-30+40+180*u,290)+label('速くなる',x+40,270,{size:24,color:C.v,anchor:'middle',weight:700});
  return s;
 },
 [K+'next2']:(p)=>{
  let s=fade(.35,ground(100,1100,400)+box(850,400,{w:110,h:80}));
  s+=card(250,100,700,200,label('力 × 距離 は',600,170,{size:32,color:C.ink,anchor:'middle'})+label('物体の 何を 増やす？',600,245,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>card(200,110,800,230,label('次の単元',600,175,{size:28,color:C.dim,anchor:'middle'})+label('仕事と エネルギー',600,260,{size:52,color:C.hi,anchor:'middle',weight:700})+label('深く学ぶ 1/3 へ',600,315,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
