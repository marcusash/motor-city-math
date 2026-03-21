import { createCanvas } from 'canvas';
import { readFileSync, writeFileSync } from 'fs';
import pkg from 'pdfjs-dist/legacy/build/pdf.js';
const { getDocument } = pkg;

const pdfPath = "C:\\Users\\marcusash\\OneDrive - Microsoft\\Documents\\Scan from 2026-03-20 09_30_21 PM.pdf";
const data = new Uint8Array(readFileSync(pdfPath));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
console.log('Pages:', doc.numPages);

for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  const out = `C:\\Github\\kai-algebra2-tests\\sienna-page-${i}.png`;
  writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('Wrote:', out);
}
