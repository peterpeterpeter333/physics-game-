// Part A, immutable supplied narration/timing. Writes only the isolated GPT cache.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const ID='ys-chain-d1a',CACHE=process.env.EM_FILM_CACHE??'/private/tmp/ys/'+ID+'_gpt_20261026';
assert.equal(CACHE,'/private/tmp/ys/ys-chain-d1a_gpt_20261026');
const root=CACHE+'/blender';mkdirSync(root+'/tex',{recursive:true});
const clip=JSON.parse(readFileSync(CACHE+'/'+ID+'.json'));
const timing=readFileSync(W+'docs/video-revision-20260924/deep/D-1前編_cue時刻一覧.md','utf8');
const md=readFileSync(W+'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1前編_ナレーション.md','utf8');
const rows=new Map(md.split('\n').flatMap(l=>{const m=l.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);return m?[[+m[1],{scene:m[2],speaker:m[3],narration:m[4],screen:m[5]}]]:[];}));
const tm=new Map();
for(const l of timing.split('\n')){const m=l.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)tm.set(m[2],{row:+m[1],words:m[3]});}
const numbers={spoonML:15,expansion:1700,steamML:15*1700,steamL:15*1700/1000,atmosphereKgCm2:1.03,palmCm2:100,diameterCm:53,radiusCm:53/2,pi:3.14,areaCm2:26.5*26.5*3.14,roundedAreaCm2:2200,palms:22,kg:2200,tonnes:2,horseKg:500,horses:2200/500,radiusRatio:.045/.015,areaRatio:(.045/.015)**2,arrowsThin:2,arrowsWide:18,fujiRatio:.63,efficiency:.01,scores:[[1,0]]};
numbers.roundedSteamL=25;numbers.roundedAtmosphereKgCm2=1;numbers.roundedHorses=4;
assert.ok(Math.abs(numbers.steamL-numbers.roundedSteamL)<=.5);assert.equal(Math.round(numbers.atmosphereKgCm2),numbers.roundedAtmosphereKgCm2);assert.equal(Math.round(numbers.horses),numbers.roundedHorses);
assert.equal(numbers.steamML,25500);assert.equal(numbers.steamL,25.5);assert.equal(numbers.radiusCm,26.5);
assert.ok(Math.abs(numbers.areaCm2-2205.065)<1e-8);assert.equal(numbers.roundedAreaCm2/numbers.palmCm2,numbers.palms);
assert.equal(numbers.palms*100,numbers.kg);assert.equal(numbers.kg/1000,2.2);assert.equal(numbers.horses,4.4);
assert.equal(numbers.areaRatio,9);assert.equal(numbers.arrowsWide/numbers.arrowsThin,9);assert.equal(numbers.fujiRatio,.63);
assert.deepEqual(numbers.scores,[[1,0]]);
const palmPositions=[];for(let r=0;r<5;r++){const n=[3,5,6,5,3][r];for(let c=0;c<n;c++)palmPositions.push([(c-(n-1)/2)*.0082,(r-2)*.0093]);}
assert.equal(palmPositions.length,22);for(const [x,y] of palmPositions)assert.ok(Math.hypot(x,y)+.004<.030);
const layerCounts=Array.from({length:10},(_,i)=>40-4*i),fujiCounts=[27,...layerCounts.slice(3)];
assert.ok(Math.abs(fujiCounts.reduce((a,b)=>a+b,0)/layerCounts.reduce((a,b)=>a+b,0)-.63)<.01);
const cues=[];
for(const scene of clip.scenes)for(let i=0;i<scene.cues.length;i++){
 const q=scene.cues[i],cap=scene.captions[i],key=q.diagram.replace(/^cd1a-/,''),info=tm.get(key);assert.ok(info,key);
 const row=rows.get(info.row);assert.ok(row);
 const wordEvents=info.words.split('<br>').flatMap(w=>{const m=w.match(/^(.*?) ([\d.]+)$/);return m?[{word:m[1],time:+m[2]}]:[];});
 cues.push({key,row:info.row,start:cap.start,end:cap.end,subtitle:q.subtitle,wordEvents,face:q.face??null,view:q.view??null,group:key.split(':')[0],screen:row.screen});
}
assert.equal(cues.length,54);assert.equal(new Set(cues.map(c=>c.row)).size,40);
assert.ok(Math.abs(clip.duration-387.2546666666667)<1e-8);
const data={episode:'d1a',duration:clip.duration,cues,numbers,palmPositions,layerCounts,fujiCounts,events:Object.fromEntries(cues.map(c=>[c.key,c.wordEvents]))};
writeFileSync(root+'/data.json',JSON.stringify(data,null,1));
// ext.build() loads its map texture even though the map group stays hidden in Part A.
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840"><rect width="1200" height="840" fill="#bdced0"/><path d="M150 120 L190 80 225 105 205 170 240 210 225 250 200 275 185 210 160 185Z M295 170 L365 135 440 150 485 130 530 165 610 115 680 145 710 100 755 145 800 160 850 145 1000 230 1080 350 980 420 915 510 855 500 830 600 760 650 710 570 660 600 630 535 595 500 570 600 530 625 500 545 450 520 380 535 305 500 270 405 310 360 285 300Z M660 90 L700 25 750 35 760 95 710 165Z" fill="#92a779" stroke="#f4e8cc" stroke-width="12"/><path d="M380 260 Q600 310 780 250 M380 380 Q600 390 900 340 M480 170 L500 500 M680 180 L675 480" fill="none" stroke="#c9d0ad" stroke-width="5"/></svg>`;
await sharp(Buffer.from(svg)).png().toFile(root+'/tex/d1-europe.png');
mkdirSync(CACHE+'/problem',{recursive:true});
const section=md.split('## 問題編への接続（いまは作らない。入れるときのため）')[1].trim();
writeFileSync(CACHE+'/problem/problem.json',JSON.stringify({episode:'D-1 前編',sourceMarkdown:section,images:{challenge:'挑戦.png',answer:'答え.png'},parts:['富士山の模型','空気の層の柱','ニューコメンの機械','空気の押す矢印'],pressureRatio:.63},null,1));
console.log(JSON.stringify({cache:CACHE,cues:cues.length,rows:40,duration:clip.duration,assertions:'PASS'},null,1));
