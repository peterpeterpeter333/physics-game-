// 特別編 v3「疑問20連発」担当B（Q7〜Q10）の共通部品。Stage 1200×515。
// ファイル名が -diagrams.mjs で終わらないので、自動読み込みの対象にはならない（各 Q の図ファイルから import する）。
// 画面上部の Q1〜Q20 の点の列：画面上の右寄り、直径 12px の点 20 個、間隔 22px。
//   解いた Q＝水色の塗り、いまの Q＝黄色の輪で光る、未来の Q＝灰の輪。その左に難しさの★。
// Q カード：中央に大きく黄色の「Q.n」、その下に白で問いの文。橋の cue：右下に「次の疑問 →」。
import {C,seg,fade,label,line,rect,dot,ring,clamp,poly,smooth,scaleAt} from './anim.mjs';
import {card,sceneT} from './yt1-hs-a-nucleus-1-diagrams.mjs';

const PI=Math.PI, HC=C.hi;
export const DOT={r:6,gap:22,x1:1182,y:16};   // x1：Q20 の点の中心
const GRAY='#6b7c9c';
const STARS=n=>n<=6?1:n<=10?2:n<=15?3:4;

// n：いまの Q。solve：いまの Q を塗る割合（橋の cue で 0→1）。t：光の明滅用の時間
export function qDots(n,{t=0,solve=0}={}){
 // 動く図が下を通っても点の列が読めるよう、背景色の帯を敷く
 let s=rect(DOT.x1-19*DOT.gap-70,0,19*DOT.gap+90,DOT.y+16,{fill:C.bg,fo:.88,stroke:'none',sw:0,rx:8});
 s+=label('★'.repeat(STARS(n)),DOT.x1-19*DOT.gap-16,DOT.y+8,{size:22,color:HC,anchor:'end',weight:700});
 for(let i=1;i<=20;i++){
  const x=DOT.x1-(20-i)*DOT.gap,y=DOT.y;
  if(i<n)s+=dot(x,y,DOT.r,C.x);
  else if(i===n){
   const pulse=.5+.5*Math.sin(t*3);
   s+=dot(x,y,DOT.r+5,HC,.12+.18*pulse);
   if(solve>0)s+=dot(x,y,DOT.r*solve,C.x);
   s+=ring(x,y,DOT.r,{color:HC,w:2.5});
   if(solve>0&&solve<1)s+=fade(1-solve,ring(x,y,DOT.r+4+14*solve,{color:C.x,w:2}));
  }
  else s+=ring(x,y,DOT.r-1,{color:GRAY,w:2});
 }
 return s;
}

// Q カード：中央に大きく「Q.n」、下に問いの文（lines：1〜2行）
export function qCard(n,lines,p,{g=1}={}){
 const u=seg(p,0,.12);
 let s=scaleAt(600,190,1.25-.25*smooth(u),fade(u,label(`Q.${n}`,600,230,{size:130,color:HC,anchor:'middle',weight:700})));
 s+=fade(u*g,line(420,268,780,268,{color:HC,w:3,opacity:.5}));
 lines.forEach((L,i)=>{s+=fade(seg(p,.06+i*.08,.2+i*.08),label(L,600,335+i*58,{size:40,color:C.ink,anchor:'middle',weight:700}));});
 return fade(g,s);
}

// 橋の cue：右下の「次の疑問 →」
export const nextQ=(g=1)=>fade(g,rect(950,450,236,52,{fill:HC,fo:.12,stroke:HC,sw:2,rx:26})+label('次の疑問 →',1068,486,{size:28,color:HC,anchor:'middle',weight:700}));

// 1つの Q の図を、点の列つきで包む。bridge：橋の cue（いまの Q を塗り、「次の疑問 →」を出す）
export function wrapQ(n,map){
 const out={};
 for(const [k,f] of Object.entries(map)){
  const bridge=/:bridge$/.test(k);
  out[k]=(p,ctx)=>{const t=sceneT(p,ctx);return f(p,ctx)+(bridge?nextQ(seg(p,.05,.15)):'')+qDots(n,{t,solve:bridge?seg(p,.1,.3):0});};
 }
 return out;
}

