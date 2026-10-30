// YouTube シリーズ「角運動量・上級 1/2」(ys-uc-angular-1) — 図。Stage 1200×515.
// 色（角運動量・中級とそろえる）：𝐫 水色、𝐯 紫、𝐩 桃、𝐋 黄、𝐍 桃、𝐅 緑（内力 緑・外力 赤：運動量・上級と同じ）、時間 t 金。
// 平面は真上から見る：x 右、y 上、z 手前。⊙＝手前（z＋）、⊗＝奥（z−）。
// 数値：玉 2 kg、𝐫＝(3,0,0)、𝐯＝(0,4,0)、𝐩＝(0,8,0) → 𝐋＝(0,0,24) ⊙。𝐅＝(0,1,0) → 𝐍＝(0,0,3) ⊙。0.1 s 後 24.3。
//   粒子 𝐫₁＝(1,2,0)、𝐫₂＝(3,0,0)、𝐅₁₂＝(1,−1,0)、𝐅₂₁＝(−1,1,0) → z 成分 −3（⊗）、＋3（⊙）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,axes} from './anim.mjs';

const K='uc-angular-1:';
const CR=C.x,CV=C.v,CP=C.p,CL=C.hi,CN=C.p,CF=C.F,CX=C.a,CT=C.t;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const B=(c,n)=>cs(c,`\\mathbf{${n}}`);
const br=B(CR,'r'),bp=B(CP,'p'),bv=B(CV,'v'),bL=B(CL,'L'),bN=B(CN,'N'),bF=B(CF,'F');
const dr=cs(CR,'\\Delta\\mathbf{r}'),dp=cs(CP,'\\Delta\\mathbf{p}'),dL=cs(CL,'\\Delta\\mathbf{L}'),dt=cs(CT,'\\Delta t');
const dLdt=`\\dfrac{d${bL}}{d${cs(CT,'t')}}`,dpdt=`\\dfrac{d${bp}}{d${cs(CT,'t')}}`;
const mv=`m${bv}`;
const X='\\times ';
const LU='\\ \\mathrm{kg\\cdot m^2/s}';

function outSym(x,y,r=22,color=CL,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CL,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function head(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),H=15;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-H*Math.cos(a)+H*.55*Math.sin(a)},${y2-H*Math.sin(a)-H*.55*Math.cos(a)} ${x2-H*Math.cos(a)-H*.55*Math.sin(a)},${y2-H*Math.sin(a)+H*.55*Math.cos(a)}" fill="${color}"/>`;}
function turnArc(cx,cy,r,a0,a1,{color=CL,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30);return fade(g,draw(pts,1,{color,w})+head(pts,color));
}
const ball=(x,y,r=16)=>ring(x,y,r,{color:C.ink,w:3,fill:'#2c3854'});
const baseDot=(x,y,name='O',dx=0,dy=40)=>ring(x,y,9,{color:C.ink,w:3,fill:C.bg})+(name?label(name,x+dx,y+dy,{size:24,color:C.ink,anchor:'middle',weight:700}):'');
const strike=(x1,y1,x2,y2,g=1)=>fade(g,line(x1,y1,x2,y2,{color:C.a,w:4}));
const top=(t='真上から見た図')=>label(t,30,40,{size:22,color:C.dim});
const vlab=(n,x,y,c,sz=32,anchor='middle')=>T(B(c,n),x,y,{size:sz,anchor});
// [x0,w] of `term` inside `prefix+term+…` rendered centred at cx
const span=(full,prefix,term,size,cx=600)=>{const W=texWidth(full,size,false);return [cx-W/2+texWidth(prefix+'{}',size,false),texWidth(term,size,false)];};
const boxT=(full,prefix,term,size,y,g=1,col=C.hi)=>{const [x0,w]=span(full,prefix,term,size);return highlight(x0-14,y-size*1.6,w+28,size*2.75,g,col);};
const strikeT=(full,prefix,term,size,y,g=1)=>{const [x0,w]=span(full,prefix,term,size);return strike(x0,y+size*.55,x0+w,y-size*1.0,g);};

// ---- curved path (any road) -------------------------------------------------------------------------------
const OP={x:100,y:230};
const P=u=>[230+360*u,450-330*u+150*u*u*0];
function pathXY(u){return [190+400*u,470-420*u+260*u*u];}
function pathTan(u){const e=1e-3,[a,b]=pathXY(u-e),[c,d]=pathXY(u+e),l=Math.hypot(c-a,d-b);return [(c-a)/l,(d-b)/l];}
function pathScene({u=.35,g=1,pG=1,rG=1,showPath=1,plen=120}={}){
 let s=top();
 if(showPath)s+=draw(Array.from({length:61},(_,i)=>pathXY(i/60)),1,{color:C.faint,w:3,dash:'8 8'});
 s+=baseDot(OP.x,OP.y,'O',-28,8);
 const [bx,by]=pathXY(u),[tx,ty]=pathTan(u);
 if(rG>0){const l=Math.hypot(bx-OP.x,by-OP.y);s+=fade(rG,arrow(OP.x,OP.y,bx-(bx-OP.x)/l*16,by-(by-OP.y)/l*16,{color:CR,w:5,head:14}));}
 if(pG>0)s+=fade(pG,arrow(bx,by,bx+tx*plen,by+ty*plen,{color:CP,w:5,head:14}));
 s+=ball(bx,by,13);
 return s;
}

// ---- 2×2 table (rows 𝐫, Δ𝐫 ; columns 𝐩, Δ𝐩) -------------------------------------------------------------------
const TB={x:120,y:120,w1:290,w2:150,h1:170,h2:95};
function table({g=1,cg=[1,1,1,1],dimRP=0,hiCorner=0,shrink=0}={}){
 const {x,y,w1,w2,h1,h2}=TB,w2s=w2*(1-.75*shrink),h2s=h2*(1-.75*shrink);
 let s='';
 s+=fade(g,T(bp,x+w1/2,y-22,{size:34})+T(dp,x+w1+w2s/2,y-22,{size:34})+T(br,x-34,y+h1/2+10,{size:34})+T(dr,x-38,y+h1+h2s/2+10,{size:34,anchor:'end'}));
 const cells=[[x,y,w1,h1,`${br}${X}${bp}`,C.x],[x+w1,y,w2s,h1,`${br}${X}${dp}`,C.p],[x,y+h1,w1,h2s,`${dr}${X}${bp}`,C.v],[x+w1,y+h1,w2s,h2s,`${dr}${X}${dp}`,C.hi]];
 // order of cg: rp, r dp, dr p, dr dp
 cells.forEach(([cx,cy,cw,ch,t,col],i)=>{
  const gi=cg[i];if(gi<=0)return;
  const isC=i===3,dim=i===0?dimRP:0;
  s+=fade(gi*(1-.65*dim),rect(cx,cy,cw,ch,{fill:col,fo:isC&&hiCorner?.35:.16,stroke:isC&&hiCorner?C.hi:C.faint,sw:isC&&hiCorner?3:2,rx:4})
   +(cw>60&&ch>40?T(t,cx+cw/2,cy+ch/2+10,{size:isC?24:(i===0?34:26)}):''));
 });
 return s;
}

