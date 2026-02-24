// rp-input-id-matches-question test
// Each input ID in an RP exam must start with the question's ID prefix
// e.g. question rp1-q3 must have inputs like rp1-q3_answer, not rp2-q3_answer

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-input-id-matches-question.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (!fs.existsSync(f)) continue;
    var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
    (rp.questions || []).forEach(function(q) {
        // Input IDs use short form: q{N}_field (without rpN- prefix)
        // Extract the qN part from the question ID (e.g., rp1-q3 -> q3)
        var qPart = q.id.replace(/^rp\d+-/, ''); // "q3"
        (q.inputs || []).forEach(function(inp) {
            if (inp.id && !inp.id.startsWith(qPart)) {
                violations.push(inp.id + ' does not start with ' + qPart + ' (question ' + q.id + ')');
            }
        });
    });
}

test('All input IDs start with their question ID prefix (' + violations.length + ' violations)', violations.length === 0);
if (violations.length) violations.slice(0, 5).forEach(function(v) { console.log('    ! ' + v); });

console.log('\n' + '='.repeat(50));
console.log('rp-input-id-matches-question: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
