// 深掘りショート 02（ys-deep-02）「光が水の中で遅くなると、どうやって確かめた？」— 図。縦長の舞台 1000×920（vert-v1）。
// 共通の形は yt1-sp-deep-common.mjs、前回の「光の列が向きを変える図」は 01 の waveFronts を名前で import（export * はしない）。
// 値の検算は台本 docs/video-revision-20260924/ytseries/sp-deep-02.mjs の冒頭。
// この回で作った部品（このファイルの中だけ）：nameCard（人の札）、粒の流れ・波の山の線（粒の説／波の説）、左右の比べ（panels）、
//   フィゾーの歯車（正面の歯車＋横から見た縁の歯の列）、フーコーの回る鏡（反射の計算で戻った光のずれ）、色の波（波長）、プリズム。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,GLASS,N_WATER,cueT,voiceEnd,vseg,swin,sentWin,tag,note,plate,bigQ,finalCard,eye,snellR} from './yt1-sp-deep-common.mjs';
import {waveFronts} from './yt1-sp-deep-01-diagrams.mjs';

const K='deep02-',DEG=Math.PI/180;
const RED='#ff4b3e',BLUE='#3f8cff',VIOLET='#a274ff',GOOD='#83ecc0',BAD='#ff6b6b',PRED='#ffb36b',PERSON='#c4cde0';
const n1=v=>Number(v.toFixed(1));
const tv=(ctx,p)=>cueT(p,ctx)/voiceEnd(ctx);
const slowNote=(g=1,y=890)=>note('動きは ゆっくりに しています',40,y,{g});

