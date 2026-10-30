// 縦長（vert-v1）の「掛け合い」の字幕の部品。cue に speaker（'kai'｜'mio'）がある動画だけに効く。
// frame-vert.mjs は、clip のどの cue にも speaker が無いときは、今まで通りの字幕・表記を描く（1画素も変わらない）。
// 最初の使用：技術の疑問の鎖 序章2-1 第3版（ys-chain-00b1v3）。
//
// 割り付け（掛け合いのときだけ）
//   区切り線 y 1312 を x 40–668 に縮め、右の x 690–940 に二人の印（色の丸＋名前 36px）。話している方を明るく、他方を暗く。
//   字幕は 16px 下げる（行の頭 y 1388、1452、1516、1580。4行目の下端は約 1592 で、下端の y>1600 にかからない）。
//   字幕の1行目の頭に、話す人の色の丸と名前（40px 太字）。1行目の幅は その分（PREFIX 字幅）短い。
//   画面下の表記は「音声：VOICEVOX Nemo 男声1・女声1」。
// 声：speaker の Nemo の番号は VOICE（scripts/render-dialogue-audio.py が utterance.speaker で使う）。
import {C,label,line,fade} from './anim.mjs';

export const SPEAKERS={
 kai:{name:'カイ',color:'#7fa8ff',voice:10001,engine:'男声1'},
 mio:{name:'ミオ',color:'#ff8fb1',voice:10005,engine:'女声1'},
};
export const DLG_ORDER=['kai','mio'];
export const DLG={y0:1388,lh:64,size:48,x:60,prefix:2.9,nameSize:40,chipY:1312,lineEnd:668};
export const isDialogue=c=>!!c?.scenes?.some(s=>s.cues?.some(q=>q.speaker));
export const speakerOf=q=>SPEAKERS[q?.speaker??'kai']??SPEAKERS.kai;

// 字幕の行：1行目は prefix 字幅だけ短い。lines があれば、それを使う（つなぐと字幕と同じ）。
export function dialogueRows(text,q,{wrapJa,jw,max}){
 if(q?.lines){if(q.lines.join('')!==text)throw Error(`cue.lines must join to the subtitle: ${text}`);return q.lines;}
 // 1行目を短くするため、全角空白を頭に足して折り、1行目から外す
 const pad='　'.repeat(Math.ceil(DLG.prefix));
 const rows=wrapJa(pad+text,max);
 if(!rows[0].startsWith(pad)){return wrapJa(text,max);}
 rows[0]=rows[0].slice(pad.length);if(!rows[0])rows.shift();
 return rows;
}
// 行の幅の上限（lint 用）：1行目は max−prefix
export const rowMax=(i,max)=>i===0?max-DLG.prefix:max;

export function dialogueCaptions(rows,q){
 const sp=speakerOf(q),y=DLG.y0,cx=DLG.x+14;
 let s=`<circle cx="${cx}" cy="${y-16}" r="14" fill="${sp.color}"/>`+label(sp.name,DLG.x+36,y-2,{size:DLG.nameSize,color:sp.color,weight:700});
 const x1=DLG.x+DLG.prefix*DLG.size;
 s+=rows.map((v,i)=>label(v,i===0?x1:DLG.x,y+i*DLG.lh,{size:DLG.size,weight:500})).join('');
 return s;
}
// 区切り線と二人の印
export function dialogueChips(q){
 const cur=q?.speaker??'kai';
 let s=line(40,DLG.chipY,DLG.lineEnd,DLG.chipY,{color:'#28364e',w:2});
 let x=700;
 for(const k of DLG_ORDER){const sp=SPEAKERS[k],on=k===cur;
  if(on)s+=`<circle cx="${x+16}" cy="${DLG.chipY}" r="25" fill="none" stroke="${sp.color}" stroke-width="3" opacity=".55"/>`;
  s+=`<circle cx="${x+16}" cy="${DLG.chipY}" r="${on?18:15}" fill="${sp.color}" fill-opacity="${on?1:.28}"/>`;
  s+=label(sp.name,x+46,DLG.chipY+13,{size:36,color:on?sp.color:C.faint,weight:on?700:500});
  x+=130;}
 return s;
}
export function dialogueCredit(c){
 const used=DLG_ORDER.filter(k=>c.scenes.some(s=>s.cues.some(q=>(q.speaker??'kai')===k))).map(k=>SPEAKERS[k].engine);
 return label(`音声：VOICEVOX Nemo ${used.join('・')}`,48,1690,{size:36,color:C.dim,opacity:.7});
}
