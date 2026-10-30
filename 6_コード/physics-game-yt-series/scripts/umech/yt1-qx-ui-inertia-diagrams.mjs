// 問題編 解説「シーソーのつり合いと、回る棒」（q-ui-inertia、大学編 17 慣性モーメント・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/17_慣性モーメント.md の q-ui-inertia（解説 17 行）。
// 画面の配置：左に図（シーソー／上から見た回る棒）、右に説明の枠。誤答カードは右の枠の下。札の帯（y＜78）には図を描かない。
// 色：距離 x・r 水色、速さ v 紫、ω・重さ×距離（トルク）桃、角 θ 橙、運動エネルギー K 橙、強調 黄。
// シーソーと上から見た棒の描き方は 慣性モーメント・初級（yt1-ui-inertia-1-diagrams.mjs）を参考に、この問題の数（1 kg・4 kg・5 m）で描き直した。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly,esc} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,pauseBadge,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-ui-inertia:';
// 2026-10-16：画面の文字の「x_G」などの添字を、下付きの小さな文字で描く（label と同じ属性。字幕の caption と同じ見え方）。
const subLabel=(s,x,y,{size=26,color=C.ink,anchor='start',weight=400}={})=>{const n=v=>Number((+v).toFixed(2)),d=n(size*.3),fs=Math.round(size*.68);
 const body=String(s).split(/(_[A-Za-z0-9]{1,2})/).map(t=>/^_[A-Za-z0-9]{1,2}$/.test(t)?`<tspan dy="${d}" font-size="${fs}">${esc(t.slice(1))}</tspan><tspan dy="${-d}">\u200b</tspan>`:esc(t)).join('');
 return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${body}</text>`;};
const CR=C.x,CV=C.v,CN=C.p,CW=C.p,CK=C.E,CTH=C.E,WOOD='#b99b73';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const XX=`{\\color{${CR}}x}`,XG=`{\\color{${CR}}x_G}`,XI=`{\\color{${CR}}x_i}`,RR=`{\\color{${CR}}r}`,WW=`{\\color{${CW}}\\omega}`,VV=`{\\color{${CV}}v}`,KK=`{\\color{${CK}}K}`,TH=`{\\color{${CTH}}\\theta}`,SS=`{\\color{${CR}}s}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='支点の 位置',G2='2.0 m の おもりの 速さ v',G3='K の 比';
const ANS1=g=>answerTag(1,'B','x＝4 m',{g}),ANS2=g=>answerTag(2,'C','8.0 m/s',{g}),ANS3=g=>answerTag(3,'A','16 倍',{g});
// 横に並べた TeX の部品（各部品の中心 x と幅を返す）
function rowT(parts,x,y,size,{gap=.12}={}){
 const ws=parts.map(q=>texWidth(q,size,false)),tot=ws.reduce((a,b)=>a+b,0)+size*gap*(parts.length-1);
 let X=x-tot/2;const pos=[];
 parts.forEach((q,i)=>{pos.push({x:X+ws[i]/2,w:ws[i]});X+=ws[i]+size*gap;});
 return {pos,w:tot,svg:(gs=parts.map(()=>1))=>parts.map((q,i)=>fade(gs[i],T(q,pos[i].x,y,size))).join('')};
}

// ---- シーソー（x の目盛り 0〜5 m、1 kg を x＝0、4 kg を x＝5 m）----------------------------------------
// s：支点の位置（m）、sup：支点の濃さ、tilt：傾き（rad、＋＝右が下がる）。drop：おもりが上から降りる（0〜1）。
const MS=[[0,1,'1 kg'],[5,4,'4 kg']];
function seesaw({s=2.5,tilt=0,sup=0,supCol=C.hi,x0=90,ppm=100,by=270,nl=1,drop=[1,1],lbl=1,glow=[0,0],g=1}={}){
 const X=u=>x0+ppm*u,sx=X(s);
 let out='';
 if(nl){
  const y=by+120;
  out+=line(X(-.3),y,X(5.3),y,{color:CR,w:2.5});
  for(let u=0;u<=5;u++)out+=line(X(u),y-8,X(u),y+8,{color:CR,w:2.5})+(lbl?label(String(u),X(u),y+34,{size:24,color:CR,anchor:'middle'}):'');
  if(lbl)out+=label('x (m)',X(-.3),y-16,{size:22,color:CR});
 }
 if(sup>0)out+=fade(sup,poly([[sx,by+6],[sx-30,by+62],[sx+30,by+62]],{fill:supCol,fo:.35,stroke:supCol,sw:2.5}));
 let b=line(X(-.3),by,X(5.3),by,{color:WOOD,w:10});
 MS.forEach(([u,m,t],i)=>{
  const side=56*Math.sqrt(m),dy=-(1-drop[i])*260,op=drop[i]>0?clamp(drop[i]*3):0;
  b+=fade(op,(glow[i]>0?fade(glow[i],rect(X(u)-side/2-8,by-5-side-8+dy,side+16,side+16,{fill:C.hi,fo:.15,stroke:C.hi,sw:3,rx:10})):'')
   +rect(X(u)-side/2,by-5-side+dy,side,side,{fill:C.ink,fo:.16,stroke:C.ink,sw:2,rx:6})+(lbl?label(t,X(u),by-5-side/2+8+dy,{size:22,color:C.ink,anchor:'middle',weight:700}):''));
 });
 out+=`<g transform="rotate(${(tilt*180/Math.PI).toFixed(2)} ${sx.toFixed(1)} ${by})">${b}</g>`;
 return fade(g,out);
}
// 支点からの距離の矢印（傾いた棒に沿って、棒の下）
function distArrows(s,tilt,{x0=90,ppm=100,by=270,g=1,txt=1}={}){
 const X=u=>x0+ppm*u,sx=X(s),R=(u,dy)=>{const d=X(u)-sx;return [sx+d*Math.cos(tilt)-dy*Math.sin(tilt),by+d*Math.sin(tilt)+dy*Math.cos(tilt)];};
 let o='';
 for(const u of [0,5]){const [ax,ay]=R(u,26),[bx,by2]=R(s,26),[cx,cy]=R((u+s)/2,26);
  o+=arrow(bx,by2,ax,ay,{color:CR,w:4,head:13})+arrow(ax,ay,bx,by2,{color:CR,w:4,head:13});
  if(txt)o+=label(`${+Math.abs(u-s).toFixed(1)} m`,cx,cy+34,{size:24,color:CR,anchor:'middle',weight:700});}
 return fade(g,o);
}
// 支点の位置からの傾き：トルクの和 Σm(x−s) に比例（右が重いと右が下がる）
const tiltOf=s=>.12*clamp((20-5*s)/7.5,-1,1);

// 回る向きの矢印（円弧＋三角の頭）。a0→a1 は反時計回り（画面の上向きが正）
function turnArc(cx,cy,r,a0,a1,{color=CW,w=4}={}){
 const pts=Array.from({length:31},(_,i)=>{const a=a0+(a1-a0)*i/30;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 const [x2,y2]=pts[30],tx=-Math.sin(a1)*Math.sign(a1-a0),ty=-Math.cos(a1)*Math.sign(a1-a0),L=16;
 const head=poly([[x2+tx*6,y2+ty*6],[x2-tx*L+ty*L*.55,y2-ty*L-tx*L*.55],[x2-tx*L-ty*L*.55,y2-ty*L+tx*L*.55]],{fill:color,fo:1});
 return draw(pts,1,{color,w})+head;
}
// ---- 上から見た回る棒（軸は左下、反時計回り）------------------------------------------------------------
const O={ox:130,oy:440,ppm:190};
function rodTop(phi,{o=O,g=1,lbl=1,board=1,ghost=null,arc=0,thLab=0,rLab=0,omega=1,varr=[0,0],vtxt=['',''],vk=14}={}){
 const P=(r,a=phi)=>[o.ox+r*o.ppm*Math.cos(a),o.oy-r*o.ppm*Math.sin(a)];
 let s='';
 if(board)s+=rect(o.ox-90,o.oy-350,560,420,{fill:'#16223a',fo:.6,stroke:C.faint,sw:2,rx:16})+label('上から 見た 図',o.ox-74,o.oy-316,{size:22,color:C.dim});
 if(ghost!==null){const [ex,ey]=P(2.1,ghost);s+=line(o.ox,o.oy,ex,ey,{color:WOOD,w:8,dash:'10 8',opacity:.4});
  for(const r of [.5,2]){const [x,y]=P(r,ghost);s+=ring(x,y,18,{color:C.dim,w:2,dash:'5 5'});}}
 if(arc>0&&ghost!==null&&Math.abs(phi-ghost)>.02){
  const pts=Array.from({length:41},(_,i)=>P(2,ghost+(phi-ghost)*i/40));
  s+=fade(arc,draw(pts,1,{color:CR,w:8}));
  const [lx,ly]=P(2.22,(phi+ghost)/2);s+=fade(arc,T(SS,lx+6,ly,34));
 }
 if(thLab>0&&ghost!==null&&Math.abs(phi-ghost)>.02){
  const pts=Array.from({length:21},(_,i)=>P(.22,ghost+(phi-ghost)*i/20));
  s+=fade(thLab,draw(pts,1,{color:CTH,w:4}));const [lx,ly]=P(.32,(phi+ghost)/2);s+=fade(thLab,T(TH,lx+12,ly+2,30));
 }
 const [ex,ey]=P(2.1);
 s+=line(o.ox,o.oy,ex,ey,{color:WOOD,w:8});
 if(rLab>0){const [mx,my]=P(1.25);s+=fade(rLab,T(RR,mx-20*Math.sin(phi)-6,my-20*Math.cos(phi)-6,34));}
 [[.5,0],[2,1]].forEach(([r,i])=>{const [x,y]=P(r);
  s+=ring(x,y,18,{color:C.ink,w:3,fill:'#2a3550'});
  if(lbl){const nx=Math.sin(phi),ny=Math.cos(phi);s+=label(`${r.toFixed(1)} m`,x+nx*44,y+ny*44+8,{size:24,color:CR,anchor:'middle',weight:700});}
  if(varr[i]>0){const L=(r*4)*vk*varr[i],ux=-Math.sin(phi),uy=-Math.cos(phi);
   s+=arrow(x+ux*18,y+uy*18,x+ux*(18+L),y+uy*(18+L),{color:CV,w:6,head:16});
   if(vtxt[i])s+=fade(varr[i],label(vtxt[i],x+ux*(18+L)-10,y+uy*(18+L)-8,{size:26,color:CV,anchor:'end',weight:700}));}
 });
 s+=ring(o.ox,o.oy,12,{color:C.ink,w:3,fill:C.bg})+label('軸',o.ox-22,o.oy+8,{size:24,color:C.dim,anchor:'end'});
 if(lbl)s+=label('なめらかな 台',o.ox-74,o.oy-280,{size:22,color:C.ink})+label('おもり 0.5 kg ずつ',o.ox-74,o.oy-248,{size:22,color:C.ink});
 if(omega){
  s+=fade(omega,turnArc(o.ox,o.oy,70,phi+.2,phi+1.0,{color:CW,w:4})
   +label('ω ＝ 4 rad/s',o.ox-70,o.oy-185,{size:26,color:CW,weight:700}));
 }
 return fade(g,s);
}
const PH0=0,PH1=.5,PH2=.62;
// K の棒（橙）。1 J＝15 px
function kBars({g=1,b1=1,b2=1,stack=0,x=760,base=470}={}){
 const u=13;let s=line(x-30,base,x+340,base,{color:C.dim,w:3});
 s+=fade(b1,rect(x,base-u,70,u,{fill:CK,fo:.55,stroke:CK})+label('1.0 J',x+35,base-u-12,{size:24,color:CK,anchor:'middle',weight:700}));
 s+=fade(b2,rect(x+120,base-16*u,70,16*u,{fill:CK,fo:.55,stroke:CK})+label('16 J',x+155,base-16*u-12,{size:24,color:CK,anchor:'middle',weight:700}));
 s+=label('0.5 m',x+35,base+28,{size:22,color:CR,anchor:'middle'})+label('2.0 m',x+155,base+28,{size:22,color:CR,anchor:'middle'});
 if(stack>0){const n=Math.floor(stack*16+1e-6);for(let i=0;i<n;i++)s+=rect(x+240,base-(i+1)*u,70,u,{fill:CK,fo:.4,stroke:'#ffd2a6',sw:1.5,rx:2});
  if(n>0)s+=label(`${n} 個`,x+275,base-n*u-12,{size:24,color:C.ink,anchor:'middle',weight:700});}
 return fade(g,s);
}

// 行3 の画面（3a：1段目と2段目、3b：3段目）
function formulaScene(p,k){
 const s0=2.5,tl=tiltOf(s0);
 let s=fade(.35,seesaw({s:s0,tilt:tl,sup:1}))+fade(k?1:seg(p,.02,.1),subLabel('x_G',340,365,{size:28,color:CR,anchor:'middle',weight:700}));
 const cn=k?1:seg(p,.3,.4);
 const gTerm=cn>.5?`{\\color{${C.a}}\\cancel{\\color{${C.F}}g}}`:`{\\color{${C.F}}g}`;
 let q=subLabel('支点を x_G として',PC,130,{size:24,color:C.dim,anchor:'middle'});
 q+=T(`\\sum_i m_i\\,${gTerm}\\,(${XI}-${XG})=0`,PC,190,36);
 q+=fade(cn,label('g は どの 項にも 共通 → 消せる',PC,245,{size:22,color:C.dim,anchor:'middle'}));
 q+=fade(k?seg(p,.05,.15):0,T(`\\sum_i m_i${XI}-${XG}\\sum_i m_i=0`,PC,305,34));
 q+=fade(k?seg(p,.35,.5):0,T(`${XG}=\\dfrac{\\sum_i m_i${XI}}{\\sum_i m_i}`,PC,410,40)+highlight(PC-150,355,300,112,1));
 s+=panel(90,420,q,k?1:seg(p,.02,.1),C.faint);
 return s+goalTag(G1);
}
// 行14 の画面（14a：1.0 J、14b：16 J）
function energyScene(p,k){
 let s=rodTop(PH2,{omega:1,varr:[1,1],vtxt:['2.0 m/s','8.0 m/s']});
 let q=fade(k?1:seg(p,.05,.15),label('0.5 m',PX+60,135,{size:22,color:CR,anchor:'middle'})+T(`\\tfrac12\\times0.5\\times2.0^2={\\color{${CK}}1.0\\ \\mathrm{J}}`,PC+40,128,30));
 q+=fade(k?seg(p,.05,.15):0,label('2.0 m',PX+60,190,{size:22,color:CR,anchor:'middle'})+T(`\\tfrac12\\times0.5\\times8.0^2={\\color{${CK}}16\\ \\mathrm{J}}`,PC+40,183,30));
 q+=kBars({b1:k?1:seg(p,.3,.45),b2:k?seg(p,.45,.65):0});
 s+=panel(86,422,q,1);
 return s+goalTag(G3);
}

export const ytQxUiInertiaDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（約4秒）：x の目盛り 0〜5 m の軽い棒。0〜2 秒で 1 kg（x＝0）と 4 kg（x＝5 m）が上から降りて付く。支点は置かず「支点？」の札だけ。
 [K+'q1']:(p)=>{
  let s=seesaw({x0:350,by:230,drop:[seg(p,.02,.3),seg(p,.2,.5)]});
  s+=fade(seg(p,.55,.75),label('支点？',600,470,{size:30,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // 小問2・3（約4秒）：上から見た台。0〜3 秒で棒が一定の速さで回る。3 秒で映像を一時停止。速さの矢印・K は描かない。
 [K+'q2']:(p,ctx)=>{
  const t=cueT(ctx),phi=.8*Math.min(t,3)/3;
  return rodTop(phi,{o:{ox:400,oy:440,ppm:190}})+pauseBadge({g:clamp((t-3)/.3),x:900,y:20});
 },

 // ===================== 小問1 =====================
 // 1. 出題の図（目盛りの棒、1 kg と 4 kg）。札「求めるもの」
 [K+'goal1']:(p)=>{
  let s=seesaw({});
  s+=panel(90,250,label('小問1',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('棒が 傾かずに つり合う',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})
   +label('支点の 位置 は？',PC,255,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=fade(seg(p,.2,.35),label('支点？',340,475,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G1,{g:seg(p,.03,.15)});
 },
 // 2. 仮の支点（x＝2.5 m）。距離の矢印と「重さ×距離」。右が重く傾く。枠：左右でそろえると水平
 [K+'torque']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,s0=2.5,tl=tiltOf(s0)*seg(p,.12,.28);
  let s=seesaw({s:s0,tilt:tl,sup:seg(p,.04,.12)});
  s+=fade(seg(p,.04,.12),label('仮の 支点',340,365,{size:22,color:C.hi,anchor:'middle'}));
  s+=distArrows(s0,tl,{g:seg(p,b,b+.1)});
  s+=fade(seg(p,b+.08,b+.18),label('重さ × 距離',190,150,{size:26,color:CN,anchor:'middle',weight:700})+label('重さ × 距離',500,110,{size:26,color:CN,anchor:'middle',weight:700}));
  // 枠：天秤（左右がそろうと水平）
  const lev=seg(p,b+.3,b+.5),bt=mix(.18,0,lev),bx=PC,byy=390;
  const bal=line(bx,byy,bx,byy+60,{color:C.dim,w:4})+`<g transform="rotate(${(bt*180/Math.PI).toFixed(2)} ${bx} ${byy})">`+line(bx-150,byy,bx+150,byy,{color:C.ink,w:5})
   +rect(bx-200,byy-46,100,40,{fill:CN,fo:.2,stroke:CN,rx:8})+label('左',bx-150,byy-17,{size:22,color:CN,anchor:'middle',weight:700})
   +rect(bx+100,byy-46,100,40,{fill:CN,fo:.2,stroke:CN,rx:8})+label('右',bx+150,byy-17,{size:22,color:CN,anchor:'middle',weight:700})+'</g>'+dot(bx,byy,7,C.dim);
  s+=panel(90,420,label('つり合いの 条件',PC,135,{size:26,color:C.dim,anchor:'middle'})
   +label('支点の まわりの トルクの 和 ＝ 0',PC,185,{size:28,color:CN,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),line(PX+40,215,PX+PW-40,215,{color:C.faint,w:2})+label('左の 重さ×距離',PC,260,{size:26,color:CN,anchor:'middle',weight:700})
    +label('＝ 右の 重さ×距離',PC,300,{size:26,color:CN,anchor:'middle',weight:700}))
   +fade(seg(p,b+.2,b+.3),bal)+fade(lev,label('そろうと 水平',PC,485,{size:24,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.1));
  return s+goalTag(G1);
 },
 // 3. 式：Σmᵢg(xᵢ−x_G)＝0（g を消す）→ Σmᵢxᵢ−x_G Σmᵢ＝0 → x_G＝Σmᵢxᵢ／Σmᵢ（カット割り：①図を薄く ②式を一段ずつ）
 [K+'formula']:(p)=>formulaScene(p,0),
 // 3b. x_G について解く（3段目を出して黄の枠）
 [K+'formula2']:(p)=>formulaScene(p,1),
 // 4. 数を入れる：おもりを一つずつ光らせ、(1×0＋4×5)÷(1＋4)＝20÷5＝4 m。支点が 4 m まで滑り、水平に。答え B
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:.7;
  const mv=seg(p,e*.72,e*.95),s0=mix(2.5,4,mv),tl=tiltOf(s0);
  let s=seesaw({s:s0,tilt:tl,sup:1,glow:[seg(p,.06,.12)*(1-seg(p,.3,.36)),seg(p,.18,.24)*(1-seg(p,.42,.48))]});
  s+=fade(mv,subLabel(`x_G ＝ ${s0.toFixed(1)} m`,90+100*s0,365,{size:24,color:CR,anchor:'middle',weight:700}));
  const R=rowT([`${XG}=`,`\\dfrac{1\\times0+4\\times5}{1+4}`],PC,205,38);
  let q=R.svg([1,seg(p,.04,.12)]);
  q+=fade(seg(p,.32,.4),T(`=\\dfrac{20}{5}`,PC,300,38));
  q+=fade(seg(p,.46,.54),T(`={\\color{${CR}}4\\ \\mathrm{m}}`,PC,395,44)+highlight(PC-90,350,180,80,1));
  s+=panel(90,420,label('数を 入れる',PC,122,{size:24,color:C.dim,anchor:'middle'})+q,1);
  return s+goalTag(G1)+ANS1(seg(p,b,b+.06));
 },
 // 5. 確かめ：距離 4 m・1 m（水色）、積 4・4（桃）。支点は重い側に寄る
 [K+'check1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=seesaw({s:4,sup:1});
  s+=fade(seg(p,.03,.12),line(92,390,484,390,{color:CR,w:8})+label('4 m',290,468,{size:28,color:CR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.15,.24),line(496,390,588,390,{color:CR,w:8})+label('1 m',542,468,{size:28,color:CR,anchor:'middle',weight:700}));
  let q=label('確かめ（質量 × 距離）',PC,130,{size:24,color:C.dim,anchor:'middle'});
  q+=fade(seg(p,.05,.14),label('左',PX+60,200,{size:26,color:C.ink,weight:700})+T(`1\\times{\\color{${CR}}4}={\\color{${CN}}4}`,PC+20,190,38));
  q+=fade(seg(p,.18,.27),label('右',PX+60,275,{size:26,color:C.ink,weight:700})+T(`4\\times{\\color{${CR}}1}={\\color{${CN}}4}`,PC+20,265,38));
  q+=fade(seg(p,.28,.36),label('同じ → 水平', PC,335,{size:28,color:C.hi,anchor:'middle',weight:700}));
  q+=fade(seg(p,b,b+.08),line(PX+40,370,PX+PW-40,370,{color:C.faint,w:2})+label('支点は 重い 4 kg の 側に 寄る',PC,425,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=panel(90,380,q,1);
  s+=fade(seg(p,b,b+.08),arrow(340,500,480,500,{color:C.hi,w:5,head:16})+label('重い 側へ',330,508,{size:24,color:C.hi,anchor:'end',weight:700}));
  return s+goalTag(G1)+ANS1(1);
 },
 // 6. 誤答 A → C → D を一枚ずつ（右の枠の下）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wA=[0,e*.5],wC=[e*.5,e],wD=[W[1]?W[1][0]:e,1];
  let s=seesaw({s:4,sup:1});
  s+=panel(90,160,label('小問1 の 式',PC,118,{size:22,color:C.dim,anchor:'middle'})+T(`${XG}=\\dfrac{\\sum m_i${XI}}{\\sum m_i}={\\color{${CR}}4\\ \\mathrm{m}}`,PC,198,34),1);
  s+=wrongSeq(p,ctx,[['A','x＝2.5 m','重さを 考えず 真ん中'],['C','x＝1 m','重みを 逆（軽い 側に 寄せた）'],['D','x＝10 m','20÷2（個数で 割った、単位 kg·m）']],{win:[wA,wC,wD],opts:{...WOPT,y:262}});
  return s+goalTag(G1)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 上から見た回る棒（ω＝4 rad/s）。札「求めるもの」
 [K+'goal2']:(p)=>{
  let s=rodTop(PH0+.05*seg(p,0,.6));
  s+=panel(90,250,label('小問2',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('軸から 2.0 m の',PC,205,{size:30,color:C.hi,anchor:'middle',weight:700})+label('おもりの 速さ は？',PC,255,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s+goalTag(G2,{g:seg(p,.03,.15)});
 },
 // 8. 棒が θ 回る：元の位置（点線）、θ の弧（橙）、2.0 m の点の円弧 s（水色）。s＝rθ。ラジアン
 [K+'arc']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,ph=mix(.05,.05+PH1,seg(p,.04,.3));
  let s=rodTop(ph,{lbl:0,ghost:.05,arc:seg(p,.04,.3),thLab:seg(p,.1,.3),rLab:seg(p,.25,.35),omega:0});
  s+=panel(90,420,label('円弧の 長さ',PC,135,{size:26,color:C.dim,anchor:'middle'})+T(`${SS}=${RR}\\,${TH}`,PC,205,54)
   +fade(seg(p,b,b+.1),line(PX+40,265,PX+PW-40,265,{color:C.faint,w:2})+label('θ を ラジアン で 測る',PC,320,{size:28,color:CTH,anchor:'middle',weight:700})
    +label('角（rad）＝ 弧の長さ ÷ 半径',PC,380,{size:26,color:C.ink,anchor:'middle'}))
   +fade(seg(p,b+.22,b+.32),label('→ 半径 × 角度 ＝ 弧の長さ',PC,450,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,.02,.12),CR);
  return s+goalTag(G2);
 },
 // 9. 時間で1回微分：ds/dt＝r dθ/dt（r は一定）→ dθ/dt＝ω → v＝rω
 [K+'diff']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=rodTop(.05+PH1,{lbl:0,ghost:.05,arc:1,thLab:1,rLab:1,omega:0});
  const R=rowT([`\\dfrac{d${SS}}{dt}=${RR}\\,`,`\\dfrac{d${TH}}{dt}`],PC,245,40,{gap:.02});
  let q=T(`${SS}=${RR}\\,${TH}`,PC,125,40);
  q+=fade(seg(p,.08,.16),arrow(PC,150,PC,185,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',PC+20,176,{size:24,color:C.dim}));
  q+=fade(seg(p,.18,.28),R.svg());
  q+=fade(seg(p,.3,.4),label('r は 一定 なので 前に 出たまま',PC,328,{size:24,color:CR,anchor:'middle'}));
  q+=fade(seg(p,b,b+.08),highlight(R.pos[1].x-R.pos[1].w/2-8,198,R.pos[1].w+16,96,1,CW)+label('dθ/dt ＝ ω（角速度）',PC,376,{size:26,color:CW,anchor:'middle',weight:700}));
  q+=fade(seg(p,b+.18,b+.28),T(`${VV}=${RR}${WW}`,PC,450,48)+highlight(PC-90,408,180,82,1));
  s+=panel(86,425,q,1);
  return s+goalTag(G2);
 },
 // 10. 棒を回し、2.0 m のおもりに速さの矢印 8.0 m/s。v＝2.0×4＝8.0 m/s。答え C
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,ph=mix(.05+PH1,PH2,seg(p,.02,.15));
  let s=rodTop(ph,{omega:1,varr:[0,seg(p,.2,.4)],vtxt:['','8.0 m/s']});
  let q=label('2.0 m の 点',PC,135,{size:24,color:C.dim,anchor:'middle'})+T(`${VV}=${RR}${WW}`,PC,200,44);
  q+=fade(seg(p,.15,.25),T(`=2.0\\times4`,PC,285,40));
  q+=fade(seg(p,.3,.4),T(`={\\color{${CV}}8.0\\ \\mathrm{m/s}}`,PC,375,44)+highlight(PC-130,332,260,80,1));
  s+=panel(90,350,q,1);
  return s+goalTag(G2)+ANS2(seg(p,b,b+.06));
 },
 // 11. 誤答 A → B → D
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wA=[0,e*.5],wB=[e*.5,e],wD=[W[1]?W[1][0]:e,1];
  let s=rodTop(PH2,{omega:1,varr:[0,1],vtxt:['','8.0 m/s']});
  s+=panel(90,150,label('小問2 の 式',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`${VV}=${RR}${WW}=2.0\\times4={\\color{${CV}}8.0\\ \\mathrm{m/s}}`,PC,185,32),1);
  s+=wrongSeq(p,ctx,[['A','4.0 m/s','v＝ω とした'],['B','0.5 m/s','2.0÷4（単位 m·s）'],['D','32 m/s','rω²（単位 m/s²、加速度）']],{win:[wA,wB,wD],opts:{...WOPT,y:262}});
  return s+goalTag(G2)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 12. 小問3：K の比。カードと矢印を消す
 [K+'goal3']:(p)=>{
  let s=rodTop(PH2,{omega:1});
  s+=panel(90,260,label('小問3',PC,140,{size:28,color:C.dim,anchor:'middle'})
   +label('2.0 m の おもりの K は',PC,205,{size:28,color:C.hi,anchor:'middle',weight:700})+label('0.5 m の おもりの 何倍？',PC,255,{size:28,color:C.hi,anchor:'middle',weight:700})
   +label('K：運動エネルギー',PC,315,{size:24,color:CK,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s+goalTag(G3,{g:seg(p,.03,.15)});
 },
 // 13. 0.5 m の点も 2.0 m/s。矢印の長さの比 4、距離の比 4
 [K+'speeds']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=rodTop(PH2,{omega:1,varr:[seg(p,.05,.2),seg(p,.25,.35)],vtxt:['2.0 m/s','8.0 m/s']});
  let q=label('0.5 m の 点',PC,135,{size:24,color:C.dim,anchor:'middle'})+fade(seg(p,.05,.15),T(`${VV}=0.5\\times4={\\color{${CV}}2.0\\ \\mathrm{m/s}}`,PC,195,36));
  q+=fade(seg(p,b,b+.08),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('距離の 比',PX+140,310,{size:26,color:CR,anchor:'middle'})+T(`\\dfrac{2.0}{0.5}=4`,PX+360,305,36));
  q+=fade(seg(p,b+.15,b+.25),label('速さの 比',PX+140,410,{size:26,color:CV,anchor:'middle'})+T(`\\dfrac{8.0}{2.0}=4`,PX+360,405,36));
  s+=panel(90,400,q,1);
  return s+goalTag(G3);
 },
 // 14. K＝½mv²：1.0 J と 16 J（橙の棒、高さは値に比例）
 [K+'energy']:(p)=>energyScene(p,0),
 // 14b. 2.0 m のおもり：16 J
 [K+'energy2']:(p)=>energyScene(p,1),
 // 15. 1.0 J の棒を 16 個積むと 16 J。K＝½m(rω)²＝½mr²ω²、r は2回。答え A
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],b=W[1]?W[1][0]:.5;
  let s=rodTop(PH2,{omega:1,varr:[1,1],vtxt:['2.0 m/s','8.0 m/s']});
  const top=1-seg(p,b-.04,b);
  let q=fade(top,label('16 J ÷ 1.0 J ＝ 16 倍',PC,150,{size:30,color:CK,anchor:'middle',weight:700}));
  const f=`${KK}=\\tfrac12 m(${RR}${WW})^2=\\tfrac12 m${RR}^2${WW}^2`;
  q+=fade(seg(p,b,b+.08),T(f,PC,150,34));
  const wf=texWidth(f,34,false),wr=texWidth(`\\tfrac12 m${RR}^2${WW}^2`,34,false),rx=PC+wf/2-wr+texWidth('\\tfrac12 m',34,false);
  q+=fade(seg(p,b+.12,b+.2),ring(rx+12,142,24,{color:C.hi,w:3})+label('2回',rx+12,212,{size:24,color:C.hi,anchor:'middle',weight:700}));
  q+=kBars({stack:clamp((p-.05)/(e*.75-.05))});
  s+=panel(86,422,q,1);
  return s+goalTag(G3)+ANS3(seg(p,e*.8,e*.8+.06));
 },
 // 16. 誤答 B → C → D
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wB=[0,e*.5],wC=[e*.5,e],wD=[W[1]?W[1][0]:e,1];
  let s=rodTop(PH2,{omega:1,varr:[1,1],vtxt:['2.0 m/s','8.0 m/s']});
  s+=panel(90,150,label('小問3 の 式',PC,125,{size:22,color:C.dim,anchor:'middle'})+T(`${KK}=\\tfrac12 m${RR}^2${WW}^2\\ \\ \\Rightarrow\\ \\ 4^2=16`,PC,185,32),1);
  s+=wrongSeq(p,ctx,[['B','4 倍','K は 速さの 2乗（4²）'],['C','1 倍','同じ ω でも 速さは 違う'],['D','64 倍','4³（3乗に した）']],{win:[wB,wC,wD],opts:{...WOPT,y:262}});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== まとめ =====================
 // 17. 左：シーソー（x_G＝4 m、質量×距離）。右：回る棒（v＝rω、K∝r²、質量×距離²）。答えの札3枚
 [K+'sum']:(p)=>{
  let s=card(20,86,570,424,'',seg(p,.02,.1))+card(610,86,570,424,'',seg(p,.2,.28));
  s+=fade(seg(p,.02,.12),seesaw({s:4,sup:1,x0:70,ppm:90,by:250,lbl:0,nl:0})
   +T(`${XG}=\\dfrac{\\sum m_i${XI}}{\\sum m_i}=4\\ \\mathrm{m}`,305,360,36)
   +label('質量 × 距離',305,465,{size:30,color:CN,anchor:'middle',weight:700})+label('（つり合い）',305,500,{size:22,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.2,.3),rodTop(.6,{o:{ox:650,oy:330,ppm:105},board:0,lbl:0,omega:0,varr:[1,1],vk:9})
   +T(`${VV}=${RR}${WW}`,1010,150,34)+label('（2.0 m の 点 8.0 m/s）',1010,215,{size:22,color:CV,anchor:'middle'})
   +T(`${KK}\\propto ${RR}^2`,1010,290,34)+label('（距離 4倍 → K は 16 倍）',1010,355,{size:22,color:CK,anchor:'middle'})
   +label('質量 × 距離²',895,465,{size:30,color:CK,anchor:'middle',weight:700})+label('（回しにくさ）',895,500,{size:22,color:C.dim,anchor:'middle'}));
  s+=answerRow([[1,'B','x＝4 m'],[2,'C','8.0 m/s'],[3,'A','16 倍']],{g:seg(p,.8,.9)});
  return s;
 },
};
