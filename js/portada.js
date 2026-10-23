/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/portada.js
 * ROL: La portada (index.html): un capítol per tipus d'enigma, amb les
 *   plaques dels seus enigmes (gravat, títol, títol original, llibre,
 *   dificultat i ✓ si ja s'ha resolt), els filtres per tipus i per dificultat
 *   i el resum del progrés.
 * ARQUITECTURA: Els gravats són les figures dels mateixos taulers
 *   (Taulers[t].figura), que el CSS converteix en un gravat d'un sol color;
 *   els dos taulers que són HTML (el quadrat màgic i les cartes) en tenen un
 *   de propi, dibuixat aquí en SVG. Els filtres es recorden al navegador
 *   (localStorage, si es pot), només per comoditat.
 * DEPENDÈNCIES: js/comu/comu.js, js/comu/registre.js, les dades i els taulers.
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const LLISTA = window.Dudeney.llista();
    const progres = C.progres();
    const $ = id => document.getElementById(id);
    const CLAU_FILTRE = 'dudeney.filtre';

    let filtre = { tipus: 'tots', dificultat: 0 };
    try {
        const f = JSON.parse(localStorage.getItem(CLAU_FILTRE));
        if (f && typeof f.tipus === 'string' && typeof f.dificultat === 'number') filtre = f;
    } catch (e) {
        /* sense localStorage */
    }
    const desaFiltre = () => {
        try {
            localStorage.setItem(CLAU_FILTRE, JSON.stringify(filtre));
        } catch (e) {
            /* sense localStorage */
        }
    };

    // ============================================================
    // GRAVATS
    // ============================================================
    function gravatMagic() {
        const s = C.svg('svg', { 'viewBox': '0 0 120 120', 'aria-hidden': 'true' });
        C.svg('rect', { class: 'gr-ratlla', x: 6, y: 6, width: 108, height: 108 }, s);
        [42, 78].forEach(k => {
            C.svg('line', { class: 'gr-ratlla', x1: 6, y1: k, x2: 114, y2: k }, s);
            C.svg('line', { class: 'gr-ratlla', x1: k, y1: 6, x2: k, y2: 114 }, s);
        });
        C.svg('text', { 'class': 'gr-xifra', 'x': 60, 'y': 26, 'text': '8' }, s);
        C.svg('text', { 'class': 'gr-xifra petita', 'x': 60, 'y': 62, 'text': '?' }, s);
        return s;
    }
    function gravatCartes() {
        const s = C.svg('svg', { 'viewBox': '0 0 160 110', 'aria-hidden': 'true' });
        [['A', -16], ['K', -6], ['Q', 4], ['J', 14]].forEach(([v, a], i) => {
            const g = C.svg('g', null, s);
            g.setAttribute('transform', `translate(${38 + i * 26} 18) rotate(${a} 22 70)`);
            C.svg('rect', { class: 'gr-carta', x: 0, y: 0, width: 46, height: 66, rx: 5 }, g);
            C.svg('text', { 'class': 'gr-lletra', 'x': 8, 'y': 15, 'text': v }, g);
            C.svg('text', { 'class': 'gr-pal', 'x': 23, 'y': 44, 'text': ['♦', '♠', '♥', '♣'][i] }, g);
        });
        return s;
    }
    function gravat(p) {
        if (p.tauler === 'magic') return gravatMagic();
        if (p.tauler === 'cartes') return gravatCartes();
        const T = window.Taulers[p.tauler];
        const s = T.figura(p, { cavalls: 'exemple', vinyeta: true });
        s.setAttribute('aria-hidden', 'true');
        s.removeAttribute('role');
        return s;
    }

    // ============================================================
    // CAPÍTOLS I PLAQUES
    // ============================================================
    function placa(p) {
        const llibre = C.LLIBRES[p.font.llibre];
        const fet = progres.esResolt(p.id);
        const a = C.el('a', { 'class': 'placa', 'href': `enigma.html?p=${p.id}`, 'data-tipus': p.tipus, 'data-dificultat': p.dificultat });
        a.appendChild(C.el('div', { class: 'gravat' }, gravat(p), C.dificultat(p.dificultat, C.NOM_DIFICULTAT[p.dificultat])));
        const peu = C.el('div', { class: 'peu-placa' });
        peu.append(
            C.el('h3', { text: p.titol }),
            C.el('p', { class: 'titol-original', lang: 'en', text: p.font.titolOriginal }),
            C.el('p', { class: 'meta' }, C.el('cite', { text: llibre.titol }), ` (${llibre.any}), núm. ${p.font.numero}`)
        );
        a.appendChild(peu);
        if (fet) a.appendChild(C.el('span', { class: 'resolt', text: '✓ resolt' }));
        a.setAttribute('aria-label', `${p.titol}, ${C.TIPUS[p.tipus].nom}, dificultat ${p.dificultat} de 3${fet ? ', resolt' : ''}`);
        return a;
    }
    function capitols() {
        const lloc = $('capitols');
        lloc.replaceChildren();
        C.ORDRE_TIPUS.forEach(t => {
            const del = LLISTA.filter(p => p.tipus === t);
            if (!del.length) return;
            const sec = C.el('section', { 'class': 'capitol', 'data-tipus': t, 'aria-labelledby': 'cap-' + t });
            sec.append(
                C.el('div', { class: 'capitol-cap' }, C.el('span', { class: 'emblema' }, C.emblema(t)), C.el('h2', { id: 'cap-' + t, text: C.TIPUS[t].nom })),
                C.el('p', { class: 'descripcio', text: C.TIPUS[t].descripcio }),
                C.el('div', { class: 'plaques' }, del.map(placa))
            );
            lloc.appendChild(sec);
        });
    }

    // ============================================================
    // FILTRES
    // ============================================================
    function xip(text, actiu, accio, tipus, contingut) {
        const b = C.el('button', { 'type': 'button', 'class': 'xip', 'aria-pressed': actiu ? 'true' : 'false', 'data-tipus': tipus || null });
        if (contingut) b.append(...contingut);
        b.append(text);
        b.addEventListener('click', accio);
        return b;
    }
    function pintaFiltres() {
        const ft = $('filtre-tipus'),
            fd = $('filtre-dificultat');
        ft.replaceChildren(C.el('span', { class: 'filtre-nom', text: 'Tipus' }));
        fd.replaceChildren(C.el('span', { class: 'filtre-nom', text: 'Dificultat' }));
        ft.appendChild(xip('Tots', filtre.tipus === 'tots', () => tria('tipus', 'tots')));
        C.ORDRE_TIPUS.forEach(t =>
            ft.appendChild(xip(C.TIPUS[t].nom, filtre.tipus === t, () => tria('tipus', t), t, [C.el('span', { class: 'emblema' }, C.emblema(t))]))
        );
        fd.appendChild(xip('Totes', filtre.dificultat === 0, () => tria('dificultat', 0)));
        [1, 2, 3].forEach(n => {
            const punts = C.el('span', { 'class': 'punts', 'aria-hidden': 'true' });
            for (let i = 1; i <= 3; i++) punts.appendChild(C.el('i', { class: i <= n ? 'ple' : '' }));
            fd.appendChild(xip(C.NOM_DIFICULTAT[n], filtre.dificultat === n, () => tria('dificultat', n), null, [punts]));
        });
    }
    function tria(que, valor) {
        filtre[que] = valor;
        desaFiltre();
        pintaFiltres();
        aplica();
    }
    function aplica() {
        let visibles = 0;
        document.querySelectorAll('.capitol').forEach(sec => {
            let n = 0;
            sec.querySelectorAll('.placa').forEach(a => {
                const ok =
                    (filtre.tipus === 'tots' || a.dataset.tipus === filtre.tipus) &&
                    (!filtre.dificultat || +a.dataset.dificultat === filtre.dificultat);
                a.hidden = !ok;
                if (ok) n++;
            });
            sec.hidden = n === 0;
            visibles += n;
        });
        const total = LLISTA.length;
        $('resum-filtre').textContent =
            visibles === total ? `${total} enigmes.` : visibles ? `${C.plural(visibles, 'enigma')} de ${total}.` : 'Cap enigma amb aquests filtres.';
    }

    // ============================================================
    // PROGRÉS
    // ============================================================
    function resum() {
        const n = LLISTA.filter(p => progres.esResolt(p.id)).length;
        const e = $('resum-progres');
        e.textContent =
            n === 0
                ? `${LLISTA.length} enigmes de set tipus diferents. Tria’n un i comença!`
                : n === LLISTA.length
                  ? `Els has resolt tots, els ${LLISTA.length}! Quin enginy.`
                  : `N’has resolt ${n} de ${LLISTA.length}.`;
    }

    capitols();
    // Les solucions (fitxes i PDF) només s'enllacen amb ?sol=1
    document.querySelectorAll('.nomes-amb-solucions').forEach(e => (e.hidden = !C.ambSolucions()));
    C.propagaSolucions();
    pintaFiltres();
    aplica();
    resum();
})();
