/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/quadrats/problemes.js
 * ROL: Els enigmes de quadrats: el vuit rebel (AM 399) i el quadrat de Bachet
 *   (AM 304). Enunciat, pistes i solució de Dudeney traduïts i adaptats; la nota
 *   del matemàtic és nostra (amb la discrepància del vuit rebel: el 0).
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js). Cartes: figura
 *   (A K Q J) + pal (D diamants, S piques, H cors, C trèvols), com a Dudeney.
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'vuit',
        ordre: 1,
        font: { llibre: 'am', numero: 399, titolOriginal: 'The Troublesome Eight' },
        titol: 'El vuit rebel',
        tipus: 'quadrats',
        tauler: 'magic',
        dificultat: 1,
        enunciat: [
            '<p>Gairebé tothom sap que un <em>quadrat màgic</em> és una disposició de nombres en forma de quadrat de manera que totes les files, totes les columnes i les dues diagonals llargues sumen el mateix. Per exemple, et costaria poc posar un nombre diferent a cadascuna de les nou caselles de la figura de manera que les files, les columnes i les diagonals sumin 15. I, al primer intent, segurament et trobaries amb un 8 en un dels racons.</p>',
            '<p>El trencaclosques és fer el quadrat màgic, amb les mateixes condicions, però amb el 8 al lloc que indica la figura.</p>',
        ],
        regla: 'Omple el quadrat amb <strong>nou nombres diferents</strong>: les files, les columnes i les diagonals han de sumar <strong>15</strong>. El 8 no es mou.',
        comEsJuga: [
            'Toca una casella i escriu-hi un nombre amb el teclat de sota (o amb el del teu ordinador).',
            'Pots escriure fraccions: «4½», «4 1/2», «9/2» i «4,5» volen dir el mateix.',
            'La suma de cada fila, columna i diagonal surt a la vora, i quan fa 15 es marca amb ✓.',
        ],
        tecles: 'les fletxes mouen entre caselles; escriu el nombre i prem <kbd>Retorn</kbd>; <kbd>⌫</kbd> esborra.',
        dades: {
            total: 15,
            fixes: { 1: '8' },
            solucio: ['4½', '8', '2½', '3', '5', '7', '7½', '2', '5½'],
        },
        pistes: [
            'Suma les tres files: si cadascuna fa 15, entre totes fan 45, que és la suma dels nou nombres.',
            'La casella del centre és a la fila del mig, a la columna del mig i a les dues diagonals. Si sumes aquestes quatre línies, et surt que el centre ha de ser 5.',
            'Amb el 8 i el 5 ja tens la columna del mig: 8 + 5 + ? = 15.',
            'Dudeney ho diu ben clar: «un nombre diferent». No diu «una xifra», ni «un nombre enter»… Prova-ho amb mitjos!',
        ],
        solucioDudeney: [
            '<p>Les condicions eren posar un nombre diferent a cadascuna de les nou caselles de manera que les tres files, les tres columnes i les dues diagonals sumessin 15. Probablement el lector s’ha imposat una tasca impossible perquè ha llegit en les condicions una cosa que no hi era, un error ben freqüent quan es resolen trencaclosques.</p>',
            '<p>Si hagués dit «una xifra diferent» en lloc d’«un nombre diferent», hauria estat ben impossible amb el 8 en un lloc que no fos un racó. I també ho hauria estat si hagués dit «un nombre enter diferent». Però un nombre, és clar, pot ser fraccionari, i aquí hi ha el secret del trencaclosques. La disposició de la figura compleix exactament les condicions: tots els nombres són diferents, i el quadrat suma 15 de les vuit maneres demanades.</p>',
        ],
        notaMatematic: [
            '<p><strong>Per què el centre ha de ser 5.</strong> La fila del mig, la columna del mig i les dues diagonals passen totes pel centre. Si les sumem, surt 4 · 15 = 60, i hi hem comptat totes les caselles una vegada i el centre tres vegades més: 45 + 3 · centre = 60. Per tant, el centre és 5.</p>',
            '<p><strong>Totes les solucions.</strong> Amb el 5 al centre i el 8 a dalt, a baix hi ha d’anar un 2. Si a la cantonada de dalt a l’esquerra hi posem un nombre <i>a</i>, la resta del quadrat queda decidida:</p>',
            '<table class="taula-dudeney taula-familia"><tbody><tr><td><i>a</i></td><td>8</td><td>7 − <i>a</i></td></tr><tr><td>12 − 2<i>a</i></td><td>5</td><td>2<i>a</i> − 2</td></tr><tr><td>3 + <i>a</i></td><td>2</td><td>10 − <i>a</i></td></tr></tbody></table>',
            '<p>Amb <i>a</i> = 4½ surt la solució de Dudeney. Amb nombres enters positius, <i>a</i> hauria de ser 2, 3, 4 o 5, i sempre se’n repeteix algun: per això Dudeney diu que amb enters és impossible.</p>',
            '<p>⚠ <strong>Un detall que se li va escapar.</strong> Amb <i>a</i> = 6 surt 6, 8, 1 / 0, 5, 10 / 9, 2, 4: nou nombres enters, tots diferents, i totes les línies sumen 15… però hi ha el 0 i el 10. Si el 0 compta com a nombre enter (i avui hi compta), el vuit rebel també té solució sense fraccions. Dudeney segurament pensava en nombres positius. Amb <i>a</i> = 1 surt el mateix quadrat, com vist en un mirall.</p>',
            '<p>Al tauler s’accepta qualsevol solució correcta, també amb altres fraccions (amb <i>a</i> = 1½, per exemple) o amb nombres negatius. I una curiositat: el quadrat màgic amb els nombres de l’1 al 9 és únic, llevat de girs i reflexos; a la Xina es coneix des de fa més de dos mil anys, amb el nom de <i>Lo Shu</i>.</p>',
        ],
    },
    {
        id: 'bachet',
        ordre: 2,
        font: { llibre: 'am', numero: 304, titolOriginal: 'Bachet’s Square' },
        titol: 'El quadrat de Bachet',
        tipus: 'quadrats',
        tauler: 'cartes',
        dificultat: 2,
        enunciat: [
            '<p>Un dels trencaclosques de cartes més antics és de Claude-Gaspard Bachet de Méziriac, i crec que es va publicar per primera vegada a l’edició de 1624 de la seva obra. Col·loca les setze figures de la baralla (comptant-hi els asos) en un quadrat de manera que en cap fila de quatre cartes, ni horitzontal, ni vertical, ni diagonal, hi hagi dues cartes del mateix pal ni del mateix valor.</p>',
            '<p>Això ja és prou fàcil, però una part del trencaclosques és trobar de quantes maneres diferents es pot fer. L’eminent matemàtic francès A. Labosne, a la seva edició moderna de Bachet, hi dona una resposta equivocada. I tanmateix el trencaclosques és força fàcil. Cada disposició en dona set més girant el quadrat i reflectint-lo en un mirall, i Bachet les compta com a diferents.</p>',
            '<p>Fixa’t que diu «fila de quatre cartes»: les úniques diagonals que cal tenir en compte són les dues llargues.</p>',
            '<p class="pantalla">Les setze cartes són l’as (A), el rei (K), la dama (Q) i el valet (J) de cada pal: diamants ♦, piques ♠, cors ♥ i trèvols ♣.</p>',
        ],
        regla: 'Posa les 16 cartes al quadrat: <strong>cap fila, columna ni diagonal llarga</strong> pot tenir dues cartes del mateix pal ni del mateix valor.',
        comEsJuga: [
            'Arrossega una carta de la pila fins a una casella, o toca la carta i després la casella.',
            'Per moure una carta del quadrat, arrossega-la a una altra casella (si n’hi ha una altra, s’intercanvien) o torna-la a la pila.',
            'Quan hi ha les 16 cartes, es marquen les línies que tenen dues cartes del mateix pal o del mateix valor.',
        ],
        tecles: 'les fletxes mouen el cursor pel quadrat; escriu el valor i el pal de la carta (<kbd>A</kbd> <kbd>K</kbd> <kbd>Q</kbd> <kbd>J</kbd> i <kbd>D</kbd> diamants, <kbd>P</kbd> piques, <kbd>C</kbd> cors, <kbd>T</kbd> trèvols: <kbd>A</kbd> <kbd>D</kbd> és l’as de diamants); <kbd>Supr</kbd> la treu.',
        dades: {
            solucio: ['AD', 'KS', 'QH', 'JC', 'QC', 'JH', 'AS', 'KD', 'JS', 'QD', 'KC', 'AH', 'KH', 'AC', 'JD', 'QS'],
            diagrama1: ['A', 'K', 'Q', 'J', 'Q', 'J', 'A', 'K', 'J', 'Q', 'K', 'A', 'K', 'A', 'J', 'Q'],
            diagrama2: ['D', 'S', 'H', 'C', 'C', 'H', 'S', 'D', 'S', 'D', 'C', 'H', 'H', 'C', 'D', 'S'],
        },
        extra: {
            pregunta: 'Ara la pregunta de Bachet: <strong>de quantes maneres</strong> es pot fer, si comptem com a diferents els girs i els reflexos?',
            resposta: 1152,
            be: 'Exacte: 1.152. Labosne s’havia descomptat; mira el raonament de Dudeney a la solució.',
            malament: 'No és aquest nombre. Una pista: per a cada esquema de valors i de pals, la fila de dalt es pot escriure de 24 maneres.',
        },
        pistes: [
            'Pensa-ho per separat: primer només els valors (A, K, Q, J), sense repetir-ne cap en cap fila, columna ni diagonal; després, el mateix amb els pals.',
            'Una manera de posar els valors, fila per fila: A K Q J, després Q J A K, després J Q K A, i finalment K A J Q.',
            'Els pals han de seguir un esquema semblant, però «girat». Per exemple, la primera columna de pals pot ser ♦ ♣ ♠ ♥.',
            'Combina els dos esquemes: la primera fila pot ser A♦ K♠ Q♥ J♣, i la segona, Q♣ J♥ A♠ K♦.',
        ],
        solucioDudeney: [
            '<p>Fem servir A, K, Q, J per a l’as, el rei, la dama i el valet, i ♦, ♠, ♥, ♣ per als diamants, les piques, els cors i els trèvols. Als diagrames 1 i 2 hi ha les dues maneres possibles d’ordenar cada grup de manera que no n’hi hagi dos d’iguals en línia (tot i que un quart de volta del diagrama 1 dona la disposició del 2). Si superposem aquests dos quadrats, obtenim la disposició del diagrama 3, que és una solució.</p>',
            '<p>Però en cada quadrat podem posar els símbols de la fila de dalt de vint-i-quatre maneres diferents sense alterar l’esquema: per exemple, posant les piques on hi havia els diamants, els cors on hi havia les piques, els trèvols on hi havia els cors i els diamants on hi havia els trèvols. És clar, doncs, que hi ha d’haver 24 × 24 = 576 maneres de combinar els dos esquemes primitius. L’error de Labosne va ser suposar que els valors s’havien de col·locar en la forma 1 i els pals en la forma 2: així hi comptava els reflexos i les mitges voltes, però no els quarts de volta. És evident que es poden intercanviar. Per tant, la resposta correcta és 2 × 576 = 1.152, comptant com a diferents els reflexos i els girs.</p>',
            '<p>Dit d’una altra manera: les parelles de la fila de dalt es poden escriure de 16 × 9 × 4 × 1 = 576 maneres diferents, i després el quadrat es pot completar de 2 maneres: 1.152 en total.</p>',
        ],
        notaMatematic: [
            '<p><strong>Quadrats grecollatins.</strong> Un quadrat en què cada símbol surt una vegada a cada fila i a cada columna s’anomena <i>quadrat llatí</i>. Aquí els valors formen un quadrat llatí, i els pals, un altre; i com que cada parella valor–pal hi surt exactament una vegada, junts formen un <i>quadrat grecollatí</i>. Leonhard Euler els va estudiar el 1782 amb el problema dels 36 oficials (6 graus i 6 regiments): va dir que no n’hi ha cap de 6 × 6, i tenia raó (ho va demostrar Gaston Tarry el 1901). Però també pensava que no n’hi havia de 10 × 10, de 14 × 14…, i aquí s’equivocava: el 1959, Bose, Shrikhande i Parker van demostrar que n’hi ha de totes les mides, llevat de 2 i 6.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca exhaustiva que va posant les cartes una per una, sense repetir pal ni valor en cap fila, columna o diagonal llarga, en troba exactament 1.152: Dudeney té raó, i Labosne, no. També hem comprovat el diagrama 3 de Dudeney.</p>',
            '<p>Avui, aquests quadrats serveixen, per exemple, per dissenyar experiments: provar quatre adobs en quatre varietats d’un cultiu sense que cap combinació es repeteixi en una mateixa fila o columna del camp.</p>',
        ],
    },
]);
