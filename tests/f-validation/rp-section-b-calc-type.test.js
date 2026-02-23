// rp-section-b-calc-type test
// Section B questions should be calculation-type (not just identification)
// Section B tests Kai's ability to apply formulas

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-b-calc-type.test.js\n');

var dataDir = path.join(__dirname, '../../data');
// Types that are calculation-based (not just identify/recognize)
var CALC_TYPES = ['exponential', 'quadratic', 'radical', 'rational', 'fractional-exp', 'extraneous',
                  'graph', 'write-equation', 'absolute-value', 'multiple-choice', 'word-problem',
                  'construct', 'error-analysis'];

var hasCalcInB = 0, examsChecked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(require('path').join(__dirname, '../../data'), 'retake-practice-' + i + '.json');
    if (!require('fs').existsSync(f)) continue;
    var rp = JSON.parse(require('fs').readFileSync(f, 'utf-8'));
    examsChecked++;
    var sectionB = (rp.questions || []).filter(function(q) { return q.section === 'B'; });
    var hasCalc = sectionB.some(function(q) { return CALC_TYPES.indexOf(q.type) !== -1; });
    if (hasCalc) hasCalcInB++;
    else console.log('  rp' + i + ': Section B types: ' + sectionB.map(function(q){return q.type;}).join(', '));
}

console.log('\u2500\u2500 Section B calculation type checks \u2500\u2500\n');

test('All exams checked (' + examsChecked + '/11)', examsChecked === 11);
test('Section B has calculation-type questions in all exams (' + hasCalcInB + '/11)', hasCalcInB === examsChecked);

console.log('\n' + '='.repeat(50));
console.log('rp-section-b-calc-type: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
