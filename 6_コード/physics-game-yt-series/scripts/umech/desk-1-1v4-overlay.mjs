// 技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）の、机の上に重ねる 2D：年と場所の札・注記・数の札・得点・「数える」・回転の線。
// desk-frame.mjs から呼ばれる（図のキーは持たない）。文字は 36px 以上。色：平文＝白、暗号文＝橙、鍵＝青。
// 札の時刻は、声がその言葉を言う時刻（wt：phrase-times.json）。
import {esc,clamp} from './anim.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';

const n=v=>Number(v.toFixed(1));
const sm=p=>{p=clamp(p);return p*p*(3-2*p);};
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
const FONT=`font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"`;
const ORANGE='#ffa04a',BLUE='#5b9bff',WHITE='#ffffff',KAI='#7fa8ff',MIO='#ff8fb1';
function pill(s,x,y,{size=36,color='#fff',bg='#141a2b',bo=.8,anchor='start',weight=700,border=null,op=1}={}){
 if(op<=.003)return '';
 const w=jw(s)*size+36,h=size+22,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return `<g opacity="${n(op)}"><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="${h/2}" fill="${bg}" fill-opacity="${bo}"${border?` stroke="${border}" stroke-width="4"`:''}/><text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`;
}
const key=q=>q.diagram.split('-').slice(1).join('-');
const YEAR={'barrel:mary':'1586年 イングランド','barrel:board':'1586年 イングランド','disk:rome':'紀元前1世紀 ローマ','disk:ad':'紀元前1世紀 ローマ','disk:cat':'紀元前1世紀 ローマ','disk:mio':'紀元前1世紀 ローマ','disk:25':'紀元前1世紀 ローマ','disk:spin':'紀元前1世紀 ローマ','disk:three':'紀元前1世紀 ローマ','disk:kai':'紀元前1世紀 ローマ',
 'book:kindi':'9世紀 バグダッド キンディー','book:count':'9世紀 バグダッド キンディー','book:mio':'9世紀 バグダッド キンディー','tower:grow':'9世紀 バグダッド キンディー','tower:e':'9世紀 バグダッド キンディー','tower:t':'9世紀 バグダッド キンディー','rows:the':'9世紀 バグダッド キンディー','rows:fill':'9世紀 バグダッド キンディー','rows:done':'9世紀 バグダッド キンディー',
 'end:pass':'1586年','end:phel':'1586年','end:ps':'1586年','end:exec':'1587年2月','end:mio':'1587年2月'};
const NOTE={'letter:open':'手紙の記号は 再現（本物の記号ではない）','letter:mio':'手紙の記号は 再現（本物の記号ではない）','last:letter':'手紙の記号は 再現（本物の記号ではない）',
 'scroll:mult':'巻物の長さは 大きく誇張','scroll:years':'巻物の長さは 大きく誇張','scroll:mio':'巻物の長さは 大きく誇張',
 'tower:grow':'暗号文 541文字を数えた（板1枚＝1文字）','end:phel':'記号の手紙・記号の塔は 再現','end:ps':'偽の追伸の記号は 再現'};
