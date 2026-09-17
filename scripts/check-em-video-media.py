"""Decode every video and verify its real audio/video streams and timeline."""
import json, subprocess, re, concurrent.futures
from pathlib import Path
import imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
catalog=json.loads((root/'src/content/em-video-catalog.generated.json').read_text())
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
def check(clip):
    file=root/'public/media/em'/f"{clip['id']}.mp4"
    info=subprocess.run([ffmpeg,'-hide_banner','-i',str(file)],capture_output=True,text=True).stderr
    assert 'Video: h264' in info and 'Audio: aac' in info,clip['id']
    match=re.search(r'Duration: (\d+):(\d+):([\d.]+)',info)
    duration=int(match[1])*3600+int(match[2])*60+float(match[3])
    assert abs(duration-clip['duration'])<.15,clip['id']
    p=subprocess.run([ffmpeg,'-v','error','-i',str(file),'-f','null','-'],capture_output=True,text=True)
    assert p.returncode==0 and not p.stderr.strip(),(clip['id'],p.stderr)
    return clip['id']
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for i,id in enumerate(pool.map(check,catalog)):print(f'{i+1}/{len(catalog)} decoded {id}',flush=True)
print('PASS: all H.264/AAC files decoded; all durations match narration timelines.')
