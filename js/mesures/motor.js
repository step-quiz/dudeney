/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/mesures/motor.js
 * ROL: Les regles dels trencaclosques de mesurar i de travessar:
 *   - gerres: vessar d'una gerra a una altra fins que la primera es buida o la
 *     segona s'omple (AM 365, el nou problema de mesures);
 *   - barca: travessar un riu amb una barca que aguanta un pes màxim; algú de la
 *     barca ha de saber remar (AM 373, travessant el rierol). O bé amb un
 *     nombre màxim de places i una regla de parelles: ningú amb «parella» no pot
 *     estar amb un «cap» que no sigui el seu si el seu no hi és (AM 375).
 *   - politja: dues cistelles penjades d'una politja, una a la finestra i l'altra
 *     a terra; la que pesa més baixa, i si porta una persona no pot pesar més de
 *     15 lliures més que l'altra (AM 377, el tresor del castell).
 *   Per a cada model: moviments legals (amb el motiu si no ho són), aplicar-los,
 *   saber si està resolt i els veïns per a la cerca en amplada.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   gerres: estat = [quantitat a cada gerra]; capacitats a part.
 *   barca:  estat = { costat: [0 | 1 per a cada passatger], barca: 0 | 1 }
 *           (0 = la riba d'on surten, 1 = l'altra).
 *   politja: estat = { lloc: [0 | 1 per a cada objecte], dalt: 0 | 1 } (0 = a la finestra,
 *           1 = a terra; dalt = quina de les dues cistelles és a la finestra).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.MotorMesurar = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── Gerres ─────────────────────────────────────────────────────────────
    var gerres = {
        /**
         * La quantitat que passaria de i a j (0 si no se'n pot vessar res). Una capacitat Infinity és una
         * persona que beu: rep tot el que hi ha al recipient i no en torna res (AM 362).
         */
        quantitat: function (estat, caps, i, j) {
            if (i === j || caps[i] === Infinity) return 0;
            return Math.min(estat[i], caps[j] - estat[j]);
        },
        motiu: function (estat, caps, i, j) {
            if (i === j) return 'mateixa';
            if (caps[i] === Infinity) return 'persona';
            if (!estat[i]) return 'buida';
            if (estat[j] === caps[j]) return 'plena';
            return null;
        },
        vessa: function (estat, caps, i, j) {
            var q = gerres.quantitat(estat, caps, i, j);
            var e = estat.slice();
            e[i] -= q;
            e[j] += q;
            return e;
        },
        /** objectiu: { gerra: quantitat, … } (les que no hi són, no compten). */
        resolt: function (estat, objectiu) {
            return Object.keys(objectiu).every(function (k) {
                return estat[+k] === objectiu[k];
            });
        },
        clau: function (estat) {
            return estat.join(',');
        },
        veins: function (caps) {
            return function (estat) {
                var out = [];
                for (var i = 0; i < estat.length; i++)
                    for (var j = 0; j < estat.length; j++)
                        if (gerres.quantitat(estat, caps, i, j) > 0)
                            out.push({ estat: gerres.vessa(estat, caps, i, j), mov: [i, j] });
                return out;
            };
        },
    };

    // ── Barca ──────────────────────────────────────────────────────────────
    // passatgers: [{ id, pes, rema, cap?, parella? }], capacitat: pes màxim de la barca (opcional),
    // places: nombre màxim de persones (opcional). Amb la regla de parelles, un passatger amb
    // «parella» (l'índex del seu cap) no pot estar amb cap altre passatger «cap» si el seu no hi és.
    var barca = {
        /** Un passatger que, en aquest grup, queda amb un cap que no és el seu: [qui, amb qui], o null. */
        conflicte: function (problema, grup) {
            var ps = problema.passatgers;
            var caps = grup.filter(function (i) {
                return ps[i].cap;
            });
            if (!caps.length) return null;
            for (var k = 0; k < grup.length; k++) {
                var q = ps[grup[k]];
                if (q.parella === undefined || caps.indexOf(q.parella) >= 0) continue;
                return [grup[k], caps[0]];
            }
            return null;
        },
        /** El conflicte a les ribes si el grup travessa: { riba: 0 | 1, qui, amb } o null. */
        conflicteRibes: function (estat, problema, grup) {
            var c = estat.costat.slice();
            grup.forEach(function (i) {
                c[i] = 1 - c[i];
            });
            for (var r = 0; r < 2; r++) {
                var x = barca.conflicte(
                    problema,
                    c
                        .map(function (s, i) {
                            return s === r ? i : -1;
                        })
                        .filter(function (i) {
                            return i >= 0;
                        })
                );
                if (x) return { riba: r, qui: x[0], amb: x[1] };
            }
            return null;
        },
        inicial: function (passatgers) {
            return {
                costat: passatgers.map(function () {
                    return 0;
                }),
                barca: 0,
            };
        },
        /** null si el grup (índexs) pot travessar; si no, el motiu. */
        motiu: function (estat, problema, grup) {
            if (!grup.length) return 'buida';
            var pes = 0,
                rema = false;
            for (var i = 0; i < grup.length; i++) {
                var p = problema.passatgers[grup[i]];
                if (estat.costat[grup[i]] !== estat.barca) return 'lluny';
                pes += p.pes || 0;
                if (p.rema) rema = true;
            }
            if (problema.capacitat && pes > problema.capacitat) return 'pes';
            if (problema.places && grup.length > problema.places) return 'places';
            if (!rema) return 'rem';
            if (barca.conflicte(problema, grup)) return 'parella-barca';
            if (barca.conflicteRibes(estat, problema, grup)) return 'parella-riba';
            return null;
        },
        pes: function (problema, grup) {
            return grup.reduce(function (s, i) {
                return s + problema.passatgers[i].pes;
            }, 0);
        },
        travessa: function (estat, grup) {
            var c = estat.costat.slice();
            grup.forEach(function (i) {
                c[i] = 1 - c[i];
            });
            return { costat: c, barca: 1 - estat.barca };
        },
        resolt: function (estat) {
            return estat.costat.every(function (x) {
                return x === 1;
            });
        },
        clau: function (estat) {
            return estat.costat.join('') + '/' + estat.barca;
        },
        veins: function (problema) {
            var n = problema.passatgers.length;
            return function (estat) {
                var out = [];
                for (var m = 1; m < 1 << n; m++) {
                    var grup = [];
                    for (var i = 0; i < n; i++) if (m & (1 << i)) grup.push(i);
                    if (problema.places && grup.length > problema.places) continue;
                    if (!barca.motiu(estat, problema, grup))
                        out.push({ estat: barca.travessa(estat, grup), mov: grup });
                }
                return out;
            };
        },
    };

    // ── Politja ────────────────────────────────────────────────────────────
    // problema: { objectes: [{ id, pes, persona }], diferencia (lliures), maxim (objectes per cistella) }
    var politja = {
        inicial: function (problema) {
            return {
                lloc: problema.objectes.map(function () {
                    return 0;
                }),
                dalt: 0,
            };
        },
        pes: function (problema, grup) {
            return grup.reduce(function (s, i) {
                return s + problema.objectes[i].pes;
            }, 0);
        },
        /** null si, amb aquests objectes a la cistella de dalt i a la de baix, la de dalt baixa bé; si no, el motiu. */
        motiu: function (estat, problema, dalt, baix) {
            var ob = problema.objectes;
            if (!dalt.length && !baix.length) return 'buides';
            if (dalt.some(function (i) { return estat.lloc[i] !== 0; }) || baix.some(function (i) { return estat.lloc[i] !== 1; })) return 'lluny';
            if (dalt.length > problema.maxim || baix.length > problema.maxim) return 'massa';
            var pd = politja.pes(problema, dalt),
                pb = politja.pes(problema, baix);
            if (pd <= pb) return 'lleugera';
            var persona = dalt.some(function (i) {
                return ob[i].persona;
            });
            if (persona && pd - pb > problema.diferencia) return 'rapid';
            return null;
        },
        /** La cistella de dalt baixa: el que hi havia a dalt passa a terra i el de baix, a la finestra. */
        baixa: function (estat, dalt, baix) {
            var l = estat.lloc.slice();
            dalt.forEach(function (i) {
                l[i] = 1;
            });
            baix.forEach(function (i) {
                l[i] = 0;
            });
            return { lloc: l, dalt: 1 - estat.dalt };
        },
        resolt: function (estat) {
            return estat.lloc.every(function (x) {
                return x === 1;
            });
        },
        clau: function (estat) {
            return estat.lloc.join('');
        },
        /** Totes les manipulacions possibles: grups de dalt i de baix (fins a «maxim» objectes cadascun). */
        veins: function (problema) {
            var n = problema.objectes.length;
            return function (estat) {
                var out = [],
                    grups = [[], []];
                for (var m = 0; m < 1 << n; m++) {
                    var g = [];
                    for (var i = 0; i < n; i++) if (m & (1 << i)) g.push(i);
                    if (g.length > problema.maxim) continue;
                    var costat = g.length ? estat.lloc[g[0]] : -1;
                    if (g.some(function (i) { return estat.lloc[i] !== costat; })) continue;
                    if (costat === 0 || costat === -1) grups[0].push(g);
                    if (costat === 1 || costat === -1) grups[1].push(g);
                }
                grups[0].forEach(function (d) {
                    grups[1].forEach(function (b) {
                        if (!politja.motiu(estat, problema, d, b)) out.push({ estat: politja.baixa(estat, d, b), mov: [d, b] });
                    });
                });
                return out;
            };
        },
    };

    return { gerres: gerres, barca: barca, politja: politja };
});