// 得点が入る時刻（声）と、その時の点
function scoreHUD(ctx,t){
 const q=ctx.cue,k=key(q),cs=ctx.cap.start;
 let shown=0,val=0,bump=0;
 const at=(kk,needle)=>{const sc=ctx.clip.scenes.flatMap(s=>s.cues.map((qq,i)=>({qq,cap:s.captions[i]}))).find(x=>key(x.qq)===kk);return sc.cap.start+wt({cue:sc.qq,t:0,dur:sc.cap.end-sc.cap.start},needle);};
 const s1=at('disk:three','キャット'),s2=at('rows:done','カゾエタ');
 val=t>=s2?2:t>=s1?1:0;
 for(const s of [s1,s2]){if(t>=s-.2&&t<s+3.2)shown=Math.max(shown,sm((t-s+.2)/.25)*(1-sm((t-s-2.9)/.3)));if(t>=s&&t<s+.5)bump=Math.sin(Math.PI*(t-s)/.5);}
 if(k==='barrel:board')shown=Math.max(shown,sm((t-cs-.6)/.3));
 if(k==='next:weak')shown=Math.max(shown,sm((t-cs)/.3));
 if(shown<=.003)return '';
 const x=1040,y=130,size=36;
 const parts=[['作る側',KAI],[' 0 ','#fff'],['−','#c8cbd6'],[` ${val} `,bump>0?'#ffe066':'#fff'],['破る側',MIO]];
 const w=parts.reduce((a,[s])=>a+jw(s)*size,0)+40,x0=x-w;let xs=x0+20,txt='';
 for(const [s,col] of parts){const ww=jw(s)*size;const big=s.trim()===String(val)&&bump>0?1+.5*bump:1;
  txt+=`<text x="${n(xs+ww/2)}" y="${n(y+13)}" ${FONT} font-size="${n(size*big)}" font-weight="800" text-anchor="middle" fill="${col}">${esc(s.trim())}</text>`;xs+=ww;}
 return `<g opacity="${n(shown)}"><rect x="${n(x0)}" y="${y-30}" width="${n(w)}" height="60" rx="30" fill="#141a2b" fill-opacity=".82"/>${txt}${bump>0?`<text x="${n(x-20-jw('破る側')*size-jw(` ${val} `)*size/2)}" y="${n(y+80-30*bump)}" ${FONT} font-size="40" font-weight="800" text-anchor="middle" fill="${MIO}" opacity="${n(Math.sin(Math.PI*bump))}">＋1</text>`:''}</g>`;
}
export function overlay1_1v4(ctx){
 const {t,cue:q,cap}=ctx,k=key(q),cs=cap.start,ce=cap.end,lt=t-cs;
 const W_=(needle,occ=0)=>cs+wt({cue:q,t:0,dur:ce-cs},needle,occ);
 const on=(a,d=.25)=>sm((t-a)/d);
 let s='';
 if(YEAR[k])s+=pill(YEAR[k],40,130,{size:38,color:'#ffe9c4',op:on(cs-.0,.3)});
 if(NOTE[k])s+=pill(NOTE[k],40,1440,{size:36,color:'#e8e2d6',bo:.6,weight:600,op:on(cs+.3,.3)});
 s+=scoreHUD(ctx,t);
 // 数・鍵の札
 if(k==='disk:rome')s+=pill('3つずらす（鍵＝3）',540,420,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ミッツズツ'))});
 if(k==='disk:25')s+=pill('ずらし方：25通り',540,420,{size:48,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ニジュウゴ'))});
 if(k==='disk:spin'){ // 猛スピードの回転の線
  const a=cs+.45,b=ce+.25;const u=clamp((t-a)/(b-a));
  if(u>0&&u<1){const a0=ctx.anchor('disk');const cx=a0?a0[0]:540,cy=a0?a0[1]+180:860;let l='';for(let i=0;i<14;i++){const an=i/14*Math.PI*2+t*9;l+=`<path d="M${n(cx+300*Math.cos(an))} ${n(cy+300*Math.sin(an)*.6)} A300 180 0 0 1 ${n(cx+300*Math.cos(an+.5))} ${n(cy+300*Math.sin(an+.5)*.6)}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${n(.55*Math.sin(Math.PI*u))}"/>`;}s+=l;}
 }
 if(k==='book:count'){const a=W_('カゾエル'),u=on(a,.18);if(u>0){const sc=1+.25*(1-u);s+=`<g opacity="${n(u)}" transform="translate(540 700) scale(${n(sc*100)/100})"><text x="0" y="0" ${FONT} font-size="190" font-weight="900" text-anchor="middle" fill="#3a1d06" opacity=".5" transform="translate(8 10)">数える</text><text x="0" y="0" ${FONT} font-size="190" font-weight="900" text-anchor="middle" fill="#fff" stroke="#e8761e" stroke-width="12" paint-order="stroke">数える</text></g>`;}}
 if(k==='tower:grow'){
  s+=pill('英語の E：約13％',540,420,{size:44,color:'#222',bg:'#ffffff',bo:.92,anchor:'middle',op:on(W_('ヤク'))*(1-on(W_('イレカエテモ')))});
  const a=ctx.anchor('xtop'),u=on(W_('ヤク',1));
  if(a&&a[2])s+=pill('この記号も 約13％',Math.min(1040-(jw('この記号も 約13％')*42+36)/2,Math.max(250,a[0])),Math.max(330,a[1]-50),{size:42,color:'#2a1406',bg:ORANGE,bo:.95,anchor:'middle',op:u});
  else s+=pill('この記号も 約13％',540,420,{size:42,color:'#2a1406',bg:ORANGE,bo:.95,anchor:'middle',op:u});
 }
 if(k==='rows:the')s+=pill('T□E → THE',540,420,{size:48,color:'#222',bg:'#ffffff',bo:.92,anchor:'middle',op:on(W_('エイチ'))});
 if(k==='end:ps'){const a=ctx.anchor('psR'),u=on(W_('ニセノ'));if(u>0)s+=pill('偽の追伸',540,420,{size:46,color:'#fff',bg:'#9c2a1c',bo:.92,anchor:'middle',op:u});}
 if(k==='ch:next')s+=pill('？＝ずらす数（鍵）',540,420,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('カエサル'))});
 return s;
}
