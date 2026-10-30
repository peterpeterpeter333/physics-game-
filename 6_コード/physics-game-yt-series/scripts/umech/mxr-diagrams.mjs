// Supplemental mechanisms for the revised Maxwell documentary. No remote assets.
// Every mode is tied to a particular question, not a decorative shared loop.
import {MX,clamp,mix,smooth,fade,label,line,rect,dot,ring,draw,arrow,stage,charge,magnet,compass,fit} from './mx-common.mjs';
import {mxADiagrams} from './mxA-diagrams.mjs';
import {mxBDiagrams} from './mxB-diagrams.mjs';
import {mxCDiagrams} from './mxC-diagrams.mjs';
import {mxDDiagrams} from './mxD-diagrams.mjs';
import {clips as originalClips} from '../../docs/video-revision-20260924/experiments/maxwell-journey.mjs';
const originalReadings=Object.fromEntries(originalClips[0].scenes.flatMap(s=>s.cues).map(q=>[q.diagram,q.reading]));
const ALL={...mxADiagrams,...mxBDiagrams,...mxCDiagrams,...mxDDiagrams};
const L=(s,x,y,color=MX.ink,size=30)=>label(s,x,y,{size,color,anchor:'middle'});
const A=(x,y,X,Y,c=MX.E,w=5)=>arrow(x,y,X,Y,{color:c,w,head:14});
const path=(pts,c=MX.E,w=4,fill='none')=>`<path d="M${pts.map(p=>p.join(' ')).join(' L')}" stroke="${c}" stroke-width="${w}" fill="${fill}"/>`;
const box=(x,y,w,h,col=MX.dim)=>rect(x,y,w,h,{fill:MX.bg2,fo:.5,stroke:col,sw:2,rx:10});
const txt=(s,y=480)=>L(s,600,y,MX.hi,28);
const T=(p,a,b)=>smooth(clamp((p-a)/(b-a)));
const mode=ctx=>ctx.cue.mode;
const plane=(x,y,w,h,col=MX.E)=>`<polygon points="${x-w/2},${y-h/2} ${x+w/2},${y-h/2-35} ${x+w/2},${y+h/2-35} ${x-w/2},${y+h/2}" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width="3"/>`;
const field=(col=MX.E)=>Array.from({length:5},(_,i)=>A(140,175+i*58,1000,175+i*58,col,3)).join('');
const normal=(x,y,g=1)=>fade(g,A(x,y,x+115,y,MX.hi));
const sourceDot=(x,y,col=MX.B)=>ring(x,y,9,{color:col,w:2})+dot(x,y,3,col);
const intoDot=(x,y,col=MX.E)=>ring(x,y,9,{color:col,w:2})+line(x-4,y-4,x+4,y+4,{color:col,w:2})+line(x-4,y+4,x+4,y-4,{color:col,w:2});

function charges(p,ctx){const m=mode(ctx);let s='';
 if(m==='signs'){
  const d=45*T(p,.1,.75);s+=L('同じ符号：反発',320,145,MX.hi,28)+L('逆の符号：引き合う',865,145,MX.hi,28);
  s+=charge(270-d,280,1,{r:28})+charge(370+d,280,1,{r:28})+A(225-d,280,160-d,280,MX.good)+A(415+d,280,480+d,280,MX.good);
  s+=charge(735+d,280,1,{r:28})+charge(1000-d,280,-1,{r:28})+A(775+d,280,835+d,280,MX.good)+A(960-d,280,900-d,280,MX.good);
  return s+txt('緑の矢印：それぞれの電荷が受ける力');
 }
 if(m==='transfer'||m==='signs'){
  s=box(170,160,310,220)+box(720,160,310,220);
  for(let k=0;k<6;k++){const x=230+(k%3)*85,y=220+Math.floor(k/3)*95;s+=charge(x,y,1,{r:17})+(k===4?'':charge(x+30,y,-1,{r:12}));s+=charge(x+550,y,1,{r:17})+charge(x+580,y,-1,{r:12});}
  const q=m==='signs'?1:T(p,.12,.7);s+=charge(mix(345,775,q),mix(315,285,q),-1,{r:12})+A(490,285,695,285,MX.minus)+L('電子が移る',600,240,MX.minus);
  s+=L('電子が少ない → ＋',325,430,MX.plus)+L('電子が多い → −',875,430,MX.minus);
  if(m==='signs')s+=txt('同じ符号：反発　／　逆の符号：引き合う');
 }else{
  s=box(140,210,920,130);for(let i=0;i<10;i++)s+=charge(180+((i*85-ctx.t*35+3000)%840),280,-1,{r:13});
  s+=A(400,170,810,170,MX.I)+L('電流：プラスの移動を基準に決める',600,135,MX.I,27)+A(810,390,400,390,MX.minus)+L('電子の移動は逆向き',600,440,MX.minus);
 }return s;}
