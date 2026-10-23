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
        id: 'amulet',
        ordre: 2,
        font: { llibre: 'cp', numero: 38, titolOriginal: 'The Amulet' },
        titol: 'L’amulet',
        tipus: 'aritmetica',
        tauler: 'amulet',
        dificultat: 1,
        enunciat: [
            '<p>Un dia van trobar un home estrany que rondava pel pati del castell i, com que parlava amb accent estranger, els servents van sospitar que era un espia. El van portar davant de Sir Hugh, que no en va poder treure res. Va manar que se l’emportessin i l’escorcollessin, per veure si duia amagada alguna carta secreta. Tot el que li van trobar va ser un tros de pergamí ben lligat al coll, amb aquesta inscripció misteriosa:</p>',
            '<p>Avui sabem que Abracadabra era el déu suprem dels assiris, i aquesta curiosa disposició de les lletres de la paraula es duia sovint a Europa com a amulet o talismà contra les malalties. Però Sir Hugh no n’havia sentit mai a parlar i, com que s’ho prenia força seriosament, va fer venir un sacerdot savi.</p>',
            '<p>—Us ho prego, senyor clergue —li va dir—, expliqueu-me el veritable significat d’aquest escrit tan estrany.</p>',
            '<p>—Sir Hugh —va respondre el sant home, després de parlar amb el foraster en una llengua estrangera—, no és més que un amulet que aquest pobre home porta al pit per protegir-se de les febres, del mal de queixal i d’altres mals del cos.</p>',
            '<p>—Doncs doneu-li menjar i roba, i que continuï el seu camí —va dir Sir Hugh—. Mentrestant, senyor clergue, em sabríeu dir de quantes maneres es pot llegir la paraula «Abracadabra» en aquest amulet, començant sempre per la A de dalt de tot?</p>',
            '<p>Posa el llapis a la A de dalt i compta de quantes maneres diferents pots seguir la paraula cap avall, passant sempre d’una lletra a una que hi estigui tocant.</p>',
        ],
        figuraEnunciat: { peu: 'L’amulet que duia el foraster.', despres: 1 },
        regla: 'De quantes maneres es pot llegir <strong>ABRACADABRA</strong> baixant pel triangle, des de la A de dalt?',
        comEsJuga: [
            'Toca les lletres una darrere l’altra, cap avall: de cada lletra pots baixar a la de sota a l’esquerra o a la de sota a la dreta.',
            'Quan arribes a baix de tot, el camí queda comptat. Toca una lletra del camí per tornar-hi i provar-ne un altre.',
            'Quan ho sàpigues, escriu la resposta i prem <strong>Comprova</strong>.',
        ],
        tecles: 'amb el triangle triat, <kbd>←</kbd> i <kbd>→</kbd> baixen a l’esquerra o a la dreta; <kbd>⌫</kbd> desfà el darrer pas.',
        dades: {
            paraula: 'ABRACADABRA',
            resposta: 1024,
            etiqueta: 'L’amulet: la paraula ABRACADABRA en un triangle, amb una A a dalt, dues B a la segona fila, tres R a la tercera, i així fins a onze A a baix',
            etiquetaComptes: 'L’amulet amb el nombre de maneres d’arribar a cada lletra: el triangle de Pascal',
            peuSolucio: 'Sota cada lletra, de quantes maneres s’hi arriba: és el triangle de Pascal. A la fila de baix: 1 + 10 + 45 + 120 + 210 + 252 + 210 + 120 + 45 + 10 + 1 = 1024.',
        },
        pistes: [
            'De cada lletra pots baixar a dues lletres de la fila de sota: la de l’esquerra o la de la dreta.',
            'A la segona fila, cada B s’hi arriba d’una sola manera. I a cada R?',
            'Per arribar a una lletra has de venir d’una de les dues que té a sobre: el nombre de maneres és la suma de les maneres d’arribar a aquestes dues.',
            'A cada fila, el nombre total de camins es dobla: 1, 2, 4, 8… I hi ha deu passos de la A de dalt a la fila de baix.',
        ],
        solucioDudeney: [
            '<p>—Ara, fixeu-vos-hi, bona gent —va dir Sir Hugh a uns quants que li havien demanat que ho expliqués—: ja de bon començament hi ha dos camins oberts. Trieu la B que trieu, hi haurà dues maneres de continuar (dues vegades dos fan quatre); trieu la R que trieu, hi haurà dues maneres de seguir (dues vegades quatre fan vuit), i així fins al final. A cada lletra, de la A cap avall, s’hi pot arribar de 2, 4, 8, 16, 32… maneres. Per tant, com que de la A fins a baix hi ha deu línies o passos en total, només heu de multiplicar deu 2 entre si, i el resultat, 1024, és la resposta que buscàveu.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>El triangle de Pascal.</strong> Si escrius sota cada lletra de quantes maneres s’hi pot arribar, surt el triangle de Pascal: cada nombre és la suma dels dos que té a sobre. A la fila de baix hi ha 1, 10, 45, 120, 210, 252, 210, 120, 45, 10 i 1, que són els nombres combinatoris de 10, i sumen 2¹⁰ = 1024. Comprovat per ordinador.</p>',
            '<p>⚠ <strong>Abracadabra no era cap déu assiri.</strong> El primer text conegut que la fa servir és el <i>Liber medicinalis</i> del metge romà Quint Serè Samònic (cap a l’any 200), que recomana escriure-la en un amulet contra la febre, però en forma de triangle que s’escurça una lletra a cada fila, perquè la febre minvi com la paraula. L’origen de la paraula és desconegut.</p>',
        ],
    },
    {
        id: 'rectangles',
        ordre: 3,
        font: { llibre: 'am', numero: 347, titolOriginal: 'Counting the Rectangles' },
        titol: 'Comptant els rectangles',
        tipus: 'aritmetica',
        tauler: 'rectangles',
        dificultat: 1,
        enunciat: [
            '<p>Sabries dir exactament quants quadrats i altres rectangles hi ha en un tauler d’escacs? Dit d’una altra manera: de quantes maneres diferents es pot marcar un quadrat o un altre rectangle tancat per les línies que separen les caselles del tauler?</p>',
            '<p class="pantalla">A la pantalla pots marcar rectangles arrossegant el dit pel tauler, i provar-ho amb taulers més petits. Quan ho sàpigues, escriu les dues respostes.</p>',
        ],
        regla: 'Quants <strong>rectangles</strong> (quadrats inclosos) té un tauler d’escacs? I quants són <strong>quadrats</strong>?',
        comEsJuga: [
            'Arrossega el dit (o el ratolí) pel tauler per marcar un rectangle: es diu quants n’hi ha com aquest.',
            'Pots canviar la mida del tauler, de 1 × 1 a 8 × 8, per provar-ho amb taulers petits.',
            'Escriu les dues respostes (per al tauler de 8 × 8) i prem <strong>Comprova</strong>.',
        ],
        tecles: 'amb el tauler triat, les fletxes mouen el cursor i <kbd>Retorn</kbd> marca una cantonada i després l’altra.',
        dades: { n: 8, total: 1296, quadrats: 204 },
        pistes: [
            'Comença amb un tauler de 2 × 2: té 9 rectangles (les 4 caselles, 4 rectangles de dues caselles i el tauler sencer), i 5 són quadrats.',
            'Un rectangle queda determinat per dues de les nou línies verticals del tauler i dues de les nou horitzontals.',
            'Hi ha 1 + 2 + … + 8 = 36 maneres de triar dues línies verticals, i també 36 de triar-ne dues d’horitzontals.',
            'Quadrats: n’hi ha 64 d’1 × 1, 49 de 2 × 2, 36 de 3 × 3… i 1 de 8 × 8.',
        ],
        solucioDudeney: [
            '<p>En total hi ha 1296 rectangles diferents, 204 dels quals són quadrats (comptant com un d’ells el tauler sencer), i 1092 rectangles que no són quadrats.</p>',
            '<p>La fórmula general és que un tauler de <i>n</i>² caselles conté (<i>n</i>² + <i>n</i>)²/4 rectangles, dels quals (2<i>n</i>³ + 3<i>n</i>² + <i>n</i>)/6 són quadrats i (3<i>n</i>⁴ + 2<i>n</i>³ − 3<i>n</i>² − 2<i>n</i>)/12 són rectangles que no són quadrats. És curiós i interessant que el nombre total de rectangles sempre és el quadrat del nombre triangular de costat <i>n</i>.</p>',
        ],
        notaMatematic: [
            '<p><strong>Per què és un quadrat.</strong> Un rectangle queda fixat per dues de les <i>n</i> + 1 línies verticals i dues de les <i>n</i> + 1 horitzontals. Triar dues línies d’entre nou es pot fer de 36 maneres (1 + 2 + … + 8, el nombre triangular), i per això hi ha 36 × 36 = 1296 rectangles. Els quadrats són 1² + 2² + … + 8² = 204.</p>',
            '<p><strong>Una igualtat preciosa.</strong> 1296 també és 1³ + 2³ + … + 8³. No és casualitat: per a qualsevol <i>n</i>, 1³ + 2³ + … + <i>n</i>³ = (1 + 2 + … + <i>n</i>)², és a dir, la suma dels cubs és el quadrat de la suma. És el teorema de Nicòmac, que ja era conegut cap a l’any 100. Per tant, el tauler de <i>n</i> × <i>n</i> té tants rectangles com la suma dels cubs d’1 a <i>n</i>.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Comptant un per un tots els rectangles, en taulers d’1 × 1 a 12 × 12, les tres fórmules de Dudeney sempre encerten. Al text de Project Gutenberg s’han perdut els exponents de les fórmules (hi diu «n2»): els hem restituït.</p>',
        ],
    },
    {
        id: 'cent',
        ordre: 4,
        font: { llibre: 'am', numero: 90, titolOriginal: 'The Century Puzzle' },
        titol: 'El problema del cent',
        tipus: 'aritmetica',
        tauler: 'xifres',
        dificultat: 2,
        enunciat: [
            '<p>Sabries escriure 100 en forma de nombre mixt fent servir les nou xifres una vegada, i només una? El distingit matemàtic francès Édouard Lucas, ja traspassat, va trobar set maneres diferents de fer-ho, i dubtava que n’hi hagués cap més. De fet, n’hi ha exactament onze, i cap més. Aquí en tens una: 91 5742/638.</p>',
            '<p>Nou de les altres maneres també tenen dues xifres a la part entera, però l’onzena només en té una. Sabries trobar aquesta última?</p>',
            '<p class="pantalla">Un nombre mixt és un enter amb una fracció al costat: 91 5742/638 vol dir 91 + 5742/638 (i 5742/638 = 9). A la pantalla, tria la forma i omple les caselles amb les xifres de l’1 al 9.</p>',
        ],
        figuraEnunciat: { peu: 'L’exemple de Dudeney: 91 + 5742/638 = 91 + 9 = 100.', despres: 1 },
        regla: 'Escriu 100 com a nombre mixt amb les <strong>nou xifres</strong>, una vegada cadascuna, amb <strong>una sola xifra</strong> a la part entera.',
        comEsJuga: [
            'Tria la forma de dalt. Toca una casella i després una xifra de sota (o escriu-la amb el teclat).',
            'Cada xifra només hi pot ser una vegada: si la poses en una altra casella, s’intercanvia amb la que hi havia.',
            'Quan les nou caselles són plenes, es fa el compte. Les maneres que trobis queden apuntades.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>9</kbd> escriuen la xifra; <kbd>←</kbd> <kbd>→</kbd> canvien de casella; <kbd>⌫</kbd> esborra.',
        dades: {
            tipus: 'cent',
            plantilles: [[2, 4, 3], [1, 5, 3]],
            buscada: [3, 69258, 714],
            totes: 11,
            figuraExemple: { parts: [{ xifres: '91' }, { op: '+' }, { frac: ['5742', '638'] }], etiqueta: '91 més 5742 partit per 638' },
            figuraSolucio: { parts: [{ xifres: '3' }, { op: '+' }, { frac: ['69258', '714'] }], etiqueta: '3 més 69258 partit per 714' },
            solucioTauler: [1, [3, 6, 9, 2, 5, 8, 7, 1, 4]],
        },
        pistes: [
            'Si la part entera té una sola xifra, la fracció ha de valer més de 90. Queden vuit xifres per a la fracció: cinc a dalt i tres a baix.',
            'Si la part entera és <i>a</i>, la fracció ha de valer 100 − <i>a</i>: el numerador ha de ser exactament (100 − <i>a</i>) vegades el denominador.',
            'Les xifres 1 + 2 + … + 9 sumen 45, que és múltiple de 9. Això fa que moltes parts enteres siguin impossibles: prova-les amb compte.',
            'La part entera és 3: la fracció ha de valer 97, i el denominador comença per 7.',
        ],
        solucioDudeney: [
            '<p>El problema d’escriure 100 com a nombre mixt o fracció fent servir les nou xifres una vegada, i només una, té, com tots aquests trencaclosques de xifres, un costat fascinant. Qualsevol principiant, amb paciència, pot obtenir resultats correctes, i hi ha un plaer singular a descobrir i apuntar cada nova combinació, semblant al del botànic que troba una planta que buscava des de feia temps. Aquestes són les onze respostes, incloent-hi la que vaig donar d’exemple:</p>',
            '<p class="llista-cent">96 2148/537 · 96 1752/438 · 96 1428/357 · 94 1578/263 · 91 7524/836 · 91 5823/647 · 91 5742/638 · 82 3546/197 · 81 7524/396 · 81 5643/297 · <strong>3 69258/714</strong></p>',
            '<p>Com que totes les fraccions representen nombres enters, és pràctic escriure-les així: 96 + 4, 94 + 6, 91 + 9, 82 + 18, 81 + 19 i 3 + 97. Amb cada part entera, les arrels digitals de la fracció que la completa fins a 100 sempre tenen una forma concreta. Així, en el cas de 96 + 4, podem dir de seguida que, si hi ha cap resposta, les arrels del numerador i del denominador seran totes dues 6.</p>',
            '<p>Tothom veurà que algunes parts enteres són clarament impossibles. Si la part entera té un 5, la fracció tindrà un zero o un segon 5. Els múltiples de 10, com 90 o 80, no poden sortir, i la part entera tampoc no pot acabar en 9, com 89 o 79, perquè la fracció valdria 11 o 21 i acabaria en 1, i repetiria una xifra. Tampoc no serveixen les parts enteres que repeteixen una xifra, com 88 o 77. I la part entera no pot anar de 12 a 23, perquè no hi ha denominadors prou petits per formar la fracció.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Un programa que prova les 362 880 maneres d’ordenar les nou xifres i totes les maneres de partir-les en part entera, numerador i denominador troba exactament les onze solucions de Dudeney: deu amb dues xifres a la part entera i una sola, 3 + 69258/714 = 3 + 97, amb una.</p>',
            '<p><strong>L’arrel digital.</strong> L’«arrel digital» d’un nombre és el que queda si en sumes les xifres, i després les xifres del resultat, fins que en queda una: 5742 → 18 → 9. És el residu de dividir el nombre per 9 (fent que un residu de 0 valgui 9), i per això dona una prova ràpida: com que 1 + 2 + … + 9 = 45, les arrels de les tres parts han de sumar un múltiple de 9. És la vella «prova del nou».</p>',
        ],
    },
    {
        id: 'multiplicacio',
        ordre: 5,
        font: { llibre: 'am', numero: 83, titolOriginal: 'Digital Multiplication' },
        titol: 'Multiplicació amb les nou xifres',
        tipus: 'aritmetica',
        tauler: 'xifres',
        dificultat: 2,
        enunciat: [
            '<p>Aquí tens un altre problema entretingut amb les nou xifres, sense el zero. Fent servir cada xifra una vegada, i només una, podem escriure dues multiplicacions que donin el mateix producte, i això es pot fer de moltes maneres. Per exemple, 7 × 658 i 14 × 329 contenen totes les xifres una vegada, i en tots dos casos el producte és el mateix: 4606.</p>',
            '<p>Es veurà que la suma de les xifres del producte és 16, que no és ni la més alta ni la més baixa que es pot obtenir. Sabries trobar la solució que dona la suma de xifres més petita al producte comú? I la que dona la suma més gran?</p>',
        ],
        figuraEnunciat: { peu: 'L’exemple de Dudeney: 7 × 658 = 14 × 329 = 4606.', despres: 1 },
        regla: 'Escriu dues multiplicacions iguals amb les <strong>nou xifres</strong>: troba la de <strong>suma de xifres més petita</strong> al producte i la de <strong>suma més gran</strong>.',
        comEsJuga: [
            'Tria la forma de dalt. Toca una casella i després una xifra de sota (o escriu-la amb el teclat).',
            'Cada xifra només hi pot ser una vegada: si la poses en una altra casella, s’intercanvia amb la que hi havia.',
            'Quan les nou caselles són plenes, es fan els dos productes. Les solucions que trobis queden apuntades amb la suma de les xifres.',
        ],
        tecles: '<kbd>1</kbd>…<kbd>9</kbd> escriuen la xifra; <kbd>←</kbd> <kbd>→</kbd> canvien de casella; <kbd>⌫</kbd> esborra.',
        dades: {
            tipus: 'producte',
            plantilles: [[1, 3, 2, 3], [2, 2, 2, 3], [1, 3, 1, 4], [1, 4, 2, 2]],
            minim: 4002,
            maxim: 6888,
            dudeney: 5886,
            figuraExemple: { parts: [{ xifres: '7' }, { op: '×' }, { xifres: '658' }, { op: '=' }, { xifres: '14' }, { op: '×' }, { xifres: '329' }], etiqueta: '7 per 658 igual a 14 per 329' },
            figuraSolucio: { parts: [{ xifres: '23' }, { op: '×' }, { xifres: '174' }, { op: '=' }, { xifres: '58' }, { op: '×' }, { xifres: '69' }], etiqueta: '23 per 174 igual a 58 per 69' },
            solucioTauler: [1, [5, 8, 6, 9, 2, 3, 1, 7, 4]],
        },
        pistes: [
            'Una suma de xifres petita vol dir un producte amb zeros: per exemple, quatre mil i pocs.',
            'La suma de les xifres d’un nombre deixa el mateix residu que el nombre quan es divideix per 9. Ajuda a descartar productes.',
            'La de suma més petita és de la forma ▢▢ × ▢▢ = ▢▢ × ▢▢▢, i el producte és 4002.',
            'La de suma més gran és de la forma ▢ × ▢▢▢ = ▢▢ × ▢▢▢, i el producte té tres vuits.',
        ],
        solucioDudeney: [
            '<p>La solució que dona la suma de xifres més petita al producte comú és 23 × 174 = 58 × 69 = 4002, i la que dona la suma més gran, 9 × 654 = 18 × 327 = 5886. En el primer cas les xifres sumen 6, i en el segon, 27. No hi ha cap altra manera de trobar la solució que provar-ho.</p>',
        ],
        posicioFiguraSolucio: 1,
        notaMatematic: [
            '<p>⚠ <strong>Dudeney s’equivoca en la segona.</strong> 7 × 984 = 56 × 123 = 6888 fa servir les nou xifres una vegada, i la suma de les xifres del producte és 30, més que el 27 de Dudeney. La de 5886 és només la segona més alta.</p>',
            '<p><strong>Comprovat per ordinador.</strong> Hi ha 59 parells de multiplicacions que fan servir les nou xifres una vegada (amb 57 productes diferents). La suma de xifres més petita és 6, i només s’aconsegueix amb 4002; la més gran és 30, i només amb 6888.</p>',
        ],
    },
    {
        id: 'bandolers',
        ordre: 6,
        font: { llibre: 'am', numero: 133, titolOriginal: 'The Five Brigands' },
        titol: 'Els cinc bandolers',
        tipus: 'aritmetica',
        tauler: 'bandolers',
        dificultat: 2,
        enunciat: [
            '<p>Els cinc bandolers espanyols Alfonso, Benito, Carlos, Diego i Esteban comptaven el botí després d’un assalt, i van veure que entre tots havien aconseguit exactament 200 <span class="unitat" data-nota="El dobló era una moneda d’or espanyola">doblons</span>. Un de la colla va fer notar que, si l’Alfonso en tingués dotze vegades més, el Benito tres vegades més, el Carlos els mateixos, el Diego la meitat i l’Esteban un terç, encara tindrien entre tots exactament 200 doblons. Quants doblons tenia cadascun?</p>',
            '<p>Hi ha força respostes igualment correctes. Aquí en tens una:</p>',
            '<table class="taula-dudeney"><tbody><tr><th>A</th><td>6</td><td>× 12</td><td>= 72</td></tr><tr><th>B</th><td>12</td><td>× 3</td><td>= 36</td></tr><tr><th>C</th><td>17</td><td>× 1</td><td>= 17</td></tr><tr><th>D</th><td>120</td><td>× ½</td><td>= 60</td></tr><tr><th>E</th><td>45</td><td>× ⅓</td><td>= 15</td></tr><tr><th></th><td>200</td><td></td><td>200</td></tr></tbody></table>',
            '<p>El trencaclosques és descobrir exactament quantes respostes diferents hi ha, entenent que cada home tenia alguna cosa i que no hi ha monedes partides: només doblons sencers. Aquest problema, amb un enunciat una mica diferent, el va proposar Tartaglia (que va morir el 1559), que es vantava d’haver-ne trobat una solució. Però un matemàtic francès notable, M. A. Labosne, en una obra recent, diu que els seus lectors quedaran astorats quan els asseguri que hi ha 6639 respostes correctes diferents. És així? Quantes respostes hi ha?</p>',
        ],
        regla: 'Cada bandoler té almenys un dobló, i no hi ha mitjos doblons. <strong>Quants repartiments</strong> hi ha que facin 200 de les dues maneres?',
        comEsJuga: [
            'Canvia els doblons de cada bandoler amb els botons − i + (o escrivint-los). A la dreta es veu el que tindria cadascun amb el canvi.',
            'A baix hi ha els dos totals: quan tots dos fan 200, el repartiment és correcte i queda comptat.',
            'Quan ho sàpigues, escriu quants repartiments hi ha i prem <strong>Comprova</strong>.',
        ],
        tecles: '<kbd>Tab</kbd> recorre les caselles; escriu-hi els nombres.',
        dades: {
            total: 200,
            noms: ['Alfonso', 'Benito', 'Carlos', 'Diego', 'Esteban'],
            factors: [['12', 12], ['3', 3], ['1', 1], ['½', 1 / 2], ['⅓', 1 / 3]],
            exemple: [6, 12, 17, 120, 45],
            solucions: 6627,
            labosne: 6639,
            etiquetaExemple: 'L’exemple de Dudeney: 6, 12, 17, 120 i 45 doblons, que amb el canvi fan 72, 36, 17, 60 i 15',
        },
        pistes: [
            'Les dues sumes són A + B + C + D + E = 200 i 12A + 3B + C + D/2 + E/3 = 200. Si les restes, el Carlos desapareix: 11A + 2B = D/2 + 2E/3.',
            'El Diego ha de tenir un nombre parell de doblons i l’Esteban, un múltiple de 3. I l’Alfonso no en pot tenir gaires: com a molt, 11.',
            'Compta els repartiments per separat per a cada quantitat de l’Alfonso, i després suma’ls.',
            'Amb l’Alfonso amb 1 dobló hi ha 1005 repartiments; amb 6, 704; amb 11, només 3.',
        ],
        solucioDudeney: [
            '<p>Els bandolers podien tenir els 200 doblons de qualsevol de 6627 maneres diferents. L’Alfonso podia tenir qualsevol quantitat de l’1 a l’11. Si en tenia 1, hi ha 1005 maneres diferents de repartir la resta; si en tenia 2, 985; si 3, 977; si 4, 903; si 5, 832; si 6, 704; si 7, 570; si 8, 388; si 9, 200; si 10, 60, i si en tenia 11, la resta es podia repartir de 3 maneres. Més d’11 doblons no en podia tenir de cap manera.</p>',
            '<p>No s’esperarà que doni les 6627 maneres una per una. Però per a cada quantitat de l’Alfonso, el nombre de respostes és la suma de dues progressions aritmètiques, una de diferència 1 i l’altra de diferència −4. Així, quan l’Alfonso té 6 doblons, una progressió és 33 + 34 + 35 + … + 44 i l’altra, 42 + 38 + 34 + … + 6 + 2. La primera suma 462 i la segona 242, que fan les 704 respostes. Quan l’Alfonso té 9, 10 o 11 doblons, només hi ha una progressió, de la segona mena.</p>',
        ],
        notaMatematic: [
            '<p><strong>Comprovat per ordinador.</strong> Un programa que prova totes les possibilitats troba exactament 6627 repartiments, i el nombre per a cada quantitat de l’Alfonso coincideix un per un amb els de Dudeney, de 1005 a 3. Labosne s’equivocava per 12.</p>',
            '<p><strong>Dues equacions i cinc incògnites.</strong> Amb menys equacions que incògnites hi ha infinites solucions… si es permeten fraccions o nombres negatius. Demanar nombres enters positius, i que la meitat i el terç també ho siguin, en deixa un nombre finit, i comptar-les és el que avui en diríem un problema d’<i>equacions diofàntiques</i>.</p>',
        ],
    },
    {
        id: 'aranya',
        ordre: 7,
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
