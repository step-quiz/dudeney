/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/aritmetica/problemes.js
 * ROL: Els enigmes d'aritmètica: el número estripat (AM 113) i l'aranya i la
 *   mosca (CP 75). Enunciat, pistes i solució de Dudeney traduïts i adaptats;
 *   la nota del matemàtic és nostra.
 * ARQUITECTURA: Dades pures (vegeu js/fitxes/problemes.js).
 *   Aranya: la sala fa 30 × 12 × 12 peus; coordenades a js/aritmetica/motor.js.
 *   Estripat: a la solució general de Dudeney, el text de Project Gutenberg
 *   havia perdut els exponents (10n − 1 és 10ⁿ − 1, 371 és 37¹…): restituïts.
 * DEPENDÈNCIES: js/comu/registre.js (al navegador)
 * ============================================================================
 */
(function (dades) {
    'use strict';
    if (typeof module === 'object' && module.exports) module.exports = dades;
    else window.DUDENEY.push.apply(window.DUDENEY, dades);
})([
    {
        id: 'estripat',
        ordre: 1,
        font: { llibre: 'am', numero: 113, titolOriginal: 'The Torn Number' },
        titol: 'El número estripat',
        tipus: 'aritmetica',
        tauler: 'estripat',
        dificultat: 1,
        enunciat: [
            '<p>L’altre dia tenia una etiqueta amb el número 3025 escrit en xifres grosses. Sense voler, es va estripar pel mig, de manera que el 30 va quedar en un tros i el 25 en l’altre, com es veu a la figura.</p>',
            '<p>Mirant els dos trossos, vaig començar a fer càlculs gairebé sense adonar-me’n, i vaig descobrir una petita curiositat: si sumem el 30 i el 25 i elevem la suma al quadrat, obtenim el número complet de l’etiqueta! És a dir, 30 més 25 fan 55, i 55 per 55 fan 3025. Curiós, oi?</p>',
            '<p>Ara el trencaclosques és trobar un altre número de quatre xifres, totes diferents, que es pugui partir pel mig i doni el mateix resultat.</p>',
        ],
        figuraEnunciat: { peu: 'L’etiqueta estripada: 30 i 25.', despres: 1 },
        regla: 'Busca un altre número de <strong>quatre xifres diferents</strong> que faci el mateix: (primera meitat + segona meitat)² = el número.',
        comEsJuga: [
            'Toca una xifra de l’etiqueta i escriu-la amb el teclat de sota (o amb el del teu ordinador).',
            'A sota de l’etiqueta es fa el compte: les dues meitats, la suma i el quadrat de la suma.',
        ],
        tecles: '<kbd>←</kbd> <kbd>→</kbd> canvien de xifra; <kbd>↑</kbd> <kbd>↓</kbd> la fan més gran o més petita; les tecles <kbd>0</kbd>…<kbd>9</kbd> l’escriuen.',
        dades: { exemple: '3025', solucio: '9801' },
        pistes: [
            'El número ha de ser un quadrat perfecte: és (suma)².',
            'Les dues meitats fan com a molt 99 + 99, però el quadrat ha de tenir quatre xifres: la suma ha de ser un nombre entre 32 i 99.',
            'Si la suma és <i>s</i>, les dues meitats de <i>s</i>² han de tornar a sumar <i>s</i>. Prova amb els quadrats dels nombres pròxims a 100.',
            'Prova 99 × 99.',
        ],
        solucioDudeney: [
            '<p>L’altre número que compleix totes les condicions del trencaclosques és el 9801. Si el partim pel mig en dos nombres i els sumem, obtenim 99, que multiplicat per si mateix fa 9801. És veritat que el 2025 també funciona, però queda exclòs per la condició que no hi pot haver dues xifres iguals.</p>',
            '<p>La solució general és curiosa. Diguem <i>n</i> al nombre de xifres de cada meitat de l’etiqueta. Si sumem 1 a cadascun dels exponents dels factors primers (llevat del 3) de 10<sup><i>n</i></sup> − 1 (considerant l’1 com un factor amb exponent 1), el producte d’aquests nombres és el nombre de solucions. Així, per a una etiqueta de sis xifres, <i>n</i> = 3. Els factors de 10³ − 1 són 1¹ × 37¹ (sense comptar el 3³), i el producte 2 × 2 = 4 és el nombre de solucions. Sempre hi ha els casos especials 98–01 i 00–01, 998–001 i 000–001, etc.</p>',
            '<p>Les solucions s’obtenen així. Es descompon 10³ − 1 de totes les maneres possibles, mantenint sempre juntes les potències de 3: 37 × 27 i 999 × 1. Després es resol l’equació 37<i>x</i> = 27<i>y</i> + 1; aquí, <i>x</i> = 19 i <i>y</i> = 26. Per tant, 19 × 37 = 703, i el seu quadrat dona una etiqueta: 494 209. Una solució complementària (que surt de 27<i>x</i> = 37<i>y</i> + 1) es troba de seguida fent 10³ − 703 = 297, el quadrat del qual dona l’etiqueta 088 209. Els zeros de l’esquerra s’han d’incloure, tot i que porten a casos curiosos com l’etiqueta 00238 04641, que és 4879², mentre que 0238 4641 no funcionaria.</p>',
            '<p>El cas especial 999 × 1 dona de seguida 998 001, segons la llei d’abans (afegint nous a una meitat i zeros a l’altra), i el seu complementari és un 1 precedit de cinc zeros, 000 001. Així tenim els quadrats de 999 i d’1. Aquestes són les quatre solucions.</p>',
        ],
        notaMatematic: [
            '<p><strong>Nombres de Kaprekar.</strong> Unes quantes dècades més tard, el matemàtic indi D. R. Kaprekar (1905–1986) va estudiar la mateixa propietat mirada a l’inrevés: un nombre és <i>de Kaprekar</i> si el seu quadrat es pot partir en dues parts que tornen a sumar el nombre. El 45, el 55 i el 99 ho són, perquè 45² = 2025 i 20 + 25 = 45, 55² = 3025 i 99² = 9801. Les etiquetes de Dudeney són els quadrats dels nombres de Kaprekar quan el quadrat es parteix just pel mig.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Provant totes les etiquetes de 0000 a 9999, només 0001, 2025, 3025 i 9801 compleixen (primera meitat + segona meitat)² = etiqueta, sense comptar el 0000; i només 3025 i 9801 tenen les quatre xifres diferents. Amb sis xifres surten exactament les quatre de Dudeney: 494 209, 088 209, 998 001 i 000 001.</p>',
            '<p>Un detall per a l’aula: el 2025, que Dudeney deixa de banda, també va ser un any curiós. 2025 = 45² i 45 = 1 + 2 + … + 9; per tant, 2025 és igual a 1³ + 2³ + … + 9³, la suma dels cubs de les xifres de l’1 al 9.</p>',
        ],
    },
    {
        id: 'aranya',
        ordre: 2,
        font: { llibre: 'cp', numero: 75, titolOriginal: 'The Spider and the Fly' },
        titol: 'L’aranya i la mosca',
        tipus: 'aritmetica',
        tauler: 'caixa',
        dificultat: 3,
        enunciat: [
            '<p>Dins d’una sala rectangular de 30 <span class="unitat" data-nota="1 peu ≈ 30,5 cm: la sala fa uns 9 m de llarg i 3,7 m d’ample i d’alt">peus</span> de llarg i 12 peus d’ample i d’alt hi ha una aranya en una de les parets dels extrems, al mig, a 1 peu del sostre, com a A; i una mosca a la paret de l’altre extrem, al centre, a 1 peu del terra, com a B.</p>',
            '<p>Quina és la distància més curta que ha de recórrer l’aranya per arribar fins a la mosca, que no es mou? És clar que l’aranya no es deixa caure ni fa servir la teranyina: camina com cal.</p>',
            '<p class="pantalla">A la pantalla, desplega la sala com si fos una capsa de cartró: tria per quines cares passa l’aranya, i se’n dibuixarà el camí recte.</p>',
        ],
        figuraEnunciat: { peu: 'La sala: l’aranya és a A i la mosca, a B.', despres: 1 },
        regla: 'Desplega la sala: tria per quines cares passa l’aranya, de la seva paret (<strong>A</strong>) a la de la mosca (<strong>B</strong>). Busca el camí <strong>més curt</strong>.',
        comEsJuga: [
            'Comences a la paret de l’aranya. Toca una de les cares de punts que hi ha al costat (o un dels botons de sota) per desplegar-la.',
            'Quan arribes a la paret de la mosca, el camí de l’aranya es dibuixa recte sobre el cartró i se’n veu la longitud.',
            'Si la recta surt del cartró, aquell camí no val: l’aranya no pot caminar per l’aire. Fes enrere i prova un altre desplegament.',
        ],
        tecles: '<kbd>Tab</kbd> recorre els botons de les cares; <kbd>Retorn</kbd> en desplega una; <kbd>⌫</kbd> treu la darrera.',
        dades: {
            sala: { llarg: 30, ample: 12, alt: 12 },
            aranya: [0, 6, 11],
            mosca: [30, 6, 1],
            minim: 40,
            solucio: ['A', 'sostre', 'porta', 'terra', 'B'],
            // Els quatre camins de la figura de Dudeney (42; 43,174; 40,718; 40)
            camins: [
                ['A', 'sostre', 'B'],
                ['A', 'porta', 'B'],
                ['A', 'sostre', 'porta', 'B'],
                ['A', 'sostre', 'porta', 'terra', 'B'],
            ],
        },
        pistes: [
            'El camí que tothom veu primer: pujar 1 peu, travessar el sostre (30 peus) i baixar-ne 11. Fa 42 peus. N’hi ha de més curts!',
            'En una capsa desplegada, el camí més curt entre dos punts és una línia recta… però la recta depèn de com despleguis la capsa.',
            'Prova camins que passin per més cares: per exemple, el sostre i una de les parets llargues.',
            'El més curt passa per cinc de les sis cares: la paret de l’aranya, el sostre, una paret llarga, el terra i la paret de la mosca.',
        ],
        solucioDudeney: [
            '<p>Tot i que aquest problema es va discutir molt al <i>Daily Mail</i> del 18 de gener al 7 de febrer de 1905, quan semblava que despertava un gran interès, en realitat el vaig proposar jo per primera vegada al <i>Weekly Dispatch</i> del 14 de juny de 1903.</p>',
            '<p>Imagineu-vos que la sala és una capsa de cartró. La capsa es pot tallar de diverses maneres perquè el cartró quedi pla damunt la taula. N’ensenyo quatre, i en cada cas hi indico la posició de l’aranya i de la mosca i el camí recte que ha de fer l’aranya sense sortir del cartró. Són els quatre casos més favorables, i el camí més curt és el del número 4, perquè només fa 40 peus (suma el quadrat de 32 i el de 24 i fes-ne l’arrel quadrada). Fixa’t que l’aranya passa per cinc de les sis cares de la sala!</p>',
            '<p>Un cop marcat el camí, torna a plegar la capsa (traient-ne la cara que l’aranya no fa servir): l’aspecte del camí més curt és força sorprenent. Si l’aranya hagués pres el que la majoria de la gent consideraria, evidentment, el camí més curt (el del número 1), hauria recorregut 42 peus! El camí número 2 fa 43,174 peus, i el número 3, 40,718 peus.</p>',
            '<p>Deixo que el lector descobreixi quins són els camins més curts quan l’aranya i la mosca són a 2, 3, 4, 5 i 6 peus del sostre i del terra, respectivament.</p>',
        ],
        posicioFiguraSolucio: 2,
        notaMatematic: [
            '<p><strong>Per què 40.</strong> Al desplegament del número 4, el camí és la hipotenusa d’un triangle rectangle de catets 24 i 32: √(24² + 32²) = √(576 + 1024) = √1600 = 40 peus, un nombre exacte. La recta passa pel sostre, una paret llarga i el terra, de biaix, i en plegar la capsa sembla una ziga-zaga.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Hem provat totes les maneres d’anar de la paret de l’aranya a la de la mosca sense repetir cap cara, hem desplegat la capsa per a cadascuna i hem comprovat que la recta no surt del cartró. El mínim és 40 peus, i també surten els altres camins de Dudeney: 42, 43,174 (√1864) i el del número 3, que fa √1658 = 40,7185…; Dudeney escriu 40,718, tallant els decimals, i arrodonit seria 40,719.</p>',
            '<p><strong>El repte final de Dudeney.</strong> Si l’aranya i la mosca són a 2 peus del sostre i del terra, el camí més curt fa √1700 ≈ 41,23 peus (pel sostre i una paret llarga); a 3 peus, √1746 ≈ 41,79; i a partir de 4 peus guanya el camí «evident» pel sostre, que sempre fa 42 peus.</p>',
        ],
    },
]);
