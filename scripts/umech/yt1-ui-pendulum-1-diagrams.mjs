// YouTube シリーズ 単振動・初級 1/1（ステージ ui-pendulum 本0〜本2）— 図。Stage 1200×515.
// 色：ずれ・位置 x・長さ L 水色、速度 v 紫、力 F 緑、時間 t・周期 T 金、ω 桃、位置エネルギー U 橙、運動エネルギー K 紫、合計・強調 黄。
// ばねの図は 振動の方程式・初級 1/2 と同じ（rig）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,axes,tex,texWidth,wall,ground,block,spring} from './anim.mjs';

const K='ui-pendulum-1:';
const CU=C.E,CK=C.v,CW=C.p,CT=C.t,CR='#4f9f80';
const TT=`{\\color{${CT}}T}`,LL=`{\\color{${C.x}}L}`,WW=`{\\color{${CW}}\\omega}`;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:C.F,weight:700}));
const ng=(x,y,g=1)=>fade(g,label('✗',x,y,{size:34,color:C.a,weight:700}));

// ---- spring + block (same as 振動の方程式・初級) ----------------------------------------
function rig(d,{ox=600,y=400,sc=1500,wx=180,x0lab=1,xArr=0,fArr=0,vArr=0,v=0,fk=1,g=1,bw=110,bh=90,mtext='m',x1=1150}={}){
 const bx=ox+d*sc;
 let s=ground(wx-10,x1,y)+wall(wx,y-170,y);
 s+=spring(wx,bx-bw/2,y-bh/2,{coils:10,amp:16,color:C.dim,w:3});
 s+=block(bx,y,bw,bh,{color:C.x,text:mtext,size:30,fo:.22});
 if(x0lab)s+=line(ox,y-bh-70,ox,y+14,{color:C.dim,w:2,dash:'7 7'})+label('x ＝ 0',ox,y+46,{size:24,color:C.dim,anchor:'middle'});
 const ya=y-bh-66;
 if(xArr&&Math.abs(d)>.004)s+=fade(xArr,arrow(ox,ya,bx,ya,{color:C.x,w:5,head:16})+label('x',(ox+bx)/2,ya-14,{size:28,color:C.x,anchor:'middle',weight:700}));
 const L=-d*sc*fk;
 if(fArr&&Math.abs(d)>.004)s+=fade(fArr,arrow(bx,y-bh-20,bx+L,y-bh-20,{color:C.F,w:6,head:18})+label('F',bx+L+(L<0?-14:14),y-bh-10,{size:28,color:C.F,anchor:L<0?'end':'start',weight:700}));
 if(vArr&&Math.abs(v)>.02)s+=fade(vArr,arrow(bx,y+30,bx+v*sc*.5,y+30,{color:C.v,w:5,head:16})+label('v',bx+v*sc*.5+(v<0?-12:12),y+38,{size:26,color:C.v,anchor:v<0?'end':'start',weight:700}));
 return fade(g,s);
}

// ---- pendulum. th [rad], right positive. -------------------------------------------------
// opts: path (dashed arc), disp (cyan arc = ずれ), grav, split, tens, tanHi, radHi, v (purple arrow, px), rodMass etc.
function pend(th,{cx=600,py=50,Lp=320,g=1,R=26,path=1,vert=1,disp=0,grav=0,split=0,tens=0,tanHi=1,radHi=1,G=150,vpx=0,mtext='',bobColor=C.x,dispLab='ずれ',tanLab='',ceil=1,thMax=.75}={}){
 const bx=cx+Lp*Math.sin(th),by=py+Lp*Math.cos(th);
 let s='';
 if(ceil){s+=line(cx-90,py,cx+90,py,{color:C.dim,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});}
 if(vert)s+=fade(vert,line(cx,py,cx,py+Lp+50,{color:C.faint,w:2,dash:'7 7'}));
 if(path)s+=fade(path,draw(Array.from({length:41},(_,i)=>{const a=-thMax+2*thMax*i/40;return [cx+Lp*Math.sin(a),py+Lp*Math.cos(a)];}),1,{color:C.faint,w:2,dash:'5 8'}));
 if(disp&&Math.abs(th)>.02){
  const Rd=Lp-72,n=24,pts=Array.from({length:n+1},(_,i)=>{const a=th*i/n;return [cx+Rd*Math.sin(a),py+Rd*Math.cos(a)];});
  s+=fade(disp,draw(pts.slice(0,n-1),1,{color:C.x,w:5})+arrow(pts[n-2][0],pts[n-2][1],pts[n][0],pts[n][1],{color:C.x,w:5,head:16})
   +(dispLab?label(dispLab,cx+(Rd-36)*Math.sin(th/2),py+(Rd-36)*Math.cos(th/2)+8,{size:26,color:C.x,anchor:'middle',weight:700}):''));
 }
 s+=line(cx,py,bx,by,{color:C.ink,w:3})+dot(cx,py,7,C.dim);
 s+=ring(bx,by,R,{color:bobColor,w:3,fill:'#123049'})+(mtext?label(mtext,bx,by+(R<35?7:9),{size:R<35?19:24,color:C.ink,anchor:'middle'}):'');
 const sn=Math.sin(th),cs=Math.cos(th);
 if(grav){
  const ga=split?mix(1,.35,split):1;
  s+=fade(grav*ga,arrow(bx,by,bx,by+G,{color:C.F,w:6,head:18})+label('mg',bx+14,by+G-6,{size:26,color:C.F,weight:700}));
 }
 if(split){
  const rx=G*cs*sn,ry=G*cs*cs,tx=-G*sn*cs,ty=G*sn*sn;
  s+=fade(split*.8,line(bx+rx,by+ry,bx,by+G,{color:C.F,w:2,dash:'6 6'})+line(bx+tx,by+ty,bx,by+G,{color:C.F,w:2,dash:'6 6'}));
  s+=fade(split*radHi,arrow(bx,by,bx+rx,by+ry,{color:CR,w:6,head:16}));
  if(Math.abs(sn)>.03)s+=fade(split*tanHi,arrow(bx,by,bx+tx,by+ty,{color:C.F,w:7,head:20})+(tanLab?label(tanLab,bx+tx+(tx<0?-12:12),by+ty-14,{size:26,color:C.F,anchor:tx<0?'end':'start',weight:700}):''));
 }
 if(tens){const Tl=G*cs;s+=fade(tens,arrow(bx,by,bx-Tl*sn,by-Tl*cs,{color:CR,w:6,head:16})+label('糸の力',bx-Tl*sn+(sn>=0?16:-16),by-Tl*cs+20,{size:24,color:CR,anchor:sn>=0?'start':'end'}));}
 if(Math.abs(vpx)>2){const ux=cs,uy=-sn,e=Math.sign(vpx)*R;s+=arrow(bx+e*ux,by+e*uy,bx+(vpx+e)*ux,by+(vpx+e)*uy,{color:C.v,w:5,head:16})+label('v',bx+(vpx+e)*ux+(vpx>0?10:-10),by+(vpx+e)*uy-12,{size:26,color:C.v,anchor:vpx>0?'start':'end',weight:700});}
 return fade(g,s);
}
const bobXY=(th,{cx=600,py=50,Lp=320}={})=>[cx+Lp*Math.sin(th),py+Lp*Math.cos(th)];

