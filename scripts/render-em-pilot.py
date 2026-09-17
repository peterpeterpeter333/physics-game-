"""Original vector animation + locally generated VOICEVOX Nemo narration.
Run with Pillow, numpy, imageio-ffmpeg and Nemo engine at localhost:50123.
No browser recording, external voice service, or third-party visual assets.
"""
from pathlib import Path
import io, json, math, subprocess, urllib.request, urllib.parse, wave, hashlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/media'
OUT.mkdir(parents=True, exist_ok=True)
CACHE = Path('/private/tmp/physics-nemo-pilot/render')
CACHE.mkdir(parents=True, exist_ok=True)
SPEAKER = 10001  # VOICEVOX Nemo 男声1
SCENES = [
 (7, '今回の目標は、電気力がする仕事', 'この動画は、曲がった道で電気力がする仕事を解説します。', '道全体の仕事は、短い区間の仕事の合計'),
 (8, '電荷が受ける力は、電荷の量と電場の積', '電荷が受ける力は、電荷の量と電場の積です。この例の電場は、右ほど強くなります。', 'F = qE     力 = 電荷 × 電場'),
 (10, '曲がった道の短い一区間は、直線で近似できる', '曲がった道の短い一区間は、直線で近似できます。その区間の仕事には、移動方向の力の成分が効きます。', 'ΔW ≈ F cos θ × Δs'),
 (8, '力と移動の内積は、一区間の仕事を近似する', '力と移動の内積は、この区間の仕事を近似します。デルタアールは、短い移動を表すベクトルです。', 'ΔW ≈ F · Δr'),
 (9, '道全体の仕事は、各区間の仕事の合計', '道全体の仕事は、各区間の仕事を足して近似できます。シグマは、各区間の仕事を足す記号です。', 'Wₙ = Σ Fᵢ · Δrᵢ'),
 (10, '道を表す折れ線は、分割を増やすと曲線に近づく', '道を表す折れ線は、分割を増やすほど元の曲線に近づきます。仕事の和の極限が、線積分です。', 'W = lim Wₙ = ∫C F · dr'),
 (8, 'この線積分は、電気力が道全体でする仕事を表す', 'この線積分は、電気力が道全体でする仕事を表します。記号シーは、電荷が進む道を表します。', 'W = q ∫C E · dr'),
]
BG='#0b1122'; WHITE='#eef3ff'; MUTED='#a7b7d3'; BLUE='#62d7ff'; GOLD='#ffce70'; GREEN='#8aebc1'; RED='#ee90b9'
FONT='/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc'
BOLD='/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc'
MATH='/System/Library/Fonts/Supplemental/DejaVuSans.ttf'
if not Path(MATH).exists(): MATH='/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
fonts={}
def font(size,bold=False,mathfont=False):
 key=(size,bold,mathfont)
 if key not in fonts: fonts[key]=ImageFont.truetype(MATH if mathfont else BOLD if bold else FONT,size)
 return fonts[key]
def request(endpoint,params,payload=None):
 url='http://127.0.0.1:50123/'+endpoint+'?'+urllib.parse.urlencode(params)
 req=urllib.request.Request(url,data=json.dumps(payload).encode() if payload is not None else b'',headers={'Content-Type':'application/json'})
 return urllib.request.urlopen(req,timeout=180).read()

audio=[]; durations=[]
for i,(duration,title,narration,formula) in enumerate(SCENES):
 spoken=narration.replace('電場','でんば')
 fingerprint=hashlib.sha256(f'{SPEAKER}|0.90|{spoken}'.encode()).hexdigest()[:16]
 wav=CACHE/f'nemo-{fingerprint}.wav'
 if not wav.exists():
  query=json.loads(request('audio_query',{'text':spoken,'speaker':SPEAKER}))
  query.update(speedScale=.90,prePhonemeLength=.15,postPhonemeLength=.2)
  wav.write_bytes(request('synthesis',{'speaker':SPEAKER},query))
 with wave.open(str(wav)) as w:
  assert w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2
  samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').copy()
 length=len(samples)/24000
 durations.append(max(duration,length+.65))
 audio.append(samples)
 print(f'{i+1}: voice {length:.2f}s / scene {durations[-1]:.2f}s',flush=True)

total=sum(durations)
track=np.zeros(round(total*24000),dtype='<i2')
starts=[sum(durations[:i]) for i in range(len(SCENES))]
for start,samples in zip(starts,audio):
 pos=round((start+.2)*24000);track[pos:pos+len(samples)]=samples
with wave.open(str(CACHE/'narration.wav'),'wb') as w:
 w.setparams((1,2,24000,0,'NONE','not compressed'));w.writeframes(track.tobytes())

def smooth(t):
 t=max(0,min(1,t));return t*t*(3-2*t)
