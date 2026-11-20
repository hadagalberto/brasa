# Probe 3: fixed bar analysis, line x-extents, region A/B, dim scan, glow, ASCII renders, OCR crops.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
bg = np.array([34, 23, 16])
dist = np.abs(a - bg).sum(2)
L = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])

def band_info(y0, y1, name, gap=4):
    sub = dist[y0:y1 + 1] > 35
    xs = np.where(sub.any(0))[0]
    px = a[y0:y1 + 1][sub]
    print(f"\n[{name}] y={y0}-{y1} h={y1-y0+1} x={xs.min()}-{xs.max()} inkpx={sub.sum()} mean-rgb={tuple(px.mean(0).round(0))}")
    cols = sub.any(0)
    xs_ = np.where(cols)[0]
    cl = []
    cs, prev = xs_[0], xs_[0]
    for x in xs_[1:]:
        if x - prev > gap:
            cl.append((cs, prev))
            cs = x
        prev = x
    cl.append((cs, prev))
    # letter pitch = diffs between cluster starts
    starts = [c[0] for c in cl]
    pitch = np.diff(starts)
    print(f"  clusters={len(cl)} cluster-starts-x-frac: {starts[:12]}... pitches={list(pitch[:15])}")
    print(f"  pitch mean={pitch.mean():.1f} std={pitch.std():.1f} (mono => low std)")
    return cl

# headline lines
for (y0, y1, nm) in [(241, 300, "headline-line1"), (307, 368, "headline-line2"), (375, 434, "headline-line3")]:
    band_info(y0, y1, nm)

# ember bar
y0, y1 = 461, 465
sub = dist[y0:y1 + 1] > 35
xs = np.where(sub.any(0))[0]
x0, x1 = xs.min(), xs.max()
px = a[y0:y1 + 1, x0:x1 + 1][sub[:, x0:x1 + 1]]
print(f"\n[ember-bar] y={y0}-{y1} x={x0}-{x1} size={x1-x0+1}x{y1-y0+1} mean-rgb={tuple(px.mean(0).round(0))}")
n = 5
for i in range(n):
    c0 = (x1 - x0 + 1) * i // n
    c1 = (x1 - x0 + 1) * (i + 1) // n
    sp = sub[:, x0 + c0:x0 + c1]
    spx = a[y0:y1 + 1, x0 + c0:x0 + c1][sp]
    print(f"  bar horiz slice {i}: x={x0+c0}-{x0+c1-1} mean-rgb={tuple(spx.mean(0).round(0))}")

# region A (subline) & B (footer?)
clA = band_info(500, 527, "regionA(subline?)", gap=4)
clB = band_info(535, 556, "regionB(footer?)", gap=4)

# dim scan below y=556 (excluding glow wedge area x<400)
print("\ndim scan (dist>15), y=557..629, x>400:")
dm = (dist[557:H, 400:] > 15)
ys, xs = np.where(dm)
print(f"  ink px found: {len(ys)}")
if len(ys):
    print(f"  bbox x={400+xs.min()}-{400+xs.max()} y={557+ys.min()}-{557+ys.max()}")
# also check right half of full bottom strip with dist>25
dm2 = (dist[470:H, 400:] > 25)
ys2, xs2 = np.where(dm2)
print(f"dim scan (dist>25) y=470..629 x>400: {len(ys2)} px", f"bbox x={400+xs2.min()}-{400+xs2.max()} y={470+ys2.min()}-{470+ys2.max()}" if len(ys2) else "")

# glow (text-free region)
reg = L[557:H, 0:400]
iy, ix = np.unravel_index(reg.argmax(), reg.shape)
print(f"\nglow peak in y=557-629,x=0-399: L={reg.max():.1f} at x={ix} y={557+iy} rgb={tuple(a[557+iy, ix])}")
print(f"corner (0,629) rgb={tuple(a[629,0])} L={L[629,0]:.1f}")
print(f"corner (2,626) rgb={tuple(a[626,2])} L={L[626,2]:.1f}")
print("bottom row y=629 luminance every 40px:", [round(float(L[629, x]),1) for x in range(0, 600, 40)])
print("left col x=0 luminance y=470..629 every 20:", [round(float(L[y, 0]),1) for y in range(470, H, 20)])

