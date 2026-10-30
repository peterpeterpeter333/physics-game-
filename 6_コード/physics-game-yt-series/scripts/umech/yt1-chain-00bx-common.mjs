// 技術の疑問の鎖 序章2-1・2-2・2-3（ys-chain-00b1〜00b3、暗号の3本）の共通の道具。図のキーは持たない
// （ファイル名が -diagrams で終わらないので自動読み込みされない。各回の図ファイルから import する）。
//  - 計算：カエサル・入れ替え・アルベルティ・ヴィジュネルの暗号、長い英文 2つ（TEXT1・TEXT2）の暗号と文字の回数。全部 assert で確かめる。
//  - 文字の輪 letterRing：アルファベットを時計のように輪にした図。外はクリーム色の輪に紺の文字、内は金色の輪に茶の文字
//    （3D のアルベルティの円板 scripts/blender/cipher_disks.py・enigma_open.py の alb と同じ色）。1目盛りずつ動く印 ringMark。
//  - 文字の帯 strip、棒グラフ bars、等幅の文字 mono。
//  - 見方の札 aspect（具体例・たとえ話・破る側から）を舞台の右上に、年と人物 yearTag2 を左上に出す包み fig()。
//  - 声の窓 wt()／ws()：その文字・数を声が言う時刻。音声を作った後は $EM_FILM_CACHE/phrase-times.json
//    （scripts/umech/chain-00bx-phrase-times.py が Nemo のモーラの長さから計算）を使い、無いときは kana の長さの割合で見積もる。
import {readFileSync,existsSync} from 'node:fs';
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,
 jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,fuda} from './yt1-chain-common.mjs';