function compare(p,ctx){const m=mode(ctx);let s='';
 if(m==='distance'){for(let i=0;i<3;i++){const y=165+i*105,d=120*(i+1);s+=charge(160,y,1,{r:20})+charge(160+d,y,1,{r:20})+line(160,y+32,160+d,y+32,{color:MX.dim,w:2})+L(`${i+1}倍の距離`,800,y-12)+A(875,y+16,875+150/(i+1)**2,y+16,MX.good)+L(['力 1','力 1/4','力 1/9'][i],800,y+34,MX.hi,26);}return s;}
 const q=m==='product'?1+T(p,.15,.42):1+T(p,.2,.7),Q=m==='product'?1+T(p,.5,.8):1,fl=60*q*Q;
 s=charge(380,290,1,{r:28})+charge(820,290,1,{r:28})+A(340,290,340-fl,290,MX.good)+A(860,290,860+fl,290,MX.good)+line(380,380,820,380,{color:MX.dim,w:3});
 s+=L(m==='symbols'?'q：電荷量':`電荷量 ${q.toFixed(1)}`,380,210,MX.plus)+L(m==='symbols'?'Q：相手の電荷量':`電荷量 ${Q.toFixed(1)}`,820,210,MX.plus)+L('r：距離は固定',600,430,MX.dim)+txt(m==='symbols'?'F：力の大きさ（今は両方ともプラス）':m==='product'?'2 × 2 ＝ 4倍の力':'一つだけ変え、ほかの条件はそろえる');return s;}
function fields(p,ctx){const m=mode(ctx),cx=350,cy=285;let s=charge(cx,cy,1,{r:30});
 for(let i=0;i<7;i++)for(let j=0;j<4;j++){const x=150+i*120,y=155+j*88,dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy);if(r<65)continue;const len=Math.min(70,13000/r);s+=A(x,y,x+len*dx/r,y+len*dy/r,MX.E,3);}
 if(m==='force'){s+=box(880,140,280,280)+L('同じ場所の電場',1020,180,MX.E,25)+charge(915,225,1,{r:17})+A(955,225,1025,225,MX.good)+L('電荷 1 → 力 1',1020,270,MX.ink,23)+charge(915,320,1,{r:23})+A(955,320,1095,320,MX.good)+L('電荷 2 → 力 2',1020,375,MX.ink,23)+txt('電荷量で割ると、同じ場所の電場が残る');}
 else if(m==='trace'){const pts=[];for(let i=0;i<90;i++){const x=390+i*5;pts.push([x,cy-.35*(x-cx)]);}s+=draw(pts,T(p,.1,.85),{color:MX.hi,w:6});const k=Math.floor(T(p,.1,.85)*89);s+=dot(...pts[k],9,MX.hi)+txt('その場所の矢印に沿い、少しずつ線を描く');}
 else if(m==='density'){for(let k=0;k<16;k++){const a=k*Math.PI/8;s+=line(cx+35*Math.cos(a),cy+35*Math.sin(a),cx+240*Math.cos(a),cy+240*Math.sin(a),{color:MX.E,w:2});}s+=txt('線は地図の描き方。電気の粒の道ではない');}
 else{const x=650+130*Math.cos(ctx.t*.45),y=285+110*Math.sin(ctx.t*.45),dx=x-cx,dy=y-cy,r=Math.hypot(dx,dy);s+=charge(x,y,1,{r:16})+A(x,y,x+80*dx/r,y+80*dy/r,MX.good)+L('小さなプラスの試験電荷',810,460,MX.good,26)+L('向きと強さを調べる',780,130,MX.E,27);}return s;}
