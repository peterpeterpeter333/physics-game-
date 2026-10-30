"""Claude 2026-10-25: B-1 local scene fixes (new file; nothing existing is edited).

Run (background, one Blender at a time, under /private/tmp/ys/blender-lock):
  B1_CLAUDE_JOB=job.json PYTHONPATH=<W>/scripts/blender Blender -b --python-use-system-env \
     --python desk_b1v1_fix_claude_20261025.py
The job file: {"cache": dir-with-blender/data.json+tex, "frames":[{"frame":j,"scene":name,"pose":[...7],"out":"x.jpg"}],
               "projections": "anchors-out.json"}
Scenes:
  replay   : delivered object state (B6/B5 replay for rows 9-13) at the delivered pose given in the job
  garlic   : rows 9-13 object state (same as replay) with the job's new close camera
  powder   : rows 22-23 object state with the job's new close camera
  section  : rows 26/28/36/37 -- new earth cross-section (shell, crust, pin, horizon, three prediction lines)
  book     : row 35 object state with the job's new camera
The object state always comes from the unchanged desk_b1v1.py apply(); only the
camera and (for 'section') the added cross-section parts differ.
"""
import ast, json, math, os, runpy, sys, time
from pathlib import Path

W = Path('/Users/ken/Documents/Codex/2026-09-15/github-plugin-github-openai-curated-remote/work/physics-game-yt-series')
JOB = json.load(open(os.environ['B1_CLAUDE_JOB']))
sys.argv = [sys.argv[0], '--', '--cache', JOB['cache'], '--samples', str(JOB.get('samples', 16))]
G0 = runpy.run_path(str(W/'scripts/blender/desk_b1v1.py'), run_name='b1v1_claude')
g = G0['apply'].__globals__
d = g['d']; bpy = g['bpy']; Vector = g['Vector']
PARTS, GROUPS, CUES = g['PARTS'], g['GROUPS'], g['CUES']
cues = {c['key']: c for c in CUES}
original_apply = g['apply']

# ---------- rows 9-13: the delivered B6v6 / B5v4 object actions (read from their pinned sources) ----------
B5SOURCE = W/'scripts/blender/desk_axes_b1_repel_b5_v4_20261024.py'
GARLIC = {'garlic:side', 'garlic:rub', 'garlic:nail', 'garlic:mio'}
PAIR = {'rule:first', 'rule:bar', 'rule:pull'}


def tree(o):
    return [o] + [v for c in g['CHILDREN'].get(o, ()) for v in tree(c)]


def world_points(obs):
    import numpy as np
    deps = bpy.context.evaluated_depsgraph_get(); pts = []
    for ob in dict.fromkeys(obs):
        if ob.hide_render or ob.type not in ('MESH', 'FONT', 'CURVE'):
            continue
        ev = ob.evaluated_get(deps); me = ev.to_mesh()
        if me is None:
            continue
        try:
            v = np.empty(len(me.vertices)*3); me.vertices.foreach_get('co', v)
            vv = np.column_stack((v.reshape(-1, 3), np.ones(len(me.vertices))))
        finally:
            ev.to_mesh_clear()
        if len(vv):
            pts.append(vv @ np.asarray(ob.matrix_world).T)
    return np.concatenate(pts)


v5 = runpy.run_path(str(B5SOURCE))
tr = ast.parse(B5SOURCE.read_text())
outer = next(n for n in tr.body if isinstance(n, ast.FunctionDef) and n.name == 'run')
tb = next(n for n in outer.body if isinstance(n, ast.Try))
defs = [n for n in tb.body if isinstance(n, ast.FunctionDef) and n.name in {'stages', 'place'}]
assert len(defs) == 2
phase = {**v5, 'g': g, 'd': d, 'bpy': bpy, 'original_apply': original_apply, 'world_points': world_points, 'tree': tree}
exec(compile(ast.Module(body=defs, type_ignores=[]), str(B5SOURCE), 'exec'), phase)
b5place = phase['place']
garlic = PARTS['garlic']
wait = g['BASE'][garlic['root']][0].copy()
retire_start = cues['rule:first']['start']


