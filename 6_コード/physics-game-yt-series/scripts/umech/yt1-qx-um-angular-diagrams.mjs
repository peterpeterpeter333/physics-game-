// 問題編 解説「基準点から見たトルクと、まっすぐ進む玉の L」（q-um-angular、大学編 15 角運動量・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/15_角運動量.md の q-um-angular（解説 21 行）。
// 画面：左に真上から見た図（x 右・y 上・z 手前）、右に説明の枠。誤答カードは枠の下に1枚ずつ。右下に色の凡例（ずっと置く）。
// 色（単元動画と同じ）：𝐫 水色、𝐅 緑、トルク 𝐍・運動量 𝐩 桃、𝐋・v⊥ 黄、𝐯 紫、θ 橙、仕事 W 橙、垂直な距離（腕）黄、誤り 赤。
//   𝐋・v⊥ の黄と並ぶ場面の強調は、塗りのない太い枠線だけにする。
// 図のために決めた長さ：小問1 1 m＝600 px、力 1 N＝60 px。小問2 1 m＝100 px、速さ 1 m/s＝20 px。小問3 の板の回る角は 0.04 rad を大きく誇張（0.3 rad で描く）。
import {C,clamp,seg,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,esc} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,legend,kindTag,pauseBadge,note,textW,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-angular:';
// 2026-10-16：画面の文字の「x_G」などの添字を、下付きの小さな文字で描く（label と同じ属性。字幕の caption と同じ見え方）。
const subLabel=(s,x,y,{size=26,color=C.ink,anchor='start',weight=400}={})=>{const n=v=>Number((+v).toFixed(2)),d=n(size*.3),fs=Math.round(size*.68);
 const body=String(s).split(/(_[A-Za-z0-9]{1,2})/).map(t=>/^_[A-Za-z0-9]{1,2}$/.test(t)?`<tspan dy="${d}" font-size="${fs}">${esc(t.slice(1))}</tspan><tspan dy="${-d}">\u200b</tspan>`:esc(t)).join('');
 return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${body}</text>`;};
const CR=C.x,CF=C.F,CN=C.p,CL=C.hi,CV=C.v,CTH=C.E,CW=C.E,CD='#ff6b6b',CFL='#4f8f74',CVL='#7d6bb0';
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const T=(s,x,y,size=34,o={})=>tex(s,x,y,{size,auto:false,...o});
const cs=(c,s)=>`{\\color{${c}}${s}}`;
const bv=(c,n)=>cs(c,`\\mathbf{${n}}`);
const G1='O のまわりのトルク 𝐍（大きさと向き）',G2='O のまわりの角運動量 L',G3='トルクの大きさ N';
const ANS1=g=>answerTag(1,'B','0.8 N·m、⊗',{g}),ANS2=g=>answerTag(2,'D','6 kg·m²/s',{g}),ANS3=g=>answerTag(3,'A','3 N·m',{g});
const LEG=(g=1)=>legend([['トルク N',CN],['𝐋・v⊥',CL],['角 θ',CTH]],PX+14,500,{g,dir:'row'});

function row(parts,cx,y,size=30,anchor='middle'){
 const sp=parts.map(([t,c,w,o])=>`<tspan fill="${c??C.ink}" font-weight="${w??700}"${o!=null&&o<1?` fill-opacity="${Math.max(0,o).toFixed(3)}"`:''}>${esc(t)}</tspan>`).join('');
 return `<text x="${cx}" y="${y}" font-size="${size}" text-anchor="${anchor}" xml:space="preserve">${sp}</text>`;
}
function rightMark(x,y,ux,uy,vx,vy,q=16,color=C.dim,w=2.5){return line(x+ux*q,y+uy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w})+line(x+vx*q,y+vy*q,x+ux*q+vx*q,y+uy*q+vy*q,{color,w});}
function outSym(x,y,r=20,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=20,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function turnArc(cx,cy,r,a0,a1,{color=CN,w=4,g=1}={}){
 if(g<=0||Math.abs(a1-a0)<.03)return '';
 const pts=circPts(cx,cy,r,a0,a1,30),[x1,y1]=pts[29],[x2,y2]=pts[30],a=Math.atan2(y2-y1,x2-x1),L=15;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${color}"/>`;
 return fade(g,draw(pts,1,{color,w})+head);
}
const crossX=(x,y,sz=14,g=1)=>fade(g,line(x-sz,y-sz,x+sz,y+sz,{color:CD,w:5})+line(x-sz,y+sz,x+sz,y-sz,{color:CD,w:5}));
const zMark=(x,y,g=1)=>fade(g,outSym(x,y,14,C.dim)+label('z 手前',x+24,y+8,{size:24,color:C.dim}));

