/**
 * PROJECTE: dudeney · FITXER: tests/motors.test.js
 * ROL: Torna a calcular el que diu Dudeney a tots els enigmes publicats
 *      (ús: node tests/motors.test.js).
 */
'use strict';
const { suite, ok, eq, finish } = require('./harness.js');
const R = '../js/';
const Cerca = require(R + 'comu/cerca.js');
const Fx = require(R + 'fitxes/motor.js');
const Me = require(R + 'mesures/motor.js');
const Es = require(R + 'escacs/motor.js');
const Ca = require(R + 'camins/motor.js');
const Q = require(R + 'quadrats/motor.js');
const F = require(R + 'comu/fraccio.js');
const Ar = require(R + 'aritmetica/motor.js');
const Di = require(R + 'disseccio/motor.js');
const dades = {};
['disseccio', 'fitxes', 'mesures', 'escacs', 'camins', 'quadrats', 'aritmetica'].forEach(t =>
    require(R + t + '/problemes.js').forEach(p => (dades[p.id] = p))
);

suite('Dades');
eq('35 enigmes', Object.keys(dades).length, 35);
Object.values(dades).forEach(p =>
    ok(`${p.id}: camps complets`, p.titol && p.enunciat.length && p.pistes.length === 4 && p.solucioDudeney.length && p.notaMatematic.length)
);

