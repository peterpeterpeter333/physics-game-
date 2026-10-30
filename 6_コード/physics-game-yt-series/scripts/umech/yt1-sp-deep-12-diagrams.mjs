// 深掘りショート 12（ys-deep-12）「光に光を足すと、暗くなる？」— 図。縦長の舞台 1000×920（vert-v1）。箱④ 波の足し算。
// 11 と同じ見た目：論理の筋の帯（logic、舞台の上 y 0–256）・事実①②の小さな札（facts、舞台の下 y 852–912、稲妻つき）・
//   大きな事実のカード（factCard）・山場の札（yamaba）。11 のファイルは名前の付いた部品を export していないので、同じ形をここに写した。
// この回で足した形：箱の印（boxMark：段ボール箱の絵＋「箱」の字＋問いの文字、点線の枠、文字 38px）。
// 決めた値（図はすべて実際に計算して描く）
//  - 一点ずつの足し算：1 波長を 8 等分した点（45° ごと）。高さ sin(45°k)＝0, 0.71, 1, 0.71, 0, −0.71, −1, −0.71（表示は小数 1 けた、0.7）。
//    波長 720px、点の間 90px。和は点ごとに A の棒の上に B の棒を積んで見せる。和の数は表示した数どうしの和（0.7＋0.7＝1.4）。
//  - ずれ φ の和：sin θ＋sin(θ−φ) を点ごとに計算して描く。高さ（振幅）は 2|cos(φ/2)|（グラフはこの式、波は実際の和）。
//  - 明るさ：高さ 1 → 1、高さ 2 → 4（2²）。ばね：伸び x・2x、力 F・2F、仕事は三角形の面積（2x の三角形は x の三角形 4 つ）。
//  - ロープ（ばねの並び）：振幅 1 と 2（50px と 100px）。
//  - ヤングの実験の図：波長 24px、すき間の間 110px、すき間から壁まで 460px（実際は縞の間隔・すき間とも 大きく 誇張）。壁の明るさは
//    二つのすき間からの道のりの差 Δ で 4cos²(πΔ/λ) を計算。測った明るさのグラフは 4cos²(π(x−480)/150)、5 周期（平均ちょうど 2）。
//  - 懐中電灯の縞：2＋2cos(2π(x−480)/150＋φ)、φ は 0.3 秒ごとに でたらめ（大きく誇張して遅く）。平均は φ を 0〜360° に 12 等分して実際に平均（＝2）。
//  - 回る矢印：長さ 1 の矢印 2 本、ずれ 60°。つないだ矢印の長さ 2cos30°＝1.73。
import {C,seg,clamp,mix,fade,label,line,rect,dot,ring,draw,arrow,poly,scaleAt,spring} from './anim.mjs';
import {W,H,HC,LIGHT,WATER,SURF,cueT,voiceEnd,vseg,swin,tag,note,plate,finalCard} from './yt1-sp-deep-common.mjs';

const K='deep12-',PI=Math.PI,DEG=PI/180;
const RED_='#ff6b6b',GREEN='#83ecc0',ORANGE='#ff9f43',ELEC='#6adfff';
const WA='#ffb36b',WB='#8ec0ff',SUMC=GREEN;
const jw=s=>[...String(s)].reduce((w,c)=>w+(/[ -~]/.test(c)?.55:1),0);
const hash=i=>{const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s);};
const tg=(ctx,p)=>ctx&&typeof ctx.tg==='number'?ctx.tg:cueT(p,ctx);
const r1=v=>Math.round(v*10)/10;
const mf=v=>{const r=r1(v);if(Math.abs(r)<1e-9)return '0';return (r<0?'−':'')+String(Math.abs(r));};
const mf2=v=>{const r=Math.round(v*100)/100;if(Math.abs(r)<1e-9)return '0';return (r<0?'−':'')+String(Math.abs(r));};
const drect=(x,y,w,h,col,{sw=3,rx=6,dash='10 8'}={})=>`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(0,w).toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" rx="${rx}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-dasharray="${dash}"/>`;

// ================= 論理の筋（上の帯）— 11 と同じ形 =================
const BH=['仮説','もし正しいなら','予言','事実','判定'];
function logic(v,{g=1,act=-1}={}){
 if(g<=0)return '';
 let s=rect(0,0,W,256,{fill:'#101a30',fo:.97,stroke:C.faint,sw:2,rx:16});
 BH.forEach((h,i)=>{const y=44+48*i,f=v[i]&&v[i][1]>0?v[i][1]:0;
  if(i===act)s+=rect(8,y-37,984,46,{fill:HC,fo:.12,stroke:HC,sw:2,rx:10});
  if(i>0)s+=line(36,y-50,36,y-38,{color:C.faint,w:3});
  s+=label(h,24,y,{size:36,color:i===act?HC:f>0?C.ink:C.dim,weight:700});
  if(f>0)s+=fade(f,label(v[i][0],310,y,{size:38,color:v[i][2]??C.ink,weight:700}));});
 return fade(g,s);
}
const LB=['エネルギーは 移るだけ','暗くなる 所が あるなら','暗い所の そばに 2より 明るい所','明るい縞は 約4倍、平均は 2倍','○ 予言 どおり'];
const BAND=(f)=>logic(LB.map((x,i)=>[x,f[i],i===4?GREEN:undefined]),{act:f.act??-1});

// ================= 事実①② の小さな札（下）— 11 と同じ形、文字だけ 12 のもの =================
const F1='① 光＋光 → 暗い',F2='② 2本 → 明るい';
function facts({g=1,glow1=0,glow2=0,bolt=0,ok=0,only1=false,g2=1}={}){
 if(g<=0)return '';
 const y=852,h=60,w1=jw(F1)*36+36,w2=jw(F2)*36+36,x1=20,x2=x1+w1+52;
 const one=(x,w,t,gl)=>rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:'none',rx:30})+rect(x,y,w,h,{fill:gl>0?HC:'#8aa0c4',fo:.10+.15*gl,stroke:gl>0?HC:'#8aa0c4',sw:2+3*gl,rx:30})+label(t,x+w/2,y+43,{size:36,color:gl>0?HC:C.ink,anchor:'middle',weight:700});
 let s=one(x1,w1,F1,glow1);
 if(!only1)s+=fade(g2,one(x2,w2,F2,glow2));
 const bx=x1+w1+26;
 if(bolt>0)s+=fade(bolt,poly([[bx+6,y+4],[bx-12,y+34],[bx,y+34],[bx-8,y+58],[bx+14,y+24],[bx+2,y+24],[bx+10,y+4]],{fill:ORANGE,fo:1,stroke:'none'}));
 if(ok>0)s+=fade(ok,label('＝',bx,y+44,{size:40,color:GREEN,anchor:'middle',weight:700}));
 return fade(g,s);
}
const FB=(o={})=>facts({bolt:1,...o});
const G0=()=>facts({glow1:1,glow2:1,ok:1});
// 大きな事実のカード（11 と同じ形）
function factCard(y,n,t,g,{glow=0}={}){
 const w=760,x=120;
 let s=rect(x,y,w,150,{fill:'#131f38',fo:.96,stroke:glow>0?HC:'#8aa0c4',sw:3+3*glow,rx:22});
 s+=tag('事実',x+30,y+62,{size:36,text:n,color:'#edf4ff'})+label(t,x+30,y+125,{size:46,color:glow>0?HC:C.ink,weight:700});
 return fade(g,s);
}
// 山場の札（11 と同じ形）
function yamaba(g=1){
 if(g<=0)return '';
 const x=40,y=10,w=226,h=70;
 let o=rect(x,y,w,h,{fill:C.bg,fo:.92,stroke:ORANGE,sw:4,rx:16});
 o+=poly([[x+18,y+54],[x+40,y+22],[x+62,y+54]],{fill:ORANGE,fo:.85})+poly([[x+46,y+54],[x+64,y+32],[x+84,y+54]],{fill:ORANGE,fo:.5});
 o+=label('山場',x+100,y+51,{size:44,color:ORANGE,weight:700});
 return fade(g,o);
}
// 稲妻（11 の clash と同じ形）
const bolt=(bx,by,sc=1.3)=>scaleAt(bx,by,sc,poly([[bx+14,by-60],[bx-30,by+8],[bx,by+8],[bx-20,by+64],[bx+36,by-10],[bx+6,by-10],[bx+26,by-60]],{fill:ORANGE,fo:1,stroke:'none'}));

