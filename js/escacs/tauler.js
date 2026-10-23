/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/escacs/tauler.js
 * ROL: Els taulers d'escacs:
 *   - Taulers.reines (AM 300): comença amb la figura de Dudeney; les reines
 *     s'arrosseguen, o es toquen i es deixen en una altra casella. Amb vuit
 *     reines es marquen les que s'ataquen (línia contínua) i els trios en
 *     línia (línia de punts, com a la figura del llibre).
 *   - Taulers.cavalls (AM 319): es posen i es treuen cavalls tocant les
 *     caselles; les atacades porten un punt. Quan no en queda cap de lliure,
 *     es marquen els cavalls sense protecció.
 *   Teclat: cursor amb les fletxes (una sola casella amb tabindex 0).
 * ARQUITECTURA: window.Taulers.reines / .cavalls = { crea(lloc, p, ctx), figura(p, o) }.
 *   Caselles [fila, columna], fila 0 a dalt. Les regles són a js/escacs/motor.js.
 * DEPENDÈNCIES: js/comu/comu.js, js/escacs/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const E = window.MotorEscacs;
    const Q = 60; // costat d'una casella
    const MARGE = 22; // per a les lletres i els números de les vores

    const nomCasella = (f, c, n) => 'abcdefgh'[c] + (n - f);

    // Les peces, dibuixades centrades a (0, 0) en una caixa de 44 × 44
    const REINA =
        'M-12 12 L-16 -9 L-9 1 L-8 -13 L-3 0 L0 -16 L3 0 L8 -13 L9 1 L16 -9 L12 12 Z';
    const CAVALL =
        'M11 16 L-12 16 Q-13 7 -4 1 Q-8 -1 -13 0 Q-18 -1 -16 -6 L-7 -14 Q-3 -18 1 -17 L3 -22 L6 -15 Q13 -10 13 0 Q13 9 11 16 Z';

    function peca(tipus, pare) {
        const g = C.svg('g', { class: 'peca ' + tipus }, pare);
        if (tipus === 'reina') {
            C.svg('path', { class: 'silueta', d: REINA }, g);
            C.svg('rect', { class: 'silueta', x: -13, y: 11, width: 26, height: 6, rx: 2 }, g);
            [
                [-16, -10],
                [-8, -14],
                [0, -17],
                [8, -14],
                [16, -10],
            ].forEach(p => C.svg('circle', { class: 'silueta', cx: p[0], cy: p[1], r: 2.6 }, g));
        } else {
            C.svg('path', { class: 'silueta', d: CAVALL }, g);
            C.svg('circle', { class: 'ull-cavall', cx: -6.5, cy: -8.5, r: 1.5 }, g);
            C.svg('path', { class: 'crinera', d: 'M4 -13 Q9 -7 9 2' }, g);
        }
        return g;
    }

    /** El tauler buit: caselles (amb el ratllat de les fosques), vores i capes per a les marques i les peces. */
    function dibuixaTauler(n, opcions = {}) {
        const W = n * Q + MARGE;
        const s = C.svg('svg', {
            'class': 'tauler-svg escacs-svg',
            'viewBox': `${-MARGE} 0 ${W} ${W}`,
            'role': opcions.estatic ? 'img' : 'grid',
            'aria-label': opcions.etiqueta || `Tauler d’escacs de ${n} × ${n}`,
        });
        const id = 'ratllat-' + (opcions.prefix || Math.random().toString(36).slice(2, 7));
        const pat = C.svg(
            'pattern',
            { id, patternUnits: 'userSpaceOnUse', width: 7, height: 7, patternTransform: 'rotate(45)' },
            C.svg('defs', null, s)
        );
        C.svg('rect', { class: 'fons-fosc', width: 7, height: 7 }, pat);
        C.svg('line', { class: 'ratlla', x1: 0, y1: 0, x2: 0, y2: 7 }, pat);
        const caselles = [];
        const capaCaselles = C.svg('g', { class: 'caselles' }, s);
        for (let f = 0; f < n; f++) {
            const fila = C.svg('g', { role: opcions.estatic ? null : 'row' }, capaCaselles);
            caselles.push([]);
            for (let c = 0; c < n; c++) {
                const g = C.svg('g', { 'class': 'casella-escacs', 'data-f': f, 'data-c': c, 'role': opcions.estatic ? null : 'gridcell' }, fila);
                const fosca = (f + c) % 2 === 1;
                C.svg('rect', { class: fosca ? 'fosca' : 'clara', x: c * Q, y: f * Q, width: Q, height: Q, fill: fosca ? `url(#${id})` : null }, g);
                caselles[f].push(g);
            }
        }
        C.svg('rect', { class: 'vora-tauler', x: 0, y: 0, width: n * Q, height: n * Q }, s);
        for (let i = 0; i < n; i++) {
            C.svg('text', { 'class': 'coord', 'x': i * Q + Q / 2, 'y': n * Q + 16, 'text': 'abcdefgh'[i] }, s);
            C.svg('text', { 'class': 'coord', 'x': -11, 'y': i * Q + Q / 2 + 5, 'text': n - i }, s);
        }
        const marques = C.svg('g', { class: 'marques' }, s);
        const linies = C.svg('g', { class: 'linies' }, s);
        const peces = C.svg('g', { class: 'peces' }, s);
        const cursor = C.svg('rect', { class: 'cursor', x: 0, y: 0, width: Q, height: Q, rx: 3 }, s);
        return { svg: s, caselles, marques, linies, peces, cursor, n };
    }
    const centre = q => [q[1] * Q + Q / 2, q[0] * Q + Q / 2];

    function posaPeca(capa, tipus, q, classe) {
        const g = peca(tipus, capa);
        const [x, y] = centre(q);
        g.style.transform = `translate(${x}px, ${y}px)`;
        if (classe) g.classList.add(classe);
        return g;
    }

    /** Teclat i cursor compartits pels dos taulers: retorna { cursor: [f, c], mou }. */
    function teclat(T, accio, extra) {
        const estat = { f: 0, c: 0 };
        const n = T.n;
        function enfoca(posaFocus) {
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => g.setAttribute('tabindex', f === estat.f && c === estat.c ? '0' : '-1'))
            );
            T.cursor.setAttribute('x', estat.c * Q);
            T.cursor.setAttribute('y', estat.f * Q);
            if (posaFocus) T.caselles[estat.f][estat.c].focus();
        }
        T.svg.addEventListener('keydown', e => {
            const d = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
            if (d) {
                estat.f = Math.max(0, Math.min(n - 1, estat.f + d[0]));
                estat.c = Math.max(0, Math.min(n - 1, estat.c + d[1]));
                enfoca(true);
                e.preventDefault();
            } else if (e.key === 'Enter' || e.key === ' ') {
                accio([estat.f, estat.c]);
                e.preventDefault();
            } else if (extra) extra(e, [estat.f, estat.c]);
        });
        T.svg.addEventListener('focusin', e => {
            const g = e.target.closest && e.target.closest('.casella-escacs');
            if (g) {
                estat.f = +g.dataset.f;
                estat.c = +g.dataset.c;
                enfoca(false);
                T.svg.classList.add('amb-cursor');
            }
        });
        T.svg.addEventListener('focusout', () => T.svg.classList.remove('amb-cursor'));
        enfoca(false);
        return {
            estat,
            posa(q) {
                estat.f = q[0];
                estat.c = q[1];
                enfoca(false);
            },
        };
    }
    function casellaDe(T, e, tactil) {
        const q = C.coords(T.svg, e.clientX, e.clientY - (tactil ? 30 : 0));
        const f = Math.floor(q.y / Q),
            c = Math.floor(q.x / Q);
        if (f < 0 || c < 0 || f >= T.n || c >= T.n) return null;
        return [f, c];
    }

    // ════════════════════════════════════════════════════════════
    // REINES
    // ════════════════════════════════════════════════════════════
    function dibuixaLinies(T, reines) {
        T.linies.replaceChildren();
        if (reines.length !== T.n) return { atacs: [], trios: [] };
        const atacs = E.conflictes(reines);
        atacs.forEach(([i, j]) => {
            const [x1, y1] = centre(reines[i]),
                [x2, y2] = centre(reines[j]);
            C.svg('line', { class: 'atac', x1, y1, x2, y2 }, T.linies);
        });
        // Els trios que no són ja un atac (en files, columnes o diagonals, ja surten com a atac)
        const trios = E.tresEnLinia(reines).filter(t => !E.reinesAtaquen(reines[t[0]], reines[t[1]]));
        trios.forEach(t => {
            const punts = t.map(i => reines[i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            const [x1, y1] = centre(punts[0]),
                [x2, y2] = centre(punts[2]);
            const dx = x2 - x1,
                dy = y2 - y1,
                l = Math.hypot(dx, dy);
            const k = 18 / l; // una mica més enllà de les dues reines dels extrems
            C.svg('line', { class: 'trio', x1: x1 - dx * k, y1: y1 - dy * k, x2: x2 + dx * k, y2: y2 + dy * k }, T.linies);
        });
        return { atacs, trios };
    }

    function figuraReines(p, opcions = {}) {
        const n = p.dades.mida;
        const cols = opcions.solucio ? p.dades.solucio : p.dades.inicial;
        const T = dibuixaTauler(n, {
            estatic: true,
            prefix: 'f' + (opcions.solucio ? 's' : 'i'),
            etiqueta: opcions.solucio ? 'La solució de Dudeney' : 'La figura de Dudeney, amb dos trios de reines en línia',
        });
        const reines = E.aCaselles(cols);
        reines.forEach(q => posaPeca(T.peces, 'reina', q));
        if (!opcions.senseLinies) dibuixaLinies(T, reines);
        return T.svg;
    }

    function creaReines(lloc, p, ctx) {
        const d = p.dades;
        const n = d.mida;
        let reines, triada, elsPeces;
        const caixa = C.el('div', { class: 'tauler escacs' });
        const T = dibuixaTauler(n, { prefix: 'joc' });
        caixa.appendChild(T.svg);
        lloc.appendChild(caixa);
        const kb = teclat(T, toca, (e, q) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const i = index(q);
                if (i >= 0) {
                    reines.splice(i, 1);
                    triada = null;
                    canvi();
                }
                e.preventDefault();
            } else if (e.key === 'Escape') {
                triada = null;
                pinta();
            }
        });

        T.svg.addEventListener('click', e => {
            if (C.acabaDeArrossegar()) return;
            const q = casellaDe(T, e, false);
            if (q) toca(q);
        });
        C.arrossega(T.svg, {
            inici: e => {
                const q = casellaDe(T, e, false);
                const i = q ? index(q) : -1;
                return i >= 0 ? { i } : null;
            },
            comenca: c => {
                triada = null;
                elsPeces[c.i].classList.add('arrossegada');
            },
            mou: (c, e) => {
                const q = C.coords(T.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                elsPeces[c.i].style.transform = `translate(${q.x}px, ${q.y}px)`;
            },
            deixa: (c, e) => {
                const q = casellaDe(T, e, c.tactil);
                if (!q) reines.splice(c.i, 1);
                else if (index(q) < 0) reines[c.i] = q;
                kb.posa(q || reines[0] || [0, 0]);
                canvi();
            },
            cancela: () => pinta(),
        });

        const index = q => reines.findIndex(r => r[0] === q[0] && r[1] === q[1]);

        function inicia() {
            reines = E.aCaselles(d.inicial);
            triada = null;
            canvi();
        }
        function toca(q) {
            const i = index(q);
            if (triada !== null) {
                if (i === triada) {
                    reines.splice(i, 1); // segon toc a la mateixa reina: es treu
                    triada = null;
                } else if (i >= 0) triada = i;
                else {
                    reines[triada] = q;
                    triada = null;
                }
                canvi();
                return;
            }
            if (i >= 0) {
                triada = i;
                pinta();
                return;
            }
            if (reines.length < n) {
                reines.push(q);
                canvi();
            } else {
                ctx.missatge('info', 'Ja hi ha vuit reines', ['Toca una reina per moure-la, o arrossega-la.']);
            }
        }
        function pinta() {
            T.peces.replaceChildren();
            elsPeces = reines.map((q, i) => posaPeca(T.peces, 'reina', q, i === triada ? 'triada' : null));
            T.svg.classList.toggle('amb-seleccio', triada !== null);
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => {
                    const hi = index([f, c]) >= 0;
                    g.setAttribute('aria-label', `${nomCasella(f, c, n)}${hi ? ', reina' : ''}`);
                })
            );
            return dibuixaLinies(T, reines);
        }
        function canvi() {
            ctx.amaga();
            const { atacs, trios } = pinta();
            ctx.estat([C.el('span', null, 'Reines: ', C.el('b', { text: `${reines.length} de ${n}` }))]);
            if (reines.length !== n) return;
            if (!atacs.length && !trios.length) {
                ctx.resolt('Ho has aconseguit!', [
                    'Cap reina no n’ataca cap altra, i no n’hi ha tres en línia en cap direcció.',
                ]);
                return;
            }
            const frases = [];
            if (atacs.length)
                frases.push(
                    atacs.length === 1
                        ? 'Hi ha dues reines que s’ataquen (la línia vermella).'
                        : `Hi ha ${atacs.length} parelles de reines que s’ataquen (les línies vermelles).`
                );
            if (trios.length)
                frases.push(
                    trios.length === 1
                        ? 'Hi ha tres reines en línia recta (la línia de punts).'
                        : `Hi ha ${trios.length} trios de reines en línia recta (les línies de punts).`
                );
            ctx.missatge(atacs.length ? 'error' : 'info', 'Encara no', frases);
        }
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Posa-la al tauler',
            solucio() {
                reines = E.aCaselles(d.solucio);
                triada = null;
                ctx.amaga();
                pinta();
                ctx.estat([C.el('span', null, 'Reines: ', C.el('b', { text: `${n} de ${n}` }))]);
                ctx.missatge('info', 'La solució de Dudeney', ['Cap atac i cap trio en línia.']);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // CAVALLS
    // ════════════════════════════════════════════════════════════
    function pintaCavalls(T, cavalls, opcions = {}) {
        const est = E.estatCavalls(cavalls, T.n);
        T.marques.replaceChildren();
        T.peces.replaceChildren();
        const ocupat = {};
        cavalls.forEach(q => (ocupat[q[0] + ',' + q[1]] = true));
        if (opcions.punts !== false)
            for (let f = 0; f < T.n; f++)
                for (let c = 0; c < T.n; c++) {
                    const k = f + ',' + c;
                    if (est.atacat[k] && !ocupat[k]) {
                        const [x, y] = centre([f, c]);
                        C.svg('circle', { class: 'atacada', cx: x, cy: y, r: 6 }, T.marques);
                    }
                }
        const sensePro = {};
        est.sensePro.forEach(q => (sensePro[q[0] + ',' + q[1]] = true));
        const marcaSense = opcions.protegits ? false : opcions.marcaSense;
        cavalls.forEach(q => {
            const k = q[0] + ',' + q[1];
            const [x, y] = centre(q);
            if (marcaSense && sensePro[k]) C.svg('circle', { class: 'sense-proteccio', cx: x, cy: y, r: 26 }, T.marques);
            if (opcions.protegits && !sensePro[k]) C.svg('circle', { class: 'protegit', cx: x, cy: y, r: 26 }, T.marques);
            posaPeca(T.peces, 'cavall', q);
        });
        return est;
    }

    function figuraCavalls(p, opcions = {}) {
        const d = p.dades;
        const llista = opcions.cavalls === 'exemple' ? d.exemple : opcions.cavalls === 'buit' ? [] : d.solucio;
        const T = dibuixaTauler(d.mida, {
            estatic: true,
            prefix: 'fc' + (opcions.cavalls || 's'),
            etiqueta:
                opcions.cavalls === 'exemple'
                    ? 'Els 12 cavalls de Dudeney: només 4 estan protegits'
                    : 'Una de les tres solucions de 14 cavalls',
        });
        pintaCavalls(T, llista, { punts: false, protegits: opcions.cavalls === 'exemple' });
        return T.svg;
    }

    function creaCavalls(lloc, p, ctx) {
        const d = p.dades;
        const n = d.mida;
        let cavalls;
        const hist = C.historial(x => x.map(q => q.slice()));
        const caixa = C.el('div', { class: 'tauler escacs' });
        const T = dibuixaTauler(n, { prefix: 'joc' });
        const exemple = C.el('button', { type: 'button', class: 'btn-sec', text: 'Comença amb els 12 cavalls de Dudeney' });
        caixa.append(T.svg, C.el('div', { class: 'eines-tauler' }, exemple));
        lloc.appendChild(caixa);
        teclat(T, toca);
        T.svg.addEventListener('click', e => {
            const q = casellaDe(T, e, false);
            if (q) toca(q);
        });
        exemple.addEventListener('click', () => {
            hist.desa(cavalls);
            cavalls = d.exemple.map(q => q.slice());
            canvi();
        });
        const index = q => cavalls.findIndex(r => r[0] === q[0] && r[1] === q[1]);

        function inicia() {
            cavalls = [];
            hist.buida();
            canvi();
        }
        function toca(q) {
            hist.desa(cavalls);
            const i = index(q);
            if (i >= 0) cavalls.splice(i, 1);
            else cavalls.push(q);
            canvi();
        }
        function canvi() {
            ctx.amaga();
            const est0 = E.estatCavalls(cavalls, n);
            const complet = cavalls.length > 0 && est0.lliures.length === 0;
            const est = pintaCavalls(T, cavalls, { marcaSense: complet });
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => {
                    const k = f + ',' + c;
                    const hi = index([f, c]) >= 0;
                    g.setAttribute(
                        'aria-label',
                        `${nomCasella(f, c, n)}${hi ? ', cavall' : est.atacat[k] ? ', atacada' : ', lliure'}`
                    );
                })
            );
            ctx.estat([
                C.el('span', null, 'Cavalls: ', C.el('b', { text: cavalls.length })),
                C.el('span', null, 'Caselles lliures: ', C.el('b', { text: est.lliures.length })),
            ]);
            ctx.desfes(hist.mida > 0);
            if (!complet) return;
            if (est.sensePro.length) {
                ctx.missatge('error', 'Totes les caselles estan cobertes, però…', [
                    est.sensePro.length === 1
                        ? 'Hi ha un cavall que no està protegit per cap altre (el del cercle de punts).'
                        : `Hi ha ${est.sensePro.length} cavalls que no estan protegits per cap altre (els dels cercles de punts).`,
                ]);
                return;
            }
            if (cavalls.length === d.minim)
                ctx.resolt(`${cavalls.length} cavalls: el mínim!`, [
                    'Totes les caselles ocupades o atacades, i cada cavall protegit per un altre.',
                ]);
            else
                ctx.missatge('info', `Fet amb ${cavalls.length} cavalls`, [
                    'Totes les caselles cobertes i tots els cavalls protegits. Es pot fer amb menys cavalls!',
                ]);
        }
        inicia();
        return {
            reinicia: inicia,
            desfes() {
                const ant = hist.desfes();
                if (ant) {
                    cavalls = ant;
                    canvi();
                }
            },
            textSolucio: '▶ Posa-la al tauler',
            solucio() {
                hist.desa(cavalls);
                cavalls = d.solucio.map(q => q.slice());
                canvi();
                ctx.amaga();
                ctx.missatge('info', 'Una solució de Dudeney', ['14 cavalls: set a cada color.']);
            },
        };
    }

    window.Taulers.reines = {
        crea: creaReines,
        figura: figuraReines,
        figuraSolucio: p => {
            const fig = C.el('figure', null, figuraReines(p, { solucio: true }));
            fig.firstChild.classList.add('figura-estatica');
            return fig;
        },
    };
    window.Taulers.cavalls = {
        crea: creaCavalls,
        figura: figuraCavalls,
        figuraSolucio: p => {
            const fig = C.el('figure', null, figuraCavalls(p, {}));
            fig.firstChild.classList.add('figura-estatica');
            return fig;
        },
    };
})();
