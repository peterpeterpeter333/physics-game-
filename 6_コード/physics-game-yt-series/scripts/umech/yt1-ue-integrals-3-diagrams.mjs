// YouTube シリーズ 線積分と面積分・上級 3/4（ステージ ue-integrals 本9〜本11）— 図。Stage 1200×515.
// 色：電場 𝐄 水色、道 黄、電位 V 紫（等電位線は紫の点線）、力 緑、仕事・エネルギー 橙、法線 𝐧 桃、電子 青。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,poly,texWidth} from './anim.mjs';
import {UC,card,L,T,TF,cc,bE,bR,dR,bF,rp,plane,fieldArrows,para,straight,pathLine,ends,electron,vecAt,patch} from './yt1-ue-integrals-1-diagrams.mjs';

const K='ue-integrals-3:';
const P0=plane();
const PR={x:560,w:620,cx:870};
const bN=cc(UC.N,'\\mathbf{n}');
const Vfn=(x,y)=>-(x*x+y*y)/2;

function contours(P,{g=1,labels=1,list=[[-.25,''],[-.5,''],[-1,'V＝−1 V']]}={}){
 let s='';
 list.forEach(([v,t],i)=>{const r=Math.sqrt(-2*v);const pts=[];for(let k=0;k<=60;k++){const a=Math.PI/2*k/60,x=r*Math.cos(a),y=r*Math.sin(a);if(x<=1.25&&y<=1.25)pts.push([P.X(x),P.Y(y)]);}
  s+=fade(g,draw(pts,1,{color:UC.V,w:2.5,dash:'7 6'}));
  if(labels){const txt=t||`V＝${String(v).replace('-','−')}`;
   if(r>1.25){const y=Math.sqrt(r*r-1.2*1.2);s+=fade(g,label(txt,P.X(1.2)-6,P.Y(y)+26,{size:20,color:UC.V,anchor:'end'}));}
   else{const a=1.3,x=r*Math.cos(a),y=r*Math.sin(a);s+=fade(g,label(txt,P.X(x)+8,P.Y(y)-6,{size:20,color:UC.V}));}}});
 return s;
}
const mapBase=(o={})=>P0.svg+(o.field?fieldArrows(P0,{op:o.field}):'')+contours(P0,{g:o.cont??1,labels:o.lab??1});
// flat tile in perspective, centred (cx,cy); normal points up-right
const tile=(cx,cy,{g=1,sc=1,color=UC.N}={})=>fade(g,poly([[cx-150*sc,cy+55*sc],[cx+110*sc,cy+85*sc],[cx+150*sc,cy-30*sc],[cx-110*sc,cy-60*sc]],{fill:color,fo:.14,stroke:color,sw:2.5}));
const ND=[.22,-.975];
// ∯ : MathJax has no \oiint here, so draw ∬ and put a ring across the two signs
export function oiint(body,x,y,size,o={}){const src=`\\iint_S ${body}`,w=texWidth(src,size,false),left=x-w/2;
 return T(src,x,y,size,o)+`<ellipse cx="${(left+size*.5).toFixed(1)}" cy="${(y-size*.3).toFixed(1)}" rx="${(size*.44).toFixed(1)}" ry="${(size*.2).toFixed(1)}" fill="none" stroke="${o.color??C.ink}" stroke-width="${(size/22).toFixed(1)}"/>`;}   // on-screen normal direction of the tile

