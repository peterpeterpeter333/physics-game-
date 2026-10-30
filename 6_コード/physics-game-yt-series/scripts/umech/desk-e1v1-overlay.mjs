// E-1 labels. No source narration or shared drawing file is changed.
import {readFileSync} from 'node:fs';
import {measuredInkWidth} from './desk-axes-text-metrics.mjs';
import {esc,clamp} from './anim.mjs';
import {pill,paper,stepsRow as referenceStepsRow,yearTag,noteTag} from './desk-overlay-lib.mjs';
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const LAT='#6fb3e0',LON='#f0a040',Y='#ffd23f';
const sm=x=>{x=clamp(x);return x*x*(3-2*x);},n=x=>+x.toFixed(1),jw=s=>[...s].reduce((a,c)=>a+(/[ -~]/.test(c)?.62:1),0);
const VIEWCOL={'具体例':'#38c6d9','たとえ話':'#ff9ce6','作る側から':'#f0a040','確かめる側から':'#5aa469'};
let loaded=null,loadedPath=null;
function data(){const path=(process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-e1v1')+'/blender/data.json';if(path!==loadedPath){loaded=JSON.parse(readFileSync(path));loadedPath=path;}return loaded;}
function view(kind,op=1){
 const label='見方：'+kind,w=jw(label)*40+96;
 return `<g opacity="${op}"><rect x="41" y="183" width="${w}" height="76" rx="10" fill="#1d0f05" opacity=".5"/><rect x="36" y="176" width="${w}" height="76" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/><rect x="50" y="186" width="${w-28}" height="56" rx="6" fill="#f4e8cc"/><rect x="50" y="186" width="22" height="56" rx="4" fill="${VIEWCOL[kind]}"/><circle cx="61" cy="180" r="7" fill="#c9a44e"/><circle cx="${w+11}" cy="180" r="7" fill="#c9a44e"/><text x="${36+w/2+8}" y="228" ${FONT} font-size="40" font-weight="800" text-anchor="middle" fill="#3b2412">${esc(label)}</text></g>`;
}
function card(text,x,y,{size=42,op=1,color='#3b2412',anchor='middle',mark=null}={}){
 // Give ASCII clocks and units the full measured-font safety allowance.
 return paper([[text,color]],x,y,{size,op,anchor,mark});
}
const stepWidths=new Map(),stepLabels=['24時間','360度','360','÷ 24','＝ 15','9時間','× 15度','＝ 135度','60分 ÷ 15','＝ 4分','1度','40000','÷ 360','≒ 111km（赤道）','111 × 約3分の2','約70km','時計 4分 ずれ','位置 約70km ずれ','誤差 0.5度 以内','最高 2万ポンド','4分 → 1度','2分 → 0.5度'];
for(const size of [42,44,46])for(const [text,fontSize,weight] of [...stepLabels.map(s=>[s,size,800]),...['→','＝','だから'].map(s=>[s,size*.8,700])]){
 const ink=await measuredInkWidth(`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="160"><rect width="2400" height="160" fill="white"/><text x="30" y="110" ${FONT} font-size="${fontSize}" font-weight="${weight}" fill="black">${esc(text)}</text></svg>`,{trim:{background:'#ffffff',threshold:40},png:false});
 stepWidths.set(text+'|'+fontSize,ink);
}
function stepsRow(items,t,y,options={}){
 // Keep the reference visual and word-by-word reveal, using actual ink widths
 // for internal spacing as well as the outside paper margin.
 const size=options.size??46,sep=options.sep??'→',width=(s,z)=>stepWidths.get(s+'|'+z)??jw(s)*z;
 const widths=items.map(([s])=>width(s,size)),sw=sep.trim()?width(sep,size*.8):size*.3,total=widths.reduce((a,b)=>a+b,0)+(items.length-1)*(sw+24)+48;
 let x=540-total/2+24;const positions=[];
 for(const [i,[s]] of items.entries()){positions.push({text:esc(s),x:x+widths[i]/2});x+=widths[i];if(i<items.length-1){positions.push({text:esc(sep),x:x+12+sw/2});x+=sw+24;}}
 let cursor=0;
 return referenceStepsRow(items,t,y,options).replace(/<rect x="([\d.-]+)"([^>]*?)width="([\d.-]+)"/,(_,oldX,between,oldW)=>`<rect x="${n(540-total/2-8)}"${between}width="${n(total+16)}"`).replace(/<text x="[\d.-]+"([^>]*>)([\s\S]*?)<\/text>/g,(full,attrs,body)=>{
  const i=positions.findIndex((p,j)=>j>=cursor&&p.text===body);if(i<0)return full;cursor=i+1;return `<text x="${n(positions[i].x)}"${attrs}${body}</text>`;
 });
}
function anchored(ctx,text,name,{dy=-65,size=40,color='#3b2412',op=1}={}){
 const p=ctx.anchor(name);if(!p?.[2])return '';
 const w=jw(text)*size+50,x=clamp(p[0],40+w/2,1040-w/2),y=clamp(p[1]+dy,300,1550);
 return card(text,x,y,{size,color,op});
}
export function overlayE1v1(ctx){
 const D=data(),{t,cue:q,cap}=ctx,k=q.diagram.replace(/^ce1v1-/,''),c=D.cues.find(x=>x.key===k);
 const C=key=>D.cues.find(x=>x.key===key),S=key=>C(key).start,E=key=>C(key).end;
 const T=(key,word,index=0)=>{const w=C(key).wordEvents.filter(w=>w.word.includes(word));if(!w[index])throw Error('E1 timing '+key+'/'+word);return w[index].time;};
 const at=(word,i=0)=>T(k,word,i),on=(a,d=.22)=>sm((t-a)/d),show=(text,a,y=360,options={})=>card(text,540,y,{op:on(a),...options});
 let s='';
 if(q.view)s+=view(q.view);
 if(c.row<=6&&t>=2.5)s+=yearTag('1707年10月22日 イギリスの 南西の 海');
 if(c.row<=6&&t>=2.5)s+=noteTag('当時 イギリスで 使われていた 暦の 日付');
 if(c.row===35)s+=yearTag('1660年代 ホイヘンス');
 if(c.row===37)s+=yearTag('1714年 イギリス 経度法');
 if(c.row===37)s+=noteTag('いまの お金で 数億円ほど とも いわれる');
 for(const score of D.scores){if(t>=score.time-.1&&(t<score.time+3.2||c.row===5))s+=pill(`海 ${score.make} − ${score.brk} 船乗り`,1040,c.row<=6?210:130,{size:36,anchor:'end',color:'#fff',op:on(score.time,.15)});}
 if(c.row===3)s+=anchored(ctx,'艦隊が 考えていた 位置','thought',{op:on(at('話し合い')),dy:100,size:40});
 if(c.row===4){s+=anchored(ctx,'艦隊が 考えていた 位置','thought',{dy:150,size:40});s+=anchored(ctx,'本当の 位置','real',{op:on(at('本当の位置')),dy:-95});s+=anchored(ctx,'シリー諸島','scilly',{op:on(at('シリー諸島')),dy:65,size:38});}
 if(k==='two:latlong'){
   s+=show('南北 ＝ 緯度',at('緯度'),360,{color:LAT});s+=show('東西 ＝ 経度',at('経度'),460,{color:LON});
 }
 if(k==='two:grid'){
   for(let i=1;i<=6;i++)s+=anchored(ctx,String(i),'gridRow'+i,{dy:0,size:36,color:LAT,op:on(at('何段目'))});
   for(let i=1;i<=8;i++)s+=anchored(ctx,String(i),'gridCol'+i,{dy:-30,size:36,color:LON,op:on(at('何列目'))});
 }
 if(['lat:equator','lat:step','lat:50'].includes(k)){
   let angle=0,angleVisible=true;if(k==='lat:equator'){angle=t>=at('真上')?90:0;angleVisible=t<at('北極',1)||t>=at('真上');}
   if(k==='lat:step')angle=Math.min(30,10*Math.max(0,Math.floor((t-at('1度ずつ'))/.4)+1));
   if(k==='lat:50'){angle=t>=at('イギリスの南')+.8?50:30;angleVisible=t<at('イギリスの南')||t>=at('イギリスの南')+.8;}
   if(angleVisible)s+=anchored(ctx,angle+'°','observer',{dy:-50,size:44,color:k==='lat:50'&&t>=at('50度')?Y:'#3b2412'});
   if(k==='lat:50'){s+=show('北極星の 高さ ≒ 緯度',at('緯度と'),360);s+=show('約50度',at('50度'),460,{color:'#9a6500'});}
 }
 if(k==='lon:time'){
   s+=show('同じ 高さ。違うのは 時刻だけ',at('時刻'),360,{size:40});
   s+=pill('9:00',330,1080,{size:40,anchor:'middle',op:on(at('東の船'))});s+=pill('10:00',750,1080,{size:40,anchor:'middle',op:on(at('西の船'))});
 }
 if(k==='lon:spin')s+=stepsRow([['24時間',at('24時間')],['360度',at('360度'),Y]],t,1470,{size:46,sep:'＝'});
 if(k==='lon:15'){
   s+=stepsRow([['360',at('360を')],['÷ 24',at('24で')],['＝ 15',at('15'),Y]],t,1470,{size:44,sep:' '});s+=show('1時間 ＝ 15度',at('15度'),1560,{size:44});
 }
 if(c.row===14){for(const [label,x,y] of [['0',540,530],['6',800,810],['12',540,1080],['18',280,810]])s+=pill(label,x,y,{size:36,anchor:'middle',op:on(S('lon:spin')+1.1)});}
 if(c.row===15||c.row===16){
   s+=noteTag('北から 見て 反時計回り（西から 東へ）');
   if(t>=T('lon:noon','昼の12時'))s+=card('光の 真ん中 ＝ 昼の 12時',540,360,{size:40});
   if(c.row===16){s+=show('東 → 先に 昼',at('先に昼'),460,{size:40});s+=show('西 → 遅れて 昼',at('遅れて昼'),560,{size:40});}
 }
 if(c.row===17||c.row===18){
   s+=anchored(ctx,'東京','tokyo',{dy:90});s+=anchored(ctx,'ロンドン','london',{dy:90});
   if(c.row===17)s+=show('9時間',at('9時間'),360,{size:44});
   if(c.row===18){s+=pill('12:00',300,530,{size:44,anchor:'middle',op:on(at('昼の12時'))});s+=pill('3:00',790,530,{size:44,anchor:'middle',op:on(at('朝の3時'))});s+=show('東の 日本が 先に 昼',at('先に昼'),360,{size:40});if(t>=at('朝の3時'))s+=pill('Zzz',850,640-12*Math.sin((t-at('朝の3時'))*2),{size:36,anchor:'middle',color:'#dfe8f3'});}
 }
 if(c.row===19){
   s+=stepsRow([['9時間',T('tz:135','9時間')],['× 15度',T('tz:135','15度')],['＝ 135度',T('tz:135','135度'),Y]],t,1470,{size:44,sep:' '});
   s+=show('明石 ＝ 東経135度（日本の 時計の 基準）',T('tz:135','東経135度'),1560,{size:38});
   if(k==='tz:akashi')s+=show('ロンドン ＝ 0度',at('0度'),360,{size:40});
 }
 if(k==='ship:sun')s+=show('船の 昼の 12時',at('太陽の昼の12時'),360);
 if(k==='ship:clock'){
   s+=show('もし あったら',cap.start,360,{size:40});s+=show('1時間 遅れて 昼 ＝ 15度 西',at('15度西'),1470,{size:40});
   s+=anchored(ctx,'13:00','clock',{dy:-160,size:44,op:on(at('午後1時'))});
 }
 if(k==='clk:4min')s+=stepsRow([['60分 ÷ 15',at('15度')],['＝ 4分',at('4分')],['1度',at('1度'),Y]],t,1470,{size:44,sep:'→'});
 if(k==='clk:111')s+=stepsRow([['40000',at('4万キロメートル')],['÷ 360',at('360で')],['≒ 111km（赤道）',at('111キロメートル'),Y]],t,1470,{size:42,sep:' '});
 if(k==='clk:70'){
   s+=show('イギリスの 近く：赤道の 約3分の2',at('3分の2'),1470,{size:40});s+=stepsRow([['111 × 約3分の2',at('111の')],['約70km',at('70キロメートル'),Y]],t,1560,{size:42});s+=noteTag('くわしく 計算すると 約71km',40,1370);
 }
 if(k==='clk:shift')s+=stepsRow([['時計 4分 ずれ',at('4分')],['位置 約70km ずれ',at('70キロメートル'),Y]],t,1470,{size:42});
 if(k==='dr:none'){
   s+=show('速さ × 時間 ＝ 進んだ 道のり',at('進んだ時間'),360,{size:40});s+=show('向きは 方位磁針',at('向き'),460,{size:40});
 }
 if(k==='dr:log'){
   s+=show('結び目の 数 → 速さ',at('結び目が'),360,{size:40});const num=Math.min(5,Math.max(0,Math.floor((t-at('いくつ'))/.5)+1));if(num)s+=pill(String(num),540,520,{size:54,anchor:'middle',color:Y});
 }
 if(k==='dr:drift')s+=show('小さな ずれ が 積み重なる',at('積み重なる'),360,{size:40});
 if(k==='dr:fog'||k==='dr:cause')s+=show('霧 → 緯度も 確かめにくい',T('dr:fog','空が見えない'),360,{size:40});
 if(c.row>=33&&c.row<=36){
   s+=card('仮説：振り子時計を 積めば よい',40,300,{size:40,anchor:'start',op:on(T('pen:hyp','振り子時計'))});
   s+=card('もし正しいなら',40,392,{size:40,anchor:'start',op:on(T('pen:if','もし正しいなら'))});
   s+=card('予言：船の 上でも 正確',40,476,{size:40,anchor:'start',op:on(T('pen:if','正確に'))});
   // Fact card is two short cream rows at the specified right-hand point.
   if(t>=T('pen:sway','安定しません')){s+=card('事実：揺れで',560,392,{size:40,anchor:'start'});s+=card('安定しない',560,476,{size:40,anchor:'start'});}
   if(c.row===36)s+=card('判定 ×',40,580,{size:44,anchor:'start',color:'#c6473a',op:on(at('合いません'))});
 }
 if(k==='prize:act')s+=stepsRow([['誤差 0.5度 以内',at('0.5度')],['最高 2万ポンド',at('2万ポンド'),Y]],t,360,{size:42});
 if(k==='prize:mio')s+=stepsRow([['4分 → 1度',cap.start],['2分 → 0.5度',at('2分'),Y]],t,1470,{size:46,sep:'だから'});
 if(c.row===39){s+=show('何週間も 揺れて 2分しか 狂わない',T('next:order','2分しか'),360,{size:40});s+=anchored(ctx,'？','clock',{dy:-20,size:50});}
 if(c.row===40){
   s+=show('ロンドン 10時',T('ch:noon','朝の10時'),360,{size:42});
   if(k==='ch:ask'){s+=show('東？ 西？ 何度？',at('東と西'),460,{size:44});s+=show('答えは この先の 時間と位置の 回',at('時間と位置の回'),1470,{size:40});}
 }
 return s;
}
