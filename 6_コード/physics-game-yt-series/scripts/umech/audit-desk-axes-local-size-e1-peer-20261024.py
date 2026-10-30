"""Record actual displayed previews/candidate MP4 frames, not unseen finals."""
import hashlib
import json
from pathlib import Path

R = Path('/private/tmp/ys')
OUT = R/'axes-local-physical-size-e1-peer-20261024.json'


def read(p):
    return json.loads(Path(p).read_text())


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def main():
    assert not OUT.exists()
    ec = R/'ys-chain-e1v1'
    er = read(ec/'e1v1-r9-moving-camera-existing-review-20261024.json')
    e = []
    for key, t, observation in [
        ('lon:spin',111.,'Real principal is globe plus24-hour dial, not only the sphere; approximately75% wide, fully in frame. The real70% maximum is exceeded, not an image-heuristic exemption.'),
        ('lon:torch',125.,'Globe and torch both visible, combined width approximately79%; earlier124.5 exact preview is absent, but original full-geometry moving audit has negative left edge. Requires new actual probe and local size/clip repair.')]:
        source = next(r for r in er['review'] if r['cue']==key)
        image = next(r for r in source['actualExistingPreviewImagesViewed'] if r['t']==t)
        assert sha(image['file']) == image['sha256']
        e.append({'cue':key,'time':t,'actuallyViewed1080x1920':True,'file':image['file'],
                  'sha256':sha(image['file']),'numericActualStateSamples':source['numericMovingSamples'],
                  'observation':observation,'sourceScope':'Existing r9 3D+2D probe, NOT final encoded MP4',
                  'original7bWaived':False,'repairHelper':'scripts/blender/desk_axes_e1_local_fit_20261024.py',
                  'newRepairRenderedOrViewed':False})
    b2 = R/'ys-chain-b1v1-final2-20261024'
    manifest = read(b2/'actual-mp4-review/manifest.json')
    dimensions = read(R/'ys-chain-b1v1-final3-20261024/final-held-dimensions.json')
    provenance = read(R/'ys-chain-b1v1-final3-20261024/composite-provenance.json')
    b = []
    for t, observation in [
        (45.,'Whole sailor with garlic in front, no clipping; actual physical sailor primary about39%, still below40%.'),
        (81.5,'Two bar magnets together, both ends visible; combined physical principal approximately80%, above70%.'),
        (115.,'Open compass box including lid, no clipping; combined physical principal approximately35%, below40%.')]:
        image = next(r for r in manifest['halfSeconds']['frames'] if r['time']==t)
        sample = next(r for r in dimensions['samples'] if r['sampleTime']==t)
        record = provenance['records'][image['frame']]
        assert record['kind']=='byte-identical-B2-delivered-raw'
        b.append({'cue':sample['cue'],'time':t,'frame':image['frame'],'file':image['file'],
                  'sha256':sha(image['file']),'actuallyViewed1080x1920':True,
                  'sourceScope':'Actual encoded B2 MP4; B3 raw source is unchanged here, but B3 encoded MP4 not yet viewed',
                  'physicalMeasurement':sample,'observation':observation,'original7bWaived':False,
                  'rawB3SourceStillB2ByteIdentical':True,'finalB3Accepted':False})
    report = {'scope':'Scene-specific real physical size/clip defects; original image NG unchanged',
              'EExistingPreviewActualEyes':e,'B2ActualMp4EyesForUnchangedB3Raw':b,
              'B3All17Outside40to70SamplesRetained':dimensions['measurementsOutside40to70Retained'],
              'B3PhysicalClipSamplesAfterD361Patch':dimensions['clipsRetained'],
              'fullScreenFaceSeparateFromPhysicalPrimary':True,
              'gate7or7bAutoPass':False,'finalVideosAccepted':False,'GPUStarted':False}
    with OUT.open('x') as f:
        json.dump(report,f,ensure_ascii=False,indent=1);f.write('\n')
    print(OUT)


if __name__=='__main__':
    main()
