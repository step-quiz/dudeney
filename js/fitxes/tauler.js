/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/fitxes/tauler.js
 * ROL: Els taulers dels enigmes de fitxes:
 *   - Taulers.piles: els formatges i els quatre tamborets (CP 1). Es toca un
 *     tamboret per agafar el formatge de dalt i un altre per deixar-l'hi, o
 *     s'arrossega; amb el teclat, 1…4. Compta els moviments i, en acabar,
 *     diu si és el mínim (Frame–Stewart); després es pot provar amb 10.
 *   - Taulers.salts: les granotes en una filera (AM 214). Es toca la granota
 *     (salta sola) o s'arrossega fins a la casella buida; amb el teclat, el
 *     número de la granota. En acabar es pot afegir una granota més.
 *   - Taulers.cercle: fitxes en cercle de dos colors, cadascun en un sentit
 *     (AM 217); es toca la fitxa o es prem la seva lletra.
 *   - Taulers.blocs: blocs amb lletres que llisquen dins una capsa (AM 219).
 *   - Taulers.xarxa: granotes sobre bolets units per línies (AM 341); compta
 *     moviments i jugades, i «Desembolica els fils» redibuixa el mapa com un
 *     cercle (els «botons i fils» de Dudeney).
 *   Tots tenen «Desfés» i la solució de Dudeney pas a pas.
 * ARQUITECTURA: window.Taulers.piles / .salts / .cercle / .blocs / .xarxa =
 *   { crea(lloc, p, ctx), figura(p) }.
 *   L'estat i les regles són al motor (js/fitxes/motor.js); aquí només hi ha
 *   el dibuix (SVG), els esdeveniments i els missatges.
 * DEPENDÈNCIES: js/comu/comu.js, js/fitxes/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const M = window.MotorFitxes;

    // ════════════════════════════════════════════════════════════
    // PILES: formatges i tamborets
    // ════════════════════════════════════════════════════════════
    const COL = 160;

    function geometriaPiles(n, k) {
        const hc = n <= 8 ? 18 : 15;
        const dalt = 46; // on va el formatge agafat
        const seient = dalt + 26 + n * hc + 8;
        return {
            n,
            k,
            hc,
            dalt,
            seient,
            W: k * COL,
            H: seient + 74,
            cx: t => COL / 2 + t * COL,
            amplada: m => 46 + ((m - 1) * 94) / Math.max(1, n - 1),
        };
    }

    /** Dibuixa els tamborets i els formatges; posa(estat, agafat) els col·loca. */
    function dibuixaPiles(n, k, opcions = {}) {
        const G = geometriaPiles(n, k);
        const s = C.svg('svg', {
            'class': 'tauler-svg piles-svg',
            'viewBox': `0 0 ${G.W} ${G.H}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || `${n} formatges i ${k} tamborets`,
        });
        const tamborets = [];
        for (let t = 0; t < k; t++) {
            const g = C.svg('g', { 'class': 'tamboret', 'data-t': t }, s);
            const cx = G.cx(t);
            C.svg('rect', { class: 'zona', x: t * COL, y: 0, width: COL, height: G.H }, g);
            C.svg('rect', { class: 'ombra-terra', x: cx - 66, y: G.H - 10, width: 132, height: 4, rx: 2 }, g);
            C.svg(
                'path',
                {
                    class: 'potes',
                    d:
                        `M${cx - 52} ${G.seient + 12} L${cx - 62} ${G.H - 8} M${cx + 52} ${G.seient + 12} L${cx + 62} ${G.H - 8}` +
                        ` M${cx - 4} ${G.seient + 12} L${cx - 4} ${G.H - 8} M${cx - 56} ${G.seient + 44} L${cx + 56} ${G.seient + 44}`,
                },
                g
            );
            C.svg('rect', { class: 'seient', x: cx - 72, y: G.seient, width: 144, height: 13, rx: 5 }, g);
            C.svg('text', { 'class': 'num-tamboret', 'x': cx + 26, 'y': G.seient + 36, 'text': t + 1 }, g);
            tamborets.push(g);
        }
        const capa = C.svg('g', { class: 'formatges' }, s);
        const formatges = [];
        for (let m = 1; m <= n; m++) {
            const w = G.amplada(m);
            const g = C.svg('g', { 'class': 'formatge', 'data-m': m }, capa);
            C.svg('rect', { class: 'cos', x: -w / 2, y: 0, width: w, height: G.hc - 1, rx: (G.hc - 1) * 0.42 }, g);
            C.svg('path', { class: 'brillo', d: `M${-w / 2 + 8} 4 H${w / 2 - 8}` }, g);
            C.svg('text', { 'class': 'num-formatge', 'x': 0, 'y': G.hc / 2 + 0.5, 'text': m }, g);
            formatges[m] = g;
        }
        function posa(estat, agafat) {
            estat.forEach((pila, t) =>
                pila.forEach((m, i) => {
                    let y = G.seient - (i + 1) * G.hc;
                    const amunt = agafat === t && i === pila.length - 1;
                    if (amunt) y = G.dalt;
                    formatges[m].style.transform = `translate(${G.cx(t)}px, ${y}px)`;
                    formatges[m].classList.toggle('agafat', amunt);
                })
            );
        }
        return { svg: s, G, tamborets, formatges, posa };
    }

    function figuraPiles(p, opcions = {}) {
        const d = p.dades;
        const n = opcions.n || d.formatges;
        const D = dibuixaPiles(n, d.tamborets, { estatic: true, etiqueta: `${n} formatges al tamboret 1` });
        D.posa(M.piles.inicial(n, d.tamborets, d.origen), null);
        return D.svg;
    }

    function creaPiles(lloc, p, ctx) {
        const d = p.dades;
        let n = d.formatges;
        let estat, moviments, agafat, D, reproduccio;
        const hist = C.historial(x => ({ estat: x.estat.map(q => q.slice()), moviments: x.moviments }));
        const caixa = C.el('div', { class: 'tauler piles' });
        lloc.appendChild(caixa);

        function munta() {
            D = dibuixaPiles(n, d.tamborets);
            caixa.replaceChildren(D.svg);
            D.tamborets.forEach((g, t) => {
                g.setAttribute('tabindex', '0');
                g.setAttribute('role', 'button');
                g.addEventListener('click', () => {
                    if (!C.acabaDeArrossegar()) toca(t);
                });
            });
            // Arrossegar el formatge de dalt d'un tamboret
            C.arrossega(D.svg, {
                inici: e => {
                    const g = e.target.closest('.tamboret');
                    if (!g) return null;
                    const t = +g.dataset.t;
                    if (!estat[t].length) return null;
                    atura();
                    return { t, m: estat[t][estat[t].length - 1] };
                },
                comenca: c => {
                    agafat = null;
                    ctx.amaga();
                    D.formatges[c.m].classList.add('arrossegat');
                },
                mou: (c, e) => {
                    const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                    D.formatges[c.m].style.transform = `translate(${q.x}px, ${q.y - D.G.hc / 2}px)`;
                },
                deixa: (c, e) => {
                    D.formatges[c.m].classList.remove('arrossegat');
                    const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                    const t = Math.max(0, Math.min(d.tamborets - 1, Math.floor(q.x / COL)));
                    if (t === c.t) pinta();
                    else prova(c.t, t);
                },
                cancela: c => {
                    D.formatges[c.m].classList.remove('arrossegat');
                    pinta();
                },
            });
            caixa.addEventListener('keydown', tecla);
        }

        function inicia(nou) {
            atura();
            n = nou;
            estat = M.piles.inicial(n, d.tamborets, d.origen);
            moviments = 0;
            agafat = null;
            hist.buida();
            munta();
            pinta();
        }

        function pinta() {
            D.posa(estat, agafat);
            D.tamborets.forEach((g, t) => {
                const pila = estat[t];
                const dalt = pila.length ? `el de dalt és el ${pila[pila.length - 1]}` : 'buit';
                g.setAttribute(
                    'aria-label',
                    `Tamboret ${t + 1}: ${pila.length ? C.plural(pila.length, 'formatge') + ', ' + dalt : 'buit'}`
                );
                g.classList.toggle('desti-possible', agafat !== null && t !== agafat);
            });
            D.svg.classList.toggle('amb-seleccio', agafat !== null);
            ctx.estat([
                C.el('span', null, 'Moviments: ', C.el('b', { text: moviments })),
                n !== d.formatges ? C.el('span', { text: `amb ${n} formatges` }) : null,
            ]);
            ctx.desfes(hist.mida > 0);
        }

        function toca(t) {
            atura();
            if (agafat === null) {
                if (!estat[t].length) {
                    C.anima(D.tamborets[t], 'sacseja');
                    return;
                }
                ctx.amaga();
                agafat = t;
                pinta();
                return;
            }
            if (t === agafat) {
                agafat = null;
                pinta();
                return;
            }
            const de = agafat;
            agafat = null;
            prova(de, t);
        }

        function prova(de, a) {
            const motiu = M.piles.motiu(estat, de, a);
            if (motiu === 'petit') {
                const x = estat[de][estat[de].length - 1],
                    y = estat[a][estat[a].length - 1];
                ctx.missatge('error', 'Aquí no hi pot anar', [
                    `El formatge ${x} és més gran que el ${y}: no el pots posar a sobre.`,
                ]);
                C.anima(D.tamborets[a], 'sacseja');
                pinta();
                return;
            }
            if (motiu) {
                pinta();
                return;
            }
            hist.desa({ estat, moviments });
            estat = M.piles.mou(estat, de, a);
            moviments++;
            ctx.amaga();
            pinta();
            revisa();
        }

        function revisa() {
            if (!M.piles.resolt(estat, d.desti)) return;
            const minim = M.frameStewart(n, d.tamborets);
            if (moviments === minim) {
                const extra =
                    n < d.extra
                        ? C.el('button', {
                              type: 'button',
                              class: 'btn-sec boto-extra',
                              text: `I amb ${d.extra} formatges?`,
                              onclick: () => {
                                  ctx.amaga();
                                  inicia(d.extra);
                              },
                          })
                        : null;
                ctx.resolt(
                    `${moviments} moviments: el mínim!`,
                    n === d.formatges
                        ? ['Ho has fet com l’administrador.']
                        : [`Amb ${n} formatges, Dudeney també en compta ${minim}.`],
                    extra
                );
            } else {
                ctx.missatge('info', `Fet en ${moviments} moviments`, [
                    `Es pot fer en ${minim}. Ho tornes a provar?`,
                ]);
            }
        }

        function tecla(e) {
            if (e.key >= '1' && e.key <= String(d.tamborets)) {
                e.preventDefault();
                toca(+e.key - 1);
                D.tamborets[+e.key - 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.tamboret');
                if (g) {
                    e.preventDefault();
                    toca(+g.dataset.t);
                }
            } else if (e.key === 'Escape' && agafat !== null) {
                agafat = null;
                pinta();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const g = e.target.closest && e.target.closest('.tamboret');
                if (!g) return;
                const t = (+g.dataset.t + (e.key === 'ArrowLeft' ? -1 : 1) + d.tamborets) % d.tamborets;
                D.tamborets[t].focus();
                e.preventDefault();
            }
        }

        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            estat = ant.estat;
            moviments = ant.moviments;
            agafat = null;
            ctx.amaga();
            pinta();
        }

        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }

        inicia(n);
        return {
            reinicia: () => inicia(d.formatges),
            desfes,
            textSolucio: '▶ Mira-la al tauler (8 formatges, 33 moviments)',
            solucio() {
                inicia(d.formatges);
                const passos = M.solucioPiles(n, d.origen, d.desti, [1, 2]);
                reproduccio = C.reprodueix(
                    passos,
                    ([de, a]) => {
                        estat = M.piles.mou(estat, de, a);
                        moviments++;
                        pinta();
                    },
                    C.movimentReduit() ? 250 : 480,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', ['33 moviments: 13 + 7 + 13.'])
                );
                return reproduccio;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // SALTS: les granotes (AM 214: numerades, salten per sobre d'una;
    // AM 216: blanques i negres sobre gots, salten per sobre de fins a dues)
    // Opcions de dades: granotes (n), salt (quantes fitxes es poden saltar, 1 per defecte),
    // inicial i objectiu (vectors amb 0 = forat; si hi ha colors, l'objectiu és de colors),
    // colors ({ granota: 'blanca' | 'negra' }), minim, solucio ([[de, a], …] amb caselles 1…).
    // ════════════════════════════════════════════════════════════
    const CEL = 92;

    /** Una granota vista des de dalt, amb el número a l'esquena (o sense, si és de color). */
    function granota(num, pare, color) {
        const g = C.svg('g', { 'class': 'granota' + (color ? ' ' + color : ''), 'data-g': num }, pare);
        const salt = C.svg('g', { class: 'salt' }, g);
        C.svg(
            'path',
            {
                class: 'potes',
                d: 'M-20 14 Q-34 18 -32 30 Q-24 26 -18 24 M20 14 Q34 18 32 30 Q24 26 18 24 M-16 -10 Q-28 -14 -27 -22 M16 -10 Q28 -14 27 -22',
            },
            salt
        );
        C.svg('ellipse', { class: 'cos', cx: 0, cy: 4, rx: 22, ry: 25 }, salt);
        C.svg('circle', { class: 'ull', cx: -10, cy: -18, r: 7 }, salt);
        C.svg('circle', { class: 'ull', cx: 10, cy: -18, r: 7 }, salt);
        C.svg('circle', { class: 'nina', cx: -10, cy: -19, r: 3 }, salt);
        C.svg('circle', { class: 'nina', cx: 10, cy: -19, r: 3 }, salt);
        if (!color) C.svg('text', { 'class': 'num-granota', 'x': 0, 'y': 8, 'text': num }, salt);
        return g;
    }

    function dibuixaSalts(d, n, opcions = {}) {
        const W = (n + 1) * CEL,
            H = CEL + (d.colors ? 34 : 12);
        const s = C.svg('svg', {
            'class': 'tauler-svg salts-svg',
            'viewBox': `0 0 ${W} ${H}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || `${n} granotes en una filera de ${n + 1} caselles`,
        });
        const caselles = [];
        for (let i = 0; i <= n; i++) {
            const g = C.svg('g', { 'class': 'casella', 'data-i': i }, s);
            if (d.colors) {
                // un got de vidre cap per avall, amb el seu número a sota
                C.svg('path', { class: 'got', d: `M${i * CEL + 14} ${CEL - 2} L${i * CEL + 20} 14 H${i * CEL + CEL - 20} L${i * CEL + CEL - 14} ${CEL - 2} Z` }, g);
                C.svg('text', { 'class': 'num-got', 'x': i * CEL + CEL / 2, 'y': CEL + 24, 'text': i + 1 }, g);
            } else C.svg('rect', { class: i % 2 ? 'fons fosc' : 'fons', x: i * CEL + 3, y: 6, width: CEL - 6, height: CEL - 6, rx: 8 }, g);
            caselles.push(g);
        }
        const capa = C.svg('g', { class: 'granotes' }, s);
        const granotes = [];
        for (let k = 1; k <= n; k++) granotes[k] = granota(k, capa, d.colors && d.colors[k]);
        function posa(estat) {
            estat.forEach((k, i) => {
                if (k) granotes[k].style.transform = `translate(${i * CEL + CEL / 2}px, ${CEL / 2 + (d.colors ? -2 : 6)}px)`;
            });
        }
        return { svg: s, caselles, granotes, posa, W, H };
    }

    const inicialSalts = (d, n) => (d.inicial && n === d.granotes ? d.inicial.slice() : [0].concat(Array.from({ length: n }, (_, i) => i + 1)));
    const objectiuSalts = n => [0].concat(Array.from({ length: n }, (_, i) => n - i));
    /** Ja s'ha arribat a l'objectiu? (Amb colors, només compten els colors.) */
    function arribat(d, estat, n) {
        if (d.colors) return estat.map(k => (k ? d.colors[k][0] : '_')).join('') === d.objectiu;
        return M.salts.resolt(estat, objectiuSalts(n));
    }
    const minimSalts = (d, n) => (d.minim && n === d.granotes ? d.minim : M.granotesDudeney(n));

    function figuraSalts(p, opcions = {}) {
        const d = p.dades;
        const n = opcions.n || d.granotes;
        const D = dibuixaSalts(d, n, { estatic: true, etiqueta: d.etiqueta || `Les granotes 1 a ${n}, amb la casella buida a l’esquerra` });
        D.posa(opcions.estat || inicialSalts(d, n));
        return D.svg;
    }

    function creaSalts(lloc, p, ctx) {
        const d = p.dades;
        let n = d.granotes;
        let estat, moviments, salts, D, reproduccio;
        const hist = C.historial(x => ({ estat: x.estat.slice(), moviments: x.moviments, salts: x.salts }));
        const caixa = C.el('div', { class: 'tauler salts' });
        lloc.appendChild(caixa);
        const nomGranota = k => (d.colors ? `La granota ${d.colors[k]} del got ${estat.indexOf(k) + 1}` : `La granota ${k}`);

        function munta() {
            D = dibuixaSalts(d, n);
            caixa.replaceChildren(D.svg);
            for (let k = 1; k <= n; k++) {
                const g = D.granotes[k];
                g.setAttribute('tabindex', '0');
                g.setAttribute('role', 'button');
                g.addEventListener('click', () => {
                    if (!C.acabaDeArrossegar()) toca(k);
                });
            }
            C.arrossega(D.svg, {
                inici: e => {
                    const g = e.target.closest('.granota');
                    if (!g) return null;
                    atura();
                    return { k: +g.dataset.g };
                },
                comenca: c => D.granotes[c.k].classList.add('arrossegada'),
                mou: (c, e) => {
                    const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                    D.granotes[c.k].style.transform = `translate(${q.x}px, ${q.y}px)`;
                },
                deixa: (c, e) => {
                    D.granotes[c.k].classList.remove('arrossegada');
                    const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                    const i = Math.floor(q.x / CEL);
                    if (i === estat.indexOf(0)) toca(c.k);
                    else pinta();
                },
                cancela: c => {
                    D.granotes[c.k].classList.remove('arrossegada');
                    pinta();
                },
            });
            caixa.addEventListener('keydown', tecla);
        }

        function inicia(nou) {
            atura();
            n = nou;
            estat = inicialSalts(d, n);
            moviments = 0;
            salts = 0;
            hist.buida();
            munta();
            pinta();
        }

        function pinta() {
            D.posa(estat);
            for (let k = 1; k <= n; k++) {
                const i = estat.indexOf(k);
                const pot = M.salts.desti(estat, i, d.salt) >= 0;
                D.granotes[k].classList.toggle('pot', pot);
                D.granotes[k].setAttribute(
                    'aria-label',
                    `${d.colors ? 'Granota ' + d.colors[k] : 'Granota ' + k}, a la casella ${i + 1}${pot ? ', es pot moure' : ''}`
                );
            }
            ctx.estat([
                C.el('span', null, 'Moviments: ', C.el('b', { text: moviments })),
                C.el('span', { text: `${C.plural(salts, 'salt')} i ${C.plural(moviments - salts, 'pas', 'passos')}` }),
            ]);
            ctx.desfes(hist.mida > 0);
        }

        function toca(k) {
            atura();
            const i = estat.indexOf(k);
            const f = M.salts.desti(estat, i, d.salt);
            if (f < 0) {
                ctx.missatge('error', `${nomGranota(k)} no es pot moure`, [
                    d.salt === 2
                        ? 'Només pot anar al got buit si és al costat o si entre mig hi ha una o dues granotes.'
                        : 'Només pot anar a la casella buida si és al costat o just després d’una altra granota.',
                ]);
                C.anima(D.granotes[k].querySelector('.salt'), 'sacseja');
                return;
            }
            hist.desa({ estat, moviments, salts });
            const esSalt = M.salts.esSalt(estat, i);
            estat = M.salts.mou(estat, i, d.salt);
            moviments++;
            if (esSalt) salts++;
            ctx.amaga();
            C.anima(D.granotes[k].querySelector('.salt'), esSalt ? 'saltant' : 'passant');
            pinta();
            revisa();
        }

        function revisa() {
            if (!arribat(d, estat, n)) return;
            const minim = minimSalts(d, n);
            if (moviments === minim) {
                const extra =
                    d.maxim && n < d.maxim
                        ? C.el('button', {
                              type: 'button',
                              class: 'btn-sec boto-extra',
                              text: n === 6 ? 'Afegeix-hi una setena granota' : 'Afegeix-hi una granota més',
                              onclick: () => {
                                  ctx.amaga();
                                  inicia(n + 1);
                              },
                          })
                        : null;
                ctx.resolt(
                    `${moviments} moviments: el mínim!`,
                    [`${C.plural(salts, 'salt')} i ${C.plural(moviments - salts, 'pas', 'passos')}.`],
                    extra
                );
            } else {
                ctx.missatge('info', `Fet en ${moviments} moviments`, [`Es pot fer en ${minim}. Ho tornes a provar?`]);
            }
        }

        function tecla(e) {
            if (/^[1-9]$/.test(e.key) && +e.key <= (d.colors ? n + 1 : n)) {
                e.preventDefault();
                // amb colors, la tecla és el número del got; si no, el de la granota
                const k = d.colors ? estat[+e.key - 1] : +e.key;
                if (k) toca(k);
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.granota');
                if (g) {
                    e.preventDefault();
                    toca(+g.dataset.g);
                }
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        }

        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, moviments, salts } = ant);
            ctx.amaga();
            pinta();
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }

        inicia(n);
        return {
            reinicia: () => inicia(d.granotes),
            desfes,
            textSolucio: `▶ Mira-la al tauler (${minimSalts(d, d.granotes)} moviments)`,
            solucio() {
                inicia(d.granotes);
                // la solució: o bé caselles [de, a] (1…), o bé la seqüència de granotes de Dudeney
                const passos = d.solucio ? d.solucio.map(([a]) => a - 1) : M.sequenciaGranotes(n).map(k => -k);
                reproduccio = C.reprodueix(
                    passos,
                    x => {
                        const i = x >= 0 ? x : estat.indexOf(-x);
                        const k = estat[i];
                        const esSalt = M.salts.esSalt(estat, i);
                        estat = M.salts.mou(estat, i, d.salt);
                        moviments++;
                        if (esSalt) salts++;
                        C.anima(D.granotes[k].querySelector('.salt'), esSalt ? 'saltant' : 'passant');
                        pinta();
                    },
                    C.movimentReduit() ? 300 : 620,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', [d.resumSolucio || '2, 4, 6, 5, 3, 1 tres vegades, i 2, 4, 6: 15 salts i 6 passos.'])
                );
                return reproduccio;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // CERCLE: fitxes en cercle que només avancen en un sentit (AM 217)
    // dades: inicial (lletres, '' = el disc buit; índex 0 a baix i en el sentit de les agulles),
    // negres (les lletres de les fitxes negres), paraula, minim, solucio (les lletres per ordre).
    // ════════════════════════════════════════════════════════════
    const RCER = 150,
        CCER = 200;
    const sentitsCercle = d => {
        const s = {};
        d.inicial.forEach(x => x && (s[x] = d.negres.includes(x) ? 1 : -1));
        return s;
    };
    const posCercle = (i, n) => [CCER - RCER * Math.sin((2 * Math.PI * i) / n), CCER + RCER * Math.cos((2 * Math.PI * i) / n)];

    function dibuixaCercle(d, opcions = {}) {
        const n = d.inicial.length;
        const s = C.svg('svg', {
            'class': 'tauler-svg cercle-svg',
            'viewBox': '0 0 400 400',
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || d.etiqueta,
        });
        C.svg('circle', { class: 'anella', cx: CCER, cy: CCER, r: RCER }, s);
        // Les dues fletxes del mig: les negres giren com les agulles del rellotge; les blanques, al revés
        [[62, 1, 'negra'], [96, -1, 'blanca']].forEach(([r, sentit, color]) => {
            const a0 = -150, a1 = -30;
            const p = a => [CCER + r * Math.cos((a * Math.PI) / 180), CCER + 8 + r * Math.sin((a * Math.PI) / 180)];
            const [x0, y0] = p(a0), [x1, y1] = p(a1);
            const g = C.svg('g', { class: 'fletxa ' + color }, s);
            C.svg('path', { class: 'arc', d: `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}` }, g);
            const [xp, yp, ang] = sentit > 0 ? [x1, y1, a1 + 90] : [x0, y0, a0 - 90];
            const punta = C.svg('path', { class: 'punta', d: 'M0 0 L-11 -6 L-11 6 Z' }, g);
            punta.setAttribute('transform', `translate(${xp} ${yp}) rotate(${ang})`);
            C.svg('circle', { class: 'mostra-color', cx: CCER, cy: CCER + 8 - r, r: 8 }, g);
        });
        const discos = [];
        for (let i = 0; i < n; i++) {
            const [x, y] = posCercle(i, n);
            discos.push(C.svg('circle', { 'class': 'disc', 'cx': x, 'cy': y, 'r': 27, 'data-i': i }, s));
        }
        const capa = C.svg('g', { class: 'fitxes-cercle' }, s);
        const fitxes = {};
        d.inicial.forEach(x => {
            if (!x) return;
            const g = C.svg('g', { 'class': 'fitxa-cercle ' + (d.negres.includes(x) ? 'negra' : 'blanca'), 'data-l': x }, capa);
            const salt = C.svg('g', { class: 'salt' }, g);
            C.svg('circle', { class: 'cos', r: 22 }, salt);
            C.svg('text', { 'class': 'lletra-fitxa', 'x': 0, 'y': 1, 'text': x }, salt);
            fitxes[x] = g;
        });
        function posa(estat) {
            estat.forEach((x, i) => {
                if (!x) return;
                const [px, py] = posCercle(i, n);
                fitxes[x].style.transform = `translate(${px}px, ${py}px)`;
            });
        }
        return { svg: s, discos, fitxes, posa, n };
    }

    function figuraCercle(p, opcions = {}) {
        const D = dibuixaCercle(p.dades, { estatic: true });
        D.posa(opcions.estat || p.dades.inicial);
        return D.svg;
    }

    function creaCercle(lloc, p, ctx) {
        const d = p.dades;
        const sentit = sentitsCercle(d);
        let estat, moviments, salts, reproduccio;
        const hist = C.historial(x => ({ estat: x.estat.slice(), moviments: x.moviments, salts: x.salts }));
        const caixa = C.el('div', { class: 'tauler cercle' });
        const D = dibuixaCercle(d);
        caixa.appendChild(D.svg);
        lloc.appendChild(caixa);
        const color = x => (sentit[x] > 0 ? 'negra' : 'blanca');

        Object.keys(D.fitxes).forEach(x => {
            const g = D.fitxes[x];
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(x);
            });
        });
        C.arrossega(D.svg, {
            inici: e => {
                const g = e.target.closest('.fitxa-cercle');
                if (!g) return null;
                atura();
                return { x: g.dataset.l };
            },
            comenca: c => D.fitxes[c.x].classList.add('arrossegada'),
            mou: (c, e) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                D.fitxes[c.x].style.transform = `translate(${q.x}px, ${q.y}px)`;
            },
            deixa: (c, e) => {
                D.fitxes[c.x].classList.remove('arrossegada');
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                const f = estat.indexOf('');
                const [fx, fy] = posCercle(f, D.n);
                if (Math.hypot(q.x - fx, q.y - fy) < 40) toca(c.x);
                else pinta();
            },
            cancela: c => {
                D.fitxes[c.x].classList.remove('arrossegada');
                pinta();
            },
        });
        caixa.addEventListener('keydown', e => {
            const x = e.key.length === 1 ? e.key.toUpperCase() : '';
            if (x && D.fitxes[x]) {
                e.preventDefault();
                toca(x);
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.fitxa-cercle');
                if (g) {
                    e.preventDefault();
                    toca(g.dataset.l);
                }
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        });

        function inicia() {
            atura();
            estat = d.inicial.slice();
            moviments = 0;
            salts = 0;
            hist.buida();
            pinta();
        }
        function pinta() {
            D.posa(estat);
            const f = estat.indexOf('');
            D.discos.forEach((c, i) => c.classList.toggle('buit', i === f));
            estat.forEach((x, i) => {
                if (!x) return;
                const pot = M.cercle.desti(estat, i, sentit) >= 0;
                D.fitxes[x].classList.toggle('pot', pot);
                D.fitxes[x].setAttribute('aria-label', `Fitxa ${color(x)} ${x}${pot ? ', es pot moure' : ''}`);
            });
            ctx.estat([
                C.el('span', null, 'Moviments: ', C.el('b', { text: moviments })),
                C.el('span', { text: `${C.plural(salts, 'salt')} i ${C.plural(moviments - salts, 'pas', 'passos')}` }),
                C.el('span', { class: 'paraula-cercle', text: llegeix() }),
            ]);
            ctx.desfes(hist.mida > 0);
        }
        /** El que es llegeix ara, en el sentit de les agulles, després del disc buit. */
        function llegeix() {
            const f = estat.indexOf('');
            const out = [];
            for (let k = 1; k < estat.length; k++) out.push(estat[(f + k) % estat.length]);
            return out.join('');
        }
        function toca(x) {
            atura();
            const i = estat.indexOf(x);
            const motiu = M.cercle.motiu(estat, i, sentit);
            if (motiu) {
                ctx.missatge(
                    'error',
                    `La ${x} no es pot moure`,
                    [
                        motiu === 'mateix'
                            ? `La ${x} és ${color(x)} i no pot saltar per sobre d’una fitxa del seu color.`
                            : `Les fitxes ${color(x)}s només avancen ${sentit[x] > 0 ? 'en el sentit de les agulles del rellotge' : 'en el sentit contrari a les agulles del rellotge'}, i el disc buit no és al costat ni just després d’una fitxa de l’altre color.`,
                    ]
                );
                C.anima(D.fitxes[x].querySelector('.salt'), 'sacseja');
                return;
            }
            hist.desa({ estat, moviments, salts });
            const esSalt = M.cercle.esSalt(estat, i, sentit);
            estat = M.cercle.mou(estat, i, sentit);
            moviments++;
            if (esSalt) salts++;
            ctx.amaga();
            C.anima(D.fitxes[x].querySelector('.salt'), esSalt ? 'saltant' : 'passant');
            pinta();
            revisa();
        }
        function revisa() {
            if (estat[0] !== '' || llegeix() !== d.paraula) return;
            if (moviments === d.minim)
                ctx.resolt(`${moviments} moviments: el mínim!`, [`Ja som a Twickenham: ${C.plural(salts, 'salt')} i ${C.plural(moviments - salts, 'pas', 'passos')}.`]);
            else ctx.missatge('info', `Twickenham, en ${moviments} moviments`, [`Es pot fer en ${d.minim}. Ho tornes a provar?`]);
        }
        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, moviments, salts } = ant);
            ctx.amaga();
            pinta();
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }
        inicia();
        return {
            reinicia: inicia,
            desfes,
            textSolucio: `▶ Mira-la al tauler (${d.minim} moviments)`,
            solucio() {
                inicia();
                reproduccio = C.reprodueix(
                    d.solucio.split(''),
                    x => {
                        const i = estat.indexOf(x);
                        const esSalt = M.cercle.esSalt(estat, i, sentit);
                        estat = M.cercle.mou(estat, i, sentit);
                        moviments++;
                        if (esSalt) salts++;
                        C.anima(D.fitxes[x].querySelector('.salt'), esSalt ? 'saltant' : 'passant');
                        pinta();
                    },
                    C.movimentReduit() ? 300 : 600,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', ['Vint-i-sis moviments: 19 salts i 7 passos.'])
                );
                return reproduccio;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // BLOCS: blocs que llisquen dins una capsa (AM 219)
    // dades: cols, inicial i objectiu (text, '_' = el forat), minim, solucio (les lletres per ordre).
    // ════════════════════════════════════════════════════════════
    const BL = 100,
        VORA = 14;
    const llegeixBlocs = t => t.split('').map(x => (x === '_' ? '' : x));

    function dibuixaBlocs(d, opcions = {}) {
        const cols = d.cols,
            files = d.inicial.length / cols;
        const W = cols * BL + 2 * VORA,
            H = files * BL + 2 * VORA;
        const s = C.svg('svg', {
            'class': 'tauler-svg blocs-svg',
            'viewBox': `0 0 ${W} ${H}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || d.etiqueta,
        });
        C.svg('rect', { class: 'capsa-blocs', x: 0, y: 0, width: W, height: H, rx: 6 }, s);
        C.svg('rect', { class: 'fons-capsa', x: VORA, y: VORA, width: cols * BL, height: files * BL }, s);
        const capa = C.svg('g', { class: 'blocs' }, s);
        const blocs = {};
        llegeixBlocs(d.inicial).forEach(x => {
            if (!x) return;
            const g = C.svg('g', { 'class': 'bloc', 'data-l': x }, capa);
            const dins = C.svg('g', { class: 'dins-bloc' }, g);
            C.svg('rect', { class: 'cara-bloc', x: 3, y: 3, width: BL - 6, height: BL - 6, rx: 6 }, dins);
            C.svg('text', { 'class': 'lletra-bloc', 'x': BL / 2, 'y': BL / 2 + 2, 'text': x }, dins);
            blocs[x] = g;
        });
        const lloc = i => [VORA + (i % cols) * BL, VORA + Math.floor(i / cols) * BL];
        function posa(estat) {
            estat.forEach((x, i) => {
                if (!x) return;
                const [px, py] = lloc(i);
                blocs[x].style.transform = `translate(${px}px, ${py}px)`;
            });
        }
        return { svg: s, blocs, posa, lloc };
    }

    function figuraBlocs(p, opcions = {}) {
        const D = dibuixaBlocs(p.dades, { estatic: true });
        D.posa(llegeixBlocs(opcions.estat || p.dades.inicial));
        return D.svg;
    }

    function creaBlocs(lloc, p, ctx) {
        const d = p.dades;
        const cols = d.cols;
        let estat, moviments, reproduccio, ruta;
        const hist = C.historial(x => ({ estat: x.estat.slice(), moviments: x.moviments, ruta: x.ruta.slice() }));
        const caixa = C.el('div', { class: 'tauler blocs-joc' });
        const D = dibuixaBlocs(d);
        const textRuta = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
        caixa.append(D.svg, textRuta);
        lloc.appendChild(caixa);

        Object.keys(D.blocs).forEach(x => {
            const g = D.blocs[x];
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(x);
            });
        });
        C.arrossega(D.svg, {
            inici: e => {
                const g = e.target.closest('.bloc');
                if (!g) return null;
                atura();
                return { x: g.dataset.l };
            },
            comenca: c => D.blocs[c.x].classList.add('arrossegat'),
            mou: (c, e) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                D.blocs[c.x].style.transform = `translate(${q.x - BL / 2}px, ${q.y - BL / 2}px)`;
            },
            deixa: (c, e) => {
                D.blocs[c.x].classList.remove('arrossegat');
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                const [fx, fy] = D.lloc(estat.indexOf(''));
                if (q.x > fx - 20 && q.x < fx + BL + 20 && q.y > fy - 20 && q.y < fy + BL + 20) toca(c.x);
                else pinta();
            },
            cancela: c => {
                D.blocs[c.x].classList.remove('arrossegat');
                pinta();
            },
        });
        caixa.addEventListener('keydown', e => {
            const x = e.key.length === 1 ? e.key.toUpperCase() : '';
            const fletxa = { ArrowUp: cols, ArrowDown: -cols, ArrowLeft: 1, ArrowRight: -1 }[e.key];
            if (x && D.blocs[x]) {
                e.preventDefault();
                toca(x);
            } else if (fletxa) {
                // la fletxa diu cap on llisca el bloc: el bloc és a l'altra banda del forat
                e.preventDefault();
                const f = estat.indexOf('');
                const i = f + fletxa;
                const mateixaFila = Math.abs(fletxa) !== 1 || Math.floor(i / cols) === Math.floor(f / cols);
                if (i >= 0 && i < estat.length && mateixaFila) {
                    toca(estat[i]);
                    D.blocs[estat[f]].focus();
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.bloc');
                if (g) {
                    e.preventDefault();
                    toca(g.dataset.l);
                }
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        });

        function inicia() {
            atura();
            estat = llegeixBlocs(d.inicial);
            moviments = 0;
            ruta = [];
            hist.buida();
            pinta();
        }
        function pinta() {
            D.posa(estat);
            estat.forEach((x, i) => {
                if (!x) return;
                const pot = M.blocs.desti(estat, i, cols) >= 0;
                D.blocs[x].classList.toggle('pot', pot);
                D.blocs[x].setAttribute('aria-label', `Bloc ${x}${pot ? ', tocant al forat' : ''}`);
            });
            textRuta.textContent = ruta.length ? 'Moviments: ' + ruta.join(', ') : 'Toca un bloc que toqui el forat.';
            ctx.estat([C.el('span', null, 'Moviments: ', C.el('b', { text: moviments }))]);
            ctx.desfes(hist.mida > 0);
        }
        function toca(x) {
            if (!x) return;
            atura();
            const i = estat.indexOf(x);
            if (M.blocs.desti(estat, i, cols) < 0) {
                ctx.missatge('error', `El bloc ${x} no es pot moure`, ['Només pot lliscar un bloc que toqui el forat per un costat (no en diagonal).']);
                C.anima(D.blocs[x].querySelector('.dins-bloc'), 'sacseja');
                return;
            }
            hist.desa({ estat, moviments, ruta });
            estat = M.blocs.mou(estat, i, cols);
            moviments++;
            ruta = ruta.concat([x]);
            ctx.amaga();
            pinta();
            revisa();
        }
        function revisa() {
            if (estat.map(x => x || '_').join('') !== d.objectiu) return;
            if (moviments === d.minim) ctx.resolt(`${moviments} moviments: el mínim!`, ['És el mínim possible, i només hi ha una manera de fer-ho en tan pocs moviments.']);
            else if (moviments < d.minim) ctx.resolt(`Fet en ${moviments} moviments!`, []);
            else ctx.missatge('info', `Fet en ${moviments} moviments`, ['Es pot fer amb menys moviments. Ho tornes a provar?']);
        }
        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, moviments, ruta } = ant);
            ctx.amaga();
            pinta();
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }
        inicia();
        return {
            reinicia: inicia,
            desfes,
            textSolucio: `▶ Mira-la al tauler (${d.minim} moviments)`,
            solucio() {
                inicia();
                reproduccio = C.reprodueix(
                    d.solucio.split(''),
                    x => {
                        estat = M.blocs.mou(estat, estat.indexOf(x), cols);
                        moviments++;
                        ruta = ruta.concat([x]);
                        pinta();
                    },
                    C.movimentReduit() ? 260 : 520,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', ['Vint-i-tres moviments, el mínim.'])
                );
                return reproduccio;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // XARXA: granotes sobre bolets units per línies (AM 341), o locomotores en unes vies (AM 221)
    // dades: posicions {bolet: [x, y]} (quadrícula), arestes [[a, b], …], cercle (l'ordre dels bolets
    // al cercle), inicial i objectiu ({bolet: 'blanca' | 'negra'}), minimJugades, minimMoviments,
    // solucio (jugades: llistes de moviments [d'on, cap on]). Els bolets són 1…n; l'estat, 0…n − 1.
    // Amb fitxa: 'locomotora' (AM 221), les fitxes són números (inicial = {punt: número}), hi ha un sol
    // punt buit (en tocar una locomotora, hi va) i l'objectiu és ordre = { vora: [punts per ordre], buit }.
    // ════════════════════════════════════════════════════════════
    const PAS_X = 150;
    function posXarxa(d, cercle) {
        const out = {};
        const n = Object.keys(d.posicions).length;
        Object.keys(d.posicions).forEach(k => {
            if (cercle) {
                const a = (2 * Math.PI * d.cercle.indexOf(+k)) / n - Math.PI / 2;
                out[k] = [PAS_X + 140 * Math.cos(a), PAS_X + 140 * Math.sin(a)];
            } else out[k] = [10 + d.posicions[k][0] * PAS_X, 10 + d.posicions[k][1] * PAS_X];
        });
        return out;
    }
    function boletXarxa(pare) {
        const g = C.svg('g', { class: 'bolet' }, pare);
        C.svg('path', { class: 'peu', d: 'M-9 4 Q-11 22 -14 28 H14 Q11 22 9 4 Z' }, g);
        C.svg('path', { class: 'barret', d: 'M-38 8 Q-36 -26 0 -28 Q36 -26 38 8 Q0 16 -38 8 Z' }, g);
        return g;
    }

    /** Una locomotora vista de costat, amb el seu número. */
    function locomotora(num, pare) {
        const g = C.svg('g', { 'class': 'locomotora', 'data-v': num }, pare);
        const dins = C.svg('g', { class: 'salt' }, g);
        C.svg('rect', { class: 'xemeneia', x: -20, y: -24, width: 8, height: 12, rx: 1.5 }, dins);
        C.svg('rect', { class: 'cabina', x: 6, y: -24, width: 18, height: 26, rx: 2 }, dins);
        C.svg('rect', { class: 'caldera', x: -26, y: -13, width: 34, height: 19, rx: 8 }, dins);
        [-17, 0, 15].forEach(x => C.svg('circle', { class: 'roda', cx: x, cy: 9, r: 6 }, dins));
        C.svg('text', { 'class': 'num-loco', 'x': -9, 'y': -3, 'text': num }, dins);
        return g;
    }
    const esLoco = d => d.fitxa === 'locomotora';

    function dibuixaXarxa(d, opcions = {}) {
        const s = C.svg('svg', {
            'class': 'tauler-svg bolets-svg' + (esLoco(d) ? ' vies-svg' : ''),
            'viewBox': '-50 -50 420 440',
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || d.etiqueta,
        });
        const capaFils = C.svg('g', { class: 'fils' }, s);
        const fils = d.arestes.map(() => C.svg('line', { class: 'fil-bolet' }, capaFils));
        const capaBolets = C.svg('g', { class: 'bolets' }, s);
        const bolets = {};
        Object.keys(d.posicions).forEach(k => {
            const g = C.svg('g', { 'class': 'punt-bolet', 'data-b': k }, capaBolets);
            C.svg('circle', { class: 'zona', r: 44 }, g);
            if (esLoco(d)) C.svg('ellipse', { class: 'parada', rx: 30, ry: 9, cy: 15 }, g);
            else {
                boletXarxa(g);
                C.svg('text', { 'class': 'num-bolet', 'x': 0, 'y': 44, 'text': k }, g);
            }
            bolets[k] = g;
        });
        const capaGranotes = C.svg('g', { class: 'granotes' }, s);
        const granotes = Object.keys(d.inicial).map(k => {
            const g = esLoco(d) ? locomotora(d.inicial[k], capaGranotes) : granota(k, capaGranotes, d.inicial[k]);
            g.classList.add('granota-xarxa');
            g.dataset.v = String(d.inicial[k]);
            return g;
        });
        let pos = posXarxa(d, !!opcions.cercle);
        /** Col·loca els bolets i els fils (pos) i les granotes (estat: [color | '', …] per bolet 1…n). */
        function posa(estat, p = pos) {
            pos = p;
            Object.keys(bolets).forEach(k => (bolets[k].style.transform = `translate(${p[k][0]}px, ${p[k][1]}px)`));
            d.arestes.forEach(([a, b], i) => {
                fils[i].setAttribute('x1', p[a][0]);
                fils[i].setAttribute('y1', p[a][1]);
                fils[i].setAttribute('x2', p[b][0]);
                fils[i].setAttribute('y2', p[b][1]);
            });
            // cada granota conserva el seu element: el de la mateixa posició a la llista
            granotes.forEach(g => (g.dataset.lliure = '1'));
            estat.forEach((c, i) => {
                if (!c) return;
                const v = String(c);
                const g = granotes.find(x => x.dataset.lliure === '1' && x.dataset.b === String(i + 1) && x.dataset.v === v) ||
                    granotes.find(x => x.dataset.lliure === '1' && x.dataset.v === v);
                g.dataset.lliure = '0';
                g.dataset.b = String(i + 1);
                g.style.transform = `translate(${p[i + 1][0]}px, ${p[i + 1][1] - (esLoco(d) ? 2 : 16)}px) scale(${esLoco(d) ? 1 : 0.78})`;
            });
        }
        return { svg: s, bolets, granotes, posa, pos: () => pos };
    }
    const estatXarxa = (d, mapa) => Object.keys(d.posicions).map(k => mapa[k] || '');
    /** S'ha arribat a l'objectiu? (Un mapa {punt: fitxa}, o les fitxes 1…n en ordre al voltant de la vora.) */
    function arribatXarxa(d, estat) {
        if (!d.ordre) return estat.join(',') === estatXarxa(d, d.objectiu).join(',');
        if (estat[d.ordre.buit - 1]) return false;
        const vora = d.ordre.vora.map(k => estat[k - 1]),
            n = vora.length;
        const i = vora.indexOf(1);
        return [1, -1].some(sentit => vora.every((_, k) => vora[(i + sentit * k + n * n) % n] === k + 1));
    }
    /** Les fitxes que encara no s'han mogut. */
    const quietes = (d, movs) => {
        let e = estatXarxa(d, d.inicial);
        const mogudes = new Set();
        movs.forEach(([a, b]) => {
            mogudes.add(e[a]);
            e = M.xarxa.mou(e, a, b);
        });
        return Object.values(d.inicial).filter(v => !mogudes.has(v)).sort((a, b) => a - b);
    };

    function figuraXarxa(p, opcions = {}) {
        const D = dibuixaXarxa(p.dades, { estatic: true, cercle: opcions.cercle });
        D.posa(estatXarxa(p.dades, p.dades.inicial));
        return D.svg;
    }

    function creaXarxa(lloc, p, ctx) {
        const d = p.dades;
        const ar = d.arestes.map(([a, b]) => [a - 1, b - 1]);
        let estat, movs, triat, reproduccio, enCercle = false, animacio = null;
        const hist = C.historial(x => ({ estat: x.estat.slice(), movs: x.movs.slice() }));
        const caixa = C.el('div', { class: 'tauler xarxa' });
        const D = dibuixaXarxa(d);
        const boto = C.el('button', { type: 'button', class: 'btn-sec boto-fils', text: 'Desembolica els fils' });
        const textRuta = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
        caixa.append(...[D.svg, d.cercle ? C.el('div', { class: 'eines-tauler' }, boto) : null, textRuta].filter(Boolean));
        const nomFitxa = i => (esLoco(d) ? `La locomotora ${estat[i]}` : `La granota del ${i + 1}`);
        lloc.appendChild(caixa);

        Object.keys(D.bolets).forEach(k => {
            const g = D.bolets[k];
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(+k - 1);
            });
        });
        D.granotes.forEach(g =>
            g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(+g.dataset.b - 1);
            })
        );
        boto.addEventListener('click', () => {
            enCercle = !enCercle;
            boto.textContent = enCercle ? 'Torna-ho a embolicar' : 'Desembolica els fils';
            transicio(posXarxa(d, enCercle));
        });
        const boletA = (e, tactil) => {
            const q = C.coords(D.svg, e.clientX, e.clientY - (tactil ? 30 : 0));
            const pos = D.pos();
            let millor = -1,
                dist = 50;
            Object.keys(pos).forEach(k => {
                const dd = Math.hypot(pos[k][0] - q.x, pos[k][1] - q.y);
                if (dd < dist) {
                    dist = dd;
                    millor = +k - 1;
                }
            });
            return millor;
        };
        C.arrossega(D.svg, {
            inici: e => {
                const g = e.target.closest('.granota-xarxa');
                if (!g) return null;
                atura();
                return { i: +g.dataset.b - 1, g };
            },
            comenca: c => {
                c.g.classList.add('arrossegada');
                triat = null;
            },
            mou: (c, e) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                c.g.style.transform = `translate(${q.x}px, ${q.y - 16}px) scale(0.78)`;
            },
            deixa: (c, e) => {
                c.g.classList.remove('arrossegada');
                const j = boletA(e, c.tactil);
                if (j >= 0 && j !== c.i) prova(c.i, j);
                else pinta();
            },
            cancela: c => {
                c.g.classList.remove('arrossegada');
                pinta();
            },
        });
        caixa.addEventListener('keydown', e => {
            if (esLoco(d) && /^[1-9]$/.test(e.key) && estat.includes(+e.key)) {
                // amb les locomotores, la tecla és el número de la locomotora
                e.preventDefault();
                toca(estat.indexOf(+e.key));
            } else if (!esLoco(d) && /^[1-9]$/.test(e.key) && D.bolets[e.key]) {
                e.preventDefault();
                toca(+e.key - 1);
                D.bolets[e.key].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.punt-bolet');
                if (g) {
                    e.preventDefault();
                    toca(+g.dataset.b - 1);
                }
            } else if (e.key === 'Escape' && triat !== null) {
                triat = null;
                pinta();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        });

        /** Mou els bolets i els fils a les posicions noves, a poc a poc. */
        function transicio(desti) {
            if (animacio) cancelAnimationFrame(animacio);
            const origen = D.pos();
            if (C.movimentReduit()) {
                D.posa(estat, desti);
                return;
            }
            D.svg.classList.add('movent');
            const t0 = performance.now();
            const pas = t => {
                const k = Math.min(1, (t - t0) / 800),
                    s = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
                const p = {};
                Object.keys(desti).forEach(b => (p[b] = [0, 1].map(j => origen[b][j] + (desti[b][j] - origen[b][j]) * s)));
                D.posa(estat, p);
                if (k < 1) animacio = requestAnimationFrame(pas);
                else {
                    animacio = null;
                    D.svg.classList.remove('movent');
                }
            };
            animacio = requestAnimationFrame(pas);
        }
        function inicia() {
            atura();
            estat = estatXarxa(d, d.inicial);
            movs = [];
            triat = null;
            hist.buida();
            pinta();
        }
        function pinta() {
            D.posa(estat);
            Object.keys(D.bolets).forEach(k => {
                const i = +k - 1;
                const g = D.bolets[k];
                g.classList.toggle('triat', triat === i);
                g.classList.toggle('desti-possible', triat !== null && !M.xarxa.motiu(estat, ar, triat, i));
                g.setAttribute('aria-label', esLoco(d) ? `Punt ${k}: ${estat[i] ? 'locomotora ' + estat[i] : 'buit'}` : `Bolet ${k}: ${estat[i] ? 'granota ' + estat[i] : 'buit'}`);
            });
            D.granotes.forEach(g => g.classList.toggle('triada', triat !== null && +g.dataset.b - 1 === triat));
            D.svg.classList.toggle('amb-seleccio', triat !== null);
            const jug = M.xarxa.jugades(movs);
            ctx.estat([
                d.minimJugades ? C.el('span', null, 'Jugades: ', C.el('b', { text: jug })) : null,
                C.el('span', null, 'Moviments: ', C.el('b', { text: movs.length })),
            ]);
            if (esLoco(d)) textRuta.textContent = movs.length ? 'Locomotores: ' + mogudes().join(', ') : 'Toca una locomotora: va sola al punt buit, si hi ha via.';
            else textRuta.textContent = movs.length ? 'Moviments: ' + movs.map(([a, b]) => `${a + 1}–${b + 1}`).join(', ') : 'Toca una granota i després el bolet on ha d’anar.';
            ctx.desfes(hist.mida > 0);
        }
        /** Les locomotores, en l'ordre en què s'han mogut. */
        function mogudes() {
            let e = estatXarxa(d, d.inicial);
            return movs.map(([a, b]) => {
                const v = e[a];
                e = M.xarxa.mou(e, a, b);
                return v;
            });
        }
        function toca(i) {
            atura();
            if (esLoco(d)) {
                // un sol punt buit: la locomotora hi va directament
                if (estat[i]) prova(i, estat.indexOf(''));
                return;
            }
            if (triat === null) {
                if (!estat[i]) {
                    C.anima(D.bolets[i + 1].querySelector('.bolet'), 'sacseja');
                    return;
                }
                ctx.amaga();
                triat = i;
                pinta();
                return;
            }
            if (i === triat) {
                triat = null;
                pinta();
                return;
            }
            if (estat[i]) {
                triat = i;
                pinta();
                return;
            }
            const de = triat;
            triat = null;
            prova(de, i);
        }
        function prova(de, a) {
            const motiu = M.xarxa.motiu(estat, ar, de, a);
            if (motiu === 'linia' && esLoco(d)) {
                ctx.missatge('error', `${nomFitxa(de)} no hi pot anar`, ['No hi ha cap via directa entre el seu punt i el punt buit.']);
                C.anima(D.granotes.find(g => g.dataset.v === String(estat[de])).querySelector('.salt'), 'sacseja');
                pinta();
                return;
            }
            if (motiu === 'linia') {
                ctx.missatge('error', `Del ${de + 1} al ${a + 1} no hi ha cap línia`, [`Des del ${de + 1}, la granota només pot anar ${veinsDe(de)}.`]);
                C.anima(D.bolets[a + 1].querySelector('.bolet'), 'sacseja');
                pinta();
                return;
            }
            if (motiu) {
                pinta();
                return;
            }
            hist.desa({ estat, movs });
            estat = M.xarxa.mou(estat, de, a);
            movs = movs.concat([[de, a]]);
            ctx.amaga();
            pinta();
            revisa();
        }
        const veinsDe = i => {
            const v = ar.filter(x => x.includes(i)).map(x => (x[0] === i ? x[1] : x[0]) + 1);
            return `al ${v.join(' o al ')}`;
        };
        function revisa() {
            if (!arribatXarxa(d, estat)) return;
            if (esLoco(d)) {
                const q = quietes(d, movs);
                const frase = q.length === 1 ? `La locomotora ${q[0]} no s’ha mogut en cap moment.` : q.length ? `Les locomotores ${C.llista(q.map(String))} no s’han mogut.` : 'Totes les locomotores s’han mogut.';
                if (movs.length <= d.minimMoviments) ctx.resolt(`${movs.length} moviments: el mínim!`, [frase]);
                else ctx.missatge('info', `En ordre, en ${movs.length} moviments`, [frase, `Es pot fer en ${d.minimMoviments}, amb una locomotora sense moure’s. Ho tornes a provar?`]);
                return;
            }
            const jug = M.xarxa.jugades(movs);
            if (jug <= d.minimJugades)
                ctx.resolt(`${jug} jugades: el mínim!`, [
                    `${C.plural(movs.length, 'moviment')}${movs.length === d.minimMoviments ? ', que també és el mínim' : ''}.`,
                ]);
            else ctx.missatge('info', `Fet en ${jug} jugades (${C.plural(movs.length, 'moviment')})`, [`Es pot fer en ${d.minimJugades} jugades. Ho tornes a provar?`]);
        }
        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, movs } = ant);
            triat = null;
            ctx.amaga();
            pinta();
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }
        inicia();
        return {
            reinicia: inicia,
            desfes,
            textSolucio: d.minimJugades ? `▶ Mira-la al tauler (${d.minimJugades} jugades)` : `▶ Mira-la al tauler (${d.minimMoviments} moviments)`,
            solucio() {
                inicia();
                reproduccio = C.reprodueix(
                    // les locomotores: només el número (va al punt buit); les granotes: [d'on, cap on]
                    esLoco(d) ? d.solucio : d.solucio.flat(),
                    x => {
                        const [de, a] = esLoco(d) ? [estat.indexOf(x), estat.indexOf('')] : [x[0] - 1, x[1] - 1];
                        estat = M.xarxa.mou(estat, de, a);
                        movs = movs.concat([[de, a]]);
                        pinta();
                    },
                    C.movimentReduit() ? 300 : 560,
                    () => ctx.missatge('info', 'Així ho fa Dudeney', [d.resumSolucio || 'Set jugades i setze moviments.'])
                );
                return reproduccio;
            },
        };
    }

    window.Taulers.piles = { crea: creaPiles, figura: figuraPiles };
    window.Taulers.salts = { crea: creaSalts, figura: figuraSalts };
    window.Taulers.cercle = {
        crea: creaCercle,
        figura: figuraCercle,
        figuraSolucio: p => {
            const svg = figuraCercle(p, { estat: [''].concat(p.dades.paraula.split('')) });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg, C.el('figcaption', { text: 'Al final: TWICKENHAM, amb el disc buit a baix.' }));
        },
    };
    window.Taulers.blocs = {
        crea: creaBlocs,
        figura: figuraBlocs,
        figuraSolucio: p => {
            const svg = figuraBlocs(p, { estat: p.dades.objectiu });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg, C.el('figcaption', { text: 'Al final, després de 23 moviments.' }));
        },
    };
    window.Taulers.xarxa = {
        crea: creaXarxa,
        figura: figuraXarxa,
        figuraSolucio: p => {
            if (esLoco(p.dades)) {
                const D = dibuixaXarxa(p.dades, { estatic: true, etiqueta: p.dades.etiquetaFinal });
                D.posa(estatXarxa(p.dades, p.dades.final));
                D.svg.classList.add('figura-estatica');
                return C.el('figure', null, D.svg, C.el('figcaption', { text: p.dades.peuFinal }));
            }
            const svg = figuraXarxa(p, { cercle: true });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg, C.el('figcaption', { text: 'Els mateixos bolets i les mateixes línies, desembolicats: un sol cercle (1, 5, 6, 2, 8, 4, 3, 7).' }));
        },
    };
})();