// ================= 箱の印（この回で新しく作った札） =================
// 段ボール箱の絵（ふた・前・横）の前の面に「箱」、右に問い。枠は箱の色の点線（まだ開けていない印）。
const BOXC='#e0b77e',BOXT='#f3d6a8';
function boxIcon(x,y){ // 左上 (x,y)、幅 74・高さ 70
 const fw=58,fh=50,ly=16,dx=14;
 let s=poly([[x,y+ly],[x+dx,y],[x+fw+dx,y],[x+fw,y+ly]],{fill:'#efcd96',fo:1,stroke:'#6b4a24',sw:2.5});
 s+=poly([[x+fw,y+ly],[x+fw+dx,y],[x+fw+dx,y+fh],[x+fw,y+ly+fh]],{fill:'#a8763f',fo:1,stroke:'#6b4a24',sw:2.5});
 s+=rect(x,y+ly,fw,fh,{fill:'#cf9b5c',fo:1,stroke:'#6b4a24',sw:2.5,rx:2});
 s+=line(x+fw/2+dx/2-6,y+1,x+fw/2-6,y+ly,{color:'#8a6534',w:5});
 s+=label('箱',x+fw/2,y+ly+fh/2+13,{size:36,color:'#3b2810',anchor:'middle',weight:700});
 return s;
}
function boxMark(text,x,y,{g=1,size=38}={}){ // y：札の上下の真ん中
 if(g<=0)return '';
 const tw=jw(text)*size,w=16+74+18+tw+22,h=88,y0=y-h/2;
 let s=rect(x,y0,w,h,{fill:C.bg,fo:.94,stroke:'none',rx:16})+`<rect x="${x}" y="${y0.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" rx="16" fill="${BOXC}" fill-opacity=".10" stroke="${BOXC}" stroke-width="3" stroke-dasharray="12 8"/>`;
 s+=boxIcon(x+16,y0+9)+label(text,x+16+74+18,y+size*.36,{size,color:BOXT,weight:700});
 return fade(g,scaleAt(x+w/2,y,.94+.06*g,s));
}

// ================= 波 =================
function wvPts(x0,x1,yc,L,A,ph,t,speed=60){const pts=[];for(let x=x0;x<=x1+.1;x+=4)pts.push([x,yc-A*Math.sin(2*PI*(x-x0-speed*t)/L+ph)]);return pts;}
const wv=(x0,x1,yc,L,A,ph,t,{color=LIGHT,w=4,u=1,opacity=1,speed=60}={})=>draw(wvPts(x0,x1,yc,L,A,ph,t,speed),u,{color,w,opacity});
const elec=(x,y,{r=9,g=1,col=ELEC}={})=>fade(g,dot(x,y,r+5,col,.25)+dot(x,y,r,col));
// 11 の横の向き・前の向きの図（同じ形を写した）：電子の並びと、電子ごとの波を行に並べて実際に足す
const GX0=120,GX1=880,GS=34;
function grid(t,{g=1,y0=380,y1=780,shake=1}={}){
 let s='';
 for(let x=GX0;x<=GX1;x+=GS)for(let y=y0;y<=y1;y+=GS){const dy=4*shake*Math.sin(2*PI*(x-60*t)/160);s+=dot(x,y+dy,5,ELEC,.85);}
 return fade(g,s);
}
const PH_SIDE=[0,PI/2,PI,3*PI/2];
const ROWC=['#ff8a7e','#ffe28a','#6adfff','#b49bff'];
function sumRows(x0,y0,phases,t,{rowG=[],sumG=0,A=18,rowH=50,sumY,sumText='',sumCol=GREEN}={}){
 const x1=x0+660,L=160;let s='';
 phases.forEach((ph,i)=>{const g=rowG[i]??1;if(g<=0)return;const yc=y0+i*rowH;
  s+=fade(g,label(`電子${i+1}`,x0-150,yc+12,{size:36,color:ROWC[i],weight:700})+wv(x0,x1,yc,L,A,-ph,t,{color:ROWC[i],w:3.5}));});
 if(sumG>0){const yc=sumY,pts=[];for(let x=x0;x<=x1;x+=4){let v=0;for(const ph of phases)v+=A*Math.sin(2*PI*(x-x0-60*t)/L-ph);pts.push([x,yc-v]);}
  s+=fade(sumG,line(x0-150,yc-62,x1,yc-62,{color:C.faint,w:2})+label('足すと',x0-150,yc+12,{size:36,color:sumCol,weight:700})+draw(pts,1,{color:sumCol,w:6})+(sumText?plate(sumText,x1,yc+56,{size:38,color:sumCol,anchor:'end'}):''));}
 return s;
}

