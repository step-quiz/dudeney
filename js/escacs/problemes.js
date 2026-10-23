/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/escacs/problemes.js
 * ROL: Els enigmes d'escacs: les vuit reines (AM 300) i els cavalls guardians
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
        id: 'reines',
        ordre: 1,
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
        id: 'cavalls',
        ordre: 2,
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