// ---- energy: L = 1 m, released from h = 0.2 m (cos θ0 = 0.8), g = 10, m = 1 kg ---------
const TH0=Math.acos(.8);
const thAt=ph=>TH0*Math.cos(ph);                 // swing phase ph (2π = one period); display only
const hOf=th=>1-Math.cos(th);                    // [m]
const UOf=th=>10*hOf(th),KOf=th=>Math.max(0,2-UOf(th));
const EP={cx:330,py:40,Lp:300};                  // 0.2 m ↔ 60 px
// vs: direction of motion along the arc (+1 = increasing θ, −1 = decreasing, 0 = no arrow). Arrow length ∝ speed.
function epend(th,{g=1,vs=-1,hl=1,grav=0,tens=0}={}){
 const [bx,by]=bobXY(th,EP),yb=EP.py+EP.Lp,ye=yb-.2*EP.Lp;
 let s=fade(hl,line(70,yb,620,yb,{color:C.dim,w:2,dash:'6 6'})+label('U ＝ 0（一番低い所）',80,yb+44,{size:22,color:C.dim})
  +line(70,ye,620,ye,{color:CU,w:2,dash:'6 6'})+label('0.2 m',608,(ye+yb)/2+9,{size:24,color:CU})
  +line(595,ye,595,yb,{color:CU,w:2}));
 const vp=vs*Math.sqrt(2*KOf(th))*45;
 s+=pend(th,{...EP,path:1,thMax:TH0+.05,vert:1,grav,tens,mtext:'1 kg',vpx:vp,R:30});
 return fade(g,s);
}
// bars: U orange, K purple, total line yellow at 2 J
function bars(U,Kv,{x=720,y=440,sc=115,g=1,nums=1,total=1,tot=2,unit='J'}={}){
 let s=line(x-40,y,x+330,y,{color:C.dim,w:3});
 s+=rect(x,y-U*sc,110,U*sc,{fill:CU,fo:.55,stroke:CU})+rect(x+180,y-Kv*sc,110,Kv*sc,{fill:CK,fo:.55,stroke:CK});
 s+=label('U',x+55,y+38,{size:30,color:CU,anchor:'middle',weight:700})+label('K',x+235,y+38,{size:30,color:CK,anchor:'middle',weight:700});
 s+=label('位置エネルギー',x+55,y+70,{size:22,color:CU,anchor:'middle'})+label('運動エネルギー',x+235,y+70,{size:22,color:CK,anchor:'middle'});
 if(nums){s+=label(`${U.toFixed(1)} ${unit}`,x+55,y-U*sc-12,{size:26,color:CU,anchor:'middle',weight:700})+label(`${Kv.toFixed(1)} ${unit}`,x+235,y-Kv*sc-12,{size:26,color:CK,anchor:'middle',weight:700});}
 if(total)s+=fade(total,line(x-30,y-tot*sc,x+320,y-tot*sc,{color:C.hi,w:3,dash:'10 7'})+label(nums?`合計 ${tot} ${unit}`:'合計',x+332,y-tot*sc+8,{size:24,color:C.hi,weight:700}));
 return fade(g,s);
}
const barsAt=(th,o={})=>bars(UOf(th),KOf(th),o);