suite('Fitxes');
const bfs = (ini, veins, clau, obj) => Cerca.bfs({ inicial: ini, veins, clau, esObjectiu: obj }).distancia;
eq('8 formatges, 4 tamborets: 33', bfs(Fx.piles.inicial(8, 4, 0), Fx.piles.veins, Fx.piles.clau, e => Fx.piles.resolt(e, 3)), 33);
eq('Frame–Stewart 10 i 21', [Fx.frameStewart(10, 4), Fx.frameStewart(21, 4)].join(), '49,321');
for (let n = 2; n <= 8; n++) {
    const ini = [0], obj = [0];
    for (let i = 1; i <= n; i++) { ini.push(i); obj.push(n + 1 - i); }
    eq(`${n} granotes: fórmula de Dudeney`, bfs(ini, Fx.salts.veins, Fx.salts.clau, e => Fx.salts.resolt(e, obj)), Fx.granotesDudeney(n));
}
// AM 216: granotes blanques i negres sobre gots, salts per sobre de fins a dues
const gg = dades['granotes-gots'].dades;
const colorG = e => e.map(k => (k ? gg.colors[k][0] : '_')).join('');
eq('granotes ensinistrades: 10 salts', bfs(gg.inicial, x => Fx.salts.veins(x, 2), colorG, x => colorG(x) === gg.objectiu), 10);
eq('salts d’una sola granota: 15', bfs(gg.inicial, x => Fx.salts.veins(x, 1), colorG, x => colorG(x) === gg.objectiu), 15);
let eg = gg.inicial.slice(), saltsOk = true;
gg.solucio.forEach(([a, b2]) => { if (Fx.salts.desti(eg, a - 1, 2) !== b2 - 1) saltsOk = false; eg = Fx.salts.mou(eg, a - 1, 2); });
ok('els deu salts de Dudeney són vàlids i acaben bé', saltsOk && colorG(eg) === gg.objectiu && eg.join() === gg.final.join());
eg = gg.inicial.slice();
[[4, 1], [5, 4], [3, 5], [6, 3]].forEach(([a, b2]) => { if (Fx.salts.desti(eg, a - 1, 2) !== b2 - 1) saltsOk = false; eg = Fx.salts.mou(eg, a - 1, 2); });
ok('els quatre salts d’exemple són vàlids', saltsOk);
// AM 217: Twickenham (fitxes en cercle, cada color en un sentit)
const tw = dades.twickenham.dades;
const sentitTw = {};
tw.inicial.forEach(x => x && (sentitTw[x] = tw.negres.includes(x) ? 1 : -1));
const objTw = [''].concat(tw.paraula.split('')).join(',');
const dTw = Cerca.distancies({ inicial: tw.inicial, veins: Fx.cercle.veins(sentitTw), clau: Fx.cercle.clau });
eq('Twickenham: 26 moviments', dTw.get(objTw), 26);
const solucionsMinimes = (ini, veins, clau, dist, obj, n) => {
    let w = new Map([[clau(ini), { e: ini, w: 1 }]]);
    for (let k = 0; k < n; k++) {
        const nou = new Map();
        for (const { e: x, w: c } of w.values())
            for (const v of veins(x)) {
                const kv = clau(v.estat);
                if (dist.get(kv) !== k + 1) continue;
                if (!nou.has(kv)) nou.set(kv, { e: v.estat, w: 0 });
                nou.get(kv).w += c;
            }
        w = nou;
    }
    return w.has(obj) ? w.get(obj).w : 0;
};
eq('i només hi ha una solució de 26', solucionsMinimes(tw.inicial, Fx.cercle.veins(sentitTw), Fx.cercle.clau, dTw, objTw, 26), 1);
{
    let e2 = tw.inicial, ok2 = true, s2 = 0;
    for (const x of tw.solucio) {
        const i = e2.indexOf(x);
        if (Fx.cercle.desti(e2, i, sentitTw) < 0) ok2 = false;
        if (Fx.cercle.esSalt(e2, i, sentitTw)) s2++;
        e2 = Fx.cercle.mou(e2, i, sentitTw);
    }
    ok('la de Dudeney és vàlida: 19 salts i 7 passos', ok2 && e2.join(',') === objTw && s2 === 19);
}
// AM 219: les lletres a la capsa
const ll = dades.lletres.dades;
const llIni = ll.inicial.split('').map(x => (x === '_' ? '' : x)), llObj = ll.objectiu.split('').map(x => (x === '_' ? '' : x)).join(',');
const dLl = Cerca.distancies({ inicial: llIni, veins: Fx.blocs.veins(3), clau: Fx.blocs.clau });
ok('lletres: 23 moviments, 181 440 posicions', dLl.get(llObj) === 23 && dLl.size === 181440);
eq('i només hi ha una solució de 23', solucionsMinimes(llIni, Fx.blocs.veins(3), Fx.blocs.clau, dLl, llObj, 23), 1);
{
    let e2 = llIni, ok2 = true;
    for (const x of ll.solucio) {
        const i = e2.indexOf(x);
        if (Fx.blocs.desti(e2, i, 3) < 0) ok2 = false;
        e2 = Fx.blocs.mou(e2, i, 3);
    }
    ok('la de Dudeney és vàlida', ok2 && e2.join(',') === llObj);
}
// AM 341: les quatre granotes (Guarini)
const qg = dades['quatre-granotes'].dades;
const arQ = qg.arestes.map(([a2, b2]) => [a2 - 1, b2 - 1]);
const estQ = m => Object.keys(qg.posicions).map(k => m[k] || '');
const objQ = estQ(qg.objectiu).join(',');
eq('quatre granotes: 16 moviments', bfs(estQ(qg.inicial), Fx.xarxa.veins(arQ), Fx.xarxa.clau, x => x.join(',') === objQ), 16);
eq('i 7 jugades', bfs(estQ(qg.inicial), Fx.xarxa.veinsJugada(arQ), Fx.xarxa.clau, x => x.join(',') === objQ), 7);
{
    let e2 = estQ(qg.inicial), ok2 = true;
    const movs = qg.solucio.flat().map(([a2, b2]) => [a2 - 1, b2 - 1]);
    movs.forEach(([a2, b2]) => {
        if (Fx.xarxa.motiu(e2, arQ, a2, b2)) ok2 = false;
        e2 = Fx.xarxa.mou(e2, a2, b2);
    });
    ok('la de Dudeney: 7 jugades i 16 moviments', ok2 && e2.join(',') === objQ && Fx.xarxa.jugades(movs) === 7 && movs.length === 16);
    const ordre = qg.cercle;
    ok('les línies formen un sol cercle', ordre.every((x, i) => Fx.xarxa.uneix(qg.arestes, x, ordre[(i + 1) % ordre.length])) && qg.arestes.length === ordre.length);
}
// AM 221: les vuit locomotores (només es poden moure cap al punt buit)
{
    const lo = dades.locomotores.dades;
    const arL = lo.arestes.map(([a2, b2]) => [a2 - 1, b2 - 1]);
    const iniL = Object.keys(lo.posicions).map(k => lo.inicial[k] || '');
    const ordenat = e => {
        if (e[lo.ordre.buit - 1]) return false;
        const v = lo.ordre.vora.map(k => e[k - 1]);
        const i = v.indexOf(1);
        return [1, -1].some(sg => v.every((_, k) => v[(i + sg * k + 64) % 8] === k + 1));
    };
    const veinsFix = fix => e => Fx.xarxa.veins(arL)(e).filter(v => e[v.mov[0]] !== fix);
    eq('locomotores: 17 moviments amb la 5 quieta', bfs(iniL, veinsFix(5), Fx.xarxa.clau, ordenat), 17);
    eq('i 17 també sense cap quieta', bfs(iniL, veinsFix(0), Fx.xarxa.clau, ordenat), 17);
    const dL = Cerca.distancies({ inicial: iniL, veins: veinsFix(0), clau: Fx.xarxa.clau });
    // totes les solucions de 17: quantes són, i quines locomotores no es mouen
    let camins17 = [{ e: iniL, m: new Set() }];
    for (let k = 0; k < 17; k++)
        camins17 = camins17.flatMap(c => veinsFix(0)(c.e).filter(v => dL.get(Fx.xarxa.clau(v.estat)) === k + 1).map(v => ({ e: v.estat, m: new Set(c.m).add(c.e[v.mov[0]]) })));
    const fi17 = camins17.filter(c => ordenat(c.e));
    ok('3 solucions de 17, i en totes la 5 no es mou', fi17.length === 3 && fi17.every(c => [1, 2, 3, 4, 6, 7, 8].every(x => c.m.has(x)) && !c.m.has(5)));
    ok('amb la 2, la 3 o la 8 quietes en calen 19, 23 i 25; amb la 1, la 4, la 6 o la 7, és impossible',
        [2, 3, 8].map(x => bfs(iniL, veinsFix(x), Fx.xarxa.clau, ordenat)).join() === '19,23,25' &&
        [1, 4, 6, 7].every(x => bfs(iniL, veinsFix(x), Fx.xarxa.clau, ordenat) === null));
    let eL = iniL, okL = true;
    lo.solucio.forEach(x => {
        const de = eL.indexOf(x), a2 = eL.indexOf('');
        if (Fx.xarxa.motiu(eL, arL, de, a2) || x === 5) okL = false;
        eL = Fx.xarxa.mou(eL, de, a2);
    });
    ok('la de Dudeney és vàlida i acaba en ordre', okL && ordenat(eL) && lo.solucio.length === 17 && Object.keys(lo.final).every(k => lo.final[k] === eL[k - 1]));
}