# inter-element gaps
print("\nvertical rhythm: eyebrow ends 112, headline1 starts 241 (gap 128), l1 ends 300 l2 starts 307 (gap 6), l2 ends 368 l3 starts 375 (gap 6), l3 ends 434, bar 461-465 (gap 26), regionA 500-527 (gap 34), regionB 535-556 (gap 7), bottom edge 630 (gap 73)")

# shear/italic: region A vs B vs headline
def shear(y0, y1, x0=60, x1=900):
    s = dist[y0:y1 + 1, x0:x1] > 35
    letters = []
    cs, prev = None, None
    for i, v in enumerate(s.any(0)):
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
        mid = ys.min() + (ys.max() - ys.min()) // 2
        top = sl[:mid - ys.min()]
        bot = sl[mid - ys.min():]
        tx_ = np.where(top.any(0))[0]
        bx_ = np.where(bot.any(0))[0]
        if len(tx_) and len(bx_):
            shifts.append(float(tx_.mean() - bx_.mean()))
    return len(letters), (round(float(np.mean(shifts)), 2) if shifts else None), len(shifts)

for nm, (y0, y1) in [("headline-l1", (241, 300)), ("headline-l2", (307, 368)), ("regionA", (500, 527)), ("regionB", (535, 556))]:
    n, m, c = shear(y0, y1)
    print(f"shear {nm}: letters={n} mean-top-right-shift={m} (n={c})")

# ASCII rendering
CH = " .:-=+*#%@"
def ascii_render(x0, y0, x1, y1, sx=2, sy=2, label=""):
    reg = L[y0:y1, x0:x1]
    h, w = reg.shape
    print(f"\n--- ASCII {label} x={x0}-{x1} y={y0}-{y1} ({sx}x{sy}px/char) ---")
    for yy in range(0, h, sy):
        line = []
        for xx in range(0, w, sx):
            v = reg[yy:yy+sy, xx:xx+sx].mean()
            t = (v - 17) / (236 - 17)
            line.append(CH[min(int(t * len(CH)), len(CH) - 1)])
        print("".join(line))

# full image overview
ascii_render(0, 0, W, H, sx=10, sy=8, label="FULL")
# flame
ascii_render(84, 76, 114, 116, sx=1, sy=1, label="FLAME x84-114 y76-116")
# eyebrow: flame + first two words
ascii_render(84, 74, 240, 118, sx=1, sy=2, label="EYEBROW start (flame+word1) 1x2")
ascii_render(240, 74, 480, 118, sx=1, sy=2, label="EYEBROW mid 1x2")
ascii_render(480, 74, 680, 118, sx=1, sy=2, label="EYEBROW end 1x2")
# headline lines
for (y0, y1, nm) in [(241, 302, "HEADLINE-LINE1"), (307, 370, "HEADLINE-LINE2"), (375, 436, "HEADLINE-LINE3")]:
    ascii_render(70, y0, 940, y1, sx=4, sy=4, label=nm)
# the mysterious blob
ascii_render(555, 285, 615, 305, sx=1, sy=1, label="BLOB x555-615 y285-305")
# bar
ascii_render(70, 455, 205, 472, sx=1, sy=1, label="BAR")
# region A subline
ascii_render(70, 495, 480, 532, sx=2, sy=2, label="REGION-A part1 (subline?)")
ascii_render(470, 495, 850, 532, sx=2, sy=2, label="REGION-A part2 (subline?)")
# region B footer
ascii_render(70, 530, 410, 560, sx=1, sy=1, label="REGION-B (footer?)")

# OCR crops
def save_crop(name, cx0, cy0, cx1, cy1, scale):
    crop = a[cy0:cy1, cx0:cx1]
    g = (0.2126 * crop[..., 0] + 0.7152 * crop[..., 1] + 0.0722 * crop[..., 2])
    o = 255.0 - g
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
save_crop("headline1", 70, 235, 940, 305, 3)
save_crop("headline2", 70, 301, 940, 372, 3)
save_crop("headline3", 70, 369, 940, 440, 3)
save_crop("bar", 70, 455, 205, 472, 6)
save_crop("subline", 70, 495, 850, 532, 4)
save_crop("footerB", 70, 530, 410, 560, 5)
save_crop("full", 0, 0, W, H, 2)
