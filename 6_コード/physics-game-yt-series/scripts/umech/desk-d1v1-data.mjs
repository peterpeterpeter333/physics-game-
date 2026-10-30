// D-1 only. Supplied Japanese, narration and speech timing are immutable.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const W=fileURLToPath(new URL('../../',import.meta.url));
const CACHE=process.env.EM_FILM_CACHE??'/private/tmp/ys/ys-chain-d1v1';
const root=CACHE+'/blender';mkdirSync(root+'/tex',{recursive:true});
const clip=JSON.parse(readFileSync(CACHE+'/ys-chain-d1v1.json'));
const timing=readFileSync(W+'docs/video-revision-20260924/deep/D-1_cue時刻一覧.md','utf8');
const direction=readFileSync('/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22/D-1/D-1_制作指示書.md','utf8');
const source=readFileSync(W+'docs/video-revision-20260924/deep/技術の疑問の鎖_D-1_第1版_ナレーション.md','utf8');
const rows=new Map();
for(const l of direction.split('\n')){const m=l.match(/^\| (\d+) \| (.*?) \| (.*?) \| (.*?) \| (.*?) \|$/);if(m)rows.set(+m[1],m.slice(2));}
const tm=new Map();for(const l of timing.split('\n')){const m=l.match(/^\| (\d+) \| `([^`]+)` \| .*? \| [\d.]+ \| [\d.]+ \| [\d.]+ \| .*? \| (.*?) \|$/);if(m)tm.set(m[2],{row:+m[1],words:m[3]});}
const numbers={spoonML:15,expansion:1700,steamML:15*1700,steamL:15*1700/1000,atmosphereKgCm2:1.03,palmCm2:100,diameterCm:53,radiusCm:53/2,pi:3.14,areaCm2:26.5*26.5*3.14,roundedAreaCm2:2200,palms:22,kg:2200,tonnes:2,horseKg:500,horses:2200/500,radiusRatio:.045/.015,areaRatio:(.045/.015)**2,arrowsThin:2,arrowsWide:18,fujiRatio:.63,efficiency:.01,scores:[[1,0],[1,1],[1,2]]};
assert.equal(numbers.steamML,25500);assert.equal(numbers.steamL,25.5);
assert.equal(numbers.radiusCm,26.5);assert.ok(Math.abs(numbers.areaCm2-2205.065)<1e-8);
assert.equal(numbers.roundedAreaCm2/numbers.palmCm2,numbers.palms);assert.equal(numbers.palms*100,numbers.kg);assert.equal(numbers.kg/1000,2.2);
assert.equal(numbers.horses,4.4);assert.equal(numbers.areaRatio,9);assert.equal(numbers.arrowsWide/numbers.arrowsThin,9);assert.equal(numbers.fujiRatio,.63);
assert.deepEqual(numbers.scores,[[1,0],[1,1],[1,2]]);
// Separated hand silhouettes on a 53 cm teaching face, scaled to a .06 m disc.
const palmPositions=[];
for(let r=0;r<5;r++){const n=[3,5,6,5,3][r];for(let c=0;c<n;c++)palmPositions.push([(c-(n-1)/2)*.0082,(r-2)*.0093]);}
assert.equal(palmPositions.length,22);for(const [x,y] of palmPositions)assert.ok(Math.hypot(x,y)+.004<.030);
const layerCounts=Array.from({length:10},(_,i)=>40-4*i);
// Remove the two densest lower layers; retain a partial boundary layer.
const fujiCounts=[27,...layerCounts.slice(3)];
assert.ok(Math.abs(fujiCounts.reduce((a,b)=>a+b,0)/layerCounts.reduce((a,b)=>a+b,0)-.63)<.01);
const P=(x,y,z,d,az,el,lens=40)=>[x,y,z,d,az,el,lens];
const cameras={
 mine:P(-.20,.10,.17,1.02,-12,28),horse:P(-.30,.10,.35,.56,-12,30),
 board:P(.58,.30,.08,.70,0,30),engine:P(-.19,.10,.43,.78,-10,32),
 cylinder:P(-.065,.10,.435,.23,-10,32,46),logic:P(-.075,.10,.44,.23,-15,32,46),
 balloon:P(.05,-.16,.14,.63,-12,35),can:P(.23,-.12,.065,.53,-15,34),
 straw:P(.40,-.10,.075,.22,-12,32),air:P(.40,.15,.16,.40,-15,26),
 weights:P(.30,-.04,.045,.34,-12,35),inside:P(.23,-.12,.055,.50,-12,35),
 twocans:P(.22,-.12,.07,.42,-8,35),pump:P(-.20,.10,.26,1.08,-8,27),
 twins:P(.20,-.08,.07,.44,-12,38),area:P(.19,-.08,.09,.16,0,65),
 heavy:P(.26,-.08,.07,.56,-12,35),hemisphere:P(.10,-.05,.06,.32,-12,35),
 pull:P(.10,-.05,.06,1.40,-8,30),map:P(.20,.38,.15,1.03,0,30),
 coal:P(.005,.10,.39,.42,-12,32),fuji:P(.26,.05,.14,1.04,-10,30),
};
function setup(row){
 if(row<=3)return ['mine','mine'];if(row===4)return ['score','board'];if(row===5)return ['horse','horse'];
 if(row<=8)return ['engine','engine'];if(row<=13)return ['logic','logic'];
 if(row<=15)return ['balloon','balloon'];if(row<=19)return ['can','can'];if(row===20)return ['straw','straw'];
 if(row===21)return ['air','air'];if(row<=23)return ['weights','weights'];if(row<=25)return ['inside','inside'];if(row===26)return ['twocans','twocans'];
 if(row===27||row===31||row===32||row===33)return ['pump','pump'];if(row<=30)return ['cylinder','cylinder'];
 if(row===34)return ['twins','twins'];if(row===35)return ['area','area'];if(row<=38)return ['heavy','heavy'];
 if(row===39)return ['hemisphere','hemisphere'];if(row===40)return ['pull','pull'];if(row===41)return ['map','map'];
 if(row===42)return ['cylinder','cylinder'];if(row<=44)return ['coal','coal'];if(row===45)return ['fuji','fuji'];return ['last','mine'];
}
const cues=[];let previous=null;
for(const scene of clip.scenes)for(let i=0;i<scene.cues.length;i++){
 const q=scene.cues[i],cap=scene.captions[i],key=q.diagram.replace(/^cd1v1-/,''),info=tm.get(key);assert.ok(info,key);
 const [group,camera]=setup(info.row),[objects,cameraInstruction,action,labels]=rows.get(info.row);
 const wordEvents=info.words.split('<br>').flatMap(w=>{const m=w.match(/^(.*?) ([\d.]+)$/);return m?[{word:m[1],time:+m[2]}]:[];});
 cues.push({key,row:info.row,start:cap.start,end:cap.end,subtitle:q.subtitle,group,camera,pose:cameras[camera],move:previous===camera?0:key==='mine:open'?1.5:1,subjectRatio:camera==='logic'?.48:.65,objects,cameraInstruction,action,labels,wordEvents,face:q.face??null,view:q.view??null});previous=camera;
}
assert.equal(cues.length,57);assert.equal(new Set(cues.map(c=>c.row)).size,46);
const motionSeconds=cues.reduce((a,c)=>a+c.move,0),topSeconds=cues.filter(c=>c.pose[5]>=65).reduce((a,c)=>a+c.end-c.start,0);
assert.ok(motionSeconds/clip.duration<.2);assert.ok(topSeconds/clip.duration<.2);
const events=Object.fromEntries(cues.map(c=>[c.key,c.wordEvents]));
const landmarks=[4,24.5,54.8,84.3,104.5,126.17,140.5,210.7,263.9,302.7,341.6,403.3];
const data={episode:'d1v1',duration:clip.duration,cues,cameras,numbers,palmPositions,layerCounts,fujiCounts,events,landmarks,motionSeconds,topSeconds};
writeFileSync(root+'/data.json',JSON.stringify(data,null,1));
const shot=['# D-1 撮影台本（ChatGPT）','',`固定の声・字幕：57 cue、${clip.duration.toFixed(3)}秒。全46行を以下で cue ごとに展開。`,`カメラ設計：移動${motionSeconds}秒（${(100*motionSeconds/clip.duration).toFixed(2)}％）、仰角65°以上${topSeconds.toFixed(2)}秒（${(100*topSeconds/clip.duration).toFixed(2)}％）。`,'','場所は制作指示どおり。行35は小さな上面を読ませる独立模型（.06 m径）を(.19,-.08)へ置く。行24は手のひらを缶の左(.12,-.12)へ置き、両方を一画面に入れる。',''];
for(const c of cues)shot.push(`## 行${c.row} ${c.key}：${c.start.toFixed(2)}〜${c.end.toFixed(2)}秒`,'',`- カメラ：${c.move?`初め${c.move}秒だけ移動、その後停止`:'全区間停止'}。P((${c.pose.slice(0,3).join(',')}),${c.pose.slice(3).join(',')})。`,`- 主役：${c.objects}。画面横幅${Math.round(c.subjectRatio*100)}％を狙う（試し撮りで確認）。`,`- 手と動き：${c.action}`,`- 合わせる語と秒：${c.wordEvents.map(w=>w.word+' '+w.time.toFixed(2)).join('／')}`,`- 札：${c.labels}`,`- 顔：${c.face?JSON.stringify(c.face):'なし'}。見方：${c.view??'なし'}。`,'');
shot.push('## 検算に関する疑問（正本は変更しない）','','制作指示書10章の2205.1、台本コメントの2205.07は丸め表記。実計算26.5×26.5×3.14は2205.065。動画の約2200は共通。');
writeFileSync(W+'docs/video-revision-20260924/deep/D-1_撮影台本_ChatGPT.md',shot.join('\n'));
mkdirSync(CACHE+'/problem',{recursive:true});
const section=source.split('## 問題編への接続（いまは作らない。入れるときのため）')[1].split('\n## ')[0].trim();
writeFileSync(CACHE+'/problem/problem.json',JSON.stringify({episode:'D-1',sourceMarkdown:section,parts:['富士山の模型','空気の層の柱','ニューコメンの機械','空気の押す矢印'],pressureRatio:.63},null,1));
// Simple map is a texture on the same warm wooden board, not a flat video diagram.
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="840"><rect width="1200" height="840" fill="#bdced0"/><path d="M150 120 L190 80 225 105 205 170 240 210 225 250 200 275 185 210 160 185Z M295 170 L365 135 440 150 485 130 530 165 610 115 680 145 710 100 755 145 800 160 850 145 1000 230 1080 350 980 420 915 510 855 500 830 600 760 650 710 570 660 600 630 535 595 500 570 600 530 625 500 545 450 520 380 535 305 500 270 405 310 360 285 300Z M660 90 L700 25 750 35 760 95 710 165Z" fill="#92a779" stroke="#f4e8cc" stroke-width="12"/><path d="M380 260 Q600 310 780 250 M380 380 Q600 390 900 340 M480 170 L500 500 M680 180 L675 480" fill="none" stroke="#c9d0ad" stroke-width="5"/></svg>`;
await sharp(Buffer.from(svg)).png().toFile(root+'/tex/d1-europe.png');
console.log(JSON.stringify({cache:CACHE,cues:cues.length,duration:clip.duration,numbers,landmarks,motionSeconds,topSeconds,assertions:'PASS'},null,1));
