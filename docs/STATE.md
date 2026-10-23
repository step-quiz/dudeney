# STATE — dudeney (handover for a cold-start agent)

Static vanilla-JS site with Henry E. Dudeney's puzzles translated into Catalan, playable on screen and printable
in B/W. Target: 50 puzzles (`docs/SELECCIO.md`); the user approved the selection on 2026-10-23. Delivered so far:
sample v1 with 14 puzzles (2 per type), shipped as `dudeney-mostra-v1.zip`; batch 1 (6 puzzles, 20 in total),
shipped as `dudeney-tanda1.zip`. Work now proceeds in batches of 6–8
puzzles; each batch ends with a ZIP and waits for the user's review.

## 0. Cold start (do this first)

1. Clone `step-quiz/dudeney` and check that this file lists batch 1 as delivered and that
   `node tests/motors.test.js` reports 75 checks, 0 errors (~15 s). If not, the user has not uploaded
   `dudeney-tanda1.zip` yet: ask them to (see §1 for the upload flow).
2. Get the source books (public domain; never commit them, `src/` is git-ignored). Download the **EPUB with
   images** of each book from Project Gutenberg and save it with exactly this name:
   - `src/amusements-in-mathematics-1917.epub` ← <https://www.gutenberg.org/ebooks/16713>
   - `src/canterbury-puzzles-1907.epub` ← <https://www.gutenberg.org/ebooks/27635>
   If the sandbox cannot reach gutenberg.org (network allowlist), ask the user to attach both EPUBs.
3. `python3 tools/llibres.py prepara` unzips them to `tmp/llibres/` (git-ignored) and builds plain text
   (PG header/footer stripped). Then `python3 tools/llibres.py am 249` prints statement + solution of AM 249,
   and `python3 tools/llibres.py figures am 249` prints the paths of its images (open them with the image
   viewer to redraw the figure as our own SVG).
4. Tooling available in the sandbox: Node 22, Python 3 + Pillow, poppler (`pdftoppm`), Playwright with Chromium
   (`require('playwright')`, fallback `/opt/node22/lib/node_modules/playwright`; never run `playwright install`).
   All page tests use `file://`; no server is needed.
5. Read `docs/SELECCIO.md` (the 50 puzzles and what code must verify), `docs/DISCREPANCIES.md`,
   `docs/update.md`, then one complete puzzle object per board type in `js/*/problemes.js` as a style model.

## 1. User rules (non-negotiable)

- Talk to the user (David, maths teacher, Catalonia) **in Catalan**. All student-facing text is Catalan.
  Markdown documents addressed to an AI (this file): English, technical.
- Delivery = a ZIP whose root is the repo root (no wrapping folder). The user uploads it to `_uploads/`;
  `.github/workflows/unzip-upload.yml` extracts it and commits. Exclude `src/`, `.git/`, `.github/`, `_uploads/`.
  Give numbered, copy-paste steps for anything the user must do on GitHub.
- The session has **no push access** to `step-quiz/dudeney` (proxy 403); commit locally only (branch
  `mostra-14`), never claim a push happened. Never use `[skip ci]`, `[ci skip]`, `[cf-pages-skip]`.
- Legal: only Dudeney's public-domain books (*The Canterbury Puzzles* 1907 = `cp`, *Amusements in
  Mathematics* 1917 = `am`). EPUBs live in `src/` (git-ignored, never shipped). Do not redistribute Project
  Gutenberg files or use the PG trademark; «text original consultat a Project Gutenberg» in credits is fine.
  All figures are redrawn as our own SVG. Credits line on every page (see footer of `enigma.html`).
- Agreed product decisions: Catalan title + original title; old units kept with a tooltip note
  (`<span class="unitat" data-nota="…">`); free play (no scores); progress in localStorage (try/catch);
  `?p=<id>` deep links; «Com es juga?» folded; nothing is judged until the board is complete (illegal single
  moves are refused with a concrete reason); success messages state the computed facts.
- **Solutions are hidden** on the website unless the URL carries `?sol=1` (decision 2026-10-23):
  `Comu.ambSolucions()` gates the «La solució de Dudeney» and «Nota del matemàtic» panels, the
  `imprimir/solucions.html` page and the links to it (`.nomes-amb-solucions`); `Comu.propagaSolucions()`
  appends `sol=1` to internal links. The data stays in the JS (visible in the source: accepted by the user).
  `imprimir/solucions.pdf` is still a public static file (only unlinked) — the user has been told.
- Keep `docs/update.md` (Catalan) up to date: every phrase/situation that may sound odd to a 2026 teenager
  (units, wine/ale, «ladies first», old card names…), with a proposal. Nothing is changed until the user decides.
