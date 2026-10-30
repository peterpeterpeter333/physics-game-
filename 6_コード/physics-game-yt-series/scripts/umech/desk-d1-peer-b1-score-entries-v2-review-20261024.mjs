// Preserve actual five-probe eye review; never alter the GUI report or a gate.
import fs from 'node:fs';
import crypto from 'node:crypto';
const base='/private/tmp/ys/ys-chain-b1v1-score-entries-d1-v2-20261024';
const input=base+'/probe/report.json';
const out=base+'/d1-peer-five-probes-actual-review.json';
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(fs.existsSync(out))throw new Error('Preserve earlier actual review');
if(sha(input)!=='bfabd5a13f858058473a6a4d54a8b5f16ae9a11b2ffedd0b53af5863fbefcad8')throw new Error('Reviewed input changed');
const report=JSON.parse(fs.readFileSync(input));
const comments={
  13:'言い伝え0と実験0の両桁が蓋から離れて読める。板は水平移動だけで世界zを変えていない。箱も全体が入る。',
  25:'古い地図と黒い岩が全体で読める。入口の左clipはない。',
  99.5:'蓋の上端から箱の底まで完全に画内。針・文字盤も明瞭。元近接poseへ戻るjumpは数値mapping上もない。',
  122:'ごつごつした石の全周が画内に入り、右clipを解消。形と台が見える。',
  127:'同じ構図のまま丸い球へ変形した状態を読める。削りかすも見える。'
};
const rows=report.actualImages.map(r=>{
 if(!comments[r.time]||sha(r.path)!==r.sha256)throw new Error('Actual reviewed image changed');
 return {...r,actuallyViewed:true,viewedIndividuallyAtFullResolution:true,observation:comments[r.time]};
});
if(rows.length!==5)throw new Error('Expected five actual probes');
const result={reviewer:'D-1 agent, B root-assigned score/entry repair',recordedAt:new Date().toISOString(),scope:'Five actual raw canonical-main probes only, not final encoded MP4',helper:'scripts/blender/desk_axes_b1_score_entries_d1_v2_20261024.py',helperSha256:report.helperSha256,input, inputSha256:sha(input),allFiveActuallyViewed:true,originalFailedTrial:'/private/tmp/ys/ys-chain-b1v1-score-entries-d1-20261024/probe/report.json',originalFailedTrialPreserved:true,physicalActualStates:report.actualSources,replacementOutputs:report.replacementOutputs,minimumWidth:Math.min(...report.physical.map(r=>r.widthRatio)),maximumWidth:Math.max(...report.physical.map(r=>r.widthRatio)),allGuardedStatesPass:report.allGuardedStatesPass,projectionMaximumDifferencePx:report.projectionMaxDifferencePixels,sourceAndProtectedInputsUnchanged:report.sourceAndProtectedInputsUnchanged,originalAndB2RawInventoryUnchanged:report.originalAndB2RawInventoryUnchanged,sourceFunctionsRebound:false,rows,readyForRootAuthorizedDifferenceRender:true,originalInspectorModified:false,blanketWaiver:false,finalAcceptance:false,notConfirmed:['361 actual-source delivery render','All final 30fps frames or final actual MP4', 'Fixed-overlay/caption composition for these five new raw probes','Actual-ear listening','Any new approval of original 7/7b failures']};
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,sha256:sha(out),rows:rows.length,finalAcceptance:false}));
