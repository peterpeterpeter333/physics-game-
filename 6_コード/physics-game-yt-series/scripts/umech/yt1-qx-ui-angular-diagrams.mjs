// 問題編 解説「幅 1.2 m のドア」（q-ui-angular、大学編 15 角運動量・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/15_角運動量.md の q-ui-angular（解説 20 行）。
// 画面：左に真上から見たドア（蝶番は左、ドアは右へ）、右に説明の枠。誤答カードは枠の下に1枚ずつ。左下に色の凡例（ずっと置く）。
// 色（単元動画と同じ）：𝐫 水色、𝐅 緑、トルク 𝐍 桃、垂直な距離 黄、角 θ 橙、強調 黄（塗りは使わず太い枠線）、誤り 赤。
// 図のために決めた長さ：力 1 N＝20 px（5 N と 10 N の比は保つ）。ドア 1 m＝380 px（解説）／460 px（問題アニメ）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,esc} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,legend,kindTag,textW,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-ui-angular:';
const CR=C.x,CF=C.F,CN=C.p,CQ=C.hi,CTH=C.E,CD='#ff6b6b',CDOOR='#8a94a6',CFL='#4f8f74';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const T=(s,x,y,size=34,o={})=>tex(s,x,y,{size,auto:false,...o});
const bv=(c,n)=>`{\\color{${c}}\\mathbf{${n}}}`;
const KF=20,A30=Math.PI/6;
const O1={hx:90,hy:262,ppm:380},O2={hx:70,hy:262,ppm:340},OP={hx:300,hy:270,ppm:460};
const G1='トルクの大きさ N',G2='斜めに押したときのトルク',G3='回る向きと、残るトルク';
const ANS1=g=>answerTag(1,'B','3.0 N·m',{g}),ANS2=g=>answerTag(2,'C','3.0 N·m',{g}),ANS3=g=>answerTag(3,'D','時計回りに 1.0 N·m',{g});
const LEG=(g=1)=>legend([['トルク N',CN],['垂直な距離',CQ],['角 θ',CTH]],PX+14,500,{g,dir:'row'});

