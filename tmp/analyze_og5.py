# Probe 5: ultra-sensitive dim scans for missing footer + last-word verification + subline space widths.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
bg = np.array([34, 23, 16])
dist = np.abs(a - bg).sum(2)
L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])

# 1. ultra-dim scan of bottom strip, right of the glow wedge (x>520 covers beyond glow tail)
print("=== ultra-dim scan (dist>8) y=557..629 ===")
for x0, x1 in [(520, 1200), (400, 520)]:
    m = dist[557:H, x0:x1] > 8
    ys, xs = np.where(m)
    print(f"  x={x0}-{x1}: {len(ys)} px", f"bbox x={x0+xs.min()}-{x0+xs.max()} y={557+ys.min()}-{557+ys.max()}" if len(ys) else "")
# row max dist in bottom strip
for y in range(557, H, 6):
    row = dist[y, 520:]
    print(f"  y={y}: max-dist right-of-520 = {row.max()}", end="; ")
print()

# 2. global scan for ANY other content (dist>12) outside known bands
known = [(79, 112), (241, 434), (461, 465), (500, 556)]
mask = np.zeros((H,), bool)
for (y0, y1) in known:
    mask[y0 - 3:y1 + 4] = True
free_rows = np.where(~mask)[0]
m = dist[free_rows, :] > 12
ys, xs = np.where(m)
print(f"\n=== scan outside known bands (dist>12): {len(ys)} px ===")
if len(ys):
    # group by row to identify regions
    rr = np.unique(free_rows[ys])
    print(f"  rows with dim content: y={rr.min()}..{rr.max()}")
    # bounding boxes by contiguous row groups
    groups = []
    s = rr[0]; p = rr[0]
    for y in rr[1:]:
        if y - p > 4:
            groups.append((s, p)); s = y
        p = y
    groups.append((s, p))
    for (g0, g1) in groups:
        sel = np.isin(free_rows, range(g0, g1 + 1))
        sub = m & sel[:, None]
        ys2, xs2 = np.where(sub)
        if len(xs2):
            print(f"  group y={g0}-{g1}: x={xs2.min()}-{xs2.max()} px={len(xs2)}")
            # sample color at densest point
            cx = int(np.median(xs2)); cy = int(np.median(free_rows[ys2]))
            print(f"    median-loc ({cx},{cy}) rgb={tuple(a[free_rows[ys2][0], cx])}")

# 3. last word of headline line3: render at 2px/char
CH = " .:-=+*#%@"
def ascii_render(x0, y0, x1, y1, sx, sy, label):
    reg = L[y0:y1, x0:x1]
    print(f"\n--- {label} x={x0}-{x1} y={y0}-{y1} ({sx}x{sy}px/char) ---")
    for yy in range(0, reg.shape[0], sy):
        line = []
        for xx in range(0, reg.shape[1], sx):
            v = reg[yy:yy+sy, xx:xx+sx].mean()
            t = (v - 17) / (236 - 17)
            line.append(CH[min(int(t * len(CH)), len(CH) - 1)])
        print("".join(line))

ascii_render(715, 373, 900, 437, 2, 2, "headline3 last word")

# 4. subline inter-word spaces: column gap profile region A
def gaps(y0, y1, x0, x1, thr=35):
    s = dist[y0:y1 + 1, x0:x1] > thr
    colink = s.any(0)
    out = []
    run_start = None
    for i, v in enumerate(colink):
        if not v:
            if run_start is None:
                run_start = i
        else:
            if run_start is not None:
                out.append((x0 + run_start, x0 + i - 1, i - run_start))
                run_start = None
    if run_start is not None:
        out.append((x0 + run_start, x0 + len(colink) - 1, len(colink) - run_start))
    return out

print("\n=== region A empty-column gaps >=6px (word spaces) ===")
for (g0, g1, w) in gaps(500, 527, 74, 840):
    if w >= 6:
        print(f"  gap x={g0}-{g1} width={w}")
print("=== eyebrow empty-column gaps >=6px ===")
for (g0, g1, w) in gaps(79, 112, 132, 666):
    if w >= 6:
        print(f"  gap x={g0}-{g1} width={w}")
print("=== region B empty-column gaps >=6px ===")
for (g0, g1, w) in gaps(535, 556, 74, 400):
    if w >= 6:
        print(f"  gap x={g0}-{g1} width={w}")
print("=== headline l3 gaps >=8px ===")
for (g0, g1, w) in gaps(375, 434, 74, 895):
    if w >= 8:
        print(f"  gap x={g0}-{g1} width={w}")

# 5. glow smoothness / banding check along bottom-left ray
print("\n=== glow luminance steps along x at y=600 (x=0..380) ===")
vals = [float(L[600, x]) for x in range(0, 380, 6)]
print(" ".join(f"{v:.0f}" for v in vals))
diffs = np.diff(vals)
print(f"max step between samples: {np.abs(diffs).max():.1f} (smooth gradient => <3)")

# 6. exact extents re-check: rightmost text pixel overall
for (y0, y1, nm) in [(241, 300, "h-l1"), (307, 368, "h-l2"), (375, 434, "h-l3"), (500, 527, "sub-l1"), (535, 556, "sub-l2")]:
    s = dist[y0:y1 + 1] > 35
    xs = np.where(s.any(0))[0]
    print(f"{nm}: x={xs.min()}-{xs.max()}")
