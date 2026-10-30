// B-1's original signs. Immutable Japanese from the production instructions.
import fs from 'node:fs';
import {measuredInkWidth} from './desk-axes-text-metrics.mjs';
import {esc,clamp} from './anim.mjs';
import {viewCard,stepsRow} from './desk-overlay-lib.mjs';
const F='font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif"';
const sm=x=>{x=clamp(x);return x*x*(3-2*x);},n=x=>Math.round(x*10)/10;
const LABELS=['B 電気と電波 1','1600年ごろ','1600年 イギリス ギルバート','1581年 ロンドン ノーマン','言い伝え その1：星','言い伝え その2：磁石の島','言い伝え その3：ニンニク','地図は 再現','ニンニクを 塗っても くっつく','N（赤）','S（青）','N と S → 引き合う','N と N → 押し返す','北を 向く 先 ＝ N極','正確には 真北から 少し ずれる','風見鶏 → 風の 向き','針 → 磁石の 力の 向き','北に 何かが ある？','テレラ（小さな 地球）','鉄の粉は いまの 見せ方','N極 から 出て → S極 へ 入る','青い てっぺん（S）の 近く → 下','赤い てっぺん（N）の 近く → 上','仮説：地球は 大きな 磁石','もし正しいなら','予言：ロンドンで 約70度 下','星なら：上','島なら：約20度 下','地球が 磁石なら：約70度 下','事実：ロンドンで 約72度 下','判定 ○（地球が 磁石）','地球の 北 ＝ S極','地球の 南 ＝ N極','先に 決めた：北を 向く 先 ＝ N','だから：地球の 北 ＝ S極','地球の 中の 磁石の 正体','南半球（オーストラリア）','下？ 上？','答えは この先の 電気と電波の 回','見方：確かめる側から','言い伝え 0 − 0 実験','言い伝え 0 − 1 実験','言い伝え 0 − 3 実験','＋1','？','N','S'];
const widths=new Map();
for(const label of LABELS)for(const size of [36,38,40,42,44,48]){
 const ink=await measuredInkWidth(`<svg xmlns="http://www.w3.org/2000/svg" width="2600" height="160"><text x="20" y="110" ${F} font-size="${size}" font-weight="800">${esc(label)}</text></svg>`);widths.set(label+'|'+size,ink);
}
const width=(s,size)=>widths.get(s+'|'+size)??[...s].reduce((a,c)=>a+(/[ -~]/.test(c)?.72:1)*size,0);
function card(s,x=40,y=360,{size=42,op=1,middle=false,bg='#f4e8cc',color='#3b2412',max=1000,stroke='#b8925a'}={}){
 if(op<.003)return '';let lines=[s];if(width(s,size)>max-56){lines=[''];for(const ch of s.match(/\d+(?:\.\d+)?(?:度)?|[^\d]/gu)){if(width(lines.at(-1)+ch,size)>max-56)lines.push(ch);else lines[lines.length-1]+=ch;}}
 const w=Math.min(max,Math.max(...lines.map(l=>width(l,size)))+56),h=lines.length*size+(lines.length-1)*10+30,x0=Math.max(40,Math.min(1040-w,middle?x-w/2:x));
 return `<g opacity="${n(op)}"><rect x="${n(x0+4)}" y="${n(y-h/2+5)}" width="${n(w)}" height="${h}" rx="8" fill="#2a1406" opacity=".35"/><rect x="${n(x0)}" y="${n(y-h/2)}" width="${n(w)}" height="${h}" rx="8" fill="${bg}" stroke="${stroke}" stroke-width="3"/>${lines.map((l,i)=>`<text x="${n(x0+w/2)}" y="${n(y+size*.36+(i-(lines.length-1)/2)*(size+10))}" ${F} font-size="${size}" font-weight="800" text-anchor="middle" fill="${color}">${esc(l)}</text>`).join('')}</g>`;
}
let D=null;const data=()=>D??=JSON.parse(fs.readFileSync((process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-b1v1')+'/blender/data.json')).b1;
export function overlayB1v1(ctx){
 const {t,cue:q,cap}=ctx,key=q.diagram.replace('cb1v1-',''),c=data().cues.find(c=>c.key===key),r=c.row,on=a=>sm((t-a)/.22);let s='';
 if(t<2.5)ctx.clip.series='B 電気と電波 1';
 const C=(txt,y=360,a=cap.start,size=42)=>card(txt,540,y,{size,op:on(a),middle:true});
 const N=(txt,a=cap.start)=>card(txt,40,1460,{size:36,op:on(a)});
 const A=(txt,nm,a,col,dy=-75)=>{const p=ctx.anchor(nm);if(!p?.[2]||t<a)return '';return card(txt,p[0],Math.max(330,Math.min(1100,p[1]+dy)),{size:40,op:on(a),middle:true,color:col??'#3b2412'});};
 if(r===3)s+=card('1600年ごろ',40,140,{size:38});
 if(r===8)s+=card('1600年 イギリス ギルバート',40,140,{size:38,op:on(52.18)});
 if(r===27)s+=card('1581年 ロンドン ノーマン',40,140,{size:38,op:on(240.81)});
 if(q.view)s+=q.view==='確かめる側から'?card('見方：確かめる側から',40,225,{size:40,stroke:'#5aa469'}):viewCard(q.view,1);
 if(r===4)s+=C('言い伝え その1：星',200,20.10);
 if(r===5||r===6)s+=C('言い伝え その2：磁石の島',r===6?560:360)+N('地図は 再現');
 if(r===7)s+=C('言い伝え その3：ニンニク');
 if(r===10)s+=C('ニンニクを 塗っても くっつく',360,74.61);
 if(r===12){s+=A('N（赤）','magN',88.39,'#b32d25');s+=A('S（青）','magS',88.96,'#245fbe');}
 if(r===13){s+=C('N と S → 引き合う',360,94.15);s+=C('N と N → 押し返す',455,96.58);}
 if(r===14)s+=C('北を 向く 先 ＝ N極',360,103.26)+N('正確には 真北から 少し ずれる');
 if(r===15)s+=C('風見鶏 → 風の 向き',360,107.97)+C('針 → 磁石の 力の 向き',455,111.35);
 if(r===16){
  s+=C('北に 何かが ある？',360,117.79);
  const a=ctx.anchor('north'),b=ctx.anchor('northEnd');
  if(a?.[2]&&b?.[2]&&t>=117.79){const v=on(117.79),x=a[0]+(b[0]-a[0])*v,y=a[1]+(b[1]-a[1])*v,dx=x-a[0],dy=y-a[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len;s+=`<path d="M${n(a[0])} ${n(a[1])} L${n(x)} ${n(y)}" stroke="#ffd23f" stroke-width="8" fill="none"/><path d="M${n(x)} ${n(y)} L${n(x-ux*24+uy*12)} ${n(y-uy*24-ux*12)} L${n(x-ux*24-uy*12)} ${n(y-uy*24+ux*12)} Z" fill="#ffd23f"/>`;}
 }
 if(r===17)s+=C('テレラ（小さな 地球）',360,127.15);
 if(r===22){s+=N('鉄の粉は いまの 見せ方');s+=A('N','poleN',166.91,'#b32d25',35);s+=A('S','poleS',170.13,'#245fbe');s+=C('N極 から 出て → S極 へ 入る',360,170.13);}
 if(r===23){s+=C('青い てっぺん（S）の 近く → 下',360,181.87,40);s+=C('赤い てっぺん（N）の 近く → 上',455,185.82,40);}
 if(r>=24&&r<=29){
  s+=card('仮説：地球は 大きな 磁石',40,300,{size:40,op:on(192.74)});
  s+=card('もし正しいなら',40,392,{size:40,op:on(197)});
  s+=card('予言：ロンドンで 約70度 下',40,476,{size:40,op:on(214.27)});
  if(r>=26){
   const point=ctx.anchor('pin');if(point?.[2]){
    for(const [txt,y,a,cc] of [['星なら：上',720,222.13,'#9b771a'],['島なら：約20度 下',825,232.30,'#805532'],['地球が 磁石なら：約70度 下',970,234.40,'#303947']]){
     s+=card(txt,600,y,{size:36,max:440,op:on(a)});
     if(t>a)s+=`<path d="M${n(point[0])} ${n(point[1])} L590 ${y}" fill="none" stroke="${cc}" stroke-width="3" stroke-dasharray="7 8" opacity="${n(on(a))}"/>`;
    }
   }
  }
  s+=card('事実：ロンドンで 約72度 下',560,392,{size:36,max:480,op:on(249.28)});
  s+=card('判定 ○（地球が 磁石）',40,580,{size:40,color:'#397b4a',op:on(253.85)});
  if(r===28&&t>=253.85){s+=`<ellipse cx="805" cy="970" rx="210" ry="64" fill="none" stroke="#5aa469" stroke-width="7"/>`;for(const [y,a] of [[720,255.98],[825,257.13]])if(t>=a)s+=`<path d="M630 ${y-35}l350 70m-350 0l350 -70" fill="none" stroke="#d6453d" stroke-width="8"/>`;}
 }
 if(r===31)s+=A('？','globeS',283.86);
 if(r===32){s+=C('地球の 北 ＝ S極',360,293.74);s+=C('地球の 南 ＝ N極',455,296.49);}
 if(r===34){s+=C('先に 決めた：北を 向く 先 ＝ N',350,303.71,40);s+=C('だから：地球の 北 ＝ S極',450,307.43);}
 if(r===36)s+=A('？','globe',cap.start+1);
 if(r===37)s+=C('地球の 中の 磁石の 正体',360,329.80);
 if(r===38){s+=C('南半球（オーストラリア）',360,335.65);s+=C('下？ 上？',455,335.65);s+=A('？','challengeNeedle',335.65);s+=N('答えは この先の 電気と電波の 回',343.59);}
 for(const [at,value] of [[12.72,0],[78.08,1],[258.36,3],[315.63,3]])if(t>=at-.1&&t<at+3.2){const old=at===258.36?1:value?value-1:0;const v=t<at?old:at===258.36&&t<at+.3?2:value;const text='言い伝え 0 − '+v+' 実験';s+=card(text,720,155,{size:36,max:320,bg:'#141a2b',color:'#fff',op:on(at-.1)*(1-sm((t-at-2.9)/.3))});if(value&&at!==315.63){for(const tt of at===258.36?[at,at+.3]:[at])if(tt<=t&&t<tt+.65)s+=card('＋1',875,245-40*clamp((t-tt)/.65),{size:36,bg:'#5aa469',color:'#fff',op:Math.sin(Math.PI*clamp((t-tt)/.65))});}}
 return s;
}