// ================= 計算 =================
export const ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ix=c=>ABC.indexOf(c.toUpperCase());
// 英文の文字の割合（％、よく知られた表。E 12.7・T 9.1。第1版と同じ）
export const EN=[8.2,1.5,2.8,4.3,12.7,2.2,2.0,6.1,7.0,0.15,0.77,4.0,2.4,6.7,7.5,1.9,0.095,6.0,6.3,9.1,2.8,0.98,2.4,0.15,2.0,0.074];
export const shift=(c,k)=>ABC[((ix(c)+k)%26+26)%26];
export const caesar=(s,k)=>[...s].map(c=>/[A-Z]/.test(c)?shift(c,k):c).join('');
// 入れ替えの表（図のための例）：正本どおり A→Q、B→W、C→E。E→X、T→J、H→V
export const SUB='QWEMXAZVPBTGNOCLRSUJHYDFIK';
export const subst=(s,tab=SUB)=>[...s].map(c=>/[A-Z]/.test(c)?tab[ix(c)]:c).join('');
export const unsub=(s,tab=SUB)=>[...s].map(c=>/[A-Z]/.test(c)?ABC[tab.indexOf(c)]:c).join('');
// アルベルティ：内の円板の並び（序章・第1版と同じ例）。向き t で、外の j の真下は 内の (j−t) 番目
export const ALB_IN='gkwnprtuzlxysomqihfdbacevj';
export const albUnder=(j,t)=>ALB_IN[((j-t)%26+26)%26];
// ヴィジュネル（A＝0）
export const vig=(s,key)=>{let i=0;return [...s].map(c=>/[A-Z]/.test(c)?shift(c,ix(key[i++%key.length])):c).join('');};
// 長い英文（図のために書いた。数百文字。2-1 の頻度・2-2 の平らな棒に使う）
export const TEXT1='THE ARMY WILL MEET AT THE OLD BRIDGE BEFORE THE SUN RISES. EVERY SOLDIER MUST BRING A MAP, WATER, AND ENOUGH FOOD FOR THREE DAYS. NOBODY SHOULD TELL THE ENEMY WHERE WE ARE GOING. IF THE WEATHER TURNS BAD, WAIT NEAR THE RIVER AND SEND A RIDER TO THE TOWN. THE PASSWORD FOR THE GATE IS WRITTEN ON THE BACK OF THIS LETTER. KEEP IT SECRET, AND BURN THIS LETTER AFTER YOU READ IT. OUR GENERAL THINKS THAT THE ATTACK CAN WORK ONLY IF EACH MAN STAYS QUIET AND MOVES QUICKLY. AT NIGHT, TWO SCOUTS WILL WATCH THE ROAD FROM THE HILL AND COUNT THE WAGONS. THEY WILL SIGNAL WITH A LAMP: ONE FLASH MEANS STOP, TWO FLASHES MEAN GO. DO NOT LIGHT A FIRE, AND DO NOT SING. WE EXPECT NEW ORDERS WITHIN SEVEN DAYS.';
// もっと長い英文（2-3 の列ごとの棒に使う。3文字おきに拾っても、どの列も 1位が E の行き先になる長さ）
export const TEXT2='WE EXPECT NEW ORDERS WITHIN SEVEN DAYS. IF THE WEATHER TURNS BAD, WAIT NEAR THE RIVER AND SEND A RIDER TO THE TOWN. REMEMBER THAT A SINGLE CARELESS WORD CAN DESTROY THE WHOLE PLAN. PLEASE CHECK EVERY WEAPON BEFORE WE LEAVE THE CAMP. THE PASSWORD FOR THE GATE IS WRITTEN ON THE BACK OF THIS LETTER. DO NOT LIGHT A FIRE, AND DO NOT SING. EVERY SOLDIER MUST BRING A MAP, WATER, AND ENOUGH FOOD FOR THREE DAYS. NOBODY SHOULD TELL THE ENEMY WHERE WE ARE GOING. THE MESSENGER WILL WEAR A GREEN SCARF. SLEEP EARLY, BECAUSE THE MARCH WILL BE LONG. THE HORSES NEED REST, SO LEAVE THEM IN THE FIELD BEHIND THE FARM. IF ANY STRANGER ASKS QUESTIONS, SEND HIM TO THE CAPTAIN AT ONCE. KEEP IT SECRET, AND BURN THIS LETTER AFTER YOU READ IT. THE FENCE NEAR THE EASTERN GATE HAS BEEN REPAIRED. WHEN THE ORDERS ARRIVE, THE CAPTAIN WILL READ THEM ALOUD TO THE OFFICERS, AND THE OFFICERS WILL EXPLAIN THEM TO THE MEN. THE BRIDGE IS NARROW, SO CROSS IT ONE BY ONE. HE WILL REPEAT THE SECRET WORD THREE TIMES. THE ARMY WILL MEET AT THE OLD BRIDGE BEFORE THE SUN RISES. OUR GENERAL THINKS THAT THE ATTACK CAN WORK ONLY IF EACH MAN STAYS QUIET AND MOVES QUICKLY.';
export const letters=s=>[...s].filter(c=>/[A-Z]/.test(c));
export const counts=arr=>{const c=Array(26).fill(0);for(const x of arr)c[ix(x)]++;return c;};
export const pct=c=>{const n=c.reduce((a,b)=>a+b,0);return c.map(v=>100*v/n);};
const order=c=>c.map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]||a[1]-b[1]);
const ok=(c,m)=>{if(!c)throw Error('chain-00bx: '+m);};