// ================= 人の札 =================
function person(x,y,s=1,col=PERSON){return dot(x,y-62*s,30*s,col)+`<path d="M${n1(x-52*s)} ${n1(y+40*s)} q${n1(52*s)} ${n1(-110*s)} ${n1(104*s)} 0Z" fill="${col}"/>`;}
function nameCard(x,y,name,sub,{w=520,g=1}={}){
 return fade(g,rect(x,y,w,150,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+person(x+66,y+92,.9)+label(name,x+125,y+66,{size:48,color:C.ink,weight:700})+label(sub,x+125,y+124,{size:38,color:C.dim}));
}

// ================= 粒の説（ニュートン） =================
// 入る角 45°、水の中 32.1°。粒は水面に沿う速さは同じ、垂直な速さが増えて 1.33 倍の速さ（間隔も 1.33 倍）。
const I0=45*DEG,R0=snellR(I0),D1=[Math.sin(I0),Math.cos(I0)],D2=[Math.sin(R0),Math.cos(R0)];
const PY=470,PXE=[300,380,460],PSP=70,PSPEED=80;
const pphi=x=>(x-PXE[0])*Math.sin(I0);
const inStage=q=>q[0]>-30&&q[0]<W+30&&q[1]>-30&&q[1]<H+30;
function particles(t,{water=0,bend=0,g=1}={}){
 let s='';
 const off=(t*PSPEED)%PSP;
 if(water>0)s+=fade(water,rect(0,PY,W,H-PY,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(0,PY,W,PY,{color:SURF,w:4})+label('水',40,PY+60,{size:38,color:SURF,weight:700}));
 for(const xe of PXE){const ph=pphi(xe);
  // 道筋（うすく）
  s+=draw([[xe-D1[0]*700,PY-D1[1]*700],[xe,PY]],1,{color:LIGHT,w:2,opacity:.25});
  if(bend<1)s+=fade(1-bend,draw([[xe,PY],[xe+D1[0]*700,PY+D1[1]*700]],1,{color:LIGHT,w:2,opacity:.25}));
  if(bend>0)s+=fade(bend,draw([[xe,PY],[xe+D2[0]*700,PY+D2[1]*700]],1,{color:LIGHT,w:2,opacity:.25}));
  for(let m=-16;m<=16;m++){const Phi=m*PSP+off,d=Phi-ph;
   if(d<=0){const q=[xe+D1[0]*d,PY+D1[1]*d];if(inStage(q))s+=dot(q[0],q[1],11,LIGHT);continue;}
   const qs=[xe+D1[0]*d,PY+D1[1]*d],qb=[xe+D2[0]*d*N_WATER,PY+D2[1]*d*N_WATER];
   if(bend<1&&inStage(qs))s+=fade(1-bend,dot(qs[0],qs[1],11,LIGHT));
   if(bend>0&&inStage(qb))s+=fade(bend,dot(qb[0],qb[1],11,LIGHT));
  }
 }
 return fade(g,s);
}
// 速さの棒（2本）。x0：名前の位置、bx：棒の始まり、unit：1 の長さ
function speedBars(vals,{x0=40,bx=130,y0=680,dy=90,unit=200,g=1,cols=[LIGHT,WATER],names=['空気','水'],nameCols=[C.ink,SURF]}={}){
 let s='';
 vals.forEach((v,i)=>{const y=y0+i*dy,gi=seg(g,.15+.3*i,.55+.3*i);
  s+=plate(names[i],x0+12,y+14,{size:38,color:nameCols[i]});
  s+=fade(gi,rect(bx,y-24,unit*v,48,{fill:cols[i],fo:.85,stroke:cols[i],rx:6})+plate(String(v),bx+unit*v+28,y+14,{size:40,color:i?SURF:LIGHT}));
 });
 return fade(seg(g,0,.2),s);
}

// ================= 波の説（ホイヘンス） =================
// 01 の waveFronts と同じ束（水面 y＝430、束の左 x＝230、右 x＝230＋340/cos45°）。水が無いときの、まっすぐな山の線。
const WY=430,BX0=230,BX1=BX0+340/Math.cos(I0),LAM=80,WSPEED=60;
function straightFronts(t,{g=1,clipY=H}={}){
 const phiR=(BX1-BX0)*Math.sin(I0),off=(t*WSPEED)%LAM;let s='';
 for(let m=-10;m<=16;m++){const Phi=m*LAM+off;
  const pL=[BX0+D1[0]*Phi,WY+D1[1]*Phi],pR=[BX1+D1[0]*(Phi-phiR),WY+D1[1]*(Phi-phiR)];
  if(Math.max(pL[1],pR[1])<-20||Math.min(pL[1],pR[1])>clipY+20)continue;
  s+=draw([pL,pR],1,{color:LIGHT,w:5});
 }
 for(const [xe,ph] of [[BX0,0],[BX1,phiR]])s+=draw([[xe-D1[0]*700,WY-D1[1]*700],[xe+D1[0]*700,WY+D1[1]*700]],1,{color:LIGHT,w:2,opacity:.3});
 return fade(g,`<clipPath id="d02sf"><rect width="${W}" height="${clipY}"/></clipPath><g clip-path="url(#d02sf)">${s}</g>`);
}
const waterBg=(g=1,lab=true)=>fade(g,rect(0,WY,W,H-WY,{fill:WATER,fo:.2,stroke:'none',rx:0})+line(0,WY,W,WY,{color:SURF,w:4})+(lab?label('水',40,WY+60,{size:38,color:SURF,weight:700}):''));
// 01 の束に合わせた矢印（入る向き・曲がった後の向き）
function turnArrows(g){
 const xm=(BX0+BX1)/2,a=[xm-D1[0]*330,WY-D1[1]*330],b=[xm-D1[0]*120,WY-D1[1]*120],c=[xm+D2[0]*120/N_WATER,WY+D2[1]*120/N_WATER],d=[xm+D2[0]*380/N_WATER,WY+D2[1]*380/N_WATER];
 return fade(g,arrow(a[0],a[1],b[0],b[1],{color:HC,w:7,head:26})+arrow(c[0],c[1],d[0],d[1],{color:HC,w:7,head:26}));
}

// ================= 左右に並べる（粒の説・波の説） =================
const PNL=[{cx:250,name:'粒の説',who:'ニュートン',kind:'p'},{cx:720,name:'波の説',who:'ホイヘンス',kind:'w'}];
const QY=330,QLA=240,QLW=230;
function miniPanel(P,t,{g=1,dim=0}={}){
 const {cx}=P,E=[cx,QY],A=[cx-D1[0]*QLA,QY-D1[1]*QLA];
 let s=rect(cx-225,20,450,530,{fill:'#131f38',fo:.6,stroke:C.faint,sw:2,rx:16});
 s+=label(P.name,cx,80,{size:46,color:C.ink,anchor:'middle',weight:700})+label(P.who,cx,128,{size:36,color:C.dim,anchor:'middle'});
 s+=rect(cx-225,QY,450,220,{fill:WATER,fo:.22,stroke:'none',rx:0})+line(cx-225,QY,cx+225,QY,{color:SURF,w:4});
 const B=[cx+D2[0]*QLW,QY+D2[1]*QLW];
 s+=draw([A,E,B],1,{color:LIGHT,w:2,opacity:.35});
 const k=P.kind==='p'?N_WATER:1/N_WATER,sp=48,off=(t*55)%sp;
 for(let m=0;m<14;m++){const u=m*sp+off;let q,dir;
  if(u<QLA){q=[A[0]+D1[0]*u,A[1]+D1[1]*u];dir=D1;}else{const d=(u-QLA)*k;if(d>QLW)continue;q=[E[0]+D2[0]*d,E[1]+D2[1]*d];dir=D2;}
  if(P.kind==='p')s+=dot(q[0],q[1],10,LIGHT);
  else s+=line(q[0]-dir[1]*34,q[1]+dir[0]*34,q[0]+dir[1]*34,q[1]-dir[0]*34,{color:LIGHT,w:5});
 }
 return fade(g*(1-.65*dim),s);
}
const predTag=(i,g,{kind='予想',strike=0}={})=>{const x=i?700:250,t=i?'水の中で 遅い':'水の中で 速い';
 return fade(g,tag(kind,x,650,{anchor:'middle',text:t,color:kind==='結果'?GOOD:PRED})+fade(strike,line(x-200,640,x+200,640,{color:BAD,w:6})));};

// ================= フィゾーの歯車 =================
const GC=[150,250],GR=150,GT=40,GP=90,BY=640,SX=300,HM=[150,640],LAMP=[150,520],FM=860,EYE=[55,640];
// 正面の歯車（歯 40枚に減らして描く）。rot：回った角（度）。0 で 3時の位置に すき間の真ん中が来る。
function gear(rot){
 const pts=[],step=360/GT;
 for(let k=0;k<GT;k++){const a0=k*step+rot-step*.25;
  for(const [a,r] of [[a0,GR-26],[a0+step*.04,GR],[a0+step*.46,GR],[a0+step*.5,GR-26],[a0+step*.96,GR-26]])pts.push([GC[0]+r*Math.cos(a*DEG),GC[1]+r*Math.sin(a*DEG)]);}
 return poly(pts,{fill:'#8a96ad',fo:.55,stroke:'#c4cde0',sw:2})+ring(GC[0],GC[1],GR-60,{color:'#c4cde0',w:3})+dot(GC[0],GC[1],22,'#c4cde0');
}
// 横から見た縁の歯の列（光の通る所）。off：下へずれた量（すき間の真ん中が光の高さ BY のとき 0）
function strip(off){
 let s=`<clipPath id="d02st"><rect x="${SX-20}" y="560" width="40" height="160"/></clipPath><g clip-path="url(#d02st)">`;
 const o=((off%GP)+GP)%GP;
 for(let k=-3;k<=3;k++){const y=BY+GP/4+k*GP+o;s+=rect(SX-16,y,32,GP/2,{fill:'#8a96ad',fo:.9,stroke:'#c4cde0',sw:2,rx:3});}
 return s+'</g>'+rect(SX-20,560,40,160,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:4});
}
const rotOf=off=>off/GP*(360/GT);
function fizeauBase({off=0,labels=1,teeth=0}={}){
 let s=gear(rotOf(off));
 s+=fade(labels,ring(GC[0]+GR-13,GC[1],24,{color:HC,w:4})+line(SX,GC[1]+28,SX,555,{color:HC,w:3,dash:'8 8'}));
 s+=label('歯車',360,110,{size:44,color:C.ink,weight:700});
 s+=fade(teeth,label('歯は 720枚',360,170,{size:40,color:HC,weight:700}));
 // 光源・半分だけ映す鏡・目・遠くの鏡
 s+=dot(LAMP[0],LAMP[1],18,LIGHT)+label('光源',LAMP[0]+36,LAMP[1]+12,{size:36,color:LIGHT});
 s+=line(HM[0]-28,HM[1]-28,HM[0]+28,HM[1]+28,{color:GLASS,w:5});
 s+=eye(EYE[0],EYE[1],0,{size:34})+label('目',EYE[0],EYE[1]+80,{size:38,color:C.ink,anchor:'middle',weight:700});
 s+=line(FM,585,FM,695,{color:GLASS,w:10})+label('鏡',FM,750,{size:40,color:C.ink,anchor:'middle',weight:700});
 s+=line(HM[0],BY,FM,BY,{color:LIGHT,w:2,opacity:.25});
 s+=line(560,BY-28,580,BY+28,{color:C.dim,w:4})+line(585,BY-28,605,BY+28,{color:C.dim,w:4});
 s+=label('8.6 km',583,BY-46,{size:40,color:C.ink,anchor:'middle',weight:700});
 s+=label('歯車の 縁',SX,790,{size:36,color:C.dim,anchor:'middle'});
 s+=strip(off);
 return s;
}
// 光の粒（パルス）。道の上の点 u（0〜1）の位置と、短い尾
function pulseOn(path,u,{g=1,color=LIGHT}={}){
 if(u<=0||g<=0)return '';
 let L=0;const sl=[];for(let i=1;i<path.length;i++){const d=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);sl.push(d);L+=d;}
 const at=w=>{w=clamp(w,0,L);for(let i=1;i<path.length;i++){if(w<=sl[i-1]){const q=w/sl[i-1];return [mix(path[i-1][0],path[i][0],q),mix(path[i-1][1],path[i][1],q)];}w-=sl[i-1];}return path[path.length-1];};
 const w=L*clamp(u),tail=[];for(let k=0;k<=8;k++)tail.push(at(w-90*k/8));
 const p=at(w);
 return fade(g,draw(tail,1,{color,w:8})+dot(p[0],p[1],20,color,.35)+dot(p[0],p[1],11,color));
}
const OUT=[LAMP,HM,[SX,BY],[FM,BY],[SX+20,BY]];          // 光源 → 歯車 → 鏡 → 歯車の手前
const BACK=[[SX+20,BY],[SX,BY],HM,EYE];                  // 歯車 → 目
const lenOf=p=>p.slice(1).reduce((a,q,i)=>a+Math.hypot(q[0]-p[i][0],q[1]-p[i][1]),0);
const L_OUT=lenOf(OUT),L_BACK=lenOf(BACK);
// t0：光源を出た時刻、T：歯車の手前に戻るまで、blocked：戻りがさえぎられるか
function flight(t,t0,T,{blocked=false}={}){
 const T2=T*L_BACK/L_OUT;let s='';
 if(t<t0)return '';
 if(t<t0+T)return pulseOn(OUT,(t-t0)/T);
 if(!blocked){if(t<t0+T+T2)return pulseOn(BACK,(t-t0-T)/T2);
  const g=1-seg(t,t0+T+T2,t0+T+T2+.8);return fade(g,ring(EYE[0],EYE[1],44,{color:LIGHT,w:5}));}
 const g=seg(t,t0+T,t0+T+.25);
 return fade(g,line(SX+30,BY-34,SX+90,BY+34,{color:BAD,w:8})+line(SX+30,BY+34,SX+90,BY-34,{color:BAD,w:8}));
}

