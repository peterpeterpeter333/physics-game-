// C-1。字幕・声は共通のdesk-frameに任せ、机上の札だけを描く。
import fs from 'node:fs';
import {measuredInkWidth} from './desk-axes-text-metrics.mjs';
import {esc,clamp} from './anim.mjs';
import {paper,pill,stepsRow,viewCard} from './desk-overlay-lib.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';
import {NUM,digitsAt} from './desk-c1v1-data.mjs';
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const sm=u=>{u=clamp(u);return u*u*(3-2*u);},n=v=>Math.round(v*10)/10;
let cached=null;function data(){return cached??=JSON.parse(fs.readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-c1v1')+'/blender/data.json'));}
const labels=['1640年代 フランス ルーアン','1642年ごろ ブレーズ・パスカル','C 計算する機械 1','27 を 入れる','＋18：まず 一の位の 8','いまは 0 から 始める','もう一度 ゆっくり','本当の 作りは あとで 見ます','7→8→9→0：3目盛り','0→5：5目盛り','合わせて 8','27＋18＝45','筆算：1 と 1 を 一緒に','機械：繰り上がりが 先、10 は あと','足す 数は 同じ → 45','9999 を 入れた ところ','仮説：出っぱりで 隣を 押す','もし正しいなら','予言：指が 5つを 一度に 回す','判定 △（このままでは 難しい）','だから：別の 仕掛けを 入れた','歯車が もっと 多い 機械の 図（大げさに 描いた）','仕掛けを 1つの 位で 見る','指で 回す たびに → 腕が 少し 上がる','指の 力','少しずつ 腕を 持ち上げる','落ちて 押す','9999＋1＝10000','判定 ○ 力を ためて おく','とても 高い','繰り上がりを 機械に 任せる','掛け算 ＝ 足し算の くり返し','7×3 ＝ 7＋7＋7','999＋1','腕は 何回 落ちる？','答えは この先の 計算する機械の 回','7＋8＝15','2＋1＝3、＋1 → 4','答え 45','見方：作る側から',...NUM.places,...Array.from({length:10},(_,i)=>String(i)),'？'];
const widths=new Map(),measured=[...new Set([...labels,'2＋1＝3','人の手 0 − 0 機械','人の手 0 − 1 機械','人の手 0 − 2 機械','人の手 1 − 2 機械',...labels.flatMap(s=>[...s])])];
await Promise.all(measured.map(async s=>{for(const size of [36,38,40,42,44,48,56,76]){if(!s.trim()){widths.set(`${s}/${size}`,size*.35);continue;}const svg=`<svg width="2400" height="140" xmlns="http://www.w3.org/2000/svg"><text x="20" y="100" ${FONT} font-size="${size}" font-weight="800">${esc(s)}</text></svg>`;const ink=await measuredInkWidth(svg);widths.set(`${s}/${size}`,ink);}}));
function width(s,size){return widths.get(`${s}/${size}`)??[...s].reduce((a,c)=>a+(widths.get(`${c}/${size}`)??size)+2,0);}
function card(s,x,y,{size=42,bg='#f4e8cc',color='#3b2412',op=1,middle=false,max=1000,stroke='#b8925a',pad=52}={}){
 if(op<.003)return '';let lines=[s];if(width(s,size)>max-pad){lines=[''];for(const ch of s){if(width(lines.at(-1)+ch,size)>max-pad)lines.push(ch);else lines[lines.length-1]+=ch;}}
 const w=Math.min(max,Math.max(...lines.map(l=>width(l,size)))+pad),h=size*lines.length+30+(lines.length-1)*12,x0=Math.max(40,Math.min(1040-w,middle?x-w/2:x));return `<g opacity="${n(op)}"><rect x="${n(x0+4)}" y="${n(y-h/2+5)}" width="${n(w)}" height="${h}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="8" fill="${bg}" stroke="${stroke}" stroke-width="3"/>${lines.map((line,i)=>`<text x="${n(x0+w/2)}" y="${n(y+size*.36+(i-(lines.length-1)/2)*(size+12))}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(line)}</text>`).join('')}</g>`;
}
const text=(s,x,y,size=48,color='#3b2412')=>`<text x="${n(x)}" y="${n(y)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(s)}</text>`;
const key=q=>q.diagram.replace('cc1v1-','');
function all(ctx){return ctx.clip.scenes.flatMap(sc=>sc.cues.map((q,i)=>({q,cap:sc.captions[i]})));}
function TT(ctx,k,needle=null){const a=all(ctx).find(x=>key(x.q)===k);return needle?a.cap.start+wt({cue:a.q,t:0,dur:a.cap.end-a.cap.start},needle):a.cap.start;}
function score(ctx,t){
 const entries=[['desk:pile','マチガイガ',0,0],['carry:point','キエマシタ',0,1],['arm:judge','タダシク',0,2],['dad:price','タカクテ',1,2]];let out='';
 for(const [k,w,a,b] of entries){const at=TT(ctx,k,w);if(t>=at-.15&&t<at+3.3){const op=sm((t-at+.15)/.2)*(1-sm((t-at-3)/.3));out=card(`人の手 ${t<at?Math.max(0,a-(k==='dad:price'?1:0)):a} − ${t<at&&b?b-1:b} 機械`,1040-420,150,{size:36,op,bg:'#141a2b',color:'#fff',max:420,stroke:'#69503b'});}}
 return out;
}
function windowLabels(ctx,t){
 const D=data(),c=D.cues.find(c=>c.key===key(ctx.cue)),ds=digitsAt(t,D.events);let s='';
 const family=['m2','arm'].includes(c.group)?'m2':(['m1','order'].includes(c.group)?'m1':null);if(!family)return s;
 for(let i=0;i<5;i++){
  const p=ctx.anchor(`${family}.digit.${i}`);if(!p?.[2])continue;
  const x=Math.max(84,Math.min(996,p[0])),y=c.camera==='m2'?850:c.group==='arm'?680:c.group==='order'||c.camera==='dial'?Math.max(300,Math.min(1110,p[1])):Math.max(750,Math.min(1110,p[1]));
  let lit=false,prev=[0,0,0,0,0];for(const e of D.events){const nd=String(e.value).padStart(5,'0').split('').map(Number);if(e.time<=t&&t<e.time+.6&&['drop','bump'].includes(e.tag)&&nd[i]!==prev[i])lit=true;prev=nd;}
  if(i===3&&key(ctx.cue)==='carry:tens'&&t>=TT(ctx,'carry:tens','サンニ')&&t<TT(ctx,'carry:tens','サンニ')+.6)lit=true;
  if(i===3&&c.row===21&&t>=TT(ctx,'carry:order','キカイデワ')&&t<TT(ctx,'carry:order','キカイデワ')+.6)lit=true;
  s+=card(String(ds[i]),x,y,{size:48,bg:lit?'#ffd23f':'#f6f2e8',middle:true,pad:c.camera==='price'?36:52});
  s+=card(NUM.places[i],x,y-80,{size:36,middle:true,pad:c.group==='order'||c.camera==='price'?24:52});
 }
 return s;
}
function arithmetic(ctx,t){
 const k=key(ctx.cue),D=data(),c=D.cues.find(c=>c.key===k);
 if(c.row===21||c.row===22){const p=ctx.anchor('paper');if(!p?.[2])return '';const x=p[0],y=p[1],lit=t>=TT(ctx,'carry:order','ヒッサン')&&t<TT(ctx,'carry:order','キカイデワ');return (lit?`<circle cx="${n(x+8)}" cy="${n(y-75)}" r="24" fill="#ffd23f" opacity=".6"/><circle cx="${n(x+6)}" cy="${n(y+15)}" r="24" fill="#ffd23f" opacity=".6"/>`:'')+text('27',x+22,y-20,44)+text('＋18',x,y+30,44)+`<path d="M${n(x-90)} ${n(y+43)}H${n(x+90)}" stroke="#3b2412" stroke-width="4"/>`+text('45',x+22,y+90,44)+text('1',x+8,y-60,36,'#b3261e');}
 if(c.row<7||c.row>10)return '';
 const ex=TT(ctx,'hand:ex','ニジュウナナ'),add=TT(ctx,'hand:ex','ジュウハチ'),one=TT(ctx,'hand:ones','ゴオ'),carry=TT(ctx,'hand:ones','ジュウノクライエ'),four=TT(ctx,'hand:ans','ヨン'),ans=TT(ctx,'hand:ans','ヨンジュウゴ');
 let s='';const x=540,y=800;
 if(t>=ex)s+=text('27',x+30,y,76);
 if(t>=add)s+=text('＋18',x,y+110,76)+`<path d="M370 945H690" stroke="#3b2412" stroke-width="6"/>`;
 if(t>=TT(ctx,'hand:ones','ジュウゴ')&&t<one)s+=text('15',x+170,y+235,44);
 if(t>=one)s+=text('5',x+70,y+250,76);
 if(t>=carry)s+=text('1',x-20,y-100,56,'#b3261e');
 if(t>=TT(ctx,'hand:tens','サン')&&t<four)s+=text('3',x-10,y+250,76);
 if(t>=four)s+=text('4',x-10,y+250,76);
 if(t>=ans)s+=`<path d="M480 1075H650" stroke="#3b2412" stroke-width="6"/>`+card('答え 45',540,360,{size:44,middle:true});
 if(c.row===10&&t>=TT(ctx,'hand:mio','ヨク'))s+=`<circle cx="520" cy="680" r="48" fill="none" stroke="#b3261e" stroke-width="6"/>`;
 if(t>=TT(ctx,'hand:ones','ジュウゴ'))s+=card('7＋8＝15',540,1470,{size:44,middle:true});
 if(t>=TT(ctx,'hand:tens','サン'))s+=card(t>=four?'2＋1＝3、＋1 → 4':'2＋1＝3',540,1560,{size:44,middle:true});
 return s;
}
export function overlayC1v1(ctx){
 const {t,cue:q,cap}=ctx,k=key(q),D=data(),c=D.cues.find(c=>c.key===k),r=c.row,on=(a)=>sm((t-a)/.20);let s='';
 // 冒頭の既存series欄に、依頼された軸の札を置く。台本・planは変更しない。
 if(t<2.5)ctx.clip.series='C 計算する機械 1';
 if(r>=2&&r<=5)s+=card('1640年代 フランス ルーアン',40,140,{size:38});
 if(r===6)s+=card('1642年ごろ ブレーズ・パスカル',40,140,{size:38});
 if(q.view)s+=q.view==='作る側から'?card('見方：作る側から',40,225,{size:40,stroke:'#f0a040'}):viewCard(q.view,1);
 s+=score(ctx,t);s+=windowLabels(ctx,t);s+=arithmetic(ctx,t);
 const C=(label,y=360,at=cap.start,size=42)=>card(label,540,y,{size,middle:true,op:on(at)});
 const N=(label,at=cap.start)=>card(label,40,1460,{size:36,op:on(at)});
 if(r===12)s+=N('いまは 0 から 始める',VE(ctx,'gear:dial'));
 if(r===13)s+=C('27 を 入れる',360,TT(ctx,'gear:27','ニジュウナナ'));
 if(r===14||r===15||r===16)s+=C('＋18：まず 一の位の 8',360,TT(ctx,'gear:add8','ハチ'));
 if(r===16&&t>=TT(ctx,'gear:zero','クリアガリ')){const p=ctx.anchor('m1.digit.3');if(p?.[2])s+=card('？',Math.max(90,Math.min(980,p[0])),Math.max(680,p[1]-150),{size:56,middle:true});}
 if(r===18||r===19){s+=N('本当の 作りは あとで 見ます');s+=C('もう一度 ゆっくり',360,TT(ctx,'carry:simple'));
  if(r===19&&k==='carry:ones'){s+=C('7→8→9→0：3目盛り',450,TT(ctx,k,'サンメモリ'));s+=C('0→5：5目盛り',540,TT(ctx,k,'ゴメモリ'));s+=C('合わせて 8',630,TT(ctx,k,'ゴメモリ')+.8);}}
 if(r===20&&t>=TT(ctx,'carry:45','ヨンジュウゴ'))s+=C('27＋18＝45',360,TT(ctx,'carry:45','ヨンジュウゴ'),48);
 if(r===21||r===22){s+=C('筆算：1 と 1 を 一緒に',1460,TT(ctx,'carry:order','ヒッサン'));s+=C('機械：繰り上がりが 先、10 は あと',1560,TT(ctx,'carry:order','キカイデワ'),40);s+=C('足す 数は 同じ → 45',150,TT(ctx,'carry:same','タス'));}
 if(r>=24&&r<=28){s+=C('9999 を 入れた ところ',1560,TT(ctx,'hard:9999','キュウセン'),38);
  s+=card('仮説：出っぱりで 隣を 押す',40,300,{size:40,op:on(TT(ctx,'hard:hyp','カセツ'))});
  s+=card('もし正しいなら',40,392,{size:40,op:on(TT(ctx,'hard:if','モシ'))});
  s+=card('予言：指が 5つを 一度に 回す',40,476,{size:40,op:on(TT(ctx,'hard:if','イチドニ'))});
  if(r===28){s+=card('判定 △（このままでは 難しい）',40,580,{size:40,color:'#725716',op:on(TT(ctx,'hard:judge','ツクリデワ'))});s+=card('だから：別の 仕掛けを 入れた',560,680,{size:36,op:on(TT(ctx,'hard:judge','ベツノ'))});}
  if(r===26&&t>=D.effects.arrows){for(let i=0;i<5;i++){const p=ctx.anchor('m2.digit.'+i);if(p?.[2])s+=`<path d="M${n(p[0]-30)} ${n(Math.max(840,p[1])+130)}q60 -80 100 0m-14 -35l14 35 -38 -7" fill="none" stroke="#ffd23f" stroke-width="8"/>`;}}
  if(r===27){s+=N('歯車が もっと 多い 機械の 図（大げさに 描いた）');const p=ctx.anchor('crack');if(t>=D.effects.crack&&p?.[2])s+=`<path d="M${n(p[0])} ${n(p[1]-5)}l-5 12 7 6 -6 12" fill="none" stroke="#22160c" stroke-width="6" stroke-dasharray="42" stroke-dashoffset="${n(42*(1-clamp((t-D.effects.crack)/.2)))}"/>`;}}
 if(r===29){s+=N('仕掛けを 1つの 位で 見る');s+=C('指で 回す たびに → 腕が 少し 上がる',360,TT(ctx,'arm:lift','スコシズツ'),40);}
 if(r===31){s+=stepsRow([['指の 力',TT(ctx,'arm:store','ユビガ')],['少しずつ 腕を 持ち上げる',TT(ctx,'arm:store','マエモッテ')]],t,350,{size:40});s+=C('落ちて 押す',450,TT(ctx,'arm:store','マトメテ'));}
 if(r===33&&t>=D.effects.chain+.90)s+=C('9999＋1＝10000',360,D.effects.chain+.90,48);
 if(r===35)s+=card('判定 ○ 力を ためて おく',40,580,{size:40,color:'#397b4a',op:on(TT(ctx,'arm:judge','ナリマシタ'))});
 if(r===38){const p=ctx.anchor('price');if(p?.[2])s+=`<path d="M540 405L${n(p[0])} ${n(p[1])}" stroke="#b8925a" stroke-width="3" fill="none" opacity="${n(on(D.effects.price))}"/>`+card('とても 高い',540,360,{middle:true,size:44,op:on(D.effects.price)});}
 if(r===39)s+=C('繰り上がりを 機械に 任せる',360,TT(ctx,'dad:shown','ハッキリ'));
 if(r===41){s+=C('掛け算 ＝ 足し算の くり返し',350,TT(ctx,'next:mult','クリカエセバ'));s+=C('7×3 ＝ 7＋7＋7',450,TT(ctx,'next:mult','クリカエセバ')+1.2,44);
  // 既存の語句を「もう一つの工夫」で読み返す。新しい文言・答えは足さない。
  const u=sm((t-TT(ctx,'next:mult','モオヒトツノ'))/.75);if(u>0)s+=`<path d="M390 382H${n(390+440*u)}" fill="none" stroke="#c89622" stroke-width="7" stroke-linecap="round"/>`;}
 if(r===42){s+=C('999＋1',350,TT(ctx,'ch:q','キュウヒャク'),48);s+=C('腕は 何回 落ちる？',450,TT(ctx,'ch:q','オモリノ'));s+=N('答えは この先の 計算する機械の 回',TT(ctx,'ch:q','コタエモ'));}
 return s;
}
function VE(ctx,k){const d=data();return d.cues.find(c=>c.key===k).voiceEnd;}
