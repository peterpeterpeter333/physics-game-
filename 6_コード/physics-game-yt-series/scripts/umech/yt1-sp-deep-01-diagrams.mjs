// 深掘りショート 01（ys-deep-01）「水に入れたストローは、なぜ折れて見える？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形・光の計算は yt1-sp-deep-common.mjs。値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-01.mjs の冒頭。
// 後の回で使い回せるように、コップとストロー（strawScene）・茶わんとコイン（coinScene）・屈折の円（snellFigure）・波の列（waveFronts）を export する。
import {C,seg,lin,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,GLASS,N_WATER,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,eye,snellR,surfacePoint,apparent} from './yt1-sp-deep-common.mjs';

const K='deep01-',DEG=Math.PI/180;
const STRAW='#ff8a7e',COIN='#e8b84a',MUD='#5a3a22',PAVE='#2a3346';
const n2=v=>Number(v.toFixed(1));
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx); // 声の割合（1 を越えてよい）

// ================= コップとストロー =================
export const CUP={top:170,bot:800,lt:180,rt:820,lb:230,rb:770,ys:400};
export const S_EYE=[90,120];
const SA=[800,90],SS=[600,400],ST=[SS[0]+.75*(SS[0]-SA[0]),SS[1]+.75*(SS[1]-SA[1])]; // ストローの上の端・水面の点・先（450,632.5）
const cupX=(y,side)=>side<0?CUP.lt+(CUP.lb-CUP.lt)*(y-CUP.top)/(CUP.bot-CUP.top):CUP.rt+(CUP.rb-CUP.rt)*(y-CUP.top)/(CUP.bot-CUP.top);
function cupBack(){
 const ys=CUP.ys;
 let s=poly([[cupX(ys,-1),ys],[CUP.lb,CUP.bot],[CUP.rb,CUP.bot],[cupX(ys,1),ys]],{fill:WATER,fo:.22,stroke:'none'});
 s+=line(cupX(ys,-1),ys,cupX(ys,1),ys,{color:SURF,w:4});
 return s;
}
function cupFront(){
 return draw([[CUP.lt,CUP.top],[CUP.lb,CUP.bot],[CUP.rb,CUP.bot],[CUP.rt,CUP.top]],1,{color:GLASS,w:5})+label('水',700,760,{size:40,color:SURF,weight:700});
}
// ストローの点（0＝上の端、1＝先）。off＝ずらし。look＝true なら水の中の部分を「見える位置」に描く
function strawPts(off=[0,0],look=true){
 const pts=[];for(let i=0;i<=48;i++){const u=i/48,q=[SA[0]+(ST[0]-SA[0])*u+off[0],SA[1]+(ST[1]-SA[1])*u+off[1]];
  pts.push(look&&q[1]>CUP.ys+.5?apparent(q,S_EYE,CUP.ys):q);}
 return pts;
}
const strawLine=(pts,{opacity=1,dash=''}={})=>draw(pts,1,{color:STRAW,w:18,opacity,dash});
// 先から目への光の道
const PT=[surfacePoint(ST,S_EYE,CUP.ys),CUP.ys];
const STA=apparent(ST,S_EYE,CUP.ys); // 見かけの先（450, 約553）
function strawRay(g,{bend=1}={}){
 if(g<=0)return '';
 let s=draw([ST,PT,S_EYE],g,{color:LIGHT,w:6});
 const a=seg(g,.25,.45),b=seg(g,.8,1);
 s+=fade(a,arrow(mix(ST[0],PT[0],.35),mix(ST[1],PT[1],.35),mix(ST[0],PT[0],.6),mix(ST[1],PT[1],.6),{color:LIGHT,w:6,head:22}));
 s+=fade(b,arrow(mix(PT[0],S_EYE[0],.35),mix(PT[1],S_EYE[1],.35),mix(PT[0],S_EYE[0],.6),mix(PT[1],S_EYE[1],.6),{color:LIGHT,w:6,head:22}));
 s+=fade(seg(g,.4,.6),ring(PT[0],PT[1],30,{color:HC,w:5}))+fade(seg(g,.4,.6)*bend,plate('ここで 曲がる',PT[0]+40,PT[1]-36,{size:38,color:HC}));
 return s;
}
function eyeMark(){return eye(S_EYE[0],S_EYE[1],Math.atan2(SS[1]-S_EYE[1],SS[0]-S_EYE[0]))+label('目',S_EYE[0]+70,S_EYE[1]-30,{size:40,weight:700});}
export function strawScene({look=true,off=[0,0],ray=0,image=0,realGhost=0,bend=1}={}){
 let s=cupBack();
 if(image>0){
  // 目からまっすぐ延ばした線（点線）と、浮いて見えるストロー
  s+=fade(seg(image,0,.35),draw([S_EYE,PT,STA],seg(image,0,.35),{color:HC,w:4,dash:'12 10'}));
  s+=fade(seg(image,.3,.55)*realGhost,draw(strawPts([0,0],false).filter(q=>q[1]>=CUP.ys-1),1,{color:STRAW,w:4,dash:'10 10',opacity:.8}));
  s+=fade(seg(image,.35,.6),strawLine(strawPts([0,0],true)));
  s+=fade(seg(image,.55,.8),label('浮き上がって',530,520,{size:38,color:HC,weight:700})+label('見える',530,566,{size:38,color:HC,weight:700}));
  s+=fade(seg(image,.3,.55)*realGhost,label('本当の 位置',ST[0]+30,ST[1]+70,{size:36,color:STRAW}));
  s+=strawLine(strawPts([0,0],false).filter(q=>q[1]<=CUP.ys+1));
  s+=fade(1-seg(image,.3,.55),strawLine(strawPts([0,0],false).filter(q=>q[1]>=CUP.ys-1)));
 }else s+=strawLine(strawPts(off,look));
 s+=strawRay(ray,{bend});
 s+=cupFront()+eyeMark();
 return s;
}

