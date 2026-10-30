// 高校編「ドップラー効果・深く学ぶ 1/3」(ys-hs-w-doppler-1) — 図。Stage 1200×515.
// 色は波の基本・音波と同じ：λ 水色、t・T 金、f 桃、v・V（音の速さ）紫、印 黄。
// 山の進み VT は水色の矢印、音源の進み vₛT は赤の矢印（構成表の補助線②）。山（密の部分）の並びは白い円。
// 図の音源の速さは、見やすいように V の 0.25 倍に大げさにしてある（実際は 20/340 ≈ 0.06）。そのことを画面と語りで言う。
// 2/3・3/3・要点でも使う部品は export する。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,tex,texWidth,poly,clamp,mix,brace} from './anim.mjs';
import {card,tag,T2,sceneT,tSince,LC,TCOL,FC,VCOL,MK,Lt,Tt,ft,HZ,MS,MM,SS} from './yt1-hs-w-basics-1-diagrams.mjs';
export {card,tag,T2,sceneT,tSince,LC,TCOL,FC,VCOL,MK,Lt,Tt,ft,HZ,MS,MM,SS};

const K='hs-w-doppler-1:';
export const SC=C.a, WF='#d6deec', SKIN='#e9c7a6';
export const Vt=`{\\color{${VCOL}}V}`, vst=`{\\color{${VCOL}}v_s}`, vot=`{\\color{${VCOL}}v_o}`, fp=`{\\color{${FC}}f'}`;
// ---- a row of TeX pieces and Japanese subscripts (tex() must not contain Japanese) --------------
// items: TeX strings, or {j:'前'} drawn as a small Japanese subscript right after the previous piece.
export function eqRow(items,cx,y,{size=46,g=1}={}){
 const ws=items.map(it=>typeof it==='string'?texWidth(it,size):[...it.j].length*size*.6+size*.08);
 let x=cx-ws.reduce((a,b)=>a+b,0)/2,s='';
 items.forEach((it,i)=>{
  if(typeof it==='string')s+=tex(it,x+ws[i]/2,y,{size});
  else s+=label(it.j,x+size*.02,y+size*.42,{size:Math.round(size*.6),color:it.color||LC,weight:700});
  x+=ws[i];});
 return fade(g,s);
}
export const LF=[Lt,{j:'前'}], LB=[Lt,{j:'後'}];
// ---- people and things ---------------------------------------------------------------------------
// siren: ambulance whose body centre (where the sound comes from) is (x,y)
export function siren(x,y,{g=1,s=1,lab='音源',flip=false}={}){
 const W=110*s,H=44*s;let o=rect(x-W/2,y-H/2,W,H,{fill:'#e8eef8',fo:.95,stroke:'#b9c6da',sw:2,rx:10*s});
 o+=rect(x-W/2,y-3*s,W,8*s,{fill:SC,fo:.9,stroke:'none',rx:2});
 o+=rect(x-12*s,y-H/2-12*s,24*s,12*s,{fill:SC,fo:1,stroke:'none',rx:4});
 const fx=flip?-1:1;o+=rect(x+fx*W/2-(fx>0?26:0)*s,y-H/2+6*s,26*s,16*s,{fill:'#7fb6ff',fo:.7,stroke:'none',rx:3});
 o+=ring(x-30*s,y+H/2+2*s,10*s,{color:C.dim,w:3,fill:C.bg})+ring(x+30*s,y+H/2+2*s,10*s,{color:C.dim,w:3,fill:C.bg});
 if(lab)o+=label(lab,x,y+H/2+44*s,{size:24,color:C.dim,anchor:'middle',weight:700});
 return fade(g,o);
}
// listener: head centre (x,y)
export function listener(x,y,{g=1,lab='聞き手',s=1}={}){
 let o=dot(x,y,17*s,SKIN)+rect(x-18*s,y+22*s,36*s,52*s,{fill:'#7fa0d0',fo:.85,stroke:'none',rx:12*s});
 o+=line(x-9*s,y+74*s,x-11*s,y+104*s,{color:'#7fa0d0',w:7*s})+line(x+9*s,y+74*s,x+11*s,y+104*s,{color:'#7fa0d0',w:7*s});
 if(lab)o+=label(lab,x,y+138*s,{size:24,color:C.dim,anchor:'middle',weight:700});
 return fade(g,o);
}
// ---- wavefront picture: crests (compressions) drawn as circles ----------------------------------
// display units: Vd px/s, period Td s, source speed k·Vd. The source is at xs0 at t＝0 and emits a crest at t＝nTd.
export const WP={y:250,Vd:150,Td:.55,k:.25,xs0:700};
export const srcX=(t,o=WP,k=o.k,xs0=o.xs0)=>xs0+k*o.Vd*t;
export function fronts(t,{o=WP,k=o.k,xs0=o.xs0,tmin=-10,g=1,color=WF,w=3,centres=0}={}){
 let s='',c='';const n0=Math.ceil(tmin/o.Td),n1=Math.floor(t/o.Td+1e-9);
 for(let n=n0;n<=n1;n++){const te=n*o.Td,r=o.Vd*(t-te);const cx=xs0+k*o.Vd*te;
  if(r>1)s+=ring(cx,o.y,r,{color,w});
  if(centres&&r<700&&cx>-20)c+=dot(cx,o.y,6,SC);}
 return fade(g,s)+(centres?fade(g*centres,c):'');
}
// gap marks between consecutive crests on one side of the source at time t (side ＝ +1 front, −1 back)
export function crestEdges(t,{o=WP,k=o.k,xs0=o.xs0,side=1,count=3}={}){
 const out=[],n1=Math.floor(t/o.Td+1e-9);
 for(let n=n1;n>n1-count-2;n--){const te=n*o.Td,r=o.Vd*(t-te);if(r<5)continue;out.push(xs0+k*o.Vd*te+side*r);}
 return out.slice(0,count);
}
// label on a dark plate (readable over the wavefront circles)
export function plate(text,x,y,{size=26,color=C.ink,anchor='middle',weight=700,g=1}={}){
 const w=[...text].reduce((a,c)=>a+(/[ -~]/.test(c)?.55:1),0)*size+24,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w+12:x-12;
 return fade(g,rect(x0,y-size*.95,w,size*1.35,{fill:C.bg,fo:.88,stroke:'none',rx:8})+label(text,x,y,{size,color,anchor,weight}));
}
export function dbl(x1,x2,y,color,{w=3,head=12,g=1}={}){return arrow(x1,y,x2,y,{color,w,head,g})+arrow(x2,y,x1,y,{color,w,head,g});}
const exaggNote=(g=1)=>plate('（図は、音源の速さを 大げさに 描いています）',600,500,{size:22,color:C.dim,weight:400,g});
// the full wavefront scene: source moving right (k), listener on the right
export function dopplerScene(t,{o=WP,k=o.k,xs0=o.xs0,lis=1110,g=1,note=1,centres=0,front=0,back=0}={}){
 let s=fronts(t,{o,k,xs0,centres});
 s+=siren(srcX(t,o,k,xs0),o.y,{lab:''});
 if(lis)s+=listener(lis,o.y-40,{lab:'聞き手'});
 if(front){const e=crestEdges(t,{o,k,xs0,side:1,count:2}).sort((a,b)=>a-b);if(e.length===2)s+=fade(front,dbl(e[0],e[1],o.y+112,LC)+plate('詰まる',(e[0]+e[1])/2,o.y+150,{color:LC}));}
 if(back){const e=crestEdges(t,{o,k,xs0,side:-1,count:2}).sort((a,b)=>a-b);if(e.length===2)s+=fade(back,dbl(e[0],e[1],o.y+112,LC)+plate('広がる',(e[0]+e[1])/2,o.y+150,{color:LC}));}
 if(note)s+=exaggNote(note);
 return fade(g,s);
}
// ---- 1D frame-by-frame picture (本2・本3) ----------------------------------------------------------
// FB: emission point x0, crest travel in one period VT (px), source travel k·VT. axis at y.
export const FB={y:330,x0:190,VT:720,k:.25};
export function frameBy({o=FB,u=1,src=1,c2=0,vt=0,vst:vs=0,gap=0,nums=0,vtLab=1,g=1,dir=1,lis=0}={}){
 // dir＝+1: crests to the right (front). dir＝−1: crest 1 travels left (back side), source still moves right.
 const X0=o.x0,xc=X0+dir*o.VT*u,xs=X0+o.k*o.VT*u,yA=o.y;
 let s=line(60,yA+46,1150,yA+46,{color:C.faint,w:2});
 // crest 1
 s+=line(xc,yA-80,xc,yA+40,{color:WF,w:6})+label('山1',xc,yA-92,{size:26,color:WF,anchor:'middle',weight:700});
 // crest 2 at the source position after one period
 if(c2)s+=fade(c2,line(xs,yA-80,xs,yA+40,{color:WF,w:6})+label('山2',xs+(dir>0?0:0),yA-92,{size:26,color:WF,anchor:'middle',weight:700}));
 s+=siren(xs,yA,{lab:'',s:.8});
 // emission point
 s+=dot(X0,yA+46,7,C.dim);
 const ya=yA-140;
 if(vt){s+=line(X0,ya-14,X0,ya+14,{color:LC,w:2})+arrow(X0,ya,xc,ya,{color:LC,w:5,head:16,g:vt});
  if(vtLab)s+=fade(vt,nums?label(nums===2?'VT':'0.85 m',(X0+xc)/2,ya-16,{size:28,color:LC,anchor:'middle',weight:700}):tex(`${Vt}${Tt}`,(X0+xc)/2,ya-26,{size:36}));}
 const yb=yA+86,back=dir<0;
 if(vs){s+=arrow(X0,yb,xs,yb,{color:SC,w:5,head:14,g:vs});
  const ly=back?yb-12:yb+(nums?44:36);
  s+=fade(vs,nums?label('0.050 m',(X0+xs)/2+(dir>0?-10:0),back?yb-10:yb+44,{size:26,color:SC,anchor:'middle',weight:700}):tex(`${vst}${Tt}`,(X0+xs)/2,ly,{size:back?30:34}));}
 if(gap){const a=Math.min(xs,xc),b=Math.max(xs,xc),yg=back?yb+52:yb;s+=fade(gap,dbl(a,b,yg,C.hi,{w:4,head:14}));
  s+=fade(gap,nums?label(dir>0?'0.80 m':'0.90 m',(a+b)/2,back?yg-12:yb+44,{size:28,color:C.hi,anchor:'middle',weight:700}):eqRow(dir>0?LF:LB,(a+b)/2,back?yg-24:yb+36,{size:40}));}
 if(lis)s+=listener(lis,yA-40,{lab:'聞き手',s:.75});
 return fade(g,s);
}
// ---- crest train passing a listener (本4) -------------------------------------------------------
export function train(t,{sp=60,v=150,lx=900,y=270,g=1,x0=60,x1=1150,lisG=1}={}){
 let s='';const off=((v*t)%sp+sp)%sp;
 for(let x=x0-sp+off;x<x1;x+=sp)if(x>=x0)s+=line(x,y-70,x,y+70,{color:WF,w:4});
 s+=listener(lx,y-30,{g:lisG,lab:''});
 return fade(g,s);
}
// a 1-second strip (length V) cut into pieces of length λ
export function strip({x=150,w=900,y=330,pieces=12,u=1,g=1,lab='',cut=1,col=LC}={}){
 let s=rect(x,y-26,w*u,52,{fill:col,fo:.12,stroke:col,sw:2,rx:6});
 const dx=w/pieces;for(let i=1;i<pieces;i++){const xx=x+i*dx;if(xx<x+w*u)s+=fade(cut,line(xx,y-26,xx,y+26,{color:col,w:2}));}
 if(lab)s+=label(lab,x+w/2,y+70,{size:26,color:col,anchor:'middle',weight:700});
 return fade(g,s);
}
// ---- road with a passing ambulance (title scene) ------------------------------------------------
export function road(t,{g=1,speed=110,x0=-80,lx=600}={}){
 const xs=x0+((speed*t)%1360+1360)%1360;let s=line(40,330,1160,330,{color:C.dim,w:3});
 for(let x=60;x<1160;x+=90)s+=line(x,345,x+40,345,{color:C.faint,w:3});
 s+=siren(xs,292,{lab:'',flip:false})+listener(lx,370,{lab:'聞き手',s:.8});
 return fade(g,s);
}

