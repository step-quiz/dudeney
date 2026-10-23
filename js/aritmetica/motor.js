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
 *   - les nou xifres (AM 90, AM 83): 100 com a nombre mixt i dos productes
 *     iguals, fent servir les xifres de l'1 al 9 una sola vegada.
 *   - els cinc bandolers (AM 133): els repartiments de 200 doblons.
 *   - teoria de nombres (tanda 5): els nombres curiosos (AM 114: n + 1 i n/2 + 1
 *     quadrats), les galetes dels rodamons (CP 114: la nit, pas a pas), les
 *     maneres d'escriure un nombre com a suma de dos quadrats (AM 136) i
 *     l'equació de Pell x² = D·y² + 1 amb BigInt i fraccions contínues (AM 129).
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

    // ── Les nou xifres (AM 90, AM 83) ──────────────────────────────────────
    var sumaXifres = function (n) {
        return String(n)
            .split('')
            .reduce(function (s, x) {
                return s + +x;
            }, 0);
    };
    /** Els nombres que formen les xifres (llista de 9) partides en grups de les mides donades. */
    function parteix(xifres, grups) {
        var out = [],
            k = 0;
        grups.forEach(function (g) {
            out.push(+xifres.slice(k, k + g).join(''));
            k += g;
        });
        return out;
    }
    /** a + b/c = 100? (b/c ha de ser un nombre enter perquè la suma ho sigui.) */
    var esCent = function (a, b, c) {
        return b % c === 0 && a + b / c === 100;
    };
    /** Totes les maneres d'escriure 100 = a + b/c amb les nou xifres, i tots els parells a × b = c × d. */
    function totesXifres() {
        var cent = [],
            productes = [],
            p = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var permuta = function (k) {
            if (k === 9) {
                var s = p.join('');
                for (var i = 1; i <= 2; i++)
                    for (var j = i + 1; j < 9; j++) {
                        var a = +s.slice(0, i),
                            b = +s.slice(i, j),
                            c = +s.slice(j);
                        if (esCent(a, b, c)) cent.push([a, b, c]);
                    }
                for (var x = 1; x < 9; x++)
                    for (var y = x + 1; y < 9; y++)
                        for (var z = y + 1; z < 9; z++) {
                            var n = [+s.slice(0, x), +s.slice(x, y), +s.slice(y, z), +s.slice(z)];
                            if (n[0] * n[1] === n[2] * n[3] && n[0] <= n[1] && n[2] <= n[3] && (n[0] < n[2] || (n[0] === n[2] && n[1] < n[3]))) productes.push(n);
                        }
                return;
            }
            for (var t = k; t < 9; t++) {
                var q = p[k];
                p[k] = p[t];
                p[t] = q;
                permuta(k + 1);
                p[t] = p[k];
                p[k] = q;
            }
        };
        permuta(0);
        return { cent: cent, productes: productes };
    }

    // ── Els cinc bandolers (AM 133) ────────────────────────────────────────
    /** null si [A, B, C, D, E] és un repartiment vàlid; si no, el motiu. */
    function motiuBandolers(q, total) {
        if (q.some(function (x) { return !Number.isInteger(x) || x < 1; })) return 'positius';
        if (q[0] + q[1] + q[2] + q[3] + q[4] !== total) return 'total';
        if (q[3] % 2 || q[4] % 3) return 'fraccions';
        if (12 * q[0] + 3 * q[1] + q[2] + q[3] / 2 + q[4] / 3 !== total) return 'canvi';
        return null;
    }
    /** Quants repartiments hi ha, en total i per a cada quantitat de l'Alfonso. */
    function compteBandolers(total) {
        var n = 0,
            perA = {};
        for (var A = 1; A <= total; A++)
            for (var B = 1; A + B < total; B++)
                for (var D = 2; A + B + D < total; D += 2)
                    for (var E = 3; A + B + D + E < total; E += 3) {
                        var C = total - A - B - D - E;
                        if (12 * A + 3 * B + C + D / 2 + E / 3 === total) {
                            n++;
                            perA[A] = (perA[A] || 0) + 1;
                        }
                    }
        return { total: n, perA: perA };
    }

    // ── Teoria de nombres (tanda 5) ───────────────────────────────────────
    /** L'arrel quadrada entera d'un BigInt (el més gran r amb r² ≤ n). */
    function arrelBig(n) {
        n = BigInt(n);
        if (n < 2n) return n;
        var x = BigInt(Math.floor(Math.sqrt(Number(n))));
        while (x * x > n) x--;
        while ((x + 1n) * (x + 1n) <= n) x++;
        return x;
    }
    /** L'arrel si n és un quadrat perfecte (com a BigInt), o null. Accepta Number o BigInt. */
    function arrelExacta(n) {
        n = BigInt(n);
        if (n < 0n) return null;
        var r = arrelBig(n);
        return r * r === n ? r : null;
    }
    /** AM 114: n és «curiós» si n + 1 i n/2 + 1 són quadrats. Retorna { a, b } (n + 1 = a², n/2 + 1 = b²) o null. */
    function curios(n) {
        if (n < 1 || n % 2) return null;
        var a = arrelExacta(n + 1),
            b = arrelExacta(n / 2 + 1);
        return a !== null && b !== null ? { a: Number(a), b: Number(b) } : null;
    }
    /** Els nombres curiosos fins a «fins», provant-los tots. */
    function curiososFins(fins) {
        var out = [];
        for (var n = 2; n <= fins; n += 2) if (curios(n)) out.push(n);
        return out;
    }
    /** Els k primers nombres curiosos per la recurrència: a² − 2b² = −1, (a, b) → (3a + 4b, 2a + 3b). */
    function curiososPell(k) {
        var a = 1,
            b = 1,
            out = [];
        for (var i = 0; i < k; i++) {
            var a2 = 3 * a + 4 * b;
            b = 2 * a + 3 * b;
            a = a2;
            out.push(a * a - 1);
        }
        return out;
    }
    /**
     * CP 114: la nit dels rodamons. Cada un, per torn, troba b galetes, en dona 1 al gos i se’n menja la quarta part
     * de la resta; al matí es reparteixen el que queda i en sobra 1 per al gos. Retorna { passos: [{ troba, gos,
     * menja, queda }], mati: { troba, cadascu }, motiu } (motiu null si tot va bé, o l'índex del pas que falla).
     */
    function galetes(n, homes) {
        homes = homes || 4;
        var b = n,
            passos = [];
        for (var i = 0; i < homes; i++) {
            if (b < 1 || (b - 1) % homes) return { passos: passos, mati: null, motiu: i, troba: b };
            var q = (b - 1) / homes;
            passos.push({ troba: b, gos: 1, menja: q, queda: b - 1 - q });
            b = b - 1 - q;
        }
        if (b < 1 || (b - 1) % homes || b - 1 === 0) return { passos: passos, mati: null, motiu: homes, troba: b };
        return { passos: passos, mati: { troba: b, cadascu: (b - 1) / homes }, motiu: null };
    }
    function galetesValides(fins, homes) {
        var out = [];
        for (var n = 1; n <= fins; n++) if (!galetes(n, homes).motiu && galetes(n, homes).mati) out.push(n);
        return out;
    }
    /** AM 136: les maneres d'escriure n com a suma de dos quadrats, a² + b² amb a ≥ b ≥ 1 (com compta Dudeney). */
    function dosQuadrats(n) {
        var out = [];
        for (var b = 1; 2 * b * b <= n; b++) {
            var a = arrelExacta(n - b * b);
            if (a !== null) out.push([Number(a), b]);
        }
        return out.sort(function (x, y) {
            return y[0] - x[0];
        });
    }
    /** El nombre més petit que es pot escriure exactament de k maneres (cerca fins a «fins»). */
    function minimManeres(k, fins) {
        for (var n = 1; n <= fins; n++) if (dosQuadrats(n).length === k) return n;
        return null;
    }
    /** La fracció contínua de √D: [a0; a1, a2, …] (el període acaba quan a = 2·a0). */
    function fraccioArrel(D) {
        D = BigInt(D);
        var a0 = arrelBig(D);
        if (a0 * a0 === D) return [a0];
        var m = 0n,
            d = 1n,
            a = a0,
            out = [a0];
        do {
            m = d * a - m;
            d = (D - m * m) / d;
            a = (a0 + m) / d;
            out.push(a);
        } while (a !== 2n * a0);
        return out;
    }
    /**
     * Les reduïdes p/q de √D (BigInt) fins a la solució mínima de x² − D·y² = 1, amb el valor de p² − D·q² de
     * cada una. Retorna { reduides: [{ p, q, valor }], x, y }.
     */
    function pell(D) {
        D = BigInt(D);
        var a0 = arrelBig(D);
        if (a0 * a0 === D) return null;
        var m = 0n,
            d = 1n,
            a = a0;
        var p0 = 1n,
            p1 = a0,
            q0 = 0n,
            q1 = 1n;
        var reduides = [{ p: p1, q: q1, valor: p1 * p1 - D * q1 * q1 }];
        while (p1 * p1 - D * q1 * q1 !== 1n) {
            m = d * a - m;
            d = (D - m * m) / d;
            a = (a0 + m) / d;
            var p2 = a * p1 + p0,
                q2 = a * q1 + q0;
            p0 = p1;
            p1 = p2;
            q0 = q1;
            q1 = q2;
            reduides.push({ p: p1, q: q1, valor: p1 * p1 - D * q1 * q1 });
        }
        return { reduides: reduides, x: p1, y: q1 };
    }

    return {
        arrelBig: arrelBig,
        arrelExacta: arrelExacta,
        curios: curios,
        curiososFins: curiososFins,
        curiososPell: curiososPell,
        galetes: galetes,
        galetesValides: galetesValides,
        dosQuadrats: dosQuadrats,
        minimManeres: minimManeres,
        fraccioArrel: fraccioArrel,
        pell: pell,
        sumaXifres: sumaXifres,
        parteix: parteix,
        esCent: esCent,
        totesXifres: totesXifres,
        motiuBandolers: motiuBandolers,
        compteBandolers: compteBandolers,
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
