// 「机の上」の画面（縦長 1080×1920）。技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）から。
// frame-vert.mjs の vertFrame が、scene に deskFrame がある動画だけ、ここに回す（他の動画は通らない。1画素も変わらない）。
// 図のキーは持たない（-diagrams で終わらないので自動読み込みされない）。
//
// 割り付け（「無限の机」の分析の数値に合わせた）
//   全画面：Blender の机の上のコマ（$EM_FILM_CACHE/blender/desk/NNNNN.jpg、NNNNN＝round(t×30)）
//   y 120–230：最初の 2秒だけ、シリーズ名と題を小さく（2.0〜2.5秒で消える）。題の大きな帯は付けない
//   左上 y 128：年と場所の札（36px）／右上 y 128：得点（点が入る時だけ、小さく）
//   字幕：画面の高さの 60〜72％（行の頭 y 1250・1330）。白の太字 60px、薄い影。2行まで、1行 12字前後。
//         声がその区切りを言い始める時刻に、次の区切りへ替わる（cue の cap と capReading、phrase-times.json）
//         字幕の上に、話す人の色の印と名前（カイ＝青、ミオ＝桃色）
//   注記：y 1440 あたり（36px）。y>1600 と右端 x>940 には大事な物を置かない
//   顔：節目で画面いっぱいのアップ（face.small のときは右上の丸い枠）
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {esc,clamp} from './anim.mjs';
import {voiceMap,normKana} from './yt1-chain-00bx-common.mjs';
import {face,FACE_COL} from './desk-faces.mjs';
import {overlay1_1v4} from './desk-1-1v4-overlay.mjs';
import {overlay1_1v5} from './desk-1-1v5-overlay.mjs';   // 第5版（ys-chain-1-1v5）から
import {overlay1_1v6} from './desk-1-1v6-overlay.mjs';   // 第6版（ys-chain-1-1v6）から
import {overlay1_1gpt} from './desk-1-1gpt-overlay.mjs';
import {overlay1_2v1} from './desk-1-2v1-overlay.mjs';
import {overlay1_2v2} from './desk-1-2v2-overlay.mjs';   // 第2版（ys-chain-1-2v2、Claude）から
import {overlayB1v1} from './desk-b1v1-overlay.mjs';
import {overlayC1v1} from './desk-c1v1-overlay.mjs';
import {overlayD1v1} from './desk-d1v1-overlay.mjs';
import {overlayE1v1} from './desk-e1v1-overlay.mjs';

export const DW=1080,DH=1920,DFPS=30;
export const DCAP={size:66,lh:84,y1:1292,y2:[1250,1334],x:540,max:12.6};
const SP={kai:{name:'カイ',color:'#7fa8ff'},mio:{name:'ミオ',color:'#ff8fb1'}};
const OVERLAYS={'1-1v4':overlay1_1v4,'1-1v5':overlay1_1v5,'1-1v6':overlay1_1v6,'1-1gpt':overlay1_1gpt,'1-2v1':overlay1_2v1,'1-2v2':overlay1_2v2};
OVERLAYS['b1v1']=overlayB1v1;
OVERLAYS['c1v1']=overlayC1v1;
OVERLAYS['d1v1']=overlayD1v1;
OVERLAYS['e1v1']=overlayE1v1;
const n=v=>Number(v.toFixed(1));
const sm=p=>{p=clamp(p);return p*p*(3-2*p);};
export const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);

// ---------- 背景のコマ ----------
const root=()=>(process.env.EM_FILM_CACHE??'')+'/blender';
let frameCache={j:-1,b64:''},avail=null;
function bgFrame(t){
 const j=Math.round(t*DFPS),dir=root()+'/desk';
 let f=`${dir}/${String(j).padStart(5,'0')}.jpg`;
 if(!existsSync(f)){
  // 下見だけ：DESK_ALLOW_MISSING=1 のとき、いちばん近いコマ（preview も含む）を使う。本番では止める
  if(process.env.DESK_ALLOW_MISSING!=='1')throw Error(`desk-frame: 机のコマが無い ${f}（scripts/blender/desk_1_1v4.py・desk_1_1v5.py を書き出す）`);
  if(!avail){avail=[];for(const d of ['desk','preview'])if(existsSync(root()+'/'+d))for(const x of readdirSync(root()+'/'+d))if(x.endsWith('.jpg'))avail.push([parseInt(x),root()+'/'+d+'/'+x]);avail.sort((a,b)=>a[0]-b[0]);}
  if(!avail.length)return '';
  let best=avail[0];for(const a of avail)if(Math.abs(a[0]-j)<Math.abs(best[0]-j))best=a;f=best[1];
 }
 if(frameCache.f!==f)frameCache={f,b64:readFileSync(f).toString('base64').replace(/[NIu]/g,c=>c==='N'?'%4E':c==='I'?'%49':'%75')};
 return `<image x="0" y="0" width="${DW}" height="${DH}" preserveAspectRatio="none" href="data:image/jpeg;base64,${frameCache.b64}"/>`;
}
// ---------- アンカー（3D の点の画面の位置） ----------
let ANC=null;
export function anchor(name,t){
 if(ANC===null){const f=root()+'/desk/anchors.json';ANC=existsSync(f)?JSON.parse(readFileSync(f,'utf8')).anchors:{};}
 const a=ANC[name];if(!a)return null;const j=Math.max(0,Math.min(a.length-1,Math.round(t*DFPS)));return a[j];
}

