// YouTube シリーズ「マクスウェル方程式・上級 4/4」(ys-ue-maxwell-4) — 図。Stage 1200×515。シリーズの最後の本。
// 色：𝐄・E_y・E₀ 水色、𝐁・B_z・B₀ 橙、t 金、x 水色、c・進む向き 紫、強調 黄。
// 座標：x 右、y 上、z 手前（2/4・3/4 と同じ）。立体は斜投影：z（手前）を画面の左下へ (−0.5, +0.38) で描く。
//   E_y＝E₀ sin(kx−ωt)、B_z＝B₀ sin(kx−ωt)（同位相）。y＞0 は上、z＞0 は手前（左下）。
//   𝐄×𝐁：山 ŷ×ẑ＝x̂、谷 (−ŷ)×(−ẑ)＝x̂（成分式で検算済み）。
// シリーズの地図の単元名は UNITS.md / PLAN-初級.md の一覧と同じ（数学9・力学10・電磁気10）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,texWidth,highlight,esc} from './anim.mjs';
import {card,T,cs,L,TF,EC,BC,TC,XC,VC,HI,BAD,INK,DIM,CI,QC,Ey,Bz,xx,tt,cc,ME,d1,EQ1,row,fbox} from './yt1-ue-maxwell-3-diagrams.mjs';

const K='ue-maxwell-4:';
const E0=cs(EC,'E_0'),B0=cs(BC,'B_0'),ARG=`k${xx}-\\omega ${tt}`,U=s=>`\\,\\mathrm{${s}}`;
const vE=cs(EC,'\\mathbf{E}'),vB=cs(BC,'\\mathbf{B}');
const yh=cs(EC,'\\hat{\\mathbf{y}}'),zh=cs(BC,'\\hat{\\mathbf{z}}'),xh=cs(VC,'\\hat{\\mathbf{x}}');
const RAD=Math.PI/180;
// ---- 2D sine graph ---------------------------------------------------------------------------------
const SX0=70,SX1=650,LAM=240;
function sineAxes(y0,{g=1,ylab=Ey,amp=110}={}){
 return fade(g,arrow(SX0-10,y0,SX1+20,y0,{color:DIM,w:2.5,head:14})+label('x',SX1+28,y0+8,{size:26,color:XC,weight:700})
  +arrow(SX0,y0+amp+20,SX0,y0-amp-30,{color:DIM,w:2.5,head:14})+T(ylab,SX0+32,y0-amp-24,{size:30}));
}
function sineCurve(y0,amp,ph,{color=EC,w=5,g=1}={}){// value = amp·sin(2π x/LAM − ph)
 const pts=[];for(let i=0;i<=240;i++){const X=SX0+(SX1-SX0)*i/240;pts.push([X,y0-amp*Math.sin(2*Math.PI*(X-SX0)/LAM-ph)]);}
 return fade(g,draw(pts,1,{color,w}));
}
const crestX=ph=>SX0+LAM*(.25+ph/(2*Math.PI));// first crest
const cardR=(inner,g=1,stroke=C.faint)=>card(720,90,440,370,inner,g,stroke);
// ---- 3D wave (oblique) -----------------------------------------------------------------------------
const OX=150,OY=270,ZX=-.5,ZY=.38,WL=360,WX=860,AE=130,AB=150;
const P3=(x,y,z)=>[OX+x+ZX*z,OY-y+ZY*z];
function wave3d(ph,{gE=1,gB=1,arrows=1,mark=-1,axes=1}={}){
 let s='';
 if(axes){s+=arrow(...P3(-20,0,0),...P3(WX+50,0,0),{color:VC,w:4,head:18})+label('x',...P3(WX+62,-8,0),{size:28,color:VC,weight:700});
  s+=fade(.8,arrow(...P3(0,0,0),...P3(0,AE+40,0),{color:DIM,w:2.5,head:12})+label('y',...P3(-24,AE+40,0),{size:24,color:DIM})
   +arrow(...P3(0,0,0),...P3(0,0,AB+60),{color:DIM,w:2.5,head:12})+label('z',...P3(-26,0,AB+70),{size:24,color:DIM}));}
 const f=x=>Math.sin(2*Math.PI*x/WL-ph);
 const ce=[],cb=[];for(let i=0;i<=200;i++){const x=WX*i/200;ce.push(P3(x,AE*f(x),0));cb.push(P3(x,0,AB*f(x)));}
 if(arrows)for(let x=15;x<WX;x+=30){const v=f(x);
  if(Math.abs(v)>.08){s+=fade(gB*.8,line(...P3(x,0,0),...P3(x,0,AB*v),{color:BC,w:2.5}));s+=fade(gE*.8,line(...P3(x,0,0),...P3(x,AE*v,0),{color:EC,w:2.5}));}}
 s+=fade(gB,draw(cb,1,{color:BC,w:4.5}))+fade(gE,draw(ce,1,{color:EC,w:4.5}));
 if(mark>=0){const v=f(mark);s+=ring(...P3(mark,0,0),12,{color:HI,w:3})+arrow(...P3(mark,0,0),...P3(mark,AE*v,0),{color:HI,w:6,head:14});}
 return s;
}
// triad at screen point (x,y): y up, z toward viewer (lower-left), x right
function triad(x,y,{sy=1,sz=1,g=1,labs=1,res=0}={}){
 const L1=150;let s='';
 s+=arrow(x,y,x,y-sy*L1,{color:EC,w:7,head:20});
 s+=arrow(x,y,x+ZX*sz*L1*1.3,y+ZY*sz*L1*1.3,{color:BC,w:7,head:20});
 if(labs){s+=T(sy>0?yh:`-${yh}`,x+(sy>0?-48:-58),y-sy*L1+(sy>0?14:20),{size:34});s+=T(sz>0?zh:`-${zh}`,x+ZX*sz*L1*1.3+(sz>0?-30:40),y+ZY*sz*L1*1.3+(sz>0?40:-6),{size:34});}
 s+=fade(res,arrow(x,y,x+190,y,{color:VC,w:8,head:22})+T(xh,x+215,y+12,{size:36}));
 return fade(g,s);
}
// ---- series map ------------------------------------------------------------------------------------
const UNITS=[
 ['数学',['微分','積分','微分の法則','近似とテイラー展開','ベクトル','内積','外積','微分方程式','振動の微分方程式']],
 ['力学',['運動方程式','空気抵抗','仕事','位置エネルギー','運動量','角運動量','単振動','慣性モーメント','剛体の回転','慣性力と軌道']],
 ['電磁気',['線積分と面積分','ガウスの法則','電位','コンデンサ','電流','ローレンツ力','アンペールの法則','電磁誘導','過渡現象','マクスウェル方程式']]];
