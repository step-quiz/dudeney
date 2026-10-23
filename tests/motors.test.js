/**
 * PROJECTE: dudeney · FITXER: tests/motors.test.js
 * ROL: Torna a calcular el que diu Dudeney als 14 enigmes de la mostra
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
eq('14 enigmes', Object.keys(dades).length, 14);
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
ok('la solució de 14 cobreix i protegeix', cv.solucio.length === 14 && !est.lliures.length && !est.sensePro.length);
const ex = Es.estatCavalls(cv.exemple, 8);
ok('la figura de 12: cobreix i només 4 protegits', !ex.lliures.length && cv.exemple.length - ex.sensePro.length === 4);

suite('Camins');
const m = dades.metro.dades;
eq('metro: 19 milles', Ca.carterMinim(m.graf).longitud, 19);
const rc = Ca.recompte(m.graf, m.solucio);
ok('la ruta de Dudeney fa 19 i cobreix tot', rc.longitud === 19 && !rc.falten.length && Ca.pasDolent(m.graf, m.solucio) === null);
const c = dades.ciutats.dades;
eq('ciutats: un sol cicle de Hamilton', Ca.cicles(c.graf, 1).length, 1);
eq('i és el de Dudeney', Ca.motiuHamilton(c.graf, c.solucio, 1), null);

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

suite('Aritmètica');
eq('etiquetes de 4 xifres', Ar.etiquetes(2).join(), '0000,0001,2025,3025,9801');
const a = dades.aranya.dades;
const camins = Ar.totsElsCamins(a.sala, a.aranya, a.mosca).filter(x => x.valid);
eq('aranya: 40 peus el mínim', Math.min(...camins.map(x => x.longitud)), 40);
eq('els quatre de Dudeney', a.camins.map(s => Ar.cami(a.sala, s, a.aranya, a.mosca).longitud.toFixed(3)).join(), '42.000,43.174,40.719,40.000');

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
finish('Motors');
