/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/escacs/motor.js
 * ROL: Peces posades en un tauler d'escacs (n × n):
 *   - reines: quines s'ataquen i quins trios queden alineats en qualsevol
 *     direcció (AM 300, les vuit reines);
 *   - cavalls: quines caselles queden lliures (ni ocupades ni atacades) i quins
 *     cavalls no estan protegits per un altre (AM 319, els cavalls guardians).
 *   I els solucionadors que confirmen el que diu Dudeney (92 solucions i 12 de
 *   fonamentals; una sola sense tres reines en línia; 14 cavalls com a mínim i
 *   3 solucions fonamentals).
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Una casella és [fila, columna], amb la fila 0 a dalt.
 *   Les 8 simetries del quadrat: girs de 0, 90, 180, 270° i els seus miralls.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorEscacs = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var clau = function (c) {
        return c[0] + ',' + c[1];
    };

    // ── Simetries ──────────────────────────────────────────────────────────
    function simetries(n) {
        var m = n - 1;
        return [
            function (f, c) {
                return [f, c];
            },
            function (f, c) {
                return [c, m - f];
            },
            function (f, c) {
                return [m - f, m - c];
            },
            function (f, c) {
                return [m - c, f];
            },
            function (f, c) {
                return [f, m - c];
            },
            function (f, c) {
                return [m - f, c];
            },
            function (f, c) {
                return [c, f];
            },
            function (f, c) {
                return [m - c, m - f];
            },
        ];
    }
    /** La forma canònica d'un conjunt de caselles (la més petita de les 8 simetries). */
    function canonica(caselles, n) {
        var millor = null;
        simetries(n).forEach(function (s) {
            var k = caselles
                .map(function (x) {
                    var y = s(x[0], x[1]);
                    return y[0] * n + y[1];
                })
                .sort(function (a, b) {
                    return a - b;
                })
                .join(',');
            if (millor === null || k < millor) millor = k;
        });
        return millor;
    }

    // ── Reines ─────────────────────────────────────────────────────────────
    function reinesAtaquen(a, b) {
        return a[0] === b[0] || a[1] === b[1] || Math.abs(a[0] - b[0]) === Math.abs(a[1] - b[1]);
    }
    /** Els parells de reines que s'ataquen. */
    function conflictes(reines) {
        var out = [];
        for (var i = 0; i < reines.length; i++)
            for (var j = i + 1; j < reines.length; j++)
                if (reinesAtaquen(reines[i], reines[j])) out.push([i, j]);
        return out;
    }
    /** Els trios de peces alineades (en qualsevol direcció: centres de les caselles). */
    function tresEnLinia(peces) {
        var out = [];
        for (var i = 0; i < peces.length; i++)
            for (var j = i + 1; j < peces.length; j++)
                for (var k = j + 1; k < peces.length; k++) {
                    var a = peces[i],
                        b = peces[j],
                        c = peces[k];
                    if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0) out.push([i, j, k]);
                }
        return out;
    }
    /** Totes les maneres de posar n reines sense que s'ataquin (cada solució: la columna de cada fila). */
    function solucionsReines(n) {
        var out = [],
            col = [];
        (function posa(f) {
            if (f === n) {
                out.push(col.slice());
                return;
            }
            for (var c = 0; c < n; c++) {
                var bo = true;
                for (var g = 0; g < f && bo; g++) if (col[g] === c || Math.abs(col[g] - c) === f - g) bo = false;
                if (bo) {
                    col[f] = c;
                    posa(f + 1);
                }
            }
        })(0);
        return out;
    }
    var aCaselles = function (cols) {
        return cols.map(function (c, f) {
            return [f, c];
        });
    };
    /** Les classes de solucions llevat de girs i miralls. */
    function fonamentals(solucions, n) {
        var classes = {};
        solucions.forEach(function (s) {
            var k = canonica(aCaselles(s), n);
            (classes[k] = classes[k] || []).push(s);
        });
        return Object.keys(classes).map(function (k) {
            return classes[k];
        });
    }

    // ── Cavalls ────────────────────────────────────────────────────────────
    var SALTS = [
        [1, 2],
        [2, 1],
        [2, -1],
        [1, -2],
        [-1, -2],
        [-2, -1],
        [-2, 1],
        [-1, 2],
    ];
    function atacsCavall(f, c, n) {
        var out = [];
        SALTS.forEach(function (s) {
            var g = f + s[0],
                d = c + s[1];
            if (g >= 0 && g < n && d >= 0 && d < n) out.push([g, d]);
        });
        return out;
    }
    /** Com està el tauler: caselles lliures (ni ocupades ni atacades) i cavalls sense protecció. */
    function estatCavalls(cavalls, n) {
        var ocupat = {},
            atacat = {};
        cavalls.forEach(function (x) {
            ocupat[clau(x)] = true;
        });
        cavalls.forEach(function (x) {
            atacsCavall(x[0], x[1], n).forEach(function (y) {
                atacat[clau(y)] = true;
            });
        });
        var lliures = [];
        for (var f = 0; f < n; f++)
            for (var c = 0; c < n; c++) if (!ocupat[f + ',' + c] && !atacat[f + ',' + c]) lliures.push([f, c]);
        var sensePro = cavalls.filter(function (x) {
            return !atacat[clau(x)];
        });
        return { lliures: lliures, sensePro: sensePro, atacat: atacat };
    }

    /**
     * Els conjunts mínims de caselles d'un color des d'on els cavalls ataquen TOTES les caselles
     * de l'altre color (un cavall sempre ataca caselles de l'altre color). Cerca exhaustiva:
     * es tria sempre la primera casella encara no atacada i es prova cada casella que l'ataca.
     * color: 0 = les caselles (f + c) parelles; retorna { mida, conjunts: [[[f, c], …], …] }.
     */
    function cobertesMinimes(n, color, maxMida) {
        var origen = [],
            desti = [];
        for (var f = 0; f < n; f++)
            for (var c = 0; c < n; c++) ((f + c) % 2 === color ? origen : desti).push([f, c]);
        var idx = {};
        desti.forEach(function (x, i) {
            idx[clau(x)] = i;
        });
        // per a cada casella de destí, les d'origen que l'ataquen
        var qui = desti.map(function () {
            return [];
        });
        var ataca = origen.map(function (x, i) {
            var l = atacsCavall(x[0], x[1], n).map(function (y) {
                return idx[clau(y)];
            });
            l.forEach(function (d) {
                qui[d].push(i);
            });
            return l;
        });
        for (var mida = 1; mida <= maxMida; mida++) {
            var trobats = {},
                compte = new Array(desti.length).fill(0),
                tria = [];
            (function cerca() {
                var d = compte.indexOf(0);
                if (d < 0) {
                    var k = tria
                        .slice()
                        .sort(function (a, b) {
                            return a - b;
                        })
                        .join(',');
                    trobats[k] = true;
                    return;
                }
                if (tria.length === mida) return;
                qui[d].forEach(function (o) {
                    if (tria.indexOf(o) >= 0) return;
                    tria.push(o);
                    ataca[o].forEach(function (x) {
                        compte[x]++;
                    });
                    cerca();
                    ataca[o].forEach(function (x) {
                        compte[x]--;
                    });
                    tria.pop();
                });
            })();
            var conjunts = Object.keys(trobats).map(function (k) {
                return k.split(',').map(function (i) {
                    return origen[+i];
                });
            });
            if (conjunts.length) return { mida: mida, conjunts: conjunts };
        }
        return { mida: null, conjunts: [] };
    }

    // ── Alfils (amb les peces que tapen el camí) ─────────────────────────────
    function atacsAlfil(f, c, n, ocupat) {
        var out = [];
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (d) {
            var g = f + d[0],
                h = c + d[1];
            while (g >= 0 && g < n && h >= 0 && h < n) {
                out.push([g, h]);
                if (ocupat && ocupat[g + ',' + h]) break;
                g += d[0];
                h += d[1];
            }
        });
        return out;
    }
    /** Com està el tauler amb aquestes peces ('cavall' o 'alfil'): lliures, sense protecció, atacades. */
    function estatPeces(peces, n, tipus) {
        if (tipus !== 'alfil') return estatCavalls(peces, n);
        var ocupat = {},
            atacat = {};
        peces.forEach(function (x) {
            ocupat[clau(x)] = true;
        });
        peces.forEach(function (x) {
            atacsAlfil(x[0], x[1], n, ocupat).forEach(function (y) {
                atacat[clau(y)] = true;
            });
        });
        var lliures = [];
        for (var f = 0; f < n; f++)
            for (var c = 0; c < n; c++) if (!ocupat[f + ',' + c] && !atacat[f + ',' + c]) lliures.push([f, c]);
        return {
            lliures: lliures,
            sensePro: peces.filter(function (x) {
                return !atacat[clau(x)];
            }),
            atacat: atacat,
        };
    }
    /**
     * El mínim d'alfils en caselles d'un color perquè totes les caselles d'aquell color quedin ocupades o
     * atacades (i, si protegits, que cada alfil estigui atacat per un altre). Cerca exhaustiva per mides.
     */
    function minimAlfils(n, color, protegits, maxMida) {
        var caselles = [];
        for (var f = 0; f < n; f++) for (var c = 0; c < n; c++) if ((f + c) % 2 === color) caselles.push([f, c]);
        for (var mida = 1; mida <= maxMida; mida++) {
            var trobats = [],
                tria = [];
            (function cerca(desde) {
                if (tria.length === mida) {
                    var e = estatPeces(tria, n, 'alfil');
                    var cobert = e.lliures.every(function (q) {
                        return (q[0] + q[1]) % 2 !== color;
                    });
                    if (cobert && (!protegits || !e.sensePro.length)) trobats.push(tria.slice());
                    return;
                }
                for (var k = desde; k < caselles.length; k++) {
                    tria.push(caselles[k]);
                    cerca(k + 1);
                    tria.pop();
                }
            })(0);
            if (trobats.length) return { mida: mida, solucions: trobats.length };
        }
        return { mida: null, solucions: 0 };
    }

    return {
        atacsAlfil: atacsAlfil,
        estatPeces: estatPeces,
        minimAlfils: minimAlfils,
        clau: clau,
        simetries: simetries,
        canonica: canonica,
        reinesAtaquen: reinesAtaquen,
        conflictes: conflictes,
        tresEnLinia: tresEnLinia,
        solucionsReines: solucionsReines,
        aCaselles: aCaselles,
        fonamentals: fonamentals,
        atacsCavall: atacsCavall,
        estatCavalls: estatCavalls,
        cobertesMinimes: cobertesMinimes,
    };
});