suite('Mesures');
const g = dades.gerres.dades;
eq('gerres: 11 abocades', bfs(g.inicial, Me.gerres.veins(g.capacitats), Me.gerres.clau, e => Me.gerres.resolt(e, g.objectiu)), 11);
let e = g.inicial;
g.solucio.forEach(([i, j]) => (e = Me.gerres.vessa(e, g.capacitats, i, j)));
ok('la taula de Dudeney arriba a 3 i 3', Me.gerres.resolt(e, g.objectiu));
const b = dades.rierol.dades;
eq('rierol: 11 travessies', bfs(Me.barca.inicial(b.passatgers), Me.barca.veins(b), Me.barca.clau, Me.barca.resolt), 11);
let eb = Me.barca.inicial(b.passatgers), valida = true;
b.solucio.forEach(gr => { if (Me.barca.motiu(eb, b, gr)) valida = false; eb = Me.barca.travessa(eb, gr); });
ok('la solució de Dudeney és vàlida', valida && Me.barca.resolt(eb));
// AM 362: el bol de la festa (els rodamons, capacitat Infinity, només reben)
const bl = dades.bol.dades;
eq('bol: 11 manipulacions', bfs(bl.inicial, Me.gerres.veins(bl.capacitats), Me.gerres.clau, x => Me.gerres.resolt(x, bl.objectiu)), 11);
let ebl = bl.inicial, blOk = true;
bl.solucio.forEach(([i, j]) => { if (Me.gerres.motiu(ebl, bl.capacitats, i, j)) blOk = false; ebl = Me.gerres.vessa(ebl, bl.capacitats, i, j); });
ok('la taula de Dudeney: 4 pintes per a cadascú', blOk && Me.gerres.resolt(ebl, bl.objectiu) && bl.solucio.length === 11);
eq('un rodamón no torna res', Me.gerres.motiu([0, 0, 0, 4, 0, 0], bl.capacitats, 3, 1), 'persona');
// AM 375: cinc entrenadors (cinc parelles), barca de tres places
const en = dades.entrenadors.dades;
eq('entrenadors: 11 travessies', bfs(Me.barca.inicial(en.passatgers), Me.barca.veins(en), Me.barca.clau, Me.barca.resolt), 11);
const senseRegla = Object.assign({}, en, { passatgers: en.passatgers.map(q => ({ id: q.id, rema: true })) });
eq('sense la regla, 9', bfs(Me.barca.inicial(en.passatgers), Me.barca.veins(senseRegla), Me.barca.clau, Me.barca.resolt), 9);
{
    let e2 = Me.barca.inicial(en.passatgers), ok2 = true;
    en.solucio.forEach(gr => {
        if (Me.barca.motiu(e2, en, gr)) ok2 = false;
        e2 = Me.barca.travessa(e2, gr);
    });
    ok('la taula de Dudeney és vàlida', ok2 && Me.barca.resolt(e2));
}
const parelles = (n, places) => {
    const ps = [];
    for (let i = 0; i < n; i++) ps.push({ rema: true, cap: true });
    for (let i = 0; i < n; i++) ps.push({ rema: true, parella: i });
    const pr = { passatgers: ps, places };
    return bfs(Me.barca.inicial(ps), Me.barca.veins(pr), Me.barca.clau, Me.barca.resolt);
};
ok('3 parelles amb 2 places: sí; 4: no; 6 amb 3 places: no', parelles(3, 2) === 11 && parelles(4, 2) === null && parelles(6, 3) === null);
// AM 377: el tresor del castell
const tr = dades.tresor.dades;
const dTr = Cerca.distancies({ inicial: Me.politja.inicial(tr), veins: Me.politja.veins(tr), clau: Me.politja.clau });
eq('tresor: 11 manipulacions', dTr.get('1111'), 11);
eq('de 8 maneres', solucionsMinimes(Me.politja.inicial(tr), Me.politja.veins(tr), Me.politja.clau, dTr, '1111', 11), 8);
{
    let e2 = Me.politja.inicial(tr), ok2 = true;
    tr.solucio.forEach(([dalt, baix]) => {
        if (Me.politja.motiu(e2, tr, dalt, baix)) ok2 = false;
        e2 = Me.politja.baixa(e2, dalt, baix);
    });
    ok('la solució de Dudeney és vàlida', ok2 && Me.politja.resolt(e2));
}

