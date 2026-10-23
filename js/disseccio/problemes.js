/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/disseccio/problemes.js
 * ROL: Els enigmes de dissecció: els quadrats de brocat (AM 174) i el
 *   trencaclosques del mercer (CP 26). Enunciat, pistes i solució de Dudeney
 *   traduïts i adaptats; la nota del matemàtic és nostra.
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js).
 *   Mercer: punts [x, y] amb la y cap amunt, triangle de costat 6; els punts
 *   surten de la construcció de Dudeney (A…M) i els tests la tornen a fer.
 *   Brocat: cada peça és una llista de rectangles [fila, columna, alt, ample]
 *   dins del seu quadrat original (fila 0 a dalt); la solució, la translació
 *   de cada peça fins al quadrat de 10 × 10.
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'trapezi',
        ordre: 1,
        font: { llibre: 'am', numero: 146, titolOriginal: 'An Easy Dissection Puzzle' },
        titol: 'Una dissecció fàcil',
        tipus: 'disseccio',
        tauler: 'retalla',
        dificultat: 1,
        enunciat: [
            '<p>Primer, retalla un tros de paper o de cartolina amb la forma de la il·lustració. Es veu de seguida que les proporcions són senzillament les d’un quadrat amb mig quadrat igual enganxat al costat, tallat per la diagonal. El trencaclosques consisteix a tallar-lo en quatre peces exactament de la mateixa mida i de la mateixa forma.</p>',
            '<p class="pantalla">A la pantalla, la figura ja està dividida en dotze triangles iguals, com fa Dudeney a la solució. Pinta’ls de quatre colors, un per a cada peça: on dos colors es toquen, hi haurà un tall.</p>',
        ],
        regla: 'Pinta els 12 triangles de <strong>quatre colors</strong>: han de sortir quatre peces de la <strong>mateixa mida i la mateixa forma</strong>.',
        comEsJuga: [
            'Tria un color a la paleta i toca els triangles, o arrossega el dit per sobre per pintar-ne uns quants seguits.',
            'Si toques un triangle que ja és del color que tens triat, s’esborra.',
            'Les peces es poden girar o posar del revés: només compta la forma.',
        ],
        tecles: '<kbd>Tab</kbd> recorre els triangles; <kbd>1</kbd>…<kbd>4</kbd> el pinten; <kbd>0</kbd> l’esborra; <kbd>⌫</kbd> desfà.',
        dades: {
            peces: 4,
            contorn: [[0, 0], [2, 0], [4, 2], [0, 2]],
            // Els dotze triangles de Dudeney (unitats: el quadrat fa 2 × 2; y cap avall)
            triangles: [[[0, 2], [1, 2], [1, 1]], [[0, 2], [1, 1], [0, 1]], [[1, 2], [2, 2], [1, 1]], [[2, 2], [2, 1], [1, 1]], [[2, 2], [3, 2], [3, 1]], [[2, 2], [3, 1], [2, 1]], [[0, 1], [1, 1], [0, 0]], [[1, 1], [1, 0], [0, 0]], [[1, 1], [2, 1], [2, 0]], [[1, 1], [2, 0], [1, 0]], [[3, 2], [4, 2], [3, 1]], [[2, 1], [3, 1], [2, 0]]],
            // La solució de Dudeney: la peça de cada triangle
            solucio: [1, 0, 1, 1, 3, 3, 0, 0, 2, 2, 3, 2],
            etiqueta: 'Un quadrat amb mig quadrat enganxat a la dreta, dividit en dotze triangles iguals',
            etiquetaSolucio: 'La figura tallada en quatre peces iguals, cadascuna amb la forma de la figura sencera',
            peuSolucio: 'Les quatre peces: cadascuna és la figura sencera a mitja mida.',
            textResolt: 'I fixa’t: cada peça té la mateixa forma que la figura sencera.',
            resumSolucio: 'Quatre peces, cadascuna amb la forma de la figura sencera, però a mitja mida.',
        },
        pistes: [
            'Hi ha dotze triangles i quatre peces: cada peça n’ha de tenir tres.',
            'Tres triangles poden fer un triangle gran, una tira… o una figura més estranya.',
            'Mira la forma de tota la figura: un quadrat amb mig quadrat enganxat. I si cada peça tingués aquesta mateixa forma, però més petita?',
            'Una de les peces és la punta de la dreta amb el quadret que té al costat: un quadrat i mig quadrat, com la figura sencera però a mitja mida.',
        ],
        solucioDudeney: [
            '<p>La solució d’aquest trencaclosques es veu a la il·lustració. Si es divideix la figura en dotze triangles iguals, és fàcil descobrir per on s’han de fer els talls: són les línies gruixudes.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Una figura que es reprodueix.</strong> Cada una de les quatre peces és una còpia de la figura sencera, a mitja mida. Les figures que es poden tallar en còpies iguals d’elles mateixes, més petites, s’anomenen <i>rep-tiles</i>; el nom el va posar el matemàtic Solomon Golomb el 1962. I com que cada peça té la mateixa forma que la figura, també es pot tallar en quatre, i cada trosset en quatre més, i així sense fi.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Un programa que prova totes les maneres de repartir els dotze triangles en quatre grups de tres troba que només n’hi ha una que doni quatre peces iguals: la de Dudeney.</p>',
        ],
    },
    {
        id: 'cinc-triangles',
        ordre: 2,
        font: { llibre: 'am', numero: 147, titolOriginal: 'An Easy Square Puzzle' },
        titol: 'Un quadrat fàcil',
        tipus: 'disseccio',
        tauler: 'peces',
        dificultat: 1,
        enunciat: [
            '<p>Si agafes un tros de cartolina rectangular, el doble de llarg que d’ample, i el talles per la meitat seguint la diagonal, obtindràs dues de les peces de la il·lustració. El trencaclosques consisteix a formar un quadrat amb cinc peces iguals com aquestes. Una de les peces es pot tallar en dues, però les altres s’han de fer servir senceres.</p>',
            '<p class="pantalla">A la pantalla, la cinquena peça (la de la dreta) ja està tallada en dues, tal com la talla Dudeney. Mou les peces i gira-les fins que omplin el quadrat de punts.</p>',
        ],
        regla: 'Omple el <strong>quadrat</strong> de punts amb les peces. Les pots girar, però no cal posar-les del revés.',
        comEsJuga: [
            'Arrossega les peces: s’enganxen a la xarxa de punts, cada mig quadret.',
            'Per girar una peça, toca-la i fes servir el botó <strong>Gira</strong> (un quart de volta).',
            'Quan les peces omplen el quadrat de punts, sense forats ni trossos de més, està resolt.',
        ],
        tecles: '<kbd>Tab</kbd> tria una peça; les fletxes la mouen; <kbd>R</kbd> la gira; <kbd>⌫</kbd> desfà.',
        dades: {
            // Les peces, a la seva posició inicial (unitats: un triangle és mig rectangle de 2 × 1; y cap avall)
            peces: [
                { nom: '1', pts: [[0, 0], [2, 0], [0, 1]] },
                { nom: '2', pts: [[2, 0], [2, 1], [0, 1]] },
                { nom: '3', pts: [[0, 1.5], [2, 1.5], [0, 2.5]] },
                { nom: '4', pts: [[2, 1.5], [2, 2.5], [0, 2.5]] },
                { nom: '5', pts: [[3.5, 2], [3.5, 1], [3, 1], [2.5, 2]] },
                { nom: '6', pts: [[3.5, 1], [3.5, 0], [3, 1]] },
            ],
            // Els cinc triangles sencers (la fitxa en paper)
            paper: [[[0, 0], [2, 0], [0, 1]], [[2, 0], [2, 1], [0, 1]], [[0, 1.5], [2, 1.5], [0, 2.5]], [[2, 1.5], [2, 2.5], [0, 2.5]], [[3.5, 2], [3.5, 0], [2.5, 2]]],
            etiquetaPaper: 'Cinc triangles iguals, cadascun la meitat d’un rectangle de 2 × 1',
            // El quadrat (de costat √5) que han d'omplir
            objectiu: [[5, 3], [7, 2], [6, 0], [4, 1]],
            vista: [-0.4, -0.4, 7.8, 3.8],
            solucio: [{ r: 0, x: 5, y: 2 }, { r: 1, x: 7, y: 0 }, { r: 2, x: 6, y: 2.5 }, { r: 3, x: 2.5, y: 3 }, { r: 1, x: 7, y: -1.5 }, { r: 3, x: 5, y: 4.5 }],
            etiqueta: 'Cinc triangles iguals, cadascun la meitat d’un rectangle de 2 × 1; el cinquè, tallat en dues peces. A la dreta, el lloc d’un quadrat inclinat',
            etiquetaSolucio: 'El quadrat fet amb els quatre triangles i les dues peces del cinquè',
            peuSolucio: 'Quatre triangles al voltant d’un quadret, que s’omple amb el cinquè triangle tallat en dues peces.',
            textResolt: 'Quatre triangles i, al mig, el cinquè tallat en dos: un quadrat de costat √5.',
            resumSolucio: 'Els quatre triangles sencers al voltant, i el cinquè, tallat en dos, al mig.',
        },
        pistes: [
            'Cada triangle és mig rectangle de 2 × 1: té una àrea d’1. Les cinc peces fan 5, i per tant el quadrat té un costat de √5.',
            'Fixa’t en el costat llarg de cada triangle: fa √(1² + 2²) = √5, igual que el costat del quadrat.',
            'Posa quatre triangles amb el costat llarg sobre cada costat del quadrat: al mig hi queda un forat quadrat.',
            'El forat del mig és un quadret d’1 × 1, i les dues peces del triangle tallat l’omplen.',
        ],
        solucioDudeney: ['<p>El diagrama s’explica tot sol: una de les cinc peces s’ha tallat en dues per formar el quadrat.</p>'],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Pitàgores amb peces.</strong> Aquesta figura és una de les demostracions més antigues del teorema de Pitàgores; se sol atribuir al matemàtic indi Bhaskara (segle XII). Quatre triangles rectangles de catets <i>a</i> i <i>b</i> al voltant d’un quadrat de costat <i>b</i> − <i>a</i> formen un quadrat de costat <i>c</i>, la hipotenusa. Comptant les àrees: <i>c</i>² = 4 · <i>ab</i>/2 + (<i>b</i> − <i>a</i>)² = <i>a</i>² + <i>b</i>². Aquí, <i>a</i> = 1 i <i>b</i> = 2: <i>c</i>² = 4 + 1 = 5.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Les sis peces, a les posicions de la figura de Dudeney, omplen el quadrat sense forats ni trossos de més. Vegeu també «El problema del fuster»: el seu quadrat també té un costat de √5.</p>',
        ],
    },
    {
        id: 'brocat',
        ordre: 3,
        font: { llibre: 'am', numero: 174, titolOriginal: 'The Squares of Brocade' },
        titol: 'Els quadrats de brocat',
        tipus: 'disseccio',
        tauler: 'quadricula',
        dificultat: 2,
        enunciat: [
            '<p>Una vegada que feia una visita a casa d’una senyora, vaig agafar de damunt d’una taula dos quadrats de brocat preciosos. Eren dues peces de treball oriental, totes dues amb el mateix dibuix: un quadriculat delicat.</p>',
            '<p>—Oi que són precioses? —va dir la meva amiga—. Me les va portar un cosí que acaba de tornar de l’Índia. Ara vull que m’ajudi: he decidit ajuntar-les per fer-ne una sola funda de coixí, quadrada i gran. Com ho puc fer espatllant la roba tan poc com sigui possible? És clar que només vull tallar per les línies que separen els quadrets.</p>',
            '<p>Vaig tallar els dos quadrats en quatre peces que encaixaven per formar un quadrat més gran, amb el dibuix ben casat, i quan vaig acabar em vaig adonar que dues de les peces tenien exactament la mateixa àrea: cadascuna tenia el mateix nombre de quadrets. Sabries com es van fer els talls, amb aquestes condicions?</p>',
            '<p class="pantalla">A la pantalla, la roba ja està tallada: són les quatre peces de Dudeney. Munta-les en un quadrat de 10 × 10 amb el dibuix ben casat. A la fitxa per imprimir hi ha el repte complet: fer tu els talls.</p>',
        ],
        regla: 'Munta el quadrat de <strong>10 × 10</strong> amb les quatre peces, sense girar-les. Les flors han de quedar <strong>alternades</strong>, com a la roba sencera.',
        comEsJuga: [
            'Arrossega cada peça fins al quadrat gran: s’enganxa a la quadrícula.',
            'Les peces no es poden girar: el dibuix de la roba quedaria de través.',
            'També pots tocar una peça i després tocar el lloc del quadrat gran on vols el quadret que has tocat.',
        ],
        tecles: '<kbd>Tab</kbd> tria una peça; les fletxes la mouen un quadret; <kbd>Esc</kbd> la torna al seu quadrat.',
        dades: {
            quadrats: [
                { nom: '8 × 8', mida: 8 },
                { nom: '6 × 6', mida: 6 },
            ],
            objectiu: 10,
            peces: [
                { nom: 'A', quadrat: 0, rects: [[0, 0, 2, 6], [2, 0, 2, 4]] },
                { nom: 'B', quadrat: 0, rects: [[0, 6, 2, 2], [2, 4, 2, 4], [4, 0, 4, 8]] },
                { nom: 'C', quadrat: 1, rects: [[0, 0, 2, 6], [2, 0, 4, 2]] },
                { nom: 'D', quadrat: 1, rects: [[2, 2, 4, 4]] },
            ],
            // Translació de cada peça des del seu quadrat original fins al de 10 × 10 [files, columnes]
            solucio: [[0, 4], [2, 2], [4, 0], [-2, -2]],
        },
        pistes: [
            '8 × 8 + 6 × 6 = 64 + 36 = 100 = 10 × 10. Les quatre peces omplen exactament el quadrat gran.',
            'El quadrat de 4 × 4 (la peça D) va a un racó.',
            'Les flors han d’alternar. Si una peça es mou un nombre senar de quadrets (sumant els horitzontals i els verticals), el seu dibuix queda desfasat.',
            'La peça gran, B, ocupa tota la part de baix a la dreta; A va a dalt a la dreta, i C, a baix a l’esquerra.',
        ],
        solucioDudeney: [
            '<p>Per tot el que he pogut esbrinar, només hi ha una solució possible que compleixi les condicions. Les peces encaixen com al diagrama 1, i els diagrames 2 i 3 mostren com s’han de tallar els dos quadrats originals. Es veu que les peces A i C tenen vint quadrets cadascuna, i per tant tenen la mateixa àrea.</p>',
            '<p>Al llibre hi ha encara un altre diagrama, el 4, que també resol el trencaclosques, excepte la petita condició que hi ha en les paraules «vaig tallar els dos quadrats»: en aquest cas el quadrat petit es conserva sencer. Tanmateix, el dono com a exemple d’una característica del trencaclosques. En un problema d’aquesta mena és impossible donar un quart de volta a cap peça si el dibuix ha de casar, però podem donar mitja volta a una peça simètrica, és a dir, posar-la cap per avall. Que en aquests problemes de quadriculats es pugui donar a una peça un quart de volta, mitja volta o cap volta depèn del caràcter del dibuix, del material i també de la forma de la peça.</p>',
        ],
        notaMatematic: [
            '<p><strong>Pitàgores amb peces.</strong> 6² + 8² = 10²: els dos quadrats es poden posar sobre els catets d’un triangle rectangle de costats 6, 8 i 10, i el quadrat gran sobre la hipotenusa. Dudeney ho fa amb només quatre peces, tallant pel quadriculat i sense girar-ne cap. Els talls fan graons, com una escala: és una de les tècniques clàssiques de les disseccions.</p>',
            '<p><strong>Per què el dibuix ha de casar.</strong> A la roba, les flors alternen com les caselles d’un tauler d’escacs: hi ha flor quan la fila més la columna és un nombre parell. Si es mou una peça un nombre enter de quadrets, el dibuix queda bé només si el desplaçament total (els quadrets en horitzontal més els quadrets en vertical) és parell. A la solució de Dudeney, totes quatre peces es desplacen 4 quadrets en total.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Les quatre peces de Dudeney, de 20, 44, 20 i 16 quadrets, omplen el quadrat de 10 × 10 sense forats ni encavalcaments, i el dibuix hi casa. Que sigui l’única solució, com diu Dudeney, no ho hem comprovat.</p>',
        ],
    },
    {
        id: 'fuster',
        ordre: 4,
        font: { llibre: 'am', numero: 151, titolOriginal: 'The Joiner’s Problem' },
        titol: 'El problema del fuster',
        tipus: 'disseccio',
        tauler: 'peces',
        dificultat: 2,
        enunciat: [
            '<p>Sovint he tingut ocasió de remarcar la utilitat pràctica dels trencaclosques: els petits trucs i recursos que aprenem resolent problemes d’entreteniment es poden aplicar a les coses de cada dia.</p>',
            '<p>El fuster de la il·lustració vol tallar aquest tros de fusta en el mínim de peces possible per fer el tauler d’una taula quadrada, sense malbaratar gens de material. Com s’ho ha de fer? Quantes peces et caldrien a tu?</p>',
            '<p class="pantalla">A la pantalla, la fusta ja està tallada en les tres peces de Dudeney. Mou-les i gira-les fins que formin el quadrat. A la fitxa per imprimir hi ha la fusta sencera, per si vols buscar els talls tu.</p>',
        ],
        regla: 'Fes el <strong>quadrat</strong> de punts amb les tres peces de fusta.',
        comEsJuga: [
            'Arrossega les peces: s’enganxen a la xarxa de punts, cada mig quadret.',
            'Per girar una peça, toca-la i fes servir el botó <strong>Gira</strong> (un quart de volta).',
            'Quan les peces omplen el quadrat de punts, sense forats ni trossos de més, està resolt.',
        ],
        tecles: '<kbd>Tab</kbd> tria una peça; les fletxes la mouen; <kbd>R</kbd> la gira; <kbd>⌫</kbd> desfà.',
        dades: {
            // La fusta: un quadrat de 2 × 2 (BCDF) amb el triangle BEF a sobre, tallada per A–D i A–E
            peces: [
                { nom: '1', pts: [[0, 1], [1, 0], [2, 2], [0, 3]] },
                { nom: '2', pts: [[0, 3], [2, 2], [2, 3]] },
                { nom: '3', pts: [[1, 0], [2, 1], [2, 2]] },
            ],
            paper: [[[0, 1], [1, 0], [2, 1], [2, 3], [0, 3]]],
            lletres: { E: [1, -0.15], F: [-0.25, 1.05], B: [2.25, 1.05], A: [2.25, 2.05], C: [2.25, 3.15], D: [-0.25, 3.15] },
            objectiu: [[4, 3], [6, 2], [5, 0], [3, 1]],
            vista: [-0.4, -0.4, 6.8, 3.8],
            solucio: [{ r: 0, x: 4, y: 0 }, { r: 3, x: 1, y: 3 }, { r: 1, x: 5, y: -1 }],
            etiqueta: 'Un tros de fusta en forma de casa (un quadrat amb un triangle a sobre), tallat en tres peces; a la dreta, el lloc d’un quadrat inclinat',
            etiquetaPaper: 'Un tros de fusta en forma de casa: un quadrat amb un triangle a sobre',
            etiquetaSolucio: 'El quadrat fet amb les tres peces',
            peuSolucio: 'Els talls de la A a la D i de la A a la E, i el quadrat que formen les tres peces.',
            textResolt: 'Tres peces i cap tros de fusta perdut: el tauler fa √5 de costat.',
            resumSolucio: 'La peça gran es queda on és; els dos triangles giren un quart de volta.',
        },
        figuraEnunciat: { peu: 'El tros de fusta del fuster.', despres: 1, paper: true },
        pistes: [
            'La fusta és un quadrat de 2 × 2 amb un triangle a sobre que en fa una quarta part: l’àrea total és 4 + 1 = 5. El tauler quadrat tindrà un costat de √5.',
            '√5 és la diagonal d’un rectangle d’1 × 2. Busca a la fusta segments d’aquesta llargada: van d’una cantonada fins a la meitat d’un costat.',
            'La peça gran no s’ha de moure gens: dos dels seus costats ja són costats del quadrat.',
            'Les dues peces petites són triangles: cadascuna ha de girar un quart de volta, una en un sentit i l’altra en l’altre.',
        ],
        solucioDudeney: [
            '<p>Res no podria ser més fàcil que la solució d’aquest trencaclosques… quan saps com fer-ho. I tanmateix sol desconcertar força el principiant si el vol resoldre amb el mínim de peces possible: tres. Només cal trobar el punt A, a mig camí entre la B i la C, i tallar de la A a la D i de la A a la E. Les tres peces formen llavors un quadrat, com es veu a la figura.</p>',
            '<p>És clar que les proporcions de la figura original han de ser les correctes: el triangle BEF és exactament una quarta part del quadrat BCDF. Si traceu les línies de la B a la D i de la C a la F, es veurà clarament.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Per què funciona.</strong> Els talls A–D i A–E fan √5 de llarg (són la diagonal d’un rectangle de 2 × 1 i la d’un d’1 × 2) i formen un angle recte. Per això la peça gran ja té dos costats del quadrat, i els dos triangles petits (catets 1 i 2, i 1 i √2) omplen exactament el que falta. És la mateixa idea que «Un quadrat fàcil»: tots dos quadrats tenen àrea 5.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Les tres peces, a les posicions de la figura de Dudeney, omplen el quadrat sense forats ni trossos de més, i la fusta sencera té exactament l’àrea del quadrat: 5.</p>',
        ],
    },
    {
        id: 'mercer',
        ordre: 5,
        font: { llibre: 'cp', numero: 26, titolOriginal: 'The Haberdasher’s Puzzle' },
        titol: 'El trencaclosques del mercer',
        tipus: 'disseccio',
        tauler: 'lliure',
        dificultat: 3,
        enunciat: [
            '<p>Els pelegrins van insistir molt perquè el mercer, que anava amb la colla, els proposés algun trencaclosques, però durant molt de temps no hi va haver manera. Finalment, en una de les parades del camí, va dir que els ensenyaria una cosa que els «cargolaria el cervell com la corda d’una campana». La veritat és que els feia una broma, perquè ell mateix no sabia la resposta del trencaclosques que els va posar.</p>',
            '<p>Va treure un tros de roba en forma de triangle equilàter perfecte i va dir: —Hi ha algú de vosaltres que sàpiga tallar bé la roba? Em penso que no. Cadascú al seu ofici: el savi pot aprendre del criat, i l’home assenyat, del ximple. Doncs ensenyeu-me, si en sabeu, com es pot tallar aquest tros de roba en quatre peces que, ajuntades, facin un quadrat perfecte.</p>',
            '<p>Alguns dels pelegrins més instruïts van trobar com fer-ho amb cinc peces, però no amb quatre. I quan van pressionar el mercer perquè donés la solució, va haver de reconèixer, després de fer moltes voltes, que no la sabia fer amb cap nombre de peces. «Per sant Francesc», va dir, «qualsevol bergant pot inventar una endevinalla; endevinar-la és cosa dels qui en saben». Per poc no es va endur una bona pallissa. El més curiós és que jo he trobat que realment es pot fer amb només quatre peces, i sense girar del revés cap peça. El mètode és subtil, però crec que el lector trobarà el problema interessantíssim.</p>',
            '<p class="pantalla">A la pantalla, la roba ja està tallada: són les quatre peces de Dudeney. Mou-les i gira-les fins que formin el quadrat. A la fitxa per imprimir hi ha el triangle sencer, per si vols buscar els talls tu.</p>',
        ],
        regla: 'Fes un <strong>quadrat</strong> amb les quatre peces del triangle. Les pots girar, però no posar-les del revés.',
        comEsJuga: [
            'Arrossega les peces. Per girar-ne una, toca-la i fes servir el botó <strong>Gira</strong>, o toca-la dues vegades seguides.',
            'Quan una peça queda a prop del seu lloc dins del quadrat de punts, s’hi enganxa.',
            'Les peces no es poden girar del revés, com si donessis la volta a la roba.',
        ],
        tecles: '<kbd>Tab</kbd> tria una peça; les fletxes la mouen; <kbd>R</kbd> la gira 90°; <kbd>Esc</kbd> la torna al triangle.',
        dades: {
            // La construcció de Dudeney, amb el triangle de costat 6
            punts: {
                A: [0, 0],
                B: [3, 5.196152],
                C: [6, 0],
                D: [1.5, 2.598076],
                E: [4.5, 2.598076],
                F: [7.098076, 4.098076],
                G: [3.549038, 2.049038],
                H: [2.525889, 6.017337],
                J: [1.527046, 0],
                K: [4.527046, 0],
                L: [2.799038, 1.111599],
                M: [3.228008, 1.486477],
            },
            peces: [
                { nom: '1', vertexs: ['D', 'B', 'E', 'L'] },
                { nom: '2', vertexs: ['A', 'D', 'L', 'J'] },
                { nom: '3', vertexs: ['E', 'C', 'K', 'M'] },
                { nom: '4', vertexs: ['J', 'K', 'M'] },
            ],
            // La posició de cada peça a la solució de Dudeney (gir al voltant del seu centre i translació)
            solucio: [
                { g: 0, x: 0, y: 0 },
                { g: 180, x: 0.129783, y: 3.125668 },
                { g: 180, x: -0.157517, y: 3.002653 },
                { g: 0, x: -0.054091, y: 5.196152 },
            ],
            quadrat: [[2.799038, 1.111599], [5.771992, 3.709675], [3.173916, 6.68263], [0.200962, 4.084553]],
            // La cadena de frontisses: la peça 2 gira al voltant de D, la 3 al voltant d'E i la 4 al voltant de K
            frontisses: [
                { peca: 1, pare: 0, punt: 'D', angle: -180 },
                { peca: 2, pare: 0, punt: 'E', angle: 180 },
                { peca: 3, pare: 2, punt: 'K', angle: 180 },
            ],
        },
        pistes: [
            'El quadrat té la mateixa àrea que el triangle: les quatre peces l’omplen justes, sense forats ni trossos que sobresurtin.',
            'La peça 1, la més gran, pot entrar al quadrat sense girar-la.',
            'Les peces 2 i 3 han de fer mitja volta (dos girs de 90°).',
            'La peça 4, el triangle petit, tampoc no gira: només s’ha de desplaçar.',
        ],
        solucioDudeney: [
            '<p>La il·lustració mostra com es pot tallar el tros de roba triangular en quatre peces que encaixen i formen un quadrat perfecte. Divideix AB per la meitat a D i BC a E; allarga la línia AE fins a F de manera que EF sigui igual a EB; divideix AF per la meitat a G i traça l’arc AHF; allarga EB fins a H: EH és la llargària del costat del quadrat. Des d’E, amb radi EH, traça l’arc HJ, i fes JK igual a BE. Ara, des dels punts D i K, baixa perpendiculars a EJ, que la tallen a L i a M. Si ho has fet amb cura, ja tens les línies per on cal tallar.</p>',
            '<p>Vaig presentar aquest problema a la Royal Society, a Burlington House, el 17 de maig de 1905, i també a la Royal Institution el mes següent, en una forma més general: «Un nou problema de superposició: demostració que un triangle equilàter es pot tallar en quatre peces que es poden tornar a muntar formant un quadrat, amb alguns exemples d’un mètode general per transformar per dissecció qualsevol triangle en un quadrat». També es va publicar com a repte per als lectors del <i>Daily Mail</i> (números de l’1 i el 8 de febrer de 1905), però, tot i que van arribar centenars de respostes, no n’hi va haver cap de correcta. S’ha de reconèixer el mèrit del senyor C. W. M’Elroy, l’únic que em va enviar la solució correcta quan vaig publicar el problema per primera vegada, al <i>Weekly Dispatch</i>, el 1902.</p>',
            '<p>Afegeixo una il·lustració que mostra el trencaclosques en una forma pràctica força curiosa: fet de caoba polida amb frontisses de llautó, per a certs públics. Les quatre peces formen una mena de cadena: plegades cap a un costat fan el triangle i, cap a l’altre, el quadrat.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Per què EH és el costat del quadrat.</strong> L’àrea del triangle és base × altura / 2 = EB × AE. El punt H és a la semicircumferència de diàmetre AF, i EH és perpendicular a AF, perquè l’altura AE és perpendicular a BC. Pel teorema de l’altura, EH² = AE × EF = AE × EB: el quadrat de costat EH té la mateixa àrea que el triangle. És la construcció clàssica de la <i>mitjana geomètrica</i>, que ja és als <i>Elements</i> d’Euclides.</p>',
            '<p><strong>Quatre peces és el mínim.</strong> Dudeney va publicar el trencaclosques al seu diari el 1902, i durant més de cent anys ningú no va saber si es podia fer amb tres peces. El 2024, Erik Demaine, Tonan Kamata i Ryuhei Uehara van demostrar que no: si no es pot girar cap peça del revés, no hi ha cap manera de transformar el triangle en el quadrat amb tres peces o menys. Si es poden girar del revés, encara no se sap!</p>',
            '<p><strong>Una cadena de frontisses.</strong> Les quatre peces, unides per tres frontisses (a D, a E i a K), fan una cadena que es plega cap a un costat i cap a l’altre. És una de les primeres disseccions articulades conegudes, i la més famosa. Prova-ho amb el control lliscant de la solució.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Hem refet la construcció de Dudeney amb coordenades: per a un triangle de costat 6, el costat del quadrat surt 3,948…, l’arrel quadrada de l’àrea del triangle, tal com cal. Mostrejant 90 000 punts, les quatre peces cobreixen el quadrat sense forats ni encavalcaments, i la cadena de frontisses passa del triangle al quadrat sense que les peces es trepitgin.</p>',
        ],
    },
]);
