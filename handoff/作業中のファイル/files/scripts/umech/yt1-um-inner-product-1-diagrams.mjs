// YouTube シリーズ「内積・中級 1/2」(ys-um-inner-product-1) — 図。Stage 1200×515.
// 色（初級 内積 3/3 に合わせる）：力 𝐅・一般の 𝐀 緑、移動 Δ𝐫・一般の 𝐁 水色、影 黄、仕事 W 橙、角度 θ 白、
// 基本の向き x̂・ŷ 紫、消える項 赤。ベクトルは太字、長さは細字。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth} from './anim.mjs';

const K='um-inner-product-1:';
const FC=C.F,LC=C.x,AL=C.hi,WC=C.E,TC=C.ink,HC=C.v,RC=C.a,PP=C.p;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
// fit TeX into maxW by shrinking
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const rad=d=>d*Math.PI/180;
const bF=cs(FC,'\\mathbf{F}'),bR=`${cs(LC,'\\Delta\\mathbf{r}')}`,bA=cs(FC,'\\mathbf{A}'),bB=cs(LC,'\\mathbf{B}');
const hx=cs(HC,'\\hat{x}'),hy=cs(HC,'\\hat{y}'),hz=cs(HC,'\\hat{z}');
const Ax=cs(FC,'A_x'),Ay=cs(FC,'A_y'),Bx=cs(LC,'B_x'),By=cs(LC,'B_y');
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=16,color=RC)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});

