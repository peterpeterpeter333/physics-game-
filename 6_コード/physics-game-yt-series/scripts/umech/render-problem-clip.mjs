// 問題アニメ（無音の短い動画）を書き出す。1280×760・30 fps・字幕の帯なし・音声なし。最後は静止で止まる。
// 出力：<頭>_<名前>.mp4 と、最後のコマの <頭>_<名前>.png。
//
// 使い方 1（台本に書いた一覧をまとめて書き出す。ふつうはこちら）
//   node scripts/umech/render-problem-clip.mjs <台本.mjs> "<出力名の頭>" [--out <フォルダ>] [--only 出題,小問2]
//   台本 docs/video-revision-20260924/ytseries/qx-<id>.mjs に、次のように書いておく：
//     export const problemClips=[
//       {name:'出題',  key:'qx-hs-w-doppler-1:q0', anim:5,   hold:1.5, heading:'出題中の図（小問1〜3 共通）'},
//       {name:'小問2', key:'qx-um-pendulum:q2',    anim:2.5, hold:1.5, heading:'小問2 の図'},
//     ];
//   anim＝動く秒数（図の関数に p＝0→1、ctx.t＝0→anim 秒を渡す）。hold＝最後のコマ（p＝1）で止めておく秒数（1 秒以上）。
//   出力名の頭の例："高校_303_ドップラー効果_1"、"大学_16_単振動_中級"。
//   --out の既定：~/Downloads/physics-quest-youtube/問題編_問題アニメ
// 使い方 2（キーを1つ直接）
//   node scripts/umech/render-problem-clip.mjs --key qx-hs-w-doppler-1:q0 --anim 5 --hold 1.5 --title '近づく列車の警笛' --heading '出題中の図' --file /path/out_出題
// 確認：--sheet を付けると、1 秒ごとのコマの一覧 <出力>.sheet.jpg も作る（Read で見る。出力先が Downloads なら $EM_FILM_CACHE に作る）。
//
// 図の関数には ctx.problem＝true が渡る（isProblem(ctx)）。解説動画と同じ関数を使い回してよいが、
// 出題中の図は「設定と与えた量だけ」。答え・正しい式・答えにつながる動きを描かない。
import {mkdirSync,existsSync,writeFileSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {pathToFileURL} from 'node:url';
import sharp from 'sharp';
import {C,label,clamp} from './anim.mjs';
import {diagrams} from './diagrams.mjs';

const FPS=30,W=1280,H=760;
const STAGE={x:40,y:150,w:1200,h:515};   // 字幕の帯がないので、題と見出しの下で上下の中ほどに置く
const FF=process.env.FFMPEG??path.join(os.homedir(),'Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1');

function args(){
 const a=process.argv.slice(2),o={_:[]};
 for(let i=0;i<a.length;i++){if(a[i].startsWith('--')){const k=a[i].slice(2);if(k==='sheet'){o.sheet=true;continue;}o[k]=a[++i];}else o._.push(a[i]);}
 return o;
}
export function problemFrame(spec,time){
 const fn=diagrams[spec.key];if(!fn)throw Error(`Unknown diagram ${spec.key}`);
 const tt=Math.min(time,spec.anim),p=spec.anim>0?clamp(tt/spec.anim):1;
 const ctx={t:tt,dur:spec.anim,k:0,problem:true,cue:{diagram:spec.key,reading:'',pause:0},clip:{id:spec.key,title:spec.title??''},
  scene:{cues:[{diagram:spec.key}],captions:[{start:0,end:spec.anim}]}};
 const body=fn(p,ctx);
 if(/NaN|Infinity/.test(body))throw Error(`Invalid geometry ${spec.key} t=${time}`);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><style>text{font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN',sans-serif}</style><rect width="${W}" height="${H}" fill="${C.bg}"/>`
  +(spec.title?label(spec.title,38,46,{size:29}):'')+(spec.heading?label(spec.heading,38,86,{size:22,color:C.dim}):'')
  +`<svg x="${STAGE.x}" y="${STAGE.y}" width="${STAGE.w}" height="${STAGE.h}" viewBox="0 0 1200 515">${body}</svg></svg>`;
}
export async function renderProblemClip(spec,file,{sheet=false,sheetDir}={}){
 if(!(spec.anim>=0)||!(spec.hold>=1))throw Error(`anim≥0 と hold≥1 が必要：${spec.name??spec.key}`);
 mkdirSync(path.dirname(file),{recursive:true});
 const total=spec.anim+spec.hold,n=Math.round(total*FPS),partial=file+'.rendering.mp4';
 const child=spawn(FF,['-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size',`${W}x${H}`,'-framerate',String(FPS),'-i','pipe:0',
  '-an','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','-f','mp4',partial],{stdio:['pipe','inherit','inherit']});
 const done=once(child,'close');child.stdin.on('error',e=>console.error(e));
 const tiles=[];let last;
 for(let j=0;j<n;j++){
  const t=j/FPS,raw=await sharp(Buffer.from(problemFrame(spec,t))).flatten({background:C.bg}).removeAlpha().raw().toBuffer();
  if(sheet&&(j%FPS===0))tiles.push([t,raw]);
  if(j===n-1)last=raw;
  if(!child.stdin.write(raw))await once(child.stdin,'drain');
 }
 child.stdin.end();const [code]=await done;if(code!==0)throw Error(`Encoding failed ${file}`);
 const {renameSync}=await import('node:fs');renameSync(partial,file+'.mp4');
 await sharp(last,{raw:{width:W,height:H,channels:3}}).png().toFile(file+'.png');
 if(sheet){
  tiles.push([total,last]);
  const tw=480,th=285,cols=4,rows=Math.ceil(tiles.length/cols);
  const comp=await Promise.all(tiles.map(async([t,raw],i)=>{
   const img=await sharp(raw,{raw:{width:W,height:H,channels:3}}).resize(tw,th).png().toBuffer();
   const tagSvg=Buffer.from(`<svg width="${tw}" height="22"><rect width="${tw}" height="22" fill="#fff"/><text x="6" y="17" font-size="16">${i===tiles.length-1?'最後のコマ':t.toFixed(0)+' s'}</text></svg>`);
   return [{input:img,left:(i%cols)*tw,top:Math.floor(i/cols)*(th+22)+22},{input:tagSvg,left:(i%cols)*tw,top:Math.floor(i/cols)*(th+22)}];}));
  const out=path.join(sheetDir??path.dirname(file),path.basename(file)+'.sheet.jpg');
  await sharp({create:{width:tw*cols,height:(th+22)*rows,channels:3,background:'#000'}}).composite(comp.flat()).jpeg({quality:85}).toFile(out);
  console.log(`  一覧：${out}`);
 }
 console.log(`書き出し：${file}.mp4（${total.toFixed(1)} s、動き ${spec.anim} s＋静止 ${spec.hold} s）／${file}.png`);
}

const o=args();
if(o.key){
 if(!o.file)throw Error('--file <出力の頭（拡張子なし）> が必要');
 await renderProblemClip({key:o.key,anim:Number(o.anim??5),hold:Number(o.hold??1.5),title:o.title,heading:o.heading},o.file,{sheet:o.sheet,sheetDir:process.env.EM_FILM_CACHE});
}else{
 const [file,head]=o._;if(!file||!head)throw Error('使い方：render-problem-clip.mjs <台本.mjs> "<出力名の頭>" [--out フォルダ] [--only 出題,小問2] [--sheet]');
 const mod=await import(pathToFileURL(path.resolve(file)).href);
 const list=mod.problemClips;if(!Array.isArray(list)||!list.length)throw Error(`${file} に problemClips がない`);
 const outDir=o.out??path.join(os.homedir(),'Downloads/physics-quest-youtube/問題編_問題アニメ');
 const only=o.only?o.only.split(','):null;
 const title=(mod.clips?.[0]?.title??'').replace(/^問題編 解説 ｜ /,'');
 for(const spec of list){
  if(only&&!only.includes(spec.name))continue;
  if(!/^(出題|小問\d+)$/.test(spec.name))throw Error(`name は「出題」か「小問n」：${spec.name}`);
  await renderProblemClip({title,...spec},path.join(outDir,`${head}_${spec.name}`),{sheet:o.sheet,sheetDir:process.env.EM_FILM_CACHE});
 }
}
