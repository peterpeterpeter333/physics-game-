// YouTube シリーズ「内積・初級 1/3」(ys-ui-effective-component-1) — 図。Stage 1200×515.
// 色：力 F 緑(C.F)、進む向きの成分 黄(C.hi)、直角な成分 桃(C.p)、距離 L 水色(C.x)、仕事 W 橙(C.E)、角度 θ 白。
// 共通の部品（箱・力の矢印・成分・影・角度）は export して 2/3・3/3 でも使う（関数の export は図の登録に入らない）。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,ground,tex,texWidth} from './anim.mjs';

const K='ui-effective-component-1:';
export const FC=C.F,AL=C.hi,PP=C.p,LC=C.x,WC=C.E,TC=C.ink;
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const cross=(x,y,sz=16,color=C.a)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
export const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const rad=d=>d*Math.PI/180;
// a box standing on the floor at height fy; right face at x = bx. Returns svg; tail of the force = (bx, fy-h/2).
export function box(bx,fy,{w=130,h=100}={}){return rect(bx-w,fy-h,w,h,{fill:'#7a5a3c',fo:.55,stroke:'#c9a27a',sw:3,rx:6});}
export function floor(x1,x2,fy,{slick=false}={}){
 let s=ground(x1,x2,fy);
 if(slick)s+=label('つるつる（摩擦なし）',x2,fy+44,{size:22,color:C.dim,anchor:'end'});
 return s;
}
// force arrow of N newtons at angle deg (0 = right, 90 = up), scale sc px per newton
export const tip=(tx,ty,deg,N,sc)=>[tx+N*sc*Math.cos(rad(deg)),ty-N*sc*Math.sin(rad(deg))];
export function force(tx,ty,deg,N,sc,{g=1,color=FC,w=7,text='',tsize=26,tdx=12,tdy=-8}={}){
 const [X,Y]=tip(tx,ty,deg,N,sc);return arrow(tx,ty,X,Y,{color,w,g,head:22,text,tsize,tdx,tdy});
}
// components: along (yellow, horizontal) then perpendicular (pink, vertical) — tip-to-tail
export function comps(tx,ty,deg,N,sc,{ga=1,gp=1,la='',lp='',w=6,lsize=26}={}){
 const ax=N*sc*Math.cos(rad(deg)),py=N*sc*Math.sin(rad(deg));let s='';
 if(Math.abs(ax)>2)s+=arrow(tx,ty,tx+ax,ty,{color:AL,w,g:ga,head:18});
 if(py>2)s+=arrow(tx+ax,ty,tx+ax,ty-py,{color:PP,w,g:gp,head:18});
 if(la)s+=fade(ga,label(la,tx+ax/2,ty+38,{size:lsize,color:AL,anchor:'middle',weight:700}));
 if(lp)s+=fade(gp,label(lp,tx+ax+14,ty-py/2+8,{size:lsize,color:PP,weight:700}));
 return s;
}
// angle arc at the tail from 0 to deg
export function angArc(tx,ty,deg,{r=52,g=1,text='θ',color=TC}={}){
 if(deg<1)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=rad(deg*i/30);return [tx+r*Math.cos(a),ty-r*Math.sin(a)];});
 const m=rad(deg/2);
 return fade(g,draw(pts,1,{color,w:3})+(text?label(text,tx+(r+22)*Math.cos(m),ty-(r+22)*Math.sin(m)+9,{size:26,color,anchor:'middle',weight:700}):''));
}
// light from straight above and the shadow of the force arrow on the floor at fy
export function shadow(tx,ty,deg,N,sc,fy,{gl=1,gs=1,rays=true,text=''}={}){
 const [X,Y]=tip(tx,ty,deg,N,sc);let s='';
 if(rays)s+=fade(gl,line(X,Y+4,X,fy,{color:C.hi,w:2,dash:'6 6',opacity:.8})+line(tx,ty+4,tx,fy,{color:C.hi,w:2,dash:'6 6',opacity:.8}));
 if(Math.abs(X-tx)>2)s+=fade(gs,line(tx,fy,X,fy,{color:AL,w:12,cap:'butt'}));
 else s+=fade(gs,dot(tx,fy,7,AL));
 if(text)s+=fade(gs,label(text,(tx+X)/2,fy+44,{size:26,color:AL,anchor:'middle',weight:700}));
 return s;
}
export function lamp(x1,x2,y,{g=1,text='真上からの光'}={}){
 let s='';for(let x=x1;x<=x2;x+=60)s+=arrow(x,y,x,y+34,{color:C.hi,w:3,head:10,opacity:.8});
 return fade(g,line(x1-20,y-8,x2+20,y-8,{color:C.hi,w:3,opacity:.6})+s+(text?label(text,x2+34,y+22,{size:24,color:C.hi}):''));
}
// distance arrow under the floor
export function dist(x1,x2,fy,{g=1,text='L ＝ 2 m'}={}){
 return fade(g,line(x1,fy+26,x1,fy+50,{color:LC,w:2})+arrow(x1,fy+38,x2,fy+38,{color:LC,w:4,head:14})+label(text,(x1+x2)/2,fy+76,{size:26,color:LC,anchor:'middle',weight:700}));
}

