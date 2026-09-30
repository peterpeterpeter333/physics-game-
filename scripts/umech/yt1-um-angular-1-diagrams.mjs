// YouTube シリーズ「角運動量・中級 1/2」(ys-um-angular-1) — 図。Stage 1200×515.
// 色（外積・中級、角運動量・初級とそろえる）：𝐫 水色、𝐅 緑、𝐍 桃、直角な部分 F sinθ 黄、θ・dθ 橙、仕事 J 橙、𝐩 桃。ベクトルは太字、大きさは細字。
// 平面は真上から見る。画面の上向きの 𝐅、𝐫 が右 → 反時計回り → 𝐍 は手前 ⊙（成分 (0.5,0,0)×(0,4,0)＝(0,0,2)）。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-angular-1:';
const CR=C.x,CF=C.F,CN=C.p,CQ=C.hi,CT=C.E,CW=C.E,CP=C.p,WOOD='#b99b73';
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const bN=cs(CN,'\\mathbf{N}'),br=cs(CR,'\\mathbf{r}'),bF=cs(CF,'\\mathbf{F}'),bp=cs(CP,'\\mathbf{p}');
const NM='\\,\\mathrm{N\\cdot m}';

function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function head(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),L=16;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;}
// arc 𝐫 → 𝐅 (first half 𝐫 colour, second half 𝐅 colour)
function arc2(pts,{c1=CR,c2=CF,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2);
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head(pts,c2));
}
function turnArc(cx,cy,r,a0,a1,{color=CN,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30);
 return fade(g,draw(pts,1,{color,w})+head(pts,color));
}
function rightMark(x,y,ux,uy,vx,vy,q=14,color=C.dim){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w:2});}
const tick=(x,y,sz=14,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});

// ---- S2: board seen from above, force at P, three base points --------------------------------------
const G={px:560,py:250,ppm:300,k:40};
const BASES={O:[G.px-.5*G.ppm,G.py],O2:[G.px+.5*G.ppm,G.py],Q:[G.px,G.py+.5*G.ppm]};
const BNAME={O:'O',O2:'O′',Q:'Q'};
function boardScene({Fg=1,bases=[],sel=null,rG=0,arcG=0,symG=0,pinG=0,valG=0,moveG=0,turn=0,title=1,qmark=0}={}){
 let s=title?label('真上から見た図',40,50,{size:24,color:C.dim}):'';
 // board (rotates about the pinned base when turn≠0)
 const piv=sel?BASES[sel]:[G.px,G.py];
 const rot=(x,y)=>{const dx=x-piv[0],dy=y-piv[1],c=Math.cos(turn),sn=Math.sin(turn);return [piv[0]+dx*c+dy*sn,piv[1]-dx*sn+dy*c];};
 const corners=[[300,120],[800,120],[800,455],[300,455]].map(q=>rot(...q));
 s+=poly(corners,{fill:WOOD,fo:.16,stroke:WOOD,sw:3});
 const [Px,Py]=rot(G.px,G.py);
 for(const b of bases){const [bx,by]=rot(...BASES[b]);const on=b===sel;
  s+=ring(bx,by,on?11:8,{color:on?C.ink:C.dim,w:3,fill:C.bg})+label(BNAME[b],bx+(b==='Q'?18:-8),by+(b==='Q'?10:44),{size:26,color:on?C.ink:C.dim,anchor:b==='Q'?'start':'middle',weight:on?700:400});
  if(qmark)s+=fade(qmark,label('？',bx,by-22,{size:28,color:C.hi,anchor:'middle',weight:700}));}
 if(pinG>0&&sel){const [bx,by]=rot(...BASES[sel]);s+=fade(pinG,dot(bx,by,7,C.hi)+ring(bx,by,16,{color:C.hi,w:3}));}
 if(sel&&rG>0){const [bx,by]=rot(...BASES[sel]);
  const off=0;
  s+=fade(rG,arrow(bx+off,by,bx+off+(Px-bx)*rG,by+(Py-by)*rG,{color:CR,w:6,head:16}));
  const mx=(bx+Px)/2,my=(by+Py)/2;
  s+=fade(rG,vl('r',sel==='Q'?mx-50:mx,sel==='Q'?my+10:my+46,{size:30,color:CR,anchor:'middle'}));
 }
 s+=dot(Px,Py,9,C.ink)+label('P',Px+14,Py+34,{size:26,color:C.ink,weight:700});
 if(Fg>0){const c=Math.cos(turn),sn=Math.sin(turn),L=4*G.k;const tx=Px-L*sn,ty=Py-L*c;
  s+=fade(Fg,arrow(Px,Py,tx,ty,{color:CF,w:7})+vl('F',tx+14,ty+24,{size:30,color:CF})+label('4 N',tx+14,ty+62,{size:24,color:CF}));}
 if(sel&&arcG>0&&sel!=='Q'){const [bx,by]=BASES[sel];
  const ccw=sel==='O';const a0=ccw?0:Math.PI,a1=ccw?Math.PI/2:Math.PI/2;
  s+=arc2(circPts(bx,by,70,a0,mix(a0,a1,arcG),30),{g:Math.min(1,arcG*6)});}
 if(sel&&symG>0){const [bx,by]=BASES[sel];s+=sel==='O'?outSym(bx,by,24,CN,symG):sel==='O2'?inSym(bx,by,24,CN,symG):'';}
 return s;
}
// small table of the three results (right card)
function resultRows(x,y,{g=[1,1,1],hl=-1}={}){
 const rows=[['O','2 N·m','out'],['O′','2 N·m','in'],['Q','0','zero']];
 let s='';
 rows.forEach(([n,v,k],i)=>{const yy=y+i*62;
  s+=fade(g[i],(i===hl?rect(x-14,yy-36,330,52,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:10}):'')+label('基準点 '+n,x,yy,{size:26,color:C.ink})+label(v,x+200,yy,{size:28,color:CN,weight:700,anchor:'end'})
   +(k==='out'?outSym(x+250,yy-9,17):k==='in'?inSym(x+250,yy-9,17):label('回らない',x+222,yy,{size:22,color:C.dim})));
 });
 return s;
}

