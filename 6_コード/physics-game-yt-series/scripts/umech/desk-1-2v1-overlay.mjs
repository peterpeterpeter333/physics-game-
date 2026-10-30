// 1-2-only overlay. All explanatory wording comes from the supplied shot table.
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {esc} from './anim.mjs';
import {viewCard,stepsRow} from './desk-overlay-lib.mjs';
const ROOT=()=>process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-1-2v1-render';
let D=null,K=null;
const F='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const ORANGE='#ffa04a',BLUE='#9cc4ff';
const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const labels=[
 '1586年 イングランド','1467年 イタリア アルベルティ','1553年 イタリア ベラーゾ',
 '手紙の記号は 再現（本物の記号ではない）','COUNT THE LETTERS ＝ 文字を 数えなさい',
 '入れ替え表：同じ文字 → いつも同じ記号','E → X（12.9％）','図は26文字（本物は24文字）',
 '26目盛り ＝ 26通りの 入れ替え表','大文字 ＝ 回した しるし','人形と名札は、文字の入れ替えの たとえ',
 '仮説：一番多い 暗号文字は E から','もし正しいなら','予言：一つの塔が 高く伸びる',
 '事実：一番高くても 5.5％','判定 ×','同じ 541文字を、1文字ごとに 円板を回して 暗号に',
 'ベラーゾ（1553年）','ヴィジュネル（1586年）','名前は のちの 呼び名',
 'カエサル：いつも 3','合言葉：1文字ごとに 変わる',
 '一つの表 12.9％','合言葉 KEY 9.6％','毎回 回す 5.5％','KEYWORD：7.4％','解けない 暗号',
 '数える動きは 早回し','1文字 飛ばす → この先が 全部 ずれる','入れ替え表の 暗号（多くの国で）',
 '合言葉：KEY','答えは 次の回','作る側 0 − 2 破る側','作る側 1 − 2 破る側','＋1',
 'MYEXD DRO VODDOBC','COUNT THE LETTERS',
 ...Array.from({length:27},(_,i)=>String(i)),
 ...['LXDWC','KWCVB','JVBUA','IUATZ','HTZSY','GSYRX','FRXQW','EQWPV','DPVOU','COUNT'].map((s,i)=>`${i+1}目盛り：${s}`),'3','?', '…', '×',
];
// Measure actual rendered glyph ink, rather than guessing ASCII width at .55 em.
const WIDTH=new Map();
for(const size of [36,40,42,46])for(const text of labels){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="130"><rect width="2400" height="130" fill="white"/><text x="30" y="85" ${F} font-size="${size}" font-weight="800" fill="black">${esc(text)}</text></svg>`;
 const {info}=await sharp(Buffer.from(svg)).trim({background:'#ffffff'}).toBuffer({resolveWithObject:true});
 WIDTH.set(size+'|'+text,info.width);
}
function card(text,x,y,{size=40,op=1,center=false,end=false,paper=false,color='#fff',width=null,fill=null}={}){
 if(op<.003)return '';
 const w=width??((WIDTH.get(size+'|'+text)??(()=>{throw Error('Unmeasured label: '+text);})())+52);
 if(w>1000)throw Error('Label needs an explicit line break: '+text);
 let left=center?x-w/2:end?x-w:x;left=Math.max(40,Math.min(1040-w,left));
 const h=size+28;const yy=Math.max(110+h/2,Math.min(1600-h/2,y));
 return `<g opacity="${op.toFixed(3)}"><rect x="${left.toFixed(1)}" y="${(yy-h/2).toFixed(1)}" width="${w}" height="${h}" rx="${paper?8:h/2}" fill="${fill??(paper?'#f4e8cc':'#141a2b')}" fill-opacity=".9"${paper?' stroke="#b8925a" stroke-width="3"':''}/><text x="${(left+w/2).toFixed(1)}" y="${(yy+size*.36).toFixed(1)}" ${F} text-anchor="middle" font-size="${size}" font-weight="800" fill="${paper?'#3b2412':color}">${esc(text)}</text></g>`;
}
function event(key,word){const e=K[key].wordEvents.find(x=>x.word===word);if(!e)throw Error(`Missing event ${key}/${word}`);return e.time;}
function maths(items,t,y=1510,{cx=540,width=940,sep='→'}={}){
 // Shared timing/pop/typography, with an ample measured-safe card behind the row.
 const s=stepsRow(items,t,y,{size:46,sep});
 return `<g transform="translate(${cx-540} 0)">${s.replace(/<rect[^>]*\/>/,`<rect x="${540-width/2}" y="${y-42}" width="${width}" height="78" rx="35" fill="#141a2b" fill-opacity=".88"/>`)}</g>`;
}
function anchored(ctx,name,text,{dy=0,size=40,...o}={}){
 const a=ctx.anchor(name);if(!a?.[2])return '';
 return card(text,a[0],a[1]+dy,{...o,size,center:true});
}
export function overlay1_2v1(ctx){
 if(!D){D=JSON.parse(readFileSync(ROOT()+'/blender/data.json')).episode12;K=Object.fromEntries(D.cues.map(c=>[c.key,c]));}
 const {t,cue:q,cap}=ctx,key=q.diagram.replace(/^c12v1-/,''),c=K[key];
 if(!c)throw Error('Unknown 1-2 cue '+key);
 const on=(a,d=.22)=>sm((t-a)/d);
 let s='';
 if(q.view)s+=`<g transform="translate(6 0)">${viewCard(q.view,1)}</g>`;
 if((c.row<=3||c.row===53)&&t>=2.6)s+=card('1586年 イングランド',40,144,{size:36});
 if(c.row>=10&&c.row<=18)s+=card('1467年 イタリア アルベルティ',40,144,{size:36});
 if(c.row===28||c.row===29)s+=card('1553年 イタリア ベラーゾ',40,144,{size:36});
 if(key==='letter:open'&&t>=2.6)s+=card('手紙の記号は 再現（本物の記号ではない）',40,1440,{size:36});
 if(c.row===3||c.row===49||key==='chk:judge'&&t>=187.97){
  s+=card(t<187.97?'作る側 0 − 2 破る側':'作る側 1 − 2 破る側',1040,144,{size:36,end:true});
  if(key==='chk:judge'&&t<188.9)s+=card('＋1',930,240,{size:40,op:on(187.97),color:'#ffd23f'});
 }
 if(c.row>=4&&c.row<=6)s+=anchored(ctx,'answer.reading',c.row===6&&t>=38.6?'COUNT THE LETTERS':'MYEXD DRO VODDOBC',{dy:-85,size:42,color:c.row===6&&t>=38.6?'#fff':ORANGE});
 if(key==='ans:count'){
  const ts=[26.69,27.78,...Array.from({length:7},(_,i)=>29.30+i*.25),31.55];
  let n=ts.filter(a=>t>=a).length;
  // COUNT is the answer: retain the ninth trial until the spoken COUNT cue.
  if(n===10&&t<33.48)n=9;
  if(n)s+=card(`${n}目盛り：${D.decoder[n-1].slice(0,5)}`,540,1475,{size:42,center:true,color:n===10?'#ffd23f':ORANGE});
 }
 if(key==='ans:flip')s+=card('COUNT THE LETTERS ＝ 文字を 数えなさい',540,1480,{size:36,center:true,op:on(37.09)});
 if(c.row===7)s+=card('入れ替え表：同じ文字 → いつも同じ記号',540,1465,{size:36,center:true,op:on(event(key,'同じ文字'))});
 if(c.row===8)s+=card('E → X（12.9％）',540,1470,{center:true,op:on(52.56),color:ORANGE});
 if(c.row>=11&&c.row<=17)s+=card('図は26文字（本物は24文字）',40,1440,{size:36});
 if(['alb:ex','alb:a-g','alb:turn','alb:a-j','alb:mio'].includes(key)){
  if(c.row>=14){s+=maths([['A',78.27],['g',79.58,ORANGE]],t,1530,{cx:320,width:420});s+=maths([['A',89.77],['j',93.99,ORANGE]],t,1530,{cx:760,width:420});}
  else s+=maths([['A',78.27],['g',79.58,ORANGE]],t,1530);
 }
 if(c.row===16)s+=card('26目盛り ＝ 26通りの 入れ替え表',540,1510,{center:true,size:36,op:on(104.01)});
 if(c.row===16||c.row===17){const n=Math.min(26,Math.max(0,Math.floor((t-104.01)/.12)+1));if(n)s+=anchored(ctx,'paperstack.top',String(n),{dy:-60,size:40,paper:true});}
 if(c.row===18)s+=card('大文字 ＝ 回した しるし',540,1470,{center:true,op:on(117.16)});
 if(c.row>=19&&c.row<=21)s+=card('人形と名札は、文字の入れ替えの たとえ',40,1440,{size:36});
 if(c.row>=22&&c.row<=26){
  const logic=[['仮説：一番多い 暗号文字は E から',145.25,40,300,36],['もし正しいなら',151.68,40,392,40],['予言：一つの塔が 高く伸びる',155.70,40,476,36],['事実：一番高くても 5.5％',175.25,560,392,36],['判定 ×',186.55,40,580,42]];
  for(const [label,a,x,y,size] of logic)s+=card(label,x,y,{size,paper:true,op:on(a)});
  if(c.row>=24)s+=card('同じ 541文字を、1文字ごとに 円板を回して 暗号に',40,1440,{size:36});
  if(c.row===25)s+=maths([['12.9％',178.21,ORANGE],['5.5％',178.21]],t,1540);
 }
 if(c.row>=28&&c.row<=29){s+=anchored(ctx,'bellaso.page','ベラーゾ（1553年）',{dy:170,size:36,paper:true});if(c.row===29){s+=anchored(ctx,'vigenere.page','ヴィジュネル（1586年）',{dy:270,size:36,paper:true,op:on(209.23)});s+=card('名前は のちの 呼び名',40,1440,{size:36});}}
 if(c.row===31){
  s+=card('カエサル：いつも 3',40,410,{op:on(220.73),size:36});s+=card('合言葉：1文字ごとに 変わる',40,485,{op:on(224.65),size:36});
  for(let i=0;i<6;i++){s+=anchored(ctx,'plan.top.'+i,'3',{op:on(220.73+i*.12),size:36,paper:true});s+=anchored(ctx,'plan.bot.'+i,'?',{op:on(224.65+i*.12),size:36,paper:true});}
 }
 if(c.row>=32&&c.row<=34){
  for(let i=0;i<26;i++)if(t>=232.47+i*.05){const a=ctx.anchor('number.'+i);if(a?.[2])s+=card(String(i),a[0],a[1],{size:36,center:true,paper:true,width:72});}
  if(c.row===33)s+=maths([['K＝10',241.97,BLUE],['E＝4',242.83,BLUE],['Y＝24',243.69,BLUE]],t,1530,{sep:'　'});
 }
 if(c.row===35)s+=maths([['C',260.02],['＋10',260.46,BLUE],['M',261.77,ORANGE]],t);
 if(c.row===36)s+=maths([['A',264.02],['＋4',264.39,BLUE],['E',265.73,ORANGE]],t);
 if(c.row===37){s+=maths([['T',267.87],['＋24',268.27,BLUE],['R',274.05,ORANGE]],t);if(t>=269.94&&t<274.05)s+=maths([['Z',269.94],['A',272.07]],t,1440);}
 if(c.row===38)s+=maths([['CAT',276.45],['MER',277.30,ORANGE]],t);
 if(c.row===40)s+=maths([['同じ A',288.44],['K・E・Y',289.34,ORANGE]],t);
 if(c.row>=41&&c.row<=45){
  // Keep the bars themselves unobstructed. The legend follows the three rows'
  // back-to-front order, below the subtitles, rather than covering their heights.
  const legend=(name,text,y,col)=>{const focus=name==='tower.key.label'&&t>=313.61&&t<315.3;if(ctx.anchor(name)?.[2])s+=card(text,540,y,{center:true,size:36,color:focus?'#3b2412':col,fill:focus?'#ffd23f':null});};
  legend('tower.alberti.label','毎回 回す 5.5％',1430,'#f6f2e8');
  if(t>=304.82)legend('tower.key.label',t>=320.89?'KEYWORD：7.4％':'合言葉 KEY 9.6％',1495,'#f5b06a');
  legend('tower.fixed.label','一つの表 12.9％',1560,ORANGE);
  if(c.row>=43)s+=anchored(ctx,'longkey.end','…',{size:40,op:on(317.71)});
  if(c.row>=44)s+=card('解けない 暗号',540,360,{center:true,op:on(328.55)});
 }
 if(c.row===46)s+=card('数える動きは 早回し',40,1440,{size:36});
 if(c.row===47)s+=card('1文字 飛ばす → この先が 全部 ずれる',540,1450,{size:36,center:true,op:on(343.31)});
 if(c.row===48)s+=card('入れ替え表の 暗号（多くの国で）',40,1440,{size:36});
 if(c.row===52){s+=card('合言葉：KEY',540,1460,{center:true,color:BLUE});if(key==='ch:text')s+=card('答えは 次の回',540,1540,{center:true,op:on(event(key,'答えは'))});}
 return s;
}
