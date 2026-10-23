"""Meaningful regression checks using synthetic PDFs only; no real research input."""
import hashlib
from pathlib import Path
import tempfile
import unittest

import fitz
from PIL import Image, ImageChops
from pdf_to_webp import Settings, add_watermark, convert_pdf, render_page


class WatermarkTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='linjun-synthetic-test-')
        self.folder = Path(self.temporary.name)
        self.source = self.folder / 'synthetic.pdf'
        with fitz.open() as document:
            for index, size in enumerate([(595, 842), (595, 842), (420, 595)]):
                page = document.new_page(width=size[0], height=size[1])
                page.insert_text((35, 55), f'SYNTHETIC PAGE {index + 1}', fontsize=15)
                page.insert_text((35, size[1] / 2), f'Body sample on page {index + 1}; 1234567890.', fontsize=10)
                page.insert_text((35, size[1] - 42), f'Test footnote {index + 1}, small type.', fontsize=7)
                if index == 1:
                    page.set_rotation(90)
            document.save(self.source)

    def tearDown(self):
        self.temporary.cleanup()

    def test_order_rotation_lossless_marks_and_source_integrity(self):
        fingerprint = hashlib.sha256(self.source.read_bytes()).digest()
        output = self.folder / 'marked'
        settings = Settings(dpi=144)
        records = convert_pdf(self.source, output, settings)
        self.assertEqual(sorted(p.name for p in output.iterdir()), ['01.webp', '02.webp', '03.webp'])
        self.assertEqual([p['file'] for p in records], ['01.webp', '02.webp', '03.webp'])
        with fitz.open(self.source) as document:
            for index, record in enumerate(records):
                before = render_page(document[index], settings.dpi)
                expected = add_watermark(before, settings)
                with Image.open(output / record['file']) as result:
                    actual = result.convert('RGB')
                    self.assertEqual(actual.size, before.size)
                    self.assertIsNone(ImageChops.difference(actual, expected).getbbox())
                    w, h = actual.size
                    difference = ImageChops.difference(actual, before)
                    self.assertIsNotNone(difference.crop((int(w*.1), int(h*.35), int(w*.9), int(h*.65))).getbbox())
                    self.assertIsNotNone(difference.crop((0, int(h*.93), w, h)).getbbox())
                    self.assertIsNone(difference.crop((0, 0, w, int(h*.25))).getbbox())
                    self.assertEqual((record['width'], record['height']), actual.size)
        self.assertEqual(hashlib.sha256(self.source.read_bytes()).digest(), fingerprint)

    def test_refuses_overwrite_and_invisible_or_clipped_marks(self):
        output = self.folder / 'existing'
        output.mkdir()
        existing = output / '01.webp'
        existing.write_bytes(b'preserve this existing file')
        with self.assertRaisesRegex(ValueError, 'empty'):
            convert_pdf(self.source, output, Settings(dpi=72))
        self.assertEqual(existing.read_bytes(), b'preserve this existing file')
        for settings in [Settings(opacity=0), Settings(opacity=float('nan')), Settings(footer_opacity=0)]:
            with self.assertRaises(ValueError):
                convert_pdf(self.source, self.folder / 'invalid', settings)
        self.assertFalse((self.folder / 'invalid').exists())
        image = Image.new('RGB', (595, 842), 'white')
        with self.assertRaisesRegex(ValueError, 'clipped'):
            add_watermark(image, Settings(dpi=72, x=0))


if __name__ == '__main__':
    unittest.main()
