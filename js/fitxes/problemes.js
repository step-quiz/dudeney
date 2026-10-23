/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/fitxes/problemes.js
 * ROL: Els enigmes de fitxes: les granotes (AM 214, 216 i 341), Twickenham
 *   (AM 217), les lletres a la capsa (AM 219), les vuit locomotores (AM 221) i
 *   els formatges de l'administrador (CP 1). Enunciat, pistes i solució de Dudeney traduïts i
 *   adaptats al català; la nota del matemàtic és nostra.
 * ARQUITECTURA: Dades pures. Al navegador s'afegeixen a window.DUDENEY; a Node,
 *   el fitxer exporta la llista (tests). Els textos són HTML.
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'granotes',
        ordre: 1,
        font: { llibre: 'am', numero: 214, titolOriginal: 'The Six Frogs' },
        titol: 'Les sis granotes',
        tipus: 'fitxes',
        tauler: 'salts',
        dificultat: 2,
        enunciat: [
            '<p>Les sis granotes ensinistrades de la il·lustració han après a girar el seu ordre: han de quedar amb els números 6, 5, 4, 3, 2, 1, i amb la casella buida al mateix lloc que ara.</p>',
            '<p>Una granota pot saltar a la casella del costat, si és buida, o saltar per sobre d’una altra granota fins a la casella següent, si és buida, tal com es fa a les dames. Poden anar endavant o enrere, com vulguin.</p>',
            '<p>Sabries dir com ho fan amb el mínim de moviments possible? És força fàcil; quan ho hagis aconseguit, afegeix una setena granota a la dreta i torna-hi. Després afegeix-ne més, fins que puguis donar la solució més curta per a qualsevol nombre de granotes: sempre es pot fer, amb aquella única casella buida, siguin quantes siguin.</p>',
        ],
        regla: 'Gira l’ordre de les granotes: han de quedar <strong>6, 5, 4, 3, 2, 1</strong>, amb la casella buida a l’esquerra.',
        comEsJuga: [
            'Toca una granota que es pugui moure: salta sola a la casella buida.',
            'També la pots arrossegar fins a la casella buida.',
            'Una granota pot anar a la casella del costat o saltar per sobre d’<strong>una</strong> granota. Cada cosa compta com un moviment.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>9</kbd> mouen aquella granota; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: { granotes: 6, maxim: 8 },
        pistes: [
            'Un pas a la casella del costat i un salt compten igual: un moviment cada un. Com més salts i menys passos, millor.',
            'Al principi la casella buida és a l’esquerra: només s’hi poden moure l’1 (un pas) o el 2 (un salt per sobre de l’1).',
            'Fixa’t en les parelles i les senars: les granotes parelles van cap a l’esquerra saltant, i les senars, cap a la dreta.',
            'Prova la sèrie 2, 4, 6, 5, 3, 1 i repeteix-la. Mira on queda la casella buida cada vegada que l’acabes.',
        ],
        solucioDudeney: [
            '<p>Moveu les granotes en aquest ordre: 2, 4, 6, 5, 3, 1 (i repetiu aquests moviments dues vegades més, en el mateix ordre); després, 2, 4, 6. És una solució de vint-i-un moviments, el mínim possible.</p>',
            '<p>Si el nombre de granotes, <i>n</i>, és parell, calen (<i>n</i>² + <i>n</i>)/2 moviments, dels quals (<i>n</i>² − <i>n</i>)/2 són salts i <i>n</i> són passos simples. Si <i>n</i> és senar, calen (<i>n</i>² + 3<i>n</i>)/2 − 4 moviments, dels quals (<i>n</i>² − <i>n</i>)/2 són salts i 2<i>n</i> − 4 són passos simples.</p>',
            '<p>En els casos parells, escriviu tots els nombres parells en ordre creixent i els senars en ordre decreixent. Aquesta sèrie s’ha de repetir <i>n</i>/2 vegades i acabar, una sola vegada, amb els parells en ordre creixent. Així, la solució per a 14 granotes és (2, 4, 6, 8, 10, 12, 14, 13, 11, 9, 7, 5, 3, 1) repetida 7 vegades i seguida de 2, 4, 6, 8, 10, 12, 14: 105 moviments.</p>',
            '<p>En els casos senars, escriviu els parells en ordre creixent i els senars en ordre decreixent, i repetiu aquesta sèrie (<i>n</i> − 1)/2 vegades; continueu amb els parells en ordre creixent (sense el <i>n</i> − 1) i els senars en ordre decreixent (sense l’1), i acabeu amb tots els nombres en l’ordre natural (sense l’1 ni el <i>n</i>). Així, per a 11 granotes: (2, 4, 6, 8, 10, 11, 9, 7, 5, 3, 1) repetida 5 vegades; després 2, 4, 6, 8, 11, 9, 7, 5, 3, i finalment 2, 3, 4, 5, 6, 7, 8, 9, 10: 73 moviments.</p>',
            '<p>Aquesta solució general completa es publica aquí per primera vegada.</p>',
        ],
        notaMatematic: [
            '<p><strong>Per què no es pot fer amb menys salts.</strong> Al final, cada parella de granotes ha d’haver canviat d’ordre: el 2, que anava darrere de l’1, ha d’acabar davant seu, i així amb totes les parelles. Amb <i>n</i> granotes hi ha <i>n</i>(<i>n</i> − 1)/2 parelles, i cada salt fa canviar d’ordre exactament <i>una</i> parella (la granota que salta i la que és saltada); un pas no en canvia cap. Per tant, calen com a mínim <i>n</i>(<i>n</i> − 1)/2 salts: 15 amb sis granotes. Els salts de Dudeney són justament aquests; el que es pot estalviar són els passos.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada (que prova totes les posicions possibles, de menys a més moviments) confirma que amb 2, 3, …, 9 granotes el mínim és el de la fórmula de Dudeney: 21 amb sis granotes i 31 amb set. També hem comprovat que la seva recepta general funciona fins a 14 granotes.</p>',
            '<p>Un detall: amb una sola granota la fórmula dels senars dona −2, i és clar que no cal cap moviment. Dudeney pensava en més granotes.</p>',
        ],
    },
    {
        id: 'granotes-gots',
        ordre: 2,
        font: { llibre: 'am', numero: 216, titolOriginal: 'The Educated Frogs' },
        titol: 'Les granotes ensinistrades',
        tipus: 'fitxes',
        tauler: 'salts',
        dificultat: 2,
        enunciat: [
            '<p>Les nostres sis granotes ensinistrades han après un número nou, i força bonic. Posades sobre gots de vidre, com a la il·lustració, canvien de costat: les tres negres han de quedar a l’esquerra i les tres blanques a la dreta, amb el got buit a l’altra punta, al número 7.</p>',
            '<p>Una granota pot saltar al got del costat (si és buit) o per sobre d’una o de dues granotes fins a un got buit. Els salts es poden fer en les dues direccions, i una granota pot saltar per sobre de les del seu color, de les de l’altre color o de totes dues. Quatre salts d’exemple, un darrere l’altre, ho deixaran ben clar: del 4 a l’1, del 5 al 4, del 3 al 5 i del 6 al 3.</p>',
            '<p>Sabries fer-ho en deu salts?</p>',
            '<p class="pantalla">Com a l’enunciat, anar al got del costat també compta com un salt: a la pantalla en diem «moviments», i es compten tots.</p>',
        ],
        regla: 'Les tres <strong>negres</strong> a l’esquerra i les tres <strong>blanques</strong> a la dreta, amb el <strong>got 7</strong> buit. En 10 salts.',
        comEsJuga: [
            'Toca una granota: salta sola al got buit, si hi pot arribar.',
            'També la pots arrossegar fins al got buit.',
            'Una granota pot anar al got del costat o saltar per sobre d’<strong>una o dues</strong> granotes, del color que siguin. Cada cosa compta com un moviment.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>7</kbd> mouen la granota d’aquell got; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: {
            granotes: 6,
            salt: 2,
            colors: { 1: 'blanca', 2: 'blanca', 3: 'blanca', 4: 'negra', 5: 'negra', 6: 'negra' },
            inicial: [0, 1, 2, 3, 4, 5, 6],
            objectiu: 'nnnbbb_',
            minim: 10,
            // Els deu salts de Dudeney: [d’on, cap on], amb els gots numerats de l’1 al 7
            solucio: [[2, 1], [5, 2], [3, 5], [6, 3], [7, 6], [4, 7], [1, 4], [3, 1], [6, 3], [7, 6]],
            resumSolucio: 'Deu salts: del 2 a l’1, del 5 al 2, del 3 al 5, del 6 al 3, del 7 al 6, del 4 al 7, de l’1 al 4, del 3 a l’1, del 6 al 3 i del 7 al 6.',
            final: [5, 4, 6, 1, 2, 3, 0],
            peuFinal: 'Al final: les negres als gots 1, 2 i 3, les blanques als gots 4, 5 i 6, i el 7 buit.',
            etiqueta: 'Set gots en una filera: el got 1 és buit, hi ha tres granotes blanques als gots 2, 3 i 4 i tres de negres als gots 5, 6 i 7',
        },
        figuraEnunciat: { peu: 'Les sis granotes sobre els set gots.', despres: 1 },
        pistes: [
            'Primer, prova els quatre salts d’exemple de l’enunciat (del 4 a l’1, del 5 al 4, del 3 al 5 i del 6 al 3) per veure com funcionen els salts llargs.',
            'Com més salts per sobre de dues granotes facis, menys moviments necessitaràs: cada un d’aquests salts fa avançar molt una granota.',
            'L’única manera de començar bé és amb un pas curt: el got buit és a l’extrem, i el primer moviment el fa la granota del got 2.',
            'Els tres primers salts de Dudeney: del 2 a l’1, del 5 al 2 i del 3 al 5. Mira on queda el got buit després de cada salt.',
        ],
        solucioDudeney: [
            '<p>Els salts següents resolen el trencaclosques en deu moviments: del 2 a l’1, del 5 al 2, del 3 al 5, del 6 al 3, del 7 al 6, del 4 al 7, de l’1 al 4, del 3 a l’1, del 6 al 3 i del 7 al 6.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada per totes les posicions possibles (quin color hi ha a cada got) confirma que 10 salts és el mínim. Dels deu salts de Dudeney, cinc passen per sobre de dues granotes, dos per sobre d’una i tres són passos al got del costat.</p>',
            '<p><strong>Només hi ha dues solucions de deu salts.</strong> La de Dudeney i una altra: 2→1, 5→2, 7→5, 4→7, 1→4, 2→1, 5→2, 3→5, 6→3, 7→6. I aquesta segona és la de Dudeney mirada al revés: si fas els seus salts de l’últim al primer (canviant d’on i cap on) i després mires els gots en un mirall (l’1 passa a ser el 7, el 2 el 6…), surt l’altra. Passa perquè la posició final, vista en un mirall, és justament la inicial.</p>',
            '<p><strong>I amb salts més curts o més llargs?</strong> Si les granotes només poguessin saltar per sobre d’una (com a «Les sis granotes»), en caldrien 15. Si poguessin saltar per sobre de fins a tres, n’hi hauria prou amb 5.</p>',
        ],
    },
    {
        id: 'twickenham',
        ordre: 3,
        font: { llibre: 'am', numero: 217, titolOriginal: 'The Twickenham Puzzle' },
        titol: 'El trencaclosques de Twickenham',
        tipus: 'fitxes',
        tauler: 'cercle',
        dificultat: 2,
        enunciat: [
            '<p>A la il·lustració hi ha onze discos en cercle. Sobre cinc dels discos hi posem fitxes blanques amb lletres negres, com es veu, i sobre cinc més, fitxes negres amb lletres blanques. El disc de baix queda buit. Partint d’aquí, cal posar les fitxes en ordre perquè, llegides en el sentit de les agulles del rellotge, formin la paraula «Twickenham», amb el disc buit al mateix lloc que al principi.</p>',
            '<p>Les fitxes negres es mouen en el sentit de les agulles del rellotge, i les blanques, en el sentit contrari. Una fitxa pot saltar per sobre d’una de l’altre color si el disc que ve just després és buit. Així, si el primer moviment és amb la K, la C pot saltar per sobre de la K. Si llavors la K avança cap a la E, pots fer saltar la W per sobre de la C, i així successivament. El trencaclosques es pot resoldre en vint-i-sis moviments. Recorda que una fitxa no pot saltar mai per sobre d’una del seu color.</p>',
            '<p class="pantalla">Twickenham és una població del costat de Londres, a la vora del Tàmesi. La paraula comença just després del disc buit: T, W, I, C, K… i s’acaba amb la M just abans del disc buit.</p>',
        ],
        regla: 'Escriu <strong>TWICKENHAM</strong> en el sentit de les agulles del rellotge, començant just després del disc buit, que ha de tornar a quedar a baix.',
        comEsJuga: [
            'Toca una fitxa: si pot, va sola al disc buit (al disc del costat o saltant). També la pots arrossegar.',
            'Les <strong>negres</strong> només avancen en el sentit de les agulles del rellotge, i les <strong>blanques</strong>, en el sentit contrari.',
            'Una fitxa només pot saltar per sobre d’<strong>una</strong> fitxa de l’<strong>altre color</strong>. Un pas i un salt compten igual: un moviment.',
        ],
        tecles: 'la lletra d’una fitxa (<kbd>K</kbd>, <kbd>C</kbd>…) la mou; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: {
            // Els discos, en el sentit de les agulles del rellotge, començant pel de baix (el buit)
            inicial: ['', 'C', 'E', 'H', 'M', 'I', 'N', 'A', 'T', 'W', 'K'],
            negres: 'NATWK',
            paraula: 'TWICKENHAM',
            minim: 26,
            solucio: 'KCEKWTCEHMKWTANCEHMIKCEHMT',
            etiqueta: 'Onze discos en cercle: el de baix és buit i, en el sentit de les agulles del rellotge, hi ha les fitxes blanques C, E, H, M, I i les negres N, A, T, W, K',
        },
        pistes: [
            'Al principi només es poden moure dues fitxes: la K (negra), que avança fins al disc buit, i la C (blanca), que hi arriba girant al revés. L’enunciat et suggereix començar per la K.',
            'Com que cap fitxa no pot saltar les del seu color, les negres mai no s’avancen entre elles, i les blanques tampoc: l’ordre de cada color al voltant del cercle es manté. Fixa’t que a TWICKENHAM les negres també surten en l’ordre N, A, T, W, K (comptant en rodona).',
            'La C ha de fer gairebé una volta sencera, girant al revés; la T i la W, gairebé mitja volta. Com més salts facis, menys moviments necessitaràs.',
            'Els deu primers moviments de Dudeney: K, C, E, K, W, T, C, E, H, M.',
        ],
        solucioDudeney: [
            '<p>Moveu les fitxes en aquest ordre: K, C, E, K, W, T, C, E, H, M, K, W, T, A, N, C, E, H, M, I, K, C, E, H, M, T, i ja som a Twickenham. La mateixa posició de les fitxes us dirà, cada vegada, si toca fer un salt o un pas.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Des de la posició inicial es poden arribar a formar 16 060 posicions diferents. Una cerca en amplada per totes elles confirma que 26 moviments és el mínim. I encara més: la solució de Dudeney és l’<em>única</em> de 26 moviments.</p>',
            '<p><strong>Salts i passos.</strong> Dels 26 moviments de Dudeney, 19 són salts i 7 són passos. No és casualitat: comptant les caselles que ha d’avançar cada fitxa fins al seu lloc, les negres n’han de fer 17 en total i les blanques 28, és a dir, 45 (si cap fitxa no fa cap volta de més). Un pas en fa avançar una i un salt, dues; per tant, amb <i>p</i> passos i <i>s</i> salts, <i>p</i> + 2<i>s</i> = 45. Amb 26 moviments, <i>p</i> + <i>s</i> = 26, i d’aquí surt <i>s</i> = 19 i <i>p</i> = 7.</p>',
            '<p>És un parent de «Les sis granotes» i de «Les granotes ensinistrades»: fitxes que s’han de creuar fent salts, i on el que s’estalvia són els passos.</p>',
        ],
    },
    {
        id: 'lletres',
        ordre: 4,
        font: { llibre: 'am', numero: 219, titolOriginal: 'The Letter Block Puzzle' },
        titol: 'Les lletres a la capsa',
        tipus: 'fitxes',
        tauler: 'blocs',
        dificultat: 2,
        enunciat: [
            '<p>Aquí tenim un petit record del nostre vell amic, el trencaclosques del 15. Vuit blocs de fusta amb lletres són dins una capsa, com es veu a la il·lustració. Només es pot moure un bloc cada vegada, cap al lloc que en aquell moment és buit, perquè cap bloc no es pot treure de la capsa. El trencaclosques consisteix a anar-los movent fins que quedin en aquest ordre:</p>',
            '<table class="taula-dudeney taula-blocs"><tbody><tr><td>A</td><td>B</td><td>C</td></tr><tr><td>D</td><td>E</td><td>F</td></tr><tr><td>G</td><td>H</td><td></td></tr></tbody></table>',
            '<p>Si et deixen fer tants moviments com vulguis, veuràs que no és gens difícil. Però el trencaclosques és fer-ho amb el mínim de moviments possible. No diré quin és aquest mínim, perquè potser el lector el voldrà descobrir pel seu compte. Per apuntar els moviments n’hi ha prou d’escriure les lletres en l’ordre en què es mouen. Així, els cinc primers moviments podrien ser C, H, G, E, F, i aquesta manera d’apuntar-ho no pot portar cap confusió. A la pràctica, només et calen vuit fitxes i un diagrama senzill en un full de paper.</p>',
            '<p class="pantalla">Com Dudeney, la pantalla no et dirà quin és el mínim fins que l’aconsegueixis.</p>',
        ],
        regla: 'Deixa els blocs en l’ordre <strong>A B C · D E F · G H</strong>, amb el forat a baix a la dreta, amb el mínim de moviments.',
        comEsJuga: [
            'Toca un bloc que toqui el forat: hi llisca. També el pots arrossegar.',
            'Els blocs no es poden treure de la capsa ni moure en diagonal.',
        ],
        tecles: 'la lletra d’un bloc (<kbd>A</kbd>…<kbd>H</kbd>) el mou; les fletxes fan lliscar cap al forat el bloc del costat; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: {
            cols: 3,
            inicial: 'GEFHCBD_A',
            objectiu: 'ABCDEFGH_',
            minim: 23,
            solucio: 'ABFECABFECABDHGABDHGDEF',
            etiqueta: 'Una capsa de 3 × 3 amb vuit blocs: G, E, F a dalt; H, C, B al mig; D, el forat i A a baix',
        },
        pistes: [
            'El forat comença a baix al mig i ha d’acabar a baix a la dreta. Cada moviment el fa passar a una casella veïna, i una casella sí, una casella no, és «blanca» o «negra», com en un tauler d’escacs. Per tant, el nombre de moviments ha de ser senar.',
            'Sovint convé fer girar tres blocs al voltant d’un quadrat de 2 × 2, com en un carrusel: cada volta els avança una casella a tots.',
            'Dudeney comença fent girar els blocs del quadrat de la dreta: A, B, F, E, C… i ho repeteix.',
            'Els deu primers moviments de Dudeney: A, B, F, E, C, A, B, F, E, C. Quedes amb G, forat, C a dalt; H, A, E al mig, i D, B, F a baix: la C ja és al seu lloc.',
        ],
        solucioDudeney: [
            '<p>Aquest trencaclosques es pot resoldre en 23 moviments, el mínim possible. Moveu els blocs en aquest ordre: A, B, F, E, C, A, B, F, E, C, A, B, D, H, G, A, B, D, H, G, D, E, F.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada per totes les posicions a què es pot arribar confirma que 23 moviments és el mínim, i que la seqüència de Dudeney és l’<em>única</em> de 23 moviments. Des de la posició inicial, la posició més llunyana necessita 31 moviments.</p>',
            '<p><strong>La meitat de les posicions són impossibles.</strong> Els vuit blocs i el forat es poden col·locar de 9! = 362 880 maneres, però des de la posició inicial només se’n pot arribar a la meitat, 181 440. Si en una posició es canvien de lloc dos blocs (traient-los de la capsa), s’arriba a l’altra meitat, i ja no hi ha manera de resoldre-ho. Ho van demostrar W. W. Johnson i W. E. Story el 1879 per al trencaclosques del 15, que aquells anys feia furor: cada moviment és un intercanvi del forat amb un bloc, i la paritat del nombre d’intercanvis (parell o senar) està lligada al lloc on és el forat.</p>',
        ],
    },
    {
        id: 'quatre-granotes',
        ordre: 5,
        font: { llibre: 'am', numero: 341, titolOriginal: 'The Four Frogs' },
        titol: 'Les quatre granotes',
        tipus: 'fitxes',
        tauler: 'xarxa',
        dificultat: 2,
        enunciat: [
            '<p>A la il·lustració hi ha vuit bolets, amb granotes blanques a l’1 i al 3 i granotes negres al 6 i al 8. El trencaclosques consisteix a moure una granota cada vegada, en l’ordre que vulguis, per una de les línies rectes que van de bolet a bolet, fins que hagin canviat de lloc: les blanques han de quedar al 6 i al 8, i les negres, a l’1 i al 3.</p>',
            '<p>Si fas servir quatre fitxes sobre un diagrama senzill, ho trobaràs força fàcil. Però és una mica més difícil fer-ho en només set jugades, si compten com una sola jugada tots els moviments seguits d’una mateixa granota. És clar que mai no hi pot haver dues granotes en un mateix bolet.</p>',
            '<p class="pantalla">A la pantalla es compten els moviments i les jugades: si mous la mateixa granota diverses vegades seguides, tot plegat és una sola jugada.</p>',
        ],
        regla: 'Les blanques als bolets <strong>6 i 8</strong> i les negres a l’<strong>1 i al 3</strong>, en <strong>7 jugades</strong>.',
        comEsJuga: [
            'Toca una granota i després el bolet buit on vols que vagi, seguint una línia. També la pots arrossegar.',
            'Els moviments seguits d’una mateixa granota són una sola jugada.',
            'El botó «Desembolica els fils» mou els bolets sense canviar cap línia: prova’l!',
        ],
        tecles: '<kbd>1</kbd>…<kbd>8</kbd> trien un bolet (primer el de la granota, després on va); <kbd>Esc</kbd> desfà la tria; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: {
            // Els bolets 1…8 en una quadrícula de 3 × 3 sense el del mig
            posicions: { 1: [0, 0], 2: [1, 0], 3: [2, 0], 4: [0, 1], 5: [2, 1], 6: [0, 2], 7: [1, 2], 8: [2, 2] },
            arestes: [[1, 5], [1, 7], [2, 6], [2, 8], [3, 4], [3, 7], [4, 8], [5, 6]],
            // L'ordre dels bolets al cercle dels «botons i fils» de Dudeney
            cercle: [1, 5, 6, 2, 8, 4, 3, 7],
            inicial: { 1: 'blanca', 3: 'blanca', 6: 'negra', 8: 'negra' },
            objectiu: { 1: 'negra', 3: 'negra', 6: 'blanca', 8: 'blanca' },
            minimJugades: 7,
            minimMoviments: 16,
            // Les set jugades de Dudeney, amb els moviments [d'on, cap on]
            solucio: [[[1, 5]], [[3, 7], [7, 1]], [[8, 4], [4, 3], [3, 7]], [[6, 2], [2, 8], [8, 4], [4, 3]], [[5, 6], [6, 2], [2, 8]], [[1, 5], [5, 6]], [[7, 1]]],
            etiqueta: 'Vuit bolets units per vuit línies; granotes blanques als bolets 1 i 3 i negres al 6 i al 8',
        },
        pistes: [
            'De cada bolet surten exactament dues línies. Surt de l’1 i segueix-les: on arribes? I després?',
            'Seguint les línies passes per tots els bolets i tornes a l’1: 1, 5, 6, 2, 8, 4, 3, 7. Les vuit línies formen un sol circuit!',
            'Imagina aquest circuit com un cercle (o prem «Desembolica els fils»): les granotes no es poden avançar, només girar. Per canviar de lloc, totes han de girar en el mateix sentit.',
            'Les dues primeres jugades de Dudeney: la blanca de l’1 al 5; després, la blanca del 3 al 7 i, seguit, del 7 a l’1.',
        ],
        solucioDudeney: [
            '<p>El mínim de moviments, comptant-los un per un, és setze. Però el trencaclosques es pot resoldre en set jugades, si compten com una de sola tots els moviments seguits d’una mateixa granota. Cada parèntesi és una jugada, i els números són els dels bolets: (1–5), (3–7, 7–1), (8–4, 4–3, 3–7), (6–2, 2–8, 8–4, 4–3), (5–6, 6–2, 2–8), (1–5, 5–6), (7–1).</p>',
            '<p>És el conegut problema de Guarini, proposat el 1512, i el poso aquí per explicar el meu mètode dels «botons i fils» per resoldre aquesta mena de problemes de fitxes que es mouen. La manera antiga de presentar el problema de Guarini és amb dos cavalls blancs i dos de negres en un tauler de 3 × 3, que han de canviar de lloc. A «Les quatre granotes», les línies indiquen cap on es pot moure cada granota, perquè el lector no hagi de saber com es mou el cavall dels escacs; però es veu de seguida que els dos problemes són idèntics. La casella del mig, és clar, no compta, perquè cap cavall no hi pot entrar mai.</p>',
            '<p>Ara imagineu que els bolets són botons i les línies, fils. Si desemboliquem els fils, podem dibuixar el diagrama com a la figura, on la relació entre els botons és exactament la mateixa. Qualsevol solució en aquesta figura serveix per a l’altra. Poseu les granotes blanques a l’1 i al 3 i les negres al 6 i al 8, i veureu com n’és, de senzilla, la solució: només cal fer girar les granotes pel cercle, en un sentit o en l’altre. Feu les jugades de més amunt i veureu que tota dificultat ha desaparegut.</p>',
        ],
        posicioFiguraSolucio: 3,
        notaMatematic: [
            '<p><strong>Per què setze moviments.</strong> Al cercle, les granotes no es poden avançar: l’ordre en què hi són es manté. Comptant els llocs del cercle (1, 5, 6, 2, 8, 4, 3, 7), les blanques són als llocs 1r i 7è i les negres, al 3r i al 5è, i han d’acabar a l’inrevés. L’única manera de fer-ho sense que ningú s’avanci és que totes girin quatre llocs en el mateix sentit: 4 granotes × 4 moviments = 16.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada confirma els dos mínims de Dudeney: 16 moviments i 7 jugades, i que la seva solució és vàlida.</p>',
            '<p>Paolo Guarini di Forlì va proposar el problema dels cavalls en un manuscrit del 1512, i és un dels trencaclosques d’escacs més antics que es coneixen. El mètode dels «botons i fils» de Dudeney és el que avui en diem treballar amb el <i>graf</i> del problema: el que importa no és on són els punts, sinó quins estan units amb quins.</p>',
        ],
    },
    {
        id: 'locomotores',
        ordre: 6,
        font: { llibre: 'am', numero: 221, titolOriginal: 'The Eight Engines' },
        titol: 'Les vuit locomotores',
        tipus: 'fitxes',
        tauler: 'xarxa',
        dificultat: 3,
        enunciat: [
            '<p>El diagrama representa el dipòsit de locomotores d’una companyia de ferrocarrils amb una direcció força excèntrica. Les locomotores només es poden aturar als nou punts indicats, un dels quals ara és buit. Cal moure les locomotores, d’una en una, de punt en punt, en disset moviments, de manera que els seus números quedin en ordre al voltant del cercle, amb el punt del mig buit.</p>',
            '<p>Però a una de les locomotores li han apagat el foc i, per tant, no es pot moure. Com s’ha de fer? I quina és la locomotora que es queda quieta tota l’estona?</p>',
            '<p class="pantalla">A la pantalla no et diem quina locomotora té el foc apagat: les pots moure totes. Si ho aconsegueixes en 17 moviments, n’hi haurà una que no s’haurà mogut. Les vies són la del cercle i les quatre que porten al centre, i els números poden quedar en ordre en un sentit o en l’altre.</p>',
        ],
        regla: 'Posa les locomotores <strong>en ordre</strong> al voltant del cercle (1, 2, 3… 8), amb el <strong>centre buit</strong>, en <strong>17 moviments</strong>.',
        comEsJuga: [
            'Toca una locomotora: si una via la uneix amb el punt buit, hi va. També la pots arrossegar.',
            'Només hi ha un punt buit, i cada moviment és una locomotora que hi va.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>8</kbd> mouen la locomotora d’aquest número; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: {
            fitxa: 'locomotora',
            // Els punts: 1…8 al voltant del cercle (en el sentit de les agulles, des de dalt) i el 9 al centre
            posicions: { 1: [1, 0.05], 2: [1.672, 0.328], 3: [1.95, 1], 4: [1.672, 1.672], 5: [1, 1.95], 6: [0.328, 1.672], 7: [0.05, 1], 8: [0.328, 0.328], 9: [1, 1] },
            arestes: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 1], [1, 9], [3, 9], [5, 9], [7, 9]],
            inicial: { 1: 1, 2: 2, 3: 4, 4: 8, 5: 6, 6: 3, 8: 5, 9: 7 },
            ordre: { vora: [1, 2, 3, 4, 5, 6, 7, 8], buit: 9 },
            minimMoviments: 17,
            // Els disset moviments de Dudeney: el número de la locomotora que va al punt buit
            solucio: [7, 6, 3, 7, 6, 1, 2, 4, 1, 3, 8, 1, 3, 2, 4, 3, 2],
            final: { 1: 4, 2: 3, 3: 2, 4: 1, 5: 8, 6: 7, 7: 6, 8: 5 },
            peuFinal: 'Al final, en ordre en el sentit contrari a les agulles del rellotge; la 5 no s’ha mogut.',
            resumSolucio: 'Disset moviments, i la 5 no es mou.',
            etiqueta: 'Un cercle de vuit punts amb un punt al centre; al voltant, començant per dalt, les locomotores 1, 2, 4, 8, 6, 3, un punt buit i la 5, i la 7 al centre',
            etiquetaFinal: 'Les locomotores en ordre al voltant del cercle, amb el centre buit',
        },
        extra: {
            pregunta: 'I ara, la pregunta de Dudeney: <strong>quina locomotora</strong> té el foc apagat i no es pot moure?',
            resposta: 5,
            be: 'La 5. I encara més: en totes les solucions de 17 moviments, la 5 es queda quieta.',
            malament: 'No. Mira quina locomotora no s’ha mogut en la teva solució de 17 moviments.',
        },
        pistes: [
            'Ara el punt buit és a l’esquerra del cercle. Només s’hi poden moure les locomotores que hi estan unides per una via: la 3, la 5 i la 7, la del centre.',
            'Pel cercle, cap locomotora no en pot avançar una altra: per canviar-ne l’ordre cal fer servir el centre i les quatre vies que hi porten.',
            'L’ordre pot anar en el sentit contrari a les agulles del rellotge. Una locomotora que no es mogui pot quedar on és si, al final, té les seves dues veïnes a banda i banda.',
            'Els primers moviments de Dudeney: 7, 6, 3, 7, 6, 1…',
        ],
        solucioDudeney: [
            '<p>La locomotora a la qual han apagat el foc i que, per tant, no es pot moure és la número 5. Moveu les altres en aquest ordre: 7, 6, 3, 7, 6, 1, 2, 4, 1, 3, 8, 1, 3, 2, 4, 3, 2, disset moviments en total, i les vuit locomotores queden en l’ordre que es demanava.</p>',
            '<p>Hi ha dues altres solucions lleugerament diferents.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada confirma que, amb la 5 quieta, 17 moviments és el mínim, i que hi ha exactament tres solucions de 17: la de Dudeney i les dues «lleugerament diferents» que esmenta.</p>',
            '<p><strong>Una sorpresa.</strong> Si no s’apagués cap locomotora, el mínim continuaria sent 17, i les tres úniques solucions de 17 moviments serien les mateixes: totes deixen la 5 quieta. Per això, si ho resols en 17 moviments a la pantalla, la 5 no s’haurà mogut mai.</p>',
            '<p><strong>I si fos una altra?</strong> Si la locomotora apagada fos la 2, en caldrien 19; si fos la 3, 23, i si fos la 8, 25. Amb la 1, la 4, la 6 o la 7 quietes, no hi hauria manera de posar-les en ordre.</p>',
        ],
    },
    {
        id: 'formatges',
        ordre: 7,
        font: { llibre: 'cp', numero: 1, titolOriginal: 'The Reve’s Puzzle' },
        titol: 'Els formatges de l’administrador',
        tipus: 'fitxes',
        tauler: 'piles',
        dificultat: 3,
        enunciat: [
            '<p>L’administrador era un home astut i una mica erudit. Com diu Chaucer, «no hi havia auditor que el pogués enganyar» i «ningú no el va poder agafar mai en descobert». El poeta també es va fixar que «sempre cavalcava el darrer de la colla»: ho feia per poder rumiar, sense que ningú l’interrompés, els problemes i les idees fantasioses que li passaven pel cap.</p>',
            '<p>Una vegada que els pelegrins es van aturar en un hostal del camí, va veure uns quants formatges de mides diferents. Va demanar quatre tamborets i va dir a la colla que els ensenyaria un trencaclosques seu que els entretindria mentre descansaven. Va posar vuit formatges, de més gran a més petit, en un dels tamborets de la punta, amb el més petit a dalt de tot.</p>',
            '<p>—És una endevinalla —va dir— que vaig plantejar als meus veïns de Baldeswell, a Norfolk, i per sant Joce que cap no la va saber resoldre. I és ben fàcil: només us demano que, movent els formatges d’un en un d’un tamboret a un altre, els passeu tots al tamboret de l’altra punta, sense posar mai cap formatge sobre un de més petit. A qui ho faci amb el mínim de moviments possible, li pagaré un glop del millor que tingui el nostre bon hostaler.</p>',
            '<p>Resoldre aquest trencaclosques amb el mínim de moviments, primer amb 8 formatges, després amb 10 i, finalment, amb 21, és un entreteniment ben interessant.</p>',
        ],
        regla: 'Passa els formatges al tamboret de la dreta: <strong>d’un en un</strong>, i mai un formatge sobre un de més petit.',
        comEsJuga: [
            'Toca un tamboret per agafar el formatge de dalt, i després toca el tamboret on el vols deixar.',
            'També pots arrossegar el formatge de dalt d’un tamboret fins a un altre.',
            'Un formatge no pot anar mai a sobre d’un de més petit.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>4</kbd> trien el tamboret (el primer cop agafes el formatge, el segon el deixes); <kbd>Esc</kbd> el torna a deixar on era; <kbd>⌫</kbd> desfà el darrer moviment.',
        dades: { formatges: 8, tamborets: 4, origen: 0, desti: 3, extra: 10 },
        pistes: [
            'Amb només tres tamborets (la torre de Hanoi de sempre) caldrien 2⁸ − 1 = 255 moviments. El quart tamboret ho escurça moltíssim.',
            'Fes-ho per parts: primer aparta uns quants formatges petits en un dels tamborets del mig, fent servir els quatre tamborets.',
            'Mentre els petits són apartats, als grans només els queden tres tamborets lliures: els has de moure com a la torre de Hanoi (3 formatges, 3 tamborets: 7 moviments).',
            'Aparta els 5 més petits en un tamboret del mig (13 moviments), passa els 3 grans al tamboret final amb els tres tamborets que queden (7 moviments) i torna-hi a posar els 5 petits a sobre (13 moviments): 13 + 7 + 13 = 33.',
        ],
        solucioDudeney: [
            '<p>Els 8 formatges es poden passar en 33 moviments; 10 formatges, en 49, i 21 formatges, en 321. Explicaré el meu mètode general per als casos de 3, 4 i 5 tamborets. Escriviu la taula següent, tan llarga com calgui:</p>',
            '<table class="taula-dudeney"><thead><tr><th>Tamborets</th><th colspan="7">Nombre de formatges</th></tr></thead><tbody>' +
                '<tr><th>3</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>' +
                '<tr><th>4</th><td>1</td><td>3</td><td>6</td><td>10</td><td>15</td><td>21</td><td>28</td></tr>' +
                '<tr><th>5</th><td>1</td><td>4</td><td>10</td><td>20</td><td>35</td><td>56</td><td>84</td></tr>' +
                '</tbody><thead><tr><th></th><th colspan="7">Nombre de moviments</th></tr></thead><tbody>' +
                '<tr><th>3</th><td>1</td><td>3</td><td>7</td><td>15</td><td>31</td><td>63</td><td>127</td></tr>' +
                '<tr><th>4</th><td>1</td><td>5</td><td>17</td><td>49</td><td>129</td><td>321</td><td>769</td></tr>' +
                '<tr><th>5</th><td>1</td><td>7</td><td>31</td><td>111</td><td>351</td><td>1023</td><td>2815</td></tr>' +
                '</tbody></table>',
            '<p>La primera fila són els nombres naturals. La segona s’obté sumant els naturals des del principi (els nombres triangulars), i la tercera, sumant des del principi els de la segona (els piramidals). La quarta fila són les potències de 2 menys 1. A la cinquena, cada nombre és el doble de l’anterior de la mateixa fila més el que té just a sobre; l’última es fa de la mateixa manera.</p>',
            '<p>Aquesta taula dona de seguida la solució per a qualsevol nombre de formatges amb tres tamborets, per als nombres triangulars amb quatre tamborets i per als piramidals amb cinc. En aquests casos sempre hi ha una sola manera de resoldre-ho, és a dir, de fer les piles. Amb tres tamborets, la primera i la quarta fila ens diuen que 4 formatges es passen en 15 moviments, 5 en 31 i 7 en 127. La segona i la cinquena mostren que, amb quatre tamborets, 10 formatges es passen en 49 moviments i 21 en 321. I amb cinc tamborets, 20 formatges en necessiten 111, i 35 formatges, 351.</p>',
            '<p>La taula també ens diu com s’han de fer les piles. Amb quatre tamborets i 10 formatges, la columna anterior diu que cal fer piles de 6 i de 3, que costen 17 i 7 moviments: primer s’apilen els sis formatges més petits en un tamboret, en 17 moviments; després, els 3 següents en un altre tamboret, en 7; es passa el formatge més gran, en 1 moviment; es tornen a posar els 3 a sobre, en 7, i finalment els 6, en 17. En total, els 49 moviments necessaris.</p>',
            '<p>Si el nombre de formatges no és triangular (amb quatre tamborets) o piramidal (amb cinc), hi ha més d’una manera de fer les piles, i calen taules auxiliars. És el cas dels 8 formatges de l’administrador. Però deixo que el lector treballi pel seu compte aquesta ampliació del problema.</p>',
        ],
        notaMatematic: [
            '<p>És la torre de Hanoi, el joc que el francès Édouard Lucas va treure el 1883, però amb un tamboret més. Amb tres tamborets, <i>n</i> formatges necessiten 2<sup><i>n</i></sup> − 1 moviments, i és fàcil veure que no es pot fer amb menys: per moure el formatge més gran, tots els altres han d’estar apilats al tercer tamboret.</p>',
            '<p>Amb quatre tamborets, el mètode de Dudeney (apartar un grup de formatges petits, passar els grans amb els tres tamborets que queden i tornar a posar els petits a sobre) és el mateix que el 1941 van proposar J. S. Frame i B. M. Stewart per a qualsevol nombre de tamborets. Que amb quatre tamborets és el millor possible no es va demostrar fins al 2014: ho va fer Thierry Bousch, de la Universitat de París-Sud. Amb cinc tamborets o més, encara no se sap!</p>',
            '<p><strong>Una regularitat preciosa.</strong> Amb quatre tamborets, cada formatge nou afegeix una potència de 2: el primer costa 1 moviment, els dos següents 2 cada un, els tres següents 4, els quatre següents 8… Així, per a 21 formatges: 1·1 + 2·2 + 3·4 + 4·8 + 5·16 + 6·32 = 321.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Una cerca en amplada, que prova totes les posicions possibles, confirma que 8 formatges necessiten 33 moviments i 10 formatges, 49. Amb 21 formatges la cerca seria massa llarga, però el resultat de Bousch confirma els 321 de Dudeney.</p>',
        ],
    },
]);
