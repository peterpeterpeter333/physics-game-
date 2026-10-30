// YouTube シリーズ「ベクトル・中級 1/1」(ys-um-vector-components-1) — 図。Stage 1200×515.
// 色：𝐀 桃(C.p)、𝐁 橙(C.E)（初級ベクトルに合わせる）、x 成分 水色、y 成分 紫、z 成分 金、影 黄、
//   力 𝐅 緑、加速度 𝐚 赤、位置 𝐫 白、移動 Δ𝐫 水色（内積・中級に合わせる）、誤り 赤。ベクトルは太字、長さは細字。
// 3次元の軸：x 右、y 奥（斜め右上に描く）、z 上。
import {C,clamp,mix,smooth,seg,fade,label,line,rect,dot,ring,draw,arrow,brace,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-vector-components-1:';
const VA=C.p,VB=C.E,CX=C.x,CY=C.v,CZ=C.t,SH=C.hi,FC=C.F,AC=C.a,RC='#dfe9ff',DR=C.x,HI=C.hi,NG=C.a;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});
const cross=(x,y,sz=16,color=NG)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const vA=cs(VA,'\\mathbf{A}'),vB=cs(VB,'\\mathbf{B}'),vF=cs(FC,'\\mathbf{F}'),va=cs(AC,'\\mathbf{a}');
const hB=cs(VB,'\\hat{\\mathbf{B}}');
const ax=cs(CX,'x'),ay=cs(CY,'y'),az=cs(CZ,'z');

// ---- oblique 3D: x right, y into the screen (drawn up-right), z up -------------------------
const KY=.62,AY=32*Math.PI/180;
function view({ox,oy,u}){return (x,y,z)=>[ox+u*(x+KY*Math.cos(AY)*y),oy-u*(z+KY*Math.sin(AY)*y)];}
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=2.4,yl=2.8,zl=2.6,g=[1,1,1],names=true,floor=0}={}){
 let s='';
 if(floor){for(let i=0;i<=Math.floor(xl);i++)s+=fade(floor,L3(P,[i,0,0],[i,Math.floor(yl),0],{color:C.grid,w:1.5}));
  for(let j=0;j<=Math.floor(yl);j++)s+=fade(floor,L3(P,[0,j,0],[Math.floor(xl),j,0],{color:C.grid,w:1.5}));}
 const ends=[[xl,0,0],[0,yl,0],[0,0,zl]],cols=[CX,CY,CZ],nm=[['x','右'],['y','奥'],['z','上']],off=[[14,8],[12,-4],[-10,-14]];
 ends.forEach((e,i)=>{const E=P(...e);s+=fade(g[i],V3(P,[0,0,0],e,{color:cols[i],w:3,head:14})
  +(names?label(`${nm[i][0]}（${nm[i][1]}）`,E[0]+off[i][0],E[1]+off[i][1],{size:24,color:cols[i],anchor:i===2?'middle':'start',weight:700}):''));});
 return s;
}
// right-angle mark at corner c between directions d1,d2 (3D unit steps)
function rmark(P,c,d1,d2,k=.18,color=C.ink){
 const a=[c[0]+d1[0]*k,c[1]+d1[1]*k,c[2]+d1[2]*k],b=[a[0]+d2[0]*k,a[1]+d2[1]*k,a[2]+d2[2]*k],e=[c[0]+d2[0]*k,c[1]+d2[1]*k,c[2]+d2[2]*k];
 return draw([P(...a),P(...b),P(...e)],1,{color,w:2.5});
}
function box3(P,[X,Y,Z],{color=C.dim,w=2,dash='6 6',g=1}={}){
 const v=[[0,0,0],[X,0,0],[X,Y,0],[0,Y,0],[0,0,Z],[X,0,Z],[X,Y,Z],[0,Y,Z]];
 const E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
 return fade(g,E.map(([i,j])=>L3(P,v[i],v[j],{color,w,dash})).join(''));
}

// ---- 2D square grid (data → screen, y up) --------------------------------------------------
function plane({ox,oy,u,x0,x1,y0,y1,g=1,nums=true,xl='x',yl='y',skip=[]}){
 const X=a=>ox+u*a,Y=b=>oy-u*b;let s='';
 for(let a=x0;a<=x1;a++)s+=line(X(a),Y(y0)+u*.3,X(a),Y(y1)-u*.3,{color:C.grid,w:1.5});
 for(let b=y0;b<=y1;b++)s+=line(X(x0)-u*.3,Y(b),X(x1)+u*.3,Y(b),{color:C.grid,w:1.5});
 s+=arrow(X(x0)-u*.3,Y(0),X(x1)+u*.6,Y(0),{color:C.dim,w:2.5,head:13})+arrow(X(0),Y(y0)+u*.3,X(0),Y(y1)-u*.6,{color:C.dim,w:2.5,head:13});
 s+=label(xl,X(x1)+u*.6+8,Y(0)+8,{size:24,color:CX})+label(yl,X(0)+12,Y(y1)-u*.5,{size:24,color:CY});
 if(nums){for(let a=x0;a<=x1;a++)if(a&&!skip.includes(a))s+=label(String(a).replace('-','−'),X(a),Y(0)+28,{size:22,color:C.dim,anchor:'middle'});
  for(let b=y0;b<=y1;b++)if(b)s+=label(String(b).replace('-','−'),X(0)-10,Y(b)+8,{size:22,color:C.dim,anchor:'end'});}
 return {X,Y,svg:fade(g,s)};
}

