// Evidence only: actual model bounds alongside unchanged original features.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const [boundsFile,featuresFile,out]=process.argv.slice(2);
if(!boundsFile||!featuresFile||!out)throw Error('D1 bounds.json features.json fresh-output.json required');
if(fs.existsSync(out))throw Error('Existing D1 physical/proxy evidence preserved');
const bounds=JSON.parse(fs.readFileSync(boundsFile)),features=JSON.parse(fs.readFileSync(featuresFile));
if(bounds.episode!=='D-1'||features.episode!=='D-1')throw Error('D1 evidence only');
const rows=bounds.rows.map(b=>{
 const f=features.rows.find(f=>Math.round(f.time*30)===Math.round(b.time*30));
 if(!f)throw Error('Missing actual original-feature sample at '+b.time);
 return {time:b.time,actualHero:b.actualHero,actualPose:b.actualPose,physicalWidthRatio:b.hero.widthRatio,physical40to70:b.physicalSize40to70,physicalBounds:b.hero,criticalBounds:b.critical,criticalClearOfCaption:b.criticalClearOfCaption,subjectProxy:f.subject,woodRatio:f.wood,busyRatio:f.busy,actualImage:f.frame,actualImageSha256:createHash('sha256').update(fs.readFileSync(f.frame)).digest('hex')};
});
const record={episode:'D-1',revision:bounds.revision,status:'Actual physical width and unchanged image heuristic are separately reported; neither is waived',sourceSha256:bounds.sourceSha256,originalFeatures:features.originalFeatures,originalFeaturesSha256:features.originalFeaturesSha256,boundsEvidence:boundsFile,featuresEvidence:featuresFile,originalThresholdsUnchanged:true,strictInspectorWaiver:false,finalVideoGateComplete:false,rows};
fs.writeFileSync(out,JSON.stringify(record,null,1));console.log(JSON.stringify(record,null,1));
