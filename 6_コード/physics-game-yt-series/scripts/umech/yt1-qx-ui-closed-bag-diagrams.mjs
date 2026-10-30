// 問題編 解説「斜めの面と、電荷の入った袋」（q-ui-closed-bag、大学編 21 ガウスの法則・初級）— 図。Stage 1200×515.
// 正本：~/Downloads/physics-quest-問題編_制作用台本_最終_2026-10-08/大学編/21_ガウスの法則.md の q-ui-closed-bag（解説 20 行）。
// 色（正本の約束）：電場 𝐄・電気力線 水色、法線 𝐧 桃、面積 金、電気束 Φ・強調・+1 黄、−1・誤り 赤、正電荷 赤、負電荷 青。
//   行8 の「矢印の足し算」だけは、正の電荷の分を薄い赤、負の電荷の分を薄い青、足した矢印を水色で描き、凡例を出す。
// 札（求めるもの 左上・答え 右上・誤答カード）は yt1-qx-common.mjs。札の帯（y＜78）には図を描かない。
// 元の単元動画 ys-ui-closed-bag-1 の部品（電荷・袋の描き方）を import して使う（あちらは編集しない）。
// 袋は断面（2D）。電荷ごとの線は、その電荷1つだけの電場の線（放射状の直線）。貫く点と符号は多角形との交点から計算する。
// 袋の上の矢印・袋の中でつながる線は、6つの点電荷（3D のクーロン場、1/r²）を足した電場から計算する（決めつけて描かない）。
import {C,mix,seg,fade,label,line,rect,dot,ring,draw,arrow} from './anim.mjs';
import {card,goalTag,answerTag,answerRow,wrongCard,legend,sentWin,cueT,voiceEnd,isProblem} from './yt1-qx-common.mjs';
import {EC,NC,HI,NEGV,cs,T,charge,toS,closedPath} from './yt1-ui-closed-bag-1-diagrams.mjs';

const K='qx-ui-closed-bag:';
const rad=d=>d*Math.PI/180;
const AREA='#ffcf67';// 面積 金
const BAD='#ff6b6b';
const OKC=C.F;
const POSC='#ff8f9b',NEGC='#7fb3ff';// 薄い赤（正の電荷から）・薄い青（負の電荷から）
const G1='面を貫く 電気束 Φ',G2='出る本数 − 入る本数',G3='中の電荷を動かすと、何が変わるか';
const ANS1=g=>answerTag(1,'B','10 N·m²/C',{g}),ANS2=g=>answerTag(2,'D','+12 本',{g}),ANS3=g=>answerTag(3,'A','',{g});
const blink=ctx=>.5+.5*Math.sin(cueT(ctx)*7);

// 文の中を「、」で区切った区間。groups＝[1,2] なら、最初の1句と、残り2句。
function clauseWin(ctx,si,groups){
 const W=sentWin(ctx),[a,b]=W[si]??[0,1];
 const r=(ctx?.cue?.reading??'').split('。').map(x=>x.replace(/\s/g,'')).filter(Boolean)[si]??'';
 const parts=r.split('、').map(x=>Math.max(1,x.length));
 const tot=parts.reduce((x,y)=>x+y,0);let acc=0,k=0;const out=[];
 for(const n of groups){const s0=acc;for(let j=0;j<n&&k<parts.length;j++,k++)acc+=parts[k];out.push([a+(b-a)*s0/tot,a+(b-a)*acc/tot]);}
 out[out.length-1][1]=Math.max(out[out.length-1][1],1);
 return out;
}
const inWin=(p,[a,b],last=false)=>seg(p,a+.005,a+.04)*(last?1:1-seg(p,b-.03,b));

// ===================== 前半：1枚の斜めの面（真横から見た図） =====================
const F0={cx:300,cy:320,U:40};// U px per N/C
const NDEG=60;// 法線の向き（右から反時計回り）
const PX=690,PW=490,PC=PX+PW/2;
const panel=(y,h,inner,g=1,stroke=C.faint)=>card(PX,y,PW,h,inner,g,stroke);
const WOPT={x:PX,w:PW,size:26,whySize:22};
const ROWS=[150,215,280,345,410,475];
function fieldRows(g=1,op=.55,flow=null){
 let s='';
 for(const y of ROWS)for(let x=30;x+60<=640;x+=120){const a=flow===null?1:seg(flow,x/640*.55,x/640*.55+.3);s+=fade(a,arrow(x,y,x+60,y,{color:EC,w:4,head:13}));}
 return fade(g*op,s);
}
function face(g=1){
 const {cx,cy}=F0,L=260,tx=Math.cos(rad(NDEG+90)),ty=Math.sin(rad(NDEG+90));
 return fade(g,line(cx-tx*L/2,cy+ty*L/2,cx+tx*L/2,cy-ty*L/2,{color:'#c9d6ee',w:10}));
}
function normal(g=1,{len=130,txt=true}={}){
 const {cx,cy}=F0,X=cx+len*Math.cos(rad(NDEG)),Y=cy-len*Math.sin(rad(NDEG));
 return fade(g,arrow(cx,cy,X,Y,{color:NC,w:6,head:18})+(txt?label('法線',X+12,Y-6,{size:26,color:NC,weight:700}):''));
}
function normalGuide(g=1){
 const {cx,cy}=F0,a=rad(NDEG);
 return fade(g,line(cx-60*Math.cos(a),cy+60*Math.sin(a),cx+200*Math.cos(a),cy-200*Math.sin(a),{color:NC,w:2,dash:'4 8',opacity:.7}));
}
function arc(cx,cy,r,a0,a1,{color=C.ink,w=3,g=1}={}){
 const pts=Array.from({length:25},(_,i)=>{const a=rad(mix(a0,a1,i/24));return [cx+r*Math.cos(a),cy-r*Math.sin(a)];});
 return draw(pts,g,{color,w});
}
function eArrow(g=1,{lbl='4 N/C',color=EC}={}){
 const {cx,cy,U}=F0;
 return fade(g,arrow(cx,cy,cx+4*U,cy,{color,w:7,head:20})+(lbl?label(lbl,cx+4*U+12,cy+10,{size:26,color,weight:700}):''));
}
function shadow(g=1,{lbl='',draw_=1}={}){
 const {cx,cy,U}=F0,a=rad(NDEG),par=4*U*Math.cos(a),px=cx+par*Math.cos(a),py=cy-par*Math.sin(a);
 const u=draw_,ex=mix(cx,px,u),ey=mix(cy,py,u);
 return fade(g,line(cx+4*U,cy,px,py,{color:HI,w:2,dash:'6 6'})+(u>.01?line(cx,cy,ex,ey,{color:HI,w:11,cap:'butt'}):'')
  +(lbl?label(lbl,px-16,py-6,{size:28,color:HI,anchor:'end',weight:700}):''));
}
const sideTitle=(g=1)=>fade(g,label('真横から 見た図（面は 線に 見える）',30,110,{size:24,color:C.dim}));
const areaTag=(g=1,txt='面積 5 m²')=>fade(g,rect(F0.cx-285,F0.cy+116,260,50,{fill:C.bg,fo:.95,stroke:'none',rx:8})+label(txt,F0.cx-155,F0.cy+150,{size:28,color:AREA,anchor:'middle',weight:700}));
const ang60=(g=1,{color=C.ink,txt='60°'}={})=>fade(g,arc(F0.cx,F0.cy,58,0,NDEG,{color,w:3})+label(txt,F0.cx+66,F0.cy-26,{size:28,color,weight:700}));
const okMark=(x,y,s=38)=>label('○',x,y,{size:s,color:OKC,anchor:'middle',weight:700});
const ngMark=(x,y,s=44)=>label('×',x,y,{size:s,color:BAD,anchor:'middle',weight:700});
// 前半の図（面・法線・電場）。opts でどこまで描くか
function front({rows=1,rowOp=.5,faceG=1,area=1,areaTxt,guide=1,nrm=1,nTxt=false,eG=1,eLbl='4 N/C',a60=1,flow=null}={}){
 return sideTitle()+fieldRows(rows,rowOp,flow)+face(faceG)+areaTag(area,areaTxt)+normalGuide(guide)+normal(nrm,{txt:nTxt})+eArrow(eG,{lbl:eLbl})+(a60?ang60(a60):'');
}

