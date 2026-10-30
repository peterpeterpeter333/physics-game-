// YouTube シリーズ 線積分と面積分・上級 2/4（ステージ ue-integrals 本6〜本8）— 図。Stage 1200×515.
// 色：電場 𝐄 水色、道 黄（直線は白の点線）、力 緑、仕事 橙、電子 青。共通部品は 1/4 の図ファイルから。
import {C,mix,seg,fade,label,line,rect,dot,draw,arrow,poly,texWidth} from './anim.mjs';
import {UC,card,L,T,TF,cc,bE,bR,dR,bF,rp,plane,fieldArrows,para,straight,pathLine,ends,electron,vecAt,uTicks} from './yt1-ue-integrals-1-diagrams.mjs';

const K='ue-integrals-2:';
const P0=plane();
const PR={x:560,w:620,cx:870};
const Wpar=u=>-(u*u+u**4)/2, Wlin=u=>-u*u;   // W/e in V for L=H=α=1

// cumulative-work graph W/e (V) against u
function wGraph({g=1,par=1,lin=0,pt=null,ptLin=null,ox=110,oy=95,sx=380,sy=300}={}){
 const X=u=>ox+sx*u,Y=v=>oy-sy*v;   // v ≤ 0 goes down
 let s=arrow(X(-.03),Y(0),X(1.12),Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(.08),X(0),Y(-1.2),{color:C.dim,w:2.5,head:13});
 s+=label('u',X(1.12)+8,Y(0)+8,{size:24,color:C.dim})+label('W/e（V）',X(0)+14,Y(-1.2)+6,{size:22,color:C.dim});
 [.5,1].forEach(u=>{s+=line(X(u),Y(0)-6,X(u),Y(0)+6,{color:C.dim})+label(String(u),X(u),Y(0)-14,{size:21,color:C.dim,anchor:'middle'});});
 [-.5,-1].forEach(v=>{s+=line(X(0)-6,Y(v),X(0)+6,Y(v),{color:C.dim})+label(String(v).replace('-','−'),X(0)-12,Y(v)+8,{size:21,color:C.dim,anchor:'end'});});
 s=fade(g,s);
 const curve=(fn,p,o)=>draw(Array.from({length:81},(_,i)=>{const u=i/80;return [X(u),Y(fn(u))];}),p,o);
 if(par)s+=curve(Wpar,par,{color:UC.W,w:4});
 if(lin)s+=curve(Wlin,lin,{color:C.ink,w:3,dash:'9 7'});
 if(pt)s+=fade(pt.g??1,dot(X(pt.u),Y(Wpar(pt.u)),8,C.hi)+label(pt.t,X(pt.u)+(pt.dx??14),Y(Wpar(pt.u))+(pt.dy??-12),{size:24,color:C.hi,weight:700,anchor:pt.anchor??'start'}));
 if(ptLin)s+=fade(ptLin.g??1,dot(X(ptLin.u),Y(Wlin(ptLin.u)),8,C.ink)+label(ptLin.t,X(ptLin.u)+(ptLin.dx??14),Y(Wlin(ptLin.u))+(ptLin.dy??24),{size:24,color:C.ink,weight:700,anchor:ptLin.anchor??'start'}));
 return s;
}
// simple function graph y=f(u) for the calculus scene
function fGraph(f,{g=1,ox=110,oy=440,sx=330,sy=150,ymax=2.2,lab=''}={}){
 const X=u=>ox+sx*u,Y=v=>oy-sy*v;
 let s=arrow(X(-.03),Y(0),X(1.15),Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(-.05),X(0),Y(ymax),{color:C.dim,w:2.5,head:13})+label('u',X(1.15)+8,Y(0)+8,{size:24,color:C.dim});
 s+=draw(Array.from({length:61},(_,i)=>{const u=1.1*i/60;return [X(u),Y(f(u))];}),1,{color:C.hi,w:4});
 if(lab)s+=label(lab,X(1.1)+8,Y(f(1.1))+4,{size:26,color:C.hi});
 return {svg:fade(g,s),X,Y};
}
const qPlane=(o={})=>P0.svg+fieldArrows(P0,{op:o.op??.3})+pathLine(P0,para,{g:o.par??1})+(o.lin?pathLine(P0,straight,{g:o.lin,dash:'10 8',w:4,color:C.ink}):'')+ends(P0);

