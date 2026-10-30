// 高校編「磁場と電磁誘導・深く学ぶ 4/4」(ys-hs-e-magnet-4) — 図。Stage 1200×515.
// 色：磁束 Φ 黄、時間 t 金、起電力 ℰ 紫、磁場 𝐁 橙、電流 I 緑、力 緑、法線 桃、仕事・エネルギー 橙、巻数 N 白。
// 発電機：𝐁 右向き。コイルを真横から見ると線分。法線の角 θ（右向き＝0°、反時計回り）＝ωt。Φ＝BA cosθ、起電力は Φ–t の傾きの符号を反転した sin 型
//   （Φ が減る半周期で＋、増える半周期で−）。Φ が最大・最小で ℰ＝0、Φ＝0 を横切るとき |ℰ| 最大。
import {C,clamp,mix,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly} from './anim.mjs';
import {card,tag,FA,BC,IC,FC,PHI,NC,TC,EMF,NP,SP,SURF,BAD,RAD,T,cs,Bt,It,Ft,Phit,EMt,tt,U,outSym,inSym,head,fieldRows,barMagnet,Qcard} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {meter,coilRig} from './yt1-hs-e-magnet-2-diagrams.mjs';

const K='hs-e-magnet-4:';
const At=cs(C.ink,'A'),thT=cs(C.ink,'\\theta'),Nt=cs(C.ink,'N');
const PHIDEF=`${Phit}=${Bt}${At}\\cos${thT}`;
const dPhi=`\\Delta${Phit}`,dT=`\\Delta${tt}`;
const LAW=`${EMt}=${Nt}\\times\\dfrac{${dPhi}}{${dT}}`;
const crossX=(x,y,r=26,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const sceneT=(p,ctx)=>ctx&&ctx.scene&&ctx.scene.captions?ctx.t+(ctx.scene.captions[ctx.k]?.start||0):p*8;
// ---- generic Φ–t axes ---------------------------------------------------------------------------------
export function axes2({x,y,w,h,g=1,tl='t',yl='Φ',ycol=PHI,neg=0}={}){
 let s=arrow(x-6,y,x+w+18,y,{color:C.dim,w:2.5,head:12})+arrow(x,y+6+neg,x,y-h-20,{color:C.dim,w:2.5,head:12});
 s+=label(tl,x+w+30,y+8,{size:26,color:TC,weight:700})+(yl==='ℰ'?T(EMt,x-14,y-h-22,{size:30,anchor:'end'}):label(yl,x-14,y-h-22,{size:26,color:ycol,anchor:'end',weight:700}));
 return fade(g,s);
}
// slope triangle on a straight segment from (x1,y1) to (x2,y2)
export function tri(x1,y1,x2,y2,{g=1,dt='Δt',dp='ΔΦ'}={}){
 return fade(g,line(x1,y1,x2,y1,{color:TC,w:4})+line(x2,y1,x2,y2,{color:PHI,w:4})+label(dt,(x1+x2)/2,y1+(y2>y1?-12:30),{size:26,color:TC,anchor:'middle',weight:700})+label(dp,x2+12,(y1+y2)/2+8,{size:26,color:PHI,weight:700}));
}
// ---- generator: coil edge-on in a field to the right ------------------------------------------------------
const GN={x:270,y:270,L:220};
function genCoil(th,{g=1,rows=1,normal=1,x=GN.x,y=GN.y,L=GN.L,lab=1}={}){
 const t=th*RAD,tx=-Math.sin(t),ty=Math.cos(t);
 let s=fade(rows*.7,[110,170,230,290,350,410].map(yy=>{let q='';for(let xx=50;xx+60<=500;xx+=110)q+=arrow(xx,yy,xx+60,yy,{color:BC,w:3,head:12});return q;}).join(''));
 if(lab)s+=T(cs(BC,'\\mathbf{B}'),505,120,{size:32,anchor:'start'});
 s+=line(x-tx*L/2,y+ty*L/2,x+tx*L/2,y-ty*L/2,{color:IC,w:9})+dot(x,y,7,C.dim);
 if(normal){const X=x+110*Math.cos(t),Y=y-110*Math.sin(t);s+=fade(normal,arrow(x,y,X,Y,{color:NC,w:6,head:18}));}
 return fade(g,s);
}
const GR={x:620,w:500,yP:160,yE:390,A:75};// one period across w
const gX=u=>GR.x+GR.w*u;// u = fraction of a turn
function genGraph({u=1,g=1,phi=1,emf=1,mark=null,tan=0,halves=0}={}){
 let s='';
 if(phi){s+=axes2({x:GR.x,y:GR.yP,w:GR.w,h:GR.A+8,neg:GR.A,g:phi,yl:'Φ'});
  if(halves)s+=fade(halves,rect(gX(0),GR.yP-GR.A-10,GR.w/2,2*GR.A+20,{fill:PHI,fo:.07,stroke:'none',rx:4})+label('減る',gX(.25),GR.yP+GR.A+4,{size:24,color:PHI,anchor:'middle',weight:700})+label('増える',gX(.75),GR.yP+GR.A+4,{size:24,color:PHI,anchor:'middle',weight:700}));
  s+=fade(phi,draw(Array.from({length:121},(_,i)=>{const v=u*i/120;return [gX(v),GR.yP-GR.A*Math.cos(2*Math.PI*v)];}),1,{color:PHI,w:4}));}
 if(emf){s+=axes2({x:GR.x,y:GR.yE,w:GR.w,h:GR.A+8,neg:GR.A,g:emf,yl:'ℰ',ycol:EMF});
  s+=fade(emf,draw(Array.from({length:121},(_,i)=>{const v=u*i/120;return [gX(v),GR.yE-GR.A*Math.sin(2*Math.PI*v)];}),1,{color:EMF,w:4}));
  if(halves)s+=fade(halves,label('＋',gX(.25),GR.yE-GR.A-12,{size:30,color:EMF,anchor:'middle',weight:700})+label('−',gX(.75),GR.yE+GR.A+36,{size:34,color:EMF,anchor:'middle',weight:700}));}
 if(mark!==null){const v=mark,px=gX(v),py=GR.yP-GR.A*Math.cos(2*Math.PI*v),ey=GR.yE-GR.A*Math.sin(2*Math.PI*v);
  s+=line(px,GR.yP-GR.A-14,px,GR.yE+GR.A+10,{color:C.faint,w:2,dash:'6 6'})+dot(px,py,8,PHI)+(emf?dot(px,ey,8,EMF):'');
  if(tan){const sl=GR.A*2*Math.PI*Math.sin(2*Math.PI*v)/GR.w,d=70;s+=fade(tan,line(px-d,py-sl*d,px+d,py+sl*d,{color:C.ink,w:3}));}}
 return fade(g,s);
}
// ---- bicycle (wheel + dynamo + lamp) ---------------------------------------------------------------------
function bike({g=1,rot=0,opp=0,lamp=1}={}){
 const cx=330,cy=290,R=150;
 let s=ring(cx,cy,R,{color:C.dim,w:10})+ring(cx,cy,R-14,{color:C.faint,w:2});
 for(let i=0;i<12;i++){const a=(i*30+rot)*RAD;s+=line(cx,cy,cx+(R-10)*Math.cos(a),cy-(R-10)*Math.sin(a),{color:C.faint,w:2});}
 s+=dot(cx,cy,10,C.dim);
 // dynamo touching the tyre at the upper right
 const dx=cx+R*Math.cos(40*RAD)+26,dy=cy-R*Math.sin(40*RAD)-14;
 s+=rect(dx-22,dy-50,44,70,{fill:'#5a6680',fo:1,stroke:C.ink,sw:2,rx:8})+label('発電機',dx+34,dy-40,{size:24,color:C.ink});
 s+=draw([[dx,dy-50],[dx,dy-90],[dx+170,dy-90]],1,{color:IC,w:3})+ring(dx+200,dy-90,26,{color:C.hi,w:3,fill:lamp?'#5a4a10':'#172238'})+fade(lamp,ring(dx+200,dy-90,40,{color:C.hi,w:2,dash:'4 6'}))+label('ライト',dx+200,dy-30,{size:24,color:C.hi,anchor:'middle'});
 // rotation arrow (clockwise)
 const arc=Array.from({length:21},(_,i)=>{const a=(200-60*i/20)*RAD;return [cx+(R+34)*Math.cos(a),cy-(R+34)*Math.sin(a)];});
 s+=draw(arc,1,{color:C.ink,w:4})+head(arc[20][0],arc[20][1],arc[20][0]-arc[18][0],arc[20][1]-arc[18][1],{color:C.ink,L:18});
 if(opp){const a2=Array.from({length:21},(_,i)=>{const a=(-40+60*i/20)*RAD;return [cx+(R+34)*Math.cos(a),cy-(R+34)*Math.sin(a)];});
  s+=fade(opp,draw(a2,1,{color:FC,w:7})+head(a2[20][0],a2[20][1],a2[20][0]-a2[18][0],a2[20][1]-a2[18][1],{color:FC,L:24}));}
 return fade(g,s);
}
function flowBox(x,y,w,text,color,g=1){return fade(g,rect(x,y,w,70,{fill:color,fo:.12,stroke:color,sw:2.5,rx:12})+label(text,x+w/2,y+46,{size:28,color,anchor:'middle',weight:700}));}

export const hsEMagnet4Diagrams={
 // ================= S1 前回の問い =================
 [K+'recap']:(p)=>card(200,90,800,170,T(PHIDEF,600,195,{size:72}),seg(p,0,.2),PHI)+fade(seg(p,.35,.55),label('が 変わる → 電流が 流れる',600,340,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'q']:(p)=>Qcard('誘導される 電圧の','大きさは 何で 決まる？',{g:seg(p,.05,.2),x:80,y:130,w:500,h:220,bsize:34})+Qcard('発電所は どうやって','磁束を 変え続ける？',{g:seg(p,.5,.65),x:620,y:130,w:500,h:220,bsize:34}),
 [K+'ways']:(p)=>T(PHIDEF,600,200,{size:90})+fade(seg(p,.5,.7),label('変える 方法は 磁石を 動かす だけ？',600,370,{size:32,color:C.hi,anchor:'middle',weight:700})),
 [K+'ways2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=T(PHIDEF,600,90,{size:60});
  const g1=seg(p,.02,.15),g2=seg(p,.3,.45),g3=seg(p,.6,.75);
  // B stronger
  s+=card(60,170,340,300,label('B を 強く',230,215,{size:30,color:BC,anchor:'middle',weight:700})+[0,1,2,3,4].map(i=>arrow(110,260+i*40,110+mix(40,200,(Math.sin(t*1.5)+1)/2),260+i*40,{color:BC,w:3+2*(Math.sin(t*1.5)+1)/2,head:12})).join(''),g1,C.faint);
  // A changes
  const a=mix(.4,1,(Math.sin(t*1.5)+1)/2);
  s+=card(430,170,340,300,label('A を 変える',600,215,{size:30,color:C.ink,anchor:'middle',weight:700})+rect(600-110*a,350-80*a,220*a,160*a,{fill:SURF,fo:.12,stroke:IC,sw:5,rx:4}),g2,C.faint);
  // θ changes
  const th=(t*50)%360,tx=-Math.sin(th*RAD),ty=Math.cos(th*RAD);
  s+=card(800,170,340,300,label('θ を 変える',970,215,{size:30,color:NC,anchor:'middle',weight:700})+line(970-tx*90,350+ty*90,970+tx*90,350-ty*90,{color:IC,w:7})+arrow(970,350,970+70*Math.cos(th*RAD),350-70*Math.sin(th*RAD),{color:NC,w:5,head:14}),g3,C.faint);
  return s;
 },
 [K+'open']:(p)=>{
  const q=seg(p,.15,.5);
  let s=draw(Array.from({length:61},(_,i)=>{const a=(-75+330*i/60)*RAD;return [380+150*Math.cos(a),270-150*Math.sin(a)];}),1,{color:IC,w:7});
  s+=label('切れ目',380+150*Math.cos(-90*RAD)+70,440,{size:26,color:C.dim});
  const e1=[380+150*Math.cos(-75*RAD),270+150*Math.sin(75*RAD)],e2=[380+150*Math.cos(-105*RAD),270+150*Math.sin(105*RAD)];
  for(let i=0;i<3;i++){s+=fade(q,ring(e1[0]+12+i*4,e1[1]-30-i*22,12,{color:C.a,w:2.5,fill:'#3a1d2a'})+label('＋',e1[0]+12+i*4,e1[1]-24-i*22,{size:18,color:C.a,anchor:'middle',weight:700}));
   s+=fade(q,ring(e2[0]-12-i*4,e2[1]-30-i*22,12,{color:'#7fb3ff',w:2.5,fill:'#1b2a48'})+label('−',e2[0]-12-i*4,e2[1]-24-i*22,{size:18,color:'#7fb3ff',anchor:'middle',weight:700}));}
  s+=card(680,150,460,200,label('起電力は 生じる',910,215,{size:30,color:EMF,anchor:'middle',weight:700})+label('電流は 流れ続けない',910,280,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),C.faint);
  s+=fade(seg(p,.55,.75),label('電荷が 切れ目に たまる',910,420,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S2 効くのは、変化の速さ =================
 [K+'meter']:(p)=>{
  const a=seg(p,.05,.3),b=seg(p,.5,.62);
  let s=coilRig({mx:p<.45?mix(1000,700,a):mix(1000,700,b),needle:p<.45?.4*Math.sin(Math.PI*a):Math.sin(Math.PI*b)});
  s+=fade(seg(p,.05,.15)*(1-seg(p,.4,.45)),label('ゆっくり → 小さく',900,150,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('速く → 大きく',900,150,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'same']:(p)=>{
  let s=axes2({x:90,y:420,w:430,h:300})+axes2({x:660,y:420,w:430,h:300});
  s+=draw([[90,420],[90+400,140]],seg(p,.05,.3),{color:PHI,w:5})+label('ゆっくり',300,120,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=draw([[660,420],[660+100,140],[1090,140]],seg(p,.3,.55),{color:PHI,w:5})+fade(seg(p,.3,.45),label('速く',870,120,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('変化の 量は 同じ',600,480,{size:28,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'rate']:(p)=>card(250,90,700,260,T(`\\dfrac{${dPhi}}{${dT}}`,600,230,{size:90}),seg(p,0,.2),PHI)+fade(seg(p,.4,.6),label('1秒あたりの 磁束の 変化',600,420,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'graph']:(p)=>{
  let s=axes2({x:150,y:430,w:620,h:330});
  s+=draw([[150,400],[750,160]],seg(p,.05,.35),{color:PHI,w:5});
  s+=tri(330,328,530,248,{g:seg(p,.45,.65)});
  s+=fade(seg(p,.7,.85),label('傾き ＝ ΔΦ ÷ Δt',980,250,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'like']:(p)=>{
  let s=fade(.4,axes2({x:150,y:430,w:620,h:330})+draw([[150,400],[750,160]],1,{color:PHI,w:5}));
  s+=card(760,90,400,320,'',seg(p,.05,.25),C.faint);
  s+=fade(seg(p,.1,.3),axes2({x:810,y:340,w:280,h:180,yl:'x',ycol:C.x})+draw([[810,330],[1080,190]],1,{color:C.x,w:4})+label('傾き ＝ 速さ',960,395,{size:28,color:C.v,anchor:'middle',weight:700}));
  return s;
 },
 [K+'flat']:(p)=>{
  let s=axes2({x:90,y:400,w:430,h:300})+draw([[90,140],[520,140]],seg(p,.05,.3),{color:PHI,w:5})+label('大きく 一定',300,110,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.4,.6),label('傾き 0 → 起電力 0',300,470,{size:32,color:EMF,anchor:'middle',weight:700}));
  s+=fade(.4,axes2({x:660,y:400,w:430,h:300})+draw([[660,380],[1090,300]],1,{color:PHI,w:5})+label('小さく 変化',870,250,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'slope']:(p)=>{
  let s=fade(.45,axes2({x:90,y:400,w:430,h:300})+draw([[90,140],[520,140]],1,{color:PHI,w:5})+label('傾き 0 → 起電力 0',300,470,{size:32,color:EMF,anchor:'middle',weight:700}));
  s+=axes2({x:660,y:400,w:430,h:300})+draw([[660,380],[1090,300]],1,{color:PHI,w:5})+label('小さく 変化',870,250,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=tri(760,361,960,324,{g:seg(p,.1,.3)});
  s+=fade(seg(p,.4,.6),label('傾き あり → 起電力 あり',870,470,{size:32,color:EMF,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 巻数 N =================
 [K+'turns']:(p)=>{
  let s=coilRig({meterG:0,magG:0,cx:380,cy:290,hw:150,turns:7,lab:0});
  for(let i=0;i<7;i++)s+=fade(seg(p,.1+i*.05,.2+i*.05),T(EMt,230+i*50,170,{size:30}));
  s+=fade(seg(p,.6,.8),label('巻数 N',900,250,{size:44,color:C.ink,anchor:'middle',weight:700})+label('（巻いた 回数）',900,310,{size:28,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'series']:(p)=>{
  let s='';
  for(let i=0;i<5;i++){const x=150+i*170,g=seg(p,.05+i*.08,.15+i*.08);s+=fade(g,rect(x,200,110,70,{fill:EMF,fo:.15,stroke:EMF,sw:3,rx:8})+T(EMt,x+55,246,{size:36})+(i<4?line(x+110,235,x+170,235,{color:IC,w:4}):''));}
  s+=fade(seg(p,.55,.75),label('直列に 足される → 巻数 N 倍',600,380,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>card(220,70,760,250,T(LAW,600,215,{size:80}),seg(p,0,.2),EMF)+tag('法則（実験）',600,370,{g:seg(p,.6,.75)})+fade(seg(p,.25,.45),label('N：巻数（力の 単位 N では ない）',600,450,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'avg']:(p)=>{
  let s=axes2({x:150,y:430,w:620,h:330});
  const f=u=>400-260*(u*u*(3-2*u));
  s+=draw(Array.from({length:61},(_,i)=>[150+600*i/60,f(i/60)]),seg(p,.05,.3),{color:PHI,w:5});
  s+=fade(seg(p,.35,.55),line(150,f(0),750,f(1),{color:C.ink,w:3,dash:'10 8'})+label('平均の 傾き',600,240,{size:28,color:C.ink,weight:700}));
  s+=card(820,140,330,150,label('Δt の 間の',985,200,{size:28,color:C.ink,anchor:'middle'})+label('平均の 起電力',985,255,{size:32,color:EMF,anchor:'middle',weight:700}),seg(p,.4,.6),EMF);
  s+=fade(seg(p,.7,.85),label('向き：レンツの 法則',985,360,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'notforce']:(p)=>{
  let s=card(200,80,800,170,label('起電力の 単位：V',600,145,{size:36,color:EMF,anchor:'middle',weight:700})+label('＝ 1 C あたりの エネルギー（J/C）',600,210,{size:32,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.2),EMF);
  s+=fade(seg(p,.4,.6),label('力（N） では ない',600,350,{size:36,color:C.dim,anchor:'middle',weight:700})+crossX(600,340,60));
  return s;
 },
 // ================= S4 単位と数値例 =================
 [K+'unit1']:(p)=>T(`\\mathrm{Wb/s}`,180,120,{size:52,anchor:'start'})+fade(seg(p,.3,.55),T(`=\\mathrm{T\\cdot m^2/s}`,330,120,{size:52,anchor:'start'})),
 [K+'unit2']:(p)=>{
  let s=T(`\\mathrm{Wb/s}=\\mathrm{T\\cdot m^2/s}`,180,120,{size:52,anchor:'start'});
  s+=fade(seg(p,.05,.3),T(`=\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}\\cdot\\dfrac{\\mathrm{m^2}}{\\mathrm{s}}`,180,260,{size:52,anchor:'start'}));
  s+=fade(seg(p,.55,.8),T(`=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{A\\cdot s}}`,640,260,{size:52,anchor:'start'}));
  return s;
 },
 [K+'unit3']:(p)=>{
  let s=T(`\\mathrm{Wb/s}=\\dfrac{\\mathrm{N\\cdot m}}{\\mathrm{A\\cdot s}}`,180,150,{size:54,anchor:'start'});
  s+=fade(seg(p,.05,.3),label('N·m ＝ J（仕事）',300,300,{size:30,color:C.E,anchor:'middle',weight:700}));
  s+=fade(seg(p,.25,.45),label('A·s ＝ C（電荷）',300,360,{size:30,color:C.p,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),T(`=\\dfrac{\\mathrm{J}}{\\mathrm{C}}=\\mathrm{V}`,800,150,{size:60,color:EMF}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=axes2({x:150,y:420,w:560,h:300});
  const X=t=>150+t/0.6*560,Y=f=>420-f/0.012*300;
  s+=line(145,Y(.01),155,Y(.01),{color:C.dim,w:2})+label('0.010',140,Y(.01)+8,{size:24,color:PHI,anchor:'end'});
  s+=line(X(.5),415,X(.5),425,{color:C.dim,w:2})+label('0.50',X(.5),452,{size:24,color:TC,anchor:'middle'});
  s+=label('［Wb］',128,140,{size:22,color:PHI,anchor:'end'})+label('［s］',X(.6)+50,452,{size:22,color:TC});
  s+=draw([[X(0),Y(.01)],[X(.5),Y(0)],[X(.6),Y(0)]],seg(p,.2,.6),{color:PHI,w:5});
  s+=fade(seg(p,.05,.2),label('巻数 100',960,170,{size:36,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('一定の 割合で 減る',960,250,{size:30,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=axes2({x:150,y:420,w:560,h:300});
  const X=t=>150+t/0.6*560,Y=f=>420-f/0.012*300;
  s+=label('0.010',140,Y(.01)+8,{size:24,color:PHI,anchor:'end'})+label('0.50',X(.5),452,{size:24,color:TC,anchor:'middle'});
  s+=draw([[X(0),Y(.01)],[X(.5),Y(0)],[X(.6),Y(0)]],1,{color:PHI,w:5});
  s+=fade(seg(p,.05,.25),line(X(0),Y(.01),X(.5),Y(.01),{color:TC,w:3,dash:'8 6'})+line(X(.5),Y(.01),X(.5),Y(0),{color:PHI,w:4})+label('0.010 Wb',X(.5)+12,Y(.005),{size:26,color:PHI,weight:700}));
  s+=card(800,170,370,200,T(`\\dfrac{0.010${U('Wb')}}{0.50${U('s')}}`,985,250,{size:44})+fade(seg(p,.6,.8),T(`=0.020${U('Wb/s')}`,985,335,{size:40,color:PHI})),seg(p,.3,.5),PHI);
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=T(LAW,600,130,{size:60});
  s+=fade(seg(p,.1,.35),T(`=100\\times0.020${U('Wb/s')}`,600,270,{size:52}));
  s+=fade(seg(p,.55,.75),T(`=2.0${U('V')}`,600,400,{size:64,color:EMF})+highlight(480,345,240,100,1,EMF));
  return s;
 },
 [K+'ex4']:(p)=>{
  let s=coilRig({meterG:0,magG:0,cx:300,cy:290,hw:80,lab:0});
  s+=draw([[220,200],[220,110],[600,110],[600,200]],1,{color:IC,w:3});
  // resistor on the right
  const zz=[[600,200]];for(let i=1;i<10;i++)zz.push([600+(i%2?-16:16),200+i*16]);zz.push([600,370]);s+=draw(zz,1,{color:C.hi,w:4})+draw([[600,370],[600,440],[380,440],[380,380]],1,{color:IC,w:3})+label('4.0 Ω',630,300,{size:30,color:C.hi,weight:700});
  s+=label('2.0 V',300,480,{size:30,color:EMF,anchor:'middle',weight:700});
  s+=card(760,170,400,200,T(`${It}=\\dfrac{2.0${U('V')}}{4.0${U('\\Omega')}}`,960,250,{size:44})+fade(seg(p,.5,.7),T(`=0.50${U('A')}`,960,335,{size:44,color:IC})),seg(p,.1,.3),IC);
  return s;
 },
 // ================= S5 発電機 =================
 [K+'gen']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=genCoil((t*45)%360,{g:seg(p,.3,.5)});
  s+=card(620,140,520,200,label('発電所の 答え：',880,205,{size:30,color:C.ink,anchor:'middle'})+label('磁場の 中で コイルを 回す',880,270,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.7),C.hi);
  return s;
 },
 [K+'rot']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=(t/8)%1;
  let s=genCoil(360*u)+label(`θ ＝ ${Math.round(360*u)}°`,270,500,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=genGraph({u,emf:0,mark:u});
  return s;
 },
 [K+'pose']:(p)=>{
  let s='';
  const P=[[0,'最大'],[90,'0'],[180,'負の 最大'],[270,'0']];
  P.forEach(([th,txt],i)=>{const g=seg(p,.05+i*.15,.18+i*.15),x=150+i*300;
   s+=fade(g,`<g transform="translate(${x-270*.5} ${80}) scale(.5)">${genCoil(th,{lab:0})}</g>`+label(`${th}°`,x,60,{size:30,color:C.ink,anchor:'middle',weight:700})+label(`Φ：${txt}`,x,380,{size:30,color:PHI,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.7,.85),label('180°：面を 裏から 貫く → 負',600,460,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'peak']:(p)=>{
  let s=genCoil(0)+genGraph({u:1,emf:seg(p,.3,.5),mark:0,tan:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),label('山の 頂上：傾き 0',GR.x+260,GR.yP-GR.A-24,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,.55,.75),label('起電力 0',GR.x+40,GR.yE-30,{size:30,color:EMF,weight:700}));
  return s;
 },
 [K+'cross']:(p)=>{
  let s=genCoil(90)+genGraph({u:1,mark:.25,tan:seg(p,.1,.3)});
  s+=fade(seg(p,.1,.3),label('最も 急',GR.x+GR.w*.25+30,GR.yP+30,{size:26,color:C.ink,weight:700}));
  s+=fade(seg(p,.45,.65),label('起電力 最大',GR.x+GR.w*.25+20,GR.yE-GR.A-16,{size:30,color:EMF,weight:700}));
  return s;
 },
 [K+'ac']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=(t/8)%1;
  let s=genCoil(360*u)+genGraph({u:1,halves:seg(p,.1,.35),mark:u});
  s+=fade(seg(p,.6,.8),label('向きが 入れ替わる ＝ 交流',270,500,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'turbine']:(p)=>{
  let s=flowBox(60,90,220,'水力：水',C.x,seg(p,0,.15))+flowBox(60,210,220,'火力：蒸気',C.a,seg(p,.1,.25))+flowBox(60,330,220,'原子力：蒸気',C.p,seg(p,.2,.35));
  s+=fade(seg(p,.35,.5),arrow(300,245,400,245,{color:C.dim,w:5,head:18})+flowBox(420,210,250,'羽根車を 回す',C.ink));
  s+=fade(seg(p,.55,.7),arrow(690,245,790,245,{color:C.dim,w:5,head:18})+flowBox(810,210,330,'コイル・磁石が 回る',C.hi));
  s+=fade(seg(p,.7,.85),label('最後は どれも 電磁誘導',820,400,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 エネルギーと元の問い =================
 [K+'bike']:(p,ctx)=>{const t=sceneT(p,ctx);return bike({rot:-t*90,lamp:seg(p,.1,.3)})+fade(seg(p,.4,.6),label('ペダルが 重い',900,380,{size:34,color:C.hi,anchor:'middle',weight:700})+label('なぜ？',900,440,{size:34,color:C.hi,anchor:'middle',weight:700}));},
 [K+'bike2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=bike({rot:-t*90,opp:seg(p,.45,.65)});
  s+=card(720,250,450,160,T(`${Ft}=${Bt}${It}${cs(C.ink,'l')}`,945,320,{size:44})+label('回転を 妨げる 向き',945,385,{size:28,color:FC,anchor:'middle',weight:700}),seg(p,.15,.35),FC);
  return s;
 },
 [K+'work']:(p)=>{
  let s=flowBox(80,200,230,'足の 仕事',C.E,seg(p,0,.15));
  s+=fade(seg(p,.2,.35),arrow(330,235,420,235,{color:C.E,w:6,head:20})+flowBox(440,200,300,'電気 エネルギー',C.E));
  s+=fade(seg(p,.55,.7),arrow(760,235,850,235,{color:C.E,w:6,head:20})+flowBox(870,200,260,'光・熱',C.hi));
  s+=fade(seg(p,.05,.2),label('妨げる 力に 逆らって 回す',420,130,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'motor']:(p)=>card(200,110,800,230,label('モーターを 外から 手で 回すと？',600,185,{size:32,color:C.ink,anchor:'middle',weight:700})+fade(seg(p,.5,.7),label('→ 発電機に なる',600,270,{size:42,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.2),C.hi),
 [K+'motor2']:(p)=>{
  let s=flowBox(120,120,420,'モーター：電気 → 回転',FC,seg(p,0,.2))+flowBox(660,120,420,'発電機：回転 → 電気',EMF,seg(p,.3,.5));
  s+=fade(seg(p,.6,.8),label('同じ 構造の 裏表',600,330,{size:40,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ans']:(p)=>card(220,80,760,250,T(LAW,600,225,{size:80}),seg(p,0,.2),EMF)+fade(seg(p,.4,.6),label('巻数 N と 変化の 速さで 決まる',600,420,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'ans2']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=genCoil((t*45)%360);
  s+=card(620,120,520,140,label('回し続けて 磁束を 変える',880,205,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi);
  s+=fade(seg(p,.5,.7),label('大学編では 微分で 書く',880,360,{size:30,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'arrows']:(p)=>{
  let s='';
  [['電流 → 磁場',BC],['磁場 × 電流 → 力',FC],['磁束の 変化 → 起電力',EMF]].forEach(([t,c],i)=>{s+=flowBox(250,60+i*110,700,t,c,seg(p,.05+i*.15,.2+i*.15));});
  s+=fade(seg(p,.6,.8),label('モーター と 発電機',600,450,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>card(200,130,800,200,label('電圧 ＝ 1 C あたりの エネルギー',600,245,{size:38,color:EMF,anchor:'middle',weight:700}),seg(p,0,.2),EMF),
 [K+'next2']:(p)=>{
  let s=fade(.4,label('電圧 ＝ 1 C あたりの エネルギー',600,90,{size:30,color:EMF,anchor:'middle',weight:700}));
  s+=ring(450,300,22,{color:C.a,w:3,fill:'#3a1d2a'})+label('＋',450,309,{size:24,color:C.a,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),label('押す 力は',700,270,{size:32,color:C.ink,weight:700})+label('空間に どう 広がる？',700,330,{size:36,color:C.hi,weight:700}));
  return s;
 },
 [K+'bye']:(p)=>{
  let s=rect(150,240,360,40,{fill:'#9ad0ff',fo:.25,stroke:'#9ad0ff',sw:2,rx:6})+label('下敷き',330,320,{size:26,color:C.dim,anchor:'middle'});
  for(let i=0;i<6;i++)s+=label('−',190+i*60,270,{size:26,color:'#7fb3ff',anchor:'middle',weight:700});
  for(let i=0;i<9;i++){const x=200+i*35,b=seg(p,.1,.4)*40;s+=draw([[x,120],[x+5,160],[x+4,200+b*.9]],1,{color:'#c9a46a',w:3});}
  s+=label('髪',360,100,{size:26,color:C.dim,anchor:'middle'});
  s+=card(640,150,500,200,label('次の単元',890,220,{size:28,color:C.ink,anchor:'middle'})+label('電場と クーロンの 法則',890,285,{size:36,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.65),C.hi);
  return s;
 },
};
