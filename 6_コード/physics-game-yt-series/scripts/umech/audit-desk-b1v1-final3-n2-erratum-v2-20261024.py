"""Correct only a missing-key metadata flag in the add-only N2 erratum."""
import hashlib
import json
from pathlib import Path

C = Path('/private/tmp/ys/ys-chain-b1v1-final3-20261024')
source = C/'b3-e1-peer-n2-temporal-interpretation-erratum-20261024.json'
out = C/'b3-e1-peer-n2-temporal-interpretation-erratum-v2-20261024.json'
assert not out.exists()
record = json.loads(source.read_text())
review = json.loads(Path(record['earlierReview']).read_text())
assert review['scope']['allAssigned354ActuallyViewed'] is True
assert review['scope']['actualHalfSecondFramesViewed'] == 354
record['priorErratum'] = str(source)
record['priorErratumSha256'] = hashlib.sha256(source.read_bytes()).hexdigest()
record['metadataCorrection'] = 'v1 read a nonexistent top-level viewing flag with defaultFalse; the actual recorded flag is scope.allAssigned354ActuallyViewed=true. No images or observations changed.'
record['all354AssignedLaterFramesAnd36PageSHAReviewStillValid'] = True
record['unchangedEarlierActualScope'] = review['scope']
with out.open('x') as f:
    json.dump(record, f, ensure_ascii=False, indent=1)
    f.write('\n')
print(out)
