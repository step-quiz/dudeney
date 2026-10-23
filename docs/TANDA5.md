# TANDA 5 — instructions for a cold-start Claude (final batch)

You are a fresh Claude session with no memory of earlier work. This file tells you exactly how to do the
**fifth and last batch** of the Dudeney puzzle website. After it the site will have **50 puzzles**.
Read all of it before touching code.

## 0. Ground truth first

1. Read `docs/STATE.md` **completely** (sections 0–4): user rules, architecture, the recipe for adding a
   puzzle and the pitfalls. Do what §0 "Cold start" says (EPUBs in `src/`, `python3 tools/llibres.py prepara`).
   Where this file and STATE.md disagree, **this file wins for batch 5**.
2. Check the starting point:
   - `git log --oneline -3 origin/main` must show the merge of PR #3 (batch 4).
   - `node tests/motors.test.js` → **174 correct, 0 errors**.
   - `node tools/prova-navegador.js` → **43 enigmes … sense errors** (takes ~3 min; run it in the background).
   If not, stop and tell the user (in Catalan) that batch 4 is not merged.
3. Branch: work on the branch the session names (`claude/…`). If its previous PR is already merged, restart it
   from `origin/main` (`git fetch origin main && git checkout -B <branch> origin/main`).
4. Before writing any code, **confirm the list below with the user in Catalan** (a short numbered list with the
   Catalan titles) and wait for the go-ahead. STATE.md requires it.

## 1. The user (non-negotiable, summary — full list in STATE.md §1)

- David, maths teacher (ESO and Batxillerat) in Catalonia. **Speak Catalan to him.** All student text is Catalan.
- His GitHub knowledge is limited: give numbered, copy-paste steps for anything he must do (usually only:
  open the PR link → **Merge pull request** → **Confirm merge**).
- **You** open the pull request to `main`; he merges it. If the push fails, ZIP fallback (STATE.md §1).
- **Never** write `[skip ci]`, `[ci skip]` or `[cf-pages-skip]` in any commit message (Cloudflare Pages
  would not publish).
- He rests from 23:00 to 07:00; do not ask him for things at night if you can avoid it.
- Do not commit `src/` (the EPUBs). Scratch files go to the session scratchpad, not the repo.
- He may have little token budget left: **commit and push early** (after each 2–3 puzzles), so nothing is lost.

## 2. The batch: 7 puzzles

Ordered from cheapest to most expensive. For each: read the original with `python3 tools/llibres.py am 227`
(and `figures am 227` for the images, which you must redraw as our own SVG), then follow STATE.md §3.

| # | Id (proposal) | Source | Catalan title | Board | What code must verify |
|---|---|---|---|---|---|
| 1 | `nombres-curiosos` | AM 114 Curious Numbers | Nombres curiosos | new small board `entrada` (or reuse the `estripat` answer pattern) | n + 1 and n/2 + 1 squares: the four smallest are 48, 1680, 57 120, 1 940 448 (brute force up to 2·10⁶, and the Pell recurrence) |
| 2 | `galetes` | CP 114 The Tramps and the Biscuits | Els rodamons i les galetes | `entrada` + a step table (each night: biscuits found, 1 to the dog, a quarter eaten) | 1021 is the smallest; brute force; also give the general form 1021 + 1024·k |
| 3 | `soldà` → use `solda` (no accents in ids) | AM 136 The Sultan's Army | L'exèrcit del soldà | `entrada`: student types a number, the board lists all its ways as a sum of two squares | smallest number that is a sum of two squares in exactly 12 ways (check Dudeney's own convention: does he count a² + b² with a ≠ b, unordered, zero allowed?); compute by brute force and compare with his answer; ⚠ if different |
| 4 | `hastings` | AM 129 The Battle of Hastings | La batalla de Hastings | `entrada` with **BigInt** | 61·y² + 1 = x², smallest solution (x = 1 766 319 049, y = 226 153 980): verify with a continued-fraction Pell solver in BigInt; check Dudeney's printed total men digit by digit |
| 5 | `amazones` | AM 316 The Amazons | Les amazones | reuse `reines` (escacs) with "take a queen and drop it elsewhere" moves and a count of unattacked squares | the initial position from the figure; Dudeney's solution leaves 11 unattacked; "only one solution" (moving exactly 3 of the 8 queens): verify exhaustively (C(8,3)·C(64,3) is small). ⚠ He *conjectures* 11 is the max for 8 queens: try an exhaustive or branch-and-bound search (C or JS, with a time limit); if too slow, cite it instead of computing |
| 6 | `presos` | AM 401 Eight Jolly Gaol Birds | Vuit presos i un quadrat màgic | reuse `blocs` (fitxes, sliding pieces, built for AM 219) on a 3×3 grid where every cell communicates as in the plan | BFS over the states: 19 moves is the minimum and the prisoner who never moves is No. 3 (SELECCIO.md). Read the figure carefully: which cells communicate? **Remove the insults** of the original (the "surly" prisoner, etc.) and list the change in `docs/update.md` |
| 7 | `solitari` | AM 227 Central Solitaire | El solitari central | new `solitari` board (fitxes motor: 33-hole English board, centre empty, end with one marble in the centre). A "move" = one or more consecutive jumps by the same marble | Replay Dudeney's 19-move solution and check it. ⚠ Bergholt (1912) did it in 18; Beasley proved 18 is minimal: include an 18-move solution only if you verify it by replay (find it in a reliable source, or by an IDA* search with a time limit); cite the minimality, do not compute it |

Numbering on the board and in texts: use Dudeney's numbering of the holes/cells (he numbers them in the
figure), so his solution can be quoted literally.

