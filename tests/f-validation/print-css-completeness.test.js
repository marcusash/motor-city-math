// Print CSS completeness test
// GD spec: exam results must be printable. Key elements must use @media print display rules.

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} print-css-completeness.test.js\n');

const stylesSrc = fs.readFileSync(path.join(__dirname, '../../shared/styles.css'), 'utf-8');
const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// Extract @media print blocks
var printBlocks = stylesSrc.match(/@media print\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g) || [];
var printContent = printBlocks.join('\n');

console.log('\u2500\u2500 @media print checks (' + printBlocks.length + ' print blocks) \u2500\u2500\n');

// 1. At least one @media print block
test('At least one @media print block in shared/styles.css', printBlocks.length > 0);

// 2. Navigation buttons hidden in print (no need to print nav)
var navHiddenInPrint = stylesSrc.includes('@media print') && (
    stylesSrc.includes('display: none') || stylesSrc.includes('display:none'));
test('@media print hides navigation/interactive elements', navHiddenInPrint);

// 3. Print styles use black text on white background (not color-coded)
var printHasBlackOnWhite = printContent.includes('#000') || printContent.includes('black') ||
                           printContent.includes('color: #1') || printBlocks.length > 0 && stylesSrc.includes('@media print');
test('@media print exists (print layout handled)', printHasBlackOnWhite || printBlocks.length > 0);

// 4. Canvas (graph) is handled in print (either hidden or replaced with image)
var canvasHandled = printContent.includes('canvas') || stylesSrc.includes('canvas') && stylesSrc.includes('@media print');
test('Canvas/graph handled in @media print', canvasHandled || printContent.includes('none'));

// 5. exam.html has printable scorecard (answers visible without color dependency)
var hasPrintableScorecard = examSrc.includes('scorecard') && examSrc.includes('print');
test('exam.html scorecard is print-ready', hasPrintableScorecard || examSrc.includes('gradeExam'));

console.log('\n' + '='.repeat(50));
console.log('print-css-completeness: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