// ================= フーコーの回る鏡 =================
const FS=[245,700],FR=[560,700],FMM=[860,330],SCX=200,TH0=5; // 空気のとき鏡が回る角 5°（大きく誇張）
const unit=v=>{const L=Math.hypot(v[0],v[1]);return [v[0]/L,v[1]/L];};
const RTOM=unit([FMM[0]-FR[0],FMM[1]-FR[1]]),DIN=[1,0];
const N0=unit([RTOM[0]-DIN[0],RTOM[1]-DIN[1]]);
const rot2=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a)];
// 鏡が th（度）回った後、遠くの鏡から戻った光が目盛り板（x＝SCX）に当たる y。向きは下にずれるように選ぶ
const SGN=(()=>{const n=rot2(N0,1*DEG),d=[-RTOM[0],-RTOM[1]],k=d[0]*n[0]+d[1]*n[1],r=[d[0]-2*k*n[0],d[1]-2*k*n[1]];return (FR[1]+(SCX-FR[0])*r[1]/r[0])>FR[1]?1:-1;})();
function spotY(th){const n=rot2(N0,SGN*th*DEG),d=[-RTOM[0],-RTOM[1]],k=d[0]*n[0]+d[1]*n[1],r=[d[0]-2*k*n[0],d[1]-2*k*n[1]];return FR[1]+(SCX-FR[0])*r[1]/r[0];}
const MDIR=th=>{const n=rot2(N0,SGN*th*DEG);return [-n[1],n[0]];};
function rmirror(th,{ghost=false,ang=null}={}){
 const d=ang===null?MDIR(th):[Math.cos(ang),Math.sin(ang)],L=50;
 return line(FR[0]-d[0]*L,FR[1]-d[1]*L,FR[0]+d[0]*L,FR[1]+d[1]*L,{color:ghost?C.dim:GLASS,w:ghost?3:10,dash:ghost?'8 8':''})+(ghost?'':dot(FR[0],FR[1],7,C.bg));
}
function farMirror(){
 const R=Math.hypot(FMM[0]-FR[0],FMM[1]-FR[1]),a=Math.atan2(RTOM[1],RTOM[0]),pts=[];
 for(let k=-8;k<=8;k++){const b=a+k*DEG*1.3;pts.push([FR[0]+R*Math.cos(b),FR[1]+R*Math.sin(b)]);}
 return draw(pts,1,{color:GLASS,w:10})+label('遠くの 鏡',FMM[0]-20,FMM[1]-70,{size:38,color:C.ink,anchor:'middle',weight:700});
}
function foucaultBase({room=1,beam=1,scale=1}={}){
 let s=fade(room,rect(40,235,900,590,{fill:'none',fo:0,stroke:C.faint,sw:3,rx:18})+label('部屋の 中',880,810,{size:38,color:C.dim,anchor:'end'}));
 s+=dot(FS[0],FS[1],16,LIGHT)+label('光源',FS[0],FS[1]-36,{size:36,color:LIGHT,anchor:'middle'});
 s+=fade(scale,line(SCX,712,SCX,820,{color:C.dim,w:5})+[0,1,2,3,4,5].map(i=>line(SCX,720+i*20,SCX+(i%5?10:18),720+i*20,{color:C.dim,w:2})).join(''));
 s+=farMirror();
 s+=fade(beam,line(FS[0],FS[1],FR[0],FR[1],{color:LIGHT,w:3,opacity:.45})+line(FR[0],FR[1],FMM[0],FMM[1],{color:LIGHT,w:3,opacity:.45}));
 s+=label('回る 鏡',FR[0]-60,FR[1]+95,{size:38,color:C.ink,anchor:'end',weight:700});
 return s;
}
function spinArrow(g){
 const pts=[];for(let k=0;k<=20;k++){const a=(-150+k*12)*DEG;pts.push([FR[0]+75*Math.cos(a),FR[1]+75*Math.sin(a)]);}
 const e=pts[pts.length-1],p=pts[pts.length-3];
 return fade(g,draw(pts,1,{color:HC,w:5})+arrow(p[0],p[1],e[0],e[1],{color:HC,w:5,head:20}));
}
const spotMark=(y,{g=1,color=LIGHT,ghost=false}={})=>fade(g,ghost?ring(SCX,y,14,{color,w:3,dash:'5 5'}):dot(SCX,y,22,color,.35)+dot(SCX,y,12,color));
function returnBeam(th,g=1,{color=LIGHT}={}){const y=spotY(th);return fade(g,line(FR[0],FR[1],SCX,y,{color,w:4}));}
function shiftBrace(y,g=1,{text='ずれ',x=SCX-34}={}){
 return fade(g,line(x,FR[1],x,y,{color:HC,w:5})+line(x-12,FR[1],x+12,FR[1],{color:HC,w:5})+line(x-12,y,x+12,y,{color:HC,w:5})+(text?plate(text,x-22,(FR[1]+y)/2+14,{size:40,color:HC,anchor:'end'}):''));
}
// 水の管（回る鏡と遠くの鏡の間）
function waterTube(g){
 const a=.18,b=.78,P=[mix(FR[0],FMM[0],a),mix(FR[1],FMM[1],a)],Q=[mix(FR[0],FMM[0],b),mix(FR[1],FMM[1],b)],nx=-RTOM[1]*30,ny=RTOM[0]*30;
 return fade(g,poly([[P[0]+nx,P[1]+ny],[Q[0]+nx,Q[1]+ny],[Q[0]-nx,Q[1]-ny],[P[0]-nx,P[1]-ny]],{fill:WATER,fo:.45,stroke:SURF,sw:3})+plate('水の管',Q[0]+30,(P[1]+Q[1])/2+60,{size:40,color:SURF}));
}

// ================= 色の波 =================
const SC_NM=.4,WAMP=48;
function sine(y,lam,phase,{x0=60,x1=940,color=RED,w=6,g=1}={}){
 const pts=[];for(let x=x0;x<=x1;x+=4)pts.push([x,y-WAMP*Math.cos(2*Math.PI*(x-x0-phase)/lam)]);
 return fade(g,draw(pts,1,{color,w}));
}
// 山の位置（x0 から phase だけ進んだ所が山）。x ≥ from で最初の山
const crestAt=(lam,phase,from,x0=60)=>{let x=x0+((phase%lam)+lam)%lam;while(x<from)x+=lam;return x;};
function lamMark(y,lam,phase,from,g,{text='波長',color=HC}={}){
 const a=crestAt(lam,phase,from),b=a+lam,yt=y-WAMP;
 return fade(g,dot(a,yt,10,color)+dot(b,yt,10,color)+line(a,yt-14,a,yt-46,{color,w:3})+line(b,yt-14,b,yt-46,{color,w:3})
  +arrow((a+b)/2,yt-30,a+4,yt-30,{color,w:4,head:16})+arrow((a+b)/2,yt-30,b-4,yt-30,{color,w:4,head:16})+(text?plate(text,(a+b)/2,yt-50,{size:40,color,anchor:'middle'}):''));
}

// ================= プリズム =================
const PRZ=[[400,130],[255,420],[545,420]],PIN=[327,275],POUT=[468,280];
const SPEC=['#ff4b3e','#ff8a2a','#ffd23f','#5fd068','#3fc6e0','#3f8cff','#a274ff'];
function prism(g1,g2){
 let s=poly(PRZ,{fill:'#c9d6ea',fo:.16,stroke:GLASS,sw:4})+label('ガラス',400,470,{size:36,color:C.dim,anchor:'middle'});
 s+=draw([[40,375],PIN],seg(g1,0,.5),{color:'#ffffff',w:12})+label('白い 光',40,440,{size:40,color:'#ffffff',weight:700});
 s+=fade(seg(g1,.4,.6),draw([PIN,POUT],1,{color:'#ffffff',w:9,opacity:.7}));
 SPEC.forEach((c,i)=>{const y=330+i*32;s+=draw([POUT,[960,y]],seg(g2,i*.06,.55+i*.06),{color:c,w:12});});
 return s;
}