// ---- circle shadow (振動の方程式・初級 2/2 と同じ見方) -------------------------------------
function shadow(ph,{cx=330,cy=260,R=150,g=1,arcG=1}={}){
 const px=cx+R*Math.cos(ph),py=cy-R*Math.sin(ph);
 let s=ring(cx,cy,R,{color:C.faint,w:3})+line(cx-R-20,cy,cx+R+20,cy,{color:C.faint,w:2})+dot(cx,cy,5,C.dim);
 s+=line(cx,cy,px,py,{color:C.dim,w:3});
 const n=Math.max(2,Math.round(40*((ph%(2*Math.PI))+.001)/(2*Math.PI)));
 const a1=ph%(2*Math.PI);
 if(a1>.05)s+=fade(arcG,draw(Array.from({length:n+1},(_,i)=>{const a=a1*i/n;return [cx+44*Math.cos(a),cy-44*Math.sin(a)];}),1,{color:CW,w:4}));
 s+=dot(px,py,11,C.hi);
 const ax=cx+R+120;
 s+=line(ax,cy-R-20,ax,cy+R+20,{color:C.dim,w:2})+line(px,py,ax,py,{color:C.hi,w:2,dash:'5 6',opacity:.7})+dot(ax,py,12,C.x)+label('x',ax+20,py+9,{size:28,color:C.x,weight:700});
 return fade(g,s);
}

