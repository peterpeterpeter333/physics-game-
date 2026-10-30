// 高校編「磁場と電磁誘導・要点」(ys-hs-e-magnet-summary) — 図。Stage 1200×515. 深く学ぶ 1/4〜4/4 の部品を使う。
import {C,clamp,mix,seg,fade,label,line,rect,dot,ring,draw,arrow,highlight} from './anim.mjs';
import {card,tag,FA,BC,IC,FC,PHI,EMF,BAD,T,cs,Bt,It,Ft,Phit,EMt,tt,U,wireTop,fieldCircle,compassRing,wireV,hand,fieldEllipse,fieldRows} from './yt1-hs-e-magnet-1-diagrams.mjs';
import {coilRig} from './yt1-hs-e-magnet-2-diagrams.mjs';
import {lenzRig,tile} from './yt1-hs-e-magnet-3-diagrams.mjs';
import {axes2,tri} from './yt1-hs-e-magnet-4-diagrams.mjs';

const K='hs-e-magnet-summary:';
const At=cs(C.ink,'A'),thT=cs(C.ink,'\\theta'),Nt=cs(C.ink,'N'),lt=cs(C.ink,'l');
const PHIDEF=`${Phit}=${Bt}${At}\\cos${thT}`;
const LAW=`${EMt}=${Nt}\\times\\dfrac{\\Delta${Phit}}{\\Delta${tt}}`;
const FLAW=`${Ft}=${Bt}${It}${lt}`;
const crossX=(x,y,r=26,g=1)=>fade(g,line(x-r,y-r,x+r,y+r,{color:BAD,w:6})+line(x-r,y+r,x+r,y-r,{color:BAD,w:6}));
function flatF({g=1}={}){
 let s=fieldRows(70,620,[100,180,260,340,420],{len:60,gap:110});
 s+=rect(300,226,64,64,{fill:C.bg,fo:1,stroke:'none',rx:32})+wireTop(332,258,'out',{r:22,dx:6,dy:-6})+FA(332,228,332,90,{w:11,head:28})+label('F',356,150,{size:32,color:FC,weight:700});
 return fade(g,s);
}
export const hsEMagnetSummaryDiagrams={
 [K+'field']:(p)=>fieldCircle(330,262,150,1,{g:seg(p,.3,.55),nh:4,phase:22.5,w:3})+wireTop(330,262,'out',{r:26})+compassRing({turn:seg(p,.3,.6)})+fade(seg(p,.6,.8),label('円い 磁場',870,250,{size:40,color:BC,anchor:'middle',weight:700})),
 [K+'hand']:(p)=>`<g transform="translate(30 50) scale(.75)">${wireV(330)+hand(330)+fieldEllipse(330,410,110,30)}</g>`+card(520,80,640,130,label('親指 ＝ 電流、指 ＝ 磁場',840,160,{size:34,color:C.ink,anchor:'middle',weight:700}),seg(p,.05,.25),IC)+card(520,260,640,130,label('磁場 ＝ 向きと 強さの 地図',840,340,{size:34,color:BC,anchor:'middle',weight:700}),seg(p,.5,.7),BC),
 [K+'force']:(p)=>flatF({g:seg(p,0,.2)})+card(700,100,440,150,T(FLAW,920,195,{size:60}),seg(p,.4,.6),FC)+fade(seg(p,.55,.75),label('電流 と 磁場 が 直角 のとき',920,300,{size:30,color:C.hi,anchor:'middle',weight:700})),
 [K+'tesla']:(p)=>flatF()+card(700,100,440,150,T(FLAW,920,195,{size:60}),1,FC)+fade(seg(p,.2,.45),T(`1${U('T')}=1\\,\\dfrac{\\mathrm{N}}{\\mathrm{A\\cdot m}}`,920,360,{size:50})),
 [K+'flux']:(p)=>`<g transform="translate(0 0)">${tile({th:40,cross:1})}</g>`+card(780,120,380,160,T(PHIDEF,970,220,{size:46}),seg(p,.1,.3),PHI)+fade(seg(p,.55,.75),label('θ：法線と 磁場の 角',970,340,{size:28,color:C.ink,anchor:'middle',weight:700})),
 [K+'law']:(p)=>card(220,80,760,250,T(LAW,600,225,{size:80}),seg(p,.3,.5),EMF)+fade(seg(p,0,.25),label('磁束が 変化 → 起電力',600,420,{size:34,color:C.hi,anchor:'middle',weight:700})),
 [K+'lenz']:(p)=>card(150,110,900,200,label('向き：磁束の 変化を 妨げる',600,225,{size:40,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi)+fade(seg(p,.5,.7),label('レンツの 法則',600,390,{size:36,color:C.ink,anchor:'middle',weight:700})),
 [K+'why']:(p)=>coilRig({mx:mix(1000,700,seg(p,.3,.6))})+fade(seg(p,.6,.8),label('止めた 磁石 → 針は 0',900,160,{size:30,color:C.ink,anchor:'middle',weight:700})),
 [K+'why2']:(p)=>{const a=seg(p,.05,.5);return coilRig({mx:mix(1000,700,a),needle:.7*Math.sin(Math.PI*a)})+fade(seg(p,.4,.6),label('変わる 間だけ 振れる',900,160,{size:30,color:C.hi,anchor:'middle',weight:700}));},
 [K+'graph']:(p)=>{
  let s=axes2({x:90,y:400,w:430,h:300})+draw([[90,140],[520,140]],1,{color:PHI,w:5})+label('高い けど 一定',300,110,{size:28,color:C.ink,anchor:'middle',weight:700});
  s+=fade(seg(p,.2,.4),label('起電力 0',300,470,{size:32,color:EMF,anchor:'middle',weight:700}));
  s+=axes2({x:660,y:400,w:430,h:300})+draw([[660,380],[1090,300]],1,{color:PHI,w:5})+label('低い けど 変化',870,250,{size:28,color:C.ink,anchor:'middle',weight:700})+tri(760,361,960,324,{g:seg(p,.45,.65)});
  s+=fade(seg(p,.6,.8),label('傾き → 起電力',870,470,{size:32,color:EMF,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex']:(p)=>{
  let s=axes2({x:150,y:420,w:560,h:300});
  const X=t=>150+t/0.6*560,Y=f=>420-f/0.012*300;
  s+=label('0.010',140,Y(.01)+8,{size:24,color:PHI,anchor:'end'})+label('0.50',X(.5),452,{size:24,color:C.t,anchor:'middle'});
  s+=draw([[X(0),Y(.01)],[X(.5),Y(0)],[X(.6),Y(0)]],seg(p,.2,.6),{color:PHI,w:5});
  s+=fade(seg(p,.05,.2),label('巻数 100',960,170,{size:36,color:C.ink,anchor:'middle',weight:700}));
  return s;
 },
 [K+'ex2']:(p)=>T(`\\dfrac{0.010${U('Wb')}}{0.50${U('s')}}=0.020${U('Wb/s')}`,600,130,{size:50})+fade(seg(p,.45,.65),T(`${EMt}=100\\times0.020=2.0${U('V')}`,600,320,{size:58})),
 [K+'ex3']:(p)=>T(`${EMt}=2.0${U('V')}`,600,130,{size:50})+fade(seg(p,.1,.35),T(`${It}=\\dfrac{2.0${U('V')}}{4.0${U('\\Omega')}}=0.50${U('A')}`,600,320,{size:58})),
 [K+'only']:(p)=>{
  let s=axes2({x:150,y:420,w:560,h:300});
  const X=t=>150+t/0.6*560,Y=f=>420-f/0.012*300;
  s+=label('0.010',140,Y(.01)+8,{size:24,color:PHI,anchor:'end'})+label('0.50',X(.5),452,{size:24,color:C.t,anchor:'middle'});
  s+=draw([[X(0),Y(.01)],[X(.5),Y(0)],[X(.6),Y(0)]],1,{color:PHI,w:5});
  s+=fade(seg(p,.05,.25),rect(X(0),110,X(.5)-X(0),310,{fill:IC,fo:.1,stroke:'none',rx:4})+label('0.50 A',X(.25),100,{size:30,color:IC,anchor:'middle',weight:700}));
  s+=fade(seg(p,.55,.75),label('止まれば 0',X(.55)+40,380,{size:28,color:C.ink,weight:700}));
  return s;
 },
 [K+'myth']:(p)=>card(150,120,900,200,label('誘導の 磁場は いつも 元と 逆向き？',600,235,{size:38,color:C.ink,anchor:'middle',weight:700}),seg(p,0,.2),BAD)+crossX(1000,220,30,seg(p,.6,.8)),
 [K+'inc']:(p)=>{const mx=mix(860,700,seg(p,0,.4));return lenzRig({mx,meterG:0,phi:clamp((1000-mx)/300),ind:seg(p,.4,.6)})+fade(seg(p,.5,.7),label('増える → 逆向き',900,140,{size:32,color:C.hi,anchor:'middle',weight:700}));},
 [K+'dec']:(p)=>{const mx=mix(700,900,seg(p,.05,.5));return lenzRig({mx,meterG:0,phi:clamp((1000-mx)/300),ind:seg(p,.5,.7),indDir:-1})+fade(seg(p,.55,.75),label('減る → 同じ 向き',900,140,{size:32,color:C.hi,anchor:'middle',weight:700}));},
 [K+'rule']:(p)=>card(150,150,900,180,label('逆らうのは 磁場ではなく、その 変化',600,255,{size:38,color:C.hi,anchor:'middle',weight:700}),seg(p,0,.2),C.hi),
 [K+'sum']:(p)=>{
  let s='';[['電流 → 磁場',BC],['磁場 × 電流 → 力',FC],['磁束の 変化 → 起電力',EMF]].forEach(([t,c],i)=>{const g=seg(p,.02+i*.12,.15+i*.12);s+=fade(g,rect(250,50+i*100,700,70,{fill:c,fo:.12,stroke:c,sw:2.5,rx:12})+label(t,600,96+i*100,{size:30,color:c,anchor:'middle',weight:700}));});
  s+=fade(seg(p,.6,.8),label('モーター と 発電機は 裏表',600,420,{size:34,color:C.hi,anchor:'middle',weight:700}));
  return s;
 },
 [K+'guide']:(p)=>card(250,140,700,200,label('なぜ そうなるかは',600,215,{size:30,color:C.ink,anchor:'middle'})+label('深く学ぶ版で',600,285,{size:42,color:C.hi,anchor:'middle',weight:700}),seg(p,.05,.25),C.hi),
};
