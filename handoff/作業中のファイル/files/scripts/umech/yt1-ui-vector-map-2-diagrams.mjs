// YouTube シリーズ「ベクトル・初級 2/3」(ys-ui-vector-map-2) — 図。Stage 1200×515.
// 色：𝐀 桃(C.p)、𝐁 橙(C.E)、和・差 黄(C.hi)、x 成分 水色(C.x)、y 成分 紫(C.v)、速度 紫、風 白。右が x の正、上が y の正。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,poly} from './anim.mjs';

const K='ui-vector-map-2:';
const VA=C.p,VB=C.E,HI=C.hi,CX=C.x,CY=C.v,W_='#dfe9ff';
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const vA=cs(VA,'\\mathbf{A}'),vB=cs(VB,'\\mathbf{B}');

function plane({ox,oy,u,x0,x1,y0,y1,g=1,nums=true,skip=[]}){
 const X=a=>ox+u*a,Y=b=>oy-u*b;let s='';
 for(let a=x0;a<=x1;a++)s+=line(X(a),Y(y0)+u*.4,X(a),Y(y1)-u*.4,{color:C.grid,w:1.5});
 for(let b=y0;b<=y1;b++)s+=line(X(x0)-u*.4,Y(b),X(x1)+u*.4,Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(x0)-u*.4,Y(0),X(x1)+u*.7,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(y0)+u*.4,X(0),Y(y1)-u*.7,{color:C.dim,w:2.5,head:13});
 s+=label('x',X(x1)+u*.7+8,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)+12,Y(y1)-u*.6,{size:24,color:C.dim});
 if(nums){for(let a=x0;a<=x1;a++)if(a&&!skip.includes(a))s+=label(String(a).replace('-','−'),X(a)-12,Y(0)+24,{size:20,color:C.dim,anchor:'middle'});
  for(let b=y0;b<=y1;b++)if(b)s+=label(String(b).replace('-','−'),X(0)-10,Y(b)+7,{size:20,color:C.dim,anchor:'end'});}
 return {X,Y,svg:fade(g,s)};
}
const G={ox:224,oy:268,u:52,x0:-2,x1:4,y0:-3,y1:4};
const vec=(P,a,b,c,d,{color=VA,g=1,w=6,head=20,opacity=1}={})=>arrow(P.X(a),P.Y(b),P.X(c),P.Y(d),{color,g,w,head,opacity});
const lab=(P,a,b,t,o={})=>T(t,P.X(a),P.Y(b),{size:32,...o});
// A then B (tail to tip), optional sum
function AthenB(P,{gA=1,gB=1,gS=0,labels=true}={}){
 let s=vec(P,0,0,3,-2,{color:VA,g:gA})+vec(P,3,-2,2,2,{color:VB,g:gB});
 if(labels)s+=fade(gA,lab(P,1.2,-1.6,vA))+fade(gB,lab(P,3.1,.4,vB,{anchor:'start'}));
 s+=vec(P,0,0,2,2,{color:HI,g:gS,w:7})+fade(gS,lab(P,.3,1.6,cs(HI,'\\mathbf{A}+\\mathbf{B}'),{anchor:'end',size:30}));
 return s;
}
function BthenA(P,{gB=1,gA=1,labels=true,op=1}={}){
 let s=vec(P,0,0,-1,4,{color:VB,g:gB,opacity:op})+vec(P,-1,4,2,2,{color:VA,g:gA,opacity:op});
 if(labels)s+=fade(gB*op,lab(P,-1.3,2.2,vB,{anchor:'end'}))+fade(gA*op,lab(P,.7,3.6,vA));
 return s;
}
const goal=(P,g=1)=>fade(g,ring(P.X(2),P.Y(2),16,{color:HI,w:3})+dot(P.X(2),P.Y(2),7,HI));

