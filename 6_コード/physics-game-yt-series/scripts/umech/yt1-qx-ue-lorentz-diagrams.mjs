// 問題編 解説「60° で打ち出した陽子と、50 巻きのコイル」（q-ue-lorentz、大学編 25 ローレンツ力・上級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/25_ローレンツ力.md の q-ue-lorentz（解説 20 行）。
// 画面：左に図、右に説明の枠。式の場面は図を消して式だけ。札の帯（y＜78）には図を描かない。
// 描き方は単元動画（yt1-ue-lorentz-1/2-diagrams.mjs）を写して使う（あちらは編集しない）。
// らせん（斜投影 x 右・y 奥・z 上、𝐁＝Bx̂）：位置 (adv·(ψ−π/2), −ρ sinψ, −ρ cosψ)。ψ＝π/2：手前で 𝐯⊥＝+ẑ（上）から出発。
//   真下（ψ＝2π）：𝐯⊥＝−ŷ、q(−ŷ)×x̂＝+ẑ（軸向き）✓。x の側から見ると時計回り（画面の右＝+y、上＝+z、𝐁 は手前 ⊙）。
// コイル（軸の方向から見た図＝x 右・z 上、y は奥）：右の点（x＝+0.05 m）の電流 −ŷ（⊙）→ 力 上。左の点 ⊗ → 力 下。正面から見て反時計回り。
// 色：𝐯 紫、𝐁 橙、𝐅・電流 緑、𝐥 水色、陽子 赤、半径 r 水色、周期 T・時計 金、ピッチ p 黄、腕 黄、エネルギー 橙、逆起電力 紫、強調 黄。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,poly,tex,texWidth} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,kindTag,note,voiceEnd,sentWin,cueT,tAt} from './yt1-qx-common.mjs';

const K='qx-ue-lorentz:';
const CV=C.v,CB=C.E,CF=C.F,CI=C.F,CL=C.x,PO=C.a,EL='#7fb3ff',CR=C.x,CT=C.t,CP=C.hi,HI=C.hi,CU=C.E,CW='#c58b4a';
const PI=Math.PI;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}'),bF=cs(CF,'\\mathbf{F}'),bl=cs(CL,'\\mathbf{l}'),sI=cs(CI,'I'),qq=cs(C.p,'q');
const sT=cs(CT,'T'),sB=cs(CB,'B'),aq=`|${qq}|`;
const TFORM=`${sT}=\\dfrac{2\\pi m}{${aq}${sB}}`;
const PX=680,PW=500,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1='ピッチ p（1周で x の向きに進む距離）',G2='トルクの大きさ',G3='エネルギーの出どころ';
const ANS1=g=>answerTag(1,'D','0.49 m',{g}),ANS2=g=>answerTag(2,'B','0.6 N·m',{g}),ANS3=g=>answerTag(3,'C','電源から',{g});
function wAt(ctx,sub,def=.5){const r=(ctx?.cue?.reading??'').replace(/\s/g,''),i=r.indexOf(sub.replace(/\s/g,''));return (i<0||!r.length)?def:i/r.length*voiceEnd(ctx);}
const tw=(t,size)=>[...t].reduce((a,ch)=>a+(ch===' '?.34:/[ -~]/.test(ch)?.64:/[⁰-⁹⁻]/.test(ch)?.5:1.02),0)*size;
function tagBox(t,x,y,color,{g=1,glow=0,size=26,anchor='start'}={}){
 const w=tw(t,size)+24,h=size+16,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return fade(g,rect(x0,y-h/2,w,h,{fill:'#10182c',fo:.92,stroke:glow>0.02?HI:color,sw:2+2*glow,rx:8})+label(t,x0+12,y+size*.36,{size,color,weight:700}));
}
function inSym(x,y,r=11,color=CB,w=2){const d=r*.62;return ring(x,y,r,{color,w,fill:'#10182c'})+line(x-d,y-d,x+d,y+d,{color,w})+line(x-d,y+d,x+d,y-d,{color,w});}
function outSym(x,y,r=11,color=CB,w=2){return ring(x,y,r,{color,w,fill:'#10182c'})+dot(x,y,r*.32,color);}
function charge(x,y,sign=1,r=16){const c=sign>0?PO:EL;return ring(x,y,r,{color:c,w:3,fill:sign>0?'#3a1d2a':'#1b2a48'})+label(sign>0?'＋':'−',x,y+r*.4,{size:Math.max(22,r*1.15),color:c,anchor:'middle',weight:700});}
function rightMark(x,y,a,b,s=14,color=HI,w=3){return draw([[x+a[0]*s,y+a[1]*s],[x+(a[0]+b[0])*s,y+(a[1]+b[1])*s],[x+b[0]*s,y+b[1]*s]],1,{color,w});}
const circPts=(cx,cy,r,a0,a1,n=60)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
function arcArrow(cx,cy,r,a0,a1,color,w=4,g=1){const pts=circPts(cx,cy,r,a0,a1,40),[x1,y1]=pts[38],[x2,y2]=pts[40];return fade(g,draw(pts.slice(0,39),1,{color,w})+arrow(x1,y1,x2,y2,{color,w,head:14}));}
function dbl(x1,x2,y,color,txt,{g=1,size=28}={}){return fade(g,arrow((x1+x2)/2,y,x1,y,{color,w:4,head:13})+arrow((x1+x2)/2,y,x2,y,{color,w:4,head:13})+line(x1,y-14,x1,y+14,{color,w:2})+line(x2,y-14,x2,y+14,{color,w:2})+(txt?label(txt,(x1+x2)/2,y+size+8,{size,color,anchor:'middle',weight:700}):''));}
function clock(cx,cy,r,frac,{g=1}={}){
 let s=ring(cx,cy,r,{color:CT,w:4,fill:'#1a1a10'});
 for(let i=0;i<12;i++){const a=2*PI*i/12;s+=line(cx+r*.8*Math.sin(a),cy-r*.8*Math.cos(a),cx+r*Math.sin(a),cy-r*Math.cos(a),{color:CT,w:2.5});}
 const a=2*PI*frac;
 if(frac>.005){const n=Math.max(2,Math.ceil(40*frac)),pts=Array.from({length:n+1},(_,i)=>{const b=a*i/n;return [cx+r*.6*Math.sin(b),cy-r*.6*Math.cos(b)];});s+=draw([[cx,cy],...pts,[cx,cy]],1,{color:CT,w:0,fill:CT,opacity:.25});}
 s+=line(cx,cy,cx+r*.78*Math.sin(a),cy-r*.78*Math.cos(a),{color:CT,w:5})+dot(cx,cy,6,CT);
 return fade(g,s);
}
function gauge(x,y,{g=1,lab='仕事率'}={}){
 const r=64;let s=draw(circPts(x,y,r,PI,0,40),1,{color:CU,w:4});
 for(const a of [PI,PI*.75,PI/2,PI/4,0])s+=line(x+r*.82*Math.cos(a),y-r*.82*Math.sin(a),x+r*Math.cos(a),y-r*Math.sin(a),{color:CU,w:3});
 s+=label('−',x-r-12,y+8,{size:26,color:C.dim,anchor:'end'})+label('＋',x+r+12,y+8,{size:26,color:C.dim})+label('0',x,y-r-12,{size:24,color:CU,anchor:'middle',weight:700});
 s+=line(x,y,x,y-r*.85,{color:HI,w:5})+dot(x,y,7,HI)+label(lab,x,y+36,{size:24,color:CU,anchor:'middle',weight:700});
 return fade(g,s);
}

