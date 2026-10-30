"""CPU-only comparison of two raw JPEGs; no output image or prior-file edits."""
import argparse,hashlib,json
from pathlib import Path
from PIL import Image,ImageChops
import PIL

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--left',required=True,type=Path);ap.add_argument('--left-sha256',required=True)
    ap.add_argument('--right',required=True,type=Path);ap.add_argument('--right-sha256',required=True)
    a=ap.parse_args();before={p:(p.stat(),sha(p))for p in[a.left,a.right]}
    assert before[a.left][1]==a.left_sha256 and before[a.right][1]==a.right_sha256
    with Image.open(a.left)as left,Image.open(a.right)as right:
        assert left.format==right.format=='JPEG'and left.size==right.size==(1080,1920)
        assert left.mode==right.mode=='RGB'and left.quantization==right.quantization
        left.load();right.load();lb=left.tobytes();rb=right.tobytes()
        diff=ImageChops.difference(left,right);maxdiff=max(v[1]for v in diff.getextrema())
        equal=lb==rb;assert equal==(maxdiff==0)
        result={'left':str(a.left),'right':str(a.right),'leftSha256':a.left_sha256,'rightSha256':a.right_sha256,
            'leftDecodedRgbSha256':hashlib.sha256(lb).hexdigest(),'rightDecodedRgbSha256':hashlib.sha256(rb).hexdigest(),
            'byteExact':a.left_sha256==a.right_sha256,'decodedRgbExact':equal,'maximumAbsoluteChannelDifference':maxdiff,
            'rgbDimensions':[1080,1920,3],'quantizationExactlyEqual':True,'PillowVersion':PIL.__version__,
            'allowedDifference':0,'renderOrEncodePerformed':False,'filesWritten':0,'finalAcceptance':False}
    assert all((p.stat(),sha(p))==state for p,state in before.items())
    print(json.dumps(result,ensure_ascii=False,allow_nan=False))
    return 0 if result['decodedRgbExact']else 2
if __name__=='__main__':raise SystemExit(main())