function sphere(p,ctx){const R=70+70*T(p,.25,.8),cx=500,cy=285;let s=charge(cx,cy,1,{r:24});
 for(let j=-2;j<=2;j++)s+=`<ellipse cx="${cx}" cy="${cy+j*R*.3}" rx="${R*Math.sqrt(1-j*j*.09)}" ry="${Math.max(8,R*.18)}" fill="none" stroke="${MX.E}" opacity=".35"/>`;
 s+=ring(cx,cy,R,{color:MX.E,w:3});for(let i=0;i<14;i++){const a=i*Math.PI*2/14;s+=A(cx+35*Math.cos(a),cy+35*Math.sin(a),cx+(R+40)*Math.cos(a),cy+(R+40)*Math.sin(a),MX.E,2);}
 s+=L('球の表面全体に広がる',930,220,MX.E,27)+L('半径 2倍 → 面積 4倍',930,295,MX.hi,26)+txt(mode(ctx)==='compare'?'実験法則の可視化。線の絵だけが証明ではない':'前後にも広がる、立体の球を考える');return s;}
function flux(p,ctx){const m=mode(ctx),mag=m.startsWith('magnetic'),col=mag?MX.B:MX.E;let s='';
 if(['area','tilt','normal','magnetic-tilt'].includes(m)){
  const a=(m==='area'?0:.9*T(p,.15,.82)),w=170*Math.cos(a);s=field(col)+plane(590,300,w,260,col);
  s+=L(mag?'同じ磁場':'同じ電場',260,130,col)+L('面積は同じ',810,130)+L(`正面から見える割合 ${Math.round(Math.cos(a)*100)}%`,870,405,MX.hi,25);
  if(m==='normal'){s=field(col);const nx=Math.cos(a),ny=-Math.sin(a),tx=-ny,ty=nx;s+=path([[590-tx*120,285-ty*120],[590+tx*120,285+ty*120]],MX.ink,8)+A(590,285,590+130*nx,285+130*ny,MX.hi)+A(590,285,740,285,col)+line(740,285,590+150*nx*nx,285+150*nx*ny,{color:MX.dim,w:2,dash:'6 5'})+A(590,285,590+150*nx*nx,285+150*nx*ny,MX.good,7)+L('面を横から見る',290,130,MX.ink,27)+L('黄色：面に垂直な向き',910,160,MX.hi,25)+L('緑：電場の垂直成分',910,215,MX.good,25)+txt('垂直な成分 × 面積を計算する');}
  else s+=txt(m==='area'?'正面を向く面：電場の強さ × 面積':'面を傾けると、通り抜ける成分が減る');
 }else{
  const cx=650,cy=285,R=140;const pts=Array.from({length:121},(_,k)=>{const a=k/120*Math.PI*2,r=R*(1+.15*Math.sin(a*3+ctx.t*.35));return[cx+r*Math.cos(a),cy+r*.9*Math.sin(a)];});s=path(pts,MX.dim,3);
  if(m==='outside'||m==='magnetic'){
   for(let j=0;j<4;j++){const y=205+j*55;s+=A(230,y,1060,y,col,3)+dot(520,y,7,MX.minus)+dot(790,y,7,MX.plus);}s+=L('この範囲でほぼ一様な場を例にする',610,105,MX.dim,25);
   s+=L('入る分：−',430,150,MX.minus)+L('出る分：＋',870,150,MX.plus)+txt('差し引きゼロでも、各場所の場はゼロではない');
  }else{
   s+=charge(cx,cy,1,{r:23});for(let i=0;i<12;i++){const a=i*Math.PI/6;s+=A(cx+40*Math.cos(a),cy+40*Math.sin(a),cx+200*Math.cos(a),cy+200*Math.sin(a),MX.E,3);}
   if(m==='patches'){for(let i=0;i<12;i++){const a=i*Math.PI/6,x=cx+R*Math.cos(a),y=cy+R*.9*Math.sin(a);s+=`<rect x="${x-12}" y="${y-6}" width="24" height="12" transform="rotate(${a*180/Math.PI+90} ${x} ${y})" fill="${i/12<p?MX.hi:MX.faint}"/>`;}
    s+=L('小さな面ごとに',235,230)+L('垂直な成分 × 面積',235,280,MX.hi,26)+L('積を全部足す',235,335);}
   else s+=L(m==='gauss'?'中の電荷が決める':'想像上の面',230,270,MX.hi)+txt(m==='gauss'?'正味の電気束：外向き − 内向き':'面を変えても、電荷や電場は変わらない');
  }
 }return s;}