const COLX=[60,445,830],ROW0=96,DY=40;
const node=(c,i)=>[COLX[c],ROW0+i*DY];
const PATH=[[0,0],[1,0],[1,2],[2,0],[2,1],[2,7],[2,9],'light'];
const LIGHT=[1140,ROW0+9*DY+26];
// waypoints between consecutive path nodes, running in the gaps between label rows
const SEGS=[[[60,96],[60,116],[445,116],[445,96]],[[445,96],[445,176]],[[445,176],[445,196],[805,196],[805,96],[830,96]],
 [[830,96],[830,136]],[[830,136],[830,376]],[[830,376],[830,456]],[[830,456],[830,482],[1140,482]]];
const halo=(s,x,y,{size=22,color=INK,weight=400}={})=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" stroke="${C.bg}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">${esc(s)}</text>`;
function seriesMap(lit=0,{note='',gp=1,dimAll=0}={}){// lit = number of path nodes lit (0..8); gp = growth of the newest segment
 let s='';
 UNITS.forEach(([h,us],c)=>{s+=label(`${h} ${us.length}`,COLX[c]-8,58,{size:26,color:[C.x,C.F,C.E][c],weight:700});});
 for(let i=0;i<lit-1;i++)s+=draw(SEGS[i],i===lit-2?gp:1,{color:HI,w:8,opacity:.6});
 const litSet=new Set(PATH.slice(0,lit).filter(q=>q!=='light').map(q=>q.join(',')));
 UNITS.forEach(([h,us],c)=>us.forEach((u,i)=>{const [x,y]=node(c,i),on=litSet.has(`${c},${i}`);
  s+=dot(x,y,on?10:6,on?HI:[C.x,C.F,C.E][c],on?1:.75)+halo(u,x+18,y+8,{size:22,color:on?HI:(dimAll?DIM:INK),weight:on?700:400});}));
 const lOn=lit>=8;
 s+=fade(lOn?1:.35,ring(LIGHT[0],LIGHT[1],22,{color:lOn?HI:DIM,w:3,fill:lOn?'#3a3410':'none'})+label('光',LIGHT[0],LIGHT[1]+9,{size:26,color:lOn?HI:DIM,anchor:'middle',weight:700}));
 if(note)s+=label(note,500,505,{size:24,color:HI,anchor:'middle',weight:700});
 return s;
}
// ---- small people for the closing ---------------------------------------------------------------
function person(x,y,{color=INK,s=1}={}){return ring(x,y-70*s,14*s,{color,w:3})+line(x,y-56*s,x,y-22*s,{color,w:3})+line(x,y-22*s,x-14*s,y,{color,w:3})+line(x,y-22*s,x+14*s,y,{color,w:3})+line(x-16*s,y-44*s,x+16*s,y-44*s,{color,w:3});}