- Every Dudeney claim is re-verified by code (`tests/motors.test.js`). Disagreements go to
  `docs/DISCREPANCIES.md` and to the puzzle's «nota del matemàtic» (prefixed ⚠).

## 2. Architecture

- No build, no modules: classic `defer` scripts with the UMD pattern
  `(function (arrel, fabrica) {…module.exports || arrel.X…})(typeof self !== 'undefined' ? self : this, …)`;
  works under `file://`. CSP in `_headers` (no inline scripts/styles; CSSOM `el.style.x = …` is allowed).
- Load order (same in `index.html`, `enigma.html`, `imprimir/*.html` with `../`): `js/comu/comu.js`,
  `js/comu/registre.js`, `js/comu/cerca.js`, `js/comu/fraccio.js`, 7 × `js/<tipus>/motor.js`,
  7 × `js/<tipus>/problemes.js`, 7 × `js/<tipus>/tauler.js`, then the page controller
  (`js/enigma.js` | `js/portada.js` | `js/imprimir.js`).
- Types (`Comu.ORDRE_TIPUS`): `disseccio`, `fitxes`, `mesures`, `escacs`, `camins`, `quadrats`, `aritmetica`.
  Colours in `css/tokens.css` (`--c-<tipus>`, light + dark), set per element with `data-tipus`.
- `js/<tipus>/motor.js`: pure rules + solvers, no DOM (globals `MotorDisseccio`, `MotorFitxes`, `MotorMesurar`,
  `MotorEscacs`, `MotorCamins`, `MotorQuadrats`, `MotorAritmetica`; shared `Cerca.bfs`, `Fraccio`).
- `js/<tipus>/problemes.js`: an array of puzzle objects pushed to `window.DUDENEY` (exported in Node):
  `{ id, ordre, font: { llibre, numero, titolOriginal }, titol, tipus, tauler, dificultat (1–3), enunciat: [HTML],
  regla (HTML), comEsJuga: [HTML], tecles (HTML), dades: {…board-specific…}, pistes: [4 × HTML],
  solucioDudeney: [HTML], notaMatematic: [HTML], extra?: { pregunta, resposta (number | number[]), be, malament },
  figuraEnunciat?: { …figure options, peu, despres }, posicioFiguraSolucio? }`.
  Paragraphs with `class="pantalla"` explain on-screen adaptations (removed in print).
- `js/<tipus>/tauler.js`: registers `window.Taulers[<tauler>] = { crea(lloc, p, ctx) → { reinicia(), desfes?(),
  solucio?(), textSolucio? }, figura(p, opcions) → SVG/HTML, figuraSolucio?(p) → <figure> }`.
  `ctx` (from `js/enigma.js`): `missatge(tipus, titol, frases, boto)`, `amaga()`, `estat(nodes|text)`,
  `desfes(bool)`, `resolt(titol, frases, extraElement?)` (marks solved, shows «Enigma següent»; appends
  `p.extra` question if no element given).
- Existing boards: `quadricula`, `lliure` (disseccio); `piles`, `salts` (fitxes); `gerres`, `barca` (mesures);
  `reines`, `cavalls` (escacs); `carter`, `hamilton` (camins); `magic`, `cartes` (quadrats); `estripat`, `caixa`
  (aritmetica). Board options added in batch 1 (all optional, defaults = sample behaviour):
  - `salts`: `salt` (max frogs jumped), `colors` {frog: 'blanca'|'negra'}, `inicial`, `objectiu` (colour string,
    e.g. 'nnnbbb_'), `minim`, `solucio` [[from, to], …] 1-based, `resumSolucio`, `final` + `peuFinal` (print).
  - `gerres`: capacity `Infinity` = a person (second row, only receives; engine motiu 'persona'); `formes`
    'barril'|'gerra'|'mesura'|'persona'; `articles`, `liquid` ('llimonada' → `.llimonada` colours), `escala`,
    `escalaPersona`, `nomPassos`, `textResolt`, `textFinal`.
  - `reines`: `peca` ('peo'), `nombre`, `atacs:false` (only collinear trios), `fixes` (immovable, drawn black),
    `solucio`/`inicial` as square lists when `peca` ≠ 'reina', `etiquetaFigura`.
  - `cavalls`: `peca` ('alfil', blocking diagonals via `MotorEscacs.estatPeces`), `protegits:false`, `vinyeta`
    (plate figure when no `exemple`; never use solution squares), `etiquetes`, `titolSolucio`, `resumSolucio`.
  - `carter`: `estil` 'mina', `inici` (fixed start), `textos` {punt, tram, trams, unitat, etiqueta, final, peu,
    comenca, noVei, resolt, visitat}; figure option `inici:true` highlights the start.
  - Plates on `index.html` call `figura(p, { cavalls: 'exemple', vinyeta: true })` for every puzzle: a new board
    must not show the solution there.
