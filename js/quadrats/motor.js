/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/quadrats/motor.js
 * ROL: Quadrats de nombres i de cartes:
 *   - quadrat màgic 3 × 3 (AM 399, el vuit rebel): les tres files, les tres
 *     columnes i les dues diagonals han de sumar el mateix, amb nou nombres
 *     diferents (poden ser fraccions); el 8 ja hi és, al mig de dalt.
 *   - quadrat de Bachet (AM 304): les 16 figures (as, rei, dama i valet de cada
 *     pal) en un quadrat 4 × 4 sense repetir pal ni figura en cap fila, columna
 *     ni diagonal llarga; i el recompte de totes les maneres (1.152).
 *   - quadrat de dòminos (AM 406): 18 fitxes diferents de dòmino, posades de
 *     peu en un quadrat 6 × 6 (tres per columna), amb totes les files, les
 *     columnes i les dues diagonals llargues sumant el mateix.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Quadrat màgic: graella = 9 caselles (de dalt a baix i d'esquerra a dreta),
 *   cada una una fracció [n, d] o null.
 *   Bachet: graella = 16 caselles, cada una una carta 'AD' (figura + pal) o null;
 *   figures A K Q J, pals D (diamants) S (piques) H (cors) C (trèvols).
 *   Dòminos: llocs = 18 (columna c, de dalt a baix k: índex c·3 + k), cada un [punts de dalt,
 *   punts de baix] o null.
 * DEPENDÈNCIES: js/comu/fraccio.js (Fraccio)
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var F = typeof module === 'object' && module.exports ? require('../comu/fraccio.js') : arrel.Fraccio;
    var api = fabrica(F);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorQuadrats = api;
})(typeof self !== 'undefined' ? self : this, function (F) {
    'use strict';

    // Les vuit línies d'un quadrat 3 × 3
    var LINIES3 = [
        { nom: 'fila 1', c: [0, 1, 2] },
        { nom: 'fila 2', c: [3, 4, 5] },
        { nom: 'fila 3', c: [6, 7, 8] },
        { nom: 'columna 1', c: [0, 3, 6] },
        { nom: 'columna 2', c: [1, 4, 7] },
        { nom: 'columna 3', c: [2, 5, 8] },
        { nom: 'diagonal', c: [0, 4, 8] },
        { nom: 'diagonal', c: [2, 4, 6] },
    ];

    /** La suma de cada línia (null si hi falta algun nombre). */
    function sumes(graella) {
        return LINIES3.map(function (l) {
            var s = F.fr(0);
            for (var i = 0; i < 3; i++) {
                var v = graella[l.c[i]];
                if (!v) return null;
                s = F.suma(s, v);
            }
            return s;
        });
    }
    /** Les caselles que tenen un nombre repetit. */
    function repetits(graella) {
        var out = [];
        for (var i = 0; i < 9; i++)
            for (var j = 0; j < 9; j++)
                if (i !== j && graella[i] && graella[j] && F.igual(graella[i], graella[j])) {
                    out.push(i);
                    break;
                }
        return out;
    }
    /**
     * Comprova el quadrat màgic. Retorna { complet, resolt, sumes, dolentes: [índexs de línia],
     * repetits: [caselles], enters: tots els nombres enters, negatius }.
     */
    function comprovaMagic(graella, total) {
        var complet = graella.every(Boolean);
        var s = sumes(graella);
        var dolentes = [];
        s.forEach(function (x, i) {
            if (x && !F.igual(x, total)) dolentes.push(i);
        });
        var rep = repetits(graella);
        return {
            complet: complet,
            resolt: complet && !dolentes.length && !rep.length,
            sumes: s,
            dolentes: dolentes,
            repetits: rep,
            enters: complet && graella.every(F.esEnter),
            negatius: graella.some(function (v) {
                return v && v[0] < 0;
            }),
        };
    }
    /**
     * Totes les solucions amb el 8 a la casella fixa, en una família d'un paràmetre: al centre
     * hi ha d'haver total / 3 (= 5). Retorna la graella per a la cantonada de dalt a l'esquerra a.
     * (Només per a total 15 i el 8 a la casella 1, el cas de l'enigma.)
     */
    function familiaVuit(a) {
        // a, 8, 7 − a / 12 − 2a, 5, 2a − 2 / 3 + a, 2, 10 − a
        var f = function (n, d) {
            return F.fr(n, d);
        };
        var A = a;
        return [
            A,
            f(8),
            F.resta(f(7), A),
            F.resta(f(12), F.suma(A, A)),
            f(5),
            F.resta(F.suma(A, A), f(2)),
            F.suma(f(3), A),
            f(2),
            F.resta(f(10), A),
        ];
    }

    // ── Bachet ─────────────────────────────────────────────────────────────
    var FIGURES = ['A', 'K', 'Q', 'J'];
    var PALS = ['D', 'S', 'H', 'C'];
    var CARTES = [];
    FIGURES.forEach(function (f) {
        PALS.forEach(function (p) {
            CARTES.push(f + p);
        });
    });
    var LINIES4 = (function () {
        var l = [],
            i;
        for (i = 0; i < 4; i++) l.push({ nom: 'fila ' + (i + 1), c: [4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3] });
        for (i = 0; i < 4; i++) l.push({ nom: 'columna ' + (i + 1), c: [i, i + 4, i + 8, i + 12] });
        l.push({ nom: 'diagonal', c: [0, 5, 10, 15] });
        l.push({ nom: 'diagonal', c: [3, 6, 9, 12] });
        return l;
    })();
    /**
     * Les línies amb dues cartes de la mateixa figura o del mateix pal.
     * Retorna [{ linia, cartes: [c1, c2], que: 'figura' | 'pal' }].
     */
    function conflictesBachet(graella) {
        var out = [];
        LINIES4.forEach(function (l, li) {
            for (var a = 0; a < 4; a++)
                for (var b = a + 1; b < 4; b++) {
                    var x = graella[l.c[a]],
                        y = graella[l.c[b]];
                    if (!x || !y) continue;
                    if (x[0] === y[0]) out.push({ linia: li, caselles: [l.c[a], l.c[b]], que: 'figura' });
                    if (x[1] === y[1]) out.push({ linia: li, caselles: [l.c[a], l.c[b]], que: 'pal' });
                }
        });
        return out;
    }
    /** Totes les maneres de fer el quadrat (comptant girs i miralls com a diferents). */
    function compteBachet(limit) {
        var graella = new Array(16).fill(null),
            usada = {},
            n = 0,
            primera = null;
        // Les línies de cada casella
        var deCasella = [];
        for (var i = 0; i < 16; i++) deCasella.push([]);
        LINIES4.forEach(function (l) {
            l.c.forEach(function (c) {
                deCasella[c].push(l.c);
            });
        });
        (function posa(k) {
            if (limit && n >= limit) return;
            if (k === 16) {
                if (!primera) primera = graella.slice();
                n++;
                return;
            }
            for (var j = 0; j < 16; j++) {
                var c = CARTES[j];
                if (usada[c]) continue;
                var bona = deCasella[k].every(function (l) {
                    return l.every(function (q) {
                        var x = graella[q];
                        return !x || (x[0] !== c[0] && x[1] !== c[1]);
                    });
                });
                if (!bona) continue;
                usada[c] = true;
                graella[k] = c;
                posa(k + 1);
                graella[k] = null;
                usada[c] = false;
            }
        })(0);
        return { total: n, primera: primera };
    }

    // ── Quadrat de dòminos (AM 406) ────────────────────────────────────────
    /** Les 28 fitxes d'un joc de dòmino: [a, b] amb a ≤ b. */
    var FITXES_DOMINO = (function () {
        var out = [];
        for (var a = 0; a <= 6; a++) for (var b = a; b <= 6; b++) out.push([a, b]);
        return out;
    })();
    /** La quadrícula n × n (null on no hi ha fitxa) a partir dels llocs de les fitxes de peu. */
    function graellaDomino(llocs, n) {
        var g = [];
        for (var f = 0; f < n; f++) g.push(new Array(n).fill(null));
        llocs.forEach(function (fx, i) {
            if (!fx) return;
            var c = Math.floor(i / (n / 2)),
                k = i % (n / 2);
            g[2 * k][c] = fx[0];
            g[2 * k + 1][c] = fx[1];
        });
        return g;
    }
    /** Les sumes de les files, les columnes i les dues diagonals (null si hi falta algun nombre). */
    function sumesDomino(llocs, n) {
        var g = graellaDomino(llocs, n);
        var suma = function (cs) {
            var s = 0;
            for (var i = 0; i < cs.length; i++) {
                if (cs[i] === null) return null;
                s += cs[i];
            }
            return s;
        };
        var files = [],
            columnes = [],
            d1 = [],
            d2 = [];
        for (var i = 0; i < n; i++) {
            files.push(suma(g[i]));
            columnes.push(
                suma(
                    g.map(function (fila) {
                        return fila[i];
                    })
                )
            );
            d1.push(g[i][i]);
            d2.push(g[i][n - 1 - i]);
        }
        return { files: files, columnes: columnes, diagonals: [suma(d1), suma(d2)] };
    }
    /** null si les fitxes són totes diferents i totes les línies sumen «objectiu»; si no, el motiu. */
    function comprovaDomino(llocs, n, objectiu) {
        if (llocs.some(function (x) { return !x; })) return 'incomplet';
        var vistes = {};
        for (var i = 0; i < llocs.length; i++) {
            var k = Math.min(llocs[i][0], llocs[i][1]) + '-' + Math.max(llocs[i][0], llocs[i][1]);
            if (vistes[k]) return 'repetida';
            vistes[k] = true;
        }
        var s = sumesDomino(llocs, n);
        var totes = s.files.concat(s.columnes, s.diagonals);
        return totes.every(function (x) { return x === objectiu; }) ? null : 'sumes';
    }

    return {
        FITXES_DOMINO: FITXES_DOMINO,
        graellaDomino: graellaDomino,
        sumesDomino: sumesDomino,
        comprovaDomino: comprovaDomino,
        LINIES3: LINIES3,
        LINIES4: LINIES4,
        FIGURES: FIGURES,
        PALS: PALS,
        CARTES: CARTES,
        sumes: sumes,
        repetits: repetits,
        comprovaMagic: comprovaMagic,
        familiaVuit: familiaVuit,
        conflictesBachet: conflictesBachet,
        compteBachet: compteBachet,
    };
});
