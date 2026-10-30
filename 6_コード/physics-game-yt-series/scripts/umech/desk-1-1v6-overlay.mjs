// 技術の疑問の鎖 1-1 第6版（ys-chain-1-1v6）の、机の上に重ねる 2D。desk-1-1v5-overlay.mjs（変えていない）の写しに、第6版の行40a〜40k・43a〜43b の物を足した
// （ファイルの終わりの「第6版」の節。第5版の所は変えていない）。以下は第5版の説明：
// 技術の疑問の鎖 1-1 第5版（ys-chain-1-1v5）の、机の上に重ねる 2D。desk-1-1v4-overlay.mjs（変えていない）の写しに、第5版の物を足した。
// desk-frame.mjs から呼ばれる（図のキーは持たない）。文字は 36px 以上。色：平文＝白、暗号文＝橙、鍵＝青。
//  - 年と場所の札・注記（誇張・再現・たとえ）・得点（第4版と同じ）
//  - 三つの見方の札（cue の view：「見方：具体例／たとえ話／破る側から」）：机の世界に合う木の板に紙を貼った札。左上（年の札の下）。その見方の cue の間ずっと出す
//  - 計算の段（1段ずつ）：声がその言葉を言う時刻（wt：phrase-times.json）に出す。声より先には出さない
//  - 論理の筋（行37〜39）：仮説 → もし正しいなら → 予言 → 事実 → 判定 の紙の札
//  - 一時停止の印と 3秒の輪（行24）
import {esc,clamp} from './anim.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';
import {DATA as DATA6,KNOWN,HEAD_CIPH} from './desk-1-1v6-data.mjs';

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
 'end:a':'1586年','end:b':'1586年','end:c':'1586年','end:phel':'1586年','end:ps':'1586年','end:exec':'1587年2月','end:mio':'1587年2月'};
