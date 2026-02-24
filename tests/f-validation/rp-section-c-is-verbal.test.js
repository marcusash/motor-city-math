// rp-section-c-is-verbal test
// Section C questions are verbal/explanation questions
// They use text or open-ended inputs, not number or graph

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-section-c-is-verbal.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    var sectionC = (rp.questions || []).filter(function(q) { return q.section === 'C'; });
    sectionC.forEach(function(q) {
        var hasOnlyGraphInputs = (q.inputs || []).every(function(inp) { return inp.type === 'graph'; });
        if (hasOnlyGraphInputs && q.inputs && q.inputs.length > 0) {
            violations.push(q.id + ': section C has only graph inputs (expected text/verbal)');
        }
    });
}

test('Section C questions are not graph-only (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-section-c-is-verbal: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