// ---- local pictures ----------------------------------------------------------------------
const FY=420,SC=17;
function scene(bx,deg,{g=1,fN='10 N',slick=false,x1=60,x2=640}={}){
 const ty=FY-50;
 return floor(x1,x2,FY,{slick})+box(bx,FY)+force(bx,ty,deg,10,SC,{g,text:fN});
}
function mini(cx,fy,deg,title,{val='仕事 ？ J',vc=WC,g=1}={}){
 const bx=cx+10,ty=fy-35;
 return fade(g,ground(cx-150,cx+150,fy)+box(bx,fy,{w:90,h:70})+force(bx,ty,deg,10,11,{w:6})
  +label(title,cx,fy-170,{size:28,color:C.ink,anchor:'middle',weight:700})+label(val,cx,fy+60,{size:28,color:vc,anchor:'middle',weight:700}));
}
function sumRows(k,g=1){
 const rows=[
  ['右へ引く','W ＝ 10 × 2 ＝ 20 J',WC,0],
  ['真上に引く','W ＝ 0 J',WC,90],
  ['斜めに引く','10 N ＝ 右 6 N ＋ 上 8 N',FC,53.13],
 ];
 let s='';
 rows.forEach(([a,b,c,deg],i)=>{const y=120+i*125;if(i>=k)return;let r='';
  r+=ground(90,330,y+60)+box(200,y+60,{w:70,h:54})+force(200,y+33,deg,10,8,{w:5});
  if(i===2)r+=comps(200,y+33,deg,10,8,{w:4});
  r+=label(a,380,y+20,{size:28,color:C.dim})+label(b,380,y+68,{size:34,color:c,weight:700});
  s+=fade(i===k-1?g:1,r);
 });
 return s;
}

