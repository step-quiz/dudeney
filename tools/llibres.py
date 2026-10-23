#!/usr/bin/env python3
"""
============================================================================
PROJECTE: dudeney (Step Quiz)
FITXER: tools/llibres.py
ROL: Eina de treball (no es publica res): llegeix els EPUB originals de
  Dudeney que hi ha a src/ (git-ignored) i en treu el text d'un problema
  (enunciat i solució) i les seves figures, per traduir-lo i redibuixar-lo.
ÚS:
  python3 tools/llibres.py prepara           # descomprimeix els EPUB a tmp/llibres/ i en fa el text
  python3 tools/llibres.py am 216 362        # enunciat + solució dels problemes AM 216 i 362
  python3 tools/llibres.py cp 1              # The Canterbury Puzzles, núm. 1
  python3 tools/llibres.py figures am 247    # camins de les imatges del problema (per veure-les)
FONTS (domini públic; Project Gutenberg, no es redistribueix cap fitxer seu):
  src/amusements-in-mathematics-1917.epub  = https://www.gutenberg.org/ebooks/16713  (EPUB amb imatges)
  src/canterbury-puzzles-1907.epub         = https://www.gutenberg.org/ebooks/27635  (EPUB amb imatges)
DEPENDÈNCIES: només la biblioteca estàndard de Python.
============================================================================
"""
import html
import pathlib
import re
import sys
import zipfile
from html.parser import HTMLParser

ARREL = pathlib.Path(__file__).resolve().parent.parent
SRC = ARREL / 'src'
TMP = ARREL / 'tmp' / 'llibres'  # tmp/ és a .gitignore
LLIBRES = {
    'am': ('amusements-in-mathematics-1917.epub', 16713),
    'cp': ('canterbury-puzzles-1907.epub', 27635),
}


class Text(HTMLParser):
    """HTML → text pla, amb [IMG fitxer] on hi ha imatges i | entre cel·les."""

    def __init__(self):
        super().__init__()
        self.o, self.salta = [], 0

    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag in ('style', 'script'):
            self.salta += 1
        if tag in ('p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'tr', 'li', 'pre'):
            self.o.append('\n')
        if tag == 'img':
            self.o.append(f"[IMG {pathlib.Path(a.get('src', '')).name}]")
        if tag in ('td', 'th'):
            self.o.append(' | ')

    def handle_endtag(self, tag):
        if tag in ('style', 'script'):
            self.salta -= 1
        if tag in ('p', 'h1', 'h2', 'h3', 'h4'):
            self.o.append('\n')

    def handle_data(self, d):
        if not self.salta:
            self.o.append(d)


def prepara():
    TMP.mkdir(parents=True, exist_ok=True)
    for clau, (fitxer, num) in LLIBRES.items():
        epub = SRC / fitxer
        if not epub.exists():
            print(f'FALTA {epub}: baixa l’EPUB amb imatges de https://www.gutenberg.org/ebooks/{num} i desa’l amb aquest nom.')
            continue
        desti = TMP / clau
        with zipfile.ZipFile(epub) as z:
            z.extractall(desti)
        opf = next(desti.rglob('*.opf'))
        t = opf.read_text(encoding='utf-8')
        items = {}
        for m in re.finditer(r'<item\b[^>]*>', t):
            ident = re.search(r'\bid="([^"]+)"', m.group(0))
            href = re.search(r'\bhref="([^"]+)"', m.group(0))
            if ident and href:
                items[ident.group(1)] = html.unescape(href.group(1))
        parts = []
        for idref in re.findall(r'<itemref[^>]*idref="([^"]+)"', t):
            p = Text()
            p.feed((opf.parent / items[idref]).read_text(encoding='utf-8'))
            parts.append(''.join(p.o))
        txt = re.sub(r'[ \t]+', ' ', ''.join(parts))
        txt = re.sub(r'\n\s*\n+', '\n\n', txt)
        # Es treu la capçalera i el peu de llicència de Project Gutenberg (no els necessitem)
        txt = re.sub(r'(?s)^.*?\*\*\* ?START OF[^\n]*\n', '', txt)
        txt = re.sub(r'(?s)\*\*\* ?END OF.*$', '', txt)
        (TMP / f'{clau}.txt').write_text(txt, encoding='utf-8')
        print(f'{clau}: {len(txt)} caràcters → {TMP / (clau + ".txt")}')


def carrega(clau):
    f = TMP / f'{clau}.txt'
    if not f.exists():
        prepara()
    linies = f.read_text(encoding='utf-8').split('\n')
    pos = {}  # número → [línia de l'enunciat, línia de la solució]
    for i, l in enumerate(linies):
        m = re.match(r'^ ?(\d{1,3})\.?—', l)
        if m:
            pos.setdefault(int(m.group(1)), []).append(i)
    return linies, pos


def tros(linies, pos, n, k):
    """k = 0: enunciat; k = 1: solució. Fins al problema següent (màxim 120 línies)."""
    if n not in pos or len(pos[n]) <= k:
        return '(no trobat)'
    i = pos[n][k]
    seg = [p[k] for p in pos.values() if len(p) > k and p[k] > i]
    j = min(min(seg) if seg else i + 80, i + 120)
    return '\n'.join(linies[i:j]).strip()


def figures(clau, n):
    linies, pos = carrega(clau)
    noms = re.findall(r'\[IMG ([^\]]+)\]', tros(linies, pos, n, 0) + tros(linies, pos, n, 1))
    for nom in noms:
        for f in (TMP / clau).rglob(nom):
            print(f)


def main(args):
    if not args or args[0] in ('-h', '--help'):
        print(__doc__)
    elif args[0] == 'prepara':
        prepara()
    elif args[0] == 'figures':
        figures(args[1], int(args[2]))
    else:
        clau = args[0]
        linies, pos = carrega(clau)
        for n in map(int, args[1:]):
            print('#' * 20, clau.upper(), n, 'ENUNCIAT')
            print(tros(linies, pos, n, 0))
            print('-' * 20, 'SOLUCIÓ')
            print(tros(linies, pos, n, 1))
            print()


if __name__ == '__main__':
    main(sys.argv[1:])
