// Render a frame-aligned correction without repeating the entire documentary.
import {readFileSync,writeFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import sharp from 'sharp';
import {umechFrame} from './frame.mjs';
const cache=process.env.EM_FILM_CACHE,ffmpeg=process.env.FFMPEG;
const base=JSON.parse(readFileSync(cache+'/plan.json'))[0],timed=JSON.parse(readFileSync(cache+'/'+base.id+'.json'));
const clip={...base,duration:timed.duration,animationFPS:30,scenes:base.scenes.map((s,i)=>({...s,start:timed.scenes[i].start,end:timed.scenes[i].end,captions:timed.scenes[i].captions}))};
const scene=clip.scenes.find(s=>s.cues.some(q=>q.diagram==='mxr-waves'&&q.mode==='axes'));
const i=scene.cues.findIndex(q=>q.diagram==='mxr-waves'&&q.mode==='axes'),cap=scene.captions[i];
const first=Math.ceil(cap.start*30),last=Math.ceil(cap.end*30),start=first/30,end=last/30;
const child=spawn(ffmpeg,['-y','-v','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1280x760','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',cache+'/axes-patch.mp4'],{stdio:['pipe','inherit','inherit']});
const finished=once(child,'close');
for(let j=first;j<last;j++){
 const raw=await sharp(Buffer.from(umechFrame(clip,scene,j/30))).flatten({background:'#0b1122'}).removeAlpha().raw().toBuffer();
 if(!child.stdin.write(raw))await once(child.stdin,'drain');
 if(j===first||j===Math.floor((first+last)/2)||j===last-1)await sharp(raw,{raw:{width:1280,height:760,channels:3}}).png().toFile(cache+'/axes-'+j+'.png');
}
child.stdin.end();const [code]=await finished;if(code!==0)throw Error('Patch failed');
writeFileSync(cache+'/axes-patch.json',JSON.stringify({first,last,start,end,frames:last-first}));
console.log(`Correction: ${start}–${end} (${last-first} frames)`);