export const hsWDoppler1Diagrams={
 // ================= S1 前回の問い =================
 [K+'q']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'q');const xs=-80+110*t;
  let s=road(t);
  s+=fade(seg(p,.25,.4)*(xs<600?1:0),label('近づく：高く 聞こえる',600,120,{size:32,color:C.hi,anchor:'middle',weight:700}));
  s+=fade(xs>=600?seg(xs,600,640):0,label('遠ざかる：低く 聞こえる',600,120,{size:32,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'q2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'q');
  let s=fade(.5,road(t));
  s+=card(200,40,800,140,label('サイレンが 出す 振動数は 同じ',600,100,{size:34,color:C.ink,anchor:'middle',weight:700})+label('なのに 聞こえる 高さが 変わる',600,155,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'name']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'q');
  let s=fade(.35,road(t));
  s+=card(300,60,600,150,label('ドップラー効果',600,130,{size:44,color:C.hi,anchor:'middle',weight:700})+label('動くと 聞こえる 高さが 変わる',600,185,{size:26,color:C.ink,anchor:'middle'}),seg(p,.45,.6),C.hi);
  return s;
 },
 [K+'pred']:(p)=>{
  let s=label('近づく 音源の 前で 変わるのは？',600,90,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=card(150,170,400,150,label('音の 速さ V',350,262,{size:36,color:VCOL,anchor:'middle',weight:700}),seg(p,.25,.4),VCOL);
  s+=card(650,170,400,150,label('山の 間隔',850,262,{size:36,color:LC,anchor:'middle',weight:700}),seg(p,.45,.6),LC);
  s+=fade(seg(p,.5,.65),label('か',600,262,{size:32,color:C.dim,anchor:'middle'}));
  return s;
 },
 // ================= S2 誰が何に対して動くのか =================
 [K+'setup']:(p)=>{
  let s=siren(260,280,{g:seg(p,0,.15)})+listener(1000,240,{g:seg(p,.3,.45)});
  s+=fade(seg(p,.6,.75),label('（観測者 とも いう）',1000,430,{size:24,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'air']:(p)=>{
  const u=lin(p,.45,.95),xs=260+180*u;
  let s=siren(xs,280)+listener(1000,240);
  s+=card(380,40,440,90,label('空気：止まっている',600,98,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.2,.35),label('止まっている',1000,200,{size:24,color:C.dim,anchor:'middle',weight:700}));
  s+=arrow(xs+70,200,xs+230,200,{color:VCOL,w:6,head:18,g:seg(p,.45,.6)});
  s+=fade(seg(p,.5,.65),label('近づく',xs+150,180,{size:26,color:VCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'speeds']:(p)=>{
  let s=siren(440,280)+listener(1000,240);
  s+=fade(.8,label('空気：止まっている',300,80,{size:26,color:C.dim,anchor:'middle'}));
  s+=arrow(510,200,670,200,{color:VCOL,w:6,head:18})+tex(vst,590,170,{size:40});
  s+=arrow(150,420,450,420,{color:VCOL,w:6,head:18,g:seg(p,.05,.2)})+fade(seg(p,.05,.2),tex(Vt,300,390,{size:40})+label('音の 速さ',300,470,{size:24,color:VCOL,anchor:'middle',weight:700}));
  s+=card(660,30,500,90,label('どちらも 空気に 対する 速さ',910,88,{size:28,color:C.ink,anchor:'middle',weight:700}),seg(p,.45,.6),C.dim);
  return s;
 },
 [K+'cond']:(p)=>{
  let s=fade(.45,siren(440,300,{lab:''})+listener(1000,260,{lab:''}));
  s+=fade(.45,line(100,300,1150,300,{color:C.dim,w:2,dash:'8 8'}));
  s+=card(200,40,800,190,label('音源と 聞き手は 同じ 一直線上',600,110,{size:32,color:C.ink,anchor:'middle',weight:700})+eqRow([`${vst}<${Vt}`],600,175,{size:44}),seg(p,.05,.2),C.dim);
  s+=fade(seg(p,.55,.7),label('（音源は 音より 遅い）',600,215,{size:22,color:C.dim,anchor:'middle'}));
  s+=tag('仮定',1060,70,{color:C.dim,g:seg(p,.6,.75)});
  return s;
 },
 [K+'nums']:(p)=>{
  const rows=[[`${Vt}=340${MS}`,'音の 速さ',VCOL],[`f=400${HZ}`,'サイレンの 振動数',FC],[`${vst}=20${MS}`,'音源の 速さ（時速 72 km）',VCOL]];
  let s=card(170,40,860,400,'',1,C.dim);
  rows.forEach(([t,j,c],i)=>{const y=130+i*110,o=seg(p,.05+i*.25,.2+i*.25);s+=fade(o,tex(t.replace(/^f/,ft),420,y,{size:44})+label(j,640,y+12,{size:28,color:c,weight:700}));});
  return s;
 },
 [K+'per']:(p)=>{
  let s=card(200,60,800,140,T2(`${Tt}=\\dfrac{1}{400}=0.0025${SS}`,600,140,{size:50}),seg(p,.05,.2),TCOL);
  s+=fade(seg(p,.4,.55),label('1回 振動する 時間',600,250,{size:28,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'lam0']:(p)=>{
  let s=card(200,60,800,140,T2(`${Tt}=\\dfrac{1}{400}=0.0025${SS}`,600,140,{size:50}),1,TCOL);
  s+=card(200,250,800,140,T2(`${Lt}=\\dfrac{340}{400}=0.85${MM}`,600,330,{size:50}),seg(p,.3,.45),LC);
  s+=fade(seg(p,.5,.65),label('音源が 止まって いるときの 波長',600,440,{size:26,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S3 動く音源のまわり =================
 [K+'crest']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'crest');
  let s=fronts(t,{k:0,xs0:560,tmin:-10,g:seg(p,.35,.55)})+siren(560,WP.y,{lab:''})+listener(1110,WP.y-40,{lab:''});
  s+=card(170,30,520,90,label('山 ＝ 空気の 密な 部分',430,88,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.2)*(1-seg(p,.8,.95)),C.dim);
  s+=plate('山の 並びを 円で 描く',600,480,{color:WF,g:seg(p,.55,.7)});
  return s;
 },
 [K+'still']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'crest');
  let s=fronts(t,{k:0,xs0:560})+siren(560,WP.y,{lab:''})+listener(1110,WP.y-40,{lab:''});
  const e=crestEdges(t,{k:0,xs0:560,side:1,count:2}).sort((a,b)=>a-b),b=crestEdges(t,{k:0,xs0:560,side:-1,count:2}).sort((a,b)=>a-b);
  s+=fade(seg(p,.3,.45),dbl(e[0],e[1],WP.y+112,LC)+dbl(b[0],b[1],WP.y+112,LC));
  s+=plate('どこも 0.85 m',600,480,{size:28,color:LC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'moving']:(p,ctx)=>{
  const d=ctx?ctx.dur:8,t=(ctx?ctx.t:p*8)-d;
  return dopplerScene(t,{note:0,front:seg(p,.55,.7),back:seg(p,.75,.9)});
 },
 [K+'exag']:(p)=>dopplerScene(0,{front:1,back:1,note:seg(p,.05,.2)}),
 [K+'speed']:(p)=>{
  let s=dopplerScene(0,{note:0});
  // one crest emitted at t＝−4Td: centre and radius
  const te=-4*WP.Td,cx=srcX(te),r=WP.Vd*(0-te);
  s+=fade(seg(p,.05,.2),ring(cx,WP.y,r,{color:C.hi,w:5})+dot(cx,WP.y,7,C.hi));
  s+=arrow(cx+r-80,WP.y-70,cx+r+10,WP.y-70,{color:VCOL,w:5,head:16,g:seg(p,.2,.35)})+fade(seg(p,.2,.35),tex(Vt,cx+r-35,WP.y-100,{size:36}));
  s+=arrow(cx-r+80,WP.y-70,cx-r-10,WP.y-70,{color:VCOL,w:5,head:16,g:seg(p,.3,.45)})+fade(seg(p,.3,.45),tex(Vt,cx-r+35,WP.y-100,{size:36}));
  s+=card(400,10,400,70,label('前も 後ろも 同じ V',600,56,{size:28,color:VCOL,anchor:'middle',weight:700}),seg(p,.6,.75),VCOL);
  return s;
 },
 [K+'center']:(p)=>{
  let s=fronts(0,{centres:seg(p,.1,.3)})+siren(srcX(0),WP.y,{lab:''})+listener(1110,WP.y-40,{lab:''});
  s+=plate('赤い 点 ＝ 山を 出した 場所',600,60,{size:28,color:SC,g:seg(p,.3,.45)});
  s+=arrow(380,WP.y+120,660,WP.y+120,{color:SC,w:4,head:14,g:seg(p,.5,.7)})+plate('右へ ずれていく',520,WP.y+160,{color:SC,g:seg(p,.55,.7)});
  return s;
 },
 [K+'q3']:(p)=>{
  let s=fade(.45,dopplerScene(0,{note:0,front:1}));
  s+=card(250,30,700,120,label('前方の 間隔は どれだけ 縮む？',600,108,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.2),C.hi);
  return s;
 },
 // ================= S4 次の山を出すまでに音源も進む =================
 [K+'f0']:(p)=>{
  let s=frameBy({u:0,g:1});
  s+=fade(seg(p,.2,.35),label('時刻 0',FB.x0,FB.y+130,{size:26,color:TCOL,anchor:'middle',weight:700}));
  s+=exaggNote(seg(p,.4,.55));
  return s;
 },
 [K+'f1']:(p)=>{
  const u=lin(p,.15,.75);
  let s=frameBy({u,vt:seg(p,.15,.3)});
  s+=card(880,20,300,70,label(`時間 ${u<.999?'…':'T'}`,1030,66,{size:28,color:TCOL,anchor:'middle',weight:700}),seg(p,0,.1),TCOL);
  return s;
 },
 [K+'f2']:(p)=>frameBy({u:1,vt:1,vst:seg(p,.1,.3),c2:seg(p,.6,.75)}),
 [K+'gap']:(p)=>frameBy({u:1,vt:1,vst:1,c2:1,gap:seg(p,.15,.35)}),
 [K+'form1']:(p)=>frameBy({u:1,vt:1,vst:1,c2:1,gap:1})+card(250,4,700,132,eqRow([...LF,`=${Vt}${Tt}-${vst}${Tt}`],600,72,{size:46}),seg(p,.05,.2),LC),
 [K+'form2']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,g:.6});
  s+=card(250,4,700,132,eqRow([...LF,`=(${Vt}-${vst})${Tt}`],600,72,{size:46}),1,LC);
  s+=fade(seg(p,.15,.3),label('T で くくる',1060,66,{size:24,color:TCOL,anchor:'middle',weight:700}));
  return s;
 },
 [K+'subst']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,g:.6});
  const o=seg(p,.1,.3);
  s+=card(250,4,700,132,fade(1-o,eqRow([...LF,`=(${Vt}-${vst})${Tt}`],600,72,{size:46}))+fade(o,eqRow([...LF,`=\\dfrac{${Vt}-${vst}}{${ft}}`],600,84,{size:42})),1,LC);
  s+=fade(seg(p,.1,.3),label('T＝1/f を 代入',1060,66,{size:24,color:TCOL,anchor:'middle',weight:700}));
  s+=tag('導いた 結果',1060,160,{color:C.hi,g:seg(p,.6,.75)});
  return s;
 },
 [K+'num1']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,nums:1,vtLab:0});
  s+=card(250,4,700,132,T2(`340\\times 0.0025=0.85${MM}`,600,70,{size:44}),seg(p,.25,.4),LC);
  s+=fade(seg(p,.6,.75),label('0.85 m',(FB.x0+FB.x0+FB.VT)/2,FB.y-156,{size:28,color:LC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'num2']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,nums:1});
  s+=card(250,4,700,132,T2(`20\\times 0.0025=0.050${MM}`,600,70,{size:44}),seg(p,.05,.2),SC);
  return s;
 },
 [K+'num3']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,nums:1});
  const o=seg(p,.5,.65);
  s+=card(250,4,700,132,fade(1-o,eqRow([...LF,'=0.85-0.050=0.80\\ \\mathrm{m}'],600,72,{size:42}))+fade(o,eqRow([...LF,'=\\dfrac{340-20}{400}=0.80\\ \\mathrm{m}'],600,84,{size:40})),seg(p,.05,.2),C.hi);
  return s;
 },
 [K+'why']:(p)=>{
  let s=frameBy({u:1,vt:1,vst:1,c2:1,gap:1,nums:1,g:.55});
  s+=card(150,10,420,110,label('× 音が 遅くなった',360,76,{size:30,color:C.a,anchor:'middle',weight:700}),seg(p,.05,.2),C.a);
  s+=card(630,10,420,110,label('○ 出発点が 前へ ずれた',840,76,{size:30,color:C.hi,anchor:'middle',weight:700}),seg(p,.45,.6),C.hi);
  s+=fade(seg(p,.5,.7),ring(FB.x0+FB.k*FB.VT,FB.y+46,22,{color:C.hi,w:4}));
  return s;
 },
 // ================= S5 振動数へ直す =================
 [K+'pass']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'pass');
  let s=train(t,{sp:62});
  s+=arrow(500,140,700,140,{color:VCOL,w:6,head:18,g:seg(p,.2,.35)})+fade(seg(p,.2,.35),tex(Vt,600,110,{size:40}));
  s+=fade(seg(p,.4,.55),label('山の 間隔 0.80 m',300,430,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.5,.65),label('聞き手',900,430,{size:24,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },
 [K+'count']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'pass');
  let s=fade(.6,train(t,{sp:62}));
  s+=card(150,20,900,130,label('聞こえる 振動数 f′',600,72,{size:32,color:FC,anchor:'middle',weight:700})+label('＝ 1秒間に 聞き手を 通り過ぎる 山の 数',600,124,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),FC);
  return s;
 },
 [K+'band']:(p)=>{
  let s=strip({u:lin(p,.05,.4),cut:seg(p,.55,.85),pieces:14});
  s+=fade(seg(p,.1,.3),label('1秒間に 通り過ぎる 山の 列：340 m',600,240,{size:30,color:VCOL,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('1区切り ＝ 0.80 m',600,420,{size:28,color:LC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.6,.75),label('（区切りの 数は 省略して 描いています）',600,465,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'num']:(p)=>{
  let s=strip({pieces:14});
  s+=fade(.8,label('340 m',600,240,{size:28,color:VCOL,anchor:'middle',weight:700}));
  s+=card(200,30,800,130,T2(`340\\div 0.80=425`,600,105,{size:50}),seg(p,.05,.2),FC);
  s+=card(250,400,700,100,T2(`400${HZ}\\ \\rightarrow\\ 425${HZ}`,600,455,{size:44}),seg(p,.5,.65),FC);
  return s;
 },
 [K+'gen']:(p)=>{
  let s=card(200,40,800,130,eqRow([`${fp}=${Vt}\\div`,...LF],600,108,{size:50}),seg(p,.05,.2),FC);
  s+=card(200,240,800,130,eqRow([...LF,`=\\dfrac{${Vt}-${vst}}{${ft}}`],600,322,{size:44}),seg(p,.45,.6),LC);
  s+=fade(seg(p,.6,.75),label('↑ ここへ 代入',600,215,{size:24,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'div']:(p)=>{
  const o=seg(p,.45,.6);
  let s=card(150,40,900,150,T2(`${fp}=${Vt}\\div\\dfrac{${Vt}-${vst}}{${ft}}`,600,132,{size:48}),1,FC);
  s+=fade(seg(p,.1,.25),label('分数で 割る ＝ 逆数を 掛ける',600,250,{size:28,color:C.hi,anchor:'middle',weight:700}));
  s+=card(150,300,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,600,392,{size:50}),o,C.hi);
  return s;
 },
 [K+'den']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,600,132,{size:50}),1,C.hi);
  s+=fade(seg(p,.1,.25),label('分母 V−vs は V より 小さい',600,260,{size:28,color:C.ink,anchor:'middle',weight:700}));
  s+=card(300,316,600,134,T2(`\\dfrac{${Vt}}{${Vt}-${vst}}>1`,600,400,{size:44}),seg(p,.4,.55),C.hi);
  s+=fade(seg(p,.7,.85),label(`→ f′ ＞ f（高く 聞こえる）`,600,485,{size:28,color:FC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'chk']:(p)=>{
  let s=card(150,40,900,150,T2(`${fp}=${ft}\\times\\dfrac{${Vt}}{${Vt}-${vst}}`,600,132,{size:50}),1,C.hi);
  s+=card(150,260,900,150,T2(`400\\times\\dfrac{340}{340-20}=400\\times\\dfrac{340}{320}=425${HZ}`,600,338,{size:42}),seg(p,.05,.2),FC);
  s+=fade(seg(p,.6,.75),label('コマ送りの 425 Hz と 一致',600,470,{size:28,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 // ================= S6 元の問いと次の問い =================
 [K+'table']:(p)=>{
  const rows=[['音の 速さ V','340 m/s','340 m/s','変わらない',VCOL],['前方の 波長','0.85 m','0.80 m','短い',LC],['聞こえる 振動数','400 Hz','425 Hz','大きい',FC]];
  let s=card(100,30,1000,440,'',1,C.dim);
  s+=label('止まった 音源',600,90,{size:24,color:C.dim,anchor:'middle'})+label('近づく 音源',800,90,{size:24,color:C.dim,anchor:'middle'});
  rows.forEach(([a,b,c,d,col],i)=>{const y=180+i*100,o=seg(p,.05+i*.22,.2+i*.22);s+=fade(o,label(a,140,y,{size:30,color:col,weight:700})+label(b,600,y,{size:30,color:C.ink,anchor:'middle'})+label(c,800,y,{size:30,color:C.ink,anchor:'middle',weight:700})+label(d,1000,y,{size:28,color:i?C.hi:C.dim,anchor:'middle',weight:700}));});
  return s;
 },
 [K+'mis1']:(p)=>{
  let s=fade(.45,dopplerScene(0,{note:0}));
  s+=card(150,20,900,140,label('× 音源が 速いと 音も 速くなる',600,80,{size:32,color:C.a,anchor:'middle',weight:700})+label('音の 速さ V は 空気が 決める',600,135,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'mis2']:(p)=>{
  let s=fade(.45,dopplerScene(0,{note:0}));
  s+=card(150,20,900,140,label('× 大きくなるから 高く 聞こえる',600,80,{size:32,color:C.a,anchor:'middle',weight:700})+label('大きさ ＝ 振幅、高さ ＝ 振動数',600,135,{size:28,color:C.ink,anchor:'middle'}),seg(p,.05,.2),C.a);
  return s;
 },
 [K+'ans']:(p)=>{
  let s=dopplerScene(0,{note:0,front:seg(p,.3,.45)});
  s+=card(250,10,700,90,label('前方で 山の 間隔が 詰まる',600,68,{size:32,color:LC,anchor:'middle',weight:700}),seg(p,.3,.45),LC);
  s+=plate('1秒に 届く 山の 数が 増える',840,470,{size:28,color:FC,g:seg(p,.7,.85)});
  return s;
 },
 [K+'ans2']:(p,ctx)=>{
  const t=tSince(p,ctx,K+'ans2');
  let s=road(t,{speed:70});
  s+=card(250,30,700,100,label('近づく 救急車 → 高く 聞こえる',600,94,{size:32,color:C.hi,anchor:'middle',weight:700}),seg(p,.1,.25),C.hi);
  return s;
 },
 [K+'next1']:(p)=>{
  let s=fronts(0,{xs0:500})+siren(srcX(0,WP,WP.k,500),WP.y,{lab:''})+listener(150,WP.y-40,{lab:''});
  s+=plate('後ろ側の 波長は？',250,470,{size:30,color:LC,g:seg(p,.2,.35)});
  s+=plate('聞こえる 振動数は？',800,470,{size:30,color:FC,g:seg(p,.5,.65)});
  return s;
 },
 [K+'next2']:(p)=>{
  let s=card(200,110,800,200,label('通り過ぎると、なぜ ガクッと 下がる？',600,222,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi);
  return s;
 },
 [K+'bye']:(p)=>{
  let s=card(200,110,800,200,label('次の回',600,170,{size:26,color:C.dim,anchor:'middle'})+label('遠ざかる 音源の 後ろでは？',600,250,{size:42,color:C.hi,anchor:'middle',weight:700}),1,C.hi);
  s+=fade(seg(p,.3,.5),label('ドップラー効果・深く学ぶ 2/3 へ',1080,470,{size:26,color:C.dim,anchor:'end'}));
  return s;
 },
};
