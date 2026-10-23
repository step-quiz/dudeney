/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/aritmetica/motor.js
 * ROL: Comptes i distàncies:
 *   - el número estripat (AM 113): una etiqueta de 4 xifres que, partida pel
 *     mig, fa que (primera meitat + segona meitat)² torni a donar el número
 *     (3025 → 30 + 25 = 55 → 55² = 3025). Es busquen tots els que ho fan.
 *   - l'aranya i la mosca (CP 75): una sala com una capsa de cartró. Es
 *     desplega la capsa seguint les cares per on passa l'aranya; al pla, el
 *     camí més curt és una recta. Diu si la recta és vàlida (passa per les
 *     cares en aquest ordre, creuant cada aresta pel tros que toca) i quant fa.
 *   - comptar rectangles (AM 347): quants rectangles i quants quadrats té un
 *     tauler de n × n, comptant-los un per un i amb les fórmules de Dudeney.
 *   - l'amulet (CP 38): les maneres de llegir ABRACADABRA baixant per un
 *     triangle de lletres (el triangle de Pascal).
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Sala: x al llarg (0…llarg), y d'una paret llarga a l'altra (0…ample),
 *   z cap amunt (0…alt). Cares: 'A' (x = 0, la de l'aranya), 'B' (x = llarg,
 *   la de la mosca), 'sostre' (z = alt), 'terra' (z = 0), 'porta' (y = 0) i
 *   'finestra' (y = ample).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorAritmetica = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── El número estripat ─────────────────────────────────────────────────
    /** Les dues meitats de l'etiqueta de 2n xifres, la seva suma i el quadrat de la suma. */
    function estripa(xifres) {
        var n = xifres.length / 2;
        var a = +xifres.slice(0, n).join(''),
            b = +xifres.slice(n).join('');
        var s = a + b;
        return { a: a, b: b, suma: s, quadrat: s * s, numero: +xifres.join('') };
    }
    var diferents = function (xifres) {
        return new Set(xifres).size === xifres.length;
    };
    /** Totes les etiquetes de 2n xifres (amb zeros a l'esquerra) que fan (a + b)² = etiqueta. */
    function etiquetes(n) {
        var out = [],
            maxim = Math.pow(10, 2 * n);
        for (var s = 0; s * s < maxim; s++) {
            var q = s * s;
            var a = Math.floor(q / Math.pow(10, n)),
                b = q % Math.pow(10, n);
            if (a + b === s) out.push(String(q).padStart(2 * n, '0'));
        }
        return out;
    }

    // ── La capsa ───────────────────────────────────────────────────────────
    var sub = function (p, q) {
        return [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
    };
    var add = function (p, q) {
        return [p[0] + q[0], p[1] + q[1], p[2] + q[2]];
    };
    var mul = function (p, k) {
        return [p[0] * k, p[1] * k, p[2] * k];
    };
    var dot = function (p, q) {
        return p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
    };
    var len = function (p) {
        return Math.sqrt(dot(p, p));
    };
    var sub2 = function (p, q) {
        return [p[0] - q[0], p[1] - q[1]];
    };
    var add2 = function (p, q) {
        return [p[0] + q[0], p[1] + q[1]];
    };
    var mul2 = function (p, k) {
        return [p[0] * k, p[1] * k];
    };
    var dot2 = function (p, q) {
        return p[0] * q[0] + p[1] * q[1];
    };
    var len2 = function (p) {
        return Math.sqrt(dot2(p, p));
    };

    /** Les sis cares de la sala: cantonades (en ordre) i la coordenada fixa. */
    function cares(sala) {
        var L = sala.llarg,
            W = sala.ample,
            H = sala.alt;
        return {
            A: { eix: 0, valor: 0, punts: [[0, 0, 0], [0, W, 0], [0, W, H], [0, 0, H]] },
            B: { eix: 0, valor: L, punts: [[L, 0, 0], [L, 0, H], [L, W, H], [L, W, 0]] },
            terra: { eix: 2, valor: 0, punts: [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0]] },
            sostre: { eix: 2, valor: H, punts: [[0, 0, H], [0, W, H], [L, W, H], [L, 0, H]] },
            porta: { eix: 1, valor: 0, punts: [[0, 0, 0], [0, 0, H], [L, 0, H], [L, 0, 0]] },
            finestra: { eix: 1, valor: W, punts: [[0, W, 0], [L, W, 0], [L, W, H], [0, W, H]] },
        };
    }
    var OPOSADA = { A: 'B', B: 'A', terra: 'sostre', sostre: 'terra', porta: 'finestra', finestra: 'porta' };
    var veines = function (a, b) {
        return a !== b && OPOSADA[a] !== b;
    };
    /** L'aresta comuna de dues cares veïnes: els dos extrems. */
    function aresta(sala, a, b) {
        var C = cares(sala);
        var pa = C[a].punts,
            pb = C[b].punts;
        var comuns = pa.filter(function (p) {
            return pb.some(function (q) {
                return p[0] === q[0] && p[1] === q[1] && p[2] === q[2];
            });
        });
        return comuns.length === 2 ? comuns : null;
    }
    function centre3(punts) {
        return mul(punts.reduce(add), 1 / punts.length);
    }

    /**
     * Desplega les cares de la seqüència (cada una veïna de l'anterior) sobre el pla.
     * Retorna per a cada cara el seu mapa 3D → 2D i el polígon al pla, i les arestes
     * creuades (al pla i a l'espai), o null si dues cares seguides no són veïnes.
     */
    function desplega(sala, seq) {
        var C = cares(sala);
        var mapes = [],
            arestes = [];
        for (var i = 0; i < seq.length; i++) {
            var cara = C[seq[i]];
            var mapa;
            if (i === 0) {
                // La primera cara, tal com es veu des de dins de la sala
                var p0 = cara.punts[0],
                    e1 = sub(cara.punts[1], p0),
                    e2 = sub(cara.punts[3], p0);
                mapa = { P3: p0, u3: mul(e1, 1 / len(e1)), w3: mul(e2, 1 / len(e2)), P2: [0, 0], u2: [1, 0], w2: [0, 1] };
            } else {
                if (!veines(seq[i - 1], seq[i])) return null;
                var ar = aresta(sala, seq[i - 1], seq[i]);
                var ant = mapes[i - 1];
                var a2 = projecta(ant, ar[0]),
                    b2 = projecta(ant, ar[1]);
                var u3 = mul(sub(ar[1], ar[0]), 1 / len(sub(ar[1], ar[0])));
                // dins de la cara nova, perpendicular a l'aresta i cap al seu centre
                var c3 = centre3(cara.punts);
                var d = sub(c3, ar[0]);
                var w3 = sub(d, mul(u3, dot(d, u3)));
                w3 = mul(w3, 1 / len(w3));
                var u2 = mul2(sub2(b2, a2), 1 / len2(sub2(b2, a2)));
                var w2 = [-u2[1], u2[0]];
                // cap a fora de la cara anterior
                var cAnt = projecta(ant, centre3(C[seq[i - 1]].punts));
                if (dot2(sub2(cAnt, a2), w2) > 0) w2 = [-w2[0], -w2[1]];
                mapa = { P3: ar[0], u3: u3, w3: w3, P2: a2, u2: u2, w2: w2 };
                arestes.push({ espai: ar, pla: [a2, b2] });
            }
            mapes.push(mapa);
        }
        return {
            mapes: mapes,
            arestes: arestes,
            poligons: seq.map(function (k, i) {
                return C[k].punts.map(function (p) {
                    return projecta(mapes[i], p);
                });
            }),
        };
    }
    function projecta(m, p) {
        var d = sub(p, m.P3);
        return add2(add2(m.P2, mul2(m.u2, dot(d, m.u3))), mul2(m.w2, dot(d, m.w3)));
    }
    function aixeca(m, q) {
        var d = sub2(q, m.P2);
        return add(add(m.P3, mul(m.u3, dot2(d, m.u2))), mul(m.w3, dot2(d, m.w2)));
    }

    /**
     * El camí recte de l'aranya (a la cara seq[0]) a la mosca (a la darrera cara), un cop
     * desplegada la capsa. Retorna { valid, motiu, longitud, pla: [punts 2D], espai: [punts 3D],
     * desplegament } (motiu: 'veines' si dues cares seguides no són veïnes, 'fora' si la recta
     * surt del cartró, 'inici' / 'final' si la seqüència no comença a A o no acaba a B).
     */
    function cami(sala, seq, aranya, mosca) {
        if (seq[0] !== 'A') return { valid: false, motiu: 'inici' };
        if (seq[seq.length - 1] !== 'B') return { valid: false, motiu: 'final' };
        if (new Set(seq).size !== seq.length) return { valid: false, motiu: 'repetida' };
        var d = desplega(sala, seq);
        if (!d) return { valid: false, motiu: 'veines' };
        var S = projecta(d.mapes[0], aranya),
            F = projecta(d.mapes[seq.length - 1], mosca);
        var v = sub2(F, S);
        var punts = [S],
            espai = [aranya],
            anterior = 0,
            valid = true;
        for (var i = 0; i < d.arestes.length; i++) {
            var a = d.arestes[i].pla[0],
                b = d.arestes[i].pla[1];
            var e = sub2(b, a);
            var den = v[0] * e[1] - v[1] * e[0];
            if (Math.abs(den) < 1e-12) {
                valid = false;
                break;
            }
            var w = sub2(a, S);
            var t = (w[0] * e[1] - w[1] * e[0]) / den; // al llarg del camí
            var u = (w[0] * v[1] - w[1] * v[0]) / den; // al llarg de l'aresta
            if (t < anterior - 1e-9 || t > 1 + 1e-9 || u < -1e-9 || u > 1 + 1e-9) {
                valid = false;
                break;
            }
            anterior = t;
            var X = add2(S, mul2(v, t));
            punts.push(X);
            espai.push(aixeca(d.mapes[i + 1], X));
        }
        punts.push(F);
        espai.push(mosca);
        return {
            valid: valid,
            motiu: valid ? null : 'fora',
            longitud: len2(v),
            pla: punts,
            espai: espai,
            desplegament: d,
        };
    }

    /** Totes les seqüències de cares de A a B (sense repetir cares), amb el seu camí. */
    function totsElsCamins(sala, aranya, mosca) {
        var laterals = ['sostre', 'porta', 'terra', 'finestra'];
        var out = [];
        (function cerca(seq) {
            var darrera = seq[seq.length - 1];
            if (darrera !== 'A' && veines(darrera, 'B')) {
                var s = seq.concat(['B']);
                var c = cami(sala, s, aranya, mosca);
                out.push({ seq: s, valid: c.valid, longitud: c.longitud });
            }
            laterals.forEach(function (f) {
                if (seq.indexOf(f) >= 0 || !veines(darrera, f)) return;
                cerca(seq.concat([f]));
            });
        })(['A']);
        return out;
    }

    // ── Comptar rectangles (AM 347) ────────────────────────────────────────
    /** Quants rectangles (amb els quadrats) i quants quadrats té un tauler de n × n, comptant-los un per un. */
    function rectangles(n) {
        var total = 0,
            quadrats = 0;
        for (var a = 1; a <= n; a++)
            for (var b = 1; b <= n; b++) {
                total += (n + 1 - a) * (n + 1 - b);
                if (a === b) quadrats += (n + 1 - a) * (n + 1 - a);
            }
        return { total: total, quadrats: quadrats };
    }
    /** Les fórmules de la solució de Dudeney. */
    function formulesRectangles(n) {
        return {
            total: Math.pow(n * n + n, 2) / 4,
            quadrats: (2 * n * n * n + 3 * n * n + n) / 6,
            noQuadrats: (3 * Math.pow(n, 4) + 2 * n * n * n - 3 * n * n - 2 * n) / 12,
        };
    }

    // ── L'amulet (CP 38) ───────────────────────────────────────────────────
    /** De quantes maneres s'arriba a cada lletra del triangle (fila f té f + 1 lletres): el triangle de Pascal. */
    function maneresAmulet(files) {
        var out = [[1]];
        for (var f = 1; f < files; f++) {
            var fila = [];
            for (var i = 0; i <= f; i++) fila.push((i > 0 ? out[f - 1][i - 1] : 0) + (i < f ? out[f - 1][i] : 0));
            out.push(fila);
        }
        return out;
    }
    /** Es pot passar de la lletra (f, i) a la (f + 1, j)? (A la de baix a l'esquerra o a la de baix a la dreta.) */
    var baixaAmulet = function (i, j) {
        return j === i || j === i + 1;
    };

    return {
        rectangles: rectangles,
        formulesRectangles: formulesRectangles,
        maneresAmulet: maneresAmulet,
        baixaAmulet: baixaAmulet,
        estripa: estripa,
        diferents: diferents,
        etiquetes: etiquetes,
        cares: cares,
        OPOSADA: OPOSADA,
        veines: veines,
        aresta: aresta,
        desplega: desplega,
        projecta: projecta,
        aixeca: aixeca,
        cami: cami,
        totsElsCamins: totsElsCamins,
    };
});
