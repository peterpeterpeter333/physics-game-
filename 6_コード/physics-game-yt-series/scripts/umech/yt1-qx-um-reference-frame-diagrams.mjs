// 問題編 解説「吊り革の傾き、回る台、衛星の高さ」（q-um-reference-frame、大学編 19 慣性力と軌道・中級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/19_慣性力と軌道.md の q-um-reference-frame（解説 21 行）。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 色：位置 x・X・r・R・h 水色、電車の目盛り x′ 黄（凡例を出す）、速度 v・V 紫、加速度 a・A・g 赤、力 F 緑（慣性力は緑の破線）、
//   時間 t 金、ω 桃、角度 θ・Δθ 橙、Δ𝐯 黄。地球 青。
// 図のために決めた値（問題文にない）：行2 の数直線の例 X＝3 m、x′＝4 m、x＝7 m（数値は画面に出さない）。
//   ひもの長さは画面で 170 px（長さは問題に効かない）。円の図の Δθ は 35° に大きく描く（「大きく描いた図」と注記）。
//   衛星の高さ h は見やすさのため大きく描く（「高さは 誇張」と注記）。g–r のグラフは 1/r² の曲線。
import {C,clamp,mix,seg,fmt,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,axes} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongSeq,kindTag,pauseBadge,legend,note,cueT,tAt,sentWin} from './yt1-qx-common.mjs';

const K='qx-um-reference-frame:';
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const col=(c,s)=>`{\\color{${c}}${s}}`;
const EARTH='#4d8fe0',CTH=C.E;
const G1='傾く向きと tanθ',G2='回る人が加える慣性力',G3='衛星の高さでの g';
const ANS1=g=>answerTag(1,'A','後ろへ、tanθ＝0.5',{g}),ANS2=g=>answerTag(2,'C','外向きに 1.8 N',{g}),ANS3=g=>answerTag(3,'D','約 8.1 m/s²',{g});
const xp=col(C.hi,"x'"),xg=col(C.x,'x'),XX=col(C.x,'X'),vp=col(C.v,"v'"),vv=col(C.v,'v'),VV=col(C.v,'V'),ap=col(C.a,"a'"),aa=col(C.a,'a'),AA=col(C.a,'A'),FF=col(C.F,'F');
const TH=col(CTH,'\\theta'),WW=col(C.p,'\\omega'),RR=col(C.x,'r');

function dashArrow(x,y,X,Y,{color=C.F,w=5,g=1,head=18}={}){
 if(g<=0)return '';const XE=mix(x,X,g),YE=mix(y,Y,g),L=Math.hypot(XE-x,YE-y);if(L<2)return '';
 const a=Math.atan2(YE-y,XE-x),h=Math.min(head,L*.6),bx=XE-h*Math.cos(a),by=YE-h*Math.sin(a);
 return line(x,y,bx,by,{color,w,dash:'10 8',cap:'butt'})+`<polygon points="${XE},${YE} ${bx+h*.5*Math.sin(a)},${by-h*.5*Math.cos(a)} ${bx-h*.5*Math.sin(a)},${by+h*.5*Math.cos(a)}" fill="none" stroke="${color}" stroke-width="3"/>`;
}
function person(x,yf,h=60,{color=C.hi}={}){
 const hy=yf-h+10;
 return ring(x,hy,h*.12,{color,w:3,fill:C.bg})+line(x,hy+h*.12,x,yf-h*.32,{color,w:4})+line(x,yf-h*.32,x-h*.14,yf,{color,w:4})+line(x,yf-h*.32,x+h*.14,yf,{color,w:4})
  +line(x,yf-h*.55,x-h*.2,yf-h*.37,{color,w:3.5})+line(x,yf-h*.55,x+h*.2,yf-h*.37,{color,w:3.5});
}
const PX=650,PW=530,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);

// ===== 電車（横から見た図、出題）=====
// 地面に固定した枕木・目印。電車の左端の画面位置 ＝ 90＋30X（X［m］）。
const Xtr=t=>.5*4.9*t*t;
function train({X=0,A=1,q=1,gTag=1}={}){
 let s='';const top=150,fl=400,rail=430,L=90+30*X,W=560;
 s+=line(10,rail,1190,rail,{color:C.dim,w:3});
 for(let k=0;k<40;k++){const x=20+k*30;s+=line(x,rail+2,x-12,rail+16,{color:C.faint,w:2});}
 for(let k=0;k<=12;k++){const x=40+k*100;s+=line(x,rail+20,x,rail+34,{color:C.dim,w:2.5});}
 s+=label('地面の 目印',1180,rail+64,{size:22,color:C.dim,anchor:'end'});
 s+=rect(L,top,W,fl-top,{fill:'#141d33',fo:1,stroke:C.dim,sw:3,rx:14});
 s+=rect(L,fl,W,14,{fill:'#24324f',fo:1,stroke:'none',rx:3});
 [60,130,W-130,W-60].forEach(dx=>{s+=ring(L+dx,fl+20,11,{color:C.dim,w:3,fill:C.bg});});
 const cx=L+W/2,cy=top+22;
 s+=line(L+40,cy,L+W-40,cy,{color:C.dim,w:4})+rect(cx-10,cy,20,14,{fill:C.dim,fo:1,stroke:'none',rx:3});
 if(q)s+=fade(q,label('吊り革（ひもとおもり）：？',cx,cy+70,{size:26,color:C.hi,anchor:'middle',weight:700}));
 if(A)s+=fade(A,arrow(L+W/2-80,top-24,L+W/2+40,top-24,{color:C.a,w:6,head:18})+label('A ＝ 4.9 m/s²',L+W/2+56,top-16,{size:26,color:C.a,weight:700}));
 if(gTag)s+=fade(gTag,label('g ＝ 9.8 m/s²',1180,112,{size:26,color:C.a,anchor:'end',weight:700}));
 return s;
}

