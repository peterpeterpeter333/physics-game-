// Pre-queue cost estimate and exhaustive C17 delivered-pose elevation count.
// Runtime Blender matrix/geometry guards remain authoritative for C19 drawing.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const R='/private/tmp/ys/ys-chain-c1v1-camera-semantic-final-r17',out=R+'/c1-r19-static-pose-estimate.json';assert(!fs.existsSync(out));
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),proof=read(R+'/camera-patch.json'),data=read(R+'/blender/data.json'),keys=[],sm=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
for(const c of data.cues){
 if(!keys.length)keys.push({t:0,p:c.pose});
 else if(JSON.stringify(c.pose)!==JSON.stringify(keys.at(-1).p)){const move=c.key==='arm:domino'?.8:c.move,start=c.key==='desk:revolt'?15.96-move:c.start;keys.push({t:start,p:keys.at(-1).p},{t:start+move,p:c.pose});}
 keys.push({t:c.end,p:c.pose});
}keys.push({t:data.duration+.5,p:data.cues.at(-1).pose});
function original(t){for(let i=0;i<keys.length-1;i++){const a=keys[i],b=keys[i+1];if(a.t<=t&&t<b.t){const u=sm((t-a.t)/Math.max(1e-9,b.t-a.t));return a.p.map((x,k)=>x+(b.p[k]-x)*u)}}return keys.at(-1).p;}
function pose(ref){
 if(proof.r17ActualSourceFrames.includes(ref))return data.cameras.desk;
 const t=ref/30,r=proof.ranges.find(r=>r.start<=t&&t<r.end);if(!r)return original(t);
 const p=r.targetPose.slice(),a=r.cue==='carry:simple'?.8:['hard:9999','arm:wait','ch:intro'].includes(r.cue)?1.02:r.cue==='gear:box'?1.04:1.1;p[3]*=a+(1-a)*sm((t-r.start)/(r.moveEnd-r.start));return p;
}
function panelVisible(p){
 const az=p[4]*Math.PI/180,el=p[5]*Math.PI/180,u=[Math.sin(az)*Math.cos(el),-Math.cos(az)*Math.cos(el),Math.sin(el)],right=[Math.cos(az),Math.sin(az),0],up=[-Math.sin(az)*Math.sin(el),Math.cos(az)*Math.sin(el),Math.cos(el)],cam=p.slice(0,3).map((x,k)=>x+p[3]*u[k]),dot=(a,b)=>a.reduce((v,x,k)=>v+x*b[k],0),f=1920*p[6]*.78/36;
 let poly=[[.57,1.235,.41],[.93,1.235,.41],[.93,1.235,.69],[.57,1.235,.69]].map(w=>{const v=w.map((x,k)=>x-cam[k]),z=-dot(v,u);return [540*z+f*dot(v,right),844.8*z-f*dot(v,up),z]});
 for(const fn of [v=>v[0],v=>1080*v[2]-v[0],v=>v[1],v=>1920*v[2]-v[1],v=>v[2]-.01,v=>30-v[2]]){const next=[];for(let k=0;k<poly.length;k++){const a=poly[k],b=poly[(k+1)%poly.length],fa=fn(a),fb=fn(b);if(fa>=0)next.push(a);if((fa>=0)!==(fb>=0))next.push(a.map((x,i)=>x+(b[i]-x)*fa/(fa-fb)));}poly=next;if(!poly.length)return false;}
 const xy=poly.map(v=>[v[0]/v[2],v[1]/v[2]]);return Math.abs(xy.reduce((sum,a,k)=>{const b=xy[(k+1)%xy.length];return sum+a[0]*b[1]-a[1]*b[0]},0))/2>1;
}
const pointCue=data.cues.find(c=>c.key==='dad:price'),scoreOld=data.effects.price,scoreNew=pointCue.voiceEnd+.15,scoreEnd=data.cues.find(c=>c.key==='dad:shown').start,scoreChanged=j=>j/30>=scoreOld&&j/30<scoreEnd;
const scorePhase=j=>!scoreChanged(j)?'none':j/30<scoreNew?'zero':j/30<scoreNew+.45?'pulse:'+j:'one';
const seen=new Map(),groups=[],allPoses=[];
for(let j=0;j<10814;j++){
 const actual=proof.replacementFrameToActualPatchFrame[j],key=(actual===undefined?'original:'+proof.originalHeldSourceMap[j]:'C17actual:'+actual)+'|semantic:'+proof.deliveredSemanticSourceMap[j]+'|score:'+scorePhase(j);
 if(!seen.has(key)){seen.set(key,groups.length);groups.push({frame:j,outputs:[]});}groups[seen.get(key)].outputs.push(j);allPoses.push(pose(proof.deliveredSemanticSourceMap[j]));
}
const byKey=Object.fromEntries(data.cues.map(c=>[c.key,c])),selected=[],reasonCounts={paper23:0,eight:0,picture:0,delayedPoint:0};
for(const g of groups){const t=proof.deliveredSemanticSourceMap[g.frame]/30,reasons=[];if(t>=byKey['desk:pile'].start&&t<byKey['son:idea'].start)reasons.push('paper23');if(t>=byKey['hard:crack'].start&&t<byKey['hard:judge'].start)reasons.push('eight');if(panelVisible(allPoses[g.frame]))reasons.push('picture');if(scoreChanged(g.frame))reasons.push('delayedPoint');if(reasons.length){selected.push({...g,reasons});for(const r of reasons)reasonCounts[r]++;}}
const bounds=read(R+'/final-held-dimensions.json');let err=0;for(const p of bounds.samples){const v=allPoses[p.frame];for(let k=0;k<7;k++)err=Math.max(err,Math.abs(v[k]-p.cameraPose[k]));}assert(err<1e-10);
const topFrames=allPoses.filter(p=>p[5]>=65).length,moving=allPoses.slice(1).filter((p,i)=>JSON.stringify(p)!==JSON.stringify(allPoses[i])).length;assert(topFrames/10814<=.2);
const report={date:new Date().toISOString(),scope:'Before GPU cost estimate, not runtime actual-image or C19 approval',base:R,baseProofSha256:sha(R+'/camera-patch.json'),staticSourceSha256:sha(new URL(import.meta.url)),method:'Exact C17 semantic-held output pose reconstruction, validated all768 existing physical samples. All10814 output elevations counted. Background frustum estimate uses fixed source AUTO36mm/lens0.78/shift_y−.06; future Blender calc_matrix_camera is authoritative. C19 fitted paper/eight poses are not yet known.',existingPhysicalPoseSamplesValidated:bounds.samples.length,maximumPoseComponentDifference:err,actualHeldSourceGroups:groups.length,estimatedNewActualSources:selected.length,estimatedReplacedOutputFrames:selected.reduce((n,g)=>n+g.outputs.length,0),estimatedReasonCounts:reasonCounts,estimatedDrawSecondsAtHistorical1secondPerImage:selected.length,topFrames,topRatio:topFrames/10814,topDefinition:'Actual delivered camera elevation>=65 degrees, all10814 outputs, not the original image-estimated wood_top metric14.8%',movingFrames:moving,movingRatio:moving/10814,allDeliveredPoses:allPoses,estimatedSources:selected,notOriginalQualityGate:true,automaticAcceptance:false};
fs.writeFileSync(out,JSON.stringify(report,null,1));console.log(JSON.stringify(Object.fromEntries(Object.entries(report).filter(([k])=>!['allDeliveredPoses','estimatedSources'].includes(k))),null,1));
