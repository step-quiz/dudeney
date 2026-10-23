#!/usr/bin/env python3
"""
============================================================================
PROJECTE: dudeney (Step Quiz)
FITXER: tools/comprova-pdf.py
ROL: Comprova que els PDF per imprimir són en blanc i negre: rasteritza cada
  pàgina (pdftoppm, 40 ppp) i compta els píxels de color (max − min > 12 als
  canals RGB). Falla si en troba cap. També diu quantes pàgines té cada PDF.
ÚS:  python3 tools/comprova-pdf.py   (després de node tools/genera-pdf.js)
DEPENDÈNCIES: poppler-utils (pdftoppm, pdfinfo), Pillow.
============================================================================
"""
import pathlib
import subprocess
import sys
import tempfile

from PIL import Image

ARREL = pathlib.Path(__file__).resolve().parent.parent
errors = 0
for nom in ('enigmes', 'solucions'):
    pdf = ARREL / 'imprimir' / f'{nom}.pdf'
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['pdftoppm', '-r', '40', '-png', str(pdf), f'{tmp}/p'], check=True)
        pagines = sorted(pathlib.Path(tmp).glob('p*.png'))
        for f in pagines:
            im = Image.open(f).convert('RGB')
            color = sum(1 for px in im.getdata() if max(px) - min(px) > 12)
            if color:
                errors += 1
                print(f'✗ {nom}.pdf, pàgina {f.stem[2:]}: {color} píxels de color')
        print(f'{nom}.pdf: {len(pagines)} pàgines')
if errors:
    sys.exit(1)
print('✓ Cap píxel de color')