def point(u):return (120+660*u,420-155*math.sin(math.pi*u))
def arrow(d,a,b,color,width=4,head=11):
 d.line([a,b],fill=color,width=width)
 angle=math.atan2(b[1]-a[1],b[0]-a[0])
 d.polygon([b,(b[0]-head*math.cos(angle-.45),b[1]-head*math.sin(angle-.45)),(b[0]-head*math.cos(angle+.45),b[1]-head*math.sin(angle+.45))],fill=color)
def txt(d,xy,text,size=26,color=WHITE,bold=False,mathfont=False):
 d.text(xy,text,font=font(size,bold,mathfont),fill=color)
def wrap(text,n):return [text[j:j+n] for j in range(0,len(text),n)]

def render(t):
 scene=max(i for i,s in enumerate(starts) if s<=t)
 local=t-starts[scene];p=min(1,local/durations[scene]);reveal=smooth(local/2)
 duration,title,narration,formula=SCENES[scene]
 im=Image.new('RGB',(1280,720),BG);d=ImageDraw.Draw(im)
 txt(d,(48,23),'PHYSICS QUEST   /   大学電磁気・中級',19,MUTED)
 txt(d,(48,61),title,36,WHITE,True)
 txt(d,(1150,33),f'{scene+1} / 7',20,GREEN)
 d.line((48,117,1232,117),fill='#293752',width=1)
 # Fixed field: E=(kx/q,0), q=1 C, k=1 N/m. The curve is externally prescribed.
 for x in range(230,820,110):
  for y in range(195,451,85):
   length=(x-120)/660*75
   arrow(d,(x,y),(x+length,y),'#24445b',2,6)
 curve=[point(j/150) for j in range(151)]
 d.line(curve,fill='#516178',width=3)
 arrow(d,(105,462),(840,462),MUTED,2,9)
 txt(d,(806,476),'x [m]',19,MUTED,mathfont=True)
 txt(d,(110,478),'0',18,MUTED);txt(d,(762,478),'2',18,MUTED)
 txt(d,(92,424),'A',22,GREEN);txt(d,(785,424),'B',22,GREEN)
 txt(d,(310,222),'電荷が進む道 C',22,GOLD)
 # Sidebar holds only the quantities relevant to this shot.
 d.rounded_rectangle((898,153,1230,499),radius=20,fill='#111f34')
 if scene<2:
  u=smooth(p*.95);a=point(u)
  d.line([point(j/150) for j in range(max(2,int(u*150)))],fill=GOLD,width=5)
  d.ellipse((a[0]-10,a[1]-10,a[0]+10,a[1]+10),fill=GOLD)
  txt(d,(a[0]-7,a[1]-16),'+',20,BG,True)
  if scene==1 and u>.03:arrow(d,a,(a[0]+u*115,a[1]),BLUE,5,14)
  txt(d,(920,177),'この動画が求める量',23,MUTED)
  txt(d,(920,219),'電場がする仕事 W',25,WHITE,True)
  txt(d,(920,271),'背景の青い矢印は電場 E',19,BLUE)
  txt(d,(920,307),'電荷の青い矢印は力 F',19,BLUE)
  txt(d,(920,343),'金の線は電荷が進んだ道',19,GOLD)
  txt(d,(920,399),'外から加える力が道を指定',18,MUTED)
  txt(d,(920,433),'この道は電気力だけの軌道とは別',16,MUTED)
 elif scene in (2,3):
  # Magnified local tangent; force projection onto the direction of motion.
  a=(330,385);theta=-math.atan(155*math.pi*math.cos(.27*math.pi)/660);b=(a[0]+195*math.cos(theta),a[1]+195*math.sin(theta))
  d.line((point(.27),a),fill='#607089',width=1)
  arrow(d,a,b,GOLD,6,15)
  f=(a[0]+160,a[1]);arrow(d,a,f,BLUE,6,15)
  proj=(a[0]+160*math.cos(theta)**2,a[1]+160*math.cos(theta)*math.sin(theta))
  if local>2:
   end=(f[0]+(proj[0]-f[0])*smooth((local-2)/2),f[1]+(proj[1]-f[1])*smooth((local-2)/2))
   d.line([f,end],fill=GREEN,width=2)
   arrow(d,(a[0],a[1]-7),(proj[0],proj[1]-7),GREEN,4,10)
  d.arc((a[0]-50,a[1]-50,a[0]+50,a[1]+50),330,360,fill=WHITE,width=2)
  txt(d,(390,350),'θ',22,WHITE,mathfont=True)
  txt(d,(486,390),'F',28,BLUE,mathfont=True)
  txt(d,(485,257),'Δr',28,GOLD,mathfont=True)
  txt(d,(337,284),'F cos θ',25,GREEN,mathfont=True)
  txt(d,(920,180),'中央の図は一区間の拡大',20,WHITE,True)
  txt(d,(920,235),'Δr：電荷の短い移動',22,GOLD,mathfont=True)
  txt(d,(920,276),'Δs：電荷の移動の長さ',22,GOLD,mathfont=True)
  txt(d,(920,317),'θ：力と移動の角度',22,MUTED,mathfont=True)
  txt(d,(920,386),'内積 F · Δr',27,GREEN,mathfont=True)
  txt(d,(920,432),'= F cos θ × Δs',24,GREEN,mathfont=True)
 elif scene in (4,5):
  n=4 if scene==4 else [4,8,16,32][min(3,int(p*4))]
  selected=min(n-1,int(p*n)) if scene==4 else min(n-1,int((p*4%1)*n))
  for j in range(n):
   a,b=point(j/n),point((j+1)/n)
   color=GOLD if j==selected else GREEN if j<selected else '#7c879c'
   d.line([a,b],fill=color,width=6 if j==selected else 3)
   d.ellipse((a[0]-3,a[1]-3,a[0]+3,a[1]+3),fill=color)
  a=point(selected/n)
  if selected:arrow(d,a,(a[0]+selected/n*95,a[1]),BLUE,4,10)
  txt(d,(920,177),f'分割数 N = {n}',26,WHITE,True)
  txt(d,(920,232),'各区間の力は左端の値で近似',18,MUTED)
  txt(d,(920,277),f'仕事の和：{2*(1-1/n):.3f} J',23,GREEN)
  txt(d,(920,337),'数値例：q = 1 C',20,MUTED,mathfont=True)
  txt(d,(920,372),'E_x = kx / q',23,BLUE,mathfont=True)
  txt(d,(920,409),'k = 1 N/m',22,MUTED,mathfont=True)
  txt(d,(920,448),'仕事の和は 2 J に近づく',20,GREEN)
 else:
  u=smooth(p)
  d.line(curve,fill=GREEN,width=5)
  a=point(u);d.ellipse((a[0]-9,a[1]-9,a[0]+9,a[1]+9),fill=GOLD)
  if u>.03:arrow(d,a,(a[0]+u*80,a[1]),BLUE,4,10)
  txt(d,(920,178),'線積分の読み方',25,WHITE,True)
  txt(d,(920,234),'C：電荷が進む道',23,GOLD)
  txt(d,(920,281),'dr：電荷の微小な移動',21,GOLD,mathfont=True)
  txt(d,(920,328),'E：電荷の位置での電場',21,BLUE)
  txt(d,(920,409),'線積分は小区間の仕事の集計',18,GREEN)
 d.rounded_rectangle((48,513,1232,584),radius=12,fill='#17283e')
 # Formulas are vector-like rendered graphics in the encoded video, not raw TeX.
 if scene:
  equation=Image.open(CACHE/f'formula-{scene}.png').convert('RGBA')
  im.paste(equation,(74,520),equation)
 else:txt(d,(74,526),formula,32,WHITE)
 # Subtitle follows the spoken sentence rather than showing the entire script.
 parts=[s+'。' for s in narration.split('。') if s]
 spoken_duration=len(audio[scene])/24000
 ratios=[len(s)/sum(map(len,parts)) for s in parts]
 progress=max(0,min(.999,(local-.2)/spoken_duration));acc=0;subtitle=parts[-1]
 for sentence,ratio in zip(parts,ratios):
  acc+=ratio
  if progress<acc:subtitle=sentence;break
 for j,line in enumerate(wrap(subtitle,43)):txt(d,(60,608+j*34),line,26,WHITE)
 txt(d,(48,684),'音声：VOICEVOX Nemo 男声1  |  Physics Quest オリジナル映像',16,MUTED)
 d.rectangle((0,714,1280*t/total,720),fill=BLUE)
 return im

fps=24
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
video=OUT/'em-line-integral-nemo.mp4'
proc=subprocess.Popen([ffmpeg,'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s','1280x720','-r',str(fps),'-i','-','-i',str(CACHE/'narration.wav'),'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',str(video)],stdin=subprocess.PIPE,stderr=open(CACHE/'encode.log','w'))
for frame in range(math.ceil(total*fps)):
 t=min(total-.001,frame/fps)
 im=render(t)
 proc.stdin.write(im.tobytes())
 if frame%240==0: print(f'render {t:.0f}/{total:.1f}s',flush=True)
proc.stdin.close()
assert proc.wait()==0
render(2).save(OUT/'em-line-integral-nemo.jpg',quality=90)
for i,start in enumerate(starts):render(start+durations[i]*.55).save(CACHE/f'shot-{i}.png')
(OUT/'em-line-integral-nemo.json').write_text(json.dumps({'duration':total,'voice':'VOICEVOX Nemo 男声1','speaker':SPEAKER,'engine':'0.24.0','scenes':[{'start':s,'duration':d,'title':row[1],'narration':row[2]} for s,d,row in zip(starts,durations,SCENES)]},ensure_ascii=False,indent=2))
print(f'Created {video} ({total:.2f}s)',flush=True)