// ===== 数直線（行2・3）=====
const NX=m=>80+50*m;
function lines({g=1,gX=1,gP=1,gx=1,dim=0}={}){
 let s='';
 // 電車（略図）とおもり
 const L=NX(-1),R=NX(9);
 s+=rect(L,120,R-L,140,{fill:'#141d33',fo:1,stroke:C.dim,sw:2.5,rx:12});
 s+=line(L+30,138,R-30,138,{color:C.dim,w:3});
 const wx=NX(7);s+=line(wx,140,wx-22,214,{color:C.ink,w:2.5})+ring(wx-22,226,12,{color:C.ink,w:3,fill:'#2a3346'})+dot(wx,140,5,C.dim);
 // 電車の目盛り（黄）
 let ty='';for(let k=-1;k<=6;k++){const x=NX(3+k);ty+=line(x,262,x,274,{color:C.hi,w:2.5})+label(String(k).replace('-','−'),x,298,{size:22,color:C.hi,anchor:'middle'});}
 s+=rect(L,260,R-L,6,{fill:'#24324f',fo:1,stroke:'none'})+ty+label('電車の目盛り x′',R+34,298,{size:22,color:C.hi});
 // 地面の数直線（水色）
 s+=line(30,330,R+20,330,{color:C.x,w:2.5});
 for(let m=-1;m<=11;m++){const x=NX(m);if(x>R+10)continue;s+=line(x,330,x,342,{color:C.x,w:2.5})+label(String(m).replace('-','−'),x,366,{size:22,color:C.x,anchor:'middle'});}
 s+=label('地面 x',R+30,338,{size:22,color:C.x});
 // 矢印
 const ay=405;
 s+=fade(gX,arrow(NX(0),ay,NX(3),ay,{color:C.x,w:5,head:14})+label('X',NX(1.5),ay-10,{size:28,color:C.x,anchor:'middle',weight:700}));
 s+=fade(gP,arrow(NX(3),ay,NX(7),ay,{color:C.hi,w:5,head:14})+label('x′',NX(5),ay-10,{size:28,color:C.hi,anchor:'middle',weight:700}));
 s+=fade(gx,arrow(NX(0),ay+45,NX(7),ay+45,{color:C.x,w:5,head:14})+label('x',NX(7)+14,ay+54,{size:28,color:C.x,weight:700}));
 s+=line(NX(0),330,NX(0),ay+55,{color:C.x,w:1.5,dash:'4 6'})+line(NX(3),266,NX(3),ay+8,{color:C.hi,w:1.5,dash:'4 6'})+line(NX(7),240,NX(7),ay+55,{color:C.dim,w:1.5,dash:'4 6'});
 return fade(g*(1-.45*dim),s);
}
const LEG=(g=1)=>legend([['x′ 黄（車内）',C.hi],['x 水色（地面）',C.x]],24,496,{g,dir:'row'});

// ===== 吊り革の力の図（行5〜8）=====
const TAN=.5,THR=Math.atan(TAN),SL=170,MG=110;
function strapForces(cx,top,{forces=1,split=0,hiH=0,acc=0,inertial=0,tri=0,ang=0,title='',titleColor=C.x,g=1}={}){
 const wx=cx-SL*Math.sin(THR),wy=top+SL*Math.cos(THR);
 let s=line(cx-90,top,cx+90,top,{color:C.dim,w:4})+dot(cx,top,6,C.dim);
 s+=line(cx,top,cx,top+SL+40,{color:C.faint,w:2,dash:'6 6'});
 s+=line(cx,top,wx,wy,{color:C.ink,w:3})+ring(wx,wy,14,{color:C.ink,w:3,fill:'#2a3346'});
 if(ang){const r=60,n=16,pts=Array.from({length:n+1},(_,i)=>{const a=-THR*i/n;return [cx+r*Math.sin(a),top+r*Math.cos(a)];});
  s+=fade(ang,draw(pts,1,{color:CTH,w:4})+T(TH,cx-r*Math.sin(THR/2)-14,top+r*Math.cos(THR/2)+28,30));}
 if(forces){
  s+=arrow(wx,wy+14,wx,wy+MG,{color:C.F,w:6,head:16})+label('重力 mg',wx-12,wy+MG+4,{size:22,color:C.F,anchor:'end',weight:700});
  const tx=wx+MG*TAN,ty=wy-MG;
  s+=arrow(wx+7,wy-14,tx,ty,{color:C.F,w:6,head:16})+label('ひもの力',tx+12,ty+26,{size:22,color:C.F,weight:700});
  if(split){
   s+=fade(split,line(wx,wy,tx,wy,{color:C.F,w:2.5,dash:'6 6'})+line(tx,wy,tx,ty,{color:C.F,w:2.5,dash:'6 6'}));
   s+=fade(split*Math.max(.35,hiH),arrow(wx,wy,tx,wy,{color:C.hi,w:5+3*hiH,head:14})+label('水平成分',tx+10,wy+24,{size:22,color:C.hi,weight:700}));
  }
 }
 if(acc)s+=fade(acc,arrow(wx-30,wy+MG+40,wx+70,wy+MG+40,{color:C.a,w:6,head:16})+label('4.9 m/s²',wx+82,wy+MG+48,{size:24,color:C.a,weight:700}));
 if(inertial)s+=fade(inertial,dashArrow(wx-16,wy,wx-16-MG*TAN,wy,{head:14})+label('慣性力 −mA',wx-16-MG*TAN/2,wy+36,{size:22,color:C.F,anchor:'middle',weight:700}));
 if(tri){ // 3本の矢印を継いで閉じる三角形
  const ox=cx+120,oy=top+60;
  s+=fade(tri,arrow(ox,oy,ox,oy+MG*.8,{color:C.F,w:4,head:12})+dashArrow(ox,oy+MG*.8,ox-MG*.8*TAN,oy+MG*.8,{w:4,head:12})
   +arrow(ox-MG*.8*TAN,oy+MG*.8,ox,oy,{color:C.F,w:4,head:12})+label('閉じる ＝ つり合い',ox+12,oy+MG*.8+30,{size:22,color:C.F,anchor:'middle',weight:700}));
 }
 if(title)s+=label(title,cx,top-24,{size:26,color:titleColor,anchor:'middle',weight:700});
 return fade(g,s);
}
const LCX=330,STOP=140;  // 左の図の留め具
const RCX=900;            // 右の図の留め具

