// YouTube シリーズ「慣性モーメント・上級 3/3」(ys-uc-rigid1-3) — 図。Stage 1200×515.
// 色：I_G の項 水色、交差項 赤、Md² の項 黄、重心 黄の点、質点 白、新しい軸 黄の ⊙。
// 数値：棒 1 → 4、両端 1 kg：2 → 4（右 ＋3＝＋2＋1、左 −1＝−2＋1）、シーソー Σmx＝−2＋0.5＋1.5＝0、
//   重心から 0.5 m：1.75、d＝2：13（誤り 7）、円板の縁 0.27、球の接点 1.4。
import {C,seg,lin,fade,mix,clamp,label,line,rect,dot,ring,arrow,draw,poly,texWidth} from './anim.mjs';
import {card,T,cc} from './yt1-um-sum-to-integral-1-diagrams.mjs';
import {L,boxT} from './yt1-uc-shm-1-diagrams.mjs';
import {BODY,KGM2,axisDot,vAxis,ringTop,discTop,rodBar,ratioBars,strike,rowT} from './yt1-uc-rigid1-1-diagrams.mjs';

const K='uc-rigid1-3:';
const n2=v=>Number(v.toFixed(2));
const cG=s=>cc(C.x,s),cR=s=>cc(C.a,s),cY=s=>cc(C.hi,s);
const xi='x_i',yi='y_i',mi='m_i';
const T1=cG(`\\sum ${mi}(${xi}^2+${yi}^2)`),T2=cR(`2d\\sum ${mi}${xi}`),T3=cY('Md^2');
const mass=(x,y,r=12,col=C.ink)=>`<circle cx="${n2(x)}" cy="${n2(y)}" r="${r}" fill="${col}" fill-opacity=".85" stroke="${C.ink}" stroke-width="2"/>`;
const gDot=(x,y,lab=true)=>dot(x,y,9,C.hi)+(lab?label('G',x+12,y+30,{size:26,color:C.hi,weight:700}):'');
const newAxis=(x,y,lab='新しい 軸')=>ring(x,y,12,{color:C.hi,w:3,fill:C.bg})+dot(x,y,4,C.hi)+(lab?label(lab,x,y+46,{size:24,color:C.hi,anchor:'middle'}):'');
// light rod with two 1 kg masses at ±1 m (px per m = 200)
function dumb(cx,y,axisX,{g=1}={}){
 let s=line(cx-200,y,cx+200,y,{color:BODY,w:5})+mass(cx-200,y,18)+mass(cx+200,y,18);
 s+=label('1 kg',cx-200,y-30,{size:24,color:C.ink,anchor:'middle'})+label('1 kg',cx+200,y-30,{size:24,color:C.ink,anchor:'middle'});
 s+=line(axisX,y-110,axisX,y+90,{color:C.hi,w:2.5,dash:'8 7'})+dot(cx,y,7,C.hi);
 return fade(g,s);
}
// a cloud of point masses around G
const PTS=[[-1.6,.8,14],[-.9,-1.1,10],[.4,1.3,12],[1.5,.2,16],[.9,-1.2,9],[-.2,-.3,11],[-1.2,-.1,8],[1.9,-.9,10],[.2,.4,8]];
function cloud(ox,oy,s_=70){return PTS.map(([x,y,r])=>mass(ox+x*s_,oy-y*s_,r*.8,'#d8e2f2')).join('');}
// a skater (simple)
function skater(cx,cy,ph,arm=1){
 let s=ring(cx,cy-120,18,{color:C.ink,w:3})+line(cx,cy-100,cx,cy-20,{color:C.ink,w:4})+line(cx,cy-20,cx-20,cy+40,{color:C.ink,w:4})+line(cx,cy-20,cx+20,cy+40,{color:C.ink,w:4});
 const L_=70*arm,c=Math.cos(ph);s+=line(cx-L_*c,cy-80,cx+L_*c,cy-80,{color:C.ink,w:4});
 return s+`<ellipse cx="${cx}" cy="${cy+44}" rx="60" ry="12" fill="none" stroke="${C.F}" stroke-width="3"/>`;
}

