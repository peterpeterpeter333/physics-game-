# 「技術の疑問の鎖」の机の動画の品質検査（desk-quality-gate.mjs）の、コマの画を数える部分。
# desk-quality-gate.mjs から呼ばれる（閾値は .mjs の冒頭の TH にまとめてあり、--th で渡される）。
# 外部のパッケージは使わない（numpy と ffmpeg だけ）。
#
# 使い方：python desk-quality-gate-frames.py --ff <ffmpeg> --th '<JSON>' [--mp4 <mp4>] [--desk <cache>/blender/desk]
#                                            [--dur <秒>] [--npz <途中の値を残す .npz>]
# 標準出力：JSON（各項目の数値）
#
# 画の出どころ
#   mp4  ：書き出した動画（2D の札・字幕・顔の全画面も入った、見る人が見る画）。0.5 秒ごと
#   desk ：キャッシュの Blender のコマ（blender/desk/NNNNN.jpg、2D の重ねが無い 3D だけの画）。0.5 秒ごと
#   3D の世界（真上の画・壁や窓・物の少なさ）は desk があれば desk で、無ければ mp4 で数える。
#   同じ構図（物が動かない）と冒頭と最後は、mp4 で数える（2D の札の動きも「動き」に入れるため）。
import argparse, json, os, subprocess, tempfile
import numpy as np

FEATS = ['wall_band', 'window', 'wood', 'wood_top', 'busy', 'subject']


