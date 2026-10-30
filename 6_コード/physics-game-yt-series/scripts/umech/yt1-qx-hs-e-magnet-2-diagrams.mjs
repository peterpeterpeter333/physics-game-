// 問題編 解説「上向きの磁場の中の ⊗ は、どちらへ押される？」(ys-qx-hs-e-magnet-2) — 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/高校編/403_磁場と電磁誘導.md の q-hs-e-magnet-2（解説 21 行）。
// 色（正本）：電流 I 緑（⊙⊗）、力 𝐅 緑の太い矢印、磁場 𝐁 橙、長さ l 白、強調 黄。共通の表と同じなので凡例は出さない。
// 向き（x 右・y 上・z 手前）：電流 ⊗＝−ẑ、𝐁＝＋ŷ → 𝐅∝(−ẑ)×ŷ＝＋x̂（右）。⊗ のまわりの磁場は時計回り（右側で下向き、左側で上向き）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 単元動画（yt1-hs-e-magnet-1）の部品を読み込んで使う（そのファイルは編集しない）。
// 文字の l と I は、ゴシック体では見分けにくいので、図の文字の中の1文字の l・I を斜体のセリフ体で描く（fixLI、全部の図に通す）。
import {C,seg,lin,mix,fade,label,line,rect,dot,draw,arrow,tex,texWidth} from './anim.mjs';
import {BC,IC,FC,RAD,T,cs,vB,vF,Bt,It,Ft,inSym,head,fieldCircle} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {QC,card,textW,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,voiceEnd,sentWin,cueT} from './yt1-qx-common.mjs';

