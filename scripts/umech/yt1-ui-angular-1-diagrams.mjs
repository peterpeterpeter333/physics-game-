// YouTube シリーズ 角運動量・初級 1/1（ステージ ui-angular 本0〜本2）— 図。Stage 1200×515.
// 色（外積・初級とそろえる）：腕 𝐫・距離 水色、力 𝐅 緑、直角な部分 F sinθ 黄、θ 橙、トルク N 桃、仕事 J 橙、運動量 𝐩 桃（予告の場面だけ）、𝐋 黄。
// ドアは上から見た図。蝶番（軸）は左、ドアは右へ伸びる。画面の上向きの力 → 反時計回り → 𝐍 は手前（⊙）＝天井向き。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,axes,tex,texWidth,poly,cart,spring} from './anim.mjs';

const K='ui-angular-1:';
const CR=C.x,CF=C.F,CQ=C.hi,CT=C.E,CN=C.p,CW=C.E,CP='#8fb8ff';
const RAD=Math.PI/180;
const vl=(s,x,y,{size=30,color=C.ink,anchor='start'}={})=>tex(`\\mathbf{${s}}`,x,y,{size:size+6,color,anchor,auto:false});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const NM=`\\,\\mathrm{N\\cdot m}`;

// ---- ⊙ / ⊗ （外積・初級 2/2 と同じ形） ---------------------------------------------------------
function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
// arc with arrowhead; first half c1, second half c2 (𝐫 → 𝐅 の順)
function arc2(pts,{c1=CR,c2=CF,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
function turnArc(cx,cy,r,a0,a1,{color=CN,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),L=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}

// ---- door seen from above ------------------------------------------------------------------------
// D0: hinge (hx,hy), ppm = px per metre, width 0.8 m. turn = opening angle (rad, CCW on screen).
const D0={hx:110,hy:330,ppm:600,W:.8};
const P=(d,turn=0,o=D0)=>[o.hx+d*o.ppm*Math.cos(turn),o.hy-d*o.ppm*Math.sin(turn)];
function door(turn=0,{o=D0,g=1,ghost=0,hingeLabel=1,view=1,handle=0}={}){
 let s='';
 if(view)s+=label('上から見た図',40,50,{size:24,color:C.dim});
 s+=line(20,o.hy,o.hx-14,o.hy,{color:C.dim,w:5});for(let x=28;x<o.hx-14;x+=22)s+=line(x,o.hy+2,x-14,o.hy+18,{color:C.faint,w:2});
 if(ghost>0)s+=fade(ghost,line(o.hx,o.hy,o.hx+o.W*o.ppm,o.hy,{color:'#b99b73',w:12,cap:'butt',dash:'10 8'}));
 const [ex,ey]=P(o.W,turn,o);
 s+=line(o.hx,o.hy,ex,ey,{color:'#b99b73',w:16,cap:'butt'});
 if(handle){const [qx,qy]=P(o.W-.05,turn,o);s+=dot(qx,qy,9,C.ink);}
 s+=ring(o.hx,o.hy,12,{color:C.ink,w:3,fill:C.bg});
 if(hingeLabel)s+=label('蝶番（軸）',o.hx-4,o.hy+44,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// perpendicular push at distance d (arrow starts at the point). F in newtons, k px per N. sign +1 = 画面上（開く向き）.
function push(d,F,{turn=0,o=D0,k=24,sign=1,color=CF,g=1,text='',w=6}={}){
 const [x,y]=P(d,turn,o),ux=-Math.sin(turn)*sign,uy=-Math.cos(turn)*sign;
 return fade(g,dot(x,y,8,C.ink)+arrow(x,y,x+ux*F*k,y+uy*F*k,{color,w})+(text?label(text,x+ux*F*k+12,y+uy*F*k+(sign>0?8:18),{size:26,color,weight:700}):''));
}
function rBar(d,{o=D0,g=1,text='',y=null,turn=0}={}){
 const yy=y??o.hy+84;
 return fade(g,arrow(o.hx,yy,o.hx+d*o.ppm,yy,{color:CR,w:4,head:12})+line(o.hx,yy-10,o.hx,yy+10,{color:CR,w:3})+(text?label(text,o.hx+d*o.ppm/2,yy+34,{size:24,color:CR,anchor:'middle',weight:700}):''));
}

// ---- S1 ------------------------------------------------------------------------------------------
function rod(cx,cy,ang,{L=220,g=1}={}){
 const dx=L/2*Math.cos(ang),dy=L/2*Math.sin(ang);
 return fade(g,line(cx-dx,cy+dy,cx+dx,cy-dy,{color:'#b99b73',w:16}));
}
function spinScene(p){
 let s=label('上から見た図（氷の上の棒）',40,50,{size:24,color:C.dim});
 // top: push at the centre → slides only
 const u=seg(p,.2,.9);
 const x1=260+260*u;
 s+=fade(.25,rod(260,160,Math.PI/2,{L:180}))+rod(x1,160,Math.PI/2,{L:180});
 s+=arrow(x1-120,160,x1-14,160,{color:CF,w:6,g:1-seg(p,.35,.5)});
 s+=label('真ん中を押す',60,110,{size:26,color:C.ink})+fade(seg(p,.55,.7),label('進むだけ',620,170,{size:28,color:C.hi,weight:700}));
 // bottom: push at the end → slides and turns
 const x2=260+200*u,ang=Math.PI/2-1.3*u,yE=380;
 s+=fade(.25,rod(260,yE,Math.PI/2,{L:180}))+rod(x2,yE,ang,{L:180});
 s+=arrow(260-120,yE-80,260-14,yE-80,{color:CF,w:6,g:1-seg(p,.35,.5)});
 s+=label('端を押す',60,300,{size:26,color:C.ink})+fade(seg(p,.55,.7),label('進みながら 回る',620,390,{size:28,color:C.hi,weight:700}));
 s+=turnArc(x2,yE,70,-2.2,-2.2-1.6*u,{g:seg(p,.4,.55),color:CN});
 return s;
}

// ---- S2 graph N vs r ---------------------------------------------------------------------------
function nGraph({pts=[],line1=0,g=1,x=740,y=450,w=320,h=250,hl=-1}={}){
 const A=axes({x,y,w,h,xmax:.9,ymax:4.6,xticks:[.2,.4,.8],yticks:[1,2,4],grid:true,xlabel:'r [m]',ylabel:'トルク [N·m]',xcolor:CR,ycolor:CN,g});
 let s=A.svg;
 if(line1>0)s+=A.plot(r=>5*r,{from:0,to:.85,p:line1,color:CN,w:3});
 pts.forEach(([r,gg],i)=>{s+=fade(gg,dot(A.X(r),A.Y(5*r),10,i===hl?C.hi:CN));});
 return fade(g,s);
}

// ---- S3 rotation by 0.5 rad -------------------------------------------------------------------
const PHI=.5;
function arcScene(p,{turn=PHI,arcs=1,marks=1,ghost=1,angleLbl=1,tan=0}={}){
 const o=D0;
 let s=door(turn,{ghost});
 if(angleLbl)s+=fade(angleLbl,turnArc(o.hx,o.hy,60,0,turn,{color:C.dim,w:3})+label('同じ角度',o.hx+190,o.hy-28,{size:22,color:C.dim}));
 if(arcs>0){
  s+=draw(circPts(o.hx,o.hy,.8*o.ppm,0,turn,40),arcs,{color:CR,w:7});
  s+=draw(circPts(o.hx,o.hy,.2*o.ppm,0,turn,20),arcs,{color:CR,w:7});
 }
 if(marks){
  const [ax,ay]=P(.8,turn),[bx,by]=P(.2,turn);
  s+=dot(ax,ay,9,C.ink)+dot(bx,by,9,C.ink)+fade(ghost,dot(...P(.8,0),7,C.dim)+dot(...P(.2,0),7,C.dim));
 }
 if(tan>0){ // perpendicular pushes along the arc: always along the motion
  for(const a of [0,.25,.5]){if(a>turn+.01)continue;const [x,y]=P(.8,a),ux=-Math.sin(a),uy=-Math.cos(a);s+=fade(tan,arrow(x,y,x+ux*80,y+uy*80,{color:CF,w:5,head:16}));}
 }
 return s;
}

// ---- S4 oblique push at the end (θ = 30°) -------------------------------------------------------
const O4={hx:120,hy:300,ppm:450,W:.8};
const TH=30*RAD,F4K=36; // 5 N → 180 px
function oblique({g=1,Fg=1,lineG=0,perpG=0,partsG=0,thetaG=1,rG=1,dLabel='r sinθ',paraG=0,paraH=0}={}){
 const o=O4,[px,py]=P(.8,0,o),ux=Math.cos(TH),uy=-Math.sin(TH),L=5*F4K;
 let s=door(0,{o,hingeLabel:0})+label('蝶番（軸）',64,o.hy-22,{size:22,color:C.dim,anchor:'middle'});
 // line of action
 if(lineG>0)s+=fade(lineG,line(px-ux*560,py-uy*560,px+ux*300,py+uy*300,{color:CF,w:2.5,dash:'10 8'})+label('作用線',px-ux*330+20,py-uy*330+36,{size:24,color:CF,weight:700}));
 // parallelogram of r and F (hinge O, point P)
 if(paraG>0){
  s+=fade(paraG,poly([[o.hx,o.hy],[px,py],[px+ux*L,py+uy*L],[o.hx+ux*L,o.hy+uy*L]],{fill:CQ,fo:.26,stroke:C.faint,sw:2}));
  s+=fade(paraG,arrow(o.hx,o.hy,o.hx+ux*L,o.hy+uy*L,{color:CF,w:3,head:12,opacity:.6}));
 }
 // height with r as base: F sinθ (from the tip of F down to the door line)
 if(paraH>0){const tx=px+ux*L,ty=py+uy*L;s+=fade(paraH,line(tx,o.hy,tx,ty,{color:CQ,w:6})+line(tx-14,o.hy,tx-14,o.hy-14,{color:C.dim})+line(tx-14,o.hy-14,tx,o.hy-14,{color:C.dim})+label('F sinθ',tx+12,o.hy-8,{size:26,color:CQ,weight:700}));}
 // perpendicular from the hinge to the line of action
 if(perpG>0){
  const t=-(( (o.hx-px)*ux+(o.hy-py)*uy )); // foot = P - t'u where t' = (P-O)·u
  const fx=px-((px-o.hx)*ux+(py-o.hy)*uy)*ux,fy=py-((px-o.hx)*ux+(py-o.hy)*uy)*uy;
  const nx=(o.hx-fx),ny=(o.hy-fy),nl=Math.hypot(nx,ny),ex=nx/nl,ey=ny/nl,q=14;
  s+=fade(perpG,line(o.hx,o.hy,fx,fy,{color:CR,w:6})+line(fx+ux*q,fy+uy*q,fx+ux*q+ex*q,fy+uy*q+ey*q,{color:C.dim,w:2})+line(fx+ex*q,fy+ey*q,fx+ux*q+ex*q,fy+uy*q+ey*q,{color:C.dim,w:2})+dot(fx,fy,6,CR));
  if(dLabel)s+=fade(perpG,label(dLabel,fx-18,fy-14,{size:26,color:CR,weight:700,anchor:'end'}));
 }
 if(rG>0)s+=fade(rG,arrow(o.hx,o.hy-26,px,py-26,{color:CR,w:4,head:12})+vl('r',(o.hx+px)/2,o.hy-44,{size:28,color:CR,anchor:'middle'}));
 if(partsG>0){const q=L*Math.sin(TH);s+=fade(partsG,arrow(px,py,px,py-q,{color:CQ,w:6})+label('F sinθ',px-12,py-q/2,{size:26,color:CQ,weight:700,anchor:'end'}));}
 s+=fade(Fg,dot(px,py,8,C.ink)+arrow(px,py,px+ux*L,py+uy*L,{color:CF,w:6})+vl('F',px+ux*L+10,py+uy*L-4,{size:28,color:CF}));
 if(thetaG>0){const r=46;s+=fade(thetaG,line(px,py,px+80,py,{color:C.dim,w:2,dash:'5 6'})+draw(circPts(px,py,r,0,TH,20),1,{color:CT,w:3.5})+label('θ',px+r+14,py-8,{size:26,color:CT,weight:700}));}
 return s;
}

// ---- S5 inset: side view with ceiling ---------------------------------------------------------
function sideView(g=1,{nG=1}={}){
 const cx=930,top=90,bot=440;
 let s=label('横から見ると',cx,top-30,{size:24,color:C.dim,anchor:'middle'});
 s+=line(cx-150,top,cx+150,top,{color:C.dim,w:4})+label('天井',cx+160,top+8,{size:22,color:C.dim});
 s+=line(cx-150,bot,cx+150,bot,{color:C.dim,w:4})+label('床',cx+160,bot+8,{size:22,color:C.dim});
 s+=rect(cx-8,top+60,16,bot-top-60,{fill:'#b99b73',fo:.35,stroke:'#b99b73',rx:3})+label('蝶番の軸',cx-20,bot-20,{size:22,color:C.dim,anchor:'end'});
 s+=fade(nG,arrow(cx+40,300,cx+40,150,{color:CN,w:6})+vl('N',cx+56,190,{size:28,color:CN}));
 s+=`<ellipse cx="${cx-90}" cy="${top+34}" rx="20" ry="12" fill="#1b2338" stroke="${C.hi}" stroke-width="3"/>`+dot(cx-90,top+40,5,C.hi)+label('見る人（上）',cx-120,top+40,{size:20,color:C.hi,anchor:'end'});
 return fade(g,s);
}

export const ytUiAngular1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  let s=cart(250,360,{w:150,h:70,color:C.x});
  s+=arrow(330,310,330+150*seg(p,.1,.3),310,{color:CN,w:7})+fade(seg(p,.1,.3),vl('p',490,300,{size:30,color:CN}));
  s+=line(80,362,560,362,{color:C.dim,w:3});
  s+=card(660,90,480,300,label('前回：運動量',900,145,{size:28,color:C.dim,anchor:'middle'})
   +T(`{\\color{${CN}}\\mathbf{p}}=m\\mathbf{v}`,900,220,{size:52})
   +fade(seg(p,.5,.65),label('力積 FΔt の分だけ 𝐩 が変わる',900,300,{size:26,color:C.ink,anchor:'middle'})+T(`F\\,\\Delta t=\\Delta p`,900,355,{size:36,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'spin']:(p)=>spinScene(p),
 [K+'ask']:(p)=>{
  let s=door(0)+push(.8,5,{g:seg(p,.05,.25)})+fade(seg(p,.1,.3),push(.15,5,{color:CF}));
  s+=card(700,120,450,240,label('ドアを 回しやすく するのは',925,190,{size:28,color:C.ink,anchor:'middle'})
   +label('力の大きさ だけ？',925,260,{size:36,color:C.hi,anchor:'middle',weight:700})
   +label('（同じ 5 N でも？）',925,320,{size:24,color:C.dim,anchor:'middle'}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'door']:(p)=>{
  let s=door(0);
  s+=fade(seg(p,.4,.6),rBar(.8,{text:'幅 0.8 m',y:D0.hy+100}));
  s+=fade(seg(p,.15,.35),ring(D0.hx,D0.hy,24,{color:C.hi,w:3}));
  s+=card(720,140,420,200,label('蝶番 ＝ 回転の軸',930,210,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('ドアの幅 0.8 m',930,280,{size:28,color:CR,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'recall']:(p)=>{
  let s=door(0)+push(.8,5)+rBar(.8,{text:'r'});
  s+=card(680,80,480,340,label('外積・初級で決めた',920,135,{size:26,color:C.dim,anchor:'middle'})
   +label('トルク（回す効き目）',920,190,{size:28,color:CN,anchor:'middle',weight:700})
   +T(`{\\color{${CN}}N}={\\color{${CR}}r}\\,{\\color{${CF}}F}\\sin{\\color{${CT}}\\theta}`,920,265,{size:52})
   +fade(seg(p,.55,.7),label('r：軸から 押す点までの長さ',920,345,{size:26,color:CR,anchor:'middle'})+label('[N·m]',920,392,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S2 押す位置を動かす =====
 [K+'fix']:(p)=>{
  let s=door(0)+push(.4,5,{text:'5 N'});
  s+=card(700,90,450,320,
   label('固定',760,160,{size:30,color:CF,weight:700})+label('力 5 N・ドアに直角',840,160,{size:28,color:C.ink})
   +fade(seg(p,.45,.6),label('変える',760,250,{size:30,color:CR,weight:700})+label('押す位置 だけ',870,250,{size:28,color:C.ink})),seg(p,.05,.2));
  s+=fade(seg(p,.5,.65),arrow(D0.hx+.25*D0.ppm,D0.hy+60,D0.hx+.6*D0.ppm,D0.hy+60,{color:CR,w:4,head:14})+arrow(D0.hx+.55*D0.ppm,D0.hy+60,D0.hx+.2*D0.ppm,D0.hy+60,{color:CR,w:4,head:14}));
  return s;
 },
 [K+'predict']:(p)=>{
  const d=mix(.1,.8,(1-Math.cos(2*Math.PI*seg(p,.1,.95)))/2);
  let s=door(0)+push(d,5,{text:'5 N'})+rBar(d,{text:`r ＝ ${fmt(d,1)} m`});
  s+=card(720,120,430,240,label('押す位置を 端へ動かすと',935,185,{size:28,color:C.ink,anchor:'middle'})+label('トルクは どう変わる？',935,255,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',935,315,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'slide']:(p)=>{
  // 0.2 → 0.4 → 0.8 m with stops
  const d=p<.3?.2:p<.4?mix(.2,.4,seg(p,.3,.4)):p<.6?.4:p<.72?mix(.4,.8,seg(p,.6,.72)):.8;
  const shown=[[.2,seg(p,.12,.2)],[.4,seg(p,.42,.5)],[.8,seg(p,.74,.82)]];
  const O2={...D0,ppm:560,hx:90,hy:250};
  let s=door(0,{o:O2})+push(d,5,{o:O2,text:'5 N',k:20})+rBar(d,{o:O2,text:`r ＝ ${fmt(d,1)} m`});
  s+=label('sin90° ＝ 1',60,470,{size:28,color:CQ});
  s+=label(`N ＝ ${fmt(d,1)} × 5 ＝ ${fmt(5*d,1)} N·m`,300,470,{size:30,color:CN,weight:700});
  s+=nGraph({pts:shown,hl:d===.2?0:d===.4?1:d===.8?2:-1});
  return s;
 },
 [K+'prop']:(p)=>{
  let s=nGraph({pts:[[.2,1],[.4,1],[.8,1]],line1:seg(p,.45,.7),x:120,w:460,h:300,y:450});
  const A=axes({x:120,y:450,w:460,h:300,xmax:.9,ymax:4.6});
  s+=fade(seg(p,.1,.3),arrow(A.X(.2)+12,A.Y(1)-6,A.X(.4)-12,A.Y(2)+6,{color:C.hi,w:3,head:12})+label('×2',A.X(.3)-44,A.Y(1.5)-6,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.2,.4),arrow(A.X(.4)+12,A.Y(2)-4,A.X(.8)-12,A.Y(4)+4,{color:C.hi,w:3,head:12})+label('×2',A.X(.6)-50,A.Y(3)-6,{size:26,color:C.hi,weight:700}));
  s+=card(700,110,450,300,label('距離 2倍 → トルク 2倍',925,175,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),T(`{\\color{${CN}}N}=5\\times{\\color{${CR}}r}`,925,260,{size:46}))
   +fade(seg(p,.6,.75),label('力が同じなら 距離に比例',925,340,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'inv']:(p)=>{
  let s=door(0)+push(.8,2.5,{k:24,text:'? N',g:seg(p,.1,.3)})+rBar(.8,{text:'0.8 m'});
  s+=card(700,110,450,270,label('同じ 2 N·m を',925,175,{size:30,color:CN,anchor:'middle',weight:700})+label('端の 0.8 m で 出すには',925,235,{size:28,color:C.ink,anchor:'middle'})+label('何 N？',925,300,{size:34,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',925,350,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'inv2']:(p)=>{
  const k=11;
  let s=door(0)+push(.8,2.5,{k,text:'2.5 N'})+fade(seg(p,.5,.65),push(.1,20,{k,text:'20 N'}));
  s+=fade(seg(p,.5,.65),rBar(.1,{text:'0.1 m',y:D0.hy+84}))+rBar(.8,{text:'0.8 m',y:D0.hy+150});
  s+=card(700,70,460,400,T(`0.8\\times{\\color{${CF}}F}=2`,930,140,{size:42})
   +fade(seg(p,.15,.3),T(`{\\color{${CF}}F}=2.5\\,\\mathrm{N}`,930,215,{size:44,color:CF}))
   +fade(seg(p,.5,.65),label('蝶番から 0.1 m なら',930,300,{size:26,color:C.dim,anchor:'middle'})+T(`0.1\\times{\\color{${CF}}F}=2`,930,355,{size:38})+T(`{\\color{${CF}}F}=20\\,\\mathrm{N}`,930,425,{size:42,color:CF})),seg(p,0,.15));
  return s;
 },
 [K+'inv3']:(p)=>{
  const k=11;
  let s=door(0,{handle:1})+push(.8,2.5,{k,text:'2.5 N'})+push(.1,20,{k,text:'20 N'});
  s+=card(700,120,450,260,label('どちらも 2 N·m',925,185,{size:30,color:CN,anchor:'middle',weight:700})
   +fade(seg(p,.25,.45),label('端を押すと 軽い',925,260,{size:34,color:C.hi,anchor:'middle',weight:700})+label('同じトルクを 小さな力で',925,320,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 // ===== S3 遠い点は長く動く =====
 [K+'why']:(p)=>{
  const turn=PHI*seg(p,.35,.8);
  let s=arcScene(p,{turn,arcs:0,angleLbl:0,ghost:seg(p,.3,.4)});
  s+=card(760,120,400,220,label('なぜ 遠い点ほど',960,190,{size:30,color:C.ink,anchor:'middle'})+label('効く？',960,255,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'same']:(p)=>{
  const turn=PHI*seg(p,.05,.5);
  let s=arcScene(p,{turn,arcs:0,angleLbl:seg(p,.4,.6)});
  s+=card(760,140,400,180,label('どの点も',960,205,{size:28,color:C.ink,anchor:'middle'})+label('同じ角度だけ 回る',960,265,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6));
  return s;
 },
 [K+'arc']:(p)=>{
  let s=arcScene(p,{arcs:seg(p,.05,.35)});
  s+=card(740,90,420,330,label('近似・初級',950,150,{size:24,color:C.dim,anchor:'middle'})
   +label('弧の長さ ＝',950,215,{size:30,color:CR,anchor:'middle'})
   +label('半径 × 角度',950,275,{size:34,color:CR,anchor:'middle',weight:700})+label('（角度は ラジアン）',950,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  return s;
 },
 [K+'arcnum']:(p)=>{
  const o=D0;let s=arcScene(p,{angleLbl:0});
  const [mx,my]=P(.8,PHI/2),[nx,ny]=P(.2,PHI/2);
  s+=fade(seg(p,.2,.35),label('0.4 m',mx+14,my-6,{size:26,color:CR,weight:700}));
  s+=fade(seg(p,.45,.6),label('0.1 m',nx+12,ny-8,{size:24,color:CR,weight:700}));
  s+=card(760,70,400,360,label('回した角 0.5 rad',960,125,{size:28,color:C.dim,anchor:'middle'})
   +fade(seg(p,.15,.3),T(`0.8\\times0.5={\\color{${CR}}0.4\\,\\mathrm{m}}`,960,200,{size:38}))
   +fade(seg(p,.4,.55),T(`0.2\\times0.5={\\color{${CR}}0.1\\,\\mathrm{m}}`,960,275,{size:38}))
   +fade(seg(p,.7,.85),label('距離は 4倍',960,365,{size:34,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'work']:(p)=>{
  const turn=PHI*seg(p,.1,.6);
  let s=arcScene(p,{turn,arcs:1,angleLbl:0,tan:1});
  s+=card(760,110,400,280,label('直角に押す力は',960,170,{size:28,color:C.ink,anchor:'middle'})+label('動く向きと そろう',960,225,{size:30,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('仕事 ＝ 力 × 動いた距離',960,320,{size:28,color:CW,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'work2']:(p)=>{
  let s=arcScene(p,{angleLbl:0});
  const [mx,my]=P(.8,PHI/2),[nx,ny]=P(.2,PHI/2);
  s+=label('0.4 m',mx+14,my-6,{size:26,color:CR,weight:700})+label('0.1 m',nx+12,ny-8,{size:24,color:CR,weight:700});
  s+=card(720,80,440,350,label('同じ 5 N で',940,135,{size:28,color:CF,anchor:'middle'})
   +label('端',760,215,{size:28,color:C.ink})+T(`5\\times0.4={\\color{${CW}}2\\,\\mathrm{J}}`,990,210,{size:40})
   +fade(seg(p,.45,.6),label('0.2 m',760,305,{size:26,color:C.ink})+T(`5\\times0.1={\\color{${CW}}0.5\\,\\mathrm{J}}`,990,300,{size:40}))
   +fade(seg(p,.7,.85),label('4倍の 仕事',940,390,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'perrad']:(p)=>{
  let s=card(60,80,520,340,label('端（0.8 m）',320,140,{size:28,color:C.ink,anchor:'middle'})
   +T(`{\\color{${CW}}2\\,\\mathrm{J}}\\div0.5=4`,320,225,{size:48})
   +fade(seg(p,.4,.55),label('トルク 4 N·m と 同じ数',320,310,{size:28,color:CN,anchor:'middle',weight:700})),seg(p,0,.15));
  s+=card(620,80,520,340,label('0.2 m の所',880,140,{size:28,color:C.ink,anchor:'middle'})
   +T(`{\\color{${CW}}0.5\\,\\mathrm{J}}\\div0.5=1`,880,225,{size:48})
   +label('トルク 1 N·m と 同じ数',880,310,{size:28,color:CN,anchor:'middle',weight:700}),seg(p,.55,.7));
  s+=fade(seg(p,.2,.35),label('仕事 ÷ 回した角（rad）',600,470,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'perrad2']:(p)=>{
  let s=arcScene(p,{angleLbl:1});
  s+=card(720,90,440,340,label('トルク ＝',940,155,{size:28,color:CN,anchor:'middle'})+label('回す角度あたりの 仕事',940,210,{size:30,color:CN,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('遠い点は 長く動く',940,290,{size:28,color:CR,anchor:'middle'})+label('→ 同じ力で 多くの仕事',940,345,{size:28,color:CW,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S4 腕の長さ ＝ 垂直な距離 =====
 [K+'oblique']:(p)=>{
  let s=oblique({Fg:seg(p,.05,.25),thetaG:seg(p,.2,.35),partsG:seg(p,.5,.7)});
  s+=card(720,100,440,280,label('端を 斜めに押す',940,160,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('外積・初級：効くのは',940,235,{size:26,color:C.dim,anchor:'middle'})+label('直角な部分 F sinθ',940,290,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'lineact']:(p)=>{
  let s=oblique({lineG:seg(p,.4,.65)});
  s+=card(740,110,420,240,label('力の矢印を',950,175,{size:28,color:C.ink,anchor:'middle'})+label('前後に 伸ばした線',950,230,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.6,.75),label('＝ 作用線',950,300,{size:34,color:CF,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=oblique({lineG:1,perpG:seg(p,.1,.35),dLabel:p>.5?'r sinθ':''});
  s+=card(740,100,420,280,label('軸から 作用線へ 垂線',950,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.5,.65),label('垂直な距離',950,240,{size:30,color:CR,anchor:'middle',weight:700})+T(`={\\color{${CR}}r\\sin\\theta}`,950,315,{size:44})),seg(p,0,.15));
  return s;
 },
 [K+'twoways']:(p)=>{
  let s=oblique({lineG:1,perpG:1,partsG:seg(p,.4,.55)});
  s+=card(720,80,440,360,label('トルク',940,135,{size:28,color:CN,anchor:'middle',weight:700})
   +T(`{\\color{${CN}}N}={\\color{${CF}}F}\\times({\\color{${CR}}r\\sin\\theta})`,940,215,{size:40})
   +fade(seg(p,.4,.55),T(`={\\color{${CR}}r}\\times({\\color{${CQ}}F\\sin\\theta})`,960,300,{size:40}))
   +fade(seg(p,.65,.8),label('順番を変えただけ：同じ値',940,390,{size:26,color:C.hi,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'para']:(p)=>{
  let s=oblique({paraG:seg(p,.3,.55),thetaG:0});
  s+=card(740,100,420,280,label('外積・初級',950,160,{size:24,color:C.dim,anchor:'middle'})
   +label('𝐫 と 𝐅 の 平行四辺形',950,220,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('面積 ＝ トルクの大きさ',950,300,{size:30,color:CQ,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'para2']:(p)=>{
  const a=seg(p,.05,.25),b=seg(p,.45,.65);
  let s=oblique({paraG:1,thetaG:0,paraH:a,lineG:b,perpG:b,dLabel:'r sinθ'});
  s+=card(740,80,420,360,
   label('底辺 r',800,145,{size:28,color:CR})+label('高さ',990,145,{size:26,color:C.dim})+label('F sinθ',1070,145,{size:28,color:CQ,weight:700})
   +fade(b,label('底辺 F',800,235,{size:28,color:CF})+label('高さ',990,235,{size:26,color:C.dim})+label('r sinθ',1070,235,{size:28,color:CR,weight:700}))
   +fade(seg(p,.75,.9),label('同じ面積を 二通りに',950,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=oblique({lineG:1,perpG:seg(p,.3,.5),dLabel:p>.55?'0.4 m':''});
  s+=fade(seg(p,.1,.25),label('0.8 m',(O4.hx+P(.8,0,O4)[0])/2+60,O4.hy-40,{size:24,color:CR})+label('5 N',P(.8,0,O4)[0]+50,O4.hy-66,{size:26,color:CF,weight:700,anchor:'end'})+label('30°',P(.8,0,O4)[0]+62,O4.hy+30,{size:24,color:CT,weight:700}));
  s+=card(740,100,420,300,label('作用線までの 距離',950,160,{size:28,color:CR,anchor:'middle'})
   +fade(seg(p,.35,.5),T(`0.8\\times\\sin30^\\circ`,950,235,{size:40}))
   +fade(seg(p,.55,.7),T(`={\\color{${CR}}0.4\\,\\mathrm{m}}`,950,320,{size:46})),seg(p,0,.15));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=oblique({lineG:1,perpG:1,dLabel:'0.4 m'});
  s+=card(740,90,420,330,label('トルク',950,150,{size:28,color:CN,anchor:'middle',weight:700})
   +T(`{\\color{${CN}}N}=5\\times0.4`,950,225,{size:42})+fade(seg(p,.2,.35),T(`={\\color{${CN}}2${NM}}`,960,300,{size:46}))
   +fade(seg(p,.55,.7),label('直角の 4 N·m の 半分',950,385,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'zero']:(p)=>{
  const o=O4,[px,py]=P(.8,0,o),Fn=mix(3,7,seg(p,.5,.9)),L=Fn*F4K;
  let s=door(0,{o});
  s+=fade(seg(p,.05,.2),line(o.hx-60,o.hy,px+60,o.hy,{color:CF,w:2.5,dash:'10 8'})+label('作用線',px-80,o.hy+40,{size:24,color:CF,weight:700}));
  s+=dot(px,py,8,C.ink)+arrow(px,py,px-L,py,{color:CF,w:7})+ring(o.hx,o.hy,22,{color:C.hi,w:3});
  s+=card(740,90,420,330,label('軸へ向けて 押す',950,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.15,.3),label('作用線が 軸を通る',950,210,{size:28,color:CF,anchor:'middle'}))
   +fade(seg(p,.3,.45),label('距離 ＝ 0 → N ＝ 0',950,280,{size:32,color:CN,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('強く押しても 回らない',950,360,{size:28,color:C.a,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S5 トルクの向き =====
 [K+'vec']:(p)=>{
  let s=door(0)+push(.8,5,{g:1});
  const [px,py]=P(.8);
  s+=fade(seg(p,.45,.6),arrow(D0.hx,D0.hy-30,px,py-30,{color:CR,w:5,head:14})+vl('r',(D0.hx+px)/2,D0.hy-50,{size:30,color:CR,anchor:'middle'}));
  s+=vl('F',px+16,py-100,{size:30,color:CF});
  s+=card(720,120,440,250,label('トルクは 向きも持つ',940,180,{size:28,color:C.ink,anchor:'middle'})
   +T(`{\\color{${CN}}\\mathbf{N}}={\\color{${CR}}\\mathbf{r}}\\times{\\color{${CF}}\\mathbf{F}}`,940,270,{size:52})
   +fade(seg(p,.5,.65),label('𝐫：軸 → 押す点',940,340,{size:26,color:CR,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'screw']:(p)=>{
  let s=door(0)+push(.8,5);
  const [px,py]=P(.8);
  s+=arrow(D0.hx,D0.hy-30,px,py-30,{color:CR,w:5,head:14})+vl('r',(D0.hx+px)/2,D0.hy-50,{size:30,color:CR,anchor:'middle'})+vl('F',px+16,py-100,{size:30,color:CF});
  s+=arc2(circPts(D0.hx,D0.hy,110,0,Math.PI/2*seg(p,.1,.4),30),{g:seg(p,.1,.15)});
  s+=outSym(D0.hx,D0.hy,24,CN,seg(p,.6,.75));
  s+=card(720,90,440,340,label('𝐫 右 → 𝐅 上：反時計回り',940,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.45,.6),label('右ねじは ゆるんで 手前へ',940,220,{size:28,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),T(`{\\color{${CN}}\\mathbf{N}}`,860,310,{size:46})+label('：手前向き',890,322,{size:30,color:CN,weight:700})+outSym(940,385,24)),seg(p,0,.15));
  return s;
 },
 [K+'ceiling']:(p)=>{
  const o={...D0,ppm:520,hx:110,hy:330},turn=35*RAD*seg(p,.5,.9);
  let s=door(turn,{o,ghost:seg(p,.45,.55)})+outSym(o.hx,o.hy,24,CN);
  s+=turnArc(o.hx,o.hy,120,.05,.05+turn*1.6,{color:CN,g:seg(p,.5,.6)});
  s+=sideView(seg(p,.05,.25));
  s+=fade(seg(p,.3,.45),label('手前 ＝ 天井の向き',930,490,{size:28,color:CN,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=door(0)+push(.4,5,{sign:-1,text:'5 N',g:seg(p,.1,.3)})+rBar(.4,{text:'0.4 m',y:D0.hy-80});
  s+=label('反対側から 押し返す',D0.hx+.4*D0.ppm+30,D0.hy+60,{size:24,color:C.dim});
  s+=card(720,120,440,250,label('トルクの 向きは',940,190,{size:30,color:C.ink,anchor:'middle'})+label('手前（⊙）？ 奥（⊗）？',940,260,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',940,320,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=door(0)+push(.4,5,{sign:-1});
  const [px,py]=P(.4);
  s+=arrow(D0.hx,D0.hy-30,px,py-30,{color:CR,w:5,head:14})+vl('r',(D0.hx+px)/2,D0.hy-50,{size:30,color:CR,anchor:'middle'})+vl('F',px+16,py+110,{size:30,color:CF});
  s+=arc2(circPts(D0.hx,D0.hy,110,0,-Math.PI/2*seg(p,.05,.3),30),{g:seg(p,.05,.1)});
  s+=inSym(D0.hx,D0.hy,24,CN,seg(p,.3,.45));
  s+=card(720,90,440,340,label('𝐫 右 → 𝐅 下：時計回り',940,150,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`{\\color{${CN}}\\mathbf{N}}`,870,235,{size:44})+label('：奥向き',900,247,{size:30,color:CN,weight:700})+inSym(1080,237,22))
   +fade(seg(p,.55,.7),T(`0.4\\times5={\\color{${CN}}2${NM}}`,940,340,{size:42})),seg(p,0,.15));
  return s;
 },
 [K+'net']:(p)=>{
  const turn=12*RAD*seg(p,.6,.95);
  let s=door(turn,{ghost:seg(p,.55,.65)})+push(.8,5,{turn,text:'5 N'})+push(.4,5,{turn,sign:-1,text:'5 N'});
  s+=turnArc(D0.hx,D0.hy,90,.05,.05+turn*3,{color:CN,g:seg(p,.6,.7)});
  s+=card(720,70,440,380,
   outSym(790,140,20)+label('端：0.8 × 5 ＝ 4 N·m',825,150,{size:28,color:C.ink})
   +inSym(790,215,20)+label('0.4 × 5 ＝ 2 N·m',825,225,{size:28,color:C.ink})
   +fade(seg(p,.15,.3),line(770,265,1130,265,{color:C.faint,w:2})+label('逆向き → 引き算',940,310,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.3,.45),T(`4-2={\\color{${CN}}2${NM}}`,900,380,{size:42})+outSym(1080,378,20))
   +fade(seg(p,.6,.75),label('開く向きに 回り始める',940,432,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S6 まとめと角運動量 =====
 [K+'sum']:(p)=>{
  let s=card(60,40,1080,430,label('まとめ',600,95,{size:28,color:C.dim,anchor:'middle'})
   +T(`{\\color{${CN}}N}={\\color{${CF}}F}\\times`,300,175,{size:44,anchor:'end'})+label('軸から作用線までの 垂直な距離',315,182,{size:32,color:CR,weight:700})
   +fade(seg(p,.35,.5),label('距離 2倍 → トルク 2倍',330,275,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.35,.5),label('（力が同じなら 比例）',330,325,{size:24,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.65,.8),label('軸へ向けて押す → 0',870,275,{size:30,color:C.a,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('（作用線が 軸を通る）',870,325,{size:24,color:C.dim,anchor:'middle'}))
   +label('向き：𝐍 ＝ 𝐫 × 𝐅（右ねじ）',600,410,{size:28,color:CN,anchor:'middle'}),seg(p,0,.12));
  return s;
 },
 [K+'sum2']:(p)=>{
  const turn=25*RAD*seg(p,.2,.7);
  let s=door(turn,{handle:1,ghost:seg(p,.15,.25)})+push(.75,3,{turn})+turnArc(D0.hx,D0.hy,90,.05,.05+turn*2.5,{color:CN,g:seg(p,.2,.3)});
  s+=card(720,110,440,280,label('端を 直角に押す',940,175,{size:30,color:C.ink,anchor:'middle'})+label('小さな力で 回せる',940,240,{size:32,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('取っ手は 端に付いている',940,320,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'L']:(p)=>{
  const ox=150,oy=380,u=120;
  let s=label('予告',40,50,{size:24,color:C.dim});
  s+=dot(ox,oy,8,C.ink)+label('基準の点',ox-10,oy+44,{size:22,color:C.dim,anchor:'middle'});
  s+=arrow(ox,oy,ox+2*u,oy,{color:CR,w:6})+vl('r',ox+u,oy+40,{size:30,color:CR,anchor:'middle'});
  s+=ring(ox+2*u,oy,22,{color:C.ink,w:3,fill:'#2c3854'})+label('m',ox+2*u,oy+8,{size:22,color:C.ink,anchor:'middle'});
  s+=arrow(ox+2*u,oy-24,ox+2*u,oy-24-3*50,{color:CN,w:6,g:seg(p,.2,.4)})+fade(seg(p,.2,.4),vl('p',ox+2*u+16,oy-150,{size:30,color:CN}));
  s+=fade(seg(p,.6,.75),outSym(ox,oy,24,CQ)+vl('L',ox-60,oy-20,{size:30,color:CQ}));
  s+=card(640,90,500,330,label('角運動量（回転の勢い）',890,150,{size:28,color:CQ,anchor:'middle',weight:700})
   +T(`{\\color{${CQ}}\\mathbf{L}}={\\color{${CR}}\\mathbf{r}}\\times{\\color{${CN}}\\mathbf{p}}`,890,240,{size:54})
   +fade(seg(p,.4,.55),label('トルク：𝐍 ＝ 𝐫 × 𝐅',890,320,{size:26,color:C.dim,anchor:'middle'})+label('（力の代わりに 運動量）',890,365,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'L2']:(p)=>{
  const ox=150,oy=380,u=120;
  let s=dot(ox,oy,8,C.ink);
  s+=arrow(ox,oy,ox+2*u,oy,{color:CR,w:6})+label('2 m',ox+u,oy+44,{size:26,color:CR,anchor:'middle',weight:700});
  s+=ring(ox+2*u,oy,22,{color:C.ink,w:3,fill:'#2c3854'})+label('m',ox+2*u,oy+8,{size:22,color:C.ink,anchor:'middle'});
  s+=arrow(ox+2*u,oy-24,ox+2*u,oy-24-3*50,{color:CN,w:6})+label('3 kg·m/s',ox+2*u+16,oy-120,{size:26,color:CN,weight:700});
  s+=line(ox+2*u-16,oy-24,ox+2*u-16,oy-40,{color:C.dim})+line(ox+2*u-16,oy-40,ox+2*u,oy-40,{color:C.dim});
  s+=outSym(ox,oy,24,CQ)+vl('L',ox-60,oy-20,{size:30,color:CQ});
  s+=card(600,70,540,390,label('直角なら',870,125,{size:26,color:C.dim,anchor:'middle'})
   +T(`{\\color{${CQ}}L}=2\\times3=6\\,\\mathrm{kg\\cdot m^2/s}`,870,200,{size:40})
   +fade(seg(p,.25,.4),label('単位：m × kg·m/s',870,275,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.6,.75),label('トルクが 𝐋 を変える様子',870,355,{size:28,color:C.ink,anchor:'middle'})+label('→ 中級で',870,405,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'next']:(p)=>{
  // pendulum
  const px=220,py=90,Lp=240,a=.45*Math.cos(2*Math.PI*p*1.2),bx=px+Lp*Math.sin(a),by=py+Lp*Math.cos(a);
  let s=line(px-70,py,px+70,py,{color:C.dim,w:4})+line(px,py,bx,by,{color:C.dim,w:3})+ring(bx,by,22,{color:C.ink,w:3,fill:'#2c3854'});
  s+=draw(circPts(px,py,Lp,-Math.PI/2-.45,-Math.PI/2+.45,30),1,{color:C.faint,w:2,dash:'5 6'});
  // spring
  const xs=470+60*Math.sin(2*Math.PI*p*1.2);
  s+=line(360,440,640,440,{color:C.dim,w:3})+line(360,360,360,440,{color:C.dim,w:4})+spring(360,xs,405,{coils:8,amp:14})+rect(xs,375,70,60,{fill:C.x,fo:.3,rx:8});
  s+=card(700,110,450,280,label('次の問い',925,165,{size:26,color:C.dim,anchor:'middle'})+label('振り子や ばねは',925,230,{size:30,color:C.ink,anchor:'middle'})
   +label('なぜ 行ったり来たり？',925,290,{size:30,color:C.hi,anchor:'middle',weight:700})+label('同じリズムで 揺れる？',925,345,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
};
