# Probe 2: fine-grained geometry + crops for OCR.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
bg = np.array([34, 23, 16])
dist = np.abs(a - bg).sum(2)

# ---- 1. fine bands with lower threshold (catch dim footer) ----
ink = dist > 35
rows = ink.sum(1)
print("row ink profile y=440..629 (dist>35), nonzero rows:")
for y in range(440, H):
    if rows[y] > 0:
        xs = np.where(ink[y])[0]
        print(f"  y={y}: count={rows[y]:4d} x={xs.min()}-{xs.max()}")

# bands over full image, gap tolerance 5
bands = []
in_b = False
gap = 0
start = 0
for y in range(H):
    if rows[y] > 2:
        if not in_b:
            in_b = True
            start = y
        gap = 0
    else:
        if in_b:
            gap += 1
            if gap > 5:
                bands.append((start, y - gap))
                in_b = False
if in_b:
    bands.append((start, H - 1))
print("\nfine bands:", [(int(y0), int(y1)) for y0, y1 in bands])

# ---- 2. band 1: flame vs eyebrow split (column clusters, gap>=20) ----
y0, y1 = bands[0]
sub = ink[y0:y1 + 1]
cols = sub.any(0)
xs = np.where(cols)[0]
clusters = []
cs, prev = xs[0], xs[0]
for x in xs[1:]:
    if x - prev > 20:
        clusters.append((cs, prev))
        cs = x
    prev = x
clusters.append((cs, prev))
print(f"\nband1 y={y0}-{y1} column clusters (gap>=20):")
cl_list = []
for (cx0, cx1) in clusters:
    s = sub[:, cx0:cx1 + 1]
    ys = np.where(s.any(1))[0]
    h = ys.max() - ys.min() + 1
    px = a[y0:y1 + 1, cx0:cx1 + 1][s]
    print(f"  x={cx0}-{cx1} w={cx1-cx0+1} h={h} inkpx={s.sum()} mean-rgb={tuple(px.mean(0).round(0))}")
    cl_list.append((cx0, cx1))

# flame = first cluster
fx0, fx1 = cl_list[0]
fsub = ink[y0:y1 + 1, fx0:fx1 + 1]
fys = np.where(fsub.any(1))[0]
fy0, fy1 = y0 + fys.min(), y0 + fys.max()
print(f"\nflame bbox: x={fx0}-{fx1} y={fy0}-{fy1} ({fx1-fx0+1}x{fy1-fy0+1})")
fmask = ink[fy0:fy1 + 1, fx0:fx1 + 1]
n = 5
for i in range(n):
    r0 = (fy1 - fy0 + 1) * i // n
    r1 = (fy1 - fy0 + 1) * (i + 1) // n
    px = a[fy0 + r0:fy0 + r1, fx0:fx1 + 1][fmask[r0:r1]]
    if len(px):
        print(f"  flame vertical slice {i}: y={fy0+r0}-{fy0+r1-1} mean-rgb={tuple(px.mean(0).round(0))} px={len(px)}")
L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])
gy, gx = np.gradient(L)
gm = np.hypot(gx, gy)
print(f"  max gradient in flame bbox: {gm[fy0:fy1+1, fx0:fx1+1].max():.1f} (sharp edge => >60)")
print(f"  flame fill ratio: {fmask.sum()/fmask.size:.2f}")

# eyebrow text = remaining clusters
tx0 = cl_list[1][0] if len(cl_list) > 1 else fx1 + 1
tx1 = cl_list[-1][1]
tsub = ink[y0:y1 + 1, tx0:tx1 + 1]
print(f"\neyebrow text bbox: x={tx0}-{tx1} y={y0}-{y1} inkpx={tsub.sum()}")
# letter clusters gap>=4
tcols = tsub.any(0)
txs = np.where(tcols)[0]
tcl = []
cs, prev = txs[0], txs[0]
for x in txs[1:]:
    if x - prev > 4:
        tcl.append((cs, prev))
        cs = x
    prev = x
tcl.append((cs, prev))
print(f"eyebrow letter clusters (gap>=4): {len(tcl)}")
fills = []
heights = []
for (c0, c1) in tcl:
    s = tsub[:, c0:c1 + 1]
    ys = np.where(s.any(1))[0]
    fills.append(s.sum() / s.size)
    heights.append(ys.max() - ys.min() + 1)