def show(obs):
    for ob in obs:
        ob.hide_render = False; ob.hide_viewport = False


def place(ref, t):
    """Same object actions as the delivered B6v6 place() for the rows this job touches."""
    key = g['cue_at'](t)['key']
    points = b5place(ref, t) if key == 'rule:pull' else original_apply(ref/30)
    if key == 'doubt:gilbert' or key in GARLIC:
        show(GROUPS['gilbert'])
    if key in GARLIC:
        if t < 68.09:
            garlic['root'].location = wait.copy()
        elif t < 68.49:
            garlic['root'].location = wait.lerp(Vector((-.035, -.02, .036)), g['u'](t, 68.09, .4))
        elif 70.35 <= t < 71.15:
            end = Vector((-.035+.025*math.sin(g['u'](70.35, 68.49, 1.8)*math.pi*6), -.02, .036))
            garlic['root'].location = end.lerp(wait, g['u'](t, 70.35, .8))
        elif t >= 71.15:
            garlic['root'].location = wait.copy()
    if key in PAIR:
        u = g['u'](t, retire_start, .8)
        delta = Vector((.10*min(1, u/.35), .30*max(0, (u-.35)/.65), 0))
        show(tree(garlic['root'])); garlic['root'].location = wait+delta
        for nail in garlic['nails']:
            show(tree(nail)); nail.location = g['BASE'][nail][0]+Vector((0, -.04, 0))+delta
    bpy.context.view_layer.update()
    return points


# ---------- the new earth cross-section (rows 26/28/36/37) ----------
GP = PARTS['globe']
C = GP['center']; R = .12
LAT = math.radians(51.5)
YF = C.y-.0075            # front face of the section, just in front of the old cutaway disc
DATA = g['DATA']
STAR, ISLAND, DIP = DATA['star'], DATA['island'], DATA['dipLondon']
SECTION = []


def mat(name, color, rough=.6, emit=None, strength=0.):
    return d.mat('b1claude_'+name, color, rough, emit=emit, strength=strength)


def disc(name, r, y, m, depth=.002, verts=128):
    o = d.cyl(name, r, depth, (C.x, y, C.z), m, rot=(math.pi/2, 0, 0), verts=verts)
    SECTION.append(o); return o


def build_section():
    import random
    rnd = random.Random(7)
    # Outer surface: sea blue-green ring with green / ochre land bands (thickness .012), like the globe.
    sea = mat('sea', '#4f8fa8', .5); green = mat('land', '#7fa65a', .6); ochre = mat('ochre', '#c9a35c', .6)
    disc('b1c_sec_sea', R, YF+.0010, sea, .003)
    # land arcs (polar angle ranges on the meridian plane; 0 = north pole, measured toward the right/east side)
    for a0, a1, m in [(-1.25, -.55, green), (-.42, -.08, ochre), (.12, .52, green), (.70, 1.05, ochre), (1.35, 1.95, green),
                      (2.25, 2.62, ochre), (2.95, 3.35, green), (-2.6, -2.0, green), (-1.85, -1.5, ochre), (3.6, 4.0, ochre)]:
        n = 24; vs = []; fs = []
        for i in range(n+1):
            a = a0+(a1-a0)*i/n
            for rr in (R+.0004, R-.0124):
                vs.append((C.x+rr*math.sin(a), YF-.0012, C.z+rr*math.cos(a)))
        for i in range(n):
            fs.append((2*i, 2*i+2, 2*i+3, 2*i+1))
        me = bpy.data.meshes.new('b1c_land'); me.from_pydata(vs, [], fs); o = bpy.data.objects.new('b1c_land', me); d.link(o); d.put(o, m)
        SECTION.append(o)
    # crust (warm, light) then mantle/core gradient (soft warm rings)
    disc('b1c_sec_crust', R-.012, YF-.0010, mat('crust', '#f2dcb4', .7), .003)
    for k, (rr, col) in enumerate([(R-.022, '#f0cfa0'), (R-.045, '#efc390'), (R-.068, '#f0b884'), (.032, '#f3ad78')]):
        disc('b1c_sec_layer%d' % k, rr, YF-.0016-.0004*k, mat('layer%d' % k, col, .75), .003)
    # North pole: little black rocky island mark on the surface
    pole = Vector((C.x, YF-.004, C.z+R))
    for i in range(6):
        o = d.sphere('b1c_island', .0045+.002*rnd.random(), pole+Vector((-.004+.0035*i*rnd.random(), 0, .001*rnd.random()-.001)), mat('rock', '#222222', .35), seg_=12, ring=8)
        o.scale = (1, .6, .65); SECTION.append(o)
    # London: red pin
    london = Vector((C.x+R*math.cos(LAT), YF-.006, C.z+R*math.sin(LAT)))
    pin = d.sphere('b1c_pin', .0055, london+Vector((math.cos(LAT), 0, math.sin(LAT)))*.004, mat('pin', '#d6453d', .35, emit='#d6453d', strength=.3), seg_=16, ring=10)
    stem = g['ext'].curve('b1c_pinstem', [london, london+Vector((math.cos(LAT), 0, math.sin(LAT)))*.004], mat('pinstem', '#c9c2b4', .4), .0010)
    SECTION.extend([pin, stem])
    return london


