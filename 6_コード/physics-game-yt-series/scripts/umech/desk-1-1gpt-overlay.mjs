// 技術の疑問の鎖 1-1 ChatGPT 試作の札。第6版の cue 文言だけを継承し、
// 札の構図と出す時刻は正本の画面欄から組み直した。
import {esc,clamp} from './anim.mjs';
import {wt} from './yt1-chain-00bx-common.mjs';

const FONT='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const n=x=>Number(x.toFixed(1));
const sm=x=>{x=clamp(x);return x*x*(3-2*x);};
const width=s=>[...String(s)].reduce((v,c)=>v+(/[ -~]/.test(c)?.55:1),0);
const key=q=>q.diagram.split('-').slice(1).join('-');
function card(s,x,y,{size=40,color='#352415',paper='#f4e8cc',align='start',op=1,accent=null}={}){
 if(op<=0)return '';
 const w=width(s)*size+44,h=size+30,xx=align==='middle'?x-w/2:x;
 return `<g opacity="${n(op)}"><rect x="${n(xx+6)}" y="${n(y-h/2+7)}" width="${n(w)}" height="${h}" rx="9" fill="#201006" opacity=".42"/>
 <rect x="${n(xx)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="9" fill="${paper}" stroke="#b8925a" stroke-width="3"/>
 ${accent?`<rect x="${n(xx)}" y="${n(y-h/2)}" width="15" height="${h}" fill="${accent}"/>`:''}
 <text x="${n(xx+w/2)}" y="${n(y+size*.34)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`;
}
const VIEW={'具体例':'#38c6d9','たとえ話':'#ff9ce6','破る側から':'#ff8f6b'};
const YEAR={'barrel:mary':'1586年 イングランド','end:a':'1586年 イングランド','end:b':'1586年 イングランド','end:exec':'1587年2月'};
const NOTE={
 'letter:open':'手紙の内容と形は、説明用の再現',
 'clock:tick':'時計は、文字の輪を考えるためのたとえ',
 'doll:tag':'人形と名札は、文字の入れ替えのたとえ',
 'scroll:years':'巻物の長さは大きく誇張',
 'end:a':'運び役は説明用の人形',
 'end:b':'横流しと写し取りを模型で再現'
};
function at(ctx,word,occ=0){const {cue,cap}=ctx;return cap.start+wt({cue,t:0,dur:cap.end-cap.start},word,occ);}
function timed(ctx,s,y,word,{size=44,color='#2b1b10',accent='#4389d0'}={}){
 const start=at(ctx,word);
 return card(s,540,y,{size,color,accent,align:'middle',op:sm((ctx.t-start)/.22)});
}
function step(ctx,text,x,y,word,color='#254c85'){
 const start=at(ctx,word);
 return card(text,x,y,{size:40,color,op:sm((ctx.t-start)/.18)});
}
function score(ctx){
 const c=ctx.clip,all=c.scenes.flatMap(s=>s.cues.map((q,i)=>({q,cap:s.captions[i]})));
 const get=(name,word)=>{const x=all.find(e=>key(e.q)===name);return x.cap.start+wt({cue:x.q,t:0,dur:x.cap.end-x.cap.start},word);};
 const a=get('disk:three','キャット'),b=get('rows:done','カゾエタ'),t=ctx.t;
 const visible=(t>a-.4&&t<a+3.2)||(t>b-.4&&t<b+3.2)||['barrel:board','disk:kai','next:weak'].includes(key(ctx.cue));
 if(!visible)return '';
 return card(`作る側 0  −  ${t>=b?2:t>=a?1:0} 破る側`,540,131,{size:36,color:'#fff',paper:'#22304a',align:'middle'});
}
function decodeBoard(ctx,k){
 if(!k.startsWith('rows:'))return '';
 const {t,cap}=ctx;
 const known=(word)=>t>=at(ctx,word);
 let line1='THE □□□□ □□□□',line2='□□□□ □□ THE',focus='分かった文字：E T H';
 if(['rows:b','rows:c'].includes(k))focus=k==='rows:b'?'1文字だけの Q が4回':'1文字の言葉：A か I';
 if(k==='rows:d'){line2='□EET Q□ THE';focus='□EET Q□ THE';}
 if(k==='rows:e'){line2='□EET Q□ THE';focus='Q＝I か、Q＝A か';}
 if(['rows:f','rows:f2','rows:f3'].includes(k)){
  line2='□EET AT THE';focus=k==='rows:f3'&&known('キュウワ')?'Q＝A':'AT THE のほうが自然';
 }
 if(k==='rows:g'){line1='JXGG';line2='TE□□';focus='同じ文字が2つ続く';}
 if(k==='rows:h'){line1='JXGG';line2=known('テル')?'TELL':'TE□□';focus=known('テル')?'G＝L':'同じ文字が2つ続く';}
 if(['rows:i','rows:i2','rows:i2b','rows:i3','rows:i3b','rows:j','rows:j2','rows:fill'].includes(k)){
  line1='THE A□□□ □□LL';line2='□EET AT THE';focus='ほかの言葉の穴が埋まる';
  if(['rows:i2b','rows:i3','rows:i3b','rows:j','rows:j2','rows:fill'].includes(k)){
   line2=k==='rows:i2b'&&!known('エヌワ')?'□EET AT THE':'MEET AT THE';
  }
  if(['rows:i3','rows:i3b','rows:j','rows:j2','rows:fill'].includes(k))line1='THE A□M□ □□LL';
  if(['rows:i3b','rows:j','rows:j2','rows:fill'].includes(k)&&
     (k!=='rows:i3b'||known('グン')))line1='THE ARMY □□LL';
  if(['rows:j','rows:j2','rows:fill'].includes(k)&&
     (k!=='rows:j'||known('ウィル')))line1='THE ARMY WILL';
 }
 const jp=(s,y,size=44,color='#f7ecd6')=>`<text x="540" y="${y}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(s)}</text>`;
 const latin=(s,y,size=60,color='#f7ecd6')=>`<text x="540" y="${y}" font-family="Menlo, Monaco, monospace" font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(s)}</text>`;
 let out='<g><rect x="45" y="510" width="990" height="655" rx="28" fill="#1d2835" stroke="#d0a966" stroke-width="5"/>';
 out+=jp('暗号文の冒頭',585,43,'#dfba79');
 out+=latin('JVX QSNI DPGG',686,56,'#e6a35e');
 out+=latin('NXXJ QJ JVX',767,56,'#e6a35e');
 out+='<path d="M90 808 H990" stroke="#a27e55" stroke-width="3" opacity=".8"/>';
 out+=latin(line1,903,60);
 out+=latin(line2,996,60);
 out+=jp(focus,1102,42,'#91d3d4');
 return out+'</g>';
}
const COLO='#9c4815';
export function overlay1_1gpt(ctx){
 const {cue:q,t,cap}=ctx,k=key(q),cs=cap.start;
 let out='';
 const scoreLayer=score(ctx);
 let year=YEAR[k];
 if(['disk:','ring:','clock:'].some(p=>k.startsWith(p)))year='紀元前1世紀 ローマ';
 if(['book:','doll:','e3:','tw:','dice:','tower:','logic:','rows:'].some(p=>k.startsWith(p)))year='9世紀 バグダッド キンディー';
 if(year&&!scoreLayer)out+=card(year,40,132,{size:36,op:sm((t-cs)/.2)});
 if(q.view)out+=card('見方：'+q.view,40,210,{size:40,accent:VIEW[q.view]??'#fff'});
 if(NOTE[k])out+=card(NOTE[k],40,310,{size:36,op:sm((t-cs-.2)/.2)});
 out+=scoreLayer;
 out+=decodeBoard(ctx,k);
 if(k==='disk:ad'){
  out+=step(ctx,'A',110,330,'エエカラ');
  out+=step(ctx,'B',320,330,'ビイ');
  out+=step(ctx,'C',530,330,'スィイ');
  out+=step(ctx,'D',740,330,'ディイト');
 }
 if(k==='disk:cat')out+=timed(ctx,'CAT → FDW',330,'エフ', {size:48,color:COLO});
 if(k==='ring:zc')out+=timed(ctx,'Z → A → B → C',330,'スィイデ',{size:44,color:COLO});
 if(k==='disk:25')out+=timed(ctx,'回して試すのは25通り',330,'ニジュウゴトオリ',{size:44,color:COLO});
 if(k==='sub:cat')out+=timed(ctx,'CAT → EQJ',1540,'イイ',{size:48,color:COLO});
 if(k==='tree:mult'){
  out+=step(ctx,'26',80,1460,'ヒトツノ');
  out+=step(ctx,'×25',265,1460,'ツギノ');
  out+=step(ctx,'×24',500,1460,'カケザンニ');
  out+=timed(ctx,'約4×10²⁶通り',1540,'ヤク',{size:44,color:COLO});
 }
 if(k==='scroll:years')out+=timed(ctx,'約1300万年',1510,'センサンビャクマンネン',{size:48,color:COLO});
 if(k==='think:pause'){
  out+=card('全部試さずに解ける？',540,390,{size:48,color:'#fff',paper:'#583b2b',align:'middle',op:sm((t-at(ctx,'ゼンブ'))/.3)});
  const remaining=cap.end-t,progress=clamp((3-remaining)/3);
  if(remaining<=3.05)out+=`<g opacity="${n(sm((3.05-remaining)/.16))}"><circle cx="540" cy="835" r="104" fill="none" stroke="#65513c" stroke-width="22" opacity=".55"/><circle cx="540" cy="835" r="104" fill="none" stroke="#e9b55b" stroke-width="22" stroke-linecap="round" stroke-dasharray="${n(653.45*progress)} 653.45" transform="rotate(-90 540 835)"/></g>`;
 }
 if(k==='e3:flip')out+=timed(ctx,'E E E → X X X',1510,'エックス',{size:46,color:COLO});
 if(k==='tw:en'){
  out+=card('E 約13％',245,330,{size:42,color:COLO,align:'middle',op:sm((t-at(ctx,'ジュウサン'))/.22)});
  out+=card('T 約9％',785,330,{size:42,color:COLO,align:'middle',op:sm((t-at(ctx,'キュウ'))/.22)});
 }
 if(k==='tower:grow')out+=timed(ctx,'541文字を数える',1510,'ゴヒャクヨンジュウイチ',{size:44,color:COLO});
 if(k==='logic:hyp')out+=timed(ctx,'仮説：X＝E、J＝T',1520,'カセツ',{size:43,color:COLO});
 if(k==='logic:if')out+=timed(ctx,'予言：J□X が何度も出る',1520,'サンモジ',{size:42,color:COLO});
 if(k==='logic:fact')out+=timed(ctx,'事実：JVX が14回',1520,'ジュウヨ',{size:43,color:COLO});
 if(k==='logic:judge')out+=timed(ctx,'判定 ○　V に H',1520,'ブイワ',{size:44,color:COLO});
 if(k==='rows:b')out+=timed(ctx,'1文字の Q が4回',1510,'ヨンカイ',{size:43,color:COLO});
 if(k==='rows:e')out+=step(ctx,'Q＝I なら IT THE',74,1460,'アイナラ');
 if(k==='rows:e')out+=step(ctx,'Q＝A なら AT THE',74,1540,'エエナラ');
 if(k==='rows:f'){
  out+=card('Q＝I なら IT THE',74,1460,{size:40});
  out+=card('Q＝A なら AT THE',74,1540,{size:40});
 }
 if(k==='rows:f2'){
  const judged=sm((t-at(ctx,'イミガ'))/.22);
  out+=card('×  Q＝I なら IT THE',74,1460,{size:40,color:'#9b3434',op:judged});
  out+=card('○  Q＝A なら AT THE',74,1540,{size:40,color:'#247852',op:judged});
 }
 if(k==='rows:f3')out+=timed(ctx,'Q＝A',1530,'キュウワ',{size:48,color:COLO});
 if(k==='rows:h')out+=timed(ctx,'G＝L → TELL',1530,'テル',{size:46,color:COLO});
 if(k==='rows:i2b')out+=timed(ctx,'N＝M → MEET',1530,'エヌワ',{size:46,color:COLO});
 if(k==='rows:i3b')out+=timed(ctx,'QSNI → ARMY',1530,'グン',{size:45,color:COLO});
 if(k==='rows:j')out+=timed(ctx,'DPGG → WILL',1530,'ウィル',{size:45,color:COLO});
 if(['end:a','end:b','end:mio'].includes(k)){
  for(const [name,x,word] of [['メアリー',190,'メアリー'],['ギフォード',530,'ギフォード'],['ウォルシンガム',870,'ウォルシンガム']]){
   out+=card(name,x,420,{size:36,align:'middle',op:k==='end:a'?sm((t-at(ctx,word))/.22):1});
  }
 }
 if(k==='end:b')out+=timed(ctx,'横流し → 写し → 封をし直す',1530,'ウツシトラレ',{size:41,color:COLO});
 if(k==='ch:next')out+=timed(ctx,'答えは次の回',1520,'コタエワ',{size:42,color:COLO});
 return out;
}