function magnetic(p,ctx){const m=mode(ctx);let s=magnet(570,285,{w:250,h:60});
 if(m==='predict'){s+=line(570,190,570,380,{color:MX.hi,w:4,dash:'10 8'})+L('切ったら、片方の極だけになる？',600,140,MX.hi)+L('予想してから、次の実験へ',600,450,MX.dim);}
 else {for(let k=0;k<8;k++){const a=k*Math.PI/4,x=570+250*Math.cos(a),y=285+155*Math.sin(a);let bx=0,by=0;for(const [px,q] of [[695,1],[445,-1]]){const dx=x-px,dy=y-285,r=Math.hypot(dx,dy);bx+=q*dx/r**3;by+=q*dy/r**3;}const angle=Math.atan2(-by,bx)*180/Math.PI;s+=compass(x,y,mix(0,angle,T(p,.1,.5)),{r:24});}s+=txt(m==='detect'?'方位磁針は、磁場を調べる道具':'針の N 極が向く方向を、矢印にする');}return s;}
function circulation(p,ctx){const m=mode(ctx),cx=535,cy=305,rx=260,ry=125;let s=A(cx,430,cx,145,MX.I,8)+L('一定の電流 I',cx,120,MX.I);
 const pts=Array.from({length:101},(_,k)=>{const a=-k/100*Math.PI*2,r=m==='deform'?1+.13*Math.sin(3*a+ctx.t*.4):1;return[cx+rx*r*Math.cos(a),cy+ry*r*Math.sin(a)];});s+=path(pts,MX.dim,3);
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a);s+=A(x,y,x+45*Math.sin(a),y-25*Math.cos(a),MX.B,3);}
 const k=Math.floor(clamp(p)*95);s+=draw(pts.slice(0,k+2),1,{color:MX.hi,w:5});
 s+=L(m==='setup'?'B：磁場　r：電線からの距離':m==='sum'?'矢印自体ではなく、積を合計':m==='circle'?'円では B がどこでも同じ':m==='deform'?'形を変えても、閉じた道':'短い区間ごとに計算',600,475,MX.hi,27);
 if(m==='pieces'||m==='sum')s+=box(875,195,280,140)+L('道に沿う成分',1015,235,MX.B,25)+L('× 区間の長さ',1015,295,MX.hi,25);
 return s;}
