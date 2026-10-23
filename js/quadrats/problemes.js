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
            etiqueta: 'Un quadrat de 3 × 3 amb un 8 a la casella del mig de dalt',
            etiquetaSolucio: 'La solució de Dudeney: 4½, 8, 2½; 3, 5, 7; 7½, 2, 5½',
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
    {
        id: 'domino',
        ordre: 3,
        font: { llibre: 'am', numero: 406, titolOriginal: 'The Eighteen Dominoes' },
        titol: 'Les divuit fitxes de dòmino',
        tipus: 'quadrats',
        tauler: 'domino',
        dificultat: 2,
        enunciat: [
            '<p>La il·lustració mostra divuit fitxes de dòmino col·locades en forma de quadrat, de manera que els punts de cadascuna de les sis columnes, de les sis files i de les dues diagonals llargues sumen 13. És la suma més petita possible amb qualsevol tria de fitxes d’una capsa normal de vint-i-vuit.</p>',
            '<p>La suma més gran possible és 23, i se’n pot trobar fàcilment una solució canviant cada nombre pel que li falta per arribar a 6: cada blanc per un 6, cada 1 per un 5, cada 2 per un 4, el 3 per un 3, el 4 per un 2, el 5 per un 1 i el 6 per un blanc. Però el trencaclosques consisteix a triar divuit fitxes i col·locar-les (exactament en la forma de la il·lustració) de manera que les sumes siguin 18 en totes catorze direccions.</p>',
            '<p class="pantalla">A la pantalla, la capsa amb les 28 fitxes és a sota del quadrat, i les sumes de cada fila, de cada columna i de les dues diagonals es veuen a la vora.</p>',
        ],
        regla: 'Tria 18 fitxes i posa-les de peu perquè les <strong>6 files</strong>, les <strong>6 columnes</strong> i les <strong>2 diagonals</strong> sumin <strong>18</strong>.',
        comEsJuga: [
            'Toca una fitxa de la capsa i després un lloc del quadrat. També la pots arrossegar.',
            'Toca una fitxa del quadrat per triar-la; si la tornes a tocar, gira cap per avall. Amb els botons, la pots girar o tornar a la capsa.',
            'Si toques dues fitxes del quadrat l’una darrere l’altra, s’intercanvien.',
        ],
        tecles: '<kbd>Tab</kbd> recorre la capsa i el quadrat; <kbd>Retorn</kbd> tria i posa; <kbd>G</kbd> gira la fitxa triada; <kbd>Supr</kbd> la torna a la capsa; <kbd>⌫</kbd> desfà.',
        dades: {
            n: 6,
            suma: 18,
            sumaExemple: 13,
            // Les fitxes de peu, columna per columna i de dalt a baix: [punts de dalt, punts de baix]
            exemple: [[3, 4], [2, 1], [0, 3], [5, 0], [1, 1], [5, 1], [1, 6], [3, 3], [0, 0], [0, 2], [2, 4], [1, 4], [4, 0], [3, 2], [1, 3], [0, 1], [2, 2], [6, 2]],
            // La solució de Dudeney (al llibre, amb les fitxes ajagudes: aquí, el mateix quadrat girat)
            solucio: [[6, 3], [1, 5], [0, 3], [3, 1], [6, 2], [2, 4], [3, 3], [4, 3], [5, 0], [1, 4], [1, 2], [6, 4], [0, 4], [6, 6], [0, 2], [5, 3], [0, 0], [5, 5]],
            etiqueta: 'Un quadrat de 6 × 6 per a divuit fitxes de dòmino de peu, i a sota la capsa amb les 28 fitxes',
            etiquetaExemple: 'El quadrat de dòminos de Dudeney en què totes les línies sumen 13',
            etiquetaSolucio: 'El quadrat de dòminos de Dudeney en què totes les línies sumen 18',
            peuSolucio: 'Totes les files, les columnes i les dues diagonals sumen 18.',
        },
        figuraEnunciat: { peu: 'La il·lustració de Dudeney: totes les línies sumen 13.', despres: 1 },
        pistes: [
            'Les sis files sumen 6 × 18 = 108: les divuit fitxes que triïs han de tenir 108 punts entre totes. La capsa sencera en té 168.',
            'Per tant, les deu fitxes que es queden a la capsa han de sumar 168 − 108 = 60 punts.',
            'Ajusta les sumes girant fitxes: girar una fitxa no canvia la suma de la seva columna ni la de les altres columnes, però sí la de dues files.',
            'Dudeney fa servir el doble blanc, el doble 3, el doble 5 i el doble 6. La primera columna de la seva solució, de dalt a baix: 6–3, 1–5 i 0–3.',
        ],
        solucioDudeney: [
            '<p>La il·lustració s’explica tota sola. Es veurà que els punts de cada columna, de cada fila i de cada diagonal llarga sumen 18, tal com es demanava.</p>',
            '<p class="pantalla">A la il·lustració de la solució, Dudeney posa les fitxes ajagudes; aquí és el mateix quadrat girat, amb les fitxes de peu com a l’enunciat. Les sumes no canvien.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Per què 13 és el mínim.</strong> Si totes les línies sumen <i>S</i>, les sis files juntes sumen 6<i>S</i>: els punts de les divuit fitxes han de ser un múltiple de 6. Les divuit fitxes amb menys punts en sumen 76, i el primer múltiple de 6 que no és més petit que 76 és 78 = 6 × 13. I si es canvia cada nombre pel que li falta per arribar a 6, cada línia passa de sumar <i>S</i> a sumar 36 − <i>S</i>, i les fitxes continuen sent totes diferents: per això el màxim és 36 − 13 = 23.</p>',
            '<p><strong>Comprovat per ordinador.</strong> El quadrat de 13 de l’enunciat i el de 18 de la solució tenen divuit fitxes diferents i les catorze sumes correctes. No hem comptat quantes solucions de 18 hi ha.</p>',
        ],
    },
    {
        id: 'prunes',
        ordre: 4,
        font: { llibre: 'am', numero: 409, titolOriginal: 'The Baskets of Plums' },
        titol: 'Les cistelles de prunes',
        tipus: 'quadrats',
        tauler: 'magic',
        dificultat: 2,
        enunciat: [
            '<p>Aquesta és la forma en què vaig presentar per primera vegada la qüestió dels quadrats màgics amb nombres primers. Avisaré el lector que hi ha un petit parany.</p>',
            '<p>Un fruiter tenia nou cistelles. A cada cistella hi havia prunes (totes sanes i madures), i el nombre de prunes de cada cistella era diferent. Posades com a la il·lustració, en tres files de tres, formaven un quadrat màgic: si agafava tres cistelles qualssevol en línia, en qualsevol de les vuit direccions possibles, sempre hi havia el mateix nombre de prunes. Aquesta part del trencaclosques és prou fàcil d’entendre. Però el que ve ara sembla una mica estrany a primera vista.</p>',
            '<p>El fruiter va dir a un dels seus homes que repartís el contingut de la cistella que volgués entre uns quants nens, donant prunes a cada nen de manera que tots en rebessin el mateix nombre. Però l’home va veure que era del tot impossible, triés la cistella que triés i hi fes venir tants nens com volgués. Digues quantes prunes hi havia a cada cistella perquè passés això.</p>',
            '<p class="pantalla">A la il·lustració de Dudeney hi ha nou cistelles ben plenes, en tres files de tres.</p>',
        ],
        regla: 'Escriu les prunes de cada cistella: <strong>nou nombres diferents</strong>, totes les línies han de <strong>sumar el mateix</strong>, i cap cistella no s’ha de poder repartir a parts iguals entre uns quants nens.',
        comEsJuga: [
            'Toca una casella i escriu-hi un nombre amb el teclat de sota (o amb el del teu ordinador).',
            'La suma de cada fila, columna i diagonal surt a la vora, i les que coincideixen es marquen amb ✓.',
        ],
        tecles: 'les fletxes mouen entre caselles; escriu el nombre i prem <kbd>Retorn</kbd>; <kbd>⌫</kbd> esborra.',
        dades: {
            total: null,
            condicio: 'primers',
            // El diagrama B de Dudeney (constant 213)
            solucio: ['83', '29', '101', '89', '71', '53', '41', '113', '59'],
            diagrames: [
                { nom: 'A', valors: ['7', '61', '43', '73', '37', '1', '31', '13', '67'], etiqueta: 'Diagrama A: 7, 61, 43; 73, 37, 1; 31, 13, 67' },
                { nom: 'B', valors: ['83', '29', '101', '89', '71', '53', '41', '113', '59'], etiqueta: 'Diagrama B: 83, 29, 101; 89, 71, 53; 41, 113, 59' },
                { nom: 'C', valors: ['103', '79', '37', '7', '73', '139', '109', '67', '43'], etiqueta: 'Diagrama C: 103, 79, 37; 7, 73, 139; 109, 67, 43' },
                { nom: 'D', valors: ['1669', '199', '1249', '619', '1039', '1459', '829', '1879', '409'], etiqueta: 'Diagrama D: 1669, 199, 1249; 619, 1039, 1459; 829, 1879, 409' },
            ],
            etiqueta: 'Un quadrat de 3 × 3 buit, per a les nou cistelles',
            etiquetaSolucio: 'El diagrama B de Dudeney: 83, 29, 101; 89, 71, 53; 41, 113, 59',
            resumSolucio: 'El diagrama B: nou primers, i totes les línies sumen 213.',
            gravat: { 4: '71' },
        },
        pistes: [
            'Una cistella de 15 prunes es pot repartir entre 3 nens (5 cadascun) o entre 5 (3 cadascun). Quins nombres no es poden repartir mai així?',
            '«Entre uns quants nens» vol dir més d’un, i «prunes a cada nen», més d’una cadascun: els nou nombres han de ser primers. Però compte amb el parany!',
            'En un quadrat màgic de 3 × 3, el nombre del mig és la tercera part de la suma de cada línia, i els que tenen a banda i banda (en línia amb el mig) sumen el doble del del mig.',
            'Prova amb el 71 al mig: la suma de cada línia serà 213. A la fila de dalt, 83, 29 i 101.',
        ],
        solucioDudeney: [
            '<p>Com que el fruiter va dir al seu home que repartís el contingut d’una de les cistelles «entre uns quants nens», no s’hi valia donar la cistella sencera a un sol nen; i com que també li va dir que donés «prunes a cada nen, de manera que tots en rebessin el mateix nombre», tampoc no s’hi valia triar tants nens com prunes hi havia a la cistella i donar-ne una a cadascun. Per tant, si el nombre de prunes de cada cistella era un nombre primer, l’home tenia raó: el repartiment era impossible. El trencaclosques es redueix, doncs, a fer un quadrat màgic amb nou nombres primers diferents.</p>',
            '<p>El diagrama A és un quadrat màgic de nombres primers, i és el que dona la suma constant més petita possible. Pel que fa al petit parany que deia, és clar que el diagrama A queda descartat per les paraules «a cada cistella hi havia prunes», perquè una pruna no són prunes. I com que se’ns remetia a les cistelles «com a la il·lustració», és evident, sense comptar-les, que a cada cistella hi ha com a mínim més de 7 prunes. Per tant, en sentit estricte, el C també queda descartat. Qualsevol quantitat de més de 20 i de menys de, posem, 250 seria ben possible, i hi ha moltes disposicions dins d’aquests límits. El diagrama B n’és una. És clar que també podem tenir en compte els dobles fons que fan servir tan sovint els fruiters a les cistelles perquè semblin més plenes del que són.</p>',
            '<p>Alguns lectors van suposar (no sé per què) que en aquest problema els nombres no podien anar en progressió aritmètica, i per això dono el diagrama D, per mostrar que s’equivocaven. Els nombres són 199, 409, 619, 829, 1039, 1249, 1459, 1669 i 1879, tots primers, amb una diferència de 210.</p>',
        ],
        posicioFiguraSolucio: 2,
        notaMatematic: [
            '<p>⚠ <strong>L’1 no és primer.</strong> Dudeney diu que el diagrama A és «un quadrat de nombres primers», però avui no comptem l’1 entre els primers: si el comptéssim, la descomposició en factors primers no seria única (6 = 2 · 3 = 1 · 2 · 3…). En temps de Dudeney encara n’hi havia que el comptaven. El seu parany («una pruna no són prunes») el descarta igualment.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Els quatre diagrames són quadrats màgics, de constants 111, 213, 219 i 3117, i tots els nombres són primers llevat de l’1 del diagrama A. Amb primers de veritat, la constant més petita és 177 (17, 89, 71; 113, 59, 5; 47, 29, 101), i si a més totes les cistelles han de tenir més de 7 prunes, és 213: el diagrama B de Dudeney és el més petit que compleix totes les seves condicions.</p>',
        ],
    },
    {
        id: 'compostos',
        ordre: 5,
        font: { llibre: 'am', numero: 411, titolOriginal: 'A Magic Square of Composites' },
        titol: 'Un quadrat màgic de compostos',
        tipus: 'quadrats',
        tauler: 'magic',
        dificultat: 2,
        enunciat: [
            '<p>Com que acabem de parlar de com es construeixen quadrats màgics amb nombres primers, el problema següent n’és un bon company. Fes un quadrat màgic amb nou nombres compostos consecutius: els més petits possible.</p>',
            '<p class="pantalla">Un nombre compost és el que es pot escriure com a producte de nombres més petits: 4, 6, 8, 9, 10… (ni l’1 ni els primers ho són).</p>',
        ],
        regla: 'Omple el quadrat amb <strong>nou compostos consecutius</strong>, els més petits possible, perquè totes les línies <strong>sumin el mateix</strong>.',
        comEsJuga: [
            'Toca una casella i escriu-hi un nombre amb el teclat de sota (o amb el del teu ordinador).',
            'La suma de cada fila, columna i diagonal surt a la vora, i les que coincideixen es marquen amb ✓.',
        ],
        tecles: 'les fletxes mouen entre caselles; escriu el nombre i prem <kbd>Retorn</kbd>; <kbd>⌫</kbd> esborra.',
        dades: {
            total: null,
            condicio: 'compostos',
            minim: 114,
            solucio: ['121', '114', '119', '116', '118', '120', '117', '122', '115'],
            etiqueta: 'Un quadrat de 3 × 3 buit',
            etiquetaSolucio: 'La solució de Dudeney: 121, 114, 119; 116, 118, 120; 117, 122, 115',
            resumSolucio: 'Del 114 al 122, i totes les línies sumen 354.',
            gravat: { 4: '118' },
        },
        pistes: [
            'Busca nou nombres seguits sense cap primer entre mig: un «forat» de més de 9 entre dos primers seguits.',
            'No cal que passis de 150.',
            'Després del 113, el primer següent és el 127.',
            'Amb els nou nombres seguits de <i>n</i> a <i>n</i> + 8, al mig del quadrat hi va <i>n</i> + 4, i cada línia suma 3(<i>n</i> + 4). Col·loca’ls com els nombres de l’1 al 9 en un quadrat màgic normal, sumant-hi <i>n</i> − 1.',
        ],
        solucioDudeney: [
            '<p>En realitat, el problema és trobar el primer més petit tal que el primer següent el superi com a mínim en 10. Si escrivim una petita llista de primers, no caldrà passar de 150 per trobar el que busquem, perquè després del 113 el primer següent és el 127. Llavors podem formar el quadrat de la figura, on tots els nombres són compostos. És la solució amb els nombres més petits.</p>',
            '<p>Hi ha una manera de trobar una resposta (no la més petita) sense taules ni proves. Escriu nou nombres seguits, el més petit dels quals sigui més gran que 1: per exemple, 2, 3, 4, 5, 6, 7, 8, 9 i 10. Els únics factors que hi ha en aquests nombres són el 2, el 3, el 5 i el 7. Els multipliquem, 2 · 3 · 5 · 7 = 210, i sumem 210 a cadascun dels nou nombres: surten els nou compostos seguits del 212 al 220, amb els quals podem formar el quadrat. Cada nombre és divisible per la seva diferència amb 210. Així es poden trobar tants compostos seguits com es vulgui.</p>',
            '<p>Però, com he dit, no són les respostes amb els nombres més petits: si sumem 523 als nombres de l’1 al 16, obtenim setze compostos seguits, i si sumem 1327 als nombres de l’1 al 25, vint-i-cinc, en tots dos casos els més petits possible. Fins i tot per trobar-ne trenta-sis seguits, buscaries a les taules fins a 10 000 sense èxit.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> El primer bloc de nou compostos seguits va del 114 al 122, i el quadrat de Dudeney és màgic (cada línia suma 354). Els altres rècords també són correctes: 16 compostos seguits comencen al 524 (entre els primers 523 i 541), 25 al 1328 (entre 1327 i 1361), i el primer bloc de 36 comença al 15 684, molt més enllà de 10 000.</p>',
            '<p><strong>Forats entre primers.</strong> El truc del 210 mostra que hi ha forats tan grans com vulguem entre primers seguits (n! + 2, n! + 3, …, n! + n són tots compostos). Saber exactament com creixen aquests forats és, encara avui, un dels problemes oberts més coneguts de la teoria de nombres.</p>',
        ],
    },
    {
        id: 'reversible',
        ordre: 6,
        font: { llibre: 'cp', numero: 102, titolOriginal: 'A Reversible Magic Square' },
        titol: 'Un quadrat màgic reversible',
        tipus: 'quadrats',
        tauler: 'magic',
        dificultat: 2,
        enunciat: [
            '<p>Sabries construir un quadrat de setze nombres diferents que sigui màgic (és a dir, que les quatre files, les quatre columnes i les dues diagonals sumin el mateix) tant si gires el dibuix cap per avall com si no? No pots fer servir el 3, el 4 ni el 5, perquè aquestes xifres no es poden girar; però un 6 es converteix en un 9 quan es gira, un 9 en un 6, un 7 en un 2 i un 2 en un 7. L’1, el 8 i el 0 es llegeixen igual de les dues maneres. Recorda que la constant no ha de canviar quan es gira.</p>',
            '<p class="pantalla">Que el 7 girat sembli un 2 depèn de com s’escriu (Dudeney el dibuixa amb un traç especial); a la pantalla ho acceptem tal com ell diu. El botó «Gira el full» et mostra el quadrat cap per avall.</p>',
        ],
        regla: 'Fes un quadrat màgic de <strong>16 nombres diferents</strong> que continuï sent màgic, amb la mateixa suma, quan <strong>gires el full cap per avall</strong>.',
        comEsJuga: [
            'Toca una casella i escriu-hi un nombre amb el teclat de sota (o amb el del teu ordinador).',
            'La suma de cada línia surt a la vora. Amb <strong>Gira el full</strong> veus com es llegeix el quadrat cap per avall.',
            'Només hi pots fer servir les xifres 0, 1, 2, 6, 7, 8 i 9.',
        ],
        tecles: 'les fletxes mouen entre caselles; escriu el nombre i prem <kbd>Retorn</kbd>; <kbd>⌫</kbd> esborra.',
        dades: {
            n: 4,
            total: null,
            condicio: 'reversible',
            solucio: ['11', '77', '62', '29', '69', '22', '17', '71', '27', '61', '79', '12', '72', '19', '21', '67'],
            etiqueta: 'Un quadrat de 4 × 4 buit',
            etiquetaSolucio: 'La solució de Dudeney: 11, 77, 62, 29; 69, 22, 17, 71; 27, 61, 79, 12; 72, 19, 21, 67',
            etiquetaGirat: 'El mateix quadrat cap per avall: 29, 17, 61, 72; 71, 62, 19, 27; 12, 21, 77, 69; 67, 79, 22, 11',
            resumSolucio: 'Totes les línies sumen 179, de cap i cap per avall.',
            gravat: { 0: '11', 1: '77', 2: '62', 3: '29' },
        },
        pistes: [
            'Quan gires el full, cada nombre canvia de casella (el de dalt a l’esquerra passa a baix a la dreta) i es llegeix al revés: el 16 es converteix en 91, i el 29 en 67.',
            'Fes servir nombres de dues xifres amb l’1, el 2, el 6, el 7 i el 9.',
            'Si el quadrat girat té exactament els mateixos nombres que el de cap, només cal que tots dos estiguin ben col·locats.',
            'La primera fila de Dudeney: 11, 77, 62 i 29. Totes les línies sumen 179.',
        ],
        solucioDudeney: [
            '<p>Es veurà que, en aquesta disposició, tots els nombres són diferents, i totes les columnes, totes les files i les dues diagonals sumen 179, tant si gires la pàgina cap per avall com si no. El lector notarà que no he fet servir les xifres 3, 4, 5, 8 ni 0.</p>',
        ],
        posicioFiguraSolucio: 0,
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Els setze nombres són diferents i totes les línies sumen 179. Cap per avall, el quadrat es llegeix 29, 17, 61, 72; 71, 62, 19, 27; 12, 21, 77, 69; 67, 79, 22, 11, que també és màgic, amb la mateixa suma, i té exactament els mateixos setze nombres, col·locats d’una altra manera.</p>',
            '<p><strong>Xifres que es giren.</strong> Amb les xifres de rellotge digital (de set segments), el 6 i el 9 s’intercanvien i el 0, l’1, el 2, el 5 i el 8 es veuen igual girats; el 7 no dona cap xifra. El 7 ↔ 2 de Dudeney només funciona amb la seva lletra.</p>',
        ],
    },
]);
