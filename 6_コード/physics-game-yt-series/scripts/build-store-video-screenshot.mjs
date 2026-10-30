// Compose a store graphic from an unmodified, real iPhone simulator capture.
// No app controls, content, or video frames are invented or replaced.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const input = process.argv[2];
if (!input) throw new Error('Pass the real iPhone screenshot PNG path.');
const png = await fs.readFile(input);
const meta = await sharp(png).metadata();
const width=1000, height=Math.round(width*meta.height/meta.width);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1242" height="2688" viewBox="0 0 1242 2688">
<defs><linearGradient id="bg" x2=".7" y2="1"><stop stop-color="#132b46"/><stop offset=".5" stop-color="#151b38"/><stop offset="1" stop-color="#251b43"/></linearGradient><clipPath id="screen"><rect x="121" y="390" width="1000" height="${height}" rx="48"/></clipPath></defs>
<rect width="1242" height="2688" fill="url(#bg)"/>
<g font-family="Hiragino Sans, sans-serif" text-anchor="middle">
<text x="621" y="90" font-size="32" letter-spacing="7" fill="#83e5f7">PHYSICS QUEST</text>
<text x="621" y="211" font-size="80" font-weight="800" fill="#f7f9ff">分かりやすい動画解説</text>
<text x="621" y="295" font-size="38" fill="#c8d9ed">動く図と音声で、物理の「なぜ？」がわかる</text>
</g>
<rect x="111" y="380" width="1020" height="${height+20}" rx="58" fill="#7580a3"/>
<image x="121" y="390" width="1000" height="${height}" clip-path="url(#screen)" xlink:href="data:image/png;base64,${png.toString('base64')}"/>
</svg>`;
await fs.mkdir('docs/store-1.5',{recursive:true});
await sharp(Buffer.from(svg)).flatten({background:'#151b38'}).png().toFile('docs/store-1.5/appstore_03_video.png');
console.log('Created docs/store-1.5/appstore_03_video.png (1242 × 2688, opaque RGB)');
