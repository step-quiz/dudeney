# Els enigmes de Dudeney

Trencaclosques de **Henry E. Dudeney** (1857–1930), traduïts al català i fets interactius, per jugar a la pantalla
o en paper. Web: <https://dudeney.step-quiz.net>.

**Ara:** els 50 enigmes de la selecció (la mostra de 14, dos de cada tipus, i cinc tandes, de 6, 7, 8, 8 i 7) de dissecció, fitxes, mesures i
travesses, escacs, camins, quadrats màgics i aritmètica. La selecció completa de 50 és a
[`docs/SELECCIO.md`](docs/SELECCIO.md); l'estat de la feina, a [`docs/STATE.md`](docs/STATE.md).

Les solucions de Dudeney i les notes del matemàtic només es veuen al web amb `?sol=1` a l'adreça
(per exemple, `index.html?sol=1`).

## Què hi ha

- `index.html` — la portada: capítols per tipus, filtres i el progrés.
- `enigma.html?p=<id>` — cada enigma: enunciat, tauler interactiu (ratolí, dit i teclat), pistes d'una en una,
  la solució de Dudeney (amb «Mira-la al tauler») i una nota del matemàtic.
- `imprimir/enigmes.html` i `.pdf` — un full A4 per enigma, en blanc i negre; `imprimir/solucions.html` i `.pdf`.
- `js/<tipus>/motor.js` (regles pures, sense DOM), `problemes.js` (textos), `tauler.js` (dibuix i interacció).

## Proves

```bash
node tests/motors.test.js        # torna a calcular tot el que diu Dudeney (203 comprovacions)
node tools/prova-navegador.js    # totes les pàgines al navegador: mòbil, ordinador, clar i fosc
node tools/genera-pdf.js         # torna a fer els dos PDF (cal Playwright amb Chromium)
python3 tools/comprova-pdf.py    # que els PDF no tinguin cap color
python3 tools/versio.py          # posa al dia els ?v= dels CSS i JS
python3 tools/llibres.py am 216  # el text original d'un problema (cal tenir els EPUB a src/)
```

Les discrepàncies trobades amb Dudeney són a [`docs/DISCREPANCIES.md`](docs/DISCREPANCIES.md).

## Crèdits i llicència

Problemes de Henry E. Dudeney, d'obres de domini públic: *The Canterbury Puzzles* (1907) i *Amusements in
Mathematics* (1917); text original consultat a Project Gutenberg. Traducció, adaptació, figures i versió
interactiva: David Arso Civil, Departament de Matemàtiques de l'INS Miquel Tarradell. Contingut sota
CC BY-NC-SA 4.0; codi sota llicència MIT; lletra Source Serif 4 sota SIL OFL 1.1 (`fonts/`).