suite('Escacs');
const sol = Es.solucionsReines(8);
eq('92 solucions de les vuit reines', sol.length, 92);
eq('12 fonamentals', Es.fonamentals(sol, 8).length, 12);
const sense = sol.filter(s => !Es.tresEnLinia(Es.aCaselles(s)).length);
eq('una sola classe sense tres en línia', Es.fonamentals(sense, 8).length, 1);
eq('la de Dudeney no té trios', Es.tresEnLinia(Es.aCaselles(dades.reines.dades.solucio)).length, 0);
const cv = dades.cavalls.dades;
eq('cavalls: 7 per color', [Es.cobertesMinimes(8, 0, 8).mida, Es.cobertesMinimes(8, 1, 8).mida].join(), '7,7');
const est = Es.estatCavalls(cv.solucio, 8);
// AM 297 i 298: alfils (els dos colors són simètrics: n'hi ha prou de calcular-ne un)
const al = dades.alfils.dades, ap = dades['alfils-protegits'].dades;
const mA = Es.minimAlfils(8, 0, false, 4);
ok('alfils: 4 per color, de 108 maneres', mA.mida === 4 && mA.solucions === 108);
const eA = Es.estatPeces(al.solucio, 8, 'alfil');
ok('la fila de Dudeney cobreix tot, sense protecció', al.solucio.length === al.minim && !eA.lliures.length && eA.sensePro.length === 8);
const mP = Es.minimAlfils(8, 1, true, 5);
ok('alfils protegits: 5 per color, de 104 maneres', mP.mida === 5 && mP.solucions === 104);
const eP = Es.estatPeces(ap.solucio, 8, 'alfil');
ok('els deu alfils de Dudeney: tot cobert i tots protegits', ap.solucio.length === ap.minim && !eP.lliures.length && !eP.sensePro.length);
const variant = ap.solucio.map(q => (q[0] === 3 && q[1] === 2 ? [2, 2] : q[0] === 4 && q[1] === 2 ? [5, 2] : q));
const eV = Es.estatPeces(variant, 8, 'alfil');
ok('i la variant (els dos centrals moguts)', !eV.lliures.length && !eV.sensePro.length);
// AM 317: setze peons sense tres en línia, amb d4 i e5
const pe = dades.peons.dades;
ok('els peons de Dudeney: 16, sense trios, amb d4 i e5', pe.solucio.length === 16 && !Es.tresEnLinia(pe.solucio).length &&
    pe.fixes.every(f => pe.solucio.some(q => q[0] === f[0] && q[1] === f[1])));
{
    const pts = [], col = new Array(8).fill(0), sols = [];
    const lliure = p => { for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const a = pts[i], b2 = pts[j]; if ((b2[0] - a[0]) * (p[1] - a[1]) - (b2[1] - a[1]) * (p[0] - a[0]) === 0) return false; } return true; };
    (function fila(f) {
        if (f === 8) return sols.push(pts.map(q => q.slice()));
        for (let a = 0; a < 8; a++) for (let b2 = a + 1; b2 < 8; b2++) {
            if (col[a] >= 2 || col[b2] >= 2 || !lliure([f, a])) continue;
            pts.push([f, a]);
            if (lliure([f, b2])) { pts.push([f, b2]); col[a]++; col[b2]++; fila(f + 1); col[a]--; col[b2]--; pts.pop(); }
            pts.pop();
        }
    })(0);
    eq('16 peons sense trios: 380 maneres, 57 de fonamentals', `${sols.length},${new Set(sols.map(x => Es.canonica(x, 8))).size}`, '380,57');
    const amb = sols.filter(x => pe.fixes.every(f => x.some(q => q[0] === f[0] && q[1] === f[1])));
    eq('amb d4 i e5, només 2 (una de sola, girada)', amb.length, 2);
}
ok('la solució de 14 cobreix i protegeix', cv.solucio.length === 14 && !est.lliures.length && !est.sensePro.length);
const ex = Es.estatCavalls(cv.exemple, 8);
ok('la figura de 12: cobreix i només 4 protegits', !ex.lliures.length && cv.exemple.length - ex.sensePro.length === 4);

