// 問題編 大学 07 外積（中級 q-um-cross-product・上級 q-um-cross）の図で共通に使う部品。
// 名前が -diagrams.mjs で終わらないので自動読み込みの対象外（図のキーは持たない）。この2問の担当だけが使う。
// 軸：x 右、y 奥（斜め右上に描く）、z 上（右手系の斜投影）。軸の先に x・y・z の札を常に出す。
import {C,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly} from './anim.mjs';

export const RAD=Math.PI/180;
export const T=(s,x,y,size=40,o={})=>tex(s,x,y,{size,auto:false,...o});
export const cs=(c,s)=>`{\\color{${c}}{${s}}}`;
export const hx='\\hat{x}',hy='\\hat{y}',hz='\\hat{z}';
// 斜投影
export function view({ox,oy,u,ky=.6,ay=40*RAD}){return (x,y,z)=>[ox+u*(x+ky*Math.cos(ay)*y),oy-u*(z+ky*Math.sin(ay)*y)];}
export const V3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return arrow(A[0],A[1],B[0],B[1],o);};
export const L3=(P,a,b,o={})=>{const A=P(...a),B=P(...b);return line(A[0],A[1],B[0],B[1],o);};
export function axes3(P,{xl=1.8,yl=2.2,zl=1.7,xn=.4,yn=.5,zn=.5,g=1}={}){
 let s=L3(P,[-xn,0,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,-yn,0],[0,0,0],{color:C.faint,w:2,dash:'5 6'})+L3(P,[0,0,-zn],[0,0,0],{color:C.faint,w:2,dash:'5 6'});
 s+=V3(P,[0,0,0],[xl,0,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,yl,0],{color:C.dim,w:2.5,head:13})+V3(P,[0,0,0],[0,0,zl],{color:C.dim,w:2.5,head:13});
 const X=P(xl,0,0),Y=P(0,yl,0),Z=P(0,0,zl);
 s+=label('x',X[0]+10,X[1]+9,{size:28,color:C.ink,weight:700})+label('y',Y[0]+8,Y[1]-4,{size:28,color:C.ink,weight:700})+label('z',Z[0]+12,Z[1]+8,{size:28,color:C.ink,weight:700});
 return fade(g,s);
}
// 各軸の向きの長さ1の矢印 x̂・ŷ・ẑ（白）
export function hats3(P,{g=1,len=1}={}){
 const X=P(len,0,0),Y=P(0,len,0),Z=P(0,0,len);
 let s=V3(P,[0,0,0],[len,0,0],{color:C.ink,w:5,head:16})+V3(P,[0,0,0],[0,len,0],{color:C.ink,w:5,head:16})+V3(P,[0,0,0],[0,0,len],{color:C.ink,w:5,head:16});
 s+=T(hx,X[0]-4,X[1]+38,32)+T(hy,Y[0]+22,Y[1]+20,32)+T(hz,Z[0]-24,Z[1]+12,32);
 return fade(g,s);
}
// 巡回の円：x（上）→ y（右下）→ z（左下）→ x。画面上で時計回りが「円の向き」。
const POS={x:90,y:-30,z:210};
function arcPts(cx,cy,R,a0,a1,n=24){return Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return [cx+R*Math.cos(a),cy-R*Math.sin(a)];});}
function headAt(pts,color,h=14){const n=pts.length,[x2,y2]=pts[n-1],[x1,y1]=pts[n-2],a=Math.atan2(y2-y1,x2-x1);
 return `<polygon points="${x2+Math.cos(a)*4},${y2+Math.sin(a)*4} ${x2-h*Math.cos(a)+h*.55*Math.sin(a)},${y2-h*Math.sin(a)-h*.55*Math.cos(a)} ${x2-h*Math.cos(a)-h*.55*Math.sin(a)},${y2-h*Math.sin(a)+h*.55*Math.cos(a)}" fill="${color}"/>`;}
