#!/usr/bin/env python3
"""Generate a clearly synthetic A4 page and private before/after review artifacts."""
from pathlib import Path
import argparse
import json
import fitz
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pdf_to_webp import REPO, Settings, render_page, add_watermark, convert_pdf


def create_pdf(path):
    width, height = A4
    document = canvas.Canvas(str(path), pagesize=A4)
    document.setTitle('Synthetic watermark test — not a published essay')
    document.setAuthor('Synthetic test fixture')
    document.setFillColorRGB(.45, .45, .45)
    document.setFont('Helvetica', 7.5)
    document.drawString(54, height - 38, 'SYNTHETIC TEST PAGE — NOT A PUBLISHED ESSAY')
    document.setFillColorRGB(.08, .08, .08)
    document.setFont('Times-Bold', 20)
    document.drawString(54, height - 79, 'Reading Space and Looking Closely')
    document.setFont('Times-Italic', 11)
    document.drawString(54, height - 99, 'A mock academic page for image and watermark review')
    body = ParagraphStyle('Body', fontName='Times-Roman', fontSize=11, leading=15, textColor='#222222')
    small = ParagraphStyle('Footnote', fontName='Times-Roman', fontSize=8, leading=10.5, textColor='#333333')
    y = height - 130

    def paragraph(text, style=body, gap=12):
        nonlocal y
        p = Paragraph(text, style)
        _, used = p.wrap(width - 108, height)
        p.drawOn(document, 54, y - used)
        y -= used + gap

    paragraph('<b>Abstract.</b> This page is an invented technical specimen. Its only purpose is to test the legibility of a rasterised research page before and after a subtle author watermark is embedded. It is not a real essay, curatorial proposal, or exhibition review.')
    paragraph('<b>1. Reading the page</b><br/>An online document must preserve the relationships between its heading, main text, notes, and page furniture. Readers should be able to move through the original sequence without a change of scale that makes the smallest text inaccessible. This sample therefore includes ordinary punctuation, italic text, and superscript markers<super>1</super> alongside a small diagram. Every sentence here is test material rather than a claim attributed to an actual publication.')
    paragraph('The watermark is deliberately quiet. Its position at the centre of the page allows us to inspect how pale lettering interacts with black type and the white spaces between paragraphs. The base page remains white, and the printed characters retain their edges. Enlarging the exported image should reveal the same body text, original page number, and footnotes, with no reflow or substituted typography.')
    paragraph('<b>2. Notes on reproduction</b><br/>Pixel dimensions matter when reading on screen. A page displayed at a comfortable width may still contain text too small to read until it is enlarged. The local conversion process renders the PDF at a selected resolution and applies both marks to the resulting pixels. It does not depend on browser overlays. This paragraph provides additional lines across the centre of the specimen<super>2</super> so that the comparison includes text beneath the watermark.')
    # A small, purely synthetic grayscale illustration checks image fidelity too.
    document.setStrokeColorRGB(.55, .55, .55)
    for index in range(8):
        document.setFillColorRGB(*([.15 + index * .1] * 3))
        document.rect(54 + index * 40, y - 38, 40, 28, stroke=0, fill=1)
    y -= 57
    paragraph('<i>Figure 1. Synthetic grayscale strip used only for this rendering test.</i>', small, 8)
    document.setStrokeColorRGB(.55, .55, .55)
    document.setLineWidth(.4)
    document.line(54, 103, 225, 103)
    y = 92
    paragraph('1. Test footnote: an eight-point line checks small text, punctuation, and superscript references.', small, 4)
    paragraph('2. No real research content or external source is reproduced in this specimen.', small, 0)
    document.setFont('Times-Roman', 9)
    document.setFillColorRGB(.15, .15, .15)
    document.drawCentredString(width / 2, 40, '1')
    document.showPage()
    document.save()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('/tmp/linjun-watermark-review'))
    arguments = parser.parse_args()
    output = arguments.output.expanduser().resolve()
    if output.is_relative_to(REPO):
        parser.error('Demo files must stay outside the repository and public website.')
    if output.exists() and any(output.iterdir()):
        parser.error('Use a new or empty demo directory.')
    output.mkdir(parents=True, exist_ok=True)
    source = output / 'synthetic-a4.pdf'
    create_pdf(source)
    settings = Settings()
    with fitz.open(source) as document:
        if document.page_count != 1:
            raise ValueError('Synthetic comparison must contain exactly one A4 page.')
        before = render_page(document[0], settings.dpi)
        after = add_watermark(before, settings)
        before.save(output / 'before.png')
        after.save(output / 'after.png')
    pages = convert_pdf(source, output / 'watermarked-webp', settings)
    (output / 'pages.json').write_text(json.dumps(pages, indent=2) + '\n')
    print(f'Private synthetic review files: {output}')


if __name__ == '__main__':
    main()
