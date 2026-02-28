// RP answer tolerance test
// All numeric answer objects must have tolerance > 0
// tolerance = 0 means exact float match which is fragile (floating point errors)
// Standard tolerance: 0.01 for most, 0.001 for precise decimals

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-tolerance-positive.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var numericInputs = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        (rp.questions || []).forEach(function(q) {
            (q.inputs || []).forEach(function(inp) {
                if (inp.type === 'number' || typeof inp.answer === 'number') {
                    numericInputs.push({ file: 'rp' + i, qid: q.id, inp: inp });
                }
            });
        });
    }
}

console.log('\u2500\u2500 Tolerance checks (' + numericInputs.length + ' numeric inputs) \u2500\u2500\n');

test('Numeric inputs found', numericInputs.length > 0);

// All numeric inputs have tolerance field
var noTolerance = numericInputs.filter(function(inp) {
    return inp.inp.tolerance === undefined || inp.inp.tolerance === null;
});
if (noTolerance.length) noTolerance.slice(0,3).forEach(function(inp) { console.log('  ! missing tolerance: ' + inp.file + ' ' + inp.qid + ' ' + inp.inp.id); });
test('All numeric inputs have tolerance field', noTolerance.length === 0);

// All tolerances are > 0
var zeroTol = numericInputs.filter(function(inp) {
    return inp.inp.tolerance !== undefined && inp.inp.tolerance <= 0;
});
if (zeroTol.length) zeroTol.slice(0,3).forEach(function(inp) { console.log('  ! zero/negative tolerance: ' + inp.file + ' ' + inp.qid + ' tol=' + inp.inp.tolerance); });
test('All tolerances are > 0 (no exact float match required)', zeroTol.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-tolerance-positive: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