suite('Camins');
const m = dades.metro.dades;
eq('metro: 19 milles', Ca.carterMinim(m.graf).longitud, 19);
const rc = Ca.recompte(m.graf, m.solucio);
ok('la ruta de Dudeney fa 19 i cobreix tot', rc.longitud === 19 && !rc.falten.length && Ca.pasDolent(m.graf, m.solucio) === null);
const mi = dades.mina.dades;
const cm = Ca.carterDes(mi.graf, 'A');
ok('mina: 36 furlongs des de la A (5 repetides)', cm.longitud === 36 && cm.repetides === 5 && mi.minim === 36);
eq('i 35 amb la sortida lliure', Math.min(...mi.graf.vertexs.map(v => Ca.carterDes(mi.graf, v).longitud)), 35);
const rm = Ca.recompte(mi.graf, mi.solucio);
ok('la ruta de Dudeney surt de la A, ho cobreix tot i fa 36', mi.solucio[0] === 'A' && rm.longitud === 36 && !rm.falten.length && Ca.pasDolent(mi.graf, mi.solucio) === null);
eq('el carter per aparellament també dona 19 al metro', Math.min(...m.graf.vertexs.map(v => Ca.carterDes(m.graf, v).longitud)), 19);
const c = dades.ciutats.dades;
eq('ciutats: un sol cicle de Hamilton', Ca.cicles(c.graf, 1).length, 1);
eq('i és el de Dudeney', Ca.motiuHamilton(c.graf, c.solucio, 1), null);
// AM 249: el mariner
const ma = dades.mariner.dades;
const rutesMa = Ca.cicles(ma.graf, 'A');
eq('mariner: 4 rutes', rutesMa.length, 4);
// cada ruta surt en un sentit qualsevol: si la C és la k-a, al revés és la (22 − k)-a
eq('la C, als llocs 12, 13, 16 i 17 (o 10, 9, 6 i 5, al revés)', rutesMa.map(r => Math.max(r.indexOf('C') + 1, 22 - r.indexOf('C') - 1)).sort((x, y) => x - y).join(), '12,13,16,17');
ok('la de Dudeney és la de la C al lloc 17', Ca.motiuHamilton(ma.graf, ma.solucio, 'A') === null && ma.solucio.indexOf('C') + 1 === 17 && ma.llocTard === 17);
{
    const usades = new Set();
    rutesMa.forEach(r => r.slice(1).forEach((v, i) => usades.add(Ca.claAresta(r[i], v))));
    eq('les 4 rutes fan servir les 28 línies del mapa', usades.size === ma.graf.arestes.length && ma.graf.arestes.length === 28, true);
}
// AM 320: la volta de la torre
const to = dades.torre.dades;
const alg = t => [8 - +t[1], 'abcdefgh'.indexOf(t[0])];
eq('torre: cap volta de 10, 12 o 14 jugades', [10, 12, 14].map(k => Ca.voltesTorre(8, alg(to.inici), k)).join(), '0,0,0');
[to.solucio, to.altra].forEach((r, k) => {
    const vist = [];
    for (let f = 0; f < 8; f++) vist.push(new Array(8).fill(false));
    vist[3][3] = true;
    let ok2 = r.length === 17;
    for (let i = 1; i < r.length; i++) {
        if (Ca.motiuTorre(vist, alg(r[i - 1]), alg(r[i]), alg(to.inici))) ok2 = false;
        else Ca.passosTorre(alg(r[i - 1]), alg(r[i])).forEach(q => (vist[q[0]][q[1]] = true));
    }
    ok(`la ${k ? 'segona' : 'primera'} figura de Dudeney: 16 jugades, totes les caselles`, ok2 && vist.every(f => f.every(x => x)));
});
// AM 245: la mosca a l'octàedre (circuits d'Euler des de la A)
{
    const oc = dades.octaedre.dades;
    let n2 = 0;
    const usat = new Array(oc.graf.arestes.length).fill(false);
    let acabenA = true;
    (function cerca(v, k) {
        if (k === usat.length) {
            n2++;
            if (v !== 'A') acabenA = false;
            return;
        }
        oc.graf.arestes.forEach((ar, i) => {
            if (usat[i] || (ar[0] !== v && ar[1] !== v)) return;
            usat[i] = true;
            cerca(ar[0] === v ? ar[1] : ar[0], k + 1);
            usat[i] = false;
        });
    })('A', 0);
    ok('octàedre: 1488 rutes, i totes acaben a la A', n2 === 1488 && acabenA && dades.octaedre.extra.resposta === 1488);
    ok('cada vèrtex té 4 arestes', oc.graf.vertexs.every(v => Ca.index(oc.graf).veins[v].length === 4));
    const ro = Ca.recompte(oc.graf, oc.solucio);
    ok('la ruta d’exemple passa per les 12 arestes una sola vegada', ro.longitud === 12 && !ro.falten.length && Object.values(ro.vegades).every(x => x === 1) && oc.solucio[0] === 'A');
}

