# Probe 4: connected-component analysis of anomalies + exact colors + italic stem-angle test.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
bg = np.array([34, 23, 16])
dist = np.abs(a - bg).sum(2)
L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])

def components(y0, y1, x0, x1, thr=35, minpx=6):
    m = dist[y0:y1, x0:x1] > thr
    lab = np.zeros(m.shape, int)
    cur = 0
    import collections
    comps = []
    for yy in range(m.shape[0]):
        for xx in range(m.shape[1]):
            if m[yy, xx] and lab[yy, xx] == 0:
                cur += 1
                q = collections.deque([(yy, xx)])
                lab[yy, xx] = cur
                px = []
                while q:
                    cy, cx = q.popleft()
                    px.append((cy, cx))
                    for dy in (-1, 0, 1):
                        for dx in (-1, 0, 1):
                            ny, nx = cy + dy, cx + dx
                            if 0 <= ny < m.shape[0] and 0 <= nx < m.shape[1] and m[ny, nx] and lab[ny, nx] == 0:
                                lab[ny, nx] = cur
                                q.append((ny, nx))
                if len(px) >= minpx:
                    ys = [p[0] for p in px]; xsp = [p[1] for p in px]
                    comp = {
                        "y0": y0 + min(ys), "y1": y0 + max(ys),
                        "x0": x0 + min(xsp), "x1": x0 + max(xsp),
                        "px": len(px),
                    }
                    comp["rgb"] = tuple(a[comp["y0"]:comp["y1"] + 1, comp["x0"]:comp["x1"] + 1].reshape(-1, 3).mean(0).round(0))
                    comps.append(comp)
    return comps

print("=== components in gap band1->line2 (y=283-306, x=540-640) ===")
for c in components(283, 306, 540, 640, thr=30, minpx=4):
    sub = dist[c["y0"]:c["y1"] + 1, c["x0"]:c["x1"] + 1] > 30
    px = a[c["y0"]:c["y1"] + 1, c["x0"]:c["x1"] + 1][sub]
    fill = sub.sum() / sub.size
    print(f"  comp x={c['x0']}-{c['x1']} y={c['y0']}-{c['y1']} ({c['x1']-c['x0']+1}x{c['y1']-c['y0']+1}) px={c['px']} fill={fill:.2f} mean-rgb={tuple(px.mean(0).round(0))}")
    # row ink counts of this comp
    for yy in range(c["y0"], c["y1"] + 1):
        rc = (dist[yy, c["x0"]:c["x1"] + 1] > 30).sum()
        if rc:
            print(f"    y={yy}: {rc}px")

print("\n=== components in region B strip (y=533-560, x=70-410) ===")
for c in components(533, 560, 70, 410, thr=35, minpx=5):
    print(f"  comp x={c['x0']}-{c['x1']} y={c['y0']}-{c['y1']} ({c['x1']-c['x0']+1}x{c['y1']-c['y0']+1}) px={c['px']} mean-rgb={c['rgb']}")

print("\n=== region B detailed: all comps sorted by size ===")
compsB = components(533, 560, 70, 410, thr=35, minpx=4)
compsB.sort(key=lambda c: -c["px"])
for c in compsB:
    print(f"  x={c['x0']}-{c['x1']} y={c['y0']}-{c['y1']} px={c['px']}")

print("\n=== region A comps (y=498-530, x=70-850) top 40 by size ===")
compsA = components(498, 530, 70, 850, thr=35, minpx=4)
compsA.sort(key=lambda c: -c["px"])
print(f"  total comps: {len(compsA)}")
for c in compsA[:40]:
    print(f"  x={c['x0']}-{c['x1']} y={c['y0']}-{c['y1']} ({c['x1']-c['x0']+1}x{c['y1']-c['y0']+1}) px={c['px']}")

# italic stem angle: region A vs eyebrow vs region B via second-moment shear on single-letter comps
def shear_angle(comps, min_h=14, max_h=40):
    angs = []
    for c in comps:
        h = c["y1"] - c["y0"] + 1
        w = c["x1"] - c["x0"] + 1
        if not (min_h <= h <= max_h) or w > h * 1.5:
            continue
        sub = dist[c["y0"]:c["y1"] + 1, c["x0"]:c["x1"] + 1] > 35
        ys, xs = np.where(sub)
        yy = ys - ys.mean()
        xx = xs - xs.mean()
        cov = (yy * xx).mean() / (yy * yy).mean()  # dxdy slope
        angs.append(np.degrees(np.arctan(cov)))
    return angs

angA = shear_angle(compsA)
print(f"\nregion A per-letter stem shear angles (deg, + = top leans right/italic): n={len(angA)}")
if angA:
    print(f"  mean={np.mean(angA):.1f} median={np.median(angA):.1f} list={[round(x,1) for x in angA]}")

compsE = components(75, 116, 130, 670, thr=35, minpx=4)
angE = shear_angle(compsE, min_h=10, max_h=25)
print(f"eyebrow per-letter shear: n={len(angE)}", f"mean={np.mean(angE):.1f} median={np.median(angE):.1f}" if angE else "")

compsH = components(238, 305, 70, 940, thr=35, minpx=4)
angH = shear_angle(compsH, min_h=30, max_h=70)
print(f"headline L1 per-letter shear: n={len(angH)}", f"mean={np.mean(angH):.1f} median={np.median(angH):.1f}" if angH else "")

compsB2 = components(533, 560, 70, 410, thr=35, minpx=4)
angB = shear_angle(compsB2, min_h=10, max_h=30)
print(f"region B per-letter shear: n={len(angB)}", f"mean={np.mean(angB):.1f} median={np.median(angB):.1f}" if angB else "")

# the mysterious rectangle: exact pixel probe
print("\n=== rectangle probe: ink>bg+50 map, x=570-610 y=283-304 ===")
for yy in range(283, 305):
    row = "".join("#" if dist[yy, xx] > 50 else ("+" if dist[yy, xx] > 20 else ".") for xx in range(570, 612))
    print(f"  y={yy}: {row}")
print("rect core colors:", [tuple(a[292, x]) for x in range(580, 600, 4)])