// ---- circle scene (S4) ------------------------------------------------------------------------------------
const CI={cx:300,cy:280,R:165};
function circleScene({phi=0,vG=1,Lsym=0,FG=0,TG=0,axesG=1,labels=1,arcG=0,lsym='out',rUp=0}={}){
 const {cx,cy,R}=CI,bx=cx+R*Math.cos(phi),by=cy-R*Math.sin(phi),tx=-Math.sin(phi),ty=-Math.cos(phi);
 let s=top();
 if(axesG>0)s+=fade(axesG*.8,arrow(cx-200,cy,cx+225,cy,{color:C.faint,w:2,head:12})+arrow(cx,cy+210,cx,cy-235,{color:C.faint,w:2,head:12})+label('x',cx+232,cy+8,{size:24,color:C.dim})+label('y',cx+12,cy-222,{size:24,color:C.dim}));
 s+=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'});
 s+=line(cx,cy,bx,by,{color:C.dim,w:2});
 s+=arrow(cx,cy,bx-15*Math.cos(phi),by+15*Math.sin(phi),{color:CR,w:5,head:14});
 if(labels)s+=rUp?vlab('r',cx+40,cy-18,CR,30)+label('3 m',cx+58,cy-14,{size:22,color:CR,anchor:'start'}):vlab('r',(cx+bx)/2+26*Math.sin(phi),(cy+by)/2+26*Math.cos(phi)+30,CR,30)+label('3 m',(cx+bx)/2+26*Math.sin(phi)+30,(cy+by)/2+26*Math.cos(phi)+36,{size:22,color:CR,anchor:'start'});
 if(vG>0)s+=fade(vG,arrow(bx,by,bx+tx*120,by+ty*120,{color:CV,w:6})+(labels?vlab('v',bx+tx*120+24,by+ty*120+8,CV,30)+label('4 m/s',bx+tx*60+26,by+ty*60+8,{size:22,color:CV,anchor:'start'}):''));
 if(FG>0)s+=fade(FG,arrow(bx-14,by,bx-14+tx*70,by+ty*70,{color:CF,w:6,head:14})+(labels?vlab('F',bx-30+tx*50,by+ty*50,CF,30,'end'):''));
 if(TG>0)s+=fade(TG,arrow(bx-16*Math.cos(phi),by+16*Math.sin(phi)+24,bx-100*Math.cos(phi),by+100*Math.sin(phi)+24,{color:C.ink,w:5,head:13})+label('糸の力',bx-60*Math.cos(phi),by+60*Math.sin(phi)+60,{size:22,color:C.ink,anchor:'middle'}));
 s+=ball(bx,by);
 s+=baseDot(cx,cy,'',0,0);
 if(arcG>0)s+=turnArc(cx,cy,R+30,phi+.12,phi+.12+.9*arcG,{color:C.dim,w:3,g:Math.min(1,arcG*5)});
 if(Lsym>0)s+=(lsym==='out'?outSym:inSym)(cx-44,cy+40,20,CL,Lsym);
 return s;
}

// ---- two particles (S5) ------------------------------------------------------------------------------------
const TP={ox:110,oy:450,k:135};
const TX=x=>TP.ox+x*TP.k,TY=y=>TP.oy-y*TP.k;
function twoScene({rG=1,inG=0,exG=0,diffG=0,lab=1}={}){
 let s=top();
 s+=fade(.7,arrow(TP.ox-20,TP.oy,TX(3.9),TP.oy,{color:C.faint,w:2,head:12})+arrow(TP.ox,TP.oy+20,TP.ox,TY(2.85),{color:C.faint,w:2,head:12})+label('x',TX(3.9)+8,TP.oy+8,{size:22,color:C.dim})+label('y',TP.ox+12,TY(2.85)+4,{size:22,color:C.dim}));
 s+=baseDot(TP.ox,TP.oy,'O',-22,30);
 const p1=[TX(1),TY(2)],p2=[TX(3),TY(0)];
 const arr=(a,b,c,w=5)=>{const l=Math.hypot(b[0]-a[0],b[1]-a[1]);return arrow(a[0],a[1],b[0]-(b[0]-a[0])/l*16,b[1]-(b[1]-a[1])/l*16,{color:c,w,head:14});};
 if(rG>0)s+=fade(rG,arr([TP.ox,TP.oy],p1,CR)+arr([TP.ox,TP.oy],[p2[0],p2[1]-1],CR)+(lab?T(`${B(CR,'r')}_1`,TX(.35),TY(1.2),{size:30})+T(`${B(CR,'r')}_2`,TX(1.6),TY(-.32),{size:30}):''));
 if(diffG>0)s+=fade(diffG,line(p2[0],p2[1],p1[0],p1[1],{color:CL,w:3,dash:'9 7'})+arr(p2,p1,CL,4)+T(`${B(CR,'r')}_1-${B(CR,'r')}_2`,TX(2.45),TY(1.45),{size:28,anchor:'start'}));
 const u=1/Math.SQRT2,fl=78;
 if(inG>0)s+=fade(inG,arrow(p1[0]+12*u,p1[1]+12*u,p1[0]+fl*u+12*u,p1[1]+fl*u+12*u,{color:CF,w:6,head:15})+arrow(p2[0]-12*u,p2[1]-12*u,p2[0]-fl*u-12*u,p2[1]-fl*u-12*u,{color:CF,w:6,head:15})
  +(lab?T(`${bF}_{12}`,p1[0]+fl*u+30,p1[1]+fl*u-14,{size:28,anchor:'start'})+T(`${bF}_{21}`,p2[0]-fl*u+20,p2[1]-fl*u-26,{size:28,anchor:'start'}):''));
 if(exG>0)s+=fade(exG,arrow(p1[0]-14,p1[1],p1[0]-90,p1[1]-30,{color:CX,w:5,head:14})+arrow(p2[0]+14,p2[1]+4,p2[0]+95,p2[1]+30,{color:CX,w:5,head:14})
  +(lab?T(`${B(CX,'F')}_1`,p1[0]-100,p1[1]-48,{size:28,anchor:'end'})+T(`${B(CX,'F')}_2`,p2[0]+100,p2[1]+30,{size:28,anchor:'start'}):''));
 s+=ball(p1[0],p1[1],14)+L('1',p1[0],p1[1]+9,{size:22,weight:700})+ball(p2[0],p2[1],14)+L('2',p2[0],p2[1]+9,{size:22,weight:700});
 return s;
}

