// YouTube シリーズ「運動量・上級 2/2」(ys-uc-momentum-2) — 図。Stage 1200×515.
// 色：運動量 p 桃（運動量保存の式・直線）、反発係数 e 黄、速度 v 紫、運動エネルギー K 橙、外力 赤、強調 黄、誤り 赤、確かめ 緑。
// 数値：m₁＝2、v₁＝3、m₂＝1、v₂＝0 → v₁′＝2−e、v₂′＝2＋2e。e＝0：2,2（6 J）、0.5：1.5,3（6.75 J）、1：1,4（9 J）。減少 3(1−e²)。
// 衝突アニメ（px）：接触まで 3 m/s＝800 px/単位、後は v′×(800/3)。
import {C,seg,fade,clamp,label,line,rect,dot,ring,arrow,brace,axes,tex,texWidth,draw,cart} from './anim.mjs';

const K='uc-momentum-2:';
const CP=C.p,CE=C.hi,CV=C.v,CK=C.E,CT=C.t,CD=C.dim,OK=C.F,BAD=C.a,CX=C.a,CF=C.F;
const cc=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,color:C.ink,...o});
const TF=(s,x,y,maxW,size=44,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const L=(s,x,y,o={})=>label(s,x,y,{size:26,color:C.ink,anchor:'middle',...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=14,color=OK)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=14,color=BAD)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color,w:5});

// ---- symbols ----
const t=cc(CT,'t'),e=cc(CE,'e');
const v1=cc(CV,'v_1'),v2=cc(CV,'v_2'),u1=cc(CV,"v_1'"),u2=cc(CV,"v_2'");
const PH='\\vphantom{\\dfrac{d\\mathbf P}{dt}}';
function seq(parts,x,y,size=44,{anchor='middle'}={}){
 const ws=parts.map(q=>q.j?size*.6*q.j.length+4:texWidth(PH+q.t,size,false));
 const tot=ws.reduce((a,b)=>a+b,0);let cx=anchor==='middle'?x-tot/2:anchor==='end'?x-tot:x,base=y,s='';
 parts.forEach((q,i)=>{
  if(q.t!==undefined){const g=T(PH+q.t,cx,y,{size,anchor:'start'});const m=g.match(/translate\(([-\d.]+) ([-\d.]+)\)/);if(m)base=+m[2];s+=g;}
  else s+=label(q.j,cx+1,base+size*.22,{size:Math.round(size*.6),color:q.c??CX,weight:700});
  cx+=ws[i];
 });
 return s;
}
const MOM=`m_1${v1}+m_2${v2}=m_1${u1}+m_2${u2}`;
const RES=`${e}=\\dfrac{${u2}-${u1}}{${v1}-${v2}}`;
const V1F=`${u1}=\\dfrac{(m_1-${e}m_2)${v1}+(1+${e})m_2${v2}}{m_1+m_2}`;

// ---- carts ----
const GY=430,W1=150,W2=110;
function carts(x1,x2,{g=1,l1='2 kg',l2='1 kg',w2=W2,h2=52}={}){return fade(g,cart(x1,GY,{w:W1,h:64,color:'#9aabc7',text:l1,size:24})+cart(x2,GY,{w:w2,h:h2,color:'#9aabc7',text:l2,size:24}));}
const track=()=>line(40,GY,1170,GY,{color:CD,w:3});
function posDir(x=50,y=70,g=1){return fade(g,arrow(x,y,x+80,y,{color:CE,w:4,head:14})+label('右向きを 正',x+94,y+8,{size:22,color:CE}));}
function vArrow(x,y,len,txt,{g=1,color=CV}={}){if(Math.abs(len)<2)return fade(g,label(txt,x,y-12,{size:24,color,anchor:'middle',weight:700}));return fade(g,arrow(x,y,x+len,y,{color,w:6,head:16})+label(txt,x+len/2,y-14,{size:24,color,anchor:'middle',weight:700}));}
// bounce with restitution e: before 800 px/unit (3 m/s); contact at u=.4
function bounce(u,ee){u=clamp(u);const a=800/3;if(u<=.4)return {x1:150+800*u,x2:600};const d=u-.4;return {x1:470+(2-ee)*a*d,x2:600+(2+2*ee)*a*d};}

