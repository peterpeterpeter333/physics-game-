// YouTube シリーズ「内積・初級 3/3」(ys-ui-effective-component-3) — 図。Stage 1200×515.
// 色：力 F・一般の矢印 A 緑、移動 Δr・一般の矢印 B 水色、影 黄、直角な成分 桃、仕事 W 橙、角度 θ 白、負 赤。ベクトルは太字。
import {C,clamp,mix,smooth,seg,fade,move,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,axes,tex} from './anim.mjs';
import {FC,AL,PP,LC,WC,TC,cs,card,cross,check,box,floor,tip,force,comps,angArc,shadow,lamp,dist} from './yt1-ui-effective-component-1-diagrams.mjs';

const K='ui-effective-component-3:';
const FY=420,SC=17,BX=330,TY=FY-50;
const rad=d=>d*Math.PI/180;
const bf=(c,s)=>cs(c,`\\mathbf{${s}}`);
function base(deg,{fN='10 N',arc=true,N=10,sc=SC}={}){return floor(60,700,FY)+box(BX,FY)+force(BX,TY,deg,N,sc,{text:fN})+(arc?angArc(BX,TY,deg,{text:deg>20?'θ':''}):'');}
function lit(deg,{text='',N=10,sc=SC}={}){return lamp(BX-20,BX+200,50)+shadow(BX,TY,deg,N,sc,FY,{text});}
// two arrows from one point: A at angle deg, B along +x; shadow of A on B's line
function pair(ox,oy,deg,{LA=190,LB=260,gs=1,labels=true,shadowA=true,cA=FC,cB=LC,nA='A',nB='B'}={}){
 const ax=ox+LA*Math.cos(rad(deg)),ay=oy-LA*Math.sin(rad(deg)),sx=ox+LA*Math.cos(rad(deg));
 let s=line(ox-LB*.9,oy,ox+LB+40,oy,{color:C.faint,w:2,dash:'6 8'});
 s+=arrow(ox,oy,ox+LB,oy,{color:cB,w:6,head:20});
 if(shadowA){const neg=sx<ox-1;s+=fade(gs,line(ax,ay,sx,oy,{color:C.hi,w:2,dash:'6 6',opacity:.8})+(Math.abs(sx-ox)>2?line(ox,oy,sx,oy,{color:neg?C.a:AL,w:12,cap:'butt'}):dot(ox,oy,7,AL)));}
 s+=arrow(ox,oy,ax,ay,{color:cA,w:6,head:20})+angArc(ox,oy,deg,{r:44,text:deg>25?'θ':''});
 if(labels)s+=tex(bf(cA,nA),ax+(deg>150?-26:deg<10?-10:18),ay-(deg<10?36:8),{size:34,auto:false})+tex(bf(cB,nB),ox+LB+22,oy+8,{size:34,auto:false});
 return s;
}
function dialPanel(cx,cy,deg,val,g=1){
 return fade(g,pair(cx-40,cy,deg,{LA:110,LB:140,labels:true})+label(`${deg}°`,cx,cy+70,{size:28,color:TC,anchor:'middle'})+label(val,cx,cy+115,{size:32,color:deg===180?C.a:WC,anchor:'middle',weight:700}));
}
function dials(k,g){
 const P=[[210,0,'＋AB（最大）'],[600,90,'0'],[990,180,'−AB']];
 let s='';P.forEach(([x,d,v],i)=>{if(i<k)s+=dialPanel(x,270,d,v,i===k-1?g:1);});return s;
}
function steps(k,{x=740,y=100}={}){
 const rows=[['① 分ける','進む向き と 直角な向き'],['② 選ぶ','進む向きの 成分だけ'],['③ 掛ける','× 進んだ距離']];
 let s=rect(x,y,420,300,{fill:'#131f38',fo:.96,stroke:C.faint,rx:14});
 rows.forEach(([a,b],i)=>{const on=i<k,now=i===k-1,yy=y+70+i*85;
  s+=fade(on?1:.3,label(a,x+30,yy,{size:32,color:now?C.hi:C.ink,weight:700})+label(b,x+30,yy+36,{size:24,color:C.dim}));});
 return s;
}
function wrench(p){
 const bx=210,by=300;let s='';
 const hex=Array.from({length:7},(_,i)=>{const a=rad(60*i+30);return [bx+46*Math.cos(a),by+46*Math.sin(a)];});
 s+=draw(hex,1,{color:C.dim,w:4,fill:'#1b2640'})+ring(bx,by,16,{color:C.dim,w:3});
 s+=rect(bx+50,by-18,380,36,{fill:C.dim,fo:.35,stroke:C.dim,rx:10})+label('柄',bx+240,by+60,{size:26,color:C.dim,anchor:'middle'});
 s+=arrow(bx+420,by,bx+420,by-150,{color:FC,w:7,head:22,text:'直角な力',tsize:26,tdx:14,tdy:30,g:seg(p,.1,.35)});
 s+=fade(seg(p,.2,.4),rect(bx+420,by-24,22,22,{fill:'none',fo:0,stroke:C.hi,sw:2,rx:0}));
 s+=fade(seg(p,.3,.5),draw(Array.from({length:30},(_,i)=>{const a=rad(-10-60*i/29);return [bx+120*Math.cos(a),by+120*Math.sin(a)];}),1,{color:C.hi,w:3})+label('回る',bx+130,by-110,{size:26,color:C.hi}));
 return s;
}