// ---- 前半：正面（x 右・z 上）の図。𝐁 右向き、陽子、60° の速度 ----
const PR={x:150,y:360,L:230};
function bLines(x0,x1,ys,{g=1}={}){let s='';for(const y of ys)s+=fade(.5,arrow(x0,y,x1,y,{color:CB,w:3,head:12}));return fade(g,s);}
function front({g=1,gB=1,gv=1,ang=1,tags=1,split=0,vg=1}={}){
 const {x,y,L}=PR,a=60*PI/180,vx=x+L*Math.cos(a),vy=y-L*Math.sin(a);
 let s=bLines(50,600,[140,240,340,440],{g:gB})+fade(gB,tagBox('𝐁 ＝ 0.2 x̂ T',600,100,CB,{anchor:'end'}));
 if(split>0){
  s+=fade(split,line(vx,vy,vx,y,{color:C.dim,w:2,dash:'6 6'})+line(vx,vy,x,vy,{color:C.dim,w:2,dash:'6 6'}));
  s+=arrow(x,y,vx,y,{color:CV,w:6,g:split})+arrow(x,y,x,vy,{color:CV,w:6,g:split});
  s+=fade(split,label('v∥',(x+vx)/2,y+40,{size:30,color:CV,anchor:'middle',weight:700})+label('v⊥',x-16,(y+vy)/2,{size:30,color:CV,anchor:'end',weight:700}));
 }
 s+=fade(vg,arrow(x,y,x+(vx-x)*gv,y+(vy-y)*gv,{color:CV,w:7,head:20}));
 if(ang>0)s+=fade(ang*vg,draw(circPts(x,y,62,0,a,24),1,{color:HI,w:3})+label('60°',x+72,y-18,{size:26,color:HI,weight:700}));
 s+=charge(x,y,1,16);
 if(tags)s+=fade(tags*vg,tagBox('3.0×10⁶ m/s',vx+12,vy-4,CV));
 return fade(g,s);
}
// ---- らせん（斜投影） ----
const KX=1.0,KZ=.4;
const mkP=(ox,oy,u)=>(x,y,z)=>[ox+u*(x+KX*y),oy-u*(z+KZ*y)];
const PP=0.492,RHO=0.1356,ADV=PP/(2*PI);
const hp=ps=>[ADV*(ps-PI/2),-RHO*Math.sin(ps),-RHO*Math.cos(ps)];
const QH=mkP(110,300,500);
function helix(psi1,{g=1,Q=QH,dotOn=1,ghost=1}={}){
 let s='';
 if(ghost)s+=draw(Array.from({length:241},(_,i)=>Q(...hp(PI/2+4*PI*i/240))),1,{color:C.faint,w:2,dash:'5 7'});
 const n=Math.max(2,Math.round(120*(psi1-PI/2)/(2*PI)));
 if(psi1>PI/2+.01)s+=draw(Array.from({length:n+1},(_,i)=>Q(...hp(PI/2+(psi1-PI/2)*i/n))),1,{color:HI,w:4});
 if(dotOn){const A=Q(...hp(psi1));s+=charge(A[0],A[1],1,13);}
 return fade(g,s);
}
function helixField(Q=QH,g=1){let s='';for(const z of [.24,-.24]){const A=Q(-.05,0,z),B=Q(1.08,0,z);s+=fade(.5,arrow(A[0],A[1],B[0],B[1],{color:CB,w:3,head:12}));}
 const A=Q(-.05,0,0),B=Q(1.08,0,0);s+=line(A[0],A[1],B[0],B[1],{color:C.faint,w:2,dash:'6 7'});
 return fade(g,s+tagBox('𝐁 ＝ 0.2 x̂ T',Q(1.08,0,.24)[0],Q(1.08,0,.24)[1]-34,CB,{anchor:'end',size:24}));}