suite('Quadrats');
ok('el vuit rebel de Dudeney', Q.comprovaMagic(dades.vuit.dades.solucio.map(F.llegeix), F.fr(15)).resolt);
ok('amb el 0 també (discrepància)', Q.comprovaMagic(['6', '8', '1', '0', '5', '10', '9', '2', '4'].map(F.llegeix), F.fr(15)).resolt);
let positius = 0;
for (let a = 1; a <= 9; a++) {
    const r = Q.comprovaMagic(Q.familiaVuit(F.fr(a)), F.fr(15));
    if (r.resolt && !Q.familiaVuit(F.fr(a)).some(v => v[0] <= 0)) positius++;
}
eq('cap solució amb enters positius', positius, 0);
eq('Bachet: 1152 maneres', Q.compteBachet().total, 1152);
eq('el diagrama 3 no té conflictes', Q.conflictesBachet(dades.bachet.dades.solucio).length, 0);
// AM 406: les divuit fitxes de dòmino
const dm = dades.domino.dades;
eq('dòminos: la solució de Dudeney suma 18 a totes les línies', Q.comprovaDomino(dm.solucio, 6, 18), null);
eq('i l’exemple de l’enunciat, 13', Q.comprovaDomino(dm.exemple, 6, 13), null);
{
    const sumesF = Q.FITXES_DOMINO.map(([a2, b2]) => a2 + b2).sort((x, y) => x - y);
    const min18 = sumesF.slice(0, 18).reduce((x, y) => x + y, 0);
    ok('13 és el mínim possible (les 18 fitxes més petites fan 76; 78 = 6 × 13)', min18 === 76 && Math.ceil(min18 / 6) === 13);
    const compl = dm.exemple.map(f => f.map(x => 6 - x));
    eq('i el complement a 6 dona un quadrat de 23', Q.comprovaDomino(compl, 6, 23), null);
}

