// 問題編 解説「下へ動く正電荷」（q-ui-magnetic-force、大学編 25 ローレンツ力・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/25_ローレンツ力.md の q-ui-magnetic-force（解説 20 行）。
// 画面：左に図（⊗ の磁場と電荷）、右に説明の枠。式の場面（行3〜6）は図を消して式だけ。札の帯（y＜78）には図を描かない。
// 色（単元動画 ys-ui-magnetic-force-1 と同じ）：𝐯 紫、𝐁 橙、𝐅 緑、正電荷 赤、電子 青、q 桃、強調 黄、仕事率 橙。
// 記号の描き方（⊗・電荷・弧の矢印）は単元動画の図（yt1-ui-magnetic-force-1-diagrams.mjs）を写して使う（あちらは編集しない）。
// 向き（画面の x 右・y 上・z 手前）：𝐯＝−ŷ、𝐁＝−ẑ → (−ŷ)×(−ẑ)＝x̂（右）。𝐯 右なら x̂×(−ẑ)＝ŷ（上）→ 正電荷は反時計回り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,voiceEnd,sentWin,cueT,tAt} from './yt1-qx-common.mjs';

const K='qx-ui-magnetic-force:';
const CV=C.v,CB=C.E,CF=C.F,POS=C.a,NEG='#7fb3ff',CQ=C.p,HI=C.hi,CU=C.E;
const PI=Math.PI;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const vV=cs(CV,'\\mathbf{v}'),vB=cs(CB,'\\mathbf{B}'),vF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q');
const LAW=`${vF}=${qq}\\,${vV}\\times${vB}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='磁場の強さ B',G2='力の向き',G3='動きの正しい説明';
const ANS1=g=>answerTag(1,'C','2 T',{g}),ANS2=g=>answerTag(2,'A','右向き',{g}),ANS3=g=>answerTag(3,'C','向きだけが変わる',{g});
// 読みの中で sub が始まる所（cue の進み 0〜1）
function wAt(ctx,sub,def=.5){const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(sub.replace(/\s/g,''));return (i<0||!r.length)?def:i/r.length*voiceEnd(ctx);}

// ---- 記号（単元動画から写した） ----
function inSym(x,y,r=22,color=CB,w=4){const d=r*.62;return ring(x,y,r,{color,w,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w});}
function outSym(x,y,r=22,color=CF,w=4){return ring(x,y,r,{color,w,fill:'#10182c'})+dot(x,y,r*.28,color);}
function charge(x,y,sign=1,r=20,g=1){const c=sign>0?POS:NEG;return fade(g,ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.38,{size:Math.max(22,r*1.1),color:c,anchor:'middle',weight:700}));}
// ⊗ の並ぶ磁場。n（0〜1）で左上から順に現れる
function field(x0,y0,x1,y1,{step=90,r=11,g=1,n=1,op=.55}={}){
 let s='',i=0;const cols=Math.floor((x1-x0)/step)+1,rows=Math.floor((y1-y0)/step)+1,tot=cols+rows-1;
 for(let a=0;a<cols;a++)for(let b=0;b<rows;b++){const k=(a+b)/tot,gg=clamp((n*1.15-k)*6);if(gg>0)s+=fade(gg,inSym(x0+a*step,y0+b*step,r,CB,2));i++;}
 return fade(g*op,s);
}
function rightMark(x,y,a,b,s=14,color=HI,w=3){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w});}
function arc2(pts,{c1=CV,c2=CB,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arcArrow(cx,cy,r,a0,a1,color,w=4,g=1){
 const pts=circPts(cx,cy,r,a0,a1,40),[x1,y1]=pts[38],[x2,y2]=pts[40];
 return fade(g,draw(pts.slice(0,39),1,{color,w})+arrow(x1,y1,x2,y2,{color,w,head:16}));
}
// 数の札（glow で黄の縁）
function tagBox(t,x,y,color,{g=1,glow=0,size=26,anchor='start'}={}){
 const w=t.length?[...t].reduce((a,ch)=>a+(/[ -~]/.test(ch)?(ch===' '?.34:.64):1.02),0)*size+24:0,h=size+16;
 const x0=anchor==='middle'?x-w/2:x;
 return fade(g,rect(x0,y-h/2,w,h,{fill:'#10182c',fo:.92,stroke:glow>0.02?HI:color,sw:2+2*glow,rx:8})+(glow>0.02?rect(x0,y-h/2,w,h,{fill:HI,fo:.18*glow,stroke:'none',rx:8}):'')
  +label(t,x0+12,y+size*.36,{size,color,weight:700}));
}
const vlab=(s,x,y,color,size=30)=>T(`\\mathbf{${s}}`,x,y,size+4,{color});

// ---- 前半の図（左） ----
function frontHalf({g=1,cx=205,cy=265,syms=0,glows=[0,0,0],tags=1,fieldN=1}={}){
 let s=field(70,130,610,470,{n:fieldN});
 s+=arrow(cx+22,cy,cx+200,cy,{color:CV,w:6})+charge(cx,cy,1,22);
 const t=[syms?'q ＝ 3 C':'3 C',syms?'v ＝ 4 m/s':'4 m/s',syms?'F ＝ 24 N':'24 N'];
 s+=tagBox(t[0],cx-80,cy+62,CQ,{glow:glows[0],g:tags});
 s+=tagBox(t[1],cx+70,cy-48,CV,{glow:glows[1],g:tags});
 s+=tagBox(t[2],cx+40,cy+150,CF,{glow:glows[2],g:tags});
 s+=fade(tags,label('（受けた 力の 大きさ）',cx+40,cy+200,{size:22,color:C.dim}));
 return fade(g,s);
}
const BLEG=(x=70,y=110,g=1)=>fade(g,label('𝐁：奥向き（⊗）',x,y,{size:24,color:CB,weight:700}));

// ---- 回す図（小問2） ----
// a＝時計回りの角（0〜π/2）。𝐯（右）・𝐅（上）を一緒に回す。⊗ は背景の磁場。
function rotFig(a,{cx=300,cy=300,g=1,glowF=0,glowB=0,arc=0}={}){
 const rot=([dx,dy])=>[dx*Math.cos(a)-dy*Math.sin(a),dx*Math.sin(a)+dy*Math.cos(a)];
 const v=rot([1,0]),f=rot([0,-1]);
 let s='';
 const pos=[[160,160],[440,160],[160,440],[440,440],[300,120],[120,300],[500,390],[400,480]];
 for(const [x,y] of pos)s+=fade(.6,inSym(x,y,13,CB,2.5))+(glowB?fade(glowB,ring(x,y,22,{color:HI,w:3})):'');
 if(arc)s+=fade(arc,arcArrow(cx,cy,175,PI*.35,PI*.35-PI/2*clamp(a/(PI/2)),HI,4));
 s+=arrow(cx,cy,cx+v[0]*150,cy+v[1]*150,{color:CV,w:6})+vlab('v',cx+v[0]*150+(v[0]>.5?14:22),cy+v[1]*150+(v[1]>.5?28:10),CV);
 s+=(glowF?fade(glowF,line(cx,cy,cx+f[0]*125,cy+f[1]*125,{color:HI,w:16,opacity:.35})):'')
  +arrow(cx,cy,cx+f[0]*125,cy+f[1]*125,{color:CF,w:6})+vlab('F',cx+f[0]*125+(f[0]>.5?10:20),cy+f[1]*125+(f[1]<-.5?-6:-18),CF);
 s+=charge(cx,cy,1,20);
 return fade(g,s);
}

// ---- 右ねじ（小問2・行10） ----
// 電荷の位置から右へ伸びるねじ。𝐯（下）から 𝐁（奥：右上に斜めに描く）へ回す弧。adv：右へ進む量
function screwFig({cx=200,cy=300,arcG=1,adv=0,screwG=1,fG=0,g=1}={}){
 let s='';
 for(const [x,y] of [[110,150],[330,150],[550,150],[110,450],[330,450],[550,450]])s+=fade(.5,inSym(x,y,12,CB,2));
 s+=BLEG(70,110);
 // 𝐯 下
 s+=arrow(cx,cy,cx,cy+140,{color:CV,w:6})+vlab('v',cx-34,cy+140,CV);
 // 回す弧：P(φ)＝r(0,−cosφ,−sinφ)。画面：下へ r cosφ、奥（−z）を右上 (0.6,−0.45) に
 const r=95,pts=Array.from({length:31},(_,i)=>{const ph=PI/2*i/30;return [cx+r*.6*Math.sin(ph),cy+r*Math.cos(ph)-r*.45*Math.sin(ph)];});
 s+=fade(arcG*.6,draw(Array.from({length:61},(_,i)=>{const ph=2*PI*i/60;return [cx+r*.6*Math.sin(ph),cy+r*Math.cos(ph)-r*.45*Math.sin(ph)];}),1,{color:C.faint,w:2,dash:'6 7'}));
 s+=arc2(pts,{g:arcG});
 const [bx,by]=pts[30];
 s+=fade(arcG,inSym(bx+20,by-22,16,CB,3)+label('𝐁（奥）',bx+20,by-50,{size:24,color:CB,anchor:'middle',weight:700}));
 // ねじ（横から見た図）
 const x0=cx+30+adv,y0=cy;
 let sc=rect(x0,y0-30,28,60,{fill:'#46526e',fo:1,stroke:C.ink,sw:2.5,rx:5})+rect(x0+28,y0-13,200,26,{fill:'#5a6680',fo:1,stroke:C.ink,sw:2,rx:3});
 for(let k=0;k<10;k++){const xx=x0+38+k*19;sc+=line(xx,y0+13,xx+9,y0-13,{color:C.ink,w:1.8});}
 sc+=`<polygon points="${x0+228},${y0-13} ${x0+256},${y0} ${x0+228},${y0+13}" fill="#5a6680" stroke="${C.ink}" stroke-width="2"/>`;
 s+=fade(screwG*.95,sc);
 s+=charge(cx,cy,1,20);
 s+=fade(fG,arrow(x0+60,y0+62,x0+290,y0+62,{color:CF,w:7})+vlab('F',x0+302,y0+72,CF));
 return fade(g,s);
}

// ---- 円運動（小問3） ----
const CI={cx:300,cy:320,R:140};
// φ：円の上の角（数学の向き）。反時計回り。
function onC(phi){const x=CI.cx+CI.R*Math.cos(phi),y=CI.cy-CI.R*Math.sin(phi);return {x,y,v:[-Math.sin(phi),-Math.cos(phi)],f:[-Math.cos(phi),Math.sin(phi)]};}
function circleFig(phi,{trail=0,path=0,vf=1,mark=1,glowF=0,speed=0,g=1,p0=-PI/2}={}){
 let s=field(80,160,560,480,{step:80});
 if(path)s+=fade(path,draw(circPts(CI.cx,CI.cy,CI.R,0,2*PI,90),1,{color:C.dim,w:2.5,dash:'8 8'}));
 if(trail>0)s+=draw(circPts(CI.cx,CI.cy,CI.R,p0,p0+trail,Math.max(4,Math.round(trail*30))),1,{color:HI,w:3,opacity:.7});
 const o=onC(phi);
 if(vf){
  s+=arrow(o.x,o.y,o.x+o.v[0]*100,o.y+o.v[1]*100,{color:CV,w:6})+vlab('v',o.x+o.v[0]*118-8,o.y+o.v[1]*118+10,CV,26);
  if(glowF)s+=fade(glowF,line(o.x,o.y,o.x+o.f[0]*85,o.y+o.f[1]*85,{color:HI,w:16,opacity:.4}));
  s+=arrow(o.x,o.y,o.x+o.f[0]*85,o.y+o.f[1]*85,{color:CF,w:6})+vlab('F',o.x+o.f[0]*100-8,o.y+o.f[1]*100+10,CF,26);
  if(mark)s+=fade(mark,rightMark(o.x,o.y,o.v,o.f,16));
 }
 s+=charge(o.x,o.y,1,16);
 if(speed)s+=fade(speed,tagBox('速さ 4 m/s',90,495,CV,{size:24}));
 return fade(g,s);
}
function gauge(x,y,{g=1}={}){
 const r=70;let s=draw(circPts(x,y,r,PI,0,40),1,{color:CU,w:4});
 for(const a of [PI,PI*.75,PI/2,PI/4,0])s+=line(x+r*.82*Math.cos(a),y-r*.82*Math.sin(a),x+r*Math.cos(a),y-r*Math.sin(a),{color:CU,w:3});
 s+=label('−',x-r-14,y+8,{size:26,color:C.dim,anchor:'end'})+label('＋',x+r+14,y+8,{size:26,color:C.dim})+label('0',x,y-r-12,{size:24,color:CU,anchor:'middle',weight:700});
 s+=line(x,y,x,y-r*.85,{color:HI,w:5})+dot(x,y,7,HI);
 return fade(g,s);
}

// ---- 式の場面（小問1） ----
const BDEF=`${cs(CB,'B')}=\\dfrac{${cs(CF,'F')}}{${qq}\\,${cs(CV,'v')}}`;
function calcScene({n=4,u=[0,0,0,0],hiCs=0,ans=0}={}){
 // n：分数に入れた数の個数（1:24 2:3 3:4 4:＝2）。u：単位の行の段階
 let s=card(40,86,1120,420,'',1);
 const x0=170;
 s+=label('数',90,190,{size:26,color:C.dim,anchor:'middle'});
 s+=T(BDEF,x0,185,44,{anchor:'start'});
 const wD=texWidth(BDEF,44,false);
 const nums=[n>=1?'24':'\\phantom{24}',n>=2?'3':'\\phantom{3}',n>=3?'4':'\\phantom{4}'];
 const fr=`=\\dfrac{${nums[0]}}{${nums[1]}\\times${nums[2]}}`;
 s+=T(fr,x0+wD+14,185,44,{anchor:'start'});
 const wF=texWidth(`=\\dfrac{24}{3\\times4}`,44,false);
 if(n>=4)s+=T(ans?'=2\\,\\mathrm{T}':'=2',x0+wD+wF+28,185,48,{anchor:'start',color:ans?HI:C.ink});
 if(ans)s+=highlight(x0+wD+wF+20,140,170,90,ans,HI);
 s+=line(80,265,1120,265,{color:C.faint,w:2});
 s+=label('単位',90,370,{size:26,color:C.dim,anchor:'middle'});
 const hc=c=>hiCs>.5?cs(HI,c):c;
 const parts=[`\\dfrac{\\mathrm{N}}{\\mathrm{${hc('C')}}\\cdot\\mathrm{m}/\\mathrm{${hc('s')}}}`,`=\\dfrac{\\mathrm{N}}{\\mathrm{A}\\cdot\\mathrm{m}}`,`=\\mathrm{T}`];
 let xx=x0;
 parts.forEach((q,i)=>{const w=texWidth(q,44,false);s+=fade(u[i===0?0:i===1?2:3],T(q,xx,365,44,{anchor:'start',color:i===2?CB:C.ink}));xx+=w+18;});
 s+=fade(u[1],tagBox('C/s ＝ A（1 秒あたりの 電荷 ＝ 電流）',700,460,HI,{size:26,anchor:'middle',glow:hiCs}));
 return s;
}

export const ytQxUiMagneticForceDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 秒）：0〜2 s ⊗ が左上から並ぶ・右下に「𝐁：奥向き（⊗）」、2〜4 s 前半の電荷と札、4〜6 s 後半の電荷（下向き）。静止。
 [K+'q1']:(p)=>{
  let s=field(70,40,1130,400,{n:seg(p,0,.33)+.0001,step:90});
  s+=fade(seg(p,.25,.33),label('𝐁：奥向き（⊗）',1130,500,{size:28,color:CB,anchor:'end',weight:700}));
  s+=fade(seg(p,.3,.36),line(600,30,600,420,{color:C.faint,w:2,dash:'8 8'})+label('前半',300,455,{size:28,color:C.dim,anchor:'middle',weight:700})+label('後半',900,455,{size:28,color:C.dim,anchor:'middle',weight:700}));
  const g1=seg(p,.34,.42);
  s+=fade(g1,arrow(137,175,320,175,{color:CV,w:6})+charge(115,175,1,22));
  s+=tagBox('3 C',60,240,CQ,{g:seg(p,.42,.5)});
  s+=tagBox('4 m/s',200,128,CV,{g:seg(p,.5,.58)});
  s+=tagBox('24 N（受けた 力の 大きさ）',150,330,CF,{g:seg(p,.58,.66)});
  const g2=seg(p,.7,.82);
  s+=fade(g2,arrow(925,107,925,290,{color:CV,w:6})+charge(925,85,1,22)+tagBox('正の 電荷',965,100,POS));
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p,ctx)=>{
  const a=wAt(ctx,'さんクーロン',.3),b=wAt(ctx,'びょうそく',.4),c=wAt(ctx,'にじゅうよん',.5),e=wAt(ctx,'から',.6);
  const gl=(w,x)=>seg(p,w,w+.04)*(1-seg(p,x,x+.04));
  let s=frontHalf({glows:[gl(a,b),gl(b,c),gl(c,e)]})+BLEG();
  s+=panel(110,250,label('小問1',PC,160,{size:28,color:C.dim,anchor:'middle'})+label('この 場所の',PC,225,{size:30,color:C.ink,anchor:'middle'})
   +label('磁場の 強さ B は？',PC,285,{size:32,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI);
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'def']:(p,ctx)=>{
  const a=wAt(ctx,'いちクーロン',.25),d=wAt(ctx,'わります',.8);
  let s=frontHalf({syms:1})+BLEG();
  const fw=texWidth(BDEF,52,false),wB=texWidth(`${cs(CB,'B')}=`,52,false);
  s+=panel(90,420,kindTag('定義',PC,135,{g:seg(p,.03,.1)})
   +fade(seg(p,.05,.14),T(BDEF,PC,232,52))
   +highlight(PC-fw/2+wB-4,231,fw-wB+10,58,seg(p,d,d+.05),HI)
   +fade(seg(p,a,a+.06),line(PX+30,315,PX+PW-30,300,{color:C.faint,w:2})+arrow(PX+90,360,PX+165,360,{color:CV,w:5,head:14})+charge(PX+70,360,1,15)
    +label('1 C・1 m/s（直角）',PX+190,370,{size:26,color:C.ink,weight:700})
    +label('→ 受ける 力の 大きさ ＝ B',PC,450,{size:28,color:HI,anchor:'middle',weight:700})),1,C.faint);
  s+=goalTag(G1);
  return s;
 },
 [K+'calc']:(p,ctx)=>{
  const a=wAt(ctx,'さんかける',.12),b=wAt(ctx,'よんイコール',.2),c=wAt(ctx,'イコールに',.25),d=wAt(ctx,'クーロンパー',.38),e=wAt(ctx,'アンペアなので',.52),f=wAt(ctx,'たんいは',.6),h=wAt(ctx,'つまり',.85);
  const n=p<a?1:p<b?2:p<c?3:4;
  return calcScene({n,u:[seg(p,d-.03,d),seg(p,d,d+.04),seg(p,f,f+.05),seg(p,h,h+.05)],hiCs:seg(p,d,d+.04)})+goalTag(G1);
 },
 [K+'ans1']:(p)=>calcScene({n:4,u:[1,1,1,1],ans:seg(p,.1,.25)})+goalTag(G1)+ANS1(seg(p,.05,.15)),
 [K+'wrongA']:(p,ctx)=>{
  const d=wAt(ctx,'じばを',.5),hi=seg(p,d,d+.06);
  let s=card(80,96,1040,220,'',1);
  s+=label('磁場の 単位',340,150,{size:26,color:C.dim,anchor:'middle'})+label('力の 単位',860,150,{size:26,color:C.dim,anchor:'middle'});
  const L=`\\mathrm{N}${hi>.5?cs(HI,'/(\\mathrm{A}\\cdot\\mathrm{m})'):'/(\\mathrm{A}\\cdot\\mathrm{m})'}=\\mathrm{T}`;
  s+=T(L,340,245,52)+T('\\mathrm{N}',860,245,52);
  {const wL=texWidth(L,52,false),wN=texWidth('\\mathrm{N}',52,false),wP=texWidth('/(\\mathrm{A}\\cdot\\mathrm{m})',52,false),x0=340-wL/2+wN;
   s+=highlight(x0-6,205,wP+12,72,hi,HI);}
  s+=line(600,130,600,290,{color:C.faint,w:2});
  s+=wrongCard('A','2 N','磁場を 力の 単位 N で 書いた（磁場の 単位は T）',{y:345,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 [K+'wrongBD']:(p,ctx)=>{
  const d=wAt(ctx,'ディーの',.5);
  let s=card(330,96,540,150,T(BDEF,600,175,48),1);
  s+=wrongSeq(p,ctx,[['B','288 T','24×3×4 と 掛けた（単位 N·C·m/s）',{mid:'24\\times3\\times4=288'}],['D','0.5 T','(3×4)÷24 と 逆に 割った（単位 A·m/N）',{mid:'(3\\times4)\\div24=0.5'}]],{win:[[0,d],[d,1]],opts:{y:270}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=field(70,130,610,470,{n:seg(p,0,.2)});
  s+=BLEG();
  s+=fade(seg(p,.1,.25),arrow(330,170,330,370,{color:CV,w:6})+vlab('v',300,360,CV)+charge(330,150,1,22));
  s+=panel(110,280,label('小問2',PC,160,{size:28,color:C.dim,anchor:'middle'})
   +label('𝐯：下',PC,225,{size:30,color:CV,anchor:'middle',weight:700})+label('𝐁：奥（⊗）',PC,280,{size:30,color:CB,anchor:'middle',weight:700})
   +label('正の 電荷の 力の 向きは？',PC,350,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'rotate']:(p,ctx)=>{
  const a=wAt(ctx,'とけいまわり',.55);
  const ang=PI/2*seg(p,a,Math.min(.97,a+.3));
  let s=rotFig(ang,{arc:seg(p,a-.03,a)});
  s+=label('単元動画の 図',300,110,{size:24,color:C.dim,anchor:'middle'});
  s+=panel(110,300,label('単元動画：',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +label('𝐯 右・𝐁 奥 → 𝐅 上',PC,215,{size:30,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,a,a+.06),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('時計回りに 90° 回す',PC,300,{size:30,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,a+.25,a+.3),label('𝐯 が 下 を 向く',PC,360,{size:30,color:CV,anchor:'middle',weight:700})),seg(p,.03,.15));
  s+=goalTag(G2);
  return s;
 },
 [K+'rotated']:(p,ctx)=>{
  const r=wAt(ctx,'みぎむき',.75);
  let s=rotFig(PI/2,{glowB:seg(p,.05,.12)*(1-seg(p,.4,.46)),glowF:seg(p,r,r+.05)});
  s+=panel(110,300,label('回した 後',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.05,.12),label('𝐁：⊗ の まま',PC,230,{size:30,color:CB,anchor:'middle',weight:700}))
   +fade(seg(p,r,r+.05),label('𝐅：上 → 右',PC,310,{size:32,color:CF,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'screw']:(p,ctx)=>{
  const a=seg(p,.05,.35),adv=70*seg(p,.4,.75);
  let s=screwFig({arcG:a,adv,fG:seg(p,.72,.85)});
  s+=panel(110,300,label('𝐯（下）→ 𝐁（奥）へ 回す',PC,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.4,.5),label('右ねじは 右へ 進む',PC,250,{size:30,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,.72,.85),label('𝐅：右',PC,330,{size:32,color:CF,anchor:'middle',weight:700})),seg(p,.02,.12));
  s+=goalTag(G2);
  return s;
 },
 [K+'ans2']:(p)=>{
  let s=screwFig({adv:70,fG:1});
  s+=panel(110,300,label('𝐯（下）→ 𝐁（奥）へ 回す',PC,170,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('右ねじは 右へ 進む',PC,250,{size:30,color:HI,anchor:'middle',weight:700})+label('𝐅：右',PC,330,{size:32,color:CF,anchor:'middle',weight:700}),1);
  s+=goalTag(G2)+ANS2(seg(p,.05,.15));
  return s;
 },
 [K+'wrongBC']:(p,ctx)=>{
  const c=wAt(ctx,'スィーの',.5);
  let s=BLEG(70,110);
  const pair=(cx,sign,txt,dir)=>arrow(cx,150,cx,290,{color:CV,w:6})+arrow(cx+24,150,cx+24+dir*120,150,{color:CF,w:6})+charge(cx,150,sign,20)+label(txt,cx,330,{size:26,color:sign>0?POS:NEG,anchor:'middle',weight:700});
  s+=pair(330,1,'正の 電荷',1)+fade(seg(p,.05,.15),pair(820,-1,'電子',-1));
  s+=wrongSeq(p,ctx,[['B','左向き','負の 電荷の 向きと 取り違えた'],['C','上向き','速度と 逆向き（ブレーキ）と 考えた']],{win:[[0,c],[c,1]],opts:{y:360}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 [K+'wrongD']:(p,ctx)=>{
  const k=seg(p,.35,.5),kk=seg(p,.55,.7);
  let s=BLEG(70,110);
  for(const [x,y] of [[200,160],[800,160],[200,300],[800,300]])s+=fade(.5,inSym(x,y,12,CB,2));
  s+=arrow(500,150,500,300,{color:CV,w:6})+vlab('v',470,300,CV);
  s+=fade(k*(1-kk),draw([[476,150],[330,150]],1,{color:CF,w:4,dash:'10 8'}));
  s+=fade(k,draw([[524,150],[690,150]],1,{color:CF,w:4,dash:'10 8'}))+fade(kk,arrow(524,150,690,150,{color:CF,w:7})+vlab('F',704,160,CF));
  s+=charge(500,150,1,20);
  s+=fade(k,label('𝐯 にも 𝐁 にも 直角 ＝ 画面の 中の 左右',600,345,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=wrongCard('D','手前向き（⊙）','力は 𝐁 とも 直角で、画面の 中を 向く',{y:375,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=field(80,160,560,480,{n:seg(p,0,.2),step:80});
  const o=onC(-PI/2);
  s+=fade(seg(p,.1,.25),arrow(o.x,o.y,o.x+100,o.y,{color:CV,w:6})+vlab('v',o.x+110,o.y+10,CV,26)+charge(o.x,o.y,1,16));
  s+=BLEG(80,110);
  s+=panel(110,280,label('小問3',PC,160,{size:28,color:C.dim,anchor:'middle'})
   +label('磁場の 力 だけを 受ける 電荷',PC,225,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('動きの 正しい 説明は？',PC,300,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'work']:(p,ctx)=>{
  const tr=PI*.9*seg(p,.05,.95),phi=-PI/2+tr;
  let s=circleFig(phi,{trail:tr,mark:.6+.4*Math.abs(Math.sin(cueT(ctx)*4))});
  s+=BLEG(80,110);
  s+=panel(100,400,label('どの 瞬間も',PC,150,{size:26,color:C.dim,anchor:'middle'})
   +T(`${vF}\\cdot${vV}\\,\\Delta t=0`,PC,215,44)
   +fade(seg(p,.3,.45),label('仕事率 𝐅·𝐯',PC,300,{size:28,color:CU,anchor:'middle',weight:700})+gauge(PC,420)),seg(p,.02,.12));
  s+=goalTag(G3);
  return s;
 },
 [K+'circle']:(p,ctx)=>{
  const t0=-PI/2+PI*.9,phi=t0+2*PI*seg(p,.05,.9);
  let s=circleFig(phi,{trail:Math.min(2*PI,phi-(-PI/2)),path:seg(p,.6,.8),speed:1});
  s+=BLEG(80,110);
  s+=panel(100,380,label('運動エネルギー 一定',PC,160,{size:28,color:CU,anchor:'middle',weight:700})
   +fade(seg(p,.2,.3),label('→ 速さ 一定',PC,225,{size:28,color:CV,anchor:'middle',weight:700}))
   +fade(seg(p,.4,.5),label('力は 向きだけを 変え続ける',PC,300,{size:28,color:CF,anchor:'middle',weight:700}))
   +fade(seg(p,.6,.7),label('→ 円を 描く',PC,380,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,.02,.12));
  s+=goalTag(G3);
  return s;
 },
 [K+'ans3']:(p)=>{
  let s=circleFig(-PI/2+PI*.9+2*PI,{trail:2*PI,path:1,speed:1})+BLEG(80,110);
  s+=panel(100,300,label('力 ⟂ 速度',PC,160,{size:30,color:C.ink,anchor:'middle',weight:700})+label('→ 仕事 0',PC,230,{size:30,color:CU,anchor:'middle',weight:700})
   +label('→ 向きだけが 変わる',PC,300,{size:30,color:HI,anchor:'middle',weight:700}),1,HI);
  s+=goalTag(G3)+ANS3(seg(p,.05,.15));
  return s;
 },
 [K+'wrongAD']:(p,ctx)=>{
  const d=wAt(ctx,'ディーは',.5);
  let s=circleFig(PI/4,{path:1})+BLEG(80,110);
  s+=wrongSeq(p,ctx,[['A','速さが 増える','力と 速度が 直角な ことを 見ていない'],['D','仕事が 正','力の 向きを 速度の 向きと 取り違えた']],{win:[[0,d],[d,1]],opts:{...WOPT,y:200}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'wrongB3']:(p,ctx)=>{
  const blink=.5+.5*Math.sin(cueT(ctx)*5);
  let s=circleFig(PI/4,{path:1,glowF:seg(p,.3,.4)*blink})+BLEG(80,110);
  s+=wrongCard('B','力ははたらいていない',['速さは 一定でも、','力は 向きを 変え続けている'],{...WOPT,y:200,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const b=wAt(ctx,'ブイクロス',.3),c=wAt(ctx,'あわせて',.55);
  let s=card(100,110,480,120,label('大きさ',340,155,{size:26,color:C.dim,anchor:'middle'})+T(`${qq}\\,${cs(CV,'v')}\\,${cs(CB,'B')}`,340,205,40),seg(p,.02,.1));
  s+=card(620,110,480,120,label('向き',860,155,{size:26,color:C.dim,anchor:'middle'})+label('𝐯 → 𝐁 の 右ねじ',860,208,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,b,b+.06));
  s+=fade(seg(p,c,c+.06),kindTag('法則',600,300)+T(LAW,600,395,64));
  const w=texWidth(LAW,64,false);
  s+=highlight(600-w/2-20,345,w+40,95,seg(p,c+.1,c+.18),HI);
  s+=answerRow([[1,'C','2 T'],[2,'A','右向き'],[3,'C','']],{g:seg(p,.7,.8)});
  return s;
 },
};