// ---------- 字幕の区切りの時刻 ----------
const KANA_ONLY=s=>normKana(s).replace(/[^ァ-ヴ]/g,'');
export function chunkTimes(q,cap){
 // 戻り値：各区切りの始まり（動画の頭からの秒）。phrase-times の声の時刻（無ければ読みの長さの割合）
 const ctx={cue:q,t:0,dur:cap.end-cap.start,clip:null};
 const m=voiceMap(ctx),parts=q.capReading??[q.reading];
 const lens=parts.map(p=>KANA_ONLY(p).length),tot=lens.reduce((a,b)=>a+b,0);
 const s=m.s.replace(/[^ァ-ヴ]/g,'');
 const out=[cap.start];let acc=0;
 for(let k=1;k<parts.length;k++){acc+=lens[k-1];
  const i=Math.round(acc*(m.s.length/Math.max(1,tot)));               // 文字数がずれたときも、割合で近い所
  const tt=(tot===m.s.length?m.t[acc]:m.t[Math.min(m.t.length-1,i)])??(m.end??0);
  out.push(cap.start+Math.max(0,tt-.06));}
 return {starts:out,exact:tot===m.s.length&&s.length===m.s.length};
}
function capLines(q,k){return q.cap?q.cap[k]:[q.subtitle];}