// ================= 茶わんとコイン =================
export const BOWL={rimY:420,bot:700,l:300,r:880,flat:140};
const bowlX=(y,side)=>{const q=clamp((y-BOWL.rimY)/(BOWL.bot-BOWL.rimY));return side<0?BOWL.l+BOWL.flat*q**3:BOWL.r-BOWL.flat*q**3;};
export const C_EYE_LOW=[83,224],C_EYE_HIGH=[83,120];
const COINX=560,COINY=693,CW2=40;
const RIM=[BOWL.l,BOWL.rimY];
// 水面 L のとき、点 q（コインの上）から目に光が届くか（縁 x=300 を越えるか）
function reaches(q,L,e=C_EYE_LOW){
 if(L>=q[1]-2)return false;
 const x=surfacePoint(q,e,L);if(x<bowlX(L,-1))return false;
 const yAt=e[1]+(L-e[1])*(RIM[0]-e[0])/(x-e[0]);return yAt<RIM[1];
}
// コインの中心が見え始める水面（二分法）
const L_SHOW=(()=>{let lo=460,hi=690;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(reaches([COINX,COINY],m))lo=m;else hi=m;}return lo;})();
export const L_FULL=460;
const PC=[surfacePoint([COINX,COINY],C_EYE_LOW,L_FULL),L_FULL];
const CA=apparent([COINX,COINY],C_EYE_LOW,L_FULL); // 見かけのコイン（560, 約598）
function bowl(L){
 let s='';
 const pts=[];for(let y=BOWL.rimY;y<=BOWL.bot;y+=10)pts.push([bowlX(y,-1),y]);
 const ptsR=[];for(let y=BOWL.bot;y>=BOWL.rimY;y-=10)ptsR.push([bowlX(y,1),y]);
 s+=poly([...pts,...ptsR],{fill:'#16203a',fo:1,stroke:'none'});
 if(L<BOWL.bot-1){const wl=[];for(let y=L;y<=BOWL.bot;y+=6)wl.push([bowlX(y,-1),y]);const wr=[];for(let y=BOWL.bot;y>=L;y-=6)wr.push([bowlX(y,1),y]);
  s+=poly([...wl,[bowlX(BOWL.bot,-1),BOWL.bot],...wr,[bowlX(L,1),L]],{fill:WATER,fo:.28,stroke:'none'})+line(bowlX(L,-1),L,bowlX(L,1),L,{color:SURF,w:4});}
 return s;
}
const bowlFront=()=>draw([...Array.from({length:29},(_,i)=>[bowlX(BOWL.rimY+i*10,-1),BOWL.rimY+i*10]),...Array.from({length:29},(_,i)=>[bowlX(BOWL.bot-i*10,1),BOWL.bot-i*10])],1,{color:'#d8c7a8',w:7})+rect(500,BOWL.bot,180,22,{fill:'#d8c7a8',fo:.5,stroke:'#d8c7a8',rx:4});
const coin=(x,y,{g=1,ghost=false,glow=0}={})=>fade(g,(glow>0?`<ellipse cx="${x}" cy="${n2(y)}" rx="${CW2+22}" ry="22" fill="${HC}" fill-opacity="${n2(.25*glow)}"/>`:'')+`<ellipse cx="${x}" cy="${n2(y)}" rx="${CW2}" ry="10" fill="${COIN}" fill-opacity="${ghost?.45:1}" stroke="${ghost?HC:'#fff1b8'}" stroke-width="3"${ghost?' stroke-dasharray="8 6"':''}/>`);
export function coinScene({eyeY=C_EYE_LOW[1],L=BOWL.bot+1,sight=1,ray=0,image=0,hiddenTag=0,seenTag=0}={}){
 const e=[C_EYE_LOW[0],eyeY];
 let s=bowl(L);
 const vis=L<BOWL.bot?clamp((L_SHOW-L)/18):0;
 s+=coin(COINX,COINY,{glow:Math.max(vis*(1-ray),0)});
 // 縁をかすめる目の線（点線）：底まで
 if(sight>0){const k=(BOWL.bot-e[1])/(RIM[1]-e[1]),G=[e[0]+(RIM[0]-e[0])*k,BOWL.bot];s+=fade(sight*.85,line(e[0],e[1],G[0],G[1],{color:C.dim,w:3,dash:'12 10'}));}
 s+=bowlFront();
 if(ray>0){
  s+=draw([[COINX,COINY-6],PC,C_EYE_LOW],ray,{color:LIGHT,w:6});
  s+=fade(seg(ray,.3,.5),arrow(mix(COINX,PC[0],.3),mix(COINY,PC[1],.3),mix(COINX,PC[0],.62),mix(COINY,PC[1],.62),{color:LIGHT,w:6,head:22}));
  s+=fade(seg(ray,.8,1),arrow(mix(PC[0],C_EYE_LOW[0],.25),mix(PC[1],C_EYE_LOW[1],.25),mix(PC[0],C_EYE_LOW[0],.55),mix(PC[1],C_EYE_LOW[1],.55),{color:LIGHT,w:6,head:22}));
  s+=fade(seg(ray,.4,.6)*(1-image),ring(PC[0],PC[1],28,{color:HC,w:5})+label('水面で 曲がる',600,530,{size:38,color:HC,weight:700}));
  s+=fade(seg(ray,.75,.95)*(1-image),label('縁を 越える',40,500,{size:38,color:LIGHT,weight:700}));
 }
 if(image>0){
  s+=draw([C_EYE_LOW,PC,CA],seg(image,0,.4),{color:HC,w:4,dash:'12 10'});
  s+=fade(seg(image,0,.3),label('目は まっすぐ 来たと 思う',40,140,{size:38,color:HC,weight:700}));
  s+=coin(COINX,CA[1],{g:seg(image,.5,.7),ghost:true});
  s+=fade(seg(image,.55,.75),arrow(COINX,COINY-22,COINX,CA[1]+18,{color:HC,w:4,head:16}));
  s+=fade(seg(image,.6,.8),label('浅く 見える',COINX+60,CA[1]+12,{size:38,color:HC,weight:700}));
  s+=fade(seg(image,.6,.8),label('本当の 位置',COINX,BOWL.bot+90,{size:36,color:COIN,anchor:'middle'}));
 }
 s+=eye(e[0],e[1],Math.atan2(RIM[1]-e[1],RIM[0]-e[0]))+label('目',e[0]-30,e[1]+80,{size:40,weight:700});
 s+=fade(hiddenTag,label('コインは 縁の 陰',560,820,{size:38,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(seenTag*vis,label('見えてきた',COINX,620,{size:40,color:HC,anchor:'middle',weight:700}));
 s+=label('茶わん',880,380,{size:36,color:'#d8c7a8',anchor:'end'});
 s+=tag('実験',960,60,{anchor:'end'});
 return s;
}

// ================= 年表と角度の表 =================
const YX=y=>60+880*y/2000,BANDY=150;
const ANG=[10,20,30,40,50,60,70],RW=ANG.map(i=>Math.asin(Math.sin(i*DEG)/N_WATER)/DEG); // 7.5,14.9,22.1,28.9,35.2,40.6,45.0
function band(g){
 let s=draw([[YX(0),BANDY],[YX(2000),BANDY]],g,{color:C.dim,w:6});
 s+=fade(seg(g,.5,1),[500,1000,1500,2000].map(y=>line(YX(y),BANDY-12,YX(y),BANDY+12,{color:C.dim,w:3})+label(y===2000?'2000年':String(y),YX(y),BANDY-28,{size:36,color:C.dim,anchor:y===2000?'end':'middle'})).join(''));
 return s;
}
const marker=(year,text,g,{y=BANDY+78,anchor='middle',x}={})=>fade(g,dot(YX(year),BANDY,13,HC)+label(text,x??YX(year),y,{size:38,color:HC,anchor,weight:700}));
const ptol=(g=1)=>marker(150,'プトレマイオス',g,{x:60,anchor:'start'})+fade(g,label('2世紀',YX(150),BANDY-28,{size:36,color:HC,anchor:'middle',weight:700}));
function rayDiagram(i,g){
 const O=[500,430],r=snellR(i*DEG),L1=170,L2=130;
 let s=rect(220,O[1],560,130,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(220,O[1],780,O[1],{color:SURF,w:4});
 s+=line(O[0],O[1]-150,O[0],O[1]+130,{color:C.dim,w:3,dash:'10 8'});
 const A=[O[0]-L1*Math.sin(i*DEG),O[1]-L1*Math.cos(i*DEG)],B=[O[0]+L2*Math.sin(r),O[1]+L2*Math.cos(r)];
 s+=line(A[0],A[1],O[0],O[1],{color:LIGHT,w:6})+arrow(O[0],O[1],B[0],B[1],{color:LIGHT,w:6,head:20});
 const arc=(a0,a1,rad,col)=>{const pts=[];for(let k=0;k<=20;k++){const a=a0+(a1-a0)*k/20;pts.push([O[0]+rad*Math.sin(a),O[1]-rad*Math.cos(a)]);}return draw(pts,1,{color:col,w:4});};
 s+=arc(0,-i*DEG,80,HC)+arc(Math.PI,Math.PI-r,80,C.x);
 s+=label(`${Math.round(i)}°`,O[0]-30,O[1]-96,{size:36,color:HC,anchor:'end',weight:700})+label('入る角',O[0]-110,O[1]-110,{size:36,color:HC,weight:700,anchor:'end'});
 s+=label(`${Math.round(r/DEG)}°`,O[0]+34,O[1]+118,{size:36,color:C.x,weight:700})+label('曲がった後の角',O[0]+110,O[1]+118,{size:36,color:C.x,weight:700});
 s+=label('空気',230,O[1]-20,{size:36,color:C.dim})+label('水',230,O[1]+50,{size:36,color:SURF});
 return fade(g,s);
}
const TX=k=>275+88*k;
function table(g,{y0=630,show=7,hl=[]}={}){
 let s=rect(40,y0-50,800,190,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:12});
 s+=label('入る角',60,y0+12,{size:36,color:HC,weight:700})+label('曲がった後',60,y0+102,{size:36,color:C.x,weight:700});
 s+=line(55,y0+46,825,y0+46,{color:C.faint,w:2});
 ANG.forEach((a,k)=>{const gk=clamp(show-k);if(gk<=0)return;
  const h=hl.includes(a);
  s+=fade(gk,(h?rect(TX(k)-42,y0-40,84,170,{fill:HC,fo:.12,stroke:HC,sw:3,rx:10}):'')+label(`${a}°`,TX(k),y0+12,{size:36,color:HC,anchor:'middle',weight:700})+label(`${Math.round(RW[k])}°`,TX(k),y0+102,{size:36,color:C.x,anchor:'middle',weight:700}));});
 s+=tag('今の値',60,y0+200,{size:36,text:'水の場合',g:seg(show,1,2)});
 return fade(g,s);
}

// ================= 円と縦の線（横のずれ） =================
export const SN={O:[470,470],R:300};
export function snellFigure(i,{base=1,vline=1,circle=1,pts=0,meas=0,ratio=0,angle=0,dim=0}={}){
 const {O,R}=SN,r=snellR(i*DEG);
 const A=[O[0]-R*Math.sin(i*DEG),O[1]-R*Math.cos(i*DEG)],B=[O[0]+R*Math.sin(r),O[1]+R*Math.cos(r)];
 let s=fade(base,rect(0,O[1],W,H-O[1],{fill:WATER,fo:.18,stroke:'none',rx:0})+line(0,O[1],W,O[1],{color:SURF,w:4})+label('空気',40,O[1]-24,{size:36,color:C.dim})+label('水',40,O[1]+56,{size:36,color:SURF}));
 s+=draw([[O[0],O[1]-350],[O[0],O[1]+350]],vline,{color:C.dim,w:3,dash:'12 9'})+fade(seg(vline,.6,1),label('縦の線',O[0]+16,O[1]-320,{size:36,color:C.dim}));
 if(circle>0){const cp=[];for(let k=0;k<=72;k++){const a=-Math.PI/2-2*Math.PI*k/72;cp.push([O[0]+R*Math.cos(a),O[1]+R*Math.sin(a)]);}s+=draw(cp,circle,{color:'#8aa0c4',w:3});}
 s+=fade(base,line(A[0],A[1],O[0],O[1],{color:LIGHT,w:6})+line(O[0],O[1],B[0],B[1],{color:LIGHT,w:6})+arrow(mix(A[0],O[0],.3),mix(A[1],O[1],.3),mix(A[0],O[0],.6),mix(A[1],O[1],.6),{color:LIGHT,w:6,head:20})+arrow(mix(O[0],B[0],.3),mix(O[1],B[1],.3),mix(O[0],B[0],.6),mix(O[1],B[1],.6),{color:LIGHT,w:6,head:20}));
 s+=fade(base,dot(O[0],O[1],9,LIGHT));
 s+=fade(pts,dot(A[0],A[1],12,HC)+dot(B[0],B[1],12,HC));
 if(meas>0){
  s+=draw([A,[O[0],A[1]]],meas,{color:HC,w:9})+draw([B,[O[0],B[1]]],seg(meas,.3,1),{color:HC,w:9});
  s+=fade(seg(meas,.5,1),label('空気の側',(A[0]+O[0])/2,A[1]-22,{size:38,color:HC,anchor:'middle',weight:700})+label('水の側',(B[0]+O[0])/2,B[1]+56,{size:38,color:HC,anchor:'middle',weight:700}));
 }
 if(angle>0)s+=fade(angle,label(`入る角 ${Math.round(i)}°`,40,70,{size:40,color:C.ink,weight:700}));
 if(ratio>0){const v=Math.sin(i*DEG)/Math.sin(r);
  s+=fade(ratio,rect(40,838,700,72,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14})+label(`空気の側 ÷ 水の側 ＝ ${v.toFixed(2)}`,390,890,{size:42,color:HC,anchor:'middle',weight:700}));}
 if(dim>0)s=fade(1-.75*dim,s);
 return s;
}
// 13b：角度を動かす 40°→60°→20°→40°
function sweepAngle(t,ve){const u=clamp(t/ve);
 if(u<.15)return 40;if(u<.4)return mix(40,60,seg(u,.15,.4));if(u<.7)return mix(60,20,seg(u,.4,.7));if(u<.92)return mix(20,40,seg(u,.7,.92));return 40;}

// ================= ぬかるみの列・光の列（同じ計算） =================
// 平行な道（面を x_j で横切る）を進む点：位相 Φ（空気の中の道のり）。面の上は向き d1、下は向き d2 で速さ 1/n。
const I0=45*DEG,R0=snellR(I0),D1=[Math.sin(I0),Math.cos(I0)],D2=[Math.sin(R0),Math.cos(R0)];
export function onRay(xe,ys,phi,Phi,n=N_WATER){
 return Phi<=phi?[xe-D1[0]*(phi-Phi),ys-D1[1]*(phi-Phi)]:[xe+D2[0]*(Phi-phi)/n,ys+D2[1]*(Phi-phi)/n];
}
const WY=430,WX0=300,WSP=78,NP=6,RG=120;
const wx=j=>WX0+j*WSP/Math.cos(I0),wphi=j=>(wx(j)-WX0)*Math.sin(I0);
function ground(){
 let s=rect(0,0,W,WY,{fill:PAVE,fo:.9,stroke:'none',rx:0});
 for(let x=-400;x<W;x+=90)s+=line(x,0,x+WY,WY,{color:'#34405a',w:2});
 s+=rect(0,WY,W,H-WY,{fill:MUD,fo:.85,stroke:'none',rx:0});
 [[150,600,60],[620,820,80],[820,560,50],[360,860,45]].forEach(([x,y,r])=>{s+=`<ellipse cx="${x}" cy="${y}" rx="${r*1.6}" ry="${r*.5}" fill="#3e2716" fill-opacity=".8"/>`;});
 s+=line(0,WY,W,WY,{color:'#c9a77c',w:4});
 s+=label('舗装',960,70,{size:38,color:'#c4cde0',anchor:'end',weight:700})+label('ぬかるみ',40,WY+60,{size:38,color:'#e2c49c',weight:700});
 return s;
}
function marchers(Phi0,{trail=1,hlg=0,hlText=0}={}){
 let s='';
 for(let m=2;m>=0;m--){const Phi=Phi0-m*RG,P=Array.from({length:NP},(_,j)=>onRay(wx(j),WY,wphi(j),Phi));
  if(trail>0)for(let j=0;j<NP;j++){const st=onRay(wx(j),WY,wphi(j),-240-m*RG);s+=fade(.25*trail,draw(wphi(j)<Phi?[st,[wx(j),WY],P[j]]:[st,P[j]],1,{color:'#e8eef8',w:2,dash:'4 8'}));}
  s+=draw(P,1,{color:C.x,w:4,opacity:.8});
  P.forEach(q=>{s+=dot(q[0],q[1],16,'#e8eef8')+dot(q[0],q[1]-4,6,'#9aabc7');});
  if(m===0&&hlg>0){const q=P[0];s+=fade(hlg,ring(q[0],q[1],30,{color:HC,w:5}));
   s+=fade(hlText,label('先に 入った',q[0]-10,q[1]+80,{size:36,color:HC,anchor:'middle',weight:700})+label('端の 人',q[0]-10,q[1]+124,{size:36,color:HC,anchor:'middle',weight:700}));}
 }
 return s;
}
// 光の列（波の山の線）：幅のある光の束の中だけに描く
const BX0=230,BX1=BX0+340/Math.cos(I0);
export function waveFronts(t,{g=1,lam=80,speed=60,arrows=0,showLabel=1}={}){
 const phiR=(BX1-BX0)*Math.sin(I0);let s='';
 const off=(t*speed)%lam;
 for(let m=-10;m<=16;m++){const Phi=m*lam+off;
  const pL=onRay(BX0,WY,0,Phi),pR=onRay(BX1,WY,phiR,Phi);
  const pts=Phi>0&&Phi<phiR?[pL,[BX0+Phi/Math.sin(I0),WY],pR]:[pL,pR];
  if(Math.max(pL[1],pR[1])<-20||Math.min(pL[1],pR[1])>H+20)continue;
  s+=draw(pts,1,{color:LIGHT,w:5});
 }
 // 束の端（うすく）
 for(const [xe,ph] of [[BX0,0],[BX1,phiR]])s+=draw([onRay(xe,WY,ph,ph-700),[xe,WY],onRay(xe,WY,ph,ph+700)],1,{color:LIGHT,w:2,opacity:.3});
 if(arrows>0){const xm=(BX0+BX1)/2,phm=(xm-BX0)*Math.sin(I0);
  s+=fade(arrows,arrow(...onRay(xm,WY,phm,phm-330),...onRay(xm,WY,phm,phm-120),{color:HC,w:7,head:26})+arrow(...onRay(xm,WY,phm,phm+120),...onRay(xm,WY,phm,phm+380),{color:HC,w:7,head:26}));
  s+=fade(seg(arrows,.4,1)*showLabel,plate('向きが 変わる',840,WY+250,{size:38,color:HC,anchor:'end'}));}
 return fade(g,s);
}
function waterAir(labels=true){return rect(0,WY,W,H-WY,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(0,WY,W,WY,{color:SURF,w:4})+(labels?label('空気',40,70,{size:38,color:C.dim,weight:700})+label('水',40,WY+60,{size:38,color:SURF,weight:700}):'');}

// ================= プール =================
const PS=270,PF=750,PL=300,PR=870,PXE=590,PDEG=12;
const PRA=Math.asin(N_WATER*Math.sin(PDEG*DEG)),PAPP=PS+(PF-PS)*Math.tan(PDEG*DEG)/Math.tan(PRA); // 見かけの底 y（約625、0.89 m）
function pool(g1,g2,g3){
 let s=rect(PL,PS,PR-PL,PF-PS,{fill:WATER,fo:.25,stroke:'none',rx:0})+line(PL,PS,PR,PS,{color:SURF,w:4});
 s+=line(PL,PS-40,PL,PF,{color:GLASS,w:6})+line(PR,PS-40,PR,PF,{color:GLASS,w:6})+line(PL,PF,PR,PF,{color:GLASS,w:6});
 for(let x=PL+40;x<PR;x+=60)s+=line(x,PF,x,PF-10,{color:'#5c6f90',w:2});
 s+=dot(PXE,PF,12,HC);
 const dx=(PF-PS)*Math.tan(PDEG*DEG),up=150;
 for(const sg of [-1,1]){const Sx=PXE+sg*dx;
  s+=draw([[PXE,PF],[Sx,PS],[Sx+sg*up*Math.tan(PRA),PS-up]],g1,{color:LIGHT,w:5});
  s+=fade(seg(g1,.7,1),arrow(Sx+sg*up*.4*Math.tan(PRA),PS-up*.4,Sx+sg*up*.95*Math.tan(PRA),PS-up*.95,{color:LIGHT,w:5,head:18}));
  s+=draw([[Sx,PS],[PXE,PAPP]],g2,{color:HC,w:3,dash:'10 8'});}
 s+=fade(seg(g2,.6,1),line(PL,PAPP,PR,PAPP,{color:HC,w:3,dash:'6 10'})+dot(PXE,PAPP,11,HC,.6));
 s+=eye(PXE,PS-175,Math.PI/2,{size:52})+label('真上から 見る',PXE+70,PS-160,{size:36,color:C.ink});
 if(g3>0){
  s+=fade(g3,line(272,PS,272,PF,{color:C.ink,w:3})+line(260,PS,284,PS,{color:C.ink,w:3})+line(260,PF,284,PF,{color:C.ink,w:3})
   +label('本当の',250,470,{size:36,color:C.ink,anchor:'end'})+label('深さ',250,515,{size:36,color:C.ink,anchor:'end'})+label('1.2 m',250,570,{size:40,color:C.ink,anchor:'end',weight:700}));
  s+=fade(seg(g3,.3,1),line(330,PS,330,PAPP,{color:HC,w:4})+line(318,PS,342,PS,{color:HC,w:4})+line(318,PAPP,342,PAPP,{color:HC,w:4})
   +label('見える',350,400,{size:36,color:HC,weight:700})+label('0.9 m',350,450,{size:40,color:HC,weight:700}));
  s+=fade(seg(g3,.5,1),label('1.2 m × 4分の3 ＝ 0.9 m',40,835,{size:40,color:HC,weight:700}));
 }
 s+=label('プール',PR-10,PF+60,{size:36,color:C.dim,anchor:'end'});
 s+=note('光の 開きは 大きく 誇張',40,895);
 return s;
}


// ================= 4歩と3歩の三角形（境目に沿った同じ斜辺）→ 円の横のずれと同じ形 =================
// 入る角 40°（円の図と同じ）、速さの比 4:3 → 曲がった後の角 r＝asin(sin40°×3/4)＝28.8°。
// 三角形 A：P1（角 i）・Rs（直角）・P2。Rs→P2＝4歩＝h sin i。三角形 B：P1（角 r）・Le（直角）・P2。P1→Le＝3歩＝h sin r。斜辺 P1P2＝h は共通。
const TI=40*DEG,TR=Math.asin(Math.sin(TI)*3/4),TD1=[Math.sin(TI),Math.cos(TI)],TD2=[Math.sin(TR),Math.cos(TR)];
function triGeom(P1,u){const a=4*u,b=3*u,h=a/Math.sin(TI),P2=[P1[0]+h,P1[1]];
 return {a,b,h,P1,P2,Rs:[P2[0]-TD1[0]*a,P2[1]-TD1[1]*a],Le:[P1[0]+TD2[0]*b,P1[1]+TD2[1]*b]};}
const lerp2=(A,B,u)=>[mix(A[0],B[0],u),mix(A[1],B[1],u)];
const TBIG=[[180,480],75],TSMALL=[[40,330],40];
// 円（右）：中心 O、半径 TRC。境目の高さを小さい列の図とそろえる
const TO=[700,330],TRC=200;
const TA=[TO[0]-TRC*Math.sin(TI),TO[1]-TRC*Math.cos(TI)],TF=[TO[0],TA[1]],TB=[TO[0]+TRC*Math.sin(TR),TO[1]+TRC*Math.cos(TR)],TG=[TO[0],TB[1]];
function triBg(m){const x1=mix(W,440,m),y0=mix(0,140,m),y1=mix(H,520,m),by=mix(TBIG[0][1],TSMALL[0][1],m);
 return rect(0,y0,x1,by-y0,{fill:PAVE,fo:.9,stroke:'none',rx:0})+rect(0,by,x1,y1-by,{fill:MUD,fo:.85,stroke:'none',rx:0})+line(0,by,x1,by,{color:'#c9a77c',w:4})
  +fade(1-m,label('舗装',960,70,{size:38,color:'#c4cde0',anchor:'end',weight:700})+label('ぬかるみ',960,by+60,{size:38,color:'#e2c49c',anchor:'end',weight:700}));}
// 列（5人）：tau＝空気の側で進んだ道のり（0〜4歩）。片方の端が境目を横切る間＝tau 0→a
function triRank(G,tau,{ticks=0,big=true,lbl=0}={}){
 const N=5;let s='';const pos=j=>{const f=j/(N-1),X=[G.P1[0]+f*G.h,G.P1[1]],rem=G.a*f-tau;return rem>=0?[X[0]-TD1[0]*rem,X[1]-TD1[1]*rem]:[X[0]+TD2[0]*(-rem)*.75,X[1]+TD2[1]*(-rem)*.75];};
 const st=Array.from({length:N},(_,j)=>{const f=j/(N-1),X=[G.P1[0]+f*G.h,G.P1[1]],rem=G.a*f;return [X[0]-TD1[0]*rem,X[1]-TD1[1]*rem];});
 if(tau>0)s+=draw(st,1,{color:C.x,w:3,opacity:.35})+st.map(q=>dot(q[0],q[1],big?11:7,'#e8eef8',.35)).join('');
 const P=Array.from({length:N},(_,j)=>pos(j));
 // 両端の人の足あと（舗装の人 4歩・ぬかるみの人 3歩）
 if(ticks>0){
  const n4=Math.min(4,Math.floor(tau/G.a*4+1e-6)),n3=Math.min(3,Math.floor(tau/G.a*4*.75+1e-6));
  for(let k=1;k<=n4;k++){const q0=[G.Rs[0]+TD1[0]*G.a*(k-1)/4,G.Rs[1]+TD1[1]*G.a*(k-1)/4],q1=[G.Rs[0]+TD1[0]*G.a*k/4,G.Rs[1]+TD1[1]*G.a*k/4];s+=fade(ticks,arrow(q0[0],q0[1],q1[0],q1[1],{color:HC,w:big?5:3,head:big?16:10}));}
  for(let k=1;k<=n3;k++){const q0=[G.P1[0]+TD2[0]*G.b*(k-1)/3,G.P1[1]+TD2[1]*G.b*(k-1)/3],q1=[G.P1[0]+TD2[0]*G.b*k/3,G.P1[1]+TD2[1]*G.b*k/3];s+=fade(ticks,arrow(q0[0],q0[1],q1[0],q1[1],{color:C.x,w:big?5:3,head:big?16:10}));}
 }
 s+=draw(P,1,{color:C.x,w:big?4:3,opacity:.8})+P.map(q=>dot(q[0],q[1],big?16:10,'#e8eef8')).join('');
 if(lbl>0){const mA=lerp2(G.Rs,G.P2,.5),mB=lerp2(G.P1,G.Le,.5);
  s+=fade(lbl,plate('4歩',mA[0]+(big?40:24),mA[1]-(big?6:2),{size:big?44:38,color:HC})+plate('3歩',mB[0]-(big?40:22),mB[1]+(big?14:10),{size:big?44:38,color:C.x,anchor:'end'}));}
 return s;
}
function triShapes(G,{gA=1,gB=1,hyp=0}={}){
 let s=fade(gA,poly([G.P1,G.Rs,G.P2],{fill:HC,fo:.22,stroke:HC,sw:3}))+fade(gB,poly([G.P1,G.Le,G.P2],{fill:C.x,fo:.22,stroke:C.x,sw:3}));
 if(hyp>0)s+=fade(hyp,line(G.P1[0],G.P1[1],G.P2[0],G.P2[1],{color:'#ffffff',w:7}));
 return s;
}
function triCircle(g,{seg2=0,nums=0}={}){
 let s=rect(460,TO[1],W-460,250,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(460,TO[1],W,TO[1],{color:SURF,w:4});
 s+=line(TO[0],TO[1]-250,TO[0],TO[1]+250,{color:C.dim,w:3,dash:'12 9'})+ring(TO[0],TO[1],TRC,{color:'#8aa0c4',w:3});
 s+=line(TA[0],TA[1],TO[0],TO[1],{color:LIGHT,w:5})+line(TO[0],TO[1],TB[0],TB[1],{color:LIGHT,w:5})+dot(TA[0],TA[1],9,HC)+dot(TB[0],TB[1],9,HC);
 s+=label('空気',890,TO[1]-20,{size:36,color:C.dim,anchor:'end'})+label('水',890,TO[1]+50,{size:36,color:SURF,anchor:'end'});
 if(seg2>0)s+=fade(seg2,line(TA[0],TA[1],TF[0],TF[1],{color:HC,w:8})+line(TB[0],TB[1],TG[0],TG[1],{color:C.x,w:8}));
 if(nums>0)s+=fade(nums,plate('4',(TA[0]+TF[0])/2,TA[1]-18,{size:48,color:HC,anchor:'middle'})+plate('3',(TB[0]+TG[0])/2,TB[1]+56,{size:48,color:C.x,anchor:'middle'}));
 return fade(g,s);
}
const triSmallLabels=(g=1,{hyp=0}={})=>fade(g,plate('4歩',300,236,{size:38,color:HC})+plate('3歩',130,486,{size:38,color:C.x}))+fade(hyp,plate('同じ斜辺',230,572,{size:38,color:'#ffffff',anchor:'middle'}));
function triSmall(){return triBg(1)+triRank(triGeom(...TSMALL),4*TSMALL[1],{ticks:0,big:false})+triShapes(triGeom(...TSMALL))+triSmallLabels(1);}
function triFly(u){ // 小さい列の図の三角形を、円の三角形へ重ねる
 const G=triGeom(...TSMALL);
 return poly([lerp2(G.P1,TO,u),lerp2(G.Rs,TF,u),lerp2(G.P2,TA,u)],{fill:HC,fo:.3,stroke:HC,sw:3})+poly([lerp2(G.P1,TO,u),lerp2(G.Le,TG,u),lerp2(G.P2,TB,u)],{fill:C.x,fo:.3,stroke:C.x,sw:3});
}
const RIVX=[260,740];
function rivals(g,{q=0,names=1}={}){
 let s='';
 RIVX.forEach((x,i)=>{const dir=i?-1:1;s+=dot(x,360,62,'#c4cde0')+`<path d="M${x-110} 600 Q${x-100} 450 ${x} 445 Q${x+100} 450 ${x+110} 600 Z" fill="#c4cde0"/>`+`<path d="M${x+dir*55} 350 l${dir*22} 12 l${-dir*22} 10 Z" fill="#c4cde0"/>`;});
 s+=fade(names,label('ニュートン',RIVX[0],680,{size:44,color:C.ink,anchor:'middle',weight:700})+label('ホイヘンス',RIVX[1],680,{size:44,color:C.ink,anchor:'middle',weight:700}));
 s+=bigQ(500,470,q,160);
 return fade(g,s);
}
// ================= 地球と光 =================
function earth(cx,cy,r){
 let s=dot(cx,cy,r,'#2f6fd8')+`<path d="M${cx-r*.55} ${cy-r*.35} q${r*.3} ${-r*.3} ${r*.6} ${-r*.05} q${r*.1} ${r*.3} ${-r*.15} ${r*.5} q${-r*.3} ${r*.1} ${-r*.45} ${-r*.45}Z" fill="#3fae6a"/>`+`<path d="M${cx+r*.15} ${cy+r*.1} q${r*.4} ${-r*.2} ${r*.6} ${r*.15} q${-r*.05} ${r*.4} ${-r*.35} ${r*.45} q${-r*.3} ${-r*.2} ${-r*.25} ${-r*.6}Z" fill="#3fae6a"/>`;
 return s+ring(cx,cy,r,{color:'#7fb2ff',w:3});
}

// ================= cue ごとの図 =================
const lift=u=>[0,-330*u];
export const deep01Diagrams={
 // 1 疑問：コップとストロー（水の中の部分が浮き上がって見える）
 [K+'straw:see']:(p,ctx)=>{const g=vseg(ctx,p,.55,.8);
  return strawScene({look:true})+fade(g,ring(SS[0],SS[1],40,{color:HC,w:5})+label('折れて 見える',SS[0]+56,SS[1]-40,{size:40,color:HC,weight:700}));},
 // 2 取り出すとまっすぐ →「？」
 [K+'straw:lift']:(p,ctx)=>{const u=swin(ctx,p,0,.05,.5);
  let s=strawScene({look:true,off:lift(u)});
  s+=fade(swin(ctx,p,0,.6,.9),tag('まっすぐ',640,170,{color:STRAW}));
  s+=bigQ(500,640,swin(ctx,p,1,.3,.6),220);
  return s;},
 // 3 折れているのは光の通り道
 [K+'straw:path']:(p,ctx)=>{const u=1-vseg(ctx,p,0,.2);
  let s=strawScene({look:false,off:lift(u),ray:vseg(ctx,p,.45,1)});
  s+=fade(1-vseg(ctx,p,0,.12),bigQ(500,640,1,220));
  s+=fade(vseg(ctx,p,.15,.35),tag('ストローは まっすぐ',40,880,{color:STRAW}));
  s+=fade(vseg(ctx,p,.6,.85),label('光の 通り道',205,235,{size:40,color:LIGHT,weight:700}));
  return s;},
 // 4 実験：茶わんの底のコイン。顔を下げると見えなくなる
 [K+'coin:hide']:(p,ctx)=>{const d=swin(ctx,p,1,.55,.9);
  return coinScene({eyeY:mix(C_EYE_HIGH[1],C_EYE_LOW[1],d),sight:swin(ctx,p,1,.4,.6),hiddenTag:swin(ctx,p,1,.85,1)});},
 // 5 水を注ぐとコインが見えてくる
 [K+'coin:pour']:(p,ctx)=>{const f=vseg(ctx,p,.1,.75),L=mix(BOWL.bot+1,L_FULL,f);
  let s=coinScene({L,sight:1-.6*f,hiddenTag:1-vseg(ctx,p,0,.15),seenTag:vseg(ctx,p,.55,.75)});
  const pour=vseg(ctx,p,.05,.12)*(1-vseg(ctx,p,.75,.85));
  s+=fade(pour,draw([[760,0],[760,L]],1,{color:WATER,w:14,opacity:.7})+label('水を 注ぐ',780,120,{size:36,color:SURF}));
  return s;},
 // 6 光の道：コイン→水面で曲がる→縁を越えて目へ
 [K+'coin:ray']:(p,ctx)=>coinScene({L:L_FULL,sight:.4,ray:vseg(ctx,p,.05,.85)}),
 // 7 目はまっすぐ来たと思う → 浅く見える
 [K+'coin:image']:(p,ctx)=>coinScene({L:L_FULL,sight:.25,ray:1,image:Math.min(swin(ctx,p,0,.1,.9)*.45+swin(ctx,p,1,0,.8)*.55,1)}),
 // 8 年表の帯
 [K+'hist:band']:(p,ctx)=>{const g=vseg(ctx,p,0,.4),q=vseg(ctx,p,.45,1);
  let s=band(g);
  s+=fade(seg(q,0,.15)*(1-seg(q,.95,1)),label('？',YX(2000*q),BANDY-50,{size:56,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.1,.35),rect(110,380,780,170,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+label('光の 曲がり方の 規則',500,450,{size:48,color:C.ink,anchor:'middle',weight:700})+label('＝ ？',500,515,{size:48,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 9 プトレマイオス：入る角と曲がった後の角の表
 [K+'hist:table']:(p,ctx)=>{const t=tv(ctx,p),show=clamp((t-.45)/.45)*7;
  const ki=Math.min(6,Math.max(0,Math.floor(show-.01)));const i=show<=0?30:ANG[ki];
  let s=band(1)+ptol(vseg(ctx,p,0,.2));
  s+=fade(1-vseg(ctx,p,0,.1),rect(110,380,780,170,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+label('光の 曲がり方の 規則',500,450,{size:48,color:C.ink,anchor:'middle',weight:700})+label('＝ ？',500,515,{size:48,color:HC,anchor:'middle',weight:700}));
  s+=rayDiagram(i,vseg(ctx,p,.2,.4));
  s+=table(vseg(ctx,p,.4,.5),{show});
  return s;},
 // 10 2倍にしても2倍にならない：30°→22°、60°→41°（44°ではない）
 [K+'hist:double']:(p,ctx)=>{const m=swin(ctx,p,0,0,.6),y0=mix(630,360,m);
  let s=band(1)+ptol();
  s+=rayDiagram(30,1-m);
  s+=table(1,{y0,show:7,hl:swin(ctx,p,1,0,.15)>0?[30,60]:[]});
  const a=swin(ctx,p,1,.05,.3),b=swin(ctx,p,1,.35,.6),c=swin(ctx,p,1,.7,.95);
  s+=fade(a,label('入る角',60,660,{size:38,color:HC,weight:700})+label('30° × 2 ＝ 60°',320,660,{size:44,color:HC,weight:700}));
  s+=fade(b,label('2倍なら',60,750,{size:38,color:C.x,weight:700})+label('22° × 2 ＝ 44°',320,750,{size:44,color:C.x,weight:700}));
  s+=fade(c,line(310,736,680,736,{color:C.a,w:5})+label('実際は 41°',320,840,{size:46,color:C.a,weight:700})+label('（44° ではない）',570,840,{size:36,color:C.a}));
  return s;},
 // 11a ずっと後
 [K+'hist:later']:(p,ctx)=>{const g=vseg(ctx,p,.2,.9);
  let s=band(1)+ptol();
  s+=fade(1-vseg(ctx,p,0,.3),table(1,{y0:360,show:7})+label('30° × 2 ＝ 60°',320,660,{size:44,color:HC,weight:700})+label('実際は 41°',320,840,{size:46,color:C.a,weight:700}));
  s+=fade(g,arrow(YX(150),BANDY+200,YX(150)+(YX(1621)-YX(150))*g,BANDY+200,{color:C.dim,w:5,head:22}));
  s+=fade(seg(g,.4,1),label('ずっと 後',500,BANDY+260,{size:44,color:C.ink,anchor:'middle',weight:700}));
  return s;},
 // 11b イブン・サフル（984年ごろ）とスネル（1621年）
 [K+'hist:finders']:(p,ctx)=>{const t=tv(ctx,p),a=seg(t,0,.15),b=seg(t,.45,.6),c=seg(t,.85,.98);
  let s=band(1)+ptol();
  s+=fade(1-a,arrow(YX(150),BANDY+200,YX(1621),BANDY+200,{color:C.dim,w:5,head:22})+label('ずっと 後',500,BANDY+260,{size:44,color:C.ink,anchor:'middle',weight:700}));
  const card=(y,name,sub,g)=>fade(g,rect(180,y,640,170,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+dot(250,y+62,26,'#c4cde0')+`<path d="M206 ${y+150} q44 -70 88 0Z" fill="#c4cde0"/>`+label(name,320,y+72,{size:48,color:C.ink,weight:700})+label(sub,320,y+135,{size:38,color:C.dim}));
  s+=marker(984,'984年ごろ',a)+fade(a,line(YX(984),BANDY+14,YX(984),380,{color:HC,w:3,dash:'8 8'}))+card(380,'イブン・サフル','984年ごろ・バグダッド',a);
  s+=marker(1621,'1621年',b)+fade(b,line(YX(1621),BANDY+14,YX(1621),600,{color:HC,w:3,dash:'8 8'}))+card(600,'スネル','1621年・オランダ',b);
  s+=tag('同じ 規則',500,860,{g:c,color:HC,anchor:'middle',size:40});
  return s;},
 // 12 鍵は「横へのずれ」：縦の線と円
 [K+'snell:circle']:(p,ctx)=>snellFigure(40,{base:vseg(ctx,p,0,.2),vline:vseg(ctx,p,.35,.6),circle:vseg(ctx,p,.55,.85)}),
 // 13a 円と交わる点から縦の線までの距離
 [K+'snell:measure']:(p,ctx)=>snellFigure(40,{pts:vseg(ctx,p,.05,.3),meas:vseg(ctx,p,.35,.9)}),
 // 13b 角度を動かしても比は 1.33
 [K+'snell:sweep']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx)+1.2;
  return snellFigure(sweepAngle(t,ve),{pts:1,meas:1,angle:vseg(ctx,p,0,.1),ratio:vseg(ctx,p,.3,.5)});},
 // 14 では、なぜ曲がる？
 [K+'snell:why']:(p,ctx)=>{const d=vseg(ctx,p,0,.4);
  return snellFigure(40,{pts:1,meas:1,ratio:1-d,dim:d})+bigQ(500,560,vseg(ctx,p,.2,.6),240)+fade(vseg(ctx,p,.4,.8),label('なぜ 曲がる？',500,720,{size:56,color:C.ink,anchor:'middle',weight:700}));},
 // 15 横一列の人が斜めにぬかるみへ
 [K+'walk:in']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),Phi=-240+230*clamp(t/(ve+.3));
  return ground()+marchers(Phi);},
 // 16 端の人から遅くなり、列全体が向きを変える
 [K+'walk:turn']:(p,ctx)=>{const t=cueT(p,ctx),Phi=-10+480*clamp(t/Math.max(1,ctx.dur-.2));
  let s=ground()+marchers(Phi,{hlg:vseg(ctx,p,.02,.12),hlText:vseg(ctx,p,.05,.15)*(1-vseg(ctx,p,.55,.65))});
  const g=vseg(ctx,p,.65,.85);
  s+=fade(g,label('列の 向きが 変わる',560,880,{size:40,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 17 光も同じ：光の列が水面で向きを変える（もし遅くなるなら）
 [K+'wave:front']:(p,ctx)=>{const t=cueT(p,ctx);
  let s=waterAir()+waveFronts(t,{g:swin(ctx,p,0,0,.6),arrows:swin(ctx,p,1,.5,.85)});
  s+=fade(swin(ctx,p,1,0,.3),tag('仮定',40,880,{text:'もし 水の中で 遅くなるなら'}));
  s+=fade(swin(ctx,p,0,.3,.8),label('光',300,120,{size:44,color:LIGHT,weight:700}));
  return s;},
 // 18 列の図に戻る：片方の端が境目を横切る間に、舗装 4歩・ぬかるみ 3歩
 [K+'tri:steps']:(p,ctx)=>{const G=triGeom(...TBIG),tau=G.a*swin(ctx,p,1,.15,.95);
  return triBg(0)+triRank(G,tau,{ticks:1,lbl:swin(ctx,p,1,.6,.95)})+fade(swin(ctx,p,1,0,.2),plate('境目',40,TBIG[0][1]-20,{size:38,color:'#c9a77c'}));},
 // 19a 4歩と3歩を、同じ斜辺の三角形に → 円の横のずれと同じ形
 [K+'tri:shape']:(p,ctx)=>{const m=vseg(ctx,p,0,.12),G=triGeom(lerp2(TBIG[0],TSMALL[0],m),mix(TBIG[1],TSMALL[1],m));
  const big=m<.5,tri=vseg(ctx,p,.12,.35),hyp=vseg(ctx,p,.3,.45),c=vseg(ctx,p,.45,.6),f=vseg(ctx,p,.6,.88);
  let s=triBg(m)+triRank(G,G.a,{ticks:1-m,big,lbl:0})+triShapes(G,{gA:tri,gB:tri,hyp:hyp});
  s+=triSmallLabels(tri,{hyp});
  s+=triCircle(c,{seg2:c});
  if(f>0&&f<1)s+=triFly(f);
  if(f>=1)s+=poly([TO,TF,TA],{fill:HC,fo:.3,stroke:HC,sw:3})+poly([TO,TG,TB],{fill:C.x,fo:.3,stroke:C.x,sw:3});
  s+=fade(vseg(ctx,p,.85,1),plate('同じ形',TO[0],TO[1]+240,{size:42,color:C.ink,anchor:'middle'}));
  return s;},
 // 19b 比は 4÷3＝1.33
 [K+'tri:ratio']:(p,ctx)=>{const n=vseg(ctx,p,.05,.4),b=vseg(ctx,p,.35,.7);
  let s=triSmall()+triCircle(1,{seg2:1,nums:n})+poly([TO,TF,TA],{fill:HC,fo:.3,stroke:HC,sw:3})+poly([TO,TG,TB],{fill:C.x,fo:.3,stroke:C.x,sw:3});
  s+=fade(1-b,plate('同じ形',TO[0],TO[1]+240,{size:42,color:C.ink,anchor:'middle'}));
  s+=fade(b,rect(40,600,440,80,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14})+label('4 ÷ 3 ＝ 1.33',260,656,{size:46,color:HC,anchor:'middle',weight:700}));
  return s;},
 // 20 速さの比なら、水の中は 4分の3（はず＝予想）
 [K+'tri:speed']:(p,ctx)=>{const a=vseg(ctx,p,.1,.35),b=vseg(ctx,p,.4,.8),c=vseg(ctx,p,.8,.95);
  let s=triSmall()+triCircle(1,{seg2:1,nums:1})+poly([TO,TF,TA],{fill:HC,fo:.3,stroke:HC,sw:3})+poly([TO,TG,TB],{fill:C.x,fo:.3,stroke:C.x,sw:3});
  s+=rect(40,600,440,80,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:14})+label('4 ÷ 3 ＝ 1.33',260,656,{size:46,color:HC,anchor:'middle',weight:700});
  s+=fade(a,label('速さは 1 ÷ 1.33 ≈ 0.75',40,722,{size:40,color:C.ink,weight:700}));
  s+=fade(b,label('空気',40,772,{size:38,color:C.ink,weight:700})+rect(160,742,600*seg(b,.1,.6),40,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:6})+label('1',780,772,{size:40,color:LIGHT,weight:700})
   +label('水',40,828,{size:38,color:SURF,weight:700})+rect(160,798,600*.75*seg(b,.3,.8),40,{fill:WATER,fo:.85,stroke:SURF,rx:6})+label('0.75',630,828,{size:40,color:SURF,weight:700}));
  s+=tag('はず（予想）',40,896,{g:c,color:'#ffb36b'});
  return s;},
 // 19 ストローに戻る：先からの光の道
 [K+'straw:back']:(p,ctx)=>strawScene({look:false,ray:swin(ctx,p,1,.05,.95)}),
 // 20 まっすぐ延ばした先 → 浮き上がって折れて見える
 [K+'straw:image']:(p,ctx)=>{const im=vseg(ctx,p,.05,.85);
  return strawScene({look:false,ray:1,image:im,realGhost:1,bend:0})+fade(vseg(ctx,p,.85,1),ring(SS[0],SS[1],40,{color:HC,w:5})+label('折れて 見える',SS[0]+56,SS[1]-40,{size:40,color:HC,weight:700}));},
 // 21 プール：1.2 m が 0.9 m に見える
 [K+'pool:depth']:(p,ctx)=>pool(swin(ctx,p,0,.1,.7),swin(ctx,p,0,.5,1),swin(ctx,p,1,.2,.9)),
 // 22 光は1秒で地球を7周半
 [K+'next:earth']:(p,ctx)=>{const t=cueT(p,ctx),u=swin(ctx,p,1,.1,.95),laps=7.5*u,cx=430,cy=440,R=250;
  let s=earth(cx,cy,180);
  s+=fade(swin(ctx,p,0,0,.6),bigQ(860,250,1,120));
  const a=-Math.PI/2+2*Math.PI*laps,tr=[];for(let k=0;k<=24;k++){const b=a-Math.min(laps,.3)*2*Math.PI*k/24;tr.push([cx+R*Math.cos(b),cy+R*Math.sin(b)]);}
  if(u>0)s+=draw(tr,1,{color:LIGHT,w:6})+dot(cx+R*Math.cos(a),cy+R*Math.sin(a),13,LIGHT);
  s+=fade(swin(ctx,p,1,0,.1),label('光：1秒に 約30万 km',40,70,{size:38,color:LIGHT,weight:700})+label('地球 1周：約4万 km',40,125,{size:38,color:'#8ec0ff',weight:700}));
  s+=fade(swin(ctx,p,1,0,.1),label(`${laps.toFixed(1)} 周`,cx,cy+20,{size:60,color:HC,anchor:'middle',weight:700}));
  s+=fade(swin(ctx,p,1,.9,1),label('30万 ÷ 4万 ＝ 7.5',40,790,{size:40,color:HC,weight:700}));
  s+=fade(swin(ctx,p,1,0,.2),note('動きは ゆっくりに しています',40,890));
  return s;},
 // 25 ニュートンとホイヘンスは正反対の答え
 [K+'next:rivals']:(p,ctx)=>fade(1-vseg(ctx,p,0,.15),earth(430,440,180))+rivals(vseg(ctx,p,.12,.35),{names:vseg(ctx,p,.25,.6),q:vseg(ctx,p,.6,.9)})+fade(vseg(ctx,p,.7,.95),label('正反対の 答え',500,800,{size:44,color:HC,anchor:'middle',weight:700})),
 // 23 誰が、どうやって確かめた？
 [K+'next:q']:(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,.0,.25);
  let s=fade(1-g,rivals(1,{q:1}));
  // 水の入った長い管と光
  s+=fade(g,rect(140,560,720,150,{fill:WATER,fo:.25,stroke:SURF,sw:4,rx:20})+label('水',170,610,{size:38,color:SURF,weight:700}));
  const x=60+((t*260)%900);s+=fade(g,line(40,635,960,635,{color:LIGHT,w:3,opacity:.5})+dot(Math.min(x,940),635,12,LIGHT));
  s+=fade(vseg(ctx,p,.3,.5),label('遅くなる？',500,790,{size:44,color:HC,anchor:'middle',weight:700}));
  s+=finalCard(['誰が、どうやって','確かめた？'],vseg(ctx,p,.6,.85),{y:140,size:60});
  return s;},
};