print(f"  cluster widths: {[c1-c0+1 for c0,c1 in tcl]}")
print(f"  cluster heights: {heights}")
print(f"  fill ratios: {[round(f,2) for f in fills]}")

# tofu check: pairwise bitmap similarity of letter clusters
def norm_bmp(s):
    ys, xs = np.where(s)
    if len(ys) == 0:
        return None
    return s[ys.min():ys.max() + 1, xs.min():xs.max() + 1].astype(float)

bmps = []
for (c0, c1) in tcl:
    b = norm_bmp(tsub[:, c0:c1 + 1])
    if b is not None and b.shape[0] > 5 and b.shape[1] > 3:
        bmps.append(b)
sims = []
for i in range(len(bmps)):
    for j in range(i + 1, min(i + 4, len(bmps))):
        A, B = bmps[i], bmps[j]
        if abs(A.shape[0] - B.shape[0]) <= 2 and abs(A.shape[1] - B.shape[1]) <= 2:
            h = min(A.shape[0], B.shape[0]); w = min(A.shape[1], B.shape[1])
            d = np.abs(A[:h, :w] - B[:h, :w]).mean()
            sims.append(round(float(d), 3))
print(f"  adjacent-letter bitmap mean-abs-diff (0=identical/tofu): {sims}")

# ---- 3. headline line splitting ----
y0, y1 = bands[1]
hsub = ink[y0:y1 + 1]
hrows = hsub.sum(1)
print(f"\nheadline band y={y0}-{y1}, row ink profile valleys (count<15):")
lines = []
cur = None
for i in range(len(hrows)):
    if hrows[i] >= 15:
        if cur is None:
            cur = i
    else:
        if cur is not None and i - cur > 3:
            lines.append((cur, i - 1))
            cur = None
if cur is not None:
    lines.append((cur, len(hrows) - 1))
print(f"headline lines: {len(lines)}")
for (l0, l1) in lines:
    s = hsub[l0:l1 + 1]
    xs = np.where(s.any(0))[0]
    ys = np.where(s.any(1))[0]
    print(f"  line y={y0+l0}-{y0+l1} h={l1-l0+1} x={xs.min()}-{xs.max()} inkpx={s.sum()}")
# check inter-line gap sizes
gapsl = [(lines[i+1][0] - lines[i][1] - 1) for i in range(len(lines)-1)]
print(f"inter-line gaps: {gapsl}")

# ---- 4. ember bar ----
for (by0, by1) in bands:
    bsub = ink[by0:by1 + 1]
    if by1 - by0 < 12 and bsub.sum() > 100 and bsub.sum() < 3000:
        xs = np.where(bsub.any(0))[0]
        if xs.max() - xs.min() < 200:
            print(f"\nember-bar band y={by0}-{by1} x={xs.min()}-{xs.max()}")
            px = a[by0:by1 + 1, xs.min():xs.max() + 1][bsub]
            print(f"  size: {xs.max()-xs.min()+1}x{by1-by0+1}px mean-rgb={tuple(px.mean(0).round(0))}")
            n = 4
            for i in range(n):
                c0 = (xs.max() - xs.min() + 1) * i // n
                c1 = (xs.max() - xs.min() + 1) * (i + 1) // n
                sp = bsub[:, c0:c1]
                spx = a[by0:by1 + 1, xs.min() + c0:xs.min() + c1][sp]
                if len(spx):
                    print(f"  horiz slice {i}: mean-rgb={tuple(spx.mean(0).round(0))}")

# ---- 5. subline & footer bands ----
for (by0, by1) in bands[2:]:
    if by1 - by0 < 8 and by0 > 440 and by0 < 480:
        continue  # bar handled above
    s = ink[by0:by1 + 1]
    xs = np.where(s.any(0))[0]
    print(f"\nband y={by0}-{by1} h={by1-by0+1} x={xs.min()}-{xs.max()} inkpx={s.sum()}")
    # column clusters gap>=60 (left/right footer split)
    cols_ = s.any(0)
    xs_ = np.where(cols_)[0]
    cl2 = []
    cs, prev = xs_[0], xs_[0]
    for x in xs_[1:]:
        if x - prev > 60:
            cl2.append((cs, prev))
            cs = x
        prev = x
    cl2.append((cs, prev))
    for (c0, c1) in cl2:
        ss = s[:, c0:c1 + 1]
        ys = np.where(ss.any(1))[0]
        px = a[by0:by1 + 1, c0:c1 + 1][ss]
        print(f"   cluster x={c0}-{c1} w={c1-c0+1} rows={ys.min()}-{ys.max()} mean-rgb={tuple(px.mean(0).round(0))} inkpx={ss.sum()}")

