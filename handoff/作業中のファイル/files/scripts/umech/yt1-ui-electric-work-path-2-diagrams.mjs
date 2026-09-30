// YouTube シリーズ「線積分と面積分・初級 2/2」(ys-ui-electric-work-path-2) — 図。Stage 1200×515.
// 色・道・区間の数値は 1/2 と共通（yt1-ui-electric-work-path-1-diagrams.mjs の部品を使う）。
// 区間3 70°・1 m・𝐄 2 N/C 直角 → 0 J。区間4 20°・1 m・𝐄 2 N/C 逆向き → −2 J。合計 3+2+0−2＝3 J。棒グラフは区間と同じ色、負は下向き。
import {C,clamp,mix,seg,fade,move,label,line,rect,dot,ring,draw,arrow,tex,poly} from './anim.mjs';
import {EC,AL,PP,WC,NG,QC,SCOL,cs,T,card,cross,vE,Epar,dr,vdr,SEGS,VERT,curveAt,view,curveSvg,charge,overview,zoom,mini} from './yt1-ui-electric-work-path-1-diagrams.mjs';

const K='ui-electric-work-path-2:';
const rad=d=>d*Math.PI/180;
const O={ox:170,oy:470,sc:140,Esc:30};
const Z3={tx:330,ty:350},Z4={tx:430,ty:300};
function valLabels(V,list,g=1){
 // contribution labels next to the chords
 const off=[[-60,-40],[30,44],[46,10],[10,-44]];
 return list.map(([i,t,c])=>{const a=V(VERT[i]),b=V(VERT[i+1]);return fade(g,label(t,(a[0]+b[0])/2+off[i][0],(a[1]+b[1])/2+off[i][1],{size:28,color:c??WC,anchor:'middle',weight:700}));}).join('');
}
function bars(x0,y0,{shown=4,g=1,total=0,u=40}={}){
 let s=fade(g,line(x0-20,y0,x0+470,y0,{color:C.dim,w:2.5})+label('0',x0-30,y0+8,{size:22,color:C.dim,anchor:'end'}));
 SEGS.forEach((q,i)=>{const x=x0+i*95,gg=g*clamp(shown-i);if(gg<=0)return;const h=q.dW*u;
  s+=fade(gg,(Math.abs(h)>0?rect(x,h>0?y0-h:y0,64,Math.abs(h),{fill:SCOL[i],fo:.45,stroke:SCOL[i],sw:2,rx:3}):line(x,y0,x+64,y0,{color:SCOL[i],w:6}))
   +label(`${q.dW>0?'+':q.dW<0?'−':''}${Math.abs(q.dW)}`,x+32,h>=0?y0-h-12:y0-h+30,{size:26,color:q.dW<0?NG:WC,anchor:'middle',weight:700})
   +label(`区間${i+1}`,x+32,y0+160,{size:22,color:SCOL[i],anchor:'middle',weight:700}));});
 if(total>0){const x=x0+4*95+20;s+=fade(total,rect(x,y0-3*u,70,3*u,{fill:WC,fo:.5,stroke:WC,sw:2,rx:3})+label('+3',x+35,y0-3*u-12,{size:28,color:WC,anchor:'middle',weight:700})+label('合計',x+35,y0+160,{size:22,color:WC,anchor:'middle',weight:700}));}
 return s+fade(g,label('ΔW [J]',x0-20,y0-175,{size:22,color:WC}));
}
function perpMark(tx,ty,d1,d2,r=18){const a=rad(d1),b=rad(d2);const p=[tx+r*Math.cos(a),ty-r*Math.sin(a)],q=[tx+r*Math.cos(b),ty-r*Math.sin(b)],m=[p[0]+q[0]-tx,p[1]+q[1]-ty];return draw([p,m,q],1,{color:C.ink,w:2.5});}
function poly4(V,N,{color=C.hi,w=4,g=1}={}){return fade(g,draw(Array.from({length:N+1},(_,k)=>V(curveAt(4*k/N))),1,{color,w})+Array.from({length:N+1},(_,k)=>dot(...V(curveAt(4*k/N)),4,color)).join(''));}

