// S3: keep the previous good overlays; change only Claude-authorized labels and figures.
// D-1 後編（ys-chain-d1b）の札（2D）。Claude 2026-10-26。desk-d1v1-overlay.mjs を写して、キーの頭・得点・札を後編に合わせた。
// 時刻はすべて cue キーと声の語（data.json の wordEvents＝D-1後編_cue時刻一覧.md の「主な語の時刻」）。行番号・決め打ちの秒は使わない。
// 札の文言は正本（技術の疑問の鎖_D-1後編_ナレーション.md の「画面」欄）のまま。
import {readFileSync} from 'node:fs';
import {makeS3} from './desk-d1b-additions_s3_20261026.mjs';
import {esc,clamp} from './anim.mjs';
import {pill,stepsRow} from './desk-overlay-lib.mjs';
import {measureLabels,textWidth,wrapText} from './desk-d1ab-typeset_gpt_20261026.mjs';
const ownSource=readFileSync(new URL(import.meta.url),'utf8');
await measureLabels([...ownSource.matchAll(/(?:card|noteTag)\('([^'\n]+)'/g)].map(m=>m[1]));
const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const sm=x=>{x=clamp(x);return x*x*(3-2*x);};const n=x=>+x.toFixed(1);
const jw=s=>[...s].reduce((a,c)=>a+(/[ -~]/.test(c)?.60:1),0);
let D=null;function data(){return D??=JSON.parse(readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026')+'/blender/data.json','utf8'));}
const key=q=>q.diagram.replace(/^cd1b-/,'');
function cue(k){const c=data().cues.find(c=>c.key===k);if(!c)throw Error('d1b cue '+k);return c;}
function W(k,word){const h=cue(k).wordEvents.filter(w=>w.word===word);if(h.length!==1)throw Error(`d1b word ${k} ${word}`);return h[0].time;}
// 紙の札（クリーム色の紙、こげ茶の字）。複数行可
function card(lines,x,y,{size=42,op=1,center=false,color='#3b2412'}={}){
 if(op<=.003)return '';if(typeof lines==='string')lines=[lines];
 lines=lines.flatMap(l=>wrapText(l,size,948));
 const width=Math.min(1000,Math.max(...lines.map(l=>textWidth(l,size)))+52),h=lines.length*size*1.28+24;
 y=Math.max(110+h/2,Math.min(1595-h/2,y));
 x=center?x-width/2:x;x=Math.max(40,Math.min(1040-width,x));
 const texts=lines.map((l,i)=>`<text x="${n(x+width/2)}" y="${n(y-h/2+size+12+i*size*1.28)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(l)}</text>`).join('');
 return `<g opacity="${n(op)}"><rect x="${n(x+4)}" y="${n(y-h/2+5)}" width="${n(width)}" height="${n(h)}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x)}" y="${n(y-h/2)}" width="${n(width)}" height="${n(h)}" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/>${texts}</g>`;
}
const noteTag=(label,x=40,y=1440,op=1)=>card(label,x,y,{size:36,op});
// 引出線つきの札：札の端から 3D の点（anchors）へ
function leader(ctx,name,x,y,op,{dx=0,dy=0}={}){
 const p=ctx.anchor(name);if(!p?.[2]||op<=.003)return '';
 return `<g opacity="${n(op)}"><path d="M${n(x)} ${n(y)} L${n(p[0]+dx)} ${n(p[1]+dy)}" stroke="#f4e8cc" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${n(x)} ${n(y)} L${n(p[0]+dx)} ${n(p[1]+dy)}" stroke="#7a5634" stroke-width="2.5" fill="none"/><circle cx="${n(p[0]+dx)}" cy="${n(p[1]+dy)}" r="8" fill="#ffd23f" stroke="#7a5634" stroke-width="2"/></g>`;
}
function view(kind,op){
 const col={'具体例':'#38c6d9','たとえ話':'#ff9ce6','確かめる側から':'#5aa469','作る側から':'#f0a040'}[kind];
 const s='見方：'+kind,w=jw(s)*40+96,x=40,y=176;
 return `<g opacity="${n(op)}"><rect x="${x+4}" y="${y+6}" width="${w}" height="76" rx="10" fill="#2a1406" opacity=".4"/><rect x="${x}" y="${y}" width="${w}" height="76" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/><rect x="54" y="186" width="${w-28}" height="56" rx="5" fill="#f4e8cc"/><rect x="54" y="186" width="22" height="56" rx="4" fill="${col}"/><circle cx="65" cy="180" r="7" fill="#c9a44e"/><circle cx="${x+w-25}" cy="180" r="7" fill="#c9a44e"/><text x="${x+50}" y="228" ${FONT} font-size="40" font-weight="800" fill="#3b2412">${esc(s)}</text></g>`;
}
function qmark(x,y,op,size=64){if(op<=.003)return '';return `<g opacity="${n(op)}"><circle cx="${n(x)}" cy="${n(y)}" r="${size*.62}" fill="#f4e8cc" stroke="#b8925a" stroke-width="4"/><text x="${n(x)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="900" text-anchor="middle" fill="#c8483a">？</text></g>`;}
// 小さな絵（紙の札の上に、線で描いた絵）
function pictureCard(x,y,w,h,inner,op,title=null){
 if(op<=.003)return '';
 return `<g opacity="${n(op)}"><rect x="${x+5}" y="${y+6}" width="${w}" height="${h}" rx="12" fill="#2a1406" opacity=".35"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#f4e8cc" stroke="#b8925a" stroke-width="4"/>${inner}${title?`<text x="${x+w/2}" y="${y+h-18}" ${FONT} font-size="36" font-weight="800" text-anchor="middle" fill="#3b2412">${esc(title)}</text>`:''}</g>`;
}
const ARW=(x1,y1,x2,y2,c='#2f7bf0')=>{const a=Math.atan2(y2-y1,x2-x1),h=16;return `<path d="M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}" stroke="${c}" stroke-width="7" stroke-linecap="round"/><path d="M${n(x2)} ${n(y2)} L${n(x2-h*Math.cos(a-.5))} ${n(y2-h*Math.sin(a-.5))} L${n(x2-h*Math.cos(a+.5))} ${n(y2-h*Math.sin(a+.5))} Z" fill="${c}"/>`;};
function canPic(x,y){return `<rect x="${x-34}" y="${y-30}" width="68" height="80" rx="10" fill="#c7cdd0" stroke="#6a6b69" stroke-width="3" transform="translate(${x} ${y}) skewX(-6) translate(${-x} ${-y})"/><path d="M${x-28} ${y+4} q14 -12 28 0 q14 12 28 0" stroke="#6a6b69" stroke-width="3" fill="none"/><rect x="${x-24}" y="${y-12}" width="44" height="40" fill="#fffbe8" stroke="#e6c84a" stroke-width="2" stroke-dasharray="5 4"/>`+ARW(x-80,y+10,x-42,y+10)+ARW(x+82,y+10,x+44,y+10)+ARW(x,y-80,x,y-40);}
function strawPic(x,y){return `<path d="M${x-34} ${y-40} L${x-28} ${y+50} L${x+28} ${y+50} L${x+34} ${y-40}" fill="#e4f3f5" stroke="#7a9aa0" stroke-width="3"/><rect x="${x-30}" y="${y}" width="60" height="48" fill="#e9a14c"/><rect x="${x+4}" y="${y-70}" width="9" height="112" fill="#f4e8cc" stroke="#c85042" stroke-width="2"/><rect x="${x+5}" y="${y-48}" width="7" height="50" fill="#fffbe8" stroke="#e6c84a" stroke-width="2" stroke-dasharray="4 3"/>`+ARW(x-18,y-30,x-18,y-2)+ARW(x+26,y-30,x+26,y-2);}
function pumpPic(x,y){return `<rect x="${x-30}" y="${y-40}" width="60" height="90" fill="#dcefF4" stroke="#6a6b69" stroke-width="3"/><rect x="${x-28}" y="${y+28}" width="56" height="20" fill="#3f7fb0"/><rect x="${x-28}" y="${y-36}" width="56" height="26" fill="#3f7fb0"/><rect x="${x-30}" y="${y-12}" width="60" height="8" fill="#8d8f8f"/><rect x="${x-26}" y="${y-4}" width="52" height="30" fill="#fffbe8" stroke="#e6c84a" stroke-width="2" stroke-dasharray="4 3"/><rect x="${x-3}" y="${y-70}" width="6" height="60" fill="#8a5a32"/>`+ARW(x-70,y+40,x-34,y+40)+ARW(x+70,y+40,x+34,y+40);}
function horsePic(x,y){return `<ellipse cx="${x}" cy="${y+18}" rx="52" ry="22" fill="#94603d"/><ellipse cx="${x+50}" cy="${y+28}" rx="20" ry="13" fill="#94603d"/><path d="M${x-40} ${y+36} l-14 10 M${x+30} ${y+38} l10 12" stroke="#27211c" stroke-width="6" stroke-linecap="round"/><circle cx="${x+56}" cy="${y+24}" r="3" fill="#27211c"/><path d="M${x+48} ${y+16} q4 -8 10 -2" stroke="#27211c" stroke-width="3" fill="none"/><circle cx="${x+70}" cy="${y-2}" r="5" fill="#6fb3e0"/><circle cx="${x+80}" cy="${y+8}" r="4" fill="#6fb3e0"/>`;}
function leverPic(x,y){
 // 支点・2本の腕・先の重り（画面の右上の札）
 return `<circle cx="${x}" cy="${y}" r="9" fill="#6a6b69"/><path d="M${x} ${y} L${x-92} ${y+16}" stroke="#c9a44e" stroke-width="12" stroke-linecap="round"/><path d="M${x} ${y} L${x-36} ${y-66}" stroke="#c9a44e" stroke-width="10" stroke-linecap="round"/><circle cx="${x-40}" cy="${y-74}" r="20" fill="#c9a44e" stroke="#7a5634" stroke-width="3"/>`
  +`<text x="${x}" y="${y+44}" ${FONT} font-size="36" font-weight="800" fill="#3b2412">支点</text><text x="${x-150}" y="${y+64}" ${FONT} font-size="36" font-weight="800" fill="#3b2412">腕</text><text x="${x+0}" y="${y-74}" ${FONT} font-size="36" font-weight="800" fill="#3b2412">重り</text>`;
}
const {pin,addedS3,scaleIcon}=makeS3({W,card,ARW,n,textWidth});
export function overlayD1b(ctx){
 const {t,cue:q}=ctx,k=key(q),N=data().numbers;
 const on=(at,dd=.22)=>sm((t-at)/dd),off=(at,dd=.25)=>1-sm((t-at)/dd);let s='';
 // Opening axis label is drawn above the title by this episode's frame wrapper.
 if(q.view)s+=view(q.view,1);
 // 勝負の札「水 ○ − ○ 人」
 for(const [kk,word,i] of [['score:still','水 1−0 人（得点板）',0],['run:repeat','くり返し（得点板 水 1−1 人）',1],['next:spread','くみ出せる（得点板 水 1−2 人・カイ得意顔）',2]]){
  const a=W(kk,word);if(t>=a&&t<a+3.2){const [water,human]=N.scores[i];s+=pill(`水 ${water} − ${human} 人`,1040,150,{size:40,anchor:'end',op:on(a)*(1-on(a+2.9)),color:'#fff'});}
 }
 // 行2
 if(k==='recap:can'||k==='recap:straw'){
  s+=card('押すのは まわりの 空気',40,330,{op:on(W('recap:can','まわりの空気'))});
  s+=stepsRow([['蒸気を 冷やす',W('recap:can','蒸気を冷やす')],['水に 戻る',W('recap:can','水に戻って')],['空っぽ',W('recap:can','空っぽ')]],t,1470,{size:42});
 }
 // 行4
 if(k==='quiz:weak'||k==='quiz:fuji'){const a=W('quiz:weak','弱くなります');s+=pin(ctx,'fujiLow','ふもと',60,330,on(a))+pin(ctx,'fujiHigh','頂上',800,330,on(a));s+=card('約6割',760,445,{size:44,op:on(a+.25)});}
 // 行7
 if(k==='boiler:fire'||k==='boiler:steam')s+=stepsRow([['石炭の 火',W('boiler:fire','石炭を燃やして')],['水が わく',W('boiler:fire','わかします')],['蒸気',W('boiler:steam','蒸気になって')]],t,1490,{size:44});
 // 行8
 if(k==='valve:pipe'||k==='valve:tap'){const a=W('valve:pipe','蒸気の弁');s+=leader(ctx,'steamvalve',875,365,on(a))+card('蒸気の 弁',740,330,{op:on(a)});}
 if(k==='valve:tap'){const a=W(k,'弁は');s+=leader(ctx,'tap',150,700,on(a))+card('水道の 蛇口',40,700,{op:on(a)});}
 // 行9
 if(k==='cyl:open'){s+=card('筒の 上は 開いている',40,330,{op:on(W(k,'開いています'))});s+=card('革 ＋ 水 → 空気が もれない',40,1490,{op:on(W(k,'少し水をはって'))});s+=pin(ctx,'leather','革',40,460,on(W(k,'革でふさぎ')))+pin(ctx,'pistonwater','水',850,550,on(W(k,'少し水をはって')));}
 // 行10
 if(k==='arm:rod'){const a=W(k,'とても重い');s+=leader(ctx,'rodmid',300,560,on(a))+card('とても 重い',40,560,{size:46,op:on(a)});}
 // 行14
 if(k==='run:up')s+=card('上がるのは 重い 棒が 引くから',40,330,{size:40,op:on(W(k,'重い棒が引く'))});
 // 行16
 if(k==='run:spray'){const a=W(k,'冷水の弁'),b=W(k,'水槽'),z=W(k,'勢い')+.3;s+=leader(ctx,'coldvalve',820,1470,on(a)*off(z))+card('冷水の 弁',760,1490,{op:on(a)*off(z)});s+=leader(ctx,'tank',880,330,on(b)*off(z))+card('水槽',820,330,{op:on(b)*off(z)});}
 // 行17
 if(k==='run:empty')s+=card('空っぽ',40,1490,{size:48,op:on(W(k,'空っぽ'))});
 // 行19
 if(k==='run:down'||k==='run:air'||k==='run:back'){
  s+=stepsRow([['空気が 押す',W('run:down','外の空気')],['ピストン 下',W('run:down','押し下げます')],['棒 上',W('run:down','引き上げられます')]],t,1490,{size:42});
  if(k!=='run:down')s+=card('重い 棒を 持ち上げるのは 空気',40,330,{size:40,op:on(W('run:air','持ち上げている'))});
 }
 // 行27・28：ストロー／缶・ストロー・ポンプの小さな絵
 if(k==='pump:mio2')s+=pictureCard(640,300,320,300,strawPic(800,420),on(W(k,'ストローと同じ')),'前の回の ストロー');
 if(k==='pump:same'){
  const a0=W(k,'缶も'),a1=W(k,'ストローも'),a2=W(k,'このポンプも');
  s+=pictureCard(40,1300,310,280,scaleIcon(canPic(195,1420),195,1420),on(a0),'缶');s+=pictureCard(385,1300,310,280,scaleIcon(strawPic(540,1430),540,1430),on(a1),'ストロー');s+=pictureCard(730,1300,310,280,scaleIcon(pumpPic(885,1430),885,1430),on(a2),'ポンプ');
  s+=card('空いた 所を、まわりが 押す',40,330,{size:44,op:on(W(k,'まわりが押して'))});
 }
 // 行30
 if(k==='pump:novalve'){
  const a=W(k,'弁がなければ'),b=W(k,'一方にしか開かない弁');
  s+=card('もし 弁が なかったら',40,330,{op:on(a)*off(b)});
  s+=card('弁 ＝ 水を 上へだけ 進ませる',40,1490,{size:40,op:on(W(k,'上へしか進めない'))});
 }
 // 行31
 if(k==='drain:mio'){const p=ctx.anchor('cyl');if(p?.[2])s+=qmark(p[0]+150,p[1]+40,on(W(k,'筒の底にたまった水')));}
 // 行32・33
 if(k==='drain:pipe'){const a=W(k,'外へしか開かない弁');s+=leader(ctx,'drain',300,1470,on(a))+card('外へしか 開かない 弁',40,1490,{op:on(a)});}
 if(k==='drain:out')s+=noteTag('本当は、空気用の 小さな 弁が 別に あった（簡単に した 形）',40,1510,on(W(k,'残っていた空気')));
 // 行34
 if(k==='tank:mio')s+=pictureCard(80,330,330,230,horsePic(230,420),on(W(k,'また馬')),'また 馬？');
 // 行35
 if(k==='tank:self'){const a=W(k,'腕につないだ');s+=pin(ctx,'jackrod','水槽の ポンプの 棒',40,330,on(a))+pin(ctx,'jack','水槽の ポンプ',700,520,on(W(k,'小さなポンプ')));}
 // 行36
 if(k==='run:repeat')s+=card('1分間に 十数回',40,330,{op:on(W(k,'十数回'))});
 // 行37
 if(k==='lever:mio'){const a=W(k,'誰');for(const nm of ['steamvalve','coldvalve']){const p=ctx.anchor(nm);if(p?.[2])s+=qmark(p[0]-10,p[1]-110,on(a),56);}}
 // 行38
 if(k==='lever:hand')s+=noteTag('とも 言われる',40,1550,on(W(k,'言われます')));
 // 行39〜42：レバーの札と形の札（右上）
 if(['lever:one','lever:flip','lever:tappet','lever:fall','lever:auto'].includes(k)){
  const a=W('lever:one','1本のレバー');
  if(t>=a){s+=card('切りかえの レバー（重り 付き）',40,330,{size:40,op:on(a)*(k==='lever:auto'?off(cue('lever:auto').start+.8):1)});
   s+=leader(ctx,'lever',700,570,on(a+.4));
   s+=pictureCard(700,440,340,260,leverPic(960,600),on(a+.4));}
 }
 if(k==='lever:tappet'){const a=W(k,'上下する棒');s+=leader(ctx,'plug',300,1470,on(a))+card('弁の 棒',40,1490,{op:on(a)});}
 if(k==='lever:fall')s+=noteTag('スロー',40,1550,on(cue(k).start+.4));
 // 行45
 if(k==='next:100'){
  s+=card('仕事に なった 熱 ＝ 約100分の1',40,330,{size:40,op:on(W(k,'100分の1'))});
  const a=W(k,'100分の1');if(t>=a){s+='<g>';for(let i=0;i<100;i++)s+=`<rect x="${80+(i%10)*27}" y="${450+Math.floor(i/10)*27}" width="23" height="23" rx="3" fill="${i===0?'#ffd23f':'#f4e8cc'}" stroke="#b8925a" stroke-width="2"/>`;s+='</g>';}
 }
 // 行46
 if(k==='next:who'){const p=ctx.anchor('coal');if(p?.[2])s+=qmark(Math.min(980,p[0]+20),Math.max(420,p[1]-130),on(W(k,'気づいた人')),64);}
 // 行47
 if(k==='ch:drain'||k==='ch:stop'||k==='ch:answer'){const p=ctx.anchor('drain');if(p?.[2])s+=qmark(Math.min(980,p[0]+140),Math.max(420,p[1]-170),on(W('ch:drain','壊れて')),70);}
 s+=addedS3(ctx,k,on);
 return s;
}