function induction(p,ctx){const m=mode(ctx);let s='';
 if(m==='no-wire'||m==='predict'){
  const cx=590,cy=285,R=115;const g=m==='predict'?1:1-T(p,.08,.4);
  s+=fade(g,ring(cx,cy,R,{color:MX.ink,w:7}));
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const x=cx+(i-1)*52,y=cy+(j-1)*52;s+=sourceDot(x,y,MX.B)+ring(x,y,12+7*T(p,.1,.8),{color:MX.B,w:1});}
  for(let k=0;k<10;k++){const a=k*Math.PI/5,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);s+=A(x,y,x-33*Math.sin(a),y+33*Math.cos(a),MX.E,4);}
  s+=L('輪を正面から見る',600,120,MX.ink,27)+L('手前向きの磁場が増える',945,225,MX.B,25)+L('電場は時計回り',945,285,MX.E,25);
  if(m==='no-wire')s+=charge(cx+R,cy,1,{r:16})+A(cx+R,cy,cx+R,cy+65,MX.good);
  return s+txt(m==='predict'?'電線だけ取り去ると、電場も消える？':'電線がなくても、プラスの試験電荷は力を受ける');
 }
 if(m==='pipe'){s=box(500,145,180,280,MX.B)+magnet(590,170+180*T(p,.1,.8),{w:75,h:38,angle:90})+A(730,340,730,220,MX.good)+L('電流が作る磁場の力',920,270,MX.good,26)+txt('磁石の動き → 誘導電流 → 上向きの力');s+=`<ellipse cx="590" cy="370" rx="90" ry="22" fill="none" stroke="${MX.I}" stroke-width="5"/>`+dot(590+90*Math.cos(ctx.t*2),370+22*Math.sin(ctx.t*2),7,MX.I)+L('誘導電流',850,375,MX.I,25);return s;}
 const no=m==='no-wire',pr=m==='predict';let cg=no?1-T(p,.08,.4):1;
 s+=fade(cg,Array.from({length:6},(_,i)=>`<ellipse cx="${540+i*23}" cy="270" rx="19" ry="100" fill="none" stroke="#c9d2e3" stroke-width="4"/>`).join(''));
 const mx=m==='stop'?310+80*Math.min(p/.4,1):320+80*Math.sin(ctx.t*.8);s+=magnet(mx,270,{w:175,h:48});
 if(!no&&!pr)s+=path([[540,370],[540,410],[870,410],[870,345],[920,345]],MX.dim,3)+path([[655,370],[655,390],[1120,390],[1120,250],[1090,250]],MX.dim,3);
 if(no||pr){for(let k=0;k<9;k++){const a=k*2*Math.PI/9,x=640+110*Math.cos(a),y=270+110*Math.sin(a);s+=A(x,y,x-40*Math.sin(a),y+40*Math.cos(a),MX.E,4);}if(no)s+=charge(750,270,1,{r:16})+A(750,270,750,335,MX.good);s+=txt(pr?'電線だけ取り去ると、電場も消える？':'電場は残り、試験電荷は力を受ける');}
 else{const ang=(m==='stop'&&p>.45)||m==='open'?0:Math.cos(ctx.t*.8)*.65;s+=box(880,170,210,170)+ring(985,250,60,{color:MX.dim,w:2})+A(985,275,985+65*Math.sin(ang),275-65*Math.cos(ang),MX.plus)+L('0',985,200,MX.ink,24);s+=L('逆向き ← 電流 →',985,440,MX.I,22);
  if(m==='open')s+=rect(760,398,80,25,{fill:MX.bg,fo:1,stroke:'none',sw:0,rx:0})+line(760,410,835,365,{color:MX.ink,w:4});
  if(m==='open')s+=L('回路が開けば、電流は流れない',600,460,MX.hi,27);
  else if(m==='lenz')s+=txt('近づける：増加を打ち消す ／ 遠ざける：減少を補う');
  else s+=txt(m==='stop'?'磁石を止める → 変化が止まる → 針はゼロ':'巻いた電線を、電流計につなぐ');}
 return s;}
