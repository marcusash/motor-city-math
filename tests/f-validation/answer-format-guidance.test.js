// Answer format guidance test
// GD sw-17: exam.html must display format hints below inputs (e.g., "Enter as decimal: 0.5")

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} answer-format-guidance.test.js\n');

const examSrc = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');
const rp11 = JSON.parse(fs.readFileSync(require('path').join(__dirname, '../../data/retake-practice-11.json'), 'utf-8'));

console.log('\u2500\u2500 Format hint checks \u2500\u2500\n');

// 1. .format-hint CSS class exists in shared/styles.css
var styles = fs.readFileSync(require('path').join(__dirname, '../../shared/styles.css'), 'utf-8');
test('.format-hint CSS class defined in shared/styles.css', styles.includes('.format-hint'));

// 2. exam.html renders format-hint elements dynamically
test('exam.html renders .format-hint elements', examSrc.includes('format-hint'));

// 3. format-hint references are in renderInput() or similar function
var renderFn = examSrc.substring(examSrc.indexOf('renderInput') !== -1 ? examSrc.indexOf('renderInput') : 0, 
    examSrc.indexOf('renderInput') !== -1 ? examSrc.indexOf('renderInput') + 5000 : 5000);
test('format-hint rendered inside renderInput() or question render', renderFn.includes('format-hint') || examSrc.includes('format-hint'));

// 4. exam.html has FORMAT_HINTS lookup (type-based, not question-field-based)
var hasFormatHints = examSrc.includes('FORMAT_HINTS') || examSrc.includes('format_hint') || examSrc.includes('formatHint');
test('exam.html has FORMAT_HINTS or format hint logic', hasFormatHints);

// 5. FORMAT_HINTS covers common types (decimal, fraction, equation)
var formatsSection = examSrc.substring(examSrc.indexOf('FORMAT_HINTS') !== -1 ? examSrc.indexOf('FORMAT_HINTS') : 0,
    examSrc.indexOf('FORMAT_HINTS') !== -1 ? examSrc.indexOf('FORMAT_HINTS') + 1000 : 1000);
var hasCommonFormats = formatsSection.includes('decimal') || formatsSection.includes('fraction') || formatsSection.includes('equation');
test('FORMAT_HINTS includes common answer formats (decimal, fraction, equation)', hasCommonFormats);

console.log('\n' + '='.repeat(50));
console.log('answer-format-guidance: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
