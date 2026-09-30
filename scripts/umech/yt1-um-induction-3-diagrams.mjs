// YouTube シリーズ「電磁誘導・中級 3/3」(ys-um-induction-3) — 図。Stage 1200×515.
// 色：𝐁 橙（⊗）、誘導の磁場 赤（⊙）、電流 I 緑、力 𝐅（q𝐯×𝐁、IlB）緑の太い矢印、速度 𝐯・起電力 ℰ 紫、増える面積の帯 金、磁束 Φ 黄、
//   棒・レール 白、正電荷 赤、電子 青、電場 𝐄 水色、負・誤り 赤。部品は 1/3 の図から借りる。
// 上から見た図：x 右、y 上、⊗＝奥向き。𝐯 右 × 𝐁 奥 → 上。電流は回路を反時計回り（棒の中は下→上）。棒への力 IlB は左。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,poly,highlight} from './anim.mjs';
import {CE,CB,CI,EMF,PHI,NC,DA,IND,NEG,SURF,RAD,cs,T,card,head,outSym,inSym,plusCharge,EM,PH,tt,DPHI} from './yt1-um-induction-1-diagrams.mjs';

const K='um-induction-3:';
const vv=cs(EMF,'\\mathbf{v}'),vB=cs(CB,'\\mathbf{B}'),Fc=C.F;
const BLV=`${cs(CB,'B')}l${cs(EMF,'v')}`;
function minus(x,y,r=15){return ring(x,y,r,{color:'#6f9dff',w:3,fill:'#1b2640'})+label('−',x,y+7,{size:22,color:'#6f9dff',anchor:'middle',weight:700});}

// ---- rails ------------------------------------------------------------------------------------------------
const RL={x0:90,x1:640,yt:150,yb:370};
function rails({xr=380,g=1,bG=1,bN=1,res=1,rod=1,vG=0,lG=0,cur=0,loopG=0,rodCol=SURF}={}){
 let s='';
 // field ⊗ grid
 if(bG>0){for(let x=RL.x0+40;x<=RL.x1;x+=70)for(let y=RL.yt-60;y<=RL.yb+60;y+=55){const d=6.5*bN;s+=fade(bG*.7,line(x-d,y-d,x+d,y+d,{color:CB,w:2.5})+line(x-d,y+d,x+d,y-d,{color:CB,w:2.5}));}}
 if(loopG>0)s+=fade(loopG,rect(RL.x0,RL.yt,xr-RL.x0,RL.yb-RL.yt,{fill:C.hi,fo:.08,stroke:C.hi,sw:2,rx:2}));
 s+=line(RL.x0,RL.yt,RL.x1,RL.yt,{color:SURF,w:5})+line(RL.x0,RL.yb,RL.x1,RL.yb,{color:SURF,w:5});
 if(res){const x=RL.x0,zz=[[x,RL.yt]];const n=8,y0=RL.yt+50,y1=RL.yb-50;zz.push([x,y0]);for(let i=1;i<n;i++)zz.push([x+(i%2?-14:14),mix(y0,y1,i/n)]);zz.push([x,y1],[x,RL.yb]);
  s+=draw(zz,1,{color:SURF,w:4})+label('R',x-26,(RL.yt+RL.yb)/2+10,{size:28,color:SURF,anchor:'end',weight:700});}
 if(rod)s+=line(xr,RL.yt-22,xr,RL.yb+22,{color:rodCol,w:9});
 if(vG>0)s+=fade(vG,arrow(xr+14,(RL.yt+RL.yb)/2,xr+104,(RL.yt+RL.yb)/2,{color:EMF,w:5,head:16})+label('v',xr+60,(RL.yt+RL.yb)/2-14,{size:30,color:EMF,anchor:'middle',weight:700}));
 if(lG>0)s+=fade(lG,line(xr+36,RL.yt,xr+36,RL.yb,{color:C.dim,w:2,dash:'6 5'})+label('l',xr+46,RL.yt+70,{size:30,color:C.ink,weight:700}));
 if(cur>0){// counter-clockwise: rod up, top rail left, resistor down, bottom rail right
  const my=(RL.yt+RL.yb)/2;
  s+=fade(cur,head(xr,my-30,0,-1,{color:CI,L:24})+head((RL.x0+xr)/2-20,RL.yt,-1,0,{color:CI,L:22})+head(RL.x0,my+60,0,1,{color:CI,L:20})+head((RL.x0+xr)/2+20,RL.yb,1,0,{color:CI,L:22}));
 }
 return fade(g,s);
}
function strip(x1,x2,g=1){return fade(g,rect(x1,RL.yt,x2-x1,RL.yb-RL.yt,{fill:DA,fo:.35,stroke:DA,sw:2,rx:0}));}
// ---- big rod (zoom) --------------------------------------------------------------------------------------
const RZ={x:300,yt:80,yb:440};
function bigRod({g=1,charges=0,up=0,e=0,sep=0}={}){
 let s='';
 for(let x=90;x<=520;x+=70)for(let y=90;y<=440;y+=60)if(Math.abs(x-RZ.x)>30)s+=line(x-6,y-6,x+6,y+6,{color:CB,w:2.2,opacity:.55})+line(x-6,y+6,x+6,y-6,{color:CB,w:2.2,opacity:.55});
 s+=rect(RZ.x-24,RZ.yt,48,RZ.yb-RZ.yt,{fill:SURF,fo:.18,stroke:SURF,sw:3,rx:10});
 if(charges>0){[0,1,2].forEach(i=>{const y=mix(RZ.yb-80,RZ.yt+60,i/2)-up*40;s+=fade(charges,plusCharge(RZ.x,y,15));});}
 return fade(g,s);
}

