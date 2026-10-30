"""Record the B3 actual pictures really displayed in this task, not B4/B5."""
import hashlib
import json
from pathlib import Path
import time

C = Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
MANIFEST = C/'actual-mp4-review/manifest.json'
JOIN = C/'b3-original-proxy-physical-e1-peer-v2.json'
OUT = C/'b3-e1-peer-actual-half180-356_5-review.json'
EXPANDED = (186.5,202.5,203.5,208.5,211.,228.5,249.5,256.5,294.5,305.5,316.5,330.,339.5,349.5)
VIDEO_SHA = '9c851d2126f6092d3cb208c919c82e8fc259ca1e593dc13db2b3ed9499ee0983'


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p):
    return json.loads(Path(p).read_text())


def main():
    assert not OUT.exists()
    manifest, joined = read(MANIFEST), read(JOIN)
    assert sha(manifest['video'])==manifest['videoSha256']==VIDEO_SHA
    half = manifest['halfSeconds']['frames']
    subset = [r for r in half if 180<=r['time']<=356.5]
    assert len(subset)==354 and [r['time'] for r in subset]==[180+i*.5 for i in range(354)]
    joined_rows = {r['actualMp4Frame']:r for r in joined['samples']}
    pages=[]
    for n in range(37,73):
        file=manifest['halfSeconds']['pages'][n-1]
        rows=half[(n-1)*10:n*10]
        assert Path(file).name=='half-seconds-%02d.jpg'%n
        assert sha(file)==manifest['halfSeconds']['pageSha256'][file]
        pages.append({'page':n,'file':file,'sha256':sha(file),'firstTime':rows[0]['time'],'lastTime':rows[-1]['time'],
                      'actualFramesViewed':len(rows),'actuallyViewed':True})
    assert sum(r['actualFramesViewed'] for r in pages)==354
    samples=[]
    for image in subset:
        r=joined_rows[image['frame']]
        assert image['frame']==r['actualMp4Frame']==r['originalDeskFrame']==r['physicalMeasuredOutputFrame']
        assert image['time']==r['time'] and image['cue']==r['cue'] and image['row']==r['row']
        assert sha(image['file'])==r['actualJpegSha256']
        samples.append({**image,'sha256':r['actualJpegSha256'],'actuallyViewedOnHalfSecondSheet':True,
                        'expandedOriginalResolution':image['time'] in EXPANDED,
                        'originalFeatures':r['originalFeatures'],'originalHeuristicFlags':r['originalHeuristicFlags'],
                        'physical':r['physical'],'compositeFaceHint':r['compositeFaceHint'],
                        'automaticGateWaiverApplied':False})
    expanded=[{**r,'sha256':sha(r['file']),'actuallyViewed1080x1920':True} for r in subset if r['time'] in EXPANDED]
    assert len(expanded)==14
    physics=next(r for r in manifest['major']['frames'] if r['time']==97.6)
    assert sha(physics['file'])==physics['sha256']
    report={'episode':'B-1','candidate':'Third actual encoded candidate B3, not final; B4/B5 pending',
        'reviewer':'episode_e1','recordedAt':time.strftime('%Y-%m-%d %H:%M:%S'),
        'video':manifest['video'],'videoSha256ActuallyRehashed':VIDEO_SHA,
        'manifest':str(MANIFEST),'manifestSha256':sha(MANIFEST),
        'exactOriginalProxyPhysicalJoin':str(JOIN),'joinSha256':sha(JOIN),
        'scope':{'firstTime':180,'lastTime':356.5,'stepSeconds':.5,'actualHalfSecondFramesViewed':354,
                 'allAssigned354ActuallyViewed':True,'contactPagesViewed':36,'expandedActualJpegsViewed':14,
                 'additionalMajor97_6ActuallyViewed':True,'allFirstHalfFramesReviewedByThisPass':False,
                 'entireAll30fpsVideoViewed':False},
        'pages':pages,'expandedActualJpegs':expanded,'samples':samples,
        'confirmedCorrectionsInThisActualMp4':[
            {'times':[186.5],'observation':'Red/blue8px2D annotation dots are clear at exact original leader endpoints. They do not imply the hidden lower3D cap was physically moved or fully revealed.'},
            {'times':[202.5,203.5,208.5,211.],'observation':'New24percent sleeve/hand no longer covers half the sphere or the whole explained pole. At208.5 placing the needle briefly covers its pivot, then hand leaves; the red/white needle and local angle frame are clear at211.'},
            {'times':[249.5],'observation':'Norman, horizontal baseline, both needle halves and semicircle0/30/60/90 are present; red half points downward near72degree mark. Fact label and voice subtitle agree.'},
            {'times':[294.5],'observation':'Compass red N tip remains above the fixed captions and connects by a visible yellow line to the blue S half in geographic north. Full compass lid/globe remain in frame.'},
            {'times':[330.],'observation':'Small wooden box and lightning are present at the spoken electricity explanation; the box persists afterward and answer mechanism is not exposed.'},
            {'times':[339.5],'observation':'New ivory reading edge plus thin black border makes the white half distinguishable from the protractor. Red half, pivot and local horizontal baseline are distinguishable. Question stays neutral and does not reveal the answer.'},
            {'times':[349.5],'observation':'Complete open compass including lid and both needle halves is in frame; no earlier giant-lid/empty-desk transition is present at this actual sample.'}],
        'transientActionOcclusionNotAutomaticallyCalledFailure':[
            {'times':[228.,228.5],'expanded':228.5,'observation':'The old large pointing hand briefly hides the needle pivot and line origin while pointing at the island prediction. After withdrawal the shallow line and its label remain visible230..235; this is not a claim of uninterrupted pivot visibility.'},
            {'times':[256.,256.5],'expanded':256.5,'observation':'The old large hand briefly covers the pivot/upper line origin. The critical red cross, green correct-prediction circle and labels are drawn in front and readable; the complete diagram is visible after withdrawal257.5..260.5.'},
            {'times':[305.,305.5,306.],'expanded':305.5,'observation':'Pointing hand briefly partly covers blue S. Lower red N and naming-order label remain visible; hand is gone before geographic-north=S result label appears307.5..314. No new persistent result occlusion was confirmed.'}],
        'requiredBookTwoSubjectComposition':{'time':316.5,'observation':'Open book plus required physical scoreboard both visible; page-circle illustration is faint and book alone below40percent. The measured combined principal must not be reported as the book alone.'},
        'additionalCriticalPhysicsDefectConfirmed':{**physics,'actuallyViewed1080x1920':True,
            'observation':'At97.6 the near ends are left blue S / right red N, but caption says repulsion and overlay says N/N repels. This is a real physical contradiction, not a proxy/size exception.',
            'rootNotified':True,'rootAssignedCorrection':'D B5 add-only a-orientation/recoil correction; not yet applied in this B3 MP4',
            'firstHalfScopeLimitedToThisActualMajorSample':True},
        'otherRealSizeRepairsPending':['lore:garlic','rule:first','rule:north'],
        'faceCompositesAreSeparateFromPhysicalObjectWidth':True,
        'originalGate7And7bResultsRetained':joined['originalNumericResultsRetained'],
        'originalWhole714SummaryRetained':joined['originalFeatureSummary'],
        'automaticGate7or7bWaiverApplied':False,'otherNGExcused':False,
        'finalPassed':False,'earListeningPerformed':False,
        'unconfirmed':['B4 three real-size corrections and B5 critical repulsion correction still require actual probes, approval, source renders and a new encoded MP4 review.',
                       'This pass does not review all first-half0.5second frames, every cue end, all movement intermediates or all30fps frames.',
                       'The original7/7b NG is unchanged. Geometry and actual images supplement only scene-specific judgments, never an automaticPASS.',
                       'Root owns original/Nemo checks. No GPU was submitted or audio regenerated by this reviewer.']}
    with OUT.open('x') as f:
        json.dump(report,f,ensure_ascii=False,indent=1,allow_nan=False);f.write('\n')
    print(json.dumps({'out':str(OUT),'pagesActuallyViewed':36,'actualHalfSecondFramesViewed':354,'expanded':14,'additionalMajorPhysics':97.6,'finalPassed':False}))


if __name__=='__main__':
    main()