suite('Aritmètica');
eq('etiquetes de 4 xifres', Ar.etiquetes(2).join(), '0000,0001,2025,3025,9801');
const a = dades.aranya.dades;
const camins = Ar.totsElsCamins(a.sala, a.aranya, a.mosca).filter(x => x.valid);
eq('aranya: 40 peus el mínim', Math.min(...camins.map(x => x.longitud)), 40);
eq('els quatre de Dudeney', a.camins.map(s => Ar.cami(a.sala, s, a.aranya, a.mosca).longitud.toFixed(3)).join(), '42.000,43.174,40.719,40.000');
// AM 347: comptant els rectangles
ok('rectangles: 1296, dels quals 204 quadrats', Ar.rectangles(8).total === 1296 && Ar.rectangles(8).quadrats === 204);
ok('les fórmules de Dudeney, d’1 × 1 a 12 × 12', Array.from({ length: 12 }, (_, k) => k + 1).every(n2 => {
    const r2 = Ar.rectangles(n2), f2 = Ar.formulesRectangles(n2);
    return r2.total === f2.total && r2.quadrats === f2.quadrats && r2.total - r2.quadrats === f2.noQuadrats;
}));
ok('i el total és 1³ + … + 8³ = 36²', [1, 2, 3, 4, 5, 6, 7, 8].reduce((x, k) => x + k ** 3, 0) === 1296 && 36 ** 2 === 1296);
// CP 38: l'amulet
{
    const am = dades.amulet.dades;
    const files = Ar.maneresAmulet(am.paraula.length);
    eq('amulet: 1024 maneres', files[files.length - 1].reduce((x, y) => x + y, 0), 1024);
    eq('la fila de baix és el triangle de Pascal', files[10].join(' '), '1 10 45 120 210 252 210 120 45 10 1');
}