function rate(p,ctx){const m=mode(ctx),x0=230,y0=405;let s=A(x0,y0,1000,y0,MX.dim,3)+A(x0,y0,x0,140,MX.dim,3)+L('時間',1020,440,MX.dim,25)+L('磁束',180,130,MX.B,26);
 if(m==='average'){s+=draw([[230,380],[500,200]],T(p,.1,.65),{color:MX.E,w:6})+draw([[230,380],[770,200]],T(p,.1,.85),{color:MX.B,w:6})+line(230,200,820,200,{color:MX.dim,w:2,dash:'6 6'})+L('同じ変化量',930,220,MX.hi,25)+L('1秒',500,445,MX.E,27)+L('2秒',770,445,MX.B,27);return s+txt('同じ変化量なら、短い時間ほど変化率が大きい');}
 const f=x=>380-.0004*(x-230)**2;const pts=Array.from({length:100},(_,k)=>[230+k*6,f(230+k*6)]);s+=draw(pts,1,{color:MX.B,w:4});
 const x=520,dx=m==='instant'?mix(240,24,T(p,.15,.85)):200,y=f(x),Y=f(x+dx);s+=dot(x,y,8,MX.hi)+dot(x+dx,Y,8,MX.hi)+line(x,y,x+dx,Y,{color:MX.E,w:4})+line(x,y,x+dx,y,{color:MX.dim,w:2,dash:'6 6'})+line(x+dx,y,x+dx,Y,{color:MX.dim,w:2,dash:'6 6'});
 s+=L('時間の差',650,430,MX.hi,24)+line(650,410,x+dx/2,y+8,{color:MX.dim,w:2})+L('磁束の差',970,280,MX.B,24)+line(895,280,x+dx+8,(y+Y)/2,{color:MX.dim,w:2})+txt('時間の区間を短くする → その瞬間の変化率');return s;}
function capacitor(p,ctx){const m=mode(ctx),n=Math.round(2+6*T(p,.1,.75));let s=line(120,280,510,280,{color:MX.dim,w:5})+line(650,280,1080,280,{color:MX.dim,w:5})+line(510,150,510,410,{color:MX.ink,w:8})+line(650,150,650,410,{color:MX.ink,w:8});
 if(m==='setup'||m==='charge')s+=path([[120,280],[120,430],[275,430]],MX.dim,4)+path([[325,430],[1080,430],[1080,280]],MX.dim,4)+line(285,405,285,455,{color:MX.plus,w:5})+line(315,415,315,445,{color:MX.minus,w:5})+L('電源',300,490,MX.dim,24);
 for(let i=0;i<n;i++){const y=170+i*30;s+=charge(490,y,1,{r:10})+charge(670,y,-1,{r:10});s+=A(525,y,630,y,MX.E,3);}
 if(m==='gauss'){s+=box(450,130,130,300,MX.hi)+L('片方の板を包む面',280,160,MX.hi,27)+L('内側の面だけが残る',890,435,MX.E,27)+txt('大きな板・狭いすき間：端の効果を無視');}
 else if(m!=='plain'){const g=m==='charge'?1-T(p,.15,.8):1;s+=fade(g,A(240,235,380,235,MX.I))+L(g>.05?'電線の電流':'充電が済むと電流ゼロ',280,190,MX.I,24)+L('すき間は渡らない',785,490,MX.hi,26);if(m==='charge')s+=fade(g,A(390,335,240,335,MX.minus)+A(940,335,780,335,MX.minus))+L('電子',900,375,MX.minus,24);}return s;}
function surface(p,ctx){const m=mode(ctx);let s=capacitor(p,{...ctx,cue:{...ctx.cue,mode:'plain'}});const cx=340,cy=280,end=420+210*T(p,.12,.8);
 s+=`<ellipse cx="${cx}" cy="${cy}" rx="30" ry="95" fill="${MX.hi}" fill-opacity=".08" stroke="${MX.hi}" stroke-width="4"/>`;
 s+=`<path d="M${cx} ${cy-95} Q${end} ${cy-145} ${end} ${cy-115} L${end} ${cy+115} Q${end} ${cy+145} ${cx} ${cy+95}" fill="${MX.hi}" fill-opacity=".07" stroke="${MX.dim}" stroke-width="2" stroke-dasharray="7 5"/>`;
 s+=L('縁の輪は固定',270,120,MX.hi,26)+L('膜の形だけ変える',850,120,MX.dim,26);
 if(m==='equal')s+=box(760,290,370,105)+L('電流の寄与 ＝ 変化の寄与',945,350,MX.good,24);
 else if(m==='same')s+=box(760,290,370,105)+L('左辺は、同じ輪の計算',945,350,MX.hi,25);
 return s;}
