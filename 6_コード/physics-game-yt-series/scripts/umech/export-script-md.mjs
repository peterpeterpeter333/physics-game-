// Export film scripts (docs/video-revision-20260924/ytseries/<id>.mjs) to Markdown for outside review (ChatGPT).
// Usage: node scripts/umech/export-script-md.mjs <outDir> <script.mjs>...
// Writes <outDir>/<clip id>.md: title, condition, the file's header comments (design notes and checks),
// then every cue numbered with scene heading, subtitle, reading, diagram key and pause.
// If /private/tmp/ys/<clip id>/review/page-*.jpg exist, copies them to <outDir>/review/<clip id>/ and links them.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const [outDir,...files]=process.argv.slice(2);
if(!outDir||!files.length){console.error('usage: export-script-md.mjs <outDir> <script.mjs>...');process.exit(1);}
fs.mkdirSync(outDir,{recursive:true});

for(const file of files){
  const src=fs.readFileSync(file,'utf8');
  const header=src.split('\n').filter(l=>l.startsWith('//')).map(l=>l.replace(/^\/\/ ?/,'')).join('\n');
  const {clips}=await import(pathToFileURL(path.resolve(file)).href);
  for(const clip of clips){
    const lines=[`# ${clip.title}`,'',`- ID：\`${clip.id}\``,`- 台本ファイル：\`${path.resolve(file)}\``];
    if(clip.condition)lines.push(`- 条件：${clip.condition}`);
    lines.push('','## 設計メモ（台本ファイル冒頭のコメント）','','```',header,'```','','## 台本（cue ごと）','');
    let n=0;
    for(const sc of clip.scenes){
      lines.push(`### ${sc.heading}`,'');
      for(const c of sc.cues){
        n++;
        lines.push(`**${String(n).padStart(2,'0')}** \`${c.diagram||c.display}\`${c.pause?`（間 ${c.pause} 秒）`:''}`);
        lines.push(`- 字幕：${c.subtitle}`);
        lines.push(`- 読み：${c.reading}`);
        if(c.display==='equation'&&c.formula?.length)lines.push(`- 式：\`${[].concat(c.formula).join(' / ')}\``);
        lines.push('');
      }
    }
    const rv=`/private/tmp/ys/${clip.id}/review`;
    if(fs.existsSync(rv)){
      const pages=fs.readdirSync(rv).filter(f=>/^page-\d+\.jpg$/.test(f)).sort();
      if(pages.length){
        const dst=path.join(outDir,'review',clip.id);fs.mkdirSync(dst,{recursive:true});
        lines.push('## 画面の確認用（各 cue の終わりのコマ）','');
        for(const p of pages){fs.copyFileSync(path.join(rv,p),path.join(dst,p));lines.push(`![${p}](review/${clip.id}/${p})`);}
        lines.push('');
      }
    }
    lines.push(`（全 ${n} 文）`,'');
    fs.writeFileSync(path.join(outDir,`${clip.id}.md`),lines.join('\n'));
    console.log(`wrote ${clip.id}.md (${n} cues)`);
  }
}
