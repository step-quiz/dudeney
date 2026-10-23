# Selecció de problemes (v1)

Proposta de **50 problemes** de Henry E. Dudeney per a la v1 de `dudeney.step-quiz.net`. Fonts, totes dues de
domini públic (Dudeney va morir el 1930):

- **CP** = *The Canterbury Puzzles and Other Curious Problems* (Thomas Nelson and Sons, 1907)
- **AM** = *Amusements in Mathematics* (Thomas Nelson and Sons, 1917)

El número és el del problema al llibre (comprovat al text). Criteris (SPEC §13.2): la solució es pot comprovar amb
codi; hi ha una idea matemàtica que mereix una nota; és adequat per a l’aula avui; un alumne fort de batxillerat o
un professor el pot resoldre en una sessió.

**Decisions ja preses amb tu (2026-10-23):** títol en català amb l’original entre parèntesis; les unitats antigues
es mantenen quan importen, amb una nota («1 xíling = 12 penics»); només els dos llibres de 1907 i 1917.

Llegenda de la columna «Què comprova el codi»: el que diu Dudeney (el mínim, el nombre de solucions…) es torna a
calcular. Si el codi no ho pot confirmar o Dudeney s’equivoca, va a `docs/DISCREPANCIES.md` i a la «nota del
matemàtic» (marcat amb ⚠).

## 1. Dissecció (7) — peces que es mouen, giren i s’ajunten

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `cp-26` | CP 26 | The Haberdasher’s Puzzle | El trencaclosques del mercer | 3 | El triangle equilàter que es converteix en quadrat amb 4 peces; amb **mode articulat** (les peces fan una cadena) | Les 4 peces cobreixen el quadrat (mostreig 200 × 200) |
| `am-143` | AM 143 | Two Crosses from One | Dues creus d’una | 3 | Una creu grega en dues amb 5 peces; Pitàgores amagat | Cobertura de les dues creus |
| `am-146` | AM 146 | An Easy Dissection Puzzle | Una dissecció fàcil | 1 | 4 peces iguals; bon escalfament | Cobertura i que les 4 peces són congruents |
| `am-147` | AM 147 | An Easy Square Puzzle | Un quadrat fàcil | 1 | 5 mitges rajoles fan un quadrat (√5) | Cobertura |
| `am-150` | AM 150 | Dissecting a Mitre | La mitra | 3 | 5 peces; Dudeney desmunta una «solució» falsa de 4 (el principi de l’escala) | Cobertura; la de 4 peces dona un rectangle, no un quadrat |
| `am-151` | AM 151 | The Joiner’s Problem | El problema del fuster | 2 | 3 peces, sense malbaratar fusta | Cobertura |
| `am-174` | AM 174 | The Squares of Brocade | Els quadrats de brocat | 2 | Dos quadrats en un, tallant pel quadriculat i amb el dibuix encaixat: Pitàgores amb peces | Cobertura i que el quadriculat (els colors) encaixa |

## 2. Fitxes (9) — moure o saltar fitxes

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `cp-1` | CP 1 | The Reve’s Puzzle | Els formatges de l’administrador | 3 | La torre de Hanoi amb **4** tamborets: 8 formatges en 33 moviments. Fórmula de Frame–Stewart; demostrat òptim per a 4 piles el 2014 (Bousch) | BFS: 33 és el mínim (8 formatges) |
| `am-214` | AM 214 | The Six Frogs | Les sis granotes | 2 | Invertir l’ordre; fórmula general de Dudeney | BFS: 21 és el mínim; la fórmula per a n granotes |
| `am-216` | AM 216 | The Educated Frogs | Les granotes ensinistrades | 2 | Salts de fins a dues granotes | BFS: 10 salts és el mínim |
| `am-217` | AM 217 | The Twickenham Puzzle | El trencaclosques de Twickenham | 2 | Fitxes en cercle que formen una paraula | BFS: 26 és el mínim |
| `am-219` | AM 219 | The Letter Block Puzzle | Les lletres a la capsa | 2 | Parent del «15»: paritat de permutacions | BFS: 23 és el mínim |
| `am-221` | AM 221 | The Eight Engines | Les vuit locomotores | 3 | Una locomotora no es pot moure: quina? | BFS: 17 moviments i quina queda quieta |
| `am-227` | AM 227 | Central Solitaire | El solitari central | 3 | ⚠ Dudeney: 19 moviments i «no crec que es pugui millorar». Bergholt (1912) ho va fer en 18, i Beasley (1964) va demostrar que 18 és el mínim | Les dues solucions (19 i 18) són vàlides; la minimalitat de 18 es cita, no es calcula |
| `am-341` | AM 341 | The Four Frogs | Les quatre granotes | 2 | El problema de Guarini (1512) i el mètode dels «botons i fils» de Dudeney | BFS: 7 jugades i 16 moviments |
| `am-401` | AM 401 | Eight Jolly Gaol Birds | Vuit presos i un quadrat màgic | 3 | Moure peces fins a fer un quadrat màgic, amb un pres que no es mou (es treuen els insults de l’original) | BFS: 19 és el mínim i el pres quiet és el 3 |

