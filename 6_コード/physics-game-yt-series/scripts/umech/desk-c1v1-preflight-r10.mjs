// C1 current contact revision, preserving every previous trial/probe artifact.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source='/private/tmp/ys/ys-chain-c1v1',rev=process.env.C1_FINAL_REV??'r10',cache=source+'/'+rev+'-probe-preflight',mode=process.argv[2];
if(!['r10','r11'].includes(rev))throw Error('Unknown C1 final revision');
if(mode!=='probe')throw Error('Expected probe');
fs.mkdirSync(cache+'/blender',{recursive:true});
function link(s,t){if(fs.existsSync(t)){if(fs.realpathSync(t)!==fs.realpathSync(s))throw Error('Unexpected preflight link '+t);}else fs.symlinkSync(s,t);}
for(const f of ['plan.json','ys-chain-c1v1.json','phrase-times.json'])link(source+'/'+f,cache+'/'+f);
link(source+'/blender/data.json',cache+'/blender/data.json');link(source+'/blender/probe1s-'+rev,cache+'/blender/probe1s');
const env={...process.env,EM_FILM_CACHE:cache};
const samples=JSON.parse(fs.readFileSync(source+'/blender/probe1s-'+rev+'/qa-samples.json'));
if(samples.frames.length!==437||new Set(samples.frames).size!==437||samples.criticalFrames.length!==27||samples.cueEnds.length!==53)throw Error('Incorrect final QA sample set');
const verify=()=>{for(const [f,h] of Object.entries(samples.sourceSha256))if(createHash('sha256').update(fs.readFileSync(f)).digest('hex')!==h)throw Error('Frozen 3D source changed '+f);};
verify();
function run(bin,args){return spawnSync(bin,args,{env,stdio:'inherit'}).status;}
const nodeExit=run(process.execPath,['scripts/umech/desk-c1v1-probe1s.mjs']);if(nodeExit!==0)throw Error('Actual composition failed '+nodeExit);
const featureExit=run('/Users/ken/Library/Application Support/physics-quest-tools/pyenv/bin/python',['scripts/umech/audit-c1v1-probe1s.py']);
link(source+'/blender/probe1s-'+rev,cache+'/blender/preview');link(source+'/blender/catalog-r10',cache+'/blender/catalog');link(source+'/problem',cache+'/problem');
const comparisonExit=run(process.execPath,['scripts/umech/desk-c1v1-preview.mjs']);if(comparisonExit!==0)throw Error('Current fixed12 comparisons failed '+comparisonExit);
verify();
fs.writeFileSync(cache+'/preflight-'+rev+'-stage.json',JSON.stringify({date:new Date().toISOString(),notFull30fps:true,compositionExit:nodeExit,fixed12ComparisonExit:comparisonExit,originalFeatureExit:featureExit,frozen3dSourceBeforeAfterEqual:true,sourceSha256:samples.sourceSha256,actualFrames:437,critical:27,integerMetrics:361,cueEnds:53,actualJpegCount:samples.actualJpegCount,otherSceneOutputsUnchanged:samples.otherSceneLastOutputsMtimeAndShaUnchanged,raw:source+'/blender/probe1s-'+rev,review:cache+'/probe1s-review-c1v1',fixed12Review:cache+'/gate-c-c1v1',catalogComparison:cache+'/gate-b-c1v1'},null,1));
console.log('C1 '+rev+' all437 actual QA frames, one-second statistics only361; source freeze before/after equal: '+cache);
process.exit(featureExit??1);
