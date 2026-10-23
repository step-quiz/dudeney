/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/mesures/problemes.js
 * ROL: Els enigmes de mesures i travesses: travessant el rierol (AM 373) i el
 *   nou problema de mesures (AM 365). Enunciat, pistes i solució de Dudeney
 *   traduïts i adaptats; la nota del matemàtic és nostra.
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js).
 *   Rierol: el pes del gos no el diu Dudeney (vegeu docs/DISCREPANCIES.md).
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'rierol',
        ordre: 1,
        font: { llibre: 'am', numero: 373, titolOriginal: 'Crossing the Stream' },
        titol: 'Travessant el rierol',
        tipus: 'mesures',
        tauler: 'barca',
        dificultat: 1,
        enunciat: [
            '<p>Durant una passejada pel camp, el senyor i la senyora Softleigh es van trobar en un bon embolic. Havien de travessar un rierol amb una barqueta que només podia portar 150 <span class="unitat" data-nota="1 lliura ≈ 0,45 kg: 150 lliures són uns 68 kg">lliures</span> de pes. Però el senyor Softleigh i la seva dona pesaven exactament 150 lliures cada un, i cada un dels seus dos fills, 75. I encara hi havia el gos, que no hi havia manera que volgués nedar.</p>',
            '<p>Seguint el principi de «les senyores, primer», de seguida van fer passar la senyora Softleigh a l’altra banda. Va ser una badada, perquè va haver de tornar amb la barca i no s’havia guanyat res. Com van aconseguir passar tots a l’altra banda? Segur que tu ho trobaràs molt més fàcil que la família Softleigh.</p>',
            '<p class="pantalla">Dudeney no diu quant pesa el gos: a la pantalla en pesa 30 lliures. I, és clar, el gos no sap remar.</p>',
        ],
        regla: 'Passa tothom a l’altra riba. La barca aguanta <strong>150 lliures</strong> i algú hi ha de remar.',
        comEsJuga: [
            'Toca una persona (o el gos) per pujar-la a la barca o fer-la baixar. També la pots arrossegar.',
            'Quan la barca estigui a punt, toca <strong>Travessa</strong>. En arribar, tothom baixa a la riba.',
            'La barca no pot portar més de 150 lliures, i el gos no sap remar.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>5</kbd> pugen o fan baixar el pare, la mare, els fills i el gos; <kbd>Retorn</kbd> travessa; <kbd>⌫</kbd> desfà.',
        dades: {
            capacitat: 150,
            unitat: 'lliures',
            passatgers: [
                { id: 'pare', nom: 'el pare', curt: 'pare', pes: 150, rema: true, figura: 'adult' },
                { id: 'mare', nom: 'la mare', curt: 'mare', pes: 150, rema: true, figura: 'adulta' },
                { id: 'fill1', nom: 'un fill', curt: 'fill', pes: 75, rema: true, figura: 'nen' },
                { id: 'fill2', nom: 'l’altre fill', curt: 'fill', pes: 75, rema: true, figura: 'nen' },
                { id: 'gos', nom: 'el gos', curt: 'gos', pes: 30, rema: false, figura: 'gos' },
            ],
            // La solució de Dudeney: qui va a cada travessia (índexs de passatgers)
            solucio: [[2, 3], [2], [0], [3], [2, 3], [2], [1], [3], [2, 3], [2], [2, 4]],
        },
        pistes: [
            'Si travessa un dels pares, algú haurà de tornar la barca… i no pot ser ell mateix, o no s’hauria guanyat res.',
            'Els dos fills junts pesen 150 lliures: poden anar plegats a la barca.',
            'Cada vegada que un dels pares passa a l’altra banda, hi ha d’haver un fill esperant-lo per tornar la barca.',
            'Primer passen els dos fills i un torna. Després passa el pare, i l’altre fill torna.',
        ],
        solucioDudeney: [
            '<p>Primer travessen els dos fills, i un torna. Després travessa el pare, i l’altre fill torna. Llavors travessen els dos fills, i un torna. Després travessa la senyora, i l’altre fill torna. Llavors travessen els dos fills, i un d’ells torna a buscar el gos. Onze travessies en total.</p>',
            '<p>Sembla que no es pot donar cap regla general per resoldre aquests trencaclosques de travessar rius. Per a un cas concret es pot trobar una fórmula que valgui per a qualsevol nombre de persones en les mateixes condicions, però no serveix de gaire, perquè qualsevol petita condició afegida la tomba. Com passa amb els problemes de mesurar, normalment ens hem de refiar de l’enginy de cadascú.</p>',
        ],
        notaMatematic: [
            '<p><strong>Un problema de fa més de dotze segles.</strong> Alcuí de York, el savi de la cort de Carlemany, ja el va posar al segle VIII en el seu recull <i>Propositiones ad acuendos iuvenes</i> («Problemes per esmolar l’enginy dels joves»): un home i una dona que pesen cadascun una càrrega de carro, dos fills que junts en pesen una, i una barca que només en porta una. Dudeney hi afegeix el gos.</p>',
            '<p><strong>El pes del gos.</strong> Dudeney no diu quant pesa, però la seva solució només funciona si el gos pesa com a molt 75 lliures, perquè ha de travessar amb un fill. Si en pesés més, no hi hauria manera de passar-lo: sol no pot remar, amb un dels pares la barca s’enfonsaria i amb els dos fills, també. I si no pesés res, n’hi hauria prou amb 9 travessies, perquè el gos podria anar amb qualsevol.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada per totes les situacions possibles (qui és a cada riba i on és la barca) confirma que, amb un gos d’entre 1 i 75 lliures, 11 travessies és el mínim.</p>',
        ],
    },
    {
        id: 'gerres',
        ordre: 2,
        font: { llibre: 'am', numero: 365, titolOriginal: 'New Measuring Puzzle' },
        titol: 'Un nou problema de mesures',
        tipus: 'mesures',
        tauler: 'gerres',
        dificultat: 2,
        enunciat: [
            '<p>Aquí teniu un nou problema de mesurar líquids que trobareu interessant. Un home té dues gerres de 10 <span class="unitat" data-nota="1 quart anglès ≈ 1,14 litres">quarts</span> plenes de vi, i una mesura de 5 quarts i una altra de 4. Vol posar exactament 3 quarts a cadascuna de les dues mesures.</p>',
            '<p>Com ho ha de fer? I quantes manipulacions (vessar d’un recipient a un altre) necessites? És clar que no s’hi val a llençar vi, a inclinar els recipients ni a fer cap altre truc.</p>',
            '<p class="pantalla">Cada vegada que vesses, el vi passa fins que el recipient d’on surt queda buit o el que el rep queda ple: no hi ha cap marca per mesurar menys.</p>',
        ],
        regla: 'Aconsegueix <strong>3 quarts</strong> a la mesura de 5 i <strong>3 quarts</strong> a la de 4.',
        comEsJuga: [
            'Toca el recipient d’on vols vessar i després el que l’ha de rebre. També pots arrossegar un recipient fins a l’altre.',
            'El vi passa fins que el primer queda buit o el segon queda ple.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>4</kbd> trien el recipient (primer el que vessa, després el que rep); <kbd>Esc</kbd> desfà la tria; <kbd>⌫</kbd> desfà la darrera abocada.',
        dades: {
            capacitats: [10, 10, 5, 4],
            inicial: [10, 10, 0, 0],
            objectiu: { 2: 3, 3: 3 },
            noms: ['gerra de 10', 'gerra de 10', 'mesura de 5', 'mesura de 4'],
            formes: ['gerra', 'gerra', 'mesura', 'mesura'],
            unitat: 'quarts',
            // La taula de Dudeney, com a abocades [de, a]
            solucio: [[0, 2], [2, 3], [3, 0], [1, 3], [2, 1], [3, 2], [1, 3], [3, 2], [2, 1], [0, 2], [2, 1]],
        },
        pistes: [
            'No es pot llençar vi: entre tots quatre recipients sempre hi ha 20 quarts. Al final, 3 + 3 a les mesures i 14 a les gerres.',
            'Amb les mesures de 5 i de 4 pots fer 1 quart: 5 − 4. I amb aquest 1, pots deixar una gerra amb 9.',
            'Intenta tenir una gerra amb 9 quarts i l’altra amb una quantitat que et deixi treure’n 3 amb la mesura de 4.',
            'Els primers passos de Dudeney: omple la mesura de 5 amb la primera gerra; amb la de 5, omple la de 4; buida la de 4 a la primera gerra. Ara tens 9, 10, 1 i 0.',
        ],
        solucioDudeney: [
            '<p>La solució següent, en onze manipulacions, mostra què hi ha a cada recipient al principi i després de cada manipulació:</p>',
            '<table class="taula-dudeney"><thead><tr><th>gerra de 10</th><th>gerra de 10</th><th>mesura de 5</th><th>mesura de 4</th></tr></thead><tbody>' +
                [
                    [10, 10, 0, 0],
                    [5, 10, 5, 0],
                    [5, 10, 1, 4],
                    [9, 10, 1, 0],
                    [9, 6, 1, 4],
                    [9, 7, 0, 4],
                    [9, 7, 4, 0],
                    [9, 3, 4, 4],
                    [9, 3, 5, 3],
                    [9, 8, 0, 3],
                    [4, 8, 5, 3],
                    [4, 10, 3, 3],
                ]
                    .map(f => '<tr>' + f.map(x => '<td>' + x + '</td>').join('') + '</tr>')
                    .join('') +
                '</tbody></table>',
        ],
        notaMatematic: [
            '<p><strong>Per què es pot fer.</strong> Com que no hi ha marques, cada abocada s’acaba quan un recipient queda buit o ple, i per això les quantitats sempre són nombres enters. Amb les mesures de 5 i de 4 es pot obtenir 1 = 5 − 4, i a partir de l’1, qualsevol altra quantitat. És la mateixa idea que diu que, si dos nombres no tenen cap divisor comú (com 5 i 4), sumant-los i restant-los s’arriba a qualsevol enter: la identitat de Bézout.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada per totes les situacions possibles (quant vi hi ha a cada recipient) confirma que 11 manipulacions és el mínim, i que la taula de Dudeney és correcta pas a pas.</p>',
            '<p>Els problemes de gerres són molt antics. Un dels més coneguts, repartir 8 mesures de vi en dues parts iguals amb gerres de 5 i de 3, se sol atribuir a Niccolò Tartaglia, al segle XVI.</p>',
        ],
    },
    {
        id: 'bol',
        ordre: 3,
        font: { llibre: 'am', numero: 362, titolOriginal: 'The Wassail Bowl' },
        titol: 'El bol de la festa',
        tipus: 'mesures',
        tauler: 'gerres',
        dificultat: 2,
        enunciat: [
            '<p>Una nit de Nadal, tres rodamons es van trobar amb un autèntic bol de festa: un barriló amb exactament 12 <span class="unitat" data-nota="1 pinta anglesa ≈ 0,57 litres: 12 pintes són uns 6,8 litres">pintes</span> de llimonada. Un d’ells tenia una gerra de 5 pintes, i un altre, una de 3. El problema era repartir-se la llimonada a parts iguals sense malbaratar-ne ni una gota. És clar que no poden fer servir cap altre recipient ni cap altra mesura.</p>',
            '<p>Si trobes com fer-ho, intenta trobar la manera que necessita menys manipulacions. Cada vegada que es vessa d’un recipient a un altre, o directament a la boca d’un dels rodamons, compta com una manipulació.</p>',
            '<p class="pantalla">Els tres rodamons es diuen X, Y i Z. Per donar beure a un d’ells, toca el recipient i després el rodamón: es beu tot el que li toca. I el que s’ha begut, ja no ho pot tornar!</p>',
        ],
        regla: 'Que cada rodamón (X, Y i Z) begui exactament <strong>4 pintes</strong>, amb el mínim de manipulacions.',
        comEsJuga: [
            'Toca el recipient d’on vols vessar i després el que l’ha de rebre (una gerra o un rodamón). També pots arrossegar un recipient fins a l’altre.',
            'Entre recipients, la llimonada passa fins que el primer queda buit o el segon queda ple. Un rodamón es beu tot el que li dones.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>6</kbd> trien el recipient o el rodamón (primer el que vessa, després el que rep); <kbd>Esc</kbd> desfà la tria; <kbd>⌫</kbd> desfà la darrera manipulació.',
        dades: {
            capacitats: [12, 5, 3, Infinity, Infinity, Infinity],
            inicial: [12, 0, 0, 0, 0, 0],
            objectiu: { 3: 4, 4: 4, 5: 4 },
            noms: ['barril', 'gerra de 5', 'gerra de 3', 'X', 'Y', 'Z'],
            articles: ['el', 'la', 'la', 'en', 'en', 'en'],
            formes: ['barril', 'gerra', 'mesura', 'persona', 'persona', 'persona'],
            unitat: 'pintes',
            liquid: 'llimonada',
            escala: 18,
            escalaPersona: 6,
            nomPassos: 'Manipulacions',
            textResolt: 'Quatre pintes per a cada rodamón, i no s’ha perdut ni una gota.',
            textFinal: 'Onze manipulacions: el quadern és la taula de Dudeney.',
            // La taula de Dudeney, com a manipulacions [de, a] (3, 4 i 5 són X, Y i Z)
            solucio: [[0, 1], [1, 2], [1, 3], [2, 1], [0, 2], [0, 4], [2, 1], [2, 5], [1, 2], [1, 3], [2, 5]],
        },
        figuraEnunciat: { peu: 'El barril, les dues gerres i els tres rodamons.', despres: 1 },
        pistes: [
            'No es pot llençar res: entre el barril, les gerres i el que s’han begut, sempre hi ha 12 pintes. I el que un rodamón s’ha begut ja no torna.',
            'Amb les dues gerres pots fer 2 pintes: omple la de 5 i, amb ella, omple la de 3. A la de 5 en queden 2.',
            'Un rodamón també pot beure directament del barril: si al barril només hi queden 4 pintes, se les pot beure d’un sol cop.',
            'Els tres primers passos de Dudeney: omple la gerra de 5 amb el barril; amb la de 5, omple la de 3; i les 2 pintes que queden a la de 5, per a en X.',
        ],
        solucioDudeney: [
            '<p>El repartiment de les dotze pintes es pot fer en onze manipulacions, com a la taula. Les sis columnes mostren d’un cop d’ull quanta llimonada hi ha al barril, a la gerra de 5 pintes i a la de 3, i quanta se n’han begut els rodamons X, Y i Z després de cada manipulació (al principi, el barril és ple i tota la resta, buida).</p>',
            '<table class="taula-dudeney"><thead><tr><th>barril</th><th>gerra de 5</th><th>gerra de 3</th><th>X</th><th>Y</th><th>Z</th></tr></thead><tbody>' +
                [
                    [7, 5, 0, 0, 0, 0],
                    [7, 2, 3, 0, 0, 0],
                    [7, 0, 3, 2, 0, 0],
                    [7, 3, 0, 2, 0, 0],
                    [4, 3, 3, 2, 0, 0],
                    [0, 3, 3, 2, 4, 0],
                    [0, 5, 1, 2, 4, 0],
                    [0, 5, 0, 2, 4, 1],
                    [0, 2, 3, 2, 4, 1],
                    [0, 0, 3, 4, 4, 1],
                    [0, 0, 0, 4, 4, 4],
                ]
                    .map(f => '<tr>' + f.map(x => '<td>' + x + '</td>').join('') + '</tr>')
                    .join('') +
                '</tbody></table>',
            '<p>I cada rodamón s’ha begut les seves quatre pintes.</p>',
        ],
        notaMatematic: [
            '<p><strong>Les persones són recipients diferents.</strong> Un rodamón és com una gerra enorme que mai no es buida: hi pots vessar tant com vulguis, però no en pots treure res. Per això no es pot fer servir per guardar llimonada «de pas», com es fa amb les gerres, i el problema és més difícil del que sembla.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada per totes les situacions possibles (quanta llimonada hi ha al barril i a cada gerra, i quanta se n’ha begut cada rodamón) confirma que 11 manipulacions és el mínim i que la taula de Dudeney és correcta pas a pas. Hi ha 72 maneres de fer-ho en 11 manipulacions; si no importa quin rodamón és quin, en queden 12.</p>',
        ],
    },
]);