// ---------- 字幕を描く ----------
const FONT=`font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"`;
function capText(s,x,y,{size=DCAP.size,color='#ffffff',weight=800,anchor='middle',op=1}={}){
 const e=esc(s);
 return `<text x="${x}" y="${y+4}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="#000" stroke="#000" stroke-width="10" opacity="${.62*op}" filter="url(#dsh)">${e}</text>`
  +`<text x="${x}" y="${y}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${color}" stroke="#1a1208" stroke-opacity=".6" stroke-width="7" stroke-linejoin="round" paint-order="stroke" opacity="${op}">${e}</text>`;
}
export function pill(s,x,y,{size=36,color='#fff',bg='#141a2b',bo=.78,anchor='start',weight=700,border=null,op=1}={}){
 const w=jw(s)*size+36,h=size+22,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return `<g opacity="${n(op)}"><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="${h/2}" fill="${bg}" fill-opacity="${bo}"${border?` stroke="${border}" stroke-width="3"`:''}/><text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`;
}
function captions(q,cap,t){
 const {starts}=chunkTimes(q,cap);let k=0;for(let i=0;i<starts.length;i++)if(t>=starts[i])k=i;
 const rows=capLines(q,k),sp=SP[q.speaker]??SP.kai;
 const ys=rows.length===1?[DCAP.y1]:DCAP.y2;
 const pop=sm((t-starts[k])/.12);
 let s=rows.map((r,i)=>capText(r,DCAP.x,ys[i],{op:.8+.2*pop})).join('');
 // 名前の印（字幕の上、中央）
 const ny=ys[0]-82,nw=jw(sp.name)*38+64;
 s+=`<rect x="${n(DCAP.x-nw/2)}" y="${ny-28}" width="${n(nw)}" height="52" rx="26" fill="#10131c" fill-opacity=".55"/><circle cx="${n(DCAP.x-nw/2+26)}" cy="${ny-2}" r="11" fill="${sp.color}"/>`
  +`<text x="${n(DCAP.x+12)}" y="${ny+11}" ${FONT} font-size="38" font-weight="800" text-anchor="middle" fill="${sp.color}">${sp.name}</text>`;
 return s;
}
// ---------- 顔 ----------
export function faceLayer(fc,t,cs,ce,q){
 if(!fc)return '';
 const dur=ce-cs;
 const t0=fc.at?cs+fc.atT:cs+(fc.a??0)*dur,t1=fc.at?ce:cs+(fc.b??1)*dur;
 let s='';
 const one=(who,ex,a,b)=>{
  if(t<a||t>b+.12)return '';
  const u=sm((t-a)/.18)*(1-sm((t-b)/.12));
  if(fc.small){ // 右上の丸い枠
   const cx=860,cy=380,r=120*u;const c=FACE_COL[who];
   return `<g opacity="${n(u)}"><circle cx="${cx}" cy="${cy}" r="${n(r+8)}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${n(r)}" fill="${c.bg2}"/><clipPath id="fc"><circle cx="${cx}" cy="${cy}" r="${n(r)}"/></clipPath><g clip-path="url(#fc)">${face(who,ex,cx,cy+18,.95*u)}</g></g>`;
  }
  const c=FACE_COL[who],sc=2.9*(.8+.2*u)+.08*Math.sin((t-a)*3);
  let bg=`<rect width="${DW}" height="${DH}" fill="url(#fbg_${who})"/>`;
  for(let k=0;k<36;k++){const an=k/36*Math.PI*2+(t-a)*.25,r0=560,r1=1500;bg+=`<path d="M${n(540+r0*Math.cos(an))} ${n(820+r0*Math.sin(an))} L${n(540+r1*Math.cos(an+.03))} ${n(820+r1*Math.sin(an+.03))} L${n(540+r1*Math.cos(an-.03))} ${n(820+r1*Math.sin(an-.03))} Z" fill="#fff" opacity=".13"/>`;}
  return `<g opacity="${n(u)}">${bg}${face(who,ex,540,820,sc)}</g>`;
 };
 s+=one(fc.who,fc.ex,t0,t1);
 if(fc.then)s+=one(fc.then.who,fc.then.ex,t1,ce);
 return s;
}
export const faceDefs=`<radialGradient id="fbg_kai" cx="50%" cy="43%" r="70%"><stop offset="0" stop-color="${FACE_COL.kai.bg2}"/><stop offset="1" stop-color="${FACE_COL.kai.bg1}"/></radialGradient><radialGradient id="fbg_mio" cx="50%" cy="43%" r="70%"><stop offset="0" stop-color="${FACE_COL.mio.bg2}"/><stop offset="1" stop-color="${FACE_COL.mio.bg1}"/></radialGradient>`;

// ---------- 1コマ ----------
export function deskFrame(c,s,t){
 const k=Math.max(0,s.captions.findLastIndex(cap=>cap.start<=t)),cap=s.captions[k],q=s.cues[k];
 if(!q)throw Error(`Missing cue ${c.id}/${s.index}/${k}`);
 const ov=OVERLAYS[s.deskFrame];if(!ov)throw Error(`Unknown deskFrame ${s.deskFrame}`);
 const ctx={t,clip:c,scene:s,cue:q,cap,k,anchor:n=>anchor(n,t)};
 // 顔の時刻（at：声の言葉）
 let fc=q.face?{...q.face}:null;
 if(fc?.at){const m=voiceMap({cue:q,t:0,dur:cap.end-cap.start});const nk=normKana(fc.at);const i=m.s.indexOf(nk);if(i<0)throw Error(`face.at「${fc.at}」が声に無い：${q.subtitle}`);fc.atT=m.t[i];}
 const full=fc&&!fc.small&&(()=>{const dur=cap.end-cap.start,a=fc.at?cap.start+fc.atT:cap.start+(fc.a??0)*dur,b=fc.at?cap.end:cap.start+(fc.b??1)*dur;return t>=a+.18&&t<=b&&!fc.then||(fc.then&&t>=a+.18);})();
 let body=bgFrame(t);
 if(!full)body+=ov(ctx);
 body+=faceLayer(fc,t,cap.start,cap.end,q);
 // 最初の 2秒：シリーズ名と題（小さく）
 const g=1-sm((t-2.0)/.5);
 if(g>0)body+=`<g opacity="${n(g)}">${pill(c.series??'',48,150,{size:36,color:'#e9edf7'})}${pill(c.title,48,222,{size:44,color:'#ffffff'})}</g>`;
 body+=captions(q,cap,t);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${DW}" height="${DH}"><defs><filter id="dsh" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>${faceDefs}</defs><rect width="${DW}" height="${DH}" fill="#2a2018"/>${body}</svg>`;
}
