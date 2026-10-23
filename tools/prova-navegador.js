/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: tools/prova-navegador.js
 * ROL: Prova de fum al navegador de totes les pàgines: la portada, cada enigma
 *      (amb i sense ?sol=1) i les dues fitxes per imprimir, a 360 px i a
 *      1366 px, en mode clar i fosc. Falla si hi ha errors de JavaScript, si
 *      la pàgina es desplaça en horitzontal, o si sense ?sol=1 es veu la
 *      solució d'algun enigma. Amb --captures desa imatges a tmp/captures/.
 * ÚS:  node tools/prova-navegador.js [--captures] [id …]
 *      (sense ids, tots els enigmes; amb ids, només aquests)
 * DEPENDÈNCIES: Playwright (npm) amb Chromium. Fa servir file://, sense servidor.
 * ============================================================================
 */
const path = require('path');
const fs = require('fs');
function carregaPlaywright() {
    try {
        return require('playwright');
    } catch {
        return require('/opt/node22/lib/node_modules/playwright');
    }
}
const arrel = path.resolve(__dirname, '..');
const url = (f, q = '') => 'file://' + path.join(arrel, f) + q;
const TIPUS = ['disseccio', 'fitxes', 'mesures', 'escacs', 'camins', 'quadrats', 'aritmetica'];

async function main() {
    const args = process.argv.slice(2);
    const captures = args.includes('--captures');
    const tots = TIPUS.flatMap(t => require(path.join(arrel, 'js', t, 'problemes.js')).map(p => p.id));
    const ids = args.filter(a => !a.startsWith('--'));
    const llista = ids.length ? ids : tots;
    const dirCap = path.join(arrel, 'tmp', 'captures');
    if (captures) fs.mkdirSync(dirCap, { recursive: true });
    const { chromium } = carregaPlaywright();
    const nav = await chromium.launch();
    const errors = [];
    for (const [w, esquema] of [[360, 'light'], [1366, 'light'], [360, 'dark'], [1366, 'dark']]) {
        const ctx = await nav.newContext({ viewport: { width: w, height: 900 }, colorScheme: esquema });
        const p = await ctx.newPage();
        p.on('pageerror', e => errors.push(`${p.url()} [${w} ${esquema}] ${e.message}`));
        const pagines = [['index', url('index.html')]];
        llista.forEach(id => {
            pagines.push([id, url('enigma.html', `?p=${id}`)]);
            pagines.push([id + '-sol', url('enigma.html', `?p=${id}&sol=1`)]);
        });
        if (!ids.length) pagines.push(['enigmes', url('imprimir/enigmes.html')], ['solucions', url('imprimir/solucions.html', '?sol=1')]);
        for (const [nom, adreca] of pagines) {
            await p.goto(adreca);
            await p.waitForTimeout(120);
            const sw = await p.evaluate(() => document.documentElement.scrollWidth);
            if (sw > w && !['enigmes', 'solucions'].includes(nom)) errors.push(`${nom} [${w} ${esquema}]: desplaçament horitzontal (${sw} px)`);
            if (adreca.includes('enigma.html') && !adreca.includes('sol=1')) {
                const visible = await p.evaluate(() => ['solucio', 'nota'].some(i => document.getElementById(i) && !document.getElementById(i).hidden));
                if (visible) errors.push(`${nom}: la solució es veu sense ?sol=1`);
            }
            if (captures && !['enigmes', 'solucions'].includes(nom))
                await p.screenshot({ path: path.join(dirCap, `${nom}-${w}-${esquema}.png`), fullPage: true });
        }
        await ctx.close();
    }
    await nav.close();
    if (errors.length) {
        console.error(errors.join('\n'));
        process.exit(1);
    }
    console.log(`✓ ${llista.length} enigmes, 4 vistes cadascun: sense errors${captures ? ' (captures a tmp/captures/)' : ''}`);
}
main().catch(e => {
    console.error(e.message);
    process.exit(1);
});