// ===== 回る台（上から見た図）=====
const DX=300,DY=285,DR=185,SC=300; // 1 m ＝ 300 px（球は中心から 0.5 m ＝ 150 px）
function disc({cx=DX,cy=DY,R=DR,rb=150,rot=0,bth=0,ball=1,string=1,marks=1,lab=1,obs=0,g=1,kg=1}={}){
 let s=ring(cx,cy,R,{color:C.dim,w:3,fill:'#1a2438'});
 if(marks)for(let k=0;k<8;k++){const a=rot+k*Math.PI/4;s+=line(cx+R*.82*Math.cos(a),cy-R*.82*Math.sin(a),cx+R*.97*Math.cos(a),cy-R*.97*Math.sin(a),{color:C.dim,w:3});}
 s+=dot(cx,cy,6,C.dim);
 const bx=cx+rb*Math.cos(bth),by=cy-rb*Math.sin(bth);
 if(string)s+=line(cx,cy,bx,by,{color:C.ink,w:2.5});
 if(lab)s+=fade(lab,label('0.5 m',(cx+bx)/2-26*Math.sin(bth),(cy+by)/2-26*Math.cos(bth)+8,{size:24,color:C.x,anchor:'middle',weight:700}));
 if(ball){s+=dot(bx,by,14,C.hi);if(kg)s+=label('0.4 kg',bx+40*Math.cos(bth),by-40*Math.sin(bth)+8,{size:22,color:C.ink,anchor:'middle'});}
 if(obs){const a=rot+Math.PI*1.25,px=cx+R*.75*Math.cos(a),py=cy-R*.75*Math.sin(a);s+=fade(obs,person(px,py+18,40,{color:C.hi}));}
 return fade(g,s);
}
const BTH=Math.PI/2.6; // 止めたときの球の角

// ===== 地球と衛星 =====
const EX=230,EY=300,ER=150,HH=45; // h は誇張（実際は R の 約 1/10）
function earthSat({merge=0,g=1,tag=1,hi=0}={}){
 let s=ring(EX,EY,ER,{color:EARTH,w:3,fill:'#1d3a66'})+label('地球',EX-40,EY+70,{size:26,color:C.ink,anchor:'middle',weight:700});
 const sx=EX+ER+HH;
 s+=rect(sx-10,EY-10,20,20,{fill:C.hi,fo:.9,stroke:C.hi,rx:3})+label('衛星',sx+18,EY-16,{size:24,color:C.hi,weight:700});
 s+=fade(1-merge,arrow(EX,EY,EX+ER,EY,{color:C.x,w:5,head:14})+label('R ＝ 6370 km',EX+ER/2,EY+40,{size:24,color:C.x,anchor:'middle',weight:700})
  +arrow(EX+ER,EY,sx-11,EY,{color:C.x,w:5,head:12})+label('h ＝ 630 km',EX+ER+HH/2+40,EY-50,{size:24,color:C.x,anchor:'middle',weight:700})+line(EX+ER+HH/2,EY-6,EX+ER+HH/2+20,EY-40,{color:C.x,w:2}));
 s+=fade(merge,arrow(EX,EY+2,sx-11,EY+2,{color:C.x,w:7,head:16})+label('r ＝ 7000 km',EX+(ER+HH)/2,EY+40,{size:26,color:C.x,anchor:'middle',weight:700}));
 if(hi)s+=highlight(EX-10,EY-26,ER+HH+20,52,hi,C.x);
 if(tag)s+=fade(tag,label('地表 g ＝ 9.8 m/s²',EX,EY-ER-22,{size:24,color:C.a,anchor:'middle',weight:700}));
 s+=note('高さは 誇張',EX,EY+ER+40);
 return fade(g,s);
}
// g–r のグラフ
function gGraph({g=1,pts=1,x=70,y=470,w=480,h=330,small=0}={}){
 const A=axes({x,y,w,h,xmin:6000,xmax:9000,ymin:0,ymax:12,xlabel:'',ylabel:'',xticks:small?[]:[6370,7000],yticks:small?[]:[8.1,9.8],g,grid:false});
 let s=A.svg+A.plot(r=>9.8*(6370/r)**2,{from:6000,to:9000,color:C.a,w:4});
 if(!small)s+=fade(g,label('g [m/s²]',x+6,y-h-12,{size:22,color:C.a})+label('r [km]',x+w+10,y-14,{size:22,color:C.x,anchor:'end'}));
 const P=(r,c,lab,dx,dy)=>dot(A.X(r),A.Y(9.8*(6370/r)**2),9,c)+line(A.X(r),A.Y(9.8*(6370/r)**2),A.X(r),y,{color:c,w:1.5,dash:'4 5'})+(lab?label(lab,A.X(r)+dx,A.Y(9.8*(6370/r)**2)+dy,{size:22,color:c,weight:700}):'');
 s+=fade(pts,P(6370,C.x,small?'':'地表',14,-12)+P(7000,C.hi,small?'':'衛星 約 8.1',14,-14));
 return fade(g,s);
}

