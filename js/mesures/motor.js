/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/mesures/motor.js
 * ROL: Les regles dels trencaclosques de mesurar i de travessar:
 *   - gerres: vessar d'una gerra a una altra fins que la primera es buida o la
 *     segona s'omple (AM 365, el nou problema de mesures);
 *   - barca: travessar un riu amb una barca que aguanta un pes màxim; algú de la
 *     barca ha de saber remar (AM 373, travessant el rierol).
 *   Per a cada model: moviments legals (amb el motiu si no ho són), aplicar-los,
 *   saber si està resolt i els veïns per a la cerca en amplada.
 * ARQUITECTURA: Pur, sense DOM (també el fan servir els tests de Node).
 *   gerres: estat = [quantitat a cada gerra]; capacitats a part.
 *   barca:  estat = { costat: [0 | 1 per a cada passatger], barca: 0 | 1 }
 *           (0 = la riba d'on surten, 1 = l'altra).
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
        /** La quantitat que passaria de i a j (0 si no se'n pot vessar res). */
        quantitat: function (estat, caps, i, j) {
            if (i === j) return 0;
            return Math.min(estat[i], caps[j] - estat[j]);
        },
        motiu: function (estat, caps, i, j) {
            if (i === j) return 'mateixa';
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
    // passatgers: [{ id, pes, rema }], capacitat: pes màxim de la barca
    var barca = {
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
                pes += p.pes;
                if (p.rema) rema = true;
            }
            if (pes > problema.capacitat) return 'pes';
            if (!rema) return 'rem';
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
                    if (!barca.motiu(estat, problema, grup))
                        out.push({ estat: barca.travessa(estat, grup), mov: grup });
                }
                return out;
            };
        },
    };

    return { gerres: gerres, barca: barca };
});
