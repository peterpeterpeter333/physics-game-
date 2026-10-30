// 書き出した解説動画の機械確認（問題編）。耳で聞く確認の代わりにはならない。
// 使い方：EM_FILM_CACHE=/private/tmp/ys/ys-qx-<id> node scripts/umech/qx-verify.mjs <ID> <mp4>
// やること
//  1. ffmpeg -xerror でデコード検査
//  2. 1 秒ごとの全コマを 4×4 の一覧にする → $EM_FILM_CACHE/verify/sheet-NN.jpg（全部を Read で見る）
//  3. 音声：声だけの音声（$EM_FILM_CACHE/<ID>.voice.wav）を silencedetect で区切り、各 cue の字幕の時間と比べる
//     ・声の始まりが字幕の始まりから 0.35 s 以内か ・声が字幕の終わりを越えないか（次の字幕に食い込まないか）
//     ・字幕の中の 1.2 s 以上の無音が、cue の pause で説明できるか ・最後の声が動画の終わりより前に終わるか
//  4. 書き出した動画の音声（BGM 込み）に silencedetect n=-40dB d=3.5（不自然に長い無音がないか）
//  5. 動画の長さ ＝ 音声 JSON の長さ か
// 結果は $EM_FILM_CACHE/verify/report.txt にも書く。問題があれば終了コード 1。
import {readFileSync,mkdirSync,writeFileSync,rmSync,readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const [id,mp4]=process.argv.slice(2);
const cache=process.env.EM_FILM_CACHE;if(!id||!mp4||!cache)throw Error('使い方：EM_FILM_CACHE=... node scripts/umech/qx-verify.mjs <ID> <mp4>');
const FF=process.env.FFMPEG??path.join(os.homedir(),'Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1');
const out=path.join(cache,'verify');rmSync(out,{recursive:true,force:true});mkdirSync(out,{recursive:true});
const log=[];const say=s=>{log.push(s);console.log(s);};let bad=0;
const ff=a=>spawnSync(FF,a,{encoding:'utf8',maxBuffer:1<<28});

// 1. decode
const dec=ff(['-v','error','-xerror','-i',mp4,'-f','null','-']);
if(dec.status!==0||dec.stderr.trim()){bad++;say(`× デコード検査：${dec.stderr.trim().slice(0,400)}`);}else say('○ デコード検査（ffmpeg -xerror）：エラーなし');
const probe=ff(['-i',mp4]).stderr;const dm=probe.match(/Duration: (\d+):(\d+):([\d.]+)/);const dur=dm?(+dm[1])*3600+(+dm[2])*60+(+dm[3]):NaN;

// 5. duration
const meta=JSON.parse(readFileSync(path.join(cache,id+'.json')));
if(Math.abs(dur-meta.duration)>.15){bad++;say(`× 長さ：動画 ${dur.toFixed(2)} s／音声 JSON ${meta.duration.toFixed(2)} s`);}
else say(`○ 長さ：${Math.floor(dur/60)}:${String(Math.round(dur%60)).padStart(2,'0')}（${dur.toFixed(2)} s、音声 JSON と一致）`);

// 2. frames every second → sheets
const fr=path.join(out,'frames');mkdirSync(fr);
ff(['-v','error','-i',mp4,'-vf','fps=1','-q:v','4',path.join(fr,'f-%04d.jpg')]);
const files=readdirSync(fr).filter(f=>f.endsWith('.jpg')).sort();
const vert=/Video:.* (\d{3,4})x(\d{3,4})/.exec(probe);const portrait=vert&&+vert[2]>+vert[1]; // 縦長（深掘りショート）は 360×640 を 5×2
const [tw,th,cols,per]=portrait?[360,640,5,10]:[480,285,4,16];let sheets=0;
for(let i=0;i<files.length;i+=per){
 const part=files.slice(i,i+per),rows=Math.ceil(part.length/cols);
 const comp=[];for(const [j,f] of part.entries()){const sec=i+j;// fps=1 の k 番目のコマ ≈ k 秒台
  comp.push({input:await sharp(path.join(fr,f)).resize(tw,th).toBuffer(),left:(j%cols)*tw,top:Math.floor(j/cols)*(th+22)+22});
  comp.push({input:Buffer.from(`<svg width="${tw}" height="22"><rect width="${tw}" height="22" fill="#fff"/><text x="6" y="17" font-size="16">${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</text></svg>`),left:(j%cols)*tw,top:Math.floor(j/cols)*(th+22)});}
 await sharp({create:{width:tw*cols,height:(th+22)*rows,channels:3,background:'#000'}}).composite(comp).jpeg({quality:80}).toFile(path.join(out,`sheet-${String(++sheets).padStart(2,'0')}.jpg`));
}
rmSync(fr,{recursive:true,force:true});
say(`○ 1 秒ごとのコマ ${files.length} 枚 → 一覧 ${sheets} 枚（${out}/sheet-*.jpg）。全部を Read で見ること`);

// 3. voice vs captions
function silences(file,n,d){const r=ff(['-v','info','-i',file,'-af',`silencedetect=n=${n}:d=${d}`,'-f','null','-']).stderr;
 const st=[...r.matchAll(/silence_start: ([\d.]+)/g)].map(m=>+m[1]),en=[...r.matchAll(/silence_end: ([\d.]+)/g)].map(m=>+m[1]);
 return st.map((s,i)=>[s,en[i]??Infinity]);}
const voiceFile=path.join(cache,id+'.voice.wav');
const sil=silences(voiceFile,'-45dB',.25);
// voiced intervals = complement of silences
const voiced=[];let t0=0;for(const [a,b] of sil){if(a>t0+.02)voiced.push([t0,a]);t0=b;}if(t0<meta.duration-.05&&isFinite(t0))voiced.push([t0,meta.duration]);
const caps=meta.scenes.flatMap(s=>s.captions.map((c,k)=>({...c,pause:+(s.utterances?.[k]?.pause??0)})));
let n=0;
caps.forEach((c,i)=>{
 const v=voiced.filter(([a,b])=>b>c.start+.01&&a<c.end-.01);n++;
 if(!v.length){bad++;say(`× cue ${i+1}：字幕の間に声がない「${c.text.slice(0,20)}…」`);return;}
 const vs=v[0][0],ve=v.at(-1)[1];
 if(vs-c.start>.35){bad++;say(`× cue ${i+1}：声の始まりが字幕より ${(vs-c.start).toFixed(2)} s 遅い`);}
 if(ve>c.end+.05){bad++;say(`× cue ${i+1}：声が字幕の終わりを ${(ve-c.end).toFixed(2)} s 越える`);}
 const gaps=[];for(let j=1;j<v.length;j++)gaps.push(v[j][0]-v[j-1][1]);const g=Math.max(0,...gaps);
 if(g>1.2){bad++;say(`× cue ${i+1}：声の途中に ${g.toFixed(2)} s の無音`);}
 const tail=c.end-ve;if(tail>c.pause+1.0){bad++;say(`× cue ${i+1}：声の後の無音 ${tail.toFixed(2)} s（pause ${c.pause} s より長い）`);}
});
const lastVoice=voiced.at(-1)?.[1]??0;
if(lastVoice>dur-.1){bad++;say(`× 最後の声が動画の終わり（${dur.toFixed(2)} s）まで続く（途中で切れている恐れ）：${lastVoice.toFixed(2)} s`);}
else say(`○ 最後の声は ${lastVoice.toFixed(2)} s に終わる（動画の終わり ${dur.toFixed(2)} s より前）`);
say(`${bad?'△':'○'} 声と字幕：${n} cue を照合（声の始まり 0.35 s 以内・字幕の終わりを越えない・途中の無音 1.2 s 以下・後の無音は pause＋1 s 以下）`);

// 4. long silence in the final mix
const long=silences(mp4,'-40dB',3.5);
if(long.length)say(`△ 書き出した音声の 3.5 s 以上の無音（-40 dB）：${long.map(([a,b])=>`${a.toFixed(1)}〜${isFinite(b)?b.toFixed(1):'終わり'} s`).join('、')}（cue の pause と照らして確かめる）`);
else say('○ 書き出した音声に 3.5 s 以上の無音（-40 dB）なし');
say('（耳で聞く確認はしていない。上は機械的な確認だけ）');
writeFileSync(path.join(out,'report.txt'),log.join('\n')+'\n');
process.exit(bad?1:0);