// ---- shared scenes -----------------------------------------------------------------------------
const PA=view({ox:360,oy:430,u:112});      // 𝐀=(1,2,2) scene
function axesScene(p,{gA=0,path=[0,0,0],labA=0}={}){
 let s=axes3(PA,{xl:2.3,yl:4.3,zl:2.8,floor:1});
 const [p1,p2,p3]=path;
 s+=V3(PA,[0,0,0],[1,0,0],{color:CX,w:6,head:16,g:p1});
 s+=V3(PA,[1,0,0],[1,2,0],{color:CY,w:6,head:16,g:p2});
 s+=V3(PA,[1,2,0],[1,2,2],{color:CZ,w:6,head:16,g:p3});
 s+=V3(PA,[0,0,0],[1,2,2],{color:VA,w:7,head:20,g:gA});
 const m=PA(.5,1,1);s+=fade(labA*gA,T(vA,m[0]-34,m[1]-10,{size:38}));
 return s;
}
function boxScene({gBox=1,gA=1,gShadow=0,gUp=0,gTri1=0,gTri2=0,gEdges=1,gLight=0,dimA=1}={}){
 let s=axes3(PA,{xl:2.3,yl:4.3,zl:2.8,floor:1,names:true});
 s+=box3(PA,[1,2,2],{g:gBox});
 // edges with lengths
 s+=fade(gEdges,L3(PA,[0,0,0],[1,0,0],{color:CX,w:5})+L3(PA,[1,0,0],[1,2,0],{color:CY,w:5})+L3(PA,[1,2,0],[1,2,2],{color:CZ,w:5}));
 const ex=PA(.5,0,0),ey=PA(1,1,0),ez=PA(1,2,1.4);
 s+=fade(gEdges,label('1',ex[0],ex[1]+32,{size:28,color:CX,anchor:'middle',weight:700})+label('2',ey[0]+18,ey[1]+18,{size:28,color:CY,weight:700})+label('2',ez[0]+14,ez[1]+10,{size:28,color:CZ,weight:700}));
 // light rays
 if(gLight>0){for(const [x,y] of [[.3,.5],[.7,1.2],[1,1.9],[.5,1.6]]){const A=PA(x,y,2.7),B=PA(x,y,.12);s+=fade(gLight,line(A[0],A[1],B[0],B[1],{color:SH,w:2,dash:'4 8',opacity:.7}));}}
 // triangles
 if(gTri1>0)s+=fade(gTri1*.35,poly([PA(0,0,0),PA(1,0,0),PA(1,2,0)],{fill:SH,fo:.5}));
 if(gTri2>0)s+=fade(gTri2*.35,poly([PA(0,0,0),PA(1,2,0),PA(1,2,2)],{fill:VA,fo:.5}));
 // shadow arrow
 s+=V3(PA,[0,0,0],[1,2,0],{color:SH,w:6,head:16,g:gShadow});
 s+=fade(gShadow,rmark(PA,[1,0,0],[-1,0,0],[0,1,0],.2));
 s+=fade(gUp,rmark(PA,[1,2,0],[0,0,1],[-1/Math.hypot(1,2),-2/Math.hypot(1,2),0],.22,HI));
 s+=fade(dimA,V3(PA,[0,0,0],[1,2,2],{color:VA,w:7,head:20,g:gA}));
 const m=PA(.45,.9,1.05);s+=fade(gA*dimA,T(vA,m[0]-30,m[1]-8,{size:36}));
 return s;
}
const PB=view({ox:250,oy:440,u:62});       // 𝐁=(0,3,4) scene
function bScene({gB=1,shrink=0,gHat=0,gCopies=0,gF=0,dimB=1}={}){
 let s=axes3(PB,{xl:2,yl:5,zl:5.6,floor:.8});
 s+=fade(dimB*.8,L3(PB,[0,0,0],[0,3,0],{color:CY,w:3,dash:'6 6'})+L3(PB,[0,3,0],[0,3,4],{color:CZ,w:3,dash:'6 6'}));
 const e3=PB(0,1.5,0),e4=PB(0,3,2);
 s+=fade(dimB,label('3',e3[0]+16,e3[1]+20,{size:26,color:CY,weight:700})+label('4',e4[0]+14,e4[1]+8,{size:26,color:CZ,weight:700}));
 s+=fade(dimB,V3(PB,[0,0,0],[0,3,4],{color:VB,w:7,head:20,g:gB}));
 const m=PB(0,1.2,2.4);s+=fade(gB*dimB,T(vB,m[0]+30,m[1]-10,{size:36}));
 if(gCopies>0){for(let i=0;i<5;i++){const a=[0,.6*i,.8*i],b=[0,.6*(i+1),.8*(i+1)],A=PB(...a);s+=fade(seg(gCopies,i*.15,i*.15+.3),V3(PB,a,b,{color:HI,w:5,head:14})+dot(A[0],A[1],4,HI));}}
 if(shrink>0){const k=mix(1,.2,shrink);s+=fade(Math.min(1,shrink*3),V3(PB,[0,0,0],[0,3*k,4*k],{color:HI,w:7,head:18}));}
 if(gHat>0){const E=PB(0,.6,.8);s+=fade(gHat,T(hB,E[0]-44,E[1]+14,{size:34}));}
 if(gF>0){s+=V3(PB,[0,0,0],[0,6,8].map(v=>v*.62),{color:FC,w:7,head:20,g:gF});const E=PB(0,6*.62,8*.62);s+=fade(gF,label('10 N',E[0]+14,E[1]+10,{size:28,color:FC,weight:700}));}
 return s;
}
// 2D top view for position / displacement
const GP={ox:110,oy:465,u:56,x0:0,x1:7,y0:0,y1:6};
const R1=[3,1],R2=[6,5];
function posScene({gr1=1,gr2=1,gD=0,shift=0,labs=1,comps=0}={}){
 const P=plane({...GP,xl:'x（右）',yl:'y（奥）'});let s=P.svg;
 s+=label('真上から見た床（z ＝ 0）',930,490,{size:24,color:C.dim,anchor:'middle'});
 const o=[mix(0,R1[0],shift),mix(0,R1[1],shift)];
 if(shift>0){s+=fade(shift,arrow(P.X(R1[0])-30,P.Y(R1[1]),P.X(R1[0]+3.8),P.Y(R1[1]),{color:HI,w:2.5,head:12})+arrow(P.X(R1[0]),P.Y(R1[1])+30,P.X(R1[0]),P.Y(R1[1]+4.6),{color:HI,w:2.5,head:12})+label('新しい原点',P.X(R1[0])+12,P.Y(R1[1])+36,{size:22,color:HI}));}
 s+=dot(P.X(o[0]),P.Y(o[1]),7,shift>0?HI:C.ink)+fade(1-shift,label('O',P.X(0)-22,P.Y(0)+26,{size:24,color:C.ink}));
 s+=fade(gr1*(1-shift),arrow(P.X(o[0]),P.Y(o[1]),P.X(R1[0]),P.Y(R1[1]),{color:RC,w:5,head:16}));
 s+=arrow(P.X(o[0]),P.Y(o[1]),P.X(R2[0]),P.Y(R2[1]),{color:RC,w:5,head:16,g:gr2});
 s+=dot(P.X(R1[0]),P.Y(R1[1]),7,RC)+fade(gr2,dot(P.X(R2[0]),P.Y(R2[1]),7,RC));
 s+=fade(labs*gr1*(1-shift),T(cs(RC,'\\mathbf{r}_1'),P.X(1.3),P.Y(1.05),{size:30}));
 s+=fade(labs*gr2,T(cs(RC,'\\mathbf{r}_2'),P.X(mix(2.6,4.4,shift))-30,P.Y(mix(2.8,2.6,shift))-10,{size:30}));
 s+=arrow(P.X(R1[0]),P.Y(R1[1]),P.X(R2[0]),P.Y(R2[1]),{color:DR,w:7,head:20,g:gD});
 s+=fade(gD*labs,T(cs(DR,'\\Delta\\mathbf{r}'),P.X(4.6)+38,P.Y(3)+10,{size:32}));
 s+=fade(comps,line(P.X(R1[0]),P.Y(R1[1]),P.X(R2[0]),P.Y(R1[1]),{color:CX,w:4,dash:'8 6'})+line(P.X(R2[0]),P.Y(R1[1]),P.X(R2[0]),P.Y(R2[1]),{color:CY,w:4,dash:'8 6'})
  +label('3',P.X(4.5),P.Y(R1[1])+30,{size:26,color:CX,anchor:'middle',weight:700})+label('4',P.X(R2[0])+14,P.Y(3)+8,{size:26,color:CY,weight:700}));
 return {P,s};
}
// component rows for 𝐅 = m𝐚
const ROWY=[190,280,370];
function rowsBase(){
 let s=T(`${vF}=(6,\\,0,\\,-20)\\ \\mathrm{N},\\quad m=2\\ \\mathrm{kg}`,600,70,{size:44});
 s+=line(120,120,1080,120,{color:C.faint,w:2});
 return s;
}
function rowEq(i,g,solved=0){
 const lab=[['x',CX],['y',CY],['z',CZ]][i],lhs=['6','0','-20'][i],comp=[`a_{\\color{${CX}}x}`,`a_{\\color{${CY}}y}`,`a_{\\color{${CZ}}z}`][i],ans=['3','0','-10'][i];
 const y=ROWY[i];
 let s=fade(g,label(`${lab[0]} の行`,160,y+10,{size:30,color:lab[1],anchor:'middle',weight:700})
  +T(`${cs(FC,lhs)}=2\\,${cs(AC,comp)}`,470,y,{size:46}));
 s+=fade(solved,label('→',700,y+12,{size:36,color:C.dim,anchor:'middle'})+T(`${cs(AC,comp)}=${cs(AC,ans)}`,880,y,{size:46}));
 return s;
}

