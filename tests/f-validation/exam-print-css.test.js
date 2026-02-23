// Static check: exam.html print styles hide non-print elements
// Guards against regression of @media print block

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} exam-print-css.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── @media print block presence ────────────────────────────────
console.log('\u2500\u2500 @media print block \u2500\u2500');
test('@media print block present', src.includes('@media print'));

// Extract all content inside @media print blocks
var printBlocks = [];
var re = /@media print[^{]*\{([^}]+)\}/g;
var m;
while ((m = re.exec(src)) !== null) printBlocks.push(m[0]);
var printCSS = printBlocks.join(' ');
test('at least one @media print rule found', printBlocks.length >= 1);

// ── Key elements hidden in print ───────────────────────────────
console.log('\n\u2500\u2500 Key elements hidden in print \u2500\u2500');
test('.hint-btn hidden in print', printCSS.includes('.hint-btn') && printCSS.includes('display: none'));
test('.graph-controls hidden in print', printCSS.includes('.graph-controls'));
test('.submit-area hidden in print', printCSS.includes('.submit-area'));
test('.nav-bar hidden in print', printCSS.includes('.nav-bar'));
test('.header-back hidden in print', printCSS.includes('.header-back'));

// ── !important used for print overrides ───────────────────────
console.log('\n\u2500\u2500 !important override \u2500\u2500');
test('!important used in print block', printCSS.includes('!important'));

console.log('\n' + '='.repeat(50));
console.log('exam-print-css: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