const K='qx-hs-e-magnet-2:';
const WH=C.ink,BAD=QC.bad;
const lt=cs(WH,'l'),LAW=`${Ft}=${Bt}${It}${lt}`;
const G1='力の大きさ',G2='力の向き',G3='平行のときの力';
const A1=g=>answerTag(1,'B','0.20 N',{g}),A2=g=>answerTag(2,'D','右向き',{g}),A3=g=>answerTag(3,'C','0 N',{g});
// 声のかな（reading）の中で word が始まる所（cue の進み 0〜1。sentWin と同じ割り振り）
function wAt(ctx,word,fb=.5){
 const r=(ctx?.cue?.reading??'').replace(/\s/g,'').replace(/。/g,''),i=r.indexOf(word);
 return i<0||!r.length?fb:i/r.length*voiceEnd(ctx);
}
const win=(ctx,i,d=.5)=>{const W=sentWin(ctx);return W[i]??[d,1];};
// 条件「（I と B が直角のとき）」：I（緑）と B（橙）は斜体
function cond(x,y,{size=26,anchor='start',color=WH}={}){
 const it=(c,s)=>`<tspan fill="${c}" font-family="serif" font-style="italic">${s}</tspan>`;
 return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="700">（${it(IC,'I')} と ${it(BC,'B')} が直角のとき）</text>`;
}
const condW=size=>textW('（I と B が直角のとき）',size);
// ---- 平面図（小問1・2）：上向きの一様な磁場、中央に ⊗ ------------------------------------------------
const PX=330,PY=300,COLS=[90,210,330,450,570],YB=[470,370,270,170],AL=70;
function plan({grow=1,wire=1,mark=1,wk=0,st=0,circ=0,F=0,Fdash=0,Flab=1,g=1}={}){
 let s='';
 const L=AL*grow;
 if(L>2)for(const x of COLS)for(const yb of YB){
  if(x===PX&&yb===370)continue;
  const o=x>PX?.85*(1-.7*wk):x<PX?.85+.15*st:.85,w=x>PX?4-1.5*wk:x<PX?4+3*st:4;
  s+=arrow(x,yb,x,yb-L,{color:BC,w,head:14+5*(x<PX?st:0),opacity:o});
 }
 if(circ>0)s+=fieldCircle(PX,PY,95,-1,{g:circ,nh:4,phase:0,w:4});
 if(wire>0)s+=fade(wire,rect(PX-34,PY-34,68,68,{fill:C.bg,fo:1,stroke:'none',rx:34})+inSym(PX,PY,24,IC)+label('I',PX-42,PY+10,{size:30,color:IC,anchor:'end',weight:700}));
 if(mark>0)s+=fade(mark,draw([[PX,PY-50],[PX+20,PY-50],[PX+20,PY-30]],1,{color:WH,w:3}));
 if(Fdash>0&&F<.999)s+=fade(Fdash*(1-F),line(PX+32,PY,PX+170,PY,{color:FC,w:10,dash:'16 12',cap:'butt'})+head(PX+194,PY,1,0,{color:FC,L:28})+T(vF,PX+112,PY-30,{size:34}));
 if(F>0)s+=fade(F,arrow(PX+32,PY,PX+194,PY,{color:FC,w:11,head:28})+(Flab?T(vF,PX+112,PY-30,{size:34}):''));
 return fade(g,s);
}
// ---- 札（値）：平面図の右。記号の丸い印は札の左に出す --------------------------------------------------
const CHX=670,CHW=510,CHY=[100,172,244];
const CHIPS=[['B ＝ 0.40 T',BC,'0.40'],['I ＝ 2.5 A（奥向き）',IC,'2.5'],['磁場の中の長さ 0.20 m',WH,'0.20']];
function chips(o=[1,1,1],{list=CHIPS,hi=[0,0,0]}={}){
 let s='';
 list.forEach(([t,col],i)=>{if(o[i]<=0)return;const y=CHY[i];
  s+=card(CHX,y,CHW,56,label(t,CHX+20,y+38,{size:28,color:col,weight:700}),o[i],hi[i]>.5?C.hi:col);});
 return s;
}
const numX=i=>CHX+20+textW(CHIPS[i][0].slice(0,CHIPS[i][0].indexOf(CHIPS[i][2])),28)+textW(CHIPS[i][2],28)/2;
function badges(o=[0,0,0]){
 let s='';[[Bt,BC],[It,IC],[lt,WH]].forEach(([t,col],i)=>{if(o[i]<=0)return;const y=CHY[i]+28;
  s+=fade(o[i],`<circle cx="640" cy="${y}" r="21" fill="${C.bg}" stroke="${col}" stroke-width="3"/>`+T(t,640,y,{size:32}));});
 return s;
}
const fTag=(g=1)=>fade(g,rect(PX+34,PY+44,232,44,{fill:C.bg,fo:.92,stroke:FC,sw:2,rx:10})+label('F：力の大きさ',PX+150,PY+75,{size:26,color:FC,anchor:'middle',weight:700}));
// 法則の札：F＝BIl（I と B が直角のとき）
function lawCard(g=1,{x=CHX,w=CHW,y=316,frame=0,frameCol=C.hi,tag=1,h=110,center=0}={}){
 const lw=texWidth(LAW,38,false),cw=condW(26),lx=center?x+(w-(lw+36+cw))/2:x+24,cx=lx+lw+36;
 let s=card(x,y,w,h,'',1,C.hi);
 if(tag)s+=kindTag('法則',x+60,y+36);
 const ly=y+h-34;
 s+=T(LAW,lx+lw/2,ly,{size:38})+cond(cx,ly+9);
 if(frame>0)s+=fade(frame,rect(cx-6,ly-26,cw+12,46,{fill:'none',fo:0,stroke:frameCol,sw:4,rx:8}));
 return fade(g,s);
}
// ---- 横から見た図（小問3）：上向きの磁場の中の縦の導線、電流も上向き -----------------------------------
const SX=350,SC=[130,240,460,570],SYB=[455,365,275,185],SL=60;
function side({grow=1,wire=1,cur=1,brk=1,blab=1,g=1}={}){
 let s=fade(Math.min(1,grow*2),rect(70,120,540,350,{fill:BC,fo:.05,stroke:BC,sw:2,rx:10}));
 const L=SL*grow;
 if(L>2)for(const x of SC)for(const yb of SYB)s+=arrow(x,yb,x,yb-L,{color:BC,w:4,head:14,opacity:.85});
 if(blab>0)s+=fade(blab,T(vB,512,104,{size:32})+label('上向き',534,112,{size:24,color:BC,weight:700}));
 if(wire>0)s+=fade(wire,line(SX,88,SX,505,{color:IC,w:7}));
 if(cur>0)s+=fade(cur,arrow(SX,350,SX,232,{color:IC,w:9,head:24})+label('I',SX+20,262,{size:30,color:IC,weight:700}));
 if(brk>0)s+=fade(brk,line(292,120,292,470,{color:WH,w:2.5})+line(282,120,302,120,{color:WH,w:2.5})+line(282,470,302,470,{color:WH,w:2.5}));
 return fade(g,s);
}
const SCHIPS=[['B ＝ 0.40 T',BC,'0.40'],['I ＝ 2.5 A',IC,'2.5'],['磁場の中の長さ 0.20 m',WH,'0.20']];
const schips=(o=[1,1,1])=>chips(o,{list:SCHIPS});
// 小問1 の直角の印（小さく）。× を重ねる
function rightInset(g=1,x=1){
 const cx=760,cy=440;
 let s=card(690,322,330,150,'',1,C.faint);
 s+=inSym(cx,cy,16,IC)+arrow(cx,cy-22,cx,cy-90,{color:BC,w:4,head:14})+draw([[cx,cy-40],[cx+16,cy-40],[cx+16,cy-24]],1,{color:WH,w:3});
 s+=label('小問1：直角',820,410,{size:26,color:WH,weight:700});
 s+=fade(x,line(cx-28,cy-62,cx+40,cy-6,{color:BAD,w:6})+line(cx-28,cy-6,cx+40,cy-62,{color:BAD,w:6}));
 return fade(g,s);
}
// ---- フレミングの左手（立体の3本の矢印）-------------------------------------------------------------
// 中指＝電流（奥 −ẑ）、人差し指＝磁場（上 ＋ŷ）、親指＝力（右 ＋x̂）。斜めの投影：奥は右上へ描く。
function triad(ox,oy,{a=[1,1,1],lab=[1,1,1],palm=1,marks=0,L=170,names=1,size=24,g=1}={}){
 const P=(x,y,z)=>[ox+x-.55*z,oy-y+.4*z];
 let s=palm>0?fade(palm,`<ellipse cx="${ox-14}" cy="${oy+16}" rx="48" ry="34" fill="#e2b48f" opacity=".9"/>`+label('左手',ox-14,oy+82,{size:24,color:'#e2b48f',anchor:'middle',weight:700})):'';
 const [ix,iy]=P(0,0,-L*1.05),[bx,by]=P(0,L,0),[fx,fy]=P(L*1.1,0,0);
 if(marks>0){const m=22;
  s+=fade(marks,draw([P(m,0,0),P(m,m,0),P(0,m,0)],1,{color:WH,w:3})+draw([P(0,0,-m),P(0,m,-m),P(0,m,0)],1,{color:WH,w:3})+draw([P(0,0,-m),P(m,0,-m),P(m,0,0)],1,{color:WH,w:3}));}
 s+=fade(a[0],arrow(ox,oy,ix,iy,{color:IC,w:7,head:20}))+fade(a[0]*lab[0],label(names?'中指：電流 I（奥）':'電流 I（奥）',ix+12,iy-6,{size,color:IC,weight:700}));
 s+=fade(a[1],arrow(ox,oy,bx,by,{color:BC,w:7,head:20}))+fade(a[1]*lab[1],label(names?'人差し指：磁場 𝐁（上）':'磁場 𝐁（上）',bx,by-14,{size,color:BC,anchor:'middle',weight:700}));
 s+=fade(a[2],arrow(ox,oy,fx,fy,{color:FC,w:11,head:26}))+fade(a[2]*lab[2],label(names?'親指：力 𝐅（右）':'力 𝐅（右）',names?fx-80:fx+14,names?fy+46:fy+9,{size,color:FC,anchor:names?'middle':'start',weight:700}));
 return fade(g,s);
}
// ---- 単位の式 T×A×m＝N/(A·m)×A×m＝N（A と m に打ち消し線）--------------------------------------------
function unitEq(cx,cy,{size=44,st=0,g=1}={}){
 const W=t=>texWidth(t,size,false);
 const pre='\\mathrm{T}\\times\\mathrm{A}\\times\\mathrm{m}=',dn=['\\mathrm{A}','\\cdot','\\mathrm{m}'];
 const wd=dn.reduce((a,t)=>a+W(t),0),wn=W('\\mathrm{N}'),wf=Math.max(wd,wn)+20;
 const post=['\\times','\\mathrm{A}','\\times','\\mathrm{m}','=\\mathrm{N}'];
 const tot=W(pre)+8+wf+8+post.reduce((a,t)=>a+W(t),0);
 let x=cx-tot/2,s='',strikes=[];
 s+=tex(pre,x+W(pre)/2,cy,{size,auto:false});x+=W(pre)+8;
 s+=tex('\\mathrm{N}',x+wf/2,cy-size*.72,{size,auto:false})+line(x,cy,x+wf,cy,{color:WH,w:3});
 let dx=x+(wf-wd)/2;dn.forEach((t,i)=>{s+=tex(t,dx+W(t)/2,cy+size*.8,{size,auto:false});if(i!==1)strikes.push([dx,dx+W(t),cy+size*.8]);dx+=W(t);});
 x+=wf+8;
 post.forEach((t,i)=>{s+=tex(t,x+W(t)/2,cy,{size,auto:false});if(i===1||i===3)strikes.push([x,x+W(t),cy]);x+=W(t);});
 if(st>0)s+=fade(st,strikes.map(([a,b,y])=>line(a-4,y+16,b+4,y-16,{color:C.hi,w:4})).join(''));
 return fade(g,s);
}
// ---- まとめの2枚の図（左：直角、右：平行）---------------------------------------------------------------
const mini=(tx,ty,sc,svg)=>`<g transform="translate(${tx} ${ty}) scale(${sc})">${svg}</g>`;
function pair({F=0,zero=0,labs=1,form=0}={}){
 let s=line(600,110,600,480,{color:C.faint,w:2});
 s+=mini(102,110,.6,plan({F,Flab:0}))+mini(670,112,.6,side({blab:0,brk:0}));
 s+=fade(labs,label('直角',300,140,{size:30,color:C.hi,anchor:'middle',weight:700})+label('平行',880,140,{size:30,color:C.hi,anchor:'middle',weight:700}));
 if(F>0)s+=fade(F,T(vF,102+.6*(PX+112),110+.6*(PY-34),{size:28}));
 if(form>0){const w1=texWidth(`${LAW}=0.20\\,\\mathrm{N}`,34,false),w2=textW('（直角）',26),x0=300-(w1+w2)/2;
  s+=fade(form,T(`${LAW}=0.20\\,\\mathrm{N}`,x0+w1/2,452,{size:34})+label('（直角）',x0+w1,462,{size:26,color:WH,weight:700}));}
 if(zero>0)s+=fade(zero,label('0 N',880,466,{size:40,color:FC,anchor:'middle',weight:700}));
 return s;
}

// 1文字の l と I を斜体のセリフ体にする（<text> の中の文字だけ。tex の式は触らない）
const LI=/(?<![A-Za-z0-9&#;])([lI])(?![A-Za-z0-9])/g;
const fixLI=svg=>svg.replace(/(<text[^>]*>)([\s\S]*?)(<\/text>)/g,(m,o,body,c)=>o+body.replace(/(^|>)([^<]*)/g,(mm,g1,txt)=>g1+txt.replace(LI,'<tspan font-family="serif" font-style="italic">$1</tspan>'))+c);

const D0={
 // ================= 問題アニメ =================
 // 出題（小問1・2）：0〜2 s 磁場の矢印が下から伸びる。2〜4 s ⊗ の導線・札・直角の印。4 s で静止。
 // 出さないもの：力の矢印と値、⊗ のまわりの円い磁場。
 [K+'q0']:(p)=>plan({grow:lin(p,0,.5),wire:seg(p,.5,.6),mark:seg(p,.88,.98)})+chips([seg(p,.6,.68),seg(p,.7,.78),seg(p,.8,.88)]),
 // 小問3：暗転から、横から見た図。上向きの磁場の中に縦の導線、電流も上向き。3 s で静止。
 [K+'q3']:(p)=>side({grow:lin(p,.05,.4),wire:seg(p,.4,.52),cur:seg(p,.5,.62),brk:seg(p,.75,.85),blab:seg(p,.3,.4)})+schips([seg(p,.62,.7),seg(p,.7,.78),seg(p,.78,.86)]),
 // ================= S1 小問1：力の大きさ =================
 // 1. 出題中の図＋求めるもの
 [K+'goal1']:(p)=>plan()+chips()+goalTag(G1,{g:seg(p,.03,.15)}),
 // 2. 文2：直角の印を黄の枠で囲む
 [K+'rel']:(p,ctx)=>{
  const [a]=win(ctx,1,.45),h=seg(p,a,a+.08);
  let s=plan()+chips();
  s+=fade(h,rect(PX-14,PY-112,48,92,{fill:C.hi,fo:.1,stroke:C.hi,sw:4,rx:8})+label('直角',PX+44,PY-66,{size:26,color:C.hi,weight:700}));
  return s+goalTag(G1);
 },
 // 3. 札に記号 B・I・l、⊗ の横に「F：力の大きさ」（矢印なし）→「法則」タグと F＝BIl（I と B が直角のとき）、条件を黄の枠
 [K+'law']:(p)=>{
  let s=plan()+chips()+badges([seg(p,.04,.1),seg(p,.12,.18),seg(p,.2,.26)])+fTag(seg(p,.28,.34));
  s+=lawCard(seg(p,.4,.5),{frame:seg(p,.58,.66)});
  return s+goalTag(G1);
 },
 // 4. 数を札から一つずつ式へ飛ばす → 0.20 N → 答えの札
 [K+'calc']:(p,ctx)=>{
  const [a,b]=win(ctx,0,.6),ans=wAt(ctx,'こたえは',b+.1);
  let s=plan()+chips()+badges([1,1,1])+fTag(1);
  s+=card(CHX,316,CHW,170,'',1,C.hi);
  s+=T(LAW,CHX+28+texWidth(LAW,30,false)/2,346,{size:30})+cond(CHX+40+texWidth(LAW,30,false),354,{size:22,color:C.dim});
  const y=410,slots=[800,920,1040];
  s+=label('F ＝',CHX+20,y,{size:32,color:FC,weight:700});
  s+=fade(seg(p,a+.3*(b-a),a+.36*(b-a)),label('×',860,y,{size:32,color:WH,anchor:'middle',weight:700}));
  s+=fade(seg(p,a+.55*(b-a),a+.61*(b-a)),label('×',980,y,{size:32,color:WH,anchor:'middle',weight:700}));
  [0,1,2].forEach(i=>{const u0=a+(.05+.25*i)*(b-a),u=seg(p,u0,u0+.2*(b-a));if(u<=0)return;
   const sx=numX(i),sy=CHY[i]+38;s+=label(CHIPS[i][2],mix(sx,slots[i],u),mix(sy,y,u),{size:32,color:CHIPS[i][1],anchor:'middle',weight:700});});
  s+=fade(seg(p,a+.8*(b-a),a+.9*(b-a)),label('＝ 0.20 N',CHX+90,462,{size:34,color:C.hi,weight:700}));
  return s+goalTag(G1)+A1(seg(p,ans,ans+.06));
 },
 // 5. 単位の式で A と m に打ち消し線 → 誤答 D
 [K+'unit']:(p,ctx)=>{
  const [a2]=win(ctx,1,.55);
  let s=card(230,100,740,170,'',1,C.faint)+unitEq(600,180,{st:seg(p,.3,.4)});
  s+=wrongCard('D','0.20 T','力の単位は N',{y:310,g:seg(p,a2,a2+.06)});
  return s+goalTag(G1)+A1(1);
 },
 // 6. 誤答 A（l で割った）→ 誤答 C（I で割った）。1枚ずつ、ナレーションが C に移ったら切り替える
 [K+'wrongAC']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.5);
  let s=card(200,96,800,74,label('F ＝ 0.40 × 2.5 × 0.20 ＝ 0.20 N',600,145,{size:30,color:WH,anchor:'middle',weight:700}),.5,C.faint);
  s+=wrongSeq(p,ctx,[['A','5.0 N','l で割った（N/m²）',{mid:'0.40\\times2.5\\div0.20=5.0'}],['C','0.032 N','I で割った',{mid:'0.40\\times0.20\\div2.5=0.032'}]],{win:[[0,c],[c,1]],opts:{y:200}});
  return s+goalTag(G1)+A1(1);
 },
 // ================= S2 小問2：力の向き =================
 // 7. カードを消す。図に戻り、求めるもの
 [K+'goal2']:(p)=>plan()+chips()+goalTag(G2,{g:seg(p,.05,.18)}),
 // 8. ⊗ のまわりに時計回りの橙の円 → 背景の上向きの矢印と重ねる
 [K+'circ']:(p,ctx)=>{
  const [a]=win(ctx,1,.5);
  let s=plan({circ:seg(p,.12,.35)});
  s+=fade(seg(p,a,a+.1),label('重ねる',900,300,{size:36,color:C.hi,anchor:'middle',weight:700}));
  return s+goalTag(G2);
 },
 // 9. 文1：右側の円の下向きの部分を光らせ → 右側を淡く。文2：左側の上向きの部分を光らせ → 左側を濃く
 [K+'super']:(p,ctx)=>{
  const [[a1,b1],[a2,b2]]=[win(ctx,0,0),win(ctx,1,.5)];
  const hR=seg(p,a1+.1*(b1-a1),a1+.2*(b1-a1))*(1-seg(p,b1-.04,b1)),wk=seg(p,a1+.55*(b1-a1),a1+.85*(b1-a1));
  const hL=seg(p,a2+.05*(b2-a2),a2+.15*(b2-a2))*(1-seg(p,b2-.02,b2+.04)),st=seg(p,a2+.45*(b2-a2),a2+.75*(b2-a2));
  const arc=(a0,a1_)=>Array.from({length:21},(_,i)=>{const t=(a0+(a1_-a0)*i/20)*RAD;return [PX+95*Math.cos(t),PY-95*Math.sin(t)];});
  let s=plan({circ:1,wk,st});
  s+=fade(hR,draw(arc(-35,35),1,{color:C.hi,w:8,opacity:.8}))+fade(hL,draw(arc(145,215),1,{color:C.hi,w:8,opacity:.8}));
  s+=fade(seg(p,a1+.55*(b1-a1),a1+.7*(b1-a1)),label('右側：弱め合う → 弱い',680,250,{size:30,color:C.dim,weight:700}));
  s+=fade(seg(p,a2+.45*(b2-a2),a2+.6*(b2-a2)),label('左側：強め合う → 強い',680,330,{size:30,color:BC,weight:700}));
  return s+goalTag(G2);
 },
 // 10. 札「向きをイメージするための図」。左が濃く右が淡い図に、右向きの 𝐅 を点線で。2文目で札「→ 左手の 法則へ」（2026-10-18）
 [K+'guess']:(p,ctx)=>{
  const [a]=win(ctx,1,.5);
  let s=plan({circ:1,wk:1,st:1});   // 2026-10-18：この図だけでは向きを決めないので、点線の 𝐅 は出さない
  s+=card(160,84,340,46,label('向きをイメージするための図',330,116,{size:24,color:C.ink,anchor:'middle',weight:700}),seg(p,.03,.1),C.dim);
  s+=label('右側：弱め合う → 弱い',680,215,{size:30,color:C.dim,weight:700})+label('左側：強め合う → 強い',680,285,{size:30,color:BC,weight:700});
  // 2026-10-18（PQ-044）：2文目で「→ 左手の 法則へ」の札だけ（大きな左手は次の cue で出す）
  s+=fade(seg(p,a,a+.08),label('→ 左手の 法則へ',680,370,{size:30,color:C.hi,weight:700}));
  return s+goalTag(G2);
 },
 // 11. 左手：中指（緑）→ 人差し指（橙）→ 親指（緑の太線）。親指が右を向いたら、点線の 𝐅 を実線に
 [K+'fleming']:(p,ctx)=>{
  const im=wAt(ctx,'なかゆび',.45),ib=wAt(ctx,'ひとさしゆび',.6),it=wAt(ctx,'おやゆび',.8),ve=voiceEnd(ctx);
  const aI=seg(p,im,im+.06),aB=seg(p,ib,ib+.06),aF=seg(p,it,it+.06),solid=seg(p,Math.min(ve,it+.1),Math.min(ve,it+.1)+.06);
  let s=plan({circ:.35,wk:1,st:1,Fdash:aF,F:solid});   // 2026-10-18：点線の 𝐅 は親指が右を向いてから
  s+=triad(860,360,{a:[aI,aB,aF],palm:seg(p,.03,.1)});
  s+=card(720,96,300,50,label('フレミングの 左手',870,130,{size:26,color:C.hi,anchor:'middle',weight:700}),seg(p,.03,.1),C.hi);
  return s+goalTag(G2);
 },
 // 12. 答えの札
 [K+'ans2']:(p,ctx)=>{
  const ans=wAt(ctx,'こたえは',.4);
  let s=plan({circ:.35,wk:1,st:1,F:1})+triad(860,360);
  return s+goalTag(G2)+A2(seg(p,ans,ans+.08));
 },
 // 13. 3本の矢印を立体で並べ、直角の印。誤答 A（「A」の語）→ 誤答 C（「C」の語）
 [K+'wrongAC2']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.3);
  let s=triad(520,290,{palm:0,names:0,marks:seg(p,.05,.15),L:150});
  s+=wrongSeq(p,ctx,[['A','上向き','力は 𝐁 にも I にも垂直'],['C','奥向き','力は 𝐁 にも I にも垂直']],{win:[[0,c],[c,1]],opts:{y:360}});
  return s+goalTag(G2)+A2(1);
 },
 // 14. 誤答 B（右手／指の入れ替え）
 [K+'wrongB2']:(p)=>{
  let s=triad(520,290,{palm:0,names:0,marks:1,L:150});
  s+=wrongCard('B','左向き','右手を使った／指の入れ替え',{y:360,g:seg(p,.02,.08)});
  return s+goalTag(G2)+A2(1);
 },
 // ================= S3 小問3：平行にしたとき =================
 // 15. 暗転して横から見た図（cut）。求めるもの
 [K+'goal3']:(p)=>side({grow:lin(p,0,.25),wire:seg(p,.2,.3),cur:seg(p,.28,.38),brk:seg(p,.4,.5),blab:seg(p,.15,.25)})+schips([seg(p,.38,.44),seg(p,.44,.5),seg(p,.5,.56)])+goalTag(G3,{g:seg(p,.03,.15)}),
 // 16. 「平行」の札。小問1の直角の印に ×
 [K+'par']:(p,ctx)=>{
  const [a]=win(ctx,1,.55);
  let s=side()+schips();
  s+=card(372,170,112,54,label('平行',428,207,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.25,.35),C.hi);
  s+=rightInset(seg(p,a,a+.08),seg(p,a+.12,a+.2));
  return s+goalTag(G3);
 },
 // 17. 力の矢印が出ないまま「0 N」。答えの札
 [K+'zero']:(p,ctx)=>{
  const [a]=win(ctx,0,0),ans=wAt(ctx,'こたえは',.7);
  let s=side()+schips();
  s+=card(372,170,112,54,label('平行',428,207,{size:30,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=card(720,330,300,120,label('力',800,408,{size:30,color:WH,anchor:'middle',weight:700})+label('0 N',900,410,{size:48,color:FC,anchor:'middle',weight:700}),seg(p,a+.35,a+.45),FC);
  return s+goalTag(G3)+A3(seg(p,ans,ans+.08));
 },
 // 18. 誤答 A：直角の条件を落とした。F＝BIl の条件を赤の枠
 [K+'wrongA3']:(p,ctx)=>{
  const f=wAt(ctx,'ちょっかくの',.4);
  let s=lawCard(1,{x:300,w:600,y:100,h:90,tag:0,center:1,frame:seg(p,f,f+.06),frameCol:BAD});
  s+=wrongCard('A','0.20 N','直角の条件を落とした',{y:240,g:seg(p,.02,.08)});
  return s+goalTag(G3)+A3(1);
 },
 // 19. 誤答 B（半分）→ 誤答 D（強め合う）。1枚ずつ
 [K+'wrongBD3']:(p,ctx)=>{
  const d=wAt(ctx,'ディーは',.5);
  let s=lawCard(.6,{x:300,w:600,y:100,h:90,tag:0,center:1});
  s+=wrongSeq(p,ctx,[['B','0.10 N','半分ではない'],['D','0.40 N','平行なら 0']],{win:[[0,d],[d,1]],opts:{y:240}});
  return s+goalTag(G3)+A3(1);
 },
 // 20. 直角の図と平行の図を左右に並べる
 [K+'compare']:(p)=>pair({labs:seg(p,.1,.25)}),
 // 21. 右向きの 𝐅 と「F＝BIl＝0.20 N（直角）」、平行の図と「0 N」→ 声の後に答えの札を並べる
 [K+'summary']:(p,ctx)=>{
  const ve=voiceEnd(ctx),f=wAt(ctx,'むきは',.4),z=wAt(ctx,'へーこう',.7);
  let s=pair({form:seg(p,.04,.14),F:seg(p,f,f+.08),zero:seg(p,z,z+.08)});
  s+=answerRow([[1,'B','0.20 N'],[2,'D','右向き'],[3,'C','0 N']],{g:seg(p,ve,ve+.06)});
  return s;
 },
};
export const qxHsEMagnet2Diagrams=Object.fromEntries(Object.entries(D0).map(([k,f])=>[k,(p,ctx)=>fixLI(f(p,ctx))]));
