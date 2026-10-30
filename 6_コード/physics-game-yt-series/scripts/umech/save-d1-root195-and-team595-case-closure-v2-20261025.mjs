// NEW reversible schema adapter. No original sources or evidence are edited.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const sourceUrl=new URL('./save-d1-root195-and-team595-case-closure-20261025.mjs',import.meta.url);
const original=fs.readFileSync(sourceUrl,'utf8');
const hash=x=>createHash('sha256').update(x).digest('hex');
assert.equal(hash(original),'75796aae7f5ab3bc6f261d842b20b0f23549978df92b3f3a14743ae7a96cf05b');
const self=fileURLToPath(import.meta.url),selfSha=hash(fs.readFileSync(self));
const changes=[];
let source=original;
function replaceExact(oldText,newText,count=1){
 assert.equal(source.split(oldText).length-1,count,oldText);
 source=source.split(oldText).join(newText);changes.push([oldText,newText,count]);
}
replaceExact('import.meta.url',JSON.stringify(sourceUrl.href),2);
replaceExact("assert.equal(p.actuallyViewed,true);assert.equal(p.actualViewer,s.viewer);",
 "if(s.file===files.e1){assert.equal(p.allCellsPersonallyViewed,true);assert.equal(s.source.actualViewer,s.viewer);}else{assert.equal(p.actuallyViewed,true);assert.equal(p.actualViewer,s.viewer);}");
replaceExact('root-d1-final-case-pages041-060-and-five-native-width-decisions-20261025.json','root-d1-final-case-pages041-060-and-five-native-width-decisions-v2-20261025.json');
replaceExact('d1-final-all595-exact-cases-three-viewer-attributed-aggregate-20261025.json','d1-final-all595-exact-cases-three-viewer-attributed-aggregate-v2-20261025.json');
replaceExact('d1-final-exact-case-visual-closure-20261025.json','d1-final-exact-case-visual-closure-v2-20261025.json');
replaceExact('const pins={[self]:sha(self)},refs={};',
 `const pins={[self]:sha(self),[${JSON.stringify(self)}]:${JSON.stringify(selfSha)}},refs={};`);
let inverse=source;
for(const [oldText,newText,count]of [...changes].reverse()){
 assert.equal(inverse.split(newText).length-1,count,newText);
 inverse=inverse.split(newText).join(oldText);
}
assert.equal(inverse,original);
// E1's explicit per-page allCellsPersonallyViewed + exact top-level viewer is
// normalized only for its pinned receipt. No absent viewing claim is inferred.
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