// ---- table of e ----
const ROWS=[[0,2,2,6],[0.5,1.5,3,6.75],[1,1,4,9]];
function table({g=1,kcol=0,kq=0,lost=0,x=110,y=110}={}){
 const cols=[['e',CE],['v₁′',CV],['v₂′',CV],['2v₁′＋v₂′',CP]];if(kcol)cols.push(['K [J]',CK]);if(lost)cols.push(['減った K',BAD]);
 const cw=[110,130,130,200,140,170];let s='',cx=x;
 cols.forEach((c,i)=>{s+=L(c[0],cx+cw[i]/2,y,{size:26,color:c[1],weight:700});cx+=cw[i];});
 s+=line(x,y+16,cx,y+16,{color:CD,w:2});
 ROWS.forEach((r,j)=>{let cx=x;const yy=y+70+j*70;
  const vals=[String(r[0]),String(r[1]),String(r[2]),'6'];if(kcol)vals.push(kq?'？':String(r[3]));if(lost)vals.push(String(+(9-r[3]).toFixed(2)));
  vals.forEach((v,i)=>{s+=L(v,cx+cw[i]/2,yy,{size:30,color:i===3?CP:i===4?CK:i===5?BAD:C.ink,weight:i===3?700:400});cx+=cw[i];});
 });
 return fade(g,s);
}

// ---- (v1', v2') plane ----
function plane(o={}){return axes({x:120,y:470,w:470,h:400,xmin:-0.6,xmax:4,ymin:0,ymax:6.6,xticks:[1,2,3],yticks:[2,4,6],grid:true,xlabel:"v₁′",ylabel:"v₂′",xcolor:CV,ycolor:CV,...o});}
const momLine=(A,g=1)=>fade(g,A.plot(x=>6-2*x,{from:0.2,to:3,color:CP,w:5})+label('2v₁′＋v₂′＝6',A.X(2.2)+10,A.Y(2.2)-22,{size:22,color:CP,anchor:'start',weight:700}));
const resLine=(A,ee,g=1,lab=1)=>fade(g,A.plot(x=>x+3*ee,{from:Math.max(-0.6,-3*ee),to:Math.min(4,6.6-3*ee),color:CE,w:4})+(lab?label(`e ＝ ${ee}`,A.X(Math.min(3.4,6.4-3*ee))+4,A.Y(Math.min(3.4,6.4-3*ee)+3*ee)+4,{size:22,color:CE,anchor:'start',weight:700}):''));

