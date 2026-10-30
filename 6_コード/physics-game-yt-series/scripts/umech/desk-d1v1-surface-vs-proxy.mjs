// Pair exact-frame evaluated surfaces and untouched original image features.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const [surfaceFile,featuresFile,out]=process.argv.slice(2);
if(!surfaceFile||!featuresFile||!out)throw Error('D1 semantic-surface.json features.json fresh-output.json required');
if(fs.existsSync(out))throw Error('Existing D1 surface/proxy evidence preserved');
const surfaces=JSON.parse(fs.readFileSync(surfaceFile)),features=JSON.parse(fs.readFileSync(featuresFile));
if(surfaces.episode!=='D-1'||features.episode!=='D-1')throw Error('D1 evidence only');
const rows=[];
for(const s of surfaces.rows){
 const f=features.rows.find(f=>Math.round(f.time*30)===Math.round(s.time*30));
 if(!f)continue;
 rows.push({cue:s.cue,time:s.time,imageTime:f.time,actualHero:s.semanticPrincipal,actualPose:s.actualPose,physicalSurfaceWidthRatio:s.actualSurface?.widthRatio??null,conservativeBoundingCornerWidthRatio:s.conservativeBoundingCorners?.widthRatio??null,physicalChecks:s.physicalChecks,physicalSurfaceBounds:s.actualSurface,criticalSurfaceBounds:s.criticalSurface,criticalChecks:s.criticalChecks,subjectProxy:f.subject,woodRatio:f.wood,busyRatio:f.busy,actualImage:f.frame,actualImageSha256:createHash('sha256').update(fs.readFileSync(f.frame)).digest('hex')});
}
if(rows.length<3)throw Error('Need at least three exact-frame real-surface/image pairs');
const record={episode:'D-1',revision:surfaces.revision,status:'Real evaluated model widths and unchanged original image heuristic are different measured quantities. No waiver.',sourceSha256:surfaces.sourceSha256,originalFeatures:features.originalFeatures,originalFeaturesSha256:features.originalFeaturesSha256,surfacesEvidence:surfaceFile,featuresEvidence:featuresFile,pairedSamples:rows.length,totalSurfaceSamples:surfaces.rows.length,unpairedSurfaceSamples:surfaces.rows.length-rows.length,originalThresholdsUnchanged:true,strictInspectorWaiver:false,finalVideoGateComplete:false,rows};
fs.writeFileSync(out,JSON.stringify(record,null,1));
console.log(JSON.stringify({episode:record.episode,revision:record.revision,pairedSamples:rows.length,strictInspectorWaiver:false,rows:rows.map(r=>({time:r.time,actualHero:r.actualHero,physicalWidth:r.physicalSurfaceWidthRatio,originalSubjectProxy:r.subjectProxy,wood:r.woodRatio,busy:r.busyRatio}))},null,1));