## 3. Mesures i travesses (5) — gerres, barques i politges

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `am-362` | AM 362 | The Wassail Bowl | El bol de la festa | 2 | Repartir amb gerres de 5 i 3 pintes. **Es neutralitza:** cervesa → llimonada | BFS: 11 manipulacions |
| `am-365` | AM 365 | New Measuring Puzzle | Un nou problema de mesures | 2 | Dues gerres de 10, mesures de 5 i 4 | BFS: 11 manipulacions |
| `am-373` | AM 373 | Crossing the Stream | Travessant el rierol | 1 | Pesos a la barca (i un gos) | BFS: 11 travesses |
| `am-375` | AM 375 | Five Jealous Husbands | Cinc entrenadors i una barca | 3 | El problema d’Alcuí (s. VIII), barca de 3. **Es neutralitza:** «marits gelosos» → cinc entrenadors que no deixen la seva estrella amb un altre entrenador (la mateixa regla i la mateixa matemàtica) | BFS: 11 travesses |
| `am-377` | AM 377 | Stealing the Castle Treasure | El tresor del castell | 2 | Politja amb dues cistelles i una diferència de pes màxima | BFS: 11 manipulacions |

## 4. Escacs (6) — posar peces al tauler

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `am-297` | AM 297 | Bishops—Unguarded | Alfils sense protecció | 1 | Dominar el tauler; els dos colors són independents | Cerca: 8 és el mínim |
| `am-298` | AM 298 | Bishops—Guarded | Alfils protegits | 2 | El mateix, però tots protegits | Cerca: 10 és el mínim |
| `am-300` | AM 300 | The Eight Queens | Les vuit reines | 2 | 92 solucions, 12 de fonamentals; i l’única sense tres reines en línia | Cerca: 92, 12 i la unicitat |
| `am-316` | AM 316 | The Amazons | Les amazones | 3 | ⚠ Dudeney conjectura, sense demostració, que 11 caselles lliures és el màxim: ho intentarem confirmar per ordinador | La solució; el màxim, si la cerca és prou ràpida (si no, es cita) |
| `am-317` | AM 317 | A Puzzle with Pawns | Peons sense tres en línia | 3 | El problema «no-three-in-line», encara obert per a taulers grans | La solució: cap trio alineat en cap direcció |
| `am-319` | AM 319 | The Knight-Guards | Els cavalls guardians | 3 | 14 cavalls protegits; la demostració de Dudeney separant els colors | Cerca: 14 és el mínim i hi ha 3 solucions fonamentals |

## 5. Camins (6) — recorreguts per un graf

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `am-242` | AM 242 | The Tube Inspector’s Puzzle | L’inspector del metro | 2 | El «problema del carter xinès» abans que tingués nom | 19 milles és el mínim |
| `am-243` | AM 243 | Visiting the Towns | Visitant les ciutats | 1 | Un cicle de Hamilton que és únic | La ruta és l’única |
| `am-245` | AM 245 | The Fly on the Octahedron | La mosca a l’octàedre | 3 | Comptar circuits d’Euler: 1488 | Recompte: 1488 |
| `am-247` | AM 247 | Inspecting a Mine | Inspeccionant una mina | 2 | Vèrtexs senars i camins repetits | 36 furlongs és el mínim |
| `am-249` | AM 249 | The Sailor’s Puzzle | El trencaclosques del mariner | 2 | Cicles de Hamilton amb una condició (visitar C com més tard millor) | Hi ha exactament 4 rutes |
| `am-320` | AM 320 | The Rook’s Tour | La volta de la torre | 2 | Visitar totes les caselles amb el mínim de jugades | La solució de 16; ⚠ que 16 és el mínim, si la cerca és viable |

## 6. Quadrats màgics (6) — omplir una quadrícula

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `am-304` | AM 304 | Bachet’s Square | El quadrat de Bachet | 2 | Quadrats llatins ortogonals (grecollatins) amb cartes; Dudeney corregeix Labosne | Recompte: 1152 |
| `am-399` | AM 399 | The Troublesome Eight | El vuit rebel | 1 | El truc: «nombre» no vol dir «enter» | La solució (amb fraccions) |
| `am-406` | AM 406 | The Eighteen Dominoes | Les divuit fitxes de dòmino | 2 | Quadrat màgic 6 × 6 amb dòminos, suma 18 | La solució |
| `am-409` | AM 409 | The Baskets of Plums | Les cistelles de prunes | 2 | Quadrat màgic de nombres primers (i el parany de l’enunciat) | La constant mínima i la solució |
| `am-411` | AM 411 | A Magic Square of Composites | Un quadrat màgic de compostos | 2 | Nou compostos consecutius: el primer forat de 10 entre primers | Que és el més petit |
| `cp-102` | CP 102 | A Reversible Magic Square | Un quadrat màgic reversible | 2 | Continua sent màgic cap per avall | La solució, en tots dos sentits |

