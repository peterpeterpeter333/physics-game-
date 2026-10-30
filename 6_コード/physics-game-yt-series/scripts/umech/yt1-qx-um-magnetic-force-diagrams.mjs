// 問題編 解説「−2 C と電子の円」（q-um-magnetic-force、大学編 25 ローレンツ力・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/25_ローレンツ力.md の q-um-magnetic-force（解説 20 行）。
// 画面：左に図（斜めから見た3つの軸／正面から見た ⊗ の磁場と電子の円）、右に説明の枠。式の場面は図を消して式だけ。札の帯（y＜78）には図を描かない。
// 斜投影は単元動画（yt1-um-magnetic-force-1-diagrams.mjs）と同じ：x 右、y 奥（右上へ斜め）、z 上。あちらは編集しない（写して使う）。
// 色：𝐯 紫、𝐁 橙、𝐅 緑、𝐯×𝐁 桃、q 桃、電子 青、正電荷 赤、半径 r 水色、周期 T・時計 金、x̂ 水色、ŷ 紫、ẑ 金、強調 黄、負号 赤。
// 向き：x̂×ŷ＝ẑ（上）。q＝−2 → 下。正面図（x 右・z 上・𝐁 奥）：電子は上の点から右へ → 時計回り。正電荷は反時計回り。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,voiceEnd,cueT,tAt} from './yt1-qx-common.mjs';