export const ytUeMaxwell4Diagrams={
 // ===== S1 =====
 [K+'prev']:(p)=>{
  let s=T(`${d1(Ey,xx)}=-${d1(Bz,tt)},\\qquad -${d1(Bz,xx)}=${ME}\\,${d1(Ey,tt)}`,600,90,{size:34});
  s+=TF(`${cc}=\\dfrac{1}{\\sqrt{${ME}}}\\approx3.00\\times10^{8}${U('m/s')}`,600,300,{size:60,box:true,frac:true,g:seg(p,.3,.5)});
  return s;
 },
 [K+'ask']:(p)=>card(200,70,800,370,L('前回の 最後の 問い',600,125,{size:24,color:DIM})+L('𝐄 と 𝐁 の 大きさと 向きは',600,205,{size:32,color:INK,weight:700})
   +L('どんな 関係で 進む？',600,260,{size:34,color:HI,weight:700})+fade(seg(p,.5,.65),L('このシリーズで 何が',600,340,{size:30,color:INK})+L('できる ように なった？',600,395,{size:34,color:HI,weight:700})),seg(p,.03,.15),HI),
 [K+'plan']:(p)=>{
  let s=card(100,110,470,280,L('前半',335,165,{size:26,color:DIM})+L('𝐄 と 𝐁 の 関係',335,250,{size:34,color:INK,weight:700})+T(`${B0}=\\ ?`,335,330,{size:40}),1);
  s+=card(630,110,470,280,L('後半',865,165,{size:26,color:DIM})+L('シリーズ 全体の 地図',865,250,{size:34,color:HI,weight:700}),seg(p,.4,.55));
  return s;
 },
 // ===== S2 E から B =====
 [K+'sinE']:(p)=>{
  let s=sineAxes(290)+sineCurve(290,110,0,{g:seg(p,.05,.3)});
  const cx=crestX(0);s+=fade(seg(p,.55,.7),line(cx,290,cx,180,{color:HI,w:2.5,dash:'6 5'})+T(E0,cx-30,215,{size:30}));
  s+=fade(seg(p,.05,.3),label('t ＝ 0',SX0+400,140,{size:24,color:TC}));
  s+=cardR(L('電場の 正弦波',940,150,{size:26,color:DIM})+T(`${Ey}=${E0}\\sin(${ARG})`,940,260,{size:38})+fade(seg(p,.55,.7),L('E₀：振幅',940,360,{size:28,color:EC,weight:700})),1);
  return s;
 },
 [K+'k']:(p)=>{
  let s=sineAxes(290)+sineCurve(290,110,0);
  const c1=crestX(0),c2=c1+LAM;
  s+=fade(seg(p,.05,.25),arrow(c1,150,c2,150,{color:INK,w:3,head:12})+arrow(c2,150,c1,150,{color:INK,w:3,head:12})+T('\\lambda',(c1+c2)/2,128,{size:32}));
  s+=cardR(T(`k=\\dfrac{2\\pi}{\\lambda}`,940,170,{size:40})+L('1 m あたりの 位相（波数）',940,240,{size:24,color:DIM})
   +fade(seg(p,.5,.65),T(`\\omega=\\dfrac{2\\pi}{T}`,940,325,{size:40})+L('1 秒あたりの 位相（角振動数）',940,395,{size:24,color:DIM})),1);
  return s;
 },
 [K+'speed']:(p)=>{
  const ph=2*Math.PI*.35*seg(p,.1,.6);
  let s=sineAxes(290)+sineCurve(290,110,0,{color:DIM,w:2.5})+sineCurve(290,110,ph);
  const c0=crestX(0),c1=crestX(ph);s+=dot(c1,180,8,HI)+fade(seg(p,.2,.4),arrow(c0,410,Math.max(c0+1,c1),410,{color:VC,w:5,head:14}));
  s+=cardR(mixed2([`$k${xx}-\\omega ${tt}$`,'＝ 一定'],940,150,34)+fade(seg(p,.35,.5),L('山の 速さ',850,252,{size:28,color:INK})+T(`\\frac{\\omega}{k}`,980,240,{size:40}))
   +fade(seg(p,.6,.75),TF(`\\frac{\\omega}{k}=${cc}`,940,395,{size:44,box:true,frac:true})),1);
  return s;
 },
 [K+'plug']:(p)=>{
  let s=card(330,12,540,100,label('①',348,42,{size:22,color:DIM})+T(EQ1,600,72,{size:32}),1);
  s+=T(`\\frac{\\partial}{\\partial ${xx}}\\Big(${E0}\\sin(${ARG})\\Big)=-${d1(Bz,tt)}`,600,290,{size:48});
  s+=fade(seg(p,.1,.3),L('E の y 成分を 代入',600,170,{size:26,color:EC}));
  return s;
 },
 [K+'dx']:(p)=>{
  let s=card(330,12,540,100,label('①',348,42,{size:22,color:DIM})+T(EQ1,600,72,{size:32}),1);
  s+=fade(.45,T(`\\frac{\\partial}{\\partial ${xx}}\\Big(${E0}\\sin(${ARG})\\Big)=-${d1(Bz,tt)}`,600,210,{size:40}));
  const r=row([`k${E0}\\cos(${ARG})`,'=',`-${d1(Bz,tt)}`],600,370,{size:48,g:[seg(p,.3,.5),seg(p,.3,.5),seg(p,.3,.5)]});
  s+=r.svg+fbox(r.spans[0],370,40,seg(p,.5,.65))+fade(seg(p,.5,.65),L('中身の 倍率 k',r.spans[0][0]+r.spans[0][1]/2,470,{size:26,color:HI}));
  return s;
 },
 [K+'Bt']:(p)=>{
  let s=card(330,12,540,100,label('①',348,42,{size:22,color:DIM})+T(EQ1,600,72,{size:32}),1);
  s+=fade(.45,T(`k${E0}\\cos(${ARG})=-${d1(Bz,tt)}`,600,210,{size:40}));
  s+=TF(`${d1(Bz,tt)}=-k${E0}\\cos(${ARG})`,600,380,{size:50,box:true,frac:true,g:seg(p,.2,.4)});
  return s;
 },
 [K+'guess']:(p)=>{
  let s=T(`${d1(Bz,tt)}=-k${E0}\\cos(${ARG})`,600,90,{size:38});
  s+=fade(seg(p,.15,.35),L('t で 微分して −cos に なるのは sin',600,200,{size:28,color:DIM}));
  s+=fade(seg(p,.4,.6),T(`\\frac{\\partial}{\\partial ${tt}}\\sin(${ARG})=-\\omega\\cos(${ARG})`,600,330,{size:46}));
  s+=fade(seg(p,.65,.8),L('中身の 倍率 −ω',780,440,{size:26,color:HI}));
  return s;
 },
 [K+'B']:(p)=>{
  let s=T(`${d1(Bz,tt)}=-k${E0}\\cos(${ARG})`,600,90,{size:38});
  s+=fade(seg(p,.05,.25),mixed2(['欲しい 係数',`$-\\omega\\ \\to\\ -k${E0}$`,'：',`$\\times\\dfrac{k}{\\omega}${E0}$`],600,210,30));
  s+=TF(`${Bz}=\\frac{k}{\\omega}${E0}\\sin(${ARG})`,600,370,{size:56,box:true,frac:true,g:seg(p,.45,.65)});
  return s;
 },
 [K+'check']:(p)=>{
  let s=T(`${Bz}=\\frac{k}{\\omega}${E0}\\sin(${ARG})`,600,80,{size:38});
  s+=fade(seg(p,.05,.3),T(`${d1(Bz,tt)}=\\frac{k}{\\omega}${E0}\\times(-\\omega)\\cos(${ARG})`,600,220,{size:42}));
  s+=fade(seg(p,.35,.55),T(`=-k${E0}\\cos(${ARG})`,640,340,{size:44}));
  s+=fade(seg(p,.65,.8),L('① を 満たす ✓',600,450,{size:30,color:HI,weight:700}));
  return s;
 },
 [K+'const']:(p)=>{
  let s=T(`${Bz}=\\frac{k}{\\omega}${E0}\\sin(${ARG})\\ +\\ ?`,600,150,{size:50});
  s+=fade(seg(p,.1,.3),L('？：時間に よらない 一定の 磁場',600,290,{size:28,color:INK}));
  s+=fade(seg(p,.5,.7),card(250,340,700,100,L('波だけを 考える → 0（仮定）',600,400,{size:30,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'B0']:(p)=>{
  let s=T(`${Bz}=\\frac{k}{\\omega}${E0}\\sin(${ARG})`,600,80,{size:38});
  s+=fade(seg(p,.1,.3),T(`${B0}=\\frac{k}{\\omega}${E0}`,600,215,{size:48}));
  s+=fade(seg(p,.35,.5),L('ω / k ＝ c',960,225,{size:28,color:VC,weight:700}));
  s+=TF(`${B0}=\\frac{${E0}}{${cc}}`,600,390,{size:64,box:true,frac:true,g:seg(p,.5,.7)});
  return s;
 },
 // ===== S3 位相・向き =====
 [K+'phase']:(p)=>{
  const ph=2*Math.PI*.25*seg(p,.5,1);
  let s=sineAxes(160,{amp:80})+sineCurve(160,80,ph);
  s+=sineAxes(395,{amp:80,ylab:Bz})+sineCurve(395,80,ph,{color:BC,g:seg(p,.05,.25)});
  for(const c of [crestX(ph),crestX(ph)+LAM])if(c<SX1)s+=fade(seg(p,.25,.4),line(c,70,c,480,{color:HI,w:2.5,dash:'7 6'}));
  s+=cardR(L('同じ sin(kx − ωt)',940,160,{size:28,color:INK,weight:700})+fade(seg(p,.25,.4),L('山と 山、0 と 0 が そろう',940,250,{size:26,color:HI}))
   +fade(seg(p,.45,.6),L('同位相',940,330,{size:36,color:HI,weight:700}))+L('（縦の 目盛りは 別）',940,410,{size:22,color:DIM}),1);
  return s;
 },
 [K+'perp']:(p)=>{
  let s=triad(330,330,{res:0,labs:0});
  s+=fade(seg(p,.2,.35),arrow(330,330,560,330,{color:VC,w:5,head:18})+label('進む 向き x',575,338,{size:26,color:VC}));
  s+=fade(seg(p,.05,.2),T(vE,280,170,{size:34})+T(vB,190,470,{size:34}));
  s+=cardR(L('𝐄：y 方向',940,170,{size:30,color:EC,weight:700})+L('𝐁：z 方向',940,230,{size:30,color:BC,weight:700})+fade(seg(p,.3,.45),L('互いに 直角',940,310,{size:30,color:HI,weight:700}))+fade(seg(p,.55,.7),L('どちらも x に 直角',940,380,{size:28,color:VC})),1);
  return s;
 },
 [K+'3d']:(p)=>{
  let s=wave3d(2*Math.PI*p*.9,{gB:seg(p,.15,.35)});
  s+=fade(seg(p,.05,.2),label('𝐄（上下）',...P3(380,AE+30,0),{size:26,color:EC,weight:700}))+fade(seg(p,.2,.35),label('𝐁（手前・奥）',30,480,{size:26,color:BC,weight:700}));
  return s;
 },
 [K+'notmove']:(p)=>{
  let s=wave3d(2*Math.PI*p*.6,{mark:450});
  s+=card(760,20,420,130,L('矢印の 先を つないだ 曲線',970,65,{size:24,color:DIM})+L('物が 揺れて 飛ぶ のではない',970,115,{size:26,color:HI,weight:700}),seg(p,.3,.45));
  s+=fade(seg(p,.5,.65),label('〇 の 点：矢印の 長さが 変わる だけ',700,500,{size:24,color:HI,weight:700,anchor:'middle'}));
  return s;
 },
 [K+'pattern']:(p)=>{
  let s=wave3d(2*Math.PI*p*.8,{mark:450});
  s+=card(760,20,420,130,L('進むのは',970,65,{size:24,color:DIM})+L('場の 値の 形',970,115,{size:30,color:HI,weight:700}),1);
  s+=fade(seg(p,.4,.55),label('初級：ひもの 印の 点は 右へ 運ばれない',600,500,{size:24,color:DIM,anchor:'middle'}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=triad(330,320,{g:1});
  s+=cardR(L('山の 所',940,160,{size:26,color:DIM})+mixed2([`$${vE}$`,'は',`$${yh}$`,'の 向き'],940,240,30)+mixed2([`$${vB}$`,'は',`$${zh}$`,'の 向き'],940,300,30)+fade(seg(p,.5,.65),T(`${yh}\\times${zh}=\\ ?`,940,385,{size:40})),1);
  return s;
 },
 [K+'comp']:(p)=>{
  let s=triad(200,330,{res:seg(p,.75,.9)});
  s+=card(470,40,690,430,'',1);
  s+=T(`A=${yh}=(0,1,0),\\quad B=${zh}=(0,0,1)`,815,95,{size:32});
  s+=fade(seg(p,.1,.25),label('x 成分',520,185,{size:26,color:DIM})+T(`A_yB_z-A_zB_y=1\\times1-0\\times0=1`,880,180,{size:30}));
  s+=fade(seg(p,.3,.45),label('y 成分',520,255,{size:26,color:DIM})+T(`A_zB_x-A_xB_z=0\\times0-0\\times1=0`,880,250,{size:30}));
  s+=fade(seg(p,.45,.6),label('z 成分',520,325,{size:26,color:DIM})+T(`A_xB_y-A_yB_x=0\\times0-1\\times0=0`,880,320,{size:30}));
  s+=fade(seg(p,.7,.85),TF(`${yh}\\times${zh}=${xh}`,815,425,{size:40,box:true}));
  return s;
 },
 [K+'trough']:(p)=>{
  let s=triad(330,250,{sy:-1,sz:-1,res:seg(p,.45,.6)});
  s+=cardR(L('谷の 所：どちらも 逆向き',940,160,{size:26,color:DIM})+T(`(-${yh})\\times(-${zh})`,940,240,{size:36})+fade(seg(p,.25,.4),T(`=${yh}\\times${zh}=${xh}`,940,310,{size:36}))
   +fade(seg(p,.6,.75),L('𝐄×𝐁 は いつも 進む 向き',940,400,{size:26,color:VC,weight:700})),1);
  return s;
 },
 [K+'sun1']:(p)=>{
  let s=ring(170,250,70,{color:HI,w:4,fill:'#3a3410'});for(let a=0;a<360;a+=30){const c=Math.cos(a*RAD),d=Math.sin(a*RAD);s+=line(170+c*85,250+d*85,170+c*110,250+d*110,{color:HI,w:4});}
  for(const dy of [-50,0,50])s+=fade(seg(p,.1,.4),arrow(300,250+dy,560,250+dy,{color:HI,w:3,head:12}));
  s+=ring(620,250,40,{color:C.x,w:3,fill:'#10263a'})+label('地球',620,330,{size:24,color:INK,anchor:'middle'});
  s+=card(720,120,440,260,L('大気の 外',940,175,{size:26,color:DIM})+T(`1361${U('W/m^2')}`,940,270,{size:46}),seg(p,.3,.45));
  return s;
 },
 [K+'sun2']:(p)=>{
  let s=card(150,60,900,360,L('1つの 正弦波と みなした 見積もり',600,115,{size:26,color:DIM})+T(`${E0}\\approx1010${U('V/m')}`,600,230,{size:56})
   +fade(seg(p,.45,.6),L('見積もりの 式は 使うだけ（シリーズの 外）',600,350,{size:26,color:INK})),1);
  return s;
 },
 [K+'sun3']:(p)=>{
  let s=T(`${B0}=\\frac{${E0}}{${cc}}=\\frac{1010}{3.00\\times10^{8}}\\approx3.4\\times10^{-6}${U('T')}`,600,95,{size:44});
  const x0=180,sc=10;
  s+=fade(seg(p,.4,.55),rect(x0,230,3.4*sc,60,{fill:BC,fo:.55,stroke:BC})+label('太陽光の B₀：約 3.4',x0+3.4*sc+16,270,{size:26,color:BC,weight:700}));
  s+=fade(seg(p,.55,.7),rect(x0,330,45*sc,60,{fill:DIM,fo:.35,stroke:DIM})+label('地磁気：約 45',x0+45*sc+16,370,{size:26,color:INK,weight:700}));
  s+=fade(seg(p,.4,.55),line(x0,215,x0,410,{color:DIM,w:2})+label('単位：',x0+20,460,{size:24,color:DIM})+T(`10^{-6}${U('T')}`,x0+130,456,{size:28,color:DIM}));
  s+=fade(seg(p,.75,.9),L('約 13分の1',920,470,{size:32,color:HI,weight:700}));
  return s;
 },
 [K+'force']:(p)=>{
  let s=T(`\\frac{q\\,v\\,${B0}}{q\\,${E0}}=\\frac{v}{${cc}}`,600,190,{size:62});
  s+=fade(seg(p,.1,.3),L('磁気力 ÷ 電気力（いちばん 大きい とき）',600,330,{size:28,color:INK}));
  s+=fade(seg(p,.5,.7),L('光より ずっと 遅い 電荷 → 電場の 力が 主役',600,420,{size:28,color:HI,weight:700}));
  return s;
 },
 // ===== S4 地図 =====
 [K+'map']:(p)=>seriesMap(0,{note:''}),
 [K+'path1']:(p)=>seriesMap(p<.5?1:2,{gp:seg(p,.5,.75),note:p<.5?'微分：幅を 縮めて 瞬間の 変化率':'運動方程式：加速度 ＝ 速度の 微分'}),
 [K+'path2']:(p)=>seriesMap(p<.5?3:4,{gp:seg(p,p<.5?0:.5,p<.5?.25:.75),note:p<.5?'仕事：力と 一歩の 内積を 足す':'線積分と面積分：曲がった 道と 面へ'}),
 [K+'path3']:(p)=>seriesMap(p<.5?5:6,{gp:seg(p,p<.5?0:.5,p<.5?.25:.75),note:p<.5?'ガウスの法則：閉じた 面の 電気束 ＝ 中の 電荷 ÷ ε₀':'電磁誘導：磁束の 変化 → 電場の 渦'}),
 [K+'path4']:(p)=>seriesMap(p<.5?7:8,{gp:seg(p,p<.5?0:.5,p<.5?.25:.75),note:p<.5?'マクスウェル方程式：変位電流を 加えて 4本':'光：c ＝ 1 / √(μ₀ε₀)'}),
 [K+'tools']:(p)=>{
  const items=['① 値 × 幅 を 小さい 区間 ごとに 足す','② 内積で 向きの 成分 だけを 取る','③ Σ と ∫：有限の 和と 極限','④ 使う 前に 対象・座標・向き・条件を 決める'];
  let s=card(140,40,920,430,L('上級の 入口の 4つの 部品',600,95,{size:26,color:DIM}),1);
  items.forEach((t,i)=>{s+=fade(seg(p,.05+i*.15,.2+i*.15),label(t,200,180+i*75,{size:30,color:INK,weight:700}));});
  return s;
 },
 // ===== S5 締め =====
 [K+'define']:(p)=>readCards(p,0),
 [K+'assume']:(p)=>readCards(p,1),
 [K+'exp']:(p)=>readCards(p,2),
 [K+'frame']:(p)=>{
  let s=line(40,400,700,400,{color:DIM,w:3})+person(110,400)+label('地面',110,440,{size:24,color:DIM,anchor:'middle'});
  const tx=mix(260,420,seg(p,.1,.9));
  s+=rect(tx,250,240,110,{fill:C.F,fo:.15,stroke:C.F,rx:10})+ring(tx+50,375,18,{color:DIM,w:3})+ring(tx+190,375,18,{color:DIM,w:3})+person(tx+180,350,{s:.8})+label('電車',tx+60,300,{size:24,color:INK});
  s+=rect(tx+20,320,40,30,{fill:C.E,fo:.4,stroke:C.E,rx:4});
  s+=arrow(tx+120,225,tx+220,225,{color:VC,w:4,head:14});
  s+=cardR(L('慣性力と軌道の 回',940,160,{size:24,color:DIM})+L('同じ 箱の 速さが',940,240,{size:28,color:INK})+L('見る人で 変わる',940,300,{size:32,color:HI,weight:700}),1);
  return s;
 },
 [K+'cmissing']:(p)=>{
  let s=TF(`${cc}=\\dfrac{1}{\\sqrt{${ME}}}`,600,190,{size:70,box:true,frac:true});
  s+=fade(seg(p,.15,.35),L('見る人の 速さは、どこにも 入って いない',600,350,{size:32,color:HI,weight:700}));
  s+=fade(seg(p,.6,.75),L('ここから 先は、このシリーズの 外',600,440,{size:26,color:DIM}));
  return s;
 },
 [K+'final1']:(p)=>{
  const lx=mix(300,1000,seg(p,0,1));
  let s=line(40,400,1160,400,{color:DIM,w:3});
  s+=fade(.9,arrow(lx-160,330,lx,330,{color:HI,w:7,head:20}))+label('光',lx-80,310,{size:26,color:HI,anchor:'middle',weight:700});
  s+=person(140,400)+label('止まった 人',140,440,{size:24,color:DIM,anchor:'middle'});
  const rx=mix(300,520,seg(p,0,1));s+=person(rx,400,{color:VC})+arrow(rx+25,320,rx+110,320,{color:VC,w:4,head:14})+label('追いかける 人',rx,440,{size:24,color:VC,anchor:'middle'});
  s+=fade(seg(p,.3,.5),card(720,40,440,150,L('どちらにも',940,90,{size:26,color:DIM})+L('同じ c なのか？',940,150,{size:34,color:HI,weight:700}),1,HI));
  return s;
 },
 [K+'final2']:(p)=>{
  let s=card(150,50,900,330,L('シリーズ 最後の 問い',600,105,{size:26,color:DIM})+L('もし そう なら',600,175,{size:30,color:INK})
   +L('「時間」と「空間」そのものを',600,245,{size:36,color:INK,weight:700})+L('どう 書き直す？',600,315,{size:42,color:HI,weight:700}),seg(p,.03,.12),HI);
  s+=fade(seg(p,.4,.55),L('→ 相対論へ（このシリーズの 外）',600,450,{size:30,color:VC,weight:700}));
  return s;
 },
};
// three cards: define / assume / experiment
function readCards(p,k){
 const data=[['定義','約束として 決めた もの',[`\\varepsilon_0=\\dfrac{1}{4\\pi k}`,`I=\\dfrac{dq}{dt}`]],
  ['仮定','今回 置いた 条件',['真空','なめらかな 場','x 方向の 平面波']],
  ['実験','説明できる 範囲',['光の 速さとの 一致','ヘルツの 電磁波','原子の 世界 → 量子論']]];
 let s='';
 data.forEach(([h,sub,items],i)=>{const x=40+i*380,g=i<k?1:i===k?seg(p,.02,.15):0;if(g<=0)return;
  let inner=L(h,x+170,95,{size:34,color:i===k?HI:INK,weight:700})+L(sub,x+170,140,{size:22,color:DIM});
  items.forEach((it,j)=>{inner+=i===0?T(it,x+170,225+j*110,{size:38}):L(it,x+170,235+j*75,{size:26,color:j===2&&i===2?C.p:INK,weight:700});});
  s+=card(x,40,340,430,inner,g,i===k?HI:C.faint);});
 return s;
}
// mixed text/TeX line centred at cx
function mixed2(parts,cx,y,size=28){
 const w=q=>q.startsWith('$')?texWidth(q.slice(1,-1),size*1.15,false):[...q].reduce((a,ch)=>a+(/[ -~]/.test(ch)?.55:1)*size,0);
 const tot=parts.reduce((a,q)=>a+w(q)+10,-10);let x=cx-tot/2,o='';
 for(const q of parts){const ww=w(q);if(q.startsWith('$'))o+=T(q.slice(1,-1),x+ww/2,y-size*.12,{size:size*1.15});else o+=label(q,x,y,{size,color:INK,weight:700});x+=ww+10;}
 return o;
}
