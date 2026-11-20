# Probe 6: identify the dim patch above the bar + glow top extent + coarse luminance grid.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
bg = np.array([34, 23, 16])
dist = np.abs(a - bg).sum(2)
L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])

# luminance grid y=430..500, x=0..400 (every 10x10 block mean, show only >bg+1)
print("=== luminance grid (mean per 10x10 block), y=430-500 x=0-400; '+' >bg+1, digits scale ===")
for y in range(430, 500, 10):
    row = []
    for x in range(0, 400, 10):
        v = L[y:y + 10, x:x + 10].mean()
        d = v - 24.8
        if d < 0.5:
            row.append(" ")
        elif d < 2:
            row.append(".")
        elif d < 4:
            row.append("-")
        elif d < 7:
            row.append("+")
        else:
            row.append("#")
    print(f"y={y:3d}: {''.join(row)}")

print("\n=== same style grid y=400..630 x=0..600, 20px blocks ===")
for y in range(400, 630, 20):
    row = []
    for x in range(0, 600, 20):
        v = L[y:y + 20, x:x + 20].mean()
        d = v - 24.8
        if d < 0.5:
            row.append(" ")
        elif d < 2:
            row.append(".")
        elif d < 4:
            row.append("-")
        elif d < 7:
            row.append("+")
        else:
            row.append("#")
    print(f"y={y:3d}: {''.join(row)}")

# precise bbox of the dim patch at y=445..460
m = dist[440:465, 100:300] > 12
ys, xs = np.where(m)
if len(ys):
    print(f"\ndim patch (dist>12) in y=440-465 x=100-300: bbox x={100+xs.min()}-{100+xs.max()} y={440+ys.min()}-{440+ys.max()} px={len(ys)}")
    print(f"  peak rgb: {tuple(a[440+ys, 100+xs].max(0))}, peak L: {L[440+ys, 100+xs].max():.1f}")
    for yy in range(440, 465):
        rr = dist[yy, 100:300] > 12
        if rr.any():
            xr = np.where(rr)[0]
            print(f"  y={yy}: x={100+xr.min()}-{100+xr.max()} count={rr.sum()} meanL={L[yy, 100:300][rr].mean():.1f}")

# check if the patch connects visually to the bar (color at bar's left end vs patch)
print("\nbar left end rgb:", tuple(a[463, 80]), " patch rgb:", tuple(a[454, 200]))
# does the glow reach y=445 at some x? left edge profile
print("\nleft-edge luminance y=430..470:", [round(float(L[y, 0]), 1) for y in range(430, 470, 5)])
print("left-edge luminance y=470..630:", [round(float(L[y, 0]), 1) for y in range(470, 630, 15)])

# coarse full-canvas luminance map to describe bg gradient
print("\n=== full bg gradient map (30px blocks, mean L) ===")
for y in range(0, 630, 60):
    row = []
    for x in range(0, 1200, 100):
        v = L[y:y + 60, x:x + 100].mean()
        row.append(f"{v:4.0f}")
    print(f"y={y:3d}: {' '.join(row)}")
