// YouTube シリーズ「外積・中級 2/2」(ys-um-cross-product-2) — 図。Stage 1200×515.
// 色（1/2 と同じ）：x̂ 水色、ŷ 紫、ẑ 金、外積の答え 桃、負の組・誤り 赤。
//   トルク：𝐫 水色、𝐅 緑、𝐍 桃。磁気力：𝐯 紫、𝐁 橙（電磁気の約束）、力 𝐅 緑、負電荷 青、正電荷 赤。ベクトルは太字、長さは細字。
// 空間：x 右、y 奥（斜め右上に描く）、z 上（斜投影、1/2 と同じ）。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight,tex,texWidth,poly} from './anim.mjs';

const K='um-cross-product-2:';
const CN=C.p,HX=C.x,HY=C.v,HZ=C.t,NG=C.a,CQ=C.hi,CR=C.x,CF=C.F,CV=C.v,CB=C.E,EL='#7fb2ff',PO=C.a;
const RAD=Math.PI/180;
const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
const T=(s,x,y,o={})=>tex(s,x,y,{auto:false,...o});
const TF=(s,x,y,maxW,size=40,o={})=>{const w=texWidth(s,size,false);return T(s,x,y,{size:w>maxW?size*maxW/w:size,...o});};
const card=(x,y,w,h,inner,g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
const hx=cs(HX,'\\hat{x}'),hy=cs(HY,'\\hat{y}'),hz=cs(HZ,'\\hat{z}');
const bN=cs(CN,'\\mathbf{N}'),br=cs(CR,'\\mathbf{r}'),bF=cs(CF,'\\mathbf{F}'),bL=cs(CN,'\\mathbf{L}'),bp=cs(C.p,'\\mathbf{p}'),bv=cs(CV,'\\mathbf{v}'),bB=cs(CB,'\\mathbf{B}');
const cross=(x,y,sz=16,color=NG)=>line(x-sz,y-sz,x+sz,y+sz,{color,w:4})+line(x-sz,y+sz,x+sz,y-sz,{color,w:4});
const check=(x,y,sz=16,color=C.F)=>draw([[x-sz,y],[x-sz*.3,y+sz*.7],[x+sz,y-sz*.8]],1,{color,w:5});

function outSym(x,y,r=22,color=CN,g=1){return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+dot(x,y,r*.28,color));}
function inSym(x,y,r=22,color=CN,g=1){const d=r*.62;return fade(g,ring(x,y,r,{color,w:4,fill:'#1a1030'})+line(x-d,y-d,x+d,y+d,{color,w:4})+line(x-d,y+d,x+d,y-d,{color,w:4}));}
function arc2(pts,{c1=HX,c2=HY,w=5,g=1}={}){
 if(g<=0||pts.length<3)return '';
 const n=pts.length,h=Math.floor(n/2),[x1,y1]=pts[n-2],[x2,y2]=pts[n-1];
 const a=Math.atan2(y2-y1,x2-x1),L=16;
 const head=`<polygon points="${x2+Math.cos(a)*6},${y2+Math.sin(a)*6} ${x2-L*Math.cos(a)+L*.55*Math.sin(a)},${y2-L*Math.sin(a)-L*.55*Math.cos(a)} ${x2-L*Math.cos(a)-L*.55*Math.sin(a)},${y2-L*Math.sin(a)+L*.55*Math.cos(a)}" fill="${c2}"/>`;
 return fade(g,draw(pts.slice(0,h+1),1,{color:c1,w})+draw(pts.slice(h),1,{color:c2,w})+head);
}
const circPts=(cx,cy,r,a0,a1,n=40)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});