// --- 2-1 の検算 ---
ok(caesar('CAT',3)==='FDW','CAT→FDW');
ok(['ECV','DBU','CAT'].every((w,k)=>caesar('FDW',-(k+1))===w),'FDW−1〜3');
ok(shift('Z',3)==='C','Z+3');
ok([...SUB].sort().join('')===ABC&&[...SUB].every((c,i)=>c!==ABC[i]),'表は 26文字の並べかえ（自分自身には変わらない）');
ok(SUB.slice(0,3)==='QWE'&&SUB[4]==='X'&&SUB[19]==='J'&&SUB[7]==='V','A→Q B→W C→E E→X T→J H→V');
export const CAT_SUB=subst('CAT');ok(CAT_SUB==='EQJ','CAT→EQJ');
export const F26=(()=>{let f=1n;for(let k=1n;k<=26n;k++)f*=k;return f;})();
ok(F26===403291461126605635584000000n,'26!');
export const YEARS=Number(F26)/1e12/(365.25*24*3600);       // 1.28×10⁷ 年
ok(Math.abs(YEARS/1.278e7-1)<.01,'1300万年 '+YEARS);
export const L1=letters(TEXT1),C1=subst(TEXT1),CL1=letters(C1);
export const CNT1=counts(L1),CCNT1=counts(CL1),CPCT1=pct(CCNT1);
ok(L1.length===541,'TEXT1 541文字 '+L1.length);
ok(order(CNT1)[0][1]===4&&order(CNT1)[1][1]===19,'TEXT1：E が1位、T が2位');
ok(order(CCNT1)[0][1]===ix('X')&&order(CCNT1)[1][1]===ix('J'),'暗号文：X が1位、J が2位');
ok(CCNT1[ix('X')]===70&&CCNT1[ix('J')]===60,'X 70回・J 60回');
export const WORDS1=C1.split(/[^A-Z]+/).filter(Boolean),PW1=TEXT1.split(/[^A-Z]+/).filter(Boolean);
ok(PW1.filter(w=>w==='THE').length===14,'THE 14回');
ok(WORDS1.filter(w=>w.length===3&&w[0]==='J'&&w[2]==='X').every(w=>w==='JVX')&&WORDS1.filter(w=>w==='JVX').length===14,'J□X の 3文字の語は JVX が 14回');
// --- 2-2 の検算 ---
ok(albUnder(0,0)==='g'&&albUnder(0,1)==='j','A の下 g → j');
ok([0,1,4].every(t=>albUnder(t,t)==='g'),'g は A（向き0）・B（向き1）・E（向き4）から');
// 長い英文を、1文字ごとに内の円板を一目盛り回して暗号にした（向き t＝何文字目か）
export const ALB_ROT1=L1.map((c,i)=>albUnder(ix(c),i%26).toUpperCase());
export const ALB_FIX1=L1.map(c=>albUnder(ix(c),0).toUpperCase());
export const PCT_ALB_FIX=pct(counts(ALB_FIX1)),PCT_ALB_ROT=pct(counts(ALB_ROT1));
ok(Math.max(...PCT_ALB_ROT)<6&&Math.min(...PCT_ALB_ROT)>1.4,'円板を回すと平らに '+Math.max(...PCT_ALB_ROT)+' '+Math.min(...PCT_ALB_ROT));
ok(caesar('C',10)==='M'&&caesar('A',4)==='E'&&caesar('T',24)==='R'&&vig('CAT','KEY')==='MER','CAT→MER');
ok(vig('AAA','KEY')==='KEY','AAA→KEY');
export const V1=letters(vig(TEXT1,'KEY')),PCT_V1=pct(counts(V1));
ok(Math.max(...PCT_V1)<12,'KEY で平らに近づく '+Math.max(...PCT_V1));
// --- 2-3 の検算 ---
ok(vig('THECATSAWTHEDOG','KEY')==='DLCMERCEUDLCNSE','DLC MER CEU DLC NSE');
export const L2=letters(TEXT2),V2=letters(vig(TEXT2,'KEY'));
export const COLS2=[0,1,2].map(k=>V2.filter((_,i)=>i%3===k));
export const COLCNT2=COLS2.map(counts);
ok(L2.length===894,'TEXT2 894文字 '+L2.length);
ok(COLCNT2.every((c,k)=>order(c)[0][1]===ix(shift('E',[10,4,24][k]))),'3列とも 1位が E の行き先（O・I・C）');
ok([9,15,21].every(n=>n%3===0)&&[2,4,5,6,7,8,9].every(d=>![9,15,21].every(n=>n%d===0)),'9・15・21 の公約数は 3（1 を除く）');
ok(26**3===17576,'26³');
export const STATS={eTop1:+(CPCT1[ix('X')]).toFixed(1),tTop1:+(CPCT1[ix('J')]).toFixed(1),albMax:+Math.max(...PCT_ALB_ROT).toFixed(1),albMin:+Math.min(...PCT_ALB_ROT).toFixed(1),
 vMax:+Math.max(...PCT_V1).toFixed(1),col:COLCNT2.map(c=>order(c).slice(0,2).map(([v,i])=>ABC[i]+v).join(' '))};

