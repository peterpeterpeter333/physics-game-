// 技術の疑問の鎖 1-1 第5版（ys-chain-1-1v5）の、机の上に重ねる 2D。desk-1-1v4-overlay.mjs（変えていない）の写しに、第5版の物を足した。
// desk-frame.mjs から呼ばれる（図のキーは持たない）。文字は 36px 以上。色：平文＝白、暗号文＝橙、鍵＝青。
//  - 年と場所の札・注記（誇張・再現・たとえ）・得点（第4版と同じ）
//  - 三つの見方の札（cue の view：「見方：具体例／たとえ話／破る側から」）：机の世界に合う木の板に紙を貼った札。左上（年の札の下）。その見方の cue の間ずっと出す
//  - 計算の段（1段ずつ）：声がその言葉を言う時刻（wt：phrase-times.json）に出す。声より先には出さない
//  - 論理の筋（行37〜39）：仮説 → もし正しいなら → 予言 → 事実 → 判定 の紙の札
//  - 一時停止の印と 3秒の輪（行24）
import {esc,clamp} from './anim.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';

const n=v=>Number(v.toFixed(1));
const sm=p=>{p=clamp(p);return p*p*(3-2*p);};
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
const FONT=`font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"`;
const ORANGE='#ffa04a',BLUE='#5b9bff',KAI='#7fa8ff',MIO='#ff8fb1';
function pill(s,x,y,{size=36,color='#fff',bg='#141a2b',bo=.8,anchor='start',weight=700,border=null,op=1}={}){
 if(op<=.003)return '';
 const w=jw(s)*size+36,h=size+22,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return `<g opacity="${n(op)}"><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="${h/2}" fill="${bg}" fill-opacity="${bo}"${border?` stroke="${border}" stroke-width="4"`:''}/><text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`;
}
// 紙の札（クリーム色の紙、こげ茶の字、少しの影）。parts＝[[文字,色],…]
function paper(parts,x,y,{size=42,op=1,anchor='start',rot=0,mark=null}={}){
 if(op<=.003)return '';
 const w=parts.reduce((a,[s])=>a+jw(s)*size,0)+44,h=size+30,x0=anchor==='middle'?x-w/2:x;
 // 1つの text に tspan で色を付ける（字の幅は字体に任せる。部分ごとに置くと半角の幅の見積もりで重なる）
 const t=`<text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="#3b2412">${parts.map(([s,col])=>`<tspan fill="${col??'#3b2412'}">${esc(s)}</tspan>`).join('')}</text>`;
 const dy=8*(1-op);
 return `<g opacity="${n(op)}" transform="translate(0 ${n(dy)}) rotate(${rot} ${n(x0+w/2)} ${n(y)})"><rect x="${n(x0+5)}" y="${n(y-h/2+7)}" width="${n(w)}" height="${h}" rx="8" fill="#2a1406" opacity=".45"/><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/>${mark?`<circle cx="${n(x0+w-4)}" cy="${n(y-h/2+4)}" r="9" fill="${mark}" stroke="#fff" stroke-width="2"/>`:''}${t}</g>`;
}
// 三つの見方の札：木の板（机と同じ色の木目）に紙の札を貼った物。左に色の印（具体例＝水色、たとえ話＝桃色、破る側から＝橙）
const VIEWCOL={'具体例':'#38c6d9','たとえ話':'#ff9ce6','破る側から':'#ff8f6b'};
function viewCard(kind,op){
 if(op<=.003)return '';
 const size=40,label='見方：'+kind,w=jw(label)*size+96,h=76,x0=36,y0=176,c=VIEWCOL[kind];
 let s=`<g opacity="${n(op)}"><rect x="${x0+5}" y="${y0+7}" width="${n(w)}" height="${h}" rx="10" fill="#1d0f05" opacity=".5"/>`
  +`<rect x="${x0}" y="${y0}" width="${n(w)}" height="${h}" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/>`;
 for(let k=0;k<4;k++)s+=`<path d="M${x0+6} ${y0+14+k*16} Q${n(x0+w/2)} ${y0+8+k*16+(k%2?6:-4)} ${n(x0+w-6)} ${y0+16+k*16}" fill="none" stroke="#6f4526" stroke-width="3" opacity=".55"/>`;
 s+=`<rect x="${x0+14}" y="${y0+10}" width="${n(w-28)}" height="${h-20}" rx="6" fill="#f4e8cc"/>`
  +`<rect x="${x0+14}" y="${y0+10}" width="22" height="${h-20}" rx="4" fill="${c}"/>`
  +`<circle cx="${x0+25}" cy="${y0+4}" r="7" fill="#c9a44e" stroke="#7a5634" stroke-width="2"/><circle cx="${n(x0+w-25)}" cy="${y0+4}" r="7" fill="#c9a44e" stroke="#7a5634" stroke-width="2"/>`
  +`<text x="${n(x0+44+jw(label)*size/2)}" y="${y0+h/2+14}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="#3b2412">${esc(label)}</text></g>`;
 return s;
}
const key=q=>q.diagram.split('-').slice(1).join('-');
const ROME='紀元前1世紀 ローマ',KINDI='9世紀 バグダッド キンディー';
const YEAR={'barrel:mary':'1586年 イングランド','barrel:board':'1586年 イングランド',
 'end:pass':'1586年','end:phel':'1586年','end:ps':'1586年','end:exec':'1587年2月','end:mio':'1587年2月'};
