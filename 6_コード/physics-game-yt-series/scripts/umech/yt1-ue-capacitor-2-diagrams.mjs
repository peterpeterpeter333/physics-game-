// YouTube シリーズ「コンデンサ・上級 2/2」(ys-ue-capacitor-2) — 図。Stage 1200×515.
// 板は横から見た図：左の板 ＋Q、右の板 −Q、𝐄 は右向き。絶縁体は薄緑。分極：＋の板に面した表面に負（青）、−の板に面した表面に正（赤）。
// 比誘電率 κ、誘電率 ε＝κε₀。C₀・Q₀・U₀ は絶縁体を入れる前の値。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,texWidth} from './anim.mjs';
import {POS,NEG,EC,QC,VC,CC,WC,cs,T,card,L,G,plates,fieldIn,battery,TF,BAD,OK,Qt,Ct,Vt,Et,Ut,ut,St,eps,U_} from './yt1-ue-capacitor-1-diagrams.mjs';

const K='ue-capacitor-2:';
const DC='#9ad6a0',BC=C.F;
const kp='\\kappa';
// dielectric slab between the plates
function slab({g=1,lx=G.LX,rx=G.RX,pt=G.PT,pb=G.PB,pol=0,bound=0,dip=0}={}){
 if(g<=.001)return '';
 const x0=lx+14,x1=rx-14;
 let s=rect(x0,pt+8,x1-x0,pb-pt-16,{fill:DC,fo:.16,stroke:DC,sw:2,rx:6});
 // molecules: little dipoles; shift grows with pol
 const sh=8*pol;
 for(let i=0;i<4;i++)for(let j=0;j<5;j++){const cx=mix(x0+30,x1-30,i/3),cy=mix(pt+45,pb-45,j/4);
  s+=fade(dip,`<ellipse cx="${cx}" cy="${cy}" rx="20" ry="11" fill="none" stroke="${DC}" stroke-width="1.5" opacity=".7"/>`
   +label('−',cx-8-sh,cy+7,{size:18,color:NEG,anchor:'middle',weight:700})+label('+',cx+8+sh,cy+6,{size:18,color:POS,anchor:'middle',weight:700}));}
 if(bound>0)for(let j=0;j<7;j++){const y=mix(pt+30,pb-30,j/6);
  s+=fade(bound,label('−',x0+10,y+8,{size:24,color:NEG,anchor:'middle',weight:700})+label('+',x1-10,y+8,{size:24,color:POS,anchor:'middle',weight:700}));}
 return fade(g,s);
}
function cap({qlab=1,slabG=0,pol=0,bound=0,dip=0,k=1,fieldG=1,bat=0,volt='',lq='+Q',rq='-Q'}={}){
 let s=plates({qlab,lq,rq})+slab({g:slabG,pol,bound,dip})+fieldIn({k,g:fieldG});
 if(bat)s+=battery({volt,g:bat});
 return s;
}
const rightCard=(inner,g=1,stroke=C.faint)=>card(760,80,400,350,inner,g,stroke);