export const ytUeIntegrals3Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.3})+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=card(PR.x,120,PR.w,240,L('前回の最後の問い',PR.cx,170,{size:24,color:C.dim})+L('どんな道でも 同じ仕事？',PR.cx,240,{size:32,color:C.hi,weight:700})+L('なぜ 言える？',PR.cx,300,{size:30,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.3})+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=card(PR.x,110,PR.w,270,L('どちらの道でも',PR.cx,150,{size:26,color:C.dim})+T(`\\int_A^B ${bE}\\cdot${dR}=1\\ \\mathrm{V}`,PR.cx,240,44)+fade(seg(p,.4,.6),T('W=-e\\times1\\ \\mathrm{V}',PR.cx,320,40,{color:UC.W})),seg(p,.02,.15));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=mapBase({cont:seg(p,.3,.6),lab:0})+fade(.6,pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink}))+ends(P0);
  s+=card(PR.x,120,PR.w,240,L('たまたま 同じ？',PR.cx,185,{size:30})+fade(seg(p,.4,.6),L('電位を作って どの道でも同じと示す',PR.cx,255,{size:26,color:UC.V,weight:700})),seg(p,.02,.15));
  return s;
 },

 // ===== S2 =====
 [K+'V']:(p)=>{
  let s=mapBase({cont:seg(p,.4,.8),lab:0})+dot(P0.X(0),P0.Y(0),7,C.ink)+label('V＝0',P0.X(0)+12,P0.Y(0)+30,{size:22,color:UC.V});
  s+=T('V(x,y)=-\\frac{\\alpha}{2}(x^2+y^2)',PR.cx,150,46,{color:UC.V});
  s+=fade(seg(p,.4,.6),L('原点で 0、離れるほど 下がる',PR.cx,250,{size:28}));
  s+=fade(seg(p,.6,.8),L('電位の地図',PR.cx,310,{size:30,color:UC.V,weight:700}));
  return s;
 },
 [K+'contour']:(p)=>{
  let s=mapBase({cont:1,lab:seg(p,.1,.3)})+ends(P0,{g:seg(p,.5,.7)});
  s+=card(PR.x,120,PR.w,240,L('同じ V の点 → 原点中心の円',PR.cx,180,{size:28})+L('等電位線',PR.cx,240,{size:32,color:UC.V,weight:700})+fade(seg(p,.5,.7),L('B は V＝−1 V の円の上',PR.cx,305,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'partial']:(p)=>{
  const y0=.6,x=mix(.1,1.1,seg(p,.2,.8));
  let s=mapBase({lab:0})+fade(seg(p,.05,.2),line(P0.X(0),P0.Y(y0),P0.X(1.25),P0.Y(y0),{color:C.hi,w:2,dash:'5 6'})+label('y を止める',P0.X(1.25)-4,P0.Y(y0)-12,{size:22,color:C.hi,anchor:'end'}));
  s+=dot(P0.X(x),P0.Y(y0),9,C.hi);
  s+=card(PR.x,120,PR.w,250,L('x だけで 微分 ＝ 偏微分',PR.cx,180,{size:28})+T('\\frac{\\partial V}{\\partial x}',PR.cx,270,52,{color:UC.V})+L('（中級）',PR.cx,340,{size:22,color:C.dim}),seg(p,.02,.15));
  return s;
 },
 [K+'dx']:(p)=>{
  let s=T(`V=-\\frac{\\alpha x^2}{2}${cc(C.dim,'-\\frac{\\alpha y^2}{2}')}`,600,110,46,{color:UC.V});
  s+=fade(seg(p,.1,.3),L('y² の項：x で変わらない → 0',840,190,{size:24,color:C.dim}));
  s+=fade(seg(p,.3,.5),T('\\frac{\\partial V}{\\partial x}=-\\alpha x',600,280,48,{color:UC.V}));
  s+=fade(seg(p,.6,.8),T(`-\\frac{\\partial V}{\\partial x}=\\alpha x=${cc(UC.E,'E_x')}`,600,400,48));
  return s;
 },
 [K+'dy']:(p)=>{
  let s=T('\\frac{\\partial V}{\\partial x}=-\\alpha x',600,110,36,{color:C.dim});
  s+=T('\\frac{\\partial V}{\\partial y}=-\\alpha y',600,240,48,{color:UC.V});
  s+=fade(seg(p,.45,.65),T(`-\\frac{\\partial V}{\\partial y}=\\alpha y=${cc(UC.E,'E_y')}`,600,370,48));
  return s;
 },
 [K+'grad']:(p)=>{
  let s=mapBase({lab:0});
  [[.5,.5],[1,0],[0.71,.71],[.3,.95],[1.2,.6]].forEach(([x,y],i)=>{s+=vecAt(P0,[x,y],[x,y],{k:.25,color:UC.E,w:5,head:13,g:seg(p,.3+i*.05,.5+i*.05)});});
  s+=TF(`${bE}=\\left(-\\frac{\\partial V}{\\partial x},\\ -\\frac{\\partial V}{\\partial y}\\right)`,PR.cx,140,44,600);
  s+=fade(seg(p,.4,.6),L('電位が 下がる向き',PR.cx,240,{size:28,color:UC.E,weight:700}));
  s+=fade(seg(p,.6,.8),L('等電位線と 直角',PR.cx,300,{size:28,color:UC.E,weight:700}));
  return s;
 },

 // ===== S3 =====
 [K+'chain']:(p)=>{
  const u=.55,q=para(u),d=[.28,.28*2*u];
  let s=mapBase({lab:0})+pathLine(P0,para)+ends(P0);
  s+=vecAt(P0,q,d,{color:UC.P,w:6,lab:'d𝐫',ldx:-40,ldy:-6,size:26,g:seg(p,.05,.25)});
  s+=fade(seg(p,.3,.5),line(P0.X(q[0]),P0.Y(q[1])+12,P0.X(q[0]+d[0]),P0.Y(q[1])+12,{color:C.hi,w:4})+label('dx',P0.X(q[0]+d[0]/2),P0.Y(q[1])+40,{size:22,color:C.hi,anchor:'middle'})
   +line(P0.X(q[0]+d[0])+12,P0.Y(q[1]),P0.X(q[0]+d[0])+12,P0.Y(q[1]+d[1]),{color:C.hi,w:4})+label('dy',P0.X(q[0]+d[0])+22,P0.Y(q[1]+d[1]/2)+8,{size:22,color:C.hi}));
  s+=card(PR.x,120,PR.w,240,L('V の変化 ＝',PR.cx,180,{size:28,color:UC.V})+L('x を変えた分 ＋ y を変えた分',PR.cx,240,{size:30,color:UC.V,weight:700}),seg(p,.3,.5));
  return s;
 },
 [K+'total']:(p)=>{
  let s=TF('dV=\\frac{\\partial V}{\\partial x}\\,dx+\\frac{\\partial V}{\\partial y}\\,dy',600,190,54,1000,{color:UC.V});
  s+=fade(seg(p,.4,.6),L('全微分の連鎖律（微分の法則・上級）',600,330,{size:28,color:C.dim}));
  return s;
 },
 [K+'minusE']:(p)=>{
  let s=TF('dV=\\frac{\\partial V}{\\partial x}\\,dx+\\frac{\\partial V}{\\partial y}\\,dy',600,90,36,1000,{color:C.dim});
  s+=fade(seg(p,.05,.25),TF(`=-(${cc(UC.E,'E_x')}\\,dx+${cc(UC.E,'E_y')}\\,dy)`,600,210,48,1000,{color:UC.V}));
  s+=fade(seg(p,.5,.7),T(`dV=-${bE}\\cdot${dR}`,600,350,58,{color:UC.V}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=mapBase({lab:1})+pathLine(P0,para)+ends(P0);
  s+=fade(seg(p,.1,.3),label('V(A)＝0',P0.X(0)+20,P0.Y(0)+34,{size:22,color:UC.V,weight:700}));
  s+=fade(seg(p,.1,.3),label('V(B)＝−1 V',P0.X(1)+14,P0.Y(1)+34,{size:22,color:UC.V,weight:700}));
  s+=TF('\\sum dV=[V_1-V(A)]+[V_2-V_1]+\\cdots',PR.cx,140,36,600);
  s+=fade(seg(p,.4,.6),L('途中の V は 打ち消し合う',PR.cx,220,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.75),T('=V(B)-V(A)',PR.cx,300,48,{color:UC.V}));
  return s;
 },
 [K+'any']:(p)=>{
  const w2=u=>[u+.25*Math.sin(Math.PI*u),u-.2*Math.sin(Math.PI*u)],w3=u=>[Math.sin(Math.PI*u/2),u+.3*Math.sin(Math.PI*u)];
  let s=mapBase({lab:0})+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+pathLine(P0,w2,{color:C.dim,w:3,dash:'4 6',g:seg(p,.4,.6)})+pathLine(P0,w3,{color:C.dim,w:3,dash:'4 6',g:seg(p,.5,.7)})+ends(P0);
  s+=TF(`\\int_A^B ${bE}\\cdot${dR}=-\\{V(B)-V(A)\\}`,PR.cx,150,44,600);
  s+=fade(seg(p,.4,.6),L('右辺は 両端だけ',PR.cx,250,{size:28}));
  s+=fade(seg(p,.55,.75),L('→ どの道でも 同じ値',PR.cx,310,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'check']:(p)=>{
  let s=mapBase({lab:1})+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=T('V(A)=0,\\quad V(B)=-1\\ \\mathrm{V}',PR.cx,130,40,{color:UC.V});
  s+=fade(seg(p,.35,.55),T(`\\int_A^B ${bE}\\cdot${dR}=-(-1-0)=1\\ \\mathrm{V}`,PR.cx,240,42));
  s+=fade(seg(p,.6,.8),L('前回の2本と 一致',PR.cx,330,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'loop']:(p)=>{
  let s=mapBase({lab:0})+pathLine(P0,u=>{const a=2*Math.PI*u;return [.45-.4*Math.cos(a),.45-.35*Math.sin(a)];},{g:seg(p,.05,.5)});
  s+=dot(P0.X(.05),P0.Y(.45),8,C.ink)+label('A',P0.X(.05)-12,P0.Y(.45)+8,{size:26,color:C.ink,anchor:'end',weight:700});
  s+=TF(`\\oint ${bE}\\cdot${dR}=-\\{V(A)-V(A)\\}=0`,PR.cx,170,42,600);
  s+=fade(seg(p,.45,.65),L('両端が同じ → 周回積分は 0',PR.cx,270,{size:28,color:C.hi,weight:700}));
  s+=fade(seg(p,.6,.8),L('どの一周でも',PR.cx,330,{size:26}));
  return s;
 },
 ...(()=>{
  const PF=plane({xt:[[1,'1']],yt:[[1,'1']],xl:'x（m）',yl:'y（m）'});
  const RU=u=>u<.5?[2*u,0]:[1,2*u-1], UR=u=>u<.5?[0,2*u]:[2*u-1,1];
  return {[K+'notF']:(p)=>{
   let s=PF.svg+fieldArrows(PF,{fn:(x,y)=>[0,x],color:UC.F,k:.2,op:.45})+pathLine(PF,RU,{color:UC.W,w:5})+pathLine(PF,u=>UR(1-u),{color:C.v,w:5,dash:'10 7'});
   s+=label('一周 1 J',PF.X(.5),PF.Y(.5),{size:26,color:UC.W,weight:700,anchor:'middle'});
   s+=card(PR.x,120,PR.w,250,T(`${bF}=(0,\\ x)\\ \\mathrm{N}`,PR.cx,180,40)+fade(seg(p,.3,.5),L('地図があれば 一周は 0 のはず',PR.cx,250,{size:26}))+fade(seg(p,.5,.7),L('→ この力には 作れない',PR.cx,310,{size:30,color:C.a,weight:700})),seg(p,.02,.15));
   return s;
  }};
 })(),

 // ===== S4 =====
 [K+'dU']:(p)=>{
  let s=mapBase({lab:1})+pathLine(P0,para)+ends(P0)+electron(P0.X(0)+18,P0.Y(0)-18,seg(p,.05,.2));
  s+=T('\\Delta U=q\\,\\Delta V',PR.cx,190,58,{color:UC.W});
  s+=fade(seg(p,.4,.6),L('電荷 × 電位の変化',PR.cx,290,{size:28}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=T('\\Delta V=V(B)-V(A)=-1\\ \\mathrm{V},\\quad q=-e',600,110,40,{color:C.dim});
  s+=fade(seg(p,.2,.4),T('\\Delta U=(-e)\\times(-1\\ \\mathrm{V})',600,220,48,{color:UC.W}));
  s+=fade(seg(p,.4,.6),T('=+e\\times1\\ \\mathrm{V}',650,320,48,{color:UC.W}));
  s+=fade(seg(p,.65,.85),L('電子の 位置エネルギーは 増える',600,420,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'W']:(p)=>{
  let s=T('W=-\\Delta U',600,140,54,{color:UC.W});
  s+=L('（W：電気力の仕事）',600,215,{size:22,color:C.dim});
  s+=fade(seg(p,.25,.45),T('=-e\\times1\\ \\mathrm{V}',600,300,50,{color:UC.W}));
  s+=fade(seg(p,.55,.75),L('前回の積分と 一致',600,410,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'ext']:(p)=>{
  let s='';
  s+=card(140,120,920,110,L('一定の速さ → 運動エネルギーは 変わらない（ΔK＝0）',600,188,{size:28}),seg(p,.02,.15));
  s+=fade(seg(p,.35,.55),L('電気力の仕事 −e × 1 V ＋ 外からの力の仕事 ＝ 0',600,300,{size:28}));
  s+=fade(seg(p,.55,.75),L('外からの力の仕事 ＝ ＋e × 1 V',600,390,{size:34,color:UC.W,weight:700}));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=card(80,120,480,250,L('電位 V',320,180,{size:28,color:UC.V,weight:700})+L('A → B で 下がる',320,250,{size:28})+L('ΔV＝−1 V',320,310,{size:30,color:UC.V,weight:700}),seg(p,.02,.15));
  s+=card(640,120,480,250,L('電子の 位置エネルギー U',880,180,{size:28,color:UC.W,weight:700})+L('A → B で 上がる',880,250,{size:28})+L('ΔU＝＋e × 1 V',880,310,{size:30,color:UC.W,weight:700}),seg(p,.15,.3));
  s+=fade(seg(p,.5,.7),L('負の電荷では 向きが逆 → 混同しない',600,440,{size:28,color:C.hi,weight:700}));
  return s;
 },

 // ===== S5 =====
 [K+'switch']:(p)=>{
  let s=card(100,160,400,180,L('仕事',300,230,{size:32,color:UC.W,weight:700})+L('道に沿って集計',300,290,{size:24,color:C.dim}),1);
  s+=fade(seg(p,.2,.4),arrow(530,250,660,250,{color:C.dim,w:4,head:16}));
  s+=card(690,160,400,180,L('電気束',890,230,{size:32,color:UC.N,weight:700})+L('面で集計（ガウスの法則へ）',890,290,{size:24,color:C.dim}),seg(p,.3,.5));
  return s;
 },
 [K+'goal']:(p)=>{
  const cx=330,cy=270;
  let s=fade(seg(p,.05,.3),`<ellipse cx="${cx}" cy="${cy}" rx="200" ry="160" fill="${UC.N}" fill-opacity="0.08" stroke="${UC.N}" stroke-width="3"/>`);
  s+=fade(seg(p,.2,.4),dot(cx-20,cy+10,14,C.a)+label('＋',cx-20,cy+18,{size:22,color:'#0b1122',anchor:'middle',weight:700})+label('中の電荷',cx-20,cy+52,{size:22,color:C.a,anchor:'middle'}));
  for(let k=0;k<8;k++){const a=k*Math.PI/4+.2,x0=cx-20+40*Math.cos(a),y0=cy+10-40*Math.sin(a),x1=cx-20+250*Math.cos(a),y1=cy+10-210*Math.sin(a);s+=fade(seg(p,.3+k*.03,.5+k*.03),arrow(x0,y0,x1,y1,{color:UC.E,w:3,head:11}));}
  s+=card(PR.x+40,130,PR.w-40,240,L('閉じた面の 全体で 電場を集計',PR.cx+20,190,{size:28})+fade(seg(p,.45,.65),L('→ 中の電荷と 結びたい',PR.cx+20,250,{size:30,color:C.hi,weight:700}))+fade(seg(p,.65,.85),L('面は 頭の中で選んだもの',PR.cx+20,315,{size:24,color:C.dim})),seg(p,.02,.15));
  return s;
 },
 [K+'normal']:(p)=>{
  const cx=330,cy=300;
  let s=tile(cx,cy)+fade(seg(p,.2,.45),arrow(cx,cy,cx+ND[0]*170,cy+ND[1]*170,{color:UC.N,w:6,head:18})+label('𝐧',cx+ND[0]*170+14,cy+ND[1]*170+10,{size:32,color:UC.N,weight:700}));
  s+=fade(seg(p,.35,.55),label('長さ 1',cx+ND[0]*90+18,cy+ND[1]*90,{size:22,color:UC.N}));
  s+=card(PR.x+40,140,PR.w-40,210,L('面と直角・長さ 1 の矢印',PR.cx+20,205,{size:28})+fade(seg(p,.55,.75),L('単位法線 𝐧',PR.cx+20,270,{size:34,color:UC.N,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'split']:(p)=>{
  const cx=330,cy=300,Ed=[.9,-.43],EL=200,c=Ed[0]*ND[0]+Ed[1]*ND[1];
  const E1=[cx+Ed[0]*EL,cy+Ed[1]*EL],Pn=[cx+ND[0]*EL*c,cy+ND[1]*EL*c];
  let s=tile(cx,cy)+arrow(cx,cy,cx+ND[0]*190,cy+ND[1]*190,{color:UC.N,w:3,head:12,opacity:.6})+label('𝐧',cx+ND[0]*190+10,cy+ND[1]*190+4,{size:28,color:UC.N,weight:700});
  s+=fade(seg(p,.05,.2),arrow(cx,cy,E1[0],E1[1],{color:UC.E,w:5,head:16})+label('𝐄',E1[0]+10,E1[1]+6,{size:30,color:UC.E,weight:700}));
  s+=fade(seg(p,.3,.5),line(cx,cy,Pn[0],Pn[1],{color:C.hi,w:9})+line(E1[0],E1[1],Pn[0],Pn[1],{color:C.dim,w:2.5,dash:'6 5'})+label('𝐄·𝐧',(cx+Pn[0])/2-14,(cy+Pn[1])/2+6,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=fade(seg(p,.5,.7),line(Pn[0],Pn[1],E1[0],E1[1],{color:C.dim,w:5})+label('面に沿う部分',(Pn[0]+E1[0])/2+10,(Pn[1]+E1[1])/2-16,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(PR.x+40,140,PR.w-40,210,L('面を横切るのは',PR.cx+20,205,{size:28})+fade(seg(p,.4,.6),L('法線に沿う部分 𝐄·𝐧 だけ',PR.cx+20,270,{size:30,color:C.hi,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'dPhi']:(p)=>{
  let s=T(`d\\Phi=${bE}\\cdot${bN}\\,dA`,600,150,58);
  s+=fade(seg(p,.05,.2),L('電気束（定義）',600,225,{size:26,color:C.dim}));
  s+=fade(seg(p,.45,.65),T(`d\\mathbf{A}=${bN}\\,dA\\qquad d\\Phi=${bE}\\cdot d\\mathbf{A}`,600,340,50));
  s+=fade(seg(p,.6,.8),L('d𝐀：面積ベクトル（向き＝法線、長さ＝面積）',600,430,{size:24,color:C.dim}));
  return s;
 },
 [K+'sign']:(p)=>{
  const cases=[[ .2,'正',C.F,0],[2.9,'負',C.a,.2],[1.57,'0',C.dim,.4]];
  let s='';
  cases.forEach(([th,t,col,d],i)=>{const cx=200+i*400,cy=330,g=seg(p,.05+d,.25+d);
   s+=fade(g,line(cx-130,cy,cx+130,cy,{color:UC.N,w:5})+arrow(cx,cy,cx,cy-120,{color:UC.N,w:4,head:13})+label('𝐧',cx+10,cy-110,{size:24,color:UC.N}));
   const e=[Math.sin(th),-Math.cos(th)];s+=fade(g,arrow(cx,cy,cx+e[0]*110,cy+e[1]*110,{color:UC.E,w:5,head:15})+label(t,cx-80,cy+50,{size:32,color:col,anchor:'middle',weight:700}));
   if(i===0)s+=fade(g,draw(Array.from({length:12},(_,k)=>{const a=-Math.PI/2+th*k/11;return [cx+50*Math.cos(a),cy+50*Math.sin(a)];}),1,{color:C.ink,w:2})+label('θ',cx+22,cy-58,{size:24,color:C.ink}));});
  s+=fade(seg(p,.65,.85),L('θ ＝ 電場と 法線 の角（面との角ではない）',600,490,{size:26,color:C.hi,weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T('\\mathrm{\\frac{V}{m}\\times m^2=V\\cdot m}',600,170,56);
  s+=fade(seg(p,.4,.6),T('\\mathrm{=\\frac{N}{C}\\times m^2=N\\cdot m^2/C}',600,320,48,{color:C.dim}));
  s+=fade(seg(p,.4,.6),L('（中級の単位と同じ）',600,410,{size:24,color:C.dim}));
  return s;
 },
 ...(()=>{
  const rows=[['','掛ける相手','単位'],['仕事','q と 一歩 d𝐫','J'],['電気束','面積（𝐄 を 法線で）','V·m'],['磁束','面積（𝐁 を 法線で）','Wb']];
  const tbl=(p,hl=0)=>{let s='';const xs=[230,600,960];rows.forEach((r,i)=>{const y=130+i*80,g=seg(p,.05+i*.12,.2+i*.12);
   s+=fade(g,r.map((t,j)=>L(t,xs[j],y,{size:i?30:24,color:i===0?C.dim:j===0?[0,UC.W,UC.N,C.E][i]:C.ink,weight:i&&j===0?700:400})).join('')+(i?line(110,y-50,1090,y-50,{color:C.faint,w:1.5}):''));});return s;};
  return {
   [K+'table']:(p)=>tbl(p),
   [K+'distinct']:(p)=>tbl(1)+fade(seg(p,.3,.5),L('電気束は 仕事でも 磁束の変化でもない',600,460,{size:30,color:C.hi,weight:700})),
  };
 })(),

 // ===== S6 =====
 ...(()=>{
  const S0=(u,v)=>[330-150+300*u+40*v,290+60-150*v+30*Math.sin(Math.PI*u)-25*u];
  const nrm=(u,v)=>{const a=S0(u+.01,v),b=S0(u,v),c=S0(u,v+.01);const tu=[a[0]-b[0],a[1]-b[1]],tv=[c[0]-b[0],c[1]-b[1]];let n=[-(tu[1]+tv[1]),tu[0]*.3+ -60];const m=Math.hypot(n[0],n[1]);return [n[0]/m,n[1]/m];};
  const tilesPic=(p,o={})=>{let s=patch(330,290,{grid:1});
   [[.3,.3],[.7,.4],[.5,.75]].forEach(([u,v],i)=>{const P=S0(u,v),n=nrm(u,v),g=seg(p,(o.t0??.15)+i*.1,(o.t0??.15)+.2+i*.1);
    s+=fade(g,arrow(P[0],P[1],P[0]+n[0]*95,P[1]+n[1]*95,{color:UC.N,w:4,head:12})+arrow(P[0],P[1],P[0]+70+i*15,P[1]-60+i*25,{color:UC.E,w:4,head:12})+dot(P[0],P[1],5,C.ink));
    if(i===0)s+=fade(g,label('𝐧ᵢ',P[0]+n[0]*95-28,P[1]+n[1]*95+4,{size:24,color:UC.N,weight:700})+label('𝐄ᵢ',P[0]+80,P[1]-66,{size:24,color:UC.E,weight:700}));});
   return s;};
  return {
   [K+'tiles']:(p)=>{
    let s=tilesPic(p);
    s+=card(PR.x+40,120,PR.w-40,250,L('タイルごとに 読む',PR.cx+20,180,{size:28})+fade(seg(p,.3,.5),L('面積 ΔAᵢ・法線 𝐧ᵢ・電場 𝐄ᵢ',PR.cx+20,245,{size:28,color:C.hi,weight:700}))+fade(seg(p,.5,.7),L('法線も電場も 場所ごとに違う',PR.cx+20,305,{size:24,color:C.dim})),seg(p,.02,.15));
    return s;
   },
   [K+'limit']:(p)=>{
    let s=tilesPic(1,{t0:-1});
    s+=TF(`\\Phi\\approx\\sum_i ${cc(UC.E,'\\mathbf{E}_i')}\\cdot${cc(UC.N,'\\mathbf{n}_i')}\\,\\Delta A_i`,PR.cx+20,150,42,560);
    s+=fade(seg(p,.4,.55),L('↓ タイルを限りなく小さく',PR.cx+20,235,{size:24,color:C.dim}));
    s+=fade(seg(p,.5,.7),T(`\\Phi=\\int_S ${bE}\\cdot${bN}\\,dA`,PR.cx+20,320,48,{color:C.hi}));
    return s;
   },
  };
 })(),
 [K+'closed']:(p)=>{
  const cx=330,cy=270;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="200" ry="160" fill="${UC.N}" fill-opacity="0.08" stroke="${UC.N}" stroke-width="3"/>`;
  for(let k=0;k<10;k++){const a=k*Math.PI/5+.15,x=cx+200*Math.cos(a),y=cy-160*Math.sin(a),nx=Math.cos(a)/200,ny=Math.sin(a)/160,m=Math.hypot(nx,ny);
   s+=fade(seg(p,.1+k*.03,.3+k*.03),arrow(x,y,x+70*nx/m,y-70*ny/m,{color:UC.N,w:4,head:12}));}
  s+=fade(seg(p,.4,.55),L('外向きの法線',cx,cy+8,{size:26,color:UC.N,weight:700}));
  s+=card(PR.x+40,130,PR.w-40,230,L('閉じた面の積分の記号',PR.cx+20,190,{size:26,color:C.dim})+fade(seg(p,.45,.65),oiint(`${bE}\\cdot d\\mathbf{A}`,PR.cx+20,280,50)),seg(p,.02,.15));
  return s;
 },
 [K+'only']:(p)=>{
  let s=card(80,120,480,260,L('一様 ＋ 法線と同じ向き',320,180,{size:28,color:C.ink,weight:700})+T('\\Phi=E\\times A',320,270,46,{color:C.hi})+L('掛け算 1回',320,335,{size:24,color:C.dim}),seg(p,.02,.15));
  s+=card(640,120,480,260,L('それ以外',880,180,{size:28,color:C.ink,weight:700})+T(`\\int ${bE}\\cdot${bN}\\,dA`,880,270,42)+L('タイルごとに 足す',880,335,{size:24,color:C.dim}),seg(p,.2,.35));
  s+=fade(seg(p,.55,.75),L('足せないのではなく、E を外に出せないだけ',600,450,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'summary']:(p)=>{
  let s=mapBase({lab:1})+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=card(PR.x,120,PR.w,240,L('電位が作れた',PR.cx,180,{size:28,color:UC.V,weight:700})+TF(`\\int_A^B ${bE}\\cdot${dR}=-\\{V(B)-V(A)\\}`,PR.cx,260,40,580)+L('どの道でも 両端で決まる',PR.cx,325,{size:24,color:C.dim}),seg(p,.02,.15));
  return s;
 },
 [K+'summary2']:(p)=>{
  const cx=330,cy=300;
  let s=tile(cx,cy)+arrow(cx,cy,cx+ND[0]*150,cy+ND[1]*150,{color:UC.N,w:5,head:16})+label('𝐧',cx+ND[0]*150+12,cy+ND[1]*150+8,{size:28,color:UC.N,weight:700});
  s+=card(PR.x+40,130,PR.w-40,230,L('面：法線に沿う成分 × 面積 を足す',PR.cx+20,195,{size:26})+T(`\\Phi=\\int ${bE}\\cdot${bN}\\,dA`,PR.cx+20,285,44,{color:C.hi}),seg(p,.02,.15));
  return s;
 },
 [K+'next']:(p)=>{
  let s=patch(330,290,{grid:0});
  s+=fade(seg(p,.2,.4),label('？',330,250,{size:60,color:C.hi,weight:700,anchor:'middle'}));
  s+=card(PR.x+40,130,PR.w-40,230,L('曲がった面のタイル',PR.cx+20,195,{size:28})+L('面積と法線は どう計算する？',PR.cx+20,260,{size:30,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=patch(330,290,{grid:seg(p,.2,.6)});
  s+=card(PR.x+40,130,PR.w-40,230,L('道の目盛り u のように',PR.cx+20,195,{size:28})+L('面にも 目盛りを付けられる？',PR.cx+20,260,{size:30,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
