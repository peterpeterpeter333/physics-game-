// 問題編 解説「角度を測らずに読む」（q-um-inner-product、大学編 06 内積・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/06_内積.md の q-um-inner-product（解説 15 行）。
// 画面の配置：左に方眼（真上から見た床）、右に説明の枠（表・式）。誤答カードは右の枠の下。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：力 𝐅 緑、移動 Δ𝐫 水色、仕事 橙、角度 θ 白、負の値 赤、x̂・ŷ 紫（単元動画 um-inner-product-1 と同じ）、強調 黄。
// 縮尺（図のために決めた値）：小問1・3 の方眼は 1 目盛り 48 px、小問2 は 25 px。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,sentWin,voiceEnd} from './yt1-qx-common.mjs';

const K='qx-um-inner-product:';
const FC=C.F,LC=C.x,WC=C.E,HC=C.v,CD='#ff6b6b',AL=C.hi;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const cc=(c,s)=>`{\\color{${c}}${s}}`;
const bF=cc(FC,'\\mathbf{F}'),bR=cc(LC,'\\Delta\\mathbf{r}'),hx=cc(HC,'\\hat{x}'),hy=cc(HC,'\\hat{y}'),W_=cc(WC,'W');
const PX=600,PW=580,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const G1T='𝐅 がした仕事',G2T='仕事をしない力',G3T='𝐅 と Δ𝐫 の間の角';
const ANS1=g=>answerTag(1,'B','7 J',{g}),ANS2=g=>answerTag(2,'C','(8, −6) N',{g}),ANS3=g=>answerTag(3,'D','約 75°',{g});
const rad=d=>d*Math.PI/180,deg=r=>r*180/Math.PI;
const AR=deg(Math.atan2(4,3)),AF=deg(Math.atan2(-2,5));   // 53.13°, −21.80°

