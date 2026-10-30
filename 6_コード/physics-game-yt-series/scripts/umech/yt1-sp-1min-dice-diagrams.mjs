// 特別編「1分の疑問」14 サイコロ2つで7が出やすいのはなぜ (ys-sp-1min-dice) — 図。Stage 1200×515。
// サイコロ A は赤、B は青。合計 7 の列と棒は黄。確率の分数は金。
// 形の部品（疑問カウンター・疑問カード・橋・黄色の枠）は 01 の yt1-sp-1min-common.mjs、クイズは yt1-sp-1min-sdp-common.mjs。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,tex,scaleAt} from './anim.mjs';
import {wrap,finalQ,vseg} from './yt1-sp-1min-common.mjs';
import {cueT,quizFull,answer,tag,card,HC,PI} from './yt1-sp-1min-sdp-common.mjs';

const K='sp-1min-dice:';
const DA='#ff6b6b', DB='#4c8dff', SEV=HC, PROB=C.t;
const Q={q:['サイコロ 2つの 目の 合計、','一番 出やすいのは？'],opts:['2','7','12'],ans:1};

// die face (top-left x,y, size s)
const PIPS={1:[[.5,.5]],2:[[.27,.27],[.73,.73]],3:[[.27,.27],[.5,.5],[.73,.73]],4:[[.27,.27],[.73,.27],[.27,.73],[.73,.73]],5:[[.27,.27],[.73,.27],[.5,.5],[.27,.73],[.73,.73]],6:[[.27,.25],[.73,.25],[.27,.5],[.73,.5],[.27,.75],[.73,.75]]};
function die(x,y,s,v,col,{g=1,rot=0}={}){
 let d=rect(x,y,s,s,{fill:'#f4f6fb',fo:1,stroke:col,sw:Math.max(2,s*.06),rx:s*.18});
 for(const [u,w] of PIPS[v])d+=dot(x+u*s,y+w*s,s*.09,v===1?'#e0483e':'#1b2333');
 return fade(g,rot?`<g transform="rotate(${rot} ${x+s/2} ${y+s/2})">${d}</g>`:d);
}

// ---------- 6×6 grid: row = A (red), column = B (blue) ----------
const GX=300, GY=96, CS=60;
function grid(t,{fill=1,hl2=0,hl7=0,dim=0}={}){
 let s='';
 for(let j=1;j<=6;j++)s+=die(GX+(j-1)*CS+12,GY-2-0,36,j,DB);
 for(let i=1;i<=6;i++)s+=die(GX-50,GY+38+(i-1)*CS+12,36,i,DA);
 const y0=GY+38;
 for(let i=1;i<=6;i++)for(let j=1;j<=6;j++){
  const k=(i-1)*6+(j-1),g=clamp(fill*36-k),sum=i+j,x=GX+(j-1)*CS,y=y0+(i-1)*CS;
  const is7=sum===7,is2=sum===2,on=(is7&&hl7>0)||(is2&&hl2>0),a=on?1:1-.65*dim;
  let c=rect(x+3,y+3,CS-6,CS-6,{fill:on?SEV:'#1b2a4a',fo:on?.22:1,stroke:on?SEV:'#3d4d6c',sw:on?3:1.5,rx:8});
  c+=label(String(sum),x+CS/2,y+CS/2+10,{size:28,color:on?SEV:C.ink,anchor:'middle',weight:700});
  s+=fade(g*a,c);
 }
 return s;
}

// ---------- histogram of the sum of n dice (exact), normalised to a common width ----------
function dist(n){let p=[1];for(let k=0;k<n;k++){const q=new Array(p.length+6).fill(0);p.forEach((v,i)=>{for(let f=1;f<=6;f++)q[i+f]+=v/6;});p=q;}return p;} // index = sum
const BX0=150, BX1=1050, BY=430, BH=300;
function bell(n,{g=1,curve=0}={}){
 const p=dist(n),mu=3.5*n,sd=Math.sqrt(35/12*n),X=z=>mix(BX0,BX1,(z+3.4)/6.8);
 const hmax=1/Math.sqrt(2*PI); // standard normal peak
 let s='';
 for(let k=n;k<=6*n;k++){const z=(k-mu)/sd;if(Math.abs(z)>3.4)continue;const w=(BX1-BX0)/6.8/sd,h=p[k]*sd/hmax*BH*.92;
  s+=rect(X(z)-w*.42,BY-h,w*.84,h,{fill:k===mu||(n%2===0&&k===mu)?SEV:C.x,fo:.55,stroke:'none',rx:Math.min(4,w*.2)});}
 if(curve>0){const pts=[];for(let i=0;i<=120;i++){const z=-3.4+6.8*i/120;pts.push([X(z),BY-Math.exp(-z*z/2)*BH*.92]);}s+=draw(pts,curve,{color:HC,w:4});}
 return fade(g,s);
}