export const ytUeCapacitor2Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=plates({qlab:1})+fieldIn({})+fade(.28,rect(G.LX,G.PT,G.RX-G.LX,G.PB-G.PT,{fill:WC,fo:1,stroke:'none',rx:0}));
  s+=rightCard(L('前回',960,125,{size:24,color:C.dim})+T(`${Ut}=\\tfrac12${Ct}${Vt}^2`,960,210,{size:44})+fade(seg(p,.4,.6),T(`${ut}=\\tfrac12${eps}${Et}^2`,960,320,{size:44})),seg(p,0,.15));
  return s;
 },
 [K+'ask']:(p)=>{
  let s=cap({slabG:seg(p,.1,.3),k:.6});
  s+=rightCard(L('前回の 最後の 問い',960,125,{size:24,color:C.dim})+L('絶縁体を 挟むと',960,195,{size:28})+L('何が 変わる？',960,245,{size:32,color:C.hi,weight:700})
   +fade(seg(p,.5,.65),L('電池に つないだまま',960,320,{size:26})+L('／ 外したら？',960,365,{size:26})),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'promise']:(p)=>{
  let s=card(150,90,900,330,L('中級 コンデンサ 2/2 の 約束',600,140,{size:24,color:C.dim})
   +L('実際の 部品は 絶縁体を 挟んで 容量を 増やす',600,225,{size:30})
   +L('その 仕組みは 上級で',600,290,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.5,.65),L('→ 今回 確かめる',600,360,{size:30,color:OK,weight:700})),seg(p,0,.15));
  return s;
 },
 // ===== S2 =====
 [K+'insert']:(p)=>{
  const u=seg(p,.15,.6);
  let s=plates({qlab:1})+fieldIn({});
  const off=mix(500,0,u);
  s+=`<g transform="translate(0 ${-off})">${slab({})}</g>`;
  s+=rightCard(L('電池を 外す（Q 一定）',960,140,{size:28,color:QC,weight:700})+L('絶縁体を 入れる',960,210,{size:28})
   +fade(seg(p,.6,.75),L('電荷が 自由に 動けない 物',960,290,{size:24,color:DC})),seg(p,0,.15));
  return s;
 },
 [K+'shift']:(p)=>{
  let s=cap({slabG:1,dip:1,pol:seg(p,.2,.6),k:1,fieldG:.5});
  s+=rightCard(L('分子の 中の ＋ と −',960,140,{size:28})+L('電場に 引かれて',960,210,{size:26})+L('少しだけ ずれる',960,255,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.6,.75),L('＋ は 𝐄 の 向き，− は 逆',960,330,{size:24,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'surface']:(p)=>{
  let s=cap({slabG:1,dip:1,pol:1,bound:seg(p,.4,.6),fieldG:.4});
  s+=rightCard(L('分極',960,140,{size:36,color:DC,weight:700})+L('内部：隣どうし 打ち消す',960,215,{size:26})
   +fade(seg(p,.4,.6),L('表面：電荷が 残る',960,285,{size:30,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'signs']:(p)=>{
  let s=cap({slabG:1,dip:.25,pol:1,bound:1,fieldG:.4});
  s+=fade(seg(p,.1,.3),ring(G.LX+24,(G.PT+G.PB)/2,34,{color:NEG,w:3,dash:'5 5'})+ring(G.RX-24,(G.PT+G.PB)/2,34,{color:POS,w:3,dash:'5 5'}));
  s+=rightCard(L('＋の 板の 側：負',960,160,{size:30,color:NEG,weight:700})+L('−の 板の 側：正',960,230,{size:30,color:POS,weight:700})
   +fade(seg(p,.5,.65),L('板の 電荷と 逆の 符号',960,310,{size:28,color:C.hi,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'weaken']:(p)=>{
  const k=mix(1,.5,seg(p,.4,.7));
  let s=cap({slabG:1,dip:.25,pol:1,bound:1,k});
  s+=fade(seg(p,.15,.35),arrow(G.RX-50,G.PB+40,G.LX+50,G.PB+40,{color:BAD,w:4,head:12})+label('表面の 電荷の 電場（逆向き）',(G.LX+G.RX)/2,G.PB+75,{size:22,color:BAD,anchor:'middle'}));
  s+=rightCard(L('元の 電場 ＋ 逆向きの 電場',960,160,{size:26})
   +fade(seg(p,.5,.65),L('中の 電場は 弱くなる',960,240,{size:30,color:EC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'cup']:(p)=>{
  let s=cap({slabG:1,dip:.25,pol:1,bound:1,k:.5});
  s+=rightCard(L('同じ Q で',960,130,{size:26,color:QC})
   +T(`${Et}\\downarrow\\ \\Rightarrow\\ ${Vt}=${Et}d\\ \\downarrow`,960,200,{size:36})
   +fade(seg(p,.4,.6),T(`${Ct}=\\dfrac{${Qt}}{${Vt}\\downarrow}\\ \\uparrow`,960,300,{size:42}))
   +fade(seg(p,.65,.8),L('容量は 増える',960,390,{size:28,color:CC,weight:700})),seg(p,0,.15));
  return s;
 },
 [K+'kappa']:(p)=>{
  let s=cap({slabG:1,dip:.25,pol:1,bound:1,k:.5});
  s+=rightCard(L('比誘電率 κ（カッパ）',960,140,{size:28,color:DC,weight:700})
   +T(`${Et}=\\dfrac{${Et}_0}{${kp}}`,960,250,{size:44})
   +fade(seg(p,.5,.65),L('物質ごとに 実験で 決まる',960,330,{size:26,color:C.dim})),seg(p,0,.15));
  return s;
 },
 [K+'cform']:(p)=>{
  let s=TF(`${Et},\\ ${Vt}\\ \\to\\ \\dfrac{1}{${kp}}\\text{倍}`.replace('\\text{倍}',''),360,90,{size:44})+label('倍',500,100,{size:30,color:C.ink});
  s+=TF(`${Ct}=\\dfrac{${Qt}}{${Vt}}\\ \\to\\ ${kp}\\,${Ct}_0`,820,90,{size:44,g:seg(p,.15,.3)});
  s+=TF(`${Ct}=\\dfrac{${kp}${eps}${St}}{d}=\\dfrac{\\varepsilon ${St}}{d}`,600,270,{size:56,box:true,frac:true,g:seg(p,.35,.55)});
  s+=fade(seg(p,.6,.75),T(`\\varepsilon=${kp}${eps}`,600,430,{size:40})+label('誘電率',720,440,{size:26,color:C.ink}));
  return s;
 },
 [K+'values']:(p)=>{
  let s=card(120,80,960,340,'',1);
  s+=label('物質',300,150,{size:26,color:C.dim,anchor:'middle'})+label('κ',800,150,{size:30,color:DC,anchor:'middle',weight:700});
  [['空気','≈ 1'],['水','≈ 80']].forEach(([a,b],i)=>{s+=fade(seg(p,.05+i*.15,.2+i*.15),label(a,300,220+i*70,{size:32,anchor:'middle'})+label(b,800,220+i*70,{size:32,anchor:'middle',color:DC}));});
  s+=fade(seg(p,.5,.65),label('部品：容量を 増やし、板の 接触も 防ぐ',600,385,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 Q 一定 =====
 [K+'setq']:(p)=>{
  let s=cap({slabG:seg(p,.5,.7),k:mix(1,.5,seg(p,.5,.7)),bound:seg(p,.5,.7),dip:.25*seg(p,.5,.7),pol:1});
  s+=rightCard(L('88.5 pF を 3 V で 充電',960,140,{size:26})+L('→ 電池を 外す',960,200,{size:28,color:QC,weight:700})
   +fade(seg(p,.5,.65),L('κ ＝ 2 の 絶縁体で 満たす',960,280,{size:28,color:DC,weight:700})),seg(p,0,.15));
  return s;
 },
 ...qFixed(),
 [K+'q4']:(p)=>{
  let s=TF(`${Ut}=\\tfrac12\\cdot\\dfrac{\\varepsilon ${St}}{d}\\cdot(${Et}d)^2=\\tfrac12\\varepsilon ${Et}^2\\times ${St}d`,600,120,{size:44});
  s+=fade(seg(p,.1,.25),L('前回と 同じ 計算（ε₀ → ε）',600,220,{size:26,color:C.dim}));
  s+=TF(`${ut}=\\tfrac12\\,\\varepsilon\\,${Et}^2`,600,360,{size:62,box:true,g:seg(p,.35,.55)});
  return s;
 },
 [K+'q5']:(p)=>{
  let s=card(100,60,1000,400,'',1);
  s+=T(`${ut}=\\tfrac12\\times2\\times8.85\\times10^{-12}\\times1500^2\\approx1.99\\times10^{-5}${U_('J/m^3')}`,600,150,{size:34});
  s+=fade(seg(p,.4,.6),T(`1.99\\times10^{-5}\\times10^{-5}${U_('m^3')}=1.99\\times10^{-10}${U_('J')}`,600,270,{size:36}));
  s+=fade(seg(p,.65,.8),L('Q²/(2C) と 一致 ✓',600,380,{size:30,color:OK,weight:700}));
  return s;
 },
 [K+'q6']:(p)=>{
  // slab being pulled in (arrow into the gap)
  const u=seg(p,.05,.6);
  let s=plates({qlab:1})+fieldIn({k:.7});
  s+=`<g transform="translate(0 ${mix(220,0,u)})">${slab({bound:1,dip:.25,pol:1})}</g>`;
  s+=fade(seg(p,.1,.3),arrow((G.LX+G.RX)/2,G.PB+90,(G.LX+G.RX)/2,G.PB+20,{color:BC,w:5,head:14})+label('引き込まれる',(G.LX+G.RX)/2+20,G.PB+70,{size:22,color:BC}));
  s+=rightCard(L('Q 一定：U は 減る',960,140,{size:28,color:WC,weight:700})+L('減った 分 ＝',960,215,{size:26})+L('絶縁体を 引き込む',960,265,{size:28,color:BC,weight:700})+L('力が した 仕事',960,310,{size:28,color:BC,weight:700}),seg(p,0,.15));
  return s;
 },
 // ===== S4 V 一定 =====
 [K+'setv']:(p)=>{
  let s=cap({bat:1,volt:'3 V',slabG:seg(p,.3,.5),bound:seg(p,.3,.5),dip:.25,pol:1});
  s+=rightCard(L('電池に つないだまま',960,140,{size:28,color:VC,weight:700})+L('固定されるのは',960,220,{size:26})+L('電圧 V ＝ 3 V',960,270,{size:32,color:VC,weight:700}),seg(p,0,.15));
  return s;
 },
 ...vFixed(),
 // ===== S5 表 =====
 [K+'tq']:(p)=>tableFig(p,{q:1,v:0}),
 [K+'tv']:(p)=>tableFig(p,{q:1,v:1,gv:seg(p,.05,.3)}),
 [K+'tboth']:(p)=>tableFig(p,{q:1,v:1,hl:seg(p,.3,.5)}),
 // ===== S6 =====
 [K+'sum1']:(p)=>{
  let s=cap({slabG:1,bound:1,dip:.25,pol:1,k:.5});
  s+=rightCard(L('分極 → 逆向きの 電場',960,140,{size:26,color:DC})+L('同じ Q で V が 下がる',960,210,{size:26})
   +T(`${Ct}=${kp}\\,${Ct}_0`,960,300,{size:48}),seg(p,0,.15));
  return s;
 },
 [K+'sum2']:(p)=>tableFig(p,{q:1,v:1,hl:1}),
 [K+'next']:(p)=>{
  // wire with drifting electrons
  let s=rect(90,200,640,110,{fill:'#8795ad',fo:.18,stroke:C.dim,sw:2,rx:10});
  for(let i=0;i<9;i++){const x=90+((i*73+520*(1-p))%640),y=230+(i%3)*25;s+=dot(x,y,8,NEG);}
  s+=arrow(250,150,600,150,{color:EC,w:5,head:16})+label('𝐄',620,160,{size:28,color:EC,weight:700});
  s+=label('電子は 𝐄 と 逆向きに 流れる',410,370,{size:24,color:NEG,anchor:'middle'});
  s+=card(780,90,380,330,L('次の 問い',970,140,{size:24,color:C.dim})
   +L('電子の 平均の 速さは',970,210,{size:28})+L('なぜ 電場に 比例？',970,260,{size:30,color:C.hi,weight:700})
   +fade(seg(p,.5,.65),L('→ オームの 法則',970,340,{size:30,color:C.hi,weight:700})),seg(p,0,.15),C.hi);
  return s;
 },
};

function qFixed(){
 const base=(k=.5)=>cap({slabG:1,bound:1,dip:.25,pol:1,k});
 return {
  [K+'q1']:(p)=>base()+rightCard(L('Q 一定（電池なし）',960,130,{size:26,color:QC,weight:700})
   +T(`${Qt}\\approx2.66\\times10^{-10}${U_('C')}`,960,205,{size:34})+L('のまま',960,255,{size:24,color:C.dim})
   +fade(seg(p,.45,.6),T(`${Ct}=2\\times88.5=177${U_('pF')}`,960,330,{size:34})),seg(p,0,.15)),
  [K+'q2']:(p)=>base()+rightCard(L('V ＝ Q/C',960,130,{size:26,color:C.dim})
   +T(`${Vt}=\\dfrac{3${U_('V')}}{2}=1.5${U_('V')}`,960,215,{size:38})
   +fade(seg(p,.45,.6),T(`${Et}:\\ 3000\\ \\to\\ 1500${U_('V/m')}`,960,320,{size:34})),seg(p,0,.15)),
  [K+'q3']:(p)=>base()+rightCard(T(`${Ut}=\\dfrac{${Qt}^2}{2${Ct}}`,960,150,{size:42})
   +L('Q 同じ・C 2倍 → 半分',960,240,{size:26})
   +fade(seg(p,.45,.6),T(`\\approx1.99\\times10^{-10}${U_('J')}`,960,320,{size:36}))+L('（U₀ ≈ 3.98×10⁻¹⁰ J の 半分）',960,385,{size:22,color:C.dim}),seg(p,0,.15)),
 };
}
function vFixed(){
 const base=(o={})=>cap({bat:1,volt:'3 V',slabG:1,bound:1,dip:.25,pol:1,k:1,...o});
 return {
  [K+'v1']:(p)=>base()+rightCard(T(`${Et}=\\dfrac{${Vt}}{d}=3000${U_('V/m')}`,960,140,{size:34})+L('（同じ）',960,195,{size:24,color:C.dim})
   +fade(seg(p,.4,.6),T(`${Qt}=${Ct}${Vt}=2${Qt}_0`,960,280,{size:40})+T(`\\approx5.3\\times10^{-10}${U_('C')}`,960,350,{size:34})),seg(p,0,.15)),
  [K+'v2']:(p)=>{
   let s=base();
   // electrons flowing: + plate -> battery -> - plate (below)
   const bx=(G.LX+G.RX)/2,a=G.LX-G.PW/2,b=G.RX+G.PW/2,wy=460;
   for(let i=0;i<3;i++){const u=((p*2)+i/3)%1;const x1=u<.5?a:mix(a,bx-10,(u-.5)*2),y1=u<.5?mix(G.PB,wy,u*2):wy;s+=dot(x1,y1,9,NEG);
    const x2=u<.5?mix(bx+10,b,u*2):b,y2=u<.5?wy:mix(wy,G.PB,(u-.5)*2);s+=dot(x2,y2,9,NEG);}
   s+=rightCard(L('増えた 電荷 Q₀ が 流れ込む',960,140,{size:26,color:QC,weight:700})
    +L('電子：＋の 板 → 電池 → −の 板',960,220,{size:24,color:NEG}),seg(p,0,.15));
   return s;
  },
  [K+'v3']:(p)=>base()+rightCard(T(`${Ut}=\\tfrac12${Ct}${Vt}^2`,960,140,{size:42})
   +L('V 同じ・C 2倍 → 2倍',960,225,{size:26})
   +fade(seg(p,.45,.6),T(`=2${Ut}_0\\approx7.96\\times10^{-10}${U_('J')}`,960,310,{size:32})),seg(p,0,.15)),
  [K+'battery']:(p)=>{
   let s=card(100,50,1000,420,'',1);
   s+=L('電池の 仕事（3 V で Q₀ を 送り出す）',600,105,{size:26,color:BC,weight:700});
   s+=T(`${Vt}\\times${Qt}_0=${Vt}\\times${Ct}_0${Vt}=${Ct}_0${Vt}^2`,600,210,{size:44});
   s+=fade(seg(p,.4,.6),T(`=2\\times\\tfrac12${Ct}_0${Vt}^2=2${Ut}_0`,600,330,{size:48,})+highlight(380,282,440,90,1,BC));
   return s;
  },
  [K+'half']:(p)=>barFig(p,{rest:0}),
  [K+'rest']:(p)=>barFig(p,{rest:1}),
 };
}
// energy bars: battery work 2U0 vs increase U0 + rest U0
function barFig(p,{rest=0}={}){
 const x0=140,y0=420,u=120;
 let s=line(x0-20,y0,x0+760,y0,{color:C.dim,w:2});
 s+=rect(x0,y0-2*u,140,2*u,{fill:BC,fo:.35,stroke:BC,sw:2,rx:4})+label('電池の 仕事',x0+70,y0+34,{size:24,color:BC,anchor:'middle'})+label('2U₀',x0+70,y0-2*u-14,{size:28,color:BC,anchor:'middle',weight:700});
 s+=fade(seg(p,.1,.3),rect(x0+300,y0-u,140,u,{fill:WC,fo:.4,stroke:WC,sw:2,rx:4})+label('U の 増加：2U₀ − U₀ ＝ U₀',x0+370,y0+34,{size:24,color:WC,anchor:'middle',weight:700}));
 s+=fade(rest?seg(p,.1,.3):0,rect(x0+300,y0-2*u,140,u,{fill:DC,fo:.25,stroke:DC,sw:2,rx:4,})+label('引き込む 仕事 など U₀',x0+460,y0-1.5*u+8,{size:24,color:DC}));
 s+=fade(seg(p,.4,.6),label(rest?'収支：2U₀ ＝ U₀ ＋ U₀':'電池の 仕事の 半分',x0+640,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
// comparison table
function tableFig(p,{q=1,v=1,gv=1,hl=0}={}){
 let s=card(80,40,1040,430,'',1);
 const cols=[[420,'電池を 外す',QC],[860,'つないだまま',VC]];
 const rows=['固定','E・V','Q','U'];
 rows.forEach((r,i)=>{s+=label(r,190,150+i*80,{size:28,color:C.dim,anchor:'middle'});});
 s+=line(110,105,1090,105,{color:C.faint,w:2});
 const A=[['Q','QC'],['1/κ 倍 ↓',EC],['同じ',C.ink],['1/κ 倍 ↓',WC]];
 const B=[['V','VC'],['同じ',C.ink],['κ 倍 ↑',QC],['κ 倍 ↑',WC]];
 s+=fade(q,label(cols[0][1],cols[0][0],85,{size:28,color:cols[0][2],anchor:'middle',weight:700})+A.map(([t,c],i)=>label(t,cols[0][0],160+i*80,{size:30,color:c==='QC'?QC:c,anchor:'middle',weight:700})).join(''));
 s+=fade(v*gv,label(cols[1][1],cols[1][0],85,{size:28,color:cols[1][2],anchor:'middle',weight:700})+B.map(([t,c],i)=>label(t,cols[1][0],160+i*80,{size:30,color:c==='VC'?VC:c,anchor:'middle',weight:700})).join(''));
 if(hl)s+=highlight(110,355,980,70,hl,WC)+fade(hl,label('逆',640,400,{size:30,color:C.hi,anchor:'middle',weight:700}));
 return s;
}
