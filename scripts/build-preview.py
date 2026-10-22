"""Bundle the existing homepage into a single offline, interactive HTML file.

Run from any directory: python scripts/build-preview.py
Original artwork is embedded byte-for-byte, never edited or rasterized.
"""
from pathlib import Path
import base64

root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
css = (root / 'style.css').read_text()
font = base64.b64encode((root / 'assets/roman-numeral.ttf').read_bytes()).decode()
css = css.replace('assets/roman-numeral.ttf', 'data:font/ttf;base64,' + font)
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
for name in ('logo', 'person', 'desk'):
    data = base64.b64encode((root / f'assets/{name}.png').read_bytes()).decode()
    html = html.replace(f'assets/{name}.png', 'data:image/png;base64,' + data)
js = (root / 'projects.js').read_text().replace('export const projects', 'const projects')
js += '\n' + (root / 'app.js').read_text().replace("import { projects } from './projects.js';", '')
start = js.index("await fetch('assets/decorations.json')")
end = js.index('\nfor (const item of layout.items)', start)
js = js[:start] + (root / 'assets/decorations.json').read_text() + ';' + js[end:]
html = html.replace('<script type="module" src="app.js"></script>', '<script>' + js + '</script>')
target = root / 'previews/home-interactive.html'
target.write_text(html)
print(f'Built {target.relative_to(root)} ({target.stat().st_size:,} bytes)')
