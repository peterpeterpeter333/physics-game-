// Preparation evidence only. Does not start Blender, encode, or mark QA passed.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const W=process.cwd(),C='/private/tmp/ys/ys-chain-e1v1';
const target=C+'/e1v1-production-r9-preparation-freeze-v2.json';
assert(!fs.existsSync(target),'Preserve the previous preparation freeze');
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=JSON.parse(fs.readFileSync(C+'/e1v1-r9-source-freeze.json'));
for(const [p,h]of Object.entries(old.files))assert.equal(sha(path.join(W,p)),h,p);
assert.equal(sha(C+'/ys-chain-e1v1.wav'),old.canonicalVoiceSHA256);
const own=[
 'scripts/blender/desk_axes_e1_r9_production.py',
 'scripts/blender/desk_axes_e1_r9_final_dimensions.py',
 'scripts/umech/review-desk-e1v1-final.mjs',
 'scripts/umech/freeze-desk-e1v1-production.mjs',
 'docs/video-revision-20260924/deep/E-1_r9本番と最終検収の手順_ChatGPT.md',
];
const external=[
 'scripts/umech/desk-e1v1-export.mjs',
 'scripts/umech/desk-axes-frame.mjs',
 'scripts/umech/desk-axes-render-entry.mjs',
 'scripts/umech/desk-axes-caption165-loader.mjs',
 'scripts/umech/desk-quality-gate.mjs',
 'scripts/umech/desk-quality-gate-frames.py',
];
const instructionRoot='/Users/ken/Downloads/physics-quest-ChatGPT引き継ぎ_技術の疑問の鎖_2026-10-22';
const instructions=[instructionRoot+'/07_軸の1本目_共通の制作指示.md',instructionRoot+'/E-1/E-1_制作指示書.md'];
const result={id:'ys-chain-e1v1',time:new Date().toISOString(),phase:'production preparation only; no final MP4 QA claimed',sourceFreeze:C+'/e1v1-r9-source-freeze.json',sourceFreezeSha256:sha(C+'/e1v1-r9-source-freeze.json'),sourceR9Unchanged:true,canonicalVoiceSha256:old.canonicalVoiceSHA256,files:Object.fromEntries(own.map(p=>[p,sha(path.join(W,p))])),renderAndTestDependenciesObserved:Object.fromEntries(external.map(p=>[p,sha(path.join(W,p))])),instructionsReadInFullAgain:Object.fromEntries(instructions.map(p=>[p,sha(p)])),productionPlan:C+'/e1v1-r9-production-plan.json',productionPlanSha256:sha(C+'/e1v1-r9-production-plan.json'),productionFrameFolderExists:fs.existsSync(C+'/blender/desk'),productionMP4Exists:fs.existsSync('/private/tmp/ys/ys-chain-e1v1-render/out/ys-chain-e1v1.mp4'),approvalScope:{captionMedianUpperLimit:1.65,original7bAndSparseNG:'preserved; only individually evidenced physical-size and actual-image disagreements may be supplemented; no threshold edits',canonicalScriptVoiceCaptions:'unchanged',faceInstructionConflict:'root owns precise approved disposition'},gpuScheduling:'root only',commitPush:false};
fs.writeFileSync(target,JSON.stringify(result,null,2));
console.log(JSON.stringify({target,sourceR9Unchanged:true,files:own.length,productionFrameFolderExists:result.productionFrameFolderExists,productionMP4Exists:result.productionMP4Exists},null,2));
