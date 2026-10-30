// Isolated, immutable-input cache setup. Never writes into supplied caches/assets.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const ep=process.argv[2]??'d1b';
assert.ok(['d1a','d1b'].includes(ep));
const id='ys-chain-'+ep, root=fileURLToPath(new URL('../../',import.meta.url));
const source=path.join(root,'scripts/blender/desk_assets',ep);
const cache=process.env.EM_FILM_CACHE??'/private/tmp/ys/'+id+'_gpt_20261026';
assert.equal(path.resolve(cache),'/private/tmp/ys/'+id+'_gpt_20261026','Only isolated GPT cache is writable');
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.mkdirSync(cache,{recursive:true});
for(const rel of ['plan.json',id+'.json','phrase-times.json','timed-selection.json','prosody.txt','speech']){
 const src=path.join(source,rel),dst=path.join(cache,rel);
 assert.ok(fs.existsSync(src),'Missing supplied asset '+src);
 if(!fs.existsSync(dst))fs.symlinkSync(src,dst);
 assert.equal(fs.realpathSync(dst),fs.realpathSync(src),'Unexpected pre-existing input '+dst);
}
const srcVoice=path.join(source,id+'.wav'),voice=path.join(cache,id+'.voice.wav');
if(!fs.existsSync(voice))fs.copyFileSync(srcVoice,voice,fs.constants.COPYFILE_EXCL);
assert.equal(sha(voice),sha(srcVoice),'Supplied voice differs');
for(const d of ['blender/tex','blender/desk','blender/preview','problem','out','gate'])fs.mkdirSync(path.join(cache,d),{recursive:true});
const rec={episode:ep,id,cache,source,voiceSha256:sha(voice),protectedInputs:Object.fromEntries(['plan.json',id+'.json','phrase-times.json','timed-selection.json',id+'.wav'].map(f=>[path.join(source,f),sha(path.join(source,f))])),noVoiceGeneration:true,noExistingCacheWrites:true};
fs.writeFileSync(path.join(cache,'immutable-inputs_gpt_20261026.json'),JSON.stringify(rec,null,2));
console.log(JSON.stringify(rec,null,2));
