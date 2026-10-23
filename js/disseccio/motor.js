/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/disseccio/motor.js
 * ROL: Les regles dels trencaclosques de tallar i tornar a ajuntar:
 *   - peces lliures (CP 26, el trencaclosques del mercer): polígons que es
 *     mouen i giren de 90° en 90° (no es poden girar del revés); s'encaixen
 *     quan queden prou a prop d'una de les posicions de la solució, i el
 *     quadrat queda resolt si les peces el cobreixen sense forats ni trossos
 *     de més. També la cadena de frontisses de Dudeney (triangle ↔ quadrat).
 *   - peces de quadrícula (AM 174, els quadrats de brocat): grups de quadrets
 *     que només es poden traslladar (el dibuix de la roba no es pot girar) i
 *     que han d'omplir el quadrat gran amb el dibuix ben casat.
 *   - particions (AM 146): una figura feta de triangles petits que es reparteixen
 *     en grups; es comprova que els grups són connexos, de la mateixa mida i
 *     iguals (congruents, girant-los o donant-los la volta).
 *   - peces en xarxa (AM 147, AM 151): polígons amb els vèrtexs en una xarxa de
 *     mig quadret, que es traslladen per la xarxa i giren de 90° en 90°.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   Punts [x, y] amb la y cap amunt. Una posició (pose) és { g, x, y }: el gir
 *   g (graus, múltiple de 90) al voltant del centre de la peça i, després, la
 *   translació (x, y). La peça a la posició inicial té { g: 0, x: 0, y: 0 }.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorDisseccio = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── Polígons ───────────────────────────────────────────────────────────
    function areaAmbSigne(pts) {
        var s = 0;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i],
                q = pts[(i + 1) % pts.length];
            s += p[0] * q[1] - p[1] * q[0];
        }
        return s / 2;
    }
    function area(pts) {
        return Math.abs(areaAmbSigne(pts));
    }
    /** El centre de masses del polígon. */
    function centre(pts) {
        var a = areaAmbSigne(pts),
            cx = 0,
            cy = 0;
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i],
                q = pts[(i + 1) % pts.length],
                k = p[0] * q[1] - q[0] * p[1];
            cx += (p[0] + q[0]) * k;
            cy += (p[1] + q[1]) * k;
        }
        return [cx / (6 * a), cy / (6 * a)];
    }
    function gira(v, graus) {
        var r = (graus * Math.PI) / 180,
            c = Math.cos(r),
            s = Math.sin(r);
        // els girs de 90° han de ser exactes
        if (graus % 90 === 0) {
            var k = (((graus / 90) % 4) + 4) % 4;
            c = [1, 0, -1, 0][k];
            s = [0, 1, 0, -1][k];
        }
        return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
    }
    /** Els punts del polígon a la posició pose (c = el centre de la peça). */
    function aplica(pts, pose, c) {
        return pts.map(function (p) {
            var v = gira([p[0] - c[0], p[1] - c[1]], pose.g);
            return [v[0] + c[0] + pose.x, v[1] + c[1] + pose.y];
        });
    }
    /** El punt p és dins del polígon? (raig cap a la dreta) */
    function dins(p, pts) {
        var x = p[0],
            y = p[1],
            d = false;
        for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
            var a = pts[i],
                b = pts[j];
            if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) d = !d;
        }
        return d;
    }
    function esConvex(pts) {
        var signe = 0;
        for (var i = 0; i < pts.length; i++) {
            var a = pts[i],
                b = pts[(i + 1) % pts.length],
                c = pts[(i + 2) % pts.length];
            var z = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
            if (Math.abs(z) < 1e-12) continue;
            if (!signe) signe = Math.sign(z);
            else if (Math.sign(z) !== signe) return false;
        }
        return true;
    }
    /** La intersecció de dos polígons convexos (Sutherland–Hodgman); el primer, en sentit antihorari. */
    function interseccio(subjecte, retall) {
        var sortida = subjecte.slice();
        if (areaAmbSigne(retall) < 0) retall = retall.slice().reverse();
        for (var i = 0; i < retall.length && sortida.length; i++) {
            var a = retall[i],
                b = retall[(i + 1) % retall.length];
            var entrada = sortida;
            sortida = [];
            var costat = function (p) {
                return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
            };
            for (var j = 0; j < entrada.length; j++) {
                var p = entrada[j],
                    q = entrada[(j + 1) % entrada.length];
                var cp = costat(p),
                    cq = costat(q);
                if (cp >= 0) sortida.push(p);
                if (cp >= 0 !== cq >= 0) {
                    var t = cp / (cp - cq);
                    sortida.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
                }
            }
        }
        return sortida;
    }

    // ── Peces lliures: on encaixen ─────────────────────────────────────────
    /**
     * Les posicions de cada peça a la solució, i les que surten de girar tot el quadrat
     * 90°, 180° i 270° al voltant del seu centre Q (el quadrat queda igual).
     *   peces: [[punts], …]; solucio: [{ g, x, y }, …] (una per peça); Q: [x, y]
     * Retorna variants[k][i] = { g, x, y }.
     */
    function variants(peces, solucio, Q) {
        var out = [];
        for (var k = 0; k < 4; k++) {
            out.push(
                peces.map(function (pts, i) {
                    var c = centre(pts),
                        s = solucio[i];
                    var v = gira([c[0] + s.x - Q[0], c[1] + s.y - Q[1]], 90 * k);
                    return { g: (((s.g + 90 * k) % 360) + 360) % 360, x: v[0] + Q[0] - c[0], y: v[1] + Q[1] - c[1] };
                })
            );
        }
        return out;
    }
    /** Si la peça i, a la posició pose, és prou a prop d'una posició de la solució: aquella posició. */
    function encaix(i, pose, vars, tolerancia) {
        var g = ((pose.g % 360) + 360) % 360,
            millor = null,
            dist = tolerancia;
        vars.forEach(function (v, k) {
            var o = v[i];
            if (o.g !== g) return;
            var d = Math.hypot(o.x - pose.x, o.y - pose.y);
            if (d <= dist) {
                dist = d;
                millor = { g: o.g, x: o.x, y: o.y, variant: k };
            }
        });
        return millor;
    }
    /**
     * Com cobreixen les peces el polígon objectiu: es miren n × n punts de la seva capsa.
     * poligons: les peces ja col·locades. Retorna { forats, doble, fora } en fracció de l'àrea
     * (forats: punts de l'objectiu sense cap peça; doble: amb dues o més; fora: punts de
     * peça fora de l'objectiu, en proporció a l'àrea de l'objectiu).
     */
    function cobertura(poligons, objectiu, n) {
        n = n || 200;
        var x0 = Infinity,
            x1 = -Infinity,
            y0 = Infinity,
            y1 = -Infinity;
        poligons.concat([objectiu]).forEach(function (pts) {
            pts.forEach(function (p) {
                x0 = Math.min(x0, p[0]);
                x1 = Math.max(x1, p[0]);
                y0 = Math.min(y0, p[1]);
                y1 = Math.max(y1, p[1]);
            });
        });
        var dins0 = 0,
            forats = 0,
            doble = 0,
            fora = 0;
        for (var a = 0; a < n; a++)
            for (var b = 0; b < n; b++) {
                var p = [x0 + ((a + 0.5) * (x1 - x0)) / n, y0 + ((b + 0.5) * (y1 - y0)) / n];
                var quantes = 0;
                for (var i = 0; i < poligons.length; i++) if (dins(p, poligons[i])) quantes++;
                if (dins(p, objectiu)) {
                    dins0++;
                    if (!quantes) forats++;
                    else if (quantes > 1) doble++;
                } else if (quantes) fora++;
            }
        return { forats: forats / dins0, doble: doble / dins0, fora: fora / dins0 };
    }

    // ── La cadena de frontisses (triangle ↔ quadrat) ───────────────────────
    // Un moviment rígid { a, x, y }: p → R(a)·p + (x, y)
    function moviment(m, p) {
        var v = gira(p, m.a);
        return [v[0] + m.x, v[1] + m.y];
    }
    function compon(m2, m1) {
        // primer m1, després m2
        var t = moviment(m2, [m1.x, m1.y]);
        return { a: m1.a + m2.a, x: t[0], y: t[1] };
    }
    function giraAlVoltant(c, graus) {
        var v = gira(c, graus);
        return { a: graus, x: c[0] - v[0], y: c[1] - v[1] };
    }
    /**
     * Els moviments de cada peça per al paràmetre s (0 = triangle, 1 = quadrat).
     *   frontisses: [{ peca, pare, punt: [x, y], angle }] en ordre (el pare abans que el fill);
     *   les peces sense frontissa no es mouen. Cada peça gira, respecte del seu pare,
     *   s · angle al voltant de la frontissa (que es mou amb el pare).
     */
    function cadena(nPeces, frontisses, s) {
        var mov = [];
        for (var i = 0; i < nPeces; i++) mov.push({ a: 0, x: 0, y: 0 });
        frontisses.forEach(function (f) {
            var pare = mov[f.pare];
            var punt = moviment(pare, f.punt);
            mov[f.peca] = compon(giraAlVoltant(punt, s * f.angle), pare);
        });
        return mov;
    }
    function mou(pts, m) {
        return pts.map(function (p) {
            return moviment(m, p);
        });
    }

    // ── Peces de quadrícula ────────────────────────────────────────────────
    // Una peça: { celles: [[fila, col], …] } a la seva posició inicial; la posició
    // és la translació { f, c } (en quadrets). Fila 0 a dalt.
    function celles(peca, pos) {
        return peca.celles.map(function (q) {
            return [q[0] + pos.f, q[1] + pos.c];
        });
    }
    /** El dibuix de la roba: en els quadrets amb (fila + columna) parell hi ha una flor. */
    var flor = function (fila, col) {
        return (((fila + col) % 2) + 2) % 2 === 0;
    };
    /**
     * Comprova el quadrat gran (mida × mida, amb la cantonada a origen = [fila, col]).
     *   peces, posicions: les peces i les seves translacions
     * Retorna { complet, forats, dobles, fora, patro: true si totes les peces tenen el dibuix
     * en fase (una translació amb fila + col parell no el canvia) }.
     */
    function comprovaQuadricula(peces, posicions, mida, origen) {
        var compte = {},
            fora = 0;
        peces.forEach(function (p, i) {
            celles(p, posicions[i]).forEach(function (q) {
                var f = q[0] - origen[0],
                    c = q[1] - origen[1];
                if (f < 0 || c < 0 || f >= mida || c >= mida) {
                    fora++;
                    return;
                }
                var k = f + ',' + c;
                compte[k] = (compte[k] || 0) + 1;
            });
        });
        var forats = 0,
            dobles = 0;
        for (var f = 0; f < mida; f++)
            for (var c = 0; c < mida; c++) {
                var n = compte[f + ',' + c] || 0;
                if (!n) forats++;
                else if (n > 1) dobles++;
            }
        var fases = posicions.map(function (p) {
            return (((p.f + p.c - origen[0] - origen[1]) % 2) + 2) % 2;
        });
        var patro = fases.every(function (x) {
            return x === fases[0];
        });
        return { complet: !forats && !dobles && !fora, forats: forats, dobles: dobles, fora: fora, patro: patro };
    }

    // ── Particions en peces iguals (AM 146) ────────────────────────────────
    var SIMETRIES = [
        function (x, y) { return [x, y]; },
        function (x, y) { return [-y, x]; },
        function (x, y) { return [-x, -y]; },
        function (x, y) { return [y, -x]; },
        function (x, y) { return [-x, y]; },
        function (x, y) { return [y, x]; },
        function (x, y) { return [x, -y]; },
        function (x, y) { return [-y, -x]; },
    ];
    /** Una forma (llista de polígons) escrita igual per a totes les seves còpies girades, mogudes o del revés. */
    function formaCanonica(poligons) {
        var millor = null;
        SIMETRIES.forEach(function (f) {
            var ps = poligons.map(function (pg) {
                return pg.map(function (q) {
                    var r = f(q[0], q[1]);
                    return [Math.round(r[0] * 4), Math.round(r[1] * 4)];
                });
            });
            var mx = Infinity,
                my = Infinity;
            ps.forEach(function (pg) {
                pg.forEach(function (q) {
                    mx = Math.min(mx, q[0]);
                    my = Math.min(my, q[1]);
                });
            });
            var k = ps
                .map(function (pg) {
                    return pg
                        .map(function (q) {
                            return q[0] - mx + ',' + (q[1] - my);
                        })
                        .sort()
                        .join(' ');
                })
                .sort()
                .join(' | ');
            if (millor === null || k < millor) millor = k;
        });
        return millor;
    }
    /** Dos polígons comparteixen un costat sencer? */
    function costatComu(a, b) {
        var cl = function (p, q) {
            var u = p.join(','),
                v = q.join(',');
            return u < v ? u + '/' + v : v + '/' + u;
        };
        var ca = {};
        a.forEach(function (p, i) {
            ca[cl(p, a[(i + 1) % a.length])] = true;
        });
        return b.some(function (p, i) {
            return ca[cl(p, b[(i + 1) % b.length])];
        });
    }
    /**
     * Comprova un repartiment: grups[i] és el grup (0…k − 1) del triangle i, o −1. Retorna null si hi ha k
     * peces iguals; si no, { motiu: 'incomplet' | 'mida' | 'partida' | 'diferents', peca, altra }.
     */
    function particio(triangles, grups, k) {
        if (grups.some(function (g) { return g < 0; })) return { motiu: 'incomplet' };
        var peces = [];
        for (var g = 0; g < k; g++)
            peces.push(
                triangles.filter(function (t, i) {
                    return grups[i] === g;
                })
            );
        var mida = triangles.length / k;
        for (g = 0; g < k; g++) if (peces[g].length !== mida) return { motiu: 'mida', peca: g, mida: peces[g].length };
        for (g = 0; g < k; g++) {
            var pc = peces[g],
                vist = [0],
                cua = [0];
            while (cua.length) {
                var a = cua.shift();
                for (var j = 0; j < pc.length; j++)
                    if (vist.indexOf(j) < 0 && costatComu(pc[a], pc[j])) {
                        vist.push(j);
                        cua.push(j);
                    }
            }
            if (vist.length < pc.length) return { motiu: 'partida', peca: g };
        }
        var f0 = formaCanonica(peces[0]);
        for (g = 1; g < k; g++) if (formaCanonica(peces[g]) !== f0) return { motiu: 'diferents', peca: 0, altra: g };
        return null;
    }

    // ── Peces en xarxa (AM 147, AM 151) ────────────────────────────────────
    // Una posició és { r, x, y }: r girs de 90° (x, y) → (−y, x) i després la translació (x, y).
    function aXarxa(pts, pose) {
        return pts.map(function (q) {
            var v = q;
            for (var i = 0; i < ((pose.r % 4) + 4) % 4; i++) v = [-v[1], v[0]];
            return [v[0] + pose.x, v[1] + pose.y];
        });
    }
    /** Les peces (amb les seves posicions) omplen el polígon objectiu sense forats ni trossos de més? */
    function omple(peces, poses, objectiu) {
        var pgs = peces.map(function (pc, i) {
            return aXarxa(pc, poses[i]);
        });
        var c = cobertura(pgs, objectiu, 160);
        return c.forats < 0.002 && c.doble < 0.002 && c.fora < 0.002;
    }

    return {
        formaCanonica: formaCanonica,
        particio: particio,
        aXarxa: aXarxa,
        omple: omple,
        area: area,
        areaAmbSigne: areaAmbSigne,
        centre: centre,
        gira: gira,
        aplica: aplica,
        dins: dins,
        esConvex: esConvex,
        interseccio: interseccio,
        variants: variants,
        encaix: encaix,
        cobertura: cobertura,
        cadena: cadena,
        mou: mou,
        celles: celles,
        flor: flor,
        comprovaQuadricula: comprovaQuadricula,
    };
});
