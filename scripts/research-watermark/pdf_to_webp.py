#!/usr/bin/env python3
"""Render local PDFs and burn author marks into every exported WebP, in memory."""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
import math
import json

import fitz
from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Settings:
    dpi: int = 240
    opacity: float = 0.055
    width: float = 0.62
    x: float = 0.5
    y: float = 0.5
    footer_opacity: float = 0.48
    footer_size: float = 8
    footer_margin_mm: float = 6
    year: int = 2026
    font: str | None = None
    lossless: bool = True
    quality: int = 96

    def validate(self):
        ranges = {
            'dpi': (72, 600), 'opacity': (0.01, 0.3), 'width': (0.15, 0.85),
            'x': (0, 1), 'y': (0, 1), 'footer_opacity': (0.15, 1),
            'footer_size': (6, 16), 'footer_margin_mm': (2, 30),
            'year': (2000, 2200), 'quality': (80, 100),
        }
        for name, (low, high) in ranges.items():
            value = getattr(self, name)
            if not math.isfinite(value) or not low <= value <= high:
                raise ValueError(f'{name} must be between {low} and {high}.')


def font_path(custom: str | None = None) -> str:
    if custom:
        if not Path(custom).is_file():
            raise ValueError(f'Font does not exist: {custom}')
        return custom
    # Explicit Unicode-capable fonts ensure © and · are real glyphs.
    for name in [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
        '/System/Library/Fonts/Supplemental/Arial.ttf',
        'C:/Windows/Fonts/arial.ttf',
    ]:
        if Path(name).is_file():
            return name
    raise ValueError('Specify a Unicode TTF font with --font /path/to/font.ttf.')


def render_page(page, dpi: int) -> Image.Image:
    # Respect the PDF's visible page box and rotation; never crop/reflow its content.
    scale = dpi / 72
    if page.rect.width * page.rect.height * scale * scale > 80_000_000:
        raise ValueError('Page exceeds 80 megapixels; lower --dpi for this document.')
    pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB, alpha=False)
    return Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)