- Interaction triad everywhere: drag (`Comu.arrossega`, Pointer Events, 6 px threshold), tap-tap, keyboard.
  `Comu.historial` for undo, `Comu.reprodueix` for solution replay.
- Print: `imprimir/enigmes.html` (cover + one fixed A4 `.full` per puzzle: statement, figure, paper rule from
  `PAPER[id]` in `js/imprimir.js`, optional empty table, workspace) and `imprimir/solucions.html` (flowing pages,
  needs `?sol=1`). `css/imprimir.css` maps every colour token to black/white/grey. `node tools/genera-pdf.js`
  builds both PDFs (fails on JS errors or on a `.full` that overflows). Check: no colour pixels (PIL, max−min>12).
- `python3 tools/versio.py` rewrites the `?v=` cache-busters (root and `imprimir/` HTML); `--comprova` in CI.

## 3. Recipe: adding a puzzle

1. Extract the text: `python3 tools/llibres.py am <n>`; images: `python3 tools/llibres.py figures am <n>`.
2. Verify every claim in a scratch script (outside the repo) with the motor; extend the motor if needed (keep it
   pure). Go beyond Dudeney when cheap: count all solutions, check uniqueness, variants (it feeds the note).
   Facts about the wider maths world (history, open problems) are web-checked before being written.
3. Add the object to `js/<tipus>/problemes.js` (own concise translation; story kept; neutralise drinks/insults
   per `SELECCIO.md`; hints: 4 steps from gentle to almost-solution; `notaMatematic` with ⚠ for discrepancies,
   only verified facts).
4. Reuse a board (add options to `dades`) or write a new one with `crea` + `figura` (+ `figuraSolucio`).
5. Add a `PAPER[id]` entry in `js/imprimir.js`; add tests to `tests/motors.test.js`; update `docs/update.md`,
   `docs/DISCREPANCIES.md`, `docs/SELECCIO.md` (status), README count.
6. Run, in this order: `python3 tools/versio.py` → `node tests/motors.test.js` → `node tools/prova-navegador.js`
   (every page, 360/1366 px, light/dark, no JS errors, no horizontal scroll, no solution visible without
   `?sol=1`; `--captures` saves screenshots to `tmp/captures/` — look at the new boards) → also solve each new
   puzzle in Playwright with Dudeney's moves and read the success message → `node tools/genera-pdf.js` (fails on
   overflow) → `python3 tools/comprova-pdf.py` (no colour pixels) → look at the new PDF pages (pdftoppm).
7. Commit locally; build the ZIP from tracked files:
   `git ls-files | grep -v -E '^(\.github/|_uploads/|src/)' | zip -q -X ../dudeney-tandaN.zip -@`;
   send it with numbered copy-paste upload steps (in Catalan).

## 3b. Pitfalls learnt the hard way

- Puzzle `id`s are short Catalan words (`bol`, `mina`, `peons`), not `am-362`; `ordre` sorts within a type —
  renumber neighbours when inserting (book order is the default).
- Boards that read pointer coordinates (chess `casellaDe`) ignore synthetic `dispatchEvent` clicks: use
  `page.click()`. Pages with `figuraEnunciat` contain a second copy of the board's SVG classes: scope test
  selectors to `#tauler-wrap`.
- Never write scratch files (screenshots!) with relative paths while cwd is the repo.
- Liquid/scale transitions animate on load if layout is forced before the first state is set: set the initial
  transform when the element is created.
- Print CSS forces `.punt .marca` white: any new label drawn white-on-colour needs a print override.
- `imprimir.js` has per-board special cases (e.g. `salts` final figure via `dades.final`); check the solutions
  PDF page of every new puzzle.
- Catalan typography: apostrophe `’`, quotes «», thin space only for numbers > 4 digits (`Comu.nombre`).

## 4. Status

| Batch | Puzzles | State |
|---|---|---|
| Sample v1 | cp-26, am-174, cp-1, am-214, am-365, am-373, am-300, am-319, am-242, am-243, am-399, am-304, am-113, cp-75 | delivered |
| Batch 1 | am-216 `granotes-gots`, am-362 `bol`, am-297 `alfils`, am-298 `alfils-protegits`, am-317 `peons`, am-247 `mina` | delivered (awaiting review) |
| Batch 2 | proposal: am-217, am-219, am-341, am-375 (neutralise «jealous husbands»), am-377, am-249 (sailor), am-320 | next — confirm the list with the user first |
| Remaining | see `docs/SELECCIO.md` | pending |

Known open points: `tests/motors.test.js` takes ~15 s (exhaustive bishop searches); 249 (sailor) postponed (curved
routes need careful transcription); `imprimir/solucions.pdf` is publicly reachable if its URL is known; the boat board has a
compact two-row layout under 520 px; `docs/update.md` proposals await the user's decisions.