export const ytUiPendulum1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  // door seen from above: hinge at left, push at the end
  let s=card(60,60,500,330,label('前回：トルク',310,110,{size:30,color:C.dim,anchor:'middle'}),1);
  const hx=130,hy=300,ang=.5*seg(p,.05,.3),L=340,ex=hx+L*Math.cos(ang),ey=hy-L*Math.sin(ang);
  s+=dot(hx,hy,9,C.dim)+line(hx,hy,ex,ey,{color:C.ink,w:9});
  s+=arrow(ex+34*Math.sin(ang)*1,ey+34*Math.cos(ang)+50,ex,ey+8,{color:C.F,w:6,head:18,g:1})+label('押す',ex+20,ey+80,{size:24,color:C.F});
  s+=label('ドアが 回る',310,360,{size:26,color:C.ink,anchor:'middle'});
  const th=.45*Math.cos(2.4*Math.PI*seg(p,.55,1));
  s+=fade(seg(p,.45,.6),pend(p<.55?.45:th,{cx:880,py:70,Lp:280,path:1,thMax:.55})+label('ずれると 戻す力 ？',880,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  const ph=2*Math.PI*1.3*p;
  let s=pend(.45*Math.cos(ph),{cx:260,py:130,Lp:300,thMax:.55,vert:0});
  s+=rig(.09*Math.cos(ph*1.25),{ox:860,y:440,wx:600,sc:1100,bw:90,bh:80,x0lab:0});
  s+=card(250,14,700,100,label('なぜ 行ったり来たり？　なぜ 同じリズム？',600,76,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'plan']:(p)=>{
  let s='';
  const items=[['① 戻す力の 向き',C.F],['② 一周に かかる 時間',CT],['③ エネルギーの 受け渡し',CU]];
  items.forEach(([t,c],i)=>{s+=card(200,50+i*140,800,110,label(t,600,118+i*140,{size:36,color:c,anchor:'middle',weight:700}),seg(p,.08+.2*i,.22+.2*i),c);});
  return s;
 },
 [K+'plan2']:(p)=>{
  let s=card(90,70,560,330,label('振動の方程式の回（ばね）',370,120,{size:28,color:C.dim,anchor:'middle'})
   +tex('F=-kx',370,190,{size:44})+tex(`\\dfrac{d^2x}{dt^2}=-${WW}^2x`,370,285,{size:44})+tex(`${TT}=\\dfrac{2\\pi}{${WW}}`,370,370,{size:40}),1);
  s+=fade(seg(p,.4,.55),arrow(670,235,760,235,{color:C.hi,w:4})+label('並べる',715,210,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),pend(.4*Math.cos(2*Math.PI*1.2*seg(p,.45,1)),{cx:950,py:60,Lp:300,thMax:.5}));
  return s;
 },

 // ===== S2 戻す力の向き =====
 [K+'spring']:(p)=>{
  let s=rig(0,{y:390,x0lab:seg(p,.2,.4)>0?1:0});
  s+=fade(seg(p,.05,.2),label('ばねが 自然の長さ（伸びも 縮みも しない）',600,80,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),arrow(760,150,920,150,{color:C.dim,w:3,head:14})+label('右向きが 正',930,158,{size:26,color:C.ink}));
  return s;
 },
 [K+'push']:(p)=>{
  const d=p<.48?.1*seg(p,.02,.18):p<.55?.1*(1-seg(p,.48,.55)):-.1*seg(p,.55,.7);
  const right=p<.48;
  let s=rig(d,{y:390,xArr:1,fArr:right?seg(p,.2,.3):seg(p,.72,.82)});
  s+=fade(right?seg(p,.2,.3):seg(p,.72,.82),label(right?'伸びて 左へ 引き戻す':'縮んで 右へ 押し戻す',600,80,{size:32,color:C.F,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hooke']:(p)=>{
  let s=rig(.1,{y:215,ox:360,wx:90,sc:1200,xArr:1,fArr:1,fk:.9,x1:640,bh:70,bw:90,x0lab:0});
  s+=rig(-.1,{y:470,ox:360,wx:90,sc:1200,xArr:1,fArr:1,fk:.9,x1:640,bh:70,bw:90,x0lab:0});
  s+=line(360,40,360,480,{color:C.dim,w:2,dash:'7 7'});
  s+=card(700,70,460,330,tex('F=-kx',930,160,{size:64})+label('フックの法則',930,235,{size:28,color:C.F,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('－ ＝ ずれと 逆向き',930,320,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.3,.45),C.F);
  return s;
 },
 [K+'pend']:(p)=>{
  let s=pend(0,{path:0,vert:seg(p,.5,.7)});
  s+=fade(seg(p,.1,.25),label('支点',690,58,{size:26,color:C.dim})+label('糸',620,210,{size:26,color:C.ink})+label('おもり',640,380,{size:26,color:C.x}));
  s+=fade(seg(p,.55,.75),label('真下 ＝ ずれ 0',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'forces']:(p)=>{
  const th=.55*seg(p,0,.2);
  let s=pend(th,{disp:seg(p,.1,.25),grav:seg(p,.3,.45),tens:seg(p,.6,.75)});
  s+=fade(seg(p,.3,.45),label('重力 mg（真下向き）',80,150,{size:28,color:C.F,weight:700}));
  s+=fade(seg(p,.6,.75),label('糸の力（支点の方へ）',80,200,{size:28,color:CR,weight:700}));
  return s;
 },
 [K+'split']:(p)=>{
  let s=pend(.55,{disp:1,grav:1,split:seg(p,.3,.6)});
  s+=fade(seg(p,.05,.2),label('重力を 二つの 成分に 分ける',80,110,{size:28,color:C.F,weight:700}));
  s+=fade(seg(p,.55,.7),label('糸の 方向',80,170,{size:26,color:CR})+label('円弧に 沿う 方向',80,210,{size:26,color:C.F}));
  return s;
 },
 [K+'radial']:(p)=>{
  const th=.55,[bx,by]=bobXY(th),sn=Math.sin(th),cs=Math.cos(th);
  let s=pend(th,{disp:1,grav:1,split:1,tens:seg(p,.05,.2),tanHi:.3});
  // right-angle mark between string and arc tangent at the bob
  const q=24,ux=-sn,uy=-cs,tx=cs,ty=-sn,ox=bx+36*ux,oy=by+36*uy;
  s+=fade(seg(p,.3,.45),draw([[ox,oy],[ox+q*tx,oy+q*ty],[ox+q*tx-q*ux,oy+q*ty-q*uy]],1,{color:C.hi,w:3}));
  s+=fade(seg(p,.3,.45),draw(Array.from({length:21},(_,i)=>{const a=th-.25+.5*i/20;return [600+320*Math.sin(a),50+320*Math.cos(a)];}),1,{color:C.hi,w:3}));
  s+=card(40,90,420,130,label('糸の方向 ⟂ 動く向き',250,145,{size:28,color:C.hi,anchor:'middle',weight:700})+label('→ 速さを 変えない',250,195,{size:28,color:CR,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'tangent']:(p)=>{
  let s=pend(.55,{disp:1,grav:1,split:1,radHi:.3,tanLab:'戻す向き'});
  s+=card(40,90,420,130,label('右に ずれる → 左向き',250,145,{size:28,color:C.F,anchor:'middle',weight:700})+label('真下の 位置へ 戻す',250,195,{size:28,color:C.ink,anchor:'middle'}),seg(p,.4,.55),C.F);
  return s;
 },
 [K+'tangent2']:(p)=>{
  const th=mix(.55,-.55,seg(p,.05,.35));
  let s=pend(th,{cx:470,disp:1,grav:1,split:1,radHi:.3,tanLab:''});
  s+=card(840,80,330,300,label('ばねと 同じ',1005,130,{size:30,color:C.hi,anchor:'middle',weight:700})
   +arrow(900,200,1100,200,{color:C.x,w:5,head:16})+label('ずれ',1000,185,{size:24,color:C.x,anchor:'middle'})
   +arrow(1100,270,900,270,{color:C.F,w:6,head:18})+label('戻す力',1000,305,{size:24,color:C.F,anchor:'middle'})
   +label('いつも 逆向き',1005,355,{size:28,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'bottom']:(p)=>{
  const ph=Math.PI*.5*seg(p,0,.5)+Math.PI*.5*(p>.5?seg(p,.5,1)*.6:0);
  const th=.5*Math.cos(ph),w=-.5*Math.sin(ph);
  let s=pend(th,{grav:1,split:1,radHi:.25,vpx:w*260});
  s+=fade(seg(p,.35,.5),card(40,90,430,130,label('真下：戻す力 0',255,145,{size:28,color:C.F,anchor:'middle',weight:700})+label('速さは 最大 → 通り過ぎる',255,195,{size:26,color:C.v,anchor:'middle'}),1,C.hi));
  return s;
 },
 [K+'prop']:(p)=>{
  const A=axes({x:140,y:430,w:560,h:330,xmin:0,xmax:1.6,ymin:0,ymax:1.1,xlabel:'ずれ',ylabel:'戻す力の 大きさ',xcolor:C.x,ycolor:C.F,g:seg(p,0,.15)});
  let s=A.svg+A.plot(Math.sin,{from:0,to:1.55,p:seg(p,.1,.4),color:C.F,w:5});
  s+=fade(seg(p,.35,.5),A.plot(u=>u,{from:0,to:1.05,color:C.hi,w:3,dash:'10 8'}));
  s+=fade(seg(p,.35,.5),highlight(A.X(0)-10,A.Y(.38),A.X(.38)-A.X(0)+20,A.Y(0)-A.Y(.38)+10,1));
  s+=card(760,110,400,130,label('小さい間は',960,160,{size:28,color:C.ink,anchor:'middle'})+label('ほぼ 比例（直線）',960,210,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.4,.55),C.hi);
  s+=card(760,290,400,90,label('式は 中級で 導く',960,346,{size:28,color:C.dim,anchor:'middle'}),seg(p,.7,.82));
  return s;
 },

 // ===== S3 一周の時間 =====
 [K+'period']:(p)=>{
  const tt=4.2*p,Tp=2,th=.4*Math.cos(2*Math.PI*tt/Tp);
  let s=pend(th,{cx:230,py:60,Lp:280,thMax:.5,vert:1});
  const A=axes({x:480,y:300,w:640,h:220,xmin:0,xmax:4.4,ymin:-1.2,ymax:1.2,xlabel:'t',ylabel:'ずれ',xcolor:CT,ycolor:C.x,xticks:[],yticks:[]});
  s+=A.svg+A.plot(t=>Math.cos(2*Math.PI*t/Tp),{from:0,to:tt,color:C.x,w:4});
  s+=dot(A.X(tt),A.Y(Math.cos(2*Math.PI*tt/Tp)),8,C.hi);
  const gT=seg(p,.55,.7);
  s+=fade(gT,line(A.X(0),A.Y(1)-10,A.X(0),A.Y(-1)+40,{color:CT,w:2,dash:'5 5'})+line(A.X(2),A.Y(1)-10,A.X(2),A.Y(-1)+40,{color:CT,w:2,dash:'5 5'}));
  s+=brace(A.X(0),A.X(2),A.Y(-1)+44,{dir:1,color:CT,text:'周期 T',size:28,g:gT});
  s+=fade(seg(p,.7,.85),label('同じ位置・同じ向きの 動き',A.X(2)+14,A.Y(1)-30,{size:24,color:C.hi}));
  return s;
 },
 [K+'shadow']:(p)=>{
  const ph=2*Math.PI*1.05*seg(p,.05,.9);
  let s=shadow(ph);
  s+=fade(seg(p,.35,.5),card(740,90,420,110,label('一周 ＝ 2π（ラジアン）',950,158,{size:30,color:C.ink,anchor:'middle',weight:700}),1));
  s+=fade(seg(p,.6,.75),card(740,240,420,110,label('1秒に 進む角度 ＝ ω',950,308,{size:30,color:CW,anchor:'middle',weight:700}),1,CW));
  return s;
 },
 [K+'spT0']:(p)=>{
  let s=tex(`${WW}${TT}=2\\pi`,600,120,{size:72});
  s+=fade(seg(p,.35,.5),label('両辺を ω で 割る',600,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),tex(`${TT}=\\dfrac{2\\pi}{${WW}}`,600,380,{size:72}));
  return s;
 },
 [K+'spT']:(p)=>{
  let s=tex(`${WW}${TT}=2\\pi`,300,110,{size:56});
  s+=arrow(470,110,560,110,{color:C.hi,w:3,head:12})+tex(`${TT}=\\dfrac{2\\pi}{${WW}}`,760,110,{size:56});
  s+=card(120,210,960,120,label('m ＝ 1 kg，　k ＝ 4 N/m',600,262,{size:30,color:C.ink,anchor:'middle'})+tex(`${WW}=2\\,\\mathrm{rad/s}`,600,305,{size:34,auto:false}),seg(p,.05,.2));
  s+=fade(seg(p,.45,.6),tex(`${TT}=\\dfrac{2\\pi}{2}=\\pi\\,\\mathrm{s}\\approx3.14\\,\\mathrm{s}`,600,420,{size:52,auto:false}));
  return s;
 },
 [K+'iso']:(p)=>{
  const ph=2*Math.PI*1.2*seg(p,.2,1);
  let s=rig(.08*Math.cos(ph),{y:200,ox:560,wx:180,sc:1000,bh:70,bw:80,xArr:1,fArr:1,fk:.8,x0lab:0,x1:900});
  s+=rig(.16*Math.cos(ph),{y:450,ox:560,wx:180,sc:1000,bh:70,bw:80,xArr:1,fArr:1,fk:.8,x0lab:0,x1:900});
  s+=line(560,20,560,470,{color:C.faint,w:2,dash:'7 7'});
  s+=label('振幅 ×1',40,170,{size:26,color:C.dim})+label('振幅 ×2',40,420,{size:26,color:C.dim});
  s+=card(930,60,250,380,label('ずれ 2倍',1055,120,{size:26,color:C.x,anchor:'middle',weight:700})+label('→ 力 2倍',1055,170,{size:26,color:C.F,anchor:'middle'})+label('→ 速さ 2倍',1055,220,{size:26,color:C.v,anchor:'middle'})
   +fade(seg(p,.55,.7),label('同じ 時刻に',1055,300,{size:26,color:C.hi,anchor:'middle',weight:700})+label('端・中心',1055,345,{size:26,color:C.hi,anchor:'middle',weight:700})+label('周期 は 同じ',1055,400,{size:26,color:CT,anchor:'middle',weight:700})),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'pT']:(p)=>{
  const th=.3*Math.cos(2*Math.PI*1.5*p);
  let s=pend(th,{cx:260,py:50,Lp:330,thMax:.4});
  s+=card(560,150,580,160,label('小さく 揺れる間',850,212,{size:30,color:C.ink,anchor:'middle'})+label('周期は 振幅に よらない',850,266,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'pT1']:(p)=>{
  const th=.3*Math.cos(2*Math.PI*1.5*p);
  let s=pend(th,{cx:260,py:50,Lp:330,thMax:.4});
  s+=fade(seg(p,.45,.6),line(100,50,100,380,{color:C.x,w:3})+line(88,50,112,50,{color:C.x,w:3})+line(88,380,112,380,{color:C.x,w:3})+label('L',80,225,{size:30,color:C.x,anchor:'end',weight:700}));
  s+=card(560,40,580,210,tex(`${TT}\\approx2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,850,120,{size:58})+label('（中級で 導く 結果）',850,225,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),CT);
  s+=card(560,290,580,150,label('L：糸の長さ',850,350,{size:30,color:C.x,anchor:'middle',weight:700})+label('g：重力加速度',850,405,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'pT2']:(p)=>{
  let t=label('L ＝ 1 m，　g ＝ 10 m/s²',600,110,{size:34,color:C.ink,anchor:'middle'});
  t+=fade(seg(p,.2,.35),tex(`${TT}\\approx2\\pi\\sqrt{\\dfrac{1}{10}}`,340,260,{size:54}));
  t+=fade(seg(p,.4,.55),tex('\\approx2\\pi\\times0.32',720,260,{size:48,auto:false}));
  t+=fade(seg(p,.6,.75),tex(`\\approx2.0\\,\\mathrm{s}`,1010,260,{size:54,auto:false,color:CT}));
  t+=fade(seg(p,.8,.92),label('（g ＝ 9.8 m/s² でも 約 2.0 s）',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return t;
 },
 [K+'mass']:(p)=>{
  const th=.35*Math.cos(2*Math.PI*1.4*p);
  let s=pend(th,{cx:260,py:60,Lp:300,thMax:.45,mtext:'1 kg',R:28});
  s+=pend(th,{cx:660,py:60,Lp:300,thMax:.45,mtext:'3 kg',R:44,bobColor:C.hi});
  s+=card(880,120,290,200,tex(`${TT}\\approx2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,1025,200,{size:40})+label('m が ない',1025,290,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.5,.65),label('同じ 長さ → 同じ リズム',460,480,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'mass2']:(p)=>{
  let s=card(70,70,500,260,label('重力 mg',320,130,{size:32,color:C.F,anchor:'middle',weight:700})+label('重いほど 大きい',320,190,{size:28,color:C.ink,anchor:'middle'})+label('（m に 比例）',320,240,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.15),C.F);
  s+=card(630,70,500,260,label('動かしにくさ（質量 m）',880,130,{size:32,color:C.ink,anchor:'middle',weight:700})+label('重いほど 大きい',880,190,{size:28,color:C.ink,anchor:'middle'})+label('（m そのもの）',880,240,{size:26,color:C.dim,anchor:'middle'}),seg(p,.3,.45));
  s+=card(250,380,700,100,label('打ち消し合う → 動き方は 同じ',600,442,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.65,.8),C.hi);
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=pend(.3*Math.cos(2*Math.PI*p),{cx:220,py:40,Lp:90,thMax:.4,R:16,vert:0});
  s+=label('1 m',220,190,{size:26,color:C.x,anchor:'middle'});
  s+=pend(.3,{cx:520,py:40,Lp:360,thMax:.4,R:22,vert:0,g:seg(p,.1,.25)});
  s+=fade(seg(p,.1,.25),label('4 m',600,300,{size:28,color:C.x,weight:700}));
  s+=card(720,120,440,200,label('糸を 4倍にすると',940,190,{size:32,color:C.ink,anchor:'middle'})+label('周期は？',940,260,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'quiz2']:(p)=>{
  const u=seg(p,.4,1);
  let s=pend(.3*Math.cos(2*Math.PI*2*u),{cx:160,py:40,Lp:90,thMax:.4,R:16,vert:0})+label('1 m：約 2.0 s',160,190,{size:24,color:C.x,anchor:'middle'});
  s+=pend(.3*Math.cos(2*Math.PI*u),{cx:420,py:40,Lp:360,thMax:.4,R:22,vert:0})+label('4 m：約 4.0 s',480,470,{size:24,color:C.x});
  s+=card(660,40,510,300,tex(`\\sqrt{\\dfrac{4}{g}}=\\sqrt{4}\\,\\sqrt{\\dfrac{1}{g}}`,915,120,{size:40})+label('√4 ＝ 2倍',915,210,{size:30,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),tex(`${TT}\\approx2\\times2.0=4.0\\,\\mathrm{s}`,915,290,{size:40,auto:false})),seg(p,0,.15),C.hi);
  s+=fade(seg(p,.7,.85),label('長いほど ゆっくり',915,420,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S4 エネルギーの受け渡し =====
 [K+'eset']:(p)=>{
  let s=epend(TH0,{vs:0,hl:seg(p,.3,.5)});
  s+=card(720,100,440,200,label('1 kg の おもり',940,165,{size:30,color:C.ink,anchor:'middle',weight:700})+label('0.2 m 高い 端から',940,215,{size:28,color:CU,anchor:'middle'})+label('そっと 離す',940,262,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'eend']:(p)=>{
  let s=epend(TH0,{vs:0});
  s+=barsAt(TH0,{g:seg(p,.45,.6),total:0});
  s+=fade(seg(p,.1,.3),tex('U=mgh=1\\times10\\times0.2=2\\,\\mathrm{J}',900,60,{size:32,auto:false,color:CU}));
  s+=fade(seg(p,.7,.85),label('止まっている → K ＝ 0',900,120,{size:26,color:CK,anchor:'middle',weight:700}));
  return s;
 },
 [K+'epredict']:(p)=>{
  let s=epend(TH0,{vs:0});
  s+=barsAt(TH0,{total:0});
  s+=fade(seg(p,.1,.25),card(700,20,480,90,label('端 → 真ん中：U と K は？',940,78,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'edown']:(p)=>{
  const th=TH0*Math.cos(Math.PI/2*seg(p,.1,.9)*.999);
  let s=epend(th,{grav:1});
  s+=barsAt(th,{total:0});
  s+=fade(seg(p,.2,.35),label('U 減る → K 増える',940,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ehalf']:(p)=>{
  const th=Math.acos(.9);
  let s=epend(th);
  s+=fade(seg(p,.05,.2),line(70,EP.py+.9*EP.Lp,620,EP.py+.9*EP.Lp,{color:C.hi,w:2,dash:'4 6'})+label('高さ 0.1 m',80,EP.py+.9*EP.Lp-8,{size:22,color:C.hi}));
  s+=barsAt(th,{total:seg(p,.55,.7)});
  return s;
 },
 [K+'ebottom']:(p)=>{
  let s=epend(0);
  s+=barsAt(0,{total:1});
  s+=fade(seg(p,.3,.45),label('U ＝ 0，　K ＝ 2 J',940,60,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ev']:(p)=>{
  let s=epend(0,{hl:.4,vs:-1});
  s+=card(660,30,510,330,tex('K=\\tfrac12mv^2',915,90,{size:40})
   +fade(seg(p,.2,.35),tex('\\tfrac12\\times1\\times v^2=2',915,170,{size:40}))
   +fade(seg(p,.4,.55),tex('v^2=4',915,245,{size:40}))
   +fade(seg(p,.55,.7),tex('v=2\\,\\mathrm{m/s}',915,320,{size:42})),1,CK);
  s+=fade(seg(p,.75,.9),label('ここが 最も 速い',915,440,{size:30,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'eup']:(p)=>{
  const th=-TH0*Math.sin(Math.PI/2*seg(p,.05,.8));
  let s=epend(th,{vs:-1});
  s+=barsAt(th,{total:1});
  s+=fade(seg(p,.75,.9),label('同じ 0.2 m で 一瞬 止まる',940,60,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ebars']:(p)=>{
  const ph=2*Math.PI*1.5*p,th=thAt(ph);
  let s=epend(th,{vs:Math.sign(-Math.sin(ph))});
  s+=barsAt(th,{total:1});
  s+=fade(seg(p,.4,.55),label('内訳は 変わる／合計は 水平',940,60,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ewhy']:(p)=>{
  const th=.35,[bx,by]=bobXY(th,EP);
  let s=epend(th,{tens:1,grav:1,vs:0,hl:0});
  const sn=Math.sin(th),cs=Math.cos(th);
  s+=arrow(bx,by,bx-90*cs,by+90*sn,{color:C.v,w:5,head:16})+label('動く向き',bx-90*cs-10,by+90*sn+30,{size:24,color:C.v,anchor:'end'});
  const q=20,ux=-sn,uy=-cs,tx=-cs,ty=sn,ox=bx+34*ux,oy=by+34*uy;
  s+=fade(seg(p,.1,.25),draw([[ox,oy],[ox+q*tx,oy+q*ty],[ox+q*tx-q*ux,oy+q*ty-q*uy]],1,{color:C.hi,w:3}));
  s+=card(700,40,460,160,label('糸の力 ⟂ 動く向き',930,100,{size:28,color:CR,anchor:'middle',weight:700})+label('→ 仕事 0',930,160,{size:28,color:C.ink,anchor:'middle'}),seg(p,.1,.25),CR);
  s+=card(700,240,460,180,label('仕事をするのは 重力だけ',930,300,{size:28,color:C.F,anchor:'middle',weight:700})+tex('K+U=\\text{一定}',930,375,{size:40,auto:false,color:C.hi}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'etrap']:(p)=>{
  const ph=2*Math.PI*1.2*p,th=thAt(ph);
  let s=barsAt(th,{x:120,y:430,total:1});
  s+=card(640,50,520,380,
   label('K は 一定',780,130,{size:32,color:CK})+ng(1060,132,seg(p,.2,.3))
   +label('U は 一定',780,220,{size:32,color:CU})+ng(1060,222,seg(p,.3,.4))
   +fade(seg(p,.55,.7),label('K ＋ U が 一定',780,330,{size:34,color:C.hi,weight:700}))+ok(1060,332,seg(p,.6,.72)),1);
  return s;
 },
 [K+'espring']:(p)=>{
  const ph=2*Math.PI*1.3*p,d=.1*Math.cos(ph),v=-.1*Math.sin(ph);
  let s=rig(d,{y:250,ox:360,wx:70,sc:1300,x1:640,bh:80,bw:90,vArr:1,v:v*1.6,x0lab:0});
  const Uf=(d/.1)**2,Kf=1-Uf;
  s+=bars(2*Uf,2*Kf,{y:430,sc:110,nums:0});
  s+=fade(seg(p,.1,.25),label('端：止まる・ばねに 蓄える',80,400,{size:26,color:CU})+label('中央：最も 速い',80,450,{size:26,color:CK}));
  return s;
 },
 [K+'ereal']:(p)=>{
  const ph=2*Math.PI*3*p,damp=Math.exp(-1.1*p),th=TH0*damp*Math.cos(ph);
  const Et=10*(1-Math.cos(TH0*damp));
  const Uv=Math.min(Et,10*(1-Math.cos(th))),Kv=Math.max(0,Et-Uv);
  let s=epend(th,{vs:0,hl:.3});
  s+=bars(Uv,Kv,{total:0,nums:0});
  s+=line(690,440-2*115,1040,440-2*115,{color:C.dim,w:2,dash:'8 8'})+label('初め',1052,440-2*115+8,{size:22,color:C.dim});
  s+=line(690,440-Et*115,1040,440-Et*115,{color:C.a,w:3})+label('合計',1052,440-Et*115+8,{size:24,color:C.a,weight:700});
  s+=fade(seg(p,.2,.35),label('空気の抵抗 → 合計が 少しずつ 減る',880,50,{size:26,color:C.a,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S5 まとめ =====
 [K+'sum1']:(p)=>{
  const ph=2*Math.PI*1.2*p;
  let s=pend(.4*Math.cos(ph),{cx:230,py:60,Lp:260,thMax:.5,grav:1,split:1,radHi:0,G:90});
  s+=card(500,60,660,330,label('ずれと 逆向きに 戻す力',830,130,{size:32,color:C.F,anchor:'middle',weight:700})
   +label('真ん中で 力 0、でも 速さ 最大',830,210,{size:28,color:C.ink,anchor:'middle'})
   +label('→ 通り過ぎて また 戻る',830,280,{size:28,color:C.ink,anchor:'middle'})
   +label('＝ 行ったり来たり',830,350,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.F);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(80,50,1040,170,label('戻す力 ∝ ずれ の間：周期は 振幅に よらない',600,115,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${TT}=\\dfrac{2\\pi}{${WW}}`,600,185,{size:36}),1);
  s+=card(80,260,1040,200,label('振り子：質量にも よらない',600,300,{size:30,color:C.ink,anchor:'middle',weight:700})+tex(`${TT}\\approx2\\pi\\sqrt{\\dfrac{${LL}}{g}}`,600,410,{size:40}),seg(p,.3,.45),CT);
  return s;
 },
 [K+'sum3']:(p)=>{
  const ph=2*Math.PI*1.3*p,th=thAt(ph);
  let s=epend(th,{vs:Math.sign(-Math.sin(ph)),hl:.4});
  s+=barsAt(th,{total:1});
  return s;
 },
 [K+'next']:(p)=>{
  const th=.35*Math.cos(2*Math.PI*1.2*p);
  let s=pend(th,{cx:300,py:60,Lp:300,thMax:.45,g:1-seg(p,.35,.5)});
  // rod pendulum: mass spread along the rod
  const gr=seg(p,.35,.55),cx=300,py=60,Lp=330,ex=cx+Lp*Math.sin(th),ey=py+Lp*Math.cos(th);
  s+=fade(gr,line(cx-90,py,cx+90,py,{color:C.dim,w:4})+line(cx,py,ex,ey,{color:C.x,w:26,cap:'round'})+dot(cx,py,8,C.hi));
  s+=card(640,140,500,190,label('おもりが 広がって いたら？',890,215,{size:32,color:C.hi,anchor:'middle',weight:700})+label('（棒の 振り子）',890,275,{size:26,color:C.dim,anchor:'middle'}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'next2']:(p)=>{
  const th=.35*Math.cos(2*Math.PI*1.2*p),cx=260,py=60,Lp=330,ex=cx+Lp*Math.sin(th),ey=py+Lp*Math.cos(th);
  let s=line(cx-90,py,cx+90,py,{color:C.dim,w:4})+line(cx,py,ex,ey,{color:C.x,w:26,cap:'round'})+dot(cx,py,8,C.hi);
  s+=card(560,70,600,150,label('動かしにくさ は',860,130,{size:30,color:C.ink,anchor:'middle'})+label('質量 だけで 決まる？',860,185,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=card(560,270,600,120,label('重さが どこに あるか は 効く？',860,340,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  return s;
 },
};
