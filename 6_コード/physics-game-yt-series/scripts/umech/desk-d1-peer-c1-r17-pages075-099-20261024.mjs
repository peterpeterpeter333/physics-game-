// Record only pages actually viewed by D agent; no rendering or acceptance.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17/actual-final-review';
const source=dir+'/actual-final-index.json',v=JSON.parse(fs.readFileSync(source));
const out=dir+'/d1-peer-pages075-099-20261024.json';
if(fs.existsSync(out))throw Error('Preserve prior peer record');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pages=[];
for(let n=75;n<=99;n++){
 const file=dir+'/sheets/sheet-'+String(n).padStart(3,'0')+'.jpg';
 if(v.sheets[n-1]!==file)throw Error('Page/frame order mismatch');
 const frames=v.frames.slice((n-1)*9,n*9);if(frames.length!==9)throw Error('Incomplete page');
 for(const r of frames)if(sha(r.file)!==r.sha256)throw Error('Actual frame changed '+r.frame);
 pages.push({number:n,file,sha256:sha(file),actuallyViewedAllNineImages:true,
  frames:frames.map(r=>({frame:r.frame,time:r.time,file:r.file,sha256:r.sha256}))});
}
const enlarged=[6060,6510,6516].map(j=>{
 const r=v.frames.find(x=>x.frame===j);if(!r)throw Error('Missing enlarged actual');
 return{...r,actuallyViewedFull1080x1920:true};
});
const record={episode:'C-1',reviewer:'D-1 peer',candidate:'r17; not final acceptance',
 source,sourceSha256:sha(source),mp4:v.mp4,mp4Sha256:v.mp4Sha256,
 sourceIsActualEncodedMp4:v.source,heavyMp4DecodeOrEncodeStartedByThisReview:false,
 mp4HashIndependentlyRecomputed:false,actuallyViewedPages:pages.length,
 actuallyViewedImages:225,firstTime:pages[0].frames[0].time,lastTime:pages.at(-1).frames.at(-1).time,
 pages,enlarged,
 observations:[
  '180.967–185.0 seconds: both physical score digits and the change 0–0 to0–1 are readable; no principal disappears during this covered score transition.',
  '185.467–188.0: the supplied full-screen Kai face fades in/out normally; the 09999 explanatory state is readable after it clears. This does not separately approve the face timing exemption.',
  '202.0 full image: all four direct red bump connections and yellow contact marks can be identified; there is no new missing-contact finding from these images.',
  '209.5–219.3: the eight-wheel diagram remains fully visible, but its known78.32% physical width is NOT waived; C18 camera repair is still required.',
  '217.0/217.2 full images: the black crack appears on the sixth wheel at217.2 following its existing216.8857s start. It is not missing; the earlier217.0 image is during reveal.',
  '226.5–243.367: the intended close view isolates ones/tens and the weighted arm; leftward unused wheels extend out of this intentional close-up. The arm lift7→8→9 and fall9→0/tens1 are readable.',
  '243.433 onward: the unwanted pointing hand has disappeared for arm:store; digits10 and the fallen arm persist. No reversion to the previous held pointing hand is seen.',
  '253.867–254.467: the shishiodoshi is present immediately after the scene cut, without a wood-only intermediate image.'
 ],
 newGenuineDefectsFound:[],knownUnresolvedDefects:[{cue:'hard:crack',time:209.5,issue:'Eight-wheel whole principal78.32%; pending C18 fit, not exempted.'}],
 limits:['Only pages075–099 and three listed full images were viewed here; not all1334 frames.','No actual-ear listening performed.','Final C18 rendered/encoded replacement still requires independent checking.'],
 originalGateResultsNotChanged:true,otherNgNotWaived:true,finalAcceptance:false};
fs.writeFileSync(out,JSON.stringify(record,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),pages:pages.length,images:225,first:record.firstTime,last:record.lastTime,newDefects:0,knownDefectRetained:true}));
