/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/comu/fraccio.js
 * ROL: Nombres racionals exactes (fraccions) per als quadrats màgics: llegir
 *   el que escriu l'alumne («4½», «4 1/2», «9/2», «4,5», «−3»), sumar,
 *   comparar i escriure'ls bonics («4½», «7/5», «−2¼»).
 * ARQUITECTURA: Pur, sense DOM. Una fracció és [numerador, denominador], amb
 *   el denominador positiu i la fracció simplificada.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Fraccio = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function mcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            var t = a % b;
            a = b;
            b = t;
        }
        return a || 1;
    }
    function fr(n, d) {
        if (d === undefined) d = 1;
        if (!d) return null;
        if (d < 0) {
            n = -n;
            d = -d;
        }
        var g = mcd(n, d);
        return [n / g, d / g];
    }
    var suma = function (a, b) {
        return fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
    };
    var resta = function (a, b) {
        return fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
    };
    var igual = function (a, b) {
        return a[0] === b[0] && a[1] === b[1];
    };
    var esEnter = function (a) {
        return a[1] === 1;
    };

    // Les fraccions que tenen un caràcter propi
    var VULGARS = {
        '½': [1, 2],
        '⅓': [1, 3],
        '⅔': [2, 3],
        '¼': [1, 4],
        '¾': [3, 4],
        '⅕': [1, 5],
        '⅖': [2, 5],
        '⅗': [3, 5],
        '⅘': [4, 5],
        '⅙': [1, 6],
        '⅚': [5, 6],
        '⅛': [1, 8],
        '⅜': [3, 8],
        '⅝': [5, 8],
        '⅞': [7, 8],
    };
    var PER_VULGAR = {};
    Object.keys(VULGARS).forEach(function (k) {
        PER_VULGAR[VULGARS[k].join('/')] = k;
    });

    /**
     * Llegeix un nombre escrit: enter, decimal amb coma o punt, fracció «a/b», nombre mixt
     * «4 1/2» o «4½». Retorna la fracció, o null si no s'entén.
     */
    function llegeix(text) {
        if (typeof text !== 'string') return null;
        var t = text.trim().replace(/−/g, '-').replace(/\s+/g, ' ');
        if (!t) return null;
        var negatiu = false;
        if (t[0] === '-') {
            negatiu = true;
            t = t.slice(1).trim();
        }
        var m, valor = null;
        if ((m = /^(\d+)?\s?([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])$/.exec(t))) {
            valor = suma(fr(+(m[1] || 0)), VULGARS[m[2]]);
        } else if ((m = /^(\d+) (\d+)\/(\d+)$/.exec(t))) {
            if (+m[3] === 0) return null;
            valor = suma(fr(+m[1]), fr(+m[2], +m[3]));
        } else if ((m = /^(\d+)\/(\d+)$/.exec(t))) {
            if (+m[2] === 0) return null;
            valor = fr(+m[1], +m[2]);
        } else if ((m = /^(\d*)[.,](\d+)$/.exec(t))) {
            var d = Math.pow(10, m[2].length);
            valor = fr(+(m[1] || 0) * d + +m[2], d);
        } else if (/^\d+$/.test(t)) {
            valor = fr(+t);
        }
        if (!valor) return null;
        return negatiu ? fr(-valor[0], valor[1]) : valor;
    }

    /** Com s'escriu: «4½», «2¾», «7/5», «3 1/7», «−2». */
    function text(a) {
        var signe = a[0] < 0 ? '−' : '';
        var n = Math.abs(a[0]),
            d = a[1];
        if (d === 1) return signe + n;
        var enter = Math.floor(n / d),
            resta0 = n % d;
        var v = PER_VULGAR[resta0 + '/' + d];
        if (v) return signe + (enter ? enter : '') + v;
        return signe + (enter ? enter + ' ' : '') + resta0 + '/' + d;
    }

    return { fr: fr, suma: suma, resta: resta, igual: igual, esEnter: esEnter, llegeix: llegeix, text: text };
});
