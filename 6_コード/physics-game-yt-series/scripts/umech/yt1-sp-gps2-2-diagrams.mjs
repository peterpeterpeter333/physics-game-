// 特別編 v2「GPS と相対性理論」パート2/4 (ys-sp-gps2-2) — 図。Stage 1200×515。難しさ★★。
// v1 パート2の図（yt1-sp-gps-2-diagrams.mjs）を import して再利用する（編集しない。キーは再エクスポートしない）。
// 共通の見た目：地球は青い円、衛星は金色の本体に青い太陽電池板、時計はアナログの顔に「地上」「衛星」の札。
// 色：v 紫、時間 金、距離・高さ 水色、遅れ 青 #6f9dff（下向き・−）、進み 赤（上向き・＋）、差・強調 黄。
import {C,seg,lin,fade,label,line,rect,dot,ring,draw,arrow,clamp,mix,poly,smooth} from './anim.mjs';
import {card,tag,cross,okMark,sceneT,wavy} from './yt1-hs-a-nucleus-1-diagrams.mjs';
import {spGps2Diagrams as V1,earth,sat,clock,SLOW,FAST,EARTH,GOLD} from './yt1-sp-gps-2-diagrams.mjs';

const K='sp-gps2-2:';
const V=k=>V1['sp-gps-2:'+k];
const PI=Math.PI;
const VC=C.v, TC=C.t, XC=C.x, HC=C.hi;

// ---------- 階段（★1〜★4）：いまの段が光る ----------
export function stairs(x,y,lit,{g=1,from=null,u=1,sw=74,sh=16}={}){
 // x,y：左下。lit：光る段（1〜4）。from→lit を u で切り替える。
 let s=label('難しさ',x-14,y-4,{size:22,color:C.dim,anchor:'end'});
 for(let i=0;i<4;i++){
  const n=i+1,h=(i+1)*sh,X=x+i*sw;
  const on=from==null?(n===lit?1:0):(n===lit?u:(n===from?1-u:0));
  const done=n<(from==null?lit:mix(from,lit,u))?1:0;
  const fill=on>0?HC:(done?C.dim:C.faint);
  s+=rect(X,y-h,sw-4,h,{fill:on>0?HC:fill,fo:on>0?.25+.6*on:(done?.35:.25),stroke:on>.5?HC:C.faint,sw:on>.5?3:1.5,rx:3});
  s+=label(`★${n}`,X+(sw-4)/2,y-h-8,{size:22,color:on>.5?HC:(done?C.dim:C.faint),anchor:'middle',weight:700});
  if(on>0)s+=fade(on,ring(X+(sw-4)/2,y-h-16,22,{color:HC,w:2}));
 }
 return fade(g,s);
}

// ---------- クイズ：Q. カード＋選択肢＋カウントダウンの輪 ----------
const qBadge=(x,y,g=1)=>fade(g,dot(x,y,30,HC)+label('Q.',x,y+11,{size:30,color:'#1b1300',anchor:'middle',weight:700}));
// 考える時間：pause の間に輪が減り、数字 3・2・1（tick の効果音に合わせる：off 秒後から 1 秒ごと）
function countdown(x,y,ctx,{off=.2,r=34,g=1}={}){
 if(!ctx||!ctx.cue)return '';
 const pause=ctx.cue.pause||0,vEnd=ctx.dur-pause,tt=ctx.t-vEnd;
 if(tt<-.3)return fade(g,ring(x,y,r,{color:C.faint,w:6}));
 const u=clamp((tt-off)/3),a=-PI/2+2*PI*(1-u);
 const left=1-u;let s=ring(x,y,r,{color:C.faint,w:6});
 if(left>.001)s+=left>.999?ring(x,y,r,{color:HC,w:6}):`<path d="M${x} ${y-r} A${r} ${r} 0 ${left>.5?1:0} 1 ${(x+r*Math.cos(a)).toFixed(1)} ${(y+r*Math.sin(a)).toFixed(1)}" fill="none" stroke="${HC}" stroke-width="6"/>`;
 const k=tt<off?3:Math.max(0,3-Math.floor(tt-off));
 s+=label(k>0?String(k):'！',x,y+12,{size:34,color:HC,anchor:'middle',weight:700});
 return fade(g,s);
}
// 選択肢の箱。st：0 ふつう、1 正解で光る、-1 外れで暗く
function option(x,y,w,h,letter,inner,{g=1,st=0,col=C.ink}={}){
 const glow=st>0?st:0,dim=st<0?-st:0;
 let s='';
 if(glow>0)s+=fade(glow,rect(x-8,y-8,w+16,h+16,{fill:HC,fo:.12,stroke:HC,sw:6,rx:20}));
 s+=card(x,y,w,h,dot(x+34,y+34,20,glow>.5?HC:col,glow>.5?1:.25)+label(letter,x+34,y+43,{size:26,color:glow>.5?'#1b1300':col,anchor:'middle',weight:700})+inner,1,glow>.5?HC:col);
 return fade(g*(1-.65*dim),s);
}