// 色つきの文字を左から並べる（中央そろえ）。parts＝[[文字,色,太さ],...]。各部品の [左端,右端] を返す。
// 一つの <text> に色ごとの <tspan> を並べる（幅はフォントに任せる）。parts＝[[文字,色,太さ,不透明度],...]
function row(parts,cx,y,size=30,anchor='middle'){
 const sp=parts.map(([t,c,w,o])=>`<tspan fill="${c??C.ink}" font-weight="${w??700}"${o!=null&&o<1?` fill-opacity="${Math.max(0,o).toFixed(3)}"`:''}>${esc(t)}</tspan>`).join('');
 return {svg:`<text x="${cx}" y="${y}" font-size="${size}" text-anchor="${anchor}" xml:space="preserve">${sp}</text>`};
}
const rowS=(parts,cx,y,size)=>row(parts,cx,y,size).svg;
const pt=(d,o)=>[o.hx+d*o.ppm,o.hy];
const dirv=a=>[Math.cos(a),-Math.sin(a)];   // 画面の向き（a は ＋x から反時計回り）
function rightMark(x,y,ux,uy,vx,vy,q=16,color=C.dim,w=2.5){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w});}
function outSym(x,y,r=20,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=20,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function turnArc(cx,cy,r,a0,a1,{color=CN,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const rot=(deg,x,y,svg)=>Math.abs(deg)<.01?svg:`<g transform="rotate(${deg.toFixed(2)} ${x} ${y})">${svg}</g>`;

// ---- ドア（真上から） ----
function door(o,{g=1,len=1,hinge=1,axisLab=1,lenLab=1,ghost=0}={}){
 const [ex,ey]=pt(1.2*len,o);
 let s=line(o.hx,o.hy,ex,ey,{color:CDOOR,w:14,cap:'butt'});
 if(hinge)s+=ring(o.hx,o.hy,11,{color:C.ink,w:3,fill:C.bg});
 if(axisLab===1)s+=label('軸',o.hx-22,o.hy+9,{size:26,color:C.ink,anchor:'end',weight:700});
 if(axisLab==='below')s+=label('軸',o.hx,o.hy+50,{size:26,color:C.ink,anchor:'middle',weight:700});
 if(lenLab)s+=fade(lenLab,label('1.2 m',ex,o.hy+46,{size:24,color:C.dim,anchor:'middle'}));
 return fade(g,s);
}
// 𝐫：軸から押す点へ（ドアの線の上）。text はその上の札
function rVec(d,o,{g=1,text='',textColor=CR,glow=0,lab=1}={}){
 const [px,py]=pt(d,o);
 let s='';
 if(glow>0)s+=fade(glow*.6,line(o.hx,o.hy,px,py,{color:CR,w:16,opacity:.45}));
 s+=arrow(o.hx+10,o.hy,px,py,{color:CR,w:5,head:16});
 const mx=(o.hx+px)/2;
 if(lab)s+=T(bv(CR,'r'),mx-(text?textW(text,26)/2+18:0),o.hy-22,32);
 if(text)s+=label(text,mx+14,o.hy-16,{size:26,color:textColor,anchor:'middle',weight:700});
 return fade(g,s);
}
// 力：押す点 d から向き a へ（尾が押す点）
function force(d,a,F,o,{g=1,text='',color=CF,w=6,anchor='start',dx=12,dy=0,grow=1}={}){
 const [px,py]=pt(d,o),[ux,uy]=dirv(a),L=F*KF;
 let s=dot(px,py,7,C.ink)+arrow(px,py,px+ux*L,py+uy*L,{color,w,g:grow});
 if(text)s+=fade(seg(grow,.8,1),label(text,px+ux*L+dx,py+uy*L+dy,{size:26,color,weight:700,anchor}));
 return fade(g,s);
}
// 直角に押すときの直角の印（ドアと力の間）
const perpMark=(d,o,up=1,g=1)=>{const [px,py]=pt(d,o);return fade(g,rightMark(px,py,-1,0,0,-up));};
// 作用線（力の向き a の直線）を前後に点線で
function actionLine(d,a,o,{g=1,back=260,fwd=200,lab=1,labAt=-.6}={}){
 const [px,py]=pt(d,o),[ux,uy]=dirv(a);
 let s=line(px-ux*back,py-uy*back,px+ux*fwd,py+uy*fwd,{color:CF,w:2.5,dash:'10 8'});
 if(lab)s+=label('作用線',px+ux*back*labAt+14,py+uy*back*labAt+8,{size:24,color:CF,weight:700});
 return fade(g,s);
}
// 軸から作用線への垂線の足
function foot(d,a,o){const [px,py]=pt(d,o),[ux,uy]=dirv(a),k=(o.hx-px)*ux+(o.hy-py)*uy;return [px+k*ux,py+k*uy];}
function perpLine(d,a,o,{g=1,w=7,mark=1,text='',tx=0,ty=0}={}){
 const [fx,fy]=foot(d,a,o);const L=Math.hypot(fx-o.hx,fy-o.hy);
 let s=line(o.hx,o.hy,fx,fy,{color:CQ,w});
 if(mark&&L>20){const ex=(o.hx-fx)/L,ey=(o.hy-fy)/L,[ux,uy]=dirv(a);s+=rightMark(fx,fy,ex,ey,ux,uy,16,C.dim);}
 if(text)s+=label(text,(o.hx+fx)/2+tx,(o.hy+fy)/2+ty,{size:26,color:CQ,weight:700});
 return fade(g,s);
}
// θ の弧（押す点で、𝐫 の延長（＋x）と力の間）
function thetaArc(d,a,o,{g=1,text='30°',glow=0}={}){
 const [px,py]=pt(d,o);
 let s=line(px,py,px+90,py,{color:C.dim,w:2,dash:'5 6'})+draw(circPts(px,py,52,0,a,20),1,{color:CTH,w:4+3*glow});
 if(text)s+=label(text,px+70,py-14,{size:26,color:CTH,weight:700});
 return fade(g,s);
}
// 押す人の手（d の点、up＝1 なら下の面から上へ押す）
function hand(d,o,up=1,g=1){
 const [px,py]=pt(d,o),s0=up>0?1:-1,y0=py+s0*9;
 const fy=y0+(s0>0?0:-40);
 let s=rect(px-17,fy,34,40,{fill:'#f0c8a0',fo:.9,stroke:'#c99b72',sw:2,rx:13});
 s+=rect(px-14,y0+s0*38+(s0>0?0:-26),28,26,{fill:'#5a6d8f',fo:.95,stroke:'#41506b',sw:2,rx:5});
 for(const q of [-8,0,8])s+=line(px+q,y0+s0*4,px+q,y0+s0*16,{color:'#c99b72',w:2});
 return fade(g,s);
}
// 寸法線（軸から d まで、y＝o.hy＋off）
function dim(d,o,off,text,{g=1,color=CR}={}){
 const [px]=pt(d,o),y=o.hy+off;
 return fade(g,line(o.hx,y,px,y,{color,w:2.5})+line(o.hx,y-9,o.hx,y+9,{color,w:2.5})+line(px,y-9,px,y+9,{color,w:2.5})
  +label(text,(o.hx+px)/2,y+(off<0?-12:32),{size:26,color,anchor:'middle',weight:700}));
}
const xyMark=(x,y,g=1)=>fade(g,arrow(x,y,x+50,y,{color:C.dim,w:3,head:12})+arrow(x,y,x,y-50,{color:C.dim,w:3,head:12})+label('x',x+58,y+8,{size:24,color:C.dim})+label('y',x-6,y-60,{size:24,color:C.dim,anchor:'middle'}));

// ---- 小問ごとの図 ----
function scene1(o,{g=1,rG=1,fG=1,mark=1,rText='0.60 m',rTextColor=CR,glowR=0}={}){
 return fade(g,door(o)+rVec(.6,o,{g:rG,text:rText,textColor:rTextColor,glow:glowR})+force(.6,Math.PI/2,5,o,{g:fG,text:'5 N'})+perpMark(.6,o,1,mark*fG));
}
function scene2(o,{g=1,rG=1,fG=1,th=1,a=A30,ftext='5 N'}={}){
 return fade(g,door(o)+rVec(1.2,o,{g:rG,text:'1.2 m'})+force(1.2,a,5,o,{g:fG,text:ftext,anchor:'end',dx:-16,dy:-6})+thetaArc(1.2,a,o,{g:th*fG}));
}
function scene3(o,{g=1,dims=1,hands=1,f1=1,f2=1,axisLab=1}={}){
 let s=door(o,{axisLab});
 s+=fade(dims,dim(.6,o,-86,'0.60 m')+dim(.4,o,46,'0.40 m'));
 s+=force(.6,Math.PI/2,5,o,{g:f1,text:'5 N'})+force(.4,-Math.PI/2,10,o,{g:f2,text:'10 N',dy:0});
 s+=hand(.6,o,1,hands*f1)+hand(.4,o,-1,hands*f2);
 return fade(g,s);
}
// 小問ごとの右の枠（与えた量）
const givenPanel=(lines,g=1,h=200)=>panel(92,h,lines.map(([t,c,sz],i)=>label(t,PC,140+i*50,{size:sz??28,color:c??C.ink,anchor:'middle',weight:700})).join(''),g);
// 定義の式 N ＝ F ×（垂直な距離）
const defRow=(cx,y,size=32)=>row([['N',CN],[' ＝ ',C.ink],['F',CF],[' ×（',C.ink],['垂直な距離',CQ],['）',C.ink]],cx,y,size);
// 誤答カードの理由の一部に赤の下線
function underline(why,part,{x=PX,w=PW,y,size=26,whySize=22,g=1}={}){
 const full=textW(why,whySize),i=why.indexOf(part),x0=x+w/2-full/2+textW(why.slice(0,i),whySize),yy=y+size+24+(whySize+12)-4+8;
 return fade(g,line(x0,yy,x0+textW(part,whySize)-4,yy,{color:CD,w:3.5}));
}
// トルクの棒（縦。up＝⊙、down＝⊗）。1 N·m＝k px
function tbar(x,y0,val,dir,{k=36,g=1,w=46,color=CN,fo=.55}={}){
 const h=val*k;return fade(g,rect(x-w/2,dir>0?y0-h:y0,w,h,{fill:color,fo,stroke:color,sw:2,rx:4}));
}

export const ytQxUiAngularDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1（約4秒）：0〜2 s ドアと蝶番、2〜4 s 𝐫（0.60 m）と直角の力 5 N、直角の印。静止。
 [K+'q1']:(p)=>{
  const gd=seg(p,0,.4);
  let s=fade(gd,door(OP))+xyMark(1080,120,seg(p,.1,.4));
  s+=rVec(.6,OP,{g:seg(p,.5,.7),text:'0.60 m'});
  s+=force(.6,Math.PI/2,5,OP,{g:seg(p,.6,.75),grow:seg(p,.6,.85),text:'5 N'})+perpMark(.6,OP,1,seg(p,.85,.95));
  return s;
 },
 // 小問2（約4秒）：小問1の力・直角の印・札を消す → 𝐫 が端（1.2 m）まで伸びる → 30° の力 5 N と橙の弧。静止。
 [K+'q2']:(p)=>{
  const out=1-seg(p,0,.18),ext=seg(p,.22,.5);
  let s=door(OP)+xyMark(1080,120);
  s+=force(.6,Math.PI/2,5,OP,{g:out,text:'5 N'})+perpMark(.6,OP,1,out);
  const d=.6+.6*ext;
  s+=rVec(d,OP,{text:ext>.98?'1.2 m':(ext<.02?'0.60 m':''),g:1});
  s+=force(1.2,A30,5,OP,{g:seg(p,.55,.65),grow:seg(p,.55,.78),text:'5 N',anchor:'end',dx:-16,dy:-6})+thetaArc(1.2,A30,OP,{g:seg(p,.78,.92)});
  return s;
 },
 // 小問3（約5秒）：小問2の斜めの力・弧・1.2 m の 𝐫 を消す → 1人目（0.60 m・5 N）と2人目（反対の面、0.40 m・10 N）を同時に。手の絵2つ。静止。
 [K+'q3']:(p)=>{
  const out=1-seg(p,0,.15);
  let s=door(OP)+xyMark(1080,120);
  s+=fade(out,rVec(1.2,OP,{text:'1.2 m'})+force(1.2,A30,5,OP,{text:'5 N',anchor:'end',dx:-16,dy:-6})+thetaArc(1.2,A30,OP));
  const gi=seg(p,.25,.45),gr=seg(p,.3,.6);
  s+=fade(gi,dim(.6,OP,-86,'0.60 m')+dim(.4,OP,46,'0.40 m'));
  s+=force(.6,Math.PI/2,5,OP,{g:gi,grow:gr,text:'5 N'})+force(.4,-Math.PI/2,10,OP,{g:gi,grow:gr,text:'10 N'});
  s+=hand(.6,OP,1,seg(p,.55,.75))+hand(.4,OP,-1,seg(p,.55,.75));
  s+=fade(seg(p,.7,.85),label('1人目',pt(.6,OP)[0]+44,OP.hy+52,{size:24,color:C.dim})+label('2人目',pt(.4,OP)[0]-36,OP.hy-30,{size:24,color:C.dim,anchor:'end'}));
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 出題中の小問1の図。右の枠に与えた量。札「求めるもの」
 [K+'goal1']:(p)=>{
  let s=scene1(O1)+LEG();
  s+=givenPanel([['小問1',C.dim,26],['押す点：蝶番から 0.60 m',CR],['力：5 N（ドアに 直角）',CF]],seg(p,.05,.2),190);
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 定義 N＝F×（垂直な距離）。「回す効き目」でドアの影を少し回して戻す
 [K+'def']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,u=clamp(p/b),bump=Math.sin(Math.PI*clamp((u-.2)/.7));
  let s=fade(.35*(u>.15&&u<.95?1:0),rot(-10*bump,O1.hx,O1.hy,door(O1,{axisLab:0,lenLab:0})));
  s+=scene1(O1)+LEG();
  s+=panel(92,250,kindTag('定義',PC,140)+label('トルク ＝ ドアを 回す 効き目',PC,192,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+defRow(PC,262,32).svg+label('垂直な距離：軸から 作用線まで',PC,312,{size:24,color:C.dim,anchor:'middle'})),seg(p,.03,.15));
  s+=goalTag(G1);
  return s;
 },
 // 3. 作用線（力の矢印を前後に点線）→ 軸から作用線へ垂線（黄）。𝐫 と重なる → 札「0.60 m」を黄に
 [K+'line1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,gl=seg(p,.05,.2),gp=seg(p,b+.05,b+.2),glow=Math.sin(Math.PI*clamp((p-b-.22)/.25));
  let s=door(O1)+fade(gp,perpLine(.6,Math.PI/2,O1,{w:9,mark:0}));
  s+=rVec(.6,O1,{text:'0.60 m',textColor:gp>.5?CQ:CR,glow:Math.max(0,glow)});
  s+=force(.6,Math.PI/2,5,O1,{text:'5 N'})+perpMark(.6,O1,1,1);
  s+=actionLine(.6,Math.PI/2,O1,{g:gl,back:150,fwd:60,labAt:-.75})+LEG();
  const d=defRow(PC,150,30);
  s+=panel(92,250,d.svg+fade(gl,label('作用線 ＝ 力の 矢印を 前後に 伸ばした 線',PC,215,{size:24,color:CF,anchor:'middle',weight:700}))
   +fade(gp,line(PX+40,245,PX+PW-40,245,{color:C.faint,w:2})+row([['直角に 押すと',C.dim,400]],PC,290,24).svg+row([['垂直な距離 ＝ 0.60 m',CQ]],PC,328,30).svg),1);
  s+=goalTag(G1);
  return s;
 },
 // 4. 0.60（黄）と 5（緑）を一つずつ入れて 3.0 N·m（桃）。答えの札 B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=door(O1)+perpLine(.6,Math.PI/2,O1,{w:9,mark:0})+rVec(.6,O1,{text:'0.60 m',textColor:CQ})+force(.6,Math.PI/2,5,O1,{text:'5 N'})+perpMark(.6,O1,1,1)+LEG();
  const g06=seg(p,.08,.18),g5=seg(p,.2,.3);
  let inner=defRow(PC,150,30).svg;
  inner+=row([['＝ ',C.ink,700,g06],['5',CF,700,g5],[' × ',C.ink,700,g5],['0.60',CQ,700,g06]],PC,215,34).svg;
  inner+=fade(seg(p,.36,.48),row([['＝ ',C.ink],['3.0 N·m',CN]],PC,290,42).svg);
  s+=panel(92,250,inner,1,C.faint);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 5. 誤答 A（ドアの幅 1.2 m）。押す点を端へ動かす薄い影 → 端なら 1.2 m・6.0 N·m。実際の押す点（0.60 m）を黄で
 [K+'wrongA1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,mv=seg(p,b+.02,b+.25),back=seg(p,b+.5,b+.62);
  let s=scene1(O1,{rTextColor:CQ})+LEG();
  const gg=(mv>0?1:0)*(1-back),dd=.6+.6*mv;
  s+=fade(.5*gg,force(dd,Math.PI/2,5,O1)+line(O1.hx,O1.hy+20,pt(dd,O1)[0],O1.hy+20,{color:CQ,w:6}));
  s+=fade(gg*seg(mv,.9,1),label('端なら 1.2 m → 6.0 N·m',pt(1.2,O1)[0]-230,O1.hy+80,{size:24,color:C.dim,weight:700}));
  const [px,py]=pt(.6,O1);s+=fade(back,ring(px,py,22,{color:CQ,w:5}));
  s+=panel(92,150,label('小問1',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['5 × 0.60 ＝ ',C.ink],['3.0 N·m',CN]],PC,195,32).svg,1);
  s+=wrongCard('A','6.0 N·m','ドアの幅 1.2 m を使った',{...WOPT,y:262,g:seg(p,.02,.06)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6. 誤答 C → D（1枚ずつ）。単位に赤の下線
 [K+'wrongCD1']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.5,b=W[1]?W[1][0]:e1;
  const gC=seg(p,.01,.05)*(1-seg(p,m-.04,m)),gD=seg(p,m+.01,m+.05);
  let s=scene1(O1,{rTextColor:CQ})+LEG();
  s+=panel(92,150,label('小問1',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['5 × 0.60 ＝ ',C.ink],['3.0 N·m',CN]],PC,195,32).svg,1);
  const wC='5÷0.60（単位 N/m）',wD='距離だけ（単位 m）';
  s+=wrongCard('C','約 8.3 N·m',wC,{...WOPT,y:262,g:gC})+underline(wC,'N/m',{y:262,g:gC});
  s+=wrongCard('D','0.60 N·m',wD,{...WOPT,y:262,g:gD})+underline(wD,'単位 m',{y:262,g:gD*seg(p,b,b+.05)});
  s+=fade(gD*seg(p,b,b+.05),label('トルクの 単位は N·m',PC,410,{size:26,color:CN,anchor:'middle',weight:700}));
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 出題中の小問2の図（𝐫 1.2 m、30° の力 5 N）
 [K+'goal2']:(p)=>{
  let s=scene2(O2)+LEG();
  s+=givenPanel([['小問2',C.dim,26],['押す点：ドアの 端（1.2 m）',CR],['力：5 N（ドアから 30°）',CF]],seg(p,.05,.2),190);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 8. 斜めの作用線を前後に。軸から作用線へ垂線（黄）と直角の印。垂線は 𝐫 より短い
 [K+'line2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,gl=seg(p,b,b+.12),gp=seg(p,b+.2,b+.38);
  let s=scene2(O2)+actionLine(1.2,A30,O2,{g:gl,back:560,fwd:40,labAt:-.82})+perpLine(1.2,A30,O2,{g:gp})+LEG();
  const d=defRow(PC,150,30);
  s+=panel(92,200,d.svg+fade(seg(p,.05,.15),label('斜めの 力でも 同じ やり方',PC,210,{size:26,color:C.ink,anchor:'middle',weight:700}))
   +fade(gp,label('垂線は 𝐫 より 短い',PC,262,{size:26,color:CQ,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 // 9. 直角三角形（𝐫・垂線・作用線）を薄い黄で。30° を光らせ、垂線の横に 1.2×sin30°＝0.60 m
 [K+'tri2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,gt=seg(p,.05,.2),glow=seg(p,b,b+.08)*(1-seg(p,b+.3,b+.4));
  const [ex,ey]=pt(1.2,O2),[fx,fy]=foot(1.2,A30,O2);
  let s=fade(gt*.9,poly([[O2.hx,O2.hy],[fx,fy],[ex,ey]],{fill:CQ,fo:.13,stroke:CQ,sw:1.5}));
  s+=door(O2)+rVec(1.2,O2,{text:'斜辺 1.2 m'})+force(1.2,A30,5,O2,{text:'5 N',anchor:'end',dx:-16,dy:-6})+thetaArc(1.2,A30,O2,{glow})+actionLine(1.2,A30,O2,{back:560,fwd:40,lab:0})+perpLine(1.2,A30,O2);
  s+=fade(seg(p,b+.15,b+.3),label('1.2×sin30°',140,350,{size:24,color:CQ,weight:700})+label('＝ 0.60 m',156,382,{size:24,color:CQ,weight:700}));
  s+=LEG();
  s+=panel(92,230,label('直角三角形',PC,140,{size:28,color:CQ,anchor:'middle',weight:700})+label('斜辺 ＝ 𝐫（1.2 m）',PC,190,{size:26,color:CR,anchor:'middle',weight:700})
   +fade(seg(p,b+.15,b+.3),row([['垂直な距離 ＝ 1.2 × sin30°',CQ]],PC,250,26).svg+row([['＝ 0.60 m',CQ]],PC,295,30).svg),1);
  s+=goalTag(G2);
  return s;
 },
 // 10. 5×0.60＝3.0。力をドアに沿う部分（薄い緑）と直角な部分（緑 2.5 N）に分け、1.2×2.5＝3.0
 [K+'calc2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,gs=seg(p,b,b+.15);
  const [ex,ey]=pt(1.2,O2),L=5*KF,cx=L*Math.cos(A30),cy=L*Math.sin(A30);
  let s=door(O2)+rVec(1.2,O2,{text:'1.2 m'})+perpLine(1.2,A30,O2,{text:'0.60 m',tx:18,ty:14})+force(1.2,A30,5,O2,{text:gs>.5?'':'5 N',anchor:'end',dx:-16,dy:-6,g:1-.6*gs});
  s+=fade(gs,arrow(ex,ey,ex+cx,ey,{color:CFL,w:5,head:14})+arrow(ex,ey,ex,ey-cy,{color:CF,w:7,head:16})
   +line(ex+cx,ey,ex+cx,ey-cy,{color:C.dim,w:1.5,dash:'4 5'})+line(ex,ey-cy,ex+cx,ey-cy,{color:C.dim,w:1.5,dash:'4 5'})
   +label('5×sin30°',ex-12,ey-cy-34,{size:24,color:CF,anchor:'end',weight:700})+label('＝ 2.5 N',ex-12,ey-cy-6,{size:24,color:CF,anchor:'end',weight:700}));
  s+=LEG();
  s+=panel(92,250,label('垂直な距離で',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['5 × 0.60 ＝ ',C.ink],['3.0 N·m',CN]],PC,182,32).svg
   +fade(gs,line(PX+40,212,PX+PW-40,212,{color:C.faint,w:2})+label('力を 分けて（直角な 部分）',PC,252,{size:24,color:C.dim,anchor:'middle'})+row([['1.2 × 2.5 ＝ ',C.ink],['3.0 N·m',CN]],PC,300,32).svg),1);
  s+=goalTag(G2);
  return s;
 },
 // 11. 𝐫 と 𝐅 の平行四辺形（薄い桃）。底辺 𝐅・高さ 0.60 → 底辺 𝐫・高さ 2.5。答えの札 C
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7,gp=seg(p,.03,.15),h1=seg(p,.18,.3)*(1-seg(p,.42,.48)),h2=seg(p,.48,.58);
  const [ex,ey]=pt(1.2,O2),L=5*KF,[ux,uy]=dirv(A30),[fx,fy]=foot(1.2,A30,O2);
  let s=fade(gp,poly([[O2.hx,O2.hy],[ex,ey],[ex+ux*L,ey+uy*L],[O2.hx+ux*L,O2.hy+uy*L]],{fill:CN,fo:.22,stroke:CN,sw:2}));
  s+=door(O2)+rVec(1.2,O2,{text:'1.2 m'})+force(1.2,A30,5,O2,{text:'5 N',anchor:'end',dx:-16,dy:-6});
  s+=fade(h1,line(O2.hx,O2.hy,fx,fy,{color:CQ,w:4,dash:'8 7'})+line(fx,fy,ex,ey,{color:CF,w:2,dash:'4 6'})+label('高さ 0.60 m',(O2.hx+fx)/2+14,(O2.hy+fy)/2+10,{size:24,color:CQ,weight:700}));
  s+=fade(h2,line(ex+ux*L,ey+uy*L,ex+ux*L,ey,{color:CF,w:4,dash:'8 7'})+label('高さ 2.5',ex+ux*L+10,ey+uy*L/2+8,{size:24,color:CF,weight:700}));
  s+=LEG();
  s+=panel(92,250,label('平行四辺形の 面積 ＝ 底辺 × 高さ',PC,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.18,.3),row([['底辺 𝐅：',CF],['5 × 0.60 ＝ ',C.ink],['3.0',CN]],PC,195,28).svg)
   +fade(h2,row([['底辺 𝐫：',CR],['1.2 × 2.5 ＝ ',C.ink],['3.0',CN]],PC,250,28).svg)
   +fade(seg(p,.6,.68),label('同じ 面積 ＝ トルク',PC,305,{size:26,color:CN,anchor:'middle',weight:700})),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 12. 誤答 A（sin30° を落とした）→ B（cos30°、ドアに沿う部分）。B の所で沿う部分に赤の×
 [K+'wrongAB2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const gA=seg(p,.01,.05)*(1-seg(p,b-.04,b)),gB=seg(p,b+.01,b+.05);
  const [ex,ey]=pt(1.2,O2),L=5*KF,cx=L*Math.cos(A30),cy=L*Math.sin(A30);
  let s=door(O2,{lenLab:1-gB})+rVec(1.2,O2,{text:'1.2 m'})+force(1.2,A30,5,O2,{text:'5 N',anchor:'end',dx:-16,dy:-6,g:1-.5*gB})+thetaArc(1.2,A30,O2,{text:''});
  s+=fade(gB,arrow(ex,ey,ex+cx,ey,{color:CFL,w:6,head:14})+arrow(ex,ey,ex,ey-cy,{color:CF,w:4,head:12,opacity:.5})
   +line(ex+cx/2-14,ey-14,ex+cx/2+14,ey+14,{color:CD,w:6})+line(ex+cx/2-14,ey+14,ex+cx/2+14,ey-14,{color:CD,w:6}));
  s+=LEG();
  s+=panel(92,150,label('小問2',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['5 × 0.60 ＝ ',C.ink],['3.0 N·m',CN]],PC,195,32).svg,1);
  s+=wrongCard('A','6.0 N·m','sin30° を落とした',{...WOPT,y:262,g:gA});
  s+=wrongCard('B','約 5.2 N·m','cos30°＝ドアに沿う部分を使った',{...WOPT,y:262,g:gB});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 13. 誤答 D（斜めだと回らない）。影で力の向きを 𝐫 に沿う向きまで回すと垂線が 0 になる → 元に戻す
 [K+'wrongD2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,turn=seg(p,b+.02,b+.2)*(1-seg(p,b+.4,b+.52)),a=A30*(1-turn);
  let s=door(O2)+rVec(1.2,O2,{text:'1.2 m'})+force(1.2,A30,5,O2,{text:'5 N',anchor:'end',dx:-16,dy:-6,g:turn>0?.35:1});
  if(turn>0){s+=force(1.2,a,5,O2,{color:CF})+(a>.02?perpLine(1.2,a,O2,{mark:0,w:6}):'')+actionLine(1.2,a,O2,{back:560,fwd:40,lab:0,g:.8});
   s+=fade(seg(turn,.9,1),label('作用線が 軸を 通る → 垂線 0',O2.hx+40,O2.hy+70,{size:24,color:CQ,weight:700}));}
  s+=LEG();
  s+=panel(92,150,label('小問2',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['5 × 0.60 ＝ ',C.ink],['3.0 N·m',CN]],PC,195,32).svg,1);
  s+=wrongCard('D','0 N·m',['斜めでも 作用線が 軸を','通らなければ 回る'],{...WOPT,y:262,g:seg(p,.01,.05)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 14. 出題中の小問3の図（2人の押す点と力）
 [K+'goal3']:(p)=>{
  let s=scene3(O1)+LEG();
  s+=givenPanel([['小問3',C.dim,26],['1人目：0.60 m・5 N（小問1と 同じ）',C.ink,26],['2人目：0.40 m・10 N',C.ink,26],['（反対側の 面から 押し返す）',C.dim,24]],seg(p,.05,.2),240);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 1人目：反時計回りの弧（桃）と 3.0 N·m。右ねじの絵で手前に進む向き → 軸の上に ⊙
 [K+'first3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=scene3(O1,{dims:1-seg(p,.02,.1)})+LEG();
  s+=turnArc(O1.hx,O1.hy,150,.25,1.25,{color:CN,w:5,g:seg(p,.1,.25)})+fade(seg(p,.15,.28),label('3.0 N·m',O1.hx+60,O1.hy-150,{size:26,color:CN,weight:700}));
  const go=seg(p,b+.2,b+.3);
  s+=outSym(O1.hx-22,O1.hy-64,20,CN,go);
  // 右ねじの小さな絵（右の枠の中）
  const sx=PX+90,sy=330,gs=seg(p,b,b+.1);
  let sc=turnArc(sx,sy,46,-.6,4.2,{color:CN,w:4})+outSym(sx,sy,16,C.ink);
  sc+=label('反時計回りに 回すと',sx+80,sy-12,{size:24,color:C.ink,weight:700})+label('右ねじは 手前へ 進む',sx+80,sy+28,{size:24,color:CN,weight:700});
  s+=panel(92,360,label('1人目（小問1と 同じ）',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['反時計回りに ',C.ink],['3.0 N·m',CN]],PC,182,30).svg
   +fade(gs,line(PX+40,210,PX+PW-40,210,{color:C.faint,w:2})+label('右ねじの 約束',PC,248,{size:24,color:C.dim,anchor:'middle'})+sc),1);
  s+=goalTag(G3);
  return s;
 },
 // 16. 2人目：垂線 0.40 m（黄）、時計回りの弧と 4.0 N·m。⊗ を ⊙ の横に
 [K+'second3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=scene3(O1,{dims:0})+LEG();
  s+=turnArc(O1.hx,O1.hy,150,.25,1.25,{color:CN,w:5,g:.35})+fade(.5,label('3.0 N·m',O1.hx+60,O1.hy-150,{size:26,color:CN,weight:700}));
  s+=fade(seg(p,.08,.2),line(O1.hx,O1.hy+12,pt(.4,O1)[0],O1.hy+12,{color:CQ,w:8})+label('0.40 m',O1.hx+6,O1.hy+42,{size:26,color:CQ,weight:700}));
  s+=turnArc(O1.hx,O1.hy,130,-.55,-1.15,{color:CN,w:5,g:seg(p,.25,.4)})+fade(seg(p,.3,.42),label('4.0 N·m',pt(.4,O1)[0]+14,O1.hy+130,{size:26,color:CN,weight:700}));
  s+=outSym(O1.hx-22,O1.hy-64,20,CN);
  s+=inSym(O1.hx+28,O1.hy-64,20,CN,seg(p,b,b+.08));
  s+=panel(92,250,label('1人目',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['⊙ 反時計回りに ',C.ink],['3.0 N·m',CN]],PC,175,28).svg
   +fade(seg(p,.05,.15),line(PX+40,200,PX+PW-40,200,{color:C.faint,w:2})+label('2人目（反対側から）',PC,238,{size:24,color:C.dim,anchor:'middle'})
   +row([['0.40 × 10 ＝ ',C.ink],['4.0 N·m',CN]],PC,282,30).svg)
   +fade(seg(p,b,b+.08),row([['⊗ 時計回り',C.ink]],PC,322,28).svg),1);
  s+=goalTag(G3);
  return s;
 },
 // 17. ⊙ 3.0 と ⊗ 4.0 の棒を上下逆向きに → 重なった 3.0 を打ち消し → ⊗ 1.0 が残る。ドアが時計回りにゆっくり回り始める。答えの札 D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,cn=seg(p,b+.05,b+.2),ans=b+(1-b)*.62;
  const tr=tAt(ctx,K+'ans3'),turn=Math.max(0,cueT(ctx)-(ctx?.dur??10)*(b+.25))*1.6;
  let fig=scene3(O1,{dims:0,axisLab:0});
  const sym=outSym(O1.hx-22,O1.hy-64,20,CN,.5);
  let s=rot(Math.min(turn,10),O1.hx,O1.hy,fig)+sym+inSym(O1.hx+28,O1.hy-64,20,CN)+label('軸',O1.hx-22,O1.hy+9,{size:26,color:C.ink,anchor:'end',weight:700})+LEG();
  s+=fade(seg(p,b+.25,b+.35),turnArc(O1.hx,O1.hy,130,-.55,-1.15,{color:CN,w:6})+label('時計回りに 回り始める',pt(.4,O1)[0]+16,O1.hy+150,{size:24,color:CN,weight:700}));
  // 棒（右の枠の中）。0 の線 y0、⊙ は上、⊗ は下
  const y0=320,x1=PC-130,x2=PC+10,k=30;
  let in2=line(PX+40,y0,PX+PW-40,y0,{color:C.dim,w:2})+label('0',PX+30,y0+8,{size:22,color:C.dim,anchor:'end'});
  in2+=tbar(x1,y0,3,1,{k,g:seg(p,.03,.12),fo:.5*(1-.6*cn)})+tbar(x2,y0,4,-1,{k,g:seg(p,.06,.15),fo:.5});
  in2+=fade(seg(p,.03,.12),label('⊙ 3.0',x1,y0-3*k-14,{size:26,color:CN,anchor:'middle',weight:700}))+fade(seg(p,.06,.15),label('⊗ 4.0',x2-36,y0+2*k+8,{size:26,color:CN,anchor:'end',weight:700}));
  // 打ち消し：⊙ の棒と、⊗ の上から 3.0 分
  in2+=fade(cn,line(x1-30,y0-3*k,x1+30,y0,{color:CD,w:4})+line(x2-30,y0,x2+30,y0+3*k,{color:CD,w:4})+rect(x2-23,y0,46,3*k,{fill:C.bg,fo:.55,stroke:'none',rx:2}));
  in2+=fade(seg(p,b+.2,b+.3),rect(x2-27,y0+3*k-2,54,k+4,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:4})+label('残り ⊗ 1.0',x2+40,y0+3.5*k+8,{size:26,color:C.hi,weight:700}));
  s+=panel(92,365,label('向きが 逆 → 引き算',PC,130,{size:26,color:C.ink,anchor:'middle',weight:700})+in2
   +fade(seg(p,b+.1,b+.2),row([['4.0 − 3.0 ＝ ',C.ink],['1.0 N·m',CN]],PC,172,28).svg),1);
  s+=goalTag(G3)+ANS3(seg(p,ans,ans+.06));
  return s;
 },
 // 18. 誤答 A → B → C（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.5;
  const gA=seg(p,.01,.05)*(1-seg(p,m-.04,m)),gB=seg(p,m+.01,m+.05)*(1-seg(p,e1-.04,e1)),gC=seg(p,e1+.01,e1+.05);
  let s=scene3(O1,{dims:0})+outSym(O1.hx-22,O1.hy-64,20,CN,.5)+inSym(O1.hx+28,O1.hy-64,20,CN)+LEG();
  s+=panel(92,150,label('小問3',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['4.0 − 3.0 ＝ ',C.ink],['1.0 N·m（時計回り）',CN]],PC,195,28).svg,1);
  s+=wrongCard('A','反時計回りに 7.0 N·m','逆向きを足した',{...WOPT,y:262,g:gA});
  s+=wrongCard('B','反時計回りに 1.0 N·m','向きを取り違えた',{...WOPT,y:262,g:gB});
  s+=wrongCard('C','時計回りに 4.0 N·m','1人目の 3.0 を引いていない',{...WOPT,y:262,g:gC});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 19. 上の段に力（5 N と 10 N）、下の段にトルクの棒（3.0 と 4.0）。比べるのは下の段（黄の枠）
 [K+'compare3']:(p)=>{
  const xs=[360,780],k=20;
  let s=card(80,90,1040,385,'',1);
  s+=label('力',150,190,{size:30,color:CF,anchor:'middle',weight:700})+label('トルク',150,360,{size:30,color:CN,anchor:'middle',weight:700});
  s+=label('1人目（0.60 m）',xs[0],132,{size:26,color:C.dim,anchor:'middle'})+label('2人目（0.40 m）',xs[1],132,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.15),arrow(xs[0]-50,195,xs[0]-50+5*k,195,{color:CF,w:7})+label('5 N',xs[0]+70,205,{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.08,.18),arrow(xs[1]-100,195,xs[1]-100+10*k,195,{color:CF,w:7})+label('10 N',xs[1]+120,205,{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.2,.3),label('力は 2人目が 大きい',600,262,{size:26,color:C.dim,anchor:'middle'}));
  const bk=60;
  s+=fade(seg(p,.32,.42),rect(xs[0]-50,335,3*bk,40,{fill:CN,fo:.55,stroke:CN,sw:2,rx:4})+label('3.0 N·m',xs[0]-50+3*bk+14,365,{size:28,color:CN,weight:700}));
  s+=fade(seg(p,.36,.46),rect(xs[1]-100,335,4*bk,40,{fill:CN,fo:.55,stroke:CN,sw:2,rx:4})+label('4.0 N·m',xs[1]-100+4*bk+14,365,{size:28,color:CN,weight:700}));
  s+=fade(seg(p,.5,.6),rect(100,300,1000,108,{fill:'none',fo:0,stroke:C.hi,sw:4,rx:12})+label('比べるのは トルク（軸に 近いと 小さい）',600,448,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=LEG();
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 20. 小問1〜3 の垂直な距離（黄）とトルク（桃）を並べ、N＝F×垂直な距離 の式に矢印でつなぐ。答えの札3枚
 [K+'sum']:(p)=>{
  const cw=350,ch=270,cy=86,xs=[40,425,810],o=i=>({hx:xs[i]+60,hy:cy+100,ppm:200});
  let s='';
  const gs=[seg(p,.03,.12),seg(p,.12,.21),seg(p,.21,.3)];
  [0,1,2].forEach(i=>{
   const oo=o(i),x0=xs[i];
   let c=line(oo.hx,oo.hy,oo.hx+1.2*oo.ppm,oo.hy,{color:CDOOR,w:10,cap:'butt'})+ring(oo.hx,oo.hy,8,{color:C.ink,w:3,fill:C.bg});
   c+=label(`小問${i+1}`,x0+16,cy+34,{size:24,color:C.dim});
   if(i===0){const [qx]=pt(.6,oo);c+=arrow(qx,oo.hy,qx,oo.hy-60,{color:CF,w:4,head:12})+line(oo.hx,oo.hy+10,qx,oo.hy+10,{color:CQ,w:6})+label('0.60 m',oo.hx+20,oo.hy+46,{size:24,color:CQ,weight:700})
    +label('3.0 N·m',x0+cw/2,cy+ch-22,{size:28,color:CN,anchor:'middle',weight:700});}
   if(i===1){const [ex,ey]=pt(1.2,oo),[ux,uy]=dirv(A30),[fx,fy]=foot(1.2,A30,oo);
    c+=arrow(ex,ey,ex+ux*60,ey+uy*60,{color:CF,w:4,head:12})+line(ex-ux*240,ey-uy*240,ex,ey,{color:CF,w:2,dash:'6 6'})+line(oo.hx,oo.hy,fx,fy,{color:CQ,w:6})+label('0.60 m',fx+18,fy+2,{size:24,color:CQ,weight:700})
    +label('3.0 N·m',x0+cw/2,cy+ch-22,{size:28,color:CN,anchor:'middle',weight:700});}
   if(i===2){const [ax]=pt(.6,oo),[bx]=pt(.4,oo);c+=arrow(ax,oo.hy,ax,oo.hy-50,{color:CF,w:4,head:12})+arrow(bx,oo.hy,bx,oo.hy+90,{color:CF,w:4,head:12})
    +line(oo.hx,oo.hy-9,ax,oo.hy-9,{color:CQ,w:5})+line(oo.hx,oo.hy+9,bx,oo.hy+9,{color:CQ,w:5})
    +label('0.60',ax+12,oo.hy-24,{size:22,color:CQ,weight:700})+label('0.40',oo.hx+10,oo.hy+40,{size:22,color:CQ,weight:700})
    +label('差 1.0 N·m 時計回り',x0+cw/2,cy+ch-22,{size:26,color:CN,anchor:'middle',weight:700});}
   s+=card(x0,cy,cw,ch,c,gs[i]);
  });
  const gf=seg(p,.36,.46);
  s+=fade(gf,[0,1,2].map(i=>arrow(xs[i]+cw/2,cy+ch+4,600+(i-1)*160,404,{color:C.dim,w:3,head:12})).join(''));
  s+=card(250,406,700,72,defRow(600,452,34).svg,gf,C.hi);
  s+=answerRow([[1,'B','3.0 N·m'],[2,'C','3.0 N·m'],[3,'D','時計回りに 1.0 N·m']],{g:seg(p,.6,.7),size:22});
  return s;
 },
};
