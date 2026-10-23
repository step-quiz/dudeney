/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/fitxes/problemes.js
 * ROL: Els enigmes de fitxes: les sis granotes (AM 214) i els formatges de
 *   l'administrador (CP 1). Enunciat, pistes i solució de Dudeney traduïts i
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
        id: 'formatges',
        ordre: 2,
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