for(const k of ['disk:rome','disk:ad','disk:be','disk:cat','disk:z','clock:tick','ring:loop','ring:za','ring:zc','disk:wheel','disk:turn','disk:read','disk:mio','disk:25','disk:spin','disk:three','disk:kai'])YEAR[k]=ROME;
for(const k of ['book:kindi','book:mio','doll:tag','doll:who','doll:talk','e3:same','e3:three','e3:flip','tw:pair','tw:mio','tw:en','dice:short','dice:roll','dice:long','tower:grow','tower:e','logic:check','logic:hyp','logic:if','logic:fact','logic:judge','rows:fill','rows:done','rows:a','rows:b','rows:c','rows:d','rows:e','rows:f','rows:f2','rows:f3','rows:g','rows:h','rows:i','rows:i2','rows:i2b','rows:i3','rows:i3b','rows:j','rows:j2'])YEAR[k]=KINDI;
const NOTE={'letter:open':'手紙の記号は 再現（本物の記号ではない）','letter:mio':'手紙の記号は 再現（本物の記号ではない）','last:letter':'手紙の記号は 再現（本物の記号ではない）',
 'clock:tick':'時計は たとえ（ローマの物ではない）',
 'scroll:years':'巻物の長さは 大きく誇張','scroll:mio':'巻物の長さは 大きく誇張','scroll:back':'巻物の長さは 大きく誇張',
 'tree:mult':'木の模型：4段目から先は 省略',
 'doll:tag':'人形と名札は たとえ','doll:who':'人形と名札は たとえ','doll:talk':'人形と名札は たとえ',
 'tw:pair':'元の文と暗号文（541文字）の数（板1枚＝1文字）','tw:en':'英語の割合は 一般的な表（E 12.7％、T 9.1％）',
 'dice:roll':'サイコロの目は 例',
 'tower:grow':'暗号文 541文字を数えた（板1枚＝1文字）','end:a':'人形・手は たとえ（運び役・ウォルシンガム）','end:b':'人形・手は たとえ（写しは フェリペス）','end:phel':'記号の手紙・記号の塔は 再現','end:ps':'偽の追伸の記号は 再現'};
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
export function overlay1_1v6(ctx){
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
 s+=fill6(ctx,t);
 s+=end6(ctx,t);
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

// =====================================================================================
// 第6版（ys-chain-1-1v6）
//  行40a〜40j：カメラは止めて 541文字の暗号文の紙を真上から（3D）。その上に
//   - 紙の上の印：1文字の Q（4か所）の輪、NXXJ QJ JVX・JXGG の枠、拡大している行（1行目）の枠
//   - 拡大の板（紙の1行目 JVX QSNI DPGG NXXJ QJ JVX）：上の段＝暗号文（橙、分かった文字は白に変わる）、下の段＝分かった文字（白、まだ＝□）
//   - 候補（□EET IT THE／□EET AT THE）と ×・○、JXGG の段（T E □ □、□ は同じ色）、札（Q＝A、G＝L、D＝W・P＝I）
//   - 左上の「分かった文字」の札（E T H → A → L → W I）
//   - 行40j の後半：見方：たとえ話の札と、クロスワードの升目が埋まっていく小さな絵
//  文字・札は、声がその言葉を言う時刻（phrase-times）に出す。声より先に出さない。
//  行43a・43b：人形の名札・メアリーの側／ウォルシンガムの側・寝返り・流れの段（別の手へ → 写しを作る → 封をし直す → また運ぶ）
// =====================================================================================
const MONO=`font-family="Menlo, Courier New, monospace"`;
const SH6=DATA6.fill6.sheet;
const ROWS6=['rows:a','rows:b','rows:c','rows:d','rows:e','rows:f','rows:f2','rows:f3','rows:g','rows:h','rows:i','rows:i2','rows:i2b','rows:i3','rows:i3b','rows:j','rows:j2'];
function allCues(ctx){return ctx.clip.scenes.flatMap(sc=>sc.cues.map((qq,i)=>({qq,cap:sc.captions[i]})));}
function TT(ctx,kk,needle,occ=0,end=false){const x=allCues(ctx).find(y=>key(y.qq)===kk);if(!x)throw Error('cue が無い '+kk);return needle==null?x.cap.start:x.cap.start+wt({cue:x.qq,t:0,dur:x.cap.end-x.cap.start},needle,occ,{end});}
// 紙の上の文字 (r,c) の画面の位置（3D の紙の四隅のアンカーから）
function sheetXY(ctx,r,c){
 const tl=ctx.anchor('sheetTL'),tr=ctx.anchor('sheetTR'),bl=ctx.anchor('sheetBL'),br=ctx.anchor('sheetBR');
 if(!tl||!tl[2]&&!(tl[0]||tl[1]))return null;
 const u=(SH6.px+(c+.5)*SH6.cw)/SH6.W,v=(SH6.py+(r+.5)*SH6.lh)/SH6.H;
 const L=(a,b,w)=>a+(b-a)*w;
 return [L(L(tl[0],tr[0],u),L(bl[0],br[0],u),v),L(L(tl[1],tr[1],u),L(bl[1],br[1],u),v)];
}
function sheetBox(ctx,r,c0,c1,{col='#ffd23f',op=1,sw=5}={}){
 if(op<=.003)return '';const a=sheetXY(ctx,r,c0),b=sheetXY(ctx,r,c1),d=sheetXY(ctx,r+1,c0);if(!a)return '';
 const cw=(b[0]-a[0])/Math.max(1,c1-c0),lh=d[1]-a[1];
 const x=a[0]-cw*.62,y=a[1]-lh*.55,w=b[0]-a[0]+cw*1.24,h=lh*1.1;
 return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="8" fill="${col}" fill-opacity="${n(.22*op)}" stroke="${col}" stroke-width="${sw}" opacity="${n(op)}"/>`;
}
// 分かった文字（暗号の文字 → 平文の文字）。時刻ごと
function knownAt(ctx,t,{forRow=false}={}){
 const K={...KNOWN.ETH};
 if(t>=TT(ctx,'rows:f3','エエ'))Object.assign(K,KNOWN.A);
 if(t>=(forRow?TT(ctx,'rows:i','エルエル'):TT(ctx,'rows:h','テルダ')))Object.assign(K,KNOWN.L);
 if(t>=TT(ctx,'rows:i2b','エム'))Object.assign(K,KNOWN.M);
 if(t>=TT(ctx,'rows:i3b','アアミイ'))Object.assign(K,KNOWN.RY);
 if(t>=TT(ctx,'rows:j','ウィル'))Object.assign(K,KNOWN.WI);
 return K;
}
// 拡大の板の1字の位置
const MAG={x0:540-24.5*17,step:34,y0:704,yc:808,yp:888,size:54};
const magX=i=>MAG.x0+i*MAG.step;
function letter6(ch,x,y,{size=54,col='#fff',op=1,weight=800}={}){
 if(op<=.003)return '';
 return `<text x="${n(x)}" y="${n(y)}" ${MONO} font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${col}" opacity="${n(op)}">${esc(ch)}</text>`;
}
function blank6(x,y,{col='#8d93a8',op=1,fill='none',size=40}={}){
 if(op<=.003)return '';
 return `<rect x="${n(x-size/2)}" y="${n(y-size*.82)}" width="${size}" height="${size}" rx="5" fill="${fill}" stroke="${col}" stroke-width="3.5" opacity="${n(op)}"/>`;
}
function fill6(ctx,t){
 const q=ctx.cue,k=key(q),cs=ctx.cap.start;
 if(!ROWS6.includes(k)&&k!=='rows:fill')return '';
 const W_=(needle,occ=0,o={})=>cs+wt({cue:q,t:0,dur:ctx.cap.end-cs},needle,occ,o);
 const on=(a,d=.25)=>sm((t-a)/d);
 const T_=(kk,nd,occ=0,end=false)=>TT(ctx,kk,nd,occ,end);
 const a0=T_('rows:a');
 let s='';
 if(k==='rows:fill'){
  return '';
 }
 // ---- 左上：分かった文字 ----
 {
  const K=knownAt(ctx,t);const tA=T_('rows:a','イイ'),tT=T_('rows:a','ティイ'),tH=T_('rows:a','エイチ');
  const parts=[['分かった文字：','#3b2412']];
  const L=[];const add=(c,at)=>{if(t>=at)L.push(c);};
  add('E',tA);add('T',tT);add('H',tH);
  if(K.Q)L.push('A');if(K.G)L.push('L');if(K.N)L.push('M');if(K.S)L.push('R','Y');if(K.D)L.push('W','I');
  if(L.length)parts.push([L.join('\u00a0'),'#1f4fae']);   // 字の間は詰めない空白（幅の見積もりに余裕を持たせる）
  s+=paper(parts,40,300,{size:40,op:on(a0+.6,.3),rot:-.6});
 }
 // ---- 拡大の板の出し入れ：40a（カメラが止まってから）・40d〜40j。40b・40c は紙の全体を見せる（板を隠す） ----
 const tb=T_('rows:b'),td=T_('rows:d');
 const magOp=k==='rows:b'?1-sm((t-tb)/.35):k==='rows:c'?0:k==='rows:d'?sm((t-td)/.35):k==='rows:a'?sm((t-(a0+1.0))/.35):1;
 // 紙の上の印（拡大の板の下・上に関係なく、紙の位置）
 // 1文字の Q：4か所の輪（40b「4回」で順に）→ 40c の間も出す
 if(k==='rows:b'||k==='rows:c'){
  const qa=T_('rows:b','キュウト'),qb=T_('rows:b','ヨンカイ',0,true);
  DATA6.fill6.qPos.forEach(([r,c],i)=>{const p=sheetXY(ctx,r,c);if(!p)return;const at=qa+(qb-qa)*i/3;const u=on(at,.2);
   if(u>0)s+=`<circle cx="${n(p[0])}" cy="${n(p[1]-4)}" r="${n(26+10*(1-u))}" fill="#ffd23f" fill-opacity=".25" stroke="#ffd23f" stroke-width="6" opacity="${n(u)}"/>`
     +`<text x="${n(p[0]+30)}" y="${n(p[1]-24)}" ${FONT} font-size="38" font-weight="800" fill="#ffd23f" stroke="#2a1406" stroke-width="7" paint-order="stroke" opacity="${n(u)}">${i+1}</text>`;});
  if(k==='rows:b')s+=pill('1文字だけの言葉：Q が 4回',540,1470,{size:44,color:'#2a1406',bg:'#ffd23f',bo:.95,anchor:'middle',op:on(W_('ヨンカイ'))});
  if(k==='rows:c'){s+=pill('1文字だけの言葉：Q が 4回',540,1470,{size:44,color:'#2a1406',bg:'#ffd23f',bo:.95,anchor:'middle'});
   s+=paper([['英語の 1文字の言葉：'],['A','#c05a00'],[' か '],['I','#c05a00']],540,1570,{size:44,anchor:'middle',op:on(W_('エエカ'))});}
 }
 if(magOp<=.003)return s;
 // 拡大している所の枠（紙の1行目）と、板へ伸びる線
 const p0=sheetXY(ctx,0,0),p1=sheetXY(ctx,0,24);
 let g='';
 if(p0&&p1){
  g+=sheetBox(ctx,0,0,24,{col:'#9cc4ff',sw:4,op:.9});
  const lh=(sheetXY(ctx,1,0)[1]-p0[1]);
  g+=`<path d="M${n(p0[0]-14)} ${n(p0[1]+lh*.55)} L40 ${MAG.y0}" stroke="#9cc4ff" stroke-width="3" stroke-dasharray="8 8" fill="none" opacity=".8"/><path d="M${n(p1[0]+14)} ${n(p1[1]+lh*.55)} L1040 ${MAG.y0}" stroke="#9cc4ff" stroke-width="3" stroke-dasharray="8 8" fill="none" opacity=".8"/>`;
 }
 // 板
 let bottom=MAG.yp+46;
 const hasCand=['rows:e','rows:f','rows:f2','rows:f3'].includes(k),hasJ=['rows:g','rows:h'].includes(k),hasGloss=k==='rows:j'||k==='rows:j2',hasMeet=k==='rows:i2'||k==='rows:i2b',hasArmy=k==='rows:i3'||k==='rows:i3b';
 if(hasCand)bottom=MAG.yp+46+170;if(hasMeet||hasArmy)bottom=MAG.yp+46+200;if(hasJ)bottom=MAG.yp+46+170;if(hasGloss)bottom=MAG.yp+46+80;
 g+=`<rect x="40" y="${MAG.y0}" width="1000" height="${bottom-MAG.y0}" rx="18" fill="#141a2b" fill-opacity=".93" stroke="#9cc4ff" stroke-width="4"/>`;
 g+=`<text x="60" y="${MAG.y0+44}" ${FONT} font-size="36" font-weight="700" fill="#c8d6f5">暗号文の紙の 1行目（拡大）</text>`;
 // 光らせる所（板の上）：40d〜40f3 は NXXJ QJ JVX、40i は声が言っている言葉
 const seg6=(i0,i1,col,op)=>op>.003?`<rect x="${n(magX(i0)-20)}" y="${n(MAG.yc-56)}" width="${n(magX(i1)-magX(i0)+40)}" height="${n(MAG.yp-MAG.yc+76)}" rx="10" fill="${col}" fill-opacity="${n(.18*op)}" stroke="${col}" stroke-width="4" opacity="${n(op)}"/>`:'';
 if(['rows:d','rows:e','rows:f','rows:f2','rows:f3'].includes(k)){const a=k==='rows:d'?W_('シカク'):cs-1;g+=seg6(14,24,'#ffd23f',on(a));
  if(k==='rows:d')s+=sheetBox(ctx,0,14,24,{op:on(W_('シカク'))});}
 if(k==='rows:i'){
  const ws=[[0,2,W_('ザ')],[4,7,W_('エエ')],[9,12,W_('シカク',3)],[14,17,W_('シカク',5)],[19,20,W_('アット')],[22,24,W_('ザ',1)]];
  let cur=-1;ws.forEach(([,, a],i)=>{if(t>=a)cur=i;});
  if(cur>=0){const [i0,i1]=ws[cur];g+=seg6(i0,i1,'#ffd23f',1);}
 }
 if(hasMeet)g+=seg6(14,17,'#ffd23f',1);
 if(hasArmy)g+=seg6(4,7,'#ffd23f',1);
 // 1行目の暗号文と、分かった文字
 const KR=knownAt(ctx,t,{forRow:true});
 const tE=T_('rows:a','イイ'),tT=T_('rows:a','ティイ'),tH=T_('rows:a','エイチ');
 const shownAt={X:tE,J:tT,V:tH};
 const qMark=(k==='rows:d'&&t>=W_('キュウ'))||['rows:e','rows:f','rows:f2'].includes(k)||(k==='rows:f3'&&!KR.Q);
 [...HEAD_CIPH].forEach((c,i)=>{
  if(c===' ')return;
  const x=magX(i);const p=KR[c];const at=shownAt[c]??-1;
  const known=p&&t>=(at>=0?at:0);
  const kOn=known?(at>=0?on(at,.2):1):0;
  // 上の段：暗号文（橙 → 分かったら白）
  g+=letter6(c,x,MAG.yc,{col:kOn>.5?'#ffffff':ORANGE});
  // 下の段：分かった文字（白）／まだ（□）
  if(known){g+=letter6(p,x,MAG.yp,{col:'#ffffff',op:kOn});if(kOn<1)g+=blank6(x,MAG.yp,{op:1-kOn});}
  else if(c==='Q'&&qMark)g+=letter6('?',x,MAG.yp,{col:'#ffd23f'});
  else g+=blank6(x,MAG.yp);
 });
 g+=`<text x="1022" y="${MAG.yc}" ${FONT} font-size="30" font-weight="700" text-anchor="end" fill="${ORANGE}" opacity=".0">.</text>`;
 // ---- 40e〜40f3：候補（□EET IT THE／□EET AT THE）----
 if(hasCand){
  const y1=MAG.yp+100,y2=MAG.yp+180;
  const cand=(y,qch,lab,at,mark)=>{
   const u=on(at);if(u<=.003)return '';let r='';
   r+=`<text x="${n(magX(14)-40)}" y="${y}" ${FONT} font-size="38" font-weight="800" text-anchor="end" fill="#c8d6f5" opacity="${n(u)}">${esc(lab)}</text>`;
   [...'NXXJ QJ JVX'].forEach((c,j)=>{const i=14+j,x=magX(i);if(c===' ')return;
    if(c==='N')r+=blank6(x,y,{op:u});else if(c==='Q')r+=letter6(qch,x,y,{col:'#ffd23f',op:u});else r+=letter6(KNOWN.ETH[c],x,y,{op:u});});
   if(mark){const m=on(mark[1],.2);if(m>0){
    if(mark[0]==='x')r+=`<g opacity="${n(m)}" stroke="#ff5a4a" stroke-width="12" stroke-linecap="round"><path d="M${n(magX(14)-30)} ${y-58} L${n(magX(24)+30)} ${y+12}"/><path d="M${n(magX(14)-30)} ${y+12} L${n(magX(24)+30)} ${y-58}"/></g>`;
    else r+=`<ellipse cx="${n((magX(14)+magX(24))/2)}" cy="${y-22}" rx="${n((magX(24)-magX(14))/2+48)}" ry="46" fill="none" stroke="#5be08a" stroke-width="8" opacity="${n(m)}"/>`;}}
   return r;};
  const tI=T_('rows:e','アイナラ'),tAa=T_('rows:e','エエナラ'),tX=T_('rows:f','エイゴト');
  const fade=k==='rows:f3'?1-sm((t-T_('rows:f3','エエ')-.6)/.4):1;
  if(fade>.003)g+=`<g opacity="${n(fade)}">${cand(y1,'I','Q＝I なら',tI,['x',tX])}${cand(y2,'A','Q＝A なら',tAa,['o',tX])}</g>`;
 }
 // ---- 40i2：□EET の候補 MEET／FEET、FEET に × ----
 if(hasMeet){
  const y1=MAG.yp+100,y2=MAG.yp+180,x0=magX(14);
  const row=(y,w,at,mark)=>{const u=on(at);if(u<=.003)return '';let r=[...w].map((c,j)=>letter6(c,magX(14+j),y,{col:j===0?'#ffd23f':'#fff',op:u})).join('');
   if(mark){const m=on(mark[1],.2);if(m>0){if(mark[0]==='x')r+=`<g opacity="${n(m)}" stroke="#ff5a4a" stroke-width="12" stroke-linecap="round"><path d="M${n(x0-30)} ${y-58} L${n(magX(17)+30)} ${y+12}"/><path d="M${n(x0-30)} ${y+12} L${n(magX(17)+30)} ${y-58}"/></g>`;
    else r+=`<ellipse cx="${n((x0+magX(17))/2)}" cy="${y-22}" rx="${n((magX(17)-x0)/2+46)}" ry="44" fill="none" stroke="#5be08a" stroke-width="8" opacity="${n(m)}"/>`;}}
   return r;};
  const tM=T_('rows:i2','ミイトカ'),tF=T_('rows:i2','フィイト'),tN=T_('rows:i2','シゼン');
  g+=`<text x="${n(x0-60)}" y="${y1}" ${FONT} font-size="38" font-weight="800" text-anchor="end" fill="#c8d6f5" opacity="${n(on(tM))}">□EET の候補</text>`;
  g+=row(y1,'MEET',tM,['o',tN])+row(y2,'FEET',tF,['x',tN]);
 }
 // ---- 40i3：QSNI ＝ A□M□ → ARMY ----
 if(hasArmy){
  const y1=MAG.yp+100,y2=MAG.yp+180;
  const tA=T_('rows:i3','エエ'),tR=T_('rows:i3b','アアミイ');
  g+=`<text x="${n(magX(4)-60)}" y="${y1}" ${FONT} font-size="38" font-weight="800" text-anchor="end" fill="#c8d6f5" opacity="${n(on(tA))}">QSNI</text>`;
  [...'A□M□'].forEach((c,j)=>{const x=magX(4+j);g+=c==='□'?blank6(x,y1,{op:on(tA)}):letter6(c,x,y1,{op:on(tA)});});
  g+=`<text x="${n(magX(9))}" y="${y1-14}" ${FONT} font-size="36" font-weight="800" fill="#c8d6f5" opacity="${n(on(T_('rows:i3','ヨンモジノ')))}">A で始まり 3文字目が M の 4文字</text>`;
  const u=on(tR);if(u>0){[...'ARMY'].forEach((c,j)=>{g+=letter6(c,magX(4+j),y2,{col:'#5be08a',op:u});});g+=`<text x="${n(magX(9))}" y="${y2-14}" ${FONT} font-size="40" font-weight="800" fill="#5be08a" opacity="${n(u)}">→ ARMY（軍）</text>`;}
 }
 // ---- 40g・40h：JXGG の段（T E □ □、□ は同じ色）----
 if(hasJ){
  const y1=MAG.yp+100,y2=MAG.yp+180,x0=540-1.5*60;
  const tg=T_('rows:g','ジェエ'),tsame=T_('rows:g','オナジ'),tl=T_('rows:h','テルダ');
  const u=on(tg);
  g+=`<text x="${n(x0-70)}" y="${y1}" ${FONT} font-size="36" font-weight="700" text-anchor="end" fill="#c8d6f5" opacity="${n(u)}">5行目</text>`;
  [...'JXGG'].forEach((c,j)=>{const x=x0+j*60;const kn=c!=='G';g+=letter6(c,x,y1,{col:kn?'#fff':ORANGE,op:u});
   if(kn)g+=letter6(KNOWN.ETH[c],x,y2,{op:on(T_('rows:g',c==='J'?'ティイ':'イイソシテ'))});
   else{const sm_=on(tsame);const L=on(tl,.2);
    g+=blank6(x,y2,{col:'#5b9bff',fill:'#5b9bff',op:sm_*(1-L)*.9});
    if(L>0)g+=letter6('L',x,y2,{op:L});}});
  if(k==='rows:g')g+=`<text x="${n(x0+2.5*60+80)}" y="${y2-8}" ${FONT} font-size="36" font-weight="700" fill="#9cc4ff" opacity="${n(on(tsame))}">← 同じ文字</text>`;
  s+=sheetBox(ctx,DATA6.fill6.jxggPos[0][0],DATA6.fill6.jxggPos[0][1],DATA6.fill6.jxggPos[0][1]+3,{op:u});
 }
 // ---- 40j：軍が・会う・の間に入る □□LL → WILL ----
 if(hasGloss){
  const y=MAG.yp+86;
  const tg=k==='rows:j'?W_('グンガ'):cs-1,ta=k==='rows:j'?W_('アウ'):cs-1,tm=k==='rows:j'?W_('アイダニ'):cs-1;
  const midX=i=>(magX(i[0])+magX(i[1]))/2;
  g+=pill('軍が',midX([4,7]),y,{size:38,color:'#fff',bg:'#3a4566',bo:.95,anchor:'middle',op:on(tg)});
  g+=pill('会う',midX([14,17]),y,{size:38,color:'#fff',bg:'#3a4566',bo:.95,anchor:'middle',op:on(ta)});
  const u=on(tm);if(u>0)g+=`<path d="M${n(midX([4,7])+70)} ${y} L${n(midX([9,12])-26)} ${y}" stroke="#ffd23f" stroke-width="5" opacity="${n(u)}" marker-end="url(#ar6)"/><path d="M${n(midX([14,17])-70)} ${y} L${n(midX([9,12])+26)} ${y}" stroke="#ffd23f" stroke-width="5" opacity="${n(u)}" marker-end="url(#ar6)"/>`+seg6(9,12,'#ffd23f',u);
 }
 // 札（左下）：Q＝A、G＝L、D＝W・P＝I（声がその文字を言う時刻）
 if(k==='rows:f2')s+=pill('当てはめて、意味が通るほうを残す',540,1470,{size:40,color:'#fff',bg:'#141a2b',bo:.85,anchor:'middle',op:on(W_('イミガ'))});
 if(k==='rows:f3')s+=pill('Q ＝ A',540,1470,{size:52,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(W_('エエ'))});
 if(k==='rows:h')s+=pill('G ＝ L（JXGG ＝ TELL）',540,1470,{size:46,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(W_('テルダ'))});
 if(k==='rows:i2')s+=pill('AT THE の前 → 会う（MEET）',540,1470,{size:42,color:'#fff',bg:'#3a4566',bo:.92,anchor:'middle',op:on(W_('ドコカデ'))});
 if(k==='rows:i2b')s+=pill('N ＝ M（NXXJ ＝ MEET）',540,1470,{size:46,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(W_('エム'))});
 if(k==='rows:i3b')s+=pill('S ＝ R、I ＝ Y（QSNI ＝ ARMY）',540,1470,{size:44,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(W_('アアミイ'))});
 if(k==='rows:j')s+=pill('D ＝ W、P ＝ I（DPGG ＝ WILL）',540,1470,{size:44,color:'#fff',bg:'#1f4fae',bo:.92,anchor:'middle',op:on(W_('ウィル'))});
 // 40j の後半：クロスワードの升目が埋まっていく小さな絵（見方：たとえ話）
 if(k==='rows:j2')s+=crossword(t,W_('ヒトモジ'),W_('ワカリマス'));
 s+=`<defs><marker id="ar6" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#ffd23f"/></marker></defs>`;
 return s+`<g opacity="${n(magOp)}">${g}</g>`;
}
// クロスワード（たとえ）：横 TELL、縦 THE・LIE。1文字ずつ埋まり、交わる升の文字が、縦の言葉の穴を埋める
function crossword(t,a,b){
 const G=[['T','E','L','L'],['H','#','#','I'],['E','#','#','E']];
 const order=[[0,0],[0,1],[0,2],[0,3],[1,0],[2,0],[1,3],[2,3]];
 const cs=74,x0=1040-4*cs-20,y0=430;
 let s=`<g><rect x="${x0-18}" y="${y0-62}" width="${4*cs+36}" height="${3*cs+86}" rx="14" fill="#f4e8cc" stroke="#b8925a" stroke-width="4"/>`
  +`<text x="${x0+2*cs}" y="${y0-18}" ${FONT} font-size="36" font-weight="800" text-anchor="middle" fill="#3b2412">クロスワード</text>`;
 const op=sm((t-a+.3)/.3);
 G.forEach((row,r)=>row.forEach((c,cc)=>{const x=x0+cc*cs,y=y0+r*cs;
  if(c==='#'){s+=`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="#3b2412"/>`;return;}
  s+=`<rect x="${x}" y="${y}" width="${cs}" height="${cs}" fill="#fffaf0" stroke="#3b2412" stroke-width="3"/>`;
  const k=order.findIndex(([rr,c2])=>rr===r&&c2===cc);const at=a+(b-a)*k/(order.length-1);const u=sm((t-at)/.2);
  if(u>0)s+=`<rect x="${x+3}" y="${y+3}" width="${cs-6}" height="${cs-6}" fill="#ffd23f" opacity="${n(.6*(1-sm((t-at-.3)/.4)))}"/><text x="${x+cs/2}" y="${y+cs*.72}" ${MONO} font-size="48" font-weight="800" text-anchor="middle" fill="#3b2412" opacity="${n(u)}">${c}</text>`;
 }));
 return `<g opacity="${n(op)}">${s}</g></g>`;
}
// 行43a・43b
function end6(ctx,t){
 const q=ctx.cue,k=key(q),cs=ctx.cap.start;
 if(k!=='end:a'&&k!=='end:b')return '';
 const W_=(needle,occ=0,o={})=>cs+wt({cue:q,t:0,dur:ctx.cap.end-cs},needle,occ,o);
 const on=(a,d=.25)=>sm((t-a)/d);
 let s='';
 const head=ctx.anchor('gifHead'),wal=ctx.anchor('walTip'),bb=ctx.anchor('barrelBig');
 const clampX=(x,w)=>Math.max(40+w/2,Math.min(1040-w/2,x));
 if(k==='end:a'){
  if(head&&head[2]){const ok=on(W_('ギフォオド'));const lab='運び役 ギフォード';s+=pill(lab,clampX(head[0],jw(lab)*40+36),head[1]-50,{size:40,color:'#fff',bg:'#5a3f26',bo:.92,anchor:'middle',op:ok});}
  if(bb&&bb[2])s+=pill('メアリーの側',clampX(bb[0],300),bb[1]+150,{size:40,color:'#fff',bg:'#7a2a4a',bo:.9,anchor:'middle',op:on(W_('メアリイノ'))});
  const tw=W_('ウォルシンガムノ');if(wal&&wal[2]&&t>tw)s+=pill('ウォルシンガムの側',clampX(wal[0]-40,380),Math.max(330,wal[1]-120),{size:40,color:'#fff',bg:'#26262e',bo:.92,anchor:'middle',op:on(tw+.4)});
  const tn=W_('ネガエッテ');if(head&&head[2])s+=pill('寝返り',clampX(head[0]+40,170),head[1]-135,{size:46,color:'#fff',bg:'#9c2a1c',bo:.95,anchor:'middle',op:on(tn+.7)});
 }
 if(k==='end:b'){
  if(head&&head[2])s+=pill('ギフォード',clampX(head[0],240),head[1]-50,{size:38,color:'#fff',bg:'#5a3f26',bo:.85,anchor:'middle'});
  s+=stepsRow([['別の手へ',W_('マワシマシタ')],['写しを作る',W_('ウツシトラレ')],['封をし直す',W_('フウオ')],['また運ぶ',W_('トドケラレテ')]],t,430,{size:40});
  const c2=ctx.anchor('c2');if(c2&&c2[2])s+=pill('写し',c2[0],c2[1]-46,{size:38,color:'#fff',bg:'#3f5a4a',bo:.92,anchor:'middle',op:on(W_('ウツシトラレ')+.4)});
  const c1=ctx.anchor('c1'),td=W_('ナニゴトモ');if(c1&&c1[2])s+=pill('封蝋',c1[0]-20,c1[1]+70,{size:38,color:'#fff',bg:'#a3151b',bo:.92,anchor:'middle',op:on(W_('フウオ')+.5)*(1-on(td+.2))});
 }
 return s;
}