suite('Dissecció');
const d = dades.mercer.dades;
const peces = d.peces.map(q => q.vertexs.map(v => d.punts[v]));
const cen = peces.map(Di.centre);
const cob = Di.cobertura(peces.map((q, i) => Di.aplica(q, d.solucio[i], cen[i])), d.quadrat, 200);
ok('mercer: les 4 peces cobreixen el quadrat', cob.forats < 0.002 && cob.doble < 0.002 && cob.fora < 0.002);
ok('i el costat és √(àrea)', Math.abs(Math.hypot(d.quadrat[1][0] - d.quadrat[0][0], d.quadrat[1][1] - d.quadrat[0][1]) - Math.sqrt((Math.sqrt(3) / 4) * 36)) < 1e-5);
const br = dades.brocat.dades;
const cel = br.peces.map(pc => {
    const o = [];
    pc.rects.forEach(([f, c2, h, w]) => { for (let i = 0; i < h; i++) for (let j = 0; j < w; j++) o.push([f + i, c2 + j]); });
    return { celles: o };
});
const rb = Di.comprovaQuadricula(cel, br.solucio.map(t => ({ f: t[0], c: t[1] })), 10, [0, 0]);
ok('brocat: omple el 10 × 10 amb el dibuix casat', rb.complet && rb.patro);
// AM 146: una dissecció fàcil (quatre peces iguals amb els dotze triangles)
{
    const tz = dades.trapezi.dades;
    eq('trapezi: la solució de Dudeney fa quatre peces iguals', Di.particio(tz.triangles, tz.solucio, 4), null);
    let solucions = 0;
    const g = new Array(12).fill(-1);
    (function reparteix(i) {
        if (i === 12) {
            if (!Di.particio(tz.triangles, g, 4)) solucions++;
            return;
        }
        // els grups s'obren per ordre (el primer triangle sempre al grup 0…) per no comptar el mateix repartiment amb colors canviats
        const max = Math.max(-1, ...g.slice(0, i)) + 1;
        for (let k = 0; k <= Math.min(3, max); k++) {
            if (g.slice(0, i).filter(x => x === k).length === 3) continue;
            g[i] = k;
            reparteix(i + 1);
        }
        g[i] = -1;
    })(0);
    eq('i és l’única', solucions, 1);
    const mitja = Di.formaCanonica([tz.contorn.map(q => [q[0] / 2, q[1] / 2])]);
    const pecesD = [[[0, 2], [1, 1], [1, 0], [0, 0]], [[0, 2], [2, 2], [2, 1], [1, 1]], [[1, 1], [3, 1], [2, 0], [1, 0]], [[2, 2], [4, 2], [3, 1], [2, 1]]];
    ok('cada peça és la figura sencera a mitja mida', pecesD.every(pg => Di.formaCanonica([pg]) === mitja));
}
// AM 147 i 151: peces en xarxa
['cinc-triangles', 'fuster'].forEach(id => {
    const dp = dades[id].dades;
    const bases = dp.peces.map(pc => pc.pts);
    const areaPeces = bases.reduce((x, pc) => x + Di.area(pc), 0);
    ok(`${id}: les peces omplen el quadrat (àrea 5)`, Di.omple(bases, dp.solucio, dp.objectiu) && Math.abs(areaPeces - 5) < 1e-9 && Math.abs(Di.area(dp.objectiu) - 5) < 1e-9);
    ok(`${id}: a la posició inicial, no`, !Di.omple(bases, dp.peces.map(() => ({ r: 0, x: 0, y: 0 })), dp.objectiu));
    ok(`${id}: les peces de paper fan la mateixa àrea`, Math.abs(dp.paper.reduce((x, pg) => x + Di.area(pg), 0) - 5) < 1e-9);
});
finish('Motors');
