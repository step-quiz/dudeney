/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/quadrats/tauler.js
 * ROL: Els taulers de quadrats:
 *   - Taulers.magic (AM 399): un quadrat 3 × 3 per omplir amb nombres (també
 *     fraccions: «4½», «9/2», «4,5»), amb un teclat numèric i les sumes de cada
 *     línia a la vora. Quan és ple, diu si és màgic i per què no.
 *   - Taulers.cartes (AM 304): les 16 figures de la baralla, d'una pila a un
 *     quadrat 4 × 4 (arrossegant o tocant carta i casella). Quan és ple,
 *     marca les línies amb pals o valors repetits.
 * ARQUITECTURA: HTML (no SVG): caselles <button>, teclat i pila. window.Taulers.magic /
 *   .cartes = { crea(lloc, p, ctx), figura(p, o), figuraSolucio(p) }.
 *   Les regles són a js/quadrats/motor.js; les fraccions, a js/comu/fraccio.js.
 * DEPENDÈNCIES: js/comu/comu.js, js/comu/fraccio.js, js/quadrats/motor.js
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const F = window.Fraccio;
    const Q = window.MotorQuadrats;

    // ════════════════════════════════════════════════════════════
    // QUADRAT MÀGIC
    // ════════════════════════════════════════════════════════════
    /** Un nombre bonic: la part entera i la fracció apilada (com a la figura de Dudeney). */
    function nombreBonic(v) {
        const e = C.el('span', { class: 'nombre-bonic' });
        if (!v) return e;
        const neg = v[0] < 0;
        const n = Math.abs(v[0]),
            d = v[1];
        const enter = Math.floor(n / d),
            resta = n % d;
        if (neg) e.appendChild(C.el('span', { class: 'signe', text: '−' }));
        if (enter || !resta) e.appendChild(C.el('span', { class: 'enter', text: String(enter) }));
        if (resta)
            e.appendChild(
                C.el('span', { class: 'frac' }, C.el('span', { class: 'num', text: String(resta) }), C.el('span', { class: 'den', text: String(d) }))
            );
        e.setAttribute('aria-label', F.text(v));
        return e;
    }

    function dibuixaMagic(valors, opcions = {}) {
        const g = C.el('div', {
            'class': 'quadrat-magic' + (opcions.estatic ? ' estatic' : ''),
            'role': opcions.estatic ? 'img' : 'grid',
            'aria-label': opcions.etiqueta || 'Quadrat de 3 × 3',
        });
        const cel = [];
        for (let i = 0; i < 9; i++) {
            const fixa = opcions.fixes && opcions.fixes[i] !== undefined;
            const e = C.el(opcions.estatic || fixa ? 'div' : 'button', {
                'class': 'cel' + (fixa ? ' fixa' : ''),
                'type': opcions.estatic || fixa ? null : 'button',
                'data-i': i,
            });
            e.style.gridRow = String(Math.floor(i / 3) + 1);
            e.style.gridColumn = String((i % 3) + 2);
            if (valors[i]) e.appendChild(nombreBonic(valors[i]));
            g.appendChild(e);
            cel.push(e);
        }
        const sumes = [];
        if (!opcions.senseSumes)
            Q.LINIES3.forEach((l, k) => {
                const s = C.el('div', { 'class': 'suma', 'data-k': k });
                let fila, col;
                if (k < 3) [fila, col] = [k + 1, 5];
                else if (k < 6) [fila, col] = [4, k - 1];
                else if (k === 6) [fila, col] = [4, 5];
                else [fila, col] = [4, 1];
                s.style.gridRow = String(fila);
                s.style.gridColumn = String(col);
                s.classList.add(k < 3 ? 'de-fila' : k < 6 ? 'de-columna' : k === 6 ? 'diagonal-1' : 'diagonal-2');
                g.appendChild(s);
                sumes.push(s);
            });
        return { el: g, cel, sumes };
    }

    function figuraMagic(p, opcions = {}) {
        const vals = new Array(9).fill(null);
        if (opcions.solucio) p.dades.solucio.forEach((t, i) => (vals[i] = F.llegeix(t)));
        else Object.keys(p.dades.fixes).forEach(i => (vals[i] = F.llegeix(p.dades.fixes[i])));
        const D = dibuixaMagic(vals, {
            estatic: true,
            senseSumes: true,
            etiqueta: opcions.solucio ? 'La solució de Dudeney: 4½, 8, 2½; 3, 5, 7; 7½, 2, 5½' : 'Un quadrat de 3 × 3 amb un 8 a la casella del mig de dalt',
        });
        return D.el;
    }

    function creaMagic(lloc, p, ctx) {
        const d = p.dades;
        const total = F.fr(d.total);
        const fixes = {};
        Object.keys(d.fixes).forEach(i => (fixes[i] = F.llegeix(d.fixes[i])));
        let valors, textos, actual, error;
        const caixa = C.el('div', { class: 'tauler magic' });
        const D = dibuixaMagic(new Array(9).fill(null), { fixes });
        const teclat = C.el('div', { 'class': 'teclat-numeric', 'role': 'group', 'aria-label': 'Teclat per escriure nombres' });
        const TECLES = ['7', '8', '9', '⌫', '4', '5', '6', '½', '1', '2', '3', '/', '−', '0', ',', '✓'];
        TECLES.forEach(t => {
            const b = C.el('button', {
                'type': 'button',
                'class': 'tecla' + (t === '✓' ? ' accepta' : t === '⌫' ? ' esborra' : ''),
                'text': t,
                'aria-label': { '⌫': 'Esborra', '✓': 'D’acord', '½': 'un mig', '/': 'barra de fracció', '−': 'menys', ',': 'coma' }[t] || t,
            });
            b.addEventListener('click', () => prem(t));
            teclat.appendChild(b);
        });
        caixa.append(D.el, teclat);
        lloc.appendChild(caixa);
        D.cel.forEach((e, i) => {
            if (fixes[i]) {
                e.replaceChildren(nombreBonic(fixes[i]));
                e.setAttribute('aria-label', `Casella ${i + 1}: ${F.text(fixes[i])}, fix`);
                return;
            }
            e.addEventListener('click', () => tria(i));
            e.addEventListener('keydown', ev => tecla(ev, i));
        });

        function inicia() {
            valors = new Array(9).fill(null);
            textos = new Array(9).fill('');
            Object.keys(fixes).forEach(i => (valors[i] = fixes[i]));
            actual = null;
            error = null;
            pinta();
            ctx.estat('');
        }
        function tria(i) {
            if (actual !== null && actual !== i) confirma(false);
            actual = i;
            pinta();
            D.cel[i].focus({ preventScroll: true });
        }
        function prem(t) {
            if (actual === null) {
                const lliure = D.cel.findIndex((e, i) => !fixes[i] && !valors[i]);
                tria(lliure >= 0 ? lliure : D.cel.findIndex((e, i) => !fixes[i]));
            }
            if (t === '⌫') textos[actual] = textos[actual].slice(0, -1);
            else if (t === '✓') {
                confirma(true);
                return;
            } else if (t === '−') textos[actual] = textos[actual].startsWith('−') ? textos[actual].slice(1) : '−' + textos[actual];
            else if (textos[actual].length < 8) textos[actual] += t;
            valors[actual] = null;
            error = null;
            ctx.amaga();
            pinta();
        }
        /** Llegeix el text de la casella actual; si avança, passa a la casella buida següent. */
        function confirma(avanca) {
            if (actual === null) return;
            const i = actual;
            const t = textos[i].trim();
            if (!t) {
                valors[i] = null;
            } else {
                const v = F.llegeix(t);
                if (!v) {
                    error = i;
                    ctx.missatge('error', `No entenc «${t}»`, ['Escriu un nombre: 3, 4½, 4 1/2, 9/2 o 4,5.']);
                    pinta();
                    return;
                }
                valors[i] = v;
                textos[i] = '';
            }
            error = null;
            if (avanca) {
                const seguent = [...Array(9).keys()].map(k => (i + 1 + k) % 9).find(k => !fixes[k] && !valors[k]);
                actual = seguent === undefined ? null : seguent;
            }
            canvi();
            if (avanca && actual !== null) D.cel[actual].focus({ preventScroll: true });
        }
        function tecla(ev, i) {
            const k = ev.key;
            const mou = { ArrowUp: -3, ArrowDown: 3, ArrowLeft: -1, ArrowRight: 1 }[k];
            if (mou !== undefined) {
                let j = i + mou;
                if (j >= 0 && j < 9 && !(Math.abs(mou) === 1 && Math.floor(j / 3) !== Math.floor(i / 3))) {
                    if (fixes[j]) j += mou;
                    if (j >= 0 && j < 9 && !fixes[j]) tria(j);
                }
                ev.preventDefault();
                return;
            }
            if (actual !== i) tria(i);
            if (/^[0-9]$/.test(k)) prem(k);
            else if (k === ',' || k === '.') prem(',');
            else if (k === '/') prem('/');
            else if (k === '-') prem('−');
            else if (k === ' ' && textos[i]) {
                textos[i] += ' ';
                pinta();
            } else if (k === 'Backspace') prem('⌫');
            else if (k === 'Delete') {
                textos[i] = '';
                valors[i] = null;
                canvi();
            } else if (k === 'Enter') prem('✓');
            else if (k === 'Escape') {
                actual = null;
                pinta();
            } else return;
            ev.preventDefault();
        }
        function pinta() {
            D.cel.forEach((e, i) => {
                if (fixes[i]) return;
                e.classList.toggle('actual', actual === i);
                e.classList.toggle('error', error === i);
                if (actual === i && (textos[i] || !valors[i])) {
                    e.replaceChildren(C.el('span', { class: 'escrit', text: textos[i] }), C.el('span', { class: 'cursor-text' }));
                } else e.replaceChildren(valors[i] ? nombreBonic(valors[i]) : '');
                e.setAttribute('aria-label', `Casella ${i + 1}: ${valors[i] ? F.text(valors[i]) : textos[i] || 'buida'}`);
            });
            const s = Q.sumes(valors);
            D.sumes.forEach((e, k) => {
                const v = s[k];
                e.replaceChildren();
                e.classList.remove('be', 'malament');
                if (!v) return;
                e.appendChild(nombreBonic(v));
                const be = F.igual(v, total);
                e.classList.add(be ? 'be' : 'malament');
                if (be) e.appendChild(C.el('span', { class: 'marca-be', text: '✓' }));
                e.setAttribute('aria-label', `${Q.LINIES3[k].nom}: suma ${F.text(v)}`);
            });
        }
        function canvi() {
            ctx.amaga();
            pinta();
            const r = Q.comprovaMagic(valors, total);
            const plenes = valors.filter(Boolean).length;
            ctx.estat([C.el('span', null, 'Caselles plenes: ', C.el('b', { text: `${plenes} de 9` }))]);
            if (!r.complet) return;
            if (r.resolt) {
                const frases = ['Totes les línies sumen 15 i els nou nombres són diferents.'];
                if (r.enters)
                    frases.push(
                        'I sense fraccions! Amb el 0, Dudeney s’equivocava: llegeix la nota del matemàtic.'
                    );
                else frases.push('El secret era aquest: un «nombre» no ha de ser per força un nombre enter.');
                ctx.resolt('Quadrat màgic!', frases);
                return;
            }
            const frases = [];
            if (r.repetits.length) {
                const v = valors[r.repetits[0]];
                frases.push(`Hi ha nombres repetits: el ${F.text(v)} hi surt més d’una vegada.`);
            }
            r.dolentes.slice(0, 3).forEach(k => {
                const l = Q.LINIES3[k];
                frases.push(`${l.nom[0].toUpperCase() + l.nom.slice(1)}: ${l.c.map(i => F.text(valors[i])).join(' + ')} = ${F.text(r.sumes[k])}, i no 15.`);
            });
            if (r.dolentes.length > 3) frases.push(`… i ${r.dolentes.length - 3} línies més.`);
            ctx.missatge('error', 'Encara no és màgic', frases);
        }
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Posa-la al tauler',
            solucio() {
                d.solucio.forEach((t, i) => {
                    if (!fixes[i]) valors[i] = F.llegeix(t);
                    textos[i] = '';
                });
                actual = null;
                error = null;
                ctx.amaga();
                pinta();
                ctx.missatge('info', 'La solució de Dudeney', ['Amb mitjos: 4½, 2½, 7½ i 5½.']);
            },
        };
    }

    // ════════════════════════════════════════════════════════════
    // CARTES (el quadrat de Bachet)
    // ════════════════════════════════════════════════════════════
    const NOM_VALOR = { A: 'as', K: 'rei', Q: 'dama', J: 'valet' };
    const NOM_PAL = { D: 'diamants', S: 'piques', H: 'cors', C: 'trèvols' };
    const SIMBOL = { D: '♦', S: '♠', H: '♥', C: '♣' };
    const PAL_TECLA = { d: 'D', p: 'S', c: 'H', t: 'C' };
    const PALS_SVG = {
        H: 'M0 9 C-11 0 -12 -8 -6 -10 C-3 -11 -1 -9 0 -6 C1 -9 3 -11 6 -10 C12 -8 11 0 0 9 Z',
        D: 'M0 -11 L8 0 L0 11 L-8 0 Z',
        S: 'M0 -11 C-11 -2 -12 5 -6 6 C-3 6.5 -1.5 4.5 -1 3 L-3.5 10 L3.5 10 L1 3 C1.5 4.5 3 6.5 6 6 C12 5 11 -2 0 -11 Z',
        C: 'M-1.6 2 C-4 6 -10 7 -10 1.5 C-10 -3 -5 -3.6 -3 -1.4 C-6 -4 -5 -10 0 -10 C5 -10 6 -4 3 -1.4 C5 -3.6 10 -3 10 1.5 C10 7 4 6 1.6 2 L3.5 10 L-3.5 10 Z',
    };
    const nomCarta = c => `${NOM_VALOR[c[0]]} de ${NOM_PAL[c[1]]}`;
    function simbolPal(p, mida) {
        const s = C.svg('svg', { 'viewBox': '-12 -12 24 24', 'class': 'simbol-pal', 'aria-hidden': 'true', 'width': mida, 'height': mida });
        C.svg('path', { d: PALS_SVG[p] }, s);
        return s;
    }
    function carta(c) {
        const e = C.el('div', { 'class': 'carta' + (c[1] === 'H' || c[1] === 'D' ? ' vermella' : ''), 'data-c': c });
        e.append(
            C.el('span', { class: 'cantonada' }, C.el('span', { class: 'valor', text: c[0] }), simbolPal(c[1], 12)),
            C.el('span', { class: 'centre' }, simbolPal(c[1], 30))
        );
        e.setAttribute('aria-label', nomCarta(c));
        return e;
    }

    function figuraCartes(p, opcions = {}) {
        const d = p.dades;
        const g = C.el('div', { 'class': 'quadrat-cartes estatic', 'role': 'img', 'aria-label': opcions.etiqueta || 'El diagrama 3 de Dudeney' });
        const llista = opcions.cartes || d.solucio;
        llista.forEach(c => {
            const s = C.el('div', { class: 'slot' });
            if (c) s.appendChild(carta(c));
            g.appendChild(s);
        });
        return g;
    }
    function figuraLletres(lletres, etiqueta, simbols) {
        const g = C.el('div', { 'class': 'quadrat-lletres', 'role': 'img', 'aria-label': etiqueta });
        lletres.forEach(l => g.appendChild(C.el('span', { class: simbols && (l === 'H' || l === 'D') ? 'vermella' : '', text: simbols ? SIMBOL[l] : l })));
        return g;
    }

    function creaCartes(lloc, p, ctx) {
        const d = p.dades;
        let quadrat, triada; // triada: { de: 'pila' | índex de casella, c }
        const caixa = C.el('div', { class: 'tauler cartes' });
        const graella = C.el('div', { 'class': 'quadrat-cartes', 'role': 'grid', 'aria-label': 'Quadrat de 4 × 4' });
        const slots = [];
        for (let i = 0; i < 16; i++) {
            const s = C.el('button', { 'type': 'button', 'class': 'slot', 'data-i': i });
            s.addEventListener('click', () => {
                if (!C.acabaDeArrossegar()) tocaSlot(i);
            });
            s.addEventListener('keydown', e => tecla(e, i));
            graella.appendChild(s);
            slots.push(s);
        }
        const pila = C.el('div', { 'class': 'pila-cartes', 'role': 'group', 'aria-label': 'Cartes que queden' });
        const cartes = {};
        Q.CARTES.forEach(c => {
            const e = carta(c);
            e.setAttribute('role', 'button');
            e.setAttribute('tabindex', '0');
            e.addEventListener('click', ev => {
                ev.stopPropagation();
                if (!C.acabaDeArrossegar()) tocaCarta(c);
            });
            e.addEventListener('keydown', ev => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    tocaCarta(c);
                }
            });
            cartes[c] = e;
        });
        pila.addEventListener('click', () => {
            if (triada && triada.de !== 'pila') {
                quadrat[triada.de] = null;
                triada = null;
                canvi();
            }
        });
        caixa.append(graella, pila);
        lloc.appendChild(caixa);

        // Arrossegar una carta (de la pila o del quadrat) a una casella o fora
        C.arrossega(caixa, {
            inici: e => {
                const el = e.target.closest('.carta');
                if (!el) return null;
                const c = el.dataset.c;
                const r = el.getBoundingClientRect();
                return { c, el, dx: e.clientX - r.left, dy: e.clientY - r.top };
            },
            comenca: k => {
                triada = null;
                const r = k.el.getBoundingClientRect();
                k.fantasma = k.el.cloneNode(true);
                k.fantasma.classList.add('fantasma');
                k.fantasma.style.width = r.width + 'px';
                k.fantasma.style.height = r.height + 'px';
                document.body.appendChild(k.fantasma);
                k.el.classList.add('origen');
            },
            mou: (k, e) => {
                k.fantasma.style.left = e.clientX - k.dx + 'px';
                k.fantasma.style.top = e.clientY - k.dy - (k.tactil ? 40 : 0) + 'px';
            },
            deixa: (k, e) => {
                k.fantasma.remove();
                k.el.classList.remove('origen');
                k.fantasma.style.display = 'none';
                const sota = document.elementFromPoint(e.clientX, e.clientY - (k.tactil ? 40 : 0));
                const slot = sota && sota.closest('.slot');
                const de = quadrat.indexOf(k.c);
                if (slot && graella.contains(slot)) posa(k.c, +slot.dataset.i);
                else if (de >= 0) {
                    quadrat[de] = null;
                    canvi();
                } else pinta();
            },
            cancela: k => {
                if (k.fantasma) k.fantasma.remove();
                k.el.classList.remove('origen');
            },
        });

        function inicia() {
            quadrat = new Array(16).fill(null);
            triada = null;
            canvi();
        }
        /** Posa la carta c a la casella i (si n'hi havia una altra, s'intercanvien o torna a la pila). */
        function posa(c, i) {
            const de = quadrat.indexOf(c);
            const abans = quadrat[i];
            if (de >= 0) quadrat[de] = abans; // intercanvi dins del quadrat
            quadrat[i] = c;
            triada = null;
            canvi();
        }
        function tocaCarta(c) {
            const de = quadrat.indexOf(c);
            if (triada && triada.c === c) triada = null;
            else if (triada && de >= 0) {
                posa(triada.c, de);
                return;
            } else triada = { de: de >= 0 ? de : 'pila', c };
            pinta();
        }
        function tocaSlot(i) {
            if (triada) {
                posa(triada.c, i);
                return;
            }
            if (quadrat[i]) tocaCarta(quadrat[i]);
        }
        function tecla(e, i) {
            const mou = { ArrowUp: -4, ArrowDown: 4, ArrowLeft: -1, ArrowRight: 1 }[e.key];
            if (mou !== undefined) {
                const j = i + mou;
                if (j >= 0 && j < 16 && !(Math.abs(mou) === 1 && Math.floor(j / 4) !== Math.floor(i / 4))) slots[j].focus();
                e.preventDefault();
                return;
            }
            const k = e.key.toLowerCase();
            if (e.key === 'Delete' || e.key === 'Backspace') {
                quadrat[i] = null;
                canvi();
                e.preventDefault();
            } else if ('akqj'.includes(k) && k.length === 1) {
                slots[i].dataset.valor = k.toUpperCase();
                e.preventDefault();
            } else if (PAL_TECLA[k] && slots[i].dataset.valor) {
                posa(slots[i].dataset.valor + PAL_TECLA[k], i);
                delete slots[i].dataset.valor;
                slots[i].focus();
                e.preventDefault();
            } else if (e.key === 'Escape') {
                triada = null;
                pinta();
            }
        }
        function pinta(xocs) {
            slots.forEach((s, i) => {
                const c = quadrat[i];
                if (c) s.replaceChildren(cartes[c]);
                else s.replaceChildren();
                s.classList.toggle('xoca', !!(xocs && xocs.has(i)));
                s.setAttribute('aria-label', `Casella ${Math.floor(i / 4) + 1}-${(i % 4) + 1}: ${c ? nomCarta(c) : 'buida'}`);
            });
            const queden = Q.CARTES.filter(c => !quadrat.includes(c));
            pila.replaceChildren(...queden.map(c => cartes[c]));
            Object.keys(cartes).forEach(c => cartes[c].classList.toggle('triada', !!(triada && triada.c === c)));
            caixa.classList.toggle('amb-seleccio', !!triada);
        }
        function canvi() {
            ctx.amaga();
            const n = quadrat.filter(Boolean).length;
            ctx.estat([C.el('span', null, 'Cartes al quadrat: ', C.el('b', { text: `${n} de 16` }))]);
            if (n < 16) {
                pinta();
                return;
            }
            const xocs = Q.conflictesBachet(quadrat);
            if (!xocs.length) {
                pinta();
                ctx.resolt('Quadrat de Bachet!', ['Cap fila, columna ni diagonal no repeteix pal ni valor.']);
                return;
            }
            const marcades = new Set();
            xocs.forEach(x => x.caselles.forEach(i => marcades.add(i)));
            pinta(marcades);
            const frases = [];
            const vistes = new Set();
            xocs.forEach(x => {
                const l = Q.LINIES4[x.linia];
                const c = quadrat[x.caselles[0]];
                const que = x.que === 'pal' ? `dues cartes de ${NOM_PAL[c[1]]}` : `dos ${{ A: 'asos', K: 'reis', Q: 'dames', J: 'valets' }[c[0]]}`;
                const t = `${l.nom[0].toUpperCase() + l.nom.slice(1)}: ${que}.`;
                if (!vistes.has(t) && frases.length < 4) frases.push(t);
                vistes.add(t);
            });
            if (vistes.size > frases.length) frases.push(`… i ${vistes.size - frases.length} més.`);
            ctx.missatge('error', 'Hi ha repeticions', frases);
        }
        inicia();
        return {
            reinicia: inicia,
            textSolucio: '▶ Posa-la al tauler (el diagrama 3)',
            solucio() {
                quadrat = d.solucio.slice();
                triada = null;
                ctx.amaga();
                pinta();
                ctx.estat([C.el('span', null, 'Cartes al quadrat: ', C.el('b', { text: '16 de 16' }))]);
                ctx.missatge('info', 'El diagrama 3 de Dudeney', ['Una de les 1.152 maneres.']);
            },
        };
    }

    window.Taulers.magic = {
        crea: creaMagic,
        figura: figuraMagic,
        figuraSolucio: p => C.el('figure', { class: 'figura-solucio' }, figuraMagic(p, { solucio: true })),
    };
    window.Taulers.cartes = {
        crea: creaCartes,
        figura: figuraCartes,
        figuraLletres,
        figuraSolucio: p =>
            C.el(
                'figure',
                { class: 'figura-solucio diagrames-bachet' },
                C.el(
                    'div',
                    { class: 'fila-diagrames' },
                    C.el('div', null, C.el('p', { class: 'num-diagrama', text: '1' }), figuraLletres(p.dades.diagrama1, 'Diagrama 1: els valors')),
                    C.el('div', null, C.el('p', { class: 'num-diagrama', text: '2' }), figuraLletres(p.dades.diagrama2, 'Diagrama 2: els pals', true)),
                    C.el('div', null, C.el('p', { class: 'num-diagrama', text: '3' }), figuraCartes(p))
                )
            ),
    };
})();