export const ytUiElectricWorkPath2Diagrams={
 // ===== S1 前回の問い =====
 [K+'recap']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  return overview({...O,chords:1,E:.8,curveOp:.5,lab:.8})+valLabels(V,[[0,'+3 J'],[1,'+2 J']],seg(p,.2,.4))
   +fade(seg(p,.1,.25),label('前回',80,70,{size:24,color:C.dim}));
 },
 [K+'recipe']:(p)=>{
  let s=zoom(0,{tx:230,ty:420,gAlong:1,gPerp:1,labA:'3 N/C',labP:'4 N/C'});
  s+=card(640,110,520,280,T(`\\Delta W_i=q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i`,900,190,{size:48})
   +label('沿う部分 だけ × 電荷 × 長さ',900,270,{size:26,color:AL,anchor:'middle',weight:700})+label('直角な部分は 仕事に 入らない',900,330,{size:24,color:PP,anchor:'middle'}),seg(p,.1,.25));
  return s;
 },
 [K+'question']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  let s=overview({...O,chords:1,E:1,curveOp:.5,hl:2,dimOthers:0})+valLabels(V,[[0,'+3 J'],[1,'+2 J']]);
  s+=valLabels(V,[[2,'？',C.hi],[3,'？',C.hi]],seg(p,.1,.25));
  s+=card(800,110,370,210,label('今回の問い',985,165,{size:24,color:C.dim,anchor:'middle'})+label('直角な区間',985,220,{size:30,color:C.hi,anchor:'middle',weight:700})+label('逆向きの区間',985,275,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 // ===== S2 区間3 =====
 [K+'s3']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3,gDr:seg(p,.05,.25),gE:seg(p,.3,.5)});
  s+=fade(seg(p,.55,.7),perpMark(Z3.tx,Z3.ty,70,-20,22)+label('90°',Z3.tx-40,Z3.ty-10,{size:24,color:C.ink,anchor:'end',weight:700}));
  return s;
 },
 [K+'s3predict']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3})+perpMark(Z3.tx,Z3.ty,70,-20,22);
  s+=card(680,230,480,190,label('予想',920,285,{size:24,color:C.dim,anchor:'middle'})+label('直角な電場の 影は？',920,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'s3shadow']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3,gLight:seg(p,.05,.3),gAlong:seg(p,.35,.5),labA:'影 ＝ 点 → 0 N/C'})+perpMark(Z3.tx,Z3.ty,70,-20,22);
  s+=card(680,230,480,180,label('矢印が 光と 同じ向き',920,290,{size:28,color:C.hi,anchor:'middle'})+label('影は 点 → 沿う部分 0',920,355,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'s3side']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3,gAlong:1,labE:true})+perpMark(Z3.tx,Z3.ty,70,-20,22);
  s+=card(680,230,480,200,label('2 N/C 全部が 直角な部分',920,290,{size:28,color:PP,anchor:'middle',weight:700})+label('道の 横から 押すだけ',920,345,{size:26,color:C.ink,anchor:'middle'})+label('速めも 遅くもしない',920,395,{size:26,color:C.ink,anchor:'middle'}),seg(p,.1,.25),PP);
  return s;
 },
 [K+'s3calc']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3,gAlong:1})+perpMark(Z3.tx,Z3.ty,70,-20,22);
  s+=card(640,200,520,280,T(`\\Delta W_3=${cs(QC,'1\\,\\mathrm{C}')}\\times${cs(AL,'0\\,\\mathrm{N/C}')}\\times${cs(SCOL[2],'1\\,\\mathrm{m}')}`,900,270,{size:36})
   +fade(seg(p,.25,.4),T(`=${cs(WC,'0\\,\\mathrm{J}')}`,900,345,{size:46}))
   +fade(seg(p,.55,.7),label('10 m でも 100 m でも 0 J',900,430,{size:26,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'s3strong']:(p)=>{
  let s=mini(2)+zoom(2,{...Z3,gAlong:1})+perpMark(Z3.tx,Z3.ty,70,-20,22);
  s+=card(640,200,520,260,label('電場は 2 N/C もある',900,265,{size:28,color:EC,anchor:'middle',weight:700})+label('でも 仕事は 0 J',900,320,{size:30,color:WC,anchor:'middle',weight:700})
   +fade(seg(p,.45,.6),label('決めるのは 強さでなく 沿う部分',900,400,{size:28,color:AL,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'s3string']:(p)=>{
  // 内積の回：ひもで円く回す球。ひもの力は進む向きと直角。
  const cx=330,cy=280,r=150,a=rad(40+120*seg(p,.05,.9));const bx=cx+r*Math.cos(a),by=cy-r*Math.sin(a);
  let s=label('内積の回',80,70,{size:24,color:C.dim})+ring(cx,cy,r,{color:C.faint,w:2,dash:'8 8'})+dot(cx,cy,6,C.dim)+line(cx,cy,bx,by,{color:C.dim,w:3});
  s+=arrow(bx,by,bx+(cx-bx)*.45,by+(cy-by)*.45,{color:C.F,w:5,head:15})+arrow(bx,by,bx-90*Math.sin(a),by-90*Math.cos(a),{color:C.v,w:5,head:15});
  s+=dot(bx,by,14,'#ffd9a0');
  s+=card(640,140,500,220,label('ひもの力（緑）は',890,200,{size:26,color:C.F,anchor:'middle'})+label('進む向き（紫）と いつも直角',890,250,{size:26,color:C.v,anchor:'middle'})+label('→ 仕事 0',890,315,{size:32,color:WC,anchor:'middle',weight:700}),seg(p,.3,.45));
  return s;
 },
 // ===== S3 区間4 =====
 [K+'s4']:(p)=>mini(3)+zoom(3,{...Z4,gDr:seg(p,.05,.25),gE:seg(p,.3,.5)})+fade(seg(p,.55,.7),label('ちょうど 逆向き（180°）',Z4.tx-40,Z4.ty-110,{size:26,color:C.ink,anchor:'middle',weight:700})),
 [K+'s4shadow']:(p)=>{
  let s=mini(3)+zoom(3,{...Z4,gAlong:seg(p,.15,.4),labA:'−2 N/C'});
  s+=fade(seg(p,.1,.3),arrow(Z4.tx+10,Z4.ty+190,Z4.tx+160,Z4.ty+135,{color:C.ink,w:3,head:12})+label('進む向き ＝ 正',Z4.tx+170,Z4.ty+200,{size:24,color:C.ink,weight:700}));
  s+=card(700,230,460,190,label('影は 進む向きと',930,290,{size:28,color:C.ink,anchor:'middle'})+label('反対側 → 沿う部分 −2',930,355,{size:30,color:NG,anchor:'middle',weight:700}),seg(p,.45,.6),NG);
  return s;
 },
 [K+'s4calc']:(p)=>{
  let s=mini(3)+zoom(3,{...Z4,gAlong:1,labA:'−2 N/C'});
  s+=card(640,200,520,260,T(`\\Delta W_4=${cs(QC,'1')}\\times(${cs(NG,'-2')})\\times${cs(SCOL[3],'1')}`,900,280,{size:40})
   +fade(seg(p,.35,.5),T(`=${cs(NG,'-2\\,\\mathrm{J}')}`,900,380,{size:50})),seg(p,0,.12));
  return s;
 },
 [K+'s4meaning']:(p)=>{
  let s=mini(3)+zoom(3,{...Z4,gAlong:1,labA:'−2 N/C'});
  s+=card(640,200,520,260,label('電場の力が 進みを 押し戻す',900,265,{size:28,color:NG,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),label('内積の回の 摩擦と 同じ',900,330,{size:26,color:C.ink,anchor:'middle'})+label('逆向きの力 → 負の仕事',900,385,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,.05,.2),NG);
  return s;
 },
 [K+'s4wrong']:(p)=>{
  let s=mini(3)+zoom(3,{...Z4,gAlong:1,labA:'−2 N/C'});
  s+=card(640,200,520,240,T(`\\Delta W_4=2\\,\\mathrm{J}`,900,280,{size:46,color:C.ink})+fade(seg(p,.15,.3),line(790,275,1010,275,{color:NG,w:5})+cross(1050,250,14))
   +fade(seg(p,.35,.5),label('逆向きだった 情報が 消える',900,370,{size:28,color:NG,anchor:'middle',weight:700})),seg(p,0,.12),NG);
  return s;
 },
 [K+'s4quiz']:(p)=>{
  // travel segment 4 backwards
  const q=SEGS[3],ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg)),L=150,{tx,ty}=Z4;
  const sx=tx+L*ux,sy=ty+L*uy;
  let s=mini(3)+line(tx-190*ux,ty-190*uy,tx+(L+70)*ux,ty+(L+70)*uy,{color:C.faint,w:3,dash:'10 8'});
  s+=arrow(sx-36*uy,sy+36*ux,tx-36*uy,ty+36*ux,{color:SCOL[3],w:5,head:16})+label('逆に たどる',tx+75-60*uy,ty+37*uy+70,{size:24,color:SCOL[3],anchor:'middle',weight:700});
  s+=arrow(sx,sy,sx-120*ux,sy-120*uy,{color:EC,w:6,head:20})+T(vE,sx+20,sy-6,{size:32,anchor:'start'})+label('2 N/C',sx+20,sy+30,{size:24,color:EC,weight:700});
  s+=card(680,230,480,180,label('問題',920,285,{size:24,color:C.dim,anchor:'middle'})+label('逆に たどると 寄与は？',920,345,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'s4ans']:(p)=>{
  const q=SEGS[3],ux=Math.cos(rad(q.deg)),uy=-Math.sin(rad(q.deg)),L=150,{tx,ty}=Z4;
  const sx=tx+L*ux,sy=ty+L*uy;
  let s=mini(3)+line(tx-190*ux,ty-190*uy,tx+(L+70)*ux,ty+(L+70)*uy,{color:C.faint,w:3,dash:'10 8'});
  s+=arrow(sx-36*uy,sy+36*ux,tx-36*uy,ty+36*ux,{color:SCOL[3],w:5,head:16});
  s+=arrow(sx,sy,sx-120*ux,sy-120*uy,{color:EC,w:6,head:20});
  s+=fade(seg(p,.1,.3),line(sx,sy,sx-120*ux,sy-120*uy,{color:AL,w:14,cap:'butt',opacity:.55})+label('+2 N/C',sx-60*ux+30*uy,sy-60*uy-30*ux-4,{size:24,color:AL,anchor:'middle',weight:700}));
  s+=card(680,210,480,240,T(`${cs(QC,'1')}\\times(${cs(AL,'+2')})\\times${cs(SCOL[3],'1')}=${cs(WC,'+2\\,\\mathrm{J}')}`,920,290,{size:38})
   +fade(seg(p,.5,.65),label('符号は 進む向きで 決まる',920,380,{size:28,color:C.hi,anchor:'middle',weight:700})),seg(p,.15,.3));
  return s;
 },
 // ===== S4 合計 =====
 [K+'bars']:(p)=>{
  const o={ox:80,oy:440,sc:100,Esc:22};const V=view(o.ox,o.oy,o.sc);
  let s=overview({...o,chords:1,E:.5,curveOp:.4});
  const labs=[[0,'+3',WC],[1,'+2',WC],[2,'0',C.ink],[3,'−2',NG]];
  s+=labs.map(([i,t,c],k)=>{const a=V(VERT[i]),b=V(VERT[i+1]);const off=[[-40,-30],[30,40],[40,10],[10,-40]][i];return fade(seg(p,.1+k*.15,.2+k*.15),label(t,(a[0]+b[0])/2+off[0],(a[1]+b[1])/2+off[1],{size:26,color:c,anchor:'middle',weight:700}));}).join('');
  s+=bars(620,300,{shown:4*seg(p,.1,.75)});
  return s;
 },
 [K+'barsexplain']:(p)=>{
  const o={ox:80,oy:440,sc:100,Esc:22};
  let s=overview({...o,chords:1,E:.3,curveOp:.4})+bars(620,300);
  s+=fade(seg(p,.1,.3),arrow(1110,280,1110,190,{color:WC,w:3,head:12})+label('正',1130,240,{size:24,color:WC,weight:700}));
  s+=fade(seg(p,.3,.5),arrow(1110,320,1110,390,{color:NG,w:3,head:12})+label('負',1130,370,{size:24,color:NG,weight:700}));
  s+=fade(seg(p,.6,.75),label('棒の色 ＝ 区間の色',380,110,{size:26,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'sum']:(p)=>{
  let s=bars(120,320,{total:seg(p,.45,.65)});
  s+=card(720,120,440,240,T(`W=3+2+0-2`,940,200,{size:44})+fade(seg(p,.35,.5),T(`=${cs(WC,'3\\,\\mathrm{J}')}`,940,285,{size:56})),seg(p,.05,.2),WC);
  return s;
 },
 [K+'origin']:(p)=>{
  const o={ox:80,oy:440,sc:100,Esc:22};const V=view(o.ox,o.oy,o.sc);
  let s=overview({...o,chords:1,E:.6,curveOp:.4});
  const labs=[[0,'+3',WC],[1,'+2',WC],[2,'0',C.ink],[3,'−2',NG]];
  s+=labs.map(([i,t,c])=>{const a=V(VERT[i]),b=V(VERT[i+1]);const off=[[-40,-30],[30,40],[40,10],[10,-40]][i];return label(t,(a[0]+b[0])/2+off[0],(a[1]+b[1])/2+off[1],{size:26,color:c,anchor:'middle',weight:700});}).join('');
  const {ox,oy,sc}=o;const [x,y]=view(ox,oy,sc)(curveAt(4*seg(p,.05,.6)));s+=charge(x,y,{text:''});
  s+=card(640,120,520,250,label('始点 → 終点 まで 運ぶ間に',900,185,{size:28,color:C.ink,anchor:'middle'})+label('電場の仕事：差し引き 3 J',900,250,{size:32,color:WC,anchor:'middle',weight:700})
   +fade(seg(p,.6,.75),label('区間4 では 進みを 押し戻した',900,320,{size:26,color:NG,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'wrong']:(p)=>{
  let s=bars(120,320,{total:1});
  s+=card(720,70,440,380,T(`3+2+0+2=7`,940,140,{size:40,color:C.ink})+fade(seg(p,.1,.25),line(820,135,1060,135,{color:NG,w:4})+cross(1100,115,12))
   +fade(seg(p,.3,.45),T(`3+2+0=5`,940,230,{size:40,color:C.ink})+line(840,225,1040,225,{color:NG,w:4})+cross(1100,205,12))
   +fade(seg(p,.6,.75),label('区間4が 合計を 減らした',940,330,{size:26,color:NG,anchor:'middle',weight:700})+label('ことを 落としている',940,380,{size:26,color:NG,anchor:'middle',weight:700})),seg(p,0,.1),NG);
  return s;
 },
 [K+'sigma']:(p)=>{
  let s=T(`W\\approx\\sum_{i=1}^{4} q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i`,600,150,{size:72});
  s+=fade(seg(p,.3,.45),label('i ＝ 1, 2, 3, 4 の 4区間を 足す（積分の回の Σ）',600,300,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),label('≈：区間の中で 道を まっすぐ、電場を 一定と みなした 印',600,380,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'q2']:(p)=>{
  let s=T(`W\\approx\\sum_{i=1}^{4} q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i`,600,110,{size:52});
  s+=card(200,200,800,250,label('運ぶ電荷が +2 C なら',600,260,{size:30,color:QC,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),label('どの区間の力も 2倍',600,315,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.45,.6),T(`W=2\\times3=${cs(WC,'6\\,\\mathrm{J}')}`,600,400,{size:44,color:C.ink})),seg(p,0,.12));
  return s;
 },
 // ===== S5 細かく切る =====
 [K+'approx']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  let s=overview({...O,chords:1,E:0,curveOp:1});
  // gaps between chord and curve
  [[.5,0],[1.5,1],[2.5,2],[3.5,3]].forEach(([t,i],k)=>{const [x,y]=V(curveAt(t));const a=V(VERT[i]),b=V(VERT[i+1]);s+=fade(seg(p,.2+k*.08,.3+k*.08),ring(x,y,20,{color:C.hi,w:2.5}));});
  s+=card(800,110,370,210,label('4本の 矢印 ≠ 曲線',985,175,{size:28,color:C.ink,anchor:'middle',weight:700})+label('区間の中は まっすぐ',985,230,{size:24,color:C.ink,anchor:'middle'})+label('電場は 一定 とみなした',985,270,{size:24,color:C.ink,anchor:'middle'})+label('＝ 近似',985,305,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.5,.65),C.hi);
  return s;
 },
 [K+'refine']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  const g8=seg(p,.3,.45),g16=seg(p,.65,.8);
  let s=curveSvg(V,{color:C.dim,w:6,opacity:.8});
  s+=poly4(V,4,{color:SCOL[0],w:4,g:1-.8*g8});
  s+=poly4(V,8,{color:SCOL[1],w:4,g:g8*(1-.8*g16)});
  s+=poly4(V,16,{color:C.hi,w:4,g:g16});
  const n=g16>.5?16:g8>.5?8:4;
  s+=card(840,110,320,150,label('区間の数',1000,165,{size:26,color:C.ink,anchor:'middle'})+label(`${n} 区間`,1000,225,{size:40,color:n===16?C.hi:n===8?SCOL[1]:SCOL[0],anchor:'middle',weight:700}),1);
  s+=fade(seg(p,.8,.95),label('折れ線 → 曲線に 重なる',1000,320,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'better']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  let s=curveSvg(V,{color:C.dim,w:6,opacity:.6})+poly4(V,16,{color:C.hi,w:4});
  s+=card(760,110,410,250,label('区間を 増やすと',965,170,{size:28,color:C.ink,anchor:'middle'})+label('Δr が 短くなり',965,225,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.35,.5),label('「一定とみなす」近似が',965,285,{size:26,color:C.ink,anchor:'middle'})+label('よくなる',965,330,{size:30,color:C.hi,anchor:'middle',weight:700})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'smaller']:(p)=>{
  const V=view(O.ox,O.oy,O.sc);
  let s=curveSvg(V,{color:C.dim,w:6,opacity:.6})+poly4(V,16,{color:C.hi,w:4});
  s+=card(760,100,410,300,label('1区間の 寄与',965,160,{size:28,color:C.ink,anchor:'middle'})+label('小さくなる',965,210,{size:30,color:WC,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),label('区間の 数',965,265,{size:28,color:C.ink,anchor:'middle'})+label('増える',965,315,{size:30,color:C.hi,anchor:'middle',weight:700}))
   +fade(seg(p,.55,.7),label('→ 和は 0 にならず 一つの値へ',965,370,{size:24,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2));
  return s;
 },
 [K+'same']:(p)=>{
  // one tiny piece: same recipe
  const V=view(O.ox,O.oy,O.sc);
  let s=curveSvg(V,{color:C.dim,w:6,opacity:.5})+poly4(V,16,{color:C.hi,w:3,g:.6});
  const [x,y]=V(curveAt(1.25));s+=ring(x,y,26,{color:C.hi,w:3})+line(x+20,y-18,640,200,{color:C.hi,w:2,opacity:.6});
  s+=move(0,0,zoom(1,{tx:720,ty:440,gAlong:1,gPerp:1,labE:false,labDr:false,lpx:120}));
  s+=card(880,110,290,230,label('どんなに 細かくても',1025,170,{size:24,color:C.ink,anchor:'middle'})+label('分ける',1025,220,{size:26,color:C.ink,anchor:'middle'})+label('沿う部分 × q × 長さ',1025,270,{size:24,color:AL,anchor:'middle',weight:700})+label('符号のまま 足す',1025,315,{size:24,color:WC,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s;
 },
 [K+'lineint']:(p)=>{
  let s=T(`\\sum q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i\\;\\longrightarrow\\;q\\int_{C}${vE}\\cdot d\\mathbf{r}`,600,140,{size:62});
  s+=fade(seg(p,.2,.35),label('限りなく 細かくした先 ＝ 線積分（中級で 計算する）',600,260,{size:28,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),T(`${vE}\\cdot d\\mathbf{r}`,380,370,{size:44})+label('＝ 内積 ＝ 沿う部分 × 長さ',450,382,{size:30,color:AL,weight:700}));
  s+=fade(seg(p,.7,.85),label('C：その道の 名前',600,470,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'sameform']:(p)=>{
  let s=card(60,90,520,330,label('積分の回',320,140,{size:26,color:C.dim,anchor:'middle'})
   +[2,3,4].map((h,k)=>rect(130+k*110,380-h*45,100,h*45,{fill:C.x,fo:.25,stroke:C.x,sw:2,rx:2})).join('')+line(110,380,470,380,{color:C.dim,w:2}),1);
  s+=fade(1,label('速さ × 時間 を 足す',320,455,{size:26,color:C.ink,anchor:'middle',weight:700}));
  const V=view(680,380,90);
  s+=card(620,90,520,330,label('今回',880,140,{size:26,color:C.dim,anchor:'middle'})+curveSvg(V,{color:C.dim,w:4})+poly4(V,8,{color:C.hi,w:3}),seg(p,.15,.3),C.hi);
  s+=fade(seg(p,.15,.3),label('影 × 長さ を 足す',880,455,{size:26,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('違い：区間ごとに 向きを見て 影を取る',600,500,{size:26,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'summary']:(p)=>{
  let s=card(60,90,1080,330,T(`W\\approx\\sum q\\,${cs(AL,'E_{\\parallel i}')}\\,\\Delta r_i`,600,170,{size:56})
   +fade(seg(p,.3,.45),label('直角な区間 → 0',380,290,{size:32,color:PP,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.65),label('逆向きの区間 → 負',820,290,{size:32,color:NG,anchor:'middle',weight:700}))
   +fade(seg(p,.7,.85),label('符号のまま 足す',600,370,{size:30,color:WC,anchor:'middle',weight:700})),1,C.hi);
  return s;
 },
 [K+'total']:(p)=>{
  const o={ox:80,oy:440,sc:100,Esc:22};
  return overview({...o,chords:1,E:.4,curveOp:.4})+bars(620,300,{total:seg(p,.3,.5)})
   +fade(seg(p,.5,.7),label('W ＝ 3 J',850,110,{size:36,color:WC,anchor:'middle',weight:700}));
 },
 [K+'lines']:(p)=>{
  const V=view(80,420,80);
  let s=card(60,90,500,340,label('線に 沿って 足す',310,145,{size:28,color:C.ink,anchor:'middle',weight:700})+curveSvg(V,{color:C.dim,w:4})+poly4(V,8,{color:C.hi,w:3}),1);
  // a surface patch with arrows passing through
  let f=poly([[720,380],[980,380],[1060,250],[800,250]],{fill:C.p,fo:.18,stroke:C.p,sw:2});
  [[790,320],[880,320],[960,320],[840,280],[930,280]].forEach(([x,y])=>{f+=arrow(x-30,y+90,x+20,y-80,{color:EC,w:4,head:13});});
  s+=card(640,90,500,340,label('面を 通り抜ける 量',890,145,{size:28,color:C.ink,anchor:'middle',weight:700})+f,seg(p,.35,.5),C.hi);
  return s;
 },
 [K+'next']:(p)=>{
  // a closed bag (ellipse) with field arrows going in and out
  const cx=420,cy=280;
  let s=`<ellipse cx="${cx}" cy="${cy}" rx="200" ry="140" fill="${C.p}" fill-opacity=".1" stroke="${C.p}" stroke-width="3"/>`;
  [-90,-30,30,90].forEach(dy=>{const y=cy+dy;const hw=200*Math.sqrt(1-(dy/140)**2);s+=arrow(cx-hw-90,y,cx-hw+40,y,{color:EC,w:4,head:13})+arrow(cx+hw-40,y,cx+hw+90,y,{color:EC,w:4,head:13});});
  s+=label('閉じた袋',cx,cy+8,{size:28,color:C.p,anchor:'middle',weight:700});
  s+=card(760,120,400,230,label('出入りする 矢印は',960,190,{size:30,color:C.ink,anchor:'middle'})+label('どう数える？',960,255,{size:36,color:C.hi,anchor:'middle',weight:700})+label('次回：ガウスの法則',960,315,{size:24,color:C.dim,anchor:'middle'}),seg(p,.15,.3),C.hi);
  return s;
 },
};