for(const k of ['disk:rome','disk:ad','disk:be','disk:cat','disk:z','clock:tick','ring:loop','ring:za','ring:zc','disk:wheel','disk:turn','disk:read','disk:mio','disk:25','disk:spin','disk:three','disk:kai'])YEAR[k]=ROME;
for(const k of ['book:kindi','book:mio','doll:tag','doll:who','doll:talk','e3:same','e3:three','e3:flip','tw:pair','tw:mio','tw:en','dice:short','dice:roll','dice:long','tower:grow','tower:e','logic:check','logic:hyp','logic:if','logic:fact','logic:judge','rows:fill','rows:done'])YEAR[k]=KINDI;
const NOTE={'letter:open':'手紙の記号は 再現（本物の記号ではない）','letter:mio':'手紙の記号は 再現（本物の記号ではない）','last:letter':'手紙の記号は 再現（本物の記号ではない）',
 'clock:tick':'時計は たとえ（ローマの物ではない）',
 'scroll:years':'巻物の長さは 大きく誇張','scroll:mio':'巻物の長さは 大きく誇張','scroll:back':'巻物の長さは 大きく誇張',
 'tree:mult':'木の模型：4段目から先は 省略',
 'doll:tag':'人形と名札は たとえ','doll:who':'人形と名札は たとえ','doll:talk':'人形と名札は たとえ',
 'tw:pair':'元の文と暗号文（541文字）の数（板1枚＝1文字）','tw:en':'英語の割合は 一般的な表（E 12.7％、T 9.1％）',
 'dice:roll':'サイコロの目は 例',
 'tower:grow':'暗号文 541文字を数えた（板1枚＝1文字）','end:phel':'記号の手紙・記号の塔は 再現','end:ps':'偽の追伸の記号は 再現'};