// ---- S3: oblique push at 30°, small rotation dθ -------------------------------------------------------
const G3={ox:130,oy:390,ppm:760,k:45};
const TH=30*RAD,DT=.1;
const P3=[G3.ox+.5*G3.ppm,G3.oy];
function oblique({rG=1,Fg=1,thG=1,rotG=0,tanG=0,splitG=0,noworkG=0,paraG=0,axisG=0,dthLbl=1,rdLbl=1,base=1}={}){
 const {ox,oy}=G3,[px,py]=P3,L=4*G3.k,ux=Math.cos(TH),uy=-Math.sin(TH),R=.5*G3.ppm;
 let s=label('真上から見た図',40,50,{size:24,color:C.dim});
 if(paraG>0)s+=fade(paraG,poly([[ox,oy],[px,py],[px+ux*L,py+uy*L],[ox+ux*L,oy+uy*L]],{fill:CQ,fo:.24,stroke:C.faint,sw:2})+arrow(ox,oy,ox+ux*L,oy+uy*L,{color:CF,w:3,head:12,opacity:.55}));
 // rotated ghost of the arm
 if(rotG>0){const a=DT*rotG,qx=ox+R*Math.cos(a),qy=oy-R*Math.sin(a);
  s+=line(ox,oy,qx,qy,{color:CR,w:3,dash:'8 7',opacity:.8})+draw(circPts(ox,oy,R,0,a,20),1,{color:CT,w:7})+dot(qx,qy,7,C.dim);
  s+=fade(dthLbl*seg(rotG,.3,1),draw(circPts(ox,oy,110,0,a,12),1,{color:CT,w:3})+label('dθ',ox+118,oy-14,{size:26,color:CT,weight:700}));
  s+=fade(rdLbl*seg(rotG,.5,1),label('r dθ',px-100,py-64,{size:26,color:CT,weight:700}));}
 if(base){s+=ring(ox,oy,11,{color:C.ink,w:3,fill:C.bg})+label('O',ox-6,oy+44,{size:26,color:C.ink,anchor:'middle',weight:700});}
 if(rG>0)s+=fade(rG,arrow(ox,oy,px-6,py,{color:CR,w:6,head:16})+vl('r',(ox+px)/2,oy+46,{size:30,color:CR,anchor:'middle'})+label('0.5 m',(ox+px)/2+50,oy+40,{size:22,color:CR}));
 if(tanG>0)s+=fade(tanG,line(px,py+70,px,py-150,{color:C.dim,w:2,dash:'6 6'})+rightMark(px,py,-1,0,0,1,16)+label('円の接線',px+16,py-150,{size:22,color:C.dim}));
 if(splitG>0){
  s+=fade(splitG,arrow(px,py,px+L*ux,py,{color:CF,w:4,head:14,opacity:.7})+label('F cosθ',px+L*ux-6,py+36,{size:24,color:CF,anchor:'middle'}));
  s+=fade(splitG,arrow(px,py,px,py+L*uy,{color:CQ,w:6,head:16})+label('F sinθ',px-14,py+L*uy/2+8,{size:26,color:CQ,weight:700,anchor:'end'}));
  s+=fade(splitG,line(px,py+L*uy,px+L*ux,py+L*uy,{color:C.faint,w:2,dash:'5 5'})+line(px+L*ux,py,px+L*ux,py+L*uy,{color:C.faint,w:2,dash:'5 5'}));
 }
 if(noworkG>0){const x=px+L*ux*.55;s+=fade(noworkG,label('仕事 0',x,py+70,{size:26,color:C.a,anchor:'middle',weight:700}));}
 s+=dot(px,py,9,C.ink)+label('P',px-4,py+36,{size:24,color:C.ink,anchor:'end'});
 if(Fg>0)s+=fade(Fg,arrow(px,py,px+ux*L,py+uy*L,{color:CF,w:7})+vl('F',px+ux*L+12,py+uy*L-2,{size:30,color:CF})+label('4 N',px+ux*L+14,py+uy*L+34,{size:22,color:CF}));
 if(thG>0){s+=fade(thG,line(px,py,px+100,py,{color:C.dim,w:2,dash:'5 6'})+draw(circPts(px,py,58,0,TH,16),1,{color:CT,w:3.5})+label('θ＝30°',px+66,py-8,{size:22,color:CT,weight:700}));}
 if(axisG>0){s+=outSym(ox,oy,24,CN,axisG)+turnArc(ox,oy,70,.15,.15+1.35*axisG,{color:CN,g:Math.min(1,axisG*5)});}
 return s;
}