export const ytQxUmReferenceFrameDiagrams={
 // ===================== 問題アニメ =====================
 // 小問1の図（約4秒）：電車が右へ加速し始める（0〜2 s、実時間）。2 s で映像を一時停止。吊り革は留め具と「？」だけ。
 [K+'q1']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),2);
  let s=train({X:Xtr(t)});
  s+=pauseBadge({g:clamp((cueT(ctx)-2)/.3),x:600,y:478});
  return s;
 },
 // 小問2の図（約4秒）：上から見た円い台が回る（0〜3 s、ω＝3 rad/s の実時間）。球は台と一緒に回る。3 s で一時停止。力の矢印なし。
 [K+'q2']:(p,ctx)=>{
  const t=Math.min(cueT(ctx),3),a=3*t-9+BTH;
  let s=disc({rot:a-BTH,bth:a});
  s+=label('上から 見た 図',DX,DY+DR+34,{size:22,color:C.dim,anchor:'middle'});
  s+=label('ω ＝ 3 rad/s',800,220,{size:30,color:C.p,weight:700})+label('（台と 球が 一緒に 回る）',800,265,{size:24,color:C.dim});
  s+=pauseBadge({g:clamp((cueT(ctx)-3)/.3),x:880,y:110});
  return s;
 },
 // 小問3の図（約3秒）：地球と衛星。R と h を別々の矢印。札「地表 g＝9.8」。静止。
 [K+'q3']:(p)=>fade(seg(p,0,.4),earthSat({tag:seg(p,.4,.7)})),

 // ===================== 小問1 =====================
 // 1. 出題中の図（一時停止した電車）。札「求めるもの」
 [K+'goal1']:(p)=>{
  let s=train({X:Xtr(2)})+pauseBadge({x:600,y:478});
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 2. 地面の数直線と電車の目盛り。X・x′ を継ぎ足して x、そして x′＝x−X
 [K+'rel']:(p)=>{
  let s=lines({gX:seg(p,.1,.22),gP:seg(p,.25,.37),gx:seg(p,.4,.52)});
  s+=card(800,96,380,190,fade(seg(p,.5,.62),T(`${xg}=${XX}+${xp}`,990,160,40))+fade(seg(p,.7,.82),T(`${xp}=${xg}-${XX}`,990,240,44)),1);
  s+=LEG(seg(p,.05,.15))+goalTag(G1);
  return s;
 },
 // 3. 右の枠で x′＝x−X →1回微分→ v′＝v−V（紫）→もう1回→ a′＝a−A（赤）。札「V・A は電車の速度・加速度」
 [K+'diff']:(p,ctx)=>{
  let s=lines({dim:1});
  let r=T(`${xp}=${xg}-${XX}`,990,135,38);
  r+=fade(seg(p,.08,.18),arrow(990,160,990,195,{color:C.dim,w:3,head:12})+label('時間で 1回 微分',1005,186,{size:22,color:C.dim}));
  r+=fade(seg(p,.18,.3),T(`${vp}=${vv}-${VV}`,990,235,38));
  r+=fade(seg(p,.4,.5),arrow(990,262,990,297,{color:C.dim,w:3,head:12})+label('もう 1回 微分',1005,288,{size:22,color:C.dim}));
  r+=fade(seg(p,.5,.62),T(`${ap}=${aa}-${AA}`,990,338,38));
  r+=fade(seg(p,.65,.78),label('V・A は 電車の',990,405,{size:24,color:C.ink,anchor:'middle'})+label('速度・加速度',990,438,{size:24,color:C.ink,anchor:'middle'}));
  s+=card(800,90,380,370,r,1);
  s+=LEG()+goalTag(G1);
  return s;
 },
 // 4. 法則 ma＝F に a＝a′＋A を入れ、mA を右辺へ。−mA を緑の破線の枠で囲み「慣性力」
 [K+'eom']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=kindTag('法則',600,120,{g:seg(p,.02,.1),text:'地面（慣性系）で ma＝F'});
  s+=fade(seg(p,.05,.14),T(`m${aa}=${FF}`,600,190,46));
  s+=fade(seg(p,.14,.24),label('a ＝ a′ ＋ A を 入れる',980,195,{size:24,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.2,.32),T(`m(${ap}+${AA})=${FF}`,600,270,46));
  s+=fade(seg(p,.36,.46),label('mA を 右辺へ',980,350,{size:24,color:C.dim,anchor:'middle'}));
  const fin=`m${ap}=${FF}-m${AA}`,w=texWidth(fin,52,false),x0=600-w/2,wm=texWidth(`-m${AA}`,52,false);
  s+=fade(seg(p,.42,.54),T(fin,600,360,52));
  const bx=x0+w-wm-8;
  s+=fade(seg(p,b,b+.08),rect(bx,320,wm+16,74,{fill:C.F,fo:.06,stroke:C.F,sw:3,rx:10}).replace('/>',' stroke-dasharray="10 7"/>')+label('慣性力',bx+(wm+16)/2,440,{size:30,color:C.F,anchor:'middle',weight:700})
   +label('電車の中の 式にだけ 加わる',bx+(wm+16)/2,480,{size:24,color:C.F,anchor:'middle'}));
  s+=goalTag(G1);
  return s;
 },
 // 5. 左に「地面から見た力の図」。重力とひもの力（ひもは後ろへ傾く）。水平成分を光らせる。加速度（赤、右）
 [K+'ground1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=card(20,90,600,415,'',1);
  s+=strapForces(LCX,STOP,{title:'地面から見た力の図',acc:seg(p,.15,.3),split:seg(p,b,b+.1),hiH:seg(p,b+.1,b+.2)});
  s+=goalTag(G1);
  return s;
 },
 // 6. ひもの力の三角形：水平 mA、鉛直 mg、角 θ（鉛直から）。tanθ＝A/g＝4.9÷9.8＝0.5
 [K+'tan']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=card(20,90,600,415,'',1)+strapForces(LCX,STOP,{title:'地面から見た力の図',acc:1,split:1,hiH:0,ang:seg(p,.05,.15)});
  // 右：力の三角形（拡大）
  const ox=720,oy=420,hgt=230,wd=hgt*TAN;
  let r=line(ox,oy,ox+wd,oy,{color:C.hi,w:5})+line(ox+wd,oy,ox+wd,oy-hgt,{color:C.F,w:5})+line(ox,oy,ox+wd,oy-hgt,{color:C.F,w:3,dash:'6 6'});
  r+=label('mA',ox+wd/2,oy+34,{size:28,color:C.hi,anchor:'middle',weight:700})+label('mg',ox+wd+14,oy-hgt/2,{size:28,color:C.F,weight:700});
  r+=label('水平',ox+wd/2,oy+62,{size:22,color:C.dim,anchor:'middle'})+label('鉛直',ox+wd+14,oy-hgt/2+30,{size:22,color:C.dim});
  const n=12,ar=60,pts=Array.from({length:n+1},(_,i)=>{const a=THR*i/n;return [ox+wd-ar*Math.sin(a),oy-hgt+ar*Math.cos(a)];});
  r+=draw(pts,1,{color:CTH,w:4})+T(TH,ox+wd-30,oy-hgt+90,28);
  s+=fade(seg(p,.05,.2),r);
  s+=fade(seg(p,b,b+.08),T(`\\tan${TH}=\\dfrac{m${AA}}{mg}`,1000,170,36));
  s+=fade(seg(p,b+.08,b+.18),T(`=\\dfrac{${AA}}{g}=\\dfrac{4.9}{9.8}`,1000,270,36));
  s+=fade(seg(p,b+.2,b+.3),T(`=0.5`,1000,360,40));
  s+=goalTag(G1);
  return s;
 },
 // 7. 右に「電車から見た力の図」：同じ2力＋慣性力 −mA（左向き、緑の破線）。3本の矢印で閉じる三角形。小問1 の答え A
 [K+'train1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=card(20,90,560,415,'',1)+card(620,90,560,415,'',seg(p,b,b+.08));
  s+=strapForces(300,STOP,{title:'地面から見た力の図',acc:1,split:0,ang:1});
  s+=fade(seg(p,b,b+.1),strapForces(RCX,STOP,{title:'電車から見た力の図',titleColor:C.hi,ang:1,inertial:seg(p,b+.1,b+.2),tri:seg(p,b+.25,b+.35)}));
  const wy=STOP+SL*Math.cos(THR);
  s+=fade(seg(p,b+.38,b+.48),line(300-SL*Math.sin(THR),wy,RCX-SL*Math.sin(THR),wy,{color:C.hi,w:2,dash:'3 8'})+label('同じ 傾き',600,wy-12,{size:22,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.08,.18),label('後ろへ 傾く',110,250,{size:28,color:CTH,anchor:'middle',weight:700}));
  s+=goalTag(G1)+ANS1(seg(p,b-.06,b));
  return s;
 },
 // 8. 誤答 B → C → D を一枚ずつ（左に地面の図）
 [K+'wrong1']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.52],[s0*.52,s0],[W[1]?W[1][0]:s0,1]];
  let s=card(20,90,560,415,'',1)+strapForces(300,STOP,{title:'地面から見た力の図',acc:1,ang:1});
  s+=panel(96,140,label('後ろへ 傾く',PC,140,{size:28,color:CTH,anchor:'middle',weight:700})+T(`\\tan${TH}=\\dfrac{${AA}}{g}=0.5`,PC,200,32),1);
  s+=wrongSeq(p,ctx,[['B','前へ、tanθ＝0.5','慣性力を 加速度と 同じ向きにした'],['C','後ろへ、tanθ＝2','g/A（比が逆）'],['D','傾かない','電車の中の式に −mA を入れ忘れた']],{win:wins,opts:{x:PX-30,w:PW+30,y:260,size:26,whySize:22}});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 出題中の小問2の図（回る台と球、一時停止）
 [K+'goal2']:(p)=>{
  let s=disc({rot:0,bth:BTH});
  s+=label('ω ＝ 3 rad/s',PC,200,{size:30,color:C.p,anchor:'middle',weight:700});
  s+=panel(260,150,label('台と 一緒に 回る 観測者が',PC,315,{size:26,color:C.ink,anchor:'middle'})+label('書き加える 慣性力 は？',PC,365,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 地面から見た図：球が円を描き、速度（紫）1.5 m/s。s＝rθ → v＝r dθ/dt＝rω、0.5×3
 [K+'speed']:(p,ctx)=>{
  const t=tAt(ctx,K+'speed'),a=BTH+.5*t;
  let s=disc({rot:a-BTH,bth:a});
  const bx=DX+150*Math.cos(a),by=DY-150*Math.sin(a),vx=-Math.sin(a),vy=-Math.cos(a);
  s+=fade(seg(p,.1,.2),arrow(bx,by,bx+vx*120,by+vy*120,{color:C.v,w:6,head:16})+label('1.5 m/s',bx+vx*120+(vx<0?-10:10),by+vy*120-10,{size:24,color:C.v,anchor:vx<0?'end':'start',weight:700}));
  s+=label('地面から 見た 図',DX,DY+DR+34,{size:22,color:C.dim,anchor:'middle'});
  s+=panel(96,330,T(`s=${RR}${TH}`,PC,150,34)
   +fade(seg(p,.2,.3),T(`${vv}=${RR}\\dfrac{d${TH}}{dt}=${RR}${WW}`,PC,240,36))
   +fade(seg(p,.45,.6),T(`=0.5\\times3={\\color{${C.v}}1.5\\ \\mathrm{m/s}}`,PC,340,36)),seg(p,.03,.12),C.v);
  s+=goalTag(G2);
  return s;
 },
 // 11a. 速度の矢印は Δt の間に Δθ 回る：根元をそろえて並べ、間の角 Δθ（橙）と Δ𝐯（黄）の細い二等辺三角形
 [K+'turn']:(p,ctx)=>{
  let s=disc({rot:0,bth:BTH,lab:0});
  s+=label('地面から 見た 図',DX,DY+DR+34,{size:22,color:C.dim,anchor:'middle'});
  s+=card(620,90,560,415,dvTri(seg(p,.1,.3),seg(p,.35,.55),seg(p,.55,.7)),1);
  s+=goalTag(G2);
  return s;
 },
 // 11b. |Δ𝐯|≈vΔθ を Δt で割る → vω＝rω²＝4.5（赤）。Δ𝐯 を球の位置へ戻すと中心を向く
 [K+'accel']:(p,ctx)=>{
  let s=disc({rot:0,bth:BTH,lab:0});
  const bx=DX+150*Math.cos(BTH),by=DY-150*Math.sin(BTH),ux=(DX-bx)/150,uy=(DY-by)/150;
  s+=fade(seg(p,.75,.88),arrow(bx+ux*16,by+uy*16,bx+ux*110,by+uy*110,{color:C.a,w:7,head:18})+label('4.5 m/s²',bx+ux*110+14,by+uy*110+30,{size:24,color:C.a,weight:700})
   +label('Δ𝐯 の 向き ＝ 中心',DX,DY+DR+34,{size:24,color:C.hi,anchor:'middle',weight:700}));
  let r=T(`|${col(C.hi,'\\Delta\\mathbf{v}')}|\\approx ${vv}\\,${col(CTH,'\\Delta\\theta')}`,900,140,36);
  r+=fade(seg(p,.12,.22),label('Δt で 割る（Δt を 小さくする）',900,195,{size:22,color:C.dim,anchor:'middle'}));
  r+=fade(seg(p,.18,.3),T(`${aa}=${vv}\\,\\dfrac{${col(CTH,'\\Delta\\theta')}}{${col(C.t,'\\Delta t')}}\\to ${vv}${WW}`,900,260,34));
  r+=fade(seg(p,.38,.5),T(`=${RR}${WW}\\times${WW}=${RR}${WW}^2`,900,340,34));
  r+=fade(seg(p,.55,.68),T(`=0.5\\times9={\\color{${C.a}}4.5\\ \\mathrm{m/s^2}}`,900,425,34));
  s+=card(620,90,560,415,r,1);
  s+=goalTag(G2);
  return s;
 },
 // 12. 中心向きの合力 0.4×4.5＝1.8 N ＝ 糸の力（緑）。札「地面から見た図：力は糸だけ」
 [K+'tension']:(p)=>{
  let s=disc({rot:0,bth:BTH,lab:0});
  const bx=DX+150*Math.cos(BTH),by=DY-150*Math.sin(BTH),ux=(DX-bx)/150,uy=(DY-by)/150;
  s+=fade(seg(p,.1,.25),arrow(bx+ux*16,by+uy*16,bx+ux*110,by+uy*110,{color:C.F,w:7,head:18})+label('糸の力 1.8 N',bx+ux*60+28,by+uy*60-6,{size:24,color:C.F,weight:700}));
  s+=label('地面から 見た 図',DX,DY+DR+34,{size:22,color:C.dim,anchor:'middle'});
  s+=panel(96,300,label('中心向きの 合力',PC,145,{size:26,color:C.dim,anchor:'middle'})+T(`m${aa}=0.4\\times4.5`,PC,215,38)
   +fade(seg(p,.3,.45),T(`={\\color{${C.F}}1.8\\ \\mathrm{N}}`,PC,295,38))
   +fade(seg(p,.5,.65),label('地面から見た図：力は 糸だけ',PC,365,{size:26,color:C.F,anchor:'middle',weight:700})),1,C.F);
  s+=goalTag(G2);
  return s;
 },
 // 13a. 右に「台と一緒に回る人の図」：台の目盛りが止まって見え、球も止まって見える
 [K+'rot1']:(p,ctx)=>{
  const t=tAt(ctx,K+'rot1'),a=3*t*.25;
  let s=twoDiscs(a,{right:seg(p,.05,.2)});
  s+=goalTag(G2);
  return s;
 },
 // 13b. 外向きの緑の破線の矢印（mrω²）。0.4・0.5・9 → 1.8 N。2本の矢印が同じ長さ
 [K+'rot2']:(p,ctx)=>{
  const t=tAt(ctx,K+'rot1'),a=3*t*.25;
  let s=twoDiscs(a,{right:1,out:seg(p,.2,.35),calc:seg(p,.4,.55)});
  s+=goalTag(G2);
  return s;
 },
 // 14. 遠心力（慣性力）。仕切り線を太く。小問2 の答え C
 [K+'cent']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,t=tAt(ctx,K+'rot1'),a=3*t*.25;
  let s=twoDiscs(a,{right:1,out:1,calc:1,name:seg(p,.05,.15),divider:seg(p,b,b+.1)});
  s+=goalTag(G2)+ANS2(seg(p,b-.06,b));
  return s;
 },
 // 15. 誤答 A → B → D を一枚ずつ（左に回る人の図）
 [K+'wrong2']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.5],[s0*.5,s0],[W[1]?W[1][0]:s0,1]];
  let s=card(20,90,600,415,'',1)+rotPic(320,300,{out:1});
  s+=label('台と 一緒に 回る人の 図',320,130,{size:24,color:C.hi,anchor:'middle',weight:700});
  s+=wrongSeq(p,ctx,[['A','中心向き 1.8 N','慣性力を 糸の力と 同じ向きにした'],['B','外向き 0.6 N','mrω（単位 kg·m/s）'],['D','0 N','糸の力 1.8 N と つり合う項が 要る']],{win:wins,opts:{x:PX,w:PW,y:200,size:26,whySize:22}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 16. 出題中の小問3の図（地球と衛星、R と h の矢印）
 [K+'goal3']:(p)=>{
  let s=earthSat({});
  s+=panel(130,170,label('高さ 630 km を 回る 衛星',PC,190,{size:26,color:C.ink,anchor:'middle'})+label('そこでの 重力加速度 は？',PC,245,{size:28,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 17. R と h を足して r＝7000 km。GMm/r² の r を光らせ、地表との比で g(h)＝g×(R/r)²
 [K+'ratio']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=earthSat({merge:seg(p,.1,.3),tag:1});
  let r=T(`${RR}=6370+630=7000\\ \\mathrm{km}`,PC,140,32);
  r+=fade(seg(p,b,b+.1),T(`F=\\dfrac{GMm}{${RR}^2}`,PC,225,36));
  r+=fade(seg(p,b+.15,b+.25),label('地表（r ＝ R）との 比を とる',PC,305,{size:24,color:C.dim,anchor:'middle'}));
  r+=fade(seg(p,b+.25,b+.38),T(`g(h)=g\\times\\left(\\dfrac{R}{${RR}}\\right)^2`,PC,385,38));
  s+=panel(90,340,r,1,C.x);
  s+=goalTag(G3);
  return s;
 },
 // 18. 0.91 → 0.828 → 8.1。g–r のグラフに地表と衛星の点。小問3 の答え D
 [K+'num']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=card(20,90,600,415,'',1)+gGraph({g:seg(p,.05,.15),pts:seg(p,.55,.7)});
  let r=T(`\\dfrac{6370}{7000}=0.91`,PC,150,34);
  r+=fade(seg(p,.18,.3),T(`0.91^2\\approx0.828`,PC,240,34));
  r+=fade(seg(p,.35,.5),T(`9.8\\times0.828\\approx{\\color{${C.a}}8.1\\ \\mathrm{m/s^2}}`,PC,330,34));
  s+=panel(90,300,r,1,C.a);
  s+=goalTag(G3)+ANS3(seg(p,b,b+.06));
  return s;
 },
 // 19. 誤答 A → B → C を一枚ずつ
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),s0=W[0][1],wins=[[0,s0*.5],[s0*.5,s0],[W[1]?W[1][0]:s0,1]];
  let s=card(20,90,600,415,'',1)+gGraph({});
  s+=panel(90,120,T(`9.8\\times\\left(\\dfrac{6370}{7000}\\right)^2\\approx{\\color{${C.a}}8.1}`,PC,150,30),1);
  s+=wrongSeq(p,ctx,[['A','9.8','地表の g のまま'],['B','約 8.9','9.8×0.91（2乗していない）'],['C','0','浮いて見える ≠ 重力 0']],{win:wins,opts:{x:PX,w:PW,y:240,size:26,whySize:22}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },
 // 20. 衛星と中の人が同じ赤の加速度の矢印を持って落ちながら横へ進み、円を描く。札「地表の 約 8 割」
 [K+'fall']:(p,ctx)=>{
  const t=tAt(ctx,K+'fall'),cx=300,cy=285,er=100,ro=170,a=Math.PI/2+.6-.25*t;
  let s=ring(cx,cy,er,{color:EARTH,w:3,fill:'#1d3a66'})+label('地球',cx,cy+9,{size:24,color:C.ink,anchor:'middle',weight:700});
  s+=ring(cx,cy,ro,{color:C.dim,w:2,dash:'6 7'});
  const sx=cx+ro*Math.cos(a),sy=cy-ro*Math.sin(a),ux=-Math.cos(a),uy=Math.sin(a);
  s+=rect(sx-26,sy-26,52,52,{fill:'#2a3346',fo:.95,stroke:C.hi,sw:3,rx:6})+person(sx,sy+18,34,{color:C.ink});
  s+=arrow(sx+ux*30,sy+uy*30,sx+ux*95,sy+uy*95,{color:C.a,w:6,head:16});
  s+=arrow(sx+ux*8-uy*14,sy+uy*8+ux*14,sx+ux*70-uy*14,sy+uy*70+ux*14,{color:C.a,w:4,head:12});
  s+=label('衛星も 人も 同じ 加速度で 落ち続ける',cx,cy+ro+38,{size:24,color:C.a,anchor:'middle',weight:700});
  s+=panel(150,200,label('浮いて見える けれど',PC,210,{size:26,color:C.ink,anchor:'middle'})+fade(seg(p,.4,.55),label('重力は 地表の 約 8 割',PC,280,{size:32,color:C.hi,anchor:'middle',weight:700})),seg(p,.03,.12),C.hi);
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 21. 吊り革の2つの力の図、回る台の2つの図、g–r のグラフを並べ、式につなぐ。答えの札3枚
 [K+'sum']:(p)=>{
  let s='';
  const cw=360,gap=30,x0=30,xs=[0,1,2].map(i=>x0+i*(cw+gap)),y0=96,ch=270;
  const gs=[seg(p,.02,.15),seg(p,.15,.3),seg(p,.3,.45)];
  // 吊り革（小）
  const cx=xs[0]+cw/2,top=y0+50,L=110,wx=cx-L*Math.sin(THR),wy=top+L*Math.cos(THR);
  let a=line(cx-60,top,cx+60,top,{color:C.dim,w:3})+line(cx,top,cx,top+L+20,{color:C.faint,w:2,dash:'5 5'})+line(cx,top,wx,wy,{color:C.ink,w:3})+ring(wx,wy,10,{color:C.ink,w:3,fill:'#2a3346'});
  a+=dashArrow(wx-12,wy,wx-80,wy,{w:4,head:12});
  a+=label('吊り革：後ろへ',cx,y0+32,{size:24,color:CTH,anchor:'middle',weight:700})+label('tanθ ＝ 0.5',cx,y0+240,{size:26,color:CTH,anchor:'middle',weight:700});
  s+=card(xs[0],y0,cw,ch,a,gs[0]);
  // 回る台（小）
  const dx=xs[1]+cw/2,dy=y0+140;
  let b=ring(dx,dy,80,{color:C.dim,w:2.5,fill:'#1a2438'})+dot(dx,dy,4,C.dim)+line(dx,dy,dx+55,dy,{color:C.ink,w:2})+dot(dx+55,dy,9,C.hi);
  b+=arrow(dx+50,dy+14,dx+12,dy+14,{color:C.F,w:4,head:10})+dashArrow(dx+64,dy,dx+120,dy,{w:4,head:12});
  b+=label('回る台：外向き',dx,y0+32,{size:24,color:C.F,anchor:'middle',weight:700})+label('1.8 N',dx,y0+252,{size:26,color:C.F,anchor:'middle',weight:700});
  s+=card(xs[1],y0,cw,ch,b,gs[1]);
  // g–r グラフ（小）
  let c=gGraph({x:xs[2]+50,y:y0+220,w:270,h:150,small:1})+label('衛星の 高さ',xs[2]+cw/2,y0+32,{size:24,color:C.x,anchor:'middle',weight:700})+label('約 8.1 m/s²',xs[2]+cw/2,y0+258,{size:26,color:C.a,anchor:'middle',weight:700});
  s+=card(xs[2],y0,cw,ch,c,gs[2]);
  const fy=y0+ch+40,fh=96;
  s+=fade(gs[1],arrow(xs[0]+cw/2,y0+ch+4,xs[0]+cw/2+90,fy-4,{color:C.dim,w:3,head:12})+arrow(xs[1]+cw/2,y0+ch+4,xs[1]+cw/2-150,fy-4,{color:C.dim,w:3,head:12})
   +card(xs[0]+120,fy,cw+60,fh,T(`m${ap}=${FF}-m${AA}`,xs[0]+150+cw/2,fy+fh/2+4,36),1,C.hi));
  s+=fade(gs[2],arrow(xs[2]+cw/2,y0+ch+4,xs[2]+cw/2,fy-4,{color:C.dim,w:3,head:12})+card(xs[2]-10,fy,cw+20,fh,T(`g(h)=g\\left(\\dfrac{R}{R+h}\\right)^2`,xs[2]+cw/2,fy+fh/2+2,30),1,C.hi));
  s+=answerRow([[1,'A',''],[2,'C',''],[3,'D','']],{g:seg(p,.85,.95)});
  return s;
 },
};

// Δ𝐯 の三角形（行11a）：中心 (900,330) から2本の速度の矢印（長さ 220）、間の角 Δθ（35° に誇張）
function dvTri(g1,g2,g3){
 const ox=860,oy=380,L=230,d=35*Math.PI/180,a1=Math.PI/2+.2,a2=a1+d;
 const t1=[ox+L*Math.cos(a1),oy-L*Math.sin(a1)],t2=[ox+L*Math.cos(a2),oy-L*Math.sin(a2)];
 let s=label('根元を そろえる',900,130,{size:24,color:C.dim,anchor:'middle'});
 s+=fade(g1,arrow(ox,oy,...t1,{color:C.v,w:6,head:16})+arrow(ox,oy,...t2,{color:C.v,w:6,head:16})
  +T(`${col(C.v,'\\mathbf{v}(t)')}`,t1[0]+60,t1[1]+30,28)+T(`${col(C.v,'\\mathbf{v}(t+\\Delta t)')}`,t2[0]-40,t2[1]-20,28));
 const n=12,r=70,pts=Array.from({length:n+1},(_,i)=>{const a=a1+d*i/n;return [ox+r*Math.cos(a),oy-r*Math.sin(a)];});
 s+=fade(g2,draw(pts,1,{color:CTH,w:4})+T(col(CTH,'\\Delta\\theta'),ox-38,oy-82,28));
 s+=fade(g3,arrow(...t1,...t2,{color:C.hi,w:6,head:14})+T(col(C.hi,'\\Delta\\mathbf{v}'),(t1[0]+t2[0])/2+6,(t1[1]+t2[1])/2-22,28)
  +label('長さ ≈ v × Δθ',1060,300,{size:24,color:C.hi,anchor:'middle',weight:700})+label('（細い 二等辺三角形）',1060,335,{size:22,color:C.dim,anchor:'middle'}));
 s+=note('（角 Δθ は 大きく描いた図）',900,480);
 return s;
}
// 回る人の図（球は止まって見える）：糸の力（緑、中心向き）と外向きの破線
function rotPic(cx,cy,{out=0,calc=0,name=0,R=140,rb=105}={}){
 let s=disc({cx,cy,R,rb,rot:0,bth:0,lab:0,kg:0,obs:1});
 const bx=cx+rb,by=cy;
 s+=arrow(bx-16,by+14,bx-90,by+14,{color:C.F,w:6,head:16})+label('糸の力',bx-56,by+48,{size:22,color:C.F,anchor:'middle',weight:700});
 if(out)s+=fade(out,dashArrow(bx+16,by,bx+90,by,{head:16})+label(name?'遠心力（慣性力）':'外向き',bx+56,by-24,{size:22,color:C.F,anchor:'middle',weight:700}));
 if(calc)s+=fade(calc,T(`m${RR}${WW}^2=0.4\\times0.5\\times9=1.8\\ \\mathrm{N}`,cx+20,cy+R+30,28));
 return s;
}
// 左：地面から見た図（球が回る）、右：台と一緒に回る人の図（止まって見える）
function twoDiscs(a,{right=1,out=0,calc=0,name=0,divider=0}={}){
 let s=card(20,90,560,415,'',1);
 s+=disc({cx:300,cy:300,R:150,rb:110,rot:a,bth:a,lab:0,kg:0});
 const bx=300+110*Math.cos(a),by=300-110*Math.sin(a),ux=-Math.cos(a),uy=Math.sin(a);
 s+=arrow(bx+ux*16,by+uy*16,bx+ux*90,by+uy*90,{color:C.F,w:6,head:16});
 s+=label('地面から見た図：糸の力だけ',300,130,{size:24,color:C.x,anchor:'middle',weight:700});
 s+=fade(right,card(620,90,560,415,label('台と 一緒に 回る人の 図',900,125,{size:24,color:C.hi,anchor:'middle',weight:700})+label('（球は 止まって 見える）',900,158,{size:22,color:C.dim,anchor:'middle'}),1,C.hi)+rotPic(880,310,{out,calc,name}));
 s+=line(600,96,600,500,{color:divider?C.ink:C.faint,w:2+5*divider});
 return s;
}
