// 技術の疑問の鎖（縦長 vert-v1、ys-chain-NN）の共通部品。図のキーは持たない（-diagrams で終わらないので自動読み込みされない）。
// 舞台 1000×920（1単位＝1px）。文字は 36px 以上。舞台の y>560 では x<900 に大事な物を置く。
//  - yearTag(text)：舞台の左上（y 0–50）に小さく「年 と 人物」。全部の図の関数で必ず出す（when()）。ほかの物は 左上 x<460・y<60 に置かない。
//  - fuda(kind,x,y)：画面の札（その時に 分かっていたこと／疑問／試作／実験／違和感／考えの 飛躍／次の 疑問／後に 分かったこと／事実／言い伝え）。
//  - logic(...)：論理の筋の帯（深掘りショート 11・12 と同じ形。仮説／もし正しいなら／予言／事実／判定）。舞台の y 60–316 に置く（年の札の下）。
//  - 3D は scripts/umech/blender-clip.mjs（bclip・banchor）で貼る。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt} from './anim.mjs';
import {W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard} from './yt1-sp-deep-common.mjs';

export const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
export const ORANGE='#ff9f43',GREEN='#83ecc0',RED_='#ff6b6b',PURPLE='#b49bff',CYAN='#6adfff',AMBER='#ffb347';

// 年と人物（左上、小さく）
export function yearTag(text){
 const size=36,w=jw(text)*size+32;
 return rect(0,4,w,48,{fill:'#131f38',fo:.9,stroke:C.faint,sw:2,rx:24})+label(text,16,40,{size,color:C.dim,weight:500});
}
// 図の関数を包む：年の札を必ず足す
export const when=(year,fn)=>(p,ctx)=>fn(p,ctx)+yearTag(typeof year==='function'?year(p,ctx):year);

const FUDA={'その時に 分かっていたこと':'#9aabc7','疑問':HC,'試作':GREEN,'実験':'#edf4ff','違和感':ORANGE,'考えの 飛躍':'#ffb36b','次の 疑問':HC,'後に 分かったこと':PURPLE,'事実':'#edf4ff','言い伝え':'#9aabc7','仮説':'#ffb36b'};
export function fuda(kind,x,y,{g=1,size=36,text='',anchor='start',color}={}){
 return tag(kind,x,y,{g,size,text,anchor,color:color??FUDA[kind]??C.dim});
}
// 論理の筋の帯（11・12 と同じ形）。v[i]＝[文字, 濃さ, 色]。y0 で上下の位置。
const BH=['仮説','もし正しいなら','予言','事実','判定'];
export function logic(v,{g=1,act=-1,y0=60}={}){
 if(g<=0)return '';
 let s=rect(0,y0,W,256,{fill:'#101a30',fo:.97,stroke:C.faint,sw:2,rx:16});
 BH.forEach((h,i)=>{const y=y0+44+48*i,f=v[i]&&v[i][1]>0?v[i][1]:0;
  if(i===act)s+=rect(8,y-37,984,46,{fill:HC,fo:.12,stroke:HC,sw:2,rx:10});
  if(i>0)s+=line(36,y-50,36,y-38,{color:C.faint,w:3});
  s+=label(h,24,y,{size:36,color:i===act?HC:f>0?C.ink:C.dim,weight:700});
  if(f>0)s+=fade(f,label(v[i][0],310,y,{size:38,color:v[i][2]??C.ink,weight:700}));});
 return fade(g,s);
}
// 暗い板つきの大きな式・数（中央寄せ）
export function eqLine(text,y,{size=48,color=C.ink,g=1,x=W/2,anchor='middle',weight=700}={}){return fade(g,label(text,x,y,{size,color,anchor,weight}));}
// 丸い文字の札（A・G など、3D の物の上に重ねる）
export function letter(L,x,y,{g=1,size=40,color=HC,bg='#0b1122'}={}){
 const r=size*.62;return fade(g,`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${bg}" fill-opacity=".9" stroke="${color}" stroke-width="3"/>`+label(L,x,y+size*.36,{size,color,anchor:'middle',weight:700}));
}
// 引き出し線つきの札：点 (ax,ay) から (x,y) の札へ
export function callout(text,ax,ay,x,y,{g=1,size=38,color=C.ink,anchor='middle'}={}){
 if(g<=0)return '';
 return fade(g,line(ax,ay,x,y+(y>ay?-size*.9:size*.35),{color,w:2.5,opacity:.8})+dot(ax,ay,6,color)+plate(text,x,y,{size,color,anchor}));
}
export {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,W,H,HC,LIGHT,cueT,voiceEnd,vseg,swin,tag,note,plate,bigQ,finalCard};
