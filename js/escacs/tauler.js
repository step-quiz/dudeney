/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/escacs/tauler.js
 * ROL: Els taulers d'escacs:
 *   - Taulers.reines (AM 300, AM 317): comença amb la figura de Dudeney (o amb
 *     les peces fixes de l'enunciat); les peces s'arrosseguen, o es toquen i es
 *     deixen en una altra casella. Amb totes les peces es marquen les reines
 *     que s'ataquen (línia contínua) i els trios en línia (línia de punts, com
 *     a la figura del llibre). dades.peca 'peo' + atacs:false = només trios.
 *   - Taulers.cavalls (AM 319, AM 297, AM 298): es posen i es treuen peces
 *     (dades.peca 'cavall' | 'alfil') tocant les caselles; les atacades porten
 *     un punt. Quan no en queda cap de lliure, es marquen les peces sense
 *     protecció (si dades.protegits no és false).
 *   - Taulers.torre (AM 320, de tipus camins): la torre surt de d5 i es toca la
 *     casella on ha d'anar; es marquen totes les caselles per on passa, i no en
 *     pot repetir cap. S'acaba en tornar a d5 després de visitar-les totes.
 *   Teclat: cursor amb les fletxes (una sola casella amb tabindex 0).
 * ARQUITECTURA: window.Taulers.reines / .cavalls = { crea(lloc, p, ctx), figura(p, o) }.
 *   Caselles [fila, columna], fila 0 a dalt. Les regles són a js/escacs/motor.js.
 * DEPENDÈNCIES: js/comu/comu.js, js/escacs/motor.js, js/camins/motor.js (la torre)
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const E = window.MotorEscacs;
    const G = window.MotorCamins;
    const Q = 60; // costat d'una casella
    const MARGE = 22; // per a les lletres i els números de les vores

    const nomCasella = (f, c, n) => 'abcdefgh'[c] + (n - f);

    // Les peces, dibuixades centrades a (0, 0) en una caixa de 44 × 44
    const REINA =
        'M-12 12 L-16 -9 L-9 1 L-8 -13 L-3 0 L0 -16 L3 0 L8 -13 L9 1 L16 -9 L12 12 Z';
    const CAVALL =
        'M11 16 L-12 16 Q-13 7 -4 1 Q-8 -1 -13 0 Q-18 -1 -16 -6 L-7 -14 Q-3 -18 1 -17 L3 -22 L6 -15 Q13 -10 13 0 Q13 9 11 16 Z';

    const ALFIL = 'M-10 11 Q-13 1 -7 -6 Q-3 -11 0 -14 Q3 -11 7 -6 Q13 1 10 11 Z';
    const PEO = 'M-11 12 Q-10 2 -5 -1 L5 -1 Q10 2 11 12 Z';
    /** Noms de les peces: [singular, plural]. */
    const NOMS = { reina: ['reina', 'reines'], cavall: ['cavall', 'cavalls'], alfil: ['alfil', 'alfils'], peo: ['peó', 'peons'] };
    const nomPeca = (tipus, k) => NOMS[tipus][k === 1 ? 0 : 1];
    const Majuscula = t => t.charAt(0).toUpperCase() + t.slice(1);

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
        } else if (tipus === 'alfil') {
            C.svg('path', { class: 'silueta', d: ALFIL }, g);
            C.svg('rect', { class: 'silueta', x: -13, y: 11, width: 26, height: 6, rx: 2 }, g);
            C.svg('circle', { class: 'silueta', cx: 0, cy: -17, r: 3 }, g);
            C.svg('path', { class: 'crinera', d: 'M3 -8 L-3 -1' }, g);
        } else if (tipus === 'peo') {
            C.svg('path', { class: 'silueta', d: PEO }, g);
            C.svg('rect', { class: 'silueta', x: -13, y: 11, width: 26, height: 6, rx: 2 }, g);
            C.svg('circle', { class: 'silueta', cx: 0, cy: -8, r: 7 }, g);
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
    /** Les dades d'una figura de reines (o de peons): «inicial» i «solucio» són columnes per fila (reines) o caselles. */
    const pecaReines = d => d.peca || 'reina';
    const casellesDe = (d, x) => (pecaReines(d) === 'reina' && !d.caselles ? E.aCaselles(x) : x.map(q => q.slice()));
    const ambAtacs = d => d.atacs !== false;

    function dibuixaLinies(T, peces, d) {
        T.linies.replaceChildren();
        if (d.lliures) {
            // AM 316: un punt a cada casella que no ataca cap reina
            T.marques.replaceChildren();
            const lliures = E.noAtacades(peces, T.n);
            lliures.forEach(q => {
                const [x, y] = centre(q);
                C.svg('circle', { class: 'no-atacada', cx: x, cy: y, r: 9 }, T.marques);
            });
            return { atacs: [], trios: [], lliures };
        }
        if (peces.length !== (d.nombre || T.n)) return { atacs: [], trios: [] };
        const atacs = ambAtacs(d) ? E.conflictes(peces) : [];
        atacs.forEach(([i, j]) => {
            const [x1, y1] = centre(peces[i]),
                [x2, y2] = centre(peces[j]);
            C.svg('line', { class: 'atac', x1, y1, x2, y2 }, T.linies);
        });
        // Els trios que no són ja un atac (en files, columnes o diagonals, ja surten com a atac)
        const trios = E.tresEnLinia(peces).filter(t => !ambAtacs(d) || !E.reinesAtaquen(peces[t[0]], peces[t[1]]));
        trios.forEach(t => {
            const punts = t.map(i => peces[i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
            const [x1, y1] = centre(punts[0]),
                [x2, y2] = centre(punts[2]);
            const dx = x2 - x1,
                dy = y2 - y1,
                l = Math.hypot(dx, dy);
            const k = 18 / l; // una mica més enllà de les dues peces dels extrems
            C.svg('line', { class: 'trio', x1: x1 - dx * k, y1: y1 - dy * k, x2: x2 + dx * k, y2: y2 + dy * k }, T.linies);
        });
        return { atacs, trios };
    }

    const esFixa = (d, q) => (d.fixes || []).some(r => r[0] === q[0] && r[1] === q[1]);

    function figuraReines(p, opcions = {}) {
        const d = p.dades;
        const n = d.mida;
        const tipus = pecaReines(d);
        const peces = opcions.solucio ? casellesDe(d, d.solucio) : d.inicial ? casellesDe(d, d.inicial) : (d.fixes || []).map(q => q.slice());
        const T = dibuixaTauler(n, {
            estatic: true,
            prefix: 'f' + (opcions.solucio ? 's' : 'i'),
            etiqueta: opcions.solucio
                ? 'La solució de Dudeney'
                : (d.etiquetaFigura || 'La figura de Dudeney, amb dos trios de reines en línia'),
        });
        peces.forEach(q => posaPeca(T.peces, tipus, q, esFixa(d, q) ? 'fixa' : null));
        if (!opcions.senseLinies) dibuixaLinies(T, peces, d);
        return T.svg;
    }

    function creaReines(lloc, p, ctx) {
        const d = p.dades;
        const n = d.mida;
        const tipus = pecaReines(d);
        const total = d.nombre || n;
        const [sing, plur] = NOMS[tipus];
        const una = tipus === 'reina' ? 'una' : 'un';
        let reines, triada, elsPeces;
        const caixa = C.el('div', { class: 'tauler escacs' });
        const T = dibuixaTauler(n, { prefix: 'joc' });
        caixa.appendChild(T.svg);
        lloc.appendChild(caixa);
        // AM 316: només es poden canviar de lloc d.mogudes reines (les altres es queden a la casella inicial)
        const originals = d.lliures ? casellesDe(d, d.inicial) : [];
        const esOriginal = q => originals.some(r => r[0] === q[0] && r[1] === q[1]);
        const mogudesSi = (i, q) => reines.filter((r, j) => !esOriginal(j === i ? q : r)).length;
        const avisMogudes = () =>
            ctx.missatge('error', `Només pots canviar de lloc ${d.mogudes} reines`, ['Mou una de les que ja has canviat, o torna una reina al seu lloc.']);
        const avisFixa = () =>
            ctx.missatge('info', `Aquest ${sing} no es mou`, [`L’enunciat el posa en aquesta casella. Mou els altres.`]);
        const kb = teclat(T, toca, (e, q) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                const i = index(q);
                if (i >= 0 && esFixa(d, q)) avisFixa();
                else if (i >= 0) {
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
                return i >= 0 && !esFixa(d, q) ? { i } : null;
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
                if (d.lliures) {
                    if (q && index(q) < 0) {
                        if (mogudesSi(c.i, q) > d.mogudes) avisMogudes();
                        else reines[c.i] = q;
                    }
                } else if (!q) reines.splice(c.i, 1);
                else if (index(q) < 0) reines[c.i] = q;
                kb.posa(q || reines[0] || [0, 0]);
                canvi();
            },
            cancela: () => pinta(),
        });

        const index = q => reines.findIndex(r => r[0] === q[0] && r[1] === q[1]);

        function inicia() {
            reines = d.inicial ? casellesDe(d, d.inicial) : (d.fixes || []).map(q => q.slice());
            triada = null;
            canvi();
        }
        function toca(q) {
            const i = index(q);
            if (i >= 0 && esFixa(d, q)) {
                triada = null;
                pinta();
                avisFixa();
                return;
            }
            if (triada !== null) {
                if (i === triada) {
                    if (!d.lliures) reines.splice(i, 1); // segon toc a la mateixa peça: es treu
                    triada = null;
                } else if (i >= 0) triada = i;
                else if (d.lliures && mogudesSi(triada, q) > d.mogudes) {
                    avisMogudes();
                    return;
                } else {
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
            if (d.lliures) {
                ctx.missatge('info', 'Toca primer una reina', ['Després toca la casella on la vols posar (pot ser qualsevol, no cal que hi arribi movent-se com als escacs).']);
            } else if (reines.length < total) {
                reines.push(q);
                canvi();
            } else {
                ctx.missatge('info', `Ja hi ha ${C.nombre(total)} ${plur}`, [
                    `Toca ${una} ${sing} per ${tipus === 'reina' ? 'moure-la' : 'moure’l'}, o ${tipus === 'reina' ? 'arrossega-la' : 'arrossega’l'}.`,
                ]);
            }
        }
        function pinta() {
            T.peces.replaceChildren();
            elsPeces = reines.map((q, i) =>
                posaPeca(T.peces, tipus, q, i === triada ? 'triada' : esFixa(d, q) ? 'fixa' : null)
            );
            T.svg.classList.toggle('amb-seleccio', triada !== null);
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => {
                    const hi = index([f, c]) >= 0;
                    g.setAttribute('aria-label', `${nomCasella(f, c, n)}${hi ? ', ' + sing + (esFixa(d, [f, c]) ? ' fix' : '') : ''}`);
                })
            );
            return dibuixaLinies(T, reines, d);
        }
        const recompte = k => [C.el('span', null, Majuscula(plur) + ': ', C.el('b', { text: `${k} de ${total}` }))];
        function canvi() {
            ctx.amaga();
            if (d.lliures) return canviLliures();
            const { atacs, trios } = pinta();
            ctx.estat(recompte(reines.length));
            if (reines.length !== total) return;
            if (!atacs.length && !trios.length) {
                ctx.resolt('Ho has aconseguit!', [
                    ambAtacs(d)
                        ? 'Cap reina no n’ataca cap altra, i no n’hi ha tres en línia en cap direcció.'
                        : `No hi ha tres ${plur} en línia recta en cap direcció.`,
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
                        ? `Hi ha tres ${plur} en línia recta (la línia de punts).`
                        : `Hi ha ${trios.length} trios de ${plur} en línia recta (les línies de punts).`
                );
            ctx.missatge(atacs.length ? 'error' : 'info', 'Encara no', frases);
        }
        function canviLliures() {
            const { lliures } = pinta();
            const mogudes = reines.filter(r => !esOriginal(r)).length;
            ctx.estat([
                C.el('span', null, 'Reines canviades de lloc: ', C.el('b', { text: `${mogudes} de ${d.mogudes}` })),
                C.el('span', null, 'Caselles sense atacar: ', C.el('b', { text: lliures.length })),
            ]);
            if (mogudes < d.mogudes) return;
            if (lliures.length >= d.lliures)
                ctx.resolt(`${lliures.length} caselles sense atacar!`, [`Amb només ${d.mogudes} reines canviades de lloc. És l’única manera de fer-ho.`]);
            else
                ctx.missatge('info', `${C.plural(lliures.length, 'casella', 'caselles')} sense atacar`, [`Amb ${d.mogudes} reines canviades de lloc se’n poden deixar ${d.lliures}. Prova de moure’n unes altres.`]);
        }
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Posa-la al tauler',
            solucio() {
                reines = casellesDe(d, d.solucio);
                triada = null;
                ctx.amaga();
                if (d.lliures) {
                    canviLliures();
                    ctx.amaga();
                    ctx.missatge('info', 'La solució de Dudeney', [d.resumSolucio]);
                    return;
                }
                pinta();
                ctx.estat(recompte(total));
                ctx.missatge('info', 'La solució de Dudeney', [
                    ambAtacs(d) ? 'Cap atac i cap trio en línia.' : `Cap trio de ${plur} en línia.`,
                ]);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // CAVALLS
    // ════════════════════════════════════════════════════════════
    const pecaCobrir = d => d.peca || 'cavall';
    const ambProteccio = d => d.protegits !== false;

    function pintaCavalls(T, cavalls, tipus, opcions = {}) {
        const est = E.estatPeces(cavalls, T.n, tipus);
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
            posaPeca(T.peces, tipus, q);
        });
        return est;
    }

    function figuraCavalls(p, opcions = {}) {
        const d = p.dades;
        // Sense exemple de Dudeney (els alfils), la vinyeta és una peça sola amb les caselles que ataca
        const vinyeta = opcions.cavalls === 'exemple' && !d.exemple;
        const llista = vinyeta ? d.vinyeta || [] : opcions.cavalls === 'exemple' ? d.exemple : opcions.cavalls === 'buit' ? [] : d.solucio;
        const et = d.etiquetes || {
            exemple: 'Els 12 cavalls de Dudeney: només 4 estan protegits',
            solucio: 'Una de les tres solucions de 14 cavalls',
        };
        const T = dibuixaTauler(d.mida, {
            estatic: true,
            prefix: 'fc' + (opcions.cavalls || 's'),
            etiqueta: vinyeta
                ? et.vinyeta || 'Un tauler d’escacs'
                : opcions.cavalls === 'exemple'
                  ? et.exemple
                  : opcions.cavalls === 'buit'
                    ? 'Tauler d’escacs buit'
                    : et.solucio,
        });
        pintaCavalls(T, llista, pecaCobrir(d), { punts: vinyeta, protegits: opcions.cavalls === 'exemple' && !vinyeta });
        return T.svg;
    }

    function creaCavalls(lloc, p, ctx) {
        const d = p.dades;
        const n = d.mida;
        const tipus = pecaCobrir(d);
        const [sing, plur] = NOMS[tipus];
        let cavalls;
        const hist = C.historial(x => x.map(q => q.slice()));
        const caixa = C.el('div', { class: 'tauler escacs' });
        const T = dibuixaTauler(n, { prefix: 'joc' });
        caixa.appendChild(T.svg);
        if (d.exemple) {
            const exemple = C.el('button', { type: 'button', class: 'btn-sec', text: d.textExemple || 'Comença amb els 12 cavalls de Dudeney' });
            caixa.appendChild(C.el('div', { class: 'eines-tauler' }, exemple));
            exemple.addEventListener('click', () => {
                hist.desa(cavalls);
                cavalls = d.exemple.map(q => q.slice());
                canvi();
            });
        }
        lloc.appendChild(caixa);
        teclat(T, toca);
        T.svg.addEventListener('click', e => {
            const q = casellaDe(T, e, false);
            if (q) toca(q);
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
            const est0 = E.estatPeces(cavalls, n, tipus);
            const complet = cavalls.length > 0 && est0.lliures.length === 0;
            const est = pintaCavalls(T, cavalls, tipus, { marcaSense: complet && ambProteccio(d) });
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => {
                    const k = f + ',' + c;
                    const hi = index([f, c]) >= 0;
                    g.setAttribute(
                        'aria-label',
                        `${nomCasella(f, c, n)}${hi ? ', ' + sing : est.atacat[k] ? ', atacada' : ', lliure'}`
                    );
                })
            );
            ctx.estat([
                C.el('span', null, Majuscula(plur) + ': ', C.el('b', { text: cavalls.length })),
                C.el('span', null, 'Caselles lliures: ', C.el('b', { text: est.lliures.length })),
            ]);
            ctx.desfes(hist.mida > 0);
            if (!complet) return;
            if (ambProteccio(d) && est.sensePro.length) {
                ctx.missatge('error', 'Totes les caselles estan cobertes, però…', [
                    est.sensePro.length === 1
                        ? `Hi ha un ${sing} que no està protegit per cap altre (el del cercle de punts).`
                        : `Hi ha ${est.sensePro.length} ${plur} que no estan protegits per cap altre (els dels cercles de punts).`,
                ]);
                return;
            }
            const frase = ambProteccio(d)
                ? `Totes les caselles ocupades o atacades, i cada ${sing} protegit per un altre.`
                : 'Totes les caselles ocupades o atacades.';
            if (cavalls.length === d.minim) ctx.resolt(`${cavalls.length} ${plur}: el mínim!`, [frase]);
            else
                ctx.missatge('info', `Fet amb ${cavalls.length} ${plur}`, [
                    frase.replace(/\.$/, '') + `. Es pot fer amb menys ${plur}!`,
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
                ctx.missatge('info', d.titolSolucio || 'Una solució de Dudeney', [d.resumSolucio || '14 cavalls: set a cada color.']);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // TORRE: la volta de la torre (AM 320)
    // dades: mida, inici ('d5'), minim, solucio i altra (les caselles on s'atura la torre, en notació
    // algebraica). Les regles són a js/camins/motor.js (passosTorre, motiuTorre).
    // ════════════════════════════════════════════════════════════
    const TORRE = 'M-12 12 L-10 -6 L-14 -6 L-14 -16 L-8 -16 L-8 -11 L-3 -11 L-3 -16 L3 -16 L3 -11 L8 -11 L8 -16 L14 -16 L14 -6 L10 -6 L12 12 Z';
    const deAlg = (t, n) => [n - +t.slice(1), 'abcdefgh'.indexOf(t[0])];

    function pecaTorre(capa, q) {
        const g = C.svg('g', { class: 'peca torre' }, capa);
        C.svg('path', { class: 'silueta', d: TORRE }, g);
        C.svg('rect', { class: 'silueta', x: -15, y: 11, width: 30, height: 6, rx: 2 }, g);
        const [x, y] = centre(q);
        g.style.transform = `translate(${x}px, ${y}px)`;
        return g;
    }
    /** Pinta el recorregut: les caselles visitades (un punt), el traç i la torre. */
    function pintaTorre(T, parades, opcions = {}) {
        T.marques.replaceChildren();
        T.linies.replaceChildren();
        T.peces.replaceChildren();
        const n = T.n;
        const vist = [];
        for (let f = 0; f < n; f++) vist.push(new Array(n).fill(false));
        if (parades.length) vist[parades[0][0]][parades[0][1]] = true;
        for (let i = 1; i < parades.length; i++) G.passosTorre(parades[i - 1], parades[i]).forEach(q => (vist[q[0]][q[1]] = true));
        for (let f = 0; f < n; f++)
            for (let c = 0; c < n; c++)
                if (vist[f][c]) C.svg('rect', { class: 'visitada', x: c * Q + 4, y: f * Q + 4, width: Q - 8, height: Q - 8, rx: 4 }, T.marques);
        if (parades.length > 1) C.svg('polyline', { class: 'cami-torre', points: parades.map(q => centre(q).join(',')).join(' ') }, T.linies);
        parades.slice(1, -1).forEach(q => {
            const [x, y] = centre(q);
            C.svg('circle', { class: 'parada', cx: x, cy: y, r: 5 }, T.linies);
        });
        if (parades.length && !opcions.senseTorre) pecaTorre(T.peces, opcions.torreA || parades[parades.length - 1]);
        return vist;
    }

    function figuraTorre(p, opcions = {}) {
        const d = p.dades;
        const T = dibuixaTauler(d.mida, { estatic: true, prefix: 'ft' + (opcions.altra ? 'b' : 'a'), etiqueta: opcions.etiqueta || `Un tauler d’escacs amb la torre a ${d.inici}` });
        const llista = opcions.solucio ? d.solucio : opcions.altra ? d.altra : [d.inici];
        pintaTorre(T, llista.map(t => deAlg(t, d.mida)), { torreA: deAlg(d.inici, d.mida) });
        return T.svg;
    }

    function creaTorre(lloc, p, ctx) {
        const d = p.dades;
        const n = d.mida;
        const inici = deAlg(d.inici, n);
        let parades, vist, acabat, reproduccio;
        const hist = C.historial(x => x.map(q => q.slice()));
        const caixa = C.el('div', { class: 'tauler escacs torre-joc' });
        const T = dibuixaTauler(n, { prefix: 'jt' });
        const textRuta = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
        caixa.append(T.svg, textRuta);
        lloc.appendChild(caixa);
        const teclatT = teclat(T, q => toca(q));
        T.svg.addEventListener('click', e => {
            const q = casellaDe(T, e, false);
            if (q) toca(q);
        });
        const nom = q => nomCasella(q[0], q[1], n);
        const darrera = () => parades[parades.length - 1];

        function inicia() {
            atura();
            parades = [inici];
            acabat = false;
            hist.buida();
            teclatT.posa(inici);
            canvi(true);
        }
        function toca(q) {
            atura();
            const de = darrera();
            if (q[0] === de[0] && q[1] === de[1]) {
                if (!acabat && parades.length > 1) desfes();
                return;
            }
            if (acabat) return;
            const motiu = G.motiuTorre(vist, de, q, inici);
            if (motiu) {
                if (motiu.motiu === 'linia')
                    ctx.missatge('error', `De ${nom(de)} a ${nom(q)} no hi pot anar`, ['La torre només es mou en línia recta: per la seva fila o per la seva columna.']);
                else if (motiu.motiu === 'repetida')
                    ctx.missatge('error', 'Per aquí ja hi has passat', [`La torre passaria un altre cop per ${nom(motiu.casella)}: cada casella només es pot visitar una vegada.`]);
                else if (motiu.motiu === 'aviat')
                    ctx.missatge('error', `Encara no pots tornar a ${d.inici}`, ['Primer has de visitar totes les caselles: la torre torna a la casella de sortida amb l’última jugada.']);
                return;
            }
            hist.desa(parades);
            parades = parades.concat([q]);
            canvi();
        }
        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            parades = ant;
            acabat = false;
            canvi(true);
        }
        function canvi(silenci) {
            ctx.amaga();
            vist = pintaTorre(T, parades);
            let fetes = 0;
            T.caselles.forEach((fila, f) =>
                fila.forEach((g, c) => {
                    if (vist[f][c]) fetes++;
                    g.setAttribute('aria-label', `${nomCasella(f, c, n)}${vist[f][c] ? ', visitada' : ''}${f === darrera()[0] && c === darrera()[1] ? ', hi ha la torre' : ''}`);
                })
            );
            const jugades = parades.length - 1;
            ctx.estat([
                C.el('span', null, 'Jugades: ', C.el('b', { text: jugades })),
                C.el('span', null, 'Caselles visitades: ', C.el('b', { text: `${fetes} de ${n * n}` })),
            ]);
            textRuta.textContent = jugades ? 'Recorregut: ' + parades.map(nom).join(' – ') : `La torre és a ${d.inici}: toca una casella de la seva fila o de la seva columna.`;
            ctx.desfes(hist.mida > 0);
            if (silenci) return;
            const tornada = jugades > 0 && darrera()[0] === inici[0] && darrera()[1] === inici[1];
            if (tornada) {
                acabat = true;
                if (jugades <= d.minim) ctx.resolt(`${jugades} jugades: el mínim!`, [`Les ${n * n} caselles, cada una una sola vegada, i de tornada a ${d.inici}.`]);
                else ctx.missatge('info', `Volta completa en ${jugades} jugades`, [`Es pot fer en ${d.minim}. Ho tornes a provar?`]);
                return;
            }
            // Queda alguna jugada possible?
            const pot = [];
            for (let k = 0; k < n; k++) pot.push([darrera()[0], k], [k, darrera()[1]]);
            if (!pot.some(q => !G.motiuTorre(vist, darrera(), q, inici)))
                ctx.missatge('info', 'Per aquí no hi ha sortida', ['La torre ja no pot anar enlloc sense repetir caselles. Fes enrere i prova un altre camí.']);
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }
        inicia();
        return {
            reinicia: inicia,
            desfes,
            textSolucio: `▶ Mira-la al tauler (${d.minim} jugades)`,
            solucio() {
                inicia();
                reproduccio = C.reprodueix(
                    d.solucio.slice(1).map(t => deAlg(t, n)),
                    q => {
                        hist.desa(parades);
                        parades = parades.concat([q]);
                        canvi(true);
                    },
                    C.movimentReduit() ? 260 : 560,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', [d.resumSolucio])
                );
                return reproduccio;
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
    window.Taulers.torre = {
        crea: creaTorre,
        figura: figuraTorre,
        // Les dues solucions mínimes de Dudeney, una al costat de l'altra
        figuraSolucio: p => {
            const fila = C.el('div', { class: 'fila-diagrames' });
            [
                [{ solucio: true }, 'La primera solució de Dudeney'],
                [{ altra: true }, 'La segona solució de Dudeney'],
            ].forEach(([o, peu]) => {
                const svg = figuraTorre(p, Object.assign({ etiqueta: peu }, o));
                svg.classList.add('figura-estatica');
                fila.appendChild(C.el('div', { class: 'diagrama' }, svg, C.el('span', { class: 'peu-diagrama', text: peu })));
            });
            return C.el('figure', null, fila);
        },
    };
})();
