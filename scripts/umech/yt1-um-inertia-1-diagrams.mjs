// YouTube シリーズ「慣性モーメント・中級 1/2」(ys-um-inertia-1) — 図。Stage 1200×515.
// 色：位置・距離 x・r 水色、速度 v 紫、力 F 緑、トルク・ω 桃、運動エネルギー K・仕事 橙、質量 m・I 白、強調 黄。
// 数値：初級のシーソー 1 kg (x＝0)・3 kg (x＝4 m) → x_G＝3 m。重み付き平均 (0＋4＋4＋4)÷4＝3。
//   平面の例 1 kg (0,0)、1 kg (4,0)、2 kg (2,3) → G (2, 1.5)。2 kg、ω＝1 rad/s：r＝1 m → 1 J、2 m → 4 J。I＝2×3²＝18、2×1.5²＝4.5。
// 上から見た図：回転は反時計回り（ω の矢印も反時計回り）。速さの矢印は半径に直角、長さ ∝ r。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-inertia-1:';
const CR=C.x,CV=C.v,CF=C.F,CW=C.p,CK=C.E,CH=C.hi,CD=C.dim,CM=C.m,BAD=C.a,WOOD='#b99b73';
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const RI2=col(CR,'r_i^2'),VI2=col(CV,'v_i^2'),WW=col(CW,'\\omega'),RR=col(CR,'r'),RI=col(CR,'r_i'),VV=col(CV,'v'),VI=col(CV,'v_i'),KK=col(CK,'K'),XG=col(CR,'x_G'),XI=col(CR,'x_i');
const U=s=>`\\,\\mathrm{${s}}`,KGM2=U('kg\\cdot m^2');
// M𝐚_G＝𝐅外（「外」は tex に入れず label で添える）
function MAF(x,y,size=40){const src=`M\\,${col(C.a,'\\mathbf a_G')}=${col(CF,'\\mathbf F')}`,w=texWidth(src,size,false),sub=size*.55,left=x-(w+sub)/2;
 return T(src,left,y,{size,anchor:'start'})+label('外',left+w+2,y+size*.42,{size:Math.round(sub),color:CF,weight:700});}
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));

