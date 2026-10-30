"""Print read-only original-checker features for B-1's six camera probes.

No rendering, encoding, image edits, or report writes.  Use the original
features() implementation directly, with exactly its 270x480 area scaling.
The stored original values remain separate from fresh current/variant values.
Optional variant folders contain NNNNN.jpg named by actual output frame.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

import numpy as np

W = Path(__file__).resolve().parents[2]
C = Path("/private/tmp/ys/ys-chain-b1v1-final5-carry-20261025")
ORIGINAL = W / "scripts/umech/desk-quality-gate-frames.py"
EVIDENCE = W / "outputs/axes-20261023/b1-final5-exact714-original7b-delivered-evidence-root253-cases-20261025.json"
DEFAULT_FF = Path("/Users/ken/Library/Application Support/physics-quest-tools/pyenv/lib/python3.9/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1")
FRAMES = (2550, 2820, 4110, 4650, 6690, 9900)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load_original_features():
    spec = importlib.util.spec_from_file_location("b1_original_gate_frames_read_only", ORIGINAL)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.features, module.FEATS


def measure(path, ff, features, names):
    path = Path(path)
    assert path.is_file(), str(path)
    proc = subprocess.run([str(ff), "-v", "error", "-i", str(path),
                           "-vf", "scale=270:480:flags=area", "-frames:v", "1",
                           "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                          check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    assert len(proc.stdout) == 270 * 480 * 3
    img = np.frombuffer(proc.stdout, np.uint8).reshape(480, 270, 3)
    values = dict(zip(names, features(img)))
    return dict(path=str(path), sha256=sha(path), originalCheckerFeatures=values,
                sparseCandidate=values["wood"] > .85 and values["busy"] < .02,
                subjectBelow35=values["subject"] < .35,
                subjectAtLeast60=values["subject"] >= .60)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ff", type=Path, default=DEFAULT_FF)
    parser.add_argument("--variant-raw", type=Path)
    parser.add_argument("--variant-composite", type=Path)
    args = parser.parse_args()
    old_bytecode_setting = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        features, names = load_original_features()
    finally:
        sys.dont_write_bytecode = old_bytecode_setting
    evidence = json.loads(EVIDENCE.read_text())
    samples = {s["actualMp4Frame"]: s for s in evidence["samples"]}
    checker_before = sha(ORIGINAL)
    rows = []
    for frame in FRAMES:
        sample = samples[frame]
        row = dict(frame=frame, time=frame / 30, row=sample["row"], cue=sample["cue"],
                   storedOriginalFeatures=sample["originalFeatures"],
                   currentPhysicalWidth=sample["physical"]["widthRatio"],
                   currentFaceHint=sample["compositeFaceHint"]["kind"],
                   currentRaw=measure(C / "blender/desk" / f"{frame:05d}.jpg",
                                      args.ff, features, names),
                   currentActualComposite=measure(sample["actualJpeg"],
                                                   args.ff, features, names))
        if args.variant_raw:
            row["variantRaw"] = measure(args.variant_raw / f"{frame:05d}.jpg",
                                        args.ff, features, names)
        if args.variant_composite:
            row["variantActualComposite"] = measure(args.variant_composite / f"{frame:05d}.jpg",
                                                    args.ff, features, names)
        rows.append(row)
    assert sha(ORIGINAL) == checker_before
    print(json.dumps(dict(originalChecker=str(ORIGINAL), checkerSha256=checker_before,
                          originalThresholdsUnchanged=True, reportWrites=False,
                          renderOrEncodePerformed=False, pointSamplesAreNotAggregateGatePass=True,
                          samples=rows), ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