// ---- 方眼 ----
const GA={ox:150,oy:345,u:46,x0:-1,x1:6,y0:-3,y1:5,nums:1};    // 小問1・3
const GP={...GA,ox:450,oy:340,u:56};                                        // 問題アニメ（中央）
const GB={ox:230,oy:290,u:25,x0:-4,x1:9,y0:-6.6,y1:8,nums:0};   // 小問2
const X=(G,a)=>G.ox+G.u*a,Y=(G,b)=>G.oy-G.u*b;
function grid(G,{g=1,ax=1}={}){
 let s='';
 for(let i=Math.ceil(G.x0);i<=Math.floor(G.x1);i++)s+=line(X(G,i),Y(G,G.y0),X(G,i),Y(G,G.y1),{color:C.grid,w:1.5});
 for(let j=Math.ceil(G.y0);j<=Math.floor(G.y1);j++)s+=line(X(G,G.x0),Y(G,j),X(G,G.x1),Y(G,j),{color:C.grid,w:1.5});
 s+=fade(ax,arrow(X(G,G.x0),G.oy,X(G,G.x1)+26,G.oy,{color:C.dim,w:2.5,head:14})+arrow(G.ox,Y(G,G.y0),G.ox,Y(G,G.y1)-26,{color:C.dim,w:2.5,head:14})
  +label('x：東',X(G,G.x1)+34,G.oy+8,{size:22,color:C.dim})+label('y：北',G.ox+14,Y(G,G.y1)-6,{size:22,color:C.dim}));
 if(G.nums){let n='';for(let i=1;i<=Math.floor(G.x1);i++)n+=label(String(i),X(G,i),G.oy+26,{size:22,color:C.dim,anchor:'middle'});
  for(let j=Math.ceil(G.y0);j<=Math.floor(G.y1);j++)if(j)n+=label(String(j).replace('-','−'),G.ox-10,Y(G,j)+8,{size:22,color:C.dim,anchor:'end'});s+=fade(ax,n);}
 return fade(g,s);
}
const vec=(G,a,b,{color=FC,g=1,w=6,head=18,from=[0,0]}={})=>arrow(X(G,from[0]),Y(G,from[1]),X(G,from[0]+a),Y(G,from[1]+b),{color,g,w,head});
function vecs(G,{gR=1,gF=1,labR=1,labF=1}={}){
 return vec(G,3,4,{color:LC,g:gR})+fade(labR*gR,label('(3, 4) m',X(G,3)+12,Y(G,4)+4,{size:26,color:LC,weight:700}))
  +vec(G,5,-2,{color:FC,g:gF})+fade(labF*gF,label('(5, −2) N',X(G,5)+8,Y(G,-2)+34,{size:26,color:FC,weight:700}));
}
function arcAt(cx,cy,a0,a1,r,{color=C.ink,w=3,g=1,text='',size=28,tr=26}={}){
 const n=30,pts=Array.from({length:n+1},(_,i)=>{const a=rad(a0+(a1-a0)*i/n);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 const m=rad((a0+a1)/2);
 return fade(g,draw(pts,1,{color,w})+(text?label(text,cx+(r+tr)*Math.cos(m),cy-(r+tr)*Math.sin(m)+9,{size,color,anchor:'middle',weight:700}):''));
}
// ---- 2×2 の表（行 5x̂、−2ŷ／列 3x̂、4ŷ）----
const TX=PX+10,HW=130,CWd=220,TY=92,HH=60,RH=96;
const cX=j=>TX+HW+CWd*j,cY=i=>TY+HH+RH*i;
function table({g=1,off=0,diag=0,vals=[0,0],neg=0}={}){
 let s=rect(TX,TY,HW+2*CWd,HH+2*RH,{fill:'#0e1830',fo:.6,stroke:C.faint,sw:2,rx:10});
 s+=line(TX+HW,TY,TX+HW,TY+HH+2*RH,{color:C.faint,w:2})+line(TX,TY+HH,TX+HW+2*CWd,TY+HH,{color:C.faint,w:2})+line(cX(1),TY,cX(1),TY+HH+2*RH,{color:C.faint,w:1.5})+line(TX,cY(1),TX+HW+2*CWd,cY(1),{color:C.faint,w:1.5});
 s+=T(`${cc(LC,'3')}${hx}`,cX(0)+CWd/2,TY+HH/2+6,32)+T(`${cc(LC,'4')}${hy}`,cX(1)+CWd/2,TY+HH/2+6,32);
 s+=T(`${cc(FC,'5')}${hx}`,TX+HW/2,cY(0)+RH/2+6,32)+T(`${cc(FC,'-2')}${hy}`,TX+HW/2,cY(1)+RH/2+6,32);
 const cell=(i,j,src,o=1)=>fade(o,T(src,cX(j)+CWd/2,cY(i)+RH/2+6,28));
 // 対角線：x̂·x̂＝1 → 5×3＝15、ŷ·ŷ＝1 → (−2)×4＝−8
 s+=cell(0,0,`${hx}\\cdot${hx}=1`,1-vals[0])+cell(0,0,`5\\times3=${cc(AL,'15')}`,vals[0]);
 s+=cell(1,1,`${hy}\\cdot${hy}=1`,1-vals[1])+cell(1,1,`(-2)\\times4=${cc(AL,'-8')}`,vals[1]);
 if(neg>0){const w=texWidth(`(-2)\\times4=`,28,false),wt=texWidth(`(-2)\\times4=-8`,28,false),x0=cX(1)+CWd/2-wt/2;
  s+=fade(neg,highlight(x0+w+3,cY(1)+RH/2-24,26,44,1,CD));}
 // 直角で0：灰になって消える
 const og=1-off;
 s+=cell(0,1,`${hx}\\cdot${hy}=0`,og)+cell(1,0,`${hy}\\cdot${hx}=0`,og);
 s+=fade(off*(1-seg(off,.6,1))*.8,rect(cX(1)+4,cY(0)+4,CWd-8,RH-8,{fill:C.faint,fo:.6,stroke:'none'})+rect(cX(0)+4,cY(1)+4,CWd-8,RH-8,{fill:C.faint,fo:.6,stroke:'none'}));
 s+=fade(diag,rect(cX(0)+4,cY(0)+4,CWd-8,RH-8,{fill:'none',fo:0,stroke:AL,sw:3,rx:8})+rect(cX(1)+4,cY(1)+4,CWd-8,RH-8,{fill:'none',fo:0,stroke:AL,sw:3,rx:8}));
 return fade(g,s);
}
const SUMY=TY+HH+2*RH+48;
const sumTex=`15+(-8)=${cc(WC,'7\\ \\mathrm{J}')}`;
// x̂・ŷ（方眼の軸の上）
const hats=(G,g=1)=>fade(g,arrow(G.ox,G.oy,X(G,1),G.oy,{color:HC,w:6,head:16})+arrow(G.ox,G.oy,G.ox,Y(G,1),{color:HC,w:6,head:16})
 +T(hx,X(G,1)-4,G.oy+52,30)+T(hy,G.ox-30,Y(G,1)+6,30));
// x 成分どうし・y 成分どうしを細い線で光らせる
function compHi(G,{gx=0,gy=0}={}){
 let s='';
 s+=fade(gx,line(X(G,5),Y(G,-2),X(G,5),G.oy,{color:AL,w:2,dash:'5 5'})+line(X(G,3),Y(G,4),X(G,3),G.oy,{color:AL,w:2,dash:'5 5'})
  +line(G.ox,G.oy+5,X(G,5),G.oy+5,{color:FC,w:5})+line(G.ox,G.oy-5,X(G,3),G.oy-5,{color:LC,w:5}));
 s+=fade(gy,line(X(G,5),Y(G,-2),G.ox,Y(G,-2),{color:AL,w:2,dash:'5 5'})+line(X(G,3),Y(G,4),G.ox,Y(G,4),{color:AL,w:2,dash:'5 5'})
  +line(G.ox-5,G.oy,G.ox-5,Y(G,-2),{color:FC,w:5})+line(G.ox+5,G.oy,G.ox+5,Y(G,4),{color:LC,w:5}));
 return s;
}
// ---- 小問2 ----
const perpLine=(G,g=1)=>fade(g,line(X(G,-8.8*.95),Y(G,6.6*.95),X(G,8.8),Y(G,-6.6),{color:C.ink,w:2.5,dash:'8 8'})
 +draw([[X(G,0.6*.7),Y(G,0.8*.7)],[X(G,0.6*.7+0.8*.7),Y(G,0.8*.7-0.6*.7)],[X(G,0.8*.7),Y(G,-0.6*.7)]],1,{color:C.ink,w:3}));
const cand=(G,a,b,txt,{g=1,col=FC,val='',vcol=C.ink,dx=10,dy=-8,anchor='start'}={})=>fade(g,vec(G,a,b,{color:col,w:5,head:16})
 +label(txt+(val?`  → ${val}`:''),X(G,a)+dx,Y(G,b)+dy,{size:24,color:val?vcol:col,anchor,weight:700}));
// ---- 小問3：角度のダイヤル ----
function dial(cx,cy,r,{g=1,fill90=0,needle=0,nAng=0,bad=0,labs=1}={}){
 let s=draw(Array.from({length:61},(_,i)=>{const a=Math.PI*i/60;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];}),1,{color:C.dim,w:3})+line(cx-r-10,cy,cx+r+10,cy,{color:C.faint,w:2});
 if(fill90>0){const pts=[[cx,cy],...Array.from({length:31},(_,i)=>{const a=rad(90*i/30);return [cx+r*Math.cos(a),cy-r*Math.sin(a)];})];s+=fade(fill90,poly(pts,{fill:AL,fo:.32}));}
 for(let d=0;d<=180;d+=15){const a=rad(d),L=d%45===0?16:9;s+=line(cx+(r-L)*Math.cos(a),cy-(r-L)*Math.sin(a),cx+r*Math.cos(a),cy-r*Math.sin(a),{color:C.dim,w:2.5});}
 if(labs)for(const d of [0,45,90,135,180]){const a=rad(d);s+=label(`${d}°`,cx+(r+30)*Math.cos(a),cy-(r+30)*Math.sin(a)+8,{size:22,color:C.dim,anchor:'middle'});}
 if(needle>0){const a=rad(nAng);s+=fade(needle,line(cx,cy,cx+(r-20)*Math.cos(a),cy-(r-20)*Math.sin(a),{color:AL,w:6})+dot(cx,cy,8,AL));}
 if(bad>0){const a=rad(105),bx=cx+(r-30)*Math.cos(a),by=cy-(r-30)*Math.sin(a);s+=fade(bad,line(bx-16,by-16,bx+16,by+16,{color:CD,w:5})+line(bx-16,by+16,bx+16,by-16,{color:CD,w:5})+label('105°',bx-24,by-24,{size:24,color:CD,anchor:'end',weight:700}));}
 return fade(g,s);
}
const DIAL={cx:310,cy:440,r:220};

export const ytQxUmInnerProductDiagrams={
 // ===================== 問題アニメ（出題、約6秒）=====================
 // 0〜2 s 方眼と軸、2〜4 s Δ𝐫＝(3, 4) m、4〜6 s 𝐅＝(5, −2) N。内積・角度・直角の線・候補は出さない。
 [K+'q1']:(p)=>grid(GP,{g:seg(p,0,.12),ax:seg(p,.08,.3)})+vecs(GP,{gR:seg(p,.34,.55),labR:seg(p,.52,.62),gF:seg(p,.67,.88),labF:seg(p,.86,.96)}),

 // ===================== 小問1 =====================
 // 1. 出題の静止画
 [K+'goal1']:(p)=>grid(GA)+vecs(GA)+goalTag(G1T,{g:seg(p,.03,.15)}),
 // 2. 方眼の軸に x̂・ŷ → 2×2 の表。「直角で0」で x̂·ŷ・ŷ·x̂ のマスが灰になって消え、対角線に黄の枠
 [K+'table']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,e=W[1]?W[1][1]:.9;
  let s=grid(GA)+vecs(GA)+hats(GA,seg(p,b,b+.08));
  s+=table({g:seg(p,.04,.14),off:seg(p,b+(e-b)*.45,b+(e-b)*.6),diag:seg(p,b+(e-b)*.62,b+(e-b)*.72)});
  s+=fade(seg(p,b+(e-b)*.7,b+(e-b)*.8),label('同じ 軸の 積 だけ が 残る',PC,SUMY,{size:28,color:AL,anchor:'middle',weight:700}));
  return s+goalTag(G1T);
 },
 // 3. 対角線のマスに 15、−8 を順に。そのたびに方眼の x 成分どうし、y 成分どうしを光らせる
 [K+'cells']:(p,ctx)=>{
  const ve=voiceEnd(ctx),v1=seg(p,ve*.12,ve*.3),v2=seg(p,ve*.6,ve*.8);
  let s=grid(GA)+vecs(GA)+compHi(GA,{gx:v1*(1-seg(p,ve*.5,ve*.58)),gy:v2});
  s+=table({off:1,diag:1,vals:[v1,v2]});
  return s+goalTag(G1T);
 },
 // 4. 15＋(−8)＝7 J。「B です」で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=grid(GA)+vecs(GA)+table({off:1,diag:1,vals:[1,1]});
  s+=fade(seg(p,.05,b*.8),T(`${bF}\\cdot${bR}=${sumTex}`,PC,SUMY,40));
  return s+goalTag(G1T)+ANS1(seg(p,b,b+.08));
 },
 // 5. 誤答 A：23 J。表の −8 の負号を赤で光らせる
 [K+'wrongA']:(p,ctx)=>{
  const blink=.55+.45*Math.sin(cueT(ctx)*6);
  let s=grid(GA)+vecs(GA)+table({off:1,diag:1,vals:[1,1],neg:seg(p,.05,.12)*blink});
  s+=wrongCard('A','23 J','−8 の 符号を 落とした（15＋8）',{...WOPT,y:400,g:seg(p,.02,.08)});
  return s+goalTag(G1T)+ANS1(1);
 },
 // 6. 誤答 C（約 26.9 J）→ 誤答 D（(15, −8) J）。1枚ずつ
 [K+'wrongCD']:(p,ctx)=>{
  let s=grid(GA)+vecs(GA)+table({off:1,diag:1,vals:[1,1]});
  s+=wrongSeq(p,ctx,[['C','約 26.9 J',['大きさの 積 √29×5','向きが 揃ったときの 上限']],['D','(15, −8) J',['足さずに 並べた','仕事は 向きの ない 一つの 数']]],{opts:{...WOPT,y:372}});
  return s+goalTag(G1T)+ANS1(1);
 },

 // ===================== 小問2 =====================
 // 7. 表・誤答カード・𝐅 を消し、水色の (3, 4) だけを残す
 [K+'goal2']:(p)=>{
  let s=grid(GB)+vec(GB,3,4,{color:LC})+label('(3, 4) m',X(GB,3)+12,Y(GB,4)+4,{size:24,color:LC,weight:700});
  s+=panel(110,150,label('小問2',PC,155,{size:26,color:C.dim,anchor:'middle'})+label('同じ 移動 (3, 4) m の 間に',PC,200,{size:26,color:C.ink,anchor:'middle'})+label('仕事を しない 力 は？',PC,240,{size:28,color:AL,anchor:'middle',weight:700}),seg(p,.08,.22),AL);
  return s+goalTag(G2T,{g:seg(p,.03,.15)});
 },
 // 8a. 内積が0 ⇔ 移動と直角。(3, 4) に直角な点線と直角の印
 [K+'perp']:(p)=>{
  let s=grid(GB)+vec(GB,3,4,{color:LC})+label('(3, 4) m',X(GB,3)+12,Y(GB,4)+4,{size:24,color:LC,weight:700});
  s+=perpLine(GB,seg(p,.3,.5));
  s+=panel(110,170,label('仕事 ＝ 0',PC,160,{size:30,color:WC,anchor:'middle',weight:700})+label('⇔ 内積 ＝ 0',PC,205,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('⇔ 移動と 直角',PC,250,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25));
  return s+goalTag(G2T);
 },
 // 8b. 候補 (8, −6) が点線に重なる。8×3＋(−6)×4＝24−24＝0。「C です」で答えの札
 [K+'ans2']:(p,ctx)=>{
  const ve=voiceEnd(ctx),b=ve*.72;
  let s=grid(GB)+vec(GB,3,4,{color:LC})+label('(3, 4) m',X(GB,3)+12,Y(GB,4)+4,{size:24,color:LC,weight:700})+perpLine(GB);
  s+=cand(GB,8,-6,'(8, −6)',{g:seg(p,.03,.15),dx:-14,dy:30,anchor:'end'});
  s+=panel(110,170,label('(8, −6) と (3, 4)',PC,155,{size:26,color:C.dim,anchor:'middle'})
   +fade(seg(p,.12,.3),T(`8\\times3+(-6)\\times4`,PC,215,36))+fade(seg(p,.35,.55),T(`=24-24=0`,PC,265,36)),1);
  return s+goalTag(G2T)+ANS2(seg(p,b,b+.08));
 },
 // 9. (6, 8) と (−3, −4)。内積 50、−25。誤答 A → D を1枚ずつ
 [K+'wrongAD']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),h=ve*.5;
  let s=grid(GB)+vec(GB,3,4,{color:LC,w:7})+perpLine(GB,.6)+cand(GB,8,-6,'(8, −6)',{dx:-14,dy:30,anchor:'end',val:'0'});
  s+=cand(GB,6,8,'(6, 8)',{g:seg(p,.03,.12),val:'50',dx:12,dy:6});
  s+=cand(GB,-3,-4,'(−3, −4)',{g:seg(p,h,h+.08),val:'−25',vcol:CD,dx:-60,dy:52});
  s+=panel(96,150,fade(seg(p,.05,.15),T(`(6,8)\\cdot(3,4)=18+32=50`,PC,145,32))+fade(seg(p,h,h+.1),T(`(-3,-4)\\cdot(3,4)=-9-16=${cc(CD,'-25')}`,PC,205,32)),1);
  s+=wrongSeq(p,ctx,[['A','(6, 8) N','同じ 向き。内積 50 で 最大'],['D','(−3, −4) N','逆向き。内積 −25 で 負の 仕事']],{win:[[0,h],[h,1]],opts:{...WOPT,y:262}});
  return s+goalTag(G2T)+ANS2(1);
 },
 // 10. (4, 3) と内積 24。(8, −6) と並べ、「入れ替えて片方の符号を変えると 90° 回る」。誤答 B
 [K+'wrongB']:(p,ctx)=>{
  let s=grid(GB)+vec(GB,3,4,{color:LC,w:7})+perpLine(GB,.6)+cand(GB,8,-6,'(8, −6)',{dx:-14,dy:30,anchor:'end',val:'0'});
  s+=cand(GB,4,3,'(4, 3)',{g:seg(p,.03,.12),val:'24',dx:12,dy:20});
  s+=panel(96,150,fade(seg(p,.05,.15),T(`(4,3)\\cdot(3,4)=12+12=24`,PC,140,32))
   +fade(seg(p,.4,.55),label('入れ替えて 片方の 符号を 変えると',PC,190,{size:24,color:AL,anchor:'middle',weight:700})+label('90° 回る：(3, 4) → (4, −3) の 向き',PC,226,{size:24,color:AL,anchor:'middle',weight:700})),1);
  s+=wrongCard('B','(4, 3) N','入れ替えた だけ。内積 24',{...WOPT,y:262,g:seg(p,.2,.26)});
  return s+goalTag(G2T)+ANS2(1);
 },

 // ===================== 小問3 =====================
 // 11. 𝐅 と Δ𝐫 の間に白の円弧と θ
 [K+'goal3']:(p)=>{
  let s=grid(GA)+vecs(GA)+arcAt(GA.ox,GA.oy,AF,AR,62,{g:seg(p,.15,.35),text:'θ',size:30});
  s+=panel(110,150,label('小問3',PC,155,{size:26,color:C.dim,anchor:'middle'})+label('𝐅 と Δ𝐫 の 間の 角 θ は？',PC,215,{size:30,color:AL,anchor:'middle',weight:700}),seg(p,.08,.2),AL);
  return s+goalTag(G3T,{g:seg(p,.03,.15)});
 },
 // 12. 𝐅·Δ𝐫＝|𝐅||Δ𝐫|cosθ（左辺の 7 を光らせる）→ |Δ𝐫|＝5、|𝐅|＝√29 を代入し cosθ＝7/(5√29)≈0.26
 [K+'cos']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=grid(GA)+vecs(GA,{labR:0,labF:0})+arcAt(GA.ox,GA.oy,AF,AR,62,{text:'θ',size:30});
  s+=fade(seg(p,b,b+.08),label('|Δ𝐫| ＝ 5',X(GA,3)+14,Y(GA,4)+6,{size:26,color:LC,weight:700})+label('|𝐅| ＝ √29',X(GA,5)+8,Y(GA,-2)+36,{size:26,color:FC,weight:700}));
  const e1=`${bF}\\cdot${bR}=|${bF}||${bR}|\\cos\\theta`;
  s+=panel(96,360,T(e1,PC,160,40)
   +fade(seg(p,.25,.35)*(1-seg(p,b,b+.05)),highlight(PC-texWidth(e1,40,false)/2-10,118,texWidth(`${bF}\\cdot${bR}`,40,false)+20,70,1,AL))
   +fade(seg(p,.25,.35),label('＝ 7（小問1）',PC-texWidth(e1,40,false)/2+texWidth(`${bF}\\cdot${bR}`,40,false)/2,225,{size:26,color:AL,anchor:'middle',weight:700}))
   +fade(seg(p,b+.1,b+.3),T(`\\cos\\theta=\\dfrac{7}{5\\sqrt{29}}`,PC-60,330,42))
   +fade(seg(p,b+.4,b+.55),T(`\\approx${cc(AL,'0.26')}`,PC+130,335,42)),1);
  return s+goalTag(G3T);
 },
 // 13. 角度のダイヤル。0°〜90° を黄に塗ってから針が 75° を指す。「D です」で答えの札
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55;
  let s=dial(DIAL.cx,DIAL.cy,DIAL.r,{g:seg(p,0,.08),fill90:seg(p,.1,.2),needle:seg(p,.2,.25),nAng:75*seg(p,.25,b*.85)});
  s+=fade(seg(p,b*.8,b),label('約 75°',DIAL.cx+70,DIAL.cy-70,{size:30,color:AL,weight:700}));
  s+=panel(110,170,T(`\\cos\\theta\\approx0.26`,PC,170,40)+fade(seg(p,b*.7,b*.9),label('与えた 値：cos75° ≈ 0.26',PC,240,{size:26,color:C.dim,anchor:'middle'})),1);
  return s+goalTag(G3T)+ANS3(seg(p,b,b+.08));
 },
 // 14. 「内積＞0 → θ＜90°」。誤答 B（約 105°）。ダイヤルの 105° に赤の ×
 [K+'wrongB3']:(p)=>{
  let s=dial(DIAL.cx,DIAL.cy,DIAL.r,{fill90:1,needle:1,nAng:75,bad:seg(p,.45,.55)});
  s+=panel(96,150,label('内積 ＞ 0 → θ ＜ 90°',PC,170,{size:32,color:AL,anchor:'middle',weight:700}),seg(p,.05,.15),AL);
  s+=wrongCard('B','約 105°','cosθ を −0.26 と した',{...WOPT,y:262,g:seg(p,.45,.52)});
  return s+goalTag(G3T)+ANS3(1);
 },
 // 15. 誤答 A（90°）→ C（約 0.26°）。最後に方眼の2本の矢印・表の 7 J・点線と (8, −6)・ダイヤル 75° を並べて静止
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),ve=voiceEnd(ctx),end=Math.min(1,ve+.02),fin=seg(p,end,end+.06),mid=1-fin;
  let s=fade(mid,dial(DIAL.cx,DIAL.cy,DIAL.r,{fill90:1,needle:1,nAng:75})+panel(96,150,T(`${bF}\\cdot${bR}=7\\neq0`,PC,165,40)+label('→ 直角 では ない',PC,220,{size:26,color:C.dim,anchor:'middle'}),1));
  s+=fade(mid,wrongSeq(p,ctx,[['A','90°',['負の 成分は 直角の 印 では ない','内積は 7']],['C','約 0.26°','cosθ の 値と 角を 取り違えた']],{win:[W[0],[W[1]?W[1][0]:.5,end]],keepLast:false,opts:{...WOPT,y:262}}));
  if(fin>0){
   const g1={ox:70,oy:330,u:30,x0:-0.5,x1:6,y0:-2.5,y1:5,nums:0},g2={ox:600,oy:300,u:16,x0:-4,x1:9,y0:-6.6,y1:8,nums:0};
   let f=card(20,90,370,410,'',1)+card(415,90,370,410,'',1)+card(810,90,370,410,'',1);
   f+=grid(g1,{ax:0})+vec(g1,3,4,{color:LC,w:5,head:14})+vec(g1,5,-2,{color:FC,w:5,head:14})+T(`15+(-8)=${cc(WC,'7\\ \\mathrm{J}')}`,205,470,30);
   f+=grid(g2,{ax:0})+vec(g2,3,4,{color:LC,w:5,head:14})+perpLine(g2)+vec(g2,8,-6,{color:FC,w:5,head:14})+label('(8, −6)：内積 0',600,470,{size:24,color:FC,anchor:'middle',weight:700});
   f+=dial(995,400,140,{fill90:1,needle:1,nAng:75,labs:0})+label('θ ≈ 75°',995,470,{size:28,color:AL,anchor:'middle',weight:700});
   s+=fade(fin,f+answerRow([[1,'B','7 J'],[2,'C','(8, −6) N'],[3,'D','約 75°']]));
  }
  return s+goalTag(G3T,{g:mid})+ANS3(mid);
 },
};
