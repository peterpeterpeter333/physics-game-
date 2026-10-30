// Creates only the new S3 map asset; the original texture/material are not touched.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const cache='/private/tmp/ys/ys-chain-d1b_s3_gpt_20261026',out=path.join(cache,'blender/tex/d1-europe-s3.png');
assert.equal(process.env.EM_FILM_CACHE??cache,cache);assert.equal(fs.existsSync(out),false,'Preserve an existing S3 map');
fs.mkdirSync(path.dirname(out),{recursive:true});
await sharp(new URL('./desk-d1b-europe_s3_20261026.svg',import.meta.url).pathname).png().toFile(out);
console.log(JSON.stringify({file:out,resolution:[1200,840],ukAnchorNormalizedTopLeft:[.25,.32],schematic:true,labelsInTexture:false}));
