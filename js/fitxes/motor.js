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
 *   - cercle: fitxes de dos colors en un cercle amb un forat; cada color va en
 *     un sol sentit i només pot saltar una fitxa de l'altre color (AM 217).
 *   - blocs: blocs que llisquen dins una capsa cap al forat (AM 219, el «15»).
 *   - solitari: el solitari anglès de 33 forats (AM 227); un moviment és una
 *     cadena de salts de la mateixa bola.
 *   - xarxa: fitxes sobre punts units per línies; una fitxa va per una línia a
 *     un punt buit (AM 341, les quatre granotes de Guarini).
 *   Per a cada model: moviments legals, aplicar-los, saber si està resolt, i els
 *   veïns per a la cerca en amplada (el mínim de moviments es comprova als tests).
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   piles: estat = [[mides de baix a dalt], …] (una llista per tamboret)
 *   salts: estat = [fitxa | 0, …] (0 = el forat)
 *   cercle, blocs: estat = [lletra | '', …] ('' = el forat)
 *   xarxa: estat = [fitxa | '', …] per a cada punt; arestes [[i, j], …] (punts 0…)
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
        /**
         * On aniria la fitxa de la casella i (el forat), o −1 si no es pot moure. Pot anar a la casella del
         * costat o saltar per sobre de fins a «maxim» fitxes (1 a l'AM 214, 2 a l'AM 216).
         */
        desti: function (estat, i, maxim) {
            if (!estat[i]) return -1;
            var f = estat.indexOf(0);
            var d = Math.abs(f - i);
            return d >= 1 && d <= (maxim || 1) + 1 ? f : -1;
        },
        mou: function (estat, i, maxim) {
            var f = salts.desti(estat, i, maxim);
            var e = estat.slice();
            e[f] = e[i];
            e[i] = 0;
            return e;
        },
        esSalt: function (estat, i) {
            return Math.abs(estat.indexOf(0) - i) >= 2;
        },
        resolt: function (estat, objectiu) {
            return estat.join(',') === objectiu.join(',');
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (estat, maxim) {
            var out = [];
            for (var i = 0; i < estat.length; i++)
                if (salts.desti(estat, i, maxim) >= 0) out.push({ estat: salts.mou(estat, i, maxim), mov: estat[i] });
            return out;
        },
        /** Els veïns quan les fitxes només es distingeixen pel color (colors[fitxa]); per a la cerca. */
        veinsColor: function (maxim) {
            return function (estat) {
                var out = [];
                for (var i = 0; i < estat.length; i++)
                    if (salts.desti(estat, i, maxim) >= 0) out.push({ estat: salts.mou(estat, i, maxim), mov: [i, estat.indexOf(0)] });
                return out;
            };
        },
    };

    // ── Cercle (AM 217: les lletres de Twickenham) ─────────────────────────
    // sentit[fitxa] = +1 (cap als índexs més grans, el sentit de les agulles del rellotge) o −1
    var cercle = {
        /** On aniria la fitxa de la casella i (el forat), o −1. També diu si és un salt. */
        desti: function (estat, i, sentit) {
            var x = estat[i],
                n = estat.length;
            if (!x) return -1;
            var s = sentit[x],
                a = (i + s + n) % n,
                b = (i + 2 * s + n) % n;
            if (!estat[a]) return a;
            if (!estat[b] && sentit[estat[a]] !== s) return b;
            return -1;
        },
        /** null si la fitxa de la casella i es pot moure; si no, el motiu. */
        motiu: function (estat, i, sentit) {
            if (cercle.desti(estat, i, sentit) >= 0) return null;
            var n = estat.length,
                s = sentit[estat[i]],
                a = (i + s + n) % n,
                b = (i + 2 * s + n) % n;
            if (!estat[b] && sentit[estat[a]] === s) return 'mateix';
            return 'lluny';
        },
        esSalt: function (estat, i, sentit) {
            var d = cercle.desti(estat, i, sentit);
            return d >= 0 && d !== (i + sentit[estat[i]] + estat.length) % estat.length;
        },
        mou: function (estat, i, sentit) {
            var f = cercle.desti(estat, i, sentit);
            var e = estat.slice();
            e[f] = e[i];
            e[i] = '';
            return e;
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (sentit) {
            return function (estat) {
                var out = [];
                for (var i = 0; i < estat.length; i++)
                    if (cercle.desti(estat, i, sentit) >= 0) out.push({ estat: cercle.mou(estat, i, sentit), mov: estat[i] });
                return out;
            };
        },
    };

    // ── Blocs (AM 219: les lletres a la capsa) ─────────────────────────────
    var blocs = {
        /** El forat, si el bloc de la casella i hi és tocant (en una quadrícula de «cols» columnes); si no, −1. */
        desti: function (estat, i, cols) {
            var f = estat.indexOf('');
            if (i === f || !estat[i]) return -1;
            var fi = Math.floor(i / cols),
                ci = i % cols,
                ff = Math.floor(f / cols),
                cf = f % cols;
            return Math.abs(fi - ff) + Math.abs(ci - cf) === 1 ? f : -1;
        },
        mou: function (estat, i, cols) {
            var f = blocs.desti(estat, i, cols);
            var e = estat.slice();
            e[f] = e[i];
            e[i] = '';
            return e;
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (cols) {
            return function (estat) {
                var out = [];
                for (var i = 0; i < estat.length; i++)
                    if (blocs.desti(estat, i, cols) >= 0) out.push({ estat: blocs.mou(estat, i, cols), mov: estat[i] });
                return out;
            };
        },
    };

    // ── Solitari (AM 227: el solitari central, tauler anglès de 33 forats) ──
    // Forats numerats com Dudeney, d'esquerra a dreta i de dalt a baix: 1–3, 4–6, 7–13, 14–20, 21–27, 28–30, 31–33.
    // estat = [null, bool × 33] (estat[n] = hi ha bola al forat n).
    var solitari = (function () {
        var files = [[2, 3, 4], [2, 3, 4], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], [2, 3, 4], [2, 3, 4]];
        var pos = [null],
            num = {};
        files.forEach(function (cs, f) {
            cs.forEach(function (c) {
                num[f + ',' + c] = pos.length;
                pos.push([f, c]);
            });
        });
        var api = {
            pos: pos,
            num: function (f, c) {
                return num[f + ',' + c] || 0;
            },
            /** Totes les bolles menys la del forat buit (17 per defecte). */
            inicial: function (buit) {
                var e = [null];
                for (var n = 1; n <= 33; n++) e.push(n !== (buit || 17));
                return e;
            },
            /** El forat del mig si de a es pot saltar a c (en línia, a dues caselles); si no, 0. */
            entre: function (a, c) {
                var p = pos[a],
                    q = pos[c];
                if (!p || !q) return 0;
                var df = q[0] - p[0],
                    dc = q[1] - p[1];
                if (!((df === 0 && Math.abs(dc) === 2) || (dc === 0 && Math.abs(df) === 2))) return 0;
                return api.num(p[0] + df / 2, p[1] + dc / 2);
            },
            /** null si el salt de a a c és legal; si no, el motiu: 'buit' (a), 'ple' (c), 'lluny', 'sense' (no hi ha bola al mig). */
            motiu: function (estat, a, c) {
                if (!estat[a]) return 'buit';
                if (estat[c]) return 'ple';
                var m = api.entre(a, c);
                if (!m) return 'lluny';
                if (!estat[m]) return 'sense';
                return null;
            },
            salta: function (estat, a, c) {
                var e = estat.slice();
                e[a] = false;
                e[api.entre(a, c)] = false;
                e[c] = true;
                return e;
            },
            /** Els salts possibles [a, c]. */
            salts: function (estat) {
                var out = [];
                for (var a = 1; a <= 33; a++)
                    if (estat[a])
                        [[0, 2], [0, -2], [2, 0], [-2, 0]].forEach(function (d) {
                            var c = api.num(pos[a][0] + d[0], pos[a][1] + d[1]);
                            if (c && !api.motiu(estat, a, c)) out.push([a, c]);
                        });
                return out;
            },
            boles: function (estat) {
                var n = 0;
                for (var i = 1; i <= 33; i++) if (estat[i]) n++;
                return n;
            },
            /**
             * Juga una llista de moviments (cada un, la cadena de forats d'una mateixa bola: [a, b, c, …]). Retorna
             * { estat, salts, moviments, error } (error = el primer salt il·legal, [a, c], o null).
             */
            juga: function (moviments, buit) {
                var e = api.inicial(buit),
                    salts = 0;
                for (var i = 0; i < moviments.length; i++)
                    for (var j = 1; j < moviments[i].length; j++) {
                        var a = moviments[i][j - 1],
                            c = moviments[i][j];
                        if (api.motiu(e, a, c)) return { estat: e, salts: salts, moviments: i, error: [a, c] };
                        e = api.salta(e, a, c);
                        salts++;
                    }
                return { estat: e, salts: salts, moviments: moviments.length, error: null };
            },
            /** «19-17, (29-17, 17-19), …» → [[19, 17], [29, 17, 19], …] (la notació de Dudeney). */
            llegeix: function (text) {
                return text.match(/\([^)]*\)|\d+-\d+/g).map(function (g) {
                    var parts = g.replace(/[()]/g, '').split(',').map(function (x) {
                        return x.trim().split('-').map(Number);
                    });
                    var cadena = [parts[0][0]];
                    parts.forEach(function (p) {
                        cadena.push(p[1]);
                    });
                    return cadena;
                });
            },
        };
        return api;
    })();

    // ── Xarxa (AM 341: les quatre granotes) ────────────────────────────────
    var xarxa = {
        uneix: function (arestes, i, j) {
            return arestes.some(function (a) {
                return (a[0] === i && a[1] === j) || (a[0] === j && a[1] === i);
            });
        },
        /** null si la fitxa del punt i pot anar al punt j; si no, el motiu. */
        motiu: function (estat, arestes, i, j) {
            if (i === j) return 'mateix';
            if (!estat[i]) return 'buit';
            if (estat[j]) return 'ple';
            if (!xarxa.uneix(arestes, i, j)) return 'linia';
            return null;
        },
        mou: function (estat, i, j) {
            var e = estat.slice();
            e[j] = e[i];
            e[i] = '';
            return e;
        },
        /** Les jugades d'una llista de moviments [de, a]: els moviments seguits d'una mateixa fitxa en fan una. */
        jugades: function (moviments) {
            var n = 0;
            for (var k = 0; k < moviments.length; k++) if (!k || moviments[k][0] !== moviments[k - 1][1]) n++;
            return n;
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (arestes) {
            return function (estat) {
                var out = [];
                arestes.forEach(function (a) {
                    [a, [a[1], a[0]]].forEach(function (m) {
                        if (!xarxa.motiu(estat, arestes, m[0], m[1])) out.push({ estat: xarxa.mou(estat, m[0], m[1]), mov: m });
                    });
                });
                return out;
            };
        },
        /** Veïns per jugades: una fitxa fa tants moviments seguits com vulgui (per punts buits). */
        veinsJugada: function (arestes) {
            return function (estat) {
                var out = [];
                for (var i = 0; i < estat.length; i++) {
                    if (!estat[i]) continue;
                    var vist = {},
                        cua = [i];
                    vist[i] = true;
                    while (cua.length) {
                        var x = cua.shift();
                        for (var j = 0; j < estat.length; j++)
                            if (!vist[j] && !estat[j] && xarxa.uneix(arestes, x, j)) {
                                vist[j] = true;
                                cua.push(j);
                                out.push({ estat: xarxa.mou(estat, i, j), mov: [i, j] });
                            }
                    }
                }
                return out;
            };
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
        cercle: cercle,
        blocs: blocs,
        solitari: solitari,
        xarxa: xarxa,
        frameStewart: frameStewart,
        particio: particio,
        solucioPiles: solucioPiles,
        granotesDudeney: granotesDudeney,
        sequenciaGranotes: sequenciaGranotes,
    };
});
