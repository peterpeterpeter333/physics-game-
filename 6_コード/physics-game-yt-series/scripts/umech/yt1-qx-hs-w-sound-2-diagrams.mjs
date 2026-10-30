// 問題編 解説「256 Hz と 260 Hz の音叉」(ys-qx-hs-w-sound-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/302_音波.md の q-hs-w-sound-2（解説 20 行）。
// うなり：耳の位置での「空気の右へのずれ」の時間のグラフ（縦は ずれ、上下の運動ではない）。
// 振動の回数は見やすく減らし、256 Hz → 1秒に16回、260 Hz → 1秒に20回で描く（差の4回は実際と同じ）。
// 色（正本の指定）：f 桃、t 金、ずれ 白、強め合い 黄、弱め合い 灰、強調 黄。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,clamp} from './anim.mjs';
import {T2,TCOL,FC,ROPE,MK} from './yt1-hs-w-sound-1-diagrams.mjs';
import {card,goalTag,answerTag,answerTagW,wrongCard,wrongSeq,kindTag,note,cueT,tAt,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-hs-w-sound-2:';
const PI=Math.PI,BAD='#ff6b6b',OK=C.F,WEAK=C.dim;
const G1='1秒の うなりの 回数',G2='4回に なる 理由',G3='上げる 前の 楽器の 振動数';
const A1=g=>answerTag(1,'A','4回',{g}),A2=g=>answerTag(2,'C','',{g}),A3=g=>answerTag(3,'B','437 Hz',{g});
// ---- ずれのグラフ（時刻 0〜1 s を GX0〜GX1） ---------------------------------------------------------
const GX0=230,GX1=930,AMP=30,F1=16,F2=20;
const X=t=>GX0+(GX1-GX0)*t;
const s1=t=>Math.cos(2*PI*F1*t),s2=t=>Math.cos(2*PI*F2*t),sm=t=>s1(t)+s2(t);
const L3={y1:125,y2:225,ys:355,ax:445},L2={y1:150,y2:262,ys:null,ax:330};
function trace(y,fn,{from=0,upto=1,amp=AMP,g=1,color=ROPE,w=3}={}){
 if(upto<=from+1e-4)return '';
 const pts=[],N=Math.max(20,Math.round(900*(upto-from)));for(let i=0;i<=N;i++){const t=from+(upto-from)*i/N;pts.push([X(t),y-amp*fn(t)]);}
 return fade(g,draw(pts,1,{color,w}));
}
const base=(y,g=1)=>fade(g,line(GX0,y,GX1,y,{color:C.faint,w:2,dash:'6 8'}));
function axis(y,g=1){return fade(g,[0,.25,.5,.75,1].map(t=>line(X(t),y-14,X(t),y-6,{color:TCOL,w:2})+label(t===0?'0':t===1?'1.0':String(t),X(t),y+16,{size:22,color:TCOL,anchor:'middle'})).join('')+label('時刻 t [s]',GX1+34,y+16,{size:22,color:TCOL}));}
function fork(x,y,{g=1,vib=0,k=1,t=0}={}){
 const c='#c9d3e4';
 let s=line(x-14*k,y-110*k,x-14*k,y-16*k,{color:c,w:7*k})+line(x+14*k,y-110*k,x+14*k,y-16*k,{color:c,w:7*k})
  +`<path d="M${x-14*k} ${y-16*k} Q ${x} ${y+12*k} ${x+14*k} ${y-16*k}" fill="none" stroke="${c}" stroke-width="${7*k}"/>`+line(x,y-2*k,x,y+50*k,{color:c,w:7*k});
 if(vib){const a=.5+.5*Math.sin(t*14);for(const sgn of [-1,1])for(let j=1;j<=2;j++){const r=(18+12*j)*k,cx=x+sgn*14*k;s+=fade(vib*(.4+.4*a)/j,`<path d="M${cx+sgn*r*.5} ${y-95*k} Q ${cx+sgn*r} ${y-65*k} ${cx+sgn*r*.5} ${y-35*k}" fill="none" stroke="${C.dim}" stroke-width="3"/>`);}}
 return fade(g,s);
}
// 2本（＋足した）のグラフ
function panels({L=L3,g1=1,g2=1,gs=0,u1=1,u2=1,us=1,usFrom=0,lab=1,forks=1,vib=0,t=0,ax=1,dim=1,nt=1}={}){
 let s='';
 s+=base(L.y1,g1)+trace(L.y1,s1,{upto:u1,g:g1*dim});
 s+=base(L.y2,g2)+trace(L.y2,s2,{upto:u2,g:g2*dim});
 if(lab)s+=fade(g1,label('256 Hz',GX0-16,L.y1+8,{size:26,color:FC,anchor:'end',weight:700}))+fade(g2,label('260 Hz',GX0-16,L.y2+8,{size:26,color:FC,anchor:'end',weight:700}));
 if(forks)s+=fork(56,L.y1+34,{g:g1,vib,k:.55,t})+fork(56,L.y2+34,{g:g2,vib,k:.55,t:t+.3});
 if(L.ys&&gs){s+=base(L.ys,gs)+trace(L.ys,sm,{from:usFrom,upto:us,g:gs})+fade(gs,label('足した',GX0-16,L.ys-4,{size:24,color:ROPE,anchor:'end',weight:700})+label('ずれ',GX0-16,L.ys+26,{size:24,color:ROPE,anchor:'end',weight:700}));}
 if(ax)s+=axis(L.ax,ax);
 if(nt)s+=note('（振動の 回数は 見やすく 減らして 描いています。差の 回数は 同じ）',600,505,{g:nt});
 return s;
}
const vline=(t,L,{color=C.hi,g=1,w=3,dash=''}={})=>fade(g,line(X(t),L.y1-48,X(t),(L.ys??L.y2)+(L.ys?2*AMP+10:AMP+14),{color,w,dash}));
function env(y,{g=1,amp=AMP}={}){const up=[],dn=[];for(let i=0;i<=400;i++){const t=i/400,e=2*amp*Math.abs(Math.cos(2*PI*2*t));up.push([X(t),y-e]);dn.push([X(t),y+e]);}
 return fade(g,draw(up,1,{color:C.hi,w:3,dash:'10 7'})+draw(dn,1,{color:C.hi,w:3,dash:'10 7'}));}
// 足したずれだけ（誤答カードの上に置く）
const SY=215,SA=26;
function sumOnly({g=1,envG=0,nums=0,lines=0,linesHi=0}={}){
 let s=base(SY,g)+trace(SY,sm,{amp:SA,g})+fade(g,label('足した',GX0-16,SY-4,{size:24,color:ROPE,anchor:'end',weight:700})+label('ずれ',GX0-16,SY+26,{size:24,color:ROPE,anchor:'end',weight:700}));
 s+=axis(SY+80,g);
 if(envG)s+=env(SY,{g:g*envG,amp:SA});
 if(lines)[.25,.5,.75,1].forEach(t=>{s+=fade(g*lines,line(X(t),SY-2*SA-14,X(t),SY+2*SA+10,{color:C.hi,w:3+3*linesHi}));});
 if(nums)[.25,.5,.75,1].forEach((t,i)=>{s+=fade(g*nums,label(String(i+1),X(t),SY-2*SA-22,{size:26,color:C.hi,anchor:'middle',weight:700}));});
 return s;
}
// 右の列の数（カウンター）
const RX=1065;
const cnt=(y,big,small,g=1,col=FC)=>fade(g,label(small,RX,y-26,{size:22,color:C.dim,anchor:'middle'})+label(big,RX,y+12,{size:32,color:col,anchor:'middle',weight:700}));
// ---- 小問3：基準の音叉と楽器・数直線 -------------------------------------------------------------------
function guitar(x,y,{g=1,k=.75,peg=0}={}){
 const bc='#c9a46a';
 let s=dot(x,y+60*k,75*k,bc)+dot(x,y-40*k,58*k,bc)+ring(x,y+20*k,22*k,{color:'#3a2a18',w:2,fill:'#3a2a18'});
 s+=rect(x-12*k,y-230*k,24*k,150*k,{fill:'#8a6a3a',fo:1,stroke:'none',rx:3})+rect(x-22*k,y-292*k,44*k,64*k,{fill:'#8a6a3a',fo:1,stroke:'none',rx:6});
 for(const dy of [-280,-258,-238])for(const sx of [-1,1])s+=dot(x+sx*30*k,y+dy*k,7*k,'#d6deec');
 for(const dx of [-6,-2,2,6])s+=line(x+dx*k,y+110*k,x+dx*k,y-236*k,{color:'#edf4ff',w:1.2});
 s+=rect(x-24*k,y+104*k,48*k,10*k,{fill:'#3a2a18',fo:1,stroke:'none',rx:2});
 if(peg){const px=x+30*k,py=y-258*k;s+=fade(peg,rect(px+6,py-14,44,28,{fill:'#e9c7a6',fo:.95,stroke:'none',rx:10})+`<path d="M${px+22} ${py-26} A 22 22 0 0 1 ${px+22} ${py+26}" fill="none" stroke="${C.hi}" stroke-width="3"/>`);}
 return fade(g,s);
}
const NX=330,NY=f=>290-(f-440)*40;
function numLine({g=1,pts=0,braces=0,hi437=0,hi443=0}={}){
 let s=fade(g,line(NX,140,NX,440,{color:FC,w:4})+label('振動数',NX,124,{size:24,color:FC,anchor:'middle',weight:700}));
 for(let f=437;f<=443;f++)s+=fade(g,line(NX-8,NY(f),NX+8,NY(f),{color:FC,w:2}));
 s+=fade(g,line(NX-16,NY(440),NX+16,NY(440),{color:FC,w:4})+label('440 Hz（基準）',NX+30,NY(440)+9,{size:26,color:FC,weight:700}));
 if(braces)s+=fade(g*braces,line(NX-36,NY(440)-4,NX-36,NY(443)+4,{color:FC,w:3})+line(NX-36,NY(440)+4,NX-36,NY(437)-4,{color:FC,w:3})+label('3 Hz',NX-46,NY(441.5)+8,{size:24,color:FC,anchor:'end',weight:700})+label('3 Hz',NX-46,NY(438.5)+8,{size:24,color:FC,anchor:'end',weight:700}));
 if(pts){s+=fade(g*pts,dot(NX,NY(443),10,FC)+label('443 Hz',NX+30,NY(443)+9,{size:26,color:FC,weight:700})+dot(NX,NY(437),10,FC)+label('437 Hz',NX+30,NY(437)+9,{size:26,color:FC,weight:700}));}
 if(hi437)s+=fade(g*hi437,ring(NX,NY(437),18,{color:C.hi,w:4})+label('437 Hz',NX+30,NY(437)+9,{size:26,color:C.hi,weight:700}));
 if(hi443)s+=fade(g*hi443,ring(NX,NY(443),18,{color:C.hi,w:4}));
 return s;
}
// 右の小さなうなりのグラフ（差 d：見やすく 1秒に d 回のふくらみ）
function beatMini(d,{g=1,x0=620,x1=1150,y=300,amp=26}={}){
 const pts=[],up=[],dn=[];for(let i=0;i<=700;i++){const u=i/700,t=u*1.0,x=x0+(x1-x0)*u;const e=2*amp*Math.abs(Math.cos(PI*d*t));pts.push([x,y-e*Math.cos(2*PI*30*t)]);up.push([x,y-e]);dn.push([x,y+e]);}
 return fade(g,line(x0,y,x1,y,{color:C.faint,w:2,dash:'6 8'})+draw(pts,1,{color:ROPE,w:2})+draw(up,1,{color:C.hi,w:3,dash:'10 7'})+draw(dn,1,{color:C.hi,w:3,dash:'10 7'})+label('1 s',x1,y+2*amp+30,{size:22,color:TCOL,anchor:'end'})+label('0',x0,y+2*amp+30,{size:22,color:TCOL,anchor:'middle'}));
}
const LABEL=(t,x,y,col,o={})=>label(t,x,y,{size:28,color:col,anchor:'middle',weight:700,...o});

export const qxHsWSound2Diagrams={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：二つの音叉が鳴り始め、ずれのグラフ2本を左から右へ描く。足したグラフ・外側の線・縦線は見せない。
 [K+'q0']:(p,ctx)=>{
  const t=cueT(ctx),u=lin(p,.12,.92);
  return panels({L:L2,u1:u,u2:u,vib:seg(p,.03,.1),t,nt:seg(p,.1,.2)});
 },
 // 小問3：暗転して基準の音叉と楽器。「うなり 1秒に3回」→ 糸巻きを締める手 →「うなりが ゆっくりに」。楽器の振動数は出さない。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=fork(260,330,{vib:1,t,k:1.1})+LABEL('基準',260,420,C.dim)+LABEL('440 Hz',260,460,FC)+guitar(880,330,{peg:seg(t,1.6,1.9)*(1-seg(t,3.3,3.6))})+LABEL('楽器',880,470,C.dim);
  s+=card(400,100,320,64,LABEL('うなり 1秒に 3回',560,143,C.hi),seg(t,.3,.6));
  s+=fade(seg(t,1.6,1.9)*(1-seg(t,3.3,3.6)),LABEL('糸巻きを 少し 締める',560,226,C.ink));
  s+=card(400,190,320,64,LABEL('うなりが ゆっくりに',560,233,C.hi),seg(t,3.6,3.9));
  return s;
 },
 // ================= S1 小問1 =================
 // 1. 二つの音叉と、ずれのグラフ2本。耳の横に、大きくなったり小さくなったりする音の記号
 [K+'setup']:(p,ctx)=>{
  const t=cueT(ctx),u=lin(p,0,.35);
  let s=panels({L:L3,u1:u,u2:u,vib:1,t});
  const a=.35+.65*Math.abs(Math.cos(2*PI*.8*t));
  s+=fade(seg(p,.4,.5),ear(1060,330)+[1,2,3].map(j=>`<path d="M${1100+j*14*a} ${300-j*10*a} Q ${1112+j*18*a} 330 ${1100+j*14*a} ${360+j*10*a}" fill="none" stroke="${C.hi}" stroke-width="${2+2*a}" opacity="${(.4+.6*a)/j}"/>`).join('')+LABEL('うなり',1080,440,C.hi));
  return s;
 },
 // 2. 求めるもの。3本目の「足したずれ」の空の軸、「重ね合わせ」のタグ
 [K+'goal1']:(p,ctx)=>{
  let s=panels({L:L3,vib:1,t:cueT(ctx),gs:seg(p,.45,.6),us:0});
  s+=kindTag('重ね合わせ',RX,L3.ys+6,{color:OK,g:seg(p,.5,.65)});
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. t＝0 に黄色い縦線。2本の山を光らせ、3本目に2倍の高さの山
 [K+'align']:(p)=>{
  let s=panels({L:L3,gs:1,us:.03*seg(p,.5,.7)});
  s+=vline(0,L3,{g:seg(p,.05,.2)});
  s+=fade(seg(p,.2,.35),dot(X(0),L3.y1-AMP,10,C.hi)+dot(X(0),L3.y2-AMP,10,C.hi));
  s+=fade(seg(p,.6,.75),dot(X(0),L3.ys-2*AMP,10,C.hi)+LABEL('強め合い',RX,L3.ys+10,C.hi));
  s+=goalTag(G1);
  return s;
 },
 // 4. 0〜0.25 s を金の帯で囲む。64回・65回、差の1回を黄色で
 [K+'count']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=fade(seg(p,.03,.12),rect(X(0),L3.y1-44,X(.25)-X(0),L3.ax-6-(L3.y1-44),{fill:TCOL,fo:.1,stroke:TCOL,sw:2,rx:6}));
  s+=panels({L:L3,gs:1,us:.03});
  s+=vline(0,L3,{g:.5});
  s+=cnt(L3.y1,'64 回','256 × 0.25',seg(p,.25,.35));
  s+=cnt(L3.y2,'65 回','260 × 0.25',seg(p,b+.05,b+.15));
  s+=trace(L3.y2,s2,{from:.2,upto:.25,color:C.hi,w:6,g:seg(p,b+.3,b+.4)});
  s+=fade(seg(p,b+.3,b+.4),LABEL('1回 多い',RX,L3.y2+62,C.hi));
  s+=goalTag(G1);
  return s;
 },
 // 5. t＝0.25 s に縦線、足したグラフがふくらむ。続けて 0.50・0.75・1.0 s
 [K+'every']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,us=.03+.97*lin(p,.05,.9);
  let s=panels({L:L3,gs:1,us});
  s+=vline(0,L3,{g:.6});
  [.25,.5,.75,1].forEach((t,i)=>{s+=vline(t,L3,{g:i===0?seg(p,.1,.2):seg(p,b+.08+i*.1,b+.14+i*.1)});});
  s+=fade(seg(p,b+.1,b+.2),LABEL('強め合い',RX,L3.ys+10,C.hi));
  s+=goalTag(G1);
  return s;
 },
 // 6. t＝0.125 s に灰色の縦線。山と谷 → 足すとほぼ 0。32回・32.5回
 [K+'weak']:(p)=>{
  let s=panels({L:L3,gs:1,us:1});
  [0,.25,.5,.75,1].forEach(t=>{s+=vline(t,L3,{g:.35});});
  s+=vline(.125,L3,{color:WEAK,dash:'8 7',g:seg(p,.05,.15)});
  s+=fade(seg(p,.2,.3),dot(X(.125),L3.y1-AMP,10,C.hi)+label('山',X(.125)+16,L3.y1-AMP-8,{size:24,color:C.hi,weight:700})+dot(X(.125),L3.y2+AMP,10,C.hi)+label('谷',X(.125)+16,L3.y2+AMP+24,{size:24,color:C.hi,weight:700}));
  s+=fade(seg(p,.45,.55),dot(X(.125),L3.ys,10,WEAK)+LABEL('弱め合い',RX,L3.ys+10,WEAK));
  s+=cnt(L3.y1,'32 回','256 × 0.125',seg(p,.2,.3))+cnt(L3.y2,'32.5 回','260 × 0.125',seg(p,.2,.3));
  s+=goalTag(G1);
  return s;
 },
 // 7. 260−256＝4。外側をなぞる線（黄）、ふくらみに 1〜4
 [K+'diff']:(p)=>{
  let s=panels({L:L3,gs:1,us:1,dim:.6});
  s+=card(950,100,236,80,T2('260-256=4',RX,152,{size:34,auto:false,color:FC}),seg(p,.05,.15),FC);
  s+=env(L3.ys,{g:seg(p,.3,.45)});
  [.25,.5,.75,1].forEach((t,i)=>{s+=fade(seg(p,.45+i*.07,.5+i*.07),label(String(i+1),X(t),L3.ys-2*AMP-14,{size:28,color:C.hi,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.75,.85),LABEL('1秒に 4回',RX,L3.ys+10,C.hi));
  s+=goalTag(G1);
  return s;
 },
 // 8. 小問1 の答え A。誤答 B（516回）
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1];
  let s=sumOnly({envG:1,nums:1});
  s+=wrongCard('B','516回','二つの振動数を足した',{g:seg(p,e+.02,e+.08),mid:'256+260=516',midSize:30});
  s+=goalTag(G1)+A1(seg(p,e-.06,e));
  return s;
 },
 // 9. 誤答 D（2回）。0.25 s ごとの4本の黄色い縦線を光らせる
 [K+'wrongD1']:(p,ctx)=>{
  const hl=seg(p,.2,.35)*(.5+.5*Math.sin(cueT(ctx)*6)**2);
  let s=sumOnly({envG:.6,nums:1,lines:seg(p,.15,.3),linesHi:hl});
  s+=wrongCard('D','2回','差をさらに2で割った',{g:seg(p,.02,.08),mid:'4\\div 2=2',midSize:30});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // 10. 細かい揺れ＝約258 Hz（高さ）、外側の線＝1秒に4回（強さ）。誤答 C
 [K+'pitch']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=sumOnly({envG:1});
  s+=fade(seg(p,.05,.15),rect(X(.44),SY-2*SA-6,X(.56)-X(.44),4*SA+12,{fill:'none',fo:0,stroke:FC,sw:3,rx:6}));
  s+=fade(seg(p,.08,.18),label('細かい 揺れ',RX,120,{size:24,color:FC,anchor:'middle',weight:700})+LABEL('約 258 Hz（高さ）',RX,156,FC,{size:26}));
  s+=fade(seg(p,.25,.35),label('外側の 線',RX,230,{size:24,color:C.hi,anchor:'middle',weight:700})+LABEL('1秒に 4回（強さ）',RX,266,C.hi,{size:26}));
  s+=wrongCard('C','258回','聞こえる高さを、うなりの回数とした',{g:seg(p,b+.02,b+.08)});
  s+=goalTag(G1)+A1(1);
  return s;
 },
 // ================= S2 小問2 =================
 // 11. 求めるもの。2本のグラフで 0.25 s ごとに山と山がそろう所を縦線で順に、「ずれ 1回」〜「4回」
 [K+'goal2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=panels({L:L2});
  s+=vline(0,L2,{g:seg(p,b,b+.05)*.6});
  [.25,.5,.75,1].forEach((t,i)=>{const g=seg(p,b+.08+i*.12,b+.13+i*.12);s+=vline(t,L2,{g})+fade(g,label(`ずれ ${i+1}回`,X(t),L2.y1-58,{size:24,color:C.hi,anchor:'middle',weight:700})+dot(X(t),L2.y1-AMP,8,C.hi)+dot(X(t),L2.y2-AMP,8,C.hi));});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 12. 小問2 の答え C。誤答 A（258 の回数だけ強くなる）
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1];
  let s=fade(1-.5*seg(p,e,e+.05),panels({L:L2})+[.25,.5,.75,1].map(t=>vline(t,L2)+label(`ずれ ${[.25,.5,.75,1].indexOf(t)+1}回`,X(t),L2.y1-58,{size:24,color:C.hi,anchor:'middle',weight:700})).join('')+vline(0,L2,{g:.6}));
  s+=wrongCard('A','258 の回数だけ強くなる','258 は高さ（細かい揺れ）',{y:360,g:seg(p,e+.02,e+.08)});
  s+=goalTag(G2)+A2(seg(p,e-.06,e));
  return s;
 },
 // 13. 誤答 B（高さが入れかわる）、誤答 D（足すと4で割り切れる）。1枚ずつ
 [K+'wrongBD2']:(p,ctx)=>{
  let s=fade(.5,panels({L:L2})+[.25,.5,.75,1].map((t,i)=>vline(t,L2)+label(`ずれ ${i+1}回`,X(t),L2.y1-58,{size:24,color:C.hi,anchor:'middle',weight:700})).join('')+vline(0,L2,{g:.6}));
  s+=wrongSeq(p,ctx,[['B','高さが入れかわる','変わるのは強さ'],['D','足すと4で割り切れる','回数の差で決まる']],{opts:{y:360}});
  s+=goalTag(G2)+A2(1);
  return s;
 },
 // ================= S3 小問3 =================
 // 14. 基準の音叉と楽器。求めるもの。「うなり 3回/s → 差 3 Hz」
 [K+'goal3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,t=cueT(ctx);
  let s=fork(260,330,{vib:1,t,k:1.1})+LABEL('基準',260,420,C.dim)+LABEL('440 Hz',260,460,FC)+guitar(880,330)+LABEL('楽器',880,470,C.dim);
  s+=card(380,110,360,70,LABEL('うなり 3回/s → 差 3 Hz',560,156,FC),seg(p,b+.05,b+.15),FC);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 15. 縦の数直線（桃）。440 の上下に 3 Hz、443 と 437
 [K+'two']:(p)=>{
  let s=numLine({braces:seg(p,.1,.25),pts:seg(p,.3,.45)});
  s+=goalTag(G3);
  return s;
 },
 // 16. 437 から 440 へ上向きの矢印（○）。差が縮み、うなりのふくらみの間隔が広がる
 [K+'tune']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=seg(p,.08,b-.02),d=3-2*u;
  let s=numLine({pts:1,braces:.4});
  s+=arrow(NX+170,NY(437)-20,NX+170,NY(437)-20-(NY(437)-20-NY(439.2))*u,{color:OK,w:6,head:16,g:seg(p,.05,.1)});
  s+=fade(seg(p,.05,.1),label('上げる',NX+190,NY(438.3),{size:24,color:OK,weight:700}));
  s+=beatMini(d,{g:seg(p,.05,.12)});
  s+=fade(seg(p,.05,.12),label('うなり（外側の 線）',885,200,{size:24,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,b-.1,b),LABEL('うなりが ゆっくりに',885,420,C.hi));
  s+=fade(seg(p,b+.05,b+.15),LABEL('○ 440 に 近づく',NX+30,NY(437)+52,OK,{anchor:'start'}));
  s+=goalTag(G3);
  return s;
 },
 // 17. だから上げる前は 437 Hz。小問3 の答え B
 [K+'ans3']:(p,ctx)=>{
  const ve=voiceEnd(ctx);
  let s=numLine({pts:1,braces:.4,hi437:seg(p,.05,.2)});
  s+=fade(.5,arrow(NX+170,NY(437)-20,NX+170,NY(439.2),{color:OK,w:6,head:16}));
  s+=fade(seg(p,.05,.2),LABEL('上げる 前',NX+150,NY(437)+9,C.hi,{anchor:'start'}));
  s+=goalTag(G3)+A3(seg(p,ve-.08,ve));
  return s;
 },
 // 18. 443 から上向き → 440 から離れる（×）。誤答 A、誤答 C（1枚ずつ）
 [K+'wrongAC3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=numLine({pts:1,braces:.4,hi443:seg(p,.03,.1)*(1-seg(p,b,b+.05))});
  const ga=seg(p,.05,.15)*(1-seg(p,b,b+.05));
  s+=fade(ga,arrow(NX+170,NY(443)-14,NX+170,NY(443)-74,{color:BAD,w:6,head:16})+label('×',NX+190,NY(443)-36,{size:40,color:BAD,weight:700})+label('440 から 離れる',NX+230,NY(443)-36,{size:26,color:BAD,weight:700}));
  s+=fade(seg(p,b,b+.05),ring(NX,NY(440),18,{color:C.hi,w:4})+label('差 0',NX-34,NY(440)+9,{size:26,color:C.hi,anchor:'end',weight:700}));
  s+=wrongSeq(p,ctx,[['A','443 Hz','上げると差が広がる'],['C','440 Hz','差が0ならうなりはない']],{opts:{x:540,w:640}});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // 19. 誤答 D（438.5 Hz）
 [K+'wrongD3']:(p)=>{
  let s=numLine({pts:1,braces:.4});
  s+=fade(seg(p,.1,.2),ring(NX,NY(438.5),9,{color:C.dim,w:3})+label('438.5',NX+30,NY(438.5)+8,{size:24,color:C.dim,weight:700}));
  s+=wrongCard('D','438.5 Hz','差を 3÷2＝1.5 Hz とした',{x:540,w:640,g:seg(p,.02,.08)});
  s+=goalTag(G3)+A3(1);
  return s;
 },
 // ================= S4 まとめ =================
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(20,100,370,210,LABEL('0.25 s で',205,150,C.dim,{size:26})+LABEL('64回 と 65回',205,200,FC,{size:32})+LABEL('→ ずれ 1回',205,255,C.hi,{size:30}),seg(p,.03,.12),C.faint);
  s+=card(410,100,380,210,'',seg(p,.1,.2),C.faint);
  if(seg(p,.1,.2)>0){const pts=[],up=[],dn=[];for(let i=0;i<=500;i++){const t=i/500,x=430+340*t,e=40*Math.abs(Math.cos(2*PI*2*t));pts.push([x,210-e*Math.cos(2*PI*24*t)]);up.push([x,210-e]);dn.push([x,210+e]);}
   s+=fade(seg(p,.1,.2),draw(pts,1,{color:ROPE,w:2})+draw(up,1,{color:C.hi,w:3,dash:'8 6'})+draw(dn,1,{color:C.hi,w:3,dash:'8 6'})+LABEL('1秒に 4回 ふくらむ',600,290,C.hi,{size:24}));}
  s+=card(810,100,370,210,'',seg(p,.17,.27),C.faint);
  s+=fade(seg(p,.17,.27),line(880,130,880,290,{color:FC,w:4})+dot(880,270,9,FC)+label('437',900,278,{size:26,color:FC,weight:700})+line(870,170,890,170,{color:FC,w:4})+label('440',900,178,{size:26,color:FC,weight:700})+arrow(940,255,940,190,{color:OK,w:5,head:14})+LABEL('上げると 近づく',1060,230,OK,{size:24}));
  s+=card(250,330,700,100,label('うなりの 回数 ＝',470,392,{size:32,color:C.ink,anchor:'middle',weight:700})+tex('|f_1-f_2|',720,384,{size:44,auto:false,color:FC}),seg(p,b-.05,b+.05),C.hi);
  s+=answerRowQ(seg(p,.6,.7));
  return s;
 },
};
function answerRowQ(g){
 const it=[[1,'A','4回'],[2,'C',''],[3,'B','437 Hz']];
 let x=1190,s='';for(const [n,l,v] of [...it].reverse()){s+=answerTag(n,l,v,{g,right:x,size:24});x-=answerTagW(n,l,v,{size:24})+10;}
 return s;
}
function ear(x,y,{g=1}={}){
 const s=`<path d="M${x+22} ${y-44} C ${x-30} ${y-56}, ${x-38} ${y+6}, ${x-6} ${y+18} C ${x+8} ${y+24}, ${x+2} ${y+46}, ${x+22} ${y+44}" fill="none" stroke="#e9c7a6" stroke-width="7" stroke-linecap="round"/>`
  +`<path d="M${x+10} ${y-22} C ${x-10} ${y-20}, ${x-12} ${y+2}, ${x+4} ${y+6}" fill="none" stroke="#e9c7a6" stroke-width="5" stroke-linecap="round"/>`;
 return fade(g,s);
}