## 7. Aritmètica (11) — una resposta numèrica

| Id | Font | Títol original | Títol proposat | Dif. | Per què | Què comprova el codi |
|---|---|---|---|---|---|---|
| `am-83` | AM 83 | Digital Multiplication | Multiplicació amb les nou xifres | 2 | Cerca exhaustiva | Les solucions mínima (4002) i màxima (5886) |
| `am-90` | AM 90 | The Century Puzzle | El problema del cent | 2 | Lucas en va trobar 7; Dudeney diu que n’hi ha 11 | Recompte: 11 |
| `am-113` | AM 113 | The Torn Number | El número estripat | 1 | 3025 = (30 + 25)², 9801 = (98 + 01)²… i **2025** = (20 + 25)² | Les solucions de 4 xifres |
| `am-114` | AM 114 | Curious Numbers | Nombres curiosos | 2 | Una equació de Pell disfressada | 48, 1680, 57 120, 1 940 448 són els primers |
| `am-129` | AM 129 | The Battle of Hastings | La batalla de Hastings | 3 | L’equació de Pell x² − 61y² = 1 (Fermat) | La solució mínima, amb enters grans (BigInt) |
| `am-133` | AM 133 | The Five Brigands | Els cinc bandolers | 2 | Un problema de Tartaglia | Recompte: 6627 |
| `am-136` | AM 136 | The Sultan’s Army | L’exèrcit del soldà | 3 | Sumes de dos quadrats i primers 4n + 1 | El nombre més petit amb 12 maneres |
| `am-347` | AM 347 | Counting the Rectangles | Comptant rectangles | 1 | 1296 = 36²: el quadrat d’un nombre triangular | 1296 i 204 |
| `cp-38` | CP 38 | The Amulet | L’amulet | 1 | Camins en una graella: 2¹⁰ | Recompte: 1024 |
| `cp-75` | CP 75 | The Spider and the Fly | L’aranya i la mosca | 3 | El camí més curt passa per cinc parets: desplegar la capsa | 40 peus és el mínim |
| `cp-114` | CP 114 | The Tramps and the Biscuits | Els rodamons i les galetes | 2 | Parent del problema dels mariners i els cocos | 1021 és el mínim |

Per tipus: dissecció 7, fitxes 9, mesures 5, escacs 6, camins 6, quadrats 6, aritmètica 11 → **50** (7 tipus; el
SPEC en demana com a mínim 6).

## Reserva (si en vols canviar algun)

AM 6 (A Charitable Bequest), AM 79 (The Lockers Puzzle), AM 118 (Circling the Squares), AM 182 (The Garden Puzzle,
Brahmagupta), AM 220 (A Lodging-House Difficulty), AM 229 (The Nine Almonds), AM 261 (The Monk and the Bridges),
AM 405 (Card Magic Squares), AM 313 (Queens and Bishop Puzzle), AM 328 (The Queen’s Tour), AM 339 (The Four
Knights’ Tours), CP 3 (The Miller’s Puzzle), CP 13 (The Man of Law’s Puzzle), CP 61 (The Silver Cubes), CP 94
(Foxes and Geese), CP 111 (The Farmer’s Oxen).

## Descartats expressament

- **CP 80** (The Chinese Railways): la solució original té llenguatge racista.
- **AM 25** (Chinese Money), **AM 139** (The Dutchmen’s Wives), **CP 84** (The Japanese Ladies and the Carpet),
  **AM 107–108** (The Suffragists’ Meeting, The Leap-Year Ladies): estereotips de l’època.
- Els que no es poden comprovar amb codi (endevinalles de paraules, trucs verbals, mecànics: AM 251, AM 364,
  CP 5, CP 58…).

## Estat

| Pas | Estat |
|---|---|
| Proposta | 2026-10-23 |
| Aprovada per l’usuari | 2026-10-23 |
| Mostra (14, dos per tipus) | feta: cp-26, am-174, cp-1, am-214, am-365, am-373, am-300, am-319, am-242, am-243, am-399, am-304, am-113, cp-75 |
| Tanda 1 (6) | feta: am-216, am-362, am-297, am-298, am-317, am-247 |
| Tanda 2 (7) | feta: am-217, am-219, am-341, am-375, am-377, am-249, am-320 |
| Tanda 3 (8) | feta: am-146, am-147, am-151, am-221, am-245, am-406, am-347, cp-38 |
| Tanda 4 (8) | feta: am-143, am-150, am-90, am-83, am-133, am-409, am-411, cp-102 |
| La resta (7) | pendent |
