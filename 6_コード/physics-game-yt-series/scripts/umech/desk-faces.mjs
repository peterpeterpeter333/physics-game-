// カイとミオの、表情のある簡単な顔（2D の立ち絵の差し替え）。技術の疑問の鎖 1-1 第4版（ys-chain-1-1v4）から。
// 図のキーは持たない（自動読み込みされない）。face(who, ex, cx, cy, s)：中心 (cx,cy)、s＝大きさ（1 で顔の半径 100px）。
// 表情 ex：tokui（得意）・komaru（困る）・odoroku（驚く）・hirameku（ひらめく）・jitome（じと目）・gakkuri（がっくり）・
//   udemakuri（腕まくり）・kirakira（きらきら）。色：カイ＝青、ミオ＝桃色（字幕の名前の色と同じ系統）。
export const FACE_COL={kai:{hair:'#3d63c9',hair2:'#2b4aa0',bg1:'#2a4d9e',bg2:'#7fa8ff',name:'カイ'},mio:{hair:'#e8789c',hair2:'#c95479',bg1:'#a8406a',bg2:'#ff9fbf',name:'ミオ'}};
export const EXPRESSIONS=['tokui','komaru','odoroku','hirameku','jitome','gakkuri','udemakuri','kirakira'];
const SKIN='#f8d6bb',SKIN2='#e9b48f',INK='#2a1a14';
const n=v=>Number(v.toFixed(1));
function eyes(ex,who){
 const L=-36,R=36,y=4;let s='';
 const open=(x,r=13,hl=true,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${r*.82}" ry="${ry??r}" fill="${INK}"/>`+(hl?`<circle cx="${x+4}" cy="${y-5}" r="${r*.32}" fill="#fff"/>`:'');
 if(ex==='tokui')s+=[L,R].map(x=>`<path d="M${x-14} ${y+4} Q${x} ${y-12} ${x+14} ${y+4}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('');
 else if(ex==='jitome')s+=[L,R].map(x=>`<path d="M${x-15} ${y-2} H${x+15}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M${x-12} ${y-1} Q${x} ${y+12} ${x+12} ${y-1} Z" fill="${INK}"/>`).join('');
 else if(ex==='gakkuri')s+=[L,R].map(x=>`<path d="M${x-14} ${y} Q${x} ${y+12} ${x+14} ${y}" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`).join('');
 else if(ex==='odoroku')s+=[L,R].map(x=>`<circle cx="${x}" cy="${y}" r="16" fill="#fff" stroke="${INK}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="5" fill="${INK}"/>`).join('');
 else if(ex==='kirakira')s+=[L,R].map(x=>open(x,15,false)+star(x,y,10,'#fff6a8')).join('');
 else if(ex==='hirameku')s+=[L,R].map(x=>open(x,15)+`<circle cx="${x-4}" cy="${y+5}" r="3" fill="#fff"/>`).join('');
 else s+=[L,R].map(x=>open(x,13)).join('');
 return s;
}
function star(x,y,r,col){let p='';for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,q=k%2?r*.42:r;p+=`${n(x+q*Math.cos(a))},${n(y+q*Math.sin(a))} `;}return `<polygon points="${p}" fill="${col}"/>`;}
function brows(ex){
 const b=(x,a,dy=0)=>`<path d="M${x-15} ${-28+dy+a} L${x+15} ${-28+dy-a}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
 if(ex==='komaru'||ex==='gakkuri')return b(-36,-7)+b(36,7);           // 八の字
 if(ex==='udemakuri'||ex==='jitome')return b(-36,6,2)+b(36,-6,2);       // 吊り上がる
 if(ex==='odoroku')return b(-36,0,-12)+b(36,0,-12);
 if(ex==='tokui')return b(-36,3,-4)+b(36,-3,-4);
 return b(-36,0,-4)+b(36,0,-4);
}
function mouth(ex){
 const m={tokui:`<path d="M-22 40 Q2 54 26 34" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  komaru:`<path d="M-20 44 q7 -7 14 0 t14 0 t14 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  odoroku:`<ellipse cx="0" cy="44" rx="11" ry="15" fill="#7a2a2a" stroke="${INK}" stroke-width="4"/>`,
  hirameku:`<path d="M-24 34 Q0 66 24 34 Z" fill="#7a2a2a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
  jitome:`<path d="M-16 44 H16" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  gakkuri:`<path d="M-18 50 Q0 36 18 50" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  udemakuri:`<path d="M-24 36 Q0 58 24 36 Z" fill="#fff" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  kirakira:`<path d="M-26 32 Q0 68 26 32 Z" fill="#7a2a2a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`};
 return m[ex]??m.tokui;
}
function hairBack(who,c){
 if(who==='mio')return `<circle cx="-112" cy="10" r="34" fill="${c.hair}"/><circle cx="112" cy="10" r="34" fill="${c.hair}"/><path d="M-118 30 Q-140 110 -96 140 Q-104 80 -84 40 Z" fill="${c.hair}"/><path d="M118 30 Q140 110 96 140 Q104 80 84 40 Z" fill="${c.hair}"/>`;
 return '';
}
function hairFront(who,c){
 if(who==='kai')return `<path d="M-104 -6 Q-110 -96 -30 -112 L-18 -136 L4 -112 L30 -138 L42 -108 Q108 -96 104 -6 Q84 -58 40 -62 L26 -40 L10 -64 Q-18 -44 -40 -66 L-58 -40 Q-80 -60 -104 -6 Z" fill="${c.hair}" stroke="${c.hair2}" stroke-width="4" stroke-linejoin="round"/>`;
 return `<path d="M-106 10 Q-112 -104 0 -110 Q112 -104 106 10 Q96 -40 70 -52 Q60 -24 40 -30 Q30 -56 10 -50 Q-6 -24 -26 -32 Q-40 -58 -62 -50 Q-90 -40 -106 10 Z" fill="${c.hair}" stroke="${c.hair2}" stroke-width="4" stroke-linejoin="round"/><circle cx="70" cy="-78" r="10" fill="#fff6a8"/>`;
}
function extras(ex,c){
 let s='';
 if(ex==='komaru')s+=`<path d="M86 -40 q14 22 0 30 q-14 -8 0 -30 Z" fill="#8fd3ff" stroke="#2a6fa8" stroke-width="3"/>`;
 if(ex==='odoroku')s+=[[-120,-90,-150,-130],[120,-90,150,-130],[0,-128,0,-170]].map(([a,b,c2,d])=>`<path d="M${a} ${b} L${c2} ${d}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`).join('');
 if(ex==='hirameku')s+=`<g transform="translate(110 -128)"><circle r="30" fill="#ffe066" stroke="#c9a400" stroke-width="4"/><rect x="-13" y="26" width="26" height="18" rx="4" fill="#9aa"/>${[0,1,2,3,4,5].map(k=>{const a=-Math.PI*(k+.5)/6;return `<path d="M${n(40*Math.cos(a))} ${n(40*Math.sin(a))} L${n(58*Math.cos(a))} ${n(58*Math.sin(a))}" stroke="#ffe066" stroke-width="6" stroke-linecap="round"/>`;}).join('')}</g>`;
 if(ex==='kirakira')s+=star(-120,-100,22,'#fff6a8')+star(130,-60,16,'#fff6a8')+star(110,90,12,'#fff6a8');
 if(ex==='gakkuri')s+=`<path d="M-80 -100 Q0 -60 80 -100 L80 -20 Q0 0 -80 -20 Z" fill="#2a3a6a" opacity=".45"/>`+[-60,-30,0,30,60].map(x=>`<path d="M${x} -96 V-40" stroke="#2a3a6a" stroke-width="5" opacity=".6"/>`).join('');
 if(ex==='tokui')s+=star(118,-70,14,'#fff6a8');
 return s;
}
function arm(c){   // 腕まくり：右手のこぶしを上げ、袖をまくった腕
 return `<g transform="translate(120 70) rotate(-25)"><rect x="-26" y="-10" width="52" height="120" rx="24" fill="${SKIN}" stroke="${SKIN2}" stroke-width="4"/><rect x="-34" y="60" width="68" height="40" rx="14" fill="${c.hair2}"/><path d="M-34 70 H34 M-34 84 H34" stroke="#fff" stroke-width="4" opacity=".6"/><circle cx="0" cy="-26" r="34" fill="${SKIN}" stroke="${SKIN2}" stroke-width="4"/><path d="M-20 -40 h40 M-22 -26 h44 M-20 -12 h40" stroke="${SKIN2}" stroke-width="4"/></g>`;
}
export function face(who,ex,cx,cy,s=1){
 const c=FACE_COL[who];
 let g=hairBack(who,c);
 g+=`<path d="M-100 0 Q-100 112 0 118 Q100 112 100 0 Q100 -100 0 -104 Q-100 -100 -100 0 Z" fill="${SKIN}" stroke="${SKIN2}" stroke-width="4"/>`;
 g+=`<ellipse cx="-58" cy="30" rx="16" ry="9" fill="#ff8a8a" opacity="${who==='mio'?.55:.3}"/><ellipse cx="58" cy="30" rx="16" ry="9" fill="#ff8a8a" opacity="${who==='mio'?.55:.3}"/>`;
 g+=eyes(ex,who)+brows(ex)+mouth(ex)+hairFront(who,c)+extras(ex,c);
 if(ex==='udemakuri')g+=arm(c);
 return `<g transform="translate(${n(cx)} ${n(cy)}) scale(${n(s*100)/100})">${g}</g>`;
}