export const ytUeIntegrals2Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  let s=qPlane();const q=para(.6);s+=electron(P0.X(q[0]),P0.Y(q[1]),seg(p,.1,.3));
  s+=card(PR.x,120,PR.w,240,L('前回の最後の問い',PR.cx,170,{size:24,color:C.dim})+L('電子の仕事は いくら？',PR.cx,245,{size:34,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=qPlane({lin:seg(p,.1,.5)});
  s+=card(PR.x,120,PR.w,240,L('前回の最後の問い',PR.cx,170,{size:24,color:C.dim})+L('電子の仕事は いくら？',PR.cx,235,{size:30,color:C.dim,weight:700})+L('別の道でも 同じ値？',PR.cx,300,{size:34,color:C.hi,weight:700}),1,C.hi);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=qPlane()+uTicks(P0,para,{labels:0});
  s+=T(`${bR}(u)=(Lu,\\ Hu^2)`,PR.cx,130,40);
  s+=fade(seg(p,.4,.6),TF(`${bE}(${bR}(u))\\cdot${rp}(u)=\\alpha L^2u+2\\alpha H^2u^3`,PR.cx,230,40,600,{color:C.hi}));
  s+=fade(seg(p,.6,.8),L('積分する関数（前回）',PR.cx,305,{size:24,color:C.dim}));
  return s;
 },
 [K+'need']:(p)=>{
  let s=card(150,150,400,200,T('\\int u\\,du=\\ ?',350,250,52),seg(p,.05,.25));
  s+=card(650,150,400,200,T('\\int u^3\\,du=\\ ?',850,250,52),seg(p,.15,.35));
  s+=fade(seg(p,.5,.7),L('微分の定義から 用意する',600,420,{size:30,color:C.hi,weight:700}));
  return s;
 },

 // ===== S2 =====
 [K+'sq']:(p)=>{
  const G=fGraph(u=>u*u,{lab:'u²'});const u=.5,h=mix(.4,.12,seg(p,.4,.9));
  let s=G.svg+fade(seg(p,.1,.3),line(G.X(u),G.Y(u*u),G.X(u+h),G.Y((u+h)**2),{color:C.F,w:3})+dot(G.X(u),G.Y(u*u),6,C.ink)+dot(G.X(u+h),G.Y((u+h)**2),6,C.ink));
  s+=T('\\frac{(u+\\Delta u)^2-u^2}{\\Delta u}',PR.cx,150,46);
  s+=fade(seg(p,.35,.55),T('=\\frac{2u\\Delta u+(\\Delta u)^2}{\\Delta u}=2u+\\Delta u',PR.cx,270,40,{color:C.hi}));
  return s;
 },
 [K+'half']:(p)=>{
  const G=fGraph(u=>u*u/2,{lab:'u²/2',ymax:1.2,sy:250});const u=.6;
  let s=G.svg+fade(seg(p,.4,.6),line(G.X(u-.3),G.Y(u*u/2-.3*u),G.X(u+.3),G.Y(u*u/2+.3*u),{color:C.F,w:3})+dot(G.X(u),G.Y(u*u/2),6,C.ink)+label('傾き u',G.X(u+.3)+8,G.Y(u*u/2+.3*u),{size:24,color:C.F}));
  s+=T(`2u+${cc(C.a,'\\Delta u')}\\ \\xrightarrow{\\Delta u\\to0}\\ 2u`,PR.cx,140,44);
  s+=fade(seg(p,.35,.55),T("\\left(\\frac{u^2}{2}\\right)'=\\frac{2u}{2}=u",PR.cx,290,46,{color:C.hi}));
  s+=fade(seg(p,.6,.8),L('u²/2 は u の原始関数',PR.cx,410,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'four']:(p)=>{
  let s=T('(u+\\Delta u)^4=u^4+4u^3\\Delta u+6u^2(\\Delta u)^2+4u(\\Delta u)^3+(\\Delta u)^4',600,110,36);
  s+=fade(seg(p,.25,.45),T('(u+\\Delta u)^4-u^4=4u^3\\Delta u+6u^2(\\Delta u)^2+4u(\\Delta u)^3+(\\Delta u)^4',600,220,36));
  s+=fade(seg(p,.5,.7),T('\\div \\Delta u:\\quad 4u^3+6u^2\\Delta u+4u(\\Delta u)^2+(\\Delta u)^3',600,330,40,{color:C.hi}));
  s+=fade(seg(p,.05,.2),L('展開（二項展開）',600,430,{size:24,color:C.dim}));
  return s;
 },
 [K+'four2']:(p)=>{
  const g=seg(p,.1,.35),t0='4u^3',t1=`+${cc(C.a,'6u^2\\Delta u+4u(\\Delta u)^2+(\\Delta u)^3')}`,sz=44,w0=texWidth(t0,sz,false),w1=texWidth(t1,sz,false),x0=600-(w0+w1)/2;
  let s=T(t0,x0+w0/2,130,sz)+T(t1,x0+w0+w1/2,130,sz);
  s+=fade(g,line(x0+w0+4,126,x0+w0+w1,126,{color:C.a,w:4}));
  s+=fade(g,L('Δu → 0 で 消える',x0+w0+w1/2,205,{size:26,color:C.a,weight:700}));
  s+=fade(seg(p,.35,.55),T('\\to\\ 4u^3',600,270,50));
  s+=fade(seg(p,.6,.8),T("\\left(\\frac{u^4}{4}\\right)'=u^3",600,410,50,{color:C.hi}));
  return s;
 },
 ...(()=>{
  // telescoping chain: G(u)=u²/2 on [0,1] split in 4
  const ox=110,oy=430,sx=360,sy=520,Gf=u=>u*u/2,X=u=>ox+sx*u,Y=v=>oy-sy*v,N=4,us=[0,.25,.5,.75,1];
  const axes=(g=1)=>fade(g,arrow(X(-.03),Y(0),X(1.12),Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(-.02),X(0),Y(.62),{color:C.dim,w:2.5,head:13})+label('u',X(1.12)+8,Y(0)+8,{size:24,color:C.dim})+label('G',X(0)+12,Y(.62)+8,{size:24,color:C.dim}));
  const curve=(g=1)=>draw(Array.from({length:61},(_,i)=>{const u=i/60;return [X(u),Y(Gf(u))];}),g,{color:C.hi,w:4});
  const steps=(g=1)=>{let s='';for(let i=0;i<N;i++){const a=us[i],b=us[i+1];s+=fade(g,line(X(a),Y(Gf(a)),X(b),Y(Gf(a)),{color:C.dim,w:2,dash:'5 5'})+line(X(b),Y(Gf(a)),X(b),Y(Gf(b)),{color:UC.W,w:6}));}return s;};
  return {
   [K+'why']:(p)=>{
    let s=axes()+curve(seg(p,.05,.4));
    s+=card(PR.x,120,PR.w,240,L('微分すると u になる G の差',PR.cx,185,{size:28})+L('なぜ 積分になる？',PR.cx,245,{size:32,color:C.hi,weight:700})+fade(seg(p,.5,.7),L('→ 差の鎖（積分・上級）',PR.cx,310,{size:26,color:C.dim})),seg(p,.05,.2));
    return s;
   },
   [K+'chain']:(p)=>{
    let s=axes()+curve()+steps(seg(p,.05,.35));
    s+=TF('[G(u_1)-G(0)]+[G(u_2)-G(u_1)]+\\cdots',PR.cx,130,36,600);
    s+=fade(seg(p,.4,.6),L('途中の G は 打ち消し合う',PR.cx,215,{size:26,color:C.dim}));
    s+=fade(seg(p,.55,.75),T('=G(u)-G(0)',PR.cx,300,46,{color:C.hi}));
    s+=fade(seg(p,.2,.4),label('増え分',X(1)+10,Y(.4),{size:22,color:UC.W}));
    return s;
   },
   [K+'ft']:(p)=>{
    let s=axes()+curve()+steps();
    s+=T("G(u_{i+1})-G(u_i)\\approx G'\\times\\Delta u",PR.cx,110,38);
    s+=fade(seg(p,.1,.3),L('傾き × 幅',PR.cx,175,{size:26,color:UC.W,weight:700}));
    s+=fade(seg(p,.45,.65),T("\\int_0^u G'(s)\\,ds=G(u)-G(0)",PR.cx,280,44,{color:C.hi}));
    s+=fade(seg(p,.65,.85),L('微積分の基本定理',PR.cx,370,{size:26,color:C.dim}));
    return s;
   },
  };
 })(),

 // ===== S3 =====
 [K+'setup']:(p)=>{
  const u=.6,q=para(u);
  let s=qPlane()+pathLine(P0,para,{color:UC.W,w:8,u1:u,head:0,g:seg(p,.3,.6)})+electron(P0.X(q[0]),P0.Y(q[1]));
  s+=label('u',P0.X(q[0])+16,P0.Y(q[1])+28,{size:24,color:C.ink});
  s+=card(PR.x,120,PR.w,240,T('q=-e',PR.cx,180,44)+fade(seg(p,.3,.5),L('始点 → 目盛り u までの仕事',PR.cx,250,{size:28,color:UC.W,weight:700}))+fade(seg(p,.4,.6),T('W(u)',PR.cx,315,44,{color:UC.W})),seg(p,.02,.15));
  return s;
 },
 [K+'dummy']:(p)=>{
  const u=.6,q=para(u),sv=mix(0,u,seg(p,.15,.6)),qs=para(sv);
  let s=qPlane()+pathLine(P0,para,{color:UC.W,w:8,u1:u,head:0})+dot(P0.X(q[0]),P0.Y(q[1]),8,C.ink)+label('上の端 u',P0.X(q[0])+16,P0.Y(q[1])+30,{size:24,color:C.ink});
  s+=dot(P0.X(qs[0]),P0.Y(qs[1]),9,C.hi)+label('s',P0.X(qs[0])-14,P0.Y(qs[1])-10,{size:26,color:C.hi,anchor:'end',weight:700});
  s+=card(PR.x,120,PR.w,240,T('\\int_0^{u}(\\cdots)\\,ds',PR.cx,190,46)+fade(seg(p,.4,.6),L('s：足すための 仮の目盛り',PR.cx,265,{size:28,color:C.hi,weight:700}))+fade(seg(p,.6,.8),L('u：上の端（固定）',PR.cx,320,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=TF('W(u)=\\int_0^u(-e)\\,\\alpha\\,(L^2s+2H^2s^3)\\,ds',600,150,46,1000,{color:UC.W});
  s+=fade(seg(p,.45,.65),TF('=-e\\alpha\\int_0^u(L^2s+2H^2s^3)\\,ds',640,280,48,1000,{color:UC.W}));
  s+=fade(seg(p,.55,.75),L('定数 −e と α は 積分の外へ',600,400,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'anti1']:(p)=>{
  let s=TF('-e\\alpha\\int_0^u(L^2s+2H^2s^3)\\,ds',600,90,36,900,{color:C.dim});
  s+=T('\\int s\\,ds=\\frac{s^2}{2}',330,220,44);
  s+=fade(seg(p,.35,.55),T('L^2\\left[\\frac{s^2}{2}\\right]_0^u=\\frac{L^2u^2}{2}-0',820,220,44,{color:C.hi}));
  s+=fade(seg(p,.6,.8),L('下の端 s＝0 では 0',820,340,{size:26,color:C.dim}));
  return s;
 },
 [K+'anti2']:(p)=>{
  let s=TF('-e\\alpha\\int_0^u(L^2s+2H^2s^3)\\,ds',600,90,36,900,{color:C.dim});
  s+=T('\\int s^3\\,ds=\\frac{s^4}{4}',330,220,44);
  s+=fade(seg(p,.3,.5),T('2H^2\\times\\frac{u^4}{4}',820,220,44));
  s+=fade(seg(p,.55,.75),T('=\\frac{2H^2}{4}u^4=\\frac{H^2u^4}{2}',820,330,44,{color:C.hi}));
  return s;
 },
 [K+'result']:(p)=>{
  let s=wGraph({g:seg(p,.3,.5),par:seg(p,.45,.9)});
  s+=card(PR.x,110,PR.w,230,TF('W(u)=-\\frac{e\\alpha}{2}(L^2u^2+H^2u^4)',PR.cx,190,46,580,{color:UC.W})+fade(seg(p,.5,.7),L('途中の位置 u ごとの 累積の仕事',PR.cx,280,{size:26})),seg(p,.02,.15),UC.W);
  s+=fade(seg(p,.3,.5),L('グラフは L＝H＝1 m、α＝1 V/m²',PR.cx,400,{size:22,color:C.dim}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=wGraph({pt:{u:1,t:'−1 V',g:seg(p,.6,.8),dx:14,dy:10}});
  s+=TF('\\frac{W(1)}{e}=-\\frac{1\\,\\mathrm{V/m^2}}{2}\\,(1\\,\\mathrm{m^2}+1\\,\\mathrm{m^2})',PR.cx,150,40,600);
  s+=fade(seg(p,.4,.6),T('=-1\\ \\mathrm{V}',PR.cx,250,46,{color:C.hi}));
  s+=fade(seg(p,.6,.8),T('W=-e\\times1\\ \\mathrm{V}',PR.cx,345,48,{color:UC.W}));
  return s;
 },
 [K+'joule']:(p)=>{
  let s=wGraph({pt:{u:1,t:'−1 V',dx:14,dy:10}});
  s+=T('e\\approx1.602\\times10^{-19}\\ \\mathrm{C}',PR.cx,140,40,{color:C.dim});
  s+=fade(seg(p,.25,.45),T('W\\approx-1.602\\times10^{-19}\\ \\mathrm{J}',PR.cx,240,44,{color:UC.W}));
  s+=fade(seg(p,.6,.8),L('電気力の仕事は 負',PR.cx,340,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'sign']:(p)=>{
  const u=.65,q=para(u);
  let s=qPlane({op:.15});
  s+=vecAt(P0,q,q,{k:.4,color:UC.E,w:5,lab:'𝐄',g:seg(p,.02,.2)});
  s+=vecAt(P0,q,[-q[0],-q[1]],{k:.4,color:UC.F,w:5,lab:'−e𝐄',ldx:-10,ldy:26,anchor:'end',g:seg(p,.15,.35)});
  s+=vecAt(P0,q,[1,2*u],{k:.2,color:UC.P,w:6,lab:'一歩',ldx:-8,ldy:-10,anchor:'end',size:24,g:seg(p,.35,.5)});
  {const n=Math.hypot(1,2*u),t=[1/n,2*u/n],c=-(q[0]*t[0]+q[1]*t[1]),k=.4;
   s+=fade(seg(p,.45,.65),line(P0.X(q[0])+10,P0.Y(q[1])+6,P0.X(q[0]+k*c*t[0])+10,P0.Y(q[1]+k*c*t[1])+6,{color:UC.F,w:9})+label('逆向きの成分',P0.X(q[0]+k*c*t[0])+18,P0.Y(q[1]+k*c*t[1])+30,{size:22,color:UC.F,weight:700}));}
  s+=electron(P0.X(q[0]),P0.Y(q[1]));
  s+=card(PR.x,110,PR.w,260,L('電場：外向き',PR.cx,165,{size:28,color:UC.E,weight:700})+fade(seg(p,.15,.35),L('電子への力：内向き',PR.cx,220,{size:28,color:UC.F,weight:700}))
   +fade(seg(p,.4,.6),L('外へ運ぶ一歩と 逆向きの成分',PR.cx,285,{size:26}))+fade(seg(p,.6,.8),L('→ 仕事は 負',PR.cx,335,{size:28,color:C.hi,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'half5']:(p)=>{
  let s=wGraph({pt:{u:.5,t:'−0.15625 V',g:seg(p,.3,.5),dx:16,dy:-14}})+wGraph({par:0,g:0,pt:{u:1,t:'−1 V',g:seg(p,.65,.85),dx:14,dy:10}});
  s+=TF('\\frac{W}{e}=-\\frac12(0.25+0.0625)',PR.cx,150,42,600);
  s+=fade(seg(p,.25,.45),T('=-0.15625\\ \\mathrm{V}',PR.cx,250,44,{color:C.hi}));
  s+=fade(seg(p,.05,.2),L('u＝0.5 のとき',PR.cx,340,{size:24,color:C.dim}));
  return s;
 },

 // ===== S4 =====
 [K+'predict']:(p)=>{
  let s=qPlane({lin:seg(p,.1,.4)});
  s+=card(PR.x,130,PR.w,220,L('まっすぐ進む道でも',PR.cx,195,{size:30})+L('仕事は 同じ？',PR.cx,260,{size:34,color:C.hi,weight:700})+fade(seg(p,.5,.7),L('予想してみよう',PR.cx,320,{size:24,color:C.hi})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'line']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.2})+fade(.3,pathLine(P0,para))+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0)+uTicks(P0,straight,{labels:0});
  [.25,.6].forEach((u,i)=>{s+=vecAt(P0,[u,u],[1,1],{k:.22,color:UC.P,w:6,g:seg(p,.4+i*.1,.6+i*.1),lab:i?'𝐫′':'',ldx:-36,ldy:0,size:28});});
  s+=card(PR.x,120,PR.w,240,T(`${bR}(u)=(Lu,\\ Hu)`,PR.cx,185,44)+fade(seg(p,.4,.6),T(`${rp}=(L,\\ H)`,PR.cx,265,44,{color:UC.P}))+fade(seg(p,.6,.8),L('どこでも 同じ向き',PR.cx,325,{size:26})),seg(p,.02,.15));
  return s;
 },
 [K+'linedot']:(p)=>{
  const u=.6;
  let s=P0.svg+fieldArrows(P0,{op:.2})+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=vecAt(P0,[u,u],[u,u],{k:.45,color:UC.E,w:6,lab:'𝐄',ldx:8,ldy:10,g:seg(p,.05,.25)});
  s+=fade(seg(p,.3,.5),label('𝐄 は 道と 同じ向き',P0.X(.62)+20,P0.Y(.25),{size:22,color:UC.E}));
  s+=T(`${bE}=(\\alpha Lu,\\ \\alpha Hu)`,PR.cx,120,40);
  s+=fade(seg(p,.4,.6),TF(`${bE}\\cdot${rp}=\\alpha L^2u+\\alpha H^2u`,PR.cx,215,40,600));
  s+=fade(seg(p,.6,.8),T('=\\alpha(L^2+H^2)\\,u',PR.cx,300,44,{color:C.hi}));
  return s;
 },
 [K+'lineint']:(p)=>{
  let s=T('\\int_0^1u\\,du=\\left[\\frac{u^2}{2}\\right]_0^1=\\frac12',600,140,46);
  s+=fade(seg(p,.4,.6),T('W=-e\\,\\alpha(L^2+H^2)\\times\\frac12',600,270,46,{color:UC.W}));
  s+=fade(seg(p,.6,.8),T('=-\\frac{e\\alpha}{2}(L^2+H^2)',650,380,46,{color:UC.W}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=card(80,130,480,220,L('放物線',320,185,{size:28,color:UC.P,weight:700})+T('W=-e\\times1\\ \\mathrm{V}',320,275,42,{color:UC.W}),1);
  s+=card(640,130,480,220,L('まっすぐな道',880,185,{size:28,color:C.ink,weight:700})+fade(seg(p,.1,.35),T('-\\frac{e\\alpha}{2}(1+1)=-e\\times1\\ \\mathrm{V}',880,275,38,{color:UC.W})),seg(p,.02,.15));
  s+=fade(seg(p,.5,.7),L('＝ ぴったり同じ',600,430,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'midpt']:(p)=>{
  let s=P0.svg+pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:4,color:C.ink})+ends(P0);
  const g1=seg(p,.3,.5),g2=seg(p,.5,.7);
  s+=fade(g1,dot(P0.X(.5),P0.Y(.5),9,C.ink)+label('(0.5, 0.5)',P0.X(.5)-14,P0.Y(.5)-12,{size:22,color:C.ink,anchor:'end'}));
  s+=fade(g2,dot(P0.X(.5),P0.Y(.25),9,UC.P)+label('(0.5, 0.25)',P0.X(.5)+16,P0.Y(.25)+30,{size:22,color:UC.P}));
  s+=card(PR.x,120,PR.w,240,L('同じ u＝0.5 でも',PR.cx,180,{size:28})+fade(g1,L('直線：点 (0.5, 0.5)',PR.cx,240,{size:28,color:C.ink,weight:700}))+fade(g2,L('放物線：点 (0.5, 0.25)',PR.cx,295,{size:28,color:UC.P,weight:700})),seg(p,.02,.15));
  s+=fade(seg(p,.75,.9),L('別の場所',PR.cx,410,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'graphs']:(p)=>{
  let s=wGraph({lin:seg(p,.05,.4),pt:{u:.5,t:'−0.15625',g:seg(p,.3,.5),dx:16,dy:-14},ptLin:{u:.5,t:'−0.25',g:seg(p,.15,.35),dx:-14,dy:30,anchor:'end'}});
  s+=fade(seg(p,.6,.8),dot(110+380,95+300,10,C.hi)+label('合流 −1 V',110+380-14,95+300+34,{size:24,color:C.hi,weight:700,anchor:'end'}));
  s+=card(PR.x+40,110,PR.w-40,200,L('—— 放物線',PR.cx+20,170,{size:26,color:UC.W,weight:700})+L('- - - まっすぐな道',PR.cx+20,225,{size:26,color:C.ink,weight:700})+L('（W/e、u＝0.5 の値）',PR.cx+20,275,{size:22,color:C.dim}),seg(p,.02,.15));
  return s;
 },

 // ===== S5 =====
 [K+'loop']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.2})+pathLine(P0,para,{g:seg(p,.05,.4)})+ends(P0);
  s+=fade(seg(p,.45,.85),pathLine(P0,u=>straight(1-u),{dash:'10 8',w:4,color:C.ink,g:seg(p,.45,.85)}));
  s+=card(PR.x,130,PR.w,220,L('行き：放物線 A → B',PR.cx,195,{size:28,color:UC.P,weight:700})+fade(seg(p,.45,.65),L('戻り：直線 B → A',PR.cx,260,{size:28,color:C.ink,weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'reverse']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.2})+fade(.35,pathLine(P0,para))+pathLine(P0,u=>straight(1-u),{dash:'10 8',w:4,color:C.ink})+ends(P0);
  [.75,.4].forEach((u,i)=>{s+=vecAt(P0,[u,u],[-1,-1],{k:.16,color:UC.P,w:6,g:seg(p,.1+i*.1,.3+i*.1),lab:i?'d𝐫':'',ldx:-36,ldy:6,size:26});});
  s+=T('\\int_{B\\to A}=-\\int_{A\\to B}',PR.cx,140,44);
  s+=fade(seg(p,.5,.7),L('戻りの仕事：＋e × 1 V',PR.cx,260,{size:32,color:UC.W,weight:700}));
  s+=fade(seg(p,.25,.45),L('どの一歩も 逆向き → 符号が反転',PR.cx,340,{size:24,color:C.dim}));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=T('-e\\times1\\ \\mathrm{V}+e\\times1\\ \\mathrm{V}=0',600,140,48,{color:UC.W});
  s+=fade(seg(p,.4,.6),T(`\\oint ${bE}\\cdot${dR}=0`,600,280,58));
  s+=fade(seg(p,.4,.6),L('周回積分（この一周）',600,370,{size:26,color:C.dim}));
  return s;
 },
 [K+'symbol']:(p)=>{
  let s=T(`\\oint ${bE}\\cdot${dR}`,350,250,70);
  s+=card(620,140,520,230,L('丸 ＝ 閉じた道の印',880,205,{size:30,color:C.ink,weight:700})+fade(seg(p,.4,.6),L('記号だけでは',880,275,{size:28}))+fade(seg(p,.4,.6),L('0 と決まらない',880,325,{size:30,color:C.a,weight:700})),seg(p,.05,.2));
  return s;
 },
 ...(()=>{
  const PF=plane({xt:[[1,'1']],yt:[[1,'1']],xl:'x（m）',yl:'y（m）'});
  const Ffn=(x,y)=>[0,x];
  const RU=u=>u<.5?[2*u,0]:[1,2*u-1], UR=u=>u<.5?[0,2*u]:[2*u-1,1];
  const base=()=>PF.svg+fieldArrows(PF,{fn:Ffn,color:UC.F,k:.2,op:.45})+dot(PF.X(0),PF.Y(0),7,C.ink)+dot(PF.X(1),PF.Y(1),7,C.ink);
  return {
   [K+'contrast']:(p)=>{
    let s=base()+pathLine(PF,para,{g:seg(p,.15,.35)})+pathLine(PF,RU,{color:UC.W,w:5,g:seg(p,.35,.55)})+pathLine(PF,UR,{color:C.v,w:5,g:seg(p,.55,.75)});
    s+=fade(seg(p,.25,.4),label('2/3 J',PF.X(.55)+10,PF.Y(.25)+4,{size:24,color:UC.P,weight:700}));
    s+=fade(seg(p,.45,.6),label('1 J',PF.X(1)+14,PF.Y(.5),{size:24,color:UC.W,weight:700}));
    s+=fade(seg(p,.65,.8),label('0 J',PF.X(0)+14,PF.Y(.55),{size:24,color:C.v,weight:700}));
    s+=card(PR.x,120,PR.w,240,T(`${bF}=(0,\\ x)\\ \\mathrm{N}`,PR.cx,185,44)+L('（中級の力）',PR.cx,240,{size:24,color:C.dim})+fade(seg(p,.35,.75),L('放物線 2/3 J・右→上 1 J・上→右 0 J',PR.cx,305,{size:24})),seg(p,.02,.15));
    return s;
   },
   [K+'loopF']:(p)=>{
    let s=base()+pathLine(PF,RU,{color:UC.W,w:5})+pathLine(PF,u=>UR(1-u),{color:C.v,w:5,dash:'10 7',g:seg(p,.2,.5)});
    s+=label('1 J',PF.X(1)+14,PF.Y(.5),{size:24,color:UC.W,weight:700})+fade(seg(p,.3,.5),label('逆向きに −0 J',PF.X(0)+14,PF.Y(.55),{size:24,color:C.v,weight:700}));
    s+=T('1\\ \\mathrm{J}-0\\ \\mathrm{J}=1\\ \\mathrm{J}',PR.cx,170,48,{color:UC.W});
    s+=fade(seg(p,.55,.75),L('一周の仕事が 0 でない',PR.cx,280,{size:32,color:C.a,weight:700}));
    return s;
   },
  };
 })(),
 [K+'prop']:(p)=>{
  let s=card(80,120,480,240,L('静電場 𝐄＝(αx, αy)',320,180,{size:28,color:UC.E,weight:700})+L('この一周：0',320,260,{size:32,color:C.ink,weight:700}),seg(p,.02,.15));
  s+=card(640,120,480,240,L('力 𝐅＝(0, x) N',880,180,{size:28,color:UC.F,weight:700})+L('この一周：1 J',880,260,{size:32,color:C.ink,weight:700}),seg(p,.1,.25));
  s+=fade(seg(p,.4,.6),L('道によるかは 記号でなく 場の性質で決まる',600,440,{size:30,color:C.hi,weight:700}));
  return s;
 },

 // ===== S6 =====
 [K+'sum']:(p)=>{
  let s=wGraph({lin:0,pt:{u:1,t:'−1 V',dx:14,dy:10}});
  s+=card(PR.x,120,PR.w,220,TF('W(u)=-\\frac{e\\alpha}{2}(L^2u^2+H^2u^4)',PR.cx,195,42,580,{color:UC.W})+fade(seg(p,.4,.6),T('W(1)=-e\\times1\\ \\mathrm{V}',PR.cx,285,40,{color:C.hi})),seg(p,.02,.15),UC.W);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=P0.svg+fieldArrows(P0,{op:.2})+pathLine(P0,para)+pathLine(P0,u=>straight(1-u),{dash:'10 8',w:4,color:C.ink})+ends(P0);
  s+=card(PR.x,110,PR.w,290,L('まっすぐな道：−e × 1 V',PR.cx,175,{size:28,color:C.ink,weight:700})+fade(seg(p,.4,.6),L('行き 放物線・戻り 直線',PR.cx,240,{size:26}))+fade(seg(p,.4,.6),T(`\\oint ${bE}\\cdot${dR}=0`,PR.cx,335,40)),seg(p,.02,.15));
  return s;
 },
 [K+'next']:(p)=>{
  const w1=u=>[u,u**3],w2=u=>[u+.25*Math.sin(Math.PI*u),u-.2*Math.sin(Math.PI*u)],w3=u=>[Math.sin(Math.PI*u/2),u*u*u*u*0+u+.3*Math.sin(Math.PI*u)];
  let s=P0.svg+fieldArrows(P0,{op:.2})+fade(.6,pathLine(P0,para)+pathLine(P0,straight,{dash:'10 8',w:3,color:C.ink}))+ends(P0);
  [w1,w2,w3].forEach((f,i)=>{s+=pathLine(P0,f,{color:C.dim,w:3,dash:'4 6',g:seg(p,.2+i*.12,.45+i*.12),head:0});});
  s+=card(PR.x,130,PR.w,220,L('試したのは 2本だけ',PR.cx,195,{size:28})+fade(seg(p,.4,.6),L('どんな道でも 同じと 言える？',PR.cx,260,{size:30,color:C.hi,weight:700})),seg(p,.02,.15),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  let s=P0.svg;
  [.5,1,1.414].forEach((r,i)=>{const pts=Array.from({length:41},(_,k)=>{const a=Math.PI/2*k/40;return [P0.X(r*Math.cos(a)),P0.Y(r*Math.sin(a))];}).filter(q=>q[0]<=P0.X(1.25)+1&&q[1]>=P0.Y(1.25)-1);
   s+=fade(seg(p,.1+i*.08,.3+i*.08),draw(pts,1,{color:UC.V,w:2.5,dash:'6 6'}));});
  s+=fade(.7,pathLine(P0,para))+ends(P0);
  s+=card(PR.x,130,PR.w,220,L('電位 という量を 作ると',PR.cx,195,{size:28,color:UC.V,weight:700})+L('何が 見える？',PR.cx,260,{size:32,color:C.hi,weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