// ===================== 小問1：目盛り・O・P・𝐫・𝐅 =====================
const Q1={ox:110,oy:450,s:600},Q1P={ox:390,oy:445,s:600};
const XY=(o,x,y)=>[o.ox+x*o.s,o.oy-y*o.s];
function grid1(o,{g=1}={}){
 let s='';
 for(let i=0;i<=6;i++){const [x]=XY(o,i/10,0);s+=line(x,o.oy,x,o.oy-.55*o.s,{color:C.grid,w:1.5});}
 for(let j=0;j<=5;j++){const [,y]=XY(o,0,j/10);s+=line(o.ox,y,o.ox+.62*o.s,y,{color:C.grid,w:1.5});}
 s+=arrow(o.ox,o.oy,o.ox+.65*o.s,o.oy,{color:C.dim,w:2.5,head:12})+arrow(o.ox,o.oy,o.ox,o.oy-.58*o.s,{color:C.dim,w:2.5,head:12});
 s+=label('x',o.ox+.65*o.s+8,o.oy+8,{size:24,color:C.dim})+label('y',o.ox-6,o.oy-.58*o.s-10,{size:24,color:C.dim,anchor:'end'});
 for(let i=1;i<=5;i++){const [x]=XY(o,i/10,0);s+=label(`0.${i}`,x,o.oy+26,{size:22,color:C.dim,anchor:'middle'});}
 for(let j=1;j<=5;j++){const [,y]=XY(o,0,j/10);s+=label(`0.${j}`,o.ox-10,y+8,{size:22,color:C.dim,anchor:'end'});}
 s+=label('（m）',o.ox+.62*o.s,o.oy+26,{size:22,color:C.dim,anchor:'middle'});
 s+=ring(o.ox,o.oy,8,{color:C.ink,w:3,fill:C.bg})+label('O（固定）',o.ox+6,o.oy+58,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
function fig1(o,{g=1,gr=1,gF=1,growR=1,growF=1,pLab=1,FLab=1,rGlow=0,rCross=0}={}){
 const [px,py]=XY(o,.3,.4);
 let s='';
 if(rGlow>0)s+=fade(rGlow*.6,line(o.ox,o.oy,px,py,{color:CR,w:16,opacity:.45}));
 s+=fade(gr,arrow(o.ox,o.oy,px,py,{color:CR,w:6,head:18,g:growR})+fade(seg(growR,.8,1),T(bv(CR,'r'),(o.ox+px)/2-22,(o.oy+py)/2-6,34)));
 s+=fade(gr,dot(px,py,7,C.ink)+fade(pLab,label('P',px-16,py-14,{size:26,color:C.ink,anchor:'end',weight:700})));
 s+=fade(gF,arrow(px,py,px+2*60,py,{color:CF,w:6,head:18,g:growF})+fade(seg(growF,.8,1)*FLab,T(bv(CF,'F'),px+70,py-30,34)+label('(2, 0, 0) N',px+135,py+8,{size:24,color:CF,weight:700})));
 if(rCross>0){const mx=(o.ox+px)/2,my=(o.oy+py)/2;s+=crossX(mx+16,my+12,14,rCross);}
 return fade(g,s);
}
// 腕：作用線（y＝0.4 の水平線）と O からの垂線 0.4 m
function arm1(o,{g=1,gl=1,gp=1,glow=0}={}){
 const [,py]=XY(o,0,.4);
 let s=fade(gl,line(o.ox-40,py,o.ox+.75*o.s,py,{color:CF,w:2.5,dash:'10 8'})+label('作用線',o.ox+22,py-12,{size:24,color:CF,weight:700}));
 s+=fade(gp,(glow>0?fade(glow*.6,line(o.ox,o.oy,o.ox,py,{color:CL,w:18,opacity:.4})):'')+line(o.ox,o.oy,o.ox,py,{color:CL,w:7})+rightMark(o.ox,py,0,1,1,0,16)+label('0.4 m',o.ox+14,py+44,{size:26,color:CL,weight:700}));
 return fade(g,s);
}
// 成分の破線（r_x＝0.3、r_y＝0.4）
function comps1(o,{gx=1,gy=1}={}){
 const [px,py]=XY(o,.3,.4);
 return fade(gx,line(o.ox,o.oy+2,px,o.oy+2,{color:CR,w:5})+subLabel('r_x＝0.3',(o.ox+px)/2,o.oy-12,{size:24,color:CR,anchor:'middle',weight:700}))
  +fade(gy,line(px,o.oy,px,py,{color:CR,w:3,dash:'7 6'})+subLabel('r_y＝0.4',px+10,(o.oy+py)/2+40,{size:24,color:CR,weight:700}));
}

// ===================== 小問2：直線・垂線・玉 =====================
const Q2={ox:170,oy:450,s:100},Q2P={ox:450,oy:460,s:100};
const ballAt=(o,u)=>[o.ox+u*o.s,o.oy-2*o.s];
function line2(o,{g=1,perp=1,perpGlow=0}={}){
 const y=o.oy-2*o.s;
 let s=line(40,y,o.ox+5*o.s,y,{color:C.dim,w:2.5,dash:'10 8'});
 s+=fade(perp,line(o.ox,o.oy,o.ox,y,{color:C.ink,w:2.5+4*perpGlow,dash:perpGlow>0?'':'6 6'})+rightMark(o.ox,y,0,1,1,0,14)+label('2 m',o.ox-14,o.oy-1*o.s+8,{size:26,color:C.ink,anchor:'end',weight:700}));
 s+=ring(o.ox,o.oy,8,{color:C.ink,w:3,fill:C.bg})+label('O（固定）',o.ox,o.oy+38,{size:24,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
function ball2(o,u,{g=1,mlab=1}={}){
 const [bx,by]=ballAt(o,u);
 return fade(g,ring(bx,by,17,{color:CV,w:3.5,fill:'#211a3a'})+(mlab?label('0.5 kg',bx,by-28,{size:24,color:C.ink,anchor:'middle'}):''));
}
function rv2(o,u,{g=1,gr=1,gv=1,rLab='2.5 m',vLab='6 m/s',rGlow=0}={}){
 const [bx,by]=ballAt(o,u);
 let s='';
 if(rGlow>0)s+=fade(rGlow*.6,line(o.ox,o.oy,bx,by,{color:CR,w:16,opacity:.45}));
 s+=fade(gr,arrow(o.ox,o.oy,bx,by,{color:CR,w:5,head:16})+T(bv(CR,'r'),(o.ox+bx)/2+18,(o.oy+by)/2+16,32)+(rLab?label(rLab,(o.ox+bx)/2+40,(o.oy+by)/2+22,{size:24,color:CR,weight:700}):''));
 s+=fade(gv,arrow(bx+17,by,bx+6*20,by,{color:CV,w:6,head:18})+T(bv(CV,'v'),bx+6*20+20,by-4,32,{anchor:'start'})+(vLab?label(vLab,bx+70,by+34,{size:24,color:CV,weight:700,anchor:'middle'}):''));
 return fade(g,s);
}
// θ：玉の所で 𝐫 の延長（点線）と 𝐯 の間
function theta2(o,u,{g=1,glow=0,inner=0}={}){
 const [bx,by]=ballAt(o,u),a=Math.atan2(2,u);
 let s='';
 if(!inner){s+=line(bx,by,bx+90*Math.cos(a),by-90*Math.sin(a),{color:CR,w:2,dash:'5 6'})+draw(circPts(bx,by,48,0,a,24),1,{color:CTH,w:4+3*glow})+label('θ',bx+52*Math.cos(a/2)+8,by-52*Math.sin(a/2)-4,{size:28,color:CTH,weight:700});}
 else{s+=draw(circPts(bx,by,48,Math.PI,Math.PI+a,24),1,{color:CTH,w:4+3*glow})+label('θ',bx-60,by+40,{size:28,color:CTH,weight:700,anchor:'end'});}
 return fade(g,s);
}

// ===================== 小問3：板 =====================
const Q3={ox:150,oy:330},Q3P={ox:420,oy:330},PHI=.3,RR=320;
function plate3(o,phi,{g=1,ghost=1,arcG=1,workG=1,lab=1}={}){
 const deg=-phi*180/Math.PI;
 const body=rect(o.ox-30,o.oy-60,RR+80,120,{fill:'#5b6578',fo:.35,stroke:'#8a94a6',sw:2.5,rx:14});
 let s=fade(ghost*.35,`<g opacity=".6">${rect(o.ox-30,o.oy-60,RR+80,120,{fill:'none',fo:0,stroke:'#8a94a6',sw:2,rx:14}).replace('stroke-width="2"','stroke-width="2" stroke-dasharray="8 7"')}</g>`);
 s+=`<g transform="rotate(${deg.toFixed(2)} ${o.ox} ${o.oy})">${body}</g>`;
 s+=ring(o.ox,o.oy,9,{color:C.ink,w:3,fill:C.bg})+label('O',o.ox-48,o.oy+10,{size:26,color:C.ink,anchor:'end',weight:700});
 if(arcG>0&&phi>.02)s+=fade(arcG,turnArc(o.ox,o.oy,110,0,phi,{color:CTH,w:4})+(lab?label('0.04 rad',o.ox+122,o.oy-18,{size:26,color:CTH,weight:700}):''));
 if(workG>0)s+=fade(workG,rect(o.ox+170,o.oy+86,170,44,{fill:CW,fo:.12,stroke:CW,sw:2.5,rx:10})+label('仕事 0.12 J',o.ox+255,o.oy+117,{size:26,color:CW,anchor:'middle',weight:700}));
 return fade(g,s);
}
const ptAt=(o,phi,r=RR)=>[o.ox+r*Math.cos(phi),o.oy-r*Math.sin(phi)];

export const ytQxUmAngularDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1（約4秒）：目盛りと O → 0〜2 s で 𝐫 が P へ → 2〜4 s で 𝐅。右上に z 手前。静止。
 [K+'q1']:(p)=>{
  let s=grid1(Q1P,{g:seg(p,0,.15)})+zMark(960,150,seg(p,.05,.2));
  s+=fig1(Q1P,{gr:seg(p,.1,.2),growR:seg(p,.12,.5),gF:seg(p,.52,.6),growF:seg(p,.52,.85)});
  return s;
 },
 // 小問2（約5秒）：小問1の図を消す → O・直線・垂線 2 m → 玉が右へ一定の速さで約2秒 → O から 2.5 m で映像を一時停止 → 𝐫・𝐯
 [K+'q2']:(p,ctx)=>{
  const out=1-seg(p,0,.1);
  let s=fade(out,grid1(Q1P)+fig1(Q1P))+fade(out,zMark(960,150));
  const gi=seg(p,.12,.25),t=cueT(ctx); // 1.2 s〜3.2 s で −1 → 1.5 m（一定の速さ）
  const uu=Math.min(1.5,-1+2.5*clamp((t-1.2)/2,0,1));
  s+=line2(Q2P,{g:gi});
  s+=ball2(Q2P,uu,{g:seg(p,.18,.26)});
  const stop=t>=3.2?1:0,ga=clamp((t-3.3)/.5);
  s+=pauseBadge({g:stop*seg(ga,0,.4)})+rv2(Q2P,1.5,{g:ga});
  return s;
 },
 // 小問3（約4秒）：小問2の図を消す → 板が O のまわりに小さく回る（大きく誇張）→ 0.04 rad の弧と「仕事 0.12 J」。静止。
 [K+'q3']:(p)=>{
  const out=1-seg(p,0,.12);
  let s=fade(out,line2(Q2P)+ball2(Q2P,1.5)+rv2(Q2P,1.5))+fade(out,pauseBadge());
  const gi=seg(p,.15,.3),phi=PHI*seg(p,.3,.7);
  s+=plate3(Q3P,phi,{g:gi,arcG:seg(p,.65,.8),workG:seg(p,.8,.92)});
  s+=note('回る角は 大きく誇張',Q3P.ox+200,490,{g:seg(p,.65,.8)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=grid1(Q1)+fig1(Q1)+zMark(560,140)+LEG();
  s+=panel(92,200,label('小問1',PC,138,{size:26,color:C.dim,anchor:'middle'})
   +T(`${bv(CR,'r')}=(0.3,\\ 0.4,\\ 0)\\ \\mathrm{m}`,PC,192,34)+T(`${bv(CF,'F')}=(2,\\ 0,\\ 0)\\ \\mathrm{N}`,PC,248,34),seg(p,.05,.2));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 「基準点」で O を黄の輪。𝐫 を O から P へなぞり直す。札「𝐫：O → P」
 [K+'base']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,glow=Math.sin(Math.PI*clamp((p-b)/.35));
  let s=grid1(Q1)+fig1(Q1,{growR:p<b?1:seg(p,b,b+.25),rGlow:Math.max(0,glow)})+zMark(560,140)+LEG();
  s+=fade(seg(p,.05,.15),ring(Q1.ox,Q1.oy,24,{color:CL,w:5}));
  s+=panel(92,200,label('基準点 O を 先に 決める',PC,150,{size:28,color:CL,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.08),row([['𝐫',CR],['：O → P（作用点）',C.ink]],PC,222,30)),1);
  s+=goalTag(G1);
  return s;
 },
 // 3a. 定義 𝐍＝𝐫×𝐅（𝐫 が先）
 [K+'comp']:(p)=>{
  let s=grid1(Q1)+fig1(Q1)+zMark(560,140)+LEG();
  s+=panel(92,220,kindTag('定義',PC,140,{g:seg(p,.03,.12)})+fade(seg(p,.08,.2),T(`${bv(CN,'N')}=${bv(CR,'r')}\\times${bv(CF,'F')}`,PC,205,46))
   +fade(seg(p,.4,.55),label('𝐫 が 先（左）',PC,280,{size:26,color:CR,anchor:'middle',weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 // 3b. z 成分 r_x F_y − r_y F_x に 0.3, 0, 0.4, 2 を一つずつ。図の対応する成分を光らせる
 [K+'comp2']:(p)=>{
  const k=[seg(p,.42,.5),seg(p,.5,.58),seg(p,.58,.66),seg(p,.66,.74)],res=seg(p,.78,.86);
  let s=grid1(Q1)+fig1(Q1)+comps1(Q1,{gx:k[0],gy:k[2]})+zMark(560,140)+LEG();
  const [px,py]=XY(Q1,.3,.4);
  s+=fade(k[3]*(1-res*.5),ring(px+90,py,22,{color:CF,w:4}));
  const rx=cs(CR,'r_x'),ry=cs(CR,'r_y'),fx=cs(CF,'F_x'),fy=cs(CF,'F_y');
  let inner=T(`${bv(CN,'N')}=${bv(CR,'r')}\\times${bv(CF,'F')}`,PC,135,32);
  inner+=fade(seg(p,.05,.15),label('z 成分',PX+30,200,{size:24,color:C.dim})+T(`N_z=${rx}${fy}-${ry}${fx}`,PC+40,198,34));
  const v=(i,a,b)=>k[i]>.5?a:b;
  inner+=fade(k[0],T(`=${cs(CR,v(0,'0.3','r_x'))}\\times${cs(CF,v(1,'0','F_y'))}-${cs(CR,v(2,'0.4','r_y'))}\\times${cs(CF,v(3,'2','F_x'))}`,PC+20,262,34));
  inner+=fade(res,T(`=${cs(CN,'-0.8')}`,PC,325,40));
  s+=panel(92,270,inner,1);
  s+=goalTag(G1);
  return s;
 },
 // 4. x・y 成分 0、z 成分 −0.8 → ⊗、0.8 N·m。𝐫 から 𝐅 へ回す弧（時計回り）と右ねじ
 [K+'dir']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,gs=seg(p,b+.05,b+.15),ga=seg(p,b+.25,b+.4);
  let s=grid1(Q1)+fig1(Q1)+zMark(560,140)+LEG();
  s+=turnArc(Q1.ox,Q1.oy,62,Math.atan2(.4,.3),.1,{color:CN,w:3,g:ga});
  s+=inSym(Q1.ox+130,Q1.oy-34,20,CN,gs)+fade(gs,label('0.8 N·m',Q1.ox+158,Q1.oy-26,{size:26,color:CN,weight:700}));
  let inner=fade(seg(p,.05,.15),T('N_x=0,\\quad N_y=0',PC,138,32,{color:C.dim}));
  inner+=fade(seg(p,.1,.2),T(`N_z=${cs(CN,'-0.8')}`,PC,200,36));
  inner+=fade(gs,row([['負 → 奥向き ⊗、大きさ ',C.ink],['0.8 N·m',CN]],PC,262,28));
  const sx=PX+80,sy=345;
  inner+=fade(ga,turnArc(sx,sy,36,1.9,-2.6,{color:CN,w:4})+inSym(sx,sy,14,C.ink)+label('時計回りに 回すと',sx+60,sy-8,{size:24,color:C.ink,weight:700})+label('右ねじは 奥へ 進む',sx+60,sy+28,{size:24,color:CN,weight:700}));
  s+=panel(92,310,inner,1);
  s+=goalTag(G1);
  return s;
 },
 // 5. 腕で確かめる：作用線（y＝0.4）と O からの垂線 0.4 m
 [K+'arm']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35;
  let s=grid1(Q1)+arm1(Q1,{gl:seg(p,b+.05,b+.2),gp:seg(p,b+.3,b+.45)})+fig1(Q1)+zMark(560,140)+LEG();
  s+=inSym(Q1.ox+130,Q1.oy-34,20,CN,.6);
  s+=panel(92,200,label('腕の 長さで 確かめる',PC,145,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),row([['𝐅 は x 向き → 作用線は y ＝ 0.4',CF]],PC,200,26))
   +fade(seg(p,b+.3,b+.45),row([['垂直な距離 ＝ 0.4 m',CL]],PC,252,28)),1);
  s+=goalTag(G1);
  return s;
 },
 // 6. 2×0.4＝0.8 を成分の −0.8 の横に並べる。答えの札 B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=grid1(Q1)+arm1(Q1)+fig1(Q1)+zMark(560,140)+LEG()+inSym(Q1.ox+130,Q1.oy-34,20,CN,.6);
  s+=panel(92,220,label('成分で',PX+130,140,{size:24,color:C.dim,anchor:'middle'})+T(`N_z=${cs(CN,'-0.8')}`,PX+130,195,34)
   +line(PC,120,PC,290,{color:C.faint,w:2})+label('腕で',PC+125,140,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.3),row([['2',CF],[' × ',C.ink],['0.4',CL],[' ＝ ',C.ink],['0.8',CN]],PC+125,206,32))
   +fade(seg(p,.35,.45),label('一致',PC,272,{size:28,color:CL,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 7a. 誤答 A（𝐅×𝐫 の順）
 [K+'wrongA1']:(p)=>{
  let s=grid1(Q1)+arm1(Q1)+fig1(Q1)+zMark(560,140)+LEG()+inSym(Q1.ox+130,Q1.oy-34,20,CN,.6);
  s+=panel(92,150,label('小問1',PC,132,{size:24,color:C.dim,anchor:'middle'})+T(`${bv(CN,'N')}=${bv(CR,'r')}\\times${bv(CF,'F')}`,PC,195,36),1);
  s+=wrongCard('A','0.8 N·m ⊙','𝐅×𝐫 の順にした（向きが逆）',{...WOPT,y:262,g:seg(p,.02,.08)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7b. 誤答 C（|𝐫|×F）。𝐫 全体（0.5 m）に赤の×
 [K+'wrongC1']:(p)=>{
  let s=grid1(Q1)+arm1(Q1)+fig1(Q1,{rCross:seg(p,.3,.4)})+zMark(560,140)+LEG()+inSym(Q1.ox+130,Q1.oy-34,20,CN,.6);
  s+=panel(92,150,label('小問1',PC,132,{size:24,color:C.dim,anchor:'middle'})+T(`${bv(CN,'N')}=${bv(CR,'r')}\\times${bv(CF,'F')}`,PC,195,36),1);
  s+=wrongCard('C','1.0 N·m ⊗','|𝐫|×F（sinθ を落とした）',{...WOPT,y:262,g:seg(p,.02,.08),mid:'0.5\\times2=1.0'});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 8. 誤答 D（x 方向の 0.3 m）。0.3 の目盛りに赤の×、黄の垂線 0.4 を光らせる
 [K+'wrongD1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,blink=.5+.5*Math.sin(cueT(ctx)*6);
  let s=grid1(Q1)+arm1(Q1,{glow:seg(p,b,b+.06)*blink})+fig1(Q1)+zMark(560,140)+LEG()+inSym(Q1.ox+130,Q1.oy-34,20,CN,.6);
  const [x3]=XY(Q1,.3,0);s+=crossX(x3,Q1.oy,14,seg(p,.1,.2));
  s+=panel(92,150,label('小問1',PC,132,{size:24,color:C.dim,anchor:'middle'})+row([['腕 ＝ 力に 直角に 測る 0.4 m',CL]],PC,195,28),1);
  s+=wrongCard('D','0.6 N·m ⊗','x 方向の 0.3 m を腕にした',{...WOPT,y:262,g:seg(p,.02,.08)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 出題中の小問2の図（直線・垂線 2 m・玉・𝐫 2.5 m・𝐯 6 m/s）
 [K+'goal2']:(p)=>{
  let s=line2(Q2)+ball2(Q2,1.5)+rv2(Q2,1.5)+LEG();
  s+=panel(92,200,label('小問2',PC,138,{size:26,color:C.dim,anchor:'middle'})+label('力を 受けない 玉 0.5 kg、6 m/s',PC,190,{size:26,color:C.ink,anchor:'middle',weight:700})
   +label('O と 直線の 最短距離 2 m',PC,240,{size:26,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 定義 𝐋＝𝐫×𝐩、L＝mrv sinθ。玉の所で θ（𝐫 の延長と 𝐯 の間）
 [K+'defL']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=line2(Q2)+ball2(Q2,1.5,{mlab:0})+rv2(Q2,1.5)+theta2(Q2,1.5,{g:seg(p,b,b+.12)})+LEG();
  s+=panel(92,230,kindTag('定義',PC,140,{g:seg(p,.03,.12)})+fade(seg(p,.06,.18),T(`${bv(CL,'L')}=${bv(CR,'r')}\\times${bv(CN,'p')}`,PC,200,40))
   +fade(seg(p,.25,.38),T(`L=mrv\\sin${cs(CTH,'\\theta')}`,PC,265,38)),1);
  s+=goalTag(G2);
  return s;
 },
 // 11. 直角三角形（O・玉・垂線の足）を薄く塗る。斜辺 2.5、高さ 2 → sinθ＝0.8
 [K+'tri']:(p)=>{
  const [bx,by]=ballAt(Q2,1.5),glow=Math.sin(Math.PI*clamp((p-.55)/.3));
  let s=fade(seg(p,.03,.15),poly([[Q2.ox,Q2.oy],[Q2.ox,by],[bx,by]],{fill:C.ink,fo:.07,stroke:C.dim,sw:1.5}));
  s+=line2(Q2,{perpGlow:seg(p,.2,.3)})+ball2(Q2,1.5,{mlab:0})+rv2(Q2,1.5,{rGlow:seg(p,.12,.22)*(1-seg(p,.3,.4))})+theta2(Q2,1.5,{inner:1,glow:Math.max(0,glow)})+LEG();
  s+=panel(92,200,label('直角三角形',PC,140,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.35,.5),T(`\\sin${cs(CTH,'\\theta')}=\\dfrac{2}{${cs(CR,'2.5')}}=0.8`,PC,225,40)),1);
  s+=goalTag(G2);
  return s;
 },
 // 12. L＝0.5×2.5×6×0.8＝6。𝐯 を 𝐫 に沿う部分（3.6）と直角な部分 v⊥（4.8）に分ける
 [K+'calcL']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,gs=seg(p,b,b+.15);
  const [bx,by]=ballAt(Q2,1.5),ux=.6,uy=-.8,k=20,pa=3.6*k,ppx=3.84*k,ppy=2.88*k;
  let s=line2(Q2)+ball2(Q2,1.5,{mlab:0})+rv2(Q2,1.5,{gv:1-.6*gs,vLab:gs>.5?'':'6 m/s'})+LEG();
  s+=fade(gs,arrow(bx,by,bx+ux*pa,by+uy*pa,{color:CVL,w:5,head:14})+label('3.6',bx+ux*pa+8,by+uy*pa-6,{size:24,color:CVL,weight:700})
   +arrow(bx,by,bx+ppx,by+ppy,{color:CL,w:7,head:16})+label('v⊥ ＝ 4.8',bx+ppx+10,by+ppy+12,{size:26,color:CL,weight:700})
   +line(bx+ux*pa,by+uy*pa,bx+120,by,{color:C.dim,w:1.5,dash:'4 5'})+line(bx+ppx,by+ppy,bx+120,by,{color:C.dim,w:1.5,dash:'4 5'}));
  const n=[seg(p,.05,.12),seg(p,.12,.19),seg(p,.19,.26),seg(p,.26,.33)],r6=seg(p,.36,.44);
  s+=panel(92,230,T(`L=mrv\\sin${cs(CTH,'\\theta')}`,PC,140,32)
   +row([['＝ ',C.ink],['0.5',C.ink,700,n[0]],[' × ',C.ink,700,n[1]],['2.5',CR,700,n[1]],[' × ',C.ink,700,n[2]],['6',CV,700,n[2]],[' × ',C.ink,700,n[3]],['0.8',CTH,700,n[3]]],PC,205,30)
   +fade(r6,row([['＝ ',C.ink],['6',CL],[' kg·m²/s',C.ink]],PC,262,34)),1);
  s+=goalTag(G2);
  return s;
 },
 // 13a. 玉を直線に沿って動かす。𝐫 は伸び θ は小さくなるが、白い垂線 2 m は同じ。隅の「L＝6」は同じ値のまま
 [K+'same']:(p,ctx)=>{
  const t=tAt(ctx,K+'same'),u=Math.min(3.4,1.5+.32*t);
  let s=line2(Q2,{perpGlow:.6})+ball2(Q2,u,{mlab:0})+rv2(Q2,u,{rLab:'',vLab:''})+theta2(Q2,u)+LEG();
  s+=panel(92,200,row([['r sinθ ＝ 2 m',C.ink]],PC,150,32)+label('（O から 直線までの 距離）',PC,195,{size:24,color:C.dim,anchor:'middle'})
   +rect(PC-90,220,180,52,{fill:'none',fo:0,stroke:CL,sw:3,rx:10})+row([['L ＝ 6',CL]],PC,256,32),1);
  s+=goalTag(G2);
  return s;
 },
 // 13b. L＝0.5×6×2＝6 のまま
 [K+'same2']:(p,ctx)=>{
  const t=tAt(ctx,K+'same'),u=Math.min(3.4,1.5+.32*t);
  let s=line2(Q2,{perpGlow:.6})+ball2(Q2,u,{mlab:0})+rv2(Q2,u,{rLab:'',vLab:''})+theta2(Q2,u)+LEG();
  s+=panel(92,200,row([['r sinθ ＝ 2 m',C.ink]],PC,150,32)+label('（O から 直線までの 距離）',PC,195,{size:24,color:C.dim,anchor:'middle'})
   +rect(PC-90,220,180,52,{fill:'none',fo:0,stroke:CL,sw:3,rx:10})+row([['L ＝ 6',CL]],PC,256,32),1);
  s+=fade(seg(p,.05,.2),card(PX,302,PW,80,row([['L ＝ 0.5 × 6 × 2 ＝ ',C.ink],['6',CL],['（のまま）',C.dim]],PC,352,30),1,CL));
  s+=goalTag(G2);
  return s;
 },
 // 14. 答えの札 D → 誤答 A（mrv）→ 誤答 B（cosθ）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),e0=W[0][1],m=e0+(1-e0)*.5;
  let s=line2(Q2)+ball2(Q2,1.5,{mlab:0})+rv2(Q2,1.5)+theta2(Q2,1.5)+LEG();
  s+=panel(92,150,label('小問2',PC,132,{size:24,color:C.dim,anchor:'middle'})+row([['L ＝ ',C.ink],['6 kg·m²/s',CL]],PC,195,32),1);
  const gA=seg(p,e0+.01,e0+.05)*(1-seg(p,m-.04,m)),gB=seg(p,m+.01,m+.05);
  s+=wrongCard('A','7.5','mrv（sinθ を落とした）',{...WOPT,y:262,g:gA,mid:'0.5\\times2.5\\times6'});
  s+=wrongCard('B','4.5','𝐫 に沿う部分 cosθ＝0.6 を使った',{...WOPT,y:262,g:gB,mid:'0.5\\times2.5\\times6\\times0.6'});
  s+=goalTag(G2)+ANS2(seg(p,.02,.08));
  return s;
 },
 // 15. 誤答 C（直線運動なら L＝0）。L の値 6 の札を黄の枠で
 [K+'wrongC2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=line2(Q2)+ball2(Q2,1.5,{mlab:0})+rv2(Q2,1.5)+LEG();
  s+=panel(92,150,label('力 なし → トルク 0',PC,135,{size:24,color:C.dim,anchor:'middle'})+row([['L ＝ 6',CL],['（一定）',C.dim]],PC,195,32)
   +fade(seg(p,b,b+.08),rect(PC-130,160,260,52,{fill:'none',fo:0,stroke:CL,sw:4,rx:10})),1);
  s+=wrongCard('C','0',['直線運動でも、O のまわりの','L はある'],{...WOPT,y:262,g:seg(p,.02,.08)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 16. 出題中の小問3の図（板・0.04 rad・0.12 J）
 [K+'goal3']:(p)=>{
  let s=plate3(Q3,PHI)+note('回る角は 大きく誇張',Q3.ox+200,495)+LEG();
  s+=panel(92,200,label('小問3',PC,138,{size:26,color:C.dim,anchor:'middle'})+label('0.04 rad 回す 間に',PC,190,{size:26,color:CTH,anchor:'middle',weight:700})
   +label('仕事 0.12 J（トルク 一定）',PC,240,{size:26,color:CW,anchor:'middle',weight:700}),seg(p,.05,.2));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 17. 𝐫（O → 作用点）と、作用点が描く短い円弧 ds、角 dθ。ds＝r dθ、角（rad）＝弧の長さ÷半径
 [K+'arc3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ph=PHI*seg(p,.05,.3);
  const [ax,ay]=ptAt(Q3,ph);
  let s=plate3(Q3,ph,{arcG:0,workG:.4})+note('回る角は 大きく誇張',Q3.ox+200,495);
  s+=line(Q3.ox,Q3.oy,...ptAt(Q3,0),{color:CR,w:2,dash:'6 6'});
  s+=arrow(Q3.ox,Q3.oy,ax,ay,{color:CR,w:5,head:16})+T(`${cs(CR,'r')}`,(Q3.ox+ax)/2,(Q3.oy+ay)/2-22,32)+dot(ax,ay,7,C.ink);
  if(ph>.02)s+=draw(circPts(Q3.ox,Q3.oy,RR,0,ph,20),1,{color:CR,w:8})+label('ds',ptAt(Q3,ph/2,RR+16)[0]+4,ptAt(Q3,ph/2,RR+16)[1]+8,{size:28,color:CR,weight:700});
  if(ph>.02)s+=draw(circPts(Q3.ox,Q3.oy,80,0,ph,16),1,{color:CTH,w:4})+label('dθ',Q3.ox+92,Q3.oy-6,{size:28,color:CTH,weight:700});
  s+=LEG();
  s+=panel(92,250,T(`${cs(CR,'ds')}=${cs(CR,'r')}\\,${cs(CTH,'d\\theta')}`,PC,155,42)
   +fade(seg(p,b,b+.1),line(PX+40,200,PX+PW-40,200,{color:C.faint,w:2})+label('角を ラジアンで 測る',PC,242,{size:26,color:CTH,anchor:'middle',weight:700})
   +label('角（rad）＝ 弧の長さ ÷ 半径',PC,292,{size:26,color:C.ink,anchor:'middle',weight:700})),1);
  s+=goalTag(G3);
  return s;
 },
 // 18. 作用点の力を F⊥（円弧の向き、緑）と直角な部分（薄い緑）に分ける。dW＝F⊥ ds → F⊥ r dθ → N dθ → N＝dW/dθ
 [K+'work3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  const [ax,ay]=ptAt(Q3,PHI),ta=PHI+Math.PI/2,fa=PHI+2.1,L=130;
  let s=plate3(Q3,PHI,{arcG:0,workG:.4})+note('回る角は 大きく誇張',Q3.ox+200,495);
  s+=arrow(Q3.ox,Q3.oy,ax,ay,{color:CR,w:4,head:14})+dot(ax,ay,7,C.ink);
  s+=arrow(ax,ay,ax+L*Math.cos(fa),ay-L*Math.sin(fa),{color:CF,w:4,head:14,opacity:.6})+label('F',ax+L*Math.cos(fa)-24,ay-L*Math.sin(fa)+4,{size:26,color:CF,weight:700});
  const gs=seg(p,.05,.2),ft=L*Math.cos(fa-ta),fr=L*Math.sin(fa-ta);
  s+=fade(gs,arrow(ax,ay,ax+ft*Math.cos(ta),ay-ft*Math.sin(ta),{color:CF,w:7,head:16})+label('F⊥',ax+ft*Math.cos(ta)+12,ay-ft*Math.sin(ta)+6,{size:28,color:CF,weight:700})
   +arrow(ax,ay,ax+fr*Math.cos(ta-Math.PI/2),ay-fr*Math.sin(ta-Math.PI/2),{color:CFL,w:4,head:12}));
  s+=LEG();
  const st=[seg(p,.08,.16),seg(p,.2,.28),seg(p,.32,.4),seg(p,b+.05,b+.15),seg(p,b+.25,b+.35)];
  const FR=`${cs(CF,'F_\\perp')}\\,${cs(CR,'r')}`,x0=PC-70,wEq=texWidth('=',34,false)+20,wFR=texWidth(FR,34,false);
  let inner=fade(st[0],T(`dW=${cs(CF,'F_\\perp')}\\,${cs(CR,'ds')}`,PC,140,34));
  inner+=fade(st[1],T('=',x0,200,34,{anchor:'start'})+T(FR,x0+wEq,200,34,{anchor:'start'})+T(cs(CTH,'d\\theta'),x0+wEq+wFR+8,200,34,{anchor:'start'}));
  inner+=fade(st[2],rect(x0+wEq-8,174,wFR+16,50,{fill:'none',fo:0,stroke:CN,sw:3,rx:8}));
  inner+=fade(st[3],T('=',x0,258,34,{anchor:'start'})+T(`${cs(CN,'N')}\\,${cs(CTH,'d\\theta')}`,x0+wEq,258,34,{anchor:'start'})+label('（F⊥ r ＝ N）',PX+PW-16,264,{size:24,color:CN,weight:700,anchor:'end'}));
  inner+=fade(st[4],rect(PC-110,290,220,104,{fill:'none',fo:0,stroke:CL,sw:4,rx:10})+T(`${cs(CN,'N')}=\\dfrac{dW}{${cs(CTH,'d\\theta')}}`,PC,346,34));
  s+=panel(92,316,inner,1);
  s+=goalTag(G3);
  return s;
 },
 // 19. 0.12÷0.04＝3（カット：式だけの画面）。答えの札 A。単位「J/rad＝N·m（トルク）」｜「J（エネルギー）」
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,an=b*.7;
  let s=card(140,95,920,175,'',1);
  s+=fade(seg(p,.03,.12),T(`${cs(CN,'N')}=\\dfrac{dW}{${cs(CTH,'d\\theta')}}`,320,182,40));
  s+=fade(seg(p,.1,.25),T(`=\\dfrac{${cs(CW,'0.12\\ \\mathrm{J}')}}{${cs(CTH,'0.04\\ \\mathrm{rad}')}}`,560,182,40));
  s+=fade(seg(p,.25,.35),T(`=${cs(CN,'3\\ \\mathrm{N{\\cdot}m}')}`,820,182,44));
  const gu=seg(p,b,b+.1);
  s+=card(140,300,920,150,'',gu);
  s+=fade(gu,label('J/rad ＝ N·m',380,365,{size:32,color:CN,anchor:'middle',weight:700})+label('（トルク）',380,410,{size:28,color:CN,anchor:'middle',weight:700})
   +line(600,320,600,430,{color:C.dim,w:3})+label('J',820,365,{size:32,color:CW,anchor:'middle',weight:700})+label('（エネルギー）',820,410,{size:28,color:CW,anchor:'middle',weight:700}));
  s+=goalTag(G3)+ANS3(seg(p,an,an+.06));
  return s;
 },
 // 20. 誤答 B → C → D（1枚ずつ）
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e1=W[0][1],m=e1*.45;
  const gB=seg(p,.01,.05)*(1-seg(p,m-.04,m)),gC=seg(p,m+.01,m+.05)*(1-seg(p,e1-.04,e1)),gD=seg(p,e1+.01,e1+.05);
  let s=card(140,95,920,175,T(`${cs(CN,'N')}=\\dfrac{${cs(CW,'0.12\\ \\mathrm{J}')}}{${cs(CTH,'0.04\\ \\mathrm{rad}')}}=${cs(CN,'3\\ \\mathrm{N{\\cdot}m}')}`,600,182,40),1);
  const o={x:200,w:800,size:28,whySize:24,y:300};
  s+=wrongCard('B','0.12','仕事（J）をそのまま答えた',{...o,g:gB});
  s+=wrongCard('C','0.0048','0.12×0.04（掛けた）',{...o,g:gC});
  s+=wrongCard('D','約 0.33','0.04÷0.12（単位 rad/J）',{...o,g:gD});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 21. 小問1の 𝐍（0.8 N·m ⊗、腕 0.4 m）と小問2の 𝐋（6 kg·m²/s、v⊥）を並べ、𝐫 に直角な部分を黄で。横に 0.12÷0.04＝3 N·m。答えの札3枚
 [K+'sum']:(p)=>{
  const g1=seg(p,.03,.15),g2=seg(p,.15,.27),g3=seg(p,.3,.4);let s='';
  // 左：トルク
  const o1={ox:110,oy:410,s:400};
  let c1=label('トルク',300,135,{size:26,color:CN,anchor:'middle',weight:700})+T(`${bv(CN,'N')}=${bv(CR,'r')}\\times${bv(CF,'F')}`,300,180,30);
  const [px,py]=XY(o1,.3,.4);
  c1+=line(o1.ox,o1.oy,o1.ox,py,{color:CL,w:7})+label('0.4 m',o1.ox+12,py+36,{size:24,color:CL,weight:700})+line(o1.ox-10,py,px+130,py,{color:CF,w:2,dash:'8 7'});
  c1+=arrow(o1.ox,o1.oy,px,py,{color:CR,w:5,head:14})+arrow(px,py,px+110,py,{color:CF,w:5,head:14})+ring(o1.ox,o1.oy,7,{color:C.ink,w:3,fill:C.bg});
  c1+=inSym(400,330,18,CN)+label('0.8 N·m',430,338,{size:24,color:CN,weight:700});
  s+=card(40,90,520,350,c1,g1);
  // 中：角運動量
  const o2={ox:650,oy:400,s:60};
  const [bx,by]=[o2.ox+1.5*o2.s,o2.oy-2*o2.s];
  let c2=label('角運動量',860,135,{size:26,color:CL,anchor:'middle',weight:700})+T(`${bv(CL,'L')}=${bv(CR,'r')}\\times${bv(CN,'p')}`,860,180,30);
  c2+=line(600,by,1100,by,{color:C.dim,w:2,dash:'8 7'})+line(o2.ox,o2.oy,o2.ox,by,{color:C.ink,w:2.5,dash:'6 6'})+label('2 m',o2.ox-10,(o2.oy+by)/2+8,{size:24,color:C.ink,anchor:'end'});
  c2+=arrow(o2.ox,o2.oy,bx,by,{color:CR,w:5,head:14})+ring(bx,by,13,{color:CV,w:3,fill:'#211a3a'})+arrow(bx,by,bx+3.84*14,by+2.88*14,{color:CL,w:6,head:14})+label('v⊥',bx+3.84*14+8,by+2.88*14+20,{size:24,color:CL,weight:700});
  c2+=ring(o2.ox,o2.oy,7,{color:C.ink,w:3,fill:C.bg})+label('6 kg·m²/s',960,330,{size:26,color:CL,anchor:'middle',weight:700});
  s+=card(590,90,570,350,c2,g2);
  s+=fade(g3,rect(330,452,540,50,{fill:'none',fo:0,stroke:CN,sw:2.5,rx:10})+row([['小問3：',C.dim],['0.12 ÷ 0.04 ＝ 3 N·m',CN]],600,486,26));
  s+=answerRow([[1,'B','0.8 N·m、⊗'],[2,'D','6 kg·m²/s'],[3,'A','3 N·m']],{g:seg(p,.6,.7),size:22});
  return s;
 },
};
