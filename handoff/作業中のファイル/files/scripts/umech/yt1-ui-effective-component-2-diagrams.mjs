// YouTube シリーズ「内積・初級 2/3」(ys-ui-effective-component-2) — 図。Stage 1200×515.
// 色：力 F 緑、進む向きの成分＝影 黄、直角な成分 桃、距離 L 水色、仕事 W 橙、角度 θ 白（1/3 と共通）。
import {C,clamp,mix,smooth,seg,fade,move,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,axes,tex} from './anim.mjs';
import {FC,AL,PP,LC,WC,TC,cs,card,cross,check,box,floor,tip,force,comps,angArc,shadow,lamp,dist} from './yt1-ui-effective-component-1-diagrams.mjs';

const K='ui-effective-component-2:';
const FY=420,SC=17,BX=330,TY=FY-50;
const rad=d=>d*Math.PI/180;
function base(deg,{fN='10 N',g=1,arc=true}={}){return floor(60,700,FY)+box(BX,FY)+force(BX,TY,deg,10,SC,{text:fN,g})+(arc?angArc(BX,TY,deg,{text:deg>20?'θ':''}):'');}
function lit(deg,{gl=1,gs=1,text=''}={}){return lamp(BX-20,BX+200,50,{g:gl})+shadow(BX,TY,deg,10,SC,FY,{gl,gs,text});}
const osc=(p,a=0,b=.9)=>90*(.5-.5*Math.cos(Math.PI*2*clamp((p-a)/(b-a))));
function mini(cx,fy,deg,title,W,{g=1,shade=1}={}){
 const bx=cx-20,ty=fy-35,s8=11;const [X]=tip(bx,ty,deg,10,s8);
 return fade(g,ground(cx-150,cx+170,fy)+box(bx,fy,{w:90,h:70})+force(bx,ty,deg,10,s8,{w:6})
  +fade(shade,(Math.abs(X-bx)>2?line(bx,fy,X,fy,{color:AL,w:10,cap:'butt'}):dot(bx,fy,6,AL))+line(X,tip(bx,ty,deg,10,s8)[1],X,fy,{color:C.hi,w:2,dash:'5 5',opacity:.7}))
  +label(title,cx,fy-170,{size:28,color:C.ink,anchor:'middle',weight:700})+label(W,cx,fy+60,{size:32,color:WC,anchor:'middle',weight:700}));
}
function graphPanel(p,{deg=null,marks=0}={}){
 const A=axes({x:560,y:450,w:520,h:330,xmax:90,ymax:20,xticks:[30,60,90],yticks:[5,10,15,20],grid:true,xlabel:'θ [°]',ylabel:'仕事 W [J]',xcolor:TC,ycolor:WC});
 let s=A.svg+A.plot(u=>20*Math.cos(rad(u)),{from:0,to:90,p:deg===null?1:deg/90,color:WC,w:5});
 if(deg!==null){const W=20*Math.cos(rad(deg));s+=dot(A.X(deg),A.Y(W),9,C.hi)+line(A.X(deg),A.Y(W),A.X(deg),A.Y(0),{color:C.hi,w:2,dash:'5 5'});}
 if(marks){[[53.13,12,'約53°：12 J'],[60,10,'60°：10 J']].forEach(([d,w,t],i)=>{const g=seg(marks,i*.4,i*.4+.3);s+=fade(g,dot(A.X(d),A.Y(w),9,AL)+label(t,A.X(d)+16,A.Y(w)-14-i*4+(i?28:0),{size:24,color:AL,weight:700}));});}
 return s;
}
function smallScene(deg){
 // small arrow + shadow on the left, for the graph cues
 const fy=400,tx=150,ty=fy-40,sc=13;const [X,Y]=tip(tx,ty,deg,10,sc);
 return ground(60,460,fy)+box(tx,fy,{w:80,h:70})+lamp(tx,tx+130,70,{text:''})+line(X,Y,X,fy,{color:C.hi,w:2,dash:'5 5',opacity:.8})
  +(Math.abs(X-tx)>2?line(tx,fy,X,fy,{color:AL,w:10,cap:'butt'}):dot(tx,fy,6,AL))+force(tx,ty,deg,10,sc,{w:6})+angArc(tx,ty,deg,{r:40})
  +label(`θ ＝ ${Math.round(deg)}°`,260,460,{size:26,color:TC,anchor:'middle'});
}