// ---- コイル：軸の方向（y）から見た図 ----
// R＝0.05 m を何 px で描くか。phi：傾き（反時計回り）。
function coilView({cx=330,cy=300,R=150,phi=0,forces=0,fsc=1,arms=0,fieldOn=1,g=1,axisLab=1,flab=''}={}){
 let s='';
 if(fieldOn)for(const dy of [-170,-85,85,170])s+=fade(.5,arrow(cx-290,cy+dy,cx+290,cy+dy,{color:CB,w:3,head:12}));
 const xr=cx+R*Math.cos(phi),yr=cy-R*Math.sin(phi),xl=cx-R*Math.cos(phi),yl=cy+R*Math.sin(phi);
 s+=line(xl,yl,xr,yr,{color:CW,w:4});
 s+=ring(cx,cy,10,{color:C.dim,w:2.5,fill:'#10182c'})+dot(cx,cy,4,C.dim);
 if(axisLab)s+=label('回転軸（y）',cx,cy+44,{size:22,color:C.dim,anchor:'middle'});
 if(forces){s+=arrow(xr,yr,xr,yr-120*fsc,{color:CF,w:7,head:20,g:forces})+arrow(xl,yl,xl,yl+120*fsc,{color:CF,w:7,head:20,g:forces});
  if(flab)s+=fade(forces,label(flab,xr+18,yr-100*fsc,{size:28,color:CF,weight:700})+label(flab,xl-18,yl+110*fsc,{size:28,color:CF,anchor:'end',weight:700}));}
 if(arms){s+=fade(arms,line(cx,cy,xr,cy,{color:HI,w:4,dash:'7 6'})+line(cx,cy,xl,cy,{color:HI,w:4,dash:'7 6'}));}
 s+=outSym(xr,yr,18,CI,3)+inSym(xl,yl,18,CI,3);
 return fade(g,s);
}
// ---- コイル：斜めから見た図（0.2 m の辺は y に沿う） ----
const QC=(x,y,z)=>[300+1500*(x+.6*y),300-1500*(z+.5*y)];
function coil3D({g=1,lArrow=0,zeroTags=0,emf=0,rot=0,Q=QC}={}){
 const a=.05,b=.1;let s='';
 for(const z of [.085,-.085]){const A=Q(-.16,0,z),B=Q(.16,0,z);s+=fade(.5,arrow(A[0],A[1],B[0],B[1],{color:CB,w:3,head:12}));}
 const Ab=Q(.16,0,.085);s+=label('𝐁',Ab[0]+8,Ab[1]+8,{size:28,color:CB,weight:700});
 {const A=Q(0,-.13,0),B=Q(0,.13,0);s+=line(A[0],A[1],B[0],B[1],{color:C.dim,w:2,dash:'7 7'});s+=label('回転軸（y）',B[0]+12,B[1]+4,{size:22,color:C.dim});}
 const L3=(p1,p2,o)=>{const A=Q(...p1),B=Q(...p2);return line(A[0],A[1],B[0],B[1],o);};
 const V3=(p1,p2,o)=>{const A=Q(...p1),B=Q(...p2);return arrow(A[0],A[1],B[0],B[1],o);};
 s+=L3([a,b,0],[a,-b,0],{color:CW,w:6})+L3([-a,-b,0],[-a,b,0],{color:CW,w:6})+L3([a,-b,0],[-a,-b,0],{color:CW,w:4})+L3([-a,b,0],[a,b,0],{color:CW,w:4});
 // 電流（緑）：右の辺 −y（手前へ）、手前の辺 −x、左の辺 +y、奥の辺 +x
 s+=V3([a,.04,0],[a,-.04,0],{color:CI,w:4,head:13})+V3([.02,-b,0],[-.02,-b,0],{color:CI,w:4,head:13})+V3([-a,-.04,0],[-a,.04,0],{color:CI,w:4,head:13})+V3([-.02,b,0],[.02,b,0],{color:CI,w:4,head:13});
 if(lArrow){const A=Q(a+.012,.09,0),B=Q(a+.012,-.09,0);s+=fade(lArrow,arrow(A[0]+8,A[1],B[0]+8,B[1],{color:CL,w:5,head:16})+label('𝐥',(A[0]+B[0])/2+24,(A[1]+B[1])/2+6,{size:32,color:CL,weight:700}));}
 if(zeroTags){const A=Q(0,-b,0),B=Q(0,b,0);s+=fade(zeroTags,tagBox('力 0',A[0]-40,A[1]+34,CF,{anchor:'middle',size:24})+tagBox('力 0',B[0]-60,B[1]-30,CF,{anchor:'middle',size:24}));}
 if(emf){const A=Q(a,-.06,.012),B=Q(a,.06,.012),C2=Q(-a,.06,.012),D2=Q(-a,-.06,.012);
  s+=fade(emf,arrow(A[0]+14,A[1]-10,B[0]+14,B[1]-10,{color:CV,w:5,head:15})+arrow(C2[0]-14,C2[1]-10,D2[0]-14,D2[1]-10,{color:CV,w:5,head:15})
   +label('逆起電力',A[0]+24,A[1]+30,{size:26,color:CV,weight:700}));}
 if(rot){const O=Q(0,-.13,0);s+=fade(rot,arcArrow(O[0]-10,O[1]+10,46,PI*.95,PI*.05,HI,4)+label('回る',O[0]-10,O[1]-44,{size:24,color:HI,anchor:'middle',weight:700}));}
 return fade(g,s);
}
// ---- 小問3：電源（電池）とコイル ----
function battery(x,y,{g=1}={}){
 let s=rect(x-70,y-40,140,80,{fill:'#1a2236',fo:.95,stroke:C.ink,sw:2.5,rx:8});
 s+=line(x-20,y-24,x-20,y+24,{color:C.ink,w:4})+line(x+4,y-14,x+4,y+14,{color:C.ink,w:7})+label('＋',x-36,y-14,{size:22,color:C.ink,anchor:'middle'});
 s+=label('電源（電池）',x,y+70,{size:26,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}

export const ytQxUeLorentzDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（7 秒）：0〜3 s 前半（右向きの 𝐁、陽子、60° の速度と札）、3〜7 s 後半（軸の方向から見たコイル、⊙ ⊗、回転軸、𝐁、札）。静止。
 [K+'q1']:(p)=>{
  let s=bLines(40,560,[120,220,320,420],{g:seg(p,0,.12)})+fade(seg(p,.05,.15),tagBox('𝐁 ＝ 0.2 x̂ T',560,80,CB,{anchor:'end'}));
  const x=130,y=340,L=210,a=60*PI/180,vx=x+L*Math.cos(a),vy=y-L*Math.sin(a);
  s+=fade(seg(p,.12,.2),charge(x,y,1,16)+label('陽子',x-24,y+8,{size:26,color:PO,anchor:'end',weight:700}));
  s+=arrow(x,y,x+(vx-x)*seg(p,.2,.32),y+(vy-y)*seg(p,.2,.32),{color:CV,w:7,head:20});
  s+=fade(seg(p,.3,.38),draw(circPts(x,y,62,0,a,24),1,{color:HI,w:3})+label('60°',x+72,y-18,{size:26,color:HI,weight:700}));
  s+=tagBox('3.0×10⁶ m/s',vx+12,vy-4,CV,{g:seg(p,.36,.43)});
  s+=fade(seg(p,.42,.46),line(600,40,600,490,{color:C.faint,w:2,dash:'8 8'})+label('前半',300,505,{size:26,color:C.dim,anchor:'middle',weight:700})+label('後半',900,505,{size:26,color:C.dim,anchor:'middle',weight:700}));
  const cx=900,cy=270,R=110;
  let c='';for(const dy of [-150,-75,75,150])c+=fade(.5,arrow(cx-250,cy+dy,cx+250,cy+dy,{color:CB,w:3,head:12}));
  s+=fade(seg(p,.45,.55),c+tagBox('𝐁 ＝ 0.2 x̂ T',1150,80,CB,{anchor:'end'}));
  s+=fade(seg(p,.55,.65),line(cx-R,cy,cx+R,cy,{color:CW,w:4})+outSym(cx+R,cy,18,CI,3)+inSym(cx-R,cy,18,CI,3)+ring(cx,cy,10,{color:C.dim,w:2.5,fill:'#10182c'})+dot(cx,cy,4,C.dim));
  s+=fade(seg(p,.62,.7),label('回転軸（y の向き）',cx,cy+44,{size:22,color:C.dim,anchor:'middle'})+label('y の向き（奥）から 見た 図',cx,cy-110,{size:24,color:C.dim,anchor:'middle'}));
  s+=tagBox('50 巻き',680,458,C.ink,{g:seg(p,.7,.78)});
  s+=tagBox('3.0 A',820,458,CI,{g:seg(p,.78,.86)});
  s+=tagBox('0.2 m×0.1 m',940,458,C.ink,{g:seg(p,.86,.94)});
  return s;
 },

 // ===================== 小問1 =====================
 [K+'goal1']:(p)=>{
  let s=front({gB:seg(p,0,.15),gv:seg(p,.1,.3),ang:seg(p,.25,.35),tags:seg(p,.3,.4)});
  s+=panel(100,330,label('小問1',PC,150,{size:28,color:C.dim,anchor:'middle'})
   +label('陽子のらせん',PC,210,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('1周で 𝐁 の向き（x）へ',PC,270,{size:28,color:HI,anchor:'middle',weight:700})+label('進む 距離 p は？',PC,320,{size:28,color:HI,anchor:'middle',weight:700})
   +label('m ＝ 1.67×10⁻²⁷ kg、q ＝ 1.6×10⁻¹⁹ C',PC,390,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.2),HI);
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'split']:(p,ctx)=>{
  const a=wAt(ctx,'ブイへいこう',.2),b=wAt(ctx,'ちょっかくなブイ',.55);
  let s=front({split:seg(p,.05,.2),vg:1-.6*seg(p,.05,.2),tags:0});
  s+=panel(100,330,fade(seg(p,a,a+.06),label('v∥ ＝ 3.0×10⁶×cos60°',PX+30,160,{size:26,color:CV,weight:700})+label('＝ 1.5×10⁶ m/s',PX+80,205,{size:26,color:C.ink,weight:700}))
   +fade(seg(p,b,b+.06),line(PX+30,240,PX+PW-30,240,{color:C.faint,w:2})+label('v⊥ ＝ 3.0×10⁶×sin60°',PX+30,290,{size:26,color:CV,weight:700})+label('≈ 2.60×10⁶ m/s',PX+80,335,{size:26,color:C.ink,weight:700})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'sep']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=card(30,90,540,410,label('x の向きに 等速で 進む',300,135,{size:28,color:C.ink,anchor:'middle',weight:700}),1);
  s+=bLines(60,540,[200,380]);
  const xx=80+((t*70)%420);
  s+=line(70,290,530,290,{color:C.faint,w:2,dash:'6 7'})+arrow(xx,290,xx+80,290,{color:CV,w:5,head:14})+charge(xx,290,1,14)+label('v∥',xx+40,270,{size:26,color:CV,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.3),T(`\\hat{x}\\times\\hat{x}=0`,300,455,34)+label('力 0',430,462,{size:26,color:CF,weight:700}));
  s+=card(630,90,540,410,label('x の向きから見て 円を 回る',900,135,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.4,.5));
  const ph=-t*1.6,cx=900,cy=310,R=120,o=[cx+R*Math.cos(ph),cy-R*Math.sin(ph)],v=[Math.sin(ph),Math.cos(ph)],f=[-Math.cos(ph),Math.sin(ph)];
  let r=draw(circPts(cx,cy,R,0,2*PI,80),1,{color:C.dim,w:2.5,dash:'8 8'})+outSym(cx,cy,14,CB,2.5)+label('𝐁（手前）',cx,cy+44,{size:24,color:CB,anchor:'middle',weight:700});
  r+=arrow(o[0],o[1],o[0]+v[0]*80,o[1]+v[1]*80,{color:CV,w:5,head:14})+arrow(o[0],o[1],o[0]+f[0]*60,o[1]+f[1]*60,{color:CF,w:5,head:14})+charge(o[0],o[1],1,14);
  s+=fade(seg(p,.45,.55),r);
  s+=goalTag(G1);
  return s;
 },
 [K+'period']:(p,ctx)=>{
  const b=wAt(ctx,'かずを',.55);
  let s=clock(260,300,150,seg(p,.1,.6))+label('時計 1周 ＝ T',260,490,{size:28,color:CT,anchor:'middle',weight:700});
  s+=panel(100,330,T(TFORM,PC,190,48)+fade(seg(p,.3,.4),label('v⊥ に よらない',PC,290,{size:28,color:HI,anchor:'middle',weight:700}))
   +fade(seg(p,b,b+.06),tagBox('T ≈ 3.28×10⁻⁷ s',PC,370,CT,{anchor:'middle',size:30})),1);
  s+=goalTag(G1);
  return s;
 },
 [K+'helix']:(p,ctx)=>{
  const b=wAt(ctx,'しょうもん',.7);
  const k=seg(p,.03,.6),ps=PI/2+2*PI*k;
  let s=helixField()+helix(ps);
  s+=clock(570,430,48,k);
  const A=QH(...hp(PI/2)),B=QH(...hp(PI/2+2*PI));
  s+=fade(seg(p,.6,.68),line(A[0],A[1],A[0],440,{color:C.dim,w:1.5,dash:'4 5'})+line(B[0],B[1],B[0],440,{color:C.dim,w:1.5,dash:'4 5'})+dbl(A[0],B[0],440,CP,'p'));
  s+=panel(100,330,T(`p=v_{\\parallel}\\,${sT}`,PC,170,46)
   +fade(seg(p,.62,.7),T('1.5\\times10^{6}\\times3.28\\times10^{-7}',PC,260,32)+T('\\approx0.49\\ \\mathrm{m}',PC,330,44,{color:CP})),1);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.05));
  return s;
 },
 [K+'wrongA1']:(p,ctx)=>{
  let s=helixField()+helix(PI/2+2*PI,{dotOn:0});
  // 円周（𝐁 に直角な面の円）を水色で
  const pts=Array.from({length:81},(_,i)=>QH(...hp(PI/2+2*PI*i/80).map((v,j)=>j===0?0:v)));
  s+=fade(seg(p,.05,.15),draw(pts,seg(p,.05,.3),{color:CR,w:5}));
  s+=fade(seg(p,.25,.35),tagBox('2πr ≈ 0.85 m（r ≈ 0.14 m）',40,480,CR,{size:24}));
  s+=wrongCard('A','0.85 m','v⊥T は 円周の 長さ。進みは v∥T',{...WOPT,y:180,g:seg(p,.3,.38)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 [K+'wrongBC1']:(p,ctx)=>{
  const c=wAt(ctx,'スィーは',.6);
  let s=helixField()+helix(PI/2+2*PI,{dotOn:0});
  s+=wrongSeq(p,ctx,[['B','0.98 m','速さ全体を 掛けた（3.0×10⁶×T）'],['C','0.25 m','周期を πm/(|q|B) と 半分にした']],{win:[[0,c],[c,1]],opts:{...WOPT,y:180}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 [K+'goal2']:(p)=>{
  let s=coilView({g:seg(p,0,.2)})+tagBox('𝐁 ＝ 0.2 x̂ T',600,96,CB,{anchor:'end',g:seg(p,.1,.2)});
  s+=panel(100,330,label('小問2',PC,150,{size:28,color:C.dim,anchor:'middle'})
   +label('50 巻き、3.0 A',PC,215,{size:28,color:C.ink,anchor:'middle',weight:700})+label('0.2 m×0.1 m',PC,265,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('面は 磁場と 平行',PC,315,{size:26,color:C.dim,anchor:'middle'})+label('トルクの 大きさは？',PC,385,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  s+=label('y の向きから 見た 図',330,505,{size:24,color:C.dim,anchor:'middle'});
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'law']:(p,ctx)=>{
  const a=wAt(ctx,'でんりゅうが',.5);
  let s=coil3D({lArrow:seg(p,.03,.12),zeroTags:seg(p,a+.05,a+.12)});
  s+=fade(seg(p,.03,.12),tagBox('𝐥 ＝ 電流の向きに沿った、辺の長さの矢印',40,110,CL,{size:22}));
  s+=panel(130,300,kindTag('法則',PC,180,{g:seg(p,.12,.2)})+fade(seg(p,.14,.22),T(`${bF}=${sI}\\,${bl}\\times${bB}`,PC,255,50))
   +fade(seg(p,a,a+.06),line(PX+30,305,PX+PW-30,305,{color:C.faint,w:2})+label('0.1 m の辺：電流 ∥ 𝐁',PC,355,{size:26,color:C.ink,anchor:'middle',weight:700})+label('→ 力 0',PC,400,{size:28,color:CF,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'force']:(p,ctx)=>{
  const a=wAt(ctx,'みぎのへん',.6);
  let s=coilView({forces:seg(p,a,a+.1),flab:'6 N'});
  const e=`{\\color{${HI}}50}\\times3.0\\times0.2\\times0.2=6\\ \\mathrm{N}`;
  s+=panel(100,300,label('1辺の 力 ＝ 巻き数×I×l×B',PC,150,{size:24,color:C.dim,anchor:'middle'})+T(e,PC,230,36)
   +fade(seg(p,a,a+.08),label('右の辺：上　左の辺：下',PC,330,{size:28,color:CF,anchor:'middle',weight:700})),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'arm']:(p,ctx)=>{
  const b=wAt(ctx,'トルクは',.45);
  let s=coilView({forces:1,flab:'6 N',arms:seg(p,.03,.12)});
  s+=fade(seg(p,.05,.15),label('腕 0.05 m',330+75,300-18,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,b,b+.08),arcArrow(330,300,215,-PI*.12,PI*.12,HI,5));
  s+=panel(100,300,label('トルク ＝ 力×腕（2辺分）',PC,155,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,b,b+.08),T('6\\times0.05\\times2=0.6\\ \\mathrm{N\\cdot m}',PC,250,38)),1);
  s+=goalTag(G2);
  return s;
 },
 [K+'niab']:(p,ctx)=>{
  const b=wAt(ctx,'しょうもん',.65);
  let s=coilView({forces:1,flab:'6 N',arms:.5});
  s+=tagBox('N ＝ 巻き数 50',40,96,C.ink,{size:24,g:seg(p,.02,.08)});
  s+=tagBox('A ＝ コイルの面積（0.2 m×0.1 m）',40,480,C.ink,{size:24,g:seg(p,.05,.12)});
  s+=panel(100,330,fade(seg(p,.12,.2),T('NIAB',PC,160,40))
   +fade(seg(p,.18,.26),T('A=0.2\\times0.1=0.02\\ \\mathrm{m^2}',PC,235,32))
   +fade(seg(p,.28,.36),T('50\\times3.0\\times0.02\\times0.2',PC,310,32)+T('=0.6\\ \\mathrm{N\\cdot m}',PC,375,38)),1);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.05));
  return s;
 },
 [K+'wrongA2']:(p,ctx)=>{
  const g=seg(p,.35,.5);
  let s=coilView({forces:1,flab:'6 N',fieldOn:0});
  s+=fade(g,line(480,90,480,500,{color:CF,w:2,dash:'6 7'})+line(180,90,180,500,{color:CF,w:2,dash:'6 7'})+label('作用線',480,110,{size:24,color:CF,anchor:'middle',weight:700})+label('作用線',180,110,{size:24,color:CF,anchor:'middle',weight:700}));
  s+=dbl(180,480,470,HI,'',{g})+fade(g,label('ずれ',330,455,{size:26,color:HI,anchor:'middle',weight:700}));
  s+=wrongCard('A','0 N·m',['合力 0 でも、','作用線が ずれていれば 回る'],{...WOPT,y:150,g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 [K+'wrongCD2']:(p,ctx)=>{
  const d=wAt(ctx,'ディーは',.5);
  let s=coilView({forces:1,flab:'6 N',arms:1});
  s+=wrongSeq(p,ctx,[['C','1.2 N·m','腕を 0.1 m にした（軸からは 0.05 m）'],['D','0.3 N·m','片方の 辺の 力だけを 数えた']],{win:[[0,d],[d,1]],opts:{...WOPT,y:150}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 [K+'goal3']:(p,ctx)=>{
  const t=cueT(ctx);
  let s=bLines(40,620,[110,180,330])+coilView({phi:t*.9,R:120,cy:250,fieldOn:0,axisLab:0});
  s+=battery(330,430,{g:seg(p,.1,.2)});
  s+=fade(seg(p,.1,.2),line(330,262,330,390,{color:C.dim,w:2,dash:'4 6'}));
  s+=panel(100,300,label('小問3',PC,150,{size:28,color:C.dim,anchor:'middle'})+label('モーターが 外へ する 仕事',PC,215,{size:28,color:C.ink,anchor:'middle',weight:700})
   +label('エネルギーの 出どころは？',PC,290,{size:30,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  s+=goalTag(G3,{g:seg(p,.03,.12)});
  return s;
 },
 [K+'nowork']:(p,ctx)=>{
  let s=card(30,90,600,410,label('導線の 中の 電荷（拡大）',330,135,{size:26,color:C.dim,anchor:'middle'}),1);
  s+=rect(70,230,520,110,{fill:CW,fo:.15,stroke:CW,sw:2,rx:8});
  const x=300,y=285;
  s+=arrow(x,y,x+150,y,{color:CV,w:6})+label('𝐯',x+160,y+10,{size:30,color:CV,weight:700});
  s+=arrow(x,y,x,y-105,{color:CF,w:6})+label('q𝐯×𝐁',x+16,y-80,{size:28,color:CF,weight:700});
  s+=fade(seg(p,.1,.2),rightMark(x,y,[1,0],[0,-1],18));
  s+=charge(x,y,1,15);
  s+=fade(seg(p,.25,.35),label('いつも 直角',x,y+100,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=panel(100,330,label('仕事率 ＝ 力・速度',PC,150,{size:26,color:C.dim,anchor:'middle'})+fade(seg(p,.35,.45),gauge(PC,300,{lab:'q𝐯×𝐁 の 仕事率'})),1);
  s+=goalTag(G3);
  return s;
 },
 [K+'backemf']:(p,ctx)=>{
  let s=coil3D({rot:seg(p,.03,.15),emf:seg(p,.4,.5)});
  s+=tagBox('電流（緑）',40,96,CI,{size:24});
  s+=panel(100,330,label('コイルが 回る',PC,150,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.25),label('→ 辺が 磁場の 中を 動く',PC,215,{size:28,color:C.ink,anchor:'middle'}))
   +fade(seg(p,.4,.5),label('→ 逆起電力',PC,285,{size:30,color:CV,anchor:'middle',weight:700})+label('（電流を 妨げる 向き）',PC,335,{size:26,color:C.dim,anchor:'middle'})),1);
  s+=goalTag(G3);
  return s;
 },
 [K+'energy']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=energyScene({g1:seg(p,.05,.2),g2:seg(p,.3,.45)});
  s+=goalTag(G3)+ANS3(seg(p,b,b+.05));
  return s;
 },
 [K+'wrongAB3']:(p,ctx)=>{
  const bb=wAt(ctx,'ビーは',.5);
  let s=energyScene({});
  s+=wrongSeq(p,ctx,[['A','磁場の力が電子に仕事','q𝐯×𝐁 は 速度に 直角で、仕事は 0'],['B','磁石のエネルギー','磁石の 磁場は 弱まらない']],{win:[[0,bb],[bb,1]],opts:{y:360}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 [K+'wrongD3']:(p,ctx)=>{
  const ve=voiceEnd(ctx),out=seg(p,ve,ve+.05);
  let s=fade(1-out,energyScene({})+wrongCard('D','エネルギーは要らない','外へ 仕事を するには エネルギーが 要る',{y:360,g:seg(p,.03,.1)})+goalTag(G3)+ANS3(1));
  const g=seg(p,ve+.04,ve+.12);
  s+=card(120,140,440,200,label('粒子 1個',340,190,{size:26,color:C.dim,anchor:'middle'})+T(`${qq}\\,${bv}\\times${bB}`,340,270,52),g);
  s+=card(640,140,440,200,label('導線 全体',860,190,{size:26,color:C.dim,anchor:'middle'})+T(`${sI}\\,${bl}\\times${bB}`,860,270,52),g);
  s+=answerRow([[1,'D','0.49 m'],[2,'B','0.6 N·m'],[3,'C','']],{g:seg(p,ve+.12,ve+.2)});
  return s;
 },
};
// 電源 → コイル → 外への仕事（エネルギーの流れ）
function energyScene({g1=1,g2=1}={}){
 let s=battery(180,210);
 s+=coilView({cx:600,cy:210,R:70,phi:.5,fieldOn:0,axisLab:0})+label('コイル（モーター）',600,320,{size:26,color:C.ink,anchor:'middle',weight:700});
 s+=fade(g1,arrow(270,210,500,210,{color:CU,w:10,head:24})+label('電源 → コイル',385,180,{size:26,color:CU,anchor:'middle',weight:700}));
 s+=fade(g2,arrow(700,210,930,210,{color:CU,w:10,head:24})+label('外へ 仕事',815,180,{size:26,color:CU,anchor:'middle',weight:700}));
 s+=fade(g2,rect(950,170,120,80,{fill:'#2a3346',fo:.95,stroke:C.dim,sw:2,rx:8})+label('外の物',1010,220,{size:24,color:C.ink,anchor:'middle',weight:700}));
 return s;
}