// ---- small rotating bar (quiz) ----------------------------------------------------------------------
function bar(p){const cx=240,cy=330,L=300,a=.05*6*seg(p,.2,.7);
 let s=label('真上から見た図',40,50,{size:24,color:C.dim});
 s+=line(cx,cy,cx+L,cy,{color:WOOD,w:14,cap:'butt',opacity:.3});
 s+=line(cx,cy,cx+L*Math.cos(a),cy-L*Math.sin(a),{color:WOOD,w:14,cap:'butt'});
 s+=ring(cx,cy,12,{color:C.ink,w:3,fill:C.bg})+label('基準点',cx,cy+46,{size:22,color:C.dim,anchor:'middle'});
 s+=draw(circPts(cx,cy,120,0,a,20),1,{color:CT,w:4})+fade(seg(p,.5,.7),label('0.05 rad（小さく）',cx+130,cy-36,{size:24,color:CT,weight:700}));
 const [tx,ty]=[cx+L*Math.cos(a),cy-L*Math.sin(a)];
 s+=arrow(tx,ty,tx-Math.sin(a)*120-40,ty-Math.cos(a)*120,{color:CF,w:6})+vl('F',tx-50,ty-130,{size:28,color:CF});
 return s;
}

export const ytUmAngular1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const cx=300,cy=280,R=150,a=.6+2.2*seg(p,.05,.95),bx=cx+R*Math.cos(a),by=cy-R*Math.sin(a),o2=[110,110];
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'});
  s+=arrow(cx,cy,bx-10*Math.cos(a),by+10*Math.sin(a),{color:CR,w:5,head:14})+ring(cx,cy,9,{color:C.ink,w:3,fill:C.bg})+label('O',cx+14,cy+30,{size:24,color:C.ink});
  s+=fade(seg(p,.25,.4),arrow(o2[0],o2[1],bx,by,{color:CR,w:3,head:12,opacity:.6})+ring(o2[0],o2[1],8,{color:C.dim,w:3,fill:C.bg})+label('O′',o2[0]-10,o2[1]-18,{size:24,color:C.dim,anchor:'middle'}));
  s+=ring(bx,by,20,{color:C.ink,w:3,fill:'#2c3854'});
  s+=card(640,100,510,300,label('回転の勢いを 測るには',895,165,{size:28,color:C.ink,anchor:'middle'})
   +label('どの点のまわりか を',895,235,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('なぜ 先に決める？',895,295,{size:32,color:C.hi,anchor:'middle',weight:700})
   +label('前回の最後の問い',895,360,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=oblique({thG:0,rG:1});
  s+=fade(seg(p,.05,.2),label('選んだ点',G3.ox,G3.oy+78,{size:22,color:C.dim,anchor:'middle'}));
  s+=card(740,70,420,380,label('回す効き目：トルク',950,125,{size:26,color:C.dim,anchor:'middle'})
   +label('初級',790,195,{size:24,color:C.dim})+T(`${cs(CN,'N')}=${cs(CR,'r')}\\,${cs(CF,'F')}\\sin${cs(CT,'\\theta')}`,1000,190,{size:38})
   +fade(seg(p,.5,.65),label('外積・中級',790,285,{size:24,color:C.dim})+T(`${bN}=${br}\\times${bF}`,1030,280,{size:42}))
   +fade(seg(p,.6,.75),label('𝐫 が先、𝐅 が後',950,370,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'plan']:(p)=>{
  const it=(i,t,c,g)=>fade(g,dot(170,150+i*95,9,c)+label(t,200,160+i*95,{size:32,color:c,weight:700}));
  let s=card(110,70,980,380,label('今回 確かめること',600,120,{size:26,color:C.dim,anchor:'middle'})
   +it(0,'① 点を先に決める 理由',C.ink,seg(p,.05,.2))
   +it(1,'② トルクを 𝐫 × 𝐅 と書ける 理由',C.ink,seg(p,.25,.4))
   +it(2,'③ 回転の勢い → 次の回',C.dim,seg(p,.65,.8)),seg(p,0,.1));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=boardScene({bases:['O','O2'],qmark:seg(p,.2,.35)});
  s+=card(830,120,340,260,label('同じ力でも',1000,185,{size:28,color:C.ink,anchor:'middle'})+label('測る点で',1000,240,{size:28,color:C.ink,anchor:'middle'})
   +label('トルクは 変わる？',1000,300,{size:30,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',1000,350,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ===== S2 基準点で変わるトルク =====
 [K+'board']:(p)=>{
  let s=boardScene({Fg:seg(p,.45,.65)});
  s+=card(830,130,340,230,label('板の点 P を',1000,195,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('画面の上向きに',1000,255,{size:28,color:CF,anchor:'middle'})+label('4 N で押す',1000,310,{size:30,color:CF,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'rdef']:(p)=>{
  let s=boardScene({bases:['O'],sel:'O',rG:seg(p,.2,.45)});
  s+=card(830,100,340,300,label('𝐫',1000,165,{size:34,color:CR,anchor:'middle',weight:700})
   +label('基準点 → 力が働く点',1000,225,{size:26,color:CR,anchor:'middle'})
   +fade(seg(p,.55,.7),label('基準点を 決めて',1000,300,{size:26,color:C.ink,anchor:'middle'})+label('初めて 𝐫 が決まる',1000,350,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'O']:(p)=>{
  let s=boardScene({bases:['O'],sel:'O',rG:1});
  s+=fade(seg(p,.1,.3),label('0.5 m',BASES.O[0]+75,BASES.O[1]-18,{size:24,color:CR,anchor:'middle'})+rightMark(G.px,G.py,-1,0,0,-1,16));
  s+=card(830,100,340,300,label('基準点 O',1000,160,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('𝐫 右、𝐅 上：直角',1000,220,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),T(`N=0.5\\times4`,1000,295,{size:36})+T(`=2${NM}`,1010,360,{size:38,color:CN})),seg(p,.05,.2));
  return s;
 },
 [K+'Odir']:(p)=>{
  let s=boardScene({bases:['O'],sel:'O',rG:1,arcG:seg(p,.05,.35),symG:seg(p,.55,.7)});
  s+=card(830,100,340,300,label('𝐫 → 𝐅：反時計回り',1000,165,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.35,.5),label('右ねじは ゆるんで',1000,230,{size:24,color:C.dim,anchor:'middle'})+label('手前へ',1000,265,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),T(bN,930,330,{size:44})+label('手前向き',965,342,{size:28,color:CN,weight:700})+outSym(1115,330,18)),seg(p,0,.12));
  return s;
 },
 [K+'O2']:(p)=>{
  let s=boardScene({bases:['O','O2'],sel:'O2',rG:seg(p,.05,.3),arcG:seg(p,.35,.6),symG:seg(p,.7,.85)});
  s+=fade(seg(p,.1,.3),label('0.5 m',BASES.O2[0]-75,BASES.O2[1]-18,{size:24,color:CR,anchor:'middle'}));
  s+=card(830,100,340,300,label('基準点 O′',1000,160,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('𝐫 左 → 𝐅 上：時計回り',1000,220,{size:24,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),T(`2${NM}`,960,300,{size:38,color:CN})+inSym(1085,298,18)+label('奥向き',1000,360,{size:28,color:CN,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'Q']:(p)=>{
  let s=boardScene({bases:['O','O2','Q'],sel:'Q',rG:seg(p,.25,.45)});
  s+=fade(seg(p,.45,.6),line(G.px,40,G.px,480,{color:CF,w:2,dash:'8 8',opacity:.6}));
  s+=card(830,100,340,300,label('基準点 Q（P の真下）',1000,160,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('𝐫 と 𝐅 が 同じ向き',1000,225,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.6,.75),T(`N=r\\,F\\sin 0^\\circ=0`,1000,305,{size:34,color:CN})),seg(p,0,.12));
  return s;
 },
 [K+'three']:(p)=>{
  let s=boardScene({bases:['O','O2','Q'],title:1});
  s+=fade(seg(p,.1,.25),outSym(BASES.O[0],BASES.O[1]-44,16))+fade(seg(p,.3,.45),inSym(BASES.O2[0],BASES.O2[1]-44,16));
  s+=card(820,90,360,320,label('同じ板・同じ力',1000,140,{size:26,color:C.dim,anchor:'middle'})+resultRows(850,210,{g:[seg(p,.1,.25),seg(p,.3,.45),seg(p,.5,.65)]})
   +fade(seg(p,.7,.85),label('三通りに 変わる',1000,395,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'pin']:(p)=>{
  const ph=p<.34?0:p<.67?1:2,sel=['O','O2','Q'][ph],u=seg(p,ph/3+.05,ph/3+.28);
  const turn=sel==='O'?.35*u:sel==='O2'?-.35*u:0;
  let s=boardScene({bases:['O','O2','Q'],sel,pinG:1,turn});
  if(sel!=='Q'){const [bx,by]=BASES[sel];s+=turnArc(bx,by,60,sel==='O'?.3:Math.PI-.3,sel==='O'?.3+1.4*u:Math.PI-.3-1.4*u,{color:CN,g:u});}
  s+=card(820,90,360,320,label('ピン留めすると',1000,140,{size:26,color:C.dim,anchor:'middle'})
   +label('O：反時計回り',860,215,{size:28,color:ph===0?C.hi:C.ink,weight:ph===0?700:400})
   +fade(seg(p,.34,.4),label('O′：時計回り',860,285,{size:28,color:ph===1?C.hi:C.ink,weight:ph===1?700:400}))
   +fade(seg(p,.67,.73),label('Q：回らない',860,355,{size:28,color:ph===2?C.hi:C.ink,weight:ph===2?700:400})),seg(p,0,.08));
  return s;
 },
 [K+'why']:(p)=>{
  let s=boardScene({bases:['O','O2'],sel:'O',rG:1});
  // second r from O' drawn too
  const [bx,by]=BASES.O2;s+=fade(seg(p,.4,.6),arrow(bx,by+24,G.px+6,G.py+24,{color:CR,w:4,head:13,opacity:.75})+label('別の 𝐫',(bx+G.px)/2,by+62,{size:24,color:CR,anchor:'middle'}));
  s+=card(830,100,340,300,label('𝐫 ＝ 位置の矢印',1000,165,{size:28,color:CR,anchor:'middle',weight:700})
   +label('（基準点から測る）',1000,215,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.45,.6),label('原点を変えると',1000,285,{size:26,color:C.ink,anchor:'middle'})+label('𝐫 もトルクも 変わる',1000,340,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'fix']:(p)=>{
  let s=boardScene({bases:['O'],sel:'O',rG:1,pinG:seg(p,.3,.45)});
  s+=card(820,80,360,350,label('トルクを 足す・時間で追う',1000,135,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.3,.45),label('慣性系に固定した',1000,205,{size:28,color:C.ink,anchor:'middle'})+label('一つの点を 先に決める',1000,255,{size:28,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),label('途中で 移さない',1000,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S3 小さな回転の仕事 =====
 [K+'whyrf']:(p)=>{
  let s=card(80,70,1040,380,label('なぜ トルクは',600,135,{size:28,color:C.ink,anchor:'middle'})
   +T(`${cs(CR,'r')}\\times${cs(CF,'F')}\\times\\sin${cs(CT,'\\theta')}`,600,215,{size:52})
   +label('の 積なのか？',600,285,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('初級：直角に押す → 回す角度あたりの 仕事',600,380,{size:28,color:CW,anchor:'middle',weight:700})),seg(p,0,.12),C.hi);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=oblique({rG:seg(p,.1,.3),Fg:seg(p,.4,.6),thG:seg(p,.55,.7)});
  s+=card(760,100,400,300,label('今度は 斜めに押す',960,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.1,.3),label('r ＝ 0.5 m',960,230,{size:28,color:CR,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.6),label('F ＝ 4 N',960,285,{size:28,color:CF,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('θ ＝ 30°（𝐫 から）',960,340,{size:28,color:CT,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'rot']:(p)=>{
  let s=oblique({rotG:seg(p,.15,.6)});
  s+=card(760,100,400,300,label('O のまわりに',960,160,{size:26,color:C.ink,anchor:'middle'})+label('小さな角度 dθ 回す',960,210,{size:28,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('P が動く 弧の長さ',960,285,{size:26,color:C.ink,anchor:'middle'})+T(`${cs(CR,'r')}\\,${cs(CT,'d\\theta')}`,960,345,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'tan']:(p)=>{
  let s=oblique({rotG:1,tanG:seg(p,.15,.4)});
  s+=card(760,120,400,260,label('小さな動きの 向き',960,185,{size:26,color:C.ink,anchor:'middle'})
   +label('円の接線',960,250,{size:30,color:CT,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('＝ 𝐫 に直角',960,310,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'split']:(p)=>{
  let s=oblique({rotG:1,dthLbl:0,rdLbl:0,splitG:seg(p,.2,.5),Fg:1-.45*seg(p,.2,.5),thG:1});
  s+=card(760,100,400,300,label('力を 分ける',960,160,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.2,.4),label('𝐫 に沿う：F cosθ',960,235,{size:28,color:CF,anchor:'middle'}))
   +fade(seg(p,.45,.6),label('𝐫 に直角：F sinθ',960,305,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'nowork']:(p)=>{
  let s=oblique({rotG:1,dthLbl:0,rdLbl:0,splitG:1,Fg:.55,noworkG:seg(p,.1,.3)});
  s+=card(760,90,400,330,label('𝐫 に沿う部分',960,150,{size:26,color:CF,anchor:'middle'})
   +label('動きに 直角 → 仕事 0',960,205,{size:28,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),label('（内積 ＝ 0）',960,255,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('仕事をするのは',960,325,{size:26,color:C.ink,anchor:'middle'})+label('F sinθ だけ',960,380,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'dW']:(p)=>{
  let s=oblique({rotG:1,dthLbl:1,rdLbl:1,splitG:1,Fg:.55});
  s+=card(740,90,430,330,label('小さな仕事',955,150,{size:28,color:CW,anchor:'middle',weight:700})
   +T(`dW=${cs(CQ,'F\\sin\\theta')}\\times${cs(CR,'r')}\\,${cs(CT,'d\\theta')}`,955,230,{size:36})
   +fade(seg(p,.45,.6),T(`=${cs(CR,'r')}\\,${cs(CF,'F')}\\sin\\theta\\,${cs(CT,'d\\theta')}`,975,310,{size:38}))
   +fade(seg(p,.1,.25),label('力の直角な部分 × 動いた距離',955,385,{size:22,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'perangle']:(p)=>{
  let s=card(90,60,1020,400,label('回す角度あたりの 仕事',600,120,{size:28,color:CW,anchor:'middle',weight:700})
   +T(`\\frac{dW}{${cs(CT,'d\\theta')}}=${cs(CR,'r')}\\,${cs(CF,'F')}\\sin\\theta`,600,230,{size:60})
   +fade(seg(p,.3,.45),label('dθ で割る',600,315,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('＝ トルクの大きさ N',600,395,{size:36,color:CN,anchor:'middle',weight:700})),seg(p,0,.1),C.hi);
  return s;
 },
 [K+'num']:(p)=>{
  let s=oblique({rotG:1,splitG:1,Fg:.55,thG:1});
  s+=card(740,80,430,360,label('dθ ＝ 0.1 rad なら',955,135,{size:28,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('弧',775,210,{size:26,color:C.ink})+T(`0.5\\times0.1=${cs(CT,'0.05\\,\\mathrm{m}')}`,990,205,{size:34}))
   +fade(seg(p,.55,.7),label('直角な部分',775,300,{size:24,color:C.ink})+T(`4\\times\\sin30^\\circ`,1020,295,{size:32})+T(`=${cs(CQ,'2\\,\\mathrm{N}')}`,1020,365,{size:34})),seg(p,0,.12));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=card(60,60,1080,410,label('仕事',200,140,{size:28,color:CW,weight:700,anchor:'middle'})
   +T(`${cs(CQ,'2')}\\times${cs(CT,'0.05')}\\approx${cs(CW,'0.1\\,\\mathrm{J}')}`,560,135,{size:44})
   +fade(seg(p,.3,.45),label('÷ 回した角',200,240,{size:26,color:C.ink,anchor:'middle'})+T(`${cs(CW,'0.1')}\\div${cs(CT,'0.1')}=1`,560,235,{size:44}))
   +fade(seg(p,.55,.7),label('rF sinθ',200,340,{size:28,color:CN,anchor:'middle',weight:700})+T(`0.5\\times4\\times0.5=${cs(CN,'1'+NM)}`,600,335,{size:44}))
   +fade(seg(p,.8,.92),tick(1010,240,18)+tick(1010,340,18)+label('一致',1045,300,{size:30,color:C.F,weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'approx']:(p)=>{
  const a=DT*seg(p,.1,.6);
  let s=oblique({rotG:1,dthLbl:0,rdLbl:0,thG:0});
  // θ measured again at the rotated point (F keeps its direction)
  const {ox,oy}=G3,R=.5*G3.ppm,qx=ox+R*Math.cos(DT),qy=oy-R*Math.sin(DT);
  s+=fade(seg(p,.2,.4),line(qx,qy,qx+110*Math.cos(DT),qy-110*Math.sin(DT),{color:C.dim,w:2,dash:'5 6'})+arrow(qx,qy,qx+150*Math.cos(TH),qy-150*Math.sin(TH),{color:CF,w:4,head:14,opacity:.7})+draw(circPts(qx,qy,60,DT,TH,12),1,{color:CT,w:3.5})+label('θ が 少し変わる',qx+30,qy-120,{size:24,color:CT,weight:700}));
  s+=card(760,110,400,280,label('「およそ」の理由',960,170,{size:28,color:C.ink,anchor:'middle'})
   +label('回す間に θ が 少し変わる',960,235,{size:26,color:CT,anchor:'middle'})
   +fade(seg(p,.55,.7),label('dθ を小さくするほど',960,305,{size:26,color:C.ink,anchor:'middle'})+label('正確になる',960,355,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S4 𝐫×𝐅 と書ける理由 =====
 [K+'area']:(p)=>{
  let s=oblique({paraG:seg(p,.3,.55),thG:1});
  s+=card(740,90,430,340,label('角度あたりの仕事',955,145,{size:26,color:CW,anchor:'middle'})
   +T(`${cs(CR,'r')}\\,${cs(CF,'F')}\\sin\\theta`,955,215,{size:44})
   +fade(seg(p,.35,.5),label('＝ 平行四辺形の面積',955,290,{size:28,color:CQ,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.75),T(`=|${br}\\times${bF}|`,955,370,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'axis']:(p)=>{
  let s=oblique({paraG:.5,thG:0,rotG:seg(p,.05,.35),dthLbl:0,rdLbl:0,axisG:seg(p,.45,.75)});
  s+=card(740,90,430,340,label('仕事が 正になる 回し方',955,145,{size:26,color:C.ink,anchor:'middle'})
   +label('O のまわり 反時計回り',955,205,{size:28,color:CT,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),label('軸と回る向き → 右ねじ',955,280,{size:26,color:C.dim,anchor:'middle'})+T(bN,880,350,{size:44})+label('手前向き',910,362,{size:28,color:CN,weight:700})+outSym(1070,350,18)),seg(p,0,.12));
  return s;
 },
 [K+'so']:(p)=>{
  let s=card(90,50,1020,420,T(`${bN}=${br}\\times${bF}`,600,150,{size:72})
   +fade(seg(p,.25,.4),label('長さ',260,275,{size:30,color:C.dim})+label('回す角度あたりの 仕事',420,275,{size:32,color:CW,weight:700}))
   +fade(seg(p,.55,.7),label('向き',260,365,{size:30,color:C.dim})+label('回転の軸と 回る向き（右ねじ）',420,365,{size:32,color:CN,weight:700})),seg(p,0,.1),C.hi);
  return s;
 },
 [K+'checkQ']:(p)=>{
  let s=boardScene({bases:['Q'],sel:'Q',rG:1});
  const u=seg(p,.3,.5);
  s+=fade(u,arrow(G.px,G.py+26,G.px-90,G.py+26,{color:CT,w:5,head:14})+label('P の動き',G.px-130,G.py+64,{size:24,color:CT,anchor:'middle'}));
  s+=fade(u,rightMark(G.px,G.py,-1,0,0,-1,18,C.hi));
  s+=card(830,100,340,300,label('Q のまわりに 回すと',1000,160,{size:26,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),label('P は 𝐅 に直角に動く',1000,220,{size:26,color:CT,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('仕事 0',1000,290,{size:30,color:CW,anchor:'middle',weight:700})+label('＝ トルク 0 と一致',1000,345,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'checkO2']:(p)=>{
  let s=boardScene({bases:['O2'],sel:'O2',rG:1,arcG:seg(p,.45,.7),symG:seg(p,.75,.9)});
  const u=seg(p,.1,.35),[bx,by]=BASES.O2;
  s+=turnArc(bx,by,150,Math.PI+.02,Math.PI-.02-.5*u,{color:CT,g:u,w:5});
  s+=fade(u,label('P は 上へ',G.px-120,G.py-100,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=card(830,100,340,300,label('O′ のまわりでは',1000,160,{size:26,color:C.ink,anchor:'middle'})
   +label('P が上へ ＝ 時計回り',1000,220,{size:26,color:CT,anchor:'middle'})
   +fade(seg(p,.4,.55),label('仕事が正 → 時計回り',1000,285,{size:26,color:CW,anchor:'middle',weight:700}))
   +fade(seg(p,.75,.9),label('奥向き と一致',970,350,{size:28,color:C.hi,anchor:'middle',weight:700})+inSym(1110,342,17)),seg(p,0,.12));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(160,70,880,370,label('単位',600,130,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\mathrm{N\\cdot m}`,440,220,{size:52,color:CN})
   +fade(seg(p,.3,.45),T(`=\\mathrm{J}/\\mathrm{rad}`,690,220,{size:52,color:CW}))
   +fade(seg(p,.3,.45),label('仕事 ÷ 角度',690,290,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('トルクは エネルギーではない',600,380,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=bar(p);
  s+=card(700,90,460,330,label('小さく 0.05 rad 回す間に',930,150,{size:26,color:CT,anchor:'middle'})
   +label('力が 0.1 J の仕事',930,205,{size:28,color:CW,anchor:'middle',weight:700})
   +label('トルクの大きさは？',930,285,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',930,345,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quizans']:(p)=>{
  let s=bar(1);
  s+=card(700,90,460,330,label('角度あたりの 仕事',930,150,{size:28,color:CW,anchor:'middle'})
   +T(`${cs(CW,'0.1')}\\div${cs(CT,'0.05')}=2`,930,235,{size:46})
   +fade(seg(p,.45,.6),T(`N=${cs(CN,'2'+NM)}`,930,330,{size:48})),seg(p,0,.12));
  return s;
 },
 // ===== S5 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=boardScene({bases:['O','O2','Q'],title:1});
  s+=outSym(BASES.O[0],BASES.O[1]-44,16)+inSym(BASES.O2[0],BASES.O2[1]-44,16);
  s+=card(820,90,360,330,label('𝐫：基準点 → 作用点',1000,140,{size:26,color:CR,anchor:'middle',weight:700})+resultRows(850,215)
   +fade(seg(p,.5,.65),label('基準点で 変わる',1000,405,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.1));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,50,1040,420,label('まとめ',600,100,{size:26,color:C.dim,anchor:'middle'})
   +label('① 慣性系に固定した点を 先に決め、途中で移さない',140,175,{size:30,color:C.ink})
   +fade(seg(p,.35,.5),label('② 大きさ：回す角度あたりの仕事',140,265,{size:30,color:CW,weight:700})+T(`${cs(CR,'r')}\\,${cs(CF,'F')}\\sin\\theta`,880,258,{size:40}))
   +fade(seg(p,.65,.8),label('③ 向き：右ねじで決まる 軸',140,355,{size:30,color:CN,weight:700})+T(`${bN}=${br}\\times${bF}`,880,348,{size:40})),seg(p,0,.1));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=card(80,60,500,380,label('まっすぐ進む',330,120,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('勢い',180,215,{size:26,color:C.dim})+T(`${bp}=m\\mathbf{v}`,400,210,{size:44})
   +fade(seg(p,.35,.5),label('変えるもの',180,320,{size:26,color:C.dim})+T(bF,420,315,{size:44})+label('力',460,327,{size:26,color:CF})),seg(p,0,.12));
  s+=card(620,60,500,380,label('回転',870,120,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('勢い',720,215,{size:26,color:C.dim})+label('？',950,225,{size:48,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('変えるもの',720,320,{size:26,color:C.dim})+T(`${br}\\times${bF}`,960,315,{size:42})+label('トルク',960,380,{size:24,color:CN,anchor:'middle'})),seg(p,.1,.22));
  return s;
 },
 [K+'next2']:(p)=>{
  const cx=280,cy=270,R=150,a=.3+2.4*seg(p,0,1),bx=cx+R*Math.cos(a),by=cy-R*Math.sin(a);
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 7'})+ring(cx,cy,9,{color:C.ink,w:3,fill:C.bg});
  s+=arrow(cx,cy,bx,by,{color:CR,w:5,head:14});
  const tx=-Math.sin(a),ty=-Math.cos(a);
  s+=arrow(bx,by,bx+tx*110,by+ty*110,{color:CP,w:6})+vl('p',bx+tx*110+10,by+ty*110,{size:28,color:CP});
  s+=ring(bx,by,18,{color:C.ink,w:3,fill:'#2c3854'});
  s+=card(620,110,520,280,label('次の問い',880,165,{size:24,color:C.dim,anchor:'middle'})
   +label('運動量の回転版',880,230,{size:30,color:C.ink,anchor:'middle'})
   +label('回転の勢いは どう定義する？',880,300,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
