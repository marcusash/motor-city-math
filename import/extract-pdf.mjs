// Agent I — PDF text extraction utility
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function extractText(filePath) {
  const data = new Uint8Array(readFileSync(filePath));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  
  const result = {
    file: filePath,
    pageCount: doc.numPages,
    pages: []
  };

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    const text = strings.join(' ');
    result.pages.push({ page: i, text, itemCount: content.items.length });
  }

  return result;
}

const files = [
  { path: resolve('Winter Tri Standards Worksheets/Copy of (Winter 11) Unit 2 Review.pdf'), label: 'Unit 2 Review Worksheet' },
  { path: resolve('2026011_Kai_exponents_Unit1.pdf'), label: 'Scanned Exponents Exam' }
];

for (const f of files) {
  console.log(`\n=== ${f.label} ===`);
  try {
    const result = await extractText(f.path);
    console.log(`Pages: ${result.pageCount}`);
    for (const p of result.pages) {
      console.log(`\n--- Page ${p.page} (${p.itemCount} text items) ---`);
      console.log(p.text.substring(0, 2000));
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
}
