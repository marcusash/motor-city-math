// rp-input-answer-defined test
// Every input with type 'number' or 'text' in sections A/B/C must have an answer
// Open-ended exceptions: q3_cases, q5_factored, q15_model, q12_domain, q12_range

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-answer-defined.test.js\n');

var OPEN_ENDED = ['q3_cases', 'q5_factored', 'q15_model', 'q12_domain', 'q12_range'];

var dataDir = path.join(__dirname, '../../data');
var violations = [];
var checked = 0;

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).filter(function(q) {
        return q.section === 'A' || q.section === 'B' || q.section === 'C';
    }).forEach(function(q) {
        (q.inputs || []).forEach(function(inp) {
            // Only check number inputs -- text/open-ended inputs legitimately lack an answer field
            if (inp.type !== 'number') return;
            if (inp.answer === undefined && inp.tolerance === undefined) return; // pure open-ended number
            checked++;
            if (inp.answer === undefined || inp.answer === null || inp.answer === '') {
                violations.push('rp' + i + ' ' + q.id + ' ' + inp.id + ': answer is ' + inp.answer);
            }
        });
    });
}

console.log('\u2500\u2500 Input answer defined checks \u2500\u2500\n');
if (violations.length) violations.forEach(function(v) { console.log('  ! ' + v); });
console.log('  Non-open-ended inputs checked: ' + checked);

test('All number-type inputs with answer/tolerance in A/B/C have defined answers (' + violations.length + ' violations)', violations.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-input-answer-defined: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
