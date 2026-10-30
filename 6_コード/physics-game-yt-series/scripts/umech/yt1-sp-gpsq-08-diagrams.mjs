// 特別編 v3「疑問20連発」Q8 (ys-sp-gpsq-08) — 図。Stage 1200×515。担当B。
// v2 パート2のカウンター（定義タグつき）と、v1 パート2の「合わなくなる」2つの時計を import して再利用（編集しない）。
// クイズの見た目は v2 パート2の quiz1 と同じ（カウントダウンだけ pause 2.5 秒に合わせて共通部品で描く）。
import {C,seg,fade,label,line,dot,draw,clamp} from './anim.mjs';
import {okMark,tag,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {earth,spGps2Diagrams as V1} from './yt1-sp-gps-2-diagrams.mjs';
import {spGps22Diagrams as V2} from './yt1-sp-gps2-2-diagrams.mjs';
import {qCard,wrapQ,qBadge,countdown,option} from './yt1-sp-gpsq-B-common.mjs';

const K='sp-gpsq-08:';
const TC=C.t, HC=C.hi;

function pendulum(x,y,L,t,g=1){const a=.45*Math.sin(t*2.6),bx=x+L*Math.sin(a),by=y+L*Math.cos(a);return fade(g,line(x-30,y,x+30,y,{color:C.dim,w:4})+line(x,y,bx,by,{color:C.ink,w:3})+dot(bx,by,14,TC));}
function atom(x,y,s,t,{g=1,col='#7fb3ff'}={}){
 let o=dot(x,y,12*s,'#c9485a')+dot(x-3*s,y-3*s,4*s,'#ffb3bd',.6);
 [[38,0,.7],[62,1.1,-.5],[86,2.2,.35]].forEach(([r,ph,w])=>{o+=`<ellipse cx="${x}" cy="${y}" rx="${r*s}" ry="${r*s*.42}" transform="rotate(${(ph*57.3).toFixed(1)} ${x} ${y})" fill="none" stroke="${col}" stroke-width="2" opacity=".7"/>`;const b=t*w*3+ph,ex=r*s*Math.cos(b),ey=r*s*.42*Math.sin(b);o+=dot(x+ex*Math.cos(ph)-ey*Math.sin(ph),y+ex*Math.sin(ph)+ey*Math.cos(ph),6*s,col);});
 return fade(g,o);
}

// mode：0 問い / 1 正解が光る / 2 正解＋「昔は地球の自転」
function quiz(p,ctx,mode){
 const t=sceneT(p,ctx),gl=mode===1?seg(p,.03,.15):mode===2?1:0;
 let s=qBadge(70,58)+label('「1秒」の 長さは、何で 決まっている？',120,70,{size:32,color:C.ink,weight:700});
 const W=330,Hh=220,Y=120,xs=[70,435,800];
 const st=i=>mode?(i===2?gl:-gl):0;
 s+=option(xs[0],Y,W,Hh,'A',earth(xs[0]+W/2,Y+120,52,{rot:t*.8})+label('地球の 自転',xs[0]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(0),g:mode?1:seg(p,.0,.15)});
 s+=option(xs[1],Y,W,Hh,'B',pendulum(xs[1]+W/2,Y+30,120,t)+label('振り子',xs[1]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(1),g:mode?1:seg(p,.25,.4)});
 s+=option(xs[2],Y,W,Hh,'C',atom(xs[2]+W/2,Y+110,.85,t)+label('原子',xs[2]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(2),g:mode?1:seg(p,.42,.55)});
 if(!mode){s+=countdown(600,440,ctx,{off:.1,g:seg(p,.5,.6)})+fade(seg(p,.5,.6),label('考えて みて',550,451,{size:24,color:C.dim,anchor:'end'}));}
 else{
  s+=okMark(xs[2]+W-40,Y+40,mode===2?1:seg(p,.1,.2));
  s+=tag('今',xs[2]+W/2,Y-6,{color:HC,size:24,g:mode===2?1:seg(p,.12,.22)});
 }
 if(mode===2){
  // 昔は地球の自転：1日の長さが少しずつ揺らぐ
  const g=seg(p,.05,.2),gw=seg(p,.5,.65);
  s+=tag('昔',xs[0]+W/2,Y-6,{color:C.dim,size:24,g});
  let pts=[];for(let x=0;x<=520;x+=4)pts.push([110+x,430+14*gw*Math.sin(x/37+t*1.5)+8*gw*Math.sin(x/13-t)]);
  s+=fade(seg(p,.4,.5),line(110,430,630,430,{color:C.faint,w:2,dash:'6 6'})+draw(pts,1,{color:C.E,w:3})+label('地球の 1日の 長さ：少しずつ 揺らぐ',110,390,{size:26,color:C.E,weight:700}));
  s+=fade(seg(p,.7,.82),label('原子は 揺らがない',915,440,{size:30,color:HC,anchor:'middle',weight:700}));
 }
 return s;
}

export const spGpsq08Diagrams=wrapQ(8,{
 [K+'card']:(p)=>qCard(8,['そもそも、「1秒」の 長さは、','何で 決まっているのでしょうか？'],p),
 [K+'quiz']:(p,ctx)=>quiz(p,ctx,0),
 // 「答えは、原子です」で正解が光り、そのあと v2 のカウンター（91億9263万1770回 → 1秒、定義タグ）へ
 [K+'answer']:(p,ctx)=>{
  const a=seg(p,.2,.27),q=clamp((p-.22)/.78);
  return fade(1-a,quiz(p,ctx,1))+fade(a,V2['sp-gps2-2:counter'](q,ctx));
 },
 [K+'history']:(p,ctx)=>quiz(p,ctx,2),
 [K+'bridge']:(p,ctx)=>V1['sp-gps-2:drift'](p,ctx),
});
