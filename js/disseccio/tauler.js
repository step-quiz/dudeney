/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/disseccio/tauler.js
 * ROL: Els taulers de dissecció:
 *   - Taulers.lliure (CP 26, el mercer): les quatre peces del triangle es
 *     mouen arrossegant-les (o tocant-les i després el lloc) i giren de 90° en
 *     90° (botó Gira, doble toc o R). S'enganxen quan són a prop d'una posició
 *     de la solució dins del quadrat de punts. A la solució: la construcció de
 *     Dudeney i la cadena de frontisses (un control lliscant la plega).
 *   - Taulers.quadricula (AM 174, el brocat): peces de quadrets que es mouen
 *     sense girar i s'enganxen a la quadrícula; el dibuix (flors alternades)
 *     ha de casar al quadrat de 10 × 10.
 * ARQUITECTURA: window.Taulers.lliure / .quadricula = { crea, figura, figuraSolucio }.
 *   Mercer: coordenades del motor amb la y cap amunt; a l'SVG es dibuixa (x, −y).
 *   Brocat: unitats de quadret (Q px a l'SVG), fila 0 a dalt.
 * DEPENDÈNCIES: js/comu/comu.js, js/disseccio/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const M = window.MotorDisseccio;

    const punts = p => p.map(q => `${q[0].toFixed(4)},${(-q[1]).toFixed(4)}`).join(' ');

    // ════════════════════════════════════════════════════════════
    // EL MERCER: peces lliures
    // ════════════════════════════════════════════════════════════
    function geometria(d) {
        const peces = d.peces.map(p => p.vertexs.map(v => d.punts[v]));
        const centres = peces.map(M.centre);
        const Q = d.quadrat.reduce((a, b) => [a[0] + b[0] / 4, a[1] + b[1] / 4], [0, 0]);
        const vars = M.variants(peces, d.solucio, Q);
        const triangle = [d.punts.A, d.punts.C, d.punts.B];
        return { peces, centres, vars, triangle, Q };
    }
    /** On va el quadrat (desplaçament O) i la capsa de l'SVG, segons si hi ha lloc al costat o a sota. */
    function disposicio(G, d, ample) {
        const O = ample ? [6.75, -0.95] : [0, -7.5];
        const quadrat = d.quadrat.map(p => [p[0] + O[0], p[1] + O[1]]);
        const tots = G.triangle.concat(quadrat);
        const m = 0.55;
        const x0 = Math.min(...tots.map(p => p[0])) - m,
            x1 = Math.max(...tots.map(p => p[0])) + m;
        const y0 = Math.min(...tots.map(p => p[1])) - m,
            y1 = Math.max(...tots.map(p => p[1])) + m;
        return { O, quadrat, viewBox: `${x0} ${-y1} ${x1 - x0} ${y1 - y0}` };
    }

    function defsTela(s) {
        const defs = C.svg('defs', null, s);
        const pat = C.svg('pattern', { id: 'teixit', patternUnits: 'userSpaceOnUse', width: 0.16, height: 0.16, patternTransform: 'rotate(35)' }, defs);
        C.svg('line', { class: 'fil', x1: 0, y1: 0, x2: 0, y2: 0.16 }, pat);
        return defs;
    }
    function dibuixaPeca(capa, nom, i) {
        const g = C.svg('g', { 'class': 'peca-tela p' + (i + 1), 'data-i': i }, capa);
        const cos = C.svg('polygon', { class: 'cos-peca' }, g);
        const teixit = C.svg('polygon', { class: 'teixit-peca', fill: 'url(#teixit)' }, g);
        const etiqueta = C.svg('text', { 'class': 'num-peca', 'text': nom }, g);
        return {
            g,
            posa(pts, c) {
                cos.setAttribute('points', punts(pts));
                teixit.setAttribute('points', punts(pts));
                etiqueta.setAttribute('x', c[0].toFixed(3));
                etiqueta.setAttribute('y', (-c[1]).toFixed(3));
            },
        };
    }

    function figuraMercer(p, opcions = {}) {
        const d = p.dades;
        const G = geometria(d);
        const s = C.svg('svg', { 'class': 'tauler-svg mercer-svg figura', 'viewBox': '-0.4 -5.6 6.8 6', 'role': 'img', 'aria-label': 'El tros de roba: un triangle equilàter' });
        defsTela(s);
        if (opcions.peces || opcions.vinyeta) {
            const capa = C.svg('g', null, s);
            G.peces.forEach((pts, i) => dibuixaPeca(capa, d.peces[i].nom, i).posa(pts, G.centres[i]));
        } else {
            C.svg('polygon', { class: 'roba-sencera', points: punts(G.triangle) }, s);
            C.svg('polygon', { class: 'teixit-peca', points: punts(G.triangle), fill: 'url(#teixit)' }, s);
        }
        return s;
    }

    function creaLliure(lloc, p, ctx) {
        const d = p.dades;
        const G = geometria(d);
        let D, poses, encaix, triada, darrerToc = { i: -1, t: 0 }, ample;
        const caixa = C.el('div', { class: 'tauler mercer' });
        const s = C.svg('svg', { 'class': 'tauler-svg mercer-svg', 'role': 'group', 'aria-label': 'Les quatre peces i el quadrat de punts' });
        defsTela(s);
        const fons = C.svg('g', null, s);
        const capa = C.svg('g', { class: 'peces-tela' }, s);
        const eines = C.el('div', { class: 'eines-tauler' });
        const gira = C.el('button', { 'type': 'button', 'class': 'btn-sec', 'text': '↻ Gira', 'aria-label': 'Gira la peça triada 90°', 'disabled': true });
        eines.append(gira);
        caixa.append(s, eines);
        lloc.appendChild(caixa);
        const peces = d.peces.map((q, i) => dibuixaPeca(capa, q.nom, i));
        peces.forEach((pc, i) => {
            pc.g.setAttribute('tabindex', '0');
            pc.g.setAttribute('role', 'button');
            pc.g.addEventListener('keydown', e => tecla(e, i));
            pc.g.addEventListener('focus', () => {
                triada = i;
                pinta();
            });
        });
        gira.addEventListener('click', () => {
            if (triada !== null) giraPeca(triada);
        });

        function munta() {
            ample = lloc.clientWidth >= 540;
            D = disposicio(G, d, ample);
            s.setAttribute('viewBox', D.viewBox);
            fons.replaceChildren();
            C.svg('polygon', { class: 'lloc-triangle', points: punts(G.triangle) }, fons);
            C.svg('polygon', { class: 'lloc-quadrat', points: punts(D.quadrat) }, fons);
            const cq = D.quadrat.reduce((a, b) => [a[0] + b[0] / 4, a[1] + b[1] / 4], [0, 0]);
            C.svg('text', { 'class': 'etiqueta-lloc', 'x': cq[0], 'y': -cq[1], 'text': 'quadrat' }, fons);
        }
        const objectius = () => G.vars.map(v => v.map(o => ({ g: o.g, x: o.x + D.O[0], y: o.y + D.O[1] })));
        const pts = i => M.aplica(G.peces[i], poses[i], G.centres[i]);
        const centre = i => [G.centres[i][0] + poses[i].x, G.centres[i][1] + poses[i].y];

        function inicia() {
            munta();
            poses = G.peces.map(() => ({ g: 0, x: 0, y: 0 }));
            encaix = G.peces.map(() => null);
            triada = null;
            pinta();
            ctx.amaga();
        }
        function pinta() {
            peces.forEach((pc, i) => {
                pc.posa(pts(i), centre(i));
                pc.g.classList.toggle('triada', triada === i);
                pc.g.classList.toggle('encaixada', encaix[i] !== null);
                pc.g.setAttribute('aria-label', `Peça ${d.peces[i].nom}${encaix[i] !== null ? ', encaixada al quadrat' : ''}, girada ${poses[i].g}°`);
            });
            gira.disabled = triada === null;
            const n = encaix.filter(x => x !== null).length;
            ctx.estat([C.el('span', null, 'Peces al quadrat: ', C.el('b', { text: `${n} de ${G.peces.length}` }))]);
        }
        /** Mou suaument la peça i fins a la posició nova. */
        function anima(i, nova, despres) {
            const ini = Object.assign({}, poses[i]);
            if (C.movimentReduit()) {
                poses[i] = nova;
                pinta();
                if (despres) despres();
                return;
            }
            const t0 = performance.now(),
                dur = 200;
            const pas = t => {
                const k = Math.min(1, (t - t0) / dur),
                    e = 1 - Math.pow(1 - k, 3);
                poses[i] = { g: ini.g + (nova.g - ini.g) * e, x: ini.x + (nova.x - ini.x) * e, y: ini.y + (nova.y - ini.y) * e };
                pinta();
                if (k < 1) requestAnimationFrame(pas);
                else {
                    poses[i] = nova;
                    pinta();
                    if (despres) despres();
                }
            };
            requestAnimationFrame(pas);
        }
        function provaEncaix(i) {
            const e = M.encaix(i, poses[i], objectius(), 0.5);
            encaix[i] = e ? e.variant : null;
            if (e) anima(i, { g: e.g, x: e.x, y: e.y }, revisa);
            else {
                pinta();
                revisa();
            }
        }
        function giraPeca(i) {
            ctx.amaga();
            const g0 = poses[i].g;
            const nova = Object.assign({}, poses[i], { g: g0 + 90 });
            encaix[i] = null;
            anima(i, nova, () => {
                poses[i].g = (((poses[i].g % 360) + 360) % 360);
                provaEncaix(i);
            });
        }
        function revisa() {
            if (encaix.some(x => x === null)) return;
            const poligons = G.peces.map((q, i) => pts(i));
            const cob = M.cobertura(poligons, D.quadrat, 140);
            if (cob.forats < 0.004 && cob.doble < 0.004 && cob.fora < 0.004) {
                triada = null;
                pinta();
                ctx.resolt('Quadrat perfecte!', ['Les quatre peces del triangle omplen el quadrat, sense girar-ne cap del revés.']);
            } else
                ctx.missatge('error', 'Encara no és el quadrat', [
                    'Totes les peces són dins, però unes es tapen i queden forats. Prova un altre lloc per a alguna peça.',
                ]);
        }

        // Arrossegar, tocar i doble toc
        C.arrossega(s, {
            inici: e => {
                const g = e.target.closest('.peca-tela');
                if (!g) {
                    // un toc en un lloc buit: hi porta la peça triada
                    return triada !== null ? { buit: true } : null;
                }
                const i = +g.dataset.i;
                const q = C.coords(s, e.clientX, e.clientY);
                return { i, dx: q.x - poses[i].x, dy: -q.y - poses[i].y };
            },
            comenca: c => {
                if (c.buit) return;
                ctx.amaga();
                triada = c.i;
                encaix[c.i] = null;
                capa.appendChild(peces[c.i].g); // a sobre de les altres
                peces[c.i].g.classList.add('arrossegada');
            },
            mou: (c, e) => {
                if (c.buit) return;
                const q = C.coords(s, e.clientX, e.clientY);
                poses[c.i] = { g: poses[c.i].g, x: q.x - c.dx, y: -q.y - c.dy };
                pinta();
            },
            deixa: c => {
                if (c.buit) return;
                peces[c.i].g.classList.remove('arrossegada');
                provaEncaix(c.i);
            },
            toc: (c, e) => {
                if (c.buit) {
                    const q = C.coords(s, e.clientX, e.clientY);
                    const i = triada;
                    const cc = G.centres[i];
                    poses[i] = { g: poses[i].g, x: q.x - cc[0], y: -q.y - cc[1] };
                    encaix[i] = null;
                    provaEncaix(i);
                    return;
                }
                const ara = performance.now();
                if (darrerToc.i === c.i && ara - darrerToc.t < 420) {
                    darrerToc = { i: -1, t: 0 };
                    giraPeca(c.i);
                    return;
                }
                darrerToc = { i: c.i, t: ara };
                triada = c.i;
                capa.appendChild(peces[c.i].g);
                pinta();
            },
        });

        function tecla(e, i) {
            const pas = e.shiftKey ? 0.05 : 0.2;
            const mou = { ArrowUp: [0, pas], ArrowDown: [0, -pas], ArrowLeft: [-pas, 0], ArrowRight: [pas, 0] }[e.key];
            if (mou) {
                poses[i] = { g: poses[i].g, x: poses[i].x + mou[0], y: poses[i].y + mou[1] };
                encaix[i] = null;
                provaEncaix(i);
            } else if (e.key === 'r' || e.key === 'R') giraPeca(i);
            else if (e.key === 'Escape') {
                encaix[i] = null;
                anima(i, { g: 0, x: 0, y: 0 }, () => pinta());
            } else return;
            e.preventDefault();
        }

        // Si la finestra canvia d'amplada i el quadrat ha d'anar a un altre lloc, es torna a muntar
        let temps = null;
        const enRedimensionar = () => {
            clearTimeout(temps);
            temps = setTimeout(() => {
                if (!caixa.isConnected) {
                    window.removeEventListener('resize', enRedimensionar);
                    return;
                }
                if (lloc.clientWidth >= 540 !== ample) {
                    const O0 = D.O;
                    munta();
                    encaix.forEach((k, i) => {
                        if (k !== null) poses[i] = { g: poses[i].g, x: poses[i].x - O0[0] + D.O[0], y: poses[i].y - O0[1] + D.O[1] };
                    });
                    pinta();
                }
            }, 150);
        };
        window.addEventListener('resize', enRedimensionar);

        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Munta-la al tauler',
            solucio() {
                ctx.amaga();
                const obj = objectius()[0];
                obj.forEach((o, i) => {
                    setTimeout(() => {
                        encaix[i] = 0;
                        anima(i, o, () => pinta());
                    }, i * 260);
                });
                setTimeout(() => ctx.missatge('info', 'El quadrat de Dudeney', ['La peça 1 no es mou; la 2 i la 3 fan mitja volta; la 4 només es desplaça.']), 1300);
            },
        };
    }

    // ---- La solució: la construcció i la cadena de frontisses ----
    function figuraConstruccio(d) {
        const P = d.punts;
        const s = C.svg('svg', { 'class': 'tauler-svg construccio-svg', 'viewBox': '-0.6 -6.9 8.4 7.6', 'role': 'img', 'aria-label': 'La construcció de Dudeney: els punts A a M i les línies de tall' });
        const G = geometria(d);
        const pol = (q, classe) => C.svg('polygon', { class: classe, points: punts(q) }, s);
        const lin = (a, b, classe) => C.svg('line', { 'class': classe, 'x1': a[0], 'y1': -a[1], 'x2': b[0], 'y2': -b[1] }, s);
        pol(G.triangle, 'triangle-construccio');
        // l'arc AHF (semicircumferència de diàmetre AF) i l'arc HJ (centre E, radi EH)
        const r = Math.hypot(P.F[0] - P.A[0], P.F[1] - P.A[1]) / 2;
        C.svg('path', { class: 'arc-construccio', d: `M${P.A[0]} ${-P.A[1]} A${r} ${r} 0 0 1 ${P.F[0]} ${-P.F[1]}` }, s);
        const rEH = Math.hypot(P.H[0] - P.E[0], P.H[1] - P.E[1]);
        C.svg('path', { class: 'arc-construccio', d: `M${P.H[0]} ${-P.H[1]} A${rEH} ${rEH} 0 0 0 ${P.J[0]} ${-P.J[1]}` }, s);
        lin(P.A, P.F, 'linia-construccio');
        lin(P.E, P.H, 'linia-construccio');
        // els talls
        lin(P.E, P.J, 'tall');
        lin(P.D, P.L, 'tall');
        lin(P.K, P.M, 'tall');
        // els números de les peces
        G.peces.forEach((q, i) => {
            const c = G.centres[i];
            C.svg('text', { 'class': 'num-peca petit', 'x': c[0], 'y': -c[1], 'text': d.peces[i].nom }, s);
        });
        const desp = { A: [-0.32, -0.22], B: [0.12, 0.3], C: [0.22, -0.25], D: [-0.38, 0.05], E: [0.3, 0.12], F: [0.25, 0], G: [0.1, -0.35], H: [-0.1, 0.32], J: [-0.05, -0.38], K: [0.08, -0.38], L: [0.1, -0.34], M: [0.28, 0.1] };
        Object.keys(P).forEach(k => {
            const q = P[k];
            C.svg('circle', { class: 'punt-construccio', cx: q[0], cy: -q[1], r: 0.06 }, s);
            C.svg('text', { 'class': 'lletra-construccio', 'x': q[0] + desp[k][0], 'y': -q[1] - desp[k][1] + 0.1, 'text': k }, s);
        });
        return s;
    }

    function cadenaFrontisses(d) {
        const G = geometria(d);
        const fr = d.frontisses.map(f => Object.assign({}, f, { punt: d.punts[f.punt] }));
        const caixa = C.el('div', { class: 'frontisses' });
        // la capsa: el triangle i el quadrat (s = 0 i s = 1)
        const tots = [];
        [0, 0.25, 0.5, 0.75, 1].forEach(t => {
            const mov = M.cadena(4, fr, t);
            G.peces.forEach((q, i) => M.mou(q, mov[i]).forEach(pp => tots.push(pp)));
        });
        const m = 0.4;
        const x0 = Math.min(...tots.map(q => q[0])) - m,
            x1 = Math.max(...tots.map(q => q[0])) + m,
            y0 = Math.min(...tots.map(q => q[1])) - m,
            y1 = Math.max(...tots.map(q => q[1])) + m;
        const s = C.svg('svg', { 'class': 'tauler-svg frontisses-svg', 'viewBox': `${x0} ${-y1} ${x1 - x0} ${y1 - y0}`, 'role': 'img', 'aria-label': 'La cadena de frontisses de Dudeney' });
        defsTela(s);
        const capa = C.svg('g', null, s);
        const pcs = d.peces.map((q, i) => dibuixaPeca(capa, q.nom, i));
        const nusos = fr.map(() => C.svg('circle', { class: 'frontissa', r: 0.11 }, s));
        const control = C.el('input', { 'type': 'range', 'min': 0, 'max': 1000, 'value': 0, 'aria-label': 'Plega la cadena: del triangle al quadrat' });
        const boto = C.el('button', { type: 'button', class: 'btn-sec', text: '▶ Plega i desplega' });
        const fila = C.el('div', { class: 'fila-frontisses' }, C.el('span', { text: 'triangle' }), control, C.el('span', { text: 'quadrat' }));
        caixa.append(s, fila, C.el('div', { class: 'eines-tauler' }, boto));
        function posa(t) {
            const mov = M.cadena(4, fr, t);
            G.peces.forEach((q, i) => pcs[i].posa(M.mou(q, mov[i]), M.mou([G.centres[i]], mov[i])[0]));
            fr.forEach((f, k) => {
                const q = M.mou([f.punt], mov[f.pare])[0];
                nusos[k].setAttribute('cx', q[0]);
                nusos[k].setAttribute('cy', -q[1]);
            });
        }
        control.addEventListener('input', () => {
            atura();
            posa(control.value / 1000);
        });
        let anim = null;
        function atura() {
            if (anim) cancelAnimationFrame(anim);
            anim = null;
            boto.textContent = '▶ Plega i desplega';
        }
        boto.addEventListener('click', () => {
            if (anim) {
                atura();
                return;
            }
            boto.textContent = '❚❚ Atura';
            let t0 = null;
            const inici = control.value / 1000;
            const pas = t => {
                if (t0 === null) t0 = t;
                // va i torna en 5 segons, començant on és el control
                const fase = ((t - t0) / 5000 + inici / 2) % 1;
                const v = fase < 0.5 ? fase * 2 : 2 - fase * 2;
                const suau = v * v * (3 - 2 * v);
                control.value = Math.round(suau * 1000);
                posa(suau);
                if (!caixa.isConnected) return atura();
                anim = requestAnimationFrame(pas);
            };
            anim = requestAnimationFrame(pas);
        });
        posa(0);
        return caixa;
    }

    function figuraSolucioMercer(p) {
        const fig = C.el('figure', { class: 'figura-solucio solucio-mercer' });
        const fila = C.el('div', { class: 'fila-diagrames' });
        const c = figuraConstruccio(p.dades);
        c.classList.add('figura-estatica');
        fila.append(C.el('div', { class: 'diagrama' }, c), C.el('div', { class: 'diagrama' }, cadenaFrontisses(p.dades)));
        fig.append(fila, C.el('figcaption', { text: 'A l’esquerra, la construcció de Dudeney (els talls són les línies gruixudes). A la dreta, la cadena de caoba amb frontisses de llautó: fes córrer el control.' }));
        return fig;
    }

    // ════════════════════════════════════════════════════════════
    // EL BROCAT: peces de quadrícula
    // ════════════════════════════════════════════════════════════
    const QB = 30; // px per quadret a l'SVG

    /** Les cel·les de cada peça (al seu quadrat original) i les vores del contorn. */
    function cellesPeca(pc) {
        const out = [];
        pc.rects.forEach(([f, c, h, w]) => {
            for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) out.push([f + i, c + j]);
        });
        return out;
    }
    function contorn(celles) {
        const hi = new Set(celles.map(q => q[0] + ',' + q[1]));
        let d = '';
        celles.forEach(([f, c]) => {
            const x = c * QB,
                y = f * QB;
            if (!hi.has(f - 1 + ',' + c)) d += `M${x} ${y}h${QB}`;
            if (!hi.has(f + 1 + ',' + c)) d += `M${x} ${y + QB}h${QB}`;
            if (!hi.has(f + ',' + (c - 1))) d += `M${x} ${y}v${QB}`;
            if (!hi.has(f + ',' + (c + 1))) d += `M${x + QB} ${y}v${QB}`;
        });
        return d;
    }
    function defsBrocat(s) {
        const defs = C.svg('defs', null, s);
        // Una flor amb tija, una mica de biaix (no és simètrica: girada, es veuria malament)
        const flor = C.svg('symbol', { id: 'flor-brocat', viewBox: '-15 -15 30 30' }, defs);
        C.svg('path', { class: 'tija', d: 'M1 3 Q4 9 9 11' }, flor);
        C.svg('path', { class: 'fulla', d: 'M5 8 Q9 4 11 7 Q8 10 5 8 Z' }, flor);
        [0, 72, 144, 216, 288].forEach(a => {
            const pe = C.svg('ellipse', { class: 'petal', cx: 0, cy: -5.2, rx: 3.3, ry: 4.6 }, flor);
            pe.setAttribute('transform', `rotate(${a - 12})`);
        });
        C.svg('circle', { class: 'cor-flor', cx: 0, cy: 0, r: 2.4 }, flor);
        return defs;
    }
    function dibuixaPecaBrocat(capa, pc, i, opcions = {}) {
        const celles = cellesPeca(pc);
        const g = C.svg('g', { 'class': 'peca-brocat b' + (i + 1), 'data-i': i }, capa);
        const roba = C.svg('g', { class: 'roba' }, g);
        celles.forEach(([f, c]) => {
            C.svg('rect', { class: 'quadret', x: c * QB, y: f * QB, width: QB, height: QB }, roba);
            if (M.flor(f, c)) C.svg('use', { href: '#flor-brocat', x: c * QB + 2, y: f * QB + 2, width: QB - 4, height: QB - 4 }, roba);
        });
        C.svg('path', { class: 'contorn-peca', d: contorn(celles) }, g);
        // la lletra, al quadret més gran del mig
        const mig = celles.slice().sort((a, b) => Math.hypot(a[0] - 2.5, a[1] - 2.5) - Math.hypot(b[0] - 2.5, b[1] - 2.5))[0];
        if (!opcions.senseLletra)
            C.svg('text', { 'class': 'lletra-peca', 'x': mig[1] * QB + QB / 2, 'y': mig[0] * QB + QB / 2, 'text': pc.nom }, g);
        return { g, celles };
    }

    /** On van els quadrats originals i el de 10 × 10, en quadrets. */
    function disposicioBrocat(d, ample) {
        if (ample)
            return {
                quadrats: [[0, 0], [9, 1]],
                objectiu: [2, 10],
                mida: [15, 20],
            };
        return { quadrats: [[0, 0], [1, 9]], objectiu: [9, 2], mida: [19, 15] };
    }

    function figuraBrocat(p, opcions = {}) {
        const d = p.dades;
        const s = C.svg('svg', { 'class': 'tauler-svg brocat-svg figura', 'role': 'img' });
        defsBrocat(s);
        const capa = C.svg('g', null, s);
        if (opcions.solucio) {
            s.setAttribute('viewBox', `-4 -4 ${10 * QB + 8} ${10 * QB + 8}`);
            s.setAttribute('aria-label', 'Diagrama 1: les quatre peces formen el quadrat de 10 × 10');
            d.peces.forEach((pc, i) => {
                const P = dibuixaPecaBrocat(capa, pc, i);
                const t = d.solucio[i]; // del quadrat original al de 10 × 10
                P.g.style.transform = `translate(${t[1] * QB}px, ${t[0] * QB}px)`;
            });
        } else {
            // els dos quadrats sencers (o tallats, si opcions.tallats)
            s.setAttribute('viewBox', `-4 -4 ${15 * QB + 8} ${8 * QB + 8}`);
            s.setAttribute('aria-label', opcions.tallats ? 'Diagrames 2 i 3: com es tallen els dos quadrats' : 'Dos quadrats de brocat, de 8 × 8 i de 6 × 6');
            d.peces.forEach((pc, i) => {
                const P = dibuixaPecaBrocat(capa, pc, i, { senseLletra: !opcions.tallats });
                if (pc.quadrat === 1) P.g.style.transform = `translate(${9 * QB}px, ${QB}px)`;
                if (!opcions.tallats) P.g.classList.add('sense-talls');
            });
            if (!opcions.tallats)
                [[0, 0, 8], [1, 9, 6]].forEach(([f, c, m]) => C.svg('rect', { class: 'vora-quadrat', x: c * QB, y: f * QB, width: m * QB, height: m * QB }, s));
        }
        return s;
    }

    function creaQuadricula(lloc, p, ctx) {
        const d = p.dades;
        let L, pos, triada, ample, grab;
        const caixa = C.el('div', { class: 'tauler brocat' });
        const s = C.svg('svg', { 'class': 'tauler-svg brocat-svg', 'role': 'group', 'aria-label': 'Les quatre peces de brocat i el quadrat de 10 × 10' });
        defsBrocat(s);
        const fons = C.svg('g', null, s);
        const capa = C.svg('g', { class: 'peces-brocat' }, s);
        caixa.appendChild(s);
        lloc.appendChild(caixa);
        const P = d.peces.map((pc, i) => dibuixaPecaBrocat(capa, pc, i));
        P.forEach((pc, i) => {
            pc.g.setAttribute('tabindex', '0');
            pc.g.setAttribute('role', 'button');
            pc.g.addEventListener('keydown', e => tecla(e, i));
            pc.g.addEventListener('focus', () => {
                triada = i;
                pinta();
            });
        });
        const inicial = i => {
            const q = L.quadrats[d.peces[i].quadrat];
            return { f: q[0], c: q[1] };
        };

        function munta() {
            ample = lloc.clientWidth >= 560;
            L = disposicioBrocat(d, ample);
            s.setAttribute('viewBox', `-6 -6 ${L.mida[1] * QB + 12} ${L.mida[0] * QB + 12}`);
            fons.replaceChildren();
            d.quadrats.forEach((q, k) => {
                const [f, c] = L.quadrats[k];
                C.svg('rect', { class: 'lloc-original', x: c * QB, y: f * QB, width: q.mida * QB, height: q.mida * QB }, fons);
            });
            const [f0, c0] = L.objectiu;
            const graella = C.svg('g', { class: 'graella-objectiu' }, fons);
            for (let k = 1; k < d.objectiu; k++) {
                C.svg('line', { x1: c0 * QB, y1: (f0 + k) * QB, x2: (c0 + d.objectiu) * QB, y2: (f0 + k) * QB }, graella);
                C.svg('line', { x1: (c0 + k) * QB, y1: f0 * QB, x2: (c0 + k) * QB, y2: (f0 + d.objectiu) * QB }, graella);
            }
            C.svg('rect', { class: 'lloc-objectiu', x: c0 * QB, y: f0 * QB, width: d.objectiu * QB, height: d.objectiu * QB }, fons);
            C.svg('text', { 'class': 'etiqueta-lloc', 'x': (c0 + d.objectiu / 2) * QB, 'y': (f0 + d.objectiu / 2) * QB, 'text': '10 × 10' }, fons);
        }
        function inicia() {
            munta();
            pos = d.peces.map((pc, i) => inicial(i));
            triada = null;
            pinta();
            ctx.amaga();
        }
        function pinta() {
            P.forEach((pc, i) => {
                pc.g.style.transform = `translate(${pos[i].c * QB}px, ${pos[i].f * QB}px)`;
                pc.g.classList.toggle('triada', triada === i);
                pc.g.setAttribute('aria-label', `Peça ${d.peces[i].nom}, de ${pc.celles.length} quadrets`);
            });
            const dins = P.filter((pc, i) => dinsObjectiu(i)).length;
            ctx.estat([C.el('span', null, 'Peces dins del quadrat gran: ', C.el('b', { text: `${dins} de ${P.length}` }))]);
        }
        const absolutes = i => P[i].celles.map(([f, c]) => [f + pos[i].f, c + pos[i].c]);
        const dinsObjectiu = i =>
            absolutes(i).every(([f, c]) => f >= L.objectiu[0] && c >= L.objectiu[1] && f < L.objectiu[0] + d.objectiu && c < L.objectiu[1] + d.objectiu);
        function revisa() {
            if (!P.every((pc, i) => dinsObjectiu(i))) return;
            const peces = P.map(pc => ({ celles: pc.celles }));
            const r = M.comprovaQuadricula(peces, pos, d.objectiu, L.objectiu);
            if (!r.complet) {
                ctx.missatge('error', 'Encara no', [
                    `Queden ${C.plural(r.forats, 'quadret')} sense roba i ${C.plural(r.dobles, 'quadret')} amb dues capes.`,
                ]);
                return;
            }
            if (!r.patro) {
                ctx.missatge('error', 'El dibuix no casa', [
                    'El quadrat és ple, però en algun lloc queden dues flors juntes o dos quadrets buits seguits. Mou alguna peça un quadret.',
                ]);
                return;
            }
            triada = null;
            pinta();
            ctx.resolt('Funda de coixí feta!', ['Un quadrat de 10 × 10 amb les flors ben alternades: 64 + 36 = 100.']);
        }
        function deixa(i, f, c) {
            pos[i] = { f: Math.round(f), c: Math.round(c) };
            // que no surti del tauler
            const ab = P[i].celles;
            const fmin = -Math.min(...ab.map(q => q[0])),
                cmin = -Math.min(...ab.map(q => q[1]));
            const fmax = L.mida[0] - 1 - Math.max(...ab.map(q => q[0])),
                cmax = L.mida[1] - 1 - Math.max(...ab.map(q => q[1]));
            pos[i].f = Math.max(fmin, Math.min(fmax, pos[i].f));
            pos[i].c = Math.max(cmin, Math.min(cmax, pos[i].c));
            ctx.amaga();
            pinta();
            revisa();
        }
        C.arrossega(s, {
            inici: e => {
                const g = e.target.closest('.peca-brocat');
                const q = C.coords(s, e.clientX, e.clientY);
                if (!g) return triada !== null ? { buit: true } : null;
                const i = +g.dataset.i;
                return { i, df: q.y / QB - pos[i].f, dc: q.x / QB - pos[i].c };
            },
            comenca: c => {
                if (c.buit) return;
                triada = c.i;
                capa.appendChild(P[c.i].g);
                P[c.i].g.classList.add('arrossegada');
            },
            mou: (c, e) => {
                if (c.buit) return;
                const q = C.coords(s, e.clientX, e.clientY);
                P[c.i].g.style.transform = `translate(${(q.x / QB - c.dc) * QB}px, ${(q.y / QB - c.df) * QB}px)`;
            },
            deixa: (c, e) => {
                if (c.buit) return;
                P[c.i].g.classList.remove('arrossegada');
                const q = C.coords(s, e.clientX, e.clientY);
                deixa(c.i, q.y / QB - c.df, q.x / QB - c.dc);
            },
            toc: (c, e) => {
                const q = C.coords(s, e.clientX, e.clientY);
                if (c.buit) {
                    // el quadret que es va tocar de la peça va on es toca ara
                    deixa(triada, Math.floor(q.y / QB) - grab[0], Math.floor(q.x / QB) - grab[1]);
                    return;
                }
                triada = c.i;
                grab = [Math.floor(q.y / QB) - pos[c.i].f, Math.floor(q.x / QB) - pos[c.i].c];
                capa.appendChild(P[c.i].g);
                pinta();
            },
        });
        function tecla(e, i) {
            const mou = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
            if (mou) deixa(i, pos[i].f + mou[0], pos[i].c + mou[1]);
            else if (e.key === 'Escape') {
                pos[i] = inicial(i);
                pinta();
            } else return;
            e.preventDefault();
        }
        let temps = null;
        const enRedimensionar = () => {
            clearTimeout(temps);
            temps = setTimeout(() => {
                if (!caixa.isConnected) {
                    window.removeEventListener('resize', enRedimensionar);
                    return;
                }
                if (lloc.clientWidth >= 560 !== ample) inicia();
            }, 150);
        };
        window.addEventListener('resize', enRedimensionar);
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Munta-la al tauler',
            solucio() {
                ctx.amaga();
                d.peces.forEach((pc, i) => {
                    const t = d.solucio[i]; // la translació va del quadrat original al de 10 × 10
                    const desti = { f: L.objectiu[0] + t[0], c: L.objectiu[1] + t[1] };
                    setTimeout(() => {
                        pos[i] = desti;
                        pinta();
                    }, i * 300);
                });
                setTimeout(() => ctx.missatge('info', 'La funda de Dudeney', ['A i C tenen 20 quadrets cadascuna.']), 1400);
            },
        };
    }

    window.Taulers.lliure = {
        crea: creaLliure,
        figura: figuraMercer,
        figuraSolucio: figuraSolucioMercer,
    };
    window.Taulers.quadricula = {
        crea: creaQuadricula,
        figura: figuraBrocat,
        figuraSolucio: p => {
            const fig = C.el('figure', { class: 'figura-solucio' });
            const f1 = figuraBrocat(p, { solucio: true });
            const f2 = figuraBrocat(p, { tallats: true });
            f1.classList.add('figura-estatica');
            f2.classList.add('figura-estatica');
            fig.append(
                C.el(
                    'div',
                    { class: 'fila-diagrames' },
                    C.el('div', { class: 'diagrama' }, C.el('p', { class: 'num-diagrama', text: '1' }), f1),
                    C.el('div', { class: 'diagrama' }, C.el('p', { class: 'num-diagrama', text: '2 i 3' }), f2)
                )
            );
            return fig;
        },
    };
})();