export const ytUiEffComp2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=base(53.13)+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N',ga:seg(p,.3,.45),gp:seg(p,.4,.55)});
  s+=label('前回',60,60,{size:24,color:C.dim});
  s+=card(720,120,440,180,tex(`${cs(FC,'10\\,\\mathrm{N}')}\\;\\to\\;${cs(AL,'6\\,\\mathrm{N}')}+${cs(PP,'8\\,\\mathrm{N}')}`,940,190,{size:40,auto:false})+label('継ぎ足しに 置き換え',940,260,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'question']:(p)=>{
  let s=base(53.13)+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N'})+dist(BX,BX+200,FY,{g:seg(p,.05,.2)});
  s+=card(720,110,440,220,label('箱を 右へ 進めたのは',940,180,{size:30,color:C.ink,anchor:'middle'})+label('6 N？ それとも 8 N？',940,250,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',940,305,{size:24,color:C.hi,anchor:'middle'}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'clues']:(p)=>{
  let s=label('手がかり（前回）',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=mini(300,330,0,'向きが 揃う','W ＝ F × L',{g:seg(p,.05,.2),shade:0})+mini(880,330,90,'真上に 引く','W ＝ 0',{g:seg(p,.35,.5),shade:0});
  return s;
 },
 // ===== S2 効く成分だけを掛ける =====
 [K+'up8']:(p)=>{
  const dim=seg(p,.05,.2);
  let s=floor(60,700,FY)+box(BX,FY)+fade(1-.75*dim,force(BX,TY,53.13,10,SC,{text:'10 N'}))+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N',ga:1-.7*dim});
  s+=card(720,100,440,280,label('上向き 8 N',940,165,{size:32,color:PP,anchor:'middle',weight:700})+label('＝ 真上に 引くのと 同じ',940,220,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('右へ 進ませる 働き：なし',940,280,{size:26,color:C.ink,anchor:'middle'})+label('仕事 0 J',940,340,{size:34,color:WC,anchor:'middle',weight:700})),seg(p,.1,.25),PP);
  return s;
 },
 [K+'right6']:(p)=>{
  const dim=seg(p,.05,.2);
  let s=floor(60,700,FY)+box(BX,FY)+fade(.25,force(BX,TY,53.13,10,SC,{text:'10 N'}))+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N',gp:1-.7*dim});
  s+=dist(BX,BX+200,FY,{g:seg(p,.3,.45)});
  s+=card(720,100,440,280,label('右向き 6 N',940,165,{size:32,color:AL,anchor:'middle',weight:700})+label('＝ 進む向きに 揃う',940,220,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('力 × 距離 が 使える',940,300,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),AL);
  return s;
 },
 [K+'calc12']:(p)=>{
  let s=floor(60,700,FY)+box(BX,FY)+fade(.25,force(BX,TY,53.13,10,SC,{text:'10 N'}))+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N',gp:.3})+dist(BX,BX+200,FY);
  s+=card(720,80,440,320,tex(`${cs(WC,'W')}=${cs(AL,'6\\,\\mathrm{N}')}\\times${cs(LC,'2\\,\\mathrm{m}')}`,940,160,{size:44,auto:false})
   +fade(seg(p,.35,.5),tex(`=${cs(WC,'12\\,\\mathrm{N\\cdot m}')}`,940,250,{size:44,auto:false}))
   +fade(seg(p,.6,.75),tex(`=${cs(WC,'12\\,\\mathrm{J}')}`,940,340,{size:52,auto:false})),seg(p,0,.12));
  return s;
 },
 [K+'total']:(p)=>{
  let s=floor(60,700,FY)+box(BX,FY)+force(BX,TY,53.13,10,SC,{text:'10 N'})+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N'})+dist(BX,BX+200,FY);
  s+=card(720,80,440,320,label('右 6 N の 仕事',760,150,{size:28,color:AL})+label('12 J',1120,150,{size:30,color:WC,anchor:'end',weight:700})
   +fade(seg(p,.1,.25),label('上 8 N の 仕事',760,210,{size:28,color:PP})+label('0 J',1120,210,{size:30,color:WC,anchor:'end',weight:700}))
   +fade(seg(p,.25,.4),line(760,240,1120,240,{color:C.dim,w:2})+label('合計',760,290,{size:28,color:C.ink})+label('12 J',1120,290,{size:34,color:WC,anchor:'end',weight:700}))
   +fade(seg(p,.6,.75),label('斜めの 10 N の 仕事 ＝ 12 J',940,365,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=tex(`${cs(WC,'W')}=${cs(AL,'F_x')}\\,${cs(LC,'L')}`,600,130,{size:80,auto:false});
  s+=fade(seg(p,.3,.45),tex(cs(AL,'F_x'),310,255,{size:36,auto:false})+label('：力のうち 進む向きに 揃った成分 [N]',340,265,{size:30,color:AL}));
  s+=fade(seg(p,.45,.6),tex(cs(LC,'L'),310,315,{size:36,auto:false})+label('：進んだ距離 [m]',340,325,{size:30,color:LC}));
  s+=fade(seg(p,.7,.85),label('添え字 x ＝ 右向き（進む向き）の印',600,400,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=tex(`${cs(WC,'W')}=${cs(AL,'F_x')}\\,${cs(LC,'L')}`,600,130,{size:80,auto:false});
  s+=fade(.5,tex(cs(AL,'F_x'),310,255,{size:36,auto:false})+label('：力のうち 進む向きに 揃った成分 [N]',340,265,{size:30,color:AL})+tex(cs(LC,'L'),310,315,{size:36,auto:false})+label('：進んだ距離 [m]',340,325,{size:30,color:LC}));
  s+=fade(seg(p,.05,.2),card(300,360,600,120,label('直角な成分',470,412,{size:32,color:PP,anchor:'end',weight:700})+tex(cs(PP,'F_y'),510,402,{size:40,auto:false})+label('は 入らない',550,412,{size:32,color:PP,weight:700})+label('直角な力は 仕事をしない',600,455,{size:26,color:C.ink,anchor:'middle'}),1,PP));
  return s;
 },
 [K+'ifup']:(p)=>{
  // thought experiment: the box moves straight up 2 m
  const u=seg(p,.05,.45),fy=440,bx=330,lift=mix(0,120,u);
  let s=ground(60,700,fy)+fade(.3,box(bx,fy))+move(0,-lift,box(bx,fy)+force(bx,fy-50,53.13,10,SC,{text:'10 N',color:C.faint,w:5})+comps(bx,fy-50,53.13,10,SC,{la:'6 N',lp:'8 N',ga:.35}));
  s+=fade(seg(p,.3,.45),arrow(bx-160,fy-20,bx-160,fy-140,{color:LC,w:4,head:14})+label('上へ 2 m',bx-172,fy-70,{size:26,color:LC,anchor:'end',weight:700}));
  s+=card(740,100,420,280,label('もし 真上に 動いたら',950,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('効くのは 上向き 8 N',950,225,{size:30,color:PP,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),tex(`${cs(WC,'W')}=${cs(PP,'8')}\\times${cs(LC,'2')}=${cs(WC,'16\\,\\mathrm{J}')}`,950,315,{size:44,auto:false})),seg(p,0,.12));
  return s;
 },
 [K+'ifup2']:(p)=>{
  let s=mini(260,330,53.13,'右へ 進む','6 N が 効く',{shade:0})+mini(640,330,53.13,'上へ 進む','8 N が 効く',{shade:0});
  s+=fade(seg(p,.05,.2),arrow(170,420,330,420,{color:LC,w:4,head:14})+arrow(495,400,495,300,{color:LC,w:4,head:14}));
  s+=card(840,130,320,220,label('効く成分は',1000,200,{size:28,color:C.ink,anchor:'middle'})+label('進む向きで',1000,255,{size:32,color:LC,anchor:'middle',weight:700})+label('決まる',1000,305,{size:28,color:C.ink,anchor:'middle'}),seg(p,.35,.5),C.hi);
  return s;
 },
 // ===== S3 矢印の影 =====
 [K+'wrong20']:(p)=>{
  let s=base(53.13)+comps(BX,TY,53.13,10,SC,{la:'右 6 N',lp:'上 8 N'})+dist(BX,BX+200,FY);
  s+=card(720,110,440,200,tex(`${cs(FC,'10')}\\times${cs(LC,'2')}=20\\,\\mathrm{J}`,940,200,{size:48,auto:false})+fade(seg(p,.3,.45),line(790,195,1090,195,{color:C.a,w:5})+cross(1120,150,14))+fade(seg(p,.4,.55),label('間違い',940,280,{size:30,color:C.a,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'toomuch']:(p)=>{
  let s=mini(230,330,0,'まるごと 右向き','20 J',{g:1,shade:0})+mini(620,330,53.13,'斜め','12 J',{shade:0});
  s+=fade(seg(p,.3,.5),card(830,110,330,260,label('斜めで 20 J は',995,175,{size:28,color:C.ink,anchor:'middle'})+label('上 8 N 分まで',995,240,{size:30,color:PP,anchor:'middle',weight:700})+label('数えた 値',995,285,{size:28,color:C.ink,anchor:'middle'})+label('→ 多すぎる',995,335,{size:30,color:C.a,anchor:'middle',weight:700}),1,C.a));
  return s;
 },
 [K+'light']:(p)=>{
  let s=base(53.13)+lit(53.13,{gl:seg(p,.3,.5),gs:seg(p,.55,.75)});
  s+=card(760,140,400,180,label('真上から 光を当てて',960,205,{size:28,color:C.hi,anchor:'middle'})+label('矢印の 影を 床に',960,260,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'shadow6']:(p)=>{
  const [X,Y]=tip(BX,TY,53.13,10,SC);
  let s=base(53.13)+lit(53.13,{text:'影 6 N'});
  s+=fade(seg(p,.05,.3),ring(X,FY,14,{color:C.hi,w:3})+label('影の端',X+26,FY-30,{size:24,color:C.hi}));
  s+=card(760,140,400,180,label('影の長さ',960,205,{size:28,color:C.ink,anchor:'middle'})+label('＝ 右向き成分 6 N',960,265,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.45,.6),AL);
  return s;
 },
 [K+'mapback']:(p)=>{
  let s=base(53.13)+lit(53.13,{text:'影 6 N'})+comps(BX,TY,53.13,10,SC,{ga:seg(p,.35,.55),gp:0});
  s+=card(760,90,400,300,label('光と影 ＝ 図の道具',960,150,{size:28,color:C.hi,anchor:'middle'})
   +fade(seg(p,.3,.45),label('影の長さが 表すのは',960,215,{size:26,color:C.ink,anchor:'middle'})+label('力の 右向き成分',960,265,{size:32,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('＝ 箱を 右へ 進める部分',960,330,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'upshadow']:(p)=>{
  let s=base(53.13,{arc:false})+lit(53.13,{text:'影 6 N'});
  // the 8 N piece alone, lit from above
  const x=590,ty=TY;
  s+=fade(seg(p,.05,.25),arrow(x,ty,x,ty-8*SC,{color:PP,w:7,head:20,text:'上 8 N',tsize:26,tdx:12,tdy:30})+line(x,ty+4,x,FY,{color:C.hi,w:2,dash:'6 6',opacity:.8}));
  s+=fade(seg(p,.35,.5),dot(x,FY,8,AL)+label('影は 点',x,FY+44,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=card(760,140,400,180,label('影が できない',960,205,{size:30,color:PP,anchor:'middle',weight:700})+label('→ 仕事に 入らない',960,265,{size:30,color:C.ink,anchor:'middle'}),seg(p,.55,.7),PP);
  return s;
 },
 [K+'lightdir']:(p)=>{
  let s=base(53.13,{arc:false})+lit(53.13,{text:'影 6 N'});
  s+=fade(seg(p,.05,.2),arrow(BX-230,FY+40,BX-80,FY+40,{color:LC,w:4,head:14})+label('進む向き',BX-155,FY+80,{size:24,color:LC,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),line(BX+280,110,BX+280,FY,{color:C.hi,w:3,dash:'10 8'})+rect(BX+280,FY-24,24,24,{fill:'none',fo:0,stroke:C.hi,sw:2,rx:0})+label('直角',BX+312,FY-30,{size:24,color:C.hi}));
  s+=card(760,140,400,200,label('光は 進む向きに',960,205,{size:28,color:C.ink,anchor:'middle'})+label('直角に 当てる',960,265,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'shadowW']:(p)=>{
  let s=base(53.13,{arc:false})+lit(53.13,{text:'影 6 N'});
  s+=card(760,120,400,240,label('仕事 ＝ 影 × 距離 2 m',960,185,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.35,.5),tex(`${cs(AL,'6')}\\times${cs(LC,'2')}=${cs(WC,'12\\,\\mathrm{J}')}`,960,285,{size:50,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'quiz']:(p)=>{
  const sc=13,deg=Math.acos(5/12)*180/Math.PI;
  let s=floor(60,700,FY)+box(BX,FY)+lamp(BX-20,BX+120,50,{text:''})+shadow(BX,TY,deg,12,sc,FY,{text:''})+label('影 5 N',BX+75,FY-12,{size:24,color:AL,weight:700})+force(BX,TY,deg,12,sc,{text:'12 N'});
  s+=dist(BX,BX+300,FY,{text:'4 m'});
  s+=card(760,120,400,200,label('仕事 W は？',960,195,{size:36,color:WC,anchor:'middle',weight:700})+label('考えてみよう',960,260,{size:26,color:C.hi,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  const sc=13,deg=Math.acos(5/12)*180/Math.PI;
  let s=floor(60,700,FY)+box(BX,FY)+lamp(BX-20,BX+120,50,{text:''})+shadow(BX,TY,deg,12,sc,FY,{text:''})+label('影 5 N',BX+75,FY-12,{size:24,color:AL,weight:700})+force(BX,TY,deg,12,sc,{text:'12 N'});
  s+=dist(BX,BX+300,FY,{text:'4 m'});
  s+=card(760,90,400,300,tex(`${cs(AL,'5')}\\times${cs(LC,'4')}=${cs(WC,'20\\,\\mathrm{J}')}`,930,160,{size:44,auto:false})+check(1110,150,16)
   +fade(seg(p,.45,.6),tex(`${cs(FC,'12')}\\times${cs(LC,'4')}=48\\,\\mathrm{J}`,930,260,{size:40,auto:false})+cross(1110,250,14)+label('影でない 部分まで 数えた',960,340,{size:24,color:C.a,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 // ===== S4 向きを回す =====
 [K+'predict']:(p)=>{
  const deg=osc(p,.1,.95);
  let s=base(deg)+lit(deg);
  s+=card(760,140,400,200,label('右 → 真上 へ 回すと',960,205,{size:28,color:C.ink,anchor:'middle'})+label('影と 仕事は？',960,270,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'deg0']:(p)=>{
  let s=base(0)+lit(0,{text:'影 10 N'});
  s+=card(760,140,400,200,label('θ ＝ 0°',960,200,{size:30,color:TC,anchor:'middle'})+label('影 10 N → 仕事 20 J',960,265,{size:30,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'deg90']:(p)=>{
  const deg=90*seg(p,.02,.55),sh=10*Math.cos(rad(deg));
  let s=base(deg)+lit(deg,{text:`影 ${sh<.05?0:sh.toFixed(1)} N`});
  s+=card(760,140,400,200,label(`θ ＝ ${Math.round(deg)}°`,960,200,{size:30,color:TC,anchor:'middle'})+fade(seg(p,.55,.7),label('影 0 N → 仕事 0 J',960,265,{size:30,color:WC,anchor:'middle',weight:700})));
  return s;
 },
 [K+'q60']:(p)=>{
  let s=base(60)+lit(60,{text:'影 ？'});
  s+=card(760,140,400,200,label('θ ＝ 60°',960,200,{size:30,color:TC,anchor:'middle'})+label('影は いくつ？',960,265,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.6,.75),label('→ 1辺 1 の 正三角形で 調べる',960,390,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'tri']:(p)=>{
  const L=300,x0=250,y0=440,A=[x0,y0],B=[x0+L,y0],T=[x0+L/2,y0-L*Math.sqrt(3)/2];
  let s=ground(150,700,y0)+draw([A,B,T,A],seg(p,.02,.4),{color:C.ink,w:4});
  s+=fade(seg(p,.35,.5),angArc(A[0],A[1],60,{r:44,text:'60°'})+label('1',(A[0]+B[0])/2,y0+40,{size:26,color:C.ink,anchor:'middle'})+label('1',(A[0]+T[0])/2-24,(A[1]+T[1])/2,{size:26,color:C.ink,anchor:'end'})+label('1',(B[0]+T[0])/2+24,(B[1]+T[1])/2,{size:26,color:C.ink}));
  s+=fade(seg(p,.55,.75),line(A[0],A[1],T[0],T[1],{color:FC,w:8})+label('床から 60° 傾いた辺',A[0]+10,T[1]-24,{size:24,color:FC}));
  s+=card(760,140,400,180,label('正三角形',960,205,{size:30,color:C.ink,anchor:'middle',weight:700})+label('角は どれも 60°',960,260,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'half']:(p)=>{
  const L=300,x0=250,y0=440,A=[x0,y0],B=[x0+L,y0],T=[x0+L/2,y0-L*Math.sqrt(3)/2];
  let s=ground(150,700,y0)+draw([A,B,T,A],1,{color:C.faint,w:3})+line(A[0],A[1],T[0],T[1],{color:FC,w:8})+angArc(A[0],A[1],60,{r:44,text:'60°'});
  s+=fade(seg(p,.05,.25),line(T[0],T[1],T[0],y0,{color:C.hi,w:3,dash:'8 6'})+rect(T[0],y0-20,20,20,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
  s+=fade(seg(p,.25,.45),label('0.5',(A[0]+T[0])/2,y0+40,{size:26,color:AL,anchor:'middle',weight:700})+label('0.5',(B[0]+T[0])/2,y0+40,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.75),line(A[0],y0,T[0],y0,{color:AL,w:12,cap:'butt'}));
  s+=card(760,140,400,200,label('長さ 1 の 辺の 影',960,205,{size:28,color:C.ink,anchor:'middle'})+label('＝ 0.5',960,270,{size:40,color:AL,anchor:'middle',weight:700}),seg(p,.6,.75),AL);
  return s;
 },
 [K+'f60']:(p)=>{
  let s=base(60)+lit(60,{text:'影 5 N'});
  s+=card(760,110,400,260,label('影 ＝ 10 × 0.5 ＝ 5 N',960,180,{size:30,color:AL,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),tex(`${cs(WC,'W')}=${cs(AL,'5')}\\times${cs(LC,'2')}=${cs(WC,'10\\,\\mathrm{J}')}`,960,280,{size:44,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'cosdef']:(p)=>{
  const cx=220,cy=420,R=240,th=rad(50),X=cx+R*Math.cos(th),Y=cy-R*Math.sin(th);
  let s=line(cx-30,cy,cx+R+50,cy,{color:C.dim,w:2})+draw(Array.from({length:41},(_,i)=>{const a=rad(95*i/40-2);return [cx+R*Math.cos(a),cy-R*Math.sin(a)];}),1,{color:C.faint,w:2,dash:'8 8'});
  s+=arrow(cx,cy,X,Y,{color:FC,w:6,head:20})+label('長さ 1',(cx+X)/2-20,(cy+Y)/2-10,{size:26,color:FC,anchor:'end'})+angArc(cx,cy,50,{r:50});
  s+=line(X,Y,X,cy,{color:C.hi,w:2,dash:'6 6'})+fade(seg(p,.1,.3),line(cx,cy,X,cy,{color:AL,w:12,cap:'butt'})+label('cosθ',(cx+X)/2,cy+40,{size:30,color:AL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('半径 1 の円：点の 横の位置',X+20,Y-20,{size:24,color:C.dim}));
  s+=card(720,110,440,200,label('長さ 1 の矢印の 影',940,175,{size:28,color:C.ink,anchor:'middle'})+tex(`=${cs(AL,'\\cos\\theta')}`,940,255,{size:52,auto:false}),seg(p,.2,.35),AL);
  return s;
 },
 [K+'cosvals']:(p)=>{
  const rows=[['0°','1','真横'],['60°','0.5','正三角形の半分'],['90°','0','真上'],['約 53°','0.6','6・8・10（6 ÷ 10）']];
  let s=rect(160,70,880,380,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
  s+=label('θ',300,125,{size:28,color:TC,anchor:'middle',weight:700})+label('cosθ（影）',520,125,{size:28,color:AL,anchor:'middle',weight:700})+line(190,145,1010,145,{color:C.faint,w:2});
  rows.forEach(([a,b,c],i)=>{const y=205+i*68,g=i<3?seg(p,i*.15,i*.15+.12):seg(p,.6,.72);
   s+=fade(g,label(a,300,y,{size:30,color:TC,anchor:'middle'})+label(b,520,y,{size:34,color:AL,anchor:'middle',weight:700})+label(c,640,y,{size:24,color:C.dim}));});
  return s;
 },
 [K+'fcos']:(p)=>{
  let s=label('影の長さ',420,160,{size:40,color:AL,anchor:'end',weight:700})+tex(`=${cs(FC,'10')}\\,${cs(AL,'\\cos\\theta')}\\ \\mathrm{[N]}`,440,140,{size:54,auto:false,anchor:'start'});
  s+=fade(seg(p,.4,.55),tex(`${cs(WC,'W')}=${cs(FC,'10')}\\,${cs(AL,'\\cos\\theta')}\\times${cs(LC,'2')}`,600,260,{size:54,auto:false}));
  s+=fade(seg(p,.65,.8),tex(`=${cs(WC,'20\\cos\\theta')}\\ \\mathrm{[J]}`,650,370,{size:58,auto:false})+highlight(470,325,400,90,1,WC));
  return s;
 },
 [K+'graph']:(p)=>{
  const deg=90*seg(p,.1,.85);
  return smallScene(deg)+graphPanel(p,{deg});
 },
 [K+'graphpts']:(p)=>{
  const deg=53.13+(60-53.13)*seg(p,.45,.6);
  return smallScene(deg)+graphPanel(p,{marks:seg(p,.05,.7)})+fade(seg(p,.75,.9),label('仕事 ＝ 影 × 距離',820,80,{size:28,color:C.hi,anchor:'middle',weight:700}));
 },
 [K+'notlinear']:(p)=>{
  const A=axes({x:560,y:450,w:520,h:330,xmax:90,ymax:20,xticks:[30,45,60,90],yticks:[5,10,15,20],grid:true,xlabel:'θ [°]',ylabel:'仕事 W [J]',xcolor:TC,ycolor:WC});
  let s=smallScene(45)+A.svg+A.plot(u=>20*Math.cos(rad(u)),{from:0,to:90,color:WC,w:5});
  s+=fade(seg(p,.05,.2),line(A.X(0),A.Y(20),A.X(90),A.Y(0),{color:C.dim,w:2,dash:'8 6'})+label('直線なら',A.X(30),A.Y(9),{size:22,color:C.dim}));
  s+=fade(seg(p,.25,.4),dot(A.X(45),A.Y(14.14),9,AL)+label('45°：影 約 7.1 N（14.1 J）',A.X(45)+14,A.Y(14.14)-16,{size:22,color:AL,weight:700}));
  s+=fade(seg(p,.6,.75),dot(A.X(60),A.Y(10),9,C.hi)+label('半分は 60°',A.X(60)+30,A.Y(10)-6,{size:24,color:C.hi,weight:700}));
  return s;
 },
 // ===== S5 三つを並べる =====
 [K+'three']:(p)=>mini(200,330,0,'右向き','20 J',{g:seg(p,0,.15)})+mini(600,330,53.13,'斜め','12 J',{g:seg(p,.15,.3)})+mini(1000,330,90,'真上','0 J',{g:seg(p,.3,.45)}),
 [K+'samediff']:(p)=>{
  let s=mini(200,330,0,'右向き','20 J')+mini(600,330,53.13,'斜め','12 J')+mini(1000,330,90,'真上','0 J');
  s+=fade(seg(p,.05,.2),label('同じ：力 10 N・距離 2 m',600,60,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('違う：影の長さ（黄）だけ',600,470,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=card(200,100,800,300,label('仕事 ＝ 影の長さ × 距離',600,200,{size:40,color:AL,anchor:'middle',weight:700})+check(310,190,20)
   +fade(seg(p,.3,.45),label('矢印の長さ × 距離',600,310,{size:32,color:C.dim,anchor:'middle'})+cross(410,300,14)),seg(p,0,.15));
  return s;
 },
 [K+'next']:(p)=>{
  let s=base(53.13,{arc:false})+lit(53.13)+dist(BX,BX+200,FY);
  s+=card(720,100,440,280,label('次の問い',940,150,{size:26,color:C.dim,anchor:'middle'})+label('「影を取って 距離に掛ける」',940,215,{size:28,color:C.ink,anchor:'middle'})
   +label('一つの 掛け算で',940,280,{size:32,color:C.hi,anchor:'middle',weight:700})+label('書けない？',940,330,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
};