// ---------- 小道具 ----------
const slowArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y-L/2,x,y+L/2,{color:SLOW,w:8,head:24})+label('−',x+30,y+size*.35,{size,color:SLOW,weight:700}));
const fastArrow=(x,y,L,{g=1,size=40}={})=>fade(g,arrow(x,y+L/2,x,y-L/2,{color:FAST,w:8,head:24})+label('＋',x+26,y+size*.35,{size,color:FAST,weight:700}));
const streaks=(x,y,g=1,len=70)=>fade(g,[-14,0,14].map((d,i)=>line(x-len-i*12,y+d,x-28,y+d,{color:VC,w:3,opacity:.7})).join(''));
function pendulum(x,y,L,t,g=1){const a=.45*Math.sin(t*2.6),bx=x+L*Math.sin(a),by=y+L*Math.cos(a);return fade(g,line(x-30,y,x+30,y,{color:C.dim,w:4})+line(x,y,bx,by,{color:C.ink,w:3})+dot(bx,by,14,TC));}
function atom(x,y,s,t,{g=1,col='#7fb3ff'}={}){
 let o=dot(x,y,12*s,'#c9485a')+dot(x-3*s,y-3*s,4*s,'#ffb3bd',.6);
 [[38,0,.7],[62,1.1,-.5],[86,2.2,.35]].forEach(([r,ph,w])=>{o+=`<ellipse cx="${x}" cy="${y}" rx="${r*s}" ry="${r*s*.42}" transform="rotate(${(ph*57.3).toFixed(1)} ${x} ${y})" fill="none" stroke="${col}" stroke-width="2" opacity=".7"/>`;const b=t*w*3+ph,ex=r*s*Math.cos(b),ey=r*s*.42*Math.sin(b);o+=dot(x+ex*Math.cos(ph)-ey*Math.sin(ph),y+ex*Math.sin(ph)+ey*Math.cos(ph),6*s,col);});
 return fade(g,o);
}
// 綱引きの人（v1 と同じ形）
const fig=(x,dir,col,lean=0)=>{const hx=x-dir*(14+lean),hy=232;return dot(hx,hy,15,col)+line(hx,hy+15,x+dir*10,330,{color:col,w:7})+line(x+dir*10,330,x+dir*34,385,{color:col,w:7})+line(x+dir*10,330,x-dir*8,390,{color:col,w:7})+line(hx+dir*2,hy+40,x+dir*40,300,{color:col,w:6});};

// ---------- 2枚のカード（速さ・高さ）：v1 と同じ形 ----------
function twoCards(p,t,{g=1}={}){
 let s=card(70,70,500,330,label('速さ',320,130,{size:40,color:VC,anchor:'middle',weight:700})+label('とんでもなく 速い',320,380,{size:32,color:VC,anchor:'middle',weight:700}),g,VC);
 const sx=150+((t*90)%160);s+=fade(g,streaks(sx,250,1)+sat(sx,250,.9,{a:0})+arrow(sx+48,250,sx+128,250,{color:VC,w:5,head:16}));
 s+=card(630,70,500,330,label('高さ',880,130,{size:40,color:XC,anchor:'middle',weight:700})+label('2万 km も 高い',880,380,{size:32,color:XC,anchor:'middle',weight:700}),g,XC);
 s+=fade(g,`<path d="M690 340 Q880 310 1070 340" fill="none" stroke="${EARTH}" stroke-width="10"/>`+line(880,325,880,195,{color:XC,w:3,dash:'8 6'})+sat(880,180,.9)+label('地上',780,325,{size:24,color:C.dim,anchor:'middle'}));
 return s;
}

