// Isolated S4 helper (2026-10-27); original S3 files remain unchanged.
// Merge only row28's ACTUAL production SVG icons/arrows into a NEW primary file.
// No cards, labels, captions, background or proxy rectangles enter the measurement.
// node THIS [--primary-in <3D-primary.json>] [--out <new-merged.json>]
// --measure-only prints measurements and writes nothing (does not need 3D primary).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const CACHE='/private/tmp/ys/ys-chain-d1b_s4_gpt_20261027',ID='ys-chain-d1b';
assert.equal(process.env.EM_FILM_CACHE??CACHE,CACHE);process.env.EM_FILM_CACHE=CACHE;
const args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];},measureOnly=args.includes('--measure-only'),verifyOnly=args.includes('--verify-existing');
const input=path.resolve(opt('--primary-in')??path.join(CACHE,'blender/primary.json')),output=path.resolve(opt('--out')??path.join(CACHE,'blender/primary-with-row28_s4_gpt_20261027.json')),metadata=output.replace(/\.json$/, '')+'_metadata.json';
assert.notEqual(input,output,'The original3D primary file must be preserved');
if(!measureOnly&&!verifyOnly)for(const f of [output,metadata])assert.equal(fs.existsSync(f),false,'Preserve existing measurement output: '+f);
const data=JSON.parse(fs.readFileSync(path.join(CACHE,'blender/data.json'),'utf8')),plan=JSON.parse(fs.readFileSync(path.join(CACHE,'plan.json'),'utf8'));
const cue=data.cues.find(c=>c.row===28);assert.equal(cue.key,'pump:same');
const entry=plan.find(p=>p.id===ID),q=entry.scenes.flatMap(s=>s.cues).find(q=>q.diagram==='cd1b-'+cue.key);assert.ok(q);
const supplied=JSON.parse(fs.readFileSync(new URL('../blender/desk_assets/d1b/plan.json',import.meta.url),'utf8'));
assert.equal(JSON.stringify(plan),JSON.stringify(supplied),'Canonical script/captions must be unchanged');
const {overlayD1b}=await import('./desk-d1b-overlay_s4_gpt_20261027.mjs');
function actualIcons(svg){
 // Keep each marked production group WITH all ancestor group opacities and
 // transforms. Drop every sibling, including the paper card and title.
 const stack=[],icons=[],tag=/<g\b[^>]*>|<\/g\s*>/g;let m;
 while((m=tag.exec(svg))){
  if(m[0].startsWith('</')){
   const open=stack.pop();assert.ok(open,'Unbalanced production SVG group');
   if(open.primary)icons.push(open.parents.join('')+svg.slice(open.start,tag.lastIndex)+'</g>'.repeat(open.parents.length));
  }else stack.push({start:m.index,tag:m[0],parents:stack.map(x=>x.tag),primary:/\bdata-s4-primary="row28-icon"/.test(m[0])});
 }
 assert.equal(stack.length,0);assert.ok(icons.length<=3);
 for(const icon of icons)assert.ok(icon.includes('scale(1.3)'),'Must measure the actual1.3x production icon');
 return {svg:icons.join(''),count:icons.length};
}
const memo=new Map();
async function bounds(icons){
 if(memo.has(icons))return memo.get(icons);
 if(!icons){memo.set(icons,null);return null;}
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">'+icons+'</svg>';
 assert.ok(!/NaN|undefined|Infinity/.test(svg));
 const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().extractChannel('alpha').raw().toBuffer({resolveWithObject:true});
 assert.equal(info.width,1080);assert.equal(info.height,1920);assert.equal(info.channels,1);
 let x0=1080,y0=1920,x1=-1,y1=-1;
 for(let y=0;y<1920;y++)for(let x=0;x<1080;x++)if(data[y*1080+x]>0){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 const box=x1<0?null:[x0,y0,x1+1,y1+1];memo.set(icons,box);return box;
}
const primary=measureOnly?{}:JSON.parse(fs.readFileSync(input,'utf8')),records=[];let filled=0,empty=0;
for(let j=Math.ceil(cue.start*30-1e-8);j/30<cue.end-1e-10;j++){
 const t=j/30,icons=actualIcons(overlayD1b({t,cue:q,clip:{id:ID},anchor:()=>null})),box=await bounds(icons.svg);
 if(verifyOnly){
  if(box)assert.deepEqual(primary[String(j)],[...box,'缶・ストロー・ポンプの3図'],'Existing row28 bbox differs from the current actual production SVG at '+j);
  else assert.ok(primary[String(j)]==null,'No production icon is visible at '+j);
 }else if(!measureOnly)assert.ok(primary[String(j)]==null,'Row28 already has a nonempty primary; do not overwrite it');
 if(box){if(!verifyOnly)primary[String(j)]=[...box,'缶・ストロー・ポンプの3図'];filled++;}else empty++;
 records.push({frame:j,time:t,visibleProductionIconGroups:icons.count,bounds:box,widthRatio:box?(box[2]-box[0])/1080:null,heightRatio:box?(box[3]-box[1])/1920:null});
}
const fully=records.find(r=>r.time>=277.8&&r.bounds),summary={stage:'S4',episode:'d1b',row:28,cue:cue.key,coordinateSpace:[1080,1920],boundsConvention:'Painted alpha>0, left/top inclusive and right/bottom EXCLUSIVE',method:'Actual marked production1.3x SVG groups and inherited opacity; raster alpha bounds',excluded:['card background','card shadow','card title','other labels','captions','3D background'],frames:records.length,filled2D:filled,emptyBeforeAppearance:empty,fullyVisibleAt:fully?.time,fullyVisibleBounds:fully?.bounds,fullyVisibleWidthRatio:fully?.widthRatio,measureOnly,verifyExisting:verifyOnly,input:measureOnly?null:input,output:measureOnly||verifyOnly?null:output,original3DFileChanged:false,visualApproval:false};
if(!measureOnly&&!verifyOnly){
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.writeFileSync(output,JSON.stringify(primary,null,1)+'\n',{flag:'wx'});
 fs.writeFileSync(metadata,JSON.stringify({...summary,records},null,1)+'\n',{flag:'wx'});
}
console.log(JSON.stringify(summary,null,2));

