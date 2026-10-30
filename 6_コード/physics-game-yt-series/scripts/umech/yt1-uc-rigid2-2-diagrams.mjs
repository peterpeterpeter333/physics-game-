// YouTube シリーズ「剛体の回転・上級 2/2」(ys-uc-rigid2-2) — 図。Stage 1200×515.
// 色：並進 𝐯_G 紫、回転の速度 𝛚×𝐫 桃（ω 桃）、𝐫ᵢ 水色、合成 黄、エネルギー 橙（並進 橙、回転 桃）、力・摩擦 緑、交差項 黄枠、誤り 赤。
// 横から見た図：x 右、y 上、z 手前。右へ転がる車輪は時計回り → 𝛚 は奥向き ⊗。
//   画面の角度 a（y 下向き）の点 (cx＋r cos a, cy＋r sin a) の、時計回りの回転による速度の向き＝(−sin a, cos a)：上 → 右、下 → 左。
// 坂：下りが右、角 25°。摩擦は接地点で坂の上向き。重心のまわりのトルクは時計回り（転がる向き）。
// 数値：棒と玉 v＝3、u＝1 → 16＋4＝20＝2×9＋2×1。円板 2 kg、3 m/s：9＋4.5＝13.5 J、I_P＝1.5MR² → 13.5 J、誤り 22.5 J。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly,ground} from './anim.mjs';

const K='uc-rigid2-2:';
const CV=C.v,CW=C.p,CR=C.x,CE=C.E,CF=C.F,CH=C.hi,CD=C.dim,BAD=C.a;
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const col=(c,s)=>`{\\color{${c}}{${s}}}`;
const TAU=Math.PI*2;
const U=s=>`\\,\\mathrm{${s}}`;
const ok=(x,y,g=1)=>fade(g,label('✓',x,y,{size:34,color:CF,weight:700,anchor:'middle'}));
const ng=(x,y,g=1)=>fade(g,label('×',x,y,{size:36,color:BAD,weight:700,anchor:'middle'}));
// TeX pieces
const vG=col(CV,'\\mathbf{v}_G'),vGs=col(CV,'v_G'),vi=col(CH,'\\mathbf{v}_i'),vis=col(CH,'v_i');
const W=col(CW,'\\boldsymbol{\\omega}'),w=col(CW,'\\omega'),ri=col(CR,'\\mathbf{r}_i'),ris=col(CR,'r_i');
const Wr=`${W}\\times${ri}`;
const aG=col(C.a,'\\mathbf{a}_G'),Fx=col(CF,'\\mathbf{F}_{\\text{外}}');

function wheel(cx,cy,R,rot,{g=1,marker=1,spokes=6,rim=CD,fill='#141d33',w=6}={}){
 let s=ring(cx,cy,R,{color:rim,w,fill});
 for(let i=0;i<spokes;i++){const a=rot+i*TAU/spokes+Math.PI/2;s+=line(cx,cy,cx+R*.92*Math.cos(a),cy+R*.92*Math.sin(a),{color:C.faint,w:3});}
 if(marker){const a=rot+Math.PI/2;s+=dot(cx+R*Math.cos(a),cy+R*Math.sin(a),9,CH);}
 s+=dot(cx,cy,7,C.ink);
 return fade(g,s);
}
function headAt(pts,color){const n=pts.length,[x1,y1]=pts[n-2],[x2,y2]=pts[n-1],a=Math.atan2(y2-y1,x2-x1),H=15;
 return `<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-H*Math.cos(a)+H*.55*Math.sin(a)},${y2-H*Math.sin(a)-H*.55*Math.cos(a)} ${x2-H*Math.cos(a)-H*.55*Math.sin(a)},${y2-H*Math.sin(a)+H*.55*Math.cos(a)}" fill="${color}"/>`;}
