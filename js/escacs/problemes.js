/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/escacs/problemes.js
 * ROL: Els enigmes d'escacs: els alfils (AM 297 i 298), les vuit reines
 *   (AM 300), els peons sense tres en línia (AM 317) i els cavalls guardians
 *   (AM 319). Enunciat, pistes i solució de Dudeney traduïts i adaptats; la
 *   nota del matemàtic és nostra.
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js). Una casella és
 *   [fila, columna], amb la fila 0 a dalt (com als diagrames de Dudeney).
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'alfils',
        ordre: 1,
        font: { llibre: 'am', numero: 297, titolOriginal: 'Bishops—Unguarded' },
        titol: 'Alfils sense protecció',
        tipus: 'escacs',
        tauler: 'cavalls',
        dificultat: 1,
        enunciat: [
            '<p>Posa tan pocs alfils com puguis en un tauler d’escacs normal, de manera que totes les caselles del tauler quedin ocupades o atacades.</p>',
            '<p>Fixa’t que la torre té més abast que l’alfil: la posis on la posis, sempre ataca catorze caselles, mentre que l’alfil n’ataca set, nou, onze o tretze, segons la diagonal en què sigui. I convé dir ara que, quan parlem de «diagonals» en un tauler d’escacs, no ens referim només a les dues diagonals llargues, de racó a racó, sinó també a totes les línies més curtes paral·leles a aquestes. Per evitar malentesos més endavant, val la pena que el lector ho tingui ben present.</p>',
            '<p class="pantalla">Com en una partida, un alfil no pot atacar a través d’una altra peça: la seva diagonal s’atura a la primera que troba.</p>',
        ],
        regla: 'Que totes les caselles quedin <strong>ocupades o atacades</strong>, amb el mínim d’alfils.',
        comEsJuga: [
            'Toca una casella per posar-hi un alfil, o toca un alfil per treure’l.',
            'Les caselles atacades per algun alfil porten un punt; les que no estan ni ocupades ni atacades queden lliures.',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> posa o treu un alfil.',
        dades: {
            peca: 'alfil',
            mida: 8,
            minim: 8,
            protegits: false,
            vinyeta: [[3, 3]],
            solucio: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7]],
            etiquetes: { vinyeta: 'Un alfil a d5 i les tretze caselles que ataca', solucio: 'Vuit alfils en una fila: totes les caselles cobertes' },
            titolSolucio: 'La solució de Dudeney',
            resumSolucio: 'Vuit alfils en una fila: totes les caselles cobertes, però cap alfil protegit.',
        },
        pistes: [
            'Un alfil no canvia mai de color: el que és en una casella blanca només ataca caselles blanques. Pots resoldre el problema per a cada color per separat.',
            'Un alfil al centre ataca tretze caselles, i un al racó, només set. Però no n’hi ha prou que n’ataquin moltes: també cal que no ataquin totes les mateixes.',
            'Les caselles de les vores són les més difícils de cobrir. Per a les caselles blanques, n’hi ha prou amb quatre alfils.',
            'Prova de posar els vuit alfils en una mateixa fila del mig del tauler.',
        ],
        solucioDudeney: [
            '<p>No es pot fer amb menys de vuit alfils, i la solució més senzilla és posar-los en fila a la quarta o a la cinquena fila del tauler (mira la figura). Però fixa’t que aquí cap alfil no està protegit per cap altre: és el que estudiarem en el problema següent.</p>',
        ],
        notaMatematic: [
            '<p><strong>Dos problemes en un.</strong> Les caselles blanques i les negres no es toquen mai en diagonal, i per tant els alfils blancs i els negres no s’ajuden gens. Cal cobrir les 32 blanques amb alfils blancs i les 32 negres amb alfils negres.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca de totes les maneres de posar alfils en caselles d’un color confirma que amb tres no es poden cobrir mai les 32 caselles d’aquell color, i que amb quatre sí: hi ha 108 maneres de fer-ho en les blanques i 108 en les negres. Per tant, el mínim és 4 + 4 = 8, i hi ha 108 · 108 = 11 664 maneres de cobrir el tauler amb vuit alfils.</p>',
            '<p><strong>En qualsevol tauler.</strong> En un tauler de <i>n</i> × <i>n</i> caselles calen sempre exactament <i>n</i> alfils: n’hi ha prou posant-los en una fila del mig, com fa Dudeney, i no es pot fer amb menys.</p>',
        ],
    },
    {
        id: 'alfils-protegits',
        ordre: 2,
        font: { llibre: 'am', numero: 298, titolOriginal: 'Bishops—Guarded' },
        titol: 'Alfils protegits',
        tipus: 'escacs',
        tauler: 'cavalls',
        dificultat: 2,
        enunciat: [
            '<p>I ara, quants alfils calen perquè totes les caselles quedin ocupades o atacades, i que, a més, cada alfil estigui protegit per un altre alfil? I com s’han de posar?</p>',
            '<p class="pantalla">Un alfil està protegit si un altre alfil l’ataca. Com en una partida, un alfil no pot atacar a través d’una altra peça.</p>',
        ],
        regla: 'Que totes les caselles quedin <strong>ocupades o atacades</strong> i que <strong>cada alfil</strong> estigui protegit per un altre, amb el mínim d’alfils.',
        comEsJuga: [
            'Toca una casella per posar-hi un alfil, o toca un alfil per treure’l.',
            'Les caselles atacades per algun alfil porten un punt; les que no estan ni ocupades ni atacades queden lliures.',
            'Quan cap casella no queda lliure, el tauler marca els alfils que no estan protegits per cap altre.',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> posa o treu un alfil.',
        dades: {
            peca: 'alfil',
            mida: 8,
            minim: 10,
            vinyeta: [[1, 1], [2, 2]],
            solucio: [[3, 1], [3, 2], [3, 3], [3, 5], [3, 6], [4, 1], [4, 2], [4, 3], [4, 5], [4, 6]],
            etiquetes: { vinyeta: 'Dos alfils que es protegeixen l’un a l’altre', solucio: 'Els deu alfils de Dudeney, tots protegits' },
            titolSolucio: 'La solució de Dudeney',
            resumSolucio: 'Deu alfils, cinc a cada color, i cada un protegit per un altre.',
        },
        pistes: [
            'Com en el problema anterior, pensa cada color per separat: els alfils blancs no poden protegir mai un alfil negre.',
            'Amb quatre alfils d’un color pots cobrir totes les caselles d’aquell color, però no hi ha manera que tots quatre quedin protegits. Quants en calen, doncs?',
            'Dos alfils en caselles veïnes en diagonal es protegeixen l’un a l’altre. Busca parelles així al mig del tauler.',
            'Amb cinc alfils de cada color n’hi ha prou. Prova-ho amb dues fileres de cinc alfils, l’una a sota de l’altra, a les files 4 i 5.',
        ],
        solucioDudeney: [
            '<p>Aquest trencaclosques és força fàcil si primer t’hi pares a pensar una mica. Només cal considerar les caselles d’un color, perquè el que es pugui fer amb les blanques sempre es pot repetir amb les negres, i aquí són del tot independents. Aquesta igualtat és conseqüència, és clar, que el nombre de caselles d’un tauler d’escacs, seixanta-quatre, és parell. Si un tauler quadrat té un nombre senar de caselles, sempre n’hi haurà una més d’un color que de l’altre.</p>',
            '<p>Calen deu alfils perquè totes les caselles quedin atacades i cada alfil estigui protegit per un altre. A la figura hi ha una manera de posar-los. Fixa’t que els dos alfils centrals del grup de sis de l’esquerra no serveixen per a res més que per protegir els alfils de les caselles del costat. Per tant, es pot obtenir una altra solució pujant el de dalt una casella i baixant l’altre una casella.</p>',
        ],
        posicioFiguraSolucio: 2,
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Una cerca de totes les maneres de posar alfils en caselles d’un color confirma que amb quatre no es pot fer (cobrir-les totes i que cada alfil estigui protegit) i que amb cinc sí, de 104 maneres per a cada color. El mínim és, doncs, 5 + 5 = 10. La figura de Dudeney i la seva variant (amb els dos alfils centrals moguts) també s’han comprovat.</p>',
            '<p><strong>Per què protegir costa més.</strong> Un alfil sol no es pot protegir a si mateix: cada alfil necessita un company en una de les seves diagonals. Per això els alfils protegits tendeixen a anar en parelles o en grups, i acaben calent-ne més. En taulers grans, el nombre d’alfils protegits que calen és aproximadament un terç més gran que el d’alfils sense protegir.</p>',
        ],
    },
    {
        id: 'reines',
        ordre: 3,
        font: { llibre: 'am', numero: 300, titolOriginal: 'The Eight Queens' },
        titol: 'Les vuit reines',
        tipus: 'escacs',
        tauler: 'reines',
        dificultat: 2,
        enunciat: [
            '<p>La reina és, de molt, la peça més poderosa del tauler d’escacs. Si la poses en una de les quatre caselles del centre, ataca ni més ni menys que vint-i-set caselles; i si la vols amagar en un racó, encara n’ataca vint-i-una.</p>',
            '<p>Es poden posar vuit reines al tauler de manera que cap no n’ataqui cap altra, i és un trencaclosques antic (el va proposar Nauck el 1850, i ja té tota una petita literatura) trobar de quantes maneres diferents es pot fer. A la figura en mostro una. En total n’hi ha dotze de fonamentalment diferents, que en donen noranta-dues si comptem com a diferents els girs i els reflexos. La de la figura és simètrica: si gires el llibre cap per avall, queda exactament igual. Per això les dotze no en donen noranta-sis, com passaria si cap no fos simètrica, sinó noranta-dues.</p>',
            '<p>Sabries posar les vuit reines al tauler de manera que cap no n’ataqui cap altra i que no n’hi hagi mai tres en línia recta en cap direcció obliqua? Una altra ullada a la figura mostra que aquesta col·locació no compleix les condicions, perquè en les dues direccions marcades amb línies de punts hi ha tres reines en línia recta. Només una de les dotze maneres fonamentals resol el trencaclosques. Sabries trobar-la?</p>',
            '<p class="pantalla">Al tauler hi ha la col·locació de la figura de Dudeney, amb les dues línies de punts. Mou-hi les reines.</p>',
        ],
        regla: 'Mou les reines: que <strong>cap no n’ataqui cap altra</strong> i que <strong>no n’hi hagi tres en línia</strong> en cap direcció.',
        comEsJuga: [
            'Arrossega una reina a una altra casella, o toca-la i després toca la casella on la vols.',
            'Si toques una casella buida i al tauler hi ha menys de vuit reines, n’hi poses una. Per treure’n una, toca-la dues vegades o arrossega-la fora del tauler.',
            'Quan hi ha vuit reines, el tauler marca les que s’ataquen (línia vermella contínua) i els trios en línia recta (línia de punts).',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> tria una reina i la deixa a la casella del cursor; <kbd>Supr</kbd> la treu; <kbd>Esc</kbd> desfà la tria.',
        dades: {
            mida: 8,
            inicial: [4, 2, 0, 6, 1, 7, 5, 3], // la columna de la reina de cada fila (la figura de Dudeney)
            solucio: [2, 4, 7, 3, 0, 6, 1, 5],
        },
        pistes: [
            'Primer, que no s’ataquin: una reina a cada fila i a cada columna, i mai dues en una mateixa diagonal.',
            'Les línies obliqües no són només les diagonals. Per exemple, una reina, una altra dues files més avall i una columna a la dreta, i una tercera dues files més avall i una columna més a la dreta estan en línia recta.',
            'A la solució de Dudeney, la reina de la fila de dalt és a la tercera columna, i la de la fila de baix, a la sisena.',
            'Fila per fila, de dalt a baix, les columnes de les reines són 3, 5, 8, 4, 1, 7, 2 i 6.',
        ],
        solucioDudeney: [
            '<p>La solució es veu a la figura. Cap reina no n’ataca cap altra, i no n’hi ha mai tres en línia recta en cap direcció obliqua. És l’única de les dotze maneres fonamentalment diferents de posar vuit reines sense que s’ataquin que també compleix aquesta darrera condició.</p>',
        ],
        notaMatematic: [
            '<p><strong>Història.</strong> El problema de les vuit reines el va proposar el jugador d’escacs Max Bezzel el 1848, i Franz Nauck en va publicar les 92 solucions el 1850; fins i tot Gauss s’hi va interessar. Avui és el problema clàssic per aprendre la cerca amb retrocés (<i>backtracking</i>): es posa una reina a cada fila i, quan ja no n’hi cap cap més, es torna enrere.</p>',
            '<p><strong>Comprovat per ordinador.</strong> La cerca troba les 92 solucions. Agrupades per girs i reflexos, en surten 12 de fonamentals: 11 amb 8 variants cadascuna i la simètrica, amb només 4 (11 · 8 + 4 = 92). De les 92, només 8 no tenen cap trio de reines en línia, i totes són la mateixa solució fonamental: la de Dudeney.</p>',
            '<p><strong>Tres en línia.</strong> Tres caselles són en línia recta quan els salts de l’una a l’altra són proporcionals: de la fila 1, columna 1 a la fila 3, columna 2, i a la fila 5, columna 3, per exemple. El mateix Dudeney va plantejar el 1917 la versió general amb peons: quants punts es poden posar en una quadrícula <i>n</i> × <i>n</i> sense que n’hi hagi tres en línia? És el problema «cap tres en línia» (<i>no-three-in-line</i>), i per a quadrícules grans encara és obert.</p>',
        ],
    },
    {
        id: 'amazones',
        ordre: 4,
        font: { llibre: 'am', numero: 316, titolOriginal: 'The Amazons' },
        titol: 'Les amazones',
        tipus: 'escacs',
        tauler: 'reines',
        dificultat: 3,
        enunciat: [
            '<p>Aquest trencaclosques està basat en un del capità Turton. Canvia de lloc tres de les reines de manera que al tauler quedin onze caselles que no estiguin atacades.</p>',
            '<p>No cal que les reines es moguin «com a reines»: les pots agafar i posar on vulguis. Només hi ha una solució.</p>',
            '<p class="pantalla">Al tauler hi ha les vuit reines de la figura de Dudeney. Ataquen com als escacs, en línia recta i en diagonal, fins que troben una altra peça. Els punts negres marquen les caselles que no ataca cap reina.</p>',
        ],
        regla: 'Canvia de lloc <strong>tres reines</strong> perquè quedin <strong>onze caselles</strong> sense atacar.',
        comEsJuga: [
            'Toca una reina i després la casella on la vols posar, o arrossega-la. Pot anar a qualsevol casella buida.',
            'Els punts marquen, en tot moment, les caselles que no ataca cap reina.',
            'Només pots canviar de lloc tres reines; les altres cinc s’han de quedar a la seva casella.',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> tria una reina i la deixa a la casella del cursor; <kbd>Esc</kbd> desfà la tria.',
        dades: {
            mida: 8,
            caselles: true,
            inicial: [[7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [6, 7], [5, 7]],
            solucio: [[7, 2], [7, 3], [7, 7], [6, 2], [6, 6], [6, 7], [5, 6], [5, 7]],
            lliures: 11,
            mogudes: 3,
            etiquetaFigura: 'Vuit reines: sis a la fila de baix, de c1 a h1, i dues més a h2 i h3',
            resumSolucio: 'Les reines d’e1, f1 i g1 van a c2, g2 i g3: queden onze caselles sense atacar.',
        },
        pistes: [
            'Ara no hi ha cap casella lliure: les reines de la fila de baix ataquen tot el tauler. Per deixar-ne de lliures, cal treure reines del mig d’aquesta fila.',
            'Les caselles lliures sortiran lluny de les reines, a la banda de dalt i a l’esquerra. Agrupa les reines a la cantonada de baix a la dreta.',
            'Les reines que es mouen són les d’e1, f1 i g1. Les de c1, d1, h1, h2 i h3 es queden.',
            'Posa-les a c2, g2 i g3.',
        ],
        solucioDudeney: [
            '<p>Es veurà que només s’han tret tres reines de les seves posicions a la vora del tauler i que, com a conseqüència, queden onze caselles (les dels punts negres) que no ataca cap reina.</p>',
            '<p>M’atreveixo a afirmar que no es poden posar vuit reines al tauler de manera que deixin més d’onze caselles sense atacar. És cert que encara no en tenim cap demostració rigorosa, però n’estic del tot convençut. Hi ha almenys cinc maneres diferents de col·locar les reines que deixen onze caselles sense atacar.</p>',
        ],
        notaMatematic: [
            '<p><strong>⚠ Dudeney tenia raó… i n’hi ha set, no cinc.</strong> Un programa ha provat totes les maneres de posar vuit reines al tauler (4 426 165 368) i cap no deixa més d’onze caselles sense atacar: la conjectura de Dudeney és certa. Les que en deixen onze són 48, que es redueixen a <strong>7</strong> de fonamentalment diferents si no comptem els girs i els reflexos. Tant si les reines ataquen a través d’altres peces com si no, els resultats són els mateixos.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Partint de la figura, s’han provat totes les maneres de canviar de lloc exactament tres reines (triar-ne tres de les vuit i posar-les en tres caselles noves): només una deixa onze caselles sense atacar, la de Dudeney, i cap no en deixa més.</p>',
            '<p><strong>El problema contrari.</strong> Quantes reines calen, com a mínim, perquè <em>totes</em> les caselles quedin atacades o ocupades? En un tauler d’escacs, cinc. Aquests problemes de «dominar» un tauler són avui un capítol de la teoria de grafs.</p>',
        ],
    },
    {
        id: 'peons',
        ordre: 5,
        font: { llibre: 'am', numero: 317, titolOriginal: 'A Puzzle with Pawns' },
        titol: 'Peons sense tres en línia',
        tipus: 'escacs',
        tauler: 'reines',
        dificultat: 3,
        enunciat: [
            '<p>Posa dos peons al mig del tauler d’escacs, l’un a d4 i l’altre a e5. Ara posa els catorze peons que queden (setze en total) de manera que no n’hi hagi mai tres en línia recta en cap direcció possible.</p>',
            '<p>Fixa’t que a propòsit no dic reines, perquè amb les paraules «en cap direcció possible» vaig més enllà dels atacs en diagonal. Els peons s’han de considerar simples punts de l’espai, als centres de les caselles. Mira les línies de punts del problema de «Les vuit reines».</p>',
            '<p class="pantalla">Els dos peons negres (d4 i e5) són els de l’enunciat i no es mouen. Toca les caselles per posar-hi els altres catorze.</p>',
        ],
        regla: 'Setze peons (amb els de <strong>d4</strong> i <strong>e5</strong>) i <strong>mai tres en línia recta</strong>, en cap direcció.',
        comEsJuga: [
            'Toca una casella buida per posar-hi un peó. Arrossega un peó a una altra casella, o toca’l i després toca la casella on el vols.',
            'Per treure un peó, toca’l dues vegades o arrossega’l fora del tauler. Els peons de d4 i e5 no es mouen.',
            'Quan hi ha els setze peons, el tauler marca amb línies de punts els trios que estan en línia recta.',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> posa un peó, o el tria i el deixa a la casella del cursor; <kbd>Supr</kbd> el treu; <kbd>Esc</kbd> desfà la tria.',
        dades: {
            peca: 'peo',
            mida: 8,
            nombre: 16,
            atacs: false,
            fixes: [[4, 3], [3, 4]],
            solucio: [[0, 2], [0, 6], [1, 2], [1, 4], [2, 0], [2, 1], [3, 4], [3, 6], [4, 1], [4, 3], [5, 5], [5, 7], [6, 0], [6, 3], [7, 5], [7, 7]],
            etiquetaFigura: 'Els dos peons de l’enunciat, a d4 i e5',
        },
        figuraEnunciat: { peu: 'Els dos peons de l’enunciat, a d4 i e5.', despres: 1 },
        pistes: [
            'En una mateixa fila no hi pot haver tres peons, i hi ha vuit files per a setze peons: a cada fila n’hi ha d’haver exactament dos. I el mateix passa amb les columnes.',
            'No n’hi ha prou de mirar files, columnes i diagonals: també compten les línies «de cavall» (una casella cap a un costat i dues cap avall) i qualsevol altra direcció.',
            'Com que d4 i e5 són a la mateixa diagonal, cap altre peó no pot anar a la diagonal llarga a1–h8.',
            'A la solució de Dudeney, els peons de la fila de dalt són a c8 i g8, i els de la fila de baix, a f1 i h1.',
        ],
        solucioDudeney: [
            '<p>Es poden posar setze peons de manera que no n’hi hagi mai tres en línia recta en cap direcció possible, com a la figura. Hem considerat, com demanava l’enunciat, que els peons són simples punts d’un pla.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Una cerca de totes les maneres de posar setze peons en el tauler (dos a cada fila) sense tres en línia en dóna 380, que són 57 de fonamentalment diferents si no comptem els girs i els reflexos. Però només dues tenen peons a d4 i a e5: la de Dudeney i la mateixa girada mitja volta (que intercanvia d4 i e5). Amb els dos peons de l’enunciat, doncs, la solució és única.</p>',
            '<p><strong>Un problema encara obert.</strong> Aquest enigma, que Dudeney va publicar per primera vegada el 1900, és avui el famós <i>problema de no tres en línia</i>: en una quadrícula de <i>n</i> × <i>n</i> punts, se’n poden triar 2<i>n</i> sense que n’hi hagi tres en línia? Per ordinador s’han trobat solucions per a tots els valors de <i>n</i> fins a 46 i per a alguns de més grans, però ningú no sap si es pot fer sempre. Richard Guy i Patrick Kelly van conjecturar el 1968 que, per a quadrícules prou grans, no: n’hi caben menys de 2<i>n</i>.</p>',
        ],
    },
    {
        id: 'cavalls',
        ordre: 6,
        font: { llibre: 'am', numero: 319, titolOriginal: 'The Knight-Guards' },
        titol: 'Els cavalls guardians',
        tipus: 'escacs',
        tauler: 'cavalls',
        dificultat: 3,
        enunciat: [
            '<p>El cavall és el pallasso del tauler d’escacs. «És un bergant imprevisible, sorneguer i desmoralitzador», diu un escriptor americà: salta per sobre de les altres peces, s’amaga en els llocs més segurs per espantar el rei i, quan menys t’ho esperes, es menja la reina. És difícil definir el seu moviment amb poques paraules, però un infant l’aprèn en pocs minuts mirant-lo: una casella com la torre i una altra com l’alfil, tot d’un sol salt.</p>',
            '<p>A la figura he posat dotze cavalls (el mínim possible) de manera que cada casella del tauler està ocupada o atacada per un cavall. Comprova-ho casella per casella. Ara el trencaclosques és trobar quants cavalls calen, com a mínim, perquè cada casella estigui ocupada o atacada <em>i, a més, cada cavall estigui protegit per un altre cavall</em>. I com els posaries? Dels dotze de la figura, només quatre estan protegits: són a un salt de cavall d’un altre cavall.</p>',
        ],
        figuraEnunciat: { cavalls: 'exemple', peu: 'Els dotze cavalls de Dudeney: cada casella és ocupada o atacada, però només 4 cavalls estan protegits (amb el cercle).' },
        regla: 'Posa cavalls perquè <strong>totes les caselles</strong> quedin ocupades o atacades i <strong>cada cavall</strong> estigui protegit per un altre. Amb com menys, millor.',
        comEsJuga: [
            'Toca una casella per posar-hi un cavall, o toca un cavall per treure’l.',
            'Les caselles atacades per algun cavall porten un punt; les que no estan ni ocupades ni atacades queden lliures.',
            'Quan cap casella no queda lliure, el tauler marca els cavalls que no estan protegits per cap altre.',
        ],
        tecles: 'les fletxes mouen el cursor; <kbd>Retorn</kbd> o <kbd>Espai</kbd> posa o treu un cavall.',
        dades: {
            mida: 8,
            minim: 14,
            exemple: [[1, 5], [2, 1], [2, 2], [2, 4], [2, 5], [3, 2], [4, 5], [5, 2], [5, 3], [5, 5], [5, 6], [6, 2]],
            solucio: [[1, 2], [1, 3], [1, 4], [1, 5], [3, 1], [3, 2], [3, 5], [3, 6], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6]],
        },
        pistes: [
            'Un cavall sempre salta a una casella de l’altre color. Per tant, els cavalls de les caselles blanques només ataquen caselles negres, i al revés.',
            'Pensa-ho per colors: quants cavalls posats en caselles blanques calen per atacar totes les negres? Després, el mateix amb l’altre color.',
            'Si els cavalls de les blanques ataquen totes les negres i els de les negres ataquen totes les blanques, cada cavall ja queda protegit: un cavall en una casella blanca és atacat pels de les negres!',
            'Amb 7 cavalls en caselles d’un color es poden atacar totes les caselles de l’altre color. 7 + 7 = 14.',
        ],
        solucioDudeney: [
            '<p>El nombre més petit de cavalls amb què es pot resoldre aquest trencaclosques és catorze.</p>',
            '<p>De vegades s’ha suposat que hi ha moltíssimes solucions diferents. En realitat només n’hi ha tres, sense comptar com a diferents els girs i els reflexos. Curiosament, sembla que ningú no havia trobat mai aquesta demostració tan senzilla, ni havia pensat a tractar per separat les caselles blanques i les negres.</p>',
            '<p>Set cavalls es poden posar en caselles blanques de manera que ataquin totes les negres de dues maneres i prou. Tres dels cavalls ocupen el mateix lloc en totes dues. Si girem el tauler perquè la casella del racó de dalt a l’esquerra sigui negra en lloc de blanca i posem els cavalls exactament als mateixos llocs, tindrem dues maneres semblants d’atacar totes les blanques. Ara, dibuixem aquestes dues últimes en paper transparent i posem-les a sobre de les dues primeres: superposant-les de totes les maneres possibles només s’obtenen tres solucions (com la de la figura), o els seus girs i reflexos. Per tant, aquestes tres solucions són totes les que hi ha.</p>',
        ],
        notaMatematic: [
            '<p><strong>La idea dels dos colors.</strong> Un cavall sempre salta a una casella de l’altre color. Per tant, les caselles negres només les poden atacar (o protegir) els cavalls que són en caselles blanques, i al revés. El problema es parteix en dos problemes independents, un per a cada color, i el mínim total és la suma dels dos mínims: 7 + 7 = 14.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca exhaustiva confirma que calen 7 cavalls en caselles blanques per atacar totes les negres, i que hi ha exactament 4 maneres de fer-ho (2, si comptem com una sola les que són simètriques); el mateix passa amb l’altre color. Combinant-les surten 16 solucions de 14 cavalls, que es redueixen a 3 de fonamentalment diferents, tal com diu Dudeney. També hem comprovat la figura de 12 cavalls: cobreix tot el tauler i només 4 cavalls hi estan protegits.</p>',
            '<p>En el llenguatge d’avui, és un problema de <i>dominació</i> en un graf (el graf del cavall, on cada casella està unida a les que ataca): els 12 cavalls són un conjunt dominant mínim, i els 14, un conjunt dominant <i>total</i> mínim, on fins i tot cada vèrtex del conjunt ha de tenir un veí dins del conjunt.</p>',
        ],
    },
]);