// ================= 声の窓 =================
// カタカナにそろえ、長音「ー」を前の母音に、オ段の後のウ→オ、ヲ→オ・ハ→ワ・ヘ→エ（助詞の書き方の違いを消す）。kana の ' _ を除く。
// 合わせるためだけの形（声の時刻を探す）。phrase-times.py の norm と同じ。
const VOW={ア:'アカサタナハマヤラワガザダバパャァ',イ:'イキシチニヒミリギジヂビピィ',ウ:'ウクスツヌフムユルグズヅブプュゥヴ',エ:'エケセテネヘメレゲゼデベペェ',オ:'オコソトノホモヨロヲゴゾドボポョォ'};
const vowelOf=c=>{for(const [v,s] of Object.entries(VOW))if(s.includes(c))return v;return 'ウ';};
export function normKana(s){
 s=[...String(s)].map(c=>{const k=c.charCodeAt(0);return k>=0x3041&&k<=0x3096?String.fromCharCode(k+0x60):c;}).join('');
 s=s.replace(/['_\s]/g,'').replace(/ヲ/g,'オ').replace(/ハ/g,'ワ').replace(/ヘ/g,'エ').replace(/ヅ/g,'ズ').replace(/ヂ/g,'ジ');
 let o='';for(const c of s){let d=c==='ー'?vowelOf(o.at(-1)??'ア'):c;if(d==='ウ'&&o&&vowelOf(o.at(-1))==='オ')d='オ';o+=d;}return o;
}
let PT;
const phraseTimes=()=>{if(PT!==undefined)return PT;const f=(process.env.EM_FILM_CACHE??'')+'/phrase-times.json';PT=existsSync(f)?JSON.parse(readFileSync(f,'utf8')):{};return PT;};
// cue の声の、文字ごとの時刻（cue の始まりからの秒）。s＝そろえたカナ、t＝各文字の始まり
export function voiceMap(ctx){
 const q=ctx?.cue;if(!q)return {s:'',t:[]};
 const pt=phraseTimes()[q.subtitle];
 if(pt&&pt.kana===(q.kana??null))return pt;
 // 見積もり：kana（無ければ読み）の文字数の割合。「、」「。」は 2文字ぶんの間
 const src=q.kana??q.reading??'',ve=voiceEnd(ctx);let s='',w=[];
 for(const part of src.split(/([、。\/\s])/)){if(!part)continue;if(/[、。]/.test(part)){w.push(['',2]);continue;}if(/[\/\s]/.test(part))continue;const n=normKana(part);for(const c of n)w.push([c,1]);}
 const tot=w.reduce((a,x)=>a+x[1],0)||1;let acc=0;const t=[];
 for(const [c,k] of w){if(c){s+=c;t.push(.08+acc/tot*(ve-.15));}acc+=k;}
 return {s,t,end:ve};
}
// needle（カナ。ひらがなでも可）を声が言い始める時刻。occ 番目（0〜）。見つからなければ例外（図の誤りに気付けるように）
// off：needle の中の何文字目の時刻か（「シイワイイ」の「イイ」なら off 3）。end：needle を言い終わる時刻
// ウとオは、オ段の後で どちらにも書かれる（ボウシ／ホオホオ）ので、合わせるときは同じとみる
export function wt(ctx,needle,occ=0,{end=false,off=0}={}){
 const m=voiceMap(ctx),n=normKana(needle),re=new RegExp(n.replace(/[ウオ]/g,'[ウオ]'),'g');let i=-1;
 for(let k=0;k<=occ;k++){re.lastIndex=i+1;const r=re.exec(m.s);i=r?r.index:-1;if(i<0)break;}
 if(i<0){if(!ctx?.cue)return 0;throw Error(`wt: 「${needle}」(${n}) が声に無い：${ctx.cue.subtitle} / ${m.s}`);}
 const j=end?i+n.length:i+off;
 return j<m.t.length?m.t[j]:(m.end??voiceEnd(ctx));
}
// 声が needle を言うところで 0→1（d 秒かけて）。lag で少し後ろへずらす
export const ws=(ctx,p,needle,{occ=0,d=.3,lag=0,end=false,off=0}={})=>{const t=wt(ctx,needle,occ,{end,off});return seg(cueT(p,ctx),t+lag,t+lag+d);};
// 何歩目まで進んだか（連続）：times＝各歩の始まりの秒。1歩 d 秒
export const steps=(t,times,d=.28)=>times.reduce((a,x)=>a+seg(t,x,x+d),0);

// ================= 年と人物・見方の札 =================
export function yearTag2(text){
 const rows=String(text).split('\n'),size=36;let s='';
 rows.forEach((r,i)=>{const w=jw(r)*size+32,y=4+i*52;s+=rect(0,y,w,48,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:24})+label(r,16,y+36,{size,color:C.dim,weight:500});});
 return s;
}
export const ASPECT={'具体例':CYAN,'たとえ話':'#ff9ce6','破る側から':'#ff8f6b'};
export function aspectPill(kind,g=1){
 if(!kind||g<=0)return '';
 const col=ASPECT[kind],s=`見方：${kind}`,size=36,w=jw(s)*size+40,x0=W-w,y=4;
 return fade(g,rect(x0,y,w,50,{fill:C.bg,fo:.95,stroke:'none',rx:25})+rect(x0,y,w,50,{fill:col,fo:.22,stroke:col,sw:3,rx:25})+label(s,x0+w/2,y+38,{size,color:col,anchor:'middle',weight:700}));
}
// 図の関数を包む：年（文字か関数）と見方（文字・null・関数 (p,ctx)=>[kind,g]）
export const fig=(year,aspect,fn)=>(p,ctx)=>{
 const y=typeof year==='function'?year(p,ctx):year;
 let a=typeof aspect==='function'?aspect(p,ctx):aspect;if(typeof a==='string')a=[a,1];
 return fn(p,ctx)+yearTag2(y)+(a?aspectPill(a[0],a[1]):'');
};

// ================= 文字の輪 =================
export const RC={cream:'#e8e2cf',creamEdge:'#8a7a55',navy:'#1c2a44',gold:'#c9a45c',goldEdge:'#7a5634',brown:'#3b2a14'};
const PI2=Math.PI*2;
export const ringXY=(cx,cy,r,pos)=>{const a=pos/26*PI2;return [cx+r*Math.sin(a),cy-r*Math.cos(a)];};
function annulus(cx,cy,r0,r1,{fill,stroke,sw=3}){
 return `<path d="M${cx-r1} ${cy}a${r1} ${r1} 0 1 0 ${2*r1} 0a${r1} ${r1} 0 1 0 ${-2*r1} 0ZM${cx-r0} ${cy}a${r0} ${r0} 0 1 1 ${2*r0} 0a${r0} ${r0} 0 1 1 ${-2*r0} 0Z" fill="${fill}" fill-rule="evenodd" stroke="${stroke}" stroke-width="${sw}"/>`;
}
// 外の輪（letters を 0〜25 の位置に）、内の輪（inner を、rot 目盛り回した位置に）。
// hl：{位置: 色}（外）、ihl：{内の文字の番号: 色}。rot は連続（内の文字 k は 位置 k＋rot）。
export function letterRing({cx=500,cy=470,R=330,band=74,outer=ABC,inner=null,iR,iband=62,rot=0,hl={},ihl={},g=1,ig=1,size=40,isize=36,dimOuter=0,center=true}={}){
 if(g<=0)return '';
 let s=annulus(cx,cy,R-band/2,R+band/2,{fill:RC.cream,stroke:RC.creamEdge});
 for(let j=0;j<26;j++){const a=ringXY(cx,cy,R-band/2,j+.5),b=ringXY(cx,cy,R+band/2,j+.5);s+=line(a[0],a[1],b[0],b[1],{color:RC.creamEdge,w:1.5});}
 for(let j=0;j<26;j++){const [x,y]=ringXY(cx,cy,R,j),c=hl[j];
  if(c)s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(size*.68).toFixed(1)}" fill="${c}"/>`;
  s+=label(outer[j],x,y+size*.36,{size,color:c?'#0b1122':RC.navy,anchor:'middle',weight:700,opacity:dimOuter&&!c?1-dimOuter:1});}
 let t='';
 if(inner&&ig>0){
  const r=iR??R-band/2-iband/2-10;
  t+=annulus(cx,cy,r-iband/2,r+iband/2,{fill:RC.gold,stroke:RC.goldEdge});
  for(let k=0;k<26;k++){const a=ringXY(cx,cy,r-iband/2,k+rot+.5),b=ringXY(cx,cy,r+iband/2,k+rot+.5);t+=line(a[0],a[1],b[0],b[1],{color:RC.goldEdge,w:1.5});}
  for(let k=0;k<26;k++){const [x,y]=ringXY(cx,cy,r,k+rot),c=ihl[k];
   if(c)t+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(isize*.66).toFixed(1)}" fill="${c}"/>`;
   t+=label(inner[k],x,y+isize*.36,{size:isize,color:c?'#0b1122':RC.brown,anchor:'middle',weight:700});}
  s+=fade(ig,t);
 }
 if(center)s+=`<circle cx="${cx}" cy="${cy}" r="10" fill="${RC.goldEdge}"/>`;
 return fade(g,s);
}
// 1目盛りずつ進む印（黄の輪）。pos は連続の位置。trail：通った目盛りに 1,2,3… の数（外側に）
export function ringMark(cx,cy,R,pos,{color=HC,mark='#e8590c',r=31,w=7,from=null,count=0,cR,csize=36,g=1}={}){
 if(g<=0)return '';
 const [x,y]=ringXY(cx,cy,R,pos);let s=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="none" stroke="${mark}" stroke-width="${w}"/>`;
 if(from!==null){const n=Math.floor(count+1e-6);for(let k=1;k<=n;k++){const [qx,qy]=ringXY(cx,cy,cR??R+70,from+k*Math.sign(pos-from||1));s+=label(String(k),qx,qy+csize*.36,{size:csize,color,anchor:'middle',weight:700});}}
 return fade(g,s);
}
// 輪の外側の矢（from から to へ、弧）。進む向きを見せる
export function ringArc(cx,cy,r,from,to,{color=HC,w=5,p=1,head=16}={}){
 if(p<=0)return '';const n=24,pts=[];for(let k=0;k<=n;k++)pts.push(ringXY(cx,cy,r,mix(from,from+(to-from)*p,k/n)));
 let s=draw(pts,1,{color,w});const a=pts.at(-2),b=pts.at(-1);if(Math.hypot(b[0]-a[0],b[1]-a[1])>.5)s+=arrow(a[0],a[1],b[0],b[1],{color,w,head});return s;
}
// 時計の文字盤（たとえ話）。hand：針の位置（時、連続）
export function clockFace(cx,cy,R,{hand=null,g=1,hl={}}={}){
 if(g<=0)return '';
 let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#f4efe0" stroke="${RC.creamEdge}" stroke-width="6"/>`;
 for(let h=1;h<=12;h++){const a=h/12*PI2,x=cx+(R-52)*Math.sin(a),y=cy-(R-52)*Math.cos(a),c=hl[h];
  if(c)s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="30" fill="${c}"/>`;
  s+=label(String(h),x,y+15,{size:42,color:RC.navy,anchor:'middle',weight:700});}
 if(hand!==null){const a=hand/12*PI2;s+=line(cx,cy,cx+(R-100)*Math.sin(a),cy-(R-100)*Math.cos(a),{color:'#d9480f',w:10});}
 s+=`<circle cx="${cx}" cy="${cy}" r="12" fill="${RC.navy}"/>`;
 return fade(g,s);
}

// ================= 文字の帯（A〜M、N〜Z の 2段） =================
export const stripXY=(j,{x0=68,y0=200,dx=72,dy=150}={})=>[x0+(j%13)*dx,y0+Math.floor(j/13)*dy];
export function strip({x0=68,y0=200,dx=72,dy=150,hl={},g=1,size=44,dim=0}={}){
 if(g<=0)return '';let s='';
 for(let j=0;j<26;j++){const [x,y]=stripXY(j,{x0,y0,dx,dy}),c=hl[j];
  s+=rect(x-30,y-46,60,64,{fill:c??'#131f38',fo:c?.25:.9,stroke:c??C.faint,sw:c?3:2,rx:10})+label(ABC[j],x,y,{size,color:c??C.ink,anchor:'middle',weight:700,opacity:dim&&!c?1-dim:1});}
 return fade(g,s);
}
// 帯の上を 1目盛りずつ跳ぶ印。pos 連続、from から。通った目盛りの上に 1,2,3
export function stripHop(pos,from,{o={},color=HC,g=1}={}){
 if(g<=0)return '';
 const k=Math.floor(pos),f=pos-k,a=stripXY(Math.min(25,k),o),b=stripXY(Math.min(25,k+1),o);
 const x=mix(a[0],b[0],f),y=Math.min(a[1],b[1])-66-Math.sin(Math.PI*f)*36;
 let s=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="${color}"/>`;
 for(let m=1;m<=Math.floor(pos-from+1e-6);m++){const [qx,qy]=stripXY(from+m,o);s+=label(String(m),qx,qy-96,{size:36,color,anchor:'middle',weight:700});}
 return fade(g,s);
}

// ================= 棒グラフ（26本） =================
export function bars(vals,{x=70,y=760,w=860,h=380,max=14,g=1,col='#8aa0c4',hl={},lab=ABC,lsize=36,grow=1,dimOthers=0}={}){
 if(g<=0)return '';
 const bw=w/26;let s=line(x-6,y,x+w+6,y,{color:C.dim,w:2});
 vals.forEach((v,i)=>{const hh=h*Math.min(v,max)/max*grow,c=hl[i]??col;
  s+=rect(x+i*bw+bw*.12,y-hh,bw*.76,hh,{fill:c,fo:hl[i]?.95:(dimOthers?.35:.75),stroke:'none',rx:3});
  s+=label(lab[i],x+i*bw+bw/2,y+40,{size:lsize,color:hl[i]?c:C.dim,anchor:'middle',weight:700});});
 return fade(g,s);
}
export const barTop=(vals,i,{x=70,y=760,w=860,h=380,max=14}={})=>[x+(i+.5)*w/26,y-h*Math.min(vals[i],max)/max];

// ================= 等幅の文字・小物 =================
export function mono(t,x,y,{size=44,color=C.ink,cw=.72,g=1,cols=null,anchor='start',weight=700}={}){
 const a=[...t],w=size*cw,x0=anchor==='middle'?x-a.length*w/2:x;let s='';
 a.forEach((c,i)=>{if(c!==' ')s+=label(c,x0+i*w+w/2,y,{size,color:cols?.[i]??color,anchor:'middle',weight});});return fade(g,s);
}
export const monoX=(t,i,x,{size=44,cw=.72,anchor='start'}={})=>{const w=size*cw,x0=anchor==='middle'?x-[...t].length*w/2:x;return x0+i*w+w/2;};
export const CIPH='#ffb380';              // 暗号の文字の色（橙）
export const PLAIN=C.ink;                 // 元の文字の色
export const box=(x,y,w,h,{col='#8aa0c4',fo=.12,sw=3,rx=18}={})=>rect(x,y,w,h,{fill:'#131f38',fo:.95,stroke:col,sw,rx})+rect(x,y,w,h,{fill:col,fo,stroke:'none',rx});
// 文字の札（四角に1文字）
export function cell(L,x,y,{size=48,color=C.ink,bg='#131f38',edge=C.faint,w=62,h=72,g=1,sw=2}={}){
 return fade(g,rect(x-w/2,y-h/2,w,h,{fill:bg,fo:.95,stroke:edge,sw,rx:10})+label(L,x,y+size*.36,{size,color,anchor:'middle',weight:700}));
}
// 人（名札つき）。たとえ話の教室
export function person(x,y,{col='#8aa0c4',tagText='',tagCol=C.ink,g=1,s=1}={}){
 if(g<=0)return '';
 let o=`<circle cx="${x}" cy="${y-120*s}" r="${34*s}" fill="${col}"/>`+`<path d="M${x-58*s} ${y} Q${x-58*s} ${y-78*s} ${x} ${y-80*s} Q${x+58*s} ${y-78*s} ${x+58*s} ${y} Z" fill="${col}"/>`;
 if(tagText){const w=Math.max(96,jw(tagText)*36+20);o+=rect(x-w/2,y-62*s,w,50,{fill:'#f4efe0',fo:1,stroke:'#8a7a55',sw:2,rx:8})+label(tagText,x,y-62*s+38,{size:36,color:tagCol,anchor:'middle',weight:700});}
 return fade(g,o);
}
export function bubble(x,y,{g=1,w=70,h=46,col='#edf4ff'}={}){
 if(g<=0)return '';
 return fade(g,`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="20" fill="${col}" fill-opacity=".9"/><path d="M${x-8} ${y+h/2-2} L${x-16} ${y+h/2+14} L${x+6} ${y+h/2-2} Z" fill="${col}" fill-opacity=".9"/>`+dot(x-16,y,4,'#0b1122')+dot(x,y,4,'#0b1122')+dot(x+16,y,4,'#0b1122'));
}
export {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard,jw,ORANGE,GREEN,RED_,PURPLE,CYAN,AMBER,fuda};