export const ytUcAngular1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const phi=.3+1.2*p;
  let s=circleScene({phi,labels:0,axesG:0,Lsym:1});
  const {cx,cy,R}=CI,bx=cx+R*Math.cos(phi),by=cy-R*Math.sin(phi);
  s+=card(620,80,540,350,L('前回の 最後の 問い',890,130,{size:24,color:C.dim})
   +T(`${bL}=${br}${X}${bp}`,890,205,{size:50})
   +fade(seg(p,.3,.45),L('時間で どう 変わる？',890,290,{size:32,color:C.hi,weight:700}))
   +fade(seg(p,.55,.7),L('いつ 保存する？',890,365,{size:32,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  const ox=120,oy=380,bx=400,by=380;
  let s=top()+baseDot(ox,oy,'基準点',0,42);
  s+=arrow(ox,oy,bx-16,by,{color:CR,w:6,head:16})+vlab('r',(ox+bx)/2,oy+44,CR,32);
  s+=fade(seg(p,.3,.45),arrow(bx+10,by-12,bx+150,by-150,{color:CF,w:6})+vlab('F',bx+165,by-150,CF,32,'start'));
  s+=fade(seg(p,.55,.7),arrow(bx-6,by-16,bx-6,by-200,{color:CP,w:6})+vlab('p',bx-24,by-190,CP,32,'end'));
  s+=ball(bx,by,14);
  s+=card(620,70,540,380,L('角運動量・中級',890,115,{size:24,color:C.dim})
   +L('𝐫：基準点 → 物体',890,175,{size:28,color:CR,weight:700})
   +fade(seg(p,.3,.45),T(`${bN}=${br}${X}${bF}`,890,260,{size:46})+L('トルク',1080,265,{size:22,color:C.dim}))
   +fade(seg(p,.55,.7),T(`${bL}=${br}${X}${bp}`,890,360,{size:46})+L('角運動量',1090,365,{size:22,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'mid']:(p)=>{
  const phi=.2+1.3*p;
  let s=circleScene({phi,labels:0,axesG:0,vG:1});
  const {cx,cy,R}=CI;
  s+=fade(seg(p,.45,.6),L('半径 一定 の 円',cx,cy+R+45,{size:26,color:C.hi,weight:700}));
  s+=card(620,70,540,380,L('剛体の回転・中級',890,115,{size:24,color:C.dim})
   +L('円を回る 玉 1個',890,170,{size:28,color:C.ink,weight:700})
   +T(`L=mr^2\\omega`,890,240,{size:40})
   +T(`\\dfrac{dL}{dt}=mr^2\\alpha=N`,890,330,{size:40})
   +fade(seg(p,.55,.7),L('半径が 変わる 道では？',890,410,{size:28,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'goal']:(p)=>{
  const u=.08+.7*seg(p,0,.85);
  let s=pathScene({u});
  s+=fade(seg(p,.05,.2),L('どんな 道でも',360,490,{size:24,color:C.dim}));
  s+=card(680,110,480,280,L('今回 示すこと',920,160,{size:24,color:C.dim})
   +T(`${dLdt}=${bN}`,920,250,{size:56})
   +L('外積の 微分 で',920,345,{size:28,color:C.hi,weight:700}),seg(p,.02,.12),C.hi);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=card(110,60,980,170,L('数の 積の 微分（微分の法則）',600,105,{size:24,color:C.dim})+T(`(fg)'=f'g+fg'`,600,180,{size:48}),seg(p,0,.1));
  s+=fade(seg(p,.25,.4),L('外積 でも 2つの 項 に 分かれる？',600,300,{size:30,color:C.ink,weight:700}));
  s+=fade(seg(p,.4,.55),T(`\\dfrac{d}{dt}(${br}${X}${bp})=\\ ?`,600,410,{size:52}));
  return s;
 },
 // ===== S2 外積の積を微分する =====
 [K+'step']:(p)=>{
  const u0=.2,u1=.5;
  let s=pathScene({u:u0,pG:0});
  const [ax,ay]=pathXY(u0),[bx,by]=pathXY(u1),[t0x,t0y]=pathTan(u0),[t1x,t1y]=pathTan(u1);
  const g=seg(p,.15,.35);
  s+=vlab('r',(OP.x+ax)/2-10,(OP.y+ay)/2+44,CR,30);
  if(g>0){const l=Math.hypot(bx-OP.x,by-OP.y);
   s+=fade(g,arrow(OP.x,OP.y,bx-(bx-OP.x)/l*16,by-(by-OP.y)/l*16,{color:CR,w:4,head:13,opacity:.7})+T(`${br}+${dr}`,(OP.x+bx)/2-10,(OP.y+by)/2-22,{size:26})
    +arrow(ax+t0x*14,ay+t0y*14,bx-t1x*14,by-t1y*14,{color:CR,w:5,head:12})+T(dr,(ax+bx)/2+24,(ay+by)/2+28,{size:28,anchor:'start'})+ball(bx,by,13)
    +L('Δt 後',bx+22,by+40,{size:22,color:CT,anchor:'start'}));
  }
  // momentum arrows side by side (common tail)
  const ox=380,oy=495,P0=[t0x*170,t0y*170],P1=[t1x*215,t1y*215];
  s+=fade(seg(p,.5,.65),label('𝐩 を 並べる',ox-20,oy+8,{size:22,color:C.dim,anchor:'end'})+arrow(ox,oy,ox+P0[0],oy+P0[1],{color:CP,w:5,head:13})+vlab('p',ox+P0[0]/2-14,oy+P0[1]/2-8,CP,28,'end')
   +arrow(ox,oy,ox+P1[0],oy+P1[1],{color:CP,w:4,head:13,opacity:.7})+T(`${bp}+${dp}`,ox+P1[0]+10,oy+P1[1]+8,{size:24,anchor:'start'})
   +arrow(ox+P0[0],oy+P0[1],ox+P1[0],oy+P1[1],{color:C.hi,w:4,head:11})+T(dp,(P0[0]+P1[0])/2+ox,(P0[1]+P1[1])/2+oy-22,{size:24}));
  s+=card(700,110,460,290,L('Δt だけ 進める',930,160,{size:26,color:CT,weight:700})
   +fade(seg(p,.35,.5),T(`${br}\\ \\to\\ ${br}+${dr}`,930,240,{size:40}))
   +fade(seg(p,.6,.75),T(`${bp}\\ \\to\\ ${bp}+${dp}`,930,330,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'newL']:(p)=>{
  let s=L('新しい 角運動量',600,90,{size:28,color:C.dim});
  s+=T(`${bL}+${dL}=(${br}+${dr})${X}(${bp}+${dp})`,600,230,{size:56});
  s+=fade(seg(p,.4,.6),L('𝐫＋Δ𝐫 と 𝐩＋Δ𝐩 の 外積',600,360,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'dist']:(p)=>{
  let s=T(`(${br}+${dr})${X}(${bp}+${dp})`,600,90,{size:50});
  s+=fade(seg(p,.05,.2),L('分配法則（外積・上級 1/2）で 括弧を 開く',600,175,{size:28,color:C.dim}));
  s+=fade(seg(p,.25,.4),card(150,225,900,250,L('入れ替えると 向きが 逆',600,272,{size:28,color:C.ink})+T(`${bp}${X}${br}=-${br}${X}${bp}`,600,335,{size:38})
   +fade(seg(p,.6,.75),L('順番を 保つ',600,395,{size:28,color:C.hi,weight:700})+L('左：𝐫 の側',430,450,{size:32,color:CR,weight:700})+L('右：𝐩 の側',770,450,{size:32,color:CP,weight:700})),1,C.hi));
  return s;
 },
 [K+'order']:(p)=>{
  // view from above: r right, p up -> r×p out (⊙) ; p×r -> in (⊗)
  const pair=(cx,cy,first,g)=>{let s='';
   s+=arrow(cx,cy,cx+150,cy,{color:CR,w:5,head:14})+vlab('r',cx+170,cy+10,CR,28,'start');
   s+=arrow(cx,cy,cx,cy-150,{color:CP,w:5,head:14})+vlab('p',cx-14,cy-140,CP,28,'end');
   s+=dot(cx,cy,5,C.ink);
   s+=first==='r'?turnArc(cx,cy,60,.1,1.45,{color:C.dim,w:3,g}):turnArc(cx,cy,60,1.45,.1,{color:C.dim,w:3,g});
   return s;};
  let s=top();
  s+=pair(120,330,'r',seg(p,.1,.3))+T(`${br}${X}${bp}`,200,450,{size:36})+outSym(350,330,22,CN,seg(p,.2,.35))+L('手前',350,385,{size:22,color:CN});
  s+=fade(seg(p,.4,.55),pair(520,330,'p',seg(p,.45,.6))+T(`${bp}${X}${br}`,600,450,{size:36})+inSym(750,330,22,CN,1)+L('奥',750,385,{size:22,color:CN}));
  s+=card(840,130,320,250,L('順番を 入れ替えると',1000,180,{size:24,color:C.dim})+L('向きが 逆',1000,235,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.6,.75),T(`${bp}${X}${br}=-${br}${X}${bp}`,1000,320,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'four']:(p)=>{
  let s=table({g:1,cg:[seg(p,.15,.25),seg(p,.3,.4),seg(p,.45,.55),seg(p,.62,.72)]});
  s+=card(620,90,550,330,L('開くと 4つの 項',895,140,{size:26,color:C.dim})
   +T(`${bL}+${dL}`,895,205,{size:38})
   +T(`=${br}${X}${bp}+${dr}${X}${bp}`,895,280,{size:36})
   +T(`+${br}${X}${dp}+${dr}${X}${dp}`,895,360,{size:36}),seg(p,.02,.12));
  return s;
 },
 [K+'table']:(p)=>{
  let s=table({hiCorner:seg(p,.5,.65)});
  // small reminder of the number rectangle
  const x=760,y=150,a=200,b=120,da=70,db=45;
  s+=fade(seg(p,.05,.2),L('微分の法則の 長方形',x+(a+da)/2,y-40,{size:24,color:C.dim})
   +rect(x,y,a,b,{fill:C.x,fo:.15,stroke:C.faint})+rect(x+a,y,da,b,{fill:C.p,fo:.15,stroke:C.faint})+rect(x,y+b,a,db,{fill:C.v,fo:.15,stroke:C.faint})+rect(x+a,y+b,da,db,{fill:C.hi,fo:.3,stroke:C.hi,sw:3})
   +T('fg',x+a/2,y+b/2+10,{size:32})+T('f',x+a/2,y-8,{size:24})+T('\\Delta f',x+a+da/2,y-8,{size:22})+T('g',x-18,y+b/2+8,{size:24})+T('\\Delta g',x-12,y+b+db/2+8,{size:22,anchor:'end'}));
  s+=fade(seg(p,.5,.65),L('角の 小さな ます目',x+(a+da)/2,y+b+db+60,{size:28,color:C.hi,weight:700}));
  return s;
 },
 [K+'sub']:(p)=>{
  let s=table({dimRP:seg(p,.2,.35)});
  s+=strike(TB.x+40,TB.y+TB.h1-30,TB.x+TB.w1-40,TB.y+30,seg(p,.2,.35));
  s+=card(620,90,550,330,T(`${bL}+${dL}=${br}${X}${bp}+\\cdots`,895,150,{size:34})
   +fade(seg(p,.15,.3),L('両辺から 𝐋＝𝐫×𝐩 を 引く',895,215,{size:26,color:C.dim}))
   +fade(seg(p,.4,.55),T(`${dL}=${dr}${X}${bp}`,895,290,{size:38})+T(`+${br}${X}${dp}+${dr}${X}${dp}`,895,365,{size:36})),seg(p,.02,.12));
  return s;
 },
 [K+'div']:(p)=>{
  let s=T(`${dL}=${dr}${X}${bp}+${br}${X}${dp}+${dr}${X}${dp}`,600,80,{size:40});
  s+=fade(seg(p,.1,.25),L('両辺を Δt で 割る',600,150,{size:28,color:CT,weight:700}));
  s+=fade(seg(p,.25,.45),T(`\\dfrac{${dL}}{${dt}}=\\dfrac{${dr}}{${dt}}${X}${bp}+${br}${X}\\dfrac{${dp}}{${dt}}+\\dfrac{${dr}}{${dt}}${X}${dp}`,600,265,{size:46}));
  s+=fade(seg(p,.6,.75),card(240,350,720,130,L('Δt は ただの 数',600,395,{size:26,color:C.dim})+T(`\\dfrac{1}{${dt}}(${B(C.ink,'A')}${X}${B(C.ink,'B')})=\\dfrac{${B(C.ink,'A')}}{${dt}}${X}${B(C.ink,'B')}=${B(C.ink,'A')}${X}\\dfrac{${B(C.ink,'B')}}{${dt}}`,600,455,{size:32})));
  return s;
 },
 [K+'lim']:(p)=>{
  const y=170;
  let s=L('Δt → 0',600,60,{size:30,color:CT,weight:700});
  s+=T(`\\dfrac{${dL}}{${dt}}=\\dfrac{${dr}}{${dt}}${X}${bp}+${br}${X}\\dfrac{${dp}}{${dt}}+\\dfrac{${dr}}{${dt}}${X}${dp}`,600,y,{size:46});
  s+=fade(seg(p,.25,.4),arrow(420,y+60,420,y+125,{color:CV,w:4,head:12})+T(bv,420,y+170,{size:44}));
  s+=fade(seg(p,.55,.7),arrow(690,y+60,690,y+125,{color:CP,w:4,head:12})+T(dpdt,690,y+190,{size:40}));
  return s;
 },
 [K+'corner']:(p)=>{
  const y=170;
  let s=L('Δt → 0',600,60,{size:30,color:CT,weight:700});
  s+=T(`\\dfrac{${dL}}{${dt}}=\\dfrac{${dr}}{${dt}}${X}${bp}+${br}${X}\\dfrac{${dp}}{${dt}}+\\dfrac{${dr}}{${dt}}${X}${dp}`,600,y,{size:46});
  s+=highlight(812,y-62,248,124,seg(p,.02,.12));
  s+=fade(seg(p,.15,.3),arrow(870,y+60,870,y+125,{color:CV,w:4,head:12})+T(bv,870,y+165,{size:40}));
  s+=fade(seg(p,.35,.5),arrow(1010,y+50,1010,y+125,{color:CP,w:4,head:12})+T(`${cs(CP,'\\mathbf{0}')}`,1010,y+165,{size:40}));
  s+=fade(seg(p,.6,.75),T(`${bv}${X}\\mathbf{0}=\\mathbf{0}`,940,y+260,{size:42})+L('消える',940,y+320,{size:28,color:C.a,weight:700}));
  s+=fade(seg(p,.6,.75),line(820,y+50,1055,y-50,{color:C.a,w:4}));
  s+=fade(seg(p,.4,.55),card(80,y+110,560,170,L('角の ます目',360,y+160,{size:26,color:C.hi,weight:700})+L('Δ𝐩 そのものが 0 へ 縮む',360,y+225,{size:28,color:C.ink})));
  return s;
 },
 [K+'result']:(p)=>{
  let s=L('残るのは 2つの 項',600,70,{size:28,color:C.dim});
  const e=`${dLdt}=${bv}${X}${bp}+${br}${X}${dpdt}`,w=texWidth(e,60,false);
  s+=T(e,600,200,{size:60})+highlight(600-w/2-24,105,w+48,180,seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),T(`(fg)'=f'g+fg'`,600,370,{size:40})+L('数の 積の 微分と 同じ 形（順番は 保つ）',600,440,{size:26,color:C.hi,weight:700}));
  return s;
 },
 // ===== S3 2つの項を読む =====
 [K+'vp']:(p)=>{
  const f0=`${dLdt}=${bv}${X}${bp}+${br}${X}${dpdt}`;
  let s=T(f0,600,110,{size:50});
  s+=boxT(f0,`${dLdt}=`,`${bv}${X}${bp}`,50,110,seg(p,.05,.2));
  s+=fade(seg(p,.25,.4),T(`${bp}=m${bv}`,600,260,{size:44}));
  s+=fade(seg(p,.55,.7),T(`${bv}${X}${bp}=${bv}${X}m${bv}`,600,380,{size:52}));
  return s;
 },
 [K+'para']:(p)=>{
  const ox=150,oy=380,ang=mix(38,0,seg(p,.3,.75))*Math.PI/180;
  const vx=200,mx=360;
  const A=[ox+vx,oy],Bp=[ox+mx*Math.cos(ang),oy-mx*Math.sin(ang)];
  let s=label('平行四辺形',40,40,{size:22,color:C.dim});
  s+=poly([[ox,oy],A,[A[0]+Bp[0]-ox,A[1]+Bp[1]-oy],Bp],{fill:CN,fo:.25,stroke:CN,sw:2});
  s+=arrow(ox,oy,Bp[0],Bp[1],{color:CP,w:6,head:16})+arrow(ox,oy,A[0],A[1],{color:CV,w:8,head:18});
  s+=T(`m${bv}`,Bp[0]+10,Bp[1]-24,{size:30,anchor:'start'})+vlab('v',A[0]-10,A[1]+44,CV,30);
  s+=fade(seg(p,.75,.85),L('つぶれて 面積 0',ox+300,oy+80,{size:28,color:C.hi,weight:700}));
  s+=card(720,110,440,290,L('𝐯 と m𝐯',940,170,{size:30,color:C.ink,weight:700})+L('同じ 向き',940,230,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.45,.6),L('間の 角 0°',940,300,{size:28,color:C.ink})+L('（m は 正の 数）',940,350,{size:22,color:C.dim})),seg(p,.02,.12));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=card(120,50,960,150,L('外積の 長さ ＝ 平行四辺形の 面積',600,100,{size:28,color:C.dim})+T(`|${bv}${X}m${bv}|=0`,600,165,{size:42}),seg(p,0,.1));
  const e=`${dLdt}=${bv}${X}m${bv}+${br}${X}${dpdt}`;
  s+=fade(seg(p,.25,.4),T(e,600,330,{size:50}));
  const [z0,zw]=span(e,`${dLdt}=`,`${bv}${X}m${bv}`,50);
  s+=strikeT(e,`${dLdt}=`,`${bv}${X}m${bv}`,50,330,seg(p,.5,.65))+fade(seg(p,.5,.65),L('＝ 0',z0+zw/2,440,{size:32,color:C.a,weight:700}));
  return s;
 },
 [K+'zcomp']:(p)=>{
  const rows=(y,a,b,c)=>T(`${a}`,240,y,{size:34})+T(`(${b})`,520,y,{size:34})+T(c,820,y,{size:34});
  let s=L('数で 確かめる（m ＝ 2 kg）',600,60,{size:28,color:C.dim});
  s+=T(`${bv}=(0,\\ 4,\\ 0)`,330,140,{size:38})+T(`m${bv}=(0,\\ 8,\\ 0)`,820,140,{size:38});
  s+=fade(seg(p,.2,.35),T(`z:\\ 0\\times 8-4\\times 0=0`,600,250,{size:40}));
  s+=fade(seg(p,.55,.7),T(`x:\\ 4\\times 0-0\\times 8=0`,600,330,{size:34})+T(`y:\\ 0\\times 0-0\\times 0=0`,600,395,{size:34}));
  s+=fade(seg(p,.75,.88),T(`${bv}${X}m${bv}=(0,\\ 0,\\ 0)`,600,470,{size:38}));
  return s;
 },
 [K+'Fp']:(p)=>{
  const f0=`${dLdt}=${bv}${X}m${bv}+${br}${X}${dpdt}`;
  let s=T(f0,600,110,{size:50});
  s+=strikeT(f0,`${dLdt}=`,`${bv}${X}m${bv}`,50,110);
  s+=boxT(f0,`${dLdt}=${bv}${X}m${bv}+`,`${br}${X}${dpdt}`,50,110,seg(p,.05,.2));
  s+=fade(seg(p,.3,.45),T(`${dpdt}=${bF}`,600,290,{size:48})+L('運動方程式',600,375,{size:26,color:C.dim}));
  s+=fade(seg(p,.55,.7),L('𝐅：粒子が 受ける 力の 合計',600,445,{size:30,color:CF,weight:700}));
  return s;
 },
 [K+'NN']:(p)=>{
  let s=T(`${dLdt}=${br}${X}${bF}`,600,120,{size:56});
  const e=`${dLdt}=${bN}`,w=texWidth(e,72,false);
  s+=fade(seg(p,.3,.45),L('𝐫×𝐅 ＝ トルク 𝐍',600,235,{size:30,color:CN,weight:700}));
  s+=fade(seg(p,.55,.7),T(e,600,400,{size:72})+highlight(600-w/2-30,285,w+60,190,1));
  return s;
 },
 [K+'cond']:(p)=>{
  const it=(i,t,g,c=C.ink)=>fade(g,dot(220,190+i*95,9,C.hi)+label(t,250,202+i*95,{size:32,color:c,weight:700}));
  let s=card(150,50,900,400,L('使った 仮定',600,105,{size:28,color:C.dim})
   +it(0,'① 基準点は 慣性系に 固定',seg(p,.05,.2))
   +it(1,'② 質量 m は 一定',seg(p,.3,.45))
   +fade(seg(p,.55,.7),T(`\\dfrac{d${br}}{d${cs(CT,'t')}}\\ne ${bv}`,300,385,{size:36})+label('基準点が 動くと → 1つ目の 項が 残る',400,395,{size:28,color:C.a,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'cond2']:(p)=>{
  // moving base point: O moves to the right while the particle moves up
  const ox=mix(150,300,p),oy=400,bx=500,by=mix(350,250,p);
  let s=top();
  s+=line(120,oy,620,oy,{color:C.faint,w:2,dash:'6 6'})+arrow(ox+14,oy+30,ox+80,oy+30,{color:C.dim,w:4,head:12})+L('基準点が 動く',ox+60,oy+70,{size:22,color:C.dim});
  s+=baseDot(ox,oy,'',0,0)+arrow(ox,oy,bx-12,by+8,{color:CR,w:5,head:14})+arrow(bx,by,bx,by-120,{color:CV,w:6,head:14})+vlab('v',bx+18,by-110,CV,30,'start')+ball(bx,by,13);
  s+=card(680,90,480,330,T(`\\dfrac{d${br}}{d${cs(CT,'t')}}\\ne ${bv}`,920,170,{size:44})
   +fade(seg(p,.35,.5),L('1つ目の 項が',920,265,{size:28,color:C.ink}))
   +fade(seg(p,.35,.5),L('消えなくなる',920,320,{size:30,color:C.a,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'pair']:(p)=>{
  const row=(y,a,b,g,col)=>fade(g,T(a,600,y,{size:56}));
  let s=L('並べると',600,60,{size:26,color:C.dim});
  s+=T(`${dpdt}=${bF}`,600,170,{size:56});
  s+=fade(seg(p,.1,.25),T(`${dLdt}=${bN}`,600,340,{size:56}));
  s+=fade(seg(p,.3,.45),rect(488,78,108,340,{fill:CP,fo:.06,stroke:CP,sw:2,rx:12})+rect(636,100,98,300,{fill:CF,fo:.06,stroke:CF,sw:2,rx:12}));
  s+=fade(seg(p,.3,.45),L('組',542,450,{size:24,color:CP,weight:700})+L('組',685,450,{size:24,color:CF,weight:700}));
  s+=fade(seg(p,.6,.75),L('力 → 運動量',960,175,{size:28,color:C.ink})+L('トルク → 角運動量',960,345,{size:28,color:C.ink}));
  return s;
 },
 // ===== S4 数で確かめる =====
 [K+'ex']:(p)=>{
  const phi=-.5+.5*seg(p,0,.85);
  let s=circleScene({phi,arcG:seg(p,.3,.5)});
  s+=card(660,90,500,330,L('角運動量・中級と 同じ 玉',910,140,{size:24,color:C.dim})
   +L('m ＝ 2 kg',910,205,{size:32,color:C.ink,weight:700})
   +L('半径 3 m',910,265,{size:30,color:CR,weight:700})+L('速さ 4 m/s',910,325,{size:30,color:CV,weight:700})
   +L('反時計回り・糸つき',910,385,{size:26,color:C.dim}),seg(p,.02,.12));
  return s;
 },
 [K+'Lval']:(p)=>{
  let s=circleScene({});
  s+=card(640,70,520,380,T(`${br}=(3,\\ 0,\\ 0)\\ \\mathrm{m}`,900,130,{size:34})
   +T(`${bp}=(0,\\ 8,\\ 0)\\ \\mathrm{kg\\cdot m/s}`,900,195,{size:34})
   +fade(seg(p,.3,.45),L('𝐋 の z 成分',900,270,{size:26,color:C.dim}))
   +fade(seg(p,.4,.55),T(`3\\times 8-0\\times 0`,900,335,{size:40}))
   +fade(seg(p,.7,.85),T(`=24`,900,410,{size:44})),seg(p,.02,.12));
  return s;
 },
 [K+'Lval2']:(p)=>{
  let s=circleScene({Lsym:seg(p,.4,.55)});
  s+=fade(seg(p,.4,.55),T(bL,CI.cx-44,CI.cy+92,{size:30}));
  s+=card(640,70,520,380,L('x、y 成分は 0',900,130,{size:28,color:C.dim})
   +T(`${bL}=(0,\\ 0,\\ 24)`,900,210,{size:44})+T(`\\mathrm{kg\\cdot m^2/s}`,900,280,{size:32})
   +fade(seg(p,.4,.55),L('z の 正の 向き ＝ 手前 ⊙',900,370,{size:28,color:CL,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'push']:(p)=>{
  let s=circleScene({FG:seg(p,.1,.25),Lsym:1,vG:1});
  s+=card(640,90,520,330,L('いつも 進む 向きに 押す',900,145,{size:28,color:CF,weight:700})
   +L('大きさ 1 N',900,205,{size:28,color:C.ink})
   +fade(seg(p,.5,.65),L('今の 位置では',900,280,{size:24,color:C.dim})+T(`${bF}=(0,\\ 1,\\ 0)\\ \\mathrm{N}`,900,350,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'Nval']:(p)=>{
  let s=circleScene({FG:1,vG:.5,Lsym:0});
  s+=outSym(CI.cx-44,CI.cy+40,20,CN,seg(p,.6,.75))+fade(seg(p,.6,.75),T(bN,CI.cx-44,CI.cy+92,{size:30}));
  s+=card(640,70,520,380,L('トルク 𝐫×𝐅 の z 成分',900,125,{size:26,color:C.dim})
   +T(`${br}=(3,\\ 0,\\ 0),\\ \\ ${bF}=(0,\\ 1,\\ 0)`,900,190,{size:30})
   +fade(seg(p,.15,.3),T(`3\\times 1-0\\times 0=3`,900,265,{size:40}))
   +fade(seg(p,.45,.6),T(`${bN}=(0,\\ 0,\\ 3)\\ \\mathrm{N\\cdot m}`,900,345,{size:38}))
   +fade(seg(p,.6,.75),L('手前向き ⊙',900,415,{size:28,color:CN,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'string']:(p)=>{
  let s=circleScene({FG:1,vG:.5,TG:seg(p,.05,.2),rUp:1});
  s+=card(640,90,520,330,L('糸の 力：中心 向き',900,145,{size:28,color:C.ink,weight:700})
   +L('𝐫 と 逆向きに 平行',900,205,{size:28,color:C.ink})
   +fade(seg(p,.35,.5),L('sin 180° ＝ 0',900,280,{size:30,color:C.hi,weight:700}))
   +fade(seg(p,.55,.7),L('糸の 力の トルク ＝ 0',900,350,{size:30,color:C.a,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'pred']:(p)=>{
  const A=axes({x:110,y:440,w:470,h:330,xmin:0,xmax:.1,ymin:23.95,ymax:24.35,xticks:[],yticks:[],grid:false});
  let s=A.svg+label('t（s）',A.X(.1)+40,A.Y(23.95)+8,{size:24,color:CT})+label('L（kg·m²/s）',A.X(0)+10,A.Y(24.35)-38,{size:24,color:CL});
  s+=line(A.X(0)-6,A.Y(24),A.X(0)+6,A.Y(24),{color:C.dim})+label('24',A.X(0)-12,A.Y(24)+8,{size:22,color:C.dim,anchor:'end'});
  s+=line(A.X(0)-6,A.Y(24.3),A.X(0)+6,A.Y(24.3),{color:C.dim})+label('24.3',A.X(0)-12,A.Y(24.3)+8,{size:22,color:C.dim,anchor:'end'});
  s+=line(A.X(.1),A.Y(23.95)-6,A.X(.1),A.Y(23.95)+6,{color:C.dim})+label('0.1',A.X(.1),A.Y(23.95)+34,{size:22,color:C.dim,anchor:'middle'});
  const u=seg(p,.2,.7);
  s+=A.plot(t=>24+3*t,{from:0,to:.1*u+1e-4,color:CL,w:5});
  s+=fade(seg(p,.7,.8),dot(A.X(.1),A.Y(24.3),9,CL)+line(A.X(0),A.Y(24.3),A.X(.1),A.Y(24.3),{color:C.faint,w:2,dash:'5 5'}));
  s+=fade(seg(p,.3,.45),L('傾き ＝ N ＝ 3',A.X(.05),A.Y(24.08)+50,{size:26,color:CN,weight:700}));
  s+=card(680,90,480,330,T(`${dLdt}=${bN}`,920,160,{size:44})
   +fade(seg(p,.2,.35),L('1秒 あたり 3 ずつ 増える',920,245,{size:26,color:C.ink}))
   +fade(seg(p,.6,.75),T(`24+3\\times 0.1=24.3`,920,325,{size:38})+T(`\\mathrm{kg\\cdot m^2/s}`,920,385,{size:28})),seg(p,.02,.12));
  return s;
 },
 [K+'check']:(p)=>{
  let s=circleScene({FG:1,vG:1,labels:1});
  s+=card(640,70,520,380,L('進む 向きの 運動方程式',900,120,{size:26,color:C.dim})
   +T(`ma=F`,900,185,{size:40})
   +fade(seg(p,.2,.35),T(`a=1\\div 2=0.5\\ \\mathrm{m/s^2}`,900,260,{size:36}))
   +fade(seg(p,.55,.7),L('0.1 s 後の 速さ',900,325,{size:24,color:C.dim})+T(`4+0.5\\times 0.1=4.05\\ \\mathrm{m/s}`,900,390,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'check2']:(p)=>{
  let s=card(140,50,920,150,L('中級の L ＝ mrv（𝐫 と 𝐯 が 直角）',600,100,{size:26,color:C.dim})+T(`L=2\\times 3\\times 4.05=24.3`,600,165,{size:44}),seg(p,0,.1));
  s+=fade(seg(p,.4,.55),card(140,240,920,200,L('d𝐋/dt ＝ 𝐍 からの 予想',600,290,{size:26,color:C.dim})+T(`24+3\\times 0.1=24.3`,600,370,{size:44})+L('一致',960,380,{size:34,color:CF,weight:700}),1,CF));
  return s;
 },
 // ===== S5 粒子が多いとき =====
 [K+'many']:(p)=>{
  let s=twoScene({rG:seg(p,.05,.2)});
  s+=card(620,90,540,330,L('粒子が 2つ',890,145,{size:26,color:C.dim})
   +T(`${bL}=${br}_1${X}${bp}_1+${br}_2${X}${bp}_2`,890,230,{size:40})
   +fade(seg(p,.5,.65),L('それぞれに',890,315,{size:26,color:C.ink})+T(`\\dfrac{d}{dt}(${br}${X}${bp})=${br}${X}${bF}`,890,385,{size:32})),seg(p,.02,.12));
  return s;
 },
 [K+'forces']:(p)=>{
  let s=twoScene({inG:seg(p,.1,.25),exG:seg(p,.4,.55)});
  s+=card(680,90,480,330,L('運動量・上級と 同じ 書き方',920,140,{size:22,color:C.dim})
   +fade(seg(p,.1,.25),L('内力',800,215,{size:28,color:CF,weight:700})+T(`${bF}_{12},\\ ${bF}_{21}`,990,215,{size:34}))
   +fade(seg(p,.4,.55),L('外力',800,300,{size:28,color:CX,weight:700})+T(`${B(CX,'F')}_1,\\ ${B(CX,'F')}_2`,990,300,{size:34}))
   +fade(seg(p,.55,.7),L('𝐅₁₂：2 が 1 に 及ぼす 力',920,380,{size:24,color:C.ink})),seg(p,.02,.12));
  return s;
 },
 [K+'sum4']:(p)=>{
  const pre=`\\dfrac{d${bL}}{dt}=`,tin=`${br}_1${X}${bF}_{12}+${br}_2${X}${bF}_{21}`,tex_=`${br}_1${X}${B(CX,'F')}_1+${br}_2${X}${B(CX,'F')}_2`,f0=`${pre}${tin}+${tex_}`;
  let s=T(f0,600,140,{size:42});
  const [a0,aw]=span(f0,pre,tin,42),[b0,bw]=span(f0,`${pre}${tin}+`,tex_,42);
  s+=fade(seg(p,.5,.65),boxT(f0,pre,tin,42,140,1,CF)+L('内力の トルク',a0+aw/2,260,{size:28,color:CF,weight:700}));
  s+=fade(seg(p,.5,.65),L('外力の トルク',b0+bw/2,260,{size:28,color:CX,weight:700}));
  return s;
 },
 [K+'aa']:(p)=>{
  let s=T(`${br}_1${X}${bF}_{12}+${br}_2${X}${bF}_{21}`,600,90,{size:44});
  s+=fade(seg(p,.1,.25),L('作用・反作用',600,170,{size:26,color:C.dim})+T(`${bF}_{21}=-${bF}_{12}`,600,225,{size:38}));
  s+=fade(seg(p,.35,.5),T(`=${br}_1${X}${bF}_{12}-${br}_2${X}${bF}_{12}`,600,320,{size:42}));
  s+=fade(seg(p,.65,.8),T(`=(${br}_1-${br}_2)${X}${bF}_{12}`,600,430,{size:46}));
  return s;
 },
 [K+'line']:(p)=>{
  let s=twoScene({rG:.35,inG:1,diffG:seg(p,.05,.25),lab:1});
  s+=card(680,90,480,330,L('𝐫₁−𝐫₂：2 から 1 へ',920,145,{size:28,color:CL,weight:700})
   +fade(seg(p,.4,.55),L('内力が この 線の 上',920,215,{size:28,color:CF,weight:700}))
   +fade(seg(p,.55,.7),L('→ 平行',920,275,{size:28,color:C.ink}))
   +fade(seg(p,.7,.85),T(`(${br}_1-${br}_2)${X}${bF}_{12}=\\mathbf{0}`,920,355,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'num']:(p)=>{
  let s=twoScene({rG:1,inG:seg(p,.45,.6)});
  s+=label('1 目盛り ＝ 1 m',TX(1.6),TY(2.6),{size:22,color:C.dim});
  s+=[1,2,3].map(i=>line(TX(i),TP.oy-5,TX(i),TP.oy+5,{color:C.dim})+(i<3?line(TP.ox-5,TY(i),TP.ox+5,TY(i),{color:C.dim}):'')).join('');
  s+=card(680,90,480,330,T(`${br}_1=(1,\\ 2,\\ 0)`,920,150,{size:36})
   +fade(seg(p,.15,.3),T(`${br}_2=(3,\\ 0,\\ 0)`,920,220,{size:36}))
   +fade(seg(p,.45,.6),L('引き合う 力',920,290,{size:24,color:CF})+T(`${bF}_{12}=(1,\\ -1,\\ 0)\\ \\mathrm{N}`,920,355,{size:34})),seg(p,.02,.12));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=twoScene({rG:1,inG:1});
  const p1=[TX(1),TY(2)],p2=[TX(3),TY(0)];
  s+=fade(seg(p,.1,.25),turnArc(TP.ox,TP.oy,200,1.25,.85,{color:CN,w:4})+inSym(p1[0]-60,p1[1]-50,18,CN));
  s+=fade(seg(p,.45,.6),turnArc(TP.ox,TP.oy,300,.08,.42,{color:CN,w:4})+outSym(p2[0]+30,p2[1]-120,18,CN));
  s+=card(660,60,500,400,T(`${br}_1${X}${bF}_{12}`,910,110,{size:30})
   +fade(seg(p,.1,.25),T(`1\\times(-1)-2\\times 1=-3`,910,170,{size:32})+L('時計回り ⊗',910,220,{size:24,color:CN,weight:700}))
   +fade(seg(p,.4,.5),T(`${br}_2${X}${bF}_{21},\\ \\ ${bF}_{21}=(-1,\\ 1,\\ 0)`,910,280,{size:28}))
   +fade(seg(p,.45,.6),T(`3\\times 1-0\\times(-1)=3`,910,340,{size:32})+L('反時計回り ⊙',910,390,{size:24,color:CN,weight:700}))
   +fade(seg(p,.75,.88),L('和 ＝ 0',910,440,{size:30,color:C.hi,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'ext']:(p)=>{
  const e=`\\dfrac{d${bL}}{dt}=${bN}`,w=texWidth(e,64,false);
  let s=L('粒子 全体',600,70,{size:28,color:C.dim});
  s+=T(e,580,190,{size:64})+label('外',580+w/2+4,215,{size:34,color:CN,weight:700});
  s+=highlight(580-w/2-28,110,w+90,150,seg(p,.1,.25));
  s+=fade(seg(p,.4,.55),card(200,320,800,150,L('剛体の回転・中級の 約束',600,365,{size:24,color:C.dim})+L('内力の トルクが 打ち消す 理由 → 回収',600,425,{size:30,color:C.hi,weight:700}),1,C.hi));
  return s;
 },
 [K+'assume']:(p)=>{
  let s=card(150,50,900,170,L('仮定',600,100,{size:26,color:C.dim})+L('内力は 2つを 結ぶ 線の 上',600,170,{size:36,color:C.hi,weight:700}),seg(p,0,.1),C.hi);
  const it=(x,t,g)=>fade(g,L(t,x,330,{size:30,color:CF,weight:700})+L('成り立つ',x,385,{size:24,color:C.dim}));
  // tiny pictures
  s+=fade(seg(p,.4,.55),dot(220,280,10,C.ink)+dot(380,280,10,C.ink)+draw(Array.from({length:21},(_,i)=>[230+140*i/20,280+(i%2?10:-10)*(i>0&&i<20?1:0)]),1,{color:C.dim,w:3}));
  s+=it(300,'ばね',seg(p,.4,.55))+it(600,'糸',seg(p,.5,.65))+it(900,'万有引力',seg(p,.6,.75));
  s+=fade(seg(p,.5,.65),dot(520,280,10,C.ink)+dot(680,280,10,C.ink)+line(530,280,670,280,{color:C.dim,w:3}));
  s+=fade(seg(p,.6,.75),dot(820,280,14,C.E)+dot(980,280,10,C.x)+arrow(830,265,880,265,{color:CF,w:4,head:10})+arrow(970,265,920,265,{color:CF,w:4,head:10}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum']:(p)=>{
  let s=card(100,40,1000,420,
   T(`${dLdt}=${bv}${X}m${bv}+${br}${X}${bF}`,600,140,{size:46})
   +strikeT(`${dLdt}=${bv}${X}m${bv}+${br}${X}${bF}`,`${dLdt}=`,`${bv}${X}m${bv}`,46,140,seg(p,.3,.45))+fade(seg(p,.3,.45),L('＝ 0',(()=>{const [a,b]=span(`${dLdt}=${bv}${X}m${bv}+${br}${X}${bF}`,`${dLdt}=`,`${bv}${X}m${bv}`,46);return a+b/2;})(),230,{size:28,color:C.a,weight:700}))
   +fade(seg(p,.6,.75),T(`${dLdt}=${bN}`,600,360,{size:62})),seg(p,0,.1),CF);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=twoScene({rG:.35,inG:1,exG:1,lab:0});
  s+=fade(seg(p,.1,.25),strike(TX(1)+20,TY(2)+20,TX(1)+90,TY(2)+90)+strike(TX(3)-20,TY(0)-20,TX(3)-90,TY(0)-90));
  const e=`\\dfrac{d${bL}}{dt}=${bN}`,w=texWidth(e,52,false);
  s+=card(680,110,480,290,L('内力の トルク：組ごとに 消える',920,165,{size:24,color:CF,weight:700})
   +fade(seg(p,.4,.55),T(e,910,270,{size:52})+label('外',910+w/2+4,292,{size:28,color:CN,weight:700}))
   +fade(seg(p,.55,.7),L('外からの トルク だけ',920,360,{size:26,color:CX,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'next']:(p)=>{
  const cx=300,cy=270,a=230,b=150,c=Math.sqrt(a*a-b*b);
  let s=fade(.7,draw(Array.from({length:121},(_,i)=>{const t=2*Math.PI*i/120;return [cx+a*Math.cos(t),cy-b*Math.sin(t)];}),1,{color:C.faint,w:2,dash:'6 7'}));
  const sx=cx+c,sy=cy;
  s+=dot(sx,sy,24,'#ffcf67')+L('太陽',sx,sy+58,{size:22,color:C.t});
  const t=2*Math.PI*(.15+.5*p),px=cx+a*Math.cos(t),py=cy-b*Math.sin(t);
  const l=Math.hypot(sx-px,sy-py);
  s+=fade(seg(p,.1,.25),arrow(px,py,px+(sx-px)/l*70,py+(sy-py)/l*70,{color:CF,w:5,head:13}));
  s+=dot(px,py,12,C.x);
  s+=card(660,100,500,300,L('トルク 0 なら 𝐋 は 変わらない',910,150,{size:24,color:C.dim})
   +L('太陽の 引力 だけ',910,225,{size:30,color:C.ink,weight:700})
   +fade(seg(p,.3,.45),L('何が 一定に なる？',910,310,{size:34,color:C.hi,weight:700})),seg(p,.02,.12),C.hi);
  return s;
 },
};