// ---- square grid (data → screen, y up) ----------------------------------------------------
function plane({ox,oy,u,x0,x1,y0,y1,g=1,nums=true,skip=[]}){
 const X=a=>ox+u*a,Y=b=>oy-u*b;let s='';
 for(let a=x0;a<=x1;a++)s+=line(X(a),Y(y0)+u*.3,X(a),Y(y1)-u*.3,{color:C.grid,w:1.5});
 for(let b=y0;b<=y1;b++)s+=line(X(x0)-u*.3,Y(b),X(x1)+u*.3,Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(x0)-u*.3,Y(0),X(x1)+u*.6,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(y0)+u*.3,X(0),Y(y1)-u*.6,{color:C.dim,w:2.5,head:13});
 s+=label('x',X(x1)+u*.6+8,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)+12,Y(y1)-u*.5,{size:24,color:C.dim});
 if(nums){for(let a=x0;a<=x1;a++)if(a&&!skip.includes(a))s+=label(String(a),X(a),Y(0)+28,{size:22,color:C.dim,anchor:'middle'});
  for(let b=y0;b<=y1;b++)if(b)s+=label(String(b),X(0)-10,Y(b)+8,{size:22,color:C.dim,anchor:'end'});}
 return {X,Y,svg:fade(g,s)};
}
const G={ox:110,oy:455,u:64,x0:0,x1:5,y0:0,y1:5};
const vec=(P,a,b,c,d,{color=FC,g=1,w=6,head=20}={})=>arrow(P.X(a),P.Y(b),P.X(c),P.Y(d),{color,g,w,head});
function arcAt(cx,cy,a0,a1,r,{color=TC,w=3,g=1,text='',tsize=26}={}){
 const pts=Array.from({length:31},(_,i)=>{const a=rad(a0+(a1-a0)*i/30);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 const m=rad((a0+a1)/2);
 return fade(g,draw(pts,1,{color,w})+(text?label(text,cx+(r+26)*Math.cos(m),cy-(r+26)*Math.sin(m)+9,{size:tsize,color,anchor:'middle',weight:700}):''));
}
// 𝐅 and Δ𝐫 on the grid
function FR({F=[3,4],R=[2,0],gF=1,gR=1,labF=true,labR=true,nums=true,skip=[],g=1}={}){
 const P=plane({...G,nums,skip,g});let s=P.svg;
 s+=vec(P,0,0,R[0],R[1],{color:LC,g:gR,w:7});
 s+=vec(P,0,0,F[0],F[1],{color:FC,g:gF,w:7});
 if(labF)s+=fade(gF,T(bF,P.X(F[0])+22,P.Y(F[1])+4,{size:36}));
 if(labR)s+=fade(gR,T(bR,P.X(R[0])+30,P.Y(R[1])-20,{size:34}));
 return {P,s};
}
// two arrows from one point: A at angle deg, B along +x; optional shadow of A on B's line
function pair(ox,oy,deg,{LA=190,LB=260,shadowA=true,gs=1,labels=true,nA=bF,nB=bR}={}){
 const ax=ox+LA*Math.cos(rad(deg)),ay=oy-LA*Math.sin(rad(deg));
 let s=line(ox-LB*.9,oy,ox+LB+40,oy,{color:C.faint,w:2,dash:'6 8'});
 s+=arrow(ox,oy,ox+LB,oy,{color:LC,w:6,head:20});
 if(shadowA){const neg=ax<ox-1;s+=fade(gs,line(ax,ay,ax,oy,{color:AL,w:2,dash:'6 6',opacity:.8})+(Math.abs(ax-ox)>2?line(ox,oy,ax,oy,{color:neg?RC:AL,w:12,cap:'butt'}):dot(ox,oy,7,AL)));}
 s+=arrow(ox,oy,ax,ay,{color:FC,w:6,head:20})+(deg>0.5?arcAt(ox,oy,0,deg,44,{text:deg>25?'θ':''}):'');
 if(labels)s+=T(nA,ax+(deg>150?-26:18),ay-8,{size:34})+T(nB,ox+LB+30,oy+10,{size:34});
 return s;
}

// ---- the 2×2 table -----------------------------------------------------------------------
const TX=60,HW=170,CW=250,TY=70,HH=70,RH=105;
const cellX=j=>TX+HW+CW*j,cellY=i=>TY+HH+RH*i;
const cellTex=[[`${Ax}${Bx}\\,(${hx}\\cdot${hx})`,`${Ax}${By}\\,(${hx}\\cdot${hy})`],[`${Ay}${Bx}\\,(${hy}\\cdot${hx})`,`${Ay}${By}\\,(${hy}\\cdot${hy})`]];
const cellVal=[[`${Ax}${Bx}\\times 1`,`${Ax}${By}\\times 0`],[`${Ay}${Bx}\\times 0`,`${Ay}${By}\\times 1`]];
// st[i][j]: 0 plain, 1 highlighted, 2 value 1 shown, 3 killed (0)
function table(st,{g=1,hl=[]}={}){
 let s=rect(TX,TY,HW+2*CW,HH+2*RH,{fill:'#131f38',fo:.96,stroke:C.faint,rx:10});
 s+=line(TX,TY+HH,TX+HW+2*CW,TY+HH,{color:C.faint,w:2})+line(TX,TY+HH+RH,TX+HW+2*CW,TY+HH+RH,{color:C.faint,w:1.5});
 s+=line(TX+HW,TY,TX+HW,TY+HH+2*RH,{color:C.faint,w:2})+line(TX+HW+CW,TY,TX+HW+CW,TY+HH+2*RH,{color:C.faint,w:1.5});
 s+=T('\\cdot',TX+HW/2,TY+HH/2+10,{size:44,color:C.dim});
 s+=T(`${Bx}\\,${hx}`,cellX(0)+CW/2,TY+HH/2+12,{size:36})+T(`${By}\\,${hy}`,cellX(1)+CW/2,TY+HH/2+12,{size:36});
 s+=T(`${Ax}\\,${hx}`,TX+HW/2,cellY(0)+RH/2+12,{size:36})+T(`${Ay}\\,${hy}`,TX+HW/2,cellY(1)+RH/2+12,{size:36});
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){
  const x=cellX(j),y=cellY(i),m=st[i][j],cx=x+CW/2,cy=y+RH/2+12;
  if(m===1||m===2)s+=highlight(x+8,y+8,CW-16,RH-16,1,AL);
  if(m===3)s+=fade(.45,TF(cellVal[i][j],cx,cy,CW-40,32))+cross(cx,cy-10,34,RC);
  else s+=TF(m===2?cellVal[i][j]:cellTex[i][j],cx,cy,CW-30,32);
 }
 return fade(g,s);
}
const TCX=TX+HW+CW; // centre x of the table body
// unit-vector mini picture
function hats(cx,cy,{u=110,g=1,sq=true,labels=true}={}){
 let s=arrow(cx,cy,cx+u,cy,{color:HC,w:7,head:20})+arrow(cx,cy,cx,cy-u,{color:HC,w:7,head:20});
 if(sq)s+=draw([[cx+18,cy],[cx+18,cy-18],[cx,cy-18]],1,{color:C.ink,w:2});
 if(labels)s+=T(hx,cx+u/2,cy+42,{size:40})+T(hy,cx-34,cy-u/2+12,{size:40});
 return fade(g,s);
}

export const ytUmInnerProduct1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const {s:gs}=FR({gF:seg(p,.1,.3),gR:seg(p,.2,.4)});
  let s=gs+label('前回：ベクトル・中級',40,50,{size:24,color:C.dim});
  s+=card(560,120,600,240,label('力と移動の 内積を',860,185,{size:32,color:C.ink,anchor:'middle'})
   +T(`${bF}\\cdot${bR}`,860,255,{size:50})
   +label('角度なしで、成分だけで 計算できる？',860,330,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.3,.5),AL);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=label('初級で見た形',600,70,{size:26,color:C.dim,anchor:'middle'});
  const t1=`${cs(WC,'W')}=${cs(FC,'F')}\\,${cs(LC,'\\Delta r')}\\cos\\theta`,t2=`=${bF}\\cdot${bR}`,w1=texWidth(t1,58,false),w2=texWidth(t2,58,false),x0=600-(w1+w2+16)/2;
  s+=T(t1,x0,170,{size:58,anchor:'start'});
  s+=fade(seg(p,.2,.35),T(t2,x0+w1+16,170,{size:58,anchor:'start'}));
  s+=fade(seg(p,.25,.4),label('内積',x0+w1+16+w2/2,250,{size:30,color:AL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),card(220,310,760,160,
   T(`${bF}\\;\\;${bR}`,380,375,{size:44})+label('太字：矢印',520,382,{size:30,color:C.ink})
   +T(`${cs(FC,'F')}\\;\\;${cs(LC,'\\Delta r')}`,380,440,{size:44})+label('細字：その長さ',520,447,{size:30,color:C.ink})));
  return s;
 },
 [K+'shadow']:(p)=>{
  let s=pair(150,400,53.13,{LA:230,LB:280,gs:seg(p,.1,.35)});
  s+=fade(seg(p,.25,.4),label('F cosθ（影）',150+69,448,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=card(640,110,520,280,T(`${bF}\\cdot${bR}=(${cs(AL,'F\\cos\\theta')})\\times ${cs(LC,'\\Delta r')}`,900,190,{size:40})
   +label('影の長さ × 移動の長さ',900,265,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('答え：向きのない 一つの数',900,340,{size:30,color:AL,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'example']:(p)=>{
  const {P,s:gs}=FR({gF:seg(p,.05,.25),gR:seg(p,.45,.65)});
  let s=gs;
  s+=fade(seg(p,.25,.4),line(P.X(0),P.Y(4),P.X(3),P.Y(4),{color:FC,w:2,dash:'6 6'})+line(P.X(3),P.Y(0),P.X(3),P.Y(4),{color:FC,w:2,dash:'6 6'}));
  s+=card(600,120,560,250,T(`${bF}=(${cs(FC,'3')},\\,${cs(FC,'4')})\\,\\mathrm{N}`,880,190,{size:44})
   +label('右へ 3、上へ 4',880,240,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${bR}=(${cs(LC,'2')},\\,${cs(LC,'0')})\\,\\mathrm{m}`,880,310,{size:44})+label('右へ 2 m',880,355,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'angle']:(p)=>{
  const {P,s:gs}=FR();
  let s=gs;
  // protractor
  const g=seg(p,.35,.55),r=150;let pr=draw(Array.from({length:61},(_,i)=>{const a=rad(95*i/60);return [P.X(0)+r*Math.cos(a),P.Y(0)-r*Math.sin(a)];}),1,{color:C.dim,w:2});
  for(let d=0;d<=90;d+=10)pr+=line(P.X(0)+(r-12)*Math.cos(rad(d)),P.Y(0)-(r-12)*Math.sin(rad(d)),P.X(0)+r*Math.cos(rad(d)),P.Y(0)-r*Math.sin(rad(d)),{color:C.dim,w:2});
  s+=fade(g*.8,pr);
  s+=arcAt(P.X(0),P.Y(0),0,53.13,56,{g:seg(p,.05,.2),text:'θ'});
  s+=card(600,120,560,260,T(`\\cos\\theta`,880,190,{size:48})+label('には 角 θ が要る',880,245,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('θ ＝ ？°　分度器で 測る？',880,320,{size:32,color:AL,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'promise']:(p)=>{
  let s=label('初級 内積 3/3 より',600,80,{size:26,color:C.dim,anchor:'middle'});
  s+=card(220,110,760,200,T(`(${cs(FC,'6')},\\,${cs(FC,'8')})\\cdot(${cs(LC,'2')},\\,${cs(LC,'0')})=${cs(FC,'6')}\\times${cs(LC,'2')}+${cs(FC,'8')}\\times${cs(LC,'0')}=${cs(WC,'12\\,\\mathrm{J}')}`,600,190,{size:42})
   +label('同じ向きの 成分どうしを 掛けて 足す',600,265,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.2));
  s+=fade(seg(p,.4,.55),label('「この形に なる理由は、中級で 導く」',600,380,{size:32,color:AL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('→ 今回',600,450,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'predict']:(p)=>{
  const {s:gs}=FR();
  let s=gs;
  s+=card(580,110,580,300,T(`${cs(FC,'3')}\\times${cs(LC,'2')}+${cs(FC,'4')}\\times${cs(LC,'0')}=6`,870,180,{size:46})
   +label('と',870,235,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(FC,'F')}\\,${cs(LC,'\\Delta r')}\\cos\\theta`,870,295,{size:46})
   +label('一致する？ 予想してみよう',870,370,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.05,.2),AL);
  return s;
 },
 // ===== S2 基本の向きに分けて展開する =====
 [K+'hat']:(p)=>{
  const P=plane({ox:170,oy:430,u:140,x0:0,x1:2,y0:0,y1:2});let s=P.svg;
  s+=vec(P,0,0,1,0,{color:HC,w:8,g:seg(p,.05,.3)})+fade(seg(p,.2,.35),T(hx,P.X(.5),P.Y(0)-24,{size:44}));
  s+=vec(P,0,0,0,1,{color:HC,w:8,g:seg(p,.45,.7)})+fade(seg(p,.6,.75),T(hy,P.X(0)+36,P.Y(.5)+12,{size:44}));
  s+=card(600,130,540,220,fade(seg(p,.1,.3),T(hx,680,205,{size:48})+label('長さ 1、右向き',740,215,{size:30,color:C.ink}))
   +fade(seg(p,.5,.7),T(hy,680,295,{size:48})+label('長さ 1、上向き',740,305,{size:30,color:C.ink})),seg(p,.05,.2));
  return s;
 },
 [K+'buildA']:(p)=>{
  const P=plane(G);let s=P.svg;
  for(let k=0;k<3;k++)s+=vec(P,k,0,k+1,0,{color:HC,w:6,head:16,g:seg(p,.1+.06*k,.2+.06*k)});
  for(let k=0;k<4;k++)s+=vec(P,3,k,3,k+1,{color:HC,w:6,head:16,g:seg(p,.3+.06*k,.4+.06*k)});
  s+=fade(seg(p,.25,.35),label('3 倍',P.X(1.5),P.Y(0)+30,{size:24,color:HC,anchor:'middle',weight:700}))+fade(seg(p,.5,.6),label('4 倍',P.X(3)+14,P.Y(2)+8,{size:24,color:HC,weight:700}));
  s+=vec(P,0,0,3,4,{color:FC,w:7,g:seg(p,.6,.75)})+fade(seg(p,.65,.8),T(bF,P.X(1.2)-30,P.Y(2)-10,{size:36}));
  s+=card(600,120,560,260,T(`${bA}=(${Ax},\\,${Ay})`,880,185,{size:44})
   +T(`=${Ax}\\,${hx}+${Ay}\\,${hy}`,900,265,{size:48})
   +fade(seg(p,.7,.85),label('例：',700,352,{size:28,color:C.dim})+T(`${bF}=${cs(FC,'3')}\\,${hx}+${cs(FC,'4')}\\,${hy}`,900,345,{size:38})),seg(p,0,.15));
  return s;
 },
 [K+'buildB']:(p)=>{
  const {s:gs}=FR();let s=gs;
  s+=card(560,90,600,340,T(`${bA}=${Ax}\\,${hx}+${Ay}\\,${hy}`,860,150,{size:42})
   +T(`${bB}=${Bx}\\,${hx}+${By}\\,${hy}`,860,225,{size:42})
   +fade(seg(p,.45,.6),line(600,265,1120,265,{color:C.faint,w:1.5})
    +T(`${bF}=${cs(FC,'3')}\\,${hx}+${cs(FC,'4')}\\,${hy}`,860,320,{size:40})
    +T(`${bR}=${cs(LC,'2')}\\,${hx}`,860,395,{size:40})),seg(p,0,.15));
  return s;
 },
 [K+'rule']:(p)=>{
  let s=label('内積の 性質（分配法則）',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,105,960,150,T(`${bA}\\cdot(${cs(LC,'\\mathbf{B}_1')}+${cs(LC,'\\mathbf{B}_2')})=${bA}\\cdot${cs(LC,'\\mathbf{B}_1')}+${bA}\\cdot${cs(LC,'\\mathbf{B}_2')}`,600,170,{size:44})
   +label('継ぎ足した矢印との内積 ＝ 一本ずつの内積の 和',600,228,{size:26,color:AL,anchor:'middle'}),seg(p,.05,.25));
  s+=card(120,285,960,150,T(`${bA}\\cdot(k\\,${bB})=k\\,(${bA}\\cdot${bB})`,600,350,{size:44})
   +label('数倍 k は 外に出せる',600,408,{size:26,color:AL,anchor:'middle'}),seg(p,.55,.75));
  s+=fade(seg(p,.8,.95),label('成り立つとして使う（証明は 上級）',600,485,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'rulepic']:(p)=>{
  const O=[110,440],b=25,u=[Math.cos(rad(b)),Math.sin(rad(b))],nrm=[Math.sin(rad(b)),-Math.cos(rad(b))];
  const S=(q)=>[O[0]+q[0],O[1]-q[1]];
  const p1=[270,0],p2=[270,180],s1=p1[0]*u[0]+p1[1]*u[1],s2=p2[0]*u[0]+p2[1]*u[1];
  const onB=(t,off=0)=>S([t*u[0]+off*nrm[0],t*u[1]+off*nrm[1]]);
  let s='';
  // B's line and arrow
  s+=line(...S([-30*u[0],-30*u[1]]),...onB(560),{color:C.faint,w:2,dash:'6 8'});
  s+=arrow(...S([0,0]),...onB(200),{color:LC,w:6,head:20})+T(bB,...(([x,y])=>[x+10,y-30])(onB(200)),{size:34});
  // pieces of A (tip to tail) and A
  s+=arrow(...S([0,0]),...S(p1),{color:HC,w:6,head:18})+label('部品①',...(([x,y])=>[x-140,y+36])(S(p1)),{size:24,color:HC,weight:700});
  s+=arrow(...S(p1),...S(p2),{color:PP,w:6,head:18})+label('部品②',...(([x,y])=>[x+14,y-80])(S(p1)),{size:24,color:PP,weight:700});
  s+=fade(seg(p,.05,.2),arrow(...S([0,0]),...S(p2),{color:FC,w:7,head:20})+T(bA,...(([x,y])=>[x-10,y-24])(S(p2)),{size:36}));
  // drop lines (perpendicular to B)
  const g1=seg(p,.15,.35),g2=seg(p,.3,.5),g3=seg(p,.55,.75);
  s+=fade(g1,line(...S(p1),...onB(s1),{color:AL,w:2,dash:'6 6'})+rect(0,0,0,0));
  s+=fade(g2,line(...S(p2),...onB(s2),{color:AL,w:2,dash:'6 6'}));
  // shadows along B, slightly offset below the line
  s+=fade(g1,line(...onB(0,16),...onB(s1,16),{color:HC,w:10,cap:'butt'}));
  s+=fade(g2,line(...onB(s1,16),...onB(s2,16),{color:PP,w:10,cap:'butt'}));
  s+=fade(g3,line(...onB(0,36),...onB(s2,36),{color:AL,w:10,cap:'butt'}));
  s+=card(700,110,460,300,label('影の 足し算',930,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(g1,label('部品① の影',760,220,{size:28,color:HC,weight:700}))
   +fade(g2,label('＋ 部品② の影',760,270,{size:28,color:PP,weight:700}))
   +fade(g3,label('＝ 𝐀 の影',760,330,{size:32,color:AL,weight:700}))
   +fade(seg(p,.8,.92),label('図で確かめるだけ（証明は上級）',930,390,{size:22,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=T(`${bA}\\cdot${bB}=(${Ax}\\,${hx}+${Ay}\\,${hy})\\cdot(${Bx}\\,${hx}+${By}\\,${hy})`,600,110,{size:50});
  const tx=[`${Ax}${Bx}\\,(${hx}\\cdot${hx})`,`+\\,${Ax}${By}\\,(${hx}\\cdot${hy})`,`+\\,${Ay}${Bx}\\,(${hy}\\cdot${hx})`,`+\\,${Ay}${By}\\,(${hy}\\cdot${hy})`];
  s+=fade(seg(p,.2,.35),T(`=${tx[0]}`,140,250,{size:46,anchor:'start'}));
  s+=fade(seg(p,.35,.5),T(tx[1],600,250,{size:46,anchor:'start'}));
  s+=fade(seg(p,.5,.65),T(tx[2],180,370,{size:46,anchor:'start'}));
  s+=fade(seg(p,.65,.8),T(tx[3],600,370,{size:46,anchor:'start'}));
  s+=fade(seg(p,.8,.92),label('4つの項',600,470,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'table']:(p)=>{
  let s=table([[0,0],[0,0]],{g:seg(p,0,.2)});
  s+=card(820,110,340,240,label('縦：𝐀 の部品',990,175,{size:28,color:FC,anchor:'middle',weight:700})
   +label('横：𝐁 の部品',990,230,{size:28,color:LC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('4つの マス',990,300,{size:30,color:AL,anchor:'middle',weight:700})),seg(p,.2,.35));
  return s;
 },
 [K+'xx']:(p)=>{
  let s=table([[1,0],[0,0]]);
  s+=card(820,90,340,340,hats(870,250,{u:0,labels:false,sq:false})
   +arrow(880,200,1060,200,{color:HC,w:7,head:20})+arrow(880,222,1060,222,{color:HC,w:7,head:20,opacity:.7})
   +label('同じ向き・長さ 1',990,175,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.5),T(`${hx}\\cdot${hx}=1\\times1\\times\\cos0^\\circ`,990,300,{size:34}))
   +fade(seg(p,.6,.78),T(`=1`,990,380,{size:46,color:AL})),seg(p,0,.15));
  return s;
 },
 [K+'yy']:(p)=>{
  let s=table([[2,0],[0,1]]);
  s+=card(820,90,340,340,arrow(960,300,960,150,{color:HC,w:7,head:20})+arrow(985,300,985,150,{color:HC,w:7,head:20,opacity:.7})
   +fade(seg(p,.2,.4),T(`${hy}\\cdot${hy}=1`,990,380,{size:44,color:AL})),seg(p,0,.15));
  return s;
 },
 [K+'xy']:(p)=>{
  const k=seg(p,.55,.7);
  let s=table([[2,k>.5?3:1],[k>.5?3:1,2]]);
  s+=card(820,90,340,360,hats(900,270,{u:130})
   +fade(seg(p,.2,.4),T(`${hx}\\cdot${hy}=\\cos 90^\\circ=0`,990,380,{size:34}))
   +fade(seg(p,.5,.65),label('直角 → 0',990,430,{size:28,color:RC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'result']:(p)=>{
  let s=table([[2,3],[3,2]]);
  s+=fade(seg(p,.1,.3),T(`${bA}\\cdot${bB}=${Ax}${Bx}+${Ay}${By}`,TCX,440,{size:54})+highlight(TCX-260,395,520,80,1,AL));
  s+=card(840,110,320,240,label('残るのは',1000,175,{size:28,color:C.dim,anchor:'middle'})+label('対角線の 2マス',1000,230,{size:32,color:AL,anchor:'middle',weight:700})
   +fade(seg(p,.5,.7),label('同じ軸どうし',1000,295,{size:28,color:C.ink,anchor:'middle'})),seg(p,.3,.45));
  return s;
 },
 [K+'noangle']:(p)=>{
  let s=hats(250,380,{u:190});
  s+=arcAt(250,380,0,90,70,{g:seg(p,.3,.5),text:'90°',color:C.ink});
  s+=fade(seg(p,.1,.3),label('0°：同じ向きどうし',200,470,{size:26,color:C.dim}));
  s+=card(600,120,560,260,label('使った角',880,180,{size:28,color:C.dim,anchor:'middle'})
   +label('0° と 90° だけ',880,245,{size:40,color:AL,anchor:'middle',weight:700})
   +fade(seg(p,.55,.72),label('軸を 直角に取った',880,310,{size:28,color:C.ink,anchor:'middle'})+label('→ 測らずに 分かる',880,352,{size:28,color:C.ink,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'3d']:(p)=>{
  const X0=90,HWd=110,Cw=150,Y0=60,Hh=60,Rh=72,ax=['x','y','z'];
  let s=rect(X0,Y0,HWd+3*Cw,Hh+3*Rh,{fill:'#131f38',fo:.96,stroke:C.faint,rx:10});
  s+=line(X0,Y0+Hh,X0+HWd+3*Cw,Y0+Hh,{color:C.faint,w:2})+line(X0+HWd,Y0,X0+HWd,Y0+Hh+3*Rh,{color:C.faint,w:2});
  for(let j=0;j<3;j++){s+=T(`${cs(LC,`B_${ax[j]}`)}\\,${cs(HC,`\\hat{${ax[j]}}`)}`,X0+HWd+Cw*j+Cw/2,Y0+Hh/2+10,{size:30});
   s+=T(`${cs(FC,`A_${ax[j]}`)}\\,${cs(HC,`\\hat{${ax[j]}}`)}`,X0+HWd/2,Y0+Hh+Rh*j+Rh/2+10,{size:30});}
  const gk=seg(p,.3,.5),gd=seg(p,.5,.7);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const cx=X0+HWd+Cw*j+Cw/2,cy=Y0+Hh+Rh*i+Rh/2+10;
   if(i===j)s+=fade(gd,highlight(cx-Cw/2+6,cy-Rh/2-4,Cw-12,Rh-12,1,AL))+T(`${cs(FC,`A_${ax[i]}`)}${cs(LC,`B_${ax[i]}`)}`,cx,cy,{size:30});
   else s+=fade(1-.6*gk,T('\\cdot',cx,cy,{size:30,color:C.dim}))+fade(gk,label('0',cx,cy+2,{size:28,color:RC,anchor:'middle',weight:700}));}
  s+=fade(seg(p,.72,.88),T(`${bA}\\cdot${bB}=${Ax}${Bx}+${Ay}${By}+${cs(FC,'A_z')}${cs(LC,'B_z')}`,X0+(HWd+3*Cw)/2,440,{size:46}));
  s+=card(740,90,420,280,fade(seg(p,.05,.2),T(hz,800,160,{size:44})+label('が 加わる',840,168,{size:28,color:C.ink}))
   +label('9 マス',950,230,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(gk,label('直角のマス → 0',950,285,{size:28,color:RC,anchor:'middle',weight:700}))
   +fade(gd,label('対角線の 3つが残る',950,335,{size:28,color:AL,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S3 2通りで確かめる =====
 [K+'comp']:(p)=>{
  const {s:gs}=FR();let s=gs;
  s+=card(560,100,600,320,T(`${bF}\\cdot${bR}`,860,165,{size:44})
   +fade(seg(p,.15,.35),T(`=${cs(FC,'3')}\\times${cs(LC,'2')}+${cs(FC,'4')}\\times${cs(LC,'0')}`,860,245,{size:44}))
   +fade(seg(p,.4,.55),T(`=${cs(WC,'6\\,\\mathrm{N\\cdot m}')}=${cs(WC,'6\\,\\mathrm{J}')}`,860,325,{size:44}))
   +fade(seg(p,.6,.75),label('N·m ＝ J（ジュール）',860,390,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'len']:(p)=>{
  const {P,s:gs}=FR();let s=gs;
  s+=fade(seg(p,.05,.2),line(P.X(3),P.Y(0),P.X(3),P.Y(4),{color:PP,w:4,dash:'8 6'})+label('4',P.X(3)+12,P.Y(2)+8,{size:26,color:PP,weight:700})+label('3',P.X(1.5)+30,P.Y(0)-12,{size:26,color:AL,weight:700}));
  s+=card(560,100,600,320,fade(seg(p,.1,.3),T(`${cs(FC,'F')}=\\sqrt{3^2+4^2}=\\sqrt{25}`,860,170,{size:42}))
   +fade(seg(p,.35,.5),T(`=${cs(FC,'5\\,\\mathrm{N}')}`,860,245,{size:46}))
   +fade(seg(p,.6,.78),T(`${cs(LC,'\\Delta r')}=${cs(LC,'2\\,\\mathrm{m}')}`,860,345,{size:46})),seg(p,0,.12));
  return s;
 },
 [K+'cos']:(p)=>{
  const {P,s:gs}=FR({labR:false});let s=gs;
  s+=line(P.X(0),P.Y(0)+1,P.X(3),P.Y(0)+1,{color:AL,w:8,cap:'butt'})+line(P.X(3),P.Y(0),P.X(3),P.Y(4),{color:PP,w:4,dash:'8 6'});
  s+=label('3',P.X(1.5),P.Y(0)-14,{size:28,color:AL,anchor:'middle',weight:700})+label('4',P.X(3)+12,P.Y(2)+8,{size:28,color:PP,weight:700})+label('5',P.X(1.5)-26,P.Y(2)-8,{size:28,color:FC,weight:700});
  s+=draw([[P.X(3)-16,P.Y(0)],[P.X(3)-16,P.Y(0)-16],[P.X(3),P.Y(0)-16]],1,{color:C.ink,w:2});
  s+=arcAt(P.X(0),P.Y(0),0,53.13,50,{text:'θ'});
  s+=card(560,100,600,320,T(`\\cos\\theta=\\dfrac{${cs(AL,'3')}}{${cs(FC,'5')}}`,860,200,{size:50})
   +label('隣の辺 ÷ 斜めの辺',860,285,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.7),T(`=0.6`,860,360,{size:50,color:AL})),seg(p,.05,.2));
  return s;
 },
 [K+'both']:(p)=>{
  let s=label('同じ 𝐅 ＝ (3, 4) N，Δ𝐫 ＝ (2, 0) m',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,110,960,140,label('成分で',200,190,{size:30,color:C.ink})+T(`${cs(FC,'3')}\\times${cs(LC,'2')}+${cs(FC,'4')}\\times${cs(LC,'0')}=${cs(WC,'6\\,\\mathrm{J}')}`,680,188,{size:48}));
  s+=card(120,280,960,140,label('角度で',200,360,{size:30,color:C.ink})+T(`${cs(FC,'5')}\\times${cs(LC,'2')}\\times${cs(AL,'0.6')}=${cs(WC,'6\\,\\mathrm{J}')}`,680,358,{size:48}),seg(p,.05,.25));
  s+=fade(seg(p,.5,.7),highlight(850,130,190,100,1,WC)+highlight(850,300,190,100,1,WC)+check(1110,265,22));
  s+=fade(seg(p,.6,.8),label('一致',1110,320,{size:28,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'map']:(p)=>{
  const {P,s:gs}=FR({nums:true,skip:[1,2,3],labR:false});let s=gs;
  const g=seg(p,.1,.35);
  s+=fade(g,line(P.X(3),P.Y(4),P.X(3),P.Y(0),{color:AL,w:2,dash:'6 6'}));
  s+=fade(g,line(P.X(0),P.Y(0),P.X(3),P.Y(0),{color:AL,w:14,cap:'butt'}));
  s+=vec(P,0,0,2,0,{color:LC,w:6});s+=vec(P,0,0,3,4,{color:FC,w:7});
  s+=fade(seg(p,.3,.5),label('影 ＝ 3',P.X(1.5),P.Y(0)+36,{size:28,color:AL,anchor:'middle',weight:700}));
  s+=card(560,110,600,280,label('移動が x 軸に沿う',860,170,{size:28,color:LC,anchor:'middle'})
   +fade(seg(p,.3,.5),label('影 ＝ x 成分',860,230,{size:32,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),T(`${cs(FC,'5')}\\times${cs(AL,'0.6')}=${cs(AL,'3')}=${cs(FC,'F_x')}`,860,320,{size:46})),seg(p,0,.15));
  return s;
 },
 [K+'shokyu']:(p)=>{
  let s=label('初級の例：𝐅 ＝ (6, 8) N，Δ𝐫 ＝ (2, 0) m',600,70,{size:28,color:C.dim,anchor:'middle'});
  s+=card(120,110,960,140,label('成分で',200,190,{size:30,color:C.ink})+T(`${cs(FC,'6')}\\times${cs(LC,'2')}+${cs(FC,'8')}\\times${cs(LC,'0')}=${cs(WC,'12\\,\\mathrm{J}')}`,680,188,{size:48}),seg(p,.05,.2));
  s+=card(120,280,960,140,label('角度で',200,360,{size:30,color:C.ink})+T(`${cs(FC,'10')}\\times${cs(LC,'2')}\\times${cs(AL,'0.6')}=${cs(WC,'12\\,\\mathrm{J}')}`,680,358,{size:48}),seg(p,.5,.7));
  s+=fade(seg(p,.75,.9),check(1110,265,22));
  return s;
 },
 [K+'quiz']:(p)=>{
  const {s:gs}=FR({F:[2,5],R:[4,1]});let s=gs;
  s+=card(560,110,600,280,T(`${bF}=(2,\\,5)\\,\\mathrm{N}`,860,175,{size:42})+T(`${bR}=(4,\\,1)\\,\\mathrm{m}`,860,245,{size:42})
   +label('仕事 W は？',860,330,{size:34,color:WC,anchor:'middle',weight:700}),seg(p,.05,.2),AL);
  return s;
 },
 [K+'quizans']:(p)=>{
  const {s:gs}=FR({F:[2,5],R:[4,1]});let s=gs;
  s+=card(560,110,600,280,T(`${bF}\\cdot${bR}=${cs(FC,'2')}\\times${cs(LC,'4')}+${cs(FC,'5')}\\times${cs(LC,'1')}`,860,180,{size:40})
   +fade(seg(p,.3,.5),T(`=8+5`,860,260,{size:44}))
   +fade(seg(p,.6,.78),T(`=${cs(WC,'13\\,\\mathrm{J}')}`,860,340,{size:50})),seg(p,0,.12));
  return s;
 },
 [K+'quizangle']:(p)=>{
  const {P,s:gs}=FR({F:[2,5],R:[4,1]});let s=gs;
  s+=arcAt(P.X(0),P.Y(0),14.04,68.2,60,{g:seg(p,.05,.25),text:'約 54°',tsize:24});
  s+=card(560,110,600,280,T(`${bF}\\cdot${bR}=${cs(WC,'13\\,\\mathrm{J}')}`,860,185,{size:46})
   +fade(seg(p,.3,.5),label('角度は 知らなくてよい',860,275,{size:32,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),label('成分だけで 計算できた',860,335,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 // ===== S4 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=T(`${bA}\\cdot${bB}`,250,200,{size:60});
  s+=fade(seg(p,.1,.3),T(`=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,560,200,{size:56})+label('角度で',560,280,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),T(`=${Ax}${Bx}+${Ay}${By}`,930,200,{size:56})+label('成分で',930,280,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('同じ 一つの数の、2通りの 書き方',600,400,{size:34,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=hats(220,390,{u:180});
  s+=card(560,100,600,320,label('成分の式の 理由',860,160,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),T(`${hx}\\cdot${hx}=${hy}\\cdot${hy}=1`,860,240,{size:46}))
   +fade(seg(p,.45,.65),T(`${hx}\\cdot${hy}=0`,860,330,{size:46})+label('直角',1060,338,{size:28,color:RC,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'use']:(p)=>{
  let s='';
  s+=card(100,110,480,280,label('角度が 分かる',340,180,{size:32,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,340,290,{size:52}),seg(p,0,.2));
  s+=card(620,110,480,280,label('成分が 分かる',860,180,{size:32,color:C.ink,anchor:'middle',weight:700})+T(`${Ax}${Bx}+${Ay}${By}`,860,290,{size:52}),seg(p,.4,.6));
  s+=fade(seg(p,.75,.9),label('場面で 使い分ける',600,460,{size:32,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=label('次の問い',600,60,{size:26,color:C.dim,anchor:'middle'});
  const pan=[[200,90,'直角'],[600,180,'逆向き']];
  pan.forEach(([x,d,t],i)=>{s+=fade(seg(p,.05+.15*i,.2+.15*i),pair(x-40,260,d,{LA:110,LB:140,labels:false,shadowA:false})+label(t,x,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('？',x,340,{size:36,color:AL,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.35,.5),label('大きさだけ',1000,120,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'5')}\\times${cs(LC,'2')}`,1000,250,{size:48})+label('？',1000,340,{size:36,color:AL,anchor:'middle',weight:700}));
  s+=card(250,390,700,90,label('成分で 計算すると、いくつ？',600,448,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.55,.7),AL);
  return s;
 },
};
