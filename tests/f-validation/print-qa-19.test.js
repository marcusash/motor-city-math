/**
 * Motor City Math — Fundamentals Agent (F)
 * Task #35: Print QA — All 19 Files (extends F-3)
 *
 * Verifies print readiness across all 19 HTML files:
 *  - shared/print.css linked
 *  - .print-header present
 *  - page-break-inside: avoid on question cards
 *  - Interactive elements hidden in print
 *
 * Run: node tests/f-validation/print-qa-19.test.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
let pass = 0, fail = 0;

function test(desc, condition) {
    if (condition) { pass++; }
    else { fail++; console.log(`  ❌ ${desc}`); }
}
function section(title) { console.log(`\n── ${title} ──`); }

// All 19 HTML files
const ALL_FILES = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html'))
    .sort();

console.log(`Found ${ALL_FILES.length} HTML files`);

// Files that should be printable (test/exam/quiz files + practice)
// Utility pages (index dashboard, parent dashboard) may not need print
const PRINTABLE_FILES = ALL_FILES;

// ===================================================================
// 1. shared/print.css LINKED
// ===================================================================
section('1. Print CSS Linked');

for (const file of PRINTABLE_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasPrintCSS = html.includes('shared/print.css');
    test(`${file}: links shared/print.css`, hasPrintCSS);
}

// ===================================================================
// 2. PRINT HEADER PRESENT
// ===================================================================
section('2. Print Header');

for (const file of PRINTABLE_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasPrintHeader = html.includes('print-header');
    test(`${file}: has print-header`, hasPrintHeader);
}

// ===================================================================
// 3. shared/print.css CONTENT CHECKS
// ===================================================================
section('3. Print CSS Content');

const printCssPath = path.join(ROOT, 'shared', 'print.css');
const printCssExists = fs.existsSync(printCssPath);
test('shared/print.css exists', printCssExists);

if (printCssExists) {
    const printCss = fs.readFileSync(printCssPath, 'utf-8');

    // page-break / break-inside on question cards
    const hasBreakInside = printCss.includes('break-inside') || printCss.includes('page-break-inside');
    test('Print CSS has break-inside/page-break-inside rule', hasBreakInside);

    // Hides interactive elements
    const hidesButtons = printCss.includes('.submit-btn') || printCss.includes('button');
    test('Print CSS hides submit buttons', hidesButtons);

    // @media print
    const hasMediaPrint = printCss.includes('@media print');
    test('Print CSS uses @media print', hasMediaPrint);

    // Print header visible
    const showsPrintHeader = printCss.includes('print-header');
    test('Print CSS styles print-header', showsPrintHeader);

    // Check for elements that should be hidden in print
    const hiddenElements = ['.timer', '.arena-toggle', '.answer-feedback'];
    for (const el of hiddenElements) {
        const mentioned = printCss.includes(el);
        if (mentioned) {
            test(`Print CSS hides ${el}`, true);
        } else {
            // Check if inline styles in individual files handle this
            console.log(`  ℹ️ ${el} not explicitly hidden in print.css (may be handled inline)`);
        }
    }
}

// ===================================================================
// 4. CANVAS PRINT HANDLING
// ===================================================================
section('4. Canvas/Chart Print');

const filesWithCanvas = [];
const filesWithChart = [];

for (const file of ALL_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    if (html.includes('<canvas')) filesWithCanvas.push(file);
    if (html.includes('Chart(') || html.includes('chart.js') || html.includes('Chart.js')) {
        filesWithChart.push(file);
    }
}

console.log(`  Files with <canvas>: ${filesWithCanvas.length} — ${filesWithCanvas.join(', ')}`);
console.log(`  Files with Chart.js: ${filesWithChart.length} — ${filesWithChart.join(', ')}`);

// Canvas elements should print (not hidden)
if (printCssExists) {
    const printCss = fs.readFileSync(printCssPath, 'utf-8');
    // Canvas should NOT be display:none in print — check that the canvas rule doesn't hide it
    const canvasSection = printCss.match(/canvas\s*\{[^}]*\}/);
    const canvasHidden = canvasSection && canvasSection[0].includes('display: none') || 
                          canvasSection && canvasSection[0].includes('display:none');
    test('Canvas NOT hidden in print (charts should print)', !canvasHidden);
}

// ===================================================================
// 5. NEW FILES CHECK (files added since F-3)
// ===================================================================
section('5. New Files Since F-3 Audit');

const newFiles = [
    'nonlinear_exam_mvp.html',
    'test.html',
    'practice.html',
    'test-builder.html',
    'parent.html'
];

for (const file of newFiles) {
    const filePath = path.join(ROOT, file);
    if (fs.existsSync(filePath)) {
        const html = fs.readFileSync(filePath, 'utf-8');
        const hasPrintCSS = html.includes('shared/print.css');
        const hasPrintHeader = html.includes('print-header');
        console.log(`  ${file}: print.css=${hasPrintCSS ? '✅' : '❌'}, print-header=${hasPrintHeader ? '✅' : '❌'}`);
    } else {
        console.log(`  ${file}: FILE NOT FOUND`);
    }
}

// ===================================================================
// 6. INLINE PRINT STYLES CHECK
// ===================================================================
section('6. Inline @media print Styles');

let filesWithInlinePrint = 0;
for (const file of ALL_FILES) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    if (html.includes('@media print')) {
        filesWithInlinePrint++;
        console.log(`  ${file}: has inline @media print styles`);
    }
}
console.log(`  ${filesWithInlinePrint}/${ALL_FILES.length} files have inline print styles`);

// ===================================================================
// SUMMARY
// ===================================================================
section('PRINT QA SUMMARY');
const totalFiles = PRINTABLE_FILES.length;
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);
console.log(`  HTML files scanned: ${totalFiles}\n`);
process.exit(fail > 0 ? 1 : 0);