// ---------- クイズ：Q. の札＋選択肢＋カウントダウンの輪（v2 パート2と同じ見た目。時間だけ pause に合わせる） ----------
export const qBadge=(x,y,g=1)=>fade(g,dot(x,y,30,HC)+label('Q.',x,y+11,{size:30,color:'#1b1300',anchor:'middle',weight:700}));
// pause の間に輪が減り、数字 3・2・1。off 秒後から、(pause−off)/3 秒ごとに数字が変わる（tick の効果音もそこに置く）
export function countdown(x,y,ctx,{off=.1,r=34,g=1}={}){
 if(!ctx||!ctx.cue)return '';
 const pause=ctx.cue.pause||0,vEnd=ctx.dur-pause,tt=ctx.t-vEnd,L=Math.max(.6,pause-off);
 if(tt<-.3)return fade(g,ring(x,y,r,{color:C.faint,w:6}));
 const u=clamp((tt-off)/L),a=-PI/2+2*PI*(1-u);
 const left=1-u;let s=ring(x,y,r,{color:C.faint,w:6});
 if(left>.001)s+=left>.999?ring(x,y,r,{color:HC,w:6}):`<path d="M${x} ${y-r} A${r} ${r} 0 ${left>.5?1:0} 1 ${(x+r*Math.cos(a)).toFixed(1)} ${(y+r*Math.sin(a)).toFixed(1)}" fill="none" stroke="${HC}" stroke-width="6"/>`;
 const k=tt<off?3:Math.max(1,3-Math.floor((tt-off)/(L/3)));
 s+=label(String(k),x,y+12,{size:34,color:HC,anchor:'middle',weight:700});
 return fade(g,s);
}
// tick の効果音（countdown の数字が変わる時刻）
export const ticks=(pause,off=.1)=>{const L=Math.max(.6,pause-off);return [0,1,2].map(i=>['tick',`e+${(off+i*L/3).toFixed(2)}`]);};
// 選択肢の箱。st：0 ふつう、1 正解で光る、-1 外れで暗く
export function option(x,y,w,h,letter,inner,{g=1,st=0,col=C.ink}={}){
 const glow=st>0?st:0,dim=st<0?-st:0;
 let s='';
 if(glow>0)s+=fade(glow,rect(x-8,y-8,w+16,h+16,{fill:HC,fo:.12,stroke:HC,sw:6,rx:20}));
 s+=card(x,y,w,h,dot(x+34,y+34,20,glow>.5?HC:col,glow>.5?1:.25)+label(letter,x+34,y+43,{size:26,color:glow>.5?'#1b1300':col,anchor:'middle',weight:700})+inner,1,glow>.5?HC:col);
 return fade(g*(1-.65*dim),s);
}

// ---------- 日本地図（v2 パート2と同じ形のデータ）：経緯度 → 画面 ----------
const MK=75,ML0=130.8,MLA0=39,MX=40,MY=40,MCOS=Math.cos(36*PI/180);
export const MP=([la,lo])=>[MX+(lo-ML0)*MK*MCOS,MY+(MLA0-la)*MK];
const HONSHU=[[41.5,140.9],[41.4,141.4],[40.5,141.5],[39.6,142.0],[39.3,141.9],[38.9,141.6],[38.3,141.5],[38.25,141.0],[37.8,140.95],[37.0,140.9],[36.6,140.65],[35.7,140.85],[35.2,140.4],[34.9,139.85],[35.3,139.8],[35.6,140.1],[35.65,139.8],[35.45,139.65],[35.15,139.65],[35.25,139.15],[34.6,138.85],[35.1,138.85],[34.6,138.2],[34.7,137.7],[34.6,137.0],[35.0,136.85],[34.95,136.65],[34.7,136.55],[34.48,136.85],[34.3,136.9],[34.05,136.2],[33.45,135.75],[33.9,135.1],[34.2,135.15],[34.55,135.45],[34.68,135.45],[34.68,135.2],[34.65,134.95],[34.8,134.7],[34.6,133.9],[34.45,133.4],[34.35,132.45],[34.15,132.2],[33.95,132.1],[33.95,130.9],[34.4,131.4],[34.7,131.85],[34.9,132.1],[35.4,132.6],[35.55,133.2],[35.55,134.2],[35.65,134.6],[35.75,135.2],[35.65,136.05],[36.0,136.1],[36.6,136.6],[36.9,136.75],[37.5,137.35],[37.05,137.0],[36.75,137.2],[37.2,138.25],[37.95,139.05],[38.2,139.45],[38.9,139.85],[39.9,139.7],[40.2,140.0],[40.8,140.2],[41.25,140.35],[40.85,140.75]];
const SHIKOKU=[[34.05,132.95],[34.3,133.0],[34.35,134.0],[34.2,134.6],[33.85,134.75],[33.25,134.2],[33.55,133.55],[32.75,133.0],[33.0,132.5],[33.35,132.0],[33.85,132.7]];
const KYUSHU=[[33.95,130.9],[33.6,130.4],[33.5,129.85],[33.15,129.7],[32.75,129.85],[32.6,130.15],[32.8,130.6],[32.2,130.2],[31.6,130.25],[31.2,130.6],[31.4,130.9],[31.0,131.05],[31.4,131.35],[31.9,131.45],[32.6,131.7],[33.25,131.7],[33.6,131.6]];
export function japanMap(g=1,id='gpsqBmap'){
 const land=a=>poly(a.map(MP),{fill:'#2f5a45',fo:1,stroke:'#7fbf9a',sw:2});
 return fade(g,`<defs><clipPath id="${id}"><rect x="30" y="40" width="670" height="460" rx="16"/></clipPath></defs>`+rect(30,40,670,460,{fill:'#0f1f3a',fo:1,stroke:C.faint,rx:16})+`<g clip-path="url(#${id})">${land(HONSHU)+land(SHIKOKU)+land(KYUSHU)}</g>`);
}
export const TOKYO=MP([35.68,139.77]), OSAKA=MP([34.69,135.50]);
