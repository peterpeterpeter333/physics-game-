// YouTube シリーズ「内積・中級 2/2」(ys-um-inner-product-2) — 図。Stage 1200×515.
// 色（内積・中級 1/2 と同じ）：力 𝐅・𝐀 緑、移動 Δ𝐫・d𝐫・𝐁 水色、影 黄、仕事 W 橙、角度 θ 白、負の影・誤り 赤、直角な成分 桃。
// ベクトルは太字、長さは細字。
import {C,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';

const K='um-inner-product-2:';
const FC=C.F,LC=C.x,AL=C.hi,WC=C.E,TC=C.ink,RC=C.a,PP=C.p;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const rad=d=>d*Math.PI/180;
const bF=cs(FC,'\\mathbf{F}'),bR=cs(LC,'\\Delta\\mathbf{r}'),bA=cs(FC,'\\mathbf{A}'),bB=cs(LC,'\\mathbf{B}'),bdr=cs(LC,'d\\mathbf{r}');
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=16,color=RC)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const sq=(x,y,a,s=16,color=C.ink)=>{const u=[Math.cos(rad(a)),-Math.sin(rad(a))],v=[Math.cos(rad(a+90)),-Math.sin(rad(a+90))];return draw([[x+u[0]*s,y+u[1]*s],[x+(u[0]+v[0])*s,y+(u[1]+v[1])*s],[x+v[0]*s,y+v[1]*s]],1,{color,w:2});};

