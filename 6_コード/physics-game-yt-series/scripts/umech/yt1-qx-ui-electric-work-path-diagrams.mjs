// 問題編 解説「4区間の道で +2 C を運ぶ」（q-ui-electric-work-path、大学編 20 線積分と面積分・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/20_線積分と面積分.md の q-ui-electric-work-path（解説 21 行）。
// 色：電場 𝐄 水色、沿う部分（影）黄、直角な部分 桃、仕事 橙、負 赤、正電荷 赤い丸。区間の矢印 Δ𝐫₁〜Δ𝐫₄ は 青・紫・銀・薔薇（単元動画と同じ）。
// 札（求めるもの・答え・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 図のために決めた値：区間の向き 0°・35°・80°・20°、電場の向き（道から）53.13° 左・60° 左・90° 右・180°。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,wrongSeq,cueT,sentWin,note,textW} from './yt1-qx-common.mjs';

const K='qx-ui-electric-work-path:';
const EC=C.x,AL=C.hi,PP=C.p,WC=C.E,NG='#ff6b6b',QR='#ff6b6b';
const SCOL=['#6f9dff','#c49bff','#b8c4d8','#f06a8a'];
const rad=d=>d*Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
const G1='区間1の仕事 ΔW₁',G2='道全体の仕事 W',G3='区間4の扱いと理由';
const ANS1=g=>answerTag(1,'C','24 J',{g}),ANS2=g=>answerTag(2,'A','24 J',{g}),ANS3=g=>answerTag(3,'D','',{g});
const WOPT={x:690,w:490,size:26,whySize:22};

