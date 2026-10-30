// Independent recalculation against the frozen delivered data; no data builder
// is imported, and no original document, input, image, or inspector is written.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const W=process.cwd(); assert(W.endsWith('/work/physics-game-yt-series'));
const out=W+'/outputs/axes-20261023/independent-number-check-20261024.json';
assert(!fs.existsSync(out));
const sources={},records=[];
function data(id,suffix='') {
 const p='/private/tmp/ys/ys-chain-'+id+'v1'+suffix+'/blender/data.json';
 const bytes=fs.readFileSync(p); sources[id]={path:p,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
 return JSON.parse(bytes);
}
function near(label,actual,expected,tolerance=1e-8) {
 assert(Number.isFinite(actual)&&Number.isFinite(expected));
 assert(Math.abs(actual-expected)<=tolerance,label);
 records.push({label,actual,independentExpected:expected,tolerance,pass:true});
}
function equal(label,actual,expected) {
 assert.deepEqual(actual,expected,label);records.push({label,actual,independentExpected:expected,pass:true});
}
const rad=x=>x*Math.PI/180,deg=x=>x*180/Math.PI;
const B=data('b1').b1;
near('B London: atan(2 tan(latitude))',B.dipLondon,deg(Math.atan(2*Math.tan(rad(51.5)))));
near('B pole-star altitude',B.star,51.5);
near('B island chord angle',B.island,(90-51.5)/2);
near('B measured 71 degrees 50 minutes',B.measurement,71+50/60);
near('B southern answer is upward (negative dip)',B.south,deg(Math.atan(2*Math.tan(rad(-30)))));
equal('B score sequence',B.score,[[0,0],[0,1],[0,3]]);
equal('B needle count',B.needles.length,12);
for(const [i,n] of B.needles.entries()) {
 const r=[Math.cos(rad(n.lat))*Math.cos(rad(n.lon)),Math.cos(rad(n.lat))*Math.sin(rad(n.lon)),Math.sin(rad(n.lat))];
 for(let k=0;k<3;k++) {
  near('B needle '+i+' radial component '+k,n.r[k],r[k]);
  // Dipole m points south: m=(0,0,-1). This check is independent of
  // renderer quaternion choices and does not certify what pixels show.
  near('B needle '+i+' field component '+k,n.B[k],-3*r[2]*r[k]+(k===2?1:0));
 }
}
equal('B field-line count',B.fieldLines.length,16);
for(const [i,line] of B.fieldLines.entries()) {
 const values=line.map(([x,z])=>Math.hypot(x,z)**3/(x*x));
 assert(values.every(Number.isFinite));
 const L=values[0];for(const v of values)assert(Math.abs(v-L)<1e-8);
 records.push({label:'B line '+i+': r=L sin²(theta)',samples:line.length,L,pass:true,
  doesNotCheckAnimatedArrowDirection:true});
}
const C=data('c1');
for(const [key,v]of Object.entries({sum:27+18,ones:7+8,tens:2+1+1,carryInput:9999,carryAnswer:9999+1,challengeAnswer:999+1,multiply:7+7+7}))near('C '+key,C.numbers[key],v);
function carry(n){let count=0;for(;n%10===9;n=Math.floor(n/10))count++;return{falls:count,movingGears:count+1};}
near('C 9999 carry falls',C.numbers.carryFalls,carry(9999).falls);
near('C 9999 moving gears',C.numbers.movingGears,carry(9999).movingGears);
near('C 999 carry falls',C.numbers.challengeFalls,carry(999).falls);
equal('C score sequence',C.numbers.scores,[[0,0],[0,1],[0,2],[1,2]]);
const events=C.events;
function valueAt(t){let v=0;for(const event of events)if(event.time<=t)v=event.value;return v;}
for(const [key,value]of [['gear:27',27],['carry:45',45],['arm:chain',10000]]) {
 const cue=C.cues.find(c=>c.key===key);assert(cue);near('C '+key+' end value',valueAt(cue.end-.1),value);
}
const D=data('d1','-render');
for(const [key,v]of Object.entries({steamML:15*1700,steamL:15*1700/1000,radiusCm:53/2,areaCm2:(53/2)**2*3.14,palms:2200/100,kg:100*22,horses:2200/500,areaRatio:(.045/.015)**2,arrowsWide:2*(.045/.015)**2,fujiRatio:.63}))near('D '+key,D.numbers[key],v);
equal('D score sequence',D.numbers.scores,[[1,0],[1,1],[1,2]]);
const E=data('e1');
near('E degrees/hour',E.degreesPerHour,360/24);
near('E minutes/degree',E.minutesPerDegree,60/(360/24));
near('E equatorial km/degree',E.equatorialKm,40000/360);
near('E km/degree at 50 degrees north',E.km50,40000/360*Math.cos(rad(50)));
near('E latitude cosine',E.cos50,Math.cos(rad(50)));
near('E London 10 when local noon: east degrees',E.challenge.angle,(12-10)*360/24);
equal('E challenge direction',E.challenge.direction,'east');
for(const n of E.latitudes)near('E star altitude at '+n.latitude,n.altitude,deg(Math.asin(Math.sin(rad(n.latitude)))));
equal('E score sequence',E.scores.map(s=>[s.make,s.brk]),[[1,0],[1,1],[2,1]]);
for(const [id,src]of Object.entries(sources))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(src.path)).digest('hex'),src.sha256,id+' data changed');
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),sources,independentChecks:records.length,allPass:true,records,
 scope:'Independent arithmetic, dipole sample geometry and frozen event values only. No original builder imported, no current film visibility certified.',
 caveats:['Rounded historical comparisons such as about two tonnes, four horses and 70 km are deliberately approximations, not exact equalities.',
  'A numerical proof is not a substitute for checking the animated pole sequence, actual captions, framing or audible output.'],
 originalInputsUnchanged:true,finalFourFilmAcceptance:false},null,1)+'\n',{flag:'wx'});
console.log(JSON.stringify({out,independentChecks:records.length,allPass:true}));