// 円の上を a から b へ（dir＝+1：円の向き、−1：逆向き）。g で途中まで描く
export function cyclePath(cx,cy,R,a,b,dir,{color=C.ink,w=5,g=1,pad=.36}={}){
 if(g<=.001)return '';
 let a0=POS[a]*RAD,a1=POS[b]*RAD;
 if(dir>0){while(a1>=a0)a1-=2*Math.PI;}else{while(a1<=a0)a1+=2*Math.PI;}
 const sgn=dir>0?-1:1;a0+=sgn*pad;a1-=sgn*pad;a1=a0+(a1-a0)*g;
 const pts=arcPts(cx,cy,R,a0,a1);
 return draw(pts.slice(0,-1),1,{color,w})+headAt(pts,color,w*3);
}
export function cycle(cx,cy,{R=55,g=1,node=22,size=26,note=false,plus=true}={}){
 let s='';
 for(const [a,b] of [['x','y'],['y','z'],['z','x']])s+=cyclePath(cx,cy,R,a,b,1,{color:C.dim,w:2.5});
 for(const k of ['x','y','z']){const a=POS[k]*RAD,x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);s+=ring(x,y,node,{color:C.ink,w:2.5,fill:'#131f38'})+T(`\\hat{${k}}`,x,y+size*.32,size);}
 if(plus)s+=label('＋',cx,cy+10,{size:26,color:C.dim,anchor:'middle',weight:700});
 if(note)s+=label('円の向き ＝ ＋、逆 ＝ −',cx,cy+R+node+30,{size:22,color:C.dim,anchor:'middle'});
 return fade(g,s);
}
// 3×3 の表（基本の向きどうしの外積）。hl＝[['y','x'],…] 光らせるマス
const TAB={x:{x:'0',y:hz,z:`-${hz}`},y:{x:`-${hz}`,y:'0',z:hx},z:{x:hy,y:`-${hx}`,z:'0'}};
export function table3(x0,y0,{cw=86,rh=46,g=1,hl=[],hlG=1,size=26,hlColor=C.hi}={}){
 const ks=['x','y','z'];
 let s=T('\\times',x0+cw*.5,y0+8,size,{color:C.dim});
 ks.forEach((k,j)=>{s+=T(`\\hat{${k}}`,x0+cw*(j+1.5),y0+8,size,{color:C.dim});s+=T(`\\hat{${k}}`,x0+cw*.5,y0+rh*(j+1)+8,size,{color:C.dim});});
 s+=line(x0+8,y0+rh*.5,x0+cw*4,y0+rh*.5,{color:C.faint,w:2})+line(x0+cw,y0-rh*.5+6,x0+cw,y0+rh*3.5,{color:C.faint,w:2});
 ks.forEach((r,i)=>ks.forEach((c,j)=>{const cx=x0+cw*(j+1.5),cy=y0+rh*(i+1)+8,on=hl.some(([a,b])=>a===r&&b===c);
  if(on)s+=fade(hlG,rect(cx-cw/2+5,cy-rh/2-8,cw-10,rh-4,{fill:hlColor,fo:.18,stroke:hlColor,sw:2.5,rx:8}));
  s+=T(TAB[r][c],cx,cy,size,{color:TAB[r][c]==='0'?C.faint:C.ink});}));
 return fade(g,s);
}
// 表のマスの中心（線を引くとき）
export const cellXY=(x0,y0,r,c,{cw=86,rh=46}={})=>[x0+cw*(['x','y','z'].indexOf(c)+1.5),y0+rh*(['x','y','z'].indexOf(r)+1)];
// 粒子（負電荷：青の玉に −）
export const EL='#7fb2ff';
export function ball(x,y,{r=17,g=1}={}){return fade(g,ring(x,y,r,{color:EL,w:3,fill:'#1b2a4a'})+label('−',x,y+9,{size:28,color:EL,anchor:'middle',weight:700}));}
// 場面の札（左上の「求めるもの」の下）
export function sceneTag(text,{g=1,x=10,y=78,size=24}={}){
 let w=0;for(const ch of text)w+=ch===' '?.34:/[!-~]/.test(ch)?.64:1.02;w=w*size+28;
 return fade(g,rect(x,y,w,size+18,{fill:'#1d2a44',fo:.95,stroke:C.dim,sw:2,rx:8})+label(text,x+14,y+size+4,{size,color:C.ink,weight:700}));
}
// 誤答カード（値に TeX を使う版。見た目は yt1-qx-common.mjs の wrongCard と同じ）
export function wrongCardT(letter,valTex,why,{g=1,x=150,y=345,w=900,size=28,whySize=24}={}){
 const rows=[].concat(why??[]),h=size+30+rows.length*(whySize+12)+10;
 const head=`誤答 ${letter}：`;
 let tw=0;for(const ch of head)tw+=ch===' '?.34:/[!-~]/.test(ch)?.64:1.02;tw*=size;
 const vw=texWidth(valTex,size*1.05,false),hx0=x+w/2-(tw+vw+size*1.1)/2;
 let s=rect(x,y,w,h,{fill:'#1f1622',fo:.96,stroke:'#8a4a55',sw:2.5,rx:12});
 s+=label('×',hx0,y+size+12,{size:size*1.1,color:'#ff6b6b',weight:700})+label(head,hx0+size*1.1,y+size+12,{size,color:'#c9d2e0',weight:700});
 s+=T(valTex,hx0+size*1.1+tw,y+size+12-size*.36,size*1.05,{anchor:'start',color:'#c9d2e0'});
 rows.forEach((r,i)=>{s+=label(r,x+w/2,y+size+24+(i+1)*(whySize+12)-4,{size:whySize,color:C.dim,anchor:'middle'});});
 return fade(g,s);
}
