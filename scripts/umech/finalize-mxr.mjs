// Apply the small visual correction, add chapters, and verify full decoding.
import {readFileSync,writeFileSync,renameSync,statSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const cache=process.env.EM_FILM_CACHE,out=process.env.FILM_OUTPUT,ffmpeg=process.env.FFMPEG;
const patch=JSON.parse(readFileSync(cache+'/axes-patch.json'));
const input=path.join(out,'exp-maxwell-revised.mp4');
const target=path.join(out,'マクスウェル方程式_改訂版.mp4');
const run=args=>{const r=spawnSync(ffmpeg,args,{encoding:'utf8',maxBuffer:8*1024*1024});if(r.status!==0)throw Error(r.stderr||'ffmpeg failed');return r.stderr;};
run(['-y','-hide_banner','-loglevel','error','-i',input,'-i',cache+'/axes-patch.mp4','-i',path.join(out,'chapters.ffmetadata'),'-filter_complex',`[1:v]setpts=PTS-STARTPTS+${patch.start}/TB[p];[0:v][p]overlay=eof_action=pass:repeatlast=0:enable='gte(t,${patch.start})*lt(t,${patch.end})'[v]`,'-map','[v]','-map','0:a:0','-map_metadata','2','-map_chapters','2','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart','-progress',cache+'/finalize-progress.txt',target]);
const decode=run(['-hide_banner','-v','error','-xerror','-i',target,'-map','0:v:0','-map','0:a:0','-f','null','-']);
const info=run(['-hide_banner','-i',target,'-af','volumedetect','-vn','-f','null','-']);
writeFileSync(path.join(out,'技術確認.txt'),`全フレーム・全音声デコード：成功\nデコード時エラー：${decode||'なし'}\nファイルサイズ：${statSync(target).size} bytes\n修正区間：${JSON.stringify(patch)}\n\n${info}`);
renameSync(input,cache+'/exp-maxwell-revised-before-final-patch.mp4');
console.log(`Final verified: ${target} (${(statSync(target).size/1024/1024).toFixed(1)} MiB)`);
