/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/camins/problemes.js
 * ROL: Els enigmes de camins: visitant les ciutats (AM 243, un cicle de
 *   Hamilton) i l'inspector del metro (AM 242, el carter xinès). Enunciat,
 *   pistes i solució de Dudeney traduïts i adaptats; la nota és nostra.
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js). graf = { vertexs,
 *   arestes, posicions } amb les posicions redibuixades de les figures de
 *   Dudeney (unitats de la figura; y cap avall).
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'ciutats',
        ordre: 1,
        font: { llibre: 'am', numero: 243, titolOriginal: 'Visiting the Towns' },
        titol: 'Visitant les ciutats',
        tipus: 'camins',
        tauler: 'hamilton',
        dificultat: 1,
        enunciat: [
            '<p>Un viatger que surt de la ciutat número 1 vol visitar totes les ciutats una vegada, i només una, anant sempre per les carreteres que marquen les línies rectes. Quantes rutes diferents pot triar?</p>',
            '<p>És clar que ha d’acabar el viatge a la ciutat 1, d’on ha sortit, i que no ha de fer cas de les cruïlles: ha d’anar recte de ciutat a ciutat. És un trencaclosques absurdament fàcil, si t’hi poses de la manera adequada.</p>',
        ],
        regla: 'Surt de l’<strong>1</strong>, passa <strong>una sola vegada</strong> per cada ciutat i torna a l’1.',
        comEsJuga: [
            'Toca les ciutats una darrere l’altra: la ruta comença a l’1. També pots arrossegar el dit (o el ratolí) de ciutat en ciutat.',
            'Només pots anar d’una ciutat a una altra si hi ha una carretera recta entre totes dues. Les cruïlles del mig no compten.',
            'Toca la darrera ciutat de la ruta (o fes servir «Desfés») per tornar enrere.',
        ],
        tecles: '<kbd>Tab</kbd> recorre les ciutats; <kbd>Retorn</kbd> hi va; <kbd>⌫</kbd> desfà el darrer pas.',
        dades: {
            inici: 1,
            graf: {
                vertexs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                arestes: [[1, 9], [1, 12], [2, 10], [2, 13], [3, 7], [3, 11], [3, 12], [3, 14], [4, 8], [4, 13], [4, 15], [5, 9], [5, 14], [6, 10], [6, 15], [7, 13], [8, 14], [9, 15], [9, 16], [10, 12], [11, 13], [11, 16], [12, 16]],
            },
            // Posicions de la figura de Dudeney (redibuixada)
            posicions: { 1: [45, 38], 2: [190, 38], 3: [335, 38], 4: [478, 38], 5: [622, 38], 6: [765, 38], 7: [45, 180], 8: [190, 180], 9: [335, 180], 10: [478, 180], 11: [622, 180], 12: [190, 325], 13: [335, 325], 14: [478, 325], 15: [622, 325], 16: [478, 465] },
            solucio: [1, 9, 5, 14, 8, 4, 15, 6, 10, 2, 13, 7, 3, 11, 16, 12, 1],
        },
        extra: {
            pregunta: 'I ara, la pregunta de Dudeney: <strong>quantes rutes diferents</strong> pot triar el viatger?',
            resposta: [1, 2],
            be: 'Només n’hi ha una (o, si ho prefereixes, dues: la mateixa ruta feta al revés). Mira com ho demostra Dudeney a la solució.',
            malament: 'N’hi ha menys! Fixa’t en les ciutats de les quals només surten dues carreteres.',
        },
        pistes: [
            'Hi ha ciutats de les quals només surten dues carreteres. La ruta ha de fer servir totes dues per força: per una hi arriba i per l’altra en surt.',
            'De l’1 només surten dues carreteres: la ruta ha de passar per la 9 i per la 12, una en sortir i l’altra en tornar.',
            'Fes el mateix amb les altres ciutats de dues carreteres: la 5, la 8, la 6, la 2 i la 7. Totes aquestes carreteres són segures.',
            'La 13 ja té dues carreteres segures (cap a la 2 i cap a la 7): no se’n pot fer servir cap altra que hi arribi. Mira on ha d’anar, llavors, la 4.',
        ],
        solucioDudeney: [
            '<p>Fixa’t que hi ha sis ciutats de les quals només surten dues carreteres. Per tant, l’1 ha de quedar entre la 9 i la 12 en la ruta circular: marquem aquestes dues carreteres com a segures. De la mateixa manera, marquem 9, 5, 14; 4, 8, 14; 10, 6, 15; 10, 2, 13, i 3, 7, 13. Totes aquestes carreteres s’han de fer servir.</p>',
            '<p>Llavors veuràs que ha d’anar de la 4 a la 15, perquè la 13 ja està tancada, i que està obligat a fer 3, 11, 16 i també 16, 12. Per tant, només hi ha una ruta: 1, 9, 5, 14, 8, 4, 15, 6, 10, 2, 13, 7, 3, 11, 16, 12, 1, o la mateixa al revés. Set carreteres no es fan servir.</p>',
        ],
        notaMatematic: [
            '<p><strong>Un cicle de Hamilton.</strong> Un camí que passa una sola vegada per cada punt d’un mapa i torna a l’inici s’anomena <i>cicle de Hamilton</i>, pel matemàtic irlandès William Rowan Hamilton, que el 1857 va inventar un joc que consistia a fer-ne un sobre els vèrtexs d’un dodecàedre. A diferència dels recorreguts que passen per totes les <em>línies</em> (com el de «L’inspector del metro»), no es coneix cap regla senzilla per saber si un mapa té un cicle de Hamilton: en mapes grans, és un dels problemes més difícils de la informàtica.</p>',
            '<p><strong>El raonament de Dudeney</strong> és el que fan avui els programes: començar per les decisions obligades (les ciutats amb només dues carreteres) i deduir-ne la resta.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca de totes les rutes que surten de l’1 confirma que només n’hi ha una (si comptem la mateixa ruta al revés com una sola) i que deixa set de les vint-i-tres carreteres sense fer servir.</p>',
        ],
    },
    {
        id: 'metro',
        ordre: 2,
        font: { llibre: 'am', numero: 242, titolOriginal: 'The Tube Inspector’s Puzzle' },
        titol: 'L’inspector del metro',
        tipus: 'camins',
        tauler: 'carter',
        dificultat: 2,
        enunciat: [
            '<p>L’home de la il·lustració té un petit dilema. L’acaben de nomenar inspector d’una xarxa de metro, i la seva feina és revisar regularment, dins d’un termini fixat, les disset línies de la companyia, que uneixen dotze estacions, tal com es veu al gran plànol que està mirant. Vol organitzar la ruta de manera que passi per totes les línies viatjant tan poc com pugui. Pot començar on vulgui i acabar on vulgui. Quina és la ruta més curta?</p>',
            '<p>Sembla ben senzill, oi? Però de seguida veuràs que, ho facis com ho facis, l’inspector ha de passar per algunes línies més d’una vegada. Dit d’una altra manera: si les estacions són a una <span class="unitat" data-nota="1 milla ≈ 1,6 km">milla</span> l’una de l’altra, haurà de viatjar més de disset milles per revisar totes les línies. Aquí hi ha la dificultat. Quant ha de viatjar, com a mínim, i quina ruta li recomanaries?</p>',
        ],
        regla: 'Passa per <strong>totes les línies</strong> del metro fent <strong>tan poques milles</strong> com puguis. Comença i acaba on vulguis.',
        comEsJuga: [
            'Toca una estació per començar i després les estacions per on vols passar, una darrere l’altra. També pots arrossegar el dit de l’una a l’altra.',
            'Cada tram entre dues estacions veïnes fa una milla. Els trams revisats queden pintats; si en repeteixes un, es veu doble.',
            'Toca la darrera estació de la ruta (o fes servir «Desfés») per tornar enrere.',
        ],
        tecles: '<kbd>Tab</kbd> recorre les estacions; <kbd>Retorn</kbd> hi va; <kbd>⌫</kbd> desfà el darrer pas.',
        dades: {
            unitat: 'milles',
            graf: {
                vertexs: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
                arestes: [['A', 'B'], ['B', 'C'], ['D', 'E'], ['E', 'F'], ['G', 'H'], ['H', 'I'], ['J', 'K'], ['K', 'L'], ['A', 'D'], ['D', 'G'], ['G', 'J'], ['B', 'E'], ['E', 'H'], ['H', 'K'], ['C', 'F'], ['F', 'I'], ['I', 'L']],
            },
            posicions: { A: [60, 60], B: [190, 60], C: [320, 60], D: [60, 190], E: [190, 190], F: [320, 190], G: [60, 320], H: [190, 320], I: [320, 320], J: [60, 450], K: [190, 450], L: [320, 450] },
            minim: 19,
            solucio: ['B', 'A', 'D', 'G', 'D', 'E', 'F', 'I', 'F', 'C', 'B', 'E', 'H', 'K', 'L', 'I', 'H', 'G', 'J', 'K'],
        },
        pistes: [
            'Mira cada estació: quantes línies en surten? Si en surt un nombre senar, l’inspector hi haurà de començar, hi haurà d’acabar o hi haurà de repetir una línia.',
            'B, D, F, G, I i K tenen tres línies cadascuna; les altres estacions en tenen dues o quatre.',
            'La ruta pot començar en una estació «senar» i acabar en una altra. Les altres quatre s’han d’arreglar repetint línies: tria trams curts que n’uneixin dues.',
            'Repeteix els trams D–G i F–I, i comença a B.',
        ],
        solucioDudeney: [
            '<p>L’inspector només ha de viatjar dinou milles si surt de B i fa aquesta ruta: B, A, D, G, D, E, F, I, F, C, B, E, H, K, L, I, H, G, J, K. Així, els únics trams que recorre dues vegades són els de D a G i de F a I. És clar que la ruta es pot variar, però no es pot escurçar.</p>',
        ],
        notaMatematic: [
            '<p><strong>Per què 19.</strong> Un recorregut d’un sol traç, sense repetir cap línia, només és possible si de cada estació en surt un nombre parell de línies, llevat potser de dues, que han de ser la sortida i l’arribada: cada vegada que el recorregut passa per una estació, hi entra per una línia i en surt per una altra. Ho va demostrar Leonhard Euler el 1736, amb el problema dels set ponts de Königsberg. Aquí n’hi ha sis de senars: B, D, F, G, I i K. Dues poden ser la sortida i l’arribada; per a les altres quatre cal repetir línies, i repetir D–G i F–I (una milla cada una) les deixa totes parelles: 17 + 2 = 19.</p>',
            '<p><strong>El carter xinès.</strong> Trobar el recorregut més curt que passa per totes les línies d’un mapa s’anomena avui el <i>problema del carter xinès</i>, perquè el va estudiar el matemàtic xinès Guan Meigu el 1960, pensant en els carters que han de fer tots els carrers d’un barri. Dudeney ja el plantejava el 1917.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada que té en compte a quina estació és l’inspector i quines línies ja ha revisat confirma que 19 milles és el mínim, i que la ruta de Dudeney és vàlida.</p>',
        ],
    },
]);
