// Render PDF pages to PNG using pdfjs-dist
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

(async () => {
    const pdfPath = process.argv[2] || 'artifacts/actual-workflow-test/03-actual-print-output.pdf';
    const outDir = process.argv[3] || path.dirname(pdfPath);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data, disableFontFace: true });
    const pdf = await loadingTask.promise;
    console.log(`PDF has ${pdf.numPages} pages`);
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport, canvasFactory: {
            create(w, h) { const c = createCanvas(w, h); return { canvas: c, context: c.getContext('2d') }; },
            reset(cc, w, h) { cc.canvas.width = w; cc.canvas.height = h; },
            destroy(cc) { cc.canvas.width = 0; cc.canvas.height = 0; },
        }}).promise;
        const outPath = path.join(outDir, `pdf-page-${String(i).padStart(2,'0')}.png`);
        fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
        console.log('  wrote', outPath);
    }
})().catch(e => { console.error(e); process.exit(1); });