const K='qx-um-magnetic-force:';
const CV=C.v,CB=C.E,CF=C.F,CX=C.p,CQ=C.p,PO=C.a,EL='#7fb3ff',CR=C.x,CT=C.t,HI=C.hi,HX=C.x,HY=C.v,HZ=C.t,NG='#ff6b6b';
const PI=Math.PI,RAD=PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),qq=cs(CQ,'q');
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const LAW=`${bF}=${qq}\\,${bv}\\times${bB}`;
const sv=cs(CV,'v'),sB=cs(CB,'B'),sr=cs(CR,'r'),sT=cs(CT,'T'),aq=`|${qq}|`;
const RFORM=`${sr}=\\dfrac{m${sv}}{${aq}${sB}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='力 𝐅（向きと大きさ）',G2='円の半径 r',G3='半径と1周の時間';
const ANS1=g=>answerTag(1,'B','下向き 4 N',{g}),ANS2=g=>answerTag(2,'D','1.1×10⁻² m',{g}),ANS3=g=>answerTag(3,'A','半径 2倍、時間 同じ',{g});
function wAt(ctx,sub,def=.5){const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(sub.replace(/\s/g,''));return (i<0||!r.length)?def:i/r.length*voiceEnd(ctx);}
const tw=(t,size)=>[...t].reduce((a,ch)=>a+(ch===' '?.34:/[ -~]/.test(ch)?.64:/[⁰-⁹⁻]/.test(ch)?.5:1.02),0)*size;
function tagBox(t,x,y,color,{g=1,glow=0,size=26,anchor='start'}={}){
 const w=tw(t,size)+24,h=size+16,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return fade(g,rect(x0,y-h/2,w,h,{fill:'#10182c',fo:.92,stroke:glow>0.02?HI:color,sw:2+2*glow,rx:8})+label(t,x0+12,y+size*.36,{size,color,weight:700}));
}
function inSym(x,y,r=11,color=CB,w=2){const d=r*.62;return ring(x,y,r,{color,w,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w});}
function field(x0,y0,x1,y1,{step=80,g=1,n=1}={}){let s='';const cols=Math.floor((x1-x0)/step)+1,rows=Math.floor((y1-y0)/step)+1,tot=cols+rows-1;
 for(let a=0;a<cols;a++)for(let b=0;b<rows;b++){const gg=clamp((n*1.15-(a+b)/tot)*6);if(gg>0)s+=fade(gg,inSym(x0+a*step,y0+b*step));}return fade(g*.5,s);}
function charge(x,y,sign=1,r=18,{color}={}){const c=color??(sign>0?PO:EL);return ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.4,{size:Math.max(22,r*1.15),color:c,anchor:'middle',weight:700});}
function rightMark(x,y,a,b,s=14,color=HI,w=3){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w});}
const circPts=(cx,cy,r,a0,a1,n=60)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arcArrow(cx,cy,r,a0,a1,color,w=4,g=1){const pts=circPts(cx,cy,r,a0,a1,40),[x1,y1]=pts[38],[x2,y2]=pts[40];return fade(g,draw(pts.slice(0,39),1,{color,w})+arrow(x1,y1,x2,y2,{color,w,head:14}));}

// ---- 斜投影（単元動画と同じ） ----
const KY=.55,AY=32*RAD;
const view=({ox,oy,u})=>(x,y,z)=>[ox+u*(x+KY*Math.cos(AY)*y),oy-u*(z+KY*Math.sin(AY)*y)];
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{g=1,xl=2.2,yl=2.6,zl=1.6,zn=1.6}={}){
 let s=L3(P,[-.4,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-.5,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:HX,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:HY,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:HZ,w:2.5,head:13});
 const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
 s+=label('x̂（右）',X[0]+8,X[1]+30,{size:24,color:HX,weight:700})+label('ŷ（奥）',Y[0]+12,Y[1]+4,{size:24,color:HY,weight:700})+label('ẑ（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});
 return fade(g,s);
}
const P1=view({ox:200,oy:300,u:115});
// 前半の図：軸、𝐯（x）、𝐁（y）、電荷 q＝−2 C。gX：𝐯×𝐁（上、桃）、gF：𝐅（下、緑）
function scene3({gA=1,gv=1,gB=1,gq=1,gX=0,gF=0,flip=0,tags=1,arcG=0,P=P1}={}){
 let s=axes3(P,{g:gA});
 for(const [x,z] of [[-.3,1.1],[-.3,-1.1],[2.0,-1.1]])s+=fade(gB*.5,V3(P,[x,-.3,z],[x,1.7,z],{color:CB,w:3,head:11}));
 s+=V3(P,[0,0,0],[0,1.6,0],{color:CB,w:7,head:20,g:gB});
 s+=V3(P,[0,0,0],[1.6,0,0],{color:CV,w:7,head:20,g:gv});
 if(arcG){const pts=Array.from({length:25},(_,i)=>{const a=PI/2*i/24;return P(.6*Math.cos(a),.6*Math.sin(a)/0.75,0);});s+=fade(arcG,draw(pts.slice(0,23),1,{color:HI,w:4})+arrow(pts[22][0],pts[22][1],pts[24][0],pts[24][1],{color:HI,w:4,head:12}));}
 if(gX>0)s+=fade(1-flip,V3(P,[0,0,0],[0,0,.8],{color:CX,w:8,head:20,g:gX})+fade(gX,tagBox('𝐯×𝐁 ＝ 2 ẑ',P(0,0,.8)[0]+16,P(0,0,.8)[1]-8,CX)));
 if(gF>0)s+=V3(P,[0,0,0],[0,0,-1.6],{color:CF,w:9,head:22,g:gF})+fade(gF,tagBox('𝐅 ＝ −4 ẑ N',P(0,0,-1.6)[0]+18,P(0,0,-1.6)[1]-14,CF));
 const O=P(0,0,0);s+=charge(O[0],O[1],-1,18,{color:CQ});
 if(tags){
  s+=tagBox('q ＝ −2 C',O[0]-26,O[1]-34,CQ,{g:gq,anchor:'end'});
  s+=tagBox('𝐯 ＝ 5 x̂ m/s',P(.8,0,0)[0],P(.8,0,0)[1]+50,CV,{g:gv,anchor:'middle'});
  s+=tagBox('𝐁 ＝ 0.4 ŷ T',P(0,1.6,0)[0]+50,P(0,1.6,0)[1]-90,CB,{g:gB});
 }
 return s;
}
// ---- 正面図：⊗ の磁場と電子の円（時計回り） ----
// φ は数学の向き。電子は φ が減る向きに回る。位置 (cx+R cosφ, cy−R sinφ)、𝐯 (sinφ, cosφ)、𝐅（中心）(−cosφ, sinφ)
function onC(phi,cx,cy,R){return {x:cx+R*Math.cos(phi),y:cy-R*Math.sin(phi),v:[Math.sin(phi),Math.cos(phi)],f:[-Math.cos(phi),Math.sin(phi)]};}
function electron(o,{lv=95,lf=75,vf=1,mark=0,F=1}={}){
 let s='';
 if(vf)s+=arrow(o.x,o.y,o.x+o.v[0]*lv,o.y+o.v[1]*lv,{color:CV,w:6,head:16});
 if(F)s+=arrow(o.x,o.y,o.x+o.f[0]*lf,o.y+o.f[1]*lf,{color:CF,w:6,head:16});
 if(mark)s+=fade(mark,rightMark(o.x,o.y,o.v,o.f,15));
 return s+charge(o.x,o.y,-1,15);
}
const FV=[70,120,600,480];
const BTAG=(g=1)=>fade(g,label('𝐁：奥向き（⊗）',FV[0],105,{size:24,color:CB,weight:700}));

// ---- 時計（金） ----
function clock(cx,cy,r,frac,{g=1}={}){
 let s=ring(cx,cy,r,{color:CT,w:3.5,fill:'#1a1a10'});
 for(let i=0;i<12;i++){const a=2*PI*i/12;s+=line(cx+r*.8*Math.sin(a),cy-r*.8*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:CT,w:2});}
 const a=2*PI*frac;s+=line(cx,cy,cx+r*.75*Math.sin(a),cy-r*.75*Math.cos(a),{color:CT,w:4})+dot(cx,cy,5,CT);
 return fade(g,s);
}
// 小問3 の2つの円：同じ打ち出し点（上）から右へ。元の円 R0、2倍の円 2R0
const L3C={x:300,y:135,R:85};
function twoCircles({g2=1,dash2=1,orig=1,ph=null,clocks=0,t=0,lab=1}={}){
 const {x,y,R}=L3C;let s=field(FV[0],FV[1]+40,520,FV[3]+20,{step:80})+BTAG();
 s+=fade(orig,draw(circPts(x,y+R,R,0,2*PI,80),1,{color:EL,w:3.5}));
 if(lab)s+=fade(orig,tagBox('元の速さのときの円',x,y+2*R+42,EL,{size:24,anchor:'middle'}));
 if(g2>0)s+=fade(g2,draw(circPts(x,y+2*R,2*R,0,2*PI,120),1,{color:EL,w:3.5,dash:dash2?'12 9':''}));
 if(ph!==null){
  const a=PI/2-ph;
  const o1=onC(a,x,y+R,R),o2=onC(a,x,y+2*R,2*R);
  s+=fade(orig,charge(o1.x,o1.y,-1,13))+fade(g2,charge(o2.x,o2.y,-1,13));
 }
 if(clocks){s+=fade(clocks,clock(580,170,40,t)+label('元の円',580,240,{size:24,color:EL,anchor:'middle',weight:700})+clock(580,350,40,t)+label('2倍の円',580,420,{size:24,color:EL,anchor:'middle',weight:700}));}
 return s;
}

export const ytQxUmMagneticForceDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（6 秒）：0〜3 s 前半（3つの軸、q、𝐯、𝐁 を順に）、3〜6 s 後半（⊗ の磁場、電子と打ち出す向き、札）。静止。
 [K+'q1']:(p)=>{
  const P=view({ox:200,oy:290,u:105});
  let s=scene3({P,gA:seg(p,0,.12),gq:seg(p,.12,.22),gv:seg(p,.22,.34),gB:seg(p,.34,.46)});
  s+=fade(seg(p,.5,.56),line(620,30,620,490,{color:C.faint,w:2,dash:'8 8'})+label('前半',300,490,{size:26,color:C.dim,anchor:'middle',weight:700})+label('後半',900,490,{size:26,color:C.dim,anchor:'middle',weight:700}));
  s+=field(670,60,1150,380,{step:80,n:seg(p,.5,.66)});
  s+=fade(seg(p,.62,.7),tagBox('B ＝ 1.0×10⁻³ T（⊗：奥向き）',1150,420,CB,{anchor:'end'}));
  const g=seg(p,.68,.78);
  s+=fade(g,arrow(822,180,960,180,{color:CV,w:6})+charge(800,180,-1,18)+label('電子',800,140,{size:26,color:EL,anchor:'middle',weight:700}));
  s+=tagBox('2.0×10⁶ m/s',890,232,CV,{g:seg(p,.76,.84)});
  s+=tagBox('m ＝ 9.11×10⁻³¹ kg',690,300,C.ink,{g:seg(p,.82,.9)});
  s+=tagBox('e ＝ 1.6×10⁻¹⁹ C',690,358,CQ,{g:seg(p,.88,.96)});
  return s;
 },
 // 小問3（3 秒）：後半の電子だけ。速度の矢印を2倍に伸ばし、札を「速さ 2倍」に替える。円・半径・時計は出さない。
 [K+'q3']:(p)=>{
  let s=field(200,60,1000,380,{step:80})+tagBox('B ＝ 1.0×10⁻³ T（⊗：奥向き）、同じ 磁場',1000,430,CB,{anchor:'end'});
  const k=1+seg(p,.25,.7);
  s+=arrow(422,180,422+140*k,180,{color:CV,w:6})+charge(400,180,-1,18)+label('電子',400,140,{size:26,color:EL,anchor:'middle',weight:700});
  s+=tagBox('2.0×10⁶ m/s',470,232,CV,{g:1-seg(p,.55,.7)});
  s+=tagBox('速さ 2倍',470,232,HI,{g:seg(p,.65,.8)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=scene3({gA:seg(p,0,.1),gq:seg(p,.05,.15),gB:seg(p,.3,.4),gv:seg(p,.5,.6)});
  s+=panel(100,300,label('小問1',PC,150,{size:28,color:C.dim,anchor:'middle'})+label('−2 C の 電荷が 受ける 力',PC,215,{size:30,color:HI,anchor:'middle',weight:700})
   +label('向き と 大きさ',PC,275,{size:28,color:C.ink,anchor:'middle'})+label('軸：x 右、y 奥、z 上',PC,345,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),HI);
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'law']:(p,ctx)=>{
  const a=wAt(ctx,'まずブイ',.35),b=wAt(ctx,'さいごに',.65);
  let s=scene3({});
  s+=panel(90,330,kindTag('法則',PC,135,{g:seg(p,.02,.1)})+T(LAW,PC,210,48)
   +fade(seg(p,a,a+.06),line(PX+30,262,PX+PW-30,262,{color:C.faint,w:2})
    +tagBox('① 𝐯×𝐁 を 作る',PX+40,310,C.ink,{glow:seg(p,a,a+.05)*(1-seg(p,b,b+.05)),size:28})
    +tagBox('② q を 符号ごと 掛ける',PX+40,375,C.ink,{glow:seg(p,b,b+.05)*.5,size:28})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'cross']:(p,ctx)=>{
  const a=wAt(ctx,'イコールに',.6);
  let s=scene3({arcG:seg(p,.15,.35),gX:seg(p,a,a+.1)});
  s+=fade(seg(p,.25,.35),label('右ねじ：x̂ → ŷ で 上へ',40,470,{size:24,color:HI,weight:700}));
  s+=panel(90,330,tagBox('① 𝐯×𝐁 を 作る',PX+40,130,C.ink,{glow:1,size:26})
   +T(`${bv}\\times${bB}=5\\,${hx}\\times0.4\\,${hy}`,PC,215,38)
   +fade(seg(p,a,a+.06),T(`=2\\,${hz}`,PC,285,44))
   +fade(seg(p,.2,.3),label('係数 5×0.4 ＝ 2',PX+40,355,{size:26,color:C.ink})+label('向き x̂×ŷ ＝ ẑ（上）',PX+40,400,{size:26,color:C.ink})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'sign']:(p,ctx)=>{
  const a=wAt(ctx,'かけると',.2),b=wAt(ctx,'しょうもん',.6);
  const fl=seg(p,a,a+.12);
  let s=scene3({gX:1,flip:fl,gF:fl});
  s+=panel(90,330,tagBox('② q を 符号ごと 掛ける',PX+40,130,C.ink,{glow:1,size:26})
   +T(`${qq}\\,(${bv}\\times${bB})=(${cs(NG,'-2')})(2\\,${hz})`,PC,215,34)
   +fade(seg(p,a+.05,a+.12),T(`${bF}=-4\\,${hz}\\ \\mathrm{N}`,PC,295,44))
   +fade(seg(p,b,b+.06),label('下向き 4 N',PC,375,{size:32,color:CF,anchor:'middle',weight:700})),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 [K+'wrongAD']:(p,ctx)=>{
  const d=wAt(ctx,'ディーは',.5);
  let s=scene3({gF:1});
  s+=wrongSeq(p,ctx,[['A','上向き 4 N',['𝐯×𝐁 の 向きのままで、','負の q を 掛けていない']],['D','右向き 4 N','力は 𝐯 にも 𝐁 にも 直角']],{win:[[0,d],[d,1]],opts:{...WOPT,y:150}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 [K+'wrongC']:(p,ctx)=>{
  const b=wAt(ctx,'ビーイコール',.45);
  let s=card(180,96,840,200,label('力の 大きさ',600,140,{size:26,color:C.dim,anchor:'middle'}),1);
  const e1=`${aq}\\,${sv}\\,${sB}=2\\times5`,e2='\\times0.4',e3='=4\\ \\mathrm{N}';
  const w1=texWidth(e1,46,false),w2=texWidth(e2,46,false),w3=texWidth(e3,46,false),x0=600-(w1+w2+w3+28)/2;
  s+=T(e1,x0,225,46,{anchor:'start'})+T(e2,x0+w1+12,225,46,{anchor:'start',color:seg(p,b,b+.05)>.5?HI:C.ink})+T(e3,x0+w1+w2+28,225,46,{anchor:'start'});
  s+=highlight(x0+w1+4,180,w2+16,80,seg(p,b,b+.05),HI);
  s+=wrongCard('C','下向き 10 N','|q|v ＝ 2×5 だけ（単位 C·m/s）。B を 掛けていない',{y:330,g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=field(...FV,{n:seg(p,0,.25)})+BTAG(seg(p,0,.2));
  const o=onC(PI/2,330,300,150);
  s+=fade(seg(p,.15,.3),electron(o,{F:0}));
  s+=panel(100,330,label('小問2',PC,150,{size:28,color:C.dim,anchor:'middle'})
   +label('B ＝ 1.0×10⁻³ T',PC,210,{size:28,color:CB,anchor:'middle',weight:700})+label('v ＝ 2.0×10⁶ m/s',PC,260,{size:28,color:CV,anchor:'middle',weight:700})
   +label('m ＝ 9.11×10⁻³¹ kg',PC,310,{size:28,color:C.ink,anchor:'middle',weight:700})+label('e ＝ 1.6×10⁻¹⁹ C',PC,360,{size:28,color:CQ,anchor:'middle',weight:700}),seg(p,.1,.25));
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'circle']:(p,ctx)=>{
  const tr=2*PI*seg(p,.05,.85),phi=PI/2-tr;
  let s=field(...FV)+BTAG();
  s+=draw(circPts(330,300,150,PI/2,PI/2-tr,Math.max(4,Math.round(tr*20))),1,{color:HI,w:3,opacity:.7});
  s+=electron(onC(phi,330,300,150),{mark:1});
  s+=tagBox('速さ 2.0×10⁶ m/s（変わらない）',70,500,CV,{size:24});
  s+=note('円は 拡大して 描いています',470,105,{g:seg(p,.1,.2)});
  s+=panel(100,300,label('磁気力 ⟂ 速度',PC,165,{size:30,color:CF,anchor:'middle',weight:700})
   +fade(seg(p,.25,.35),label('→ 仕事を しない',PC,235,{size:30,color:C.ink,anchor:'middle',weight:700}))
   +fade(seg(p,.5,.6),label('→ 速さ 一定で 円を 回る',PC,305,{size:30,color:HI,anchor:'middle',weight:700})),seg(p,.02,.12));
  s+=goalTag(G2);
  return s;
 },
 [K+'eq']:(p,ctx)=>{
  let s=field(...FV)+BTAG();
  s+=draw(circPts(330,300,150,0,2*PI,90),1,{color:C.dim,w:2.5,dash:'8 8'});
  const o=onC(PI/4,330,300,150);
  s+=fade(seg(p,.02,.1),line(330,300,o.x,o.y,{color:CR,w:5})+dot(330,300,6,CR)+tagBox('r ＝ 円の 半径',190,350,CR,{size:24}));
  s+=electron(o);
  s+=panel(90,330,kindTag('法則',PC,140,{g:seg(p,.12,.2),text:'運動方程式'})
   +fade(seg(p,.15,.25),T(`${cs(CF,`${aq}\\,${sv}\\,${sB}`)}=\\dfrac{m${sv}^2}{${sr}}`,PC,240,50))
   +fade(seg(p,.3,.4),label('磁気力',PC-110,330,{size:26,color:CF,anchor:'middle',weight:700})+label('円を回るのに',PC+95,330,{size:24,color:C.ink,anchor:'middle',weight:700})+label('必要な力',PC+95,365,{size:24,color:C.ink,anchor:'middle',weight:700})),seg(p,.1,.2));
  s+=goalTag(G2);
  return s;
 },
 [K+'solve']:(p,ctx)=>{
  const a=wAt(ctx,'アールについて',.4);
  const cn=seg(p,.15,.25);
  let s=card(180,96,840,400,'',1);
  const vC=cn>.5?`{\\color{${HI}}\\cancel{${sv}}}`:sv;
  s+=T(`${aq}\\,${vC}\\,${sB}=\\dfrac{m${sv}^{${cn>.5?`{\\color{${HI}}\\cancel{2}}`:'2'}}}{${sr}}`,600,165,40);
  s+=fade(seg(p,.1,.18),label('両辺を v で 割る',920,180,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.25,.35),T(`${aq}\\,${sB}=\\dfrac{m${sv}}{${sr}}`,600,285,40));
  s+=fade(seg(p,a,a+.08),T(RFORM,600,432,44));
  const w=texWidth(RFORM,44,false);
  s+=highlight(600-w/2-16,372,w+32,112,seg(p,a+.1,a+.18),CR);
  s+=goalTag(G2);
  return s;
 },
 [K+'num']:(p,ctx)=>{
  const b=wAt(ctx,'しょうもん',.65),c=wAt(ctx,'いちセンチ',.45);
  let s=card(30,90,700,415,'',1);
  s+=T(RFORM,380,165,38);
  s+=fade(seg(p,.03,.12),label('分子',50,240,{size:24,color:C.dim})+T('m v=9.11\\times10^{-31}\\times2.0\\times10^{6}=1.82\\times10^{-24}',115,232,28,{anchor:'start'}));
  s+=fade(seg(p,.1,.2),label('分母',50,315,{size:24,color:C.dim})+T('|q|B=1.6\\times10^{-19}\\times1.0\\times10^{-3}=1.6\\times10^{-22}',115,307,28,{anchor:'start'}));
  s+=fade(seg(p,.2,.3),T(`${sr}\\approx${cs(CR,'1.1\\times10^{-2}\\ \\mathrm{m}')}`,380,410,46));
  s+=fade(seg(p,c,c+.06),label('約 1 cm',380,480,{size:28,color:CR,anchor:'middle',weight:700}));
  // 右：円（拡大）
  const cx=960,cy=310,R=120;
  s+=fade(seg(p,c,c+.08),draw(circPts(cx,cy,R,0,2*PI,90),1,{color:EL,w:3})+line(cx,cy,cx+R,cy,{color:CR,w:5})+dot(cx,cy,5,CR)+label('r',cx+R/2,cy-12,{size:28,color:CR,anchor:'middle',weight:700})+note('拡大',cx,cy+R+40));
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 [K+'wrongA2']:(p,ctx)=>{
  let s='';
  const mini=(cx,sign,txt,col)=>{const cy=215,R=80;let t=draw(circPts(cx,cy,R,0,2*PI,70),1,{color:col,w:3});
   t+=sign>0?arcArrow(cx,cy,R+22,-PI*.75,-PI*.25,col,4):arcArrow(cx,cy,R+22,-PI*.25,-PI*.75,col,4);
   t+=charge(cx,cy-R,sign,15)+label(txt,cx,cy+R+66,{size:26,color:col,anchor:'middle',weight:700});return t;};
  s+=fade(seg(p,.1,.2),mini(380,1,'正の 電荷：反時計回り',PO)+mini(820,-1,'電子：時計回り',EL));
  s+=label('𝐁：奥向き（⊗）',600,110,{size:24,color:CB,anchor:'middle',weight:700});
  s+=wrongCard('A','−1.1×10⁻² m','分母は |q|。符号は 回る 向きだけを 決める',{y:385,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 [K+'wrongBC2']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.5);
  let s=card(400,96,400,140,T(RFORM,600,170,44),1);
  s+=wrongSeq(p,ctx,[['B','88 m','|q|B/(mv) と 逆にした（単位 1/m）',{mid:`\\dfrac{|q|B}{mv}\\approx88`}],['C','2.3×10⁴ m','mv²/(|q|B) の まま（単位 m²/s）',{mid:`\\dfrac{mv^2}{|q|B}\\approx2.3\\times10^{4}`}]],{win:[[0,c],[c,1]],opts:{y:255}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p)=>{
  let s=twoCircles({g2:0,ph:0});
  const o=onC(PI/2,L3C.x,L3C.y+L3C.R,L3C.R);
  s+=arrow(o.x+15,o.y,o.x+120,o.y,{color:CV,w:6})+tagBox('速さ 2倍',o.x+60,o.y-34,HI,{size:24,g:seg(p,.2,.3)});
  s+=panel(100,300,label('小問3',PC,150,{size:28,color:C.dim,anchor:'middle'})+label('同じ 磁場で、速さ だけ 2倍',PC,215,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('半径 と 1周の 時間 は？',PC,285,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'double']:(p,ctx)=>{
  const a=wAt(ctx,'ひれい',.4);
  let s=twoCircles({g2:seg(p,a,a+.2),ph:0});
  const w=texWidth(RFORM,48,false),we=texWidth(`${sr}=`,48,false),wn=texWidth(`m${sv}`,48,false),wv=texWidth(sv,48,false),wl=we+(w-we)/2+wn/2-wv;
  s+=panel(100,300,T(RFORM,PC,200,48)+highlight(PC-w/2+wl-6,133,wv+12,46,seg(p,.05,.12),HI)
   +fade(seg(p,a,a+.08),label('v に 比例',PC,300,{size:28,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,a+.15,a+.22),label('速さ 2倍 → 半径 2倍',PC,360,{size:30,color:EL,anchor:'middle',weight:700})),1);
  s+=goalTag(G3);
  return s;
 },
 [K+'period']:(p,ctx)=>{
  const b=wAt(ctx,'えんしゅうも',.3),c=wAt(ctx,'ティーイコールにパイエム',.6);
  const tt=tAt(ctx,K+'period'),run=clamp((tt-1)/6);
  let s=twoCircles({ph:2*PI*((tt*.18)%1)*(seg(p,b,b+.05)),clocks:seg(p,b,b+.06),t:(tt*.18)%1*seg(p,b,b+.05)});
  const cn=seg(p,c+.05,c+.12);
  const vC=cn>.5?`{\\color{${HI}}\\cancel{${sv}}}`:sv;
  s+=panel(90,360,T(`${sT}=\\dfrac{2\\pi ${sr}}{${sv}}`,PC,150,40)
   +fade(seg(p,b,b+.06),label('円周も 速さも 2倍',PC,225,{size:26,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,c,c+.06),T(`=\\dfrac{2\\pi}{${vC}}\\cdot\\dfrac{m${vC}}{${aq}${sB}}`,PC,300,36))
   +fade(seg(p,c+.12,c+.2),T(`${sT}=\\dfrac{2\\pi m}{${aq}${sB}}`,PC,400,44)),1);
  s+=fade(seg(p,b+.05,b+.12),label('同じ 時間で 1周',580,480,{size:24,color:CT,anchor:'middle',weight:700}));
  s+=goalTag(G3);
  return s;
 },
 [K+'ans3']:(p,ctx)=>{
  const tt=tAt(ctx,K+'period');
  let s=twoCircles({ph:2*PI*((tt*.18)%1),clocks:1,t:(tt*.18)%1});
  s+=panel(90,300,T(`${sT}=\\dfrac{2\\pi m}{${aq}${sB}}`,PC,170,44)+label('半径 2倍',PC,280,{size:30,color:EL,anchor:'middle',weight:700})+label('1周の 時間 同じ',PC,340,{size:30,color:CT,anchor:'middle',weight:700}),1,HI);
  s+=label('同じ 時間で 1周',580,480,{size:24,color:CT,anchor:'middle',weight:700});
  s+=goalTag(G3)+ANS3(seg(p,.05,.15));
  return s;
 },
 [K+'wrongBC3']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.5);
  let s=twoCircles({ph:0});
  s+=wrongSeq(p,ctx,[['B','半径 2倍、時間 2倍','速さも 2倍な ことを 落とした'],['C','半径 4倍、時間 2倍','r は v² でなく v に 比例']],{win:[[0,c],[c,1]],opts:{...WOPT,y:200}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'wrongD3']:(p,ctx)=>{
  let s=twoCircles({ph:0});
  s+=card(PX,100,PW,110,T(RFORM,PC,160,40),1);
  s+=wrongCard('D','半径 同じ、時間 1/2','r ＝ mv/(|q|B) は v で 変わる',{...WOPT,y:240,g:seg(p,.03,.1)});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 [K+'sum']:(p,ctx)=>{
  const b=wAt(ctx,'えんのおおきさ',.3);
  let s=card(40,120,460,330,label('向き：外積',270,175,{size:28,color:C.dim,anchor:'middle',weight:700})+T(LAW,270,290,48),seg(p,.02,.1));
  const vC=`{\\color{${HI}}\\cancel{${sv}}}`;
  s+=card(540,120,620,330,label('大きさ・1周の時間：力と円運動の式',850,175,{size:26,color:C.dim,anchor:'middle',weight:700})
   +T(RFORM,850,265,44)+T(`${sT}=\\dfrac{2\\pi}{${vC}}\\cdot\\dfrac{m${vC}}{${aq}${sB}}=\\dfrac{2\\pi m}{${aq}${sB}}`,850,380,38),seg(p,b,b+.08));
  s+=answerRow([[1,'B','下向き 4 N'],[2,'D','1.1×10⁻² m'],[3,'A','']],{g:seg(p,.7,.8)});
  return s;
 },
};
