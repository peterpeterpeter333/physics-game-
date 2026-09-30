// YouTube シリーズ「電磁誘導・中級 2/3」(ys-um-induction-2) — 図。Stage 1200×515.
// 色：𝐁 橙、法線 桃、磁束 Φ 黄、起電力 ℰ 紫、コイルの導線 緑、角速度 ω 桃、時間 t 金、負・誤り 赤。部品は 1/3 の図から借りる。
// 上から見た図：回転軸は画面に垂直（中心の点）。𝐁 は右向き。コイルは線分に見え、法線はそれに垂直。θ は 𝐁（右）から法線まで反時計回りに測る。
// t＝0 で法線∥𝐁 → θ＝ωt → Φ＝BA cos ωt。ℰ＝NBAω sin ωt：θ＝0 で ℰ＝0、θ＝90° で Φ＝0・ℰ 最大。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,highlight} from './anim.mjs';
import {CE,CB,CI,EMF,PHI,NC,DA,NEG,SURF,MEM,RAD,cs,T,card,head,outSym,arcPts,graph,texSpan,EM,PH,tt,DPHI,OE} from './yt1-um-induction-1-diagrams.mjs';

const K='um-induction-2:';
const om=cs(NC,'\\omega'),NBA=`NBA`;
const EMFw=`${EM}=NBA${om}\\sin ${om}${tt}`;
const PHIw=`${PH}=BA\\cos ${om}${tt}`;
const NLAW=`${EM}=-N${DPHI}`;

// ---- coil stack (side view) ----------------------------------------------------------------------------
function coilStack(cx,cy0,{n=6,rx=150,ry=32,gap=40,g=1,hl=-1,field=0,trace=0,color=CI,sizes=null}={}){
 let s='';
 if(field>0)[-90,-45,0,45,90].forEach(dx=>{s+=fade(field,arrow(cx+dx,cy0+n*gap+60,cx+dx,cy0-70,{color:CB,w:3.5,head:13,opacity:.85}));});
 for(let i=0;i<n;i++){const cy=cy0+i*gap,k=sizes?sizes[i]:1;
  s+=draw(arcPts(cx,cy,rx*k,ry*k,0,360,60),1,{color:i===hl?C.hi:color,w:i===hl?6:4});}
 if(trace>0){// a dot going round the helix n times
  const u=trace*n,i=Math.min(n-1,Math.floor(u)),f=u-i,a=(270+360*f)*RAD,cy=cy0+i*gap+f*gap;
  s+=dot(cx+rx*Math.cos(a),cy-ry*Math.sin(a),9,C.hi);
 }
 return fade(g,s);
}
// ---- rotating coil, top view ---------------------------------------------------------------------------
const TP={x:290,y:258};
function topRot(ang,{cx=TP.x,cy=TP.y,Lc=135,nL=120,g=1,Bg=1,nG=1,arc=0,arcLab='θ',spin=1,coilCol=CI,bw=260,bh=200}={}){
 let s='';
 for(let y=cy-bh;y<=cy+bh+1;y+=bh>150?66:Math.max(40,bh*2/3))s+=fade(Bg,arrow(cx-bw,y,cx+bw-10,y,{color:CB,w:3,head:12,opacity:.55}));
 s+=fade(Bg,label('𝐁',cx+bw+2,cy-bh+10,{size:28,color:CB,weight:700}));
 const a=ang,ux=Math.cos(a),uy=-Math.sin(a),sx=-Math.sin(a),sy=-Math.cos(a);
 s+=line(cx-Lc*sx,cy-Lc*sy,cx+Lc*sx,cy+Lc*sy,{color:coilCol,w:9});
 s+=dot(cx,cy,7,C.ink);
 if(arc>0){const r=62,A=Array.from({length:31},(_,i)=>{const t=a*i/30;return [cx+r*Math.cos(t),cy-r*Math.sin(t)];});
  s+=fade(arc,draw(A,1,{color:C.hi,w:3})+label(arcLab,cx+(r+26)*Math.cos(a/2),cy-(r+26)*Math.sin(a/2)+10,{size:26,color:C.hi,anchor:'middle',weight:700}));}
 s+=fade(nG,arrow(cx,cy,cx+nL*ux,cy+nL*uy,{color:NC,w:5,head:16})+label('法線',cx+(nL+24)*ux,cy+(nL+24)*uy+8,{size:24,color:NC,anchor:'middle',weight:700}));
 if(spin){const r=175,A=Array.from({length:21},(_,i)=>{const t=(200+40*i/20)*RAD;return [cx+r*Math.cos(t),cy-r*Math.sin(t)];});
  s+=draw(A,1,{color:NC,w:3.5})+head(A.at(-1)[0],A.at(-1)[1],A.at(-1)[0]-A.at(-2)[0],A.at(-1)[1]-A.at(-2)[1],{color:NC,L:16})+label('ω',cx-r-20,cy+84,{size:30,color:NC,weight:700});}
 return fade(g,s);
}
// ---- waves ----------------------------------------------------------------------------------------------
// ωt from 0 to 4π over width; f = cos or sin
function wave(x0,yMid,w,amp,fn,{prog=1,color=PHI,wd=5,turns=2}={}){
 const n=160,pts=[];for(let i=0;i<=n*prog;i++){const u=i/n,ph=u*turns*2*Math.PI;pts.push([x0+w*u,yMid-amp*fn(ph)]);}
 return pts.length>1?draw(pts,1,{color,w:wd}):'';
}
function axesW(x0,yMid,w,amp,{yl='Φ',col=PHI,g=1,xl=true}={}){
 let s=arrow(x0-6,yMid,x0+w+22,yMid,{color:C.dim,w:2.5,head:12})+arrow(x0,yMid+amp+14,x0,yMid-amp-24,{color:C.dim,w:2.5,head:12});
 s+=label(yl,x0-14,yMid-amp-14,{size:26,color:col,anchor:'end',weight:700});
 if(xl)s+=label('t',x0+w+26,yMid+30,{size:24,color:C.t,anchor:'middle'});
 return fade(g,s);
}

