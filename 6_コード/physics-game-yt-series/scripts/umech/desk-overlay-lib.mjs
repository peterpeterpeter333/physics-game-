// 1-1 第6版から切り出した机上の 2D 描画。座標・色・寸法は原版と同じ。
import {esc,clamp} from './anim.mjs';
const n=v=>Number(v.toFixed(1));
const sm=p=>{p=clamp(p);return p*p*(3-2*p);};
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
const FONT=`font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"`;
const ORANGE='#ffa04a',BLUE='#5b9bff',KAI='#7fa8ff',MIO='#ff8fb1';
export function pill(s,x,y,{size=36,color='#fff',bg='#141a2b',bo=.8,anchor='start',weight=700,border=null,op=1}={}){
 if(op<=.003)return '';
 const w=jw(s)*size+36,h=size+22,x0=anchor==='middle'?x-w/2:anchor==='end'?x-w:x;
 return `<g opacity="${n(op)}"><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="${h/2}" fill="${bg}" fill-opacity="${bo}"${border?` stroke="${border}" stroke-width="4"`:''}/><text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="${weight}" text-anchor="middle" fill="${color}">${esc(s)}</text></g>`;
}
// 紙の札（クリーム色の紙、こげ茶の字、少しの影）。parts＝[[文字,色],…]
export function paper(parts,x,y,{size=42,op=1,anchor='start',rot=0,mark=null}={}){
 if(op<=.003)return '';
 const w=parts.reduce((a,[s])=>a+jw(s)*size,0)+44,h=size+30,x0=anchor==='middle'?x-w/2:x;
 // 1つの text に tspan で色を付ける（字の幅は字体に任せる。部分ごとに置くと半角の幅の見積もりで重なる）
 const t=`<text x="${n(x0+w/2)}" y="${n(y+size*.36)}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="#3b2412">${parts.map(([s,col])=>`<tspan fill="${col??'#3b2412'}">${esc(s)}</tspan>`).join('')}</text>`;
 const dy=8*(1-op);
 return `<g opacity="${n(op)}" transform="translate(0 ${n(dy)}) rotate(${rot} ${n(x0+w/2)} ${n(y)})"><rect x="${n(x0+5)}" y="${n(y-h/2+7)}" width="${n(w)}" height="${h}" rx="8" fill="#2a1406" opacity=".45"/><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="8" fill="#f4e8cc" stroke="#b8925a" stroke-width="3"/>${mark?`<circle cx="${n(x0+w-4)}" cy="${n(y-h/2+4)}" r="9" fill="${mark}" stroke="#fff" stroke-width="2"/>`:''}${t}</g>`;
}
// 三つの見方の札：木の板（机と同じ色の木目）に紙の札を貼った物。左に色の印（具体例＝水色、たとえ話＝桃色、破る側から＝橙）
const VIEWCOL={'具体例':'#38c6d9','たとえ話':'#ff9ce6','破る側から':'#ff8f6b'};
export function viewCard(kind,op){
 if(op<=.003)return '';
 const size=40,label='見方：'+kind,w=jw(label)*size+96,h=76,x0=36,y0=176,c=VIEWCOL[kind];
 let s=`<g opacity="${n(op)}"><rect x="${x0+5}" y="${y0+7}" width="${n(w)}" height="${h}" rx="10" fill="#1d0f05" opacity=".5"/>`
  +`<rect x="${x0}" y="${y0}" width="${n(w)}" height="${h}" rx="10" fill="#8a5a32" stroke="#5b3a22" stroke-width="4"/>`;
 for(let k=0;k<4;k++)s+=`<path d="M${x0+6} ${y0+14+k*16} Q${n(x0+w/2)} ${y0+8+k*16+(k%2?6:-4)} ${n(x0+w-6)} ${y0+16+k*16}" fill="none" stroke="#6f4526" stroke-width="3" opacity=".55"/>`;
 s+=`<rect x="${x0+14}" y="${y0+10}" width="${n(w-28)}" height="${h-20}" rx="6" fill="#f4e8cc"/>`
  +`<rect x="${x0+14}" y="${y0+10}" width="22" height="${h-20}" rx="4" fill="${c}"/>`
  +`<circle cx="${x0+25}" cy="${y0+4}" r="7" fill="#c9a44e" stroke="#7a5634" stroke-width="2"/><circle cx="${n(x0+w-25)}" cy="${y0+4}" r="7" fill="#c9a44e" stroke="#7a5634" stroke-width="2"/>`
  +`<text x="${n(x0+44+jw(label)*size/2)}" y="${y0+h/2+14}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="#3b2412">${esc(label)}</text></g>`;
 return s;
}

// 1段ずつ出る列：items＝[[文字, 出す時刻, 色?]]。y の行に左から並べる（中央そろえ）
export function stepsRow(items,t,y,{size=46,sep='→',bg='#141a2b',color='#fff'}={}){
 const vis=items.filter(([,a])=>t>=a);if(!vis.length)return '';
 const all=items.map(x=>x[0]);const w=all.reduce((a,s)=>a+jw(s)*size,0)+(all.length-1)*(jw(sep)*size+24)+48;
 let x=540-w/2+24,s=`<rect x="${n(540-w/2)}" y="${n(y-size*.85)}" width="${n(w)}" height="${n(size*1.5)}" rx="${n(size*.75)}" fill="${bg}" fill-opacity=".82" opacity="${n(sm((t-items[0][1])/.2))}"/>`;
 items.forEach(([str,a,col],i)=>{const ww=jw(str)*size,op=sm((t-a)/.18);
  if(op>0)s+=`<text x="${n(x+ww/2)}" y="${n(y+size*.18+6*(1-op))}" ${FONT} font-size="${size}" font-weight="800" text-anchor="middle" fill="${col??color}" opacity="${n(op)}">${esc(str)}</text>`;
  x+=ww;
  if(i<items.length-1){const op2=sm((t-items[i+1][1])/.18);if(op2>0)s+=`<text x="${n(x+12+jw(sep)*size/2)}" y="${n(y+size*.18)}" ${FONT} font-size="${size*.8}" font-weight="700" text-anchor="middle" fill="#c8cbd6" opacity="${n(op2)}">${sep}</text>`;x+=jw(sep)*size+24;}
 });
 return s;
}