export const ytUmVectorComponents1Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回の最後の問い',600,40,{size:26,color:C.dim,anchor:'middle'});
  s+=card(60,70,500,290,
    label('ここまで：数直線1本の関数',310,120,{size:26,color:C.ink,anchor:'middle'})
   +arrow(100,280,520,280,{color:C.dim,w:3,head:14})+label('x',528,288,{size:24,color:CX})
   +[1,2,3,4,5].map(i=>line(100+i*70,272,100+i*70,288,{color:C.dim})).join('')
   +draw(Array.from({length:41},(_,i)=>{const u=i/40;return [120+380*u,250-110*Math.sin(u*2.4)*.9];}),seg(p,.05,.25),{color:CX,w:4})
   +T('\\sin x\\approx x-\\dfrac{x^3}{6}',310,330,{size:30}),seg(p,0,.15));
  const P=view({ox:790,oy:300,u:62});
  s+=card(640,70,500,290,
    label('3次元の矢印',890,120,{size:26,color:C.ink,anchor:'middle'})
   +axes3(P,{xl:2.6,yl:2.6,zl:2.4,names:false})
   +V3(P,[0,0,0],[2,1.2,1.4],{color:FC,w:6,head:18,g:seg(p,.3,.45)})+fade(seg(p,.35,.45),label('力',P(2,1.2,1.4)[0]+12,P(2,1.2,1.4)[1]+6,{size:26,color:FC,weight:700}))
   +V3(P,[0,0,0],[1.6,-.2,-.9],{color:CY,w:6,head:18,g:seg(p,.4,.55)})+fade(seg(p,.45,.55),label('速度',P(1.6,-.2,-.9)[0]+12,P(1.6,-.2,-.9)[1]+10,{size:26,color:CY,weight:700})),seg(p,.25,.35));
  s+=fade(seg(p,.6,.75),label('矢印の式は、何を主張している？',600,430,{size:38,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'recap']:(p)=>{
  const P=plane({ox:150,oy:200,u:66,x0:-1,x1:5,y0:-3,y1:2,skip:[3]});let s=P.svg;
  s+=label('初級：平面の矢印',880,60,{size:26,color:C.dim,anchor:'middle'});
  s+=arrow(P.X(0),P.Y(0),P.X(3),P.Y(0),{color:CX,w:6,head:18,g:seg(p,.2,.35)})+fade(seg(p,.25,.35),label('右へ 3',P.X(1.5),P.Y(0)-14,{size:24,color:CX,anchor:'middle',weight:700}));
  s+=arrow(P.X(3),P.Y(0),P.X(3),P.Y(-2),{color:CY,w:6,head:18,g:seg(p,.3,.45)})+fade(seg(p,.35,.45),label('下へ 2',P.X(3)+14,P.Y(-1)+8,{size:24,color:CY,weight:700}));
  s+=arrow(P.X(0),P.Y(0),P.X(3),P.Y(-2),{color:VA,w:7,head:20,g:seg(p,.05,.2)});
  s+=fade(seg(p,.1,.2),T(vA,P.X(1.2)-24,P.Y(-1.2)+30,{size:36}));
  s+=fade(seg(p,.1,.25),T(`${vA}=(3,\\,-2)`,880,150,{size:50}));
  s+=fade(seg(p,.6,.75),T(`|${vA}|=\\sqrt{3^2+(-2)^2}\\approx3.6`,880,290,{size:40}));
  s+=fade(seg(p,.7,.85),label('三平方',880,380,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'axes']:(p)=>{
  let s=axes3(PA,{xl:2.3,yl:4.3,zl:2.8,floor:seg(p,0,.2),g:[seg(p,.2,.35),seg(p,.4,.55),seg(p,.6,.75)]});
  s+=label('3次元：軸をもう1本',880,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.35),label('x：右向き',880,180,{size:32,color:CX,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),label('y：奥向き',880,250,{size:32,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('z：上向き',880,320,{size:32,color:CZ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),label('床の方眼 ＝ x と y の面',880,410,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'axes2']:(p)=>{
  let s=axesScene(p,{path:[seg(p,.3,.42),seg(p,.45,.57),seg(p,.6,.72)],gA:seg(p,.8,.95),labA:1});
  s+=T(`${vA}=(${cs(CX,'1')},\\,${cs(CY,'2')},\\,${cs(CZ,'2')})`,900,90,{size:46});
  s+=fade(seg(p,.3,.42),label('右へ 1',900,190,{size:30,color:CX,anchor:'middle',weight:700}));
  s+=fade(seg(p,.45,.57),label('奥へ 2',900,250,{size:30,color:CY,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.72),label('上へ 2',900,310,{size:30,color:CZ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.8,.95),label('3つの数の組 ＝ 矢印1本',900,400,{size:28,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=T(`${vF}=m${va}`,600,120,{size:84});
  s+=fade(seg(p,.1,.25),label('運動方程式も 矢印の式',600,220,{size:28,color:C.dim,anchor:'middle'}));
  s+=card(270,270,660,190,label('この1本は、',600,330,{size:32,color:C.ink,anchor:'middle'})
   +label('何本の式と 同じ内容？',600,395,{size:40,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,.7,.85),label('予想してみよう',600,442,{size:24,color:HI,anchor:'middle'})),seg(p,.3,.45),HI);
  return s;
 },

 // ===== S2 1本は3本 =====
 [K+'eq']:(p)=>{
  const colA=`\\begin{pmatrix}${cs(VA,'A_x')}\\\\${cs(VA,'A_y')}\\\\${cs(VA,'A_z')}\\end{pmatrix}`,colB=`\\begin{pmatrix}${cs(VB,'B_x')}\\\\${cs(VB,'B_y')}\\\\${cs(VB,'B_z')}\\end{pmatrix}`;
  let s=label('矢印が等しい とは？',600,50,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=T(`${vA}=${vB}`,300,150,{size:52});
  s+=fade(seg(p,.1,.25),T(`${colA}=${colB}`,300,330,{size:40}));
  s+=fade(seg(p,.25,.35),label('組の中身が それぞれ等しい',820,140,{size:28,color:HI,anchor:'middle',weight:700}));
  const rows=[['A_x=B_x',CX,'x'],['A_y=B_y',CY,'y'],['A_z=B_z',CZ,'z']];
  rows.forEach(([r,c,n],i)=>{const g=seg(p,.35+i*.12,.5+i*.12),y=230+i*80;
   s+=fade(g,label(n,660,y+10,{size:28,color:c,anchor:'middle',weight:700})+T(r,850,y,{size:42}));});
  s+=fade(seg(p,.8,.95),label('これが 矢印の等号の決め方（定義）',820,480,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ma']:(p)=>{
  let s=T(`m${va}`,600,70,{size:52});
  s+=fade(seg(p,.1,.3),T(`m\\,(${cs(AC,'a_x')},\\,${cs(AC,'a_y')},\\,${cs(AC,'a_z')})`,600,180,{size:48}));
  s+=fade(seg(p,.35,.55),T(`=(${cs(HI,'m')}${cs(AC,'a_x')},\\,${cs(HI,'m')}${cs(AC,'a_y')},\\,${cs(HI,'m')}${cs(AC,'a_z')})`,600,290,{size:48}));
  s+=card(230,360,740,110,label('質量 m ＝ 向きのない数',600,405,{size:30,color:C.ink,anchor:'middle',weight:700})
   +label('→ どの成分にも 同じ m が掛かる',600,450,{size:28,color:HI,anchor:'middle'}),seg(p,.6,.75));
  return s;
 },
 [K+'bundle']:(p)=>{
  let s=T(`${vF}=m${va}`,230,250,{size:64});
  s+=fade(seg(p,.1,.25),T('\\Longleftrightarrow',450,250,{size:52}));
  const rows=[[CX,'x'],[CY,'y'],[CZ,'z']];
  rows.forEach(([c,n],i)=>{const g=seg(p,.2+i*.12,.35+i*.12),y=130+i*110;
   s+=fade(g,label(`${n} 成分`,600,y+10,{size:28,color:c,weight:700})+T(`${cs(FC,`F_${n}`)}=m\\,${cs(AC,`a_${n}`)}`,850,y,{size:50}));});
  s+=fade(seg(p,.6,.75),brace(560,1120,450,{dir:-1,color:HI,text:'',g:1}));
  s+=fade(seg(p,.62,.78),label('3本の式を 1行に束ねたもの',840,500,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ball']:(p)=>{
  let s=line(80,470,1120,470,{color:C.faint,w:2});
  // side view axes x right, z up
  s+=arrow(90,440,200,440,{color:CX,w:3,head:12})+label('x',208,448,{size:24,color:CX})+arrow(90,440,90,330,{color:CZ,w:3,head:12})+label('z',82,318,{size:24,color:CZ,anchor:'middle'});
  s+=label('横から見た図（y は奥向き）',150,500,{size:22,color:C.dim});
  s+=ring(380,250,46,{color:C.ink,w:3,fill:'#1a2440'})+label('2 kg',380,260,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=arrow(430,250,630,250,{color:FC,w:7,head:22,g:seg(p,.35,.55)})+fade(seg(p,.45,.6),label('右向き 6 N',530,220,{size:30,color:FC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.1,.25),label('質量 m ＝ 2 kg',920,110,{size:30,color:C.ink,anchor:'middle'}));
  s+=fade(seg(p,.75,.9),label('＋ 重力',920,170,{size:30,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ball2']:(p)=>{
  let s=ytUmVectorComponents1Diagrams[K+'ball'](1);
  s+=arrow(380,300,380,450,{color:FC,w:7,head:22,g:seg(p,.05,.25)})+fade(seg(p,.15,.3),label('下向き 20 N',400,420,{size:28,color:FC,weight:700}));
  s+=fade(seg(p,.1,.3),T('2\\ \\mathrm{kg}\\times10\\ \\mathrm{m/s^2}=20\\ \\mathrm{N}',920,250,{size:34}));
  s+=fade(seg(p,.45,.6),label('z は 上向きが正',920,330,{size:28,color:CZ,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T(`${cs(FC,'F_z')}=-20\\ \\mathrm{N}`,920,410,{size:40}));
  return s;
 },
 [K+'rows']:(p)=>{
  let s=rowsBase();
  s+=fade(seg(p,.3,.45),label('成分ごとに ほどく',600,475,{size:26,color:C.dim,anchor:'middle'}));
  for(let i=0;i<3;i++)s+=rowEq(i,seg(p,.45+i*.12,.6+i*.12));
  return s;
 },
 [K+'rows2']:(p)=>{
  let s=rowsBase();
  s+=rowEq(0,1,seg(p,.2,.35))+rowEq(1,1,seg(p,.7,.85))+rowEq(2,1,0);
  s+=highlight(90,ROWY[0]-45,1020,80,seg(p,.02,.15)*(1-seg(p,.45,.55)));
  s+=highlight(90,ROWY[1]-45,1020,80,seg(p,.5,.6));
  return s;
 },
 [K+'rows3']:(p)=>{
  let s=rowsBase();
  s+=rowEq(0,1,1)+rowEq(1,1,1)+rowEq(2,1,seg(p,.2,.35));
  s+=highlight(90,ROWY[2]-45,1020,80,seg(p,.02,.15)*(1-seg(p,.4,.5)));
  s+=fade(seg(p,.55,.7),T(`${va}=(3,\\,0,\\,-10)\\ \\mathrm{m/s^2}`,600,470,{size:44})+highlight(330,428,540,76,seg(p,.75,.9)));
  return s;
 },
 [K+'path']:(p)=>{
  const tt=2*seg(p,.15,.85);
  let s=label(`t ＝ ${tt.toFixed(1)} s`,600,60,{size:32,color:C.ink,anchor:'middle',weight:700});
  s+=label('速度の増え方',600,110,{size:24,color:C.dim,anchor:'middle'});
  const W=38;// px per m/s
  // right-velocity bar
  s+=label('右向き',150,210,{size:28,color:CX,anchor:'end',weight:700});
  s+=rect(180,180,3*W*tt,44,{fill:CY,fo:.55,stroke:CY,rx:4});
  for(let k=1;k<=2;k++)s+=fade(tt>=k-.01?1:0,line(180+3*W*k,170,180+3*W*k,234,{color:C.ink,w:2}));
  s+=label(`＋${(3*tt).toFixed(1)} m/s`,200+3*W*tt,212,{size:28,color:CY});
  // down-velocity bar
  s+=label('下向き',150,330,{size:28,color:CZ,anchor:'end',weight:700});
  s+=rect(180,300,10*W*tt*.45,44,{fill:CY,fo:.55,stroke:CY,rx:4});
  for(let k=1;k<=2;k++)s+=fade(tt>=k-.01?1:0,line(180+10*W*.45*k,290,180+10*W*.45*k,354,{color:C.ink,w:2}));
  s+=label(`＋${(10*tt).toFixed(1)} m/s`,200+10*W*tt*.45,332,{size:28,color:CY});
  s+=fade(seg(p,.4,.55),label('1秒ごとに ＋3 m/s',400,430,{size:28,color:CX,anchor:'middle',weight:700})+label('1秒ごとに ＋10 m/s',850,430,{size:28,color:CZ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.4,.55),T(`${cs(AC,'a_x')}=3\\ \\mathrm{m/s^2}`,400,485,{size:30})+T(`${cs(AC,'a_z')}=-10\\ \\mathrm{m/s^2}`,850,485,{size:30}));
  return s;
 },
 [K+'path2']:(p)=>{
  let s=label('高校：水平と鉛直で 別々に立式',600,50,{size:30,color:C.ink,anchor:'middle',weight:700});
  const rows=[['x',CX,'6=2\\,a_x','水平'],['y',CY,'0=2\\,a_y',''],['z',CZ,'-20=2\\,a_z','鉛直']];
  rows.forEach(([n,c,e,h],i)=>{const y=135+i*90;
   s+=rect(250,y-40,700,76,{fill:c,fo:.08,stroke:c,sw:2,rx:10});
   s+=label(`${n} の行`,320,y+10,{size:28,color:c,anchor:'middle',weight:700})+T(e,600,y,{size:42});
   if(h)s+=fade(seg(p,.05,.25),label(h,1010,y+10,{size:28,color:c,weight:700}));});
  s+=fade(seg(p,.2,.35),label('束をほどく作業',600,430,{size:30,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),check(880,140)+check(880,230)+check(880,320));
  s+=fade(seg(p,.6,.75),label('どの行も その軸の成分だけ',600,480,{size:28,color:C.F,anchor:'middle'}));
  return s;
 },

 // ===== S3 3次元の長さ =====
 [K+'box']:(p)=>{
  let s=T(`${vA}=(1,\\,2,\\,2)`,600,90,{size:56});
  s+=fade(seg(p,.1,.25),label('長さは？',600,190,{size:36,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.35,.5),T('1+2+2=5',520,300,{size:48})+cross(700,296,20));
  s+=fade(seg(p,.4,.55),label('成分の和は 長さではない（初級）',600,390,{size:28,color:NG,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),label('では いくつ？',600,470,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'box2']:(p)=>{
  let s=boxScene({gBox:seg(p,.15,.4),gA:seg(p,.45,.65),gEdges:seg(p,.3,.45)});
  s+=label('直方体の 対角線',900,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),label('横 1',900,190,{size:30,color:CX,anchor:'middle',weight:700})+label('奥行き 2',900,250,{size:30,color:CY,anchor:'middle',weight:700})+label('高さ 2',900,310,{size:30,color:CZ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('角から角へ ＝ 𝐀',900,400,{size:30,color:VA,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shadow']:(p)=>{
  let s=boxScene({gLight:seg(p,.05,.2),gShadow:seg(p,.25,.45),gTri1:seg(p,.6,.75),dimA:mix(1,.35,seg(p,.05,.2))});
  s+=label('① 真上から光 → 床の影',900,90,{size:30,color:SH,anchor:'middle',weight:700});
  s+=fade(seg(p,.3,.45),label('影',800,192,{size:34,color:SH,anchor:'end',weight:700})+T(`=(${cs(CX,'1')},\\,${cs(CY,'2')},\\,0)`,815,180,{size:42,anchor:'start'}));
  s+=fade(seg(p,.6,.75),label('横 1 と 奥行き 2 の',900,290,{size:28,color:C.ink,anchor:'middle'})+label('直角三角形の 斜辺',900,340,{size:30,color:SH,anchor:'middle',weight:700}));
  return s;
 },
 [K+'shadow2']:(p)=>{
  let s=boxScene({gShadow:1,gTri1:1,dimA:.35});
  s+=label('① 影の長さ',900,90,{size:30,color:SH,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.25),label('（影の長さ）²',860,160,{size:30,color:SH,anchor:'middle'})+T(`=${cs(CX,'1')}^2+${cs(CY,'2')}^2=5`,900,225,{size:42}));
  s+=fade(seg(p,.5,.7),label('影の長さ',860,310,{size:30,color:SH,anchor:'middle'})+T('=\\sqrt{5}\\approx2.24',900,375,{size:42}));
  return s;
 },
 [K+'upright']:(p)=>{
  let s=boxScene({gShadow:1,gUp:seg(p,.45,.65),dimA:.35,gTri1:.4});
  const A=PA(1,2,0),B=PA(1,2,2);
  s+=line(A[0],A[1],B[0],B[1],{color:CZ,w:mix(5,9,seg(p,.1,.3))});
  s+=label('② 影と 高さ',900,90,{size:30,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),label('高さの辺は 床に垂直',900,190,{size:28,color:CZ,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.7),label('→ 影とも 直角',900,260,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'upright2']:(p)=>{
  let s=boxScene({gShadow:1,gUp:1,gTri2:seg(p,.1,.3),dimA:mix(.35,1,seg(p,.1,.3))});
  s+=label('② 2つ目の 直角三角形',900,90,{size:30,color:VA,anchor:'middle',weight:700});
  s+=fade(seg(p,.15,.35),label('辺：影 と 高さ',900,190,{size:28,color:C.ink,anchor:'middle'})+label('斜辺：𝐀',900,250,{size:30,color:VA,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('もう一度 三平方',900,340,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'upright3']:(p)=>{
  let s=boxScene({gShadow:1,gUp:1,gTri2:1});
  s+=label('② 全体の長さ',900,90,{size:30,color:VA,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.3),T(`|${vA}|^2=${cs(SH,'5')}+${cs(CZ,'2')}^2=9`,900,190,{size:42}));
  s+=fade(seg(p,.5,.7),T(`|${vA}|=\\sqrt{9}=3`,900,300,{size:46}));
  s+=fade(seg(p,.7,.85),highlight(740,250,320,90,1));
  return s;
 },
 [K+'formula']:(p)=>{
  const src=`|${vA}|=\\sqrt{${cs(CX,'A_x')}^2+${cs(CY,'A_y')}^2+${cs(CZ,'A_z')}^2}`;
  let s=T(src,600,170,{size:72});
  const W=texWidth(src,72,false),L=600-W/2,wl=texWidth(`|${vA}|=\\sqrt{}`,72,false)-10,w1=texWidth(`${cs(CX,'A_x')}^2+${cs(CY,'A_y')}^2`,72,false),w2=texWidth(`+${cs(CZ,'A_z')}^2`,72,false);
  const x1=L+wl+6;
  s+=fade(seg(p,.2,.4),brace(x1,x1+w1,240,{color:SH,text:'影の長さの2乗',size:26}));
  s+=fade(seg(p,.45,.6),brace(x1+w1+4,x1+w1+w2,240,{color:CZ,text:'高さの2乗',size:26}));
  s+=fade(seg(p,.7,.85),label('2乗して足し、最後に 平方根',600,420,{size:32,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'practice']:(p)=>card(250,110,700,280,label('練習',600,165,{size:26,color:C.dim,anchor:'middle'})
   +T('(2,\\,3,\\,6)',600,250,{size:60})+label('長さは？',600,345,{size:36,color:HI,anchor:'middle',weight:700}),seg(p,.05,.2),HI),
 [K+'practice2']:(p)=>{
  let s=T('(2,\\,3,\\,6)',600,60,{size:44});
  s+=fade(seg(p,.02,.25),T('\\sqrt{2^2+3^2+6^2}',600,170,{size:52}));
  s+=fade(seg(p,.25,.45),T('=\\sqrt{4+9+36}',600,280,{size:52}));
  {const w=texWidth('=\\sqrt{49}=7',56,false);s+=fade(seg(p,.5,.65),T('=\\sqrt{49}=7',600,390,{size:56})+highlight(600-w/2-24,336,w+48,96,seg(p,.75,.9)));}
  return s;
 },

 // ===== S4 向きだけを取り出す =====
 [K+'unit']:(p)=>{
  const P=view({ox:300,oy:400,u:120});
  let s=axes3(P,{xl:2.4,yl:2.6,zl:2.4,floor:.8});
  s+=V3(P,[0,0,0],[1,0,0],{color:HI,w:8,head:20,g:seg(p,.3,.5)});
  const E=P(1,0,0);s+=fade(seg(p,.4,.55),T(cs(HI,'\\hat{x}'),E[0]-60,E[1]+44,{size:40})+label('長さ 1',E[0]-60,E[1]+92,{size:24,color:HI,anchor:'middle'}));
  s+=card(680,110,460,280,label('単位ベクトル',910,170,{size:34,color:HI,anchor:'middle',weight:700})
   +label('＝ 長さ 1 の矢印',910,230,{size:30,color:C.ink,anchor:'middle'})
   +fade(seg(p,.55,.7),label('向きだけを 表す',910,290,{size:28,color:C.dim,anchor:'middle'})+label('x̂：x の向き',910,350,{size:28,color:CX,anchor:'middle',weight:700})),seg(p,.1,.25));
  return s;
 },
 [K+'divide']:(p)=>{
  let s=bScene({gB:seg(p,.05,.25)});
  s+=fade(seg(p,.05,.2),T(`${vB}=(0,\\,${cs(CY,'3')},\\,${cs(CZ,'4')})`,860,90,{size:46}));
  s+=fade(seg(p,.35,.55),T(`|${vB}|=\\sqrt{0+9+16}`,860,200,{size:42}));
  s+=fade(seg(p,.6,.75),T('=\\sqrt{25}=5',860,300,{size:46}));
  return s;
 },
 [K+'divide2']:(p)=>{
  let s=bScene({shrink:seg(p,.3,.65),dimB:mix(1,.45,seg(p,.3,.5))});
  s+=T(`|${vB}|=5`,860,70,{size:40});
  s+=fade(seg(p,.05,.25),T('(0,\\,3,\\,4)\\div5',860,170,{size:44}));
  s+=fade(seg(p,.25,.45),T(`=(0,\\,${cs(HI,'0.6')},\\,${cs(HI,'0.8')})`,860,260,{size:44}));
  s+=fade(seg(p,.6,.75),label('向きは そのまま',860,360,{size:30,color:C.ink,anchor:'middle',weight:700})+label('長さだけ 1/5 に',860,420,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'divide3']:(p)=>{
  let s=bScene({shrink:1,dimB:.45});
  s+=T(`(0,\\,${cs(HI,'0.6')},\\,${cs(HI,'0.8')})`,860,70,{size:40});
  s+=fade(seg(p,.05,.3),T('0.6^2=0.36',860,170,{size:42}));
  s+=fade(seg(p,.25,.45),T('0.8^2=0.64',860,250,{size:42}));
  s+=fade(seg(p,.5,.7),T('0.36+0.64=1',860,340,{size:44}));
  s+=fade(seg(p,.7,.85),label('長さ ちょうど 1',860,430,{size:30,color:C.F,anchor:'middle',weight:700})+check(1000,420));
  return s;
 },
 [K+'bhat']:(p)=>{
  let s=bScene({shrink:1,gHat:seg(p,.05,.2),dimB:mix(.45,.3,seg(p,.4,.5)),gCopies:seg(p,.5,.95)});
  s+=T(`${hB}=\\dfrac{${vB}}{|${vB}|}=(0,\\,0.6,\\,0.8)`,860,100,{size:40});
  s+=fade(seg(p,.1,.25),label('B の単位ベクトル（Bハット）',860,200,{size:26,color:VB,anchor:'middle'}));
  s+=fade(seg(p,.45,.6),T(`${vB}=5\\,${hB}`,860,300,{size:52}));
  s+=fade(seg(p,.6,.75),label('長さ × 向き',860,390,{size:30,color:HI,anchor:'middle',weight:700}));
  return s;
 },
 [K+'push']:(p)=>{
  let s=bScene({shrink:1,dimB:.3,gF:seg(p,.35,.6)});
  s+=label('長さ と 向き を分ける',860,60,{size:28,color:C.dim,anchor:'middle'});
  s+=fade(seg(p,.2,.35),T(`${cs(FC,'\\mathbf{F}')}=${cs(FC,'10')}\\ \\mathrm{N}\\times${hB}`,860,150,{size:44}));
  s+=fade(seg(p,.35,.55),label('大きさ',745,210,{size:24,color:FC,anchor:'middle'})+label('向き',985,210,{size:24,color:VB,anchor:'middle'}));
  s+=fade(seg(p,.6,.75),T('=(0,\\,6,\\,8)\\ \\mathrm{N}',860,290,{size:46}));
  s+=fade(seg(p,.8,.95),T('\\sqrt{36+64}=10',860,390,{size:36})+check(1040,382,14));
  return s;
 },
 [K+'zero']:(p)=>{
  let s=T(`\\mathbf{0}=(0,\\,0,\\,0)`,600,80,{size:56});
  s+=fade(seg(p,.1,.25),label('零ベクトル：全部の成分が 0',600,160,{size:28,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.3,.45),T(`|\\mathbf{0}|=0`,600,250,{size:48}));
  s+=fade(seg(p,.55,.7),T(`\\dfrac{(0,\\,0,\\,0)}{0}`,520,380,{size:50})+label('？',680,392,{size:52,color:NG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.75,.9),label('0 で 割ることになる',860,392,{size:30,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 [K+'zero2']:(p)=>{
  let s=dot(380,260,12,C.ink)+label('長さ 0 の矢印 ＝ 点',380,480,{size:28,color:C.ink,anchor:'middle'});
  const angs=[0,50,110,160,210,270,320];
  angs.forEach((a,i)=>{const r=Math.PI*a/180;s+=fade(seg(p,.1+i*.04,.25+i*.04)*.6,arrow(380+26*Math.cos(r),260-26*Math.sin(r),380+110*Math.cos(r),260-110*Math.sin(r),{color:C.dim,w:3,head:12})+label('？',380+140*Math.cos(r),260-140*Math.sin(r)+10,{size:26,color:NG,anchor:'middle'}));});
  s+=fade(seg(p,.35,.5),label('どちらも 向いていない',860,180,{size:32,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),card(640,240,460,140,label('取り出す向きがない',870,295,{size:30,color:NG,anchor:'middle',weight:700})
   +label('→ 単位ベクトルは 作れない',870,350,{size:28,color:C.ink,anchor:'middle'}),1,NG));
  return s;
 },

 // ===== S5 位置と移動 =====
 [K+'pos']:(p)=>{
  let {s}=posScene({gr1:seg(p,.45,.6),gr2:0});
  s+=fade(seg(p,.1,.3),label('位置ベクトル 𝐫',930,110,{size:32,color:RC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.2,.4),label('原点 O → 物体',930,170,{size:28,color:C.ink,anchor:'middle'}));
  return s;
 },
 [K+'pos2']:(p)=>{
  let {s}=posScene({gr2:seg(p,.05,.25),gD:seg(p,.6,.8)});
  s+=T(`${cs(RC,'\\mathbf{r}_1')}=(3,\\,1,\\,0)\\ \\mathrm{m}`,930,110,{size:36});
  s+=fade(seg(p,.05,.2),T(`${cs(RC,'\\mathbf{r}_2')}=(6,\\,5,\\,0)\\ \\mathrm{m}`,930,180,{size:36}));
  s+=fade(seg(p,.55,.7),label('移動ベクトル ＝ あと − まえ',930,270,{size:28,color:DR,anchor:'middle',weight:700}));
  s+=fade(seg(p,.65,.8),T(`${cs(DR,'\\Delta\\mathbf{r}')}=${cs(RC,'\\mathbf{r}_2')}-${cs(RC,'\\mathbf{r}_1')}`,930,340,{size:40}));
  return s;
 },
 [K+'pos3']:(p)=>{
  let {s}=posScene({gD:1,comps:seg(p,.3,.5)});
  s+=T(`${cs(DR,'\\Delta\\mathbf{r}')}=(6-3,\\,5-1,\\,0-0)`,930,100,{size:34});
  s+=fade(seg(p,.05,.2),T(`=(${cs(CX,'3')},\\,${cs(CY,'4')},\\,0)\\ \\mathrm{m}`,930,180,{size:40}));
  s+=fade(seg(p,.4,.6),T(`|${cs(DR,'\\Delta\\mathbf{r}')}|=\\sqrt{9+16}`,930,280,{size:38}));
  s+=fade(seg(p,.6,.75),T('=\\sqrt{25}=5\\ \\mathrm{m}',930,370,{size:40}));
  return s;
 },
 [K+'shift']:(p)=>{
  const sh=seg(p,.05,.3);
  let {s}=posScene({gD:1,shift:sh,gr1:1});
  s+=fade(seg(p,.1,.3),label('原点を (3, 1, 0) へ',930,70,{size:28,color:HI,anchor:'middle',weight:700}));
  s+=fade(seg(p,.3,.45),T(`${cs(RC,'\\mathbf{r}_1')}=(0,\\,0,\\,0)`,930,150,{size:34}));
  s+=fade(seg(p,.35,.5),T(`${cs(RC,'\\mathbf{r}_2')}=(3,\\,4,\\,0)`,930,215,{size:34}));
  s+=fade(seg(p,.35,.5),label('位置は 変わる',930,275,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.65,.8),T(`${cs(DR,'\\Delta\\mathbf{r}')}=(3,\\,4,\\,0)\\ \\mathrm{m}`,930,360,{size:38})+label('差は そのまま',930,430,{size:28,color:C.F,anchor:'middle',weight:700})+check(1060,420,14));
  return s;
 },
 [K+'shift2']:(p)=>{
  let s=card(80,90,480,300,label('位置 𝐫',320,150,{size:34,color:RC,anchor:'middle',weight:700})
   +label('原点の決め方で',320,230,{size:28,color:C.ink,anchor:'middle'})+label('変わる 矢印',320,280,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.02,.2));
  s+=card(640,90,480,300,label('移動 Δ𝐫',880,150,{size:34,color:DR,anchor:'middle',weight:700})
   +label('2つの点の 差だけで',880,230,{size:28,color:C.ink,anchor:'middle'})+label('決まる 矢印',880,280,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.65),DR);
  return s;
 },
 [K+'summary']:(p)=>{
  let s=label('まとめ',600,50,{size:28,color:C.dim,anchor:'middle'});
  const rows=[
   [`${vF}=m${va}`,'ベクトルの式1本 ＝ 成分の式3本'],
   [`|${vA}|=\\sqrt{A_x^2+A_y^2+A_z^2}`,'長さ ＝ 三平方を2回'],
   [`${hB}=\\dfrac{${vB}}{|${vB}|}`,'単位ベクトル ＝ 全成分 ÷ 長さ（𝟎 は割れない）']];
  rows.forEach(([f,t],i)=>{const g=seg(p,.05+i*.25,.2+i*.25),y=140+i*125;
   s+=fade(g,rect(60,y-50,1080,104,{fill:'#131f38',fo:.9,stroke:C.faint,rx:12})+T(f,290,y,{size:i===2?34:38})+label(t,530,y+10,{size:27,color:C.ink}));});
  return s;
 },
 [K+'next']:(p)=>{
  const O=[200,400];
  let s=label('初級：内積と仕事',70,50,{size:26,color:C.dim});
  s+=arrow(O[0],O[1],O[0]+380,O[1],{color:DR,w:7,head:20,g:seg(p,.05,.2)})+fade(seg(p,.1,.2),T(cs(DR,'\\Delta\\mathbf{r}'),O[0]+300,O[1]+46,{size:34}));
  s+=arrow(O[0],O[1],O[0]+230,O[1]-190,{color:FC,w:7,head:20,g:seg(p,.1,.25)})+fade(seg(p,.15,.25),T(cs(FC,'\\mathbf{F}'),O[0]+250,O[1]-200,{size:34}));
  const pts=Array.from({length:21},(_,i)=>{const a=-Math.atan2(190,230)*i/20;return [O[0]+70*Math.cos(a),O[1]+70*Math.sin(a)];});
  s+=fade(seg(p,.2,.3),draw(pts,1,{color:C.ink,w:3})+T('\\theta',O[0]+100,O[1]-26,{size:30}));
  s+=fade(seg(p,.3,.5),T(`${cs(FC,'\\mathbf{F}')}\\cdot${cs(DR,'\\Delta\\mathbf{r}')}=F\\,\\Delta r\\cos\\theta`,880,170,{size:42}));
  s+=fade(seg(p,.6,.8),label('＝ 仕事 W',880,270,{size:34,color:C.E,anchor:'middle',weight:700}));
  return s;
 },
 [K+'next2']:(p)=>{
  let s=T(`${cs(FC,'\\mathbf{F}')}=(F_x,\\,F_y,\\,F_z),\\quad ${cs(DR,'\\Delta\\mathbf{r}')}=(\\Delta x,\\,\\Delta y,\\,\\Delta z)`,600,70,{size:38});
  s+=card(200,140,800,300,label('次の問い',600,190,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(FC,'\\mathbf{F}')}\\cdot${cs(DR,'\\Delta\\mathbf{r}')}=\\ ?`,600,280,{size:60})
   +label('角度を測らずに、成分だけで 計算できる？',600,390,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,.1,.25),HI);
  return s;
 },
};