function waves(p,ctx){const m=mode(ctx);let s='';
 if(m==='intro'){for(let j=0;j<3;j++){const y=175+j*100;s+=L(['電波','マイクロ波','可視光'][j],160,y,MX.ink,28);const pts=Array.from({length:100},(_,k)=>[300+k*6,y-25*Math.sin(k*.3-ctx.t*3)]);s+=draw(pts,1,{color:[MX.E,MX.B,MX.hi][j],w:4});}return s+txt('真空中では、同じ速さ');}
 if(m==='medium'||m==='next'){s+=box(600,135,330,285,MX.E)+L('ガラス',765,175,MX.E)+A(180,160,600,290,MX.hi)+A(600,290,900,335,MX.hi)+L(m==='next'?'次の謎：なぜ斜めに入ると曲がる？':'今回は真空。物質中では応答も必要',600,465,MX.hi,27);return s;}
 const shift=ctx.t*2.5; s+=A(130,315,1100,315,MX.dim,2)+L('波が進む向き',960,465,MX.hi,27)+A(810,425,1070,425,MX.hi);
 const camera=m==='axes'?1.0*T(p,.12,.85):0;
 for(let k=0;k<20;k++){const x=180+k*42,a=75*Math.sin(k*.35-shift),ey=a*Math.cos(camera),ez=-a*Math.sin(camera),by=a*Math.sin(camera),bz=a*Math.cos(camera);s+=A(x,315,x+ez*.55,315-ey+ez*.65,MX.E,3)+A(x,315,x+bz*.55,315-by+bz*.65,MX.B,3);}
 if(m==='axes')s+=L('視点を回転：同じ波を別の向きから見る',395,465,MX.dim,24);
 if(m==='source'){s+=line(130,170,130,420,{color:MX.ink,w:7})+A(100,295,100,295-80*Math.sin(shift),MX.I,4)+L('電線は固定',150,130,MX.I,25);}
 else{s+=L('電場',340,135,MX.E)+L('磁場',730,135,MX.B);if(m==='probe'||m==='same-place')s+=line(600,145,600,400,{color:MX.hi,w:2,dash:'7 5'})+L('同じ場所を観察',600,110,MX.hi,26);}
 return s;}