export const ytUcRigid13Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  const sh=200*seg(p,.1,.5);
  let s=rodBar(300,700,260);
  s+=line(500,120,500,420,{color:C.faint,w:2.5,dash:'8 7'})+label('重心の 軸',500,450,{size:24,color:C.dim,anchor:'middle'});
  s+=line(500-sh,100,500-sh,420,{color:C.hi,w:3,dash:'8 7'})+fade(seg(p,.4,.55),label('ずらした 軸',500-sh,85,{size:24,color:C.hi,anchor:'middle'}));
  s+=card(780,140,380,220,L('I は どれだけ',970,210,{size:30})+L('増える？',970,280,{size:34,color:C.hi,weight:700}),seg(p,0,.1),C.hi);
  return s;
 },
 [K+'rod']:(p)=>{
  let s=rodBar(120,520,150)+vAxis(120,70,230,'')+label('端の 軸',120,268,{size:24,color:C.dim,anchor:'middle'});
  s+=rodBar(120,520,380)+vAxis(320,300,460,'')+label('真ん中の 軸',320,495,{size:24,color:C.dim,anchor:'middle'});
  s+=rect(640,120,4*100,60,{fill:C.E,fo:.55,stroke:C.E,rx:4})+label('4 kg·m²',640+400+14,160,{size:30});
  s+=fade(seg(p,.3,.45),rect(640,350,100,60,{fill:C.x,fo:.55,stroke:C.x,rx:4})+label('1 kg·m²',640+100+14,390,{size:30}));
  return s;
 },
 [K+'diff']:(p)=>{
  let s=rodBar(120,520,150)+vAxis(120,70,230,'')+rodBar(120,520,380)+vAxis(320,300,460,'');
  s+=rect(640,120,4*120,60,{fill:C.E,fo:.55,stroke:C.E,rx:4})+label('4',640+480+14,160,{size:30});
  s+=rect(640,350,120,60,{fill:C.x,fo:.55,stroke:C.x,rx:4})+label('1',640+120+14,390,{size:30});
  s+=fade(seg(p,.1,.25),rect(760,120,360,60,{fill:C.hi,fo:.3,stroke:C.hi,sw:3,rx:4})+label('＋3',940,240,{size:36,color:C.hi,weight:700,anchor:'middle'}));
  s+=fade(seg(p,.1,.25),line(320,95,320,205,{color:C.faint,w:2,dash:'6 6'})+arrow(318,100,124,100,{color:C.hi,w:3,head:12})+label('軸を 1 m',220,85,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('どこから？',940,300,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'bat']:(p)=>{
  const bat=(y,hx,g)=>{let s=poly([[200,y-8],[560,y-14],[900,y-32],[960,y-30],[960,y+30],[900,y+32],[560,y+14],[200,y+8]],{fill:'#c9a46a',fo:.5,stroke:'#c9a46a',sw:2});
   s+=rect(hx-16,y-26,32,52,{fill:C.F,fo:.5,stroke:C.F,rx:6})+line(hx,y-70,hx,y+70,{color:C.hi,w:2.5,dash:'7 6'});return fade(g,s);};
  let s=bat(150,230,1)+label('長く 持つ',1000,160,{size:26,color:C.dim});
  s+=bat(370,400,seg(p,.2,.35))+fade(seg(p,.2,.35),label('短く 持つ',1000,380,{size:26,color:C.hi,weight:700}));
  s+=fade(seg(p,.5,.65),L('手 ＝ 軸 の 位置が 変わる',600,490,{size:28,color:C.hi}));
  return s;
 },
 [K+'guess']:(p)=>{
  let s=T('4-1=3',600,110,{size:52});
  s+=fade(seg(p,.1,.25),T(`M\\times d^2=3\\times 1^2=3`,600,250,{size:52}));
  s+=fade(seg(p,.1,.25),label('全質量',470,330,{size:24,color:C.dim,anchor:'middle'})+label('ずらした 距離²',640,330,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),L('偶然？',600,440,{size:36,color:C.hi,weight:700}));
  return s;
 },
 // ===== S2 =====
 [K+'dumb']:(p)=>{
  let s=dumb(600,250,600);
  s+=label('2 m',600,330,{size:26,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.4,.55),T(`I=1\\times1^2+1\\times1^2=2${KGM2}`,600,440,{size:42}));
  return s;
 },
 [K+'end']:(p)=>{
  let s=dumb(600,220,400);
  s+=T(`I=1\\times0^2+1\\times2^2=4${KGM2}`,600,370,{size:40});
  s+=fade(seg(p,.45,.6),T(`4-2=2=2\\times1^2`,600,460,{size:40,color:C.hi}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=dumb(600,120,400);
  const col=(X,lab,a,b,g)=>fade(g,label(lab,X,500,{size:26,color:C.dim,anchor:'middle'})+rect(X-70,460-a*50,50,a*50,{fill:C.x,fo:.45,stroke:C.x,rx:3})+rect(X+20,460-b*50,50,b*50,{fill:C.hi,fo:.6,stroke:C.hi,rx:3})
   +label(String(a),X-45,450-a*50,{size:24,color:C.x,anchor:'middle'})+label(String(b),X+45,450-b*50,{size:24,color:C.hi,anchor:'middle'}));
  s+=col(380,'左の おもり',1,0,seg(p,.4,.55))+col(820,'右の おもり',1,4,seg(p,.1,.25));
  s+=fade(seg(p,.1,.25),label('＋3',940,330,{size:32,color:C.hi,weight:700}))+fade(seg(p,.4,.55),label('−1',500,400,{size:32,color:C.a,weight:700}));
  s+=line(250,460,950,460,{color:C.dim,w:2});
  return s;
 },
 [K+'split']:(p)=>{
  let s=card(80,60,500,300,L('右の おもり',330,110,{size:28,weight:700})+T(`+3=${cR('+2')}${cY('+1')}`,330,210,{size:50}),seg(p,0,.08));
  s+=card(620,60,500,300,L('左の おもり',870,110,{size:28,weight:700})+fade(seg(p,.25,.38),T(`-1=${cR('-2')}${cY('+1')}`,870,210,{size:50})),seg(p,0,.08));
  s+=fade(seg(p,.5,.62),label('＋1 は どちらにも（d² の 分）',330,300,{size:24,color:C.hi,anchor:'middle'})+label('＋1 は どちらにも（d² の 分）',870,300,{size:24,color:C.hi,anchor:'middle'}));
  s+=fade(seg(p,.7,.82),L('±2 は 打ち消し合う',600,450,{size:32,color:C.a,weight:700}));
  return s;
 },
 [K+'general']:(p)=>{
  let s=cloud(330,260)+gDot(330,260)+axisDot(330,260,{lab:''});
  s+=card(660,140,480,220,L('どんな 物体でも',900,210,{size:30})+L('±の 打ち消しが 起きる？',900,280,{size:30,color:C.hi,weight:700}),seg(p,.2,.32));
  return s;
 },
 // ===== S3 =====
 [K+'setup']:(p)=>{
  const ox=450,oy=270;
  let s=arrow(150,oy,800,oy,{color:C.dim,w:2,head:12})+arrow(ox,490,ox,40,{color:C.dim,w:2,head:12})+label('x',810,oy+8,{size:26,color:C.dim})+label('y',ox+12,48,{size:26,color:C.dim});
  s+=cloud(ox,oy)+gDot(ox,oy)+axisDot(ox,oy,{lab:''});
  s+=card(860,120,300,250,L('質点 mᵢ',1010,180,{size:28})+L('重心 G ＝ 原点',1010,250,{size:26,color:C.hi})+L('軸 ⊙ 画面に 垂直',1010,320,{size:24,color:C.dim}),seg(p,.1,.2));
  return s;
 },
 [K+'IG']:(p)=>{
  const ox=450,oy=290,px=ox+170,py=oy-130;
  let s=arrow(150,oy,800,oy,{color:C.dim,w:2,head:12})+arrow(ox,490,ox,40,{color:C.dim,w:2,head:12});
  s+=gDot(ox,oy,false)+axisDot(ox,oy,{lab:''})+mass(px,py,14)+label('mᵢ',px+20,py-14,{size:26});
  s+=line(ox,oy,px,oy,{color:C.x,w:4})+line(px,oy,px,py,{color:C.x,w:4})+line(ox,oy,px,py,{color:C.ink,w:2.5,dash:'6 5'});
  s+=label('xᵢ',(ox+px)/2,oy+34,{size:26,color:C.x,anchor:'middle',weight:700})+label('yᵢ',px+14,(oy+py)/2+8,{size:26,color:C.x,weight:700});
  s+=fade(seg(p,.4,.55),boxT(`I_G=${T1}`,960,200,40,1,C.x));
  return s;
 },
 [K+'shift']:(p)=>{
  const ox=520,oy=290,d=200*seg(p,.05,.4);
  let s=arrow(150,oy,860,oy,{color:C.dim,w:2,head:12})+arrow(ox,490,ox,40,{color:C.dim,w:2,head:12});
  s+=cloud(ox,oy,60)+gDot(ox,oy)+axisDot(ox,oy,{lab:''});
  s+=newAxis(ox-d,oy,d>150?'新しい 軸':'');
  s+=fade(seg(p,.35,.5),line(ox-200,oy+110,ox,oy+110,{color:C.hi,w:3})+line(ox-200,oy+100,ox-200,oy+120,{color:C.hi,w:3})+line(ox,oy+100,ox,oy+120,{color:C.hi,w:3})+label('d',ox-100,oy+150,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('(−d, 0)',ox-200,oy-30,{size:26,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'newdist']:(p)=>{
  const ox=520,oy=290,ax=ox-200,px=ox+170,py=oy-130;
  let s=arrow(150,oy,860,oy,{color:C.dim,w:2,head:12})+arrow(ox,490,ox,40,{color:C.dim,w:2,head:12});
  s+=gDot(ox,oy,false)+newAxis(ax,oy,'')+mass(px,py,14)+label('mᵢ',px+20,py-14,{size:26});
  s+=line(ax,oy+40,ox,oy+40,{color:C.hi,w:4})+label('d',(ax+ox)/2,oy+74,{size:28,color:C.hi,anchor:'middle',weight:700});
  s+=line(ox,oy+40,px,oy+40,{color:C.x,w:4})+label('xᵢ',(ox+px)/2,oy+74,{size:28,color:C.x,anchor:'middle',weight:700});
  s+=line(px,oy,px,py,{color:C.x,w:4})+label('yᵢ',px+14,(oy+py)/2+8,{size:26,color:C.x,weight:700});
  s+=fade(seg(p,.1,.25),line(ax,oy,px,py,{color:C.ink,w:2.5,dash:'6 5'}));
  s+=fade(seg(p,.5,.65),card(880,110,290,170,T(`(${xi}+d)^2+${yi}^2`,1025,195,{size:34}),1,C.hi));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=T(`(${xi}+d)^2`,600,110,{size:52});
  s+=fade(seg(p,.2,.35),boxT(`=${cG(`${xi}^2`)}${cR(`+2d${xi}`)}${cY('+d^2')}`,600,300,56,1,C.hi));
  return s;
 },
 [K+'three']:(p)=>{
  let s=T(`(${xi}+d)^2+${yi}^2`,600,90,{size:46,opacity:.85});
  const R=rowT([cG(`(${xi}^2+${yi}^2)`),'+',cR(`2d${xi}`),'+',cY('d^2')],600,270,54,{gap:.3});
  s+=fade(seg(p,.15,.3),R.svg);
  s+=fade(seg(p,.4,.55),label('①',R.pos[0].x,370,{size:30,color:C.x,anchor:'middle'})+label('②',R.pos[2].x,370,{size:30,color:C.a,anchor:'middle'})+label('③',R.pos[4].x,370,{size:30,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=label('距離² ＝',330,100,{size:30,anchor:'middle'})+T(`(${xi}^2+${yi}^2)+2d${xi}+d^2`,660,90,{size:40,opacity:.85});
  s+=fade(seg(p,.1,.25),label('mᵢ を 掛けて 全部 足す',600,180,{size:26,color:C.dim,anchor:'middle'}));
  const R=rowT(['I=',cG(`\\sum ${mi}(${xi}^2+${yi}^2)`),'+',cR(`\\sum 2d\\,${mi}${xi}`),'+',cY(`\\sum ${mi}d^2`)],600,320,44,{gap:.25});
  s+=fade(seg(p,.25,.4),R.svg);
  s+=fade(seg(p,.5,.62),label('①',R.pos[1].x,420,{size:28,color:C.x,anchor:'middle'})+label('②',R.pos[3].x,420,{size:28,color:C.a,anchor:'middle'})+label('③',R.pos[5].x,420,{size:28,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'first']:(p)=>{
  const R=rowT(['I=',cG(`\\sum ${mi}(${xi}^2+${yi}^2)`),'+',cR(`\\sum 2d\\,${mi}${xi}`),'+',cY(`\\sum ${mi}d^2`)],600,110,44,{gap:.25});
  let s=R.svg;
  s+=fade(seg(p,.2,.35),boxT('=I_G',R.pos[1].x,260,46,1,C.x)+label('重心の 軸の I',R.pos[1].x,350,{size:26,color:C.x,anchor:'middle'}));
  return s;
 },
 [K+'third']:(p)=>{
  const R=rowT(['I=',cG(`\\sum ${mi}(${xi}^2+${yi}^2)`),'+',cR(`\\sum 2d\\,${mi}${xi}`),'+',cY(`\\sum ${mi}d^2`)],600,110,44,{gap:.25});
  let s=R.svg+T('I_G',R.pos[1].x,240,{size:44,color:C.x});
  s+=fade(seg(p,.1,.25),T(`=d^2\\sum ${mi}`,R.pos[5].x,240,{size:40}));
  s+=fade(seg(p,.4,.55),boxT('=Md^2',R.pos[5].x,370,44,1,C.hi)+label('Σmᵢ ＝ M',R.pos[5].x,460,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'second']:(p)=>{
  const R=rowT(['I=',cG(`\\sum ${mi}(${xi}^2+${yi}^2)`),'+',cR(`\\sum 2d\\,${mi}${xi}`),'+',cY(`\\sum ${mi}d^2`)],600,110,44,{gap:.25});
  let s=R.svg+T('I_G',R.pos[1].x,240,{size:44,color:C.x})+T('Md^2',R.pos[5].x,240,{size:44,color:C.hi});
  s+=fade(seg(p,.2,.35),boxT(`=2d\\times\\sum ${mi}${xi}`,R.pos[3].x,370,40,1,C.a));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=T(`x_G=\\dfrac{\\sum ${mi}${xi}}{M}`,600,110,{size:50});
  s+=fade(seg(p,.2,.35),L('重心 ＝ 原点 → x_G ＝ 0',600,240,{size:30,color:C.hi}));
  s+=fade(seg(p,.5,.65),boxT(`\\sum ${mi}${xi}=0`,600,370,54,1,C.a));
  return s;
 },
 [K+'seesaw']:(p)=>{
  const y=250,X=x=>600+200*x;
  let s=line(X(-1.6),y,X(1.8),y,{color:BODY,w:6})+poly([[600,y+8],[570,y+70],[630,y+70]],{fill:C.hi,fo:.6,stroke:C.hi});
  s+=label('G',600,y+100,{size:26,color:C.hi,anchor:'middle',weight:700});
  [[-1,2,'2 kg'],[.5,1,'1 kg'],[1.5,1,'1 kg']].forEach(([x,m,t])=>{s+=mass(X(x),y-24,10+6*m)+label(t,X(x),y-60,{size:24,anchor:'middle'});});
  s+=fade(seg(p,.25,.4),label('2 × (−1) ＝ −2',X(-1),y+150,{size:26,color:C.a,anchor:'middle'})+label('1 × 0.5 ＋ 1 × 1.5 ＝ ＋2',X(1),y+150,{size:26,color:C.a,anchor:'middle'}));
  s+=fade(seg(p,.55,.7),L('Σmᵢxᵢ ＝ 0 → 釣り合う',600,470,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'result']:(p)=>{
  const R=rowT(['I=','I_G','+',cR(`2d\\sum ${mi}${xi}`),'+','Md^2'],600,130,52,{gap:.25});
  let s=R.svg+strike(R.pos[3].x,130,R.pos[3].w,52,seg(p,.05,.2))+fade(seg(p,.05,.2),label('0',R.pos[3].x,215,{size:34,color:C.a,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),boxT('I=I_G+Md^2',600,340,62,1,C.hi));
  s+=fade(seg(p,.55,.7),L('平行軸の 定理',600,460,{size:30,color:C.hi,weight:700}));
  return s;
 },
 [K+'meaning']:(p)=>{
  const ax=170,ay=300,Rr=280,th=mix(.35,-.35,p);
  let s=newAxis(ax,ay,'軸')+ring(ax,ay,Rr,{color:C.faint,w:2,dash:'6 8'});
  const cx=ax+Rr*Math.cos(th),cy=ay+Rr*Math.sin(th);
  s+=line(ax,ay,cx,cy,{color:C.hi,w:3})+label('d',(ax+cx)/2,(ay+cy)/2-14,{size:28,color:C.hi,weight:700});
  s+=`<ellipse cx="${n2(cx)}" cy="${n2(cy)}" rx="70" ry="45" fill="${BODY}" fill-opacity=".35" stroke="${BODY}" stroke-width="2"/>`+dot(cx,cy,8,C.hi);
  s+=card(660,60,520,180,T('I_G',730,150,{size:44,color:C.x})+label('重心まわりの 回しにくさ',780,160,{size:26}),seg(p,.05,.18));
  s+=card(660,270,520,180,T('Md^2',740,360,{size:44,color:C.hi})+label('重心を 半径 d で 回す 分',800,370,{size:26}),seg(p,.4,.52));
  return s;
 },
 // ===== S4 =====
 [K+'rodend']:(p)=>{
  let s=rodBar(150,550,150)+vAxis(150,70,230,'')+dot(350,150,8,C.hi)+line(150,200,350,200,{color:C.hi,w:3})+label('d ＝ l/2',250,235,{size:26,color:C.hi,anchor:'middle'});
  s+=T(`I=${cc(C.x,'\\dfrac{Ml^2}{12}')}+${cY('M\\left(\\dfrac{l}{2}\\right)^2')}`,600,380,{size:50});
  return s;
 },
 [K+'rodcalc']:(p)=>{
  let s=T(`${cY('M\\left(\\dfrac{l}{2}\\right)^2')}=\\dfrac{Ml^2}{4}=\\dfrac{3Ml^2}{12}`,600,100,{size:46});
  s+=fade(seg(p,.3,.45),T(`I=\\dfrac{Ml^2}{12}+\\dfrac{3Ml^2}{12}=\\dfrac{4Ml^2}{12}`,600,240,{size:46}));
  s+=fade(seg(p,.55,.68),boxT('=\\dfrac{Ml^2}{3}',600,390,52,1,C.hi,true)+label('中級の 積分と 一致 ✓',800,400,{size:28,color:C.F,weight:700}));
  return s;
 },
 [K+'rodnum']:(p)=>{
  let s=T(`I=${cc(C.x,'1')}+${cY('3\\times1^2')}=4${KGM2}`,600,140,{size:54});
  s+=fade(seg(p,.4,.55),L('最初の 問いの 3 ＝ Md²',600,320,{size:34,color:C.hi,weight:700}));
  return s;
 },
 [K+'grip']:(p)=>{
  let s=rodBar(150,550,130)+vAxis(150,60,200,'')+label('端（d ＝ 1 m）',150,240,{size:24,color:C.dim,anchor:'start'});
  s+=rodBar(150,550,330)+vAxis(250,260,400,'')+dot(350,330,8,C.hi)+label('d ＝ 0.5 m',300,440,{size:24,color:C.hi,anchor:'middle'});
  s+=rect(660,100,4*110,60,{fill:C.E,fo:.55,stroke:C.E,rx:4})+label('4',660+440+14,140,{size:30});
  s+=fade(seg(p,.1,.25),rect(660,300,1.75*110,60,{fill:C.x,fo:.55,stroke:C.x,rx:4})+label('1.75',660+192+14,340,{size:30}));
  s+=fade(seg(p,.1,.25),T(`I=1+3\\times0.5^2=1.75${KGM2}`,780,450,{size:34}));
  return s;
 },
 [K+'disc']:(p)=>{
  const cx=300,cy=260,R=170;
  let s=discTop(cx,cy,R)+dot(cx,cy,8,C.hi)+axisDot(cx+R,cy,{lab:'軸',dx:16,dy:-16});
  s+=line(cx,cy,cx+R,cy,{color:C.hi,w:3})+label('d ＝ R',cx+R/2,cy-14,{size:26,color:C.hi,anchor:'middle'});
  s+=T(`I=${cc(C.x,'\\dfrac12MR^2')}+${cY('MR^2')}=1.5MR^2`,830,150,{size:40});
  s+=fade(seg(p,.5,.62),card(560,250,560,190,L('M ＝ 2 kg、R ＝ 0.3 m',840,300,{size:26,color:C.dim})+T(`0.09+0.18=0.27${KGM2}`,840,380,{size:40}),1,C.x));
  return s;
 },
 [K+'min']:(p)=>{
  const A={x:150,y:430,w:500,h:330};
  const X=d=>A.x+A.w/2+d*120,Y=v=>A.y-v*55;
  let s=arrow(A.x,A.y,A.x+A.w+30,A.y,{color:C.dim,w:2,head:12})+label('ずらす 距離 d',A.x+A.w+20,A.y+40,{size:24,color:C.dim,anchor:'end'});
  s+=arrow(X(0),A.y+10,X(0),A.y-A.h-20,{color:C.dim,w:2,head:12})+label('I',X(0)+12,A.y-A.h,{size:28});
  s+=draw(Array.from({length:81},(_,i)=>{const d=-2+i/20;return [X(d),Y(1+3*d*d/3*1)];}),seg(p,.05,.5),{color:C.hi,w:4});
  s+=fade(seg(p,.4,.55),dot(X(0),Y(1),9,C.x)+label('I_G（最小）',X(0)+16,Y(1)+34,{size:26,color:C.x}));
  s+=card(720,150,440,200,L('Md² ≧ 0',940,215,{size:34,color:C.hi,weight:700})+L('重心の 軸が いちばん 回しやすい',940,290,{size:24}),seg(p,.3,.42));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=rodBar(300,700,200)+dot(500,200,8,C.hi)+label('G',500,170,{size:24,color:C.hi,anchor:'middle'});
  s+=vAxis(300,110,290,'')+label('端の 軸（4）',300,320,{size:24,color:C.dim,anchor:'middle'});
  s+=line(100,90,100,290,{color:C.a,w:3,dash:'8 7'})+label('さらに 1 m 外',100,80,{size:24,color:C.a,anchor:'middle'});
  s+=fade(seg(p,.35,.5),T('4+3\\times1^2=7',600,410,{size:46,color:C.a})+strike(600,410,texWidth('4+3\\times1^2=7',46,false),46,seg(p,.5,.6)));
  s+=fade(seg(p,.7,.82),label('基準は 重心の 軸だけ',600,490,{size:26,color:C.hi,anchor:'middle'}));
  return s;
 },
 [K+'caution2']:(p)=>{
  let s=rodBar(300,700,200)+dot(500,200,8,C.hi)+label('G',500,170,{size:24,color:C.hi,anchor:'middle'})+line(100,90,100,290,{color:C.hi,w:3,dash:'8 7'});
  s+=line(100,260,500,260,{color:C.hi,w:3})+label('d ＝ 2 m',300,295,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.35),boxT(`I=1+3\\times2^2=13${KGM2}`,600,410,44,1,C.hi));
  return s;
 },
 // ===== S5 =====
 [K+'sum1']:(p)=>{
  const R=rowT(['I=',cG('I_G'),'+',cR(`2d\\sum ${mi}${xi}`),'+',cY('Md^2')],600,130,52,{gap:.25});
  let s=R.svg+strike(R.pos[3].x,130,R.pos[3].w,52,1)+label('重心の 定義で 0',R.pos[3].x,215,{size:26,color:C.a,anchor:'middle'});
  s+=fade(seg(p,.4,.55),boxT('I=I_G+Md^2',600,360,60,1,C.hi));
  return s;
 },
 [K+'unit']:(p)=>{
  const rows=[['輪','MR^2'],['円板','\\tfrac12MR^2'],['棒（真ん中）','\\tfrac1{12}Ml^2'],['球','\\tfrac25MR^2']];
  let s='';
  rows.forEach(([n,f],i)=>{const X=180+i*280,g=seg(p,.05+i*.08,.15+i*.08);s+=fade(g,rect(X-120,60,240,170,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:12})+L(n,X,110,{size:26,weight:700})+T(f,X,180,{size:38}));});
  s+=fade(seg(p,.5,.62),boxT('I=I_G+Md^2',600,380,54,1,C.hi)+label('軸を ずらすと',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ball']:(p)=>{
  const cx=300,cy=240,R=170;
  let s=line(80,cy+R,560,cy+R,{color:C.dim,w:3})+`<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.E}" fill-opacity=".25" stroke="${C.E}" stroke-width="2"/>`+dot(cx,cy,8,C.hi);
  s+=axisDot(cx,cy+R,{lab:'接点の 軸',dx:20,dy:36});
  s+=line(cx+14,cy,cx+14,cy+R,{color:C.hi,w:3})+label('d ＝ R',cx+26,cy+R/2,{size:24,color:C.hi});
  s+=T(`I=${cc(C.x,'\\dfrac25MR^2')}+${cY('MR^2')}=\\dfrac75MR^2`,880,120,{size:40});
  s+=fade(seg(p,.4,.55),card(640,230,480,200,L('前回の 坂の 式',880,275,{size:24,color:C.dim})+T('1+\\dfrac{I}{MR^2}=1+0.4=1.4',880,360,{size:36}),1,C.hi));
  return s;
 },
 [K+'teaser']:(p)=>{
  let s=T('\\dfrac75=1.4',300,150,{size:52})+label('＝',520,165,{size:44,color:C.hi,anchor:'middle'})+T('1.4',700,150,{size:52});
  s+=label('接点の 軸',300,240,{size:24,color:C.dim,anchor:'middle'})+label('坂の 式',700,240,{size:24,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.2,.35),L('偶然では ない → 次の 単元',600,350,{size:32,color:C.hi,weight:700}));
  return s;
 },
 [K+'next']:(p)=>{
  let s=poly([[80,120],[560,420],[80,420]],{fill:'#24314b',fo:1,stroke:C.dim,sw:2});
  const u=clamp(p/.8),d=420*u*u,ux=480/Math.hypot(480,300),uy=300/Math.hypot(480,300),R=30;
  const cx=80+ux*(d+40)+uy*R,cy=120+uy*(d+40)-ux*R;
  s+=`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${R}" fill="${C.E}" fill-opacity=".5" stroke="${C.E}" stroke-width="2"/>`+line(cx,cy,cx+R*Math.cos(d/R),cy+R*Math.sin(d/R),{color:C.ink,w:2.5});
  s+=skater(860,300,2*Math.PI*3*p*p,1-.6*seg(p,.3,.7));
  s+=L('転がる',300,470,{size:26,color:C.dim})+L('スピン',860,470,{size:26,color:C.dim});
  s+=fade(seg(p,.3,.45),L('エネルギー と 角運動量',600,60,{size:30,color:C.hi,weight:700}));
  return s;
 },
};
