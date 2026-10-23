/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/fitxes/motor.js
 * ROL: Les regles dels trencaclosques de fitxes que es mouen o salten:
 *   - piles: formatges (discos) en tamborets; es mou un formatge de dalt d'un
 *     tamboret a un altre, mai a sobre d'un de més petit (CP 1, la torre de
 *     Hanoi amb quatre tamborets).
 *   - salts: fitxes en una filera amb un sol forat; una fitxa passa al forat si
 *     és al costat o si només n'hi ha una entre mig (AM 214, les sis granotes).
 *   Per a cada model: moviments legals, aplicar-los, saber si està resolt, i els
 *   veïns per a la cerca en amplada (el mínim de moviments es comprova als tests).
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   piles: estat = [[mides de baix a dalt], …] (una llista per tamboret)
 *   salts: estat = [fitxa | 0, …] (0 = el forat)
 *   frameStewart(n, k): el nombre mínim de moviments (fórmula de Frame–Stewart,
 *   demostrada òptima per a quatre tamborets per T. Bousch el 2014).
 *   granotesDudeney(n): la fórmula de Dudeney per a n granotes (AM 214).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorFitxes = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── Piles (formatges i tamborets) ──────────────────────────────────────
    var piles = {
        /** n formatges al tamboret origen (el més gran a baix), k tamborets. */
        inicial: function (n, k, origen) {
            var e = [];
            for (var i = 0; i < k; i++) e.push([]);
            for (var m = n; m >= 1; m--) e[origen || 0].push(m);
            return e;
        },
        dalt: function (estat, t) {
            var p = estat[t];
            return p.length ? p[p.length - 1] : 0;
        },
        /** null si es pot moure de «de» a «a»; si no, el motiu. */
        motiu: function (estat, de, a) {
            if (de === a) return 'mateix';
            var x = piles.dalt(estat, de);
            if (!x) return 'buit';
            var y = piles.dalt(estat, a);
            if (y && y < x) return 'petit';
            return null;
        },
        mou: function (estat, de, a) {
            var e = estat.map(function (p) {
                return p.slice();
            });
            e[a].push(e[de].pop());
            return e;
        },
        resolt: function (estat, desti) {
            var n = 0;
            estat.forEach(function (p) {
                n += p.length;
            });
            return estat[desti].length === n;
        },
        clau: function (estat) {
            return estat
                .map(function (p) {
                    return p.join(',');
                })
                .join('|');
        },
        veins: function (estat) {
            var out = [];
            for (var de = 0; de < estat.length; de++)
                for (var a = 0; a < estat.length; a++)
                    if (!piles.motiu(estat, de, a)) out.push({ estat: piles.mou(estat, de, a), mov: [de, a] });
            return out;
        },
    };

    /** Frame–Stewart: FS(n, k) = min sobre t de 2·FS(t, k) + FS(n − t, k − 1); FS(n, 3) = 2ⁿ − 1. */
    var memo = {};
    function frameStewart(n, k) {
        if (n === 0) return 0;
        if (n === 1) return 1;
        if (k === 3) return Math.pow(2, n) - 1;
        if (k < 3) return Infinity;
        var c = n + ',' + k;
        if (memo[c] !== undefined) return memo[c];
        var millor = Infinity;
        for (var t = 1; t < n; t++) millor = Math.min(millor, 2 * frameStewart(t, k) + frameStewart(n - t, k - 1));
        return (memo[c] = millor);
    }

    /** La millor manera de partir n formatges amb k tamborets: el nombre t de petits que s'aparten. */
    function particio(n, k) {
        var millor = Infinity,
            tria = 1;
        for (var t = 1; t < n; t++) {
            var c = 2 * frameStewart(t, k) + frameStewart(n - t, k - 1);
            if (c <= millor) {
                millor = c;
                tria = t;
            }
        }
        return tria;
    }
    /**
     * Els moviments [de, a] per passar els n formatges de dalt del tamboret «de» al tamboret «a»,
     * amb els tamborets «lliures» de pas (mètode de Dudeney i Frame–Stewart).
     */
    function solucioPiles(n, de, a, lliures) {
        if (n === 0) return [];
        if (n === 1) return [[de, a]];
        if (lliures.length === 1) {
            var p = lliures[0];
            return solucioPiles(n - 1, de, p, [a]).concat([[de, a]], solucioPiles(n - 1, p, a, [de]));
        }
        var t = particio(n, lliures.length + 2),
            pas = lliures[0],
            resta = lliures.slice(1);
        return solucioPiles(t, de, pas, [a].concat(resta)).concat(
            solucioPiles(n - t, de, a, resta),
            solucioPiles(t, pas, a, [de].concat(resta))
        );
    }

    // ── Salts (granotes en una filera) ─────────────────────────────────────
    var salts = {
        forat: function (estat) {
            return estat.indexOf(0);
        },
        /** On aniria la fitxa de la casella i (el forat), o −1 si no es pot moure. */
        desti: function (estat, i) {
            if (!estat[i]) return -1;
            var f = estat.indexOf(0);
            var d = Math.abs(f - i);
            if (d === 1) return f;
            if (d === 2 && estat[(f + i) / 2]) return f;
            return -1;
        },
        mou: function (estat, i) {
            var f = salts.desti(estat, i);
            var e = estat.slice();
            e[f] = e[i];
            e[i] = 0;
            return e;
        },
        esSalt: function (estat, i) {
            return Math.abs(estat.indexOf(0) - i) === 2;
        },
        resolt: function (estat, objectiu) {
            return estat.join(',') === objectiu.join(',');
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (estat) {
            var out = [];
            for (var i = 0; i < estat.length; i++)
                if (salts.desti(estat, i) >= 0) out.push({ estat: salts.mou(estat, i), mov: estat[i] });
            return out;
        },
    };

    /** La fórmula de Dudeney (solució de l'AM 214) per a n granotes amb el forat a l'extrem. */
    function granotesDudeney(n) {
        return n % 2 === 0 ? (n * n + n) / 2 : (n * n + 3 * n) / 2 - 4;
    }
    /** La seqüència de granotes que dona Dudeney per a n granotes (la regla de la solució de l'AM 214). */
    function sequenciaGranotes(n) {
        var parells = [],
            senars = [],
            i,
            out = [];
        for (i = 2; i <= n; i += 2) parells.push(i);
        for (i = n % 2 ? n : n - 1; i >= 1; i -= 2) senars.push(i);
        var serie = parells.concat(senars);
        if (n % 2 === 0) {
            for (i = 0; i < n / 2; i++) out = out.concat(serie);
            return out.concat(parells);
        }
        for (i = 0; i < (n - 1) / 2; i++) out = out.concat(serie);
        out = out.concat(
            parells.filter(function (x) {
                return x !== n - 1;
            }),
            senars.filter(function (x) {
                return x !== 1;
            })
        );
        for (i = 2; i < n; i++) out.push(i);
        return out;
    }

    return {
        piles: piles,
        salts: salts,
        frameStewart: frameStewart,
        particio: particio,
        solucioPiles: solucioPiles,
        granotesDudeney: granotesDudeney,
        sequenciaGranotes: sequenciaGranotes,
    };
});