// ===================== 後半：くねった袋 =====================
const BG={cx:400,cy:312};
const QX2=790,QW2=380,QC2=QX2+QW2/2;
const panel2=(y,h,inner,g=1,stroke=C.faint)=>card(QX2,y,QW2,h,inner,g,stroke);
function area2(P){let a=0;for(let i=0;i<P.length;i++){const [x1,y1]=P[i],[x2,y2]=P[(i+1)%P.length];a+=x1*y2-x2*y1;}return a;}
const ccw=P=>area2(P)>0?P:[...P].reverse();
// 上から入り江（くぼみ）のある袋（math coords, y up）
export const BAG=ccw([[-200,-60],[-170,-150],[-60,-185],[70,-170],[180,-120],[215,-10],[200,90],[150,160],[100,190],[68,150],[52,62],[22,42],[-8,62],[-18,150],[-42,190],[-120,178],[-190,112],[-215,30]]);
// 電荷（math coords）。中：正3・負1、外：正2。
export const Q={p1:[-125,70],p2:[-115,-85],p3:[105,-75],n:[10,-35],o1:[-330,150],o2:[300,-175]};
export const P3MOVED=[160,-80];// 小問3：p3 を袋の右の縁の近くへ（中に残す）
export const O1MOVED=[-275,10];// 補足：外の電荷を動かす（外に残す）
// intersections of the ray o + s·u (0<s<L) with polygon P; sign = sign(u·outward normal)
function crossings(P,[ox,oy],[ux,uy],L){
 const out=[];
 for(let i=0;i<P.length;i++){const [ax,ay]=P[i],[bx,by]=P[(i+1)%P.length],dx=bx-ax,dy=by-ay;
  const den=ux*dy-uy*dx;if(Math.abs(den)<1e-9)continue;
  const s=((ax-ox)*dy-(ay-oy)*dx)/den,t=((ax-ox)*uy-(ay-oy)*ux)/den;
  if(s>1e-6&&s<L&&t>=0&&t<1){const nx=dy,ny=-dx,nl=Math.hypot(nx,ny);out.push({s,x:ox+s*ux,y:oy+s*uy,sign:Math.sign(ux*nx+uy*ny),n:[nx/nl,ny/nl]});}
 }
 return out.sort((a,b)=>a.s-b.s);
}
const ROT={p1:rad(12),p2:rad(10),p3:rad(40),n:rad(15),o1:rad(-20),o2:rad(160)};
const NL=6,RL=900;
function rays(key){const q=Q[key];return Array.from({length:NL},(_,i)=>{const a=ROT[key]+2*Math.PI*i/NL;return {i,u:[Math.cos(a),Math.sin(a)],q};});}
// その電荷1つだけの線（放射状の直線）
function ownLines(key,sign,{g=1,hl=-1,op=.95,r0=26}={}){
 const S=toS(BG.cx,BG.cy);let s='';
 for(const {i,u,q} of rays(key)){
  const [x0,y0]=S([q[0]+r0*u[0],q[1]+r0*u[1]]),[x1,y1]=S([q[0]+RL*u[0],q[1]+RL*u[1]]);const col=i===hl?HI:EC,w=i===hl?5:3;
  s+=line(x0,y0,x1,y1,{color:col,w,opacity:op});
  for(const m of [70,175]){const a1=sign>0?m-16:m+16,a2=sign>0?m+16:m-16;const [hx,hy]=S([q[0]+a1*u[0],q[1]+a1*u[1]]),[HX,HY]=S([q[0]+a2*u[0],q[1]+a2*u[1]]);s+=arrow(hx,hy,HX,HY,{color:col,w,head:14});}
 }
 return fade(g,s);
}
export function tally(key,sign){let t=0;const per=[];for(const {i,u,q} of rays(key)){const c=crossings(BAG,q,u,RL);const v=c.reduce((a,x)=>a+x.sign*sign,0);per.push({i,c,v});t+=v;}return {t,per};}
function marks(key,sign,{g=1,labels=true,only=null,big=false}={}){
 const S=toS(BG.cx,BG.cy);let s='';
 for(const {i,c} of tally(key,sign).per){if(only&&!only.includes(i))continue;
  for(const x of c){const v=x.sign*sign,[X,Y]=S([x.x,x.y]);s+=dot(X,Y,big?9:7,v>0?HI:NEGV);
   if(labels){const off=34,lx=big?X:X+x.n[0]*off,ly=big?Y-22:Y-x.n[1]*off+9;
    s+=label(v>0?'+1':'−1',lx,ly,{size:big?32:24,color:v>0?HI:NEGV,anchor:'middle',weight:700});}}
 }
 return fade(g,s);
}
const bagShape=(o={})=>closedPath(BAG,BG.cx,BG.cy,{w:4,fo:.06,...o});
function charges({g=1,dim=null,pos={},only=null,r=22}={}){
 const S=toS(BG.cx,BG.cy);let s='';
 for(const k of ['p1','p2','p3','n','o1','o2']){if(only&&!only.includes(k))continue;const q=pos[k]??Q[k];const [x,y]=S(q);
  const o=dim&&dim.includes(k)?.3:1;s+=fade(o,charge(x,y,k==='n'?-1:1,r));}
 return fade(g,s);
}
function outTags(g=1,pos={}){
 const S=toS(BG.cx,BG.cy);let s='';
 for(const k of ['o1','o2']){const [x,y]=S(pos[k]??Q[k]);s+=label('外',x+36,y-22,{size:24,color:C.dim,anchor:'middle',weight:700});}
 return fade(g,s);
}
// n points spaced evenly along the bag perimeter, with outward normals (math coords)
function perim(n){
 const P=BAG,L=[];let tot=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];const d=Math.hypot(b[0]-a[0],b[1]-a[1]);L.push(d);tot+=d;}
 const out=[];for(let j=0;j<n;j++){let want=tot*(j+.5)/n,i=0;while(want>L[i]){want-=L[i];i++;}const a=P[i],b=P[(i+1)%P.length],u=want/L[i];
  const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);out.push([mix(a[0],b[0],u),mix(a[1],b[1],u),dy/l,-dx/l]);}
 return out;
}
// 外向き法線（袋の上の12点、周に沿って順に立てる）
function outNormals(g=1,n=12){
 const S=toS(BG.cx,BG.cy),pts=perim(n);let s='';
 pts.forEach(([x,y,nx,ny],j)=>{const [X,Y]=S([x,y]);s+=fade(seg(g,j/n*.6,j/n*.6+.4),dot(X,Y,5,NC)+arrow(X,Y,X+nx*58,Y-ny*58,{color:NC,w:4,head:13}));});
 return s;
}
// total field of all charges (3D Coulomb, all in this plane), math coords
function Efield([x,y],pos={}){
 let ex=0,ey=0;for(const k of ['p1','p2','p3','n','o1','o2']){const q=pos[k]??Q[k],sg=k==='n'?-1:1,dx=x-q[0],dy=y-q[1],r2=dx*dx+dy*dy,r=Math.sqrt(r2);ex+=sg*dx/(r2*r);ey+=sg*dy/(r2*r);}
 return [ex,ey];
}
const PTS=perim(14);
// 袋の周の14点の電場（全電荷の和）。長さは強さに応じて、最大 100 px に抑える
function surfaceArrows(pos={},{g=1,glow=0}={}){
 const S=toS(BG.cx,BG.cy);let s='';
 for(const [x,y] of PTS){const [ex,ey]=Efield([x,y],pos),m=Math.hypot(ex,ey);const L=Math.min(100,12+4200*Math.sqrt(m));
  const [X,Y]=S([x,y]),uy=-ey/m;let Lc=L;if(uy<-.01)Lc=Math.min(Lc,(Y-86)/-uy);if(uy>.01)Lc=Math.min(Lc,(512-Y)/uy);
  s+=dot(X,Y,5,C.ink)+arrow(X,Y,X+Lc*ex/m,Y+Lc*uy,{color:glow>.01?mix2(EC,HI,glow):EC,w:4+3*glow,head:13});}
 return fade(g,s);
}
const mix2=(a,b,u)=>u>.5?b:a;
// trace real field lines (total field) from the inside positive charges; keep those ending on the negative charge
function trace(start){
 let p=[...start];const pts=[p];
 for(let k=0;k<3000;k++){const [ex,ey]=Efield(p),m=Math.hypot(ex,ey);p=[p[0]+3*ex/m,p[1]+3*ey/m];pts.push(p);
  if(Math.hypot(p[0]-Q.n[0],p[1]-Q.n[1])<24)return {pts,end:'n'};
  if(Math.abs(p[0])>700||Math.abs(p[1])>500)return {pts,end:'far'};}
 return {pts,end:'none'};
}
function polyCross(pts){let c=0;for(let i=1;i<pts.length;i++){const [ox,oy]=pts[i-1],[X,Y]=pts[i],L=Math.hypot(X-ox,Y-oy);c+=crossings(BAG,[ox,oy],[(X-ox)/L,(Y-oy)/L],L).length;}return c;}
let LINES=null;
export function realLines(){
 if(LINES)return LINES;
 const conn=[];
 for(const k of ['p1','p2','p3']){for(let i=0;i<12;i++){const a=2*Math.PI*(i+.5)/12,q=Q[k];const r=trace([q[0]+24*Math.cos(a),q[1]+24*Math.sin(a)]);
  if(r.end==='n'&&polyCross(r.pts)===0)conn.push({k,pts:r.pts});}}
 // 見やすさのため、各電荷から 2本ずつ（つながる線の一部だけを描く）
 const pick=[];for(const k of ['p1','p2','p3']){const mine=conn.filter(L=>L.k===k);const step=Math.max(1,Math.floor(mine.length/2));for(let i=0;i<mine.length&&pick.filter(L=>L.k===k).length<2;i+=step)pick.push(mine[i]);}
 LINES=pick;return LINES;
}
function polyLine(pts,{color=EC,w=3,op=1,g=1}={}){
 const S=toS(BG.cx,BG.cy),P=pts.map(S);let s=draw(P,g,{color,w,opacity:op});
 if(g>.98){const m=Math.floor(P.length*.5),a=P[m-2],b=P[m+2];if(a&&b){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);s+=arrow(P[m][0]-dx/l*14,P[m][1]-dy/l*14,P[m][0]+dx/l*14,P[m][1]+dy/l*14,{color,w,head:14,opacity:op});}}
 return s;
}
// 点S（袋の下の縁）で、電荷ごとの矢印を足す（全 6 電荷、共通の縮尺）
export const SP=[15,-176];
export function contribs(pt=SP){
 return ['p3','p2','n','p1','o2','o1'].map(k=>{const q=Q[k],sg=k==='n'?-1:1,dx=pt[0]-q[0],dy=pt[1]-q[1],r=Math.hypot(dx,dy);return {k,sg,r,ex:sg*dx/r**3,ey:sg*dy/r**3};});
}
const TAG={p3:'①',p2:'②',n:'③'};
// 行8 の②：大きな枠で、扇形 → 鎖 → 足した矢印。u＝鎖への並び替え、sumG＝足した矢印
function sumPanel({g=1,show=1,u=0,sumG=0,x=60,y=88,w=1080,h=420}={}){
 const cs_=contribs(),SC=3.2e6;
 let cx=0,cy=0;const segs=cs_.map(c=>{const vx=c.ex*SC,vy=-c.ey*SC;const fan=[0,0],ch=[cx,cy];cx+=vx;cy+=vy;return {...c,vx,vy,fan,ch};});
 // 扇形と鎖で、それぞれ枠の中央（x+380, y+225）に来るように原点をずらす（並び替えのあいだは間を取る）
 const box=P=>{const xs=P.map(q=>q[0]),ys=P.map(q=>q[1]);return [(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2];};
 const fc=box([[0,0],...segs.map(t=>[t.vx,t.vy])]),cc=box([[0,0],...segs.map(t=>[t.ch[0]+t.vx,t.ch[1]+t.vy])]);
 const ox=x+380-mix(fc[0],cc[0],u),oy=y+225-mix(fc[1],cc[1],u);
 let s=card(x,y,w,h,label('点S の 矢印の 足し算',x+380,y+44,{size:28,color:C.ink,anchor:'middle',weight:700}),g);
 segs.forEach((t,i)=>{const bx=ox+mix(t.fan[0],t.ch[0],u),by=oy+mix(t.fan[1],t.ch[1],u),col=t.sg>0?POSC:NEGC,big=!!TAG[t.k];
  s+=fade(g*seg(show,i/8,i/8+.3)*(1-.55*sumG),arrow(bx,by,bx+t.vx,by+t.vy,{color:col,w:big?6:3,head:big?16:11})
   +(big?label(TAG[t.k],bx+t.vx*.55+(Math.abs(t.vy)>Math.abs(t.vx)?28:0),by+t.vy*.55+(Math.abs(t.vy)>Math.abs(t.vx)?8:-14),{size:28,color:col,weight:700,anchor:'middle'}):''));});
 s+=fade(g,dot(ox,oy,8,C.ink)+label('S',ox-16,oy+8,{size:26,color:C.ink,weight:700,anchor:'end'}));
 s+=fade(g*sumG,arrow(ox,oy,ox+cx,oy+cy,{color:EC,w:11,head:22}));
 s+=fade(g*sumG,label('足した矢印：打ち消し合って 短い',x+380,y+h-22,{size:26,color:EC,anchor:'middle',weight:700}));
 s+=legend([['薄い赤 ＝ 正の電荷から',POSC],['薄い青 ＝ 負の電荷から',NEGC],['水色 ＝ 足した矢印',EC]],x+w-330,y+110,{g,size:22});
 s+=fade(g,label('①②：中の正の電荷',x+w-330,y+250,{size:22,color:C.dim})+label('③：中の負の電荷',x+w-330,y+285,{size:22,color:C.dim})+label('細い矢印：ほかの 3つ',x+w-330,y+320,{size:22,color:C.dim}));
 return s;
}
function sumCard(x,y,w,h,top,val,{g=1,color=HI,vs=48,stroke}={}){return card(x,y,w,h,label(top,x+w/2,y+46,{size:26,color:C.ink,anchor:'middle'})+label(val,x+w/2,y+h-30,{size:vs,color,anchor:'middle',weight:700}),g,stroke??color);}
const bagScene=({pos={},dim=null,arrows=0,glow=0,cg=1}={})=>bagShape()+(arrows?surfaceArrows(pos,{g:arrows,glow}):'')+charges({pos,dim,g:cg})+outTags(cg,pos);

// ===================== 補足の例（1列に並べた電荷、正本の検算の配置） =====================
// 面上の点 P を x=0、正電荷 q を x=−2 m → −1.5 m、負電荷 −q を x=−1 m。矢印の長さは電場の強さに比例（共通の縮尺）。
function lineEx(x0,y0,{neg=false,u=0,g=1,title=''}={}){
 const M=118,px=x0+420,S=150;// 1 m = 118 px、矢印 S px ＝ 電荷 −q が 1 m で作る電場
 const xq=mix(-2,-1.5,u);let s=card(x0,y0,520,330,'',g);
 s+=fade(g,label(title,x0+260,y0+40,{size:26,color:C.ink,anchor:'middle',weight:700}));
 const ay=y0+240,r1=y0+88,r2=y0+130,r3=y0+175;
 s+=fade(g,line(x0+30,ay,x0+500,ay,{color:C.faint,w:2})+line(px,y0+65,px,ay+40,{color:'#c9d6ee',w:6})+label('袋の面',px+12,ay+72,{size:22,color:'#c9d6ee',anchor:'middle'})
  +dot(px,ay,6,C.ink)+label('P',px+14,ay-12,{size:24,color:C.ink,weight:700}));
 s+=fade(g,charge(px+xq*M,ay,1,20));
 if(neg)s+=fade(g,charge(px-1*M,ay,-1,20));
 s+=fade(g*seg(u,0,.3),arrow(px-2*M,ay+34,px-1.5*M,ay+34,{color:C.dim,w:3,head:12})+label('近づける',px-1.75*M,ay+66,{size:22,color:C.dim,anchor:'middle'}));
 const Lp=S/(xq*xq),Lp0=S/4;
 s+=fade(g,label('＋の電荷から',x0+24,r1+8,{size:22,color:POSC})+line(px,r1-14,px,r3+14,{color:C.faint,w:1,dash:'3 5'})
  +arrow(px,r1,px+Lp,r1,{color:POSC,w:5,head:14}));
 let tot=Lp;
 if(neg){s+=fade(g,label('−の電荷から',x0+24,r2+8,{size:22,color:NEGC})+arrow(px,r2,px-S,r2,{color:NEGC,w:5,head:14}));tot=Lp-S;}
 const tot0=neg?Lp0-S:Lp0;
 s+=fade(g,label('足した 矢印',x0+24,r3+8,{size:22,color:EC,weight:700})
  +(u>.02?line(px,r3+16,px+tot0,r3+16,{color:C.dim,w:3,dash:'6 6'}):'')
  +arrow(px,r3,px+tot,r3,{color:EC,w:8,head:18}));
 return s;
}

export const ytQxUiClosedBagDiagrams={
 // ===================== 問題アニメ =====================
 // 出題（小問1）：電場の矢印が左から右へ流れるように現れ、斜めの面・法線・60° の弧・面積・電場の値。3 s で静止。影・電気束の値は出さない。
 [K+'q1']:(p)=>{
  let s=sideTitle(seg(p,0,.15))+fieldRows(1,.9,p)+face(seg(p,.3,.5))+areaTag(seg(p,.45,.6))+normal(seg(p,.5,.7))+ang60(seg(p,.65,.85));
  s+=card(PX,150,PW,170,T(`${cs(EC,'\\mathbf{E}')}`,PX+40,215,{size:40,anchor:'start'})+label('右向き 4 N/C',PX+90,226,{size:32,color:EC,weight:700})
   +label('一様（どこでも 同じ）',PC,285,{size:24,color:C.dim,anchor:'middle'}),seg(p,.1,.3));
  return s;
 },
 // 小問2：暗転のあと、袋と6つの電荷（中：赤3・青1、外：赤2、「外」の札）。電気力線・電場の矢印・値は出さない。
 [K+'q2']:(p)=>bagShape({fo:.06})+fade(seg(p,.1,.5),charges()+outTags()),
 // 小問3：袋の図のまま、右下の正電荷が袋の中に残ったまま右の縁の近くへ 1 秒ですべる。元の位置に点線の丸と「寄せる前」。
 [K+'q3']:(p,ctx)=>{
  const t=cueT(ctx),u=seg(t,.4,1.4),pos={p3:[mix(Q.p3[0],P3MOVED[0],u),mix(Q.p3[1],P3MOVED[1],u)]};
  const S=toS(BG.cx,BG.cy),[x0,y0]=S(Q.p3);
  let s=bagShape()+fade(seg(t,.4,.6),ring(x0,y0,22,{color:C.dim,w:2.5,dash:'5 5'})+label('寄せる前',x0-6,y0+52,{size:22,color:C.dim,anchor:'middle'}));
  s+=charges({pos})+outTags();
  return s;
 },

 // ===================== 小問1 =====================
 // 1. 電場の矢印 → 「斜めに置きます」で面と面積。右のカード。求めるもの（はじめの文で）
 [K+'face']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,fz=b+(1-b)*.55;
  let s=sideTitle(seg(p,0,.06))+fieldRows(seg(p,.02,.14),.9)+face(seg(p,fz,fz+.1))+areaTag(seg(p,fz+.06,fz+.16));
  s+=panel(110,220,T(`${cs(EC,'\\mathbf{E}')}`,PX+40,175,{size:40,anchor:'start'})+label('右向き 4 N/C',PX+90,186,{size:32,color:EC,weight:700})
   +label('一様（どこでも 同じ）',PC,240,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,fz+.06,fz+.16),label('面積 5 m² の 平らな面',PC,295,{size:28,color:AREA,anchor:'middle',weight:700})),seg(p,b,b+.1));
  s+=goalTag(G1,{g:seg(p,.03,.12)});
  return s;
 },
 // 2. 法線（桃）と点線の延長 → 電場の太い矢印 → 「60度です」で弧
 [K+'normal']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5;
  let s=front({rowOp:.5,guide:seg(p,.08,.25),nrm:seg(p,.08,.3),nTxt:true,eG:seg(p,b,b+.12),a60:seg(p,b+.25,b+.4)});
  s+=panel(110,230,label('面の向き ＝ 法線',PC,170,{size:30,color:NC,anchor:'middle',weight:700})+label('（面に 垂直な 矢印）',PC,215,{size:24,color:C.dim,anchor:'middle'})
   +fade(seg(p,b+.25,b+.4),label('法線 と 電場 の 角 ＝ 60°',PC,290,{size:28,color:C.ink,anchor:'middle',weight:700})),seg(p,.05,.2),NC);
  s+=goalTag(G1);
  return s;
 },
 // 3. 影を法線に落とす（黄）。θ と E⊥ の記号を先に置いてから、式を一行ずつ
 [K+'shadow']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,sh=seg(p,b+.02,b+.15),lb=seg(p,b+.15,b+.24);
  let s=front({rowOp:.3,nTxt:false,a60:0});
  s+=ang60(1,{txt:''})+fade(1-lb,label('60°',F0.cx+66,F0.cy-26,{size:28,color:C.ink,weight:700}));
  s+=fade(lb,label('θ',F0.cx+66,F0.cy-26,{size:28,color:C.ink,weight:700})+label('θ ＝ 60°',470,250,{size:28,color:C.ink,weight:700})+label('（電場と 法線の 角）',470,282,{size:22,color:C.dim}));
  s+=shadow(seg(p,b,b+.04),{draw_:sh,lbl:lb>.5?(seg(p,.86,.92)>.5?'E⊥ ＝ 2 N/C':'E⊥'):''});
  const e1=seg(p,b+.26,b+.34),e2=seg(p,b+.38,b+.46),e3=seg(p,b+.5,b+.58),e4=seg(p,.84,.92);
  s+=panel(110,330,label('面を 貫くのは 法線方向の 成分だけ',PC,160,{size:24,color:C.ink,anchor:'middle'})
   +fade(e1,T(`${cs(HI,'E_{\\perp}')}=${cs(EC,'E')}\\cos\\theta`,PC,225,{size:38}))
   +fade(e2,T(`=${cs(EC,'4')}\\times\\cos 60^\\circ`,PC,290,{size:38}))
   +fade(e3,T(`=${cs(EC,'4')}\\times 0.5`,PC,350,{size:38}))
   +fade(e4,T(`=${cs(HI,'2')}\\,\\mathrm{N/C}`,PC,410,{size:40})),seg(p,.03,.15),HI);
  s+=goalTag(G1);
  return s;
 },
 // 4. Φ＝E⊥A → ＝2×5 → ＝10。図の札を「A＝面積 5 m²」に書き換える。10 を黄で光らせる（答えの札は次の行）
 [K+'flux']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,rw=seg(p,.12,.2);
  let s=front({rowOp:.3,area:0,nTxt:false,a60:0,eG:.6,eLbl:''})+shadow(1,{lbl:'E⊥ ＝ 2 N/C'})+ang60(1);
  s+=areaTag(1-rw)+areaTag(rw,'A ＝ 面積 5 m²');
  const hl=seg(p,.82,.9);
  s+=panel(110,280,label('電気束 ＝ 法線方向の 成分 × 面積',PC,160,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.2,.3),T(`\\Phi=${cs(HI,'E_{\\perp}')}\\,${cs(AREA,'A')}`,PC,230,{size:40}))
   +fade(seg(p,b,b+.1),T(`=${cs(HI,'2')}\\times ${cs(AREA,'5')}`,PC,295,{size:40}))
   +fade(seg(p,b+.2,b+.3),(hl>.01?rect(PC-150,322,300,64,{fill:HI,fo:.12*hl,stroke:HI,sw:3*hl,rx:10}):'')+T(`=${cs(HI,'10')}\\,\\mathrm{N\\cdot m^2/C}`,PC,360,{size:40})),seg(p,.02,.12),HI);
  s+=goalTag(G1);
  return s;
 },
 // 5. 小問1 の答え B。誤答 A（電場の矢印を赤く点滅）→ 誤答 D（60° の弧を赤く点滅）を1枚ずつ
 [K+'ans1']:(p,ctx)=>{
  const [wA,wD]=clauseWin(ctx,1,[1,2]),inA=inWin(p,wA),inD=inWin(p,wD,true),bl=blink(ctx);
  let s=front({rowOp:.3,nTxt:false,a60:0,eLbl:'',eG:1})+shadow(1,{lbl:''})+ang60(1);
  if(inA>.01)s+=fade(inA*bl,eArrow(1,{lbl:'4 N/C',color:BAD}));
  if(inD>.01)s+=fade(inD*bl,ang60(1,{color:BAD}));
  s+=wrongCard('A','20',['cos60° を 掛け忘れ'],{...WOPT,y:160,g:inA});
  s+=wrongCard('D','−10',['法線と 同じ側 なのに 負'],{...WOPT,y:160,g:inD});
  s+=goalTag(G1)+ANS1(seg(p,.02,.08));
  return s;
 },
 // 6a.（コマ1：正しい角）法線と電場の弧を緑に「θ＝60°（電場と法線）」。電場と面の間（下側）に灰の弧「実際の面との角 30°」。○ 4×cos60°×5＝10（B）
 [K+'wrong1a']:(p)=>{
  let s=front({rowOp:.3,nTxt:false,a60:0,eLbl:'',area:1})+shadow(.35);
  s+=fade(seg(p,.05,.2),arc(F0.cx,F0.cy,58,0,NDEG,{color:OKC,w:5})+label('θ ＝ 60°（電場と 法線）',F0.cx+66,F0.cy-26,{size:24,color:OKC,weight:700}));
  s+=fade(seg(p,.25,.4),arc(F0.cx,F0.cy,110,0,-30,{color:C.dim,w:3})+label('実際の 面との 角 30°',F0.cx+120,F0.cy+52,{size:22,color:C.dim,weight:700}));
  s+=panel(110,170,label('θ ＝ 電場 と 法線 の 角',PC,160,{size:28,color:OKC,anchor:'middle',weight:700})
   +fade(seg(p,.4,.55),okMark(PX+40,232)+T(`4\\times\\cos 60^\\circ\\times 5=${cs(HI,'10')}`,PC+10,224,{size:32})+label('B',PX+PW-30,234,{size:26,color:HI,anchor:'middle',weight:700})),seg(p,.03,.15),OKC);
  s+=goalTag(G1)+ANS1(1);
  return s;
 },
 // 6b.（コマ2：誤りの操作）コマ1の弧を薄く。電場と面の間に赤い弧「60°？」と赤い ×。× 4×sin60°×5≈17（C）→ 誤答カード C を1枚だけ
 [K+'wrong1b']:(p)=>{
  const ve=.8,wc=seg(p,ve-.05,ve);
  let s=front({rowOp:.3,nTxt:false,a60:0,eLbl:''})+shadow(.35);
  s+=fade(.3,arc(F0.cx,F0.cy,58,0,NDEG,{color:OKC,w:4}));
  s+=fade(seg(p,.08,.22),arc(F0.cx,F0.cy,110,0,-30,{color:BAD,w:5})+label('60°？',F0.cx+120,F0.cy+44,{size:28,color:BAD,weight:700})+ngMark(F0.cx+215,F0.cy+48,40));
  s+=fade(seg(p,.12,.24),label('60° を 面との 角に 当てはめた',30,500,{size:24,color:BAD,weight:700}));
  s+=panel(110,170,label('電場 と 面 の 角 だと 思い込むと',PC,160,{size:26,color:BAD,anchor:'middle',weight:700})
   +fade(seg(p,.3,.45),ngMark(PX+40,234)+T(`4\\times\\sin 60^\\circ\\times 5\\approx${cs(BAD,'17')}`,PC+10,224,{size:32})+label('C',PX+PW-30,234,{size:26,color:BAD,anchor:'middle',weight:700})),seg(p,.03,.15)*(1-wc),BAD);
  s+=wrongCard('C','17',['60° を 面との 角と 思い','sin60° を 掛けた'],{...WOPT,y:160,g:wc});
  s+=goalTag(G1)+ANS1(1);
  return s;
 },

 // ===================== 小問2 =====================
 // 7. 袋と6つの電荷。外向きの法線12本を周に沿って順に。右のカード。求めるもの
 [K+'bag']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4;
  let s=bagScene({cg:seg(p,0,.12)})+outNormals(seg(p,b,b+.35));
  s+=panel2(110,250,label('法線は いつも 外向き',QC2,165,{size:28,color:NC,anchor:'middle',weight:700})
   +fade(seg(p,b+.3,b+.42),label('出る 線 → +1',QC2,240,{size:32,color:HI,anchor:'middle',weight:700}))+fade(seg(p,b+.42,b+.54),label('入る 線 → −1',QC2,305,{size:32,color:NEGV,anchor:'middle',weight:700})),seg(p,b,b+.1),NC);
  s+=goalTag(G2,{g:seg(p,.03,.12)});
  return s;
 },
 // 8.【カット割り】①袋の図に点S と、①②③ から S への点線 → ②図を消して、大きな枠で矢印の足し算（扇形 → 鎖 → 足した矢印）
 [K+'super']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,cA=1-seg(p,b*.45,b*.45+.04),cB=seg(p,b*.45+.02,b*.45+.07);
  const S=toS(BG.cx,BG.cy),[ax,ay]=S(SP);
  let a=bagScene();
  for(const k of ['p3','p2','n']){const [x,y]=S(Q[k]);a+=fade(seg(p,.08,.2),line(x,y,ax,ay,{color:C.dim,w:2,dash:'5 6'})+label(TAG[k],x+(k==='p2'?-36:32),y+8,{size:28,color:k==='n'?NEGC:POSC,weight:700,anchor:'middle'}));}
  a+=fade(seg(p,.02,.1),dot(ax,ay,8,C.ink)+label('S',ax-28,ay+8,{size:28,color:C.ink,weight:700}));
  a+=panel2(110,150,label('袋の 下の 縁の 点S で',QC2,165,{size:26,color:C.ink,anchor:'middle'})+label('電場を 調べる',QC2,210,{size:26,color:C.ink,anchor:'middle'}),seg(p,.05,.15));
  let s=fade(cA,a);
  s+=fade(cB,sumPanel({show:seg(p,b*.45+.04,b*.75),u:seg(p,b*.8,b),sumG:seg(p,b+.12,b+.3)}));
  s+=goalTag(G2);
  return s;
 },
 // 9.【カット割り】①左上の正電荷1つだけの線6本と、黄の線の +1 −1 +1 → ②図を消して「1つ分 +6」→「3つ分 +18」
 [K+'pos']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45,cut=b+(1-b)*.3,cA=1-seg(p,cut,cut+.04),cB=seg(p,cut+.02,cut+.07);
  const tp=tally('p1',1),hl=tp.per.findIndex(x=>x.c.length===3);
  let a=bagShape()+charges({dim:['p2','p3','n','o1','o2']})+ownLines('p1',1,{g:seg(p,.05,.22),hl});
  a+=marks('p1',1,{g:seg(p,.2,.32),labels:false})+marks('p1',1,{g:seg(p,.2,.32),only:[hl],big:true});
  a+=panel2(110,230,label('正の電荷 1つだけの 線（6本）',QC2,155,{size:24,color:C.dim,anchor:'middle'})
   +label('黄色の線：出る・入る・出る',QC2,210,{size:24,color:C.ink,anchor:'middle'})
   +fade(seg(p,.25,.38),label('+1 −1 +1 ＝ +1',QC2,285,{size:36,color:HI,anchor:'middle',weight:700})),seg(p,.1,.22),HI);
  let s=fade(cA,a);
  s+=fade(cB,sumCard(170,140,380,250,'正の電荷 1つ分',`+${tp.t}`,{vs:64})
   +fade(seg(p,cut+.15,cut+.25),arrow(575,265,635,265,{color:C.dim,w:4,head:16})+sumCard(660,140,380,250,'3つ分',`+${3*tp.t}`,{vs:72})));
  s+=goalTag(G2);
  return s;
 },
 // 10.【カット割り】①負の電荷1つだけの線（どれも入る、−1×6）→ ②全部の電荷の電場から計算した本当の線（赤 → 青で終わる、袋を通らない）
 [K+'neg']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.4,ph=seg(p,b,b+.06);
  const tn=tally('n',-1);
  let s=bagShape();
  s+=fade(1-ph,ownLines('n',-1,{g:seg(p,.03,.18)})+marks('n',-1,{g:seg(p,.15,.28)}));
  const L=realLines();
  s+=fade(ph,L.map((q,i)=>polyLine(q.pts,{g:seg(p,b+.06+i*.04,b+.2+i*.04),w:4})).join(''));
  s+=charges({dim:ph>.5?['o1','o2']:['p1','p2','p3','o1','o2']})+outTags(ph>.5?.3:.3);
  s+=panel2(110,220,label('負の電荷 1つだけの 線',QC2,160,{size:24,color:C.dim,anchor:'middle'})+label('どれも 入る',QC2,215,{size:28,color:C.ink,anchor:'middle'})
   +label(`${tn.t}`.replace('-','−'),QC2,290,{size:48,color:NEGV,anchor:'middle',weight:700}),seg(p,.08,.2)*(1-ph),NEGV);
  s+=panel2(110,260,label('実際の 線（全部の電荷の 電場）',QC2,155,{size:22,color:C.dim,anchor:'middle'})
   +label('赤 → 青 で 終わる 線',QC2,210,{size:28,color:EC,anchor:'middle',weight:700})
   +fade(seg(p,b+.3,b+.42),label('袋の面を 通らない',QC2,280,{size:28,color:HI,anchor:'middle',weight:700})+label('（+1 も −1 も なし）',QC2,325,{size:24,color:C.dim,anchor:'middle'})),seg(p,b+.02,b+.1),HI);
  s+=goalTag(G2);
  return s;
 },
 // 11. 外の正電荷2つの線。入る所 −1、出る所 +1。「外の2つの分 0」
 [K+'out']:(p,ctx)=>{
  const t1=tally('o1',1),t2=tally('o2',1),W=sentWin(ctx),b=W[1]?W[1][0]:.7;
  let s=bagShape()+ownLines('o1',1,{g:seg(p,.03,.2)})+ownLines('o2',1,{g:seg(p,.03,.2)});
  s+=marks('o1',1,{g:seg(p,.3,.5)})+marks('o2',1,{g:seg(p,.3,.5)});
  s+=charges({dim:['p1','p2','p3','n']})+outTags();
  s+=panel2(110,180,label('外の 正の電荷の 線',QC2,155,{size:24,color:C.dim,anchor:'middle'})+label('入って −1、出て +1',QC2,212,{size:28,color:C.ink,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('−1 ＋ 1 ＝ 0',QC2,262,{size:28,color:HI,anchor:'middle',weight:700})),seg(p,.1,.22));
  s+=sumCard(QX2,310,QW2,170,'外の 2つの分',String(t1.t+t2.t),{g:seg(p,b+.1,b+.2)});
  return s+goalTag(G2);
 },
 // 12. 袋の図を消す。3枚のカード → 18−6＋0＝+12 → 合計 +12 本（答えの札と誤答は次の行）
 [K+'sum']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6;
  let s=sumRow({g:[seg(p,.05,.12),seg(p,.12,.19),seg(p,.19,.26)]});
  s+=fade(seg(p,.3,.42),T(`${cs(HI,'18')}-6+0=${cs(HI,'+12')}`,410,380,{size:52}));
  s+=card(800,140,360,240,label('合計',980,185,{size:26,color:C.ink,anchor:'middle'})+label('+12 本',980,255,{size:52,color:HI,anchor:'middle',weight:700})
   +fade(seg(p,b,b+.1),label('＝ 中の 正味：',980,315,{size:24,color:C.ink,anchor:'middle'})+label('正の電荷 2つ分',980,352,{size:24,color:C.ink,anchor:'middle'})),seg(p,.4,.5),HI);
  return s+goalTag(G2);
 },
 // 13. 小問2 の答え D。誤答 A → B → C を1枚ずつ。対応する上のカードを赤く点滅
 [K+'ans2']:(p,ctx)=>{
  const [wA,wB,wC]=clauseWin(ctx,1,[1,1,1]),inA=inWin(p,wA),inB=inWin(p,wB),inC=inWin(p,wC,true),bl=blink(ctx);
  let s=sumRow({flash:[0,inB*bl,Math.max(inA,inC)*bl]});
  s+=wrongCard('A','+24',['外の 12本も 足した'],{x:150,w:900,y:330,g:inA});
  s+=wrongCard('B','+18',['負の −6 を 数えない'],{x:150,w:900,y:330,g:inB});
  s+=wrongCard('C','0',['外の線を −12（入る だけ）と 数えた'],{x:150,w:900,y:330,g:inC});
  return s+goalTag(G2)+ANS2(seg(p,.02,.08));
 },

 // ===================== 小問3 =====================
 // 14. 袋の周の14点に電場の矢印（全電荷の和）。中の右下の正電荷 ① が右の縁の近くへすべり、矢印が計算どおりに変わる
 [K+'inmove']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.55,u=seg(p,.1,b*.75),pos={p3:[mix(Q.p3[0],P3MOVED[0],u),mix(Q.p3[1],P3MOVED[1],u)]};
  let s=bagScene({pos,arrows:seg(p,.02,.08)});
  s+=panel2(95,200,label('中の 正の電荷を 端へ',QC2,140,{size:24,color:C.ink,anchor:'middle'})+label('中の 正味：正 2つ分',QC2,185,{size:24,color:C.ink,anchor:'middle'})
   +label('合計 +12 のまま',QC2,252,{size:34,color:HI,anchor:'middle',weight:700}),seg(p,b*.7,b*.85),HI);
  s+=panel2(315,170,label('袋の 各点の 電場',QC2,365,{size:26,color:EC,anchor:'middle',weight:700})
   +label('場所ごとに 変わり得る',QC2,425,{size:28,color:EC,anchor:'middle',weight:700}),seg(p,b+.05,b+.15),EC);
  return s+goalTag(G3,{g:seg(p,.02,.08)});
 },
 // 15. 小問3 の答え A。「合計 +12 のまま」を黄で光らせる。誤答 C を1枚だけ
 [K+'ans3']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.35,inC=seg(p,b,b+.04),gl=seg(p,.05,.15);
  let s=bagScene({pos:{p3:P3MOVED},arrows:1});
  s+=panel2(95,200,(gl>.01?rect(QX2+20,215,QW2-40,58,{fill:HI,fo:.15*gl,stroke:HI,sw:3,rx:10}):'')+label('中の 正の電荷を 端へ',QC2,140,{size:24,color:C.ink,anchor:'middle'})+label('中の 正味：正 2つ分',QC2,185,{size:24,color:C.ink,anchor:'middle'})
   +label('合計 +12 のまま',QC2,252,{size:34,color:HI,anchor:'middle',weight:700}),1,HI);
  s+=wrongCard('C','合計も 増える',['合計は 中の 正味の','電荷 だけで 決まる'],{x:QX2,w:QW2,size:26,whySize:22,y:315,g:inC});
  return s+goalTag(G3)+ANS3(seg(p,.02,.08));
 },
 // 16. 誤答 B（袋の上の14本を光らせる）→ 誤答 D（「合計 +12」と水色の矢印を分けて「別のもの」）
 [K+'wrong3']:(p,ctx)=>{
  const [wB,wD]=clauseWin(ctx,0,[1,1]),inB=inWin(p,wB),inD=inWin(p,wD,true),bl=blink(ctx);
  let s=bagScene({pos:{p3:P3MOVED},arrows:1,glow:inB*bl});
  s+=panel2(95,180,label('合計 +12 のまま',QC2,150,{size:34,color:HI,anchor:'middle',weight:700})
   +fade(inD,label('↕ 別の もの',QC2,200,{size:28,color:C.ink,anchor:'middle',weight:700})+label('水色の 矢印（場所ごとの 電場）',QC2,250,{size:24,color:EC,anchor:'middle',weight:700})),1,HI);
  s+=wrongCard('B','各点も 同じ',['合計が 同じなら 各点も 同じ','と 考えた'],{x:QX2,w:QW2,size:26,whySize:22,y:290,g:inB});
  s+=wrongCard('D','どこも 同じ強さ',['合計と 場所ごとの 矢印を','混同'],{x:QX2,w:QW2,size:26,whySize:22,y:290,g:inD});
  return s+goalTag(G3)+ANS3(1);
 },

 // ===================== 補足 =====================
 // 17. 左上の外の電荷が、外に残ったまま袋の方へ動く。14本の矢印が連続して変わる
 [K+'outmove']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.6,u=seg(p,.12,b),pos={p3:P3MOVED,o1:[mix(Q.o1[0],O1MOVED[0],u),mix(Q.o1[1],O1MOVED[1],u)]};
  let s=bagScene({pos,arrows:1});
  s+=fade(seg(p,0,.08),rect(10,8,420,56,{fill:'#131f38',fo:.96,stroke:C.dim,sw:2.5,rx:10})+label('補足：外の電荷を 動かすと',26,46,{size:26,color:C.ink,weight:700}));
  s+=panel2(95,200,label('外の 電荷を 動かす',QC2,145,{size:26,color:C.ink,anchor:'middle'})
   +label('袋の上の 矢印が 変わる',QC2,205,{size:26,color:EC,anchor:'middle',weight:700})+label('（長さ も 向き も）',QC2,250,{size:22,color:C.dim,anchor:'middle'}),seg(p,.05,.15),EC);
  s+=sumCard(QX2,320,QW2,160,'合計','+12 のまま',{g:seg(p,b,b+.1),vs:42});
  return s;
 },
 // 18. 1列に並べた例：電荷1つだけ（長くなる）と、近くに負の電荷もある（短くなる）
 [K+'compare']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,u=seg(p,.12,b*.8);
  let s=fade(seg(p,0,.08),label('点P の 電場（矢印の 長さ ＝ 強さ、点線 ＝ 近づける前）',600,110,{size:24,color:C.dim,anchor:'middle'}));
  s+=lineEx(40,130,{u,title:'電荷が 1つだけ',g:seg(p,0,.1)});
  s+=fade(seg(p,b*.8,b),label('足した矢印：長くなる',300,495,{size:26,color:EC,anchor:'middle',weight:700}));
  const v=seg(p,b+.12,b+.4);
  s+=lineEx(640,130,{neg:true,u:v,title:'近くに 負の電荷も ある',g:seg(p,b,b+.08)});
  s+=fade(seg(p,b+.4,b+.48),label('足した矢印：短くなる',900,495,{size:26,color:BAD,anchor:'middle',weight:700}));
  s+=fade(seg(p,.9,.97),rect(250,6,700,60,{fill:'#131f38',fo:.96,stroke:C.ink,sw:2,rx:10})+label('どちらに なるかは、ほかの 電荷の 置き方 しだい',600,46,{size:26,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 // 19. 近づける前・後の2段。＋の矢印（長くなる）、−の矢印を先から根元へ、足した矢印（後の方が短い）
 [K+'whyweak']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.45;
  const S=260,px=760;let s=label('点P の 電場を、矢印の 足し算で 見る',600,110,{size:26,color:C.dim,anchor:'middle'});
  const row=(y,d,txt,g)=>{const Lp=S/(d*d),tot=Lp-S;let r=label(txt,60,y+8,{size:26,color:C.ink,weight:700});
   r+=dot(px,y,6,C.ink)+label('P',px-8,y-40,{size:24,color:C.ink,anchor:'end'});
   r+=arrow(px,y-26,px+Lp,y-26,{color:POSC,w:6,head:16});
   r+=fade(seg(p,b+.05,b+.18),arrow(px+Lp,y-2,px+Lp-S,y-2,{color:NEGC,w:6,head:16}));
   r+=fade(seg(p,b+.3,b+.42),arrow(px,y+26,px+tot,y+26,{color:EC,w:9,head:20}));
   return fade(g,r);};
  s+=row(210,2,'近づける 前',seg(p,0,.08))+row(380,1.5,'近づけた 後',seg(p,.04,.12));
  s+=legend([['＋の電荷から',POSC],['−の電荷から',NEGC],['足した 矢印',EC]],960,160,{size:22});
  s+=fade(seg(p,.12,.24),label('長くなる',px+S/2.25+10,350,{size:24,color:POSC,weight:700}));
  s+=fade(seg(p,b+.15,b+.28),label('逆向き → 打ち消し合う',600,490,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=fade(seg(p,b+.42,b+.55),label('短くなる',px-S*(1-1/2.25)-20,420,{size:26,color:BAD,weight:700,anchor:'end'}));
  return s;
 },
 // 20. 合計（黄枠）と場所ごとの矢印（水色枠）は別のもの。最後に答えの札3枚を横に並べる
 [K+'cards']:(p,ctx)=>{
  const W=sentWin(ctx),b=W[1]?W[1][0]:.5,ve=voiceEnd(ctx);
  let s=card(70,100,500,320,label('合計',320,160,{size:34,color:HI,anchor:'middle',weight:700})
   +label('+12',320,240,{size:56,color:HI,anchor:'middle',weight:700})
   +label('分かる：中の 正味の 電荷',320,315,{size:26,color:C.ink,anchor:'middle'})+label('（符号 と 量）',320,360,{size:24,color:C.dim,anchor:'middle'}),seg(p,.02,.12),HI);
  let arr='';const pts=[[700,215,60,-10],[790,255,40,20],[880,205,70,-25],[970,245,30,10],[1060,220,55,15],[740,305,45,25],[850,315,65,-5],[960,305,35,-20],[1060,300,50,5]];
  for(const [x,y,dx,dy] of pts)arr+=dot(x,y,4,C.ink)+arrow(x,y,x+dx,y+dy,{color:EC,w:4,head:12});
  s+=card(630,100,500,320,label('場所ごとの 矢印',880,160,{size:34,color:EC,anchor:'middle',weight:700})+arr
   +label('合計からは 分からない',880,385,{size:26,color:BAD,anchor:'middle',weight:700}),seg(p,b,b+.1),EC);
  s+=fade(seg(p,b+.2,b+.3),label('別の もの',600,470,{size:30,color:C.ink,anchor:'middle',weight:700}));
  s+=answerRow([[1,'B','10 N·m²/C'],[2,'D','+12 本'],[3,'A','']],{g:seg(p,ve,ve+.05)});
  return s;
 },
};
// 行12・13 の上の3枚のカード（flash＝赤い点滅の強さ）
function sumRow({g=[1,1,1],flash=[0,0,0]}={}){
 const a=3*tally('p1',1).t,b=tally('n',-1).t,c=tally('o1',1).t+tally('o2',1).t;
 let s=label('出る本数 − 入る本数',410,115,{size:28,color:C.dim,anchor:'middle'});
 const fl=(x,y,w,h,f)=>f>.01?rect(x,y,w,h,{fill:BAD,fo:.18*f,stroke:BAD,sw:4,rx:14}):'';
 s+=card(60,140,240,150,label('中の 正 3つ',180,185,{size:26,color:C.ink,anchor:'middle'})+label(`+${a}`,180,255,{size:44,color:HI,anchor:'middle',weight:700}),g[0])+fl(60,140,240,150,flash[0]);
 s+=card(320,140,220,150,label('中の 負 1つ',430,185,{size:26,color:C.ink,anchor:'middle'})+label(`${b}`.replace('-','−'),430,255,{size:44,color:NEGV,anchor:'middle',weight:700}),g[1])+fl(320,140,220,150,flash[1]);
 s+=card(560,140,200,150,label('外の 正 2つ',660,185,{size:26,color:C.ink,anchor:'middle'})+label(String(c),660,255,{size:44,color:C.ink,anchor:'middle',weight:700}),g[2])+fl(560,140,200,150,flash[2]);
 return s;
}
