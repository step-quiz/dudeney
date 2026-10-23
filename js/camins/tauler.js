/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/camins/tauler.js
 * ROL: Els taulers de camins, sobre un mapa (graf) dibuixat com a les figures
 *   de Dudeney:
 *   - Taulers.carter (AM 242): l'inspector tria on comença i va d'estació en
 *     estació; els trams revisats es pinten (dos traços si s'ha passat dues
 *     vegades). Quan ha revisat les 17 línies, es diu si és el mínim (19).
 *   - Taulers.hamilton (AM 243): la ruta surt de l'1 i no pot repetir cap
 *     ciutat; s'acaba en tornar a l'1 després de passar per totes.
 *   Es toquen els punts un darrere l'altre o s'arrossega el dit per sobre;
 *   tocar el darrer punt (o «Desfés») fa enrere. Teclat: Tab + Retorn, ⌫.
 * ARQUITECTURA: window.Taulers.carter / .hamilton = { crea, figura, figuraSolucio }.
 *   Les regles són al motor (js/camins/motor.js).
 * DEPENDÈNCIES: js/comu/comu.js, js/camins/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const G = window.MotorCamins;

    /** El mapa: carreteres o línies, punts (ciutats o estacions) i les capes del recorregut. */
    function dibuixaMapa(d, estil, opcions = {}) {
        const pos = d.posicions;
        const xs = Object.values(pos).map(p => p[0]),
            ys = Object.values(pos).map(p => p[1]);
        const m = 34;
        const x0 = Math.min(...xs) - m,
            y0 = Math.min(...ys) - m,
            w = Math.max(...xs) - x0 + m,
            h = Math.max(...ys) - y0 + m;
        const s = C.svg('svg', {
            'class': `tauler-svg mapa-svg ${estil}`,
            'viewBox': `${x0} ${y0} ${w} ${h}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || 'Mapa',
        });
        if (estil === 'metro') C.svg('rect', { class: 'cartell', x: x0 + 6, y: y0 + 6, width: w - 12, height: h - 12, rx: 10 }, s);
        const carreteres = C.svg('g', { class: 'carreteres' }, s);
        d.graf.arestes.forEach(a => {
            const p = pos[a[0]],
                q = pos[a[1]];
            C.svg('line', { 'class': 'carretera', 'x1': p[0], 'y1': p[1], 'x2': q[0], 'y2': q[1], 'data-a': G.claAresta(a[0], a[1]) }, carreteres);
        });
        const recorregut = C.svg('g', { class: 'recorregut' }, s);
        const capaPunts = C.svg('g', { class: 'punts' }, s);
        const punts = {};
        d.graf.vertexs.forEach(v => {
            const [x, y] = pos[v];
            const g = C.svg('g', { 'class': 'punt', 'data-v': v }, capaPunts);
            g.style.transform = `translate(${x}px, ${y}px)`;
            C.svg('circle', { class: 'zona', r: 32 }, g);
            if (estil === 'metro') C.svg('rect', { class: 'marca', x: -19, y: -19, width: 38, height: 38, rx: 5 }, g);
            else C.svg('circle', { class: 'marca', r: 19 }, g);
            C.svg('text', { 'class': 'nom-punt', 'x': 0, 'y': 1, 'text': v }, g);
            punts[v] = g;
        });
        /** Pinta el recorregut: ruta = [v, v, …]; dobles: dibuixa un traç per cada vegada que es passa per un tram. */
        function pintaRuta(ruta, dobles) {
            recorregut.replaceChildren();
            const vegades = {},
                extrems = {};
            for (let i = 1; i < ruta.length; i++) {
                const k = G.claAresta(ruta[i - 1], ruta[i]);
                vegades[k] = (vegades[k] || 0) + 1;
                extrems[k] = [ruta[i - 1], ruta[i]].sort();
            }
            Object.keys(vegades).forEach(k => {
                const [p, q] = extrems[k].map(v => pos[v]);
                const n = dobles ? vegades[k] : 1;
                const dx = q[0] - p[0],
                    dy = q[1] - p[1],
                    l = Math.hypot(dx, dy);
                const desp = { 1: [0], 2: [-4.5, 4.5], 3: [-8, 0, 8] }[Math.min(n, 3)];
                desp.forEach(o => {
                    const ox = (-dy / l) * o,
                        oy = (dx / l) * o;
                    C.svg(
                        'line',
                        {
                            'class': 'tram' + (n > 1 ? ' repetit' : ''),
                            'x1': p[0] + ox,
                            'y1': p[1] + oy,
                            'x2': q[0] + ox,
                            'y2': q[1] + oy,
                            'data-a': k,
                        },
                        recorregut
                    );
                });
            });
            const visitats = new Set(ruta);
            Object.keys(punts).forEach(k => {
                const v = punts[k].dataset.v;
                const id = isNaN(+v) ? v : +v;
                punts[k].classList.toggle('visitat', visitats.has(id));
                punts[k].classList.toggle('actual', ruta.length > 0 && ruta[ruta.length - 1] === id);
                punts[k].classList.toggle('inici', ruta.length > 0 && ruta[0] === id);
            });
        }
        return { svg: s, punts, pintaRuta, pos };
    }

    const idDe = (g, d) => {
        const v = g.dataset.v;
        return typeof d.graf.vertexs[0] === 'number' ? +v : v;
    };

    function figuraMapa(estil) {
        return (p, opcions = {}) => {
            const D = dibuixaMapa(p.dades, estil, {
                estatic: true,
                etiqueta: estil === 'metro' ? 'El plànol del metro: dotze estacions i disset línies' : 'Les setze ciutats i les carreteres',
            });
            if (opcions.solucio) D.pintaRuta(p.dades.solucio, estil === 'metro');
            return D.svg;
        };
    }

    /** El tauler comú: estil 'metro' (carter xinès) o 'ciutats' (Hamilton). */
    function creaMapa(estil) {
        return (lloc, p, ctx) => {
            const d = p.dades;
            const hamilton = estil === 'ciutats';
            let ruta, acabat;
            const hist = C.historial(x => x.slice());
            const caixa = C.el('div', { class: 'tauler camins' });
            const D = dibuixaMapa(d, estil);
            const textRuta = C.el('p', { 'class': 'text-ruta', 'aria-live': 'polite' });
            caixa.append(D.svg, textRuta);
            lloc.appendChild(caixa);
            const totalArestes = d.graf.arestes.length;

            Object.values(D.punts).forEach(g => {
                g.setAttribute('tabindex', '0');
                g.setAttribute('role', 'button');
                g.addEventListener('click', () => {
                    if (!C.acabaDeArrossegar()) toca(idDe(g, d), true);
                });
                g.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toca(idDe(g, d), true);
                    }
                });
            });
            caixa.addEventListener('keydown', e => {
                if (e.key === 'Backspace') {
                    e.preventDefault();
                    desfes();
                }
            });
            // Arrossegar el dit de punt en punt
            const puntA = (e, tactil) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (tactil ? 26 : 0));
                let millor = null,
                    dist = 30;
                Object.keys(D.pos).forEach(k => {
                    const [x, y] = D.pos[k];
                    const dd = Math.hypot(x - q.x, y - q.y);
                    if (dd < dist) {
                        dist = dd;
                        millor = typeof d.graf.vertexs[0] === 'number' ? +k : k;
                    }
                });
                return millor;
            };
            C.arrossega(D.svg, {
                inici: e => {
                    const g = e.target.closest('.punt');
                    if (!g) return null;
                    return { darrer: idDe(g, d) };
                },
                comenca: c => {
                    if (!ruta.length || ruta[ruta.length - 1] !== c.darrer) toca(c.darrer, false);
                },
                mou: (c, e) => {
                    const v = puntA(e, c.tactil);
                    if (v === null || v === c.darrer) return;
                    c.darrer = v;
                    const darrer = ruta[ruta.length - 1];
                    if (hamilton && ruta.length >= 2 && v === ruta[ruta.length - 2]) desfes();
                    else if (darrer !== undefined && G.hiHaAresta(d.graf, darrer, v)) toca(v, false);
                },
                deixa: () => {},
            });

            function inicia() {
                ruta = hamilton ? [d.inici] : [];
                acabat = false;
                hist.buida();
                canvi(true);
            }
            function toca(v, desdeToc) {
                const darrer = ruta[ruta.length - 1];
                if (desdeToc && ruta.length && v === darrer && (!hamilton || ruta.length > 1)) {
                    desfes();
                    return;
                }
                if (acabat) return;
                if (!ruta.length) {
                    hist.desa(ruta);
                    ruta.push(v);
                    canvi();
                    return;
                }
                if (!G.hiHaAresta(d.graf, darrer, v)) {
                    if (desdeToc) {
                        ctx.missatge('error', `De ${darrer} a ${v} no hi ha cap ${hamilton ? 'carretera' : 'línia'}`, [
                            hamilton
                                ? 'Has d’anar recte de ciutat a ciutat, per una de les carreteres que surten de la ' + darrer + '.'
                                : 'Només pots anar a una estació veïna, per una línia del plànol.',
                        ]);
                        C.anima(D.punts[v], 'sacseja');
                    }
                    return;
                }
                if (hamilton && ruta.includes(v) && !(v === d.inici && ruta.length === d.graf.vertexs.length)) {
                    if (desdeToc) {
                        ctx.missatge('error', `Ja has passat per la ${v}`, ['El viatger només pot visitar cada ciutat una vegada.']);
                        C.anima(D.punts[v], 'sacseja');
                    }
                    return;
                }
                hist.desa(ruta);
                ruta = ruta.concat([v]);
                canvi();
            }
            function desfes() {
                const ant = hist.desfes();
                if (!ant) return;
                ruta = ant;
                acabat = false;
                canvi();
            }
            function canvi(silenci) {
                ctx.amaga();
                D.pintaRuta(ruta, !hamilton);
                Object.values(D.punts).forEach(g => {
                    const v = idDe(g, d);
                    const veins = G.index(d.graf).veins[v].length;
                    g.setAttribute(
                        'aria-label',
                        `${hamilton ? 'Ciutat' : 'Estació'} ${v}, ${C.plural(veins, hamilton ? 'carretera' : 'línia')}${ruta.includes(v) ? ', ja visitada' : ''}`
                    );
                });
                ctx.desfes(hist.mida > 0);
                if (hamilton) revisaHamilton(silenci);
                else revisaCarter(silenci);
            }
            function revisaHamilton(silenci) {
                const visitades = new Set(ruta).size;
                ctx.estat([C.el('span', null, 'Ciutats visitades: ', C.el('b', { text: `${visitades} de ${d.graf.vertexs.length}` }))]);
                textRuta.textContent = 'Ruta: ' + ruta.join(', ');
                if (silenci) return;
                if (G.motiuHamilton(d.graf, ruta, d.inici) === null) {
                    acabat = true;
                    ctx.resolt('Ruta completa!', ['Setze ciutats, cada una una sola vegada, i de tornada a l’1.']);
                    return;
                }
                const darrer = ruta[ruta.length - 1];
                const lliures = G.index(d.graf).veins[darrer].filter(
                    w => !ruta.includes(w) || (w === d.inici && visitades === d.graf.vertexs.length)
                );
                if (!lliures.length)
                    ctx.missatge('info', 'Per aquí no hi ha sortida', [
                        `Des de la ${darrer} ja no pots anar a cap ciutat on no hagis estat. Fes enrere i prova un altre camí.`,
                    ]);
            }
            function revisaCarter(silenci) {
                const r = G.recompte(d.graf, ruta);
                const fetes = totalArestes - r.falten.length;
                ctx.estat([
                    C.el('span', null, 'Recorregut: ', C.el('b', { text: C.plural(r.longitud, 'milla', 'milles') })),
                    C.el('span', null, 'Línies revisades: ', C.el('b', { text: `${fetes} de ${totalArestes}` })),
                ]);
                textRuta.textContent = ruta.length ? 'Ruta: ' + ruta.join(' ') : 'Toca l’estació on vols començar.';
                if (silenci || r.falten.length) return;
                acabat = true;
                if (r.longitud === d.minim)
                    ctx.resolt(`${r.longitud} milles: el mínim!`, ['Totes les línies revisades, i cap milla de més.']);
                else
                    ctx.missatge('info', `Totes les línies revisades, en ${r.longitud} milles`, [
                        `Es pot fer en ${d.minim}. Ho tornes a provar?`,
                    ]);
            }
            inicia();
            return {
                reinicia: inicia,
                desfes,
                textSolucio: '▶ Mira-la al tauler',
                solucio() {
                    ruta = hamilton ? [d.inici] : [];
                    acabat = false;
                    hist.buida();
                    canvi(true);
                    const passos = hamilton ? d.solucio.slice(1) : d.solucio;
                    return C.reprodueix(
                        passos,
                        v => {
                            hist.desa(ruta);
                            ruta = ruta.concat([v]);
                            D.pintaRuta(ruta, !hamilton);
                            if (hamilton) revisaHamilton(true);
                            else revisaCarter(true);
                        },
                        C.movimentReduit() ? 200 : 520,
                        () =>
                            ctx.missatge(
                                'info',
                                'Així ho fa Dudeney',
                                hamilton
                                    ? ['L’única ruta: les carreteres obligades porten a les altres.']
                                    : ['19 milles: D–G i F–I són els únics trams repetits.']
                            )
                    );
                },
            };
        };
    }

    window.Taulers.carter = {
        crea: creaMapa('metro'),
        figura: figuraMapa('metro'),
        figuraSolucio: p => {
            const svg = figuraMapa('metro')(p, { solucio: true });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg, C.el('figcaption', { text: 'Els trams D–G i F–I es fan dues vegades.' }));
        },
    };
    window.Taulers.hamilton = {
        crea: creaMapa('ciutats'),
        figura: figuraMapa('ciutats'),
        figuraSolucio: p => {
            const svg = figuraMapa('ciutats')(p, { solucio: true });
            svg.classList.add('figura-estatica');
            return C.el('figure', null, svg);
        },
    };
})();
