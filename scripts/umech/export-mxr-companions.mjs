// Generate optional accessibility/review artifacts alongside the finished film.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
const cache=process.env.EM_FILM_CACHE;
const out=process.env.FILM_OUTPUT;
if(!cache||!out)throw Error('Set EM_FILM_CACHE and FILM_OUTPUT');
const clip=JSON.parse(readFileSync(path.join(cache,'exp-maxwell-revised.json')));
const plan=JSON.parse(readFileSync(path.join(cache,'plan.json')))[0];
const stamp=(t,ms=false)=>{
 const n=Math.round(t*1000),s=Math.floor(n/1000);
 return `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}${ms?','+String(n%1000).padStart(3,'0'):''}`;
};
mkdirSync(out,{recursive:true});
const captions=clip.scenes.flatMap(s=>s.captions);
writeFileSync(path.join(out,'日本語字幕.srt'),captions.map((c,i)=>`${i+1}\n${stamp(c.start,true)} --> ${stamp(c.end,true)}\n${c.text}\n`).join('\n'));
let md='# 改訂版・時刻付き台本\n\n音声：VOICEVOX Nemo 男声1\n\n';
for(let j=0;j<clip.scenes.length;j++){
 const s=clip.scenes[j];md+=`## ${stamp(s.start)} ${s.heading}\n\n`;
 s.captions.forEach((c,i)=>{const q=plan.scenes[j].cues[i];md+=`### ${stamp(c.start)}\n\n${c.text}\n\n`;
  if(q.operation)md+=`式操作：${q.operation}\n\n`;
  if(q.formula?.length)md+=`式：\`${q.formula.join(' ')}\`\n\n`;
 });
}
writeFileSync(path.join(out,'時刻付き台本.md'),md);
const escape=s=>s.replace(/[\\=;#]/g,'\\$&').replaceAll('\n',' ');
writeFileSync(path.join(out,'chapters.ffmetadata'),';FFMETADATA1\ntitle='+escape(plan.title)+'\ncomment=音声：VOICEVOX Nemo 男声1\n'+clip.scenes.map(s=>`[CHAPTER]\nTIMEBASE=1/1000\nSTART=${Math.round(s.start*1000)}\nEND=${Math.round(s.end*1000)}\ntitle=${escape(s.heading)}\n`).join(''));
console.log(`Exported ${captions.length} captions and ${clip.scenes.length} chapters`);
