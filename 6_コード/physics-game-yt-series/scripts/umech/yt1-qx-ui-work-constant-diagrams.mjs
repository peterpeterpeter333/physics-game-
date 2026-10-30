// 問題編 解説「斜めに引かれ、摩擦を受ける箱」（q-ui-work-constant、大学編 12 仕事・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/12_仕事.md の q-ui-work-constant（解説 16 行）。
// 配置：左に箱と床（力の矢印・影・距離）、右に F–x グラフ。誤答カードは左下（床の下）。札の帯（y＜78）には図を描かない。
// 色：力 F 緑、距離 x 水色、仕事・エネルギー 橙、負の仕事 赤、影（進む向きの成分）黄、上向きの成分 桃（凡例を出す）、速度 v 紫。
// 尺度（図のために決めた値）：力 1 N＝32 px（摩擦だけ 40 px）、距離 1 m＝100 px。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,highlight,ground,poly,axes,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,legend,note,cueT,sentWin,isProblem} from './yt1-qx-common.mjs';

const K='qx-ui-work-constant:';
const CF=C.F,CX=C.x,CE=C.E,CS=C.hi,CP=C.p,CV=C.v,CN='#ff6b6b';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='引く力の仕事 W',G2='摩擦の仕事',G3='4 m 先の速さ v';
const ANS1=g=>answerTag(1,'C','12 J',{g}),ANS2=g=>answerTag(2,'B','−4 J',{g}),ANS3=g=>answerTag(3,'B','2.0 m/s',{g});
const WOPT={x:20,w:680,y:400,size:26,whySize:22};
const LEG=(g=1)=>legend([['黄＝影（進む向きの成分）',CS],['桃＝上向きの成分',CP]],24,104,{g,gap:8});