// ---- oblique 3D (same as 1/2) ----
const KY=.55,AY=32*RAD;
function view({ox,oy,u}){return (x,y,z)=>[ox+u*(x+KY*Math.cos(AY)*y),oy-u*(z+KY*Math.sin(AY)*y)];}
const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
function axes3(P,{xl=1.7,yl=2.1,zl=1.5,zn=1.3,g=1,names=true,xn=.35,yn=.5}={}){
 let s=L3(P,[-xn,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-yn,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 if(names){const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
  s+=label('x（右）',X[0]+10,X[1]+8,{size:24,color:HX,weight:700})+label('y（奥）',Y[0]+10,Y[1]-2,{size:24,color:HY,weight:700})+label('z（上）',Z[0]+14,Z[1]+10,{size:24,color:HZ,weight:700});}
 return fade(g,s);
}
function floor(P,{x0=-.35,x1=1.6,y0=-.5,y1=2,g=1}={}){return fade(g,poly([P(x0,y0,0),P(x1,y0,0),P(x1,y1,0),P(x0,y1,0)],{fill:'#1a2a48',fo:.55,stroke:C.grid,sw:2}));}
// arc between two unit directions d0→d1 (perpendicular), radius r
function arc3(P,d0,d1,r,{c1,c2,g=1}={}){
 if(g<=0)return '';
 const pts=Array.from({length:31},(_,i)=>{const a=Math.PI/2*i/30*g;return P(...[0,1,2].map(k=>r*(Math.cos(a)*d0[k]+Math.sin(a)*d1[k])));});
 return arc2(pts,{c1,c2});
}
const E3={x:[1,0,0],y:[0,1,0],z:[0,0,1]},HC={x:HX,y:HY,z:HZ},HT={x:hx,y:hy,z:hz};
const PU=view({ox:230,oy:300,u:150});
function hatsAll(P,{g=[1,1,1],lab=true}={}){
 let s='';
 ['x','y','z'].forEach((k,i)=>{s+=fade(g[i],V3(P,[0,0,0],E3[k],{color:HC[k],w:7,head:20}));});
 if(lab){const X=P(1,0,0),Y=P(0,1,0),Z=P(0,0,1);s+=fade(g[0],T(hx,X[0]-6,X[1]+42,{size:40}))+fade(g[1],T(hy,Y[0]+26,Y[1]+6,{size:40}))+fade(g[2],T(hz,Z[0]-26,Z[1]+14,{size:40}));}
 return s;
}
// generic inset: two on-picture directions (deg), arc a1→a2, symbol at centre
function inset(cx,cy,{a1=0,a2=90,n1=hy,n2=hz,c1=HY,c2=HZ,sym='out',title='',g=1,arcG=1,res=''}={}){
 let s=rect(cx-125,cy-150,250,260,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14});
 s+=label(title,cx,cy-118,{size:22,color:C.dim,anchor:'middle'});
 const o=[cx,cy+20],u=70,p1=[o[0]+u*Math.cos(a1*RAD),o[1]-u*Math.sin(a1*RAD)],p2=[o[0]+u*Math.cos(a2*RAD),o[1]-u*Math.sin(a2*RAD)];
 s+=arrow(o[0],o[1],p1[0],p1[1],{color:c1,w:5,head:15})+arrow(o[0],o[1],p2[0],p2[1],{color:c2,w:5,head:15});
 const lp=(p,a)=>[p[0]+22*Math.cos(a*RAD),p[1]-22*Math.sin(a*RAD)+10];
 const l1=lp(p1,a1),l2=lp(p2,a2);s+=T(n1,l1[0],l1[1],{size:28})+T(n2,l2[0],l2[1],{size:28});
 s+=arc2(circPts(o[0],o[1],40,a1*RAD,a2*RAD,24),{c1,c2,w:4,g:arcG});
 s+=sym==='out'?outSym(o[0],o[1],15,CN,arcG):'';
 if(res)s+=fade(arcG,T(res,cx,cy+95,{size:28}));
 return fade(g,s);
}
// cycle circle x → y → z → x (clockwise on screen: x top, y lower right, z lower left)
function cycle(cx,cy,{R=95,g=1,rev=0,hl=''}={}){
 const pos={x:90,y:-30,z:210};let s='';
 const col=rev?NG:C.hi;
 const seq=rev?[['x','z'],['z','y'],['y','x']]:[['x','y'],['y','z'],['z','x']];
 for(const [a,b] of seq){let a0=pos[a]*RAD,a1=pos[b]*RAD;if(!rev){if(a1>a0)a1-=2*Math.PI;}else{if(a1<a0)a1+=2*Math.PI;}
  const pad=.33*(a1>a0?1:-1);s+=arc2(circPts(cx,cy,R,a0+pad,a1-pad,24),{c1:col,c2:col,w:4});}
 for(const k of ['x','y','z']){const a=pos[k]*RAD,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=ring(x,y,28,{color:HC[k],w:3,fill:'#131f38'})+T(HT[k],x,y+10,{size:34});}
 s+=label(rev?'−':'＋',cx,cy+14,{size:44,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
// 3x3 table of basis cross products
const TAB={x:{x:'0',y:hz,z:`-${hz}`},y:{x:`-${hz}`,y:'0',z:hx},z:{x:hy,y:`-${hx}`,z:'0'}};
function table3(x0,y0,{cw=120,rh=70,n=9,g=1,hlDiag=0,dotTab=0,title=''}={}){
 let s=title?label(title,x0+cw*2,y0-58,{size:26,color:dotTab?C.F:CN,anchor:'middle',weight:700}):'';
 const ks=['x','y','z'];
 s+=T(dotTab?'\\cdot':'\\times',x0+cw*.5,y0+10,{size:32,color:C.dim});
 ks.forEach((k,j)=>{s+=T(HT[k],x0+cw*(j+1.5),y0+10,{size:34});s+=T(HT[k],x0+cw*.5,y0+rh*(j+1)+10,{size:34});});
 s+=line(x0,y0+rh*.5,x0+cw*4,y0+rh*.5,{color:C.faint,w:2})+line(x0+cw,y0-rh*.5,x0+cw,y0+rh*3.5,{color:C.faint,w:2});
 let k=0;
 ks.forEach((r,i)=>ks.forEach((c,j)=>{const gg=k<n?1:0;k++;const cx=x0+cw*(j+1.5),cy=y0+rh*(i+1)+10;
  const v=dotTab?(r===c?'1':'0'):TAB[r][c];const diag=r===c;
  s+=fade(gg,(diag&&hlDiag?rect(cx-cw/2+6,cy-rh/2-6,cw-12,rh-8,{fill:dotTab?C.F:NG,fo:.15,stroke:dotTab?C.F:NG,sw:2,rx:8}):'')+T(v,cx,cy,{size:32,color:v==='0'?(dotTab?C.dim:NG):C.ink}));}));
 return fade(g,s);
}
// door in the x–z plane hinged on the z axis
const PD=view({ox:190,oy:400,u:115});
function doorScene(p,{gr=1,gF=1,gN=0,labN='',ang=0}={}){
 const L=1.6,Hh=1.55,h=.8,c=Math.cos(ang*RAD),sn=Math.sin(ang*RAD);
 let s=floor(PD,{x1:2,y1:5})+axes3(PD,{xl:2.1,yl:5.4,zl:2.5,zn:.3,names:true});
 s+=poly([PD(0,0,0),PD(L*c,L*sn,0),PD(L*c,L*sn,Hh),PD(0,0,Hh)],{fill:'#46526e',fo:.55,stroke:C.dim,sw:2});
 s+=L3(PD,[0,0,-.1],[0,0,Hh+.1],{color:C.ink,w:5})+label('蝶番',PD(0,0,Hh)[0]-14,PD(0,0,Hh)[1]-6,{size:24,color:C.dim,anchor:'end'});
 s+=V3(PD,[0,0,h],[L*c,L*sn,h],{color:CR,w:7,head:20,g:gr})+fade(gr,T(br,PD(L*.5,0,h)[0],PD(L*.5,0,h)[1]-16,{size:38}));
 s+=V3(PD,[L*c,L*sn,h],[L*c-sn*1.0,L*sn+c*1.0,h],{color:CF,w:7,head:20,g:gF})+fade(gF,T(bF,PD(L*c-sn,L*sn+c,h)[0]+18,PD(L*c-sn,L*sn+c,h)[1]+8,{size:38,anchor:'start'}));
 if(gN>0)s+=V3(PD,[0,0,Hh+.1],[0,0,Hh+.1+.75],{color:CN,w:8,head:22,g:gN})+(labN?fade(gN,T(labN,PD(0,0,Hh+.85)[0]-20,PD(0,0,Hh+.85)[1]+24,{size:34,anchor:'end'})):'');
 return s;
}
// magnetic scene: charge at origin, v along x, B along y (field arrows), force along ±z
const PM=view({ox:260,oy:300,u:120});
function magScene(p,{q=-1,gv=1,gB=1,gX=0,gF=0,pred=0,perp=0}={}){
 let s=floor(PM,{x0:-.6,x1:2,y0:-.6,y1:2.2})+axes3(PM,{xl:2.1,yl:2.4,zl:1.7,zn:1.4});
 for(const [x,z] of [[-.6,.5],[-.6,-.5],[2.6,-.4],[2.6,.4]]){s+=fade(gB*.8,V3(PM,[x,-.3,z],[x,1.3,z],{color:CB,w:3,head:12}));}
 s+=fade(gB,T(bB,PM(2.6,1.3,.4)[0]+8,PM(2.6,1.3,.4)[1]+4,{size:36,anchor:'start'}));
 s+=V3(PM,[0,0,0],[1.4,0,0],{color:CV,w:7,head:20,g:gv})+fade(gv,T(bv,PM(1.4,0,0)[0]-10,PM(1.4,0,0)[1]+40,{size:38}));
 if(pred>0)s+=fade(pred,V3(PM,[0,0,0],[0,0,1],{color:CF,w:5,head:18,opacity:.5})+V3(PM,[0,0,0],[0,0,-1],{color:CF,w:5,head:18,opacity:.5})+label('上？',PM(0,0,1)[0]-18,PM(0,0,1)[1]+8,{size:28,color:CF,anchor:'end',weight:700})+label('下？',PM(0,0,-1)[0]-18,PM(0,0,-1)[1]+8,{size:28,color:CF,anchor:'end',weight:700}));
 if(gX>0)s+=V3(PM,[0,0,0],[0,0,1.2],{color:CN,w:7,head:20,g:gX})+fade(gX,T(`${bv}\\times${bB}`,PM(0,0,1.2)[0]-18,PM(0,0,1.2)[1]+10,{size:32,anchor:'end'}));
 if(gF>0){const d=q<0?-1:1;s+=V3(PM,[0,0,0],[0,0,1.2*d],{color:CF,w:8,head:22,g:gF})+fade(gF,T(bF,PM(0,0,1.2*d)[0]+20,PM(0,0,1.2*d)[1]+(d>0?20:0),{size:38,anchor:'start'}));}
 if(perp>0){const k=.16;s+=fade(perp,draw([PM(k,0,0),PM(k,0,-k),PM(0,0,-k)],1,{color:C.ink,w:2.5}));}
 s+=ring(PM(0,0,0)[0],PM(0,0,0)[1],17,{color:q<0?EL:PO,w:3,fill:'#1b2338'})+label(q<0?'−':'+',PM(0,0,0)[0],PM(0,0,0)[1]+9,{size:28,color:q<0?EL:PO,anchor:'middle',weight:700});
 return s;
}

export const ytUmCrossProduct2Diagrams={
 // ===== S1 前回の問い =====
 [K+'ask']:(p)=>{
  let s=label('前回：外積・中級 1/2',40,50,{size:24,color:C.dim});
  s+=floor(PU)+axes3(PU)+hatsAll(PU,{g:[seg(p,.05,.2),seg(p,.1,.25),seg(p,.15,.3)]});
  s+=card(640,100,520,300,label('毎回 右ねじを 回さずに',900,175,{size:30,color:C.ink,anchor:'middle'})
   +label('基本の 3方向 だけで',900,240,{size:30,color:C.ink,anchor:'middle'})
   +label('計算の 約束を 作れる？',900,310,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,.2,.35),C.hi);
  return s;
 },
 [K+'recall']:(p)=>{
  let s=card(80,110,500,280,label('前回、右ねじで',330,170,{size:28,color:C.dim,anchor:'middle'})+T(`${hx}\\times${hy}=${hz}`,330,250,{size:48}),seg(p,0,.15));
  s+=card(620,110,500,280,label('順序を 入れ替えると',870,170,{size:28,color:C.dim,anchor:'middle'})+T(`${hy}\\times${hx}=-${hz}`,870,250,{size:48}),seg(p,.4,.55));
  return s;
 },
 [K+'goal']:(p)=>{
  let s=card(80,110,500,300,label('① 基本の3方向',330,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('一枚の 表に',330,250,{size:30,color:C.hi,anchor:'middle',weight:700})+label('3 × 3 ＝ 9マス',330,330,{size:26,color:C.dim,anchor:'middle'}),seg(p,0,.15));
  s+=card(620,110,500,300,label('② 表から 向きを出す',870,180,{size:30,color:C.ink,anchor:'middle',weight:700})+label('トルク',870,260,{size:30,color:CN,anchor:'middle',weight:700})+label('磁気力',870,330,{size:30,color:C.F,anchor:'middle',weight:700}),seg(p,.5,.65));
  return s;
 },
 [K+'predict']:(p)=>{
  let s=floor(PU)+axes3(PU)+hatsAll(PU,{g:[.35,1,1]});
  s+=card(640,110,520,280,T(`${hy}\\times${hz}=\\ ?`,900,210,{size:54})+label('どちらを 向く？',900,300,{size:32,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',900,355,{size:26,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ===== S2 基本の3方向の約束 =====
 [K+'yz']:(p)=>{
  let s=floor(PU)+axes3(PU)+hatsAll(PU,{g:[.3,1,1]})+arc3(PU,E3.y,E3.z,.5,{c1:HY,c2:HZ,g:seg(p,.1,.4)});
  s+=inset(900,300,{a1:0,a2:90,n1:hy,n2:hz,c1:HY,c2:HZ,sym:'',title:'右側から 見ると',g:seg(p,.45,.6),arcG:seg(p,.55,.75)});
  s+=fade(seg(p,.7,.85),label('反時計回り',900,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'yz2']:(p)=>{
  let s=floor(PU)+axes3(PU)+hatsAll(PU,{g:[0,1,1]})+arc3(PU,E3.y,E3.z,.5,{c1:HY,c2:HZ});
  s+=V3(PU,[0,0,0],[1,0,0],{color:CN,w:8,head:22,g:seg(p,.15,.4)})+fade(seg(p,.35,.5),T(`${hy}\\times${hz}`,PU(1,0,0)[0]+10,PU(1,0,0)[1]+46,{size:34}));
  s+=inset(900,260,{a1:0,a2:90,n1:hy,n2:hz,c1:HY,c2:HZ,sym:'out',title:'右側から 見ると'});
  s+=fade(seg(p,.1,.25),label('見る人の方 ＝ 右',900,420,{size:26,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),T(`${hy}\\times${hz}=${hx}`,900,480,{size:40}));
  return s;
 },
 [K+'zx']:(p)=>{
  let s=floor(PU)+axes3(PU)+hatsAll(PU,{g:[1,.3,1]})+arc3(PU,E3.z,E3.x,.5,{c1:HZ,c2:HX,g:seg(p,.05,.35)});
  s+=V3(PU,[0,0,0],[0,1,0],{color:CN,w:8,head:22,g:seg(p,.4,.6)});
  s+=fade(seg(p,.55,.7),T(`${hz}\\times${hx}`,PU(0,1,0)[0]+24,PU(0,1,0)[1]+8,{size:34,anchor:'start'}));
  s+=inset(900,260,{a1:90,a2:180,n1:hz,n2:hx,c1:HZ,c2:HX,sym:'out',title:'奥から 見ると',g:seg(p,.3,.45),arcG:seg(p,.35,.55)});
  s+=fade(seg(p,.6,.75),T(`${hz}\\times${hx}=${hy}`,900,470,{size:40}));
  return s;
 },
 [K+'cycle']:(p)=>{
  let s=cycle(300,270,{g:seg(p,.3,.5),R:110});
  const eq=[`${hx}\\times${hy}=${hz}`,`${hy}\\times${hz}=${hx}`,`${hz}\\times${hx}=${hy}`];
  eq.forEach((e,i)=>{s+=fade(seg(p,.05+i*.08,.15+i*.08),T(e,850,150+i*90,{size:46}));});
  s+=fade(seg(p,.7,.85),label('矢印の向きに 進む組 → ＋',850,450,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'reverse']:(p)=>{
  let s=cycle(300,270,{R:110,rev:1,g:seg(p,.05,.2)});
  s+=card(620,110,520,300,label('逆向きに 進む組 → −',880,175,{size:30,color:NG,anchor:'middle',weight:700})
   +fade(seg(p,.5,.65),T(`${hz}\\times${hy}=-${hx}`,880,280,{size:50})),seg(p,.1,.25));
  return s;
 },
 [K+'same']:(p)=>{
  const ox=150,oy=330;
  let s=arrow(ox,oy,ox+280,oy,{color:HX,w:10,head:24})+arrow(ox,oy+2,ox+280,oy+2,{color:HX,w:4,head:14,opacity:.6})+T(hx,ox+140,oy+50,{size:40});
  s+=fade(seg(p,.2,.4),label('平行 → つぶれて 面積 0',ox+140,oy-60,{size:28,color:NG,anchor:'middle',weight:700}));
  s+=card(620,110,520,300,T(`\\sin0^\\circ=0`,880,190,{size:44})+fade(seg(p,.45,.6),T(`${hx}\\times${hx}=0`,880,300,{size:52})),seg(p,0,.15));
  return s;
 },
 [K+'table']:(p)=>{
  let s=table3(330,140,{n:Math.floor(9*seg(p,.05,.6))+ (p>.6?9:0),hlDiag:seg(p,.65,.8),title:'外積の表（左 × 上）'});
  s+=fade(seg(p,.65,.8),label('対角線は 0',960,200,{size:30,color:NG,weight:700})+label('残り 6マス：',960,260,{size:26,color:C.ink})+label('± 基本の向き',960,300,{size:26,color:C.ink}));
  return s;
 },
 [K+'contrast']:(p)=>{
  let s=table3(70,150,{cw:110,rh:66,hlDiag:1,dotTab:1,title:'内積の表'});
  s+=table3(650,150,{cw:110,rh:66,hlDiag:1,title:'外積の表'});
  s+=fade(seg(p,.2,.35),label('対角線 だけ 残る',290,470,{size:28,color:C.F,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.7),label('対角線 だけ 消える',870,470,{size:28,color:NG,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S3 表で計算する =====
 [K+'dist']:(p)=>{
  const A=cs(C.x,'\\mathbf{A}'),B=cs(C.F,'\\mathbf{B}'),Cc=cs(C.E,'\\mathbf{C}');
  let s=label('かっこを 分けて 展開',600,110,{size:30,color:C.dim,anchor:'middle'});
  s+=T(`(${A}+${B})\\times${Cc}`,600,220,{size:56});
  s+=fade(seg(p,.35,.55),T(`=${A}\\times${Cc}+${B}\\times${Cc}`,600,330,{size:56}));
  s+=fade(seg(p,.6,.75),label('（数の掛け算と 同じ形）',600,430,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'order']:(p)=>{
  const A=cs(C.x,'\\mathbf{A}'),B=cs(C.F,'\\mathbf{B}'),Cc=cs(C.E,'\\mathbf{C}');
  let s=card(200,80,800,170,label('分配法則',600,130,{size:30,color:C.hi,anchor:'middle',weight:700})+T(`(${A}+${B})\\times${Cc}=${A}\\times${Cc}+${B}\\times${Cc}`,600,195,{size:40}),1,C.hi);
  s+=fade(seg(p,.1,.25),label('成り立つことは 上級で 確かめる',600,290,{size:26,color:C.dim,anchor:'middle'}));
  s+=fade(seg(p,.5,.65),label('左右の 順序は 入れ替えない',600,370,{size:32,color:NG,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),T(`${A}\\times${Cc}\\ \\ne\\ ${Cc}\\times${A}`,600,450,{size:40}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=floor(PU)+axes3(PU);
  s+=fade(.35,V3(PU,[0,0,0],[1,0,0],{color:HX,w:4,head:14})+V3(PU,[0,0,0],[0,1,0],{color:HY,w:4,head:14}));
  s+=fade(seg(p,.4,.55),L3(PU,[1,0,0],[1,1,0],{color:C.dim,w:2,dash:'5 6'})+L3(PU,[0,1,0],[1,1,0],{color:C.dim,w:2,dash:'5 6'}));
  s+=V3(PU,[0,0,0],[1,1,0],{color:CQ,w:8,head:22,g:seg(p,.4,.6)})+fade(seg(p,.5,.65),T(`${hx}+${hy}`,PU(1,1,0)[0]+14,PU(1,1,0)[1]+10,{size:32,anchor:'start'}));
  s+=V3(PU,[0,0,0],[0,0,1],{color:HZ,w:8,head:22,g:seg(p,.6,.75)})+fade(seg(p,.65,.8),T(hz,PU(0,0,1)[0]-26,PU(0,0,1)[1]+14,{size:40}));
  s+=card(680,120,470,200,T(`(${hx}+${hy})\\times${hz}`,915,200,{size:50})+label('＝ ？',915,280,{size:34,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.15),C.hi);
  return s;
 },
 [K+'ex1']:(p)=>{
  let s=T(`(${hx}+${hy})\\times${hz}`,600,150,{size:56});
  s+=fade(seg(p,.1,.35),T(`=${hx}\\times${hz}\\ +\\ ${hy}\\times${hz}`,600,280,{size:56}));
  s+=fade(seg(p,.5,.7),label('2つの 外積の 和',600,400,{size:30,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'ex2']:(p)=>{
  let s=cycle(210,300,{R:95});
  s+=T('=',540,150,{size:46})+T(`${hx}\\times${hz}`,650,150,{size:46})+T('+',770,150,{size:46})+T(`${hy}\\times${hz}`,890,150,{size:46});
  s+=fade(seg(p,.1,.3),label('逆向き',650,230,{size:26,color:NG,anchor:'middle',weight:700})+T(`-${hy}`,650,295,{size:48}));
  s+=fade(seg(p,.55,.75),label('矢印の向き',890,230,{size:26,color:C.hi,anchor:'middle',weight:700})+T(`+\\,${hx}`,890,295,{size:48}));
  s+=fade(seg(p,.8,.95),T(`=-${hy}+${hx}`,760,420,{size:48}));
  return s;
 },
 [K+'ex3']:(p)=>{
  let s=floor(PU)+axes3(PU);
  s+=V3(PU,[0,0,0],[1,1,0],{color:CQ,w:6,head:18,opacity:.8})+T(`${hx}+${hy}`,PU(1,1,0)[0]+14,PU(1,1,0)[1]+10,{size:30,anchor:'start'});
  s+=V3(PU,[0,0,0],[0,0,1],{color:HZ,w:6,head:18,opacity:.8})+T(hz,PU(0,0,1)[0]-26,PU(0,0,1)[1]+14,{size:38});
  s+=fade(seg(p,.25,.45),L3(PU,[1,0,0],[1,-1,0],{color:C.dim,w:2,dash:'5 6'})+L3(PU,[0,-1,0],[1,-1,0],{color:C.dim,w:2,dash:'5 6'})+V3(PU,[0,0,0],[0,-1,0],{color:HY,w:4,head:14})+T(`-${hy}`,PU(0,-1,0)[0]-14,PU(0,-1,0)[1]+14,{size:30,anchor:'end'}));
  s+=V3(PU,[0,0,0],[1,-1,0],{color:CN,w:8,head:22,g:seg(p,.1,.35)})+fade(seg(p,.3,.45),T(`${hx}-${hy}`,PU(1,-1,0)[0]+14,PU(1,-1,0)[1]+16,{size:34,anchor:'start'}));
  s+=card(680,110,470,280,T(`(${hx}+${hy})\\times${hz}`,915,180,{size:40})+T(`=${hx}-${hy}`,915,260,{size:50})
   +fade(seg(p,.4,.55),label('右へ1、手前へ1',915,345,{size:28,color:C.ink,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'check']:(p)=>{
  let s=card(150,90,900,330,label('内積で 確かめる',600,145,{size:28,color:C.dim,anchor:'middle'})
   +T(`(${hx}+${hy})\\cdot(${hx}-${hy})`,600,225,{size:48})
   +fade(seg(p,.25,.45),T(`=1\\times1+1\\times(-1)+0\\times0=1-1=0`,600,305,{size:40}))
   +fade(seg(p,.6,.75),label('→ 元の 斜めの矢印に 垂直',600,385,{size:30,color:C.F,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'check2']:(p)=>{
  let s=card(100,90,470,300,label('外積の 大きさ',335,145,{size:28,color:C.dim,anchor:'middle'})+T(`\\sqrt{2}\\times1\\times\\sin90^\\circ=\\sqrt{2}`,335,240,{size:36}),seg(p,0,.15));
  s+=card(630,90,470,300,label('答えの 長さ',865,145,{size:28,color:C.dim,anchor:'middle'})+T(`|${hx}-${hy}|=\\sqrt{1+1}=\\sqrt{2}`,865,240,{size:36}),seg(p,.2,.35));
  s+=fade(seg(p,.4,.55),check(600,245,20));
  s+=fade(seg(p,.6,.75),label('右ねじなしで、表だけで 答え',600,460,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S4 トルクの向き =====
 ...(()=>{
  const rows=[['トルク',`${bN}=${br}\\times${bF}`],['角運動量',`${bL}=${br}\\times${bp}`],['磁気力',`${bF}=q\\,${bv}\\times${bB}`]];
  function three(p,hl=-1,gAll=null){
   let s=label('左の矢印 × 右の矢印 ＝ 答え',600,80,{size:28,color:C.dim,anchor:'middle'});
   rows.forEach(([t,f],i)=>{const g=gAll??seg(p,.1+i*.15,.25+i*.15),y=170+i*105;
    s+=fade(g,rect(180,y-45,840,90,{fill:'#131f38',fo:.96,stroke:i===hl?C.hi:C.faint,sw:i===hl?3:2,rx:14})+label(`${i+1}．${t}`,220,y+10,{size:30,color:i===hl?C.hi:C.ink,weight:700})+T(f,760,y,{size:46}));});
   return s;
  }
  return {[K+'three']:(p)=>three(p),[K+'torque']:(p)=>three(p,0,1)+fade(seg(p,.4,.55),label('𝐫：回転の軸 → 力を加える点',600,490,{size:28,color:CR,anchor:'middle',weight:700})),
   [K+'L']:(p)=>three(p,1,1)+fade(seg(p,.3,.45),label('𝐩：運動量 → 回転の勢い（角運動量の単元で）',600,490,{size:28,color:C.p,anchor:'middle',weight:700})),
   [K+'mag']:(p)=>three(p,2,1)+fade(seg(p,.4,.55),label('𝐯：速度　𝐁：磁場　q：電荷',600,490,{size:28,color:C.ink,anchor:'middle',weight:700}))};
 })(),
 [K+'door']:(p)=>{
  let s=doorScene(p,{gr:seg(p,.3,.5),gF:seg(p,.55,.75)});
  s+=card(700,110,450,280,label('蝶番の軸 ＝ z 軸',925,170,{size:28,color:C.ink,anchor:'middle'})
   +fade(seg(p,.3,.45),T(`${br}=0.5\\,${hx}\\ \\mathrm{m}`,925,250,{size:40}))
   +fade(seg(p,.55,.7),T(`${bF}=4\\,${hy}\\ \\mathrm{N}`,925,330,{size:40})),seg(p,0,.12));
  return s;
 },
 [K+'door2']:(p)=>{
  let s=doorScene(p,{gN:seg(p,.55,.75),labN:`2\\,${hz}`});
  s+=card(640,100,520,320,T(`${bN}=0.5\\times4\\times(${hx}\\times${hy})`,900,170,{size:36})
   +fade(seg(p,.35,.5),label('表から',900,245,{size:26,color:C.dim,anchor:'middle'}))
   +fade(seg(p,.5,.65),T(`${bN}=2\\,${hz}\\ \\mathrm{N\\cdot m}`,900,320,{size:48})),seg(p,0,.12));
  return s;
 },
 [K+'door3']:(p)=>{
  const ang=35*seg(p,.35,.8);
  let s=doorScene(p,{gN:1,labN:`2\\,${hz}`,ang,gr:1,gF:1});
  // top view: door opening counterclockwise
  const cx=920,cy=320;
  let t=rect(cx-190,cy-190,380,300,{fill:'#131f38',fo:.96,stroke:C.faint,sw:2,rx:14})+label('真上から 見ると',cx,cy-155,{size:22,color:C.dim,anchor:'middle'});
  const hx0=cx-110,hy0=cy+40,Ld=200,a=ang*RAD;
  t+=line(hx0,hy0,hx0+Ld,hy0,{color:C.faint,w:3,dash:'6 6'})+line(hx0,hy0,hx0+Ld*Math.cos(a),hy0-Ld*Math.sin(a),{color:C.ink,w:9});
  t+=outSym(hx0,hy0,15)+arc2(circPts(hx0,hy0,Ld*.75,.1,.1+.6*seg(p,.35,.8),24),{c1:CN,c2:CN,w:4,g:seg(p,.35,.4)});
  t+=label('反時計回りに 開く',cx+30,cy+95,{size:26,color:C.hi,anchor:'middle',weight:700});
  s+=fade(seg(p,.1,.25),t);
  return s;
 },
 [K+'forder']:(p)=>{
  let s=card(80,110,500,280,T(`${br}\\times${bF}=2\\,${hz}`,330,210,{size:46})+check(330,300,22),seg(p,0,.12));
  s+=card(620,110,500,280,T(`${bF}\\times${br}=-2\\,${hz}`,870,210,{size:46})+label('回る向きが 逆',870,300,{size:30,color:NG,anchor:'middle',weight:700}),seg(p,.1,.25),NG);
  s+=fade(seg(p,.6,.75),label('𝐫 が先、𝐅 が後',600,460,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ===== S5 磁気力 =====
 [K+'magnum']:(p)=>{
  let s=magScene(p,{gv:seg(p,.3,.5),gB:seg(p,.55,.75)});
  s+=card(700,100,460,320,label('負の電荷',930,160,{size:28,color:EL,anchor:'middle',weight:700})+T(`q=-1\\ \\mathrm{C}`,930,225,{size:38})
   +fade(seg(p,.3,.45),T(`${bv}=3\\,${hx}\\ \\mathrm{m/s}`,930,295,{size:38}))
   +fade(seg(p,.55,.7),T(`${bB}=2\\,${hy}\\ \\mathrm{T}`,930,365,{size:38})),seg(p,0,.12));
  return s;
 },
 [K+'predict2']:(p)=>{
  let s=magScene(p,{pred:seg(p,.1,.3)});
  s+=card(700,140,460,220,label('負の電荷は',930,210,{size:30,color:EL,anchor:'middle'})+label('上？ 下？',930,280,{size:38,color:C.hi,anchor:'middle',weight:700})+label('予想してみよう',930,330,{size:24,color:C.dim,anchor:'middle'}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'step1']:(p)=>{
  let s=magScene(p,{gX:seg(p,.45,.65)});
  s+=card(690,100,470,320,label('① まず 外積だけ（符号は後）',925,160,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.2,.35),TF(`${bv}\\times${bB}=3\\times2\\times(${hx}\\times${hy})`,925,240,440,36))
   +fade(seg(p,.5,.65),T(`=6\\,${hz}`,925,315,{size:46}))+fade(seg(p,.6,.75),label('上向き',925,385,{size:28,color:CN,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'step2']:(p)=>{
  let s=magScene(p,{gX:1-seg(p,.3,.5)*.6,gF:seg(p,.35,.6)});
  s+=card(690,100,470,320,label('② 電荷 q ＝ −1 C を 掛ける',925,160,{size:26,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.15,.3),TF(`${bF}=-1\\times6\\,${hz}=-6\\,${hz}\\ \\mathrm{N}`,925,245,440,40))
   +fade(seg(p,.55,.7),label('負の電荷：下向きに 反転',925,335,{size:30,color:EL,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 [K+'unit']:(p)=>{
  let s=card(150,100,900,300,label('単位',600,155,{size:28,color:C.dim,anchor:'middle'})
   +T(`\\mathrm{C}\\times\\mathrm{m/s}\\times\\mathrm{T}\\ \\to\\ \\mathrm{N}`,600,240,{size:48})
   +fade(seg(p,.4,.55),T(`1\\ \\mathrm{T}=1\\ \\mathrm{N/(A\\cdot m)}`,600,320,{size:40,color:CB}))
   +fade(seg(p,.55,.7),label('（確かめは ローレンツ力の 単元で）',600,375,{size:24,color:C.dim,anchor:'middle'})),seg(p,0,.12));
  return s;
 },
 [K+'plus']:(p)=>{
  const P1=view({ox:170,oy:270,u:85}),P2=view({ox:740,oy:270,u:85});
  const mini=(P,q,g)=>{let s=V3(P,[0,0,0],[1.4,0,0],{color:CV,w:6,head:18})+V3(P,[-.5,-.3,.5],[-.5,1.3,.5],{color:CB,w:3,head:12})+V3(P,[-.5,-.3,-.5],[-.5,1.3,-.5],{color:CB,w:3,head:12})+T(bv,P(1.4,0,0)[0]+22,P(1.4,0,0)[1]+10,{size:32,anchor:'start'})+T(bB,P(-.5,-.3,-.5)[0]-10,P(-.5,-.3,-.5)[1]+10,{size:32,anchor:'end'});
   const d=q<0?-1:1;s+=fade(g,V3(P,[0,0,0],[0,0,1.6*d],{color:CF,w:8,head:22})+T(`${d<0?'-':'+'}6\\,${hz}\\ \\mathrm{N}`,P(0,0,1.6*d)[0]+20,P(0,0,1.6*d)[1]+(d>0?20:0),{size:32,anchor:'start'}));
   s+=ring(P(0,0,0)[0],P(0,0,0)[1],17,{color:q<0?EL:PO,w:3,fill:'#1b2338'})+label(q<0?'−':'+',P(0,0,0)[0],P(0,0,0)[1]+9,{size:28,color:q<0?EL:PO,anchor:'middle',weight:700});return s;};
  let s=mini(P1,-1,1)+label('負の電荷 q ＝ −1 C',300,480,{size:28,color:EL,anchor:'middle',weight:700});
  s+=fade(seg(p,.05,.2),mini(P2,1,seg(p,.2,.4))+label('正の電荷 q ＝ +1 C',870,480,{size:28,color:PO,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('符号だけで 逆',600,90,{size:32,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'perp']:(p)=>{
  let s=magScene(p,{gF:1,perp:seg(p,.1,.3)});
  s+=card(700,110,460,300,label('力 ⊥ 速度',930,170,{size:32,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,.25,.4),T(`${bF}\\cdot${bv}=0`,930,245,{size:44}))
   +fade(seg(p,.45,.6),label('仕事 0：速さは 変わらない',930,320,{size:26,color:C.F,anchor:'middle',weight:700}))
   +fade(seg(p,.65,.8),label('向きだけ 曲がる',930,370,{size:26,color:C.hi,anchor:'middle',weight:700})),seg(p,0,.12));
  return s;
 },
 // ===== S6 まとめと次の問い =====
 [K+'sum1']:(p)=>{
  let s=cycle(250,280,{R:105});
  s+=table3(560,150,{cw:120,rh:70,hlDiag:1,title:'外積の表'});
  return s;
 },
 [K+'sum2']:(p)=>{
  const rows=[['表 ＋ 分配法則 → 右ねじなしで 計算',C.ink],['トルク：𝐫 が先、𝐅 が後',CN],['磁気力：外積の後に q の符号',C.F]];
  let s=label('まとめ',600,90,{size:28,color:C.dim,anchor:'middle'});
  rows.forEach(([t,c],i)=>{s+=card(200,120+i*110,800,86,label(t,600,173+i*110,{size:30,color:c,anchor:'middle',weight:700}),seg(p,.05+i*.25,.2+i*.25));});
  return s;
 },
 [K+'next']:(p)=>{
  const ox=120,oy=440,W=440,Hh=300,X=t=>ox+W*t/4,Y=v=>oy-Hh*v/110;
  let s=arrow(ox-10,oy,ox+W+30,oy,{color:C.dim,w:2.5,head:14})+arrow(ox,oy+10,ox,oy-Hh-30,{color:C.dim,w:2.5,head:14});
  s+=label('時刻',ox+W+20,oy+34,{size:24,color:C.t,anchor:'middle'})+label('量',ox,oy-Hh-44,{size:24,color:C.E,anchor:'middle'});
  const pts=Array.from({length:81},(_,i)=>{const t=4*i/80;return [X(t),Y(100*Math.exp(-.45*t))];});
  s+=draw(pts,seg(p,.1,.5),{color:C.E,w:4});
  for(let k=0;k<4;k++){const t=k,v=100*Math.exp(-.45*t);s+=fade(seg(p,.2+k*.07,.27+k*.07),dot(X(t),Y(v),7,C.hi));}
  s+=card(640,110,520,270,label('次の問い',900,165,{size:26,color:C.dim,anchor:'middle'})+label('減り方は 今の量に 比例',900,235,{size:30,color:C.ink,anchor:'middle'})
   +label('一歩ずつ 刻んで 求めるには？',900,305,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.3,.5),C.hi);
  return s;
 },
};