def add_watermark(page_image: Image.Image, settings: Settings) -> Image.Image:
    settings.validate()
    base = page_image.convert('RGBA')
    overlay = Image.new('RGBA', base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    font_file = font_path(settings.font)
    text = 'LINJUN YE'
    reference = ImageFont.truetype(font_file, 100)
    size = max(1, round(100 * base.width * settings.width / reference.getlength(text)))
    central_font = ImageFont.truetype(font_file, size)
    bbox = draw.textbbox((0, 0), text, font=central_font)
    width, height = bbox[2] - bbox[0], bbox[3] - bbox[1]
    left, top = base.width * settings.x - width / 2, base.height * settings.y - height / 2
    if left < 0 or top < 0 or left + width > base.width or top + height > base.height:
        raise ValueError('Central watermark would be clipped; adjust --x, --y or --width.')
    draw.text((left - bbox[0], top - bbox[1]), text, font=central_font,
              fill=(0, 0, 0, max(1, round(255 * settings.opacity))))
    footer = f'© LINJUN YE · {settings.year}'
    footer_font = ImageFont.truetype(font_file, max(1, round(settings.footer_size * settings.dpi / 72)))
    box = draw.textbbox((0, 0), footer, font=footer_font)
    footer_width, footer_height = box[2] - box[0], box[3] - box[1]
    footer_left = (base.width - footer_width) / 2
    footer_bottom = base.height - settings.footer_margin_mm * settings.dpi / 25.4
    footer_top = footer_bottom - footer_height
    if footer_left < 0 or footer_top < 0:
        raise ValueError('Footer does not fit this page; reduce --footer-size.')
    draw.text((footer_left - box[0], footer_top - box[1]), footer, font=footer_font,
              fill=(0, 0, 0, round(255 * settings.footer_opacity)))
    # Pixels are composited here. Neither HTML nor CSS is needed to see the marks.
    return Image.alpha_composite(base, overlay).convert('RGB')


def convert_pdf(source: Path, output: Path, settings: Settings) -> list[dict]:
    settings.validate()
    font_path(settings.font)
    source, output = source.expanduser().resolve(), output.expanduser().resolve()
    if not source.is_file() or source.suffix.lower() != '.pdf':
        raise ValueError('Input must be an existing local PDF file.')
    if source.is_relative_to(REPO):
        raise ValueError('Keep original PDFs outside the repository; move this input to a private local folder first.')
    if output.exists() and any(output.iterdir()):
        raise ValueError('Output folder must be empty; use a new folder to avoid replacing/mixing pages.')
    pages = []
    with fitz.open(source) as document:
        if document.needs_pass:
            raise ValueError('This PDF needs a password; provide an unlocked local copy.')
        if not document.page_count:
            raise ValueError('PDF contains no pages.')
        output.mkdir(parents=True, exist_ok=True)
        for index, page in enumerate(document):
            original = render_page(page, settings.dpi)
            marked = add_watermark(original, settings)
            target = output / f'{index + 1:02d}.webp'
            temporary = output / f'.{target.name}.tmp'
            try:
                # No unmarked raster or original PDF is written to the output folder.
                marked.save(temporary, format='WEBP', lossless=settings.lossless,
                            quality=settings.quality, method=4, exact=True)
                temporary.replace(target)
            finally:
                temporary.unlink(missing_ok=True)
                original.close()
                marked.close()
            pages.append({'file': target.name, 'width': original.width, 'height': original.height})
            print(f'{target.name}: {original.width} × {original.height}', flush=True)
    return pages


def parser():
    command = argparse.ArgumentParser(description=__doc__)
    command.add_argument('pdf', type=Path, help='Private PDF outside the repository')
    command.add_argument('--output', type=Path, required=True, help='New/empty output directory; only marked WebPs are written')
    command.add_argument('--manifest', type=Path, help='Optional new private JSON file with page names and pixel sizes')
    command.add_argument('--dpi', type=int, default=240)
    command.add_argument('--opacity', type=float, default=0.055, help='Central black watermark opacity, 0.01–0.3')
    command.add_argument('--width', type=float, default=0.62, help='Central mark width as a fraction of page width')
    command.add_argument('--x', type=float, default=0.5, help='Central mark horizontal center, fraction of page width')
    command.add_argument('--y', type=float, default=0.5, help='Central mark vertical center, fraction of page height')
    command.add_argument('--footer-opacity', type=float, default=0.48)
    command.add_argument('--footer-size', type=float, default=8, help='Footer text size in PDF points')
    command.add_argument('--footer-margin-mm', type=float, default=6, help='Distance from page bottom to footer bottom')
    command.add_argument('--year', type=int, default=2026)
    command.add_argument('--font', help='Optional Unicode TTF font path')
    command.add_argument('--lossy', action='store_true', help='Optional smaller lossy WebPs; default is lossless')
    command.add_argument('--quality', type=int, default=96, help='Used for lossy mode, 80–100')
    return command


def main():
    command = parser()
    arguments = command.parse_args()
    try:
        values = vars(arguments).copy()
        source, output = values.pop('pdf'), values.pop('output')
        manifest = values.pop('manifest')
        if manifest:
            manifest = manifest.expanduser().resolve()
            if manifest.is_relative_to(REPO) or manifest.exists():
                raise ValueError('Manifest must be a new file outside the repository.')
        values['lossless'] = not values.pop('lossy')
        pages = convert_pdf(source, output, Settings(**values))
        if manifest:
            manifest.parent.mkdir(parents=True, exist_ok=True)
            manifest.write_text(json.dumps(pages, ensure_ascii=False, indent=2) + '\n')
        print(f'Completed {len(pages)} watermarked pages. Original PDF unchanged.')
    except (ValueError, OSError, fitz.FileDataError) as error:
        command.exit(1, f'Error: {error}\n')


if __name__ == '__main__':
    main()
