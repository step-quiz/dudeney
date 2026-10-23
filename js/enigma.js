/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/enigma.js
 * ROL: El controlador de la pàgina d'un enigma (enigma.html?p=<id>): posa
 *   l'enunciat, el tauler del seu tipus, les pistes (d'una en una), la solució
 *   de Dudeney i la nota del matemàtic; la capçalera «Enigma n de N», el
 *   comptador de resolts, ‹ Escull… › i el diàleg per triar enigma.
 * ARQUITECTURA: Les dades són a window.DUDENEY (js/<tipus>/problemes.js) i
 *   cada tauler a window.Taulers[nom] (js/<tipus>/tauler.js), amb
 *   crea(lloc, problema, ctx) → { reinicia(), desfes?(), solucio?() }.
 *   El tauler parla amb la pàgina a través de ctx: missatge(), amaga(),
 *   estat(), desfes(), resolt(). ?p= accepta l'id («mercer») o el número (1…).
 * DEPENDÈNCIES: js/comu/comu.js, totes les dades i tots els taulers.
 * ============================================================================
 */
(() => {
    'use strict';
    const C = window.Comu;
    const $ = id => document.getElementById(id);
    const LLISTA = window.Dudeney.llista();
    const progres = C.progres();
    let actual = 0;
    let joc = null;
    let pistesVistes = 0;
    let reproduccio = null;

    const els = {
        emblema: $('emblema'),
        nomTipus: $('nom-tipus'),
        dificultat: $('dificultat'),
        titolProblema: $('titol-problema'),
        jaResolt: $('ja-resolt'),
        comptador: $('comptador'),
        anterior: $('btn-anterior'),
        seguent: $('btn-seguent'),
        tria: $('btn-tria'),
        titol: $('titol'),
        original: $('original'),
        enunciat: $('text-enunciat'),
        comEsJuga: $('com-es-juga'),
        regla: $('regla'),
        tauler: $('tauler-wrap'),
        estat: $('estat-joc'),
        missatge: $('missatge'),
        desfes: $('btn-desfes'),
        reinicia: $('btn-reinicia'),
        llistaPistes: $('llista-pistes'),
        btnPista: $('btn-pista'),
        solucio: $('solucio'),
        textSolucio: $('text-solucio'),
        nota: $('nota'),
        textNota: $('text-nota'),
        dialeg: $('dialeg-tria'),
        grups: $('tria-grups'),
        tanca: $('btn-tanca-tria'),
        esborra: $('btn-esborra-progres'),
    };

    // ============================================================
    // EL CONTEXT QUE REP EL TAULER
    // ============================================================
    const ctx = {
        missatge: (tipus, titol, frases, boto) => C.missatge(els.missatge, tipus, titol, frases, boto),
        amaga: () => C.amagaMissatge(els.missatge),
        estat: contingut => {
            if (typeof contingut === 'string') els.estat.textContent = contingut;
            else els.estat.replaceChildren(...[].concat(contingut || []).filter(x => x !== null && x !== undefined));
        },
        desfes: disponible => {
            els.desfes.disabled = !disponible;
        },
        /** L'enigma s'ha resolt: es desa i es felicita (amb el botó de l'enigma següent). */
        resolt: (titol, frases, extra) => {
            const p = LLISTA[actual];
            progres.marcaResolt(p.id);
            actualitza();
            const boto = botoSeguent();
            C.missatge(els.missatge, 'ok', titol, frases || [], boto);
            if (extra) els.missatge.appendChild(extra);
            else if (p.extra) els.missatge.appendChild(repteExtra(p.extra));
            boto.focus({ preventScroll: true });
        },
        /** Una pregunta curta per després de resoldre (per exemple, «de quantes maneres?»). */
        repteExtra: e => repteExtra(e),
        get problema() {
            return LLISTA[actual];
        },
    };

    // ============================================================
    // CARREGAR UN ENIGMA
    // ============================================================
    function carrega(i) {
        if (i < 0 || i >= LLISTA.length) return;
        if (reproduccio) reproduccio.atura();
        reproduccio = null;
        actual = i;
        const p = LLISTA[i];
        document.body.dataset.tipus = p.tipus;
        document.title = `${p.titol} — Els enigmes de Dudeney`;

        // Capçalera del panell
        els.emblema.replaceChildren(C.emblema(p.tipus));
        els.nomTipus.textContent = C.TIPUS[p.tipus].nom;
        els.dificultat.replaceWith((els.dificultat = C.dificultat(p.dificultat, C.NOM_DIFICULTAT[p.dificultat])));
        els.dificultat.id = 'dificultat';

        // Enunciat
        els.titol.textContent = p.titol;
        const llibre = C.LLIBRES[p.font.llibre];
        els.original.replaceChildren(
            C.el('span', { lang: 'en', text: p.font.titolOriginal }),
            ', ',
            C.el('cite', { lang: 'en', text: llibre.titol }),
            ` (${llibre.any}), núm. ${p.font.numero}`
        );
        els.enunciat.innerHTML = p.enunciat.join('');
        if (p.figuraEnunciat && window.Taulers[p.tauler].figura) {
            const fig = C.el('figure', { class: 'figura-enunciat' });
            const dib = window.Taulers[p.tauler].figura(p, p.figuraEnunciat);
            dib.classList.add('figura-estatica');
            fig.append(dib, C.el('figcaption', { text: p.figuraEnunciat.peu || '' }));
            els.enunciat.insertBefore(fig, els.enunciat.children[p.figuraEnunciat.despres || 2] || null);
        }
        C.unitats(els.enunciat);

        // Com es juga i regla
        els.comEsJuga.replaceChildren(
            C.el('ul', null, p.comEsJuga.map(t => C.el('li', { html: t }))),
            p.tecles ? C.el('p', { class: 'tecles', html: 'Amb el teclat: ' + p.tecles }) : null
        );
        els.regla.innerHTML = p.regla;

        // Tauler
        C.amagaMissatge(els.missatge);
        els.estat.replaceChildren();
        els.tauler.replaceChildren();
        const T = window.Taulers[p.tauler];
        joc = T.crea(els.tauler, p, ctx);
        els.desfes.hidden = !joc.desfes;
        els.desfes.disabled = true;

        // Pistes, solució i nota
        pistesVistes = 0;
        els.llistaPistes.replaceChildren();
        actualitzaBotoPista();
        els.solucio.open = false;
        els.nota.open = false;
        pintaSolucio(p);
        els.textNota.innerHTML = p.notaMatematic.join('');
        C.unitats(els.textNota);

        // Adreça i progrés
        progres.dades.darrer = p.id;
        progres.desa();
        try {
            history.replaceState(null, '', '?p=' + p.id);
        } catch (e) {
            /* file:// en alguns navegadors */
        }
        actualitza();
    }

    function pintaSolucio(p) {
        els.textSolucio.replaceChildren();
        const caixa = C.el('div', { class: 'text' });
        caixa.innerHTML = p.solucioDudeney.join('');
        els.textSolucio.appendChild(caixa);
        // La figura de la solució (el tauler la dibuixa)
        const T = window.Taulers[p.tauler];
        if (T.figuraSolucio) {
            const fig = T.figuraSolucio(p);
            if (fig) caixa.insertBefore(fig, caixa.children[p.posicioFiguraSolucio || 1] || null);
        }
        if (joc && joc.solucio) {
            const fila = C.el('div', { class: 'reproduccio' });
            const boto = C.el('button', {
                type: 'button',
                class: 'btn-sec',
                text: joc.textSolucio || '▶ Mira-la al tauler',
            });
            boto.addEventListener('click', () => {
                if (reproduccio) reproduccio.atura();
                C.amagaMissatge(els.missatge);
                reproduccio = joc.solucio() || null;
                els.tauler.scrollIntoView({ behavior: C.movimentReduit() ? 'auto' : 'smooth', block: 'center' });
            });
            fila.appendChild(boto);
            els.textSolucio.prepend(fila);
        }
        C.unitats(els.textSolucio);
    }

    // ============================================================
    // PISTES (d'una en una)
    // ============================================================
    function actualitzaBotoPista() {
        const p = LLISTA[actual];
        const queden = p.pistes.length - pistesVistes;
        els.btnPista.hidden = queden <= 0;
        els.btnPista.textContent = pistesVistes ? 'Una altra pista' : 'Vull una pista';
    }
    els.btnPista.addEventListener('click', () => {
        const p = LLISTA[actual];
        if (pistesVistes >= p.pistes.length) return;
        const li = C.el('li', { html: p.pistes[pistesVistes] });
        els.llistaPistes.appendChild(li);
        C.unitats(li);
        pistesVistes++;
        actualitzaBotoPista();
        if (els.btnPista.hidden) li.setAttribute('tabindex', '-1');
        (els.btnPista.hidden ? li : els.btnPista).focus({ preventScroll: true });
    });

    // ============================================================
    // REPTE EXTRA: una pregunta amb resposta numèrica
    // e = { pregunta (HTML), resposta (un nombre o una llista de nombres vàlids), be (HTML), malament (HTML) }
    // ============================================================
    function repteExtra(e) {
        const caixa = C.el('div', { class: 'extra' });
        caixa.appendChild(C.el('p', { html: e.pregunta }));
        const form = C.el('form');
        const id = 'extra-' + Math.random().toString(36).slice(2, 7);
        const input = C.el('input', {
            'id': id,
            'type': 'text',
            'inputmode': 'numeric',
            'autocomplete': 'off',
            'aria-label': 'Resposta',
        });
        const boto = C.el('button', { type: 'submit', class: 'btn-sec', text: 'Comprova' });
        const resposta = C.el('p', { 'class': 'resposta-extra', 'aria-live': 'polite' });
        form.append(input, boto);
        caixa.append(form, resposta);
        form.addEventListener('submit', ev => {
            ev.preventDefault();
            const n = parseInt(input.value.replace(/[\s. ]/g, ''), 10);
            const be = [].concat(e.resposta).includes(n);
            resposta.className = 'resposta-extra ' + (be ? 'be' : 'malament');
            resposta.innerHTML = Number.isNaN(n) ? 'Escriu un nombre.' : be ? '✓ ' + e.be : '✗ ' + e.malament;
        });
        return caixa;
    }

    // ============================================================
    // CAPÇALERA DEL PANELL, NAVEGACIÓ I DIÀLEG «ESCULL…»
    // ============================================================
    function actualitza() {
        const p = LLISTA[actual];
        els.titolProblema.textContent = `Enigma ${actual + 1} de ${LLISTA.length}`;
        els.jaResolt.hidden = !progres.esResolt(p.id);
        const n = LLISTA.filter(q => progres.esResolt(q.id)).length;
        els.comptador.textContent = `Resolts: ${n} / ${LLISTA.length}`;
        els.anterior.disabled = actual === 0;
        els.seguent.disabled = actual === LLISTA.length - 1;
    }
    function botoSeguent() {
        const boto = C.el('button', { type: 'button', class: 'btn-principal' });
        if (actual < LLISTA.length - 1) {
            const seguent = actual + 1;
            boto.textContent = 'Enigma següent';
            boto.addEventListener('click', () => {
                carrega(seguent);
                window.scrollTo({ top: 0, behavior: C.movimentReduit() ? 'auto' : 'smooth' });
            });
        } else {
            boto.textContent = 'Escull un altre enigma';
            boto.addEventListener('click', obreTria);
        }
        return boto;
    }

    function obreTria() {
        els.grups.replaceChildren();
        let focus = null;
        C.ORDRE_TIPUS.forEach(tipus => {
            const del = LLISTA.map((p, i) => ({ p, i })).filter(x => x.p.tipus === tipus);
            if (!del.length) return;
            const grup = C.el('section', { 'class': 'tria-grup', 'data-tipus': tipus });
            const h = C.el('h3', null, C.el('span', { class: 'emblema' }, C.emblema(tipus)), C.TIPUS[tipus].nom);
            const opcions = C.el('div', { class: 'opcions' });
            del.forEach(({ p, i }) => {
                const fet = progres.esResolt(p.id);
                const b = C.el('button', {
                    'type': 'button',
                    'class': (fet ? 'fet ' : '') + (i === actual ? 'actual' : ''),
                    'text': p.titol,
                    'aria-label': p.titol + (fet ? ', resolt' : ''),
                    'aria-current': i === actual ? 'true' : null,
                });
                b.addEventListener('click', () => {
                    els.dialeg.close();
                    carrega(i);
                });
                if (i === actual) focus = b;
                opcions.appendChild(b);
            });
            grup.append(h, opcions);
            els.grups.appendChild(grup);
        });
        els.esborra.textContent = 'Esborra els ✓';
        delete els.esborra.dataset.segur;
        els.dialeg.showModal();
        if (focus) focus.focus();
    }

    els.anterior.addEventListener('click', () => carrega(actual - 1));
    els.seguent.addEventListener('click', () => carrega(actual + 1));
    els.tria.addEventListener('click', obreTria);
    els.tanca.addEventListener('click', () => els.dialeg.close());
    // Esborrar els ✓ demana dos clics (sense finestres emergents)
    els.esborra.addEventListener('click', () => {
        if (!els.esborra.dataset.segur) {
            els.esborra.dataset.segur = '1';
            els.esborra.textContent = 'Segur? Torna-hi a fer clic per esborrar-los';
            return;
        }
        progres.esborra();
        els.dialeg.close();
        carrega(actual);
    });
    // Un clic fora del diàleg el tanca (amb el teclat, clientX = clientY = 0: no es tanca)
    els.dialeg.addEventListener('click', e => {
        if (e.target !== els.dialeg || e.detail === 0) return;
        const r = els.dialeg.getBoundingClientRect();
        const dins = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!dins) els.dialeg.close();
    });

    els.reinicia.addEventListener('click', () => {
        if (reproduccio) reproduccio.atura();
        C.amagaMissatge(els.missatge);
        joc.reinicia();
    });
    els.desfes.addEventListener('click', () => {
        if (reproduccio) reproduccio.atura();
        if (joc.desfes) joc.desfes();
    });

    // El primer enigma: el de l'adreça (?p=mercer o ?p=3) o el darrer que es va mirar
    function inicial() {
        const p = new URLSearchParams(location.search).get('p');
        if (p) {
            const perId = LLISTA.findIndex(q => q.id === p);
            if (perId >= 0) return perId;
            const n = parseInt(p, 10);
            if (n >= 1 && n <= LLISTA.length) return n - 1;
        }
        const darrer = LLISTA.findIndex(q => q.id === progres.dades.darrer);
        return darrer >= 0 ? darrer : 0;
    }
    carrega(inicial());
})();
