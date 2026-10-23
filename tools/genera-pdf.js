/**
 * ============================================================================
 * PROJECTE: dudeney (Step Quiz, vanilla JS)
 * FITXER: tools/genera-pdf.js
 * ROL: Fa els PDF per imprimir a partir de imprimir/enigmes.html i
 *      imprimir/solucions.html, amb Chromium (Playwright).
 * ÚS:  node tools/genera-pdf.js            → els dos PDF a imprimir/
 *      node tools/genera-pdf.js enigmes    → només un
 *      Falla si la pàgina té errors de JavaScript o si un full d'enigma no hi cap.
 * DEPENDÈNCIES: Playwright (npm) amb Chromium.
 * ============================================================================
 */
const path = require('path');
function carregaPlaywright() {
    try {
        return require('playwright');
    } catch {
        return require('/opt/node22/lib/node_modules/playwright');
    }
}
async function main() {
    const arrel = path.resolve(__dirname, '..');
    const quins = process.argv[2] ? [process.argv[2]] : ['enigmes', 'solucions'];
    const { chromium } = carregaPlaywright();
    const navegador = await chromium.launch();
    for (const nom of quins) {
        const pagina = await navegador.newPage();
        const errors = [];
        pagina.on('pageerror', e => errors.push(e.message));
        // les solucions només es dibuixen amb ?sol=1
        await pagina.goto('file://' + path.join(arrel, 'imprimir', nom + '.html') + (nom === 'solucions' ? '?sol=1' : ''), {
            waitUntil: 'load',
        });
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.emulateMedia({ media: 'print' });
        if (errors.length) throw new Error(errors.join('\n'));
        const desborden = await pagina.$$eval('.full', fulls =>
            fulls.filter(f => f.scrollHeight > f.clientHeight + 1).map(f => f.dataset.id || 'portada')
        );
        if (desborden.length) throw new Error(`Fulls que no hi caben (${nom}): ${desborden.join(', ')}`);
        const sortida = path.join(arrel, 'imprimir', nom + '.pdf');
        await pagina.pdf({ path: sortida, preferCSSPageSize: true, printBackground: true });
        console.log('✓ ' + path.relative(arrel, sortida));
    }
    await navegador.close();
}
main().catch(e => {
    console.error(e.message);
    process.exit(1);
});