// ---------- 日本地図（中部・近畿）：経緯度 → 画面 ----------
const MK=75,ML0=130.8,MLA0=39,MX=40,MY=40,MCOS=Math.cos(36*PI/180);
const MP=([la,lo])=>[MX+(lo-ML0)*MK*MCOS,MY+(MLA0-la)*MK];
const HONSHU=[[41.5,140.9],[41.4,141.4],[40.5,141.5],[39.6,142.0],[39.3,141.9],[38.9,141.6],[38.3,141.5],[38.25,141.0],[37.8,140.95],[37.0,140.9],[36.6,140.65],[35.7,140.85],[35.2,140.4],[34.9,139.85],[35.3,139.8],[35.6,140.1],[35.65,139.8],[35.45,139.65],[35.15,139.65],[35.25,139.15],[34.6,138.85],[35.1,138.85],[34.6,138.2],[34.7,137.7],[34.6,137.0],[35.0,136.85],[34.95,136.65],[34.7,136.55],[34.48,136.85],[34.3,136.9],[34.05,136.2],[33.45,135.75],[33.9,135.1],[34.2,135.15],[34.55,135.45],[34.68,135.45],[34.68,135.2],[34.65,134.95],[34.8,134.7],[34.6,133.9],[34.45,133.4],[34.35,132.45],[34.15,132.2],[33.95,132.1],[33.95,130.9],[34.4,131.4],[34.7,131.85],[34.9,132.1],[35.4,132.6],[35.55,133.2],[35.55,134.2],[35.65,134.6],[35.75,135.2],[35.65,136.05],[36.0,136.1],[36.6,136.6],[36.9,136.75],[37.5,137.35],[37.05,137.0],[36.75,137.2],[37.2,138.25],[37.95,139.05],[38.2,139.45],[38.9,139.85],[39.9,139.7],[40.2,140.0],[40.8,140.2],[41.25,140.35],[40.85,140.75]];
const SHIKOKU=[[34.05,132.95],[34.3,133.0],[34.35,134.0],[34.2,134.6],[33.85,134.75],[33.25,134.2],[33.55,133.55],[32.75,133.0],[33.0,132.5],[33.35,132.0],[33.85,132.7]];
const KYUSHU=[[33.95,130.9],[33.6,130.4],[33.5,129.85],[33.15,129.7],[32.75,129.85],[32.6,130.15],[32.8,130.6],[32.2,130.2],[31.6,130.25],[31.2,130.6],[31.4,130.9],[31.0,131.05],[31.4,131.35],[31.9,131.45],[32.6,131.7],[33.25,131.7],[33.6,131.6]];
function japanMap(g=1){
 const land=a=>poly(a.map(MP),{fill:'#2f5a45',fo:1,stroke:'#7fbf9a',sw:2});
 return fade(g,`<defs><clipPath id="gps22map"><rect x="30" y="30" width="670" height="470" rx="16"/></clipPath></defs>`+rect(30,30,670,470,{fill:'#0f1f3a',fo:1,stroke:C.faint,rx:16})+`<g clip-path="url(#gps22map)">${land(HONSHU)+land(SHIKOKU)+land(KYUSHU)}</g>`);
}
const TOKYO=MP([35.68,139.77]),OSAKA=MP([34.69,135.50]);

// ---------- エネルギーの段（v1 と同じ高さ） ----------
const LV=[420,210,130,95];
function levels(x0,x1,{g=1,hi=[]}={}){
 let s=arrow(x0-50,450,x0-50,60,{color:C.E,w:3,head:14})+label('エネルギー',x0-50,46,{size:24,color:C.E,anchor:'middle',weight:700});
 LV.forEach((y,i)=>{s+=line(x0,y,x1,y,{color:hi.includes(i)?HC:C.ink,w:hi.includes(i)?5:4});});
 return fade(g,s);
}
const fmtN=n=>Math.floor(n).toLocaleString('en-US');

