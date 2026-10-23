/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/camins/motor.js
 * ROL: Recorreguts per un graf (estacions i línies, ciutats i carreteres):
 *   - cobrir totes les arestes amb el camí més curt (AM 242, l'inspector del
 *     metro: el «problema del carter xinès» amb principi i final lliures);
 *   - passar per tots els vèrtexs una sola vegada i tornar a l'inici (AM 243,
 *     visitant les ciutats: un cicle de Hamilton).
 *   Comprova una ruta (pas a pas, amb el motiu si un pas no es pot fer) i té els
 *   solucionadors que confirmen el que diu Dudeney.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   graf = { vertexs: [id, …], arestes: [[a, b, longitud?], …] } (longitud 1 si no hi és)
 *   ruta = [id, id, …] (vèrtexs per ordre)
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorCamins = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var claAresta = function (a, b) {
        return a < b ? a + '-' + b : b + '-' + a;
    };

    /** Veïns i longitud de cada aresta. */
    function index(graf) {
        var veins = {},
            llarg = {};
        graf.vertexs.forEach(function (v) {
            veins[v] = [];
        });
        graf.arestes.forEach(function (a) {
            veins[a[0]].push(a[1]);
            veins[a[1]].push(a[0]);
            llarg[claAresta(a[0], a[1])] = a[2] || 1;
        });
        return { veins: veins, llarg: llarg };
    }

    /** Es pot anar de a a b? */
    function hiHaAresta(graf, a, b) {
        return graf.arestes.some(function (x) {
            return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a);
        });
    }

    /** Arestes recorregudes (amb quantes vegades), longitud i les que falten. */
    function recompte(graf, ruta) {
        var idx = index(graf),
            vegades = {},
            longitud = 0;
        for (var i = 1; i < ruta.length; i++) {
            var k = claAresta(ruta[i - 1], ruta[i]);
            vegades[k] = (vegades[k] || 0) + 1;
            longitud += idx.llarg[k] || 0;
        }
        var falten = graf.arestes
            .map(function (a) {
                return claAresta(a[0], a[1]);
            })
            .filter(function (k) {
                return !vegades[k];
            });
        return { vegades: vegades, longitud: longitud, falten: falten };
    }

    /** null si la ruta segueix arestes del graf; si no, l'índex del primer pas que no. */
    function pasDolent(graf, ruta) {
        for (var i = 1; i < ruta.length; i++) if (!hiHaAresta(graf, ruta[i - 1], ruta[i])) return i;
        return null;
    }

    /**
     * La ruta més curta que recorre totes les arestes (principi i final lliures), per cerca
     * en amplada sobre (vèrtex, arestes ja recorregudes). Només per a grafs petits (≤ 20 arestes)
     * amb arestes de longitud 1. Retorna { longitud, ruta }.
     */
    function carterMinim(graf) {
        var arestes = graf.arestes.map(function (a) {
            return claAresta(a[0], a[1]);
        });
        var bit = {};
        arestes.forEach(function (k, i) {
            bit[k] = 1 << i;
        });
        var tot = (1 << arestes.length) - 1;
        var idx = index(graf);
        var vist = new Map(),
            cua = [];
        graf.vertexs.forEach(function (v) {
            var k = v + '|0';
            vist.set(k, null);
            cua.push([v, 0]);
        });
        for (var cap = 0; cap < cua.length; cap++) {
            var v = cua[cap][0],
                m = cua[cap][1];
            if (m === tot) {
                var ruta = [v];
                for (var p = vist.get(v + '|' + m); p; p = vist.get(p[0] + '|' + p[1])) ruta.push(p[0]);
                ruta.reverse();
                return { longitud: ruta.length - 1, ruta: ruta };
            }
            for (var i = 0; i < idx.veins[v].length; i++) {
                var w = idx.veins[v][i];
                var m2 = m | bit[claAresta(v, w)];
                var k2 = w + '|' + m2;
                if (vist.has(k2)) continue;
                vist.set(k2, [v, m]);
                cua.push([w, m2]);
            }
        }
        return { longitud: null, ruta: null };
    }

    /** Distàncies (nombre d'arestes, longitud 1) d'un vèrtex a tots els altres. */
    function distanciesDe(graf, v) {
        var idx = index(graf),
            d = {},
            cua = [v];
        d[v] = 0;
        for (var i = 0; i < cua.length; i++)
            idx.veins[cua[i]].forEach(function (w) {
                if (d[w] === undefined) {
                    d[w] = d[cua[i]] + 1;
                    cua.push(w);
                }
            });
        return d;
    }
    /**
     * El recorregut més curt que passa per totes les arestes (longitud 1), començant a «inici» i acabant on
     * sigui (el carter xinès). Es fa per aparellament: els vèrtexs senars (canviats per l'inici i el final)
     * s'aparellen amb el mínim de camins repetits. Retorna { longitud, final, repetides }.
     */
    function carterDes(graf, inici) {
        var idx = index(graf);
        var senarsG = graf.vertexs.filter(function (v) {
            return idx.veins[v].length % 2 === 1;
        });
        var dist = {};
        graf.vertexs.forEach(function (v) {
            dist[v] = distanciesDe(graf, v);
        });
        var millor = { longitud: Infinity };
        graf.vertexs.forEach(function (fi) {
            // T = senars Δ {inici, fi}
            var T = senarsG.slice();
            [inici, fi].forEach(function (v) {
                if (inici === fi) return;
                var k = T.indexOf(v);
                if (k >= 0) T.splice(k, 1);
                else T.push(v);
            });
            var n = T.length,
                memo = {};
            var aparella = function (m) {
                if (m === (1 << n) - 1) return 0;
                if (memo[m] !== undefined) return memo[m];
                var i = 0;
                while (m & (1 << i)) i++;
                var r = Infinity;
                for (var j = i + 1; j < n; j++)
                    if (!(m & (1 << j))) r = Math.min(r, dist[T[i]][T[j]] + aparella(m | (1 << i) | (1 << j)));
                return (memo[m] = r);
            };
            var extra = aparella(0);
            if (graf.arestes.length + extra < millor.longitud)
                millor = { longitud: graf.arestes.length + extra, final: fi, repetides: extra };
        });
        return millor;
    }

    /** Els vèrtexs de grau senar (n'hi ha d'haver 0 o 2 perquè es pugui fer d'un sol traç). */
    function senars(graf) {
        var idx = index(graf);
        return graf.vertexs.filter(function (v) {
            return idx.veins[v].length % 2 === 1;
        });
    }

    /** Tots els cicles de Hamilton que surten d'inici (cada cicle, en un sol sentit). */
    function cicles(graf, inici) {
        var idx = index(graf),
            n = graf.vertexs.length;
        var out = [],
            ruta = [inici],
            usat = {};
        usat[inici] = true;
        (function cerca(v) {
            if (ruta.length === n) {
                if (idx.veins[v].indexOf(inici) >= 0) out.push(ruta.concat([inici]));
                return;
            }
            idx.veins[v].forEach(function (w) {
                if (usat[w]) return;
                usat[w] = true;
                ruta.push(w);
                cerca(w);
                ruta.pop();
                usat[w] = false;
            });
        })(inici);
        // Cada cicle surt dues vegades (un sentit i l'altre): se'n deixa un
        var vist = {};
        return out.filter(function (c) {
            var k = c.slice(1, -1).join(','),
                inv = c.slice(1, -1).reverse().join(',');
            if (vist[inv]) return false;
            vist[k] = true;
            return true;
        });
    }

    /** null si la ruta és un cicle de Hamilton complet; si no, el motiu. */
    function motiuHamilton(graf, ruta, inici) {
        if (ruta[0] !== inici) return 'inici';
        var p = pasDolent(graf, ruta);
        if (p !== null) return 'pas';
        var vist = {};
        for (var i = 0; i < ruta.length; i++) {
            if (vist[ruta[i]] && !(i === ruta.length - 1 && ruta[i] === inici)) return 'repetit';
            vist[ruta[i]] = true;
        }
        if (ruta.length < graf.vertexs.length + 1 || ruta[ruta.length - 1] !== inici) return 'incomplet';
        return null;
    }

    return {
        claAresta: claAresta,
        index: index,
        hiHaAresta: hiHaAresta,
        recompte: recompte,
        pasDolent: pasDolent,
        carterMinim: carterMinim,
        carterDes: carterDes,
        distanciesDe: distanciesDe,
        senars: senars,
        cicles: cicles,
        motiuHamilton: motiuHamilton,
    };
});