// ---- 道（区間の向き deg・長さ m・電場の強さ mag と向き edir）----
const SEGS=[
 {deg:0, m:2,mag:10,edir:53.13,par:6, perp:8},
 {deg:35,m:3,mag:4, edir:95,   par:2, perp:3.46},
 {deg:80,m:1,mag:5, edir:-10,  par:0, perp:5},
 {deg:20,m:2,mag:3, edir:200,  par:-3,perp:0},
];
const VERT=(()=>{const v=[[0,0]];for(const s of SEGS){const [x,y]=v[v.length-1];v.push([x+s.m*Math.cos(rad(s.deg)),y+s.m*Math.sin(rad(s.deg))]);}return v;})();
function curveAt(t){
 const n=VERT.length-1,tt=clamp(t,0,n),i=Math.min(Math.floor(tt),n-1),f=tt-i;
 const P=k=>VERT[clamp(k,0,n)];const p0=P(i-1),p1=P(i),p2=P(i+1),p3=P(i+2);
 // 張りの強いカーディナル曲線（区切りの点を通り、はみ出しが小さい）
 const k=.3,f2=f*f,f3=f2*f,h=(a,b,c,d)=>(2*f3-3*f2+1)*b+(f3-2*f2+f)*k*(c-a)+(-2*f3+3*f2)*c+(f3-f2)*k*(d-b);
 return [h(p0[0],p1[0],p2[0],p3[0]),h(p0[1],p1[1],p2[1],p3[1])];
}
const view=(ox,oy,sc)=>([u,v])=>[ox+sc*u,oy-sc*v];
const curveSvg=(V,{p=1,color=C.ink,w=4,opacity=1}={})=>draw(Array.from({length:161},(_,i)=>V(curveAt(4*i/160))),p,{color,w,opacity});
function charge(x,y,{g=1,text='+2 C',r=14,tdy=0}={}){
 return fade(g,ring(x,y,r,{color:QR,w:3,fill:'#3a1d2a'})+label('+',x,y+r*.45,{size:r*1.5,color:QR,anchor:'middle',weight:700})
  +(text?label(text,x,y-r-12+tdy,{size:24,color:QR,anchor:'middle',weight:700}):''));
}
const vdr=i=>`\\Delta\\mathbf{r}_${i}`;
// 全体の図：曲線・折れ線（区間の矢印）・電場の矢印・区間1の成分・区間2の角・区間3の直角の印
function overview({ox,oy,sc,Esc=13,curve=1,curveOp=1,chords=0,E=0,lab=0,len=0,comps=0,marks=0,hl=-1,dim=0,glow=[0,0,0,0],q=0,qText='+2 C'}={}){
 const V=view(ox,oy,sc);
 let s=curveSvg(V,{p:curve,color:C.ink,w:3,opacity:curveOp*(1-.8*chords)});
 SEGS.forEach((g,i)=>{
  const a=V(VERT[i]),b=V(VERT[i+1]),mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
  const op=hl>=0&&i!==hl?1-.7*dim:1;
  const ux=Math.cos(rad(g.deg)),uy=-Math.sin(rad(g.deg)),side=i===2?-1:1,nx=-uy*side,ny=ux*side;
  if(glow[i]>0)s+=fade(chords*glow[i]*op,line(a[0],a[1],b[0],b[1],{color:SCOL[i],w:16,opacity:.35}));
  s+=fade(chords*op,arrow(a[0],a[1],b[0],b[1],{color:SCOL[i],w:5,head:16}));
  if(i===2){s+=fade(lab*chords*op,T(vdr(i+1),mx+nx*22,my+ny*22-4,26,{color:SCOL[i],anchor:'end'}));
   s+=fade(len*chords*op,label(`${g.m} m`,mx+nx*22,my+ny*22+30,{size:24,color:SCOL[i],anchor:'end',weight:700}));}
  else if(i===3){s+=fade(lab*chords*op,T(vdr(i+1),mx+nx*34,my+ny*34+10,26,{color:SCOL[i]}));
   s+=fade(len*chords*op,label(`${g.m} m`,mx+nx*34+ux*62,my+ny*34+uy*62+18,{size:24,color:SCOL[i],anchor:'middle',weight:700}));}
  else{s+=fade(lab*chords*op,T(vdr(i+1),mx+nx*34,my+ny*34+10,26,{color:SCOL[i]}));
   s+=fade(len*chords*op,label(`${g.m} m`,mx+nx*76,my+ny*76+9,{size:24,color:SCOL[i],anchor:'middle',weight:700}));}
  const ex=Math.cos(rad(g.edir))*g.mag*Esc,ey=-Math.sin(rad(g.edir))*g.mag*Esc,ex1=Math.cos(rad(g.edir)),ey1=-Math.sin(rad(g.edir));
  if(i===1&&marks>0){const r=34,pts=Array.from({length:21},(_,k)=>{const d=rad(mix(g.deg,g.edir,k/20));return [mx+r*Math.cos(d),my-r*Math.sin(d)];});
   s+=fade(marks*op,line(mx,my,mx+70*ux,my+70*uy,{color:C.dim,w:2,dash:'5 5'})+draw(pts,1,{color:C.ink,w:3})+label('60°',mx+(r+30)*Math.cos(rad(65)),my-(r+30)*Math.sin(rad(65))+8,{size:24,color:C.ink,anchor:'middle',weight:700}));}
  if(i===2&&marks>0){const q=14;s+=fade(marks*op,draw([[mx+q*ux,my+q*uy],[mx+q*ux+q*ex1,my+q*uy+q*ey1],[mx+q*ex1,my+q*ey1]],1,{color:C.ink,w:3}));}
  if(i===0&&comps>0){
   const fx=mx+g.par*Esc*ux,fy=my+g.par*Esc*uy;
   s+=fade(comps*op,arrow(mx,my,fx,fy,{color:AL,w:4,head:12})+arrow(fx,fy,mx+ex,my+ey,{color:PP,w:4,head:12})
    +label('6',(mx+fx)/2,my+26,{size:24,color:AL,anchor:'middle',weight:700})+label('8',fx+14,(fy+my+ey)/2+8,{size:24,color:PP,weight:700}));
  }
  const oy4=i===3?-12:0,ox4=i===3?-12*Math.sin(rad(g.deg)):0;
  s+=fade(E*op,dot(mx+ox4,my+oy4,4,EC)+arrow(mx+ox4,my+oy4,mx+ox4+ex,my+oy4+ey,{color:EC,w:4,head:13}));
  const lx=mx+ex+ex1*14,ly=my+ey+ey1*14;
  const L=i===0?[lx-50,ly-8,'middle']:i===1?[lx-14,ly-8,'end']:i===2?[lx+8,ly+8,'start']:[mx+ex+10,my+ey-46,'middle'];
  s+=fade(E*op,label(`${g.mag} N/C`,L[0],L[1],{size:24,color:EC,anchor:L[2],weight:700}));
 });
 if(q>0){const [x,y]=V(VERT[0]);s+=charge(x,y,{g:q,text:qText,tdy:-2});}
 return s;
}
// 1区間の拡大：点線の道、区間の矢印 Δ𝐫（道の右側にずらす）、根元からの電場、光（道に直角）と影、直角な部分、三角形
function zoom(i,{tx,ty,lpx=150,Esc=22,gE=1,gDr=1,gLight=0,gAlong=0,gPerp=0,gTri=0,gArc=0,gRight=0,labA='',labP='',labE=1,labDr=1,a0=.25,gQ=0,blinkE=0,blinkP=0,flashPt=0}={}){
 const g=SEGS[i],ux=Math.cos(rad(g.deg)),uy=-Math.sin(rad(g.deg)),side=i===2?-1:1,nx=-uy*side,ny=ux*side;
 const ex=Math.cos(rad(g.edir))*g.mag*Esc,ey=-Math.sin(rad(g.edir))*g.mag*Esc;
 const fx=tx+g.par*Esc*ux,fy=ty+g.par*Esc*uy;
 const L=g.m*lpx,sx=tx-a0*L*ux,sy=ty-a0*L*uy,X=sx+L*ux,Y=sy+L*uy;
 let s=line(sx-60*ux,sy-60*uy,X+60*ux,Y+60*uy,{color:C.faint,w:3,dash:'10 8'});
 const off=46;
 s+=fade(gDr,arrow(sx+off*nx,sy+off*ny,X+off*nx,Y+off*ny,{color:SCOL[i],w:5,head:16})
  +(labDr?T(vdr(i+1),sx+off*nx+L*.3*ux+36*nx,sy+off*ny+L*.3*uy+36*ny+10,28,{color:SCOL[i]})
   +label(`${g.m} m`,sx+off*nx+L*.62*ux+38*nx,sy+off*ny+L*.62*uy+38*ny+9,{size:26,color:SCOL[i],anchor:'middle',weight:700}):''));
 if(gTri>0&&g.perp>0&&Math.abs(g.par)>0)s+=fade(gTri,poly([[tx,ty],[fx,fy],[tx+ex,ty+ey]],{fill:C.hi,fo:.13,stroke:C.hi,sw:1.5}));
 if(gLight>0){
  // 道に直角に当てる光（電場の先がある側から）。白い細線
  const sgn=Math.sign(ex*nx+ey*ny)||-1,D=Math.max(Math.abs(g.perp)*Esc,30)+50;
  let l='';for(let k=-1;k<=2;k++){const bx=tx+(g.par*Esc*.5+(k-.5)*34)*ux,by=ty+(g.par*Esc*.5+(k-.5)*34)*uy;
   l+=arrow(bx+sgn*(D+40)*nx,by+sgn*(D+40)*ny,bx+sgn*8*nx,by+sgn*8*ny,{color:'#dfe8ff',w:2,head:9,opacity:.45});}
  if(g.perp>0&&Math.abs(g.par)>0)l+=line(tx+ex,ty+ey,fx,fy,{color:C.hi,w:2.5,dash:'6 6',opacity:.9});
  s+=fade(gLight,l);
 }
 if(gArc>0){const r=44,pts=Array.from({length:25},(_,k)=>{const d=rad(mix(g.deg,g.edir,k/24));return [tx+r*Math.cos(d),ty-r*Math.sin(d)];});const dm=rad((g.deg+g.edir)/2);
  s+=fade(gArc,draw(pts,1,{color:C.ink,w:3})+label(`${Math.round(g.edir-g.deg)}°`,tx+(r+30)*Math.cos(dm),ty-(r+30)*Math.sin(dm)+8,{size:26,color:C.ink,anchor:'middle',weight:700}));}
 if(gRight>0){const q=18,e1x=ex/Math.hypot(ex,ey),e1y=ey/Math.hypot(ex,ey);
  s+=fade(gRight,draw([[tx+q*ux,ty+q*uy],[tx+q*ux+q*e1x,ty+q*uy+q*e1y],[tx+q*e1x,ty+q*e1y]],1,{color:C.ink,w:3}));}
 // 電場
 const eb=blinkE>0?1:0;
 if(eb)s+=fade(blinkE,line(tx,ty,tx+ex,ty+ey,{color:NG,w:16,opacity:.5}));
 s+=fade(gE,arrow(tx,ty,tx+ex,ty+ey,{color:EC,w:6,head:20}));
 if(labE){
  const [lx,ly,an]=i===0?[tx+ex+16,ty+ey+10,'start']:i===1?[tx+ex-16,ty+ey+10,'end']:i===2?[tx+ex+14,ty+ey+10,'start']:[tx+ex-14,ty+ey+10,'end'];
  s+=fade(gE,elab(`${g.mag} N/C`,lx,ly,an));}
 // 沿う部分（影）
 if(Math.abs(g.par)>0){const col=g.par>0?AL:NG;
  s+=fade(gAlong,line(tx,ty,fx,fy,{color:col,w:14,cap:'butt',opacity:.45})+arrow(tx,ty,fx,fy,{color:col,w:6,head:18}));
  if(labA){const [lx,ly,an]=i===1?[fx+20*ux+4,fy+20*uy+2,'start']:[(tx+fx)/2-nx*28,(ty+fy)/2-ny*28+9,'middle'];
   s+=fade(gAlong,label(labA,lx,ly,{size:26,color:col,anchor:an,weight:700}));}}
 else{s+=fade(gAlong,dot(tx,ty,8,AL)+ring(tx,ty,14+6*flashPt,{color:AL,w:3+3*flashPt}));
  if(labA)s+=fade(gAlong,label(labA,tx+24,ty+78,{size:26,color:AL,anchor:'start',weight:700}));}
 if(g.perp>0&&Math.abs(g.par)>0){
  if(blinkP>0)s+=fade(blinkP,line(fx,fy,tx+ex,ty+ey,{color:NG,w:16,opacity:.5}));
  s+=fade(gPerp,arrow(fx,fy,tx+ex,ty+ey,{color:PP,w:5,head:16}));
  if(labP)s+=fade(gPerp,label(labP,(fx+tx+ex)/2+16,(fy+ty+ey)/2+8,{size:26,color:PP,weight:700}));}
 if(gQ>0)s+=charge(sx,sy,{g:gQ,text:''});
 return s;
}
// 「𝐄 10 N/C」を1行で（x,y は文字の基線、anchor は全体の揃え）
function elab(txt,x,y,an='start',size=26){
 const we=texWidth('\\mathbf{E}',32,false)+8,wt=textW(txt,size)*.92,W=we+wt,x0=an==='start'?x:an==='end'?x-W:x-W/2;
 return T(cs(EC,'\\mathbf{E}'),x0+we/2-4,y-9,32)+label(txt,x0+we,y,{size,color:EC,weight:700});
}
// 拡大の位置
const Z1={tx:250,ty:380,lpx:150,Esc:20};
const Z2={tx:250,ty:335,lpx:100,Esc:55,a0:.25};
const Z3={tx:300,ty:270,lpx:200,Esc:30,a0:.45};
const Z4={tx:330,ty:290,lpx:130,Esc:40,a0:.3};
// 棒グラフ：区間ごとの仕事。stack＝0 なら0の線から、1 なら左から積み上げ（区間4は下がる）
const DW=[24,12,0,-12];
function bars({x0,y0,u=6,cw=100,shown=[1,1,1,1],stack=0,g=1,frame=1,hl=-1,flipB=0,hideC=0,addD=0,title=1,ty=110}={}){
 let s='';const W=cw*4+40;
 s+=fade(frame,line(x0-10,y0,x0+W,y0,{color:C.dim,w:2.5})+label('0',x0-20,y0+8,{size:24,color:C.dim,anchor:'end'}));
 if(title)s+=fade(frame,label(stack>.5?'左から 積み上げ [J]':'区間ごとの 仕事 ΔW [J]',x0+W/2,ty,{size:24,color:C.dim,anchor:'middle'}));
 let acc=0;
 DW.forEach((w,i)=>{
  const cx=x0+30+i*cw+cw/2-10,bw=cw*.56;
  const base=stack*acc,top=base+w;acc+=w;
  s+=fade(frame,label(`区間${i+1}`,cx,y0+u*12+36,{size:24,color:SCOL[i],anchor:'middle',weight:700}));
  if(shown[i]<=0)return;
  const col=w<0?NG:SCOL[i],h=w*shown[i];
  const yA=y0-u*base,yB=y0-u*(base+h);
  const op=hl>=0&&i!==hl?.35:1;
  if(i===3&&(flipB>0||hideC>0))s+=fade((flipB+hideC)*.9,rect(cx-bw/2,y0-u*base,bw,u*12,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:3}));
  const vis=1-Math.max(i===3?flipB:0,i===3?hideC:0);
  if(Math.abs(h)<.2)s+=fade(g*op*vis,line(cx-bw/2,yA,cx+bw/2,yA,{color:col,w:5}));
  else s+=fade(g*op*vis,rect(cx-bw/2,Math.min(yA,yB),bw,Math.abs(yB-yA),{fill:col,fo:.55,stroke:col,sw:2.5,rx:3}));
  if(shown[i]>=1)s+=fade(g*op*vis,w<0?label(`−${-w}`,cx+bw/2+8,(yA+yB)/2+9,{size:26,color:NG,weight:700}):label(`${w}`,cx,Math.min(yA,yB)-12,{size:26,color:WC,anchor:'middle',weight:700}));
  if(i===3&&flipB>0){const yF=y0-u*(base+12);s+=fade(flipB,rect(cx-bw/2,yF,bw,u*12,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:3})+line(cx-bw/2,yF,cx+bw/2,yF+u*12,{color:'none'})
    +label('+12',cx,yF-12,{size:26,color:C.dim,anchor:'middle',weight:700}));}
  if(i===3&&hideC>0)s+=fade(hideC,label('足さない',cx,y0-u*base-14,{size:24,color:C.dim,anchor:'middle',weight:700}));
  if(i===2&&addD>0){s+=fade(addD,rect(cx-bw/2,yA-u*10,bw,u*10,{fill:'none',fo:0,stroke:C.dim,sw:2.5,rx:3})+label('+10',cx,yA-u*10-12,{size:26,color:C.dim,anchor:'middle',weight:700}));}
  if(stack>0&&i<3)s+=fade(stack*g,line(cx+bw/2,y0-u*(base+w),cx+cw-bw/2,y0-u*(base+w),{color:C.dim,w:2,dash:'5 5'}));
 });
 return s;
}
const BR={x0:720,y0:350,u:7,cw:100};  // 右側（小問2の前半）
const BL={x0:90,y0:400,u:6,cw:120};   // 左側（小問2の後半・小問3）
// 右の説明の枠
const PX=690,PW=490,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const OV={ox:40,oy:418,sc:104,Esc:14};