export const ytUmInduction2Diagrams={
 // ===== S1 前回の問い =====
 [K+'intro']:(p)=>{
  let s=fade(seg(p,0,.15),label('前回の 最後の問い',60,50,{size:24,color:C.dim}));
  s+=coilStack(170,140,{n:6,rx:95,ry:22,gap:34,g:seg(p,.05,.25)})+fade(seg(p,.1,.3),label('N 巻き',170,400,{size:28,color:CI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),topRot(seg(p,.45,1)*Math.PI*1.2,{cx:490,cy:260,Lc:80,nL:70,spin:0,bw:130,bh:120}));
  s+=card(700,110,450,270,label('N 巻きなら？',925,180,{size:30,color:CI,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('回し続けると？',925,260,{size:30,color:CB,anchor:'middle',weight:700}))+fade(seg(p,.6,.75),label('起電力は どう 変わる？',925,330,{size:28,color:EMF,anchor:'middle'})),seg(p,.1,.3),EMF);
  return s;
 },
 [K+'recap']:(p)=>{
  let s=label('前回',600,80,{size:28,color:C.dim,anchor:'middle'});
  s+=T(`${EM}=${OE}=-${DPHI}`,600,220,{size:62});
  s+=fade(seg(p,.4,.6),label('固定した 輪',600,370,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'recap2']:(p)=>{
  let s=T(`${EM}=-${DPHI}`,330,170,{size:56});
  s+=fade(seg(p,.05,.25),label('負号：組にした向きに 対して 変化を 妨げる',330,290,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(680,110,470,260,label('1巻き',915,170,{size:28,color:C.ink,anchor:'middle',weight:700})+T(`${DPHI}=0.2\\,\\mathrm{Wb/s}`,915,235,{size:36})+fade(seg(p,.6,.75),T(`${EM}=-0.2\\,\\mathrm{V}`,915,320,{size:40})),seg(p,.45,.6));
  return s;
 },
 [K+'plan']:(p)=>{
  let s='';const it=[['① 巻数を 増やす',CI],['② コイルを 回す',CB],['③ 微分で ℰ(t)',EMF]];
  it.forEach(([t,c],i)=>{s+=card(90+i*350,170,320,160,label(t,250+i*350,262,{size:30,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.2,.2+i*.2),c);});
  return s;
 },
 // ===== S2 N 巻き =====
 [K+'coil']:(p)=>{
  let s=coilStack(300,120,{n:6,g:1,hl:Math.floor(seg(p,.2,.9)*6.99)});
  s+=label('N 巻き',300,420,{size:30,color:CI,anchor:'middle',weight:700});
  s+=card(680,130,470,220,label('同じ形の 輪が',915,205,{size:28,color:C.ink,anchor:'middle'})+label('N 個 重なる',915,265,{size:32,color:CI,anchor:'middle',weight:700}),seg(p,.1,.3));
  return s;
 },
 [K+'same']:(p)=>{
  let s=coilStack(300,120,{n:6,field:seg(p,.05,.3)});
  s+=card(680,110,470,260,label('各巻きに 同じ Φ',915,180,{size:30,color:PHI,anchor:'middle',weight:700})+fade(seg(p,.45,.6),label('どの巻きにも',915,235,{size:26,color:C.ink,anchor:'middle'})+T(`-${DPHI}`,915,320,{size:46,color:EMF})),seg(p,.2,.35));
  return s;
 },
 [K+'series']:(p)=>{
  let s=coilStack(300,120,{n:6,field:.35,trace:seg(p,.05,.85)});
  const k=Math.min(6,Math.floor(seg(p,.05,.85)*6+1e-6));
  s+=card(680,110,470,270,label('導線を たどると',915,170,{size:26,color:C.dim,anchor:'middle'})+label(`${k} 周`,915,235,{size:36,color:C.hi,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('一周の和 ＝ 1巻きの N 倍',915,320,{size:28,color:EMF,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'formula']:(p)=>{
  let s=T(NLAW,600,140,{size:60});
  s+=fade(seg(p,.35,.55),T(`\\Psi=N${PH}`,380,330,{size:52})+label('鎖交磁束',380,410,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.6,.8),T(`${EM}=-\\dfrac{d\\Psi}{d${tt}}`,830,330,{size:52}));
  return s;
 },
 [K+'caution']:(p)=>{
  let s=coilStack(300,120,{n:6,field:.8});
  s+=card(680,90,470,320,T(`\\Psi=N${PH}`,915,160,{size:44})+label('磁束が 導線の中を 通る',915,235,{size:26,color:C.dim,anchor:'middle'})+line(780,225,1050,245,{color:NEG,w:4})
   +fade(seg(p,.4,.6),label('各巻きの面を 同じ Φ が',915,305,{size:28,color:PHI,anchor:'middle',weight:700})+label('貫く 回数を 数えた もの',915,350,{size:28,color:PHI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'caution2']:(p)=>{
  let s=coilStack(300,120,{n:6,sizes:[1,.7,.9,.55,.8,.65].map(k=>mix(1,k,seg(p,.05,.35)))});
  s+=card(680,110,470,260,label('巻きごとに Φ が 違う',915,180,{size:28,color:C.ink,anchor:'middle',weight:700})+label('→ N を 掛けられない',915,240,{size:28,color:NEG,anchor:'middle'})
   +fade(seg(p,.55,.7),T(`${EM}=-\\sum_{k}\\dfrac{d${PH}_k}{d${tt}}`,915,325,{size:36})),seg(p,.2,.35));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=label('10巻き、各巻き 毎秒 0.2 Wb 増える',600,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),T(`${EM}=-N${DPHI}`,600,210,{size:50}));
  s+=fade(seg(p,.45,.65),T(`=-10\\times0.2\\,\\mathrm{Wb/s}=-2\\,\\mathrm{V}`,600,340,{size:50}));
  return s;
 },
 [K+'exsign']:(p)=>{
  let s=card(90,130,480,240,label('1巻き',330,195,{size:30,color:C.ink,anchor:'middle',weight:700})+T(`${EM}=-0.2\\,\\mathrm{V}`,330,290,{size:44}),seg(p,.05,.2));
  s+=card(630,130,480,240,label('10巻き',870,195,{size:30,color:CI,anchor:'middle',weight:700})+T(`${EM}=-2\\,\\mathrm{V}`,870,290,{size:44}),seg(p,.3,.45),CI);
  s+=fade(seg(p,.5,.65),label('同じ 磁束の変化 → 10 倍',600,440,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 回るコイルの磁束 =====
 [K+'gen']:(p)=>{
  let s=label('上から見た図（回転軸は 中心の点）',40,40,{size:22,color:C.dim});
  s+=topRot(seg(p,.2,1)*Math.PI*.9,{nG:0,spin:1});
  s+=card(700,120,450,240,label('一様な 𝐁 の中で',925,185,{size:28,color:CB,anchor:'middle',weight:700})+label('面積 A の コイルを',925,240,{size:28,color:C.ink,anchor:'middle'})+label('一定の 速さで 回す',925,295,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2));
  return s;
 },
 [K+'omega']:(p)=>{
  const a=mix(0,70*RAD,seg(p,.1,.6));
  let s=topRot(a,{nG:.5,arc:seg(p,.45,.6),arcLab:'ωt'});
  s+=card(700,100,450,300,label('角速度 ω',925,160,{size:30,color:NC,anchor:'middle',weight:700})+label('1秒あたりに 回る角',925,215,{size:26,color:C.ink,anchor:'middle'})+label('単位 rad/s',925,265,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.5,.65),label('時刻 t までに ωt',925,340,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.15));
  return s;
 },
 [K+'angle']:(p)=>{
  const a=seg(p,.35,.8)*60*RAD;
  let s=topRot(a,{arc:seg(p,.45,.6),arcLab:'θ'});
  s+=card(700,110,450,270,label('t ＝ 0：法線 ∥ 𝐁',925,180,{size:28,color:NC,anchor:'middle',weight:700})+fade(seg(p,.5,.65),T(`\\theta=${om}${tt}`,925,280,{size:52})),seg(p,.02,.15));
  return s;
 },
 [K+'flux']:(p)=>{
  let s=T(`${PH}=BA\\cos\\theta`,600,150,{size:58});
  s+=fade(seg(p,.1,.25),label('初級：法線方向の 成分 × 面積',600,235,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),T(PHIw,600,370,{size:64}));
  return s;
 },
 [K+'graph']:(p)=>{
  const u=seg(p,.05,.95),a=u*4*Math.PI*.5;// one turn over the cue
  let s=topRot(a,{cx:250,cy:258,Lc:110,nL:100,spin:1});
  const x0=600,yM=260,w=500,amp=130;
  s+=axesW(x0,yM,w,amp,{yl:'Φ'})+wave(x0,yM,w,amp,Math.cos,{prog:u*.5*1,turns:2});
  s+=label('BA',x0-12,yM-amp+8,{size:22,color:PHI,anchor:'end'})+line(x0-5,yM-amp,x0+5,yM-amp,{color:C.dim});
  s+=label('1回転',x0+w/2,yM+amp+40,{size:24,color:C.t,anchor:'middle'})+line(x0+w/2,yM-5,x0+w/2,yM+5,{color:C.dim});
  return s;
 },
 [K+'note1']:(p)=>{
  let s=topRot(seg(p,0,1)*Math.PI*.6+Math.PI*.3,{cx:250,cy:258,Lc:110,nL:100});
  s+=card(640,120,500,240,label('𝐁：一定（変わらない）',890,195,{size:30,color:CB,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('動くのは 導線',890,280,{size:32,color:CI,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'note2']:(p)=>{
  let s=card(90,120,480,260,label('起電力は',330,190,{size:26,color:C.dim,anchor:'middle'})+T(NLAW,330,280,{size:44})+label('で 求められる',330,350,{size:26,color:C.dim,anchor:'middle'}),seg(p,.02,.2));
  s+=card(630,120,480,260,label('電荷を 何が 押す？',870,215,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 3本目',870,290,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 // ===== S4 微分で起電力を出す =====
 [K+'plug']:(p)=>{
  let s=T(NLAW,600,100,{size:50});
  s+=fade(seg(p,.15,.35),T(`${EM}=-N\\dfrac{d}{d${tt}}\\left(BA\\cos ${om}${tt}\\right)`,600,230,{size:50}));
  s+=fade(seg(p,.55,.75),T(`=-NBA\\,\\dfrac{d}{d${tt}}\\cos ${om}${tt}`,600,370,{size:50}));
  s+=fade(seg(p,.7,.85),label('N・B・A は 時間で 変わらない → 外へ',600,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'diff1']:(p)=>{
  let s=T(`\\dfrac{d}{d${tt}}\\cos(${om}${tt})`,300,160,{size:54});
  s+=card(620,70,520,170,label('外側：cos の微分',880,125,{size:26,color:C.dim,anchor:'middle'})+T(`-\\sin(${om}${tt})`,880,195,{size:44}),seg(p,.1,.3));
  s+=card(620,270,520,170,label('中身：ωt を t で微分',880,325,{size:26,color:C.dim,anchor:'middle'})+T(`${om}`,880,395,{size:48}),seg(p,.5,.7),NC);
  s+=fade(seg(p,.75,.9),label('× で 掛ける',300,330,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'diff2']:(p)=>{
  let s=T(`\\dfrac{d}{d${tt}}\\cos(${om}${tt})=-${om}\\sin(${om}${tt})`,600,180,{size:58});
  s+=fade(seg(p,.05,.25),label('合成関数の 微分（微分の法則・中級）',600,330,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'cancel']:(p)=>{
  const L1=`${EM}=-NBA\\times(-${om}\\sin ${om}${tt})`;
  let s=T(L1,600,150,{size:54});
  const m1=texSpan(`${EM}=`,'-',`NBA\\times(-${om}\\sin ${om}${tt})`,600,54),m2=texSpan(`${EM}=-NBA\\times(`,'-',`${om}\\sin ${om}${tt})`,600,54);
  s+=fade(seg(p,.4,.55),highlight(m1[0]+9,112,m1[1]-m1[0]+12,40,1,NEG)+highlight(m2[0]-6,112,m2[1]-m2[0]+12,40,1,NEG)+label('マイナス 2つ → 打ち消し合う',600,250,{size:28,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),T(EMFw,600,380,{size:64}));
  return s;
 },
 [K+'check']:(p)=>{
  const x0=110,yM=250,w=460,amp=120;
  let s=axesW(x0,yM,w,amp,{yl:'Φ'})+wave(x0,yM,w,amp,Math.cos,{turns:.5});
  s+=fade(seg(p,.1,.3),arrow(x0+30,yM-amp+2,x0+120,yM-amp+26,{color:NEG,w:4,head:14})+label('減る',x0+140,yM-amp+10,{size:26,color:NEG,weight:700}));
  s+=label('回り始め',x0+60,yM+amp+40,{size:24,color:C.t,anchor:'middle'});
  let c=T(`${DPHI}<0`,910,160,{size:40});
  c+=fade(seg(p,.4,.55),arrow(910,200,910,235,{color:C.dim,w:3,head:12})+T(`${EM}>0`,910,280,{size:40}));
  c+=fade(seg(p,.65,.8),label('sin ωt ＞ 0 と 一致',910,360,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(680,90,460,320,c,seg(p,.05,.2));
  return s;
 },
 [K+'amp']:(p)=>{
  let s=T(EMFw,600,170,{size:66});
  const m=texSpan(`${EM}=`,`NBA${om}`,`\\sin ${om}${tt}`,600,66);
  s+=fade(seg(p,.05,.2),highlight(m[0]+10,115,m[1]-m[0]+2,80,1,C.hi)+label('振幅',(m[0]+m[1])/2+18,250,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.55),label('巻数 N・磁場 B・面積 A・回す速さ ω に 比例',600,380,{size:30,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'graphs']:(p)=>{
  const x0=150,w=560,amp=78,y1=120,y2=360;
  let s=axesW(x0,y1,w,amp,{yl:'Φ',xl:false})+wave(x0,y1,w,amp,Math.cos,{turns:2});
  s+=fade(seg(p,.05,.2),axesW(x0,y2,w,amp,{yl:'ℰ',col:EMF})+wave(x0,y2,w,amp,Math.sin,{turns:2,color:EMF,prog:seg(p,.1,.5)}));
  const xq=x0+w/8,xm=x0+w/2;
  s+=fade(seg(p,.5,.65),line(x0,y1-amp-10,x0,y2+amp+10,{color:C.hi,w:2.5,dash:'7 6'})+dot(x0,y1-amp,8,C.hi)+dot(x0,y2,8,C.hi));
  s+=fade(seg(p,.7,.85),line(xq,y1-amp-10,xq,y2+amp+10,{color:C.hi,w:2.5,dash:'7 6'})+dot(xq,y1,8,C.hi)+dot(xq,y2-amp,8,C.hi));
  s+=card(800,90,360,340,fade(seg(p,.5,.65),label('Φ 最大 → ℰ ＝ 0',980,190,{size:28,color:C.ink,anchor:'middle',weight:700}))+fade(seg(p,.7,.85),label('Φ ＝ 0 → ℰ 最大',980,300,{size:28,color:EMF,anchor:'middle',weight:700})),seg(p,.45,.6));
  return s;
 },
 [K+'slope']:(p)=>{
  const x0=150,w=560,amp=78,y1=120,y2=360;
  let s=axesW(x0,y1,w,amp,{yl:'Φ',xl:false})+wave(x0,y1,w,amp,Math.cos,{turns:2});
  s+=axesW(x0,y2,w,amp,{yl:'ℰ',col:EMF})+wave(x0,y2,w,amp,Math.sin,{turns:2,color:EMF});
  const k=w/(4*Math.PI),xq=x0+w/8;// slope at ωt=π/2 : dy/dx = -amp/k
  s+=fade(seg(p,.2,.4),line(xq-60,y1-60*amp/k,xq+60,y1+60*amp/k,{color:C.hi,w:4}));
  s+=fade(seg(p,.1,.3),line(x0-10,y1-amp,x0+70,y1-amp,{color:C.hi,w:4}));
  s+=card(800,90,360,340,label('傾き 0 → ℰ ＝ 0',980,180,{size:28,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.3,.45),label('傾き 最も急',980,270,{size:28,color:C.hi,anchor:'middle',weight:700})+label('→ ℰ 最大',980,320,{size:28,color:EMF,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'ac']:(p)=>{
  const x0=110,yM=250,w=720,amp=130;
  let s=axesW(x0,yM,w,amp,{yl:'ℰ',col:EMF})+wave(x0,yM,w,amp,Math.sin,{turns:2,color:EMF,prog:seg(p,.05,.6)});
  s+=fade(seg(p,.3,.45),label('＋',x0+w/8,yM-amp-20,{size:30,color:EMF,anchor:'middle',weight:700})+label('−',x0+3*w/8,yM+amp+40,{size:34,color:NEG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),line(x0+w/2,yM-amp-10,x0+w/2,yM+amp+10,{color:C.t,w:2.5,dash:'7 6'})+label('1回転',x0+w/4,yM+amp+70,{size:26,color:C.t,anchor:'middle',weight:700})+label('1回転',x0+3*w/4,yM+amp+70,{size:26,color:C.t,anchor:'middle',weight:700}));
  s+=card(880,150,280,180,label('交流',1020,250,{size:40,color:EMF,anchor:'middle',weight:700}),seg(p,.35,.5),EMF);
  return s;
 },
 // ===== S5 数で確かめる =====
 [K+'num']:(p)=>{
  const rows=[['巻数 N','100'],['磁場 B','0.1 T'],['面積 A','0.01 m²'],['回転','1秒に 50 回']];
  let s='';rows.forEach(([a,b],i)=>{s+=fade(seg(p,.05+i*.15,.18+i*.15),label(a,420,130+i*80,{size:32,color:C.ink,anchor:'end'})+label(b,470,130+i*80,{size:34,color:C.hi,weight:700}));});
  s+=card(760,140,380,200,label('振幅 NBAω は？',950,250,{size:30,color:EMF,anchor:'middle',weight:700}),seg(p,.7,.85),EMF);
  return s;
 },
 [K+'numw']:(p)=>{
  let s=label('1回転 ＝ 2π rad',600,110,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.25,.45),T(`${om}=2\\pi\\times50\\approx314\\,\\mathrm{rad/s}`,600,260,{size:58}));
  return s;
 },
 [K+'numamp']:(p)=>{
  let s=T(`NBA${om}=100\\times0.1\\times0.01\\times314`,600,160,{size:50});
  s+=fade(seg(p,.4,.6),T(`\\approx31\\,\\mathrm{V}`,600,310,{size:64,color:EMF}));
  return s;
 },
 [K+'numunit']:(p)=>{
  let s=T(`\\mathrm{T\\cdot m^2}=\\mathrm{Wb}`,600,150,{size:52});
  s+=fade(seg(p,.35,.55),T(`\\mathrm{Wb}\\times\\dfrac{1}{\\mathrm{s}}=\\mathrm{Wb/s}=\\mathrm{V}`,600,320,{size:52}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=topRot(seg(p,0,1)*Math.PI*3,{cx:260,cy:258,Lc:110,nL:100});
  s+=card(640,110,500,260,label('2倍の 速さで 回すと',890,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('振幅は？',890,250,{size:30,color:EMF,anchor:'middle',weight:700})+label('1回転の 時間は？',890,310,{size:30,color:C.t,anchor:'middle',weight:700}),seg(p,.05,.2),EMF);
  return s;
 },
 [K+'quizans']:(p)=>{
  const x0=110,yM=250,w=600,a1=65,a2=130;
  let s=axesW(x0,yM,w,a2,{yl:'ℰ',col:EMF});
  s+=wave(x0,yM,w,a1,Math.sin,{turns:1,color:C.dim,wd:3.5});
  s+=fade(seg(p,.05,.2),wave(x0,yM,w,a2,Math.sin,{turns:2,color:EMF,prog:seg(p,.05,.4)}));
  s+=label('元の速さ',x0+w*.25+10,yM-a1-12,{size:22,color:C.dim});
  s+=card(780,90,380,340,label('振幅 2倍',970,160,{size:30,color:EMF,anchor:'middle',weight:700})+label('約 63 V',970,210,{size:30,color:EMF,anchor:'middle'})
   +fade(seg(p,.5,.65),label('1回転の 時間',970,290,{size:28,color:C.t,anchor:'middle',weight:700})+label('0.02 s → 0.01 s',970,340,{size:30,color:C.t,anchor:'middle'})),seg(p,.1,.25));
  return s;
 },
 [K+'freq']:(p)=>{
  let s=card(150,120,900,260,label('実際の 発電機',600,185,{size:28,color:C.dim,anchor:'middle'})+label('コンセントの 周波数',600,250,{size:30,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.4,.6),label('← 回転数 と 磁石の 極の数',600,320,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.2));
  return s;
 },
 [K+'handle']:(p)=>{
  const items=[['電流が 流れる',CI],['回転を 妨げる 力',NEG],['外から 仕事',C.ink],['電気の エネルギー',EMF]];
  let s='';items.forEach(([t,c],i)=>{const x=150+i*300;s+=fade(seg(p,.05+i*.18,.18+i*.18),card(x-130,190,260,110,label(t,x,255,{size:26,color:c,anchor:'middle',weight:700}))+(i<3?arrow(x+132,245,x+168,245,{color:C.dim,w:3,head:12}):''));});
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=card(70,70,500,360,label('N 巻き',320,130,{size:30,color:CI,anchor:'middle',weight:700})+T(NLAW,320,240,{size:40})+label('各巻きに 同じ Φ のとき',320,340,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.2));
  s+=card(630,70,500,360,label('回るコイル',880,130,{size:30,color:CB,anchor:'middle',weight:700})+T(PHIw,880,215,{size:36})+fade(seg(p,.5,.7),arrow(880,245,880,280,{color:C.dim,w:3,head:12})+T(EMFw,880,330,{size:36})),seg(p,.3,.45));
  return s;
 },
 [K+'sum2']:(p)=>{
  let s=card(90,130,480,240,label('ℰ を 決めるのは',330,200,{size:26,color:C.dim,anchor:'middle'})+label('Φ の 傾き',330,270,{size:34,color:PHI,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(630,130,480,240,label('振幅 NBAω',870,200,{size:30,color:EMF,anchor:'middle',weight:700})+label('回す速さに 比例',870,270,{size:30,color:C.ink,anchor:'middle'}),seg(p,.45,.6));
  return s;
 },
 [K+'next1']:(p)=>{
  let s=topRot(seg(p,0,1)*Math.PI*.8,{cx:260,cy:258,Lc:110,nL:100});
  s+=card(640,130,500,220,label('𝐁 は 一定',890,200,{size:30,color:CB,anchor:'middle',weight:700})+label('動いたのは 導線',890,270,{size:30,color:CI,anchor:'middle',weight:700}),seg(p,.05,.2));
  return s;
 },
 [K+'next']:(p)=>{
  let s='';
  // rails and a sliding rod, B ⊗ everywhere
  for(let x=80;x<=560;x+=60)for(let y=120;y<=400;y+=70)s+=line(x-7,y-7,x+7,y+7,{color:CB,w:2.5,opacity:.6})+line(x-7,y+7,x+7,y-7,{color:CB,w:2.5,opacity:.6});
  s+=line(60,140,600,140,{color:SURF,w:5})+line(60,380,600,380,{color:SURF,w:5});
  const xr=mix(220,480,seg(p,.1,.9));
  s+=line(xr,120,xr,400,{color:CI,w:9})+arrow(xr+20,260,xr+100,260,{color:EMF,w:5,head:16})+label('v',xr+64,245,{size:28,color:EMF,weight:700});
  s+=card(680,110,470,270,label('𝐁 一定のまま 導線が 動く',915,175,{size:26,color:C.ink,anchor:'middle',weight:700})+label('起電力は 生まれる？',915,245,{size:30,color:EMF,anchor:'middle',weight:700})+fade(seg(p,.5,.65),label('電荷を 押すのは 何？',915,315,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),EMF);
  return s;
 },
};
