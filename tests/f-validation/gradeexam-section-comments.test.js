// Static analysis: gradeExam() 5-section comment structure
// Guards: section comments must all be present, in order

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} gradeexam-section-comments.test.js\n');

const src = fs.readFileSync(path.join(__dirname, '../../exam.html'), 'utf-8');

// ── All 5 sections present ─────────────────────────────────────
console.log('\u2500\u2500 Section comment presence \u2500\u2500');
test('SECTION 1 present', src.includes('== SECTION 1:'));
test('SECTION 2 present', src.includes('== SECTION 2:'));
test('SECTION 3 present', src.includes('== SECTION 3:'));
test('SECTION 4 present', src.includes('== SECTION 4:'));
test('SECTION 5 present', src.includes('== SECTION 5:'));

// ── Ordering: each section must follow the previous ────────────
console.log('\n\u2500\u2500 Section ordering \u2500\u2500');
var positions = [1, 2, 3, 4, 5].map(function(n) { return src.indexOf('== SECTION ' + n + ':'); });
test('SECTION 1 before SECTION 2', positions[0] < positions[1]);
test('SECTION 2 before SECTION 3', positions[1] < positions[2]);
test('SECTION 3 before SECTION 4', positions[2] < positions[3]);
test('SECTION 4 before SECTION 5', positions[3] < positions[4]);
test('All 5 sections inside gradeExam()', (function() {
    var gradeStart = src.indexOf('function gradeExam(');
    // Find closing brace of gradeExam (not perfect but close enough)
    var gradeEnd = src.indexOf('\n    function ', gradeStart + 100);
    if (gradeEnd === -1) gradeEnd = gradeStart + 8000;
    return positions.every(function(p) { return p > gradeStart && p < gradeEnd; });
})());

// ── Pure helpers present (delegation from sections) ────────────
console.log('\n\u2500\u2500 Delegated pure helpers \u2500\u2500');
test('evaluateNumberInputs() defined', src.includes('function evaluateNumberInputs('));
test('findMissingInputLabels() defined', src.includes('function findMissingInputLabels('));

console.log('\n' + '='.repeat(50));
console.log('gradeexam-section-comments: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
