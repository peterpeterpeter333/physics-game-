// 特別編「1分の疑問」13 sound・14 dice・15 paper の共通部品（担当：13〜15）。
// 図のキーは持たない（ファイル名が -diagrams で終わらないので自動読み込みされない）。
// 形の部品（カウンター・Q カード・疑問カード・橋・最後の問い）は 01 の yt1-sp-1min-common.mjs を import して使う。
// ここにあるのは、そこに無いもの（クイズの選択肢とカウントダウン、札、小物）だけ。
import {C,seg,fade,label,line,rect,dot,ring,arrow,clamp,scaleAt,draw,poly} from './anim.mjs';

export const PI=Math.PI, HC=C.hi;
import {cueT,durOf,voiceEnd} from './yt1-sp-1min-common.mjs';
export {cueT,durOf,voiceEnd};
export const card=(x,y,w,h,inner='',g=1,stroke=C.faint)=>fade(g,rect(x,y,w,h,{fill:'#131f38',fo:.96,stroke,sw:2,rx:14})+inner);
export const clip=(id,x,y,w,h,inner)=>`<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
export const cross=(x,y,r=22,g=1,col=C.a)=>fade(g,line(x-r,y-r,x+r,y+r,{color:col,w:6})+line(x-r,y+r,x+r,y-r,{color:col,w:6}));
export const okMark=(x,y,g=1,col=C.F)=>fade(g,draw([[x-18,y],[x-4,y+14],[x+20,y-16]],1,{color:col,w:6}));
export function tag(s,x,y,{color=HC,g=1,size=26}={}){
 const w=[...s].length*size+34;
 return fade(g,rect(x-w/2,y-size*.85-9,w,size+20,{fill:color,fo:.14,stroke:color,sw:2,rx:18})+label(s,x,y+2,{size,color,anchor:'middle',weight:700}));
}

// ---------- クイズ（Q カード＋選択肢＋カウントダウン）----------
export function countdown(cx,cy,r,t,ctx,{g=1}={}){
 const pause=(ctx&&ctx.cue&&ctx.cue.pause)||2.5,ve=voiceEnd(ctx),u=clamp((t-ve)/pause);
 const L=2*PI*r,rem=1-u,k=Math.max(1,3-Math.floor(u*3));
 let s=dot(cx,cy,r+10,'#0e1830')+ring(cx,cy,r,{color:C.faint,w:8});
 s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${HC}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(L*rem).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>`;
 s+=label(u>=1?'！':String(k),cx,cy+15,{size:44,color:HC,anchor:'middle',weight:700});
 return fade(g*seg(t,ve-.4,ve),s);
}
const LET='ABC';
// q: one or two lines of the question; opts: 3 choices; art: small picture at the top right (x 720–1000, y 70–190)
export function quizFull(p,t,ctx,{q,opts,ans=-1,reveal=0,g=1,appear=true,art=''}){
 let s=rect(40,72,1120,436,{fill:'#131f38',fo:.97,stroke:HC,sw:3,rx:18});
 const pop=appear?seg(p,0,.08):1;
 s+=fade(pop,dot(112,140,46,HC)+label('Q',112,158,{size:54,color:'#0b1122',anchor:'middle',weight:700}));
 [].concat(q).forEach((L,i)=>{s+=fade(appear?seg(p,.04+i*.04,.12+i*.04):1,label(L,182,132+i*52,{size:38,color:C.ink,weight:700}));});
 s+=art;
 opts.forEach((o,i)=>{const x=90+i*350,y=262,w=320,h=210,gi=appear?seg(p,.14+i*.08,.22+i*.08):1;
  const right=i===ans&&reveal>0,dim=reveal>0&&i!==ans;
  let b=rect(x,y,w,h,{fill:right?HC:'#1b2a4a',fo:right?.2:1,stroke:right?HC:'#5a6b8c',sw:right?6:2,rx:16});
  b+=label(LET[i],x+34,y+48,{size:32,color:right?HC:C.dim,anchor:'middle',weight:700});
  b+=label(o,x+w/2,y+140,{size:58,color:right?HC:C.ink,anchor:'middle',weight:700});
  if(right)b+=label('正解',x+w-52,y+48,{size:28,color:HC,anchor:'middle',weight:700});
  s+=fade(gi*(dim?1-.6*reveal:1),scaleAt(x+w/2,y+h/2,.85+.15*gi,b));
 });
 s+=countdown(1080,150,40,t,ctx,{g:ans<0?1:0});
 return fade(g,s);
}
// answer cue: the full card shows the right answer (reveal), then fades away; body fades in under it,
// and a small "答え：…" tag stays at the top (between the pill and the counter, x 420–)
export function answer(p,t,ctx,Q,body,{fold=[.22,.32],ansText='',ax=420}={}){
 const full=1-seg(p,fold[0],fold[1]),g=seg(p,fold[0],fold[1]+.06);
 const w=[...ansText].length*28+44;
 const tagA=ansText?fade(seg(p,fold[0]+.04,fold[1]+.06),rect(ax,6,w,46,{fill:HC,fo:.18,stroke:HC,sw:2.5,rx:23})+label(ansText,ax+w/2,39,{size:28,color:HC,anchor:'middle',weight:700})):'';
 return fade(g,body)+tagA+fade(full,quizFull(p,t,ctx,{...Q,reveal:seg(p,.02,.08),appear:false}));
}

// ---------- 小物 ----------
// person (top view = head circle) or standing silhouette (side). yF = feet
export function person(x,yF,h,{col='#8fa3c7',g=1}={}){
 const hr=h*.1,hy=yF-h+hr;
 let s=dot(x,hy,hr,col);
 s+=rect(x-h*.13,yF-h*.78,h*.26,h*.4,{fill:col,fo:1,stroke:col,sw:1,rx:h*.08});
 for(const sg of[-1,1]){s+=line(x+sg*h*.06,yF-h*.42,x+sg*h*.08,yF-h*.02,{color:col,w:h*.08});s+=line(x+sg*h*.12,yF-h*.72,x+sg*h*.2,yF-h*.45,{color:col,w:h*.055});}
 return fade(g,s);
}
export {poly};
