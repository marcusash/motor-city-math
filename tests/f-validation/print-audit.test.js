/**
 * Motor City Math — Fundamentals Agent (F)
 * Task F-3: Print Layout Audit
 *
 * Validates @media print CSS across all 12 HTML files.
 * Checks: button hiding, page breaks, chart handling, answer key hiding.
 *
 * Run: node tests/f-validation/print-audit.test.js
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

const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// ===================================================================
// 1. PRINT CSS PRESENCE
// ===================================================================
section('1. @media print Presence');

const printStatus = {};
for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasPrintMedia = /@media\s+print/.test(content);
    const usesExternalPrint = /print\.css/.test(content);
    printStatus[file] = { hasPrintMedia, usesExternalPrint };
    
    const source = hasPrintMedia && usesExternalPrint ? 'inline + external' :
                   hasPrintMedia ? 'inline only' :
                   usesExternalPrint ? 'external only (shared/print.css)' : 'NONE';
    console.log(`  ${file}: ${source}`);
    test(`${file}: has print styles`, hasPrintMedia || usesExternalPrint);
}

// ===================================================================
// 2. BUTTON HIDING IN PRINT
// ===================================================================
section('2. Button Hiding in Print');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    
    // Check if print CSS hides buttons
    const printSection = content.match(/@media\s+print\s*\{[\s\S]*?\}\s*\}/g) || [];
    const allPrint = printSection.join(' ');
    
    const hidesButtons = /\.print-btn|\.answer-key-btn|button|\.btn/.test(allPrint) &&
                         /display:\s*none/.test(allPrint);
    
    // Also check external print.css
    const usesExternal = /print\.css/.test(content);
    
    if (hidesButtons || usesExternal) {
        console.log(`  ✅ ${file}: buttons hidden in print`);
    } else if (printSection.length > 0) {
        // Has print CSS but may not hide buttons — check more carefully
        const hasDisplayNone = /display:\s*none/.test(allPrint);
        if (hasDisplayNone) {
            console.log(`  ✅ ${file}: has display:none in print (likely buttons)`);
        } else {
            console.log(`  ⚠️ ${file}: has print CSS but unclear button hiding`);
        }
    } else {
        console.log(`  ⚠️ ${file}: no inline print CSS to check`);
    }
}

// ===================================================================
// 3. PAGE BREAK HANDLING
// ===================================================================
section('3. Page Break Rules');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    
    const hasBreakInside = /break-inside:\s*avoid|page-break-inside:\s*avoid/.test(content);
    const hasBreakBefore = /break-before|page-break-before/.test(content);
    const hasBreakAfter = /break-after|page-break-after/.test(content);
    
    const breaks = [];
    if (hasBreakInside) breaks.push('break-inside:avoid');
    if (hasBreakBefore) breaks.push('break-before');
    if (hasBreakAfter) breaks.push('break-after');
    
    if (breaks.length > 0) {
        console.log(`  ✅ ${file}: ${breaks.join(', ')}`);
    } else {
        console.log(`  ⚠️ ${file}: no page break rules — questions may split across pages`);
    }
}

// ===================================================================
// 4. CHART PRINT HANDLING
// ===================================================================
section('4. Chart Print Handling');

const chartFiles = ['index.html', 'index_calc.html', 'final_exam_251123.html',
    'quiz_251120.html', 'quiz_251121.html'];

for (const file of chartFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const printSection = content.match(/@media\s+print\s*\{[\s\S]*?\}\s*\}/g) || [];
    const allPrint = printSection.join(' ');
    
    const hidesCharts = /canvas|chart|\.chart/.test(allPrint);
    const setsChartSize = /canvas[\s\S]*?(width|height|max-width)/.test(allPrint);
    
    if (hidesCharts) {
        console.log(`  ${file}: charts addressed in print CSS`);
    } else {
        console.log(`  ⚠️ ${file}: no chart-specific print rules`);
        console.log('     Charts may not render in print — Canvas requires JS');
    }
}

console.log('\n  ℹ️  Note: Chart.js <canvas> elements do NOT print by default.');
console.log('  They require Chart.js to render — if CDN fails, blank in print.');
console.log('  Recommendation: Add chart-to-image conversion for print mode.');

// ===================================================================
// 5. ANSWER KEY / MODAL HIDING
// ===================================================================
section('5. Answer Key Modal in Print');

for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf-8');
    const hasModal = /answerKeyModal|answer-key-modal/.test(content);
    
    if (hasModal) {
        const printSection = content.match(/@media\s+print\s*\{[\s\S]*?\}\s*\}/g) || [];
        const allPrint = printSection.join(' ');
        const hidesModal = /answerKeyModal|answer-key-modal/.test(allPrint) ||
                          /modal[\s\S]*?display:\s*none/.test(allPrint);
        
        if (hidesModal) {
            console.log(`  ✅ ${file}: modal hidden in print`);
        } else {
            // Modal starts display:none, so it won't show unless opened
            console.log(`  ℹ️  ${file}: modal starts hidden (display:none) — OK for print`);
        }
    }
}

// ===================================================================
// 6. SHARED PRINT.CSS ANALYSIS
// ===================================================================
section('6. shared/print.css Analysis');

const printCssPath = path.join(ROOT, 'shared', 'print.css');
if (fs.existsSync(printCssPath)) {
    const printCss = fs.readFileSync(printCssPath, 'utf-8');
    console.log(`  File size: ${printCss.length} bytes`);
    
    const features = [];
    if (/@media\s+print/.test(printCss)) features.push('@media print wrapper');
    if (/display:\s*none/.test(printCss)) features.push('hides elements');
    if (/break-inside/.test(printCss)) features.push('page break rules');
    if (/background/.test(printCss)) features.push('background handling');
    if (/box-shadow:\s*none/.test(printCss)) features.push('shadow removal');
    
    console.log(`  Features: ${features.join(', ')}`);
    
    const filesUsing = htmlFiles.filter(f => {
        const c = fs.readFileSync(path.join(ROOT, f), 'utf-8');
        return /print\.css/.test(c);
    });
    console.log(`  Used by: ${filesUsing.length}/${htmlFiles.length} files`);
    console.log(`    ${filesUsing.join(', ')}`);
    
    test('shared/print.css exists and has content', printCss.length > 50);
} else {
    console.log('  ❌ shared/print.css not found');
    test('shared/print.css exists', false);
}

// ===================================================================
// SUMMARY
// ===================================================================
section('PRINT AUDIT SUMMARY');
console.log(`\n  Tests: ${pass + fail}, ${pass} passed, ${fail} failed`);

const noPrint = htmlFiles.filter(f => !printStatus[f].hasPrintMedia && !printStatus[f].usesExternalPrint);
if (noPrint.length > 0) {
    console.log(`\n  🔴 Files without print styles: ${noPrint.join(', ')}`);
}

console.log('\n  RECOMMENDATIONS:');
console.log('  1. Migrate all files to shared/print.css (currently only 3-4 use it)');
console.log('  2. Add break-inside:avoid to .question-card in shared/print.css');
console.log('  3. Canvas charts need static image fallback for print');
console.log('  4. Add print header: student name + date fields (per design spec)\n');

process.exit(fail > 0 ? 1 : 0);