export const ytUmInduction3Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=fade(seg(p,0,.15),label('前回の 最後の問い',60,50,{size:24,color:C.dim}));
  s+=rails({xr:mix(260,520,seg(p,.1,.9)),vG:1,res:0});
  s+=card(700,110,450,270,label('𝐁 一定のまま 導線が 動く',925,170,{size:26,color:C.ink,anchor:'middle',weight:700})+label('起電力は 生まれる？',925,240,{size:30,color:EMF,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('電荷を 押すのは 何？',925,315,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.1,.25),EMF);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=label('前回：回るコイル',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=T(`${PH}=BA\\cos ${cs(NC,'\\omega')}${tt}`,600,190,{size:52});
  s+=fade(seg(p,.35,.55),arrow(600,235,600,280,{color:C.dim,w:3,head:12})+T(`${EM}=NBA${cs(NC,'\\omega')}\\sin ${cs(NC,'\\omega')}${tt}`,600,350,{size:52}));
  return s;
 },
 [K+'plan']:(p)=>{
  let s=card(90,90,480,130,label('前回：変わったのは 面の向き',330,165,{size:28,color:C.dim,anchor:'middle'}),seg(p,.02,.15));
  s+=card(90,260,480,170,label('① 磁束の見方',330,325,{size:30,color:PHI,anchor:'middle',weight:700})+label('面積の 増え方',330,380,{size:26,color:C.ink,anchor:'middle'}),seg(p,.4,.55),PHI);
  s+=card(630,260,480,170,label('② 動く電荷の見方',870,325,{size:30,color:Fc,anchor:'middle',weight:700})+label('電荷への 磁気力',870,380,{size:26,color:C.ink,anchor:'middle'}),seg(p,.55,.7),Fc);
  s+=card(630,90,480,130,label('今回：面積が 変わる',870,165,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.45),C.hi);
  return s;
 },
 // ===== S2 動く棒と磁束 =====
 [K+'setup']:(p)=>{
  let s=rails({bG:0,rod:seg(p,.45,.6)>0?1:0,lG:seg(p,.6,.8),g:seg(p,0,.2)});
  s+=card(760,120,390,240,label('2本の 平行な レール',955,185,{size:26,color:C.ink,anchor:'middle'})+label('左端に 抵抗 R',955,235,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.5,.65),label('長さ l の 棒',955,300,{size:30,color:C.ink,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'field']:(p)=>{
  let s=rails({bG:seg(p,.05,.35),lG:1});
  s+=card(760,120,390,240,label('𝐁：奥向き（⊗）',955,195,{size:30,color:CB,anchor:'middle',weight:700})+label('一様・時間で 変わらない',955,260,{size:26,color:C.ink,anchor:'middle'}),seg(p,.2,.35));
  return s;
 },
 [K+'move']:(p)=>{
  const xr=mix(300,460,seg(p,.1,.9));
  let s=rails({xr,vG:1,lG:1,loopG:seg(p,.5,.65)});
  s+=card(760,120,390,240,label('速さ v で 右へ',955,195,{size:30,color:EMF,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('閉じた 回路',955,265,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'predict']:(p)=>{
  const xr=mix(460,520,seg(p,0,1));
  let s=rails({xr,vG:1,lG:1,loopG:.6});
  s+=card(760,120,390,240,label('𝐁 は 一定',955,195,{size:30,color:CB,anchor:'middle',weight:700})+label('起電力は 生まれる？',955,265,{size:30,color:EMF,anchor:'middle',weight:700}),seg(p,.05,.2),EMF);
  return s;
 },
 [K+'area']:(p)=>{
  const x1=380,x2=mix(380,480,seg(p,.35,.7));
  let s=rails({xr:x2,vG:1,lG:1,loopG:.35});
  s+=fade(seg(p,.1,.3),line(x1,RL.yt-22,x1,RL.yb+22,{color:SURF,w:4,dash:'8 6',opacity:.6})+label('t',x1,RL.yt-34,{size:24,color:C.t,anchor:'middle'}));
  s+=strip(x1,x2,seg(p,.35,.7));
  s+=fade(seg(p,.6,.75),label('t＋Δt',x2,RL.yt-34,{size:24,color:C.t,anchor:'middle'})+line(x1,RL.yb+44,x2,RL.yb+44,{color:DA,w:3})+label('vΔt',(x1+x2)/2,RL.yb+80,{size:28,color:DA,anchor:'middle',weight:700}));
  s+=card(760,120,390,240,label('増える 面積',955,190,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.75,.9),T(`l\\times ${cs(EMF,'v')}\\Delta ${tt}`,955,280,{size:48,color:DA})),seg(p,.05,.2));
  return s;
 },
 [K+'flux']:(p)=>{
  let s=T(`\\Delta${PH}=${cs(CB,'B')}\\times l${cs(EMF,'v')}\\Delta ${tt}`,600,150,{size:54});
  s+=fade(seg(p,.4,.6),T(`\\dfrac{\\Delta${PH}}{\\Delta ${tt}}=${BLV}`,600,330,{size:58}));
  s+=fade(seg(p,.1,.3),label('𝐁 は 面に 垂直',600,240,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'emf']:(p)=>{
  let s=T(`${DPHI}=${BLV}`,600,150,{size:56});
  s+=fade(seg(p,.05,.2),label('速さ一定 → Δt によらない',600,250,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.7),T(`|${EM}|=${BLV}`,600,370,{size:72}));
  return s;
 },
 [K+'yes']:(p)=>{
  let s=rails({xr:mix(420,520,p),vG:1,lG:1});
  s+=card(760,110,390,260,label('𝐁 一定でも',955,175,{size:28,color:CB,anchor:'middle',weight:700})+label('面積が 変われば',955,235,{size:28,color:C.ink,anchor:'middle'})+label('起電力が 生まれる',955,305,{size:30,color:EMF,anchor:'middle',weight:700}),seg(p,.05,.2),EMF);
  return s;
 },
 [K+'dir']:(p)=>{
  let s=rails({xr:460,vG:1,bN:mix(1,1.4,seg(p,.05,.5))});
  s+=fade(seg(p,.4,.6),outSym(275,260,34,IND)+label('誘導の磁場（⊙）',275,330,{size:24,color:IND,anchor:'middle',weight:700}));
  s+=card(760,110,390,260,label('奥向きの 磁束が 増える',955,175,{size:26,color:CB,anchor:'middle',weight:700})+label('妨げる：',955,240,{size:26,color:C.ink,anchor:'middle'})+label('手前向き（⊙）の 磁場',955,295,{size:28,color:IND,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'dir2']:(p)=>{
  let s=rails({xr:460,vG:1,cur:seg(p,.1,.3)});
  s+=fade(.8,outSym(275,260,30,IND));
  s+=card(760,110,390,260,label('電流：反時計回り',955,180,{size:30,color:CI,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('棒の中：下 → 上',955,270,{size:30,color:CI,anchor:'middle',weight:700})),seg(p,.1,.25),CI);
  return s;
 },
 // ===== S3 動く電荷の力 =====
 [K+'q']:(p)=>{
  let s=bigRod({charges:seg(p,.3,.5)});
  s+=fade(seg(p,.5,.7),arrow(RZ.x+40,260,RZ.x+140,260,{color:EMF,w:5,head:16})+label('v',RZ.x+90,245,{size:30,color:EMF,anchor:'middle',weight:700}));
  s+=card(700,120,450,240,label('棒の中の 正の電荷',925,190,{size:28,color:'#ff6b6b',anchor:'middle',weight:700})+label('棒と 一緒に 右へ 速さ v',925,260,{size:28,color:EMF,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'force']:(p)=>{
  let s=bigRod({charges:1});
  const y=260;
  s+=arrow(RZ.x+40,y+30,RZ.x+140,y+30,{color:EMF,w:5,head:16})+label('𝐯 右',RZ.x+150,y+40,{size:26,color:EMF,weight:700});
  s+=fade(seg(p,.4,.55),label('𝐁 奥向き（⊗）',RZ.x+150,y+100,{size:26,color:CB,weight:700}));
  s+=fade(seg(p,.6,.8),arrow(RZ.x,y-10,RZ.x,y-150,{color:Fc,w:8,head:22})+label('𝐯×𝐁：上',RZ.x+30,y-110,{size:28,color:Fc,weight:700}));
  s+=card(700,120,450,240,T(`\\mathbf{F}=q\\,${vv}\\times${vB}`,925,210,{size:50,color:Fc})+label('ローレンツ力・中級',925,300,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'along']:(p)=>{
  let s=bigRod({charges:1,up:seg(p,.1,.7)*1.5});
  s+=arrow(RZ.x+60,RZ.yb-60,RZ.x+60,RZ.yt+40,{color:Fc,w:6,head:18,opacity:seg(p,.05,.2)});
  s+=card(700,120,450,240,label('棒に 沿って 上へ',925,190,{size:30,color:Fc,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('電流の 向き（下→上）と 一致',925,270,{size:26,color:CI,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'electron']:(p)=>{
  let s=bigRod({});
  [0,1,2].forEach(i=>{const y=mix(RZ.yt+80,RZ.yb-60,i/2)+seg(p,.2,.8)*40;s+=minus(RZ.x,y,15);});
  s+=fade(seg(p,.2,.35),arrow(RZ.x-60,RZ.yt+60,RZ.x-60,RZ.yb-40,{color:'#6f9dff',w:5,head:16})+label('電子：下へ',RZ.x-70,RZ.yb-10,{size:24,color:'#6f9dff',anchor:'end',weight:700}));
  s+=fade(seg(p,.55,.7),arrow(RZ.x+60,RZ.yb-40,RZ.x+60,RZ.yt+60,{color:CI,w:5,head:16})+label('電流：上へ',RZ.x+70,RZ.yt+70,{size:24,color:CI,weight:700}));
  s+=card(700,120,450,240,label('電子は 負',925,190,{size:30,color:'#6f9dff',anchor:'middle',weight:700})+label('電流の 向きは 同じ',925,265,{size:28,color:CI,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'work']:(p)=>{
  let s=bigRod({charges:0});
  s+=line(RZ.x+50,RZ.yt,RZ.x+50,RZ.yb,{color:C.dim,w:2,dash:'6 5'})+label('l',RZ.x+62,(RZ.yt+RZ.yb)/2,{size:30,color:C.ink,weight:700});
  const y=mix(RZ.yb-30,RZ.yt+30,seg(p,.3,.9));s+=plusCharge(RZ.x,y,15)+arrow(RZ.x,y-20,RZ.x,y-80,{color:Fc,w:5,head:14});
  s+=card(700,90,450,320,label('1 C あたりの 力',925,145,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(EMF,'v')}${cs(CB,'B')}`,925,205,{size:44,color:Fc})+fade(seg(p,.4,.6),label('長さ l だけ 押す',925,270,{size:26,color:C.dim,anchor:'middle'})+T(`${cs(EMF,'v')}${cs(CB,'B')}\\times l`,925,340,{size:44})),seg(p,.05,.2));
  return s;
 },
 [K+'same']:(p)=>{
  let s=card(90,120,460,260,label('面積の 増え方',320,185,{size:28,color:PHI,anchor:'middle',weight:700})+T(`${DPHI}=${BLV}`,320,285,{size:40}),seg(p,.02,.15),PHI);
  s+=card(650,120,460,260,label('動く電荷の 力',880,185,{size:28,color:Fc,anchor:'middle',weight:700})+T(`${cs(EMF,'v')}${cs(CB,'B')}\\times l`,880,285,{size:44}),seg(p,.02,.15),Fc);
  s+=fade(seg(p,.3,.5),label('＝',600,265,{size:50,color:C.hi,anchor:'middle',weight:700})+label('同じ 起電力 Blv',600,450,{size:30,color:EMF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'two']:(p)=>{
  let s=card(90,90,460,200,label('磁束の 変化',320,170,{size:30,color:PHI,anchor:'middle',weight:700})+label('（回路 全体で 見る）',320,225,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.15),PHI);
  s+=card(650,90,460,200,label('動く電荷への 磁気力',880,170,{size:30,color:Fc,anchor:'middle',weight:700})+label('（棒の中で 見る）',880,225,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.25),Fc);
  s+=card(250,330,700,120,label('前回の 回るコイル：押していたのは 磁気力',600,400,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.7),C.hi);
  return s;
 },
 [K+'open']:(p)=>{
  let s=bigRod({});
  const k=seg(p,.15,.7);
  for(let i=0;i<3;i++){s+=fade(clamp(k*3-i),plusCharge(RZ.x-30+30*i,RZ.yt+22,13)+minus(RZ.x-30+30*i,RZ.yb-22,13));}
  s+=fade(seg(p,.5,.7),arrow(RZ.x-70,RZ.yt+70,RZ.x-70,RZ.yb-70,{color:CE,w:5,head:16})+label('𝐄',RZ.x-84,(RZ.yt+RZ.yb)/2,{size:30,color:CE,anchor:'end',weight:700}));
  s+=card(700,90,450,320,label('上端に 正、下端に 負',925,160,{size:28,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('電場の力（下）',925,230,{size:28,color:CE,anchor:'middle',weight:700})+label('＝ 磁気力（上）',925,280,{size:28,color:Fc,anchor:'middle',weight:700}))+fade(seg(p,.75,.9),label('→ たまるのが 止まる',925,350,{size:26,color:C.hi,anchor:'middle'})),seg(p,.05,.2));
  return s;
 },
 [K+'open2']:(p)=>{
  let s=bigRod({});
  for(let i=0;i<3;i++)s+=plusCharge(RZ.x-30+30*i,RZ.yt+22,13)+minus(RZ.x-30+30*i,RZ.yb-22,13);
  s+=arrow(RZ.x-70,RZ.yt+70,RZ.x-70,RZ.yb-70,{color:CE,w:5,head:16});
  s+=card(700,110,450,280,label('両端の 電位差',925,180,{size:28,color:EMF,anchor:'middle',weight:700})+T(`${BLV}`,925,250,{size:48})+fade(seg(p,.45,.6),label('電流は 流れない',925,330,{size:28,color:C.dim,anchor:'middle'})),seg(p,.05,.2),EMF);
  return s;
 },
 // ===== S4 エネルギーはどこから =====
 [K+'puzzle']:(p)=>{
  let s=card(90,130,480,240,label('ローレンツ力・中級',330,190,{size:24,color:C.dim,anchor:'middle'})+label('磁場の力は',330,250,{size:28,color:C.ink,anchor:'middle'})+label('仕事をしない',330,305,{size:32,color:CB,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(630,130,480,240,label('電気の エネルギーは',870,220,{size:28,color:C.ink,anchor:'middle'})+label('どこから？',870,290,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'drag']:(p)=>{
  let s=rails({xr:460,vG:1,cur:1});
  s+=fade(seg(p,.3,.5),arrow(446,300,330,300,{color:Fc,w:8,head:22})+label('IlB',380,285,{size:30,color:Fc,anchor:'middle',weight:700}));
  s+=card(760,110,390,260,label('電流 上 × 𝐁 奥',955,180,{size:28,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.6),label('力は 左',955,245,{size:32,color:Fc,anchor:'middle',weight:700})+label('＝ 動きと 逆',955,305,{size:30,color:NEG,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'hand']:(p)=>{
  let s=rails({xr:460,vG:.5,cur:1});
  s+=arrow(446,300,350,300,{color:Fc,w:7,head:20,opacity:.6});
  s+=fade(seg(p,.1,.3),arrow(480,215,600,215,{color:C.hi,w:8,head:22})+label('手で 押す',540,190,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(760,110,390,260,label('速さを 保つには',955,180,{size:28,color:C.ink,anchor:'middle'})+label('手で 押し続ける',955,240,{size:30,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('→ 電気の エネルギー',955,310,{size:28,color:EMF,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=label('磁気力の 仕事',330,90,{size:28,color:Fc,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),label('電荷を 棒に沿って 押す',330,170,{size:26,color:C.ink,anchor:'middle'})+label('＋',560,172,{size:34,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.35),label('棒の 動きに 逆らう',330,240,{size:26,color:C.ink,anchor:'middle'})+label('−',560,242,{size:38,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),line(120,275,600,275,{color:C.dim,w:2})+label('差し引き 0',330,320,{size:32,color:C.hi,anchor:'middle',weight:700}));
  const it=[['手の 仕事',C.hi],['磁気力が 受け渡す',Fc],['電気の エネルギー',EMF]];
  it.forEach(([t,c],i)=>{s+=fade(seg(p,.55+i*.12,.65+i*.12),card(700,70+i*130,420,90,label(t,910,125+i*130,{size:28,color:c,anchor:'middle',weight:700}))+(i<2?arrow(910,165+i*130,910,195+i*130,{color:C.dim,w:3,head:12}):''));});
  return s;
 },
 // ===== S5 数で確かめる =====
 [K+'num']:(p)=>{
  const rows=[['磁場 B','0.5 T'],['棒の長さ l','0.2 m'],['速さ v','3 m/s']];
  let s='';rows.forEach(([a,b],i)=>{s+=fade(seg(p,.05+i*.2,.2+i*.2),label(a,520,170+i*90,{size:34,color:C.ink,anchor:'end'})+label(b,570,170+i*90,{size:36,color:C.hi,weight:700}));});
  return s;
 },
 [K+'num2']:(p)=>{
  let s=T(`l${cs(EMF,'v')}=0.2\\times3=0.6\\,\\mathrm{m^2/s}`,600,110,{size:46});
  s+=fade(seg(p,.3,.5),T(`${DPHI}=0.5\\times0.6=0.3\\,\\mathrm{Wb/s}`,600,240,{size:46}));
  s+=fade(seg(p,.6,.8),T(`|${EM}|=0.3\\,\\mathrm{V}`,600,380,{size:58}));
  return s;
 },
 [K+'num3']:(p)=>{
  let s=label('力の 見方',600,70,{size:28,color:Fc,anchor:'middle',weight:700});
  s+=T(`${cs(EMF,'v')}${cs(CB,'B')}=3\\times0.5=1.5\\,\\mathrm{N}`,560,170,{size:46});
  s+=label('（1 C あたり）',800,180,{size:26,color:C.dim});
  s+=fade(seg(p,.35,.55),T(`1.5\\,\\mathrm{N}\\times0.2\\,\\mathrm{m}=0.3\\,\\mathrm{J}`,600,290,{size:46}));
  s+=fade(seg(p,.65,.8),label('→ 0.3 V（同じ）',600,410,{size:34,color:EMF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=T(`\\mathrm{T}\\times\\mathrm{m}\\times\\mathrm{m/s}=\\mathrm{T\\cdot m^2/s}`,600,160,{size:50});
  s+=fade(seg(p,.4,.6),T(`=\\mathrm{Wb/s}=\\mathrm{V}`,600,310,{size:52}));
  return s;
 },
 [K+'current']:(p)=>{
  let s=rails({xr:460,vG:1,cur:seg(p,.3,.5),bG:.6});
  s+=label('0.6 Ω',RL.x0+20,(RL.yt+RL.yb)/2+10,{size:26,color:SURF,weight:700});
  s+=card(740,110,410,260,T(`I=\\dfrac{${EM}}{R}`,945,190,{size:44,color:CI})+fade(seg(p,.4,.6),T(`=\\dfrac{0.3}{0.6}=0.5\\,\\mathrm{A}`,945,300,{size:42})),seg(p,.05,.2),CI);
  return s;
 },
 [K+'dragnum']:(p)=>{
  let s=rails({xr:460,vG:1,cur:1,bG:.6});
  s+=arrow(446,300,330,300,{color:Fc,w:8,head:22});
  s+=card(740,110,410,260,T(`IlB`,945,180,{size:44,color:Fc})+fade(seg(p,.3,.5),T(`=0.5\\times0.2\\times0.5`,945,250,{size:36})+T(`=0.05\\,\\mathrm{N}`,945,320,{size:40})),seg(p,.05,.2),Fc);
  return s;
 },
 [K+'power']:(p)=>{
  let s=card(90,120,480,260,label('手の 仕事率',330,180,{size:30,color:C.hi,anchor:'middle',weight:700})+label('力 × 速さ',330,235,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.3,.5),T(`0.05\\times3=0.15\\,\\mathrm{W}`,330,320,{size:38})),seg(p,.02,.2),C.hi);
  return s;
 },
 [K+'power2']:(p)=>{
  let s=card(90,120,480,260,label('手の 仕事率',330,180,{size:30,color:C.hi,anchor:'middle',weight:700})+label('力 × 速さ',330,235,{size:26,color:C.dim,anchor:'middle'})+T(`0.05\\times3=0.15\\,\\mathrm{W}`,330,320,{size:38}),1,C.hi);
  s+=card(630,120,480,260,label('電気の 側',870,180,{size:30,color:EMF,anchor:'middle',weight:700})+label('1 C あたり 0.3 J × 毎秒 0.5 C',870,235,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.35,.55),T(`0.3\\times0.5=0.15\\,\\mathrm{W}`,870,320,{size:38})),seg(p,.05,.2),EMF);
  s+=fade(seg(p,.7,.85),label('一致',600,450,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=rails({xr:mix(300,560,seg(p,0,1)),vG:1,res:1});
  s+=card(760,110,390,260,label('速さ 2倍（6 m/s）',955,175,{size:28,color:EMF,anchor:'middle',weight:700})+label('起電力・電流・',955,245,{size:28,color:C.ink,anchor:'middle'})+label('手の 仕事率は？',955,295,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),EMF);
  return s;
 },
 [K+'quizans']:(p)=>{
  const rows=[['起電力','0.3 V','0.6 V','2倍',EMF],['電流','0.5 A','1 A','2倍',CI],['力','0.05 N','0.1 N','2倍',Fc],['仕事率','0.15 W','0.6 W','4倍',C.hi]];
  let s=label('3 m/s',560,80,{size:28,color:C.dim,anchor:'middle'})+label('6 m/s',800,80,{size:28,color:EMF,anchor:'middle',weight:700});
  rows.forEach(([a,b,c,d,col],i)=>{const y=150+i*85,g=i<2?seg(p,.02+i*.1,.12+i*.1):seg(p,.45+(i-2)*.2,.55+(i-2)*.2);
   s+=fade(g,label(a,380,y,{size:30,color:col,anchor:'end',weight:700})+label(b,560,y,{size:30,color:C.ink,anchor:'middle'})+label('→',680,y,{size:28,color:C.dim,anchor:'middle'})+label(c,800,y,{size:32,color:col,anchor:'middle',weight:700})+label(d,960,y,{size:30,color:C.hi,anchor:'middle',weight:700}));});
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=T(`|${EM}|=${BLV}`,600,110,{size:56});
  s+=card(90,200,460,200,label('面積の 増え方',320,270,{size:28,color:PHI,anchor:'middle',weight:700})+T(`${cs(CB,'B')}\\times l${cs(EMF,'v')}`,320,345,{size:40}),seg(p,.15,.3),PHI);
  s+=card(650,200,460,200,label('動く電荷への 磁気力',880,270,{size:28,color:Fc,anchor:'middle',weight:700})+T(`${cs(EMF,'v')}${cs(CB,'B')}\\times l`,880,345,{size:40}),seg(p,.4,.55),Fc);
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,70,460,250,label('固定した 輪',320,130,{size:30,color:C.ink,anchor:'middle',weight:700})+label('磁場の変化 → 回る 電場',320,200,{size:26,color:CE,anchor:'middle',weight:700})+label('（1本目）',320,260,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.2));
  s+=card(650,70,460,250,label('動く 導線',880,130,{size:30,color:C.ink,anchor:'middle',weight:700})+label('磁気力が 電荷を 押す',880,200,{size:26,color:Fc,anchor:'middle',weight:700})+label('（2本目・3本目）',880,260,{size:24,color:C.dim,anchor:'middle'}),seg(p,.25,.4));
  s+=fade(seg(p,.6,.75),label('どちらも',420,420,{size:28,color:C.ink,anchor:'end'})+T(`${EM}=-${DPHI}`,560,420,{size:44}));
  return s;
 },
 [K+'sum3']:(p)=>{
  let s=rails({xr:460,vG:1,cur:1,bG:.5});
  s+=card(760,110,390,260,T(`I=\\dfrac{${EM}}{R}`,955,195,{size:44,color:CI})+fade(seg(p,.4,.6),label('エネルギー ←',955,285,{size:26,color:C.ink,anchor:'middle'})+label('外からの 仕事',955,330,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),CI);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=rails({xr:460,bG:0,vG:0,cur:.8});
  s+=card(760,140,390,200,label('ここまで：抵抗だけ',955,250,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  // simple circuit: ℰ (left), R (top), capacitor (right)
  const x0=120,x1=520,y0=130,y1=390;let s='';
  s+=draw([[x0,y0],[x1,y0]],1,{color:SURF,w:4})+draw([[x0,y1],[x1,y1]],1,{color:SURF,w:4});
  s+=line(x0,y0,x0,230,{color:SURF,w:4})+line(x0,290,x0,y1,{color:SURF,w:4})+ring(x0,260,30,{color:EMF,w:4,fill:'#1d1a33'})+label('ℰ',x0-44,270,{size:30,color:EMF,anchor:'end',weight:700});
  const zz=[[260,y0]];for(let i=1;i<8;i++)zz.push([260+i*15,y0+(i%2?-14:14)]);zz.push([380,y0]);s+=rect(255,y0-20,130,40,{fill:C.bg,fo:1,stroke:'none'})+draw(zz,1,{color:SURF,w:4})+label('R',320,y0-30,{size:28,color:SURF,anchor:'middle',weight:700});
  s+=line(x1,y0,x1,245,{color:SURF,w:4})+line(x1,275,x1,y1,{color:SURF,w:4})+line(x1-40,245,x1+40,245,{color:C.hi,w:6})+line(x1-40,275,x1+40,275,{color:C.hi,w:6})+label('C',x1+54,270,{size:30,color:C.hi,weight:700});
  s+=fade(seg(p,.3,.5),label('+q',x1-60,238,{size:24,color:'#ff6b6b',anchor:'end',weight:700})+label('−q',x1-60,300,{size:24,color:'#6f9dff',anchor:'end',weight:700}));
  s+=card(680,110,470,270,label('コンデンサを つなぐと',915,175,{size:28,color:C.ink,anchor:'middle'})+label('電荷と 電流は',915,235,{size:30,color:C.ink,anchor:'middle',weight:700})+label('時間とともに どう変わる？',915,290,{size:28,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.55,.7),label('式で 解けるか？',915,345,{size:28,color:EMF,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
};