// ---------- 予想の場面（q16〜q21 を一続きで描く） ----------
// st：0 予想 / 1 両方 / 2 速さ / 3 高さ / 4 綱引き / 5 決着は最後
function guessScene(st,p,ctx){
 const t=sceneT(p,ctx);
 const at=(k,a,b)=>st>k?1:st<k?0:seg(p,a,b);
 const glow=at(1,.15,.35),swap=at(1,.45,.85),rope=at(1,.7,.95);
 const nameS=at(2,.05,.25),arrS=at(2,.45,.65),nameH=at(3,.05,.25),arrH=at(3,.45,.65);
 const pull=at(4,.05,.3),fin=at(5,.1,.3);
 let s='';
 // 問い（予想の間だけ）
 s+=fade(1-swap,qBadge(70,58)+label('衛星の 時計は、地上より…',120,70,{size:32,color:C.ink,weight:700}));
 // 2枚のカード：＋（左・赤）は右へ、−（右・青）は左へ入れかわり、綱引きの旗になる
 const B=(a,b)=>a.map((v,i)=>mix(v,b[i],smooth(swap)));
 const arc=110*Math.sin(PI*smooth(swap));
 let [px,py,pw,ph]=B([110,110,430,290],[740,40,340,130]);
 let [mx_,my_,mw,mh]=B([660,110,430,290],[120,40,340,130]);
 py-=arc*.6;my_+=arc;
 const box=(x,y,w,h,col,big,small,g)=>{let o='';if(glow>0)o+=fade(glow*(1-swap*.6),rect(x-8,y-8,w+16,h+16,{fill:HC,fo:.12,stroke:HC,sw:6,rx:20}));o+=card(x,y,w,h,fade(1-seg(swap,0,.4),big)+fade(seg(swap,.6,1),small),g,glow>.5&&swap<.5?HC:col);return o;};
 const bigP=fastArrow(px+110,py+155,150)+label('速く',px+300,py+135,{size:44,color:FAST,anchor:'middle',weight:700})+label('進む？',px+300,py+195,{size:44,color:FAST,anchor:'middle',weight:700});
 const bigM=slowArrow(mx_+110,my_+155,150)+label('遅れる？',mx_+300,my_+170,{size:44,color:SLOW,anchor:'middle',weight:700});
 const smP=fade(1-nameH,label('進める ＋',px+pw/2,py+80,{size:36,color:FAST,anchor:'middle',weight:700}))+fade(nameH,label('高さ',px+pw/2,py+62,{size:38,color:FAST,anchor:'middle',weight:700})+label('進める ＋',px+pw/2,py+108,{size:28,color:FAST,anchor:'middle',weight:700}));
 const smM=fade(1-nameS,label('遅らせる −',mx_+mw/2,my_+80,{size:36,color:SLOW,anchor:'middle',weight:700}))+fade(nameS,label('速さ',mx_+mw/2,my_+62,{size:38,color:SLOW,anchor:'middle',weight:700})+label('遅らせる −',mx_+mw/2,my_+108,{size:28,color:SLOW,anchor:'middle',weight:700}));
 s+=box(px,py,pw,ph,FAST,bigP,smP,1)+box(mx_,my_,mw,mh,SLOW,bigM,smM,1);
 // カウントダウン（予想の間）
 if(st===0)s+=countdown(600,465,ctx,{off:.4,g:seg(p,.3,.4)})+fade(seg(p,.3,.4),label('考えて みて',550,476,{size:24,color:C.dim,anchor:'end'}));
 // 「両方！」
 const both=at(1,.12,.3);
 s+=fade(both*(1-seg(swap,0,.3)),label('両方！',600,478,{size:60,color:HC,anchor:'middle',weight:700})+arrow(500,450,420,410,{color:HC,w:4,head:14})+arrow(700,450,780,410,{color:HC,w:4,head:14}));
 // 綱引き
 const k=pull*(22*Math.sin(t*1.7)+8*Math.sin(t*4.3))+(1-pull)*0;
 s+=fade(rope,line(150+k,300,1050+k,300,{color:'#c8a46a',w:8})+dot(600+k,300,16,HC)+line(600,200,600,420,{color:C.dim,w:2,dash:'8 8'}));
 const lean=pull*6;
 s+=fade(rope,[220,300,380].map(x=>fig(x+k,-1,SLOW,lean)).join('')+[820,900,980].map(x=>fig(x+k,1,FAST,lean)).join(''));
 // 速さ：横に速く動く衛星と、青い下向き矢印
 const sx=150+((t*120)%280);
 s+=fade(nameS,streaks(sx,195,1,60)+sat(sx,195,.6,{a:0})+arrow(sx+36,195,sx+90,195,{color:VC,w:4,head:12}));
 s+=slowArrow(510,105,110,{g:arrS});
 // 高さ：地上の弧と、高い所の衛星、赤い上向き矢印
 s+=fade(nameH,`<path d="M780 470 Q900 445 1020 470" fill="none" stroke="${EARTH}" stroke-width="8"/>`+line(1060,465,1060,190,{color:XC,w:3,dash:'8 6'})+sat(1060,180,.55)+label('2万 km',1080,330,{size:24,color:XC,weight:700}));
 s+=fastArrow(1130,105,110,{g:arrH});
 // 綱引きの札
 s+=fade(st===4?seg(p,.3,.5):0,label('遅らせる 力 と 進める 力',600,480,{size:30,color:HC,anchor:'middle',weight:700}));
 s+=fade(fin,label('？',600+k,262,{size:48,color:HC,anchor:'middle',weight:700})+label('決着は 最後に',600,480,{size:32,color:HC,anchor:'middle',weight:700}));
 return s;
}