// ---- 箱と床 ----
const FY=330,BX=280,BW=110,BH=90,SC=32,MP=100;
const TX=BX,TY=FY-BH/2,A60=Math.PI/3;
const TIP=[TX+6*SC*Math.cos(A60),TY-6*SC*Math.sin(A60)];   // (376, 118.7)
function boxAt(bx,{g=1,txt='4 kg'}={}){
 return fade(g,rect(bx-BW,FY-BH,BW,BH,{fill:'#7a5a3c',fo:.55,stroke:'#c9a27a',sw:3,rx:6})+label(txt,bx-BW/2,FY-BH/2+9,{size:26,color:C.ink,anchor:'middle',weight:700}));
}
function scene({force=1,ang=1,fric=1,dist=1,plus=1,hiF=0,hiFr=0,fLab='6 N',frLab='摩擦 1 N',dimF=0}={}){
 let s=ground(40,700,FY)+boxAt(BX);
 if(plus)s+=fade(plus,arrow(450,160,530,160,{color:C.dim,w:3,head:14})+label('＋（右向きが正）',540,168,{size:24,color:C.dim}));
 if(force){
  s+=fade(ang*force,line(TX,TY,TX+130,TY,{color:C.faint,w:2,dash:'6 6'}));
  if(ang>0){const n=16,pts=Array.from({length:n+1},(_,i)=>{const a=A60*i/n*ang;return [TX+48*Math.cos(a),TY-48*Math.sin(a)];});
   s+=draw(pts,1,{color:C.ink,w:2.5})+fade(ang,label('60°',TX+62,TY-24,{size:24,color:C.ink,weight:700}));}
  s+=arrow(TX,TY,TIP[0],TIP[1],{color:CF,w:7,head:22,g:force,opacity:1-dimF*.6});
  if(fLab)s+=fade(force*(1-dimF*.6),label(fLab,TIP[0]+14,TIP[1]+16,{size:28,color:CF,weight:700}));
  if(hiF)s+=fade(hiF,ring((TX+TIP[0])/2,(TY+TIP[1])/2,108,{color:C.hi,w:3,dash:'8 8'}));
 }
 if(fric){const x0=BX-BW,y=FY-10;
  s+=arrow(x0,y,x0-40,y,{color:CF,w:6,head:16,g:fric});
  s+=fade(fric,label(frLab,x0-46,y-14,{size:24,color:CF,anchor:'end',weight:700}));
  if(hiFr)s+=fade(hiFr,ring(x0-20,y,36,{color:C.hi,w:3,dash:'6 6'}));
 }
 if(dist){const y=FY+28;
  s+=fade(dist,line(BX,y-12,BX,y+12,{color:CX,w:2})+line(BX+4*MP,y-12,BX+4*MP,y+12,{color:CX,w:2})
   +arrow(BX,y,BX+4*MP,y,{color:CX,w:4,head:14})+label('4 m',BX+2*MP,y+32,{size:26,color:CX,anchor:'middle',weight:700}));
 }
 return s;
}
// 真上からの光と、床に落ちる影
function lampRays(g=1){
 let s=line(330,84,480,84,{color:C.hi,w:3,opacity:.6});
 for(const x of [340,420,470])s+=arrow(x,88,x,118,{color:C.hi,w:3,head:10,opacity:.8});
 return fade(g,s);
}
function shadowOnFloor({gl=1,gs=1,lab='影'}={}){
 let s=fade(gl,line(TIP[0],TIP[1]+6,TIP[0],FY,{color:C.hi,w:2,dash:'6 6',opacity:.8})+line(TX,TY+4,TX,FY,{color:C.hi,w:2,dash:'6 6',opacity:.8}));
 s+=fade(gs,line(TX,FY,TIP[0],FY,{color:CS,w:12,cap:'butt'}));
 if(lab)s+=fade(gs,label(lab,(TX+TIP[0])/2+60,FY-14,{size:26,color:CS,anchor:'start',weight:700}));
 return s;
}
// 成分（影＝黄の水平、上向き＝桃の鉛直）を力の根元から
function comps({ga=1,gp=1,la='',lp='',right=0}={}){
 let s=arrow(TX,TY,TIP[0],TY,{color:CS,w:6,head:16,g:ga});
 s+=arrow(TIP[0],TY,TIP[0],TIP[1],{color:CP,w:6,head:16,g:gp});
 if(la)s+=fade(ga,label(la,(TX+TIP[0])/2,TY+30,{size:24,color:CS,anchor:'middle',weight:700}));
 if(lp)s+=fade(gp,label(lp,TIP[0]+16,(TY+TIP[1])/2+8,{size:24,color:CP,weight:700}));
 if(right)s+=fade(right,draw([[TIP[0]+18,TY],[TIP[0]+18,TY-18],[TIP[0],TY-18]],1,{color:C.hi,w:3}));
 return s;
}

// ---- F–x グラフ（右） ----
const GX=760,GY=480,GW=320,GH=320;
function graph({g=1}={}){
 const A=axes({x:GX,y:GY,w:GW,h:GH,xmin:0,xmax:4.8,ymin:-1.5,ymax:6.5,xlabel:'x [m]',ylabel:'F [N]',xticks:[],yticks:[],g,xcolor:CX,ycolor:CF});
 let s=A.svg;
 s+=fade(g,[3,6].map(v=>line(A.X(0)-6,A.Y(v),A.X(0)+6,A.Y(v),{color:C.dim})+label(String(v),A.X(0)-12,A.Y(v)+8,{size:22,color:C.dim,anchor:'end'})).join('')
  +line(A.X(0)-6,A.Y(-1),A.X(0)+6,A.Y(-1),{color:C.dim})+label('−1',A.X(0)-12,A.Y(-1)+8,{size:22,color:C.dim,anchor:'end'})
  +line(A.X(4),A.Y(0)-6,A.X(4),A.Y(0)+6,{color:C.dim})+label('4',A.X(4)+8,A.Y(0)+28,{size:22,color:C.dim}));
 return {A,svg:s};
}
function gRect(A,F,{g=1,color=CE,fo=.35,dash='',lab='',labG=1,dy=0,x1=4}={}){
 if(g<=.001)return '';
 const X0=A.X(0),W=(A.X(x1)-X0)*clamp(g),y0=A.Y(0+dy),y1=A.Y(F+dy);
 let r=rect(X0,Math.min(y0,y1),W,Math.abs(y1-y0),{fill:color,fo,stroke:color,sw:2.5,rx:2});
 if(dash)r=r.replace('/>',` stroke-dasharray="${dash}"/>`);
 if(lab)r+=fade(labG,label(lab,(A.X(0)+A.X(x1))/2,(y0+y1)/2+11,{size:30,color:color===CE?CE:color,anchor:'middle',weight:700}));
 return r;
}
const NEG4=A=>label('−4 J',A.X(2),A.Y(-.5)+10,{size:26,color:'#ffe0e0',anchor:'middle',weight:700});
// 熱の波マーク
function heat(A,g=1,t=0){
 let s='';
 for(const u of [.8,2,3.2]){const x=A.X(u),y0=A.Y(-1)+6,rise=20*((t*.8+u)%1);
  s+=draw(Array.from({length:13},(_,i)=>[x+7*Math.sin(i/12*2*Math.PI*1.5),y0+30-rise-i*4]),1,{color:CN,w:3,opacity:.85});}
 return fade(g,s);
}

export const ytQxUiWorkConstantDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（5 秒）：0〜2 s 斜めの 6 N と 60°、2〜4 s 摩擦 1 N と 4 m、4〜5 s 隅に「K＝½mv²」の札。静止。影・成分・仕事は出さない。箱は動かさない。
 [K+'q0']:(p)=>{
  const gf=seg(p,.02,.36);
  let s=move(40,40,scene({force:gf,ang:seg(p,.2,.4),fric:seg(p,.42,.6),dist:seg(p,.55,.78),fLab:gf>.95?'6 N':''}));
  s+=card(800,110,340,170,label('小問3 で 使う 関係',970,158,{size:24,color:C.dim,anchor:'middle'})+T(`{\\color{${CE}}K}=\\tfrac{1}{2}mv^2`,970,230,46),seg(p,.82,.98));
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=scene({hiF:seg(p,.2,.35)});
  s+=card(740,110,430,250,label('小問1',955,160,{size:26,color:C.dim,anchor:'middle'})
   +label('斜めに 引く 6 N の 力が',955,225,{size:28,color:CF,anchor:'middle',weight:700})
   +label('箱に した 仕事 W',955,280,{size:30,color:CE,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G1,{g:seg(p,.02,.12)});
 },
 // 2. 定義のタグ。真上から光、床に影（黄）
 [K+'shadow']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=scene({});
  s+=lampRays(seg(p,b,b+.1))+shadowOnFloor({gl:seg(p,b+.05,b+.2),gs:seg(p,b+.2,b+.35)});
  s+=card(740,110,430,250,kindTag('定義',955,165,{g:seg(p,.03,.12)})
   +fade(seg(p,.05,.15),label('仕事 ＝',955,225,{size:28,color:CE,anchor:'middle',weight:700})
    +label('進む向きの 成分 × 距離',955,275,{size:28,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,b+.25,b+.38),label('影 ＝ 進む向きの 成分',955,330,{size:26,color:CS,anchor:'middle',weight:700})),1,C.hi);
  s+=LEG(seg(p,b+.2,b+.35));
  return s+goalTag(G1);
 },
 // 3. 直角三角形を縦の辺で折り返し、1辺 6 の正三角形。影は底辺の半分で 3 N（カット：三角形を大きく）
 [K+'fold']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const k=mix(1,-1,seg(p,.18,b-.08)),done=seg(p,b-.1,b);
  const Tp=[300,440],Q=[450,440],P=[450,440-259.8],Tq=[Q[0]+(Tp[0]-Q[0])*k,440];
  let s='';
  // 元の三角形
  s+=poly([Tp,Q,P],{fill:CS,fo:.08});
  s+=line(Tp[0],Tp[1],P[0],P[1],{color:CF,w:6})+line(Tp[0],Tp[1],Q[0],Q[1],{color:CS,w:8})+line(Q[0],Q[1],P[0],P[1],{color:CP,w:4,dash:'10 7'});
  s+=draw([[Q[0]-20,Q[1]],[Q[0]-20,Q[1]-20],[Q[0],Q[1]-20]],1,{color:C.ink,w:2.5});
  s+=label('60°',Tp[0]+42,Tp[1]-14,{size:24,color:C.ink,weight:700});
  s+=label('6',(Tp[0]+P[0])/2-26,(Tp[1]+P[1])/2,{size:30,color:CF,anchor:'end',weight:700});
  s+=label('縦の 辺',Q[0]+14,330,{size:24,color:CP,weight:700,opacity:1-done});
  // 写した三角形（縦の辺を折り目に）
  const gc=seg(p,.12,.2);
  s+=fade(gc,poly([Tq,Q,P],{fill:C.dim,fo:.08})+line(Tq[0],Tq[1],P[0],P[1],{color:CF,w:6,opacity:.75})+line(Q[0],Q[1],Tq[0],Tq[1],{color:CS,w:8,opacity:.6}));
  s+=fade(seg(p,.12,.2)*(1-done),label('折り返す',Q[0]+12,P[1]-12,{size:26,color:C.hi,weight:700}));
  s+=fade(done,label('6',(Tq[0]+P[0])/2+26,(Tq[1]+P[1])/2,{size:30,color:CF,weight:700})
   +label('60°',Tq[0]-42,Tq[1]-14,{size:24,color:C.ink,weight:700,anchor:'end'})+label('60°',P[0],P[1]+60,{size:24,color:C.ink,weight:700,anchor:'middle'})
   +label('底辺 6',Q[0]+75,Q[1]+44,{size:26,color:C.ink,anchor:'middle',weight:700}));
  // 半分を黄で
  const hb=seg(p,b+.05,b+.2);
  s+=fade(hb,line(Tp[0],Tp[1]+14,Q[0],Q[1]+14,{color:CS,w:10,cap:'butt'})+label('3 N',(Tp[0]+Q[0])/2,Q[1]+48,{size:30,color:CS,anchor:'middle',weight:700}));
  s+=card(720,110,450,330,label('60° の 直角三角形',945,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(done,label('折り返して 合わせる',945,215,{size:26,color:C.ink,anchor:'middle'})+label('→ 1辺 6 の 正三角形',945,265,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(hb,line(760,300,1130,300,{color:C.faint,w:2})+label('影 ＝ 底辺の 半分',945,350,{size:28,color:CS,anchor:'middle',weight:700})
    +T(`6\\div2={\\color{${CS}}3\\ \\mathrm{N}}`,945,410,40)),seg(p,0,.1));
  s+=LEG(1);
  return s+goalTag(G1);
 },
 // 4. 仕事＝影の力×距離＝12 J。F–x グラフの長方形。小問1 の答え C
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=scene({dimF:.5,fLab:'6 N'})+shadowOnFloor({lab:'影 3 N'});
  const {A,svg}=graph({g:seg(p,0,.08)});
  s+=svg+gRect(A,3,{g:seg(p,.12,.4),lab:'12 J',labG:seg(p,.35,.45)});
  s+=fade(seg(p,.1,.2),line(A.X(4)+12,A.Y(0),A.X(4)+12,A.Y(3),{color:CS,w:4})+label('3 N',A.X(4)+20,A.Y(1.5)+8,{size:24,color:CS,weight:700}));
  s+=fade(seg(p,.2,.3),label('4 m',(A.X(0)+A.X(4))/2,A.Y(3)-14,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.4),T(`3\\times4={\\color{${CE}}12\\ \\mathrm{J}}`,420,445,40));
  s+=LEG(1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 5. 上向きの成分（桃）は直角で仕事 0。誤答 B
 [K+'wrong1a']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene({dimF:.5,fLab:'6 N'})+shadowOnFloor({lab:'',gl:0});
  s+=comps({ga:1,gp:seg(p,.03,.15),lp:'上向きの 成分',right:seg(p,.15,.25)});
  s+=fade(seg(p,.25,.35)*(1-seg(p,b-.02,b+.02)),label('直角 → 仕事 0',TIP[0]+16,(TY+TIP[1])/2+40,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,b,b+.08),label('約 5.2 N',TIP[0]+16,(TY+TIP[1])/2+40,{size:24,color:CP,weight:700}));
  const {A,svg}=graph();
  s+=svg+gRect(A,3,{lab:'12 J'});
  s+=wrongCard('B','約 21 J','上向きの成分 5.2 N を使った',{...WOPT,g:seg(p,b+.02,b+.07)});
  s+=LEG(1);
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. 誤答 A（斜めの 6 N をそのまま）→ 誤答 D（距離を掛けていない）。グラフに高さ 6 の点線の長方形と赤の ×
 [K+'wrong1b']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene({fLab:'6 N'})+shadowOnFloor({lab:'影 3 N',gl:0});
  const {A,svg}=graph();
  const gA=seg(p,.05,.15)*(1-seg(p,b-.04,b));
  s+=svg+gRect(A,3,{lab:'12 J'});
  s+=fade(gA,gRect(A,6,{color:CN,fo:.05,dash:'9 7'})+label('×',A.X(2),A.Y(4.6)+16,{size:56,color:CN,anchor:'middle',weight:700}));
  s+=wrongSeq(p,ctx,[['A','24 J','影でない部分まで数えた'],['D','3 J','距離 4 m を掛けていない']],{opts:WOPT});
  s+=LEG(1);
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=scene({dimF:.6,hiFr:seg(p,.2,.35)});
  const {A,svg}=graph();
  s+=svg+fade(.5,gRect(A,3,{lab:'12 J'}));
  return s+goalTag(G2,{g:seg(p,.02,.12)});
 },
 // 8a. 摩擦は左向き → F＝−1 N
 [K+'fric']:(p)=>{
  let s=scene({dimF:.6,hiFr:1,frLab:'摩擦'});
  s+=fade(seg(p,.25,.4),rect(40,FY-160,150,48,{fill:CN,fo:.15,stroke:CN,sw:2.5,rx:10})+label('F ＝ −1 N',115,FY-127,{size:26,color:CN,anchor:'middle',weight:700}));
  const {A,svg}=graph();
  s+=svg+fade(.5,gRect(A,3,{lab:'12 J'}));
  return s+goalTag(G2);
 },
 // 8b. 符号を付けたまま距離を掛ける：−1×4＝−4 J。横軸の下に赤の長方形
 [K+'fric2']:(p)=>{
  let s=scene({dimF:.6,frLab:'摩擦'});
  s+=rect(40,FY-160,150,48,{fill:CN,fo:.15,stroke:CN,sw:2.5,rx:10})+label('F ＝ −1 N',115,FY-127,{size:26,color:CN,anchor:'middle',weight:700});
  const {A,svg}=graph();
  s+=svg+fade(.5,gRect(A,3,{lab:'12 J'}))+gRect(A,-1,{g:seg(p,.3,.6),color:CN,fo:.4});
  s+=fade(seg(p,.55,.65),NEG4(A));
  s+=fade(seg(p,.4,.55),T(`-1\\times4={\\color{${CN}}-4\\ \\mathrm{J}}`,420,445,40));
  return s+goalTag(G2);
 },
 // 9. 負の仕事＝取り出したエネルギー（熱の波マーク）。小問2 の答え B
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=scene({dimF:.6,frLab:'摩擦'});
  const {A,svg}=graph();
  s+=svg+fade(.5,gRect(A,3,{lab:'12 J'}))+gRect(A,-1,{color:CN,fo:.4});
  s+=NEG4(A);
  s+=heat(A,seg(p,.05,.15),cueT(ctx));
  s+=card(40,402,660,104,label('負の 仕事 ＝ 摩擦が 箱から',370,444,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('エネルギーを 取り出した',370,484,{size:26,color:CN,anchor:'middle',weight:700}),seg(p,.08,.18),CN);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 10. 誤答 A・C・D を一枚ずつ
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),m=W[0][1]*.48;
  let s=scene({dimF:.6,frLab:'摩擦'});
  const {A,svg}=graph();
  s+=svg+fade(.5,gRect(A,3,{lab:'12 J'}))+gRect(A,-1,{color:CN,fo:.4})+NEG4(A);
  s+=wrongSeq(p,ctx,[['A','＋4 J','左向きなのに正にした'],['C','−1 J','距離を掛けていない（単位 N）'],['D','0 J','摩擦も進む向きと逆向きの力']],{win:[[0,m],[m,W[0][1]],[W[1]?W[1][0]:.6,1]],opts:WOPT});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 11. 4 m 先の速さ。4 m 先に箱の輪郭と「v ？」
 [K+'goal3']:(p)=>{
  let s=scene({});
  s+=fade(seg(p,.15,.35),rect(BX+4*MP-BW,FY-BH,BW,BH,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:6}).replace('/>',' stroke-dasharray="8 7"/>')
   +arrow(BX+4*MP-BW/2-30,FY-BH-34,BX+4*MP-BW/2+50,FY-BH-34,{color:CV,w:6,head:16})+label('v ？',BX+4*MP-BW/2+60,FY-BH-24,{size:28,color:CV,weight:700}));
  const {A,svg}=graph();
  s+=svg+gRect(A,3,{lab:'12 J'})+gRect(A,-1,{color:CN,fo:.4})+NEG4(A);
  return s+goalTag(G3,{g:seg(p,.02,.12)});
 },
 // 12. 法則：仕事の合計＝K の増え分。下の長方形を上の長方形の上端へ運んで引く → 8 J
 [K+'sum3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const {A,svg}=graph();
  const mv=seg(p,b-.05,b+.2),gone=seg(p,b+.2,b+.3);
  let s=svg+gRect(A,2,{})+fade(1-gone*.75,gRect(A,1,{dy:2,fo:.35}));
  s+=gRect(A,-1,{color:CN,fo:.4,dy:mix(0,3,mv)});
  s+=fade(1-mv,NEG4(A));
  s+=fade(1-seg(p,b-.05,b),label('12 J',(A.X(0)+A.X(4))/2,A.Y(1.5)+11,{size:30,color:CE,anchor:'middle',weight:700}));
  s+=fade(gone,label('8 J',(A.X(0)+A.X(4))/2,A.Y(1)+11,{size:34,color:CE,anchor:'middle',weight:700}));
  s+=card(40,110,660,330,kindTag('法則',370,170,{g:seg(p,.03,.12)})
   +fade(seg(p,.05,.15),label('仕事の 合計（符号付き）',370,240,{size:28,color:C.ink,anchor:'middle',weight:700})
    +label('＝ K の 増え分',370,290,{size:30,color:CE,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),T(`12+(-4)={\\color{${CE}}8\\ \\mathrm{J}}`,370,380,46)),1,CF);
  return s+goalTag(G3);
 },
 // 13a. 静止 → 8 J が K（カット：棒）。13b. ½×4×v²＝8 → v²＝4 → v＝2.0 m/s、箱に速度の矢印
 [K+'speed']:(p)=>speedScene({gb:seg(p,.1,.7)})+goalTag(G3),
 [K+'speed2']:(p)=>speedScene({e1:seg(p,.02,.1),e2:seg(p,.35,.45),e3:seg(p,.6,.7),ga:seg(p,.72,.85)})+goalTag(G3),
 // 14. 小問3 の答え B。12 J・16 J・8 J の棒（正しい 8 J を光らせる）。誤答 A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  return bars({hi8:seg(p,.05,.15),hi12:seg(p,b,b+.08)})+wrongCard('A','約 2.4 m/s','摩擦の −4 J を入れていない',{...WOPT,x:150,w:900,y:400,g:seg(p,b+.02,b+.07)})
   +goalTag(G3)+ANS3(seg(p,.03,.1));
 },
 // 15. 誤答 C（16 J）→ 誤答 D（½ を落とした）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  return bars({hi8:1,hi16:seg(p,.03,.1)*(1-seg(p,b-.04,b))})
   +wrongSeq(p,ctx,[['C','約 2.8 m/s','12＋4＝16 J と符号なしで足した'],['D','約 1.4 m/s','K＝½mv² の ½ を落とした']],{opts:{...WOPT,x:150,w:900}})
   +goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(40,110,640,330,label('仕事 ＝ 進む向きの 成分 × 距離',360,175,{size:28,color:CS,anchor:'middle',weight:700})
   +fade(seg(p,.25,.35),label('逆向きの 力の 仕事は 負',360,245,{size:28,color:CN,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.1),line(80,285,640,285,{color:C.faint,w:2})+label('符号を 付けたまま 足す',360,335,{size:28,color:C.ink,anchor:'middle',weight:700})
    +label('→ 受け取った エネルギー',360,390,{size:28,color:CE,anchor:'middle',weight:700})),seg(p,0,.08));
  const {A,svg}=graph();
  s+=svg+gRect(A,3,{lab:'＋12 J',g:seg(p,.05,.15)})+fade(seg(p,.25,.35),gRect(A,-1,{color:CN,fo:.4})+NEG4(A));
  s+=answerRow([[1,'C','12 J'],[2,'B','−4 J'],[3,'B','2.0 m/s']],{g:seg(p,.8,.9)});
  return s;
 },
};

function speedScene({gb=1,e1=0,e2=0,e3=0,ga=0}={}){
 let s='';const bh=8*28*gb;
 s+=line(70,440,250,440,{color:C.dim,w:2})+rect(110,440-bh,80,bh,{fill:CE,fo:.55,stroke:CE,sw:2})+label('K',150,475,{size:28,color:CE,anchor:'middle',weight:700});
 s+=fade(seg(gb,.9,1),label('8 J',150,440-8*28-14,{size:30,color:CE,anchor:'middle',weight:700}));
 s+=label('静止から',150,120,{size:24,color:C.dim,anchor:'middle'});
 s+=card(300,100,520,340,'',e1);
 s+=fade(e1,T(`\\tfrac{1}{2}\\times4\\times{\\color{${CV}}v}^2=8`,560,175,44));
 s+=fade(e2,T(`{\\color{${CV}}v}^2=4`,560,275,44));
 s+=fade(e3,T(`{\\color{${CV}}v=2.0\\ \\mathrm{m/s}}`,560,375,48));
 s+=fade(e1,ground(860,1180,440)+rect(900,370,100,70,{fill:'#7a5a3c',fo:.55,stroke:'#c9a27a',sw:3,rx:6})+label('4 kg',950,413,{size:24,color:C.ink,anchor:'middle',weight:700}));
 s+=arrow(1010,400,1150,400,{color:CV,w:6,head:18,g:ga})+fade(ga,label('2.0 m/s',1080,370,{size:26,color:CV,anchor:'middle',weight:700}));
 return s;
}
// 小問3 の棒（12 J・16 J・8 J）と、その速さ
function bars({hi8=0,hi12=0,hi16=0}={}){
 const base=370,sc=13,items=[[12,'12 J','v ≈ 2.4',300,hi12],[16,'16 J','v ≈ 2.8',600,hi16],[8,'8 J','v ＝ 2.0',900,hi8]];
 let s=line(180,base,1020,base,{color:C.dim,w:2});
 for(const [E,t,v,x,h] of items){const ok=E===8;
  s+=rect(x-50,base-E*sc,100,E*sc,{fill:ok?CE:C.dim,fo:ok?.55:.3,stroke:ok?CE:C.dim,sw:2});
  s+=label(t,x,base-E*sc-14,{size:28,color:ok?CE:C.dim,anchor:'middle',weight:700});
  s+=label(v,x+64,base-20,{size:24,color:ok?CV:C.dim,weight:700});
  if(h)s+=fade(h,highlight(x-70,base-E*sc-56,250,E*sc+66,1,ok?C.hi:CN));
 }
 s+=label('運動エネルギー K',180,110,{size:24,color:CE,weight:700});
 return s;
}
