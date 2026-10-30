// YouTube シリーズ「ベクトル・初級 1/3」(ys-ui-vector-map-1) — 図。Stage 1200×515.
// 色：𝐀 桃(C.p)、x 成分 水色(C.x)、y 成分 紫(C.v)、力 緑(C.F)、強調 黄(C.hi)。右が x の正、上が y の正。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,poly,move} from './anim.mjs';

const K='ui-vector-map-1:';
const VA=C.p,CX=C.x,CY=C.v,FF=C.F,HI=C.hi;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const vA=cs(VA,'\\mathbf{A}');
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});

// square grid; data (a,b) → screen. y up.
function plane({ox,oy,u,x0,x1,y0,y1,g=1,nums=true,skip=[]}){
 const X=a=>ox+u*a,Y=b=>oy-u*b;let s='';
 for(let a=x0;a<=x1;a++)s+=line(X(a),Y(y0)+u*.4,X(a),Y(y1)-u*.4,{color:C.grid,w:1.5});
 for(let b=y0;b<=y1;b++)s+=line(X(x0)-u*.4,Y(b),X(x1)+u*.4,Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(x0)-u*.4,Y(0),X(x1)+u*.7,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(y0)+u*.4,X(0),Y(y1)-u*.7,{color:C.dim,w:2.5,head:13});
 s+=label('x',X(x1)+u*.7+8,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)+12,Y(y1)-u*.6,{size:24,color:C.dim});
 if(nums){for(let a=x0;a<=x1;a++)if(a&&!skip.includes(a))s+=label(String(a).replace('-','−'),X(a),Y(0)+26,{size:20,color:C.dim,anchor:'middle'});
  for(let b=y0;b<=y1;b++)if(b)s+=label(String(b).replace('-','−'),X(0)-10,Y(b)+7,{size:20,color:C.dim,anchor:'end'});}
 return {X,Y,svg:fade(g,s)};
}
const G1={ox:190,oy:200,u:62,x0:-1,x1:5,y0:-3,y1:2,skip:[3]};
const vec=(P,a,b,c,d,{color=VA,g=1,w=6,head=20}={})=>arrow(P.X(a),P.Y(b),P.X(c),P.Y(d),{color,g,w,head});
// 𝐀 = (3,−2) with optional components
function Agrid(p,{gA=1,gx=0,gy=0,lab=1,dimA=1}={}){
 const P=plane(G1);let s=P.svg;
 s+=fade(gx,vec(P,0,0,3,0,{color:CX,w:6})+label('右へ 3',P.X(1.5),P.Y(0)-14,{size:24,color:CX,anchor:'middle',weight:700}));
 s+=fade(gy,vec(P,3,0,3,-2,{color:CY,w:6})+label('下へ 2',P.X(3)+14,P.Y(-1)+8,{size:24,color:CY,weight:700}));
 s+=fade(dimA,vec(P,0,0,3,-2,{g:gA,w:7}));
 s+=fade(lab*gA*dimA,T(vA,P.X(1.2)-20,P.Y(-1.2)+28,{size:36}));
 return {P,s};
}

function box(x,y,w=110,h=80){return rect(x-w/2,y-h,w,h,{fill:'#6b5a3e',fo:.9,stroke:'#b9985f',sw:3,rx:6})+line(x-w/2+10,y-h+12,x+w/2-10,y-12,{color:'#b9985f',w:2})+line(x+w/2-10,y-h+12,x-w/2+10,y-12,{color:'#b9985f',w:2});}
function floor(x1,x2,y){let s=line(x1,y,x2,y,{color:C.dim,w:3});for(let q=x1;q<x2;q+=26)s+=line(q,y+2,q-14,y+18,{color:C.faint,w:2});return s;}
// one push panel: dir = +1 right, −1 left
function pushPanel(cx,y,dir,g,mv,cap){
 let s=floor(cx-230,cx+230,y);
 const bx=cx+dir*mv*110;s+=box(bx,y);
 if(mv>0)s+=fade(.35,box(cx,y));
 const ax=dir>0?bx-55-120:bx+55+120,ay=y-40;
 s+=arrow(ax,ay,dir>0?bx-58:bx+58,ay,{color:FF,w:7,head:22});
 s+=label('力',ax+(dir>0?-10:10),ay-18,{size:26,color:FF,anchor:dir>0?'end':'start',weight:700});
 s+=label(cap,cx,y+60,{size:26,color:C.ink,anchor:'middle'});
 return fade(g,s);
}