export const ytUiEffComp1Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  // a straight road (dashed) and a slanted field arrow split along / across the road
  const x0=150,y0=400,dx=Math.cos(rad(20)),dy=-Math.sin(rad(20));
  let s=label('前回',60,60,{size:24,color:C.dim});
  s+=line(x0-60*dx,y0-60*dy,x0+520*dx,y0+520*dy,{color:C.dim,w:4,dash:'12 10'})+label('道',x0+530*dx,y0+520*dy+10,{size:24,color:C.dim});
  const px=x0+200*dx,py=y0+200*dy,ang=rad(20+50),L=190;
  const Ex=px+L*Math.cos(ang),Ey=py-L*Math.sin(ang),al=L*Math.cos(rad(50)),ax=px+al*dx,ay=py+al*dy;
  s+=arrow(px,py,Ex,Ey,{color:C.x,w:6,g:seg(p,.05,.25),text:'電場 E',tsize:26});
  s+=fade(seg(p,.3,.5),arrow(px,py,ax,ay,{color:AL,w:7,head:18})+line(ax,ay,Ex,Ey,{color:PP,w:3,dash:'6 6'})+label('道に沿う成分',ax+10,ay+44,{size:24,color:AL,weight:700})+label('直角な成分',(ax+Ex)/2+14,(ay+Ey)/2,{size:24,color:PP}));
  s+=card(700,110,450,230,label('足したのは',925,170,{size:28,color:C.dim,anchor:'middle'})+label('道に沿う成分 だけ',925,235,{size:34,color:AL,anchor:'middle',weight:700})+label('直角な成分は 効かない？',925,300,{size:28,color:PP,anchor:'middle'}),seg(p,.55,.7));
  return s;
 },
 [K+'claim']:(p)=>{
  let s=card(170,70,860,130,label('「進む向きの成分だけが効く」',600,130,{size:36,color:AL,anchor:'middle',weight:700})+label('本当？',600,180,{size:28,color:C.ink,anchor:'middle'}),seg(p,0,.15),AL);
  s+=fade(seg(p,.45,.6),floor(300,900,470,{})+box(560,470)+force(560,420,40,10,12,{text:'箱を引く力'}));
  return s;
 },
 [K+'setup']:(p)=>{
  const u=seg(p,.35,.8),bx=mix(260,460,u);
  let s=floor(60,700,FY,{slick:true})+(u>0?fade(.35,box(260,FY)):'')+box(bx,FY)+force(bx,FY-50,0,10,SC,{text:'10 N',g:seg(p,.05,.2)});
  s+=dist(260,460,FY,{g:seg(p,.75,.9)});
  s+=card(760,110,400,250,label('力の大きさ 10 N',960,175,{size:30,color:FC,anchor:'middle',weight:700})+label('右へ 2 m 動かす',960,235,{size:30,color:LC,anchor:'middle',weight:700})+label('上下には 動かない',960,300,{size:26,color:C.dim,anchor:'middle'}),seg(p,.15,.3));
  return s;
 },
 [K+'arrowmean']:(p)=>{
  let s=floor(60,700,FY)+box(260,FY)+force(260,FY-50,35,10,SC,{text:'10 N'});
  const [X,Y]=tip(260,FY-50,35,10,SC);
  s+=fade(seg(p,.05,.2),label('長さ ＝ 力の大きさ',(260+X)/2+30,(FY-50+Y)/2+40,{size:24,color:FC})+label('向き ＝ 引く向き',X+20,Y-50,{size:24,color:C.ink}));
  // 1 kg weight held up by 10 N
  const wx=960,wy=330;
  s+=fade(seg(p,.5,.65),rect(wx-60,wy,120,90,{fill:C.dim,fo:.35,stroke:C.dim,rx:8})+label('1 kg',wx,wy+55,{size:28,color:C.ink,anchor:'middle',weight:700})
   +arrow(wx,wy,wx,wy-150,{color:FC,w:6,head:18,text:'約 10 N',tsize:26,tdx:14,tdy:30})+label('1 kg の物を 支える力',wx,wy+130,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'question']:(p)=>{
  const deg=90*(.5-.5*Math.cos(Math.PI*2*clamp(p/.9)));
  let s=scene(330,deg)+angArc(330,FY-50,deg,{text:''});
  s+=card(720,110,440,260,label('大きさ：10 N のまま',940,175,{size:28,color:FC,anchor:'middle'})+label('向き：変える',940,230,{size:28,color:C.ink,anchor:'middle'})+label('仕事は 変わる？',940,310,{size:36,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25),WC);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=mini(200,380,0,'真横',{g:seg(p,0,.15)})+mini(600,380,53.13,'斜め',{g:seg(p,.1,.25)})+mini(1000,380,90,'真上',{g:seg(p,.2,.35)});
  s+=fade(seg(p,.55,.7),label('予想してみよう：同じ 10 N なら 同じ？',600,70,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S2 向きが揃うとき =====
 [K+'along']:(p)=>{
  let s=scene(330,0,{g:seg(p,0,.2)});
  s+=fade(seg(p,.3,.45),label('力の向き',345,345,{size:26,color:FC,weight:700}));
  s+=fade(seg(p,.5,.65),arrow(200,230,420,230,{color:LC,w:4,head:14})+label('箱の進む向き',430,238,{size:26,color:LC,weight:700}));
  s+=card(760,140,400,180,label('向きが 揃っている',960,215,{size:32,color:C.ink,anchor:'middle',weight:700})+check(960,270,20),seg(p,.7,.85));
  return s;
 },
 [K+'def']:(p)=>{
  const u=seg(p,.05,.4),bx=mix(200,400,u);
  let s=floor(40,660,FY,{slick:false})+fade(.35,box(200,FY))+box(bx,FY)+force(bx,FY-50,0,10,SC,{text:'F'})+dist(200,400,FY,{g:seg(p,.3,.45),text:'L'});
  s+=card(700,70,460,360,
   tex(`${cs(WC,'W')}=${cs(FC,'F')}\\,${cs(LC,'L')}`,930,150,{size:64,auto:false})
   +fade(seg(p,.35,.5),label('W：仕事 [J]',790,240,{size:28,color:WC}))
   +fade(seg(p,.45,.6),label('F：力の大きさ [N]',790,295,{size:28,color:FC}))
   +fade(seg(p,.55,.7),label('L：進んだ距離 [m]',790,350,{size:28,color:LC}))
   +fade(seg(p,.75,.9),label('向きが揃うときの 定義',930,405,{size:24,color:C.hi,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'why']:(p)=>{
  // area picture: work grows with F and with L
  const row=(y,Fv,Lv,W,g,fc,lc)=>fade(g,label(`${Fv} N`,110,y,{size:30,color:fc,weight:700})+label('×',215,y,{size:30,color:C.dim})+label(`${Lv} m`,250,y,{size:30,color:lc,weight:700})
   +label('→',360,y,{size:30,color:C.dim})+rect(410,y-30,W*9,36,{fill:WC,fo:.45,stroke:WC})+label(`${W} J`,420+W*9,y,{size:30,color:WC,weight:700}));
  let s=label('仕事',410,70,{size:26,color:WC});
  s+=row(140,10,2,20,seg(p,0,.12),C.ink,C.ink);
  s+=row(250,20,2,40,seg(p,.12,.3),FC,C.ink)+fade(seg(p,.2,.32),label('力 2倍 → 仕事 2倍',880,250,{size:28,color:FC,weight:700}));
  s+=row(360,10,4,40,seg(p,.3,.48),C.ink,LC)+fade(seg(p,.38,.5),label('距離 2倍 → 仕事 2倍',880,360,{size:28,color:LC,weight:700}));
  s+=fade(seg(p,.7,.85),card(380,410,440,90,label('両方に 比例 → 掛け算',600,467,{size:32,color:C.hi,anchor:'middle',weight:700}),1,C.hi));
  return s;
 },
 [K+'calc20']:(p)=>{
  let s=tex(`${cs(WC,'W')}=${cs(FC,'10\\,\\mathrm{N}')}\\times${cs(LC,'2\\,\\mathrm{m}')}`,600,120,{size:56,auto:false});
  s+=fade(seg(p,.3,.45),tex(`=${cs(WC,'20\\,\\mathrm{N\\cdot m}')}`,600,230,{size:56,auto:false}));
  s+=fade(seg(p,.6,.75),tex(`=${cs(WC,'20\\,\\mathrm{J}')}`,600,340,{size:64,auto:false})+highlight(470,290,260,84,1,WC));
  s+=fade(seg(p,.7,.85),label('N·m の 別名が J（ジュール）',600,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'joule']:(p)=>{
  // 10 N × 2 m as a 10 × 2 grid of 1 J cells
  const x0=160,y0=440,cw=34,ch=34;let s='';
  const n=Math.floor(20*seg(p,.35,.85)+1e-9);
  for(let i=0;i<20;i++){const c=i%2,r=Math.floor(i/2);const on=i<n;
   s+=rect(x0+c*cw*3,y0-(r+1)*ch,cw*3,ch,{fill:WC,fo:on?.45:.06,stroke:on?WC:C.faint,sw:1.5,rx:2});}
  s+=label('力 10 N',x0-16,y0-170,{size:26,color:FC,anchor:'end'})+label('距離 2 m',x0+cw*3,y0+40,{size:26,color:LC,anchor:'middle'});
  s+=card(620,90,540,160,tex(`${cs(FC,'1\\,\\mathrm{N}')}\\times${cs(LC,'1\\,\\mathrm{m}')}=${cs(WC,'1\\,\\mathrm{J}')}`,890,170,{size:50,auto:false}),seg(p,0,.2));
  s+=fade(seg(p,.8,.92),label(`1 J が ${Math.max(n,0)} 個分 ＝ 20 J`,890,330,{size:34,color:WC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz5']:(p)=>{
  let s=floor(40,700,FY,{slick:false})+box(200,FY)+force(200,FY-50,0,10,SC,{text:'10 N'})+dist(200,700,FY,{text:'5 m'});
  s+=card(760,120,400,200,label('仕事 W は？',960,195,{size:36,color:WC,anchor:'middle',weight:700})+label('考えてみよう',960,260,{size:26,color:C.hi,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'ans5']:(p)=>{
  let s=floor(40,700,FY,{slick:false})+box(200,FY)+force(200,FY-50,0,10,SC,{text:'10 N'})+dist(200,700,FY,{text:'5 m'});
  s+=card(760,90,400,300,tex(`${cs(WC,'W')}=${cs(FC,'10')}\\times${cs(LC,'5')}=${cs(WC,'50\\,\\mathrm{J}')}`,960,170,{size:44,auto:false})
   +fade(seg(p,.4,.55),label('距離 2 m → 5 m（2.5倍）',960,260,{size:26,color:LC,anchor:'middle'})+label('仕事 20 J → 50 J（2.5倍）',960,315,{size:26,color:WC,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'energy']:(p)=>{
  let s=floor(40,700,FY,{slick:false})+box(200,FY)+force(200,FY-50,0,10,SC,{text:'10 N'})+dist(200,700,FY,{text:'5 m'});
  s+=card(760,90,400,300,tex(`${cs(WC,'W')}=${cs(FC,'10')}\\times${cs(LC,'5')}=${cs(WC,'50\\,\\mathrm{J}')}`,960,170,{size:44,auto:false})
   +fade(seg(p,.1,.25),label('仕事の分だけ',960,250,{size:28,color:C.ink,anchor:'middle'})+label('エネルギーを 渡す',960,295,{size:30,color:WC,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('詳しくは「仕事」の単元',960,355,{size:24,color:C.dim,anchor:'middle'})));
  return s;
 },
 // ===== S3 真上に引く =====
 [K+'up']:(p)=>{
  const u=seg(p,.5,.9),bx=mix(260,460,u);
  let s=floor(60,700,FY,{slick:true})+(u>0?fade(.35,box(260,FY)):'')+box(bx,FY)+force(bx,FY-50,90,10,SC,{text:'10 N',g:seg(p,.02,.18)});
  s+=fade(seg(p,.45,.6),arrow(bx-110,FY-125,bx-30,FY-125,{color:C.v,w:4,head:14})+label('すべる',bx-120,FY-117,{size:24,color:C.v,anchor:'end'}));
  s+=card(760,110,400,220,label('重いので 浮かない',960,180,{size:28,color:C.ink,anchor:'middle'})+label('床を すべって',960,240,{size:28,color:C.ink,anchor:'middle'})+label('右へ 2 m 進む',960,290,{size:28,color:LC,anchor:'middle',weight:700}),seg(p,.15,.3));
  s+=dist(260,460,FY,{g:seg(p,.85,.97)});
  return s;
 },
 [K+'nochange']:(p)=>{
  const lane=(fy,pull,t)=>{const bx=mix(300,640,smooth(clamp((p-.1)/.75)));
   return ground(120,900,fy)+box(bx,fy,{w:110,h:80})+(pull?force(bx,fy-40,90,10,9,{w:6,text:'10 N',tsize:22}):'')+arrow(bx-100,fy-100,bx-30,fy-100,{color:C.v,w:4,head:12})
    +label(t,130,fy-120,{size:26,color:pull?FC:C.dim});};
  let s=lane(230,true,'真上に引く')+lane(470,false,'引かない');
  s+=line(mix(300,640,smooth(clamp((p-.1)/.75))),120,mix(300,640,smooth(clamp((p-.1)/.75))),480,{color:C.hi,w:2,dash:'6 6'});
  s+=card(930,160,240,200,label('右への',1050,230,{size:28,color:C.ink,anchor:'middle'})+label('進み方は',1050,275,{size:28,color:C.ink,anchor:'middle'})+label('同じ',1050,330,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.6,.75),C.hi);
  return s;
 },
 [K+'zero']:(p)=>{
  let s=floor(60,700,FY,{slick:false})+fade(.35,box(260,FY))+box(460,FY)+force(460,FY-50,90,10,SC,{text:'10 N'})+dist(260,460,FY);
  s+=card(740,100,420,280,label('右へ進ませる 働き：なし',950,165,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.15,.3),tex(`${cs(WC,'W')}=${cs(WC,'0\\,\\mathrm{J}')}`,950,250,{size:60,auto:false}))
   +fade(seg(p,.6,.75),label('力は 10 N あるのに',950,340,{size:28,color:FC,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'friction']:(p)=>{
  let s=ground(60,700,FY)+box(460,FY)+force(460,FY-50,90,10,SC,{text:'10 N'});
  for(let x=340;x<460;x+=16)s+=line(x,FY,x+8,FY-6,{color:C.a,w:2});
  s+=fade(seg(p,.05,.2),label('ざらざらの床',80,FY+44,{size:24,color:C.a}));
  s+=card(740,100,420,300,label('摩擦が あると',950,160,{size:30,color:C.a,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('上に引く → 床を押す力 減る',950,230,{size:24,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.55,.7),label('→ 摩擦も 減る',950,280,{size:26,color:C.ink,anchor:'middle'})+label('話が 変わる',950,345,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.15),C.a);
  return s;
 },
 [K+'onlypull']:(p)=>{
  let s=floor(60,700,FY,{slick:true})+fade(.35,box(260,FY))+box(460,FY)+force(460,FY-50,90,10,SC,{text:'10 N'})+dist(260,460,FY);
  s+=card(740,120,420,240,label('今回は',950,180,{size:26,color:C.dim,anchor:'middle'})+label('つるつるの床',950,235,{size:32,color:C.ink,anchor:'middle',weight:700})+label('引く力の 仕事だけ',950,300,{size:30,color:FC,anchor:'middle',weight:700}),seg(p,0,.15));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=floor(60,700,FY,{slick:false})+fade(.35,box(260,FY))+box(460,FY)+force(460,FY-50,90,10,SC,{text:'10 N'})+dist(260,460,FY);
  s+=card(740,100,420,280,tex(`10\\times2=20\\,\\mathrm{J}`,950,180,{size:48,auto:false})
   +fade(seg(p,.2,.35),line(790,175,1110,175,{color:C.a,w:5})+cross(1130,140,14))
   +fade(seg(p,.4,.55),label('右へ進ませていない力',950,280,{size:28,color:C.a,anchor:'middle',weight:700})+label('まで 数えている',950,325,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'compare']:(p)=>{
  let s=mini(300,330,0,'右へ引く',{val:'',g:seg(p,0,.15)})+mini(850,330,90,'真上に引く',{val:'',g:seg(p,.1,.25)});
  s+=fade(seg(p,.2,.4),rect(200,420,200*seg(p,.2,.4),34,{fill:WC,fo:.5,stroke:WC})+label('20 J',420,446,{size:30,color:WC,weight:700}));
  s+=fade(seg(p,.35,.5),dot(760,437,7,WC)+label('0 J',780,446,{size:30,color:WC,weight:700}));
  s+=fade(seg(p,.6,.75),label('大きさ 10 N・距離 2 m は 同じ ／ 違うのは 向きだけ',600,60,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 斜めの矢印を分ける =====
 [K+'slant']:(p)=>{
  let s=scene(330,53.13,{g:seg(p,.05,.3)})+angArc(330,FY-50,53.13,{g:seg(p,.3,.45)});
  s+=card(760,120,400,200,label('斜めに 引くと？',960,195,{size:34,color:C.ink,anchor:'middle',weight:700})+label('右へも 上へも 少しずつ',960,255,{size:26,color:C.dim,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'rotate']:(p)=>{
  const deg=90*(.5-.5*Math.cos(Math.PI*2*clamp((p-.1)/.85))),tx=330,ty=FY-50;
  let s=floor(60,700,FY,{slick:false})+box(tx,FY);
  s+=fade(seg(p,.05,.2),draw(Array.from({length:61},(_,i)=>{const a=rad(95*i/60-2);return [tx+170*Math.cos(a),ty-170*Math.sin(a)];}),1,{color:C.faint,w:2,dash:'8 8'}));
  s+=force(tx,ty,deg,10,SC,{text:'10 N'})+angArc(tx,ty,deg,{text:''});
  s+=card(760,110,400,220,label('大きさ：10 N に 固定',960,180,{size:28,color:FC,anchor:'middle',weight:700})+label('向き：回す',960,240,{size:28,color:C.ink,anchor:'middle'})+label('先は 半径 10 の円の上',960,295,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'reach']:(p)=>{
  const deg=90*(.5-.5*Math.cos(Math.PI*2*clamp(p/.9))),tx=330,ty=FY-50,[X]=tip(tx,ty,deg,10,SC);
  let s=floor(60,700,FY,{slick:false})+box(tx,FY);
  s+=draw(Array.from({length:61},(_,i)=>{const a=rad(95*i/60-2);return [tx+170*Math.cos(a),ty-170*Math.sin(a)];}),1,{color:C.faint,w:2,dash:'8 8'});
  s+=line(X,tip(tx,ty,deg,10,SC)[1],X,ty,{color:C.dim,w:2,dash:'5 5'})+line(tx,ty,X,ty,{color:AL,w:8,cap:'butt'});
  s+=force(tx,ty,deg,10,SC,{text:'10 N'})+angArc(tx,ty,deg,{text:''});
  s+=card(760,110,400,220,label('右への 伸び',960,180,{size:32,color:AL,anchor:'middle',weight:700})+label('右向きに近い → 長い',960,240,{size:26,color:C.ink,anchor:'middle'})+label('真上に近い → 短い',960,290,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'ends']:(p)=>{
  const tx=330,ty=FY-50,g2=seg(p,.45,.6);
  let s=floor(60,700,FY)+box(tx,FY);
  s+=draw(Array.from({length:61},(_,i)=>{const a=rad(95*i/60-2);return [tx+170*Math.cos(a),ty-170*Math.sin(a)];}),1,{color:C.faint,w:2,dash:'8 8'});
  s+=fade(1-g2*.7,force(tx,ty,0,10,SC,{text:'真横'}))+fade(g2,force(tx,ty,90,10,SC,{text:'真上'}));
  s+=card(760,110,400,240,label('真横：右 10，上 0',960,190,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(g2,label('真上：右 0，上 10',960,270,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'split']:(p)=>{
  const tx=330,ty=FY-50,deg=53.13;
  let s=scene(tx,deg)+angArc(tx,ty,deg);
  s+=comps(tx,ty,deg,10,SC,{ga:seg(p,.3,.5),gp:seg(p,.5,.7)});
  s+=card(760,120,400,200,label('横の矢印 ＋ 縦の矢印',960,195,{size:30,color:C.ink,anchor:'middle',weight:700})+label('の 継ぎ足し',960,250,{size:28,color:C.dim,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'comp68']:(p)=>{
  const tx=330,ty=FY-50,deg=53.13;
  let s=scene(tx,deg)+angArc(tx,ty,deg)+comps(tx,ty,deg,10,SC,{la:'右 6 N',lp:'上 8 N'});
  s+=card(760,120,400,220,tex(`${cs(FC,'\\mathbf{F}')}=(${cs(AL,'6')},\\,${cs(PP,'8')})\\ \\mathrm{N}`,960,215,{size:48,auto:false})
   +label('（右向き，上向き）',960,290,{size:24,color:C.dim,anchor:'middle'}),seg(p,.5,.65));
  return s;
 },
 [K+'pyth']:(p)=>{
  const tx=330,ty=FY-50,deg=53.13;
  let s=scene(tx,deg,{fN:''})+comps(tx,ty,deg,10,SC,{la:'6',lp:'8'});
  const [X,Y]=tip(tx,ty,deg,10,SC);
  s+=label('10',(tx+X)/2-40,(ty+Y)/2,{size:28,color:FC,anchor:'end',weight:700});
  s+=fade(seg(p,.05,.2),rect(X-24,ty-24,24,24,{fill:'none',fo:0,stroke:C.dim,sw:2,rx:0}));
  s+=card(700,90,460,330,tex(`${cs(AL,'6')}^2+${cs(PP,'8')}^2`,930,160,{size:50,auto:false})
   +fade(seg(p,.35,.5),tex(`=${cs(AL,'36')}+${cs(PP,'64')}`,930,240,{size:50,auto:false}))
   +fade(seg(p,.5,.65),tex(`=100=${cs(FC,'10')}^2`,930,320,{size:50,auto:false}))
   +fade(seg(p,.72,.87),check(1110,385,18)),seg(p,.15,.3));
  return s;
 },
 [K+'not14']:(p)=>{
  const tx=330,ty=FY-50,deg=53.13;
  let s=scene(tx,deg,{fN:'10 N'})+comps(tx,ty,deg,10,SC,{la:'6 N',lp:'8 N'});
  s+=card(700,90,460,330,tex(`${cs(AL,'6')}+${cs(PP,'8')}=14`,930,170,{size:54,auto:false})
   +fade(seg(p,.2,.35),label('≠ 10',930,245,{size:36,color:C.a,anchor:'middle',weight:700})+cross(1115,165,14))
   +fade(seg(p,.5,.65),label('矢印の足し算 ＝ 継ぎ足し',930,330,{size:30,color:C.hi,anchor:'middle',weight:700})+label('（数の足し算ではない）',930,380,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.15));
  return s;
 },
 [K+'same']:(p)=>{
  const one=(cx,split)=>{const bx=cx+40,ty=400-40;let s=ground(cx-200,cx+230,400)+box(bx,400,{w:110,h:80});
   if(split)s+=force(bx,ty,0,6,14,{color:AL,text:'6 N',tdy:30})+force(bx,ty,90,8,14,{color:PP,text:'8 N',tdx:16,tdy:24});
   else s+=force(bx,ty,53.13,10,14,{text:'10 N'});return s;};
  let s=fade(seg(p,0,.15),one(240,false)+label('1本で 引く',240,470,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.2,.35),one(800,true)+label('2本で 同時に 引く',800,470,{size:26,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),label('＝',540,300,{size:60,color:C.hi,anchor:'middle',weight:700})+label('同じことが 起こる',540,90,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'separate']:(p)=>{
  const bx=460,ty=FY-50;
  let s=floor(60,700,FY)+box(bx,FY)+force(bx,ty,0,6,SC,{color:AL,text:'6 N',tdy:30})+force(bx,ty,90,8,SC,{color:PP,text:'8 N',tdx:16,tdy:24});
  s+=card(740,120,420,240,label('斜めの力の 働き',950,180,{size:28,color:C.ink,anchor:'middle'})+label('6 N と 8 N を',950,245,{size:30,color:C.ink,anchor:'middle'})+label('別々に 調べる',950,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'quiz86']:(p)=>{
  const tx=330,ty=FY-50,deg=36.87;
  let s=scene(tx,deg,{fN:'10 N'})+angArc(tx,ty,deg)+comps(tx,ty,deg,10,SC,{la:'右 ？',lp:'上 6 N'});
  s+=card(760,120,400,200,label('右向きは 何 N？',960,195,{size:34,color:AL,anchor:'middle',weight:700})+label('考えてみよう',960,255,{size:26,color:C.hi,anchor:'middle'}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'ans86']:(p)=>{
  const tx=330,ty=FY-50,deg=36.87;
  let s=floor(60,700,FY,{slick:false})+box(tx,FY)+fade(seg(p,.7,.85)*.5,force(tx,ty,53.13,10,SC,{color:C.faint,w:4}));
  s+=force(tx,ty,deg,10,SC,{text:'10 N'})+angArc(tx,ty,deg)+comps(tx,ty,deg,10,SC,{la:'右 8 N',lp:'上 6 N',ga:1});
  s+=card(700,90,460,300,tex(`${cs(FC,'10')}^2-${cs(PP,'6')}^2=100-36`,930,160,{size:44,auto:false})
   +fade(seg(p,.2,.35),tex(`=64=${cs(AL,'8')}^2`,930,240,{size:48,auto:false}))
   +fade(seg(p,.4,.55),label('右向き 8 N',930,315,{size:34,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('倒すと 右向きが 増える（6 N → 8 N）',930,368,{size:24,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 // ===== S5 次の問い =====
 [K+'sum1']:(p)=>sumRows(1,seg(p,0,.15)),
 [K+'sum2']:(p)=>sumRows(2,seg(p,0,.2)),
 [K+'sum3']:(p)=>sumRows(3,seg(p,0,.2)),
 [K+'next']:(p)=>{
  const tx=300,ty=FY-50,deg=53.13;
  let s=scene(tx,deg,{fN:'10 N'})+comps(tx,ty,deg,10,SC,{la:'右 6 N',lp:'上 8 N'});
  s+=dist(tx,tx+200,FY,{g:seg(p,.05,.2)});
  s+=card(700,100,460,260,label('次の問い',930,155,{size:26,color:C.dim,anchor:'middle'})+label('箱を 右へ 進めたのは',930,215,{size:30,color:C.ink,anchor:'middle'})
   +label('6 N と 8 N の どちら？',930,280,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.3),C.hi);
  return s;
 },
};
