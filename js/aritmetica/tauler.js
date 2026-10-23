/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/aritmetica/tauler.js
 * ROL: Els taulers d'aritmètica:
 *   - Taulers.estripat (AM 113): una etiqueta de quatre xifres estripada pel
 *     mig. Es canvien les xifres (tocant-les i amb el teclat de sota) i es veu
 *     el compte: meitat + meitat, i el quadrat de la suma.
 *   - Taulers.caixa (CP 75): la sala com una capsa de cartró. Es despleguen
 *     les cares per on passa l'aranya (tocant les cares de punts o amb els
 *     botons); quan s'arriba a la paret de la mosca, es dibuixa el camí recte
 *     i se'n diu la longitud. A dalt, la sala plegada amb el mateix camí.
 *   - Taulers.rectangles (AM 347): un tauler on es marquen rectangles
 *     arrossegant, amb taulers de 1 × 1 a 8 × 8, i les respostes a escriure.
 *   - Taulers.amulet (CP 38): el triangle d'ABRACADABRA; es baixa de lletra en
 *     lletra, es compten els camins diferents i s'escriu la resposta.
 * ARQUITECTURA: window.Taulers.estripat / .caixa / .rectangles / .amulet = { crea(lloc, p, ctx), figura(p, o),
 *   figuraSolucio(p) }. La geometria (desplegar, la recta, tornar a plegar)
 *   és a js/aritmetica/motor.js.
 * DEPENDÈNCIES: js/comu/comu.js, js/aritmetica/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const A = window.MotorAritmetica;

    // ════════════════════════════════════════════════════════════
    // EL NÚMERO ESTRIPAT
    // ════════════════════════════════════════════════════════════
    const XS = [64, 150, 270, 356]; // x de cada xifra a l'etiqueta

    function dibuixaEtiqueta(xifres, opcions = {}) {
        const s = C.svg('svg', {
            'class': 'tauler-svg etiqueta-svg',
            'viewBox': '0 0 420 160',
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || 'L’etiqueta ' + xifres.join(''),
        });
        // Les dues meitats del paper, amb l'estrip en ziga-zaga
        const estrip = [
            [206, 8],
            [212, 30],
            [203, 52],
            [214, 78],
            [204, 104],
            [212, 128],
            [205, 152],
        ];
        const esq = C.svg('g', { class: 'meitat esquerra' }, s);
        C.svg('path', { class: 'paper', d: `M8 8 L${estrip.map(p => p.join(' ')).join(' L')} L8 152 Z` }, esq);
        const dre = C.svg('g', { class: 'meitat dreta' }, s);
        C.svg(
            'path',
            {
                class: 'paper',
                d: `M412 8 L${estrip.map(p => p[0] + 8 + ' ' + p[1]).join(' L')} L412 152 Z`,
            },
            dre
        );
        const xifresEls = xifres.map((x, i) => {
            const g = C.svg('g', { 'class': 'xifra', 'data-i': i }, i < 2 ? esq : dre);
            C.svg('rect', { class: 'zona', x: XS[i] - 42, y: 18, width: 84, height: 124, rx: 8 }, g);
            C.svg('text', { 'class': 'digit', 'x': XS[i], 'y': 82, 'text': x }, g);
            C.svg('rect', { class: 'subratllat', x: XS[i] - 30, y: 130, width: 60, height: 5, rx: 2 }, g);
            return g;
        });
        return { svg: s, xifresEls };
    }

    function figuraEtiqueta(p) {
        return dibuixaEtiqueta(p.dades.exemple.split(''), { estatic: true, etiqueta: 'L’etiqueta 3025, estripada entre el 30 i el 25' }).svg;
    }

    function creaEstripat(lloc, p, ctx) {
        const d = p.dades;
        let xifres, actual;
        const caixa = C.el('div', { class: 'tauler estripat' });
        const D = dibuixaEtiqueta(d.exemple.split(''));
        const compte = C.el('div', { 'class': 'compte', 'aria-live': 'polite' });
        const teclat = C.el('div', { 'class': 'teclat-xifres', 'role': 'group', 'aria-label': 'Xifres' });
        '1234567890'.split('').forEach(k => {
            const b = C.el('button', { type: 'button', class: 'tecla', text: k });
            b.addEventListener('click', () => escriu(+k));
            teclat.appendChild(b);
        });
        caixa.append(D.svg, compte, teclat);
        lloc.appendChild(caixa);
        D.xifresEls.forEach((g, i) => {
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.addEventListener('click', () => {
                actual = i;
                pinta();
            });
            g.addEventListener('focus', () => {
                actual = i;
                pinta();
            });
            g.addEventListener('keydown', e => tecla(e, i));
        });

        function inicia() {
            xifres = d.exemple.split('').map(Number);
            actual = 0;
            pinta(true);
        }
        function escriu(k) {
            xifres[actual] = k;
            actual = (actual + 1) % 4;
            pinta();
            D.xifresEls[actual].focus({ preventScroll: true });
        }
        function tecla(e, i) {
            if (/^[0-9]$/.test(e.key)) {
                actual = i;
                escriu(+e.key);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                actual = (i + (e.key === 'ArrowLeft' ? 3 : 1)) % 4;
                D.xifresEls[actual].focus();
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                xifres[i] = (xifres[i] + (e.key === 'ArrowUp' ? 1 : 9)) % 10;
                pinta();
            } else return;
            e.preventDefault();
        }
        function pinta(inici) {
            D.xifresEls.forEach((g, i) => {
                g.querySelector('.digit').textContent = xifres[i];
                g.classList.toggle('actual', i === actual);
                g.setAttribute('aria-label', `Xifra ${i + 1}: ${xifres[i]}`);
            });
            const r = A.estripa(xifres);
            const etiqueta = xifres.join('');
            const be = r.quadrat === r.numero;
            compte.replaceChildren(
                C.el(
                    'p',
                    { class: 'linia-compte' },
                    C.el('span', { class: 'meitat-compte', text: xifres.slice(0, 2).join('') }),
                    ' + ',
                    C.el('span', { class: 'meitat-compte', text: xifres.slice(2).join('') }),
                    ' = ',
                    C.el('b', { text: r.suma })
                ),
                C.el(
                    'p',
                    { class: 'linia-compte' },
                    `${r.suma} × ${r.suma} = `,
                    C.el('b', { text: C.nombre(r.quadrat) }),
                    C.el('span', { class: 'veredicte ' + (be ? 'be' : 'malament'), text: be ? ' = l’etiqueta ✓' : ` ≠ ${etiqueta}` })
                )
            );
            if (inici) {
                ctx.amaga();
                return;
            }
            ctx.amaga();
            if (!be) return;
            if (etiqueta === d.exemple)
                ctx.missatge('info', 'Aquest és el de Dudeney', ['30 + 25 = 55 i 55² = 3025. Busca’n un altre!']);
            else if (!A.diferents(xifres))
                ctx.missatge('info', `${etiqueta} també ho fa…`, [
                    `${r.a} + ${r.b} = ${r.suma} i ${r.suma}² = ${etiqueta}, però té xifres repetides.`,
                ]);
            else ctx.resolt(`${etiqueta}: l’has trobat!`, [`${r.a} + ${r.b} = ${r.suma} i ${r.suma} × ${r.suma} = ${C.nombre(r.quadrat)}.`]);
        }
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Posa-la a l’etiqueta',
            solucio() {
                xifres = d.solucio.split('').map(Number);
                pinta(true);
                ctx.missatge('info', 'La solució de Dudeney', ['98 + 01 = 99 i 99 × 99 = 9801.']);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // LA CAPSA: l'aranya i la mosca
    // ════════════════════════════════════════════════════════════
    const NOM_CARA = {
        A: 'la paret de l’aranya',
        B: 'la paret de la mosca',
        sostre: 'el sostre',
        terra: 'el terra',
        porta: 'la paret de la porta',
        finestra: 'la paret de la finestra',
    };
    const CURT_CARA = { A: 'A', B: 'B', sostre: 'sostre', terra: 'terra', porta: 'porta', finestra: 'finestra' };
    const ORDRE_CARES = ['sostre', 'porta', 'finestra', 'terra', 'B'];

    /** Els detalls de cada cara (en 3D): la porta, la finestra, el llum i les posts del terra. */
    function detalls(sala) {
        const L = sala.llarg,
            W = sala.ample,
            H = sala.alt;
        return {
            porta: [{ tipus: 'rect', punts: [[3, 0, 0], [8, 0, 0], [8, 0, 9], [3, 0, 9]] }],
            finestra: [
                { tipus: 'rect', punts: [[11, W, 4.5], [19, W, 4.5], [19, W, 9.5], [11, W, 9.5]] },
                { tipus: 'linia', punts: [[15, W, 4.5], [15, W, 9.5]] },
            ],
            sostre: [{ tipus: 'cercle', centre: [L / 2, W / 2, H], r: 1.1 }],
            terra: [3, 6, 9].map(y => ({ tipus: 'linia', punts: [[0, y, 0], [L, y, 0]] })),
            A: [],
            B: [],
        };
    }

    // ---- La sala plegada (perspectiva cavallera) ----
    function projeccio(p) {
        // x al llarg, y cap endins, z amunt
        return [p[0] + p[1] * 0.62, -p[2] - p[1] * 0.36];
    }
    function dibuixaSala(d, opcions = {}) {
        const { llarg: L, ample: W, alt: H } = d.sala;
        const cant = [
            [0, 0, 0],
            [L, 0, 0],
            [L, W, 0],
            [0, W, 0],
            [0, 0, H],
            [L, 0, H],
            [L, W, H],
            [0, W, H],
        ].map(projeccio);
        const xs = cant.map(p => p[0]),
            ys = cant.map(p => p[1]);
        const m = 3;
        const s = C.svg('svg', {
            'class': 'tauler-svg sala-svg',
            'viewBox': `${Math.min(...xs) - m} ${Math.min(...ys) - m} ${Math.max(...xs) - Math.min(...xs) + 2 * m} ${Math.max(...ys) - Math.min(...ys) + 2 * m}`,
            'role': 'img',
            'aria-label': opcions.etiqueta || 'La sala plegada, vista des de fora',
        });
        const cares = A.cares(d.sala);
        const capaCares = C.svg('g', { class: 'cares-3d' }, s);
        const polCares = {};
        // primer les del fons, després les del davant
        ['finestra', 'terra', 'A', 'B', 'sostre', 'porta'].forEach(k => {
            polCares[k] = C.svg('polygon', { 'class': 'cara-3d cara-' + k, 'points': cares[k].punts.map(projeccio).map(p => p.join(',')).join(' ') }, capaCares);
        });
        const det = detalls(d.sala);
        const capaDet = C.svg('g', { class: 'detalls-3d' }, s);
        Object.keys(det).forEach(k =>
            det[k].forEach(o => {
                if (o.tipus === 'cercle') {
                    const c = projeccio(o.centre);
                    C.svg('ellipse', { class: 'detall', cx: c[0], cy: c[1], rx: o.r * 1.2, ry: o.r * 0.55 }, capaDet);
                } else
                    C.svg(o.tipus === 'rect' ? 'polygon' : 'polyline', { class: 'detall', points: o.punts.map(projeccio).map(p => p.join(',')).join(' ') }, capaDet);
            })
        );
        const arestes = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
        const amagades = new Set(['2-3', '3-0', '3-7']); // les del racó del fons, a baix
        arestes.forEach(([a, b]) =>
            C.svg('line', { 'class': 'aresta-3d' + (amagades.has(`${a}-${b}`) ? ' amagada' : ''), 'x1': cant[a][0], 'y1': cant[a][1], 'x2': cant[b][0], 'y2': cant[b][1] }, s)
        );
        const cami = C.svg('polyline', { class: 'cami-3d', points: '' }, s);
        const S = projeccio(d.aranya),
            F = projeccio(d.mosca);
        aranya(s, S[0], S[1], 0.5);
        mosca(s, F[0], F[1], 0.5);
        C.svg('text', { 'class': 'lletra-3d', 'x': S[0] + 1.6, 'y': S[1] - 1, 'text': 'A' }, s);
        C.svg('text', { 'class': 'lletra-3d', 'x': F[0] + 1.6, 'y': F[1] + 0.4, 'text': 'B' }, s);
        return {
            svg: s,
            marca(seq, punts3d) {
                Object.keys(polCares).forEach(k => polCares[k].classList.toggle('usada', seq.includes(k)));
                cami.setAttribute('points', punts3d ? punts3d.map(projeccio).map(p => p.join(',')).join(' ') : '');
            },
        };
    }

    function aranya(pare, x, y, k) {
        const g = C.svg('g', { class: 'aranya' }, pare);
        g.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
        C.svg('path', { class: 'potes-aranya', d: 'M-1 -1 L-3 -3 L-4 -2 M-1 0 L-3.4 -0.6 M-1 0.6 L-3.2 1.6 M-0.8 1 L-2.4 3.2 M1 -1 L3 -3 L4 -2 M1 0 L3.4 -0.6 M1 0.6 L3.2 1.6 M0.8 1 L2.4 3.2' }, g);
        C.svg('circle', { class: 'cos-aranya', cx: 0, cy: 0.4, r: 1.25 }, g);
        C.svg('circle', { class: 'cos-aranya', cx: 0, cy: -1, r: 0.7 }, g);
        return g;
    }
    function mosca(pare, x, y, k) {
        const g = C.svg('g', { class: 'mosca' }, pare);
        g.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
        C.svg('ellipse', { class: 'ala', cx: -1.1, cy: -0.8, rx: 1.4, ry: 0.8 }, g);
        C.svg('ellipse', { class: 'ala', cx: 1.1, cy: -0.8, rx: 1.4, ry: 0.8 }, g);
        C.svg('ellipse', { class: 'cos-mosca', cx: 0, cy: 0.3, rx: 0.8, ry: 1.3 }, g);
        return g;
    }

    // ---- El cartró desplegat ----
    const mitjana = pol => pol.reduce((a, b) => [a[0] + b[0] / pol.length, a[1] + b[1] / pol.length], [0, 0]);
    function dibuixaXarxa(lloc, d, seq, opcions = {}) {
        const D = A.desplega(d.sala, seq);
        // El pla del motor té la y cap amunt; l'SVG, cap avall. A més, es gira el desplegament perquè la
        // primera cara després de la de l'aranya quedi a la dreta: així el cartró creix d'esquerra a dreta.
        let gir = 0;
        if (seq.length >= 2) {
            const c0 = mitjana(D.poligons[0]),
                c1 = mitjana(D.poligons[1]);
            gir = Math.round(Math.atan2(c1[1] - c0[1], c1[0] - c0[0]) / (Math.PI / 2)) * 90;
        }
        const k = (((-gir / 90) % 4) + 4) % 4;
        const aPla = p => {
            const q = [[p[0], p[1]], [-p[1], p[0]], [-p[0], -p[1]], [p[1], -p[0]]][k];
            return [q[0], -q[1]];
        };
        const darrera = seq[seq.length - 1];
        const fantasmes = [];
        if (!opcions.senseFantasmes && darrera !== 'B')
            ORDRE_CARES.forEach(f => {
                if (seq.includes(f) || !A.veines(darrera, f)) return;
                const Dg = A.desplega(d.sala, seq.concat([f]));
                fantasmes.push({ cara: f, poligon: Dg.poligons[Dg.poligons.length - 1], mapa: Dg.mapes[Dg.mapes.length - 1] });
            });
        const tots = D.poligons.concat(fantasmes.map(f => f.poligon)).flat().map(aPla);
        const m = opcions.marge || 3;
        const x0 = Math.min(...tots.map(p => p[0])) - m,
            y0 = Math.min(...tots.map(p => p[1])) - m,
            x1 = Math.max(...tots.map(p => p[0])) + m,
            y1 = Math.max(...tots.map(p => p[1])) + m;
        const s = C.svg('svg', {
            'class': 'tauler-svg xarxa-svg',
            'viewBox': `${x0} ${y0} ${x1 - x0} ${y1 - y0}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || 'La sala desplegada: ' + seq.map(k => NOM_CARA[k]).join(', '),
        });
        if (lloc) lloc.replaceChildren(s);
        const det = detalls(d.sala);
        const pinta = (pol, mapa, cara, classe) => {
            const g = C.svg('g', { 'class': `cara cara-${cara} ${classe}`, 'data-cara': cara }, s);
            C.svg('polygon', { class: 'fons-cara', points: pol.map(aPla).map(p => p.join(',')).join(' ') }, g);
            det[cara].forEach(o => {
                if (o.tipus === 'cercle') {
                    const c = aPla(A.projecta(mapa, o.centre));
                    C.svg('circle', { class: 'detall', cx: c[0], cy: c[1], r: o.r }, g);
                } else {
                    const pts = o.punts.map(q => aPla(A.projecta(mapa, q)).join(',')).join(' ');
                    C.svg(o.tipus === 'rect' ? 'polygon' : 'polyline', { class: 'detall', points: pts }, g);
                }
            });
            const c = pol.map(aPla).reduce((a, b) => [a[0] + b[0] / pol.length, a[1] + b[1] / pol.length], [0, 0]);
            C.svg('text', { 'class': 'nom-cara', 'x': c[0], 'y': c[1] + 1.2, 'text': (classe === 'fantasma' ? '+ ' : '') + CURT_CARA[cara] }, g);
            return g;
        };
        D.poligons.forEach((pol, i) => pinta(pol, D.mapes[i], seq[i], 'posada'));
        const elsFantasmes = fantasmes.map(f => {
            const g = pinta(f.poligon, f.mapa, f.cara, 'fantasma');
            g.setAttribute('aria-label', 'Desplega ' + NOM_CARA[f.cara]);
            return g;
        });
        // L'aranya, la mosca i el camí
        const S = aPla(A.projecta(D.mapes[0], d.aranya));
        let resultat = null;
        if (darrera === 'B') {
            resultat = A.cami(d.sala, seq, d.aranya, d.mosca);
            const F = aPla(A.projecta(D.mapes[seq.length - 1], d.mosca));
            C.svg('line', { class: 'cami-pla ' + (resultat.valid ? 'valid' : 'fora'), x1: S[0], y1: S[1], x2: F[0], y2: F[1] }, s);
            mosca(s, F[0], F[1], 0.42);
            const mig = [(S[0] + F[0]) / 2, (S[1] + F[1]) / 2];
            const t = C.svg('text', { 'class': 'longitud ' + (resultat.valid ? 'valid' : 'fora'), 'x': mig[0], 'y': mig[1] - 1.4 }, s);
            t.textContent = resultat.valid ? C.mesura(resultat.longitud) + ' peus' : 'surt del cartró';
        }
        aranya(s, S[0], S[1], 0.42);
        return { svg: s, fantasmes: elsFantasmes, resultat, D };
    }

    function figuraSala(p) {
        const S = dibuixaSala(p.dades, { etiqueta: 'La sala de 30 × 12 × 12 peus, amb l’aranya a A i la mosca a B' });
        S.marca([], null);
        return S.svg;
    }

    function creaCaixa(lloc, p, ctx) {
        const d = p.dades;
        let seq;
        const hist = C.historial(x => x.slice());
        const caixa = C.el('div', { class: 'tauler capsa' });
        const sala = dibuixaSala(d);
        const llocXarxa = C.el('div', { class: 'lloc-xarxa' });
        const botons = C.el('div', { 'class': 'eines-tauler botons-cares', 'role': 'group', 'aria-label': 'Cares que pots desplegar' });
        caixa.append(C.el('div', { class: 'vista-sala' }, sala.svg), llocXarxa, botons);
        lloc.appendChild(caixa);
        caixa.addEventListener('keydown', e => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        });

        function inicia() {
            seq = ['A'];
            hist.buida();
            pinta();
        }
        function afegeix(f) {
            hist.desa(seq);
            seq = seq.concat([f]);
            pinta(true);
        }
        function desfes() {
            const ant = hist.desfes();
            if (!ant) return;
            seq = ant;
            pinta();
        }
        function pinta(revisa) {
            ctx.amaga();
            const X = dibuixaXarxa(llocXarxa, d, seq);
            X.fantasmes.forEach(g => {
                g.setAttribute('tabindex', '0');
                g.setAttribute('role', 'button');
                g.addEventListener('click', () => afegeix(g.dataset.cara));
                g.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        afegeix(g.dataset.cara);
                    }
                });
            });
            botons.replaceChildren(
                ...X.fantasmes.map(g => {
                    const f = g.dataset.cara;
                    const b = C.el('button', { 'type': 'button', 'class': 'btn-sec boto-cara cara-' + f });
                    b.append(C.el('span', { 'class': 'mostra-cara', 'aria-hidden': 'true' }), 'Desplega ' + NOM_CARA[f]);
                    b.addEventListener('click', () => afegeix(f));
                    return b;
                })
            );
            const r = X.resultat;
            sala.marca(seq, r && r.valid ? r.espai : null);
            ctx.estat([
                C.el('span', null, 'Cares: ', C.el('b', { text: seq.map(k => CURT_CARA[k]).join(', ') })),
                r ? C.el('span', null, 'Camí: ', C.el('b', { text: r.valid ? C.mesura(r.longitud) + ' peus' : 'no val' })) : null,
            ]);
            ctx.desfes(hist.mida > 0);
            if (!revisa || !r) return;
            if (!r.valid)
                ctx.missatge('error', 'Aquest camí no val', [
                    'Amb aquest desplegament, la recta surt del cartró: l’aranya hauria de caminar per l’aire. Fes enrere i prova unes altres cares.',
                ]);
            else if (Math.abs(r.longitud - d.minim) < 1e-9)
                ctx.resolt('40 peus: el camí més curt!', ['L’aranya passa per cinc de les sis cares de la sala.']);
            else
                ctx.missatge('info', `Un camí de ${C.mesura(r.longitud)} peus`, [
                    'L’aranya arriba a la mosca, però hi ha camins més curts. Prova un altre desplegament.',
                ]);
        }
        inicia();
        return {
            reinicia: inicia,
            desfes,
            textSolucio: '▶ Desplega-la al tauler',
            solucio() {
                inicia();
                return C.reprodueix(
                    d.solucio.slice(1),
                    f => {
                        hist.desa(seq);
                        seq = seq.concat([f]);
                        pinta();
                    },
                    C.movimentReduit() ? 300 : 900,
                    () => ctx.missatge('info', 'El camí de Dudeney', ['√(24² + 32²) = 40 peus.'])
                );
            },
        };
    }

    function figuraSolucioCaixa(p) {
        const fig = C.el('figure', { class: 'figura-solucio xarxes-dudeney' });
        const fila = C.el('div', { class: 'fila-diagrames' });
        p.dades.camins.forEach((seq, i) => {
            const X = dibuixaXarxa(null, p.dades, seq, { senseFantasmes: true, estatic: true, marge: 2 });
            X.svg.classList.add('xarxa-petita');
            fila.appendChild(C.el('div', { class: 'xarxa-dudeney' }, C.el('p', { class: 'num-diagrama', text: String(i + 1) }), X.svg));
        });
        fig.append(fila, C.el('figcaption', { text: 'Els quatre desplegaments de Dudeney: 42; 43,174; 40,718 i 40 peus.' }));
        return fig;
    }

    // ════════════════════════════════════════════════════════════
    // UNA RESPOSTA NUMÈRICA (comú als dos taulers de recompte)
    // preguntes: [{ etiqueta }]; comprova(valors) rep els nombres escrits (NaN si no ho són).
    // ════════════════════════════════════════════════════════════
    function formulariResposta(titol, preguntes, comprova) {
        const form = C.el('form', { class: 'resposta-recompte' });
        form.appendChild(C.el('p', { class: 'titol-resposta', html: titol }));
        const inputs = preguntes.map((q, i) => {
            const id = 'resposta-' + i + '-' + Math.random().toString(36).slice(2, 6);
            const input = C.el('input', { 'id': id, 'type': 'text', 'inputmode': 'numeric', 'autocomplete': 'off' });
            form.appendChild(C.el('label', { for: id }, C.el('span', { text: q.etiqueta }), input));
            return input;
        });
        form.appendChild(C.el('button', { type: 'submit', class: 'btn-sec', text: 'Comprova' }));
        form.addEventListener('submit', e => {
            e.preventDefault();
            comprova(inputs.map(x => parseInt(x.value.replace(/[\s. ]/g, ''), 10)));
        });
        return { form, inputs };
    }

    // ════════════════════════════════════════════════════════════
    // RECTANGLES: marcar rectangles en un tauler i comptar-los (AM 347)
    // dades: n (8), total (1296), quadrats (204).
    // ════════════════════════════════════════════════════════════
    const QR = 40;
    function dibuixaRectangles(n, opcions = {}) {
        const s = C.svg('svg', {
            'class': 'tauler-svg rectangles-svg',
            'viewBox': `-4 -4 ${n * QR + 8} ${n * QR + 8}`,
            'role': opcions.estatic ? 'img' : 'application',
            'aria-label': opcions.etiqueta || `Un tauler de ${n} × ${n}`,
        });
        for (let f = 0; f < n; f++)
            for (let c = 0; c < n; c++) C.svg('rect', { class: (f + c) % 2 ? 'cel fosca' : 'cel', x: c * QR, y: f * QR, width: QR, height: QR }, s);
        C.svg('rect', { class: 'vora-rect', x: 0, y: 0, width: n * QR, height: n * QR }, s);
        const marca = C.svg('rect', { class: 'marca-rect', x: 0, y: 0, width: 0, height: 0, rx: 3 }, s);
        const cursor = C.svg('rect', { class: 'cursor-rect', x: 0, y: 0, width: QR, height: QR }, s);
        function posa(a, b) {
            if (!a) {
                marca.setAttribute('width', 0);
                return;
            }
            const f0 = Math.min(a[0], b[0]),
                f1 = Math.max(a[0], b[0]),
                c0 = Math.min(a[1], b[1]),
                c1 = Math.max(a[1], b[1]);
            marca.setAttribute('x', c0 * QR + 2);
            marca.setAttribute('y', f0 * QR + 2);
            marca.setAttribute('width', (c1 - c0 + 1) * QR - 4);
            marca.setAttribute('height', (f1 - f0 + 1) * QR - 4);
        }
        return { svg: s, posa, cursor };
    }
    function figuraRectangles(p, opcions = {}) {
        const D = dibuixaRectangles(p.dades.n, { estatic: true, etiqueta: 'Un tauler d’escacs de 8 × 8, amb un rectangle de 3 × 2 marcat' });
        if (opcions.vinyeta || !opcions.buit) D.posa([2, 1], [3, 3]);
        D.cursor.remove();
        return D.svg;
    }

    function creaRectangles(lloc, p, ctx) {
        const d = p.dades;
        let n = d.n, D, inici = null, fi = null, cursor = [0, 0], primer = null;
        const caixa = C.el('div', { class: 'tauler rectangles' });
        const mides = C.el('div', { 'class': 'mides-tauler', 'role': 'group', 'aria-label': 'Mida del tauler' }, C.el('span', { text: 'Tauler: ' }));
        const botonsMida = [];
        for (let k = 1; k <= d.n; k++) {
            const b = C.el('button', { type: 'button', class: 'btn-mida', text: `${k} × ${k}` });
            b.addEventListener('click', () => munta(k));
            botonsMida.push(b);
            mides.appendChild(b);
        }
        const lloc2 = C.el('div', { class: 'lloc-rectangles' });
        const text = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
        const R = formulariResposta(`Al tauler d’escacs (${d.n} × ${d.n}):`, [{ etiqueta: 'rectangles en total (quadrats inclosos)' }, { etiqueta: 'quadrats' }], comprova);
        caixa.append(mides, lloc2, text, R.form);
        lloc.appendChild(caixa);

        function munta(k) {
            n = k;
            inici = fi = primer = null;
            cursor = [0, 0];
            D = dibuixaRectangles(n);
            D.svg.setAttribute('tabindex', '0');
            lloc2.replaceChildren(D.svg);
            botonsMida.forEach((b, i) => b.classList.toggle('actiu', i + 1 === n));
            const cel = e => {
                const q = C.coords(D.svg, e.clientX, e.clientY);
                return [Math.max(0, Math.min(n - 1, Math.floor(q.y / QR))), Math.max(0, Math.min(n - 1, Math.floor(q.x / QR)))];
            };
            D.svg.addEventListener('pointerdown', e => {
                e.preventDefault();
                inici = fi = cel(e);
                pinta();
                const mou = ev => {
                    fi = cel(ev);
                    pinta();
                };
                const acaba = () => {
                    document.removeEventListener('pointermove', mou);
                    document.removeEventListener('pointerup', acaba);
                };
                document.addEventListener('pointermove', mou);
                document.addEventListener('pointerup', acaba);
            });
            // Teclat: les fletxes mouen el cursor; Retorn marca una cantonada i després l'altra
            D.svg.addEventListener('keydown', e => {
                const dir = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
                if (dir) {
                    e.preventDefault();
                    cursor = [Math.max(0, Math.min(n - 1, cursor[0] + dir[0])), Math.max(0, Math.min(n - 1, cursor[1] + dir[1]))];
                    if (primer) fi = cursor;
                    pinta();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!primer) {
                        primer = cursor;
                        inici = fi = cursor;
                    } else primer = null;
                    pinta();
                }
            });
            D.svg.addEventListener('focus', () => D.svg.classList.add('amb-cursor'));
            D.svg.addEventListener('blur', () => D.svg.classList.remove('amb-cursor'));
            pinta();
        }
        function pinta() {
            D.posa(inici, fi);
            D.cursor.setAttribute('x', cursor[1] * QR);
            D.cursor.setAttribute('y', cursor[0] * QR);
            ctx.estat([C.el('span', { text: `Tauler de ${n} × ${n}` })]);
            if (!inici) {
                text.textContent = 'Arrossega el dit (o el ratolí) pel tauler per marcar un rectangle.';
                return;
            }
            const h = Math.abs(fi[0] - inici[0]) + 1,
                w = Math.abs(fi[1] - inici[1]) + 1;
            const quants = (n + 1 - h) * (n + 1 - w);
            text.textContent = `${h === w ? 'Un quadrat' : 'Un rectangle'} de ${w} × ${h}. En aquest tauler n’hi ha ${quants} com aquest (de ${w} d’ample i ${h} d’alt).`;
        }
        function comprova([t, q]) {
            ctx.amaga();
            if (Number.isNaN(t) || Number.isNaN(q)) {
                ctx.missatge('error', 'Escriu els dos nombres', ['Quants rectangles hi ha en total, i quants d’aquests són quadrats.']);
                return;
            }
            const bT = t === d.total,
                bQ = q === d.quadrats;
            if (bT && bQ) ctx.resolt(`${C.nombre(d.total)} rectangles i ${d.quadrats} quadrats!`, [`I ${C.nombre(d.total)} = 36², el quadrat de 1 + 2 + … + 8.`]);
            else if (bT) ctx.missatge('info', 'El total és correcte', ['Però els quadrats no: compta’ls mida per mida.']);
            else if (bQ) ctx.missatge('info', 'Els quadrats són correctes', ['Però el total de rectangles no: compta també els que no són quadrats.']);
            else ctx.missatge('error', 'Encara no', ['Prova-ho primer amb taulers petits: el de 2 × 2 té 9 rectangles, i 5 són quadrats.']);
        }
        munta(d.n);
        return {
            reinicia: () => {
                R.inputs.forEach(x => (x.value = ''));
                munta(d.n);
            },
            textSolucio: '▶ Escriu-la',
            solucio() {
                R.inputs[0].value = d.total;
                R.inputs[1].value = d.quadrats;
                ctx.missatge('info', 'La solució de Dudeney', [`${C.nombre(d.total)} rectangles, dels quals ${d.quadrats} són quadrats.`]);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // AMULET: llegir ABRACADABRA baixant pel triangle de lletres (CP 38)
    // dades: paraula ('ABRACADABRA'), resposta (1024).
    // ════════════════════════════════════════════════════════════
    const DXA = 40,
        DYA = 38;
    const posAmulet = (f, i) => [(i - f / 2) * DXA, f * DYA];

    function dibuixaAmulet(d, opcions = {}) {
        const files = d.paraula.length;
        const W = (files - 1) * DXA;
        const s = C.svg('svg', {
            'class': 'tauler-svg amulet-svg',
            'viewBox': `${-W / 2 - 30} -32 ${W + 60} ${(files - 1) * DYA + 60}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || d.etiqueta,
        });
        C.svg('path', { class: 'pergami', d: `M0 -28 L${W / 2 + 26} ${(files - 1) * DYA + 22} L${-W / 2 - 26} ${(files - 1) * DYA + 22} Z` }, s);
        const cami = C.svg('polyline', { class: 'cami-amulet', points: '' }, s);
        const lletres = [];
        const comptes = opcions.comptes ? A.maneresAmulet(files) : null;
        for (let f = 0; f < files; f++) {
            lletres.push([]);
            for (let i = 0; i <= f; i++) {
                const [x, y] = posAmulet(f, i);
                const g = C.svg('g', { 'class': 'lletra-amulet', 'data-f': f, 'data-i': i }, s);
                g.style.transform = `translate(${x}px, ${y}px)`;
                C.svg('circle', { class: 'zona', r: 17 }, g);
                C.svg('text', { 'class': 'lletra', 'x': 0, 'y': 1, 'text': d.paraula[f] }, g);
                if (comptes) C.svg('text', { 'class': 'compte-amulet', 'x': 0, 'y': 17, 'text': comptes[f][i] }, g);
                lletres[f].push(g);
            }
        }
        function posa(ruta) {
            cami.setAttribute('points', ruta.map((i, f) => posAmulet(f, i).join(',')).join(' '));
            lletres.forEach((fila, f) => fila.forEach((g, i) => g.classList.toggle('al-cami', ruta[f] === i)));
        }
        return { svg: s, lletres, posa };
    }
    function figuraAmulet(p, opcions = {}) {
        const D = dibuixaAmulet(p.dades, { estatic: true, comptes: opcions.comptes, etiqueta: opcions.comptes ? p.dades.etiquetaComptes : p.dades.etiqueta });
        D.posa([]);
        return D.svg;
    }

    function creaAmulet(lloc, p, ctx) {
        const d = p.dades;
        const files = d.paraula.length;
        let ruta, trobats, reproduccio;
        const caixa = C.el('div', { class: 'tauler amulet' });
        const D = dibuixaAmulet(d);
        D.svg.setAttribute('tabindex', '0');
        const text = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
        const R = formulariResposta('De quantes maneres es pot llegir la paraula?', [{ etiqueta: 'maneres' }], comprova);
        caixa.append(D.svg, text, R.form);
        lloc.appendChild(caixa);

        const lletraA = e => {
            const g = e.target.closest && e.target.closest('.lletra-amulet');
            return g ? [+g.dataset.f, +g.dataset.i] : null;
        };
        D.svg.addEventListener('click', e => {
            const q = lletraA(e);
            if (q) toca(q[0], q[1]);
        });
        D.svg.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                if (ruta.length >= files) ruta = [0];
                const i = ruta[ruta.length - 1];
                toca(ruta.length, e.key === 'ArrowRight' ? i + 1 : i);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                if (ruta.length > 1) {
                    ruta = ruta.slice(0, -1);
                    pinta();
                }
            }
        });

        function inicia() {
            atura();
            ruta = [0];
            trobats = new Set();
            pinta();
        }
        function toca(f, i) {
            atura();
            ctx.amaga();
            // tornar a una lletra de la ruta: la ruta s'escurça fins allà
            if (f < ruta.length && ruta[f] === i) {
                ruta = ruta.slice(0, f + 1);
                pinta();
                return;
            }
            if (ruta.length >= files) ruta = [0];
            if (f !== ruta.length || !A.baixaAmulet(ruta[ruta.length - 1], i)) {
                ctx.missatge('error', 'Per aquí no', [`Des d’aquesta ${d.paraula[ruta.length - 1]} només pots baixar a una de les dues lletres que té just a sota, a l’esquerra o a la dreta.`]);
                return;
            }
            ruta = ruta.concat([i]);
            if (ruta.length === files) {
                const k = ruta.join(',');
                if (trobats.has(k)) ctx.missatge('info', 'Aquest camí ja el tenies', ['Prova’n un altre.']);
                else {
                    trobats.add(k);
                    ctx.missatge('info', `Un camí nou: ja en tens ${trobats.size}`, ['Toca la A de dalt (o qualsevol lletra de la segona fila) per començar-ne un altre.']);
                }
            }
            pinta();
        }
        function pinta() {
            D.posa(ruta);
            ctx.estat([C.el('span', null, 'Camins diferents trobats: ', C.el('b', { text: trobats.size }))]);
            text.textContent = 'Camí: ' + ruta.map((_, f) => d.paraula[f]).join('') + (ruta.length < files ? '…' : '');
        }
        function comprova([x]) {
            if (Number.isNaN(x)) {
                ctx.missatge('error', 'Escriu un nombre', []);
                return;
            }
            if (x === d.resposta) ctx.resolt(`${C.nombre(x)} maneres!`, ['2 × 2 × … × 2, deu vegades: 2¹⁰ = 1024.']);
            else ctx.missatge('error', `${C.nombre(x)} no`, [x < d.resposta ? 'N’hi ha més. Compta de quantes maneres es pot arribar a cada lletra, fila per fila.' : 'N’hi ha menys.']);
        }
        function atura() {
            if (reproduccio) reproduccio.atura();
            reproduccio = null;
        }
        inicia();
        return {
            reinicia: () => {
                R.inputs[0].value = '';
                inicia();
            },
            textSolucio: '▶ Mira com es compta',
            solucio() {
                inicia();
                // un camí: sempre a l'esquerra, i després sempre a la dreta; i el compte
                reproduccio = C.reprodueix(
                    Array.from({ length: files - 1 }, (_, k) => (k < 5 ? 0 : k - 4)),
                    i => {
                        ruta = ruta.concat([i]);
                        pinta();
                    },
                    C.movimentReduit() ? 150 : 350,
                    () => ctx.missatge('info', 'Així ho compta Sir Hugh', ['A cada pas hi ha dues maneres de seguir: 2¹⁰ = 1024.'])
                );
                return reproduccio;
            },
        };
    }

    window.Taulers.estripat = {
        crea: creaEstripat,
        figura: figuraEtiqueta,
    };
    window.Taulers.caixa = {
        crea: creaCaixa,
        figura: figuraSala,
        figuraSolucio: figuraSolucioCaixa,
        dibuixaXarxa,
    };
    window.Taulers.rectangles = { crea: creaRectangles, figura: figuraRectangles };
    window.Taulers.amulet = {
        crea: creaAmulet,
        figura: figuraAmulet,
        figuraSolucio: p => {
            const svg = figuraAmulet(p, { comptes: true });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg, C.el('figcaption', { text: p.dades.peuSolucio }));
        },
    };
})();
