// Read-only arithmetic verification; no data, speech, captions or scene generation.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const C='/private/tmp/ys/ys-chain-d1a_s3_gpt_20261028',a=process.argv.slice(2),opt=k=>{const i=a.indexOf(k);return i<0?null:a[i+1];};
const input=path.resolve(opt('--data')??C+'/blender/data.json'),d=JSON.parse(fs.readFileSync(input,'utf8')),N=d.numbers;
const checks=[];function eq(name,actual,expected,tolerance=0){assert.ok(typeof actual==='number'&&Number.isFinite(actual)&&Math.abs(actual-expected)<=tolerance,name+': '+actual+' != '+expected);checks.push({name,actual,expected,tolerance,pass:true});}
assert.equal(d.episode,'d1a');eq('cue count',d.cues.length,54);eq('rows',new Set(d.cues.map(c=>c.row)).size,40);
eq('duration',d.duration,387.2546666666667,1e-8);eq('spoon mL',N.spoonML,15);eq('expansion factor',N.expansion,1700);
eq('steam mL',N.steamML,N.spoonML*N.expansion);eq('steam L',N.steamL,N.steamML/1000);eq('rounded steam L',N.roundedSteamL,25);assert.ok(Math.abs(N.steamL-N.roundedSteamL)<=.5);
eq('atmosphere kgf/cm2',N.atmosphereKgCm2,1.03);eq('rounded atmosphere kgf/cm2',N.roundedAtmosphereKgCm2,Math.round(N.atmosphereKgCm2));
eq('palm cm2',N.palmCm2,100);eq('diameter cm',N.diameterCm,53);eq('radius cm',N.radiusCm,N.diameterCm/2);eq('pi approximation',N.pi,3.14);
eq('disk area cm2',N.areaCm2,N.radiusCm**2*N.pi,1e-8);eq('rounded disk area cm2',N.roundedAreaCm2,2200);eq('number of palms',N.palms,N.roundedAreaCm2/N.palmCm2);
eq('force weight kg',N.kg,N.palms*100);eq('actual weight tonnes',N.kg/1000,2.2,1e-12);eq('rounded tonnes',N.tonnes,Math.round(N.kg/1000));
eq('horse kg',N.horseKg,500);eq('horse count unrounded',N.horses,N.kg/N.horseKg,1e-12);eq('rounded horse count',N.roundedHorses,Math.round(N.horses));
eq('palm icons',d.palmPositions.length,22);for(const[x,y]of d.palmPositions)assert.ok(Math.hypot(x,y)+.004<.030,'Palm falls outside model disk');
eq('radius ratio',N.radiusRatio,3);eq('area ratio',N.areaRatio,N.radiusRatio**2);eq('arrows ratio',N.arrowsWide/N.arrowsThin,N.areaRatio);eq('Fuji pressure ratio',N.fujiRatio,.63);
const low=d.layerCounts.reduce((a,b)=>a+b,0),high=d.fujiCounts.reduce((a,b)=>a+b,0);eq('Fuji particle-count ratio',high/low,.63,.01);
assert.deepEqual(N.scores,[[1,0]]);
const report={stage:'S3 arithmetic preflight only',input,checks,score:[[1,0]],allAssertionsPassed:true,physicsAndAnimationApproved:false,scriptVoiceCaptionChanged:false};
const out=opt('--out');if(out){const p=path.resolve(out);assert.ok(p.startsWith(C+'/')||p.includes('/outputs/ys-chain-d1a-backup/S3_20261028/'),'Use only the new S3 output area');fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(report,null,2)+'\n',{flag:'wx'});}
console.log(JSON.stringify({input,assertions:checks.length,allAssertionsPassed:true,output:out??null,generatedMovie:false}));

