"""Create external-only shadow layers. Never changes or replaces the original PNGs."""
from pathlib import Path
from math import ceil
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

root = Path(__file__).resolve().parent.parent
rules = []
for name, box_width, box_height in [('person', 428, 394), ('desk', 415, 325)]:
    image = Image.open(root / f'assets/{name}.png').convert('RGBA')
    width, height = image.size
    scale = min(box_width / width, box_height / height)
    blur, offset = 9 / scale, 7 / scale
    padding = ceil(blur * 3 + offset + 4)
    # All semi-transparent material becomes opaque in the shadow-exclusion mask.
    silhouette = image.getchannel('A').point(lambda alpha: 255 if alpha else 0)
    silhouette = ImageOps.expand(silhouette, border=padding, fill=0)
    outside = silhouette.copy()
    ImageDraw.floodfill(outside, (0, 0), 128)
    # Fill internal transparent holes as well: shadow is permitted only OUTSIDE the outline.
    filled = outside.point(lambda value: 0 if value == 128 else 255)
    shifted = Image.new('L', filled.size)
    shifted.paste(filled, (0, round(offset)))
    shadow = shifted.filter(ImageFilter.GaussianBlur(blur)).point(lambda value: round(value * .23))
    shadow = ImageChops.subtract(shadow, filled)
    assert not ImageChops.multiply(shadow, filled).getbbox(), 'Shadow must not enter silhouette'
    layer = Image.new('RGBA', filled.size, (0, 0, 0, 0))
    layer.putalpha(shadow)
    layer.save(root / f'assets/{name}-outer-shadow.png', optimize=True)
    render_width, render_height = width * scale, height * scale
    x = ((box_width - render_width) / 2 - padding * scale) / box_width * 100
    y = ((box_height - render_height) / 2 - padding * scale) / box_height * 100
    w = (width + padding * 2) * scale / box_width * 100
    h = (height + padding * 2) * scale / box_height * 100
    rules.append(f'.{name} {{ --shadow-left: {x:.8f}%; --shadow-top: {y:.8f}%; --shadow-width: {w:.8f}%; --shadow-height: {h:.8f}%; }}')
    print(f'{name}: generated external-only shadow; zero overlap with filled silhouette')
(root / 'assets/outer-shadows.css').write_text('\n'.join(rules) + '\n')