function scoreHUD(ctx,t){
 const q=ctx.cue,k=key(q),cs=ctx.cap.start;
 let shown=0,val=0,bump=0;
 const at=(kk,needle)=>{const sc=ctx.clip.scenes.flatMap(s=>s.cues.map((qq,i)=>({qq,cap:s.captions[i]}))).find(x=>key(x.qq)===kk);return sc.cap.start+wt({cue:sc.qq,t:0,dur:sc.cap.end-sc.cap.start},needle);};
 const s1=at('disk:three','キャット'),s2=at('rows:done','カゾエタ');
 val=t>=s2?2:t>=s1?1:0;
 for(const s of [s1,s2]){if(t>=s-.2&&t<s+3.2)shown=Math.max(shown,sm((t-s+.2)/.25)*(1-sm((t-s-2.9)/.3)));if(t>=s&&t<s+.5)bump=Math.sin(Math.PI*(t-s)/.5);}
 if(k==='barrel:board')shown=Math.max(shown,sm((t-cs-.6)/.3));
 if(k==='disk:kai')shown=Math.max(shown,sm((t-cs)/.3));
 if(k==='next:weak')shown=Math.max(shown,sm((t-cs)/.3));
 if(shown<=.003)return '';
 const x=1040,y=130,size=36;
 const parts=[['作る側',KAI],[' 0 ','#fff'],['−','#c8cbd6'],[` ${val} `,bump>0?'#ffe066':'#fff'],['破る側',MIO]];
 const w=parts.reduce((a,[s])=>a+jw(s)*size,0)+40,x0=x-w;let xs=x0+20,txt='';
 for(const [s,col] of parts){const ww=jw(s)*size;const big=s.trim()===String(val)&&bump>0?1+.5*bump:1;
  txt+=`<text x="${n(xs+ww/2)}" y="${n(y+13)}" ${FONT} font-size="${n(size*big)}" font-weight="800" text-anchor="middle" fill="${col}">${esc(s.trim())}</text>`;xs+=ww;}
 return `<g opacity="${n(shown)}"><rect x="${n(x0)}" y="${y-30}" width="${n(w)}" height="60" rx="30" fill="#141a2b" fill-opacity=".82"/>${txt}${bump>0?`<text x="${n(x-20-jw('破る側')*size-jw(` ${val} `)*size/2)}" y="${n(y+80-30*bump)}" ${FONT} font-size="40" font-weight="800" text-anchor="middle" fill="${MIO}" opacity="${n(Math.sin(Math.PI*bump))}">＋1</text>`:''}</g>`;
}
// 1段ずつ出る列：items＝[[文字, 出す時刻, 色?]]。y の行に左から並べる（中央そろえ）
function stepsRow(items,t,y,{size=46,sep='→',bg='#141a2b',color='#fff'}={}){
 const vis=items.filter(([,a])=>t>=a);if(!vis.length)return '';
 const all=items.map(x=>x[0]);const w=all.reduce((a,s)=>a+jw(s)*size,0)+(all.length-1)*(jw(sep)*size+24)+48;
 let x=540-w/2+24,s=`<rect x="${n(540-w/2)}" y="${n(y-size*.85)}" width="${n(w)}" height="${n(size*1.5)}" rx="${n(size*.75)}" fill="${bg}" fill-opacity=".82" opacity="${n(sm((t-items[0][1])/.2))}"/>`;
 items.forEach(([str,a,col],i)=>{const ww=jw(str)*size,op=sm((t-a)/.18);
  if(op>0)s+=`<text x="${n(x+ww/2)}" y="${n(y+size*.18+6*(1-op))}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${col??color}" opacity="${n(op)}">${esc(str)}</text>`;
  x+=ww;
  if(i<items.length-1){const op2=sm((t-items[i+1][1])/.18);if(op2>0)s+=`<text x="${n(x+12+jw(sep)*size/2)}" y="${n(y+size*.18)}" ${FONT} font-size="${size*.8}" font-weight="700" text-anchor="middle" fill="#c8cbd6" opacity="${n(op2)}">${sep}</text>`;x+=jw(sep)*size+24;}
 });
 return s;
}
export function overlay1_1v5(ctx){
 const {t,cue:q,cap}=ctx,k=key(q),cs=cap.start,ce=cap.end;
 const W_=(needle,occ=0,o={})=>cs+wt({cue:q,t:0,dur:ce-cs},needle,occ,o);
 const on=(a,d=.25)=>sm((t-a)/d);
 let s='';
 if(YEAR[k])s+=pill(YEAR[k],40,130,{size:38,color:'#ffe9c4',op:on(cs-.0,.3)});
 if(q.view){
  // 前の cue も同じ見方なら、出たまま（ふわっと出し直さない）
  const all=ctx.clip.scenes.flatMap(sc=>sc.cues);const i=all.indexOf(q);const prevSame=i>0&&all[i-1].view===q.view;
  s+=viewCard(q.view,prevSame?1:on(cs,.3));
 }
 if(NOTE[k])s+=pill(NOTE[k],40,1440,{size:36,color:'#e8e2d6',bo:.6,weight:600,op:on(cs+.3,.3)});
 s+=scoreHUD(ctx,t);
 let Y1=360,Y2=470;
 // 円板を真上から見る所（行6〜13）は、円板とタイルが画面の中ほどを占めるので、計算の段は字幕の下（y 1470・1565）に出す
 if(['disk:ad','disk:be','disk:cat','ring:za','ring:zc','disk:wheel','disk:turn','disk:read','disk:25','sub:ex','sub:cat','tab:a','tab:b','tab:c','tab:z'].includes(k)){Y1=1470;Y2=1565;}
 const W=ORANGE,B='#9cc4ff';
 // ---- ずらす ----
 if(k==='disk:rome')s+=pill('3つずらす（鍵＝3）',540,Y1,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ミッツズツ'))});
 if(k==='disk:ad'){s+=stepsRow([['A',W_('エエカラ')],['B',W_('ビイ')],['C',W_('スィイ')],['D',W_('ディイト'),W]],t,Y1);
  s+=pill('A ＋3 ＝ D',540,Y2,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ディイデス'))});}
 if(k==='disk:be'){s+=stepsRow([['B',W_('ビイナラ')],['C',W_('スィイ')],['D',W_('ディイ')],['E',W_('イイデ'),W]],t,Y1);
  s+=pill('B ＋3 ＝ E',540,Y2,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('イイ',1))});}
 if(k==='disk:cat'){s+=stepsRow([['C→F',W_('エフ')],['A→D',W_('ディイ')],['T→W',W_('ダブリュウ')]],t,Y1,{size:44,sep:'、'});
  s+=pill('CAT → FDW',540,Y2,{size:48,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('エフ',1))});}
 if(k==='disk:z')s+=pill('Z ＋3 ＝ ？',540,Y1,{size:48,color:'#fff',bg:'#9c2a1c',bo:.9,anchor:'middle',op:on(W_('サキワ'))});
 if(k==='clock:tick')s+=stepsRow([['11',cs+.2],['12',W_('ジュウニオ'),'#ff7b6b'],['1',W_('イチニ'),W]],t,Y1);
 if(k==='ring:za')s+=stepsRow([['Z',W_('ゼットノ')],['A',W_('エエ'),W]],t,Y1);
 if(k==='ring:zc'){s+=stepsRow([['Z',W_('ゼットノ')],['A',W_('エエ')],['B',W_('ビイ')],['C',W_('スィイデ'),W]],t,Y1);
  s+=pill('Z ＋3 ＝ C',540,Y2,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('スィイデス'))});}
 if(k==='disk:turn'){s+=pill('内の輪を 3目盛り',540,Y1,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('サンメモリ'))});
  s+=stepsRow([['外 A',W_('エエノ')],['内 D',W_('ディイガ'),W]],t,Y2);}
 if(k==='disk:read')s+=stepsRow([['外の文字',W_('ソトノ')],['内の文字',W_('ウチノ'),W]],t,Y1,{size:44});
 if(k==='disk:25'){s+=pill('26目盛り ＝ 元に戻る',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('モドッテ'))});
  s+=pill('1〜25目盛り：25通り',540,Y2,{size:48,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ニジュウゴトオリ'))});}
 if(k==='disk:spin'){
  const a=cs+.45,b=ce+.25;const u=clamp((t-a)/(b-a));
  if(u>0&&u<1){const a0=ctx.anchor('diskC');const cx=a0?a0[0]:540,cy=a0?a0[1]:860;let l='';for(let i=0;i<14;i++){const an=i/14*Math.PI*2+t*9;l+=`<path d="M${n(cx+300*Math.cos(an))} ${n(cy+300*Math.sin(an)*.6)} A300 180 0 0 1 ${n(cx+300*Math.cos(an+.5))} ${n(cy+300*Math.sin(an+.5)*.6)}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="${n(.55*Math.sin(Math.PI*u))}"/>`;}s+=l;}
 }
 // ---- 入れ替え ----
 if(k==='sub:ex')s+=stepsRow([['A→Q',W_('エエワ')],['B→W',W_('ビイワ')],['C→E',W_('スィイワ')]],t,Y1,{size:44,sep:'、'});
 if(k==='sub:cat')s+=pill('CAT → EQJ',540,Y1,{size:48,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('イイ'))});
 if(k==='tab:a')s+=pill('A の行き先：26通り',540,Y1,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ニジュウロクトオリ'))});
 if(k==='tab:b'){s+=pill('A の行き先：26通り',540,Y1,{size:40,color:'#c8cbd6',bg:'#141a2b',bo:.7,anchor:'middle'});
  s+=pill('B：25通り（Q は使った）',540,Y2,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ニジュウゴトオリ'))});}
 if(k==='tab:c'){s+=stepsRow([['A 26',cs-1],['B 25',cs-1],['C 24',W_('ニジュウヨントオリ')]],t,Y1,{size:44,sep:'、'});}
 if(k==='tab:z')s+=stepsRow([['A 26',cs-1],['B 25',cs-1],['C 24',cs-1],['…',W_('コオシテ')],['Z 1',W_('ヒトトオリ')]],t,Y1,{size:42,sep:'、'});
 if(k==='tree:mult'){
  const kk=[W_('ヒトツノ'),W_('ツギノ'),W_('カケザンニ'),W_('ゼンブオ'),W_('ヤク')];
  s+=stepsRow([['26',kk[0]+.2],['×25',kk[1]+.3],['×24',kk[2]],['×…×1',kk[3]]],t,Y1,{size:46,sep:' '});
  s+=pill('＝ 約4×10²⁶通り',540,Y2,{size:50,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(kk[4])});
 }
 if(k==='scroll:years'){s+=pill('1秒に1兆通り',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('イチビョオニ'))});
  s+=pill('全部で 1300万年',540,Y2,{size:50,color:'#fff',bg:'#9c2a1c',bo:.92,anchor:'middle',op:on(W_('センサンビャクマンネン'))});}
 if(k==='sub:mary')s+=pill('手紙の記号 ＝ 入れ替え表',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('イレカエ'))});
 if(k==='think:pause'){
  const a=W_('イチジテイシ'),ve=ce-.12-(q.pause??0);
  const op=on(a,.3);
  if(op>0){const cx=540,cy=560,r=120;
   const u=clamp((t-ve)/3);
   s+=`<g opacity="${n(op)}"><circle cx="${cx}" cy="${cy}" r="${r+26}" fill="#141a2b" fill-opacity=".72"/><rect x="${cx-46}" y="${cy-56}" width="32" height="112" rx="8" fill="#fff"/><rect x="${cx+14}" y="${cy-56}" width="32" height="112" rx="8" fill="#fff"/>`
    +(t>=ve?`<circle cx="${cx}" cy="${cy}" r="${r+10}" fill="none" stroke="#ffd23f" stroke-width="14" stroke-linecap="round" stroke-dasharray="${n(2*Math.PI*(r+10)*(1-u))} 9999" transform="rotate(-90 ${cx} ${cy})"/>`
      +`<text x="${cx}" y="${cy+r+96}" ${FONT} font-size="48" font-weight="800" text-anchor="middle" fill="#fff" stroke="#000" stroke-opacity=".5" stroke-width="6" paint-order="stroke">${Math.max(1,Math.ceil(3-3*u))}</text>`:'')+`</g>`;}
  s+=pill('全部 試さずに 解ける？',540,Y1-110,{size:44,color:'#fff',bg:'#9c2a1c',bo:.9,anchor:'middle',op:on(W_('ゼンブ'))});
 }
 // ---- 数える ----
 if(k==='book:kindi'){const a=W_('カゾエル'),u=on(a,.18);if(u>0){const sc=1+.25*(1-u);s+=`<g opacity="${n(u)}" transform="translate(540 640) scale(${n(sc*100)/100})"><text x="0" y="0" ${FONT} font-size="190" font-weight="900" text-anchor="middle" fill="#3a1d06" opacity=".5" transform="translate(8 10)">数える</text><text x="0" y="0" ${FONT} font-size="190" font-weight="900" text-anchor="middle" fill="#fff" stroke="#e8761e" stroke-width="12" paint-order="stroke">数える</text></g>`;}}
 if(k==='doll:tag')s+=pill('名札 → あだ名',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('ツケカエタト'))});
 if(k==='doll:who'){const a=W_('ダレガ');for(let i=0;i<6;i++){const p=ctx.anchor('doll'+i);if(p&&p[2])s+=pill('？',p[0],p[1]-40,{size:44,color:'#fff',bg:'#141a2b',bo:.8,anchor:'middle',op:on(a+.08*i)});}}
 if(k==='doll:talk'){s+=pill('いちばん よくしゃべる',540,Y1,{size:42,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('イチバン'))});
  s+=pill('声の多さは 消えない',540,Y2,{size:46,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('キエナイ'))});}
 if(k==='e3:flip'){s+=stepsRow([['E E E',W_('ミッツノ')],['X X X',W_('ミッツノ',1),W]],t,Y1,{size:46});
  s+=pill('数は 3 ＝ 3（増えも減りもしない）',540,Y2,{size:42,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('フエモ'))});}
 if(k==='tw:pair'){s+=pill('変わるのは 名前だけ',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('ナマエ'))});
  s+=pill('数（塔の高さ）は そのまま',540,Y2,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ノコル'))});}
 if(k==='tw:en'){
  const pe=ctx.anchor('eTop'),pt=ctx.anchor('tTop');
  if(pe&&pe[2])s+=pill('E 約13％',Math.min(900,Math.max(180,pe[0])),pe[1]-48,{size:42,color:'#222',bg:'#ffffff',bo:.93,anchor:'middle',op:on(W_('ジュウサン'))});
  if(pt&&pt[2])s+=pill('T 約9％',Math.min(900,Math.max(180,pt[0])),pt[1]-48,{size:42,color:'#222',bg:'#ffffff',bo:.93,anchor:'middle',op:on(W_('キュウ'))});
  s+=pill('英語の長い文章の割合',540,Y1-70,{size:40,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(cs+.2)});
 }
 if(k==='dice:short')s+=paper([['例：「ZOO」では '],['O','#c05a00'],[' が一番多い']],540,Y1,{size:42,anchor:'middle',op:on(W_('タマタマ'))})+pill('短い文では 当てにならない',540,Y2,{size:42,color:'#fff',bg:'#9c2a1c',bo:.9,anchor:'middle',op:on(W_('アテニ'))});
 if(k==='dice:roll'){
  // 着いた目（desk_1_1v5.py の dice_times と同じ時刻：「サイコロを」〜「かたよりが」の間に5回、1回 0.62 秒）
  const a=W_('サイコロオ'),b=W_('カタヨリガ')+.2,d=.62,R=[3,3,5,3,1];
  const items=R.map((v,i)=>[String(v),a+(b-a-d)*i/(R.length-1)+d,v===3?ORANGE:'#fff']);
  s+=stepsRow(items,t,Y1,{size:50,sep:'・'});
  s+=pill('3 が多い？ … 数回では 分からない',540,Y2,{size:40,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('ワカラナイ'))});
 }
 if(k==='dice:long')s+=pill('数百文字以上の 長い文で数える',540,Y1,{size:42,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('スウヒャク'))});
 if(k==='tower:grow')s+=pill('暗号文 541文字を 数える',540,Y1,{size:44,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('ゴヒャク'))});
 if(k==='tower:e'){s+=pill('1位：X（70回）',540,Y1,{size:46,color:'#2a1406',bg:ORANGE,bo:.95,anchor:'middle',op:on(W_('エックス'))});
  s+=pill('X ＝ E ？',540,Y2,{size:48,color:'#fff',bg:'#9c2a1c',bo:.9,anchor:'middle',op:on(W_('エックスガ'))});}
 // ---- 論理の筋（行37〜39）：紙の札が上から順に貼られていく ----
 const L=logicState(ctx,t);
 if(L)s+=L;
 if(k==='logic:fact'){
  // JVX の数（desk_1_1v5.py の jvx_lit と同じ：「さがすと」〜「でて」の間に 1→14）
  const a=W_('サガスト'),b=W_('デテ');const m=t<a?0:Math.min(14,1+Math.floor(14*(t-a)/(b-a)));
  if(m>0)s+=pill(`JVX：${m}回`,890,476,{size:50,color:'#2a1406',bg:'#ffd23f',bo:.95,anchor:'middle',op:on(a,.2)});
 }
 if(k==='scroll:back')s+=pill('試した鍵：0通り',540,Y1,{size:48,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('ヒトツモ'))});
 if(k==='end:ps'){const u=on(W_('ニセノ'));if(u>0)s+=pill('偽の追伸',540,420,{size:46,color:'#fff',bg:'#9c2a1c',bo:.92,anchor:'middle',op:u});}
 if(k==='ch:next')s+=pill('？＝ずらす数（鍵）',540,420,{size:44,color:'#fff',bg:'#1f4fae',bo:.9,anchor:'middle',op:on(W_('カエサル'))});
 return s;
}
// 論理の筋の札：行37b「仮説」〜行39b「判定」。前の cue で出た札は出たまま
function logicState(ctx,t){
 const order=['logic:hyp','logic:if','logic:fact','logic:judge'];
 const k=key(ctx.cue);if(!order.includes(k))return '';
 const all=ctx.clip.scenes.flatMap(sc=>sc.cues.map((qq,i)=>({qq,cap:sc.captions[i]})));
 const T_=(kk,needle,occ=0)=>{const x=all.find(y=>key(y.qq)===kk);return x.cap.start+wt({cue:x.qq,t:0,dur:x.cap.end-x.cap.start},needle,occ);};
 const on=(a,d=.25)=>sm((t-a)/d);
 const K='#3b2412',R='#b3261e',O='#c05a00';
 let s='';
 s+=paper([['仮説：',K],['X','#c05a00'],['＝E、',K],['J','#c05a00'],['＝T',K]],40,300,{size:42,op:on(T_('logic:hyp','カセツ')),rot:-1});
 if(order.indexOf(k)>=1){
  s+=paper([['もし正しいなら ↓',K]],40,392,{size:40,op:on(T_('logic:if','モシ')),rot:.6});
  s+=paper([['予言：',K],['J□X','#c05a00'],[' が 何度も 出る',K]],40,476,{size:42,op:on(T_('logic:if','ハズデス')),rot:-.5});
 }
 if(order.indexOf(k)>=2)s+=paper([['事実：',K],['JVX','#c05a00'],[' が 14回',K]],560,392,{size:40,op:on(T_('logic:fact','デテ')),rot:.8});
 if(order.indexOf(k)>=3){
  s+=paper([['判定：',K],['○',R],[' 予言どおり',K]],40,580,{size:40,op:on(T_('logic:judge','ヨゲンドオリ')),rot:-.6});
  s+=pill('V ＝ H',820,580,{size:50,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(T_('logic:judge','エイチ'))});
 }
 return s;
}
