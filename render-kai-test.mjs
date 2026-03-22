import pkg from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pkg;
import { createCanvas } from 'canvas';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const pdfPath = "C:\\Users\\marcusash\\OneDrive\\.OneDrive Share\\Scan from 2026-03-21 05_53_49 PM.pdf";
const outDir = "C:\\Github\\kai-algebra2-tests\\import\\ocr-output";
mkdirSync(outDir, { recursive: true });

const data = new Uint8Array(readFileSync(pdfPath));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
console.log('Pages:', doc.numPages);

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale: 2.5 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({
    canvasContext: ctx, viewport,
    canvasFactory: {
      create(w,h){ const c=createCanvas(w,h); return {canvas:c,context:c.getContext('2d')}; },
      reset(ca,w,h){ ca.canvas.width=w; ca.canvas.height=h; },
      destroy(){}
    }
  }).promise;
  const out = `${outDir}\\kai-poly-division-page-${i}.png`;
  writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('Wrote:', out);
}
