// A read-only baseline: undo only the eight permitted registration lines in memory.
import {registerHooks} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const id=process.argv.at(-1);
assert(['ys-chain-1-1v6','ys-chain-1-2v2'].includes(id),'Old reference IDs only');
const target=new URL('./desk-frame.mjs',import.meta.url);
const original=fs.readFileSync(target,'utf8');
const lines=['B','C','D','E'].flatMap(letter=>[
 `import {overlay${letter}1v1} from './desk-${letter.toLowerCase()}1v1-overlay.mjs';\n`,
 `OVERLAYS['${letter.toLowerCase()}1v1']=overlay${letter}1v1;\n`
]);
let baseline=original;
for(const line of lines){assert.equal(baseline.split(line).length,2);baseline=baseline.replace(line,'');}
registerHooks({load(url,context,nextLoad){
 const loaded=nextLoad(url,context);if(url!==target.href)return loaded;
 const source=Buffer.isBuffer(loaded.source)||loaded.source instanceof Uint8Array?Buffer.from(loaded.source).toString('utf8'):String(loaded.source);
 assert.equal(source,original);return {...loaded,source:baseline};
}});
