"""Read-only CPU evidence for one explicitly authorized E-1 control case.

This does not relabel whole-image RGB equality. It accepts only frame 9540's
frozen old JPEG and at most 100 differing pixels inside the inclusive 16x16
right-edge background-heading rectangle, with per-channel difference <= 2.
Every pixel outside that rectangle must remain exactly equal. No files are
written and no Blender, renderer, video decoder or encoder is invoked.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--left', required=True)
    parser.add_argument('--left-sha256', required=True)
    parser.add_argument('--right', required=True)
    parser.add_argument('--right-sha256', required=True)
    parser.add_argument('--frame', type=int, required=True)
    args = parser.parse_args()
    frozen_old_sha = '23f73fa17cd7e96e3087c267617661e28d44f0c7b598d51883d0269fa8aebf35'
    assert args.frame == 9540 and args.left_sha256 == frozen_old_sha
    assert sha(args.left) == args.left_sha256 and sha(args.right) == args.right_sha256
    with Image.open(args.left) as left_file, Image.open(args.right) as right_file:
        assert left_file.format == right_file.format == 'JPEG'
        assert left_file.mode == right_file.mode == 'RGB'
        assert left_file.size == right_file.size == (1080, 1920)
        quant_equal = left_file.quantization == right_file.quantization
        left, right = left_file.copy(), right_file.copy()
    difference = ImageChops.difference(left, right)
    r, g, b = difference.split()
    maximum_per_pixel = ImageChops.lighter(ImageChops.lighter(r, g), b)
    histogram = maximum_per_pixel.histogram()
    changed_pixels = sum(histogram[1:])
    maximum = maximum_per_pixel.getextrema()[1]
    bbox_exclusive = maximum_per_pixel.getbbox()
    bbox_inclusive = None if bbox_exclusive is None else [bbox_exclusive[0], bbox_exclusive[1], bbox_exclusive[2]-1, bbox_exclusive[3]-1]
    authorized_box = (1056, 192, 1072, 208)
    outside = difference.copy()
    outside.paste((0, 0, 0), authorized_box)
    outside_extrema = outside.getextrema()
    outside_exact = all(lo == hi == 0 for lo, hi in outside_extrema)
    whole_exact = changed_pixels == 0
    within = bbox_exclusive is None or (bbox_exclusive[0] >= authorized_box[0] and bbox_exclusive[1] >= authorized_box[1] and bbox_exclusive[2] <= authorized_box[2] and bbox_exclusive[3] <= authorized_box[3])
    accepted = quant_equal and outside_exact and within and 0 < changed_pixels <= 100 and maximum <= 2
    assert sha(args.left) == args.left_sha256 and sha(args.right) == args.right_sha256
    result = {
        'kind': 'E1 frame9540 root-authorized right-edge background-heading case only',
        'frame': args.frame, 'left': str(Path(args.left)), 'right': str(Path(args.right)),
        'leftSha256': args.left_sha256, 'rightSha256': args.right_sha256,
        'rgbDimensions': [1080, 1920, 3], 'quantizationExactlyEqual': quant_equal,
        'decodedRgbExact': whole_exact, 'explicitCaseAccepted': accepted,
        'changedPixelCount': changed_pixels, 'maximumAbsoluteChannelDifference': maximum,
        'differenceBoundingBoxInclusive': bbox_inclusive,
        'authorizedBoundingBoxInclusive': [1056, 192, 1071, 207],
        'maximumAllowedChangedPixels': 100, 'maximumAllowedChannelDifferenceInsideCase': 2,
        'allOutsideAuthorizedRectangleExactlyZero': outside_exact,
        'outsideAuthorizedRectangleAllowedDifference': 0,
        'safePrincipalRegionExactlyZeroImpliedByDisjointRectangle': outside_exact,
        'wholeImageEqualityNotClaimedForCase': not whole_exact,
        'filesWritten': 0, 'renderOrEncodePerformed': False,
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))
    return 0 if accepted else 2


if __name__ == '__main__':
    raise SystemExit(main())
