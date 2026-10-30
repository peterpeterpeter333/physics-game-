// Add-only record of the actual B3 MP4 images personally viewed by the D agent.
// This is not a renderer, a gate override, or final acceptance.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='/private/tmp/ys/ys-chain-b1v1-final3-20261024/actual-mp4-review';
const manifestFile=dir+'/manifest.json',m=JSON.parse(fs.readFileSync(manifestFile));
const out=dir+'/d1-peer-b1-final3-first-half-20261024.json';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const expectedVideoSha='9c851d2126f6092d3cb208c919c82e8fc259ca1e593dc13db2b3ed9499ee0983';
if(fs.existsSync(out))throw Error('Preserve previous peer record');
if(m.videoSha256!==expectedVideoSha||sha(m.video)!==expectedVideoSha)throw Error('Not the reviewed B3 encoded MP4');
const frames=m.halfSeconds.frames.filter(r=>r.time>=0&&r.time<=179.5);
if(frames.length!==360||frames.some((r,i)=>r.time!==i*.5||r.frame!==i*15))throw Error('Incomplete first-half exact coverage');
const pages=[];
for(let n=1;n<=36;n++){
 const file=dir+'/half-seconds-'+String(n).padStart(2,'0')+'.jpg';
 const list=frames.slice((n-1)*10,n*10);
 if(list.length!==10)throw Error('Incomplete page');
 for(const r of list)if(sha(r.file)!==r.sha256)throw Error('Actual image changed '+r.frame);
 pages.push({number:n,file,sha256:sha(file),actuallyViewedAllTenImages:true,frames:list.map(r=>({frame:r.frame,time:r.time,row:r.row,cue:r.cue,file:r.file,sha256:r.sha256}))});
}
const enlarged=[0,45,1845,2055,2355,2925,3195].map(j=>({...frames.find(r=>r.frame===j),actuallyViewedFull1080x1920:true}));
const discrepancies=[
 {id:'B3-row1-ship-not-in-view',row:1,times:[0,1.5],requirement:'§7 row1: the compass wooden box, with a model ship on its right.',actual:'No ship is visible in the reviewed opening images, including the two listed full-resolution frames. The frozen apply branch does enable ship, so this is framing/visibility rather than a claim that its mesh does not exist.',kind:'explicit-shot-prop-absent-from-picture',remaining:true},
 {id:'B3-row9-Gilbert-spectator-absent',row:9,times:[61.5,68.5],requirement:'§8 E1: Kai performs Gilbert’s experiment; the Gilbert doll watches beside it.',actual:'The magnet, three nails, garlic, rubbing hand and white rubbing marks can be identified, but the Gilbert doll is absent from the whole reviewed row9 shot. The frozen garlic branch does not call visible(gilbert).',kind:'explicit-prop-not-displayed',remaining:true},
 {id:'B3-row9-waiting-garlic-left-clip',row:9,times:[61.5,62.5,65,68],requirement:'§7 row9: one bar magnet, garlic and three nails in the central experiment shot.',actual:'The waiting garlic is partially cut by the left picture edge; the 61.5s full image confirms this. During the main rubbing action at68.5–70.5s the handled garlic is inside the image, so this is not a claim that rubbing is unreadable.',kind:'secondary-required-prop-clipped-before-action',remaining:true},
 {id:'B3-row11-physical-scoreboard-not-in-view',row:11,times:[78.5,79.5,81],requirement:'§7 row11: physical scoreboard remains in the upper-right and its experiment digit grows to1; a separate 2D score card is also required.',actual:'The 2D0–1 card, +1 and Mio face are visible, but the 3D scoreboard is absent. A 2D card is not recorded as proof of the explicitly requested physical board.',kind:'explicit-shot-prop-absent-from-picture',remaining:true},
 {id:'B3-row12-retreat-not-animated',row:12,times:[81,81.5],requirement:'§7 row12: the nails and garlic retreat toward the back.',actual:'They disappear at the transition to the two magnets. Frozen apply_state has no retreat interpolation for these objects in the pair branch. This is a specified-action omission, not a newly discovered magnetic-physics error.',kind:'specified-motion-omission',remaining:true},
 {id:'B3-row17-descent-not-animated',row:17,times:[122,122.5,123],requirement:'§7 row17: show the terrella descending from above and being placed before approaching.',actual:'The first incoming shot already shows the rough rock on its stand. The rough-to-sphere erosion and chips are readable, but frozen terrella_state has no descent/placement transform.',kind:'specified-motion-omission',remaining:true}
];
const record={episode:'B-1',reviewer:'D-1 peer',candidate:'B3, preserved candidate; not final',manifest:manifestFile,manifestSha256:sha(manifestFile),mp4:m.video,mp4Sha256:expectedVideoSha,mp4Sha256IndependentlyRecomputed:true,source:'Actual encoded B3 MP4 extraction, not reconstructed overlay/3D previews',actuallyViewedPages:36,actuallyViewedHalfSecondFrames:360,firstTime:0,lastTime:179.5,pages,enlarged,
 observations:[
  'Opening box/needle/hand are present; the red and white needle halves are visible. This does not waive the missing ship framing requirement.',
  'The revised score shot at11.5–19s makes the left physical0 readable; the old lid-occlusion finding is not reproduced there.',
  'The star/compass/dotted link, raised black rock and map, sailor/garlic, and Gilbert introduction are recognizable; Gilbert no longer disappears into a wood-only transition at51–51.5s.',
  'Rubbing leaves three white marks; all three nails slide to the magnet and remain attached. No new loss of the central garlic-experiment causal action was seen.',
  'The known B5 polarity error is plainly visible at97.5s: the table magnet’s blueS end faces the held redN end while the card and caption say N/N repulsion. The preserved B3 images remain NG for that physics state.',
  'The99.5s incoming compass,122s rough rock and127s sphere are fully visible in the revised views; no repeat of the old incoming giant clipping/wood-only camera was seen in these half-second frames.',
  'The vane/compass pair and wind/magnet turns, surface-needle placement, common-top alignment, dip progression, and powder-to-lines motion are visible. At106.5s full resolution the small vane W/E letters exist; they were not misclassified as missing from the sheet thumbnail.',
  'The lines show N at the lower red pole and S at the upper blue pole, with yellow directional arrows; no new opposite-pole labeling error was seen in the covered lines segment.'
 ],newActualDiscrepancies:discrepancies,
 knownUnresolved:[
  {pending:'B4',time:46.5,cue:'lore:garlic',issue:'Sailor principal ~39%; required40–70 physical width not waived.'},
  {pending:'B4',time:81.5,cue:'rule:first',issue:'Whole magnet pair ~80%; required40–70 not waived.'},
  {pending:'B4',time:115,cue:'rule:north',issue:'Incoming compass principal ~35%; required40–70 not waived.'},
  {pending:'B5v2',time:97.5,cue:'rule:pull',issue:'Physical S/N versus stated N/N repulsion; actual correction not yet rendered/approved in B3.'}
 ],
 limits:['Only0–179.5s at0.5s spacing plus the listed full images were personally viewed here; not all10700 encoded frames, allcue ends, or the second half.','No actual-ear listening performed.','B4/B5 replacement imagery and the eventual new encoded MP4 require their own actual review.','Not a comprehensive millimetre-by-millimetre asset-spec audit; the six stated discrepancies are actual covered-shot findings.'],originalGateResultsUnchanged:true,original7and7bNgPreserved:true,unrelatedNgNotWaived:true,finalAcceptance:false,heavyCpuOrGpuStarted:false};
fs.writeFileSync(out,JSON.stringify(record,null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),mp4Sha256:expectedVideoSha,pages:36,frames:360,enlarged:enlarged.length,newActualDiscrepancies:discrepancies.length,finalAcceptance:false}));
