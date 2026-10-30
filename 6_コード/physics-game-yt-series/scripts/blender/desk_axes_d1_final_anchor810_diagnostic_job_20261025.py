"""Root-queue only: exact146 job inputs, one-frame diagnostic, no renders."""
import hashlib
from pathlib import Path
W=Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
original=W/'scripts/blender/desk_axes_d1_final_actual903_physical_job_20261025.py'
assert hashlib.sha256(original.read_bytes()).hexdigest()=='b6e5dd1c914dd8fccb21d6fe43ac16aab082ff4e5737178d7815448cfb66a32f'
source=original.read_text();text=source;pairs=[
 ('desk_axes_d1_final_camera_pier_physical_v5_20261025.py','desk_axes_d1_final_anchor810_diagnostic_20261025.py'),
 ('1fa4235a08590e737f06c2940d0b4dc4f5c127d35de19199e6ec7a2f5421804c','1613691c2eb276992a4216b4c38ef62c8c7057eaee8fd994af300fdb854fbb64'),
 ("out=F/'final-composite-physical-v5-20261025.json'","out=F/'final-anchor810-diagnostic-20261025.json'"),
]
for a,b in pairs:assert text.count(a)==1;text=text.replace(a,b,1)
inverse=text
for a,b in reversed(pairs):assert inverse.count(b)==1;inverse=inverse.replace(b,a,1)
assert inverse==source
exec(compile(text,str(original)+' [three inverse-exact private diagnostic changes]','exec'),globals())