// ---- square grid (data → screen, y up) ----
function plane({ox,oy,u,x0,x1,y0,y1,g=1,nums=true,skip=[]}){
 const X=a=>ox+u*a,Y=b=>oy-u*b;let s='';
 for(let a=x0;a<=x1;a++)s+=line(X(a),Y(y0)+u*.3,X(a),Y(y1)-u*.3,{color:C.grid,w:1.5});
 for(let b=y0;b<=y1;b++)s+=line(X(x0)-u*.3,Y(b),X(x1)+u*.3,Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(x0)-u*.3,Y(0),X(x1)+u*.6,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(y0)+u*.3,X(0),Y(y1)-u*.6,{color:C.dim,w:2.5,head:13});
 s+=label('x',X(x1)+u*.6+8,Y(0)+8,{size:24,color:C.dim})+label('y',X(0)+12,Y(y1)-u*.5,{size:24,color:C.dim});
 if(nums){for(let a=x0;a<=x1;a++)if(a&&!skip.includes(a))s+=label(String(a),X(a),Y(0)+28,{size:22,color:C.dim,anchor:'middle'});
  for(let b=y0;b<=y1;b++)if(b&&!skip.includes('y'+b))s+=label(String(b),X(0)-10,Y(b)+8,{size:22,color:C.dim,anchor:'end'});}
 return {X,Y,svg:fade(g,s)};
}
const G={ox:110,oy:455,u:64,x0:0,x1:5,y0:0,y1:5};
const GW={ox:330,oy:430,u:62,x0:-4,x1:3,y0:0,y1:5}; // wide: left and right
const vec=(P,a,b,c,d,{color=FC,g=1,w=7,head=20}={})=>arrow(P.X(a),P.Y(b),P.X(c),P.Y(d),{color,g,w,head});
function arcAt(cx,cy,a0,a1,r,{color=TC,w=3,g=1,text='',tsize=26,tr=26}={}){
 const pts=Array.from({length:31},(_,i)=>{const a=rad(a0+(a1-a0)*i/30);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 const m=rad((a0+a1)/2);
 return fade(g,draw(pts,1,{color,w})+(text?label(text,cx+(r+tr)*Math.cos(m),cy-(r+tr)*Math.sin(m)+9,{size:tsize,color,anchor:'middle',weight:700}):''));
}
// 𝐅 and Δ𝐫 on a grid
function FR({F=[3,4],R=[2,0],grid=G,gF=1,gR=1,labF=true,labR=true,skip=[],g=1,fl=[22,4],rl=[30,-20]}={}){
 const P=plane({...grid,skip,g});let s=P.svg;
 s+=vec(P,0,0,R[0],R[1],{color:LC,g:gR});
 s+=vec(P,0,0,F[0],F[1],{color:FC,g:gF});
 if(labF)s+=fade(gF,T(bF,P.X(F[0])+fl[0],P.Y(F[1])+fl[1],{size:36}));
 if(labR)s+=fade(gR,T(bR,P.X(R[0])+rl[0],P.Y(R[1])+rl[1],{size:34}));
 return {P,s};
}
// two arrows from one point: A at angle deg, B along +x; shadow of A on B's line (red when negative)
function pair(ox,oy,deg,{LA=190,LB=260,shadowA=true,gs=1,labels=true,nA=bF,nB=bR,theta=true}={}){
 const ax=ox+LA*Math.cos(rad(deg)),ay=oy-LA*Math.sin(rad(deg));
 let s=line(ox-LA-20,oy,ox+LB+40,oy,{color:C.faint,w:2,dash:'6 8'});
 s+=arrow(ox,oy,ox+LB,oy,{color:LC,w:6,head:20});
 if(shadowA){const neg=ax<ox-1;s+=fade(gs,line(ax,ay,ax,oy,{color:AL,w:2,dash:'6 6',opacity:.8})+(Math.abs(ax-ox)>2?line(ox,oy+8,ax,oy+8,{color:neg?RC:AL,w:12,cap:'butt'}):dot(ox,oy,9,AL)));}
 s+=arrow(ox,oy,ax,ay,{color:FC,w:6,head:20})+(theta&&deg>0.5?arcAt(ox,oy,0,deg,40,{text:deg>25?'θ':''}):'');
 if(labels)s+=T(nA,ax+(deg>150?-26:18),ay-8,{size:34})+T(nB,ox+LB+30,oy+10,{size:34});
 return s;
}
function circleScene({cx=330,cy=280,R=190,g=1}={}){
 let s=ring(cx,cy,R,{color:C.faint,w:3,dash:'8 8'});
 s+=dot(cx,cy,7,C.dim)+label('中心',cx-24,cy+34,{size:22,color:C.dim});
 return fade(g,s);
}
const onC=(cx,cy,R,deg)=>[cx+R*Math.cos(rad(deg)),cy-R*Math.sin(rad(deg))];

export const ytUmInnerProduct2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回：内積・中級 1/2',40,50,{size:24,color:C.dim});
  const pan=[[200,90,'直角'],[600,180,'逆向き']];
  pan.forEach(([x,d,t],i)=>{s+=fade(seg(p,.05+.15*i,.2+.15*i),pair(x-40,260,d,{LA:110,LB:140,labels:false,shadowA:false})+label(t,x,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('？',x,340,{size:36,color:AL,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.35,.5),label('大きさだけ',1000,120,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'5')}\\times${cs(LC,'2')}`,1000,250,{size:48})+label('？',1000,340,{size:36,color:AL,anchor:'middle',weight:700}));
  s+=card(250,390,700,90,label('成分で 計算すると、いくつ？',600,448,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.55,.7),AL);
  return s;
 },
 [K+'recall']:(p)=>{
  const t0=`${bA}\\cdot${bB}`,t1=`=${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta`,t2=`=${cs(FC,'A_x')}${cs(LC,'B_x')}+${cs(FC,'A_y')}${cs(LC,'B_y')}`;
  const w0=texWidth(t0,58,false),w1=texWidth(t1,58,false),w2=texWidth(t2,58,false),gap=24,x0=600-(w0+w1+w2+2*gap)/2;
  let s=label('前回 導いたこと',600,80,{size:26,color:C.dim,anchor:'middle'});
  s+=T(t0,x0,200,{size:58,anchor:'start'});
  s+=fade(seg(p,.2,.35),T(t1,x0+w0+gap,200,{size:58,anchor:'start'})+label('角度で',x0+w0+gap+w1/2,280,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),T(t2,x0+w0+w1+2*gap,200,{size:58,anchor:'start'})+label('成分で',x0+w0+w1+2*gap+w2/2,280,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('同じ 一つの数',600,390,{size:34,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'base']:(p)=>{
  const {s:gs}=FR();let s=gs;
  s+=card(560,110,600,280,T(`${bF}=(${cs(FC,'3')},\\,${cs(FC,'4')})\\,\\mathrm{N}`,860,170,{size:40})+T(`${bR}=(${cs(LC,'2')},\\,${cs(LC,'0')})\\,\\mathrm{m}`,860,235,{size:40})
   +T(`${bF}\\cdot${bR}=${cs(WC,'6\\,\\mathrm{J}')}`,860,315,{size:46}),seg(p,0,.15));
  s+=fade(seg(p,.6,.8),label('→ 力の 向きを 変える',860,450,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s='';
  s+=fade(seg(p,.05,.25),pair(220,330,90,{LA:150,LB:180,shadowA:false,theta:false})+label('真上に 向けたら？',300,120,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.65),pair(870,330,180,{LA:150,LB:180,shadowA:false,theta:false})+label('真後ろに 向けたら？',900,120,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('内積は？ 予想してみよう',600,460,{size:32,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S2 直角なら0、逆向きなら負 =====
 [K+'perp']:(p)=>{
  const {s:gs}=FR({F:[0,4],fl:[20,8],gF:seg(p,.05,.3)});let s=gs;
  s+=card(560,110,600,260,T(`${bF}=(${cs(FC,'0')},\\,${cs(FC,'4')})\\,\\mathrm{N}`,860,180,{size:44})+label('真上へ 4 N',860,225,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),T(`${bR}=(${cs(LC,'2')},\\,${cs(LC,'0')})\\,\\mathrm{m}`,860,300,{size:44})+label('右へ 2 m',860,345,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'perpcalc']:(p)=>{
  const {P,s:gs}=FR({F:[0,4],fl:[20,8]});let s=gs;
  s+=fade(seg(p,.55,.7),sq(P.X(0),P.Y(0),0,22));
  s+=card(560,100,600,320,label('成分で',620,165,{size:26,color:C.dim})+T(`${cs(FC,'0')}\\times${cs(LC,'2')}+${cs(FC,'4')}\\times${cs(LC,'0')}=${cs(WC,'0')}`,880,170,{size:44})
   +fade(seg(p,.5,.65),label('角度で',620,275,{size:26,color:C.dim})+T(`${cs(FC,'4')}\\times${cs(LC,'2')}\\times\\cos 90^\\circ`,880,280,{size:42})+T(`=${cs(FC,'4')}\\times${cs(LC,'2')}\\times 0=${cs(WC,'0')}`,880,360,{size:42})),seg(p,0,.12));
  return s;
 },
 [K+'perpmean']:(p)=>{
  const {P,s:gs}=FR({F:[0,4],fl:[20,8]});let s=gs;
  s+=fade(seg(p,.1,.3),dot(P.X(0),P.Y(0),11,AL)+label('影 ＝ 点',P.X(0)+20,P.Y(0)-24,{size:28,color:AL,weight:700}));
  s+=card(560,110,600,280,label('右の向きへの 影',860,170,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.1,.3),label('長さ 0',860,235,{size:40,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.7),label('真上に 引いても、',860,300,{size:28,color:C.ink,anchor:'middle'})+label('右へ 進める 仕事は 0',860,345,{size:30,color:WC,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'anti']:(p)=>{
  const {s:gs}=FR({F:[-3,0],grid:GW,fl:[-10,-24],gF:seg(p,.05,.3),gR:seg(p,.4,.6)});let s=gs;
  s+=card(640,110,520,260,T(`${bF}=(${cs(FC,'-3')},\\,${cs(FC,'0')})\\,\\mathrm{N}`,900,180,{size:44})+label('左へ 3 N',900,225,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),T(`${bR}=(${cs(LC,'2')},\\,${cs(LC,'0')})\\,\\mathrm{m}`,900,300,{size:44})+label('右へ 2 m',900,345,{size:26,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'anticalc']:(p)=>{
  const {s:gs}=FR({F:[-3,0],grid:GW,fl:[-10,-24]});let s=gs;
  s+=card(600,100,560,330,label('成分で',630,165,{size:26,color:C.dim})+T(`${cs(FC,'(-3)')}\\times${cs(LC,'2')}+${cs(FC,'0')}\\times${cs(LC,'0')}`,900,170,{size:40})
   +fade(seg(p,.15,.3),T(`=${cs(WC,'-6\\,\\mathrm{J}')}`,900,235,{size:44}))
   +fade(seg(p,.5,.65),label('角度で',630,310,{size:26,color:C.dim})+T(`${cs(FC,'3')}\\times${cs(LC,'2')}\\times\\cos180^\\circ`,900,315,{size:40})+T(`=${cs(FC,'3')}\\times${cs(LC,'2')}\\times(-1)=${cs(WC,'-6\\,\\mathrm{J}')}`,900,390,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'antimean']:(p)=>{
  let s=pair(360,330,180,{LA:180,LB:120,gs:seg(p,.05,.25),theta:false});
  s+=fade(seg(p,.1,.3),label('影が 反対側に 落ちる',270,400,{size:26,color:RC,anchor:'middle',weight:700}));
  s+=card(640,110,520,280,label('負号 ＝ 逆向きの 印',900,180,{size:34,color:RC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('進みを 妨げる',900,260,{size:30,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.78),label('箱から エネルギーを 奪う',900,320,{size:30,color:WC,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'dial']:(p)=>{
  const th=180*seg(p,.08,.85),v=6*Math.cos(rad(th));
  let s=pair(360,340,th,{LA:180,LB:120,labels:true,theta:th>1});
  s+=card(660,90,500,340,label('𝐅 の大きさ 3 N、Δ𝐫 ＝ (2, 0) m',910,140,{size:24,color:C.dim,anchor:'middle'})
   +T(`\\theta=${Math.round(th)}^\\circ`,910,205,{size:44})
   +T(`${bF}\\cdot${bR}=${cs(WC,(Math.abs(v)<.05?'0':v.toFixed(1)).replace('-','-'))}\\,\\mathrm{J}`,910,280,{size:46})
   +line(700,370,1120,370,{color:C.faint,w:3})+line(910,356,910,384,{color:C.dim,w:2})
   +label('−6',700,410,{size:22,color:RC,anchor:'middle'})+label('0',910,410,{size:22,color:C.dim,anchor:'middle'})+label('6',1120,410,{size:22,color:AL,anchor:'middle'})
   +line(910,370,910+35*v,370,{color:v<0?RC:AL,w:12,cap:'butt'}));
  return s;
 },
 [K+'dial120']:(p)=>{
  let s=pair(360,340,120,{LA:180,LB:120});
  s+=label('θ ＝ 120°',300,110,{size:30,color:TC,anchor:'middle',weight:700});
  s+=card(640,90,520,350,T(`${bF}\\approx(${cs(FC,'-1.5')},\\,${cs(FC,'2.6')})\\,\\mathrm{N}`,900,160,{size:40})
   +fade(seg(p,.4,.55),T(`${bF}\\cdot${bR}=${cs(FC,'(-1.5)')}\\times${cs(LC,'2')}+${cs(FC,'2.6')}\\times${cs(LC,'0')}`,900,240,{size:34}))
   +fade(seg(p,.6,.75),T(`=${cs(WC,'-3\\,\\mathrm{J}')}`,900,310,{size:44}))
   +fade(seg(p,.78,.9),T(`3\\times2\\times\\cos120^\\circ=3\\times2\\times(-0.5)`,900,390,{size:30,color:C.dim})),seg(p,0,.12));
  return s;
 },
 [K+'dialrule']:(p)=>{
  let s='';
  const cols=[[220,60,'90° より 小さい','正',AL],[600,90,'ちょうど 90°','0',TC],[980,150,'90° より 大きい','負',RC]];
  cols.forEach(([x,d,t,sg,col],i)=>{s+=fade(seg(p,.05+.2*i,.2+.2*i),pair(x-60,300,d,{LA:120,LB:130,labels:false,theta:false})+label(t,x,110,{size:28,color:C.ink,anchor:'middle',weight:700})+label(sg,x,400,{size:44,color:col,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.75,.9),label('内積の 符号 → 向きの 関係',600,475,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 大きさだけ掛けると =====
 [K+'trap']:(p)=>{
  const {P,s:gs}=FR({skip:[1]});let s=gs;
  s+=fade(seg(p,.3,.5),label('5',P.X(1.5)-28,P.Y(2)-6,{size:28,color:FC,weight:700})+label('2',P.X(1),P.Y(0)+34,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=card(560,110,600,260,label('大きさだけ 掛けると',860,170,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.7),T(`${cs(FC,'F')}\\,${cs(LC,'\\Delta r')}=${cs(FC,'5')}\\times${cs(LC,'2')}=10\\,\\mathrm{J}`,860,260,{size:46}))
   +fade(seg(p,.8,.92),label('？',860,335,{size:36,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'trapwrong']:(p)=>{
  let s=card(140,110,420,260,label('大きさだけ',350,170,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'5')}\\times${cs(LC,'2')}=10\\,\\mathrm{J}`,350,270,{size:48}));
  s+=card(640,110,420,260,label('内積（正しい）',850,170,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'3')}\\times${cs(LC,'2')}+${cs(FC,'4')}\\times${cs(LC,'0')}=${cs(WC,'6\\,\\mathrm{J}')}`,850,270,{size:40}));
  s+=fade(seg(p,.2,.35),cross(520,145,18)+check(1020,145,18));
  s+=fade(seg(p,.25,.45),label('4 J 大きすぎ',350,340,{size:28,color:RC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('力の 全部が 進む向きに 効く、と 数えてしまった',600,450,{size:30,color:AL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'trapwhen']:(p)=>{
  const P=plane(G);let s=P.svg;
  s+=fade(.35,vec(P,0,0,3,4,{color:FC,w:5}));
  s+=fade(seg(p,.05,.3),arcAt(P.X(0),P.Y(0),53.13,0,5*64,{color:C.dim,w:2}));
  s+=vec(P,0,0,5,0,{color:FC,g:seg(p,.1,.35),w:8})+vec(P,0,0,2,0,{color:LC,w:6});
  s+=fade(seg(p,.3,.45),T(`${bF}=(5,\\,0)`,P.X(3.6),P.Y(0)-44,{size:34}));
  s+=card(560,110,600,280,label('同じ 5 N で 真正面に 押すと',860,170,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.7),T(`${cs(FC,'5')}\\times${cs(LC,'2')}+${cs(FC,'0')}\\times${cs(LC,'0')}=10\\,\\mathrm{J}`,860,260,{size:44}))
   +fade(seg(p,.75,.9),label('10 J は この場合の 値',860,340,{size:30,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'trapmax']:(p)=>{
  let s=T(`${cs(FC,'A')}\\,${cs(LC,'B')}\\cos\\theta\\;\\le\\;${cs(FC,'A')}\\,${cs(LC,'B')}`,600,150,{size:62});
  s+=fade(seg(p,.15,.35),label('＝ になるのは cosθ ＝ 1（向きが ぴたり 揃う）ときだけ',600,240,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.4,.55),label('大きさの積 ＝ 内積の 上限',600,320,{size:36,color:AL,anchor:'middle',weight:700}));
  s+=card(250,370,700,90,label('向きの 情報を 捨てない',600,428,{size:32,color:RC,anchor:'middle',weight:700}),seg(p,.7,.85),RC);
  return s;
 },
 // ===== S4 垂直の判定と、長さ =====
 ...(()=>{
  const GH={ox:130,oy:292,u:46,x0:0,x1:5,y0:-4,y1:5};
  const AB=({gA=1,gB=1,g=1,sqg=0}={})=>{const P=plane({...GH,skip:['y-1','y-2','y-3','y1','y2','y3'],g});let s=P.svg;
   s+=vec(P,0,0,3,4,{color:FC,g:gA})+fade(gA,T(bA,P.X(3)+22,P.Y(4)+4,{size:36}));
   s+=vec(P,0,0,4,-3,{color:LC,g:gB})+fade(gB,T(bB,P.X(4)+24,P.Y(-3)+14,{size:36}));
   s+=fade(sqg,sq(P.X(0),P.Y(0),-36.87,22,AL));
   return {P,s};};
  return {
   [K+'hidden']:(p)=>{
    let {s}=AB({gA:seg(p,.05,.25),gB:seg(p,.3,.5)});
    s+=card(560,110,600,280,T(`${bA}=(${cs(FC,'3')},\\,${cs(FC,'4')})`,860,175,{size:44})+T(`${bB}=(${cs(LC,'4')},\\,${cs(LC,'-3')})`,860,250,{size:44})
     +fade(seg(p,.6,.75),label('直角？',860,335,{size:36,color:AL,anchor:'middle',weight:700})),seg(p,0,.15),AL);
    return s;
   },
   [K+'hiddencalc']:(p)=>{
    let {s}=AB();
    s+=card(560,110,600,280,T(`${bA}\\cdot${bB}=${cs(FC,'3')}\\times${cs(LC,'4')}+${cs(FC,'4')}\\times(${cs(LC,'-3')})`,860,180,{size:40})
     +fade(seg(p,.35,.55),T(`=12-12`,860,260,{size:46}))
     +fade(seg(p,.7,.85),T(`=0`,860,340,{size:52,color:AL})),seg(p,0,.12));
    return s;
   },
   [K+'hiddenmean']:(p)=>{
    let {s}=AB({sqg:seg(p,.3,.5)});
    s+=card(560,110,600,280,label('長さは どちらも 0 でない',860,170,{size:28,color:C.dim,anchor:'middle'})
     +fade(seg(p,.1,.3),T(`\\cos\\theta=0`,860,245,{size:46}))
     +fade(seg(p,.3,.5),label('→ 直角',860,320,{size:36,color:AL,anchor:'middle',weight:700}))
     +fade(seg(p,.6,.8),label('分度器なしで 判定',860,370,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12));
    return s;
   },
   [K+'rotate']:(p)=>{
    const P=plane({...GH,skip:['y-1','y-2','y-3','y1','y2','y3']});let s=P.svg;
    s+=vec(P,0,0,3,4,{color:FC})+T(bA,P.X(3)+22,P.Y(4)+4,{size:36});
    s+=fade(seg(p,.2,.4),vec(P,0,0,4,3,{color:C.dim,w:4,head:16})+label('(4, 3)',P.X(4)+14,P.Y(3)+8,{size:24,color:C.dim}));
    s+=fade(seg(p,.45,.65),line(P.X(4),P.Y(3),P.X(4),P.Y(-3),{color:PP,w:2,dash:'6 6'})+vec(P,0,0,4,-3,{color:LC})+T(bB,P.X(4)+24,P.Y(-3)+14,{size:36}));
    s+=fade(seg(p,.7,.85),arcAt(P.X(0),P.Y(0),53.13,-36.87,70,{color:AL,text:'90°',tr:30}));
    s+=card(560,90,600,340,T(`(${cs(FC,'3')},\\,${cs(FC,'4')})`,860,150,{size:42})
     +fade(seg(p,.2,.4),label('成分を 入れ替え',600,222,{size:26,color:C.dim})+T(`\\to(4,\\,3)`,1000,215,{size:42}))
     +fade(seg(p,.45,.65),label('片方の 符号を 変える',600,292,{size:26,color:PP})+T(`\\to(${cs(LC,'4')},\\,${cs(LC,'-3')})`,1010,285,{size:42}))
     +fade(seg(p,.7,.85),label('矢印を 90° 回した 形',860,385,{size:34,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
    return s;
   },
  };
 })(),
 [K+'self']:(p)=>{
  let s=arrow(150,330,450,330,{color:FC,w:9,head:22})+arrow(150,352,450,352,{color:FC,w:6,head:18,opacity:.6});
  s+=T(bA,470,335,{size:40})+label('同じ 矢印どうし：間の角 0°',300,420,{size:26,color:C.dim,anchor:'middle'});
  s+=card(600,110,560,280,T(`${bA}\\cdot${bA}=${cs(FC,'A')}\\,${cs(FC,'A')}\\cos0^\\circ`,880,190,{size:44})
   +fade(seg(p,.45,.65),T(`=${cs(FC,'A')}^2`,880,275,{size:50}))
   +fade(seg(p,.7,.85),label('長さの 2乗',880,350,{size:32,color:AL,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'selfcalc']:(p)=>{
  const P=plane({...G,skip:[1,2]});let s=P.svg;
  s+=vec(P,0,0,3,4,{color:FC})+T(bA,P.X(3)+22,P.Y(4)+4,{size:36});
  s+=line(P.X(0),P.Y(0)+1,P.X(3),P.Y(0)+1,{color:AL,w:6,cap:'butt'})+line(P.X(3),P.Y(0),P.X(3),P.Y(4),{color:PP,w:4,dash:'8 6'});
  s+=label('3',P.X(1.5),P.Y(0)+32,{size:26,color:AL,anchor:'middle',weight:700})+label('4',P.X(3)+12,P.Y(2)+8,{size:26,color:PP,weight:700})+fade(seg(p,.7,.85),label('5',P.X(1.5)-28,P.Y(2)-6,{size:30,color:FC,weight:700}));
  s+=card(560,110,600,280,T(`(${cs(FC,'3')},\\,${cs(FC,'4')})\\cdot(${cs(FC,'3')},\\,${cs(FC,'4')})=9+16=25`,860,185,{size:40})
   +fade(seg(p,.5,.7),T(`${cs(FC,'A')}=\\sqrt{25}=${cs(FC,'5')}`,860,280,{size:48})),seg(p,0,.12));
  return s;
 },
 [K+'selfpyth']:(p)=>{
  let s=label('長さ ＝ 自分との 内積の 平方根',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=card(140,110,920,130,label('2次元',220,185,{size:28,color:C.ink})+T(`${bA}\\cdot${bA}=${cs(FC,'A_x^2')}+${cs(FC,'A_y^2')}`,660,183,{size:46}),seg(p,0,.15));
  s+=fade(seg(p,.15,.3),label('三平方の 定理',950,275,{size:26,color:AL,anchor:'middle',weight:700}));
  s+=card(140,300,920,130,label('3次元',220,375,{size:28,color:C.ink})+T(`${bA}\\cdot${bA}=${cs(FC,'A_x^2')}+${cs(FC,'A_y^2')}+${cs(FC,'A_z^2')}`,660,373,{size:46}),seg(p,.4,.6));
  s+=fade(seg(p,.75,.9),T(`${cs(FC,'A')}=\\sqrt{${bA}\\cdot${bA}}`,600,480,{size:40}));
  return s;
 },
 [K+'quiz']:(p)=>{
  const Q={ox:130,oy:330,u:52,x0:0,x1:5,y0:-2,y1:4};
  const P=plane({...Q,skip:['y-1']});let s=P.svg;
  s+=vec(P,0,0,2,3,{color:FC})+vec(P,0,0,4,-1,{color:LC});
  s+=card(560,110,600,280,T(`(${cs(FC,'2')},\\,${cs(FC,'3')})\\cdot(${cs(LC,'4')},\\,${cs(LC,'-1')})=\\;?`,860,190,{size:44})
   +label('間の角は 90° より',860,275,{size:30,color:C.ink,anchor:'middle'})+label('大きい？ 小さい？',860,330,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,0,.15),AL);
  return s;
 },
 [K+'quizans']:(p)=>{
  const Q={ox:130,oy:330,u:52,x0:0,x1:5,y0:-2,y1:4};
  const P=plane({...Q,skip:['y-1']});let s=P.svg;
  s+=vec(P,0,0,2,3,{color:FC})+vec(P,0,0,4,-1,{color:LC});
  s+=arcAt(P.X(0),P.Y(0),-14.04,56.31,60,{g:seg(p,.6,.8)})+fade(seg(p,.6,.8),label('約 70°',P.X(0)+150*Math.cos(rad(21)),P.Y(0)-150*Math.sin(rad(21))+9,{size:26,color:TC,anchor:'middle',weight:700}));
  s+=card(560,110,600,300,T(`${cs(FC,'2')}\\times${cs(LC,'4')}+${cs(FC,'3')}\\times(${cs(LC,'-1')})`,860,175,{size:42})
   +fade(seg(p,.2,.35),T(`=8-3=${cs(AL,'5')}`,860,250,{size:46}))
   +fade(seg(p,.5,.65),label('正 → 90° より 小さい',860,335,{size:32,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S5 円運動で「直角なら0」 =====
 [K+'circ']:(p)=>{
  const cx=330,cy=280,R=190,a=-10+100*seg(p,.1,.95),[bx,by]=onC(cx,cy,R,a);
  let s=circleScene({cx,cy,R});
  s+=line(cx,cy,bx,by,{color:C.dim,w:3})+dot(bx,by,16,PP);
  s+=label('上から見た図',60,60,{size:24,color:C.dim});
  s+=card(640,120,520,260,label('なめらかな 台の上',900,185,{size:30,color:C.ink,anchor:'middle'})
   +label('ひもに つないだ 球',900,240,{size:30,color:C.ink,anchor:'middle'})
   +label('一定の 速さで 円く 回す',900,310,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'circstep']:(p)=>{
  const cx=330,cy=280,R=190,a=60,[bx,by]=onC(cx,cy,R,a);
  let s=circleScene({cx,cy,R});
  s+=line(cx,cy,bx,by,{color:C.dim,w:3});
  const ux=(cx-bx)/R,uy=(cy-by)/R;
  s+=fade(seg(p,.05,.25),arrow(bx,by,bx+ux*110,by+uy*110,{color:FC,w:7,head:20})+T(bF,bx+ux*110-38,by+uy*110+30,{size:36}));
  const tx=-Math.sin(rad(a)),ty=-Math.cos(rad(a)); // counter-clockwise tangent (screen)
  s+=fade(seg(p,.4,.6),arrow(bx,by,bx+tx*100,by+ty*100,{color:LC,w:7,head:20})+T(bdr,bx+tx*100-10,by+ty*100-22,{size:36}));
  s+=fade(seg(p,.65,.8),sq(bx,by,Math.atan2(-uy,ux)*180/Math.PI,20,AL));
  s+=dot(bx,by,16,PP);
  s+=card(640,110,520,300,fade(seg(p,.05,.25),label('ひもの力：中心向き',900,180,{size:30,color:FC,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.6),label('一歩 d𝐫：円に 沿う 向き',900,250,{size:30,color:LC,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('いつも 直角',900,330,{size:36,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'circdw']:(p)=>{
  const cx=330,cy=280,R=190;
  let s=circleScene({cx,cy,R});
  [150,90,20,-60,-150].forEach((a,i)=>{const [bx,by]=onC(cx,cy,R,a),ux=(cx-bx)/R,uy=(cy-by)/R,tx=-Math.sin(rad(a)),ty=-Math.cos(rad(a));
   s+=fade(seg(p,.05+.1*i,.2+.1*i),arrow(bx,by,bx+ux*70,by+uy*70,{color:FC,w:5,head:15})+arrow(bx,by,bx+tx*60,by+ty*60,{color:LC,w:5,head:15})+dot(bx,by,9,PP)+label('0',bx+(bx-cx)/R*34,by+(by-cy)/R*34+8,{size:24,color:AL,anchor:'middle',weight:700}));});
  s+=card(640,120,520,260,T(`dW=${bF}\\cdot${bdr}`,900,200,{size:46})
   +fade(seg(p,.5,.7),T(`=0`,900,280,{size:52,color:AL}))
   +fade(seg(p,.7,.85),label('どの 一歩でも',900,345,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'circsum']:(p)=>{
  let s=T(`W=\\int_C ${bF}\\cdot${bdr}`,600,150,{size:62});
  s+=fade(seg(p,.1,.25),label('一歩ずつの 仕事を 足す',600,255,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.35,.55),T(`=0+0+0+\\cdots`,600,340,{size:52}));
  s+=fade(seg(p,.6,.8),T(`=0`,600,430,{size:62,color:AL})+label('ひもの力の 仕事',700,438,{size:28,color:C.ink}));
  return s;
 },
 [K+'circke']:(p)=>{
  const cx=330,cy=280,R=190,a=10+80*seg(p,0,1),[bx,by]=onC(cx,cy,R,a);
  let s=circleScene({cx,cy,R})+line(cx,cy,bx,by,{color:C.dim,w:3})+dot(bx,by,16,PP);
  s+=card(640,100,520,320,T(`W=0`,900,170,{size:48,color:WC})
   +fade(seg(p,.15,.35),label('↓',900,215,{size:28,color:C.dim,anchor:'middle'})+label('運動エネルギーは 変わらない',900,260,{size:30,color:WC,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),label('↓',900,300,{size:28,color:C.dim,anchor:'middle'})+label('速さも 変わらない',900,345,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.8),label('（仕事と エネルギーの 関係は 仕事の単元）',900,395,{size:22,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 ...(()=>{
  const cx=330,cy=270,R=190,S0=onC(cx,cy,R,0),S1=onC(cx,cy,R,180);
  const half=(g=1)=>{const pts=Array.from({length:41},(_,i)=>onC(cx,cy,R,180*i/40));
   let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 10'})+dot(cx,cy,7,C.dim)+draw(pts,1,{color:PP,w:4});
   s+=arrow(...pts[19],...pts[21],{color:PP,w:4,head:16});
   s+=dot(...S0,14,PP)+label('始め',S0[0]+20,S0[1]+8,{size:24,color:C.ink})+fade(g,dot(...S1,14,PP,.6)+label('終わり',S1[0]-24,S1[1]+44,{size:24,color:C.ink,anchor:'middle'}));
   return s;};
  return {
   [K+'circtrap']:(p)=>{
    let s=half(seg(p,.05,.2));
    s+=fade(seg(p,.25,.45),arrow(S0[0],S0[1]+40,S1[0]+6,S1[1]+40,{color:LC,w:7,head:20})+T(bR,cx,S0[1]+80,{size:36})+label('直径',cx+70,S0[1]+76,{size:24,color:LC}));
    s+=fade(seg(p,.55,.75),arrow(S0[0],S0[1],S0[0]-110,S0[1],{color:FC,w:7,head:20})+label('最初の ひもの力',S0[0]-60,S0[1]-26,{size:24,color:FC,anchor:'middle',weight:700}));
    s+=card(640,120,520,260,label('半周 回ると',900,180,{size:30,color:C.ink,anchor:'middle'})
     +fade(seg(p,.25,.45),label('移動 Δ𝐫 ＝ 直径（左向き）',900,245,{size:28,color:LC,anchor:'middle',weight:700}))
     +fade(seg(p,.55,.75),label('最初の力と 同じ向き',900,320,{size:32,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
    return s;
   },
   [K+'circtrap2']:(p)=>{
    let s=half(1)+arrow(S0[0],S0[1]+40,S1[0]+6,S1[1]+40,{color:LC,w:7,head:20})+label('2 m',cx,S0[1]+80,{size:26,color:LC,anchor:'middle',weight:700});
    s+=arrow(S0[0],S0[1],S0[0]-110,S0[1],{color:FC,w:7,head:20})+label('2 N',S0[0]-60,S0[1]-26,{size:26,color:FC,anchor:'middle',weight:700});
    s+=line(cx,cy,cx,cy-R,{color:C.dim,w:2,dash:'5 6'})+label('半径 1 m',cx+10,cy-R/2,{size:24,color:C.dim});
    s+=card(640,100,520,320,label('最初の力 × 移動全体',900,160,{size:28,color:C.dim,anchor:'middle'})
     +fade(seg(p,.2,.4),T(`${cs(FC,'2')}\\times${cs(LC,'2')}=4\\,\\mathrm{J}`,900,230,{size:46})+cross(1090,218,16))
     +fade(seg(p,.6,.8),label('本当の 仕事',900,305,{size:28,color:C.dim,anchor:'middle'})+T(`W=${cs(WC,'0')}`,900,370,{size:50})+check(1060,360,18)),seg(p,0,.12));
    return s;
   },
  };
 })(),
 [K+'circlesson']:(p)=>{
  const cx=330,cy=280,R=190;
  let s=circleScene({cx,cy,R});
  for(let i=0;i<12;i++){const a=i*30,[bx,by]=onC(cx,cy,R,a),tx=-Math.sin(rad(a)),ty=-Math.cos(rad(a));
   s+=fade(seg(p,.05+.04*i,.15+.04*i),arrow(bx,by,bx+tx*52,by+ty*52,{color:LC,w:4,head:13}));}
  s+=card(640,120,520,280,label('力の 向きが 変わるとき',900,185,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.55),label('一歩ごとに 内積を 取り',900,260,{size:30,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.75),label('足す（積分）',900,320,{size:30,color:AL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s='';
  const cols=[[220,50,'正','90° より 小さい',AL],[600,90,'0','直角',TC],[980,140,'負','90° より 大きい',RC]];
  cols.forEach(([x,d,sg,t,col],i)=>{s+=fade(seg(p,.2+.15*i,.35+.15*i),card(x-170,90,340,360,pair(x-60,330,d,{LA:110,LB:120,labels:false,theta:false})+label(`内積 ${sg}`,x,150,{size:36,color:col,anchor:'middle',weight:700})+label(t,x,410,{size:28,color:C.ink,anchor:'middle'})));});
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(100,110,480,280,label('大きさだけの 積',340,180,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${cs(FC,'A')}\\,${cs(LC,'B')}`,340,270,{size:52})+label('向きが 揃ったときの 上限',340,345,{size:26,color:AL,anchor:'middle'}),seg(p,0,.2));
  s+=card(620,110,480,280,label('自分との 内積',860,180,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${bA}\\cdot${bA}=${cs(FC,'A')}^2`,860,270,{size:52})+label('長さの 2乗',860,345,{size:26,color:AL,anchor:'middle'}),seg(p,.45,.65));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(80,90,480,340,label('内積',320,150,{size:34,color:C.ink,anchor:'middle',weight:700})
   +pair(200,300,53.13,{LA:120,LB:110,labels:false,theta:false,shadowA:false})
   +label('→',400,300,{size:36,color:C.dim,anchor:'middle'})+T(`${cs(WC,'6\\,\\mathrm{J}')}`,480,310,{size:44})
   +label('一つの 数',320,400,{size:28,color:AL,anchor:'middle',weight:700}),seg(p,0,.15));
  // wrench + bolt, answer points out of the screen (⊙)
  const bx=760,by=290;
  let w=ring(bx,by,26,{color:C.dim,w:4})+line(bx+24,by,bx+200,by,{color:C.dim,w:14})+arrow(bx+190,by,bx+190,by-90,{color:FC,w:6,head:18});
  w+=arcAt(bx,by,-20,200,55,{color:AL,w:3});
  w+=fade(seg(p,.6,.8),label('→',990,300,{size:36,color:C.dim,anchor:'middle'})+ring(1060,290,24,{color:AL,w:4})+dot(1060,290,7,AL)+label('手前向き',1060,345,{size:22,color:AL,anchor:'middle'}));
  s+=card(620,90,500,340,label('外積（回す 効き目）',870,150,{size:32,color:C.ink,anchor:'middle',weight:700})+w
   +fade(seg(p,.6,.8),label('向きを 持つ 矢印',870,400,{size:28,color:AL,anchor:'middle',weight:700})),seg(p,.35,.5));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=label('次の問い：外積・中級',600,60,{size:26,color:C.dim,anchor:'middle'});
  s+=card(150,100,420,240,label('基本の 3方向で',360,160,{size:28,color:C.ink,anchor:'middle'})+T(`\\hat{x}\\times\\hat{y}=\\;?`,360,250,{size:50,color:C.v}),seg(p,0,.2));
  s+=card(630,100,420,240,label('順序を 入れ替えると',840,160,{size:28,color:C.ink,anchor:'middle'})+T(`${bA}\\times${bB}`,745,250,{size:44})+label('と',840,258,{size:26,color:C.dim,anchor:'middle'})+T(`${bB}\\times${bA}`,935,250,{size:44})+label('何が 変わる？',840,305,{size:26,color:AL,anchor:'middle',weight:700}),seg(p,.35,.55));
  s+=card(250,380,700,90,label('外積の 向きを どう 計算する？',600,438,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.6,.75),AL);
  return s;
 },
};
