"""Match the lesson export's AAC96k audio setting, without generating video."""
from pathlib import Path
import hashlib,json,re,subprocess
O=Path(__file__).resolve().parent
FF='/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1'
source=Path('/private/tmp/ys/ys-chain-b2a_s3_gpt_20261029/audio-v4/ys-chain-b2a_gpt_20261029.s3.mixed.wav')
dest=O/'audio/codec-preflight';dest.mkdir(exist_ok=False)
audio=dest/'b2a-s3-aac96-preflight.m4a'
encode=subprocess.run([FF,'-hide_banner','-nostats','-n','-i',str(source),'-vn','-c:a','aac','-b:a','96k',str(audio)],capture_output=True,text=True)
assert encode.returncode==0,encode.stderr[-1000:]
verify=subprocess.run([FF,'-hide_banner','-nostats','-err_detect','explode','-i',str(audio),'-af','ebur128=framelog=quiet:peak=true,silencedetect=n=-35dB:d=0.25','-f','null','-'],capture_output=True,text=True)
log=verify.stderr
summary=log[log.rfind('Summary:'):]
I=float(re.search(r'I:\s*(-?[\d.]+) LUFS',summary)[1]);peak=float(re.search(r'Peak:\s*(-?[\d.]+) dBFS',summary)[1])
starts=[float(x) for x in re.findall(r'silence_start: ([\d.]+)',log)]
ends=[float(x) for x in re.findall(r'silence_end: ([\d.]+)',log)]
result={'input':str(source),'inputSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'aac':str(audio),'audioCodec':'AAC','bitrate':'96k','strictDecodeExit':verify.returncode,'integratedLUFS':I,'truePeakDbfs':peak,'silenceStarts':starts,'silenceEnds':ends,'pass':verify.returncode==0 and abs(I+14)<.5 and peak<0 and len(starts)==0,'scope':'Audio-codec preflight only; not the final MP4, no ear check.'}
(dest/'aac96-preflight.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False))
assert result['pass'],result