## 3. Per-puzzle checklist (do not skip any)

For every puzzle, copy the structure of an existing puzzle of the same type (`js/*/problemes.js`): `id`,
`ordre`, `font {llibre, numero, titolOriginal}`, `titol`, `tipus`, `tauler`, `dificultat`, `enunciat`,
`regla`, `comEsJuga` (3 bullets), `tecles`, `dades`, `pistes` (**exactly 4**, the last almost gives it away),
`solucioDudeney` (faithful Catalan translation), `notaMatematic` (starts with «**Comprovat per ordinador.**»;
⚠ items first), and figures.

1. Translate statement and solution to natural Catalan (old units with `<span class="unitat" data-nota="…">`).
2. Motor functions pure and exported (UMD), so Node can test them; board in `tauler.js` registered on
   `window.Taulers` with `crea`, `figura`, `figuraSolucio`.
3. Nothing judged until complete; illegal moves refused with a concrete Catalan reason; success message states
   the computed facts (e.g. «Dinou moviments, el mínim.»).
4. Solution only visible with `?sol=1`. Check it: open `enigma.html?p=<id>` (hidden) and `?p=<id>&sol=1`.
5. Print sheet: add an entry to `PAPER` in `js/imprimir.js` (a Catalan `regla` for paper; `linia:` for an answer
   line; `figura: {...}` if the figure needs options).
6. Tests in `tests/motors.test.js`: add a `suite('Tanda 5')` block; update the count `eq('43 enigmes' …)` → 50.
   Note: `eq` compares with `===`; for arrays use `JSON.stringify` (see the `eqJ` helper in the Tanda 4 block).
7. Docs: `docs/DISCREPANCIES.md` (Tanda 5 paragraph + table), `docs/update.md` (Catalan, Tanda 5 table of odd
   phrases: prison insults, "tramps", "Sultan", the 1066 battle…), `docs/SELECCIO.md` (Tanda 5 row: feta;
   "La resta (0)"), `docs/STATE.md` (§0 step 1 counts, §4 status table: batch 4 merged PR #3, batch 5 delivered),
   `README.md` (50 enigmes, number of test checks).

## 4. Closing sequence (in this order)

```
python3 tools/versio.py && python3 tools/versio.py --comprova     # cache-busting ?v= in all pages
node tests/motors.test.js                                          # all green
node tools/prova-navegador.js --captures                           # 50 enigmes, 4 views each, no errors; look at the new captures
node tools/genera-pdf.js && python3 tools/comprova-pdf.py          # PDFs regenerated, no colour pixels
```

Then open the new pages of `imprimir/enigmes.pdf` and `solucions.pdf` as images (`pdftoppm -r 60 -png`) and
check nothing overflows the A4 page. Commit (message ends with the attribution lines the session gives you; no
model names; no skip-ci tags), push, open the PR to `main` titled «Tanda 5: els set últims enigmes (50 en total)».

## 5. Final message to the user (Catalan)

Short: the PR link, the list of 7 puzzles, the ⚠ discrepancies found, what he should review in
`docs/update.md`, the three merge steps, and that with this batch the selection of 50 is complete. Be honest
about anything not verified (e.g. "la minimalitat de 18 al solitari es cita, no s'ha calculat").