export const spOneMinDiceDiagrams={
 // 1. クイズ：一番出やすい合計は？（選択肢 2・7・12、カウントダウン）
 [K+'q']:wrap(1,(p,ctx)=>{const t=cueT(p,ctx);
  const art=fade(seg(p,.05,.15),die(790,96,70,3,DA,{rot:-12})+die(880,112,70,4,DB,{rot:9}));
  return quizFull(p,t,ctx,{...Q,ans:-1,art});
 },{fadeIn:false,roll:0}),
 // 2. 答え 7 → でも、どれも同じくらい出そう？ → 疑問 2「なぜ 7？」
 [K+'answer']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx);
  let b='';
  for(let k=2;k<=12;k++){const x=150+(k-2)*82;b+=rect(x,250,62,180,{fill:'#1b2a4a',fo:1,stroke:'#5a6b8c',sw:2,rx:6,})+label(String(k),x+31,470,{size:28,color:k===7?SEV:C.ink,anchor:'middle',weight:700});}
  b+=label('どれも 同じくらい 出そう？',600,200,{size:34,color:C.ink,anchor:'middle',weight:700})+label('？',1080,360,{size:90,color:HC,anchor:'middle',weight:700});
  b+=line(130,430,1060,430,{color:C.dim,w:2});
  return answer(p,t,ctx,Q,fade(vseg(ctx,p,.3,.45),b),{fold:[.18,.26],ansText:'答え：7'});
 },{fadeIn:false,roll:.72,q:{start:.72,end:1,lines:['なぜ 7が','出やすい？'],text:'なぜ7が出やすい？'}}),
 // 3. 6×6 の 36 通り
 [K+'grid']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx);
  let s=grid(t,{fill:vseg(ctx,p,.25,.85)});
  s+=fade(vseg(ctx,p,.5,.7),label('6 × 6',900,250,{size:56,color:C.ink,anchor:'middle',weight:700})+label('＝ 36 通り',900,330,{size:52,color:HC,anchor:'middle',weight:700}));
  s+=fade(vseg(ctx,p,.1,.25),label('マスの 数字 ＝ 目の 合計',900,420,{size:26,color:C.dim,anchor:'middle',weight:700}));
  return s;
 },{pill:'なぜ7が出やすい？'}),
 // 4. 合計 2 は 1 通り、合計 7 は 6 通り（斜めの列）
 [K+'diag']:wrap(2,(p,ctx)=>{const t=cueT(p,ctx),h2=vseg(ctx,p,.05,.15),h7=vseg(ctx,p,.4,.55);
  let s=grid(t,{fill:1,hl2:h2,hl7:h7,dim:h2});
  const y0=GY+38;
  s+=fade(h7,draw([[GX+5*CS+CS/2+14,y0+CS/2-14],[GX+CS/2-14,y0+5*CS+CS/2+14]],h7,{color:SEV,w:4,dash:'10 8'}));
  s+=fade(h2,label('合計 2',860,190,{size:40,color:C.ink,weight:700})+label('1 通り',1040,190,{size:40,color:HC,weight:700}));
  s+=fade(h7,label('合計 7',860,300,{size:40,color:C.ink,weight:700})+label('6 通り',1040,300,{size:40,color:HC,weight:700}));
  s+=fade(vseg(ctx,p,.7,.85),label('7 の 列が 一番 長い',940,400,{size:32,color:HC,anchor:'middle',weight:700}));
  return s;
 },{fadeIn:false,pill:'なぜ7が出やすい？',bridge:.95}),
 // 5. 山形の棒グラフ：7 は 6/36 ＝ 1/6、2 は 1/36
 [K+'bars']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx),gr=vseg(ctx,p,.05,.3);
  let s=line(100,440,1100,440,{color:C.dim,w:2});
  for(let k=2;k<=12;k++){const c=6-Math.abs(k-7),x=150+(k-2)*82,h=c*50*gr,on=k===7||k===2;
   s+=rect(x,440-h,62,h,{fill:k===7?SEV:C.x,fo:k===7?.6:.45,stroke:'none',rx:5});
   s+=label(String(k),x+31,478,{size:26,color:k===7?SEV:C.ink,anchor:'middle',weight:700});
   s+=fade(gr,label(String(c),x+31,440-h-12,{size:22,color:C.dim,anchor:'middle'}));}
  const x7=150+5*82+31;
  s+=fade(vseg(ctx,p,.3,.45),tex('\\frac{6}{36}=\\frac{1}{6}',x7+190,120,{size:44,color:PROB})+arrow(x7+80,120,x7+40,128,{color:PROB,w:3,head:12}));
  s+=fade(vseg(ctx,p,.7,.85),tex('\\frac{1}{36}',150+31,300,{size:40,color:PROB}));
  return s;
 },{roll:0,q:{end:.14,lines:['確率に すると？'],text:'確率にすると？'}}),
 // 6. サイコロを増やすと、釣り鐘形に（3・5・10個）
 [K+'bell']:wrap(3,(p,ctx)=>{const t=cueT(p,ctx);
  const steps=[[2,0],[3,.15],[5,.4],[10,.65]];
  let s=line(100,BY,1100,BY,{color:C.dim,w:2}),lab='';
  steps.forEach(([n,a],i)=>{const b=i<3?steps[i+1][1]:2;const gi=vseg(ctx,p,a,a+.08)*(1-vseg(ctx,p,b,b+.08));
   s+=bell(n,{g:gi});lab+=fade(gi,label(`サイコロ ${n}${n===10?'個':'つ'}`,600,110,{size:40,color:C.ink,anchor:'middle',weight:700}));});
  s+=bell(10,{g:0,curve:0})+fade(vseg(ctx,p,.72,.85),bell(10,{g:0,curve:1})+draw(Array.from({length:121},(_,i)=>{const z=-3.4+6.8*i/120;return [mix(BX0,BX1,(z+3.4)/6.8),BY-Math.exp(-z*z/2)*BH*.92];}),vseg(ctx,p,.72,.95),{color:HC,w:5}));
  s+=fade(vseg(ctx,p,.8,.95),label('釣り鐘の 形',880,200,{size:36,color:HC,anchor:'middle',weight:700}));
  return s+lab;
 },{pill:'確率にすると？',bridge:.95}),
 // 7. 身長やテストの点数にも現れる
 [K+'nature']:wrap(4,(p,ctx)=>{const t=cueT(p,ctx);
  // height: mean 170 cm, sd 6 cm (illustrative)
  const X=h=>mix(140,760,(h-148)/44),H0=420,HH=240;
  let s=line(120,H0,780,H0,{color:C.dim,w:2});
  for(let h=150;h<=190;h+=2){const z=(h+1-170)/6,v=Math.exp(-z*z/2);s+=rect(X(h)+2,H0-v*HH,X(h+2)-X(h)-4,v*HH,{fill:C.x,fo:.5,stroke:'none',rx:3});}
  for(const h of[150,160,170,180,190])s+=line(X(h),H0,X(h),H0+10,{color:C.dim,w:2})+label(String(h),X(h),H0+40,{size:24,color:C.dim,anchor:'middle'});
  s+=label('身長（cm）',450,H0+80,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=draw(Array.from({length:121},(_,i)=>{const h=148+44*i/120,z=(h-170)/6;return [X(h),H0-Math.exp(-z*z/2)*HH];}),vseg(ctx,p,.1,.35),{color:HC,w:4});
  // test scores (small)
  const g2=vseg(ctx,p,.3,.5);
  let c='';const X2=v=>mix(860,1130,v/100),H2=360,HH2=150;
  for(let v=0;v<100;v+=5){const z=(v+2.5-60)/15,y=Math.exp(-z*z/2);c+=rect(X2(v)+1,H2-y*HH2,X2(v+5)-X2(v)-2,y*HH2,{fill:C.F,fo:.5,stroke:'none',rx:2});}
  c+=line(850,H2,1140,H2,{color:C.dim,w:2})+label('0',X2(0),H2+32,{size:22,color:C.dim,anchor:'middle'})+label('100',X2(100),H2+32,{size:22,color:C.dim,anchor:'middle'});
  c+=draw(Array.from({length:81},(_,i)=>{const v=100*i/80,z=(v-60)/15;return [X2(v),H2-Math.exp(-z*z/2)*HH2];}),1,{color:HC,w:3});
  c+=label('テストの 点数',995,H2+76,{size:26,color:C.ink,anchor:'middle',weight:700});
  s+=fade(g2,c);
  s+=fade(vseg(ctx,p,.7,.85),label('分布の 形の 例（数値は 説明用）',995,488,{size:22,color:C.dim,anchor:'middle'}));
  return s;
 },{roll:0,q:{end:.25,lines:['この 形は、','ほかにも ある？'],text:'この形は、ほかにもある？'},bridge:.95}),
 // 8. 次の疑問：40人のクラスに、誕生日が同じ人がいる確率は？
 [K+'end']:wrap(5,(p,ctx)=>{const t=cueT(p,ctx),g=vseg(ctx,p,0,.15);
  let cal='';const x0=420,y0=330;
  cal+=rect(x0,y0,360,160,{fill:'#f4f6fb',fo:1,stroke:'#c9d3e6',sw:2,rx:10})+rect(x0,y0,360,36,{fill:DA,fo:1,stroke:DA,sw:2,rx:10});
  for(let r=0;r<3;r++)for(let c=0;c<7;c++){const on=(r===1&&c===3);cal+=rect(x0+14+c*48,y0+48+r*36,40,28,{fill:on?HC:'#dfe5f0',fo:1,stroke:on?'#c99a20':'none',sw:2,rx:4});}
  let s=fade(vseg(ctx,p,.3,.5),cal);
  return s+finalQ(['40人の クラスに、誕生日が','同じ人が いる 確率は？'],g,{y:90,sc:.9+.1*g});
 },{roll:0}),
};
