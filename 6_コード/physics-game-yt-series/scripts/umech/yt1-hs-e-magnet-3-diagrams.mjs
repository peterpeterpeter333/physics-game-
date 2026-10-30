// 高校編「磁場と電磁誘導・深く学ぶ 3/4」(ys-hs-e-magnet-3) — 図。Stage 1200×515.
// 色：元の磁場 𝐁 橙、誘導電流がつくる磁場 橙の点線、電流 I 緑、法線 桃、磁束 Φ 黄（磁束の棒）、手の力・押し返す力 緑、仕事・エネルギー 橙。
// 真横から見た面：𝐁 は右向き。法線の角 th は右向き＝0°、反時計回りに測る（＝θ）。
// コイルの軸は左右。N 極を右から近づける → 左向きの磁束が増える → 誘導の磁場は右向き → 手前側の半周の電流は下向き、右から見て反時計回り、右端が N 極。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly} from './anim.mjs';
import {card,tag,FA,BC,IC,FC,PHI,NC,NP,SP,SURF,BAD,RAD,T,cs,vB,Bt,It,Ft,Phit,U,outSym,inSym,head,fieldRows,barMagnet,Qcard} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {meter,coilRig} from './yt1-hs-e-magnet-2-diagrams.mjs';

const K='hs-e-magnet-3:';
const At=cs(C.ink,'A'),thT=cs(C.ink,'\\theta');
const PHIDEF=`${Phit}=${Bt}${At}\\cos${thT}`;
const crossX=(x,y,r=26,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
const check=(x,y,g=1)=>fade(g,draw([[x-22,y],[x-6,y+18],[x+26,y-20]],1,{color:C.F,w:7}));
const ell=(cx,cy,rx,ry,a0,a1,n=30)=>Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*RAD;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
// ---- side view of a flat coil (a tile) in a uniform field to the right ------------------------------------
const SV={x:400,y:270,L:240};
const ROWS=[-165,-135,-105,-75,-45,-15,15,45,75,105,135,165].map(d=>270+d);
export function tile({th=0,g=1,normal=1,arc=1,cross=0,shadow=0,rows=1,lab=1,x=SV.x,y=SV.y,L=SV.L}={}){
 const t=th*RAD,tx=-Math.sin(t),ty=Math.cos(t);// along the tile (screen: up = −y)
 let s=fade(rows*.75,ROWS.map(yy=>{let q='';for(let xx=80;xx+60<=720;xx+=128)q+=arrow(xx,yy,xx+60,yy,{color:BC,w:3,head:11});return q;}).join(''));
 if(lab)s+=T(vB,735,100,{size:34,anchor:'start'});
 const x1=x-tx*L/2,y1=y+ty*L/2,x2=x+tx*L/2,y2=y-ty*L/2;
 s+=line(x1,y1,x2,y2,{color:SURF,w:9});
 if(cross){// rows that pass through the tile: |yy−y| ≤ (L/2)|cos t|
  for(const yy of ROWS){const d=yy-y;if(Math.abs(Math.cos(t))*L/2+1e-6>=Math.abs(d)&&Math.abs(Math.cos(t))>1e-3){const xx=x+d*Math.tan(t);s+=fade(cross,dot(xx,yy,7,PHI));}}}
 if(normal){const X=x+130*Math.cos(t),Y=y-130*Math.sin(t);s+=fade(normal,arrow(x,y,X,Y,{color:NC,w:6,head:18})+label('法線',X+14,Y-12,{size:26,color:NC,weight:700}));}
 if(arc&&th>2){const nn=Math.max(4,Math.round(th/5));const pts=Array.from({length:nn+1},(_,i)=>{const u=th*RAD*i/nn;return [x+52*Math.cos(u),y-52*Math.sin(u)];});s+=fade(arc,draw(pts,1,{color:C.ink,w:3})+label('θ',x+64*Math.cos(th*RAD/2)+4,y-64*Math.sin(th*RAD/2)+8,{size:28,color:C.ink}));}
 if(shadow){const c=Math.cos(t),len=130*c;s+=fade(shadow,line(x,y,x+len*Math.cos(t),y-len*Math.sin(t),{color:PHI,w:12,cap:'butt'})+line(x+130,y,x+len*Math.cos(t),y-len*Math.sin(t),{color:PHI,w:2,dash:'6 6'})+arrow(x,y,x+130,y,{color:BC,w:6,head:18}));}
 return fade(g,s);
}
const phiTxt=th=>{const v=.2*.05*Math.cos(th*RAD);return Math.abs(v)<5e-5?'0':v.toFixed(4).replace(/0$/,'0');};
// ---- face of the 25 cm × 20 cm coil -----------------------------------------------------------------------
function face({g=1,dims=1}={}){
 let s=rect(250,120,300,240,{fill:SURF,fo:.12,stroke:IC,sw:6,rx:4});
 for(let x=290;x<540;x+=60)for(let y=160;y<350;y+=60)s+=outSym(x,y,12,BC,.8);
 s+=fade(dims,line(250,395,550,395,{color:C.ink,w:2.5})+label('25 cm',400,430,{size:28,color:C.ink,anchor:'middle',weight:700})+line(585,120,585,360,{color:C.ink,w:2.5})+label('20 cm',600,250,{size:28,color:C.ink,weight:700}));
 return fade(g,s);
}
// ---- Lenz rig: coil (axis left–right) with a bar magnet on the right --------------------------------------
const LZ={cx:420,cy:300,hw:80,ry:90,turns:5};
export function lenzRig({mdir=-1,mx=760,orig=1,ind=0,indDir=1,cur=0,curDir=1,poles=0,phi=null,needle=0,g=1,meterG=1}={}){
 let s=coilRig({cx:LZ.cx,cy:LZ.cy,hw:LZ.hw,ry:LZ.ry,mx,needle,meterG,lab:1,mdir});
 const k=clamp((1000-mx)/300);// strength of the magnet's field at the coil
 if(orig>0){let q='';for(const dy of [-50,50]){const L=mix(90,260,k);q+=arrow(LZ.cx+L/2,LZ.cy+dy,LZ.cx-L/2,LZ.cy+dy,{color:BC,w:mix(3,6,k),head:16});}s+=fade(orig*mix(.4,1,k),q);}
 if(ind>0)s+=fade(ind,(indDir>0?arrow(LZ.cx-110,LZ.cy,LZ.cx+110,LZ.cy,{color:BC,w:6,head:20}):arrow(LZ.cx+110,LZ.cy,LZ.cx-110,LZ.cy,{color:BC,w:6,head:20})).replace('<line','<line stroke-dasharray="14 10"')+label('誘導の 磁場',LZ.cx-30,LZ.cy+LZ.ry+80,{size:24,color:BC,anchor:'middle',weight:700}));
 if(cur>0){let q='';const dx=2*LZ.hw/(LZ.turns-1);for(let i=0;i<LZ.turns;i++){const x=LZ.cx-LZ.hw+i*dx+22;q+=head(x,LZ.cy+(curDir>0?14:-14),0,curDir>0?1:-1,{color:IC,L:22});}s+=fade(cur,q);}
 if(poles>0){const R=indDir>0?['N',NP]:['S',SP],L=indDir>0?['S',SP]:['N',NP];s+=fade(poles,label(R[0],LZ.cx+LZ.hw+48,LZ.cy+14,{size:40,color:R[1],anchor:'middle',weight:700})+label(L[0],LZ.cx-LZ.hw-48,LZ.cy+14,{size:40,color:L[1],anchor:'middle',weight:700}));}
 if(phi!==null){const h=180*clamp(phi);s+=rect(120,440-h,50,h,{fill:PHI,fo:.6,stroke:PHI,rx:4})+line(105,440,185,440,{color:C.dim,w:2})+label('磁束',145,475,{size:24,color:PHI,anchor:'middle',weight:700})+label('（左向き）',145,503,{size:22,color:PHI,anchor:'middle'});}
 return fade(g,s);
}
// loop seen from the right: cur +1 = counter-clockwise, −1 = clockwise; ind 'out'/'in'
function rightView(cx,cy,R,{cur=1,ind='out',g=1,origG=1,indG=1}={}){
 let s=label('右から 見た図',cx,cy-R-30,{size:24,color:C.dim,anchor:'middle'});
 s+=ring(cx,cy,R,{color:IC,w:6});
 for(const d of [45,135,225,315]){const t=d*RAD,x=cx+R*Math.cos(t),y=cy-R*Math.sin(t);s+=head(x,y,-Math.sin(t)*cur,-Math.cos(t)*cur,{color:IC,L:22});}
 s+=fade(origG,inSym(cx-R*.45,cy-R*.45,10,BC)+inSym(cx+R*.45,cy+R*.45,10,BC));
 s+=fade(indG,(ind==='out'?outSym(cx,cy,22,BC):inSym(cx,cy,22,BC)).replace('stroke-width="4"','stroke-width="4" stroke-dasharray="7 5"'));
 s+=label(cur>0?'反時計回り':'時計回り',cx,cy+R+40,{size:28,color:IC,anchor:'middle',weight:700});
 return fade(g,s);
}
const RV={x:1070,y:165,R:66};

export const hsEMagnet3Diagrams={
 // ================= S1 前回の問い =================
 [K+'recap']:(p)=>card(250,140,700,200,T(`${Ft}=${Bt}${It}${cs(C.ink,'l')}`,600,260,{size:80}),seg(p,.05,.25),C.faint)+fade(seg(p,.4,.6),label('磁場の 中の 電流が 受ける 力',600,410,{size:30,color:FC,anchor:'middle',weight:700})),
 [K+'q']:(p)=>{
  const u=seg(p,.1,.6);
  let s=coilRig({mx:mix(1000,760,u),needle:.6*Math.sin(Math.PI*u)});
  s+=fade(seg(p,.55,.75),label('何が 変わると 流れる？',900,140,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'later']:(p)=>card(250,150,700,200,label('モーターを 手で 回すと？',600,230,{size:34,color:C.ink,anchor:'middle',weight:700})+label('→ 次の回（発電機）',600,295,{size:30,color:C.dim,anchor:'middle'}),seg(p,.05,.25),C.faint),
 [K+'rig']:(p)=>coilRig({mx:1000,magG:0})+fade(seg(p,.4,.6),highlight(LZ.cx-70,20,140,110,1,C.hi)+label('針：電流の 向きと 大きさ',800,90,{size:28,color:C.hi,weight:700})),
 [K+'still']:(p)=>{
  let s=coilRig({mx:mix(1000,700,seg(p,.05,.35))});
  s+=fade(seg(p,.45,.65),label('止めた 磁石 → 針は 0',900,160,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'move']:(p)=>{
  const a=seg(p,.05,.4),b=seg(p,.55,.9),mx=mix(mix(1000,720,a),1000,b);
  const nd=p<.5?.6*Math.sin(Math.PI*a):-.6*Math.sin(Math.PI*b);
  let s=coilRig({mx,needle:nd});
  s+=fade(seg(p,.1,.25)*(1-seg(p,.45,.5)),label('近づける → 振れる',900,160,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.7),label('遠ざける → 反対に 振れる',900,160,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'fast']:(p)=>{
  const a=seg(p,.05,.25),mx=mix(1000,700,a);
  let s=coilRig({mx,needle:Math.sin(Math.PI*a)*.98});
  s+=fade(seg(p,.05,.15)*(1-seg(p,.4,.45)),label('速く → 大きく 振れる',900,160,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.6),label('止める → 0',900,160,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'key']:(p)=>{
  let s=card(200,90,800,130,label('磁場が ある だけ',520,170,{size:34,color:C.ink,anchor:'middle',weight:700})+crossX(820,155,30),seg(p,0,.2),C.faint);
  s+=card(200,270,800,130,label('磁場の 「変化」',520,350,{size:38,color:C.hi,anchor:'middle',weight:700})+check(820,335),seg(p,.45,.65),C.hi);
  return s;
 },
 // ================= S2 磁束 =================
 [K+'count']:(p)=>{
  let s=tile({th:0,normal:0,arc:0,cross:seg(p,.3,.6)});
  s+=card(780,170,380,170,label('面を 貫く 磁場の 量',970,235,{size:28,color:C.ink,anchor:'middle'})+label('＝ 磁束',970,295,{size:40,color:PHI,anchor:'middle',weight:700}),seg(p,.55,.75),PHI);
  s+=fade(seg(p,.05,.2),label('真横から 見た コイルの 面',400,505,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'normal']:(p)=>{
  const th=40*seg(p,.45,.75);
  let s=tile({th,normal:seg(p,.05,.3),arc:seg(p,.6,.8),cross:.5});
  s+=fade(seg(p,.1,.3),label('法線 ＝ 面に 垂直な 矢印',960,200,{size:28,color:NC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('θ ＝ 𝐁 と 法線の 角',960,280,{size:28,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'face']:(p)=>{
  let s=tile({th:0,cross:1});
  s+=card(780,170,380,170,T(`${Phit}=${Bt}${At}`,970,275,{size:64}),seg(p,.45,.65),PHI);
  s+=fade(seg(p,.1,.3),label('真正面から 貫く',970,130,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'tilt']:(p)=>{
  const th=60*seg(p,.05,.4);
  let s=tile({th,cross:1,shadow:seg(p,.45,.7)});
  s+=fade(seg(p,.2,.4),label('貫く 数が 減る',960,160,{size:28,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),T(`${Bt}\\cos${thT}`,960,270,{size:56,color:PHI})+label('法線 方向の 成分',960,340,{size:26,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'def']:(p)=>{
  let s=card(200,70,800,190,T(PHIDEF,600,185,{size:80}),seg(p,0,.2),PHI);
  s+=tag('定義',600,300,{g:seg(p,.25,.4)});
  s+=fade(seg(p,.5,.7),T(`\\text{単位}\\ \\ \\mathrm{T\\cdot m^2}=\\mathrm{Wb}`,600,410,{size:52}));
  s+=fade(seg(p,.7,.85),label('（ウェーバ）',900,420,{size:28,color:C.dim}));
  return s;
 },
 [K+'edge']:(p)=>{
  const th=mix(60,90,seg(p,.05,.35));
  let s=tile({th,cross:1});
  s+=fade(seg(p,.4,.6),T(`\\cos 90^\\circ=0`,960,200,{size:52})+label('磁束 0',960,280,{size:36,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.7,.85),label('面に 沿って すり抜ける',960,350,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'angle']:(p)=>{
  let s=tile({th:60,cross:.5});
  // wrong angle: between the surface and B (30°) — drawn on the lower side
  const t=60*RAD,tx=-Math.sin(t),ty=Math.cos(t);
  s+=fade(seg(p,.25,.45),draw(Array.from({length:7},(_,i)=>{const u=(-90+60)*RAD*i/6;return [SV.x+90*Math.cos(u),SV.y-90*Math.sin(u)];}),1,{color:BAD,w:3})+label('面と 磁場の 角',840,330,{size:28,color:BAD,anchor:'middle',weight:700})+crossX(1020,320,20));
  s+=fade(seg(p,.55,.75),label('法線と 磁場の 角 θ',840,220,{size:30,color:C.F,anchor:'middle',weight:700})+check(1060,210));
  return s;
 },
 // ================= S3 数値で確かめる =================
 [K+'ex']:(p)=>{
  let s=face({dims:seg(p,.3,.55)})+label('真正面から 見た図',400,70,{size:22,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.05,.25),label('𝐁 0.20 T（手前向き）',880,140,{size:28,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'exA']:(p)=>{
  let s=face()+label('真正面から 見た図',400,70,{size:22,color:C.dim,anchor:'middle'})+label('𝐁 0.20 T（手前向き）',880,140,{size:28,color:BC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.3),T(`${At}=0.25${U('m')}\\times0.20${U('m')}`,930,250,{size:40}));
  s+=fade(seg(p,.5,.7),T(`=0.050${U('m^2')}`,930,330,{size:46}));
  return s;
 },
 [K+'ex1']:(p)=>{
  let s=tile({th:0,cross:1,lab:0});
  s+=label('0.20 T',735,110,{size:28,color:BC,weight:700});
  s+=card(760,180,420,200,T(`${Phit}=0.20\\times0.050`,970,250,{size:38})+fade(seg(p,.4,.6),T(`=0.010${U('Wb')}`,970,330,{size:46,color:PHI})),seg(p,.05,.25),PHI);
  return s;
 },
 [K+'ex2']:(p)=>{
  const th=60*seg(p,0,.25);
  let s=tile({th,cross:1,shadow:seg(p,.25,.45),lab:0});
  s+=label('0.20 T',735,110,{size:28,color:BC,weight:700});
  s+=card(760,180,420,230,T(`\\cos60^\\circ=\\tfrac{1}{2}`,970,240,{size:40})+fade(seg(p,.5,.7),T(`${Phit}=0.0050${U('Wb')}`,970,340,{size:44,color:PHI})),seg(p,.15,.35),PHI);
  return s;
 },
 [K+'rotate']:(p)=>{
  const th=mix(60,90,seg(p,.05,.35));
  let s=tile({th,cross:1,lab:0})+label('0.20 T',735,110,{size:28,color:BC,weight:700});
  s+=label(`θ ＝ ${Math.round(th)}°`,960,170,{size:32,color:C.ink,anchor:'middle',weight:700})+label(`Φ ＝ ${phiTxt(th)} Wb`,960,230,{size:34,color:PHI,anchor:'middle',weight:700});
  s+=fade(seg(p,.5,.7),label('B も A も 同じ',960,320,{size:28,color:C.dim,anchor:'middle',weight:700})+label('向きだけで Φ が 変わる',960,370,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S4 磁束の変化と電磁誘導 =================
 [K+'back']:(p)=>{
  const u=seg(p,.1,.6),mx=mix(1000,700,u);
  let s=lenzRig({mx,needle:.6*Math.sin(Math.PI*u),phi:clamp((1000-mx)/300)});
  s+=fade(seg(p,.55,.75),label('磁束が 増える',900,160,{size:30,color:PHI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'law']:(p)=>card(150,80,900,200,label('コイルを 貫く 磁束が 変化',600,155,{size:34,color:PHI,anchor:'middle',weight:700})+label('→ コイルに 電圧が 生じる',600,225,{size:36,color:C.v,anchor:'middle',weight:700}),seg(p,0,.2),C.hi)+fade(seg(p,.45,.6),label('電磁誘導（ファラデー）',600,350,{size:34,color:C.hi,anchor:'middle',weight:700}))+tag('法則（実験）',600,430,{g:seg(p,.6,.75)}),
 [K+'emf']:(p)=>{
  const u=seg(p,0,.6),mx=mix(950,700,u);
  let s=lenzRig({mx,needle:.6*Math.sin(Math.PI*u),orig:1,cur:seg(p,.5,.7)});
  s+=fade(seg(p,.05,.25),label('誘導起電力（電圧）',900,140,{size:30,color:C.v,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('閉じた 回路 → 電流',900,200,{size:30,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'stop']:(p)=>{
  let s=lenzRig({mx:700,phi:1});
  s+=fade(seg(p,.1,.3),label('磁束は 大きい',900,140,{size:30,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('変化 0 → 電流 0',900,200,{size:32,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'apps']:(p)=>card(200,100,800,280,label('電磁誘導の 利用',600,170,{size:34,color:C.hi,anchor:'middle',weight:700})+fade(seg(p,.1,.3),label('IC カードの 改札',600,250,{size:32,color:C.ink,anchor:'middle'}))+fade(seg(p,.4,.6),label('スマホの ワイヤレス 充電',600,320,{size:32,color:C.ink,anchor:'middle'})),seg(p,0,.15),C.faint),
 // ================= S5 レンツの法則 =================
 [K+'lenz']:(p)=>card(150,110,900,220,label('誘導電流の 向き',600,180,{size:32,color:IC,anchor:'middle',weight:700})+label('磁束の「変化」を 妨げる 向き',600,260,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi)+fade(seg(p,.5,.7),label('レンツの 法則',600,400,{size:36,color:C.ink,anchor:'middle',weight:700}))+tag('法則（実験）',600,470,{g:seg(p,.6,.75)}),
 [K+'near']:(p)=>{
  const mx=mix(950,760,seg(p,.05,.5));
  let s=lenzRig({mx,meterG:0});
  s+=fade(seg(p,.5,.7),label('N 極から 出た 磁場：左向き',900,120,{size:28,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'inc']:(p)=>{
  const mx=mix(860,700,seg(p,.0,.4));
  let s=lenzRig({mx,meterG:0,phi:clamp((1000-mx)/300),ind:seg(p,.5,.7)});
  s+=fade(seg(p,.05,.2),label('左向きの 磁束が 増える',900,120,{size:28,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('妨げる → 右向きの 磁場',900,180,{size:28,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'cur']:(p)=>{
  let s=lenzRig({mx:700,meterG:0,phi:1,ind:1,cur:seg(p,.55,.75)});
  s+=fade(seg(p,.05,.3),rightView(RV.x,RV.y,RV.R,{cur:1,ind:'out'}).replace('反時計回り',''));
  s+=fade(seg(p,.5,.7),label('反時計回り',RV.x,RV.y+RV.R+40,{size:28,color:IC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'npole']:(p)=>{
  let s=lenzRig({mx:mix(700,720,seg(p,.5,.8)),meterG:0,ind:1,cur:1,poles:seg(p,.05,.3),orig:.6});
  s+=fade(seg(p,.4,.6),FA(590,220,680,220,{w:9,head:22})+label('押し返す',635,190,{size:26,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.3),label('右端：N 極',960,120,{size:30,color:NP,anchor:'middle',weight:700}));
  return s;
 },
 [K+'work']:(p)=>{
  let s=lenzRig({mx:mix(760,700,seg(p,.1,.7)),meterG:0,ind:1,cur:1,poles:1,orig:.6});
  s+=FA(590,220,680,220,{w:9,head:22})+label('押し返す',635,190,{size:26,color:FC,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),FA(960,300,860,300,{w:11,head:26})+label('手の 力',960,260,{size:28,color:FC,anchor:'middle',weight:700}));
  s+=card(760,380,420,110,label('手の 仕事 → 電流の エネルギー',970,445,{size:28,color:C.E,anchor:'middle',weight:700}),seg(p,.55,.75),C.E);
  return s;
 },
 [K+'energy']:(p)=>{
  let s=card(150,60,900,170,label('もし 逆向き なら',600,120,{size:30,color:C.ink,anchor:'middle'})+label('磁石が 引き込まれて 勝手に 速くなる',600,185,{size:34,color:BAD,anchor:'middle',weight:700}),seg(p,0,.2),BAD);
  s+=fade(seg(p,.25,.4),label('→ エネルギーが 無から わく',600,290,{size:34,color:BAD,anchor:'middle',weight:700})+crossX(960,280,26));
  s+=card(150,350,900,120,label('レンツの 法則は エネルギー保存と 矛盾 しない',600,420,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.55,.75),C.hi);
  return s;
 },
 [K+'away']:(p)=>{
  const mx=mix(700,900,seg(p,.05,.6));
  let s=lenzRig({mx,meterG:0,phi:clamp((1000-mx)/300),ind:seg(p,.6,.8),indDir:-1});
  s+=fade(seg(p,.05,.25),label('左向きの 磁束が 減る',900,120,{size:28,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.8),label('補う → 左向きの 磁場',900,180,{size:28,color:BC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'away2']:(p)=>{
  let s=lenzRig({mx:900,meterG:0,phi:.33,ind:1,indDir:-1,cur:1,curDir:-1,poles:seg(p,.5,.7)});
  s+=fade(seg(p,.05,.3),rightView(RV.x,RV.y,RV.R,{cur:-1,ind:'in'}));
  s+=fade(seg(p,.6,.8),label('右端：S 極 → 引き止める',740,470,{size:28,color:SP,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz']:(p)=>{
  let s=lenzRig({mdir:1,mx:mix(950,760,seg(p,.05,.5)),meterG:0,orig:0});
  s+=fade(seg(p,.4,.6),label('S 極を 近づけると？',900,120,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'quiz2']:(p)=>{
  let s=lenzRig({mdir:1,mx:700,meterG:0,orig:0,ind:seg(p,.25,.45),indDir:-1,cur:seg(p,.45,.6),curDir:-1,poles:seg(p,.65,.8)});
  s+=fade(seg(p,.05,.25),arrow(LZ.cx-100,LZ.cy-50,LZ.cx+100,LZ.cy-50,{color:BC,w:5,head:16})+arrow(LZ.cx-100,LZ.cy+50,LZ.cx+100,LZ.cy+50,{color:BC,w:5,head:16}));
  s+=fade(seg(p,.05,.25),label('右向きの 磁束が 増える',900,120,{size:28,color:PHI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.6),rightView(RV.x,RV.y+150,RV.R,{cur:-1,ind:'in',origG:0}).replace('右から 見た図',''));
  s+=fade(seg(p,.65,.8),label('右側：S 極 → 押し返す',740,470,{size:28,color:SP,anchor:'middle',weight:700}));
  return s;
 },
 [K+'myth']:(p)=>{
  let s=card(80,80,500,300,label('近づける（増える）',330,140,{size:28,color:C.ink,anchor:'middle',weight:700})+arrow(420,210,240,210,{color:BC,w:6,head:18})+label('元',450,220,{size:24,color:BC})+(arrow(240,290,420,290,{color:BC,w:6,head:18}).replace('<line','<line stroke-dasharray="14 10"'))+label('誘導',450,300,{size:24,color:BC})+label('逆向き',330,360,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.faint);
  s+=card(620,80,500,300,label('遠ざける（減る）',870,140,{size:28,color:C.ink,anchor:'middle',weight:700})+arrow(960,210,780,210,{color:BC,w:6,head:18})+label('元',990,220,{size:24,color:BC})+(arrow(960,290,780,290,{color:BC,w:6,head:18}).replace('<line','<line stroke-dasharray="14 10"'))+label('誘導',990,300,{size:24,color:BC})+label('同じ 向き',870,360,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.15,.35),C.faint);
  s+=fade(seg(p,.55,.75),label('逆らうのは 磁場ではなく、その 変化',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'ans']:(p)=>card(200,90,800,170,T(PHIDEF,600,195,{size:72}),seg(p,0,.2),PHI)+fade(seg(p,.5,.7),label('が 変わるとき、電流が 流れる',600,340,{size:36,color:C.hi,anchor:'middle',weight:700})),
 [K+'ans2']:(p)=>{
  let s=lenzRig({mx:700,phi:1,meterG:1});
  s+=fade(seg(p,.05,.25),label('向き：変化を 妨げる',900,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('止まった 磁石 → 0',900,200,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next']:(p)=>Qcard('誘導される 電圧の','大きさは 何で 決まる？',{g:seg(p,.05,.25),x:250,y:130,w:700,h:230,bsize:40}),
 [K+'next2']:(p,ctx)=>{
  const t=ctx&&ctx.t!==undefined?ctx.t:p*5;
  let s=`<g transform="translate(-40 20) scale(.85)">${tile({th:(t*60)%360,cross:1,lab:0,arc:0})}</g>`;
  s+=Qcard('発電所は どうやって','磁束を 変え続ける？',{g:seg(p,.05,.25),x:700,y:140,w:470,h:220,bsize:34});
  return s;
 },
 [K+'bye']:(p)=>card(300,150,600,180,label('次回：深く学ぶ 4/4',600,230,{size:38,color:C.hi,anchor:'middle',weight:700})+label('起電力の 大きさと 発電機',600,290,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.25),C.hi),
};
