// Agent GI — OCR scanned exam PDF with confidence analysis
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import Tesseract from 'tesseract.js';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { analyzeConfidence, buildConfidenceSummary, shouldAbort } from './ocr-confidence.mjs';

const PDF_PATH = resolve('2026011_Kai_exponents_Unit1.pdf');
const OUT_DIR = resolve('import', 'ocr-output');
mkdirSync(OUT_DIR, { recursive: true });

async function renderPageToImage(doc, pageNum, scale = 2.0) {
  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');

  await page.render({
    canvasContext: ctx,
    viewport,
    canvasFactory: {
      create(w, h) {
        const c = createCanvas(w, h);
        return { canvas: c, context: c.getContext('2d') };
      },
      reset(canvasAndContext, w, h) {
        canvasAndContext.canvas.width = w;
        canvasAndContext.canvas.height = h;
      },
      destroy(canvasAndContext) {}
    }
  }).promise;

  return canvas.toBuffer('image/png');
}

async function ocrPage(imageBuffer, pageNum) {
  console.log(`  OCR page ${pageNum}...`);
  const result = await Tesseract.recognize(imageBuffer, 'eng', {
    logger: () => {} // suppress progress logs
  });
  return result.data; // return full data object (includes confidence + lines)
}

// Main
console.log('Loading PDF:', PDF_PATH);
const data = new Uint8Array(readFileSync(PDF_PATH));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
console.log(`Pages: ${doc.numPages}`);

const allText = [];
const confReports = [];
for (let i = 1; i <= doc.numPages; i++) {
  console.log(`\nProcessing page ${i}/${doc.numPages}...`);
  
  // Render to image
  const imgBuf = await renderPageToImage(doc, i);
  const imgPath = resolve(OUT_DIR, `page_${i}.png`);
  writeFileSync(imgPath, imgBuf);
  console.log(`  Rendered: ${imgPath} (${Math.round(imgBuf.length/1024)}KB)`);
  
  // OCR — returns full tesseract data object
  const tessData = await ocrPage(imgBuf, i);
  const text = tessData.text;
  allText.push({ page: i, text });

  // Confidence analysis
  const confReport = analyzeConfidence(tessData, i);
  confReports.push(confReport);
  console.log(`  Text length: ${text.length} chars`);
  console.log(`  Confidence: ${tessData.confidence}% avg | ${confReport.flagged_lines}/${confReport.total_lines} lines flagged (${confReport.flagged_pct}%)`);
  console.log(`  Preview: ${text.substring(0, 200).replace(/\n/g, ' | ')}`);
}

// Save combined output
const outputPath = resolve(OUT_DIR, 'scanned_exam_ocr.json');
writeFileSync(outputPath, JSON.stringify({ pages: allText }, null, 2));
console.log(`\nFull OCR saved to: ${outputPath}`);

// Save confidence report
const confSummary = buildConfidenceSummary(confReports);
const confPath = resolve(OUT_DIR, 'ocr-confidence-report.json');
writeFileSync(confPath, JSON.stringify(confSummary, null, 2));
console.log(`Confidence report: ${confPath}`);
console.log(`  Overall: ${confSummary.flagged_pct}% lines flagged | Abort: ${confSummary.abort}`);

// Abort if confidence too low
if (shouldAbort(confSummary)) {
  process.exit(1);
}

// Also save as plain text
const textPath = resolve(OUT_DIR, 'scanned_exam_ocr.txt');
const fullText = allText.map(p => `=== PAGE ${p.page} ===\n${p.text}`).join('\n\n');
writeFileSync(textPath, fullText);
console.log(`Plain text saved to: ${textPath}`);

// Tesseract workers clean up automatically
console.log('\nDone.');
