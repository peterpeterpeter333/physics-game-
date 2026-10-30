// Active render-task progress only; no scheduling, publication or source writes.
import fs from 'node:fs';
const q='/private/tmp/ys/axes-active-queue';
const jobs=['047a-c1-approved-trial','048-b1-production','048a-b1-timing-patch','048b-b1-final-dimensions','049-d1-production','049a-c1-production','050-e1-production'];
const load=p=>{try{return JSON.parse(fs.readFileSync(p));}catch{return null;}};
const names={'047a':'C-1 承認区間の試写','048':'B-1 本番','048a':'B-1 終盤のタイミング修正','048b':'B-1 実寸確認','049':'D-1 本番','049a':'C-1 本番','050':'E-1 本番'};
let last='';
while(true){
 const status=load(q+'/status.json'),finished=jobs.map(n=>({job:n,...load(q+'/job-'+n+'.done.json')})).filter(x=>x.status);
 const name=status?.job?.split('/').at(-1)?.replace(/^job-/,'').replace(/\.json$/,'')??'unknown';
 const label=names[name.split('-')[0]]??name,log=q+'/job-'+name+'.log';
 let line='';try{line=fs.readFileSync(log,'utf8').trim().split('\n').findLast(s=>/\[v6\].*コマ/.test(s))??'';}catch{}
 const signature=JSON.stringify({job:name,status:status?.status,last:line,finished:finished.map(x=>[x.job,x.status])});
 if(signature!==last){console.log(JSON.stringify({time:new Date().toISOString(),stage:label,status:status?.status,lastRenderProgress:line,finished:finished.map(x=>({job:x.job,status:x.status,seconds:x.seconds,error:x.error}))}));last=signature;}
 if(finished.length===jobs.length){console.log('Queued GPU work ended. Final MP4/visual validation is separate, not automatically approved.');break;}
 await new Promise(r=>setTimeout(r,45000));
}
