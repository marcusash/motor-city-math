// RP inputs have id field test
// Every input object in all RP JSON files must have a non-empty id field
// Regression guard: missing IDs cause grading to silently fail

const fs = require('fs');
const path = require('path');

let pass = 0, fail = 0;
function test(name, result) {
    if (result) { console.log('  \u2705 ' + name); pass++; }
    else        { console.log('  \u274c ' + name); fail++; }
}

console.log('\u{1F3C0} rp-inputs-have-id.test.js\n');

var dataDir = path.join(__dirname, '../../data');
var allInputs = [];
var violations = [];

for (var i = 1; i <= 11; i++) {
    var f = path.join(dataDir, 'retake-practice-' + i + '.json');
    if (fs.existsSync(f)) {
        var rp = JSON.parse(fs.readFileSync(f, 'utf-8'));
        (rp.questions || []).forEach(function(q) {
            (q.inputs || []).forEach(function(inp, idx) {
                allInputs.push({ file: 'rp' + i, qid: q.id, inp: inp, idx: idx });
                if (!inp.id || String(inp.id).trim().length === 0) {
                    violations.push('rp' + i + ' ' + q.id + ' input[' + idx + ']: missing id');
                }
            });
        });
    }
}

console.log('\u2500\u2500 Input id field checks (' + allInputs.length + ' total inputs) \u2500\u2500\n');

test('All 11 RP files loaded', allInputs.length > 0);

if (violations.length) violations.slice(0,5).forEach(function(v) { console.log('  ! ' + v); });
test('All input objects have non-empty id field', violations.length === 0);

// All input IDs start with q and are non-trivially namespaced
// Single-input questions may use bare q{N}, multi-input must use q{N}_{field}
var badFormat = allInputs.filter(function(inp) {
    var id = String(inp.inp.id || '');
    return !id.match(/^q\d/); // must start with q followed by a digit
});
if (badFormat.length) badFormat.slice(0,3).forEach(function(inp) { console.log('  ! bad id format: ' + inp.file + ' ' + inp.qid + ' id=' + inp.inp.id); });
test('All input ids start with q{N} (valid namespace pattern)', badFormat.length === 0);

console.log('\n' + '='.repeat(50));
console.log('rp-inputs-have-id: ' + (pass+fail) + ' checks, ' + pass + ' pass, ' + fail + ' fail');
if (fail === 0) { console.log('PASS'); process.exit(0); }
else            { console.log('FAIL'); process.exit(1); }