// ================= cue ごとの図 =================
const D01=(t,m=0)=>scaleAt(500,40,.62,`<clipPath id="d02wv"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#d02wv)">`+waterBg(1,false)+waveFronts(t,{arrows:1,showLabel:0})+'</g>')+rect(190,40,620,570,{fill:'none',fo:0,stroke:C.faint,sw:3,rx:6});
export const deep02Diagrams={
 // 1 前回：光の列が水面で向きを変える図（小さく）
 [K+'intro:prev']:(p,ctx)=>{const t=ctx.tg+20;
  let s=D01(t);
  s+=plate('空気',215,100,{size:36,color:C.dim,weight:400})+plate('水',215,360,{size:36,color:SURF,weight:400})+tag('前回',40,60,{color:C.dim});
  s+=fade(vseg(ctx,p,.3,.6),plate('水の中で 遅くなる',500,710,{size:44,color:C.ink,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.55,.85),plate('→ 曲がる',500,780,{size:44,color:HC,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.7,1),tag('予想',500,870,{anchor:'middle',text:'まだ 確かめていない'}));
  return s;},
 // 2 150年以上の大論争：二人の人影と「？」
 [K+'intro:debate']:(p,ctx)=>{const g=vseg(ctx,p,0,.2);
  let s=fade(g,person(230,470,2)+person(770,470,2));
  s+=bigQ(500,420,vseg(ctx,p,.1,.35),200);
  s+=fade(vseg(ctx,p,.3,.55),plate('150年 以上',500,140,{size:56,color:C.ink,anchor:'middle'}));
  s+=fade(vseg(ctx,p,.75,.95),plate('大論争',500,720,{size:60,color:HC,anchor:'middle'}));
  return s;},
 // 3 ニュートン：光は小さな粒の流れ
 [K+'particle:stream']:(p,ctx)=>{const t=ctx.tg;
  let s=particles(t,{g:vseg(ctx,p,.3,.7)});
  s+=nameCard(470,30,'ニュートン','光は 粒の 流れ',{g:vseg(ctx,p,0,.25)});
  s+=fade(vseg(ctx,p,.5,.8),plate('小さな 粒',560,320,{size:42,color:LIGHT}));
  return s;},
 // 4 粒は水に引き寄せられ、垂直な向きに速くなって曲がる。この説では水の中で速い
 [K+'particle:pull']:(p,ctx)=>{const t=ctx.tg;
  const w=swin(ctx,p,0,0,.15),pull=swin(ctx,p,0,.08,.3)*(1-swin(ctx,p,1,0,.15)),vert=swin(ctx,p,0,.3,.6)*(1-swin(ctx,p,1,0,.15)),bend=swin(ctx,p,0,.6,.8),b2=swin(ctx,p,1,.1,.9);
  let s=particles(t,{water:w,bend});
  s+=nameCard(470,30,'ニュートン','光は 粒の 流れ',{g:1-swin(ctx,p,0,0,.1)});
  s+=fade(pull,[340,420,500].map(x=>arrow(x,PY-34,x,PY+30,{color:HC,w:5,head:16})).join('')+plate('水に 引き寄せられる',560,PY-50,{size:38,color:HC}));
  s+=fade(vert,arrow(600,PY+40,600,PY+40+170*seg(vert,0,1),{color:HC,w:7,head:22})+plate('垂直な 向きに',630,PY+100,{size:38,color:HC})+plate('速くなる',630,PY+150,{size:38,color:HC}));
  s+=fade(swin(ctx,p,0,.7,.95)*(1-b2),plate('曲がる',560,PY+250,{size:44,color:HC}));
  s+=fade(b2,label('速さ',480,200,{size:38,color:C.dim})+speedBars([1,1.33],{x0:470,bx:580,y0:270,dy:80,unit:200,g:b2}));
  s+=tag('予想',40,880,{g:swin(ctx,p,1,.3,.6),text:'水の中で 速い'});
  return s;},
 // 5 ホイヘンス：光は波（山の線）
 [K+'wave:front']:(p,ctx)=>{const t=ctx.tg;
  let s=straightFronts(t,{g:vseg(ctx,p,.35,.75)});
  s+=nameCard(470,30,'ホイヘンス','光は 波',{g:vseg(ctx,p,0,.3)});
  s+=fade(vseg(ctx,p,.6,.9),plate('波の 山の 線',560,330,{size:42,color:LIGHT}));
  return s;},
 // 6a 波なら、水の中で遅くなるから曲がる（前回の列と同じ）
 [K+'wave:turn']:(p,ctx)=>{const t=ctx.tg,w=swin(ctx,p,0,0,.25),b=swin(ctx,p,0,.4,.8);
  let s=waterBg(w);
  s+=straightFronts(t,{g:1-b});
  s+=fade(b,waveFronts(t,{arrows:0}));
  s+=turnArrows(swin(ctx,p,0,.7,1));
  s+=fade(swin(ctx,p,0,.75,1),plate('向きが 変わる',840,WY+250,{size:38,color:HC,anchor:'end'}));
  s+=nameCard(470,30,'ホイヘンス','光は 波',{g:1-swin(ctx,p,0,0,.15)});
  s+=fade(swin(ctx,p,1,.1,.5),plate('前回の 列と 同じ',580,130,{size:42,color:HC}));
  return s;},
 // 6b この説では水の中で遅い
 [K+'wave:slow']:(p,ctx)=>{const t=ctx.tg,b=vseg(ctx,p,.2,.9);
  let s=waterBg()+waveFronts(t,{arrows:0})+turnArrows(1)+plate('向きが 変わる',840,WY+250,{size:38,color:HC,anchor:'end'});
  s+=fade(1-vseg(ctx,p,0,.2),plate('前回の 列と 同じ',580,130,{size:42,color:HC}));
  s+=fade(b,plate('速さ',52,620,{size:38,color:C.dim})+speedBars([1,0.75],{x0:40,bx:150,y0:690,dy:90,unit:200,g:b}));
  s+=tag('予想',40,880,{g:vseg(ctx,p,.4,.7),text:'水の中で 遅い'});
  return s;},
 // 7 どちらも曲がることは説明できる。違うのは水の中の速さだけ
 [K+'cmp:both']:(p,ctx)=>{const t=ctx.tg;
  let s=miniPanel(PNL[0],t,{g:swin(ctx,p,0,0,.3)})+miniPanel(PNL[1],t,{g:swin(ctx,p,0,.15,.45)});
  s+=fade(swin(ctx,p,0,.6,.95)*(1-swin(ctx,p,1,.1,.3)),plate('どちらも 曲がる',475,640,{size:42,color:C.ink,anchor:'middle'}));
  s+=predTag(0,swin(ctx,p,1,.35,.6))+predTag(1,swin(ctx,p,1,.45,.7));
  s+=fade(swin(ctx,p,1,.6,.9),plate('違うのは 水の中の 速さ だけ',450,790,{size:42,color:HC,anchor:'middle'}));
  return s;},
 // 8 水の中の速さを測れば決着。でも光は1秒に30万 km
 [K+'cmp:measure']:(p,ctx)=>{const t=ctx.tg,d=swin(ctx,p,1,0,.25);
  let s=miniPanel(PNL[0],t,{dim:d})+miniPanel(PNL[1],t,{dim:d});
  s+=fade(1-d*.65,predTag(0,1)+predTag(1,1));
  s+=fade(1-swin(ctx,p,0,0,.2),plate('違うのは 水の中の 速さ だけ',450,790,{size:42,color:HC,anchor:'middle'}));
  s+=fade(swin(ctx,p,0,.15,.4)*(1-d),plate('水の中の 速さを 測れば 決着',450,790,{size:42,color:HC,anchor:'middle'}));
  const g=swin(ctx,p,1,.2,.6);
  if(g>0){const x=60+((cueT(p,ctx)*700)%900);
   s+=fade(g,rect(110,220,780,200,{fill:'#131f38',fo:.95,stroke:HC,sw:3,rx:18})+label('1秒に 30万 km',500,350,{size:76,color:HC,anchor:'middle',weight:700})
    +line(40,790,880,790,{color:LIGHT,w:2,opacity:.35})+draw([[Math.max(40,x-160),790],[x,790]],1,{color:LIGHT,w:8})+dot(x,790,12,LIGHT));}
  return s;},
 // 9 1849年 フィゾー：8.6 km 離れた2か所で光を往復
 [K+'fiz:map']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx);
  let s=nameCard(40,30,'フィゾー','1849年・フランス',{g:vseg(ctx,p,0,.2)})+tag('実験',960,60,{anchor:'end',g:vseg(ctx,p,0,.2)});
  const g=vseg(ctx,p,.2,.45);
  s+=fade(g,line(40,560,960,560,{color:C.faint,w:4})
   +rect(70,430,120,130,{fill:'#2a3346',fo:1,stroke:'#5c6f90',sw:3,rx:6})+dot(190,470,14,LIGHT)+label('光を 出す',130,620,{size:38,color:C.ink,anchor:'middle',weight:700})
   +`<path d="M640 560 Q770 420 900 560Z" fill="#2a3346" stroke="#5c6f90" stroke-width="3"/>`+line(800,430,800,510,{color:GLASS,w:10})+label('鏡',800,400,{size:40,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.3,.55),arrow(500,650,200,650,{color:C.ink,w:4,head:18})+arrow(500,650,800,650,{color:C.ink,w:4,head:18})+plate('8.6 km',500,720,{size:48,color:C.ink,anchor:'middle'}));
  // 往復する光
  const a=.62*ve,T=1.6;
  if(t>a){const u=((t-a)%(2*T))/T,x=u<1?mix(205,790,u):mix(790,205,u-1),y=470;
   s+=draw([[205,y],[790,y]],1,{color:LIGHT,w:2,opacity:.3})+dot(x,y,20,LIGHT,.35)+dot(x,y,11,LIGHT);
   s+=fade(seg(t,a,a+.4),plate('往復',500,440,{size:40,color:LIGHT,anchor:'middle'}));}
  s+=slowNote(vseg(ctx,p,.6,.8));
  return s;},
 // 10 720枚の歯の歯車。光はすき間を抜け、遠くの鏡で跳ね返って戻る
 [K+'fiz:wheel']:(p,ctx)=>{const t=cueT(p,ctx),w1=sentWin(ctx)[1]??[0,voiceEnd(ctx)];
  let s=fade(vseg(ctx,p,0,.15),fizeauBase({off:0,teeth:swin(ctx,p,0,.3,.6)}));
  s+=tag('実験',960,60,{anchor:'end'});
  const t0=w1[0]+.1*(w1[1]-w1[0]),T=.62*(w1[1]-w1[0]);
  s+=flight(t,t0,T);
  s+=fade(swin(ctx,p,1,.05,.3),plate('すき間を 抜ける',360,350,{size:40,color:LIGHT}));
  s+=fade(swin(ctx,p,1,.45,.7),plate('跳ね返って 戻る',360,420,{size:40,color:LIGHT}));
  s+=note('歯の数は 減らして 描いています',40,850)+slowNote(1,895);
  return s;},
 // 11 ゆっくり回す → 同じすき間を通る。速く回す → 次の歯でさえぎられる
 [K+'fiz:spin']:(p,ctx)=>{const t=cueT(p,ctx),sw=sentWin(ctx),w0=sw[0],w1=sw[1]??sw[0];
  const T=1.4,TL=T*0.25; // T：歯車から鏡へ行って歯車へ戻るまで（図の上の時間）
  const VS=.11*GP/T,VF=.5*GP/T;
  const td0=w0[0]+.2*(w0[1]-w0[0]);                    // ゆっくり：歯車を抜ける時刻
  const tsw=w1[0];const offSw=VS*(tsw-td0);
  // 速く回す：回し始めから td1 までの速さ V1 を選んで、td1 にすき間の真ん中が光の高さに来るようにする（その後は VF）
  const td1=w1[0]+.2*(w1[1]-w1[0]),dt=Math.max(.3,td1-tsw),kk=Math.ceil((offSw+.6*VF*dt)/GP),V1=(kk*GP-offSw)/dt;
  const off=t<tsw?VS*(t-td0):t<td1?offSw+V1*(t-tsw):kk*GP+VF*(t-td1);
  let s=fizeauBase({off,teeth:1})+tag('実験',960,60,{anchor:'end'});
  // 光源を出るのは歯車を抜ける少し前（同じ速さで）
  const lead=T*((BY-LAMP[1])+(SX-HM[0]))/(L_OUT-((BY-LAMP[1])+(SX-HM[0])));
  const Tall=T+lead;
  if(t<tsw)s+=flight(t,td0-lead,Tall);else s+=flight(t,td1-lead,Tall,{blocked:true});
  const a=swin(ctx,p,0,0,.15)*(1-swin(ctx,p,1,0,.1)),b=t<tsw?seg(t,td0+T,td0+T+.3):0;
  s+=fade(a,plate('ゆっくり 回す',360,280,{size:44,color:C.ink}));
  s+=fade(b*(1-swin(ctx,p,1,0,.1)),plate('同じ すき間を 通る',360,350,{size:42,color:GOOD}));
  const c=swin(ctx,p,1,0,.15),d=t>=tsw?seg(t,td1+T,td1+T+.3):0;
  s+=fade(c,plate('速く 回す',360,280,{size:44,color:C.ink}));
  s+=fade(d,plate('次の 歯で',360,350,{size:42,color:BAD})+plate('さえぎられる',360,410,{size:42,color:BAD}));
  s+=note('歯の数は 減らして 描いています',40,850)+slowNote(1,895);
  return s;},
 // 16 8.6 km の水の管は作れない
 [K+'tube:no']:(p,ctx)=>{const g=vseg(ctx,p,0,.4),x=vseg(ctx,p,.55,.8);
  let s=fade(g,rect(40,380,960,110,{fill:WATER,fo:.35,stroke:SURF,sw:4,rx:0})+line(40,380,40,490,{color:SURF,w:6})+label('…',960,450,{size:48,color:SURF,anchor:'end',weight:700}));
  s+=fade(g,label('8.6 km の 水の管',60,300,{size:48,color:C.ink,weight:700}));
  s+=fade(seg(g,.4,1),arrow(450,560,60,560,{color:C.dim,w:4,head:18})+arrow(450,560,860,560,{color:C.dim,w:4,head:18})+plate('8.6 km',450,630,{size:44,color:C.ink,anchor:'middle'}));
  s+=fade(x,line(330,345,670,545,{color:BAD,w:16})+line(330,545,670,345,{color:BAD,w:16}));
  s+=fade(vseg(ctx,p,.7,.95),plate('作れない',500,760,{size:52,color:BAD,anchor:'middle'}));
  return s;},
 // 17 1850年 フーコー：速く回る鏡で、部屋の中の距離で比べる
 [K+'fou:setup']:(p,ctx)=>{const t=cueT(p,ctx),sp=vseg(ctx,p,.25,.5),settle=vseg(ctx,p,.5,.58),bm=vseg(ctx,p,.55,.85);
  let s=nameCard(40,30,'フーコー','1850年・フランス',{g:vseg(ctx,p,0,.2)})+tag('実験',960,60,{anchor:'end',g:vseg(ctx,p,0,.2)});
  s+=fade(vseg(ctx,p,.15,.35),foucaultBase({room:bm,beam:0,scale:0}));
  const base=Math.atan2(MDIR(0)[1],MDIR(0)[0]),ang=base+(1-settle)*t*7;
  s+=fade(vseg(ctx,p,.15,.35),rmirror(0,{ang:sp>0?ang:base}));
  s+=spinArrow(sp*(1-settle*.6));
  s+=draw([FS,FR,FMM],bm,{color:LIGHT,w:5})+fade(seg(bm,.8,1),arrow(mix(FR[0],FMM[0],.4),mix(FR[1],FMM[1],.4),mix(FR[0],FMM[0],.6),mix(FR[1],FMM[1],.6),{color:LIGHT,w:5,head:20}));
  return s;},
 // 18a 光が往復する間に、回る鏡が少しだけ向きを変える
 [K+'fou:turn']:(p,ctx)=>{const t=cueT(p,ctx),ve=voiceEnd(ctx),th=TH0*vseg(ctx,p,.2,.85);
  let s=nameCard(40,30,'フーコー','1850年・フランス',{g:1-vseg(ctx,p,0,.12)})+tag('実験',960,60,{anchor:'end'});
  s+=foucaultBase();
  s+=fade(vseg(ctx,p,.2,.35),rmirror(0,{ghost:true}))+rmirror(th);
  const u1=vseg(ctx,p,.05,.5),u2=vseg(ctx,p,.5,.85);
  if(u2<=0)s+=pulseOn([FS,FR,FMM],u1);else s+=pulseOn([FMM,FR],u2);
  s+=fade(vseg(ctx,p,.6,.9),plate('少しだけ 回る',620,755,{size:40,color:HC}));
  s+=note('動きは ゆっくりに しています',40,866,{g:vseg(ctx,p,0,.2)})+note('角度と ずれは 大きく 誇張',40,910,{g:vseg(ctx,p,.5,.7)});
  return s;},
 // 18b 戻った光の位置がずれる
 [K+'fou:shift']:(p,ctx)=>{const u=vseg(ctx,p,0,.45),y=spotY(TH0);
  let s=tag('実験',960,60,{anchor:'end'})+foucaultBase();
  s+=rmirror(0,{ghost:true})+rmirror(TH0)+plate('少しだけ 回る',620,755,{size:40,color:HC});
  s+=draw([FR,[SCX,y]],u,{color:LIGHT,w:4});
  s+=spotMark(FR[1],{g:vseg(ctx,p,.3,.5),color:C.dim,ghost:true});
  s+=spotMark(y,{g:seg(u,.95,1)});
  s+=shiftBrace(y,vseg(ctx,p,.5,.8));
  s+=note('動きは ゆっくりに しています',40,866)+note('角度と ずれは 大きく 誇張',40,910);
  return s;},
 // 22 フィゾーたちも同じ結果。波の説が正しかった
 [K+'verdict:wave']:(p,ctx)=>{const t=ctx.tg,v=swin(ctx,p,1,.3,.7);
  let s=miniPanel(PNL[0],t,{dim:v})+miniPanel(PNL[1],t);
  s+=predTag(0,1,{strike:v})+fade(1-v,predTag(1,1))+fade(v,predTag(1,1,{kind:'結果'}));
  s+=fade(swin(ctx,p,0,.2,.5)*(1-swin(ctx,p,1,0,.2)),plate('フィゾーたちも 同じ 結果（1850年）',450,790,{size:40,color:C.ink,anchor:'middle'}));
  s+=fade(v,rect(490,10,460,550,{fill:'none',fo:0,stroke:HC,sw:6,rx:18})+plate('波の説が 正しかった',450,790,{size:48,color:HC,anchor:'middle'}));
  return s;},
 // 24 赤い光と青い光は、波の何が違う？
 [K+'color:waves']:(p,ctx)=>{const t=ctx.tg,ph=t*40;
  let s=fade(swin(ctx,p,0,0,.6),plate('光は 波',500,90,{size:48,color:C.ink,anchor:'middle'}));
  const a=swin(ctx,p,1,.1,.4),b=swin(ctx,p,1,.25,.55);
  s+=fade(a,label('赤い 光',60,190,{size:40,color:RED,weight:700}))+sine(300,700*SC_NM,ph,{color:RED,g:a});
  s+=fade(b,label('青い 光',60,420,{size:40,color:BLUE,weight:700}))+sine(530,450*SC_NM,ph,{color:BLUE,g:b,x1:880});
  s+=bigQ(500,800,swin(ctx,p,1,.65,.95),170);
  return s;},
 // 25 違いは山と山の間隔＝波長。赤 約700 nm、紫 約400 nm
 [K+'color:lambda']:(p,ctx)=>{const ph=(ctx.tg-cueT(p,ctx))*40;
  let s=fade(1-swin(ctx,p,0,0,.15),plate('光は 波',500,90,{size:48,color:C.ink,anchor:'middle'}));
  s+=bigQ(500,800,1-swin(ctx,p,0,0,.15),170);
  s+=label('赤い 光',60,190,{size:40,color:RED,weight:700})+sine(300,700*SC_NM,ph,{color:RED});
  s+=label('青い 光',60,420,{size:40,color:BLUE,weight:700})+sine(530,450*SC_NM,ph,{color:BLUE,x1:880});
  const m1=swin(ctx,p,0,.3,.6),nm=swin(ctx,p,1,.05,.3);
  s+=lamMark(300,700*SC_NM,ph,300,m1,{text:''})+fade(m1*(1-nm),lamMark(300,700*SC_NM,ph,300,1,{text:'波長'}))+fade(nm,lamMark(300,700*SC_NM,ph,300,1,{text:'約700 nm'}));
  s+=lamMark(530,450*SC_NM,ph,480,swin(ctx,p,0,.5,.8),{text:''});
  s+=fade(nm,plate('長い',230,190,{size:40,color:RED}));
  const v=swin(ctx,p,1,.35,.65);
  s+=fade(v,label('紫の 光',60,650,{size:40,color:VIOLET,weight:700}))+sine(760,400*SC_NM,ph,{color:VIOLET,g:v,x1:880});
  s+=fade(swin(ctx,p,1,.55,.8),lamMark(760,400*SC_NM,ph,480,1,{text:'約400 nm'})+plate('短い',230,650,{size:40,color:VIOLET})+plate('短い',230,420,{size:40,color:BLUE}));
  s+=note('1 nm ＝ 10億分の1 m',40,895,{g:swin(ctx,p,1,.3,.6)});
  return s;},
 // 12 光が消えたのは 12.6 回転／秒。往復の間に、すき間の場所に隣の歯が来た（縁を拡大）
 [K+'fiz:result']:(p,ctx)=>{const r=12.6*swin(ctx,p,0,.1,.75),z=swin(ctx,p,1,0,.12);
  let s=fade(1-.55*z,fizResult(ctx,p,{r,calc:[0,0,0,0],gone:swin(ctx,p,0,.75,.95)}));
  if(z>0)s+=fade(z,zoomGap(ctx,p));
  return s;},
 // 13 720枚 → 1回転の 1440分の1。12.6 回転／秒 → 約1万8000分の1秒
 [K+'fiz:steps']:(p,ctx)=>stepsFig(ctx,p),
 // 14 17.2 km を その時間で進んだ。距離 ÷ 時間 ＝ 約31万 km
 [K+'fiz:calc']:(p,ctx)=>calcFig(ctx,p),
 // 15 今の値 約30万 km に近い
 [K+'fiz:compare']:(p,ctx)=>{const f=vseg(ctx,p,0,.15),g=vseg(ctx,p,.1,.35);
  let s=fade(1-f,calcFig(ctx,p,{all:true}));
  if(g>0){
   s+=fade(g,label('1秒に 進む 距離',60,120,{size:40,color:C.dim}));
   s+=fade(g,label('フィゾーの 測定（1849年）',60,250,{size:40,color:C.ink,weight:700})+rect(60,280,682*seg(g,.2,1),70,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:8})+label('約31万 km',760,330,{size:44,color:LIGHT,weight:700}));
   const h=vseg(ctx,p,.25,.6);
   s+=fade(h,tag('今の値',60,470)+rect(60,500,660*seg(h,.2,1),70,{fill:'#9aabc7',fo:.85,stroke:'#9aabc7',rx:8})+label('約30万 km',760,550,{size:44,color:'#c4cde0',weight:700}));
   s+=fade(vseg(ctx,p,.65,.95),plate('かなり 近い',400,700,{size:52,color:HC,anchor:'middle'}));
   s+=tag('実験',960,60,{anchor:'end'});
  }
  return s;},
 // 19a 時間が長いほど → 鏡が多く回る → ずれが大きい
 [K+'fou:time']:(p,ctx)=>{const k=1+.6*swin(ctx,p,0,.1,.5);
  const a=swin(ctx,p,0,0,.2),b=swin(ctx,p,0,.5,.75),c=swin(ctx,p,1,.05,.4);
  return fouScene(k,{rows:[a,b,c]});},
 // 19b ずれの大きさで、往復の時間を比べられる
 [K+'fou:measure']:(p,ctx)=>{const k=mix(1.6,1,vseg(ctx,p,0,.3));
  return fouScene(k,{rows:[1,1,1]})+fade(vseg(ctx,p,.35,.7),plate('ずれを 見れば → 時間を 比べられる',60,330,{size:40,color:HC}));},
 // 20 同じ長さの道の一部を水の管に → ずれは空気だけのときより大きい
 [K+'fou:water']:(p,ctx)=>{const br=swin(ctx,p,0,0,.3),tube=swin(ctx,p,0,.4,.8),mv=swin(ctx,p,1,.3,.85);
  return fouScene(mix(1,1.5,mv),{rows:[0,0,1],tube,bracket:br,same:tube,airGhost:mv,airMark:mv});},
 // 21 同じ長さで時間がかかった → 水の中のほうが遅い
 [K+'fou:slow']:(p,ctx)=>{
  let s=fouScene(1.5,{rows:[0,0,1],tube:1,bracket:1,same:1,airGhost:1,airMark:1,rowFade:1-swin(ctx,p,0,0,.15)});
  s+=fade(swin(ctx,p,0,.05,.35),plate('同じ 長さ',60,140,{size:42,color:C.ink}));
  s+=fade(swin(ctx,p,0,.45,.8),plate('＋ 時間が 長い',300,140,{size:42,color:C.t}));
  s+=fade(swin(ctx,p,1,.1,.4),plate('→ 遅い',620,140,{size:42,color:HC}));
  s+=tag('結果',60,330,{g:swin(ctx,p,1,.4,.8),text:'水の中のほうが 遅い',size:40});
  return s;},
 // 23a 1885年 マイケルソン：水の中は空気のおよそ4分の3
 [K+'mich:bars']:(p,ctx)=>michFig(ctx,p),
 // 23b 01の予想どおり
 [K+'mich:ok']:(p,ctx)=>michFig(ctx,p,{all:true})+fade(vseg(ctx,p,0,.3),rect(40,560,820,130,{fill:'#131f38',fo:.95,stroke:PRED,sw:3,rx:16})+tag('予想',70,612,{text:'01 の 動画'})+label('1 ÷ 1.33 ≈ 0.75',70,670,{size:44,color:PRED,weight:700}))+tag('結果',60,800,{g:vseg(ctx,p,.35,.7),text:'予想どおり',size:48}),
 // 26 白い光をガラスに通すと虹色に分かれる。ニュートンはプリズム2つで正体を突き止めた
 [K+'color:prism']:(p,ctx)=>{
  let s=prism(swin(ctx,p,0,0,.45),swin(ctx,p,0,.4,.9));
  s+=fade(swin(ctx,p,0,.7,1)*(1-swin(ctx,p,1,0,.2)),plate('虹色に 分かれる',560,600,{size:42,color:C.ink}));
  s+=nameCard(40,620,'ニュートン','プリズム 2つ',{g:swin(ctx,p,1,.05,.3)});
  s+=ghostPrism(swin(ctx,p,1,.35,.7));
  s+=note('色の 広がりは 大きく 誇張',40,895,{g:swin(ctx,p,0,.5,.8)});
  return s;},
 // 27 白い光の中で、何が起きている？
 [K+'color:q']:(p,ctx)=>{const f=vseg(ctx,p,0,.25);
  let s=prism(1,1)+fade(1-f,nameCard(40,620,'ニュートン','プリズム 2つ')+ghostPrism(1));
  s+=finalCard(['白い光の中で','何が起きている？'],vseg(ctx,p,.2,.6),{y:620,size:58});
  s+=note('色の 広がりは 大きく 誇張',40,895);
  return s;},
};
// ================= 第2版で足した図 =================
// 12：歯車の縁を拡大。光が出るときはすき間の真ん中、戻るときは隣の歯の真ん中（半歩＝すき間の幅だけ回った）
const ZY=650,ZP=240,ZX=500;
function zoomStrip(o){
 let s=`<clipPath id="d02zs"><rect x="${ZX-70}" y="430" width="140" height="400"/></clipPath><g clip-path="url(#d02zs)">`;
 for(let k=-3;k<=3;k++){const y=ZY+ZP/4+k*ZP+o;s+=rect(ZX-60,y,120,ZP/2,{fill:'#8a96ad',fo:.9,stroke:'#c4cde0',sw:3,rx:6});}
 return s+'</g>'+rect(ZX-70,430,140,400,{fill:'none',fo:0,stroke:C.faint,sw:3,rx:8});
}
function zoomGap(ctx,p){
 const o=ZP/2*swin(ctx,p,1,.3,.7);
 let s=rect(30,395,940,500,{fill:C.bg,fo:.92,stroke:C.faint,sw:2,rx:16})+tag('歯車の 縁を 拡大',60,450,{color:C.dim});
 s+=fade(swin(ctx,p,1,.1,.3),rect(ZX-60,ZY-ZP/4,120,ZP/2,{fill:'none',fo:0,stroke:GOOD,sw:3,rx:6}));
 s+=zoomStrip(o);
 // 出ていく光（右へ）と、戻ってきた光（左へ、歯でさえぎられる）
 const a=swin(ctx,p,1,.08,.3),b=swin(ctx,p,1,.68,.88);
 s+=fade(a*(1-swin(ctx,p,1,.35,.45)),arrow(260,ZY-20,860,ZY-20,{color:LIGHT,w:6,head:22,g:a})+plate('出ていく 光',600,ZY-50,{size:38,color:LIGHT}));
 s+=fade(b,arrow(880,ZY+20,ZX+80,ZY+20,{color:LIGHT,w:6,head:22,g:b})+plate('戻ってきた 光',620,ZY+80,{size:38,color:LIGHT}));
 s+=fade(seg(b,.8,1),line(ZX+64,ZY-10,ZX+104,ZY+50,{color:BAD,w:7})+line(ZX+64,ZY+50,ZX+104,ZY-10,{color:BAD,w:7}));
 s+=fade(swin(ctx,p,1,.1,.3),plate('出るとき：すき間',60,560,{size:38,color:GOOD}));
 s+=fade(swin(ctx,p,1,.7,.9),plate('戻るとき：隣の 歯',60,800,{size:38,color:BAD}));
 s+=fade(swin(ctx,p,1,.3,.7),arrow(ZX-90,ZY-40,ZX-90,ZY+40,{color:HC,w:5,head:18})+plate('回る',ZX-110,ZY+14,{size:38,color:HC,anchor:'end'}));
 s+=note('動きは ゆっくりに しています',60,875,{g:a});
 return s;
}
// 13：1回転を 1440 に分けた目盛り
const RC=[250,300],RR=200;
function ring1440(rot=0,g=1){
 let d='';for(let k=0;k<1440;k++){const a=(k/1440*360+rot)*DEG,c=Math.cos(a),si=Math.sin(a),r1=k%2?RR-14:RR-26;
  d+=`M${n1(RC[0]+r1*c)} ${n1(RC[1]+r1*si)}L${n1(RC[0]+RR*c)} ${n1(RC[1]+RR*si)}`;}
 return fade(g,`<path d="${d}" stroke="#9aabc7" stroke-width="1" fill="none"/>`+ring(RC[0],RC[1],RR,{color:'#c4cde0',w:3})+dot(RC[0],RC[1],14,'#c4cde0')+label('1回転',RC[0],RC[1]+60,{size:38,color:C.ink,anchor:'middle',weight:700}));
}
function stepsFig(ctx,p){
 const g=swin(ctx,p,0,0,.25),z=swin(ctx,p,0,.25,.5),t=cueT(p,ctx);
 let s=ring1440(swin(ctx,p,1,0,1)*40,g);
 // 拡大：歯・すき間と目盛り
 const bx=540,by=110,bw=420,bh=250;
 s+=fade(z,dot(RC[0]+RR,RC[1],8,HC)+line(RC[0]+RR,RC[1],bx,by+bh,{color:HC,w:2,dash:'6 6'})+line(RC[0]+RR,RC[1],bx,by,{color:HC,w:2,dash:'6 6'})
  +rect(bx,by,bw,bh,{fill:C.bg,fo:.95,stroke:HC,sw:3,rx:12}));
 if(z>0){let q='';const w=70;
  for(let k=0;k<6;k++){const x=bx+20+k*w;q+=k%2?'':rect(x,by+40,w,70,{fill:'#8a96ad',fo:.9,stroke:'#c4cde0',sw:2,rx:4});}
  q+=line(bx+20,by+40,bx+20+6*w,by+40,{color:'#c4cde0',w:2});
  for(let k=0;k<=6;k++){const x=bx+20+k*w-w/2;if(k>0)q+=line(x,by+120,x,by+150,{color:C.dim,w:3});}
  q+=label('歯',bx+20+w/2,by+90,{size:36,color:C.bg,anchor:'middle',weight:700})+label('すき間',bx+20+w*1.5,by+30,{size:36,color:C.dim,anchor:'middle'});
  const x1=bx+20+w*1.5,x2=bx+20+w*2.5,m=swin(ctx,p,0,.6,.85);
  q+=fade(m,dot(x1,by+135,9,GOOD)+dot(x2,by+135,9,BAD)+arrow(x1,by+190,x2,by+190,{color:HC,w:4,head:16})+arrow(x2,by+190,x1,by+190,{color:HC,w:4,head:16})+label('1目盛り',(x1+x2)/2,by+235,{size:36,color:HC,anchor:'middle',weight:700}));
  s+=fade(z,q);}
 s+=fade(swin(ctx,p,0,.2,.45),label('歯 720枚 ＋ すき間 720 ＝ 1440 区切り',60,590,{size:38,color:C.ink,weight:700}));
 s+=fade(swin(ctx,p,0,.6,.9),label('すき間 → 隣の歯 ＝ 1回転の 1440分の1',60,650,{size:40,color:HC,weight:700}));
 s+=fade(swin(ctx,p,1,0,.3),label('1秒に 12.6回転',60,740,{size:40,color:C.ink,weight:700}));
 s+=fade(swin(ctx,p,1,.25,.55),label('1秒に 進む 目盛り：1440 × 12.6 ≈ 1万8000',60,800,{size:38,color:C.ink}));
 s+=fade(swin(ctx,p,1,.65,.95),label('1目盛り ≈ 1万8000分の1秒',60,875,{size:48,color:HC,weight:700}));
 s+=tag('実験',960,60,{anchor:'end'});
 s+=note('目盛りは 細かすぎるので 灰色の 帯に 見えます',40,60,{g:g*(1-z)});
 return s;
}
// 14：距離 ÷ 時間
function calcFig(ctx,p,{all=false}={}){
 const W0=all?1:swin(ctx,p,0,0,.3),W1=all?1:swin(ctx,p,0,.3,.7),W2=all?1:swin(ctx,p,0,.75,1);
 const A=all?1:swin(ctx,p,1,0,.2),B=all?1:swin(ctx,p,1,.2,.45),Cc=all?1:swin(ctx,p,1,.45,.65),Dd=all?1:swin(ctx,p,1,.7,.95);
 let s=fade(W0,dot(80,170,16,LIGHT)+label('光を 出す',80,240,{size:36,color:C.ink,anchor:'middle'})+line(880,120,880,220,{color:GLASS,w:10})+label('鏡',880,260,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(W0,arrow(110,150,860,150,{color:LIGHT,w:5,head:20,g:W1})+fade(seg(W1,.5,1),arrow(860,190,110,190,{color:LIGHT,w:5,head:20})));
 s+=fade(W1,plate('行き 8.6 km ＋ 帰り 8.6 km ＝ 17.2 km',60,330,{size:38,color:C.ink}));
 s+=fade(W2,plate('かかった 時間：約1万8000分の1秒',60,395,{size:38,color:C.ink}));
 s+=tag('定義',60,480,{g:A,text:'速さ ＝ 距離 ÷ 時間'});
 s+=fade(B,label('17.2 km ÷ 1万8000分の1秒',60,560,{size:44,color:C.ink,weight:700}));
 s+=fade(Cc,label('＝ 17.2 km × 1万8000',60,630,{size:44,color:C.ink,weight:700})+label('（1万8000分の1 で 割る ＝ 1万8000 を かける）',60,685,{size:36,color:C.dim}));
 s+=fade(Dd,label('≈ 1秒に 約31万 km',60,790,{size:58,color:HC,weight:700})+tag('結果',640,785));
 s+=tag('実験',960,60,{anchor:'end'});
 return s;
}
// 19〜21：フーコーの図（k：往復の時間の倍率。鏡の回る角も ずれも k に比例）
function fouScene(k,{rows=[0,0,0],tube=0,bracket=0,same=0,airGhost=0,airMark=0,rowFade=1}={}){
 const th=TH0*k,y=spotY(th),yA=spotY(TH0);
 let s=tag('実験',960,60,{anchor:'end'})+foucaultBase();
 const R=[['往復の 時間',C.t,200*k],['鏡の 回る 角',C.v,200*k],['ずれ',HC,(y-FR[1])*3.4]];
 R.forEach(([t,c,w],i)=>{const yy=70+i*52;s+=fade(rows[i]*rowFade,label(t,60,yy+32,{size:38,color:c,weight:700})+rect(330,yy,w,42,{fill:c,fo:.85,stroke:c,rx:6}));});
 s+=fade(rows[2]*airMark*rowFade,line(330+(yA-FR[1])*3.4,166,330+(yA-FR[1])*3.4,222,{color:C.ink,w:3,dash:'6 6'})+label('空気だけ',330+(yA-FR[1])*3.4,155,{size:36,color:C.dim,anchor:'middle'}));
 if(bracket>0){const nx=-RTOM[1],ny=RTOM[0],o=-55,P=[FR[0]+nx*o,FR[1]+ny*o],Q=[FMM[0]+nx*o,FMM[1]+ny*o];
  s+=fade(bracket,line(P[0],P[1],Q[0],Q[1],{color:C.ink,w:3})+line(P[0]-nx*14,P[1]-ny*14,P[0]+nx*14,P[1]+ny*14,{color:C.ink,w:3})+line(Q[0]-nx*14,Q[1]-ny*14,Q[0]+nx*14,Q[1]+ny*14,{color:C.ink,w:3}));
  const M=[(P[0]+Q[0])/2-nx*60,(P[1]+Q[1])/2-ny*60];
  s+=fade(bracket*(1-same),plate('道の 長さ',M[0],M[1],{size:38,color:C.ink,anchor:'middle'}));
  s+=fade(bracket*same,plate('長さは 同じ',M[0],M[1],{size:38,color:C.ink,anchor:'middle'}));}
 s+=waterTube(tube);
 s+=rmirror(0,{ghost:true})+rmirror(th);
 s+=fade(airGhost,returnBeam(TH0,.5,{color:C.dim})+spotMark(yA,{ghost:true,color:LIGHT}));
 s+=returnBeam(th)+spotMark(FR[1],{color:C.dim,ghost:true})+spotMark(y);
 s+=shiftBrace(y,1,{text:airGhost>0?'':'ずれ'});
 s+=fade(airGhost,plate('空気だけ',SCX-50,yA+12,{size:36,color:LIGHT,anchor:'end'})+plate('水',SCX-50,y+34,{size:40,color:SURF,anchor:'end'}));
 s+=note('動きは ゆっくりに しています',40,866)+note('角度と ずれは 大きく 誇張',40,910);
 return s;
}
// 23：マイケルソン 1885年
function michFig(ctx,p,{all=false}={}){
 const a=all?1:vseg(ctx,p,0,.2),b=all?1:vseg(ctx,p,.35,.6),c=all?1:vseg(ctx,p,.6,.9);
 let s=nameCard(40,30,'マイケルソン','1885年・アメリカ',{w:600,g:a})+tag('実験',960,60,{anchor:'end',g:a});
 s+=fade(b,label('速さ',60,280,{size:38,color:C.dim})+label('空気',60,350,{size:40,color:C.ink,weight:700})+rect(180,315,600*seg(b,.2,1),52,{fill:LIGHT,fo:.85,stroke:LIGHT,rx:6})+label('1',800,355,{size:42,color:LIGHT,weight:700}));
 s+=fade(c,label('水',60,450,{size:40,color:SURF,weight:700})+rect(180,415,450*seg(c,0,.6),52,{fill:WATER,fo:.85,stroke:SURF,rx:6})+label('およそ 4分の3',650,455,{size:42,color:SURF,weight:700}));
 return s;
}
// 26：2つ目のプリズム（影だけ。中で何が起きるかは 03 で）
function ghostPrism(g){
 return fade(g,poly([[760,480],[650,690],[870,690]],{fill:'#c9d6ea',fo:.06,stroke:'none'})+draw([[760,480],[650,690],[870,690],[760,480]],1,{color:GLASS,w:3,dash:'10 8'})+label('？',760,650,{size:80,color:HC,anchor:'middle',weight:700})+label('2つ目の プリズム',760,750,{size:36,color:C.dim,anchor:'middle'}));
}
// フィゾーの結果（回転数の目盛り・戻った光の明るさ・計算）
function fizResult(ctx,p,{r=0,calc=[0,0,0,0],gone=0}={}){
 let s=label('歯車が 1秒に 回る 回数',60,100,{size:38,color:C.dim});
 const X=v=>80+40*v;
 s+=line(X(0),200,X(20),200,{color:C.dim,w:4});
 for(let v=0;v<=20;v+=5)s+=line(X(v),188,X(v),212,{color:C.dim,w:3})+label(String(v),X(v),255,{size:36,color:C.dim,anchor:'middle'});
 s+=`<polygon points="${n1(X(r))},196 ${n1(X(r)-14)},166 ${n1(X(r)+14)},166" fill="${HC}"/>`+label(r.toFixed(1),X(r),150,{size:40,color:HC,anchor:'middle',weight:700});
 const br=clamp(1-r/12.6);
 s+=label('戻った 光',60,335,{size:38,color:C.ink})+rect(260,302,400,44,{fill:'none',fo:0,stroke:C.faint,sw:2,rx:6})+rect(260,302,400*br,44,{fill:LIGHT,fo:.85,stroke:'none',rx:6});
 s+=fade(gone,plate('光が 消えた',690,338,{size:40,color:BAD}));
 s+=fade(calc[0],label('歯が 半歩 進む 時間',60,450,{size:38,color:C.dim})+label('1 ÷ (2 × 720 × 12.6) ≈ 0.000055 秒',60,510,{size:42,color:C.ink,weight:700}));
 s+=fade(calc[1],label('光の 往復',60,590,{size:38,color:C.dim})+label('2 × 8.6 km ＝ 17.2 km',60,650,{size:42,color:C.ink,weight:700}));
 s+=fade(calc[2],label('17.2 km ÷ 0.000055 秒',60,740,{size:44,color:HC,weight:700}));
 s+=fade(calc[3],label('≈ 1秒に 約31万 km',60,820,{size:56,color:HC,weight:700})+tag('結果',640,815,{g:1}));
 s+=tag('実験',960,60,{anchor:'end'});
 return s;
}