export function yearTag(label,x=40,y=130,op=1){return pill(label,x,y,{size:38,color:'#ffe9c4',op});}
export function noteTag(label,x=40,y=1440,op=1){return pill(label,x,y,{size:36,color:'#e8e2d6',bo:.6,weight:600,op});}
export function scoreHUD({maker=0,breaker=0,x=1040,y=130,op=1}={}){
 const label=`作る側 ${maker} − ${breaker} 破る側`;return pill(label,x,y,{size:36,color:'#fff',bo:.82,anchor:'end',op});
}

export const DESK_COLORS={plain:'#f6f2e8',cipher:'#f08a2c',key:'#2f7bf0'};
export const ALBERTI_INNER='gkwnprtuzlxysomqihfdbacevj';
export function albertiLetters(cx,cy,{outerR=382,innerR=290,steps=0,litOuter=-1,litInner=-1,marker=0}={}){
 let s='';const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 for(let i=0;i<26;i++){
  for(const [ch,r,a,col,lit] of [[abc[i],outerR,Math.PI/2-2*Math.PI*i/26,'#3b2412',litOuter===i],[ALBERTI_INNER[i],innerR,Math.PI/2-2*Math.PI*(i+steps)/26,'#fffaf0',litInner===i||i===marker]]){
   const x=cx+r*Math.cos(a),y=cy-r*Math.sin(a);
   s+=`<text x="${n(x)}" y="${n(y)}" ${FONT} font-size="36" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="${col}"${lit?' stroke="#fff6b8" stroke-width="2" paint-order="stroke"':''}>${esc(ch)}</text>`;
  }
 }
 s+=pill('目印 '+ALBERTI_INNER[marker],cx,cy-415,{size:36,anchor:'middle',color:'#9cc4ff'});
 return s;
}
export function vigenereGrid({x=27,y=310,cell=38,row=-1,col=-1}={}){
 const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let s='<g>';
 s+=`<rect x="${x}" y="${y}" width="${27*cell}" height="${27*cell}" rx="8" fill="#efe2c4" stroke="#b8925a" stroke-width="3"/>`;
 if(row>=0)s+=`<rect x="${x}" y="${y+(row+1)*cell}" width="${27*cell}" height="${cell}" fill="#5b9bff" fill-opacity=".28"/>`;
 if(col>=0)s+=`<rect x="${x+(col+1)*cell}" y="${y}" width="${cell}" height="${27*cell}" fill="#ffa04a" fill-opacity=".28"/>`;
 if(row>=0&&col>=0)s+=`<rect x="${x+(col+1)*cell}" y="${y+(row+1)*cell}" width="${cell}" height="${cell}" fill="#ffd23f" stroke="#fff" stroke-width="3"/>`;
 for(let r=0;r<27;r++)for(let c=0;c<27;c++){
  if(r===0&&c===0)continue;
  const ch=r===0?abc[c-1]:c===0?abc[r-1]:abc[(r+c-2)%26];
  s+=`<text x="${x+(c+.5)*cell}" y="${y+(r+.52)*cell}" ${FONT} font-size="36" font-weight="700" text-anchor="middle" dominant-baseline="central" fill="${r===0||c===0?'#1f4fae':'#3b2412'}">${ch}</text>`;
 }
 return s+'</g>';
}

export function keywordLabels(word='KEY',repeats=2,x=540,y=1260,step=70,active=-1){
 const chars=[...(word.repeat(repeats))];let s='';
 chars.forEach((ch,i)=>{const xx=x+(i-(chars.length-1)/2)*step;
  s+=pill(ch,xx,y,{size:40,color:'#fff',bg:'#2f7bf0',bo:active===i?1:.88,anchor:'middle',border:active===i?'#fff6b8':null});});
 return s;
}
export function shiftLabels(values=[10,4,24],x=540,y=1090,step=112,active=-1){
 let s='';values.forEach((v,i)=>{const xx=x+(i-(values.length-1)/2)*step;
 s+=paper([[String(v),'#3b2412']],xx,y,{size:42,anchor:'middle',mark:active===i?'#ffd23f':null});});return s;
}
export function challengeAnswerLabels({cipher='MYEXD DRO VODDOBC',plain='COUNT THE LETTERS',revealed=0,x=540,y=740}={}){
 const letters=[...plain].filter(c=>c!==' ');let s=paper([[cipher,'#f08a2c']],x,y,{size:38,anchor:'middle'});
 const shown=letters.slice(0,revealed).join('');if(shown)s+=paper([[shown,'#3b2412']],x,y+94,{size:38,anchor:'middle'});
 return s;
}
export function bellasoPattern(x=540,y=700,{cell=55,rows=6}={}){
 const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let s=paper([['合言葉の表','#3b2412']],x,y-80,{size:36,anchor:'middle'});
 for(let r=0;r<rows;r++)for(let c=0;c<6;c++){
  const ch=abc[(r+c)%26];s+=paper([[ch,r===0?'#2f7bf0':'#3b2412']],x+(c-2.5)*cell,y+r*cell,{size:36,anchor:'middle'});
 }
 return s;
}