# ---- 6. italic shear measurement (subline band vs headline control) ----
def shear(bx0, bx1, by0, by1):
    s = ink[by0:by1 + 1, bx0:bx1 + 1]
    colsb = s.any(0).astype(int)
    letters = []
    cs, prev, cnt = None, None, 0
    for i, v in enumerate(colsb):
        if v:
            if cs is None:
                cs = i
            prev = i
        else:
            if cs is not None and i - prev > 3:
                letters.append((cs, prev))
                cs = None
    if cs is not None:
        letters.append((cs, prev))
    shifts = []
    for (c0, c1) in letters:
        sl = s[:, c0:c1 + 1]
        ys = np.where(sl.any(1))[0]
        if len(ys) < 14:
            continue
        mid = (ys.min() + ys.max()) // 2
        top = sl[:mid - ys.min()]
        bot = sl[mid - ys.min():]
        tx_ = np.where(top.any(0))[0]
        bx_ = np.where(bot.any(0))[0]
        if len(tx_) and len(bx_):
            shifts.append(float(tx_.mean() - bx_.mean()))
    return letters, shifts

for name, (bx0, bx1, by0, by1) in {
    "headline-line1": (60, 930, bands[1][0], bands[1][1]),
}.items():
    letters, shifts = shear(bx0, bx1, by0, by1)
    if shifts:
        print(f"\n{name}: {len(letters)} letter-clusters, top-vs-bottom x-shift mean={np.mean(shifts):.2f} median={np.median(shifts):.2f} n={len(shifts)}")

for (by0, by1) in bands[2:]:
    if by1 - by0 > 20:
        letters, shifts = shear(60, 900, by0, by1)
        if shifts:
            print(f"subline band y={by0}-{by1}: {len(letters)} letter-clusters, shear mean={np.mean(shifts):.2f} median={np.median(shifts):.2f} n={len(shifts)}")
            print(f"  individual shifts: {[round(s,1) for s in shifts]}")

# ---- 7. glow mapping ----
print("\nglow: luminance along bottom row y=628 every 60px:")
for x in range(0, W, 60):
    print(f"  x={x}: L={L[628, x]:.1f} rgb={tuple(a[628, x])}")
print("glow: luminance along left col x=2, y=440..628 every 20px:")
for y in range(440, H, 20):
    print(f"  y={y}: L={L[y, 2]:.1f} rgb={tuple(a[y, 2])}")
# glow peak (excluding strong text: use luminance in y>470 with dist<200 to avoid text? just report argmax)
reg = L[470:H, 0:600]
iy, ix = np.unravel_index(reg.argmax(), reg.shape)
print(f"glow max luminance in y=470-629,x=0-599: {reg.max():.1f} at x={ix} y={470+iy}")
# smoothness along ray from bottom-left
ray = [L[628 - k, k] for k in range(0, 300, 10)]
print("glow ray from (0,628) up-right: " + ", ".join(f"{v:.0f}" for v in ray))

# ---- 8. crops for OCR ----
def save_crop(name, cx0, cy0, cx1, cy1, scale, stretch=True):
    crop = a[cy0:cy1, cx0:cx1]
    g = (0.2126 * crop[..., 0] + 0.7152 * crop[..., 1] + 0.0722 * crop[..., 2])
    o = 255.0 - g
    if stretch:
        lo, hi = np.percentile(o, 5), np.percentile(o, 99.5)
        o = np.clip((o - lo) / max(hi - lo, 1) * 255, 0, 255)
    img = Image.fromarray(o.astype(np.uint8)).resize(
        ((cx1 - cx0) * scale, (cy1 - cy0) * scale), Image.LANCZOS)
    p = rf"E:\source\source\repos\oss\brasa\tmp\crops\{name}.png"
    img.save(p)
    print("saved", p)

import os
os.makedirs(r"E:\source\source\repos\oss\brasa\tmp\crops", exist_ok=True)
save_crop("eyebrow", 80, 70, 680, 122, 4)
save_crop("headline", 60, 230, 930, 445, 3)
save_crop("bar", 70, 455, 205, 472, 6)
save_crop("subline", 60, 495, 850, 562, 4)
save_crop("footer", 60, 560, 1150, 618, 4)
save_crop("full", 0, 0, W, H, 2)