export const ytUiVectorMap2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=fade(seg(p,.3,.5),line(P.X(0),P.Y(0),P.X(3),P.Y(0),{color:CX,w:4,dash:'8 6'})+line(P.X(3),P.Y(0),P.X(3),P.Y(-2),{color:CY,w:4,dash:'8 6'}));
  s+=vec(P,0,0,3,-2,{g:seg(p,.05,.3)})+fade(seg(p,.2,.35),lab(P,1.2,-1.6,vA));
  s+=label('前回',650,80,{size:24,color:C.dim});
  s+=card(640,110,500,200,T(`${vA}=(${cs(CX,'3')},\\,${cs(CY,'-2')})`,890,190,{size:52})
   +fade(seg(p,.45,.65),label('右へ 3、下へ 2',890,265,{size:30,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('数の組になった矢印どうしは',600,165,{size:34,color:C.ink,anchor:'middle'})
   +label('足したり 引いたり できる？',600,230,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,0,.2),HI);
  s+=fade(seg(p,.4,.6),T(`${vA}\\;+\\;${vB}\\;=\\;?\\qquad ${vB}\\;-\\;${vA}\\;=\\;?`,600,390,{size:50}));
  return s;
 },
 // ===== S2 足し算 =====
 [K+'moves']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2,{g:seg(p,.05,.25)})+fade(seg(p,.15,.3),lab(P,1.2,-1.6,vA));
  s+=vec(P,0,0,-1,4,{color:VB,g:seg(p,.5,.7)})+fade(seg(p,.6,.75),lab(P,-1.3,2.2,vB,{anchor:'end'}));
  s+=card(640,90,510,300,label('移動の指示',895,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`${vA}=(3,\\,-2)`,780,210,{size:40,anchor:'start'})+label('右へ 3、下へ 2',780,260,{size:28,color:VA}))
   +fade(seg(p,.5,.7),T(`${vB}=(-1,\\,4)`,780,320,{size:40,anchor:'start'})+label('左へ 1、上へ 4',780,370,{size:28,color:VB})),seg(p,0,.12));
  return s;
 },
 [K+'chain']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=fade(1-seg(p,.05,.2),vec(P,0,0,-1,4,{color:VB,opacity:.8}));
  s+=AthenB(P,{gA:1,gB:seg(p,.15,.4),gS:seg(p,.6,.85)});
  s+=card(640,90,510,300,label('① 𝐀 のとおり進む',895,160,{size:30,color:VA,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),label('② その先端から 𝐁 のとおり',895,230,{size:30,color:VB,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('まとめた 1 本 ＝ 𝐀＋𝐁',895,320,{size:32,color:HI,anchor:'middle',weight:700})),1);
  s+=fade(seg(p,.8,.95),label('（決めごと＝定義）',895,440,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:0});
  s+=fade(seg(p,.1,.3),label('？',P.X(2)+18,P.Y(2)-10,{size:40,color:HI,weight:700}));
  s+=card(640,110,510,200,label('到着点は どこ？',895,190,{size:38,color:HI,anchor:'middle',weight:700})+label('予想してみよう',895,255,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2),HI);
  return s;
 },
 [K+'addx']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:0});
  // horizontal shadows on a strip below the grid
  const y=P.Y(-3)+48;
  s+=fade(seg(p,.1,.3),arrow(P.X(0),y,P.X(3),y,{color:VA,w:5})+label('右へ 3',P.X(1.5),y+30,{size:22,color:VA,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),arrow(P.X(3),y-14,P.X(2),y-14,{color:VB,w:5})+label('左へ 1',P.X(3.4),y-26,{size:22,color:VB}));
  s+=card(640,90,510,300,label('横（x）',895,140,{size:28,color:CX,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),T(`${cs(VA,'3')}+(${cs(VB,'-1')})=${cs(HI,'2')}`,895,230,{size:48}))
   +fade(seg(p,.75,.9),label('右へ 2',895,310,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'addy']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:0});
  const x=P.X(4)+40;
  s+=fade(seg(p,.1,.3),arrow(x,P.Y(0),x,P.Y(-2),{color:VA,w:5})+label('下へ 2',x+10,P.Y(-2)+26,{size:22,color:VA}));
  s+=fade(seg(p,.35,.55),arrow(x+30,P.Y(-2),x+30,P.Y(2),{color:VB,w:5})+label('上へ 4',x+40,P.Y(1),{size:22,color:VB}));
  s+=card(640,90,510,300,label('縦（y）',895,140,{size:28,color:CY,anchor:'middle',weight:700})
   +fade(seg(p,.55,.75),T(`${cs(VA,'-2')}+${cs(VB,'4')}=${cs(HI,'2')}`,895,230,{size:48}))
   +fade(seg(p,.75,.9),label('上へ 2',895,310,{size:32,color:HI,anchor:'middle',weight:700})),seg(p,0,.1));
  s=s.replace('','');return s;
 },
 [K+'sum']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:seg(p,.2,.45)});
  s+=card(640,90,510,300,T(`${vA}+${vB}`,895,150,{size:42})
   +fade(seg(p,.05,.25),T(`=(${cs(VA,'3')}+(${cs(VB,'-1')}),\\;${cs(VA,'-2')}+${cs(VB,'4')})`,895,230,{size:36}))
   +fade(seg(p,.3,.5),T(`=(${cs(HI,'2')},\\,${cs(HI,'2')})`,895,310,{size:46})),seg(p,0,.08));
  s+=fade(seg(p,.6,.8),label('x は x、y は y で足す',895,440,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'gridcheck']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:1});
  s+=fade(seg(p,.2,.45),line(P.X(0),P.Y(0),P.X(2),P.Y(0),{color:CX,w:4,dash:'8 6'})+line(P.X(2),P.Y(0),P.X(2),P.Y(2),{color:CY,w:4,dash:'8 6'}))+goal(P,seg(p,.5,.7));
  s+=card(640,90,510,300,T(`${vA}+${vB}=(2,\\,2)`,895,170,{size:46})
   +fade(seg(p,.2,.45),label('右へ 2、上へ 2',895,260,{size:32,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.75),label('方眼の到着点と一致',895,330,{size:30,color:HI,anchor:'middle',weight:700})));
  return s;
 },
 [K+'order']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:1})+goal(P);
  s+=BthenA(P,{gB:seg(p,.2,.45),gA:seg(p,.5,.75),op:.9});
  s+=card(640,90,510,200,label('順番を逆に',895,150,{size:28,color:C.dim,anchor:'middle'})
   +label('先に 𝐁、次に 𝐀',895,220,{size:36,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'same']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:1})+BthenA(P)+goal(P);
  s+=fade(seg(p,.5,.7),ring(P.X(2),P.Y(2),26,{color:HI,w:3}));
  s+=card(640,90,510,300,label('𝐁 → 𝐀 の順',895,150,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`(${cs(VB,'-1')}+${cs(VA,'3')},\\;${cs(VB,'4')}+(${cs(VA,'-2')}))`,895,230,{size:38}))
   +fade(seg(p,.5,.7),T(`=(${cs(HI,'2')},\\,${cs(HI,'2')})`,895,310,{size:46})+label('同じ点',895,370,{size:30,color:HI,anchor:'middle',weight:700})),1);
  return s;
 },
 [K+'comm']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=fade(seg(p,.4,.6),poly([[P.X(0),P.Y(0)],[P.X(3),P.Y(-2)],[P.X(2),P.Y(2)],[P.X(-1),P.Y(4)]],{fill:HI,fo:.08}));
  s+=AthenB(P,{gS:1})+BthenA(P)+goal(P);
  s+=card(640,90,510,300,T(`${vA}+${vB}=${vB}+${vA}`,895,180,{size:50})
   +fade(seg(p,.45,.65),label('2通りの道 ＝',895,270,{size:30,color:C.ink,anchor:'middle'})+label('平行四辺形の 向かい合う辺',895,320,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'length']:(p)=>{
  const P=plane(G);let s=P.svg+AthenB(P,{gS:1});
  s+=card(620,80,550,340,label('長さは そのまま足せない',895,130,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),T(`|${vA}|=\\sqrt{13}\\approx3.6`,895,200,{size:38}))
   +fade(seg(p,.28,.43),T(`|${vB}|=\\sqrt{17}\\approx4.1`,895,265,{size:38}))
   +fade(seg(p,.5,.7),T(`|${cs(HI,'\\mathbf{A}+\\mathbf{B}')}|=\\sqrt{2^2+2^2}=\\sqrt{8}\\approx2.8`,895,345,{size:36})),seg(p,0,.1));
  s+=fade(seg(p,.75,.9),label('3.6 ＋ 4.1 ではない',895,470,{size:28,color:HI,anchor:'middle'}));
  return s;
 },
 // ===== S3 引き算 =====
 [K+'subdef']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+lab(P,1.2,-1.6,vA)+vec(P,0,0,-1,4,{color:VB})+lab(P,-1.3,2.2,vB,{anchor:'end'});
  s+=card(640,90,510,300,T(`${vB}-${vA}`,895,160,{size:48})
   +fade(seg(p,.3,.55),label('𝐀 に足すと 𝐁 になる矢印',895,245,{size:30,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),T(`${vA}+(${vB}-${vA})=${vB}`,895,330,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'tips']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+lab(P,1.2,-1.6,vA)+vec(P,0,0,-1,4,{color:VB})+lab(P,-1.3,2.2,vB,{anchor:'end'});
  s+=fade(seg(p,.1,.25),dot(P.X(3),P.Y(-2),8,VA)+dot(P.X(-1),P.Y(4),8,VB));
  s+=vec(P,3,-2,-1,4,{color:HI,w:7,g:seg(p,.3,.65)})+fade(seg(p,.55,.7),lab(P,1.5,1.4,cs(HI,'\\mathbf{B}-\\mathbf{A}'),{anchor:'start',size:30}));
  s+=card(640,90,510,200,label('𝐀 の先端 → 𝐁 の先端',895,175,{size:32,color:HI,anchor:'middle',weight:700})+label('（同じ根元から描いたとき）',895,235,{size:24,color:C.dim,anchor:'middle'}),seg(p,.4,.55));
  return s;
 },
 [K+'subx']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+vec(P,0,0,-1,4,{color:VB})+vec(P,3,-2,-1,4,{color:HI,w:7})+lab(P,1.5,1.4,cs(HI,'\\mathbf{B}-\\mathbf{A}'),{anchor:'start',size:30});
  s+=fade(seg(p,.25,.45),line(P.X(3),P.Y(-2),P.X(-1),P.Y(-2),{color:CX,w:4,dash:'8 6'})+label('左へ 4',P.X(1),P.Y(-2)+32,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=card(640,90,510,300,T(`${vB}-${vA}`,895,150,{size:42})
   +fade(seg(p,.2,.45),label('x：',700,237,{size:28,color:CX})+T(`${cs(VB,'-1')}-${cs(VA,'3')}=${cs(HI,'-4')}`,920,230,{size:44})),seg(p,0,.1));
  return s;
 },
 [K+'suby']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+vec(P,0,0,-1,4,{color:VB})+vec(P,3,-2,-1,4,{color:HI,w:7})+lab(P,1.5,1.4,cs(HI,'\\mathbf{B}-\\mathbf{A}'),{anchor:'start',size:30});
  s+=line(P.X(3),P.Y(-2),P.X(-1),P.Y(-2),{color:CX,w:4,dash:'8 6'})+label('左へ 4',P.X(1),P.Y(-2)+32,{size:24,color:CX,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),line(P.X(-1),P.Y(-2),P.X(-1),P.Y(4),{color:CY,w:4,dash:'8 6'})+label('上へ 6',P.X(-1)-12,P.Y(1),{size:24,color:CY,anchor:'end',weight:700}));
  s+=card(640,90,510,300,T(`${vB}-${vA}`,895,150,{size:42})
   +label('x：',700,217,{size:28,color:CX})+T(`${cs(VB,'-1')}-${cs(VA,'3')}=${cs(HI,'-4')}`,920,210,{size:40})
   +fade(seg(p,.1,.3),label('y：',700,282,{size:28,color:CY})+T(`${cs(VB,'4')}-(${cs(VA,'-2')})=${cs(HI,'6')}`,920,275,{size:40}))
   +fade(seg(p,.5,.7),T(`=(${cs(HI,'-4')},\\,${cs(HI,'6')})`,895,350,{size:44})));
  return s;
 },
 [K+'subcheck']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+vec(P,0,0,-1,4,{color:VB})+vec(P,3,-2,-1,4,{color:HI,w:7,g:seg(p,.2,.55)});
  s+=fade(seg(p,.55,.7),ring(P.X(-1),P.Y(4),18,{color:HI,w:3}));
  s+=card(640,90,510,300,label('確かめ',895,140,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`(${cs(VA,'3')},\\,${cs(VA,'-2')})+(${cs(HI,'-4')},\\,${cs(HI,'6')})`,895,220,{size:40}))
   +fade(seg(p,.5,.7),T(`=(${cs(VB,'-1')},\\,${cs(VB,'4')})=${vB}`,895,300,{size:44})),seg(p,0,.1));
  return s;
 },
 [K+'dv']:(p)=>{
  let s=card(200,110,800,260,label('速度の変化',600,175,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.55),T(`\\Delta ${cs(C.v,'\\mathbf{v}')}=${cs(C.v,'\\mathbf{v}_2')}-${cs(C.v,'\\mathbf{v}_1')}`,600,265,{size:56})+label('𝐯₁：前の速度　𝐯₂：あとの速度',600,340,{size:26,color:C.v,anchor:'middle'})),seg(p,0,.2));
  s+=fade(seg(p,.6,.8),label('あとの速度 − 前の速度（矢印の引き算）',600,440,{size:28,color:HI,anchor:'middle'}));
  return s;
 },
 [K+'bounce']:(p)=>{
  // ball moving right, hits the wall at x=900, comes back left
  const wx=900,y=230;
  let s=line(wx,110,wx,330,{color:C.dim,w:6});for(let q=110;q<330;q+=22)s+=line(wx,q,wx+16,q+14,{color:C.faint,w:2});
  s+=line(120,y+30,wx,y+30,{color:C.faint,w:2});
  const t=seg(p,.1,.9),bx=t<.5?mix(300,wx-28,t*2):mix(wx-28,380,(t-.5)*2);
  s+=ring(bx,y,28,{color:C.ink,w:3,fill:'#1d2a48'});
  s+=fade(seg(p,.05,.2),arrow(260,140,470,140,{color:C.v,w:6})+label('前 𝐯₁：右向き 3 m/s',260,110,{size:26,color:C.v}));
  s+=fade(seg(p,.55,.7),arrow(700,400,490,400,{color:C.v,w:6})+label('後 𝐯₂：左向き 3 m/s',490,450,{size:26,color:C.v}));
  s+=label('壁',wx+30,360,{size:24,color:C.dim});
  return s;
 },
 [K+'bounce2']:(p)=>{
  let s=vline();
  s+=vrow(0,3,150,cs(C.v,'\\mathbf{v}_1=(3,\\,0)'),'start');
  s+=fade(seg(p,.05,.2),vrow(0,-3,210,cs(C.v,'\\mathbf{v}_2=(-3,\\,0)'),'end'));
  s+=card(80,300,440,180,label('速さだけ',300,350,{size:28,color:C.dim,anchor:'middle'})+T('3-3=0',300,425,{size:48}),seg(p,.05,.25));
  s+=card(600,300,560,180,label('矢印で',880,350,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.7),T(`(-3,0)-(3,0)=${cs(HI,'(-6,\\,0)')}`,880,425,{size:40})),seg(p,.4,.55));
  s+=fade(seg(p,.6,.85),dv(90));
  return s;
 },
 [K+'bounce3']:(p)=>{
  let s=vline();
  s+=fade(.6,vrow(0,3,150,cs(C.v,'\\mathbf{v}_1'),'start')+vrow(0,-3,210,cs(C.v,'\\mathbf{v}_2'),'end'));
  s+=dv(90,cs(HI,'\\Delta\\mathbf{v}=(-6,\\,0)'));
  s+=card(200,300,800,180,label('左向きに 6 m/s 分 変わった',600,360,{size:32,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.45,.65),label('壁がボールを 左へ押した → Δ𝐯 も左向き',600,425,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S4 場所ごとの矢印 =====
 [K+'wind']:(p)=>windMap(p,{main:seg(p,.3,.6),extra:seg(p,.5,.8)}),
 [K+'windread']:(p)=>windMap(p,{hl:seg(p,.45,.6)}),
 [K+'table']:(p)=>windMap(p,{table:seg(p,.2,.45),sel:p}),
 [K+'onearrow']:(p)=>windMap(p,{q:seg(p,.1,.3)}),
 [K+'avgsum']:(p)=>{
  let s=avgTable(p,{rows:[seg(p,.05,.2),seg(p,.15,.3),seg(p,.25,.4),seg(p,.35,.5)],sum:seg(p,.6,.8)});
  return s;
 },
 [K+'avg']:(p)=>{
  let s=avgTable(p,{rows:[1,1,1,1],sum:1,div:seg(p,.05,.3)});
  s+=fade(seg(p,.45,.65),arrow(760,420,760+2*44,420,{color:HI,w:8,head:22})+label('ならした 1 本：右へ 2 m/s',760,470,{size:26,color:HI}));
  return s;
 },
 [K+'lost']:(p)=>windMap(p,{avgGhost:seg(p,.05,.3),valley:seg(p,.5,.7)}),
 [K+'likeavg']:(p)=>{
  let s=card(60,90,520,330,label('微分の回：平均の速さ',320,140,{size:28,color:C.dim,anchor:'middle'})
   +label('100 m ÷ 20 s ＝ 5 m/s',320,215,{size:32,color:C.v,anchor:'middle',weight:700})
   +fade(seg(p,.25,.45),label('途中は 0 m/s も 8 m/s も',320,290,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  s+=card(620,90,520,330,label('今回：平均の風',880,140,{size:28,color:C.dim,anchor:'middle'})
   +T(cs(HI,'(2,\\,0)\\;\\mathrm{m/s}'),880,215,{size:40})
   +fade(seg(p,.25,.45),label('場所ごとは 強い・弱い・逆向き',880,290,{size:28,color:C.ink,anchor:'middle'})),seg(p,.1,.25));
  s+=fade(seg(p,.6,.8),label('ならした 1 本には、場所ごとの違いが残らない',600,480,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'field']:(p)=>{
  let s=card(60,80,520,260,label('固定：全体の平均',320,130,{size:30,color:C.dim,anchor:'middle',weight:700})
   +arrow(250,230,250+2*44,230,{color:HI,w:8,head:22})+label('1 本だけ',320,300,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  s+=card(620,80,520,260,label('変化：場所ごとの値',880,130,{size:30,color:C.ink,anchor:'middle',weight:700})
   +miniField(880,225)+label('場所ごとに 1 本ずつ',880,320,{size:26,color:C.ink,anchor:'middle'}),seg(p,.15,.3));
  s+=fade(seg(p,.55,.75),card(260,370,680,110,label('場所ごとに矢印を割り当てた地図 ＝ 場',600,437,{size:34,color:HI,anchor:'middle',weight:700}),1,HI));
  return s;
 },
 // ===== S5 まとめ・次の問い =====
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('足し算・引き算は 成分ごと',600,170,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.2));
  s+=card(110,230,980,110,T(`${vA}+${vB}=(2,\\,2)\\qquad ${vB}-${vA}=(-4,\\,6)`,600,285,{size:44}),seg(p,.4,.6));
  return s;
 },
 [K+'summary2']:(p)=>{
  let s=label('まとめ',600,70,{size:30,color:C.dim,anchor:'middle'});
  s+=card(110,100,980,110,label('足し算・引き算は 成分ごと',600,170,{size:34,color:C.ink,anchor:'middle',weight:700}));
  s+=card(110,230,980,110,T(`${vA}+${vB}=(2,\\,2)\\qquad ${vB}-${vA}=(-4,\\,6)`,600,285,{size:44}));
  s+=card(110,360,980,110,label('場所ごとに違う矢印 → 1本にならさず、場として読む',600,427,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(150,100,900,170,label('電気の世界の 矢印の地図',600,165,{size:34,color:C.ink,anchor:'middle'})
   +label('その矢印は 何を表す？',600,230,{size:40,color:HI,anchor:'middle',weight:700}),seg(p,.3,.5),HI);
  // a charge with outward arrows (no meaning given yet)
  const cx=600,cy=400,g=seg(p,.05,.3);
  let f=ring(cx,cy,22,{color:C.a,w:3,fill:'#3a1d2a'})+label('＋',cx,cy+9,{size:26,color:C.a,anchor:'middle',weight:700});
  for(let i=0;i<10;i++){const a=i*Math.PI/5,r1=40,r2=r1+50;f+=arrow(cx+r1*Math.cos(a),cy-r1*Math.sin(a)*.9,cx+r2*Math.cos(a),cy-r2*Math.sin(a)*.9,{color:C.x,w:3,head:12});}
  s+=fade(g,f);
  return s;
 },
};

// ---- wind map ------------------------------------------------------------------------
const SPOTS=[{n:'海',x:180,y:300,v:[5,1]},{n:'平野',x:450,y:250,v:[3,1]},{n:'山かげ',x:700,y:330,v:[1,0]},{n:'谷',x:920,y:300,v:[-1,-2]}];
const S_=34;// px per m/s
function terrain(){
 let s=rect(40,90,280,380,{fill:'#1b3a66',fo:.55,stroke:'none',rx:18});
 s+=poly([[560,380],[640,170],[720,380]],{fill:'#3a4a3a',fo:.8,stroke:'#6f8a6f',sw:2});// mountain west of 山かげ
 s+=poly([[820,420],[880,360],[980,360],[1040,420]],{fill:'#2c3a2c',fo:.7,stroke:'#5a6f5a',sw:2});
 return s;
}
function windArrow(sp,{color=W_,w=5,g=1,opacity=1}={}){
 const [a,b]=sp.v;return arrow(sp.x,sp.y,sp.x+a*S_,sp.y-b*S_,{color,w,g,head:16,opacity});
}
function windMap(p,{main=1,extra=1,hl=0,table=0,sel=0,q=0,avgGhost=0,valley=0}={}){
 let s=terrain();
 // faint background arrows so it reads as a map with arrows everywhere
 const bg=[[120,160,4,0],[260,200,5,.5],[380,160,3.5,1],[520,440,2,.5],[800,180,1.5,-.5],[1080,200,.5,-1.5],[1080,430,-.5,-1.5],[300,430,4.5,1]];
 s+=fade(extra*.5,bg.map(([x,y,a,b])=>arrow(x,y,x+a*S_*.8,y-b*S_*.8,{color:C.dim,w:3,head:12})).join(''));
 SPOTS.forEach((sp,i)=>{
  const on=hl&&(i===0||i===2);
  s+=fade(main,dot(sp.x,sp.y,7,C.ink)+windArrow(sp,{color:on?HI:W_,w:on?7:5})+(sp.n==='谷'?label(sp.n,sp.x+18,sp.y-6,{size:24,color:C.ink}):label(sp.n,sp.x,sp.y+36,{size:24,color:C.ink,anchor:'middle'})));
 });
 if(hl)s+=fade(hl,label('長い（強い）',SPOTS[0].x+20,SPOTS[0].y-50,{size:24,color:HI})+label('短い（弱い）',SPOTS[2].x-10,SPOTS[2].y-40,{size:24,color:HI}));
 if(table){const k=Math.min(3,Math.floor(sel*4)),sp=SPOTS[k];
  s+=fade(table,ring(sp.x,sp.y,22,{color:HI,w:3})+card(740,90,420,110,label('場所 → 矢印 1 本',950,140,{size:30,color:HI,anchor:'middle',weight:700})
   +label(`${sp.n}：(${sp.v.map(v=>String(v).replace('-','−')).join(', ')}) m/s`,950,182,{size:24,color:C.ink,anchor:'middle'})));}
 if(q)s+=fade(q,card(700,90,460,100,label('全体を 矢印 1 本で？',930,152,{size:32,color:HI,anchor:'middle',weight:700}),1,HI));
 if(avgGhost)SPOTS.forEach(sp=>{s+=fade(avgGhost,arrow(sp.x,sp.y+4,sp.x+2*S_,sp.y+4,{color:HI,w:4,head:14,opacity:.8}));});
 if(avgGhost)s+=fade(avgGhost,card(700,90,460,100,label('平均 (2, 0) と同じ場所は ない',930,152,{size:28,color:HI,anchor:'middle',weight:700}),1,HI));
 if(valley)s+=fade(valley,ring(SPOTS[3].x-16,SPOTS[3].y+34,40,{color:C.a,w:3})+label('左下へ',SPOTS[3].x-80,SPOTS[3].y+100,{size:26,color:C.a,weight:700}));
 return s;
}
function avgTable(p,{rows,sum=0,div=0}){
 let s=label('4か所の風（m/s）',120,80,{size:26,color:C.dim});
 SPOTS.forEach((sp,i)=>{const y=140+i*62;
  s+=fade(rows[i],label(sp.n,140,y,{size:28,color:C.ink})+T(`(${sp.v.map(String).join(',\\,')})`,380,y-8,{size:36})+arrow(500,y-10,500+sp.v[0]*22,y-10-sp.v[1]*22,{color:W_,w:4,head:12}));});
 s+=fade(sum,line(120,395,560,395,{color:C.dim,w:2})+label('和',140,440,{size:28,color:C.ink})+T(`(${cs(CX,'8')},\\,${cs(CY,'0')})`,380,432,{size:38}));
 s+=fade(sum,card(640,110,520,200,label('x：5＋3＋1−1 ＝ 8',900,180,{size:28,color:CX,anchor:'middle'})+label('y：1＋1＋0−2 ＝ 0',900,240,{size:28,color:CY,anchor:'middle'})));
 s+=fade(div,T(`(8,\\,0)\\div4=${cs(HI,'(2,\\,0)')}`,900,370,{size:44}));
 return s;
}
function miniField(cx,cy){
 let s='';const pts=[[-160,-40,2.2,.4],[-80,-40,1.6,.6],[0,-40,1,.2],[80,-40,.4,-.6],[160,-40,-.3,-1],[-160,20,2.5,.6],[-80,20,1.8,.3],[0,20,.8,0],[80,20,.2,-.8],[160,20,-.4,-1.2]];
 pts.forEach(([x,y,a,b])=>{s+=arrow(cx+x-15,cy+y,cx+x-15+a*20,cy+y-b*20,{color:W_,w:3,head:10});});
 return s;
}

// ---- velocity rows for the bounce (x component only, m/s) -------------------------------
const VX=u=>600+u*55;
function vline(){let s='';for(let u=-6;u<=6;u++){s+=line(VX(u),255,VX(u),265,{color:C.dim})+(u?label(String(u).replace('-','−'),VX(u),292,{size:20,color:C.dim,anchor:'middle'}):'');}
 return s+arrow(VX(-6.6),260,VX(6.8),260,{color:C.dim,w:2,head:12})+label('0',VX(0),292,{size:20,color:C.dim,anchor:'middle'})+label('[m/s]',VX(6.9),250,{size:20,color:C.dim})+line(VX(0),110,VX(0),265,{color:C.faint,w:2,dash:'5 5'});}
function vrow(a,b,y,t,side){return arrow(VX(a),y,VX(b),y,{color:C.v,w:6})+T(t,side==='start'?VX(b)+16:VX(b)-16,y+10,{size:28,anchor:side});}
// Δv: from the tip of v前 (x=3) to the tip of v後 (x=−3)
function dv(y,t=cs(HI,'\\Delta\\mathbf{v}')){return line(VX(3),y,VX(3),150,{color:HI,w:2,dash:'4 5'})+line(VX(-3),y,VX(-3),210,{color:HI,w:2,dash:'4 5'})+arrow(VX(3),y,VX(-3),y,{color:HI,w:6})+T(t,VX(0),y-24,{size:30});}
function plane2(){return plane(G);}
Object.assign(ytUiVectorMap2Diagrams,{
 [K+'addq']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,1,2,{color:VA,g:seg(p,.05,.25)})+vec(P,1,2,4,1,{color:VB,g:seg(p,.25,.45)})+fade(seg(p,.45,.6),label('？',P.X(4)+14,P.Y(1)-8,{size:36,color:HI,weight:700}));
  s+=card(640,110,510,200,label('練習',895,160,{size:28,color:C.dim,anchor:'middle'})+T(`(${cs(VA,'1')},\\,${cs(VA,'2')})+(${cs(VB,'3')},\\,${cs(VB,'-1')})=\\;?`,895,235,{size:44}),seg(p,0,.15),HI);
  return s;
 },
 [K+'adda']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,1,2,{color:VA})+vec(P,1,2,4,1,{color:VB})+vec(P,0,0,4,1,{color:HI,w:7,g:seg(p,.55,.8)});
  s+=card(640,110,510,280,label('練習',895,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.25),label('x：1＋3 ＝ 4',895,220,{size:30,color:CX,anchor:'middle'}))
   +fade(seg(p,.25,.45),label('y：2＋(−1) ＝ 1',895,270,{size:30,color:CY,anchor:'middle'}))
   +fade(seg(p,.55,.75),T(cs(HI,'(4,\\,1)'),895,340,{size:48})),1,HI);
  return s;
 },
 [K+'revsub']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=vec(P,0,0,3,-2)+vec(P,0,0,-1,4,{color:VB})+vec(P,3,-2,-1,4,{color:HI,w:5,opacity:.5});
  s+=vec(P,-1,4,3,-2,{color:C.a,w:6,g:seg(p,.2,.5)})+fade(seg(p,.45,.6),lab(P,1.9,.9,cs(C.a,'\\mathbf{A}-\\mathbf{B}'),{anchor:'start',size:30}));
  s+=card(640,90,510,300,T(`${vA}-${vB}`,895,150,{size:42})
   +fade(seg(p,.4,.6),T(`=(3-(-1),\\;-2-4)`,895,230,{size:38}))
   +fade(seg(p,.6,.8),T(cs(C.a,'=(4,\\,-6)'),895,310,{size:46})),seg(p,0,.1));
  s+=fade(seg(p,.75,.9),label('𝐁−𝐀 と 逆向き',895,440,{size:28,color:C.a,anchor:'middle',weight:700}));
  return s;
 },
 [K+'bounceq']:(p)=>{
  let s=ytUiVectorMap2Diagrams[K+'bounce'](1);
  s+=card(780,380,380,110,T(`\\Delta${cs(C.v,'\\mathbf{v}')}=0\\;?`,970,445,{size:44}),seg(p,0,.2),HI);
  return s;
 },
 [K+'where']:(p)=>{
  let s=windMap(1,{});
  s+=fade(seg(p,.1,.25),ring(SPOTS[0].x,SPOTS[0].y,22,{color:HI,w:3}));
  s+=card(700,90,460,110,label('場所 ＋ 矢印 を セットで',930,135,{size:28,color:HI,anchor:'middle',weight:700})+label('海の上で (5, 1) m/s',930,180,{size:26,color:C.ink,anchor:'middle'}),seg(p,.2,.4),HI);
  return s;
 },
});

Object.assign(ytUiVectorMap2Diagrams,{
 [K+'dirchange']:(p)=>{
  let s=vline();
  s+=fade(.6,vrow(0,3,150,cs(C.v,'\\mathbf{v}_1'),'start')+vrow(0,-3,210,cs(C.v,'\\mathbf{v}_2'),'end'));
  s+=dv(90,cs(HI,'\\Delta\\mathbf{v}=(-6,\\,0)'));
  s+=card(200,300,800,180,label('速さ 3 → 3（同じ）でも',600,360,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),label('向きの変化 ＝ 速度の変化',600,425,{size:32,color:HI,anchor:'middle',weight:700})),1);
  return s;
 },
});