export const ytQxUiElectricWorkPathDiagrams={
 // ===================== 問題アニメ =====================
 // 0〜2 s 曲がった道と +2 C、2〜4 s 4本の矢印と長さ、4〜7 s 電場の矢印・成分 6 と 8・60° の弧・直角の印。静止。
 [K+'q1']:(p)=>{
  const o={ox:230,oy:420,sc:112,Esc:15};
  return overview({...o,curve:seg(p,0,.27),chords:seg(p,.3,.55),lab:seg(p,.4,.57),len:seg(p,.45,.6),E:seg(p,.6,.78),comps:seg(p,.72,.88),marks:seg(p,.8,.97),q:seg(p,.1,.25)});
 },

 // ===================== 小問1 =====================
 // 1. 出題図を左に再表示。「区間ごとに」で4本の矢印を1本ずつ光らせる。右に問題の要点の枠
 [K+'intro']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  const glow=[0,1,2,3].map(k=>{const a=b+k*.1;return seg(p,a,a+.04)*(1-seg(p,a+.1,a+.14));});
  let s=overview({...OV,chords:1,E:1,lab:1,len:1,comps:1,marks:1,q:1,glow});
  const IX=800,IW=380,IC=IX+IW/2;
  s+=card(IX,110,IW,300,label('+2 C の 電荷を 運ぶ',IC,170,{size:30,color:QR,anchor:'middle',weight:700})
   +label('道を 4区間に 分ける',IC,235,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,b,b+.1),line(IX+40,275,IX+IW-40,275,{color:C.faint,w:2})+label('区間ごとの 仕事を',IC,330,{size:28,color:WC,anchor:'middle',weight:700})+label('数えて 足す',IC,375,{size:28,color:WC,anchor:'middle',weight:700})),seg(p,.03,.15));
  return s;
 },
 // 2. 区間1以外を薄くし、区間1を拡大
 [K+'goal1']:(p)=>{
  const d=seg(p,.05,.3),z=seg(p,.4,.6);
  let s=fade(1-z,overview({...OV,chords:1,E:1,lab:1,len:1,comps:1,marks:1,q:1,hl:0,dim:d}));
  s+=fade(z,zoom(0,{...Z1,gQ:1}));
  s+=fade(z,panel(110,140,label('区間1',PC,165,{size:30,color:SCOL[0],anchor:'middle',weight:700})+label('長さ 2 m、電場 10 N/C',PC,215,{size:28,color:C.ink,anchor:'middle'}),1,SCOL[0]));
  s+=goalTag(G1,{g:seg(p,.03,.15)});
  return s;
 },
 // 3. 電場を沿う部分（黄 6）と直角な部分（桃 8）に分ける。2文目で桃に「仕事 0」
 [K+'split']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=zoom(0,{...Z1,gQ:1,gAlong:seg(p,.05,.2),gPerp:seg(p,.12,.25),labA:'6',labP:'8'});
  s+=fade(seg(p,b,b+.08),label('仕事 0',SEGS[0].par*Z1.Esc+Z1.tx+60,Z1.ty-80,{size:28,color:PP,weight:700}));
  s+=panel(110,250,label('沿う 部分 6 N/C',PC,170,{size:30,color:AL,anchor:'middle',weight:700})+label('→ 仕事を する',PC,215,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,b,b+.08),line(PX+40,250,PX+PW-40,250,{color:C.faint,w:2})+label('直角な 部分 8 N/C',PC,300,{size:30,color:PP,anchor:'middle',weight:700})+label('→ 速めも 遅めも しない',PC,342,{size:28,color:C.ink,anchor:'middle'})),seg(p,.03,.12));
  s+=goalTag(G1);
  return s;
 },
 // 4. 先に図の上に記号（E∥・q・Δr）を置き、そのあと右の式カードに ΔW＝q E∥ Δr
 [K+'formula']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:.35,labA:'',labP:''});
  const fx=Z1.tx+6*Z1.Esc;
  s+=fade(seg(p,.03,.12),label('E∥（沿う 部分）',(Z1.tx+fx)/2,Z1.ty+30,{size:24,color:AL,anchor:'middle',weight:700}));
  const sx=Z1.tx-.25*2*Z1.lpx;
  s+=fade(seg(p,.1,.19),label('q ＝ 電荷 2 C',sx,Z1.ty-30,{size:24,color:PP,anchor:'middle',weight:700}));
  s+=fade(seg(p,.17,.26),label('Δr ＝ 区間の 長さ',sx+150,Z1.ty+130,{size:24,color:SCOL[0],anchor:'middle',weight:700}));
  const f=`\\Delta W=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}`,w=texWidth(f,52,false);
  s+=panel(110,220,label('1区間の 仕事',PC,160,{size:26,color:C.dim,anchor:'middle'})+T(f,PC,245,52)
   +fade(seg(p,b+.1,b+.2),highlight(PC-w/2+texWidth(`\\Delta W=${cs(PP,'q')}\\,`,52,false)-6,200,texWidth(cs(AL,'E_{\\parallel}'),52,false)+12,80,1,AL)),seg(p,b,b+.08),C.hi);
  s+=goalTag(G1);
  return s;
 },
 // 5. 黄 6・桃 8・水色 10 の直角三角形。「10」→「6」の順に光らせる
 [K+'tri']:(p,ctx)=>{
  const W=sentWin(ctx);
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:1,gTri:seg(p,.03,.15),labA:'6',labP:'8'});
  const tx=Z1.tx,ty=Z1.ty,ex=6*Z1.Esc,ey=-8*Z1.Esc;
  const h1=seg(p,.1,.18)*(1-seg(p,.42,.5)),h2=seg(p,.5,.58);
  s+=fade(h1,line(tx,ty,tx+ex,ty+ey,{color:EC,w:18,opacity:.35}));
  s+=fade(h2,line(tx,ty,tx+ex,ty,{color:AL,w:18,opacity:.35}));
  s+=panel(110,250,label('電場',PX+60,175,{size:28,color:C.dim})+label('10 N/C',PX+PW-60,175,{size:34,color:EC,anchor:'end',weight:700})
   +fade(seg(p,.45,.55),label('道に 沿う 部分',PX+60,250,{size:28,color:C.dim})+label('6 N/C',PX+PW-60,250,{size:34,color:AL,anchor:'end',weight:700}))
   +fade(seg(p,.6,.7),label('直角な 部分',PX+60,320,{size:28,color:C.dim})+label('8 N/C',PX+PW-60,320,{size:34,color:PP,anchor:'end',weight:700})),seg(p,.03,.12));
  s+=fade(h1,highlight(PX+PW-200,140,150,50,1,EC))+fade(h2,highlight(PX+PW-200,215,150,50,1,AL));
  s+=goalTag(G1);
  return s;
 },
 // 6. 2（桃）→6（黄）→2（青）を一項ずつ代入し、＝24 J（橙）。「C です」で答えの札
 [K+'ans1']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:.35,labA:'6',labP:''});
  const l1=`\\Delta W_1=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}`;
  const a=seg(p,.08,.16),bq=seg(p,.18,.26),c=seg(p,.28,.36),d=seg(p,.4,.5);
  const l2=`=${a>.5?cs(PP,'2\\,\\mathrm{C}'):'\\phantom{2\\,\\mathrm{C}}'}\\times${bq>.5?cs(AL,'6\\,\\mathrm{N/C}'):'\\phantom{6\\,\\mathrm{N/C}}'}\\times${c>.5?cs(SCOL[0],'2\\,\\mathrm{m}'):'\\phantom{2\\,\\mathrm{m}}'}`;
  s+=panel(110,300,T(l1,PC,175,44)+fade(a,T(l2,PC,265,36))+fade(d,T(`=${cs(WC,'24\\,\\mathrm{J}')}`,PC,355,50)),1,WC);
  s+=goalTag(G1)+ANS1(seg(p,b,b+.06));
  return s;
 },
 // 7a. 誤答 A（10 を掛けた）。図の水色 10 を赤く点滅
 [K+'wrongA']:(p,ctx)=>{
  const bl=.5+.5*Math.sin(cueT(ctx)*6);
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:1,labA:'6',labP:'8',blinkE:bl});
  s+=panel(110,110,T(`\\Delta W_1=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}=${cs(WC,'24\\,\\mathrm{J}')}`,PC,175,36),1);
  s+=wrongCard('A','40 J','直角な 部分まで 数えた',{...WOPT,y:250,mid:'2\\times10\\times2=40',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 7b. 誤答 B（8 を掛けた）。図の桃 8 を赤く点滅
 [K+'wrongB']:(p,ctx)=>{
  const bl=.5+.5*Math.sin(cueT(ctx)*6);
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:1,labA:'6',labP:'8',blinkP:bl});
  s+=panel(110,110,T(`\\Delta W_1=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}=${cs(WC,'24\\,\\mathrm{J}')}`,PC,175,36),1);
  s+=wrongCard('B','32 J','直角な 部分 8 を 掛けた',{...WOPT,y:250,mid:'2\\times8\\times2=32',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 8. 誤答 D（電荷を掛け忘れ）。式の q に赤い丸
 [K+'wrongD']:(p,ctx)=>{
  let s=zoom(0,{...Z1,gQ:1,gAlong:1,gPerp:.35,labA:'6',labP:''});
  const f=`\\Delta W_1=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}=${cs(WC,'24\\,\\mathrm{J}')}`,w=texWidth(f,36,false);
  const qx=PC-w/2+texWidth(`\\Delta W_1=${cs(PP,'q')}`,36,false)-texWidth('q',36,false)/2+5;
  s+=panel(110,110,T(f,PC,175,36)+fade(seg(p,.1,.2),ring(qx,165,26,{color:NG,w:4})),1);
  s+=wrongCard('D','12 J',['電荷 2 C を 掛け忘れ','（+1 C あたりの 値、単位 J/C）'],{...WOPT,y:250,mid:'6\\times2=12',g:seg(p,.03,.1)});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 9. 全体の図（元の明るさ）と、右に棒グラフの枠。区間1の青い棒 24 が立つ
 [K+'goal2']:(p)=>{
  let s=overview({ox:45,oy:412,sc:88,Esc:12,chords:1,E:1,lab:1,len:1,comps:0,marks:1,q:1});
  s+=bars({...BR,shown:[seg(p,.45,.65),0,0,0],frame:seg(p,.2,.35)});
  s+=goalTag(G2,{g:seg(p,.03,.15)});
  return s;
 },
 // 10. 区間2を拡大。道に直角な光で影（黄 2）。60° の弧を光らせる
 [K+'seg2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=zoom(1,{...Z2,gArc:1,gLight:seg(p,b,b+.12),gAlong:seg(p,b+.15,b+.3),labA:'2'});
  s+=fade(seg(p,.15,.3)*(1-seg(p,.45,.55)),ring(Z2.tx+60*Math.cos(rad(65)),Z2.ty-60*Math.sin(rad(65)),40,{color:C.hi,w:3}));
  s+=bars({...BR,shown:[1,0,0,0]});
  s+=fade(seg(p,b+.1,b+.25),T(`4\\cos 60^\\circ=4\\times0.5=${cs(AL,'2')}`,360,488,32));
  s+=goalTag(G2);
  return s;
 },
 // 11. ΔW₂＝2×2×3＝12 J。棒グラフに紫の棒 12
 [K+'calc2']:(p)=>{
  let s=zoom(1,{...Z2,gArc:1,gLight:1,gAlong:1,labA:'2'});
  s+=card(30,425,610,80,T(`\\Delta W_2=${cs(PP,'2')}\\times${cs(AL,'2')}\\times${cs(SCOL[1],'3')}=${cs(WC,'12\\,\\mathrm{J}')}`,335,468,36),seg(p,.05,.15),WC);
  s+=bars({...BR,shown:[1,seg(p,.4,.6),0,0]});
  s+=goalTag(G2);
  return s;
 },
 // 12. 区間3：電場が道と直角。影は点（黄の点）。棒は高さ 0 の線
 [K+'seg3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=zoom(2,{...Z3,gRight:1,gLight:seg(p,b,b+.12),gAlong:seg(p,b+.15,b+.25),labA:'影は 点'});
  s+=bars({...BR,shown:[1,1,seg(p,b+.3,b+.4),0]});
  s+=fade(seg(p,b+.3,b+.4),card(30,425,610,80,T(`\\Delta W_3=2\\times${cs(AL,'0')}\\times1=${cs(WC,'0\\,\\mathrm{J}')}`,335,468,36),1,WC));
  s+=goalTag(G2);
  return s;
 },
 // 13. 区間4：電場が進む向きの逆。影は反対側に伸び、黄から赤に。「−3」
 [K+'seg4']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  let s=zoom(3,{...Z4,gLight:seg(p,b,b+.1),gAlong:seg(p,b+.12,b+.25),labA:'−3'});
  s+=bars({...BR,shown:[1,1,1,0]});
  s+=goalTag(G2);
  return s;
 },
 // 14. ΔW₄＝2×(−3)×2＝−12 J。棒は下向きの赤 −12。電荷に、進む向きと逆の水色の矢印を短く重ねる
 [K+'calc4']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=zoom(3,{...Z4,gLight:.4,gAlong:1,labA:'−3'});
  s+=card(30,425,610,80,T(`\\Delta W_4=${cs(PP,'2')}\\times${cs(NG,'(-3)')}\\times${cs(SCOL[3],'2')}=${cs(NG,'-12\\,\\mathrm{J}')}`,335,468,36),seg(p,.05,.15),NG);
  s+=bars({...BR,shown:[1,1,1,seg(p,.35,.5)]});
  const g=SEGS[3],ux=Math.cos(rad(g.deg)),uy=-Math.sin(rad(g.deg)),cx=Z4.tx+150*ux,cy=Z4.ty+150*uy;
  s+=fade(seg(p,b,b+.1),charge(cx,cy,{text:''})+arrow(cx-16*ux,cy-16*uy,cx-70*ux,cy-70*uy,{color:EC,w:5,head:14})+label('押し戻す',cx,cy+44,{size:24,color:EC,anchor:'middle',weight:700}));
  s+=goalTag(G2);
  return s;
 },
 // 15. 4本の棒を左から積む（下向きの棒の分だけ下がる）。合計に橙の横線「24 J」。右上に答えの札
 [K+'ans2']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,st=seg(p,.08,.4);
  let s=bars({...BL,stack:st});
  const y=BL.y0-BL.u*24;
  s+=fade(seg(p,.42,.52),line(BL.x0-10,y,BL.x0+4*BL.cw+40,y,{color:WC,w:3})+label('24 J',BL.x0+4*BL.cw+50,y+9,{size:30,color:WC,weight:700}));
  s+=panel(110,200,label('符号の まま 足す',PC,160,{size:26,color:C.dim,anchor:'middle'})
   +T(`${cs(SCOL[0],'24')}+${cs(SCOL[1],'12')}+${cs(SCOL[2],'0')}${cs(NG,'-12')}`,PC,225,40)+fade(seg(p,.42,.52),T(`=${cs(WC,'24\\,\\mathrm{J}')}`,PC,285,44)),seg(p,.03,.12),WC);
  s+=goalTag(G2)+ANS2(seg(p,b,b+.06));
  return s;
 },
 // 16. 誤答 B（区間4の棒が上向きに反転、灰色の点線）→ 誤答 C（消える）。元に戻す
 [K+'wrongBC']:(p,ctx)=>{
  const W=sentWin(ctx),wB=[0,W[0][1]],wC=[W[1]?W[1][0]:.5,1];
  const fB=seg(p,wB[0]+.05,wB[0]+.12)*(1-seg(p,wB[1]-.06,wB[1]-.01)),fC=seg(p,wC[0]+.05,wC[0]+.12)*(1-seg(p,.9,.97));
  let s=bars({...BL,stack:1,flipB:fB,hideC:fC,title:0});
  const y=BL.y0-BL.u*24;
  s+=line(BL.x0-10,y,BL.x0+4*BL.cw+40,y,{color:WC,w:3})+label('24 J',BL.x0+4*BL.cw+50,y+9,{size:30,color:WC,weight:700});
  s+=panel(110,110,T(`24+12+0${cs(NG,'-12')}=${cs(WC,'24\\,\\mathrm{J}')}`,PC,175,38),1);
  s+=wrongSeq(p,ctx,[['B','48 J','区間4を 大きさ 12 として 足した',{mid:'24+12+0+12=48'}],['C','36 J','区間4を 足さなかった',{mid:'24+12+0=36'}]],{win:[wB,wC],opts:{...WOPT,y:250}});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },
 // 17. 誤答 D（区間3の 5 N/C を掛けた）。右の上に区間3の点の影を黄で光らせる
 [K+'wrongD2']:(p,ctx)=>{
  const bl=.5+.5*Math.sin(cueT(ctx)*6);
  let s=bars({...BL,stack:1,addD:seg(p,.15,.25),title:0});
  const y=BL.y0-BL.u*24;
  s+=line(BL.x0-10,y,BL.x0+4*BL.cw+40,y,{color:WC,w:3})+label('24 J',BL.x0+4*BL.cw+50,y+9,{size:30,color:WC,weight:700});
  s+=card(PX,90,PW,170,'',1);
  s+=zoom(2,{tx:PX+150,ty:215,lpx:70,Esc:14,a0:.6,gRight:1,gAlong:1,labA:'',labDr:0,labE:0,flashPt:bl,gDr:0});
  s+=label('区間3：影は 点',PX+260,150,{size:24,color:AL,weight:700})+label('直角な 5 N/C',PX+260,195,{size:24,color:EC,weight:700});
  s+=wrongCard('D','34 J','区間3の 直角な 5 N/C を 掛けた',{...WOPT,y:285,mid:'24+12+2\\times5\\times1-12=34',g:seg(p,.03,.1)});
  s+=goalTag(G2)+ANS2(1);
  return s;
 },

 // ===================== 小問3 =====================
 // 18. 区間4と、棒グラフの下向きの赤い棒を強調。右に区間4の拡大（小）
 [K+'goal3']:(p)=>{
  const bl=seg(p,.15,.3);
  let s=bars({...BL,stack:1,hl:3});
  const cx=BL.x0+30+3*BL.cw+BL.cw/2-10,y1=BL.y0-BL.u*36,y2=BL.y0-BL.u*24;
  s+=fade(bl,rect(cx-45,y1-10,90,y2-y1+20,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8}));
  s+=card(PX,90,PW,230,'',seg(p,.05,.15));
  s+=fade(seg(p,.05,.15),zoom(3,{tx:PX+260,ty:230,lpx:80,Esc:28,a0:.45,gAlong:1,labA:'−3',labDr:0,labE:1,gDr:1})+label('区間4',PX+30,130,{size:26,color:SCOL[3],weight:700}));
  s+=goalTag(G3,{g:seg(p,.03,.15)});
  return s;
 },
 // 19. 赤い棒の横に「押し戻した区間 −12 J」。答えの札 D
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=bars({...BL,stack:1,hl:3});
  const cx=BL.x0+30+3*BL.cw+BL.cw/2-10,y1=BL.y0-BL.u*36,y2=BL.y0-BL.u*24;
  s+=rect(cx-45,y1-10,90,y2-y1+20,{fill:'none',fo:0,stroke:C.hi,sw:3,rx:8});
  s+=card(PX,90,PW,230,zoom(3,{tx:PX+260,ty:230,lpx:80,Esc:28,a0:.45,gAlong:1,labA:'−3',labDr:0,labE:1,gDr:1})+label('区間4',PX+30,130,{size:26,color:SCOL[3],weight:700}),1);
  s+=fade(seg(p,.1,.22),card(PX,345,PW,90,label('押し戻した 区間',PX+30,400,{size:28,color:C.ink,weight:700})+label('−12 J',PX+PW-30,400,{size:34,color:NG,anchor:'end',weight:700}),1,NG));
  s+=goalTag(G3)+ANS3(seg(p,b,b+.06));
  return s;
 },
 // 20. 誤答 A → B（区間3の点の影と区間4の赤い影を左右に並べる）→ C
 [K+'wrong3']:(p,ctx)=>{
  const W=sentWin(ctx),e=W[0][1],wA=[0,e*.45],wB=[e*.45,e],wC=[W[1]?W[1][0]:.6,1];
  const inB=seg(p,wB[0]+.01,wB[0]+.05)*(1-seg(p,wB[1]-.04,wB[1]));
  let s=bars({...BL,stack:1,hl:3});
  s+=fade(1-inB,card(PX,90,PW,190,zoom(3,{tx:PX+260,ty:210,lpx:80,Esc:28,a0:.45,gAlong:1,labA:'−3',labDr:0,labE:1,gDr:1})+label('区間4',PX+30,130,{size:26,color:SCOL[3],weight:700}),1));
  s+=fade(inB,card(PX,90,PW,190,zoom(2,{tx:PX+90,ty:220,lpx:60,Esc:16,a0:.6,gRight:1,gAlong:1,labA:'',labDr:0,labE:0,gDr:0})
   +label('直角',PX+90,130,{size:24,color:C.ink,anchor:'middle',weight:700})+label('影は 点',PX+150,250,{size:24,color:AL,weight:700})
   +line(PX+245,110,PX+245,265,{color:C.faint,w:2})
   +zoom(3,{tx:PX+400,ty:210,lpx:50,Esc:22,a0:.3,gAlong:1,labA:'',labDr:0,labE:0,gDr:0})+label('逆向き',PX+370,130,{size:24,color:C.ink,anchor:'middle',weight:700})+label('影は 反対側',PX+370,265,{size:24,color:NG,anchor:'middle',weight:700}),1));
  s+=wrongSeq(p,ctx,[['A','ほとんど 効かない',['電場の 強さだけで 判断','（長さと 向きを 見ない）']],['B','0 J として 扱う',['直角（影は 点）と','逆向き（影は 反対側）の 混同']],['C','+12 J として 足す','仕事の 符号を 捨てた']],{win:[wA,wB,wC],opts:{...WOPT,y:300}});
  s+=goalTag(G3)+ANS3(1);
  return s;
 },

 // ===================== まとめ =====================
 // 21. 4区間 → 8区間 → 16区間の折れ線が曲線に重なっていく。最後に ΔW＝q E∥ Δr を中央に。答えの札を並べる
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const o={ox:270,oy:470,sc:100},V=view(o.ox,o.oy,o.sc);
  const fadeAll=seg(p,b,b+.08);
  let s=curveSvg(V,{color:C.ink,w:3,opacity:.5});
  const stage=p<.12?0:p<.25?1:2;
  const n=[4,8,16][stage],gIn=[seg(p,.0,.06),seg(p,.12,.18),seg(p,.25,.31)][stage];
  let pts=[];for(let k=0;k<=n;k++)pts.push(V(curveAt(4*k/n)));
  if(n===4)pts=VERT.map(V);
  let ch='';for(let k=0;k<n;k++)ch+=arrow(pts[k][0],pts[k][1],pts[k+1][0],pts[k+1][1],{color:n===4?SCOL[k]:SCOL[Math.floor(k*4/n)],w:n===16?3:4,head:n===16?9:13});
  s+=fade(gIn,ch);
  s+=fade(seg(p,.05,.12),label(`${n} 区間`,o.ox+700,o.oy-60,{size:30,color:C.ink,anchor:'end',weight:700}));
  s=fade(1-.75*fadeAll,s);
  s+=card(250,150,700,200,label('区間ごとに',600,200,{size:26,color:C.dim,anchor:'middle'})
   +T(`\\Delta W=${cs(PP,'q')}\\,${cs(AL,'E_{\\parallel}')}\\,${cs(SCOL[0],'\\Delta r')}`,600,270,60)
   +label('符号の まま 足す',600,330,{size:28,color:WC,anchor:'middle',weight:700}),fadeAll,C.hi);
  s+=answerRow([[1,'C','24 J'],[2,'A','24 J'],[3,'D','']],{g:seg(p,.85,.93)});
  return s;
 },
};