// ---- small geometry helpers ------------------------------------------------------------------------
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),Lh=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-Lh*Math.cos(a)+Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)-Lh*.55*Math.cos(a)} ${x2-Lh*Math.cos(a)-Lh*.55*Math.sin(a)},${y2-Lh*Math.sin(a)+Lh*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const ball=(x,y,r=22,t='',o={})=>ring(x,y,r,{color:C.ink,w:3,fill:'#2a3550'})+(t?label(t,x,y+8,{size:o.size??20,color:C.ink,anchor:'middle',weight:700}):'');
const axisMark=(x,y,lbl=1)=>ring(x,y,12,{color:C.ink,w:3,fill:C.bg})+dot(x,y,4,C.ink)+(lbl?label('軸',x-20,y+8,{size:24,color:CD,anchor:'end'}):'');

// ---- pendulum (前回と同じ見た目) ------------------------------------------------------------------------
function pend(th,{cx=280,py=70,Lp=300,g=1}={}){
 const bx=cx+Lp*Math.sin(th),by=py+Lp*Math.cos(th);
 let s=line(cx-90,py,cx+90,py,{color:CD,w:4});for(let q=cx-86;q<cx+90;q+=20)s+=line(q,py,q+12,py-14,{color:C.faint,w:2});
 s+=line(cx,py,bx,by,{color:C.ink,w:3})+dot(bx,by,18,'#8fa6cf')+dot(cx,py,6,CH);
 return fade(g,s);
}

// ---- bat (side view, pivot at the hands) ---------------------------------------------------------------
// u: 0 = knob … 1 = tip. hold: hands' position u_h. ang: rotation (rad, screen, + = clockwise)
function bat(px,py,ang,{hold=.08,len=440,g=1,braceR=0,rTxt=''}={}){
 const hw=u=>u<.3?7:u<.55?7+17*((u-.3)/.25)**1.2:24-3*Math.max(0,(u-.9)/.1);
 const top=[],bot=[];
 for(let i=0;i<=40;i++){const u=i/40,x=(u-hold)*len;top.push([x,-hw(u)]);bot.push([x,hw(u)]);}
 const ca=Math.cos(ang),sa=Math.sin(ang),tr=([x,y])=>[px+x*ca-y*sa,py+x*sa+y*ca];
 const pts=[...top,...bot.reverse()].map(tr);
 let s=poly(pts,{fill:WOOD,fo:.85,stroke:'#8a6f4c',sw:2});
 const [kx,ky]=tr([-hold*len,0]);s+=dot(kx,ky,9,'#8a6f4c');
 // hands
 const h1=tr([-10,0]),h2=tr([14,0]);
 s+=`<ellipse cx="${h1[0]}" cy="${h1[1]}" rx="15" ry="19" fill="#e0b48f" stroke="#7a5a3c" stroke-width="2"/>`+`<ellipse cx="${h2[0]}" cy="${h2[1]}" rx="15" ry="19" fill="#e0b48f" stroke="#7a5a3c" stroke-width="2"/>`;
 s+=dot(px,py,5,CH);
 if(braceR>0){const [bx,by]=tr([(.78-hold)*len,0]);s+=fade(braceR,line(px,py,bx,by,{color:CR,w:3,dash:'8 6'})+dot(bx,by,7,CR)+(rTxt?label(rTxt,(px+bx)/2,(py+by)/2-30,{size:24,color:CR,anchor:'middle',weight:700}):''));}
 return fade(g,s);
}

// ---- seesaw (初級と同じ) ----------------------------------------------------------------------------------
function seesaw({s=3,ms=[[0,1,'1 kg'],[4,3,'3 kg']],x0=250,ppm=150,by=270,g=1,nl=1,ticks=null,sup=1}={}){
 const X=u=>x0+ppm*u,sx=X(s);
 let o='';
 if(nl){const y=by+150;o+=line(X(-.3),y,X(4.35),y,{color:CD,w:2});
  const tk=ticks??[0,1,2,3,4].map(u=>[u,String(u)]);
  for(const [u,t,c] of tk){o+=line(X(u),y-7,X(u),y+7,{color:CD,w:2})+label(t,X(u),y+32,{size:22,color:c??CD,anchor:'middle'});}
  o+=label('x (m)',X(4.35)+14,y+8,{size:22,color:CR});}
 if(sup)o+=poly([[sx,by+6],[sx-30,by+62],[sx+30,by+62]],{fill:C.faint,fo:1,stroke:CD,sw:2})+line(sx-70,by+62,sx+70,by+62,{color:CD,w:3});
 o+=line(X(-.25),by,X(4.25),by,{color:WOOD,w:10});
 for(const [u,m,t] of ms){const side=Math.round(50*Math.sqrt(m));o+=rect(X(u)-side/2,by-5-side,side,side,{fill:CM,fo:.18,stroke:C.ink,sw:2,rx:6})+label(t,X(u),by-5-side/2+8,{size:22,color:C.ink,anchor:'middle'});}
 o+=dot(sx,by,5,CD);
 return fade(g,o);
}

// ---- a blob body made of small point masses (top view) -------------------------------------------------
const BODY=(()=>{const pts=[];for(let i=-3;i<=3;i++)for(let j=-2;j<=2;j++){const x=i*.3,y=j*.3;if((x/1.05)**2+(y/.72)**2<=1)pts.push([x+1.25,y+.15]);}return pts;})();
function blob(phi,{ax=300,ay=300,ppm=150,g=1,hl=[],varr=0,vk=45,dots=1,outline=1}={}){
 const P=([x,y])=>{const c=Math.cos(phi),s=Math.sin(phi);return [ax+ppm*(x*c-y*s),ay-ppm*(x*s+y*c)];};
 let s='';
 if(outline){const e=[];for(let k=0;k<=48;k++){const a=2*Math.PI*k/48;e.push(P([1.25+1.2*Math.cos(a),.15+.85*Math.sin(a)]));}s+=poly(e,{fill:'#1b2946',fo:.9,stroke:CD,sw:2});}
 if(dots)for(const q of BODY){const [x,y]=P(q);s+=dot(x,y,5,'#8fa6cf');}
 hl.forEach(([idx,t,gg=1])=>{const q=BODY[idx],[x,y]=P(q),r=Math.hypot(q[0],q[1]);
  s+=fade(gg,line(ax,ay,x,y,{color:CR,w:3,dash:'7 6'})+dot(x,y,9,CH)+(t?label(t,(ax+x)/2+10,(ay+y)/2-12,{size:24,color:CR,weight:700}):''));
  if(varr>0){const a=phi+Math.atan2(q[1],q[0]),ux=-Math.sin(a),uy=-Math.cos(a),Lv=r*vk*2;s+=fade(gg*varr,arrow(x,y,x+ux*Lv,y+uy*Lv,{color:CV,w:5,head:14}));}
 });
 s+=axisMark(ax,ay);
 return fade(g,s);
}

// ---- rod with one ball seen from above -----------------------------------------------------------------
function rodBall(phi,{ax,ay,ppm=110,r=1,len=null,m='2 kg',g=1,varr=0,vTxt='',rTxt='',vk=55,wedge=0}={}){
 const Lr=(len??r)*ppm,bx=ax+r*ppm*Math.cos(phi),by=ay-r*ppm*Math.sin(phi);
 let s=line(ax,ay,ax+Lr*Math.cos(phi),ay-Lr*Math.sin(phi),{color:WOOD,w:6});
 if(rTxt)s+=label(rTxt,(ax+bx)/2+16*Math.sin(phi),(ay+by)/2+16*Math.cos(phi)+22,{size:24,color:CR,anchor:'middle',weight:700});
 s+=ball(bx,by,24,m,{size:18});
 if(varr>0){const ux=-Math.sin(phi),uy=-Math.cos(phi),Lv=r*vk;s+=fade(varr,arrow(bx+ux*26,by+uy*26,bx+ux*(26+Lv),by+uy*(26+Lv),{color:CV,w:5,head:14})+(vTxt?label(vTxt,bx+ux*(26+Lv)+12,by+uy*(26+Lv)-4,{size:22,color:CV,weight:700}):''));}
 if(wedge>0)s+=turnArc(ax,ay,46,phi-.8,phi-.1,{color:CW,g:wedge});
 s+=axisMark(ax,ay,0);
 return fade(g,s);
}

// ---- K bars ----------------------------------------------------------------------------------------------
function kbars(items,{x=700,y=440,sc=60,w=110,gap=190,g=1}={}){
 let s=line(x-30,y,x+gap*items.length-40,y,{color:CD,w:3});
 items.forEach(([Kv,lab,val,gg=1,c=CK],i)=>{const bx=x+i*gap;
  s+=fade(gg,rect(bx,y-Kv*sc,w,Kv*sc,{fill:c,fo:.5,stroke:c})+label(val,bx+w/2,y-Kv*sc-12,{size:26,color:c,anchor:'middle',weight:700}));
  s+=label(lab,bx+w/2,y+32,{size:22,color:CR,anchor:'middle'});});
 return fade(g,s);
}

// ---- dumbbell for the hammer ---------------------------------------------------------------------------
function dumbbell(cx,cy,ang,{g=1,sc=1}={}){ // heavy head (2) and light end (1); G at cx,cy; head is 1/3 of length from G
 const Ltot=150*sc,dh=Ltot/3,dl=2*Ltot/3,ca=Math.cos(ang),sa=Math.sin(ang);
 const hx=cx+dh*ca,hy=cy-dh*sa,lx=cx-dl*ca,ly=cy+dl*sa;
 let s=line(hx,hy,lx,ly,{color:CD,w:5})+dot(hx,hy,24*sc,'#8fa6cf')+dot(lx,ly,12*sc,'#8fa6cf')+dot(cx,cy,7,CH);
 return fade(g,s);
}

// ---- correspondence table ------------------------------------------------------------------------------
const TB={x:200,w:800,y0:40,rh:78};
function table(rows,{hl=-1,g=1}={}){
 const {x,w,y0,rh}=TB,xm=x+w/2;
 let s=label('直線',x+w*.25,y0+18,{size:28,color:CD,anchor:'middle',weight:700})+label('回転',x+w*.75,y0+18,{size:28,color:CD,anchor:'middle',weight:700})+line(x,y0+34,x+w,y0+34,{color:C.faint,w:2});
 const R=[
  ['位置',col(CR,'x'),'角度',col(C.E,'\\theta')],
  ['速度',VV,'角速度',WW],
  ['加速度',col(C.a,'a'),'角加速度',col(C.a,'\\alpha')],
  ['動かしにくさ',col(CM,'m'),'回しにくさ',col(CM,'I')],
  ['運動エネルギー',`\\tfrac12${col(CM,'m')}${VV}^2`,'運動エネルギー',`\\tfrac12${col(CM,'I')}${WW}^2`],
 ];
 R.forEach((r,i)=>{const gg=rows[i]??0;if(gg<=0)return;const yc=y0+40+rh*i+rh/2,nw=i>=3;
  let q=rect(x,yc-rh/2+5,w,rh-10,{fill:i===hl?CH:'#1a2742',fo:i===hl?.08:.5,stroke:i===hl?CH:nw?CK:C.faint,sw:i===hl?2.5:1.5,rx:12});
  q+=label(r[0],x+20,yc+9,{size:24,color:nw?C.ink:CD})+T(r[1],x+w*.25+70,yc+2,{size:nw?34:30,color:nw?C.ink:CD});
  q+=label('↔',xm,yc+10,{size:28,color:CD,anchor:'middle'});
  q+=label(r[2],xm+22,yc+9,{size:24,color:nw?C.ink:CD})+T(r[3],x+w*.75+80,yc+2,{size:nw?34:30,color:nw?C.ink:CD});
  s+=fade(gg,q);});
 return fade(g,s);
}

export const ytUmInertia1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const th=.35*Math.cos(2*Math.PI*1.1*p);
  let s=pend(th);
  s+=card(600,70,560,300,label('前回（単振動・中級）',880,120,{size:24,color:CD,anchor:'middle'})
   +fade(seg(p,.1,.25),T(`ml\\dfrac{d^2${col(C.E,'\\theta')}}{dt^2}=${col(CF,'-mg\\sin')}${col(C.E,'\\theta')}`,880,205,{size:38}))
   +fade(seg(p,.5,.65),T(`${col(C.t,'T')}=2\\pi\\sqrt{\\dfrac{${col(CR,'l')}}{g}}`,880,305,{size:44})),seg(p,0,.12));
  return s;
 },
 [K+'lastq']:(p)=>{
  const th=.3*Math.cos(2*Math.PI*1.0*p);
  let s=pend(th,{cx:240});
  const bx=240+300*Math.sin(th),by=70+300*Math.cos(th);
  s+=fade(seg(p,.05,.2),ring(bx,by,34,{color:CH,w:3,dash:'6 5'})+label('大きさのない 点',bx+44,by+8,{size:24,color:CH,weight:700}));
  s+=card(560,120,600,260,label('前回の 最後の 問い',860,170,{size:26,color:CD,anchor:'middle'})
   +label('広がった 物体の「回しにくさ」は',860,240,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.55,.7),label('質量の 位置で どう 決まる？',860,310,{size:32,color:CH,anchor:'middle',weight:700})),seg(p,.35,.5),CH);
  return s;
 },
 [K+'bat']:(p)=>{
  const sw=a0=>a0+1.3*seg(p,.25,.75);
  let s=L('長く 持つ',300,470,{size:28,color:CD})+L('短く 持つ',880,470,{size:28,color:CH,weight:700});
  s+=bat(160,260,sw(-.9),{hold:.06,len:400});
  s+=fade(seg(p,.1,.25),bat(760,260,sw(-.9),{hold:.3,len:400}));
  s+=fade(seg(p,.55,.7),card(420,30,360,110,L('質量は 同じ',600,78,{size:28})+L('なのに 振りやすい',600,118,{size:28,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(60,60,520,400,L('① つり合う 点 ＝ 重心',320,115,{size:30,weight:700}),seg(p,.3,.45),CH);
  s+=fade(seg(p,.3,.45),seesaw({s:3,x0:125,ppm:80,by:290,nl:0}));
  s+=card(620,60,520,400,L('② 回しにくさ',880,115,{size:30,weight:700}),seg(p,.6,.75),CW);
  s+=fade(seg(p,.6,.75),blob(.3+.8*seg(p,.6,1),{ax:700,ay:360,ppm:95,outline:1}));
  s+=fade(seg(p,0,.15)*(1-seg(p,.25,.35)),blob(.2+.3*p,{ax:420,ay:330,ppm:130})+label('小さな 質点の 集まり',800,200,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=fade(.35,seesaw({s:3,x0:125,ppm:80,by:330,nl:0})+blob(.4+.8*p,{ax:700,ay:400,ppm:90}));
  s+=card(170,50,860,250,L('今回の 問い',600,100,{size:26,color:CD})
   +L('重心は なぜ 重み付き平均？',600,170,{size:34,color:C.ink,weight:700})
   +fade(seg(p,.35,.5),L('回しにくさは なぜ 距離の 2乗？',600,240,{size:34,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },

 // ===== S2 重心は重み付き平均 =====
 [K+'pieces']:(p)=>{
  let s=blob(.2,{ax:180,ay:300,ppm:150,dots:seg(p,.1,.3)>0?1:0,outline:1});
  const q=BODY[17],x=180+150*(q[0]*Math.cos(.2)-q[1]*Math.sin(.2)),y=300-150*(q[0]*Math.sin(.2)+q[1]*Math.cos(.2));
  s+=fade(seg(p,.45,.6),dot(x,y,10,CH)+label('mᵢ',x+14,y-14,{size:28,color:CM,weight:700}));
  s+=card(740,120,420,220,L('i 番目',950,180,{size:28,color:CD})+L('質量 mᵢ、 位置 xᵢ',950,262,{size:32,weight:700}),seg(p,.5,.65));
  s+=fade(seg(p,.1,.3),label('細かく 切った 小さな 質点',180,60,{size:26,color:CD}));
  return s;
 },
 [K+'seesaw']:(p)=>{
  let s=seesaw({s:3,x0:220,ppm:150,by:250,ticks:[[0,'0'],[1,'1'],[2,'2'],[3,'3',CH],[4,'4']]});
  s+=fade(seg(p,.1,.25),label('初級',60,60,{size:26,color:CD}));
  s+=fade(seg(p,.5,.65),label('トルクの 和 ＝ 0',SX(3,220,150),110,{size:28,color:CW,anchor:'middle',weight:700})+highlight(SX(3,220,150)-40,375,80,70,1));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=fade(.45,seesaw({s:3,x0:70,ppm:85,by:380,nl:0}));
  s+=T(`\\sum_i m_i\\,g\\,(${XI}-${XG})=0`,800,80,{size:36,color:CD});
  s+=fade(seg(p,.25,.4),arrow(800,120,800,180,{color:CH,w:4,head:14})+label('x_G について 解く',825,160,{size:24,color:CH}));
  s+=fade(seg(p,.35,.5),T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,800,300,{size:50})+highlight(620,215,360,160,1));
  return s;
 },
 [K+'split']:(p)=>{
  const X=u=>250+160*u,y=330;
  let s=line(X(-.3),y+50,X(4.4),y+50,{color:CD,w:2});
  for(const u of [0,1,2,3,4])s+=line(X(u),y+43,X(u),y+57,{color:CD,w:2})+label(String(u),X(u),y+86,{size:22,color:CD,anchor:'middle'});
  s+=label('x (m)',X(4.4)+14,y+58,{size:22,color:CR});
  s+=rect(X(0)-25,y-50,50,50,{fill:CM,fo:.18,stroke:C.ink,sw:2,rx:6})+label('1 kg',X(0),y-17,{size:20,color:C.ink,anchor:'middle'});
  const sp=seg(p,.4,.8);
  s+=fade(1-sp,rect(X(4)-44,y-88,88,88,{fill:CM,fo:.18,stroke:C.ink,sw:2,rx:6})+label('3 kg',X(4),y-36,{size:22,color:C.ink,anchor:'middle'}));
  for(let k=0;k<3;k++)s+=fade(sp,rect(X(4)-25,y-50*(k+1)-2*k,50,50,{fill:CM,fo:.18,stroke:CH,sw:2,rx:6})+label('1 kg',X(4),y-50*k-2*k-17,{size:20,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),L('3 kg ＝ 1 kg × 3個',600,70,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'avg']:(p)=>{
  const X=u=>250+160*u,y=330;
  let s=line(X(-.3),y+50,X(4.4),y+50,{color:CD,w:2});
  for(const u of [0,1,2,3,4])s+=line(X(u),y+43,X(u),y+57,{color:CD,w:2})+label(String(u),X(u),y+86,{size:22,color:u===3?CH:CD,anchor:'middle'});
  s+=rect(X(0)-25,y-50,50,50,{fill:CM,fo:.18,stroke:C.ink,sw:2,rx:6})+label('1 kg',X(0),y-17,{size:20,color:C.ink,anchor:'middle'});
  for(let k=0;k<3;k++)s+=rect(X(4)-25,y-50*(k+1)-2*k,50,50,{fill:CM,fo:.18,stroke:CH,sw:2,rx:6})+label('1 kg',X(4),y-50*k-2*k-17,{size:20,color:C.ink,anchor:'middle'});
  s+=fade(seg(p,.1,.3),T(`\\dfrac{0+4+4+4}{4}=\\dfrac{12}{4}=3\\,\\mathrm{m}`,600,70,{size:40,color:CR}));
  s+=fade(seg(p,.55,.7),line(X(3),y-140,X(3),y+50,{color:CH,w:3,dash:'8 6'})+dot(X(3),y+50,8,CH)+label('重心',X(3),y-150,{size:26,color:CH,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),ok(X(3)+60,y-145));
  return s;
 },
 [K+'weight']:(p)=>{
  const X=u=>250+160*u,y=330;
  let s=line(X(-.3),y+50,X(4.4),y+50,{color:CD,w:2});
  for(const u of [0,1,2,3,4])s+=line(X(u),y+43,X(u),y+57,{color:CD,w:2})+label(String(u),X(u),y+86,{size:22,color:CD,anchor:'middle'});
  s+=rect(X(0)-25,y-50,50,50,{fill:CM,fo:.18,stroke:C.ink,sw:2,rx:6})+label('1回',X(0),y-17,{size:20,color:C.ink,anchor:'middle'});
  for(let k=0;k<3;k++)s+=rect(X(4)-25,y-50*(k+1)-2*k,50,50,{fill:CM,fo:.18,stroke:CH,sw:2,rx:6})+label(`${k+1}回`,X(4),y-50*k-2*k-17,{size:20,color:CH,anchor:'middle'});
  s+=line(X(3),y-140,X(3),y+50,{color:CH,w:3,dash:'8 6'})+dot(X(3),y+50,8,CH);
  s+=fade(seg(p,.05,.2),card(40,40,440,110,L('質量 ＝ 位置を 数える 回数',260,105,{size:28,color:CH,weight:700}),1,CH));
  s+=fade(seg(p,.5,.65),arrow(X(2),y-110,X(2.9),y-110,{color:CH,w:4,head:14})+label('重い 側へ 寄る',X(2.45),y-128,{size:26,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'vec']:(p)=>{
  const ox=150,oy=440,pp=85,P=(x,y)=>[ox+pp*x,oy-pp*y];
  let s=arrow(ox-10,oy,ox+pp*4.8,oy,{color:CD,w:2.5,head:14})+arrow(ox,oy+10,ox,oy-pp*4.3,{color:CD,w:2.5,head:14})+label('x',ox+pp*4.8+10,oy+8,{size:24,color:CR})+label('y',ox-10,oy-pp*4.3-6,{size:24,color:CR,anchor:'end'});
  const ms=[[0,0,'1 kg',18],[4,0,'1 kg',18],[2,3,'2 kg',25]];
  for(const [x,y,t,r] of ms){const [X,Y]=P(x,y);s+=dot(X,Y,r,'#8fa6cf')+label(t,X+r+6,Y-r+4,{size:22,color:C.ink});}
  const [gx,gy]=P(2,1.5);
  s+=fade(seg(p,.2,.35),line(gx,gy,gx,oy,{color:CR,w:2,dash:'6 6'})+label('x の 平均',gx,oy+34,{size:22,color:CR,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),line(gx,gy,ox,gy,{color:CR,w:2,dash:'6 6'})+label('y の 平均',ox-12,gy+8,{size:22,color:CR,anchor:'end'}));
  s+=fade(seg(p,.35,.5),dot(gx,gy,9,CH)+label('G',gx+14,gy+26,{size:26,color:CH,weight:700}));
  s+=card(640,110,520,220,L('成分ごとに 同じ 平均',900,165,{size:28,color:CD})
   +fade(seg(p,.55,.7),T(`${col(CR,'\\mathbf r_G')}=\\dfrac{\\sum_i m_i${col(CR,'\\mathbf r_i')}}{\\sum_i m_i}`,900,260,{size:46})),seg(p,.1,.25));
  return s;
 },
 [K+'theorem']:(p)=>{
  // left: a body with several external forces; right: all mass M at G with the total force
  let s=card(40,40,540,440,L('広がった 物体',310,90,{size:26,color:CD}),1);
  const cx=300,cy=290;
  s+=poly([[cx-150,cy-40],[cx-40,cy-110],[cx+120,cy-70],[cx+150,cy+40],[cx+20,cy+100],[cx-130,cy+70]],{fill:'#1b2946',fo:.9,stroke:CD,sw:2});
  s+=dot(cx,cy,8,CH)+label('G',cx+12,cy+28,{size:24,color:CH,weight:700});
  s+=arrow(cx-150,cy-40,cx-230,cy-100,{color:CF,w:5,head:14})+arrow(cx+150,cy+40,cx+240,cy+10,{color:CF,w:5,head:14})+arrow(cx+20,cy+100,cx+50,cy+170,{color:CF,w:5,head:14});
  s+=label('外力',cx-230,cy-110,{size:24,color:CF,anchor:'middle',weight:700});
  s+=card(620,40,540,440,L('全質量 M が 重心 1点に',890,90,{size:26,color:CD}),seg(p,.3,.45),CH);
  const gx=890,gy=280;
  s+=fade(seg(p,.35,.5),dot(gx,gy,26,'#8fa6cf')+label('M',gx,gy+9,{size:24,color:C.bg,anchor:'middle',weight:700}));
  // total force = sum of the three (screen): (-80,-60)+(90,-30)+(30,70) = (40,-20)
  s+=fade(seg(p,.55,.7),arrow(gx+26,gy-13,gx+26+2.2*40,gy-13-2.2*20,{color:CF,w:6,head:16})+label('外力の 合計',gx+130,gy-70,{size:24,color:CF,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),L('同じ 運動',890,420,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'theorem2']:(p)=>{
  let s=MAF(600,170,72);
  s+=fade(seg(p,.2,.35),L('重心の 加速度',430,290,{size:26,color:C.a})+L('外力の 合計',800,290,{size:26,color:CF}));
  s+=fade(seg(p,.5,.65),card(260,340,680,110,L('ここでは 結果として 使う（導き方は 上級）',600,405,{size:28,color:CD}),1));
  return s;
 },
 [K+'hammer']:(p)=>{
  const u=seg(p,.05,.95),X=t=>150+880*t,Y=t=>390-920*t*(1-t);
  let s=line(60,500,1140,500,{color:CD,w:3});
  s+=draw(Array.from({length:61},(_,i)=>[X(i/60),Y(i/60)]),u,{color:CH,w:3,dash:'8 7'});
  for(const t0 of [0,.25,.5,.75])if(u>t0+.02)s+=fade(.3,dumbbell(X(t0),Y(t0),-8*t0));
  s+=dumbbell(X(u),Y(u),-8*u);
  s+=fade(seg(p,.5,.65),label('重心は 放物線',X(.5),Y(.5)-70,{size:30,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'hammer2']:(p)=>{
  const X=t=>150+880*t,Y=t=>390-920*t*(1-t);
  let s=line(60,500,1140,500,{color:CD,w:3})+draw(Array.from({length:61},(_,i)=>[X(i/60),Y(i/60)]),1,{color:CH,w:3,dash:'8 7'});
  s+=dumbbell(X(.55),Y(.55),-4.4-2*p);
  s+=card(60,380,460,100,L('① 重心の 移動',290,440,{size:30,color:CH,weight:700}),seg(p,.05,.2),CH);
  s+=card(680,380,460,100,L('② 重心まわりの 回転',910,440,{size:30,color:CW,weight:700}),seg(p,.3,.45),CW);
  s+=fade(seg(p,.3,.45),turnArc(X(.55),Y(.55),125,.3,1.5,{color:CW}));
  s+=fade(seg(p,.7,.85),label('次は ②',1080,300,{size:28,color:CW,anchor:'middle',weight:700}));
  return s;
 },

 // ===== S3 回る物体の速さ =====
 [K+'top']:(p)=>{
  let s=blob(.1+1.2*seg(p,.15,1),{ax:330,ay:300,ppm:120});
  s+=label('上から 見た 図',30,40,{size:24,color:CD});
  s+=card(760,90,400,170,L('なめらかな 台',960,150,{size:26,color:CD})+L('軸を 固定して 水平に 回す',960,210,{size:28,color:CH,weight:700}),seg(p,.05,.2),CH);
  s+=fade(seg(p,.3,.45),turnArc(330,300,60,.3,2.2,{color:CW}));
  return s;
 },
 [K+'omega']:(p)=>{
  const a0=.1,ph=a0+.9*seg(p,.1,.7);
  let s=blob(ph,{ax:330,ay:300,ppm:120,hl:[[3,'',1],[21,'',1]]});
  s+=turnArc(330,300,70,a0,ph,{color:CW,g:seg(p,.2,.35)});
  s+=card(760,70,400,190,L('1秒あたりに 回る 角度',960,125,{size:26})+L('角速度 ω',960,185,{size:34,color:CW,weight:700})+L('単位 rad/s',960,235,{size:24,color:CD}),seg(p,.05,.2),CW);
  s+=fade(seg(p,.6,.75),card(760,290,400,110,L('どの 点も 同じ ω',960,355,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'vrw']:(p)=>{
  const ph=.5+.5*seg(p,0,1);
  let s=blob(ph,{ax:330,ay:300,ppm:120,hl:[[3,'rᵢ',1],[21,'',1]],varr:seg(p,.35,.5),vk:40});
  s+=card(760,60,400,130,L('円弧 ＝ 半径 × 角度',960,105,{size:26,color:CD})+T(`${VI}=${RI}${WW}`,960,160,{size:42}),seg(p,.05,.2),CV);
  s+=fade(seg(p,.6,.75),card(760,230,400,110,L('遠い 点ほど 速い',960,295,{size:30,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'two']:(p)=>{
  const ph=.25+.9*seg(p,.05,1);
  let s=rodBall(ph,{ax:110,ay:420,ppm:120,r:1,rTxt:'1 m',varr:seg(p,.55,.7),vTxt:'1 m/s'});
  s+=rodBall(ph,{ax:420,ay:420,ppm:120,r:2,rTxt:'2 m',varr:seg(p,.6,.75),vTxt:'2 m/s'});
  s+=card(820,60,340,100,T(`${WW}=1\\,\\mathrm{rad/s}`,990,112,{size:36}),seg(p,.2,.35),CW);
  s+=fade(seg(p,.55,.7),T(`1\\times1=1\\,\\mathrm{m/s}`,990,230,{size:32,color:CV})+T(`2\\times1=2\\,\\mathrm{m/s}`,990,300,{size:32,color:CV}));
  return s;
 },

 // ===== S4 距離の2乗と慣性モーメント =====
 [K+'kin']:(p)=>{
  let s=kbars([[1,'1 m','1 J',seg(p,.15,.35)],[4,'2 m','4 J',seg(p,.55,.75)]],{x:120,y:450,sc:80,gap:220,w:120});
  s+=T(`${KK}=\\tfrac12 m${VV}^2`,850,70,{size:42});
  s+=fade(seg(p,.15,.35),T(`\\tfrac12\\times2\\times1^2=1\\,\\mathrm J`,850,170,{size:34,color:CK}));
  s+=fade(seg(p,.55,.75),T(`\\tfrac12\\times2\\times2^2=4\\,\\mathrm J`,850,260,{size:34,color:CK}));
  return s;
 },
 [K+'twice']:(p)=>{
  let s=kbars([[1,'1 m','1 J'],[4,'2 m','4 J']],{x:120,y:450,sc:80,gap:220,w:120});
  s+=fade(seg(p,.05,.2),L('距離 2倍 → K 4倍',850,70,{size:32,color:CH,weight:700}));
  s+=fade(seg(p,.3,.45),T(`${KK}=\\tfrac12 m(${RR}${WW})^2`,850,170,{size:40}));
  s+=fade(seg(p,.5,.65),T(`=\\tfrac12 m\\,${col(CR,'r^2')}\\,${WW}^2`,850,270,{size:44}));
  s+=fade(seg(p,.7,.85),L('r が 2回 効く',850,370,{size:30,color:CH,weight:700}));
  return s;
 },
 [K+'each']:(p)=>{
  let s=T(`\\tfrac12 m_i${VI2}=\\tfrac12 m_i${RI2}${WW}^2`,600,80,{size:44});
  s+=fade(seg(p,.4,.55),L('全部の 質点について 足す',600,170,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.5,.7),T(`${KK}=\\tfrac12 m_1${col(CR,'r_1^2')}${WW}^2+\\tfrac12 m_2${col(CR,'r_2^2')}${WW}^2+\\cdots`,600,260,{size:40}));
  s+=fade(seg(p,.65,.8),T(`=\\sum_i\\tfrac12 m_i${RI2}${WW}^2`,600,380,{size:44}));
  return s;
 },
 [K+'factor']:(p)=>{
  let s=T(`${KK}=\\tfrac12 m_1${col(CR,'r_1^2')}{\\color{${CH}}{\\omega^2}}+\\tfrac12 m_2${col(CR,'r_2^2')}{\\color{${CH}}{\\omega^2}}+\\cdots`,600,90,{size:40});
  s+=fade(seg(p,.1,.25),L('ω は どの 質点も 同じ → 外へ',600,190,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.4,.55),T(`${KK}=\\tfrac12\\Big(\\sum_i m_i${RI2}\\Big)${WW}^2`,600,320,{size:54}));
  return s;
 },
 [K+'name']:(p)=>{
  let s=T(`${KK}=\\tfrac12\\Big(${col(CH,'\\sum_i m_ir_i^2')}\\Big)${WW}^2`,600,80,{size:44});
  s+=fade(seg(p,.1,.25),T(`I=\\sum_i m_i${RI2}`,380,230,{size:56})+L('慣性モーメント',380,320,{size:30,color:CH,weight:700}));
  s+=fade(seg(p,.4,.55),L('単位 kg·m²',380,380,{size:26,color:CD}));
  s+=fade(seg(p,.55,.7),card(700,180,420,150,T(`${KK}=\\tfrac12 I${WW}^2`,910,258,{size:56}),1,CK));
  return s;
 },
 [K+'work']:(p)=>{
  const ph1=.2+2.2*seg(p,.05,1);
  let s=rodBall(ph1,{ax:170,ay:300,ppm:100,r:1,m:'2 kg'});
  s+=rodBall(ph1,{ax:560,ay:300,ppm:100,r:2,m:'2 kg'});
  s+=label('I が 小さい',170,480,{size:24,color:C.ink,anchor:'middle'})+label('I が 大きい',560,480,{size:24,color:C.ink,anchor:'middle'});
  s+=card(820,60,340,150,L('止まった 物体を',990,115,{size:26})+L('ω まで 回す 仕事 ＝ K',990,170,{size:28,color:CK,weight:700}),seg(p,.05,.2),CK);
  s+=fade(seg(p,.5,.65),card(820,250,340,150,L('同じ ω でも',990,305,{size:26})+L('I が 大きいほど 多い',990,360,{size:28,color:CH,weight:700}),1,CH));
  return s;
 },
 [K+'ex']:(p)=>{
  const ph=.3+.8*seg(p,.3,1);
  let s=rodBall(ph,{ax:120,ay:440,ppm:115,r:3,rTxt:'3 m',m:'2 kg'});
  s+=card(700,40,460,110,L('回しにくさ ＝ I',930,105,{size:30,color:CH,weight:700}),seg(p,.02,.15),CH);
  s+=fade(seg(p,.45,.6),T(`I=2\\times${col(CR,'3')}^2=18${KGM2}`,930,250,{size:42}));
  return s;
 },
 [K+'quiz']:(p)=>{
  const r=mix(3,1.5,seg(p,.2,.55));
  let s=rodBall(.5,{ax:120,ay:440,ppm:115,r,len:3,rTxt:r<1.6?'1.5 m':'',m:'2 kg'});
  s+=T(`I=18${KGM2}`,930,90,{size:34,color:CD});
  s+=fade(seg(p,.2,.35),arrow(120+115*3*Math.cos(.5)+20,440-115*3*Math.sin(.5)+30,120+115*1.8*Math.cos(.5)+20,440-115*1.8*Math.sin(.5)+30,{color:CH,w:4,head:14}));
  s+=card(700,170,460,130,L('1.5 m に 近づけると',930,225,{size:28})+L('I は？',930,275,{size:32,color:CH,weight:700}),seg(p,.4,.55),CH);
  return s;
 },
 [K+'quizA']:(p)=>{
  let s=rodBall(.5,{ax:120,ay:440,ppm:115,r:1.5,len:3,rTxt:'1.5 m',m:'2 kg'});
  s+=T(`I=2\\times${col(CR,'1.5')}^2=4.5${KGM2}`,860,90,{size:40});
  s+=fade(seg(p,.35,.5),card(620,165,480,205,L('距離 半分',860,230,{size:28,color:CR})+T(`18\\times\\tfrac14=4.5`,860,300,{size:38})+L('I は 4分の1',860,345,{size:24,color:CH,weight:700}),1,CH));
  s+=fade(seg(p,.35,.5),ok(1110,105));
  return s;
 },

 // ===== S5 直線と回転の対応 =====
 [K+'table']:(p)=>table([seg(p,.1,.25),seg(p,.3,.45),seg(p,.5,.65),0,0]),
 [K+'table2']:(p)=>table([1,1,1,seg(p,.2,.35),seg(p,.55,.7)],{hl:p<.5?3:4}),
 [K+'axis']:(p)=>{
  let s=card(40,40,540,440,L('質量 m',310,95,{size:30,weight:700}),1);
  s+=dumbbell(310,280,.3*Math.sin(2*Math.PI*p),{sc:1.3});
  s+=L('物体 だけで 決まる',310,440,{size:26,color:CD});
  s+=card(620,40,540,440,L('慣性モーメント I',890,95,{size:30,weight:700}),seg(p,.2,.35),CH);
  const ph=1.2*seg(p,.3,1);
  // same rod (two balls), axis at the centre vs at one end
  const drawRod=(ax,ay,off,a)=>{const c=Math.cos(a),s2=Math.sin(a),P=u=>[ax+(u-off)*c,ay-(u-off)*s2];const [x1,y1]=P(0),[x2,y2]=P(200);return line(x1,y1,x2,y2,{color:WOOD,w:5})+dot(x1,y1,14,'#8fa6cf')+dot(x2,y2,14,'#8fa6cf')+axisMark(ax,ay,0);};
  s+=fade(seg(p,.3,.45),drawRod(760,260,100,ph)+drawRod(900,380,0,ph*.7));
  s+=fade(seg(p,.55,.7),L('軸の 位置と 質量の 並び方で 変わる',890,455,{size:26,color:CH,weight:700}));
  return s;
 },
 [K+'bat2']:(p)=>{
  let s=L('長く 持つ',300,480,{size:28,color:CD})+L('短く 持つ',880,480,{size:28,color:CH,weight:700});
  s+=bat(140,250,-.15,{hold:.06,len:420,braceR:seg(p,.1,.3),rTxt:'r'});
  s+=bat(740,250,-.15,{hold:.3,len:420,braceR:seg(p,.2,.4),rTxt:'r（短い）'});
  s+=fade(seg(p,.45,.6),card(380,330,440,110,T(`I=\\sum_i m_i${RI2}\\ \\downarrow`,600,388,{size:40}),1,CH));
  return s;
 },

 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(60,60,520,400,L('重心',320,115,{size:32,color:CH,weight:700})+T(`${col(CR,'\\mathbf r_G')}=\\dfrac{\\sum_i m_i${col(CR,'\\mathbf r_i')}}{\\sum_i m_i}`,320,215,{size:40})+L('質量で 重みを 付けた 平均',320,300,{size:24})+fade(seg(p,.4,.55),MAF(320,385,36)),seg(p,.05,.2),CH);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(60,60,520,400,L('重心',320,115,{size:32,color:CH,weight:700})+T(`${col(CR,'\\mathbf r_G')}=\\dfrac{\\sum_i m_i${col(CR,'\\mathbf r_i')}}{\\sum_i m_i}`,320,215,{size:40})+L('質量で 重みを 付けた 平均',320,300,{size:24})+MAF(320,385,36),1,CH);
  s+=card(620,60,520,400,L('回しにくさ',880,115,{size:32,color:CW,weight:700})
   +T(`${VV}=${RR}${WW}`,880,185,{size:36})
   +fade(seg(p,.35,.5),T(`I=\\sum_i m_i${RI2}`,880,275,{size:42}))
   +fade(seg(p,.6,.75),T(`${KK}=\\tfrac12 I${WW}^2`,880,375,{size:42})),seg(p,.05,.2),CW);
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  const xs=[0,1,2,3,4,5,6,7];
  for(const i of xs)s+=dot(160+60*i,200,14,'#8fa6cf');
  s+=L('質点の 集まり → Σ で 足す',370,110,{size:28,color:C.ink});
  s+=fade(seg(p,.4,.55),rect(700,185,420,30,{fill:WOOD,fo:.85,stroke:'#8a6f4c',rx:6})+L('切れ目の ない 棒',910,110,{size:28,color:CH,weight:700}));
  s+=fade(seg(p,.55,.7),label('？',910,320,{size:80,color:CH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=rect(200,150,800,34,{fill:WOOD,fo:.85,stroke:'#8a6f4c',rx:6})+axisMark(200,167,0);
  const n=Math.round(mix(4,24,seg(p,.1,.7)));
  for(let k=1;k<n;k++)s+=line(200+800*k/n,142,200+800*k/n,192,{color:C.bg,w:2});
  s+=card(250,240,700,210,T(`I=\\sum_i m_i${RI2}\\ \\ \\to\\ \\ ?`,600,315,{size:44})+L('Σ を どう 書き直す？',600,415,{size:30,color:CH,weight:700}),seg(p,.1,.25),CH);
  return s;
 },
};
const SX=(u,x0=250,ppm=150)=>x0+ppm*u;
