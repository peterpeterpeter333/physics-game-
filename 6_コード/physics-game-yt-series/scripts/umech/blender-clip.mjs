// Blender で書き出した連番の PNG（3D の場面）を、縦長の図の関数から 1コマずつ貼る部品。
// 図のキーは持たない（ファイル名が -diagrams で終わらないので自動読み込みされない）。使う回の図ファイルから import する。
//
// 置き場所：<コマの根>/<shot>/0000.png …、<コマの根>/<shot>/meta.json（scripts/blender/bl_common.py の run() が書く）
//   コマの根＝環境変数 BLENDER_FRAMES、無ければ $EM_FILM_CACHE/blender（各動画のキャッシュの下）。
// 貼り方：PNG を data: URI にして <image> で SVG に入れる（render-all-films.mjs・mxr-review・shots・qx-verify は
//   そのまま SVG を sharp でコマにするので、既存のファイルは何も変えなくてよい）。
// 時刻との合わせ方：shot は「0→1 の進み u」の動き。図の関数が声に合わせて u を決める（vseg・swin・ctx.tg など）。
//   bclip(shot,u,{x,y,w}) は u を一番近いコマに丸めて貼る。決まったコマを貼るときは bframe(shot,i,…)。
// アンカー：Blender で名前を付けた 3D の点の、そのコマでの画面の位置。banchor(shot,name,u,{x,y,w}) は舞台の座標で返す
//   （貼った位置・大きさに合わせて直す）。2D の札・矢印を 3D の物に合わせるのに使う。
// data: URI の中の N・I・u は %4E・%49・%75 と書く（librsvg は読める）。mxr-review などが SVG の中の「NaN・Infinity・undefined」を
//   壊れた図として止めるので、base64 の文字の並びが偶然それに見えないようにする。
// コマが無いときは、どの shot が無いかと、書き出しのコマンドを示して止める（黙って空の絵にしない）。
import {readFileSync,existsSync} from 'node:fs';

export const blenderRoot=()=>process.env.BLENDER_FRAMES??(process.env.EM_FILM_CACHE?process.env.EM_FILM_CACHE+'/blender':null);
const metas=new Map(),pngs=new Map();
export function shotMeta(shot){
 const root=blenderRoot();if(!root)throw Error('blender-clip: EM_FILM_CACHE か BLENDER_FRAMES を決めてください');
 const f=`${root}/${shot}/meta.json`;
 if(!metas.has(f)){
  if(!existsSync(f))throw Error(`blender-clip: ${f} が無い。scripts/blender/ の場面を書き出す（Blender -b --factory-startup -P scripts/blender/<場面>.py -- --out ${root}）`);
  const m=JSON.parse(readFileSync(f,'utf8'));if(m.preview)throw Error(`blender-clip: ${shot} は下見（--every）の書き出し。--every なしで書き直す`);
  metas.set(f,m);
 }
 return metas.get(f);
}
const idx=(m,u)=>Math.max(0,Math.min(m.frames-1,Math.round(Math.max(0,Math.min(1,u))*(m.frames-1))));
function png(shot,i){
 const f=`${blenderRoot()}/${shot}/${String(i).padStart(4,'0')}.png`;
 if(!pngs.has(f)){if(!existsSync(f))throw Error(`blender-clip: コマが無い ${f}`);if(pngs.size>48)pngs.delete(pngs.keys().next().value);pngs.set(f,readFileSync(f).toString('base64').replace(/[NIu]/g,c=>c==='N'?'%4E':c==='I'?'%49':'%75'));}
 return pngs.get(f);
}
// 置く大きさ：w を決めると、高さは shot の縦横比のまま。
const place=(m,{x=0,y=0,w}={})=>{const W=w??m.width,s=W/m.width;return {x,y,w:W,h:m.height*s,s};};
export function bframe(shot,i,o={}){
 const m=shotMeta(shot),P=place(m,o),j=Math.max(0,Math.min(m.frames-1,i|0));
 const img=`<image x="${P.x.toFixed(1)}" y="${P.y.toFixed(1)}" width="${P.w.toFixed(1)}" height="${P.h.toFixed(1)}" preserveAspectRatio="none" href="data:image/png;base64,${png(shot,j)}"/>`;
 return o.opacity!=null&&o.opacity<1?(o.opacity<=0.001?'':`<g opacity="${o.opacity.toFixed(2)}">${img}</g>`):img;
}
export const bclip=(shot,u,o={})=>bframe(shot,idx(shotMeta(shot),u),o);
export const bframes=shot=>shotMeta(shot).frames;
// 舞台の座標でのアンカーの位置 [x,y]
export function banchor(shot,name,u,o={}){
 const m=shotMeta(shot),a=m.anchors?.[name];if(!a)throw Error(`blender-clip: ${shot} にアンカー ${name} が無い`);
 const P=place(m,o),q=a[idx(m,u)];return [P.x+q[0]*P.s,P.y+q[1]*P.s];
}
export const banchorAt=(shot,name,i,o={})=>banchor(shot,name,i/Math.max(1,shotMeta(shot).frames-1),o);
export const binfo=shot=>shotMeta(shot).info??{};
