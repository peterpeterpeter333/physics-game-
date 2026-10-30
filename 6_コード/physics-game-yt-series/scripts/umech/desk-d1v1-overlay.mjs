// D-1 paper labels; exact supplied Japanese. No shared renderer is changed.
import {readFileSync} from 'node:fs';
import {esc,clamp} from './anim.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';
import {paper,pill,stepsRow,noteTag} from './desk-overlay-lib.mjs';
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const sm=x=>{x=clamp(x);return x*x*(3-2*x);};const n=x=>+x.toFixed(1);
const jw=s=>[...s].reduce((a,c)=>a+(/[ -~]/.test(c)?.60:1),0);
let D=null;function data(){return D??=JSON.parse(readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1')+'/blender/data.json','utf8'));}
const key=q=>q.diagram.replace(/^cd1v1-/,'');
function T(ctx,k,word=null,occ=0){const x=ctx.clip.scenes.flatMap(s=>s.cues.map((q,i)=>({q,cap:s.captions[i]}))).find(x=>key(x.q)===k);if(!x)throw Error(k);return x.cap.start+(word==null?0:wt({cue:x.q,t:0,dur:x.cap.end-x.cap.start},word,occ));}
// A multi-line cream paper, with one text per line and generous measured-width padding.
function card(lines,x,y,{size=42,op=1,center=false,color='#3b2412',wood=false}={}){
 if(op<=.003)return '';if(typeof lines==='string')lines=[lines];
 const width=Math.min(1000,Math.max(...lines.map(l=>jw(l)*size))+52),h=lines.length*size*1.28+24;
 x=center?x-width/2:x;x=Math.max(40,Math.min(1040-width,x));
 const texts=lines.map((l,i)=>`<text x="${n(x+width/2)}" y="${n(y-h/2+size+12+i*size*1.28)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(l)}</text>`).join('');
 return `<g opacity="${n(op)}"><rect x="${n(x+4)}" y="${n(y-h/2+5)}" width="${n(width)}" height="${n(h)}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x)}" y="${n(y-h/2)}" width="${n(width)}" height="${n(h)}" rx="8" fill="${wood?'#8a5a32':'#f4e8cc'}" stroke="#b8925a" stroke-width="3"/>${texts}</g>`;
}
function view(kind,op,targetY=176){
 const col={'具体例':'#38c6d9','たとえ話':'#ff9ce6','確かめる側から':'#5aa469','作る側から':'#f0a040'}[kind];
 const s='見方：'+kind,w=jw(s)*40+96,x=40,y=176;
 return `<g opacity="${n(op)}" transform="translate(0 ${targetY-176})"><rect x="${x+4}" y="${y+6}" width="${w}" height="76" rx="10" fill="#2a1406" opacity=".4"/><rect x="${x}" y="${y}" width="${w}" height="76" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/><rect x="54" y="186" width="${w-28}" height="56" rx="5" fill="#f4e8cc"/><rect x="54" y="186" width="22" height="56" rx="4" fill="${col}"/><circle cx="65" cy="180" r="7" fill="#c9a44e"/><circle cx="${x+w-25}" cy="180" r="7" fill="#c9a44e"/><text x="${x+50}" y="228" ${FONT} font-size="40" font-weight="800" fill="#3b2412">${esc(s)}</text></g>`;
}
export function overlayD1v1(ctx){
 const {t,cue:q,cap}=ctx,k=key(q),c=data().cues.find(c=>c.key===k),N=data().numbers;
 const on=(at,d=.22)=>sm((t-at)/d),W=(word,occ=0)=>T(ctx,k,word,occ);let s='';
 if(t<2)s+=card('D 熱と動力 1',40,300,{size:36,op:1-sm((t-1.7)/.3)});
 if(t>=2.5){let year=c.row<=5?'1700年ごろ イギリス':c.row<=8?'1712年 イギリス ニューコメン':c.row===39||c.row===40?'1650年代 ドイツ ゲーリケ':null;if(year)s+=pill(year,40,130,{size:38,color:'#ffe9c4'});}
 if(q.view)s+=view(q.view,1,c.group==='can'?110:176);
 for(const [kk,word,i] of [['mine:horse','トジテ',0],['eng:repeat','クリカエ',1],['next:spread','クミダセル',2]]){
  const a=T(ctx,kk,word);if(t>=a-.15&&t<a+3.2){const [water,human]=N.scores[i];s+=pill(`水 ${water} − ${human} 人`,1040,150,{size:40,anchor:'end',op:on(a-.15)*(1-on(a+2.9)),color:'#fff'});}
 }
 if(k==='mine:water')s+=card('坑道 ＝ 地下の 通り道',40,350,{op:on(W('コオドオ'))});
 if(k==='mine:rule'){s+=card('水に 負け → 水に 1点',40,330,{op:on(W('マケタラ'))});s+=card('くみ出せた → 人に 1点',40,430,{op:on(W('クミダセタラ'))});}
 if(['nc:boiler','nc:piston'].includes(k)){
  const labels=[['boiler',['ボイラー（湯を わかす 釜）'],'nc:boiler','ボイラア',40,450],['cyl',['筒'],'nc:boiler','ツツ',760,620],['piston',['ピストン','（上下に 動く ふた）'],'nc:piston','ピストン',40,680],['beam',['腕（シーソー）'],'nc:piston','シイソオ',40,330]];
  let leaders='',papers='';for(const [anchor,lines,kk,nd,x,y] of labels){const a=T(ctx,kk,nd),p=ctx.anchor(anchor);if(p?.[2]&&t>=a){leaders+=`<path d="M${x+100} ${y+30} L${n(p[0])} ${n(p[1])}" stroke="#b8925a" stroke-width="4" fill="none"/>`;papers+=card(lines,x,y,{size:40,op:on(a)});}}s+=leaders+papers;
 }
 if(c.row>=9&&c.row<=12){
  s+=card('仮説：蒸気が ピストンを 押す',40,310,{size:40,op:on(T(ctx,'myth:hyp','カセツ'))});
  s+=card('もし正しいなら',40,402,{size:40,op:on(T(ctx,'myth:if','モシ'))});
  s+=card('予言：蒸気を 冷やさない',40,490,{size:40,op:on(T(ctx,'myth:if','ヒヤス'))});
  s+=card(['事実：毎回 冷たい','水で 冷やす'],560,430,{size:40,op:on(T(ctx,'myth:fact','ツメタイ'))});
  s+=card('判定 ×',40,590,{size:42,op:on(T(ctx,'myth:judge','アイマセン')),color:'#c8483a'});
 }
 if(k==='shrink:spoon'||k==='shrink:1700'){
  s+=card('大さじ1杯 → 約25リットル',40,350,{op:on(T(ctx,'shrink:spoon','ニジュウゴ'))});
  if(k==='shrink:1700')s+=card(`（約${N.expansion}倍）`,40,445,{op:on(W('センナナヒャクバイ'))});
 }
 if(k==='shrink:back')s+=card(`蒸気 → 水：${N.expansion}分の1`,40,350,{op:on(W('センナナヒャクブンノ'))});
 if(['can:crush','air:who','air:empty'].includes(k))s+=noteTag('熱い 缶は やけどに 注意');
 if(k==='air:who'||k==='air:empty')s+=card('押したのは まわりの 空気',40,350,{op:on(T(ctx,'air:who','マワリノ'))});
 if(k==='air:empty')s+=card('ほとんど 空っぽ',540,1050,{center:true,op:on(W('カラッポ'))});
 if(k==='air:weight'){s+=card('積もった 空気の 重さ',40,350,{op:on(W('ツモッタ'))});s+=card('上ほど うすい',40,450,{op:on(W('ウスク'))});}
 if(k==='air:1kg'||k==='air:mio'){
  s+=card('1平方cm → 約1kg',40,350,{op:on(T(ctx,'air:1kg','イチキログラム'))});
  s+=card([`手のひら 約${N.palmCm2}平方cm`,`→ 約${N.palmCm2}kg`],40,490,{op:on(T(ctx,'air:1kg','ヒャッキログラム'))});
 }
 if(k==='air:inside'){
  s+=card('外 と 内 が 同じ → つぶれない',40,350,{size:40,op:on(W('ウチガワ'))});
  s+=card('内が 空っぽ → つぶれる',40,450,{op:on(W('ナクナッタ'))});
 }
 if(k==='why:air'||k==='why:steam'){
  s+=card('空気：冷やしても 消えない',40,350,{op:on(T(ctx,'why:air','クウキワ'))});
  s+=card(['蒸気：冷やすと 水に 戻る','→ 空っぽ'],40,490,{op:on(T(ctx,'why:air','ジョオキナラ'))});
 }
 if(k==='eng:cool')s+=card('空っぽ',40,350,{op:on(W('カラッポ'))});
 if(k==='eng:down'){
  s+=stepsRow([['空気が 押す',W('オシサゲ')],['ピストン 下',W('オシサゲ')],['棒 上',W('ヒキアゲラレ')]],t,1470,{size:40});
  s+=card('水 が 出る',540,1560,{size:42,center:true,op:on(W('チジョオエ'))});
 }
 if(k==='eng:repeat')s+=card('1分間に 十数回',40,350,{op:on(W('ジュウスウカイ'))});
 if(k==='size:53'||k==='size:area'){
  s+=card(`直径 約${N.diameterCm}cm`,40,350,{op:on(T(ctx,'size:53','チョッケイ'))});
  s+=card(`半径 約${N.radiusCm}cm`,40,445,{op:on(T(ctx,'size:53','ハンケイ'))});
 }
 if(k==='size:area'){
  s+=stepsRow([[String(N.radiusCm),W('ハンケイ')],[`× ${N.radiusCm}`,W('ハンケイ',1)],[`× ${N.pi}`,W('サンテン')],[`≒ ${N.roundedAreaCm2}`,W('ニセンニヒャク')]],t,1470,{size:42,sep:' '});
  s+=card(`約${N.roundedAreaCm2}平方cm ＝ 手のひら ${N.palms}枚`,540,1560,{size:40,center:true,op:on(W('テノヒラ'))});
 }
 if(k==='size:2t'){
  s+=stepsRow([[`${N.palmCm2}kg`,W('ヒャッキログラム')],[`× ${N.palms}`,W('ニジュウニマイ')],[`＝ 約${N.kg}kg`,W('ニセンニヒャク')]],t,350,{size:42,sep:' '});
  s+=card(`≒ 約${N.tonnes}トン`,40,450,{op:on(W('ニトン'))});
  s+=card(['実際は 完全には 空にならず、','もっと 小さい'],40,1490,{size:36,op:on(W('カンゼンニ'))});
 }
 if(k==='size:horse'){
  s+=card('重さで 比べると 約4頭',40,350,{op:on(W('ウマ'))});s+=noteTag(`馬 1頭 約${N.horseKg}kg として`);
 }
 if(k==='next:100'){
  s+=card('仕事に なった 熱 ＝ 約100分の1',40,350,{size:40,op:on(W('ヒャクブンノ'))});
  const a=W('ヒャクブンノ');if(t>=a){s+='<g>';for(let i=0;i<100;i++)s+=`<rect x="${80+(i%10)*27}" y="${470+Math.floor(i/10)*27}" width="23" height="23" rx="3" fill="${i===0?'#ffd23f':'#f4e8cc'}" stroke="#b8925a" stroke-width="2"/>`;s+='</g>';}
 }
 if(k==='next:who'){const p=ctx.anchor('coal');if(p?.[2])s+=card('？',Math.max(40,p[0]),Math.min(1050,p[1]-90),{size:58,center:true,op:on(W('キズイタ'))});}
 if(k==='ch:fuji'||k==='ch:later'){
  s+=card('富士山の 頂上',40,350,{op:on(T(ctx,'ch:fuji','フジサン'))});
  s+=card('強く？ 弱く？',40,450,{op:on(T(ctx,'ch:fuji','ツヨク'))});
  s+=card('答えは この先の 熱と動力の 回',40,1510,{size:36,op:on(T(ctx,'ch:later','コタエ'))});
 }
 return s;
}
