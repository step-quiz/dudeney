/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/comu/comu.js
 * ROL: El que comparteixen totes les pàgines i tots els taulers:
 *   - crear elements HTML i SVG;
 *   - els set tipus d'enigma (nom, descripció, emblema) i els punts de dificultat;
 *   - el progrés desat al navegador (quins enigmes s'han resolt);
 *   - missatges sota el tauler i animacions;
 *   - les notes de les unitats antigues (un «quart», una «lliura»…);
 *   - arrossegar amb el ratolí, el dit o el llapis (Pointer Events), tocar;
 *   - desfer (historial) i reproduir una solució pas a pas.
 * ARQUITECTURA: window.Comu. No depèn de cap altre fitxer. Els taulers
 *   (js/<tipus>/tauler.js) i els controladors de pàgina (js/enigma.js,
 *   js/portada.js, js/imprimir.js) el fan servir.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
window.Comu = (() => {
    'use strict';
    const NS = 'http://www.w3.org/2000/svg';

    // ============================================================
    // ELEMENTS
    // ============================================================
    /** Un element HTML: el('p', { class: 'x', text: 'Hola' }, fill1, fill2…) */
    function el(etiqueta, atributs, ...fills) {
        const e = document.createElement(etiqueta);
        posaAtributs(e, atributs);
        fills.flat().forEach(f => f !== null && f !== undefined && e.append(f));
        return e;
    }
    /** Un element SVG (amb pare opcional). */
    function svg(etiqueta, atributs, pare) {
        const e = document.createElementNS(NS, etiqueta);
        posaAtributs(e, atributs);
        if (pare) pare.appendChild(e);
        return e;
    }
    function posaAtributs(e, atributs) {
        if (!atributs) return;
        Object.keys(atributs).forEach(k => {
            const v = atributs[k];
            if (v === null || v === undefined || v === false) return;
            if (k === 'text') e.textContent = v;
            else if (k === 'html') e.innerHTML = v;
            else if (k === 'class') e.setAttribute('class', v);
            else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
            else e.setAttribute(k, v === true ? '' : v);
        });
    }
    /** Les coordenades (de l'SVG) d'un punt de la pantalla. */
    function coords(elSvg, clientX, clientY) {
        const m = elSvg.getScreenCTM();
        if (!m) return { x: 0, y: 0 };
        const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
        return { x: p.x, y: p.y };
    }

    // ============================================================
    // TIPUS D'ENIGMA
    // ============================================================
    const TIPUS = {
        disseccio: { nom: 'Dissecció', descripcio: 'Peces que es mouen, giren i s’ajunten fins a fer una figura nova.' },
        fitxes: { nom: 'Fitxes', descripcio: 'Moure o fer saltar fitxes, d’una en una, amb el mínim de moviments.' },
        mesures: { nom: 'Mesures i travesses', descripcio: 'Gerres que es buiden i s’omplen, barques que van i vénen.' },
        escacs: { nom: 'Escacs', descripcio: 'Posar peces al tauler perquè compleixin unes condicions.' },
        camins: { nom: 'Camins', descripcio: 'Recorreguts per un mapa: per totes les línies o per totes les ciutats.' },
        quadrats: { nom: 'Quadrats màgics', descripcio: 'Omplir una quadrícula perquè totes les línies quadrin.' },
        aritmetica: { nom: 'Aritmètica', descripcio: 'Comptes i mesures amb una resposta numèrica.' },
    };
    const ORDRE_TIPUS = Object.keys(TIPUS);

    // Els emblemes: dibuixos de línia de 24 × 24, del color del tema
    const EMBLEMES = {
        disseccio: 'M4 19 L12 5 L20 19 Z M9.5 19 L14.5 10.4 M8 12 L13 15',
        fitxes: 'M5 18h14 M7 15h10 M8.5 12h7 M10 9h4 M5 18v-1.2 M19 18v-1.2',
        mesures: 'M8 4h7l-1 3 3 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9l2-2z M7.2 13h9.6',
        escacs: 'M6 18h12 M7 18l-1.5-9 4 3 2.5-6 2.5 6 4-3L17 18',
        camins: 'M5 17 L10 8 L15 15 L19 6 M5 17h0.01 M10 8h0.01 M15 15h0.01 M19 6h0.01',
        quadrats: 'M5 5h14v14H5z M5 9.7h14 M5 14.3h14 M9.7 5v14 M14.3 5v14',
        aritmetica: 'M4 8h16v8H4z M11 8l1 2-1.5 2 1.5 2-1 2',
    };
    function emblema(tipus) {
        const s = svg('svg', { 'viewBox': '0 0 24 24', 'aria-hidden': 'true', 'class': 'emblema-svg' });
        svg(
            'path',
            {
                'd': EMBLEMES[tipus] || '',
                'fill': 'none',
                'stroke': 'currentColor',
                'stroke-width': tipus === 'camins' ? 1.9 : 1.7,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            },
            s
        );
        if (tipus === 'camins')
            [
                [5, 17],
                [10, 8],
                [15, 15],
                [19, 6],
            ].forEach(p => svg('circle', { cx: p[0], cy: p[1], r: 2.1, fill: 'currentColor' }, s));
        return s;
    }
    /** Els punts de dificultat (1, 2 o 3 de 3). */
    function dificultat(n, etiqueta) {
        const e = el('span', {
            'class': 'dificultat',
            'role': 'img',
            'aria-label': `Dificultat ${n} de 3${etiqueta ? ': ' + etiqueta : ''}`,
        });
        for (let i = 1; i <= 3; i++) e.appendChild(el('i', { class: i <= n ? 'ple' : '' }));
        return e;
    }
    const NOM_DIFICULTAT = { 1: 'per començar', 2: 'mitjana', 3: 'difícil' };
    const LLIBRES = {
        cp: { titol: 'The Canterbury Puzzles', any: 1907 },
        am: { titol: 'Amusements in Mathematics', any: 1917 },
    };

    // ============================================================
    // PROGRÉS: { resolts: [ids], darrer: id }
    // Si el navegador no deixa desar, es juga igual però no es recorda res.
    // ============================================================
    const CLAU = 'dudeney.progres';
    function progres() {
        const dades = { resolts: [], darrer: null };
        try {
            const d = JSON.parse(localStorage.getItem(CLAU));
            if (d && Array.isArray(d.resolts)) Object.assign(dades, d);
        } catch (e) {
            /* sense localStorage */
        }
        function desa() {
            try {
                localStorage.setItem(CLAU, JSON.stringify(dades));
            } catch (e) {
                /* sense localStorage */
            }
        }
        return {
            dades,
            desa,
            esResolt: id => dades.resolts.includes(id),
            marcaResolt(id) {
                if (dades.resolts.includes(id)) return;
                dades.resolts.push(id);
                desa();
            },
            esborra() {
                dades.resolts = [];
                desa();
            },
        };
    }

    // ============================================================
    // MISSATGES I ANIMACIONS
    // ============================================================
    function missatge(lloc, tipus, titol, frases = [], boto = null) {
        lloc.className = 'missatge ' + tipus;
        lloc.replaceChildren(el('div', { class: 'missatge-titol', text: titol }));
        if (frases.length) lloc.appendChild(el('ul', null, frases.map(f => el('li', { text: f }))));
        if (boto) lloc.appendChild(boto);
    }
    function amagaMissatge(lloc) {
        lloc.className = 'missatge';
        lloc.replaceChildren();
    }
    function anima(e, classe) {
        if (!e) return;
        e.classList.remove(classe);
        void e.getBoundingClientRect(); // torna a començar l'animació
        e.classList.add(classe);
        e.addEventListener('animationend', () => e.classList.remove(classe), { once: true });
    }
    const movimentReduit = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================================
    // NOTES DE LES UNITATS (<span class="unitat" data-nota="1 quart ≈ 1,14 litres">quarts</span>)
    // Es converteixen en botons: en tocar-los (o en passar-hi el ratolí) surt la nota.
    // ============================================================
    function unitats(arrel) {
        arrel.querySelectorAll('span.unitat[data-nota]').forEach(s => {
            const b = el('button', { 'type': 'button', 'class': 'unitat', 'aria-expanded': 'false' });
            b.textContent = s.textContent;
            const nota = s.dataset.nota;
            b.setAttribute('aria-label', `${s.textContent} (${nota})`);
            let bombolla = null;
            const mostra = () => {
                if (bombolla) return;
                bombolla = el('span', { 'class': 'bombolla', 'role': 'tooltip', 'text': nota });
                b.appendChild(bombolla);
                b.setAttribute('aria-expanded', 'true');
            };
            const amaga = () => {
                if (!bombolla) return;
                bombolla.remove();
                bombolla = null;
                b.setAttribute('aria-expanded', 'false');
            };
            b.addEventListener('click', e => {
                e.stopPropagation();
                if (bombolla) amaga();
                else mostra();
            });
            b.addEventListener('mouseenter', mostra);
            b.addEventListener('mouseleave', amaga);
            b.addEventListener('blur', amaga);
            b.addEventListener('keydown', e => e.key === 'Escape' && amaga());
            document.addEventListener('click', amaga);
            s.replaceWith(b);
        });
    }

    // ============================================================
    // ARROSSEGAR I TOCAR (Pointer Events: ratolí, dit i llapis amb el mateix codi)
    // opcions: inici(e) → objecte (o null si no es pot arrossegar),
    //          comenca(c, e), mou(c, e), deixa(c, e), toc(c, e), cancel·la(c)
    // Després d'arrossegar no es fa cas del clic que ve a continuació.
    // ============================================================
    let acabaDArrossegar = false;
    function arrossega(element, o) {
        element.addEventListener('pointerdown', e => {
            if (e.button !== undefined && e.button > 0) return;
            const c = o.inici(e);
            if (!c) return;
            c.x0 = e.clientX;
            c.y0 = e.clientY;
            c.actiu = false;
            c.tactil = e.pointerType === 'touch' || e.pointerType === 'pen';
            const id = e.pointerId;
            const mou = ev => {
                if (ev.pointerId !== id) return;
                if (!c.actiu) {
                    if (Math.hypot(ev.clientX - c.x0, ev.clientY - c.y0) < 6) return;
                    c.actiu = true;
                    if (o.comenca) o.comenca(c, ev);
                }
                ev.preventDefault();
                o.mou(c, ev);
            };
            const acaba = ev => {
                if (ev.pointerId !== id) return;
                neteja();
                if (c.actiu) {
                    o.deixa(c, ev);
                    acabaDArrossegar = true;
                    setTimeout(() => (acabaDArrossegar = false), 0);
                } else if (o.toc) o.toc(c, ev);
            };
            const cancela = ev => {
                if (ev.pointerId !== id) return;
                neteja();
                if (o.cancela) o.cancela(c);
            };
            function neteja() {
                document.removeEventListener('pointermove', mou);
                document.removeEventListener('pointerup', acaba);
                document.removeEventListener('pointercancel', cancela);
            }
            document.addEventListener('pointermove', mou, { passive: false });
            document.addEventListener('pointerup', acaba);
            document.addEventListener('pointercancel', cancela);
        });
    }
    const acabaDeArrossegar = () => acabaDArrossegar;

    // ============================================================
    // DESFER I REPRODUIR
    // ============================================================
    /** Una pila d'estats per poder desfer. copia(estat) ha de fer una còpia independent. */
    function historial(copia) {
        const pila = [];
        return {
            desa: estat => pila.push(copia(estat)),
            desfes: () => pila.pop(),
            buida: () => (pila.length = 0),
            get mida() {
                return pila.length;
            },
        };
    }
    /** Fa els passos un darrere l'altre (cada ms mil·lisegons); retorna { atura() }. */
    function reprodueix(passos, fes, ms, acaba) {
        let i = 0,
            temps = null;
        const seguent = () => {
            if (i >= passos.length) {
                temps = null;
                if (acaba) acaba();
                return;
            }
            fes(passos[i], i);
            i++;
            temps = setTimeout(seguent, ms);
        };
        temps = setTimeout(seguent, Math.min(ms, 300));
        return {
            atura() {
                if (temps) clearTimeout(temps);
                temps = null;
            },
            get enMarxa() {
                return temps !== null;
            },
        };
    }

    // ============================================================
    // TEXT
    // ============================================================
    /** «3025», «10 000» (amb espai fi a partir de cinc xifres), «−3» */
    function nombre(n) {
        let s = String(Math.abs(n));
        if (s.length > 4) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f');
        return (n < 0 ? '−' : '') + s;
    }
    /** «40,719» (amb coma decimal); «1 152,5» */
    function decimal(x, d) {
        const [e, f] = Math.abs(x).toFixed(d).split('.');
        return (x < 0 ? '−' : '') + nombre(+e) + (f ? ',' + f : '');
    }
    /** Una mesura: sense decimals si és entera (40), amb d decimals si no (43,174). */
    function mesura(x, d = 3) {
        const r = +x.toFixed(d);
        return Number.isInteger(r) ? nombre(r) : decimal(x, d);
    }
    /** «1 moviment», «33 moviments» */
    const plural = (n, u, p) => `${nombre(n)} ${n === 1 ? u : p || u + 's'}`;

    return {
        el,
        svg,
        coords,
        TIPUS,
        ORDRE_TIPUS,
        emblema,
        dificultat,
        NOM_DIFICULTAT,
        LLIBRES,
        progres,
        missatge,
        amagaMissatge,
        anima,
        movimentReduit,
        unitats,
        arrossega,
        acabaDeArrossegar,
        historial,
        reprodueix,
        nombre,
        decimal,
        mesura,
        plural,
    };
})();
