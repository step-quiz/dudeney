/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: js/comu/registre.js
 * ROL: La llista ordenada dels enigmes: per tipus (l'ordre de Comu.ORDRE_TIPUS)
 *   i, dins de cada tipus, pel camp «ordre» (de més fàcil a més difícil).
 *   Cada fitxer de dades (js/<tipus>/problemes.js) afegeix els seus enigmes a
 *   window.DUDENEY; cada tauler es registra a window.Taulers.
 * ARQUITECTURA: window.Dudeney.llista(), .perId(id)
 * DEPENDÈNCIES: js/comu/comu.js (ORDRE_TIPUS); s'ha de carregar abans de les dades.
 * ============================================================================
 */
window.DUDENEY = window.DUDENEY || [];
window.Taulers = window.Taulers || {};
window.Dudeney = (() => {
    'use strict';
    function llista() {
        const ordre = window.Comu.ORDRE_TIPUS;
        return window.DUDENEY.slice().sort(
            (a, b) => ordre.indexOf(a.tipus) - ordre.indexOf(b.tipus) || a.ordre - b.ordre
        );
    }
    const perId = id => window.DUDENEY.find(p => p.id === id) || null;
    return { llista, perId };
})();