export const ytUcMomentum2Diagrams={
 // ===== S1 =====
 [K+'ask']:(p)=>{
  const {x1,x2}=bounce(seg(p,0,.9),.5);
  let s=track()+carts(x1,x2);
  s+=fade(seg(p,.5,.65),L('くっつかずに 跳ね返る',600,150,{size:30,color:CE,weight:700}));
  return s;
 },
 [K+'ask2']:(p)=>{
  let s=track()+carts(710,1080,{g:.5});
  s+=vArrow(710+80,GY-110,60,'v₁′ ？')+vArrow(1080-150,GY-110,120,'v₂′ ？');
  s+=card(200,90,800,170,L('衝突後の 2つの 速度を 決めるには',600,145,{size:28})+L('もう 1本、何の 式が 要る？',600,210,{size:34,color:CE,weight:700}),seg(p,.2,.35),CE);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=card(150,90,900,330,L('前回（導いた 結果）',600,140,{size:24,color:CD})+seq([{t:`\\dfrac{d${cc(CP,'\\mathbf P')}}{d${t}}=${cc(CX,'\\mathbf F')}`},{j:'外'}],600,230,52)
   +fade(seg(p,.4,.55),seq([{t:cc(CX,'\\mathbf F')},{j:'外'},{t:`=\\mathbf 0\\;\\Rightarrow\\;${cc(CP,'\\mathbf P')}\\text{ }`}],560,340,46)+L('は 一定',770,350,{size:30,color:CP,weight:700})),1,CP);
  return s;
 },
 [K+'setup']:(p)=>{
  let s=posDir()+track()+carts(225,600);
  s+=vArrow(150,GY-110,150,'v₁ ＝ 3 m/s');
  s+=fade(seg(p,.3,.45),L('止まっている：v₂ ＝ 0',600,GY-100,{size:24,color:CV}));
  s+=card(760,110,400,170,L('m₁ ＝ 2 kg，v₁ ＝ 3 m/s',960,170,{size:28})+L('m₂ ＝ 1 kg，v₂ ＝ 0',960,230,{size:28}),seg(p,.4,.55));
  return s;
 },
 [K+'unk']:(p)=>{
  let s=posDir()+track()+carts(600,900,{g:.6});
  s+=vArrow(680,GY-110,60,'v₁′ ？')+vArrow(960,GY-110,90,'v₂′ ？');
  s+=card(80,110,1040,150,L('運動量 保存',190,195,{size:24,color:CP})+T(`2\\times 3+1\\times 0=2${u1}+1\\times ${u2}`,680,185,{size:48}),seg(p,.3,.45),CP);
  return s;
 },
 [K+'unk2']:(p)=>{
  let s=T(`2\\times 3+1\\times 0=2${u1}+1\\times ${u2}`,600,110,{size:40});
  s+=fade(seg(p,.05,.2),arrow(600,145,600,185,{color:CE,w:4,head:12})+label('整理',620,172,{size:24,color:CE}));
  s+=fade(seg(p,.1,.3),T(`2${u1}+${u2}=6`,600,250,{size:60}));
  s+=card(200,330,360,120,L('未知数：2つ',380,400,{size:32,color:CV,weight:700}),seg(p,.4,.55));
  s+=card(640,330,360,120,L('式：1本だけ',820,400,{size:32,color:BAD,weight:700}),seg(p,.55,.7),BAD);
  return s;
 },
 [K+'many']:(p)=>{
  let s=T(`2${u1}+${u2}=6`,600,100,{size:46});
  s+=card(120,170,440,220,T(`${u1}=2,\\;${u2}=2`,340,230,{size:40})+T(`2\\times 2+2=6`,340,310,{size:40})+check(500,305,12),seg(p,.05,.2));
  s+=card(640,170,440,220,T(`${u1}=1,\\;${u2}=4`,860,230,{size:40})+T(`2\\times 1+4=6`,860,310,{size:40})+check(1020,305,12),seg(p,.25,.4));
  s+=fade(seg(p,.6,.75),L('運動量 保存だけでは 決まらない',600,460,{size:30,color:CE,weight:700}));
  return s;
 },
 // ===== S2 =====
 [K+'appr']:(p)=>{
  let s=posDir()+track()+carts(300,700);
  s+=vArrow(240,GY-110,180,'v₁')+vArrow(660,GY-110,70,'v₂');
  s+=L('衝突前',600,140,{size:26,color:CD});
  s+=card(760,180,400,130,L('近づく 速さ',960,225,{size:26,color:CD})+T(`${v1}-${v2}`,960,280,{size:44}),seg(p,.5,.65),CE);
  s+=fade(seg(p,.3,.45),L('1 が 2 に 追いつく 向きが 正（v₁ ＞ v₂）',420,215,{size:24,color:CE}));
  return s;
 },
 [K+'sep']:(p)=>{
  let s=posDir()+track()+carts(300,700);
  s+=vArrow(240,GY-110,60,"v₁′")+vArrow(650,GY-110,150,"v₂′");
  s+=L('衝突後',600,140,{size:26,color:CD});
  s+=card(760,180,400,130,L('離れる 速さ',960,225,{size:26,color:CD})+T(`${u2}-${u1}`,960,280,{size:44}),seg(p,.4,.55),CE);
  return s;
 },
 [K+'def']:(p)=>{
  let s=T(RES,520,250,{size:76});
  const w=texWidth(RES,76,false),x0=520-w/2,wl=texWidth(`${e}=`,76,false);
  s+=fade(seg(p,.2,.35),label('離れる 速さ',x0+w+30,190,{size:28,color:CV})+arrow(x0+w+25,182,x0+w-10,182,{color:CD,w:3,head:12}));
  s+=fade(seg(p,.35,.5),label('近づく 速さ',x0+w+30,320,{size:28,color:CV})+arrow(x0+w+25,312,x0+w-10,312,{color:CD,w:3,head:12}));
  s+=card(330,400,380,80,L('反発係数（定義）',520,450,{size:30,color:CE,weight:700}),seg(p,.6,.75),CE);
  return s;
 },
 [K+'range']:(p)=>{
  const X=u=>200+u*700,y=300;
  let s=arrow(140,y,1000,y,{color:CD,w:3,head:14})+line(X(0),y-10,X(0),y+10,{color:C.ink,w:3})+line(X(1),y-10,X(1),y+10,{color:C.ink,w:3})+L('0',X(0),y+44,{size:28})+L('1',X(1),y+44,{size:28})+label('e',1010,y+8,{size:30,color:CE,weight:700});
  s+=fade(seg(p,.05,.2),rect(X(0),y-14,X(1)-X(0),28,{fill:CE,fo:.25,stroke:'none'}));
  s+=fade(seg(p,.05,.2),L('e ≧ 0：すり抜けない',X(0),y-70,{size:26,color:OK}));
  s+=fade(seg(p,.45,.6),L('e ≦ 1：エネルギーを 加えない',X(1),y-70,{size:26,color:OK})+L('（理由は 後で 数値で）',X(1),y-30,{size:22,color:CD}));
  return s;
 },
 [K+'ends']:(p)=>{
  let s=card(80,110,500,300,L('e ＝ 0',330,170,{size:34,color:CE,weight:700})+T(`${u2}=${u1}`,330,250,{size:46})+L('一緒に 動く ＝ くっつく',330,330,{size:28}),1,CE);
  s+=card(620,110,500,300,L('e ＝ 1',870,170,{size:34,color:CE,weight:700})+L('最も よく 跳ね返る',870,260,{size:30})+L('（離れる 速さ ＝ 近づく 速さ）',870,320,{size:22,color:CD}),seg(p,.5,.65),CE);
  return s;
 },
 [K+'meas']:(p)=>{
  let s=line(80,440,620,440,{color:CD,w:4});for(let q=80;q<620;q+=26)s+=line(q,442,q-14,458,{color:C.faint,w:2});
  s+=L('床（動かない）',350,490,{size:22,color:CD});
  s+=ring(260,400,30,{color:CD,w:3,fill:'#2b3d63'})+fade(seg(p,.1,.25),arrow(200,180,200,360,{color:CV,w:6,head:16})+L('当たる 速さ',200,160,{size:24,color:CV}));
  s+=ring(440,400,30,{color:CD,w:3,fill:'#2b3d63'})+fade(seg(p,.35,.5),arrow(500,360,500,250,{color:CV,w:6,head:16})+L('跳ね返る 速さ',500,230,{size:24,color:CV}));
  s+=card(700,130,450,250,L('物の 組み合わせごとに',925,180,{size:26,color:CD})+L('実験で 測る 値',925,225,{size:28,color:CE,weight:700})+fade(seg(p,.55,.7),L('e ＝ 跳ね返る 速さ ÷ 当たる 速さ',925,310,{size:26,color:CE,weight:700})),1,CE);
  return s;
 },
 [K+'meas2']:(p)=>{
  const Y=h=>440-h*300;
  let s=line(80,440,560,440,{color:CD,w:4});
  s+=line(140,Y(1),300,Y(1),{color:CD,w:2,dash:'6 6'})+L('1 m',110,Y(1)+8,{size:24,color:C.x})+line(300,Y(.25),460,Y(.25),{color:CD,w:2,dash:'6 6'})+L('0.25 m',520,Y(.25)+8,{size:24,color:C.x});
  s+=ring(220,Y(1)+24,22,{color:CD,w:3,fill:'#2b3d63'})+arrow(220,Y(1)+60,250,420,{color:CD,w:2,head:10})+ring(380,Y(.25)+24,22,{color:CD,w:3,fill:'#2b3d63'})+arrow(290,420,370,Y(.25)+52,{color:CD,w:2,head:10});
  s+=card(620,85,540,395,T(`${cc(CV,'v')}=\\sqrt{2gh}`,890,140,{size:42})
   +fade(seg(p,.3,.45),T(`${e}=\\dfrac{\\sqrt{2g\\times 0.25}}{\\sqrt{2g\\times 1}}`,890,275,{size:40}))
   +fade(seg(p,.6,.75),T(`=\\sqrt{0.25}=0.5`,890,405,{size:44})),1,CE);
  return s;
 },
 // ===== S3 =====
 [K+'two']:(p)=>{
  let s=card(80,90,1040,140,L('運動量 保存',200,170,{size:24,color:CP})+T(MOM,690,160,{size:46}),1,CP);
  s+=card(80,270,1040,180,L('反発係数',200,368,{size:24,color:CE})+T(RES,690,360,{size:50}),seg(p,.4,.55),CE);
  return s;
 },
 [K+'solve']:(p)=>{
  let s=T(RES,600,110,{size:44});
  s+=fade(seg(p,.05,.2),label(`両辺 × (v₁ − v₂)`,640,192,{size:24,color:CE})+arrow(600,165,600,205,{color:CE,w:4,head:12}));
  s+=fade(seg(p,.15,.3),T(`${e}(${v1}-${v2})=${u2}-${u1}`,600,255,{size:48}));
  s+=fade(seg(p,.45,.6),label(`v₁′ を 左へ`,640,327,{size:24,color:CE})+arrow(600,300,600,340,{color:CE,w:4,head:12}));
  s+=card(270,370,660,110,T(`${u2}=${u1}+${e}(${v1}-${v2})`,600,430,{size:50}),seg(p,.55,.7),CE);
  return s;
 },
 [K+'subst']:(p)=>{
  let s=T(MOM,600,100,{size:42});
  s+=fade(seg(p,.05,.2),L('v₂′ に 代入',600,165,{size:24,color:CE}));
  s+=fade(seg(p,.1,.3),T(`=m_1${u1}+m_2\\big[${u1}+${e}(${v1}-${v2})\\big]`,640,250,{size:44}));
  s+=fade(seg(p,.55,.7),T(`=m_1${u1}+m_2${u1}+${e}m_2(${v1}-${v2})`,640,370,{size:44})+L('右の 辺',150,378,{size:24,color:CD}));
  return s;
 },
 [K+'collect']:(p)=>{
  let s=T(`m_1${v1}+m_2${v2}=m_1${u1}+m_2${u1}+${e}m_2(${v1}-${v2})`,600,100,{size:40});
  s+=fade(seg(p,.05,.25),T(`m_1${v1}+m_2${v2}=(m_1+m_2)${u1}+${e}m_2(${v1}-${v2})`,600,220,{size:40})+L('v₁′ の 項を まとめる',600,280,{size:24,color:CE}));
  s+=fade(seg(p,.5,.65),T(`m_1${v1}+m_2${v2}-${e}m_2(${v1}-${v2})=(m_1+m_2)${u1}`,600,380,{size:40})+L('左の 辺へ 移す',600,440,{size:24,color:CE}));
  return s;
 },
 [K+'lhs']:(p)=>{
  let s=L('左の 辺',600,90,{size:26,color:CD})+T(`m_1${v1}+m_2${v2}-${e}m_2(${v1}-${v2})`,600,160,{size:46});
  s+=fade(seg(p,.2,.35),T(`=m_1${v1}+m_2${v2}-${e}m_2${v1}+${e}m_2${v2}`,600,270,{size:46}));
  s+=fade(seg(p,.55,.7),T(`=(m_1-${e}m_2)${v1}+(1+${e})m_2${v2}`,600,390,{size:50})+L('v₁ の 項・v₂ の 項',600,455,{size:24,color:CE}));
  return s;
 },
 [K+'v1']:(p)=>{
  let s=T(`(m_1+m_2)${u1}=(m_1-${e}m_2)${v1}+(1+${e})m_2${v2}`,600,100,{size:40});
  s+=fade(seg(p,.05,.2),L('両辺 ÷ (m₁ ＋ m₂)',600,165,{size:24,color:CE}));
  s+=card(170,190,860,180,T(V1F,600,290,{size:50}),seg(p,.15,.3),CE);
  s+=fade(seg(p,.6,.75),T(`${u2}=${u1}+${e}(${v1}-${v2})`,600,420,{size:40})+L('v₂′ は こちらから',960,428,{size:22,color:CD,anchor:'start'}));
  return s;
 },
 [K+'chk0']:(p)=>{
  let s=T(V1F,600,100,{size:40});
  s+=fade(seg(p,.05,.2),L('e ＝ 0 を 入れる',600,175,{size:24,color:CE}));
  s+=fade(seg(p,.15,.3),T(`${u1}=\\dfrac{m_1${v1}+m_2${v2}}{m_1+m_2}`,600,270,{size:52}));
  s+=card(330,350,540,110,L('＝ 前回の 重心の 速さ v_G',600,415,{size:30,color:CE,weight:700}),seg(p,.5,.65),CE);
  return s;
 },
 // ===== S4 =====
 [K+'num']:(p)=>{
  let s=L('m₁ ＝ 2，v₁ ＝ 3，m₂ ＝ 1，v₂ ＝ 0',600,90,{size:28});
  s+=fade(seg(p,.2,.35),T(`${u1}=\\dfrac{(2-${e})\\times 3+(1+${e})\\times 1\\times 0}{2+1}`,600,210,{size:48}));
  s+=fade(seg(p,.55,.7),T(`=\\dfrac{(2-${e})\\times 3}{3}=2-${e}`,600,360,{size:52}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=T(`${u1}=2-${e}`,600,100,{size:46});
  s+=fade(seg(p,.05,.2),T(`${u2}=${u1}+${e}\\times(3-0)`,600,220,{size:48}));
  s+=fade(seg(p,.4,.55),T(`=2-${e}+3${e}=2+2${e}`,600,340,{size:52}));
  return s;
 },
 [K+'tab']:(p)=>{
  let s=table({g:1});
  s+=card(810,110,340,250,L('どの 行も',980,170,{size:26})+L('2v₁′ ＋ v₂′ ＝ 6',980,230,{size:30,color:CP,weight:700})+L('運動量は 保存',980,290,{size:26,color:CP})+check(1090,282,12),seg(p,.55,.7),CP);
  return s;
 },
 [K+'predict']:(p)=>{
  let s=table({kcol:1,kq:1});
  s+=card(880,110,280,250,L('衝突前',1020,170,{size:26,color:CD})+L('K ＝ 9 J',1020,230,{size:34,color:CK,weight:700})+L('e で 変わる？',1020,300,{size:28,color:CE,weight:700}),seg(p,.3,.45),CK);
  return s;
 },
 [K+'kin']:(p)=>{
  let s=table({kcol:1});
  s+=card(880,110,280,260,L('衝突前 9 J',1020,170,{size:26,color:CK})+L('e ＝ 1 だけ',1020,240,{size:30,color:CE,weight:700})+L('K も 保存',1020,295,{size:30,color:CK,weight:700}),seg(p,.55,.7),CK);
  return s;
 },
 [K+'lost']:(p)=>{
  let s=table({kcol:1,lost:1,x:60});
  s+=fade(seg(p,.35,.5),T(`3\\times(1-${e}^2)`,450,400,{size:44})+L('3 × (1 − 0) ＝ 3，3 × 0.75 ＝ 2.25，3 × 0 ＝ 0',450,460,{size:22,color:CD}));
  s+=card(880,330,290,150,L('e ＞ 1 なら 負',1025,385,{size:28,color:BAD,weight:700})+L('→ K が 増える',1025,435,{size:26,color:BAD}),seg(p,.6,.75),BAD);
  return s;
 },
 [K+'plane']:(p)=>{
  const A=plane();
  let s=A.svg+momLine(A,seg(p,.3,.5));
  s+=card(700,130,450,220,L('横軸 v₁′，縦軸 v₂′',925,190,{size:28,color:CV})+fade(seg(p,.3,.45),L('運動量 保存',925,260,{size:28,color:CP,weight:700})+L('＝ 1本の 直線',925,310,{size:28,color:CP})),1);
  return s;
 },
 [K+'plane2']:(p)=>{
  const A=plane();
  let s=A.svg+momLine(A);
  const es=[0,.5,1];
  es.forEach((ee,i)=>{const g=seg(p,.1+i*.2,.2+i*.2),x=2-ee,y=2+2*ee;s+=resLine(A,ee,g*(i===2||p<.3+i*.2+.2?1:.45));s+=fade(g,dot(A.X(x),A.Y(y),10,C.ink)+label(`(${x}, ${y})`,A.X(x)-14,A.Y(y)+6,{size:22,color:C.ink,anchor:'end'}));});
  s+=card(700,130,450,250,L('v₂′ − v₁′ ＝ 3e も 直線',925,190,{size:28,color:CE,weight:700})+L('交点 ＝ 答え',925,250,{size:30})+fade(seg(p,.6,.75),L('e を 変えると 平行に 動く',925,320,{size:26,color:CE})),1,CE);
  return s;
 },
 [K+'plane3']:(p)=>{
  const A=plane();
  let s=A.svg+momLine(A);
  for(let k=0;k<=12;k++){const x=0.25+k*0.22;s+=fade(seg(p,.05+k*.02,.1+k*.02),dot(A.X(x),A.Y(6-2*x),6,CP));}
  s+=card(700,130,450,250,L('1本の 直線上の 点は 無数',925,190,{size:28,color:CP})+fade(seg(p,.45,.6),L('どちらの 式も 1本では',925,260,{size:28})+L('決まらない → 連立',925,310,{size:30,color:CE,weight:700})),1);
  return s;
 },
 // ===== S5 =====
 [K+'same']:(p)=>{
  let s=L('m₁ ＝ m₂ ＝ m，e ＝ 1',600,90,{size:30,color:CE});
  s+=fade(seg(p,.1,.25),T(`m_1-${e}m_2=m-m=0`,600,180,{size:46}));
  s+=fade(seg(p,.45,.6),T(`${u1}=\\dfrac{0\\times ${v1}+2m${v2}}{2m}=${v2}`,600,320,{size:54}));
  return s;
 },
 [K+'same2']:(p)=>{
  let s=T(`${u1}=${v2}`,600,100,{size:48});
  s+=fade(seg(p,.05,.25),T(`${u2}=${v2}+(${v1}-${v2})=${v1}`,600,210,{size:48}));
  s+=card(300,290,600,150,L('速度が そっくり 入れ替わる',600,345,{size:32,color:CE,weight:700})+L('v₁′ ＝ v₂，v₂′ ＝ v₁',600,400,{size:28,color:CV}),seg(p,.5,.65),CE);
  return s;
 },
 [K+'swap']:(p)=>{
  // 1 kg each, +2 and -2 m/s, e=1 → -2, +2
  const u=seg(p,.05,.95),a=150;let x1,x2;
  if(u<=.5){x1=300+2*a*u;x2=740-2*a*u;}else{x1=450-2*a*(u-.5);x2=590+2*a*(u-.5);}
  let s=posDir()+track()+cart(x1,GY,{w:W2,h:52,color:'#9aabc7',text:'1 kg',size:24})+cart(x2,GY,{w:W2,h:52,color:'#9aabc7',text:'1 kg',size:24});
  const before=u<.5;
  s+=vArrow(x1-30,GY-100,before?60:-60,before?'＋2':'−2')+vArrow(x2+30,GY-100,before?-60:60,before?'−2':'＋2');
  s+=card(260,110,680,110,L(before?'初級：右へ 2 m/s と 左へ 2 m/s（1 kg ずつ）':'e ＝ 1：そろって 逆向きに 跳ね返る',600,175,{size:28,color:before?C.ink:CE,weight:before?400:700}),1);
  return s;
 },
 [K+'cradle']:(p)=>{
  const top=100,Lr=250,r=26,n=5,x0=420;let s=line(300,top,900,top,{color:CD,w:4});
  const sw=seg(p,.05,.3),out=seg(p,.35,.6);
  const ang=[-(1-sw)*0.6,0,0,0,out*0.6];
  for(let i=0;i<n;i++){const cx=x0+i*2*r,th=ang[i],bx=cx+Lr*Math.sin(th),by=top+Lr*Math.cos(th);s+=line(cx,top,bx,by,{color:CD,w:2})+ring(bx,by,r,{color:CD,w:3,fill:'#2b3d63'});}
  s+=fade(seg(p,.35,.5),L('反対側の 1個が 同じ 速さで',600,440,{size:28,color:CE,weight:700}));
  s+=fade(seg(p,.65,.8),L('同じ 質量・e ≈ 1 の 衝突が 玉から 玉へ',600,485,{size:24,color:CD}));
  return s;
 },
 [K+'half']:(p)=>{
  let s=card(80,90,1040,120,L('もし 2個が 半分の 速さで 出たら？',600,165,{size:30,color:CE,weight:700}),1,CE);
  s+=card(80,240,500,230,L('運動量',330,290,{size:26,color:CP})+T(`m\\times ${cc(CV,'v')}=2m\\times\\dfrac{${cc(CV,'v')}}{2}`,330,370,{size:40})+check(520,440,14),seg(p,.1,.25),CP);
  s+=card(620,240,500,230,L('運動エネルギー',870,290,{size:26,color:CK})+T(`\\tfrac12 m${cc(CV,'v')}^2\\;\\to\\;2\\times\\tfrac12 m\\Big(\\dfrac{${cc(CV,'v')}}{2}\\Big)^2=\\tfrac14 m${cc(CV,'v')}^2`,870,370,{size:30})+fade(seg(p,.6,.75),cross(1060,440,14)),seg(p,.45,.6),CK);
  return s;
 },
 [K+'half2']:(p)=>{
  let s=card(200,120,800,260,L('e ≈ 1',600,180,{size:34,color:CE,weight:700})+L('運動エネルギーは ほとんど 減らない',600,250,{size:30,color:CK})+fade(seg(p,.45,.6),L('→ 同じ 速さの 1個が 出る',600,320,{size:30,color:CE,weight:700})),1,CE);
  return s;
 },
 [K+'obl']:(p)=>{
  const c1=[330,300],c2=[430,240],R=56,dx=c2[0]-c1[0],dy=c2[1]-c1[1],d=Math.hypot(dx,dy),nx=dx/d,ny=dy/d,tx=-ny,ty=nx;
  let s=ring(c1[0],c1[1],R,{color:CD,w:3,fill:'#2b3d63'})+ring(c2[0],c2[1],R,{color:CD,w:3,fill:'#2b3d63'})+L('1',c1[0],c1[1]+10,{size:28,weight:700})+L('2',c2[0],c2[1]+10,{size:28,weight:700});
  const mx=(c1[0]+c2[0])/2,my=(c1[1]+c2[1])/2;
  s+=fade(seg(p,.1,.25),line(mx-nx*260,my-ny*260,mx+nx*260,my+ny*260,{color:CE,w:3,dash:'10 7'})+label('面に 垂直',mx+nx*265+6,my+ny*265,{size:24,color:CE}));
  s+=fade(seg(p,.25,.4),line(mx-tx*200,my-ty*200,mx+tx*200,my+ty*200,{color:C.x,w:3,dash:'10 7'})+label('面に 沿う',mx+tx*200,my+ty*200+30,{size:24,color:C.x,anchor:'middle'}));
  // velocity of 1 and its components
  const V=[150,-20],vx=c1[0],vy=c1[1];
  s+=fade(seg(p,.4,.55),arrow(vx-V[0],vy-V[1],vx,vy,{color:CV,w:6,head:16})+label('v₁',vx-V[0]-10,vy-V[1]-10,{size:26,color:CV,anchor:'end',weight:700}));
  s+=card(760,130,400,250,L('反発係数 e は',960,190,{size:26})+L('垂直な 向きの',960,250,{size:30,color:CE,weight:700})+L('速度 だけに 使う',960,300,{size:30,color:CE,weight:700}),seg(p,.55,.7),CE);
  return s;
 },
 [K+'obl2']:(p)=>{
  let s=card(80,110,500,300,L('面に 垂直',330,165,{size:30,color:CE,weight:700})+L('運動量 保存',330,240,{size:28,color:CP})+L('＋ 反発係数',330,295,{size:28,color:CE}),1,CE);
  s+=card(620,110,500,300,L('面に 沿う（なめらか）',870,165,{size:30,color:C.x,weight:700})+L('運動量 保存',870,240,{size:28,color:CP})+fade(seg(p,.4,.55),L('力が ない → 各成分は 不変',870,295,{size:26,color:C.x})),seg(p,.2,.35),C.x);
  return s;
 },
 // ===== S6 =====
 [K+'sum']:(p)=>{
  let s=L('まとめ',600,80,{size:30,color:CD});
  s+=fade(seg(p,.05,.2),check(90,150,10)+L('運動量 保存',120,160,{anchor:'start',size:28,color:CP})+T(MOM,800,150,{size:36}));
  s+=fade(seg(p,.25,.4),check(90,260,10)+L('反発係数',120,270,{anchor:'start',size:28,color:CE})+T(RES,800,260,{size:38}));
  s+=fade(seg(p,.5,.65),check(90,380,10)+L('2本を 連立して 衝突後が 決まる',120,390,{anchor:'start',size:30,color:CE,weight:700}));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=L('まとめ',600,80,{size:30,color:CD});
  s+=check(90,150,10)+L('e ＝ 0：くっつく（重心と 一緒）',120,160,{anchor:'start',size:28});
  s+=fade(seg(p,.15,.3),check(90,240,10)+L('e ＝ 1：運動エネルギーも 保存',120,250,{anchor:'start',size:28,color:CK}));
  s+=fade(seg(p,.5,.65),check(90,330,10)+L('同じ 質量で e ＝ 1：速度が 入れ替わる',120,340,{anchor:'start',size:28,color:CE}));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=track()+carts(400,700);
  s+=arrow(330,GY-120,560,GY-120,{color:CP,w:7,head:18})+L('まっすぐ 進む 勢い：運動量 𝐩',600,170,{size:30,color:CP,weight:700}).replace('𝐩','p');
  return s;
 },
 [K+'next2']:(p)=>{
  const O=[300,300],th=seg(p,0,1)*1.2,R=170,P=[O[0]+R*Math.cos(-th),O[1]+R*Math.sin(-th)];
  let s=dot(O[0],O[1],7,C.ink)+label('O',O[0]-16,O[1]+28,{size:24,color:CD})+ring(O[0],O[1],R,{color:C.faint,w:2,dash:'6 6'});
  s+=arrow(O[0],O[1],P[0],P[1],{color:C.x,w:5,head:14})+dot(P[0],P[1],14,'#9aabc7');
  const tx=-Math.sin(-th),ty=Math.cos(-th);
  s+=arrow(P[0],P[1],P[0]+tx*-110,P[1]+ty*-110,{color:CP,w:6,head:16});
  s+=label('r',(O[0]+P[0])/2+10,(O[1]+P[1])/2+26,{size:28,color:C.x,weight:700})+label('p',P[0]-tx*120+8,P[1]-ty*120,{size:28,color:CP,weight:700});
  s+=card(620,110,520,280,L('回転の 勢い',880,165,{size:28,color:CD})+T(`${cc('#ff9ce6','\\mathbf L')}=${cc(C.x,'\\mathbf r')}\\times${cc(CP,'\\mathbf p')}`,880,240,{size:50})+fade(seg(p,.4,.55),L('時間で どう 変わり',880,310,{size:28,color:CE})+L('いつ 保存する？',880,355,{size:30,color:CE,weight:700})),seg(p,.2,.35),CE);
  return s;
 },
};