export const ytUiEffComp3Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=base(53.13)+lit(53.13,{text:'影 6 N'})+dist(BX,BX+200,FY,{g:0})+label('前回',60,60,{size:24,color:C.dim});
  s+=card(760,130,400,200,label('仕事 ＝ 影 × 距離',960,200,{size:32,color:C.ink,anchor:'middle',weight:700})+tex(`${cs(AL,'6')}\\times${cs(LC,'2')}=${cs(WC,'12\\,\\mathrm{J}')}`,960,285,{size:44,auto:false}),seg(p,.4,.55));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=base(53.13)+lit(53.13,{text:'影'});
  s+=card(720,110,440,260,tex(`${cs(AL,'F\\cos\\theta')}`,940,170,{size:48,auto:false})+label('影の長さ',940,225,{size:24,color:AL,anchor:'middle'})
   +fade(seg(p,.4,.55),tex(`${cs(WC,'W')}=${cs(AL,'F\\cos\\theta')}\\times${cs(LC,'L')}`,940,310,{size:44,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'question']:(p)=>{
  let s=label('今回の問い',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(170,110,860,200,label('「影を取って 掛ける」操作は',600,180,{size:34,color:C.ink,anchor:'middle'})+label('どんな 掛け算？',600,255,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.4,.6),pair(520,440,53.13,{LA:120,LB:170,labels:false}));
  return s;
 },
 // ===== S2 分ける・選ぶ・掛ける =====
 [K+'step1']:(p)=>{
  let s=base(53.13)+comps(BX,TY,53.13,10,SC,{la:'6 N',lp:'直角 8 N',ga:seg(p,.4,.6),gp:seg(p,.5,.7)});
  return s+steps(1);
 },
 [K+'step2']:(p)=>{
  const d=seg(p,.1,.3);
  let s=floor(60,700,FY)+box(BX,FY)+fade(1-.7*d,force(BX,TY,53.13,10,SC,{text:'10 N'}))+comps(BX,TY,53.13,10,SC,{la:'6 N',lp:'直角 8 N',gp:1-.75*d});
  s+=fade(seg(p,.5,.65),cross(BX+240,TY-76,14,PP));
  return s+steps(2);
 },
 [K+'step3']:(p)=>{
  let s=floor(60,700,FY)+box(BX,FY)+fade(.3,force(BX,TY,53.13,10,SC,{text:'10 N'}))+comps(BX,TY,53.13,10,SC,{la:'6 N',gp:.25})+dist(BX,BX+200,FY,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.4,.55),tex(`${cs(AL,'6')}\\times${cs(LC,'2')}=${cs(WC,'12\\,\\mathrm{J}')}`,400,120,{size:44,auto:false}));
  return s+steps(3);
 },
 [K+'formula']:(p)=>{
  let s=tex(`${cs(WC,'W')}=(${cs(FC,'F')}\\,${cs(AL,'\\cos\\theta')})\\,${cs(LC,'L')}`,600,110,{size:66,auto:false});
  s+=fade(seg(p,.15,.3),brace(470,720,160,{text:'影（進む向きの成分）',color:AL,size:26}));
  s+=fade(seg(p,.45,.6),pair(470,440,53.13,{LA:150,LB:230,labels:false})+label('力',470+150*Math.cos(rad(53.13))+14,440-150*Math.sin(rad(53.13)),{size:26,color:FC})+label('進む向き',720,448,{size:26,color:LC}));
  s+=fade(seg(p,.6,.75),label('θ：力と 進む向きの 間の角',760,300,{size:28,color:TC}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=tex(`${cs(WC,'W')}=(${cs(FC,'F')}\\,${cs(AL,'\\cos\\theta')})\\,${cs(LC,'L')}`,600,110,{size:56,auto:false});
  s+=fade(seg(p,.1,.3),tex(`=${cs(FC,'10')}\\times${cs(AL,'0.6')}\\times${cs(LC,'2')}`,600,230,{size:52,auto:false}));
  s+=fade(seg(p,.45,.6),tex(`=${cs(WC,'12\\,\\mathrm{J}')}`,600,340,{size:60,auto:false})+highlight(500,295,200,84,1,WC));
  s+=fade(seg(p,.7,.85),label('前回の 12 J と 一致',600,450,{size:30,color:C.hi,anchor:'middle',weight:700})+check(820,440,18));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=floor(40,720,FY)+box(BX,FY)+force(BX,TY,60,20,8.5,{text:'20 N'})+angArc(BX,TY,60,{text:'60°'});
  s+=dist(BX,BX+300,FY,{text:'3 m'});
  s+=card(760,120,400,200,label('仕事 W は？',960,195,{size:36,color:WC,anchor:'middle',weight:700})+label('考えてみよう',960,260,{size:26,color:C.hi,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=floor(40,720,FY)+box(BX,FY)+lamp(BX-20,BX+120,50,{text:''})+shadow(BX,TY,60,20,8.5,FY,{text:''})+label('影 10 N',BX+95,FY-12,{size:24,color:AL,weight:700})+force(BX,TY,60,20,8.5,{text:'20 N'})+angArc(BX,TY,60,{text:'60°'});
  s+=dist(BX,BX+300,FY,{text:'3 m'});
  s+=card(740,90,420,300,tex(`${cs(AL,'\\cos 60^\\circ')}=0.5`,950,150,{size:42,auto:false})
   +fade(seg(p,.2,.35),label('影 ＝ 20 × 0.5 ＝ 10 N',950,225,{size:28,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),tex(`${cs(WC,'W')}=${cs(AL,'10')}\\times${cs(LC,'3')}=${cs(WC,'30\\,\\mathrm{J}')}`,950,315,{size:44,auto:false})),seg(p,0,.12));
  return s;
 },
 // ===== S3 内積の定義 =====
 [K+'disp']:(p)=>{
  const u=seg(p,.05,.4),bx=mix(300,500,u);
  let s=floor(40,720,FY)+fade(.35,box(300,FY))+box(bx,FY);
  s+=fade(seg(p,.4,.55),arrow(300-65,FY-140,500-65,FY-140,{color:LC,w:7,head:22})+tex(`\\Delta${bf(LC,'r')}`,400-65,FY-170,{size:40,auto:false}));
  s+=card(740,120,420,220,label('移動の 矢印',950,185,{size:30,color:LC,anchor:'middle',weight:700})+label('向き：右',950,240,{size:26,color:C.ink,anchor:'middle'})+label('長さ：L ＝ 2 m',950,290,{size:26,color:C.ink,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'two']:(p)=>{
  let s=pair(200,400,53.13,{shadowA:false,labels:false,LA:200,LB:300});
  s+=tex(bf(FC,'F'),200+200*.6+18,400-200*.8-8,{size:38,auto:false})+tex(`\\Delta${bf(LC,'r')}`,540,408,{size:38,auto:false});
  s+=fade(seg(p,.3,.45),arrow(620,300,720,300,{color:C.dim,w:4,head:16}));
  s+=card(760,190,380,200,label('仕事 W',950,260,{size:32,color:WC,anchor:'middle',weight:700})+label('＝ 一つの 数',950,320,{size:30,color:C.ink,anchor:'middle'}),seg(p,.4,.55),WC);
  s+=fade(seg(p,.05,.2),label('二本の 矢印',300,100,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=pair(170,430,50,{LA:150,LB:220,gs:0,shadowA:false});
  s+=tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,780,160,{size:64,auto:false});
  s+=fade(seg(p,.55,.7),label('内積',780,300,{size:48,color:C.hi,anchor:'middle',weight:700})+label('（二本の矢印 → 一つの数）',780,360,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'defsym']:(p)=>{
  let s=pair(170,430,50,{LA:150,LB:220,gs:0,shadowA:false});
  s+=tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,780,160,{size:64,auto:false});
  s+=fade(seg(p,.05,.2),label('A，B（細字）：矢印の 長さ',560,290,{size:28,color:C.ink}));
  s+=fade(seg(p,.3,.45),label('θ：二本の 間の角',560,345,{size:28,color:TC}));
  s+=fade(seg(p,.6,.75),label('・ は「ドット」と 読む',560,400,{size:28,color:C.hi}));
  return s;
 },
 [K+'read1']:(p)=>{
  const ox=150,oy=400,LA=230,deg=50,sx=ox+LA*Math.cos(rad(deg));
  let s=pair(ox,oy,deg,{LA,LB:330,gs:seg(p,.1,.35)});
  s+=fade(seg(p,.1,.3),lamp(ox+40,ox+200,60,{text:''}));
  s+=fade(seg(p,.3,.45),label('A cosθ（影）',(ox+sx)/2,oy+44,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=card(640,110,520,260,label('読み方①',900,160,{size:26,color:C.dim,anchor:'middle'})
   +tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=(${cs(AL,'A\\cos\\theta')})\\times${cs(LC,'B')}`,900,240,{size:44,auto:false})
   +fade(seg(p,.55,.7),label('影の長さ × B の長さ',900,320,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'sym']:(p)=>{
  // B's shadow on A's line
  const ox=150,oy=400,LA=230,LB=330,deg=50,u=[Math.cos(rad(deg)),-Math.sin(rad(deg))],k=LB*Math.cos(rad(deg));
  const px=ox+k*u[0],py=oy+k*u[1];
  let s=pair(ox,oy,deg,{LA,LB,shadowA:false});
  s+=line(ox-40*u[0],oy-40*u[1],ox+300*u[0],oy+300*u[1],{color:C.faint,w:2,dash:'6 8'});
  s+=fade(seg(p,.1,.3),line(ox+LB,oy,px,py,{color:C.hi,w:2,dash:'6 6'})+line(ox,oy,px,py,{color:AL,w:12,cap:'butt',opacity:.85})+label('B cosθ',(ox+px)/2-24,(oy+py)/2,{size:26,color:AL,anchor:'end',weight:700}));
  s+=card(640,110,520,260,label('どちらの影でも 同じ',900,160,{size:26,color:C.dim,anchor:'middle'})
   +tex(`${cs(FC,'A')}\\times(${cs(AL,'B\\cos\\theta')})=(${cs(AL,'A\\cos\\theta')})\\times${cs(LC,'B')}`,900,245,{size:38,auto:false})
   +fade(seg(p,.55,.7),label('＝ A B cosθ',900,320,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45));
  return s;
 },
 [K+'numex']:(p)=>{
  let s=pair(170,400,60,{LA:180,LB:240,gs:seg(p,.3,.5)})+label('長さ 3',170+90*.5-24,400-90*.866,{size:26,color:FC,anchor:'end'})+label('長さ 4',290,440,{size:26,color:LC,anchor:'middle'});
  s+=card(620,110,540,280,tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(FC,'3')}\\times${cs(LC,'4')}\\times\\cos60^\\circ`,890,180,{size:40,auto:false})
   +fade(seg(p,.35,.5),tex(`=${cs(FC,'3')}\\times${cs(LC,'4')}\\times${cs(AL,'0.5')}`,890,270,{size:40,auto:false}))
   +fade(seg(p,.6,.75),tex(`=6`,890,350,{size:52,auto:false})),seg(p,0,.15));
  return s;
 },
 [K+'work']:(p)=>{
  let s=tex(`${cs(WC,'W')}=${bf(FC,'F')}\\cdot\\Delta${bf(LC,'r')}`,600,130,{size:72,auto:false});
  s+=fade(seg(p,.4,.55),tex(`=${cs(FC,'F')}\\,${cs(AL,'\\cos\\theta')}\\times${cs(LC,'L')}`,640,270,{size:56,auto:false}));
  s+=fade(seg(p,.6,.75),label('中身は 同じ計算（影 × 距離）',600,390,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'scalar']:(p)=>{
  let s=tex(`${cs(WC,'W')}=${bf(FC,'F')}\\cdot\\Delta${bf(LC,'r')}`,600,130,{size:60,auto:false});
  s+=fade(seg(p,.05,.2),tex(`\\mathrm{N}\\times\\mathrm{m}=\\mathrm{J}`,600,240,{size:48,auto:false})+label('単位',380,250,{size:26,color:C.dim,anchor:'end'}));
  s+=fade(seg(p,.4,.55),card(260,300,680,140,label('答え：向きのない ただの数',600,360,{size:34,color:WC,anchor:'middle',weight:700})+label('（スカラー。矢印では ない）',600,410,{size:26,color:C.dim,anchor:'middle'}),1,WC));
  return s;
 },
 [K+'comp']:(p)=>{
  // grid with F = (6, 8) and Δr = (2, 0); 1 unit = 28 px
  const ox=110,oy=440,u=28;let s='';
  for(let i=0;i<=9;i++)s+=line(ox+i*u,oy,ox+i*u,oy-9*u,{color:C.grid,w:1.5})+line(ox,oy-i*u,ox+9*u,oy-i*u,{color:C.grid,w:1.5});
  s+=arrow(ox,oy,ox+6*u,oy-8*u,{color:FC,w:6,head:18})+tex(`${bf(FC,'F')}=(${cs(AL,'6')},${cs(PP,'8')})`,ox+6*u+10,oy-8*u-24,{size:30,auto:false,anchor:'start'});
  s+=arrow(ox,oy,ox+2*u,oy,{color:LC,w:7,head:14})+tex(`\\Delta${bf(LC,'r')}=(${cs(AL,'2')},${cs(PP,'0')})`,ox+2*u+10,oy+36,{size:30,auto:false,anchor:'start'});
  s+=card(520,110,640,300,label('右どうし ＋ 上どうし',840,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),tex(`${cs(AL,'6\\times2')}+${cs(PP,'8\\times0')}`,840,250,{size:52,auto:false}))
   +fade(seg(p,.55,.7),tex(`=12+0=${cs(WC,'12\\,\\mathrm{J}')}`,840,340,{size:50,auto:false})),seg(p,.1,.25));
  return s;
 },
 [K+'compnote']:(p)=>{
  let s=tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(AL,'A_xB_x')}+${cs(PP,'A_yB_y')}`,600,140,{size:64,auto:false});
  s+=fade(seg(p,.1,.25),label('同じ向きの 成分どうしを 掛けて 足す',600,270,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('なぜ この形になるか → 中級で 導く',600,370,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ===== S4 同じ向き度 =====
 [K+'read2']:(p)=>{
  let s=card(200,90,800,170,label('読み方②',600,145,{size:26,color:C.dim,anchor:'middle'})+label('二本が どれだけ 同じ向きか の 点数',600,210,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  return s;
 },
 [K+'par']:(p)=>dials(1,seg(p,0,.2))+fade(seg(p,.4,.55),tex(`\\cos 0^\\circ=1`,210,470,{size:34,auto:false})),
 [K+'perp']:(p)=>dials(2,seg(p,0,.2))+tex(`\\cos 0^\\circ=1`,210,470,{size:34,auto:false})+fade(seg(p,.3,.45),tex(`\\cos 90^\\circ=0`,600,470,{size:34,auto:false})),
 [K+'anti']:(p)=>dials(3,seg(p,0,.2))+tex(`\\cos 0^\\circ=1`,210,470,{size:34,auto:false})+tex(`\\cos 90^\\circ=0`,600,470,{size:34,auto:false})+fade(seg(p,.45,.6),tex(`\\cos 180^\\circ=-1`,990,470,{size:34,auto:false})),
 [K+'obtuse']:(p)=>{
  let s=pair(360,330,120,{LA:190,LB:240,gs:seg(p,.1,.3)});
  s+=fade(seg(p,.3,.45),label('影は 反対側',360-95,380,{size:26,color:C.a,anchor:'middle',weight:700}));
  s+=card(720,120,440,220,label('θ ＝ 120°',940,180,{size:30,color:TC,anchor:'middle'})+fade(seg(p,.5,.65),tex(`\\cos120^\\circ=-0.5`,940,265,{size:44,auto:false,color:C.a})),seg(p,0,.15));
  return s;
 },
 [K+'dial']:(p)=>{
  const deg=180*seg(p,.05,.85);
  let s=pair(260,300,deg,{LA:150,LB:180});
  const A=axes({x:620,y:300,w:480,h:200,xmin:0,xmax:180,ymin:-1,ymax:1,xticks:[90,180],yticks:[-1,1],grid:true,xlabel:'θ [°]',ylabel:'内積 ÷ AB',xcolor:TC,ycolor:WC});
  s+=A.svg+A.plot(u=>Math.cos(rad(u)),{from:0,to:Math.max(deg,.5),color:WC,w:5})+dot(A.X(deg),A.Y(Math.cos(rad(deg))),9,C.hi);
  s+=label(`θ ＝ ${Math.round(deg)}°`,260,470,{size:28,color:TC,anchor:'middle'});
  return s;
 },
 [K+'fric']:(p)=>{
  const u=seg(p,.05,.6),bx=mix(300,500,u);
  let s=ground(40,720,FY)+box(bx,FY)+force(bx-130,FY-50,180,3,30,{text:'摩擦 3 N',tdx:-40,tdy:-24});
  for(let x=bx-130;x<bx;x+=16)s+=line(x,FY,x+8,FY-6,{color:C.a,w:2});
  s+=dist(300,500,FY,{g:seg(p,.6,.75)});
  s+=fade(seg(p,.1,.25),arrow(bx-110,FY-140,bx-20,FY-140,{color:C.v,w:4,head:14})+label('すべる',bx-120,FY-132,{size:24,color:C.v,anchor:'end'}));
  return s;
 },
 [K+'fricW']:(p)=>{
  let s=pair(230,300,180,{LA:110,LB:180,labels:false})+tex(bf(FC,'F'),100,285,{size:34,auto:false})+tex(`\\Delta${bf(LC,'r')}`,470,310,{size:34,auto:false})+label('θ ＝ 180°',230,400,{size:28,color:TC,anchor:'middle'});
  s+=card(620,80,540,340,tex(`${cs(WC,'W')}=${cs(FC,'3')}\\times${cs(LC,'2')}\\times\\cos180^\\circ`,890,150,{size:40,auto:false})
   +fade(seg(p,.3,.45),tex(`=${cs(FC,'3')}\\times${cs(LC,'2')}\\times(-1)`,890,240,{size:40,auto:false}))
   +fade(seg(p,.55,.7),tex(`=-6\\,\\mathrm{J}`,890,340,{size:56,auto:false,color:C.a})),seg(p,0,.12));
  return s;
 },
 [K+'fricmiss']:(p)=>{
  let s=card(200,100,800,300,tex(`${cs(FC,'3')}\\times${cs(LC,'2')}=+6\\,\\mathrm{J}`,600,180,{size:52,auto:false})+cross(830,170,16)
   +fade(seg(p,.3,.45),label('逆向きだった ことが 消える',600,260,{size:30,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),tex(`${cs(FC,'3')}\\times${cs(LC,'2')}\\times\\cos180^\\circ=-6\\,\\mathrm{J}`,600,345,{size:44,auto:false})),seg(p,0,.12));
  return s;
 },
 [K+'negmean']:(p)=>{
  let s=tex(`${cs(WC,'W')}=-6\\,\\mathrm{J}`,600,110,{size:60,auto:false});
  s+=card(260,190,680,220,label('負の仕事',600,250,{size:36,color:C.a,anchor:'middle',weight:700})+label('力が 進みを 妨げて',600,310,{size:28,color:C.ink,anchor:'middle'})+label('箱から エネルギーを 奪った',600,360,{size:30,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25),C.a);
  s+=fade(seg(p,.6,.75),label('詳しくは「仕事」の単元',600,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'circle']:(p)=>{
  const cx=300,cy=270,R=170,a=rad(40+60*p),bx=cx+R*Math.cos(a),by=cy-R*Math.sin(a);
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'8 8'})+dot(cx,cy,8,C.dim)+label('上から見た図',60,480,{size:24,color:C.dim});
  s+=line(cx,cy,bx,by,{color:C.dim,w:3})+ring(bx,by,16,{color:C.ink,w:3,fill:'#1d2a48'});
  s+=arrow(bx,by,bx+(cx-bx)*.5,by+(cy-by)*.5,{color:FC,w:6,head:18});
  const tx=-Math.sin(a),ty=-Math.cos(a);s+=arrow(bx,by,bx+tx*110,by+ty*110,{color:C.v,w:5,head:16});
  s+=fade(seg(p,.4,.55),(()=>{const r=18,ux=(cx-bx)/R,uy=(cy-by)/R;return draw([[bx+ux*r,by+uy*r],[bx+ux*r+tx*r,by+uy*r+ty*r],[bx+tx*r,by+ty*r]],1,{color:C.hi,w:2.5});})()+label('直角',bx+30,by+50,{size:24,color:C.hi}));
  s+=card(720,100,440,260,label('なめらかな台',940,150,{size:26,color:C.dim,anchor:'middle'})+label('緑：ひもの力',850,210,{size:28,color:FC})+label('紫：進む向き',850,260,{size:28,color:C.v})+label('いつも 直角',940,325,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'circle2']:(p)=>{
  const cx=300,cy=270,R=170,a=rad(100+60*p),bx=cx+R*Math.cos(a),by=cy-R*Math.sin(a);
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'8 8'})+dot(cx,cy,8,C.dim)+label('上から見た図',60,480,{size:24,color:C.dim});
  s+=line(cx,cy,bx,by,{color:C.dim,w:3})+ring(bx,by,16,{color:C.ink,w:3,fill:'#1d2a48'});
  s+=arrow(bx,by,bx+(cx-bx)*.5,by+(cy-by)*.5,{color:FC,w:6,head:18});
  const tx=-Math.sin(a),ty=-Math.cos(a);s+=arrow(bx,by,bx+tx*110,by+ty*110,{color:C.v,w:5,head:16});
  s+=card(720,100,440,280,tex(`${cs(WC,'W')}=${bf(FC,'F')}\\cdot\\Delta${bf(LC,'r')}=0`,940,170,{size:44,auto:false})
   +fade(seg(p,.3,.45),label('→ 速さは 変わらない',940,270,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S5 次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(120,70,960,190,tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,600,140,{size:56,auto:false})+label('影の長さ × 長さ ／ 答えは 向きのない数',600,225,{size:28,color:C.hi,anchor:'middle'}),seg(p,0,.15));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(120,70,960,190,tex(`${bf(FC,'A')}\\cdot${bf(LC,'B')}=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,600,140,{size:56,auto:false})+label('影の長さ × 長さ ／ 答えは 向きのない数',600,225,{size:28,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,0,.2),label('同じ向き ＋AB',260,330,{size:30,color:WC,anchor:'middle',weight:700})+label('直角 0',600,330,{size:30,color:WC,anchor:'middle',weight:700})+label('逆向き −AB',940,330,{size:30,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),tex(`${cs(WC,'W')}=${bf(FC,'F')}\\cdot\\Delta${bf(LC,'r')}`,600,440,{size:52,auto:false}));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=steps(3,{x:120,y:100});
  s+=fade(seg(p,.35,.5),arrow(580,250,680,250,{color:C.dim,w:4,head:16})+card(720,150,440,200,label('一つの 掛け算',940,210,{size:28,color:C.ink,anchor:'middle'})+tex(`${bf(FC,'F')}\\cdot\\Delta${bf(LC,'r')}`,940,290,{size:56,auto:false}),1,C.hi));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=dialPanel(300,260,90,'内積 0');
  s+=card(620,110,540,240,label('内積：直角 → 0',890,175,{size:30,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.55),label('逆に「直角な部分だけ」が',890,245,{size:30,color:C.hi,anchor:'middle',weight:700})+label('効く 場面は？',890,295,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=wrench(p);
  s+=card(780,110,380,240,label('次の問い',970,160,{size:26,color:C.dim,anchor:'middle'})+label('柄に 直角な力 が 効く',970,225,{size:28,color:C.ink,anchor:'middle'})+label('どんな 掛け算？',970,295,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
};