export const spGps22Diagrams={
 // ================= S1 衛星は、とんでもなく速い =================
 [K+'orbits']:(p,ctx)=>{
  let s=V('orbits')(p,ctx);
  // v1 の高さカード（2万200 km）を隠して、ナレーションどおり「約 2万 km」にする
  s+=rect(745,245,430,175,{fill:C.bg,fo:1,stroke:C.bg,rx:0});
  s+=card(760,260,400,140,label('地上からの 高さ',960,305,{size:26,color:C.dim,anchor:'middle'})+label('約 2万 km',960,365,{size:40,color:XC,anchor:'middle',weight:700}),seg(p,.5,.65),XC);
  s+=stairs(860,500,2,{g:seg(p,.0,.08)*(1-seg(p,.9,1)),sw:70,sh:14});
  return s;
 },
 [K+'planes']:(p,ctx)=>V('planes')(p,ctx),
 [K+'cannon']:(p,ctx)=>V('cannon')(p,ctx),
 [K+'speed']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  // 1秒ごとに 3.9 km：物差しの上を進む衛星
  const x0=90,x1=1110,y=130,u=(t*.55)%1,ticks=6;
  let s=line(x0,y+40,x1,y+40,{color:C.dim,w:3});
  for(let i=0;i<=ticks;i++){const X=mix(x0,x1,i/ticks);s+=line(X,y+30,X,y+50,{color:C.dim,w:2})+(i?label(`${i}秒`,X,y+80,{size:22,color:TC,anchor:'middle'}):label('0',X,y+80,{size:22,color:TC,anchor:'middle'}));}
  const sx=mix(x0,x1,u);s+=streaks(sx,y,1,60)+sat(sx,y,.6,{a:0});
  s+=fade(seg(p,.03,.12),brace2(mix(x0,x1,0),mix(x0,x1,1/ticks),y+95)+label('3.9 km',mix(x0,x1,.5/ticks),y+130,{size:26,color:VC,anchor:'middle',weight:700}));
  s+=card(40,300,300,120,label('秒速',190,345,{size:26,color:C.dim,anchor:'middle'})+label('約 3.9 km',190,400,{size:40,color:VC,anchor:'middle',weight:700}),seg(p,.05,.18),VC);
  s+=fade(seg(p,.45,.58),label('× 3600',465,375,{size:40,color:TC,anchor:'middle',weight:700})+label('（1時間 ＝ 3600秒）',465,425,{size:22,color:TC,anchor:'middle'}));
  s+=card(590,300,560,120,label('時速',870,345,{size:26,color:C.dim,anchor:'middle'})+label('約 1万4,000 km',870,400,{size:44,color:VC,anchor:'middle',weight:700}),seg(p,.55,.7),HC);
  s+=fade(seg(p,.72,.85),label('3.9 × 3600 ＝ 14,040',870,470,{size:26,color:C.dim,anchor:'middle'}));
  return s;
 },
 [K+'japan']:(p,ctx)=>{
  const t=sceneT(p,ctx),u=seg(p,.06,.42),dist=Math.hypot(OSAKA[0]-TOKYO[0],OSAKA[1]-TOKYO[1]);
  let s=japanMap();
  s+=dot(TOKYO[0],TOKYO[1],9,C.ink)+label('東京',TOKYO[0]+16,TOKYO[1]+30,{size:26,color:C.ink,weight:700});
  s+=dot(OSAKA[0],OSAKA[1],9,C.ink)+label('大阪',OSAKA[0]-14,OSAKA[1]+36,{size:26,color:C.ink,weight:700,anchor:'end'});
  s+=fade(seg(p,0,.06),line(TOKYO[0],TOKYO[1],OSAKA[0],OSAKA[1],{color:C.dim,w:2,dash:'6 8'})+label('直線 約 400 km',(TOKYO[0]+OSAKA[0])/2+10,(TOKYO[1]+OSAKA[1])/2-26,{size:24,color:XC,anchor:'middle',weight:700}));
  // 衛星（の速さで進む点）：びゅっと横切る
  const sx=mix(TOKYO[0],OSAKA[0],u),sy=mix(TOKYO[1],OSAKA[1],u);
  if(u>0)s+=draw([[TOKYO[0],TOKYO[1]],[sx,sy]],1,{color:VC,w:6,opacity:.85});
  const ang=Math.atan2(OSAKA[1]-TOKYO[1],OSAKA[0]-TOKYO[0]);
  if(u>0&&u<1)for(let i=1;i<=4;i++)s+=dot(sx-Math.cos(ang)*i*14,sy-Math.sin(ang)*i*14,10-i*2,VC,.5);
  s+=dot(sx,sy,13,HC)+ring(sx,sy,20,{color:HC,w:3});
  // 新幹線：同じ時間で 約 9 km（約 6 px）
  const tx=TOKYO[0]+Math.cos(ang)*(u*9/400*dist),ty=TOKYO[1]+Math.sin(ang)*(u*9/400*dist);
  s+=rect(tx-14,ty-26,28,14,{fill:'#e8ecf2',fo:1,stroke:'#3d7bff',rx:6});
  // 時計（実際の時間に直した経過）
  const sec=Math.round(u*103);
  s+=card(730,40,440,120,label('経過',800,115,{size:26,color:C.dim,anchor:'middle'})+label(`${Math.floor(sec/60)}分 ${String(sec%60).padStart(2,'0')}秒`,1000,120,{size:48,color:TC,anchor:'middle',weight:700}),1,TC);
  // 競走のバー（東京→大阪 400 km）
  const bx=750,bw=400;
  s+=label('衛星の 速さ',bx,215,{size:26,color:VC,weight:700})+rect(bx,230,bw,26,{fill:C.faint,fo:.3,stroke:C.faint,rx:6})+rect(bx,230,bw*u,26,{fill:VC,fo:.8,stroke:VC,rx:6});
  s+=label('新幹線（時速 320 km）',bx,305,{size:26,color:C.ink,weight:700})+rect(bx,320,bw,26,{fill:C.faint,fo:.3,stroke:C.faint,rx:6})+rect(bx,320,Math.max(2,bw*u*9/400),26,{fill:C.ink,fo:.8,stroke:C.ink,rx:6});
  s+=fade(seg(p,.42,.5),label('到着！',bx+bw,215,{size:26,color:HC,anchor:'end',weight:700})+label('まだ 約 9 km',bx+bw,378,{size:24,color:C.dim,anchor:'end',weight:700}));
  s+=card(750,395,400,95,label('約 40 倍',950,460,{size:48,color:HC,anchor:'middle',weight:700}),seg(p,.55,.66),HC);
  s+=fade(seg(p,.44,.52),label('2分 かからない',365,480,{size:30,color:HC,anchor:'middle',weight:700}));
  return s;
 },
 [K+'period']:(p,ctx)=>{
  const cx=320,cy=262,R=210,u=seg(p,.05,.85),a=-PI/2+2*PI*u;
  let s=ring(cx,cy,R,{color:C.faint,w:2,dash:'6 8'})+earth(cx,cy,R*6371/26571,{rot:u*PI});
  const n=Math.max(2,Math.ceil(u*120)+1);
  s+=draw([...Array(n)].map((_,i)=>{const b=-PI/2+2*PI*u*i/(n-1);return [cx+R*Math.cos(b),cy+R*Math.sin(b)];}),1,{color:TC,w:4});
  s+=sat(cx+R*Math.cos(a),cy+R*Math.sin(a),.6,{a:a+PI/2});
  const hrs=u*12;
  s+=card(640,90,500,170,label('経過',890,140,{size:26,color:C.dim,anchor:'middle'})+label(`${Math.floor(hrs)}時間`,890,215,{size:56,color:TC,anchor:'middle',weight:700}),1,TC);
  s+=card(640,300,500,130,label('約 12時間で 1周',890,380,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.8,.9),HC);
  return s;
 },
 [K+'two']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=twoCards(p,t,{g:seg(p,.02,.15)});
  const g=seg(p,.55,.7);
  s+=fade(g,label('この 2つが、この後の 主役',600,470,{size:34,color:HC,anchor:'middle',weight:700}));
  s+=fade(g,rect(60,60,520,350,{fill:'none',fo:0,stroke:HC,sw:4,rx:18})+rect(620,60,520,350,{fill:'none',fo:0,stroke:HC,sw:4,rx:18}));
  return s;
 },
 // ================= S2 1秒は、原子が決めている =================
 [K+'onboard']:(p,ctx)=>V('onboard')(p,ctx),
 [K+'quiz1']:(p,ctx)=>quiz1(p,ctx,0),
 [K+'quiz1a']:(p,ctx)=>quiz1(p,ctx,1),
 [K+'levels']:(p,ctx)=>{
  const t=sceneT(p,ctx),x0=180,x1=600;
  let s=levels(x0,x1,{g:seg(p,.02,.12),hi:p>.45?[0,1]:[]});
  // 電子：段から段へ跳ぶ（間には止まらない）。下の段へ移るときに波を出す
  const seq=[0,1,0,2,0,1,0,3],per=1.6,step=Math.floor(t/per)%seq.length,fr=(t/per)%1,nxt=seq[(step+1)%seq.length];
  const y=fr<.8?LV[seq[step]]:mix(LV[seq[step]],LV[nxt],(fr-.8)/.2);
  s+=fade(seg(p,.05,.15),dot(390,y-16,14,'#7fb3ff')+ring(390,y-16,14,{color:'#cfe0ff',w:2}));
  const down=seq[step]!==0&&nxt===0;
  const wv=down?seg(fr,.8,.95):(step>0&&seq[step-1]!==0&&seq[step]===0?1-seg(fr,.1,.5):0);
  s+=fade(seg(p,.1,.2)*wv,wavy(420,y-16,600,y-90,{color:HC,amp:9,lam:24,ph:t*3,w:4,head:16}));
  s+=fade(seg(p,.15,.3),label('段の 間には いられない',390,(LV[0]+LV[1])/2+10,{size:24,color:C.a,anchor:'middle',weight:700}));
  s+=card(680,60,470,150,label('段を 移るときに',915,120,{size:30,color:C.ink,anchor:'middle',weight:700})+label('光（波）を 出す',915,175,{size:34,color:HC,anchor:'middle',weight:700}),seg(p,.4,.52),HC);
  s+=card(680,240,470,190,label('その 振動数は',915,300,{size:30,color:C.ink,anchor:'middle',weight:700})+label('原子の 種類 ごとに',915,355,{size:30,color:C.ink,anchor:'middle',weight:700})+label('ぴったり 決まる',915,410,{size:36,color:HC,anchor:'middle',weight:700}),seg(p,.62,.75),HC);
  return s;
 },
 [K+'cesium']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=atom(230,250,1.6,t);
  s+=label('セシウム 原子',230,470,{size:30,color:C.ink,anchor:'middle',weight:700});
  // 出ていく波（速い振動）
  let pts=[];for(let x=0;x<=280;x+=2)pts.push([400+x,250+34*Math.sin(x/7-t*14)*Math.min(1,x/40)]);
  s+=fade(seg(p,.05,.2),draw(pts,1,{color:HC,w:3}));
  s+=card(720,70,440,150,label('1 秒に',940,130,{size:32,color:TC,anchor:'middle',weight:700})+label('振動する 回数',940,185,{size:30,color:C.ink,anchor:'middle',weight:700}),seg(p,.1,.25),TC);
  s+=card(720,250,440,190,label('91億',940,315,{size:48,color:HC,anchor:'middle',weight:700})+label('9263万 1770 回',940,390,{size:44,color:HC,anchor:'middle',weight:700}),seg(p,.35,.5),HC);
  return s;
 },
 [K+'counter']:(p,ctx)=>{
  const u=seg(p,.03,.62),e=1-Math.pow(1-u,3),N=9192631770,n=u>=1?N:Math.floor(N*e);
  let s=card(110,50,980,170,label(`${fmtN(n)}`,600,170,{size:84,color:u>=1?HC:C.ink,anchor:'middle',weight:700}),1,u>=1?HC:C.faint);
  s+=label('数えた 振動の 回数',130,40,{size:24,color:C.dim});
  // 1秒の棒が満ちる
  s+=rect(150,260,900,30,{fill:C.faint,fo:.35,stroke:C.faint,rx:8})+rect(150,260,900*e,30,{fill:TC,fo:.85,stroke:TC,rx:8});
  s+=label('0',150,325,{size:24,color:TC,anchor:'middle'})+label('1 秒',1050,325,{size:28,color:TC,anchor:'middle',weight:700});
  const done=seg(p,.62,.72);
  s+=fade(done,label('91億 9263万 1770 回 数えたら ＝ 1 秒',600,400,{size:38,color:HC,anchor:'middle',weight:700}));
  if(done>0&&done<1)s+=fade(1-done,ring(1050,275,30+60*done,{color:HC,w:4}));
  s+=tag('定義',600,470,{color:C.hi,size:28,g:seg(p,.74,.84)});
  return s;
 },
 [K+'precise']:(p,ctx)=>V('precise')(p,ctx),
 // ================= S3 予想してください =================
 [K+'drift']:(p,ctx)=>V('drift')(p,ctx),
 [K+'quiz2']:(p,ctx)=>guessScene(0,p,ctx),
 [K+'quiz2a']:(p,ctx)=>guessScene(1,p,ctx),
 [K+'quiz2b']:(p,ctx)=>guessScene(2,p,ctx),
 [K+'quiz2c']:(p,ctx)=>guessScene(3,p,ctx),
 [K+'quiz2d']:(p,ctx)=>guessScene(4,p,ctx),
 [K+'quiz2e']:(p,ctx)=>guessScene(5,p,ctx),
 [K+'why']:(p,ctx)=>{
  const t=sceneT(p,ctx),w=Math.sin(t*2.2);
  let s=clock(260,215,130,{sec:t*6,name:'地上',col:C.ink});
  s+=clock(940,215,130,{sec:t*6+4*w,name:'衛星',col:GOLD});
  s+=sat(1100,70,.7);
  s+=slowArrow(760,200,90,{g:clamp(-w*1.5)*seg(p,.1,.2),size:34})+fastArrow(1120,200,90,{g:clamp(w*1.5)*seg(p,.1,.2),size:34});
  s+=card(450,150,240,150,label('なぜ？',570,248,{size:60,color:HC,anchor:'middle',weight:700}),seg(p,.25,.4),HC);
  s+=fade(seg(p,.4,.55),label('遅れたり 進んだり',600,500,{size:30,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'light']:(p,ctx)=>{
  const t=sceneT(p,ctx);
  let s=fade(seg(p,.02,.15)*(1-seg(p,.35,.45)),label('時計の 進み方を 変える ものの 正体は？',600,90,{size:34,color:C.ink,anchor:'middle',weight:700}));
  // 光の点が走る（尾を引いて、何度も横切る）
  const u=(t*.9)%1,X=mix(-60,1260,u),Y=220+40*Math.sin(u*PI*2)*0;
  for(let i=12;i>=1;i--)s+=dot(X-i*22,Y,Math.max(2,12-i*.8),HC,.06*(13-i));
  s+=dot(X,Y,26,HC,.25)+dot(X,Y,14,'#fffbe6');
  const g=seg(p,.35,.5);
  s+=card(400,40,400,110,label('光',600,122,{size:72,color:HC,anchor:'middle',weight:700}),g,HC);
  s+=fade(seg(p,.5,.6),label('次：動く 時計は、遅れる',360,470,{size:30,color:C.dim,anchor:'middle',weight:700}));
  s+=stairs(820,490,3,{from:2,u:seg(p,.55,.75),g:seg(p,.45,.55),sw:80,sh:16});
  return s;
 },
};

// 波形の括弧（物差しの1秒ぶん）
function brace2(x1,x2,y){return draw([[x1,y-8],[x1,y],[x2,y],[x2,y-8]],1,{color:VC,w:3});}

// q9・q10：1秒は何で決まる？（A 地球の自転／B 振り子／C 原子）
function quiz1(p,ctx,ans){
 const t=sceneT(p,ctx),gl=ans?seg(p,.03,.15):0;
 let s=qBadge(70,58)+label('いまの「1秒」の 長さは、何で 決められている？',120,70,{size:32,color:C.ink,weight:700});
 const W=330,Hh=220,Y=120,xs=[70,435,800];
 const st=i=>ans?(i===2?gl:-gl):0;
 s+=option(xs[0],Y,W,Hh,'A',earth(xs[0]+W/2,Y+120,52,{rot:t*.8})+label('地球の 自転',xs[0]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(0),g:ans?1:seg(p,.25,.35)});
 s+=option(xs[1],Y,W,Hh,'B',pendulum(xs[1]+W/2,Y+30,120,t)+label('振り子',xs[1]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(1),g:ans?1:seg(p,.35,.45)});
 s+=option(xs[2],Y,W,Hh,'C',atom(xs[2]+W/2,Y+110,.85,t)+label('原子',xs[2]+W/2,Y+205,{size:30,color:C.ink,anchor:'middle',weight:700}),{st:st(2),g:ans?1:seg(p,.45,.55)});
 if(!ans){s+=countdown(600,440,ctx,{off:.15,g:seg(p,.5,.6)})+fade(seg(p,.5,.6),label('考えて みて',550,451,{size:24,color:C.dim,anchor:'end'}));}
 else{
  s+=okMark(xs[2]+W-40,Y+40,seg(p,.1,.2));
  // 昔は地球の自転：1日の長さが少しずつ揺らぐ
  const g=seg(p,.4,.52);
  s+=tag('昔',xs[0]+W/2,Y-6,{color:C.dim,size:24,g});
  s+=tag('今',xs[2]+W/2,Y-6,{color:HC,size:24,g:seg(p,.12,.22)});
  let pts=[];for(let x=0;x<=520;x+=4)pts.push([110+x,430+14*Math.sin(x/37+t*1.5)+8*Math.sin(x/13-t)]);
  s+=fade(g,line(110,430,630,430,{color:C.faint,w:2,dash:'6 6'})+draw(pts,1,{color:C.E,w:3})+label('地球の 1日の 長さ：少しずつ 揺らぐ',110,390,{size:26,color:C.E,weight:700}));
  s+=fade(seg(p,.55,.68),label('原子は 揺らがない',915,440,{size:30,color:HC,anchor:'middle',weight:700}));
 }
 return s;
}
