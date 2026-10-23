/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/comu/cerca.js
 * ROL: Cerca en amplada (BFS) sobre un espai d'estats: el nombre mínim de
 *      moviments d'un trencaclosques i una solució mínima. La fan servir els
 *      motors (fitxes, mesures, camins) i els tests, per confirmar cada «es pot
 *      fer en n moviments i no menys» de Dudeney.
 * ARQUITECTURA: Pur, sense DOM. Script clàssic amb exportació dual
 *      (window.Cerca o module.exports), perquè funcioni amb doble clic.
 *      bfs({ inicial, veins(estat) → [{ estat, mov }], clau(estat) → text,
 *            esObjectiu(estat), maxim }) → { distancia, cami: [mov], visitats }
 *      distancia = null si no s'hi arriba (o si se supera maxim estats).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Cerca = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function bfs(o) {
        var clau = o.clau,
            maxim = o.maxim || 5e6;
        var k0 = clau(o.inicial);
        var pare = new Map(); // clau → [clau del pare, moviment]
        pare.set(k0, null);
        var cua = [o.inicial],
            claus = [k0],
            cap = 0;
        var trobat = null;
        if (o.esObjectiu(o.inicial)) trobat = k0;
        while (!trobat && cap < cua.length) {
            var e = cua[cap],
                k = claus[cap];
            cap++;
            var vs = o.veins(e);
            for (var i = 0; i < vs.length; i++) {
                var kv = clau(vs[i].estat);
                if (pare.has(kv)) continue;
                pare.set(kv, [k, vs[i].mov]);
                if (o.esObjectiu(vs[i].estat)) {
                    trobat = kv;
                    break;
                }
                cua.push(vs[i].estat);
                claus.push(kv);
                if (pare.size > maxim) return { distancia: null, cami: null, visitats: pare.size };
            }
        }
        if (!trobat) return { distancia: null, cami: null, visitats: pare.size };
        var cami = [];
        for (var x = pare.get(trobat); x; x = pare.get(x[0])) cami.push(x[1]);
        cami.reverse();
        return { distancia: cami.length, cami: cami, visitats: pare.size };
    }

    /** Totes les distàncies des de l'estat inicial (per explorar espais petits). */
    function distancies(o) {
        var d = new Map();
        var k0 = o.clau(o.inicial);
        d.set(k0, 0);
        var cua = [o.inicial],
            cap = 0;
        while (cap < cua.length) {
            var e = cua[cap++];
            var de = d.get(o.clau(e));
            var vs = o.veins(e);
            for (var i = 0; i < vs.length; i++) {
                var kv = o.clau(vs[i].estat);
                if (d.has(kv)) continue;
                d.set(kv, de + 1);
                cua.push(vs[i].estat);
            }
        }
        return d;
    }

    return { bfs: bfs, distancies: distancies };
});
