// Part A's exact screen labels; timings are cue/word based, never old row numbers.
import {readFileSync} from 'node:fs';
import {esc,clamp} from './anim.mjs';
import {pill,stepsRow} from './desk-overlay-lib.mjs';
import {FONT,measureLabels,textWidth,wrapText} from './desk-d1ab-typeset_gpt_20261026.mjs';
const ownSource=readFileSync(new URL(import.meta.url),'utf8');
await measureLabels([...ownSource.matchAll(/(?:card|noteTag)\('([^'\n]+)'/g)].map(m=>m[1]));
const sm=x=>{x=clamp(x);return x*x*(3-2*x);},n=x=>+x.toFixed(1);
let D=null;function data(){return D??=JSON.parse(readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')+'/blender/data.json','utf8'));}
const key=q=>q.diagram.replace(/^cd1a-/,'');
function cue(k){const c=data().cues.find(c=>c.key===k);if(!c)throw Error('d1a cue '+k);return c;}
let ACTUAL_WORDS=null;
function W(k,word){
 const a=cue(k).wordEvents.filter(w=>w.word===word);if(a.length!==1)throw Error('d1a word '+k+' '+word);
 ACTUAL_WORDS??=JSON.parse(readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028')+'/word-events-actual_s3_20261028.json','utf8'));
 const actual=ACTUAL_WORDS[k]?.[word];if(!actual||!Number.isFinite(actual.time))throw Error('Missing derived actual word '+k+' '+word);
 return actual.time;
}
const typedNumbers=data().numbers;
await measureLabels([
 '入口の 弁','出口の 弁','ふもと','頂上',
 `大さじ1杯 → 約${typedNumbers.roundedSteamL}リットル`,`（約${typedNumbers.expansion}倍）`,
 `1平方cm → 約${typedNumbers.roundedAtmosphereKgCm2}kg`,`手のひら 約${typedNumbers.palmCm2}平方cm → 約${typedNumbers.palmCm2}kg`,
 `直径 約${typedNumbers.diameterCm}cm`,`半径 約${typedNumbers.radiusCm}cm`,
 `約${typedNumbers.roundedAreaCm2}平方cm ＝ 手のひら ${typedNumbers.palms}枚`,
 `重さで 比べると 約${typedNumbers.roundedHorses}頭`,`馬 1頭 約${typedNumbers.horseKg}kg として`,
 'ボイラー（湯を わかす 釜）','筒','ピストン（上下に 動く ふた）','腕（シーソー）','事実：毎回 冷たい',' 水で 冷やす'
]);
function card(lines,x,y,{size=42,op=1,center=false,color='#3b2412'}={}){
 if(op<=.003)return '';if(typeof lines==='string')lines=[lines];lines=lines.flatMap(s=>wrapText(s,size,948));
 const width=Math.min(1000,Math.max(...lines.map(l=>textWidth(l,size)))+52),h=lines.length*size*1.28+24;
 y=Math.max(110+h/2,Math.min(1595-h/2,y));x=center?x-width/2:x;x=Math.max(40,Math.min(1040-width,x));
 return `<g opacity="${n(op)}"><rect x="${n(x+4)}" y="${n(y-h/2+5)}" width="${n(width)}" height="${n(h)}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x)}" y="${n(y-h/2)}" width="${n(width)}" height="${n(h)}" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/>${lines.map((l,i)=>`<text x="${n(x+width/2)}" y="${n(y-h/2+size+12+i*size*1.28)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(l)}</text>`).join('')}</g>`;
}
const noteTag=(s,x=40,y=1490,op=1)=>card(s,x,y,{size:36,op});
function view(kind){const col={'具体例':'#38c6d9','たとえ話':'#ff9ce6','確かめる側から':'#5aa469','作る側から':'#f0a040'}[kind];if(!col)throw Error('Unknown view '+kind);const s='見方：'+kind,w=textWidth(s,40)+96;return `<g><rect x="40" y="176" width="${n(w)}" height="76" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/><rect x="54" y="186" width="${n(w-28)}" height="56" rx="5" fill="#f4e8cc"/><rect x="54" y="186" width="22" height="56" rx="4" fill="${col}"/><text x="90" y="228" ${FONT} font-size="40" font-weight="800" fill="#3b2412">${esc(s)}</text></g>`;}
function leader(ctx,name,x,y,op){const p=ctx.anchor(name);if(!p?.[2]||op<=.003)return '';return `<g opacity="${n(op)}"><path d="M${x} ${y} L${n(p[0])} ${n(p[1])}" stroke="#f4e8cc" stroke-width="6"/><path d="M${x} ${y} L${n(p[0])} ${n(p[1])}" stroke="#7a5634" stroke-width="2.5"/><circle cx="${n(p[0])}" cy="${n(p[1])}" r="8" fill="#ffd23f"/></g>`;}
function tag(ctx,name,text,x,y,op,size=40){
 const p=ctx.anchor(name);if(!p?.[2]||!Number.isFinite(p[0])||!Number.isFinite(p[1])||op<=.003)return '';
 const lines=wrapText(text,size,948),w=Math.min(1000,Math.max(...lines.map(l=>textWidth(l,size)))+52),h=lines.length*size*1.28+24;
 y=Math.max(110+h/2,Math.min(1595-h/2,y));x=Math.max(40,Math.min(1040-w,x));
 const sx=Math.max(x,Math.min(x+w,p[0])),sy=Math.max(y-h/2,Math.min(y+h/2,p[1]));
 let route=`M${n(sx)} ${n(sy)} L${n(p[0])} ${n(p[1])}`;
 if(Math.min(sy,p[1])<1180&&Math.max(sy,p[1])>1365)route=`M${n(sx)} ${n(sy)} L1038 ${n(sy)} L1038 ${n(p[1])} L${n(p[0])} ${n(p[1])}`;
 const line=`<g opacity="${n(op)}"><path d="${route}" fill="none" stroke="#f4e8cc" stroke-width="6"/><path d="${route}" fill="none" stroke="#7a5634" stroke-width="2.5"/><circle cx="${n(p[0])}" cy="${n(p[1])}" r="8" fill="#ffd23f"/></g>`;
 return line+card(text,x,y,{size,op});
}
function qmark(ctx,name,op){const p=ctx.anchor(name);if(!p?.[2]||op<=.003)return '';const x=Math.max(90,Math.min(990,p[0]+130)),y=Math.max(450,Math.min(1080,p[1]-120));return `<g opacity="${n(op)}"><circle cx="${n(x)}" cy="${n(y)}" r="45" fill="#f4e8cc" stroke="#b8925a" stroke-width="4"/><text x="${n(x)}" y="${n(y+23)}" ${FONT} font-size="64" font-weight="900" text-anchor="middle" fill="#c8483a">？</text></g>`;}
function canPicture(t){const u=Math.max(0,Math.min(1,t)),x=830,y=610;return `<g opacity="${n(u)}"><rect x="690" y="460" width="290" height="300" rx="12" fill="#f4e8cc" stroke="#b8925a" stroke-width="4"/><path d="M${x-40} ${y-68} Q${x-70} ${y-5} ${x-22} ${y+48} L${x+36} ${y+48} Q${x+4} ${y-10} ${x+50} ${y-68}Z" fill="#bac4c8" stroke="#6a6b69" stroke-width="5"/><path d="M${x-30} ${y-20} q35 -30 60 2 q-40 35 -60 30" fill="none" stroke="#6a6b69" stroke-width="4"/></g>`;}
const logic=new Set(['myth:side','myth:hyp','myth:if','myth:fact','myth:judge']);
export function overlayD1a(ctx){
 const {t,cue:q}=ctx,k=key(q),N=data().numbers,on=(at,d=.22)=>sm((t-at)/d);let s='';
 if(t>=2.5){let year=null;if(['mine:open','mine:water','gin:horse','gin:drum','gin:closed','mine:rule','mine:mio'].includes(k))year='1700年ごろ イギリス';if(['nc:install','nc:boiler','nc:piston','myth:mio'].includes(k))year='1712年 イギリス ニューコメン';if(['size:guericke','guericke:build','guericke:pull','guericke:push','size:pull'].includes(k))year='1650年代 ドイツ ゲーリケ';if(year)s+=pill(year,40,130,{size:38,color:'#ffe9c4'});}
 if(q.view)s+=view(q.view);
 const scoreAt=W('gin:closed','閉じて（得点板 水 1−0 人）');if((t>=scoreAt&&t<scoreAt+3.2)||k==='last:can')s+=pill(`水 ${N.scores[0][0]} − ${N.scores[0][1]} 人`,1040,150,{size:40,anchor:'end',op:k==='last:can'?1:on(scoreAt)*(1-on(scoreAt+2.9)),color:'#fff'});
 if(k==='mine:water')s+=card('坑道 ＝ 地下の 通り道',40,330,{op:on(W(k,'坑道'))});
 if(k==='mine:rule'){s+=card('水に 負け → 水に 1点',40,330,{op:on(W(k,'水に負けたら'))});s+=card('くみ出せた → 人に 1点',40,430,{op:on(W(k,'くみ出せたら'))});}
 if(k==='nc:boiler'||k==='nc:piston'){
  for(const [anchor,label,kk,word,x,y] of [['boiler','ボイラー（湯を わかす 釜）','nc:boiler','ボイラー',40,390],['cyl','筒','nc:boiler','太い筒',800,550],['piston','ピストン（上下に 動く ふた）','nc:piston','ピストン',40,1470],['beam','腕（シーソー）','nc:piston','シーソー',40,290]]){const a=W(kk,word);if(t>=a)s+=tag(ctx,anchor,label,x,y,on(a),40);}
 }
 if(logic.has(k)){
  s+=card('仮説：蒸気が ピストンを 押す',40,310,{size:40,op:on(W('myth:hyp','仮説'))});
  s+=card('もし正しいなら',40,402,{size:40,op:on(W('myth:if','もし正しいなら'))});
  s+=card('予言：蒸気を 冷やさない',40,490,{size:40,op:on(W('myth:if','冷やす必要'))});
  s+=card(['事実：毎回 冷たい',' 水で 冷やす'],560,176,{size:40,op:on(W('myth:fact','冷たい水'))});
  s+=card('判定 ×',40,590,{size:42,op:on(W('myth:judge','合いません（判定 ×）')),color:'#c8483a'});
 }
 if(k==='shrink:spoon'||k==='shrink:1700'){
  s+=card(`大さじ1杯 → 約${N.roundedSteamL}リットル`,40,330,{op:on(W('shrink:spoon','25リットル'))});
  if(k==='shrink:1700')s+=card(`（約${N.expansion}倍）`,40,430,{op:on(W(k,'1700倍'))});
 }
 if(k==='can:crush')s+=noteTag('熱い 缶は やけどに 注意',40,1490,on(W(k,'ぐしゃっと')));
 if(k==='can:seal'){
  const op=on(W(k,'口を水でふさいで'));
  s+=tag(ctx,'canMouth','口は 水で ふさがれている',40,330,op,40)+leader(ctx,'canWaterline',350,375,op);
 }
 if(k==='air:emptied')s+=card('ほとんど 空っぽ',40,330,{op:on(W(k,'空っぽ'))});
 if(k==='air:weight')s+=card('積もった 空気の 重さ',40,150,{op:on(W(k,'重さ'))});
 if(k==='air:1kg'||k==='air:mio'){
  s+=card(`1平方cm → 約${N.roundedAtmosphereKgCm2}kg`,40,330,{op:on(W('air:1kg','1キログラム'))});
  s+=card(`手のひら 約${N.palmCm2}平方cm → 約${N.palmCm2}kg`,40,1490,{op:on(W('air:1kg','100キログラム分'))});
 }
 if(k==='cyl:likecan')s+=canPicture(on(W(k,'缶と同じ')));
 if(k==='size:53'||k==='size:area'){
  s+=card(`直径 約${N.diameterCm}cm`,40,330,{op:on(W('size:53','直径'))});
  s+=card(`半径 約${N.radiusCm}cm`,40,430,{op:on(W('size:53','半径'))});
 }
 if(k==='size:area'){
  s+=stepsRow([[String(N.radiusCm),W(k,'半径（1つ目）')],[`× ${N.radiusCm}`,W(k,'半径（2つ目）')],[`× ${N.pi}`,W(k,'3.14')],[`≒ ${N.roundedAreaCm2}`,W(k,'2200平方センチメートル')]],t,1460,{size:42,sep:' '});
  s+=card(`約${N.roundedAreaCm2}平方cm ＝ 手のひら ${N.palms}枚`,540,1555,{size:40,center:true,op:on(W(k,'22枚分'))});
 }
 if(k==='size:2t'){
  s+=stepsRow([[`${N.palmCm2}kg`,W(k,'100キログラム')],[`× ${N.palms}`,W(k,'22枚')],[`＝ 約${N.kg}kg`,W(k,'2200キログラム')],[`≒ 約${N.tonnes}トン`,W(k,'2トン分')]],t,330,{size:42,sep:' '});
  s+=noteTag('実際は 完全には 空にならず、もっと 小さい',40,1490,on(W(k,'完全に')));
 }
 if(k==='size:horse4'){s+=card(`重さで 比べると 約${N.roundedHorses}頭`,40,330,{op:on(W(k,'4頭分'))});s+=noteTag(`馬 1頭 約${N.horseKg}kg として`);}
 if(k==='guericke:build'||k==='guericke:pull'||k==='guericke:push'){
  s+=card('弁 ＝ 一方にしか 開かない 扉',40,330,{op:on(W('guericke:build','弁という'))});
  const op=on(W('guericke:build','2つ付いています'));
  s+=tag(ctx,'inlet','入口の 弁',40,440,op,36)+tag(ctx,'outlet','出口の 弁',700,440,op,36);
 }
 if(k==='next:mio')s+=qmark(ctx,'cyl',on(W(k,'何が起きてる')));
 if(k==='next:open')s+=card('D 熱と動力 2本目',40,330,{op:on(W(k,'次の回'))});
 if(k==='ch:fuji'||k==='ch:later'){
  s+=tag(ctx,'fujiLow','ふもと',40,350,on(cue('ch:fuji').start),36)+tag(ctx,'fujiHigh','頂上',760,350,on(cue('ch:fuji').start),36);
  s+=qmark(ctx,'fuji',on(W('ch:fuji','ピストンを押す力')));
 }
 return s;
}