LONDON = build_section()
TAN = Vector((-math.sin(LAT), 0, math.cos(LAT)))      # local horizontal toward north
NOR = Vector((math.cos(LAT), 0, math.sin(LAT)))       # local up


def dotted(name, pts, m, radius=.002, dash=.010, gap=.006):
    """Dotted (dashed) tube along a polyline; returns list of dash objects in order."""
    # resample by arc length
    seglen = [(pts[i+1]-pts[i]).length for i in range(len(pts)-1)]
    total = sum(seglen)
    def at(s):
        for i, L in enumerate(seglen):
            if s <= L or i == len(seglen)-1:
                return pts[i].lerp(pts[i+1], min(1, s/max(L, 1e-9)))
            s -= L
    out = []; s = 0.
    while s < total-1e-6:
        e = min(total, s+dash)
        k = max(2, int((e-s)/.002)+1)
        out.append(g['ext'].curve(name, [at(s+(e-s)*i/(k-1)) for i in range(k)], m, radius))
        s = e+gap
    return out


def ang_dir(a):
    return (TAN*math.cos(math.radians(a))+NOR*math.sin(math.radians(a))).normalized()


L0 = LONDON+Vector((0, -.0015, 0))
horizon = dotted('b1c_horizon', [L0-TAN*.05, L0+TAN*.05], mat('horizon', '#ffffff', .4, emit='#ffffff', strength=.6), .0012, .007, .005)
star_pts = [L0, L0+ang_dir(STAR)*.05]
pole_pt = Vector((C.x, L0.y, C.z+R-.006))
island_pts = [L0, pole_pt]
theta0 = math.pi/2-LAT; Lsh = R/math.sin(theta0)**2
mag_pts = []
for j in range(61):
    th = theta0*(1-.62*j/60)      # dipole field line r = L sin^2(theta), from London downward into the earth
    r = Lsh*math.sin(th)**2
    mag_pts.append(Vector((C.x+r*math.sin(th), L0.y, C.z+r*math.cos(th))))
LINES = [dotted('b1c_star', star_pts, mat('star', '#ffd23f', .4, emit='#ffd23f', strength=.8), .002, .012, .007),
         dotted('b1c_island', island_pts, mat('islandline', '#8e5a2e', .5, emit='#8e5a2e', strength=.15), .002, .012, .007),
         dotted('b1c_magnet', mag_pts, mat('magline', '#3b3b3b', .5), .002, .012, .007)]
LINE_AT = [222.13, 229.27, 234.40]       # 空の上を向く / 地面の下を浅く / the pause after the test:island voice
# a small star at the end of the star line
star_tip = d.sphere('b1c_startip', .006, star_pts[-1], mat('startip', '#ffd23f', .3, emit='#ffd23f', strength=1.5), seg_=12, ring=8)
SECTION_LINES = [o for L in LINES for o in L] + horizon + [star_tip]
for o in SECTION+SECTION_LINES:
    d.show(o, False)