// ================= 懐中電灯・壁 =================
function torch(x,y,g=1){
 return fade(g,rect(x,y-20,110,40,{fill:'#5f7398',fo:1,stroke:'#8aa0c4',sw:2,rx:8})+poly([[x+110,y-20],[x+136,y-32],[x+136,y+32],[x+110,y+20]],{fill:'#8aa0c4',fo:1})+line(x+136,y-30,x+136,y+30,{color:LIGHT,w:5}));
}
// 横から見た 懐中電灯と 壁。g1・g2：1本目・2本目
function sideView(t,{g1=1,g2=1,y1=130,y2=290,wx=870,wy0=40,wy1=380,lit=null}={}){
 let s=line(wx,wy0,wx,wy1,{color:'#c4cde0',w:8})+label('壁',wx-14,wy0+40,{size:38,color:C.ink,anchor:'end',weight:700});
 const ym=(wy0+wy1)/2,beam=(y,g)=>fade(g,poly([[206,y-12],[wx-4,ym-120],[wx-4,ym+120],[206,y+12]],{fill:LIGHT,fo:.12,stroke:'none'}));
 s+=beam(y1,g1)+beam(y2,g2);
 const b=lit??(g1+g2)/2;
 s+=rect(wx-6,ym-120,12,240,{fill:LIGHT,fo:.35+.6*b,stroke:'none',rx:4});
 s+=torch(70,y1,g1)+torch(70,y2,g2);
 return s;
}
// 明るさの棒（1本・2本）
function bars12({b1=0,b2=0,x1=300,x2=560,base=760,unit=100,lab=true}={}){
 let s=line(180,base,700,base,{color:C.dim,w:3});
 const bar=(x,v,g,txt)=>fade(g,rect(x-50,base-unit*v*seg(g,0,.8),100,unit*v*seg(g,0,.8),{fill:LIGHT,fo:.85,stroke:LIGHT,rx:6})+fade(seg(g,.6,1),label(String(v),x,base-unit*v-16,{size:44,color:LIGHT,anchor:'middle',weight:700}))+label(txt,x,base+46,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=bar(x1,1,b1,'1本')+bar(x2,2,b2,'2本');
 if(lab)s+=fade(Math.max(b1,b2),label('明るさ',40,base-140,{size:38,color:C.dim,weight:700}));
 return s;
}

// ================= 一点ずつの足し算 =================
const AX0=150,LAM=720,AX1=AX0+LAM,COLX=k=>AX0+90*k;
const YA=95,YB=290,YS=590,U=55,NYA=195,NYB=390,NYS=770;
const aV=k=>Math.sin(PI*k/4),bV=(k,phi)=>Math.sin(PI*k/4-phi);
function waveLine(yc,Uu,phi,{color,w=5,u=1,x0=AX0,x1=AX1,L=LAM,dash='',opacity=1}={}){const pts=[];for(let x=x0;x<=x1+.1;x+=4)pts.push([x,yc-Uu*Math.sin(2*PI*(x-x0)/L-phi)]);return draw(pts,u,{color,w,dash,opacity});}
function sumLine(yc,Uu,phi,{u=1,w=6,x0=AX0,x1=AX1,L=LAM}={}){const pts=[];for(let x=x0;x<=x1+.1;x+=4){const th=2*PI*(x-x0)/L;pts.push([x,yc-Uu*(Math.sin(th)+Math.sin(th-phi))]);}return draw(pts,u,{color:SUMC,w});}
// hl：[[点の番号, 濃さ]…]、sums：点ごとの和の出る割合（8つ）
function addScene({phi=0,gA=1,gB=1,nA=0,nB=0,cols=0,rule=0,sumAx=0,sums=[],curve=0,curveG=1,hl=[]}={}){
 let s='';
 hl.forEach(([k,g])=>{if(g>0)s+=fade(g,rect(COLX(k)-44,22,88,770,{fill:HC,fo:.10,stroke:HC,sw:2.5,rx:14}));});
 if(cols>0)for(let k=0;k<8;k++)s+=fade(cols,line(COLX(k),30,COLX(k),720,{color:C.faint,w:2,dash:'4 8'}));
 s+=fade(gA,label('波A',20,YA+13,{size:38,color:WA,weight:700})+line(AX0-10,YA,AX1,YA,{color:C.faint,w:2,dash:'6 8'})+waveLine(YA,U,0,{color:WA}));
 s+=fade(gB,label('波B',20,YB+13,{size:38,color:WB,weight:700})+line(AX0-10,YB,AX1,YB,{color:C.faint,w:2,dash:'6 8'})+waveLine(YB,U,phi,{color:WB}));
 for(let k=0;k<8;k++){
  if(nA>0)s+=fade(nA,dot(COLX(k),YA-U*aV(k),7,WA)+label(mf(aV(k)),COLX(k),NYA,{size:36,color:WA,anchor:'middle',weight:700}));
  if(nB>0)s+=fade(nB,dot(COLX(k),YB-U*bV(k,phi),7,WB)+label(mf(bV(k,phi)),COLX(k),NYB,{size:36,color:WB,anchor:'middle',weight:700}));
 }
 s+=fade(rule,label('＋',100,YB+14,{size:40,color:C.ink,weight:700})+line(20,428,AX1,428,{color:C.dim,w:3}));
 s+=fade(sumAx,label('足すと',20,YS+13,{size:36,color:SUMC,weight:700})+line(AX0-10,YS,AX1,YS,{color:C.faint,w:2,dash:'6 8'}));
 for(let k=0;k<8;k++){const g=sums[k]??0;if(g<=0)continue;const a=aV(k),b=bV(k,phi),x=COLX(k),u=seg(g,0,.6);
  s+=fade(g,line(x-7,YS,x-7,YS-U*a*u,{color:WA,w:9})+fade(seg(g,.3,.8),line(x+7,YS-U*a,x+7,YS-U*(a+b*seg(g,.3,.8)),{color:WB,w:9}))
   +fade(seg(g,.6,1),dot(x,YS-U*(a+b),10,SUMC)+label(mf(r1(a)+r1(b)),x,NYS,{size:38,color:SUMC,anchor:'middle',weight:700})));}
 if(curve>0)s+=fade(curveG,sumLine(YS,U,phi,{u:curve}));
 return s;
}
const ALL=v=>Array(8).fill(v);
const sumsWith=(on,g,rest=0)=>Array.from({length:8},(_,k)=>on.includes(k)?g:rest);

// ================= ばね =================
function springRow(yc,ext,{g=1,F=0,Fg=0,Fl='F',xl='x',xg=0}={}){
 if(g<=0)return '';
 const wx=80,rest=340,bw=70,xb=rest+ext;
 let s=spring(wx,xb,yc,{coils:9,amp:18,color:'#c4cde0',w:4})+rect(xb,yc-35,bw,70,{fill:'#5f7398',fo:1,stroke:'#8aa0c4',sw:3,rx:8});
 s+=line(rest,yc-56,rest,yc+56,{color:C.faint,w:3,dash:'6 6'});
 if(Fg>0)s+=fade(Fg,arrow(xb+bw/2,yc,xb+bw/2-F*Fg,yc,{color:RED_,w:7,head:22})+label(Fl,xb+bw/2-F/2,yc-52,{size:40,color:RED_,anchor:'middle',weight:700}));
 if(xg>0&&ext>4)s+=fade(xg,line(rest,yc+70,xb,yc+70,{color:HC,w:4})+line(rest,yc+58,rest,yc+82,{color:HC,w:4})+line(xb,yc+58,xb,yc+82,{color:HC,w:4})+label(xl,(rest+xb)/2,yc+118,{size:40,color:HC,anchor:'middle',weight:700}));
 return fade(g,s);
}
function wallV(y0,y1){let s=line(80,y0,80,y1,{color:C.dim,w:5});for(let q=y0;q<y1;q+=26)s+=line(80,q,62,q+16,{color:C.faint,w:2});return s;}
const fact3=(g=1,glow=0,y=60)=>fade(g,(glow>0?rect(130,y-50,740,76,{fill:HC,fo:.08*glow,stroke:HC,sw:4*glow,rx:38}):'')+tag('事実',500,y,{size:40,text:'③ 明るさは 高さの 2乗',anchor:'middle',color:glow>.5?HC:'#edf4ff'}));
// 力と伸びのグラフ。O(160,780)、x 1つ分＝300px、F 1つ分＝200px
const GO=[160,780],GXU=300,GFU=200,gp=(x,f)=>[GO[0]+GXU*x,GO[1]-GFU*f];
function workGraph({ax=1,lineG=1,marks=0,small=0,tiles=[0,0,0,0],four=0,big=0}={}){
 let s=fade(ax,arrow(GO[0],GO[1],880,GO[1],{color:C.dim,w:3,head:16})+arrow(GO[0],GO[1],GO[0],300,{color:C.dim,w:3,head:16})+label('伸び',880,GO[1]+50,{size:38,color:C.dim,anchor:'end',weight:700})+label('力',GO[0]-20,330,{size:38,color:C.dim,anchor:'end',weight:700}));
 s+=fade(lineG,draw([gp(0,0),gp(2.15,2.15)],1,{color:RED_,w:5}));
 if(marks>0){const m=(x,f,tx,tf)=>line(...gp(x,0),...gp(x,f),{color:C.faint,w:2,dash:'6 6'})+line(...gp(0,f),...gp(x,f),{color:C.faint,w:2,dash:'6 6'})+label(tx,gp(x,0)[0],GO[1]+46,{size:38,color:HC,anchor:'middle',weight:700})+label(tf,GO[0]-14,gp(0,f)[1]+13,{size:38,color:RED_,anchor:'end',weight:700});
  s+=fade(marks,m(1,1,'x','F')+m(2,2,'2x','2F'));}
 const tri=(P,col,fo)=>poly(P.map(([x,f])=>gp(x,f)),{fill:col,fo,stroke:col,sw:3});
 if(small>0)s+=fade(small,tri([[0,0],[1,0],[1,1]],HC,.45));
 if(big>0)s+=fade(big,poly([gp(0,0),gp(2,0),gp(2,2)],{fill:'none',fo:0,stroke:HC,sw:3}));
 const T=[[[0,0],[1,0],[1,1]],[[1,0],[2,0],[2,1]],[[1,1],[2,1],[2,2]],[[1,0],[2,1],[1,1]]];
 T.forEach((P,i)=>{if(tiles[i]>0)s+=fade(tiles[i],tri(P,i===3?ORANGE:HC,.45));});
 return s;
}
// ばねの並び（ロープ）：玉と、玉をつなぐ小さなばね。振幅 A、中心 yc
function zig(p,q,n=6,amp=7){const dx=q[0]-p[0],dy=q[1]-p[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux;const pts=[p];for(let i=1;i<2*n;i++){const f=i/(2*n),s=(i%2?1:-1)*amp;pts.push([p[0]+dx*f+nx*s,p[1]+dy*f+ny*s]);}pts.push(q);return draw(pts,1,{color:'#8aa0c4',w:2.5});}
function rope(yc,A,t,{g=1,col=LIGHT}={}){
 if(g<=0)return '';
 const P=[];for(let i=0;i<13;i++){const x=120+60*i;P.push([x,yc-A*Math.sin(2*PI*(x-120)/360-2.2*t)]);}
 let s=line(100,yc,860,yc,{color:C.faint,w:2,dash:'6 8'});
 for(let i=0;i<12;i++)s+=zig(P[i],P[i+1]);
 P.forEach(([x,y])=>{s+=dot(x,y,11,col);});
 return fade(g,s);
}

// ================= 山場：エネルギーの勘定 =================
const PB=770,PU=70,PX=[170,390,610,830],PL=['もともと','山＋山','山＋谷','平均'];
function peakBars({g=[0,0,0,0],lvl=0,move=0}={}){
 let s=line(90,PB,890,PB,{color:C.dim,w:3});
 const vals=[2,4,0,2];
 PX.forEach((x,i)=>{const gi=g[i];if(gi<=0)return;const v=vals[i],u=seg(gi,0,.7),col=i===0?LIGHT:i===3?GREEN:HC;
  let b='';
  if(i===0)b+=rect(x-50,PB-PU*u,100,PU*u,{fill:LIGHT,fo:.8,stroke:LIGHT,rx:4})+fade(seg(gi,.4,.8),rect(x-50,PB-2*PU,100,PU,{fill:WB,fo:.8,stroke:WB,rx:4}));
  else if(v>0)b+=rect(x-50,PB-PU*v*u,100,PU*v*u,{fill:col,fo:.8,stroke:col,rx:4});
  else b+=line(x-50,PB,x+50,PB,{color:HC,w:8});
  b+=fade(seg(gi,.7,1),label(String(v),x,PB-PU*v-16,{size:46,color:col,anchor:'middle',weight:700}));
  b+=label(PL[i],x,PB+45,{size:36,color:C.ink,anchor:'middle',weight:700});
  s+=fade(Math.min(1,gi*3),b);});
 if(lvl>0)s+=fade(lvl,line(90,PB-2*PU,890,PB-2*PU,{color:C.ink,w:3,dash:'10 8'}));
 if(move>0){s+=fade(move,drect(PX[2]-50,PB-2*PU,100,2*PU,ORANGE,{sw:4})+rect(PX[1]-54,PB-4*PU-4,108,2*PU+4,{fill:'none',fo:0,stroke:ORANGE,sw:5,rx:6}));
  const A0=[PX[2],PB-2*PU-10],Cq=[(PX[1]+PX[2])/2+10,PB-4.6*PU],E=[PX[1]+62,PB-3*PU],ta=Math.atan2(E[1]-Cq[1],E[0]-Cq[0]),hd=26;
  s+=fade(move,`<path d="M ${A0[0]} ${A0[1]} Q ${Cq[0]} ${Cq[1]} ${E[0]} ${E[1]}" fill="none" stroke="${ORANGE}" stroke-width="7"/>`+poly([[E[0]+6*Math.cos(ta),E[1]+6*Math.sin(ta)],[E[0]-hd*Math.cos(ta)+hd*.55*Math.sin(ta),E[1]-hd*Math.sin(ta)-hd*.55*Math.cos(ta)],[E[0]-hd*Math.cos(ta)-hd*.55*Math.sin(ta),E[1]-hd*Math.sin(ta)+hd*.55*Math.cos(ta)]],{fill:ORANGE,fo:1}));}
 return s;
}
const EQ=[[150,'一つ：高さ 1 → 明るさ 1の 2乗 ＝ 1'],[215,'二つ 合わせて：1 ＋ 1 ＝ 2'],[280,'山＋山：高さ 2 → 明るさ 2の 2乗 ＝ 4'],[345,'山＋谷：高さ 0 → 明るさ 0'],[410,'平均：（4 ＋ 0）÷ 2 ＝ 2']];
function eqs(g=[],{dim=[]}={}){let s='';EQ.forEach(([y,t],i)=>{const gi=g[i]??0;if(gi<=0)return;s+=fade(gi,label(t,60,y,{size:40,color:dim[i]?C.dim:C.ink,weight:700}));});return s;}

// ================= ヤングの実験 =================
const YS1=505,YS2=615,PLX=330,WLX=790,LMB=24;
function young(t,{g=1,arcs=1,stripes=0}={}){
 if(g<=0)return '';
 let s=dot(70,560,22,LIGHT)+dot(70,560,36,LIGHT,.25)+label('一色の 光',40,470,{size:36,color:LIGHT,weight:700});
 // 平らな波（すき間の前）
 for(let k=0;k<9;k++){const x=110+((t*40+k*LMB)%(PLX-110));s+=line(x,430,x,690,{color:LIGHT,w:2,opacity:.45});}
 // 板と 二つの すき間
 s+=rect(PLX-7,300,14,YS1-6-300,{fill:'#c4cde0',fo:1,stroke:'none',rx:2})+rect(PLX-7,YS1+6,14,YS2-YS1-12,{fill:'#c4cde0',fo:1,stroke:'none',rx:2})+rect(PLX-7,YS2+6,14,780-YS2-6,{fill:'#c4cde0',fo:1,stroke:'none',rx:2});
 // すき間から広がる波（円の一部）
 if(arcs>0){let a='';for(const ys of [YS1,YS2])for(let k=0;k<20;k++){const r=((t*40)%LMB)+k*LMB;if(r<6||r>WLX-PLX+60)continue;const pts=[];for(let q=-70;q<=70;q+=5){const x=PLX+r*Math.cos(q*DEG),y=ys+r*Math.sin(q*DEG);if(x<=WLX&&y>290&&y<790)pts.push([x,y]);else if(pts.length){a+=draw(pts,1,{color:LIGHT,w:2,opacity:.45});pts.length=0;}}if(pts.length>1)a+=draw(pts,1,{color:LIGHT,w:2,opacity:.45});}
  s+=fade(arcs,a);}
 // 壁
 s+=rect(WLX,300,50,480,{fill:'#1a2440',fo:1,stroke:'#8aa0c4',sw:2,rx:4});
 if(stripes>0){let st='';for(let y=302;y<778;y+=4){const r1_=Math.hypot(WLX-PLX,y-YS1),r2_=Math.hypot(WLX-PLX,y-YS2),I=4*Math.cos(PI*(r1_-r2_)/LMB)**2;st+=rect(WLX+2,y,46,4,{fill:LIGHT,fo:.95*I/4,stroke:'none',rx:0});}s+=fade(stripes,st);}
 s+=label('壁',WLX+25,290,{size:38,color:C.ink,anchor:'middle',weight:700});
 return fade(g,s);
}
// 正面から見た壁の縞（x 105–855）と、明るさのグラフ
const QX0=105,QX1=855,QP=150,QC=480;
const fringeI=(x,ph=0)=>2+2*Math.cos(2*PI*(x-QC)/QP+ph); // ＝4cos²(π(x−QC)/QP＋ph/2)
function stripeStrip(y0,h,{g=1,ph=0,mixU=0,flat=false}={}){
 let s=rect(QX0,y0,QX1-QX0,h,{fill:'#1a2440',fo:1,stroke:'none',rx:0});
 for(let x=QX0;x<QX1;x+=5){const I=flat?2:mix(fringeI(x,ph),2,mixU);s+=rect(x,y0,5,h,{fill:LIGHT,fo:.95*I/4,stroke:'none',rx:0});}
 s+=rect(QX0,y0,QX1-QX0,h,{fill:'none',fo:0,stroke:'#8aa0c4',sw:2,rx:4});
 return fade(g,s);
}
function igraph({base=780,unit=60,ax=1,curve=0,ph=0,one=0,four=0,avg=0,ticks=[],faint=[],avgCurve=0,flat=0}={}){
 const Y=v=>base-unit*v;
 let s=fade(ax,line(QX0,base,QX1,base,{color:C.dim,w:3})+line(QX0,base,QX0,Y(4.4),{color:C.dim,w:3})+label('明るさ',QX0+12,Y(4.4)+6,{size:36,color:C.dim,weight:700}));
 ticks.forEach(([v,g])=>{if(g>0)s+=fade(g,label(String(v),QX0-14,Y(v)+13,{size:36,color:C.ink,anchor:'end',weight:700})+line(QX0-8,Y(v),QX0,Y(v),{color:C.dim,w:3}));});
 faint.forEach(p=>{const pts=[];for(let x=QX0;x<=QX1;x+=5)pts.push([x,Y(fringeI(x,p))]);s+=draw(pts,1,{color:LIGHT,w:2,opacity:.28});});
 if(curve>0){const pts=[];for(let x=QX0;x<=QX1;x+=4)pts.push([x,Y(fringeI(x,ph))]);s+=draw(pts,curve,{color:LIGHT,w:5});}
 if(flat>0)s+=fade(flat,line(QX0,Y(2),QX1,Y(2),{color:LIGHT,w:5}));
 if(one>0)s+=fade(one,line(QX0,Y(1),QX1,Y(1),{color:WB,w:4,dash:'12 8'})+plate('すき間 一つ',QX1,832,{size:36,color:WB,anchor:'end'}));
 if(avgCurve>0){// φ を 12 等分して実際に平均
  const pts=[];for(let x=QX0;x<=QX1;x+=5){let v=0;for(let j=0;j<12;j++)v+=fringeI(x,2*PI*j/12);pts.push([x,Y(v/12)]);}s+=fade(avgCurve,draw(pts,1,{color:GREEN,w:7}));}
 if(avg>0)s+=fade(avg,line(QX0,Y(2),QX1,Y(2),{color:GREEN,w:5,dash:'14 8'})+plate('平均 2',QX1,Y(2)-22,{size:40,color:GREEN,anchor:'end'}));
 return s;
}

// ================= cue ごと =================
const D={};
// ---- 1 事実①（11 の横の向きの図）
D[K+'fact:one']=(p,ctx)=>{const t=cueT(p,ctx);
 let s=plate('前回：横へ 出た 光',40,50,{size:40,color:C.ink});
 s+=sumRows(220,130,PH_SIDE,t,{rowG:[0,1,2,3].map(i=>swin(ctx,p,0,.05+.1*i,.2+.1*i)),sumG:swin(ctx,p,0,.6,.9),sumY:390,sumText:'0（打ち消し合う）'});
 s+=grid(t,{y0:650,y1:790,g:.8})+arrow(500,650,500,600,{color:HC,w:5,head:18})+plate('横の 向き',520,632,{size:38,color:HC});
 s+=tag('事実',500,540,{size:42,text:'① 光に 光を 足すと 暗くなる',anchor:'middle',color:'#edf4ff',g:swin(ctx,p,1,.2,.6)});
 return s;};
// ---- 2 懐中電灯2本（事実②）
D[K+'torch:two']=(p,ctx)=>{const t=cueT(p,ctx),g2=vseg(ctx,p,.2,.4);
 return sideView(t,{g1:1,g2,lit:.5+.5*g2})+bars12({b1:vseg(ctx,p,.55,.72),b2:vseg(ctx,p,.76,.95)})+facts({only1:true});};
D[K+'torch:fact']=(p,ctx)=>{const t=cueT(p,ctx),m=vseg(ctx,p,.9,1.15);
 return sideView(t,{lit:1})+bars12({b1:1,b2:1})+fade(1-m,tag('事実',500,445,{size:44,text:'② 2本で 明るくなる',anchor:'middle',color:'#edf4ff',g:vseg(ctx,p,.3,.65)}))+facts({g2:m});};
// ---- 3 日なた
function sunScene(t,{rays=1,th=0}={}){
 let s=dot(130,120,58,'#ffd34d')+dot(130,120,84,'#ffd34d',.18);
 for(let k=0;k<10;k++){const a=k*36*DEG+t*.2;s+=line(130+70*Math.cos(a),120+70*Math.sin(a),130+96*Math.cos(a),120+96*Math.sin(a),{color:'#ffd34d',w:4});}
 // 地面・日よけ
 s+=rect(40,700,880,20,{fill:'#3f6e58',fo:1,stroke:'none',rx:4});
 s+=rect(560,330,340,22,{fill:'#8aa0c4',fo:1,stroke:'none',rx:4})+line(580,352,580,700,{color:'#8aa0c4',w:8})+line(880,352,880,700,{color:'#8aa0c4',w:8});
 s+=poly([[560,700],[900,700],[900,352],[560,352]],{fill:'#000000',fo:.35});
 // 光の線とエネルギーの粒
 for(let k=0;k<4;k++){const x0=200+30*k,y0=170+20*k,x1=250+75*k,y1=700;s+=fade(rays,line(x0,y0,x1,y1,{color:LIGHT,w:3,opacity:.6}));const f=((t*.5+k*.25)%1);s+=fade(rays,dot(mix(x0,x1,f),mix(y0,y1,f),9,'#ffd34d'));}
 // 温度計
 const thermo=(x,lv,txt)=>rect(x-16,420,32,240,{fill:'#101a30',fo:1,stroke:'#c4cde0',sw:3,rx:16})+dot(x,680,28,'#ff4b3e')+rect(x-8,660-200*lv,16,200*lv+10,{fill:'#ff4b3e',fo:1,stroke:'none',rx:6})+label(txt,x,790,{size:40,color:C.ink,anchor:'middle',weight:700});
 s+=thermo(330,mix(.3,.78,th),'日なた')+thermo(730,.3,'日かげ');
 return s;
}
D[K+'sun:warm']=(p,ctx)=>{const t=cueT(p,ctx);
 return sunScene(t,{rays:swin(ctx,p,0,0,.4),th:swin(ctx,p,1,.2,.8)})+fade(swin(ctx,p,0,.4,.8),plate('光が エネルギーを 運ぶ',300,110,{size:42,color:'#ffd34d'}))+facts();};
// ---- 4 エネルギーは消えない／どこへ
const lawCard=(y,g,{glow=0}={})=>fade(g,rect(150,y,700,120,{fill:'#131f38',fo:.96,stroke:glow>0?HC:GREEN,sw:4,rx:22})+label('エネルギーは 消えない',500,y+78,{size:52,color:GREEN,anchor:'middle',weight:700}));
D[K+'law:keep']=(p,ctx)=>lawCard(330,vseg(ctx,p,.05,.35))+fade(vseg(ctx,p,.45,.8),plate('ひとりでに 生まれも 消えも しない',500,560,{size:40,color:C.ink,anchor:'middle'}))+facts();
D[K+'law:where']=(p,ctx)=>{const a=swin(ctx,p,0,0,.4),c=swin(ctx,p,1,0,.35),q=swin(ctx,p,1,.45,.8);
 let s=factCard(30,'①','光＋光 → 暗くなる',1,{glow:a})+factCard(330,'②','2本 → 明るくなる',1);
 s+=fade(c,bolt(500,255,1.0)+plate('ぶつかる',560,275,{size:42,color:ORANGE}));
 s+=lawCard(560,1)+fade(q,plate('エネルギーは どこへ？',500,790,{size:52,color:HC,anchor:'middle'}));
 return s;};
// ---- 5 一つの波：8 点の高さ
D[K+'pt:one']=(p,ctx)=>{const X0=150,L=720,yc=430,Uu=160;
 let s=line(X0-20,yc,X0+L+10,yc,{color:C.faint,w:2,dash:'8 8'})+label('高さ',40,yc-Uu+12,{size:38,color:C.dim,weight:700});
 s+=waveLine(yc,Uu,0,{color:WA,u:swin(ctx,p,0,0,.6),x0:X0,x1:X0+L,L});
 s+=fade(swin(ctx,p,0,.6,.95),[0,1,2,3,4,5,6,7].map(k=>dot(X0+90*k,yc,7,C.dim)).join('')+label('場所 →',X0+10,yc+56,{size:36,color:C.dim,weight:700}));
 for(let k=0;k<8;k++){const x=X0+90*k,v=aV(k),g=swin(ctx,p,1,.05+.08*k,.17+.08*k),y=yc-Uu*v;
  s+=fade(g,line(x,yc,x,y,{color:WA,w:7})+dot(x,y,10,WA)+label(mf(v),x,v>0.01?y-22:v<-0.01?y+52:yc-22,{size:38,color:WA,anchor:'middle',weight:700}));}
 return s+FB();};
// ---- 6–12 二つの波を一点ずつ足す
D[K+'add:stack']=(p,ctx)=>addScene({gB:swin(ctx,p,0,.25,.6),nA:swin(ctx,p,0,0,.25),nB:swin(ctx,p,0,.55,.85),cols:swin(ctx,p,1,0,.35),rule:swin(ctx,p,1,.3,.6),sumAx:swin(ctx,p,1,.5,.8),hl:[[2,swin(ctx,p,0,.75,.95)*(1-swin(ctx,p,1,0,.2))]]})+FB();
const BASE={nA:1,nB:1,cols:1,rule:1,sumAx:1};
D[K+'add:sum1']=(p,ctx)=>{const h0=swin(ctx,p,0,0,.25)*(1-swin(ctx,p,1,0,.15)),h2=swin(ctx,p,1,0,.2);
 return addScene({...BASE,hl:[[0,h0],[2,h2]],sums:[swin(ctx,p,0,.5,.9),0,swin(ctx,p,1,.5,.9)]})+FB();};
D[K+'add:sum2']=(p,ctx)=>addScene({...BASE,hl:[[6,vseg(ctx,p,0,.2)]],sums:sumsWith([0,2],1).map((v,k)=>k===6?vseg(ctx,p,.55,.95):v)})+FB();
D[K+'add:double']=(p,ctx)=>{const r=[1,3,4,5,7];
 return addScene({...BASE,sums:Array.from({length:8},(_,k)=>r.includes(k)?vseg(ctx,p,.02+.05*r.indexOf(k),.2+.05*r.indexOf(k)):1),curve:vseg(ctx,p,.3,.62)})
  +tag('結果',890,452,{size:40,text:'高さ 2倍',anchor:'end',color:GREEN,g:vseg(ctx,p,.68,.92)})+FB();};
D[K+'add:shift']=(p,ctx)=>{const o=1-vseg(ctx,p,0,.18),u=vseg(ctx,p,.3,.8),phi=PI*u,m=vseg(ctx,p,.82,1);
 let s=addScene({phi,nA:o,nB:o,cols:1,rule:1,sumAx:1,sums:ALL(o),curve:1,curveG:o});
 s+=fade(vseg(ctx,p,.25,.4),arrow(COLX(2),218,COLX(2)+360*Math.max(u,.02),218,{color:HC,w:4,head:16})+label('半波長',COLX(2)+180,205,{size:36,color:HC,anchor:'middle',weight:700}));
 s+=fade(m,label('山',COLX(2),YA-U-12,{size:36,color:WA,anchor:'middle',weight:700})+label('谷',COLX(2)+46,YB+U+12,{size:36,color:WB,anchor:'middle',weight:700}));
 return s+FB();};
D[K+'add:cancel1']=(p,ctx)=>{const n=vseg(ctx,p,0,.12),h2=swin(ctx,p,0,0,.25)*(1-swin(ctx,p,1,0,.15)),h1=swin(ctx,p,1,0,.2);
 return addScene({phi:PI,nA:n,nB:n,cols:1,rule:1,sumAx:1,hl:[[2,h2],[1,h1]],sums:[0,swin(ctx,p,1,.55,.92),swin(ctx,p,0,.5,.9)]})+FB();};
D[K+'add:cancel2']=(p,ctx)=>{const r=[0,3,4,5,6,7];
 return addScene({...BASE,phi:PI,sums:Array.from({length:8},(_,k)=>r.includes(k)?vseg(ctx,p,.1+.06*r.indexOf(k),.3+.06*r.indexOf(k)):1),curve:vseg(ctx,p,.62,.9)})+FB();};
D[K+'add:zero']=(p,ctx)=>{const a=swin(ctx,p,0,.2,.6),b=swin(ctx,p,1,0,.3);
 return addScene({...BASE,phi:PI,sums:ALL(1),curve:1})+fade(a*(1-b),plate('どこでも 0',500,505,{size:46,color:SUMC,anchor:'middle'}))+fade(b,plate('ここでは 光が 消えている',500,505,{size:44,color:HC,anchor:'middle'}))+FB();};
// 12 ずれのつまみ
D[K+'dial:slide']=(p,ctx)=>{const u=vseg(ctx,p,.2,.95),phi=PI*u,h=2*Math.abs(Math.cos(phi/2));
 const Y1=120,Y2=345,Us=55;
 let s=label('波A',20,100,{size:38,color:WA,weight:700})+label('波B',20,165,{size:38,color:WB,weight:700})+line(AX0-10,Y1,AX1,Y1,{color:C.faint,w:2,dash:'6 8'});
 s+=waveLine(Y1,Us,0,{color:WA})+waveLine(Y1,Us,phi,{color:WB,w:4});
 s+=label('足すと',20,Y2+13,{size:36,color:SUMC,weight:700})+line(AX0-10,Y2,AX1,Y2,{color:C.faint,w:2,dash:'6 8'})+sumLine(Y2,Us,phi);
 s+=plate(`高さ ${mf(h)}`,890,Y2-125,{size:40,color:SUMC,anchor:'end'});
 // つまみ
 const SX0=200,SX1=720,SY=470;
 s+=label('ずれ',40,SY+13,{size:38,color:C.ink,weight:700})+line(SX0,SY,SX1,SY,{color:C.dim,w:6})+dot(mix(SX0,SX1,u),SY,18,HC)+label('0',SX0,SY+55,{size:36,color:C.dim,anchor:'middle'})+label('半波長',SX1,SY+55,{size:36,color:C.dim,anchor:'middle'});
 // グラフ：高さ＝2|cos(φ/2)|
 const O=[200,770],GU=95,gx=v=>O[0]+520*v;
 s+=line(O[0],O[1],740,O[1],{color:C.dim,w:3})+line(O[0],O[1],O[0],O[1]-2.3*GU,{color:C.dim,w:3})+label('高さ',40,O[1]-2*GU+13,{size:38,color:C.dim,weight:700});
 s+=label('2',O[0]-14,O[1]-2*GU+13,{size:36,color:C.ink,anchor:'end',weight:700})+label('0',O[0]-14,O[1]+13,{size:36,color:C.ink,anchor:'end',weight:700})+label('ずれ',760,O[1]+13,{size:36,color:C.dim,weight:700});
 const pts=[];for(let v=0;v<=u+1e-9;v+=.01)pts.push([gx(Math.min(v,u)),O[1]-GU*2*Math.cos(PI*Math.min(v,u)/2)]);
 if(pts.length>1)s+=draw(pts,1,{color:SUMC,w:5});
 s+=dot(gx(u),O[1]-GU*h,11,SUMC);
 return s+FB();};
// ---- 13 事実③：明るさは高さの2乗
D[K+'sq:need']=(p,ctx)=>fact3(vseg(ctx,p,.3,.7),0,400)+FB();
D[K+'sq:bars']=(p,ctx)=>{const base=780,u=85,a=swin(ctx,p,0,0,.3),b1=swin(ctx,p,0,.3,.5),gh=swin(ctx,p,0,.5,.7),x=swin(ctx,p,0,.75,.95),b4=swin(ctx,p,1,.35,.75),l4=swin(ctx,p,1,.72,.9);
 let s=fact3(1,0,60);
 const bar=(cx,v,g,col)=>rect(cx-45,base-u*v*g,90,u*v*g,{fill:col,fo:.85,stroke:col,rx:6});
 s+=line(80,base,900,base,{color:C.dim,w:3});
 s+=fade(a,bar(150,1,1,WA)+bar(290,2,1,WA)+label('1',150,base-u-16,{size:44,color:WA,anchor:'middle',weight:700})+label('2',290,base-2*u-16,{size:44,color:WA,anchor:'middle',weight:700})+label('高さ',220,base+46,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(a,arrow(370,560,480,560,{color:C.dim,w:4,head:16}));
 s+=fade(b1,bar(560,1,1,HC)+label('1',560,base-u-16,{size:44,color:HC,anchor:'middle',weight:700})+label('明るさ',630,base+46,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(gh*(1-b4),drect(655,base-2*u,90,2*u,C.dim)+label('2？',700,base-2*u-16,{size:44,color:C.dim,anchor:'middle',weight:700}));
 s+=fade(x*(1-b4),line(640,base-2*u-60,760,base+10,{color:RED_,w:8})+line(760,base-2*u-60,640,base+10,{color:RED_,w:8})+plate('比例しない',870,base-2*u-80,{size:38,color:RED_,anchor:'end'}));
 s+=fade(b4,bar(700,4,b4,HC))+fade(l4,label('4',700,base-4*u-16,{size:44,color:HC,anchor:'middle',weight:700})+plate('2の 2乗',775,base-3*u,{size:40,color:HC}));
 return s+FB();};
// ---- 14–15 ばね
D[K+'spr:intro']=(p,ctx)=>fact3(1,0,60)+wallV(220,760)+springRow(330,0,{g:vseg(ctx,p,.0,.3)})+fade(vseg(ctx,p,.5,.85),plate('ばね',380,250,{size:42,color:'#c4cde0'}))+FB();
D[K+'spr:force']=(p,ctx)=>{const e1=160*vseg(ctx,p,0,.3),f1=vseg(ctx,p,.15,.42),g2=vseg(ctx,p,.45,.55),e2=320*vseg(ctx,p,.5,.75),f2=vseg(ctx,p,.78,.96);
 return fact3(1,0,60)+wallV(220,760)+springRow(330,e1,{F:90,Fg:f1,Fl:'F',xl:'x',xg:f1})+springRow(600,e2,{g:g2,F:180,Fg:f2,Fl:'2F',xl:'2x',xg:f2})+fade(f1,plate('引き戻す 力',560,245,{size:40,color:RED_}))+FB();};
D[K+'spr:length']=(p,ctx)=>{const t=cueT(p,ctx),pu=.5+.5*Math.sin(t*5),h=vseg(ctx,p,.15,.4);
 return fact3(1,0,60)+wallV(220,760)+springRow(330,160,{F:90,Fg:1,Fl:'F',xl:'x',xg:1})+springRow(600,320,{F:180,Fg:1,Fl:'2F',xl:'2x',xg:1})
  +fade(h,rect(325,388,180,100,{fill:HC,fo:.06+.08*pu,stroke:HC,sw:3,rx:14})+rect(325,658,340,100,{fill:HC,fo:.06+.08*pu,stroke:HC,sw:3,rx:14}))+fade(vseg(ctx,p,.45,.8),plate('引く 長さも 2倍',500,812,{size:42,color:HC,anchor:'middle'}))+FB();};
D[K+'work:four']=(p,ctx)=>{const m=swin(ctx,p,0,.1,.8),sm=swin(ctx,p,1,0,.25),tl=[0,1,2,3].map(i=>swin(ctx,p,1,.5+.07*i,.62+.07*i)),f4=swin(ctx,p,1,.82,.98);
 let s=fact3(1,0,60)+workGraph({marks:m,small:sm*(1-tl[0]),tiles:tl,big:swin(ctx,p,0,.6,.9)});
 s+=fade(sm,plate('仕事 ＝ 三角形の 面積',460,190,{size:40,color:HC,anchor:'middle'}));
 s+=fade(f4,plate('4倍',380,470,{size:56,color:HC,anchor:'middle'}));
 return s+FB();};
// ---- 16 ロープ
D[K+'rope:four']=(p,ctx)=>{const t=cueT(p,ctx),a=vseg(ctx,p,.3,.55),b=vseg(ctx,p,.82,.98);
 let s=fact3(1,0,60)+rope(290,50,t)+rope(600,100,t,{g:a});
 s+=plate('高さ 1',40,190,{size:40,color:LIGHT})+plate('エネルギー 1',880,190,{size:40,color:HC,anchor:'end'});
 s+=fade(a,plate('高さ 2',40,465,{size:40,color:LIGHT}))+fade(b,plate('エネルギー 4',880,465,{size:40,color:HC,anchor:'end'}));
 return s+FB();};
D[K+'rope:light']=(p,ctx)=>{const t=cueT(p,ctx)+3,gl=vseg(ctx,p,.2,.5)*(.7+.3*Math.sin(t*5));
 let s=fact3(1,gl,60)+rope(290,50,t)+rope(600,100,t)+plate('高さ 1',40,190,{size:40,color:LIGHT})+plate('エネルギー 1',880,190,{size:40,color:HC,anchor:'end'})+plate('高さ 2',40,465,{size:40,color:LIGHT})+plate('エネルギー 4',880,465,{size:40,color:HC,anchor:'end'});
 s+=boxMark('光の エネルギーは なぜ 2乗？',40,775,{g:vseg(ctx,p,.6,.9)});
 return s+FB();};
// ---- 17–21 山場
D[K+'peak:count']=(p,ctx)=>yamaba(vseg(ctx,p,0,.3))+peakBars()+fade(vseg(ctx,p,.35,.75),plate('エネルギー（明るさ）で 数え直す',500,450,{size:44,color:HC,anchor:'middle'}))+FB();
D[K+'peak:orig']=(p,ctx)=>yamaba(1)+eqs([swin(ctx,p,0,.55,.85),swin(ctx,p,1,.45,.8)])+peakBars({g:[swin(ctx,p,1,.45,.9),0,0,0]})+FB();
D[K+'peak:four']=(p,ctx)=>yamaba(1)+eqs([1,1,swin(ctx,p,0,.6,.9)],{dim:[1]})+peakBars({g:[1,swin(ctx,p,0,.62,.95),0,0]})+fade(swin(ctx,p,1,.15,.55),plate('1＋1＝4？',900,215,{size:56,color:ORANGE,anchor:'end'}))+FB();
D[K+'peak:zero']=(p,ctx)=>yamaba(1)+eqs([1,1,1,vseg(ctx,p,.55,.85)],{dim:[1,1]})+peakBars({g:[1,1,vseg(ctx,p,.6,.92),0]})+plate('1＋1＝4？',900,215,{size:56,color:ORANGE,anchor:'end'})+FB();
D[K+'peak:avg']=(p,ctx)=>{const e1=swin(ctx,p,0,.3,.6),e2=swin(ctx,p,0,.82,1),lv=swin(ctx,p,1,.1,.5),same=swin(ctx,p,1,.4,.8);
 let s=yamaba(1)+eqs([1,1,1,1],{dim:[1,1,1]})+peakBars({g:[1,1,1,e2],lvl:lv});
 s+=fade(e1,label('平均：（4 ＋ 0）÷ 2',60,410,{size:40,color:C.ink,weight:700}))+fade(e2,label('＝ 2',60+jw('平均：（4 ＋ 0）÷ 2 ')*40,410,{size:40,color:GREEN,weight:700}));
 s+=fade(same,plate('＝ もともとの 2',890,470,{size:40,color:GREEN,anchor:'end'}));
 s+=fade(1-same,plate('1＋1＝4？',900,215,{size:56,color:ORANGE,anchor:'end'}));
 return s+FB();};
D[K+'peak:move']=(p,ctx)=>{const a=swin(ctx,p,0,.3,.8),mv=swin(ctx,p,1,.2,.7),c=swin(ctx,p,1,.6,.95);
 let s=yamaba(1)+eqs([1,1,1,1],{dim:[1,1,1,1]})+label('平均：（4 ＋ 0）÷ 2 ＝ 2',60,410,{size:40,color:C.dim,weight:700})+peakBars({g:[1,1,1,1],lvl:1,move:mv});
 s+=fade(a*(1-mv),plate('消えて いない',500,560,{size:46,color:GREEN,anchor:'middle'}));
 s+=fade(mv,plate('暗い所の 分 → 明るい所へ',450,470,{size:40,color:ORANGE}));
 return s+facts({bolt:1-c,glow1:c,glow2:c,ok:c});};
// ---- 22–25 確かめる（論理の筋）
function predSketch(g,{dark=0,up=0}={}){
 const base=760,u=70,lv=base-2*u;
 let s=line(150,base,850,base,{color:C.dim,w:3})+line(150,lv,850,lv,{color:C.ink,w:3,dash:'10 8'})+label('二つ分（2）',150,lv-16,{size:36,color:C.ink,weight:700});
 s+=fade(dark,line(250,base,370,base,{color:HC,w:9})+label('0',310,base-18,{size:44,color:HC,anchor:'middle',weight:700})+label('暗い所',310,base+46,{size:38,color:C.ink,anchor:'middle',weight:700}));
 s+=fade(up,drect(520,base-3.2*u,120,3.2*u,HC,{sw:4})+arrow(580,lv-10,580,base-3.2*u-30,{color:HC,w:6,head:20})+label('？',660,base-2.8*u,{size:60,color:HC,weight:700})+label('そば',580,base+46,{size:38,color:C.ink,anchor:'middle',weight:700}));
 return fade(g,s);
}
D[K+'check:pred']=(p,ctx)=>BAND(Object.assign([swin(ctx,p,0,0,.35),swin(ctx,p,1,0,.35),swin(ctx,p,1,.5,.9),0,0],{act:swin(ctx,p,1,0,.1)>0?(swin(ctx,p,1,.5,.6)>0?2:1):0}))+predSketch(1,{dark:swin(ctx,p,1,.1,.4),up:swin(ctx,p,1,.55,.9)})+G0();
D[K+'young:setup']=(p,ctx)=>{const t=cueT(p,ctx);
 return BAND(Object.assign([1,1,1,0,0],{act:3}))+young(t,{g:vseg(ctx,p,0,.3),arcs:vseg(ctx,p,.55,.85)})+tag('実験',960,330,{anchor:'end',size:40,g:vseg(ctx,p,.1,.4)})+fade(vseg(ctx,p,.5,.8),plate('すき間 二つ',350,330,{size:38,color:'#c4cde0'}))+note('すき間・縞の 間隔は 大きく 誇張',40,835,{g:vseg(ctx,p,.6,.9)})+G0();};
D[K+'young:fringe']=(p,ctx)=>{const t=cueT(p,ctx)+5,st=vseg(ctx,p,.2,.7);
 return BAND(Object.assign([1,1,1,0,0],{act:3}))+young(t,{stripes:st})+tag('実験',960,330,{anchor:'end',size:40})+fade(vseg(ctx,p,.55,.9),plate('明るい縞と 暗い縞',600,860-140,{size:38,color:LIGHT,anchor:'end'}))+note('すき間・縞の 間隔は 大きく 誇張',40,835)+G0();};
D[K+'young:meas']=(p,ctx)=>{const c=vseg(ctx,p,.08,.38),z=vseg(ctx,p,.25,.42),o=vseg(ctx,p,.55,.72),f=vseg(ctx,p,.78,.95);
 let s=BAND(Object.assign([1,1,1,0,0],{act:3}))+stripeStrip(285,70,{g:vseg(ctx,p,0,.12)});
 s+=igraph({base:785,unit:60,curve:c,one:o,ticks:[[0,c],[1,o],[4,f]]});
 s+=fade(z,plate('ほぼ 真っ暗',QC-QP/2,832,{size:36,color:C.ink,anchor:'middle'}));
 s+=fade(f,plate('約 4倍',QC,785-4*60-26,{size:42,color:LIGHT,anchor:'middle'}));
 s+=note('壁の 真ん中 あたり',40,410);
 return s+G0();};
D[K+'young:avg']=(p,ctx)=>{const av=swin(ctx,p,0,.45,.8);
 let s=BAND(Object.assign([1,1,1,swin(ctx,p,0,.75,1),swin(ctx,p,1,.1,.5)],{act:swin(ctx,p,1,0,.1)>0?4:3}))+stripeStrip(285,70);
 s+=igraph({base:785,unit:60,curve:1,one:1,avg:av,ticks:[[0,1],[1,1],[2,av],[4,1]]});
 s+=note('壁の 真ん中 あたり',40,410);
 return s+G0();};
// ---- 26 水の中へ
D[K+'water:same']=(p,ctx)=>{const t=tg(ctx,p);
 return wv(40,960,250,160,30,0,t,{color:LIGHT,w:4,opacity:.8})+arrow(860,180,960,180,{color:LIGHT,w:4,head:16})+plate('光',60,200,{size:40,color:LIGHT})+grid(t,{y0:420,y1:760})+fade(vseg(ctx,p,.3,.7),plate('水の 中の 電子',500,370,{size:42,color:ELEC,anchor:'middle'}))+G0();};
D[K+'water:side']=(p,ctx)=>{const t=tg(ctx,p),a=vseg(ctx,p,0,.3),b=vseg(ctx,p,.6,.9);
 let s=grid(t,{y0:420,y1:700})+wv(40,960,250,160,30,0,t,{color:LIGHT,w:4,opacity:.8});
 s+=fade(a,[[300,740],[600,740]].map(([x,y])=>arrow(x,y-30,x,y+50,{color:C.dim,w:4,head:14})+line(x-24,y-4,x+24,y+40,{color:RED_,w:5})+line(x+24,y-4,x-24,y+40,{color:RED_,w:5})).join('')+plate('横へは 逃げない',380,815,{size:38,color:C.dim}));
 s+=fade(b,arrow(GX1-150,330,GX1+60,330,{color:HC,w:10,head:30})+plate('エネルギーは 前へ',GX1-520,345,{size:42,color:HC}));
 return s+G0();};
D[K+'water:clear']=(p,ctx)=>{const t=cueT(p,ctx);
 let s=rect(150,330,600,380,{fill:WATER,fo:.22,stroke:SURF,sw:3,rx:12})+label('透き通った 水',450,390,{size:40,color:SURF,anchor:'middle',weight:700});
 s+=wv(40,940,520,160,50,0,t,{color:LIGHT,w:5});
 s+=fade(vseg(ctx,p,.4,.75),line(100,450,100,590,{color:HC,w:3})+line(820,450,820,590,{color:HC,w:3})+plate('同じ 高さの まま',450,780,{size:42,color:HC,anchor:'middle'}));
 s+=fade(vseg(ctx,p,.7,.95),plate('弱まらずに 進む',450,640,{size:42,color:LIGHT,anchor:'middle'}));
 return s+G0();};
// ---- 27–28 懐中電灯の壁に縞が出ない
D[K+'torch:flat']=(p,ctx)=>{const t=cueT(p,ctx),w=swin(ctx,p,0,.45,.75),b=swin(ctx,p,1,.25,.75);
 let s=sideView(t,{y1:110,y2:250,wy0:30,wy1:330,lit:1})+fade(w,stripeStrip(380,80,{flat:true})+plate('縞は ない',500,360,{size:38,color:C.ink,anchor:'middle'}));
 s+=bars12({b1:b,b2:b,base:770,unit:100,lab:false});
 return s+G0();};
D[K+'torch:random']=(p,ctx)=>{const t=cueT(p,ctx),j=Math.floor(t/.3),ph=2*PI*hash(j+3);
 let s=sideView(t,{y1:110,y2:250,wy0:30,wy1:330,lit:1})+stripeStrip(375,70,{ph});
 s+=igraph({base:790,unit:50,curve:vseg(ctx,p,0,.2),ph,ticks:[[0,1],[2,1],[4,1]]});
 s+=fade(vseg(ctx,p,.4,.65),plate('1秒に 何十兆回',500,515,{size:42,color:HC,anchor:'middle'}));
 s+=note('入れ替わりは 大きく 誇張して 遅く',40,835);
 return s+G0();};
D[K+'torch:avg']=(p,ctx)=>{const t=cueT(p,ctx)+4,j=Math.floor(t/.3),ph=2*PI*hash(j+3),mU=vseg(ctx,p,.1,.5),av=vseg(ctx,p,.5,.8);
 let s=sideView(t,{y1:110,y2:250,wy0:30,wy1:330,lit:1})+stripeStrip(375,70,{ph,mixU:mU});
 const fa=[];for(let k=0;k<12;k++)if(mU>k/12)fa.push(2*PI*k/12);
 s+=igraph({base:790,unit:50,curve:1-mU,ph,faint:fa,avgCurve:av,ticks:[[0,1],[2,1],[4,1]]});
 s+=fade(av,plate('平均 2',QX1,790-2*50-22,{size:40,color:GREEN,anchor:'end'}));
 s+=boxMark('なぜ でたらめに 変わる？',430,500,{g:vseg(ctx,p,.7,.95)});
 s+=note('入れ替わりは 大きく 誇張して 遅く',40,835);
 return s+G0();};
// ---- 29 次へ：回る矢印
D[K+'next:hard']=(p,ctx)=>{const ph=60*DEG,Y1=130,Y2=330,Us=55;
 let s=label('波A',20,110,{size:38,color:WA,weight:700})+label('波B',20,175,{size:38,color:WB,weight:700})+line(AX0-10,Y1,AX1,Y1,{color:C.faint,w:2,dash:'6 8'})+waveLine(Y1,Us,0,{color:WA})+waveLine(Y1,Us,ph,{color:WB,w:4});
 s+=label('足すと',20,Y2+13,{size:36,color:SUMC,weight:700})+line(AX0-10,Y2,AX1,Y2,{color:C.faint,w:2,dash:'6 8'})+sumLine(Y2,Us,ph);
 [1,2,3].forEach((k,i)=>{const a=aV(k),b=bV(k,ph),g=vseg(ctx,p,.15+.15*i,.3+.15*i);
  s+=fade(g,line(COLX(k),Y1-80,COLX(k),Y2+110,{color:HC,w:2,dash:'4 8'})+dot(COLX(k),Y1-Us*a,8,WA)+dot(COLX(k),Y1-Us*b,8,WB)+dot(COLX(k),Y2-Us*(a+b),9,SUMC)
   +label(`${mf2(a)} ＋ ${b<0?'（'+mf2(b)+'）':mf2(b)} ＝ ${mf2(a+b)}`,60,520+65*i,{size:40,color:C.ink,weight:700}));});
 s+=fade(vseg(ctx,p,.6,.75),label('…',60,715,{size:44,color:C.ink,weight:700}));
 s+=fade(vseg(ctx,p,.7,.95),plate('一点ずつは 大変',880,780,{size:42,color:HC,anchor:'end'}));
 return s+G0();};
D[K+'next:arrow']=(p,ctx)=>{const t=cueT(p,ctx),O=[500,265],R=130,ph=60*DEG,th=t*1.1,a=swin(ctx,p,0,0,.3),j=swin(ctx,p,0,.35,.75),r=swin(ctx,p,0,.75,.95),fc=swin(ctx,p,1,.15,.55);
 const P=[O[0]+R*Math.cos(th),O[1]-R*Math.sin(th)];
 const Bs=[mix(O[0],P[0],j),mix(O[1],P[1],j)],Q=[Bs[0]+R*Math.cos(th-ph),Bs[1]-R*Math.sin(th-ph)],Qf=[P[0]+R*Math.cos(th-ph),P[1]-R*Math.sin(th-ph)];
 let s=ring(O[0],O[1],R,{color:C.faint,w:2,dash:'6 8'})+dot(O[0],O[1],7,C.dim);
 s+=fade(a,arrow(O[0],O[1],P[0],P[1],{color:WA,w:7,head:22})+arrow(Bs[0],Bs[1],Q[0],Q[1],{color:WB,w:7,head:22}));
 s+=fade(r,arrow(O[0],O[1],Qf[0],Qf[1],{color:SUMC,w:9,head:26}));
 s+=fade(vseg(ctx,p,.1,.3)*(1-fc),plate('回る 矢印',40,80,{size:42,color:C.ink}))+fade(j*(1-fc),plate('つなぐ だけ',40,470,{size:42,color:HC}));
 s+=finalCard(['次の 箱⑤','回る 矢印'],fc,{y:540,size:58})+fade(fc,boxIcon(235,580));
 return s+G0();};

export const deep12Diagrams=D;