// screen angles, a1>a0 → clockwise on screen
function turnCW(cx,cy,r,a0,a1,{color=CW,w=4,g=1}={}){
 if(g<=0)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30;return [cx+r*Math.cos(a),cy+r*Math.sin(a)];});
 return fade(g,draw(pts,1,{color,w})+headAt(pts,color));
}
function inSym(x,y,r=22,color=CW,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const cwDir=a=>[-Math.sin(a),Math.cos(a)];
const gDot=(x,y,lab=1)=>ring(x,y,10,{color:C.ink,w:3,fill:C.bg})+dot(x,y,4,C.ink)+(lab?L('G',x-22,y-14,{size:24,weight:700}):'');
const side=(t='横から 見た 図')=>label(t,30,40,{size:22,color:CD});

// ---- big wheel for S3 ---------------------------------------------------------------------------------------
const BW={cx:320,cy:265,R:175,gy:440};
function bigWheel({g=1,parts=1}={}){
 const {cx,cy,R,gy}=BW;
 let s=ground(40,660,gy)+ring(cx,cy,R,{color:CD,w:6,fill:'#141d33'});
 if(parts){for(let i=0;i<12;i++){const a=i*TAU/12;for(const k of [.35,.7]){const x=cx+R*k*Math.cos(a+k),y=cy+R*k*Math.sin(a+k);s+=dot(x,y,5,C.faint);}}}
 s+=gDot(cx,cy);
 return fade(g,s);
}
const PA=-.65,PK=.78; // the chosen part i: screen angle, fraction of R
const partXY=()=>[BW.cx+BW.R*PK*Math.cos(PA),BW.cy+BW.R*PK*Math.sin(PA)];

// ---- slope for S2 -------------------------------------------------------------------------------------------
const SL={ax:50,ay:110,th:25*Math.PI/180,len:660,R:80,sd:300};
function slopeScene({fG=0,gG=0,nG=0,tG=0,cG=0}={}){
 const {ax,ay,th,len,R,sd}=SL,ux=Math.cos(th),uy=Math.sin(th),nx=Math.sin(th),ny=-Math.cos(th);
 const bx=ax+ux*sd,by=ay+uy*sd,cx=bx+nx*R,cy=by+ny*R;
 let s=poly([[ax,ay],[ax+ux*len,ay+uy*len],[ax,ay+uy*len]],{fill:'#26324d',fo:.8,stroke:CD,sw:2});
 s+=ring(cx,cy,R,{color:CD,w:3,fill:'#8fa6cf'})+dot(cx,cy,5,C.bg);
 // angle mark
 const ex=ax+ux*len,ey=ay+uy*len;
 s+=draw(Array.from({length:12},(_,i)=>{const f=th*i/11;return [ex-90*Math.cos(f),ey-90*Math.sin(f)];}),1,{color:CD,w:2})+label('θ',ex-120*Math.cos(th/2),ey-120*Math.sin(th/2)+8,{size:26,color:CD,anchor:'middle'});
 // downhill positive direction
 s+=fade(cG,arrow(ax+ux*80+nx*20,ay+uy*80+ny*20,ax+ux*200+nx*20,ay+uy*200+ny*20,{color:CD,w:3,head:12})+label('正',ax+ux*140+nx*48,ay+uy*140+ny*48,{size:22,color:CD,anchor:'middle'}));
 s+=fade(gG,arrow(cx,cy,cx,cy+120,{color:CF,w:5,head:14})+label('Mg',cx+12,cy+120,{size:24,color:CF,weight:700})
  +arrow(cx,cy,cx+ux*220*Math.sin(th),cy+uy*220*Math.sin(th),{color:CF,w:3,head:11,opacity:.85})+tex(`Mg\\sin\\theta`,cx+ux*220*Math.sin(th)+14,cy+uy*220*Math.sin(th)+8,{size:24,color:CF,anchor:'start',auto:false}));
 s+=fade(nG,arrow(bx+nx*6,by+ny*6,bx+nx*70,by+ny*70,{color:CD,w:3,head:11})+label('垂直抗力',bx+nx*70-10,by+ny*70-10,{size:22,color:CD,anchor:'end'}));
 s+=fade(fG,arrow(bx,by,bx-ux*100,by-uy*100,{color:CF,w:6,head:15})+label('f',bx-ux*110-6,by-uy*110+30,{size:28,color:CF,weight:700}));
 s+=turnCW(cx,cy,R+26,-2.5,-1.0,{color:CW,w:5,g:tG});
 return {s,cx,cy,bx,by};
}

// ---- dumbbell -----------------------------------------------------------------------------------------------
function dumbbell(cx,cy,ang,{r=120,g=1}={}){ // ang: screen angle of the "top" ball from centre
 const x1=cx+r*Math.cos(ang),y1=cy+r*Math.sin(ang),x2=cx-r*Math.cos(ang),y2=cy-r*Math.sin(ang);
 return fade(g,line(x1,y1,x2,y2,{color:CD,w:6})+ring(x1,y1,22,{color:C.ink,w:3,fill:'#2c3854'})+ring(x2,y2,22,{color:C.ink,w:3,fill:'#2c3854'})+gDot(cx,cy,0));
}

// ---- equation helpers ---------------------------------------------------------------------------------------
const span=(full,prefix,term,size,cx=600)=>{const Wd=texWidth(full,size,false);return [cx-Wd/2+texWidth(prefix+'{}',size,false),texWidth(term,size,false)];};
const boxT=(full,prefix,term,size,y,g=1,colr=CH,h=2.4)=>{const [x0,wd]=span(full,prefix,term,size);return highlight(x0-12,y-size*1.4,wd+24,size*h,g,colr);};
const strikeT=(full,prefix,term,size,y,g=1)=>{const [x0,wd]=span(full,prefix,term,size);return fade(g,line(x0,y+size*.5,x0+wd,y-size*.9,{color:BAD,w:4}));};

export const ytUcRigid22Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  const gy=430,R=110,cx=230+140*seg(p,0,1),cy=gy-R;
  let s=ground(40,640,gy)+wheel(cx,cy,R,(cx-230)/R);
  s+=fade(seg(p,.15,.3),arrow(cx,cy,cx+100,cy,{color:CV,w:6,head:16}));
  s+=turnCW(cx,cy,R+26,-2.4,-.8,{color:CW,w:5,g:seg(p,.3,.45)});
  s+=card(690,80,470,320,L('前回の 最後の 問い',925,130,{size:24,color:CD})
   +T(`\\tfrac12 M${col(CV,'v')}^2+\\tfrac12 I${w}^2`,925,215,{size:42})
   +fade(seg(p,.4,.55),L('重心の 並進',925,290,{size:28,color:CV,weight:700})+L('＋ 重心まわりの 回転',925,345,{size:28,color:CW,weight:700})),seg(p,.02,.12),CH);
  return s;
 },
 [K+'ask2']:(p)=>{
  const gy=430,R=110,cx=370,cy=gy-R;
  let s=ground(40,640,gy)+wheel(cx,cy,R,140/R)+arrow(cx,cy,cx+100,cy,{color:CV,w:6,head:16})+turnCW(cx,cy,R+26,-2.4,-.8,{color:CW,w:5});
  s+=card(690,80,470,320,T(`\\tfrac12 M${col(CV,'v')}^2+\\tfrac12 I${w}^2`,925,180,{size:42})
   +L('この 分け方は',925,255,{size:30,weight:700})+L('なぜ 許される？',925,310,{size:34,color:CH,weight:700})+fade(seg(p,.45,.6),L('中級：「上級で 確かめる」と 約束',925,370,{size:24,color:CD})),1,CH);
  return s;
 },
 [K+'mid']:(p)=>{
  let s=card(200,70,800,360,L('剛体の回転・中級 2/2',600,120,{size:24,color:CD})
   +T(`K=\\tfrac12 M${col(CV,'v')}^2+\\tfrac12 I${w}^2`,600,210,{size:50})
   +fade(seg(p,.15,.3),L('結果として 使った',600,290,{size:28}))
   +fade(seg(p,.45,.6),L('理由は 上級で 確かめる（約束）',600,365,{size:32,color:CH,weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'hammer']:(p)=>{
  const u=seg(p,.03,.9),path=q=>[110+880*q,430-640*q+640*q*q];
  let s=label('投げた ハンマー',30,40,{size:22,color:CD});
  s+=ground(40,1160,470);
  // ghost positions
  for(const q of [.15,.35,.55,.75]){if(q>u)break;const [x,y]=path(q),a=q*5*Math.PI;s+=fade(.3,hammerAt(x,y,a));}
  const g2=seg(p,.4,.55);
  s+=fade(g2,draw(Array.from({length:41},(_,i)=>path(i/40*u)),1,{color:CH,w:3,dash:'8 7'}));
  const [x,y]=path(u);s+=hammerAt(x,y,u*5*Math.PI);
  s+=fade(g2,L('重心 → 放物線',760,170,{size:28,color:CH,weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  const gy=440,R=100,cx=230,cy=gy-R;
  let s=ground(40,520,gy)+wheel(cx,cy,R,0,{marker:0})+arrow(cx,cy,cx+90,cy,{color:CV,w:6,head:16})+ring(cx,gy,14,{color:CH,w:3,dash:'5 4'})+L('接地点',cx+70,gy+36,{size:22,color:CH});
  s+=card(560,60,280,250,L('重心で 分ける',700,110,{size:26,color:CV,weight:700})+T(`\\tfrac12 M v^2`,700,180,{size:34})+T(`+\\tfrac12 I_G\\omega^2`,700,240,{size:34}),seg(p,.15,.28));
  s+=card(880,60,280,250,L('接地点の まわり',1020,110,{size:26,color:CW,weight:700})+L('の 回転として',1020,150,{size:24,color:CW})+T(`\\tfrac12 I_P\\omega^2`,1020,220,{size:36}),seg(p,.4,.53));
  s+=fade(seg(p,.62,.75),L('同じ 値？',860,380,{size:40,color:CH,weight:700}));
  return s;
 },

 // ===== S2 2本の式 =====
 [K+'eq1']:(p)=>{
  const path=q=>[90+520*q,430-560*q+560*q*q];
  let s=draw(Array.from({length:41},(_,i)=>path(i/40)),1,{color:CH,w:3,dash:'8 7'});
  for(const q of [.2,.5,.8]){const [x,y]=path(q);s+=fade(.85,hammerAt(x,y,q*4*Math.PI));}
  const [x,y]=path(.5);s+=fade(seg(p,.4,.55),arrow(x,y+8,x,y+90,{color:CF,w:5,head:14})+L('重力',x+40,y+70,{size:22,color:CF,anchor:'start'}));
  s+=card(680,70,480,360,L('① 重心の 並進',920,120,{size:28,color:CV,weight:700})
   +T(`M${aG}=${Fx}`,920,210,{size:52})+L('運動量・上級で 導いた',920,275,{size:22,color:CD})
   +fade(seg(p,.5,.65),L('外力の 和 だけで 決まる',920,340,{size:26})+L('→ 重心は 放物線',920,390,{size:28,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'eq2']:(p)=>{
  const cx=280,cy=260;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="170" ry="95" fill="#26324d" stroke="${CD}" stroke-width="3" transform="rotate(${(-25+60*seg(p,0,1)).toFixed(1)} ${cx} ${cy})"/>`;
  s+=gDot(cx,cy)+turnCW(cx,cy,140,-2.2,-.6,{color:CW,w:5,g:seg(p,.1,.25)})+L('重心を 通る 軸',cx,cy+170,{size:24,color:CD});
  s+=card(600,70,560,360,L('② 重心まわりの 回転',880,120,{size:28,color:CW,weight:700})
   +T(`I_G\\,${col(C.a,'\\alpha')}=N_G`,880,215,{size:56})
   +fade(seg(p,.5,.65),T(`I_G,\\ N_G`,800,300,{size:34})+L('は',880,306,{size:26,anchor:'start'})+L('重心を 通る 同じ 軸 で 測る',880,350,{size:28,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'caveat']:(p)=>{
  let s=card(60,80,500,330,L('角運動量・上級',310,130,{size:24,color:CD})+T(`\\dfrac{d\\mathbf{L}}{dt}=\\mathbf{N}`,310,215,{size:44})
   +L('基準点：慣性系に 固定',310,300,{size:26,weight:700})+ring(310,360,9,{color:C.ink,w:3,fill:C.bg})+L('O',340,368,{size:22}));
  const gx=720+150*seg(p,.1,.6)**2;
  s+=gDot(gx,330)+fade(seg(p,.1,.25),arrow(gx+16,330,gx+110,330,{color:C.a,w:5,head:14})+L('加速',gx+70,310,{size:22,color:C.a}));
  s+=card(600,90,560,170,L('重心 G を 基準に すると',880,140,{size:26})+L('同じ 形の 式が 成り立つ',880,190,{size:28,color:CH,weight:700})+L('（示せる。ここでは 結果として 使う）',880,235,{size:22,color:CD}),seg(p,.35,.5),CH);
  return s;
 },
 [K+'roll']:(p)=>{
  const {s:sc}=slopeScene({cG:seg(p,.05,.2),gG:seg(p,.2,.35),fG:seg(p,.5,.65)});
  let s=sc;
  s+=card(760,70,400,330,L('① 重心の 式（坂に 沿って）',960,120,{size:24,color:CV,weight:700})
   +fade(seg(p,.3,.45),T(`Ma=Mg\\sin\\theta-${col(CF,'f')}`,960,215,{size:40}))
   +fade(seg(p,.6,.75),L('f：接地点の 摩擦力',960,300,{size:26,color:CF,weight:700})+L('（坂の 上向き）',960,345,{size:22,color:CD})),seg(p,.02,.12));
  return s;
 },
 [K+'rollrot']:(p)=>{
  const {s:sc}=slopeScene({gG:1,fG:1,tG:seg(p,.05,.2)});
  let s=sc;
  s+=card(760,70,400,330,L('② 重心まわりの 式',960,120,{size:24,color:CW,weight:700})
   +T(`I\\alpha=${col(CF,'f')}R`,960,205,{size:44})
   +fade(seg(p,.45,.6),L('重力は 重心に かかる',960,290,{size:26})+L('→ トルク 0',960,340,{size:28,color:CF,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'rollcond']:(p)=>{
  let s=T(`Ma=Mg\\sin\\theta-f`,330,90,{size:38})+T(`I\\alpha=fR`,870,90,{size:38});
  s+=fade(seg(p,.05,.2),card(380,140,440,80,L('滑らない',500,190,{size:24,color:CD})+T(`a=R\\alpha`,700,190,{size:38}),1,CH));
  s+=fade(seg(p,.35,.5),T(`\\alpha=\\dfrac{a}{R}\\ \\Rightarrow\\ I\\dfrac{a}{R}=fR`,600,320,{size:44}));
  s+=fade(seg(p,.6,.75),T(`f=\\dfrac{Ia}{R^2}`,600,445,{size:48}));
  return s;
 },
 [K+'rolla']:(p)=>{
  let s=T(`Ma=Mg\\sin\\theta-${col(CF,'f')}`,600,80,{size:42});
  s+=fade(seg(p,.05,.2),T(`Ma=Mg\\sin\\theta-${col(CF,'\\dfrac{Ia}{R^2}')}`,600,200,{size:46}));
  s+=fade(seg(p,.4,.55),L('a の 項を 左へ 集める',600,295,{size:26,color:CD}));
  s+=fade(seg(p,.5,.65),T(`a\\left(M+\\dfrac{I}{R^2}\\right)=Mg\\sin\\theta`,600,400,{size:50}));
  return s;
 },
 [K+'rolla2']:(p)=>{
  let s=T(`a\\left(M+\\dfrac{I}{R^2}\\right)=Mg\\sin\\theta`,600,90,{size:44});
  s+=fade(seg(p,.1,.25),L('(M＋I/R²) で 割り、分母と 分子を M で 割る',600,190,{size:26,color:CD}));
  const e=`a=\\dfrac{g\\sin\\theta}{1+\\dfrac{I}{MR^2}}`,Wd=texWidth(e,52,false);
  s+=fade(seg(p,.35,.5),T(e,600,370,{size:52})+highlight(600-Wd/2-26,252,Wd+52,210,1));
  return s;
 },
 [K+'rollcheck']:(p)=>{
  let s=T(`v^2=2as,\\quad s=\\dfrac{h}{\\sin\\theta}`,600,85,{size:42});
  const e=`v^2=\\dfrac{2gh}{1+\\dfrac{I}{MR^2}}`,Wd=texWidth(e,52,false);
  s+=fade(seg(p,.3,.45),T(e,600,290,{size:52})+highlight(600-Wd/2-26,175,Wd+52,210,1));
  s+=fade(seg(p,.6,.75),ok(600-Wd/2-70,300)+L('前回の エネルギーの 式と 一致',600,470,{size:28,color:CF,weight:700}));
  return s;
 },

 // ===== S3 各部分の速度 =====
 [K+'parts']:(p)=>{
  const {cx,cy}=BW,[px,py]=partXY();
  let s=side()+bigWheel();
  s+=fade(seg(p,.2,.35),ring(px,py,13,{color:CH,w:3,fill:'#3a3220'})+L('mᵢ',px+20,py-18,{size:26,color:CH,weight:700,anchor:'start'}));
  s+=fade(seg(p,.5,.65),arrow(cx,cy,px-(px-cx)*.09,py-(py-cy)*.09,{color:CR,w:5,head:14})+label('𝐫ᵢ',(cx+px)/2+8,(cy+py)/2+34,{size:30,color:CR,weight:700}));
  s+=card(720,110,440,280,L('小さな 部分 i',940,170,{size:28,weight:700})+L('質量 mᵢ',940,235,{size:28,color:CH})+fade(seg(p,.5,.65),L('重心 G から の 矢印 𝐫ᵢ',940,300,{size:28,color:CR})),seg(p,.02,.12));
  return s;
 },
 [K+'vsplit']:(p)=>{
  const {cx,cy}=BW,[px,py]=partXY(),[dx,dy]=cwDir(PA),rl=BW.R*PK*.62;
  let s=side()+bigWheel()+arrow(cx,cy,px-(px-cx)*.09,py-(py-cy)*.09,{color:CR,w:4,head:12,opacity:.6})+ring(px,py,13,{color:CH,w:3,fill:'#3a3220'});
  s+=fade(seg(p,.15,.3),arrow(px,py,px+110,py,{color:CV,w:6,head:15})+T(vG,px+130,py+8,{size:30,anchor:'start'}));
  s+=fade(seg(p,.45,.6),arrow(px,py,px+dx*rl,py+dy*rl,{color:CW,w:6,head:15})+L('回る 速度',px+dx*rl-60,py+dy*rl+30,{size:22,color:CW,weight:700}));
  s+=fade(seg(p,.7,.85),arrow(px,py,px+110+dx*rl,py+dy*rl,{color:CH,w:4,head:13})+T(vi,px+110+dx*rl+18,py+dy*rl+20,{size:30,anchor:'start'}));
  s+=card(760,330,400,140,T(`${vi}=${vG}+\\text{(回る 速度)}`.replace('\\text{(回る 速度)}','\\,?'),960,410,{size:38}),seg(p,.75,.88),CH);
  return s;
 },
 [K+'omega']:(p)=>{
  const {cx,cy}=BW,[px,py]=partXY(),[dx,dy]=cwDir(PA),rl=BW.R*PK*.62;
  let s=side()+bigWheel()+arrow(cx,cy,px-(px-cx)*.09,py-(py-cy)*.09,{color:CR,w:4,head:12,opacity:.6})+ring(px,py,13,{color:CH,w:3,fill:'#3a3220'});
  s+=arrow(px,py,px+dx*rl,py+dy*rl,{color:CW,w:6,head:15})+fade(seg(p,.05,.2),T(Wr,px+dx*rl+14,py+dy*rl-6,{size:30,anchor:'start'}));
  s+=card(740,110,420,280,T(Wr,950,180,{size:44})
   +fade(seg(p,.4,.55),T(W,840,280,{size:40})+L('：回転軸に 沿う',960,288,{size:26})+L('長さ ω の 矢印',950,345,{size:28,color:CW,weight:700})),seg(p,.02,.12),CW);
  return s;
 },
 [K+'screw']:(p)=>{
  const {cx,cy}=BW;
  let s=side()+bigWheel({parts:0});
  s+=turnCW(cx,cy,BW.R+28,-2.5,-.7,{color:CW,w:5,g:seg(p,.05,.2)});
  s+=fade(seg(p,.35,.5),inSym(cx+60,cy+60,24,CW)+T(W,cx+100,cy+70,{size:34,anchor:'start'}));
  s+=card(720,90,440,320,L('右ねじ',940,145,{size:28,weight:700})+L('時計回りに 回すと 奥へ 進む',940,205,{size:26})
   +fade(seg(p,.35,.5),L('右へ 転がる 車輪 ＝ 時計回り',940,275,{size:26,color:CW})+L('→ 𝛚 は 奥向き ⊗',940,335,{size:30,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'size']:(p)=>{
  const {cx,cy}=BW,[px,py]=partXY(),[dx,dy]=cwDir(PA),rl=BW.R*PK*.62;
  let s=side()+bigWheel()+arrow(cx,cy,px-(px-cx)*.09,py-(py-cy)*.09,{color:CR,w:5,head:13})+ring(px,py,13,{color:CH,w:3,fill:'#3a3220'});
  s+=arrow(px,py,px+dx*rl,py+dy*rl,{color:CW,w:6,head:15});
  // right-angle mark
  const ex=(px-cx)/Math.hypot(px-cx,py-cy),ey=(py-cy)/Math.hypot(px-cx,py-cy),q=20;
  s+=fade(seg(p,.5,.65),draw([[px-ex*q,py-ey*q],[px-ex*q+dx*q,py-ey*q+dy*q],[px+dx*q,py+dy*q]],1,{color:CH,w:3}));
  s+=card(660,90,500,330,L('外積・中級',910,140,{size:24,color:CD})
   +T(`|${Wr}|=${w}\\,${ris}\\sin 90^\\circ`,910,220,{size:38})+T(`=${ris}${w}`,910,290,{size:40})
   +fade(seg(p,.5,.65),L('向き：𝐫ᵢ に 直角',910,375,{size:28,color:CH,weight:700})),seg(p,.02,.12));
  return s;
 },
 [K+'comp']:(p)=>{
  const {cx,cy,R}=BW,tx=cx,ty=cy-R;
  let s=side()+bigWheel({parts:0})+inSym(cx+60,cy+60,22,CW)+arrow(60,140,130,140,{color:CD,w:3,head:12})+label('x',138,148,{size:24,color:CD})+arrow(60,140,60,70,{color:CD,w:3,head:12})+label('y',70,78,{size:24,color:CD})+ring(60,200,12,{color:CD,w:3})+dot(60,200,4,CD)+label('z',80,207,{size:24,color:CD})+label('手前',60,245,{size:22,color:CD,anchor:'middle'});
  s+=arrow(cx,cy,tx,ty+16,{color:CR,w:5,head:14})+label('𝐫',cx+12,cy-R/2,{size:28,color:CR,weight:700})+dot(tx,ty,9,CH);
  s+=fade(seg(p,.7,.85),arrow(tx,ty,tx+120,ty,{color:CW,w:6,head:15})+L('前向き',tx+70,ty-16,{size:22,color:CW,weight:700}));
  s+=card(640,60,520,410,L('一番上の 点',900,105,{size:24,color:CD})
   +T(`${W}=(0,\\,0,\\,-\\omega)`,900,165,{size:34})+T(`${col(CR,'\\mathbf{r}')}=(0,\\,R,\\,0)`,900,220,{size:34})
   +fade(seg(p,.3,.45),L('x 成分',900,280,{size:24,color:CD})+T(`0\\times 0-(-\\omega)\\times R`,900,335,{size:34}))
   +fade(seg(p,.5,.65),T(`=R\\omega\\ \\ (>0)`,900,400,{size:36})+L('y・z 成分は 0',900,450,{size:22,color:CD})),seg(p,.02,.12));
  return s;
 },
 [K+'vform']:(p)=>{
  const {cx,cy,R,gy}=BW,v=95;
  let s=side()+ground(40,660,gy)+ring(cx,cy,R,{color:CD,w:6,fill:'#141d33'})+gDot(cx,cy);
  const pts=[[cx,cy-R,1],[cx,cy,0],[cx,cy+R,-1]];
  pts.forEach(([x,y,k],i)=>{const g=seg(p,.05+.15*i,.2+.15*i);
   s+=fade(g,arrow(x,y-10,x+v,y-10,{color:CV,w:5,head:13})+(k?arrow(x,y+10,x+k*v,y+10,{color:CW,w:5,head:13}):''));
   s+=dot(x,y,8,CH);});
  s+=fade(seg(p,.05,.2),T(`v_G+R\\omega`,cx+v+24,cy-R+8,{size:30,anchor:'start',color:CH}));
  s+=fade(seg(p,.35,.5),T(`v_G-R\\omega=0`,cx+v+24,cy+R-14,{size:30,anchor:'start',color:CH}));
  s+=card(720,140,440,230,L('中級の 2本の 矢印',940,195,{size:24,color:CD})+T(`${vi}=${vG}+${Wr}`,940,280,{size:40}),seg(p,.55,.7),CH);
  return s;
 },

 // ===== S4 交差項が消える =====
 [K+'dumb']:(p)=>{
  const gy=460,cx=200+240*seg(p,0,1),cy=260,ang=-Math.PI/2+1.6*Math.PI*seg(p,0,1);
  let s=side()+ground(40,760,gy)+dumbbell(cx,cy,ang);
  s+=L('G',cx-24,cy-12,{size:24,weight:700});
  s+=card(820,110,340,250,L('軽い 棒 ＋ 同じ 質量の 玉',990,170,{size:24})+L('右へ 進めながら',990,235,{size:26,color:CV,weight:700})+L('時計回りに 回す',990,285,{size:26,color:CW,weight:700}),seg(p,.1,.22));
  return s;
 },
 [K+'dumb2']:(p)=>{
  const cx=360,cy=260,r=130,v=120,u=50;
  let s=side()+dumbbell(cx,cy,-Math.PI/2,{r})+L('G',cx-24,cy-12,{size:24,weight:700});
  s+=fade(seg(p,.05,.2),arrow(cx+24,cy-r,cx+24+v,cy-r,{color:CV,w:6,head:15})+arrow(cx+24,cy+r,cx+24+v,cy+r,{color:CV,w:6,head:15})+L('v',cx+24+v+16,cy-r+8,{size:28,color:CV,weight:700})+L('v',cx+24+v+16,cy+r+8,{size:28,color:CV,weight:700}));
  s+=fade(seg(p,.35,.5),arrow(cx+24,cy-r+28,cx+24+u,cy-r+28,{color:CW,w:6,head:13})+L('u',cx+24+u+16,cy-r+36,{size:28,color:CW,weight:700}));
  s+=fade(seg(p,.6,.75),arrow(cx-24,cy+r+28,cx-24-u,cy+r+28,{color:CW,w:6,head:13})+L('u',cx-24-u-16,cy+r+36,{size:28,color:CW,weight:700}));
  s+=card(720,110,440,280,L('上の 玉',940,165,{size:26})+fade(seg(p,.35,.5),T('v+u',940,220,{size:42}))+L('下の 玉',940,290,{size:26})+fade(seg(p,.6,.75),T('v-u',940,345,{size:42})),seg(p,.02,.12));
  return s;
 },
 [K+'dumb3']:(p)=>{
  let s=L('速さの 2乗',600,60,{size:26,color:CD});
  s+=L('上',170,185,{size:28,weight:700})+T(`(v+u)^2=v^2${col(CH,'+2vu')}+u^2`,600,185,{size:48});
  s+=fade(seg(p,.45,.6),L('下',170,345,{size:28,weight:700})+T(`(v-u)^2=v^2${col(CH,'-2vu')}+u^2`,600,345,{size:48}));
  return s;
 },
 [K+'dumb4']:(p)=>{
  let s=T(`(v+u)^2=v^2+2vu+u^2`,600,70,{size:36})+T(`(v-u)^2=v^2-2vu+u^2`,600,135,{size:36});
  const e=`(v+u)^2+(v-u)^2=2v^2${col(CH,'+2vu-2vu')}+2u^2`;
  s+=fade(seg(p,.05,.2),T(e,600,260,{size:44}));
  s+=strikeT(e,`(v+u)^2+(v-u)^2=2v^2`,`${col(CH,'+2vu-2vu')}`,44,260,seg(p,.25,.4));
  s+=fade(seg(p,.45,.6),T(`=${col(CE,'2v^2')}+${col(CW,'2u^2')}`,600,370,{size:50}));
  s+=fade(seg(p,.65,.8),L('並進の 分',520,450,{size:26,color:CE,weight:700})+L('回転の 分',700,450,{size:26,color:CW,weight:700}));
  return s;
 },
 [K+'expand']:(p)=>{
  let s=L('一般の 剛体',600,60,{size:26,color:CD});
  s+=T(`${vi}=${vG}+${Wr}`,600,170,{size:50});
  s+=fade(seg(p,.35,.5),T(`${vis}^2=${vi}\\cdot${vi}`,600,320,{size:50})+L('自分 自身との 内積',600,410,{size:26,color:CD}));
  return s;
 },
 [K+'expand2']:(p)=>{
  const e=`${vis}^2=${vGs}^2+2\\,${vG}\\cdot(${Wr})+|${Wr}|^2`;
  let s=T(`${vi}\\cdot${vi}=(${vG}+${Wr})\\cdot(${vG}+${Wr})`,600,90,{size:38});
  s+=fade(seg(p,.1,.25),T(e,600,250,{size:46}));
  s+=boxT(e,`${vis}^2=${vGs}^2+`,`2\\,${vG}\\cdot(${Wr})`,46,250,seg(p,.5,.65));
  const [x0,wd]=span(e,`${vis}^2=${vGs}^2+`,`2\\,${vG}\\cdot(${Wr})`,46);
  s+=fade(seg(p,.55,.7),L('交差項',x0+wd/2,350,{size:32,color:CH,weight:700}));
  return s;
 },
 [K+'sumK']:(p)=>{
  const e=`K=\\tfrac12 M${vGs}^2+${vG}\\cdot\\sum m_i(${Wr})+\\tfrac12\\sum m_i|${Wr}|^2`;
  let s=T(`K=\\sum\\tfrac12 m_i ${vis}^2`,600,80,{size:40});
  s+=fade(seg(p,.1,.25),T(e,600,230,{size:40}));
  s+=boxT(e,'K=',`\\tfrac12 M${vGs}^2`,40,230,seg(p,.5,.65),CE);
  s+=fade(seg(p,.6,.75),T(`\\sum m_i=M`,330,370,{size:40})+L('最初の 和',330,440,{size:24,color:CE,weight:700}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=L('真ん中の 和',600,60,{size:26,color:CD});
  s+=T(`${vG}\\cdot\\sum m_i(${W}\\times${ri})`,600,170,{size:50});
  s+=fade(seg(p,.3,.45),L('𝛚 は どの 部分でも 共通 → 分配法則で 外へ',600,265,{size:26,color:CW,weight:700}));
  s+=fade(seg(p,.5,.65),T(`=${vG}\\cdot\\left(${W}\\times\\sum m_i${ri}\\right)`,600,380,{size:50}));
  return s;
 },
 [K+'seesaw']:(p)=>{
  // plank balanced at G: mass 2 at x=-1, mass 1 at x=+2 → 2·(−1)+1·2=0
  const cx=420,cy=260,k=110,tilt=0;
  let s=poly([[cx,cy+8],[cx-26,cy+60],[cx+26,cy+60]],{fill:CD,fo:.6,stroke:CD})+line(cx-300,cy,cx+300,cy,{color:C.ink,w:6});
  s+=L('G',cx,cy+90,{size:24,weight:700});
  s+=ring(cx-k,cy-34,34,{color:C.ink,w:3,fill:'#2c3854'})+L('2',cx-k,cy-25,{size:26,weight:700})+ring(cx+2*k,cy-24,24,{color:C.ink,w:3,fill:'#2c3854'})+L('1',cx+2*k,cy-16,{size:24,weight:700});
  s+=fade(seg(p,.2,.35),arrow(cx,cy+25,cx-k,cy+25,{color:CR,w:4,head:12})+arrow(cx,cy+25,cx+2*k,cy+25,{color:CR,w:4,head:12})+L('−1',cx-k/2,cy+60,{size:24,color:CR})+L('＋2',cx+k,cy+60,{size:24,color:CR}));
  s+=fade(seg(p,.4,.55),T(`2\\times(-1)+1\\times 2=0`,cx,cy+150,{size:36}));
  s+=card(800,70,360,360,T(`\\sum m_i${ri}=\\mathbf{0}`,980,160,{size:40})
   +L('重心から 測った 位置',980,240,{size:24})+L('× 質量 の 和',980,280,{size:24})
   +fade(seg(p,.55,.7),L('重心で 釣り合う',980,350,{size:28,color:CH,weight:700})+L('（慣性モーメント・上級）',980,395,{size:22,color:CD})),seg(p,.02,.12),CH);
  return s;
 },
 [K+'cross0']:(p)=>{
  const e=`K=\\tfrac12 M${vGs}^2+${vG}\\cdot(${W}\\times\\mathbf{0})+\\tfrac12\\sum m_i|${Wr}|^2`;
  let s=T(e,600,140,{size:40});
  s+=strikeT(e,`K=\\tfrac12 M${vGs}^2+`,`${vG}\\cdot(${W}\\times\\mathbf{0})`,40,140,seg(p,.1,.25));
  const [x0,wd]=span(e,`K=\\tfrac12 M${vGs}^2+`,`${vG}\\cdot(${W}\\times\\mathbf{0})`,40);
  s+=fade(seg(p,.1,.25),L('＝ 0',x0+wd/2,230,{size:32,color:BAD,weight:700}));
  s+=fade(seg(p,.45,.6),card(250,300,700,150,L('棒と 玉の 例',600,350,{size:24,color:CD})+T(`+2vu-2vu=0`,600,410,{size:40}),1,CH));
  return s;
 },
 [K+'last']:(p)=>{
  let s=L('最後の 和',600,55,{size:26,color:CD});
  s+=T(`|${Wr}|=${ris}${w}`,600,140,{size:46});
  s+=fade(seg(p,.2,.35),T(`\\tfrac12\\sum m_i|${Wr}|^2=\\tfrac12\\left(\\sum m_i ${ris}^2\\right)${w}^2`,600,270,{size:44}));
  const e=`=\\tfrac12 I_G${w}^2`;
  s+=fade(seg(p,.45,.6),T(e,600,380,{size:52}));
  s+=fade(seg(p,.65,.8),T(`I_G`,330,472,{size:34,color:CH})+L('：重心を 通る 軸の 慣性モーメント',360,470,{size:26,color:CH,weight:700,anchor:'start'}));
  return s;
 },
 [K+'result']:(p)=>{
  const e=`K=${col(CE,`\\tfrac12 M${vGs}^2`)}+${col(CW,`\\tfrac12 I_G\\omega^2`)}`,Wd=texWidth(e,64,false);
  let s=T(e,600,200,{size:64})+highlight(600-Wd/2-30,105,Wd+60,170,seg(p,.1,.25));
  s+=fade(seg(p,.3,.45),L('重心の 並進',600-Wd/4,330,{size:28,color:CE,weight:700})+L('重心まわりの 回転',600+Wd/4,330,{size:28,color:CW,weight:700}));
  s+=fade(seg(p,.55,.7),L('交差項が 消えた から 分けられる',600,420,{size:30,color:CH,weight:700}));
  return s;
 },

 // ===== S5 2つの見方 =====
 [K+'disk']:(p)=>{
  const gy=440,R=110,cx=200+150*seg(p,0,1),cy=gy-R;
  let s=side()+ground(40,700,gy)+ring(cx,cy,R,{color:CD,w:3,fill:'#8fa6cf'})+(()=>{const a=(cx-200)/R+Math.PI/2;return line(cx,cy,cx+R*.9*Math.cos(a),cy+R*.9*Math.sin(a),{color:C.bg,w:4});})()+dot(cx,cy,6,C.bg);
  s+=arrow(cx,cy-R-24,cx+110,cy-R-24,{color:CV,w:6,head:15})+T(`v=3${U('m/s')}`,cx+130,cy-R-16,{size:30,anchor:'start'});
  s+=card(780,140,380,200,T(`M=2${U('kg')}`,970,210,{size:40})+L('滑らずに 転がる 円板',970,285,{size:26}),seg(p,.05,.18));
  return s;
 },
 [K+'diskG']:(p)=>{
  let s=L('重心で 分ける',600,50,{size:26,color:CV,weight:700});
  s+=T(`\\tfrac12\\times 2\\times 3^2=9${U('J')}`,330,130,{size:38});
  s+=fade(seg(p,.3,.45),T(`\\tfrac12\\times\\tfrac12 MR^2\\times\\left(\\tfrac{3}{R}\\right)^2=4.5${U('J')}`,840,130,{size:36}));
  const yb=440,sc=16;
  s+=bar(270,yb,120,9*sc,CE,'9 J','並進')+fade(seg(p,.3,.45),bar(780,yb,120,4.5*sc,CW,'4.5 J','回転'));
  s+=fade(seg(p,.6,.75),L('R は 約分で 消える',840,200,{size:24,color:CD})+card(450,290,300,100,T(`9+4.5=13.5${U('J')}`,600,350,{size:34}),1,CH));
  s+=line(120,yb,1080,yb,{color:CD,w:2});
  return s;
 },
 [K+'diskP']:(p)=>{
  const gy=450,R=130,cx=300,cy=gy-R,v=70;
  let s=side()+ground(40,640,gy)+ring(cx,cy,R,{color:CD,w:3,fill:'#8fa6cf'})+dot(cx,cy,6,C.bg);
  s+=ring(cx,gy,12,{color:CH,w:3,fill:C.bg})+L('P',cx-30,gy-10,{size:26,color:CH,weight:700});
  // velocities ∝ distance from P (rotation about P, clockwise)
  const g=seg(p,.1,.3);
  for(const [x,y] of [[cx,cy-R],[cx,cy],[cx+R,cy],[cx-R,cy]]){
   const dx=x-cx,dy=y-gy,k=v/R; // ω×(r−P) for clockwise: velocity = k*( -dy , dx )*(-1)? clockwise in screen: (−dy, dx) rotated
   const vx=-dy*k,vy=dx*k; s+=fade(g,arrow(x,y,x+vx,y+vy,{color:CH,w:5,head:13}));
  }
  s+=turnCW(cx,gy,R*2+30,-2.0,-1.1,{color:CW,w:5,g:seg(p,.25,.4)});
  s+=card(680,80,480,340,L('この 瞬間は 接地点 P の',920,130,{size:26})+L('まわりの 回転',920,170,{size:26,color:CW,weight:700})
   +fade(seg(p,.5,.65),L('平行軸の 定理',920,240,{size:24,color:CD})+T(`I_P=\\tfrac12 MR^2+MR^2`,920,300,{size:38})+T(`=1.5MR^2`,920,365,{size:40})),seg(p,.02,.12));
  return s;
 },
 [K+'diskP2']:(p)=>{
  let s=T(`\\tfrac12 I_P\\omega^2=\\tfrac12\\times 1.5MR^2\\times\\left(\\tfrac{3}{R}\\right)^2`,600,100,{size:42});
  s+=fade(seg(p,.2,.35),T(`=0.75\\times 2\\times 9=13.5${U('J')}`,600,210,{size:46}));
  s+=fade(seg(p,.55,.7),card(330,290,540,120,T(`9+4.5=13.5${U('J')}`,600,365,{size:40})+ok(800,362),1,CF));
  return s;
 },
 [K+'diskP3']:(p)=>{
  let s=T(`K=\\tfrac12 I_P\\omega^2=\\tfrac12 Mv^2\\times\\dfrac{I_P}{MR^2}`,600,95,{size:40});
  s+=fade(seg(p,.1,.25),T(`\\dfrac{I_P}{MR^2}=\\dfrac{I_G+MR^2}{MR^2}=1+\\dfrac{I_G}{MR^2}`,600,225,{size:44}));
  s+=fade(seg(p,.3,.45),L('坂の 式の 分母',600,315,{size:26,color:CH,weight:700}));
  s+=fade(seg(p,.5,.65),card(250,350,700,120,L('球',360,418,{size:28,weight:700})+T(`1+\\tfrac25=1.4`,600,418,{size:42})+ok(830,415),1,CF));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=T(`\\tfrac12 Mv^2+\\tfrac12 I_P\\omega^2=9+13.5=22.5${U('J')}`,600,110,{size:42})+ng(1110,112,seg(p,.15,.3));
  s+=fade(seg(p,.25,.4),L('接地点の I は 並進の 分 MR² を すでに 含む → 2回 数える',600,200,{size:26,color:BAD,weight:700}));
  s+=fade(seg(p,.5,.65),card(200,270,800,170,L('並進 ½Mv² と 組むのは',600,320,{size:28})+T(`I_G=\\tfrac12 MR^2`,600,385,{size:42})+L('（重心を 通る 軸）',600,428,{size:22,color:CD}),1,CH));
  return s;
 },
 [K+'limit']:(p)=>{
  const cx=280,cy=260,a=-20+40*Math.sin(p*Math.PI);
  let s=`<g transform="rotate(${a.toFixed(1)} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="150" ry="55" fill="#26324d" stroke="${CD}" stroke-width="3"/>${line(cx,cy-170,cx,cy+170,{color:CH,w:3,dash:'8 7'})}</g>`;
  s+=L('軸の 向きも 変わる',cx,cy+210,{size:24,color:CD});
  s+=card(600,100,560,300,L('一般の 3次元の 回転',880,160,{size:28,weight:700})+L('1つの I では 足りない',880,225,{size:28})
   +fade(seg(p,.4,.55),L('→ 慣性テンソル（名前だけ）',880,300,{size:28,color:CH,weight:700})+L('この 範囲の 外',880,355,{size:24,color:CD})),seg(p,.02,.12));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=card(80,70,500,200,L('重心の 並進',330,120,{size:28,color:CV,weight:700})+T(`M${aG}=${Fx}`,330,205,{size:46}),seg(p,.02,.15));
  s+=card(620,70,500,200,L('重心まわりの 回転',870,120,{size:28,color:CW,weight:700})+T(`I_G\\,${col(C.a,'\\alpha')}=N_G`,870,205,{size:46}),seg(p,.2,.33));
  s+=card(200,310,800,150,L('エネルギー：交差項が 消えて',600,355,{size:26,color:CD})+T(`K=${col(CE,`\\tfrac12 M${vGs}^2`)}+${col(CW,`\\tfrac12 I_G\\omega^2`)}`,600,420,{size:44}),seg(p,.5,.63),CH);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=ground(40,1160,440);
  // observer on the ground
  const ox=260;
  s+=ring(ox,300,20,{color:C.ink,w:3,fill:'#2c3854'})+line(ox,320,ox,390,{color:C.ink,w:6})+line(ox,390,ox-20,438,{color:C.ink,w:5})+line(ox,390,ox+20,438,{color:C.ink,w:5})+line(ox-30,345,ox+30,345,{color:C.ink,w:5});
  s+=L('地上の 観測者（慣性系）',ox,250,{size:26,color:CH,weight:700});
  s+=card(560,90,560,180,L('ここまで',840,140,{size:24,color:CD})+L('地上の 慣性系・平面の 回転',840,205,{size:30,weight:700}),seg(p,.05,.2));
  s+=card(560,300,560,130,L('一般の 3次元の 回転',840,350,{size:26})+L('→ 慣性テンソル（この 範囲の 外）',840,400,{size:26,color:CH,weight:700}),seg(p,.5,.62),CH);
  return s;
 },
 [K+'next2']:(p)=>{
  const cx=260,cy=270,rot=p*2.4;
  let s=`<ellipse cx="${cx}" cy="${cy+60}" rx="190" ry="55" fill="#26324d" stroke="${CD}" stroke-width="3"/>`;
  const ox=cx+120*Math.cos(rot),oy=cy+60+35*Math.sin(rot);
  s+=ring(ox,oy-80,16,{color:C.ink,w:3,fill:'#2c3854'})+line(ox,oy-64,ox,oy-10,{color:C.ink,w:5});
  s+=L('回る 台',cx,cy+150,{size:22,color:CD});
  s+=L('回る 観測者',cx,cy-120,{size:26,color:CW,weight:700});
  // ellipse orbit
  s+=fade(seg(p,.35,.5),`<ellipse cx="960" cy="380" rx="150" ry="85" fill="none" stroke="${CH}" stroke-width="3" stroke-dasharray="8 7"/>`+dot(1030,380,14,C.t)+dot(960+150*Math.cos(-.6+p*2),380+85*Math.sin(-.6+p*2),8,C.x));
  s+=card(560,60,600,200,L('次の 問い',860,105,{size:24,color:CD})+L('回る 観測者の 運動方程式に 何が 加わる？',860,160,{size:26,weight:700})
   +fade(seg(p,.35,.5),L('万有引力の 下で、軌道は なぜ 楕円？',860,215,{size:26,color:CH,weight:700})),seg(p,0,.12),CH);
  return s;
 },
};

function hammerAt(x,y,a){ // heavy head (3) at 30 px from CM, handle end (1) at 90 px on the other side
 const hx=x+30*Math.cos(a),hy=y+30*Math.sin(a),ex=x-90*Math.cos(a),ey=y-90*Math.sin(a);
 return line(hx,hy,ex,ey,{color:CD,w:5})+ring(hx,hy,20,{color:C.ink,w:3,fill:'#4a5674'})+dot(ex,ey,7,C.ink)+dot(x,y,6,CH);
}
function bar(x,yb,wd,hpx,color,val,lab){
 return rect(x,yb-hpx,wd,hpx,{fill:color,fo:.55,stroke:color,rx:4})+L(val,x+wd/2,yb-hpx-12,{size:26,color,weight:700})+L(lab,x+wd/2,yb+32,{size:22,color:CD});
}
