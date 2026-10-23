/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/mesures/tauler.js
 * ROL: Els taulers de mesures i travesses:
 *   - Taulers.gerres: recipients sense marques (AM 365, AM 362). Es toca el
 *     que vessa i el que rep (o s'arrossega l'un sobre l'altre); el líquid
 *     passa fins que un queda buit o l'altre ple. Una capacitat Infinity és
 *     una persona (AM 362): beu tot el que li donen i no torna res; les
 *     persones van en una segona filera. A sota, «el quadern»: una fila per
 *     abocada, com la taula de la solució de Dudeney.
 *   - Taulers.barca: dues ribes, un rierol i una barca amb un pes màxim
 *     (AM 373). Es pugen i es baixen els passatgers tocant-los (o
 *     arrossegant-los) i «Travessa» porta la barca a l'altra riba.
 *   Tots dos compten els passos, tenen «Desfés» i la solució pas a pas.
 * ARQUITECTURA: window.Taulers.gerres / .barca = { crea(lloc, p, ctx), figura(p) }.
 *   Les regles són al motor (js/mesures/motor.js).
 * DEPENDÈNCIES: js/comu/comu.js, js/mesures/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const M = window.MotorMesurar;

    // ════════════════════════════════════════════════════════════
    // GERRES
    // ════════════════════════════════════════════════════════════
    const COLG = 150,
        QUART = 21,
        BASE = 292,
        // La filera de les persones (AM 362): a sota dels recipients
        FILA_PERSONES = 230,
        ALT_PERSONA = 112;

    const esPersona = (d, i) => d.capacitats[i] === Infinity;

    function formaRecipient(forma, w, h) {
        // Interior (per al líquid) i contorn, amb l'origen a baix al mig
        const x = w / 2;
        if (forma === 'gerra') {
            return {
                interior: `M${-x + 6} ${-h} L${-x + 4} -14 Q${-x + 4} -4 ${-x + 14} -4 L${x - 14} -4 Q${x - 4} -4 ${x - 4} -14 L${x - 6} ${-h} Z`,
                contorn:
                    `M${-x - 6} ${-h - 10} L${-x + 4} ${-h - 2} L${-x + 2} -14 Q${-x + 2} 0 ${-x + 14} 0 L${x - 14} 0 Q${x - 2} 0 ${x - 2} -14 L${x - 4} ${-h - 4} L${x - 2} ${-h - 8}` +
                    ` M${x - 3} ${-h + 12} C${x + 26} ${-h + 14} ${x + 26} ${-h * 0.45} ${x - 2} ${-h * 0.4}`,
            };
        }
        if (forma === 'barril') {
            // Un barril de fusta: ventre corbat, dos cèrcols i l'aixeta a baix
            return {
                interior: `M${-x + 10} ${-h + 4} Q${-x - 4} ${-h / 2} ${-x + 10} -6 L${x - 10} -6 Q${x + 4} ${-h / 2} ${x - 10} ${-h + 4} Z`,
                contorn:
                    `M${-x + 8} ${-h} Q${-x - 8} ${-h / 2} ${-x + 8} 0 L${x - 8} 0 Q${x + 8} ${-h / 2} ${x - 8} ${-h} Z` +
                    ` M${-x + 1} ${-h * 0.25} L${x - 1} ${-h * 0.25} M${-x + 1} ${-h * 0.75} L${x - 1} ${-h * 0.75}` +
                    ` M${x - 2} -22 L${x + 12} -22 L${x + 12} -14`,
            };
        }
        if (forma === 'persona') {
            // Una persona de mig cos: el tors és el «recipient» (el que ha begut) i el cap, a sobre
            const t = ALT_PERSONA;
            return {
                interior: `M${-x + 6} -4 L${-x + 10} ${-t + 26} Q${-x + 12} ${-t + 6} ${-x + 30} ${-t + 4} L${x - 30} ${-t + 4} Q${x - 12} ${-t + 6} ${x - 10} ${-t + 26} L${x - 6} -4 Z`,
                contorn:
                    `M${-x + 2} 0 L${-x + 7} ${-t + 26} Q${-x + 9} ${-t + 2} ${-x + 30} ${-t} L${x - 30} ${-t} Q${x - 9} ${-t + 2} ${x - 7} ${-t + 26} L${x - 2} 0 Z` +
                    ` M0 ${-t - 4} m-21 -20 a21 21 0 1 0 42 0 a21 21 0 1 0 -42 0`,
            };
        }
        return {
            interior: `M${-x + 5} ${-h} L${-x + 5} -10 Q${-x + 5} -4 ${-x + 11} -4 L${x - 11} -4 Q${x - 5} -4 ${x - 5} -10 L${x - 5} ${-h} Z`,
            contorn: `M${-x - 3} ${-h - 5} L${-x + 2} ${-h} L${-x + 2} -10 Q${-x + 2} 0 ${-x + 12} 0 L${x - 12} 0 Q${x - 2} 0 ${x - 2} -10 L${x - 2} ${-h} L${x + 3} ${-h - 5}`,
        };
    }

    /**
     * Els recipients en una filera; si n'hi ha que són persones (capacitat Infinity), van en una segona filera,
     * a sota. dades.escala = píxels per unitat (21 si no hi és); dades.escalaPersona = quantitat que omple el tors.
     */
    function dibuixaGerres(d, opcions = {}) {
        const escala = d.escala || QUART;
        const idx = d.capacitats.map((c, i) => i);
        const fila1 = idx.filter(i => !esPersona(d, i)),
            fila2 = idx.filter(i => esPersona(d, i));
        const cols = Math.max(fila1.length, fila2.length);
        const W = cols * COLG,
            H = BASE + 46 + (fila2.length ? FILA_PERSONES : 0);
        const s = C.svg('svg', {
            'class': 'tauler-svg gerres-svg' + (d.liquid === 'llimonada' ? ' llimonada' : '') + (fila2.length ? ' amb-persones' : ''),
            'viewBox': `0 0 ${W} ${H}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || d.noms.join(', '),
        });
        const defs = C.svg('defs', null, s);
        const recipients = [];
        const lloc = {};
        [fila1, fila2].forEach((fila, k) => {
            const marge = (W - fila.length * COLG) / 2;
            fila.forEach((i, j) => (lloc[i] = { cx: marge + COLG / 2 + j * COLG, base: BASE + k * FILA_PERSONES }));
        });
        d.capacitats.forEach((cap, i) => {
            const { cx, base } = lloc[i];
            const persona = esPersona(d, i);
            const forma = persona ? 'persona' : d.formes[i];
            const w = forma === 'gerra' ? 96 : forma === 'barril' ? 112 : forma === 'persona' ? 86 : 78;
            const capDibuix = persona ? d.escalaPersona || 6 : cap;
            const h = persona ? ALT_PERSONA : cap * escala + 8;
            const f = formaRecipient(forma, w, h);
            const id = `vi-${opcions.prefix || 'g'}-${i}`;
            const clip = C.svg('clipPath', { id }, defs);
            C.svg('path', { d: f.interior }, clip);
            const g = C.svg('g', { 'class': 'recipient' + (persona ? ' persona' : ''), 'data-i': i }, s);
            g.style.transform = `translate(${cx}px, ${base}px)`;
            const dalt = persona ? h + 50 : h + 30;
            C.svg('rect', { class: 'zona', x: -COLG / 2, y: -dalt, width: COLG, height: dalt + 40 }, g);
            const dins = C.svg('g', { class: 'mou' }, g);
            C.svg('path', { class: 'vidre', d: f.interior }, dins);
            const vi = C.svg('g', { 'clip-path': `url(#${id})` }, dins);
            const liquid = C.svg('rect', { class: 'vi', x: -w, y: -h + 4, width: 2 * w, height: h - 4 }, vi);
            if (!persona) liquid.setAttribute('y', -cap * escala - 4), liquid.setAttribute('height', cap * escala);
            // L'estat inicial ja des del principi, perquè el líquid no s'animi en carregar la pàgina
            liquid.style.transform = `scaleY(${Math.min(1, (d.inicial[i] || 0) / capDibuix)})`;
            C.svg('path', { class: 'contorn', d: f.contorn }, dins);
            if (persona) {
                // La cara: dos ulls i un somriure
                const cy = -h - 25;
                C.svg('circle', { class: 'ull', cx: -7, cy: cy - 3, r: 2.2 }, dins);
                C.svg('circle', { class: 'ull', cx: 7, cy: cy - 3, r: 2.2 }, dins);
                C.svg('path', { class: 'boca', d: `M-8 ${cy + 7} Q0 ${cy + 13} 8 ${cy + 7}` }, dins);
            }
            const quant = C.svg('text', { class: 'quantitat', x: 0, y: persona ? -h / 2 + 2 : -Math.min(h / 2, 70) }, dins);
            C.svg('text', { 'class': 'nom-recipient', 'x': 0, 'y': 26, 'text': d.noms[i] }, g);
            C.svg('text', { 'class': 'num-recipient', 'x': persona ? 34 : 0, 'y': persona ? -h - 40 : -h - 16, 'text': i + 1 }, g);
            recipients.push({ g, liquid, quant, cap: capDibuix, h: persona ? h + 50 : h, cx, base, persona });
        });
        const raig = C.svg('path', { class: 'raig', d: '' }, s);
        function posa(estat, tria) {
            estat.forEach((q, i) => {
                const r = recipients[i];
                r.liquid.style.transform = `scaleY(${Math.min(1, q / r.cap)})`;
                r.quant.textContent = q;
                r.quant.classList.toggle('buit', q === 0);
                r.g.classList.toggle('triat', tria === i);
            });
        }
        function vessa(i, j) {
            const a = recipients[i],
                b = recipients[j];
            const x1 = a.cx + (b.cx >= a.cx ? 30 : -30),
                y1 = a.base - a.h - 6;
            const x2 = b.cx,
                y2 = b.persona ? b.base - ALT_PERSONA - 14 : b.base - b.h + 10;
            const my = Math.min(y1, y2) - 46;
            const mx = b.persona ? x1 + (b.cx >= a.cx ? 70 : -70) : (x1 + x2) / 2;
            raig.setAttribute('d', `M${x1} ${y1} Q${mx} ${b.persona ? y1 - 30 : my} ${x2} ${y2}`);
            C.anima(raig, 'vessant');
        }
        /** El recipient que hi ha sota el punt (x, y) del dibuix (per deixar-hi el que s'arrossega). */
        function aPunt(x, y) {
            let millor = 0,
                dist = Infinity;
            recipients.forEach((r, i) => {
                const dd = Math.hypot(x - r.cx, (y - (r.base - r.h / 2)) * 0.6);
                if (dd < dist) {
                    dist = dd;
                    millor = i;
                }
            });
            return millor;
        }
        return { svg: s, recipients, posa, vessa, aPunt, W, H };
    }

    function figuraGerres(p, opcions = {}) {
        const D = dibuixaGerres(p.dades, { estatic: true, prefix: 'f' + Math.random().toString(36).slice(2, 6) });
        D.posa(opcions.estat || p.dades.inicial, null);
        return D.svg;
    }

    function creaGerres(lloc, p, ctx) {
        const d = p.dades;
        const liquid = d.liquid || 'vi';
        const art = i => (d.articles ? d.articles[i] : 'la') + (d.articles && d.articles[i].endsWith('’') ? '' : ' ') + d.noms[i];
        const Art = i => {
            const t = art(i);
            return t.charAt(0).toUpperCase() + t.slice(1);
        };
        let estat, abocades, tria, reproduccio;
        const hist = C.historial(x => ({ estat: x.estat.slice(), abocades: x.abocades }));
        const caixa = C.el('div', { class: 'tauler gerres' });
        const D = dibuixaGerres(d, { prefix: 'joc' });
        const quadern = C.el('div', { 'class': 'quadern', 'aria-label': 'El quadern: què hi ha a cada recipient' });
        const taula = C.el('table');
        const cap = C.el('thead', null, C.el('tr', null, C.el('th', { text: '' }), d.noms.map(nm => C.el('th', { text: nm }))));
        const cos = C.el('tbody');
        taula.append(cap, cos);
        quadern.append(C.el('p', { class: 'quadern-titol', text: 'El quadern' }), taula);
        caixa.append(D.svg, quadern);
        lloc.appendChild(caixa);

        D.recipients.forEach((r, i) => {
            r.g.setAttribute('tabindex', '0');
            r.g.setAttribute('role', 'button');
            r.g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(i);
            });
        });
        C.arrossega(D.svg, {
            inici: e => {
                const g = e.target.closest('.recipient');
                if (!g) return null;
                atura();
                if (esPersona(d, +g.dataset.i)) return null;
                return { i: +g.dataset.i };
            },
            comenca: c => {
                tria = null;
                D.recipients[c.i].g.classList.add('arrossegat');
                pinta();
            },
            mou: (c, e) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                const r = D.recipients[c.i];
                r.g.querySelector('.mou').style.transform = `translate(${q.x - r.cx}px, ${q.y - (r.base - r.h / 2)}px)`;
            },
            deixa: (c, e) => {
                const r = D.recipients[c.i];
                r.g.classList.remove('arrossegat');
                r.g.querySelector('.mou').style.transform = '';
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                const j = D.aPunt(q.x, q.y);
                if (j !== c.i) prova(c.i, j);
            },
            cancela: c => {
                const r = D.recipients[c.i];
                r.g.classList.remove('arrossegat');
                r.g.querySelector('.mou').style.transform = '';
            },
        });
        caixa.addEventListener('keydown', tecla);

        function inicia() {
            atura();
            estat = d.inicial.slice();
            abocades = 0;
            tria = null;
            hist.buida();
            cos.replaceChildren();
            afegeixFila(estat, null);
            pinta();
        }
        function afegeixFila(e, mov) {
            const tr = C.el(
                'tr',
                null,
                C.el('th', { text: mov ? String(cos.children.length) : 'inici' }),
                e.map((q, i) => C.el('td', { class: mov && (mov[0] === i || mov[1] === i) ? 'canvia' : '', text: q }))
            );
            cos.appendChild(tr);
            quadern.scrollTop = quadern.scrollHeight;
        }
        function pinta() {
            D.posa(estat, tria);
            D.recipients.forEach((r, i) => {
                const te = esPersona(d, i) ? `ha begut ${estat[i]}` : `té ${estat[i]}`;
                r.g.setAttribute('aria-label', `${d.noms[i]}: ${te} ${d.unitat}${tria === i ? ', triat' : ''}`);
                r.g.classList.toggle('desti-possible', tria !== null && tria !== i);
            });
            D.svg.classList.toggle('amb-seleccio', tria !== null);
            ctx.estat([C.el('span', null, d.nomPassos ? d.nomPassos + ': ' : 'Abocades: ', C.el('b', { text: abocades }))]);
            ctx.desfes(hist.mida > 0);
        }
        const avisPersona = i => {
            ctx.missatge('error', `${Art(i)} no pot tornar el que s’ha begut`, [
                'Primer toca el recipient d’on surt el líquid; després, qui l’ha de rebre.',
            ]);
            C.anima(D.recipients[i].g.querySelector('.mou'), 'sacseja');
        };
        function toca(i) {
            atura();
            if (tria === null) {
                if (esPersona(d, i)) return avisPersona(i);
                if (!estat[i]) {
                    ctx.missatge('error', `${Art(i)} és buid${d.articles && d.articles[i] === 'el' ? '' : 'a'}`, [`Tria un recipient que tingui ${liquid}.`]);
                    C.anima(D.recipients[i].g.querySelector('.mou'), 'sacseja');
                    return;
                }
                ctx.amaga();
                tria = i;
            } else if (tria === i) tria = null;
            else {
                const de = tria;
                tria = null;
                prova(de, i);
                return;
            }
            pinta();
        }
        function prova(i, j) {
            const motiu = M.gerres.motiu(estat, d.capacitats, i, j);
            if (motiu === 'persona') {
                avisPersona(i);
                pinta();
                return;
            }
            if (motiu === 'buida') {
                ctx.missatge('error', `${Art(i)} és buid${d.articles && d.articles[i] === 'el' ? '' : 'a'}`, ['No hi ha res per vessar.']);
                pinta();
                return;
            }
            if (motiu === 'plena') {
                ctx.missatge('error', `${Art(j)} ja és ple${d.articles && d.articles[j] === 'el' ? '' : 'na'}`, ['No hi cap ni una gota més.']);
                C.anima(D.recipients[j].g.querySelector('.mou'), 'sacseja');
                pinta();
                return;
            }
            if (motiu) {
                pinta();
                return;
            }
            fesAbocada(i, j);
            revisa();
        }
        function fesAbocada(i, j) {
            hist.desa({ estat, abocades });
            estat = M.gerres.vessa(estat, d.capacitats, i, j);
            abocades++;
            ctx.amaga();
            D.vessa(i, j);
            afegeixFila(estat, [i, j]);
            pinta();
        }
        const passos = k => (d.nomPassos ? `${k} ${d.nomPassos.toLowerCase()}` : `${k} abocades`);
        function revisa() {
            if (!M.gerres.resolt(estat, d.objectiu)) return;
            if (abocades === d.solucio.length)
                ctx.resolt(`${passos(abocades)}: el mínim!`, [d.textResolt || '3 quarts a cada mesura, com volia l’home.']);
            else
                ctx.missatge('info', `Fet amb ${passos(abocades)}`, [`Es pot fer amb ${d.solucio.length}. Ho tornes a provar?`]);
        }
        function tecla(e) {
            const n = d.capacitats.length;
            if (e.key >= '1' && e.key <= String(n)) {
                e.preventDefault();
                toca(+e.key - 1);
                D.recipients[+e.key - 1].g.focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.recipient');
                if (g) {
                    e.preventDefault();
                    toca(+g.dataset.i);
                }
            } else if (e.key === 'Escape' && tria !== null) {
                tria = null;
                pinta();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const g = e.target.closest && e.target.closest('.recipient');
                if (!g) return;
                const i = (+g.dataset.i + (e.key === 'ArrowLeft' ? -1 : 1) + n) % n;
                D.recipients[i].g.focus();
                e.preventDefault();
            }
        }
        function desfes() {
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, abocades } = ant);
            tria = null;
            if (cos.lastChild && cos.children.length > 1) cos.lastChild.remove();
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
            textSolucio: `▶ Mira-la al tauler (${passos(d.solucio.length)})`,
            solucio() {
                inicia();
                reproduccio = C.reprodueix(d.solucio, ([i, j]) => fesAbocada(i, j), C.movimentReduit() ? 350 : 900, () =>
                    ctx.missatge('info', 'Així ho fa Dudeney', [d.textFinal || 'Onze abocades: el quadern és la seva taula.'])
                );
                return reproduccio;
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // BARCA
    // ════════════════════════════════════════════════════════════
    /**
     * La geometria de l'escena. Ampla: tothom en una filera a cada riba. Estreta (mòbils): dues fileres
     * a cada riba i una barca més petita, perquè les figures no quedin diminutes.
     */
    function geometriaBarca(estreta) {
        if (!estreta) {
            const BW = 920,
                RIBA = 296,
                LB = 170;
            return {
                BW, BH: 270, RIBA, TERRA: 176, LB,
                MOLL: [RIBA + 4, BW - RIBA - 4 - LB],
                lloc: (i, costat) => [costat ? BW - RIBA + 26 + i * 57 : 34 + i * 57, 176],
            };
        }
        const BW = 600,
            RIBA = 190,
            LB = 130;
        // fila del fons: pare, mare i gos; fila del davant: els fills
        const FILA = [[32, 0], [88, 0], [52, 1], [112, 1], [152, 0]];
        return {
            BW, BH: 330, RIBA, TERRA: 236, LB,
            MOLL: [RIBA + 4, BW - RIBA - 4 - LB],
            lloc: (i, costat) => {
                const [x, f] = FILA[i];
                return [costat ? BW - RIBA + x - 10 : x, f ? 284 : 206];
            },
        };
    }

    function figuraPassatger(tipus, pare) {
        const g = C.svg('g', { class: 'figura ' + tipus }, pare);
        g.style.transform = 'scale(1.28)';
        if (tipus === 'gos') {
            C.svg(
                'path',
                {
                    class: 'cos',
                    d: 'M-20 -6 Q-22 -20 -8 -20 L10 -20 Q14 -30 22 -28 Q30 -26 28 -16 Q26 -10 20 -11 L18 -6 L18 0 L12 0 L12 -6 L-12 -6 L-12 0 L-18 0 Z M-20 -16 Q-30 -22 -26 -28',
                },
                g
            );
            C.svg('circle', { class: 'ull', cx: 23, cy: -21, r: 1.8 }, g);
            return g;
        }
        const k = tipus === 'nen' ? 0.78 : 1;
        const cap = C.svg('g', null, g);
        cap.style.transform = `scale(${k})`;
        C.svg('circle', { class: 'cap', cx: 0, cy: -54, r: 10 }, cap);
        C.svg(
            'path',
            {
                class: 'cos',
                d:
                    tipus === 'adulta'
                        ? 'M-8 -42 Q0 -45 8 -42 L18 0 L-18 0 Z'
                        : 'M-11 -42 Q0 -45 11 -42 Q15 -40 15 -30 L13 0 L-13 0 L-15 -30 Q-15 -40 -11 -42 Z',
            },
            cap
        );
        return g;
    }

    function dibuixaBarca(d, opcions = {}) {
        const G = geometriaBarca(!!opcions.estreta);
        const { BW, BH, RIBA, TERRA, MOLL, LB } = G;
        const TOP = opcions.estreta ? 140 : TERRA;
        const s = C.svg('svg', {
            'class': 'tauler-svg barca-svg',
            'viewBox': `0 0 ${BW} ${BH}`,
            'role': opcions.estatic ? 'img' : 'group',
            'aria-label': opcions.etiqueta || 'Dues ribes, un rierol i una barca',
        });
        // Ribes i aigua
        C.svg('rect', { class: 'aigua', x: RIBA - 10, y: TOP - 6, width: BW - 2 * RIBA + 20, height: BH - TOP + 6 }, s);
        for (let k = 0; k < 3; k++) {
            let dd = `M${RIBA + 10} ${TERRA + 30 + k * 22}`;
            for (let x = RIBA + 10; x < BW - RIBA - 10; x += 24) dd += ` q6 -5 12 0 t12 0`;
            C.svg('path', { class: 'ona', d: dd }, s);
        }
        C.svg('path', { class: 'riba', d: `M0 ${TOP} H${RIBA} Q${RIBA + 8} ${TOP + 30} ${RIBA - 6} ${BH} H0 Z` }, s);
        C.svg(
            'path',
            { class: 'riba', d: `M${BW} ${TOP} H${BW - RIBA} Q${BW - RIBA - 8} ${TOP + 30} ${BW - RIBA + 6} ${BH} H${BW} Z` },
            s
        );
        C.svg('text', { 'class': 'nom-riba', 'x': RIBA / 2, 'y': BH - 14, 'text': 'aquesta riba' }, s);
        C.svg('text', { 'class': 'nom-riba', 'x': BW - RIBA / 2, 'y': BH - 14, 'text': 'l’altra riba' }, s);
        // La barca
        const barca = C.svg('g', { class: 'barca' }, s);
        const casc = C.svg('g', null, barca);
        casc.style.transform = `scale(${LB / 170})`;
        C.svg('path', { class: 'casc', d: 'M0 0 H170 L150 32 Q85 43 20 32 Z' }, casc);
        C.svg('path', { class: 'rem', d: 'M32 -4 L8 38 M138 -4 L162 38' }, casc);
        const carrega = C.svg('text', { class: 'carrega', x: LB / 2, y: 62 }, barca);
        // Passatgers
        const capa = C.svg('g', { class: 'passatgers' }, s);
        const figures = d.passatgers.map((q, i) => {
            const g = C.svg('g', { 'class': 'passatger', 'data-i': i }, capa);
            C.svg('rect', { class: 'zona', x: -28, y: -88, width: 56, height: 104 }, g);
            figuraPassatger(q.figura, g);
            const yPes = q.figura === 'gos' ? 16 : q.figura === 'nen' ? -16 : -22;
            C.svg('text', { 'class': 'pes', 'x': 0, 'y': yPes, 'text': q.pes }, g);
            C.svg('text', { 'class': 'nom-passatger', 'x': 0, 'y': q.figura === 'gos' ? 31 : 17, 'text': q.curt }, g);
            return g;
        });
        // Llocs de cada passatger a les ribes, i seients de la barca
        const lloc = G.lloc;
        function posa(estat, aBord) {
            const xb = MOLL[estat.barca];
            barca.style.transform = `translate(${xb}px, ${TERRA - 4}px)`;
            const dinsBarca = aBord.slice();
            const pes = dinsBarca.reduce((t, i) => t + d.passatgers[i].pes, 0);
            carrega.textContent = dinsBarca.length ? `${pes} / ${d.capacitat}` : '';
            carrega.classList.toggle('massa', pes > d.capacitat);
            d.passatgers.forEach((q, i) => {
                const k = dinsBarca.indexOf(i);
                let x, y;
                if (k >= 0) {
                    x = xb + LB * 0.3 + k * LB * 0.39;
                    y = TERRA + 6;
                } else [x, y] = lloc(i, estat.costat[i]);
                figures[i].style.transform = `translate(${x}px, ${y}px)`;
                figures[i].classList.toggle('a-bord', k >= 0);
            });
        }
        return { svg: s, barca, figures, posa, G };
    }

    function figuraBarca(p, opcions = {}) {
        const D = dibuixaBarca(p.dades, { estatic: true, etiqueta: 'Tota la família i el gos, a la riba de l’esquerra' });
        D.posa(M.barca.inicial(p.dades.passatgers), []);
        if (opcions.vinyeta) D.svg.setAttribute('viewBox', `0 66 770 204`);
        return D.svg;
    }

    function creaBarca(lloc, p, ctx) {
        const d = p.dades;
        let estat, aBord, travessies, reproduccio, ocupat = false;
        const hist = C.historial(x => ({ estat: { costat: x.estat.costat.slice(), barca: x.estat.barca }, travessies: x.travessies }));
        const caixa = C.el('div', { class: 'tauler barca-joc' });
        const D = dibuixaBarca(d, { estreta: lloc.clientWidth < 520 });
        const boto = C.el('button', { type: 'button', class: 'btn-principal boto-travessa' });
        const pesText = C.el('p', { 'class': 'pes-barca', 'aria-live': 'polite' });
        caixa.append(D.svg, C.el('div', { class: 'eines-tauler' }, pesText, boto));
        lloc.appendChild(caixa);

        D.figures.forEach((g, i) => {
            g.setAttribute('tabindex', '0');
            g.setAttribute('role', 'button');
            g.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) toca(i);
            });
        });
        boto.addEventListener('click', travessa);
        C.arrossega(D.svg, {
            inici: e => {
                const g = e.target.closest('.passatger');
                if (!g || ocupat) return null;
                atura();
                return { i: +g.dataset.i };
            },
            comenca: c => D.figures[c.i].classList.add('arrossegat'),
            mou: (c, e) => {
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                D.figures[c.i].style.transform = `translate(${q.x}px, ${q.y + 30}px)`;
            },
            deixa: (c, e) => {
                D.figures[c.i].classList.remove('arrossegat');
                const q = C.coords(D.svg, e.clientX, e.clientY - (c.tactil ? 30 : 0));
                const xb = D.G.MOLL[estat.barca];
                const sobreBarca = q.x > xb - 10 && q.x < xb + D.G.LB + 10 && q.y > D.G.TERRA - 90 && q.y < D.G.TERRA + 50;
                const dins = aBord.includes(c.i);
                if (sobreBarca !== dins) toca(c.i);
                else pinta();
            },
            cancela: c => {
                D.figures[c.i].classList.remove('arrossegat');
                pinta();
            },
        });
        caixa.addEventListener('keydown', tecla);

        function inicia() {
            atura();
            estat = M.barca.inicial(d.passatgers);
            aBord = [];
            travessies = 0;
            ocupat = false;
            hist.buida();
            pinta();
        }
        function pes() {
            return aBord.reduce((t, i) => t + d.passatgers[i].pes, 0);
        }
        function pinta() {
            D.posa(estat, aBord);
            D.figures.forEach((g, i) => {
                const q = d.passatgers[i];
                const on = aBord.includes(i) ? 'a la barca' : estat.costat[i] ? 'a l’altra riba' : 'a aquesta riba';
                g.setAttribute('aria-label', `${q.nom}, ${q.pes} ${d.unitat}, ${on}`);
                g.classList.toggle('lluny', !aBord.includes(i) && estat.costat[i] !== estat.barca);
            });
            const p0 = pes();
            pesText.replaceChildren(
                aBord.length
                    ? C.el(
                          'span',
                          null,
                          'A la barca: ',
                          C.el('b', { text: aBord.map(i => d.passatgers[i].curt).join(' i ') }),
                          ` (${p0} de ${d.capacitat} ${d.unitat})`
                      )
                    : C.el('span', { text: 'La barca és buida.' })
            );
            boto.textContent = estat.barca ? 'Travessa cap aquí' : 'Travessa cap a l’altra riba';
            boto.disabled = ocupat;
            ctx.estat([C.el('span', null, 'Travessies: ', C.el('b', { text: travessies }))]);
            ctx.desfes(hist.mida > 0 && !ocupat);
        }
        function toca(i) {
            if (ocupat) return;
            atura();
            const q = d.passatgers[i];
            const k = aBord.indexOf(i);
            if (k >= 0) {
                aBord.splice(k, 1);
                ctx.amaga();
                pinta();
                return;
            }
            if (estat.costat[i] !== estat.barca) {
                ctx.missatge('error', 'La barca és a l’altra riba', [`Abans que ${q.nom} hi pugi, la barca ha de venir.`]);
                C.anima(D.figures[i], 'sacseja');
                return;
            }
            if (pes() + q.pes > d.capacitat) {
                ctx.missatge('error', 'No hi cap', [
                    `${aBord.map(j => d.passatgers[j].pes).join(' + ')} + ${q.pes} = ${pes() + q.pes} ${d.unitat}: la barca només n’aguanta ${d.capacitat}.`,
                ]);
                C.anima(D.figures[i], 'sacseja');
                return;
            }
            aBord.push(i);
            ctx.amaga();
            pinta();
        }
        function travessa() {
            if (ocupat) return;
            atura();
            const motiu = M.barca.motiu(estat, d, aBord);
            if (motiu === 'buida') {
                ctx.missatge('error', 'La barca és buida', ['Algú hi ha de pujar per remar.']);
                C.anima(D.barca, 'sacseja');
                return;
            }
            if (motiu === 'rem') {
                ctx.missatge('error', 'Ningú no rema', ['El gos no sap remar: hi ha d’anar algú amb ell.']);
                C.anima(D.barca, 'sacseja');
                return;
            }
            if (motiu) return;
            fesTravessia(aBord.slice());
        }
        function fesTravessia(grup, despres) {
            hist.desa({ estat, travessies });
            ocupat = true;
            aBord = grup.slice();
            estat = { costat: estat.costat, barca: 1 - estat.barca };
            travessies++;
            ctx.amaga();
            pinta(); // la barca i els passatgers creuen
            setTimeout(
                () => {
                    estat = M.barca.travessa({ costat: estat.costat, barca: 1 - estat.barca }, grup);
                    aBord = [];
                    ocupat = false;
                    pinta(); // baixen a la riba
                    if (despres) despres();
                    else revisa();
                },
                C.movimentReduit() ? 60 : 620
            );
        }
        function revisa() {
            if (!M.barca.resolt(estat)) return;
            if (travessies === d.solucio.length)
                ctx.resolt(`${travessies} travessies: el mínim!`, ['Tota la família i el gos, a l’altra riba.']);
            else
                ctx.missatge('info', `Ho has fet en ${travessies} travessies`, [
                    `Es pot fer en ${d.solucio.length}. Ho tornes a provar?`,
                ]);
        }
        function tecla(e) {
            if (e.key >= '1' && e.key <= String(d.passatgers.length)) {
                e.preventDefault();
                toca(+e.key - 1);
            } else if (e.key === 'Enter' || e.key === ' ') {
                const g = e.target.closest && e.target.closest('.passatger');
                e.preventDefault();
                if (g && e.key === ' ') toca(+g.dataset.i);
                else travessa();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                desfes();
            }
        }
        function desfes() {
            if (ocupat) return;
            atura();
            const ant = hist.desfes();
            if (!ant) return;
            ({ estat, travessies } = ant);
            aBord = [];
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
            textSolucio: '▶ Mira-la al tauler (11 travessies)',
            solucio() {
                inicia();
                reproduccio = C.reprodueix(
                    d.solucio,
                    grup => {
                        aBord = grup.slice();
                        pinta();
                        setTimeout(() => fesTravessia(grup, () => {}), 350);
                    },
                    C.movimentReduit() ? 500 : 1500,
                    () =>
                        setTimeout(
                            () =>
                                ctx.missatge('info', 'Així ho fa Dudeney', [
                                    'Onze travessies: els fills fan anar i venir la barca.',
                                ]),
                            1000
                        )
                );
                return reproduccio;
            },
        };
    }

    window.Taulers.gerres = { crea: creaGerres, figura: figuraGerres };
    window.Taulers.barca = { crea: creaBarca, figura: figuraBarca };
})();
