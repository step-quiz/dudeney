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
 *   Tots dos tenen «Desfés» i la solució de Dudeney pas a pas.
 * ARQUITECTURA: window.Taulers.piles / .salts = { crea(lloc, p, ctx), figura(p) }.
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
    // SALTS: les granotes
    // ════════════════════════════════════════════════════════════
    const CEL = 92;

    /** Una granota vista des de dalt, amb el número a l'esquena. */
    function granota(num, pare) {
        const g = C.svg('g', { 'class': 'granota', 'data-g': num }, pare);
        const salt = C.svg('g', { class: 'salt' }, g);
        // potes de darrere i de davant
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
        C.svg('text', { 'class': 'num-granota', 'x': 0, 'y': 8, 'text': num }, salt);
        return g;
    }

    function dibuixaSalts(n, opcions = {}) {
        const W = (n + 1) * CEL,
            H = CEL + 12;
        const s = C.svg('svg', {
            'class': 'tauler-svg salts-svg',
            'viewBox': `0 0 ${W} ${H}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || `${n} granotes en una filera de ${n + 1} caselles`,
        });
        const caselles = [];
        for (let i = 0; i <= n; i++) {
            const g = C.svg('g', { 'class': 'casella', 'data-i': i }, s);
            C.svg('rect', { class: i % 2 ? 'fons fosc' : 'fons', x: i * CEL + 3, y: 6, width: CEL - 6, height: CEL - 6, rx: 8 }, g);
            caselles.push(g);
        }
        const capa = C.svg('g', { class: 'granotes' }, s);
        const granotes = [];
        for (let k = 1; k <= n; k++) granotes[k] = granota(k, capa);
        function posa(estat) {
            estat.forEach((k, i) => {
                if (k) granotes[k].style.transform = `translate(${i * CEL + CEL / 2}px, ${CEL / 2 + 6}px)`;
            });
        }
        return { svg: s, caselles, granotes, posa, W, H };
    }

    const inicialSalts = n => [0].concat(Array.from({ length: n }, (_, i) => i + 1));
    const objectiuSalts = n => [0].concat(Array.from({ length: n }, (_, i) => n - i));

    function figuraSalts(p, opcions = {}) {
        const n = opcions.n || p.dades.granotes;
        const D = dibuixaSalts(n, { estatic: true, etiqueta: `Les granotes 1 a ${n}, amb la casella buida a l’esquerra` });
        D.posa(opcions.estat || inicialSalts(n));
        return D.svg;
    }

    function creaSalts(lloc, p, ctx) {
        const d = p.dades;
        let n = d.granotes;
        let estat, moviments, salts, D, reproduccio;
        const hist = C.historial(x => ({ estat: x.estat.slice(), moviments: x.moviments, salts: x.salts }));
        const caixa = C.el('div', { class: 'tauler salts' });
        lloc.appendChild(caixa);

        function munta() {
            D = dibuixaSalts(n);
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
            estat = inicialSalts(n);
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
                const pot = M.salts.desti(estat, i) >= 0;
                D.granotes[k].classList.toggle('pot', pot);
                D.granotes[k].setAttribute('aria-label', `Granota ${k}, a la casella ${i + 1}${pot ? ', es pot moure' : ''}`);
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
            const f = M.salts.desti(estat, i);
            if (f < 0) {
                ctx.missatge('error', `La granota ${k} no es pot moure`, [
                    'Només pot anar a la casella buida si és al costat o just després d’una altra granota.',
                ]);
                C.anima(D.granotes[k].querySelector('.salt'), 'sacseja');
                return;
            }
            hist.desa({ estat, moviments, salts });
            const esSalt = M.salts.esSalt(estat, i);
            estat = M.salts.mou(estat, i);
            moviments++;
            if (esSalt) salts++;
            ctx.amaga();
            const s = D.granotes[k].querySelector('.salt');
            C.anima(s, esSalt ? 'saltant' : 'passant');
            pinta();
            revisa();
        }

        function revisa() {
            if (!M.salts.resolt(estat, objectiuSalts(n))) return;
            const minim = M.granotesDudeney(n);
            if (moviments === minim) {
                const extra =
                    n < d.maxim
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
            if (/^[1-9]$/.test(e.key) && +e.key <= n) {
                e.preventDefault();
                toca(+e.key);
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
            textSolucio: '▶ Mira-la al tauler (21 moviments)',
            solucio() {
                inicia(d.granotes);
                reproduccio = C.reprodueix(
                    M.sequenciaGranotes(n),
                    k => {
                        const i = estat.indexOf(k);
                        const esSalt = M.salts.esSalt(estat, i);
                        estat = M.salts.mou(estat, i);
                        moviments++;
                        if (esSalt) salts++;
                        C.anima(D.granotes[k].querySelector('.salt'), esSalt ? 'saltant' : 'passant');
                        pinta();
                    },
                    C.movimentReduit() ? 300 : 620,
                    () =>
                        ctx.missatge('info', 'Així ho fa Dudeney', [
                            '2, 4, 6, 5, 3, 1 tres vegades, i 2, 4, 6: 15 salts i 6 passos.',
                        ])
                );
                return reproduccio;
            },
        };
    }

    window.Taulers.piles = { crea: creaPiles, figura: figuraPiles };
    window.Taulers.salts = { crea: creaSalts, figura: figuraSalts };
})();