function waveLoop(p,ctx){const m=mode(ctx),dual=m==='rotate'||m==='dual',col=dual?MX.E:MX.B,left=470,right=860,top=195,bottom=390,xf=600+90*T(p,.15,.75);let s='';
 s+=L(dual?'⊗ 電場：画面の奥向き':'⊙ 磁場：画面の手前向き',350,105,col,24);
 s+=rect(140,140,xf-140,290,{fill:col,fo:.06,stroke:'none',sw:0,rx:0});
 for(let i=0;i<9;i++)for(let j=0;j<3;j++){const x=170+i*55,y=190+j*85;if(x<xf)s+=dual?intoDot(x,y,MX.E):sourceDot(x,y,MX.B);}
 s+=line(xf,140,xf,430,{color:MX.hi,w:3})+A(xf,115,xf+115,115,MX.hi)+L('v',xf+130,125,MX.hi);
 s+=path([[left,top],[right,top],[right,bottom],[left,bottom],[left,top]],MX.ink,4)+L('想像上の計算の道',945,105,MX.ink,24);
 for(let i=0;i<7;i++){const x=170+i*65;s+=dual?A(x,320,x,255,MX.B,3):A(x,320,x,255,MX.E,3);}
 if(m==='strip'){s+=rect(600,top,xf-600,bottom-top,{fill:MX.hi,fo:.3,stroke:MX.hi,sw:2,rx:0})+L('v Δt',645,425,MX.hi,27)+L('h',890,300,MX.hi);}
 if(m==='edges'||m==='sign'){
  const u=T(p,.08,.85),n=Math.min(3,Math.floor(u*4));const edges=[[[right,top],[right,bottom]],[[left,top],[right,top]],[[left,bottom],[right,bottom]],[[left,bottom],[left,top]]];s+=path(edges[n],MX.hi,9);
  s+=L(n===0?'場がない → 0':n<3?'道と電場が垂直 → 0':'道に沿う成分 × 高さ',600,485,MX.hi,25);
  if(m==='sign')s+=A(left-25,bottom,left-25,top,MX.hi,4)+L('この周回向きで符号をそろえる',690,155,MX.hi,24);
 }else if(dual)s+=L('輪を横向きに見る：電場が面を貫く',600,475,MX.hi,26);
 else if(m==='path')s+=L('電線ではない。法則を使うための輪',590,475,MX.hi,26);
 else if(m==='front')s+=L('左：場がある　右：まだ場がない',600,475,MX.hi,27);
 if(dual)s+=L('w',890,300,MX.hi,28);
 return s;}
function evidence(p,ctx){const m=mode(ctx);let s=box(95,150,425,225,MX.E)+box(680,150,425,225,MX.B)+charge(230,245,1,{r:25})+charge(385,245,1,{r:25})+A(195,245,130,245,MX.good)+A(420,245,485,245,MX.good)+A(890,300,890,215,MX.I,6)+`<ellipse cx="890" cy="265" rx="95" ry="26" fill="none" stroke="${MX.B}" stroke-width="3"/>`+A(860,290,925,290,MX.B,4)+L('電荷どうしの力',307,190,MX.E,28)+L('電流が作る磁場',892,190,MX.B,28);
 if(m==='values'){s+=fit('\\varepsilon_0\\approx8.85\\times10^{-12}\\;\\mathrm{F/m}',307,340,375,28)+fit('\\mu_0\\approx1.26\\times10^{-6}\\;\\mathrm{N/A^2}',892,340,375,28);}
 else{s+=L('ε₀',307,330,MX.E,40)+L('μ₀',892,330,MX.B,40);}
 s+=A(430,390,530,445,MX.E)+A(770,390,670,445,MX.B)+L(m==='light'?'光は電磁波':m==='laws'?'法則の予測を実験で確かめる':'最後に、一つの速さへ',600,495,MX.hi,29);return s;}
function quiz(p,ctx){let s=flux(p,{...ctx,cue:{...ctx.cue,mode:'surface'}});if(mode(ctx)!=='answer')s=s.replace('想像上の面','形を変えた面');s+=L(mode(ctx)==='answer'?'答え：中の電荷':'袋の形？　それとも中の電荷？',600,110,MX.hi,30);return s;}
function constant(p,ctx){return fit('F=k\\frac{|qQ|}{r^2}',600,230,820,60)+fade(T(p,.2,.7),fit('k=\\frac{1}{4\\pi\\varepsilon_0}',600,365,850,60))+txt('同じ定数を、別の記号で書く');}
const fs={charge:charges,compare,field:fields,sphere,flux,magnetic,circulation,induction,rate,capacitor,surface,waves,'wave-loop':waveLoop,evidence,quiz,constant};
export const mxrDiagrams=Object.fromEntries(Object.entries(fs).map(([k,f])=>['mxr-'+k,(p,ctx)=>stage(ctx,p,f(p,ctx))]));
for(const [k,f] of Object.entries(ALL))mxrDiagrams['mxr-original:'+k]=(p,ctx)=>f(p,{...ctx,cue:{...ctx.cue,subtitle:ctx.cue.visualSubtitle??ctx.cue.subtitle,reading:originalReadings[k]??ctx.cue.reading}});
