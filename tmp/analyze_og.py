# Pixel-level analysis of og-probe.png — geometry, colors, clipping, overlaps.
from PIL import Image
import numpy as np

PATH = r"E:\source\source\repos\oss\brasa\tmp\og-probe.png"
im = Image.open(PATH).convert("RGB")
W, H = im.size
a = np.asarray(im).astype(int)
print(f"size: {W}x{H}")

# ---------- 1. background & corners ----------
pts = {
    "top-left(5,5)": (5, 5),
    "top-right(W-6,5)": (W - 6, 5),
    "bottom-left(5,H-6)": (5, H - 6),
    "bottom-right(W-6,H-6)": (W - 6, H - 6),
    "center(W/2,H/2)": (W // 2, H // 2),
    "left-mid(5,H/2)": (5, H // 2),
    "right-mid(W-6,H/2)": (W - 6, H // 2),
}
for k, (x, y) in pts.items():
    print(f"{k}: rgb{tuple(a[y, x])}")

# dominant background = most common color overall
flat = a.reshape(-1, 3)
colors, counts = np.unique(flat, axis=0, return_counts=True)
bg = colors[counts.argmax()]
print(f"dominant bg color: rgb{tuple(bg)} ({counts.max()/flat.shape[0]*100:.1f}% of pixels)")

# ---------- luminance & glow ----------
def lum(px):
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

L = lum(a)
print(f"luminance stats: min={L.min():.1f} max={L.max():.1f} mean={L.mean():.1f}")

# quadrant means (300px boxes)
box = 300
q = {
    "bottom-left": L[H - box:H, 0:box],
    "bottom-right": L[H - box:H, W - box:W],
    "top-left": L[0:box, 0:box],
    "top-right": L[0:box, W - box:W],
    "center": L[H // 2 - box // 2:H // 2 + box // 2, W // 2 - box // 2:W // 2 + box // 2],
}
for k, v in q.items():
    print(f"mean luminance {k} ({box}x{box}): {v.mean():.1f}  max={v.max():.1f}")

# glow extent: from bottom-left corner, where does luminance fall back near bg?
bgL = lum(np.array([[bg]]))[0, 0]
print(f"bg luminance: {bgL:.1f}")
diag = []
step = 20
yy = H - 1
xx = 0
# scan row at H-150 (footer area) and H-60 from x=0 outward for warm glow
for row_y in (H - 400, H - 200, H - 60, H - 20):
    row = L[row_y]
    above = np.where(row > bgL + 12)[0]
    if len(above):
        print(f"row y={row_y}: pixels >bg+12 luminance from x={above.min()} to x={above.max()} count={len(above)}")
    else:
        print(f"row y={row_y}: no pixels above bg+12")
# hue of glow area
glow_px = a[H - 300:H - 100, 0:300].reshape(-1, 3)
glow_nonbg = glow_px[np.abs(glow_px - np.array(bg)).sum(1) > 30]
if len(glow_nonbg):
    print(f"glow-region non-bg mean color: rgb{tuple(glow_nonbg.mean(0).round(0))} over {len(glow_nonbg)} px")

# ---------- ink mask (content pixels) ----------
dist = np.abs(a - np.array(bg)).sum(2)
ink = dist > 60  # noticeably different from background
print(f"ink pixels total: {ink.sum()} ({ink.sum()/(W*H)*100:.2f}%)")

# edge clipping: ink touching outer borders
edge = {
    "row 0": ink[0, :].sum(),
    "row 1": ink[1, :].sum(),
    "row H-1": ink[H - 1, :].sum(),
    "row H-2": ink[H - 2, :].sum(),
    "col 0": ink[:, 0].sum(),
    "col 1": ink[:, 1].sum(),
    "col W-1": ink[:, W - 1].sum(),
    "col W-2": ink[:, W - 2].sum(),
}
print("edge ink counts (clipping check):", edge)

# ---------- row profile -> text lines / bands ----------
rows = ink.sum(1)
# find bands of consecutive rows with ink > 0 (allow small gaps)
bands = []
in_band = False
gap = 0
start = 0
for y in range(H):
    if rows[y] > 0:
        if not in_band:
            in_band = True
            start = y
        gap = 0
    else:
        if in_band:
            gap += 1
            if gap > 8:  # tolerate small gaps within a band
                bands.append((start, y - gap))
                in_band = False
                gap = 0
if in_band:
    bands.append((start, H - 1))

print(f"\ncontent bands (y ranges, height, x-extent, mean ink-pixel color):")
merged = []
for (y0, y1) in bands:
    if y1 - y0 < 2:
        continue
    sub = ink[y0:y1 + 1, :]
    xs = np.where(sub.any(0))[0]
    if len(xs) == 0:
        continue
    m = a[y0:y1 + 1, :][sub]
    # split band into left/right clusters if big x-gap (footer row)
    print(f"  y={y0}-{y1} h={y1-y0+1:3d}  x={xs.min()}-{xs.max()}  inkpx={sub.sum():5d}  mean-ink-rgb={tuple(m.mean(0).round(0))}")

# big x-gap segmentation within each band
print("\nper-band x-clusters (gap>=80px splits):")
for (y0, y1) in bands:
    if y1 - y0 < 2:
        continue
    sub = ink[y0:y1 + 1, :]
    cols = sub.any(0).astype(int)
    xs = np.where(cols)[0]
    if len(xs) == 0:
        continue
    clusters = []
    cs = xs[0]
    prev = xs[0]
    for x in xs[1:]:
        if x - prev > 80:
            clusters.append((cs, prev))
            cs = x
        prev = x
    clusters.append((cs, prev))
    cl = ", ".join(f"x={c[0]}-{c[1]}" for c in clusters)
    print(f"  y={y0}-{y1}: {len(clusters)} cluster(s): {cl}")

# ---------- saturated ember pixels (icon/bar detection) ----------
r, g, b = a[..., 0], a[..., 1], a[..., 2]
ember = (r > 140) & (r - g > 40) & (r - b > 60)  # warm orange/red
print(f"\nember-colored pixels: {ember.sum()}")
ys, xs = np.where(ember)
if len(ys):
    print(f"ember bbox: x={xs.min()}-{xs.max()} y={ys.min()}-{ys.max()}")
    # ember per-band
    for (y0, y1) in bands:
        sub = ember[y0:y1 + 1, :]
        if sub.sum() > 20:
            exs = np.where(sub.any(0))[0]
            rows_e = np.where(sub.any(1))[0]
            hi = a[y0:y1 + 1, :][sub]
            print(f"  ember in band y={y0}-{y1}: x={exs.min()}-{exs.max()} rows={rows_e.min()}-{rows_e.max()} count={sub.sum()} mean-rgb={tuple(hi.mean(0).round(0))}")
            # gradient check: mean color in left half vs right half vs top vs bottom of this ember region
            rr = rows_e
            top_half = sub[: len(rr) // 2 + 1]
            print(f"    ember top-half mean rgb={tuple(a[y0:y1+1,:][sub][:len(ember[sub.any(1)])][:sub[:len(rr)//2+1].sum() and 0 or 0].reshape(-1,3).mean(0).round(0))}" if False else "")

# sharper gradient probe for the flame area (top-left, first band)
print("\nflame gradient probe (band 1):")
by = bands[0]
sub = ember[by[0]:by[1] + 1, :]
if sub.sum() > 20:
    eys, exs = np.where(sub)
    y_lo, y_hi = by[0] + eys.min(), by[0] + eys.max()
    x_lo, x_hi = exs.min(), exs.max()
    print(f"  flame bbox x={x_lo}-{x_hi} y={y_lo}-{y_hi} ({x_hi-x_lo+1}x{y_hi-y_lo+1})")
    n_slice = 6
    for i in range(n_slice):
        yy0 = y_lo + (y_hi - y_lo + 1) * i // n_slice
        yy1 = y_lo + (y_hi - y_lo + 1) * (i + 1) // n_slice
        sl = ember[yy0:yy1, x_lo:x_hi + 1]
        px = a[yy0:yy1, x_lo:x_hi + 1][sl]
        if len(px):
            print(f"  flame slice y={yy0}-{yy1-1}: mean rgb={tuple(px.mean(0).round(0))} px={len(px)}")

# ---------- stroke sharpness around flame: max local contrast ----------
gy, gx = np.gradient(L)
gm = np.hypot(gx, gy)
if sub.sum() > 0:
    print(f"  max gradient magnitude inside flame bbox: {gm[y_lo:y_hi+1, x_lo:x_hi+1].max():.1f}")

# ---------- ink mean colors per band ----------
print("\nband mean ink colors (excluding ember pixels):")
for (y0, y1) in bands:
    if y1 - y0 < 2:
        continue
    sub = ink[y0:y1 + 1, :]
    non_ember = sub & ~ember[y0:y1 + 1, :]
    if non_ember.sum() > 10:
        m = a[y0:y1 + 1, :][non_ember]
        print(f"  y={y0}-{y1}: non-ember ink mean rgb={tuple(m.mean(0).round(0))} count={non_ember.sum()}")

# ---------- gaps between bands (vertical rhythm) ----------
print("\nband gaps:")
prev = None
for (y0, y1) in bands:
    if prev is not None:
        print(f"  gap between band ending y={prev[1]} and starting y={y0}: {y0 - prev[1] - 1}px")
    prev = (y0, y1)