export const ytUiVectorMap1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=label('前回：近似',70,70,{size:24,color:C.dim});
  s+=card(170,110,860,170,T(`${cs(C.a,'\\sin\\theta')}\\approx${cs(C.x,'\\theta')}`,600,190,{size:56}),seg(p,0,.2));
  const u=seg(p,.4,.7);
  s+=fade(u,line(360,380,360+440*u,380,{color:C.x,w:14})+line(360,430,360+436*u,430,{color:C.a,w:14}));
  s+=fade(seg(p,.6,.8),label('比べたのは「大きさ」（長さ・角度）',600,490,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'push']:(p)=>{
  let s=pushPanel(310,330,1,seg(p,.3,.42),seg(p,.4,.6),'右へ押す → 右へ動く');
  s+=pushPanel(890,330,-1,seg(p,.55,.67),seg(p,.65,.85),'左へ押す → 左へ動く');
  s+=fade(seg(p,.02,.2),label('大きさだけでは 決まらない量',600,90,{size:32,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),label('同じ大きさの力',600,150,{size:26,color:FF,anchor:'middle'}));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('向きを持つ量（矢印）は',600,165,{size:34,color:C.ink,anchor:'middle'})
   +label('どうやって 数で扱う？',600,230,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  const arr=[[-1.2,.5],[.9,.9],[1.3,-.3],[-.4,-1],[.2,1.3]];
  arr.forEach(([a,b],i)=>{s+=arrow(600+i*0,400,600+a*110,400-b*80,{color:[VA,FF,C.x,C.v,C.E][i],w:5,g:seg(p,.35+i*.07,.55+i*.07)});});
  return s;
 },
 [K+'plan']:(p)=>{
  const rows=[['1','矢印を 数の組で表す・長さ','今回'],['2','矢印の 足し算・引き算、矢印の地図',''],['3','電場の矢印は 何の地図？','']];
  let s=label('3回で答える',600,80,{size:30,color:C.dim,anchor:'middle'});
  rows.forEach(([n,t,m],i)=>{const y=150+i*105,on=i===0;
   s+=fade(seg(p,.1+i*.15,.3+i*.15),rect(170,y-45,860,80,{fill:on?HI:'#131f38',fo:on?.1:.9,stroke:on?HI:C.faint,rx:12})
    +label(n,220,y+10,{size:34,color:on?HI:C.dim,anchor:'middle',weight:700})+label(t,270,y+10,{size:30,color:on?C.ink:C.dim})
    +(m?label(m,1000,y+10,{size:26,color:HI,anchor:'end',weight:700}):''));});
  return s;
 },
 // ===== S2 スカラーとベクトル =====
 [K+'scalar']:(p)=>{
  let s=card(60,90,500,370,label('スカラー',310,145,{size:34,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.05,.25),label('質量  2 kg',310,245,{size:34,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.2,.4),label('温度  20 ℃',310,320,{size:34,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.45,.65),label('数 ＋ 単位 で決まる',310,410,{size:28,color:HI,anchor:'middle'})),seg(p,0,.1));
  return s;
 },
 [K+'vector']:(p)=>{
  let s=card(60,90,500,370,label('スカラー',310,145,{size:34,color:C.ink,anchor:'middle',weight:700})
   +label('質量  2 kg',310,245,{size:34,color:C.ink,anchor:'middle'})+label('温度  20 ℃',310,320,{size:34,color:C.ink,anchor:'middle'})
   +label('数 ＋ 単位 で決まる',310,410,{size:28,color:HI,anchor:'middle'}));
  s+=card(640,90,500,370,label('ベクトル',890,145,{size:34,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),label('力',720,250,{size:32,color:FF})+arrow(790,240,1000,190,{color:FF,w:6}))
   +fade(seg(p,.25,.45),label('速度',720,330,{size:32,color:C.v})+arrow(810,320,1060,345,{color:C.v,w:6}))
   +fade(seg(p,.55,.75),label('向き ＋ 大きさ',890,410,{size:28,color:HI,anchor:'middle'})),seg(p,.05,.15));
  return s;
 },
 [K+'arrow']:(p)=>{
  const x0=260,y0=380,x1=720,y1=160;
  let s=arrow(x0,y0,x1,y1,{color:VA,w:9,head:30,g:seg(p,0,.3)});
  s+=fade(seg(p,.35,.5),line(x0,y0,x0+260,y0,{color:C.dim,w:2,dash:'6 6'}));
  const a=Math.atan2(y0-y1,x1-x0);
  s+=fade(seg(p,.6,.75),draw(Array.from({length:24},(_,i)=>{const t=a*i/23;return [x0+120*Math.cos(t),y0-120*Math.sin(t)];}),1,{color:HI,w:3})+label('向き ＝ 方向',x0+150,y0-20,{size:28,color:HI,weight:700}));
  // length marker parallel to arrow
  const nx=-(y1-y0),ny=(x1-x0),L=Math.hypot(nx,ny),ox=nx/L*-34,oy=ny/L*-34;
  s+=fade(seg(p,.35,.5),line(x0+ox,y0+oy,x1+ox,y1+oy,{color:C.ink,w:2})+label('長さ ＝ 大きさ',(x0+x1)/2+ox-30,(y0+y1)/2+oy-14,{size:28,color:C.ink,anchor:'end',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=arrow(200,380,480,380,{color:FF,w:8,head:26,g:seg(p,0,.25)})+fade(seg(p,.1,.25),label('右向き',340,430,{size:28,color:FF,anchor:'middle'}));
  s+=arrow(760,420,760,140,{color:FF,w:8,head:26,g:seg(p,.15,.4)})+fade(seg(p,.25,.4),label('上向き',790,300,{size:28,color:FF}));
  s+=fade(seg(p,.3,.45),label('長さは同じ',600,120,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),label('≠',610,330,{size:80,color:HI,anchor:'middle',weight:700})+label('別のベクトル',600,480,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notation']:(p)=>{
  let s=card(120,110,440,280,T(vA,340,230,{size:90})+label('ベクトル（太字）',340,345,{size:30,color:VA,anchor:'middle',weight:700}),seg(p,0,.2),VA);
  s+=card(640,110,440,280,T('A,\\;\\;3,\\;\\;-2',860,230,{size:64})+label('細い文字：ただの数',860,345,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.7));
  return s;
 },
 // ===== S3 成分で表す =====
 [K+'grid']:(p)=>{
  const {P,s:g}=Agrid(p,{gA:seg(p,.15,.45)});let s=g;
  s+=fade(seg(p,.1,.25),dot(P.X(0),P.Y(0),9,C.ink)+label('根元',P.X(0)-14,P.Y(0)-14,{size:24,color:C.ink,anchor:'end'}));
  s+=fade(seg(p,.4,.55),dot(P.X(3),P.Y(-2),9,HI)+label('先端',P.X(3)+16,P.Y(-2)+30,{size:24,color:HI}));
  s+=card(640,120,500,200,label('根元から先端まで',890,190,{size:32,color:C.ink,anchor:'middle'})+label('どう進めば着く？',890,260,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.55,.7),HI);
  return s;
 },
 [K+'steps']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:seg(p,.05,.35),gy:seg(p,.4,.7),dimA:.45});let s=g;
  s+=dot(P.X(3),P.Y(-2),9,HI);
  s+=card(640,120,500,200,fade(seg(p,.1,.3),label('① 右へ 3 マス',890,190,{size:34,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,.45,.65),label('② 下へ 2 マス',890,260,{size:34,color:CY,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'join']:(p)=>{
  const hl=seg(p,.4,.6);
  const {P,s:g}=Agrid(p,{gx:1,gy:1,dimA:mix(.45,1,hl)});let s=g;
  s+=dot(P.X(3),P.Y(-2),9,HI);
  s+=card(640,120,500,200,label('① 右へ 3 マス',890,190,{size:34,color:CX,anchor:'middle',weight:700})+label('② 下へ 2 マス',890,260,{size:34,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),T(`${vA}\\;=\\;${cs(CX,'\\rightarrow')}\\;+\\;${cs(CY,'\\downarrow')}`,890,410,{size:52})+label('継ぎ足し',890,480,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'signs']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=fade(seg(p,.02,.2),label('＋',P.X(5)+30,P.Y(0)-16,{size:26,color:HI,weight:700})+label('＋',P.X(0)+26,P.Y(2)+4,{size:26,color:HI,weight:700}));
  s+=card(640,90,500,260,label('右向き ＝ x の正',890,145,{size:28,color:C.dim,anchor:'middle'})+label('上向き ＝ y の正',890,190,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('x 成分   3',890,260,{size:34,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('y 成分   −2',890,320,{size:34,color:CY,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'pair']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(640,90,500,260,label('x 成分   3',890,150,{size:30,color:CX,anchor:'middle',weight:700})+label('y 成分   −2',890,200,{size:30,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.1,.3),T(`${vA}=(${cs(CX,'3')},\\,${cs(CY,'-2')})`,890,290,{size:52})));
  s+=fade(seg(p,.55,.75),label('かっこの中の数 ＝ 成分',890,420,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'general']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(640,90,500,260,label('x 成分   3',890,150,{size:30,color:CX,anchor:'middle',weight:700})+label('y 成分   −2',890,200,{size:30,color:CY,anchor:'middle',weight:700})
   +T(`${vA}=(${cs(CX,'3')},\\,${cs(CY,'-2')})`,890,290,{size:52}));
  s+=fade(seg(p,.3,.5),label('一般に',700,420,{size:26,color:C.dim})+T(`${vA}=(${cs(CX,'A_x')},\\,${cs(CY,'A_y')})`,930,420,{size:50}));
  return s;
 },
 [K+'reverse']:(p)=>{
  const P=plane({ox:300,oy:360,u:62,x0:-3,x1:3,y0:-1,y1:4});let s=P.svg;
  s+=card(640,90,500,170,T('(-1,\\,4)',890,170,{size:56})+fade(seg(p,.4,.6),label('左へ 1、上へ 4',890,235,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=fade(seg(p,.4,.55),vec(P,0,0,-1,0,{color:CX,w:6}));
  s+=fade(seg(p,.5,.65),vec(P,-1,0,-1,4,{color:CY,w:6}));
  s+=vec(P,0,0,-1,4,{color:C.E,w:7,g:seg(p,.7,.9)});
  return s;
 },
 [K+'anyarrow']:(p)=>{
  const P=plane({ox:330,oy:260,u:55,x0:-4,x1:4,y0:-3,y1:3,nums:false});let s=P.svg;
  const L=[[3,2],[-3,1],[-2,-3],[2,-2]];
  L.forEach(([a,b],i)=>{const g=seg(p,.05+i*.15,.25+i*.15);
   s+=fade(g,line(P.X(0),P.Y(0),P.X(a),P.Y(0),{color:CX,w:4,dash:'8 6'})+line(P.X(a),P.Y(0),P.X(a),P.Y(b),{color:CY,w:4,dash:'8 6'}))+vec(P,0,0,a,b,{color:VA,w:5,g});});
  s+=card(720,120,440,260,label('横 ＋ 縦 の継ぎ足し',940,190,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.65,.8),label('矢印 1 本',940,270,{size:34,color:VA,anchor:'middle',weight:700})+label('⇔ 数の組',940,330,{size:34,color:HI,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'quiz']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:0,gy:0});let s=g;
  s+=card(640,110,500,230,label('確認',890,160,{size:28,color:C.dim,anchor:'middle'})+T(`${vA}=(3,\\,${cs(HI,'-2')})`,890,235,{size:54})
   +label('−2 は 何を表す？',890,305,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  return s;
 },
 [K+'quizans']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:0,gy:seg(p,.05,.3)});let s=g;
  s+=card(640,110,500,230,label('確認',890,160,{size:28,color:C.dim,anchor:'middle'})+T(`${vA}=(3,\\,${cs(CY,'-2')})`,890,235,{size:54})
   +fade(seg(p,.1,.3),label('下へ 2',890,305,{size:34,color:CY,anchor:'middle',weight:700})),1,HI);
  s+=fade(seg(p,.5,.7),label('マイナス ＝ 下向き',890,420,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 長さ =====
 [K+'lenq']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(640,110,500,200,label('𝐀 の長さは？',890,165,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),T(`3+(-2)=1\\;\\;?`,890,250,{size:50})),seg(p,0,.15));
  return s;
 },
 [K+'triangle']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  const q=14,x=P.X(3),y=P.Y(0);
  s+=fade(seg(p,.1,.3),draw([[x-q,y],[x-q,y+q],[x,y+q]],1,{color:HI,w:3})+label('直角',x+16,y-12,{size:22,color:HI}));
  s+=fade(seg(p,.45,.65),poly([[P.X(0),P.Y(0)],[x,y],[P.X(3),P.Y(-2)]],{fill:VA,fo:.12})+label('斜辺',P.X(1.3)-30,P.Y(-1.3)+66,{size:28,color:VA,weight:700}));
  s+=card(640,110,500,200,label('横 3 と 縦 2 が 直角',890,175,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),label('𝐀 本体 ＝ 斜辺',890,250,{size:34,color:VA,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'pyth1']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(620,90,550,340,label('三平方の定理',895,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('斜辺² ＝ 2辺の2乗の和',895,200,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.5,.7),T(`|${vA}|^2=${cs(CX,'3')}^2+(${cs(CY,'-2')})^2`,895,300,{size:48})),seg(p,0,.1));
  return s;
 },
 [K+'pyth2']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(620,90,550,340,label('三平方の定理',895,140,{size:28,color:C.dim,anchor:'middle'})
   +T(`|${vA}|^2=${cs(CX,'3')}^2+(${cs(CY,'-2')})^2`,895,210,{size:44})
   +fade(seg(p,.05,.3),T(`=${cs(CX,'9')}+${cs(CY,'4')}`,895,290,{size:44}))
   +fade(seg(p,.55,.75),T(`=13`,895,370,{size:44})));
  s+=fade(seg(p,.05,.3)*(1-seg(p,.5,.6)),label('(−2)² ＝ ＋4',1030,300,{size:24,color:CY}));
  return s;
 },
 [K+'pyth3']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(620,90,550,340,label('長さ',895,140,{size:28,color:C.dim,anchor:'middle'})
   +T(`|${vA}|^2=13`,895,220,{size:48})
   +fade(seg(p,.2,.45),T(`|${vA}|=\\sqrt{13}\\approx 3.6`,895,320,{size:52})));
  s+=fade(seg(p,.2,.45),highlight(680,275,430,95,1,HI));
  return s;
 },
 [K+'measure']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:.35,gy:.35});let s=g;
  // swing 𝐀 down onto the x-axis to compare its length with 3 and 5
  const L=Math.sqrt(13),a0=Math.atan2(-2,3),a=mix(a0,0,seg(p,.1,.4));
  s+=fade(seg(p,.1,.2),draw(Array.from({length:30},(_,i)=>{const t=a0+(a-a0)*i/29;return [P.X(L*Math.cos(t)),P.Y(L*Math.sin(t))];}),1,{color:VA,w:2,dash:'6 6'}));
  s+=fade(seg(p,.1,.2),arrow(P.X(0),P.Y(0),P.X(L*Math.cos(a)),P.Y(L*Math.sin(a)),{color:VA,w:4,opacity:.8}));
  s+=fade(seg(p,.4,.55),dot(P.X(3),P.Y(0),8,CX)+dot(P.X(5),P.Y(0),8,HI)+label('3.6',P.X(L),P.Y(0)-18,{size:24,color:VA,anchor:'middle',weight:700}));
  s+=card(640,110,500,220,fade(seg(p,.45,.6),T(`3\\;<\\;${cs(VA,'3.6')}\\;<\\;3+2=5`,890,190,{size:44}))
   +fade(seg(p,.7,.85),T(`3+(-2)=1\\;\\;`,850,275,{size:40})+label('✕',990,288,{size:40,color:C.a,anchor:'middle',weight:700})),seg(p,.4,.5));
  return s;
 },
 [K+'neverneg']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(640,110,500,260,T(`(${cs(CY,'-2')})^2=+4`,890,200,{size:52})
   +fade(seg(p,.3,.5),label('2乗すると 正',890,270,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('長さは 負にならない',890,335,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'formula']:(p)=>{
  const {P,s:g}=Agrid(p,{gx:1,gy:1});let s=g;
  s+=card(600,110,570,260,label('一般に',640,160,{size:26,color:C.dim})
   +fade(seg(p,.05,.3),T(`|${vA}|=\\sqrt{${cs(CX,'A_x')}^2+${cs(CY,'A_y')}^2}`,885,245,{size:52}))
   +fade(seg(p,.55,.75),label('＝ 三平方の定理そのもの',885,335,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 // ===== S5 単位ベクトル =====
 [K+'unit']:(p)=>{
  const P=plane({ox:300,oy:330,u:110,x0:-1,x1:2,y0:-1,y1:2,nums:false});let s=P.svg;
  s+=vec(P,0,0,1,0,{color:CX,w:7,g:seg(p,.1,.35)})+fade(seg(p,.25,.4),T(cs(CX,'\\hat{x}'),P.X(.5),P.Y(0)+50,{size:44}));
  s+=vec(P,0,0,0,1,{color:CY,w:7,g:seg(p,.5,.75)})+fade(seg(p,.65,.8),T(cs(CY,'\\hat{y}'),P.X(0)-40,P.Y(.5)+12,{size:44}));
  s+=fade(seg(p,.2,.35),label('1',P.X(1),P.Y(0)+40,{size:24,color:C.dim,anchor:'middle'})+label('1',P.X(0)+22,P.Y(1)+8,{size:24,color:C.dim}));
  s+=card(700,120,440,230,fade(seg(p,.25,.4),label('長さ 1・右向き',920,200,{size:32,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('長さ 1・上向き',920,280,{size:32,color:CY,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'hat']:(p)=>{
  const P=plane({ox:300,oy:330,u:110,x0:-1,x1:2,y0:-1,y1:2,nums:false});let s=P.svg;
  s+=vec(P,0,0,1,0,{color:CX,w:7})+T(cs(CX,'\\hat{x}'),P.X(.5),P.Y(0)+50,{size:44});
  s+=vec(P,0,0,0,1,{color:CY,w:7})+T(cs(CY,'\\hat{y}'),P.X(0)-40,P.Y(.5)+12,{size:44});
  s+=card(700,120,440,230,label('単位ベクトル',920,190,{size:36,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),label('帽子 ＾ ＝ 長さ 1',920,260,{size:30,color:HI,anchor:'middle'})+label('向きだけを表す',920,310,{size:30,color:HI,anchor:'middle'})));
  return s;
 },
 [K+'scale']:(p)=>{
  const P=plane(G1);let s=P.svg;
  s+=vec(P,0,0,3,0,{color:CX,w:6,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),T(`${cs(CX,'3\\hat{x}')}`,P.X(1.5),P.Y(0)-22,{size:40}));
  // ŷ (up, ghost) flips to −2ŷ (down, length 2)
  const f=seg(p,.55,.8);
  s+=fade(seg(p,.45,.55)*(1-f*.7),vec(P,3,0,3,1,{color:CY,w:5}))+fade(seg(p,.45,.55)*(1-f),T(cs(CY,'\\hat{y}'),P.X(3)+34,P.Y(.5)+12,{size:36}));
  s+=fade(f,vec(P,3,0,3,-2,{color:CY,w:6})+T(cs(CY,'-2\\hat{y}'),P.X(3)+70,P.Y(-1)+12,{size:40}));
  s+=card(700,110,460,200,fade(seg(p,.1,.3),label('3倍 → 右へ 3',930,180,{size:30,color:CX,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('−2倍 → 逆向き・下へ 2',930,250,{size:30,color:CY,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'build']:(p)=>{
  const P=plane(G1);let s=P.svg;
  s+=vec(P,0,0,3,0,{color:CX,w:6})+T(`${cs(CX,'3\\hat{x}')}`,P.X(1.5),P.Y(0)-22,{size:40});
  s+=vec(P,3,0,3,-2,{color:CY,w:6})+T(cs(CY,'-2\\hat{y}'),P.X(3)+70,P.Y(-1)+12,{size:40});
  s+=vec(P,0,0,3,-2,{w:7,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),T(vA,P.X(1.2)-20,P.Y(-1.2)+28,{size:36}));
  s+=card(680,110,480,250,fade(seg(p,.1,.3),T(`${vA}=${cs(CX,'3\\hat{x}')}${cs(CY,'-2\\hat{y}')}`,920,190,{size:50}))
   +fade(seg(p,.5,.7),T(`=(${cs(CX,'3')},\\,${cs(CY,'-2')})`,920,285,{size:50})),seg(p,.05,.15));
  s+=fade(seg(p,.6,.8),label('組み立て方の形 ＝ 数の組',920,420,{size:28,color:HI,anchor:'middle'}));
  return s;
 },
 // ===== S6 まとめ・次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('向き ＋ 大きさ を持つ量 ＝ ベクトル',600,170,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25));
  s+=card(110,230,980,110,T(`${vA}=(${cs(CX,'A_x')},\\,${cs(CY,'A_y')})`,450,285,{size:46})+label('矢印 ＝ 成分の組',820,297,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.45,.65));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('向き ＋ 大きさ を持つ量 ＝ ベクトル',600,170,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(110,230,980,110,T(`${vA}=(${cs(CX,'A_x')},\\,${cs(CY,'A_y')})`,450,285,{size:46})+label('矢印 ＝ 成分の組',820,297,{size:32,color:HI,anchor:'middle',weight:700}));
  s+=card(110,360,980,130,label('符号 ＝ 向き',260,437,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.55),T(`|${vA}|=\\sqrt{3^2+(-2)^2}=\\sqrt{13}\\approx3.6`,730,425,{size:44})),seg(p,.05,.2));
  return s;
 },
 [K+'back']:(p)=>{
  let s=pushPanel(310,300,1,1,1,'右へ押す');
  s+=pushPanel(890,300,-1,1,1,'左へ押す');
  s+=fade(seg(p,.4,.6),T(`(${cs(CX,'+5')},\\,0)`,310,450,{size:46})+T(`(${cs(CX,'-5')},\\,0)`,890,450,{size:46}));
  s+=fade(seg(p,.4,.6),label('例：大きさ 5 の力',600,90,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.7,.85),label('x 成分の符号で区別',600,140,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('数の組になった矢印は',600,165,{size:34,color:C.ink,anchor:'middle'})
   +label('足したり 引いたり できる？',600,230,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  const P={X:a=>520+a*45,Y:b=>400-b*30};
  s+=fade(seg(p,.35,.5),arrow(P.X(0),P.Y(0),P.X(3),P.Y(-2),{color:VA,w:5})+T(vA,P.X(1.2),P.Y(-1)+44,{size:30}));
  s+=fade(seg(p,.5,.65),arrow(P.X(3),P.Y(-2),P.X(2),P.Y(2),{color:C.E,w:5,opacity:.7})+label('？',P.X(2)+20,P.Y(2)+6,{size:34,color:HI,weight:700}));
  return s;
 },
};

// ---- added cues: (0,3) and the (4,3) practice ------------------------------------------
const G2={ox:200,oy:330,u:56,x0:-1,x1:5,y0:-1,y1:4};
Object.assign(ytUiVectorMap1Diagrams,{
 [K+'zero']:(p)=>{
  const P=plane(G2);let s=P.svg;
  s+=card(640,90,500,200,T('(0,\\,3)',890,160,{size:56})+fade(seg(p,.45,.65),label('横 0、上へ 3',890,235,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=vec(P,0,0,0,3,{color:C.E,w:7,g:seg(p,.55,.8)})+fade(seg(p,.7,.85),label('真上へ 3',P.X(0)+20,P.Y(2),{size:26,color:C.E,weight:700}));
  return s;
 },
 [K+'practice']:(p)=>{
  const P=plane(G2);let s=P.svg;
  s+=fade(seg(p,.2,.4),line(P.X(0),P.Y(0),P.X(4),P.Y(0),{color:CX,w:4,dash:'8 6'})+line(P.X(4),P.Y(0),P.X(4),P.Y(3),{color:CY,w:4,dash:'8 6'}));
  s+=vec(P,0,0,4,3,{color:C.E,w:7,g:seg(p,.05,.3)});
  s+=card(640,90,500,200,label('練習',890,140,{size:28,color:C.dim,anchor:'middle'})+T('(4,\\,3)',890,200,{size:50})+label('長さは？',890,265,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,0,.15),HI);
  return s;
 },
 [K+'practiceans']:(p)=>{
  const P=plane(G2);let s=P.svg;
  s+=line(P.X(0),P.Y(0),P.X(4),P.Y(0),{color:CX,w:4,dash:'8 6'})+line(P.X(4),P.Y(0),P.X(4),P.Y(3),{color:CY,w:4,dash:'8 6'});
  s+=vec(P,0,0,4,3,{color:C.E,w:7});
  s+=card(620,90,550,300,T(`${cs(CX,'4')}^2+${cs(CY,'3')}^2`,895,160,{size:46})
   +fade(seg(p,.15,.35),T(`=16+9=25`,895,235,{size:46}))
   +fade(seg(p,.5,.7),T(`\\sqrt{25}=5`,895,320,{size:52})),seg(p,0,.1));
  return s;
 },
});
