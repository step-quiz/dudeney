/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/imprimir.js
 * ROL: Munta les fitxes per imprimir a partir de les mateixes dades i figures
 *   del web:
 *   - imprimir/enigmes.html (data-full="enigmes"): una portada amb l'índex i
 *     un full A4 per enigma (enunciat, figura, què cal fer i espai per pensar);
 *   - imprimir/solucions.html (data-full="solucions"): la solució de Dudeney,
 *     la seva figura i la nota del matemàtic de cada enigma.
 * ARQUITECTURA: Tot es dibuixa amb Taulers[t].figura / .figuraSolucio; el CSS
 *   d'impressió (css/imprimir.css) ho deixa en blanc i negre. El PDF el fa
 *   tools/genera-pdf.js.
 * DEPENDÈNCIES: js/comu/comu.js, js/comu/registre.js, les dades i els taulers.
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const LLISTA = window.Dudeney.llista();
    const CREDIT =
        'Problemes de Henry E. Dudeney (1857–1930), d’obres de domini públic: The Canterbury Puzzles (1907) i Amusements in Mathematics (1917). Traducció, adaptació i figures: David Arso Civil (CC BY-NC-SA 4.0). dudeney.step-quiz.net';

    // El que cal fer en paper, i les opcions de la figura de cada enigma
    const PAPER = {
        brocat: { regla: 'Retalla els dos quadrats només per les línies de la quadrícula, en quatre peces en total, i munta un quadrat de 10 × 10 amb les flors ben alternades. Dues peces han de tenir la mateixa àrea.' },
        mercer: { regla: 'Aquí tens les quatre peces de Dudeney: retalla-les i fes-ne un quadrat, sense girar-ne cap del revés. (Repte complet: dibuixa un triangle equilàter i busca tu els talls.)', figura: { peces: true } },
        granotes: { regla: 'Fes-ho amb sis monedes o papers numerats. Apunta l’ordre en què mous les granotes i compta els moviments.' },
        'granotes-gots': { regla: 'Fes-ho amb tres monedes d’un tipus i tres d’un altre sobre set llocs numerats. Apunta cada salt (d’on i cap on) i compta’ls: en calen deu.', linia: 'Els salts:' },
        twickenham: { regla: 'Fes-ho amb deu papers amb les lletres (cinc de clars i cinc de foscos) sobre onze llocs en cercle. Les foscos giren com les agulles del rellotge; les clares, al revés. Apunta les lletres que mous, per ordre: en calen vint-i-sis.', linia: 'Les lletres que mous:' },
        lletres: { regla: 'Fes-ho amb vuit papers amb lletres sobre una quadrícula de 3 × 3. Apunta les lletres que mous, per ordre. Quants moviments calen, com a mínim?', linia: 'Les lletres que mous:' },
        'quatre-granotes': { regla: 'Fes-ho amb dues monedes d’un tipus i dues d’un altre sobre el dibuix. Apunta cada jugada entre parèntesis, amb tots els moviments seguits d’una mateixa granota: en calen set.', linia: 'Les jugades:' },
        formatges: { regla: 'Fes-ho amb vuit monedes de mides diferents (o vuit papers numerats) i quatre llocs. Compta els moviments: quants en calen, com a mínim?' },
        rierol: { regla: 'Escriu cada travessia: qui va a la barca i cap a on. La barca no pot portar més de 150 lliures, i el gos (que en pesa 30) no sap remar.', taula: ['Travessia', 'A la barca', 'Cap a'], files: 12 },
        gerres: { regla: 'Escriu, després de cada abocada, quant vi hi ha a cada recipient. Cada vegada que vesses, el vi passa fins que l’un queda buit o l’altre ple.', taula: ['', 'gerra de 10', 'gerra de 10', 'mesura de 5', 'mesura de 4'], files: 12, primera: ['inici', '10', '10', '0', '0'] },
        bol: { regla: 'Escriu, després de cada manipulació, quanta llimonada hi ha al barril i a cada gerra, i quanta se n’ha begut cada rodamón. El que un rodamón s’ha begut ja no torna.', taula: ['', 'barril', 'gerra de 5', 'gerra de 3', 'X', 'Y', 'Z'], files: 12, primera: ['inici', '12', '0', '0', '0', '0', '0'] },
        tresor: { regla: 'Escriu cada manipulació: qui baixa i qui puja. Si a la cistella que baixa hi ha una persona, la diferència de pes no pot passar de 15 lliures; el tresor sol pot baixar amb qualsevol diferència.', linia: 'Les manipulacions (qui baixa i qui puja):' },
        entrenadors: { regla: 'Escriu cada travessia: qui va a la barca i cap a on. Hi caben tres persones, i cap estrella (minúscula) no pot estar amb un altre entrenador (majúscula) si el seu no hi és.', taula: ['Travessia', 'A la barca', 'Cap a'], files: 12 },
        alfils: { regla: 'Dibuixa alfils (punts o creus) perquè totes les caselles quedin ocupades o atacades. Recorda que un alfil no ataca a través d’una altra peça. Quants en calen, com a mínim?', figura: { cavalls: 'buit' } },
        'alfils-protegits': { regla: 'Dibuixa alfils perquè totes les caselles quedin ocupades o atacades i cada alfil estigui protegit per un altre. Quants en calen, com a mínim?', figura: { cavalls: 'buit' } },
        peons: { regla: 'Dibuixa els catorze peons que falten (setze amb els de d4 i e5): a cada fila i a cada columna n’hi ha d’haver dos, i mai tres en línia recta en cap direcció.' },
        reines: { regla: 'Busca una col·locació de vuit reines sense atacs i sense tres reines en línia en cap direcció. Dibuixa-la al tauler buit.', extra: 'tauler' },
        cavalls: { regla: 'Posa cavalls (punts o monedes) perquè totes les caselles quedin ocupades o atacades i cada cavall estigui protegit per un altre. Quants en calen, com a mínim?', figura: { cavalls: 'buit' } },
        ciutats: { regla: 'Dibuixa la ruta sobre el mapa: surt de l’1, passa una sola vegada per cada ciutat i torna a l’1. Quantes rutes hi ha?' },
        metro: { regla: 'Dibuixa la ruta sobre el plànol i escriu-la amb les lletres de les estacions. Quantes milles fa, com a mínim?', linia: 'Ruta:' },
        mina: { regla: 'Dibuixa la ruta sobre el plànol, sortint de la A, i escriu-la amb les lletres de les cruïlles. Quants furlongs fa, com a mínim?', linia: 'Ruta:' },
        mariner: { regla: 'Dibuixa la ruta sobre el mapa, sortint de la A, i escriu-la amb les lletres de les illes. Recorda que el mariner deixa la C per al més tard possible.', linia: 'Ruta:' },
        torre: { regla: 'Dibuixa el recorregut de la torre, sortint de d5: cada jugada és una línia recta per una fila o una columna, i cap casella no es pot repetir. Quantes jugades calen, com a mínim?' },
        vuit: { regla: 'Escriu nou nombres diferents perquè totes les files, columnes i diagonals sumin 15, amb el 8 al lloc on és.' },
        bachet: { regla: 'Escriu les setze cartes al quadrat (A, K, Q, J i ♦ ♠ ♥ ♣): cap fila, columna ni diagonal llarga pot repetir pal ni valor. De quantes maneres es pot fer?', figura: { cartes: new Array(16).fill(null) } },
        estripat: { regla: 'Busca un altre número de quatre xifres diferents que faci (primera meitat + segona meitat)² = el número.', linia: 'El número:' },
        aranya: { regla: 'Dibuixa la sala desplegada com una capsa de cartró i traça-hi el camí recte de l’aranya. Quin és el camí més curt?' },
    };

    function textNet(html) {
        const caixa = C.el('div', { html });
        caixa.querySelectorAll('.pantalla').forEach(e => e.remove());
        return caixa;
    }
    function notesUnitats(caixa) {
        const notes = [...new Set([...caixa.querySelectorAll('.unitat[data-nota]')].map(e => e.dataset.nota))];
        return notes.length ? C.el('p', { class: 'notes-unitats', text: 'Unitats: ' + notes.join('; ') + '.' }) : null;
    }
    function figura(p, opcions) {
        const T = window.Taulers[p.tauler];
        const f = T.figura(p, opcions || {});
        return C.el('div', { class: 'figura-full' }, f);
    }

    function fullPortada(titol, entrada) {
        const s = C.el('section', { class: 'full portada-full' });
        s.append(
            C.el('div', { class: 'cap-full' }, C.el('span', { text: 'Step Quiz · dudeney.step-quiz.net' }), C.el('span', { text: `${LLISTA.length} enigmes` })),
            C.el('h1', { text: titol }),
            C.el('p', { class: 'entrada', text: entrada })
        );
        const taula = C.el('table', { class: 'index-enigmes' });
        LLISTA.forEach((p, i) =>
            taula.appendChild(
                C.el('tr', null, C.el('td', { text: i + 1 }), C.el('td', { text: p.titol }), C.el('td', { text: C.TIPUS[p.tipus].nom + ' · dificultat ' + p.dificultat + ' de 3' }))
            )
        );
        s.append(taula, C.el('p', { class: 'peu-full', text: CREDIT }));
        return s;
    }

    function fullEnigma(p, i) {
        const o = PAPER[p.id] || {};
        const s = C.el('section', { 'class': 'full', 'data-id': p.id });
        const llibre = C.LLIBRES[p.font.llibre];
        s.append(
            C.el('div', { class: 'cap-full' }, C.el('span', { text: `Enigma ${i + 1} de ${LLISTA.length}` }), C.el('span', { class: 'tipus', text: `${C.TIPUS[p.tipus].nom} · dificultat ${p.dificultat} de 3` })),
            C.el('h1', { text: p.titol }),
            C.el('p', { class: 'original', text: `${p.font.titolOriginal}, ${llibre.titol} (${llibre.any}), núm. ${p.font.numero}` })
        );
        const text = textNet(p.enunciat.join(''));
        text.className = 'text-full';
        s.appendChild(text);
        const notes = notesUnitats(text);
        if (notes) s.appendChild(notes);
        const fig = figura(p, o.figura || p.figuraEnunciat);
        if (o.extra === 'tauler') {
            // al costat de la figura de Dudeney, un tauler buit per dibuixar-hi
            fig.classList.add('dues');
            fig.appendChild(window.Taulers.cavalls.figura(window.Dudeney.perId('cavalls'), { cavalls: 'buit' }));
        }
        s.appendChild(fig);
        if (o.regla) s.appendChild(C.el('p', { class: 'regla-full', text: o.regla }));
        if (o.taula) {
            const t = C.el('table', { class: 'taula-buida' });
            t.appendChild(C.el('tr', null, o.taula.map(h => C.el('th', { text: h }))));
            for (let k = 0; k < o.files; k++) {
                const fila = k === 0 && o.primera ? o.primera : o.taula.map((h, j) => (j === 0 && o.taula[0] === 'Travessia' ? String(k + 1) : j === 0 && !h ? String(k) : ''));
                t.appendChild(C.el('tr', null, fila.map(x => C.el('td', { text: x }))));
            }
            s.appendChild(t);
        }
        s.appendChild(C.el('div', { 'class': 'espai', 'data-text': o.linia || 'Espai per pensar-hi' }));
        s.appendChild(C.el('p', { class: 'peu-full', text: CREDIT }));
        return s;
    }

    function fullSolucio(p, i) {
        const s = C.el('section', { 'class': 'solucio-full', 'data-id': p.id });
        s.append(
            C.el('div', { class: 'cap-full' }, C.el('span', { text: `Solució de l’enigma ${i + 1}` }), C.el('span', { class: 'tipus', text: C.TIPUS[p.tipus].nom })),
            C.el('h1', { text: p.titol }),
            C.el('h2', { text: 'La solució de Dudeney' })
        );
        const t = C.el('div', { class: 'text', html: p.solucioDudeney.join('') });
        const T = window.Taulers[p.tauler];
        let fig = null;
        if (T.figuraSolucio) fig = T.figuraSolucio(p);
        else if (p.tauler === 'salts')
            fig = C.el(
                'figure',
                null,
                T.figura(p, { estat: p.dades.final || [0, 6, 5, 4, 3, 2, 1] }),
                C.el('figcaption', { text: p.dades.peuFinal || 'Al final: 6, 5, 4, 3, 2, 1.' })
            );
        if (fig) t.insertBefore(fig, t.children[p.posicioFiguraSolucio || 1] || null);
        s.appendChild(t);
        s.append(C.el('h2', { text: 'Nota del matemàtic' }), C.el('div', { class: 'text', html: p.notaMatematic.join('') }));
        s.appendChild(C.el('p', { class: 'peu-full', text: CREDIT }));
        return s;
    }

    const cos = document.body;
    document.querySelectorAll('.nomes-amb-solucions').forEach(e => (e.hidden = !C.ambSolucions()));
    C.propagaSolucions();
    // Les solucions només es mostren amb ?sol=1 (el PDF les genera amb aquest paràmetre)
    if (cos.dataset.full === 'solucions' && !C.ambSolucions()) {
        cos.appendChild(C.el('section', { class: 'solucio-full' }, C.el('h1', { text: 'Les solucions no són públiques' }), C.el('p', { text: 'Demana-les al teu professor o professora.' })));
        return;
    }
    if (cos.dataset.full === 'enigmes') {
        cos.appendChild(fullPortada('Els enigmes de Dudeney', `${LLISTA.length} trencaclosques de Henry E. Dudeney, el gran inventor d’enigmes anglès, traduïts al català, de set tipus diferents. Un enigma per full, amb espai per pensar-hi. Les solucions són en un altre document. A la pantalla s’hi pot jugar a dudeney.step-quiz.net.`));
        LLISTA.forEach((p, i) => cos.appendChild(fullEnigma(p, i)));
    } else {
        LLISTA.forEach((p, i) => cos.appendChild(fullSolucio(p, i)));
    }
    document.querySelectorAll('[data-imprimeix]').forEach(b => b.addEventListener('click', () => window.print()));
})();
