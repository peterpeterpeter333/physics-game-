"""Read-only zero-render final903 geometry replay, exact original546 preserved."""
import hashlib,runpy
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
F=Path('/private/tmp/ys/ys-chain-d1v1-final-camera-pier-layout-20261025')
P=Path('/private/tmp/ys/ys-chain-d1v1-pier-contact-images-v5-20261025')
C=Path('/private/tmp/ys/ys-chain-d1v1-four-cue-camera-v9-verified-20261025')
h=W/'scripts/blender/desk_axes_d1_final_camera_pier_physical_v5_20261025.py'
assert hashlib.sha256(h.read_bytes()).hexdigest()=='1fa4235a08590e737f06c2940d0b4dc4f5c127d35de19199e6ec7a2f5421804c'
runpy.run_path(str(h))['run'](nsD1,authorized=True,
 prepared_sha256='0db5e85811d3e9f1902721d09443bbb845359796aa97f42ab31273975cedc5a9',
 export_sha256='03730141bed9aa97688064044b772a16f67d16fa233b082edb980f7d4cb71cd6',
 request=F/'d1-supplement-requests.json',request_sha256='34e87b9b95dd1acf081776cfcd563d4d419771ac1554f3703e2bc81cffc89f34',
 mp4=F/'out/ys-chain-d1v1.mp4',mp4_sha256='a75bb51396f4e90ab88a477e628aa4e42f8a5d1c7440f23f90b67c6e288f218f',
 pier_render_report=P/'render/report.json',pier_render_report_sha256='c593cfd18032e5c7f1a88dc473a73ce8e422750f47955e1dec05203c06ef1c87',
 pier_completion_sha256='66f2d9287cedc93f6e607e18901efb78fdd1be07139db30303166523baa80197',
 pier_probe_report_sha256='4b58375cfd358900c30b68d1230255b9587185bff2f056c7f5e2b6fdb0653bde',
 camera_render_report=C/'render/report.json',camera_render_report_sha256='9cc0b1490cd1f8323b95515dabdfa18de19207f61db52f214954c8604d7cfa2e',
 camera_audit_report_sha256='d45aa03fad6f31b1c808ec274da40d3674711a8bb1bb39d8b28c743ce43b1f10',
 recovery_diagnostic_sha256='5502cee07b7b6107dd94f2783e0807a8f202334b9e016c5b366b59ed28c3cc5d',
 review_coverage=F/'actual-final-review/required-coverage-and-reuse.json',review_coverage_sha256='b6a045848e89110b62aad5d86b9837fc45e4e80b497984bf70fbb30e967ccc33',
 out=F/'final-composite-physical-v5-20261025.json',
 additional_actual_manifests=[(str(F/'actual-original546-additional-20261025/d1v1-additional-original546-manifest.json'),'9f7727956e667837b4f4b07a562807b4528c23d3ab56e054f25b6ee389edc523')])