def run_frames(ff, args, w, h):
    """ffmpeg の rawvideo（rgb24）を1コマずつ返す。"""
    p = subprocess.Popen([ff, '-v', 'error'] + args + ['-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                         stdout=subprocess.PIPE)
    n = w * h * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(h, w, 3)
    p.wait()


def features(img):
    """img：(480,270,3) uint8。3D の机の世界の特徴。
    wall_band：画面の上 55％ に、「行の 60％ 以上が壁の色（ぼけてなめらか）か窓の光」の行が続く高さ（画面の高さに対する割合）。
               帯は上 15％ までに始まること（壁は奥なので画面の上。机の上の紙は手前で、上の端から離れていることが多い）
    window   ：とても明るく白い画素（窓の光）の割合（上 60％）。参考
    wood     ：木目の色（橙茶、彩度が高め）の割合（全体）
    wood_top ：上 25％ の中の木目の色の割合（真上の画では、画面の上まで机）
    busy     ：細かい模様のある画素の割合（物の多さの目安。机の木目はぼけているか細かさが小さい）
    subject  ：物の大きさの目安。画面の上 8％〜80％ で、はっきりした模様（sm > 22）が縦の 4％ 以上ある列の割合（画面の横幅に対する）。
               背景は被写界深度でぼけているので、ピントの合った主役の物の横幅に近い（2026-10-23 追加）
    """
    a = img.astype(np.float32) / 255.0
    H, W = a.shape[:2]
    v = a.max(axis=2); mn = a.min(axis=2)
    s = np.where(v > 1e-3, (v - mn) / np.maximum(v, 1e-3), 0)
    g = img.astype(np.float32).mean(axis=2)
    gx = np.abs(np.diff(g, axis=1))[:-1, :]
    gy = np.abs(np.diff(g, axis=0))[:, :-1]
    grad = np.zeros_like(g); grad[:-1, :-1] = gx + gy
    k = np.pad(grad, 1, mode='edge')
    sm = sum(k[i:i + H, j:j + W] for i in range(3) for j in range(3)) / 9.0   # 3×3 の平均（なめらかさ）
    r, gg, b = a[..., 0], a[..., 1], a[..., 2]
    rr = r + 1e-3
    # 壁の色：#efe5d6 が暖かい光で (190〜250, 155〜210, 115〜170) に写る（g/r 0.80〜0.85、b/r 0.61〜0.68）。
    # 机の木目（g/r 0.6〜0.7、b/r 0.35〜0.45）や、試作の紙の札（g/r .81、b/r .56〜.59）より青が多い。壁はぼけていて、まわりの差が小さい
    wallc = (gg / rr > 0.78) & (b / rr > 0.60) & (v > 0.42) & (sm < 5)
    window = (v > 0.93) & (s < 0.22)
    woodc = (r > gg) & (gg > b) & (s > 0.33) & (v > 0.18) & (v < 0.95) & ~wallc
    cov = (wallc | window)[:int(H * .55)].mean(axis=1) > .6
    run = best = 0
    for y, c in enumerate(cov):
        run = run + 1 if (c and (run > 0 or y <= H * .15)) else 0
        best = max(best, run)
    return [float(best / H), float(window[:int(H * .6)].mean()), float(woodc.mean()),
            float(woodc[:int(H * .25)].mean()), float((sm > 14).mean()),
            float(((sm[int(H * .08):int(H * .80)] > 22).mean(axis=0) > .04).mean())]


def small(img):
    return img.reshape(96, 5, 54, 5, 3).mean(axis=(1, 3)).astype(np.uint8)        # (96,54,3)


def gray(img):
    return img.astype(np.float32).mean(axis=2).reshape(240, 2, 135, 2).mean(axis=(1, 3)).astype(np.uint8)  # (240,135)


def edge_rows(strip):
    """strip：(1920,96,3)。左 0〜47px と 右 1032〜1079px を横に並べた帯。
    端の 0〜40px（右は 1040〜1079px）で、明るい（輝度 200 以上）画素のうち、隣と 60 以上の差がある所（字の縁）の数を、16px の行ごとに。"""
    g = strip.astype(np.int16).mean(axis=2)
    out = []
    for sl in (slice(0, 40), slice(56, 96)):
        p = g[:, sl]
        bright = p > 200
        dx = np.abs(np.diff(p, axis=1)) > 60
        e = (bright[:, 1:] & dx).sum(axis=1) + (bright[:, :-1] & dx).sum(axis=1)
        out.append(e.reshape(-1, 16).sum(axis=1))
    return np.array(out, np.int32)


def runs(mask, step):
    """True が続く区間：[(始まりの秒, 長さの秒)]（長い順）"""
    out = []; s = None
    for i, m in enumerate(list(mask) + [False]):
        if m and s is None:
            s = i
        if not m and s is not None:
            out.append((round(s * step, 2), round((i - s) * step, 2))); s = None
    return sorted(out, key=lambda x: -x[1])


def blocks(g):
    """(N,240,135) → (N,30,27)：8×5 画素の塊の平均"""
    return g.astype(np.float32).reshape(len(g), 30, 8, 27, 5).mean(axis=(2, 4))


def gmap(g):
    """冒頭と最後の比較用：細かさ（隣との差）の地図を 29×16 の塊にしたもの。字幕の帯と上の題の帯は 0"""
    g = g.astype(np.float32)
    m = np.abs(np.diff(g, axis=1))[:-1] + np.abs(np.diff(g, axis=0))[:, :-1]
    m = m[:232, :128].reshape(29, 8, 16, 8).mean(axis=(1, 3))
    m[15:21] = 0; m[:3] = 0
    return m


def corr(a, b):
    a = a.ravel() - a.mean(); b = b.ravel() - b.mean()
    return float((a * b).sum() / np.sqrt((a * a).sum() * (b * b).sum() + 1e-6))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ff', required=True); ap.add_argument('--th', required=True)
    ap.add_argument('--mp4'); ap.add_argument('--desk'); ap.add_argument('--dur', type=float)
    ap.add_argument('--npz')
    o = ap.parse_args()
    TH = json.loads(o.th)
    step = float(TH['step'])
    res = {}
    if o.mp4:
        sm_, gr_, ft_ = [], [], []
        for img in run_frames(o.ff, ['-i', o.mp4, '-vf', f'fps={1 / step}:round=near,scale=270:480:flags=area', '-an'], 270, 480):
            sm_.append(small(img)); gr_.append(gray(img)); ft_.append(features(img))
        ed = []
        flt = f'fps={1 / step}:round=near,split[a][b];[a]crop=48:1920:0:0[l];[b]crop=48:1920:1032:0[r];[l][r]hstack'
        for img in run_frames(o.ff, ['-i', o.mp4, '-filter_complex', flt, '-an'], 96, 1920):
            ed.append(edge_rows(img))
        n = min(len(sm_), len(ed))
        res.update(mp4_small=np.array(sm_[:n]), mp4_gray=np.array(gr_[:n]),
                   mp4_feat=np.array(ft_[:n], np.float32), mp4_edge=np.array(ed[:n]))
    if o.desk and os.path.isdir(o.desk):
        dur = o.dur or (len(res.get('mp4_gray', [])) * step)
        files, ts = [], []
        k = 0
        while True:
            t = k * step
            if not dur or t > dur:
                break
            f = os.path.join(o.desk, '%05d.jpg' % round(t * 30))
            if os.path.exists(f):
                files.append(f); ts.append(t)
            k += 1
        if files:
            with tempfile.NamedTemporaryFile('w', suffix='.txt', delete=False) as lf:
                lf.write('ffconcat version 1.0\n')
                for f in files:
                    lf.write("file '%s'\nduration 1\n" % f.replace("'", "'\\''"))
                lst = lf.name
            gr_, ft_ = [], []
            for img in run_frames(o.ff, ['-f', 'concat', '-safe', '0', '-i', lst, '-vf', 'scale=270:480:flags=area', '-fps_mode', 'passthrough'], 270, 480):
                gr_.append(gray(img)); ft_.append(features(img))
            os.unlink(lst)
            n = min(len(gr_), len(ts))
            res.update(desk_t=np.array(ts[:n]), desk_gray=np.array(gr_[:n]), desk_feat=np.array(ft_[:n], np.float32))
    if o.npz:
        np.savez_compressed(o.npz, feat_names=np.array(FEATS), **res)

    out = {'step': step}
    # ---- 3D の世界の画（desk があれば desk、無ければ mp4）
    src = 'desk' if 'desk_feat' in res and len(res['desk_feat']) > 10 else ('mp4' if 'mp4_feat' in res else None)
    out['world_source'] = src
    if src:
        f = res[src + '_feat']
        wall = f[:, 0] >= TH['wallBand']
        over = (f[:, 3] > TH['overheadWoodTop']) & ~wall
        sparse = (f[:, 2] > TH['sparseWood']) & (f[:, 4] < TH['sparseBusy'])
        out['samples'] = int(len(f))
        out['wall_ratio'] = round(float(wall.mean()), 4)
        out['overhead_ratio'] = round(float(over.mean()), 4)
        r = runs(sparse, step)
        out['sparse_runs'] = r[:5]
        out['sparse_longest'] = r[0][1] if r else 0.0
        out['sparse_ratio'] = round(float(sparse.mean()), 4)
        if f.shape[1] > 5:
            sub = f[:, 5]
            out['subject_median'] = round(float(np.median(sub)), 4)
            out['subject_small_ratio'] = round(float((sub < TH['subjectSmall']).mean()), 4)
            out['subject_small_runs'] = runs(sub < TH['subjectSmall'], step)[:6]
        # カメラの動きの推定（camera-motion.json が無いときだけ使う）：画面の大部分（塊の TH.camMoveFrac 以上）が変わった 0.5 秒
        if src == 'desk':
            b = blocks(res['desk_gray']); df = np.abs(np.diff(b, axis=0))
            out['camera_est_ratio'] = round(float(((df > 2).mean(axis=(1, 2)) > TH['camMoveFrac']).mean()), 4)
    # ---- mp4 の画
    if 'mp4_gray' in res:
        g = res['mp4_gray']; n = len(g)
        b = blocks(g); df = np.abs(np.diff(b, axis=0))
        df[:, int(30 * TH['capBand'][0]):int(30 * TH['capBand'][1]), :] = 0     # 字幕の帯（字幕の切り替わりは「動き」に入れない）
        moving = (df > TH['staticBlockDiff']).sum(axis=(1, 2)) >= TH['staticBlocks']
        r = runs(~moving, step)
        out['static_runs'] = r[:5]
        out['static_longest'] = r[0][1] if r else 0.0
        if 'camera_est_ratio' not in out:
            out['camera_est_ratio'] = round(float(((np.abs(np.diff(b, axis=0)) > 2).mean(axis=(1, 2)) > TH['camMoveFrac']).mean()), 4)
        k = int(round(TH['endsSec'] / step))
        A = [gmap(g[i]) for i in range(0, min(n, k + 1))]
        B = [gmap(g[i]) for i in range(max(0, n - k - 1), n)]
        M = np.array([[corr(x, y) for y in B] for x in A])
        out['ends_corr'] = round(float(M.max()), 4)
        sA = res['mp4_small'][:k + 1].astype(np.float32); sB = res['mp4_small'][n - k - 1:].astype(np.float32)
        out['ends_color_corr'] = round(max(corr(x, y) for x in sA for y in sB), 4)   # 参考：色の分布
        e = res['mp4_edge'][:, :, int(110 / 16):int(1600 / 16)].sum(axis=2)          # (N,2)：y 110〜1600
        hit = e.max(axis=1) >= TH['edgeText']
        out['edge_ratio'] = round(float(hit.mean()), 4)
        out['edge_times'] = [round(i * step, 1) for i in np.where(hit)[0][:12]]
        out['mp4_samples'] = int(n)
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