# the custom 3D points the 2D overlay anchors to (projected per frame)
CUSTOM = {'london': LONDON, 'horizonA': L0-TAN*.05, 'horizonB': L0+TAN*.05, 'starEnd': star_pts[-1], 'islandEnd': pole_pt,
          'magEnd': mag_pts[-1], 'secNorth': Vector((C.x, L0.y, C.z+R)), 'secSouth': Vector((C.x, L0.y, C.z-R)),
          'secCenter': Vector((C.x, L0.y, C.z)), 'secEast': Vector((C.x+R, L0.y, C.z)), 'secWest': Vector((C.x-R, L0.y, C.z))}
for i, a in enumerate([STAR, -ISLAND, -DIP]):
    CUSTOM['dir%d' % i] = L0+ang_dir(a)*.03
CUSTOM['magMid'] = mag_pts[12]
CUSTOM['tan'] = L0+TAN*.03
CUSTOM['islandMid'] = L0.lerp(pole_pt, .45)


def grow(objs, t, at, dur=.6):
    n = len(objs)
    for k, o in enumerate(objs):
        d.show(o, t >= at+dur*k/max(1, n))


def section_state(t):
    """Show the new section instead of the old plain cutaway (the old globe/needle/lines are hidden)."""
    c = g['cue_at'](t)
    # The pointing hand would cover London / the lines in this frontal close view.
    for who in ['kai', 'mio', 'wal', 'cour', 'phel']:
        d.set_hand(who, (0, 0, 0), vis=False)
    for ob in d.SC.objects:
        if ob.name.startswith('b1_londonpin'):
            d.show(ob, False)
    d.show(GP['disc'], False); d.show(GP['globe'], False); d.show_tree(GP['needle'], False); d.show(GP['horizon'], False)
    for line in GP['lines']:
        for o in line:
            d.show(o, False)
    for o in SECTION:
        d.show(o, True)
    predict = c['group'] == 'predict'
    for o in horizon:
        d.show(o, predict)
    if predict:
        for L, at in zip(LINES, LINE_AT):
            grow(L, t, at, .6 if L is not LINES[2] else .9)
        d.show(star_tip, t >= LINE_AT[0]+.6)
    else:
        for o in SECTION_LINES:
            d.show(o, False)
        # mystery rows: the London pin is not part of this question
        for o in SECTION:
            if o.name.startswith('b1c_pin'):
                d.show(o, False)


def render(path):
    sc = d.SC
    sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
    sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 95
    sc.eevee.taa_render_samples = JOB.get('samples', 16)
    sc.render.filepath = str(path)
    assert bpy.ops.render.render(write_still=True) == {'FINISHED'} and Path(path).is_file()


proj = {}
started = time.time()
bpy.context.window.scene = d.SC
for k, job in enumerate(JOB['frames']):
    j = job['frame']; t = j/30; ref = job.get('ref', j)
    scene = job['scene']
    for o in SECTION+SECTION_LINES:
        d.show(o, False)
    if scene in ('replay', 'garlic'):
        aa = place(ref, t)
    else:
        aa = original_apply(ref/30)
        if scene == 'section':
            section_state(t)
    g['pose_b1'](job['pose'])
    bpy.context.view_layer.update()
    row = {n: d.project(v) for n, v in aa.items()}
    row.update({'c_'+n: d.project(v) for n, v in CUSTOM.items()})
    proj[str(j)] = row
    if job.get('out'):
        Path(job['out']).parent.mkdir(parents=True, exist_ok=True)
        render(job['out'])
    if k % 20 == 0:
        print('B1 claude', k, '/', len(JOB['frames']), round(time.time()-started, 1), 's', flush=True)
if JOB.get('projections'):
    with open(JOB['projections'], 'w') as f:
        json.dump(proj, f)
print('B1 claude done', len(JOB['frames']), round(time.time()-started, 1), flush=True)
print('B1 claude info board', tuple(d.board_h.location), 'book', [tuple(o.matrix_world.translation) for o in GROUPS['book'] if o.parent is None][:3], flush=True)
